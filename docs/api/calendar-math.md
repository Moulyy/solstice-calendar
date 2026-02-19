# Calendar Math API

## When should I use this?

Use calendar math helpers for month navigation, day offsets, week alignment, and month grid generation.

## Functions

### `getMonthStart(date): CalendarDate`
Returns first day of date's month.

### `getMonthEnd(date): CalendarDate`
Returns last day of date's month.

### `addMonths(date, months): CalendarDate`
Adds month offset and clamps day if needed.

### `addDays(date, days): CalendarDate`
Adds day offset.

### `startOfWeek(date, weekStartsOn): CalendarDate`
Returns week-start date for the provided date.

### `compareCalendarDate(a, b): -1 | 0 | 1`
Comparator for chronological sorting.

### `getCalendarGrid(visibleMonth, weekStartsOn): CalendarDate[]`
Returns fixed 42-cell month grid.

## Example

```ts
import { getCalendarGrid } from "solstice-calendar"

const grid = getCalendarGrid("2024-05-01", 1)
console.log(grid.length) // 42
```

## Edge cases

- `addMonths` preserves day when possible, otherwise clamps to month end
- Grid includes dates from adjacent months

## Next step

Continue with [Constraints API](/api/constraints).
