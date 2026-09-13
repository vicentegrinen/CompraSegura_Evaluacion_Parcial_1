document.addEventListener("DOMContentLoaded", function () {
  const reglas = {
    correo: validarCorreo,
    clave: validarClaveIngreso
  };

  const formulario = conectar("formulario", reglas, "botonIngresar");

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    ingresar(formulario);
  });
});

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

function ingresar(formulario) {
  const aviso = document.getElementById("aviso");
  aviso.classList.remove("visible");

  if (!formulario.revisar(true)) {
    aviso.textContent = "Revise los campos marcados en rojo.";
    aviso.classList.add("visible");
    return;
  }

  const correo = document.getElementById("correo").value.trim().toLowerCase();
  const clave = document.getElementById("clave").value;
  const cuenta = buscarCuenta(correo, clave);

  if (cuenta === "pendiente") {
    aviso.textContent = "Su registro esta pendiente de aprobacion.";
    aviso.classList.add("visible");
    return;
  }

  if (!cuenta) {
    aviso.textContent = "Correo o contrasena incorrectos.";
    aviso.classList.add("visible");
    return;
  }

  entrar(cuenta);
  window.location.href = cuenta.inicio;
}
