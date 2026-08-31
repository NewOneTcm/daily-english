/* ============ 拼写导出 · SuperMemo 模块 ============
   把生词本转化为 SuperMemo 可导入的拼写练习题（字母挖空），练习与复习调度交给 SuperMemo。
   参考：拼写导出_SuperMemo_完整逻辑文档.md（V1）。本文件独立，可单独维护。
   核心：易错点规则预测 + T1–T4 挖空 + Q&A 文本导出 + 导出状态去重。
*/

/* ---- §3 易错点预测 ---- */
const DICT_VOWELS = new Set(["a", "e", "i", "o", "u"]);
const DICT_SILENT_MAP = {
  debt: [2], doubt: [2], island: [1],
  know: [0], knife: [0], knee: [0], knot: [0], knowledge: [0],
  write: [0], wrong: [0], wrist: [0], answer: [3],
  hour: [0], honest: [0], heir: [0], vehicle: [3],
  climb: [4], comb: [3], thumb: [4], crumb: [4], bomb: [3],
  listen: [3], castle: [3], whistle: [3], often: [3], soften: [3],
  wednesday: [2, 4], february: [3], chocolate: [6],
  psychology: [0], pneumonia: [0], receipt: [4], ptarmigan: [0],
  salmon: [4], almond: [2], calm: [3], folk: [3],
  autumn: [5], column: [4], condemn: [5], solemn: [4],
  gnat: [0], gnaw: [0], design: [3], foreign: [3],
};
const DICT_SUFFIX_STRONG = ["able", "ible", "ance", "ence", "ary", "ery", "tion", "sion", "cial", "tial", "cious", "tious", "cede", "ceed", "sede", "ise", "ize"];
const DICT_SUFFIX_WEAK = ["ant", "ent", "ism", "asm", "ory", "ify", "efy"];
const DICT_VOWEL_PAIRS = ["ei", "ie", "ea", "ai", "ou", "ough", "au", "oo", "ee"];
const DICT_EXPLICIT = {
  definitely: [[5, "vowel"]], separate: [[3, "vowel"]], separately: [[3, "vowel"]],
  desperate: [[3, "vowel"]], calendar: [[4, "vowel"]], referring: [[4, "double"]],
  occurred: [[5, "double"]], until: [[4, "double"]], forty: [[2, "vowel"]],
  truely: [[3, "vowel"]], publically: [[4, "vowel"]], alot: [[1, "double"]],
};
const DICT_ERROR_HINT = {
  silent: "含不发音字母，注意别漏写",
  double: "含双写字母，注意数清",
  vowelPair: "元音组合易混（ei/ie/ea），注意顺序",
  suffix: "后缀易混，注意 -able/-ible 类区分",
  softC: "c/g 软音，注意不要写成 s/j",
  vowel: "注意元音",
  consonant: "注意辅音",
};
const DICT_CLOZE_CFG = { T1_RATIO: 0.30, T3_RATIO: 0.50, T2_MIN_BLANKS: 2, FOCUS_WEIGHT: 0.6, MIN_ERROR_WEIGHT: 0.5 };

