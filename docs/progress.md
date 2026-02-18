# Progress

## Status

| Etape | Statut | Resume | PR/commit |
| --- | --- | --- | --- |
| Etape 0 - Setup minimal du repo | DONE | Projet TypeScript strict initialise, Vitest configure, smoke test passant | N/A |
| Etape 1 - Types & parsing robustes | DONE | Types publics + parsing/formatting stricts et conversions implementes | N/A |
| Etape 2 - Maths calendrier | DONE | Fonctions de maths calendrier implementees avec grille fixe de 42 dates | N/A |
| Etape 3 - Contraintes | DONE | Contraintes date/time/datetime implementees avec clamp et selectability | N/A |
| Etape 4 - State core + reducer | DONE | Instance core createDateTimePicker avec actions et modes controlled/uncontrolled | N/A |
| Etape 5 - Selectors | DONE | Selectors et metas jour/heure/datetime implementes avec today injectable | N/A |
| Etape 6 - Prop getters headless | DONE | Prop-getters headless calendar/boutons/inputs implementes sans DOM | N/A |
| Etape 7 - Documentation + example minimal | DONE | Exemple vanilla ajoute et README mis a jour avec usages controlled/uncontrolled | N/A |
| Etape 8 - Packaging & publish readiness | DONE | Build tsup ESM + types, exports package et sideEffects configures | N/A |
| Etape 9 - Verrouiller l'API publique vs plan | DONE | Formatter injectable + labels + isSelectable* exposes sur l'instance | N/A |
| Etape 10 - Inputs utilisables | DONE | Inputs gerent vide/invalid/blur avec aria-invalid et draft text | N/A |
| Etape 11 - Sync focus ↔ visibleMonth | DONE | Navigation clavier synchronise focus et mois visible automatiquement | N/A |
| Etape 12 - Time options + helpers | DONE | Time options/rounding ajoutes + getTimeOptionProps headless | N/A |
| Etape 13 - Clamp policy DateTime avancee | DONE | Politique de clamp DateTime documentee et verifiee par tests dedies | N/A |
| Etape 14 - Exemple vanilla executable | DONE | Script de lancement vanilla ajoute et README complete | N/A |
| Etape 15 - Publish readiness audit | DONE | Audit exports/sideEffects + README minimal + verification pack | N/A |

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

### 2026-02-18 20:22 - Etape 3

- Fichiers crees:
  - `src/constraints.ts`
  - `tests/constraints.spec.ts`
- Fichiers modifies:
  - `src/index.ts`
  - `docs/progress.md`
- Dependances ajoutees:
  - Aucune
- Scripts ajoutes:
  - Aucun
- Tests ajoutes:
  - `tests/constraints.spec.ts` (8 tests sur min/max, clamp, disabled,
    combinaison des contraintes)
- Verification:
  - `pnpm lint`: OK
  - `pnpm test`: OK (34 tests passes)
  - `pnpm build`: OK
- Decisions:
  - Clamp datetime applique d'abord min/max datetime puis contraintes date/time,
    puis revalide min/max datetime
  - `isSelectableDateTime` combine date + time + datetime et les predicates
    disabled
  - Incoherence plan notee: texte Etape 3 mentionne `isDateTimeDisabled`,
    API cible utilise `dateTime.isDisabled`; implementation alignee sur API cible

### 2026-02-18 20:26 - Etape 4

- Fichiers crees:
  - `src/date-time-picker.ts`
  - `tests/date-time-picker.spec.ts`
- Fichiers modifies:
  - `src/index.ts`
  - `docs/progress.md`
- Dependances ajoutees:
  - Aucune
- Scripts ajoutes:
  - Aucun
- Tests ajoutes:
  - `tests/date-time-picker.spec.ts` (7 tests sur modes controlled/uncontrolled,
    navigation mois, conservation date/time, contraintes)
- Verification:
  - `pnpm lint`: OK
  - `pnpm test`: OK (41 tests passes)
  - `pnpm build`: OK
- Decisions:
  - Comportement choisi: application de clamp sur `setValue` avant acceptance
  - En mode controlled, les callbacks sont appeles sans mutation interne
  - Valeurs par defaut deterministes sans dependance systeme:
    `visibleMonth=1970-01-01`, `time=00:00` quand necessaire

### 2026-02-18 20:35 - Etape 5

- Fichiers crees:
  - `tests/date-time-picker-selectors.spec.ts`
- Fichiers modifies:
  - `src/date-time-picker.ts`
  - `docs/progress.md`
- Dependances ajoutees:
  - Aucune
- Scripts ajoutes:
  - Aucun
