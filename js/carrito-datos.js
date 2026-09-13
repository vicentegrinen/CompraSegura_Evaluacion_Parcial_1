function leerCarrito() {
  const dato = localStorage.getItem("carrito");
  return dato ? JSON.parse(dato) : [];
}

function guardarCarrito(lista) {
  localStorage.setItem("carrito", JSON.stringify(lista));
  actualizarContador();
}

function agregarAlCarrito(codigo) {
  const lista = leerCarrito();
  const existente = lista.find(function (item) { return item.codigo === codigo; });

  if (existente) {
    existente.cantidad = existente.cantidad + 1;
  } else {
    lista.push({ codigo: codigo, cantidad: 1 });
  }

  guardarCarrito(lista);
}

function actualizarContador() {
  const lugar = document.getElementById("contadorCarrito");
  if (!lugar) { return; }

  let total = 0;
  leerCarrito().forEach(function (item) { total = total + item.cantidad; });

  lugar.textContent = total;
}
