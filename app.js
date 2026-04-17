// ─────────────────────────────────────────────
// app.js — Vietnamese Study App
// Requires data.js and store.js to be loaded first
// ─────────────────────────────────────────────

// ── STATE ────────────────────────────────────
const state = {
  studentId:   null,
  known:       new Set(),
  qScore:      0,
  qTotal:      0,
  streak:      0,
  lessons:     0,
  deck:        'Greetings',
  deckCards:   [],
  deckIdx:     0,
  revealed:    false,
  reverseMode: false,
  quizMode:    'mc',
  currentQ:    null,
  vocabCat:    'All',
  dirty:       false,  // true only after user changes something this session
};

// ── Load state from API response ─────────────
function loadStateFromSession(data) {
  state.known    = new Set(data.known || []);
  state.qScore   = data.q_score  || 0;
  state.qTotal   = data.q_total  || 0;
  state.streak   = data.streak   || 0;
  state.lessons  = data.lessons  || 5;
}

// ── Debounced save to server ──────────────────
function persist() {
  if (isViewAs()) return; // read-only in view-as mode
  // scheduleSync is defined in auth.js
  if (typeof scheduleSync === 'function' && state.dirty) scheduleSync();
}

// Call this whenever the user does something that changes progress
function markDirty() {
  state.dirty = true;
}

// ── LESSON FILTERING ─────────────────────────
// Returns the maxLesson ceiling for the current lesson count.
function maxLesson() {
  const profile = [...LESSON_PROFILES]
    .reverse()
    .find(p => state.lessons >= p.lessons);
  return profile ? profile.maxLesson : 2; // default: lesson 2 minimum
}

// Filtered flat vocab pool — everything in the custom store up to current lesson
// (built-in cards were seeded into the store on first load)
function vocabPool() {
  const ml = maxLesson();
  // Cards from the store
  const storeCards = loadCustomCards()
    .filter(c => (c.lesson || 1) <= ml)
    .map(c => ({ v: c.viet, e: c.eng, n: c.note || '', cat: c.deck, lesson: c.lesson }));
  // Fall back to ALL_VOCAB if store hasn't been seeded yet (e.g. student app before teacher visit)
  if (storeCards.length > 0) return storeCards;
  return ALL_VOCAB.filter(w => (w.lesson || 1) <= ml);
}

// Filtered deck cards
function filteredDeck(name) {
  const ml = maxLesson();
  const storeCards = loadCustomCards()
    .filter(c => c.deck === name && (c.lesson || 1) <= ml)
    .map(c => ({ v: c.viet, e: c.eng, n: c.note || '', lesson: c.lesson }));
  if (storeCards.length > 0) return storeCards;
  return (DECKS[name] || []).filter(w => (w.lesson || 1) <= ml);
}

// Filtered open questions — from store with fallback to built-in
function filteredOpenQuestions() {
  const ml = maxLesson();
  const storeQ = loadCustomQuestions().filter(q => (q.lesson || 1) <= ml);
  if (storeQ.length > 0) return storeQ;
  return OPEN_QUESTIONS.filter(q => (q.lesson || 1) <= ml);
}

// Active profile label
function profileLabel() {
  const profile = [...LESSON_PROFILES]
    .reverse()
    .find(p => state.lessons >= p.lessons);
  return profile ? profile.label : 'Lessons 1–2';
}

// ── MODAL ────────────────────────────────────
function showModal() {
  document.getElementById('lesson-modal').classList.add('visible');
  buildSlider();
}

function hideModal() {
  document.getElementById('lesson-modal').classList.remove('visible');
}

function buildSlider() {
  const slider = document.getElementById('lesson-slider');
  const display = document.getElementById('lesson-display');
  const desc    = document.getElementById('lesson-desc');

  const current = state.lessons || 5;
  slider.value = current;
  updateSliderDisplay(current);

  slider.addEventListener('input', () => {
    updateSliderDisplay(parseInt(slider.value));
  });
}

function updateSliderDisplay(val) {
  const display = document.getElementById('lesson-display');
  const desc    = document.getElementById('lesson-desc');
  const profile = [...LESSON_PROFILES].reverse().find(p => val >= p.lessons)
                  || LESSON_PROFILES[0];

  display.textContent = val === 1 ? 'Lesson 1' : `Lessons 1–${val}`;

  const wordCount = ALL_VOCAB.filter(w => (w.lesson || 1) <= profile.maxLesson).length;
  const qCount    = OPEN_QUESTIONS.filter(q => (q.lesson || 1) <= profile.maxLesson).length;
  desc.innerHTML  = `<strong>${profile.desc}</strong><br>
    <span>${wordCount} words &amp; phrases unlocked · ${qCount} open questions</span>`;
}

