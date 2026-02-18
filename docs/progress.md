# Progress

## Status

| Etape | Statut | Resume | PR/commit |
| --- | --- | --- | --- |
| Etape 0 - Setup minimal du repo | DONE | Projet TypeScript strict initialise, Vitest configure, smoke test passant | N/A |
| Etape 1 - Types & parsing robustes | DONE | Types publics + parsing/formatting stricts et conversions implementes | N/A |
| Etape 2 - Maths calendrier | DONE | Fonctions de maths calendrier implementees avec grille fixe de 42 dates | N/A |
| Etape 3 - Contraintes | TODO | Non commencee | N/A |

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

### 2026-02-18 20:09 - Etape 2

- Fichiers crees:
  - `src/calendar-math.ts`
  - `tests/calendar-math.spec.ts`
- Fichiers modifies:
  - `src/index.ts`
  - `docs/progress.md`
- Dependances ajoutees:
  - Aucune
- Scripts ajoutes:
  - Aucun
- Tests ajoutes:
  - `tests/calendar-math.spec.ts` (12 tests sur bornes de mois, semaine, grille,
    transitions et tri)
- Verification:
  - `pnpm lint`: OK
  - `pnpm test`: OK (26 tests passes)
  - `pnpm build`: OK
- Decisions:
  - Implementation calendar math sans dependance au timezone system
    (algorithmes civils purs)
  - `addMonths` applique un clamp au dernier jour valide du mois cible
  - Incoherence notee: Etape 2 definit `getCalendarGrid` en `CalendarDate[]`
    alors que l'API instance v1 exposera plus tard des metas; traite ici comme
    utilitaire bas niveau de dates uniquement
