# Mission: Construire une librairie headless DateTimePicker (style TanStack)

Tu es un agent de code autonome. Tu vas implémenter une librairie totalement headless, framework-agnostic, en TypeScript, avec une approche “instance + actions + selectors + prop getters”, inspirée de TanStack Table.

## Objectif global
- Zéro DOM, zéro CSS, zéro dépendance framework.
- Une API composable qui expose : état, actions, selectors et “prop getters”.
- Valeurs publiques stables et sérialisables **sans timezone** :
  - `CalendarDate` string `YYYY-MM-DD`
  - `LocalTime` string `HH:mm` (secondes optionnelles plus tard)
  - `LocalDateTime` string `YYYY-MM-DDTHH:mm`
- Tests (Vitest) obligatoires à chaque étape.
- Documentation de progression obligatoire à chaque étape dans un fichier dédié.

---

## Modèle de valeur (IMPORTANT)
### Concepts
- `CalendarDate` = date calendaire (sans heure, sans timezone)
- `LocalTime` = heure locale (sans timezone)
- `LocalDateTime` = combinaison `CalendarDate + LocalTime`

### Formats stricts
- `CalendarDate`: `YYYY-MM-DD` (zero padded)
- `LocalTime`: `HH:mm` (00–23, 00–59)
- `LocalDateTime`: `YYYY-MM-DDTHH:mm`

> Aucune fonction publique ne doit exposer ou dépendre d’un `Date` JS.
> Le core ne gère pas les timezones. La conversion timezone <-> local doit être faite par l’application consommatrice.

---

## Repo & Fichiers Markdown obligatoires
Tu dois créer/maintenir ces 2 fichiers distincts:

1) `docs/plan.md`
- Contient le plan global (roadmap, modules, API cible).
- Il est stable: tu ne le modifies que si un choix d’architecture change réellement.

2) `docs/progress.md`
- **Suivi d’avancement**: tu dois le mettre à jour à la fin de CHAQUE étape.
- Format imposé (voir section “Format progress.md”).

---

## Contraintes techniques
- Langage: TypeScript.
- Tests: Vitest.
- Build: tu peux utiliser `tsup` (ou équivalent) mais **seulement après que le core et les tests existent**.
- Runtime: ESM d’abord, CJS optionnel plus tard.
- Zéro dépendance à un framework.
- Dépendances date: idéalement core dependency-free. Si une abstraction est nécessaire, créer une interface interne `DateAdapter`.
- SSR-safe: aucune référence à `window`, `document`, etc.

---

## Philosophie d’implémentation (obligatoire)
Tu travailles par incréments. À chaque étape:
1) tu écris/updates les tests correspondants
2) tu implémentes la logique minimum pour faire passer les tests
3) tu lances les tests (ou simules leur exécution si tu ne peux pas)
4) tu mets à jour `docs/progress.md` (obligatoire)
5) tu passes à l’étape suivante

---

## Format imposé pour docs/progress.md
Le fichier doit toujours contenir:

- Un tableau “Status” en haut :
  - `Étape`
  - `Statut` (TODO | IN_PROGRESS | DONE | BLOCKED)
  - `Résumé`
  - `PR/commit` (si applicable)
- Puis une section “Journal” chronologique
  - Chaque entrée: date/heure (approx), étape, ce qui a été fait, tests ajoutés, décisions

---

# Organisation des étapes

> Les étapes doivent être suivies strictement dans l’ordre défini ci-dessous.  
> Aucune étape ne doit être sautée.  
> Chaque étape doit inclure des tests et une mise à jour du fichier `docs/progress.md`.

---

## Étape 0 — Setup minimal du repo

### Objectifs
- Initialiser le projet TypeScript
- Configurer Vitest
- Ajouter les scripts :
  - `test`
  - `lint` (optionnel)
  - `build` (placeholder accepté)
- Ajouter la structure :
  - `src/`
  - `tests/`
  - `docs/plan.md`
  - `docs/progress.md`

### Livrables
- Tests “smoke”
- `docs/plan.md` rédigé
- `docs/progress.md` initialisé avec Étape 0 en statut DONE

---

## Étape 1 — Types & parsing robustes (Date + Time + DateTime)

