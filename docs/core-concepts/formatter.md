# Formatter

## Mental model

The formatter is the conversion layer between your UI text and canonical picker values.

- `format*` methods control what users see in inputs
- `parse*` methods decide what is accepted as valid input
- `getMonthLabel` and `getWeekdayLabels` control calendar labels

If parsing is strict and deterministic, input behavior stays predictable.

## What formatter changes (and what it does not)

The formatter changes display and input parsing. It does not change canonical state.

- `formatDate`, `formatTime`, `formatDateTime` affect input display values
- `parseDate`, `parseTime`, `parseDateTime` validate and convert user text
- `getState().value` always stays canonical (`YYYY-MM-DDTHH:mm`)

```ts
const picker = createDateTimePicker({
  defaultValue: "2024-06-10T08:15",
  formatter
})

console.log(picker.getDateInputProps().value) // DATE:2024-06-10
console.log(picker.getState().value) // 2024-06-10T08:15
```

Use this when you need custom UI text while keeping stable internal data.

## Formatter contract

```ts
interface DateTimeFormatter {
  formatDate(date: CalendarDate): string
  parseDate(input: string): CalendarDate | null
  formatTime(time: LocalTime): string
  parseTime(input: string): LocalTime | null
  formatDateTime(dateTime: LocalDateTime): string
  parseDateTime(input: string): LocalDateTime | null
  getMonthLabel(visibleMonth: CalendarDate): string
  getWeekdayLabels(weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6): string[]
}
```

Rules:

- Return canonical values from `parse*`, otherwise `null`
- Never throw for normal user typos
- Keep `format*` and `parse*` symmetrical for stable round-trips
- Return weekday labels in the same order as `weekStartsOn`

## Canonical pattern

```ts
import {
  createDateTimePicker,
  parseCalendarDate,
  parseLocalDateTime,
  parseLocalTime,
  type DateTimeFormatter
} from "solstice-calendar"

const weekdayBase = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const

const formatter: DateTimeFormatter = {
  formatDate: (date) => `DATE:${date}`,
  parseDate: (input) => {
    if (!input.startsWith("DATE:")) {
      return null
    }

    return parseCalendarDate(input.slice(5))
  },

  formatTime: (time) => `TIME:${time}`,
  parseTime: (input) => {
    if (!input.startsWith("TIME:")) {
      return null
    }

    return parseLocalTime(input.slice(5))
  },

  formatDateTime: (dateTime) => `DT:${dateTime}`,
  parseDateTime: (input) => {
    if (!input.startsWith("DT:")) {
      return null
    }

    return parseLocalDateTime(input.slice(3))
  },

  getMonthLabel: (visibleMonth) => {
    const [year, month] = visibleMonth.slice(0, 7).split("-")
    return `${year}-${month}`
  },

  getWeekdayLabels: (weekStartsOn) => {
    return weekdayBase
      .slice(weekStartsOn)
      .concat(weekdayBase.slice(0, weekStartsOn))
  }
}

const picker = createDateTimePicker({
  defaultValue: "2024-06-10T08:15",
  weekStartsOn: 1,
  formatter
})

picker.getDateInputProps().onChange("DATE:2024-06-14")
console.log(picker.getState().value) // 2024-06-14T08:15

picker.getTimeInputProps().onChange("TIME:09:30")
console.log(picker.getState().value) // 2024-06-14T09:30

console.log(picker.getMonthLabel()) // 2024-06
console.log(picker.getWeekdayLabels()) // ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
```

## Common failure case

```ts
import {
  parseCalendarDate,
  type CalendarDate,
  type DateTimeFormatter
} from "solstice-calendar"

// Anti-pattern: fallback to a default date on parse failure
const badFormatter: DateTimeFormatter = {
  formatDate: (date) => date,
  parseDate: (input) => {
    const parsed = parseCalendarDate(input.replaceAll("/", "-"))
    return parsed ?? ("2024-01-01" as CalendarDate)
  },
  formatTime: (time) => time,
  parseTime: () => null,
  formatDateTime: (dateTime) => dateTime,
  parseDateTime: () => null,
  getMonthLabel: (visibleMonth) => visibleMonth,
  getWeekdayLabels: () => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
}
```

Why this fails: invalid user text can silently commit a fake fallback value, which hides input errors.

Correct approach: normalize if needed, then validate with canonical parse helpers, and return `null` on failure.

## Correct solution

```ts
import {
  parseCalendarDate,
  parseLocalDateTime,
  parseLocalTime,
  type DateTimeFormatter
} from "solstice-calendar"

const strictFormatter: DateTimeFormatter = {
  formatDate: (date) => date,
  parseDate: (input) => {
    const normalized = input.replaceAll("/", "-")
    return parseCalendarDate(normalized)
  },
  formatTime: (time) => time,
  parseTime: (input) => parseLocalTime(input),
  formatDateTime: (dateTime) => dateTime,
  parseDateTime: (input) => parseLocalDateTime(input),
  getMonthLabel: (visibleMonth) => visibleMonth.slice(0, 7),
  getWeekdayLabels: (weekStartsOn) => {
    const base = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    return base.slice(weekStartsOn).concat(base.slice(0, weekStartsOn))
  }
}
```

## Edge cases

- `parse*` methods run during typing through input prop getters.
- If `parse*` returns `null`, input stays draft and is not committed.
- Invalid draft is reverted on blur by input policy.
- `getMonthLabel` receives the current visible month as a canonical date (`YYYY-MM-01`).
- `getWeekdayLabels` should return seven labels ordered from `weekStartsOn`.
- Display text can be customized, but all picker actions and state stay canonical.

## Implementation checklist

- Implement all formatter methods.
- Keep parse strict and return `null` on invalid input.
- Use canonical parse helpers (`parseCalendarDate`, `parseLocalTime`, `parseLocalDateTime`).
- Ensure labels and parsing rules match your displayed format.

## Next step

Continue with [API Reference](/api/).
