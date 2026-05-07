Construí una landing page premium editorial para "El Precioso", un emprendimiento argentino que vende escarapelas y prendedores patrios artesanales para el 18 y 25 de Mayo.

Salida: un solo archivo HTML autosuficiente con CSS y JS inline, listo para deployar.

═══════════════════════════════════════════════════════════════
ASSETS ADJUNTADOS
═══════════════════════════════════════════════════════════════

1. /public/bandera-web.webm — Video 8s, 16:9, sin audio, bandera argentina flameando. Es el video del hero.

2. /public/bandera-web.mp4 — Mismo video en MP4 como fallback para navegadores que no soportan WebM.

3. /public/hero-poster.jpg — Frame inicial del video, usar como atributo `poster` para evitar flash negro mientras carga.

4. /public/catalogo/escarapela-01.jpg … escarapela-12.jpg — 12 imágenes del catálogo principal. Las primeras 6-8 también se usan en la sección de Destacados.

═══════════════════════════════════════════════════════════════
DESIGN SYSTEM
═══════════════════════════════════════════════════════════════

PALETA:
- #0E1B2C — Azul noche (texto principal, fondos profundos)
- #74ACDF — Celeste bandera (acento patrio, uso muy puntual)
- #FCBF49 — Dorado sol (acento cálido premium)
- #F7F5F0 — Marfil (background principal)
- #9CA3AF — Gris niebla (texto secundario)

TIPOGRAFÍA (Google Fonts con display=swap):
- Headlines: Fraunces, peso 400-500, tracking ajustado (-0.02em)
- Body y UI: Inter, peso 400-600

TONO VISUAL:
Editorial premium minimalista. Mucho aire blanco/marfil. Tipografía grande en headlines. Acentos de celeste y dorado solo puntuales, nunca saturando. Mobile-first. Transiciones suaves (300-500ms ease-out). Scroll-driven fade-in sutil en cada sección al entrar al viewport.

═══════════════════════════════════════════════════════════════
ESTRUCTURA — 10 SECCIONES VERTICALES
═══════════════════════════════════════════════════════════════

─── 1. NAVBAR ───
Sticky, fondo marfil con backdrop-filter blur al hacer scroll. Logo "El Precioso" en Fraunces a la izquierda. Links a la derecha en Inter: Catálogo, Sobre Nosotros, Contacto. Hover sutil con color dorado.

─── 2. HERO ───
100vh, video de bandera de fondo con overlay oscuro gradiente.

Implementación específica:

```html
<section id="hero">
  <video id="hero-video" autoplay muted playsInline poster="/public/hero-poster.jpg" aria-hidden="true">
    <source src="/public/bandera-web.webm" type="video/webm">
    <source src="/public/bandera-web.mp4" type="video/mp4">
  </video>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <p class="hero-eyebrow">EL PRECIOSO</p>
    <h1>Llevá la patria,<br>cerca del corazón.</h1>
    <p class="hero-subtext">Escarapelas y prendedores artesanales para el 18 y 25 de Mayo. Hechos con tiempo, pensados para durar.</p>
    <a href="#catalogo" class="hero-cta">Ver catálogo</a>
  </div>
  <div class="hero-scroll-indicator" aria-hidden="true"><span></span></div>
</section>
```

CSS clave:
- #hero-video: position absolute, inset 0, object-fit cover, z-index 0.
- .hero-overlay: linear-gradient(135deg, rgba(14,27,44,0.65) 0%, rgba(14,27,44,0.35) 60%, rgba(14,27,44,0.55) 100%). Z-index 1. Asimétrico a propósito — más oscuro donde va el texto.
- #hero::after: gradiente vertical de 140px en el bottom, de transparent a #F7F5F0. Z-index 2. Funde el video al fondo del catálogo.
- .hero-content: z-index 3, flex column centered, max-width 1280px, padding lateral 48px (24px en mobile).
- .hero-eyebrow: Inter 13px, letter-spacing 0.2em, color #FCBF49, uppercase.
- h1: Fraunces, font-size clamp(48px, 7vw, 96px), line-height 1.05, color marfil, max-width 14ch.
- .hero-subtext: Inter clamp(16px, 1.2vw, 18px), max-width 520px, color rgba(247,245,240,0.85).
- .hero-cta: outline marfil, padding 16px 36px, border-radius 2px. Hover: background y border #FCBF49, color #0E1B2C.
- .hero-scroll-indicator: línea vertical 1px x 60px en bottom 48px, con barra animada cayendo (keyframe scrollHint 2.5s loop).

JavaScript del hero (ping-pong loop + pausa al salir del viewport):

