// Popup de "Ingresar al sistema", reutilizable en cualquier pagina que incluya
// el marcado del modal (id="modalLogin") junto con este script.
// Usa IDs propios con prefijo "modalLogin" para no chocar con otros elementos
// que ya pueda tener la pagina (por ejemplo el "aviso" propio de carrito.html,
// proveedor.html o administrador.html).
// Depende de: js/sesion.js (cuentas, buscarCuenta, entrar) y js/validaciones.js
// (validarCorreo, validarClaveIngreso, conectar).
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("modalLogin");
  if (!modal) { return; }

  const enlaceSesion = document.getElementById("enlaceSesion");
  const botonIniciarSesion = document.getElementById("botonIniciarSesion");
  const enlaceLoginPie = document.getElementById("enlaceLoginPie");
  const botonCerrar = document.getElementById("modalLoginCerrar");

  function abrirModal(evento) {
    if (enlaceSesion && evento && evento.currentTarget === enlaceSesion &&
      enlaceSesion.textContent.trim().toLowerCase() !== "ingresar") {
      return;
    }
    if (evento) { evento.preventDefault(); }
    modal.hidden = false;
  }

  function cerrarModal() {
    modal.hidden = true;
  }

  if (enlaceSesion) { enlaceSesion.addEventListener("click", abrirModal); }
  if (botonIniciarSesion) { botonIniciarSesion.addEventListener("click", abrirModal); }
  if (enlaceLoginPie) { enlaceLoginPie.addEventListener("click", abrirModal); }
  if (botonCerrar) { botonCerrar.addEventListener("click", cerrarModal); }

  modal.addEventListener("click", function (evento) {
    if (evento.target === modal) { cerrarModal(); }
  });

  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape" && !modal.hidden) { cerrarModal(); }
  });

  const reglas = {
    modalLoginCorreo: validarCorreo,
    modalLoginClave: validarClaveIngreso
  };

  const formulario = conectar("modalLoginFormulario", reglas, "modalLoginBotonIngresar");

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const aviso = document.getElementById("modalLoginAviso");
    aviso.classList.remove("visible");

    if (!formulario.revisar(true)) {
      aviso.textContent = "Revise los campos marcados en rojo.";
      aviso.classList.add("visible");
      return;
    }

    const correo = document.getElementById("modalLoginCorreo").value.trim().toLowerCase();
    const clave = document.getElementById("modalLoginClave").value;
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
  });
});
