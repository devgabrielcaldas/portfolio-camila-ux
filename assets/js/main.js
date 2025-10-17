// ====== NAV MOBILE ======
const toggle = document.querySelector('.nav__toggle');
const menu = document.querySelector('#menu');

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

// ====== FILTRO DO PORTFÓLIO ======
const filterButtons = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.portfolio-card');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    filterButtons.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');

    cards.forEach(card => {
      const cats = (card.dataset.category || '').split(',');
      const show = filter === 'all' || cats.includes(filter);
      card.style.display = show ? '' : 'none';
    });
  });
});

// ====== OFFSET DO HEADER FIXO ======
function adjustBodyOffset() {
  const header = document.querySelector('.header');
  if (!header) return;
  document.body.style.paddingTop = header.offsetHeight + 'px';
}
window.addEventListener('load', adjustBodyOffset);
window.addEventListener('resize', adjustBodyOffset);

// ====== ENVIO VIA FORMSPREE (ÚNICO SUBMIT LISTENER) ======
const contactForm = document.getElementById('contact-form');
const feedbackText = document.querySelector('.form-feedback');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    feedbackText.textContent = 'Enviando mensagem...';

    // opcional: desabilita o botão enquanto envia
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        feedbackText.textContent = '✅ Mensagem enviada com sucesso!';
        contactForm.reset();
      } else {
        feedbackText.textContent = '❌ Ocorreu um erro ao enviar. Tente novamente.';
      }
    } catch {
      feedbackText.textContent = '❌ Falha de conexão. Verifique sua internet.';
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      setTimeout(() => feedbackText.textContent = '', 5000);
    }
  });
}

// ====== Fade-in do HERO ao carregar ======
window.addEventListener('load', () => {
  document.querySelectorAll('.hero__photo.reveal, .hero__text.reveal')
    .forEach((el, i) => {
      // pequeno atraso para um efeito mais suave e encadeado
      el.style.transitionDelay = (i * 120) + 'ms';
      requestAnimationFrame(() => el.classList.add('is-visible'));
    });
});

// ====== Reveal dos CARDS do portfólio ao rolar ======
const cardsToReveal = document.querySelectorAll('.portfolio-card');
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 }); // 15% do card visível já anima

// marca todos os cards como reveal, com leve "stagger"
cardsToReveal.forEach((card, i) => {
  card.classList.add('reveal');
  card.style.transitionDelay = (i % 3) * 100 + 'ms'; // escadinha por coluna
  io.observe(card);
});
