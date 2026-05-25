# Projektdokumentation – BUILDEX

> Digitale Projektverwaltung als Einstieg in den durchgängigen Materialbeschaffungs-Workflow auf Baustellen.

**Autor:** Marko Vukcevic ([vukcema1@students.zhaw.ch](mailto:vukcema1@students.zhaw.ch))
**Modul:** Prototyping (w.BA.XX.3Pt-WIN.XX), ZHAW Wirtschaftsinformatik, FS 2026
**Repository:** <https://github.com/Marko-Vukcevic/buildex>
**Live-Demo:** *Wird nach Netlify-Deploy ergänzt.*
**Figma-Mockup:** <https://www.figma.com/proto/w0d5idq8xY1KQAPKX1H2Kg/Mock-Up?node-id=6042-1194&starting-point-node-id=6042%3A1194>

## Inhaltsverzeichnis

1. [Ausgangslage](#1-ausgangslage)
2. [Lösungsidee](#2-lösungsidee)
3. [Vorgehen & Artefakte](#3-vorgehen--artefakte)
    1. [Understand & Define](#31-understand--define)
    2. [Sketch](#32-sketch)
    3. [Decide](#33-decide)
    4. [Prototype](#34-prototype)
    5. [Validate](#35-validate)
4. [Erweiterungen](#4-erweiterungen)
5. [Projektorganisation](#5-projektorganisation)
6. [KI-Deklaration](#6-ki-deklaration)
7. [Anhang](#7-anhang)

> **Hinweis:** Massgeblich sind die im **Unterricht** und auf **Moodle** kommunizierten Anforderungen.

---

## 1. Ausgangslage

Die Materialbeschaffung auf einer Baustelle läuft heute über fragmentierte, analoge Kanäle: PDF-Bestellungen per E-Mail, WhatsApp-Gruppen für Rückfragen, Excel zur Übersicht und Papier-Lieferscheine im Ordner. Auf einer mittleren Baustelle entstehen pro Woche zehn oder mehr parallele Lieferungen mit dutzenden Bestellungen für Bewehrung, Beton, Kies, Stahlteile oder vorfabrizierte Elemente.

- **Problem:** Es gibt keinen durchgängigen Workflow von der Bestellung über die Liefertermin-Planung bis zum Rechnungsabgleich. Bestellungen werden manuell als PDF erstellt, Lieferscheine gehen im Papierstapel verloren, der Abgleich Bestellung ↔ Lieferung ↔ Rechnung passiert erst Wochen später bei der Rechnungsprüfung. Das ist fehleranfällig und kostet Marge und Termine. Zusätzlich verhindert die rein analoge Datenlage jede strukturierte Auswertung – etwa für CO₂-Reporting auf Projektebene, obwohl die Baubranche rund 11 % des globalen CO₂-Ausstosses verursacht.
- **Ziele:**
  - Bestellungen, Liefertermine, Lieferscheine und Rechnungen pro Bauprojekt **zentral und nachvollziehbar** verwalten.
  - Wareneingang baustellentauglich (mobile, mit Arbeitshandschuhen) in unter 30 Sekunden bestätigen können.
  - Eine strukturierte Datenbasis als Grundlage für Rechnungsabgleich, Reporting und langfristig CO₂-Bilanzen schaffen.
- **Primäre Zielgruppe:** Bauführer und Poliere auf operativer Ebene (mittlere bis grosse Hochbau-Projekte, Projektvolumen CHF 5–50 Mio).
- **Weitere Stakeholder:** Bauleiter / Projektleiter (Kontrolle, Rechnungsfreigabe), Planer / Ingenieure (Bestellungen aus der Planung auslösen), Lieferanten und Subunternehmen (Lieferzusagen, Bestätigungen).

## 2. Lösungsidee

**BUILDEX** ist eine Web-App, die Bestellungen, Liefertermine, Lieferscheine und Rechnungen pro Bauprojekt in einem durchgängigen Workflow zentralisiert. Planer lösen Bestellungen strukturiert aus, Bauführer terminieren in einer Kalenderansicht und bestätigen Wareneingänge mobil in unter 30 Sekunden, Bauleiter prüfen den automatisierten Abgleich Lieferschein ↔ Rechnung in Minuten statt Stunden.

- **Kernfunktionalität (Vision):**
  1. Strukturierte Bestell-Erfassung (Bewehrung, Beton, Fertigteile, …) direkt aus der Planung.
  2. Baustellentaugliche Kalenderansicht aller geplanten Lieferungen pro Projekt – mobile-first, offline-tauglich.
  3. Automatischer Lieferschein-↔-Rechnungs-Abgleich mit stichprobenartiger Freigabe durch den Bauleiter.
  4. Projektübergreifendes Dashboard mit Status-Pipeline (offen / bestätigt / geliefert / verrechnet).
- **Annahmen:** Bauführer akzeptieren eine digitale App nur, wenn die häufigste Aktion (Bestätigen einer Lieferung) in unter 30 Sekunden erledigt ist und auch mit instabilem Netz funktioniert.
- **Abgrenzung für diesen Prototype:**
  - Im Rahmen der Modul-Übungen (Wochen 8–14) wird der **Projekt-Layer** als Fundament gebaut: das digitale Anlegen, Auflisten, Bearbeiten und Auswerten von Bauprojekten. Erst auf dieser Grundlage können in späteren Iterationen die Order-, Liefer- und Rechnungs-Workflows aufgesetzt werden.
  - **Nicht im Scope:** echte Authentisierung (single User), Mobile-Native-App, Offline-Sync, Anbindung an Buchhaltungs- oder CAD-Tools, Multi-Tenant-Logik. Diese Punkte sind klar in die nächsten Iterationen verschoben.

## 3. Vorgehen & Artefakte

Das Projekt folgt dem phasenbasierten Design-Sprint-Vorgehen aus dem Modul.

### 3.1 Understand & Define

- **Zielgruppenverständnis:** Die Beobachtungen aus der praktischen Tätigkeit als Bauführer wurden mit Recherche zu bestehenden Tools (PlanRadar, Capmo, Procore, Comstruct, Nevaris, Bauhub, Sablono) ergänzt. Die Pain Points (Medienbruch bei Bestellungen, fehlende Wochenübersicht auf der Baustelle, manueller Rechnungsabgleich) sind in der Ideenfindungs-Abgabe vollständig dokumentiert (siehe Anhang).
- **Wesentliche Erkenntnisse:**
  - Bestehende Tools sind entweder **zu umfassend** (Procore, Capmo, PlanRadar – grosse SaaS-Plattformen mit Liefer-Tracking nur als Nebenfeature) oder **zu spezialisiert** (Comstruct – Bestellungen ohne Baustellen-Sicht).
  - Es existiert **kein Tool**, das den durchgängigen Workflow Bestellung → Kalender → Lieferschein → Rechnungsabgleich über alle Stakeholder in einem Produkt abbildet.
  - Bedienbarkeit am Handy mit Arbeitshandschuhen und Offline-Fähigkeit sind unterschätzte Kriterien.
- **Drei HMW-Fragen** wurden formuliert und priorisiert. Als **Leitfrage** wurde gewählt: *„Wie könnten wir Bauführern und Polieren eine baustellentaugliche Kalenderansicht geben, die alle eingehenden Lieferungen pro Projekt auf einen Blick zeigt und in unter 30 Sekunden als angekommen bestätigt werden kann?"*

### 3.2 Sketch

- **Variantenüberblick:** Drei Layout-Varianten wurden auf Papier skizziert: (a) listen-orientiert (Bauakten-Stil wie Capmo), (b) projekt-kartenbasiert (vergleichbar mit Trello/Asana, Drill-Down via Cards), (c) kalender-zentriert (Wochenansicht als Startseite). Die persistente Sidebar-Navigation (Slack-/Notion-Pattern) wurde durchgehend übernommen, weil sie auf Desktop-Auflösungen Standard und für Erweiterungen offen ist.
- **Skizzen:** Mehrere Hand-Skizzen pro Variante haben unterschiedliche Ansichten der Dashboard- und Detail-Seiten getestet (siehe Anhang/Repo).

### 3.3 Decide

- **Gewählte Variante & Begründung:** Eine **hybride Lösung** wurde gewählt – Card-basiertes Projekt-Dashboard als Einstieg, persistente Sidebar links, Detail-Page pro Projekt. Die Kalender-Leitfrage wird als nächste Iteration über die Projekt-Detail-Seite aufgesetzt (Lieferungen werden in Phase 2 an ein Projekt gehängt).
- **End-to-End-Ablauf:**
  1. Bauleiter öffnet App → sieht **Projektübersicht** mit allen Baustellen als Cards.
  2. Klick auf "+ Neues Projekt" → Formular → Projekt wird angelegt und in MongoDB persistiert.
  3. Zurück auf Übersicht: Card erscheint mit Status-Badge, Adresse, Projektdauer.
  4. Klick auf Card → Detail-Seite mit allen Stammdaten, Inline-Edit, Notizen, Lösch-Möglichkeit.
  5. Filter / Such-Funktion erlaubt Eingrenzung nach Status oder freier Suche.
  6. `/stats`-Seite gibt aggregierten Überblick (Anzahl pro Status, zuletzt erstellte Projekte).
- **Mockup:** Interaktives Figma-Mockup mit Login, Dashboard, Settings, Projektansicht und Kalender. Link siehe oben. Der Prototyp baut visuell und konzeptionell auf diesem Mockup auf.

### 3.4 Prototype

#### 3.4.1 Entwurf (Design)

- **Informationsarchitektur:** Vier Top-Level-Routen, alle mit derselben Sidebar:
  - `/` – **Projektüberblick**: Stats-Kacheln, Filter (Such-Feld + Status-Dropdown), Card-Grid.
  - `/projects/new` – **Erfassungs-Formular** mit Validierung.
  - `/projects/[id]` – **Detail-Page** mit Inline-Edit und Delete-Confirm.
  - `/stats` – **Statistik-Page** mit Balken-Charts pro Status und Liste der zuletzt erstellten Projekte.
  - `/account` – **Konto-Settings** (statischer Mockup-Platzhalter aus Phase-2-Scope).
- **User Interface Design:** Übernommen vom Figma-Mockup:
  - Linke schmale Sidebar mit gelbem B-Logo, User-Name, vier Nav-Items mit Icons. Aktive Route ist gelb hervorgehoben.
  - Card-Grid in der Mitte, weisse Cards auf grauem Hintergrund, gelber Akzent als Status-Badge und Hover-Indikator.
  - Konsistente Typografie (Inter / System-Sans), abgestimmtes Spacing über CSS-Variablen in `src/app.css`.
- **Designentscheidungen:**
  - **Zielsystem Desktop (nicht Mobile).** Begründung: primäre Persona arbeitet im Baucontainer/Hauptsitz an einem MacBook; mehrere Projekte parallel zu verwalten ist auf 6"-Display nicht zumutbar. Mobile-Companion-App ist für Phase 3 geplant.
  - **Projekt-zentrisches Modell.** Begründung: Im mentalen Modell eines Bauleiters dreht sich alles um Projekte (Baustellen). Card-Metapher (vgl. Trello/Asana) ist branchenüblich und ermöglicht Drill-Down (Nielsen-Heuristik #6 *Recognition over Recall*).
  - **Persistente Sidebar.** Begründung: *Consistency & standards* (Nielsen #4) – Hauptnavigation bleibt überall an gleicher Position; Erweiterungen ohne Layout-Bruch möglich.
  - **Gelb als Akzentfarbe.** Begründung: Branchen-Konnotation (Helme, Warnwesten, Markierungen) und Differenzierung gegen blau/grün-dominierte SaaS-Tools wie Procore.
  - **Mehrere Status-Badges (offen/laufend/pausiert/abgeschlossen).** Begründung: schnelle visuelle Erfassung des Projekt-Zustands ohne Drill-Down (*Visibility of system status*, Nielsen #1).

#### 3.4.2 Umsetzung (Technik)

- **Technologie-Stack:**
  - **Framework:** SvelteKit 2 mit Svelte 5 (Runes-Modus aktiv), `@sveltejs/adapter-auto`.
  - **Sprache:** JavaScript (kein TypeScript – bewusst gewählt für klaren Lernfokus auf SvelteKit-Grundlagen).
  - **Datenbank:** MongoDB Atlas (M0 Free Tier, AWS Frankfurt). Anbindung über den offiziellen `mongodb`-Treiber.
  - **Hosting:** Netlify (mit `@sveltejs/adapter-auto` automatische Detection und SvelteKit-Build).
  - **Style:** Reines CSS mit Custom Properties (Tokens in `src/app.css`) – kein externes UI-Framework, um den Code-Umfang im Lehrkontext überschaubar zu halten.
- **Tooling:** Visual Studio Code mit Svelte-Extension, GitHub Desktop / CLI für Versionierung, MongoDB Atlas Web-UI für DB-Inspektion, Figma für Mockups. Der KI-Einsatz ist im Kapitel **KI-Deklaration** dokumentiert.
- **Struktur & Komponenten:**
  ```text
  src/
  ├── app.css                                  ← globale Design-Tokens
  ├── lib/
  │   ├── components/
  │   │   ├── Sidebar.svelte                   ← persistente Navigation
  │   │   └── ProjectCard.svelte               ← Card im Grid
  │   └── server/
  │       ├── db.js                            ← MongoDB-Connection (Singleton)
  │       └── projects.js                      ← CRUD + Validierung + Statistik
  └── routes/
      ├── +layout.svelte                       ← App-Skelett (Sidebar + Content)
      ├── +page.svelte                         ← Dashboard
      ├── +page.server.js                      ← Liste + Filter laden
      ├── projects/
      │   ├── new/+page.svelte
      │   ├── new/+page.server.js              ← Form-Action: Create
      │   ├── [id]/+page.svelte
      │   └── [id]/+page.server.js             ← Form-Actions: Update + Delete
      ├── stats/+page.svelte
      ├── stats/+page.server.js
      └── account/+page.svelte
  ```
  - Zentrale Validierung in `src/lib/server/projects.js` (Pflichtfeld `name`, Maxlängen, Status-Whitelist, Datums-Plausibilität).
  - Server-only Code (DB-Connection, Passwort, Validierung) ist konsequent unter `src/lib/server/` abgelegt – SvelteKit bundelt diese Dateien niemals in den Client-Build.
- **Daten & Schnittstellen:**
  - Datenmodell `projects`:
    ```js
    {
      _id: ObjectId,
      name: string,                         // Pflicht, max 100
      address: string,                      // optional, max 200
      startDate: string,                    // "YYYY-MM"
      endDate: string,                      // "YYYY-MM"
      status: 'offen' | 'laufend' | 'pausiert' | 'abgeschlossen',
      notes: string,                        // optional, max 2000
      createdAt: Date,
      updatedAt: Date
    }
    ```
  - Server-Loads (`+page.server.js`) lesen via `getProjectsCollection()`, Form-Actions schreiben.
  - Query-Parameter steuern Filter (`/?search=...&status=...`).
- **Deployment:** Auf Netlify deployed. Build-Befehl `npm run build`. Environment Variable `MONGODB_URI` ist im Netlify-Dashboard hinterlegt (nicht im Repo).
  - **Live-URL:** *Wird nach Netlify-Deploy ergänzt.*
- **Besondere Entscheidungen / Trade-offs:**
  - **Kein TypeScript** – Lehrkontext, schnellere Iteration. Validierung kompensiert die fehlende statische Typprüfung.
  - **MongoDB statt SQL** – passt zum Modul-Kontext (Data Management deckt MongoDB ab) und liefert flexible Erweiterbarkeit für die kommenden Order/Delivery-Subdokumente.
  - **Kein Auth im ersten Wurf, später nachgerüstet** – ursprünglich war Auth bewusst out-of-scope (Fokus auf CRUD); nach der Usability-Evaluation am 20.05.2026 wurde das Issue *„Anmeldeprozess fehlt"* aufgenommen und ein Demo-Auth-System nachgebaut (siehe Kap. 4.9).
  - **Explizit `@sveltejs/adapter-netlify` statt `adapter-auto`** – `adapter-auto` produzierte beim Netlify-Build ein leeres Publish-Verzeichnis, was zu einem 404 auf der deployten App führte. Erst der explizite Netlify-Adapter mit `netlify.toml` löste das Deployment-Problem.

### 3.5 Validate

- **URL der getesteten Version:** <https://bldx.netlify.app/> (commit `df73b12`, Stand 24.05.2026 vor Auth-Nachrüstung). Die zum Testzeitpunkt deployte Version entspricht dem Stand vor Kap. 4.9 (kein Auth-System, sonst alle dokumentierten Workflows aktiv).
- **Ziele der Prüfung:**
  1. Können neue Bauleiter ohne Anleitung ein Projekt erfassen und Lieferungen dazu erfassen?
  2. Verstehen sie das Konzept der Wochenkalender-Ansicht und können sie Konflikte erkennen?
  3. Sind die Begriffe (Status-Bezeichnungen, „CO₂-Bilanz", „überfällig") für das mentale Modell des Bauumfelds passend?
  4. Welche Workflows fehlen aus Nutzer-Sicht, die für die Akzeptanz als Bauleitungs-Tool zentral wären?
- **Vorgehen:** Moderierte Vor-Ort-Usability-Evaluation am **20.05.2026** im Rahmen des Pflichttermins der Kleinklasse (TZBISa, 12:00 Uhr, Raum SW 324). Think-Aloud-Methode mit Feedback-Grid-Protokollierung pro Testperson, anschliessend gemeinsame Diskussion zur Konsolidierung.
- **Stichprobe:** **n = 2 Testpersonen, beide Mitstudierende aus der Kleinklasse:**
  - Valdrin Dalipi (dalipval@students.zhaw.ch) – Wirtschaftsinformatik-Student, keine Bauerfahrung.
  - Aladin Kermo (kermoala@students.zhaw.ch) – Wirtschaftsinformatik-Student, keine Bauerfahrung.

  Profil-Lücke ist bewusst dokumentiert: das Profil entspricht **nicht** der primären Zielgruppe (Bauführer/Bauleiter). Die Ergebnisse zeigen daher vor allem Usability-Aspekte aus *Laien-Sicht* (Lesbarkeit, Affordances, Begriffsverständnis). Domänen-spezifische Erkenntnisse (z.B. ob die Lieferungs-Status-Pipeline einem echten Bauwerkflow entspricht) werden in einer Folge-Iteration mit Bauleiter-Probanden geprüft.

- **Aufgaben/Szenarien:**
  1. *„Du bist neu in der App. Verschaffe dir einen Überblick über die aktuellen Baustellen."* (Dashboard, Filter, Card-Übersicht)
  2. *„Du möchtest sehen, welche Materiallieferungen diese Woche und nächste Woche eingehen. Verschaffe dir die Übersicht."* (Wochenkalender)
  3. *„Lege ein neues Bauprojekt an mit Name, Adresse und Status."* (Neues Projekt)
  4. *„Bestelle für eines der bestehenden Projekte eine zusätzliche Material-Lieferung."* (Lieferungen-CRUD auf Detail-Seite)
  5. *„Lege ein neues Bauleiter-Konto an, damit du selber damit arbeiten kannst."* (Anmeldeprozess — bewusst, weil noch nicht vorhanden, um die Reaktion zu beobachten)

- **Kennzahlen & Beobachtungen (Feedback Grid – konsolidiert):**

  | 😊 Was hat gut funktioniert | 😞 Was hat nicht gut funktioniert |
  |---|---|
  | **Projektübersicht** auf dem Dashboard: Karten-Layout wird sofort verstanden, beide Probanden navigieren intuitiv. | **Anmeldeprozess fehlt komplett** – beide Probanden suchen vergeblich nach einem Login/Register-Bereich. Aufgabe 5 nicht durchführbar. |
  | **Kalenderübersicht** in der Sidebar wird gefunden, die Wochen-Navigation und farblich kodierte Status werden positiv erwähnt. | **Manche Buttons / Workflows nicht intuitiv genug** – z.B. der Status-Wechsel direkt in der Lieferungs-Tabelle wird zunächst nicht als interaktiv erkannt; Edit-Modus auf Detail-Seite wird teils übersehen. |
  | **Darstellung und Nutzbarkeit** wurden insgesamt als sauber und übersichtlich bewertet (klares Design, gelb-weiss-Schema, lesbare Typo). | |

  | 💡 Neue Ideen / Anforderungen | ❓ Was war unklar |
  |---|---|
  | **Anmelde-/Registrierungs-Prozess** soll eingebaut werden, damit Mehr-Nutzer-Szenarien möglich werden. | Vereinzelte Affordance-Schwächen — siehe oben „nicht intuitiv genug" — keine konkreten weiteren Begriffs-Verwirrungen genannt. |
  | Konkret als Verbesserungsfeld: **„Anmeldeprozess anpassen / verbessern"**. | |

- **Issue Map (Severity-Skala 0–4 nach Nielsen):**

  | Issue-ID | Beschreibung | Schweregrad | Häufigkeit |
  |---|---|---|---|
  | **3.5.1** | Anmeldeprozess fehlt (keine Login/Register/Logout-Funktion) | **3 — Gross** | beide Tester |
  | 3.5.2 | Status-Wechsel-Dropdown in Lieferungs-Tabelle wird nicht sofort als interaktiv erkannt | 2 — Klein | 1 von 2 |
  | 3.5.3 | „Bearbeiten"-Button auf Detail-Seite wird auf den ersten Blick übersehen (Position rechts unten) | 2 — Klein | 1 von 2 |

- **Zusammenfassung der Resultate:** Die zentrale Such-/Browse-Funktionalität (Dashboard, Kalender, Stats) wird intuitiv bedient. Der grösste konsistent identifizierte Mangel ist der **fehlende Anmeldeprozess** — beide Tester suchen aktiv danach und können Aufgabe 5 nicht ausführen. Kleinere Affordance-Schwächen (Status-Dropdown, Bearbeiten-Button) sind in Folgeiterationen zu beheben.

- **Abgeleitete Verbesserungen (Priorisierung):**
  1. **Issue 3.5.1 — Auth-System implementieren.** Hohe Priorität, blockiert die wahrgenommene Vollständigkeit. **→ Umgesetzt in Erweiterung 4.9** (Demo-Login/Register/Logout mit Cookie-Session, siehe Kap. 4.9).
  2. Issue 3.5.2 — Status-Dropdowns visuell als interaktiv markieren (z.B. dezenter Hover-Effekt oder Chevron-Icon). Mittlere Priorität. *Backlog für Phase 2.*
  3. Issue 3.5.3 — „Bearbeiten"-Button visuell betonen (z.B. weiter oben platzieren oder farblich hervorheben). Niedrige Priorität. *Backlog für Phase 2.*

  Weitere Backlog-Kandidaten (nicht aus dieser Evaluation, sondern aus Selbst-Review): Bauherr-Feld, Drag-and-Drop-Status-Wechsel, Inline-Edit direkt in der Card.

## 4. Erweiterungen

> Über den Mindestumfang (Projekt-CRUD) hinaus wurden **neun Erweiterungen** umgesetzt — vier davon ergänzen den ursprünglichen Scope (Detail-Page, Filter, Stats, Validierung), vier weitere realisieren die in der Ideenfindung beschriebene Kern-Vision (Lieferungen, Wochenkalender, CO₂-Bilanz, Notizen-Timeline), und eine wurde **direkt aus der Usability-Evaluation abgeleitet** (Auth-System). Damit wird BUILDEX vom generischen Projekt-CRUD zu einem fachspezifischen Bauleitungs-Tool mit Multi-User-Fähigkeit.

### 4.1 Projekt-Detail-Seite mit Inline-Edit und Delete-Confirm
- **Beschreibung & Nutzen:** Eigene Route `/projects/[id]` mit vollständigen Stammdaten, Notizen, Erstellungs-/Änderungs-Zeitstempel. Edit-Modus passiert inline auf derselben Seite (keine zusätzliche Navigation). Löschen erfordert eine native `confirm()`-Bestätigung (*Error prevention*, Nielsen #5).
- **Wo umgesetzt:**
  - Frontend: `src/routes/projects/[id]/+page.svelte` (Edit-Toggle mit `$state`).
  - Backend: `src/routes/projects/[id]/+page.server.js` (Form-Actions `update` und `delete`).
  - Datenbank: `updateProject(id, data)` und `deleteProject(id)` in `src/lib/server/projects.js`.
- **Referenz:** Beschreibung in Kap. 3.4.

### 4.2 Filter & Such-Funktion auf dem Dashboard
- **Beschreibung & Nutzen:** Bauleiter mit vielen parallelen Projekten können nach freiem Text (Name oder Adresse) und nach Status filtern. Query-Parameter (`?search=...&status=...`) machen den Filter-Zustand teilbar und bookmarkbar.
- **Wo umgesetzt:**
  - Frontend: `<form method="GET">` in `src/routes/+page.svelte` mit `data-sveltekit-keepfocus`.
  - Backend: `listProjects({ search, status })` in `src/lib/server/projects.js` baut die MongoDB-Query dynamisch (case-insensitive Regex, Status-Match).
- **Referenz:** Sichtbar auf der Startseite über dem Card-Grid.

### 4.3 Statistik-Page mit Balken-Charts
- **Beschreibung & Nutzen:** Eigene Route `/stats` mit KPI-Kacheln (Total, Laufend, Offen, Abgeschlossen), Balken-Visualisierung der Status-Verteilung und Liste der zuletzt erstellten Projekte. Bietet Management-Übersicht ohne Drill-Down.
- **Wo umgesetzt:**
  - Aggregation: `projectStats()` in `src/lib/server/projects.js` (MongoDB `$group`-Aggregation).
  - Frontend: `src/routes/stats/+page.svelte` mit reinen CSS-Balken (kein Chart-Library nötig).
- **Referenz:** Linker Sidebar → "Statistiken".

### 4.4 Zentralisierte Validierung mit Fehler-Feedback
- **Beschreibung & Nutzen:** Alle Form-Inputs werden serverseitig in `src/lib/server/projects.js` validiert (Pflicht-Feld, Maxlängen, Status-Whitelist, Plausibilität von Start/Ende). Bei Fehlern bleibt der Formular-Inhalt erhalten und Inline-Fehlermeldungen erscheinen unter dem betroffenen Feld (*Help users recognize, diagnose, and recover from errors*, Nielsen #9).
- **Wo umgesetzt:**
  - Validierungs-Funktion: `validate(data)` in `src/lib/server/projects.js`.
  - Frontend: `{#if form?.errors?.name}<small class="err">…</small>{/if}` in beiden Formular-Pages.

### 4.5 Lieferungen pro Projekt (Sub-Entity CRUD mit Status-Workflow)
- **Beschreibung & Nutzen:** Pro Projekt können Material-Lieferungen (Beton, Stahl, Holz, Fertigteile etc.) erfasst, terminiert und durch einen 5-stufigen Status-Workflow gezogen werden: **bestellt → bestätigt → unterwegs → angekommen → verrechnet**. Damit wird das in der Ideenfindung beschriebene Kern-Problem ("kein durchgängiger Workflow Bestellung → Liefertermin → Lieferschein → Rechnung") direkt adressiert. Lieferungen mit Liefertermin in der Vergangenheit, die nicht als angekommen markiert sind, werden als *überfällig* rot hervorgehoben (Nielsen #1: *Visibility of system status*). Der Status kann direkt in der Tabelle per Dropdown gewechselt werden (kein Detail-Seiten-Roundtrip).
- **Wo umgesetzt:**
  - **Frontend:** `/projects/[id]/+page.svelte` (Lieferungs-Tabelle mit Inline-Status-Switcher), `/projects/[id]/deliveries/new/+page.svelte` (Neuanlage mit Material-Picker der die Einheit automatisch vorausfüllt), `/projects/[id]/deliveries/[did]/+page.svelte` (Edit/Delete via `formaction`-Buttons).
  - **Backend:** `src/lib/server/deliveries.js` mit `createDelivery`, `updateDelivery`, `setDeliveryStatus`, `deleteDelivery`, `listDeliveriesForProject`, `deliverySummaryForProject` (Anzahl/Überfällig-Count/CO₂-Total). Form Actions: `addDelivery`, `setDeliveryStatus`, `deleteDelivery` auf der Projekt-Detail-Seite.
  - **Datenbank:** Neue Collection `deliveries` (Felder: projectId, material, materialKey, quantity, unit, supplier, scheduledDate, status, notes, co2Kg, createdAt, updatedAt).
- **Referenz:** Sichtbar auf jeder Projekt-Detail-Seite unterhalb der KPI-Kacheln.

### 4.6 Wochenkalender mit Konflikt-Erkennung
- **Beschreibung & Nutzen:** Eigene Route `/calendar` zeigt eine **Montag-Sonntag-Wochenansicht aller Lieferungen über sämtliche Projekte hinweg** als Karten. Jede Karte ist farbcodiert nach Status (grau/orange/blau/grün/dunkelgrau) und verlinkt direkt zur Lieferungs-Edit-Page. Heute ist mit gelbem Rahmen markiert. **Konflikt-Erkennung:** Sobald auf derselben Baustelle am gleichen Tag mehr als 3 Lieferungen geplant sind, wird der Tag in orange-rot eingefärbt und ein expliziter Konflikt-Hinweis mit Projektname und Anzahl angezeigt — das ist genau die *baustellentaugliche Lieferübersicht* aus der Ideenfindungs-Leitfrage. Navigation per `←/→ Wochen`-Buttons mit Query-Parameter `?week=YYYY-MM-DD`.
- **Wo umgesetzt:**
  - **Frontend:** `src/routes/calendar/+page.svelte` (CSS-Grid mit 7 Spalten, ohne externe Chart-Library), Sidebar-Link.
  - **Backend:** `src/routes/calendar/+page.server.js` mit Zeitraum-Berechnung (Mo-So um Referenzdatum) und Konflikt-Aggregation pro (Tag, Projekt-ID). `listDeliveriesInRange(from, to)` in `src/lib/server/deliveries.js`.
- **Referenz:** Linker Sidebar → "Wochenkalender".

### 4.7 CO₂-Bilanz pro Lieferung, pro Projekt und global
- **Beschreibung & Nutzen:** Jede Lieferung trägt ihren CO₂-Footprint, berechnet aus Material × Menge × Emissionsfaktor. Faktoren basieren vereinfacht auf KBOB-Ökobilanzdaten (z.B. Beton C25/30 = 270 kg CO₂/m³, Bewehrungsstahl = 750 kg/t, BSH-Holz = 50 kg/m³). Pro Projekt-Detail-Seite gibt es eine KPI-Kachel mit der Projekt-Summe, auf `/stats` zusätzlich eine globale CO₂-Sektion mit Total, **Top-5-Material-Ranking** und einer **lebensweltlichen Vergleichszahl** (Auto-Kilometer und Schweizer-Haushalts-Jahre). Damit wird die in der Ausgangslage zitierte "11 % globaler CO₂-Ausstoss aus dem Bau" konkret messbar für den eigenen Workflow.
- **Wo umgesetzt:**
  - **Frontend:** KPI-Kachel `Projekt-Detail-Seite`, CO₂-Sektion in `src/routes/stats/+page.svelte` (Balken-Chart Top-5 + Kontextzahl-Box).
  - **Backend:** Material-Katalog in `src/lib/server/materials.js` mit `listMaterials`, `getMaterial`, `calculateCo2`. CO₂-Berechnung beim Insert/Update jeder Lieferung in `createDelivery`/`updateDelivery`, gespeichert als denormalisiertes Feld `co2Kg`. Aggregation `globalCo2Stats()` mit Top-5-Materialien-Ranking.
  - **Datenbank:** Neue Collection `materials` (10 Bau-Materialien als Stammdaten).
- **Referenz:** KPI-Kachel auf jeder Detail-Seite und Hauptbereich auf `/stats`.
- **Disclaimer:** Faktoren sind Grössenordnungs-Schätzungen aus öffentlich zugänglichen Quellen, nicht für offizielle Bilanzierung tauglich (vermerkt in der UI).

### 4.8 Notizen-Timeline pro Projekt (Append-only Audit-Log)
- **Beschreibung & Nutzen:** Pro Projekt eine chronologische Timeline kurzer Bauleiter-Notizen mit Zeitstempel und Autor (z.B. "Statiker hat freigegeben", "Wetter-Warnung Donnerstag — Betonage vorziehen"). Bewusst **append-only ohne Edit-Funktion** — historische Notizen bleiben nachvollziehbar, was im Baukontext für Streitfälle relevant ist (vergleichbar mit einem Bautagebuch). Löschen ist möglich, aber durch Confirm-Dialog geschützt.
- **Wo umgesetzt:**
  - **Frontend:** Timeline-Sektion in `/projects/[id]/+page.svelte` mit Inline-Add-Form (Auto-Reset nach Submit via `use:enhance`-Callback), visuell als vertikale Marker-Linie.
  - **Backend:** `src/lib/server/notes.js` mit `addNote`, `deleteNote`, `listNotesForProject`. Form Actions auf Projekt-Detail-Seite.
  - **Datenbank:** Neue Collection `notes` (projectId, text, author, createdAt).
- **Referenz:** Sichtbar auf jeder Projekt-Detail-Seite unter der Lieferungs-Tabelle.

### 4.9 Auth-System: Demo-Login / Registrierung / Logout (Iteration aus Evaluation)
- **Beschreibung & Nutzen:** Vollständiger Anmelde-Workflow mit Login, Registrierung (E-Mail + Benutzername-Eindeutigkeitsprüfung, serverseitige Validierung, Passwort min. 6 Zeichen), Logout und persistenter Session via httpOnly-Cookie (30 Tage Laufzeit, `sameSite=lax`, `secure=true` für HTTPS). Sidebar zeigt entweder den eingeloggten Benutzer mit Firmenname und persönlichem Initial-Avatar oder Gast-Modus mit Login-Link; Account-Seite zeigt die echten Profildaten statt eines statischen Mockups. Zwei Demo-Accounts (`demo@buildex.ch` / `demo123` und `marko@buildex.ch` / `marko2026`) sind per Seed-Script angelegt, damit Reviewer ohne Registrierung einsteigen können. Die Demo-Credentials sind im Login-Formular sichtbar dokumentiert.
- **Wo umgesetzt:**
  - **Frontend:** `src/routes/login/+page.svelte` (Login-Form mit Demo-Hinweis), `src/routes/register/+page.svelte` (Registrierungs-Form mit Live-Validierung), `src/routes/logout/+page.server.js` (Cookie-Reset), `src/lib/components/Sidebar.svelte` (Login/Logout-Toggle, dynamischer Benutzername), `src/routes/account/+page.svelte` (Profil-Ansicht mit echten User-Daten oder Gast-Hinweis).
  - **Backend:** `src/lib/server/users.js` mit `registerUser`, `loginUser`, `getUserById` (SHA-256 + Salt-Hashing per Node `crypto`). `src/lib/server/session.js` mit httpOnly-Cookie-Management. `src/hooks.server.js` als SvelteKit-Server-Hook, der bei jedem Request die Session-Cookie ausliest und den User an `event.locals.user` hängt. `src/routes/+layout.server.js` exponiert den User für alle Pages.
  - **Datenbank:** Neue Collection `users` (email, username, passwordHash, salt, company, role, createdAt — mit Eindeutigkeitsindex auf email und username via Anwendungs-Validierung).
- **Referenz:** Login-Page unter <https://bldx.netlify.app/login>, Demo-Credentials sind dort sichtbar.
- **Aus Evaluation abgeleitet?:** **Ja — direkte Antwort auf Issue 3.5.1** aus der Usability-Evaluation am 20.05.2026. Beide Tester forderten explizit einen Anmeldeprozess, dieser war das einzige Issue mit Severity 3 (Gross).
- **Bewusste Trade-offs / Disclaimer für die produktive Nutzung:**
  - **SHA-256 + Salt ist Demo-Grade-Hashing.** Für ein echtes Produkt müsste `bcrypt` oder `argon2id` verwendet werden — beide bieten adaptive Cost-Faktoren gegen Brute-Force. Im Prototyp-Kontext bewusst vereinfacht, um keine native Build-Dependency einzuführen.
  - **Session-Cookie speichert die User-ID direkt** (statt einer signierten Session-ID, die serverseitig nachgeschlagen wird). Für echte Sessions wäre ein signierter Token oder ein Server-side Session-Store (Redis/MongoDB) richtiger.
  - **Kein Hard-Block für nicht-eingeloggte Nutzer.** Die App funktioniert auch im Gast-Modus weiter (alle Lese- und Schreib-Operationen). Das ist Absicht für die Bewertung — Dozenten können direkt mit den Daten interagieren ohne sich erst registrieren zu müssen.
  - **Keine E-Mail-Verifikation, kein Passwort-Reset.** Für die nächste Iteration auf dem Backlog.

## 5. Projektorganisation

- **Repository & Struktur:** <https://github.com/Marko-Vukcevic/buildex> – Single-Branch-Modell (`main`), Trunk-Based Development. Code-Struktur siehe Kapitel 3.4.2.
- **Issue-Management:** Für ein Einzel-Projekt im Lehrkontext bewusst leichtgewichtig: Erweiterungen werden als To-do-Liste im README geführt, kritische Bugs als GitHub Issues.
- **Commit-Praxis:** Sprechende Commits in englischer Sprache, kurze Subject-Zeile + ausführliche Body bei grösseren Änderungen. Beispiele:
  - `Initial SvelteKit setup`
  - `Add MongoDB integration and project CRUD workflow`
  - `Add sidebar layout, project detail page (CRUD), filters, stats page`
- **Secrets-Management:** `.env`-Datei mit `MONGODB_URI` ist in `.gitignore`; auf Netlify als Environment Variable hinterlegt.

## 6. KI-Deklaration

### 6.1 KI-Tools

- **Eingesetzte Tools:** Claude (Anthropic, Modell-Familie Sonnet/Opus 4.x, Stand Mai 2026) via Cowork-Mode im Claude-Desktop-Client.
- **Zweck & Umfang:**
  - **Code:** Sehr breit eingesetzt – Claude hat das Initial-Scaffolding der SvelteKit-Routen, die MongoDB-Connection-Layer, die Validierungs-Funktion, Filter/Search-Logik und die Statistik-Aggregation überwiegend geschrieben. Ich habe jeden Vorschlag gelesen, lokal getestet (`npm run dev`) und angepasst.
  - **UI/Styles:** Layout-Komponenten (Sidebar, ProjectCard, Globale Tokens in `app.css`) sind auf Basis meines Figma-Mockups von Claude codiert worden – Farbschema, Spacings, Typo wurden von mir aus dem Mockup vorgegeben.
  - **Doku:** Diese README-Datei wurde von Claude entworfen und von mir inhaltlich geprüft, ergänzt und korrigiert. Fachinhalte (Bau-Branchenwissen, Persona-Beschreibungen, Erkenntnisse aus der Recherche) stammen aus meiner Ideenfindungs-Abgabe und meiner Berufserfahrung als Bauführer.
  - **Tooling-Setup:** Claude hat mich Schritt für Schritt durch Node-Installation, `npx sv create`, Git-Setup, GitHub-Token-Konfiguration, MongoDB-Atlas-Setup (Database, User, Network) und Netlify-Deploy begleitet.
- **Eigene Leistung (Abgrenzung):**
  - **Konzeption & Idee:** Problemraum BUILDEX (Materialbeschaffung Bau), Persona-Wahl, HMW-Leitfrage, Scope-Reduktion auf Projekt-CRUD – stammen aus meinem Startup-Konzept und der Ideenfindungs-Phase, nicht aus KI.
  - **Mockup:** Figma-Mockup wurde von mir manuell gezeichnet; Claude hat nur beim Verbinden der Frames (Prototype-Interaktionen) geholfen.
  - **Verständnis & Verantwortung:** Ich habe jeden Code-Block gelesen, lokal getestet, debuggt (z.B. das `MONGODB_URI`-Prefix-Problem) und übernehme die Verantwortung für das Gesamtresultat.
  - **Entscheidungen:** Wahl des Tech-Stacks im Rahmen der Modul-Vorgaben (SvelteKit, MongoDB, Netlify), Scope-Cuts und die Roadmap-Priorisierung sind meine.

### 6.2 Prompt-Vorgehen

Ich habe Claude **iterativ und gezielt** eingesetzt, nicht als Blackbox-Code-Generator:

1. **Kontext-Setting zuerst:** Vor jeder grösseren Code-Welle habe ich Claude den aktuellen Stand (Mockup-Screenshots, vorhandene Dateien, Branchen-Kontext) gegeben.
2. **Iterativ verfeinern:** Erste Version → manuell testen → Bug oder Verbesserung benennen → Claude reagiert → erneut testen.
3. **Konkrete Akzeptanz-Kriterien:** Statt „mach mir ein Dashboard" → „Dashboard mit Card-Grid, Status-Filter und Suche, persistente Sidebar links wie im Figma-Mockup".
4. **Beispiele statt Mini-Prompts:** Beispiel-Prompt aus der Setup-Phase:
   > *„Mach mir ein Mongo-Connection-Modul für SvelteKit. Server-only, Singleton-Connection, `MONGODB_URI` aus `$env/static/private`. Export `getDb()` und `getProjectsCollection()`. Schmeiss bei fehlender URI einen aussagekräftigen Fehler."*
5. **Verifizieren statt Vertrauen:** Code-Vorschläge wurden im Dev-Server `npm run dev` ausprobiert; bei MongoDB direkt in der Atlas-Web-UI verifiziert ob Dokumente korrekt geschrieben wurden.

### 6.3 Reflexion

- **Nutzen:** Claude hat die Setup-Phase (SvelteKit + Git + MongoDB + Netlify) von potenziell mehreren Tagen auf wenige Stunden komprimiert und mir komplexere Patterns (Server-Actions, Aggregation-Pipelines, Form-Validierung mit `fail()`) gezeigt, an die ich von selbst kaum direkt herangekommen wäre.
- **Grenzen:** Bei UX-Entscheidungen (gelb statt blau, Sidebar statt Topbar, welche Filter sinnvoll sind) habe ich die Vorschläge **kritisch geprüft** – KI tendiert dazu, alles „normal" und „sauber" zu machen, aber die Branchen-Identität (gelb = Bau) ist eine bewusste Differenzierung gegen Capmo/PlanRadar/Procore und die wäre ohne mein Veto verloren gegangen.
- **Risiken / Qualitätssicherung:**
  - **Veraltete Patterns:** Claude hat anfangs Svelte-4-Syntax statt Svelte-5-Runes (`$state`, `$derived`, `$props`) vorgeschlagen; ich habe darauf bestanden, die aktuelle Syntax durchgehend zu verwenden.
  - **Fehlende Tests:** Im aktuellen Stand gibt es keine automatisierten Tests. Bei Erweiterung des Scopes (Phase 2 mit Order-Workflow) ist mindestens eine Smoke-Test-Suite mit Playwright sinnvoll.
  - **Secrets-Awareness:** Das `.env`-File ist von Anfang an in `.gitignore` aufgeführt. Mein MongoDB-Passwort wurde während des Setups nicht in Klartext im Repo committet.

## 7. Anhang

- **Quellen / Vorlagen:**
  - Ideenfindungs-Abgabe (Woche 8): Detaillierter Problemraum, Persona-Tabelle, HMW-Fragen, Recherche – als PDF im Repo (`/docs/Ideenfindung_BUILDEX.pdf`, falls eingecheckt).
  - Mockup-Abgabe (Woche 10): Figma-Prototype + Designentscheide + Workflow-Diagramm.
  - Modul-Aufgabenstellung: *PT Projekt – Anforderungen und Bewertung* (Moodle).
  - VORLAGE_README.md (Moodle) – Struktur dieses Dokuments.
- **Branchenkontext:** Baubranche verursacht ca. 11 % des globalen CO₂-Ausstosses (Quelle: Global Status Report for Buildings and Construction, UN Environment Programme).
- **Wettbewerber-Recherche (Auszug):** PlanRadar.com, Capmo.com, Procore.com, Comstruct.de, Nevaris, Bauhub, Sablono – Details in der Ideenfindungs-Abgabe.
- **Testskript & Materialien:** Aufgaben-Szenarien siehe Kap. 3.5; Detail-Testskript wird vor der Evaluation als `/docs/usability-test-script.md` ergänzt.
- **Rohdaten / Auswertung:** *Wird nach Durchführung der Evaluation hinzugefügt (`/docs/usability-test-results.md`).*
