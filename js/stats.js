/* 统计页：图表与数据汇总 */
/* ---- 统计 ---- */
function fmtMins(secs) {
  const m = Math.round((secs || 0) / 60);
  if (m < 60) return m + " 分钟";
  return Math.floor(m / 60) + " 小时 " + (m % 60) + " 分";
}
function dayStats(key) {
  let secs = 0, nw = 0, np = 0, ns = 0, sessions = 0, autoW = 0, autoP = 0, readSecs = 0;
  const d = state.days[key];
  if (d && d.done) { secs += d.secs || 0; nw += d.nw || 0; np += d.np || 0; ns += d.ns || 0; }
  (state.sessions || []).forEach(s => {
    if (s.date === key) { secs += s.secs || 0; nw += s.nw || 0; np += s.np || 0; ns += s.ns || 0; sessions++; }
  });
  // 精读 / 场景阅读 的停留时长
  (state.activities || []).forEach(a => {
    if (a.date === key) { secs += a.secs || 0; readSecs += a.secs || 0; }
  });
  // 生词库自动计入：当天划词收进来的，单词算 nw、短语算 np
  (state.vocab || []).forEach(v => {
    if (v.added === key) {
      if (/\s/.test(v.display.trim())) { np++; autoP++; } else { nw++; autoW++; }
    }
    // 场景阅读中当天点开看过解释的词，也计入当天新学
    if (v.ctxSeenAt === key) { nw++; autoW++; }
  });
  return { secs, nw, np, ns, sessions, autoW, autoP, readSecs };
}
function allTotals() {
  let secs = 0, nw = 0, np = 0, ns = 0, done = 0, sessions = 0, readSecs = 0;
  Object.values(state.days).forEach(d => {
    if (d && d.done) { done++; secs += d.secs || 0; nw += d.nw || 0; np += d.np || 0; ns += d.ns || 0; }
  });
  (state.sessions || []).forEach(s => { sessions++; secs += s.secs || 0; nw += s.nw || 0; np += s.np || 0; ns += s.ns || 0; });
  (state.activities || []).forEach(a => { secs += a.secs || 0; readSecs += a.secs || 0; });
  (state.vocab || []).forEach(v => {
    if (/\s/.test(v.display.trim())) np++; else nw++;
  });
  return { secs, nw, np, ns, done, sessions, readSecs };
}
function svgBarChart(rows, series, opts = {}) {
  const W = 620, H = 240, padL = 40, padR = 8, padT = 20, padB = 30;
  const n = rows.length, bw = (W - padL - padR) / n;
  const totals = rows.map(r => series.reduce((a, s) => a + (r[s.key] || 0), 0));
  const rawMax = Math.max(opts.min || 1, ...totals);
  const step = Math.max(1, Math.ceil(rawMax / 4));
  const top = Math.ceil(rawMax / step) * step;
  const yv = v => padT + (H - padT - padB) * (1 - v / top);
  let svg = "";
  for (let v = step; v <= top; v += step) {
    svg += `<line x1="${padL}" y1="${yv(v).toFixed(1)}" x2="${W - padR}" y2="${yv(v).toFixed(1)}" stroke="#e3e7e4"/>` +
      `<text x="${padL - 6}" y="${(yv(v) + 3).toFixed(1)}" text-anchor="end" font-size="10" fill="#8a938e">${v}</text>`;
  }
  svg += `<line x1="${padL}" y1="${H - padB}" x2="${W - padR}" y2="${H - padB}" stroke="#c8cfcb"/>`;
  rows.forEach((r, i) => {
    const x = padL + i * bw + 2, w = bw - 4;
    let acc = 0;
    series.forEach(s => {
      const v = r[s.key] || 0;
      if (v > 0) {
        const y1 = yv(acc + v), y2 = yv(acc);
        svg += `<rect x="${x.toFixed(1)}" y="${y1.toFixed(1)}" width="${w.toFixed(1)}" height="${Math.max(2, y2 - y1).toFixed(1)}" rx="2" fill="${s.color}"/>`;
      }
      acc += v;
    });
    if (totals[i] > 0) svg += `<text x="${(x + w / 2).toFixed(1)}" y="${(yv(totals[i]) - 5).toFixed(1)}" text-anchor="middle" font-size="10" font-weight="600" fill="#5c6660">${totals[i]}${opts.unit || ""}</text>`;
    svg += `<text x="${(x + w / 2).toFixed(1)}" y="${H - padB + 14}" text-anchor="middle" font-size="9.5" fill="#8a938e">${r.k.slice(5).replace("-", "/")}</text>`;
  });
  return `<svg class="chart-svg" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${svg}</svg>`;
}
function renderStats(main) {
  const tot = allTotals();
  const today = dayStats(todayKey());
  const keys = []; for (let i = 13; i >= 0; i--) keys.push(todayKey(-i));
  const rows = keys.map(k => Object.assign({ k }, dayStats(k)));
  const durRows = rows.map(r => ({ k: r.k, m: Math.ceil((r.secs || 0) / 60) }));
  const items = tot.nw + tot.np + tot.ns;
  const dayToday = state.days[todayKey()];
  main.innerHTML = `
    <div class="stat-row">
      <div class="stat amber"><b>${Math.round(tot.secs / 60)}</b><span>累计学习（分钟）</span></div>
      <div class="stat"><b>${tot.nw}</b><span>新学单词</span></div>
      <div class="stat"><b>${tot.np}</b><span>新学短语</span></div>
      <div class="stat"><b>${tot.ns}</b><span>新学句子</span></div>
    </div>
    <div class="card">
      <div class="section-title">近 14 天学习时长（分钟 / 天）</div>
      ${svgBarChart(durRows, [{ key: "m", color: "#17795b" }], { min: 5 })}
      <p class="hint">打卡 + 加练 + 精读 + 场景阅读 + 生词库 都算。每天几分钟，柱子连成一片就是你的坚持。</p>
    </div>
    <div class="card">
      <div class="section-title">近 14 天新学内容（条 / 天）</div>
      <div class="legend">
        <span><i style="background:#17795b"></i>单词</span>
        <span><i style="background:#d97b1e"></i>短语</span>
        <span><i style="background:#4a7fa5"></i>句子</span>
      </div>
      ${svgBarChart(rows, [
        { key: "nw", color: "#17795b" },
        { key: "np", color: "#d97b1e" },
        { key: "ns", color: "#4a7fa5" },
      ], { min: 4 })}
    </div>
    <div class="card">
      <div class="section-title">今天</div>
      <p style="font-size:14px">学习 ${fmtMins(today.secs)} · 打卡${dayToday && dayToday.done ? " ✓" : " ✗"} · 加练 ${today.sessions} 次${today.readSecs ? " · 精读/场景阅读/生词库 " + fmtMins(today.readSecs) : ""} · 新学 ${today.nw + today.np + today.ns} 条${(today.autoW || today.autoP) ? `（含生词库新收 ${today.autoW} 词 ${today.autoP} 短语）` : ""}</p>
      ${items ? `<p class="hint" style="margin-top:6px">开工至今攒下 <b style="color:var(--accent)">${items}</b> 个新表达（${tot.nw} 词 · ${tot.np} 短语 · ${tot.ns} 句），总时长 ${fmtMins(tot.secs)}。慢慢来，比较快。</p>` : `<p class="hint" style="margin-top:6px">学完在「今天」或「加练」页记一笔新学内容，这里就会长出你的成就曲线。</p>`}
    </div>`;
}

