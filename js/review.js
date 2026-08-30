/* 复习页：听力复习（shadowing）+ SuperMemo 导出入口 */
/* ---- 复习 ---- */
/* ---- 听力复习队列 ---- */
function addListenReview(text, from) {
  text = String(text || "").trim();
  if (!text) return false;
  state.listenReview = state.listenReview || [];
  if (state.listenReview.some(it => it.text === text)) return false;
  state.listenReview.push({ id: state.nextLrId++, text, from: from || "", added: todayKey(), plays: 0 });
  save();
  return true;
}

/* ---- 复习页：表达/生词只导出 SuperMemo；站内复习 = 听力 shadowing ---- */
function renderReview(main) {
  const lr = state.listenReview || [];
  main.innerHTML = `
    <div class="card">
      <div class="section-title">表达 / 生词 → 导出 SuperMemo</div>
      <p class="hint" style="margin-top:0">表达和生词不在站内复习了，统一导给 SuperMemo 做长期记忆。当前共 ${state.cards.length} 条可导出。</p>
      <div class="btn-row" style="margin-top:6px">
        <button class="btn primary" id="exportSm">导出 SuperMemo 文件</button>
        <button class="btn ghost" id="goCards">去表达库勾选导出 →</button>
      </div>
    </div>
    <div class="card">
      <div class="section-title">听力复习（${lr.length}）</div>
      <p class="hint" style="margin-top:0">跟读时反复听仍不熟的句子在这里继续练：播放 → 跟读 → 必要时显示原文对照，熟了点「已掌握」。</p>
      <div id="lrList"></div>
    </div>`;
  $("#exportSm").addEventListener("click", () => exportSuperMemo(false));
  $("#goCards").addEventListener("click", () => { tab = "cards"; render(); });
  const list = $("#lrList");
  if (!lr.length) {
    list.innerHTML = '<div class="empty">还没有句子。做听力任务时，跟不下来的句子点「不熟 · 加入复习」；同一句听 4 遍以上也会自动进来。</div>';
    return;
  }
  const rate = SPEECH_RATE[state.level] || 1;
  list.innerHTML = lr.map(it => `
    <div class="lr-item" data-id="${it.id}">
      <div class="lr-text" data-lrtext>${esc(it.text)}</div>
      <div class="row" style="margin-top:8px;gap:6px;flex-wrap:wrap">
        <button class="btn primary" data-lrplay>▶ 播放</button>
        <button class="btn ghost" data-lrshow>显示原文</button>
        <span class="hint" style="margin:0" data-lrplays>已练 ${it.plays || 0} 遍</span>
        <div class="spacer"></div>
        <button class="btn ghost danger" data-lrdel>已掌握 ✓</button>
      </div>
    </div>`).join("");
  list.querySelectorAll(".lr-item").forEach(el => {
    const id = Number(el.dataset.id);
    const it = (state.listenReview || []).find(x => x.id === id);
    if (!it) return;
    const textEl = el.querySelector("[data-lrtext]");
    el.querySelector("[data-lrplay]").addEventListener("click", () => {
      speakOnce(it.text, rate);
      it.plays = (it.plays || 0) + 1;
      save();
      el.querySelector("[data-lrplays]").textContent = "已练 " + it.plays + " 遍";
    });
    el.querySelector("[data-lrshow]").addEventListener("click", () => {
      const show = textEl.classList.toggle("show");
      el.querySelector("[data-lrshow]").textContent = show ? "隐藏原文" : "显示原文";
    });
    el.querySelector("[data-lrdel]").addEventListener("click", () => {
      state.listenReview = state.listenReview.filter(x => x.id !== id);
      save(); render();
    });
  });
}

