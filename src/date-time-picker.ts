import {
  addDays,
  addMonths,
  getCalendarGrid as getCalendarDateGrid,
  startOfWeek
} from "@/calendar-math"
import {
  type Constraints,
  clampDateTimeToConstraints,
  clampTimeToConstraints,
  isSelectableDate,
  isSelectableDateTime,
  isSelectableTime
} from "@/constraints"
import type {
  CalendarDate,
  LocalDateTime,
  LocalTime
} from "@/date-time"
import { combineLocalDateTime, splitLocalDateTime } from "@/date-time"

/** Supported focus movement commands for the date grid. */
export type FocusMoveDirection =
  | "left"
  | "right"
  | "up"
  | "down"
  | "home"
  | "end"
  | "pageUp"
  | "pageDown"

/** Public options for the DateTimePicker core instance. */
export interface DateTimePickerOptions {
  value?: LocalDateTime | null
  defaultValue?: LocalDateTime | null
  onValueChange?: (next: LocalDateTime | null) => void

  visibleMonth?: CalendarDate
  defaultVisibleMonth?: CalendarDate
  onVisibleMonthChange?: (next: CalendarDate) => void

  time?: LocalTime | null
  defaultTime?: LocalTime | null
  onTimeChange?: (next: LocalTime | null) => void

  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  constraints?: Constraints
  nowDate?: CalendarDate
}

/** Core state shape used by selectors and consumer integrations. */
export interface DateTimePickerState {
  value: LocalDateTime | null
  selectedDate: CalendarDate | null
  selectedTime: LocalTime | null
  visibleMonth: CalendarDate
  focusedDate: CalendarDate | null
}

/** Day metadata returned by selector helpers for a specific date cell. */
export interface DayMeta {
  isSelectedDate: boolean
  isDisabledDate: boolean
  isToday: boolean
  isCurrentMonth: boolean
}

/** Time metadata returned by selector helpers for a specific time value. */
export interface TimeMeta {
  isSelectedTime: boolean
  isDisabledTime: boolean
}

/** Calendar cell metadata used by headless calendar rendering. */
export interface CalendarCellMeta {
  date: CalendarDate
  isCurrentMonth: boolean
  isSelected: boolean
  isDisabled: boolean
  isToday: boolean
}

/** DateTime metadata returned by selector helpers for a specific datetime value. */
export interface DateTimeMeta {
  isSelectedDateTime: boolean
  isDisabledDateTime: boolean
}

/** Public actions exposed by the DateTimePicker core instance. */
export interface DateTimePickerInstance {
  getState(): DateTimePickerState
  getCalendarGrid(): CalendarCellMeta[]
  getDayMeta(date: CalendarDate): DayMeta
  getTimeMeta(time: LocalTime): TimeMeta
  getDateTimeMeta(dateTime: LocalDateTime): DateTimeMeta
  setValue(next: LocalDateTime | null): void
  setDate(next: CalendarDate | null): void
  setTime(next: LocalTime | null): void
  setVisibleMonth(next: CalendarDate): void
  goToNextMonth(): void
  goToPrevMonth(): void
  focusDate(date: CalendarDate | null): void
  moveFocusDate(direction: FocusMoveDirection): void
}

const DEFAULT_VISIBLE_MONTH = "1970-01-01" as CalendarDate
const DEFAULT_TIME = "00:00" as LocalTime

/** Returns the date portion from a datetime value. */
const getDateFromDateTime = (dateTime: LocalDateTime): CalendarDate => {
  return splitLocalDateTime(dateTime).date
}

/** Returns the time portion from a datetime value. */
const getTimeFromDateTime = (dateTime: LocalDateTime): LocalTime => {
  return splitLocalDateTime(dateTime).time
}

/**
 * Normalizes a datetime candidate using configured constraints.
 * Returns undefined when value is rejected by selectability rules.
 */
const normalizeDateTimeCandidate = (
  next: LocalDateTime | null,
  constraints: Constraints
): LocalDateTime | null | undefined => {
  if (next === null) {
    return null
  }

  const clamped = clampDateTimeToConstraints(next, constraints)
  if (!isSelectableDateTime(clamped, constraints)) {
    return undefined
  }

  return clamped
}

/**
 * Normalizes a time candidate using configured constraints.
 * Returns undefined when value is rejected by selectability rules.
 */
const normalizeTimeCandidate = (
  next: LocalTime | null,
  constraints: Constraints
): LocalTime | null | undefined => {
  if (next === null) {
    return null
  }

  const clamped = clampTimeToConstraints(next, constraints.time)
  if (!isSelectableTime(clamped, constraints)) {
    return undefined
  }

  return clamped
}

