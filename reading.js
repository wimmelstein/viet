// ─────────────────────────────────────────────
// reading.js — Reading page logic
// Requires data.js, store.js, readings.js
// ─────────────────────────────────────────────

// ── STATE ────────────────────────────────────
const rState = {
  currentReading: null,
  showTranslation: true,
  shadowMode: false,
  shadowIdx: -1,
  shadowTimer: null,
  speaking: false,
  speed: 0.8,
  reviewQueue: [],
  reviewIdx: 0,
  reviewRevealed: false,
  studentLessons: 32,  // default: show all
};

// ── TTS ───────────────────────────────────────
const synth = window.speechSynthesis;
let viVoice = null;

function initVoices() {
  const voices = synth.getVoices();
  viVoice = voices.find(v => v.lang === 'vi-VN' || v.lang.startsWith('vi'))
            || voices.find(v => v.lang.startsWith('zh')) // fallback: Mandarin is tonally similar
            || null;

  const notice = document.getElementById('r-tts-notice');
  if (notice) {
    if (viVoice) {
      notice.textContent = `🔊 Audio: ${viVoice.name} (${viVoice.lang})`;
      notice.classList.add('show');
    } else {
      notice.textContent = '⚠️ No Vietnamese voice found on this device. Audio will still work but may not sound like Vietnamese.';
      notice.classList.add('show');
    }
  }
}

if (synth.onvoiceschanged !== undefined) synth.onvoiceschanged = initVoices;
initVoices();

function speak(text, onEnd) {
  synth.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'vi-VN';
  utt.rate = rState.speed;
  if (viVoice) utt.voice = viVoice;
  if (onEnd) utt.onend = onEnd;
  synth.speak(utt);
}

function stopSpeaking() {
  synth.cancel();
  rState.speaking = false;
  document.querySelectorAll('.r-speak-btn').forEach(b => b.classList.remove('speaking'));
  document.getElementById('btn-read-all')?.classList.remove('playing');
}

// ── LOAD STUDENT LEVEL ────────────────────────
function getStudentLevel() {
  const id = getActiveId();
  if (id) {
    const s = getStudent(id);
    if (s) return s.lessons;
  }
  // guest: check localStorage
  return parseInt(localStorage.getItem('vn-lessons') || '32');
}

// ── BUILD TEXT LIST ───────────────────────────
function buildTextList() {
  const studentLevel = rState.studentLessons;
  const list = document.getElementById('r-text-list');
  list.innerHTML = '';

  // Use store readings if seeded, fall back to built-in READINGS
  const storeReadings = loadCustomReadings().map(r => ({
    ...r, sentences: r.sentences || [], tokens: [],
  }));
  const all = (storeReadings.length > 0 ? storeReadings : READINGS)
    .sort((a, b) => a.level - b.level);

  all.forEach(reading => {
    const locked = reading.level > studentLevel;
    const active = rState.currentReading?.id === reading.id;

    const card = document.createElement('button');
    card.className = `r-list-card ${active ? 'active' : ''} ${locked ? 'locked' : ''}`;
    card.disabled = locked;
    card.innerHTML = `
      <div class="r-card-title">${reading.title}</div>
      <div class="r-card-sub">${reading.subtitle}</div>
      <div class="r-card-meta">
        <span class="r-badge r-badge-type">${reading.type}</span>
        <span class="r-badge ${locked ? 'r-badge-locked' : 'r-badge-level'}">L${reading.level}${locked ? ' 🔒' : ''}</span>
        <span class="r-card-duration">~${reading.duration} min</span>
      </div>`;

    if (!locked) {
      card.addEventListener('click', () => loadReading(reading));
    }
    list.appendChild(card);
  });
}