### Implémentation
- Définir :
  - `CalendarDate` (`YYYY-MM-DD`)
  - `LocalTime` (`HH:mm`)
  - `LocalDateTime` (`YYYY-MM-DDTHH:mm`)
- Validation stricte :
  - bornes mois/jours (incluant années bissextiles)
  - bornes heures/minutes
- Implémenter :
  - `parseCalendarDate()`, `formatCalendarDate()`
  - `parseLocalTime()`, `formatLocalTime()`
  - `parseLocalDateTime()`, `formatLocalDateTime()`
- Conversions :
  - `toDateParts()` / `fromDateParts()`
  - `toTimeParts()` / `fromTimeParts()` (ex: `{ h, min }`)
  - `splitLocalDateTime()` => `{ date, time }`
  - `combineLocalDateTime(date, time)` => `LocalDateTime`

### Tests
- Dates valides/invalides (bissextiles compris)
- Zéros padding
- Bornes mois/jour
- Heures valides/invalides (00–23)
- Minutes valides/invalides (00–59)
- DateTime parsing strict (séparateur `T`, longueur, padding)

---

## Étape 2 — Maths calendrier (mois / semaine / grille)

### Fonctions à implémenter
- `getMonthStart()`, `getMonthEnd()`
- `addMonths()`, `addDays()`, `startOfWeek()`
- `compareCalendarDate(a,b)` (ordre chronologique)
- `getCalendarGrid(visibleMonth, weekStartsOn)` => 42 cellules `CalendarDate`

### Tests
- Février année bissextile
- `weekStartsOn` lundi vs dimanche
- Grille longueur 42
- Continuité des dates
- Transition mois précédent / suivant correcte
- compare tri correct

---

## Étape 3 — Contraintes (Date + Time + DateTime)

### Implémentation
- Contraintes de date :
  - `isWithinMinMaxDate()`, `clampDateToConstraints()`
- Contraintes de time :
  - `isWithinMinMaxTime()`, `clampTimeToConstraints()`
- Contraintes DateTime :
  - `isWithinMinMaxDateTime()`, `clampDateTimeToConstraints()`
- `isSelectableDate(date, constraints)`
- `isSelectableTime(time, constraints)` (si time indépendante)
- `isSelectableDateTime(dt, constraints)` combinant min/max + `isDateDisabled` + `isTimeDisabled` + `isDateTimeDisabled`

### Tests
- Min/max inclusifs (date/time/datetime)
- Disabled prend le dessus
- Clamp correct (date puis time, ou datetime direct selon implémentation documentée)
- Edge cases : minDateTime et maxDateTime sur le même jour

---

## Étape 4 — State core + reducer (DateTimePicker)

### Définir
- `DateTimePickerState` (ou `DatePickerState` étendu)

### Implémenter
`createDateTimePicker(options)` avec controlled / uncontrolled :

- Value controlled/uncontrolled :
  - `value?: LocalDateTime | null`
  - `defaultValue?: LocalDateTime | null`
  - `onValueChange?: (v: LocalDateTime | null) => void`
- Visible month controlled/uncontrolled :
  - `visibleMonth?: CalendarDate`
  - `defaultVisibleMonth?: CalendarDate`
  - `onVisibleMonthChange?: (m: CalendarDate) => void`
- Time controlled/uncontrolled (optionnel mais recommandé pour UX) :
  - `time?: LocalTime`
  - `defaultTime?: LocalTime`
  - `onTimeChange?: (t: LocalTime) => void`
- Options :
  - `weekStartsOn`
  - `constraints`

### Actions
- `setValue(dt)`
- `setDate(date)` (met à jour dt en conservant time)
- `setTime(time)` (met à jour dt en conservant date)
- `setVisibleMonth(m)`, `goToNextMonth()`, `goToPrevMonth()`
- `focusDate(date)`, `moveFocusDate(dir)` (placeholder simple au début)

### Tests
- Uncontrolled : setDate/setTime modifient correctement le state/value
- Controlled : callbacks déclenchés sans mutation interne (ou modèle documenté)
- Navigation mois correcte
- setDate conserve time; setTime conserve date
- Contraintes appliquées (clamp si choisi) et documentées

---