function dictPredictSpots(word) {
  const lower = word.toLowerCase();
  const spots = {};
  const push = (index, kind, weight) => {
    if (index < 0 || index >= lower.length) return;
    if (spots[index]) spots[index].weight = Math.max(spots[index].weight, weight);
    else spots[index] = { index, kind, weight };
  };
  (DICT_SILENT_MAP[lower] || []).forEach(i => push(i, "silent", 1.0));
  for (let i = 1; i < lower.length; i++) {
    if (/[a-z]/.test(lower[i]) && lower[i] === lower[i - 1]) push(i, "double", 0.8);
  }
  for (const pair of DICT_VOWEL_PAIRS) {
    let idx = lower.indexOf(pair);
    while (idx !== -1) {
      const w = (pair === "ei" || pair === "ie") ? 0.9 : 0.5;
      for (let k = 0; k < pair.length; k++) push(idx + k, "vowelPair", w);
      idx = lower.indexOf(pair, idx + 1);
    }
  }
  for (const suf of DICT_SUFFIX_STRONG) {
    if (lower.endsWith(suf)) { const s = lower.length - suf.length; for (let k = 0; k < suf.length; k++) push(s + k, "suffix", 0.7); }
  }
  for (const suf of DICT_SUFFIX_WEAK) {
    if (lower.endsWith(suf)) { const s = lower.length - suf.length; for (let k = 0; k < suf.length; k++) push(s + k, "suffix", 0.5); }
  }
  (DICT_EXPLICIT[lower] || []).forEach(([i, kind]) => push(i, kind, 0.95));
  for (let i = 0; i < lower.length; i++) {
    if (lower[i] === "c" && i + 1 < lower.length && "eiy".includes(lower[i + 1])) push(i, "softC", 0.6);
    if (lower[i] === "g" && i + 1 < lower.length && "eiy".includes(lower[i + 1])) push(i, "softC", 0.4);
  }
  for (let i = 0; i < lower.length; i++) {
    if (DICT_VOWELS.has(lower[i]) && !spots[i]) push(i, "vowel", 0.3);
  }
  return Object.values(spots).sort((a, b) => b.weight - a.weight);
}

/* ---- §4 挖空算法 ---- */
function dictPickWeighted(candidates, k, focus) {
  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
  const hot = candidates.filter(i => focus.includes(i));
  const cold = candidates.filter(i => !focus.includes(i));
  const picked = new Set();
  const quota = Math.min(hot.length, Math.ceil(k * DICT_CLOZE_CFG.FOCUS_WEIGHT));
  shuffle(hot).slice(0, quota).forEach(i => picked.add(i));
  shuffle(cold).forEach(i => { if (picked.size < k) picked.add(i); });
  return picked;
}
function dictMakeCloze(answer, type, predicted, ratioBoost = 0) {
  const chars = answer.split("");
  const letterIdx = chars.map((c, i) => (/[a-zA-Z]/.test(c) ? i : -1)).filter(i => i >= 0);
  if (!letterIdx.length) throw new Error("no letters in " + answer);
  const first = letterIdx[0], last = letterIdx[letterIdx.length - 1];
  const middle = letterIdx.filter(i => i !== first && i !== last);
  const focus = predicted.filter(p => p.weight >= DICT_CLOZE_CFG.MIN_ERROR_WEIGHT).map(p => p.index);
  let blanks;
  if (type === "T1") {
    const k = Math.max(1, Math.round(middle.length * (DICT_CLOZE_CFG.T1_RATIO + ratioBoost)));
    blanks = dictPickWeighted(middle, k, focus);
  } else if (type === "T2") {
    blanks = new Set(letterIdx.filter(i => DICT_VOWELS.has(chars[i].toLowerCase()) && i !== first && i !== last));
    if (blanks.size < DICT_CLOZE_CFG.T2_MIN_BLANKS) {
      const extra = letterIdx.filter(i => !blanks.has(i) && i !== first && i !== last);
      dictPickWeighted(extra, DICT_CLOZE_CFG.T2_MIN_BLANKS - blanks.size, focus).forEach(i => blanks.add(i));
    }
  } else if (type === "T3") {
    const k = Math.max(1, Math.round(middle.length * (DICT_CLOZE_CFG.T3_RATIO + ratioBoost)));
    const picked = dictPickWeighted(middle, k, focus);
    focus.filter(i => middle.includes(i)).forEach(i => picked.add(i));
    blanks = picked;
  } else { // T4
    blanks = new Set(letterIdx);
  }
  const blankList = [...blanks].sort((a, b) => a - b);
  return { display: chars.map((c, i) => (blanks.has(i) ? "_" : c)).join(""), answer, blanks: blankList, type, focusSpots: blankList.filter(i => focus.includes(i)) };
}
const DICT_FUNCTION_WORDS = new Set(["to","of","in","on","at","for","with","by","from","a","an","the","and","or","but","up","out","off","into","about","over"]);
function dictMakePhraseCloze(phrase, type, predicted, ratioBoost = 0) {
  const words = phrase.split(/\s+/);
  const contentIdx = words.map((w, i) => ({ w, i })).filter(x => !DICT_FUNCTION_WORDS.has(x.w.toLowerCase().replace(/[^a-z]/g, ""))).map(x => x.i);
  const target = contentIdx.length ? contentIdx.reduce((a, b) => (words[b].length > words[a].length ? b : a), contentIdx[0])
    : words.reduce((a, b, i) => (words[i].length > words[a].length ? i : a), 0);
  const offset = words.slice(0, target).join(" ").length + 1;
  const inner = dictMakeCloze(words[target], type, predicted.map(p => Object.assign({}, p, { index: p.index - offset })).filter(p => p.index >= 0), ratioBoost);
  const dw = [...words]; dw[target] = inner.display;
  return { display: dw.join(" "), answer: phrase, blanks: inner.blanks.map(i => i + offset), type, focusSpots: inner.focusSpots.map(i => i + offset) };
}
function dictBuildCloze(word, type) {
  const predicted = dictPredictSpots(word);
  const isPhrase = /\s/.test(word.trim());
  return isPhrase ? dictMakePhraseCloze(word, type, predicted) : dictMakeCloze(word, type, predicted);
}
function dictAnswerHint(predicted) {
  const kinds = [...new Set(predicted.filter(p => p.weight >= 0.7).map(p => p.kind))];
  return kinds.slice(0, 2).map(k => DICT_ERROR_HINT[k]).join("；");
}
// 释义脱敏：释义里若夹带英文原词则替换为 [?]，防泄露答案
function dictSanitizeGloss(gloss, lemma) {
  if (!gloss || !lemma) return gloss;
  const esc = lemma.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return gloss.replace(new RegExp(esc, "gi"), "[?]");
}

