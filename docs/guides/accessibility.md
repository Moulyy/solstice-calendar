# Accessibility

## When should I use this?

Use this guide when mapping headless props to accessible HTML elements.

## Key prop getters

- `getDayProps(date)`
- `getPrevMonthButtonProps()`
- `getNextMonthButtonProps()`
- `getTimeOptionProps(time)`
- `getDateInputProps()` / `getTimeInputProps()` / `getDateTimeInputProps()`

## Example mapping

```ts
const dayProps = picker.getDayProps("2024-05-10")

// button attributes
const attrs = {
  "aria-selected": dayProps["aria-selected"],
  "aria-disabled": dayProps["aria-disabled"],
  tabIndex: dayProps.tabIndex
}
```

## Edge cases

- Disabled props should block user action in your rendered UI
- `aria-invalid` appears only when input draft is invalid
- Keyboard behavior depends on forwarding key names to `onKeyDown`

## Next step

Continue with [Time Options](/guides/time-options).
