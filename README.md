# 📅 Planner 2026

![planner Preview](img/logo.svg)

**Planner de contenido anual para redes sociales — offline, multi-marca y sin dependencias de servidor.**

> Una PWA (Progressive Web App) que funciona 100% en el navegador. Sin bases de datos, sin cuentas, sin suscripciones. Todos los datos se guardan localmente en tu dispositivo.

---

## 📋 Tabla de contenidos

- [¿Qué es y para qué sirve?](#-qué-es-y-para-qué-sirve)
- [Características principales](#-características-principales)
- [Estructura de archivos](#-estructura-de-archivos)
- [Cómo instalar y usar](#-cómo-instalar-y-usar)
- [Personalización: Unidades](#-personalización-unidades)
- [Personalización: Formatos y sus colores](#-personalización-formatos-y-sus-colores)
- [Personalización: Redes sociales](#-personalización-redes-sociales)
- [Personalización: Logos en el header](#-personalización-logos-en-el-header)
- [Personalización: Colores globales](#-personalización-colores-globales)
- [Cómo funciona por dentro](#-cómo-funciona-por-dentro)
- [Exportación e importación de datos](#-exportación-e-importación-de-datos)
- [Instalación como app (PWA)](#-instalación-como-app-pwa)

---

## 🎯 ¿Qué es y para qué sirve?

El **Planner 2026** es una herramienta de planificación de contenido para creadores y equipos que gestionan **múltiples marcas o cuentas en redes sociales**. Permite:

- **Planificar con anticipación**: Ver todo el año 2026 en una sola pantalla, mes por mes.
- **Organizar por marcas**: Cada publicación puede asignarse a una *unidad* (marca, canal o proyecto).
- **Definir el tipo de contenido**: Cada slot tiene un *formato* (CapCut, Carrusel, Stream, etc.).
- **Registrar en qué redes se publica**: Instagram, TikTok, YouTube Shorts, YouTube, LinkedIn, X.
- **Guardar métricas**: Likes y alcance de cada publicación.
- **Añadir notas**: Comentarios libres por slot.
- **Buscar en todo el calendario**: Encontrá cualquier marca, formato o comentario al instante.
- **Exportar datos**: JSON (backup), CSV (para Excel/Sheets) y PDF (para compartir).

### ¿Qué es un "slot"?
Cada día puede tener uno o más *slots*. Un slot representa una publicación planificada: tiene hora, marca asignada, tipo de contenido, redes donde se publicará y métricas. Por defecto cada día abre con 5 slots vacíos.

---

## ✨ Características principales

| Característica | Descripción |
|---|---|
| 🗓️ Calendario anual | 12 meses visibles simultáneamente, semana empieza el lunes |
| 🎨 Código de colores | Los días sin contenido son grises; con 1-2 slots completos, amarillos; con 3+, verdes |
| 🔍 Búsqueda global | Filtra días por unidad, formato, red o comentario en tiempo real |
| 💾 Persistencia local | Datos guardados en `localStorage`, sin servidor |
| 📤 Export JSON | Backup completo de todos los datos |
| 📥 Import JSON | Restaurar backup o combinar planners |
| 📊 Export CSV | Para abrir en Excel, Google Sheets, etc. |
| 📄 Export PDF | Documento formateado con portada y detalle por día |
| 📸 Captura PNG | Screenshot del modal del día para compartir |
| 📱 PWA | Instalable como app en celular y desktop |
| 🌐 Offline | Funciona sin internet después de la primera carga |
| 📱 Responsive | Adaptado para celular, tablet y desktop |

---

## 📁 Estructura de archivos

```
planner-2026/
│
├── index.html        # Estructura HTML de la app
├── app.js            # Toda la lógica JavaScript
├── styles.css        # Estilos visuales
├── sw.js             # Service Worker (caché offline y PWA)
├── manifest.json     # Configuración de la PWA
│
└── img/              # (carpeta que deberás crear con tus propias imágenes)
    ├── favicon.svg
    ├── soymarcus.svg
    ├── lemora.svg
    ├── vidafreelance.svg
    ├── twitch.svg
    ├── holamundostore.svg
    ├── codeinjection.svg
    ├── gatonegro.svg
    └── awp.svg
```

---

## 🚀 Cómo instalar y usar

### Opción A — Abrir directo en el navegador
1. Cloná o descargá el repositorio
2. Abrí `index.html` en tu navegador (Chrome o Edge recomendados)
3. Listo. No requiere servidor ni instalación de dependencias.

> ⚠️ **Nota:** Para que la PWA y el Service Worker funcionen correctamente, es recomendable servirlo desde un servidor local o hosting. Podés usar [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) en VS Code o cualquier servidor estático.

### Opción B — Servidor local rápido (Node.js)
```bash
npx serve .
```

### Opción C — Servidor local rápido (Python)
```bash
python -m http.server 8080
```

---

## 🏷️ Personalización: Unidades

Las **unidades** son las marcas, canales o proyectos que gestionás. Aparecen como opciones en el selector "Unidad" de cada slot.

### Archivo: `app.js` — Líneas 26 a 29

```js
// ANTES (ejemplo original)
const unidades = [
  "Soy Marcus","Lemora","Hola Mundo Store","Vida Freelance",
  "Code Injection","Academia WP","Gato Negro", "Twitch"
];
```

**Para modificar**, reemplazá los nombres por los tuyos:

```js
// EJEMPLO personalizado
const unidades = [
  "Mi Marca Principal",
  "Canal de YouTube",
  "Proyecto Personal",
  "Cliente A",
  "Cliente B"
];
```

### Reglas:
- Podés poner **la cantidad que quieras** (más o menos de 8).
- Son **texto libre**: usá el nombre que quieras, con tildes y espacios.
- El primer elemento de la lista será el valor por defecto al abrir un nuevo slot.

---

## 🎨 Personalización: Formatos y sus colores

Los **formatos** son los tipos de contenido que producís. Cada formato tiene un **color de fondo** que colorea el selector en la tabla para identificarlos visualmente de un vistazo.

### Paso 1 — Cambiar la lista de formatos

**Archivo:** `app.js` — Líneas 31 a 35

```js
// ANTES (ejemplo original)
const formatos = [
  "CapCut","Carrusel","Memes","Stream",
  "Green Screen","Vlog","Selfie","Comentarios",
  "Trend", "Podcast", "Proyectos-IA", "Portfolio"
];
```

**Para modificar**, reemplazá los nombres:

```js
// EJEMPLO personalizado
const formatos = [
  "Reels",
  "Historia",
  "Foto",
  "Video Largo",
  "Directo",
  "Newsletter"
];
```

### Paso 2 — Asignar un color a cada formato

**Archivo:** `styles.css` — Buscar el bloque "FORMATO COLORS" (aproximadamente líneas 225 a 238)

La regla de nomenclatura para el nombre de la clase CSS es:

```
.format-{nombre_en_minúsculas_sin_espacios_ni_guiones}
```

**Ejemplos de cómo se genera el nombre de clase:**
| Nombre en `app.js` | Clase CSS generada |
|---|---|
| `"CapCut"` | `.format-capcut` |
| `"Green Screen"` | `.format-greenscreen` |
| `"Proyectos-IA"` | `.format-proyectos-ia` |
| `"Reels"` | `.format-reels` |

> **⚙️ Cómo se genera:** En `app.js` línea 320, la función `applyFormatColor` convierte el valor del formato a minúsculas y elimina espacios: `value.toLowerCase().replace(" ", "")`. Los guiones medios **sí se conservan**.

**Bloque de estilos a modificar en `styles.css`:**

```css
/* FORMATO COLORS (VERSIÓN LEGIBLE DARK MODE) */
.format-capcut       { background: #780000; color: #fff; }
.format-carrusel     { background: #023e8a; color: #fff; }
.format-memes        { background: #ffc600; color: #fff; }
.format-stream       { background: #7b2cbf; color: #fff; }
.format-greenscreen  { background: #2a9d8f; color: #fff; }
.format-vlog         { background: #bc6c25; color: #fff; }
.format-selfie       { background: #dd2d4a; color: #fff; }
.format-comentarios  { background: #4a4e69; color: #fff; }
.format-trend        { background: #e85d04; color: #fff; }
.format-podcast      { background: #004e89; color: #fff; }
.format-proyectos-ia { background: #d80032; color: #fff; }
.format-portfolio    { background: #3b28cc; color: #fff; }
```

**Para agregar un formato nuevo** (por ejemplo, `"Newsletter"`):

1. Agregar `"Newsletter"` al array `formatos` en `app.js`
2. Agregar en `styles.css`:
```css
.format-newsletter { background: #1a6b3a; color: #fff; }
```

**Para cambiar el color de un formato existente**, simplemente cambiá el valor hexadecimal de `background`.

### Paleta de colores sugerida para fondos oscuros:

| Color | Hex | Sugerido para |
|---|---|---|
| Rojo sangre | `#780000` | Contenido urgente o destacado |
| Azul marino | `#023e8a` | Contenido informativo |
| Amarillo | `#ffc600` | Contenido de humor/entretenimiento |
| Púrpura | `#7b2cbf` | Streaming / live |
| Verde agua | `#2a9d8f` | Tutoriales / how-to |
| Naranja tierra | `#bc6c25` | Vlogs / cotidiano |
| Rosa fuerte | `#dd2d4a` | Lifestyle / selfies |
| Gris azulado | `#4a4e69` | Interacción / comunidad |
| Naranja vibrante | `#e85d04` | Tendencias |
| Azul profundo | `#004e89` | Podcast / audio |

---

## 🌐 Personalización: Redes sociales

Las redes disponibles como checkbox en cada slot se definen en `app.js`.

### Archivo: `app.js` — Línea 37

```js
// ANTES
const redes = ["Instagram","TikTok","Shorts","YouTube","LinkedIn","X"];
```

**Para modificar:**
```js
// EJEMPLO personalizado
const redes = ["Instagram","TikTok","YouTube","Pinterest","Threads"];
```

### Cambiar el ícono de cada red

**Archivo:** `app.js` — Líneas 263 a 274

```js
function getIconClass(red) {
  const map = {
    "Instagram": "fa-brands fa-instagram",
    "TikTok":    "fa-brands fa-tiktok",
    "Shorts":    "fa-brands fa-square-youtube",
    "YouTube":   "fa-brands fa-youtube",
    "LinkedIn":  "fa-brands fa-linkedin",
    "X":         "fa-brands fa-x-twitter"
  };
  return map[red] || "fa-solid fa-circle";
}
```

Para agregar una nueva red, añadí una entrada al objeto `map` con la clase de [Font Awesome](https://fontawesome.com/icons?q=social&o=r&s=brands). Ejemplo para Threads:

```js
"Threads": "fa-brands fa-threads",
```

> Si una red no tiene entrada en el `map`, se mostrará un círculo genérico (`fa-solid fa-circle`).

---

## 🖼️ Personalización: Logos en el header

Los logos del encabezado son imágenes SVG (o cualquier formato) ubicadas en la carpeta `img/`.

### Archivo: `index.html` — Líneas 18 a 27

```html
<div class="logos-title">
  <img src="img/soymarcus.svg"      alt="Soy Marcus"  class="logo">
  <img src="img/lemora.svg"         alt="Lemora"       class="logo">
  <img src="img/vidafreelance.svg"  alt=""             class="logo">
  <img src="img/twitch.svg"         alt=""             class="logo">
  <img src="img/holamundostore.svg" alt=""             class="logo">
  <img src="img/codeinjection.svg"  alt=""             class="logo">
  <img src="img/gatonegro.svg"      alt=""             class="logo">
  <img src="img/awp.svg"            alt=""             class="logo">
</div>
```

**Para reemplazar los logos:**
1. Colocá tus imágenes en la carpeta `img/`
2. Modificá el `src` de cada `<img>` para que apunte a tu archivo
3. Actualizá el `alt` con el nombre de tu marca

**Para agregar un logo nuevo:**
```html
<img src="img/mi-marca.svg" alt="Mi Marca" class="logo">
```

**Para eliminar un logo**, simplemente borrá la línea `<img>` correspondiente.

### Tamaño de los logos:
El tamaño se define en `styles.css` — buscar `.logo`:

```css
.logo {
  width: 50px;   /* ← cambiá este valor */
  height: 50px;  /* ← cambiá este valor */
}
```

---

## 🎨 Personalización: Colores globales

Los colores principales de la app se definen como variables CSS al inicio de `styles.css` — Líneas 1 a 5:

```css
:root {
  --bg:     #0f1115;  /* Color de fondo general (negro azulado) */
  --card:   #1a1d24;  /* Color de las tarjetas/meses/modal */
  --text:   #e6e6e6;  /* Color del texto principal */
  --accent: #4f8cff;  /* Color de acento (azul) — botones, foco, badges */
}
```

**Para cambiar el tema de color**, modificá únicamente estas 4 variables y el resto de la app se actualiza automáticamente.

### Ejemplo: Tema verde oscuro

```css
:root {
  --bg:     #0d1410;
  --card:   #182219;
  --text:   #e0ece2;
  --accent: #3ec97a;
}
```

---

## ⚙️ Cómo funciona por dentro

### Flujo general

```
Usuario hace clic en un día
  → openDay(date)
    → renderTable(key)
      → Lee localStorage ("planner2026")
      → Construye filas con selectHTML() y checkboxHTML()
      → Aplica colores de formato con applyFormatColor()

Cualquier cambio en la tabla
  → saveRow(key)
    → Lee el DOM (selects, inputs, checkboxes, textarea)
    → Guarda el objeto actualizado en localStorage
    → Llama refreshCurrentDay() para actualizar el badge del día
```

### Almacenamiento

Todos los datos viven en `localStorage` bajo la clave `"planner2026"`. La estructura es:

```json
{
  "2026-01-05": [
    {
      "hora": "09:00",
      "unidad": "Soy Marcus",
      "formato": "Reels",
      "redes": ["Instagram", "TikTok"],
      "likes": "1200",
      "alcance": "8500",
      "comentarios": "Post sobre café de especialidad"
    }
  ],
  "2026-01-12": [ ... ]
}
```

Las claves son fechas en formato `YYYY-MM-DD`. Cada valor es un array de slots.

### Sistema de colores del calendario

Cada día del calendario evalúa sus slots para determinar su estado visual:

| Estado | Condición | Apariencia |
|---|---|---|
| Vacío | 0 slots completos | Gris neutro |
| Parcial | 1 o 2 slots completos | Fondo amarillo con borde dorado |
| Completo | 3 o más slots completos | Fondo verde con borde esmeralda |

Un slot se considera **completo** cuando tiene al menos: `unidad` + `formato` + al menos una red social seleccionada.

El número en la esquina superior derecha de cada día (badge) indica la cantidad de slots completos.

### Búsqueda global

La búsqueda recorre **todos los días guardados en localStorage** y compara el término ingresado contra: `unidad`, `formato`, `comentarios` y `redes`. Los días que coinciden se marcan con un outline azul animado; los que no, se atenúan. La búsqueda tiene un debounce de 200ms para no recalcular en cada tecla.

### Service Worker y modo offline

El archivo `sw.js` implementa una estrategia **cache-first**:

1. Al instalar la app, pre-cachea los archivos core (`index.html`, `app.js`, `styles.css`, `manifest.json`) y los assets de CDN (Font Awesome, html2canvas, jsPDF).
2. En cada request, primero busca en el caché; si no está, va a la red y guarda la respuesta.
3. Si no hay red y el usuario pide un documento HTML, sirve `index.html` desde caché.

Esto significa que **después de la primera visita, la app funciona completamente sin internet**.

---

## 💾 Exportación e importación de datos

### JSON (backup completo)
- **Exportar**: Descarga un archivo `.json` con todos los datos de todos los días.
- **Importar**: Al importar, si ya hay datos guardados, te pregunta si querés **reemplazar** (borra todo y carga el archivo) o **combinar** (el archivo importado pisa solo los días en conflicto, el resto se preserva).

### CSV
Exporta una tabla plana compatible con Excel o Google Sheets. Las redes de cada slot se separan con `|`. Incluye BOM para compatibilidad con Excel en Windows.

Columnas: `fecha, hora, unidad, formato, redes, likes, alcance, comentarios`

### PDF
Genera un PDF estructurado con:
- **Portada**: título, fecha de exportación y total de días con contenido
- **Una página por día**: con cada slot en una caja separada mostrando hora, unidad, formato, redes, métricas y primera línea de comentarios

### PNG (captura del modal)
El botón 📸 Capturar dentro del modal toma un screenshot de la tabla del día actual y lo descarga como `planner.png`.

---

## 📱 Instalación como app (PWA)

La app puede instalarse como aplicación nativa en cualquier dispositivo:

- **Android (Chrome)**: Aparece un banner de instalación automáticamente, o ir a Menú → "Añadir a pantalla de inicio"
- **iOS (Safari)**: Tocar el botón Compartir → "Añadir a pantalla de inicio"
- **Desktop (Chrome/Edge)**: Ícono de instalación en la barra de direcciones

Una vez instalada, se abre como una app nativa sin barra del navegador y funciona completamente offline.

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| HTML5 + CSS3 + JavaScript vanilla | Toda la app (sin frameworks) |
| `localStorage` | Persistencia de datos |
| Service Worker API | Caché offline y PWA |
| Web App Manifest | Instalación como app nativa |
| [Font Awesome 6.5](https://fontawesome.com/) | Íconos |
| [html2canvas 1.4.1](https://html2canvas.hertzen.com/) | Captura PNG |
| [jsPDF 2.5.1](https://github.com/parallax/jsPDF) | Exportación PDF |

---

## 📄 Licencia

Este proyecto es de código abierto. Podés usarlo, modificarlo y distribuirlo libremente. Si lo usás como base para algo propio, se agradece la mención al autor original.

---

*Planner 2026 — hecho con 🖤 para creadores de contenido*