- Tests ajoutes:
  - `tests/date-time-picker-selectors.spec.ts` (3 tests selectors + metas)
- Verification:
  - `pnpm lint`: OK
  - `pnpm test`: OK (44 tests passes)
  - `pnpm build`: OK
- Decisions:
  - `nowDate` injectable ajoute dans options pour calcul deterministic de `isToday`
  - `getCalendarGrid` instance retourne des `CalendarCellMeta` (niveau selector)
  - Meta date/time rendues coherentes avec min/max datetime (bornes par jour/heure)

### 2026-02-18 20:38 - Etape 6

- Fichiers crees:
  - `tests/date-time-picker-props.spec.ts`
- Fichiers modifies:
  - `src/date-time-picker.ts`
  - `docs/progress.md`
- Dependances ajoutees:
  - Aucune
- Scripts ajoutes:
  - Aucun
- Tests ajoutes:
  - `tests/date-time-picker-props.spec.ts` (4 tests sur prop-getters + handlers)
- Verification:
  - `pnpm lint`: OK
  - `pnpm test`: OK (48 tests passes)
  - `pnpm build`: OK
- Decisions:
  - Handlers exposes en primitives headless (`onPress`, `onKeyDown(key)`)
    sans dependance DOM
  - Inputs headless (`date`, `time`, `datetime`) appliquent parse strict puis
    action associee

### 2026-02-18 20:39 - Etape 7

- Fichiers crees:
  - `examples/vanilla/index.html`
  - `examples/vanilla/main.js`
- Fichiers modifies:
  - `README.md`
  - `docs/progress.md`
- Dependances ajoutees:
  - Aucune
- Scripts ajoutes:
  - Aucun
- Tests ajoutes:
  - Aucun (non requis pour cette etape)
- Verification:
  - `pnpm lint`: OK
  - `pnpm test`: OK (tests existants non casses)
  - `pnpm build`: OK
- Decisions:
  - Exemple vanilla documente avec rendu calendrier + input date + input time
  - README recentre sur usage pratique et snippets controlled/uncontrolled

### 2026-02-18 20:46 - Etape 8

- Fichiers crees:
  - `tsup.config.ts`
- Fichiers modifies:
  - `package.json`
  - `pnpm-lock.yaml`
  - `docs/progress.md`
- Dependances ajoutees:
  - `tsup` (dev)
- Scripts ajoutes:
  - `pnpm typecheck` -> `tsc --noEmit`
  - `pnpm build` -> `tsup`
- Tests ajoutes:
  - Aucun (non requis pour cette etape)
- Verification:
  - `pnpm typecheck`: OK
  - `pnpm lint`: OK
  - `pnpm test`: OK (48 tests passes)
  - `pnpm build`: OK (dist ESM + d.ts generes)
  - Import ESM verifie via `node` sur `dist/index.js`
- Decisions:
  - Packaging ESM-first avec exports map + types + `sideEffects: false`
  - Dist publiee limitee au dossier `dist` via `files`

### 2026-02-18 21:24 - Etape 9

- Fichiers crees:
  - `tests/date-time-picker-api-lock.spec.ts`
- Fichiers modifies:
  - `src/date-time-picker.ts`
  - `docs/progress.md`
- Dependances ajoutees:
  - Aucune
- Scripts ajoutes:
  - Aucun
- Tests ajoutes:
  - `tests/date-time-picker-api-lock.spec.ts` (3 tests formatter/labels/selectability)
- Verification:
  - `pnpm lint`: OK
  - `pnpm test`: OK (51 tests passes)
  - `pnpm build`: OK
- Decisions:
  - `DateTimeFormatter` ajoute dans options avec `defaultFormatter` neutre
    (sans dependance locale/Intl)
  - API instance alignee sur le plan:
    `getMonthLabel`, `getWeekdayLabels`, `isSelectableDate`,
    `isSelectableTime`, `isSelectableDateTime`

### 2026-02-18 21:34 - Etape 10

- Fichiers crees:
  - `tests/date-time-picker-inputs.spec.ts`
- Fichiers modifies:
  - `src/date-time-picker.ts`
  - `tests/date-time-picker-api-lock.spec.ts`
  - `docs/plan.md`
  - `docs/progress.md`
- Dependances ajoutees:
  - Aucune
- Scripts ajoutes:
  - Aucun
- Tests ajoutes:
  - `tests/date-time-picker-inputs.spec.ts` (4 tests vide/invalid/blur/commit)
  - `tests/date-time-picker-api-lock.spec.ts` enrichi (formatter parse/format sur inputs)
