import type { CalendarDate, DateParts } from "@/date-time"
import { formatCalendarDate, toDateParts } from "@/date-time"
import { getDaysInMonth } from "@/internal/calendar-utils"

/** Formats validated date parts and throws when result cannot be represented as CalendarDate. */
const formatDateOrThrow = (parts: DateParts): CalendarDate => {
  const formatted = formatCalendarDate(parts)
  if (!formatted) {
    throw new Error("Invalid calendar date parts")
  }

  return formatted
}

/** Performs mathematical floor division (works correctly for negative values). */
const floorDiv = (value: number, divisor: number): number => {
  return Math.floor(value / divisor)
}

/**
 * Converts a civil date to an integer day index since 1970-01-01.
 * Algorithm adapted from Howard Hinnant's civil calendar formulas.
 */
const daysFromCivil = (year: number, month: number, day: number): number => {
  const adjustedYear = month <= 2 ? year - 1 : year
  const era = floorDiv(adjustedYear >= 0 ? adjustedYear : adjustedYear - 399, 400)
  const yoe = adjustedYear - era * 400
  const monthPrime = month > 2 ? month - 3 : month + 9
  const doy = floorDiv(153 * monthPrime + 2, 5) + day - 1
  const doe = yoe * 365 + floorDiv(yoe, 4) - floorDiv(yoe, 100) + doy
  return era * 146097 + doe - 719468
}

/**
 * Converts an integer day index since 1970-01-01 into a civil date.
 * Algorithm adapted from Howard Hinnant's civil calendar formulas.
 */
const civilFromDays = (daysSinceEpoch: number): DateParts => {
  const z = daysSinceEpoch + 719468
  const era = floorDiv(z >= 0 ? z : z - 146096, 146097)
  const doe = z - era * 146097
  const yoe = floorDiv(
    doe - floorDiv(doe, 1460) + floorDiv(doe, 36524) - floorDiv(doe, 146096),
    365
  )
  const year = yoe + era * 400
  const doy = doe - (365 * yoe + floorDiv(yoe, 4) - floorDiv(yoe, 100))
  const mp = floorDiv(5 * doy + 2, 153)
  const day = doy - floorDiv(153 * mp + 2, 5) + 1
  const month = mp < 10 ? mp + 3 : mp - 9

  return {
    y: month <= 2 ? year + 1 : year,
    m: month,
    d: day
  }
}

/** Returns week day index where 0=Sunday and 6=Saturday. */
const getWeekDayIndex = (date: CalendarDate): number => {
  const { y, m, d } = toDateParts(date)
  const dayNumber = daysFromCivil(y, m, d)
  return ((dayNumber + 4) % 7 + 7) % 7
}

/** Returns the first day (YYYY-MM-01) of the month containing the provided date. */
export const getMonthStart = (date: CalendarDate): CalendarDate => {
  const { y, m } = toDateParts(date)
  return formatDateOrThrow({ y, m, d: 1 })
}

/** Returns the last day of the month containing the provided date. */
export const getMonthEnd = (date: CalendarDate): CalendarDate => {
  const { y, m } = toDateParts(date)
  return formatDateOrThrow({ y, m, d: getDaysInMonth(y, m) })
}

/**
 * Adds calendar months and clamps the day to the last valid day of the target month.
 * Example: 2024-01-31 + 1 month => 2024-02-29.
 */
export const addMonths = (date: CalendarDate, months: number): CalendarDate => {
  const { y, m, d } = toDateParts(date)
  const absoluteMonths = y * 12 + (m - 1) + months
  const nextYear = floorDiv(absoluteMonths, 12)
  const nextMonth = absoluteMonths - nextYear * 12 + 1
  const nextDay = Math.min(d, getDaysInMonth(nextYear, nextMonth))

  return formatDateOrThrow({ y: nextYear, m: nextMonth, d: nextDay })
}

/** Adds a day offset (positive or negative) to a CalendarDate. */
export const addDays = (date: CalendarDate, days: number): CalendarDate => {
  const { y, m, d } = toDateParts(date)
  const nextParts = civilFromDays(daysFromCivil(y, m, d) + days)
  return formatDateOrThrow(nextParts)
}

/** Returns the first day of the week containing date for the configured week start. */
export const startOfWeek = (
  date: CalendarDate,
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6
): CalendarDate => {
  const dayIndex = getWeekDayIndex(date)
  const delta = (dayIndex - weekStartsOn + 7) % 7
  return addDays(date, -delta)
}

/**
 * Compares two CalendarDate values chronologically.
 * Returns:
 * - `-1` when `a` is before `b`
 * - `0` when `a` equals `b`
 * - `1` when `a` is after `b`
 *
 * Typical usage:
 * `dates.sort(compareCalendarDate)`
 */
export const compareCalendarDate = (
  a: CalendarDate,
  b: CalendarDate
): -1 | 0 | 1 => {
  if (a < b) {
    return -1
  }

  if (a > b) {
    return 1
  }

  return 0
}

/**
 * Builds a fixed 6x7 grid (42 dates) for the month view.
 * The grid starts at the week start that contains the first day of visible month.
 */
export const getCalendarGrid = (
  visibleMonth: CalendarDate,
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6
): CalendarDate[] => {
  const firstOfMonth = getMonthStart(visibleMonth)
  const gridStart = startOfWeek(firstOfMonth, weekStartsOn)

  return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index))
}
