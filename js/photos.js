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
      <button onclick="toggleAddJob()" style="margin-top:8px;background:#22c55e;color:#fff;border:none;border-radius:6px;padding:10px 18px;cursor:pointer;font-family:'DM Mono',monospace;font-size:11px;font-weight:700;letter-spacing:0.5px;white-space:nowrap">+ ADD JOB</button>
    </div>

    <div id="add-job-form" style="display:none;background:var(--bg2);border:1px solid var(--border2);border-radius:10px;padding:24px;margin-bottom:24px">
      <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--text3);font-family:'DM Mono',monospace;margin-bottom:16px">New Project</div>
      <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:12px;margin-bottom:12px">
        <div>
          <label style="font-size:10px;color:var(--text3);display:block;margin-bottom:4px;font-family:'DM Mono',monospace;letter-spacing:1px">PROJECT NAME</label>
          <input id="new-name" placeholder="e.g. Smith Backyard Patio" style="width:100%;padding:8px 10px;border:1px solid var(--border2);border-radius:6px;font-size:13px;background:var(--bg3);color:var(--text);box-sizing:border-box" />
        </div>
        <div>
          <label style="font-size:10px;color:var(--text3);display:block;margin-bottom:4px;font-family:'DM Mono',monospace;letter-spacing:1px">TYPE</label>
          <select id="new-type" style="width:100%;padding:8px 10px;border:1px solid var(--border2);border-radius:6px;font-size:13px;background:var(--bg3);color:var(--text)">
            <option>Hardscape</option>
            <option>Landscape Install</option>
            <option>Lawn</option>
            <option>Commercial Maint.</option>
            <option>Snow</option>
          </select>
        </div>
        <div>
          <label style="font-size:10px;color:var(--text3);display:block;margin-bottom:4px;font-family:'DM Mono',monospace;letter-spacing:1px">PM</label>
          <select id="new-pm" style="width:100%;padding:8px 10px;border:1px solid var(--border2);border-radius:6px;font-size:13px;background:var(--bg3);color:var(--text)">
            <option>Kevin</option><option>Jake</option><option>Jamie</option>
          </select>
        </div>
        <div>
          <label style="font-size:10px;color:var(--text3);display:block;margin-bottom:4px;font-family:'DM Mono',monospace;letter-spacing:1px">JOB DATE</label>
          <input id="new-date" type="date" style="width:100%;padding:8px 10px;border:1px solid var(--border2);border-radius:6px;font-size:13px;background:var(--bg3);color:var(--text)" />
        </div>
      </div>
      <div style="display:flex;gap:10px">
        <button onclick="addJob()" style="background:#22c55e;color:#fff;border:none;border-radius:6px;padding:9px 20px;cursor:pointer;font-family:'DM Mono',monospace;font-size:11px;font-weight:700">ADD PROJECT</button>
        <button onclick="toggleAddJob()" style="background:transparent;color:var(--text3);border:1px solid var(--border2);border-radius:6px;padding:9px 16px;cursor:pointer;font-size:12px">Cancel</button>
      </div>
    </div>

    <div style="display:flex;gap:20px;flex-wrap:wrap;margin-bottom:28px">
      ${[
        { label:'Complete',    val: complete,   color:'var(--green)'  },
        { label:'In Progress', val: partial,    color:'var(--yellow)' },
        { label:'Not Started', val: missing,    color:'var(--red)'    },
        { label:'Total Jobs',  val: projects.length, color:'var(--text3)' },
      ].map(s => `
        <div class="card" style="flex:1;min-width:120px;border-top:3px solid ${s.color}">
          <div style="font-family:'DM Serif Display',serif;font-size:36px;color:${s.color};line-height:1">${s.val}</div>
          <div style="font-size:10px;color:var(--text3);margin-top:4px;letter-spacing:2px;text-transform:uppercase;font-family:'DM Mono',monospace">${s.label}</div>
        </div>
      `).join('')}
      <div class="card" style="flex:1;min-width:120px;border-top:3px solid ${statusColor(overallPct)}">
        <div style="font-family:'DM Serif Display',serif;font-size:36px;color:${statusColor(overallPct)};line-height:1">${overallPct}%</div>
        <div style="font-size:10px;color:var(--text3);margin-top:4px;letter-spacing:2px;text-transform:uppercase;font-family:'DM Mono',monospace">Overall</div>
        <div class="progress-wrap">
          <div class="progress-track">
            <div class="progress-fill" style="width:${overallPct}%;background:${statusColor(overallPct)}"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="filter-bar">
      <span class="filter-label">Status:</span>
      ${['all','complete','partial','missing'].map(f => `
        <button class="filter-btn ${photoFilter===f?'active':''}" onclick="setPhotoFilter('${f}')">
          ${f==='all'?'All':f==='complete'?'✓ Complete':f==='partial'?'⚡ In Progress':'✗ Not Started'}
        </button>
      `).join('')}
      <span class="filter-label" style="margin-left:8px">PM:</span>
      ${['all','Kevin','Jake','Jamie'].map(pm => `
        <button class="filter-btn ${pmFilter===pm?'active':''}" onclick="setPMFilter('${pm}')">
          ${pm==='all'?'All PMs':pm}
        </button>
      `).join('')}
    </div>

    <div style="display:flex;gap:20px;margin-bottom:16px;flex-wrap:wrap">
      <div style="display:flex;align-items:center;gap:6px;font-size:11px;color:var(--text3)">
        <div style="width:10px;height:10px;border-radius:50%;background:var(--green)"></div> Standard (all projects)
      </div>
      <div style="display:flex;align-items:center;gap:6px;font-size:11px;color:var(--text3)">
        <div style="width:10px;height:10px;border-radius:50%;background:var(--purple)"></div> 🛸 Drone (Hardscape + Landscape Installs)
      </div>
      <div style="display:flex;align-items:center;gap:6px;font-size:11px;color:var(--text3)">
        <div style="width:10px;height:10px;border-radius:50%;background:#fbbf24"></div> 📸 Jessa (bigger jobs, as needed)
      </div>
      <div style="display:flex;align-items:center;gap:6px;font-size:11px;color:var(--text3)">
        <div style="width:10px;height:10px;border-radius:50%;background:var(--green)"></div> 🗂️ Organized (content filed away)
      </div>
    </div>

    <div id="photo-list">
      ${filtered.map(p => renderPhotoCard(p)).join('')}
      ${filtered.length === 0 ? '<div style="text-align:center;color:var(--text3);padding:60px;font-style:italic">No projects match this filter.</div>' : ''}
    </div>
  `;
}

function renderPhotoCard(p) {
  const { pct, done, total } = getCompletion(p);
  const color   = statusColor(pct);
  const drone   = DRONE_TYPES.includes(p.type);
  const tc      = TYPE_COLORS[p.type] || '#555';
  const dateStr = new Date(p.date + 'T12:00:00').toLocaleDateString('en-US', { month:'short', day:'numeric' });

  return `
    <div class="photo-card" id="pc-${p.id}" style="border-left-color:${color}">
      <div class="photo-card-header" onclick="toggleCard(${p.id})">
        <div style="flex:1;min-width:180px">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
            <span style="font-weight:500;font-size:15px;color:var(--text)">${p.name}</span>
            ${drone ? '<span style="font-size:13px">🛸</span>' : ''}
          </div>
          <div style="display:flex;gap:8px;align-items:center">
            <span class="type-tag" style="background:${tc}22;color:${tc}">${p.type}</span>
            <span style="font-size:11px;color:var(--text3)">PM: ${p.pm}</span>
            <span style="font-size:11px;color:var(--text3)">· ${dateStr}</span>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:14px">
          <div style="display:flex;flex-direction:column;gap:5px;align-items:flex-end" onclick="event.stopPropagation()">
            <button onclick="toggleJessa(${p.id},'needed')" style="display:flex;align-items:center;gap:6px;padding:4px 10px;border-radius:6px;border:1.5px solid ${p.jessaNeeded?'#f59e0b':'var(--border2)'};background:${p.jessaNeeded?'#2a1f0a':'var(--bg3)'};cursor:pointer;white-space:nowrap">
              <span style="font-size:11px">📸</span>
              <span style="font-size:10px;font-family:'DM Mono',monospace;color:${p.jessaNeeded?'#fbbf24':'var(--text3)'}">Jessa ${p.jessaNeeded?'Needed':'Needed?'}</span>
              <span style="font-size:9px;color:${p.jessaNeeded?'#fbbf24':'var(--text3)'}">${p.jessaNeeded?'✓':'○'}</span>
            </button>
            ${p.jessaNeeded ? `
              <button onclick="toggleJessa(${p.id},'done')" style="display:flex;align-items:center;gap:6px;padding:4px 10px;border-radius:6px;border:1.5px solid ${p.jessaDone?'var(--green)':'var(--border2)'};background:${p.jessaDone?'#052e16':'var(--bg3)'};cursor:pointer;white-space:nowrap">
                <span style="font-size:10px;font-family:'DM Mono',monospace;color:${p.jessaDone?'var(--green)':'var(--text3)'}">${p.jessaDone?'✓ Jessa Done':'○ Jessa Done?'}</span>
              </button>
            ` : ''}
            <button onclick="toggleOrganized(${p.id})" style="display:flex;align-items:center;gap:6px;padding:4px 10px;border-radius:6px;border:1.5px solid ${p.organized?'var(--green)':'var(--border2)'};background:${p.organized?'#052e16':'var(--bg3)'};cursor:pointer;white-space:nowrap">
              <span style="font-size:11px">🗂️</span>
              <span style="font-size:10px;font-family:'DM Mono',monospace;color:${p.organized?'var(--green)':'var(--text3)'}">${p.organized?'✓ Organized':'Organized?'}</span>
            </button>
          </div>
          <div style="text-align:right">
            <div style="font-size:22px;font-weight:300;color:${color};font-family:'DM Mono',monospace;line-height:1">${pct}%</div>
            <div style="font-size:10px;color:var(--text3);font-family:'DM Mono',monospace">${done}/${total} shots</div>
          </div>
          <span class="pill ${pct===100?'pill-green':pct>0?'pill-yellow':'pill-red'}">${statusLabel(pct)}</span>
          <span style="color:var(--text3);font-size:12px;transition:transform 0.2s" id="arrow-${p.id}">▼</span>
          <button onclick="event.stopPropagation();deleteJob(${p.id})" title="Delete job" style="background:transparent;border:1px solid var(--border2);border-radius:6px;padding:4px 8px;cursor:pointer;color:var(--text3);font-size:12px;line-height:1" onmouseover="this.style.borderColor='var(--red)';this.style.color='var(--red)'" onmouseout="this.style.borderColor='var(--border2)';this.style.color='var(--text3)'">✕</button>
        </div>
      </div>
      <div style="height:2px;background:var(--bg3)">
        <div style="width:${pct}%;height:100%;background:${color};transition:width 0.4s ease"></div>
      </div>
      <div class="photo-card-body" id="pb-${p.id}">
        <div class="phase-grid">
          ${PHASES.map(phase => `
            <div>
              <div class="phase-label">${phase}</div>
              ${SHOT_TYPES.filter(s => !s.droneOnly || drone).map(shot => {
                const key  = `${phase}_${shot.id}`;
                const done = p.shots[key];
                const cls  = done ? (shot.droneOnly ? 'done-drone' : 'done-std') : '';
                return `
                  <button class="shot-btn ${cls}" onclick="toggleShot(${p.id},'${key}')">
                    <span class="shot-icon">${shot.icon}</span>
                    <div>
                      <div class="shot-name">${shot.label}</div>
                      <div class="shot-desc">${shot.desc}</div>
                    </div>
                    <div class="shot-check">${done ? '✓' : ''}</div>
                  </button>
                `;
              }).join('')}
            </div>
          `).join('')}
        </div>
        ${p.notes ? `<div style="margin-top:14px;font-size:12px;color:var(--text3);border-top:1px solid var(--border);padding-top:10px;font-style:italic">${p.notes}</div>` : ''}
      </div>
    </div>
  `;
}

function toggleCard(id) {
  const body  = document.getElementById(`pb-${id}`);
  const arrow = document.getElementById(`arrow-${id}`);
  const open  = body.classList.toggle('open');
  arrow.style.transform = open ? 'rotate(180deg)' : 'rotate(0deg)';
}

function toggleShot(id, key) {
  const p = photoState.find(p => p.id === id);
  if (!p) return;
  p.shots[key] = !p.shots[key];
  savePhotoState();
  renderPhotoPage();
}

function toggleAddJob() {
  const form = document.getElementById('add-job-form');
  if (form) form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function addJob() {
  const name = document.getElementById('new-name')?.value?.trim();
  const type = document.getElementById('new-type')?.value;
  const pm   = document.getElementById('new-pm')?.value;
  const date = document.getElementById('new-date')?.value;
  if (!name || !date) { alert('Please enter a project name and date.'); return; }
  photoState.push({
    id: Date.now(), name, type, pm, date,
    notes: '', shots: {},
    jessaNeeded: false, jessaDone: false, organized: false
  });
  savePhotoState();
  renderPhotoPage();
}

function deleteJob(id) {
  if (!confirm('Delete this project? This cannot be undone.')) return;
  photoState = photoState.filter(p => p.id !== id);
  savePhotoState();
  renderPhotoPage();
}

function toggleOrganized(id) {
  const p = photoState.find(p => p.id === id);
  if (!p) return;
  p.organized = !p.organized;
  savePhotoState();
  renderPhotoPage();
}

function toggleJessa(id, field) {
  const p = photoState.find(p => p.id === id);
  if (!p) return;
  if (field === 'needed') {
    p.jessaNeeded = !p.jessaNeeded;
    if (!p.jessaNeeded) p.jessaDone = false;
  } else {
    p.jessaDone = !p.jessaDone;
  }
  savePhotoState();
  renderPhotoPage();
}

function setPhotoFilter(f) { photoFilter = f; renderPhotoPage(); }
function setPMFilter(pm)    { pmFilter = pm;   renderPhotoPage(); }
