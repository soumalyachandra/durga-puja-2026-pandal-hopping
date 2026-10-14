"""Seed data for the Durga Puja 2026 Pandal Hopping app.

IMPORTANT — DATA ACCURACY
-------------------------
* Coordinates (lat/lng) are **approximate**, hand-placed to put each pandal in
  the right neighbourhood for the map/routing demo. Verify against an authoritative
  source before relying on them for real navigation.
* "nearest_metro" reflects the most practical operational station at the time of
  writing. Kolkata Metro is actively expanding (Orange & Purple lines are only
  partially open), so some pairings note an upcoming station in ``alt_metro``.
* ``theme`` for 2026 is illustrative / "to be announced" — individual pujas
  announce themes closer to the festival. ``famous_for`` captures each club's
  genuine, long-standing reputation.

Festival: Durga Puja 2026. Main days (Shashthi -> Dashami): 16-21 October 2026.
"""

from __future__ import annotations

FESTIVAL = {
    "name": "Durga Puja 2026",
    "city_scope": ["Kolkata", "Howrah"],
    "start_date": "2026-10-16",  # Maha Shashthi
    "end_date": "2026-10-21",  # Bijoya Dashami
    "key_days": [
        {"date": "2026-10-16", "tithi": "Maha Shashthi"},
        {"date": "2026-10-17", "tithi": "Maha Saptami"},
        {"date": "2026-10-18", "tithi": "Maha Ashtami"},
        {"date": "2026-10-19", "tithi": "Maha Navami"},
        {"date": "2026-10-20", "tithi": "Maha Navami / Sandhi"},
        {"date": "2026-10-21", "tithi": "Bijoya Dashami"},
    ],
    "note": (
        "Dates are based on the published 2026 festival calendar and may shift by a "
        "day depending on the panjika/almanac followed. Please re-confirm nearer the time."
    ),
}

# ---------------------------------------------------------------------------
# Metro lines. `stations` are ordered along the line so the route planner can
# sequence pandals geographically. Colours match the official line colours.
# ---------------------------------------------------------------------------
METRO_LINES = [
    {
        "id": "blue",
        "name": "Blue Line",
        "line_number": "Line 1",
        "color": "#1565C0",
        "route": "Dakshineswar ↔ Kavi Subhash (New Garia)",
        "status": "operational",
        "stations": [
            "Dakshineswar", "Baranagar", "Noapara", "Dum Dum", "Belgachia",
            "Shyambazar", "Shobhabazar Sutanuti", "Girish Park",
            "Mahatma Gandhi Road", "Central", "Chandni Chowk", "Esplanade",
            "Park Street", "Maidan", "Rabindra Sadan", "Netaji Bhavan",
            "Jatin Das Park", "Kalighat", "Rabindra Sarobar",
            "Mahanayak Uttam Kumar", "Netaji", "Masterda Surya Sen",
            "Gitanjali", "Kavi Nazrul", "Shahid Khudiram", "Kavi Subhash",
        ],
    },
    {
        "id": "green",
        "name": "Green Line",
        "line_number": "Line 2 (East-West)",
        "color": "#2E7D32",
        "route": "Howrah Maidan ↔ Salt Lake Sector V",
        "status": "operational",
        "stations": [
            "Howrah Maidan", "Howrah", "Mahakaran", "Esplanade", "Sealdah",
            "Phoolbagan", "Salt Lake Stadium", "Bengal Chemical", "City Centre",
            "Central Park", "Karunamoyee", "Salt Lake Sector V",
        ],
    },
    {
        "id": "orange",
        "name": "Orange Line",
        "line_number": "Line 3 (New Garia – Airport)",
        "color": "#EF6C00",
        "route": "Kavi Subhash ↔ Jai Hind (Airport) — partially operational",
        "status": "partially_operational",
        "stations": [
            "Kavi Subhash", "Satyajit Ray", "Jyotirindra Nandi", "Kavi Sukanta",
            "Hemanta Mukhopadhyay", "VIP Bazar", "Ritwik Ghatak", "Barun Sengupta",
            "Gariahat", "Ballygunge", "Kasba", "Science City", "Sector V",
        ],
    },
    {
        "id": "purple",
        "name": "Purple Line",
        "line_number": "Line 4 (Joka – Esplanade)",
        "color": "#6A1B9A",
        "route": "Joka ↔ Esplanade — partially operational (Joka – Majerhat)",
        "status": "partially_operational",
        "stations": [
            "Joka", "Thakurpukur", "Sakherbazar", "Behala Chowrasta",
            "Behala Bazar", "Taratala", "Majerhat", "Mominpur", "Khidderpore",
            "Victoria", "Park Street", "Esplanade",
        ],
    },
]

