# Common Pitfalls

## When should I use this?

Use this page when integration behavior does not match your expectation.

## 1) Picker looks frozen in controlled mode

### Symptom
Callbacks are called, but displayed value never changes.

### Root cause
Updated value is not reinjected from your app state.

### Fix
Store callback result and rerender with the new controlled value.

## 2) Non-current-month cells appear at month start/end

### Symptom
The first row may include dates from previous month.

### Root cause
Calendar grid is fixed to 42 cells.

### Fix
Style `isCurrentMonth: false` cells differently and keep behavior explicit.

## 3) Disabled cells still appear clickable

### Symptom
Clicking a disabled-looking cell still changes your UI.

### Root cause
Rendered UI does not use `disabled` and `aria-disabled` from prop getters.

### Fix
Respect `disabled` visually and behaviorally in your UI component.

## 4) Invalid text appears to be accepted

### Symptom
Typing invalid date/time text still shows in input.

### Root cause
Invalid drafts are intentionally preserved until blur.

### Fix
Use `aria-invalid` and helper text, then rely on blur to revert.

## Edge cases

- Multiple issues can happen together when controlled mode and constraints are both active
- Visual disabled states must match behavioral disabled states in your UI

## Next step

Read the [FAQ](/troubleshooting/faq) for quick answers.
