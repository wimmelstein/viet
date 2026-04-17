// ─────────────────────────────────────────────
// teacher.js — Teacher interface logic
// Students come from api/roster.php (database)
// Requires data.js, store.js, auth.js
// ─────────────────────────────────────────────

let activeStudentId = null;
let rosterData      = []; // cached from API

// ── HELPERS ──────────────────────────────────
function initials(name) {
  return (name || '?').trim().split(/\s+/).map(w => w[0].toUpperCase()).slice(0, 2).join('');
}

function levelLabel(lessons) {
  const profile = [...LESSON_PROFILES].reverse().find(p => lessons >= p.lessons)
                  || LESSON_PROFILES[0];
  return profile.label;
}

function levelMaxLesson(lessons) {
  const profile = [...LESSON_PROFILES].reverse().find(p => lessons >= p.lessons)
                  || LESSON_PROFILES[0];
  return profile.maxLesson;
}

function levelDesc(lessons) {
  const ml      = levelMaxLesson(lessons);
  const profile = [...LESSON_PROFILES].reverse().find(p => lessons >= p.lessons)
                  || LESSON_PROFILES[0];
  const wordCount = ALL_VOCAB.filter(w => (w.lesson || 1) <= ml).length;
  const qCount    = OPEN_QUESTIONS.filter(q => (q.lesson || 1) <= ml).length;
  return `<strong>${profile.desc}</strong><br>
    <span>${wordCount} words unlocked · ${qCount} open questions</span>`;
}

function relativeDate(iso) {
  if (!iso) return 'Never';
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7)  return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

// ── LOAD ROSTER FROM API ──────────────────────
async function loadRosterFromApi() {
  const container = document.getElementById('t-roster');
  container.innerHTML = `<div class="t-roster-empty">Loading...</div>`;

  try {
    const res  = await api('roster.php', { action: 'list' });
    rosterData = res.students || [];
    renderRoster();
  } catch (err) {
    container.innerHTML = `<div class="t-roster-empty" style="color:var(--red)">
      Could not load students: ${err.message}</div>`;
  }
}

// ── RENDER ROSTER ─────────────────────────────
function renderRoster() {
  const container = document.getElementById('t-roster');

  if (rosterData.length === 0) {
    container.innerHTML = `<div class="t-roster-empty">No students registered yet.</div>`;
    return;
  }

  container.innerHTML = rosterData.map(s => {
    const active    = String(s.id) === String(activeStudentId);
    const accuracy  = s.q_total > 0 ? Math.round(s.q_score / s.q_total * 100) + '%' : '-';
    const known     = (s.known || []).length;
    const name      = s.full_name || s.email;
    const className = s.class_names || '-';
    return `
      <button class="t-student-chip ${active ? 'active' : ''}" data-id="${s.id}">
        <div class="t-chip-avatar">${initials(name)}</div>
        <div class="t-chip-info">
          <div class="t-chip-name">${name}</div>
          <div class="t-chip-meta">${className}</div>
          <div class="t-chip-meta">${known} known · ${accuracy} quiz</div>
        </div>
        <span class="t-chip-level">L${s.lessons || 5}</span>
      </button>`;
  }).join('');

  container.querySelectorAll('.t-student-chip').forEach(chip => {
    chip.addEventListener('click', () => selectStudent(chip.dataset.id));
  });
}

// ── SELECT STUDENT ────────────────────────────
function selectStudent(id) {
  activeStudentId = id;
  const s = rosterData.find(x => String(x.id) === String(id));
  if (!s) return;

  renderRoster();

  document.getElementById('t-empty-state').style.display = 'none';
  document.getElementById('t-detail').style.display = 'block';

  const name     = s.full_name || s.email;
  const accuracy = s.q_total > 0 ? Math.round(s.q_score / s.q_total * 100) + '%' : '-';

  document.getElementById('t-student-name').textContent = name;
  document.getElementById('t-student-meta').textContent =
    `Last active: ${relativeDate(s.last_login)} - ${s.q_total || 0} questions answered`;

  document.getElementById('td-known').textContent    = (s.known || []).length;
  document.getElementById('td-accuracy').textContent = accuracy;
  document.getElementById('td-streak').textContent   = s.streak || 0;
  document.getElementById('td-last').textContent     = relativeDate(s.last_login);

  const slider = document.getElementById('td-slider');
  slider.value = s.lessons || 5;
  updateDetailSlider(s.lessons || 5);
  slider.oninput = () => updateDetailSlider(parseInt(slider.value));

  document.getElementById('btn-save-level').onclick = () => saveLevel(id);
  document.getElementById('btn-delete-student').style.display = 'none';

  renderDeckProgress(s);
  renderUnlockedWords(s);
}

function updateDetailSlider(val) {
  document.getElementById('td-level-val').textContent   = val === 1 ? 'Lesson 1' : `Lessons 1-${val}`;
  document.getElementById('td-level-badge').textContent = levelLabel(val);
  document.getElementById('td-level-desc').innerHTML    = levelDesc(val);
}

async function saveLevel(id) {
  if (isViewAs()) return; // read-only
  const val  = parseInt(document.getElementById('td-slider').value);
  const conf = document.getElementById('t-save-confirm');

  try {
    await api('roster.php', { action: 'set_lessons', student_id: id, lessons: val });

    const s = rosterData.find(x => String(x.id) === String(id));
    if (s) s.lessons = val;
    renderRoster();
    renderDeckProgress(rosterData.find(x => String(x.id) === String(id)));
    renderUnlockedWords(rosterData.find(x => String(x.id) === String(id)));

    conf.textContent = 'Saved';
    conf.classList.add('show');
    setTimeout(() => conf.classList.remove('show'), 2000);
  } catch (err) {
    conf.textContent = 'Error: ' + err.message;
    conf.classList.add('show');
    setTimeout(() => conf.classList.remove('show'), 3000);
  }
}

// ── DECK PROGRESS ────────────────────────────
function renderDeckProgress(s) {
  const ml        = levelMaxLesson(s.lessons || 5);
  const knownSet  = new Set(s.known || []);
  const container = document.getElementById('td-deck-progress');

  const rows = Object.entries(DECKS).map(([name, cards]) => {
    const available = cards.filter(c => (c.lesson || 1) <= ml);
    if (available.length === 0) return null;
    const known = available.filter(c => knownSet.has(c.v) || knownSet.has('v:' + c.v)).length;
    const pct   = Math.round(known / available.length * 100);
    return { name, known, total: available.length, pct };
  }).filter(Boolean);

  container.innerHTML = rows.map(r => `
    <div class="t-deck-row">
      <span class="t-deck-name">${r.name}</span>
      <div class="t-deck-bar-wrap">
        <div class="t-deck-bar-fill" style="width:${r.pct}%"></div>
      </div>
      <span class="t-deck-pct">${r.known}/${r.total}</span>
    </div>`).join('');
}

// ── UNLOCKED WORDS ────────────────────────────
function renderUnlockedWords(s) {
  const ml        = levelMaxLesson(s.lessons || 5);
  const knownSet  = new Set(s.known || []);
  const words     = ALL_VOCAB.filter(w => (w.lesson || 1) <= ml);
  const container = document.getElementById('td-unlocked-list');

  container.innerHTML = words.map(w => {
    const isKnown = knownSet.has(w.v) || knownSet.has('v:' + w.v);
    return `<span class="t-word-chip ${isKnown ? 'known' : ''}" title="${w.e}">${w.v}</span>`;
  }).join('');
}

// ── INIT ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('btn-add-student');
  if (addBtn) addBtn.style.display = 'none';
  loadRosterFromApi();
});