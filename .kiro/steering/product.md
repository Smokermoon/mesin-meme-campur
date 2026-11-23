# Product: Mesin Meme Campur (Meme Mixer Machine)

Mesin Meme Campur is a browser-based meme studio built for the Kiroween
hackathon, Frankenstein category. The Frankenstein idea is the product:
several unrelated services and technologies are stitched into one small,
fun tool that feels like a single machine.

## What the user does

1. Picks a base image: an upload, a built-in template, or a random photo
   pulled from a public photo API.
2. Picks a remix mode that restyles the image on a canvas (classic meme,
   deep fried, pixel, glitch, vintage).
3. Asks the caption machine for caption ideas. An LLM writes several
   candidates in mixed voices: one formal, one absurd, one Indonesian
   slang, one motivational. The user can also press "Campur" (mix) to
   combine the top line of one candidate with the bottom line of another.
4. Edits the meme on a canvas editor: top text, bottom text, font size,
   outline, and placement.
5. Exports the result as a PNG download, or shares it through the
   browser share sheet when the platform supports it.

## Design principles

- Works end to end with zero setup. If the user never adds an API key,
  a local template caption engine still produces usable captions, so the
  demo never dead-ends.
- No build step. Plain HTML, CSS, and JavaScript so the site can be
  hosted as static files anywhere, including GitHub Pages.
- No secrets in the repo. AI captioning uses a bring-your-own-key field;
  the key lives only in the browser's localStorage and is sent only to
  the provider the user picked.
- Honest labelling. The UI says where each caption came from: the AI
  provider, or the local template engine in demo mode.

## Audience

Hackathon judges first, then anyone who wants a quick meme without
installing an app. The interface language is English with Indonesian
flavour in the caption styles, because the slang voice is part of the
joke.
