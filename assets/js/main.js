/* Amirmohammad Hassaninezhad · Resume site scripts */
document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const main = document.getElementById('mainContent');
  const sections = document.querySelectorAll('[data-section]');
  const navBtns = document.querySelectorAll('[data-nav]');
  const isMobile = () => window.matchMedia('(max-width:1024px)').matches;

  // Navigation
  const setActive = id => navBtns.forEach(b => b.classList.toggle('active', b.dataset.nav === id));
  navBtns.forEach(btn => btn.addEventListener('click', () => {
    const t = document.querySelector(`[data-section="${btn.dataset.nav}"]`);
    if (t && main) main.scrollTo({ top: t.offsetTop, behavior: 'smooth' });
    closeSidebar();
  }));
  const bottomIds = [...document.querySelectorAll('.bottom-nav__btn')].map(b => b.dataset.nav);
  main.addEventListener('scroll', () => {
    const y = main.scrollTop + main.clientHeight * 0.35;
    let cur = 'home';
    sections.forEach(s => { if (s.offsetTop <= y) cur = s.dataset.section; });
    if (isMobile() && !bottomIds.includes(cur)) cur = ({heritage:'portfolio',publications:'portfolio'})[cur] || cur;
    setActive(cur);
  }, { passive: true });

  // Mobile sidebar
  const overlay = document.getElementById('sidebarOverlay');
  const sideM = document.getElementById('sidebarMobile');
  function closeSidebar(){ overlay.classList.remove('open'); sideM.classList.remove('open'); }
  document.getElementById('menuBtn').addEventListener('click', () => { overlay.classList.add('open'); sideM.classList.add('open'); });
  document.getElementById('closeSidebar').addEventListener('click', closeSidebar);
  overlay.addEventListener('click', closeSidebar);

  // Theme
  document.querySelectorAll('.theme-toggle').forEach(b => b.addEventListener('click', () => {
    const light = root.classList.toggle('light');
    try { localStorage.setItem('theme', light ? 'light' : 'dark'); } catch (e) {}
  }));

  // Reveal + skills
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    e.target.querySelectorAll('.skill__fill').forEach(f => f.style.width = f.dataset.level + '%');
    io.unobserve(e.target);
  }), { root: main, threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Lightbox
  const G = window.GALLERIES || {};
  const lb = document.getElementById('lightbox'), img = document.getElementById('lbImg');
  const title = document.getElementById('lbTitle'), counter = document.getElementById('lbCounter');
  let gal = null, idx = 0;
  const fa = n => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
  function show(i){
    const list = G[gal].images; idx = (i + list.length) % list.length;
    img.style.opacity = 0;
    const pre = new Image(); pre.onload = () => { img.src = pre.src; img.style.opacity = 1; }; pre.src = list[idx];
    title.textContent = G[gal].title; counter.textContent = `${fa(idx + 1)} از ${fa(list.length)}`;
    const single = list.length < 2;
    document.getElementById('lbPrev').style.display = document.getElementById('lbNext').style.display = single ? 'none' : '';
  }
  function open(g, i){ if (!G[g]) return; gal = g; show(i); lb.classList.add('open'); document.getElementById('lbClose').focus(); }
  function close(){ lb.classList.remove('open'); }
  document.querySelectorAll('[data-gallery]').forEach(el => el.addEventListener('click', e => {
    e.stopPropagation(); open(el.dataset.gallery, +el.dataset.index || 0);
  }));
  document.getElementById('lbClose').addEventListener('click', close);
  document.getElementById('lbNext').addEventListener('click', e => { e.stopPropagation(); show(idx + 1); });
  document.getElementById('lbPrev').addEventListener('click', e => { e.stopPropagation(); show(idx - 1); });
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(idx + 1);   // RTL: left = next
    if (e.key === 'ArrowRight') show(idx - 1);
  });
  let sx = null;
  lb.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
  lb.addEventListener('touchend', e => {
    if (sx === null) return; const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) show(dx > 0 ? idx + 1 : idx - 1); sx = null;
  });

  // Contact (opens the visitor's mail app; no data is sent elsewhere)
  document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target;
    const subject = f.subject.value || 'درخواست همکاری از طریق وب‌سایت';
    const body = `${f.message.value}\n\n— ${f.name.value}\n${f.contact.value}`;
    window.location.href = `mailto:${window.CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
});
