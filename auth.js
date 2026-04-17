// ─────────────────────────────────────────────
// auth.js — shared auth + session logic
// ─────────────────────────────────────────────

const API_BASE = 'api/';

// ── API helper ────────────────────────────────
async function api(endpoint, body = null, method = null) {
  const token = localStorage.getItem('vn-token');
  const verb  = method || (body ? 'POST' : 'GET');
  const opts  = { method: verb, headers: {} };

  if (verb === 'POST') {
    const params = new URLSearchParams(flattenForForm(body || {}));
    if (token) params.set('_token', token);
    opts.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    opts.body = params.toString();
  } else {
    if (token) {
      const sep = endpoint.includes('?') ? '&' : '?';
      endpoint  = endpoint + sep + '_token=' + encodeURIComponent(token);
    }
  }

  const res  = await fetch(API_BASE + endpoint, opts);
  const data = await res.json().catch(() => ({ ok: false, error: 'Server error' }));
  if (!data.ok) throw new Error(data.error || 'Unknown error');
  return data;
}

function flattenForForm(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = Array.isArray(v) || (typeof v === 'object' && v !== null)
      ? JSON.stringify(v) : v;
  }
  return out;
}

// ── Session ───────────────────────────────────
function getSession() {
  const token = localStorage.getItem('vn-token');
  const uid   = localStorage.getItem('vn-uid');
  if (!token || !uid) return null;
  return {
    token,
    role: localStorage.getItem('vn-role'),
    uid:  parseInt(uid),
  };
}

function clearSession() {
  ['vn-token','vn-role','vn-uid','vn-name'].forEach(k => localStorage.removeItem(k));
}

async function logout() {
  try { await api('logout.php', {}); } catch (_) {}
  clearSession();
  window.location.href = 'login.html';
}

// ── Validate session on load ──────────────────
// Handles both normal sessions and view-as sessions.

// ── Progress sync ─────────────────────────────
let _syncTimer = null;
function scheduleSync() {
  clearTimeout(_syncTimer);
  _syncTimer = setTimeout(syncProgress, 2000);
}

async function syncProgress() {
  if (!getSession()) return;
  // Use live state if available, fall back to localStorage
  const s = (typeof state !== 'undefined') ? state : null;
  const d = {
    known:   s ? [...s.known] : JSON.parse(localStorage.getItem('vn-known') || '[]'),
    q_score: s ? s.qScore     : parseInt(localStorage.getItem('vn-qscore') || '0'),
    q_total: s ? s.qTotal     : parseInt(localStorage.getItem('vn-qtotal') || '0'),
    streak:  s ? s.streak     : parseInt(localStorage.getItem('vn-streak') || '0'),
    lessons: s ? s.lessons    : parseInt(localStorage.getItem('vn-lessons') || '5'),
  };
  try {
    await api('session.php', { action: 'save', ...d });
  } catch (_) {}
}

// ── View-as mode ──────────────────────────────
function isViewAs() {
  return !!localStorage.getItem('vn-va-token');
}

function getViewAsToken() {
  return localStorage.getItem('vn-va-token');
}

async function validateSession() {
  // View-as mode — verify via viewas.php instead of session.php
  const vaToken = getViewAsToken();
  if (vaToken) {
    try {
      const res = await fetch(API_BASE + 'viewas.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ action: 'verify', va_token: vaToken }).toString(),
      }).then(r => r.json());
      if (res.ok) return { ...res, view_as: true };
    } catch (_) {}
    // View-as token invalid — clear it and fall through to normal auth
    localStorage.removeItem('vn-va-token');
  }

  // Normal session
  const s = getSession();
  if (!s) {
    window.location.href = 'login.html';
    return null;
  }

  try {
    const res = await api('session.php', { action: 'get' });
    return res;
  } catch (err) {
    console.warn('Session check failed:', err.message);
    clearSession();
    window.location.href = 'login.html';
    return null;
  }
}

async function endViewAs() {
  const vaToken = getViewAsToken();
  if (vaToken) {
    try {
      await fetch(API_BASE + 'viewas.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ action: 'end', va_token: vaToken }).toString(),
      });
    } catch (_) {}
    localStorage.removeItem('vn-va-token');
  }
  window.location.href = 'admin.html';
}