# ---------------------------------------------------------------------------
# Pandals. See module docstring for accuracy caveats.
# ---------------------------------------------------------------------------
PANDALS = [
    # ---------------------------- NORTH KOLKATA ----------------------------
    {
        "id": "bagbazar-sarbojanin",
        "name": "Bagbazar Sarbojanin",
        "zone": "North Kolkata",
        "city": "Kolkata",
        "nearest_metro": {"station": "Shyambazar", "line": "Blue", "walk_minutes": 12},
        "alt_metro": [],
        "location": {"lat": 22.6018, "lng": 88.3665},
        "theme": "To be announced — traditionally a classic 'sabeki' ekchala idol.",
        "established": 1919,
        "famous_for": "One of Kolkata's oldest community pujas; iconic traditional ekchala pratima and sprawling riverside grounds.",
        "crowd_level": "Very High",
        "best_time_to_visit": "Early morning or post-midnight",
        "address": "Bagbazar, Kolkata 700003",
    },
    {
        "id": "kumartuli-park",
        "name": "Kumartuli Park Sarbojanin",
        "zone": "North Kolkata",
        "city": "Kolkata",
        "nearest_metro": {"station": "Shobhabazar Sutanuti", "line": "Blue", "walk_minutes": 10},
        "alt_metro": [],
        "location": {"lat": 22.6010, "lng": 88.3605},
        "theme": "To be announced — known for art-forward, idol-centric themes.",
        "established": 1996,
        "famous_for": "Steps from Kumartuli, the potters' quarter where the idols are born; celebrated for sculptural artistry.",
        "crowd_level": "High",
        "best_time_to_visit": "Morning",
        "address": "Kumartuli, Kolkata 700005",
    },
    {
        "id": "college-square",
        "name": "College Square (Vidyasagar Smriti Mandir)",
        "zone": "North Kolkata",
        "city": "Kolkata",
        "nearest_metro": {"station": "Mahatma Gandhi Road", "line": "Blue", "walk_minutes": 8},
        "alt_metro": [{"station": "Central", "line": "Blue", "walk_minutes": 12}],
        "location": {"lat": 22.5752, "lng": 88.3637},
        "theme": "To be announced — famed for spectacular lighting reflected on the tank.",
        "established": 1948,
        "famous_for": "Grand illuminations mirrored in the College Square water tank and a replica-architecture pandal.",
        "crowd_level": "Very High",
        "best_time_to_visit": "After dark for the lights",
        "address": "College Square, Kolkata 700073",
    },
    {
        "id": "mohammad-ali-park",
        "name": "Mohammad Ali Park",
        "zone": "North Kolkata",
        "city": "Kolkata",
        "nearest_metro": {"station": "Central", "line": "Blue", "walk_minutes": 7},
        "alt_metro": [{"station": "Mahatma Gandhi Road", "line": "Blue", "walk_minutes": 10}],
        "location": {"lat": 22.5758, "lng": 88.3562},
        "theme": "To be announced — typically grand replica-temple architecture.",
        "established": 1969,
        "famous_for": "Large central-Kolkata puja known for ambitious temple and monument replicas.",
        "crowd_level": "High",
        "best_time_to_visit": "Evening",
        "address": "Mohammad Ali Park, Kolkata 700073",
    },
    # ---------------------------- SOUTH KOLKATA ----------------------------
    {
        "id": "suruchi-sangha",
        "name": "Suruchi Sangha",
        "zone": "South Kolkata",
        "city": "Kolkata",
        "nearest_metro": {"station": "Kalighat", "line": "Blue", "walk_minutes": 20},
        "alt_metro": [{"station": "Majerhat", "line": "Purple", "walk_minutes": 15}],
        "location": {"lat": 22.5042, "lng": 88.3348},
        "theme": "To be announced — renowned for depicting a different Indian state's folk art each year.",
        "established": 1952,
        "famous_for": "Multiple-award-winning New Alipore puja celebrated for folk-art state themes and social messaging.",
        "crowd_level": "Very High",
        "best_time_to_visit": "Morning or late night",
        "address": "New Alipore, Block K, Kolkata 700053",
    },
    {
        "id": "chetla-agrani",
        "name": "Chetla Agrani Club",
        "zone": "South Kolkata",
        "city": "Kolkata",
        "nearest_metro": {"station": "Kalighat", "line": "Blue", "walk_minutes": 14},
        "alt_metro": [],
        "location": {"lat": 22.5155, "lng": 88.3377},
        "theme": "To be announced — consistently high-concept, art-directed pandals.",
        "established": 1991,
        "famous_for": "A heavyweight of the South Kolkata circuit, known for refined artistic direction and theme pujas.",
        "crowd_level": "Very High",
        "best_time_to_visit": "Morning or late night",
        "address": "Chetla, Kolkata 700027",
    },
    {
        "id": "ekdalia-evergreen",
        "name": "Ekdalia Evergreen",
        "zone": "South Kolkata",
        "city": "Kolkata",
        "nearest_metro": {"station": "Kalighat", "line": "Blue", "walk_minutes": 22},
        "alt_metro": [{"station": "Gariahat", "line": "Orange", "walk_minutes": 8}],
        "location": {"lat": 22.5208, "lng": 88.3685},
        "theme": "To be announced — famous for monumental temple-replica pandals and heritage jewellery on the idol.",
        "established": 1943,
        "famous_for": "Grand replica-temple pandals near Gariahat and a traditionally resplendent, gold-adorned idol.",
        "crowd_level": "Very High",
        "best_time_to_visit": "Evening",
        "address": "Ekdalia Road, Gariahat, Kolkata 700019",
    },
    {
        "id": "tridhara-sammilani",
        "name": "Tridhara Sammilani",
        "zone": "South Kolkata",
        "city": "Kolkata",
        "nearest_metro": {"station": "Kalighat", "line": "Blue", "walk_minutes": 16},
        "alt_metro": [{"station": "Rabindra Sarobar", "line": "Blue", "walk_minutes": 18}],
        "location": {"lat": 22.5178, "lng": 88.3558},
        "theme": "To be announced — known for innovative, experiential theme pandals.",
        "established": 1947,
        "famous_for": "Deshapriya Park-area puja celebrated for creative, immersive themes and strong crowds.",
        "crowd_level": "High",
        "best_time_to_visit": "Morning",
        "address": "Deshapriya Park, Kolkata 700029",
    },
    {
        "id": "mudiali-club",
        "name": "Mudiali Club",
        "zone": "South Kolkata",
        "city": "Kolkata",
        "nearest_metro": {"station": "Rabindra Sarobar", "line": "Blue", "walk_minutes": 10},
        "alt_metro": [{"station": "Kalighat", "line": "Blue", "walk_minutes": 18}],
        "location": {"lat": 22.5078, "lng": 88.3502},
        "theme": "To be announced — long pedigree of artistic, award-winning pandals.",
        "established": 1935,
        "famous_for": "One of the oldest theme-puja pioneers near Rabindra Sarobar, a perennial award contender.",
        "crowd_level": "High",
        "best_time_to_visit": "Morning or late night",
        "address": "Mudiali, Lake Gardens, Kolkata 700031",
    },
    # ------------------------- SALT LAKE & EAST ----------------------------
    {
        "id": "sreebhumi-sporting",
        "name": "Sreebhumi Sporting Club",
        "zone": "Salt Lake & East",
        "city": "Kolkata",
        "nearest_metro": {"station": "Belgachia", "line": "Blue", "walk_minutes": 25},
        "alt_metro": [{"station": "Salt Lake Stadium", "line": "Green", "walk_minutes": 22}],
        "location": {"lat": 22.5998, "lng": 88.3985},
        "theme": "To be announced — famous for giant cinematic & monument replicas that draw record crowds.",
        "established": 1973,
        "famous_for": "Blockbuster large-scale replica themes (palaces, films) and arguably the city's biggest crowds.",
        "crowd_level": "Very High",
        "best_time_to_visit": "Weekday mornings to beat the crush",
        "address": "Sreebhumi, VIP Road, Lake Town, Kolkata 700048",
    },
    {
        "id": "fd-block-saltlake",
        "name": "FD Block Puja (Salt Lake)",
        "zone": "Salt Lake & East",
        "city": "Kolkata",
        "nearest_metro": {"station": "City Centre", "line": "Green", "walk_minutes": 12},
        "alt_metro": [{"station": "Central Park", "line": "Green", "walk_minutes": 14}],
        "location": {"lat": 22.5905, "lng": 88.4095},
        "theme": "To be announced — a Salt Lake favourite for elaborate theme pandals.",
        "established": 1975,
        "famous_for": "Among the most popular of the Salt Lake block pujas, known for detailed thematic builds.",
        "crowd_level": "High",
        "best_time_to_visit": "Evening",
        "address": "FD Block, Bidhannagar, Kolkata 700106",
    },
    {
        "id": "santosh-mitra-square",
        "name": "Santosh Mitra Square",
        "zone": "Salt Lake & East",
        "city": "Kolkata",
        "nearest_metro": {"station": "Sealdah", "line": "Green", "walk_minutes": 10},
        "alt_metro": [{"station": "Central", "line": "Blue", "walk_minutes": 15}],
        "location": {"lat": 22.5668, "lng": 88.3688},
        "theme": "To be announced — known for show-stopping gold/silver idols and blockbuster replicas.",
        "established": 1936,
        "famous_for": "Headline-grabbing themes, often with real gold or silver, near Sealdah.",
        "crowd_level": "Very High",
        "best_time_to_visit": "Late night",
        "address": "Santosh Mitra Square, Sealdah, Kolkata 700009",
    },
    # ------------------------------- HOWRAH --------------------------------
    {
        "id": "shibpur-mandirtala",
        "name": "Shibpur Mandirtala Sarbojanin",
        "zone": "Howrah",
        "city": "Howrah",
        "nearest_metro": {"station": "Howrah Maidan", "line": "Green", "walk_minutes": 18},
        "alt_metro": [],
        "location": {"lat": 22.5792, "lng": 88.3182},
        "theme": "To be announced — a flagship Howrah puja with ambitious theme builds.",
        "established": 1940,
        "famous_for": "One of Howrah's best-known pujas, now a short hop from the Howrah Maidan metro terminus.",
        "crowd_level": "High",
        "best_time_to_visit": "Evening",
        "address": "Mandirtala, Shibpur, Howrah 711102",
    },
    {
        "id": "santragachi-railway-colony",
        "name": "Santragachi Railway Colony Puja",
        "zone": "Howrah",
        "city": "Howrah",
        "nearest_metro": {"station": "Howrah Maidan", "line": "Green", "walk_minutes": 45},
        "alt_metro": [],
        "location": {"lat": 22.6035, "lng": 88.2672},
        "theme": "To be announced — community railway-colony puja with a warm neighbourhood feel.",
        "established": 1955,
        "famous_for": "A classic Howrah suburban puja; most convenient via Santragachi rail station rather than metro.",
        "crowd_level": "Moderate",
        "best_time_to_visit": "Evening",
        "address": "Railway Colony, Santragachi, Howrah 711104",
    },
]
