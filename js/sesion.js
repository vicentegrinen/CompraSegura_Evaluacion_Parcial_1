const cuentas = [
  { correo: "comprador@duoc.cl", clave: "1234", nombre: "Carlos Rojas", perfil: "comprador", inicio: "catalogo.html" },
  { correo: "analista@duoc.cl", clave: "1234", nombre: "Paula Vera", perfil: "analista", inicio: "analista.html" },
  { correo: "admin@duoc.cl", clave: "1234", nombre: "Luis Fuentes", perfil: "administrador", inicio: "administrador.html" },
  { correo: "ferreteria@gmail.com", clave: "1234", nombre: "Ferreteria Nacional", perfil: "proveedor", rut: "705678901", inicio: "proveedor.html" },
  { correo: "maderas@gmail.com", clave: "1234", nombre: "Maderas del Sur", perfil: "proveedor", rut: "761234560", inicio: "proveedor.html" }
];

function buscarCuenta(correo, clave) {
  const fija = cuentas.find(function (c) {
    return c.correo === correo && c.clave === clave;
  });

  if (fija) { return fija; }

  const dato = localStorage.getItem("cuentasNuevas");
  const nuevas = dato ? JSON.parse(dato) : [];

  const nueva = nuevas.find(function (c) {
    return c.correo === correo && c.clave === clave;
  });

  if (!nueva) { return null; }

  if (nueva.estado === "Pendiente") { return "pendiente"; }

  const destinos = {
    proveedor: "proveedor.html",
    analista: "analista.html",
    administrador: "administrador.html"
  };

  nueva.inicio = destinos[nueva.perfil];
  return nueva;
}

function entrar(cuenta) {
  localStorage.setItem("sesion", JSON.stringify(cuenta));
}

function usuario() {
  const dato = localStorage.getItem("sesion");
  return dato ? JSON.parse(dato) : null;
}

function salir() {
  localStorage.removeItem("sesion");
  window.location.href = "index.html";
}

function exigirPerfil(perfil) {
  const actual = usuario();

  if (!actual || actual.perfil !== perfil) {
    window.location.href = "login.html";
    return null;
  }
  return actual;
}

document.addEventListener("DOMContentLoaded", function () {
  const boton = document.getElementById("botonMenu");
  const menu = document.getElementById("menu");

  if (boton && menu) {
    boton.addEventListener("click", function () {
      menu.classList.toggle("abierto");
    });
  }

  const actual = usuario();
  const enlace = document.getElementById("enlaceSesion");
  const etiqueta = document.getElementById("usuarioConectado");

  if (actual && etiqueta) {

    const rol = actual.perfil.charAt(0).toUpperCase() + actual.perfil.slice(1);
    etiqueta.textContent = actual.nombre + " - " + rol;
  }

  if (enlace) {
    if (actual) {
      enlace.textContent = "Salir";
      enlace.setAttribute("href", "#");
      enlace.addEventListener("click", function (evento) {
        evento.preventDefault();
        salir();
      });
    } else {
      enlace.textContent = "Ingresar";
      enlace.setAttribute("href", "login.html");
    }
  }

  actualizarContador();
});
