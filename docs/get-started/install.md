# Installation

Solstice Calendar is distributed as a lightweight, framework-agnostic package.
It has no UI dependencies and no DOM assumptions, making it safe to use in both client and server environments.

##  Package Manager

Install the package using your preferred package manager:

```bash
npm i solstice-calendar
```


```bash
pnpm add solstice-calendar
```

```bash
yarn add solstice-calendar
```

## Requirements

- Node.js 18+ recommended
- ES modules support
- TypeScript support (optional but recommended)

The package ships with full TypeScript definitions.

## Importing the Engine

```ts
import { createDateTimePicker } from "solstice-calendar"
```

Or access lower-level utilities directly:

```ts
import {
  parseCalendarDate,
  formatCalendarDate,
  getCalendarGrid,
  getTimeOptions
} from "solstice-calendar"
```

The library is fully tree-shakeable. If you only use the calendar math utilities, the rest of the engine will not be bundled.

## Framework Integration

Solstice Calendar does not provide UI components.
You are expected to connect the engine to your framework of choice:

- React
- Vue
- Angular
- Svelte
- Vanilla JS

The engine exposes state, selectors, actions, and prop-getters that can be wired to any rendering layer.
We are studying the possibility of creating adapters in the near future.