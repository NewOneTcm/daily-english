/* ---- 共享组件：反馈/学习点列表 + 逐条存入 + 一键全存（表达库） ----
   用法：renderTipsSaver(container, tips, opts)
   tips: [{ zh, en, ctx, saved?, praise? }]
   opts: {
     type:         存入表达库的卡片类型，默认 "fb"
     ctxFallback:  条目没有 ctx 时的兜底语境，默认 ""
     itemLabel:    逐条按钮文案，默认 "存入表达库"
     saveAllLabel: 一键按钮文案，默认 "一键全部存入表达库"
     wordFirst:    true 时主行显示「英文 — 释义」（精读用词）；默认主行显示 zh、第二行绿色 → en
     onChange:     每次入库后回调（比如让外层重渲染更新计数）
   }
   行为：已存在/已存的条目自动显示绿色标记并禁用；一键全存自动跳过重复；
   全部存完后一键按钮自动变为「已全部存入 ✓」并置灰，还有未存条目时保持可点。 */
function renderTipsSaver(container, tips, opts) {
  if (!container) return;
  const o = Object.assign({
    type: "fb", ctxFallback: "", itemLabel: "存入表达库",
    saveAllLabel: "一键全部存入表达库", wordFirst: false, onChange: null,
  }, opts || {});
  container.innerHTML = "";
  const list = (tips || []).filter(t => t && (t.en || t.zh));
  if (!list.length) return;

  const isSaved = t => t.saved || cardExists(t.en);
  const wrap = document.createElement("div");
  wrap.innerHTML = `
    <div class="btn-row" style="margin-top:10px">
      <button class="btn primary" data-saveall>${o.saveAllLabel}</button>
    </div>
    <ul class="tips">
      ${list.map((t, i) => `
        <li>
          ${o.wordFirst
            ? `<div class="tip-zh">${t.praise ? "🌟 " : ""}${esc(t.en)} <span style="color:var(--ink-2);font-weight:400">— ${esc(t.zh)}</span></div>`
            : `<div class="tip-zh">${t.praise ? "🌟 " : ""}${esc(t.zh)}</div>${t.en ? `<div class="tip-en">→ ${esc(t.en)}</div>` : ""}`}
          ${t.ctx ? `<div class="tip-en">${esc(t.ctx)}</div>` : ""}
          ${isSaved(t) ? "" : `<button class="btn ghost danger" data-del="${i}" title="不要这条，删掉" style="padding:4px 10px;font-size:12px">×</button>`}
          <span data-slot="${i}"></span>
        </li>`).join("")}
    </ul>`;
  container.appendChild(wrap);

  // 逐条删除：不想要的条目删掉，不进入表达库
  wrap.querySelectorAll("[data-del]").forEach(b =>
    b.addEventListener("click", () => {
      const t = list[Number(b.dataset.del)];
      const oi = tips.indexOf(t); // 从原数组删掉，保证持久化
      if (oi >= 0) tips.splice(oi, 1);
      save();
      renderTipsSaver(container, tips, o);
      if (o.onChange) o.onChange();
    }));

  const saveAllBtn = wrap.querySelector("[data-saveall]");
  const markSaved = (slot, text) => {
    slot.innerHTML = "";
    const m = document.createElement("span");
    m.className = "saved-mark";
    m.textContent = text;
    slot.appendChild(m);
  };
  const updateSaveAll = () => {
    const left = list.filter(t => t.en && !isSaved(t)).length;
    if (left === 0) {
      const d = document.createElement("span");
      d.className = "saved-mark";
      d.textContent = "已全部存入 ✓";
      saveAllBtn.replaceWith(d);
    } else {
      saveAllBtn.textContent = o.saveAllLabel + "（" + left + "）";
    }
  };
  const saveOne = (t, slot) => {
    if (isSaved(t)) { markSaved(slot, "已存在"); updateSaveAll(); return; }
    addCard(t.en, t.zh, t.ctx || o.ctxFallback, o.type);
    t.saved = true;
    save();
    markSaved(slot, "已存 ✓");
    updateSaveAll();
    if (o.onChange) o.onChange();
  };
  list.forEach((t, i) => {
    const slot = wrap.querySelector('[data-slot="' + i + '"]');
    if (!t.en) return;
    if (isSaved(t)) { markSaved(slot, t.saved ? "已存 ✓" : "已存在"); return; }
    const b = document.createElement("button");
    b.className = "btn primary";
    b.textContent = o.itemLabel;
    b.addEventListener("click", () => saveOne(t, slot));
    slot.appendChild(b);
  });
  saveAllBtn.addEventListener("click", () => {
    let added = 0, dup = 0;
    list.forEach((t, i) => {
      if (!t.en) return;
      const slot = wrap.querySelector('[data-slot="' + i + '"]');
      if (isSaved(t)) { dup++; markSaved(slot, "已存在"); }
      else { addCard(t.en, t.zh, t.ctx || o.ctxFallback, o.type); t.saved = true; added++; markSaved(slot, "已存 ✓"); }
    });
    save();
    updateSaveAll();
    toast("存入 " + added + " 条" + (dup ? "，" + dup + " 条已存在跳过" : ""));
    if (o.onChange) o.onChange();
  });
  updateSaveAll();
}
