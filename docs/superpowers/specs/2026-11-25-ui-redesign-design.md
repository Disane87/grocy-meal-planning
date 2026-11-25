# UI/UX-Redesign „Warm & ruhig“ – Design

Datum: 2026-11-25 · Status: Entwurf zur Freigabe
Mockups: `.superpowers/brainstorm/222-1795591397/content/visual-style-v3.html` (mobil, Variante 1) und `desktop.html` (Desktop, Variante 1)

## Absicht

Die App soll sich wie ein Werkzeug für die Essensplanung im Haushalt anfühlen und vor allem am Handy deutlich besser bedienbar sein. Heute ist die mobile Ansicht eine geschrumpfte Desktop-Ansicht: wichtige Funktionen sind ausgeblendet (Abschnittswahl, Abmelden, Theme), Aktionen auf Karten verstecken sich hinter einer Wischgeste, Bilder sind 80 px hoch, und der Start ist nicht „heute“.

Am Handy müssen zwei Dinge gut gehen: schnell nachschauen, was ansteht, und die Woche planen.

## Ziele

- Mobil: App-Aufbau mit unterer Navigation, Tagesleiste, Startpunkt „heute“, große Rezeptkarten mit sichtbaren Aktionen, schwebender Hinzufügen-Knopf.
- Alle Funktionen auch mobil erreichbar (Abschnitt, Abmelden, Theme, Teilen, Import, Neu laden).
- Desktop: gleiche Gestaltung, eine Woche im 7-Spalten-Raster mit Drag & Drop, ruhige Seitenleiste.
- Visuell: Stil „Warm & ruhig“ – neutrale warme Flächen statt Milchglas, ein Akzent (Terracotta), Phosphor Icons in Duotone, keine Emojis, keine farbigen Glows.
- Hell- und Dunkelmodus bleiben.

## Nicht-Ziele

- Keine neuen Funktionen (z. B. Einkaufsliste, Wochenvorlagen, Endlos-Agenda). Einzige bewusste Verhaltensänderung: Gruppierung nach Abschnitten (siehe dort).
- Keine Änderung an Grocy-API, Server, Routing-Logik oder Datenmodell.
- Keine Umstellung auf Standalone-Komponenten oder andere State-Verwaltung.
- Kein Austausch von Angular Material (Dialog, Bottom-Sheet bleiben).

## Anti-Ziele (wäre ein Fehlschlag, auch wenn es technisch läuft)

- Mobil wirkt weiter wie verkleinerter Desktop.
- Eine Funktion, die es heute gibt, ist nach dem Umbau nicht mehr erreichbar.
- Drag & Drop am Desktop wird schlechter.
- Neue Deko (Glas, Verläufe, Glows, Emojis) ersetzt die alte.

## Rahmenbedingungen

- Angular 21, Modul-basiert (`AppModule`), `OnPush`, Zustand in `AppComponent` über `@Input/@Output`.
- Tailwind 4.1 + SCSS, globale Tokens in `src/styles.scss` (`:root` hell, `.dark` dunkel, gesetzt durch `dark-mode.service.ts`).
- i18n über Transloco (`src/assets/i18n/en.json`, `de.json`): alle neuen Texte in beiden Sprachen.
- Drag & Drop über `ngx-drag-drop` (`dndDraggable`/`dndDropzone`).
- Wochen-Navigation bleibt wie heute: `currentWeekStart` ist lokaler Zustand in `AppComponent`, `?week=` wird nur beim Start gelesen (Teilen-Link). Keine Routing-Änderung. Tageswechsel über Wochengrenzen ruft `changeWeek(±1)`.
- Conventional Commits.

## Ansätze

Für den Aufbau wurden drei Richtungen betrachtet:

- **A) App-Aufbau mit Tagesleiste** – untere Navigation, Tagesleiste Mo–So mit Punkten für geplante Tage, ein Tag im Fokus. Größter Sprung für mobil, größter Umbau. **Gewählt.**
- B) Durchlaufende Agenda – alle Tage als Zeilen untereinander. Gute Übersicht, wenig Aufwand, aber nüchtern, Bilder kommen kaum zur Geltung.
- C) Nur neu gestalten – Aufbau bleibt. Schnell, aber kein spürbarer Sprung.

Für den Look wurden drei Stile gezeigt: Warm & ruhig, Küchenmagazin (Serifen, große Fotos), Kompakt & klar (kühl, Listen). **Gewählt: Warm & ruhig**, weil es den bestehenden Charakter (Schriften, Terracotta) behält und nur das Rauschen entfernt.

## Entschiedene Gestaltung

### Richtung (unslop)