/** Creates a headless DateTimePicker instance with controlled/uncontrolled state. */
export const createDateTimePicker = (
  options: DateTimePickerOptions = {}
): DateTimePickerInstance => {
  const weekStartsOn = options.weekStartsOn ?? 0
  const constraints = options.constraints ?? {}

  const isValueControlled = options.value !== undefined
  const isVisibleMonthControlled = options.visibleMonth !== undefined
  const isTimeControlled = options.time !== undefined

  const initialValueCandidate = normalizeDateTimeCandidate(
    options.value ?? options.defaultValue ?? null,
    constraints
  )

  let uncontrolledValue: LocalDateTime | null =
    initialValueCandidate === undefined ? null : initialValueCandidate

  const initialTimeCandidate = normalizeTimeCandidate(
    options.time ?? options.defaultTime ?? null,
    constraints
  )

  let uncontrolledTime: LocalTime | null =
    initialTimeCandidate === undefined ? null : initialTimeCandidate

  const initialVisibleMonth =
    options.visibleMonth ??
    options.defaultVisibleMonth ??
    (uncontrolledValue ? getDateFromDateTime(uncontrolledValue) : DEFAULT_VISIBLE_MONTH)

  let uncontrolledVisibleMonth = initialVisibleMonth

  let focusedDate: CalendarDate | null =
    uncontrolledValue ? getDateFromDateTime(uncontrolledValue) : null

  /** Returns the active datetime value according to controlled/uncontrolled mode. */
  const getCurrentValue = (): LocalDateTime | null => {
    const source = isValueControlled ? options.value ?? null : uncontrolledValue
    const normalized = normalizeDateTimeCandidate(source, constraints)
    return normalized === undefined ? null : normalized
  }

  /** Returns the active standalone time according to controlled/uncontrolled mode. */
  const getCurrentTime = (): LocalTime | null => {
    const source = isTimeControlled ? options.time ?? null : uncontrolledTime
    const normalized = normalizeTimeCandidate(source, constraints)
    return normalized === undefined ? null : normalized
  }

  /** Returns the active visible month according to controlled/uncontrolled mode. */
  const getCurrentVisibleMonth = (): CalendarDate => {
    if (isVisibleMonthControlled) {
      return options.visibleMonth ?? initialVisibleMonth
    }

    return uncontrolledVisibleMonth
  }

  /** Returns configured "today" value for deterministic meta computation. */
  const getToday = (): CalendarDate | null => {
    return options.nowDate ?? null
  }

  /** Returns true when the date is outside datetime min/max date boundaries. */
  const isDateDisabledByDateTimeBounds = (date: CalendarDate): boolean => {
    const dateTimeConstraints = constraints.dateTime
    if (!dateTimeConstraints) {
      return false
    }

    const minDate = dateTimeConstraints.min
      ? getDateFromDateTime(dateTimeConstraints.min)
      : null
    const maxDate = dateTimeConstraints.max
      ? getDateFromDateTime(dateTimeConstraints.max)
      : null

    if (minDate && date < minDate) {
      return true
    }

    if (maxDate && date > maxDate) {
      return true
    }

    return false
  }

  /** Returns true when time is incompatible with datetime min/max for the selected date. */
  const isTimeDisabledByDateTimeBounds = (time: LocalTime): boolean => {
    const dateTimeConstraints = constraints.dateTime
    if (!dateTimeConstraints) {
      return false
    }

    const currentValue = getCurrentValue()
    const selectedDate = currentValue ? getDateFromDateTime(currentValue) : null
    if (!selectedDate) {
      return false
    }

    const minSplit = dateTimeConstraints.min
      ? splitLocalDateTime(dateTimeConstraints.min)
      : null
    const maxSplit = dateTimeConstraints.max
      ? splitLocalDateTime(dateTimeConstraints.max)
      : null

    if (minSplit && selectedDate < minSplit.date) {
      return true
    }

    if (maxSplit && selectedDate > maxSplit.date) {
      return true
    }

    if (minSplit && selectedDate === minSplit.date && time < minSplit.time) {
      return true
    }

    if (maxSplit && selectedDate === maxSplit.date && time > maxSplit.time) {
      return true
    }

    return false
  }

  /** Computes day metadata from current selection, constraints and visible month. */
  const getDayMetaInternal = (date: CalendarDate): DayMeta => {
    const currentValue = getCurrentValue()
    const selectedDate = currentValue ? getDateFromDateTime(currentValue) : null
    const currentMonthKey = getCurrentVisibleMonth().slice(0, 7)
    const dayMonthKey = date.slice(0, 7)
    const today = getToday()

    return {
      isSelectedDate: selectedDate === date,
      isDisabledDate:
        !isSelectableDate(date, constraints) || isDateDisabledByDateTimeBounds(date),
      isToday: today === date,
      isCurrentMonth: currentMonthKey === dayMonthKey
    }
  }

  /** Computes time metadata from current selection and constraints. */
  const getTimeMetaInternal = (time: LocalTime): TimeMeta => {
    const currentValue = getCurrentValue()
    const selectedTime = currentValue ? getTimeFromDateTime(currentValue) : getCurrentTime()

    return {
      isSelectedTime: selectedTime === time,
      isDisabledTime:
        !isSelectableTime(time, constraints) || isTimeDisabledByDateTimeBounds(time)
    }
  }

  /** Computes datetime metadata from current selection and constraints. */
  const getDateTimeMetaInternal = (dateTime: LocalDateTime): DateTimeMeta => {
    const currentValue = getCurrentValue()

    return {
      isSelectedDateTime: currentValue === dateTime,
      isDisabledDateTime: !isSelectableDateTime(dateTime, constraints)
    }
  }

  /** Computes the current state snapshot from controlled/uncontrolled values. */
  const readState = (): DateTimePickerState => {
    const value = getCurrentValue()
    const split = value ? splitLocalDateTime(value) : null
    const standaloneTime = getCurrentTime()

    return {
      value,
      selectedDate: split ? split.date : null,
      selectedTime: split ? split.time : standaloneTime,
      visibleMonth: getCurrentVisibleMonth(),
      focusedDate
    }
  }

  /** Applies datetime updates while respecting controlled/uncontrolled semantics. */
  const applyValue = (next: LocalDateTime | null): void => {
    const normalized = normalizeDateTimeCandidate(next, constraints)
    if (normalized === undefined) {
      return
    }

    if (!isValueControlled) {
      uncontrolledValue = normalized
    }

    options.onValueChange?.(normalized)
  }

  /** Applies time updates while respecting controlled/uncontrolled semantics. */
  const applyTime = (next: LocalTime | null): void => {
    const normalized = normalizeTimeCandidate(next, constraints)
    if (normalized === undefined) {
      return
    }

    if (!isTimeControlled) {
      uncontrolledTime = normalized
    }

    options.onTimeChange?.(normalized)
  }

  return {
    getState: () => readState(),

    getCalendarGrid: () => {
      const state = readState()
      const dates = getCalendarDateGrid(state.visibleMonth, weekStartsOn)

      return dates.map((date) => {
        const dayMeta = getDayMetaInternal(date)

        return {
          date,
          isCurrentMonth: dayMeta.isCurrentMonth,
          isSelected: dayMeta.isSelectedDate,
          isDisabled: dayMeta.isDisabledDate,
          isToday: dayMeta.isToday
        }
      })
    },

    getDayMeta: (date) => getDayMetaInternal(date),

    getTimeMeta: (time) => getTimeMetaInternal(time),

    getDateTimeMeta: (dateTime) => getDateTimeMetaInternal(dateTime),

    setValue: (next) => {
      applyValue(next)

      const value = getCurrentValue()
      if (value !== null) {
        applyTime(getTimeFromDateTime(value))
      }
    },

    setDate: (next) => {
      if (next === null) {
        applyValue(null)
        return
      }

      const currentValue = getCurrentValue()
      const preservedTime = currentValue
        ? getTimeFromDateTime(currentValue)
        : getCurrentTime() ?? DEFAULT_TIME

      applyValue(combineLocalDateTime(next, preservedTime))
    },

    setTime: (next) => {
      applyTime(next)

      const currentValue = getCurrentValue()
      if (currentValue === null) {
        return
      }

      if (next === null) {
        applyValue(null)
        return
      }

      const normalizedTime = normalizeTimeCandidate(next, constraints)
      if (normalizedTime === undefined || normalizedTime === null) {
        return
      }

      applyValue(
        combineLocalDateTime(
          getDateFromDateTime(currentValue),
          normalizedTime
        )
      )
    },

    setVisibleMonth: (next) => {
      if (!isVisibleMonthControlled) {
        uncontrolledVisibleMonth = next
      }

      options.onVisibleMonthChange?.(next)
    },

    goToNextMonth: () => {
      const next = addMonths(getCurrentVisibleMonth(), 1)
      if (!isVisibleMonthControlled) {
        uncontrolledVisibleMonth = next
      }

      options.onVisibleMonthChange?.(next)
    },

    goToPrevMonth: () => {
      const prev = addMonths(getCurrentVisibleMonth(), -1)
      if (!isVisibleMonthControlled) {
        uncontrolledVisibleMonth = prev
      }

      options.onVisibleMonthChange?.(prev)
    },

    focusDate: (date) => {
      focusedDate = date
    },

    moveFocusDate: (direction) => {
      const currentValue = getCurrentValue()
      const fallbackDate =
        focusedDate ??
        (currentValue ? getDateFromDateTime(currentValue) : null) ??
        getCurrentVisibleMonth()
      const anchorDate = fallbackDate

      if (direction === "left") {
        focusedDate = addDays(anchorDate, -1)
        return
      }

      if (direction === "right") {
        focusedDate = addDays(anchorDate, 1)
        return
      }

      if (direction === "up") {
        focusedDate = addDays(anchorDate, -7)
        return
      }

      if (direction === "down") {
        focusedDate = addDays(anchorDate, 7)
        return
      }

      if (direction === "home") {
        focusedDate = startOfWeek(anchorDate, weekStartsOn)
        return
      }

      if (direction === "end") {
        focusedDate = addDays(startOfWeek(anchorDate, weekStartsOn), 6)
        return
      }

      if (direction === "pageUp") {
        focusedDate = addMonths(anchorDate, -1)
        return
      }

      focusedDate = addMonths(anchorDate, 1)
    }
  }
}
