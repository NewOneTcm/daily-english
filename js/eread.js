/* ---- 精读：粘贴自定义文本，可累积多篇，点词/划词学习 ---- */
let ereadOpen = null; // 当前展开的文本 id

function renderERead(main) {
  state.readTexts = state.readTexts || [];
  // 旧单篇字段迁移
  if (state.readText && !state.readTexts.some(x => x.text === state.readText)) {
    state.readTexts.unshift({ id: state.nextReadId++, text: state.readText, added: todayKey() });
    state.readText = "";
    save();
  }
  main.innerHTML = `
    <div class="card">
      <div class="section-title">粘贴一篇新的英文，加入精读</div>
      <textarea id="rtInput" style="min-height:90px" placeholder="粘贴你想读的英文：文章、邮件、推文、产品文档…"></textarea>
      <div class="btn-row">
        <button class="btn primary" id="rtAdd">保存并开始读</button>
      </div>
      <p class="hint">读过的文本都保留在下面，随时回来重读。读的时候：<b>划选单词或句子</b>弹出 AI 解释，可存生词库；或点「AI 提取生词词组」批量提取，存入生词库。</p>
    </div>
    <div id="rtList"></div>`;
  $("#rtAdd").addEventListener("click", () => {
    const v = $("#rtInput").value.trim();
    if (!v) { alert("先粘贴文本"); return; }
    state.readTexts.unshift({ id: state.nextReadId++, text: v, added: todayKey() });
    ereadOpen = state.readTexts[0].id;
    save(); render();
  });
  const list = $("#rtList");
  if (!state.readTexts.length) { list.innerHTML = '<div class="empty">还没有保存的文本。</div>'; return; }
  state.readTexts.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    const open = ereadOpen === item.id;
    const preview = item.text.replace(/\s+/g, " ").slice(0, 90);
    card.innerHTML = `
      <div class="row" style="justify-content:space-between">
        <div style="font-size:13px;color:var(--ink-2)">${esc(item.added || "")} · ${countWords(item.text)} 词</div>
        <div class="row" style="gap:6px">
          ${open ? `<button class="btn ghost" data-ai>AI 提取生词词组</button>` : ""}
          <button class="btn ghost" data-toggle>${open ? "收起 ▴" : "展开 ▾"}</button>
          <button class="btn ghost danger" data-del>删除</button>
        </div>
      </div>
      ${open ? "" : `<div class="hist-text" style="margin-top:8px">${esc(preview)}${item.text.length > 90 ? "…" : ""}</div>`}
      <div class="rt-body" style="display:${open ? "" : "none"};margin-top:10px"></div>`;
    card.querySelector("[data-toggle]").addEventListener("click", () => { ereadOpen = open ? null : item.id; render(); });
    card.querySelector("[data-del]").addEventListener("click", () => {
      if (!confirm("删除这篇精读文本？")) return;
      state.readTexts = state.readTexts.filter(x => x.id !== item.id);
      if (ereadOpen === item.id) ereadOpen = null;
      save(); render();
    });
    const aiBtn = card.querySelector("[data-ai]");
    if (aiBtn) aiBtn.addEventListener("click", e => runAiExtract(item.id, e.target));
    list.appendChild(card);
    if (open) paintReadView(card.querySelector(".rt-body"), item);
    paintEreadTips(card.querySelector(".rt-body"), item); // 提取结果跟随文章一起折叠
  });
}

function paintReadView(box, item) {
  const text = item.text;
  box.innerHTML = `<div class="read-text" data-readbody>${esc(text).replace(/\n/g, "<br>")}</div>`;
  // 划选词句 → AI 解释弹窗（复用阅读模块的划词功能）
  bindPassageSelect(box.querySelector("[data-readbody]"), text);
}

function paintEreadTips(box, item) {
  const tips = item.tips; // 存在文本上，切走再回来不丢
  if (!tips || !tips.length) return;
  const head = document.createElement("div");
  head.innerHTML = `
    <div class="section-title" style="margin-top:14px">AI 提取的学习点</div>
    <p class="hint" style="margin-top:2px">下面的生词/词组存入<b>生词库</b>（带释义和出处原句），进生词库做 AI 解释、造句、AI 点评、存学习库。</p>`;
  box.appendChild(head);
  const holder = document.createElement("div");
  box.appendChild(holder);
  renderEreadVocabSaver(holder, tips);
}

/* 精读提取结果 → 存生词库（而不是表达库）。
   语义与划词入库一致：词/词组进生词库，带释义和出处原句，等造句/入库精加工。
   tips: [{ en, zh, ctx, saved? }]；saved 表示已入生词库。 */
