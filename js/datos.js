const categorias = [
  { codigo: "CAT001", nombre: "Materiales de construccion" },
  { codigo: "CAT002", nombre: "Herramientas" },
  { codigo: "CAT003", nombre: "Pinturas" },
  { codigo: "CAT004", nombre: "Materiales electricos" },
  { codigo: "CAT005", nombre: "Ferreteria" }
];

const proveedores = [
  { rut: "761234560", nombre: "Maderas del Sur", categoria: "CAT001", logo: "img/proveedor-1.jpg" },
  { rut: "772345674", nombre: "Herramientas Chile", categoria: "CAT002", logo: "img/proveedor-2.jpg" },
  { rut: "783456788", nombre: "Pinturas Andinas", categoria: "CAT003", logo: "img/proveedor-3.jpg" },
  { rut: "794567891", nombre: "Electricidad Central", categoria: "CAT004", logo: "img/proveedor-4.jpg" },
  { rut: "705678901", nombre: "Ferreteria Nacional", categoria: "CAT005", logo: "img/proveedor-5.jpg" }
];

const productos = [
  { codigo: "P001", nombre: "Cemento Portland 25 kg", categoria: "CAT001", precio: 6490, precioMercado: 6600, stock: 120, rut: "761234560", imagen: "img/prod-cemento.jpg" },
  { codigo: "P002", nombre: "Fierro estriado 8 mm", categoria: "CAT001", precio: 4290, precioMercado: 4350, stock: 200, rut: "761234560", imagen: "img/prod-fierro.jpg" },
  { codigo: "P003", nombre: "Taladro percutor 750W", categoria: "CAT002", precio: 54990, precioMercado: 54300, stock: 18, rut: "772345674", imagen: "img/prod-taladro.jpg" },
  { codigo: "P004", nombre: "Sierra circular 1400W", categoria: "CAT002", precio: 79990, precioMercado: 79100, stock: 9, rut: "772345674", imagen: "img/prod-sierra.jpg" },
  { codigo: "P005", nombre: "Latex interior 1 galon", categoria: "CAT003", precio: 18990, precioMercado: 18400, stock: 45, rut: "783456788", imagen: "img/prod-latex.jpg" },
  { codigo: "P006", nombre: "Esmalte sintetico 1 litro", categoria: "CAT003", precio: 9990, precioMercado: 9720, stock: 60, rut: "783456788", imagen: "img/prod-esmalte.jpg" },
  { codigo: "P007", nombre: "Cable 2.5 mm rollo 100 m", categoria: "CAT004", precio: 32990, precioMercado: 32500, stock: 30, rut: "794567891", imagen: "img/prod-cable.jpg" },
  { codigo: "P008", nombre: "Interruptor simple", categoria: "CAT004", precio: 2490, precioMercado: 2453, stock: 150, rut: "794567891", imagen: "img/prod-interruptor.jpg" },
  { codigo: "P009", nombre: "Set de tornillos 500 pzas", categoria: "CAT005", precio: 8990, precioMercado: 7940, stock: 12, rut: "705678901", imagen: "img/prod-tornillos.jpg" },
  { codigo: "P010", nombre: "Caja de clavos 1 kg", categoria: "CAT005", precio: 3490, precioMercado: 3083, stock: 4, rut: "705678901", imagen: "img/prod-clavos.jpg" }
];

