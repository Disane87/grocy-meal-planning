# Product Requirements Document (PRD)
## Grocy Meal Planning

| | |
|---|---|
| **Produkt** | Grocy Meal Planning |
| **Version** | 0.3.0 |
| **Datum** | 16. Februar 2026 |
| **Status** | Aktiv in Entwicklung |
| **Repository** | GitHub – Disane87/grocy-meal-planning |
| **Live-Demo** | https://grocy-meal-planning.disane.dev/ |

---

## Inhaltsverzeichnis

1. [Produktvision & Zusammenfassung](#1-produktvision--zusammenfassung)
2. [Problemstellung](#2-problemstellung)
3. [Zielgruppe & Personas](#3-zielgruppe--personas)
4. [Produktziele & Erfolgskriterien](#4-produktziele--erfolgskriterien)
5. [Funktionale Anforderungen](#5-funktionale-anforderungen)
6. [Nicht-funktionale Anforderungen](#6-nicht-funktionale-anforderungen)
7. [Technische Architektur](#7-technische-architektur)
8. [Datenmodell](#8-datenmodell)
9. [API-Integration](#9-api-integration)
10. [User Interface & UX](#10-user-interface--ux)
11. [Internationalisierung](#11-internationalisierung)
12. [Deployment & Infrastruktur](#12-deployment--infrastruktur)
13. [Roadmap & Feature-Backlog](#13-roadmap--feature-backlog)
14. [Risiken & Abhängigkeiten](#14-risiken--abhängigkeiten)
15. [Anhang](#15-anhang)

---

## 1. Produktvision & Zusammenfassung

### Vision

Eine moderne, intuitive Web-Applikation, die die Essensplanung mit Grocy grundlegend vereinfacht – durch Drag-and-Drop-Bedienung, eine übersichtliche Wochenansicht und ein ansprechendes Design, das die native Grocy-Oberfläche ergänzt.

### Zusammenfassung

**Grocy Meal Planning** ist ein Self-Hosted-fähiges Frontend, das sich über die Grocy-REST-API mit einer bestehenden Grocy-Instanz verbindet. Nutzer können ihre Rezepte per Drag-and-Drop auf Wochentage ziehen, Mahlzeiten in Tagesabschnitte (Frühstück, Mittagessen, Abendessen) einteilen und ihren Essensplan über mehrere Wochen hinweg verwalten. Die Applikation ist als Progressive Web App (PWA) installierbar und legt besonderen Wert auf Datenschutz – es werden keine Daten an externe Server gesendet.

---

## 2. Problemstellung

### Ausgangslage

Grocy ist ein leistungsfähiges Self-Hosted ERP-System für den Haushalt. Die eingebaute Essensplanung ist jedoch funktional limitiert und bietet keine intuitive Bedienung für die schnelle Wochenplanung.

### Kernprobleme

| Problem | Auswirkung |
|---|---|
| Die native Grocy-UI für Meal Planning ist umständlich und wenig intuitiv | Nutzer vermeiden die Essensplanung oder nutzen externe Tools |
| Kein Drag-and-Drop in der nativen Grocy-Oberfläche | Zeitaufwändiges Erstellen einzelner Einträge per Formular |
| Keine übersichtliche Wochenansicht | Schwer, den Überblick über die gesamte Woche zu behalten |
| Keine mobile Optimierung | Planung unterwegs (z. B. im Supermarkt) ist unpraktisch |
| Keine schnelle Rezeptsuche während der Planung | Hoher Navigationsaufwand zwischen Rezepten und Planung |

### Lösung

Eine dedizierte, moderne Web-Oberfläche, die sich nahtlos an Grocy anbindet und die Essensplanung durch visuelle, interaktive Elemente wie Drag-and-Drop, Swipe-Gesten und eine Kalenderansicht deutlich komfortabler macht.

---

## 3. Zielgruppe & Personas

### Primäre Zielgruppe

Self-Hosting-affine Nutzer, die Grocy bereits für ihre Haushaltsorganisation einsetzen und eine bessere Lösung für die Essensplanung suchen.

### Personas

#### Persona 1: „Tech-affine Familienköchin" – Lisa, 34

| | |
|---|---|
| **Hintergrund** | Plant wöchentlich Mahlzeiten für eine 4-köpfige Familie |
| **Tech-Affinität** | Mittel bis hoch, nutzt Grocy über Docker |
| **Pain Point** | Die Grocy-UI ist zu umständlich für schnelle Wochenplanung |
| **Erwartung** | Kalenderansicht mit Drag-and-Drop, schnelle Rezeptsuche |
| **Gerät** | Laptop (primär), Smartphone (sekundär) |

#### Persona 2: „Der Optimierer" – Markus, 28

| | |
|---|---|
| **Hintergrund** | Single, plant Meals für Meal Prep am Wochenende |
| **Tech-Affinität** | Hoch, betreibt eigenen Homeserver |
| **Pain Point** | Möchte Mahlzeiten schnell verschieben und duplizieren können |
| **Erwartung** | Effiziente UI, Keyboard-Shortcuts, schnelle Interaktionen |
| **Gerät** | Desktop (primär) |

#### Persona 3: „Die Spontane" – Sarah, 41

| | |
|---|---|
| **Hintergrund** | Plant Mahlzeiten oft unterwegs oder kurzfristig um |
| **Tech-Affinität** | Mittel, Partner hat Grocy eingerichtet |
| **Pain Point** | Braucht mobile Bedienung mit Touch-Gesten |
| **Erwartung** | PWA-Installation, Swipe-Aktionen, responsive Design |
| **Gerät** | Smartphone (primär) |

---

## 4. Produktziele & Erfolgskriterien

### Produktziele

| # | Ziel | Beschreibung |
|---|---|---|
| Z1 | **Intuitive Wochenplanung** | Nutzer sollen ihre Woche in unter 5 Minuten planen können |
| Z2 | **Nahtlose Grocy-Integration** | Vollständige Kompatibilität mit der Grocy-API |
| Z3 | **Cross-Device-Nutzung** | Desktop und Mobile gleichermaßen benutzbar |
| Z4 | **Datenschutz** | Keine externen Datenübertragungen, alles lokal |
| Z5 | **Open Source** | Community-getriebene Weiterentwicklung |

### Erfolgskriterien (KPIs)

| KPI | Ziel | Messmethode |
|---|---|---|
| GitHub Stars | > 500 | GitHub Repository |
| Aktive Installationen | Wachstum > 20% pro Quartal | Community-Feedback |
| Issue-Response-Time | < 48h für Bug Reports | GitHub Issues |
| Lighthouse Score | > 90 (Performance, Accessibility) | Lighthouse Audit |
| Bundle Size | < 500KB initial load | Angular Build Budget |

---

## 5. Funktionale Anforderungen

### 5.1 Kernfunktionen (Implementiert ✅)

#### F1: Wochenansicht & Navigation

| | |
|---|---|
| **Priorität** | P0 – Kritisch |
| **Status** | ✅ Implementiert |
| **Beschreibung** | Kalendarische Wochenansicht mit 7 Tagesspalten und Tagesabschnitten |

**Akzeptanzkriterien:**
- [x] Anzeige von 2 Wochen gleichzeitig
- [x] Navigation zwischen Wochen (vor/zurück/aktuelle Woche)
- [x] URL-basierte Wochenparameter (`?week=X`)
- [x] ISO-Wochennummerierung
- [x] Visuelle Hervorhebung des aktuellen Tages
- [x] Wochenend-Markierung

#### F2: Drag-and-Drop Essensplanung

| | |
|---|---|
| **Priorität** | P0 – Kritisch |
| **Status** | ✅ Implementiert |
| **Beschreibung** | Rezepte aus der Seitenleiste per Drag-and-Drop auf Tage ziehen |

**Akzeptanzkriterien:**
- [x] Drag von Rezepten aus der Sidebar auf Tagesspalten
- [x] Verschieben bestehender Mahlzeiten zwischen Tagen
- [x] Duplizieren von Mahlzeiten via SHIFT+Drag
- [x] Visuelles Feedback während des Dragging
- [x] Sofortige API-Synchronisation nach Drop

#### F3: Rezeptverwaltung & Suche

| | |
|---|---|
| **Priorität** | P0 – Kritisch |
| **Status** | ✅ Implementiert |
| **Beschreibung** | Seitenleiste mit durchsuchbarer Rezeptliste |

**Akzeptanzkriterien:**
- [x] Rezeptliste aus Grocy laden und anzeigen
- [x] Echtzeitsuche/Filter über Rezeptnamen
- [x] Rezeptkarten mit Bildern aus Grocy
- [x] Rezept in Grocy öffnen (externer Link)
- [x] Recipe Picker Bottom Sheet für mobile Nutzung
- [x] Refresh-Funktionalität zum Neuladen der Rezepte

#### F4: Mahlzeiten-Management

| | |
|---|---|
| **Priorität** | P0 – Kritisch |
| **Status** | ✅ Implementiert |
| **Beschreibung** | CRUD-Operationen für Mahlzeiteinträge |

**Akzeptanzkriterien:**
- [x] Mahlzeiten erstellen (via Drag-and-Drop oder Picker)
- [x] Mahlzeiten verschieben (zwischen Tagen)
- [x] Mahlzeiten duplizieren (SHIFT+Drag)
- [x] Mahlzeiten löschen (Swipe-Geste)
- [x] Mahlzeiten als erledigt markieren
- [x] Toast-Benachrichtigungen für alle Aktionen

#### F5: Tagesabschnitte (Meal Plan Sections)

| | |
|---|---|
| **Priorität** | P1 – Wichtig |
| **Status** | ✅ Implementiert |
| **Beschreibung** | Untergliederung der Tage in Abschnitte (z. B. Frühstück, Mittagessen, Abendessen) |

**Akzeptanzkriterien:**
- [x] Sections aus Grocy laden
- [x] Mahlzeiten Sections zuweisen
- [x] Section-basierte Filterung in der Wochenansicht
- [x] Section-Auswahl in den Scheduler-Controls

#### F6: Grocy-Konfiguration

| | |
|---|---|
| **Priorität** | P0 – Kritisch |
| **Status** | ✅ Implementiert |
| **Beschreibung** | Einrichtungsdialog für die Verbindung zur Grocy-Instanz |

**Akzeptanzkriterien:**
- [x] Eingabefelder für Grocy-URL und API-Key
- [x] HTTPS-Validierung
- [x] Verbindungstest (System-Info abrufen)
- [x] Speicherung in localStorage
- [x] URL-Parameter-Support für Vorkonfiguration
- [x] URL-Sanitization für sensible Daten

#### F7: Dark Mode & Theming

| | |
|---|---|
| **Priorität** | P2 – Nice-to-have |
| **Status** | ✅ Implementiert |
| **Beschreibung** | Unterstützung für helles und dunkles Farbschema |

**Akzeptanzkriterien:**
- [x] Light/Dark/System-Modus
- [x] Erkennung der System-Präferenz
- [x] Persistierung der Auswahl in localStorage
- [x] Toggle-Button in der UI
- [x] Konsistentes Styling in beiden Modi

#### F8: Progressive Web App (PWA)

| | |
|---|---|
| **Priorität** | P1 – Wichtig |
| **Status** | ✅ Implementiert |
| **Beschreibung** | Installierbare Web-App mit nativen App-Eigenschaften |

**Akzeptanzkriterien:**
- [x] Web App Manifest konfiguriert
- [x] App-Icons in verschiedenen Größen (192px, 256px, 384px, 512px)
- [x] Installierbar auf Desktop und Mobile
- [x] Standalone-Modus bei Installation

#### F9: Release Notes

| | |
|---|---|
| **Priorität** | P2 – Nice-to-have |
| **Status** | ✅ Implementiert |
| **Beschreibung** | Automatische Anzeige von Änderungen bei App-Updates |

**Akzeptanzkriterien:**
- [x] Versionserkennung und -vergleich
- [x] Modal-Dialog mit kategorisierten Änderungen
- [x] Kategorien: Features, Fixes, Breaking Changes, Improvements, etc.
- [x] Einmalige Anzeige pro Version
- [x] JSON-basierte Release Notes Dateien

### 5.2 Geplante Funktionen (Backlog)

#### F10: Einkaufslisten-Integration

| | |
|---|---|
| **Priorität** | P1 – Wichtig |
| **Status** | 🔲 Geplant |
| **Beschreibung** | Automatische Einkaufsliste basierend auf geplanten Mahlzeiten generieren |

**Akzeptanzkriterien:**
- [ ] Zutaten der geplanten Rezepte aggregieren
- [ ] Einkaufsliste in Grocy erstellen/aktualisieren
- [ ] Bereits vorhandene Bestände berücksichtigen
- [ ] Export/Teilen der Einkaufsliste

#### F11: Rezept-Vorschläge / Empfehlungen

| | |
|---|---|
| **Priorität** | P2 – Nice-to-have |
| **Status** | 🔲 Geplant |
| **Beschreibung** | Intelligente Rezeptvorschläge basierend auf vorhandenen Beständen |

**Akzeptanzkriterien:**
- [ ] Vorschläge basierend auf Lagerbestand in Grocy
- [ ] Berücksichtigung von Ablaufdaten
- [ ] Vermeidung von Wiederholungen in der gleichen Woche
- [ ] Optional: AI-basierte Vorschläge (Userfield `ai_planned`)

#### F12: Mehrbenutzer-Unterstützung

| | |
|---|---|
| **Priorität** | P3 – Zukünftig |
| **Status** | 🔲 Geplant |
| **Beschreibung** | Unterstützung mehrerer Grocy-Benutzer mit eigenen API-Keys |

**Akzeptanzkriterien:**
- [ ] Profil-Verwaltung für mehrere Benutzer
- [ ] Schneller Profilwechsel
- [ ] Separater localStorage pro Profil

#### F13: Kalender-Export (iCal)

| | |
|---|---|
| **Priorität** | P3 – Zukünftig |
| **Status** | 🔲 Geplant |
| **Beschreibung** | Export des Essensplans als iCal-Datei |

**Akzeptanzkriterien:**
- [ ] iCal-Generierung aus Meal-Plan-Daten
- [ ] Download als .ics-Datei
- [ ] Optional: Abonnierbare Kalender-URL

#### F14: Rezept-Detail-Ansicht

| | |
|---|---|
| **Priorität** | P2 – Nice-to-have |
| **Status** | 🔲 Geplant |
| **Beschreibung** | In-App Rezeptanzeige ohne Umleitung zu Grocy |

**Akzeptanzkriterien:**
- [ ] Rezeptdetails in einem Modal/Drawer anzeigen
- [ ] Zutatenliste mit Mengenangaben
- [ ] Zubereitungsschritte
- [ ] Portionsrechner

#### F15: Offline-Modus

| | |
|---|---|
| **Priorität** | P3 – Zukünftig |
| **Status** | 🔲 Geplant |
| **Beschreibung** | Grundlegende Offline-Funktionalität mit Service Worker |

**Akzeptanzkriterien:**
- [ ] Service Worker für Asset-Caching
- [ ] Offline-Anzeige des zuletzt geladenen Essensplans
- [ ] Synchronisation bei Wiederverbindung
- [ ] Offline-Indikator in der UI

#### F16: Druckansicht

| | |
|---|---|
| **Priorität** | P2 – Nice-to-have |
| **Status** | 🔲 Geplant |
| **Beschreibung** | Druckoptimierte Ansicht des Wochenplans |

**Akzeptanzkriterien:**
- [ ] Print-CSS für optimierte Ausgabe
- [ ] Wochenplan als kompakte Tabelle
- [ ] Optional: PDF-Export

---

## 6. Nicht-funktionale Anforderungen

### 6.1 Performance

| Anforderung | Ziel | Messung |
|---|---|---|
| Initiales Laden (First Contentful Paint) | < 1,5s | Lighthouse |
| Time to Interactive | < 3s | Lighthouse |
| Bundle-Größe (initial) | < 500KB | Angular Build Budget |
| Bundle-Größe (maximal) | < 1MB | Angular Build Budget |
| API-Antwortzeit | < 2s für alle Operationen | Browser DevTools |
| Drag-and-Drop Latenz | < 100ms | Subjektive Bewertung |

### 6.2 Sicherheit

| Anforderung | Beschreibung |
|---|---|
| HTTPS-Pflicht | Verbindung zur Grocy-Instanz nur über HTTPS |
| Keine externen Datenübertragung | Keinerlei Telemetrie, Analytics oder externe Calls |
| API-Key-Schutz | API-Key wird nur lokal gespeichert, nie in URLs exponiert |
| URL-Sanitization | Sensitive Daten aus Browser-History entfernen |
| CORS-Kompatibilität | Korrekte CORS-Header auf Grocy-Seite erforderlich |

### 6.3 Kompatibilität

| Browser | Mindestversion | Status |
|---|---|---|
| Chrome/Edge | 90+ | ✅ Unterstützt |
| Firefox | 90+ | ✅ Unterstützt |
| Safari | 15+ | ✅ Unterstützt |
| Mobile Chrome | 90+ | ✅ Unterstützt |
| Mobile Safari | 15+ | ✅ Unterstützt |

### 6.4 Barrierefreiheit

| Anforderung | Status |
|---|---|
| WCAG 2.1 AA Konformität | 🔲 Geplant |
| Keyboard-Navigation | Teilweise implementiert |
| Screen-Reader-Kompatibilität | 🔲 Geplant |
| Ausreichende Farbkontraste | ✅ Durch Material Design |
| Fokus-Management | Teilweise implementiert |

### 6.5 Skalierbarkeit

| Aspekt | Beschreibung |
|---|---|
| Rezeptanzahl | Optimiert für bis zu 500 Rezepte |
| Meal-Plan-Einträge | Effizientes Laden pro Woche (nicht global) |
| Bildverarbeitung | Lazy Loading für Rezeptbilder aus Grocy |
| State Management | Reaktive Streams mit automatischer Bereinigung |

---

## 7. Technische Architektur

### 7.1 Tech Stack

| Kategorie | Technologie | Version |
|---|---|---|
| **Framework** | Angular | 21.0.6 |
| **Sprache** | TypeScript | 5.9.3 |
| **UI-Bibliothek** | Angular Material | 21.0.5 |
| **CSS-Framework** | Tailwind CSS | 4.1.16 |
| **State Management** | RxJS (BehaviorSubject) | 7.8.2 |
| **Drag & Drop** | ngx-drag-drop | 20.0.1 |
| **i18n** | @jsverse/transloco | 7.0.0 |
| **Notifications** | @ngxpert/hot-toast | 5.1.2 |
| **Kalender** | angular-calendar | 0.32.0 |
| **Datum** | dayjs / date-fns | 1.11.18 / 4.1.0 |
| **Icons** | @mdi/angular-material | 7.2.96 |
| **Hosting** | Vercel | – |

### 7.2 Architektur-Übersicht

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                       │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                  Angular App (SPA)                   │ │
│  │                                                       │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │ │
│  │  │  Router   │  │  i18n    │  │  Dark Mode Svc   │  │ │
│  │  └──────────┘  └──────────┘  └──────────────────┘  │ │
│  │                                                       │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │              AppComponent (Root)                 │ │ │
│  │  │                                                   │ │ │
│  │  │  ┌─────────────┐    ┌──────────────────────┐   │ │ │
│  │  │  │ GrocyConfig │    │     Scheduler        │   │ │ │
│  │  │  │ (Setup)     │    │                      │   │ │ │
│  │  │  └─────────────┘    │  ┌────────────────┐  │   │ │ │
│  │  │                      │  │SchedulerCtrls  │  │   │ │ │
│  │  │                      │  ├────────────────┤  │   │ │ │
│  │  │                      │  │  WeekView      │  │   │ │ │
│  │  │                      │  │  ┌──────────┐  │  │   │ │ │
│  │  │                      │  │  │DayColumn │  │  │   │ │ │
│  │  │                      │  │  │┌────────┐│  │  │   │ │ │
│  │  │                      │  │  ││Recipe  ││  │  │   │ │ │
│  │  │                      │  │  ││Card    ││  │  │   │ │ │
│  │  │                      │  │  │└────────┘│  │  │   │ │ │
│  │  │                      │  │  └──────────┘  │  │   │ │ │
│  │  │                      │  ├────────────────┤  │   │ │ │
│  │  │                      │  │RecipeSidebar   │  │   │ │ │
│  │  │                      │  └────────────────┘  │   │ │ │
│  │  │                      └──────────────────────┘   │ │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │  ┌──────────────────────────────────────────────┐    │ │
│  │  │              Services Layer                    │    │ │
│  │  │  ┌──────────┐  ┌─────────┐  ┌─────────────┐  │    │ │
│  │  │  │GrocySvc  │  │ConfigSvc│  │ReleaseNotes │  │    │ │
│  │  │  └──────────┘  └─────────┘  └─────────────┘  │    │ │
│  │  └──────────────────────────────────────────────┘    │ │
│  └─────────────────────────────────────────────────────┘ │
│                           │                               │
│                    localStorage                           │
└───────────────────────────┼───────────────────────────────┘
                            │ HTTPS + API-Key
                            ▼
                ┌───────────────────────┐
                │   Grocy Instance      │
                │   (Self-Hosted)       │
                │                       │
                │   REST API            │
                │   ├── /api/objects/   │
                │   ├── /api/files/     │
                │   └── /api/system/    │
                └───────────────────────┘
```

### 7.3 Komponentenhierarchie

```
AppComponent
├── GrocyConfigComponent          (wenn nicht konfiguriert)
├── SchedulerComponent            (wenn konfiguriert)
│   ├── SchedulerControlsComponent
│   ├── WeekViewComponent
│   │   └── DayColumnComponent × 7 (pro Tag)
│   │       └── GrocyRecipeCardComponent × N (pro Mahlzeit)
│   ├── RecipeSidebarComponent
│   └── ThemeToggleComponent
├── MadeByBannerComponent
├── DarkModeToggleComponent
│
├── [Dialog] ReleaseNotesModalComponent
└── [BottomSheet] RecipePickerSheetComponent
```

### 7.4 State-Management-Muster

```
                    ┌──────────────┐
                    │ BehaviorSubj │  (GrocyService)
                    │              │
         ┌─────────┤  meals$      │
         │         │  recipes$    │
         │         │  sections$   │
         │         └──────┬───────┘
         │                │
    ┌────▼─────┐    ┌─────▼──────┐
    │Component │    │  Component │
    │(Subscribe│    │ (Async     │
    │ + render)│    │   Pipe)    │
    └──────────┘    └────────────┘

Muster:
1. Services halten State als BehaviorSubject
2. Komponenten subscriben via async pipe
3. Aktionen triggern Service-Methoden
4. Service-Methoden aktualisieren API + lokalen State
5. OnPush Change Detection für Performance
```

---

## 8. Datenmodell

### 8.1 Entitäten

#### Meal (Mahlzeit)

```typescript
interface Meal {
  id: number;              // Eindeutige ID (von Grocy)
  recipe_id: number;       // Verknüpftes Rezept
  recipe_servings: number; // Portionsanzahl
  type: string;            // Typ ('recipe')
  day: string;             // Datum (YYYY-MM-DD)
  section_id: string;      // Tagesabschnitt
  done: number;            // Erledigt-Status (0/1)
  userfields?: {
    ai_planned?: string;   // AI-geplant Flag
  };
}
```

#### Recipe (Rezept)

```typescript
interface Recipe {
  id: number;
  name: string;
  description: string;
  row_created_timestamp: string;
  picture_file_name: string;
  base_servings: number;
  desired_servings: number;
  not_check_shoppinglist: number;
  type: string;            // 'normal' | andere
  product_id: any;
}
```

#### MealPlanSection (Tagesabschnitt)

```typescript
interface MealPlanSection {
  id: number;
  name?: string;
  sort_number: number;
  row_created_timestamp: string;
  time_info: any;
}
```

#### RecipeDragData (Drag-Payload)

```typescript
interface RecipeDragData {
  recipe: Recipe;
  meal: Meal;
}
```

### 8.2 Datenfluss

```
Grocy API ──GET──▶ GrocyService ──Observable──▶ Components ──Render──▶ UI
    ▲                                                                    │
    │                                                                    │
    └──POST/PUT/DELETE── GrocyService ◀──Events── Components ◀──User────┘
```

---

## 9. API-Integration

### 9.1 Grocy REST API Endpunkte

| Methode | Endpunkt | Beschreibung | Verwendet in |
|---|---|---|---|
| `GET` | `/api/system/info` | Systeminformationen abrufen | Verbindungstest |
| `GET` | `/api/objects/recipes` | Alle Rezepte laden | Rezeptliste |
| `GET` | `/api/objects/meal_plan` | Essensplan laden | Wochenansicht |
| `GET` | `/api/objects/meal_plan_sections` | Tagesabschnitte laden | Section-Auswahl |
| `POST` | `/api/objects/meal_plan` | Mahlzeit erstellen | Drag-and-Drop |
| `PUT` | `/api/objects/meal_plan/:id` | Mahlzeit aktualisieren | Verschieben |
| `DELETE` | `/api/objects/meal_plan/:id` | Mahlzeit löschen | Swipe-Delete |
| `GET` | `/api/files/:group/:name` | Rezeptbilder laden | Bildanzeige |

### 9.2 Authentifizierung

```
Request Header:
  GROCY-API-KEY: <user-api-key>
```

- API-Key wird bei jeder Anfrage als HTTP-Header mitgesendet
- Key-Speicherung ausschließlich im localStorage des Browsers
- Keine serverseitige Session-Verwaltung

### 9.3 Fehlerbehandlung

| Szenario | Verhalten |
|---|---|
| Ungültiger API-Key | Toast-Fehlermeldung, zurück zur Konfiguration |
| Netzwerkfehler | Toast mit Retry-Hinweis |
| Grocy nicht erreichbar | Konfigurationsdialog anzeigen |
| CORS-Fehler | Hinweis auf Grocy CORS-Konfiguration |

---

## 10. User Interface & UX

### 10.1 Layout-Übersicht

```
┌────────────────────────────────────────────────────────┐
│  [Logo]  Grocy Meal Planning    [Theme] [Lang] [Info]  │  ← Header
├──────────┬─────────────────────────────────────────────┤
│          │  ◀ KW 07     [Heute]     KW 08 ▶           │  ← Controls
│  Recipe  │  [Section Dropdown]                         │
│  Sidebar │─────────────────────────────────────────────┤
│          │  Mo  │  Di  │  Mi  │  Do  │  Fr  │  Sa │So │  ← Wochentage
│  [Search]│──────┼──────┼──────┼──────┼──────┼─────┼───┤
│          │      │      │      │      │      │     │   │
│  Recipe1 │ 🍕  │ 🥗  │      │ 🍝  │      │     │   │  ← Mahlzeiten
│  Recipe2 │      │      │ 🍲  │      │ 🍜  │     │   │
│  Recipe3 │      │      │      │      │      │     │   │
│  ...     │      │      │      │      │      │     │   │
│          │      │      │      │      │      │     │   │
├──────────┴─────────────────────────────────────────────┤
│  Made with ❤ by Disane                                 │  ← Footer
└────────────────────────────────────────────────────────┘
```

### 10.2 Interaktionsmodelle

#### Desktop

| Aktion | Interaktion |
|---|---|
| Mahlzeit hinzufügen | Rezept aus Sidebar auf Tag ziehen |
| Mahlzeit verschieben | Rezeptkarte auf anderen Tag ziehen |
| Mahlzeit duplizieren | SHIFT + Rezeptkarte ziehen |
| Mahlzeit löschen | Swipe-Geste auf Rezeptkarte |
| Mahlzeit als erledigt markieren | Swipe-Geste auf Rezeptkarte |
| Rezept in Grocy öffnen | Swipe-Geste auf Rezeptkarte |
| Rezepte durchsuchen | Suchfeld in der Sidebar |

#### Mobile

| Aktion | Interaktion |
|---|---|
| Mahlzeit hinzufügen | Recipe Picker Bottom Sheet öffnen |
| Mahlzeit löschen | Swipe-Geste |
| Navigation | Wischen zwischen Wochen |

### 10.3 Design-Prinzipien

1. **Übersichtlichkeit**: Wochenplan auf einen Blick erfassbar
2. **Geschwindigkeit**: Minimale Klicks für häufige Aktionen
3. **Responsivität**: Anpassung an verschiedene Bildschirmgrößen
4. **Konsistenz**: Material Design als Grundlage
5. **Feedback**: Sofortiges visuelles Feedback bei Aktionen (Toast-Notifications)

---

## 11. Internationalisierung

### 11.1 Unterstützte Sprachen

| Sprache | Code | Status |
|---|---|---|
| Englisch | `en` | ✅ Vollständig (Fallback) |
| Deutsch | `de` | ✅ Vollständig |

### 11.2 i18n-Architektur

- **Bibliothek**: @jsverse/transloco
- **Dateien**: `src/assets/i18n/{lang}.json`
- **Laden**: Lazy-Loading pro Sprache
- **Erkennung**: Automatische Browser-Sprache
- **Umschaltung**: Manuell über Theme-Toggle-Dropdown

### 11.3 Übersetzbare Bereiche

- Konfigurationsdialog (Labels, Platzhalter, Buttons)
- Toast-Nachrichten (Speichern, Löschen, Laden, Fehler)
- Meal-Plan-Section-Labels
- Wochennavigation (Buttons, Wochennummern)
- Theme-Optionen (Hell, Dunkel, System)
- Release Notes Kategorien

---

## 12. Deployment & Infrastruktur

### 12.1 Hosting

| Aspekt | Beschreibung |
|---|---|
| **Plattform** | Vercel |
| **Build-Command** | `npm run vercel-build` |
| **Output** | `dist/grocy-meal-planning/browser` |
| **Routing** | SPA-Fallback (404 → index.html) |
| **Deployment** | Automatisch bei Push auf `main` |

### 12.2 Build-Pipeline

```
Push to main
    │
    ▼
Vercel Build Trigger
    │
    ▼
npm run vercel-build
    │
    ▼
ng build --configuration production
    │
    ▼
Output: dist/grocy-meal-planning/browser/
    │
    ▼
Vercel CDN Distribution
    │
    ▼
Live auf grocy-meal-planning.disane.dev
```

### 12.3 Environment-Konfiguration

| Environment | Beschreibung |
|---|---|
| `development` | Lokale Entwicklung mit `ng serve` |
| `production` | Optimierter Build mit AOT, Minification |

### 12.4 Self-Hosting

Die Applikation kann auch selbst gehostet werden:
- Statische Dateien aus dem Build-Output bereitstellen
- Jeder Webserver mit SPA-Routing (nginx, Apache, Caddy)
- Keine Backend-Abhängigkeit (rein clientseitig)
- Docker-Image wäre ein sinnvoller nächster Schritt

---

## 13. Roadmap & Feature-Backlog

### Phase 1: Foundation (✅ v0.1.0 – v0.3.0)

- [x] Grundlegende Wochenansicht
- [x] Drag-and-Drop Essensplanung
- [x] Grocy-API-Integration
- [x] Rezeptsuche und -verwaltung
- [x] Dark Mode
- [x] i18n (EN/DE)
- [x] PWA-Support
- [x] Multi-Wochen-Ansicht
- [x] Recipe Picker Bottom Sheet
- [x] Release Notes System

### Phase 2: Enhanced Experience (Nächste Releases)

- [ ] Einkaufslisten-Integration (F10)
- [ ] Rezept-Detail-Ansicht (F14)
- [ ] Druckansicht/PDF-Export (F16)
- [ ] Verbessertes Mobile-Responsive-Design
- [ ] Keyboard Shortcuts
- [ ] Undo/Redo-Funktionalität

### Phase 3: Intelligence & Integration

- [ ] Rezeptvorschläge basierend auf Bestand (F11)
- [ ] Kalender-Export iCal (F13)
- [ ] Nährwert-Übersicht pro Tag/Woche
- [ ] Drag-and-Drop zwischen Wochen
- [ ] Batch-Operationen (mehrere Mahlzeiten gleichzeitig)

### Phase 4: Platform & Scale

- [ ] Offline-Modus mit Service Worker (F15)
- [ ] Docker-Image für einfaches Self-Hosting
- [ ] Mehrbenutzer-Unterstützung (F12)
- [ ] Weitere Sprachen (FR, ES, IT, NL)
- [ ] Barrierefreiheit WCAG 2.1 AA
- [ ] Plugin-System für Community-Erweiterungen

---

## 14. Risiken & Abhängigkeiten

### 14.1 Technische Risiken

| Risiko | Wahrscheinlichkeit | Auswirkung | Mitigation |
|---|---|---|---|
| Grocy API Breaking Changes | Mittel | Hoch | API-Version pinnen, Abstraktionsschicht |
| Angular Major Updates | Mittel | Mittel | Regelmäßige Updates, strikte Version Ranges |
| CORS-Probleme bei Nutzern | Hoch | Mittel | Dokumentation, Troubleshooting Guide |
| Performance bei vielen Rezepten | Niedrig | Mittel | Virtuelles Scrolling, Pagination |
| Browser-Kompatibilität | Niedrig | Niedrig | Moderne Browser-Baseline, Polyfills |

### 14.2 Externe Abhängigkeiten

| Abhängigkeit | Art | Risiko |
|---|---|---|
| **Grocy** | API-Provider | Ohne Grocy-Instanz nicht nutzbar |
| **Vercel** | Hosting (Demo) | Alternative: Self-Hosting |
| **npm Packages** | 20+ Dependencies | Regelmäßige Audits, Lockfile |
| **Angular Ecosystem** | Framework | Langfristiger Support durch Google |

### 14.3 Organisatorische Risiken

| Risiko | Mitigation |
|---|---|
| Bus-Faktor (Einzelentwickler) | Open-Source-Community aufbauen, Dokumentation |
| Kein dediziertes Testing | Test-Coverage erhöhen, CI/CD-Pipeline |
| Fehlende Accessibility-Tests | WCAG-Audit planen, axe-core integrieren |

---

## 15. Anhang

### 15.1 Glossar

| Begriff | Definition |
|---|---|
| **Grocy** | Self-Hosted ERP-System für den Haushalt (groceries + grocy) |
| **Meal Plan** | Wöchentlicher Essensplan mit zugeordneten Rezepten |
| **Section** | Tagesabschnitt (z. B. Frühstück, Mittagessen, Abendessen) |
| **PWA** | Progressive Web App – installierbare Web-Anwendung |
| **SPA** | Single Page Application |
| **BehaviorSubject** | RxJS-Observable mit initialem und aktuellem Wert |

### 15.2 Referenzen

- Grocy Projekt: https://grocy.info/
- Grocy API-Dokumentation: https://github.com/grocy/grocy
- Angular Framework: https://angular.dev/
- Angular Material: https://material.angular.io/
- Tailwind CSS: https://tailwindcss.com/

### 15.3 Versionsverlauf dieses Dokuments

| Version | Datum | Autor | Änderungen |
|---|---|---|---|
| 1.0 | 16.02.2026 | – | Initiale Erstellung |
