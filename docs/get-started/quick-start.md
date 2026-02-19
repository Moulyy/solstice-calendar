# Quick Start

In this section, we will build a minimal date-time picker using the core engine only.
No framework. No styling. Just logic wired to DOM elements.

This example demonstrates:

- Calendar grid rendering
- Month navigation
- Date selection
- Time selection
- Controlled value display

## Create the Picker Instance

```ts
import { createDateTimePicker } from "solstice-calendar"

const picker = createDateTimePicker({
  defaultValue: null,
  defaultVisibleMonth: "2024-01-01",
  defaultTime: null,
  stepMinutes: 30,
  onValueChange: (value) => {
    console.log("Selected value:", value)
  }
})
```

At this point, the engine manages:

- Internal state
- Focus
- Visible month
- Date/time synchronization
- Constraint enforcement

## Render the Calendar grid

Generate the 6×7 calendar matrix:

```ts
const grid = picker.getCalendarGrid()
```

Render it however you like: 

## Exemple in Vanilla JS

```ts
function renderCalendar() {
  const grid = picker.getCalendarGrid()

  grid.forEach((cell) => {
    const button = document.createElement("button")
    button.textContent = cell.date.slice(-2)

    const props = picker.getDayProps(cell.date)

    // Disable if engine says disabled OR not in current month
    const disabled = !!props.disabled || cell.isDisabled || !cell.isCurrentMonth
    button.disabled = disabled

    // a11y
    button.tabIndex = props.tabIndex
    button.setAttribute("aria-selected", String(props["aria-selected"]))
    button.setAttribute("aria-disabled", String(disabled))

    // Pointer interaction
    button.addEventListener("click", () => props.onPress())

    // Keyboard interaction (engine expects a key string)
    button.addEventListener("keydown", (e) => {
      props.onKeyDown?.(e.key)
    })

    // optional: visually mute days outside current month
    if (!cell.isCurrentMonth) button.style.opacity = "0.4"

    document.body.appendChild(button)
  })
}
```

## Example in Vue.JS

```vue
<script setup lang="ts">
import { computed, ref } from "vue"
import { createDateTimePicker } from "solstice-calendar"

const tick = ref(0)

const picker = createDateTimePicker({
  defaultValue: null,
  defaultVisibleMonth: "2024-05-01",
  onValueChange: () => tick.value++,
})

const grid = computed(() => {
  tick.value
  return picker.getCalendarGrid()
})

function dayProps(date: string) {
  return picker.getDayProps(date)
}
</script>

<template>
  <div
    style="display:grid;grid-template-columns:repeat(7,36px);gap:6px"
  >
    <button
      v-for="cell in grid"
      :key="cell.date"
      :disabled="cell.isDisabled || !cell.isCurrentMonth"
      :tabindex="dayProps(cell.date).tabIndex"
      :aria-selected="dayProps(cell.date)['aria-selected']"
      :aria-disabled="cell.isDisabled || !cell.isCurrentMonth"
      :style="{ opacity: cell.isCurrentMonth ? 1 : 0.4 }"
      @click="dayProps(cell.date).onPress()"
      @keydown="(e) => dayProps(cell.date).onKeyDown?.(e.key)"
    >
      {{ cell.date.slice(-2) }}
    </button>
  </div>
</template>

```

## Next step

Continue with [Build Your First Picker](/first-picker/).