- Charakter: herzlich, alltagstauglich, aufgeräumt
- Welt: Küche, Wochenzettel am Kühlschrank, Tageslicht
- Farbträger: das Rezeptfoto. Alles andere bleibt ruhig
- Erkennungszeichen: Punkte unter den Tagen in der Tagesleiste für geplante Tage

### Tokens (ersetzen die Glas-Tokens in `styles.scss`)

Hell:
- Hintergrund `#f7f5f2`, Fläche `#ffffff`, gedämpfte Fläche `#f2efeb`
- Text primär `#292524`, sekundär `#57534e`, gedämpft `#6b645e` (≥ 4.5:1 auf Hintergrund)
- Akzent `#b4440f` (Text darauf weiß), Akzent-Fläche `#f6ebe4`
- Haarlinie `rgba(41,37,36,.08)`, stärkere Linie `rgba(41,37,36,.16)`
- Schatten Karten `0 1px 2px rgba(0,0,0,.05)`, schwebender Knopf `0 4px 12px rgba(0,0,0,.16)`

Dunkel (Ableitung, Werte vom Umsetzer feinjustierbar, Kontrast ≥ 4.5:1 halten):
- Hintergrund `#1c1917`, Fläche `#292524`, gedämpfte Fläche `#322d2a`
- Text primär `#f5f1ec`, sekundär `#c9c0b6`, gedämpft `#a39a90`
- Akzent `#e0703f` (Text darauf `#1c1917`), Akzent-Fläche `rgba(224,112,63,.14)`
- Haarlinie `rgba(245,241,236,.08)`; Tiefe über Flächenstufen, keine Schatten

Form:
- 4-px-Raster für alle Abstände
- Radius: Bedienelemente 8–10, Karten 12–16, Sheets/Dialoge 20; inneres Radius = äußeres minus Innenabstand
- Schrift: Outfit (Titel, 600), DM Sans (Text, 400/500, selten 600); Größen 12 / 13 / 14 / 16 / 20 / 24; keine Großbuchstaben-Labels; `tabular-nums` für Zahlen
- Mindestgröße für Text 12 px, Tippziele mindestens 40 px (Navigation 44+)
- Bewegung: nur `transition-colors` / `transition-[transform,opacity]`, eine Easing-Kurve, 150 ms Feedback, 200 ms Einblenden; `prefers-reduced-motion` respektieren

### Icons

- Phosphor Icons, Stil **Duotone**, über das Paket `@phosphor-icons/web` (CSS-Klassen `ph-duotone ph-<name>`), Stylesheet `@phosphor-icons/web/src/duotone/style.css` in `angular.json` eingebunden.
- Alle `<mat-icon svgIcon="…">` und der Ligatur-Icon `auto_awesome` werden ersetzt. Die MDI-Registrierung in `app.module.ts` (`addSvgIconSet`) und die Abhängigkeit `@mdi/angular-material` entfallen, wenn nichts mehr darauf zeigt.
- Größe 18 px (Navigation 22 px, schwebender Knopf 24 px), Farbe = Textrolle.
- Zuordnung (Vorschlag): chevron-left/right → `caret-left/right`, calendar-today → `calendar-dot`, plus → `plus`, check → `check`, delete-outline → `trash`, open-in-app → `book-open`, drag → `dots-six-vertical`, link-plus → `link-simple`, refresh → `arrow-clockwise`, share-variant-outline → `share-network`, logout → `sign-out`, close → `x`, import → `download-simple`, content-save-outline → `floppy-disk`, github → `github-logo`, post-outline → `article`, Rezepte-Tab → `cooking-pot`, Plan-Tab → `calendar-blank`, Einstellungen → `gear-six`, Suche → `magnifying-glass`.
- Icon-Knöpfe ohne Text bekommen `aria-label` (übersetzt).

### Mobil (< `md`, 768 px)

Aufbau von oben nach unten (siehe Mockup Variante 1):

