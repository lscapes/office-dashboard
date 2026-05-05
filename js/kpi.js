// ============================================================
//  KPI Page
// ============================================================

function renderKPI() {
  const { revenue, ap, leads, revenueByType } = SS;

  const ytdPct   = Math.round((revenue.actual / revenue.goal) * 100);
  const apColor  = ap.current <= ap.goal ? 'var(--green)' : ap.current <= 16 ? 'var(--yellow)' : 'var(--red)';
  const apPill   = ap.current <= ap.goal ? 'pill-green' : ap.current <= 16 ? 'pill-yellow' : 'pill-red';
  const convRate = leads.won > 0 ? Math.round((leads.won / leads.estimateSent) * 100) : 0;
  const maxRev   = Math.max(...revenueByType.map(r => r.value));

  const fmt = n => '$' + n.toLocaleString();
  const fmtM = n => n >= 1000000 ? '$' + (n/1000000).toFixed(2) + 'M' : '$' + n.toLocaleString();

  document.getElementById('page-kpi').innerHTML = `
    <div class="page-header">
      <div class="page-eyebrow">Supreme Scapes · ${revenue.month}</div>
      <h1 class="page-title">KPI Overview</h1>
      <p class="page-subtitle">Revenue, pipeline health, and operational benchmarks.</p>
    </div>

    <!-- Top KPI cards -->
    <div class="kpi-grid">

      <div class="card" style="border-left:3px solid var(--accent)">
        <div class="card-label">Revenue vs. Goal</div>
        <div class="card-value" style="font-size:28px">${fmtM(revenue.actual)}</div>
        <div class="card-sub">of ${fmtM(revenue.goal)} goal · ${ytdPct}% YTD</div>
        <div class="progress-wrap">
          <div class="progress-track">
            <div class="progress-fill" style="width:${ytdPct}%;background:var(--accent)"></div>
          </div>
        </div>
      </div>

      <div class="card" style="border-left:3px solid ${apColor}">
        <div class="card-label">AP as % of COGS</div>
        <div class="card-value" style="color:${apColor}">${ap.current}%</div>
        <div class="card-sub" style="display:flex;align-items:center;gap:8px;margin-top:8px">
          <span class="pill ${apPill}">${ap.current <= ap.goal ? '✓ On Target' : ap.current <= 16 ? '⚡ Watch' : '✗ High'}</span>
          <span>Goal: ${ap.goal}%</span>
        </div>
        <div class="progress-wrap">
          <div class="progress-track">
            <div class="progress-fill" style="width:${Math.min(100, (ap.current/ap.stressed)*100)}%;background:${apColor}"></div>
          </div>
        </div>
        <div class="card-sub" style="margin-top:6px;font-size:11px">Was ${ap.stressed}% · now ${ap.current}% · goal ${ap.goal}%</div>
      </div>

      <div class="card" style="border-left:3px solid var(--blue)">
        <div class="card-label">Estimates Sent</div>
        <div class="card-value">${leads.estimateSent}</div>
        <div class="card-sub">${leads.won} won · <strong style="color:var(--blue)">${convRate}%</strong> conversion</div>
        <div class="progress-wrap">
          <div class="progress-track">
            <div class="progress-fill" style="width:${convRate}%;background:var(--blue)"></div>
          </div>
        </div>
      </div>

      <div class="card" style="border-left:3px solid var(--green)">
        <div class="card-label">Leads in Pipeline</div>
        <div class="card-value">${leads.new + leads.qualified + leads.estimateSent}</div>
        <div class="card-sub">${leads.new} new · ${leads.qualified} qualified · ${leads.estimateSent} estimates out</div>
      </div>

      <div class="card" style="border-left:3px solid var(--purple)">
        <div class="card-label">Avg. Job Value</div>
        <div class="card-value">${fmt(leads.avgJobValue)}</div>
        <div class="card-sub">${leads.won} jobs won this month</div>
      </div>

    </div>

    <!-- Revenue by type -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">

      <div class="card">
        <div class="section-title">Revenue by Service Type</div>
        <div class="bar-chart">
          ${revenueByType.map(r => `
            <div class="bar-row">
              <div class="bar-label">${r.label}</div>
              <div class="bar-track">
                <div class="bar-fill" style="width:${Math.round((r.value/maxRev)*100)}%;background:${r.color}"></div>
              </div>
              <div class="bar-val">${fmtM(r.value)}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="card">
        <div class="section-title">Commercial vs. Residential Mix</div>
        ${(() => {
          const commercial = revenueByType.find(r => r.label === 'Commercial')?.value || 0;
          const total      = revenueByType.reduce((a, r) => a + r.value, 0);
          const commPct    = Math.round((commercial / total) * 100);
          const resPct     = 100 - commPct;
          return `
            <div style="display:flex;gap:0;border-radius:6px;overflow:hidden;height:40px;margin-bottom:16px">
              <div style="width:${resPct}%;background:#374151;display:flex;align-items:center;justify-content:center">
                <span style="font-size:11px;color:#9ca3af;font-family:'DM Mono',monospace">RES ${resPct}%</span>
              </div>
              <div style="width:${commPct}%;background:var(--blue);display:flex;align-items:center;justify-content:center">
                <span style="font-size:11px;color:#fff;font-family:'DM Mono',monospace;font-weight:600">COMM ${commPct}%</span>
              </div>
            </div>
            <div style="font-size:12px;color:var(--text3);line-height:1.6">
              Commercial: <strong style="color:var(--blue)">${fmtM(commercial)}</strong><br/>
              Residential: <strong style="color:var(--text2)">${fmtM(total - commercial)}</strong><br/>
              <span style="font-size:11px">Goal: 50% commercial mix</span>
            </div>
          `;
        })()}
      </div>

    </div>
  `;
}