function confirmLessons() {
  const val = parseInt(document.getElementById('lesson-slider').value);
  state.lessons = val;
  persist();
  hideModal();
  initApp();
}

// ── NAV ──────────────────────────────────────
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  const order = ['home','flashcards','quiz','vocab','grammar','tones'];
  const navBtns = document.querySelectorAll('.nav-btn');
  const idx = order.indexOf(id);
  if (idx >= 0) navBtns[idx].classList.add('active');
  refreshHomeStats();
}

function refreshHomeStats() {
  const forwardKnown = [...state.known].filter(k => k.startsWith('v:')).length;
  // Also count old-style unprefixed keys for backwards compatibility
  const legacyKnown  = [...state.known].filter(k => !k.startsWith('v:') && !k.startsWith('r:')).length;
  document.getElementById('stat-known').textContent  = forwardKnown + legacyKnown;
  document.getElementById('stat-streak').textContent = state.streak;
  const pct = state.qTotal > 0 ? Math.round(state.qScore / state.qTotal * 100) + '%' : '—';
  document.getElementById('stat-pct').textContent = pct;
}

// ── FLASHCARDS ────────────────────────────────

function buildDeckRow() {
  const row = document.getElementById('deck-row');
  row.innerHTML = '';
  Object.keys(DECKS).forEach(name => {
    const count = filteredDeck(name).length;
    if (count === 0) return; // hide decks with no unlocked cards
    const btn = document.createElement('button');
    btn.className = 'deck-chip' + (name === state.deck ? ' active' : '');
    btn.textContent = `${name} (${count})`;
    btn.addEventListener('click', () => {
      state.deck = name;
      document.querySelectorAll('.deck-chip').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      loadDeck(name);
    });
    row.appendChild(btn);
  });
  // If current deck got hidden, switch to first available
  if (filteredDeck(state.deck).length === 0) {
    const firstAvailable = Object.keys(DECKS).find(n => filteredDeck(n).length > 0);
    if (firstAvailable) state.deck = firstAvailable;
  }
}

function loadDeck(name) {
  const cards = filteredDeck(name);
  if (state.reverseMode) {
    // Mix both directions randomly
    const forward = cards.map(c => ({ ...c, dir: 'vn' }));
    const reverse = cards.map(c => ({ ...c, dir: 'en' }));
    state.deckCards = [...forward, ...reverse].sort(() => Math.random() - 0.5);
  } else {
    state.deckCards = cards.map(c => ({ ...c, dir: 'vn' }));
  }
  state.deckIdx  = 0;
  state.revealed = false;
  renderCard();
}

function shuffleDeck() {
  state.deckCards = state.deckCards.sort(() => Math.random() - 0.5);
  state.deckIdx   = 0;
  state.revealed  = false;
  renderCard();
}

// Known key for a card — direction-aware
function knownKey(card) {
  return (card.dir === 'en' ? 'r:' : 'v:') + card.v;
}

// Count cards known in BOTH directions
function fullyKnownCount() {
  const cards = filteredDeck(state.deck);
  return cards.filter(c =>
    state.known.has('v:' + c.v) && state.known.has('r:' + c.v)
  ).length;
}

// TTS helper for speaking Vietnamese
function speakVietnamese(text) {
  const synth = window.speechSynthesis;
  synth.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'vi-VN';
  utt.rate = 0.85;
  const voices = synth.getVoices();
  const vi = voices.find(v => v.lang === 'vi-VN' || v.lang.startsWith('vi'));
  if (vi) utt.voice = vi;
  synth.speak(utt);
}

