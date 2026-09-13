const DOMINIOS = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];

function digitoCorrecto(rut) {
  const cuerpo = rut.slice(0, -1);
  const entregado = rut.slice(-1);
  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma = suma + Number(cuerpo[i]) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  const resto = 11 - (suma % 11);

  let esperado = String(resto);
  if (resto === 11) { esperado = "0"; }
  if (resto === 10) { esperado = "K"; }

  return entregado === esperado;
}

function validarRut(valor) {
  const rut = valor.trim().toUpperCase();

  if (rut === "") { return "Ingrese el RUT."; }
  if (rut.includes(".") || rut.includes("-")) { return "Escriba el RUT sin puntos ni guion."; }
  if (rut.length < 7 || rut.length > 9) { return "El RUT debe tener entre 7 y 9 caracteres."; }

  if (!/^[0-9]+[0-9K]$/.test(rut)) { return "Solo numeros y, si corresponde, una K al final."; }
  if (!digitoCorrecto(rut)) { return "El RUT no es valido, revise el ultimo caracter."; }

  return "";
}

function validarNombre(valor) {
  const texto = valor.trim();

  if (texto === "") { return "Ingrese el nombre o razon social."; }
  if (texto.length < 2) { return "Debe tener al menos 2 caracteres."; }
  if (texto.length > 100) { return "No puede superar los 100 caracteres."; }

  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9 .]+$/.test(texto)) {
    return "No se permiten simbolos.";
  }
  return "";
}

function validarCorreo(valor) {
  const correo = valor.trim().toLowerCase();

  if (correo === "") { return "Ingrese un correo."; }
  if (correo.length > 100) { return "No puede superar los 100 caracteres."; }
  if (correo.includes(" ")) { return "El correo no puede llevar espacios."; }

  const partes = correo.split("@");
  if (partes.length !== 2) { return "El correo debe llevar un solo arroba."; }

  const antes = partes[0];
  if (antes === "") { return "Falta el nombre antes del arroba."; }
  if (antes.startsWith(".") || antes.endsWith(".")) {
    return "El nombre no puede empezar ni terminar en punto.";
  }
  if (antes.includes("..")) { return "No puede haber dos puntos seguidos."; }
  if (!/^[a-z0-9._-]+$/.test(antes)) { return "Antes del arroba solo letras, numeros, punto y guion."; }

  const permitido = DOMINIOS.some(function (d) { return correo.endsWith(d); });
  if (!permitido) { return "Solo se aceptan @duoc.cl, @profesor.duoc.cl o @gmail.com."; }

  return "";
}

function validarTelefono(valor) {
  const telefono = valor.trim();

  if (telefono === "") { return "Ingrese un telefono."; }
  if (!/^9[0-9]{8}$/.test(telefono)) { return "Deben ser 9 digitos empezando en 9."; }

  return "";
}

function validarSeleccion(valor) {
  if (valor === "") { return "Seleccione una opcion."; }
  return "";
}

function validarDireccion(valor) {
  const texto = valor.trim();

  if (texto === "") { return "Ingrese la direccion."; }
  if (texto.length > 300) { return "No puede superar los 300 caracteres."; }

  return "";
}

function validarClaveNueva(valor) {
  if (valor === "") { return "Ingrese una contrasena."; }
  if (valor.length < 8 || valor.length > 10) { return "Debe tener entre 8 y 10 caracteres."; }

  return "";
}

function validarClaveIngreso(valor) {
  if (valor === "") { return "Ingrese su contrasena."; }
  if (valor.length < 4 || valor.length > 10) { return "Debe tener entre 4 y 10 caracteres."; }

  return "";
}

function validarRepetirClave(valor) {
  const original = document.getElementById("clave").value;

  if (valor === "") { return "Repita la contrasena."; }
  if (valor !== original) { return "Las contrasenas no coinciden."; }

  return "";
}

function pintar(id, mensaje) {
  const entrada = document.getElementById(id);
  const campo = entrada.closest(".campo");
  const error = campo.querySelector(".error");

  campo.classList.remove("bueno", "malo");

  if (mensaje === "") {
    campo.classList.add("bueno");
    error.classList.remove("visible");
    error.textContent = "";
    return true;
  }

  campo.classList.add("malo");
  error.textContent = mensaje;
  error.classList.add("visible");
  return false;
}

function conectar(idFormulario, reglas, idBoton) {
  const formulario = document.getElementById(idFormulario);
  const boton = document.getElementById(idBoton);

  function revisar(mostrando) {
    let todoBien = true;

    for (const id in reglas) {
      const entrada = document.getElementById(id);

      if (entrada.closest(".campo").style.display === "none") { continue; }

      const mensaje = reglas[id](entrada.value);
      if (mostrando) { pintar(id, mensaje); }
      if (mensaje !== "") { todoBien = false; }
    }

    boton.disabled = !todoBien;
    return todoBien;
  }

  for (const id in reglas) {
    const entrada = document.getElementById(id);

    ["input", "change"].forEach(function (evento) {
      entrada.addEventListener(evento, function () {
        pintar(id, reglas[id](entrada.value));
        revisar(false);
      });
    });
  }

  boton.disabled = true;
  formulario.revisar = revisar;
  return formulario;
}
