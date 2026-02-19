# Value Model

## Mental model

The engine uses strict canonical strings instead of `Date` objects:

- `CalendarDate`: `YYYY-MM-DD`
- `LocalTime`: `HH:mm`
- `LocalDateTime`: `YYYY-MM-DDTHH:mm`

These values are timezone-free, deterministic, and safe to compare as strings.

## Canonical pattern

```ts
import {
  combineLocalDateTime,
  formatCalendarDate,
  formatLocalTime,
  parseCalendarDate,
  parseLocalTime,
  splitLocalDateTime
} from "solstice-calendar"

const date = parseCalendarDate("2024-05-10")
const time = parseLocalTime("11:30")

if (!date || !time) {
  throw new Error("Invalid input")
}

const normalizedDate = formatCalendarDate({ y: 2024, m: 5, d: 10 })
const normalizedTime = formatLocalTime({ h: 11, min: 30 })

if (!normalizedDate || !normalizedTime) {
  throw new Error("Invalid parts")
}

const dateTime = combineLocalDateTime(normalizedDate, normalizedTime)
const split = splitLocalDateTime(dateTime)

console.log(split.date) // 2024-05-10
console.log(split.time) // 11:30
```

## Common failure case

```ts
import { parseCalendarDate, parseLocalTime } from "solstice-calendar"

console.log(parseCalendarDate("2024-1-01")) // null
console.log(parseLocalTime("8:00")) // null
```

Why this fails: parsing is strict and expects zero-padded canonical forms.

Correct approach: normalize user text before calling parser, or ask users to type canonical formats.

## Edge cases

- String comparison is reliable only for canonical fixed-width values.
- Invalid strings always return `null`; they never auto-correct silently.
- Canonical strings avoid browser timezone shifts and client/server drift.

## Implementation checklist

- Validate external input with parse helpers before storing.
- Persist canonical strings, not locale display strings.
- Keep comparisons in canonical form (`<`, `>`, `===`) for predictable behavior.

## Next step

Continue with [Controlled vs Uncontrolled](/core-concepts/controlled-vs-uncontrolled).