function renderCard() {
  const card  = state.deckCards[state.deckIdx];
  const body  = document.getElementById('card-body');
  const total = state.deckCards.length;
  const idx   = state.deckIdx;
  const isReverse = card.dir === 'en';
  const key   = knownKey(card);
  const alreadyKnown = state.known.has(key);

  // counter & progress
  document.getElementById('card-counter').textContent = `${idx + 1} / ${total}`;
  document.getElementById('card-progress-fill').style.width = `${(idx / total) * 100}%`;

  const fk = fullyKnownCount();
  const deckTotal = filteredDeck(state.deck).length;
  document.getElementById('known-count').textContent =
    state.reverseMode
      ? `${fk} / ${deckTotal} fully known`
      : `${[...state.known].filter(k => k.startsWith('v:')).length} known`;

  if (!state.revealed) {
    body.className = 'card-body card-state-front' + (isReverse ? ' card-reverse' : '');
    body.innerHTML = `
      <div class="card-category">${state.deck}${isReverse ? ' <span class="card-dir-badge">EN → VN</span>' : ''}</div>
      <div class="card-viet" style="${isReverse ? 'color:var(--navy)' : ''}">${isReverse ? card.e : card.v}</div>
      ${card.n && !isReverse ? `<div class="card-sub">${card.n}</div>` : ''}
      <button class="card-reveal-btn" id="btn-reveal">Show answer</button>`;
    document.getElementById('btn-reveal').addEventListener('click', revealCard);
  } else {
    body.className = 'card-body card-state-revealed';
    // If reverse card: show Vietnamese as the answer and speak it
    body.innerHTML = `
      <div class="card-viet" style="${isReverse ? '' : 'color:var(--red)'}">${isReverse ? card.v : card.v}</div>
      <div class="card-eng">${isReverse ? card.e : card.e}</div>
      ${card.n ? `<div class="card-note">${card.n}</div>` : ''}
      <div class="card-mark-row">
        <button class="mark-btn again"  id="btn-again">↩ Study again</button>
        <button class="mark-btn got-it" id="btn-gotit">✓ Got it</button>
      </div>`;

    // Auto-speak Vietnamese when a reverse card is revealed
    if (isReverse) speakVietnamese(card.v);

    document.getElementById('btn-again').addEventListener('click', markAgain);
    document.getElementById('btn-gotit').addEventListener('click', markGotIt);
  }
}

function revealCard() {
  state.revealed = true;
  renderCard();
}

function markAgain() {
  const [card] = state.deckCards.splice(state.deckIdx, 1);
  const insertAt = Math.min(
    state.deckIdx + 2 + Math.floor(Math.random() * 3),
    state.deckCards.length
  );
  state.deckCards.splice(insertAt, 0, card);
  state.revealed = false;
  renderCard();
}

function markGotIt() {
  const card = state.deckCards[state.deckIdx];
  state.known.add(knownKey(card));
  markDirty();
  persist();
  state.deckIdx++;
  if (state.deckIdx >= state.deckCards.length) state.deckIdx = 0;
  state.revealed = false;
  renderCard();
  refreshHomeStats();
}

// ── QUIZ ─────────────────────────────────────

// ── DISTRACTOR BUILDER ────────────────────────
// Uses the handcrafted DISTRACTORS map when available;
// falls back to semantically similar words from the same
// category, then random pool picks.
function buildDistractors(q, pool) {  const targeted = DISTRACTORS[q.v];
  let wrongs;

  if (targeted && targeted.length >= 3) {
    // Use curated distractors
    wrongs = targeted.slice(0, 3).map(d => ({
      text: d.v,
      correct: false,
      why: d.why,
    }));
  } else {
    // Fallback 1: same category, different word
    const sameCat = pool.filter(w => w !== q && w.v !== q.v && w.cat === q.cat);
    const diffCat = pool.filter(w => w !== q && w.v !== q.v && w.cat !== q.cat);
    const candidates = [
      ...sameCat.sort(() => Math.random() - 0.5).slice(0, 2),
      ...diffCat.sort(() => Math.random() - 0.5).slice(0, 1),
    ].slice(0, 3);
    wrongs = candidates.map(w => ({ text: w.v, correct: false, why: '' }));
  }

  return [
    { text: q.v, correct: true, why: '' },
    ...wrongs,
  ].sort(() => Math.random() - 0.5);
}

