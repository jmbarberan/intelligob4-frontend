import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";

const seguridadRutas = require("@/rutas/seguridad.js");
const aguaRutas = require("@/rutas/agua.js");
const contribuyentesRutas = require("@/rutas/contribuyentes.js");

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Incio",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Inicio.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/about",
    name: "About",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
    meta: {
      requiresAuth: true
    }
  }
]
  .concat(seguridadRutas.frontend())
  .concat(aguaRutas.frontend())
  .concat(contribuyentesRutas.frontend());

store.dispatch("seguridad/cargarSesion", null, { root: true });

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.state.seguridad.sesion.usrId <= 0) {
      // Si no tiene usuario Id debe acceder
      next({
        path: "/acceder",
        params: { nextUrl: to.fullPath }
      });
    } else {
      // Si tiene usuario id validamos si el token no esta caducado
      if (store.state.seguridad.sesion.caduca != null) {
        let ahora = new Date();
        let caduca = new Date(store.state.seguridad.sesion.caduca);
        if (ahora > caduca) {
          // Si el token caduco debe acceder
          next({
            path: "/acceder",
            params: { nextUrl: to.fullPath }
          });
        } else {
          // si el token no ha caducado continuamos a la ruta solicitada
          next();
        }
      } else {
        // Si la caducidad es null debe acceder
        next({
          path: "/acceder",
          params: { nextUrl: to.fullPath }
        });
      }
    }
  } else {
    // Si la no requiere autorizacion continuamos
    // No requiere autorizacion: acceder
    next();
  }
});

export default router;