const pedidos = [
  { numero: "SC-001", fechaCompra: "2026-08-03", fechaEntrega: "2026-08-09", rut: "761234560", codigo: "P001", cantidad: 20,
    direccion: "Tienda Maipu, Av. Pajaritos 2340, Maipu", estado: "Cerrada", aTiempo: true, conforme: true },
  { numero: "SC-002", fechaCompra: "2026-08-08", fechaEntrega: "2026-08-14", rut: "761234560", codigo: "P002", cantidad: 80,
    direccion: "Tienda Concepcion, Av. Los Carrera 890, Concepcion", estado: "Recibida", aTiempo: true, conforme: true },
  { numero: "SC-003", fechaCompra: "2026-08-13", fechaEntrega: "2026-08-19", rut: "761234560", codigo: "P001", cantidad: 15,
    direccion: "Bodega Norte, Av. Matta 450, Antofagasta", estado: "Cerrada", aTiempo: true, conforme: true },
  { numero: "SC-004", fechaCompra: "2026-08-18", fechaEntrega: "2026-08-24", rut: "761234560", codigo: "P002", cantidad: 30,
    direccion: "Bodega Central, Av. Departamental 1520, San Joaquin", estado: "Recibida", aTiempo: false, conforme: true },
  { numero: "SC-005", fechaCompra: "2026-08-03", fechaEntrega: "2026-08-09", rut: "772345674", codigo: "P003", cantidad: 20,
    direccion: "Tienda Maipu, Av. Pajaritos 2340, Maipu", estado: "Cerrada", aTiempo: true, conforme: true },
  { numero: "SC-006", fechaCompra: "2026-08-08", fechaEntrega: "2026-08-14", rut: "772345674", codigo: "P004", cantidad: 80,
    direccion: "Tienda Concepcion, Av. Los Carrera 890, Concepcion", estado: "Recibida", aTiempo: true, conforme: true },
  { numero: "SC-007", fechaCompra: "2026-08-13", fechaEntrega: "2026-08-19", rut: "772345674", codigo: "P003", cantidad: 15,
    direccion: "Bodega Norte, Av. Matta 450, Antofagasta", estado: "Cerrada", aTiempo: true, conforme: true },
  { numero: "SC-008", fechaCompra: "2026-08-18", fechaEntrega: "2026-08-24", rut: "772345674", codigo: "P004", cantidad: 30,
    direccion: "Bodega Central, Av. Departamental 1520, San Joaquin", estado: "Recibida", aTiempo: true, conforme: true },
  { numero: "SC-009", fechaCompra: "2026-08-23", fechaEntrega: "2026-08-29", rut: "772345674", codigo: "P003", cantidad: 12,
    direccion: "Tienda Maipu, Av. Pajaritos 2340, Maipu", estado: "Cerrada", aTiempo: false, conforme: false },
  { numero: "SC-010", fechaCompra: "2026-08-03", fechaEntrega: "2026-08-09", rut: "783456788", codigo: "P005", cantidad: 20,
    direccion: "Tienda Concepcion, Av. Los Carrera 890, Concepcion", estado: "Cerrada", aTiempo: true, conforme: true },
  { numero: "SC-011", fechaCompra: "2026-08-08", fechaEntrega: "2026-08-14", rut: "783456788", codigo: "P006", cantidad: 80,
    direccion: "Bodega Norte, Av. Matta 450, Antofagasta", estado: "Recibida", aTiempo: true, conforme: true },
  { numero: "SC-012", fechaCompra: "2026-08-13", fechaEntrega: "2026-08-19", rut: "783456788", codigo: "P005", cantidad: 15,
    direccion: "Bodega Central, Av. Departamental 1520, San Joaquin", estado: "Cerrada", aTiempo: true, conforme: true },
  { numero: "SC-013", fechaCompra: "2026-08-18", fechaEntrega: "2026-08-24", rut: "783456788", codigo: "P006", cantidad: 30,
    direccion: "Tienda Maipu, Av. Pajaritos 2340, Maipu", estado: "Recibida", aTiempo: true, conforme: false },
  { numero: "SC-014", fechaCompra: "2026-08-23", fechaEntrega: "2026-08-29", rut: "783456788", codigo: "P005", cantidad: 12,
    direccion: "Tienda Concepcion, Av. Los Carrera 890, Concepcion", estado: "Cerrada", aTiempo: false, conforme: false },
  { numero: "SC-015", fechaCompra: "2026-08-03", fechaEntrega: "2026-08-09", rut: "794567891", codigo: "P007", cantidad: 20,
    direccion: "Bodega Norte, Av. Matta 450, Antofagasta", estado: "Cerrada", aTiempo: true, conforme: true },
  { numero: "SC-016", fechaCompra: "2026-08-08", fechaEntrega: "2026-08-14", rut: "794567891", codigo: "P008", cantidad: 80,
    direccion: "Bodega Central, Av. Departamental 1520, San Joaquin", estado: "Recibida", aTiempo: true, conforme: true },
  { numero: "SC-017", fechaCompra: "2026-08-13", fechaEntrega: "2026-08-19", rut: "794567891", codigo: "P007", cantidad: 15,
    direccion: "Tienda Maipu, Av. Pajaritos 2340, Maipu", estado: "Cerrada", aTiempo: true, conforme: true },
  { numero: "SC-018", fechaCompra: "2026-08-18", fechaEntrega: "2026-08-24", rut: "794567891", codigo: "P008", cantidad: 30,
    direccion: "Tienda Concepcion, Av. Los Carrera 890, Concepcion", estado: "Recibida", aTiempo: false, conforme: false },
  { numero: "SC-019", fechaCompra: "2026-08-03", fechaEntrega: "2026-08-09", rut: "705678901", codigo: "P009", cantidad: 20,
    direccion: "Bodega Norte, Av. Matta 450, Antofagasta", estado: "Cerrada", aTiempo: true, conforme: true },
  { numero: "SC-020", fechaCompra: "2026-08-08", fechaEntrega: "2026-08-14", rut: "705678901", codigo: "P010", cantidad: 80,
    direccion: "Bodega Central, Av. Departamental 1520, San Joaquin", estado: "Recibida", aTiempo: true, conforme: true },
  { numero: "SC-021", fechaCompra: "2026-08-13", fechaEntrega: "2026-08-19", rut: "705678901", codigo: "P009", cantidad: 15,
    direccion: "Tienda Maipu, Av. Pajaritos 2340, Maipu", estado: "Cerrada", aTiempo: true, conforme: true },
  { numero: "SC-022", fechaCompra: "2026-08-18", fechaEntrega: "2026-08-24", rut: "705678901", codigo: "P010", cantidad: 30,
    direccion: "Tienda Concepcion, Av. Los Carrera 890, Concepcion", estado: "Recibida", aTiempo: false, conforme: false },
  { numero: "SC-023", fechaCompra: "2026-09-11", fechaEntrega: "2026-09-18", rut: "761234560", codigo: "P001", cantidad: 40,
    direccion: "Bodega Norte, Av. Matta 450, Antofagasta", estado: "Solicitada", aTiempo: null, conforme: null },
  { numero: "SC-024", fechaCompra: "2026-09-06", fechaEntrega: "2026-09-13", rut: "772345674", codigo: "P004", cantidad: 4,
    direccion: "Bodega Central, Av. Departamental 1520, San Joaquin", estado: "Solicitada", aTiempo: null, conforme: null },
  { numero: "SC-025", fechaCompra: "2026-09-07", fechaEntrega: "2026-09-14", rut: "705678901", codigo: "P010", cantidad: 20,
    direccion: "Tienda Maipu, Av. Pajaritos 2340, Maipu", estado: "Solicitada", aTiempo: null, conforme: null },
  { numero: "SC-026", fechaCompra: "2026-09-08", fechaEntrega: "2026-09-15", rut: "705678901", codigo: "P009", cantidad: 8,
    direccion: "Tienda Concepcion, Av. Los Carrera 890, Concepcion", estado: "Solicitada", aTiempo: null, conforme: null },
  { numero: "SC-027", fechaCompra: "2026-09-09", fechaEntrega: "2026-09-16", rut: "783456788", codigo: "P005", cantidad: 18,
    direccion: "Bodega Norte, Av. Matta 450, Antofagasta", estado: "Aprobada", aTiempo: null, conforme: null },
  { numero: "SC-028", fechaCompra: "2026-09-10", fechaEntrega: "2026-09-17", rut: "794567891", codigo: "P007", cantidad: 6,
    direccion: "Bodega Central, Av. Departamental 1520, San Joaquin", estado: "Enviada", aTiempo: null, conforme: null }
];

