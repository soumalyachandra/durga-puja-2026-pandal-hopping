# 🪔 Durga Puja 2026 · Pandal Hopping — Kolkata & Howrah

A festive, interactive web app for navigating the greatest show on earth: Durga
Puja. Browse the major pandals of **Kolkata & Howrah**, each paired with its
**nearest Metro station**, get **live distance / ETA / routing** from your
location via Google Maps, and auto-plan a **metro-line pandal crawl**.

> **Festival dates:** Maha Shashthi → Bijoya Dashami, **16–21 October 2026**.

The whole thing is wrapped in a crimson-and-gold, kash-phool-and-dhak theme that
tries to do justice to the joy of pujo. 🧡

---

## ✨ Features

- **Pandal directory + metro mapping.** Searchable, filterable cards for every
  pandal, each explicitly paired with its nearest station across the **Blue,
  Green, Orange and Purple** lines (plus alternates where relevant).
- **Google Maps integration.** Live map with pandal markers, your location,
  turn-by-turn routing, and real-time **distance + ETA** for driving / transit /
  walking.
- **Metro-line route planner.** Pick a line → get a logical, station-ordered
  sequence of pandals to visit (e.g. the Blue Line crawl through Kalighat for
  Suruchi Sangha, Chetla Agrani, Ekdalia…).
- **Festive, culturally-rooted UI.** Maa Durga *chokkhu*, *dhak*, *shiuli* and
  *kash phool* motifs rendered as inline SVG; crimson (alta/sindoor), golden
  yellow, and pristine white palette.
- **Graceful degradation.** Works with no Google key (minus the live map) and
  even with no backend running (bundled sample data).

---

## 🧱 Architecture

```
            ┌──────────────────────────┐         ┌─────────────────────────────┐
Browser ──► │  Frontend (React + Vite)  │ ──/api─►│  Backend (FastAPI, Python)  │
            │  festive UI, Google Maps  │         │  pandal data + route logic  │
            └──────────────────────────┘         └─────────────────────────────┘
                        │                                      │
                        │                         ┌────────────┴─────────────┐
                        │                         │  Deploy A: AWS Lambda +   │
                        └── Google Maps JS API    │  API Gateway (Terraform)  │
                           (browser-side)         │  Deploy B: Docker (nginx  │
                                                  │  + uvicorn) on a homelab  │
                                                  └───────────────────────────┘
```

**Stack choices (and why):**

- **Frontend — React + Vite.** Fast dev server, tiny config, static build that
  deploys anywhere (nginx container, S3/CloudFront, any static host).
- **Backend — Python + FastAPI, served by Mangum on Lambda.** One app, two
  runtimes: `uvicorn` locally / in Docker, and the *same* app behind API Gateway
  on AWS via the Mangum ASGI adapter — no code forks.
- **Single source of truth for data.** Seed data lives in
  `backend/app/seed_data.py`; the frontend ships an identical fallback copy so it
  stays usable offline.

---

## 📁 Repository layout

```
durga-puja-2026-pandal-hopping/
├── demo.html                     # ⭐ Zero-setup: open in a browser to preview the UI
├── docker-compose.yml            # Method 2: full stack in containers
├── .env.example                  # Optional Google Maps key for compose
│
├── backend/                      # FastAPI service
│   ├── app/
│   │   ├── main.py               # API routes
│   │   ├── handler.py            # AWS Lambda entry (Mangum)
│   │   ├── seed_data.py          # ⭐ Pandals + metro lines (source of truth)
│   │   ├── routing.py            # Metro-line route-suggestion logic
│   │   └── models.py             # Pydantic response models
│   ├── tests/test_api.py         # pytest suite
│   ├── requirements*.txt
│   └── Dockerfile
│
├── frontend/                     # React + Vite app
│   ├── src/
│   │   ├── App.jsx               # Orchestration + state
│   │   ├── components/           # Header, Hero, Controls, PandalGrid,
│   │   │                         #   MapPanel, RoutePlanner, PandalDetail,
│   │   │                         #   Motifs (SVGs), Icons, Footer
│   │   ├── hooks/useGoogleMaps.js
│   │   ├── lib/                  # routes.js, metro.js
│   │   ├── data/fallbackData.js  # Offline mirror of the API
│   │   ├── styles/               # theme.css (tokens), app.css (components)
│   │   ├── api.js  config.js
│   │   └── main.jsx
│   ├── Dockerfile  nginx.conf
│   └── .env.example
│
└── infra/terraform/              # Method 1: AWS serverless (see its own README)
    ├── main.tf  variables.tf  outputs.tf  versions.tf
    └── build_lambda.sh / .ps1
```

