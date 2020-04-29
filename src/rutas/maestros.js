const contantes = require("@/constantes/rutas.js");
const baseurl = 
  contantes.api().host + 
  contantes.api().version + 
  "/maestros";

export function backend() { return {
  clavePorId: function(id) {
    return baseurl + `/tablas/clave/${id}`;
  },
  
  clavesPorTabla: function(tabla) {
    return baseurl + `/tablas/${tabla}/claves`;
  },
}}