function escAttr(s) {
  return s.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function setQuizMode(mode) {
  state.quizMode = mode;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
  renderQuiz();
}

function updateQuizScore() {
  document.getElementById('q-score-display').textContent =
    `${state.qScore} / ${state.qTotal}`;
}

function renderQuiz() {
  updateQuizScore();
  const area = document.getElementById('quiz-area');

  if (state.quizMode === 'open') {
    renderOpenQuestion(area);
    return;
  }

  const pool = vocabPool();
  if (pool.length < 4) {
    area.innerHTML = `<div class="quiz-card" style="text-align:center;padding:3rem 1.5rem">
      <p style="color:var(--ink-soft)">Not enough words unlocked for a quiz yet.<br>
      <button class="ghost-btn" onclick="showModal()" style="margin-top:1rem">Update lesson count</button></p>
    </div>`;
    return;
  }

  const q = pool[Math.floor(Math.random() * pool.length)];
  state.currentQ = q;

  const isReverse = state.quizMode === 'mc'; // mc: EN → VN; type: VN → EN
  // We'll do: mc = show English, pick Vietnamese answer
  //           type = show Vietnamese, type English answer

  const prompt = state.quizMode === 'mc' ? q.e : q.v;
  const answer = state.quizMode === 'mc' ? q.v : q.e;
  const sub    = q.n || '';

  let html = `<div class="quiz-card">
    <div class="q-label">${state.quizMode === 'mc' ? '🇬🇧 Choose the Vietnamese' : '🇻🇳 Type the English meaning'}</div>
    <div class="q-prompt">${prompt}</div>
    ${sub ? `<div class="q-sub">${sub}</div>` : '<div style="margin-bottom:1rem"></div>'}`;

  if (state.quizMode === 'mc') {
    const options = buildDistractors(q, pool);

    html += `<div class="mc-options">`;
    options.forEach((opt, i) => {
      html += `<button class="mc-option" data-correct="${opt.correct}" data-why="${escAttr(opt.why || '')}" data-idx="${i}">${opt.text}</button>`;
    });
    html += `</div>`;
  } else {
    html += `<div class="type-row">
      <input class="type-input" id="type-input" placeholder="Type in English…" autocomplete="off" autocorrect="off" spellcheck="false">
      <button class="check-btn" id="check-btn">Check</button>
    </div>`;
  }

  html += `<div class="feedback-row" id="q-feedback"></div></div>`;
  area.innerHTML = html;

  if (state.quizMode === 'mc') {
    area.querySelectorAll('.mc-option').forEach(btn => {
      btn.addEventListener('click', () => handleMC(btn));
    });
  } else {
    const inp = document.getElementById('type-input');
    inp.focus();
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') handleType(); });
    document.getElementById('check-btn').addEventListener('click', handleType);
  }
}

function handleMC(btn) {
  const correct = btn.dataset.correct === 'true';
  const why     = btn.dataset.why || '';

  document.querySelectorAll('.mc-option').forEach(b => {
    b.disabled = true;
    if (b.dataset.correct === 'true') b.classList.add('correct');
  });
  if (!correct) btn.classList.add('wrong');

  scoreQuiz(correct, state.currentQ.v, why);
}

function handleType() {
  const input = document.getElementById('type-input');
  if (!input || input.disabled) return;
  const val = input.value.trim();
  if (!val) return;

  const correct = loosyMatch(val, state.currentQ.e);
  input.disabled = true;
  document.getElementById('check-btn').disabled = true;
  input.classList.add(correct ? 'correct' : 'wrong');

  scoreQuiz(correct, state.currentQ.e, '');
}

function loosyMatch(a, b) {
  // Strip tone marks and lowercase for comparison
  const clean = s => s.toLowerCase().trim()
    .replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, 'a')
    .replace(/[éèẻẽẹêếềểễệ]/g, 'e')
    .replace(/[íìỉĩị]/g, 'i')
    .replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, 'o')
    .replace(/[úùủũụưứừửữự]/g, 'u')
    .replace(/[ýỳỷỹỵ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s\/]/g, '')
    .replace(/\s+/g, ' ');
  const ca = clean(a), cb = clean(b);
  return ca === cb || cb.includes(ca) || ca.includes(cb);
}

function scoreQuiz(correct, correctAnswer, why) {
  if (correct) { state.qScore++; state.streak++; }
  else         { state.streak = 0; }
  state.qTotal++;
  markDirty();
  persist();
  updateQuizScore();
  refreshHomeStats();
  showQuizFeedback(correct, correctAnswer, why);
}

function showQuizFeedback(correct, correctAnswer, why) {
  const fb = document.getElementById('q-feedback');
  fb.className = 'feedback-row visible';

  // Build the why tip — only shown on wrong answers when a reason is available
  const whyHtml = (!correct && why)
    ? `<div class="why-tip">💡 ${why}</div>`
    : '';

  fb.innerHTML = `
    <div class="feedback-left">
      <span class="feedback-msg ${correct ? 'ok' : 'bad'}">
        ${correct ? '✅ Correct!' : `❌ Answer: <b>${correctAnswer}</b>`}
      </span>
      ${whyHtml}
    </div>
    <button class="next-btn" id="btn-next">Next →</button>`;
  document.getElementById('btn-next').addEventListener('click', renderQuiz);
}

// ── OPEN QUESTIONS ────────────────────────────

let openIdx = -1;

