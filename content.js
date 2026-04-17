// ─────────────────────────────────────────────
// content.js — Custom content editor
// Loaded on teacher.html after store.js
// ─────────────────────────────────────────────

let activeSection = 'cards'; // 'cards' | 'readings' | 'questions'

// ── DECK OPTIONS ─────────────────────────────
// Mirrors DECKS keys from data.js, plus "Custom" as a catch-all
const DECK_OPTIONS = [
  'Greetings', 'Pronouns', 'Family', 'Numbers', 'Time',
  'Transport', 'Food', 'Adjectives', 'Classifiers', 'Phrases',
  'Tense', 'Comparisons', 'Custom',
];

// ── TAB SWITCHING ─────────────────────────────
// ── VIEW SWITCHING ────────────────────────────
function switchView(viewName) {
  ['view-students', 'view-class', 'view-content'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  const target = document.getElementById(
    viewName === 'classes' ? 'view-class' : 'view-' + viewName
  );
  if (target) target.style.display = 'block';

  document.querySelectorAll('.t-dropdown-item[data-view]').forEach(item => {
    item.classList.toggle('active', item.dataset.view === viewName);
  });

  if (viewName === 'students') {
    if (typeof loadRosterFromApi === 'function') loadRosterFromApi();
  } else if (viewName === 'classes') {
    if (typeof loadClasses === 'function') loadClasses();
  } else if (viewName === 'content') {
    renderContentSection(activeSection);
  }

  const dd = document.getElementById('t-dropdown');
  if (dd) dd.classList.remove('open');
}

function initContentTabs() {
  // Wire dropdown nav items to views
  document.querySelectorAll('.t-dropdown-item[data-view]').forEach(item => {
    item.addEventListener('click', () => switchView(item.dataset.view));
  });

  // Wire content sub-nav buttons
  document.querySelectorAll('.t-content-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeSection = btn.dataset.section;
      document.querySelectorAll('.t-content-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderContentSection(activeSection);
    });
  });
}


// ── SEARCH STATE ─────────────────────────────
let ceCardSearch     = '';
let ceReadingSearch  = '';
let ceQuestionSearch = '';

// ── SHARED HELPERS ────────────────────────────
function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function builtinRow(viet, eng, note, meta) {
  return `
    <div class="ce-row ce-row-builtin">
      <div class="ce-row-main">
        <span class="ce-row-viet">${escHtml(viet)}</span>
        <span class="ce-row-eng">${escHtml(eng)}</span>
        ${note ? `<span class="ce-row-note">${escHtml(note)}</span>` : ''}
      </div>
      <div class="ce-row-meta">
        ${meta.map(m => `<span class="ce-meta-tag ce-meta-builtin">${escHtml(m)}</span>`).join('')}
        <span class="ce-builtin-badge">built-in</span>
      </div>
    </div>`;
}

function sectionDivider(label, count) {
  return `<div class="ce-section-divider"><span>${escHtml(label)}</span><span class="ce-section-count">${count}</span></div>`;
}

// ── MAIN RENDERER ────────────────────────────
function renderContentSection(section) {
  const area = document.getElementById('content-editor-area');
  if (section === 'cards')     renderCardsEditor(area);
  if (section === 'readings')  renderReadingsEditor(area);
  if (section === 'questions') renderQuestionsEditor(area);
}

