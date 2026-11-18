/* grrmalaysia.com chat window. Added to every page by functions/_middleware.js.
   WhatsApp buttons open this chat instead (the footer and the contact page keep a direct
   WhatsApp link). Answers come from /api/chat; the visitor's name and WhatsApp number go
   to the same Web3Forms inbox as the briefing form, with the conversation attached.
   Analytics events carry no message text or personal details. */
(function () {
  "use strict";
  if (window.GRRChat) return;
  var htmlLang = (document.documentElement.lang || "en").toLowerCase();
  var lang = htmlLang === "zh-tw" ? "zh-tw" : htmlLang.indexOf("zh") === 0 ? "zh" : "en";
  var PAGE_CODES = { "": "HOME", "royal-lexis": "RL", "residensi-platinum": "RP", "guaranteed-rental-return": "GUIDE", properties: "PROPS", contact: "CON", about: "ABT", opportunities: "OPP" };
  var slug = location.pathname.replace(/\.html$/, "").split("/").filter(Boolean).filter(function (p) { return p !== "zh" && p !== "zh-tw"; })[0] || "";
  var dl = (window.dataLayer = window.dataLayer || []);
  var cfg = {
    ref: "GRR-" + (PAGE_CODES[slug] || "OTH") + "-" + (lang === "en" ? "EN" : lang === "zh" ? "ZH" : "TW"),
    waNumber: "60122970362",
    waText: "Hi GRR Malaysia, I'd like to ask about your properties.",
    push: function (event, extra) { var p = { event: event }; for (var k in extra) p[k] = extra[k]; dl.push(p); },
  };
  var push = cfg.push;
  var FORM_KEY = "b3c8d2b7-e445-4355-acc5-186e6f77cc3e"; // public Web3Forms key, same as the briefing form
  var PRIVACY = "/contact";
  var STORE = "grr_chat_v1";
  var MAX_USER = 12;

  // TEXT START (visitor-facing text, scanned by tools/check_chat.py)
  var T = {
    en: {
      title: "GRR Malaysia", sub: "Automated assistant · our team follows up",
      hello: "Hi! I'm GRR Malaysia's automated assistant. I can explain how a guaranteed rental return works and tell you about our three properties: Lexis Hibiscus 2, Royal Lexis and Residensi Platinum. Which one interests you?",
      chips: ["How does a guaranteed rent work?", "Compare the three properties", "Is it safe?", "Book a free briefing"],
      placeholder: "Type your question…", send: "Send", close: "Close chat", open: "Ask us",
      formTitle: "Get a reply on WhatsApp", name: "Your name", phone: "WhatsApp number", phoneHint: "+60 12 345 6789",
      consent: "By sending, you agree that GRR Malaysia may contact you on WhatsApp about these properties and share your details with the developer and licensed agency for the property you choose. This chat is sent with your details. See our", privacy: "privacy notice",
      submit: "Send my details", leave: "Leave my number", wa: "WhatsApp us instead",
      thanks: "Thank you! Our team will reply on WhatsApp within 1 working day (10am to 3pm daily). Want to start now?",
      waNow: "Message us on WhatsApp", badPhone: "Please enter a WhatsApp number we can reach.", badName: "Please enter your name.",
      sendFail: "Sorry, that didn't send. Please try again, or WhatsApp us.", typing: "Typing…", limit: "Thanks for chatting! For anything else, leave your number or WhatsApp our team.",
      note: "General information only, not financial advice.",
    },
    zh: {
      title: "GRR Malaysia", sub: "自动助手 · 团队随后跟进",
      hello: "您好！我是GRR Malaysia的自动助手。我可以为您解释保证租金回报如何运作，并介绍我们的三个房产：Lexis Hibiscus 2、Royal Lexis 和 Residensi Platinum。您对哪一个感兴趣？",
      chips: ["保证租金如何运作？", "比较三个房产", "安全吗？", "预约免费说明会"],
      placeholder: "请输入您的问题…", send: "发送", close: "关闭聊天", open: "在线咨询",
      formTitle: "通过WhatsApp回复我", name: "您的姓名", phone: "WhatsApp号码", phoneHint: "+60 12 345 6789",
      consent: "提交即表示您同意GRR Malaysia通过WhatsApp就这些房产与您联系，并将您的资料提供给您所选房产的发展商和持牌代理。本次聊天记录会随您的资料一并发送。详见", privacy: "隐私声明",
      submit: "提交我的资料", leave: "留下我的号码", wa: "改用WhatsApp联系",
      thanks: "谢谢！我们的团队会在1个工作日内通过WhatsApp回复您（每天上午10点至下午3点）。想现在就开始吗？",
      waNow: "通过WhatsApp联系我们", badPhone: "请输入可联系的WhatsApp号码。", badName: "请输入您的姓名。",
      sendFail: "抱歉，提交失败。请重试，或通过WhatsApp联系我们。", typing: "正在输入…", limit: "感谢您的咨询！如有其他问题，请留下号码或通过WhatsApp联系我们的团队。",
      note: "仅为一般信息，并非理财建议。",
    },
    "zh-tw": {
      title: "GRR Malaysia", sub: "自動助理 · 團隊隨後跟進",
      hello: "您好！我是GRR Malaysia的自動助理。我可以為您解釋保證租金回報如何運作，並介紹我們的三個物業：Lexis Hibiscus 2、Royal Lexis 和 Residensi Platinum。您對哪一個有興趣？",
      chips: ["保證租金如何運作？", "比較三個物業", "安全嗎？", "預約免費說明會"],
      placeholder: "請輸入您的問題…", send: "傳送", close: "關閉聊天", open: "線上諮詢",
      formTitle: "透過WhatsApp回覆我", name: "您的姓名", phone: "WhatsApp號碼", phoneHint: "+60 12 345 6789",
      consent: "送出即表示您同意GRR Malaysia透過WhatsApp就這些物業與您聯絡，並將您的資料提供給您所選物業的發展商和持牌代理。本次聊天記錄會隨您的資料一併送出。詳見", privacy: "隱私聲明",
      submit: "送出我的資料", leave: "留下我的號碼", wa: "改用WhatsApp聯絡",
      thanks: "謝謝！我們的團隊會在1個工作天內透過WhatsApp回覆您（每天上午10點至下午3點）。想現在就開始嗎？",
      waNow: "透過WhatsApp聯絡我們", badPhone: "請輸入可聯絡的WhatsApp號碼。", badName: "請輸入您的姓名。",
      sendFail: "抱歉，送出失敗。請重試，或透過WhatsApp聯絡我們。", typing: "正在輸入…", limit: "感謝您的諮詢！如有其他問題，請留下號碼或透過WhatsApp聯絡我們的團隊。",
      note: "僅為一般資訊，並非理財建議。",
    },
  }[lang];
  // TEXT END

  var CSS =
    ".grc-root{position:fixed;z-index:9999;right:16px;bottom:16px;font-family:'IBM Plex Sans',Arial,sans-serif;color:#142A3B}" +
    ".grc-bubble{display:flex;align-items:center;gap:8px;background:#142A3B;color:#fff;border:0;border-radius:999px;padding:12px 18px;font-weight:600;font-size:14px;box-shadow:0 10px 24px rgba(0,0,0,.22);cursor:pointer}" +
    ".grc-bubble svg{flex:none}.grc-root.is-open .grc-bubble{display:none}" +
    "@media (max-width:767px){.grc-bubble span{display:none}.grc-bubble{width:58px;height:58px;padding:0;justify-content:center}}" +
    ".grc-panel{display:none;flex-direction:column;width:370px;max-width:calc(100vw - 32px);height:560px;max-height:calc(100vh - 32px);background:#fff;border-radius:16px;box-shadow:0 18px 48px rgba(0,0,0,.28);overflow:hidden}" +
    ".grc-root.is-open .grc-panel{display:flex}" +
    "@media (max-width:767px){.grc-root.is-open{inset:0;right:0;bottom:0}.grc-root.is-open .grc-panel{width:100%;max-width:none;height:100%;max-height:none;border-radius:0}}" +
    ".grc-head{display:flex;align-items:center;gap:10px;background:#142A3B;color:#fff;padding:12px 14px}" +
    ".grc-head b{display:block;font-size:15px}.grc-head small{display:block;font-size:11.5px;color:#9FBFC9}" +
    ".grc-x{margin-left:auto;background:none;border:0;color:#fff;font-size:26px;line-height:1;width:44px;height:44px;cursor:pointer}" +
    ".grc-log{flex:1;overflow-y:auto;padding:14px;background:#F7F3EB;-webkit-overflow-scrolling:touch}" +
    ".grc-msg{max-width:85%;margin:0 0 10px;padding:9px 12px;border-radius:14px;font-size:14.5px;line-height:1.45;white-space:pre-wrap;word-wrap:break-word}" +
    ".grc-bot{background:#fff;border-bottom-left-radius:4px}.grc-me{background:#142A3B;color:#fff;margin-left:auto;border-bottom-right-radius:4px}" +
    ".grc-typing{color:#6b7280;font-style:italic;font-size:13px;margin:0 0 10px}" +
    ".grc-chips{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 10px}" +
    ".grc-chip{background:#fff;border:1px solid #9FBFC9;color:#142A3B;border-radius:999px;padding:8px 12px;font-size:13.5px;cursor:pointer;min-height:36px}" +
    ".grc-form{background:#fff;border:1px solid #9FBFC9;border-radius:12px;padding:12px;margin:4px 0 10px;font-size:13.5px}" +
    ".grc-form b{display:block;margin-bottom:8px}.grc-form label{display:block;margin:6px 0 2px;font-weight:600;font-size:12.5px}" +
    ".grc-form input{width:100%;box-sizing:border-box;border:1px solid #d6cfc0;border-radius:8px;padding:10px;font-size:16px}" +
    ".grc-form p{font-size:11.5px;color:#4b5563;margin:8px 0}.grc-form a{color:#142A3B;text-decoration:underline}" +
    ".grc-err{color:#b42318;font-size:12.5px;margin-top:4px;min-height:1px}" +
    ".grc-btn{display:block;width:100%;background:#E2604B;color:#fff;border:0;border-radius:999px;padding:11px;font-weight:700;font-size:14.5px;cursor:pointer;text-align:center;text-decoration:none;box-sizing:border-box}" +
    ".grc-wa{background:#1fbf5c;color:#fff;margin-top:8px}" +
    ".grc-foot{border-top:1px solid #eee;padding:8px 10px;background:#fff}" +
    ".grc-row{display:flex;gap:8px}.grc-row textarea{flex:1;resize:none;border:1px solid #d6cfc0;border-radius:10px;padding:10px;font:inherit;font-size:16px;height:44px;max-height:110px}" +
    ".grc-send{background:#142A3B;color:#fff;border:0;border-radius:10px;padding:0 14px;font-weight:600;min-width:64px;cursor:pointer}.grc-send:disabled{opacity:.5}" +
    ".grc-links{display:flex;justify-content:space-between;gap:8px;margin-top:6px;font-size:12.5px}" +
    ".grc-links button,.grc-links a{background:none;border:0;color:#142A3B;text-decoration:underline;cursor:pointer;padding:6px 0;font:inherit;font-size:12.5px}" +
    ".grc-note{font-size:10.5px;color:#6b7280;margin-top:2px}";

  var CHAT_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

  var state = load() || { messages: [], property: "none", lead: false, started: false, formShown: false };
  var busy = false;
  var el = {};

  function load() { try { return JSON.parse(sessionStorage.getItem(STORE)); } catch (e) { return null; } }
  function save() { try { sessionStorage.setItem(STORE, JSON.stringify(state)); } catch (e) { /* storage blocked: chat still works on this page */ } }
  function make(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function waLink() { return "https://wa.me/" + cfg.waNumber + "?text=" + encodeURIComponent((cfg.waText || "Hi GRR Malaysia, I'd like to ask about your properties.") + " (Ref: " + cfg.ref + "-CHAT)"); }

  function build() {
    var style = make("style"); style.textContent = CSS; document.head.appendChild(style);
    var root = make("div", "grc-root"); root.setAttribute("data-nosnippet", "");
    var bubble = make("button", "grc-bubble"); bubble.type = "button"; bubble.innerHTML = CHAT_ICON; bubble.appendChild(make("span", null, T.open));
    bubble.addEventListener("click", function () { open("float"); });
    var panel = make("div", "grc-panel"); panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", T.title);
    var head = make("div", "grc-head"); var ht = make("div"); ht.appendChild(make("b", null, T.title)); ht.appendChild(make("small", null, T.sub)); head.appendChild(ht);
    var x = make("button", "grc-x", "×"); x.type = "button"; x.setAttribute("aria-label", T.close); x.addEventListener("click", close); head.appendChild(x);
    var log = make("div", "grc-log"); log.setAttribute("aria-live", "polite");
    var foot = make("div", "grc-foot"); var row = make("form", "grc-row");
    var input = make("textarea"); input.rows = 1; input.placeholder = T.placeholder; input.maxLength = 600; input.setAttribute("aria-label", T.placeholder);
    var send = make("button", "grc-send", T.send); send.type = "submit";
    row.appendChild(input); row.appendChild(send);
    row.addEventListener("submit", function (e) { e.preventDefault(); ask(input.value); });
    input.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(input.value); } });
    var links = make("div", "grc-links"); var leave = make("button", null, T.leave); leave.type = "button"; leave.addEventListener("click", function () { showForm(true); });
    var wa = make("a", null, T.wa); wa.href = waLink(); wa.target = "_blank"; wa.rel = "noopener noreferrer"; wa.addEventListener("click", waClick);
    links.appendChild(leave); links.appendChild(wa);
    foot.appendChild(row); foot.appendChild(links); foot.appendChild(make("div", "grc-note", T.note));
    panel.appendChild(head); panel.appendChild(log); panel.appendChild(foot);
    root.appendChild(bubble); root.appendChild(panel); document.body.appendChild(root);
    el = { root: root, log: log, input: input, send: send };
    render();
  }

  function render() {
    el.log.textContent = "";
    el.log.appendChild(make("div", "grc-msg grc-bot", T.hello));
    if (!state.messages.length) {
      var chips = make("div", "grc-chips");
      T.chips.forEach(function (c) { var b = make("button", "grc-chip", c); b.type = "button"; b.addEventListener("click", function () { ask(c); }); chips.appendChild(b); });
      el.log.appendChild(chips);
    }
    state.messages.forEach(function (m) { el.log.appendChild(make("div", "grc-msg " + (m.role === "user" ? "grc-me" : "grc-bot"), m.content)); });
    if (state.lead) el.log.appendChild(thanksCard());
    else if (state.formShown) el.log.appendChild(formCard());
    scroll();
  }
  function scroll() { el.log.scrollTop = el.log.scrollHeight; }

  function userTurns() { return state.messages.filter(function (m) { return m.role === "user"; }).length; }

  function ask(text) {
    text = (text || "").trim();
    if (!text || busy) return;
    if (userTurns() >= MAX_USER) { state.messages.push({ role: "user", content: text }, { role: "assistant", content: T.limit }); state.formShown = !state.lead; save(); render(); el.input.value = ""; return; }
    if (!state.started) { state.started = true; push("chat_start", { chat_ref: cfg.ref, chat_lang: lang }); }
    state.messages.push({ role: "user", content: text.slice(0, 600) });
    el.input.value = ""; save(); render();
    busy = true; el.send.disabled = true;
    var typing = make("div", "grc-typing", T.typing); el.log.appendChild(typing); scroll();
    fetch("/api/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ lang: lang, page: location.pathname, messages: state.messages }) })
      .then(function (r) { return r.json(); })
      .catch(function () { return { reply: T.sendFail, offer_contact: true }; })
      .then(function (d) {
        busy = false; el.send.disabled = false;
        state.messages.push({ role: "assistant", content: d.reply || T.sendFail });
        if (d.property && d.property !== "none") state.property = d.property;
        if (d.offer_contact && !state.lead) state.formShown = true;
        save(); render();
      });
  }

  function formCard() {
    var f = make("form", "grc-form"); f.noValidate = true;
    f.appendChild(make("b", null, T.formTitle));
    var ln = make("label", null, T.name); var n = make("input"); n.name = "name"; n.autocomplete = "name"; n.required = true; ln.htmlFor = n.id = "grc-name";
    var lp = make("label", null, T.phone); var p = make("input"); p.name = "whatsapp_number"; p.type = "tel"; p.inputMode = "tel"; p.autocomplete = "tel"; p.placeholder = T.phoneHint; lp.htmlFor = p.id = "grc-phone";
    var err = make("div", "grc-err");
    var c = make("p", null, T.consent + " "); var a = make("a", null, T.privacy); a.href = PRIVACY; a.target = "_blank"; c.appendChild(a); c.appendChild(document.createTextNode("."));
    var b = make("button", "grc-btn", T.submit); b.type = "submit";
    [ln, n, lp, p, err, c, b].forEach(function (x) { f.appendChild(x); });
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!n.value.trim()) { err.textContent = T.badName; n.focus(); return; }
      if (p.value.replace(/\D/g, "").length < 7) { err.textContent = T.badPhone; p.focus(); return; }
      err.textContent = ""; b.disabled = true;
      sendLead(n.value.trim(), p.value.trim()).then(function (ok) {
        if (!ok) { b.disabled = false; err.textContent = T.sendFail; return; }
        state.lead = true; save();
        push("chat_lead", { chat_ref: cfg.ref, chat_lang: lang, chat_property: state.property });
        render();
      });
    });
    return f;
  }

  function thanksCard() {
    var d = make("div", "grc-form"); d.appendChild(make("div", null, T.thanks));
    var a = make("a", "grc-btn grc-wa", T.waNow); a.href = waLink(); a.target = "_blank"; a.rel = "noopener noreferrer"; a.addEventListener("click", waClick);
    d.appendChild(a); return d;
  }

  function sendLead(name, phone) {
    var utm = {};
    var transcript = state.messages.map(function (m) { return (m.role === "user" ? "Visitor: " : "Assistant: ") + m.content; }).join("\n\n");
    var body = {
      access_key: FORM_KEY, subject: "Chat lead from grrmalaysia.com (Ref " + cfg.ref + "-CHAT)", from_name: "grrmalaysia.com chat",
      name: name, whatsapp_number: phone, ref: cfg.ref + "-CHAT", language: lang, page: location.pathname,
      property: state.property, lp_variant: "chat", transcript: transcript || "(no messages, details left straight away)",
      botcheck: "",
    };
    return fetch("https://api.web3forms.com/submit", { method: "POST", headers: { "content-type": "application/json", accept: "application/json" }, body: JSON.stringify(body) })
      .then(function (r) { return r.json(); }).then(function (d) { return !!(d && d.success); }).catch(function () { return false; });
  }

  function showForm() { if (!state.lead) { state.formShown = true; save(); render(); } }
  function waClick() { /* tracking.js sends whatsapp_click for wa.me links */ }

  function open(source) {
    el.root.classList.add("is-open");
    push("chat_open", { chat_source: source || "float", chat_ref: cfg.ref, chat_lang: lang });
    if (window.matchMedia("(min-width: 768px)").matches) el.input.focus();
    scroll();
  }
  function close() { el.root.classList.remove("is-open"); }

  // WhatsApp links open the chat, except the footer, the contact page's direct line and the chat's own links
  function takes(a) {
    return !!a && /wa\.me/.test(a.getAttribute("href") || "") && !a.closest("footer, #site-footer-container, [data-wa-direct], .grc-root");
  }
  function sourceOf(a) { return a.classList.contains("wa-float") ? "float" : (a.closest("section, header, main") || {}).id || "page"; }
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a") : null;
    if (!takes(a)) return;
    e.preventDefault();
    open(sourceOf(a));
  }, true);

  build();
  document.querySelectorAll(".wa-float").forEach(function (f) { f.style.display = "none"; });
  window.GRRChat = { open: open, takes: takes };
})();
