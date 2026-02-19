# Constraints

## When should I use this?

Use constraints to limit what users can select.

## Constraint layers

- Date: `minDate`, `maxDate`, `isDateDisabled`
- Time: `minTime`, `maxTime`, `isTimeDisabled`
- DateTime: `min`, `max`, `isDisabled`

## Example

```ts
const picker = createDateTimePicker({
  constraints: {
    date: {
      minDate: "2024-05-01",
      maxDate: "2024-05-31",
      isDateDisabled: (date) => date === "2024-05-18"
    },
    time: {
      minTime: "09:00",
      maxTime: "18:00"
    },
    dateTime: {
      min: "2024-05-10T10:00",
      max: "2024-05-20T16:00"
    }
  }
})
```

## Edge cases

- Setters may clamp to boundaries
- Disabled predicates can reject values even when they are in range
- DateTime bounds can disable full dates or partial time ranges depending on selected date

## Next step

Continue with [Input Policy](/core-concepts/input-policy).