// Extract all Vietnamese answer fragments from a model string.
// Returns an array of candidate strings to match against.
function extractVnCandidates(model) {
  const candidates = [];

  // After "Answer: " — e.g. "It means: '...' Answer: Tôi muốn mua ba quả cam."
  const afterAnswer = model.match(/Answer:\s*([^.(]+)/i);
  if (afterAnswer) candidates.push(afterAnswer[1].trim());

  // After "or:" — e.g. "Không sao! ... or: Không có gì (it's nothing)."
  const afterOr = model.match(/or:\s*([^(.\n]+)/i);
  if (afterOr) candidates.push(afterOr[1].trim());

  // Before " — " — e.g. "Chào cô! — 'Cô' is used for..."
  const beforeDash = model.match(/^([^—]+)\s*—/);
  if (beforeDash) candidates.push(beforeDash[1].trim());

  // Before first " (" — e.g. "Không sao! (No problem...)"
  const beforeParen = model.match(/^([^(]+)\s*\(/);
  if (beforeParen) candidates.push(beforeParen[1].trim());

  // Also push the whole model string stripped of parenthetical English
  const stripped = model.replace(/\([^)]*\)/g, '').replace(/[A-Z][a-z].*?[.!?]\s*/g, '').trim();
  if (stripped) candidates.push(stripped);

  // Always include the full model as a last resort
  candidates.push(model);

  return [...new Set(candidates.filter(Boolean))];
}

// Three-tier open answer grader
// Returns { verdict: 'correct'|'close'|'wrong'|'blank', msg, color }
function gradeOpenAnswer(typed, model) {
  const t = typed.trim();
  if (!t) return { verdict: 'blank', msg: '', color: '' };

  const clean = s => s.toLowerCase()
    .replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, 'a')
    .replace(/[éèẻẽẹêếềểễệ]/g, 'e')
    .replace(/[íìỉĩị]/g, 'i')
    .replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, 'o')
    .replace(/[úùủũụưứừửữự]/g, 'u')
    .replace(/[ýỳỷỹỵ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, '')   // strip punctuation entirely, not to space
    .replace(/\s+/g, ' ').trim();

  const ct = clean(t);
  const candidates = extractVnCandidates(model);

  // Check typed answer against every candidate — take the best result
  let bestOverlap = 0;
  for (const candidate of candidates) {
    const cv = clean(candidate);

    // Exact match against this candidate
    if (ct === cv || cv.includes(ct) || ct.includes(cv)) {
      return { verdict: 'correct', msg: '✅ Correct!', color: 'ok' };
    }

    // Word overlap
    const tWords = new Set(ct.split(' ').filter(w => w.length > 1));
    const vWords = new Set(cv.split(' ').filter(w => w.length > 1));
    if (vWords.size === 0) continue;
    const shared = [...tWords].filter(w => vWords.has(w)).length;
    const overlap = shared / vWords.size;
    if (overlap > bestOverlap) bestOverlap = overlap;
  }

  if (bestOverlap >= 0.65) return {
    verdict: 'correct',
    msg: '✅ Great — key words match!',
    color: 'ok',
  };
  if (bestOverlap >= 0.3) return {
    verdict: 'close',
    msg: '🟡 Close — check the model answer below for the exact phrasing',
    color: 'close',
  };
  return {
    verdict: 'wrong',
    msg: '❌ Not quite — compare your answer with the model below',
    color: 'bad',
  };
}

function renderOpenQuestion(area) {
  const available = filteredOpenQuestions();
  if (available.length === 0) {
    area.innerHTML = `<div class="quiz-card" style="text-align:center;padding:3rem 1.5rem">
      <p style="color:var(--ink-soft)">No open questions unlocked yet — keep studying!<br>
      <button class="ghost-btn" onclick="showModal()" style="margin-top:1rem">Update lesson count</button></p>
    </div>`;
    return;
  }
  openIdx = (openIdx + 1) % available.length;
  const q = available[openIdx];

  const tagsHtml  = q.tags.map(t => `<span class="q-tag">${t}</span>`).join('');
  const hintsHtml = q.hints.map(h => `<span class="hint-chip">💡 ${h}</span>`).join('');

  area.innerHTML = `
    <div class="quiz-card">
      <div class="q-tags">${tagsHtml}</div>
      <div class="open-prompt">${q.prompt}</div>
      <div class="open-hints">${hintsHtml}</div>
      <textarea class="open-textarea" id="open-textarea" placeholder="Write your Vietnamese answer here…"></textarea>
      <div class="open-verdict" id="open-verdict"></div>
      <div class="open-action-row">
        <button class="reveal-model-btn" id="reveal-model">Check &amp; show answer</button>
        <button class="ghost-btn" id="btn-next-open">Next question →</button>
      </div>
      <div class="model-answer" id="model-answer">
        <strong>Model answer:</strong><br>${q.model}
      </div>
    </div>`;

  document.getElementById('reveal-model').addEventListener('click', () => {
    const typed  = document.getElementById('open-textarea').value;
    const grade  = gradeOpenAnswer(typed, q.model);
    const verdict = document.getElementById('open-verdict');

    if (grade.verdict !== 'blank') {
      verdict.innerHTML = `<span class="open-verdict-msg ${grade.color}">${grade.msg}</span>`;
      verdict.classList.add('show');

      // Score it like the other quiz modes
      const correct = grade.verdict === 'correct';
      if (correct) { state.qScore++; state.streak++; }
      else { state.streak = 0; }
      state.qTotal++;
      persist();
      updateQuizScore();
      refreshHomeStats();
    }

    document.getElementById('model-answer').classList.add('visible');
    document.getElementById('reveal-model').disabled = true;
  });

  document.getElementById('btn-next-open').addEventListener('click', () => {
    renderOpenQuestion(area);
  });

  document.getElementById('open-textarea').focus();
}

// ── VOCAB ────────────────────────────────────

function buildVocabCats() {
  const cats = ['All', ...new Set(VOCAB_TABLE.map(r => r[0]))];
  const row = document.getElementById('vocab-cat-row');
  row.innerHTML = '';
  cats.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'cat-chip' + (cat === 'All' ? ' active' : '');
    btn.textContent = cat;
    btn.addEventListener('click', () => {
      state.vocabCat = cat;
      document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      renderVocab();
    });
    row.appendChild(btn);
  });
}

