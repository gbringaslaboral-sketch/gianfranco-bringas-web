(() => {
  const qs = new URLSearchParams(location.search);
  if (qs.has('static')) document.documentElement.classList.add('static');
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const track = (...a) => { if (typeof window.fbq === 'function') window.fbq(...a); };

  /* honest status from his real hours (Lima) */
  const bar = $('.bar'), st = $('#st');
  const h = +new Date().toLocaleString('en-US', { timeZone: 'America/Lima', hour: 'numeric', hour12: false }) % 24;
  const open = h >= 8 && h < 22;
  bar.classList.toggle('open', open);
  if (st) st.innerHTML = open ? '<span class="l">responde hoy hasta las 10 p. m.</span><span class="s">responde hasta 10 p. m.</span>'
                              : '<span class="l">responde desde las 8 a. m.</span><span class="s">responde desde 8 a. m.</span>';

  /* ← back: if you came from the site, go back in history (keeps your place); otherwise open the home */
  let fromSite = false;
  try { fromSite = new URL(document.referrer).origin === location.origin; } catch {}
  $$('[data-back]').forEach(a => a.addEventListener('click', e => {
    if (!fromSite || history.length < 2) return;
    e.preventDefault(); history.back();
  }));

  /* Meta Pixel: WhatsApp or phone link = Contact (same as the previous site) */
  document.addEventListener('click', e => { if (e.target.closest?.('a[href*="wa.me/"], a[href^="tel:"]')) track('track', 'Contact'); }, true);
})();
