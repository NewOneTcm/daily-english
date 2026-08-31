/* 表达库（升级版）：收 → 管 → 出
   收：各模块按 kind × source 汇入；管：去重、分类、星标、掌握、导出追踪
   出：按 kind 差异化 5 种模板导出 SuperMemo；生词类复用拼写模块挖空算法（消除撞车）
   参考：《表达库_升级方案_完整逻辑文档》 */

const EXPORT_PRIORITY = {
  W_STARRED: 60,      // 星标
  W_SM_LAPSES: 15,    // SuperMemo 回导遗忘次数（顽固）
  W_UNEXPORTED: 50,   // 从未导出过
  W_UNKNOWN: 10,      // 关联生词的不熟次数
  W_MASTERED: -999,   // 已掌握沉底
  W_RECENT_PEN: -30,  // 7 天内刚导出过
};
const STUBBORN_THRESHOLD = 3;

let cardFilter = { kind: "all", source: "all", hideMastered: true };

/* ---- 迁移：载入时调用一次，把旧 type 数据搬到 kind/source ---- */
let cardMigrated = false;
function ensureCardMigration() {
  if (cardMigrated) return;
  migrateCards();
  cardMigrated = true;
}

/* ---- 勾选状态持久化（localStorage，按天失效） ---- */
const SELECT_KEY = "cards.selected";
const SELECT_DATE_KEY = "cards.selected.date";
function loadSelection() {
  try {
    const d = localStorage.getItem(SELECT_DATE_KEY);
    if (d !== todayKey()) { localStorage.removeItem(SELECT_KEY); localStorage.setItem(SELECT_DATE_KEY, todayKey()); return new Set(); }
    return new Set(JSON.parse(localStorage.getItem(SELECT_KEY) || "[]"));
  } catch (e) { return new Set(); }
}
function saveSelection(set) {
  try { localStorage.setItem(SELECT_KEY, JSON.stringify([...set])); localStorage.setItem(SELECT_DATE_KEY, todayKey()); } catch (e) {}
}
let exportSel = loadSelection();

/* ---- 优先级排序（替代按 due 排序） ---- */
function daysSince(iso) { return iso ? (Date.now() - new Date(iso).getTime()) / 86400000 : 999; }
function exportPriority(card) {
  const w = card.wordId ? (state.vocab || []).find(v => v.id === card.wordId) : null;
  const recent = card.exportedAt && daysSince(card.exportedAt) < 7;
  return (card.starred ? EXPORT_PRIORITY.W_STARRED : 0)
    + (card.smLapses || 0) * EXPORT_PRIORITY.W_SM_LAPSES
    + (card.exportCount === 0 ? EXPORT_PRIORITY.W_UNEXPORTED : 0)
    + (w ? (w.unknownCount || 0) * EXPORT_PRIORITY.W_UNKNOWN : 0)
    + (card.mastered ? EXPORT_PRIORITY.W_MASTERED : 0)
    + (recent ? EXPORT_PRIORITY.W_RECENT_PEN : 0);
}
// 快选：按学习价值（替代按时间）
function quickSelect(preset, value) {
  const cards = visibleCards();
  const now = Date.now();
  if (preset === "unexported") return cards.filter(c => c.exportCount === 0);
  if (preset === "stubborn") return cards.filter(c => (c.smLapses || 0) >= STUBBORN_THRESHOLD);
  if (preset === "starred") return cards.filter(c => c.starred);
  if (preset === "source") return cards.filter(c => c.source === value);
  if (preset === "kind") return cards.filter(c => c.kind === value);
  if (preset === "scene") return cards.filter(c => c.scene === value);
  return [];
}
function visibleCards() {
  ensureCardMigration();
  return (state.cards || []).filter(c => {
    if (cardFilter.hideMastered && c.mastered) return false;
    if (cardFilter.kind !== "all" && c.kind !== cardFilter.kind) return false;
    if (cardFilter.source !== "all" && c.source !== cardFilter.source) return false;
    return true;
  });
}

