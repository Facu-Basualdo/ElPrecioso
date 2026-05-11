/* ───────────────────────────────────────────────
   DATA
   ─────────────────────────────────────────────── */
/* Para agregar o quitar imágenes, edita estas listas de nombres de archivo.
   El orden de la lista define el orden en que aparecen.
   - CATALOG_FILES  → archivos dentro de public/catalogo/
   - INGRESOS_FILES → archivos dentro de public/ingresos/  */
const CATALOG_FILES = [
  '1.jpeg', '2.jpeg', '3.jpeg', '4.jpeg', '5.jpeg', '6.jpeg', '7.jpeg', '8.jpeg', '9.jpeg', '10.jpeg',
  '11.jpeg', '12.jpeg', '13.jpeg', '14.jpeg', '15.jpeg', '16.jpeg', '17.jpeg', '18.jpeg', '19.jpeg', '20.jpeg',
  '21.jpeg', '22.jpeg', '23.jpeg', '24.jpeg', '25.jpeg', '26.jpeg', '27.jpeg', '28.jpeg', '29.jpeg', '30.jpeg',
  '31.jpeg', '32.jpeg', '33.jpeg', '34.jpeg', '35.jpeg', '36.jpeg', '37.jpeg', '38.jpeg', '39.jpeg', '40.jpeg',
  '41.jpeg', '42.jpeg', '43.jpeg', '44.jpeg',
  '45.jpg', '46.jpg', '47.jpg', '48.jpg', '49.jpg', '50.jpg', '51.jpg', '52.jpg', '53.jpg', '54.jpg', '55.jpg', '56.jpg',
  '57.jpeg', '58.jpeg', '59.jpeg', '60.jpeg', '61.jpeg', '62.jpeg',
  '63.jpg', '64.jpg', '65.jpg', '66.jpg', '67.jpg', '68.jpg', '69.jpg', '70.jpg', '71.jpg', '72.jpg', '73.jpg', '74.jpg', '75.jpg', '76.jpg', '77.jpg', '78.jpg'
];

const INGRESOS_FILES = [
  '63.jpg', '64.jpg', '65.jpg', '66.jpg', '67.jpg', '68.jpg', '69.jpg', '70.jpg', '71.jpg', '72.jpg', '73.jpg', '74.jpg', '75.jpg', '76.jpg', '77.jpg', '78.jpg'
];

const fileNum = (f) => f.replace(/\.[^.]+$/, '');

const CATALOG = CATALOG_FILES.map((f) => ({
  src: `public/catalogo/${f}`,
  alt: `Escarapela artesanal modelo ${fileNum(f)} de El Precioso`,
  name: `Modelo Nº${fileNum(f)}`
}));

const INGRESOS = INGRESOS_FILES.map((f) => ({
  src: `public/ingresos/${f}`,
  alt: `Nuevo ingreso modelo ${fileNum(f)} de El Precioso`,
  name: `Nuevo Nº${fileNum(f)}`
}));

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ───────────────────────────────────────────────
   NAV scroll state
   ─────────────────────────────────────────────── */
const nav = document.getElementById('nav');
const onScroll = () => {
  if (window.scrollY > 40) nav.classList.add('is-scrolled');
  else nav.classList.remove('is-scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ───────────────────────────────────────────────
   NAV hamburger (mobile)
   ─────────────────────────────────────────────── */
const navBurger = document.getElementById('nav-burger');
const navLinks  = document.getElementById('nav-links');

navBurger.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  navBurger.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    navBurger.setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('click', (e) => {
  if (!nav.contains(e.target)) {
    nav.classList.remove('is-open');
    navBurger.setAttribute('aria-expanded', 'false');
  }
});

/* ───────────────────────────────────────────────
   HERO video — viewport pause
   ─────────────────────────────────────────────── */
const heroVideo = document.getElementById('hero-video');
const hero = document.getElementById('hero');

const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      heroVideo.play().catch(() => {});
    } else {
      heroVideo.pause();
    }
  });
}, { threshold: 0.1 });
heroObserver.observe(hero);

if (reduceMotion) {
  heroVideo.pause();
  heroVideo.currentTime = 0;
}

/* ───────────────────────────────────────────────
   MARQUEE (Destacados) — populate + duplicate
   ─────────────────────────────────────────────── */
const marqueeTrack = document.getElementById('marquee-track');
marqueeTrack.innerHTML = INGRESOS.map((it, i) => `
  <button class="marquee-item" data-idx="${i}" aria-label="Ver ${it.name}">
    <img src="${it.src}" alt="${it.alt}" loading="lazy">
  </button>
`).join('');
// duplicate for seamless loop
marqueeTrack.innerHTML += marqueeTrack.innerHTML;

/* ───────────────────────────────────────────────
   CATÁLOGO — paginado con "Ver más"
   ─────────────────────────────────────────────── */
const catalogGrid = document.getElementById('catalog-grid');
const PAGE_SIZE = 12;
let catalogOffset = 0;

const isCoarse = window.matchMedia('(pointer: coarse)').matches;

