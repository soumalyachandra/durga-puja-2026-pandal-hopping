"""Pydantic models describing the API response shapes.

These models are the contract the frontend relies on. Keep field names in
snake_case here; the frontend consumes them as-is.
"""

from __future__ import annotations

from pydantic import BaseModel


class MetroRef(BaseModel):
    station: str
    line: str
    walk_minutes: int


class LatLng(BaseModel):
    lat: float
    lng: float


class Pandal(BaseModel):
    id: str
    name: str
    zone: str
    city: str
    nearest_metro: MetroRef
    alt_metro: list[MetroRef] = []
    location: LatLng
    theme: str
    established: int | None = None
    famous_for: str
    crowd_level: str
    best_time_to_visit: str
    address: str


class MetroLine(BaseModel):
    id: str
    name: str
    line_number: str
    color: str
    route: str
    status: str
    stations: list[str]


class RouteStop(BaseModel):
    order: int
    pandal: Pandal
    station: str
    walk_minutes: int


class SuggestedRoute(BaseModel):
    line_id: str
    line_name: str
    line_color: str
    stop_count: int
    stops: list[RouteStop]
    notes: str


class PandalListResponse(BaseModel):
    count: int
    filters: dict[str, str | None]
    pandals: list[Pandal]


class MetroLineListResponse(BaseModel):
    count: int
    lines: list[MetroLine]


class HealthResponse(BaseModel):
    status: str
    service: str
    festival: dict
    pandal_count: int