/* ---- 导出状态（挂在生词条目上） ---- */
function dictEnsureState(v) {
  if (!Array.isArray(v.exportedTypes)) v.exportedTypes = [];
  if (typeof v.exportRound !== "number") v.exportRound = 0;
  if (typeof v.dictationEnabled !== "number") v.dictationEnabled = 1;
  return v;
}
function dictDaysSince(iso) { return iso ? (Date.now() - new Date(iso).getTime()) / 86400000 : 999; }
// 可导出的生词：开启拼写、有内容、长度足够（≤2 字母跳过）
function dictExportable() {
  return (state.vocab || []).filter(v => {
    dictEnsureState(v);
    const w = v.display.trim();
    return v.dictationEnabled === 1 && w.replace(/[^a-zA-Z]/g, "").length > 2;
  });
}

/* ---- 选词（§6.1） ---- */
function dictPriority(v) {
  return (v.unknownCount || 0) * 10 + (v.exportRound === 0 ? 50 : 0) - v.exportRound * 8 - (v.exportedAt && dictDaysSince(v.exportedAt) < 7 ? 30 : 0);
}
function dictPickWords(clozeType, incremental, count) {
  const all = dictExportable();
  if (incremental) return all.filter(v => !v.exportedTypes.includes(clozeType));
  return all.map(v => ({ v, score: dictPriority(v) })).sort((a, b) => b.score - a.score).slice(0, count).map(x => x.v);
}
// §6.4 查重：已导出过该类型 或 7天内导出过 的词列为重复项
function dictCheckDuplicates(words, type) {
  const fresh = [], dup = [];
  words.forEach(v => {
    const already = v.exportedTypes.includes(type);
    const recent = v.exportedAt && dictDaysSince(v.exportedAt) < 7;
    (already || recent) ? dup.push(v) : fresh.push(v);
  });
  return { fresh, dup };
}