## Étape 5 — Selectors (date grid + meta + time meta)

### Implémentation
- `getState()`
- `getCalendarGrid()` basé sur visibleMonth + contraintes + selected date
- `getDayMeta(date)` :
  - `isSelectedDate`
  - `isDisabledDate`
  - `isToday`
  - `isCurrentMonth`
- `getTimeMeta(time)` :
  - `isSelectedTime`
  - `isDisabledTime`
- `getDateTimeMeta(dt)` si nécessaire

> `today` doit être injectable (ex: option `nowDate?: CalendarDate`) pour testabilité.

### Tests
- Selected reflété (date + time)
- Disabled reflété (date + time)
- Today injectable
- Meta cohérente sur min/max DateTime

---

## Étape 6 — Prop getters headless (Calendar + Time)

### Implémentation
- Calendar:
  - `getDayProps(date)` (sans types DOM)
  - `getPrevMonthButtonProps()`, `getNextMonthButtonProps()`
- Input(s):
  - `getDateInputProps()` (parse/format date)
  - `getTimeInputProps()` (parse/format time)
  - `getDateTimeInputProps()` (si tu veux un champ unique)
- Time controls:
  - `getTimeOptionProps(time)` (si tu proposes une liste de times)
  - ou helpers `getIncrementTimeButtonProps()` / `getDecrementTimeButtonProps()`

### Tests
- Props contiennent aria/tabIndex cohérents
- `onClick` / `onSelect` appelle setDate / setTime
- `onKeyDown(key)` déclenche moveFocusDate (au minimum flèches)
- Handlers ne dépendent pas de `KeyboardEvent` natif (uniquement primitives)

---

## Étape 7 — Documentation + example minimal

### Implémentation
- Ajouter un exemple vanilla JS dans :
  - `examples/vanilla/`
- Documenter l’usage dans `README.md`:
  - calendrier + input date + input time
  - exemple controlled/uncontrolled

### Tests
- Aucun nouveau test requis
- Les tests existants ne doivent pas être cassés

---

## Étape 8 — Packaging & publish readiness

### Implémentation
- Configurer `tsup`
- Vérifier exports corrects
- Générer types
- Définir `"sideEffects"` correctement dans `package.json`
- Vérifier tree-shaking

### Validation
- Build sans erreur
- Import fonctionnel en ESM
- Types correctement exposés
- Aucun code mort exporté

---

## Étape 9 — Verrouiller l’API publique vs plan (formatter + selectability)
### Objectif
Aligner ce que tu promets (plan) avec ce que l’instance expose.
- Ajouter formatter?: DateTimeFormatter dans DateTimePickerOptions.
- Fournir un defaultFormatter (neutre) si absent.

Exposer sur l’instance :

- getMonthLabel()
- getWeekdayLabels()
- isSelectableDate(date)
- isSelectableTime(time)
- isSelectableDateTime(dt)

Tests

- getWeekdayLabels() respecte weekStartsOn.
- getMonthLabel() retourne quelque chose de stable (via formatter stub).
- isSelectable* reflète correctement min/max/disabled (tester 2-3 cas simples).

Notes d’implémentation
Le formatter “Intl” viendra plus tard (ou module séparé). Ici : interface + default.

## Étape 10 — Inputs utilisables (vide, invalid, aria-invalid, blur)
### Objectif
Avoir des get*InputProps() utilisables dans une vraie UI, sans comportements frustrants.
À implémenter

Support du “vide” :
- "" => setDate(null) / setTime(null) / setValue(null) selon le champ

Gestion d’invalidité :
- si parse* renvoie null, exposer "aria-invalid": true
- conserver le texte tapé (sinon l’utilisateur ne peut pas corriger)

Ajouter onBlur :

stratégie simple : si invalide au blur, revert au dernier état valide (ou clear). Choisir 1 comportement et le documenter.

Tests
- effacer le champ date => state date null (ou value null selon ton modèle)
- entrer 2024-1-01 (invalide strict) => aria-invalid true + texte conservé
- blur sur input invalide => revert/clear selon stratégie
- entrer une valeur valide => commit et aria-invalid false

Décision actée — Input invalid policy

- Pendant la saisie invalide: conserver temporairement le texte saisi et exposer
  `"aria-invalid": true`.
