const contantes = require("@/constantes/rutas.js");
const baseurl =
  contantes.api().host + 
  contantes.api().version + 
  "/seguridad";

export function frontend() {
  return [
    {
      path: "/acceder",
      name: "acceder",
      component: () =>
        import(/* webpackChunkName: "acceder" */ "@/components/Acceso.vue")
    },
    {
      path: "/usuarios",
      name: "usuarios",
      component: () =>
        import(/* webpackChunkName: "usuarios" */ "@/views/seguridad/Usuarios.vue")
    },
    {
      path: "/permisos",
      name: "permisos",
      component: () =>
        import(/* webpackChunkName: "usuarios" */ "@/views/seguridad/Permisos.vue")
    },
  ];
}

export function backend() {
  return {
    acceder: function() {
      return baseurl + "/credenciales/validar";
    },
    claveCambiar: function() {
      return baseurl + "/credenciales/cambiar";
    },
    salir: function() {
      return baseurl + "/salir";
    },
    usuariosTodos: function(estado) {
      return baseurl + `/usuarios/lista/${estado}`;
    },
    usuarioPorId: function(id) {
      return baseurl + `/usuarios/${id}`;
    },
    privilegiosFuncion: function(usuario, funcion) {
      return baseurl + `/privilegios/${usuario}/${funcion}`;
    },
    privilegios: function(usuario) {
      return baseurl + `/privilegios/${usuario}`;
    },
    autorizacionValidar: function(permiso, usuario) {
      return baseurl + `/autorizaciones/validar/${permiso}/${usuario}`;
    },
    autorizacionConceder: function() {
      return baseurl + "/autorizaciones/conceder";
    },
    autorizacionDenegar: function() {
      return baseurl + "/autorizaciones/denegar";
    },
    autorizacionEjecutar: function() {
      return baseurl + "/autorizaciones/ejecutar";
    },
    funcionComandos: function(funcion) {
      return baseurl + `/funciones/${funcion}/comandos`;
    }
  };
}
