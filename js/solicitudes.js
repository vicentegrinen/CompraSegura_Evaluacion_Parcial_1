const PLAZO_DE_ENTREGA = 7;

function solicitudesGuardadas() {
  const dato = localStorage.getItem("solicitudesNuevas");
  return dato ? JSON.parse(dato) : [];
}

function todasLasSolicitudes() {
  return pedidos.concat(solicitudesGuardadas());
}

function fechaEnTexto(fecha) {
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");

  return fecha.getFullYear() + "-" + mes + "-" + dia;
}

function sumarDias(fecha, dias) {
  const nueva = new Date(fecha.getTime());
  nueva.setDate(nueva.getDate() + dias);

  return nueva;
}

function crearSolicitudes(carrito, direccion) {
  const guardadas = solicitudesGuardadas();
  const hoy = new Date();

  let correlativo = todasLasSolicitudes().length;
  const nuevas = [];

  carrito.forEach(function (item) {
    const producto = buscarProducto(item.codigo);
    correlativo = correlativo + 1;

    nuevas.push({
      numero: "SC-" + String(correlativo).padStart(3, "0"),
      fechaCompra: fechaEnTexto(hoy),
      fechaEntrega: fechaEnTexto(sumarDias(hoy, PLAZO_DE_ENTREGA)),
      rut: producto.rut,
      codigo: item.codigo,
      cantidad: item.cantidad,
      direccion: direccion,
      estado: "Solicitada",
      aTiempo: null,
      conforme: null
    });
  });

  localStorage.setItem("solicitudesNuevas", JSON.stringify(guardadas.concat(nuevas)));

  return nuevas;
}
