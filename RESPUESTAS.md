# Respuestas: TP 4, Biblioteca IPF

> **Borrador.** Las respuestas se apoyan en el código de este repositorio. Las marcadas con **[verificar en el teléfono]** dependen de lo que se ve en el dispositivo (por ejemplo, el `console.log` temporal de B1b o el recorrido de D1). Hay que confirmarlas en Expo Go y ajustarlas a lo observado antes de entregar.

---

## Parte B · Estado, efectos y renderizado

### B1. El ciclo de vida de `useLibros`

Código: `src/hooks/useLibros.ts`.

**a) Render por render**

Cuando el pedido sale bien:

| Render | Qué lo provoca | `libros` | `cargando` | `error` |
|---|---|---|---|---|
| 1 | Montaje del Catálogo (estado inicial, líneas 13-17) | `[]` | `true` | `null` |
| (efecto) | Después de pintar, corre el efecto (línea 21) y llama a `obtenerLibros()` | | | |
| 2 | ~800 ms después se resuelve la promesa y `setEstado` (línea 26) | 16 libros | `false` | `null` |

Son 2 renders. En el primero la lista muestra `EstadoCarga` como `ListEmptyComponent`; en el segundo, las filas.

Cuando `obtenerLibros()` falla y la persona toca «Reintentar»:

| Render | Qué lo provoca | `libros` | `cargando` | `error` |
|---|---|---|---|---|
| 1 | Montaje | `[]` | `true` | `null` |
| 2 | Se rechaza la promesa, `catch` (líneas 29-36) | `[]` | `false` | mensaje en español |
| 3 | Toca «Reintentar»: `reintentar` (líneas 43-46) hace dos `set` que React agrupa en un solo render | `[]` | `true` | `null` |
| (efecto) | Cambió `intento`: React corre la limpieza del efecto anterior (`activo = false`) y vuelve a correr el efecto | | | |
| 4 | Llega la respuesta nueva | 16 libros (o error otra vez) | `false` | `null` (o mensaje) |

El mensaje de error nunca es el texto técnico de la excepción (`'No se pudo conectar…'`). Es uno escrito para la persona (línea 34).

**b) ¿Se desmonta el Catálogo?**

No en ninguno de los dos casos. Las pestañas mantienen montadas las pantallas que ya se visitaron, así que cambiar a «Mis reservas» solo le quita el foco al Catálogo. Abrir un detalle hace `push` en el Stack de la pestaña, y el Catálogo queda debajo, montado. **[verificar en el teléfono]**: agregar temporalmente `console.log('limpieza useLibros')` dentro del `return () => { … }` de la línea 38 (`return () => { activo = false; }`), probar los dos casos y borrarlo antes de commitear.

Entonces, la limpieza que escribí se ejecuta en dos situaciones reales:

1. Cuando cambia `intento` (al tocar «Reintentar»), antes de lanzar el pedido nuevo. Así una respuesta vieja que llegue tarde no pisa el estado.
2. Cuando el Catálogo se desmonta de verdad: al cerrar la app o si se desmontara el navegador de pestañas.

**c) ¿Por qué no `async` directo en `useEffect`?**

Una función `async` siempre devuelve una `Promise`, y `useEffect` espera que se devuelva `undefined` o una función de limpieza. React tomaría la promesa como si fuera la limpieza, y ya no habría dónde cancelar nada. Lo resolví con una función normal que usa `.then/.catch` y devuelve la limpieza:

```ts
useEffect(() => {
  let activo = true;
  obtenerLibros()
    .then((libros) => { if (activo) setEstado({ libros, cargando: false, error: null }); })
    .catch(() => { if (activo) setEstado(/* … error … */); });
  return () => { activo = false; };
}, [intento]);
```

**d) `reintentar`**

`reintentar` (líneas 43-46) pone `cargando: true` y suma 1 a `intento`. Como `intento` está en el array de dependencias del efecto (línea 41), el cambio de valor hace que React limpie el efecto anterior y lo vuelva a ejecutar. Usé un contador y no un booleano porque cada toque tiene que producir un valor distinto: con `true/false`, dos reintentos seguidos podrían dejar el mismo valor y el efecto no correría. Pongo `cargando: true` en el manejador y no dentro del efecto para no hacer un `setState` sincrónico en el cuerpo del efecto, que agregaría un render de más.

### B2. La condición de carrera del buscador

Código: `src/hooks/useBusqueda.ts` y `src/app/buscar.tsx`.

Para la tabla supongo que las dos búsquedas llegan a pedirse. Con mi debounce, si «borges» se escribe antes de los 300 ms, el pedido de «bor» ni siquiera sale.

| Momento | Qué pasa | Sin limpieza | Con mi código |
|---|---|---|---|
| t = 0 ms | Pide «bor» (1400 ms) | «Buscando…» | «Buscando «bor»…» |
| t = 200 ms | Pide «borges» (300 ms) | «Buscando…» | La limpieza marca «bor» como vencido. «Buscando «borges»…» |
| t = 500 ms | Llega «borges» | Resultados de «borges» | Resultados de «borges» |
| t = 1400 ms | Llega «bor» | **Resultados de «bor»** con «borges» escrito en el campo | Se descarta (`vigente === false`). Siguen los de «borges» |

