# UI/UX Design Proposal
## Grocy Meal Planning – Next Generation Interface

| | |
|---|---|
| **Version** | 2.0 Design Proposal |
| **Datum** | 16. Februar 2026 |
| **Status** | Entwurf |
| **Ziel-Release** | v1.0.0 |

---

## Inhaltsverzeichnis

1. [Executive Summary](#1-executive-summary)
2. [Analyse des Status Quo](#2-analyse-des-status-quo)
3. [Design-Philosophie & Prinzipien](#3-design-philosophie--prinzipien)
4. [Design System & Visual Language](#4-design-system--visual-language)
5. [Desktop Experience](#5-desktop-experience)
6. [Mobile Experience](#6-mobile-experience)
7. [Tablet Experience](#7-tablet-experience)
8. [Komponentenbibliothek](#8-komponentenbibliothek)
9. [Interaktionsdesign & Micro-Interactions](#9-interaktionsdesign--micro-interactions)
10. [Animationen & Transitions](#10-animationen--transitions)
11. [Accessibility](#11-accessibility)
12. [Technische Umsetzungsstrategie](#12-technische-umsetzungsstrategie)
13. [Priorisierung & Phasenplan](#13-priorisierung--phasenplan)

---

## 1. Executive Summary

### Vision

> **"Die Essensplanung soll sich anfühlen wie das Blättern in einem Kochbuch –
> inspirierend, mühelos und appetitanregend."**

Der aktuelle Stand der Applikation ist funktional solide, aber visuell und interaktiv noch weit unter dem Potential. Dieses Dokument beschreibt einen umfassenden Redesign-Vorschlag, der die App von einem funktionalen Tool zu einem **erlebnisorientierten Planungsbegleiter** transformiert.

### Die 5 zentralen Veränderungen

| # | Veränderung | Impact |
|---|---|---|
| 1 | **Adaptive Layout-Architektur** – Drei eigenständige Experiences für Mobile, Tablet und Desktop statt einer responsiven Breakpoint-Lösung | Fundamental |
| 2 | **Glassmorphic Design System** – Konsistente, moderne visuelle Sprache mit Depth, Blur und warmer Farbpalette | Hoch |
| 3 | **Context-Aware Interactions** – Intelligente Interaktionsmuster, die sich ans Gerät anpassen (Touch, Pointer, Keyboard) | Hoch |
| 4 | **Bento Dashboard** – Optionale Dashboard-Ansicht als Alternative zur reinen Wochenplanung | Mittel |
| 5 | **Progressive Disclosure** – Information stufenweise offenbaren statt alles gleichzeitig zu zeigen | Mittel |

---

## 2. Analyse des Status Quo

### Stärken (beibehalten)

- Funktionierendes Drag-and-Drop-System
- Solide Grocy-API-Integration
- Guter iOS Safe-Area-Support
- Vollständige Light/Dark-Mode-Unterstützung
- Touch-Target-Größen (44px Minimum)
- i18n-Infrastruktur (EN/DE)

### Schwächen (adressieren)

| Problem | Schwere | Details |
|---|---|---|
| **Nur ein Breakpoint (768px)** | Kritisch | Tablets bekommen Desktop-Layout, kleine Phones werden gequetscht |
| **Sidebar 15% fest** | Hoch | Zu schmal auf breiten Screens, zu breit auf kleinen |
| **Kein Touch-Drag auf Mobile** | Kritisch | Kernfunktion fehlt auf dem häufigsten Gerät |
| **Recipe Picker 70vh fest** | Hoch | Keyboard verschiebt Content auf Mobile |
| **Swipe-Aktionen nicht entdeckbar** | Hoch | Kein visueller Hinweis, dass Karten swipebar sind |
| **Globale `*`-Transitions** | Mittel | Performance-Risiko, kann Jank verursachen |
| **19% !important-Overrides** | Mittel | Brüchiges CSS, schwer wartbar |
| **Kein Landscape-Modus** | Mittel | Layout bricht auf gedrehten Phones |
| **Keine Ladeanimationen** | Mittel | Abrupte Content-Sprünge |
| **Theme-Dropdown positioniert sich off-screen** | Mittel | UX-Bug auf schmalen Viewports |

---

## 3. Design-Philosophie & Prinzipien

### Design-Mantra

**"Warm. Klar. Appetitlich."**

Eine Essensplanungs-App muss Emotionen wecken. Kalte, technische Interfaces sind für Projektmanagement – hier geht es um **Essen**, Genuss und Freude am Planen.

### Die 7 Design-Prinzipien

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  1. FOOD FIRST                                                  │
│     Rezeptbilder sind der Star. Jede Design-Entscheidung        │
│     muss die Bilder zum Leuchten bringen.                       │
│                                                                 │
│  2. PROGRESSIVE DISCLOSURE                                      │
│     Zeige nur, was gerade relevant ist. Details on demand.      │
│                                                                 │
│  3. ADAPTIVE, NICHT RESPONSIVE                                  │
│     Drei eigenständige Experiences statt einer gestretchten.    │
│                                                                 │
│  4. MOTION WITH PURPOSE                                         │
│     Jede Animation hat einen Grund: Feedback, Orientierung      │
│     oder Delight. Keine Dekoration.                             │
│                                                                 │
│  5. ZERO-FRICTION INTERACTIONS                                  │
│     Die häufigste Aktion (Rezept planen) muss mit minimalem    │
│     Aufwand möglich sein.                                       │
│                                                                 │
│  6. TRUST THROUGH FEEDBACK                                      │
│     Jede Aktion bekommt sofortiges visuelles Feedback.          │
│     Optimistic UI mit graceful Error Recovery.                  │
│                                                                 │
│  7. INCLUSIVE BY DEFAULT                                         │
│     WCAG 2.1 AA ist kein Feature, sondern Baseline.            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Design System & Visual Language

### 4.1 Farbpalette

#### Primärfarben

```
WARM NEUTRAL BASE (statt kaltem Stone)
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  Sand-50   #fdfcfa   ████  Background (Light)           │
│  Sand-100  #f7f5f0   ████  Surface (Light)              │
│  Sand-200  #ede9e0   ████  Border (Light)               │
│  Sand-300  #ddd6c9   ████  Muted Text (Light)           │
│  Sand-800  #3d3529   ████  Text (Light) / Surface(Dark) │
│  Sand-900  #2a241c   ████  Background (Dark)            │
│  Sand-950  #1a160f   ████  Deep Background (Dark)       │
│                                                          │
└──────────────────────────────────────────────────────────┘

AKZENTFARBEN (Food-inspiriert)
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  Saffron    #e8a317  ████  Primary Accent / CTA         │
│  Terracotta #c4644a  ████  Danger / Delete              │
│  Sage       #7c9a6e  ████  Success / Done               │
│  Blueberry  #5b6abf  ████  Info / Links                 │
│  Cream      #f5f0e8  ████  Highlight Background         │
│  Espresso   #4a3728  ████  Strong Text (Dark)           │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

#### Mahlzeiten-Section-Farben

```
SECTION COLOR CODING
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  Frühstück  Warm Amber    bg: #fff8eb  border: #f59e0b  │
│  Mittag     Fresh Green   bg: #f0fdf4  border: #22c55e  │
│  Abend      Deep Indigo   bg: #eef2ff  border: #6366f1  │
│  Snack      Soft Rose     bg: #fff1f2  border: #fb7185  │
│                                                          │
│  (Dark Mode: gleiche Hues, aber abgedunkelt auf 10%)    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 4.2 Typografie

```
FONT STACK
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  Headlines:   Inter (Variable Font)                      │
│               Alternativ: "Plus Jakarta Sans"            │
│               Weight: 600-700, Tracking: -0.02em         │
│                                                          │
│  Body:        Inter (Variable Font)                      │
│               Weight: 400-500, Tracking: normal          │
│                                                          │
│  Monospace:   JetBrains Mono (nur für Badges/Zahlen)    │
│                                                          │
│  Skalierung (Mobile → Desktop):                         │
│  ─────────────────────────────────                      │
│  H1:    24px → 32px    (1.5rem → 2rem)                  │
│  H2:    20px → 24px    (1.25rem → 1.5rem)               │
│  H3:    16px → 18px    (1rem → 1.125rem)                │
│  Body:  14px → 15px    (0.875rem → 0.9375rem)           │
│  Small: 12px → 13px    (0.75rem → 0.8125rem)            │
│  Micro: 10px → 11px    (0.625rem → 0.6875rem)           │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 4.3 Spacing & Grid

```
SPACING SCALE (8px Base Grid)
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  xs:    4px   (0.25rem)   Inline-Abstände               │
│  sm:    8px   (0.5rem)    Enge Gruppierungen             │
│  md:   12px   (0.75rem)   Standard-Innenabstand          │
│  base: 16px   (1rem)      Card Padding                   │
│  lg:   24px   (1.5rem)    Section-Abstände               │
│  xl:   32px   (2rem)      Bereichs-Trennung              │
│  2xl:  48px   (3rem)      Page-Level-Spacing             │
│                                                          │
│  GRID                                                    │
│  ─────                                                   │
│  Desktop: 12-Column Grid, 24px Gutter                    │
│  Tablet:   8-Column Grid, 16px Gutter                    │
│  Mobile:   4-Column Grid, 16px Gutter                    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 4.4 Border Radius & Elevation

```
BORDER RADIUS
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  sm:      8px    Buttons, Badges, Input Fields           │
│  md:     12px    Cards, Dropdowns                        │
│  lg:     16px    Panels, Sheets                          │
│  xl:     20px    Modals, Bottom Sheets                   │
│  full:   9999px  Pills, Avatars                          │
│                                                          │
└──────────────────────────────────────────────────────────┘

ELEVATION (statt flacher Schatten → Layered Shadows)
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  Level 0:  Kein Schatten (eingebettete Elemente)        │
│                                                          │
│  Level 1:  0 1px 2px rgba(0,0,0,0.04),                 │
│            0 1px 3px rgba(0,0,0,0.06)                   │
│            → Cards im Ruhezustand                        │
│                                                          │
│  Level 2:  0 4px 6px rgba(0,0,0,0.04),                 │
│            0 2px 4px rgba(0,0,0,0.06)                   │
│            → Cards bei Hover                             │
│                                                          │
│  Level 3:  0 10px 20px rgba(0,0,0,0.06),               │
│            0 4px 8px rgba(0,0,0,0.04)                   │
│            → Drag-Element, Floating Panels               │
│                                                          │
│  Level 4:  0 20px 40px rgba(0,0,0,0.08),               │
│            0 8px 16px rgba(0,0,0,0.06)                  │
│            → Modals, Bottom Sheets                       │
│                                                          │
│  (Dark Mode: rgba-Werte +0.10 erhöhen,                  │
│   plus 1px solid rgba(255,255,255,0.06) Border)         │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 4.5 Glassmorphism-System

```
GLASS VARIANTS
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  Glass-Light:                                            │
│    background: rgba(255, 255, 255, 0.72)                │
│    backdrop-filter: blur(20px) saturate(180%)            │
│    border: 1px solid rgba(255, 255, 255, 0.3)           │
│                                                          │
│  Glass-Dark:                                             │
│    background: rgba(26, 22, 15, 0.75)                   │
│    backdrop-filter: blur(20px) saturate(180%)            │
│    border: 1px solid rgba(255, 255, 255, 0.08)          │
│                                                          │
│  Glass-Subtle (für Sidebar):                             │
│    background: rgba(253, 252, 250, 0.85)                │
│    backdrop-filter: blur(12px)                           │
│    border-right: 1px solid rgba(0, 0, 0, 0.06)          │
│                                                          │
│  Glass-Sheet (für Bottom Sheet):                         │
│    background: rgba(255, 255, 255, 0.92)                │
│    backdrop-filter: blur(40px) saturate(200%)            │
│    border-top: 1px solid rgba(255, 255, 255, 0.5)       │
│    border-radius: 20px 20px 0 0                          │
│                                                          │
│  ANWENDUNG (Tailwind-Klassen):                          │
│  bg-white/72 backdrop-blur-xl backdrop-saturate-[180%]  │
│  border border-white/30 rounded-xl                       │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 5. Desktop Experience

### 5.1 Layout-Architektur (≥ 1024px)

```
┌────────────────────────────────────────────────────────────────────────┐
│ ┌──────────────────────────────────────────────────────────────────┐  │
│ │  🍳 Grocy Meal Planning          KW 07 ◀ Heute ▶ KW 08         │  │
│ │                                  [Section ▾] [🌙] [DE▾] [⚙️]   │  │
│ └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌─ WEEK PROGRESS BAR ──────────────────────────────────────────────┐ │
│  │  Mo ●──── Di ●──── Mi ●──── Do ○──── Fr ○──── Sa ○──── So ○    │ │
│  │       3/3      2/3      3/3      0/3      0/3      0/3    0/3   │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│  ┌──────────┐ ┌────────────────────────────────────────────────────┐  │
│  │ RECIPES  │ │                  WEEK VIEW                         │  │
│  │          │ │                                                     │  │
│  │ [🔍 ... ]│ │  Mo 10.    Di 11.    Mi 12.    Do 13.    Fr 14.  │  │
│  │ [↻]      │ │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │  │
│  │          │ │  │☀ Früh │ │☀ Früh│ │☀ Früh│ │☀ Früh│ │☀ Früh│  │  │
│  │ ┌──────┐ │ │  │┌────┐│ │┌────┐│ │      │ │      │ │      │  │  │
│  │ │ 🖼️  │ │ │  ││Müsl││ ││Eier││ │ + ⊕  │ │ + ⊕  │ │ + ⊕  │  │  │
│  │ │Pasta │ │ │  │└────┘│ │└────┘│ │      │ │      │ │      │  │  │
│  │ │Bolog.│ │ │  ├──────┤ ├──────┤ ├──────┤ ├──────┤ ├──────┤  │  │
│  │ └──────┘ │ │  │🌿 Mit│ │🌿 Mit│ │🌿 Mit│ │🌿 Mit│ │🌿 Mit│  │  │
│  │ ┌──────┐ │ │  │┌────┐│ │┌────┐│ │┌────┐│ │      │ │      │  │  │
│  │ │ 🖼️  │ │ │  ││Salat││ ││Suppe││ ││Wrap ││ │ + ⊕  │ │ + ⊕  │  │  │
│  │ │Risot.│ │ │  │└────┘│ │└────┘│ │└────┘│ │      │ │      │  │  │
│  │ │      │ │ │  ├──────┤ ├──────┤ ├──────┤ ├──────┤ ├──────┤  │  │
│  │ └──────┘ │ │  │🌙 Ab │ │🌙 Ab │ │🌙 Ab │ │🌙 Ab │ │🌙 Ab │  │  │
│  │ ┌──────┐ │ │  │┌────┐│ │┌────┐│ │┌────┐│ │      │ │      │  │  │
│  │ │ 🖼️  │ │ │  ││Pasta││ ││Curry││ ││Pizza││ │ + ⊕  │ │ + ⊕  │  │  │
│  │ │Curry │ │ │  │└────┘│ │└────┘│ │└────┘│ │      │ │      │  │  │
│  │ │      │ │ │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘  │  │
│  │ └──────┘ │ │                                                     │  │
│  │ ...      │ │  Sa 15.                    So 16.                   │  │
│  │          │ │  ┌──────────────┐          ┌──────────────┐         │  │
│  │          │ │  │ Wochenende – │          │ Wochenende – │         │  │
│  └──────────┘ │  │ entspannt    │          │ entspannt    │         │  │
│               │  └──────────────┘          └──────────────┘         │  │
│               └────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ 💡 Tipp: Halte SHIFT beim Ziehen, um ein Rezept zu duplizieren  │ │
│  └──────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Zentrale Desktop-Innovationen

#### A) Collapsible Sidebar mit Glassmorphism

```
SIDEBAR STATES
┌──────────────────────────────────────────────────────┐
│                                                      │
│  STATE 1: Expanded (280px)                           │
│  ┌──────────────────────────┐                        │
│  │  Glass-Subtle Background │                        │
│  │  ┌────────────────────┐  │                        │
│  │  │ 🔍 Rezept suchen...│  │                        │
│  │  └────────────────────┘  │                        │
│  │                          │                        │
│  │  KÜRZLICH GEPLANT        │  ← Neue Sektion        │
│  │  ┌──────────────────┐   │                        │
│  │  │ 🖼️ Pasta Bolog. │   │                        │
│  │  │ 🖼️ Grüner Salat │   │                        │
│  │  └──────────────────┘   │                        │
│  │                          │                        │
│  │  ALLE REZEPTE            │                        │
│  │  ┌──────────────────┐   │                        │
│  │  │ 🖼️ Risotto      │   │                        │
│  │  │ 🖼️ Curry Thai   │   │                        │
│  │  │ 🖼️ Pizza Marg.  │   │                        │
│  │  │ ...              │   │                        │
│  │  └──────────────────┘   │                        │
│  │  [◀ Einklappen]          │                        │
│  └──────────────────────────┘                        │
│                                                      │
│  STATE 2: Collapsed (64px)                           │
│  ┌────┐                                              │
│  │ 🔍 │  ← Klick öffnet Expanded                    │
│  │ 🖼 │  ← Mini-Thumbnails der letzten 5 Rezepte    │
│  │ 🖼 │                                              │
│  │ 🖼 │                                              │
│  │ 🖼 │                                              │
│  │ 🖼 │                                              │
│  │ ▶  │  ← Ausklappen                               │
│  └────┘                                              │
│                                                      │
│  Transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1)│
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### B) Week Progress Bar (Neu)

```
WEEK PROGRESS BAR
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  Ein horizontaler Indikator über der Wochenansicht,          │
│  der auf einen Blick zeigt, wie vollständig die Woche ist.   │
│                                                              │
│  DESIGN:                                                     │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                                                        │  │
│  │  Mo        Di        Mi        Do        Fr        Sa  │  │
│  │  ●─────────●─────────●─────────◐─────────○─────────○  │  │
│  │  3/3       2/3       3/3       1/3       0/3       0/3 │  │
│  │                                                        │  │
│  │  ● = vollständig (alle Sections gefüllt)               │  │
│  │  ◐ = teilweise (mind. 1 Section gefüllt)               │  │
│  │  ○ = leer (keine Mahlzeiten)                           │  │
│  │                                                        │  │
│  │  Farben:                                               │  │
│  │  ● Sage (#7c9a6e) auf Line                             │  │
│  │  ◐ Saffron (#e8a317)                                   │  │
│  │  ○ Sand-300 (#ddd6c9)                                  │  │
│  │  Linie: Sand-200 (#ede9e0)                             │  │
│  │  Segment Montag→Heute: Sage-Gradient                   │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  Interaktion: Klick auf Tag scrollt zur entsprechenden       │
│  Spalte (auf schmalen Desktops wo nicht alles sichtbar)      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

#### C) Enhanced Day Columns mit Section-Lanes

```
DAY COLUMN DESIGN (Desktop)
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  ┌──────────────────┐                                    │
│  │ Montag, 10. Feb  │  ← Sticky Header                  │
│  │ ●●● 3/3 geplant  │  ← Completion Dots                │
│  ├──────────────────┤                                    │
│  │                  │                                    │
│  │ ☀ Frühstück      │  ← Section Header (Amber)         │
│  │ ┌──────────────┐ │                                    │
│  │ │ ╔══════════╗ │ │                                    │
│  │ │ ║  🖼️     ║ │ │  ← Rezeptbild (dominant)           │
│  │ │ ║ Müsli    ║ │ │                                    │
│  │ │ ║ Bowl     ║ │ │                                    │
│  │ │ ║ ⏱15min  ║ │ │  ← Badge: Kochzeit                │
│  │ │ ╚══════════╝ │ │                                    │
│  │ └──────────────┘ │                                    │
│  │                  │                                    │
│  │ 🌿 Mittagessen   │  ← Section Header (Green)          │
│  │ ┌──────────────┐ │                                    │
│  │ │ ╔══════════╗ │ │                                    │
│  │ │ ║  🖼️     ║ │ │                                    │
│  │ │ ║ Caesar   ║ │ │                                    │
│  │ │ ║ Salat    ║ │ │                                    │
│  │ │ ║ 🍽2Port. ║ │ │  ← Badge: Portionen               │
│  │ │ ╚══════════╝ │ │                                    │
│  │ └──────────────┘ │                                    │
│  │                  │                                    │
│  │ 🌙 Abendessen    │  ← Section Header (Indigo)         │
│  │ ┌──────────────┐ │                                    │
│  │ │  + Rezept     │ │  ← Empty State: Dashed Border,    │
│  │ │  hinzufügen   │ │     Hover: Hintergrund füllt      │
│  │ └──────────────┘ │                                    │
│  │                  │                                    │
│  └──────────────────┘                                    │
│                                                          │
│  TODAY-MARKIERUNG:                                       │
│  - Linker Rand: 3px solid Saffron (#e8a317)              │
│  - Header-Hintergrund: Cream (#f5f0e8)                   │
│  - Subtiler Puls-Glow auf dem Datum                      │
│                                                          │
│  WEEKEND-MARKIERUNG:                                     │
│  - Leicht abgedunkelter Hintergrund                      │
│  - Optionaler Collapsed-State (weniger Höhe)             │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

#### D) Enhanced Drag-and-Drop

```
DRAG-AND-DROP STATES (Desktop)
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  1. IDLE STATE                                               │
│     ┌──────────────┐                                         │
│     │ ⠿ 🖼️ Pasta  │  ← Drag-Handle (⠿) sichtbar on hover  │
│     │    Bolognese │     Cursor: grab                        │
│     └──────────────┘                                         │
│                                                              │
│  2. PICKING UP (mousedown + 3px move)                        │
│     ┌──────────────┐                                         │
│     │ ⠿ 🖼️ Pasta  │  ← Scale 1.03, Elevation Level 3       │
│     │    Bolognese │     Cursor: grabbing                    │
│     └──────────────┘     Rotation: -2deg (leichte Neigung)   │
│     ┌ ─ ─ ─ ─ ─ ─ ┐                                         │
│     │   Ursprungs-  │  ← Ghost Placeholder: Dashed Border,  │
│       position           Gleiche Größe, 30% Opacity          │
│     └ ─ ─ ─ ─ ─ ─ ┘                                         │
│                                                              │
│  3. HOVERING OVER DROP ZONE                                  │
│     Dropzone reagiert:                                       │
│     ┌──────────────┐                                         │
│     │              │                                         │
│     │  ╔════════╗  │  ← Magnetischer Snap:                  │
│     │  ║ Ghost  ║  │     - Zone-Border wird Saffron          │
│     │  ║ Pasta  ║  │     - Background füllt mit 5% Saffron   │
│     │  ║        ║  │     - Bestehende Karten machen Platz    │
│     │  ╚════════╝  │       (animiert, 200ms ease-out)        │
│     │              │                                         │
│     └──────────────┘                                         │
│                                                              │
│  4. DROP (mouseup)                                           │
│     ┌──────────────┐                                         │
│     │ ╔══════════╗ │  ← Settle-Animation:                   │
│     │ ║ 🖼️ Pasta║ │     Scale 1.0 → 1.02 → 1.0 (bounce)    │
│     │ ║ Bolog.  ║ │     150ms ease-out                      │
│     │ ╚══════════╝ │     Kurzer Saffron-Ring-Flash            │
│     └──────────────┘                                         │
│                                                              │
│  5. SHIFT+DRAG (Duplizieren)                                 │
│     ┌──────────────┐                                         │
│     │ ⠿ 🖼️ Pasta  │  ← Original bleibt an Ort              │
│     │   (+) Kopie  │     Badge "+1" am Drag-Element          │
│     └──────────────┘     Cursor: copy                        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

#### E) Desktop Keyboard Shortcuts

```
KEYBOARD SHORTCUTS (Neu)
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  Navigation:                                             │
│  ←/→         Woche vor/zurück                            │
│  T           Zur aktuellen Woche springen                │
│  1-7         Tag fokussieren (1=Mo, 7=So)                │
│                                                          │
│  Aktionen:                                               │
│  /           Rezeptsuche fokussieren                      │
│  N           Neues Rezept zum fokussierten Tag            │
│  D           Fokussierte Mahlzeit löschen                │
│  Shift+D     Fokussierte Mahlzeit duplizieren            │
│  Space       Mahlzeit als erledigt markieren             │
│  Enter       Rezept-Details öffnen                       │
│  Esc         Panel/Dialog schließen                      │
│  ?           Shortcut-Übersicht anzeigen                 │
│                                                          │
│  Drag & Drop (Keyboard):                                 │
│  Space       Karte aufnehmen / ablegen                   │
│  ←/→         Zwischen Tagen navigieren                   │
│  ↑/↓         Zwischen Sections navigieren                │
│  Esc         Drag abbrechen                              │
│                                                          │
│  VISUELL:                                                │
│  Shortcut-Hints als Tooltips bei Hover über Buttons      │
│  "?" öffnet Overlay mit allen Shortcuts                  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 5.3 Optionale Bento-Dashboard-Ansicht

```
BENTO DASHBOARD (Desktop, Toggle via Tab)
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  [📅 Wochenplan]  [🏠 Dashboard]     ← Ansichts-Toggle              │
│                                                                      │
│  ┌───────────────────────────┬──────────────────────┐                │
│  │                           │                      │                │
│  │    DIESE WOCHE            │   HEUTE               │                │
│  │    ┌──┬──┬──┬──┬──┬──┬──┐│   Abendessen          │                │
│  │    │Mo│Di│Mi│Do│Fr│Sa│So││                        │                │
│  │    │●●│●○│●●│○○│○○│○○│○○││   ┌──────────────────┐│                │
│  │    └──┴──┴──┴──┴──┴──┴──┘│   │                  ││                │
│  │    12 von 21 geplant      │   │   🖼️ Hero-Bild   ││                │
│  │    ███████████░░░░░░░ 57% │   │   Pasta Bolog.   ││                │
│  │                           │   │   ⏱ 45min        ││                │
│  │                           │   │   🍽 4 Port.      ││                │
│  │                           │   │                  ││                │
│  │                           │   │  [Rezept öffnen] ││                │
│  │                           │   └──────────────────┘│                │
│  ├───────────────────────────┼──────────────────────┤                │
│  │                           │                      │                │
│  │  ⭐ SCHNELLAUSWAHL        │  📊 WOCHENSTATISTIK   │                │
│  │                           │                      │                │
│  │  Zuletzt geplant:         │  Rezepte: 12         │                │
│  │  🖼 Pasta  🖼 Curry       │  Portionen: 34       │                │
│  │  🖼 Salat  🖼 Risotto     │  Verschiedene: 9     │                │
│  │                           │                      │                │
│  │  Favoriten:               │  Sections:           │                │
│  │  🖼 Pizza  🖼 Müsli       │  ☀ Frühstück  5/7   │                │
│  │  🖼 Suppe  🖼 Wrap        │  🌿 Mittag    4/7   │                │
│  │                           │  🌙 Abend     3/7   │                │
│  ├───────────────────────────┴──────────────────────┤                │
│  │                                                   │                │
│  │  💡 VORSCHLÄGE                                    │                │
│  │                                                   │                │
│  │  Basierend auf deiner bisherigen Planung:         │                │
│  │                                                   │                │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐│                │
│  │  │ 🖼️     │ │ 🖼️     │ │ 🖼️     │ │ 🖼️     ││                │
│  │  │ Thai    │ │ Lachs   │ │ Gemüse  │ │ Wraps   ││                │
│  │  │ Curry   │ │ Filet   │ │ Lasagne │ │ mit     ││                │
│  │  │         │ │         │ │         │ │ Hummus  ││                │
│  │  │ [+ Mo]  │ │ [+ Di]  │ │ [+ Mi]  │ │ [+ Do]  ││                │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘│                │
│  │                                                   │                │
│  └───────────────────────────────────────────────────┘                │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 6. Mobile Experience

### 6.1 Fundamental anderer Ansatz

> **Mobile ist keine verkleinerte Desktop-Version.**
> Es ist eine eigenständige Experience, optimiert für Touch, kleine Screens und Einhand-Bedienung.

### 6.2 Layout-Architektur (< 640px)

```
MOBILE: EINZELTAG-ANSICHT (statt 7 Spalten)
┌──────────────────────────┐
│                          │
│  ☰  Grocy Meal Planning  │  ← Minimal Header
│                          │
│  ◀  Montag, 10. Feb.  ▶ │  ← Swipe oder Tap
│                          │
│  Mo  Di  Mi  Do  Fr Sa So│  ← Day Tab Bar (scrollable)
│  ●   ●   ●   ◐   ○  ○  ○│     mit Completion Dots
│  ──                      │     Active = unterstrichen
│                          │
├──────────────────────────┤
│                          │
│  ☀ FRÜHSTÜCK             │
│  ┌──────────────────────┐│
│  │ ┌────┐               ││
│  │ │ 🖼️│ Müsli Bowl    ││  ← Horizontale Karte
│  │ │    │ ⏱ 15min  🍽 2 ││     Bild links, Text rechts
│  │ └────┘    ✓ Erledigt ││     Swipeable
│  └──────────────────────┘│
│                          │
│  🌿 MITTAGESSEN           │
│  ┌──────────────────────┐│
│  │ ┌────┐               ││
│  │ │ 🖼️│ Caesar Salat  ││
│  │ │    │ ⏱ 20min  🍽 2 ││
│  │ └────┘               ││
│  └──────────────────────┘│
│                          │
│  🌙 ABENDESSEN            │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐│
│  │                      ││  ← Empty State
│  │   + Rezept wählen    ││     Dashed Border
│  │                      ││     Tap → Bottom Sheet
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘│
│                          │
├──────────────────────────┤
│                          │
│       ┌──────────┐       │  ← Floating Action Button
│       │  + 🍽️   │       │     Primary CTA
│       └──────────┘       │     öffnet Recipe Picker
│                          │
└──────────────────────────┘
```

### 6.3 Mobile Day Navigation

```
DAY SWITCHING (Mobile)
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  OPTION A: Tab Bar (empfohlen)                           │
│  ┌──────────────────────────────────────────────┐        │
│  │  Mo   Di   Mi   Do   Fr   Sa   So            │        │
│  │  ●    ●    ●    ◐    ○    ○    ○             │        │
│  │  ──                                           │        │
│  └──────────────────────────────────────────────┘        │
│  - Horizontal scrollbar (7 Tabs)                         │
│  - Aktiver Tag: Bold + Underline + Saffron               │
│  - Dots zeigen Completion (●/◐/○)                        │
│  - Tap: Sofortiger Switch (kein Page-Übergang)           │
│  - Swipe auf Content: Nächster/Vorheriger Tag            │
│                                                          │
│  OPTION B: Swipe Carousel                                │
│  ┌──────────────────────────────────────────────┐        │
│  │     ◀  Montag, 10. Februar 2026  ▶           │        │
│  └──────────────────────────────────────────────┘        │
│  - Horizontaler Swipe wechselt Tage                      │
│  - Snap-Effekt am nächsten Tag                           │
│  - Parallax: vorheriger/nächster Tag schimmert durch     │
│                                                          │
│  EMPFEHLUNG: Tab Bar (A)                                 │
│  Grund: Schneller Zugriff auf jeden Tag,                 │
│  Completion-Status sofort sichtbar                       │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 6.4 Mobile Recipe Cards

```
MOBILE RECIPE CARD
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  RESTING STATE:                                          │
│  ┌────────────────────────────────────────┐              │
│  │ ┌──────┐                              │              │
│  │ │      │  Pasta Bolognese             │              │
│  │ │ 🖼️  │  ⏱ 45min  🍽 4 Portionen     │              │
│  │ │      │                              │              │
│  │ └──────┘                              │              │
│  └────────────────────────────────────────┘              │
│                                                          │
│  SWIPE LEFT (Aktionen enthüllen):                        │
│                    ┌────────────────────────────────┐    │
│  ┌────────────────┐│  ✓ Done  │  🗑 Del  │  ↗ Open │    │
│  │ Pasta Bolog... ←│  (Sage)  │ (Terra.) │ (Blueb.)│    │
│  └────────────────┘│          │          │         │    │
│                    └────────────────────────────────┘    │
│                                                          │
│  SWIPE-VERBESSERUNGEN:                                   │
│  ─────────────────────                                   │
│  1. Swipe-Hint beim ersten Besuch:                       │
│     Kleine Animation, die Karte kurz nach links bewegt   │
│     und Aktionen kurz zeigt (einmalig)                   │
│                                                          │
│  2. Elastic Pull:                                        │
│     Über 150px hinaus: Rubber-band Effekt                │
│     Bei 200px: Full-Swipe = Löschen (mit Confirm)        │
│                                                          │
│  3. Haptic Feedback:                                     │
│     navigator.vibrate(10) bei Threshold-Überschreitung   │
│                                                          │
│  4. Hintergrund-Farbe enthüllt sich progressiv:          │
│     0-50px: Sage (Done)                                  │
│     50-100px: + Terracotta (Delete)                      │
│     100-150px: + Blueberry (Open)                        │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 6.5 Mobile Recipe Picker (Bottom Sheet)

```
ENHANCED BOTTOM SHEET (Mobile)
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  STAGE 1: Peek (30% Viewport)                            │
│  Initiales Öffnen zeigt nur Schnellzugriff               │
│                                                          │
│  ┌──────────────────────────────────────┐                │
│  │             ═══                       │  ← Drag Handle│
│  │                                       │                │
│  │  KÜRZLICH GEPLANT                     │                │
│  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐        │  ← Horizontal  │
│  │  │Pasta│ │Curry│ │Salat│ │Pizza│       │     Scroll     │
│  │  └────┘ └────┘ └────┘ └────┘        │                │
│  │                                       │                │
│  │  [🔍 Alle Rezepte durchsuchen...]     │  ← Tap = Stage2│
│  └──────────────────────────────────────┘                │
│                                                          │
│                                                          │
│  STAGE 2: Expanded (85% Viewport)                        │
│  Nach oben ziehen oder Suche tippen                      │
│                                                          │
│  ┌──────────────────────────────────────┐                │
│  │             ═══                       │                │
│  │                                       │                │
│  │  ┌──────────────────────────┐        │                │
│  │  │ 🔍 Rezept suchen...      │        │  ← Auto-Focus  │
│  │  └──────────────────────────┘        │                │
│  │                                       │                │
│  │  KÜRZLICH                             │                │
│  │  ┌────────────────────────────────┐  │                │
│  │  │ 🖼️  Pasta Bolognese  ⏱45min  │  │                │
│  │  ├────────────────────────────────┤  │                │
│  │  │ 🖼️  Curry Thai       ⏱30min  │  │                │
│  │  ├────────────────────────────────┤  │                │
│  │  │ 🖼️  Caesar Salat     ⏱20min  │  │                │
│  │  └────────────────────────────────┘  │                │
│  │                                       │                │
│  │  ALLE REZEPTE (42)                    │                │
│  │  ┌────────────────────────────────┐  │                │
│  │  │ 🖼️  Avocado Toast    ⏱10min  │  │                │
│  │  ├────────────────────────────────┤  │                │
│  │  │ 🖼️  Bircher Müsli    ⏱15min  │  │                │
│  │  ├────────────────────────────────┤  │                │
│  │  │ ...                            │  │                │
│  │  └────────────────────────────────┘  │                │
│  │                                       │                │
│  └──────────────────────────────────────┘                │
│                                                          │
│  KEYBOARD-HANDLING:                                      │
│  Wenn Keyboard offen → Sheet schrumpft auf               │
│  max-height: calc(100vh - keyboard-height)               │
│  via visualViewport API                                  │
│                                                          │
│  GLASSMORPHISM:                                          │
│  Glass-Sheet Variante für Premium-Feel                   │
│  border-radius: 20px 20px 0 0                            │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 6.6 Mobile Long-Press to Move

```
LONG-PRESS DRAG (Mobile Alternative zu Desktop-Drag)
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  Da Touch-Drag auf Mobile schwer implementierbar ist,    │
│  nutzen wir Long-Press + Zielauswahl statt echtem Drag:  │
│                                                          │
│  1. USER LONG-PRESSES KARTE (400ms)                      │
│     ┌────────────────────────────────┐                   │
│     │ 🖼️  Pasta Bolognese           │ ← Haptic Buzz     │
│     │     ✨ Scale 1.05, Elevation ↑ │    Karte "hebt"   │
│     └────────────────────────────────┘                   │
│                                                          │
│  2. KONTEXT-MENÜ ERSCHEINT                               │
│     ┌────────────────────────────────┐                   │
│     │                                │                   │
│     │  Wohin verschieben?            │                   │
│     │                                │                   │
│     │  ┌──────────────────────────┐  │                   │
│     │  │  Heute                   │  │                   │
│     │  │  ☀ Frühstück  🌿 Mittag  │  │                   │
│     │  │  🌙 Abend               │  │                   │
│     │  ├──────────────────────────┤  │                   │
│     │  │  Morgen                  │  │                   │
│     │  │  ☀ Frühstück  🌿 Mittag  │  │                   │
│     │  │  🌙 Abend               │  │                   │
│     │  ├──────────────────────────┤  │                   │
│     │  │  Mittwoch                │  │                   │
│     │  │  ☀ Frühstück  🌿 Mittag  │  │                   │
│     │  │  🌙 Abend               │  │                   │
│     │  └──────────────────────────┘  │                   │
│     │                                │                   │
│     │  ── oder ──                    │                   │
│     │                                │                   │
│     │  [📋 Duplizieren] [🗑 Löschen] │                   │
│     │                                │                   │
│     └────────────────────────────────┘                   │
│                                                          │
│  3. USER TAPPT ZIEL                                      │
│     → Mahlzeit wird verschoben                           │
│     → Toast: "Pasta Bolognese → Dienstag Abend"          │
│     → Karte animiert zum neuen Ort (falls sichtbar)      │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 6.7 Mobile Navigation & Header

```
MOBILE HEADER & NAVIGATION
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  COMPACT HEADER:                                         │
│  ┌──────────────────────────────────────┐                │
│  │  ☰       KW 07 • Feb 2026      ⚙️   │                │
│  └──────────────────────────────────────┘                │
│     │                                 │                  │
│     │                                 └─ Settings Gear   │
│     └─ Hamburger → Drawer mit:                           │
│        - Theme-Auswahl                                   │
│        - Sprache                                         │
│        - Grocy-Konfiguration                             │
│        - Links (GitHub, Blog)                            │
│        - Version & Release Notes                         │
│                                                          │
│  WEEK NAVIGATION (in Day Tab Bar integriert):            │
│  ┌──────────────────────────────────────┐                │
│  │  ◀  Mo   Di   Mi   Do   Fr  Sa  So ▶│                │
│  │     ●    ●    ●    ◐    ○   ○   ○   │                │
│  │     ──                               │                │
│  └──────────────────────────────────────┘                │
│     │                                 │                  │
│     ◀ Vorherige Woche                 ▶ Nächste Woche    │
│                                                          │
│  Swipe über Tab Bar hinaus = Wochenwechsel               │
│  mit Overscroll-Feedback                                 │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 7. Tablet Experience

### 7.1 Layout (640px – 1023px)

```
TABLET LAYOUT (Landscape)
┌──────────────────────────────────────────────────────────────┐
│  🍳 Grocy Meal Planning        KW 07   [⚙️] [🌙] [DE]      │
│                                                              │
│  Mo ● ── Di ● ── Mi ● ── Do ◐ ── Fr ○ ── Sa ○ ── So ○     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │                                                      │    │
│  │   Mo 10.    Di 11.    Mi 12.    Do 13.    +2 mehr   │    │
│  │   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐              │    │
│  │   │☀ Müs│ │☀ Eier│ │☀    │ │☀    │              │    │
│  │   │🌿 Sal│ │🌿 Sup│ │🌿 Wra│ │🌿    │              │    │
│  │   │🌙 Pas│ │🌙 Cur│ │🌙 Piz│ │🌙    │              │    │
│  │   └──────┘ └──────┘ └──────┘ └──────┘              │    │
│  │                                                      │    │
│  │   ← Scroll horizontal für Fr, Sa, So →              │    │
│  │                                                      │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  [+ Rezept hinzufügen]                  FAB unten rechts     │
│                                                              │
└──────────────────────────────────────────────────────────────┘

TABLET LAYOUT (Portrait)
┌────────────────────────────────────────┐
│  🍳 Grocy Meal Pl.    KW 07  [⚙️][🌙] │
│                                        │
│  Mo  Di  Mi  Do  Fr  Sa  So            │
│  ●   ●   ●   ◐   ○   ○   ○            │
│  ──                                    │
│                                        │
│  ┌────────────────────────────────┐    │
│  │  Montag, 10. Februar           │    │
│  │                                │    │
│  │  ☀ Müsli Bowl       ⏱15min   │    │
│  │  🌿 Caesar Salat     ⏱20min   │    │
│  │  🌙 Pasta Bolognese  ⏱45min   │    │
│  │                                │    │
│  └────────────────────────────────┘    │
│                                        │
│  Wie Mobile: Einzeltag + Tab Bar       │
│  ABER: 2 Spalten für Mahlzeiten        │
│  und mehr Platz für Rezeptbilder       │
│                                        │
│         ┌──────────┐                   │
│         │  + 🍽️   │                   │
│         └──────────┘                   │
│                                        │
└────────────────────────────────────────┘
```

### 7.2 Tablet Split-View (Optional, Landscape)

```
SPLIT VIEW (Tablet Landscape, bei genug Platz)
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  LINKS: Mini-Wochenübersicht     RECHTS: Tagesdetail         │
│                                                              │
│  ┌──────────────────┬───────────────────────────────────┐    │
│  │                  │                                   │    │
│  │  KW 07           │   Montag, 10. Februar             │    │
│  │                  │                                   │    │
│  │  Mo ●●● ←aktiv  │   ☀ FRÜHSTÜCK                     │    │
│  │  Di ●●○          │   ┌──────────────────────────┐    │    │
│  │  Mi ●●●          │   │ 🖼️                      │    │    │
│  │  Do ○○○          │   │ Müsli Bowl               │    │    │
│  │  Fr ○○○          │   │ ⏱ 15min  🍽 2 Portionen  │    │    │
│  │  Sa ○○○          │   └──────────────────────────┘    │    │
│  │  So ○○○          │                                   │    │
│  │                  │   🌿 MITTAGESSEN                   │    │
│  │  12/21 geplant   │   ┌──────────────────────────┐    │    │
│  │                  │   │ 🖼️                      │    │    │
│  │                  │   │ Caesar Salat             │    │    │
│  │                  │   │ ⏱ 20min  🍽 2 Portionen  │    │    │
│  │                  │   └──────────────────────────┘    │    │
│  │                  │                                   │    │
│  │                  │   🌙 ABENDESSEN                    │    │
│  │                  │   ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐   │    │
│  │                  │   │  + Rezept wählen           │   │    │
│  │                  │   └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘   │    │
│  │                  │                                   │    │
│  └──────────────────┴───────────────────────────────────┘    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 8. Komponentenbibliothek

### 8.1 Recipe Card Varianten

```
RECIPE CARD VARIANTS
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  VARIANT A: Compact (Sidebar, Mobile List)                   │
│  ┌────────────────────────────────┐                          │
│  │ ┌────┐  Pasta Bolognese       │  Höhe: 64px              │
│  │ │ 🖼️│  ⏱ 45min              │  Bild: 48×48, rounded-md │
│  │ └────┘                        │                          │
│  └────────────────────────────────┘                          │
│                                                              │
│  VARIANT B: Standard (Day Column)                            │
│  ┌────────────────────┐                                      │
│  │ ┌────────────────┐ │  Höhe: auto                          │
│  │ │                │ │  Bild: 100% width, aspect-[16/10]    │
│  │ │   🖼️ Bild     │ │  Gradient-Overlay unten               │
│  │ │                │ │                                      │
│  │ ├────────────────┤ │                                      │
│  │ │ Pasta Bolog.   │ │  Name: 14px, semibold                │
│  │ │ ⏱45m  🍽4     │ │  Badges: 11px, muted                 │
│  │ └────────────────┘ │                                      │
│  └────────────────────┘                                      │
│                                                              │
│  VARIANT C: Hero (Dashboard "Heute")                         │
│  ┌──────────────────────────────┐                            │
│  │                              │  Höhe: 240px               │
│  │     🖼️ Großes Bild           │  Bild: cover, gradient     │
│  │                              │  Name: 20px, bold, white   │
│  │  ┌─────────────────────────┐ │  Bottom-Aligned mit Blur   │
│  │  │  Pasta Bolognese        │ │                            │
│  │  │  ⏱ 45min  🍽 4 Port.    │ │                            │
│  │  │  [Rezept öffnen →]      │ │                            │
│  │  └─────────────────────────┘ │                            │
│  └──────────────────────────────┘                            │
│                                                              │
│  VARIANT D: Pill (Recipe Picker Quick-Select)                │
│  ┌──────────────────┐                                        │
│  │ 🖼 Pasta Bolog.  │  Höhe: 36px, pill-shaped               │
│  └──────────────────┘  Für "Kürzlich geplant" Section        │
│                                                              │
│  DONE STATE (alle Varianten):                                │
│  - Overlay: Sage (#7c9a6e) bei 15% Opacity                  │
│  - Checkmark-Icon oben rechts                                │
│  - Rezeptname: line-through, 60% Opacity                     │
│  - NICHT: komplette Karte bei 40% Opacity (zu stark)         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 8.2 Empty States

```
EMPTY STATE VARIANTS
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  A) Leere Section (in Day Column)                            │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐                            │
│  │                              │                            │
│  │     🍽️                       │  Dashed Border (Sand-300)  │
│  │  Rezept hinzufügen           │  Hover: Solid Border       │
│  │                              │  Hover: bg Sand-100        │
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘  Transition: 200ms         │
│                                                              │
│  B) Leere Woche (kein Rezept in der ganzen Woche)            │
│  ┌──────────────────────────────────────────────────────┐    │
│  │                                                      │    │
│  │              🍳                                       │    │
│  │                                                      │    │
│  │      Deine Woche ist noch leer!                      │    │
│  │                                                      │    │
│  │   Ziehe Rezepte aus der Seitenleiste hierher          │    │
│  │   oder tippe auf einen Tag, um zu planen.             │    │
│  │                                                      │    │
│  │   ┌──────────────────────────────┐                   │    │
│  │   │  📋 Letzte Woche kopieren    │                   │    │
│  │   └──────────────────────────────┘                   │    │
│  │   ┌──────────────────────────────┐                   │    │
│  │   │  ⭐ Mit Favoriten füllen      │                   │    │
│  │   └──────────────────────────────┘                   │    │
│  │                                                      │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  C) Keine Suchergebnisse                                     │
│  ┌──────────────────────────────────────────────────────┐    │
│  │                                                      │    │
│  │              🔍                                       │    │
│  │                                                      │    │
│  │   Kein Rezept gefunden für "xyz"                      │    │
│  │                                                      │    │
│  │   Versuche einen anderen Suchbegriff                  │    │
│  │   oder erstelle das Rezept in Grocy.                  │    │
│  │                                                      │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 8.3 Loading States (Skeleton Screens)

```
SKELETON SCREENS (statt Spinner)
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  Recipe Card Skeleton:                                       │
│  ┌────────────────────┐                                      │
│  │ ████████████████   │  ← Bild-Bereich: shimmer-Animation  │
│  │ ████████████████   │     Gradient wandert L→R             │
│  │ ████████████████   │     300ms Intervall                  │
│  │ ████████████████   │                                      │
│  ├────────────────────┤                                      │
│  │ ████████████       │  ← Text-Zeile 1 (80% Breite)        │
│  │ ████████           │  ← Text-Zeile 2 (60% Breite)        │
│  └────────────────────┘                                      │
│                                                              │
│  Day Column Skeleton:                                        │
│  ┌──────────────────┐                                        │
│  │ ██████████       │  ← Header                              │
│  │ ████████████████ │  ← Card 1                              │
│  │ ████████████████ │                                        │
│  │ ████████████████ │  ← Card 2                              │
│  │ ████████████████ │                                        │
│  └──────────────────┘                                        │
│                                                              │
│  Sidebar Skeleton:                                           │
│  ┌──────────────────┐                                        │
│  │ ████████████████ │  ← Search Bar                          │
│  │                  │                                        │
│  │ ┌──┐ ██████████ │  ← Recipe 1                             │
│  │ ┌──┐ ████████   │  ← Recipe 2                             │
│  │ ┌──┐ ██████████ │  ← Recipe 3                             │
│  │ ┌──┐ ████████   │  ← Recipe 4                             │
│  └──────────────────┘                                        │
│                                                              │
│  CSS-ANIMATION:                                              │
│  @keyframes shimmer {                                        │
│    0%   { background-position: -200% 0; }                    │
│    100% { background-position: 200% 0; }                     │
│  }                                                           │
│  background: linear-gradient(                                │
│    90deg,                                                    │
│    Sand-200 25%, Sand-100 50%, Sand-200 75%                  │
│  );                                                          │
│  background-size: 200% 100%;                                 │
│  animation: shimmer 1.5s infinite;                           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 9. Interaktionsdesign & Micro-Interactions

### 9.1 Interaktionsmatrix

```
INTERACTION MATRIX (Gerät × Aktion)
┌─────────────────────┬──────────────────┬──────────────────┬──────────────┐
│ AKTION              │ DESKTOP          │ TABLET           │ MOBILE       │
├─────────────────────┼──────────────────┼──────────────────┼──────────────┤
│ Rezept hinzufügen   │ Drag from        │ Drag (landscape) │ FAB → Bottom │
│                     │ Sidebar          │ FAB (portrait)   │ Sheet        │
├─────────────────────┼──────────────────┼──────────────────┼──────────────┤
│ Rezept verschieben  │ Drag-and-Drop    │ Long-Press →     │ Long-Press → │
│                     │                  │ Target-Picker    │ Target-Picker│
├─────────────────────┼──────────────────┼──────────────────┼──────────────┤
│ Rezept duplizieren  │ SHIFT+Drag       │ Long-Press →     │ Long-Press → │
│                     │                  │ "Duplizieren"    │ "Duplizieren"│
├─────────────────────┼──────────────────┼──────────────────┼──────────────┤
│ Rezept löschen      │ Hover → Action   │ Swipe Left       │ Swipe Left   │
│                     │ Pill / DEL-Taste │                  │              │
├─────────────────────┼──────────────────┼──────────────────┼──────────────┤
│ Als erledigt mark.  │ Hover → Action   │ Swipe Left       │ Swipe Left   │
│                     │ Pill / SPACE     │                  │              │
├─────────────────────┼──────────────────┼──────────────────┼──────────────┤
│ In Grocy öffnen     │ Hover → Action   │ Swipe Left       │ Swipe Left   │
│                     │ Pill / ENTER     │                  │              │
├─────────────────────┼──────────────────┼──────────────────┼──────────────┤
│ Woche wechseln      │ ←/→ Buttons      │ Swipe Tab Bar    │ Swipe Tab    │
│                     │ Keyboard ←/→     │ Edge-Buttons     │ Bar Edge     │
├─────────────────────┼──────────────────┼──────────────────┼──────────────┤
│ Tag wechseln        │ N/A (alle        │ Tap Tab Bar      │ Tap Tab Bar  │
│                     │  sichtbar)       │ Swipe Content    │ Swipe Content│
├─────────────────────┼──────────────────┼──────────────────┼──────────────┤
│ Rezept suchen       │ Sidebar Suchfeld │ FAB → Sheet →    │ FAB → Sheet  │
│                     │ Shortcut: /      │ Suchfeld         │ → Suchfeld   │
├─────────────────────┼──────────────────┼──────────────────┼──────────────┤
│ Rezept-Details      │ Hover → Expand   │ Tap → Drawer     │ Tap → Sheet  │
│                     │ Click → Modal    │                  │              │
└─────────────────────┴──────────────────┴──────────────────┴──────────────┘
```

### 9.2 Feedback-Systematik

```
FEEDBACK SYSTEM
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  OPTIMISTIC UI PATTERN:                                      │
│  ────────────────────────                                    │
│                                                              │
│  1. User droppt Rezept auf Mittwoch Abend                    │
│  2. SOFORT: Karte erscheint an Zielposition                  │
│     → Settle-Animation (Bounce)                              │
│     → Success-Farbe kurz flashen                             │
│  3. HINTERGRUND: API-Call an Grocy                           │
│  4a. SUCCESS: Nichts weiter (schon korrekt angezeigt)        │
│  4b. ERROR:                                                  │
│     → Karte animiert zurück zum Ursprung (400ms ease)        │
│     → Toast: "Konnte nicht gespeichert werden. Erneut?"      │
│     → Toast enthält Retry-Button                             │
│                                                              │
│  TOAST DESIGN (Neu):                                         │
│  ┌──────────────────────────────────────────┐                │
│  │                                          │                │
│  │  ✓  Pasta Bolognese → Mittwoch Abend     │  Success       │
│  │                                          │  (Sage bg)     │
│  └──────────────────────────────────────────┘                │
│                                                              │
│  ┌──────────────────────────────────────────┐                │
│  │                                          │                │
│  │  ✕  Fehler beim Speichern  [Erneut]      │  Error         │
│  │                                          │  (Terracotta)  │
│  └──────────────────────────────────────────┘                │
│                                                              │
│  Position: Bottom-Center (Mobile), Bottom-Right (Desktop)    │
│  Duration: Success=2s, Error=5s (oder bis Dismiss)           │
│  Animation: Slide-Up + Fade-In (200ms)                       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 9.3 Onboarding Hints

```
CONTEXTUAL HINTS (First-Visit & Feature Discovery)
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  HINT 1: Drag-and-Drop (Desktop, First Visit)               │
│  ┌──────────────────────────────────────────────┐            │
│  │                                              │            │
│  │   ← Ziehe Rezepte von hier                   │            │
│  │      auf einen Wochentag →                   │            │
│  │                                              │            │
│  │   Tipp: Halte SHIFT gedrückt, um zu          │            │
│  │   duplizieren statt zu verschieben.           │            │
│  │                                              │            │
│  │                         [Verstanden]          │            │
│  └──────────────────────────────────────────────┘            │
│  → Zeigt einmalig als Tooltip-Bubble, gespeichert            │
│    in localStorage als "onboarding_drag_seen"                │
│                                                              │
│  HINT 2: Swipe (Mobile, First Meal Card)                     │
│  Die erste Rezeptkarte auf Mobile animiert beim              │
│  Laden automatisch 40px nach links und zurück,               │
│  um die Swipe-Funktionalität zu demonstrieren.               │
│  → Einmalig, 800ms Verzögerung nach Laden                    │
│                                                              │
│  HINT 3: Keyboard Shortcuts (Desktop, nach 3. Besuch)        │
│  ┌──────────────────────────────────────────────┐            │
│  │  ⌨️ Tipp: Drücke ? für Keyboard-Shortcuts    │            │
│  └──────────────────────────────────────────────┘            │
│  → Subtle Toast, Bottom-Right, 5s Auto-Dismiss               │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 10. Animationen & Transitions

### 10.1 Animation-Tokens

```
ANIMATION SYSTEM
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  STATT globaler * { transition: ... } nutzen wir             │
│  gezielte Animation-Tokens per CSS Custom Properties:        │
│                                                              │
│  :root {                                                     │
│    /* Durations */                                           │
│    --duration-instant: 100ms;                                │
│    --duration-fast:    150ms;                                │
│    --duration-normal:  250ms;                                │
│    --duration-slow:    400ms;                                │
│    --duration-scenic:  600ms;                                │
│                                                              │
│    /* Easings */                                             │
│    --ease-default:  cubic-bezier(0.4, 0, 0.2, 1);          │
│    --ease-in:       cubic-bezier(0.4, 0, 1, 1);            │
│    --ease-out:      cubic-bezier(0, 0, 0.2, 1);            │
│    --ease-bounce:   cubic-bezier(0.34, 1.56, 0.64, 1);     │
│    --ease-spring:   cubic-bezier(0.22, 1.2, 0.36, 1);      │
│  }                                                           │
│                                                              │
│  /* Reduced Motion */                                        │
│  @media (prefers-reduced-motion: reduce) {                   │
│    :root {                                                   │
│      --duration-instant: 0ms;                                │
│      --duration-fast:    0ms;                                │
│      --duration-normal:  0ms;                                │
│      --duration-slow:    0ms;                                │
│      --duration-scenic:  0ms;                                │
│    }                                                         │
│  }                                                           │
│                                                              │
│  ANWENDUNG:                                                  │
│  .card {                                                     │
│    transition: transform var(--duration-fast) var(--ease-out),│
│                box-shadow var(--duration-fast) var(--ease-out);│
│  }                                                           │
│  .card:hover {                                               │
│    transform: translateY(-2px);                              │
│    box-shadow: var(--elevation-2);                           │
│  }                                                           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 10.2 Page Transitions

```
PAGE & VIEW TRANSITIONS
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  WOCHENWECHSEL (Desktop + Mobile):                           │
│  Slide-Transition in Navigationsrichtung                     │
│                                                              │
│  → Nächste Woche:                                            │
│    Content schiebt nach LINKS raus (opacity 1→0)             │
│    Neuer Content schiebt von RECHTS rein (opacity 0→1)       │
│    Duration: --duration-normal (250ms)                        │
│    Easing: --ease-default                                    │
│                                                              │
│  ← Vorherige Woche:                                          │
│    Content schiebt nach RECHTS raus                           │
│    Neuer Content schiebt von LINKS rein                      │
│                                                              │
│  TAGWECHSEL (Mobile):                                        │
│  Gleiche Slide-Logik, aber nur für den Day-Content           │
│  Tab Bar bleibt stationär, Active-Indikator animiert         │
│                                                              │
│  SIDEBAR TOGGLE (Desktop):                                   │
│  Width-Animation: 280px ↔ 64px                               │
│  Duration: --duration-slow (400ms)                           │
│  Easing: --ease-spring                                       │
│  Sidebar-Content: Fade Out/In bei Zustandswechsel            │
│                                                              │
│  BOTTOM SHEET (Mobile):                                      │
│  Stage 1 (Peek): translateY(70%) → translateY(0)             │
│  Stage 2 (Full): height 30vh → 85vh                          │
│  Backdrop: opacity 0 → 0.3                                   │
│  Duration: --duration-slow (400ms)                           │
│  Easing: --ease-spring                                       │
│                                                              │
│  RECIPE CARD ENTER (bei Seitenladung):                       │
│  Staggered Fade-Up Animation                                 │
│  Jede Karte: opacity 0→1, translateY(8px→0)                  │
│  Delay: Index × 50ms (max 300ms)                             │
│  Duration: --duration-normal                                  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 11. Accessibility

### 11.1 WCAG 2.1 AA Compliance Plan

```
ACCESSIBILITY REQUIREMENTS
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  KEYBOARD NAVIGATION:                                        │
│  ─────────────────────                                       │
│  - Tab-Reihenfolge: Header → Sidebar → Week View → Footer   │
│  - Arrow Keys innerhalb von Gruppen (Tage, Rezepte)         │
│  - Focus-Trap in Modals/Bottom Sheets                        │
│  - Skip-Link am Seitenanfang ("Zum Wochenplan springen")    │
│  - Roving Tabindex für Day-Tabs und Recipe-Listen            │
│                                                              │
│  ARIA LABELS:                                                │
│  ────────────                                                │
│  <nav aria-label="Wochennavigation">                         │
│  <section aria-label="Montag, 10. Februar - Frühstück">     │
│  <button aria-label="Rezept löschen: Pasta Bolognese">      │
│  <div role="listbox" aria-label="Rezeptliste">               │
│  <div role="option" aria-selected="false">                   │
│                                                              │
│  DRAG-AND-DROP ANNOUNCEMENTS:                                │
│  ─────────────────────────────                               │
│  aria-live="polite" Region für Drag-Status:                  │
│  "Pasta Bolognese aufgenommen"                               │
│  "Über Mittwoch, Abendessen"                                 │
│  "Abgelegt auf Mittwoch, Abendessen"                         │
│  "Drag abgebrochen"                                          │
│                                                              │
│  FARBKONTRASTE:                                              │
│  ───────────────                                             │
│  Alle Text/Hintergrund-Kombinationen: ≥ 4.5:1 (AA)          │
│  Große Texte (18px+): ≥ 3:1                                 │
│  UI-Komponenten: ≥ 3:1 gegen angrenzende Farben             │
│  "Done"-State: NICHT nur Opacity, sondern Farbe + Icon       │
│                                                              │
│  REDUCED MOTION:                                             │
│  ────────────────                                            │
│  prefers-reduced-motion: reduce → Alle Animationen aus       │
│  (via CSS Custom Properties, siehe Abschnitt 10.1)           │
│                                                              │
│  SCREEN READER:                                              │
│  ──────────────                                              │
│  - Semantische Headings-Hierarchie (h1→h2→h3)               │
│  - Rezeptbilder: alt="Foto von [Rezeptname]"                 │
│  - Dekorative Icons: aria-hidden="true"                      │
│  - Ladehinweise: aria-busy="true" auf ladenden Containern    │
│  - Empty States: Visuell und als Text für Screen Reader      │
│                                                              │
│  FOCUS STYLES:                                               │
│  ─────────────                                               │
│  outline: 2px solid var(--color-blueberry)                   │
│  outline-offset: 2px                                         │
│  border-radius: inherit                                      │
│  :focus:not(:focus-visible) → outline: none                  │
│  (Focus nur bei Keyboard, nicht bei Mausklick)               │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 12. Technische Umsetzungsstrategie

### 12.1 Breakpoint-System (Neu)

```typescript
// Tailwind Config Erweiterung
// tailwind.config.js

module.exports = {
  theme: {
    screens: {
      'sm':  '640px',   // Mobile Landscape / große Phones
      'md':  '768px',   // Tablet Portrait
      'lg':  '1024px',  // Tablet Landscape / kleine Desktops
      'xl':  '1280px',  // Desktop
      '2xl': '1536px',  // Große Desktops
    },
    extend: {
      // Custom Farben (Food-Palette)
      colors: {
        sand:       { 50: '#fdfcfa', 100: '#f7f5f0', ... },
        saffron:    { DEFAULT: '#e8a317', ... },
        terracotta: { DEFAULT: '#c4644a', ... },
        sage:       { DEFAULT: '#7c9a6e', ... },
        blueberry:  { DEFAULT: '#5b6abf', ... },
        cream:      { DEFAULT: '#f5f0e8' },
        espresso:   { DEFAULT: '#4a3728' },
      },
    }
  }
}
```

### 12.2 Layout-Entscheidungsbaum

```
WELCHES LAYOUT WIRD GERENDERT?
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  Viewport Width?                                         │
│  │                                                       │
│  ├─ < 640px ──────────────────── MOBILE LAYOUT           │
│  │  Einzeltag-Ansicht + Tab Bar + FAB + Bottom Sheet     │
│  │                                                       │
│  ├─ 640px - 1023px                                       │
│  │  │                                                    │
│  │  ├─ Portrait ──────────────── TABLET PORTRAIT         │
│  │  │  Wie Mobile, aber 2-spaltig innerhalb des Tages    │
│  │  │                                                    │
│  │  └─ Landscape ─────────────── TABLET LANDSCAPE        │
│  │     Split-View oder 4-5 sichtbare Tage               │
│  │                                                       │
│  └─ ≥ 1024px ─────────────────── DESKTOP LAYOUT          │
│     Sidebar + 7-Tage-Wochenansicht + Drag-and-Drop      │
│                                                          │
│  IMPLEMENTIERUNG:                                        │
│  Nicht @media queries auf Template-Ebene, sondern        │
│  BreakpointObserver (Angular CDK) + *ngIf / @switch     │
│  für komplett unterschiedliche Templates.                 │
│                                                          │
│  Grund: Performance (nicht alle Templates rendern         │
│  und per CSS verstecken) + Wartbarkeit                   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 12.3 Migrations-Ansatz

```
INKREMENTELLE MIGRATION (kein Big-Bang-Rewrite)
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  SCHICHT 1: Design Tokens (Woche 1-2)                    │
│  ──────────────────────────────────────                   │
│  - CSS Custom Properties einführen                       │
│  - Farbpalette austauschen (Stone → Sand)                │
│  - Typography-Scale definieren                           │
│  - Elevation-System einführen                            │
│  - Animation-Tokens implementieren                       │
│  - Globale * { transition } entfernen                    │
│  → Visuelle Verbesserung bei null Feature-Risiko         │
│                                                          │
│  SCHICHT 2: Komponentenredesign (Woche 3-5)              │
│  ──────────────────────────────────────────               │
│  - Recipe Card Variants implementieren                   │
│  - Skeleton Loading einbauen                             │
│  - Empty States hinzufügen                               │
│  - Glassmorphism auf Sidebar/Sheet                       │
│  - Drag-and-Drop Feedback verbessern                     │
│  → Bestehende Funktionalität, bessere Optik              │
│                                                          │
│  SCHICHT 3: Layout-Architektur (Woche 6-9)               │
│  ──────────────────────────────────────────               │
│  - BreakpointObserver integrieren                        │
│  - Mobile Einzeltag-Ansicht + Tab Bar                    │
│  - Tablet Layout (Portrait + Landscape)                  │
│  - Collapsible Sidebar (Desktop)                         │
│  - Week Progress Bar                                     │
│  → Fundamental bessere responsive Experience             │
│                                                          │
│  SCHICHT 4: Advanced Interactions (Woche 10-12)          │
│  ──────────────────────────────────────────────           │
│  - Long-Press to Move (Mobile)                           │
│  - Enhanced Bottom Sheet (Stages)                        │
│  - Keyboard Shortcuts (Desktop)                          │
│  - Page Transitions                                      │
│  - Onboarding Hints                                      │
│  → Premium-Feel, Power-User-Features                     │
│                                                          │
│  SCHICHT 5: Dashboard & Extras (Woche 13+)               │
│  ──────────────────────────────────────────               │
│  - Bento Dashboard (Optional Toggle)                     │
│  - Section Color Coding                                  │
│  - Rezeptvorschläge-UI                                   │
│  → Differenzierungsmerkmale                              │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 13. Priorisierung & Phasenplan

### Impact/Effort-Matrix

```
                        IMPACT
                  Low          High
            ┌───────────┬───────────────┐
            │           │               │
    Low     │  Section  │  Skeleton     │
            │  Colors   │  Loading      │
   EFFORT   │           │  Glassmorphism│
            │  Toast    │  Empty States │
            │  Redesign │  Card Refresh │
            │           │  Progress Bar │
            ├───────────┼───────────────┤
            │           │               │
    High    │  Bento    │  Mobile Day   │
            │  Dashb.   │  View         │
            │           │  Collapsible  │
            │  Calendar │  Sidebar      │
            │  Export   │  Long-Press   │
            │           │  Keyboard Nav │
            │           │  DnD Feedback │
            └───────────┴───────────────┘

PRIORITÄT:
1. High Impact + Low Effort   → SOFORT (Quick Wins)
2. High Impact + High Effort  → NEXT (Kernverbesserungen)
3. Low Impact + Low Effort    → LATER (Polish)
4. Low Impact + High Effort   → BACKLOG (Nice-to-have)
```

### Phasen-Zusammenfassung

| Phase | Zeitrahmen | Fokus | Ergebnis |
|---|---|---|---|
| **1: Visual Foundation** | 2 Wochen | Design Tokens, Farbpalette, Typografie, Animation-System | Moderneres Erscheinungsbild bei voller Kompatibilität |
| **2: Component Polish** | 3 Wochen | Skeleton Loading, Empty States, Glassmorphism, Card Refresh, Progress Bar | Professionelles, poliertes UI |
| **3: Adaptive Layouts** | 4 Wochen | Mobile Day View, Tablet Layouts, Collapsible Sidebar, Tab Bar Navigation | Echte Multi-Device Experience |
| **4: Premium Interactions** | 3 Wochen | Long-Press Move, Enhanced DnD, Keyboard Shortcuts, Page Transitions, Onboarding | Power-User-Freude, Premium-Feel |
| **5: Differentiation** | Ongoing | Bento Dashboard, Recipe Suggestions UI, Section Color Coding | Alleinstellungsmerkmale |

---

## Anhang: Design-Referenzen

### Inspirierende Apps & Interfaces

| App/Design | Was übernehmen? |
|---|---|
| **Apple Calendar (iPadOS)** | Multi-Column Layout, sanfte Animations |
| **Notion Calendar** | Swimlane-Layout, Glassmorphism |
| **Linear** | Bento Dashboard, Keyboard-First UX |
| **Mealime** | Quick-Fill, Bottom Sheet Patterns |
| **Fantastical** | Day/Week/Month Toggle, Micro-Visualizations |
| **Things 3** | Empty States, Subtle Animations |
| **Arc Browser** | Collapsible Sidebar, Modern Glassmorphism |
| **Amie** | Warm Color Palette, Progressive Disclosure |

### Farbinspiration

Die warme Sand/Saffron-Palette ist inspiriert von:
- Natürlichen Lebensmittelfarben (Brot, Gewürze, Kräuter)
- Skandinavischem Interior Design (warm, einladend)
- Premium Food-Fotografie-Ästhetik
- Nicht: Technische Blau/Grau-Töne (zu kalt für Food)