function renderEreadVocabSaver(container, tips) {
  if (!container) return;
  container.innerHTML = "";
  const list = (tips || []).filter(t => t && (t.en || t.zh));
  if (!list.length) return;
  const isSaved = t => t.saved || vocabExists(t.en);
  const wrap = document.createElement("div");
  wrap.innerHTML = `
    <div class="btn-row" style="margin-top:10px">
      <button class="btn primary" data-saveall>一键全部存入生词库</button>
    </div>
    <ul class="tips">
      ${list.map((t, i) => `
        <li>
          <div class="tip-zh">${t.praise ? "🌟 " : ""}${esc(t.en)} <span style="color:var(--ink-2);font-weight:400">— ${esc(t.zh)}</span></div>
          ${t.ctx ? `<div class="tip-en">${esc(t.ctx)}</div>` : ""}
          ${isSaved(t) ? "" : `<button class="btn ghost danger" data-del="${i}" title="不要这条，删掉" style="padding:4px 10px;font-size:12px">×</button>`}
          <span data-slot="${i}"></span>
        </li>`).join("")}
    </ul>`;
  container.appendChild(wrap);

  wrap.querySelectorAll("[data-del]").forEach(b =>
    b.addEventListener("click", () => {
      const t = list[Number(b.dataset.del)];
      const oi = tips.indexOf(t);
      if (oi >= 0) tips.splice(oi, 1);
      save();
      renderEreadVocabSaver(container, tips);
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
      saveAllBtn.textContent = "一键全部存入生词库（" + left + "）";
    }
  };
  const saveOne = (t, slot) => {
    if (isSaved(t)) { markSaved(slot, "已在生词库"); updateSaveAll(); return; }
    addVocabExtracted(t.en, t.zh, t.ctx || "");
    t.saved = true;
    save();
    markSaved(slot, "已入生词库 ✓");
    updateSaveAll();
  };
  list.forEach((t, i) => {
    const slot = wrap.querySelector('[data-slot="' + i + '"]');
    if (!t.en) return;
    if (isSaved(t)) { markSaved(slot, t.saved ? "已入生词库 ✓" : "已在生词库"); return; }
    const b = document.createElement("button");
    b.className = "btn primary";
    b.textContent = "存入生词库";
    b.addEventListener("click", () => saveOne(t, slot));
    slot.appendChild(b);
  });
  saveAllBtn.addEventListener("click", () => {
    let added = 0, dup = 0;
    list.forEach((t, i) => {
      if (!t.en) return;
      const slot = wrap.querySelector('[data-slot="' + i + '"]');
      if (isSaved(t)) { dup++; markSaved(slot, "已在生词库"); }
      else { addVocabExtracted(t.en, t.zh, t.ctx || ""); t.saved = true; added++; markSaved(slot, "已入生词库 ✓"); }
    });
    save();
    updateSaveAll();
    toast("存入生词库 " + added + " 条" + (dup ? "，" + dup + " 条已存在跳过" : ""));
  });
  updateSaveAll();
}

async function runAiExtract(textId, btn) {
  const item = (state.readTexts || []).find(x => x.id === textId);
  if (!item) return;
  if (item.tips && item.tips.length && !confirm("这篇已经提取过了，确定要再次提取吗？（会再调用一次 AI 接口，结果会覆盖旧的）")) return;
  btn.disabled = true; btn.textContent = "提取中…";
  try {
    const content = await aiChat([
      { role: "system", content: "你是英语老师。从用户给的英文文本中挑选 5-10 个最值得学习的生词或词组，优先挑选略高于用户当前水平、对ta有提升价值的，而不是人人都认识的简单词。每条一行，格式严格为：英文 || 中文释义 || 包含它的原句片段。不要输出其他内容。" },
      { role: "user", content: "用户当前英语级别：" + (LEVELS[state.level] ? LEVELS[state.level].label : state.level) + "\n\n文本：\n" + item.text.slice(0, 4000) },
    ]);
    const tips = content.split(/\n+/).map(l => l.replace(/^[-*\d.\s、]+/, "")).filter(l => l.includes("||"))
      .map(l => { const p = l.split("||").map(s => s.trim()); return { en: p[0] || "", zh: p[1] || "", ctx: (p[2] || "").slice(0, 140) }; });
    if (!tips.length) throw new Error("AI 返回格式无法解析");
    // 修复：例句必须包含目标词，否则回退到原文中含该词的句子，找不到就不显示
    const srcSents = splitSentences(item.text);
    tips.forEach(t => {
      const probe = (t.en || "").trim().toLowerCase();
      if (!probe) { t.ctx = ""; return; }
      if (t.ctx && t.ctx.toLowerCase().includes(probe)) return;
      const found = srcSents.find(s => s.toLowerCase().includes(probe));
      t.ctx = found ? found.slice(0, 160) : "";
    });
    item.tips = tips;
    save();
  } catch (e) {
    alert("提取失败：" + e.message);
  }
  btn.disabled = false; btn.textContent = "AI 提取生词词组";
  render();
}