En mis datos, «bor» y «borges» encuentran los mismos libros (solo los de Borges), así que el error no se nota a simple vista. Con «sa» y «sabato», sin limpieza, aparecerían libros que no tienen nada que ver con lo que dice el campo.

**a)** Cada ejecución del efecto crea su propia variable `vigente = true` (línea 18). La limpieza (líneas 30-32) la pone en `false`. React ejecuta la limpieza **antes de volver a correr el efecto**, cuando cambia `consulta`, o al desmontar la pantalla. Cuando la respuesta vieja llega, su `.then` lee el `vigente` de *su* ejecución, que ya es `false`, y no llama a `setResultado`. Además, como segunda red, el hook guarda la consulta junto con los libros y solo los muestra si coinciden con la consulta actual (línea 35).

**b)** No funciona. El `.then` es una clausura creada en el render en que se lanzó la búsqueda, y ve el `q` de **ese** render. En ese render, `texto` y `q` son el mismo valor, así que `texto === q` siempre da `true` y la respuesta vieja se guarda igual. Para que funcionara habría que leer el valor actual desde fuera de la clausura (un `useRef` actualizado en cada render), que es justamente lo que la limpieza resuelve de forma más simple.

**c)** Mientras se escribe, la URL cambia a `/buscar?q=…` 300 ms después de la última tecla (líneas 24-33 de `buscar.tsx`). `router.setParams` reemplaza los parámetros de la pantalla actual, no apila nada. «Atrás» vuelve directo al Catálogo. Con `router.push`, cada búsqueda apilaría una pantalla `/buscar` nueva: para salir habría que tocar «atrás» una vez por cada consulta intermedia («b», «bo», «bor»…).

### B3. Mutar o reemplazar

**a)** Muestra `Personas en espera: 0`. `encolar` modifica el objeto que guarda `useState`, pero no llama a ningún `set`. React no se entera de que algo cambió y no vuelve a renderizar. Además, la referencia sigue siendo la misma, así que aunque se llamara `setEspera(espera)`, React compararía con `Object.is`, vería el mismo objeto y descartaría el render.

**b)** Escribir en el `TextInput` controlado sí llama a un `set`, entonces el componente se vuelve a renderizar y, al hacerlo, lee `espera.tamanio`, que ya vale 3. El número «salta» por un render que no tiene nada que ver con la cola. Un error que aparece «a veces» es peor porque depende de qué otra cosa provoque un render: es difícil de reproducir y quizás pasa las pruebas. Además, la persona ve datos viejos sin saberlo. Un error que aparece siempre se detecta en la primera prueba.

**c)** En el Context nunca muto una estructura que ya está en el estado. Creo una nueva a partir de la anterior y la guardo con `set`:

```ts
// src/context/BibliotecaContext.tsx, líneas 190-192
const nueva = new Cola(colaActual?.aArray() ?? []);
nueva.encolar(YO);
setEsperas((anteriores) => ({ ...anteriores, [libro.isbn]: nueva }));
```

Hago lo mismo con la Pila de recientes (líneas 150-156) y al desencolar en el mostrador (líneas 242-244).

| Alternativa | Ventaja | Costo |
|---|---|---|
| **Copiar la cola (mi elección)** | Cada estado es inmutable: React detecta el cambio por referencia y `useMemo`/dependencias funcionan bien. Fácil de razonar y de persistir | Copia O(n) en cada cambio. Con listas de 1 a 5 personas no importa |
| Contador de versión (`setVersion(v => v + 1)` después de mutar) | No copia nada | El objeto sigue siendo el mismo: cualquier `useMemo` que dependa de la cola no se entera. Fácil olvidarse del `setVersion` en algún lugar |
| `useReducer` | Todas las transiciones en una función pura, fácil de testear | Más código: acciones, tipos, `switch`. Igual hay que copiar la cola dentro del reducer |

### B4. ¿Dónde vive cada dato?

| Dato | Dónde vive | Por qué ahí |
|---|---|---|
| Texto del buscador | **URL** (`q`), más un estado local `texto` para lo que se está tipeando (`buscar.tsx`) | En la URL se puede compartir, sobrevive a un deep link y «atrás» funciona. El estado local evita cambiar la URL en cada tecla (debounce) |
| Préstamos y reservas | **Context** (`prestamos`), persistido en AsyncStorage | Los usan varias pantallas (Catálogo, Detalle, Reservar, Mis reservas) y tiene que sobrevivir al cierre de la app |
| Listas de espera | **Context** (`esperas`: una `Cola` por ISBN) | Las modifican Reservar y Mostrador, y las leen el Detalle y Mis reservas |
| Vistos recientemente | **Context** (`Pila`), persistido | Se escriben en el Detalle y se leen en el Catálogo, dos pantallas distintas |
| Sesión del personal | **Context** (`sesionIniciada`), solo en memoria | Decide qué rutas existen en el layout raíz (`Stack.Protected`). No la persisto a propósito: al cerrar la app se cierra la sesión |
| Ejemplares disponibles | **Se calcula** (`ejemplaresDisponibles`, `src/lib/catalogo.ts` líneas 18-23) | Se deriva de `libro.ejemplares` y de los préstamos. Guardarlo sería tener el mismo dato en dos lugares |
| Estado del permiso de cámara | **Sistema operativo**. `usePermiso` guarda una copia local y la refresca al enfocar la pantalla y al volver a la app | El dueño es el SO: la persona lo cambia en Ajustes sin pasar por la app |
| Identificador de la notificación | **Context**, dentro del préstamo (`notificacionId`), persistido | Se necesita para cancelarla al devolver o al apagar «Recordarme». Va pegado al préstamo al que pertenece |

