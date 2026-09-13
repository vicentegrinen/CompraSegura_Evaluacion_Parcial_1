document.addEventListener("DOMContentLoaded", function () {
  if (!exigirPerfil("administrador")) { return; }

  mostrarCifras();
  mostrarPresupuesto();
  mostrarGastos();
  dibujarFichas("fichas");
  mostrarDecisiones();
});

function totalComprado() {
  let total = 0;

  todasLasSolicitudes().forEach(function (pedido) {
    const producto = buscarProducto(pedido.codigo);
    total = total + producto.precio * pedido.cantidad;
  });

  return total;
}

function suspendidos() {
  const dato = localStorage.getItem("suspendidos");
  return dato ? JSON.parse(dato) : [];
}

function eliminados() {
  const dato = localStorage.getItem("eliminados");
  return dato ? JSON.parse(dato) : [];
}

function mostrarCifras() {
  const total = totalComprado();
  const bajos = ranking().filter(function (e) { return e.nota < NOTA_MINIMA; });

  const tarjetas = [
    { titulo: "Total comprado", valor: formatearPrecio(total) },
    { titulo: "Solicitudes", valor: todasLasSolicitudes().length },
    { titulo: "Proveedores activos", valor: proveedores.length - eliminados().length },
    { titulo: "Bajo el estandar", valor: bajos.length }
  ];

  const caja = document.getElementById("cifras");
  caja.innerHTML = "";

  tarjetas.forEach(function (t) {
    const div = document.createElement("div");
    div.className = "cifra";
    div.innerHTML = "<span>" + t.titulo + "</span><strong>" + t.valor + "</strong>";
    caja.appendChild(div);
  });
}

function mostrarPresupuesto() {
  const gastado = totalComprado();
  const porcentaje = (gastado / presupuestoMensual) * 100;

  let color = "";
  if (porcentaje > 100) { color = "rojo"; }
  else if (porcentaje > 85) { color = "naranja"; }

  const ancho = Math.min(porcentaje, 100);

  document.getElementById("presupuesto").innerHTML =
    '<div class="linea-barra">' +
    '<div class="texto"><span>Gastado ' + formatearPrecio(gastado) + " de " +
    formatearPrecio(presupuestoMensual) + "</span><strong>" +
    porcentaje.toFixed(1) + " por ciento</strong></div>" +
    '<div class="barra"><div class="' + color + '" style="width: ' + ancho + '%"></div></div>' +
    "</div>" +
    '<p class="ayuda">Disponible ' +
    formatearPrecio(Math.max(presupuestoMensual - gastado, 0)) + " para el resto del mes.</p>";
}

function mostrarGastos() {
  const totales = {};
  categorias.forEach(function (cat) { totales[cat.codigo] = 0; });

  todasLasSolicitudes().forEach(function (pedido) {
    const producto = buscarProducto(pedido.codigo);
    totales[producto.categoria] = totales[producto.categoria] + producto.precio * pedido.cantidad;
  });

  const filas = categorias.map(function (cat) {
    return { nombre: cat.nombre, valor: totales[cat.codigo] };
  });

  filas.sort(function (a, b) { return b.valor - a.valor; });
  const mayor = filas[0].valor;

  const caja = document.getElementById("gastos");
  caja.innerHTML = "";

  filas.forEach(function (fila) {
    const ancho = mayor === 0 ? 0 : (fila.valor / mayor) * 100;

    const div = document.createElement("div");
    div.className = "linea-barra";
    div.innerHTML =
      '<div class="texto"><span>' + fila.nombre + "</span><strong>" +
      formatearPrecio(fila.valor) + "</strong></div>" +
      '<div class="barra"><div style="width: ' + ancho + '%"></div></div>';

    caja.appendChild(div);
  });
}

function cuentasPendientes() {
  const dato = localStorage.getItem("cuentasNuevas");
  const lista = dato ? JSON.parse(dato) : [];

  return lista.filter(function (c) { return c.estado === "Pendiente"; });
}

function mostrarDecisiones() {
  const cuerpo = document.getElementById("cuerpoDecisiones");
  const fuera = eliminados();
  const pausa = suspendidos();

  cuerpo.innerHTML = "";

  cuentasPendientes().forEach(function (cuenta) {
    const fila = document.createElement("tr");
    fila.innerHTML =
      "<td>" + cuenta.nombre + "<br><small>" + cuenta.correo + "</small></td>" +
      '<td><span class="ayuda">Sin evaluar</span></td>' +
      '<td><span class="estado pendiente">Pendiente</span></td>' +
      '<td><button class="boton verde chico aprobar" data-rut="' + cuenta.rut +
      '">Aprobar registro</button></td>';

    cuerpo.appendChild(fila);
  });

  ranking().forEach(function (evaluacion) {
    if (fuera.includes(evaluacion.rut)) { return; }

    const suspendido = pausa.includes(evaluacion.rut);
    const estado = suspendido
      ? '<span class="estado rechazada">Suspendido</span>'
      : '<span class="estado aprobada">Activo</span>';

    const botonPausa = suspendido
      ? '<button class="boton verde chico suspender" data-rut="' + evaluacion.rut + '">Reactivar</button>'
      : '<button class="boton chico suspender" data-rut="' + evaluacion.rut + '">Suspender</button>';

    const fila = document.createElement("tr");
    fila.innerHTML =
      "<td>" + evaluacion.nombre + "</td>" +
      '<td><span class="' + claseNota(evaluacion.nota) + '">' + evaluacion.nota.toFixed(1) + "</span></td>" +
      "<td>" + estado + "</td>" +
      "<td>" + botonPausa +
      ' <button class="boton rojo chico eliminar" data-rut="' + evaluacion.rut + '">Eliminar</button></td>';

    cuerpo.appendChild(fila);
  });

  conectarDecisiones();
}

function conectarDecisiones() {

  document.querySelectorAll(".aprobar").forEach(function (boton) {
    boton.addEventListener("click", function () {
      const lista = JSON.parse(localStorage.getItem("cuentasNuevas") || "[]");

      const cuenta = lista.find(function (c) { return c.rut === boton.dataset.rut; });
      cuenta.estado = "Aprobada";

      localStorage.setItem("cuentasNuevas", JSON.stringify(lista));

      avisar(cuenta.nombre + " fue aprobado y ya puede ingresar al portal.");
      mostrarDecisiones();
    });
  });

  document.querySelectorAll(".suspender").forEach(function (boton) {
    boton.addEventListener("click", function () {
      const lista = suspendidos();
      const rut = boton.dataset.rut;

      if (lista.includes(rut)) {
        localStorage.setItem("suspendidos", JSON.stringify(
          lista.filter(function (r) { return r !== rut; })
        ));
        avisar(buscarProveedor(rut).nombre + " quedo activo otra vez.");
      } else {
        lista.push(rut);
        localStorage.setItem("suspendidos", JSON.stringify(lista));
        avisar(buscarProveedor(rut).nombre + " quedo suspendido.");
      }

      mostrarDecisiones();
    });
  });

  document.querySelectorAll(".eliminar").forEach(function (boton) {
    boton.addEventListener("click", function () {
      const rut = boton.dataset.rut;
      const nombre = buscarProveedor(rut).nombre;

      const lista = eliminados();
      lista.push(rut);
      localStorage.setItem("eliminados", JSON.stringify(lista));

      avisar(nombre + " fue eliminado del sistema.");
      mostrarDecisiones();
      mostrarCifras();
    });
  });
}

function avisar(texto) {
  const aviso = document.getElementById("aviso");
  aviso.textContent = texto;
  aviso.classList.add("visible");
  window.scrollTo(0, 0);
}
