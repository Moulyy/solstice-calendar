# Introduction

**Solstice Calendar** is a headless date and time engine built for developers who demand full UI control without sacrificing correctness, accessibility, or architectural clarity.

Unlike monolithic datepicker components that impose markup, styling decisions, or framework coupling, Solstice Calendar provides only the logic layer: state management, calendar grid generation, keyboard navigation, constraints (min/max), strict parsing and validation, and orchestration of date and time values.
You remain entirely in control of the presentation layer.

## Why a Headless Engine?
In serious applications — design systems, enterprise tools, multi-framework monorepos — visual components often become constraints:
- Rigid styling that conflicts with design tokens
- Limited accessibility customization
- SSR inconsistencies
- Opaque internal behaviors
- Subtle timezone-related bugs

Solstice Calendar takes a different approach.
The logic is isolated, deterministic, and framework-agnostic. You build the UI. The engine guarantees consistency.

## A Deterministic, Timezone-Free Model

At the core of Solstice Calendar is a deliberate design decision:
**no implicit reliance on the system timezone.**

All values are strict, predictable string formats:

`CalendarDate` -> `YYYY-MM-DD`
`LocalTime` -> `HH:mm`
`LocalDateTime` -> `YYYY-MM-DDTHH:mm`

This eliminates an entire class of common issues:
- Browser-dependent timezone shifts
- Client/server mismatches
- DST-related edge cases
- Ambiguous serialization

Every transformation is explicit. Every validation is controlled. Behavior remains stable across environments.

## What the Engine Provides 

Solstice Calendar encapsulates the critical responsibilities of a modern date/time picker:
- Controlled and uncontrolled state management
- Calendar grid generation (6×7 layout)
- Complete keyboard navigation support
- Focus management with roving tabindex
- Composable constraints (date, time, datetime)
- Strict input validation with predictable fallback behavior
- Time option generation with configurable step intervals
- Pure calendar math utilities

The result is a small, focused core that integrates cleanly into any UI architecture.

## Designed for Design Systems and Serious Applications

Solstice Calendar was built with long-term maintainability in mind:

- Framework-agnostic by design
- No DOM assumptions
- Fully testable logic
- Predictable controlled patterns
- Explicit APIs over hidden magic

If you need a date/time engine that behaves predictably under real-world constraints — not just demo scenarios — Solstice Calendar gives you the foundation to build with confidence.