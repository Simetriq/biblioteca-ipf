# Biblioteca IPF

App de la biblioteca del Instituto Politécnico Formosa (TP N° 4, Taller Complementario: React Native II). Sirve para consultar el catálogo, reservar libros, recibir un recordatorio antes de devolverlos y, para el personal, entregar libros respetando el orden de las listas de espera.

- **Expo SDK 58** (`expo ~58.0.26`, `expo-router ~58.0.32`, React Native 0.88, React 19.3), creado con `npx create-expo-app@latest`.
- TypeScript estricto y rutas tipadas (`experiments.typedRoutes`).
- Módulos nativos: solo `expo-camera` y `expo-notifications`.

## Cómo ejecutarlo

```bash
npm install
npx expo start
```

Escaneá el QR con **Expo Go** (Android o iOS). Otros comandos:

```bash
npx tsc --noEmit   # tipos
npx expo lint      # lint
npm test           # tests de Pila y Cola
```

Personal de biblioteca: usuario `biblioteca`, clave `ipf2026` (fijos en `src/constants/biblioteca.ts`).

> Los dos primeros libros de `src/data/libros.ts` son los que uso para probar el escáner: reemplazá sus ISBN por los de dos libros que tengas a mano.

## Árbol de rutas (`src/app`)

```
src/app
├── _layout.tsx                  Stack raíz · BibliotecaProvider · Stack.Protected · anchor: (tabs)
├── (tabs)
│   ├── _layout.tsx              Tabs (expo-router/js-tabs) · anchor: (catalogo)
│   ├── (catalogo)
│   │   ├── _layout.tsx          Stack de la pestaña Catálogo · anchor: index
│   │   ├── index.tsx            /                  Catálogo
│   │   └── libro
│   │       └── [isbn].tsx       /libro/[isbn]      Detalle
│   └── reservas.tsx             /reservas          Mis reservas (pestaña)
├── buscar.tsx                   /buscar?q=         Stack raíz
├── escanear.tsx                 /escanear          Stack raíz
├── reservar
│   └── [isbn].tsx               /reservar/[isbn]   modal
├── permisos
│   └── [recurso].tsx            /permisos/camara · /permisos/notificaciones   modal
├── login.tsx                    /login             modal, solo sin sesión
├── mostrador.tsx                /mostrador         solo con sesión
├── reserva.tsx                  /reserva           <Redirect href="/reservas" />
└── +not-found.tsx               cualquier otra URL
```

El grupo `(catalogo)` no agrega segmentos a la URL. Por eso el detalle responde en `/libro/[isbn]` y queda dentro de la pestaña Catálogo, con su propio Stack. Las opciones de cada pantalla del Stack raíz están en `src/components/NavegacionRaiz.tsx`, porque `src/app` solo tiene rutas.

## Estructura del resto de `src`

| Carpeta | Contenido |
|---|---|
| `components/` | Un componente por archivo (`TarjetaLibro`, `Portada`, `FichaPrestamo`, `VisorEscaner`…) |
| `hooks/` | `useLibros`, `useBusqueda`, `usePermiso`, `useBiblioteca` |
| `lib/` | `api.ts` (entregado), `catalogo`, `isbn`, `fechas`, `notificaciones`, `almacenamiento` |
| `context/` | `BibliotecaContext`: préstamos, listas de espera, recientes, avisos y sesión |
| `estructuras/` | `Pila` y `Cola` (`#items`, `tamanio`, `aArray()`) y sus tests |
| `data/` | `libros.ts` (16 libros) y listas de espera iniciales |
| `types/` | `Libro` (entregado) y tipos propios |
| `constants/` | `tema.ts` (colores, tamaños, espaciados), reglas del negocio y textos de permisos |

## Bloque `plugins` de `app.json`

