<template>
  <div>
    <b-sidebar
      v-model="entorno.menuVisible"
      id="sidebar-no-header"
      aria-labelledby="sidebar-no-header-title"
      bg-variant="dark"
      text-variant="light"
      backdrop
      :title="entorno.menuTitulo"
      shadow
      z-index="100"
    >
      <template>
        <div class="nav-side-menu">
          <div class="brand">{{ entorno.menuTitulo }}</div>
          <div class="menu-list">
            <ul
              v-for="menuItem in entorno.menu"
              :key="menuItem.id"
              id="menu-content"
              class="menu-content out"
            >
              <li>
                <b-link
                  v-if="menuItem.tipo == 0"
                  @click="cerrarSideBar()"
                  :to="menuItem.ruta"
                >
                  <b-icon
                    :icon="menuItem.icono"
                    aria-hidden="true"
                    font-scale="1.5"
                  />
                  <span class="ml-2">{{ menuItem.titulo }}</span>
                </b-link>
                <div v-else>
                  <b-link
                    v-b-toggle="'menu-' + menuItem.componente"
                    class="d-flex"
                  >
                    <span style="vertical-align: middle">
                      <b-icon
                        :icon="menuItem.icono"
                        aria-hidden="true"
                        font-scale="1.5"
                      />
                    </span>
                    <span class="ml-2 flex-grow-1">{{ menuItem.titulo }}</span>
                    <span>
                      <b-icon
                        icon="chevron-down"
                        aria-hidden="true"
                        font-scale="1.5"
                        class="mr-2"
                        style="vertical-align: middle"
                      />
                    </span>
                  </b-link>
                  <b-collapse v-bind:id="menuItem.compid">
                    <ul
                      v-for="submenuItem in menuItem.rutas"
                      :key="submenuItem.id"
                      class="sub-menu"
                    >
                      <li>
                        <b-link
                          @click="cerrarSideBar()"
                          :to="submenuItem.ruta"
                          class="sub-menu-item"
                        >
                          <b-icon
                            :icon="submenuItem.icono"
                            aria-hidden="true"
                            font-scale="1.5"
                          />
                          <span class="ml-2">{{ submenuItem.titulo }}</span>
                        </b-link>
                      </li>
                    </ul>
                  </b-collapse>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </template>
    </b-sidebar>
    <b-navbar toggleable="sm" type="dark" variant="dark">
      <b-button variant="dark" size="md" v-b-toggle.sidebar-no-header>
        <b-icon icon="list" aria-hidden="true"></b-icon>
      </b-button>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item :active="modCatastroOn" 
            @click="onSelCatastros()" 
            href="#"
            ><b-icon :icon="catastroIcono" aria-hidden="true"/> Catastros</b-nav-item
          >
          <b-nav-item
            @click="onSelTesoreria()"
            href="#"
            ><b-icon :icon="tesoreriaIcono" aria-hidden="true"/> Tesoreria</b-nav-item
          >
          <b-nav-item
            @click="onSelSeguridad()"
            href="#"
            ><b-icon :icon="seguridadIcono" aria-hidden="true"/> Seguridad</b-nav-item
          >
        </b-navbar-nav>

        <!-- Items alienados a la derecha -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <template v-slot:button-content>
              <span class="mr-2">{{ usuario }}</span>
              <b-avatar variant="primary"></b-avatar>
            </template>
            <b-dropdown-item @click="cambiarClave()"
              >Cambiar contraseña</b-dropdown-item
            >
            <b-dropdown-item @click="cerrarSesion()"
              >Cerrar sesion</b-dropdown-item
            >
            <b-dropdown-divider />
            <b-dropdown-item to="/about">Acerca de Intelligob</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <claveCambiar />
    <b-alert
      class="position-fixed fixed-bottom m-0 rounded-0"
      style="z-index: 2000;"
      dismissible
      :show="infoMsj.conteo"
      fade
      :variant="infoMsj.variante"
      @dismiss-count-down="countDownChanged"
    >
      <div class="d-flex">
        <span class="flex-fill text-center">{{ infoMsj.mensaje }}</span>
        <span class="p-2 ml-auto" style="font-size: 8pt"
          >Cerrando en {{ infoMsj.conteo }}</span
        >
      </div>
    </b-alert>
  </div>
</template>

<script>
import Vue from "vue";
import { BootstrapVueIcons } from "bootstrap-vue";
import "bootstrap-vue/dist/bootstrap-vue-icons.min.css";
import claveCambiar from "../components/ClaveCambiar.vue";
import { mapState, mapActions, mapMutations } from "vuex";

Vue.use(BootstrapVueIcons);

