"use strict";
/* Mesin Meme Campur — a Frankenstein meme studio.
   Stitched from: procedural templates + file uploads + Lorem Picsum,
   canvas remix filters, an LLM caption API (bring your own key) with a
   local template fallback, a canvas text editor, and the Web Share API. */

const $ = (id) => document.getElementById(id);
const stage = $("stage");
const ctx = stage.getContext("2d");

const state = {
  base: null,          // canvas or image used as the base picture
  mode: "classic",
  topText: "",
  bottomText: "",
  fontScale: 1,
  outlineScale: 0.16,
  captions: [],
  captionSource: "",
};

/* ------------------------------------------------------------------ */
/* Built-in templates: little scenes drawn with shapes, no network.    */
/* ------------------------------------------------------------------ */

function makeCanvas(w, h) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  return c;
}

function drawDramaticCat() {
  const c = makeCanvas(900, 900), g = c.getContext("2d");
  const sky = g.createLinearGradient(0, 0, 0, 900);
  sky.addColorStop(0, "#2b1055"); sky.addColorStop(0.55, "#7597de");
  sky.addColorStop(0.78, "#ff9a5a"); sky.addColorStop(1, "#ffd194");
  g.fillStyle = sky; g.fillRect(0, 0, 900, 900);
  // sun
  g.fillStyle = "#fff3b0";
  g.beginPath(); g.arc(450, 640, 95, 0, Math.PI * 2); g.fill();
  g.fillStyle = "rgba(255,243,176,.35)";
  g.beginPath(); g.arc(450, 640, 150, 0, Math.PI * 2); g.fill();
  // clouds
  g.fillStyle = "rgba(255,255,255,.75)";
  for (const [x, y, s] of [[140, 180, 1], [620, 130, 1.3], [330, 90, 0.8], [730, 300, 0.9]]) {
    g.beginPath();
    g.ellipse(x, y, 90 * s, 30 * s, 0, 0, Math.PI * 2);
    g.ellipse(x + 55 * s, y + 8 * s, 65 * s, 24 * s, 0, 0, Math.PI * 2);
    g.ellipse(x - 60 * s, y + 10 * s, 55 * s, 20 * s, 0, 0, Math.PI * 2);
    g.fill();
  }
  // hill + cat silhouette
  g.fillStyle = "#1c1030";
  g.beginPath(); g.ellipse(450, 990, 640, 190, 0, 0, Math.PI * 2); g.fill();
  g.beginPath(); // body
  g.ellipse(450, 745, 95, 80, 0, 0, Math.PI * 2); g.fill();
  g.beginPath(); // head
  g.arc(450, 655, 52, 0, Math.PI * 2); g.fill();
  g.beginPath(); // ears
  g.moveTo(408, 628); g.lineTo(398, 568); g.lineTo(442, 604); g.closePath(); g.fill();
  g.beginPath();
  g.moveTo(492, 628); g.lineTo(502, 568); g.lineTo(458, 604); g.closePath(); g.fill();
  g.lineWidth = 17; g.strokeStyle = "#1c1030"; g.lineCap = "round"; // tail
  g.beginPath(); g.moveTo(528, 780); g.quadraticCurveTo(640, 760, 620, 660); g.stroke();
  return c;
}

