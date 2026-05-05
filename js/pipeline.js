// ============================================================
//  Lead Pipeline Page
// ============================================================

const STAGES = ['New', 'Consult Booked', 'Estimate Sent', 'Won'];
const STAGE_COLORS = {
  'New':           'var(--text3)',
  'Consult Booked':'var(--blue)',
  'Estimate Sent': 'var(--yellow)',
  'Won':           'var(--green)',
};

let pipelineFilter = 'all';

function renderPipeline() {
  const leads = SS.pipeline;
  const fmt   = n => '$' + n.toLocaleString();

  const totalValue    = leads.reduce((a, l) => a + l.value, 0);
  const wonValue      = leads.filter(l => l.stage === 'Won').reduce((a, l) => a + l.value, 0);
  const estSent       = leads.filter(l => l.stage === 'Estimate Sent' || l.stage === 'Won');
  const convRate      = estSent.length > 0 ? Math.round((leads.filter(l=>l.stage==='Won').length / estSent.length) * 100) : 0;

  const filtered = pipelineFilter === 'all' ? leads : leads.filter(l => l.stage === pipelineFilter);

  document.getElementById('page-pipeline').innerHTML = `
    <div class="page-header">
      <div class="page-eyebrow">Supreme Scapes · Sales</div>
      <h1 class="page-title">Lead Pipeline</h1>
      <p class="page-subtitle">Active opportunities tracked by stage.</p>
    </div>

    <!-- Stage summary cards -->
    <div class="pipeline-grid" style="margin-bottom:28px">
      ${STAGES.map(stage => {
        const stageleads = leads.filter(l => l.stage === stage);
        const stageVal   = stageleads.reduce((a,l) => a + l.value, 0);
        return `
          <div class="pipeline-stage" style="border-top:3px solid ${STAGE_COLORS[stage]}">
            <div class="stage-name">${stage}</div>
            <div class="stage-count" style="color:${STAGE_COLORS[stage]}">${stageleads.length}</div>
            <div class="stage-val">${fmt(stageVal)}</div>
          </div>
        `;
      }).join('')}
    </div>

    <!-- Summary row -->
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:28px">
      <div class="card">
        <div class="card-label">Total Pipeline Value</div>
        <div class="card-value" style="font-size:26px">${fmt(totalValue)}</div>
        <div class="card-sub">${leads.length} active leads</div>
      </div>
      <div class="card">
        <div class="card-label">Won This Month</div>
        <div class="card-value" style="font-size:26px;color:var(--green)">${fmt(wonValue)}</div>
        <div class="card-sub">${leads.filter(l=>l.stage==='Won').length} jobs closed</div>
      </div>
      <div class="card">
        <div class="card-label">Estimate Conversion</div>
        <div class="card-value" style="font-size:26px;color:var(--blue)">${convRate}%</div>
        <div class="card-sub">${leads.filter(l=>l.stage==='Won').length} of ${estSent.length} estimates won</div>
        <div class="progress-wrap">
          <div class="progress-track">
            <div class="progress-fill" style="width:${convRate}%;background:var(--blue)"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter -->
    <div class="filter-bar">
      <span class="filter-label">Stage:</span>
      ${['all', ...STAGES].map(f => `
        <button class="filter-btn ${pipelineFilter===f?'active':''}" onclick="setPipelineFilter('${f}')">
          ${f === 'all' ? 'All' : f}
        </button>
      `).join('')}
    </div>

    <!-- Table -->
    <div class="card" style="padding:0;overflow:hidden">
      <table class="data-table">
        <thead>
          <tr>
            <th>Lead</th>
            <th>Type</th>
            <th>Stage</th>
            <th>Value</th>
            <th>Source</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map(l => {
            const tc = TYPE_COLORS[l.type] || '#555';
            const sc = STAGE_COLORS[l.stage] || 'var(--text3)';
            const dateStr = new Date(l.date + 'T12:00:00').toLocaleDateString('en-US', { month:'short', day:'numeric' });
            return `
              <tr>
                <td class="td-primary">${l.name}</td>
                <td><span class="type-tag" style="background:${tc}22;color:${tc}">${l.type}</span></td>
                <td><span class="pill" style="background:${sc}22;color:${sc}">${l.stage}</span></td>
                <td style="font-family:'DM Mono',monospace;color:var(--text)">${fmt(l.value)}</td>
                <td>${l.source}</td>
                <td style="font-family:'DM Mono',monospace">${dateStr}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function setPipelineFilter(f) { pipelineFilter = f; renderPipeline(); }