1. **Kopf**: kleine Zeile „KW 48 · 23.–29. Nov“, Titel = Name der aktiven Ansicht („Essensplan“ / „Rezepte“ / „Einstellungen“). Rechts Pfeile für Woche zurück/vor; „Heute“-Knopf erscheint, wenn nicht die aktuelle Woche oder nicht der heutige Tag gewählt ist.
2. (Keine Abschnitts-Chips – siehe „Abschnitte“ unten. Die Chips aus dem Mockup entfallen.)
3. **Tagesleiste** Mo–So: Wochentag, Datum, Punkt bei geplanten Tagen. Gewählter Tag als weiße Fläche mit Haarlinie, Datum in Akzentfarbe. Antippen wählt den Tag.
4. **Tagesinhalt**: Überschrift („Heute, Mittwoch“ bzw. „Donnerstag, 26. Nov“) plus Anzahl Gerichte des Tages (alle Abschnitte). Darunter die Abschnitte des Tages (siehe „Abschnitte“), in jedem die Gerichtskarten untereinander:
   - Bild 136 px hoch (weitere Gerichte des Tages dürfen kleiner sein, z. B. 88 px – Builder entscheidet, ob alle gleich groß sind)
   - Name, Meta (Portionen, wenn vorhanden)
   - Etikett „KI-Vorschlag“ oben links, wenn `userfields.ai_planned == '1'` (ruhige weiße Pille, kein Violett, kein Funkelsymbol)
   - Sichtbare Aktionen: „Gekocht“ (Akzent, gefüllt), „Rezept“ (öffnet in Grocy), Papierkorb (nur Icon). „Gekocht“ und Entfernen nur, solange nicht erledigt; erledigte Karten blass, Name durchgestrichen.
   - Wischgeste auf Karten entfällt.
   - „Gekocht“ hat wie heute kein Rückgängig.
   - Leerer Abschnitt: ruhige Zeile „Gericht planen“ (öffnet das Auswahl-Sheet für Tag + Abschnitt).
5. **Wischen auf dem Tagesinhalt** nach links/rechts wechselt den Tag; über Sonntag hinaus bzw. vor Montag wechselt die Woche (Route).
6. **Schwebender Knopf „+“** rechts unten über der Navigation: öffnet das bestehende Rezept-Auswahl-Sheet (`RecipePickerSheetComponent`) für den gewählten Tag; im Sheet oben Auswahl des Abschnitts (vorbelegt mit dem zuletzt genutzten, gespeichert wie heute in `localStorage.selectedMealPlanSection`). Gibt es nur einen Abschnitt, entfällt die Auswahl.
7. **Untere Navigation**, fest, mit Safe-Area-Abstand (`env(safe-area-inset-bottom)`):
   - **Plan** (Standard)
   - **Rezepte**: Rezeptliste mit Suche, „Rezept importieren“, „Neu laden“. Antippen eines Rezepts öffnet ein kleines Sheet „Planen für …“ mit Tag (aktuelle Woche) und Abschnitt, plus „In Grocy öffnen“.
   - **Einstellungen**: Theme (Hell/Dunkel/System), Grocy-Verbindung (URL anzeigen, Abmelden), Teilen-Link, Grocy-Version, Links zu GitHub/Blog, Release Notes. (Keine Sprachwahl – gibt es heute nicht.) Inhalt ist eine eigene Komponente, die auf Desktop im Einstellungs-Panel wiederverwendet wird.
   - Tabs sind lokaler Zustand in `AppComponent` (kein Routing).

Beim Start: aktuelle Woche, heutiger Tag gewählt. Ist die Route eine andere Woche, wird deren Montag gewählt.

### Desktop (≥ `md`)

Siehe `desktop.html`, Stil 1:

- **Seitenleiste** 272 px, weiße Fläche mit Haarlinie: Marke „Essensplan“ (Kochtopf-Icon in Akzent), **kein** Navigationsblock. Darunter Rezeptliste mit Zähler, Suche und „Neu laden“ (Icon-Knopf neben der Suche), Zeilen 44 px mit Vorschaubild 36 px und Ziehgriff beim Überfahren, unten „Rezept importieren“. Das „Made by“-Banner wird zu einer ruhigen Textzeile in Einstellungen. (Weicht vom Desktop-Mockup ab, das noch Plan/Rezepte/Einstellungen zeigt.)
- **Kopf**: „KW 48“ + Datumsbereich, Pfeile + „Heute“, rechts Teilen und Zahnrad (Einstellungen). Kein Abschnitts-Umschalter.
- **Einstellungen**: Zahnrad öffnet ein Seitenpanel von rechts (Material-Dialog oder Drawer) mit derselben Einstellungs-Komponente wie mobil. Das Wochenraster bleibt immer stehen.
- **Raster**: **eine Woche**, 7 Spalten, Abstand 12. Heute: Spalte mit Akzent-Fläche, Datum in Akzent, Hinweis „Heute“. In jeder Spalte die Abschnitte (siehe unten), je mit eigener Ablagefläche. Karten: Bild 16:10, Name 13 px, Meta; Aktionen (Gekocht, Rezept, Entfernen) beim Überfahren und bei Tastaturfokus oben rechts; ganze Karte ziehbar. Ablagefläche mit „Planen“ (beim Überfahren sichtbar, bei leerem Abschnitt immer), beim Ziehen hervorgehoben mit „Hier ablegen“. Ablegen setzt Tag **und** Abschnitt. Klick auf „Planen“ öffnet dasselbe Auswahl-Sheet für Tag + Abschnitt.
- **Fuß**: „5 von 7 Tagen geplant“ (Tage mit mindestens einem Gericht, alle Abschnitte) links, Grocy-Version rechts, gedämpfter Text. Ersetzt die farbigen Versions-Badges.
- Mehrere Wochen untereinander (heute in `WeekViewComponent`) entfallen zugunsten einer Woche.

