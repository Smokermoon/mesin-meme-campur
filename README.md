# Mesin Meme Campur — the Meme Mixer Machine

I built a meme studio for Kiroween, in the Frankenstein category. The
whole point of Frankenstein is stitching different things together until
the result feels alive, so that is exactly how this app works. It is one
static page, but under the hood it is a small crowd of services and
browser APIs holding hands.

**Try it:** open `index.html` in a browser, or serve the folder with any
static server. Once the GitHub repo exists, the same files run on GitHub
Pages with no build step.

## What it does

1. **Pick a base image.** Four built-in templates are drawn on the spot
   with canvas shapes, so they work offline. You can also upload your
   own image, drag and drop one onto the canvas, or pull a random photo
   from the Lorem Picsum API.
2. **Remix it.** Five one-click modes restyle the picture on a canvas:
   Classic, Deep Fried, Pixel, Glitch, and Vintage. Each mode is its own
   little filter pipeline.
3. **Ask the caption machine.** It writes four caption candidates, each
   in a different voice: Formal, Absurd, Indonesian Slang, and
   Motivational. You can take a whole caption, lift just the top or
   bottom line from a card, or press Campur for a random mix. Campur is
   Indonesian for "mix", and mixing lines from different voices is where
   the funny usually hides.
4. **Edit and export.** Top and bottom text fields, font size, and
   outline controls update the canvas live. Download exports a PNG, and
   Share uses the Web Share API when the browser supports it.

## The stitching (Frankenstein parts)

- **Lorem Picsum** (`picsum.photos`) for random base photos. No key.
- **Groq or OpenRouter** chat completions for live AI captions. You pick
  the provider and model in the settings panel.
- **A local template caption engine** that I wrote as the fallback
  brain. It needs no network at all.
- **Canvas 2D** for templates, remix filters, text rendering, and the
  PNG export.
- **Web Share API** for sharing the finished meme, with a download
  fallback.
- **Plain HTML, CSS, and JavaScript.** No framework, no bundler, no
  build step, so GitHub Pages can serve the repo root as is.

## The honest limitation: bring your own key

A static page cannot safely hold a shared API key, and I am not going
to commit one to a public repo. So live AI captions work like this: you
paste your own Groq or OpenRouter key into the settings panel, and the
app sends it only to the provider you picked. If you tick the remember
box, the key sits in your browser's localStorage and nowhere else.

If you skip the key, the app does not break. It drops into demo mode and
the local template engine writes the captions instead, and the UI labels
them as demo mode so nobody is fooled. Every flow in the app, from remix
to export, still works with zero setup.

## How it was built

I used Kiro's spec-driven workflow. The `.kiro` folder at the root of
this repo holds the steering docs (product, tech, structure) and the
full spec for this app: `requirements.md`, `design.md`, and `tasks.md`
under `.kiro/specs/mesin-meme-campur/`. The app was built task by task
against that spec.

## Run it locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## License

MIT, copyright Ririn Volina. See `LICENSE`.
