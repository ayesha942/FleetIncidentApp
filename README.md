# FleetIQ — Incident Intelligence Dashboard

AI-powered fleet incident triage. Submit a driver report, get instant severity scoring, root cause analysis, and recommended actions. Spot repeat offenders and risky vehicles before they become expensive.

---

## The Problem
Fleet managers read every incident report manually — deciding severity, cause, and next steps from raw driver text. At scale this is slow, inconsistent, and misses patterns (same driver, same vehicle, same issue repeating week after week).

## The Fix
- **AI Triage**: Paste any driver report → get severity score, root cause, and action steps in seconds
- **Pattern Engine**: Charts that surface which drivers and vehicles keep showing up in reports
- **Incident Feed**: All incidents ranked by severity so the critical ones are never buried

---

## Setup (2 minutes)

### 1. Install dependencies
```bash
npm install
```

### 2. Run the app
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 3. Add your Anthropic API key
- Go to **Report Incident** in the app
- Paste your API key (get one at [console.anthropic.com](https://console.anthropic.com))
- It saves in your browser — you only need to do this once

---

## Features

| Screen | What it does |
|---|---|
| **Dashboard** | Live incident feed, severity badges, filter by severity |
| **Incident Detail** | Full AI analysis: summary, root cause, recommended action, tags |
| **Report Incident** | Submit new incident → real Claude AI triages it live |
| **Patterns** | Bar charts and pie charts of incidents by driver, vehicle, type + repeat-offender alerts |

---