function drawOffice() {
  const c = makeCanvas(900, 900), g = c.getContext("2d");
  g.fillStyle = "#cfd8dc"; g.fillRect(0, 0, 900, 900);
  g.fillStyle = "#90a4ae"; g.fillRect(0, 0, 900, 120); // header band
  g.fillStyle = "#eceff1"; g.fillRect(90, 180, 720, 430); // whiteboard
  g.strokeStyle = "#37474f"; g.lineWidth = 10; g.strokeRect(90, 180, 720, 430);
  // chart line going down, in red
  g.strokeStyle = "#e53935"; g.lineWidth = 12; g.beginPath();
  g.moveTo(140, 260); g.lineTo(300, 330); g.lineTo(430, 310);
  g.lineTo(560, 430); g.lineTo(700, 520); g.stroke();
  g.fillStyle = "#e53935";
  g.beginPath(); g.moveTo(700, 520); g.lineTo(668, 512); g.lineTo(692, 486); g.closePath(); g.fill();
  g.fillStyle = "#37474f"; g.font = "bold 44px sans-serif";
  g.fillText("Q3 NUMBERS", 140, 240);
  // desk + monitor + cup
  g.fillStyle = "#6d4c41"; g.fillRect(0, 700, 900, 200);
  g.fillStyle = "#263238"; g.fillRect(330, 470, 240, 160);
  g.fillStyle = "#b2ff59"; g.font = "bold 54px monospace"; g.fillText("-99%", 372, 570);
  g.fillStyle = "#4e342e"; g.fillRect(438, 630, 24, 70);
  g.fillStyle = "#fff"; g.fillRect(640, 620, 70, 84);
  g.fillStyle = "#6d4c41"; g.fillRect(640, 640, 70, 16);
  g.strokeStyle = "#fff"; g.lineWidth = 8;
  g.beginPath(); g.arc(722, 662, 20, -1.2, 1.2); g.stroke();
  // scattered papers
  g.fillStyle = "#fafafa";
  for (const [x, y, r] of [[120, 740, 0.2], [210, 790, -0.3], [730, 780, 0.4]]) {
    g.save(); g.translate(x, y); g.rotate(r); g.fillRect(-55, -38, 110, 76); g.restore();
  }
  return c;
}

function drawExplosion() {
  const c = makeCanvas(900, 900), g = c.getContext("2d");
  g.fillStyle = "#311b92"; g.fillRect(0, 0, 900, 900);
  const cx = 450, cy = 450;
  for (let i = 0; i < 24; i++) {
    const a1 = (i / 24) * Math.PI * 2, a2 = ((i + 0.5) / 24) * Math.PI * 2;
    g.fillStyle = i % 2 ? "#ff7043" : "#ffca28";
    g.beginPath(); g.moveTo(cx, cy);
    g.lineTo(cx + Math.cos(a1) * 640, cy + Math.sin(a1) * 640);
    g.lineTo(cx + Math.cos(a2) * 640, cy + Math.sin(a2) * 640);
    g.closePath(); g.fill();
  }
  g.fillStyle = "#fff8e1";
  g.beginPath(); g.arc(cx, cy, 185, 0, Math.PI * 2); g.fill();
  g.fillStyle = "#d84315";
  g.font = "bold 210px sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText("?!", cx, cy + 8);
  g.textAlign = "left"; g.textBaseline = "alphabetic";
  return c;
}

function drawMountain() {
  const c = makeCanvas(900, 900), g = c.getContext("2d");
  const sky = g.createLinearGradient(0, 0, 0, 900);
  sky.addColorStop(0, "#81d4fa"); sky.addColorStop(1, "#e1f5fe");
  g.fillStyle = sky; g.fillRect(0, 0, 900, 900);
  g.fillStyle = "#fff59d";
  g.beginPath(); g.arc(120, 120, 62, 0, Math.PI * 2); g.fill();
  const peak = (x, base, h, w, col) => {
    g.fillStyle = col;
    g.beginPath(); g.moveTo(x - w / 2, base); g.lineTo(x, base - h); g.lineTo(x + w / 2, base); g.closePath(); g.fill();
    g.fillStyle = "#ffffff";
    g.beginPath(); g.moveTo(x - w * 0.13, base - h * 0.76); g.lineTo(x, base - h);
    g.lineTo(x + w * 0.13, base - h * 0.76); g.lineTo(x + w * 0.05, base - h * 0.86);
    g.lineTo(x, base - h * 0.8); g.lineTo(x - w * 0.05, base - h * 0.86); g.closePath(); g.fill();
  };
  peak(200, 900, 430, 560, "#546e7a");
  peak(680, 900, 560, 700, "#37474f");
  peak(450, 900, 760, 760, "#263238");
  // flag on the main peak
  g.strokeStyle = "#000"; g.lineWidth = 7;
  g.beginPath(); g.moveTo(450, 140); g.lineTo(450, 66); g.stroke();
  g.fillStyle = "#e53935";
  g.beginPath(); g.moveTo(450, 66); g.lineTo(512, 82); g.lineTo(450, 100); g.closePath(); g.fill();
  g.fillStyle = "#a5d6a7"; g.fillRect(0, 856, 900, 44);
  return c;
}