// ── LOAD A READING ────────────────────────────
function loadReading(reading) {
  rState.currentReading = reading;
  stopSpeaking();
  stopShadow();

  document.getElementById('r-empty').style.display = 'none';
  document.getElementById('r-panel').style.display = 'block';

  // Update sidebar highlight
  buildTextList();

  // Header
  document.getElementById('rp-type').textContent     = reading.type;
  document.getElementById('rp-type').className       = 'r-badge r-type-badge r-badge-type';
  document.getElementById('rp-level').textContent    = `Lesson ${reading.level}`;
  document.getElementById('rp-level').className      = 'r-badge r-level-badge r-badge-level';
  document.getElementById('rp-duration').textContent = `~${reading.duration} min read`;
  document.getElementById('rp-title').textContent    = reading.title;
  document.getElementById('rp-subtitle').textContent = reading.subtitle;
  document.getElementById('rp-intro').textContent    = reading.intro;

  // Grammar legend — collect which grammar types appear
  const usedTypes = new Set();
  reading.sentences.forEach(s => (s.tokens || []).forEach(t => usedTypes.add(t.grammar)));
  const legend = document.getElementById('r-legend');
  legend.innerHTML = [...usedTypes].map(key => {
    const cfg = GRAMMAR_COLOURS[key];
    if (!cfg) return '';
    return `<span class="r-legend-item" style="color:${cfg.colour};border-color:${cfg.colour};background:${cfg.colour}18">
      ${cfg.label}
    </span>`;
  }).join('');

  // Render text
  renderText(reading);

  // Vocab chips
  renderVocabChips(reading);

  // Mini review
  setupReview(reading);

  // Scroll to top of main
  document.getElementById('r-main').scrollTo({ top: 0, behavior: 'smooth' });
}

// ── RENDER TEXT ───────────────────────────────
function renderText(reading) {
  const body = document.getElementById('r-text-body');
  body.innerHTML = '';

  reading.sentences.forEach((sentence, idx) => {
    const wrap = document.createElement('div');
    wrap.className = 'r-sentence-wrap';
    wrap.dataset.idx = idx;

    // Build annotated Vietnamese text
    const vnDiv = document.createElement('div');
    vnDiv.className = 'r-vn';
    vnDiv.appendChild(buildAnnotatedVn(sentence));

    // Speaker button for this sentence
    const speakBtn = document.createElement('button');
    speakBtn.className = 'r-speak-btn';
    speakBtn.textContent = '🔊';
    speakBtn.title = 'Speak this sentence';
    speakBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = speakBtn.classList.contains('speaking');
      stopSpeaking();
      if (!isActive) {
        speakBtn.classList.add('speaking');
        speak(sentence.vn, () => speakBtn.classList.remove('speaking'));
      }
    });
    vnDiv.appendChild(speakBtn);

    // Translation
    const enDiv = document.createElement('div');
    enDiv.className = `r-en ${rState.showTranslation ? '' : 'hidden'}`;
    enDiv.textContent = sentence.en;

    // Click sentence to speak
    wrap.addEventListener('click', (e) => {
      if (e.target.closest('.r-gram') || e.target.closest('.r-speak-btn') || e.target.closest('.r-word')) return;
      stopSpeaking();
      const btn = wrap.querySelector('.r-speak-btn');
      if (btn) btn.classList.add('speaking');
      speak(sentence.vn, () => btn?.classList.remove('speaking'));
    });

    wrap.appendChild(vnDiv);
    wrap.appendChild(enDiv);
    body.appendChild(wrap);
  });
}

