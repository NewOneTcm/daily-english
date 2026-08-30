/* 今天页：任务卡 + 听说读写四个任务区 + 完成打卡 */
/* ---- 今天 ---- */
function renderToday(main) {
  const key = todayKey();
  const day = ensureDay(key);
  save();
  const lv = LEVELS[state.level];
  const task = taskFor(state.level, key, day.swap || 0);

  let upgradeBanner = "";
  const nl = nextLevelOf(state.level);
  if (nl && doneAtLevel(state.level) >= 14) {
    upgradeBanner = `
      <div class="banner">
        <span>你已经在 ${state.level} 用满 ${doneAtLevel(state.level)} 次了，可以试试 ${nl}。</span>
        <button class="btn" id="upLevel">升到 ${LEVELS[nl].label}</button>
      </div>`;
  }

  if (day.done) {
    main.innerHTML = upgradeBanner + `
      <div class="card done-hero">
        <div class="big">✅</div>
        <h2>今天已经用过了</h2>
        <p>连续 ${streak()} 天${day.secs ? " · 用时 " + fmtMins(day.secs) : ""} · 明天开机还会见到我</p>
        <div class="btn-row" style="justify-content:center">
          <button class="btn" id="goExtra">意犹未尽？去加练</button>
        </div>
      </div>
      <div class="card">
        <div class="section-title">今天的任务</div>
        <div class="hist-text">${esc(day.draft || "（口头任务，无文字记录）")}</div>
      </div>
      ${feedbackSection(day)}
      <div class="card">
        <div class="section-title">今天学到了什么？</div>
        <p class="hint">新学的单词 / 短语 / 句子记个数，「统计」页会把它画成你的成就曲线。</p>
        ${learnReportForm(day)}
      </div>
      <div class="card">
        <div class="section-title">顺手留一条表达？</div>
        <p class="hint">今天卡壳的、新学的、想以后能脱口而出的，丢进表达库，之后复习或导给 SuperMemo。</p>
        ${quickAddForm()}
      </div>`;
    bindQuickAdd(main);
    bindFeedback(main, day);
    bindLearnReport(main, day);
    $("#goExtra").addEventListener("click", () => { tab = "extra"; render(); });
    const up = $("#upLevel"); if (up) up.addEventListener("click", () => { state.level = nl; save(); render(); });
    return;
  }

  const metaText =
    task.t === "说" ? `建议时长 ≥ ${lv.secs} 秒 · 说完打卡` :
    task.t === "写" ? `目标 ≥ ${lv.words} 个词 · 写完打卡` :
    task.t === "听" ? "影子跟读：逐句听 + 跟读，可单句循环调速" :
    "读完后用英语回应（写或说都算）";
  main.innerHTML = upgradeBanner + `
    <div class="card">
      <div class="row" style="justify-content:space-between">
        <span class="task-type">${SKILL_BADGE[task.t] || task.t}</span>
        <button class="btn ghost" id="swapBtn" title="换一张任务卡">换一张</button>
      </div>
      <div class="task-cn">${esc(task.cn)}</div>
      <div class="task-en">${esc(task.en)}</div>
      <div class="task-meta">${metaText}</div>
      <div style="margin-top:16px" id="doArea"></div>
    </div>`;

  $("#swapBtn").addEventListener("click", () => {
    day.swap = (day.swap || 0) + 1;
    save(); render();
  });
  const up = $("#upLevel"); if (up) up.addEventListener("click", () => { state.level = nl; save(); render(); });

  day.startedAt = Date.now(); // 计时基准：本次进入任务页的时间，切走再切回会重置
  const area = $("#doArea");
  if (task.t === "听") renderListenArea(area, day, task);
  else if (task.t === "说") renderSpeakArea(area, day, task);
  else if (task.t === "读") renderReadArea(area, day, lv, task);
  else renderWriteArea(area, day, lv, task);
}

