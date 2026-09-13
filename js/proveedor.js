const ESPERAN_AL_PROVEEDOR = ["Solicitada", "Aprobada"];

document.addEventListener("DOMContentLoaded", function () {

  const actual = exigirPerfil("proveedor");
  if (!actual) { return; }

  document.getElementById("bienvenida").textContent =
    actual.nombre + ", estas son las solicitudes que le llegaron.";

  dibujar(actual.rut);
});

function cambiosGuardados() {
  const dato = localStorage.getItem("estadosPedidos");
  return dato ? JSON.parse(dato) : {};
}

function pedidosDe(rut) {
  const cambios = cambiosGuardados();

  return todasLasSolicitudes().filter(function (p) {
    return p.rut === rut;
  }).map(function (p) {

    const copia = Object.assign({}, p);
    if (cambios[p.numero]) { copia.estado = cambios[p.numero]; }
    return copia;
  });
}

function dibujar(rut) {
  const mios = pedidosDe(rut);

  const pendientes = mios.filter(function (p) {
    return ESPERAN_AL_PROVEEDOR.includes(p.estado);
  });
  const resto = mios.filter(function (p) {
    return !ESPERAN_AL_PROVEEDOR.includes(p.estado);
  });

  document.getElementById("contadorPendientes").textContent = pendientes.length;

  pintarLista("listaPendientes", pendientes, "No hay solicitudes esperando su respuesta.");
  pintarLista("listaResto", resto, "Todavia no hay solicitudes en curso.");

  conectarBotones(rut);
}

function pintarLista(idCaja, lista, mensajeVacio) {
  const caja = document.getElementById(idCaja);
  caja.innerHTML = "";

  if (lista.length === 0) {
    caja.innerHTML = '<p class="ayuda">' + mensajeVacio + "</p>";
    return;
  }

  lista.forEach(function (pedido) {
    caja.appendChild(tarjetaSolicitud(pedido));
  });
}

function tarjetaSolicitud(pedido) {
  const producto = buscarProducto(pedido.codigo);
  const total = producto.precio * pedido.cantidad;

  const alcanza = producto.stock >= pedido.cantidad;
  const claseStock = alcanza ? "stock-ok" : "stock-falta";
  const textoStock = alcanza
    ? "Alcanza"
    : "Faltan " + (pedido.cantidad - producto.stock) + " unidades";

  const posicion = flujoEstados.indexOf(pedido.estado);
  let avance = "";

  flujoEstados.forEach(function (estado, i) {
    const clase = i <= posicion ? " cumplido" : "";
    avance = avance + '<li class="paso' + clase + '">' + estado + "</li>";
  });

  const rechazada = pedido.estado === "Rechazada";
  const lineaAvance = rechazada ? "" : '<ul class="avance">' + avance + "</ul>";
  const textoEstado = rechazada
    ? "Rechazada por falta de stock o de condiciones."
    : detalleEstados[pedido.estado].texto;

  const tarjeta = document.createElement("article");
  tarjeta.className = "solicitud";
  tarjeta.innerHTML =
    '<div class="encabezado">' +
    "<strong>" + pedido.numero + "</strong>" +
    '<span class="estado ' + pedido.estado.toLowerCase() + '">' + pedido.estado + "</span>" +
    "</div>" +

    '<div class="datos-solicitud">' +
    "<div><span>Fecha de compra</span><b>" + pedido.fechaCompra + "</b></div>" +
    "<div><span>Fecha de entrega</span><b>" + pedido.fechaEntrega + "</b></div>" +
    "<div><span>Direccion de entrega</span><b>" + pedido.direccion + "</b></div>" +
    "</div>" +

    '<div class="tabla-caja" style="margin-top: 12px;">' +
    '<table style="min-width: 0;"><thead><tr>' +
    "<th>Producto</th><th>Pedido</th><th>Mi stock</th><th>Estado del stock</th>" +
    '<th class="derecha">Total</th>' +
    "</tr></thead><tbody><tr>" +
    "<td>" + producto.nombre + "</td>" +
    "<td>" + pedido.cantidad + "</td>" +
    "<td>" + producto.stock + "</td>" +
    '<td class="' + claseStock + '">' + textoStock + "</td>" +
    '<td class="derecha">' + formatearPrecio(total) + "</td>" +
    "</tr></tbody></table></div>" +

    lineaAvance +
    '<p class="ayuda">' + textoEstado + "</p>" +
    accion(pedido, alcanza);

  return tarjeta;
}

function accion(pedido, alcanza) {
  if (!ESPERAN_AL_PROVEEDOR.includes(pedido.estado)) {
    return '<p class="ayuda">Sin acciones pendientes de su parte.</p>';
  }

  const botonRechazar = '<button class="boton rojo chico rechazar" data-numero="' +
    pedido.numero + '">Rechazar</button>';

  if (pedido.estado === "Solicitada" && !alcanza) {
    return '<div class="acciones">' +
      '<span class="ayuda">No puede aprobar: el stock no alcanza.</span>' +
      botonRechazar + "</div>";
  }

  const posicion = flujoEstados.indexOf(pedido.estado);
  const proximo = flujoEstados[posicion + 1];

  return '<div class="acciones">' +
    '<button class="boton verde chico avanzar" data-numero="' + pedido.numero +
    '" data-estado="' + proximo + '">' + detalleEstados[pedido.estado].accion + "</button>" +
    botonRechazar + "</div>";
}

function conectarBotones(rut) {
  document.querySelectorAll(".avanzar").forEach(function (boton) {
    boton.addEventListener("click", function () {
      cambiarEstado(boton.dataset.numero, boton.dataset.estado, rut);
    });
  });

  document.querySelectorAll(".rechazar").forEach(function (boton) {
    boton.addEventListener("click", function () {
      cambiarEstado(boton.dataset.numero, "Rechazada", rut);
    });
  });
}

function cambiarEstado(numero, estado, rut) {
  const cambios = cambiosGuardados();
  cambios[numero] = estado;
  localStorage.setItem("estadosPedidos", JSON.stringify(cambios));

  const aviso = document.getElementById("aviso");
  aviso.textContent = "La solicitud " + numero + " quedo en estado " + estado + ".";
  aviso.classList.add("visible");

  dibujar(rut);
  window.scrollTo(0, 0);
}
