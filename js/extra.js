/* 自主加练：技能挑选 + 加练会话 + 战果登记 */
/* ---- 自主加练 ---- */
function extraTaskFor(skill, idx) {
  const list = TASKS[state.level].filter(t => t.t === skill);
  return list[((idx % list.length) + list.length) % list.length];
}
/* 抽卡去重：同一技能下按「没练过的优先 → 都练过按最久没练的轮换」抽卡，
   一轮内不重复；今天打卡那张卡也不会出现在加练里。 */
function extraDailyIdx(skill, list) {
  const dt = taskFor(state.level, todayKey(), (getDay(todayKey()) || { swap: 0 }).swap || 0);
  return (dt && dt.t === skill) ? list.indexOf(dt) : -1;
}
function extraNextIdx(skill, excludeIdx = null) {
  state.extraSeen = state.extraSeen || {};
  const key = state.level + ":" + skill;
  const list = TASKS[state.level].filter(t => t.t === skill);
  const dailyIdx = extraDailyIdx(skill, list);
  const seen = state.extraSeen[key] || [];
  const unseen = list.map((_, i) => i).filter(i => !seen.includes(i));
  // seen 数组本就是「最久没练 → 最近练过」有序，直接取最久没练的优先
  let order = [...unseen, ...seen].filter(i => i !== dailyIdx && i !== excludeIdx);
  if (!order.length) order = list.map((_, i) => i).filter(i => i !== excludeIdx);
  const idx = order[0];
  // LRU 环：把刚抽的移到末尾
  state.extraSeen[key] = [...seen.filter(i => i !== idx), idx];
  return idx;
}
function extraPickIdx(skill) {
  return extraNextIdx(skill, null);
}
function extraSwapIdx(pick) {
  return extraNextIdx(pick.skill, pick.idx);
}
function renderExtra(main) {
  if (extraDone) { renderExtraDone(main); return; }
  if (!extraPick) { renderExtraPick(main); return; }
  renderExtraTask(main);
}
function renderExtraPick(main) {
  const t = dayStats(todayKey());
  main.innerHTML = `
    <div class="card">
      <div class="section-title">自主加练</div>
      <p class="hint">每日打卡照旧；想多练的时候来这儿，听说读写任选一项。加练不限次数，时长和新学内容都会计入「统计」。</p>
      <div class="skill-grid">
        <button class="skill-opt" data-skill="听"><b>🎧 听</b><span>盲听短文</span></button>
        <button class="skill-opt" data-skill="说"><b>🎙 说</b><span>开口 + 计时</span></button>
        <button class="skill-opt" data-skill="读"><b>📖 读</b><span>短文 + 回应</span></button>
        <button class="skill-opt" data-skill="写"><b>✍️ 写</b><span>场景写作</span></button>
      </div>
      ${t.sessions || t.secs ? `<p class="hint" style="margin-top:14px">今天已加练 <b>${t.sessions}</b> 次 · 今日累计学习 ${fmtMins(t.secs)}。再来一项？</p>` : ""}
    </div>`;
  main.querySelectorAll(".skill-opt").forEach(b =>
    b.addEventListener("click", () => {
      extraPick = { skill: b.dataset.skill, idx: extraPickIdx(b.dataset.skill), startedAt: Date.now(), draft: "" };
      render();
    }));
}
function renderExtraTask(main) {
  const task = extraTaskFor(extraPick.skill, extraPick.idx);
  const lv = LEVELS[state.level];
  extraPick.startedAt = Date.now(); // 切走再切回来不计空白时间
  const metaText =
    task.t === "说" ? `建议时长 ≥ ${lv.secs} 秒 · 说完结束` :
    task.t === "写" ? `目标 ≥ ${lv.words} 个词 · 自动计时` :
    task.t === "听" ? "先别看原文，盲听 2-3 遍，再完成检验" :
    "读完后用英语回应（写或说都算）";
  main.innerHTML = `
    <div class="card">
      <div class="row" style="justify-content:space-between">
        <span class="task-type">${SKILL_BADGE[task.t] || task.t} · 加练</span>
        <div class="row">
          <button class="btn ghost" id="swapBtn">换一张</button>
          <button class="btn ghost danger" id="quitBtn">不练了</button>
        </div>
      </div>
      <div class="task-cn">${esc(task.cn)}</div>
      <div class="task-en">${esc(task.en)}</div>
      <div class="task-meta">${metaText}</div>
      <div style="margin-top:16px" id="doArea"></div>
    </div>`;
  $("#swapBtn").addEventListener("click", () => { extraPick.idx = extraSwapIdx(extraPick); save(); render(); });
  $("#quitBtn").addEventListener("click", () => {
    if (extraPick.draft && extraPick.draft.trim() && !confirm("这次还没记完，确定放弃？")) return;
    extraPick = null; render();
  });
  const area = $("#doArea");
  if (task.t === "听") renderListenArea(area, extraPick, task, true);
  else if (task.t === "说") renderSpeakArea(area, extraPick, task, true);
  else if (task.t === "读") renderReadArea(area, extraPick, lv, task, true);
  else renderWriteArea(area, extraPick, lv, task, true);
}
function renderExtraDone(main) {
  const s = extraDone;
  main.innerHTML = `
    <div class="card done-hero">
      <div class="big">🎉</div>
      <h2>加练完成 · ${SKILL_BADGE[s.skill] || s.skill}</h2>
      <p>用时 ${fmtMins(s.secs)} · 已计入「统计」</p>
    </div>
    ${feedbackSection(s)}
    <div class="card">
      <div class="section-title">这次学到了什么？</div>
      <p class="hint">新学的单词 / 短语 / 句子分别记个数，点几下就行。</p>
      ${learnReportForm(s)}
    </div>
    ${s.draft && s.draft.trim() ? `
    <div class="card">
      <div class="section-title">这次的文字</div>
      <div class="hist-text">${esc(s.draft)}</div>
    </div>` : ""}
    <div class="card">
      <div class="section-title">顺手留一条表达？</div>
      ${quickAddForm()}
    </div>
    <div class="btn-row">
      <button class="btn primary" id="againBtn">再练一项</button>
      <button class="btn" id="backToday">回到今天</button>
    </div>`;
  bindLearnReport(main, s);
  bindQuickAdd(main);
  bindFeedback(main, s);
  $("#againBtn").addEventListener("click", () => { extraDone = null; extraPick = null; render(); });
  $("#backToday").addEventListener("click", () => { extraDone = null; extraPick = null; tab = "today"; render(); });
}

/* ---- 学习战果登记（步进器） ---- */
function learnReportForm(target) {
  const f = (label, key) => `
    <div class="report-item">
      <span class="report-label">新学${label}</span>
      <div class="stepper">
        <button class="btn ghost step-btn" data-step="${key}" data-d="-1">−</button>
        <b class="step-val" data-val="${key}">${target[key] || 0}</b>
        <button class="btn ghost step-btn" data-step="${key}" data-d="1">＋</button>
      </div>
    </div>`;
  return `<div class="report-grid">${f("单词", "nw")}${f("短语", "np")}${f("句子", "ns")}</div>`;
}
function bindLearnReport(root, target) {
  root.querySelectorAll(".step-btn").forEach(b =>
    b.addEventListener("click", () => {
      const k = b.dataset.step, d = Number(b.dataset.d);
      target[k] = Math.max(0, (target[k] || 0) + d);
      root.querySelector(`[data-val="${k}"]`).textContent = target[k];
      save();
    }));
}