const TEMPLATES = [
  { name: "Dramatic Cat", make: drawDramaticCat },
  { name: "Office Meltdown", make: drawOffice },
  { name: "Brain Explosion", make: drawExplosion },
  { name: "Mountain Summit", make: drawMountain },
];

/* ------------------------------------------------------------------ */
/* Remix pipeline                                                      */
/* ------------------------------------------------------------------ */

function processBase() {
  const src = state.base;
  const w = src.width, h = src.height;
  const out = makeCanvas(w, h);
  const g = out.getContext("2d");

  if (state.mode === "pixel") {
    const tiny = makeCanvas(Math.max(8, w / 14), Math.max(8, h / 14));
    tiny.getContext("2d").drawImage(src, 0, 0, tiny.width, tiny.height);
    g.imageSmoothingEnabled = false;
    g.drawImage(tiny, 0, 0, w, h);
    return out;
  }

  const filterByMode = {
    classic: "contrast(1.06) saturate(1.08)",
    deepfried: "contrast(1.55) saturate(2.3) brightness(1.08)",
    glitch: "contrast(1.12) saturate(1.25)",
    vintage: "sepia(0.55) contrast(1.05) brightness(0.96) saturate(0.85)",
  };
  try { g.filter = filterByMode[state.mode] || "none"; } catch (e) { /* older engines */ }
  g.drawImage(src, 0, 0);
  try { g.filter = "none"; } catch (e) { /* ignore */ }

  if (state.mode === "deepfried") {
    g.drawImage(out, 0, 0); // second pass cranks the filters' look via stacking
    g.globalAlpha = 0.16;
    for (let i = 0; i < 900; i++) {
      g.fillStyle = Math.random() > 0.5 ? "#000" : "#fff";
      g.fillRect(Math.random() * w, Math.random() * h, 2.4, 2.4);
    }
    g.globalAlpha = 1;
  }

  if (state.mode === "glitch") {
    const rows = 14;
    for (let i = 0; i < rows; i++) {
      if (Math.random() < 0.45) continue;
      const y = Math.floor((h / rows) * i);
      const hh = Math.ceil(h / rows);
      const dx = (Math.random() - 0.5) * w * 0.09;
      g.drawImage(out, 0, y, w, hh, dx, y, w, hh);
    }
    g.globalAlpha = 0.35; g.globalCompositeOperation = "screen";
    try { g.filter = "hue-rotate(90deg)"; } catch (e) { /* ignore */ }
    g.drawImage(out, 5, 0);
    try { g.filter = "hue-rotate(-90deg)"; } catch (e) { /* ignore */ }
    g.drawImage(out, -5, 0);
    g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
    try { g.filter = "none"; } catch (e) { /* ignore */ }
  }

  if (state.mode === "vintage") {
    const v = g.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.42, w / 2, h / 2, Math.max(w, h) * 0.75);
    v.addColorStop(0, "rgba(0,0,0,0)");
    v.addColorStop(1, "rgba(30,16,4,0.5)");
    g.fillStyle = v; g.fillRect(0, 0, w, h);
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Rendering + meme text                                               */
/* ------------------------------------------------------------------ */

function wrapLines(g, text, maxWidth) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    const trial = line ? line + " " + word : word;
    if (g.measureText(trial).width <= maxWidth || !line) line = trial;
    else { lines.push(line); line = word; }
  }
  if (line) lines.push(line);
  return lines;
}

