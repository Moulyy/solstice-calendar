# Controlled vs Uncontrolled

## When should I use this?

Use this page when deciding where the source of truth lives.

## Uncontrolled mode

Use `default*` options and let the picker store internal state.

```ts
const picker = createDateTimePicker({
  defaultValue: "2024-05-15T10:30"
})

picker.setDate("2024-05-20")
```

## Controlled mode

Use `value` (or `visibleMonth`, `time`) and callbacks.

```ts
let value = "2024-05-15T10:30"

const picker = createDateTimePicker({
  value,
  onValueChange: (next) => {
    value = next
    // Re-render your UI with the new value
  }
})
```

## Edge cases

- In controlled mode, callbacks fire but internal value is not mutated
- If you do not reinject new values, UI appears frozen

## Next step

Continue with [Constraints](/core-concepts/constraints).