```javascript
const heroVideo = document.getElementById('hero-video');
const hero = document.getElementById('hero');
let playingForward = true;
let reverseInterval = null;

heroVideo.addEventListener('ended', playReverse);

function playReverse() {
  playingForward = false;
  const fps = 30;
  const step = 1 / fps;
  let currentTime = heroVideo.duration;
  reverseInterval = setInterval(() => {
    currentTime -= step;
    if (currentTime <= 0) {
      clearInterval(reverseInterval);
      reverseInterval = null;
      heroVideo.currentTime = 0;
      playingForward = true;
      heroVideo.play().catch(() => {});
    } else {
      heroVideo.currentTime = currentTime;
    }
  }, 1000 / fps);
}

const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (heroVideo.paused && !reverseInterval) heroVideo.play().catch(() => {});
    } else {
      heroVideo.pause();
      if (reverseInterval) {
        clearInterval(reverseInterval);
        reverseInterval = null;
        heroVideo.currentTime = 0;
        playingForward = true;
      }
    }
  });
}, { threshold: 0.1 });
heroObserver.observe(hero);

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  heroVideo.removeEventListener('ended', playReverse);
  heroVideo.loop = true;
}
```

CRÍTICO: La bandera flameando empieza y termina en posiciones distintas, por eso ping-pong (reproducir al derecho → al revés → al derecho). NO usar `loop` simple, corta feo. El reverse manual con setInterval es necesario porque playbackRate=-1 no funciona en Safari ni Firefox.

─── 3. PROBLEMA ───
Sección de respiro post-hero. Background marfil sólido. Copy editorial centrado, max-width 600px, padding vertical 120px.
Texto: "Cada Mayo, la misma escarapela apurada. La de siempre, la del kiosco, la que se rompe antes de llegar al acto."
Tipografía: Fraunces, italic, font-size clamp(24px, 3vw, 36px), line-height 1.4, color #0E1B2C.

─── 4. SOLUCIÓN — 3 BENEFICIOS ───
Grid de 3 columnas (1 col en mobile). Cada beneficio: ícono lineal sutil en dorado (SVG inline, 32px, stroke-width 1.5), título en Fraunces, body en Inter. Padding generoso entre cards (gap 64px).

1. Hechas a mano — Cada pieza es ensamblada una por una, no salen de una máquina.
2. Materiales que aguantan — Cintas, broches y detalles pensados para usarse muchas veces.
3. Diseños únicos — Modelos que no vas a encontrar en otro lado.

─── 5. DESTACADOS / ÚLTIMOS INGRESOS — Carrusel marquee infinito ───

Eyebrow text: "ÚLTIMOS INGRESOS" en Inter uppercase tracking ancho color gris niebla.
Headline: "Recién salidos de la mesa de trabajo" en Fraunces, alineado a la izquierda.

Carrusel: auto-scroll horizontal infinito velocidad lenta meditativa (~40s loop completo). 5 imágenes visibles desktop estilo galería chico-medio, 3 tablet, 2 mobile. SIN flechas, SIN dots — movimiento continuo.

CSS:
```css
.marquee-wrapper {
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%);
  padding: 40px 0;
}
.marquee-track {
  display: flex;
  gap: 24px;
  width: max-content;
  animation: marquee 40s linear infinite;
}
.marquee-track:hover { animation-play-state: paused; }
.marquee-item {
  flex-shrink: 0;
  width: 220px;
  aspect-ratio: 4/5;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
}
.marquee-item img { width: 100%; height: 100%; object-fit: cover; }
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
```

JavaScript: duplicar nodos en JS al cargar para hacer el loop sin saltos:
```javascript
const track = document.querySelector('.marquee-track');
track.innerHTML += track.innerHTML;
```

CRÍTICO: el mask-image lateral genera fade en los bordes (productos aparecen y desaparecen con elegancia). NO simplificar. Click en cualquier imagen abre el lightbox compartido.

─── 6. CATÁLOGO COMPLETO ───
Headline: "Toda la colección 2026" en Fraunces.
Grid 3-col responsivo (2 col tablet, 1 col mobile) con las 12 imágenes de /public/catalogo/. Border-radius 4px, gap 32px.

CADA CARD CON TILT 3D SUTIL (solo desktop, NO en mobile):

CSS:
```css
.catalog-card {
  transition: transform 400ms ease-out, box-shadow 400ms ease-out;
  transform-style: preserve-3d;
  will-change: transform;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(14, 27, 44, 0.06);
  cursor: pointer;
}
@media (pointer: coarse), (prefers-reduced-motion: reduce) {
  .catalog-card { transition: none; }
  .catalog-card:hover { transform: none !important; }
}
```

JavaScript:
```javascript
document.querySelectorAll('.catalog-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    card.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2}px 30px rgba(14, 27, 44, 0.12)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    card.style.boxShadow = '0 4px 12px rgba(14, 27, 44, 0.06)';
  });
});
```

CRÍTICO: rotación máxima 6 grados, no más. Más que eso se siente cheap. NO aplicar tilt al carrusel marquee — mezclar dos movimientos rompe el mood editorial.

Click en cualquier card abre el lightbox modal con la imagen en grande, navegación con flechas (← →), cierre con ESC o click fuera. Sin precios, sin "agregar al carrito" — visualización pura.

