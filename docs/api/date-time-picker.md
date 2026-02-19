# DateTimePicker API

## Factory

### `createDateTimePicker(options?): DateTimePickerInstance`
Creates a picker instance with controlled or uncontrolled behavior.

## Key options

- Value flow: `value`, `defaultValue`, `onValueChange`
- Visible month flow: `visibleMonth`, `defaultVisibleMonth`, `onVisibleMonthChange`
- Time flow: `time`, `defaultTime`, `onTimeChange`
- Other: `weekStartsOn`, `formatter`, `constraints`, `nowDate`

## Instance methods

### State and actions
- `getState()`
- `setValue(next)`
- `setDate(next)`
- `setTime(next)`

### Navigation and focus
- `setVisibleMonth(next)`
- `goToNextMonth()`
- `goToPrevMonth()`
- `focusDate(date)`
- `moveFocusDate(direction)`

### Selectors and labels
- `getCalendarGrid()`
- `getMonthLabel()`
- `getWeekdayLabels()`
- `getDayMeta(date)`
- `getTimeMeta(time)`
- `getDateTimeMeta(dateTime)`

### Selectability checks
- `isSelectableDate(date)`
- `isSelectableTime(time)`
- `isSelectableDateTime(dateTime)`

### Prop getters
- `getPrevMonthButtonProps()`
- `getNextMonthButtonProps()`
- `getDayProps(date)`
- `getTimeOptionProps(time)`
- `getDateInputProps()`
- `getTimeInputProps()`
- `getDateTimeInputProps()`

## Example

```ts
import { createDateTimePicker } from "solstice-calendar"

const picker = createDateTimePicker({ defaultValue: "2024-05-10T11:00" })

picker.getDayProps("2024-05-12").onPress()
picker.getTimeOptionProps("13:00").onPress()

console.log(picker.getState().value)
```

## Edge cases

- Controlled mode requires reinjecting callback values
- Date and time setters preserve the other segment when possible
- Constraint rules may clamp or reject updates

## Next step

Continue with [Public Types](/api/public-types).
