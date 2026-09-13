const regiones = [
  { nombre: "Region de Arica y Parinacota", comunas: ["Arica", "Camarones", "Putre", "General Lagos"] },
  { nombre: "Region de Tarapaca", comunas: ["Iquique", "Alto Hospicio", "Pozo Almonte", "Pica", "Huara"] },
  { nombre: "Region de Antofagasta", comunas: ["Antofagasta", "Mejillones", "Taltal", "Calama", "Tocopilla"] },
  { nombre: "Region de Atacama", comunas: ["Copiapo", "Caldera", "Chanaral", "Vallenar", "Huasco"] },
  { nombre: "Region de Coquimbo", comunas: ["La Serena", "Coquimbo", "Ovalle", "Illapel", "Vicuna"] },
  { nombre: "Region de Valparaiso", comunas: ["Valparaiso", "Vina del Mar", "Quilpue", "Villa Alemana", "San Antonio", "Quillota"] },
  { nombre: "Region Metropolitana de Santiago", comunas: ["Santiago", "Providencia", "Las Condes", "Maipu", "Puente Alto", "La Florida", "Nunoa", "Renca", "San Bernardo", "Quilicura"] },
  { nombre: "Region del Libertador General Bernardo O'Higgins", comunas: ["Rancagua", "Machali", "San Fernando", "Santa Cruz", "Pichilemu"] },
  { nombre: "Region del Maule", comunas: ["Talca", "Curico", "Linares", "Constitucion", "Cauquenes"] },
  { nombre: "Region de Nuble", comunas: ["Chillan", "Chillan Viejo", "San Carlos", "Bulnes", "Quirihue"] },
  { nombre: "Region del Biobio", comunas: ["Concepcion", "Talcahuano", "Chiguayante", "San Pedro de la Paz", "Los Angeles", "Coronel"] },
  { nombre: "Region de La Araucania", comunas: ["Temuco", "Padre Las Casas", "Villarrica", "Pucon", "Angol"] },
  { nombre: "Region de Los Rios", comunas: ["Valdivia", "La Union", "Panguipulli", "Rio Bueno", "Lanco"] },
  { nombre: "Region de Los Lagos", comunas: ["Puerto Montt", "Osorno", "Castro", "Ancud", "Puerto Varas"] },
  { nombre: "Region de Aysen del General Carlos Ibanez del Campo", comunas: ["Coyhaique", "Aysen", "Chile Chico", "Cochrane"] },
  { nombre: "Region de Magallanes y de la Antartica Chilena", comunas: ["Punta Arenas", "Puerto Natales", "Porvenir", "Cabo de Hornos"] }
];

function cargarRegiones(idSelect) {
  const select = document.getElementById(idSelect);
  if (!select) {
    return;
  }

  regiones.forEach(function (region) {
    const opcion = document.createElement("option");
    opcion.value = region.nombre;
    opcion.textContent = region.nombre;
    select.appendChild(opcion);
  });
}

function cargarComunas(nombreRegion, idSelect) {
  const select = document.getElementById(idSelect);
  if (!select) {
    return;
  }

  select.innerHTML = '<option value="">Seleccione una comuna</option>';

  const region = regiones.find(function (r) {
    return r.nombre === nombreRegion;
  });

  if (!region) {
    return;
  }

  region.comunas.forEach(function (comuna) {
    const opcion = document.createElement("option");
    opcion.value = comuna;
    opcion.textContent = comuna;
    select.appendChild(opcion);
  });
}