---

## 🚀 Quick taste (no install)

Just **open `demo.html`** in any browser. It's a self-contained, offline build
of the UI (directory, search, filters, metro route planner, festive theme) with
sample data baked in — perfect for a first look. The live Google Map is the only
thing it doesn't include (that needs the real app + an API key).

---

## 🖥️ Run it locally (dev)

**Prerequisites:** Python 3.11+ and Node.js 18+.

### 1. Backend (FastAPI)

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Check it: open <http://localhost:8000/api/health> — you should see festival info
and a pandal count. Interactive API docs are at <http://localhost:8000/docs>.

Run the tests (optional):

```bash
pip install -r requirements-dev.txt
pytest
```

### 2. Frontend (React)

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env        # Windows: copy .env.example .env
npm run dev
```

Open <http://localhost:5173>. The frontend defaults to the backend at
`http://localhost:8000`. To enable the live map, add your Google key to
`frontend/.env` (see [Google Maps setup](#-google-maps-api-key-setup)) and
restart `npm run dev`.

---

## 🗺️ Google Maps API key setup

The live map, routing and ETA use the **Google Maps JavaScript API** +
**Directions API**. The rest of the app works without a key.

1. Go to the [Google Cloud Console](https://console.cloud.google.com/) → create
   or pick a project.
2. **APIs & Services → Enable APIs** → enable:
   - *Maps JavaScript API*
   - *Directions API*
3. Make sure **billing** is enabled on the project (Google requires it even
   within the generous free monthly credit).
4. **APIs & Services → Credentials → Create credentials → API key.**
5. **Restrict the key** (strongly recommended):
   - *Application restrictions* → **HTTP referrers**, add the sites that will use
     it, e.g. `http://localhost:5173/*`, `http://localhost:8080/*`, and your real
     domain `https://pujo.example.com/*`.
   - *API restrictions* → restrict to *Maps JavaScript API* and *Directions API*.
6. Put the key where the frontend can read it:
   - **Local dev / AWS frontend build:** `frontend/.env` →
     `VITE_GOOGLE_MAPS_API_KEY=your_key_here`
   - **Docker compose:** root `.env` → `VITE_GOOGLE_MAPS_API_KEY=your_key_here`

> ⚠️ A Maps **JavaScript** key is used in the browser and is therefore public by
> design — the HTTP-referrer + API restrictions above are what keep it safe.
> Never put a *server* secret in a `VITE_` variable; anything `VITE_` is bundled
> into the public JS.

---

## ☁️ Method 1 — Deploy to AWS (serverless, production-ready)

Backend runs as **AWS Lambda** behind **HTTP API Gateway**, provisioned with
**Terraform**. Full details and all variables are in
[`infra/terraform/README.md`](infra/terraform/README.md). The short version:

```bash
cd infra/terraform

# 1. Build the Lambda package (installs Linux wheels + copies app code).
#    Windows PowerShell:  ./build_lambda.ps1
./build_lambda.sh

# 2. Provision.
terraform init
terraform apply          # review, then type "yes"
```

Terraform outputs an `api_base_url`. Verify:

```bash
curl "$(terraform output -raw health_check_url)"
```

Then build & host the **frontend** pointing at that URL:

```bash
cd ../../frontend
# Put the API URL + your Maps key in .env:
#   VITE_API_BASE_URL=https://xxxx.execute-api.ap-south-1.amazonaws.com
#   VITE_GOOGLE_MAPS_API_KEY=your_key_here
npm install
npm run build        # outputs static files to frontend/dist/
```

Upload `frontend/dist/` to any static host (S3 + CloudFront, Netlify, Vercel,
Cloudflare Pages, or even the nginx container from Method 2). Remember to add
that host's URL to your Google key's HTTP-referrer allow-list.

**What Terraform creates:** the Lambda function, an HTTP API Gateway with a
catch-all proxy route + CORS, a least-privilege IAM role (CloudWatch Logs only),
and a log group. It's pay-per-request and sits comfortably in the AWS Free Tier
for personal traffic. Tear down anytime with `terraform destroy`.

---

## 🏠 Method 2 — Self-host on a homelab (Docker, free)

Runs the whole stack in two containers: **nginx** (serves the built React app +
reverse-proxies `/api`) and **uvicorn** (the FastAPI backend). Because nginx
proxies the API, the browser only ever talks to one origin — no CORS config and
nothing host-specific baked into the build. Great for a home server.

**Prerequisite:** Docker + Docker Compose.

```bash
# (optional) add your Google Maps key:
cp .env.example .env          # then edit VITE_GOOGLE_MAPS_API_KEY

docker compose up --build -d
```

Open **<http://localhost:8080>**, or from any other device on your network,
`http://<your-server-lan-ip>:8080` (e.g. `http://192.168.1.50:8080`). Find the
server's LAN IP with `ip addr` (Linux) or `ipconfig` (Windows).

Useful commands:

```bash
docker compose logs -f        # tail logs
docker compose down           # stop
docker compose up --build -d  # rebuild after changes
```

> If you added the Maps key after the first build, rebuild — the key is inlined
> at build time: `docker compose up --build -d`.

### Expose it to the internet for free with a Cloudflare Tunnel

A Cloudflare Tunnel gives you a public HTTPS URL **without opening any ports** on
your router — ideal and free for a homelab.

1. Add a (free) domain to Cloudflare, or use a `*.cfargotunnel.com` quick tunnel.
2. Install `cloudflared` on the server and authenticate:
   ```bash
   cloudflared tunnel login
   cloudflared tunnel create pujo
   ```
3. Point the tunnel at the frontend container's port (8080). Create
   `~/.cloudflared/config.yml`:
   ```yaml
   tunnel: pujo
   credentials-file: /root/.cloudflared/<tunnel-id>.json
   ingress:
     - hostname: pujo.example.com
       service: http://localhost:8080
     - service: http_status:404
   ```
4. Route DNS and run it:
   ```bash
   cloudflared tunnel route dns pujo pujo.example.com
   cloudflared tunnel run pujo
   # (or install it as a service: cloudflared service install)
   ```
5. **Important for the map:** add `https://pujo.example.com/*` to your Google
   Maps key's HTTP-referrer allow-list, then rebuild the frontend so the key is
   present:
   `docker compose up --build -d`.

For a zero-config throwaway URL (no domain needed), you can also just run:
`cloudflared tunnel --url http://localhost:8080`.

---

## 🔌 API reference

Base URL is your backend origin (`http://localhost:8000`, the Terraform
`api_base_url`, or `/api` behind the Docker nginx proxy).

| Method | Path                     | Description                                             |
| ------ | ------------------------ | ------------------------------------------------------- |
| GET    | `/api/health`            | Service status, festival dates, pandal count            |
| GET    | `/api/pandals`           | All pandals; filters: `?zone=`, `?line=`, `?city=`, `?q=` |
| GET    | `/api/pandals/{id}`      | A single pandal by id                                   |
| GET    | `/api/metro-lines`       | All metro lines with ordered station lists              |
| GET    | `/api/routes`            | Suggested crawl for every line                          |
| GET    | `/api/routes/{line}`     | Suggested crawl for one line (`blue`/`green`/…)         |

---

## 📊 Seed data (included)

Ships with 14 major pandals across the four zones, including every one requested:

- **North Kolkata** — Bagbazar Sarbojanin *(Shyambazar)*, Kumartuli Park
  *(Shobhabazar)*, College Square *(MG Road)*, Mohammad Ali Park *(Central)*.
- **South Kolkata** — Suruchi Sangha *(Kalighat)*, Chetla Agrani *(Kalighat)*,
  Ekdalia Evergreen *(Kalighat / Gariahat)*, Tridhara Sammilani, Mudiali Club.
- **Salt Lake & East** — Sreebhumi Sporting Club *(Belgachia / Salt Lake)*,
  FD Block, Santosh Mitra Square.
- **Howrah** — Shibpur Mandirtala *(Howrah Maidan)*, Santragachi Railway Colony.

Add or edit pandals in **`backend/app/seed_data.py`** (and mirror into
`frontend/src/data/fallbackData.js` if you want the offline copy to match).

---

## ⚠️ Data accuracy — please read

This is a **demo/guide**, not an authoritative navigation source:

- **Coordinates are approximate**, hand-placed to the right neighbourhood for the
  map and routing demo. Verify before relying on them to navigate.
- **Metro pairings are best-effort.** Kolkata Metro is expanding fast; the
  **Orange and Purple lines are only partially operational**, so some pairings
  note an upcoming/alternate station.
- **2026 themes are "to be announced"** — individual pujas reveal themes nearer
  the festival. The `famous_for` text reflects each club's genuine reputation.
- **Festival dates** follow the published 2026 calendar and may shift by a day
  depending on the panjika. Re-confirm nearer the time.

PRs with corrections are very welcome. Travel safe, and **Shubho Sharodiya!** 🌼

---

## 📄 License

MIT — see [LICENSE](LICENSE).
