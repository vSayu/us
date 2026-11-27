# Para ti · seis meses

La app está en `index.html` y se adapta a pantallas de teléfono. Los espacios de imagen muestran su ruta mientras no pongas el archivo. Guarda los recursos bajo `img/` junto a `index.html`.

## Estructura

- `index.html` — página única con todas las secciones
- `css/style.css` — estilos y animaciones (revelados, escritura, flotación, confeti de corazones, transición de pantalla)
- `js/config.js` — fechas, título de canción, artista, enlace a Spotify, letra sincronizada y datos de WhatsApp
- `js/app.js` — lógica de entrada, música, video, apariciones al scroll y escritura letra por letra

## Imágenes de las secciones

| Archivo en `img/` | Dónde aparece |
| --- | --- |
| `p0-banner.jpg` | Imagen principal de portada |
| `p0-izq.jpg` | Foto izquierda de portada |
| `p0-der.jpg` | Foto derecha de portada |
| `p0-spotify.png` | Sticker pequeño de portada |
| `p0-gatitos.png` | Sticker pequeño de portada |
| `gato-izq.png` | Gatito decorativo a la izquierda del título de portada |
| `gato-der.png` | Gatito decorativo a la derecha del título de portada |
| `p1-gatitos.png` | Ilustración de «Mi persona favorita» |
| `gato-pregunta.png` | Gato de la pregunta «¿Eres tú el amor de mi vida?» |
| `gato-nombre.png` | Gato de la pregunta por el nombre del amor de tu vida |
| `gato-triste.png` | Gato que aparece cuando la respuesta es incorrecta |
| `p2-banner.jpg` | Foto de la carta |
| `p2-pareja.png` | Ilustración junto a la carta |
| `p3-arriba.jpg` | Imagen superior de la disculpa |
| `p3-manos.png` | Sticker de la disculpa |
| `p3-abajo-izq.jpg` | Foto inferior izquierda de la disculpa |
| `p3-abajo-der.jpg` | Foto inferior derecha de la disculpa |
| `p3-guitarra.png` | Ilustración inferior de la disculpa |
| `p4-cancion.png` | Portada de la canción especial |
| `p5-foto.jpg` | Foto de «I love you» |
| `p5-sticker1.png` | Sticker izquierdo de «I love you» |
| `p5-sticker2.png` | Sticker derecho de «I love you» |
| `horimiya-poster.jpg` | Portada previa de la tarjeta del video (preview) |
| `horimiya-camera.jpg` | Cámara decorativa del reproductor de Horimiya |
| `hori.jpg` / `hori.png` | Foto cuadrada de Hori (tarjeta de selección del video) |
| `miyamura.jpg` / `miyamura.png` | Foto cuadrada de Miyamura (tarjeta de selección del video) |
| `pf-foto.jpg` | Foto principal de «Algo más para ti...» |
| `pf-flores.png` | Adorno floral de la carta final |
| `pf-pareja.jpg` | Foto secundaria de la carta final |
| `pf-detalle.jpg` | Foto pequeña al final de la carta |

## Stickers PNG transparentes

Reemplaza estos archivos por tus PNG sin fondo. Son adornos en los bordes de la pantalla con un movimiento muy suave de rotación.

- `img/deco/deco1.png`
- `img/deco/deco2.png`
- `img/deco/deco3.png`
- `img/deco/deco4.png`
- `img/deco/deco5.png`
- `img/deco/deco6.png`
- `img/deco/deco7.png`
- `img/deco/deco8.png`

## Fondos opcionales

Puedes añadir fondos de página en `img/`. Si no están, se usa el color temático que cambia suavemente al desplazarse.

- `fondo-p1.jpg` — portada
- `fondo-p2.jpg` — persona favorita
- `fondo-p3.jpg` — carta
- `fondo-p4.jpg` — disculpa
- `fondo-p5.jpg` — canción especial
- `fondo-p6.jpg` — «I love you»
- `fondo-p7.jpg` — luna
- `fondo-p8.jpg` — video
- `fondo-p9.jpg` — carta final

## Video, música y fecha

- `video-hori.mp4` y `video-miyamura.mp4`: clips de Hori y Miyamura. En la sección del video hay dos tarjetas para elegir a quién quieres ver; al hacer click se abre el diálogo con ese video solo. Añade ambos archivos junto a `index.html`; no se incluyen los episodios.
- `img/hori.jpg` o `img/hori.png` y `img/miyamura.jpg` o `img/miyamura.png`: fotos cuadradas que se muestran en cada tarjeta de selección (Hori y Miyamura). No hace falta poner la extensión en el código; se busca `.jpg` y si no está, se prueba `.png`.
- `musica.mp3`: música de fondo opcional, junto a `index.html`. Suena al 10 % de volumen en bucle después de desbloquear el mensaje, y se pausa al abrir el video.
- `video-boosted.mp4`: versión del video con el audio realzado (la que se usa por defecto). `video-original.mp4` es el respaldo con el audio original.
- `audio/cancion-especial.mp3`: canción que se reproduce desde la sección musical.
- En `js/config.js` puedes cambiar `songTitle`, `songArtist` y, si quieres, `songUrl` por un enlace HTTPS de Spotify u otra plataforma.
- El botón «Que te pareció mi regalito¿? ╰(*°▽°*)╯» abre WhatsApp al número definido en `CONFIG.whatsapp.phone` con el mensaje definido en `CONFIG.whatsapp.text`.
- `CONFIG.startDate` (formato `AAAA-MM-DD`) define la fecha de inicio para los días juntos y la cuenta regresiva del medio año.
- `CONFIG.birthDates`: Jair `2009-01-18`; Nicole `2009-01-21`.

La carta final y el cierre con los días juntos permanecen ocultos hasta que termine el video o toques el botón «Ya lo vi antes, saltar el video ⏭». Al pasar al final se reproduce una transición con cortina y corazones flotantes.

## Letra sincronizada

La sección de la canción muestra la letra en coreano y, debajo, su traducción al español en letra más pequeña y transparente. Cada línea aparece sincronizada con el tiempo de `audio/cancion-especial.mp3`.

- Edita `CONFIG.lyrics` en `js/config.js`: cada entrada lleva `t` (segundos), `text` (coreano) y `es` (traducción).
- La barra de progreso de la canción se rellena en verde a medida que avanza.
- La línea activa se centra hacia la parte superior para que se vean también las líneas siguientes.

## Animación del texto

Los textos narrativos y algunas etiquetas aparecen letra por letra al entrar en pantalla. Los títulos, subtítulos y mensajes de estado quedan estáticos; la animación se desactiva si el dispositivo tiene activado «Reducir movimiento».

## Extras con vida

- Barras de progreso de lectura en la parte superior.
- Barra de la canción con relleno de progreso en verde.
- Corazones que flotan continuamente y corazones al tocar la pantalla.
- Estrellas centelleantes en la sección de la luna.
- Las tarjetas y fotos hacen un pequeño *pop* y elevan al pasar el ratón.
    
