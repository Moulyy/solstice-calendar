# Value Model

## When should I use this?

Use this page when you need to understand data shapes before integration.

## Canonical value types

- `CalendarDate`: `YYYY-MM-DD`
- `LocalTime`: `HH:mm`
- `LocalDateTime`: `YYYY-MM-DDTHH:mm`

These values are timezone-free and deterministic.

## Why this model

- No implicit timezone conversion
- Stable serialization between frontend and backend
- Predictable comparisons and constraint checks

## Edge cases

- Parsers are strict (`2024-1-01` is invalid)
- Invalid values return `null` in parsing helpers

## Next step

Continue with [Controlled vs Uncontrolled](/core-concepts/controlled-vs-uncontrolled).
