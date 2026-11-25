# UI-Redesign „Warm & ruhig“ Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Die App bekommt den Stil „Warm & ruhig“ mit Phosphor-Duotone-Icons, eine echte mobile App-Oberfläche (Tagesleiste, Tagesfokus, untere Navigation, schwebender Knopf) und ein ruhiges Desktop-Wochenraster, beide mit Gruppierung nach Mahlzeiten-Abschnitten.

**Architecture:** Zustand bleibt in `AppComponent` (`@Input/@Output`, OnPush, Modul-basiert). Reine Hilfsfunktionen (Gruppierung, Zähler, Tageswechsel) liegen getestet in `src/app/services/meal-plan-view.ts`. Ein `BreakpointObserver`-Signal in `AppComponent` entscheidet, ob die mobile Shell oder das Desktop-Layout gerendert wird; Daten werden einmal geladen.

**Tech Stack:** Angular 21 (NgModule, OnPush), Angular Material/CDK 21 (Dialog, BottomSheet, BreakpointObserver), Tailwind 4.1 + SCSS, Transloco, ngx-drag-drop, dayjs, `@phosphor-icons/web`, Karma + Jasmine.

**Spec:** `docs/superpowers/specs/2026-11-25-ui-redesign-design.md` – vor jeder Task lesen. Mockups: `.superpowers/brainstorm/222-1795591397/content/visual-style-v3.html` (Variante 1) und `desktop.html` (Stil 1; Navigationsblock und Abschnitts-Umschalter dort gelten **nicht**).

## Global Constraints

