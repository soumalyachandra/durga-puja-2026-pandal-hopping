"""FastAPI application for the Durga Puja 2026 Pandal Hopping API.

Runs three ways from this single codebase:
  * Local dev:   uvicorn app.main:app --reload
  * Container:   see backend/Dockerfile (uvicorn)
  * AWS Lambda:  app.handler:handler (Mangum adapter)
"""

from __future__ import annotations

import os

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from app import routing
from app.models import (
    HealthResponse,
    MetroLineListResponse,
    Pandal,
    PandalListResponse,
    SuggestedRoute,
)
from app.seed_data import FESTIVAL, METRO_LINES, PANDALS

app = FastAPI(
    title="Durga Puja 2026 — Pandal Hopping API",
    description="Pandals of Kolkata & Howrah paired with their nearest Metro stations, "
    "plus metro-line-based route suggestions.",
    version="1.0.0",
)

# CORS — the frontend is served from a different origin (Vite dev server, nginx
# container, or S3/CloudFront). Allow origins from an env var (comma separated),
# defaulting to "*" for easy local/homelab use. Lock this down in production.
_origins = os.getenv("ALLOWED_ORIGINS", "*")
allow_origins = ["*"] if _origins.strip() == "*" else [o.strip() for o in _origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)

_PANDAL_BY_ID = {p["id"]: p for p in PANDALS}


@app.get("/", include_in_schema=False)
def root() -> dict:
    return {
        "service": "durga-puja-2026-pandal-hopping-api",
        "docs": "/docs",
        "endpoints": [
            "/api/health",
            "/api/pandals",
            "/api/pandals/{id}",
            "/api/metro-lines",
            "/api/routes",
            "/api/routes/{line}",
        ],
    }


@app.get("/api/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(
        status="ok",
        service="durga-puja-2026-pandal-hopping-api",
        festival=FESTIVAL,
        pandal_count=len(PANDALS),
    )


@app.get("/api/pandals", response_model=PandalListResponse)
def list_pandals(
    zone: str | None = Query(default=None, description="e.g. 'North Kolkata', 'Howrah'"),
    line: str | None = Query(default=None, description="Metro line id or name, e.g. 'blue'"),
    city: str | None = Query(default=None, description="'Kolkata' or 'Howrah'"),
    q: str | None = Query(default=None, description="Free-text search"),
) -> PandalListResponse:
    results = list(PANDALS)

    if zone:
        results = [p for p in results if p["zone"].lower() == zone.lower()]

    if city:
        results = [p for p in results if p["city"].lower() == city.lower()]

    if line:
        target = line.strip().lower().replace(" line", "")
        results = [
            p
            for p in results
            if p["nearest_metro"]["line"].lower() == target
            or any(a["line"].lower() == target for a in p.get("alt_metro", []))
        ]

    if q:
        needle = q.strip().lower()
        results = [
            p
            for p in results
            if needle in p["name"].lower()
            or needle in p["famous_for"].lower()
            or needle in p["theme"].lower()
            or needle in p["address"].lower()
            or needle in p["nearest_metro"]["station"].lower()
        ]

    return PandalListResponse(
        count=len(results),
        filters={"zone": zone, "line": line, "city": city, "q": q},
        pandals=[Pandal(**p) for p in results],
    )


@app.get("/api/pandals/{pandal_id}", response_model=Pandal)
def get_pandal(pandal_id: str) -> Pandal:
    pandal = _PANDAL_BY_ID.get(pandal_id)
    if pandal is None:
        raise HTTPException(status_code=404, detail=f"No pandal with id '{pandal_id}'")
    return Pandal(**pandal)


@app.get("/api/metro-lines", response_model=MetroLineListResponse)
def list_metro_lines() -> MetroLineListResponse:
    return MetroLineListResponse(count=len(METRO_LINES), lines=METRO_LINES)


@app.get("/api/routes", response_model=list[SuggestedRoute])
def list_routes() -> list[SuggestedRoute]:
    return [SuggestedRoute(**r) for r in routing.all_routes()]


@app.get("/api/routes/{line}", response_model=SuggestedRoute)
def get_route(line: str) -> SuggestedRoute:
    route = routing.suggest_route(line)
    if route is None:
        raise HTTPException(status_code=404, detail=f"Unknown metro line '{line}'")
    return SuggestedRoute(**route)
