# Constraints API

## When should I use this?

Use these helpers to validate, clamp, and test selectability for dates, times, and datetimes.

## Interfaces

- `DateConstraints`
- `TimeConstraints`
- `DateTimeConstraints`
- `Constraints`

## Functions

### `isWithinMinMaxDate(date, constraints): boolean`
Checks inclusive date bounds.

### `clampDateToConstraints(date, constraints): CalendarDate`
Clamps to date min/max.

### `isWithinMinMaxTime(time, constraints): boolean`
Checks inclusive time bounds.

### `clampTimeToConstraints(time, constraints): LocalTime`
Clamps to time min/max.

### `isWithinMinMaxDateTime(dateTime, constraints): boolean`
Checks inclusive datetime bounds.

### `clampDateTimeToConstraints(dateTime, constraints): LocalDateTime`
Clamps date, time, and datetime boundaries.

### `isSelectableDate(date, constraints): boolean`
Tests date bounds and date disable predicate.

### `isSelectableTime(time, constraints): boolean`
Tests time bounds and time disable predicate.

### `isSelectableDateTime(dateTime, constraints): boolean`
Tests datetime + date + time constraints together.

## Example

```ts
import { isSelectableDateTime } from "solstice-calendar"

const selectable = isSelectableDateTime("2024-05-10T11:00", {
  dateTime: {
    min: "2024-05-10T10:00",
    max: "2024-05-10T14:00"
  }
})

console.log(selectable)
```

## Edge cases

- DateTime selectability depends on combined date/time/datetime rules
- Clamp helpers do not run disable predicates; selectability helpers do

## Next step

Continue with [Time Options API](/api/time-options).
