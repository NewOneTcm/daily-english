/* ============ 场景阅读（Context Practice）模块 ============
   取生词库里不熟次数最高的词 → 归到同一场景 → LLM 生成 400 字短文 →
   文中高亮 → 标记「还不熟 / 认识了」→ 回写计数 → 越不熟的词出现频率越高。
   参考：场景阅读模块_完整逻辑文档.md（V1 闭环）。本文件独立，可单独维护。
*/

const CTX_CONFIG = {
  W_UNKNOWN: 10,      // 不熟次数权重（核心）
  W_NEW: 50,          // 从未曝光过的加成
  W_DAYS: 1.5,        // 距上次曝光天数权重（间隔重复）
  W_STREAK_PEN: 20,   // 快掌握的降权
  W_RECENT_PEN: 40,   // 最近 3 天刚出现过的惩罚
  RECENT_DAYS: 3,
  PICK_COUNT: 10,     // 目标取词数
  MIN_PICK_COUNT: 5,  // 最少取词数
  MASTERED_STREAK: 5, // 连续认识几次毕业
};

/* ---- 词形还原校验（文档 §4.3 兜底方案） ---- */
const IRREGULAR = {
  go: ["went", "gone", "goes", "going"], get: ["got", "gotten", "gets", "getting"],
  be: ["am", "is", "are", "was", "were", "been", "being"], have: ["has", "had", "having"],
  do: ["does", "did", "done", "doing"], see: ["saw", "seen", "sees", "seeing"],
  take: ["took", "taken", "takes", "taking"], come: ["came", "comes", "coming"],
  know: ["knew", "known", "knows", "knowing"], think: ["thought", "thinks", "thinking"],
  bring: ["brought"], catch: ["caught"], teach: ["taught"], buy: ["bought"],
  fight: ["fought"], seek: ["sought"], man: ["men"], woman: ["women"],
  child: ["children"], foot: ["feet"], tooth: ["teeth"], mouse: ["mice"],
  datum: ["data"], medium: ["media"], criterion: ["criteria"],
  analysis: ["analyses"], thesis: ["theses"], basis: ["bases"],
};
function candidateForms(lemma) {
  const s = new Set([lemma.toLowerCase()]);
  const add = x => s.add(x.toLowerCase());
  const l = lemma.toLowerCase();
  add(l + "s"); add(l + "es");
  add(l.replace(/y$/, "ies"));
  add(l + "ed"); add(l + "d");
  add(l.replace(/e$/, "ed"));
  add(l.replace(/y$/, "ied"));
  add(l + "ing");
  add(l.replace(/e$/, "ing"));
  add(l.replace(/([bdgmnprt])$/, "$1$1ing"));
  add(l + "ly"); add(l.replace(/y$/, "ily"));
  add(l + "ness"); add(l + "er"); add(l + "ers");
  add(l + "ion"); add(l + "ment"); add(l + "able");
  (IRREGULAR[l] || []).forEach(add);
  return s;
}
function countPhrase(text, phrase) {
  const norm = s => s.toLowerCase().replace(/[\s\-]+/g, " ").trim();
  const hay = norm(text), needle = norm(phrase);
  let count = 0, i = 0;
  while ((i = hay.indexOf(needle, i)) !== -1) { count++; i += needle.length; }
  return count;
}
function countLemma(text, lemma) {
  const forms = candidateForms(lemma);
  const tokens = text.toLowerCase().match(/[a-z'’-]+/g) || [];
  let n = 0;
  tokens.forEach(t => { if (forms.has(t)) n++; });
  return n;
}
function validateArticle(contentEn, targets) {
  const missing = [], overused = [];
  targets.forEach(t => {
    const isPhrase = /\s/.test(t.word.trim());
    const count = isPhrase ? countPhrase(contentEn, t.word) : countLemma(contentEn, t.word);
    if (count === 0) missing.push(t.word);
    else if (count > 3) overused.push(t.word);
  });
  return { pass: missing.length === 0 && overused.length === 0, missing, overused };
}

/* ---- 选词（文档 §3） ---- */
function ctxPracticePool() {
  return (state.vocab || []).map(ensureCtxCounts)
    .filter(v => contextPracticeFilter(v)); // 排除掠过词（生词库分诊）
}
function priorityScore(v, now) {
  const daysSince = v.lastExposedAt ? (now - new Date(v.lastExposedAt).getTime()) / 86400000 : 999;
  return (
    v.unknownCount * CTX_CONFIG.W_UNKNOWN +
    (v.exposureCount === 0 ? CTX_CONFIG.W_NEW : 0) +
    Math.min(daysSince, 60) * CTX_CONFIG.W_DAYS -
    v.knownStreak * CTX_CONFIG.W_STREAK_PEN -
    (daysSince < CTX_CONFIG.RECENT_DAYS ? CTX_CONFIG.W_RECENT_PEN : 0)
  );
}
function ctxPickCandidates(limit = 30) {
  const now = Date.now();
  return ctxPracticePool()
    .map(v => ({ v, score: priorityScore(v, now) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit) // 发给 LLM 只取优先级最高的 30 个（词多了全发会撑爆 token）
    .map(x => x.v);
}
// 待练池真实总数（页面上显示用，与发给 LLM 的 30 个区分开）
function ctxPoolTotal() {
  return ctxPracticePool().length;
}

/* ---- LLM 两阶段生成（文档 §4） ---- */
function parseJsonFromAI(text) {
  const m = String(text || "").replace(/```(?:json)?\n?/gi, "").match(/\{[\s\S]*\}/);
  if (!m) throw new Error("AI 返回里没有 JSON");
  return JSON.parse(m[0]);
}
async function ctxStage1(cands) {
  const candidates = cands.map(v => ({
    word: v.display, pos: (v.explain || "").match(/^\s*([a-z]+\.)/i) ? v.explain.match(/^\s*([a-z]+\.)/i)[1] : "",
    user_gloss: (v.explain || "").split("\n")[0].slice(0, 60), unknown_count: v.unknownCount,
  }));
  const text = await aiChat([
    { role: "system", content: `你是英语教学助手。以下是用户标记过"不熟"的生词候选（按优先级从高到低排列）。请从中挑选 ${CTX_CONFIG.PICK_COUNT} 个词，要求：1. 这些词必须能被自然地放进同一个场景或主题；2. 优先挑选 unknown_count 高的词；3. 如果强行凑满数量会导致场景割裂，允许少选（最少 ${CTX_CONFIG.MIN_PICK_COUNT} 个）；4. 不要造词，不要改变候选词的原形，不要使用候选词表以外的词。严格输出 JSON，不要输出任何多余文字：{"scene":"一句话描述你构思的场景","words":["word1","word2"],"reason":"这些词为何能放进同一场景"}` },
    { role: "user", content: JSON.stringify(candidates) },
  ], { timeoutMs: 90000, retries: 2 }); // 选词较短，90s 足够
  const r = parseJsonFromAI(text);
  if (!r.scene || !Array.isArray(r.words) || !r.words.length) throw new Error("选词返回格式不对");
  return r;
}
async function ctxStage2(words, scene) {
  const level = state.level || "B1";
  const targets = words.map(v => ({
    word: v.display, pos: (v.explain || "").match(/^\s*([a-z]+\.)/i) ? v.explain.match(/^\s*([a-z]+\.)/i)[1] : "",
    required_sense: "", user_gloss: (v.explain || "").split("\n")[0].slice(0, 60),
    is_phrase: /\s/.test(v.display.trim()),
  }));
  const text = await aiChat([
    { role: "system", content: `你是英语教学助手，请为英语学习者写一篇用于"在语境中巩固生词"的英文短文。
【目标词】以下词必须全部出现在文章中（允许使用常见变形：复数、时态、分词、派生词）。
【文章要求】1. 字数约 400 个英文单词（±10%）；2. 体裁 story；场景：${scene}；难度 CEFR ${level}；3. 除目标词外其余用词明显低于目标词难度，上下文易懂；4. 每个目标词出现 1–3 次，首次出现必须自带语境线索（同义复现/反义对比/举例/定义解释/因果情境）；5. 目标词必须出现在有信息量的句子里；6. 有完整情节或清晰论点，不要写成单词例句拼盘；7. 用常见英文名。
【输出格式】严格输出 JSON，不要输出多余文字：{"title":"","title_zh":"","content_en":"英文正文，段落间用 \\n\\n 分隔","content_zh":"中文全文翻译","target_words":[{"word":"原形","matched_forms":["文中实际形式"],"first_sentence":"首次出现的完整英文句子","clue_type":"同义复现/反义对比/举例/定义解释/因果情境","sense_zh":"文中义","explanation_zh":"线索说明（30字内）"}]}` },
    { role: "user", content: JSON.stringify(targets) },
  ], { timeoutMs: 240000, retries: 3, retryDelayMs: 2500 }); // 写 400 字短文最耗时，放宽到 4 分钟、多重试几次
  const r = parseJsonFromAI(text);
  if (!r.content_en || !Array.isArray(r.target_words)) throw new Error("文章返回格式不对");
  return r;
}

/* ---- 生成入口（含校验 + 重试） ---- */
async function ctxGenerate() {
  const cands = ctxPickCandidates(30); // 发给 LLM 只取优先级最高的 30 个
  if (cands.length < CTX_CONFIG.MIN_PICK_COUNT) {
    alert(`待练的生词只有 ${cands.length} 个，至少 ${CTX_CONFIG.MIN_PICK_COUNT} 个才能生成。\n\n先去「阅读」或「精读」模块划选一些生词吧。`);
    return;
  }
  const s1 = await ctxStage1(cands);
  const words = s1.words.map(w => (state.vocab || []).find(v => v.display === w || v.word === String(w).toLowerCase())).filter(Boolean);
  if (words.length < CTX_CONFIG.MIN_PICK_COUNT) throw new Error("匹配到的目标词太少");

  let art = await ctxStage2(words, s1.scene);
  let val = validateArticle(art.content_en, art.target_words.map(t => ({ word: t.word })));
  let tried = 0;
  while (!val.pass && tried < 2) {
    tried++;
    if (val.missing.length) {
      // 第 1 次重试：明确补上缺失词
      art = await ctxStage2Retry(words, s1.scene, val.missing);
    } else {
      // 第 2 次：移除最难匹配的词重来
      const remaining = words.filter(w => !val.missing.includes(w.display) && !val.missing.includes(w.word));
      if (remaining.length >= CTX_CONFIG.MIN_PICK_COUNT) {
        art = await ctxStage2(remaining, s1.scene);
      } else break;
    }
    val = validateArticle(art.content_en, art.target_words.map(t => ({ word: t.word })));
  }
  // 落库 + 曝光计数
  state.nextCtxId = state.nextCtxId || 1;
  const article = {
    id: state.nextCtxId++, title: art.title || "", titleZh: art.title_zh || "",
    contentEn: art.content_en, contentZh: art.content_zh || "", genre: "story", level: state.level || "B1",
    scene: s1.scene, wordCount: (art.content_en.match(/[a-z'’-]+/gi) || []).length,
    targets: (art.target_words || []).map(t => {
      const v = (state.vocab || []).find(x => x.display === t.word || x.word === String(t.word).toLowerCase());
      return { wordId: v ? v.id : null, word: t.word, matchedForms: t.matched_forms || [], firstSentence: t.first_sentence || "", clueType: t.clue_type || "", senseZh: t.sense_zh || "", explanationZh: t.explanation_zh || "", marked: null };
    }),
    status: "draft", createdAt: new Date().toISOString(),
    missingNote: val.pass ? "" : `本篇有 ${val.missing.length} 个词未能自然融入`,
  };
  state.ctxArticles.unshift(article);
  words.forEach(v => { ensureCtxCounts(v); v.exposureCount += 1; v.lastExposedAt = new Date().toISOString(); });
  save();
  return article;
}
async function ctxStage2Retry(words, scene, missing) {
  const level = state.level || "B1";
  const targets = words.map(v => ({ word: v.display, user_gloss: (v.explain || "").split("\n")[0].slice(0, 60), is_phrase: /\s/.test(v.display.trim()) }));
  const text = await aiChat([
    { role: "system", content: `你是英语教学助手。为"在语境中巩固生词"写一篇英文短文。场景：${scene}；难度 CEFR ${level}；约 400 词；目标词必须全部出现，每个 1–3 次，首次出现自带语境线索。【特别注意】下面这些词上一版漏了，这次必须出现：${missing.join("、")}。严格输出 JSON：{"title":"","title_zh":"","content_en":"","content_zh":"","target_words":[{"word":"","matched_forms":[],"first_sentence":"","clue_type":"","sense_zh":"","explanation_zh":""}]}` },
    { role: "user", content: JSON.stringify(targets) },
  ], { timeoutMs: 240000, retries: 3, retryDelayMs: 2500 });
  const r = parseJsonFromAI(text);
  if (!r.content_en || !Array.isArray(r.target_words)) throw new Error("文章返回格式不对");
  return r;
}
/* ---- 标记与计数回写（文档 §5.4） ---- */
function ctxMarkWord(articleId, wordId, action) {
  const v = (state.vocab || []).find(x => x.id === wordId);
  if (!v) return;
  ensureCtxCounts(v);
  const now = new Date().toISOString();
  if (action === "unknown") {
    v.unknownCount += 1; v.knownStreak = 0; v.lastUnknownAt = now;
  } else {
    v.knownStreak += 1;
    if (v.knownStreak >= CTX_CONFIG.MASTERED_STREAK) { v.status = "mastered"; v.masteredAt = now; }
  }
  v.lastExposedAt = now;
  const art = (state.ctxArticles || []).find(a => a.id === articleId);
  if (art) { const t = art.targets.find(x => x.wordId === wordId); if (t) t.marked = action; }
  save();
}

/* ---- 渲染 ---- */
let ctxView = { articleId: null }; // null=列表页
function renderContext(main) {
  state.ctxArticles = state.ctxArticles || [];
  const art = (state.ctxArticles || []).find(a => a.id === ctxView.articleId);
  if (art) renderCtxArticle(main, art);
  else renderCtxHome(main);
}
function renderCtxHome(main) {
  const pool = ctxPickCandidates(30); // 判断够不够生成用 Top30
  const total = ctxPoolTotal();      // 页面上显示待练池真实总数
  const mastered = (state.vocab || []).filter(v => v.status === "mastered").length;
  main.innerHTML = `
    <div class="card">
      <div class="section-title">场景阅读</div>
      <p class="hint">取生词库里<b>最不熟</b>的词，让 AI 把它们编进同一篇短文，在语境里反复遇见 → 巩固记忆。读完标记「还不熟 / 认识了」，越不熟的词出现频率越高。</p>
      <div class="stat-row" style="margin-top:12px">
        <div class="stat"><b>${total}</b><span>待练生词</span></div>
        <div class="stat amber"><b>${(state.ctxArticles || []).length}</b><span>已生成文章</span></div>
        <div class="stat"><b>${mastered}</b><span>已掌握</span></div>
      </div>
      ${total > 30 ? `<p class="hint" style="margin-top:2px">待练生词共 <b>${total}</b> 个，生成时只把<b>优先级最高的 30 个</b>发给 AI 挑选（越不熟越靠前），避免词太多拖慢生成。</p>` : ""}
      <div class="btn-row">
        <button class="btn primary" id="ctxGen" ${total < CTX_CONFIG.MIN_PICK_COUNT ? "disabled" : ""}>生成一篇场景短文（取最不熟的 ${Math.min(total, CTX_CONFIG.PICK_COUNT)} 词）</button>
      </div>
      ${total < CTX_CONFIG.MIN_PICK_COUNT ? `<p class="hint" style="color:var(--amber)">待练生词不足 ${CTX_CONFIG.MIN_PICK_COUNT} 个。先去「阅读」或「精读」模块划选一些生词加入生词库。</p>` : ""}
    </div>
    <div class="card">
      <div class="section-title">历史文章</div>
      ${(state.ctxArticles || []).length ? `<ul class="list">${(state.ctxArticles || []).map(a => `
        <li style="cursor:pointer" data-openart="${a.id}">
          <span class="en">${esc(a.title || "未命名")}</span>
          <span class="zh">${esc(a.titleZh || a.scene || "")}</span>
          <span class="due">${a.createdAt ? a.createdAt.slice(0, 10) : ""}</span>
        </li>`).join("")}</ul>` : `<div class="empty">还没有生成过场景文章。</div>`}
    </div>`;
  const gen = $("#ctxGen");
  if (gen) gen.addEventListener("click", async () => {
    gen.disabled = true; gen.textContent = "生成中（选词 → 写文章，超时自动重试）…";
    try { const art = await ctxGenerate(); if (art) { ctxView.articleId = art.id; render(); } }
    catch (e) { alert("生成失败：" + e.message + "\n\n如果是超时/502，模型这次没写完，点「生成」再试一次即可（会自动重试）。"); gen.disabled = false; gen.textContent = "生成一篇场景短文"; }
  });
  main.querySelectorAll("[data-openart]").forEach(li =>
    li.addEventListener("click", () => { ctxView.articleId = Number(li.dataset.openart); render(); }));
}
/* 把正文切成 token，目标词包 span（不破坏 HTML）。支持单词 + 多词短语。 */
function ctxTokenizeHTML(text, targets) {
  const wordMap = {};   // 单词 token(lower) -> target
  const phrases = [];   // 短语 [{ target, forms[] }]
  targets.forEach(t => {
    const isPhrase = /\s/.test(t.word.trim());
    if (isPhrase) {
      const forms = (t.matchedForms && t.matchedForms.length ? t.matchedForms : [t.word]);
      phrases.push({ target: t, forms });
    } else {
      (t.matchedForms && t.matchedForms.length ? t.matchedForms : [t.word]).forEach(f => { wordMap[String(f).toLowerCase()] = t; });
      candidateForms(t.word).forEach(f => { wordMap[f] = wordMap[f] || t; });
    }
  });
  // 先匹配短语（按长度降序，先匹配长的避免重叠），记录占位区间
  const hits = []; // { start, end, text, target }
  phrases.forEach(p => {
    p.forms.forEach(f => {
      const norm = s => s.toLowerCase().replace(/[\s\-]+/g, " ").trim();
      const hay = norm(text), needle = norm(f);
      let i = 0;
      while ((i = hay.indexOf(needle, i)) !== -1) {
        hits.push({ start: i, end: i + needle.length, text: text.slice(i, i + needle.length), target: p.target });
        i += needle.length;
      }
    });
  });
  hits.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));
  // 去掉重叠（保留先匹配/较长的）
  const occupied = [];
  const cleanHits = hits.filter(h => {
    if (occupied.some(o => h.start < o.end && h.end > o.start)) return false;
    occupied.push(h); return true;
  });
  // 再匹配单词 token
  const re = /([A-Za-z]+(?:['’\-][A-Za-z]+)?)/g;
  let m;
  while ((m = re.exec(text))) {
    const start = m.index, end = re.lastIndex;
    if (occupied.some(o => start < o.end && end > o.start)) continue; // 已在短语区间内
    const t = wordMap[m[0].toLowerCase()];
    if (t) cleanHits.push({ start, end, text: m[0], target: t });
  }
  cleanHits.sort((a, b) => a.start - b.start);
  // 组装 HTML
  let html = "", last = 0;
  cleanHits.forEach(h => {
    html += esc(text.slice(last, h.start));
    html += `<span class="ctx-w ${ctxWordClass(h.target)}" data-cw="${h.target.wordId}">${esc(h.text)}</span>`;
    last = h.end;
  });
  html += esc(text.slice(last));
  return html;
}
function ctxWordClass(t) {
  let c = "";
  if (t.marked === "unknown") c = "ctx-unknown";
  else if (t.marked === "known") c = "ctx-known";
  const v = (state.vocab || []).find(x => x.id === t.wordId);
  if (v && !t.marked && v.unknownCount >= 3) c = "ctx-hard"; // 顽固难词红色底
  return c;
}
function renderCtxArticle(main, art) {
  const marked = art.targets.filter(t => t.marked).length;
  const poolV = id => (state.vocab || []).find(x => x.id === id);
  main.innerHTML = `
    <div class="card">
      <div class="row" style="justify-content:space-between">
        <div>
          <div class="task-cn" style="margin:0">${esc(art.title || "场景短文")}</div>
          <div class="task-en">${esc(art.titleZh || "")}</div>
        </div>
        <button class="btn ghost" id="ctxBack">← 返回</button>
      </div>
      <div class="task-meta">${esc(art.genre)} · ${esc(art.level)} · ${art.wordCount} 词 · ${art.targets.length} 个目标词${art.missingNote ? ` · <span style="color:var(--amber)">${esc(art.missingNote)}</span>` : ""}</div>
      <p class="hint" style="margin-top:6px">橙色下划线 = 一般难词，红色底 = 顽固难词。<b>不认识的词点开看解释并标记；没点开的词，点「完成」时会自动算你熟悉了。</b></p>
    </div>
    <div class="card">
      <div class="read-text" id="ctxBody">${ctxTokenizeHTML(art.contentEn, art.targets)}</div>
      <p class="hint" style="margin-top:8px">💡 也可划选文中任何单词或短语：弹出解释，加入生词库。</p>
      <div class="hist-text" style="margin-top:12px;background:#fbf7f0">${esc(art.contentZh || "")}</div>
      <div id="ctxCard"></div>
      <div class="btn-row" style="margin-top:14px">
        <button class="btn" id="ctxAllKnown">全部认识了</button>
        <button class="btn primary" id="ctxFinish">完成（${marked}/${art.targets.length}）</button>
      </div>
    </div>`;
  $("#ctxBack").addEventListener("click", () => { ctxView.articleId = null; render(); });
  // 划选任意词句 → 弹 AI 解释 → 加生词库（与阅读/精读共用的独立模块）
  bindPassageSelect($("#ctxBody"), art.contentEn);
  main.querySelectorAll("[data-cw]").forEach(sp =>
    sp.addEventListener("click", () => {
      const id = Number(sp.dataset.cw);
      const t = art.targets.find(x => x.wordId === id);
      if (t) {
        // 点开看解释 = 主动学这个词，记一次"今日新学"（同词一天只记一次）
        const v = poolV(id);
        if (v) { const today = todayKey(); if (v.ctxSeenAt !== today) { v.ctxSeenAt = today; v.ctxSeenNew = true; save(); } }
        paintCtxCard($("#ctxCard"), art, t, v);
      }
    }));
  $("#ctxAllKnown").addEventListener("click", () => {
    art.targets.forEach(t => { if (!t.marked && t.wordId) ctxMarkWord(art.id, t.wordId, "known"); });
    render();
  });
  $("#ctxFinish").addEventListener("click", () => {
    // 逻辑：只有不认识的词你才会点开看解释；没点开、也没标记的词，视为你已经熟悉了
    // 完成时把未标记的词自动按「认识了」回写（known+1，满阈值毕业）
    art.targets.forEach(t => { if (!t.marked && t.wordId) ctxMarkWord(art.id, t.wordId, "known"); });
    art.status = "finished"; art.finishedAt = new Date().toISOString(); save();
    const unk = art.targets.filter(t => t.marked === "unknown").length;
    const kn = art.targets.filter(t => t.marked === "known").length;
    alert(`本篇小结：${art.targets.length} 个目标词 · 认识 ${kn}（含未点开自动算熟悉）· 还不熟 ${unk}`);
    ctxView.articleId = null; render();
  });
}
function paintCtxCard(box, art, t, v) {
  if (!box) return;
  box.innerHTML = `
    <div class="card ctx-detail">
      <div class="row" style="justify-content:space-between">
        <div>
          <b class="vocab-word">${esc(t.word)}</b>
          ${v && v.phonetic ? `<span class="phonetic">${esc(v.phonetic)}</span>` : ""}
          ${v ? `<button class="speak-btn" id="ctxSpeak" title="朗读">🔊</button>` : ""}
        </div>
        <button class="btn ghost" id="ctxCardClose" title="关闭" style="padding:0 8px;font-size:18px;line-height:1">×</button>
      </div>
      ${v ? `<span class="hint">不熟 ${v.unknownCount} 次 · 练过 ${v.exposureCount} 篇</span>` : ""}
      <div class="vocab-sent">文中义：${esc(t.senseZh || "—")} · 线索：${esc(t.clueType || "—")}${t.explanationZh ? " · " + esc(t.explanationZh) : ""}</div>
      ${v && v.explain ? `<div class="vocab-sent">你的标注：${esc(v.explain.split("\n")[0].slice(0, 80))}</div>` : ""}
      ${v && v.sentence ? `<div class="vocab-sent">阅读原句：${esc(v.sentence)}</div>` : ""}
      ${t.firstSentence ? `<div class="vocab-sent">文中句子：${esc(t.firstSentence)}</div>` : ""}
      <div class="btn-row">
        <button class="btn danger" id="ctxUnk">还不熟</button>
        <button class="btn primary" id="ctxKnown">认识了</button>
      </div>
    </div>`;
  const close = $("#ctxCardClose", box);
  if (close) close.addEventListener("click", () => { box.innerHTML = ""; });
  const spk = $("#ctxSpeak", box);
  if (spk) spk.addEventListener("click", () => speakText(t.word));
  $("#ctxUnk", box).addEventListener("click", () => { ctxMarkWord(art.id, t.wordId, "unknown"); box.innerHTML = ""; render(); });
  $("#ctxKnown", box).addEventListener("click", () => { ctxMarkWord(art.id, t.wordId, "known"); box.innerHTML = ""; render(); });
}