function renderWriteArea(area, day, lv, task, extra) {
  area.innerHTML = `
    <textarea id="draft" placeholder="直接写，别查词典，先写完再说……">${esc(day.draft || "")}</textarea>
    <div class="wordcount" id="wc"></div>
    <div class="btn-row">
      <button class="btn primary" id="finishBtn">完成打卡</button>
    </div>
    <p class="hint">写完可以顺手点「复习」把最近存的表达过一遍，两分钟。</p>`;
  const ta = $("#draft");
  const wc = $("#wc");
  const upd = () => {
    const n = countWords(ta.value);
    wc.innerHTML = `已写 <b>${n}</b> / ${lv.words} 词` + (n >= lv.words ? " · 够了，打卡吧" : "");
  };
  ta.addEventListener("input", () => { day.draft = ta.value; save(); upd(); });
  upd();
  $("#finishBtn").addEventListener("click", () => {
    if (!ta.value.trim() && !confirm(extra ? "一个字都没写，确定结束这次加练吗？" : "一个字都没写，确定要打卡吗？开口说了也算用，写了更好。")) return;
    day.draft = ta.value;
    if (extra) { finishExtra(day, task, 0); return; }
    finishDaily(day, task, 0);
  });
}

function renderSpeakArea(area, day, task, extra) {
  area.innerHTML = `
    <div class="timer" id="timer">0:00</div>
    <div class="timer-label">对着空气、手机录音或随便什么人说，重点是出声</div>
    <div class="btn-row" style="justify-content:center">
      <button class="btn" id="timerBtn">开始计时</button>
    </div>
    <textarea id="draft" style="margin-top:14px;min-height:80px" placeholder="可选：卡壳的地方、刚学会的句子，记一句也是赚">${esc(day.draft || "")}</textarea>
    <div class="btn-row">
      <button class="btn primary" id="finishBtn">说完了，打卡</button>
    </div>`;
  let secs = 0, timerId = null;
  const fmt = s => Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  $("#timerBtn").addEventListener("click", e => {
    if (timerId) { clearInterval(timerId); timerId = null; e.target.textContent = "继续计时"; }
    else {
      e.target.textContent = "暂停";
      timerId = setInterval(() => { secs++; $("#timer").textContent = fmt(secs); }, 1000);
    }
  });
  const ta = $("#draft");
  ta.addEventListener("input", () => { day.draft = ta.value; save(); });
  $("#finishBtn").addEventListener("click", () => {
    if (timerId) clearInterval(timerId);
    day.draft = ta.value;
    if (extra) { finishExtra(day, task, secs); return; }
    finishDaily(day, task, secs);
  });
}