/* ---- §4 导出模板：按 kind 差异化 ---- */
// 内容转义：防 Q:/A: 破坏格式，防 HTML 特殊字符
function cardEsc(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/Q:/g, "Q&#58;").replace(/A:/g, "A&#58;");
}
// 搭配挖空：挖核心实词，保留搭配动词
function makeCollocationCloze(phrase) {
  const words = phrase.split(/\s+/);
  if (words.length < 2) return "_".repeat(phrase.length);
  const target = words.reduce((a, b, i) => (words[i].length > words[a].length ? i : a), 0);
  return words.map((w, i) => (i === target ? "_".repeat(w.length) : w)).join(" ");
}
// 整句挖空：把目标表达替换为下划线
function blankTargetInSentence(sentence, target) {
  const idx = sentence.toLowerCase().indexOf(String(target || "").toLowerCase());
  if (idx === -1) return sentence;
  return sentence.slice(0, idx) + "_".repeat(target.length) + sentence.slice(idx + target.length);
}
// 释义脱敏：中文提示里夹带英文原词则替换为 [?]，防泄露答案
function sanitizeGloss(gloss, en) {
  if (!gloss || !en) return gloss;
  const esc = String(en).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return String(gloss).replace(new RegExp(esc, "gi"), "[?]");
}
function cardTag(card) {
  return `<font size=1 color=gray>[#c${String(card.id).padStart(5, "0")}·${card.kind}·${(CARD_SOURCES[card.source] || { label: card.source }).label}]</font>`;
}
// 五种模板渲染，返回 { q, a }
function renderCard(card) {
  const tag = cardTag(card);
  const en = card.en, zh = card.zh, ctx = card.ctx;
  const verb = card.source === "speaking" ? "说" : "写";

  if (card.kind === "correction") {
    // ★ 原文改造：练的是改掉坏习惯，而不是记住一个新说法
    const original = card.original || "";
    const q = [`我原来${verb}：${cardEsc(original || en)}`, "这里不地道，你会怎么说？", tag].join("<br>");
    const a = [
      original ? `我原来${verb}：<font color=red>${cardEsc(original)}</font>` : "",
      `→ 应该说：<b>${cardEsc(en)}</b>`,
      card.reason ? `改的原因：${cardEsc(card.reason)}` : "",
      card.errorTag ? `错误类别：${cardEsc(card.errorTag)}` : "",
    ].filter(Boolean).join("<br>");
    return { q, a };
  }
  if (card.kind === "word") {
    // ★ 复用拼写模块的挖空算法，与拼写模块导出格式一致，避免同一词导成两张卡
    const predicted = dictPredictSpots(en);
    const w = card.wordId ? (state.vocab || []).find(v => v.id === card.wordId) : null;
    const boost = w && w.smLapses ? Math.min(w.smLapses * 0.05, 0.2) : 0;
    const cloze = /\s/.test(en.trim()) ? dictMakePhraseCloze(en, "T2", predicted, boost) : dictMakeCloze(en, "T2", predicted, boost);
    const hint = dictAnswerHint(predicted);
    const q = [cardEsc(zh), `<font face="Courier New" size=5>${cloze.display}</font>`, tag].join("<br>");
    const a = [`<b>${cardEsc(en)}</b>`, hint ? `易错：${hint}` : "", ctx ? `语境：${cardEsc(ctx)}` : ""].filter(Boolean).join("<br>");
    return { q, a };
  }
  if (card.kind === "collocation") {
    const q = [`表达「${cardEsc(zh)}」`, `<font face="Courier New" size=5>${makeCollocationCloze(en)}</font>`, tag].join("<br>");
    const a = [`<b>${cardEsc(en)}</b>`, card.reason ? cardEsc(card.reason) : "", ctx ? `语境：${cardEsc(ctx)}` : ""].filter(Boolean).join("<br>");
    return { q, a };
  }
  if (card.kind === "sentence") {
    const q = ["补全句子中的表达：", `<font face="Courier New" size=5>${cardEsc(blankTargetInSentence(ctx || en, en))}</font>`, `（意思是：${cardEsc(zh)}）`, tag].join("<br>");
    const a = [`<b>${cardEsc(ctx || en)}</b>`, `中文：${cardEsc(zh)}`].join("<br>");
    return { q, a };
  }
  // phrase 地道表达：中译英（+ 语域提示 + 释义脱敏）
  const reg = card.register && REGISTER_LABEL[card.register] ? `，${REGISTER_LABEL[card.register]}` : "";
  const q = [`意思是「${cardEsc(sanitizeGloss(zh, en))}」${reg}`, tag].join("<br>");
  const a = [`<b>${cardEsc(en)}</b>`, ctx ? `语境：${cardEsc(ctx)}` : ""].filter(Boolean).join("<br>");
  return { q, a };
}
// 纯文本模式（CSV 场景）：<br> → 竖线，去标签
function toPlainText(s) {
  return String(s || "").replace(/<br\s*\/?>/gi, " | ").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}