### Abschnitte (Mealplan-Sections)

Heute filtern Abschnitte die Ansicht nicht; das `<select>` bestimmt nur, in welchen Abschnitt neue Gerichte kommen. Neu (entschieden): **Gerichte werden pro Tag nach Abschnitt gruppiert.**

- Reihenfolge nach `sort_number` aus Grocy. Überschrift = Abschnittsname, 13 px, sekundäre Textfarbe, optional mit `time_info` gedämpft daneben.
- Grocy-Standardabschnitt (id `-1`, kein Name) heißt „Ohne Abschnitt“ und steht zuletzt; er erscheint nur, wenn er Gerichte enthält oder es sonst keine Abschnitte gibt.
- Gibt es nur einen Abschnitt, werden keine Überschriften gezeigt.
- Mobil: leere Abschnitte zeigen eine Zeile „Gericht planen“. Desktop: leere Abschnitte zeigen nur die Ablagefläche mit Abschnittsname.
- Planen (Sheet, Drag & Drop, Ablagefläche) setzt `section_id` des Ziels. Verschieben einer Karte per Drag & Drop in einen anderen Abschnitt ändert Tag und `section_id`.
- Das `<select>` in `scheduler-controls` entfällt; `selectedMealPlanSection` bleibt nur als Vorbelegung im Auswahl-Sheet.

### Weitere Oberflächen

- **Erstkonfiguration** (`grocy-config`): gleiche Tokens, zentrierte Karte, Felder 44 px hoch, klare Fehlermeldung.
- **Rezept-Import-Dialog**, **Release-Notes-Dialog**, **Rezept-Auswahl-Sheet**: Glas-Klassen durch Flächen-Tokens ersetzen, Radius 20, Icons Phosphor; Sheet mit Griff oben und Safe-Area unten.
- **Toasts** (`@ngxpert/hot-toast`): an Tokens anpassen.
- Globale Klassen `glass-*`, `control-btn*`, `action-pill`, Verlaufs-Hintergrund (`--gradient-mesh`) werden ersetzt bzw. entfernt.

### Texte

Neue/geänderte Schlüssel in `de.json` und `en.json`: z. B. „Gekocht/Cooked“, „Rezept/Recipe“, „Entfernen/Remove“, „Gericht planen/Plan a meal“, „Heute/Today“, „KI-Vorschlag/AI suggestion“, „Plan“, „Rezepte/Recipes“, „Einstellungen/Settings“, „Hier ablegen/Drop here“, „{n} von 7 Tagen geplant/{n} of 7 days planned“, Bedienhilfen-Labels. Keine Ausrufezeichen, keine Punkte an kurzen Labels.

## Dem Umsetzer überlassen

- Aufteilung in Komponenten (z. B. neue `bottom-nav`, `day-strip`, `day-detail`, `settings-panel`; ob `week-view`/`day-column` umgebaut oder neu geschrieben werden).
- Umsetzung der Wischgeste für Tageswechsel (eigene Touch-Handler wie in der heutigen Karte oder CSS Scroll-Snap).
- Feinwerte im Dunkelmodus innerhalb der Kontrastvorgaben.
- Ob Tailwind-Theme-Variablen (`@theme`) oder CSS-Variablen in SCSS die Tokens tragen.
- Tests: bestehende Specs anpassen; neue Logik (Tageswahl, Wochenwechsel beim Wischen über Ränder, „x von 7 geplant“) bekommt Unit-Tests.

## Vom Autor entschieden (nach Prüfer-Durchlauf, bitte gegenlesen)

- Kein Routing-Umbau; Wochenwechsel bleibt lokaler Zustand.
- Mobil/Desktop: eine Komponentenstruktur; wo sich Aufbau grundlegend unterscheidet (Tagesfokus mobil vs. 7-Spalten-Raster), wird per `BreakpointObserver`-Signal genau eine Variante gerendert, nicht beide per CSS versteckt. Daten (Woche, Mahlzeiten) werden einmal geladen.
- Erreichbarkeit auf Desktop: Neu laden (Seitenleiste), Import (Seitenleiste), Teilen (Kopf), Theme + Abmelden + Version + Links (Einstellungs-Panel).
- Zähler zählen über alle Abschnitte. „Gekocht“ ohne Rückgängig wie heute.
- Keine Sprachwahl.
