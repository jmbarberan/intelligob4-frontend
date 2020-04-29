const contantes = require("@/constantes/rutas.js");
const baseurl =
  contantes.api().host +
  contantes.api().version +
  "/contribuyentes";

export function frontend() {
  return [
    {
      path: "/contribuyentes/lista",
      name: "contribuyentes",
      component: () =>
        import(/* webpackChunkName: "contribuyentes" */ "@/views/Contribuyentes.vue"),
      meta: {
        requiresAuth: true
      }
    }
  ];
}

export function backend() {
  return {
    porId: function(id) {
      return baseurl + `/${id}`;
    },
    buscarNombres: function(tipo, estado, filtro) {
      return baseurl + `/buscar/${tipo}/${estado}/${filtro}`;
    },
    buscarCedula: function(estado, filtro) {
      return baseurl + `/buscar/cedula/${estado}/${filtro}`;
    },
    validarRegistrado: function(cedula, nombres) {
      return baseurl + `/validar/registrado/${cedula}/${nombres}`;
    },
    crear: function() {
      return baseurl + "/crear";
    },
    modificar: function() {
      return baseurl + "/modificar";
    },
    eliminar: function() {
      return baseurl + "/eliminar";
    },
    restaurar: function() {
      return baseurl + "/restaurar";
    }
  };
}
