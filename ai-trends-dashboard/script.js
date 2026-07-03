const D = DASHBOARD_DATA;

function renderMasthead() {
  document.getElementById("dateline-date").textContent = D.updated;
  document.getElementById("dateline-mode").textContent = D.mode;
}

function renderStats() {
  const root = document.getElementById("stats");
  root.innerHTML = D.stats
    .map(
      (s) => `
      <div class="stat">
        <div class="value">${s.value}<span class="unit">${s.unit}</span></div>
        <div class="label">${s.label}</div>
        <div class="delta">${s.delta}</div>
      </div>`
    )
    .join("");
}

function renderLineChart() {
  const series = D.claudeAdoptionSeries;
  const w = 420, h = 160, padL = 8, padR = 8, padT = 18, padB = 26;
  const maxV = Math.max(...series.map((p) => p.value)) * 1.25;
  const stepX = (w - padL - padR) / (series.length - 1);
  const x = (i) => padL + i * stepX;
  const y = (v) => padT + (1 - v / maxV) * (h - padT - padB);

  const linePts = series.map((p, i) => `${x(i)},${y(p.value)}`).join(" ");
  const areaPts = `${x(0)},${y(0)} ${linePts} ${x(series.length - 1)},${y(0)}`;

  const gridLines = [0.5, 1].map((f) => {
    const gy = padT + (1 - f) * (h - padT - padB);
    return `<line class="grid-line" x1="${padL}" y1="${gy}" x2="${w - padR}" y2="${gy}" />`;
  });

  const points = series.map((p, i) => {
    const isEnd = i === series.length - 1;
    const cx = x(i), cy = y(p.value);
    const labelY = h - 8;
    return `
      <circle class="pt${isEnd ? " end" : ""}" cx="${cx}" cy="${cy}" r="${isEnd ? 4.5 : 3.5}" />
      <text class="pt-value" x="${cx}" y="${cy - 10}" text-anchor="middle">${p.value}%</text>
      <text class="axis-label" x="${cx}" y="${labelY}" text-anchor="middle">${p.label}</text>
      <title>${p.label}: ${p.value}% workplace adoption</title>
    `;
  });

  document.getElementById("line-chart").innerHTML = `
    <svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Claude Code workplace adoption grew from 3% in Apr-Jun 2025 to 18% in Jan 2026">
      ${gridLines.join("")}
      <polygon class="area-fill" points="${areaPts}" />
      <polyline class="line-path" points="${linePts}" />
      ${points.join("")}
    </svg>
    <details class="table-toggle">
      <summary>Show data table</summary>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Period</th><th>Workplace adoption</th></tr></thead>
          <tbody>
            ${series.map((p) => `<tr><td>${p.label}</td><td class="num">${p.value}%</td></tr>`).join("")}
          </tbody>
        </table>
      </div>
    </details>
  `;
}

function renderBars() {
  const bars = D.toolAdoptionBars;
  const maxV = Math.max(...bars.map((b) => b.value));
  document.getElementById("bars").innerHTML = bars
    .map(
      (b) => `
      <div class="bar-row" title="${b.name}: ${b.value}% — ${b.note}">
        <div class="name"><span class="swatch" style="background:${b.color}"></span>${b.name}</div>
        <div class="bar-track">
          <div class="bar-fill" style="width:${(b.value / maxV) * 100}%; background:${b.color}"></div>
        </div>
        <div class="pct">${b.value}%</div>
      </div>`
    )
    .join("");

  document.getElementById("bars-table").innerHTML = `
    <details class="table-toggle">
      <summary>Show data table</summary>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Tool</th><th>Workplace adoption</th><th>Note</th></tr></thead>
          <tbody>
            ${bars.map((b) => `<tr><td>${b.name}</td><td class="num">${b.value}%</td><td class="desc-cell">${b.note}</td></tr>`).join("")}
          </tbody>
        </table>
      </div>
    </details>
  `;
}

function renderChecklist() {
  document.getElementById("checklist").innerHTML = D.bestPractices
    .map(
      (item, i) => `
      <li>
        <span class="num">${String(i + 1).padStart(2, "0")}</span>
        <span>
          <strong>${item.title}</strong>
          <span class="desc">${item.desc}</span>
        </span>
      </li>`
    )
    .join("");
}

function renderSignal() {
  const s = D.vendorTips;
  document.getElementById("signal").innerHTML = `
    <p style="font-size:12.5px; color:var(--ink-muted); margin:0 0 14px;">${s.windowLabel}</p>
    <ul class="vendor-tips">
      ${s.items
        .map(
          (t) => `
        <li>
          <div class="vendor-tips-meta">
            <span class="vendor-name">${t.vendor}</span>
            <span class="vendor-when">${t.when}</span>
          </div>
          <p>${t.tip}</p>
        </li>`
        )
        .join("")}
    </ul>
    <div class="caveat">${s.note}</div>
  `;
}

function renderComparison() {
  document.getElementById("comparison-body").innerHTML = D.comparison
    .map(
      (c) => `
      <tr>
        <td class="tool-name"><span class="swatch" style="background:${c.color}"></span>${c.name}</td>
        <td class="num">${c.adoption}</td>
        <td class="desc-cell">${c.model}</td>
      </tr>`
    )
    .join("");
}

function renderSources() {
  document.getElementById("sources").innerHTML = D.sources
    .map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.title}</a></li>`)
    .join("");
}

renderMasthead();
renderStats();
renderLineChart();
renderBars();
renderChecklist();
renderSignal();
renderComparison();
renderSources();
