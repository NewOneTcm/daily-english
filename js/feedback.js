/* 反馈引擎：本地规则点评 + AI 点评 + 打卡反馈区 */
const STOP = new Set(("the,a,an,and,or,but,so,because,if,i,you,he,she,it,we,they,is,are,was,were,am,be,been,being," +
  "do,does,did,have,has,had,will,would,can,could,should,shall,to,of,in,on,at,for,with,about,as,by,from,up,out,off," +
  "that,this,these,those,there,here,my,your,his,her,its,our,their,me,him,us,them,not,no,very,really,just,also,too," +
  "when,what,where,who,whom,how,which,than,then,some,any,all,each,every,both,few,more,most,other,own,same,only").split(","));

// 中国学习者高频错误模式：命中原句 → 正确说法
const FEEDBACK_RULES = [
  { re: /\bi am agree\b/i, zh: "「I am agree」→ agree 本身就是动词，前面不加 am", en: "I agree." },
  { re: /\bmore (better|easier|worse|faster|slower|bigger|smaller|cheaper|happier|simpler)\b/i, zh: "比较级前不用 more", en: "more better → better（-er 结尾的词本身已是比较级）" },
  { re: /\b(he|she|it) don't\b/i, zh: "第三人称单数：he/she/it 后面用 doesn't", en: "he doesn't / she doesn't / it doesn't" },
  { re: /\bpeople (is|was|has)\b/i, zh: "people 是复数", en: "people are / people were / people have" },
  { re: /\b(informations|advices|feedbacks|homeworks|equipments|knowledges|furnitures|stuffs)\b/i, zh: "不可数名词没有复数形式", en: "information / advice / feedback / homework / equipment / knowledge / furniture / stuff" },
  { re: /\bi very like\b/i, zh: "「I very like」是中式语序", en: "I really like … / I like it very much" },
  { re: /\bin the internet\b/i, zh: "上网用 on，不用 in", en: "on the internet" },
  { re: /\baccording to me\b/i, zh: "「according to me」不地道", en: "in my opinion / from my perspective / I think" },
  { re: /\bopen the (light|tv|computer|phone)\b/i, zh: "开电器用 turn on", en: "turn on the light / turn on the TV" },
  { re: /\bhave (went|did|saw|ate|came|took|wrote|spoke|bought|made)\b/i, zh: "have 后面要接过去分词", en: "have gone / have done / have seen / have eaten" },
  { re: /\byesterday\b[^.!?]{0,50}\bhave\b|\bhave\b[^.!?]{0,50}\byesterday\b/i, zh: "有 yesterday 时用一般过去时，不用 have", en: "I did it yesterday.（不是 I have done it yesterday）" },
  { re: /\balthough\b[^.!?]{0,120}\bbut\b/i, zh: "although 和 but 一个句子里只用一个", en: "Although it rained, I went out. / It rained, but I went out." },
  { re: /\bbecause\b[^.!?]{0,120}\bso\b/i, zh: "because 和 so 一个句子里只用一个", en: "Because I was tired, I slept early. / I was tired, so I slept early." },
  { re: /\bplay (the )?phone\b/i, zh: "「玩手机」不是 play phone", en: "use my phone / be on my phone" },
  { re: /\bhow to say\b/i, zh: "卡壳时说 how to say 不太地道", en: "how should I put it / what's the word" },
];

const LINK_WORDS = /\b(however|because|although|though|but|so|then|also|for example|for instance|in addition|first|second|finally|instead|therefore|besides|actually)\b/i;

// 从原文中提取与某条反馈相关的原句，作为纠错卡的 original（我原来怎么写的）
function extractOriginalSentence(draft, tip) {
  const ctx = (tip && tip.ctx || "").replace(/[「」]/g, "").replace(/…/g, "").trim();
  if (ctx) return ctx;
  const norm = s => String(s || "").toLowerCase().replace(/[^a-z]/g, "");
  const probe = norm(tip && tip.en || "");
  const sents = String(draft || "").split(/[.!?…\n]+/).map(s => s.trim()).filter(Boolean);
  if (probe) {
    const hit = sents.find(s => norm(s) && (probe.includes(norm(s)) || norm(s).includes(probe)));
    if (hit) return hit;
  }
  return sents[0] || String(draft || "").slice(0, 140);
}

function analyzeWriting(text, level) {
  const tips = [];
  const lv = LEVELS[level] || LEVELS.B1;
  const words = text.match(/[A-Za-z']+/g) || [];
  const wc = words.length;
  const sentences = text.split(/[.!?…]+/).map(s => s.trim()).filter(Boolean);

  for (const r of FEEDBACK_RULES) {
    const m = text.match(r.re);
    if (m) tips.push({ zh: r.zh, en: r.en, ctx: "「" + m[0].slice(0, 120) + "」" });
  }
  const badCap = sentences.find(s => /^[a-z]/.test(s));
  if (badCap) tips.push({ zh: "句首字母要大写", en: badCap[0].toUpperCase() + badCap.slice(1, 60) + (badCap.length > 60 ? "…" : ""), ctx: "「" + badCap.slice(0, 60) + "」" });
  const mi = text.match(/(^|[\s("'])i([\s,.!?;:'")]|$)/);
  if (mi) tips.push({ zh: "「我」永远大写为 I", en: "I", ctx: "" });
  if (wc > 0 && wc < lv.words) {
    tips.push({ zh: `长度：写了 ${wc} 词，${lv.label.split(" ")[0]} 目标是 ${lv.words} 词。试着多补一个原因或一个细节`, en: "", ctx: "" });
  }
  const freq = {};
  words.map(w => w.toLowerCase()).forEach(w => { if (!STOP.has(w) && w.length > 3) freq[w] = (freq[w] || 0) + 1; });
  const top = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
  if (top && top[1] >= 4) tips.push({ zh: `「${top[0]}」出现了 ${top[1]} 次，试试换个说法或用代词`, en: "", ctx: "" });
  const longS = sentences.find(s => countWords(s) > 28);
  if (longS) tips.push({ zh: "有一句超过 28 个词，拆成两句更自然", en: "", ctx: "「" + longS.slice(0, 100) + "…」" });
  if (sentences.length >= 3 && !LINK_WORDS.test(text)) {
    tips.push({ zh: "通篇没有连接词，加一两个 because / but / however 会更连贯", en: "because / but / however / for example", ctx: "" });
  }
  if (wc >= lv.words && LINK_WORDS.test(text) && !tips.length) {
    tips.push({ zh: `${wc} 词达标，连接词也用上了，今天状态不错`, en: "", ctx: "", praise: true });
  }
  return tips;
}

/* ============ 表达库入库（kind × source 双维度 + 去重 + 信息补全） ============
   新签名：addCard({ en, zh, ctx, original, reason, errorTag, kind, source, wordId, scene, register })
   兼容旧签名：addCard(en, zh, ctx, type) —— 旧 type 会按 CARD_MIGRATE 映射到 kind/source。
   返回：{ ok, card?, reason? } —— ok=false 表示已存在（可能已补全信息），不是失败。 */
const CARD_KINDS = {
  phrase: { label: "地道表达", color: "#10b981", desc: "值得记住的说法" },
  correction: { label: "纠错", color: "#ef4444", desc: "我写/说错了的地方" },
  word: { label: "生词", color: "#3b82f6", desc: "复用拼写挖空算法" },
  collocation: { label: "搭配", color: "#8b5cf6", desc: "固定搭配与词组" },
  sentence: { label: "整句", color: "#f59e0b", desc: "含目标表达的完整句" },
};
const CARD_SOURCES = {
  diary: { label: "日记" }, writing: { label: "写作" }, reading: { label: "阅读" },
  speaking: { label: "口语打卡" }, vocab: { label: "生词库" }, manual: { label: "手动" },
};
// 旧 type → 新 kind/source（数据迁移用）
const CARD_MIGRATE = {
  expr: { kind: "phrase", source: "manual" },
  fb: { kind: "correction", source: "speaking" },
  vocab: { kind: "word", source: "vocab" },
  vtip: { kind: "collocation", source: "vocab" },
};
const REGISTER_LABEL = { formal: "正式场合", informal: "日常口语", academic: "学术写作", spoken: "口语", slang: "俚语" };

// 去重组键：小写 + 撇号删除 + 其余标点转空格 + 压缩空格 + 去首冠词
// 撇号删除（it's → its），其余标点转空格，保证 "It's a steal." / "its a steal" 同一条
function makeDedupeKey(en, kind) {
  const norm = String(en || "").toLowerCase()
    .replace(/['’]/g, "")          // 撇号直接删掉（it's → its），不是转空格
    .replace(/[^\w\s]/g, " ")       // 其余标点转空格
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^(a|an|the|to)\s+/, "");
  return `${kind}:${norm}`;
}
function addCard(a, b, c, d) {
  // 兼容旧签名 addCard(en, zh, ctx, type)
  const input = (a && typeof a === "object")
    ? Object.assign({}, a)
    : { en: a, zh: b, ctx: c, type: d };

  let kind = input.kind, source = input.source;
  if (!kind && input.type) { // 旧 type 迁移
    const map = CARD_MIGRATE[input.type];
    if (map) { kind = map.kind; source = map.source; }
  }
  kind = CARD_KINDS[kind] ? kind : "phrase";
  source = CARD_SOURCES[source] ? source : "manual";

  const en = String(input.en || "").trim();
  if (!en) return { ok: false, reason: "内容为空" };
  const key = makeDedupeKey(en, kind);

  const exist = (state.cards || []).find(c2 => c2.dedupeKey === key);
  if (exist) {
    // 已存在：做「信息补全」而非简单拒绝
    let merged = false;
    if (!exist.original && input.original) { exist.original = input.original; merged = true; }
    if (!exist.reason && input.reason) { exist.reason = input.reason; merged = true; }
    if (!exist.ctx && input.ctx) { exist.ctx = input.ctx; merged = true; }
    if (!exist.wordId && input.wordId) { exist.wordId = input.wordId; merged = true; }
    if (merged) save();
    return { ok: false, card: exist, reason: merged ? "已存在，已补全信息" : "该表达已在库中" };
  }

  const card = {
    id: state.nextCardId++,
    en, zh: String(input.zh || "").trim(),
    ctx: input.ctx || "", original: input.original || "", reason: input.reason || "",
    errorTag: input.errorTag || "", kind, source,
    wordId: input.wordId || null, scene: input.scene || "", register: input.register || "",
    starred: false, mastered: false, exportCount: 0, exportedAt: null,
    smLapses: 0, smReps: 0, smSyncedAt: null,
    dedupeKey: key, added: todayKey(),
  };
  state.cards.push(card);
  return { ok: true, card };
}
// 旧数据迁移：type → kind + source，补 dedupeKey
function migrateCards() {
  (state.cards || []).forEach(c => {
    if (!c.kind || !c.source) {
      const map = CARD_MIGRATE[c.type] || { kind: "phrase", source: "manual" };
      c.kind = c.kind || map.kind;
      c.source = c.source || map.source;
    }
    if (!c.dedupeKey) c.dedupeKey = makeDedupeKey(c.en, c.kind);
    if (typeof c.exportCount !== "number") c.exportCount = 0;
    if (typeof c.starred !== "boolean") c.starred = false;
    if (typeof c.mastered !== "boolean") c.mastered = false;
    if (typeof c.smLapses !== "number") c.smLapses = 0;
  });
}
function cardExists(en) {
  const k = String(en || "").trim().toLowerCase();
  return (state.cards || []).some(c => String(c.en || "").trim().toLowerCase() === k);
}

/* ============ AI 深度点评（可选，兼容 OpenAI 格式接口） ============ */
// 请求 + 解析，解析失败自动重试（模型偶发返回空内容/markdown 包裹时，不用再手动点第二次）
async function aiReviewFetch(draft, attempts = 2) {
  const ai = state.ai;
  let lastErr = null;
  for (let i = 0; i < attempts; i++) {
    try {
      const headers = { "Content-Type": "application/json" };
      if (ai.key) headers["Authorization"] = "Bearer " + ai.key;
      const resp = await fetch(ai.base.replace(/\/+$/, "") + "/chat/completions", {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: ai.model,
          messages: [
            { role: "system", content: "你是英语写作教练。用户每天用英语写一小段话。给出 2-4 条最关键的反馈（语法、用词、地道度），每条一行，格式严格为：中文问题简述 || 正确或更地道的英文表达。不要输出任何其他内容，不要用 markdown 代码块包裹。" },
            { role: "user", content: "用户级别：" + state.level + "\n\n用户的英语文本：\n" + draft },
          ],
        }),
      });
      if (!resp.ok) throw new Error("HTTP " + resp.status + " " + (await resp.text()).slice(0, 120));
      const data = await resp.json();
      const msg = (data.choices && data.choices[0] && data.choices[0].message) || {};
      const text = String(msg.content || "").replace(/```[a-z]*\n?/gi, "").trim();
      const tips = text.split(/\n+/).map(l => l.replace(/^[-*\d.\s、]+/, "")).filter(l => l.includes("||"))
        .map(l => { const p = l.split("||").map(s => s.trim()); return { zh: p[0], en: p[1] || "", ctx: "" }; });
      if (!tips.length) throw new Error("AI 返回的格式无法解析");
      return tips;
    } catch (e) {
      lastErr = e;
      if (/^HTTP \d/.test(e.message)) throw e; // HTTP 错误是配置/鉴权问题，重试无意义
    }
  }
  throw lastErr;
}
async function runAiReview(day, btn) {
  const ai = state.ai || {};
  if (!ai.base || !ai.model || (!ai.key && !/^(\/|https?:\/\/(127\.0\.0\.1|localhost))/i.test(ai.base))) {
    alert("先在「记录」页配置 AI 接口：地址和模型必填，本机地址可不填 Key");
    return;
  }
  const localBase = /^(\/|https?:\/\/(127\.0\.0\.1|localhost))/i.test(ai.base);
  if (location.protocol === "file:" && localBase) {
    alert("AI 点评需要在本机中转地址下使用：请先运行 proxy.py 或 open.bat 启动本机中转，再打开 http://127.0.0.1:8787/");
    return;
  }
  btn.disabled = true; btn.textContent = "点评中…";
  try {
    const tips = await aiReviewFetch(day.draft, 2);
    day.feedback = (day.feedback || []).concat(tips);
    save(); render();
  } catch (e) {
    // HTTP 错误说明中转和鉴权都通了，是模型侧拒绝了参数；网络级错误才是中转没起来
    const isHttpError = /^HTTP \d/.test(e.message);
    const hint = isHttpError
      ? "接口已连通，以上是模型返回的错误，按其提示调整配置即可。"
      : localBase
      ? "本机中转（127.0.0.1:8787）没响应。如果刚启动稍等几秒刷新重试，仍不行就到项目目录运行 python proxy.py 手动拉起。"
      : "网络不通、地址写错或跨域被拦截。";
    alert("AI 点评失败：" + e.message + "\n\n" + hint);
    btn.disabled = false; btn.textContent = "AI 深度点评";
  }
}

function feedbackSection(day) {
  const tips = day.feedback || [];
  // 有反馈，或写过东西（哪怕本地点评没吐出条目，也允许直接上 AI 点评）
  if (!tips.length && !(day.draft && countWords(day.draft) > 0)) return "";
  return `
    <div class="card">
      <div class="row" style="justify-content:space-between">
        <div class="section-title" style="margin:0">本次反馈</div>
        <div class="row">
          <button class="btn ghost" id="aiBtn">AI 深度点评</button>
        </div>
      </div>
      <p class="hint" style="margin-top:2px">有价值的反馈存成复习点，明天起进入复习队列（也可随表达库一起导给 SuperMemo）。</p>
      <div id="fbSaver"></div>
    </div>`;
}
function bindFeedback(root, day) {
  renderTipsSaver($("#fbSaver", root), day.feedback || [], {
    // 打卡/加练的反馈是"我写错了的地方"→ 纠错卡，必须带 original 才有原文改造题
    kind: "correction", source: "speaking", draft: day.draft,
    itemLabel: "存为复习点", saveAllLabel: "全部存到表达库",
  });
  const aiBtn = $("#aiBtn", root);
  if (aiBtn) aiBtn.addEventListener("click", () => runAiReview(day, aiBtn));
}