- Au blur si invalide: revert au dernier état valide commité (pas de clear implicite).
- Sur saisie valide: commit immédiat et suppression de `aria-invalid`.

## Étape 11 — Sync focus ↔ visibleMonth (navigation clavier)
### Objectif
Quand on navigue au clavier, le mois visible doit suivre le focus.

Après moveFocusDate, si focusedDate sort du mois visibleMonth :

- mettre à jour visibleMonth sur le mois de focusedDate (ex: YYYY-MM-01)
- (Optionnel v0.2) décider si on autorise focus sur dates disabled ou si on “skip”.

Tests

- partant d’un visibleMonth, flèche droite/haut/bas qui fait sortir => visibleMonth change
- pageUp/pageDown => visibleMonth change
- cohérence : getCalendarGrid reflète le nouveau mois

## Étape 12 — Time options (step minutes) + helpers
### Objectif
Permettre aux gens de construire un time picker sans réinventer la roue.

Utilitaires :

- getTimeOptions({ stepMinutes, start?, end?, constraints? }) => LocalTime[]
- roundTimeToStep(time, stepMinutes, mode?: "floor"|"ceil"|"nearest")

Prop-getter simple (au choix) :

- getTimeOptionProps(time) avec onPress => setTime(time) + aria-selected + aria-disabled

Tests
- liste attendue (00:00, 00:15, …)
- respecte minTime/maxTime
- respecte isTimeDisabled
- option props : disabled true empêche setTime (ou n’appelle pas)

## Étape 13 — Clamp policy DateTime avancée
### Objectif

Clarifier et fiabiliser les comportements min/max DateTime.

Si setDate conserve time mais viole min/max :
- clamp automatique

Si setTime viole min/max :
- clamp automatique

Documenter stratégie

Tests
- min/max sur même jour
- setTime avant min → clamp
- setTime après max → clamp
- setDate ajuste time si hors fenêtre

## Étape 14 — Exemple vanilla réellement exécutable
### Objectif
Permettre à quelqu’un de faire tourner l’exemple facilement.

Ajouter script pnpm :

ex: "example:vanilla"

Documenter dans README comment lancer

Tests
- Aucun test requis
- Ne rien casser

## Étape 15 — Publish readiness audit
### Objectif
Préparer v0.2 propre.

- Vérifier exports publics
- sideEffects correct

README minimal complet :
- Installation
- Exemple rapide

Controlled vs uncontrolled
- Valeurs publiques


# API cible (v1)

Objectif : fournir une instance composable (style TanStack) exposant état, actions, selectors et prop-getters.
Aucun type DOM ne doit être exposé dans l’API publique.

## Types publics
CalendarDate

Format strict : YYYY-MM-DD (zero padded)

Calendrier : grégorien uniquement

Sans timezone

```
export type CalendarDate = ${number}-${number}-${number};
```

## LocalTime

Format strict : HH:mm (zero padded)

HH = 00–23

mm = 00–59

Sans timezone

export type LocalTime = ${number}:${number};

## Contraintes

export interface DateConstraints {
  minDate?: CalendarDate;
  maxDate?: CalendarDate;
  isDateDisabled?: (date: CalendarDate) => boolean;
}

export interface TimeConstraints {
  minTime?: LocalTime;
  maxTime?: LocalTime;
  isTimeDisabled?: (time: LocalTime) => boolean;
}

export interface DateTimeConstraints {
  min?: LocalDateTime;
  max?: LocalDateTime;
  isDisabled?: (dt: LocalDateTime) => boolean;
}

export interface Constraints {
  date?: DateConstraints;
  time?: TimeConstraints;
  dateTime?: DateTimeConstraints;
}

## Formatter (injectable)

Le core ne doit pas imposer une lib de date. Le formatter est injectable.

export interface DateTimeFormatter {
  formatDate(date: CalendarDate): string;
  parseDate(input: string): CalendarDate | null;

  formatTime(time: LocalTime): string;
  parseTime(input: string): LocalTime | null;

  formatDateTime(dt: LocalDateTime): string;
  parseDateTime(input: string): LocalDateTime | null;