**Re-renders del Context.** Cuando cambia el `value` del Provider, se vuelven a renderizar **todos** los componentes que llaman a `useBiblioteca()`, usen o no la parte que cambió. Mi Catálogo usa `recientes` y también `prestamos` (para calcular la disponibilidad). Al activar un recordatorio cambia `prestamos`, así que sí se vuelve a renderizar, y en mi caso eso es correcto. Si solo usara `recientes`, igual se re-renderizaría. Para evitarlo se puede dividir en varios contextos (uno para recientes, otro para préstamos), usar selectores o envolver las filas en `React.memo`. En una app de este tamaño no vale la pena: son pocas pantallas, la lista tiene 16 filas y el re-render es imperceptible. Lo que sí hago es memorizar el `value` (línea 286) para no provocar renders cuando el Provider se renderiza sin que cambie nada.

---

## Parte C · Navegación y rutas

### C1. La pila en tu app

**[verificar en el teléfono]**: confirmar los pasos 5 y 6.

| # | Acción | Pilas resultantes |
|---|---|---|
| 1 | Abre la app | Stack raíz: `[(tabs)]`. Tabs: Catálogo activa. Stack Catálogo: `[index]` |
| 2 | Toca un libro | Stack raíz: `[(tabs)]`. Stack Catálogo: `[index, libro/X]` |
| 3 | Toca «Reservar» | Stack raíz: `[(tabs), reservar/X (modal)]`. Stack Catálogo: `[index, libro/X]` |
| 4 | Toca «Confirmar» | `dismiss()` saca el modal y `navigate('/reservas')` cambia de pestaña. Stack raíz: `[(tabs)]`. Tabs: Mis reservas activa. Stack Catálogo sigue `[index, libro/X]` |
| 5 | Atrás (Android) | Mis reservas no tiene pila propia, así que «atrás» lo maneja el navegador de pestañas y vuelve a la pestaña Catálogo, que muestra su tope: `libro/X`. La confirmación no aparece |
| 6 | Toca la tab «Catálogo» | Tocar la pestaña que ya está activa vuelve su Stack al inicio: Stack Catálogo `[index]` |

**a)** Usé `router.dismiss()` y después `router.navigate('/reservas')` (`src/app/reservar/[isbn].tsx`, líneas 49-50).

- Con **`push`**, `/reservas` se apilaría encima del modal: «atrás» volvería a la confirmación y se podría confirmar dos veces.
- Con **`replace`**, el modal se reemplazaría por la ruta de `/reservas`, que vive dentro de `(tabs)`. En el Stack raíz quedaría una segunda instancia de `(tabs)` encima de la primera: dos barras de pestañas, una debajo de otra, sin que se note.
- Con **`dismissTo('/reservas')`**, se cierran pantallas hasta encontrar esa ruta en la pila. Como `/reservas` no está en el Stack raíz (está anidada en las tabs), termina comportándose como un `replace`.

Elegí `dismiss + navigate` porque deja la pila raíz como estaba antes de reservar y solo cambia de pestaña.

**b)** En el paso 6 la persona ve el Catálogo (`index`): tocar la pestaña activa vuelve su Stack al inicio. Me parece correcto: ya vio el detalle y reservó, y lo esperable al tocar «Catálogo» es volver a la lista. Si en el paso 5 no hubiera pasado por la pestaña, tocar «Catálogo» desde Mis reservas mostraría el detalle que quedó abierto (las pestañas recuerdan su pila), que también es razonable.

### C2. El escáner que dispara de más

Código: `src/app/escanear.tsx`.

**a)** `onBarcodeScanned` se llama varias veces por segundo mientras el código está frente a la cámara. Sin protección, cada llamada haría `router.push`. Como vimos en el TP 2, las acciones de navegación se encolan y se procesan una por una, así que no se pisan entre sí: todas se ejecutan. Se apilarían varias pantallas del mismo detalle, y para volver habría que tocar «atrás» muchas veces.

**b)** Usé `useRef` (`yaNavego`, línea 20). Un `useState` puesto en `true` no alcanza porque `setState` no cambia el valor en el momento: programa un render nuevo. Las llamadas a `onBarcodeScanned` que llegan antes de ese render usan la función creada en el render anterior, cuya clausura todavía ve `false`, y vuelven a navegar. Un ref es un objeto mutable que se lee siempre actualizado (`yaNavego.current`), sin esperar a ningún render.

**c)** Con `replace` (línea 36), el escáner sale de la pila y el detalle ocupa su lugar: «atrás» desde el detalle vuelve al Catálogo. Con `push`, «atrás» volvería a la cámara, que seguiría apuntando al mismo libro y lo abriría otra vez.

**d)** Muestra un aviso sobre el visor («El ISBN … no está en el catálogo. Probá con otro libro.») y deja seguir escaneando: no navega ni bloquea la cámara. Para que no aparezca diez veces, guardo el último ISBN desconocido en un ref (`ultimoDesconocido`, líneas 21 y 44-49) e ignoro las lecturas repetidas de ese mismo código. El aviso se borra a los 2,5 s con un `setTimeout` que se limpia en el efecto (líneas 25-31).

