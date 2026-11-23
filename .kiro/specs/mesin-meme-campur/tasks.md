# Tasks: Mesin Meme Campur

- [x] 1. Write steering docs (product, tech, structure)
- [x] 2. Write the spec: requirements, design, task list
- [x] 3. Build the page shell
  - [x] 3.1 Header, stage, control columns in index.html
  - [x] 3.2 Styling in styles.css (dark lab theme, orange accent)
- [x] 4. Image sources
  - [x] 4.1 Four procedural template images on offscreen canvases
  - [x] 4.2 Upload handling (file input + drag and drop)
  - [x] 4.3 Random photo from Lorem Picsum with error fallback
- [x] 5. Remix modes
  - [x] 5.1 Classic and Vintage (filter-based)
  - [x] 5.2 Deep Fried (contrast, saturation, noise)
  - [x] 5.3 Pixel (low-res redraw, smoothing off)
  - [x] 5.4 Glitch (slice offsets, channel shift)
- [x] 6. Caption machine
  - [x] 6.1 Local template engine with four voices
  - [x] 6.2 Groq API path with bring-your-own-key, JSON parsing,
        fallback to templates on any failure
  - [x] 6.3 Candidate cards with Use and Campur (mix) actions
- [x] 7. Canvas text editor
  - [x] 7.1 Top and bottom text, live render
  - [x] 7.2 Font size and outline controls, wrap and shrink to fit
- [x] 8. Export
  - [x] 8.1 Download PNG
  - [x] 8.2 Web Share API with download fallback
- [x] 9. Repo finish
  - [x] 9.1 README with the stitching story and honest limitations
  - [x] 9.2 MIT LICENSE, .gitignore that keeps .kiro tracked
  - [x] 9.3 First commit
- [x] 10. Verify end to end
  - [x] 10.1 Local serve test, click through every flow
  - [x] 10.2 Screenshot the app and the exported PNG
  - [x] 10.3 Tick off finished tasks in this file
- [x] 11. Surprise me button (added in a live Kiro spec session)
  - [x] 11.1 One click randomizes template, remix mode, and a fresh
        caption mix through the existing state flow
  - [x] 11.2 setMode() helper and optional topic override in
        generateCaptions() to support it without changing old flows