- Tokens hell: Hintergrund `#f7f5f2`, Fläche `#ffffff`, gedämpfte Fläche `#f2efeb`, Text `#292524` / `#57534e` / `#6b645e`, Akzent `#b4440f` (Text weiß), Akzent-Fläche `#f6ebe4`, Haarlinie `rgba(41,37,36,.08)`, Linie stark `rgba(41,37,36,.16)`
- Tokens dunkel: Hintergrund `#1c1917`, Fläche `#292524`, gedämpft `#322d2a`, Text `#f5f1ec` / `#c9c0b6` / `#a39a90`, Akzent `#e0703f` (Text `#1c1917`), Akzent-Fläche `rgba(224,112,63,.14)`, Haarlinie `rgba(245,241,236,.08)`; keine Schatten im Dunkelmodus
- Schatten hell: Karte `0 1px 2px rgba(0,0,0,.05)`, schwebender Knopf `0 4px 12px rgba(0,0,0,.16)`; keine farbigen Schatten, keine Glows, keine Farbverläufe auf Flächen, kein `backdrop-filter`
- 4-px-Raster; Radius Bedienelemente 8–10, Karten 12–16, Sheets/Dialoge 20
- Schriften: Outfit 600 für Titel, DM Sans 400/500 (selten 600); Größen 12/13/14/16/20/24; keine Großbuchstaben-Labels; `tabular-nums` für Zahlen; Text nie unter 12 px
- Tippziele ≥ 40 px, untere Navigation ≥ 44 px, Safe-Area unten `env(safe-area-inset-bottom)`
- Icons: Phosphor Duotone `<i class="ph-duotone ph-<name>"></i>`, 18 px (Navigation 22, schwebender Knopf 24), Farbe = Textrolle; Icon-only-Knöpfe mit übersetztem `aria-label`
- Bewegung: nur `transition-colors` / `transition-[transform,opacity]`, Easing `cubic-bezier(.2,0,0,1)`, 150 ms Feedback / 200 ms Einblenden; `prefers-reduced-motion: reduce` schaltet Übergänge ab
- Alle neuen Texte in `src/assets/i18n/de.json` **und** `en.json`; keine Ausrufezeichen, keine Punkte an kurzen Labels, keine Emojis
- Breakpoint mobil/desktop: `(min-width: 768px)` (= Tailwind `md`)
- Kein Routing-Umbau; `changeWeek(offset)` bleibt die einzige Wochen-Navigation
- Conventional Commits; jede Commit-Message endet mit `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
- Testlauf: `npx ng test --watch=false --browsers=ChromeHeadless`; Build: `npm run build`

## Review Focus

1. Mahlzeit mit `section_id`, die es in Grocy nicht (mehr) gibt → landet in „Ohne Abschnitt“, geht nie verloren (Test in Task 2)
2. Mahlzeiten ohne passendes Rezept (`type` ≠ `recipe` oder `recipe_id` nicht in `recipes`) → werden nicht gerendert und nicht gezählt, nichts stürzt ab (Test in Task 2)
3. Tageswechsel über Sonntag/Montag und über den Jahreswechsel (KW 52/53 → KW 1) → richtiger Tag, Woche wechselt genau um 1 (Test in Task 2)
4. Woche wird gewechselt, gewählter Tag liegt nicht mehr in der Woche → heute, falls in der Woche, sonst Montag (Test in Task 2)
5. Grocy liefert keine Abschnitte oder nur den Standardabschnitt → genau eine Gruppe ohne Überschrift (Test in Task 2)

---

### Task 1: Tokens, Grundstile und Phosphor einbinden

**Files:**
- Modify: `package.json` (+ `@phosphor-icons/web@^2.1.1`, Installation mit `npm install --legacy-peer-deps`)
- Modify: `angular.json` (`styles`: `node_modules/@phosphor-icons/web/src/duotone/style.css` vor `src/styles.scss`)
- Modify: `src/styles.scss`

**Interfaces:**
- Produces CSS-Variablen auf `:root` und `.dark`: `--bg`, `--surface`, `--surface-muted`, `--text-primary`, `--text-secondary`, `--text-muted`, `--accent`, `--accent-on`, `--accent-surface`, `--line`, `--line-strong`, `--shadow-card`, `--shadow-fab`, `--ease`, `--font-display`, `--font-body`
- Produces globale Klassen: `.btn` (40 px, Radius 10, gedämpfte Fläche), `.btn-primary` (Akzent), `.btn-icon` (40×40), `.surface-card` (Fläche, Radius 12, Haarlinie als `inset` box-shadow + `--shadow-card`), `.field` (Eingabefeld 44 px, Radius 10), `.text-muted`/`.text-secondary` falls nicht per Tailwind gelöst
- Übergang: die alten Klassen `glass-panel`, `glass-card`, `glass-card-strong`, `glass-button`, `glass-input`, `control-btn`, `control-btn-primary`, `control-btn-danger`, `control-select`, `action-pill` bleiben vorerst bestehen, zeigen aber auf die neuen Tokens (kein Blur, kein Verlauf), damit die App zwischen Tasks lauffähig bleibt. Task 9 entfernt sie.

- [ ] **Step 1:** Paket installieren und Stylesheet in `angular.json` eintragen.
- [ ] **Step 2:** In `styles.scss` Glas-, Verlaufs- und Glow-Tokens (`--glass-*`, `--gradient-*`, `--shadow-glow`, `--accent-glow`) durch die Tokens aus „Global Constraints“ ersetzen; `body` bekommt `background: var(--bg)`, kein `--gradient-mesh`. `prefers-reduced-motion`-Block ergänzen.
- [ ] **Step 3:** Verifizieren: `npm run build` → erfolgreich. `npm start`, App im Browser hell und dunkel öffnen: keine Milchglas-/Verlaufsflächen mehr, Text lesbar.
- [ ] **Step 4:** Commit `style: replace glass tokens with warm neutral design tokens`

---

### Task 2: Reine Ansichtslogik (Gruppierung, Zähler, Tageswechsel)

**Files:**
- Create: `src/app/services/meal-plan-view.ts`
- Create: `src/app/services/meal-plan-view.spec.ts`
- Create: `src/app/interfaces/section-group.interface.ts`

**Interfaces:**
- Produces:
  - `interface SectionGroup { sectionId: number; name: string | null; meals: Partial<Meal>[] }` (`name` null = „Ohne Abschnitt“)
  - `NO_SECTION_ID = -1`
  - `visibleMeals(meals: Partial<Meal>[], recipes: Recipe[] | null): Partial<Meal>[]` – nur `type === 'recipe'` mit `recipe_id` in `recipes`
  - `mealsForDay(meals: Partial<Meal>[], day: Date): Partial<Meal>[]` – Vergleich über `dayjs(day).format('YYYY-MM-DD')`
  - `groupBySection(meals: Partial<Meal>[], sections: MealPlanSection[] | null): SectionGroup[]` – alle echten Abschnitte (id ≠ -1) nach `sort_number`, auch leer; danach „Ohne Abschnitt“ nur wenn er Mahlzeiten enthält **oder** es keine echten Abschnitte gibt; unbekannte `section_id` → „Ohne Abschnitt“
  - `showSectionHeadings(groups: SectionGroup[]): boolean` – `groups.length > 1`
  - `countPlannedDays(meals: Partial<Meal>[], weekStart: Dayjs): number` – Tage Mo–So mit ≥ 1 Mahlzeit
  - `shiftDay(day: Dayjs, delta: 1 | -1, weekStart: Dayjs): { day: Dayjs; weekOffset: -1 | 0 | 1 }`
  - `initialDay(weekStart: Dayjs, today: Dayjs = dayjs()): Dayjs` – heute, wenn in der Woche, sonst `weekStart`

- [ ] **Step 1: Tests schreiben** (`meal-plan-view.spec.ts`), mindestens:
  - `groupBySection` mit Abschnitten `[{id:2,name:'Abendessen',sort_number:2},{id:1,name:'Frühstück',sort_number:1}]` und Mahlzeiten in 1, 2 → Reihenfolge `[1,2]`, keine „Ohne Abschnitt“-Gruppe
  - Mahlzeit mit `section_id:'99'` → letzte Gruppe `{sectionId:-1,name:null}` enthält sie
  - `sections = []` oder nur `{id:-1}` → genau eine Gruppe, `showSectionHeadings` false
  - leerer echter Abschnitt bleibt als Gruppe mit `meals: []` erhalten
  - `visibleMeals`: Mahlzeit `type:'note'` und Mahlzeit mit unbekannter `recipe_id` fallen raus
  - `countPlannedDays`: Mahlzeiten am Mo (2×), Mi, nächster Mo → `2`
  - `shiftDay(So 29.11.2026, 1, weekStart Mo 23.11.)` → `{day: Mo 30.11., weekOffset: 1}`; `shiftDay(Mo 23.11., -1, …)` → `{day: So 22.11., weekOffset: -1}`; `shiftDay(Mi, 1, …)` → `weekOffset: 0`
  - Jahreswechsel: `shiftDay(So 03.01.2027, 1, weekStart Mo 28.12.2026)` → `Mo 04.01.2027`, `weekOffset: 1`
  - `initialDay(weekStart 23.11., today 25.11.)` → 25.11.; `initialDay(weekStart 30.11., today 25.11.)` → 30.11.
- [ ] **Step 2:** `npx ng test --watch=false --browsers=ChromeHeadless` → neue Tests FAIL (Modul fehlt)
- [ ] **Step 3:** Funktionen implementieren (`section_id` ist String, mit `Number()` vergleichen).
- [ ] **Step 4:** Tests laufen → PASS
- [ ] **Step 5:** Commit `feat(plan): add pure meal plan view helpers`

---

### Task 3: Icons auf Phosphor Duotone umstellen

**Files:**
- Modify: alle Templates mit `<mat-icon …>` unter `src/app/` (17 `svgIcon`-Namen + Ligatur `auto_awesome`)
- Modify: `src/app/app.module.ts` (MDI-`addSvgIconSet` und `MatIconModule`, sofern ungenutzt, entfernen)
- Modify: `package.json` (`@mdi/angular-material` entfernen, wenn kein Verweis bleibt)
- Modify: `src/assets/i18n/de.json`, `en.json` (aria-Labels)

**Interfaces:**
- Consumes: Phosphor-Stylesheet aus Task 1
- Mapping wie Spec „Icons“; `auto_awesome` entfällt (KI-Etikett wird in Task 4 Text)

- [ ] **Step 1:** Jedes `<mat-icon svgIcon="x">` durch `<i class="ph-duotone ph-<mapping>" aria-hidden="true"></i>` ersetzen; Icon-only-Knöpfe bekommen `[attr.aria-label]="'KEY' | transloco"` (vorhandene Keys wie `PREVIOUS_WEEK` nutzen, fehlende anlegen: `CLOSE`, `REFRESH_RECIPES`, `SHARE`, `REMOVE`, `OPEN_RECIPE`, `MARK_COOKED`).
- [ ] **Step 2:** Verifizieren: `grep -rn "mat-icon" src/app` → keine Treffer; `npm run build` → erfolgreich; Specs, die `MatIconModule`/`MatIconRegistry` stubben, anpassen; Testlauf → PASS.
- [ ] **Step 3:** Commit `refactor(icons): replace Material Design Icons with Phosphor duotone`

---

### Task 4: Rezeptkarte neu (sichtbare Aktionen, keine Wischgeste)

**Files:**
- Modify: `src/app/_components/grocy-recipe-card/grocy-recipe-card.component.{ts,html,scss,spec.ts}`
- Modify: `de.json`, `en.json` (`COOKED: "Gekocht"/"Cooked"`, `RECIPE: "Rezept"/"Recipe"`, `REMOVE: "Entfernen"/"Remove"`, `AI_SUGGESTION: "KI-Vorschlag"/"AI suggestion"`, `SERVINGS: "{{count}} Portionen"/"{{count}} servings"`)

**Interfaces:**
- Produces: `@Input() variant: 'large' | 'compact' = 'compact'` (`large` = mobiles Tagesdetail, Bild 136 px, Knöpfe „Gekocht“/„Rezept“/Papierkorb sichtbar; `compact` = Desktop-Raster, Bild 16:10, Aktionen als 28-px-Knöpfe oben rechts bei `:hover` und `:focus-within`, ganze Karte `dndDraggable` mit `{ recipe, meal }`)
- Bestehende Methoden `doneMeal`, `deleteMeal`, `openRecipe` bleiben; Touch-/Swipe-Code (`swipeOffset`, `onTouch*`, `onSwipeAction`, `resetSwipe`) wird gelöscht

- [ ] **Step 1: Tests anpassen/schreiben:** Karte mit `meal.done = 0` zeigt Knopf mit Label „Gekocht“ (`aria-label` oder Text) und Entfernen; mit `done = 1` keine der beiden, Element hat Klasse `is-done`; `userfields.ai_planned = '1'` → Text „KI-Vorschlag“ sichtbar; `variant='compact'` rendert `dndDraggable`.
- [ ] **Step 2:** Testlauf → FAIL
- [ ] **Step 3:** Template/Styles nach Mockup Variante 1 bzw. `desktop.html` umsetzen; erledigt = Opacity .55 + Name durchgestrichen; Name max. 2 Zeilen (`line-clamp-2`); Portionen aus `meal.recipe_servings`.
- [ ] **Step 4:** Testlauf → PASS
- [ ] **Step 5:** Commit `feat(card): redesign recipe card with visible actions`

---

### Task 5: Planen mit Abschnitt (gemeinsame Planen-Logik, Auswahl-Sheets)

**Files:**
- Modify: `src/app/app.component.ts`
- Modify: `src/app/_components/recipe-picker-sheet/recipe-picker-sheet.component.{ts,html,scss}`
- Create: `src/app/_components/plan-recipe-sheet/plan-recipe-sheet.component.{ts,html,scss}` (in `AppModule` deklarieren)
- Create: `src/app/app.component.spec.ts`-Ergänzung oder eigener Spec für `planRecipe`/`moveMeal`
- Modify: `de.json`, `en.json` (`PLAN_FOR: "Planen für"/"Plan for"`, `SECTION: "Abschnitt"/"Section"`, `NO_SECTION: "Ohne Abschnitt"/"No section"`, `OPEN_IN_GROCY: "In Grocy öffnen"/"Open in Grocy"`)

**Interfaces:**
- Produces in `AppComponent`:
  - `planRecipe(recipe: Recipe, day: Date, sectionId: number): void` – `postMeal` mit `recipe_servings: 4`, `type: 'recipe'`, `section_id: String(sectionId)`, speichert `sectionId` als `selectedMealPlanSection` (localStorage wie heute)
  - `moveMeal(mealId: number, day: Date, sectionId: number): void` – `updateMeal({ id, day, section_id })`
  - `onAddRecipe(event: { day: Date; sectionId?: number }): void` – öffnet `RecipePickerSheetComponent`
  - `onDrop(event: DndDropEvent, day: Date, sectionId: number): void` – Mahlzeit verschieben (ohne Shift) bzw. Rezept planen; ersetzt alte Signatur
  - `onPlanRecipeFromList(recipe: Recipe): void` – öffnet `PlanRecipeSheetComponent`
- `RecipePickerSheetComponent` data: `{ recipes: Recipe[]; sections: MealPlanSection[]; sectionId: number; onRefresh?: () => void }`; dismiss-Wert `{ recipe: Recipe; sectionId: number } | undefined`; Abschnitts-Auswahl als Segment-/Chip-Reihe oben, ausgeblendet wenn `showSectionHeadings(groupBySection([], sections))` false
- `PlanRecipeSheetComponent` data: `{ recipe: Recipe; weekStart: Dayjs; sections: MealPlanSection[]; sectionId: number }`; dismiss-Wert `{ day: Date; sectionId: number } | { openInGrocy: true } | undefined`; Tageswahl Mo–So der Woche als 7 Knöpfe wie Tagesleiste

- [ ] **Step 1: Tests schreiben:** `planRecipe(recipe, 2026-11-26, 2)` ruft `grocyService.postMeal` mit `{ day: '2026-11-26', recipe_id, recipe_servings: 4, section_id: '2', type: 'recipe' }` und setzt `localStorage.selectedMealPlanSection = '2'`; `onDrop` mit `data.meal` ohne Shift ruft `updateMeal({ id, day, section_id: '3' })`; mit Shift ruft `postMeal`.
- [ ] **Step 2:** Testlauf → FAIL
- [ ] **Step 3:** Implementieren; alte Duplikate in `onAddRecipe`/`onDrop` über `planRecipe`/`moveMeal` zusammenführen.
- [ ] **Step 4:** Testlauf → PASS; Build → erfolgreich
- [ ] **Step 5:** Commit `feat(plan): plan meals into sections from sheets and drag and drop`

---

### Task 6: Desktop – Wochenraster mit Abschnitten

**Files:**
- Modify: `src/app/_components/week-view/week-view.component.{ts,html,scss,spec.ts}`
- Modify: `src/app/_components/day-column/day-column.component.{ts,html,scss,spec.ts}`
- Modify: `src/app/_components/scheduler/scheduler.component.{ts,html,scss}` (Kopf + Fuß)
- Modify: `src/app/_components/recipe-sidebar/recipe-sidebar.component.{html,scss}`, `grocy-recipe-list` (Zeilen 44 px, Bild 36 px, Ziehgriff)
- Modify: `de.json`, `en.json` (`TODAY: "Heute"/"Today"`, `PLAN_MEAL: "Planen"/"Plan"`, `DROP_HERE: "Hier ablegen"/"Drop here"`, `DAYS_PLANNED: "{{count}} von 7 Tagen geplant"/"{{count}} of 7 days planned"`, `SETTINGS: "Einstellungen"/"Settings"`, `IMPORT_RECIPE` falls fehlt)

**Interfaces:**
- Consumes: `visibleMeals`, `mealsForDay`, `groupBySection`, `showSectionHeadings`, `countPlannedDays` (Task 2); `GrocyRecipeCardComponent variant='compact'` (Task 4); `onDrop(event, day, sectionId)`, `onAddRecipe({day, sectionId})` (Task 5)
- `WeekViewComponent`: genau eine Woche; neues `@Input() sections: MealPlanSection[] | null`; Outputs `drop: { event: DndDropEvent; day: Date; sectionId: number }`, `addRecipe: { day: Date; sectionId: number }`; `dragOver`-Output entfällt (wird nirgends genutzt)
- `DayColumnComponent`: `@Input() groups: SectionGroup[]`, `@Input() showHeadings: boolean`; eine `dndDropzone` pro Gruppe
- `SchedulerComponent`: neuer Output `openSettings: void`; Abschnitts-`<select>` und `sectionChange` entfallen; Fuß zeigt `DAYS_PLANNED` + `Grocy {{version}}`
- `AppComponent`: Desktop-Layout = Seitenleiste 272 px + Scheduler; `openSettings()` öffnet in Task 8 das Panel (bis dahin leere Methode)

- [ ] **Step 1: Tests:** `WeekViewComponent` erzeugt 7 Spalten für eine Woche (nicht 14); `DayColumnComponent` mit zwei Gruppen rendert zwei Überschriften und zwei Dropzones, mit `showHeadings=false` keine Überschrift; heutiger Tag hat Klasse `is-today`.
- [ ] **Step 2:** Testlauf → FAIL
- [ ] **Step 3:** Umsetzen nach `desktop.html` (Stil 1) mit den Spec-Abweichungen (kein Navigationsblock in der Seitenleiste, Zahnrad + Teilen im Kopf, „Neu laden“ neben der Suche).
- [ ] **Step 4:** Testlauf → PASS; Build; im Browser ≥ 1280 px: Ziehen aus Seitenleiste in einen Abschnitt, Karte zwischen Tagen und Abschnitten verschieben, Shift-Ziehen kopiert.
- [ ] **Step 5:** Commit `feat(desktop): single-week grid grouped by meal plan section`

---

### Task 7: Mobile Shell (Tagesleiste, Tagesdetail, Navigation, Plus-Knopf)

**Files:**
- Create: `src/app/_components/bottom-nav/bottom-nav.component.{ts,html,scss}`
- Create: `src/app/_components/day-strip/day-strip.component.{ts,html,scss,spec.ts}`
- Create: `src/app/_components/day-detail/day-detail.component.{ts,html,scss,spec.ts}`
- Create: `src/app/_components/mobile-shell/mobile-shell.component.{ts,html,scss}`
- Modify: `src/app/app.module.ts`, `src/app/app.component.{ts,html}`
- Modify: `de.json`, `en.json` (`NAV_PLAN: "Plan"`, `NAV_RECIPES: "Rezepte"/"Recipes"`, `NAV_SETTINGS: "Einstellungen"/"Settings"`, `MEAL_PLAN_TITLE: "Essensplan"/"Meal plan"`, `TODAY_WEEKDAY: "Heute, {{weekday}}"/"Today, {{weekday}}"`, `MEAL_COUNT: "{{count}} Gerichte"/"{{count}} meals"` (Singular `MEAL_COUNT_ONE`), `PLAN_A_MEAL: "Gericht planen"/"Plan a meal"`, `WEEK_SHORT: "KW"/"Wk"`)

**Interfaces:**
- Consumes: Task-2-Helfer, Karte `variant='large'`, `onAddRecipe`, `onPlanRecipeFromList`, `changeWeek`
- `type MobileTab = 'plan' | 'recipes' | 'settings'`
- `AppComponent`: `isDesktop = toSignal(breakpointObserver.observe('(min-width: 768px)').pipe(map(r => r.matches)))`; `mobileTab: MobileTab = 'plan'`; `selectedDay: Dayjs = initialDay(currentWeekStart)`; `selectDay(day: Dayjs)`; `shiftSelectedDay(delta: 1 | -1)` nutzt `shiftDay` und ruft bei `weekOffset ≠ 0` `changeWeek(weekOffset)`; `changeWeek` setzt danach `selectedDay = initialDay(currentWeekStart)`, außer der Aufruf kam von `shiftSelectedDay`
- `app.component.html`: `@if (isDesktop()) { Desktop-Layout aus Task 6 } @else { <app-mobile-shell …> }`
- `DayStripComponent`: `@Input() weekStart: Dayjs`, `@Input() selectedDay: Dayjs`, `@Input() plannedDays: Set<string>` (`YYYY-MM-DD`), `@Output() daySelect: Dayjs`
- `DayDetailComponent`: `@Input() day: Dayjs`, `@Input() groups: SectionGroup[]`, `@Input() showHeadings: boolean`, `@Input() recipes: Recipe[]`, `@Output() addRecipe: { day: Date; sectionId: number }`, `@Output() swipe: 1 | -1` (horizontales Wischen > 50 px und dominanter als vertikal; vertikales Scrollen bleibt möglich)
- `BottomNavComponent`: `@Input() active: MobileTab`, `@Output() activeChange: MobileTab`; Icons `calendar-blank` / `cooking-pot` / `gear-six`
- Rezepte-Tab: `RecipeSidebarComponent` wiederverwenden (Suche, Import, Neu laden); Antippen eines Rezepts → `onPlanRecipeFromList`
- Einstellungen-Tab: Platzhalter, Task 8 setzt die Komponente ein

- [ ] **Step 1: Tests:** `DayStripComponent` rendert 7 Tage, Punkt nur bei Tagen in `plannedDays`, Klick emittiert den Tag; `DayDetailComponent` zeigt „Gericht planen“ in leerer Gruppe und emittiert `addRecipe` mit deren `sectionId`; `AppComponent.shiftSelectedDay(1)` am Sonntag ruft `changeWeek(1)` und wählt Montag.
- [ ] **Step 2:** Testlauf → FAIL
- [ ] **Step 3:** Umsetzen nach Mockup Variante 1 ohne Abschnitts-Chips; schwebender Knopf öffnet `onAddRecipe({ day: selectedDay, sectionId: selectedMealPlanSection ?? -1 })`; Kopf zeigt „Heute“-Knopf, wenn `selectedDay` nicht heute ist (setzt Woche und Tag auf heute).
- [ ] **Step 4:** Testlauf → PASS; Build; im Browser bei 390×844 (DevTools-Gerät): Start auf heute, Tag antippen, Wischen über Sonntag wechselt Woche, Plus plant in Abschnitt, Rezepte-Tab plant über Sheet, nichts scrollt horizontal.
- [ ] **Step 5:** Commit `feat(mobile): app shell with day strip, day detail and bottom navigation`

---

### Task 8: Einstellungen (mobiler Tab und Desktop-Panel)

**Files:**
- Create: `src/app/_components/settings-panel/settings-panel.component.{ts,html,scss,spec.ts}`
- Modify: `src/app/app.component.{ts,html}` (`openSettings()` öffnet `MatDialog` mit `position: { right: '0' }`, `height: '100vh'`, `width: '400px'`, `panelClass: 'settings-panel-dialog'`)
- Modify: `src/app/_components/scheduler-controls/*` – Teilen-Logik (`onShare`) in `SettingsPanelComponent` bzw. einen gemeinsamen Ort verschieben; Komponente löschen, wenn danach leer
- Modify: `src/app/_components/theme-toggle/*` (als Segment Hell/Dunkel/System in Einstellungen)
- Modify: `made-by-banner` (als ruhige Textzeile im Panel)
- Modify: `de.json`, `en.json` (`THEME: "Darstellung"/"Appearance"`, `THEME_LIGHT`, `THEME_DARK`, `THEME_SYSTEM`, `GROCY_CONNECTION: "Grocy-Verbindung"/"Grocy connection"`, `LOGOUT: "Abmelden"/"Sign out"`, `SHARE_LINK: "Zugang teilen"/"Share access"`, `LINK_COPIED: "Link kopiert"/"Link copied"`, `RELEASE_NOTES: "Neuigkeiten"/"What's new"`)

**Interfaces:**
- `SettingsPanelComponent`: `@Input() grocyInfo: GrocySystemInfo | null`, `@Output() resetConfig: void`, `@Output() showReleaseNotes: void`; liest URL über `AppConfigService.getConfig().grocyUrl`; Theme über `DarkModeService`
- Hinweis im Panel unter „Zugang teilen“: der Link enthält den API-Key (heute schon so, jetzt sichtbar gemacht)
- `AppComponent.showReleaseNotes()` öffnet den bestehenden Release-Notes-Dialog mit der aktuellen Version (Logik aus `checkForReleaseNotes` wiederverwenden)

- [ ] **Step 1: Tests:** Panel zeigt Grocy-Version aus `grocyInfo`; Klick auf „Abmelden“ emittiert `resetConfig`; Theme-Segment „Dunkel“ ruft `DarkModeService.setTheme('dark')`.
- [ ] **Step 2:** Testlauf → FAIL
- [ ] **Step 3:** Umsetzen; mobil im Einstellungen-Tab, Desktop über Zahnrad.
- [ ] **Step 4:** Testlauf → PASS; Build; Checkliste „jede heutige Funktion erreichbar“ mobil und Desktop abhaken: Woche zurück/vor/heute, Planen, Verschieben (Desktop), Gekocht, Entfernen, Rezept öffnen, Import, Neu laden, Teilen, Abmelden, Theme, Release Notes, Grocy-Version, GitHub/Blog-Link.
- [ ] **Step 5:** Commit `feat(settings): settings tab and desktop settings panel`

---

### Task 9: Übrige Oberflächen und Aufräumen

**Files:**
- Modify: `grocy-config`, `recipe-import-dialog`, `release-notes-modal`, `recipe-picker-sheet` (Sheet-Griff, Radius 20, Safe-Area) Templates/Styles
- Modify: `src/styles.scss` (Hot-Toast an Tokens; Material-Dialog/BottomSheet-Container: Fläche, Radius 20, keine Schatten im Dunkelmodus; alte `glass-*`, `control-*`, `action-pill`, `.light`-Altlasten entfernen)
- Modify: `angular.json` (`angular-calendar.css` nur entfernen, wenn `angular-calendar` nirgends genutzt wird – vorher `grep`)
- Delete: ungenutzte Komponenten/Pipes nach `grep` (z. B. `dark-mode-toggle`, `scheduler-controls`, `IsWeekendPipe`), inkl. Deklarationen und Specs

- [ ] **Step 1:** Oberflächen auf Tokens/Klassen aus Task 1 umstellen; Felder 44 px, klare Fehlermeldung im Konfig-Formular.
- [ ] **Step 2:** Verifizieren: `grep -rnE "glass-|control-btn|action-pill|backdrop-blur|bg-gradient|violet" src/app src/styles.scss` → keine Treffer; Build; Testlauf → PASS.
- [ ] **Step 3:** Commit `style: apply new design to dialogs, config and toasts; remove legacy styles`

---

### Task 10: Abschlussprüfung

- [ ] **Step 1:** `npm run build` und Testlauf → beide grün; Ausgabe festhalten.
- [ ] **Step 2:** Im Browser hell + dunkel, 390 px und 1440 px: Kontrast der gedämpften Texte (DevTools-Kontrastanzeige ≥ 4.5:1), Tastatur-Fokus sichtbar auf Karten-Aktionen, `prefers-reduced-motion` schaltet Übergänge ab, keine Emojis, keine Texte < 12 px.
- [ ] **Step 3:** Abweichungen beheben, Commit `fix(ui): polish after final review` (nur falls nötig).