export default {
  components: {
    claveCambiar
  },
  data: () => ({
    catastroIcono: "falso",
    tesoreriaIcono: "falso",
    seguridadIcono: "falso",
  }),
  computed: {
    ...mapState(["entorno", "infoMsj"]),
    ...mapState("seguridad", {
      usuario: state => state.sesion.usrCodigo
    }),
    verCambiarClave: {
      get() {
        return this.$store.state.seguridad.verCambiarClave;
      },
      set(value) {
        this.$store.commit("seguridad/modVerCambiarClave", value, {
          root: true
        });
      }
    },
    modCatastroOn: {
      get() {
        return this.modCatastroSel;
      },
      set(value) {
        this.modCatastroSel = value;
      },
    },  
    modTesoreriaOn: {
      get() {
        return this.modTesoreriaSel;
      },
      set(value) {
        this.modTesoreriaSel = value;
      },
    },
    modSeguridadOn: {
      get() {
        return this.modSeguridadSel;
      },
      set(value) {
        this.modSeguridadSel = value;
      },
    },
  },
  methods: {
    ...mapMutations(["actualizaConteoInfoMsj"]),
    ...mapActions("seguridad", { salir: "cerrarSesion" }),
    onSelCatastros() {
      if (!this.modCatastroOn) {
        this.entorno.menu = [
          {
            id: 1,
            tipo: 0,
            titulo: "Contribuyentes",
            icono: "person",
            ruta: "/contribuyentes/lista"
          },
          {
            id: 2,
            tipo: 0,
            titulo: "Cuentas de agua",
            icono: "droplet",
            ruta: "/agua/cuentas"
          },
          {
            id: 3,
            tipo: 0,
            titulo: "Lecturas de consumo",
            icono: "clock",
            ruta: "/agua/lecturas"
          },
          {
            id: 4,
            tipo: 1,
            titulo: "Reportes",
            icono: "graph-up",
            compid: "menu-catReportes",
            componente: "catReportes",
            rutas: [
              {
                id: 5,
                tipo: 0,
                titulo: "Catastro de usuarios",
                icono: "person-lines-fill",
                ruta: "/contribuyentes/lista"
              },
              {
                id: 6,
                tipo: 0,
                titulo: "Cuentas suspendidas",
                icono: "exclamation-circle",
                ruta: "/agua/cuentas"
              },
              {
                id: 7,
                tipo: 0,
                titulo: "Reporte de consumo",
                icono: "bar-chart-fill",
                ruta: "/agua/lecturas"
              }
            ]
          }
        ];
        this.entorno.menuTitulo = "Catastros";
        this.catastroIcono = "chevron-right";
        this.tesoreriaIcono = "falso";
        this.seguridadIcono = "falso";
      }
      this.entorno.menuVisible = true;
    },
    onSelTesoreria() {
      if (!this.modTesoreriaOn) {
        this.entorno.menu = [
          {
            id: 1,
            tipo: 0,
            titulo: "Cobros",
            icono: "newspaper",
            ruta: "/contribuyentes/lista"
          },
          {
            id: 2,
            tipo: 0,
            titulo: "Emisiones",
            icono: "briefcase",
            ruta: "/agua/cuentas"
          },
          {
            id: 3,
            tipo: 0,
            titulo: "Reversiones",
            icono: "clipboard-data",
            ruta: "/agua/lecturas"
          },
          {
            id: 4,
            tipo: 1,
            titulo: "Reportes",
            icono: "graph-up",
            compid: "menu-tesReportes",
            componente: "tesReportes",
            rutas: [
              {
                id: 5,
                tipo: 0,
                titulo: "Diario de recaudaciones",
                icono: "layout-text-sidebar-reverse",
                ruta: "/contribuyentes/lista"
              },
              {
                id: 6,
                tipo: 0,
                titulo: "Diario de emisiones",
                icono: "briefcase",
                ruta: "/agua/cuentas"
              },
              {
                id: 7,
                tipo: 0,
                titulo: "Cuenta corriente",
                icono: "file-ruled",
                ruta: "/agua/lecturas"
              }
            ]
          }
        ];
        this.entorno.menuTitulo = "Tesoreria";
        this.catastroIcono = "falso";
        this.tesoreriaIcono = "chevron-right";
        this.seguridadIcono = "falso";
      }
      this.entorno.menuVisible = true;
    },
    onSelSeguridad() {
      if (!this.modSeguridadOn) {
        this.entorno.menu = [
          {
            id: 1,
            tipo: 0,
            titulo: "Usuarios",
            icono: "unlock",
            ruta: "/usuarios"
          },
          {
            id: 2,
            tipo: 0,
            titulo: "Permisos",
            icono: "shield-lock",
            ruta: "/permisos"
          }
        ];
        this.entorno.menuTitulo = "Seguridad";
        this.catastroIcono = "falso";
        this.tesoreriaIcono = "falso";
        this.seguridadIcono = "chevron-right";
      }
      this.entorno.menuVisible = true;
    },
    cerrarSesion() {
      this.$bvModal
        .msgBoxConfirm("Se cerrara la sesion ¿Seguro de continuar?.", {
          title: "Confirmar operacion",
          size: "sm",
          buttonSize: "sm",
          okTitle: "Si",
          cancelTitle: "No",
          hideHeaderClose: true,
          centered: true
        })
        .then(value => {
          if (value == true) {
            this.salir();
          }
        });
    },
    cambiarClave() {
      this.verCambiarClave = true;
    },
    cerrarSideBar() {
      this.entorno.menuVisible = false;
      console.log(this.catastroIcono);
      console.log(this.tesoreriaIcono);
      console.log(this.seguridadIcono);
    },
    countDownChanged(c) {
      this.actualizaConteoInfoMsj(c);
    }
  }
};
</script>