  getMonthLabel(visibleMonth: CalendarDate): string;
  getWeekdayLabels(weekStartsOn: 0|1|2|3|4|5|6): string[];
}

## Options 
export interface DateTimePickerOptions {
  value?: LocalDateTime | null;
  defaultValue?: LocalDateTime | null;
  onValueChange?: (next: LocalDateTime | null) => void;

  visibleMonth?: CalendarDate;
  defaultVisibleMonth?: CalendarDate;
  onVisibleMonthChange?: (next: CalendarDate) => void;

  time?: LocalTime;
  defaultTime?: LocalTime;
  onTimeChange?: (next: LocalTime) => void;

  weekStartsOn?: 0|1|2|3|4|5|6;
  formatter?: DateTimeFormatter;
  constraints?: Constraints;

  nowDate?: CalendarDate;
}

## State 
export interface DateTimePickerState {
  value: LocalDateTime | null;

  selectedDate: CalendarDate | null;
  selectedTime: LocalTime | null;

  visibleMonth: CalendarDate;
  focusedDate: CalendarDate | null;
}

## Calendar Grid / Meta
export interface CalendarCellMeta {
  date: CalendarDate;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  isToday: boolean;
}
getCalendarGrid() doit toujours retourner 42 cellules.

## Prop-getters (headless)
export type HeadlessHandler = () => void;

export interface HeadlessButtonProps {
  disabled?: boolean;
  onPress: HeadlessHandler;
  "aria-label"?: string;
}

export interface HeadlessDayProps {
  date: CalendarDate;
  disabled?: boolean;
  tabIndex: number;
  "aria-selected": boolean;
  "aria-disabled": boolean;
  onPress: HeadlessHandler;
  onKeyDown?: (key: string) => void;
}

export interface HeadlessInputProps {
  value: string;
  onChange: (next: string) => void;
  onBlur?: HeadlessHandler;
  "aria-invalid"?: boolean;
}


## Instance 
export interface DateTimePickerInstance {
  getState(): DateTimePickerState;

  setValue(next: LocalDateTime | null): void;
  setDate(next: CalendarDate | null): void;
  setTime(next: LocalTime | null): void;

  setVisibleMonth(next: CalendarDate): void;
  goToNextMonth(): void;
  goToPrevMonth(): void;

  focusDate(date: CalendarDate | null): void;
  moveFocusDate(
    dir: "left"|"right"|"up"|"down"|"home"|"end"|"pageUp"|"pageDown"
  ): void;

  getCalendarGrid(): CalendarCellMeta[];
  getMonthLabel(): string;
  getWeekdayLabels(): string[];

  isSelectableDate(date: CalendarDate): boolean;
  isSelectableTime(time: LocalTime): boolean;
  isSelectableDateTime(dt: LocalDateTime): boolean;

  getPrevMonthButtonProps(): HeadlessButtonProps;
  getNextMonthButtonProps(): HeadlessButtonProps;

  getDayProps(date: CalendarDate): HeadlessDayProps;

  getDateInputProps(): HeadlessInputProps;
  getTimeInputProps(): HeadlessInputProps;
  getDateTimeInputProps(): HeadlessInputProps;
}

## Fonction exportee 
export function createDateTimePicker(
  options?: DateTimePickerOptions
): DateTimePickerInstance;

## Parts (internes mais exportables)
export type DateParts = { y: number; m: number; d: number };
export type TimeParts = { h: number; min: number };

# Décisions clés (v1)

- Le core ne gère pas de timezone.
- Les valeurs publiques sont sérialisables (YYYY-MM-DD, HH:mm, YYYY-MM-DDTHH:mm).
- Les prop-getters ne dépendent d’aucun type DOM.
- nowDate est injectable pour rendre isToday testable.
- getCalendarGrid() retourne toujours 42 cellules.
- Aucune utilisation publique de Date natif.
- Core idéalement dependency-free (sinon DateAdapter interne obligatoire).

# Règles Globales
- Chaque étape doit inclure des tests.
- Aucune étape ne peut être marquée DONE si les tests ne passent pas.
- Toute progression doit être documentée dans `docs/progress.md`.
- Toute modification d’architecture doit être documentée dans `docs/plan.md`.
- Le code doit être strictement typé (pas de `any` non justifié).
