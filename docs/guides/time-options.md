# Time Options

## When should I use this?

Use this guide to generate consistent time lists for dropdowns or radio groups.

## Generate options

```ts
import { getTimeOptions } from "solstice-calendar"

const options = getTimeOptions({
  stepMinutes: 30,
  start: "08:00",
  end: "18:00",
  constraints: {
    minTime: "09:00",
    maxTime: "17:30",
    isTimeDisabled: (time) => time === "12:00"
  }
})
```

## Round values

```ts
import { roundTimeToStep } from "solstice-calendar"

const rounded = roundTimeToStep("10:17", 15, "nearest")
console.log(rounded) // 10:15
```

## Edge cases

- `stepMinutes` must be a positive integer
- If effective start is after effective end, the options list is empty

## Next step

Continue with [Recipes](/recipes/date-only-picker).
