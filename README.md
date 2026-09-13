# CompraSegura - Gestion de proveedores

CompraSegura compra materiales de construccion a 2.500 proveedores usando
planillas Excel y correos. Este sitio digitaliza ese proceso: el comprador
arma su pedido, el proveedor lo revisa contra su stock y lo hace avanzar,
el analista evalua a los proveedores y el administrador toma decisiones.

## Equipo

| Integrante | Responsabilidad |
| Angela Carrasco Oliva | Estructura HTML, hoja de estilos y documento ERS |
| Vicente Grinen Peralta | Catalogo, carrito y vista del proveedor |
| Benjamin Sanhueza Aravena | Validaciones, evaluacion y vistas internas |

## Tecnologias

HTML5, CSS3 y JavaScript. Sin frameworks ni librerias externas.
No hay base de datos: los datos viven en arreglos de JavaScript y el
navegador conserva los cambios con localStorage.

## Las vistas

La parte publica es el catalogo. El portal interno se entra por el enlace
"Nuestra empresa" del menu o del pie de pagina.

| Archivo | Quien la usa | Que hace |
|---|---|---|
| `index.html` | Comprador | Catalogo con filtro por categoria y video institucional |
| `carrito.html` | Comprador | Pedido con subtotales, envio, total y boleta al pagar |
| `portal.html` | Publico | Entrada del portal: crear registro o iniciar sesion |
| `registro.html` | Proveedor | Postular como proveedor. La cuenta queda pendiente |
| `login.html` | Proveedor, analista, administrador | Ingreso, con redireccion segun el perfil |
| `proveedor.html` | Proveedor | Sus solicitudes con el stock al lado y la linea de avance |
| `analista.html` | Analista | Resumen con la nota de cada proveedor y detalle por entrega |
| `administrador.html` | Administrador | Reportes, presupuesto y decisiones sobre proveedores |

## Cuentas de prueba

No se muestran en la pantalla de ingreso. Se anotan aqui para poder probar.

| Perfil | Correo | Clave |
|---|---|---|
| Proveedor | ferreteria@gmail.com | 1234 |
| Proveedor | maderas@gmail.com | 1234 |
| Analista | analista@duoc.cl | 1234 |
| Administrador | admin@duoc.cl | 1234 |
| Comprador | comprador@duoc.cl | 1234 |

Al ingresar, el menu muestra el nombre y el perfil de la persona conectada,
por ejemplo "Paula Vera - Analista".

## Estructura de carpetas

```
comprasegura/
  index.html            Catalogo
  carrito.html          Carrito y boleta
  portal.html           Entrada del portal de proveedores
  registro.html         Postulacion de proveedor
  login.html            Ingreso
  proveedor.html        Solicitudes del proveedor
  analista.html         Evaluacion de proveedores
  administrador.html    Reportes y decisiones
  css/
    styles.css          Unica hoja de estilos
  js/
    datos.js            Proveedores, productos, solicitudes y estados
    solicitudes.js      Junta el historial con lo que se compra en el carrito
    evaluacion.js       Calculo de la nota, problemas y fichas
    validaciones.js     Reglas de los formularios
    regiones.js         Regiones y comunas
    sesion.js           Cuentas, ingreso y menu
    carrito-datos.js    Guardar el carrito en el navegador
    catalogo.js         Grilla y filtro del catalogo
    carrito.js          Totales y boleta
    registro.js         Formulario de registro
    login.js            Formulario de ingreso
    proveedor.js        Solicitudes, stock y avance
    analista.js         Resumen y detalle de entregas
    administrador.js    Reportes y decisiones
  img/                  Logo, imagenes y video
```

## Como se registra un proveedor

1. El proveedor entra a `portal.html` y elige "Crear registro de proveedor".
2. Llena el formulario. La cuenta se guarda con estado Pendiente.
3. Si intenta ingresar antes de tiempo, el sistema le avisa que su registro
   esta pendiente de aprobacion.
4. El administrador la ve arriba en su tabla de decisiones y presiona
   "Aprobar registro".
5. Desde ese momento el proveedor puede iniciar sesion.

Solo el proveedor crea cuenta. Las cuentas de analista y administrador son
internas y ya vienen cargadas.

## Del carrito a la solicitud

Cuando el comprador paga, la compra no se queda en la boleta: se convierte en
solicitudes para los proveedores.

1. En el carrito se elige la direccion de entrega. Sin direccion no se puede
   pagar, porque el proveedor no sabria donde entregar.
2. Cada linea del carrito genera una solicitud separada, dirigida al proveedor
   que vende ese producto. Se separan porque cada una la aprueba y la despacha
   su propio proveedor, y avanza de estado por su cuenta.
3. La solicitud nace en estado Solicitada, con la fecha del dia y un plazo de
   entrega de 7 dias.
4. El proveedor la ve enseguida en su lista de pendientes, y el administrador
   la suma a sus reportes.

