document.addEventListener("DOMContentLoaded", function () {
  llenarCategorias();
  cargarRegiones("region");
  conectarTelefonoFijo("telefono");
  conectarFuerzaClave("clave", "fuerzaClaveBarra", "fuerzaClaveTexto");

  const reglas = {
    rut: validarRut,
    nombre: validarNombre,
    correo: validarCorreo,
    telefono: validarTelefono,
    categoria: validarSeleccion,
    dias: validarDias,
    region: validarSeleccion,
    comuna: validarSeleccion,
    direccion: validarDireccion,
    clave: validarClaveNueva,
    repetirClave: validarRepetirClave
  };

  const formulario = conectar("formulario", reglas, "botonRegistrar");

  document.getElementById("region").addEventListener("change", function () {
    cargarComunas(this.value, "comuna");
    formulario.revisar(false);
  });

  formulario.addEventListener("submit", function (evento) {

    evento.preventDefault();
    guardar(formulario);
  });
});

function llenarCategorias() {
  const select = document.getElementById("categoria");

  categorias.forEach(function (cat) {
    const opcion = document.createElement("option");
    opcion.value = cat.codigo;
    opcion.textContent = cat.nombre;
    select.appendChild(opcion);
  });
}

function cuentasCreadas() {
  const dato = localStorage.getItem("cuentasNuevas");
  return dato ? JSON.parse(dato) : [];
}

function yaExiste(rut, correo) {
  const enProveedores = proveedores.some(function (p) { return p.rut === rut; });
  const enCuentas = cuentas.some(function (c) { return c.correo === correo; });
  const enNuevas = cuentasCreadas().some(function (c) {
    return c.rut === rut || c.correo === correo;
  });

  return enProveedores || enCuentas || enNuevas;
}

function guardar(formulario) {
  const aviso = document.getElementById("aviso");
  aviso.classList.remove("visible", "malo");

  if (!formulario.revisar(true)) {
    aviso.textContent = "Revise los campos marcados en rojo.";
    aviso.classList.add("visible", "malo");
    return;
  }

  const rut = document.getElementById("rut").value.trim().toUpperCase();
  const correo = document.getElementById("correo").value.trim().toLowerCase();

  if (yaExiste(rut, correo)) {
    pintar("rut", "Este usuario ya se encuentra registrado.");
    aviso.textContent = "El RUT o el correo ya existen en el sistema.";
    aviso.classList.add("visible", "malo");
    return;
  }

  const nueva = {
    rut: rut,
    correo: correo,
    nombre: document.getElementById("nombre").value.trim(),
    categoria: document.getElementById("categoria").value,
    dias: Number(document.getElementById("dias").value),
    perfil: "proveedor",
    estado: "Pendiente",
    clave: document.getElementById("clave").value
  };

  const lista = cuentasCreadas();
  lista.push(nueva);
  localStorage.setItem("cuentasNuevas", JSON.stringify(lista));

  aviso.textContent = "Solicitud de " + nueva.nombre +
    " enviada. Podra ingresar cuando el administrador apruebe su registro.";
  aviso.classList.add("visible");

  formulario.reset();
  document.querySelectorAll(".campo").forEach(function (campo) {
    campo.classList.remove("bueno", "malo");
    campo.querySelector(".error").classList.remove("visible");
  });
  document.getElementById("botonRegistrar").disabled = true;
  window.scrollTo(0, 0);
}