/* ---- §5.1 Q&A 文本生成 ---- */
function dictGenQA(words, type) {
  const lines = [];
  words.forEach((v, idx) => {
    const word = v.display.trim();
    const cloze = dictBuildCloze(word, type);
    const pos = (v.explain || "").match(/^\s*([a-z]+\.)/i);
    const glossRaw = (v.explain || "").split("\n").filter(Boolean)[1] || (v.explain || "").split("\n")[0] || "";
    const gloss = dictSanitizeGloss(glossRaw.replace(/^[a-z]+\.\s*/i, ""), word);
    const rounds = v.exportRound > 0 ? `练${v.exportRound}次` : "新词";
    const tag = `[#w${String(v.id).padStart(5, "0")}·${type}·${rounds}]`;
    const hint = dictAnswerHint(dictPredictSpots(word));
    const qHead = (pos ? pos[1] + " " : "") + (gloss || "（无释义）");
    const q = `${qHead}<br><font face="Courier New" size=5>${cloze.display}</font><br><font size=1 color=gray>${tag}</font>`;
    let a = `<b>${esc(word)}</b>${v.phonetic ? " " + esc(v.phonetic) : ""}`;
    if (hint) a += `<br>易错：${hint}`;
    if (v.sentence) a += `<br>原句：${esc(v.sentence.slice(0, 120))}`;
    lines.push("Q: " + q, "A: " + a, "");
  });
  return lines.join("\n");
}
// §6.3 导出后写回状态
function dictAfterExport(words, type) {
  const now = new Date().toISOString();
  words.forEach(v => {
    dictEnsureState(v);
    if (!v.exportedTypes.includes(type)) { v.exportedTypes.push(type); v.exportRound += 1; }
    v.exportedAt = now;
  });
  state.exportBatches = state.exportBatches || [];
  state.exportBatches.unshift({ id: Date.now(), clozeType: type, wordCount: words.length, exportedAt: now });
  save();
}

