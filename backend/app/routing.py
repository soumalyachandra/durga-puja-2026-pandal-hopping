"""Route-suggestion logic.

Given a metro line, produce a sensible pandal-hopping sequence by ordering the
pandals that sit on that line along the physical station order. This turns
"which pujas can I see off the Blue Line?" into an ordered, walkable itinerary.
"""

from __future__ import annotations

from app.seed_data import METRO_LINES, PANDALS

_LINE_BY_ID = {line["id"]: line for line in METRO_LINES}
_LINE_ID_BY_NAME = {line["name"].split()[0].lower(): line["id"] for line in METRO_LINES}


def _resolve_line_id(line_key: str) -> str | None:
    """Accept either a line id ('blue') or a name fragment ('Blue', 'Blue Line')."""
    key = line_key.strip().lower()
    if key in _LINE_BY_ID:
        return key
    key = key.replace(" line", "").strip()
    if key in _LINE_BY_ID:
        return key
    return _LINE_ID_BY_NAME.get(key)


def _metro_ref_on_line(pandal: dict, line_name_first_word: str) -> dict | None:
    """Return the metro ref (primary or alternate) that lies on the given line."""
    target = line_name_first_word.lower()
    primary = pandal["nearest_metro"]
    if primary["line"].lower() == target:
        return primary
    for alt in pandal.get("alt_metro", []):
        if alt["line"].lower() == target:
            return alt
    return None


def suggest_route(line_key: str) -> dict | None:
    """Build an ordered itinerary for a single metro line.

    Returns ``None`` if the line key is unknown.
    """
    line_id = _resolve_line_id(line_key)
    if line_id is None:
        return None

    line = _LINE_BY_ID[line_id]
    line_first_word = line["name"].split()[0]  # "Blue", "Green", ...
    station_index = {name: i for i, name in enumerate(line["stations"])}

    candidates: list[tuple[int, dict, dict]] = []
    for pandal in PANDALS:
        ref = _metro_ref_on_line(pandal, line_first_word)
        if ref is None:
            continue
        idx = station_index.get(ref["station"], len(line["stations"]) + 1)
        candidates.append((idx, pandal, ref))

    candidates.sort(key=lambda t: (t[0], t[1]["name"]))

    stops = [
        {
            "order": i + 1,
            "pandal": pandal,
            "station": ref["station"],
            "walk_minutes": ref["walk_minutes"],
        }
        for i, (_, pandal, ref) in enumerate(candidates)
    ]

    if stops:
        first = stops[0]["station"]
        last = stops[-1]["station"]
        notes = (
            f"Start at {first} and ride the {line['name']} towards {last}, "
            f"hopping off at each station below. {len(stops)} pandal(s) on this line."
        )
    else:
        notes = f"No seed pandals are currently mapped to the {line['name']}."

    return {
        "line_id": line["id"],
        "line_name": line["name"],
        "line_color": line["color"],
        "stop_count": len(stops),
        "stops": stops,
        "notes": notes,
    }


def all_routes() -> list[dict]:
    """Suggested routes for every line that has at least one pandal."""
    routes = []
    for line in METRO_LINES:
        route = suggest_route(line["id"])
        if route and route["stop_count"] > 0:
            routes.append(route)
    return routes
