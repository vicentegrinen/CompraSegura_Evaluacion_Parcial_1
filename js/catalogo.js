document.addEventListener("DOMContentLoaded", function () {
  llenarFiltro();
  dibujar(disponibles());

  document.getElementById("filtroCategoria").addEventListener("change", filtrar);
});

function llenarFiltro() {
  const select = document.getElementById("filtroCategoria");

  categorias.forEach(function (cat) {
    const opcion = document.createElement("option");
    opcion.value = cat.codigo;
    opcion.textContent = cat.nombre;
    select.appendChild(opcion);
  });
}

function disponibles() {
  const fuera = JSON.parse(localStorage.getItem("suspendidos") || "[]")
    .concat(JSON.parse(localStorage.getItem("eliminados") || "[]"));

  return productos.filter(function (p) {
    return !fuera.includes(p.rut);
  });
}

function filtrar() {
  const elegida = document.getElementById("filtroCategoria").value;

  const lista = disponibles().filter(function (p) {
    return elegida === "" || p.categoria === elegida;
  });

  dibujar(lista);
}

function dibujar(lista) {
  const grilla = document.getElementById("grilla");

  grilla.innerHTML = "";
  document.getElementById("contadorProductos").textContent = lista.length;

  lista.forEach(function (producto) {
    const proveedor = buscarProveedor(producto.rut);

    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta";
    tarjeta.innerHTML =
      '<img src="' + producto.imagen + '" alt="' + producto.nombre + '">' +
      '<div class="datos">' +
      '<span class="categoria">' + nombreCategoria(producto.categoria) + "</span>" +
      '<span class="nombre">' + producto.nombre + "</span>" +
      '<span class="proveedor">' + proveedor.nombre + "</span>" +
      '<span class="precio">' + formatearPrecio(producto.precio) + "</span>" +
      '<button class="boton naranja chico agregar" data-codigo="' + producto.codigo +
      '">Agregar al carrito</button>' +
      "</div>";

    grilla.appendChild(tarjeta);
  });

  document.querySelectorAll(".agregar").forEach(function (boton) {
    boton.addEventListener("click", function () {
      agregarAlCarrito(boton.dataset.codigo);
      boton.textContent = "Agregado";

      setTimeout(function () { boton.textContent = "Agregar al carrito"; }, 1000);
    });
  });
}