function renderListenArea(area, day, task, extra) {
  // 影子跟读模式：逐句 听 → 不看原文跟读 → 卡住再看原文
  const sentences = splitSentences(task.passage || "");
  const RATES = [0.7, 0.85, 1, 1.15];
  const base = SPEECH_RATE[state.level] || 1;
  let rate = RATES.reduce((a, b) => Math.abs(b - base) < Math.abs(a - base) ? b : a);
  let idx = Math.min(day.shadowIdx || 0, Math.max(0, sentences.length - 1));
  let showText = false, loop = false, playing = false;

  area.innerHTML = `
    <p class="hint" style="text-align:center;margin:0 0 4px">影子跟读：播一句 → 不看原文跟读 → 卡住再瞄原文 → 下一句</p>
    <div class="shad-progress" id="shadProg"></div>
    <div class="shad-sentence" id="shadSent"></div>
    <div class="rate-row">
      ${RATES.map(r => `<button class="btn rate-btn" data-rate="${r}">×${r}</button>`).join("")}
      <button class="btn" id="loopBtn">🔁 关</button>
    </div>
    <div class="btn-row" style="justify-content:center;margin-top:6px">
      <button class="btn" id="prevBtn">◀ 上一句</button>
      <button class="btn primary" id="playBtn">▶ 播放</button>
      <button class="btn" id="nextBtn">下一句 ▶</button>
    </div>
    <div class="btn-row" style="justify-content:center;margin-top:6px">
      <button class="btn ghost" id="showTextBtn">显示本句原文</button>
      <button class="btn ghost" id="playAllBtn">▶ 整篇连播</button>
      <button class="btn ghost" id="markHardBtn">不熟 · 加入复习</button>
    </div>
    <textarea id="draft" style="margin-top:12px;min-height:70px" placeholder="卡壳的句子、想记住的表达，记在这里…">${esc(day.draft || "")}</textarea>
    <div class="btn-row">
      <button class="btn primary" id="finishBtn">跟读完了，打卡</button>
    </div>`;

  const $s = sel => area.querySelector(sel);
  function paint() {
    $s("#shadProg").textContent = "第 " + (idx + 1) + " / " + sentences.length + " 句";
    $s("#shadSent").innerHTML = showText
      ? esc(sentences[idx])
      : '<span style="color:var(--ink-2);font-weight:400">（先听，跟不上再点「显示本句原文」）</span>';
    $s("#showTextBtn").textContent = showText ? "隐藏原文" : "显示本句原文";
    $s("#loopBtn").textContent = loop ? "🔁 开" : "🔁 关";
    area.querySelectorAll(".rate-btn").forEach(b => b.classList.toggle("on", Number(b.dataset.rate) === rate));
    $s("#prevBtn").disabled = idx === 0;
    $s("#nextBtn").disabled = idx >= sentences.length - 1;
    day.shadowIdx = idx; save();
  }
  function stopSpeak() {
    loop = false;
    if (window.speechSynthesis) speechSynthesis.cancel();
    playing = false;
    const pb = $s("#playBtn"); if (pb) pb.textContent = "▶ 播放";
  }
  function playCur() {
    playing = true; $s("#playBtn").textContent = "⏸ 停止";
    day.shadowPlays = day.shadowPlays || {};
    day.shadowPlays[idx] = (day.shadowPlays[idx] || 0) + 1;
    if (day.shadowPlays[idx] === 4) {
      if (addListenReview(sentences[idx], todayKey())) toast("这句听得有点多，已加入听力复习");
    }
    speakOnce(sentences[idx], rate, () => {
      playing = false; $s("#playBtn").textContent = "▶ 播放";
      if (loop) setTimeout(() => { if (loop) playCur(); }, 700);
    });
  }
  $s("#playBtn").addEventListener("click", () => {
    if (playing) { stopSpeak(); paint(); return; }
    playCur();
  });
  $s("#prevBtn").addEventListener("click", () => { if (idx > 0) { idx--; paint(); playCur(); } });
  $s("#nextBtn").addEventListener("click", () => { if (idx < sentences.length - 1) { idx++; paint(); playCur(); } });
  $s("#showTextBtn").addEventListener("click", () => { showText = !showText; paint(); });
  $s("#markHardBtn").addEventListener("click", () => {
    if (addListenReview(sentences[idx], todayKey())) toast("已加入听力复习，去「复习」页多练几遍");
    else toast("这句已经在复习列表里了");
  });
  $s("#loopBtn").addEventListener("click", () => { loop = !loop; paint(); });
  area.querySelectorAll(".rate-btn").forEach(b =>
    b.addEventListener("click", () => { rate = Number(b.dataset.rate); paint(); playCur(); }));
  $s("#playAllBtn").addEventListener("click", () => {
    stopSpeak();
    let i = 0;
    const step = () => {
      if (i >= sentences.length) { playing = false; $s("#playBtn").textContent = "▶ 播放"; paint(); return; }
      idx = i; paint();
      playing = true; $s("#playBtn").textContent = "⏸ 停止";
      speakOnce(sentences[i], rate, () => { i++; step(); });
    };
    step();
  });
  const ta = $s("#draft");
  ta.addEventListener("input", () => { day.draft = ta.value; save(); });
  $s("#finishBtn").addEventListener("click", () => {
    stopSpeak();
    day.draft = ta.value;
    if (extra) { finishExtra(day, task, 0); return; }
    finishDaily(day, task, 0);
  });
  paint();
}