### C3. Deep links y rutas protegidas

**[verificar en el teléfono]**: probar cada link con `exp://IP:8081/--/…` y corregir la tabla según lo observado.

| Link | Qué ve la persona | Qué queda debajo | Qué parte del código lo decide |
|---|---|---|---|
| `libro/9789507310010` | Detalle de «Ficciones» | Catálogo (`index`) en el Stack de la pestaña | `unstable_settings.anchor` en `(catalogo)/_layout.tsx` (línea 8) y en `_layout.tsx` (línea 11) |
| `libro/123` | «El código no es un ISBN válido» y enlace «Ir al catálogo» | Catálogo | La ruta dinámica `libro/[isbn].tsx` acepta cualquier valor; la validación está en las líneas 20-21 y 31-47 |
| `buscar?q=borges` | Buscador con los libros de Borges | `(tabs)` con el Catálogo | `anchor: '(tabs)'` en `src/app/_layout.tsx` (línea 11); `useBusqueda` lee `q` |
| `mostrador` (sin sesión) | No se abre el mostrador: queda en el Catálogo | `(tabs)` | `Stack.Protected guard={sesionIniciada}` en `NavegacionRaiz.tsx` (línea 58) |
| `reserva` | Mis reservas | Nada extra: el `Redirect` reemplaza la ruta | `src/app/reserva.tsx` |
| `escanear` (cámara bloqueada) | «La cámara está desactivada», botón «Abrir Ajustes» y el campo para escribir el ISBN | `(tabs)` | `usePermiso` (`canAskAgain`, línea 19) y `escanear.tsx` (líneas 85-93) |

**¿Por qué `/libro/123` llega al detalle?** El router compara la URL con patrones de archivos, no con datos: `libro/[isbn]` coincide con cualquier segmento, sea `123` o `abc`. El router no sabe qué libros existen. La responsabilidad de responder bien es de la **pantalla**, que valida el parámetro y muestra un mensaje claro con salida.

### C4. Foco, montaje y primer plano

**a)**
- `useEffect` con `[]`: el **montaje** del componente (una sola vez).
- `useFocusEffect`: cada vez que la pantalla **gana foco** dentro de la navegación (volver de otra pantalla o pestaña).
- `AppState`: cuando la **app entera** pasa a primer o segundo plano (`active` / `background`).

**b)** Al volver de Ajustes, se entera solo **`AppState`**: la pantalla nunca perdió el foco para la navegación, y el montaje ya ocurrió. Al ir a Catálogo y volver a Mis reservas, se entera **`useFocusEffect`**: la app nunca salió de primer plano y la pantalla no se volvió a montar.

**c)** Uso los dos, dentro de `usePermiso` (`src/hooks/usePermiso.ts`, líneas 46-51 con `useFocusEffect` y líneas 53-60 con `AppState`), así que Mis reservas no queda con un estado viejo en esos dos casos. Si hubiera usado solo `useEffect` con `[]`, la pantalla mostraría «Notificaciones apagadas» aunque la persona las hubiera activado en Ajustes, hasta reiniciar la app.

---

## Parte D · Permisos en tu app

### D1. Recorrido completo de la cámara

**[verificar en el teléfono]**: completar con lo que devuelve el permiso en un Android 14 real.

| # | Acción | Qué muestra mi app | `status` | `canAskAgain` |
|---|---|---|---|---|
| 1 | Toca «Escanear» por primera vez | Tarjeta «Escaneá en vez de tipear» con «Usar la cámara», y el campo del ISBN. Al tocar el botón aparece `/permisos/camara` con el beneficio y «Continuar» | `undetermined` | `true` |
| 2 | «Continuar» → «No permitir» | Vuelve a `/escanear`: la misma tarjeta (todavía se puede preguntar) y el ingreso manual | `denied` | `true` |
| 3 | Toca «Escanear» otra vez | Igual que el paso 2 | `denied` | `true` |
| 4 | «Continuar» → «No permitir» | Android no vuelve a mostrar el diálogo. `/escanear` muestra «La cámara está desactivada» con «Abrir Ajustes» y el ingreso manual | `denied` | `false` |
| 5 | Toca «Escanear» otra vez | La misma pantalla de bloqueado. La pantalla previa también mostraría «Abrir Ajustes» | `denied` | `false` |
| 6 | «Abrir Ajustes» → habilita → vuelve | `AppState` pasa a `active`, se refresca el permiso y aparece el visor de la cámara | `granted` | `true` |

**a)** En iOS el resultado cambia en el **paso 2**: iOS muestra el diálogo una sola vez, y después de la primera negativa `canAskAgain` ya es `false`. En el paso 3 la app muestra directamente «La cámara está desactivada» con «Abrir Ajustes».

**b)** La línea que decide es la 19 de `src/hooks/usePermiso.ts`:

```ts
return respuesta.canAskAgain ? 'preguntable' : 'bloqueado';
```