function buildAnnotatedVn(sentence) {
  const frag = document.createDocumentFragment();
  const tokens = sentence.tokens || [];

  // Build a map: substring → token
  const tokenMap = {};
  tokens.forEach(t => { tokenMap[t.w] = t; });

  // Tokenise the Vietnamese string into annotated and plain spans
  // We do a greedy left-to-right search for token strings
  let remaining = sentence.vn;

  while (remaining.length > 0) {
    // Find the earliest matching token
    let bestIdx = Infinity, bestToken = null;
    for (const [phrase, token] of Object.entries(tokenMap)) {
      const idx = remaining.indexOf(phrase);
      if (idx !== -1 && idx < bestIdx) {
        bestIdx = idx;
        bestToken = token;
        bestToken._phrase = phrase;
      }
    }

    if (!bestToken || bestIdx === Infinity) {
      // No more tokens — render rest as plain clickable words
      appendWords(frag, remaining);
      break;
    }

    // Render text before token
    if (bestIdx > 0) {
      appendWords(frag, remaining.slice(0, bestIdx));
    }

    // Render the token
    const cfg = GRAMMAR_COLOURS[bestToken.grammar] || { colour: '#666', label: '' };
    const span = document.createElement('span');
    span.className = 'r-gram';
    span.textContent = bestToken._phrase;
    span.style.color          = cfg.colour;
    span.style.borderColor    = cfg.colour;
    span.style.backgroundColor= cfg.colour + '18';
    span.dataset.tip   = bestToken.tip;
    span.dataset.label = cfg.label;
    span.dataset.word  = bestToken._phrase;

    span.addEventListener('click', (e) => {
      e.stopPropagation();
      showTooltip(e, bestToken.tip, cfg.label, cfg.colour);
      speak(bestToken._phrase);
    });
    span.addEventListener('mouseleave', hideTooltip);

    frag.appendChild(span);
    remaining = remaining.slice(bestIdx + bestToken._phrase.length);
  }

  return frag;
}