function buildExportText(cards, plain) {
  const lines = [];
  cards.forEach(c => {
    let { q, a } = renderCard(c);
    if (plain) { q = toPlainText(q); a = toPlainText(a); }
    lines.push("Q: " + q, "A: " + a, "");
  });
  return lines.join("\n");
}
// 导出查重：已导出过 或 30 天内导出过 → 重复项
function checkDuplicates(cards) {
  const fresh = [], dup = [];
  cards.forEach(c => {
    const recent = c.exportedAt && daysSince(c.exportedAt) < 30;
    (c.exportCount > 0 || recent) ? dup.push(c) : fresh.push(c);
  });
  return { fresh, dup };
}
function afterExport(cards) {
  const now = new Date().toISOString();
  cards.forEach(c => { c.exportCount = (c.exportCount || 0) + 1; c.exportedAt = now; });
  save();
}
function doExport(cards, plain) {
  if (!cards.length) { alert("没有可导出的内容。先勾选，或用快选圈一批。"); return; }
  const content = buildExportText(cards, plain) + "\n";
  download(content, `expressions_${todayKey().replace(/-/g, "")}.txt`, "text/plain;charset=utf-8");
  afterExport(cards);
  alert(`已导出 ${cards.length} 条。\n\n导入提醒：SuperMemo 导入对话框里记得勾选 "Decode UTF-8"，否则中文会乱码。`);
}

