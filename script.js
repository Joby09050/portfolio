(() => {
  const $ = (s) => document.querySelector(s);
  const menu = $('#menu'), burger = $('#burger');
  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open'); burger.setAttribute('aria-expanded', false);
  }));

  // Highlight current section in nav
  const links = [...menu.querySelectorAll('a')];
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.hash === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section').forEach(s => io.observe(s));

  $('#year').textContent = new Date().getFullYear();

  // Photo lightbox
  const lb = $('#lightbox'), lbImg = lb.querySelector('img');
  document.querySelectorAll('.gallery button').forEach(b => b.addEventListener('click', () => {
    const i = b.querySelector('img'); lbImg.src = i.src; lbImg.alt = i.alt; lb.hidden = false;
  }));
  lb.addEventListener('click', () => lb.hidden = true);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') lb.hidden = true; });

  // GitHub stats (public API, no key needed)
  const user = 'Joby09050', colors = ['#3b82f6', '#8b5cf6', '#38bdf8', '#a78bfa', '#6366f1', '#60a5fa'];
  const fail = () => { $('#ghNote').hidden = false; };
  fetch(`https://api.github.com/users/${user}`).then(r => r.ok ? r.json() : Promise.reject()).then(u => {
    $('#sRepos').textContent = u.public_repos;
    $('#sFollowers').textContent = u.followers;
    $('#sSince').textContent = new Date(u.created_at).getFullYear();
  }).catch(fail);
  fetch(`https://api.github.com/users/${user}/repos?per_page=100`).then(r => r.ok ? r.json() : Promise.reject()).then(repos => {
    $('#sStars').textContent = repos.reduce((n, r) => n + r.stargazers_count, 0);
    const count = {};
    repos.forEach(r => { if (r.language) count[r.language] = (count[r.language] || 0) + 1; });
    const total = Object.values(count).reduce((a, b) => a + b, 0) || 1;
    Object.entries(count).sort((a, b) => b[1] - a[1]).slice(0, 6).forEach(([lang, n], i) => {
      const pct = Math.round(n / total * 100);
      const seg = document.createElement('span');
      seg.style.cssText = `width:${pct}%;background:${colors[i]}`; seg.title = `${lang} ${pct}%`;
      $('#langBar').appendChild(seg);
      const li = document.createElement('li');
      li.innerHTML = `<i style="background:${colors[i]}"></i>${lang} ${pct}%`;
      $('#langLegend').appendChild(li);
    });
  }).catch(fail);
})();
