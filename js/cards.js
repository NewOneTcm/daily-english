/* 表达库：存表达、勾选导出 SuperMemo */
/* ---- 表达库 ---- */
const CARD_TAGS = {
  expr: ["表达", "background:var(--accent-soft);color:var(--accent)"],
  fb: ["反馈", ""],
  vocab: ["生词", "background:#e8f0fb;color:#4a7fa5"],
  vtip: ["生词点评", "background:#efe8fb;color:#6b4fa5"],
};
let exportSel = new Set(); // 勾选导出：选中的卡片 id
function selRangeStart(kind) {
  if (kind === "today") return todayKey();
  const d = new Date();
  if (kind === "week") { // 本周一
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  return todayKey().slice(0, 7) + "-01"; // 本月 1 号
}
function renderCards(main) {
  const t = todayKey();
  const sorted = [...state.cards].sort((a, b) => a.due < b.due ? -1 : 1);
  const ids = new Set(state.cards.map(c => c.id));
  exportSel = new Set([...exportSel].filter(id => ids.has(id))); // 清理已删除的
  const allChecked = state.cards.length > 0 && exportSel.size === state.cards.length;
  main.innerHTML = `
    <div class="card">
      <div class="section-title">存一条新表达</div>
      ${quickAddForm()}
    </div>
    <div class="card">
      <div class="section-title" style="margin-bottom:6px">全部表达（${state.cards.length}）</div>
      ${sorted.length ? `
      <div class="row" style="gap:8px;margin-bottom:8px">
        <label class="hint" style="margin:0;display:inline-flex;align-items:center;gap:4px;cursor:pointer">
          <input type="checkbox" id="selAll" class="ck" ${allChecked ? "checked" : ""}> 全选
        </label>
        <button class="btn ghost" data-selrange="today">今日</button>
        <button class="btn ghost" data-selrange="week">本周</button>
        <button class="btn ghost" data-selrange="month">本月</button>
        <button class="btn ghost" id="selClear">清除</button>
        <div class="spacer"></div>
        <button class="btn" id="exportSmSel">导出所选（${exportSel.size}）</button>
        <button class="btn ghost" id="exportSm">导出全部</button>
      </div>
      <ul class="list">
        ${sorted.map(c => `
          <li>
            <input type="checkbox" class="ck" data-ck="${c.id}" ${exportSel.has(c.id) ? "checked" : ""}>
            ${(() => { const tg = CARD_TAGS[c.type || "expr"] || CARD_TAGS.expr; return `<span class="tag-fb" style="${tg[1]}">${tg[0]}</span>`; })()}
            <span class="en">${esc(c.en)}</span>
            <span class="zh">${esc(c.zh)}</span>
            <button class="btn ghost danger" data-del="${c.id}" title="删除">×</button>
          </li>`).join("")}
      </ul>` : `<div class="empty">还什么都没有。每天打卡后顺手留一条，慢慢就攒起来了。</div>`}
      <p class="hint">导出 SuperMemo Q&A 文本：逐条勾选，或用 今日 / 本周 / 本月 快速圈选。</p>
    </div>`;
  bindQuickAdd(main);
  const exAll = $("#exportSm");
  if (exAll) exAll.addEventListener("click", () => exportSuperMemo(false));
  const exSel = $("#exportSmSel");
  if (exSel) exSel.addEventListener("click", () => exportSuperMemo(true));
  const syncSelUI = () => {
    const sb = $("#exportSmSel"); if (sb) sb.textContent = `导出所选（${exportSel.size}）`;
    const sa = $("#selAll"); if (sa) sa.checked = state.cards.length > 0 && exportSel.size === state.cards.length;
  };
  const sa = $("#selAll");
  if (sa) sa.addEventListener("change", () => {
    exportSel = sa.checked ? new Set(state.cards.map(c => c.id)) : new Set();
    main.querySelectorAll("[data-ck]").forEach(cb => { cb.checked = sa.checked; });
    syncSelUI();
  });
  main.querySelectorAll("[data-selrange]").forEach(b =>
    b.addEventListener("click", () => {
      const start = selRangeStart(b.dataset.selrange);
      exportSel = new Set(state.cards.filter(c => (c.added || "") >= start).map(c => c.id));
      main.querySelectorAll("[data-ck]").forEach(cb => { cb.checked = exportSel.has(Number(cb.dataset.ck)); });
      syncSelUI();
    }));
  const sc = $("#selClear");
  if (sc) sc.addEventListener("click", () => {
    exportSel = new Set();
    main.querySelectorAll("[data-ck]").forEach(cb => { cb.checked = false; });
    syncSelUI();
  });
  main.querySelectorAll("[data-ck]").forEach(b =>
    b.addEventListener("change", () => {
      const id = Number(b.dataset.ck);
      if (b.checked) exportSel.add(id); else exportSel.delete(id);
      syncSelUI();
    }));
  main.querySelectorAll("[data-del]").forEach(b =>
    b.addEventListener("click", () => {
      if (!confirm("删掉这条表达？")) return;
      state.cards = state.cards.filter(c => c.id !== Number(b.dataset.del));
      save(); render();
    }));
}

function exportSuperMemo(onlySel) {
  const cards = onlySel ? state.cards.filter(c => exportSel.has(c.id)) : state.cards;
  if (!cards.length) { alert(onlySel ? "先勾选要导出的内容（可点 今日/本周/本月 快速圈选）" : "表达库是空的，先存几条。"); return; }
  // SuperMemo 经典 Q&A 文本格式：File > Import > Q&A text 直接导入
  const lines = cards.map(c => {
    const a = c.ctx ? `${c.en}\n${c.ctx}` : c.en;
    return `Q: ${c.zh}\nA: ${a}`;
  }).join("\n\n");
  download(lines + "\n", `supermemo-english-${todayKey()}.txt`, "text/plain;charset=utf-8");
}