function appendWords(frag, text) {
  // Split text into word-ish tokens preserving spaces and punctuation
  const parts = text.split(/(\s+|[,\.!?:;"()«»…—]+)/);
  parts.forEach(part => {
    if (!part) return;
    if (/^\s+$/.test(part) || /^[,\.!?:;"()«»…—]+$/.test(part)) {
      frag.appendChild(document.createTextNode(part));
    } else {
      const span = document.createElement('span');
      span.className = 'r-word';
      span.textContent = part;
      span.title = 'Tap to hear';
      span.addEventListener('click', (e) => {
        e.stopPropagation();
        speak(part);
      });
      frag.appendChild(span);
    }
  });
}

// ── TOOLTIP ───────────────────────────────────
function showTooltip(e, tip, label, colour) {
  const tt = document.getElementById('r-tooltip');
  tt.innerHTML = `<div class="r-tooltip-label" style="color:${colour || '#aaa'}">${label || 'Grammar'}</div>${tip}`;
  tt.classList.add('show');

  const rect = e.target.getBoundingClientRect();
  let top  = rect.bottom + window.scrollY + 8;
  let left = rect.left + window.scrollX;

  // Keep within viewport
  const ttW = 260;
  if (left + ttW > window.innerWidth - 16) left = window.innerWidth - ttW - 16;
  if (top + 120 > window.innerHeight + window.scrollY) top = rect.top + window.scrollY - 120;

  tt.style.top  = top + 'px';
  tt.style.left = left + 'px';
}

function hideTooltip() {
  document.getElementById('r-tooltip').classList.remove('show');
}
document.addEventListener('click', hideTooltip);

// ── TRANSLATION TOGGLE ────────────────────────
function toggleTranslation() {
  rState.showTranslation = !rState.showTranslation;
  document.querySelectorAll('.r-en').forEach(el => {
    el.classList.toggle('hidden', !rState.showTranslation);
  });
  const btn = document.getElementById('btn-show-trans');
  btn.classList.toggle('active', rState.showTranslation);
}

// ── SHADOW MODE ───────────────────────────────
// Auto-advances sentence by sentence, speaking each one,
// highlighting the active sentence. Pause between sentences.
function toggleShadow() {
  if (rState.shadowMode) {
    stopShadow();
  } else {
    startShadow();
  }
}

function startShadow() {
  if (!rState.currentReading) return;
  rState.shadowMode = true;
  rState.shadowIdx  = 0;
  document.getElementById('btn-shadow').classList.add('active');
  document.getElementById('btn-shadow').textContent = '⏹ Stop';
  shadowStep();
}

function stopShadow() {
  rState.shadowMode = false;
  clearTimeout(rState.shadowTimer);
  synth.cancel();
  document.querySelectorAll('.r-sentence-wrap').forEach(el => el.classList.remove('shadow-active'));
  const btn = document.getElementById('btn-shadow');
  if (btn) { btn.classList.remove('active'); btn.textContent = '▶ Shadow'; }
}

function shadowStep() {
  if (!rState.shadowMode) return;
  const sentences = rState.currentReading.sentences;
  if (rState.shadowIdx >= sentences.length) { stopShadow(); return; }

  // Highlight current sentence
  document.querySelectorAll('.r-sentence-wrap').forEach((el, i) => {
    el.classList.toggle('shadow-active', i === rState.shadowIdx);
    if (i === rState.shadowIdx) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  const sentence = sentences[rState.shadowIdx];
  speak(sentence.vn, () => {
    rState.shadowIdx++;
    rState.shadowTimer = setTimeout(shadowStep, 900);
  });
}

// ── READ ALL ──────────────────────────────────
function readAll() {
  if (!rState.currentReading) return;
  const btn = document.getElementById('btn-read-all');
  if (btn.classList.contains('playing')) { stopSpeaking(); return; }

  btn.classList.add('playing');
  btn.textContent = '⏹ Stop';
  const fullText = rState.currentReading.sentences.map(s => s.vn).join('。');
  speak(fullText, () => {
    btn.classList.remove('playing');
    btn.textContent = '🔊 Read all';
  });
}

// ── VOCAB CHIPS ───────────────────────────────
function renderVocabChips(reading) {
  const container = document.getElementById('r-vocab-chips');

  // Collect all unique annotated tokens
  const seen = new Set();
  const words = [];
  reading.sentences.forEach(s => {
    (s.tokens || []).forEach(t => {
      if (!seen.has(t.w)) {
        seen.add(t.w);
        words.push(t);
      }
    });
  });

  // Also add explicit vocab list from reading definition
  (reading.vocab || []).forEach(v => {
    if (!seen.has(v)) {
      seen.add(v);
      words.push({ w: v, grammar: 'vocab', tip: '' });
    }
  });

  container.innerHTML = words.map(t => `
    <button class="r-vocab-chip" data-word="${t.w}" data-tip="${t.tip || ''}">
      <span>${t.w}</span>
      <span class="chip-audio">🔊</span>
    </button>`).join('');

  container.querySelectorAll('.r-vocab-chip').forEach(chip => {
    chip.addEventListener('click', () => speak(chip.dataset.word));
  });
}

// ── MINI REVIEW ───────────────────────────────
function setupReview(reading) {
  // Build review queue from annotated tokens
  const seen = new Set();
  const queue = [];
  reading.sentences.forEach(s => {
    (s.tokens || []).forEach(t => {
      if (!seen.has(t.w) && t.tip) {
        seen.add(t.w);
        queue.push({ viet: t.w, eng: t.tip, note: GRAMMAR_COLOURS[t.grammar]?.label || '' });
      }
    });
  });
  // Add vocab list items where we can match them to ALL_VOCAB
  (reading.vocab || []).forEach(v => {
    if (!seen.has(v)) {
      const match = ALL_VOCAB.find(w => w.v === v || w.v.includes(v));
      if (match) {
        seen.add(v);
        queue.push({ viet: v, eng: match.e, note: match.n || '' });
      }
    }
  });

  rState.reviewQueue    = queue.sort(() => Math.random() - 0.5);
  rState.reviewIdx      = 0;
  rState.reviewRevealed = false;
  renderReviewCard();
}

function renderReviewCard() {
  const section = document.getElementById('r-review-section');
  const card    = document.getElementById('r-mini-card');
  const btnReveal = document.getElementById('rmb-reveal');
  const btnGood   = document.getElementById('rmb-good');
  const btnAgain  = document.getElementById('rmb-again');

  if (rState.reviewQueue.length === 0) {
    section.style.display = 'none';
    return;
  }
  section.style.display = 'block';

  if (rState.reviewIdx >= rState.reviewQueue.length) {
    card.innerHTML = `<div class="r-review-done">✅ All ${rState.reviewQueue.length} words reviewed!</div>`;
    btnReveal.style.display = 'none';
    btnGood.style.display = 'none';
    btnAgain.style.display = 'none';
    return;
  }

  const item = rState.reviewQueue[rState.reviewIdx];

  if (!rState.reviewRevealed) {
    card.innerHTML = `
      <div class="r-mini-viet">${item.viet}</div>
      <div class="r-mini-prompt">What does this mean?</div>`;
    btnReveal.style.display = '';
    btnGood.style.display = 'none';
  } else {
    card.innerHTML = `
      <div class="r-mini-viet" style="color:var(--red)">${item.viet}</div>
      <div class="r-mini-eng">${item.eng}</div>
      ${item.note ? `<div class="r-mini-note">${item.note}</div>` : ''}`;
    btnReveal.style.display = 'none';
    btnGood.style.display = '';
  }
}

// ── WIRE UP ───────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  rState.studentLessons = getStudentLevel();

  // Update nav badge
  const badge = document.getElementById('nav-level-badge');
  if (badge) {
    const id = getActiveId();
    if (id) {
      const s = getStudent(id);
      if (s) badge.textContent = `${s.name} · L${s.lessons}`;
    } else {
      badge.textContent = `L${rState.studentLessons}`;
    }
  }

  // Set the level selector to match the student's current level,
  // snapping to the nearest option value
  const levelFilter = document.getElementById('level-filter');
  const optionValues = [...levelFilter.options].map(o => parseInt(o.value));
  const best = optionValues.reduce((prev, cur) =>
    Math.abs(cur - rState.studentLessons) < Math.abs(prev - rState.studentLessons) ? cur : prev
  );
  levelFilter.value = best;

  // Build text list
  buildTextList();

  // Level filter — changes the unlocked level for this session
  levelFilter.addEventListener('change', function() {
    rState.studentLessons = parseInt(this.value);
    buildTextList();
    // If current reading is now locked, clear it
    if (rState.currentReading && rState.currentReading.level > rState.studentLessons) {
      rState.currentReading = null;
      document.getElementById('r-empty').style.display = '';
      document.getElementById('r-panel').style.display = 'none';
    }
  });

  // Toolbar buttons
  document.getElementById('btn-shadow').addEventListener('click', toggleShadow);
  document.getElementById('btn-read-all').addEventListener('click', readAll);
  document.getElementById('btn-show-trans').addEventListener('click', toggleTranslation);

  // Speed slider
  const speedSlider = document.getElementById('speed-slider');
  const speedVal    = document.getElementById('speed-val');
  speedSlider.addEventListener('input', () => {
    rState.speed = parseFloat(speedSlider.value);
    speedVal.textContent = rState.speed.toFixed(1) + '×';
  });

  // Mini review buttons
  document.getElementById('rmb-reveal').addEventListener('click', () => {
    rState.reviewRevealed = true;
    renderReviewCard();
    speak(rState.reviewQueue[rState.reviewIdx]?.viet || '');
  });
  document.getElementById('rmb-good').addEventListener('click', () => {
    rState.reviewIdx++;
    rState.reviewRevealed = false;
    renderReviewCard();
  });
  document.getElementById('rmb-again').addEventListener('click', () => {
    if (!rState.reviewRevealed) {
      // Haven't revealed yet — just speak it
      speak(rState.reviewQueue[rState.reviewIdx]?.viet || '');
      return;
    }
    // Move current card to a later position
    const q = rState.reviewQueue;
    const card = q.splice(rState.reviewIdx, 1)[0];
    const insertAt = Math.min(rState.reviewIdx + 2, q.length);
    q.splice(insertAt, 0, card);
    rState.reviewRevealed = false;
    renderReviewCard();
  });

  // Auto-load first unlocked reading if there is one
  const first = READINGS.find(r => r.level <= rState.studentLessons);
  if (first) loadReading(first);
});
