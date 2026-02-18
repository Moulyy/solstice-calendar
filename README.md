# solstice-calendar

[![CI](https://github.com/Moulyy/solstice-calendar/actions/workflows/ci.yml/badge.svg?branch=master&event=push)](https://github.com/Moulyy/solstice-calendar/actions/workflows/ci.yml)

Headless, framework-agnostic calendar/date-time core.

## Installation

```bash
pnpm add solstice-calendar
```

## Philosophy

`solstice-calendar` uses **timezone-free** values:

- `CalendarDate`: `YYYY-MM-DD`
- `LocalTime`: `HH:mm`
- `LocalDateTime`: `YYYY-MM-DDTHH:mm`

Why this model:

- avoid implicit shifts caused by machine timezone settings
- keep values serializable and stable across client/server boundaries
- make tests deterministic and behavior predictable

The core never reads `window`, `document`, or system timezone.

## Quick Start

```ts
import { createDateTimePicker } from "solstice-calendar"

const picker = createDateTimePicker({
  defaultValue: "2024-05-15T10:30",
  defaultVisibleMonth: "2024-05-01",
  weekStartsOn: 1
})

picker.setDate("2024-05-20")
picker.setTime("11:45")

console.log(picker.getState().value) // 2024-05-20T11:45
```

## Constraints

You can combine date, time, datetime bounds and custom disabled predicates.

```ts
import { createDateTimePicker } from "solstice-calendar"

const picker = createDateTimePicker({
  constraints: {
    date: {
      minDate: "2024-05-01",
      maxDate: "2024-05-31",
      isDateDisabled: (date) => date === "2024-05-18"
    },
    time: {
      minTime: "09:00",
      maxTime: "18:00",
      isTimeDisabled: (time) => time === "12:00"
    },
    dateTime: {
      min: "2024-05-10T10:00",
      max: "2024-05-20T16:00",
      isDisabled: (dt) => dt === "2024-05-15T15:30"
    }
  }
})

picker.isSelectableDate("2024-05-18") // false
picker.isSelectableTime("12:00") // false
picker.isSelectableDateTime("2024-05-15T15:30") // false
```

## Controlled vs Uncontrolled

### Uncontrolled

Pass `default*` values and let the instance own internal state.

```ts
const picker = createDateTimePicker({
  defaultValue: "2024-05-15T10:30"
})

picker.setDate("2024-05-20")
```

### Controlled

Pass `value` (or `visibleMonth`, `time`) and the matching callback.

```ts
let value = "2024-05-15T10:30" as const

const picker = createDateTimePicker({
  value,
  onValueChange: (next) => {
    value = next
    // in UI frameworks, rerender with the new value
  }
})
```

Important pitfall:

- in controlled mode, the instance is **not** the source of truth
- you must **feed the next value back** (`onValueChange`,
  `onVisibleMonthChange`, `onTimeChange`) or the UI will appear stuck

## Inputs Policy

`getDateInputProps`, `getTimeInputProps`, and `getDateTimeInputProps` follow an explicit policy:

- empty string (`""`) => `setDate(null)` / `setTime(null)` / `setValue(null)`
- invalid draft input:
  - preserve typed text temporarily
  - expose `aria-invalid: true`
- `onBlur` while invalid:
  - revert to last committed valid value
- valid input:
  - commit immediately
  - clear `aria-invalid`

## Mini API Reference

### Factory

- `createDateTimePicker(options?)`

### Parsing/formatting utilities

- `parseCalendarDate`, `formatCalendarDate`
- `parseLocalTime`, `formatLocalTime`
- `parseLocalDateTime`, `formatLocalDateTime`

### Calendar math

- `getMonthStart`, `getMonthEnd`
- `addMonths`, `addDays`, `startOfWeek`
- `compareCalendarDate`, `getCalendarGrid`

### Constraint helpers

- `isWithinMinMaxDate`, `clampDateToConstraints`
- `isWithinMinMaxTime`, `clampTimeToConstraints`
- `isWithinMinMaxDateTime`, `clampDateTimeToConstraints`
- `isSelectableDate`, `isSelectableTime`, `isSelectableDateTime`

### Time helpers

- `getTimeOptions({ stepMinutes, start?, end?, constraints? })`
- `roundTimeToStep(time, stepMinutes, mode?)`

### Main instance methods

- state/actions: `getState`, `setValue`, `setDate`, `setTime`
- navigation: `setVisibleMonth`, `goToNextMonth`, `goToPrevMonth`
- focus: `focusDate`, `moveFocusDate`
- selectors: `getCalendarGrid`, `getDayMeta`, `getTimeMeta`, `getDateTimeMeta`
- labels/selectability: `getMonthLabel`, `getWeekdayLabels`, `isSelectable*`
- prop getters: `getDayProps`, `getPrevMonthButtonProps`,
  `getNextMonthButtonProps`, `getTimeOptionProps`, `get*InputProps`

## Vanilla Example

- `examples/vanilla/index.html`
- `examples/vanilla/main.js`

Run:

```bash
pnpm example:vanilla
```

Then open:

- `http://localhost:4173/examples/vanilla/`
