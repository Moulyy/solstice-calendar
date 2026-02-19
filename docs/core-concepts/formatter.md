# Formatter

## Mental model

The formatter is a contract between user input and canonical picker values:

- `format*` methods define what users see
- `parse*` methods define what users are allowed to enter
- `getMonthLabel` and `getWeekdayLabels` define calendar naming

A good formatter is strict enough to protect data quality and explicit enough to avoid ambiguous parsing.

## Canonical pattern

```ts
import {
  createDateTimePicker,
  parseCalendarDate,
  parseLocalDateTime,
  parseLocalTime,
  type DateTimeFormatter
} from "solstice-calendar"

const formatter: DateTimeFormatter = {
  formatDate: (date) => `DATE:${date}`,
  parseDate: (input) => {
    if (!input.startsWith("DATE:")) return null
    return parseCalendarDate(input.slice(5))
  },

  formatTime: (time) => `TIME:${time}`,
  parseTime: (input) => {
    if (!input.startsWith("TIME:")) return null
    return parseLocalTime(input.slice(5))
  },

  formatDateTime: (dateTime) => `DT:${dateTime}`,
  parseDateTime: (input) => {
    if (!input.startsWith("DT:")) return null
    return parseLocalDateTime(input.slice(3))
  },

  getMonthLabel: (visibleMonth) => `Month ${visibleMonth.slice(0, 7)}`,
  getWeekdayLabels: (weekStartsOn) => {
    const base = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    return base.slice(weekStartsOn).concat(base.slice(0, weekStartsOn))
  }
}

const picker = createDateTimePicker({ formatter })
```

## Common failure case

```ts
// Anti-pattern: permissive parser that accepts ambiguous text
const formatter = {
  parseDate: (input: string) => input.replaceAll("/", "-") as never
  // ...other methods omitted
}
```

Why this fails: permissive parsing can accept non-canonical or ambiguous text, creating unexpected commits.

Correct approach: parsing methods should return canonical values only, otherwise `null`.

## Edge cases

- Parse methods must return `null` for invalid text; never throw for normal user typos.
- `getWeekdayLabels` should respect `weekStartsOn` ordering to avoid UI mismatch.
- Formatter strictness directly affects input draft/commit behavior.

## Implementation checklist

- Implement all formatter methods (no partial contract).
- Validate parsed values with canonical parse helpers.
- Keep formatting and parsing symmetrical for predictable round-trips.

## Next step

Continue with [API Reference](/api/).
