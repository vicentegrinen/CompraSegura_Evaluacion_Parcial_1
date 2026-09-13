document.addEventListener("DOMContentLoaded", function () {

  if (!exigirPerfil("analista")) { return; }

  dibujarFichas("fichas");

  llenarFiltro();
  dibujarDetalle("");

  document.getElementById("filtroProveedor").addEventListener("change", function () {
    dibujarDetalle(this.value);
  });
});

function llenarFiltro() {
  const select = document.getElementById("filtroProveedor");

  proveedores.forEach(function (p) {
    const opcion = document.createElement("option");
    opcion.value = p.rut;
    opcion.textContent = p.nombre;
    select.appendChild(opcion);
  });
}

function dibujarDetalle(rut) {
  const cuerpo = document.getElementById("cuerpoDetalle");
  cuerpo.innerHTML = "";

  const entregas = todasLasSolicitudes().filter(function (p) {
    const recibida = p.estado === "Recibida" || p.estado === "Cerrada";
    return recibida && (rut === "" || p.rut === rut);
  });

  entregas.forEach(function (pedido) {
    const proveedor = buscarProveedor(pedido.rut);
    const producto = buscarProducto(pedido.codigo);

    const plazo = pedido.aTiempo
      ? '<span class="marca-ok">A tiempo</span>'
      : '<span class="marca-mal">Atrasada</span>';

    const calidad = pedido.conforme
      ? '<span class="marca-ok">Conforme</span>'
      : '<span class="marca-mal">Rechazada</span>';

    const fila = document.createElement("tr");
    fila.innerHTML =
      "<td>" + pedido.numero + "</td>" +
      "<td>" + proveedor.nombre + "</td>" +
      "<td>" + producto.nombre + "</td>" +
      "<td>" + pedido.fechaEntrega + "</td>" +
      "<td>" + plazo + "</td>" +
      "<td>" + calidad + "</td>" +
      '<td class="derecha">' + formatearPrecio(producto.precio * pedido.cantidad) + "</td>";

    cuerpo.appendChild(fila);
  });
}