const flujoEstados = ["Solicitada", "Aprobada", "Enviada", "Recibida", "Cerrada"];

const detalleEstados = {
  Solicitada: { texto: "Pendiente de aprobacion del proveedor.", accion: "Aprobar" },
  Aprobada: { texto: "Aprobada y en preparacion.", accion: "Marcar como enviada" },
  Enviada: { texto: "Despachada, en camino a la bodega.", accion: "" },
  Recibida: { texto: "Recibida en bodega, en control de calidad.", accion: "" },
  Cerrada: { texto: "Cerrada y facturada.", accion: "" }
};

const presupuestoMensual = 12000000;

const costoEnvio = 4990;

const direccionesEntrega = [
  "Bodega Central, Av. Departamental 1520, San Joaquin",
  "Bodega Norte, Av. Matta 450, Antofagasta",
  "Tienda Maipu, Av. Pajaritos 2340, Maipu",
  "Tienda Concepcion, Av. Los Carrera 890, Concepcion"
];

function nombreCategoria(codigo) {
  const cat = categorias.find(function (c) { return c.codigo === codigo; });
  return cat ? cat.nombre : "Sin categoria";
}

function buscarProveedor(rut) {
  return proveedores.find(function (p) { return p.rut === rut; });
}

function buscarProducto(codigo) {
  return productos.find(function (p) { return p.codigo === codigo; });
}

function formatearPrecio(valor) {
  return "$" + Math.round(valor).toLocaleString("es-CL");
}