<style scoped>
/*.navbar-nav > .active > a {
    background: chartreuse !important; 
  }
  .nav-item > a:hover {
    color: white;
  }*/

.nav-side-menu {
  overflow: auto;
  font-family: verdana;
  font-size: 12px;
  font-weight: 200;
  background-color: #2e353d;
  position: fixed;
  top: 0px;
  width: 100%;
  height: 100%;
  color: #e1ffff;
}
.nav-side-menu .brand {
  background-color: #23282e;
  line-height: 50px;
  display: block;
  text-align: center;
  font-size: 16px;
}
.nav-side-menu .toggle-btn {
  display: none;
}
.nav-side-menu ul,
.nav-side-menu li {
  list-style: none;
  padding: 0px;
  margin: 0px;
  line-height: 35px;
  cursor: pointer;
}
.nav-side-menu ul :not(collapsed) .arrow:before,
.nav-side-menu li :not(collapsed) .arrow:before {
  display: inline-block;
  margin-left: auto;
  padding-right: 10px;
  vertical-align: middle;
}

.flecha {
  /*display: inline-block;
    margin-left: auto;*/
  padding-right: 10px;
  vertical-align: middle;
}

.vertical-centrado {
  display: inline-block;
  margin-left: auto;
  padding-right: 10px;
  vertical-align: middle;
}

.nav-side-menu ul .active,
.nav-side-menu li .active {
  border-left: 3px solid chartreuse;
  background-color: #4f5b69;
}
.nav-side-menu ul .sub-menu li.active,
.nav-side-menu li .sub-menu li.active {
  color: chartreuse;
}
.nav-side-menu ul .sub-menu li.active a,
.nav-side-menu li .sub-menu li.active a {
  color: chartreuse;
}
.nav-side-menu ul .sub-menu li,
.nav-side-menu li .sub-menu li {
  background-color: #181c20;
  border: none;
  line-height: 28px;
  border-bottom: 1px solid #23282e;
}

.sub-menu-item {
  margin-left: 15px;
}

.nav-side-menu ul .sub-menu li:hover,
.nav-side-menu li .sub-menu li:hover {
  background-color: #020203;
}
.nav-side-menu ul .sub-menu li:before,
.nav-side-menu li .sub-menu li:before {
  display: inline-block;
  padding-left: 10px;
  padding-right: 10px;
  vertical-align: middle;
}
.nav-side-menu li {
  padding-left: 0px;
  border-left: 3px solid #2e353d;
  border-bottom: 1px solid #23282e;
  text-align: left;
}
.nav-side-menu li a {
  text-decoration: none;
  color: #e1ffff;
  padding-left: 15px;
}
.nav-side-menu li a i {
  padding-left: 10px;
  width: 20px;
  padding-right: 20px;
}
.nav-side-menu li:hover {
  border-left: 3px solid chartreuse;
  background-color: #4f5b69;
  -webkit-transition: all 1s ease;
  -moz-transition: all 1s ease;
  -o-transition: all 1s ease;
  -ms-transition: all 1s ease;
  transition: all 1s ease;
}
@media (max-width: 767px) {
  .nav-side-menu {
    position: relative;
    width: 100%;
    margin-bottom: 10px;
  }
  .nav-side-menu .toggle-btn {
    display: block;
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 10 !important;
    padding: 3px;
    background-color: #ffffff;
    color: #000;
    width: 40px;
    text-align: center;
  }
  .brand {
    text-align: left !important;
    font-size: 22px;
    padding-left: 20px;
    line-height: 50px !important;
  }
}
@media (min-width: 767px) {
  .nav-side-menu .menu-list .menu-content {
    display: block;
  }
}
body {
  margin: 0px;
  padding: 0px;
}
</style>