Usa `canAskAgain`. `status` no alcanza porque vale `denied` tanto cuando todavía se puede volver a preguntar como cuando el sistema ya no muestra el diálogo. La única forma de saber si «Continuar» va a servir para algo es `canAskAgain`. Después, `ExplicacionPermiso.tsx` elige el botón según ese estado («Abrir Ajustes» si está bloqueado).

**c)** Se entera el listener de `AppState` de `usePermiso` (líneas 53-60), que llama a `refrescar()` cuando la app vuelve a `active`. Sin él, la app seguiría mostrando «La cámara está desactivada» aunque el permiso ya estuviera concedido, hasta salir de la pantalla y volver a entrar.

### D2. Notificaciones y consistencia

**a)** Sin cancelarla, a los 15 segundos llegaría «Recordá devolver…» por un libro que ya se devolvió. Es un aviso falso que hace desconfiar de la app. Por eso `devolver` cancela la notificación si existe (`BibliotecaContext.tsx`, líneas 198-204).

**b)** El identificador está en el propio préstamo (`notificacionId`), dentro del Context, y se guarda en AsyncStorage con el resto del estado (líneas 127-139). Si la app se cierra antes de que llegue la notificación, la notificación **sigue programada en el sistema operativo** y llega igual. El identificador, en cambio, vive en memoria. Sin persistencia se perdería: al reabrir la app y devolver el libro no habría forma de cancelar esa notificación, que llegaría huérfana. Con la persistencia (desafío opcional) el identificador vuelve al abrir la app y se puede cancelar. Queda un caso: que el identificador guardado y lo programado en el sistema no coincidan (por ejemplo, si se borraron los datos de la app). Lo resolvería al iniciar, comparando con `Notifications.getAllScheduledNotificationsAsync()` y cancelando las que no correspondan a ningún préstamo.

**c)** Desde Android 13, notificar requiere el permiso en tiempo de ejecución `POST_NOTIFICATIONS`, y el sistema solo muestra el diálogo si la app ya tiene **al menos un canal** creado. Si se pide antes, la respuesta llega negada sin que la persona haya visto nada. Por eso `pedir()` llama primero a `prepararCanal()` (`usePermiso.ts`, línea 67). En Android 12 no existe ese permiso: las notificaciones están permitidas desde la instalación y `requestPermissionsAsync` responde `granted` sin mostrar diálogo. El canal sigue siendo obligatorio (desde Android 8) para que la notificación se vea, pero no influye en el permiso.

**d)** Si el permiso está denegado, el libro igual queda a mi nombre como préstamo y aparece un aviso en «Mis reservas», con una insignia en la pestaña. El código está en `BibliotecaContext.tsx`, líneas 259-263:

```ts
if (await notificacionesPermitidas()) {
  await avisarLibroListo(libro.titulo);
} else {
  agregarAviso(`Llegó tu turno: «${libro.titulo}» ya está a tu nombre. Retiralo en el mostrador.`);
}
```

`notificacionesPermitidas()` consulta el permiso **en ese momento** (`getPermissionsAsync`, `src/lib/notificaciones.ts`). Importa porque la persona puede cambiar el permiso desde Ajustes en cualquier momento. Un valor guardado podría estar viejo: intentaríamos mandar una notificación que nunca llega, sin dejar ningún aviso en la app.

### D3. Lo que tu app pide y lo que no

**[verificar]**: confirmar la lista de Android con `npx expo prebuild --platform android` y revisando `android/app/src/main/AndroidManifest.xml` (después borrar la carpeta `android/`).

| Plataforma | Permiso o clave | Función que lo justifica | ¿Quién lo agrega? |
|---|---|---|---|
| Android | `android.permission.CAMERA` | Escanear el código de barras | Plugin de `expo-camera` |
| Android | `android.permission.POST_NOTIFICATIONS` | Recordatorio de devolución y aviso de libro listo | `expo-notifications` |
| Android | `android.permission.RECEIVE_BOOT_COMPLETED` (y `VIBRATE`) | Que las notificaciones programadas sobrevivan a un reinicio | `expo-notifications` |
| iOS | `NSCameraUsageDescription` («Usamos tu cámara para leer el código de barras…») | Escáner | Plugin de `expo-camera`, con mi texto de `app.json` |
| iOS | Notificaciones (sin clave en `Info.plist`; se piden en tiempo de ejecución) | Recordatorios | `expo-notifications` |

**a)** `expo-camera` puede grabar video con audio y por eso, por defecto, agrega el permiso de micrófono. Mi app solo lee códigos, así que lo desactivo en el plugin y además lo bloqueo:

```json
["expo-camera", {
  "cameraPermission": "Usamos tu cámara para leer el código de barras de la contratapa y abrir el libro sin tipear el ISBN.",
  "microphonePermission": false,
  "recordAudioAndroid": false
}]
```

```json
"android": { "blockedPermissions": ["android.permission.RECORD_AUDIO", "…"] }
```

**b)** Usaría `expo-image-picker` con `launchImageLibraryAsync`. En Android 13+ usa el selector de fotos del sistema y en iOS 14+ el `PHPicker`: la persona elige una foto concreta y la app no necesita permiso de galería. Sí habría que agregar el plugin con un texto de propósito para iOS y sacar `READ_MEDIA_IMAGES` de `blockedPermissions` solo si hiciera falta. No alcanza con una actualización OTA: `expo-image-picker` trae **código nativo** que no está en el binario instalado, y una OTA solo reemplaza el JavaScript. Hace falta una build nueva (en Expo Go funcionaría porque ya lo trae incluido, y por eso es engañoso).

