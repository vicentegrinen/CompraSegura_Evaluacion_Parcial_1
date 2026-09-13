document.addEventListener("DOMContentLoaded", function () {

  document.getElementById("botonPagar").addEventListener("click", pagar);

  llenarDirecciones();
  dibujarCarrito();
});

function avisarDireccion(direccion) {
  const error = document.getElementById("errorDireccion");
  const campo = error.closest(".campo");

  campo.classList.remove("bueno", "malo");

  if (direccion === "") {
    campo.classList.add("malo");
    error.textContent = "Elija donde quiere recibir el pedido.";
    error.classList.add("visible");
    return false;
  }

  campo.classList.add("bueno");
  error.textContent = "";
  error.classList.remove("visible");

  return true;
}

function llenarDirecciones() {
  const lista = document.getElementById("direccion");

  direccionesEntrega.forEach(function (texto) {
    const opcion = document.createElement("option");
    opcion.value = texto;
    opcion.textContent = texto;
    lista.appendChild(opcion);
  });

  lista.addEventListener("change", function () {
    avisarDireccion(lista.value);
  });
}

function dibujarCarrito() {
  const lista = leerCarrito();
  const cuerpo = document.getElementById("cuerpoCarrito");

  document.getElementById("zonaCarrito").style.display = lista.length === 0 ? "none" : "block";
  document.getElementById("carritoVacio").style.display = lista.length === 0 ? "block" : "none";

  cuerpo.innerHTML = "";
  let totalProductos = 0;

  lista.forEach(function (item) {
    const producto = buscarProducto(item.codigo);
    const subtotal = producto.precio * item.cantidad;
    totalProductos = totalProductos + subtotal;

    const fila = document.createElement("tr");
    fila.innerHTML =
      "<td>" + producto.nombre + "</td>" +
      "<td>" + formatearPrecio(producto.precio) + "</td>" +
      '<td><input type="number" class="cantidad" data-codigo="' + item.codigo +
      '" value="' + item.cantidad + '" min="1" max="' + producto.stock +
      '" style="width: 70px;"></td>' +
      '<td class="derecha">' + formatearPrecio(subtotal) + "</td>" +
      '<td><button class="boton rojo chico quitar" data-codigo="' + item.codigo +
      '">Quitar</button></td>';

    cuerpo.appendChild(fila);
  });

  const envio = lista.length === 0 ? 0 : costoEnvio;

  document.getElementById("totalProductos").textContent = formatearPrecio(totalProductos);
  document.getElementById("totalEnvio").textContent = formatearPrecio(envio);
  document.getElementById("totalPagar").textContent = formatearPrecio(totalProductos + envio);

  conectarBotones();
}

function conectarBotones() {
  document.querySelectorAll(".cantidad").forEach(function (campo) {
    campo.addEventListener("change", function () {
      const cantidad = Number(campo.value);
      const producto = buscarProducto(campo.dataset.codigo);

      let valida = cantidad;
      if (valida < 1) { valida = 1; }
      if (valida > producto.stock) { valida = producto.stock; }

      const lista = leerCarrito();
      lista.find(function (i) { return i.codigo === campo.dataset.codigo; }).cantidad = valida;

      guardarCarrito(lista);
      dibujarCarrito();
    });
  });

  document.querySelectorAll(".quitar").forEach(function (boton) {
    boton.addEventListener("click", function () {
      const lista = leerCarrito().filter(function (i) {
        return i.codigo !== boton.dataset.codigo;
      });

      guardarCarrito(lista);
      dibujarCarrito();
    });
  });
}

function pagar() {
  const lista = leerCarrito();
  if (lista.length === 0) { return; }

  const direccion = document.getElementById("direccion").value;

  if (!avisarDireccion(direccion)) { return; }

  const solicitudes = crearSolicitudes(lista, direccion);

  let totalProductos = 0;
  let filas = "";

  solicitudes.forEach(function (solicitud) {
    const producto = buscarProducto(solicitud.codigo);
    const subtotal = producto.precio * solicitud.cantidad;
    totalProductos = totalProductos + subtotal;

    filas = filas +
      "<tr><td>" + solicitud.numero + "</td>" +
      "<td>" + producto.nombre + "</td>" +
      "<td>" + buscarProveedor(solicitud.rut).nombre + "</td>" +
      "<td>" + solicitud.cantidad + "</td>" +
      '<td class="derecha">' + formatearPrecio(subtotal) + "</td></tr>";
  });

  const total = totalProductos + costoEnvio;

  const numero = "BOL-" + Date.now().toString().slice(-6);
  const fecha = new Date().toLocaleDateString("es-CL");

  document.getElementById("numeroBoleta").textContent = numero + " - " + fecha;
  document.getElementById("detalleBoleta").innerHTML =
    '<p class="ayuda">Entrega en ' + direccion + ". Plazo de " +
    PLAZO_DE_ENTREGA + " dias. Cada linea se envio como una solicitud al proveedor " +
    "que vende el producto.</p>" +
    '<div class="tabla-caja"><table style="min-width: 0;"><thead><tr>' +
    "<th>Solicitud</th><th>Producto</th><th>Proveedor</th><th>Cantidad</th>" +
    '<th class="derecha">Subtotal</th>' +
    "</tr></thead><tbody>" + filas + "</tbody></table></div>" +
    '<div class="linea-barra" style="margin-top: 16px;">' +
    '<div class="texto"><span>Productos</span><strong>' + formatearPrecio(totalProductos) + "</strong></div>" +
    '<div class="texto"><span>Envio</span><strong>' + formatearPrecio(costoEnvio) + "</strong></div>" +
    '<div class="texto" style="font-size: 18px;"><span>Total pagado</span><strong>' +
    formatearPrecio(total) + "</strong></div></div>";

  document.getElementById("boleta").style.display = "block";

  const aviso = document.getElementById("aviso");
  aviso.textContent = "Compra realizada por " + formatearPrecio(total) + ".";
  aviso.classList.add("visible");

  guardarCarrito([]);
  dibujarCarrito();

  document.getElementById("carritoVacio").style.display = "none";

  window.scrollTo(0, 0);
}
