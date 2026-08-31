/* ---- 生词库：阅读划词入库 → 独立页精加工（解释→造句→点评→存学习库） ---- */
let vocabFilter = "all"; // all | explain | example | unsaved

function addVocab(word, sentence) {
  const w = word.toLowerCase();
  let entry = (state.vocab || []).find(v => v.word === w);
  if (!entry) {
    state.nextVocabId = state.nextVocabId || (state.vocab.length + 1);
    // 场景阅读计数：加入生词本即"我不认识"，unknownCount 初始为 1
    entry = { id: state.nextVocabId++, word: w, display: word, sentence, explain: "", example: "", fb: [], saved: false, added: todayKey(), unknownCount: 1, exposureCount: 0, knownStreak: 0, status: "learning" };
    state.vocab.push(entry);
  } else {
    entry.sentence = sentence; // 用最新的出处句子
  }
  return entry;
}
// 场景阅读：生词状态计数兜底（旧数据可能没有这几个字段）
function ensureCtxCounts(v) {
  if (typeof v.unknownCount !== "number") v.unknownCount = 1;
  if (typeof v.exposureCount !== "number") v.exposureCount = 0;
  if (typeof v.knownStreak !== "number") v.knownStreak = 0;
  if (!v.status) v.status = "learning";
  return v;
}
// 精读 AI 提取批量入库：把释义直接写入 explain（跳过“待解释”一步，进入造句/入库精加工）
function addVocabExtracted(word, explain, sentence) {
  const entry = addVocab(word, sentence);
  if (!(entry.explain || "").trim() && explain) entry.explain = explain;
  return entry;
}
function vocabExists(word) {
  const k = String(word || "").trim().toLowerCase();
  return (state.vocab || []).some(v => String(v.word || v.display || "").trim().toLowerCase() === k);
}
async function aiReviewVocab(entry, btn) {
  // runAiReview 内部对 day.feedback 重新赋值，用代理对象接住再回写
  const proxy = { draft: entry.example, feedback: entry.fb || [] };
  await runAiReview(proxy, btn);
  if (proxy.feedback !== (entry.fb || [])) entry.fb = proxy.feedback;
}
async function runAiVocabExplain(entry, btn) {
  const ai = state.ai || {};
  if (!ai.base || !ai.model || (!ai.key && !/^(\/|https?:\/\/(127\.0\.0\.1|localhost))/i.test(ai.base))) {
    alert("先在「记录」页配置 AI 接口：地址和模型必填，本机地址可不填 Key");
    return;
  }
  const localBase = /^(\/|https?:\/\/(127\.0\.0\.1|localhost))/i.test(ai.base);
  if (location.protocol === "file:" && localBase) {
    alert("AI 功能需要在本机中转地址下使用：请先运行 proxy.py 或 open.bat 启动本机中转，再打开 http://127.0.0.1:8787/");
    return;
  }
  btn.disabled = true; btn.textContent = "解释中…";
  try {
    const r = await aiExplainFetch(entry.display, entry.sentence);
    entry.phonetic = r.phonetic;
    entry.explain = r.explain;
    save(); render();
  } catch (e) {
    const isHttpError = /^HTTP \d/.test(e.message);
    const hint = isHttpError
      ? "接口已连通，以上是模型返回的错误，按其提示调整配置即可。"
      : localBase
      ? "本机中转（127.0.0.1:8787）没响应，可到项目目录运行 python proxy.py 手动拉起。"
      : "网络不通、地址写错或跨域被拦截。";
    alert("AI 解释失败：" + e.message + "\n\n" + hint);
    btn.disabled = false; btn.textContent = "AI 解释（结合原句）";
  }
}
function vocabToCard(entry) {
  const firstLine = (entry.explain || "").split("\n")[0].slice(0, 60);
  const en = entry.example ? `${entry.display}: ${entry.example}` : entry.display;
  const zh = `「${entry.display}」${firstLine ? "：" + firstLine : ""}，看释义回忆你的造句`;
  addCard(en, zh, `原句：${entry.sentence}`, "vocab");
  entry.saved = true;
}
/* ---- 生词库（独立页）：AI 解释 → 造句 → AI 点评 → 点评逐条存学习库 ---- */
function vocabStatus(v) {
  const tags = [];
  if (!(v.explain || "").trim()) tags.push(["待解释", "#fbe9e7", "var(--red)"]);
  if (!(v.example || "").trim()) tags.push(["待造句", "#fdf6ec", "var(--amber)"]);
  if (!v.saved) tags.push(["未入库", "#eef0f6", "var(--ink-2)"]);
  if (v.saved) tags.push(["已入库 ✓", "var(--accent-soft)", "var(--accent)"]);
  return tags;
}
function renderVocab(main) {
  const all = [...(state.vocab || [])].reverse();
  const todoExplain = all.filter(v => !(v.explain || "").trim()).length;
  const todoExample = all.filter(v => !(v.example || "").trim()).length;
  const todoSave = all.filter(v => !v.saved).length;
  const FILTERS = [["all", "全部", all.length], ["explain", "待解释", todoExplain], ["example", "待造句", todoExample], ["unsaved", "未入库", todoSave]];
  const vfMatch = v => vocabFilter === "explain" ? !(v.explain || "").trim()
    : vocabFilter === "example" ? !(v.example || "").trim()
    : vocabFilter === "unsaved" ? !v.saved : true;
  const list = all.filter(vfMatch);
  main.innerHTML = `
    <div class="card">
      <div class="section-title">生词库（${all.length}）</div>
      <div class="btn-row" style="margin-top:2px">
        ${FILTERS.map(([k, label, n]) => `<button class="btn ${vocabFilter === k ? "primary" : "ghost"}" data-vf="${k}">${label} ${n}</button>`).join("")}
      </div>
      <p class="hint">阅读时划词收进来的生词/短语，在这里精加工：<b>AI 解释（带音标）→ 点 🔊 听发音 → 造句 → AI 点评 → 逐条或一键存学习库</b>。单词右侧的「存入学习库」把单词和解释一起入库，进入间隔复习并可导出 SuperMemo。</p>
    </div>
    ${list.length ? list.map(v => vocabEntryHTML(v)).join("") : `
    <div class="card"><div class="empty">${all.length ? "这个状态下没有生词，换个筛选看看。" : "还没有生词。去阅读任务里划选单词或短语添加。"}</div></div>`}`;
  list.forEach(v => bindVocabEntry(main, v));
  main.querySelectorAll("[data-vf]").forEach(b =>
    b.addEventListener("click", () => { vocabFilter = b.dataset.vf; render(); }));
}
function vocabEntryHTML(v) {
  const isPhrase = /\s/.test(v.display.trim());
  return `
    <div class="card vocab-entry">
      <div class="row" style="justify-content:space-between">
        <div class="vocab-head">
          <b class="vocab-word">${esc(v.display)}</b>
          ${v.phonetic ? `<span class="phonetic">${esc(v.phonetic)}</span>` : ""}
          <button class="speak-btn" data-speak="${v.id}" title="朗读">🔊</button>
        </div>
        <div class="row">
          <button class="btn primary" data-vsave="${v.id}" ${v.saved ? "disabled" : ""}>${v.saved ? "已存学习库 ✓" : "存入学习库"}</button>
          <button class="btn ghost danger" data-vdel="${v.id}" title="删除">×</button>
        </div>
      </div>
      <div class="vocab-sent">${isPhrase ? "短语" : "单词"} · ${v.added} · 原句：${esc(v.sentence)}</div>
      <div class="row" style="gap:6px;margin-top:6px">${vocabStatus(v).map(([label, bg, fg]) => `<span class="tag-fb" style="background:${bg};color:${fg}">${label}</span>`).join("")}</div>
      <div class="btn-row" style="margin-top:10px">
        <button class="btn" data-aiexp="${v.id}">AI 解释（结合原句）</button>
      </div>
      <textarea data-vzh="${v.id}" style="margin-top:10px;min-height:112px" placeholder="释义：点「AI 解释」自动填，也可以自己写一条">${esc(v.explain)}</textarea>
      <div class="mini-label">请造句：</div>
      <textarea data-vex="${v.id}" style="min-height:70px" placeholder="用「${esc(v.display)}」造一句你自己的话，别抄原句…">${esc(v.example)}</textarea>
      <div class="btn-row">
        <button class="btn" data-vaifb="${v.id}">AI 点评造句</button>
      </div>
      <div data-vtips="${v.id}"></div>
    </div>`;
}
function bindVocabEntry(main, v) {
  const q = sel => main.querySelector(sel);
  const sp = q(`[data-speak="${v.id}"]`);
  if (sp) sp.addEventListener("click", () => speakText(v.display));
  const del = q(`[data-vdel="${v.id}"]`);
  if (del) del.addEventListener("click", () => {
    if (!confirm("删掉「" + v.display + "」？")) return;
    state.vocab = state.vocab.filter(x => x.id !== v.id);
    save(); render();
  });
  const aiexp = q(`[data-aiexp="${v.id}"]`);
  if (aiexp) aiexp.addEventListener("click", () => runAiVocabExplain(v, aiexp));
  const zh = q(`[data-vzh="${v.id}"]`);
  if (zh) zh.addEventListener("input", () => { v.explain = zh.value; save(); });
  const ex = q(`[data-vex="${v.id}"]`);
  if (ex) ex.addEventListener("input", () => { v.example = ex.value; save(); });
  const af = q(`[data-vaifb="${v.id}"]`);
  if (af) af.addEventListener("click", () => {
    if (!v.example.trim()) { alert("先造一句，再点评"); return; }
    aiReviewVocab(v, af);
  });
  const sv = q(`[data-vsave="${v.id}"]`);
  if (sv) sv.addEventListener("click", () => {
    if (v.saved) return;
    vocabToCard(v); save(); render();
  });
  const vt = q(`[data-vtips="${v.id}"]`);
  if (vt && v.fb && v.fb.length) {
    renderTipsSaver(vt, v.fb, {
      type: "vtip", ctxFallback: "生词「" + v.display + "」的造句点评",
      itemLabel: "存到学习库", saveAllLabel: "一键全部存到学习库",
    });
  }
}
