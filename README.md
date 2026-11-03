# INKLINGS · The Nest

A tiny living watercolor world. An original, mobile-first Tamagotchi-style creature-care experience with no levels or punishment.

## Play

Use the painted **Play**, **Journal**, and **Settings** controls on the opening illustration. In the nest, tap an Inky to pet it or use **Feed**, **Play**, **Rest**. Your interactions are saved locally to this browser. Little sounds and reduced motion can be adjusted in Settings.

## Running locally

`python -m http.server 8080` then browse to `http://localhost:8080`. No build step or server code.

## Hosting

Set GitHub Pages to deploy from `main`, directory `/ (root)`. All paths are relative to support `https://itsnotalwin.github.io/inklings/`.

## Status

First playable watercolor vertical slice with illustrated entry screen, responsive nest, pet/feed/play/rest, journal, local saves, and mobile controls. Inkies currently react and breathe in place; true autonomous movement is planned.

## Design and source

Read `PROJECT.md`, `AGENTS.md` and folder `CONTEXT.md`/`DESIGN.md` before extending. The illustrations are generated specifically for this concept and need an additional consistent animation/cleanup pass before final production.