/* ---- 雅思式阅读题：短文 + 判断题/单选/简答 ---- */
const TF_LABEL = { T: "True", F: "False", NG: "Not Given" };
function readScore(task, day) {
  const qs = task.qs || [];
  let right = 0, total = 0;
  qs.forEach((q, i) => {
    if (q.type === "sa") return; // 简答不计分
    total++;
    const ans = (day.qans || {})[i];
    if (ans !== undefined && ans === q.a) right++;
  });
  return { right, total };
}
function qResultHTML(q, i, day) {
  const ans = (day.qans || {})[i];
  if (ans === undefined || q.type === "sa") return "";
  const ok = ans === q.a;
  const correct = q.type === "mc" ? q.opts[q.a] : TF_LABEL[q.a];
  return (ok
    ? `<span class="q-correct">✓ 正确</span>`
    : `<span class="q-wrong">✗ 正确答案：${esc(correct)}</span>`) + (q.why ? `<span class="q-why">${esc(q.why)}</span>` : "");
}
function readQuestionsHTML(task, day) {
  const qs = task.qs || [];
  if (!qs.length) return "";
  const s = readScore(task, day);
  const ans = day.qans || {}, rev = day.qrev || {};
  return `
    <div class="q-block">
      <div class="row" style="justify-content:space-between">
        <span class="section-title" style="margin:0">阅读题</span>
        <span class="q-score" id="qScore">答对 ${s.right} / ${s.total}</span>
      </div>
      ${qs.map((q, i) => `
        <div class="q-item" data-q="${i}">
          <div class="q-title">${i + 1}. ${esc(q.q)}</div>
          ${q.type === "tf" ? `<div class="q-opts">${Object.keys(TF_LABEL).map(v => `<button class="btn q-opt${ans[i] === v ? " picked" : ""}" data-qidx="${i}" data-qval="${v}">${TF_LABEL[v]}</button>`).join("")}</div>` : ""}
          ${q.type === "mc" ? `<div class="q-opts">${q.opts.map((o, k) => `<button class="btn q-opt${ans[i] === k ? " picked" : ""}" data-qidx="${i}" data-qval="${k}">${esc(o)}</button>`).join("")}</div>` : ""}
          ${q.type === "sa" ? `
            <textarea class="q-sa" data-qsa="${i}" placeholder="用英文简短回答…">${esc(ans[i] || "")}</textarea>
            ${rev[i] ? `<div class="q-ref"><b>参考：</b>${esc(q.a)}${q.why ? `<div class="q-why">${esc(q.why)}</div>` : ""}</div>` : `<button class="btn ghost q-reveal" data-qidx="${i}">查看参考答案</button>`}` : ""}
          <div class="q-result">${qResultHTML(q, i, day)}</div>
        </div>`).join("")}
    </div>`;
}
function bindReadQuestions(root, task, day) {
  const qs = task.qs || [];
  if (!qs.length) return;
  day.qans = day.qans || {};
  day.qrev = day.qrev || {};
  const updateScore = () => {
    const s = readScore(task, day);
    const el = root.querySelector("#qScore");
    if (el) el.textContent = `答对 ${s.right} / ${s.total}`;
  };
  root.querySelectorAll(".q-opt").forEach(btn => {
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.qidx);
      const q = qs[i];
      const val = q.type === "mc" ? Number(btn.dataset.qval) : btn.dataset.qval;
      day.qans[i] = val;
      save();
      const item = root.querySelector(`[data-q="${i}"]`);
      item.querySelectorAll(".q-opt").forEach(b => b.classList.remove("picked"));
      btn.classList.add("picked");
      item.querySelector(".q-result").innerHTML = qResultHTML(q, i, day);
      updateScore();
    });
  });
  root.querySelectorAll(".q-sa").forEach(ta => {
    const i = Number(ta.dataset.qsa);
    ta.addEventListener("input", () => { day.qans[i] = ta.value; save(); });
  });
  root.querySelectorAll(".q-reveal").forEach(b => {
    const i = Number(b.dataset.qidx);
    const q = qs[i];
    b.addEventListener("click", () => {
      day.qrev[i] = true; save();
      const ref = document.createElement("div");
      ref.className = "q-ref";
      ref.innerHTML = `<b>参考：</b>${esc(q.a)}${q.why ? `<div class="q-why">${esc(q.why)}</div>` : ""}`;
      b.replaceWith(ref);
    });
  });
}

