# Controlled vs Uncontrolled

## Mental model

The picker has three independent control channels:

- Value channel: `value`, `defaultValue`, `onValueChange`
- Visible month channel: `visibleMonth`, `defaultVisibleMonth`, `onVisibleMonthChange`
- Time channel: `time`, `defaultTime`, `onTimeChange`

A channel is controlled when you pass its controlled prop (`value`, `visibleMonth`, or `time`).

## Why choose controlled mode?

Use controlled mode when your application state must stay authoritative outside the picker:

- form orchestration and cross-field validation
- synchronization with global stores
- business rules that depend on other parts of the UI
- persistence to URL, local storage, or backend payloads

Use uncontrolled mode when you want a simpler, self-contained integration where the picker manages its own internal state.

### Working uncontrolled example

```ts
import { createDateTimePicker } from "solstice-calendar"

const picker = createDateTimePicker({
  defaultValue: "2024-05-15T10:30",
  defaultVisibleMonth: "2024-05-01",
  defaultTime: "10:30"
})

picker.setDate("2024-05-20")
picker.setTime("11:45")

console.log(picker.getState().value) // 2024-05-20T11:45
```

### Working controlled example

```ts
import {
  createDateTimePicker,
  type LocalDateTime
} from "solstice-calendar"

const appState: { value: LocalDateTime | null } = {
  value: "2024-05-15T10:30"
}

let picker = createDateTimePicker()

const render = (): void => {
  picker = createDateTimePicker({
    value: appState.value,
    onValueChange: (next) => {
      appState.value = next
    }
  })
}

render()
picker.setDate("2024-05-20")

console.log(appState.value) // 2024-05-20T10:30
console.log(picker.getState().value) // 2024-05-15T10:30
// In controlled mode, the picker is no longer the source of truth.
```

## Common failure case

```ts
import { createDateTimePicker, type LocalDateTime } from "solstice-calendar"

const appState: { value: LocalDateTime | null } = { value: "2024-05-15T10:30" }

const picker = createDateTimePicker({
  value: appState.value,
  onValueChange: (next) => {
    console.log("new value", next)
    // appState.value is never updated
  }
})

picker.setDate("2024-05-20")
console.log(picker.getState().value) // still 2024-05-15T10:30
```

Why this fails: in controlled mode, callbacks fire but internal state is not the source of truth.

Correct approach:

```ts
onValueChange: (next) => {
  appState.value = next
  render()
}
```

## Edge cases

- You can mix modes per channel (for example controlled `value`, uncontrolled `visibleMonth`).
- Focus navigation can request visible month changes through `onVisibleMonthChange` in controlled month mode.
- If callbacks are missing or ignored in controlled channels, UI looks frozen.


## Mixed channels are supported

```ts
import { createDateTimePicker, type LocalDateTime } from "solstice-calendar"

const appState: { value: LocalDateTime | null } = {
  value: "2024-05-15T10:30"
}

const picker = createDateTimePicker({
  value: appState.value,
  onValueChange: (next) => {
    appState.value = next
  },
  defaultVisibleMonth: "2024-05-01"
})

picker.goToNextMonth()
console.log(picker.getState().visibleMonth) // 2024-06-01
```

Meaning: `value` is controlled while `visibleMonth` remains uncontrolled.

## Focus navigation can request month updates in controlled month mode

```ts
import { createDateTimePicker, type CalendarDate } from "solstice-calendar"

let visibleMonth: CalendarDate = "2024-05-01"

const picker = createDateTimePicker({
  visibleMonth,
  onVisibleMonthChange: (next) => {
    visibleMonth = next
  }
})

picker.focusDate("2024-05-31")
picker.moveFocusDate("right")

console.log(visibleMonth) // 2024-06-01
```

Meaning: navigation emits the requested month through `onVisibleMonthChange`.

## Missing/ignored callbacks make controlled channels look frozen

```ts
import { createDateTimePicker, type LocalDateTime } from "solstice-calendar"

const appState: { value: LocalDateTime | null } = {
  value: "2024-05-15T10:30"
}

const picker = createDateTimePicker({
  value: appState.value
  // onValueChange is missing
})

picker.setDate("2024-05-20")
console.log(picker.getState().value) // 2024-05-15T10:30
```

Meaning: without callback-driven reinjection, controlled value does not move.

## Next step

Continue with [Constraints](/core-concepts/constraints).
