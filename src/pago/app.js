(() => {
  const qs = new URLSearchParams(location.search);
  const STATIC = qs.has('static') || matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (qs.has('static')) document.documentElement.classList.add('static');
  const DRY = qs.has('dry');
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const track = (...a) => { if (typeof window.fbq === 'function') window.fbq(...a); };
  const bar = $('.bar'), st = $('#st');

  /* honest status from his real hours (Lima) */
  const h = +new Date().toLocaleString('en-US', { timeZone: 'America/Lima', hour: 'numeric', hour12: false }) % 24;
  const open = h >= 8 && h < 22;
  bar.classList.toggle('open', open);
  st.innerHTML = open ? '<span class="l">responde hoy hasta las 10 p. m.</span><span class="s">responde hasta 10 p. m.</span>'
                      : '<span class="l">responde desde las 8 a. m.</span><span class="s">responde desde 8 a. m.</span>';

  /* messages pop in */
  const msgs = $$('.msg');
  if (STATIC || !('IntersectionObserver' in window)) msgs.forEach(m => m.classList.add('in'));
  else {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -4% 0px' });
    msgs.forEach((m, i) => i < 3 ? setTimeout(() => m.classList.add('in'), 150 + i * 220) : io.observe(m));
  }

  /* coming back from the calendar: /pago?cita=recibida (same behaviour and Pixel event as the old site) */
  const notice = $('[data-booking-notice]');
  if (notice && qs.get('cita') === 'recibida') {
    notice.hidden = false;
    try { if (!sessionStorage.getItem('fb-schedule-sent')) { track('track', 'Schedule'); sessionStorage.setItem('fb-schedule-sent', '1'); } }
    catch { track('track', 'Schedule'); }
  }

  /* method picker: the chosen method's bubble arrives */
  const opts = $$('.opt[data-m]'), methods = $$('.method');
  const pick = m => {
    opts.forEach(o => o.setAttribute('aria-checked', o.dataset.m === m));
    methods.forEach(b => {
      const on = b.dataset.for === m;
      b.hidden = !on;
      if (on) { b.classList.add('in'); b.classList.remove('swap'); void b.offsetWidth; b.classList.add('swap'); }
    });
  };
  opts.forEach(o => o.addEventListener('click', () => pick(o.dataset.m)));
  const keys = { yape: 'yape', tarjeta: 'card', paypal: 'card', soles: 'pen', dolares: 'usd' };
  if (keys[qs.get('metodo')]) pick(keys[qs.get('metodo')]);

  /* copy account numbers (clipboard, with a fallback that works without permissions) */
  const toast = $('#toast');
  let tt;
  const say = t => { toast.textContent = t; toast.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('on'), 1800); };
  $$('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    const v = b.dataset.copy;
    let ok = false;
    try { await navigator.clipboard.writeText(v); ok = true; } catch {
      const f = document.createElement('textarea'); f.value = v; f.setAttribute('readonly', ''); f.style.cssText = 'position:fixed;opacity:0';
      document.body.append(f); f.select(); try { ok = document.execCommand('copy'); } catch {} f.remove();
    }
    if (ok) { b.textContent = 'Copiado ✓'; b.classList.add('ok'); say(`Copiado: ${v}`); setTimeout(() => { b.textContent = 'Copiar'; b.classList.remove('ok'); }, 2000); }
    else say('Mantén pulsado el número para copiarlo');
  }));

  /* a question before paying → his WhatsApp */
  $('#ask').addEventListener('submit', e => {
    e.preventDefault();
    const d = (e.target.duda.value || '').trim();
    const txt = 'Hola, tengo una duda antes de pagar Escudia.' + (d ? `\n${d}` : '');
    const url = `https://wa.me/51992878215?text=${encodeURIComponent(txt)}`;
    track('track', 'Contact');
    if (DRY) { window.__lastWa = url; console.log('[dry]', url); return; }
    window.open(url, '_blank', 'noopener');
  });

  /* Meta Pixel: WhatsApp or phone link = Contact; PayPal click = InitiateCheckout */
  document.addEventListener('click', e => {
    if (e.target.closest?.('a[href*="wa.me/"], a[href^="tel:"]')) track('track', 'Contact');
    if (e.target.closest?.('a[href*="paypal.com"]')) track('track', 'InitiateCheckout', { value: 97, currency: 'USD' });
  }, true);
})();
