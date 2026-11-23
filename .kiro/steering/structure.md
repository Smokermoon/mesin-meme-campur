# Project structure

```
.
├── index.html          # the whole app UI, one page
├── styles.css          # all styling
├── app.js              # all behaviour: image sources, remix modes,
│                       # caption engines, canvas editor, export
├── README.md           # what it is, how to run it, the stitching story
├── LICENSE             # MIT
└── .kiro/
    ├── steering/
    │   ├── product.md  # product overview and principles
    │   ├── tech.md     # stack and conventions
    │   └── structure.md
    └── specs/
        └── mesin-meme-campur/
            ├── requirements.md
            ├── design.md
            └── tasks.md
```

The app files sit at the repository root on purpose: GitHub Pages can
serve the root directly, so the live site needs no build or deploy
configuration beyond turning Pages on.
