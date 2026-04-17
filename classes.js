// ─────────────────────────────────────────────
// classes.js — Class management UI
// Loaded on teacher.html after auth.js
// ─────────────────────────────────────────────

let activeClassId  = null;
let classesData    = [];  // cached from API

// ── INIT ──────────────────────────────────────
function initClassTab() {
  // New class button
  document.getElementById('btn-add-class').addEventListener('click', openAddClassModal);
  document.getElementById('btn-confirm-class').addEventListener('click', confirmCreateClass);
  document.getElementById('btn-cancel-class').addEventListener('click', closeAddClassModal);
  document.getElementById('add-class-modal').addEventListener('click', function(e) {
    if (e.target === this) closeAddClassModal();
  });

  // Cancel add-member modal
  document.getElementById('btn-cancel-member').addEventListener('click', closeAddMemberModal);
  document.getElementById('add-member-modal').addEventListener('click', function(e) {
    if (e.target === this) closeAddMemberModal();
  });
}

// ── LOAD CLASSES ──────────────────────────────
async function loadClasses() {
  const listEl = document.getElementById('t-class-list');
  listEl.innerHTML = `<div class="t-roster-empty">Loading...</div>`;

  try {
    const res  = await api('classes.php', { action: 'list' });
    classesData = res.classes || [];
    renderClassList();
  } catch (err) {
    listEl.innerHTML = `<div class="t-roster-empty" style="color:var(--red)">
      ${err.message}</div>`;
  }
}

// ── RENDER CLASS LIST ─────────────────────────
function renderClassList() {
  const listEl = document.getElementById('t-class-list');

  if (!classesData.length) {
    listEl.innerHTML = `<div class="t-roster-empty">No classes yet.<br>Click <strong>＋ New</strong> to create one.</div>`;
    return;
  }

  listEl.innerHTML = classesData.map(c => {
    const active = String(c.id) === String(activeClassId);
    return `
      <button class="t-student-chip ${active ? 'active' : ''}" data-id="${c.id}">
        <div class="t-chip-avatar" style="background:var(--teal)">🏫</div>
        <div class="t-chip-info">
          <div class="t-chip-name">${escHtml(c.name)}</div>
          <div class="t-chip-meta">${c.student_count} students · ${c.teacher_count} teachers</div>
        </div>
      </button>`;
  }).join('');

  listEl.querySelectorAll('.t-student-chip').forEach(chip => {
    chip.addEventListener('click', () => loadClassDetail(chip.dataset.id));
  });
}

// ── CLASS DETAIL ──────────────────────────────
async function loadClassDetail(id) {
  activeClassId = id;
  renderClassList();

  document.getElementById('t-class-empty').style.display  = 'none';
  document.getElementById('t-class-detail').style.display = 'block';

  try {
    const res = await api('classes.php', { action: 'get', class_id: id });
    renderClassDetail(res.class, res.members);
  } catch (err) {
    document.getElementById('tc-name').textContent = 'Error: ' + err.message;
  }
}

function renderClassDetail(cls, members) {
  document.getElementById('tc-name').textContent = cls.name;
  document.getElementById('tc-desc').textContent = cls.description || 'No description';

  // Delete button — only shown to creator
  const myId = parseInt(localStorage.getItem('vn-uid'));
  const deleteBtn = document.getElementById('btn-delete-class');
  deleteBtn.style.display = (cls.created_by == myId) ? '' : 'none';
  deleteBtn.onclick = () => deleteClass(cls.id, cls.name);

  // Teachers
  const teachers = members.filter(m => m.class_role === 'teacher');
  const teacherEl = document.getElementById('tc-teachers');
  teacherEl.innerHTML = teachers.length === 0
    ? `<p style="color:var(--ink-soft);font-size:.84rem;font-style:italic">No teachers yet.</p>`
    : teachers.map(m => memberRow(m, cls.id, 'teacher')).join('');

  // Students
  const students = members.filter(m => m.class_role === 'student');
  const studentEl = document.getElementById('tc-students');
  studentEl.innerHTML = students.length === 0
    ? `<p style="color:var(--ink-soft);font-size:.84rem;font-style:italic">No students yet.</p>`
    : students.map(m => memberRow(m, cls.id, 'student')).join('');

  // Add buttons
  document.getElementById('btn-add-teacher-to-class').onclick =
    () => openAddMemberModal(cls.id, 'teacher');
  document.getElementById('btn-add-student-to-class').onclick =
    () => openAddMemberModal(cls.id, 'student');
}