function renderReadArea(area, day, lv, task, extra) {
  const target = Math.max(10, Math.round(lv.words / 2));
  area.innerHTML = `
    <div class="hist-text" id="passageBox" style="margin-bottom:6px">${esc(task.passage)}</div>
    <p class="hint" style="margin-bottom:12px">💡 划选原文里的单词或短语：弹出解释，一键加入生词库（自动带上原句）</p>
    ${readQuestionsHTML(task, day)}
    <textarea id="draft" placeholder="用 1-2 句英文总结这段话，或写下你的看法…">${esc(day.draft || "")}</textarea>
    <div class="wordcount" id="wc"></div>
    <div class="btn-row">
      <button class="btn primary" id="finishBtn">完成${extra ? "加练" : "打卡"}</button>
    </div>`;
  const ta = $("#draft");
  const wc = $("#wc");
  const upd = () => {
    const n = countWords(ta.value);
    wc.innerHTML = `总结 <b>${n}</b> 词` + (n >= target ? " · 够了" : "");
  };
  ta.addEventListener("input", () => { day.draft = ta.value; save(); upd(); });
  upd();
  bindPassageSelect($("#passageBox", area), task.passage);
  bindReadQuestions(area, task, day);
  $("#finishBtn").addEventListener("click", () => {
    if (!ta.value.trim() && !confirm(extra ? "还没写总结，结束这次加练？读完、答过题也算。" : "还没写总结，直接打卡？读完、答过题也算。")) return;
    day.draft = ta.value;
    if (extra) { finishExtra(day, task, 0); return; }
    finishDaily(day, task, 0);
  });
}

/* ---- 完成与计时 ---- */
function computeSecs(rec, timerSecs) {
  const elapsed = rec.startedAt ? Math.round((Date.now() - rec.startedAt) / 1000) : 0;
  const t = Number(timerSecs) || 0;
  // 开口任务优先用计时器（真实开口时长）；其余用页面停留时长，上限 4 小时防挂机
  const v = t > 0 ? t : elapsed;
  return Math.min(v, 4 * 3600);
}
function finishDaily(day, task, timerSecs) {
  day.secs = computeSecs(day, timerSecs);
  delete day.startedAt;
  day.done = true; day.skill = task.t; day.finishedAt = new Date().toISOString();
  if (countWords(day.draft) >= 5) day.feedback = analyzeWriting(day.draft, state.level);
  save(); render();
}
function finishExtra(rec, task, timerSecs) {
  state.nextSessionId = state.nextSessionId || (state.sessions.length + 1);
  const s = {
    id: state.nextSessionId++,
    date: todayKey(),
    skill: task.t,
    cn: task.cn || "",
    secs: computeSecs(rec, timerSecs),
    nw: 0, np: 0, ns: 0,
    draft: rec.draft || "",
    finishedAt: new Date().toISOString(),
  };
  state.sessions.push(s);
  // 刻意练习：加练和打卡一样，写下的内容立刻过一遍本地点评（AI 深度点评在完成页）
  if (countWords(s.draft) >= 5) s.feedback = analyzeWriting(s.draft, state.level);
  save();
  extraDone = s; extraPick = null; render();
}