/* ---- 导出页 UI ---- */
let dictCfg = { type: "T2", incremental: true, count: 50 };
function renderDictation(main) {
  state.exportBatches = state.exportBatches || [];
  const total = dictExportable().length;
  const words = dictPickWords(dictCfg.type, dictCfg.incremental, dictCfg.count);
  const preview = words.slice(0, 3).map(v => {
    const word = v.display.trim();
    const c = dictBuildCloze(word, dictCfg.type);
    const gloss = dictSanitizeGloss((v.explain || "").split("\n")[0] || "", word);
    return `<div class="q-item"><div class="q-title">${esc(gloss || word)}</div><div style="font-family:'Courier New',monospace;font-size:20px;letter-spacing:2px;margin-top:6px">${esc(c.display)}</div><div class="hint" style="margin-top:4px">→ ${esc(word)}${v.phonetic ? " " + esc(v.phonetic) : ""}</div></div>`;
  }).join("");
  main.innerHTML = `
    <div class="card">
      <div class="section-title">听写 · 拼写导出到 SuperMemo</div>
      <p class="hint">把生词本转成<b>字母挖空</b>的拼写题，导出成 SuperMemo 可导入的文件。练习和复习交给 SuperMemo 的间隔算法，你只管每天翻卡片默写。</p>
      <div class="stat-row" style="margin-top:12px">
        <div class="stat"><b>${total}</b><span>可导出生词</span></div>
        <div class="stat amber"><b>${(state.exportBatches || []).length}</b><span>已导出批次</span></div>
        <div class="stat"><b>${words.length}</b><span>本次将导出</span></div>
      </div>
    </div>
    <div class="card">
      <div class="section-title">导出设置</div>
      <div class="mini-label">挖空难度</div>
      <div class="btn-row" style="flex-wrap:wrap">
        ${["T1", "T2", "T3", "T4"].map(t => `<button class="btn ${dictCfg.type === t ? "primary" : "ghost"}" data-ctype="${t}">${t} ${{T1:"首字母提示",T2:"元音挖空",T3:"骨架挖空",T4:"全拼默写"}[t]}</button>`).join("")}
      </div>
      <div class="mini-label">导出范围</div>
      <div class="btn-row">
        <button class="btn ${dictCfg.incremental ? "primary" : "ghost"}" data-scope="inc">增量（未导出过该难度的）</button>
        <button class="btn ${!dictCfg.incremental ? "primary" : "ghost"}" data-scope="all">全量（按优先级取前 N）</button>
      </div>
      ${!dictCfg.incremental ? `<div class="mini-label">数量：<b id="dictCount">${dictCfg.count}</b> 词</div><input type="range" id="dictRange" min="10" max="200" step="10" value="${dictCfg.count}" style="width:100%">` : ""}
      <div class="btn-row" style="margin-top:14px">
        <button class="btn primary" id="dictGo" ${words.length ? "" : "disabled"}>生成并下载（${words.length} 词）</button>
      </div>
      ${!words.length ? `<p class="hint" style="color:var(--amber)">没有可导出的词了。去阅读/精读/场景阅读积累新生词，或换个难度类型再导。</p>` : ""}
    </div>
    ${words.length ? `<div class="card"><div class="section-title">预览（前 ${Math.min(3, words.length)} 题）</div>${preview}</div>` : ""}
    <div class="card">
      <div class="section-title">导出历史</div>
      ${(state.exportBatches || []).length ? `<ul class="list">${(state.exportBatches || []).slice(0, 10).map(b => `<li><span class="en">${b.clozeType} · ${b.wordCount} 词</span><span class="due">${(b.exportedAt || "").slice(0, 10)}</span></li>`).join("")}</ul>` : `<div class="empty">还没有导出过。</div>`}
      <p class="hint" style="margin-top:8px">导入步骤：① 保存下载的 .txt ② SuperMemo 里 File : Tools : Import : Q&A text ③ <b>务必勾选 "Decode UTF-8"</b>（否则中文乱码）④ 建议先建「拼写练习」分支再导入。</p>
    </div>`;
  main.querySelectorAll("[data-ctype]").forEach(b => b.addEventListener("click", () => { dictCfg.type = b.dataset.ctype; render(); }));
  main.querySelectorAll("[data-scope]").forEach(b => b.addEventListener("click", () => { dictCfg.incremental = b.dataset.scope === "inc"; render(); }));
  const range = $("#dictRange");
  if (range) range.addEventListener("input", () => { dictCfg.count = Number(range.value); $("#dictCount").textContent = dictCfg.count; });
  const go = $("#dictGo");
  if (go) go.addEventListener("click", () => {
    const ws = dictPickWords(dictCfg.type, dictCfg.incremental, dictCfg.count);
    const { fresh, dup } = dictCheckDuplicates(ws, dictCfg.type);
    let toExport = fresh;
    if (dup.length && !confirm(`有 ${dup.length} 个词最近导出过或已导出过该难度（如：${dup.slice(0, 3).map(v => v.display).join("、")}${dup.length > 3 ? "…" : ""}）。\n\n点「确定」只导出 ${fresh.length} 个新词（推荐，避免 SuperMemo 里出现重复卡片）；点「取消」返回重选。`)) return;
    if (!toExport.length) { alert("这些都是重复词，换个难度或去积累新词吧。"); return; }
    const content = dictGenQA(toExport, dictCfg.type);
    download(content + "\n", `vocab_dictation_${dictCfg.type}_${todayKey().replace(/-/g, "")}.txt`, "text/plain;charset=utf-8");
    dictAfterExport(toExport, dictCfg.type);
    alert(`已导出 ${toExport.length} 个词。\n\n导入提醒：SuperMemo 导入对话框里记得勾选 "Decode UTF-8"，否则中文会乱码。`);
    render();
  });
}