// ══════════════════════════════════════════════
// CARDS EDITOR
// ══════════════════════════════════════════════
function renderCardsEditor(area) {
  area.innerHTML = `
    <div class="ce-header">
      <div>
        <h2 class="ce-title">Flashcards</h2>
        <p class="ce-sub">All cards across all decks. Built-in cards are read-only; add your own below.</p>
      </div>
      <button class="t-add-btn" id="ce-add-card">＋ New card</button>
    </div>
    <div class="ce-search-row">
      <input class="ce-search-input" id="ce-card-search"
             placeholder="Search Vietnamese or English…" value="${escHtml(ceCardSearch)}">
    </div>
    <div class="ce-form-wrap" id="ce-card-form" style="display:none">
      <div class="ce-form">
        <h3 class="ce-form-title" id="ce-card-form-title">New card</h3>
        <input type="hidden" id="cf-card-id">
        <div class="ce-field-row">
          <div class="ce-field">
            <label class="ce-label">Vietnamese <span class="ce-required">*</span></label>
            <input class="ce-input" id="cf-viet" placeholder="e.g. Xin chào!" autocomplete="off" autocorrect="off" spellcheck="false">
          </div>
          <div class="ce-field">
            <label class="ce-label">English <span class="ce-required">*</span></label>
            <input class="ce-input" id="cf-eng" placeholder="e.g. Hello!">
          </div>
        </div>
        <div class="ce-field-row">
          <div class="ce-field">
            <label class="ce-label">Note / tip</label>
            <input class="ce-input" id="cf-note" placeholder="Optional context or memory tip">
          </div>
          <div class="ce-field ce-field-sm">
            <label class="ce-label">Deck</label>
            <select class="ce-select" id="cf-deck">
              ${DECK_OPTIONS.map(d => `<option value="${d}">${d}</option>`).join('')}
            </select>
          </div>
          <div class="ce-field ce-field-xs">
            <label class="ce-label">Lesson #</label>
            <input class="ce-input" type="number" id="cf-lesson" min="1" max="32" value="1">
          </div>
        </div>
        <div class="ce-form-actions">
          <button class="t-save-btn" id="cf-card-save">Save card</button>
          <button class="ghost-btn" id="cf-card-cancel">Cancel</button>
        </div>
      </div>
    </div>
    <div id="ce-card-list"></div>`;

  renderCardList(ceCardSearch);
  document.getElementById('ce-card-search').addEventListener('input', function() {
    ceCardSearch = this.value; renderCardList(ceCardSearch);
  });
  document.getElementById('ce-add-card').addEventListener('click', () => openCardForm());
  document.getElementById('cf-card-cancel').addEventListener('click', closeCardForm);
  document.getElementById('cf-card-save').addEventListener('click', saveCard);
}

function renderCardList(search) {
  const q    = search.toLowerCase();
  const list = document.getElementById('ce-card-list');
  if (!list) return;

  const all = loadCustomCards().filter(c =>
    !q || c.viet.toLowerCase().includes(q) || c.eng.toLowerCase().includes(q)
  );

  if (all.length === 0) {
    list.innerHTML = `<div class="ce-empty">No cards found${q ? ' matching your search' : ''}.</div>`;
    return;
  }

  // Group by deck
  const byDeck = {};
  all.forEach(c => {
    if (!byDeck[c.deck]) byDeck[c.deck] = [];
    byDeck[c.deck].push(c);
  });

  let html = '';
  Object.entries(byDeck).forEach(([deckName, cards]) => {
    html += sectionDivider(deckName, cards.length);
    cards.forEach(c => { html += cardRow(c); });
  });

  list.innerHTML = html;
  list.querySelectorAll('.ce-edit-btn').forEach(b => b.addEventListener('click', () => openCardForm(b.dataset.id)));
  list.querySelectorAll('.ce-delete-btn').forEach(b => b.addEventListener('click', () => deleteCard(b.dataset.id)));
}

function cardRow(c) {
  return `
    <div class="ce-row" id="ce-card-${c.id}">
      <div class="ce-row-main">
        <span class="ce-row-viet">${escHtml(c.viet)}</span>
        <span class="ce-row-eng">${escHtml(c.eng)}</span>
        ${c.note ? `<span class="ce-row-note">${escHtml(c.note)}</span>` : ''}
      </div>
      <div class="ce-row-meta">
        <span class="ce-meta-tag">${escHtml(c.deck)}</span>
        <span class="ce-meta-tag">L${c.lesson}</span>
        ${c.builtin ? `<span class="ce-builtin-badge">built-in</span>` : ''}
      </div>
      <div class="ce-row-actions">
        <button class="ce-edit-btn" data-id="${c.id}">Edit</button>
        <button class="ce-delete-btn" data-id="${c.id}">Delete</button>
      </div>
    </div>`;
}