function drawBlock(g, text, isTop) {
  const w = stage.width, h = stage.height;
  if (!text.trim()) return;
  const maxWidth = w * 0.94;
  let size = w * 0.092 * state.fontScale;
  let lines = [];
  while (size > 12) {
    g.font = `900 ${size}px Impact, "Arial Black", "Franklin Gothic Heavy", sans-serif`;
    lines = wrapLines(g, text.toUpperCase(), maxWidth);
    const widest = Math.max(...lines.map((l) => g.measureText(l).width));
    if (widest <= maxWidth && lines.length * size * 1.12 <= h * 0.42) break;
    size *= 0.92;
  }
  g.font = `900 ${size}px Impact, "Arial Black", "Franklin Gothic Heavy", sans-serif`;
  g.textAlign = "center";
  g.textBaseline = "top";
  g.lineJoin = "round";
  g.miterLimit = 2;
  g.strokeStyle = "#000";
  g.lineWidth = Math.max(0, size * state.outlineScale);
  g.fillStyle = "#fff";
  const lineHeight = size * 1.12;
  lines.forEach((line, i) => {
    const y = isTop ? h * 0.025 + i * lineHeight
                    : h * 0.975 - (lines.length - i) * lineHeight;
    if (g.lineWidth > 0) g.strokeText(line, w / 2, y);
    g.fillText(line, w / 2, y);
  });
}

function render() {
  if (!state.base) return;
  if (stage.width !== state.base.width || stage.height !== state.base.height) {
    stage.width = state.base.width;
    stage.height = state.base.height;
  }
  const processed = processBase();
  ctx.clearRect(0, 0, stage.width, stage.height);
  ctx.drawImage(processed, 0, 0);
  drawBlock(ctx, state.topText, true);
  drawBlock(ctx, state.bottomText, false);
}

function setBase(source, noteText) {
  state.base = source;
  render();
  if (noteText) setNote("imageNote", noteText, false);
}

function setNote(id, text, isError) {
  const el = $(id);
  el.textContent = text || "";
  el.classList.toggle("error", !!isError);
}

/* ------------------------------------------------------------------ */
/* Image sources                                                       */
/* ------------------------------------------------------------------ */

function loadFromFile(file) {
  if (!file || !file.type.startsWith("image/")) {
    setNote("imageNote", "That file is not an image.", true);
    return;
  }
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    const scale = Math.min(1, 1024 / Math.max(img.naturalWidth, img.naturalHeight));
    const c = makeCanvas(Math.round(img.naturalWidth * scale), Math.round(img.naturalHeight * scale));
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    URL.revokeObjectURL(url);
    markTemplateActive(-1);
    setBase(c, `Loaded your image (${c.width}×${c.height}).`);
  };
  img.onerror = () => setNote("imageNote", "Could not load that image file.", true);
  img.src = url;
}

function loadRandomPhoto() {
  const btn = $("randomPhotoBtn");
  btn.disabled = true;
  setNote("imageNote", "Fetching a random photo from Lorem Picsum…", false);
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    btn.disabled = false;
    markTemplateActive(-1);
    setBase(img, "Random photo loaded from picsum.photos.");
  };
  img.onerror = () => {
    btn.disabled = false;
    setNote("imageNote", "Picsum did not answer. Your current image is untouched.", true);
  };
  img.src = `https://picsum.photos/900/900?random=${Date.now()}`;
}

function markTemplateActive(index) {
  document.querySelectorAll("#templateRow button").forEach((b, i) => {
    b.classList.toggle("active", i === index);
  });
}