function memberRow(m, classId, role) {
  const name     = m.full_name || m.email;
  const accuracy = m.q_total > 0 ? Math.round(m.q_score / m.q_total * 100) + '%' : '-';
  const known    = (m.known || []).length;
  const meta     = role === 'student'
    ? `L${m.lessons} · ${known} known · ${accuracy} quiz`
    : m.email;

  return `
    <div class="ce-row" style="margin-bottom:.4rem">
      <div class="ce-row-main">
        <span class="ce-row-viet">${escHtml(name)}</span>
        <span class="ce-row-note">${escHtml(meta)}</span>
      </div>
      <div class="ce-row-actions">
        <button class="ce-delete-btn"
          onclick="removeMember(${classId}, ${m.id}, '${escHtml(name)}')">Remove</button>
      </div>
    </div>`;
}

async function removeMember(classId, userId, name) {
  if (!confirm(`Remove ${name} from this class?`)) return;
  try {
    await api('classes.php', { action: 'remove_member', class_id: classId, user_id: userId });
    loadClassDetail(classId);
    loadClasses(); // refresh counts in sidebar
    // Also refresh student roster so class names update
    if (typeof loadRosterFromApi === 'function') loadRosterFromApi();
  } catch (err) {
    alert(err.message);
  }
}

async function deleteClass(classId, name) {
  if (!confirm(`Delete class "${name}"? This will remove all students and teachers from it.`)) return;
  try {
    await api('classes.php', { action: 'delete', class_id: classId });
    activeClassId = null;
    document.getElementById('t-class-empty').style.display  = '';
    document.getElementById('t-class-detail').style.display = 'none';
    loadClasses();
    if (typeof loadRosterFromApi === 'function') loadRosterFromApi();
  } catch (err) {
    alert(err.message);
  }
}

// ── ADD MEMBER MODAL ──────────────────────────
async function openAddMemberModal(classId, role) {
  const modal   = document.getElementById('add-member-modal');
  const titleEl = document.getElementById('add-member-title');
  const listEl  = document.getElementById('add-member-list');

  titleEl.textContent = role === 'teacher' ? 'Add co-teacher' : 'Add student';
  listEl.innerHTML    = '<div style="color:var(--ink-soft);font-size:.84rem">Loading...</div>';
  modal.classList.add('visible');

  try {
    const res = await api('classes.php', { action: 'available_users', class_id: classId, role });
    const users = res.users || [];

    if (!users.length) {
      listEl.innerHTML = `<p style="color:var(--ink-soft);font-size:.84rem;font-style:italic">
        No available ${role}s to add.</p>`;
      return;
    }

    listEl.innerHTML = users.map(u => `
      <button class="t-student-chip" data-uid="${u.id}"
              style="width:100%;text-align:left">
        <div class="t-chip-avatar">${initials(u.full_name || u.email)}</div>
        <div class="t-chip-info">
          <div class="t-chip-name">${escHtml(u.full_name || u.email)}</div>
          <div class="t-chip-meta">${escHtml(u.email)}</div>
        </div>
      </button>`).join('');

    listEl.querySelectorAll('.t-student-chip').forEach(btn => {
      btn.addEventListener('click', async () => {
        btn.disabled = true;
        btn.style.opacity = '.5';
        try {
          await api('classes.php', {
            action: 'add_member', class_id: classId,
            user_id: btn.dataset.uid, role
          });
          closeAddMemberModal();
          loadClassDetail(classId);
          loadClasses();
          if (typeof loadRosterFromApi === 'function') loadRosterFromApi();
        } catch (err) {
          alert(err.message);
          btn.disabled = false;
          btn.style.opacity = '1';
        }
      });
    });
  } catch (err) {
    listEl.innerHTML = `<p style="color:var(--red);font-size:.84rem">${err.message}</p>`;
  }
}

function closeAddMemberModal() {
  document.getElementById('add-member-modal').classList.remove('visible');
}

// ── ADD CLASS MODAL ───────────────────────────
function openAddClassModal() {
  document.getElementById('new-class-name').value = '';
  document.getElementById('new-class-desc').value = '';
  document.getElementById('add-class-modal').classList.add('visible');
  setTimeout(() => document.getElementById('new-class-name').focus(), 80);
  document.getElementById('new-class-name').onkeydown = e => {
    if (e.key === 'Enter') confirmCreateClass();
  };
}

function closeAddClassModal() {
  document.getElementById('add-class-modal').classList.remove('visible');
}

async function confirmCreateClass() {
  const name = document.getElementById('new-class-name').value.trim();
  const desc = document.getElementById('new-class-desc').value.trim();
  if (!name) {
    document.getElementById('new-class-name').classList.add('error');
    return;
  }
  document.getElementById('new-class-name').classList.remove('error');

  try {
    const res = await api('classes.php', { action: 'create', name, description: desc });
    closeAddClassModal();
    await loadClasses();
    loadClassDetail(res.class_id);
  } catch (err) {
    alert(err.message);
  }
}

// ── HELPER ────────────────────────────────────
function escHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── INIT ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initClassTab();
});
