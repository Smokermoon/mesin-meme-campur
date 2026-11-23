# Requirements: Mesin Meme Campur

## Introduction

A single-page web app that stitches a photo API, an LLM caption API,
canvas image filters, a canvas text editor, and the Web Share API into
one meme-making machine. Built for Kiroween, Frankenstein category.

## Requirements

### Requirement 1: Base image sources

**User story:** As a user, I want several ways to get a base image, so
that I can start a meme without hunting for files.

#### Acceptance criteria

1. WHEN the user opens the app, THE APP SHALL show at least four
   built-in template images rendered locally (no network needed).
2. WHEN the user uploads an image file, THE APP SHALL load it onto the
   canvas as the base image.
3. WHEN the user presses the random photo button, THE APP SHALL fetch a
   random photo from the Lorem Picsum API and use it as the base image.
4. IF the photo API request fails, THEN THE APP SHALL keep the current
   image and show a short error note.

### Requirement 2: Remix modes

**User story:** As a user, I want one-click styles that restyle my
image, so that the meme feels remixed and not just captioned.

#### Acceptance criteria

1. THE APP SHALL offer at least five remix modes: Classic, Deep Fried,
   Pixel, Glitch, and Vintage.
2. WHEN the user picks a mode, THE APP SHALL re-render the canvas with
   that mode's filter pipeline applied to the base image.
3. Remix modes SHALL be implemented with canvas pixel or draw
   operations only, with no extra network calls.

### Requirement 3: AI caption machine

**User story:** As a user, I want the machine to write caption ideas in
different voices, so that I can pick or mix the funniest one.

#### Acceptance criteria

1. WHEN the user presses the caption button, THE APP SHALL return at
   least four caption candidates, each labelled with a voice: Formal,
   Absurd, Indonesian Slang, and Motivational.
2. IF the user has saved a Groq API key in the settings field, THEN THE
   APP SHALL request captions from the Groq chat completions API and
   label the results with the provider name.
3. IF no key is saved, or the API call fails, THEN THE APP SHALL fall
   back to the local template caption engine and label the results as
   demo mode.
4. THE APP SHALL store the API key only in localStorage and SHALL never
   include a key in the source code.
5. WHEN the user presses Campur (mix) on two different candidates, THE
   APP SHALL build a new caption from the top line of one and the bottom
   line of the other.

### Requirement 4: Canvas editor

**User story:** As a user, I want to edit the text on my meme, so that
the final image says exactly what I want.

#### Acceptance criteria

1. THE APP SHALL provide editable top text and bottom text fields that
   update the canvas as the user types.
2. THE APP SHALL provide controls for font size and text outline
   thickness.
3. Caption text SHALL be drawn in a bold meme style: uppercase, white
   fill, black outline, wrapped and shrunk to fit the image width.

### Requirement 5: Export and share

**User story:** As a user, I want to keep and share my finished meme.

#### Acceptance criteria

1. WHEN the user presses Download PNG, THE APP SHALL export the canvas
   as a PNG file download.
2. WHEN the user presses Share and the browser supports the Web Share
   API with files, THE APP SHALL open the share sheet with the PNG
   attached.
3. IF sharing is not supported, THEN THE APP SHALL say so and point the
   user to the download button.

### Requirement 6: Honest labelling and safety

#### Acceptance criteria

1. THE APP SHALL label the caption source (provider name or demo mode)
   near the caption results.
2. THE README SHALL explain which services are stitched together and
   SHALL state the bring-your-own-key limitation plainly.
