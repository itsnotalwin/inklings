# INKLINGS · The Nest

A mobile-first watercolor creature-care game. No levels, no deaths, no daily punishment. The opening artwork is a hand-painted scene with interactive **Play**, **Journal** and **Settings** regions. Feed, pet, play with and rest with Pip and Momo. Progress saves to local browser storage.

## Run

`python -m http.server 8080`, then open `http://localhost:8080/`.

## GitHub Pages

In repository Settings → Pages, deploy from `main` and `/ (root)`. Paths are relative for the `/inklings/` subpath. A successful push does not guarantee Pages is active.

## Quality and current limitations

Watercolor title-screen layout locally verified in Chromium at 320×568, 390×844, 430×932 and 1280×900 with title controls and care actions tested. The production Pages URL is not yet verified here. Pip and Momo currently animate/react in place; autonomous movement needs a future art and code pass. Live screenshot publication remains pending.

Before editing, read `PROJECT.md`, `AGENTS.md`, and affected folder `CONTEXT.md`/`DESIGN.md`.
