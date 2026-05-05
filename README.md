# Supreme Scapes — Ops Dashboard

A lightweight, single-URL ops dashboard for Supreme Scapes. No frameworks, no build step, no dependencies. Pure HTML/CSS/JS — works instantly on GitHub Pages.

---

## 🚀 Setup (5 minutes)

### Step 1 — Create a GitHub repo
1. Go to [github.com](https://github.com) → click **New repository**
2. Name it: `supreme-scapes-dashboard`
3. Set to **Private** (recommended — this has business data)
4. Click **Create repository**

### Step 2 — Upload the files
Option A — Drag and drop in the browser:
1. Open your new repo
2. Click **uploading an existing file**
3. Drag the entire `supreme-scapes-dashboard` folder contents in
4. Keep the folder structure exactly as-is:
   ```
   index.html
   css/style.css
   js/app.js
   js/data.js
   js/kpi.js
   js/photos.js
   js/pipeline.js
   README.md
   ```
5. Click **Commit changes**

Option B — GitHub Desktop or CLI if you prefer.

### Step 3 — Enable GitHub Pages
1. Go to your repo → **Settings** → **Pages** (left sidebar)
2. Under **Source**, select **Deploy from a branch**
3. Branch: `main` · Folder: `/ (root)`
4. Click **Save**
5. Wait ~60 seconds, then your dashboard is live at:
   `https://YOUR-GITHUB-USERNAME.github.io/supreme-scapes-dashboard/`

---

## ✏️ Updating Numbers

**All numbers live in one place: `js/data.js`**

Open that file and edit the values directly. No coding knowledge needed — just change the numbers. Save and commit to GitHub — the dashboard updates automatically.

Key things to update regularly:
- `revenue.actual` — update monthly with YTD revenue from QBO
- `ap.current` — update monthly with AP % of COGS from Dawn
- `leads.*` — update weekly based on HL pipeline
- `projects` — add new jobs, check off photos as they're captured
- `pipeline` — add/remove leads as they move through stages

---

## ➕ Adding New Widgets

Bring the file structure back to Claude and ask to add a new page/widget. Claude will add a new JS file and hook it into the nav. Takes about 5 minutes.

---

## 👥 Sharing Access

Since it's a private GitHub Pages site, you have two options:

**Option A (simplest):** Make the repo public — the URL is obscure enough that it won't be found unless shared directly.

**Option B (more control):** Keep it private and share the URL only with Luci, Victoria, and Jamie. GitHub Pages on private repos requires GitHub Pro (~$4/mo) — or just use Option A.

---

## 📁 File Map

| File | What it does |
|------|-------------|
| `index.html` | Shell layout — sidebar + page containers |
| `css/style.css` | All visual styling |
| `js/data.js` | **Edit this** — all your business numbers |
| `js/kpi.js` | KPI Overview page |
| `js/photos.js` | Photo & Video Tracker page |
| `js/pipeline.js` | Lead Pipeline page |
| `js/app.js` | Navigation and page routing |
