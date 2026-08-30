/* 记录页：历史、备份恢复、AI 配置、级别调整 */
/* ---- 记录 ---- */
function renderMe(main) {
  const days = Object.entries(state.days)
    .filter(([, d]) => d.done)
    .sort((a, b) => (a[0] < b[0] ? 1 : -1));
  const skills = { "听": 0, "说": 0, "读": 0, "写": 0 };
  days.forEach(([, d]) => { if (d.skill) skills[d.skill] = (skills[d.skill] || 0) + 1; });
  (state.sessions || []).forEach(s => { if (s.skill) skills[s.skill] = (skills[s.skill] || 0) + 1; });
  const tot = allTotals();
  const hist = [
    ...days.map(([k, d]) => ({ k, level: d.level, skill: d.skill, draft: d.draft, secs: d.secs, extra: false })),
    ...(state.sessions || []).map(s => ({ k: s.date, level: "", skill: s.skill, cn: s.cn, draft: s.draft, secs: s.secs, extra: true, sid: s.id })),
  ].sort((a, b) => (a.k < b.k ? 1 : -1));
  main.innerHTML = `
    <div class="stat-row">
      <div class="stat amber"><b>${streak()}</b><span>连续天数</span></div>
      <div class="stat"><b>${totalDone()}</b><span>总打卡</span></div>
      <div class="stat"><b>${tot.sessions}</b><span>总加练</span></div>
      <div class="stat"><b>${state.cards.length}</b><span>表达库存</span></div>
    </div>
    <div class="stat-row">
      <div class="stat"><b>${skills["听"]}</b><span>🎧 听</span></div>
      <div class="stat"><b>${skills["说"]}</b><span>🎙 说</span></div>
      <div class="stat"><b>${skills["读"]}</b><span>📖 读</span></div>
      <div class="stat"><b>${skills["写"]}</b><span>✍️ 写</span></div>
    </div>
    <p class="hint" style="margin-top:-8px">四科分布含每日打卡与自主加练。</p>
    <div class="card">
      <div class="section-title">AI 深度点评（可选）</div>
      ${location.protocol === "file:" ? `
      <div class="banner" style="margin-bottom:10px">
        <span>AI 点评在本机中转地址下才能用（从文件直接打开的页面会被浏览器拦截请求）。</span>
        <a class="btn primary" href="http://127.0.0.1:8787/">切换到 http://127.0.0.1:8787/</a>
      </div>` : ""}
      <div class="grid2">
        <input type="text" id="aiBase" placeholder="接口地址，如 https://api.openai.com/v1" value="${esc(state.ai.base)}">
        <input type="text" id="aiModel" placeholder="模型，如 gpt-4o-mini / deepseek-chat" value="${esc(state.ai.model)}">
      </div>
      <input type="text" id="aiKey" style="margin-top:10px" placeholder="API Key（只保存在本机浏览器里）" value="${esc(state.ai.key)}">
      <div class="btn-row" style="margin-top:10px">
        <button class="btn" id="aiFillKimi">一键填 Kimi 会员</button>
        <button class="btn" id="aiSave">保存配置</button>
        <button class="btn" id="aiTest">测试连接</button>
      </div>
      <div class="ai-status" id="aiTestResult"></div>
      <p class="hint">任何兼容 OpenAI 格式的接口都行。Kimi 会员 → http://127.0.0.1:8787/v1（走本机中转，模型按档位填 kimi-for-coding 或 k3-256k）· Moonshot 开放平台 → https://api.moonshot.cn/v1 · DeepSeek → https://api.deepseek.com/v1 · OpenRouter → https://openrouter.ai/api/v1。地址只填到 /v1。不配也不影响本地点评，本地点评永远离线可用。</p>
    </div>
    <div class="card">
      <div class="section-title">数据备份</div>
      <div class="btn-row" style="margin-top:4px">
        <button class="btn" id="backupBtn">导出备份（JSON）</button>
        <button class="btn" id="restoreBtn">导入备份</button>
        <input type="file" id="restoreFile" accept=".json" style="display:none">
      </div>
      <p class="hint">数据存在这台电脑的浏览器里。换浏览器/重装前记得导出备份。</p>
    </div>
    <div class="card">
      <div class="section-title">历史记录</div>
      ${hist.length ? hist.map(h => `
        <div class="hist-item">
          <div class="hist-head"><b>${h.k}</b><span>${h.extra ? `<span class="tag-fb" style="background:var(--accent-soft);color:var(--accent)">加练</span> ` : ""}${esc(h.level || "")}${h.skill ? " · " + esc(SKILL_BADGE[h.skill] || h.skill) : ""}${h.secs ? " · " + fmtMins(h.secs) : ""}</span></div>
          ${h.cn ? `<div class="hint" style="margin-top:2px">${esc(h.cn)}</div>` : ""}
          ${h.draft ? `<div class="hist-text">${esc(h.draft)}</div>` : ""}
          ${h.extra ? `<div class="btn-row" style="margin-top:6px"><button class="btn ghost" data-openfb="${h.sid}">查看点评</button></div>` : ""}
        </div>`).join("") : `<div class="empty">还没有记录，今天就是第一天。</div>`}
    </div>`;
  $("#backupBtn").addEventListener("click", () =>
    download(JSON.stringify(state, null, 2), `daily-english-backup-${todayKey()}.json`, "application/json"));
  main.querySelectorAll("[data-openfb]").forEach(b =>
    b.addEventListener("click", () => {
      const s = (state.sessions || []).find(x => x.id === Number(b.dataset.openfb));
      if (s) { extraDone = s; tab = "extra"; render(); }
    }));
  $("#aiSave").addEventListener("click", () => {
    state.ai = { base: $("#aiBase").value.trim(), model: $("#aiModel").value.trim(), key: $("#aiKey").value.trim() };
    save(); alert("已保存");
  });
  $("#aiFillKimi").addEventListener("click", () => {
    $("#aiBase").value = "http://127.0.0.1:8787/v1";
    $("#aiModel").value = "k3-256k";
    $("#aiTestResult").textContent = "已填好 Kimi 会员地址和模型，只需粘贴 Key，然后点「测试连接」";
    $("#aiTestResult").style.color = "var(--accent)";
  });
  $("#aiTest").addEventListener("click", async () => {
    const base = $("#aiBase").value.trim(), model = $("#aiModel").value.trim(), key = $("#aiKey").value.trim();
    const out = $("#aiTestResult");
    const show = (msg, ok) => { out.textContent = msg; out.style.color = ok ? "var(--accent)" : "var(--red)"; };
    const isLocal = /^(\/|https?:\/\/(127\.0\.0\.1|localhost))/i.test(base);
    if (!base || !model || (!key && !isLocal)) { show("⚠ 接口地址和模型必填；本机地址（127.0.0.1）可不填 Key，其他服务必须填", false); return; }
    if (/\/chat\/completions\/?$/i.test(base)) { show("⚠ 地址填到 /v1 为止，不要带 /chat/completions（工具会自动拼）", false); return; }
    if (location.protocol === "file:" && isLocal) {
      show("⚠ 当前是从文件直接打开的页面，浏览器会拦截本机请求。请点上方链接切换到 http://127.0.0.1:8787/ 再测", false); return;
    }
    show("测试中…", true);
    const t0 = Date.now();
    try {
      const headers = { "Content-Type": "application/json" };
      if (key) headers["Authorization"] = "Bearer " + key;
      const resp = await fetch(base.replace(/\/+$/, "") + "/chat/completions", {
        method: "POST",
        headers,
        body: JSON.stringify({ model, max_tokens: 50, messages: [{ role: "user", content: "Reply with exactly: ok" }] }),
      });
      const ms = Date.now() - t0;
      if (!resp.ok) {
        const txt = (await resp.text()).slice(0, 150);
        show(`✗ 连接失败：HTTP ${resp.status} — ${txt}`, false);
        return;
      }
      const data = await resp.json();
      const msg0 = (((data.choices || [])[0] || {}).message) || {};
      const reply = msg0.content || msg0.reasoning_content || "";
      show(`✓ 连接成功（${ms}ms），模型回复：${String(reply).trim().slice(0, 40) || "(空回复)"}`, true);
    } catch (e) {
      show(`✗ 请求失败：${e.message}（网络不通、地址写错或跨域被拦截）`, false);
    }
  });
  $("#restoreBtn").addEventListener("click", () => $("#restoreFile").click());
  $("#restoreFile").addEventListener("change", e => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const data = JSON.parse(r.result);
        if (!data || typeof data !== "object" || !data.days) throw new Error("bad");
        state = Object.assign(blankState(), data);
        save(); alert("恢复成功"); render();
      } catch { alert("文件格式不对"); }
    };
    r.readAsText(f);
  });
}

function download(content, filename, mime) {
  const blob = new Blob(["\ufeff" + content], { type: mime });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

/* ---- 调整级别 ---- */
function changeLevel() {
  const cur = state.level;
  const pick = prompt(
    "当前级别：" + LEVELS[cur].label + "\n\n输入新级别（A1 / A2 / B1 / B2 / C1 / C2）：\n" +
    LEVEL_ORDER.map(k => `${k}：${LEVELS[k].desc}`).join("\n"), cur);
  if (!pick) return;
  const v = pick.trim().toUpperCase();
  if (!LEVELS[v]) { alert("级别无效"); return; }
  state.level = v; save(); render();
}

