/* ---- 日记：日历 + 当天/历史写作 ---- */
let journalCursor = null; // {y, m}（m 从 0 起）
let journalSel = null;    // 选中的日期 key
let journalCalOpen = false; // 月历默认收起，写作区优先
let journalTips = [];     // AI 点评结果（不持久化）

function renderJournal(main) {
  const today = todayKey();
  if (!journalSel) journalSel = today;
  if (!journalCursor) { const d = new Date(); journalCursor = { y: d.getFullYear(), m: d.getMonth() }; }
  const { y, m } = journalCursor;
  const journal = state.journal || (state.journal = {});

  let calHtml = "";
  if (journalCalOpen) {
    const startDow = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startDow; i++) cells.push('<button class="cal-day blank" tabindex="-1"></button>');
    for (let d = 1; d <= daysInMonth; d++) {
      const k = y + "-" + String(m + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0");
      const has = String(journal[k] || "").trim().length > 0;
      cells.push(`<button class="cal-day${k === journalSel ? " sel" : ""}${k === today ? " today" : ""}" data-day="${k}">${d}${has ? '<span class="dot"></span>' : ""}</button>`);
    }
    calHtml = `
      <div style="margin-top:10px">
        <div class="cal-head">
          <button class="btn ghost" id="calPrev">‹</button>
          <b>${y} 年 ${m + 1} 月</b>
          <button class="btn ghost" id="calNext">›</button>
        </div>
        <div class="cal-grid">
          ${["日", "一", "二", "三", "四", "五", "六"].map(d => `<div class="dow">${d}</div>`).join("")}
          ${cells.join("")}
        </div>
      </div>`;
  }
  const text = journal[journalSel] || "";
  main.innerHTML = `
    <div class="card" style="padding:12px 16px">
      <div class="row" style="justify-content:space-between">
        <div class="row" style="gap:4px">
          <button class="btn ghost" id="jPrevDay">‹</button>
          <b>${journalSel}${journalSel === today ? "（今天）" : ""}</b>
          <button class="btn ghost" id="jNextDay">›</button>
        </div>
        <button class="btn ghost" id="calToggle">${journalCalOpen ? "收起 ▴" : "📅 日历 ▾"}</button>
      </div>
      ${calHtml}
    </div>
    <div class="card">
      <div class="row" style="justify-content:space-between">
        <div class="section-title" style="margin:0">写日记</div>
        <span class="hint" id="jwc" style="margin:0"></span>
      </div>
      <p class="hint">用英语写点什么：今天的事、心情、想法都行。写完点「AI 点评」挑错，可逐条或一键存入表达库。</p>
      <textarea id="jtext" style="min-height:170px" placeholder="Dear diary, today I ...">${esc(text)}</textarea>
      <div class="btn-row">
        <button class="btn" id="jCheck">AI 点评</button>
        <button class="btn ghost" id="jToday">回到今天</button>
      </div>
      <div id="jTips"></div>
    </div>`;

  main.querySelectorAll("[data-day]").forEach(b =>
    b.addEventListener("click", () => { journalSel = b.dataset.day; journalCalOpen = false; render(); }));
  const shiftDay = (n) => {
    const d = new Date(journalSel + "T00:00:00");
    d.setDate(d.getDate() + n);
    journalSel = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    render();
  };
  $("#jPrevDay").addEventListener("click", () => shiftDay(-1));
  $("#jNextDay").addEventListener("click", () => shiftDay(1));
  $("#calToggle").addEventListener("click", () => {
    journalCalOpen = !journalCalOpen;
    if (journalCalOpen) { const d = new Date(journalSel + "T00:00:00"); journalCursor = { y: d.getFullYear(), m: d.getMonth() }; }
    render();
  });
  const cp = $("#calPrev");
  if (cp) cp.addEventListener("click", () => { journalCursor.m--; if (journalCursor.m < 0) { journalCursor.m = 11; journalCursor.y--; } render(); });
  const cn = $("#calNext");
  if (cn) cn.addEventListener("click", () => { journalCursor.m++; if (journalCursor.m > 11) { journalCursor.m = 0; journalCursor.y++; } render(); });
  $("#jToday").addEventListener("click", () => { journalSel = today; const d = new Date(); journalCursor = { y: d.getFullYear(), m: d.getMonth() }; render(); });

  const ta = $("#jtext");
  const wcEl = $("#jwc");
  const updWc = () => { wcEl.textContent = countWords(ta.value) + " 词 · 自动保存"; };
  ta.addEventListener("input", () => {
    const v = ta.value;
    if (!v.trim()) delete state.journal[journalSel];
    else state.journal[journalSel] = v;
    save(); updWc();
  });
  updWc();

  // 点评结果持久化：存到 state.journalTips[日期]，切走再回来不丢
  const markJ = (b, text) => {
    const m = document.createElement("span");
    m.className = "saved-mark";
    m.textContent = text;
    b.replaceWith(m);
  };
  function paintJournalTips() {
    const box = $("#jTips");
    if (!journalTips.length) return;
    box.innerHTML = `
      <div class="btn-row" style="margin-top:10px"><button class="btn primary" id="jSaveAll">一键全部存入表达库</button></div>
      <ul class="tips">${journalTips.map((t, i) => `
        <li>
          <div class="tip-zh">${esc(t.zh)}</div>
          <div class="tip-en">→ ${esc(t.en)}</div>
          ${cardExists(t.en)
            ? `<span class="saved-mark">已存在</span>`
            : `<button class="btn primary" data-jtip="${i}">存入表达库</button>`}
        </li>`).join("")}</ul>`;
    box.querySelectorAll("[data-jtip]").forEach(b =>
      b.addEventListener("click", () => {
        const t = journalTips[Number(b.dataset.jtip)];
        if (cardExists(t.en)) { markJ(b, "已存在"); return; }
        addCard(t.en, t.zh, "日记 " + journalSel, "fb");
        save();
        markJ(b, "已存 ✓");
      }));
    $("#jSaveAll").addEventListener("click", () => {
      let added = 0, dup = 0;
      journalTips.forEach(t => {
        if (cardExists(t.en)) dup++;
        else { addCard(t.en, t.zh, "日记 " + journalSel, "fb"); added++; }
      });
      save();
      box.querySelectorAll("[data-jtip]").forEach(b => markJ(b, "已存 ✓"));
      toast("存入 " + added + " 条" + (dup ? "，" + dup + " 条已存在跳过" : ""));
      const d = document.createElement("span");
      d.className = "saved-mark"; d.textContent = "已全部存入 ✓";
      $("#jSaveAll").replaceWith(d);
    });
  }
  $("#jCheck").addEventListener("click", async () => {
    const btn = $("#jCheck");
    const box = $("#jTips");
    if (!ta.value.trim()) { box.innerHTML = '<p class="hint" style="margin-top:10px">先写几句再点评。</p>'; return; }
    btn.disabled = true; btn.textContent = "点评中…";
    try {
      const content = await aiChat([
        { role: "system", content: "你是英语写作教练。用户每天用英语写日记。给出 2-4 条最关键的反馈（语法、用词、地道度），每条一行，格式严格为：中文问题简述 || 正确或更地道的英文表达。不要输出任何其他内容。" },
        { role: "user", content: "用户级别：" + state.level + "\n\n日记内容：\n" + ta.value.slice(0, 3000) },
      ]);
      journalTips = content.split(/\n+/).map(l => l.replace(/^[-*\d.\s、]+/, "")).filter(l => l.includes("||"))
        .map(l => { const p = l.split("||").map(s => s.trim()); return { zh: p[0] || "", en: p[1] || "" }; });
      if (!journalTips.length) throw new Error("AI 返回格式无法解析");
      (state.journalTips = state.journalTips || {})[journalSel] = journalTips;
      save();
    } catch (e) {
      journalTips = [];
      box.innerHTML = '<p class="hint" style="margin-top:10px;color:var(--red)">点评失败：' + esc(e.message) + '（到「记录」页检查 AI 配置）</p>';
      btn.disabled = false; btn.textContent = "AI 点评";
      return;
    }
    btn.disabled = false; btn.textContent = "AI 点评";
    paintJournalTips();
  });
  // 恢复该日已保存的点评
  journalTips = ((state.journalTips || {})[journalSel]) || [];
  if (journalTips.length) paintJournalTips();
}
