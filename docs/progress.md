# Progress

## Status

| Etape | Statut | Resume | PR/commit |
| --- | --- | --- | --- |
| Etape 0 - Setup minimal du repo | DONE | Projet TypeScript strict initialise, Vitest configure, smoke test passant | N/A |
| Etape 1 - Types & parsing robustes | DONE | Types publics + parsing/formatting stricts et conversions implementes | N/A |
| Etape 2 - Maths calendrier | TODO | Non commencee | N/A |

## Journal

### 2026-02-18 19:50 - Etape 0

- Fichiers crees:
  - `docs/plan.md`
  - `docs/progress.md`
  - `src/index.ts`
  - `tests/smoke.spec.ts`
  - `package.json`
  - `pnpm-lock.yaml`
  - `tsconfig.json`
  - `vitest.config.ts`
  - `eslint.config.js`
  - `.gitignore`
- Fichiers modifies:
  - `package.json` (scripts)
- Dependances ajoutees (dev):
  - `typescript`
  - `vitest`
  - `@types/node`
  - `eslint`
  - `@typescript-eslint/parser`
  - `@typescript-eslint/eslint-plugin`
- Scripts ajoutes:
  - `pnpm test` -> `vitest run`
  - `pnpm build` -> `tsc --noEmit`
  - `pnpm lint` -> `eslint .`
- Tests ajoutes:
  - `tests/smoke.spec.ts` (`expect(1).toBe(1)`)
- Verification:
  - `pnpm lint`: OK
  - `pnpm test`: OK (1 test passe)
  - `pnpm build`: OK
- Decisions:
  - Alias configure via `tsconfig.json`: `@/*` -> `src/*`
  - Setup minimal limite strictement a l'Etape 0

### 2026-02-18 19:56 - Etape 1

- Fichiers crees:
  - `src/date-time.ts`
  - `tests/date-time.spec.ts`
- Fichiers modifies:
  - `src/index.ts`
  - `vitest.config.ts`
  - `docs/progress.md`
- Dependances ajoutees:
  - Aucune
- Scripts ajoutes:
  - Aucun
- Tests ajoutes:
  - `tests/date-time.spec.ts` (13 tests sur date/time/datetime + conversions)
- Verification:
  - `pnpm lint`: OK
  - `pnpm test`: OK (14 tests passes)
  - `pnpm build`: OK
- Decisions:
  - Parsing strict via regex avec padding obligatoire (`YYYY-MM-DD`, `HH:mm`,
    `YYYY-MM-DDTHH:mm`)
  - Validation explicite des bornes (mois/jour, leap year, heures/minutes)
  - `format*` et `from*` retournent `null` si input invalide