─── 7. SOBRE NOSOTROS ───
Layout 2 columnas en desktop (50/50): foto evocativa placeholder a la izquierda, texto editorial a la derecha. En mobile apilado.

Texto: "El Precioso nació en Chaco, en una mesa de comedor, cortando cintas para los actos del jardín. Hoy somos un emprendimiento familiar que sigue haciendo lo mismo, con más manos y más cuidado."

Tipografía: Fraunces para headline "Hecho con tiempo, en Chaco", Inter para body, line-height 1.7.

─── 8. TESTIMONIALS ───
Carrusel horizontal scrollable con CSS scroll-snap, 3 cards visibles desktop, 1 mobile. Cada card: quote en Fraunces italic clamp(20px, 2vw, 28px), nombre y ciudad en Inter 14px gris niebla, separador dorado fino (1px x 24px) entre quote y autor.

1. "Compré seis para toda la familia. Llegaron impecables y mi vieja casi llora." — Lucía M., Resistencia
2. "Las uso desde hace tres años y siguen como nuevas. Vale cada peso." — Martín D., Sáenz Peña
3. "Para el acto del jardín de mi hija. Le encantó a ella, le encantó a la maestra." — Carolina P., Charata

─── 9. CTA WHATSAPP ───
Sección de cierre. Background azul noche #0E1B2C, texto marfil. Padding vertical 120px.

Headline Fraunces grande: "¿Te gustó algún modelo?"
Subtext: "Escribinos por WhatsApp y coordinamos. Hacemos envíos a todo el país."
Botón WhatsApp: background dorado #FCBF49, texto azul noche, ícono SVG WhatsApp inline a la izquierda, padding 18px 40px, border-radius 2px. Link a wa.me con número placeholder.
Subtexto chico debajo: "Respondemos de Lun a Sáb, 9 a 19hs."

─── 10. FOOTER ───
Mínimo, marfil, una línea horizontal con border-top fino gris niebla.
Izquierda: "El Precioso · Hecho a mano en Chaco, Argentina"
Derecha: "@elprecioso.ok · 2026"
Inter 13px, padding vertical 32px.

═══════════════════════════════════════════════════════════════
LIGHTBOX MODAL (compartido entre Destacados y Catálogo)
═══════════════════════════════════════════════════════════════

Modal full-screen con backdrop oscuro rgba(14,27,44,0.92). Imagen centrada max-width 80vw max-height 85vh object-fit contain. Flechas izquierda/derecha en los bordes laterales para navegar. Botón X arriba a la derecha. Cierre por ESC, click en backdrop, o click en X.

```javascript
let currentImageIndex = 0;
let allImages = [];

function openLightbox(images, startIndex) {
  allImages = images;
  currentImageIndex = startIndex;
  // crear y mostrar modal
}

function closeLightbox() { /* cerrar modal */ }
function nextImage() { /* siguiente con wrap */ }
function prevImage() { /* anterior con wrap */ }

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') nextImage();
  if (e.key === 'ArrowLeft') prevImage();
});
```

═══════════════════════════════════════════════════════════════
DETALLES TÉCNICOS GLOBALES
═══════════════════════════════════════════════════════════════

- Mobile-first responsive. Breakpoints: 640, 768, 1024, 1280.
- Lazy loading nativo (`loading="lazy"`) en TODAS las imágenes excepto el hero-poster.
- Hero video: `preload="auto"`, `playsInline muted autoplay` (necesario para autoplay en iOS).
- Smooth scroll en navegación interna: `scroll-behavior: smooth` en html.
- Fade-in al entrar al viewport en cada sección con IntersectionObserver, transiciones 600ms ease-out.
- Accesibilidad: alt text descriptivo, aria-labels en botones interactivos, contraste WCAG AA mínimo, focus-visible en elementos interactivos.
- Respeto a `prefers-reduced-motion`: deshabilita tilt, ping-pong, fade-ins.
- NO usar bibliotecas de animación pesadas (no GSAP, no Framer Motion). CSS y JS vanilla alcanzan.
- Open Graph tags en el head para previews en WhatsApp y redes.
- Favicon placeholder con emoji escarapela o SVG inline.

═══════════════════════════════════════════════════════════════
PRINCIPIOS NO NEGOCIABLES
═══════════════════════════════════════════════════════════════

1. Espaciado generoso. Si dudás entre más o menos padding, siempre más.
2. La bandera flameando solo aparece en el hero. Cortar limpio al scrollear con el gradiente fade-out.
3. Acentos de celeste y dorado son acentos, no protagonistas. Si una sección tiene más de 5% de color saturado, está mal.
4. Mobile debe sentirse igual de premium que desktop. No es una versión "reducida", es la misma experiencia adaptada.
5. Sin emojis decorativos en UI. Íconos siempre SVG lineales sutiles.
6. Sin gradientes coloridos (excepto el overlay del hero). Backgrounds sólidos siempre.