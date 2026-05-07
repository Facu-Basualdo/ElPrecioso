# El Precioso 🇦🇷

Landing page editorial premium para **El Precioso**, emprendimiento argentino de escarapelas y prendedores patrios artesanales para el 18 y 25 de Mayo.

Hecho a mano en Chaco, Argentina.

---

## 🎨 Stack

- **HTML + CSS + JavaScript vanilla** (sin frameworks, sin dependencias)
- **Google Fonts**: Fraunces (headlines) + Inter (body)
- **Video hero** con ping-pong loop infinito sin saltos
- **Tilt 3D sutil** en cards del catálogo
- **Marquee infinito** en sección de destacados
- **Lightbox modal** compartido para visualización de productos

---

## 📁 Estructura del proyecto

```
el-precioso/
├── index.html              ← Archivo principal (todo inline)
├── public/
│   ├── bandera-web.webm    ← Video hero (formato moderno, ~3MB)
│   ├── bandera-web.mp4     ← Video hero fallback
│   ├── hero-poster.jpg     ← Frame inicial del video
│   ├── favicon.svg
│   └── catalogo/
│       ├── escarapela-01.jpg
│       ├── escarapela-02.jpg
│       ├── ...
│       └── escarapela-12.jpg
└── README.md
```

---

## 🚀 Deploy en Vercel (recomendado)

### Opción 1 — Desde la CLI

1. Instalá Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Posicionate en la carpeta del proyecto:
   ```bash
   cd el-precioso
   ```
3. Ejecutá:
   ```bash
   vercel
   ```
4. Seguí las instrucciones interactivas. En la primera vez te va a pedir login (se abre el navegador).
5. Confirmá las opciones por defecto. Vercel detecta proyecto estático automáticamente.
6. Listo, te da la URL en menos de 30 segundos.

### Opción 2 — Desde GitHub (recomendada para iterar)

1. Creá un repo en GitHub y pusheá tu proyecto.
2. Andá a https://vercel.com/new
3. Importá el repo, dejá todas las opciones por defecto.
4. Click en "Deploy".
5. Cada push a `main` redeployea automáticamente.

### Opción 3 — Drag & Drop

1. Andá a https://vercel.com/new
2. Arrastrá la carpeta `el-precioso` directo al navegador.
3. Listo.


## ⚙️ Optimizaciones aplicadas

### Performance
- Lazy loading nativo en todas las imágenes del catálogo
- Video hero con `preload="auto"` y `+faststart`
- WebM como formato primario (30-40% más liviano que MP4)
- Pausa automática del video cuando el usuario scrollea fuera del hero
- `will-change: transform` en cards con tilt 3D para usar GPU
- Google Fonts con `display=swap` para evitar FOIT

### Accesibilidad
- Alt text descriptivo en todas las imágenes
- `aria-labels` en botones interactivos
- Contraste WCAG AA mínimo en todos los textos
- `focus-visible` en elementos interactivos
- Respeto a `prefers-reduced-motion` (deshabilita tilt, ping-pong, fade-ins)
- Navegación por teclado en lightbox (ESC, ←, →)

### SEO
- Open Graph tags para previews en WhatsApp y redes
- Meta description editorial
- Estructura semántica con `<section>`, `<header>`, `<footer>`

---

## 🛠️ Tareas pendientes / Ideas a futuro

- [ ] Reemplazar foto placeholder de "Sobre Nosotros" por foto real
- [ ] Sumar Google Analytics o Plausible
- [ ] Configurar dominio custom (elprecioso.com.ar o similar)
- [ ] A/B test del CTA del hero ("Ver catálogo" vs "Conocé los modelos")
- [ ] Sumar schema.org para producto local
- [ ] Versión en otros idiomas si se exporta

---

## 📝 Mantenimiento del catálogo

Para sumar productos nuevos:

1. Optimizá la imagen a WebP con calidad 80, máximo 1200px de lado largo:
   ```bash
   ffmpeg -i nueva-foto.jpg -vf "scale='min(1200,iw)':-1" -q:v 80 public/catalogo/escarapela-13.webp
   ```

   O usá TinyPNG (https://tinypng.com) para drag & drop sin instalar nada.

2. Nombrá el archivo descriptivamente: `escarapela-clasica-13.webp`, no `IMG_4823.webp`.

3. Sumá el `<img>` correspondiente al grid del catálogo en `index.html`.

4. Si la querés también en destacados, sumala al `.marquee-track` (las primeras 6-8).

---

## 🎨 Design tokens

| Color | Hex | Uso |
|-------|-----|-----|
| Azul noche | `#0E1B2C` | Texto principal, fondos profundos |
| Celeste bandera | `#74ACDF` | Acento patrio puntual |
| Dorado sol | `#FCBF49` | Acento cálido, CTAs |
| Marfil | `#F7F5F0` | Background principal |
| Gris niebla | `#9CA3AF` | Texto secundario |

| Tipografía | Familia | Uso |
|------------|---------|-----|
| Fraunces | Serif editorial | Headlines |
| Inter | Sans-serif | Body, UI |

---

## 📞 Contacto

**El Precioso** · Resistencia, Chaco
Instagram: [@elprecioso.ok](https://instagram.com/elprecioso.ok)

---

## 📄 Licencia

Código del sitio: uso personal del emprendimiento.
Imágenes y branding: © El Precioso 2026. Todos los derechos reservados.