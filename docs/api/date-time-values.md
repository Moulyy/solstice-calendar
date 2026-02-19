# Date and Time Values API

## When should I use this?

Use these helpers to parse, format, split, and combine canonical value strings.

## Types

- `CalendarDate`
- `LocalTime`
- `LocalDateTime`
- `DateParts`
- `TimeParts`

## Functions

### `parseCalendarDate(input): CalendarDate | null`
Parses strict `YYYY-MM-DD`.

### `formatCalendarDate(parts): CalendarDate | null`
Formats validated date parts.

### `toDateParts(date): DateParts`
Converts canonical date string to numeric parts.

### `fromDateParts(parts): CalendarDate | null`
Alias for date formatting from parts.

### `parseLocalTime(input): LocalTime | null`
Parses strict `HH:mm`.

### `formatLocalTime(parts): LocalTime | null`
Formats validated time parts.

### `toTimeParts(time): TimeParts`
Converts canonical time string to numeric parts.

### `fromTimeParts(parts): LocalTime | null`
Alias for time formatting from parts.

### `parseLocalDateTime(input): LocalDateTime | null`
Parses strict `YYYY-MM-DDTHH:mm`.

### `formatLocalDateTime({ date, time }): LocalDateTime`
Formats a date/time pair.

### `splitLocalDateTime(dateTime): { date, time }`
Splits datetime into date and time strings.

### `combineLocalDateTime(date, time): LocalDateTime`
Combines date and time into canonical datetime.

## Example

```ts
import {
  parseCalendarDate,
  parseLocalTime,
  combineLocalDateTime
} from "solstice-calendar"

const date = parseCalendarDate("2024-05-10")
const time = parseLocalTime("11:30")

if (date && time) {
  console.log(combineLocalDateTime(date, time)) // 2024-05-10T11:30
}
```

## Edge cases

- Inputs must be zero-padded and strict
- Invalid values return `null`

## Next step

Continue with [Calendar Math](/api/calendar-math).