```jsonc
"plugins": [
  // Rutas basadas en archivos.
  "expo-router",
  // Splash con el color de fondo de la app.
  ["expo-splash-screen", { "backgroundColor": "#F3EDE2", "image": "./assets/images/splash-icon.png", "imageWidth": 76 }],
  ["expo-camera", {
    // Texto de propósito (iOS: NSCameraUsageDescription), con el molde "Usamos tu … para …".
    "cameraPermission": "Usamos tu cámara para leer el código de barras de la contratapa y abrir el libro sin tipear el ISBN.",
    // Mínimo privilegio: la app no graba video con sonido.
    "microphonePermission": false,   // no agrega NSMicrophoneUsageDescription
    "recordAudioAndroid": false,     // no agrega android.permission.RECORD_AUDIO
    "barcodeScannerEnabled": true
  }],
  ["expo-notifications", {
    "color": "#24493A",              // color del ícono de la notificación en Android
    "defaultChannel": "prestamos"    // canal por defecto, el mismo que se crea en código
  }]
]
```

## Permisos

| Recurso | Módulo | Cuándo se pide | Alternativa si se niega |
|---|---|---|---|
| Cámara | `expo-camera` (`useCameraPermissions`, dentro de `usePermiso`) | Al tocar «Usar la cámara» en `/escanear`. Antes aparece `/permisos/camara` con el beneficio y el botón «Continuar» | Escribir el ISBN a mano: el campo está siempre visible en `/escanear` |
| Notificaciones | `expo-notifications` | Solo al activar «Recordarme» en un préstamo. Antes aparece `/permisos/notificaciones`. En Android se crea el canal `prestamos` antes de pedir | Los avisos aparecen dentro de la app, en «Mis reservas» (con insignia en la pestaña) |

Si un permiso queda bloqueado (`canAskAgain: false`), la pantalla previa cambia «Continuar» por «Abrir Ajustes». Al volver de Ajustes, `AppState` vuelve a consultar el permiso.

### `blockedPermissions` (Android)

```json
"blockedPermissions": [
  "android.permission.RECORD_AUDIO",
  "android.permission.ACCESS_FINE_LOCATION",
  "android.permission.ACCESS_COARSE_LOCATION",
  "android.permission.ACCESS_BACKGROUND_LOCATION",
  "android.permission.READ_EXTERNAL_STORAGE",
  "android.permission.WRITE_EXTERNAL_STORAGE",
  "android.permission.READ_MEDIA_IMAGES",
  "android.permission.READ_MEDIA_VIDEO",
  "android.permission.READ_MEDIA_AUDIO",
  "android.permission.SYSTEM_ALERT_WINDOW"
]
```

Justificación: la app solo usa la cámara para leer códigos y las notificaciones locales. Algunas librerías o plantillas agregan permisos al manifiesto aunque no se usen. `blockedPermissions` los quita en la build final:

- **Audio:** la cámara no graba video con sonido. Refuerza `recordAudioAndroid: false`.
- **Ubicación:** la biblioteca es una sola y no se necesita saber dónde está la persona.
- **Almacenamiento y galería:** no se eligen ni se guardan fotos; las portadas se dibujan en código.
- **Superposición (`SYSTEM_ALERT_WINDOW`):** a veces lo suma el modo desarrollo, y la app no lo necesita.

Así la ficha de la tienda muestra solo lo que la app realmente usa.

## Deep links de prueba

Con la app abierta en Expo Go, reemplazá `IP` por la que muestra `npx expo start`:

| Enlace | En Expo Go | Qué debería pasar |
|---|---|---|
| `bibliotecaipf://libro/9789507310010` | `exp://IP:8081/--/libro/9789507310010` | Detalle de «Ficciones», con el Catálogo debajo |
| `bibliotecaipf://libro/123` | `exp://IP:8081/--/libro/123` | Mensaje «El código no es un ISBN válido» y enlace al catálogo |
| `bibliotecaipf://buscar?q=borges` | `exp://IP:8081/--/buscar?q=borges` | Buscador con resultados de Borges y las pestañas debajo |
| `bibliotecaipf://mostrador` (sin sesión) | `exp://IP:8081/--/mostrador` | No abre el mostrador: la ruta está protegida |
| `bibliotecaipf://reserva` | `exp://IP:8081/--/reserva` | Redirige a Mis reservas |
| `bibliotecaipf://escanear` | `exp://IP:8081/--/escanear` | Escáner (con cámara bloqueada: «Abrir Ajustes» + ingreso manual) |
| `bibliotecaipf://cualquier-cosa` | `exp://IP:8081/--/cualquier-cosa` | Pantalla 404 con la URL |