/* ------------------------------------------------------------------ */
/* Caption machine: local template engine (demo mode)                  */
/* ------------------------------------------------------------------ */

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function templateCaptions(topic) {
  const t = (topic || "").trim() || "monday";
  const T = t.toUpperCase();
  return [
    {
      voice: "Formal",
      top: pick([`OFFICIAL STATEMENT REGARDING ${T}`, `AFTER CAREFUL REVIEW OF ${T},`, `DEAR ALL, CONCERNING ${T}:`]),
      bottom: pick(["WE REGRET NOTHING.", "THE COMMITTEE HAS DECIDED TO NAP.", "PLEASE DIRECT ALL COMPLAINTS TO THE VOID.", "THIS CONCLUDES THE MEETING."]),
    },
    {
      voice: "Absurd",
      top: pick([`THE ${T} HAS ESCAPED CONTAINMENT`, `SCIENTISTS CONFIRM ${T} IS JUST THREE RACCOONS`, `NOBODY EXPECTED THE ${T} INQUISITION`]),
      bottom: pick(["SEND MORE SNACKS.", "IT NOW LIVES IN THE BREAK ROOM.", "THE MOON HAS DECLINED TO COMMENT.", "STEP ONE: PANIC. STEP TWO: ALSO PANIC."]),
    },
    {
      voice: "Indonesian Slang",
      top: pick([`PAS LAGI ${T} TIBA-TIBA`, `POV: ${T} DATANG TANPA ABA-ABA`, `MODAR LAH INI ${T}`]),
      bottom: pick(["AUTO NGAKAK SAMPAI LUPA MASALAH.", "GASKEUN AJA DULU, MIKIR BELAKANGAN.", "SANTUY, BESTIE. SEMUA AKAN BERLALU.", "YANG PENTING SUDAH USAHA, KATANYA."]),
    },
    {
      voice: "Motivational",
      top: pick([`THEY LAUGHED AT MY ${T}`, `EVERY EXPERT WAS ONCE BAD AT ${T}`, `YOUR ONLY LIMIT IS YOUR ${T}`]),
      bottom: pick(["SO I DID IT TWICE.", "TURN PAIN INTO WIFI PASSWORDS.", "PROVE THEM WRONG, THEN TAKE A NAP.", "DISCIPLINE BEATS MOTIVATION. AND SNACKS."]),
    },
  ];
}

/* ------------------------------------------------------------------ */
/* Caption machine: LLM API path (bring your own key)                  */
/* ------------------------------------------------------------------ */

const PROVIDERS = {
  groq: { url: "https://api.groq.com/openai/v1/chat/completions", label: "Groq" },
  openrouter: { url: "https://openrouter.ai/api/v1/chat/completions", label: "OpenRouter" },
};

function currentSettings() {
  return {
    provider: $("providerSelect").value,
    model: $("modelInput").value.trim(),
    key: $("apiKeyInput").value.trim(),
  };
}

async function apiCaptions(topic) {
  const { provider, model, key } = currentSettings();
  const p = PROVIDERS[provider];
  const prompt =
    `You write meme captions. Topic: "${(topic || "everyday life").trim()}". ` +
    `Return ONLY a JSON object like {"captions":[{"voice":"Formal","top":"...","bottom":"..."},` +
    `{"voice":"Absurd","top":"...","bottom":"..."},{"voice":"Indonesian Slang","top":"...","bottom":"..."},` +
    `{"voice":"Motivational","top":"...","bottom":"..."}]}. ` +
    `Exactly four captions, one per voice, in that order. Keep each line short, punchy, and in ALL CAPS. ` +
    `The Indonesian Slang one should mix casual Indonesian slang (words like gas, santuy, ngakak) with English. No explanations, JSON only.`;
  const res = await fetch(p.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: model || undefined,
      temperature: 1.05,
      messages: [
        { role: "system", content: "You are a meme caption generator that answers with JSON only." },
        { role: "user", content: prompt },
      ],
    }),
  });
  if (!res.ok) throw new Error(`${p.label} answered HTTP ${res.status}`);
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || "";
  const start = text.indexOf("{"), end = text.lastIndexOf("}");
  if (start < 0 || end < 0) throw new Error("The model did not return JSON");
  const parsed = JSON.parse(text.slice(start, end + 1));
  const list = (parsed.captions || []).filter((c) => c && (c.top || c.bottom)).slice(0, 6);
  if (!list.length) throw new Error("The model returned no usable captions");
  return list.map((c) => ({
    voice: String(c.voice || "AI"),
    top: String(c.top || "").toUpperCase(),
    bottom: String(c.bottom || "").toUpperCase(),
  }));
}

