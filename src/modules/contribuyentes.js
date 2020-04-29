import axios from "axios";

const contribuyentesRutas = require("@/rutas/contribuyentes.js");

const contribuyentes = {
  namespaced: true,
  state: {
    busqueda: {
      lista: [],
      ocupado: false
    },
    contribuyenteME: {
      visto: false,
      operacion: "Modificando",
    },
    contribuyenteMEDatos: {
      id: 0,
      tipoIdentificacion: 0,
      identificacion: "",
      nombres: "",
      representante: "",
      fechaNacimiento: "",
      domicilio: "",
      email: "",
      telefono: "",
    },
    contribuyenteMEOriginal: null,
  },
  getters: {
    contribuyenteMEModificado: state => {
      let ret = false;
      if (state.contribuyenteMEOriginal == null) {
        ret = true;
      } else if (state.contribuyenteMEDatos.tipoIdentificacion != state.contribuyenteMEOriginal.tipoIdentificacion) {        
        ret = true;
      } else if (state.contribuyenteMEDatos.identificacion != state.contribuyenteMEOriginal.identificacion) {
        ret = true;
      } else if (state.contribuyenteMEDatos.nombres != state.contribuyenteMEOriginal.nombres) {
        ret = true;
      } else if (state.contribuyenteMEDatos.representante != state.contribuyenteMEOriginal.representante) {
        ret = true;
      } else if (state.contribuyenteMEDatos.fechaNacimiento != state.contribuyenteMEOriginal.fechaNacimiento) {
        ret = true;
      } else if (state.contribuyenteMEDatos.domicilio != state.contribuyenteMEOriginal.domicilio) {
        ret = true;
      } else if (state.contribuyenteMEDatos.email != state.contribuyenteMEOriginal.email) {
        ret = true;
      } else if (state.contribuyenteMEDatos.telefono != state.contribuyenteMEOriginal.telefono) {
        ret = true;
      } else {
        ret = false;
      }
      return ret;
    }
  },
  mutations: {
    ocupadoIniciar: state => (state.busqueda.ocupado = true),
    ocupadoTerminar: state => (state.busqueda.ocupado = false),
    cargarResultados: (state, p) => {
      state.busqueda.lista = p;
      state.busqueda.ocupado = false;
    },
    setContribuyenteMEDatos(state, u) {
      if (u.id != undefined)
        state.contribuyenteMEDatos.id = u.id,
      state.contribuyenteMEDatos.tipoIdentificacion = u.tipoIdentificacion;
      state.contribuyenteMEDatos.identificacion = u.identificacion;
      state.contribuyenteMEDatos.nombres = u.nombres;
      state.contribuyenteMEDatos.representante = u.representante;
      state.contribuyenteMEDatos.fechaNacimiento = u.fechaNacimiento;
      state.contribuyenteMEDatos.domicilio = u.domicilio;
      state.contribuyenteMEDatos.email = u.email;
      state.contribuyenteMEDatos.telefono = u.telefono;
    },
    setContribuyenteMEVisto(state, v) {
      state.contribuyenteME.visto = v;
    },
    setContribuyenteMEOperacion(state, o) {
        state.contribuyenteME.operacion = o;
    },
    resetearContribuyenteME(state) {
      state.contribuyenteMEDatos.id = 0,
      state.contribuyenteMEDatos.tipoIdentificacion = 0;
      state.contribuyenteMEDatos.identificacion = "";
      state.contribuyenteMEDatos.nombres = "";
      state.contribuyenteMEDatos.representante = "";
      state.contribuyenteMEDatos.fechaNacimiento = null;
      state.contribuyenteMEDatos.domicilio = "";
      state.contribuyenteMEDatos.email = "";
      state.contribuyenteMEDatos.telefono = "";
    },
    setContribuyenteMEOriginal(state, u) {
      state.contribuyenteMEOriginal = {
        tipoIdentificacion: u.tipoIdentificacion,
        identificacion: u.identificacion,
        nombres: u.nombres,
        representante: u.representante,
        fechaNacimiento: u.fechaNacimiento,
        domicilio: u.domicilio,
        email: u.email,
        telefono: u.telefono,
      }
    },
    anularContribuyenteMEOriginal(state) {
      state.contribuyenteMEOriginal = null;
    },
  },
  actions: {
    buscarNombres(context, busqueda) {
      context.commit("ocupadoIniciar");
      let config = {
        headers: {
          Authorization: context.rootState.seguridad.sesion.token
        },
        withCredentials: true,
        crossdomain: true
      };
      axios.get(
        contribuyentesRutas.backend().buscarNombres(busqueda.tipo, busqueda.estado, busqueda.filtro),
        config
      )
      .then(response => {
        context.commit("cargarResultados", response.data);
      })
      .catch(error => {
        let msj = "La busqueda no produjo resultados";
        if (error.response != undefined) {
          if (error.response.data.length > 0)
            msj = error.response.data;
        }
        context.commit("ocupadoTerminar");
        context.commit("resetearConteoInfoMsj", {
          mensaje: msj,
          variante: "warning"}, 
          { root: true }
        );
      });
    },
    buscarCedula(context, busqueda) {
      context.commit("ocupadoIniciar");
      let config = {
        headers: {
          Authorization: context.rootState.seguridad.sesion.token
        },
        withCredentials: true,
        crossdomain: true
      };
      axios.get(contribuyentesRutas.backend().buscarCedula(busqueda.estado, busqueda.filtro),
        config
      ).then(response => {
        context.commit("cargarResultados", response.data);
      })
      .catch(error => {
        let msj = "La busqueda no produjo resultados";
        if (error.response != undefined) {
          if (error.response.data.length > 0)
            msj = error.response.data;
        }
        context.commit("ocupadoTerminar");
        context.commit("resetearConteoInfoMsj", {
          mensaje: msj,
          variante: "warning"
          }, 
          { root: true }
        );
      });
    },
    contribuyenteMEGuardar(context) {
      if (context.state.contribuyenteME.operacion === "Modificando") {
        if (context.getters["contribuyenteMEModificado"]) {
          this.contribuyenteMEOriginal = null;
          context.dispatch('ejecutarGuardado');          
        } else {
          context.commit("resetearConteoInfoMsj", {
            mensaje: "No se han efectuado cambios para guardar",
            variante: "info"
            }, 
            { root: true }
          );
        }
      } else {
        context.commit("ocupadoMostrar", {
          titulo: "Procesando solicitud",
          mensaje: "Espere mientras se ejecuta el proceso",
          }, 
          { root: true }
        );
        let ced = context.rootState.contribuyentes.contribuyenteMEDatos.identificacion;
        let nom = context.rootState.contribuyentes.contribuyenteMEDatos.nombres;
        let config = {
          headers: {
            Authorization: context.rootState.seguridad.sesion.token
          },
          withCredentials: true,
          crossorigin: true
        };
        axios.get(
          contribuyentesRutas.backend().validarRegistrado(ced, nom), config
        ).then(() => {
          context.dispatch('ejecutarGuardado');
        }).catch(error => {
          let msj = "Estos datos ya se encuentran registrados";
          if (error.response != undefined) msj = error.response.data;
          context.commit("ocupadoTerminar");
          context.commit("resetearConteoInfoMsj", {
            mensaje: msj,
            variante: "danger"
            }, 
            { root: true }
          );
        });
      }
    },
    ejecutarGuardado(context) {
      let ruta = contribuyentesRutas.backend().crear();
      let metodo = 'post';
      if (context.state.contribuyenteME.operacion === "Modificando") {
        ruta = contribuyentesRutas.backend().modificar();
        metodo = 'put';
      }
      let config = {
        headers: {
          Authorization: context.rootState.seguridad.sesion.token
        },
        url: ruta,
        data: JSON.stringify(context.state.contribuyenteMEDatos),
        method: metodo,
        withCredentials: true,
        crossorigin: true
      };
      axios(config)
      .then(response => {
        let nom = context.state.contribuyenteMEDatos.nombres;
        context.commit("resetearConteoInfoMsj", {
          mensaje: nom + ": " + response.data,
          variante: "success"
          }, 
          { root: true }
        );
        context.commit("setContribuyenteMEVisto", false);
        context.commit("resetearContribuyenteME");
      })
      .catch(error => {
        let msj = "No se pudo registrar la informacion";
        if (error.response != undefined) {
          msj = error.response.data;
        }
        context.commit("accesoDetener", msj);
        context.commit("resetearConteoInfoMsj", {
          mensaje: msj,
          variante: "warning"
          }, 
          { root: true }
        );
      });
    },
  }
};

export default contribuyentes;
