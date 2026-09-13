const PESO_PLAZO = 0.40;
const PESO_CALIDAD = 0.35;
const PESO_PRECIO = 0.25;

const NOTA_MINIMA = 3.6;

const SOBREPRECIO_MAXIMO = 0.10;

function entregasDe(rut) {
  return todasLasSolicitudes().filter(function (p) {
    return p.rut === rut && (p.estado === "Recibida" || p.estado === "Cerrada");
  });
}

function sobreprecioDe(rut) {
  const suyos = productos.filter(function (p) { return p.rut === rut; });
  let suma = 0;

  suyos.forEach(function (p) {
    suma = suma + (p.precio - p.precioMercado) / p.precioMercado;
  });

  return suma / suyos.length;
}

function evaluar(rut) {
  const entregas = entregasDe(rut);

  const aTiempo = entregas.filter(function (p) { return p.aTiempo; }).length;
  const conformes = entregas.filter(function (p) { return p.conforme; }).length;

  const plazo = 5 * (aTiempo / entregas.length);
  const calidad = 5 * (conformes / entregas.length);

  const sobreprecio = sobreprecioDe(rut);
  let precio = 5 * (1 - sobreprecio / 0.30);
  if (precio > 5) { precio = 5; }
  if (precio < 0) { precio = 0; }

  const nota = plazo * PESO_PLAZO + calidad * PESO_CALIDAD + precio * PESO_PRECIO;
  const proveedor = buscarProveedor(rut);

  return {
    rut: rut,
    nombre: proveedor.nombre,
    logo: proveedor.logo,
    categoria: proveedor.categoria,
    plazo: plazo,
    calidad: calidad,
    precio: precio,
    sobreprecio: sobreprecio,
    entregas: entregas.length,
    aTiempo: aTiempo,
    conformes: conformes,
    nota: Math.round(nota * 10) / 10
  };
}

function ranking() {
  const lista = proveedores.map(function (p) { return evaluar(p.rut); });

  lista.sort(function (a, b) { return b.nota - a.nota; });

  return lista;
}

function problemasDe(evaluacion) {
  const lista = [];

  if (evaluacion.nota < NOTA_MINIMA) {
    lista.push("Nota bajo el minimo de " + NOTA_MINIMA.toFixed(1));
  }
  if (evaluacion.aTiempo < evaluacion.entregas) {
    lista.push((evaluacion.entregas - evaluacion.aTiempo) + " entregas atrasadas");
  }
  if (evaluacion.conformes < evaluacion.entregas) {
    lista.push((evaluacion.entregas - evaluacion.conformes) + " entregas rechazadas");
  }
  if (evaluacion.sobreprecio >= SOBREPRECIO_MAXIMO) {
    lista.push(Math.round(evaluacion.sobreprecio * 100) + " por ciento sobre el mercado");
  }

  return lista;
}

function claseNota(nota) {
  if (nota >= 4.0) { return "nota alta"; }
  if (nota >= NOTA_MINIMA) { return "nota media"; }
  return "nota baja";
}

function dibujarFichas(idCaja) {
  const caja = document.getElementById(idCaja);
  caja.innerHTML = "";

  ranking().forEach(function (evaluacion, posicion) {
    const problemas = problemasDe(evaluacion);

    let etiquetas = '<span class="problema ninguno">Sin problemas</span>';

    if (problemas.length > 0) {
      etiquetas = "";
      problemas.forEach(function (texto) {
        etiquetas = etiquetas + '<span class="problema">' + texto + "</span>";
      });
    }

    const ficha = document.createElement("div");
    ficha.className = evaluacion.nota < NOTA_MINIMA ? "ficha critica" : "ficha";
    ficha.innerHTML =
      '<div class="puesto">' + (posicion + 1) + "</div>" +
      '<div class="identidad"><strong>' + evaluacion.nombre + "</strong>" +
      "<span>" + nombreCategoria(evaluacion.categoria) + "</span></div>" +
      '<div class="puntajes">' +
      "<div>Plazo<b>" + evaluacion.plazo.toFixed(1) + "</b></div>" +
      "<div>Calidad<b>" + evaluacion.calidad.toFixed(1) + "</b></div>" +
      "<div>Precio<b>" + evaluacion.precio.toFixed(1) + "</b></div>" +
      "</div>" +
      '<span class="' + claseNota(evaluacion.nota) + '">' + evaluacion.nota.toFixed(1) + "</span>" +
      '<div class="problemas">' + etiquetas + "</div>";

    caja.appendChild(ficha);
  });
}