Esto vive en `solicitudes.js`. La funcion `todasLasSolicitudes()` junta el
historial de `datos.js` con lo comprado, y todas las vistas leen desde ahi:
ninguna usa el arreglo `pedidos` directamente.

## Los cinco estados de una solicitud

| Estado | Que significa | Quien lo cambia |
|---|---|---|
| Solicitada | Pendiente de aprobacion del proveedor | Proveedor: Aprobar |
| Aprobada | Aprobada y en preparacion | Proveedor: Marcar como enviada |
| Enviada | Despachada, en camino a la bodega | CompraSegura |
| Recibida | Recibida en bodega, en control de calidad | CompraSegura |
| Cerrada | Cerrada y facturada | CompraSegura |

El proveedor solo mueve la solicitud hasta Enviada. Recibir y cerrar le
corresponde a CompraSegura. Cada tarjeta muestra la fecha de compra, la
fecha de entrega, la direccion, lo pedido contra el stock en bodega y una
linea de avance con los cinco pasos.

## Como se calcula la nota del proveedor

No se escribe a mano: se calcula en `evaluacion.js` con las entregas que
ya se recibieron.

| Indicador | Peso | Como se mide |
|---|---|---|
| Cumplimiento de plazo | 40 % | Entregas que llegaron dentro del plazo |
| Calidad | 35 % | Entregas que pasaron el control de recepcion |
| Precio | 25 % | Distancia respecto del precio de mercado |

El puntaje de precio parte en 5 si esta en el mercado o mas barato, y baja
hasta 0 cuando cobra 30 por ciento mas.

Con estos datos el sistema entrega 4.5, 4.2, 4.0, 3.8 y 3.5, que son las
mismas notas del enunciado.

El analista ve dos paneles: el resumen con la nota y los problemas de cada
proveedor, y el detalle con una fila por entrega recibida, que es lo que
antes se llevaba a mano en una planilla Excel.

## Validaciones del registro

| Campo | Regla |
|---|---|
| RUT | Sin puntos ni guion, 7 a 9 caracteres, digito verificador modulo 11, acepta K |
| Nombre o razon social | 2 a 100 caracteres. Letras, numeros, espacios y puntos |
| Correo | Un solo arroba, sin espacios, sin punto al inicio ni al final antes del arroba, sin puntos dobles. Solo @duoc.cl, @profesor.duoc.cl y @gmail.com |
| Telefono | Nueve digitos empezando en 9 |
| Categoria | Obligatoria |
| Dias de entrega | Entre 1 y 60 |
| Region y comuna | La comuna se carga segun la region elegida |
| Direccion | Obligatoria, maximo 300 caracteres |
| Contrasena | Entre 8 y 10 caracteres |
| Repetir contrasena | Debe coincidir |

El boton Crear cuenta esta bloqueado hasta que todos los campos sean validos.

En el ingreso la contrasena se acepta entre 4 y 10 caracteres. En el registro se subio a 8 porque el
documento no fija una regla para ese formulario.

## Reglas de negocio

1. Nadie se registra dos veces: se compara el RUT y el correo antes de guardar.
2. Una cuenta nueva no puede ingresar hasta que el administrador la aprueba.
3. El proveedor solo ve sus propias solicitudes.
4. Una solicitud no se puede aprobar si el stock no alcanza.
5. El proveedor no puede pasar una solicitud mas alla de Enviada.
6. Cada perfil entra solo a su vista. Si escribe otra direccion, vuelve al ingreso.
7. Un proveedor suspendido desaparece del catalogo pero sigue en el sistema.
8. Los proveedores con nota bajo 3.6 se marcan en rojo.
9. No se puede pagar sin elegir una direccion de entrega.
10. Una compra se reparte en una solicitud por producto, cada una a su proveedor.

## Como probar el sitio

1. Abrir `index.html`, filtrar por categoria y agregar productos al carrito.
2. Ir al carrito, cambiar cantidades, elegir la direccion y pagar. La boleta
   muestra el numero de solicitud que le llego a cada proveedor.
3. Bajar al pie de pagina, entrar por "Nuestra empresa" y crear un registro
   de proveedor. Intentar ingresar: avisa que esta pendiente.
4. Entrar con `admin@duoc.cl` y aprobar ese registro.
5. Entrar con el proveedor de ese producto: la solicitud recien comprada
   aparece arriba, en pendientes.
6. Entrar con `ferreteria@gmail.com`: una solicitud no se puede aprobar
   porque el stock no alcanza. Hacer avanzar otra y ver la linea de avance.
7. Entrar con `analista@duoc.cl`: el resumen con las notas y el detalle
   filtrado por proveedor.

## Convenciones del equipo

- Nombres de archivo en minuscula, sin tildes ni espacios.
- Nada de estilos dentro del HTML: todo va en `css/styles.css`.
- Cada integrante sube sus cambios con su propia cuenta de GitHub.
- El mensaje del commit dice que se modifico.