function renderVocab() {
  const q = document.getElementById('vocab-search').value.toLowerCase();
  let rows = VOCAB_TABLE;
  if (state.vocabCat !== 'All') rows = rows.filter(r => r[0] === state.vocabCat);
  if (q) rows = rows.filter(r =>
    r[1].toLowerCase().includes(q) || r[2].toLowerCase().includes(q)
  );
  const wrap = document.getElementById('vocab-table-wrap');
  if (!rows.length) {
    wrap.innerHTML = '<div class="vocab-table"><div class="vocab-empty">No results</div></div>';
    return;
  }
  wrap.innerHTML = `
    <div class="vocab-table">
      <div class="vocab-row vocab-header">
        <div class="vocab-cell">Vietnamese</div>
        <div class="vocab-cell">English</div>
        <div class="vocab-cell">Notes</div>
      </div>
      ${rows.map(r => `
        <div class="vocab-row">
          <div class="vocab-cell vn">${r[1]}</div>
          <div class="vocab-cell en">${r[2]}</div>
          <div class="vocab-cell note">${r[3] || ''}</div>
        </div>`).join('')}
    </div>`;
}

// ── GRAMMAR ──────────────────────────────────

function buildGrammar() {
  const acc = document.getElementById('grammar-accordion');
  acc.innerHTML = '';
  GRAMMAR_SECTIONS.forEach((section, i) => {
    const block = document.createElement('div');
    block.className = 'grammar-block';
    block.innerHTML = `
      <button class="grammar-toggle-btn ${i === 0 ? 'open' : ''}" data-idx="${i}">
        ${section.title}
        <span class="grammar-toggle-icon">▼</span>
      </button>
      <div class="grammar-body ${i === 0 ? 'open' : ''}" id="gb-${i}">
        ${section.rules.map(r => `
          <div class="grammar-rule">
            <code class="grammar-pattern">${r.p}</code>
            <div class="grammar-ex-wrap">
              <div>${r.ex}</div>
              ${r.tr ? `<div class="grammar-tr">${r.tr}</div>` : ''}
            </div>
          </div>`).join('')}
      </div>`;
    block.querySelector('.grammar-toggle-btn').addEventListener('click', function() {
      const body = document.getElementById('gb-' + i);
      const open = body.classList.toggle('open');
      this.classList.toggle('open', open);
    });
    acc.appendChild(block);
  });

  // Confusables
  const grid = document.getElementById('confusable-grid');
  grid.innerHTML = CONFUSABLES.map(c => `
    <div class="confusable-card">
      <div><span class="confusable-word">${c.a}</span> <span class="confusable-eng">= ${c.ae}</span></div>
      <div class="confusable-vs">vs.</div>
      <div><span class="confusable-word">${c.b}</span> <span class="confusable-eng">= ${c.be}</span></div>
      <div class="confusable-note">⚠ ${c.note}</div>
    </div>`).join('');
}

// ── TONES ────────────────────────────────────

