import type { TimeConstraints } from "@/constraints"
import type { LocalTime, TimeParts } from "@/date-time"
import { fromTimeParts, toTimeParts } from "@/date-time"

/** Options used to generate a selectable list of times. */
export interface GetTimeOptionsArgs {
  stepMinutes: number
  start?: LocalTime
  end?: LocalTime
  constraints?: TimeConstraints
}

/** Converts LocalTime into total minutes since 00:00. */
const toMinutes = (time: LocalTime): number => {
  const parts = toTimeParts(time)
  return parts.h * 60 + parts.min
}

/** Converts total minutes since 00:00 into a LocalTime value. */
const fromMinutes = (totalMinutes: number): LocalTime => {
  const clamped = Math.min(23 * 60 + 59, Math.max(0, totalMinutes))
  const parts: TimeParts = {
    h: Math.floor(clamped / 60),
    min: clamped % 60
  }

  const value = fromTimeParts(parts)
  if (!value) {
    throw new Error("Unable to convert minutes to LocalTime")
  }

  return value
}

/** Returns true when time is within inclusive min/max constraints. */
const isWithinMinMax = (time: LocalTime, constraints: TimeConstraints): boolean => {
  if (constraints.minTime && time < constraints.minTime) {
    return false
  }

  if (constraints.maxTime && time > constraints.maxTime) {
    return false
  }

  return true
}

/**
 * Rounds a LocalTime to the nearest step boundary.
 * - floor: previous boundary
 * - ceil: next boundary
 * - nearest: closest boundary
 */
export const roundTimeToStep = (
  time: LocalTime,
  stepMinutes: number,
  mode: "floor" | "ceil" | "nearest" = "nearest"
): LocalTime => {
  if (!Number.isInteger(stepMinutes) || stepMinutes <= 0) {
    throw new Error("stepMinutes must be a positive integer")
  }

  const minutes = toMinutes(time)

  let rounded: number
  if (mode === "floor") {
    rounded = Math.floor(minutes / stepMinutes) * stepMinutes
  } else if (mode === "ceil") {
    rounded = Math.ceil(minutes / stepMinutes) * stepMinutes
  } else {
    rounded = Math.round(minutes / stepMinutes) * stepMinutes
  }

  return fromMinutes(rounded)
}

/**
 * Generates a deterministic list of LocalTime options.
 * The list is step-based and respects start/end and time constraints.
 */
export const getTimeOptions = ({
  stepMinutes,
  start = "00:00",
  end = "23:59",
  constraints = {}
}: GetTimeOptionsArgs): LocalTime[] => {
  if (!Number.isInteger(stepMinutes) || stepMinutes <= 0) {
    throw new Error("stepMinutes must be a positive integer")
  }

  const minBound = constraints.minTime ?? start
  const maxBound = constraints.maxTime ?? end

  const effectiveStart = minBound > start ? minBound : start
  const effectiveEnd = maxBound < end ? maxBound : end

  if (effectiveStart > effectiveEnd) {
    return []
  }

  const first = roundTimeToStep(effectiveStart, stepMinutes, "ceil")
  const values: LocalTime[] = []

  for (
    let minutes = toMinutes(first);
    minutes <= toMinutes(effectiveEnd);
    minutes += stepMinutes
  ) {
    const candidate = fromMinutes(minutes)

    if (!isWithinMinMax(candidate, constraints)) {
      continue
    }

    if (constraints.isTimeDisabled?.(candidate)) {
      continue
    }

    values.push(candidate)
  }

  return values
}
