//const contantes = require("@/constantes/rutas.js");
//const baseurl = contantes.api().host + contantes.api().version + "/contribuyentes";

export function frontend() {
  return [
    {
      path: "/agua/cuentas",
      name: "aguaCuentas",
      component: () =>
        import(/* webpackChunkName: "acceder" */ "@/views/agua/Cuentas.vue")
    },
    {
      path: "/agua/lecturas",
      name: "aguaLecturas",
      component: () =>
        import(/* webpackChunkName: "acceder" */ "@/views/agua/Lecturas.vue")
    }
  ];
}
