import type {
  CalendarDate,
  LocalDateTime,
  LocalTime
} from "@/date-time"
import { combineLocalDateTime, splitLocalDateTime } from "@/date-time"

/** Date constraints used by date-level guards and clamping helpers. */
export interface DateConstraints {
  minDate?: CalendarDate
  maxDate?: CalendarDate
  isDateDisabled?: (date: CalendarDate) => boolean
}

/** Time constraints used by time-level guards and clamping helpers. */
export interface TimeConstraints {
  minTime?: LocalTime
  maxTime?: LocalTime
  isTimeDisabled?: (time: LocalTime) => boolean
}

/** DateTime constraints used by datetime-level guards and clamping helpers. */
export interface DateTimeConstraints {
  min?: LocalDateTime
  max?: LocalDateTime
  isDisabled?: (dateTime: LocalDateTime) => boolean
}

/** Aggregate constraints that can be applied together. */
export interface Constraints {
  date?: DateConstraints
  time?: TimeConstraints
  dateTime?: DateTimeConstraints
}

/** Returns true when date is within inclusive min/max boundaries. */
export const isWithinMinMaxDate = (
  date: CalendarDate,
  constraints: DateConstraints = {}
): boolean => {
  if (constraints.minDate && date < constraints.minDate) {
    return false
  }

  if (constraints.maxDate && date > constraints.maxDate) {
    return false
  }

  return true
}

/** Clamps date to inclusive min/max boundaries. */
export const clampDateToConstraints = (
  date: CalendarDate,
  constraints: DateConstraints = {}
): CalendarDate => {
  if (constraints.minDate && date < constraints.minDate) {
    return constraints.minDate
  }

  if (constraints.maxDate && date > constraints.maxDate) {
    return constraints.maxDate
  }

  return date
}

/** Returns true when time is within inclusive min/max boundaries. */
export const isWithinMinMaxTime = (
  time: LocalTime,
  constraints: TimeConstraints = {}
): boolean => {
  if (constraints.minTime && time < constraints.minTime) {
    return false
  }

  if (constraints.maxTime && time > constraints.maxTime) {
    return false
  }

  return true
}

/** Clamps time to inclusive min/max boundaries. */
export const clampTimeToConstraints = (
  time: LocalTime,
  constraints: TimeConstraints = {}
): LocalTime => {
  if (constraints.minTime && time < constraints.minTime) {
    return constraints.minTime
  }

  if (constraints.maxTime && time > constraints.maxTime) {
    return constraints.maxTime
  }

  return time
}

/** Returns true when datetime is within inclusive min/max boundaries. */
export const isWithinMinMaxDateTime = (
  dateTime: LocalDateTime,
  constraints: DateTimeConstraints = {}
): boolean => {
  if (constraints.min && dateTime < constraints.min) {
    return false
  }

  if (constraints.max && dateTime > constraints.max) {
    return false
  }

  return true
}

/** Clamps datetime to inclusive min/max boundaries. */
export const clampDateTimeToConstraints = (
  dateTime: LocalDateTime,
  constraints: Constraints = {}
): LocalDateTime => {
  const dateTimeConstraints = constraints.dateTime ?? {}
  let nextDateTime = dateTime

  if (dateTimeConstraints.min && nextDateTime < dateTimeConstraints.min) {
    nextDateTime = dateTimeConstraints.min
  }

  if (dateTimeConstraints.max && nextDateTime > dateTimeConstraints.max) {
    nextDateTime = dateTimeConstraints.max
  }

  const split = splitLocalDateTime(nextDateTime)
  const clampedDate = clampDateToConstraints(split.date, constraints.date)
  const clampedTime = clampTimeToConstraints(split.time, constraints.time)
  const merged = combineLocalDateTime(clampedDate, clampedTime)

  if (dateTimeConstraints.min && merged < dateTimeConstraints.min) {
    return dateTimeConstraints.min
  }

  if (dateTimeConstraints.max && merged > dateTimeConstraints.max) {
    return dateTimeConstraints.max
  }

  return merged
}

/** Returns true when date can be selected according to date min/max and disabled predicate. */
export const isSelectableDate = (
  date: CalendarDate,
  constraints: Constraints = {}
): boolean => {
  const dateConstraints = constraints.date ?? {}

  if (!isWithinMinMaxDate(date, dateConstraints)) {
    return false
  }

  if (dateConstraints.isDateDisabled?.(date)) {
    return false
  }

  return true
}

/** Returns true when time can be selected according to time min/max and disabled predicate. */
export const isSelectableTime = (
  time: LocalTime,
  constraints: Constraints = {}
): boolean => {
  const timeConstraints = constraints.time ?? {}

  if (!isWithinMinMaxTime(time, timeConstraints)) {
    return false
  }

  if (timeConstraints.isTimeDisabled?.(time)) {
    return false
  }

  return true
}

/**
 * Returns true when datetime can be selected considering date/time/datetime limits
 * and disabled predicates.
 */
export const isSelectableDateTime = (
  dateTime: LocalDateTime,
  constraints: Constraints = {}
): boolean => {
  const dateTimeConstraints = constraints.dateTime ?? {}

  if (!isWithinMinMaxDateTime(dateTime, dateTimeConstraints)) {
    return false
  }

  if (dateTimeConstraints.isDisabled?.(dateTime)) {
    return false
  }

  const split = splitLocalDateTime(dateTime)

  if (!isSelectableDate(split.date, constraints)) {
    return false
  }

  if (!isSelectableTime(split.time, constraints)) {
    return false
  }

  return true
}
