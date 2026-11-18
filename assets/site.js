/* samavik.com: a little plain JavaScript. The mode switch, the narrow-screen menu, one arrival per section, the contact form.
   Nothing here makes a request except the form's own POST to /api/contact. Storage is wrapped: blocked storage cannot break the page. */
(function () {
  'use strict';
  var root = document.documentElement;
  var KEY = 'samavik-mode';

  /* ---- Mode: evening by default, the choice remembered on this device ---- */
  var COLOURS = { evening: '#101113', day: '#f6f5f2' };
  function applyMode(m) {
    if (m === 'day') root.setAttribute('data-theme', 'day'); else root.removeAttribute('data-theme');
    var tc = document.querySelector('meta[name="theme-color"]'); if (tc) tc.setAttribute('content', COLOURS[m === 'day' ? 'day' : 'evening']);
    var cs = document.querySelector('meta[name="color-scheme"]'); if (cs) cs.setAttribute('content', m === 'day' ? 'light' : 'dark');
    var b = document.querySelector('.mode');
    if (b) b.setAttribute('aria-label', m === 'day' ? 'Switch to evening mode' : 'Switch to day mode');
    var rm = document.querySelector('.mode-row'); if (rm) rm.textContent = m === 'day' ? 'Switch to evening' : 'Switch to day';
  }
  var current = root.getAttribute('data-theme') === 'day' ? 'day' : 'evening';
  applyMode(current);
  var modeBtn = document.querySelector('.mode');
  if (modeBtn) modeBtn.addEventListener('click', function () {
    current = current === 'day' ? 'evening' : 'day';
    applyMode(current);
    try { localStorage.setItem(KEY, current); } catch (e) { /* storage blocked: the choice lasts for this visit only */ }
  });

  /* ---- Narrow-screen menu: a sheet that closes on Escape, keeps focus inside while open and returns it ---- */
  var menuBtn = document.querySelector('.menu-btn'), nav = document.getElementById('site-nav');
  if (menuBtn && nav) {
    var isOpen = function () { return nav.hasAttribute('data-open'); };
    var setMenu = function (open, giveBack) {
      if (open) nav.setAttribute('data-open', ''); else nav.removeAttribute('data-open');
      root.classList.toggle('menu-open', open); menuBtn.setAttribute('aria-expanded', String(open)); menuBtn.textContent = open ? 'Close' : 'Menu';
      if (open) { var first = nav.querySelector('a'); if (first) first.focus(); } else if (giveBack) menuBtn.focus();
    };
    menuBtn.addEventListener('click', function () { setMenu(!isOpen(), true); });
    nav.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a'); if (!a) return;
      setMenu(false, false);
      /* after a jump, focus goes to the destination's heading, so a keyboard or screen-reader user carries on from there */
      var id = (a.getAttribute('href') || '').split('#')[1], t = id && document.getElementById(id);
      var h = t && (t.querySelector('h1, h2') || t);
      if (h) { if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1'); setTimeout(function () { h.focus({ preventScroll: true }); }, 60); }
    });
    var rowMode = nav.querySelector('.mode-row'); if (rowMode && modeBtn) rowMode.addEventListener('click', function () { modeBtn.click(); });
    var wide = window.matchMedia ? window.matchMedia('(min-width: 981px)') : null;
    if (wide && wide.addEventListener) wide.addEventListener('change', function (e) { if (e.matches && isOpen()) setMenu(false, false); });
    document.addEventListener('keydown', function (e) {
      if (!isOpen()) return;
      if (e.key === 'Escape') { e.preventDefault(); setMenu(false, true); return; }
      if (e.key !== 'Tab') return;
      var items = [menuBtn].concat([].slice.call(nav.querySelectorAll('a, button')), modeBtn ? [modeBtn] : []).filter(function (el) { return el.offsetParent !== null; });
      var i = items.indexOf(document.activeElement);
      if (e.shiftKey && (i <= 0)) { e.preventDefault(); items[items.length - 1].focus(); }
      else if (!e.shiftKey && (i === items.length - 1 || i === -1)) { e.preventDefault(); items[0].focus(); }
    });
  }

  /* ---- One slow, slight arrival per section ---- */
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var arrivals = document.querySelectorAll('.arrive');
  if ('IntersectionObserver' in window && !still) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    arrivals.forEach(function (el) { io.observe(el); });
  } else { arrivals.forEach(function (el) { el.classList.add('in'); }); }

  /* ---- Contact form ---- */
  var form = document.getElementById('contact-form');
  if (!form) return;
  var LIMITS = { name: 200, email: 320, message: 5000 };
  var notice = document.getElementById('cf-notice'), liveEl = document.getElementById('cf-live'), btn = document.getElementById('cf-submit');
  var btnText = btn.querySelector('.t'), sentPanel = document.getElementById('cf-sent'), count = document.getElementById('cf-count');
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function field(name) { return form.elements[name]; }
  function setErr(name, msg) {
    var f = field(name), e = document.getElementById('cf-' + name + '-err');
    if (msg) { f.setAttribute('aria-invalid', 'true'); e.textContent = msg; e.hidden = false; }
    else { f.removeAttribute('aria-invalid'); e.textContent = ''; e.hidden = true; }
  }
  function clearAll() { ['name', 'email', 'message'].forEach(function (n) { setErr(n, ''); }); showNotice(''); }
  function showNotice(msg, head) {
    if (!msg) { notice.hidden = true; notice.innerHTML = ''; return; }
    notice.innerHTML = ''; var b = document.createElement('b'); b.textContent = head || 'Not sent'; notice.appendChild(b);
    notice.appendChild(document.createTextNode(msg)); notice.hidden = false;
  }
  function validate() {
    var bad = [];
    var v = { name: field('name').value.trim(), email: field('email').value.trim(), message: field('message').value.trim() };
    if (!v.name) { setErr('name', 'Please tell us your name.'); bad.push('name'); } else if (v.name.length > LIMITS.name) { setErr('name', 'That name is too long (200 characters at most).'); bad.push('name'); } else setErr('name', '');
    if (!v.email) { setErr('email', 'Please give an email address we can reply to.'); bad.push('email'); } else if (!EMAIL.test(v.email)) { setErr('email', 'That does not look like an email address. It should read name@company.com.'); bad.push('email'); } else if (v.email.length > LIMITS.email) { setErr('email', 'That address is too long.'); bad.push('email'); } else setErr('email', '');
    if (!v.message) { setErr('message', 'Two sentences is enough: what it is, and when you need it live.'); bad.push('message'); } else if (v.message.length > LIMITS.message) { setErr('message', 'That is over the 5,000 characters we can take in one message. Please shorten it, or email us instead.'); bad.push('message'); } else setErr('message', '');
    return { bad: bad, v: v };
  }
  var msgEl = field('message');
  function updateCount() { var n = msgEl.value.length; if (n > 4200) { count.hidden = false; count.textContent = n.toLocaleString('en-GB') + ' of 5,000 characters'; if (n > LIMITS.message) count.setAttribute('data-over', ''); else count.removeAttribute('data-over'); } else count.hidden = true; }
  msgEl.addEventListener('input', updateCount);
  ['name', 'email'].forEach(function (n) { field(n).addEventListener('input', function () { if (field(n).getAttribute('aria-invalid')) setErr(n, ''); }); });
  msgEl.addEventListener('input', function () { if (msgEl.getAttribute('aria-invalid') && msgEl.value.length <= LIMITS.message) setErr('message', ''); });

  function busy(on) { form.setAttribute('aria-busy', String(on)); btn.setAttribute('aria-disabled', String(on)); btnText.textContent = on ? 'Sending' : 'Send'; liveEl.textContent = on ? 'Sending your message.' : ''; ['name', 'email', 'message'].forEach(function (n) { field(n).readOnly = on; }); }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (btn.getAttribute('aria-disabled') === 'true') return;
    clearAll();
    var r = validate();
    if (r.bad.length) {
      showNotice(r.bad.length === 1 ? 'One thing needs a second look. Nothing you typed has been lost.' : 'A few things need a second look. Nothing you typed has been lost.', 'Check the form');
      field(r.bad[0]).focus(); return;
    }
    busy(true);
    var ctl = 'AbortController' in window ? new AbortController() : null;
    var timer = ctl ? setTimeout(function () { ctl.abort(); }, 20000) : null;
    fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(r.v), signal: ctl ? ctl.signal : undefined })
      .then(function (res) {
        if (res.ok) return { ok: true };
        return res.json().catch(function () { return {}; }).then(function (j) { return { ok: false, status: res.status, error: (j && j.error) || '' }; });
      })
      .catch(function () { return { ok: false, network: true }; })
      .then(function (out) {
        if (timer) clearTimeout(timer);
        busy(false);
        if (out.ok) {
          form.hidden = true; sentPanel.hidden = false; form.reset(); count.hidden = true;
          var h = sentPanel.querySelector('h3'); h.setAttribute('tabindex', '-1'); h.focus();
          return;
        }
        var mail = ' You can write to us directly at edward@samavik.com.';
        var err = out.error || '';
        if (out.network) { showNotice('We could not reach the server, so nothing was sent. Your message is still here: check your connection and try again.' + mail, 'No connection'); }
        else if (out.status === 400 && /required/i.test(err)) { showNotice('The form needs a name, an email address and a message. Your message is still here.', 'Not sent'); validate(); }
        else if (out.status === 400 && /email/i.test(err)) { setErr('email', 'That does not look like an email address. It should read name@company.com.'); showNotice('The email address was not accepted. Nothing you typed has been lost.', 'Not sent'); field('email').focus(); }
        else if (out.status === 400 && /long/i.test(err)) { showNotice('One of the fields is longer than we can take (name 200, email 320, message 5,000 characters). Please shorten it; nothing you typed has been lost.', 'Too long'); }
        else if (out.status === 405) { showNotice('The form could not be submitted from here. Your message is still here.' + mail, 'Not sent'); }
        else { showNotice('Something went wrong on our side, and your message was not sent. It is still here: try again in a moment.' + mail, 'Not sent'); }
        notice.setAttribute('tabindex', '-1'); notice.focus();
      });
  });
  var again = document.getElementById('cf-again');
  if (again) again.addEventListener('click', function () { sentPanel.hidden = true; form.hidden = false; liveEl.textContent = ''; field('name').focus(); });
})();
