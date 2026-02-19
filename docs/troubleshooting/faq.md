# FAQ

## When should I use this?

Use this page for quick answers before digging into detailed guides.

## Does this library handle timezone conversion?

No. Values are timezone-free by design.

## Can I build a range picker with start and end?

Yes. Use two picker instances in controlled mode and enforce `end >= start` in your app logic.

## Can I replace parsing and formatting behavior?

Yes. Provide a custom `formatter` object.

## How do I disable specific days or times?

Use constraints predicates: `isDateDisabled`, `isTimeDisabled`, and `isDisabled` for datetime.

## Why do I see 42 calendar cells every month?

The grid is always a fixed 6x7 layout for stable rendering.

## What is the fastest path to production integration?

1. Follow Start Here
2. Complete Build Your First Picker
3. Add constraints recipe
4. Use API reference as lookup

## Edge cases

- Advanced product rules are often combinations of constraints and controlled state
- Range selection is a composition pattern, not a dedicated built-in mode

## Next step

Return to [Start Here](/start-here/) or jump to [API Reference](/api/).
