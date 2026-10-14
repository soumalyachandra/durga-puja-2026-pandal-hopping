"""API tests. Run from the backend/ directory with: pytest"""

from __future__ import annotations

from fastapi.testclient import TestClient

from app.main import app
from app.seed_data import METRO_LINES, PANDALS

client = TestClient(app)


def test_health() -> None:
    r = client.get("/api/health")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "ok"
    assert body["pandal_count"] == len(PANDALS)
    assert body["festival"]["start_date"] == "2026-10-16"
    assert body["festival"]["end_date"] == "2026-10-21"


def test_list_all_pandals() -> None:
    r = client.get("/api/pandals")
    assert r.status_code == 200
    body = r.json()
    assert body["count"] == len(PANDALS)
    # Every required seed pandal is present.
    ids = {p["id"] for p in body["pandals"]}
    required = {
        "bagbazar-sarbojanin", "kumartuli-park", "college-square",
        "suruchi-sangha", "chetla-agrani", "ekdalia-evergreen",
        "sreebhumi-sporting", "fd-block-saltlake",
        "shibpur-mandirtala", "santragachi-railway-colony",
    }
    assert required.issubset(ids)


def test_filter_by_zone_howrah() -> None:
    r = client.get("/api/pandals", params={"zone": "Howrah"})
    assert r.status_code == 200
    ids = {p["id"] for p in r.json()["pandals"]}
    assert ids == {"shibpur-mandirtala", "santragachi-railway-colony"}


def test_filter_by_line_blue() -> None:
    r = client.get("/api/pandals", params={"line": "blue"})
    assert r.status_code == 200
    pandals = r.json()["pandals"]
    assert len(pandals) >= 5
    for p in pandals:
        on_blue = p["nearest_metro"]["line"].lower() == "blue" or any(
            a["line"].lower() == "blue" for a in p["alt_metro"]
        )
        assert on_blue, p["id"]


def test_search_query() -> None:
    r = client.get("/api/pandals", params={"q": "sreebhumi"})
    assert r.status_code == 200
    ids = [p["id"] for p in r.json()["pandals"]]
    assert ids == ["sreebhumi-sporting"]


def test_get_single_pandal() -> None:
    r = client.get("/api/pandals/suruchi-sangha")
    assert r.status_code == 200
    body = r.json()
    assert body["name"] == "Suruchi Sangha"
    assert body["nearest_metro"]["station"] == "Kalighat"


def test_get_missing_pandal_404() -> None:
    assert client.get("/api/pandals/does-not-exist").status_code == 404


def test_metro_lines() -> None:
    r = client.get("/api/metro-lines")
    assert r.status_code == 200
    body = r.json()
    assert body["count"] == len(METRO_LINES)
    assert {line["id"] for line in body["lines"]} == {"blue", "green", "orange", "purple"}


def test_route_blue_is_ordered_along_the_line() -> None:
    r = client.get("/api/routes/blue")
    assert r.status_code == 200
    route = r.json()
    assert route["stop_count"] >= 5

    # Orders are 1..n and strictly sequential.
    orders = [s["order"] for s in route["stops"]]
    assert orders == list(range(1, len(orders) + 1))

    # Stations appear in physical Blue Line order (non-decreasing index).
    blue = next(line for line in METRO_LINES if line["id"] == "blue")
    index = {name: i for i, name in enumerate(blue["stations"])}
    seen = [index[s["station"]] for s in route["stops"]]
    assert seen == sorted(seen)


def test_route_accepts_name_and_id() -> None:
    assert client.get("/api/routes/blue").json()["line_id"] == "blue"
    assert client.get("/api/routes/Blue").json()["line_id"] == "blue"
    assert client.get("/api/routes/Blue Line").json()["line_id"] == "blue"


def test_route_unknown_line_404() -> None:
    assert client.get("/api/routes/chartreuse").status_code == 404


def test_all_routes_nonempty() -> None:
    r = client.get("/api/routes")
    assert r.status_code == 200
    routes = r.json()
    assert len(routes) >= 2
    for route in routes:
        assert route["stop_count"] >= 1