**c)** En Expo Go no pude verificar:

- **El texto de propósito:** el diálogo muestra el texto de Expo Go, no el mío. Los plugins de `app.json` no se aplican porque Expo Go es un binario ya compilado.
- **`blockedPermissions` y `microphonePermission: false`:** el manifiesto es el de Expo Go, que declara muchos más permisos.
- **El nombre de la app en el diálogo y el color/ícono de la notificación:** aparece «Expo Go».
- **El canal `prestamos`:** se crea, pero dentro de los ajustes de Expo Go.

Lo verificaría con una **development build** (`npx expo run:android` o `eas build --profile development`), que compila mi `app.json`, y revisando el manifiesto generado con `npx expo prebuild`.

---

## Parte E · Buenas prácticas y decisiones de diseño

### E1. Revisión de código

**a) Problemas**

| Línea | Problema | Tipo | Por qué y cómo corregirlo |
|---|---|---|---|
| 10 | `useState<any[]>` | Mala práctica | Se pierde el tipado: `libro.titulo` mal escrito no da error. Usar `Libro[]` |
| 11, 13-16 | Pide cámara y notificaciones al abrir el Catálogo | Mala práctica (y riesgo de rechazo en la tienda) | Pedidos sin contexto: la persona todavía no sabe para qué son y es más probable que diga que no. Pedirlos al usarlos, con pantalla previa (`/permisos/[recurso]`) |
| 14-15 | Promesas sin `await` ni `catch` | Error de ejecución | Un rechazo queda como *unhandled promise rejection*. Manejar el resultado |
| 16 | `[]` sin `pedirPermiso` en las dependencias | Advertencia (lint `exhaustive-deps`) | El array de dependencias está incompleto. Igual el efecto entero sobra (ver arriba) |
| 11 | `permiso` se declara y no se usa | Advertencia (lint) | Variable sin uso. Borrarla |
| 18-20 | Efecto **sin array de dependencias** | Error de ejecución / rendimiento | Corre después de cada render, y cada respuesta provoca otro render: pedidos infinitos (ver b). Usar `useLibros` con `[intento]` |
| 18-20 | Sin limpieza | Error de ejecución | Si la pantalla se desmonta o llega una respuesta vieja, se hace `setState` igual. Usar una bandera `activo` |
| 19 | Sin `catch` ni estados de carga, error o vacío | Error de ejecución / mala práctica | 1 de cada 5 veces `obtenerLibros` falla: rechazo no manejado y pantalla en blanco para siempre. Mostrar cargando, error con «Reintentar» y vacío |
| 22-30 | Componente `Fila` declarado **dentro** de `Catalogo` | Rendimiento / mala práctica | Es un componente distinto en cada render: React desmonta y vuelve a montar todas las filas. Moverlo a su propio archivo (en mi app, `src/components/TarjetaLibro.tsx`) |
| 22 | `libro: any` en las props | Mala práctica | Tipar `{ libro: Libro }` |
| 24 | `'/libro/' + libro.isbn` | Mala práctica | Concatenar strings pierde las rutas tipadas. Usar `{ pathname: '/libro/[isbn]', params: { isbn } }` |
| 25 | Estilo en línea con color y tamaños fijos | Mala práctica | No usa `StyleSheet.create` ni el tema, y crea un objeto en cada render. Pasarlo a `estilos` con valores de `tema.ts` |
| 33-36 | `ScrollView` + `map` | Rendimiento | Renderiza todos los elementos aunque no se vean. Usar `FlatList` |
| 35 | `key={i}` (índice) | Advertencia / error sutil | Si la lista cambia de orden, React reutiliza filas equivocadas. Usar el ISBN |
| 37-39 | Botón que es solo un ícono, sin `accessibilityRole` ni `accessibilityLabel`, y probablemente de menos de 44×44 | Mala práctica (accesibilidad) | El lector de pantalla dice solo «botón». Agregar rol, etiqueta («Escanear código de barras») y área táctil mínima |

**b) El efecto sin dependencias durante el primer minuto**

1. Render 1 con `libros = []`. Después de pintar corre el efecto y pide los libros.
2. A los ~800 ms llega un **array nuevo** (`LIBROS.map(l => ({ ...l }))`), `setLibros` con una referencia distinta, y React vuelve a renderizar.
3. Después de ese render el efecto corre otra vez (no tiene array de dependencias) y pide de nuevo.
4. Se repite cada ~800 ms: unos 75 pedidos por minuto, re-render de toda la lista cada vez, batería y datos gastados para nada. 1 de cada 5 pedidos falla con un rechazo sin manejar y aparecen advertencias en la consola.

Si `obtenerLibros()` devolviera **siempre el mismo array**, el segundo `setLibros` recibiría la misma referencia que ya está en el estado. React compara con `Object.is`, ve que no cambió y no vuelve a renderizar, así que el ciclo se corta después del segundo pedido. El bug seguiría ahí, pero quedaría escondido, y volvería a aparecer el día que la API real devuelva objetos nuevos. Esto es justamente lo que el comentario de `api.ts` simula.

**c) Reescrita con lo de mi app** (es mi `src/app/(tabs)/(catalogo)/index.tsx`):

