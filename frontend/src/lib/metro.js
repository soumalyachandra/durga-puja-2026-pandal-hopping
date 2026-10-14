// Helpers for mapping a pandal's metro line to its official colour.
export const LINE_FALLBACK_COLORS = {
  blue: '#1565C0',
  green: '#2E7D32',
  orange: '#EF6C00',
  purple: '#6A1B9A',
}

export function lineKey(name) {
  return (name || '').split(' ')[0].toLowerCase()
}

export function colorForLineName(name, lines = []) {
  const key = lineKey(name)
  const line = lines.find((l) => l.id === key || lineKey(l.name) === key)
  return line?.color || LINE_FALLBACK_COLORS[key] || '#C1121F'
}
