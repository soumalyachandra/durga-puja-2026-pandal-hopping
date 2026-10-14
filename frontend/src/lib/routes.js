// Client-side route planner. Mirrors backend/app/routing.py so the "plan a
// metro-line crawl" feature works identically online or offline.

function metroRefOnLine(pandal, lineFirstWordLower) {
  if (pandal.nearest_metro.line.toLowerCase() === lineFirstWordLower) {
    return pandal.nearest_metro
  }
  return (
    (pandal.alt_metro || []).find(
      (a) => a.line.toLowerCase() === lineFirstWordLower
    ) || null
  )
}

/** Ordered itinerary for a single metro line, or null if the line is unknown. */
export function suggestRoute(lineId, pandals, lines) {
  const line = lines.find((l) => l.id === lineId)
  if (!line) return null

  const lineFirstWord = line.name.split(' ')[0].toLowerCase() // "blue", ...
  const stationIndex = new Map(line.stations.map((s, i) => [s, i]))
  const overflow = line.stations.length + 1

  const matched = []
  for (const pandal of pandals) {
    const ref = metroRefOnLine(pandal, lineFirstWord)
    if (!ref) continue
    const idx = stationIndex.has(ref.station) ? stationIndex.get(ref.station) : overflow
    matched.push({ idx, pandal, station: ref.station, walk_minutes: ref.walk_minutes })
  }

  matched.sort((a, b) => a.idx - b.idx || a.pandal.name.localeCompare(b.pandal.name))

  const stops = matched.map((m, i) => ({
    order: i + 1,
    pandal: m.pandal,
    station: m.station,
    walk_minutes: m.walk_minutes,
  }))

  const notes = stops.length
    ? `Start at ${stops[0].station} and ride the ${line.name} towards ${
        stops[stops.length - 1].station
      }, hopping off at each station below.`
    : `No pandals are currently mapped to the ${line.name}.`

  return {
    line_id: line.id,
    line_name: line.name,
    line_color: line.color,
    stop_count: stops.length,
    stops,
    notes,
  }
}

/** Suggested routes for every line that has at least one pandal. */
export function allRoutes(pandals, lines) {
  return lines
    .map((l) => suggestRoute(l.id, pandals, lines))
    .filter((r) => r && r.stop_count > 0)
}