function buildTones() {
  // TTS helper local to tones — reuses same synth as reading page if available
  function speakTone(word, el) {
    const synth = window.speechSynthesis;
    synth.cancel();
    const utt = new SpeechSynthesisUtterance(word);
    utt.lang = 'vi-VN';
    utt.rate = 0.8;
    const voices = synth.getVoices();
    const vi = voices.find(v => v.lang === 'vi-VN' || v.lang.startsWith('vi'));
    if (vi) utt.voice = vi;
    el.classList.add('tone-playing');
    utt.onend = () => el.classList.remove('tone-playing');
    synth.speak(utt);
  }

  // Six tone info cards — click to hear the example word
  const toneCardsEl = document.getElementById('tone-cards');
  toneCardsEl.innerHTML = '';
  TONES.forEach(t => {
    const exampleWord = t.ex.split('=')[0].trim().split(',')[0].trim(); // e.g. "ba" from "ba = father / 3"
    const card = document.createElement('div');
    card.className = 'tone-card tone-clickable';
    card.style.borderTopColor = t.color;
    card.title = `Click to hear "${exampleWord}"`;
    card.innerHTML = `
      <span class="tone-symbol" style="color:${t.color}">${t.sym}</span>
      <div class="tone-name">${t.name}</div>
      <div class="tone-desc">${t.desc}</div>
      <div class="tone-ex">${t.ex}</div>
      <div class="tone-speak-hint">🔊 tap to hear</div>`;
    card.addEventListener('click', () => speakTone(exampleWord, card));
    toneCardsEl.appendChild(card);
  });

  // "ba" practice series — click each to hear it
  const seriesEl = document.getElementById('tone-series');
  seriesEl.innerHTML = '';
  TONE_BA.forEach(t => {
    const item = document.createElement('div');
    item.className = 'tone-item tone-clickable';
    item.title = `Click to hear "${t.word}"`;
    item.innerHTML = `
      <span class="t-word">${t.word}</span>
      <span class="t-tone">${t.tone}</span>
      <span class="t-meaning">${t.meaning}</span>`;
    item.addEventListener('click', () => speakTone(t.word, item));
    seriesEl.appendChild(item);
  });

  // Tone sentences — click the Vietnamese cell to hear the sentence
  const sentenceTable = document.getElementById('tone-sentences');
  sentenceTable.innerHTML = `
    <div class="vocab-row vocab-header">
      <div class="vocab-cell">Vietnamese <span style="font-weight:400;opacity:.6;font-size:.7rem">(tap to hear)</span></div>
      <div class="vocab-cell">English</div>
      <div class="vocab-cell">Tone pattern</div>
    </div>
    ${TONE_SENTENCES.map(s => `
      <div class="vocab-row">
        <div class="vocab-cell vn tone-sentence-vn" data-vn="${s.vn}" style="cursor:pointer" title="Tap to hear">${s.vn} <span style="opacity:.4;font-size:.8rem">🔊</span></div>
        <div class="vocab-cell en">${s.en}</div>
        <div class="vocab-cell note">${s.note}</div>
      </div>`).join('')}`;

  sentenceTable.querySelectorAll('.tone-sentence-vn').forEach(cell => {
    cell.addEventListener('click', () => speakTone(cell.dataset.vn, cell));
  });
}

// ── WIRE UP ──────────────────────────────────

function initApp() {
  // Nav buttons and feature tiles are wired in DOMContentLoaded before auth

  // Lesson badge in nav
  const badge = document.getElementById('nav-lesson-badge');
  if (badge) badge.textContent = profileLabel();

  // Flashcards
  buildDeckRow();
  loadDeck(state.deck);
  document.getElementById('btn-shuffle').addEventListener('click', shuffleDeck);
  document.getElementById('btn-reverse').addEventListener('click', () => {
    state.reverseMode = !state.reverseMode;
    const btn = document.getElementById('btn-reverse');
    btn.classList.toggle('active', state.reverseMode);
    btn.textContent = state.reverseMode ? '⇄ Mixed (on)' : '⇄ Mix directions';
    loadDeck(state.deck);
  });

  // Quiz mode buttons
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => setQuizMode(btn.dataset.mode));
  });
  document.getElementById('btn-reset-quiz').addEventListener('click', () => {
    state.qScore = 0; state.qTotal = 0; state.streak = 0;
    persist(); updateQuizScore(); refreshHomeStats(); renderQuiz();
  });
  renderQuiz();

  // Vocab
  buildVocabCats();
  renderVocab();
  document.getElementById('vocab-search').addEventListener('input', renderVocab);

  // Grammar
  buildGrammar();

  // Tones
  buildTones();

  // Home stats
  refreshHomeStats();

  // Home lesson label
  const homeLabel = document.getElementById('home-lesson-label');
  if (homeLabel) homeLabel.textContent = profileLabel();

  // Show student name in nav if logged in
  if (state.studentId) {
    const s = getStudent(state.studentId);
    if (s && badge) badge.textContent = s.name + ' · ' + profileLabel();
  }
}