```tsx
export default function Catalogo() {
  const { libros, cargando, error, reintentar } = useLibros();
  const { recientes, prestamos, esperas } = useBiblioteca();

  function renderVacio() {
    if (cargando) return <EstadoCarga mensaje="Buscando en los estantes…" />;
    if (error) {
      return (
        <EstadoMensaje tono="error" titulo="No pudimos cargar el catálogo" detalle={error}
          accion={{ titulo: 'Reintentar', onPress: reintentar }} />
      );
    }
    return (
      <EstadoMensaje titulo="El catálogo está vacío"
        detalle="Todavía no hay libros cargados. Volvé a intentarlo más tarde."
        accion={{ titulo: 'Actualizar', onPress: reintentar }} />
    );
  }

  return (
    <FlatList
      data={cargando || error ? [] : libros}
      keyExtractor={(libro) => libro.isbn}
      numColumns={2}
      columnWrapperStyle={estilos.columnas}
      renderItem={({ item }) => (
        <TarjetaLibro
          libro={item}
          disponibles={ejemplaresDisponibles(item, prestamos)}
          enEspera={esperas[item.isbn]?.tamanio ?? 0}
        />
      )}
      ListHeaderComponent={<EncabezadoCatalogo recientes={recientes} />}
      ListEmptyComponent={renderVacio()}
      contentContainerStyle={estilos.lista}
    />
  );
}
```

El botón de escanear vive en `EncabezadoCatalogo` con `accessibilityRole="button"` y `accessibilityLabel`. Los permisos no se piden acá: se piden en `/escanear` y en el interruptor «Recordarme».

**d)** El problema que puede provocar el **rechazo en la tienda** es pedir cámara y notificaciones al abrir, sin explicar para qué (líneas 13-16). Las guías de Apple piden solicitar los permisos cuando la función se usa y con un propósito claro, y un pedido sin relación con lo que la persona está haciendo es motivo habitual de observación. El que haría que una persona la **desinstale primero** es el mismo: lo primero que ve al abrir la app son dos diálogos del sistema seguidos, sin saber por qué. Si pasa eso, el consumo constante de datos y batería del efecto sin dependencias termina de convencerla.

### E2. Organización y acoplamiento

**a)** Las importaciones van en una sola dirección:

```
app ──► components ──► hooks ──► context ──► estructuras
 │          │            │          │
 │          └────────────┴──────────┴──► lib ──► data
 │                                       │
 └──► (todas) ──► constants, types ◄─────┘
```

- `app` importa `components`, `hooks`, `lib`, `constants`, `context` (solo el Provider, en el layout) y `types`.
- `components` importa `hooks`, `lib`, `constants` y `types`.
- `hooks` importa `context`, `lib` y `types`.
- `context` importa `estructuras`, `lib`, `data`, `constants` y `types`.
- `lib` importa `data`, `constants` y `types`.
- `estructuras`, `data`, `types` y `constants` no importan nada del proyecto (salvo tipos).

No hay importaciones «hacia arriba». Lo comprobé buscando `from '@/app'` o `'../app'` fuera de `src/app`, y no hay ninguna. Sería un problema porque `src/app` son pantallas: si un hook importara una pantalla, cambiar la UI rompería la lógica, se podrían formar ciclos de importación, y Expo Router trataría como ruta cualquier archivo que alguien moviera ahí.

**b)** Con una API real cambiarían `src/lib/api.ts` (las llamadas HTTP) y **también** `src/lib/catalogo.ts`, porque `buscarLibroPorIsbn` lee `LIBROS` en forma sincrónica. Eso arrastra a las pantallas que la usan (Detalle, Reservar, Escáner, Mis reservas y el Context), que hoy dan por hecho que el libro está disponible al instante y no tienen estado de carga. La lista tiene más de dos archivos, y eso me dice que tomé un atajo: el «buscar un libro por ISBN» debería pasar por la misma capa de datos que `obtenerLibros` (por ejemplo, un hook `useLibro(isbn)` con sus estados), así el cambio quedaría en `api.ts` y en ese hook.

**c)** Con `<ConPermiso recurso="camara">` **ganaría** menos código repetido en cada pantalla y un comportamiento uniforme. **Perdería** flexibilidad. En `/escanear` el ingreso manual tiene que estar visible en los cuatro estados, y la tarjeta de «preguntable» o «bloqueado» convive con él. Un envoltorio que muestra a sus hijos solo cuando hay permiso me obligaría a pasarle por props qué mostrar en cada estado, y termina siendo un `usePermiso` con más pasos. Para las **notificaciones** no sirve: el permiso no se pide al abrir una pantalla, sino al activar un `Switch` dentro de una fila de la lista, y no hay ningún hijo que «envolver». Por eso prefiero el hook, que devuelve el estado y las acciones y deja a cada pantalla decidir cómo mostrarlo.

### E3. Mapa de fallas

