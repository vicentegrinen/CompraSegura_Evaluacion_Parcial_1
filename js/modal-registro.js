// Popup de "Crear registro de proveedor", usado solo en portal.html.
// No se puede cargar js/registro.js tal cual porque sus IDs (formulario, rut,
// categoria, botonRegistrar, etc.) son fijos y chocarian con los del modal de
// login. Por eso el formulario del modal usa IDs con prefijo "reg" y este
// script los conecta a las mismas funciones compartidas de validaciones.js,
// regiones.js y datos.js (no duplica logica de validacion, solo la conecta).
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("modalRegistro");
  if (!modal) { return; }

  const botonCrearRegistro = document.getElementById("botonCrearRegistro");
  const enlaceRegistroPie = document.getElementById("enlaceRegistroPie");
  const botonCerrar = document.getElementById("modalRegistroCerrar");

  function abrirModal(evento) {
    if (evento) { evento.preventDefault(); }
    modal.hidden = false;
  }

  function cerrarModal() {
    modal.hidden = true;
  }

  if (botonCrearRegistro) { botonCrearRegistro.addEventListener("click", abrirModal); }
  if (enlaceRegistroPie) { enlaceRegistroPie.addEventListener("click", abrirModal); }
  if (botonCerrar) { botonCerrar.addEventListener("click", cerrarModal); }

  modal.addEventListener("click", function (evento) {
    if (evento.target === modal) { cerrarModal(); }
  });

  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape" && !modal.hidden) { cerrarModal(); }
  });

  const selectCategoria = document.getElementById("regCategoria");
  categorias.forEach(function (cat) {
    const opcion = document.createElement("option");
    opcion.value = cat.codigo;
    opcion.textContent = cat.nombre;
    selectCategoria.appendChild(opcion);
  });

  cargarRegiones("regRegion");
  conectarTelefonoFijo("regTelefono");
  conectarFuerzaClave("regClave", "regFuerzaClaveBarra", "regFuerzaClaveTexto");

  const reglasRegistro = {
    regRut: validarRut,
    regNombre: validarNombre,
    regCorreo: validarCorreo,
    regTelefono: validarTelefono,
    regCategoria: validarSeleccion,
    regDias: validarDias,
    regRegion: validarSeleccion,
    regComuna: validarSeleccion,
    regDireccion: validarDireccion,
    regClave: validarClaveNueva,
    regRepetirClave: validarRepetirClave
  };

  const formularioRegistro = conectar("regFormulario", reglasRegistro, "regBotonRegistrar");

  document.getElementById("regRegion").addEventListener("change", function () {
    cargarComunas(this.value, "regComuna");
    formularioRegistro.revisar(false);
  });

  function cuentasCreadasReg() {
    const dato = localStorage.getItem("cuentasNuevas");
    return dato ? JSON.parse(dato) : [];
  }

  function yaExisteReg(rut, correo) {
    const enProveedores = proveedores.some(function (p) { return p.rut === rut; });
    const enCuentas = cuentas.some(function (c) { return c.correo === correo; });
    const enNuevas = cuentasCreadasReg().some(function (c) {
      return c.rut === rut || c.correo === correo;
    });
    return enProveedores || enCuentas || enNuevas;
  }

  formularioRegistro.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const aviso = document.getElementById("regAviso");
    aviso.classList.remove("visible", "malo");

    if (!formularioRegistro.revisar(true)) {
      aviso.textContent = "Revise los campos marcados en rojo.";
      aviso.classList.add("visible", "malo");
      return;
    }

    const rut = document.getElementById("regRut").value.trim().toUpperCase();
    const correo = document.getElementById("regCorreo").value.trim().toLowerCase();

    if (yaExisteReg(rut, correo)) {
      pintar("regRut", "Este usuario ya se encuentra registrado.");
      aviso.textContent = "El RUT o el correo ya existen en el sistema.";
      aviso.classList.add("visible", "malo");
      return;
    }

    const nueva = {
      rut: rut,
      correo: correo,
      nombre: document.getElementById("regNombre").value.trim(),
      categoria: document.getElementById("regCategoria").value,
      dias: Number(document.getElementById("regDias").value),
      perfil: "proveedor",
      estado: "Pendiente",
      clave: document.getElementById("regClave").value
    };

    const lista = cuentasCreadasReg();
    lista.push(nueva);
    localStorage.setItem("cuentasNuevas", JSON.stringify(lista));

    aviso.textContent = "Solicitud de " + nueva.nombre +
      " enviada. Podra ingresar cuando el administrador apruebe su registro.";
    aviso.classList.add("visible");

    formularioRegistro.reset();
    document.querySelectorAll("#modalRegistro .campo").forEach(function (campo) {
      campo.classList.remove("bueno", "malo");
      campo.querySelector(".error").classList.remove("visible");
    });
    document.getElementById("regBotonRegistrar").disabled = true;
    document.getElementById("regFuerzaClaveBarra").className = "fuerza-clave-barra";
    document.getElementById("regFuerzaClaveBarra").style.width = "0%";
    document.getElementById("regFuerzaClaveTexto").textContent = "";
  });
});