async function generateCaptions() {
  const btn = $("generateBtn");
  const topic = $("topicInput").value;
  const { key } = currentSettings();
  btn.disabled = true;
  try {
    if (key) {
      try {
        state.captions = await apiCaptions(topic);
        state.captionSource = `Captions by ${PROVIDERS[currentSettings().provider].label} (your key, model ${currentSettings().model || "default"}).`;
      } catch (err) {
        state.captions = templateCaptions(topic);
        state.captionSource = `The AI call failed (${err.message}), so these came from the local template engine instead.`;
      }
    } else {
      state.captions = templateCaptions(topic);
      state.captionSource = "Demo mode: captions by the local template engine. Add your own API key in the settings up top for live AI captions.";
    }
  } finally {
    btn.disabled = false;
  }
  setNote("captionSource", state.captionSource, false);
  renderCaptionCards();
}

function renderCaptionCards() {
  const list = $("captionList");
  list.innerHTML = "";
  state.captions.forEach((cap, i) => {
    const card = document.createElement("div");
    card.className = "caption-card";
    const voice = document.createElement("div");
    voice.className = "voice";
    voice.textContent = cap.voice;
    const lines = document.createElement("div");
    lines.className = "lines";
    lines.innerHTML = "";
    const topEl = document.createElement("div");
    topEl.textContent = cap.top || "—";
    const botEl = document.createElement("div");
    const em = document.createElement("em");
    em.textContent = cap.bottom || "—";
    botEl.appendChild(em);
    lines.append(topEl, botEl);
    const actions = document.createElement("div");
    actions.className = "card-actions";
    const useBtn = document.createElement("button");
    useBtn.textContent = "Use both";
    useBtn.onclick = () => applyCaption(cap.top, cap.bottom);
    const topBtn = document.createElement("button");
    topBtn.textContent = "Take top";
    topBtn.onclick = () => applyCaption(cap.top, null);
    const botBtn = document.createElement("button");
    botBtn.textContent = "Take bottom";
    botBtn.onclick = () => applyCaption(null, cap.bottom);
    actions.append(useBtn, topBtn, botBtn);
    card.append(voice, lines, actions);
    list.appendChild(card);
  });
}

function applyCaption(top, bottom) {
  if (top !== null && top !== undefined) {
    state.topText = top;
    $("topText").value = top;
  }
  if (bottom !== null && bottom !== undefined) {
    state.bottomText = bottom;
    $("bottomText").value = bottom;
  }
  render();
}

function randomMix() {
  if (state.captions.length < 2) {
    setNote("captionSource", "Generate captions first, then campur them.", true);
    return;
  }
  const a = pick(state.captions);
  let b = pick(state.captions);
  if (b === a) b = state.captions[(state.captions.indexOf(a) + 1) % state.captions.length];
  applyCaption(a.top, b.bottom);
  setNote("captionSource", `Campur result: top from “${a.voice}”, bottom from “${b.voice}”.`, false);
}

/* ------------------------------------------------------------------ */
/* Export + share                                                      */
/* ------------------------------------------------------------------ */

function canvasToPngBlob() {
  return new Promise((resolve, reject) => {
    try {
      stage.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("empty blob"))), "image/png");
    } catch (err) {
      reject(err);
    }
  });
}

async function downloadPng() {
  try {
    const blob = await canvasToPngBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mesin-meme-campur.png";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    setNote("exportNote", "PNG downloaded. Go forth and meme.", false);
  } catch (err) {
    setNote("exportNote", "Export failed: this image source blocks canvas export (CORS). Try a template or an upload instead.", true);
  }
}

async function sharePng() {
  try {
    const blob = await canvasToPngBlob();
    const file = new File([blob], "mesin-meme-campur.png", { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: "Mesin Meme Campur" });
      setNote("exportNote", "Shared.", false);
    } else {
      setNote("exportNote", "This browser cannot share files. Use Download PNG instead.", true);
    }
  } catch (err) {
    if (err && err.name === "AbortError") setNote("exportNote", "Share cancelled.", false);
    else setNote("exportNote", "Share failed here. Download PNG always works.", true);
  }
}