| Situación | Qué ve la persona | Dónde se maneja |
|---|---|---|
| `obtenerLibros()` falla | «No pudimos cargar el catálogo» con el detalle en español y el botón «Reintentar» | `src/hooks/useLibros.ts` líneas 29-36; `src/app/(tabs)/(catalogo)/index.tsx` líneas 16-29 |
| Se abre `/libro/abc` | «El código no es un ISBN válido» y el enlace «Ir al catálogo» | `src/app/(tabs)/(catalogo)/libro/[isbn].tsx` líneas 20-21 y 31-47 |
| Se escanea un ISBN que no está | Aviso rojo sobre la cámara durante 2,5 s; se puede seguir escaneando | `src/app/escanear.tsx` líneas 44-50 y 25-31 |
| La cámara está bloqueada | «La cámara está desactivada», «Abrir Ajustes» y el ingreso manual del ISBN | `src/app/escanear.tsx` líneas 85-96; `src/hooks/usePermiso.ts` línea 19 |
| Notificaciones denegadas | En Mis reservas: «Notificaciones apagadas: tus avisos aparecen en esta pantalla» y los avisos dentro de la app | `src/components/EstadoNotificaciones.tsx`; `src/context/BibliotecaContext.tsx` líneas 259-263; `src/components/ExplicacionPermiso.tsx` |
| Reservar un libro ya reservado | En el Detalle no aparece el botón (dice «Lo tenés vos…» o «Estás en la lista de espera…»). Si se llega por URL a `/reservar/…`: «Ya tenés este libro en préstamo.» y el botón se deshabilita | `BibliotecaContext.tsx` líneas 160-172; `src/app/reservar/[isbn].tsx` líneas 43-46 y 78 |
| «Entregar al siguiente» con la lista vacía | El libro no aparece en el mostrador; si se vaciara justo, el botón queda deshabilitado y se lee «La lista … ya estaba vacía» | `src/components/FilaMostrador.tsx` línea 35; `BibliotecaContext.tsx` línea 239; `src/app/mostrador.tsx` línea 28 |
| Login con clave incorrecta | «Usuario o clave incorrectos. Revisalos e intentá de nuevo.» y se borra la clave | `src/app/login.tsx` líneas 15-19 |

### E4. Decisiones con argumentos

**a) Identificador: ISBN.** Lo elegí como parámetro de ruta y como `key`. Es el dato que trae el código de barras, así que el escáner abre el detalle sin ninguna traducción, y la URL `/libro/9789507310010` se entiende y se puede compartir. Dos ediciones del mismo título tienen ISBN distinto, y eso está bien: para la biblioteca son libros distintos (otra traducción, otra paginación). `useLocalSearchParams` devuelve siempre `string` (o `string[]`), nunca `number`: con un id numérico igual tendría que convertir y validar, y un ISBN guardado como número perdería los ceros iniciales. Lo trato como texto y valido que tenga 13 dígitos. El punto débil son los libros sin ISBN (ediciones viejas o donaciones). Para ellos haría falta un identificador interno, que podría tener la misma forma (13 dígitos con un prefijo propio de la biblioteca) para no cambiar ni las rutas ni el escáner.

**b) Estructuras: clase con `#items`.** La clase me dio **encapsulamiento**: nadie puede hacer `cola.items.shift()` ni saltearse el orden de llegada. También me dio una `Cola` con desencolado O(1) sin `shift()` y algo fácil de testear por separado (7 tests). Lo que complicó fue **combinarla con React**. Es mutable, y React compara por referencia, así que tuve que crear una instancia nueva en cada cambio (ver B3). Además, no se puede serializar: para guardarla en AsyncStorage paso por `aArray()` y la reconstruyo al cargar. Con un array en el estado (`[...pila, x]`, `slice`) eso sale gratis, pero el «sin `shift()`» y el «nadie se cuela» quedan como convenciones que nadie verifica.

**c) Memorización.** Uso `useMemo` en el `value` del Context (`BibliotecaContext.tsx`, línea 286) y `useCallback` en sus funciones. Ahí aportan: sin ellos, cada render del Provider crearía un objeto nuevo y se re-renderizarían todos los consumidores aunque no cambiara ningún dato. Además, `registrarVisto` es dependencia de un efecto en el Detalle (línea 28): si cambiara en cada render, el efecto correría de más. Serían ruido, por ejemplo, en `colorIcono` del layout de tabs o en armar `filasEspera` en Mis reservas: son cálculos de microsegundos sobre 3 o 4 elementos, y memorizarlos agrega dependencias para mantener sin ganar nada. Para comprobarlo y no suponerlo usaría el **Profiler de React DevTools** (Expo: tecla `j` para abrir las herramientas), con la opción «Record why each component rendered», y compararía cantidad y duración de renders con y sin la memorización.

**d) Datos duplicados: los calculo.** `ejemplaresDisponibles` (`src/lib/catalogo.ts`, líneas 18-23) resta a los ejemplares iniciales los préstamos que salieron del estante. No guardo el número en ningún lado. Si lo guardara aparte (por ejemplo, restando 1 al reservar), tendría el mismo dato en dos lugares, el contador y la lista de préstamos, y bastaría con olvidar actualizar uno para que se desincronicen: devolver un libro sin sumar 1 dejaría «Sin ejemplares» para siempre, o una entrega desde la lista de espera restaría dos veces. Al calcularlo, la única fuente es la lista de préstamos: devolver es sacar el préstamo y el número se corrige solo. Por eso cada préstamo guarda su `origen` (`estante` o `espera`): los que vienen de la lista de espera corresponden a un ejemplar devuelto y no restan del estante.