Desde la terminal de Android: `adb shell am start -a android.intent.action.VIEW -d "exp://IP:8081/--/buscar?q=borges"`.

## Desafíos opcionales

- [x] **Persistencia:** préstamos (con el identificador de notificación), recientes y listas de espera en AsyncStorage. El splash queda visible hasta terminar de leerlos (`NavegacionRaiz`).
- [x] **Pruebas:** 7 casos de Pila y Cola con jest-expo, incluido desencolar una cola vacía.
- [x] **Debounce:** el buscador espera 300 ms sin escribir antes de cambiar la URL y buscar.
- [ ] Modo oscuro.
- [ ] Development build.

## Verificación

`npx tsc --noEmit`:

```
(sin salida: 0 errores)
```

`npx expo lint`:

```
(sin salida: 0 errores, 0 advertencias)
```

`npm test`:

```
Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
```

## Capturas

Están en la carpeta [`capturas/`](capturas/). Se tomaron con la versión web de la app (`npx expo start --web`) en un tamaño de teléfono (390 × 844).

| # | Pantalla | Archivo |
|---|----------|---------|
| 1 | Catálogo cargando | [01-catalogo-cargando.png](capturas/01-catalogo-cargando.png) |
| 2 | Catálogo con error | [02-catalogo-error.png](capturas/02-catalogo-error.png) |
| 3 | Catálogo con datos | [03-catalogo-con-datos.png](capturas/03-catalogo-con-datos.png) |
| 4 | Buscador (`/buscar?q=borges`) | [04-buscador.png](capturas/04-buscador.png) |
| 5 | Detalle inexistente (ISBN válido que no está) | [05-detalle-inexistente.png](capturas/05-detalle-inexistente.png) |
| 6 | Detalle con ISBN inválido (`/libro/123`) | [06-detalle-isbn-invalido.png](capturas/06-detalle-isbn-invalido.png) |
| 7 | Reserva con ejemplares | [07-reserva-con-ejemplares.png](capturas/07-reserva-con-ejemplares.png) |
| 8 | Reserva sin ejemplares (lista de espera) | [08-reserva-sin-ejemplares.png](capturas/08-reserva-sin-ejemplares.png) |
| 9 | Mis reservas después de confirmar | [09-mis-reservas-tras-confirmar.png](capturas/09-mis-reservas-tras-confirmar.png) |
| 10 | Mostrador antes de «Entregar al siguiente» | [10-mostrador-antes.png](capturas/10-mostrador-antes.png) |
| 11 | Mostrador después de «Entregar al siguiente» | [11-mostrador-despues.png](capturas/11-mostrador-despues.png) |
| 12 | Aviso recibido dentro de la app | [12-aviso-recibido-en-app.png](capturas/12-aviso-recibido-en-app.png) |
| 13 | Pantalla 404 | [13-pantalla-404.png](capturas/13-pantalla-404.png) |
| 14 | Escáner: cargando | [14-escaner-cargando.png](capturas/14-escaner-cargando.png) |
| 15 | Escáner: preguntable | [15-escaner-preguntable.png](capturas/15-escaner-preguntable.png) |
| 16 | Escáner: concedido | [16-escaner-concedido.png](capturas/16-escaner-concedido.png) |
| 17 | Escáner: bloqueado | [17-escaner-bloqueado.png](capturas/17-escaner-bloqueado.png) |
| 18 | Pantalla previa del permiso de cámara | [18-permiso-camara-pantalla-previa.png](capturas/18-permiso-camara-pantalla-previa.png) |

Notas:

- En web, `expo-camera` siempre informa `canAskAgain: true`, así que para la captura del estado «bloqueado» se forzó ese valor en `false`. La pantalla que se ve es la de la app, sin cambios.
- En web no se muestran notificaciones del sistema, por eso la captura 12 es el aviso dentro de la app. Falta agregar desde un teléfono la notificación del sistema y el diálogo de cámara con el texto de propósito (development build).