/* ------------------------------------------------------------------ */
/* Settings persistence (key only if the user opts in)                 */
/* ------------------------------------------------------------------ */

function restoreSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem("mmc-settings") || "{}");
    if (saved.provider) $("providerSelect").value = saved.provider;
    if (saved.model) $("modelInput").value = saved.model;
    if (saved.key) {
      $("apiKeyInput").value = saved.key;
      $("rememberKey").checked = true;
    }
  } catch (e) { /* fresh start */ }
  syncModelDefault(false);
}

function persistSettings() {
  const s = {
    provider: $("providerSelect").value,
    model: $("modelInput").value.trim(),
    key: $("rememberKey").checked ? $("apiKeyInput").value.trim() : "",
  };
  try { localStorage.setItem("mmc-settings", JSON.stringify(s)); } catch (e) { /* private mode */ }
}

const MODEL_DEFAULTS = { groq: "llama-3.3-70b-versatile", openrouter: "meta-llama/llama-3.3-70b-instruct:free" };
function syncModelDefault(reset) {
  const p = $("providerSelect").value;
  const current = $("modelInput").value.trim();
  const known = Object.values(MODEL_DEFAULTS);
  if (reset || !current || known.includes(current)) $("modelInput").value = MODEL_DEFAULTS[p];
}

/* ------------------------------------------------------------------ */
/* Wiring + init                                                       */
/* ------------------------------------------------------------------ */

function initTemplates() {
  const row = $("templateRow");
  TEMPLATES.forEach((tpl, i) => {
    const canvas = tpl.make();
    tpl.canvas = canvas;
    const btn = document.createElement("button");
    if (i === 0) btn.classList.add("active");
    const img = document.createElement("img");
    img.src = canvas.toDataURL("image/png");
    img.alt = tpl.name;
    const span = document.createElement("span");
    span.textContent = tpl.name;
    btn.append(img, span);
    btn.onclick = () => {
      markTemplateActive(i);
      setBase(tpl.canvas, `Template: ${tpl.name}.`);
    };
    row.appendChild(btn);
  });
  state.base = TEMPLATES[0].canvas;
}

function init() {
  initTemplates();
  restoreSettings();

  state.topText = "WHEN THE MACHINE SAYS";
  state.bottomText = "ONE MORE MEME";
  $("topText").value = state.topText;
  $("bottomText").value = state.bottomText;
  render();

  $("uploadInput").addEventListener("change", (e) => loadFromFile(e.target.files[0]));
  $("randomPhotoBtn").addEventListener("click", loadRandomPhoto);

  stage.addEventListener("dragover", (e) => { e.preventDefault(); stage.classList.add("dragover"); });
  stage.addEventListener("dragleave", () => stage.classList.remove("dragover"));
  stage.addEventListener("drop", (e) => {
    e.preventDefault();
    stage.classList.remove("dragover");
    loadFromFile(e.dataTransfer.files[0]);
  });

  document.querySelectorAll("#modeRow .mode").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#modeRow .mode").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.mode = btn.dataset.mode;
      render();
    });
  });

  $("generateBtn").addEventListener("click", generateCaptions);
  $("mixBtn").addEventListener("click", randomMix);
  $("downloadBtn").addEventListener("click", downloadPng);
  $("shareBtn").addEventListener("click", sharePng);

  $("topText").addEventListener("input", (e) => { state.topText = e.target.value; render(); });
  $("bottomText").addEventListener("input", (e) => { state.bottomText = e.target.value; render(); });
  $("fontSize").addEventListener("input", (e) => { state.fontScale = e.target.value / 100; render(); });
  $("outlineSize").addEventListener("input", (e) => { state.outlineScale = e.target.value / 100; render(); });

  $("providerSelect").addEventListener("change", () => { syncModelDefault(true); persistSettings(); });
  $("modelInput").addEventListener("change", persistSettings);
  $("apiKeyInput").addEventListener("change", persistSettings);
  $("rememberKey").addEventListener("change", persistSettings);
}

init();
