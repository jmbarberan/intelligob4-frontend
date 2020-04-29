import axios from "axios";
import router from "@/router";

const codifica = require("@/utiles/codifica.js");
const seguridadRutas = require("@/rutas/seguridad.js");

const seguridad = {
  namespaced: true,
  state: {
    sesion: {
      usrCodigo: "",
      usrId: 0,
      token: "",
      caduca: null
    },
    acceso: {
      in: false,
      error: null,
      failed: false
    },
    consultaUsuarios: {
      lista: [],
      ocupado: false
    },
    verCambiarClave: false,
    privilegios: [],
  },
  mutations: {
    accesoIniciar: state => (state.acceso.in = true),
    accesoDetener: (state, errorMessage) => {
      state.acceso.in = false;
      state.acceso.error = errorMessage;
      state.acceso.failed = errorMessage != null;
    },
    actualizarSesion: (state, p) => {
      state.sesion.usrCodigo = p.usuario;
      state.sesion.usrId = p.id;
      state.sesion.token = p.token;
      state.sesion.caduca = p.caduca;
    },
    cargarUsuariosLista: (state, p) => {
      state.consultaUsuarios.lista = p;
    },
    salir: state => {
      state.sesion.usrCodigo = "";
      state.sesion.usrId = 0;
      state.sesion.token = "";
      state.sesion.caduca = null;
    },
    modVerCambiarClave: (state, v) => {
      state.verCambiarClave = v;
    },
    actualizarPrivilegios(state, p) {
      state.privilegios = p;
    },
    agregarPrivilegio(state, p) {
      state.privilegios.push(p);
    },
  },
  actions: {
    cargarSesion(context) {
      let usr = "";
      let usrId = 0;
      let tk = "";
      let cad = null;
      if (localStorage.getItem("token")) {
        tk = localStorage.getItem("token");
      }
      if (localStorage.getItem("usuarioId")) {
        usrId = localStorage.getItem("usuarioId");
      }
      if (localStorage.getItem("usuario")) {
        usr = localStorage.getItem("usuario");
      }
      if (localStorage.getItem("caduca")) {
        cad = localStorage.getItem("caduca");
      }
      let s = {
        usuario: usr,
        id: usrId,
        token: tk,
        caduca: cad
      };
      context.commit("actualizarSesion", s);
    },
    acceder(context, credenciales) {
      context.commit("accesoIniciar");
      context.commit(
        "ocupadoMostrar",
        {
          titulo: "Accediendo al sistema",
          mensaje: "Espere mientras se validan las credenciales"
        },
        { root: true }
      );
      let clavehash = codifica.md5(credenciales.clave);
      let contenido = JSON.stringify({
        usuario: credenciales.usuario,
        clave: clavehash
      });
      let config = {
        withCredentials: true,
        crossorigin: true
      };
      axios
        .post(seguridadRutas.backend().acceder(), contenido, config)
        .then(response => {
          this.cargarPrivilegios(response.data.usuarioId).then(datos => {
            if (datos.length > 0) {
              context.commit("actualizarPrivilegios", datos);
              let s = {
                usuario: credenciales.usuario,
                id: response.data.usuarioId,
                token: response.data.token,
                caduca: response.data.caduca,
              };
              context.commit("actualizarSesion", s);
              context.commit("accesoDetener", null);
              localStorage.setItem("token", s.token);
              localStorage.setItem("usuarioId", s.id);
              localStorage.setItem("usuario", s.usuario);
              localStorage.setItem("caduca", s.caduca);
              credenciales.usuario = "";
              context.commit("ocupadoOcultar", null, { root: true });
              router.push("/");
              context.commit("resetearConteoInfoMsj", "Acceso exitoso", { root: true });
            } else {
              context.commit("accesoDetener", "");
              context.commit("ocupadoOcultar", null, { root: true });
              context.commit("resetearConteoInfoMsj", "Este usuario no tiene privilegios asignados", { root: true });  
            }
          })
          .catch(() => {
            context.commit("accesoDetener", "");
            context.commit("ocupadoOcultar", null, { root: true });
            context.commit("resetearConteoInfoMsj", "No se pudo comprobar los privilegios asignados", { root: true });  
          });
        })
        .catch(error => {
          let msj = "El usuario o la contraseña son invalidos";
          if (error.response != undefined) {
            msj = error.response.data;
          }
          context.commit("accesoDetener", msj);
          context.commit("actualizarSesion", { usuario: "", id: 0, token: "" });
          context.commit("ocupadoOcultar", null, { root: true });
          context.commit("resetearConteoInfoMsj", msj, { root: true });
        });
    },
    cambiarClave(context, pclave) {
      let clavehash = codifica.md5(pclave);
      context.commit(
        "ocupadoMostrar",
        {
          titulo: "Actualizando contraseña",
          mensaje: "Espere mientras se ejecuta la operacion"
        },
        { root: true }
      );
      let contenido = JSON.stringify({
        id: context.state.sesion.usrId,
        clave: clavehash
      });
      let config = {
        headers: {
          Authorization: context.state.sesion.token
        },
        withCredentials: true,
        crossorigin: true
      };
      axios
        .put(seguridadRutas.backend().claveCambiar(), contenido, config)
        .then(response => {
          context.commit("ocupadoOcultar", null, { root: true });
          context.commit("salir");
          localStorage.setItem("token", "");
          localStorage.setItem("usuarioId", 0);
          localStorage.setItem("usuario", "");
          localStorage.setItem("caduca", null);
          context.commit("resetearConteoInfoMsj", response.data);
          router.push("/acceder");
        })
        .catch(error => {
          let msj = "No se pudo cambiar la contraseña";
          if (error != undefined) {
            msj = JSON.stringify(error);
          }
          context.commit("ocupadoOcultar", null, { root: true });
          context.commit("resetearConteoInfoMsj", msj);
        });
    },
    cerrarSesion(context) {
      context.commit(
        "ocupadoMostrar",
        {
          titulo: "Cerrando sesion",
          mensaje: "Espere mientras se completa la operacion"
        },
        { root: true }
      );
      let contenido = JSON.stringify({
        token: context.state.sesion.token
      });
      let config = {
        withCredentials: true,
        crossorigin: true
      };
      axios
        .put(seguridadRutas.backend().salir(), contenido, config)
        .then(() => {
          context.commit("ocupadoOcultar", null, { root: true });
          context.commit("salir");
          localStorage.setItem("token", "");
          localStorage.setItem("usuarioId", 0);
          localStorage.setItem("usuario", "");
          localStorage.setItem("caduca", null);
          router.push("/acceder");
        })
        .catch(error => {
          let msj = "No se pudo cerrar la sesion";
          if (error.response != undefined) {
            msj = JSON.stringify(error);
          }
          context.commit("ocupadoOcultar", null, { root: true });
          context.commit("resetearConteoInfoMsj", {
            mensaje: msj,
            variante: "warning"
            }, 
            { root: true }
          );
        });
    },
    traerUsuarios(context, estado) {
      context.commit(
        "ocupadoMostrar",
        {
          titulo: "Procesando consulta",
          mensaje: "Espere mientras se ejecuta la consulta"
        },
        { root: true }
      );
      let config = {
        headers: {
          Authorization: context.state.sesion.token
        },
        withCredentials: true,
        crossorigin: true
      };
      axios
        .get(seguridadRutas.backend().usuariosTodos(estado), config)
        .then(response => {
          context.commit("cargarUsuariosLista", response.data);
          context.commit("ocupadoOcultar", null, { root: true });
        })
        .catch(() => {
          context.commit("ocupadoOcultar", null, { root: true });
        });
    },
    cargarPrivilegios(context, usr) {
      let config = {
        headers: {
          Authorization: this.state.seguridad.sesion.token
        },
        withCredentials: true,
        crossorigin: true,
      };
      return axios.get(seguridadRutas.backend().privilegios(usr), config)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        return error;
      });
    },
    traerPrivilegioFuncion(context, fun) {
      return new Promise((resolve) => {
        let consultarApi = false
        if (this.state.seguridad.privilegios.length > 0) {
          var res = context.state.privilegios.find(prv => prv.funcion === fun);
          if (res != undefined) {
            resolve(res);
          } else {
            // Si no se encuentra en el arreglo de cache, lo consultamos en la api
            consultarApi = true;
          } 
        } else {
          // Si el arreglo de cache estaa vacio, lo consultamos en la api
          consultarApi = true;
        }
        if (consultarApi) {
          let config = {
            headers: {
              Authorization: context.state.sesion.token
            },
            withCredentials: true,
            crossorigin: true,
          };
          let usr = context.state.sesion.usrId;
          axios.get(seguridadRutas.backend().privilegiosFuncion(usr, fun), config)
          .then(response => {
            context.commit("agregarPrivilegio", response.data);
            resolve(response.data);
          })
          .catch(() => {
            resolve(null);
          });
        }
      });
    },
  }
};

export default seguridad;
