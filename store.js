// ─────────────────────────────────────────────
// store.js — shared student/roster storage
// Loaded by both index.html and teacher.html
// ─────────────────────────────────────────────

const STORE_KEY = 'vn-roster';

// ── Student schema ────────────────────────────
// {
//   id:      string (uuid-ish),
//   name:    string,
//   lessons: number  (teacher-set, 1–32),
//   known:   string[] (vocab keys the student has marked),
//   qScore:  number,
//   qTotal:  number,
//   streak:  number,
//   lastSeen: ISO string | null,
// }

function loadRoster() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
  } catch { return []; }
}

function saveRoster(roster) {
  localStorage.setItem(STORE_KEY, JSON.stringify(roster));
}

function getStudent(id) {
  return loadRoster().find(s => s.id === id) || null;
}

function upsertStudent(student) {
  const roster = loadRoster();
  const idx = roster.findIndex(s => s.id === student.id);
  if (idx >= 0) roster[idx] = student;
  else roster.push(student);
  saveRoster(roster);
}

function deleteStudent(id) {
  saveRoster(loadRoster().filter(s => s.id !== id));
}

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

function blankStudent(name, lessons = 5) {
  return {
    id:       makeId(),
    name,
    lessons,
    known:    [],
    qScore:   0,
    qTotal:   0,
    streak:   0,
    lastSeen: null,
  };
}

// Key for "who is logged in right now on this browser"
const ACTIVE_KEY = 'vn-active-student';
function getActiveId()       { return localStorage.getItem(ACTIVE_KEY) || null; }
function setActiveId(id)     { localStorage.setItem(ACTIVE_KEY, id); }
function clearActiveId()     { localStorage.removeItem(ACTIVE_KEY); }

// ── Custom content storage ────────────────────
// Teachers can add cards, readings, and open questions.
// Stored separately from built-in data so the source files are never touched.
//
// Custom card schema:
// { id, viet, eng, note, deck, lesson, createdAt }
//
// Custom reading schema:
// { id, title, subtitle, type, level, intro,
//   sentences: [{ vn, en }],   // no grammar tokens for now
//   vocab: string[],
//   createdAt }
//
// Custom question schema:
// { id, prompt, hints: string[], model, tags: string[], lesson, createdAt }

const CUSTOM_CARDS_KEY     = 'vn-custom-cards';
const CUSTOM_READINGS_KEY  = 'vn-custom-readings';
const CUSTOM_QUESTIONS_KEY = 'vn-custom-questions';

function loadCustomCards()     { try { return JSON.parse(localStorage.getItem(CUSTOM_CARDS_KEY)     || '[]'); } catch { return []; } }
function loadCustomReadings()  { try { return JSON.parse(localStorage.getItem(CUSTOM_READINGS_KEY)  || '[]'); } catch { return []; } }
function loadCustomQuestions() { try { return JSON.parse(localStorage.getItem(CUSTOM_QUESTIONS_KEY) || '[]'); } catch { return []; } }

function saveCustomCards(arr)     { localStorage.setItem(CUSTOM_CARDS_KEY,     JSON.stringify(arr)); }
function saveCustomReadings(arr)  { localStorage.setItem(CUSTOM_READINGS_KEY,  JSON.stringify(arr)); }
function saveCustomQuestions(arr) { localStorage.setItem(CUSTOM_QUESTIONS_KEY, JSON.stringify(arr)); }

function upsertCustomCard(card) {
  const arr = loadCustomCards();
  const idx = arr.findIndex(c => c.id === card.id);
  if (idx >= 0) arr[idx] = card; else arr.push(card);
  saveCustomCards(arr);
}
function deleteCustomCard(id)     { saveCustomCards(loadCustomCards().filter(c => c.id !== id)); }

function upsertCustomReading(r) {
  const arr = loadCustomReadings();
  const idx = arr.findIndex(x => x.id === r.id);
  if (idx >= 0) arr[idx] = r; else arr.push(r);
  saveCustomReadings(arr);
}
function deleteCustomReading(id)  { saveCustomReadings(loadCustomReadings().filter(r => r.id !== id)); }

function upsertCustomQuestion(q) {
  const arr = loadCustomQuestions();
  const idx = arr.findIndex(x => x.id === q.id);
  if (idx >= 0) arr[idx] = q; else arr.push(q);
  saveCustomQuestions(arr);
}
function deleteCustomQuestion(id) { saveCustomQuestions(loadCustomQuestions().filter(q => q.id !== id)); }

// ── Seed built-in content on first load ───────
// Runs once: imports all built-in cards, readings, and questions
// into the custom stores so teachers can edit, delete, or add to them.
// Guarded by a flag so it never runs twice.
const SEED_KEY = 'vn-content-seeded';

function seedBuiltinContent() {
  if (localStorage.getItem(SEED_KEY)) return; // already seeded

  const now = new Date().toISOString();

  // Cards — one entry per deck card
  if (typeof DECKS !== 'undefined') {
    const cards = [];
    Object.entries(DECKS).forEach(([deckName, deckCards]) => {
      deckCards.forEach(c => {
        cards.push({
          id:        makeId(),
          viet:      c.v,
          eng:       c.e,
          note:      c.n || '',
          deck:      deckName,
          lesson:    c.lesson || 1,
          builtin:   true,
          createdAt: now,
        });
      });
    });
    saveCustomCards(cards);
  }

  // Readings
  if (typeof READINGS !== 'undefined') {
    const readings = READINGS.map(r => ({
      id:        makeId(),
      title:     r.title,
      subtitle:  r.subtitle || '',
      type:      r.type,
      level:     r.level,
      duration:  r.duration || 2,
      intro:     r.intro || '',
      sentences: r.sentences.map(s => ({ vn: s.vn, en: s.en })),
      vocab:     r.vocab || [],
      builtin:   true,
      createdAt: now,
    }));
    saveCustomReadings(readings);
  }

  // Open questions
  if (typeof OPEN_QUESTIONS !== 'undefined') {
    const questions = OPEN_QUESTIONS.map(q => ({
      id:        makeId(),
      prompt:    q.prompt,
      model:     q.model,
      hints:     q.hints || [],
      tags:      q.tags  || [],
      lesson:    q.lesson || 1,
      builtin:   true,
      createdAt: now,
    }));
    saveCustomQuestions(questions);
  }

  localStorage.setItem(SEED_KEY, '1');
}
