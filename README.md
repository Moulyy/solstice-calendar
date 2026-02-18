# solstice-calendar

Headless, framework-agnostic calendar/date-time core.

- No DOM types in public API
- Deterministic date/time values (`YYYY-MM-DD`, `HH:mm`, `YYYY-MM-DDTHH:mm`)
- Controlled and uncontrolled modes
- Calendar math, constraints, selectors, and prop-getters

## Installation

```bash
pnpm add solstice-calendar
```

## Quick Start

```ts
import { createDateTimePicker } from "solstice-calendar"

const picker = createDateTimePicker({
  defaultValue: "2024-05-15T10:30",
  defaultVisibleMonth: "2024-05-01"
})

picker.setDate("2024-05-20")
picker.setTime("11:45")
```

## Public Values

- `CalendarDate`: `YYYY-MM-DD`
- `LocalTime`: `HH:mm`
- `LocalDateTime`: `YYYY-MM-DDTHH:mm`

## Vanilla Example

A minimal vanilla integration is available in:

- `examples/vanilla/index.html`
- `examples/vanilla/main.js`

The example renders:

- month navigation
- calendar grid
- date input
- time input

Run it with:

```bash
pnpm example:vanilla
```

Then open:

- `http://localhost:4173/examples/vanilla/`

## Uncontrolled Usage

```ts
import { createDateTimePicker } from "solstice-calendar"

const picker = createDateTimePicker({
  defaultValue: "2024-05-15T10:30",
  defaultVisibleMonth: "2024-05-01",
  weekStartsOn: 1,
  nowDate: "2024-05-15"
})

picker.setDate("2024-05-20")
picker.setTime("11:45")

const state = picker.getState()
// state.value === "2024-05-20T11:45"

const dayProps = picker.getDayProps("2024-05-21")
const dateInputProps = picker.getDateInputProps()
const timeInputProps = picker.getTimeInputProps()
```

## Controlled Usage

```ts
import { createDateTimePicker } from "solstice-calendar"

let controlledValue: `${number}-${number}-${number}T${number}:${number}` | null =
  "2024-06-10T08:00"

const picker = createDateTimePicker({
  value: controlledValue,
  onValueChange: (next) => {
    controlledValue = next
  }
})

picker.setDate("2024-06-12")
// onValueChange called with "2024-06-12T08:00"
// internal value is not mutated in controlled mode
```

## Inputs and Keyboard

`getDayProps(date)` returns primitives only:

- `onPress()`
- `onKeyDown(key: string)`
- `aria-selected`, `aria-disabled`, `tabIndex`

`onKeyDown` supports:

- `ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`
- `Home`, `End`, `PageUp`, `PageDown`
- `Enter` / space to select

`getDateInputProps()`, `getTimeInputProps()`, and `getDateTimeInputProps()`
perform strict parsing before applying updates.
