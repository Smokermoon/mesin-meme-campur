# Tech conventions

## Stack

- Plain HTML5, CSS3, and vanilla JavaScript (ES2020). No framework, no
  bundler, no build step. Files load directly in the browser.
- Canvas 2D API for image compositing, remix filters, text rendering,
  and PNG export.
- Static hosting only: GitHub Pages serves the repository root.

## External services stitched in (the Frankenstein parts)

- Lorem Picsum (https://picsum.photos) for random base photos. Plain
  image URLs, no key needed.
- Groq chat completions API (https://api.groq.com/openai/v1) for AI
  captions. OpenAI-compatible JSON over fetch. The user supplies their
  own key in the settings field; it is stored only in localStorage.
- Web Share API (navigator.share) for sharing the exported PNG when the
  browser supports it, with a plain download as the fallback.
- Local template caption engine as the offline fallback when no key is
  present or the API call fails.

## Code conventions

- One page, three files: index.html, styles.css, app.js. Keep it that
  way unless a file passes roughly 800 lines.
- All state lives in one plain object in app.js. No globals beyond the
  app object and DOM lookups.
- Every network call must have a failure path that keeps the app usable.
- Never hardcode an API key, token, or credential anywhere in the repo.
- Text rendering on canvas must wrap, outline, and shrink to fit rather
  than overflow the image.

## Testing

- Serve the folder with any static server and click through the full
  flow: pick image, remix, generate captions, mix captions, edit text,
  export PNG.
- Verify the exported PNG visually after any change to the canvas code.