- Verification:
  - `pnpm lint`: OK
  - `pnpm test`: OK (56 tests passes)
  - `pnpm build`: OK
- Decisions:
  - Input invalid policy documentee dans `docs/plan.md`:
    conserve temporairement la saisie invalide + `aria-invalid: true`,
    puis revert au dernier etat valide au blur
  - Champ vide applique bien `setDate(null)` / `setTime(null)` / `setValue(null)`

### 2026-02-18 21:38 - Etape 11

- Fichiers crees:
  - `tests/date-time-picker-focus-sync.spec.ts`
- Fichiers modifies:
  - `src/date-time-picker.ts`
  - `docs/progress.md`
- Dependances ajoutees:
  - Aucune
- Scripts ajoutes:
  - Aucun
- Tests ajoutes:
  - `tests/date-time-picker-focus-sync.spec.ts` (4 tests sync focus/mois)
- Verification:
  - `pnpm lint`: OK
  - `pnpm test`: OK (60 tests passes)
  - `pnpm build`: OK
- Decisions:
  - Apres `moveFocusDate`, si le focus sort du mois visible, `visibleMonth` est
    synchronise sur le debut du mois de `focusedDate` (`YYYY-MM-01`)
  - En mode controlled visibleMonth, la synchro passe par le callback
    `onVisibleMonthChange` sans mutation interne

### 2026-02-18 21:43 - Etape 12

- Fichiers crees:
  - `src/time-options.ts`
  - `tests/time-options.spec.ts`
- Fichiers modifies:
  - `src/date-time-picker.ts`
  - `src/index.ts`
  - `docs/progress.md`
- Dependances ajoutees:
  - Aucune
- Scripts ajoutes:
  - Aucun
- Tests ajoutes:
  - `tests/time-options.spec.ts` (5 tests options/rounding/time option props)
- Verification:
  - `pnpm lint`: OK
  - `pnpm test`: OK (65 tests passes)
  - `pnpm build`: OK
- Decisions:
  - `getTimeOptions` respecte `stepMinutes`, bornes start/end, min/max et
    `isTimeDisabled`
  - `getTimeOptionProps(time)` expose `aria-selected`/`aria-disabled` et bloque
    `setTime` quand disabled

### 2026-02-18 21:44 - Etape 13

- Fichiers crees:
  - `tests/date-time-picker-clamp-policy.spec.ts`
- Fichiers modifies:
  - `docs/plan.md`
  - `docs/progress.md`
- Dependances ajoutees:
  - Aucune
- Scripts ajoutes:
  - Aucun
- Tests ajoutes:
  - `tests/date-time-picker-clamp-policy.spec.ts` (2 tests clamp setDate/setTime)
- Verification:
  - `pnpm lint`: OK
  - `pnpm test`: OK (67 tests passes)
  - `pnpm build`: OK
- Decisions:
  - Strategie documentee: setDate/setTime preservent d'abord la contrepartie
    puis appliquent un clamp datetime inclusif centralise

### 2026-02-18 21:45 - Etape 14

- Fichiers crees:
  - `examples/vanilla/server.mjs`
- Fichiers modifies:
  - `package.json`
  - `README.md`
  - `docs/progress.md`
- Dependances ajoutees:
  - Aucune
- Scripts ajoutes:
  - `pnpm example:vanilla` -> `pnpm build && node examples/vanilla/server.mjs`
- Tests ajoutes:
  - Aucun (non requis pour cette etape)
- Verification:
  - `pnpm lint`: OK
  - `pnpm test`: OK (67 tests passes)
  - `pnpm build`: OK
- Decisions:
  - L'exemple vanilla est executable sans dependances externes additionnelles
    via un serveur Node local

### 2026-02-18 21:46 - Etape 15

- Fichiers crees:
  - `tests/public-api.spec.ts`
- Fichiers modifies:
  - `README.md`
  - `docs/progress.md`
- Dependances ajoutees:
  - Aucune
- Scripts ajoutes:
  - Aucun
- Tests ajoutes:
  - `tests/public-api.spec.ts` (audit surface API exportee)
- Verification:
  - `pnpm lint`: OK
  - `pnpm test`: OK (68 tests passes)
  - `pnpm build`: OK
  - `pnpm npm pack --dry-run`: OK (tarball 6 fichiers attendus)
  - Import ESM `dist/index.js`: OK (`createDateTimePicker`, `getTimeOptions`,
    `roundTimeToStep` presentes)
- Decisions:
  - `sideEffects: false` et `exports` package valides pour un usage ESM+types
  - README complete avec sections: Installation, Quick Start, Controlled/
    Uncontrolled, Valeurs publiques