function openCardForm(id) {
  const form = document.getElementById('ce-card-form');
  form.style.display = 'block';
  form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  if (id) {
    const c = loadCustomCards().find(x => x.id === id);
    if (!c) return;
    document.getElementById('ce-card-form-title').textContent = 'Edit card';
    document.getElementById('cf-card-id').value = c.id;
    document.getElementById('cf-viet').value    = c.viet;
    document.getElementById('cf-eng').value     = c.eng;
    document.getElementById('cf-note').value    = c.note || '';
    document.getElementById('cf-deck').value    = c.deck;
    document.getElementById('cf-lesson').value  = c.lesson;
  } else {
    document.getElementById('ce-card-form-title').textContent = 'New card';
    ['cf-card-id','cf-viet','cf-eng','cf-note'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('cf-deck').value   = 'Custom';
    document.getElementById('cf-lesson').value = '1';
  }
  document.getElementById('cf-viet').focus();
}

function closeCardForm() { document.getElementById('ce-card-form').style.display = 'none'; }

function saveCard() {
  const viet = document.getElementById('cf-viet').value.trim();
  const eng  = document.getElementById('cf-eng').value.trim();
  if (!viet) document.getElementById('cf-viet').classList.add('ce-error');
  if (!eng)  document.getElementById('cf-eng').classList.add('ce-error');
  if (!viet || !eng) return;
  document.getElementById('cf-viet').classList.remove('ce-error');
  document.getElementById('cf-eng').classList.remove('ce-error');
  const existing = document.getElementById('cf-card-id').value;
  upsertCustomCard({
    id:        existing || makeId(),
    viet, eng,
    note:      document.getElementById('cf-note').value.trim(),
    deck:      document.getElementById('cf-deck').value,
    lesson:    parseInt(document.getElementById('cf-lesson').value) || 1,
    createdAt: existing
      ? (loadCustomCards().find(c => c.id === existing)?.createdAt || new Date().toISOString())
      : new Date().toISOString(),
  });
  closeCardForm();
  renderCardList(ceCardSearch);
}

function deleteCard(id) {
  if (!confirm('Delete this card?')) return;
  deleteCustomCard(id); renderCardList(ceCardSearch);
}

// ══════════════════════════════════════════════
// READINGS EDITOR
// ══════════════════════════════════════════════
function renderReadingsEditor(area) {
  area.innerHTML = `
    <div class="ce-header">
      <div>
        <h2 class="ce-title">Reading texts</h2>
        <p class="ce-sub">All graded reading texts. Built-in texts are read-only; add your own below.</p>
      </div>
      <button class="t-add-btn" id="ce-add-reading">＋ New text</button>
    </div>
    <div class="ce-search-row">
      <input class="ce-search-input" id="ce-reading-search"
             placeholder="Search by title or subtitle…" value="${escHtml(ceReadingSearch)}">
    </div>
    <div class="ce-form-wrap" id="ce-reading-form" style="display:none">
      <div class="ce-form">
        <h3 class="ce-form-title" id="ce-reading-form-title">New reading text</h3>
        <input type="hidden" id="rf-id">
        <div class="ce-field-row">
          <div class="ce-field">
            <label class="ce-label">Title <span class="ce-required">*</span></label>
            <input class="ce-input" id="rf-title" placeholder="e.g. Ở chợ Đồng Xuân">
          </div>
          <div class="ce-field">
            <label class="ce-label">Subtitle</label>
            <input class="ce-input" id="rf-subtitle" placeholder="e.g. At Đồng Xuân market">
          </div>
        </div>
        <div class="ce-field-row">
          <div class="ce-field ce-field-sm">
            <label class="ce-label">Type</label>
            <select class="ce-select" id="rf-type">
              <option>Conversation</option><option>Short story</option>
              <option>Daily conversation</option><option>Article</option>
            </select>
          </div>
          <div class="ce-field ce-field-xs">
            <label class="ce-label">Lesson # <span class="ce-required">*</span></label>
            <input class="ce-input" type="number" id="rf-level" min="1" max="32" value="5">
          </div>
          <div class="ce-field ce-field-xs">
            <label class="ce-label">Duration (min)</label>
            <input class="ce-input" type="number" id="rf-duration" min="1" max="30" value="2">
          </div>
        </div>
        <div class="ce-field">
          <label class="ce-label">Introduction</label>
          <input class="ce-input" id="rf-intro" placeholder="One sentence setting the scene…">
        </div>
        <div class="ce-field">
          <label class="ce-label">Sentences <span class="ce-required">*</span>
            <span class="ce-label-hint">One per row — Vietnamese then English</span>
          </label>
          <div id="rf-sentences-wrap"></div>
          <button class="ce-add-row-btn" id="rf-add-sentence">＋ Add sentence</button>
        </div>
        <div class="ce-field">
          <label class="ce-label">Vocabulary list <span class="ce-label-hint">Comma-separated key words</span></label>
          <input class="ce-input" id="rf-vocab" placeholder="e.g. đi chợ, mua gì, bao nhiêu tiền">
        </div>
        <div class="ce-form-actions">
          <button class="t-save-btn" id="rf-save">Save text</button>
          <button class="ghost-btn" id="rf-cancel">Cancel</button>
        </div>
      </div>
    </div>
    <div id="ce-reading-list"></div>`;

  renderReadingList(ceReadingSearch);
  document.getElementById('ce-reading-search').addEventListener('input', function() {
    ceReadingSearch = this.value; renderReadingList(ceReadingSearch);
  });
  document.getElementById('ce-add-reading').addEventListener('click', () => openReadingForm());
  document.getElementById('rf-cancel').addEventListener('click', closeReadingForm);
  document.getElementById('rf-save').addEventListener('click', saveReading);
  document.getElementById('rf-add-sentence').addEventListener('click', () => addSentenceRow());
}

function renderReadingList(search) {
  const q    = search.toLowerCase();
  const list = document.getElementById('ce-reading-list');
  if (!list) return;

  const all = loadCustomReadings().filter(r =>
    !q || r.title.toLowerCase().includes(q) || (r.subtitle || '').toLowerCase().includes(q)
  ).sort((a, b) => a.level - b.level);

  if (all.length === 0) {
    list.innerHTML = `<div class="ce-empty">No reading texts found${q ? ' matching your search' : ''}.</div>`;
    return;
  }

  list.innerHTML = all.map(readingRow).join('');
  list.querySelectorAll('.ce-edit-btn').forEach(b => b.addEventListener('click', () => openReadingForm(b.dataset.id)));
  list.querySelectorAll('.ce-delete-btn').forEach(b => b.addEventListener('click', () => deleteReading(b.dataset.id)));
}

function readingRow(r) {
  return `
    <div class="ce-row" id="ce-reading-${r.id}">
      <div class="ce-row-main">
        <span class="ce-row-viet">${escHtml(r.title)}</span>
        <span class="ce-row-eng">${escHtml(r.subtitle || '')}</span>
        <span class="ce-row-note">${r.sentences.length} sentences</span>
      </div>
      <div class="ce-row-meta">
        <span class="ce-meta-tag">${escHtml(r.type)}</span>
        <span class="ce-meta-tag">L${r.level}</span>
        ${r.builtin ? `<span class="ce-builtin-badge">built-in</span>` : ''}
      </div>
      <div class="ce-row-actions">
        <button class="ce-edit-btn" data-id="${r.id}">Edit</button>
        <button class="ce-delete-btn" data-id="${r.id}">Delete</button>
      </div>
    </div>`;
}

function addSentenceRow(vnVal, enVal) {
  const wrap = document.getElementById('rf-sentences-wrap');
  const row  = document.createElement('div');
  row.className = 'ce-sentence-row';
  row.innerHTML = `
    <input class="ce-input rf-vn" placeholder="Vietnamese sentence…" autocorrect="off" spellcheck="false" value="${escHtml(vnVal || '')}">
    <input class="ce-input rf-en" placeholder="English translation…" value="${escHtml(enVal || '')}">
    <button class="ce-remove-row-btn" title="Remove">✕</button>`;
  row.querySelector('.ce-remove-row-btn').addEventListener('click', () => row.remove());
  wrap.appendChild(row);
  row.querySelector('.rf-vn').focus();
}

function openReadingForm(id) {
  const form = document.getElementById('ce-reading-form');
  form.style.display = 'block';
  form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  document.getElementById('rf-sentences-wrap').innerHTML = '';
  if (id) {
    const r = loadCustomReadings().find(x => x.id === id);
    if (!r) return;
    document.getElementById('ce-reading-form-title').textContent = 'Edit text';
    document.getElementById('rf-id').value       = r.id;
    document.getElementById('rf-title').value    = r.title;
    document.getElementById('rf-subtitle').value = r.subtitle || '';
    document.getElementById('rf-type').value     = r.type;
    document.getElementById('rf-level').value    = r.level;
    document.getElementById('rf-duration').value = r.duration || 2;
    document.getElementById('rf-intro').value    = r.intro || '';
    document.getElementById('rf-vocab').value    = (r.vocab || []).join(', ');
    r.sentences.forEach(s => addSentenceRow(s.vn, s.en));
  } else {
    document.getElementById('ce-reading-form-title').textContent = 'New reading text';
    ['rf-id','rf-title','rf-subtitle','rf-intro','rf-vocab'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('rf-type').value     = 'Conversation';
    document.getElementById('rf-level').value    = '5';
    document.getElementById('rf-duration').value = '2';
    addSentenceRow();
  }
  document.getElementById('rf-title').focus();
}

function closeReadingForm() { document.getElementById('ce-reading-form').style.display = 'none'; }

function saveReading() {
  const title = document.getElementById('rf-title').value.trim();
  if (!title) { document.getElementById('rf-title').classList.add('ce-error'); return; }
  document.getElementById('rf-title').classList.remove('ce-error');
  const sentences = [];
  document.querySelectorAll('.ce-sentence-row').forEach(row => {
    const vn = row.querySelector('.rf-vn').value.trim();
    const en = row.querySelector('.rf-en').value.trim();
    if (vn) sentences.push({ vn, en });
  });
  if (!sentences.length) { alert('Please add at least one sentence.'); return; }
  const existing = document.getElementById('rf-id').value;
  upsertCustomReading({
    id:        existing || makeId(),
    title,
    subtitle:  document.getElementById('rf-subtitle').value.trim(),
    type:      document.getElementById('rf-type').value,
    level:     parseInt(document.getElementById('rf-level').value) || 5,
    duration:  parseInt(document.getElementById('rf-duration').value) || 2,
    intro:     document.getElementById('rf-intro').value.trim(),
    sentences,
    vocab:     document.getElementById('rf-vocab').value.split(',').map(s => s.trim()).filter(Boolean),
    createdAt: existing
      ? (loadCustomReadings().find(r => r.id === existing)?.createdAt || new Date().toISOString())
      : new Date().toISOString(),
    custom: true,
  });
  closeReadingForm();
  renderReadingList(ceReadingSearch);
}

function deleteReading(id) {
  if (!confirm('Delete this reading text?')) return;
  deleteCustomReading(id); renderReadingList(ceReadingSearch);
}

// ══════════════════════════════════════════════
// QUESTIONS EDITOR
// ══════════════════════════════════════════════
function renderQuestionsEditor(area) {
  area.innerHTML = `
    <div class="ce-header">
      <div>
        <h2 class="ce-title">Open questions</h2>
        <p class="ce-sub">All open questions for the quiz. Built-in ones are read-only; add your own below.</p>
      </div>
      <button class="t-add-btn" id="ce-add-question">＋ New question</button>
    </div>
    <div class="ce-search-row">
      <input class="ce-search-input" id="ce-question-search"
             placeholder="Search by prompt or tag…" value="${escHtml(ceQuestionSearch)}">
    </div>
    <div class="ce-form-wrap" id="ce-question-form" style="display:none">
      <div class="ce-form">
        <h3 class="ce-form-title" id="ce-question-form-title">New question</h3>
        <input type="hidden" id="qf-id">
        <div class="ce-field">
          <label class="ce-label">Question / prompt <span class="ce-required">*</span></label>
          <textarea class="ce-input ce-textarea" id="qf-prompt" rows="2"
            placeholder="e.g. How would you greet a classmate you haven't seen in a week?"></textarea>
        </div>
        <div class="ce-field">
          <label class="ce-label">Model answer <span class="ce-required">*</span>
            <span class="ce-label-hint">Vietnamese first, then explanation after a dash if needed</span>
          </label>
          <textarea class="ce-input ce-textarea" id="qf-model" rows="2"
            placeholder="e.g. Chào bạn lâu rồi! — Hello, long time no see!"></textarea>
        </div>
        <div class="ce-field-row">
          <div class="ce-field">
            <label class="ce-label">Hints <span class="ce-label-hint">Comma-separated</span></label>
            <input class="ce-input" id="qf-hints" placeholder="e.g. Use bạn for a peer">
          </div>
          <div class="ce-field">
            <label class="ce-label">Tags <span class="ce-label-hint">Comma-separated</span></label>
            <input class="ce-input" id="qf-tags" placeholder="e.g. Greetings, Pronouns">
          </div>
          <div class="ce-field ce-field-xs">
            <label class="ce-label">Lesson #</label>
            <input class="ce-input" type="number" id="qf-lesson" min="1" max="32" value="5">
          </div>
        </div>
        <div class="ce-form-actions">
          <button class="t-save-btn" id="qf-save">Save question</button>
          <button class="ghost-btn" id="qf-cancel">Cancel</button>
        </div>
      </div>
    </div>
    <div id="ce-question-list"></div>`;

  renderQuestionList(ceQuestionSearch);
  document.getElementById('ce-question-search').addEventListener('input', function() {
    ceQuestionSearch = this.value; renderQuestionList(ceQuestionSearch);
  });
  document.getElementById('ce-add-question').addEventListener('click', () => openQuestionForm());
  document.getElementById('qf-cancel').addEventListener('click', closeQuestionForm);
  document.getElementById('qf-save').addEventListener('click', saveQuestion);
}

function renderQuestionList(search) {
  const q    = search.toLowerCase();
  const list = document.getElementById('ce-question-list');
  if (!list) return;

  const all = loadCustomQuestions().filter(x =>
    !q || x.prompt.toLowerCase().includes(q) || x.tags.some(t => t.toLowerCase().includes(q))
  ).sort((a, b) => (a.lesson || 0) - (b.lesson || 0));

  if (all.length === 0) {
    list.innerHTML = `<div class="ce-empty">No questions found${q ? ' matching your search' : ''}.</div>`;
    return;
  }

  list.innerHTML = all.map(questionRow).join('');
  list.querySelectorAll('.ce-edit-btn').forEach(b => b.addEventListener('click', () => openQuestionForm(b.dataset.id)));
  list.querySelectorAll('.ce-delete-btn').forEach(b => b.addEventListener('click', () => deleteQuestion(b.dataset.id)));
}

function questionRow(q) {
  return `
    <div class="ce-row" id="ce-question-${q.id}">
      <div class="ce-row-main">
        <span class="ce-row-viet">${escHtml(q.prompt)}</span>
        <span class="ce-row-note">${escHtml(q.model.slice(0, 80))}${q.model.length > 80 ? '…' : ''}</span>
      </div>
      <div class="ce-row-meta">
        ${q.tags.map(t => `<span class="ce-meta-tag">${escHtml(t)}</span>`).join('')}
        <span class="ce-meta-tag">L${q.lesson}</span>
        ${q.builtin ? `<span class="ce-builtin-badge">built-in</span>` : ''}
      </div>
      <div class="ce-row-actions">
        <button class="ce-edit-btn" data-id="${q.id}">Edit</button>
        <button class="ce-delete-btn" data-id="${q.id}">Delete</button>
      </div>
    </div>`;
}

function openQuestionForm(id) {
  const form = document.getElementById('ce-question-form');
  form.style.display = 'block';
  form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  if (id) {
    const x = loadCustomQuestions().find(q => q.id === id);
    if (!x) return;
    document.getElementById('ce-question-form-title').textContent = 'Edit question';
    document.getElementById('qf-id').value     = x.id;
    document.getElementById('qf-prompt').value = x.prompt;
    document.getElementById('qf-model').value  = x.model;
    document.getElementById('qf-hints').value  = x.hints.join(', ');
    document.getElementById('qf-tags').value   = x.tags.join(', ');
    document.getElementById('qf-lesson').value = x.lesson;
  } else {
    document.getElementById('ce-question-form-title').textContent = 'New question';
    ['qf-id','qf-prompt','qf-model','qf-hints','qf-tags'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('qf-lesson').value = '5';
  }
  document.getElementById('qf-prompt').focus();
}

function closeQuestionForm() { document.getElementById('ce-question-form').style.display = 'none'; }

function saveQuestion() {
  const prompt = document.getElementById('qf-prompt').value.trim();
  const model  = document.getElementById('qf-model').value.trim();
  if (!prompt) document.getElementById('qf-prompt').classList.add('ce-error');
  if (!model)  document.getElementById('qf-model').classList.add('ce-error');
  if (!prompt || !model) return;
  document.getElementById('qf-prompt').classList.remove('ce-error');
  document.getElementById('qf-model').classList.remove('ce-error');
  const existing = document.getElementById('qf-id').value;
  upsertCustomQuestion({
    id:        existing || makeId(),
    prompt, model,
    hints:     document.getElementById('qf-hints').value.split(',').map(s => s.trim()).filter(Boolean),
    tags:      document.getElementById('qf-tags').value.split(',').map(s => s.trim()).filter(Boolean),
    lesson:    parseInt(document.getElementById('qf-lesson').value) || 5,
    createdAt: existing
      ? (loadCustomQuestions().find(q => q.id === existing)?.createdAt || new Date().toISOString())
      : new Date().toISOString(),
    custom: true,
  });
  closeQuestionForm();
  renderQuestionList(ceQuestionSearch);
}

function deleteQuestion(id) {
  if (!confirm('Delete this question?')) return;
  deleteCustomQuestion(id); renderQuestionList(ceQuestionSearch);
}

// ── INIT ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  seedBuiltinContent(); // import built-in data once on first load
  initContentTabs();
});
