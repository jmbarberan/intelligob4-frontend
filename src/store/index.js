import Vue from "vue";
import Vuex from "vuex";
import modSeguridad from "@/modules/seguridad";
import modContribuyentes from "@/modules/contribuyentes";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    entorno: {
      oscuro: false,
      menu: [],
      menuTitulo: "Intelligob",
      menuVisible: false
    },
    ocupado: {
      titulo: "",
      mensaje: "",
      procesando: false
    },
    dialogo: {
      titulo: "",
      mensaje: "",
      mostrar: false
    },
    infoMsj: {
      variante: "info",
      mensaje: "",
      segundos: 5,
      conteo: 0
    }
  },
  mutations: {
    ocupadoMostrar(state, payload) {
      state.ocupado.titulo = payload.titulo;
      state.ocupado.mensaje = payload.mensaje;
      state.ocupado.procesando = true;
    },
    ocupadoOcultar(state) {
      state.ocupado.titulo = "";
      state.ocupado.mensaje = "";
      state.ocupado.procesando = false;
    },
    dialogoMostrar(state, payload) {
      state.dialogo.titulo = payload.titulo;
      state.dialogo.mensaje = payload.mensaje;
      state.dialogo.mostrar = true;
    },
    actualizaConteoInfoMsj(state, v) {
      state.infoMsj.conteo = v;
    },
    resetearConteoInfoMsj(state, msj) {
      state.infoMsj.mensaje = msj.mensaje;
      if (msj.variante != undefined) state.infoMsj.variante = msj.variante;
      state.infoMsj.conteo = state.infoMsj.segundos;
    }
  },
  actions: {},
  modules: {
    seguridad: modSeguridad,
    contribuyentes: modContribuyentes
  }
});
