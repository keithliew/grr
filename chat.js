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
      hello: "Hi! I'm GRR Malaysia's automated assistant. What would you like to know?",
      chips: ["See our properties", "Tell me about GRR programmes"],
      generic: "I want to know more about guaranteed rental return (GRR) programmes.",
      listIntro: "We list three properties. Which one would you like to know about?",
      about: "Tell me about ",
      placeholder: "Type your question…", send: "Send", close: "Close chat", open: "Book a Free Briefing",
      formTitle: "Book a free briefing", date: "Preferred date", time: "Preferred time", loc: "Where would you like to meet?", choose: "Choose…", slots: ["Morning (10am – 12pm)", "Afternoon (12pm – 3pm)"], locs: ["Kuala Lumpur", "Port Dickson (Lexis Hibiscus 2)", "Video call"], badDate: "Please choose a date.", badTime: "Please choose a time.", badLoc: "Please choose where to meet.", confirm: "We confirm the time and place on WhatsApp within 1 working day.",
      name: "Your name", phone: "WhatsApp number", phoneHint: "+60 12 345 6789",
      consent: "By sending, you agree that GRR Malaysia may contact you on WhatsApp about these properties and share your details with the developer and licensed agency for the property you choose. This chat is sent with your details. See our", privacy: "privacy notice",
      submit: "Send my details", leave: "Leave my number", wa: "WhatsApp us instead",
      thanks: "Thank you! Our team will reply on WhatsApp within 1 working day (10am to 3pm daily). Want to start now?",
      waNow: "Message us on WhatsApp", badPhone: "Please enter a WhatsApp number we can reach.", badName: "Please enter your name.",
      sendFail: "Sorry, that didn't send. Please try again, or WhatsApp us.", typing: "Typing…", limit: "Thanks for chatting! For anything else, leave your number or WhatsApp our team.",
      note: "General information only, not financial advice.",
    },
    zh: {
      title: "GRR Malaysia", sub: "自动助手 · 团队随后跟进",
      hello: "您好！我是GRR Malaysia的自动助手。请问您想了解什么？",
      chips: ["查看我们的房产", "了解GRR保证租金计划"],
      generic: "我想进一步了解保证租金回报（GRR）计划。",
      listIntro: "我们共有三个房产。您想了解哪一个？",
      about: "请介绍一下",
      placeholder: "请输入您的问题…", send: "发送", close: "关闭聊天", open: "预约免费说明会",
      formTitle: "预约免费说明会", date: "首选日期", time: "首选时间", loc: "希望在哪里见面？", choose: "请选择…", slots: ["上午（10点 – 12点）", "下午（12点 – 3点）"], locs: ["吉隆坡", "波德申（Lexis Hibiscus 2）", "视频通话"], badDate: "请选择日期。", badTime: "请选择时间。", badLoc: "请选择见面地点。", confirm: "我们会在1个工作日内通过WhatsApp确认时间和地点。",
      name: "您的姓名", phone: "WhatsApp号码", phoneHint: "+60 12 345 6789",
      consent: "提交即表示您同意GRR Malaysia通过WhatsApp就这些房产与您联系，并将您的资料提供给您所选房产的发展商和持牌代理。本次聊天记录会随您的资料一并发送。详见", privacy: "隐私声明",
      submit: "提交我的资料", leave: "留下我的号码", wa: "改用WhatsApp联系",
      thanks: "谢谢！我们的团队会在1个工作日内通过WhatsApp回复您（每天上午10点至下午3点）。想现在就开始吗？",
      waNow: "通过WhatsApp联系我们", badPhone: "请输入可联系的WhatsApp号码。", badName: "请输入您的姓名。",
      sendFail: "抱歉，提交失败。请重试，或通过WhatsApp联系我们。", typing: "正在输入…", limit: "感谢您的咨询！如有其他问题，请留下号码或通过WhatsApp联系我们的团队。",
      note: "仅为一般信息，并非理财建议。",
    },
    "zh-tw": {
      title: "GRR Malaysia", sub: "自動助理 · 團隊隨後跟進",
      hello: "您好！我是GRR Malaysia的自動助理。請問您想了解什麼？",
      chips: ["查看我們的物業", "了解GRR保證租金計劃"],
      generic: "我想進一步了解保證租金回報（GRR）計劃。",
      listIntro: "我們共有三個物業。您想了解哪一個？",
      about: "請介紹一下",
      placeholder: "請輸入您的問題…", send: "傳送", close: "關閉聊天", open: "預約免費說明會",
      formTitle: "預約免費說明會", date: "首選日期", time: "首選時間", loc: "希望在哪裡見面？", choose: "請選擇…", slots: ["上午（10點 – 12點）", "下午（12點 – 3點）"], locs: ["吉隆坡", "波德申（Lexis Hibiscus 2）", "視訊通話"], badDate: "請選擇日期。", badTime: "請選擇時間。", badLoc: "請選擇見面地點。", confirm: "我們會在1個工作天內透過WhatsApp確認時間和地點。",
      name: "您的姓名", phone: "WhatsApp號碼", phoneHint: "+60 12 345 6789",
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
    "@media (max-width:767px){.grc-bubble{padding:11px 16px;font-size:13.5px}}" +
    ".grc-panel{display:none;flex-direction:column;width:370px;max-width:calc(100vw - 32px);height:560px;max-height:calc(100vh - 32px);background:#fff;border-radius:16px;box-shadow:0 18px 48px rgba(0,0,0,.28);overflow:hidden}" +
    ".grc-root.is-open .grc-panel{display:flex}" +
    "@media (max-width:767px){.grc-root.is-open{inset:0;right:0;bottom:0}.grc-root.is-open .grc-panel{width:100%;max-width:none;height:100%;max-height:none;border-radius:0}}" +
    ".grc-head{display:flex;align-items:center;gap:10px;background:#142A3B;color:#fff;padding:12px 14px}" +
    ".grc-head b{display:block;font-size:15px}.grc-head small{display:block;font-size:11.5px;color:#9FBFC9}" +
    ".grc-x{margin-left:auto;background:none;border:0;color:#fff;font-size:26px;line-height:1;width:44px;height:44px;cursor:pointer}" +
    ".grc-log{position:relative;flex:1;overflow-y:auto;padding:14px;background:#F7F3EB;-webkit-overflow-scrolling:touch}" +
    ".grc-msg{max-width:85%;margin:0 0 10px;padding:9px 12px;border-radius:14px;font-size:14.5px;line-height:1.45;white-space:pre-wrap;word-wrap:break-word}" +
    ".grc-bot{background:#fff;border-bottom-left-radius:4px}.grc-me{background:#142A3B;color:#fff;margin-left:auto;border-bottom-right-radius:4px}" +
    ".grc-typing{color:#6b7280;font-style:italic;font-size:13px;margin:0 0 10px}" +
    ".grc-chips{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 10px}" +
    ".grc-chip{background:#fff;border:1px solid #9FBFC9;color:#142A3B;border-radius:999px;padding:8px 12px;font-size:13.5px;cursor:pointer;min-height:36px}" +
    ".grc-form{background:#fff;border:1px solid #9FBFC9;border-radius:12px;padding:12px;margin:4px 0 10px;font-size:13.5px}" +
    ".grc-form b{display:block;margin-bottom:8px}.grc-form label{display:block;margin:6px 0 2px;font-weight:600;font-size:12.5px}" +
    ".grc-form input,.grc-form select{width:100%;box-sizing:border-box;border:1px solid #d6cfc0;border-radius:8px;padding:10px;font-size:16px}" +
    ".grc-form p{font-size:11.5px;color:#4b5563;margin:8px 0}.grc-form a{color:#142A3B;text-decoration:underline}" +
    ".grc-err{color:#b42318;font-size:12.5px;margin-top:4px;min-height:1px}" +
    ".grc-btn{display:block;width:100%;background:#E2604B;color:#fff;border:0;border-radius:999px;padding:11px;font-weight:700;font-size:14.5px;cursor:pointer;text-align:center;text-decoration:none;box-sizing:border-box}" +
    ".grc-cb{margin:4px 0 10px}" +
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
    // No typing box on GRR (Keith, 18 Nov 2026): visitors pick from the buttons, then the booking form opens
    foot.appendChild(links); foot.appendChild(make("div", "grc-note", T.note));
    panel.appendChild(head); panel.appendChild(log); panel.appendChild(foot);
    root.appendChild(bubble); root.appendChild(panel); document.body.appendChild(root);
    el = { root: root, log: log, input: input, send: send };
    render();
  }

  var PROPERTIES = ["Lexis Hibiscus 2", "Royal Lexis", "Residensi Platinum"];
  var listShown = false;
  function chip(box, label, fn) { var b = make("button", "grc-chip", label); b.type = "button"; b.addEventListener("click", fn); box.appendChild(b); }

  function render() {
    el.log.textContent = "";
    el.log.appendChild(make("div", "grc-msg grc-bot", T.hello));
    {
      var chips = make("div", "grc-chips");
      // 1. "See our properties" lists the three, each a button that asks about that one. 2. The GRR programme in general.
      chip(chips, T.chips[0], function () { listShown = true; render(); });
      chip(chips, T.chips[1], function () { ask(T.generic); });
      el.log.appendChild(chips);
      if (listShown) {
        el.log.appendChild(make("div", "grc-msg grc-bot", T.listIntro));
        var props = make("div", "grc-chips");
        PROPERTIES.forEach(function (name) { chip(props, name, function () { ask(T.about + name); }); });
        el.log.appendChild(props);
      }
    }
    var lastBot = null;
    state.messages.forEach(function (m) {
      var n = make("div", "grc-msg " + (m.role === "user" ? "grc-me" : "grc-bot"), m.content);
      el.log.appendChild(n);
      if (m.role === "assistant") lastBot = n;
    });
    var card = null;
    if (state.lead) card = el.log.appendChild(thanksCard());
    else if (state.formOpen) card = el.log.appendChild(formCard());
    else if (state.formShown) el.log.appendChild(callBackButton());
    // Show the start of the newest answer (or the opened form), not the bottom of the chat
    var target = focusForm && card ? card : lastBot;
    focusForm = false;
    if (target && state.messages.length) el.log.scrollTop = Math.max(0, target.offsetTop - 8); else scroll();
  }
  var focusForm = false;
  function callBackButton() {
    var b = make("button", "grc-btn grc-cb", T.formTitle); b.type = "button";
    b.addEventListener("click", function () { showForm(); });
    return b;
  }
  function scroll() { el.log.scrollTop = el.log.scrollHeight; }

  function userTurns() { return state.messages.filter(function (m) { return m.role === "user"; }).length; }

  function ask(text) {
    text = (text || "").trim();
    if (!text || busy) return;
    if (userTurns() >= MAX_USER) { state.messages.push({ role: "user", content: text }, { role: "assistant", content: T.limit }); state.formShown = !state.lead; state.formOpen = !state.lead; focusForm = true; save(); render(); el.input.value = ""; return; }
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
        if (!state.lead) { state.formShown = true; state.formOpen = true; }
        save(); render();
      });
  }

  function formCard() {
    var f = make("form", "grc-form"); f.noValidate = true;
    f.appendChild(make("b", null, T.formTitle));
    var ln = make("label", null, T.name); var n = make("input"); n.name = "name"; n.autocomplete = "name"; n.required = true; ln.htmlFor = n.id = "grc-name";
    var lp = make("label", null, T.phone); var p = make("input"); p.name = "whatsapp_number"; p.type = "tel"; p.inputMode = "tel"; p.autocomplete = "tel"; p.placeholder = T.phoneHint; lp.htmlFor = p.id = "grc-phone";
    var ld = make("label", null, T.date); var d = make("input"); d.type = "date"; d.name = "preferred_date"; d.min = dayAfter(); ld.htmlFor = d.id = "grc-date";
    var lt = make("label", null, T.time); var t = picker("preferred_time", T.slots); lt.htmlFor = t.id = "grc-time";
    var ll = make("label", null, T.loc); var l = picker("location", T.locs); ll.htmlFor = l.id = "grc-loc";
    var err = make("div", "grc-err");
    var c = make("p", null, T.consent + " "); var a = make("a", null, T.privacy); a.href = PRIVACY; a.target = "_blank"; c.appendChild(a); c.appendChild(document.createTextNode("."));
    var b = make("button", "grc-btn", T.submit); b.type = "submit";
    var note = make("p", null, T.confirm);
    [ln, n, lp, p, ld, d, lt, t, ll, l, err, note, c, b].forEach(function (x) { f.appendChild(x); });
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!n.value.trim()) { err.textContent = T.badName; n.focus(); return; }
      if (p.value.replace(/\D/g, "").length < 7) { err.textContent = T.badPhone; p.focus(); return; }
      if (!d.value) { err.textContent = T.badDate; d.focus(); return; }
      if (!t.value) { err.textContent = T.badTime; t.focus(); return; }
      if (!l.value) { err.textContent = T.badLoc; l.focus(); return; }
      err.textContent = ""; b.disabled = true;
      sendLead(n.value.trim(), p.value.trim(), { preferred_date: d.value, preferred_time: t.value, location: l.value }).then(function (ok) {
        if (!ok) { b.disabled = false; err.textContent = T.sendFail; return; }
        state.lead = true; save();
        push("chat_lead", { chat_ref: cfg.ref, chat_lang: lang, chat_property: state.property });
        focusForm = true; render();
      });
    });
    return f;
  }

  function thanksCard() {
    var d = make("div", "grc-form"); d.appendChild(make("div", null, T.thanks));
    var a = make("a", "grc-btn grc-wa", T.waNow); a.href = waLink(); a.target = "_blank"; a.rel = "noopener noreferrer"; a.addEventListener("click", waClick);
    d.appendChild(a); return d;
  }

  function dayAfter() { return new Date(Date.now() + 864e5).toLocaleDateString("en-CA", { timeZone: "Asia/Kuala_Lumpur" }); }
  // The inbox always gets the English wording, whatever language the visitor chose
  var EN = { preferred_time: ["Morning (10am – 12pm)", "Afternoon (12pm – 3pm)"], location: ["Kuala Lumpur", "Port Dickson (Lexis Hibiscus 2)", "Video call"] };
  function picker(name, options) {
    var sel = make("select"); sel.name = name;
    [T.choose].concat(options).forEach(function (o, i) { var op = make("option", null, o); op.value = i ? EN[name][i - 1] : ""; sel.appendChild(op); });
    return sel;
  }

  function sendLead(name, phone, booking) {
    var utm = {};
    var transcript = state.messages.map(function (m) { return (m.role === "user" ? "Visitor: " : "Assistant: ") + m.content; }).join("\n\n");
    var body = {
      access_key: FORM_KEY, subject: "Chat booking " + booking.preferred_date + " from grrmalaysia.com (Ref " + cfg.ref + "-CHAT)", from_name: "grrmalaysia.com chat",
      name: name, whatsapp_number: phone, preferred_date: booking.preferred_date, preferred_time: booking.preferred_time, location: booking.location, ref: cfg.ref + "-CHAT", language: lang, page: location.pathname,
      property: state.property, lp_variant: "chat", transcript: transcript || "(no messages, details left straight away)",
      botcheck: "",
    };
    return fetch("https://api.web3forms.com/submit", { method: "POST", headers: { "content-type": "application/json", accept: "application/json" }, body: JSON.stringify(body) })
      .then(function (r) { return r.json(); }).then(function (d) { return !!(d && d.success); }).catch(function () { return false; });
  }

  function showForm() { if (!state.lead) { state.formShown = true; state.formOpen = true; focusForm = true; save(); render(); var n = el.log.querySelector("input"); if (n && window.matchMedia("(min-width: 768px)").matches) n.focus(); } }
  function waClick() { /* tracking.js sends whatsapp_click for wa.me links */ }

  function open(source) {
    el.root.classList.add("is-open");
    push("chat_open", { chat_source: source || "float", chat_ref: cfg.ref, chat_lang: lang });
    render(); // positions the view on the newest answer now that the panel is visible
    if (window.matchMedia("(min-width: 768px)").matches) el.input.focus();
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
