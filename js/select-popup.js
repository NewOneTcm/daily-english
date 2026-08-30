/* 划词弹窗：阅读/精读共享（AI 解释 + 存生词库） */
let selPopupEl = null;
function hideSelPopup() {
  if (selPopupEl) { selPopupEl.remove(); selPopupEl = null; }
}
function toast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add("show"), 10);
  setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 300); }, 1600);
}
async function aiExplainFetch(word, sentence) {
  const ai = state.ai || {};
  const headers = { "Content-Type": "application/json" };
  if (ai.key) headers["Authorization"] = "Bearer " + ai.key;
  const resp = await fetch(ai.base.replace(/\/+$/, "") + "/chat/completions", {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: ai.model,
      messages: [
        { role: "system", content: "你是英语词汇老师。用户给你一个英文单词或短语和它的出处句子。严格输出三行：第一行：国际音标 IPA（用 / / 包裹）；第二行：词性 + 结合句中语境的中文释义；第三行：一个用它的新例句（难度与用户水平 " + state.level + " 相当）。不要输出任何其他内容。" },
        { role: "user", content: "单词/短语：" + word + "\n出处句子：" + sentence },
      ],
    }),
  });
  if (!resp.ok) throw new Error("HTTP " + resp.status + " " + (await resp.text()).slice(0, 120));
  const data = await resp.json();
  const text = ((data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || "").trim();
  if (!text) throw new Error("AI 返回了空内容");
  const lines = text.split(/\n+/).map(l => l.trim()).filter(Boolean);
  let phonetic = "";
  if (lines.length && /^[/\[]/.test(lines[0])) phonetic = lines.shift();
  return { phonetic, explain: lines.join("\n") };
}
// 发音：浏览器内置 TTS，离线可用

function bindPassageSelect(box, passage) {
  if (!box) return;
  box.classList.add("selbox");
  box.addEventListener("mouseup", () => {
    setTimeout(() => {
      const sel = window.getSelection && window.getSelection();
      if (!sel || sel.isCollapsed) return;
      const text = sel.toString().replace(/\s+/g, " ").trim();
      if (!text || text.length > 80) return;
      if (!box.contains(sel.anchorNode)) return;
      let rect;
      try { rect = sel.getRangeAt(0).getBoundingClientRect(); } catch (e) { return; }
      showSelPopup(text, sentenceOf(passage, text), rect);
    }, 10);
  });
  // 点页面其他地方时收起弹窗（document 级监听只绑一次）
  if (!bindPassageSelect._docBound) {
    bindPassageSelect._docBound = true;
    document.addEventListener("mousedown", e => {
      if (selPopupEl && !selPopupEl.contains(e.target) && !(e.target && e.target.closest && e.target.closest("#passageBox, .selbox"))) hideSelPopup();
    });
  }
}
function showSelPopup(text, sentence, rect) {
  hideSelPopup();
  const el = document.createElement("div");
  el.className = "sel-popup";
  el.innerHTML = `
    <div class="row" style="justify-content:space-between;align-items:center">
      <div class="sel-word">${esc(text)}</div>
      <button class="btn ghost" id="selClose" title="关闭" style="padding:0 8px;font-size:18px;line-height:1">×</button>
    </div>
    <div class="sel-explain" id="selExplain">…</div>
    <div class="btn-row" style="margin-top:8px">
      <button class="btn primary" id="selAdd">＋ 添加到生词库</button>
    </div>`;
  document.body.appendChild(el);
  el.style.top = (rect.bottom + window.scrollY + 6) + "px";
  el.style.left = Math.max(8, Math.min(rect.left + window.scrollX, window.innerWidth - 280)) + "px";
  selPopupEl = el;
  const exEl = el.querySelector("#selExplain");
  const closeBtn = el.querySelector("#selClose");
  if (closeBtn) closeBtn.addEventListener("click", () => {
    hideSelPopup();
    if (window.getSelection) window.getSelection().removeAllRanges();
  });
  const ai = state.ai || {};
  if (ai.base && ai.model) {
    exEl.textContent = "AI 解释加载中…";
    aiExplainFetch(text, sentence)
      .then(r => {
        if (selPopupEl !== el) return;
        exEl.textContent = (r.phonetic ? r.phonetic + "\n" : "") + r.explain;
        exEl.dataset.done = "1";
        el.dataset.phonetic = r.phonetic;
        el.dataset.explain = r.explain;
      })
      .catch(() => { if (selPopupEl === el) exEl.textContent = "（解释加载失败，可在「生词库」页重试）"; });
  } else {
    exEl.textContent = "加入后可在「生词库」页点 AI 解释（先在「记录」页配置接口）";
  }
  el.querySelector("#selAdd").addEventListener("click", () => {
    const entry = addVocab(text, sentence);
    if (exEl.dataset.done === "1") {
      entry.phonetic = el.dataset.phonetic || "";
      entry.explain = el.dataset.explain || exEl.textContent.trim();
    }
    save();
    hideSelPopup();
    if (window.getSelection) window.getSelection().removeAllRanges();
    toast("已加入生词库 ✓");
  });
}
function sentenceOf(passage, word) {
  const norm = s => s.toLowerCase().replace(/[^a-z]/g, "");
  const parts = passage.match(/[^.!?]+[.!?]+(?:\s+|$)/g) || [passage];
  const hit = parts.find(s => norm(s).includes(norm(word)));
  return (hit || passage).trim();
}

