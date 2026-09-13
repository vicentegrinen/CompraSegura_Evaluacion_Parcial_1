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