function attachTilt(card) {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -6;
    const rotateY = ((x - cx) / cx) * 6;
    card.style.transform =
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    card.style.boxShadow =
      `${-rotateY * 2}px ${rotateX * 2}px 30px rgba(14, 27, 44, 0.12)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    card.style.boxShadow = '0 4px 12px rgba(14, 27, 44, 0.06)';
  });
}

const loadMoreBtn = document.createElement('button');
loadMoreBtn.className = 'catalog-load-more';
loadMoreBtn.textContent = 'Ver más';
catalogGrid.insertAdjacentElement('afterend', loadMoreBtn);

function appendCatalogPage() {
  const end = Math.min(catalogOffset + PAGE_SIZE, CATALOG.length);
  for (let i = catalogOffset; i < end; i++) {
    const it = CATALOG[i];
    const card = document.createElement('button');
    card.className = 'catalog-card';
    card.dataset.idx = i;
    card.setAttribute('aria-label', `Ver ${it.name}`);
    card.innerHTML = `<img src="${it.src}" alt="${it.alt}" loading="lazy"><div class="card-meta">${it.name}</div>`;
    catalogGrid.appendChild(card);
    if (!isCoarse && !reduceMotion) attachTilt(card);
  }
  catalogOffset = end;
  if (catalogOffset >= CATALOG.length) loadMoreBtn.style.display = 'none';
}

loadMoreBtn.addEventListener('click', appendCatalogPage);
appendCatalogPage();

/* ───────────────────────────────────────────────
   LIGHTBOX
   ─────────────────────────────────────────────── */
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbCounter = document.getElementById('lb-counter');
const lbClose = document.getElementById('lb-close');
const lbPrev = document.getElementById('lb-prev');
const lbNext = document.getElementById('lb-next');

let currentImageIndex = 0;
let allImages = [];

function openLightbox(images, startIndex) {
  allImages = images;
  currentImageIndex = startIndex;
  updateLightbox();
  lb.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lb.classList.remove('is-open');
  document.body.style.overflow = '';
}
function updateLightbox() {
  const it = allImages[currentImageIndex];
  lbImg.style.opacity = '0';
  setTimeout(() => {
    lbImg.src = it.src;
    lbImg.alt = it.alt;
    lbImg.onload = () => { lbImg.style.opacity = '1'; };
    lbCounter.textContent =
      String(currentImageIndex + 1).padStart(2, '0') + ' / ' +
      String(allImages.length).padStart(2, '0');
  }, 120);
}
function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % allImages.length;
  updateLightbox();
}
function prevImage() {
  currentImageIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
  updateLightbox();
}

lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', prevImage);
lbNext.addEventListener('click', nextImage);
lb.addEventListener('click', (e) => {
  if (e.target === lb) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (!lb.classList.contains('is-open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') nextImage();
  if (e.key === 'ArrowLeft') prevImage();
});

// Catálogo — event delegation (cubre tarjetas cargadas en cualquier página)
catalogGrid.addEventListener('click', (e) => {
  const card = e.target.closest('.catalog-card');
  if (card) openLightbox(CATALOG, parseInt(card.dataset.idx, 10));
});
marqueeTrack.querySelectorAll('.marquee-item').forEach(item => {
  item.addEventListener('click', () => {
    openLightbox(INGRESOS, parseInt(item.dataset.idx, 10) % INGRESOS.length);
  });
});

/* ───────────────────────────────────────────────
   TESTIMONIALS auto-carousel
   ─────────────────────────────────────────────── */
const testiTrack = document.getElementById('testi-track');
const testiCards = Array.from(testiTrack.querySelectorAll('.testi-card'));
const testiDots = Array.from(document.querySelectorAll('.testi-dot'));
let testiIdx = 0;
let testiPaused = false;

function cardScrollPos(card) {
  return card.getBoundingClientRect().left - testiTrack.getBoundingClientRect().left + testiTrack.scrollLeft;
}
function testiGoTo(idx, smooth = true) {
  testiIdx = idx;
  const padLeft = parseFloat(getComputedStyle(testiTrack).paddingLeft) || 0;
  testiTrack.scrollTo({ left: Math.max(0, cardScrollPos(testiCards[idx]) - padLeft), behavior: smooth ? 'smooth' : 'instant' });
  testiDots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
}
function testiNext() {
  testiIdx >= testiCards.length - 1 ? testiGoTo(0, false) : testiGoTo(testiIdx + 1);
}

testiTrack.addEventListener('scroll', () => {
  let closest = 0, minDist = Infinity;
  testiCards.forEach((card, i) => {
    const dist = Math.abs(card.getBoundingClientRect().left - testiTrack.getBoundingClientRect().left);
    if (dist < minDist) { minDist = dist; closest = i; }
  });
  if (closest !== testiIdx) {
    testiIdx = closest;
    testiDots.forEach((d, i) => d.classList.toggle('is-active', i === closest));
  }
}, { passive: true });

testiTrack.addEventListener('mouseenter', () => { testiPaused = true; });
testiTrack.addEventListener('mouseleave', () => { testiPaused = false; });
testiTrack.addEventListener('touchstart', () => { testiPaused = true; }, { passive: true });
testiTrack.addEventListener('touchend', () => { setTimeout(() => { testiPaused = false; }, 2500); }, { passive: true });
testiDots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    testiPaused = true;
    testiGoTo(i);
    setTimeout(() => { testiPaused = false; }, 3000);
  });
});

if (!reduceMotion) setInterval(testiNext, 4500);

/* ───────────────────────────────────────────────
   REVEAL on scroll
   ─────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
