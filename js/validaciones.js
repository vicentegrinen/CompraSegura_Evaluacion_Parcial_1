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

  const despues = partes[1];
  if (despues === "") { return "Falta el dominio despues del arroba."; }
  if (despues.startsWith("-") || despues.endsWith("-")) { return "El dominio no puede empezar ni terminar en guion."; }
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/.test(despues)) {
    return "El dominio no es valido, por ejemplo empresa.cl.";
  }

  return "";
}

function validarTelefono(valor) {
  const digitos = valor.trim().replace(/^\+?56\s*/, "").replace(/[^0-9]/g, "");

  if (digitos === "") { return "Ingrese un telefono."; }
  if (!/^9[0-9]{8}$/.test(digitos)) { return "Deben ser 9 digitos empezando en 9."; }

  return "";
}

function validarSeleccion(valor) {
  if (valor === "") { return "Seleccione una opcion."; }
  return "";
}

function validarDias(valor) {
  if (valor.trim() === "") { return "Ingrese los dias de entrega."; }

  const dias = Number(valor);
  if (!Number.isInteger(dias)) { return "Debe ser un numero entero."; }
  if (dias < 1 || dias > 60) { return "Debe estar entre 1 y 60 dias."; }

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
  if (!/[A-Z]/.test(valor)) { return "Debe incluir al menos una mayuscula."; }
  if (!/[a-z]/.test(valor)) { return "Debe incluir al menos una minuscula."; }
  if (!/[0-9]/.test(valor)) { return "Debe incluir al menos un numero."; }

  return "";
}

function validarClaveIngreso(valor) {
  if (valor === "") { return "Ingrese su contrasena."; }
  if (valor.length < 4 || valor.length > 10) { return "Debe tener entre 4 y 10 caracteres."; }

  return "";
}

function validarRepetirClave(valor, entrada) {
  const idClave = (entrada && entrada.dataset && entrada.dataset.comparar) ? entrada.dataset.comparar : "clave";
  const campoClave = document.getElementById(idClave);
  const original = campoClave ? campoClave.value : "";

  if (valor === "") { return "Repita la contrasena."; }
  if (valor !== original) { return "Las contrasenas no coinciden."; }

  return "";
}

function conectarTelefonoFijo(idInput) {
  const PREFIJO = "+56 ";
  const entrada = document.getElementById(idInput);
  if (!entrada) { return; }

  function normalizar() {
    const valor = entrada.value;

    if (!valor.startsWith(PREFIJO)) {
      let digitos = valor.replace(/[^0-9]/g, "");
      if (digitos.startsWith("56")) { digitos = digitos.slice(2); }
      entrada.value = PREFIJO + digitos.slice(0, 9);
      return;
    }

    const resto = valor.slice(PREFIJO.length).replace(/[^0-9]/g, "").slice(0, 9);
    entrada.value = PREFIJO + resto;
  }

  if (entrada.value.trim() === "") { entrada.value = PREFIJO; }

  entrada.addEventListener("focus", function () {
    if (entrada.value === "") { entrada.value = PREFIJO; }
    const pos = entrada.value.length;
    setTimeout(function () { entrada.setSelectionRange(pos, pos); }, 0);
  });

  entrada.addEventListener("keydown", function (evento) {
    if (evento.key === "Backspace" && entrada.selectionStart <= PREFIJO.length && entrada.selectionEnd <= PREFIJO.length) {
      evento.preventDefault();
    }
  });

  entrada.addEventListener("input", normalizar);
}

function calcularFuerzaClave(valor) {
  if (valor === "") { return { nivel: "", texto: "", porcentaje: 0 }; }

  let puntos = 0;
  if (valor.length >= 8) { puntos++; }
  if (/[A-Z]/.test(valor)) { puntos++; }
  if (/[a-z]/.test(valor)) { puntos++; }
  if (/[0-9]/.test(valor)) { puntos++; }
  if (/[^A-Za-z0-9]/.test(valor)) { puntos++; }

  if (puntos <= 2) { return { nivel: "debil", texto: "Contrasena debil", porcentaje: 33 }; }
  if (puntos <= 3) { return { nivel: "media", texto: "Contrasena media", porcentaje: 66 }; }
  return { nivel: "fuerte", texto: "Contrasena fuerte", porcentaje: 100 };
}

function conectarFuerzaClave(idClave, idBarra, idTexto) {
  const clave = document.getElementById(idClave);
  const barra = document.getElementById(idBarra);
  const texto = document.getElementById(idTexto);
  if (!clave || !barra || !texto) { return; }

  function actualizar() {
    const resultado = calcularFuerzaClave(clave.value);
    barra.className = "fuerza-clave-barra" + (resultado.nivel ? " " + resultado.nivel : "");
    barra.style.width = resultado.porcentaje + "%";
    texto.className = "fuerza-texto" + (resultado.nivel ? " " + resultado.nivel : "");
    texto.textContent = resultado.texto;
  }

  clave.addEventListener("input", actualizar);
  actualizar();
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

      const mensaje = reglas[id](entrada.value, entrada);
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
        pintar(id, reglas[id](entrada.value, entrada));
        revisar(false);
      });
    });
  }

  boton.disabled = true;
  formulario.revisar = revisar;
  return formulario;
}
