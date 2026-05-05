// ============================================================
//  Photo Tracker Page
// ============================================================

const PHASES      = ['Before', 'During', 'After'];
const DRONE_TYPES = ['Hardscape', 'Landscape Install'];
const TYPE_COLORS = {
  'Hardscape':        '#b45309',
  'Landscape Install':'#15803d',
  'Lawn':             '#65a30d',
  'Commercial Maint.':'#0369a1',
  'Snow':             '#6366f1',
};
const SHOT_TYPES = [
  { id: 'stills',       label: 'Stills',       icon: '📷', desc: 'Ground photos',  droneOnly: false },
  { id: 'walkthrough',  label: 'Walk-through',  icon: '🎥', desc: 'Vertical video', droneOnly: false },
  { id: 'drone_stills', label: 'Drone Stills',  icon: '🛸', desc: 'Aerial photos',  droneOnly: true  },
  { id: 'drone_video',  label: 'Drone Video',   icon: '🚁', desc: 'Aerial video',   droneOnly: true  },
];

let photoState = null;
let photoFilter = 'all';
let pmFilter = 'all';

const STORAGE_KEY = 'ss_photo_tracker';

function savePhotoState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(photoState));
  } catch(e) {
    console.warn('Could not save to localStorage:', e);
  }
}

function initPhotoState() {
  if (photoState) return;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const savedIds = new Set(parsed.map(p => p.id));
      const newFromData = SS.projects.filter(p => !savedIds.has(p.id));
      photoState = [...parsed, ...newFromData];
    } else {
      photoState = JSON.parse(JSON.stringify(SS.projects));
    }
  } catch(e) {
    photoState = JSON.parse(JSON.stringify(SS.projects));
  }
}

function getRequired(type) {
  const drone = DRONE_TYPES.includes(type);
  const keys = [];
  PHASES.forEach(ph => SHOT_TYPES.forEach(s => { if (!s.droneOnly || drone) keys.push(`${ph}_${s.id}`); }));
  return keys;
}

function getCompletion(project) {
  const req  = getRequired(project.type);
  const done = req.filter(k => project.shots[k]).length;
  return { total: req.length, done, pct: Math.round((done / req.length) * 100) };
}

function statusColor(pct) {
  return pct === 100 ? 'var(--green)' : pct > 0 ? 'var(--yellow)' : 'var(--red)';
}
function statusLabel(pct) {
  return pct === 100 ? '✓ Complete' : pct > 0 ? `⚡ ${pct}%` : '✗ Missing';
}

function renderPhotoPage() {
  initPhotoState();
  const projects = photoState;

  const allStats   = projects.map(p => getCompletion(p));
  const complete   = allStats.filter(s => s.pct === 100).length;
  const partial    = allStats.filter(s => s.pct > 0 && s.pct < 100).length;
  const missing    = allStats.filter(s => s.pct === 0).length;
  const overallPct = Math.round(allStats.reduce((a, s) => a + s.pct, 0) / allStats.length);

  const filtered = projects.filter(p => {
    const { pct } = getCompletion(p);
    const sOk = photoFilter === 'all'
      || (photoFilter === 'complete' && pct === 100)
      || (photoFilter === 'partial'  && pct > 0 && pct < 100)
      || (photoFilter === 'missing'  && pct === 0);
    const pmOk = pmFilter === 'all' || p.pm === pmFilter;
    return sOk && pmOk;
  });

  document.getElementById('page-photos').innerHTML = `
    <div class="page-header" style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px">
      <div>
        <div class="page-eyebrow">Supreme Scapes · Content</div>
        <h1 class="page-title">Photo & Video Tracker</h1>
        <p class="page-subtitle">Stills · Walk-throughs · Drone — every phase, every project.</p>
      </div>
      <button onclick="toggleAddJob()" style="margin-top:8px;background:#22c55e;color:#fff;border:none;border-radius:6px;padding:10px 18px;cursor:pointer;font-family:'DM Mono',monospace;font-size:11px;font-we
