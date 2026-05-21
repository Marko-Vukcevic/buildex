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
  - **Kein Auth** – einzelner Demo-User, das Ziel ist der CRUD-Workflow, nicht Auth-Logik (klar im Mockup begründet).
  - **Adapter-Auto statt expliziter Netlify-Adapter** – funktioniert out-of-the-box, minimiert Konfigurations-Aufwand.

### 3.5 Validate

- **URL der getesteten Version:** Identisch mit der Live-Deploy-URL (s.o.). Eine separate Test-Deployment-Branch ist nicht vorgesehen, da der Code-Umfang im Modul-Rahmen klein ist.
- **Ziele der Prüfung:**
  1. Können neue Bauleiter ohne Anleitung ein Projekt erfassen?
  2. Finden sie zielsicher die Detail-Seite, um Daten zu korrigieren?
  3. Ist die Status-Pipeline (Filter) für ihr mentales Modell verständlich?
  4. Wirken Sidebar und Stats-Page **konsistent** mit dem Figma-Mockup?
- **Vorgehen:** Geplant ist eine moderierte Remote-Usability-Evaluation (Think-Aloud) mit ca. fünf Personen aus dem Bauumfeld (Bauführer, Bauleiter, Planer). Jede Session dauert 20 Minuten und besteht aus drei aufgaben-basierten Szenarien und einer kurzen Abschluss-Befragung.
- **Stichprobe:** Geplant n=5, gemischtes Profil (Erfahrungs-Bauleiter und neue Projektassistenten), schweizerischer Bau-Kontext.
- **Aufgaben/Szenarien (Test-Skript-Auszug):**
  1. *„Du bist neu in der App. Lege ein Projekt 'Wohnüberbauung Steinegg' mit der Adresse 'Badenerstrasse 26, Schlieren' an, Status laufend, geplante Dauer Januar 2026 bis Dezember 2026."*
  2. *„Finde das eben angelegte Projekt und ergänze in den Notizen: 'Statiker = Müller AG'. Speichere die Änderung."*
  3. *„Setze den Status des Projekts auf pausiert. Wo prüfst du, dass die Statistik den neuen Status zählt?"*
- **Kennzahlen & Beobachtungen:** *Wird nach Durchführung ergänzt — Vorlage: Erfolgsquote pro Aufgabe, Zeitbedarf, Anzahl Hilfestellungen, qualitative Findings (Sprache, Affordances, fehlende Elemente).*
- **Zusammenfassung der Resultate:** *Wird nach Durchführung ergänzt.*
- **Abgeleitete Verbesserungen:** *Wird nach Durchführung ergänzt. Kandidaten sind: zusätzliches Feld „Bauherr"; Drag-and-Drop für Status-Wechsel; Inline-Edit in der Card statt Detail-Seite.*

## 4. Erweiterungen

> Über den Mindestumfang hinaus wurden vier sinnvolle Erweiterungen umgesetzt. Jede ist klar vom Pflicht-CRUD abgrenzbar.

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
