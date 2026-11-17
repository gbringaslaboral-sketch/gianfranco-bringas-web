# Gianfranco Bringas · Escudia — rediseño de la web

Rediseño de [gianfrancobringas.com](https://gianfrancobringas.com/), la web de Gianfranco Bringas, abogado en protección patrimonial (servicio **Escudia**).

## Concepto: «El chat»
Las estafas le llegan a la gente por WhatsApp, sus testimonios son videos de WhatsApp y él atiende por WhatsApp. Por eso la web es **la conversación**:

- **Header** = la barra del chat: su foto, un estado honesto según su horario real (8 a. m.–10 p. m., Lima), video, llamada, menú ⋮ de secciones y «Reservar».
- Primero, lo que te dicen («rentabilidad garantizada», «solo hoy», «confía en mí»); luego Gianfranco «se une» con su **video (VSL) en una burbuja**.
- Las tácticas y el momento en que estás son **encuestas de WhatsApp**; los casos llegan como **mensajes reenviados**; los testimonios, como **notas de video**; el informe, como **PDF adjunto** con su semáforo de riesgos.
- **Footer** = la caja de escribir: lo que marcaste en las encuestas y tu caso llegan a su WhatsApp.

Colores: el azul del archivador que aparece detrás de él en su video (`#2346a0`), el fondo de chat y el amarillo de sus subtítulos (`#f2c46b`). Tipografía: Figtree (autoalojada).

## Páginas
| Página | Archivo | Fuente |
|---|---|---|
| Inicio | `web/index.html` | `src/body.html`, `src/style.css`, `src/app.js`, `src/faq.html` |
| Pago | `web/pago.html` | `src/pago/` |
| Informe Ergo Capital | `web/informe-ergo-capital-escudia.html` | `src/docs/informe.html` |
| Cobertura en prensa | `web/cobertura-ergo-capital.html` | `src/docs/cobertura.html` |
| Privacidad | `web/privacidad.html` | `src/docs/privacidad.html` |

## Construir y ver
Los HTML de `web/` se generan desde `src/` (el `<head>` de cada página sale del sitio original en `raw/sitio-actual/`, para conservar SEO, JSON-LD y el Pixel de Meta):

```bash
python3 src/build.py "$PWD"        # inicio
python3 src/build_pago.py "$PWD"   # pago
python3 src/build_docs.py "$PWD"   # informe, cobertura y privacidad
python3 -m http.server 8000 -d web # http://localhost:8000
```

Ganchos de desarrollo: `?static` (sin animaciones), `?dry` (el envío a WhatsApp no abre nada y deja la URL en `window.__lastWa`). En pago: `?cita=recibida` (aviso al volver del calendario) y `?metodo=yape|tarjeta|soles|dolares`.

## Integraciones (sin cambios respecto al sitio actual)
- Calendario de reservas (GoHighLevel) en un diálogo; pago por Yape, PayPal y BCP.
- Meta Pixel `905320101996930`: `PageView`, `Contact` (WhatsApp/teléfono), `AbrirCalendario`, `Schedule` (al volver del calendario). Nuevos: `VerVSL` e `InitiateCheckout` (clic en PayPal).
- Videos: VSL desde el CDN del sitio actual; testimonios en Wistia.

Diseño y desarrollo: [Rayyan](https://rayyan.pe).
