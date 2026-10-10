# mbta-trail
A loving homage to Oregon Trail, Boston, and of course, the MBTA.

MBTA Trail is a turn-based commuter game inspired by classic resource management games such as Oregon Trail.  
Players choose a commuter archetype and attempt to travel from the end of a subway line to Park Street while managing:
- Time
- Money
- CharlieCard (Transit Pass) Balance
- Hunger

Every playthrough features random MBTA-inspired events, difficult choices, and Boston humor.

## Current Status
IN DEVELOPMENT. Soliciting ideas for random events.

## Technology
Plain HTML, CSS, and vanilla JavaScript (ES modules). No build step,
bundler, or framework.

## Running Locally
The game loads station/route data with `fetch()`, which browsers block
against `file://` paths — so serve the project instead of opening
`index.html` directly. Run this from the **repository root** (not from
inside `web/` — the game's code lives in `web/`, but it loads data from
a sibling `data/` folder, so the server needs to see both):
```
python3 -m http.server 8000
```
Then open `http://localhost:8000/web/` in a browser.

## Roadmap
- Complete game design doc
- Build prototype
  - Develop Red Line
  - Develop Green Line
  - Develop Orange Line
- User Test
- Refine based on user feedback