// ── BOOT ─────────────────────────────────────
// Auth is handled by DOMContentLoaded below.
// Students come from the database via validateSession().


document.addEventListener('DOMContentLoaded', async () => {
  // Lesson modal confirm
  document.getElementById('btn-confirm-lessons').addEventListener('click', confirmLessons);

  // Change lessons links
  document.querySelectorAll('.change-lessons-btn').forEach(el => {
    el.addEventListener('click', showModal);
  });

  // Nav buttons — wire these immediately, before any auth check
  document.querySelectorAll('.nav-btn[data-page]').forEach(btn => {
    btn.addEventListener('click', () => showPage(btn.dataset.page));
  });
  document.querySelectorAll('.feature-tile[data-goto]').forEach(tile => {
    tile.addEventListener('click', () => showPage(tile.dataset.goto));
  });

  // ── Boot sequence ─────────────────────────────────────────────────────────
  // 1. Validate session
  const user = await validateSession();
  if (!user) return; // auth.js redirects to login

  // 2. Redirect teachers/admins — unless we're in view-as mode
  if (!user.view_as && (user.role === 'teacher' || user.role === 'admin')) {
    window.location.href = 'teacher.html';
    return;
  }

  // 3. Show view-as banner if applicable
  if (user.view_as) {
    const banner = document.createElement('div');
    banner.id = 'viewas-banner';
    banner.innerHTML = `
      <span>👁 Viewing as <strong>${user.full_name || user.email}</strong> (${user.role}) — Read only</span>
      <button onclick="endViewAs()">✕ Exit</button>`;
    document.body.insertBefore(banner, document.body.firstChild);
  }

  // 4. Populate profile dropdown
  const name = user.full_name || user.email;
  const av   = name.trim().split(/\s+/).map(w => w[0].toUpperCase()).slice(0, 2).join('');
  const role = (user.role || 'student').charAt(0).toUpperCase() + (user.role || 'student').slice(1);

  document.getElementById('t-profile-avatar').textContent = av;
  document.getElementById('t-profile-name').textContent   = name.split(' ')[0];
  document.getElementById('t-dd-avatar').textContent      = av;
  document.getElementById('t-dd-name').textContent        = name;
  document.getElementById('t-dd-email').textContent       = user.email;
  document.getElementById('t-dd-role').textContent        = role;

  // 5. Load progress from the user object returned by validateSession
  loadStateFromSession(user);

  // Progress summary in dropdown
  function updateProgressSummary() {
    const known = [...state.known].filter(k => !k.startsWith('r:')).length;
    const acc   = state.qTotal > 0 ? Math.round(state.qScore / state.qTotal * 100) + '%' : '—';
    const el    = document.getElementById('t-dd-progress');
    if (el) el.innerHTML = `
      <div style="padding:.6rem 1rem;font-size:.78rem;color:var(--ink-soft);line-height:1.9">
        <div>📚 Lesson level: <strong style="color:var(--navy)">${state.lessons}</strong></div>
        <div>🃏 Cards known: <strong style="color:var(--navy)">${known}</strong></div>
        <div>✏️ Quiz accuracy: <strong style="color:var(--navy)">${acc}</strong></div>
      </div>`;
  }

  // Dropdown toggle
  const profileBtn = document.getElementById('t-profile-btn');
  const dropdown   = document.getElementById('t-dropdown');
  if (profileBtn && dropdown) {
    profileBtn.addEventListener('click', e => {
      e.stopPropagation();
      updateProgressSummary();
      dropdown.classList.toggle('open');
    });
    document.addEventListener('click', () => dropdown.classList.remove('open'));
    dropdown.addEventListener('click', e => e.stopPropagation());
  }

  const logoutBtn = document.getElementById('dd-logout');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);
  const pwBtn = document.getElementById('dd-change-password');
  if (pwBtn) pwBtn.addEventListener('click', () => {
    alert('Change password coming soon.');
    dropdown?.classList.remove('open');
  });

  // 5. Init app
  if (state.lessons === 0) {
    showModal();
  } else {
    initApp();
  }
});
