# solstice-calendar
A headless, framework-agnostic date picker engine. Build fully custom calendar UIs with composable state, actions and prop getters.

# Solstice Date

Solstice Date is a headless, framework-agnostic date picker engine inspired by TanStack.

It provides composable state management, calendar math utilities, constraints handling, and prop getters — without any DOM, CSS, or framework dependency.

You bring the UI. Solstice brings the logic.

---

## ✨ Why Solstice?

Most date pickers are tightly coupled to a specific framework or UI implementation.

Solstice is different:

- ✅ Headless (no DOM, no styling)
- ✅ Framework-agnostic (works with Vue, Angular, React, Svelte, or vanilla JS)
- ✅ Fully typed (TypeScript first)
- ✅ Controlled & uncontrolled modes
- ✅ Deterministic calendar math
- ✅ Timezone-safe calendar dates (`YYYY-MM-DD`)

It gives you the primitives needed to build:

- Single date pickers
- Range pickers
- Inline calendars
- Input-based pickers
- Multi-month views
- Design system compliant components

---

## 🧠 Core Philosophy

Solstice separates concerns cleanly:

- **CalendarDate** — a stable, timezone-free string representation (`YYYY-MM-DD`)
- **State & Reducer** — predictable state transitions
- **Selectors** — derived calendar grid & metadata
- **Prop Getters** — ergonomic integration with any UI layer

No assumptions about your rendering strategy.
No styling opinions.
No framework lock-in.

📦 Use Cases

Design systems needing consistent date logic across frameworks

Teams building multi frameworks components from shared core logic

Applications requiring deterministic calendar constraints

Headless UI architectures