/* ---- 页面 ---- */
let cardExportPlain = false;
function renderCards(main) {
  ensureCardMigration();
  exportSel = new Set([...exportSel].filter(id => (state.cards || []).some(c => c.id === id))); // 清理已删
  const all = visibleCards();
  const sorted = [...all].sort((a, b) => exportPriority(b) - exportPriority(a) || b.id - a.id);
  const total = (state.cards || []).length;
  const unexported = (state.cards || []).filter(c => c.exportCount === 0).length;
  const stubborn = (state.cards || []).filter(c => (c.smLapses || 0) >= STUBBORN_THRESHOLD).length;

  main.innerHTML = `
    <div class="card">
      <div class="section-title">存一条新表达</div>
      ${quickAddForm()}
    </div>
    <div class="card">
      <div class="section-title">筛选与统计</div>
      <div class="stat-row" style="margin-top:6px">
        <div class="stat"><b>${total}</b><span>全部</span></div>
        <div class="stat amber"><b>${unexported}</b><span>未导出</span></div>
        ${stubborn ? `<div class="stat" style="color:var(--red)"><b>${stubborn}</b><span>顽固 ⚠️</span></div>` : ""}
        <div class="stat"><b>${(state.cards || []).filter(c => c.starred).length}</b><span>星标</span></div>
      </div>
      <div class="mini-label">按类型</div>
      <div class="btn-row" style="flex-wrap:wrap">
        <button class="btn ${cardFilter.kind === "all" ? "primary" : "ghost"}" data-fk="all">全部</button>
        ${Object.entries(CARD_KINDS).map(([k, v]) => `<button class="btn ${cardFilter.kind === k ? "primary" : "ghost"}" data-fk="${k}">${v.label}</button>`).join("")}
      </div>
      <div class="mini-label">按来源</div>
      <div class="btn-row" style="flex-wrap:wrap">
        <button class="btn ${cardFilter.source === "all" ? "primary" : "ghost"}" data-fs="all">全部</button>
        ${Object.entries(CARD_SOURCES).map(([k, v]) => `<button class="btn ${cardFilter.source === k ? "primary" : "ghost"}" data-fs="${k}">${v.label}</button>`).join("")}
      </div>
      <label class="hint" style="margin-top:8px;display:inline-flex;align-items:center;gap:4px;cursor:pointer">
        <input type="checkbox" id="hideMastered" class="ck" ${cardFilter.hideMastered ? "checked" : ""}> 隐藏已掌握的
      </label>
    </div>
    <div class="card">
      <div class="row" style="justify-content:space-between">
        <div class="section-title" style="margin:0">全部表达（${sorted.length}）</div>
        <span class="q-score">已选 ${exportSel.size}</span>
      </div>
      ${sorted.length ? `
      <div class="row" style="gap:8px;margin:8px 0;flex-wrap:wrap">
        <button class="btn ghost" data-qs="unexported">未导出</button>
        ${stubborn ? `<button class="btn ghost" data-qs="stubborn">顽固 ⚠️</button>` : ""}
        <button class="btn ghost" data-qs="starred">星标</button>
        <button class="btn ghost" id="selAll">全选</button>
        <button class="btn ghost" id="selClear">清除</button>
      </div>
      <ul class="list">
        ${sorted.map(c => `
          <li>
            <input type="checkbox" class="ck" data-ck="${c.id}" ${exportSel.has(c.id) ? "checked" : ""}>
            <span class="tag-fb" style="background:${(CARD_KINDS[c.kind] || CARD_KINDS.phrase).color}22;color:${(CARD_KINDS[c.kind] || CARD_KINDS.phrase).color}">${(CARD_KINDS[c.kind] || CARD_KINDS.phrase).label}</span>
            <span class="due" style="color:#8a938e">${(CARD_SOURCES[c.source] || { label: c.source }).label}</span>
            ${c.original ? `<span class="en">${esc(c.original)} →</span>` : ""}
            <span class="en">${esc(c.en)}</span>
            <span class="zh">${esc(c.zh)}</span>
            ${(c.smLapses || 0) >= STUBBORN_THRESHOLD ? `<span class="due" style="color:var(--red)">⚠️${c.smLapses}</span>` : ""}
            ${c.exportCount > 0 ? `<span class="due">导${c.exportCount}次</span>` : ""}
            <button class="btn ghost" data-star="${c.id}" title="星标">${c.starred ? "★" : "☆"}</button>
            <button class="btn ghost" data-master="${c.id}" title="已掌握">${c.mastered ? "✓" : "○"}</button>
            <button class="btn ghost danger" data-del="${c.id}" title="删除">×</button>
          </li>`).join("")}
      </ul>` : `<div class="empty">还没有表达。打卡、日记、生词库的反馈都能存进来。</div>`}
      <div class="btn-row" style="margin-top:12px">
        <button class="btn" id="exportSmSel">导出所选（${exportSel.size}）</button>
        <button class="btn ghost" id="exportSmAll">导出全部可见</button>
      </div>
      <label class="hint" style="margin-top:8px;display:inline-flex;align-items:center;gap:4px;cursor:pointer">
        <input type="checkbox" id="plainMode" class="ck" ${cardExportPlain ? "checked" : ""}> 纯文本模式（去 HTML，给网页版/Excel 用）
      </label>
      <p class="hint" style="margin-top:6px">导出按类型用不同练法：纠错 = 原文改造，生词 = 字母挖空，搭配 = 挖核心词，整句 = 补全，地道表达 = 中译英。</p>
    </div>`;

  bindQuickAdd(main);
  main.querySelectorAll("[data-fk]").forEach(b => b.addEventListener("click", () => { cardFilter.kind = b.dataset.fk; render(); }));
  main.querySelectorAll("[data-fs]").forEach(b => b.addEventListener("click", () => { cardFilter.source = b.dataset.fs; render(); }));
  const hm = $("#hideMastered");
  if (hm) hm.addEventListener("change", () => { cardFilter.hideMastered = hm.checked; save(); render(); });
  const pm = $("#plainMode");
  if (pm) pm.addEventListener("change", () => { cardExportPlain = pm.checked; });

  const syncSelUI = () => {
    const s = main.querySelector(".q-score"); if (s) s.textContent = `已选 ${exportSel.size}`;
    const eb = $("#exportSmSel"); if (eb) eb.textContent = `导出所选（${exportSel.size}）`;
    saveSelection(exportSel);
  };
  main.querySelectorAll("[data-ck]").forEach(b =>
    b.addEventListener("change", () => {
      const id = Number(b.dataset.ck);
      if (b.checked) exportSel.add(id); else exportSel.delete(id);
      syncSelUI(); // 只更新计数，不整页重渲染（防滚动跳动）
    }));
  main.querySelectorAll("[data-qs]").forEach(b =>
    b.addEventListener("click", () => {
      exportSel = new Set(quickSelect(b.dataset.qs).map(c => c.id));
      main.querySelectorAll("[data-ck]").forEach(cb => { cb.checked = exportSel.has(Number(cb.dataset.ck)); });
      syncSelUI();
    }));
  $("#selAll").addEventListener("click", () => {
    exportSel = new Set(sorted.map(c => c.id));
    main.querySelectorAll("[data-ck]").forEach(cb => { cb.checked = true; });
    syncSelUI();
  });
  $("#selClear").addEventListener("click", () => {
    exportSel = new Set();
    main.querySelectorAll("[data-ck]").forEach(cb => { cb.checked = false; });
    syncSelUI();
  });
  main.querySelectorAll("[data-star]").forEach(b =>
    b.addEventListener("click", () => {
      const c = (state.cards || []).find(x => x.id === Number(b.dataset.star));
      if (c) { c.starred = !c.starred; save(); render(); }
    }));
  main.querySelectorAll("[data-master]").forEach(b =>
    b.addEventListener("click", () => {
      const c = (state.cards || []).find(x => x.id === Number(b.dataset.master));
      if (c) { c.mastered = !c.mastered; save(); render(); }
    }));
  main.querySelectorAll("[data-del]").forEach(b =>
    b.addEventListener("click", () => {
      if (!confirm("删掉这条表达？")) return;
      state.cards = (state.cards || []).filter(c => c.id !== Number(b.dataset.del));
      save(); render();
    }));

  $("#exportSmSel").addEventListener("click", () => {
    const picked = sorted.filter(c => exportSel.has(c.id));
    const { fresh, dup } = checkDuplicates(picked);
    let toGo = fresh;
    if (dup.length && !confirm(`有 ${dup.length} 条导出过（如：${dup.slice(0, 3).map(c => c.en).join("、")}${dup.length > 3 ? "…" : ""}）。\n\n点「确定」只导出 ${fresh.length} 条没导过的（推荐，避免 SuperMemo 里重复卡片）；点「取消」返回重选。`)) return;
    doExport(toGo, cardExportPlain);
    render();
  });
  $("#exportSmAll").addEventListener("click", () => {
    const { fresh, dup } = checkDuplicates(sorted);
    let toGo = fresh;
    if (dup.length && !confirm(`全部 ${sorted.length} 条中有 ${dup.length} 条导出过。\n\n点「确定」只导出 ${fresh.length} 条没导过的；点「取消」返回。`)) return;
    doExport(toGo, cardExportPlain);
    render();
  });
}

// 供「复习」页调用：导出全部可见（并做查重）
function exportSuperMemo() {
  ensureCardMigration();
  const cards = visibleCards();
  const { fresh } = checkDuplicates(cards);
  doExport(fresh.length ? fresh : cards, false);
}
