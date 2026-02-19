# Time Options API

## When should I use this?

Use this API to generate deterministic time lists and step rounding behavior.

## Interface

### `GetTimeOptionsArgs`
- `stepMinutes: number`
- `start?: LocalTime`
- `end?: LocalTime`
- `constraints?: TimeConstraints`

## Functions

### `roundTimeToStep(time, stepMinutes, mode?): LocalTime`
Rounds by `floor`, `ceil`, or `nearest` (default).

### `getTimeOptions(args): LocalTime[]`
Returns step-based options respecting bounds and disabled predicate.

## Example

```ts
import { getTimeOptions, roundTimeToStep } from "solstice-calendar"

const rounded = roundTimeToStep("10:17", 15, "nearest")
const options = getTimeOptions({ stepMinutes: 30, start: "09:00", end: "12:00" })

console.log(rounded) // 10:15
console.log(options) // ["09:00", "09:30", ...]
```

## Edge cases

- `stepMinutes <= 0` throws an error
- Returned list can be empty if constraints exclude the range

## Next step

Continue with [DateTimePicker API](/api/date-time-picker).
