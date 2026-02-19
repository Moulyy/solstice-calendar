# Formatter

## When should I use this?

Use a formatter when you need custom display labels or parsing rules.

## Formatter contract

Your formatter can customize:

- Date formatting/parsing
- Time formatting/parsing
- DateTime formatting/parsing
- Month label
- Weekday labels

## Example

```ts
const formatter = {
  formatDate: (date) => `DATE:${date}`,
  parseDate: (text) => text.startsWith("DATE:") ? text.slice(5) : null,
  formatTime: (time) => `TIME:${time}`,
  parseTime: (text) => text.startsWith("TIME:") ? text.slice(5) : null,
  formatDateTime: (dt) => `DT:${dt}`,
  parseDateTime: (text) => text.startsWith("DT:") ? text.slice(3) : null,
  getMonthLabel: (visibleMonth) => `Month ${visibleMonth}`,
  getWeekdayLabels: () => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
}

const picker = createDateTimePicker({ formatter })
```

## Edge cases

- Parsing functions must return `null` for invalid input
- If your parsing is permissive, user input behavior changes accordingly

## Next step

Continue with [Guides](/guides/navigation-focus).
