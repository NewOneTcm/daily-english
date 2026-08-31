/* ---- 生词库：阅读划词入库 → 独立页精加工（解释→造句→点评→存学习库） ---- */
let vocabFilter = "all"; // all | explain | example | unsaved

function addVocab(word, sentence) {
  const w = word.toLowerCase();
  let entry = (state.vocab || []).find(v => v.word === w);
  if (!entry) {
    state.nextVocabId = state.nextVocabId || (state.vocab.length + 1);
    // 场景阅读计数：加入生词本即"我不认识"，unknownCount 初始为 1
    entry = {
      id: state.nextVocabId++, word: w, display: word, sentence, explain: "", example: "", fb: [], saved: false, added: todayKey(),
      unknownCount: 1, exposureCount: 0, knownStreak: 0, status: "learning",
      // 升级版新增字段
      isPhrase: /\s/.test(word.trim()), pos: "", glossZh: "", aiExample: "", aiExampleZh: "",
      collocations: [], family: [], memoryTip: "", senses: [],
      // 默认产出词（短语必产出；单词先按产出走，AI 解释后按 freqHint 精修：低频专名才会降为掠过）
      // 若默认 recognition，所有新词都会被「待造句」筛选排除、也没有造句框
      disposition: "production", dispositionLocked: false, workshopStep: 0, priorityScore: 0,
      sentenceVerdict: "none", errorTags: [], cardId: null, freqHint: "low", familyKey: "", processedAt: null,
    };
    state.vocab.push(entry);
  } else {
    entry.sentence = sentence; // 用最新的出处句子
    ensureCtxCounts(entry);
    // 回炉：已掌握（mastered）的词被重新加入，说明又忘了 → 重新进待练池并重走加工
    if (entry.status === "mastered") {
      entry.status = "learning";
      entry.unknownCount += 1;
      entry.knownStreak = 0;
      entry.masteredAt = undefined;
      entry.workshopStep = 0;
    }
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
/* ============ 升级版：分诊 · 结构化 · 优先级 · 今日队列 ============ */
const DISPOSITION_META = {
  production: { label: "产出词", color: "#ef4444", desc: "要会认、会写、会用" },
  recognition: { label: "认知词", color: "#f59e0b", desc: "阅读时认得出即可" },
  skim: { label: "掠过词", color: "#9aa3ad", desc: "存个释义备查" },
};
const PRIORITY = {
  W_DISPOSITION: { production: 40, recognition: 20, skim: 0 },
  W_UNKNOWN: 12, W_SM_LAPSES: 10, W_UNEXPLAINED: 50,
  W_NEVER_PRACTICED: 30, W_FREQ: { high: 25, mid: 10, low: 0 },
  W_STALE: 1.5, W_STALE_CAP: 30, W_SENTENCE_PENDING: 15,
};
const QUEUE_SIZE = 6;

function vocabEnsureNewFields(v) {
  if (!DISPOSITION_META[v.disposition]) v.disposition = "recognition";
  if (typeof v.dispositionLocked !== "boolean") v.dispositionLocked = false;
  if (typeof v.workshopStep !== "number") v.workshopStep = (v.explain || "").trim() ? ((v.example || "").trim() ? ((v.fb || []).length ? 4 : 3) : 2) : 0;
  if (typeof v.priorityScore !== "number") v.priorityScore = 0;
  if (!v.sentenceVerdict) v.sentenceVerdict = "none";
  if (!Array.isArray(v.errorTags)) v.errorTags = [];
  if (typeof v.isPhrase !== "boolean") v.isPhrase = /\s/.test((v.display || "").trim());
  if (v.cardId === undefined) v.cardId = null;
  if (!v.freqHint) v.freqHint = "low";
  return v;
}
// §3.2 自动分诊：产出词=会写会用，认知词=认得即可，掠过词=备查
function autoDisposition(v, freqHint) {
  if (v.dispositionLocked) return v.disposition;
  if ((v.unknownCount || 0) >= 2) return "production";
  if ((v.smLapses || 0) >= 2) return "production";
  if (freqHint === "high") return "production";
  if (freqHint === "low" && /^[A-Z]/.test(v.display) && !(v.sentence || "").startsWith(v.display)) return "skim";
  if (v.isPhrase) return "production";
  return "recognition";
}
// §4.2 流水线推进
function advanceStep(v, action) {
  if (action === "explained") v.workshopStep = 1;
  else if (action === "listened") v.workshopStep = (v.disposition === "recognition" || v.disposition === "skim") ? 4 : 2;
  else if (action === "sentenced") v.workshopStep = 3;
  else if (action === "reviewed") v.workshopStep = 4;
  v.processedAt = new Date().toISOString();
}
// §7.1 优先级打分
function recalcPriority(v) {
  vocabEnsureNewFields(v); ensureCtxCounts(v);
  const staleDays = v.added ? (Date.now() - new Date(v.added + "T00:00:00").getTime()) / 86400000 : 0;
  const score =
    (PRIORITY.W_DISPOSITION[v.disposition] || 0)
    + (v.unknownCount || 0) * PRIORITY.W_UNKNOWN
    + (v.smLapses || 0) * PRIORITY.W_SM_LAPSES
    + (v.workshopStep === 0 ? PRIORITY.W_UNEXPLAINED : 0)
    + (v.exposureCount === 0 ? PRIORITY.W_NEVER_PRACTICED : 0)
    + (PRIORITY.W_FREQ[v.freqHint || "low"] || 0)
    + Math.min(staleDays, PRIORITY.W_STALE_CAP) * PRIORITY.W_STALE
    + (v.workshopStep === 3 ? PRIORITY.W_SENTENCE_PENDING : 0);
  v.priorityScore = score;
  return score;
}
// §7.2 今日任务队列
function buildDailyQueue(size = QUEUE_SIZE) {
  return (state.vocab || [])
    .map(vocabEnsureNewFields)
    .filter(v => v.status === "learning" && v.disposition !== "skim" && v.workshopStep < 4
      && (!v.snoozedUntil || new Date(v.snoozedUntil).getTime() <= Date.now()))
    .map(v => ({ v, score: recalcPriority(v) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, size)
    .map(x => x.v);
}
// 逾期词：入库超过 14 天且未完成加工
function overdueCount() {
  const cut = Date.now() - 14 * 86400000;
  return (state.vocab || []).filter(v => v.workshopStep < 4 && v.added && new Date(v.added + "T00:00:00").getTime() < cut).length;
}
// 流水线当前卡在哪一步（用于队列展示）
function vocabStepLabel(v) {
  if (v.workshopStep === 0) return "待解释";
  if (v.workshopStep === 1) return "待听音";
  if (v.workshopStep === 2) return "待造句";
  if (v.workshopStep === 3) return "待点评";
  return "已完成";
}
// 词族归组键（规则派生）
const DERIVATIONAL_SUFFIXES = ["ations", "ation", "ators", "ator", "ments", "ment", "ities", "ity", "nesses", "ness", "fully", "ful", "lessly", "less", "ively", "ive", "ably", "able", "ings", "ing", "edly", "ed", "es", "s", "ly"];
function familyKeyOf(lemma) {
  const lower = String(lemma || "").toLowerCase();
  for (const suf of DERIVATIONAL_SUFFIXES) {
    if (lower.length > suf.length + 2 && lower.endsWith(suf)) return lower.slice(0, -suf.length);
  }
  return lower;
}
// §3.3 待练池排除掠过词
function contextPracticeFilter(v) {
  return v.status === "learning" && (v.unknownCount || 0) >= 1 && v.disposition !== "skim";
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
  // 结构化点评（升级）：返回 FeedbackEntry { verdict, score, errorTypes, corrected, reason, targetWordOk }
  const prev = entry.fb || [];
  const text = await aiChat([
    { role: "system", content: `你是英语写作教练。请点评学习者用目标词造的句子，检查：目标词用法（词性/搭配/义项）、语法、地道度。grading：good=无明显问题；needsWork=有错误但不影响理解；wrong=目标词用错或严重不通。严格输出 JSON，不要多余文字：{"verdict":"good","score":88,"error_types":["介词搭配"],"error_spans":[{"start":0,"end":2,"text":"x","why":"原因"}],"corrected":"修正后的句子","reason":"为什么这么改","alternatives":["另一种说法"],"target_word_ok":true}` },
    { role: "user", content: JSON.stringify({
      word: entry.word, pos: entry.pos || "", gloss_zh: entry.glossZh || "",
      ai_example: entry.aiExample || "", user_sentence: entry.example || "",
      previous_feedback: prev.length ? JSON.stringify(prev.slice(-2)) : "",
    }) },
  ], { timeoutMs: 90000, retries: 2 });
  const d = JSON.parse(String(text || "").replace(/```(?:json)?\n?/gi, "").match(/\{[\s\S]*\}/)[0]);
  const fbEntry = {
    round: prev.length + 1, verdict: d.verdict || "needsWork", score: d.score || 0,
    errorTypes: d.error_types || [], errorSpans: d.error_spans || [],
    corrected: d.corrected || "", reason: d.reason || "", alternatives: d.alternatives || [],
    targetWordOk: d.target_word_ok !== false, createdAt: new Date().toISOString(),
    // 兼容旧渲染：中文提示行
    zh: (d.error_types && d.error_types[0] ? d.error_types[0] + "：" : "") + (d.reason || ""), en: d.corrected || "",
  };
  entry.fb = [...prev, fbEntry];
  entry.sentenceVerdict = fbEntry.verdict;
  entry.errorTags = [...new Set([...(entry.errorTags || []), ...fbEntry.errorTypes])];
  // targetWordOk=false → 目标词用错了，不熟+1 回炉
  if (!fbEntry.targetWordOk) {
    ensureCtxCounts(entry);
    entry.unknownCount += 1; entry.knownStreak = 0;
    if (entry.status === "mastered") { entry.status = "learning"; entry.masteredAt = undefined; }
  }
  advanceStep(entry, "reviewed");
  recalcPriority(entry);
  save();
  return fbEntry;
}
// AI 解释（结构化）：返回 { phonetic, pos, gloss_zh, example_en, example_zh, collocations, family, memory_tip, freq_hint, is_new_sense }
async function aiExplainStructured(word, sentence, existingSenses) {
  const text = await aiChat([
    { role: "system", content: `你是英语词汇教学助手。为生词生成结构化解释。要求：释义匹配原句义项；gloss_zh ≤20字；example_en 难度低、自带语境线索、10–25词；collocations 给2–3个常用搭配；family 给同词族派生词；memory_tip 给中文助记；freq_hint 判断词频档（high前3000/mid 3000-8000/low 8000外或学科专有）。严格输出 JSON：{"lemma":"原形","pos":"n./v./adj./adv./phrase","phonetic":"/x/","gloss_zh":"中文释义","sense_note":"为何是这个义项","is_new_sense":false,"example_en":"新例句","example_zh":"例句翻译","collocations":["搭配"],"family":["派生词"],"memory_tip":"助记","freq_hint":"high"}` },
    { role: "user", content: JSON.stringify({ word, display: word, sentence: sentence || "", existing_senses: existingSenses || [] }) },
  ], { timeoutMs: 90000, retries: 2 });
  const m = String(text || "").replace(/```(?:json)?\n?/gi, "").match(/\{[\s\S]*\}/);
  if (!m) throw new Error("AI 返回里没有 JSON");
  return JSON.parse(m[0]);
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
    vocabEnsureNewFields(entry);
    const d = await aiExplainStructured(entry.display, entry.sentence, entry.senses);
    entry.phonetic = d.phonetic || "";
    entry.pos = d.pos || "";
    entry.glossZh = d.gloss_zh || "";
    entry.aiExample = d.example_en || "";
    entry.aiExampleZh = d.example_zh || "";
    entry.collocations = d.collocations || [];
    entry.family = d.family || [];
    entry.memoryTip = d.memory_tip || "";
    entry.freqHint = d.freq_hint || "low";
    // 一词多义并入 senses
    const senses = entry.senses || [];
    if (d.is_new_sense || !senses.length) {
      senses.push({ gloss: d.gloss_zh, sentence: entry.sentence, addedAt: new Date().toISOString() });
      entry.senses = senses;
    }
    // 兼容字段（只读，供旧 UI 与其它模块读取）
    entry.explain = `${d.pos || ""} ${d.gloss_zh || ""}${d.example_en ? "。例：" + d.example_en : ""}`.trim();
    entry.familyKey = familyKeyOf(entry.word);
    // 分诊
    if (!entry.dispositionLocked) entry.disposition = autoDisposition(entry, d.freq_hint);
    advanceStep(entry, "explained");
    recalcPriority(entry);
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
  vocabEnsureNewFields(entry);
  const firstLine = entry.glossZh || (entry.explain || "").split("\n")[0].slice(0, 60);
  // 生词卡：只存 wordId 引用 + 释义，不拷贝英文内容（导出时实时取 words 表与拼写挖空算法）
  const r = addCard({
    en: entry.display, zh: firstLine || entry.display,
    ctx: entry.sentence ? `原句：${entry.sentence}` : "",
    kind: "word", source: "vocab", wordId: entry.id,
  });
  entry.saved = true;
  if (r.card) entry.cardId = r.card.id; // 双向引用
}
// §5 造句点评 → 表达库回流：根据点评结论生成 correction / sentence / collocation 卡
function toExpressionCardKind(v, verdict) {
  if (verdict === "needsWork" || verdict === "wrong") return "correction";
  if (v.isPhrase) return "collocation";
  if (verdict === "good" && v.example) return "sentence";
  return "word";
}
function pushToExpressionLibrary(v, fbEntry) {
  vocabEnsureNewFields(v);
  const isCorrection = fbEntry && (fbEntry.verdict === "needsWork" || fbEntry.verdict === "wrong");
  const kind = toExpressionCardKind(v, fbEntry ? fbEntry.verdict : "none");
  const card = {
    kind, source: "vocab", wordId: v.id, zh: v.glossZh || v.display,
  };
  if (isCorrection) {
    card.en = fbEntry.corrected || v.example;
    card.original = v.example;                 // ★ 我原来怎么写
    card.reason = fbEntry.reason;
    card.errorTag = (fbEntry.errorTypes || [])[0] || "表达不地道";
  } else {
    card.en = v.isPhrase ? v.display : (v.example || (fbEntry && fbEntry.corrected) || v.display);
    card.ctx = v.example || v.sentence || "";
  }
  const r = addCard(card);
  if (r.ok && r.card) { v.saved = true; v.cardId = r.card.id; }
  return r;
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
  const all = [...(state.vocab || [])].map(vocabEnsureNewFields).reverse();
  // 待造句只统计"该造句的产出词"——认知词/掠过词本来就不造句，不该出现在这个筛选里
  const todoExplain = all.filter(v => !(v.explain || "").trim()).length;
  const todoExample = all.filter(v => v.disposition === "production" && !(v.example || "").trim()).length;
  const todoSave = all.filter(v => !v.saved).length;
  const FILTERS = [["all", "全部", all.length], ["explain", "待解释", todoExplain], ["example", "待造句", todoExample], ["unsaved", "未入库", todoSave]];
  const vfMatch = v => vocabFilter === "explain" ? !(v.explain || "").trim()
    : vocabFilter === "example" ? (v.disposition === "production" && !(v.example || "").trim())
    : vocabFilter === "unsaved" ? !v.saved : true;
  const list = all.filter(vfMatch);
  // 今日任务队列（优先级最高的 6 个待加工词）
  const queue = buildDailyQueue();
  const od = overdueCount();
  main.innerHTML = `
    <div class="card">
      <div class="section-title">生词库（${all.length}）</div>
      <div class="btn-row" style="margin-top:2px">
        ${FILTERS.map(([k, label, n]) => `<button class="btn ${vocabFilter === k ? "primary" : "ghost"}" data-vf="${k}">${label} ${n}</button>`).join("")}
      </div>
      <p class="hint">阅读时划词收进来的生词/短语，在这里精加工：<b>AI 解释（带音标）→ 点 🔊 听发音 → 造句 → AI 点评 → 逐条或一键存学习库</b>。单词右侧的「存入学习库」把单词和解释一起入库，进入间隔复习并可导出 SuperMemo。</p>
    </div>
    ${queue.length ? `
    <div class="card">
      <div class="section-title">今日任务（${queue.length}）</div>
      ${od ? `<p class="hint" style="color:var(--amber)">⚠️ ${od} 个词卡在某一步超过 14 天，点下方筛选「待解释 / 待造句 / 未入库」清理。</p>` : ""}
      ${queue.map(v => {
        const dm = DISPOSITION_META[v.disposition];
        return `<div class="row" style="justify-content:space-between;padding:6px 0;border-bottom:1px dashed var(--line);cursor:pointer" data-vq="${v.id}" title="点击定位到这个生词">
          <span><span class="tag-fb" style="background:${dm.color}22;color:${dm.color}">${dm.label}</span> <b style="color:var(--accent)">${esc(v.display)}</b></span>
          <span class="hint" style="margin:0">${vocabStepLabel(v)}</span>
        </div>`;
      }).join("")}
    </div>` : ""}
    ${list.length ? list.map(v => vocabEntryHTML(v)).join("") : `
    <div class="card"><div class="empty">${all.length ? "这个状态下没有生词，换个筛选看看。" : "还没有生词。去阅读任务里划选单词或短语添加。"}</div></div>`}`;
  list.forEach(v => bindVocabEntry(main, v));
  main.querySelectorAll("[data-vf]").forEach(b =>
    b.addEventListener("click", () => { vocabFilter = b.dataset.vf; render(); }));
  // 今日任务点击 → 跳到对应生词条目（若被筛选隐藏，先切回「全部」）
  main.querySelectorAll("[data-vq]").forEach(el =>
    el.addEventListener("click", () => {
      const id = Number(el.dataset.vq);
      const target = document.getElementById("vocab-" + id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        target.style.outline = "2px solid var(--accent)";
        setTimeout(() => { target.style.outline = ""; }, 1600);
      } else {
        vocabFilter = "all"; render();
        setTimeout(() => {
          const t2 = document.getElementById("vocab-" + id);
          if (t2) { t2.scrollIntoView({ behavior: "smooth", block: "center" }); t2.style.outline = "2px solid var(--accent)"; setTimeout(() => { t2.style.outline = ""; }, 1600); }
        }, 60);
      }
    }));
}
function vocabEntryHTML(v) {
  vocabEnsureNewFields(v);
  const isPhrase = v.isPhrase;
  const dm = DISPOSITION_META[v.disposition];
  const canSentence = v.disposition === "production"; // 认知/掠过词跳过造句
  const fb = v.fb || [];
  const lastFb = fb[fb.length - 1];
  return `
    <div class="card vocab-entry" id="vocab-${v.id}">
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
      <div class="row" style="gap:6px;margin-top:6px">
        <span class="tag-fb" style="background:${dm.color}22;color:${dm.color}" title="${dm.desc}">${dm.label}</span>
        ${vocabStatus(v).map(([label, bg, fg]) => `<span class="tag-fb" style="background:${bg};color:${fg}">${label}</span>`).join("")}
      </div>
      <div class="btn-row" style="margin-top:10px">
        <button class="btn" data-aiexp="${v.id}">AI 解释（结合原句）</button>
      </div>
      ${v.glossZh ? `<div class="vocab-sent" style="margin-top:8px">${esc(v.pos)} ${esc(v.glossZh)}${v.aiExample ? `<br>例：${esc(v.aiExample)}${v.aiExampleZh ? "（" + esc(v.aiExampleZh) + "）" : ""}` : ""}${v.memoryTip ? `<br>助记：${esc(v.memoryTip)}` : ""}</div>` : ""}
      <textarea data-vzh="${v.id}" style="margin-top:10px;min-height:112px" placeholder="释义：点「AI 解释」自动填，也可以自己写一条">${esc(v.explain)}</textarea>
      ${canSentence ? `
      <div class="mini-label">请造句：</div>
      <textarea data-vex="${v.id}" style="min-height:70px" placeholder="用「${esc(v.display)}」造一句你自己的话，别抄原句…">${esc(v.example)}</textarea>
      <div class="btn-row">
        <button class="btn" data-vaifb="${v.id}">AI 点评造句</button>
      </div>` : `<p class="hint" style="margin-top:8px">${v.disposition === "skim" ? "掠过词：存个释义备查即可，无需造句。" : "认知词：阅读时认得出即可，跳过造句。"}</p>`}
      <div data-vtips="${v.id}"></div>
      ${lastFb ? `
      <div class="card" style="margin-top:10px;border:1px solid var(--line);background:#fbfcfb">
        <div class="row" style="justify-content:space-between">
          <span class="section-title" style="margin:0">点评（${lastFb.verdict === "good" ? "✓ 不错" : lastFb.verdict === "wrong" ? "✗ 用错了" : "△ 待改进"}${lastFb.score ? " · " + lastFb.score + "分" : ""}）</span>
          ${!v.saved ? `<button class="btn primary" data-vpush="${v.id}">存入表达库</button>` : ""}
        </div>
        ${lastFb.reason ? `<div class="vocab-sent">${esc(lastFb.reason)}</div>` : ""}
        ${lastFb.corrected ? `<div class="vocab-sent">→ ${esc(lastFb.corrected)}</div>` : ""}
      </div>` : ""}
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
  if (ex) ex.addEventListener("input", () => { v.example = ex.value; advanceStep(v, "sentenced"); recalcPriority(v); save(); });
  const af = q(`[data-vaifb="${v.id}"]`);
  if (af) af.addEventListener("click", async () => {
    if (!v.example.trim()) { alert("先造一句，再点评"); return; }
    af.disabled = true; af.textContent = "点评中…";
    try { await aiReviewVocab(v, af); render(); }
    catch (e) { alert("点评失败：" + e.message); af.disabled = false; af.textContent = "AI 点评造句"; }
  });
  const sv = q(`[data-vsave="${v.id}"]`);
  if (sv) sv.addEventListener("click", () => {
    if (v.saved) return;
    vocabToCard(v); save(); render();
  });
  // 点评回流表达库（确认后生成 correction/sentence/collocation 卡）
  const push = q(`[data-vpush="${v.id}"]`);
  if (push) push.addEventListener("click", () => {
    const lastFb = (v.fb || [])[(v.fb || []).length - 1];
    if (!lastFb) return;
    const r = pushToExpressionLibrary(v, lastFb);
    save(); render();
    if (r.ok) toast("已存入表达库 ✓");
    else toast(r.reason || "该表达已在库中");
  });
  const vt = q(`[data-vtips="${v.id}"]`);
  if (vt && v.fb && v.fb.length) {
    renderTipsSaver(vt, v.fb, {
      kind: "collocation", source: "vocab", ctxFallback: "生词「" + v.display + "」的造句点评",
      itemLabel: "存到学习库", saveAllLabel: "一键全部存到学习库",
    });
  }
}
