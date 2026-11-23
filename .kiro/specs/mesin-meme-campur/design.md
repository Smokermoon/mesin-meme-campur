# Design: Mesin Meme Campur

## Overview

One static page. Three files: index.html holds the layout, styles.css
holds the look, app.js holds all behaviour. The app is a small state
machine around a single canvas: a base image goes in, a remix filter
pipeline transforms it, caption text is drawn on top, and the canvas is
the export.

## Layout

- Header: title, one-line pitch, settings (API key field + provider
  note) tucked into a details panel.
- Left column: the canvas stage plus export buttons (Download PNG,
  Share).
- Right column, top to bottom:
  - Image sources: template thumbnails, Upload button, Random Photo
    button.
  - Remix modes: five buttons (Classic, Deep Fried, Pixel, Glitch,
    Vintage).
  - Caption machine: topic input, Generate Captions button, candidate
    cards with voice labels, per-card Use and Campur buttons, and a
    source label (provider or demo mode).
  - Text editor: top text, bottom text, font size slider, outline
    slider.

## Data flow

1. `state.baseImage` holds the current source image (an Image object or
   an offscreen canvas for templates).
2. `render()` draws base image, applies the active remix pipeline, then
   draws the caption text. Every control change calls `render()`.
3. Remix pipelines:
   - Classic: plain draw, slight contrast.
   - Deep Fried: repeated contrast/saturation boosts plus noise specks.
   - Pixel: draw tiny, then scale up with smoothing off.
   - Glitch: horizontal slice offsets with red/cyan channel shifts.
   - Vintage: sepia matrix plus a soft vignette.
4. Caption generation:
   - With a key: POST to the Groq chat completions endpoint with a
     prompt asking for four captions in the four voices, JSON only.
     Parse defensively; any failure falls through to templates.
   - Without a key: the local template engine combines openers, subjects,
     and punchlines per voice, seeded by the topic text.
5. Campur (mix): each caption is stored as { top, bottom, voice }.
   Mixing takes top from card A and bottom from card B and applies the
   result to the editor.
6. Export: `canvas.toBlob` produces the PNG; download uses an anchor
   with an object URL; share uses `navigator.share` with a File when
   `navigator.canShare` agrees.

## Templates

Built-in templates are drawn procedurally on offscreen canvases
(gradient scenes with simple shapes: a dramatic sky, a cat silhouette
made of shapes, an office desk scene, an explosion burst). This keeps
the app fully usable offline and avoids hotlinking other people's meme
images.

## Error handling

- Photo API failure: keep current image, show a note, never blank the
  canvas.
- Caption API failure: fall back to templates and say so in the source
  label.
- Share unsupported: show a hint that points to Download PNG.

## Security

- No key in source. The key input is a password field; the value is
  saved to localStorage only when the user opts in with the save
  checkbox, and is sent only to api.groq.com.
