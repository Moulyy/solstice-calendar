export type CalendarDate = `${number}-${number}-${number}`
export type LocalTime = `${number}:${number}`
export type LocalDateTime = `${number}-${number}-${number}T${number}:${number}`

export type DateParts = { y: number; m: number; d: number }
export type TimeParts = { h: number; min: number }

const CALENDAR_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/
const LOCAL_TIME_RE = /^(\d{2}):(\d{2})$/
const LOCAL_DATE_TIME_RE =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/

/** Parses a decimal string using base 10. */
const toInt = (value: string): number => Number.parseInt(value, 10)

/**
 * Returns true when the Gregorian year is leap
 * (divisible by 4 except centuries not divisible by 400).
 */
const isLeapYear = (year: number): boolean => {
  if (year % 400 === 0) {
    return true
  }

  if (year % 100 === 0) {
    return false
  }

  return year % 4 === 0
}

/** Returns the number of days for a given year/month pair (month is 1-12). */
const getDaysInMonth = (year: number, month: number): number => {
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28
  }

  if ([4, 6, 9, 11].includes(month)) {
    return 30
  }

  return 31
}

/** Validates calendar date parts with explicit month/day bounds and leap-year rules. */
const isValidDateParts = ({ y, m, d }: DateParts): boolean => {
  if (!Number.isInteger(y) || y < 0 || y > 9999) {
    return false
  }

  if (!Number.isInteger(m) || m < 1 || m > 12) {
    return false
  }

  if (!Number.isInteger(d) || d < 1) {
    return false
  }

  return d <= getDaysInMonth(y, m)
}

/** Validates time parts with 24-hour clock bounds: 00-23 for hours and 00-59 for minutes. */
const isValidTimeParts = ({ h, min }: TimeParts): boolean => {
  if (!Number.isInteger(h) || h < 0 || h > 23) {
    return false
  }

  if (!Number.isInteger(min) || min < 0 || min > 59) {
    return false
  }

  return true
}

/** Zero-pads a number to 2 digits. */
const pad2 = (value: number): string => value.toString().padStart(2, "0")

/** Zero-pads a number to 4 digits. */
const pad4 = (value: number): string => value.toString().padStart(4, "0")

/** Extracts date parts from a strict YYYY-MM-DD string. Returns null when format does not match. */
const getCalendarMatchParts = (input: string): DateParts | null => {
  const match = CALENDAR_DATE_RE.exec(input)
  if (!match) {
    return null
  }

  const year = match[1]
  const month = match[2]
  const day = match[3]

  if (!year || !month || !day) {
    return null
  }

  return {
    y: toInt(year),
    m: toInt(month),
    d: toInt(day)
  }
}

/** Extracts time parts from a strict HH:mm string. Returns null when format does not match. */
const getTimeMatchParts = (input: string): TimeParts | null => {
  const match = LOCAL_TIME_RE.exec(input)
  if (!match) {
    return null
  }

  const hour = match[1]
  const minute = match[2]

  if (!hour || !minute) {
    return null
  }

  return {
    h: toInt(hour),
    min: toInt(minute)
  }
}

/**
 * Parses a strict calendar date string (YYYY-MM-DD).
 * Returns null for invalid format or out-of-range values.
 */
export const parseCalendarDate = (input: string): CalendarDate | null => {
  const parts = getCalendarMatchParts(input)
  if (!parts || !isValidDateParts(parts)) {
    return null
  }

  return input as CalendarDate
}

/**
 * Formats validated date parts into YYYY-MM-DD.
 * Returns null when date parts are out of bounds.
 */
export const formatCalendarDate = (parts: DateParts): CalendarDate | null => {
  if (!isValidDateParts(parts)) {
    return null
  }

  return `${pad4(parts.y)}-${pad2(parts.m)}-${pad2(parts.d)}` as CalendarDate
}

/**
 * Converts a CalendarDate to numeric parts.
 * Throws only if the provided value is not structurally valid.
 */
export const toDateParts = (date: CalendarDate): DateParts => {
  const parts = getCalendarMatchParts(date)
  if (!parts) {
    throw new Error("Invalid CalendarDate")
  }

  return parts
}

/** Alias for formatting date parts into CalendarDate. */
export const fromDateParts = (parts: DateParts): CalendarDate | null => {
  return formatCalendarDate(parts)
}

/**
 * Parses a strict local time string (HH:mm).
 * Returns null for invalid format or out-of-range values.
 */
export const parseLocalTime = (input: string): LocalTime | null => {
  const parts = getTimeMatchParts(input)
  if (!parts || !isValidTimeParts(parts)) {
    return null
  }

  return input as LocalTime
}

/**
 * Formats validated time parts into HH:mm.
 * Returns null when hour/minute values are out of bounds.
 */
export const formatLocalTime = (parts: TimeParts): LocalTime | null => {
  if (!isValidTimeParts(parts)) {
    return null
  }

  return `${pad2(parts.h)}:${pad2(parts.min)}` as LocalTime
}

/**
 * Converts a LocalTime to numeric parts.
 * Throws only if the provided value is not structurally valid.
 */
export const toTimeParts = (time: LocalTime): TimeParts => {
  const parts = getTimeMatchParts(time)
  if (!parts) {
    throw new Error("Invalid LocalTime")
  }

  return parts
}

/** Alias for formatting time parts into LocalTime. */
export const fromTimeParts = (parts: TimeParts): LocalTime | null => {
  return formatLocalTime(parts)
}

/**
 * Parses a strict local datetime string (YYYY-MM-DDTHH:mm).
 * Returns null when date or time segments are invalid.
 */
export const parseLocalDateTime = (input: string): LocalDateTime | null => {
  const match = LOCAL_DATE_TIME_RE.exec(input)
  if (!match) {
    return null
  }

  const year = match[1]
  const month = match[2]
  const day = match[3]
  const hour = match[4]
  const minute = match[5]

  if (!year || !month || !day || !hour || !minute) {
    return null
  }

  const date = parseCalendarDate(`${year}-${month}-${day}`)
  const time = parseLocalTime(`${hour}:${minute}`)

  if (!date || !time) {
    return null
  }

  return input as LocalDateTime
}

/** Formats a date/time pair into a LocalDateTime string. */
export const formatLocalDateTime = (
  value: { date: CalendarDate; time: LocalTime }
): LocalDateTime => {
  return combineLocalDateTime(value.date, value.time)
}

/**
 * Splits a LocalDateTime string into its date and time components.
 * Throws only if the provided value is not structurally valid.
 */
export const splitLocalDateTime = (
  dateTime: LocalDateTime
): { date: CalendarDate; time: LocalTime } => {
  const match = LOCAL_DATE_TIME_RE.exec(dateTime)
  if (!match) {
    throw new Error("Invalid LocalDateTime")
  }

  const year = match[1]
  const month = match[2]
  const day = match[3]
  const hour = match[4]
  const minute = match[5]

  if (!year || !month || !day || !hour || !minute) {
    throw new Error("Invalid LocalDateTime")
  }

  const date = `${year}-${month}-${day}` as CalendarDate
  const time = `${hour}:${minute}` as LocalTime

  return { date, time }
}

/** Combines CalendarDate and LocalTime into YYYY-MM-DDTHH:mm. */
export const combineLocalDateTime = (
  date: CalendarDate,
  time: LocalTime
): LocalDateTime => {
  return `${date}T${time}` as LocalDateTime
}
