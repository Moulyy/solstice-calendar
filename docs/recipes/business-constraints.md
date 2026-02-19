# Recipe: Business Constraints

## When should I use this?

Use this recipe when product rules define unavailable dates/times.

## Implementation

```ts
import { createDateTimePicker } from "solstice-calendar"

const isWeekend = (date: string) => {
  const day = new Date(`${date}T00:00:00Z`).getUTCDay()
  return day === 0 || day === 6
}

const picker = createDateTimePicker({
  constraints: {
    date: {
      minDate: "2024-05-01",
      maxDate: "2024-05-31",
      isDateDisabled: isWeekend
    },
    time: {
      minTime: "09:00",
      maxTime: "17:00",
      isTimeDisabled: (time) => time === "12:00"
    },
    dateTime: {
      isDisabled: (dt) => dt === "2024-05-15T15:30"
    }
  }
})
```

## Edge cases

- Disable rules compose: date + time + datetime can all reject a selection
- Prefer deterministic predicates for easier testing

## Next step

Continue with [Start-End Range Pattern](/recipes/start-end-range-pattern).
