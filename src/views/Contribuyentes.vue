<template>
  <div class="about">
    <appMenu/>
    <editor/>
    <b-container fluid>
      <h4>Directorio de Contribuyentes</h4>
      <b-button-toolbar aria-label="Toolbar with button groups and input groups">
        <b-button-group size="sm" class="mr-1">
          <b-button v-for="cmd in comandos" :key="cmd.id"
            @click=cmd.metodo
            :disabled="esInactivo(cmd.id)"
            :variant="cmd.variante"
            class="text-left"
            v-b-tooltip 
            :title="cmd.titulo"
          >
            <b-icon :icon="cmd.icono" aria-hidden="true" font-scale="2"/>
          </b-button>
        </b-button-group>
        <b-input-group size="sm" class="mx-1 my-auto">
          <b-input-group-prepend size="sm">
            <b-button
              @click="buscar()"
              :disabled="buscarDesactivado"
              variant="outline-secondary"
              >Buscar</b-button
            >
          </b-input-group-prepend>
          <b-form-input v-model="busqueda.filtro" size="sm" v-on:keyup="buscarEnter"/>
          <template v-slot:append>
            <b-dropdown
              size="sm"
              :text="busqueda.tipoTitulo"
              variant="secondary"
              :disabled="busqueda.cedula"
            >
              <b-dropdown-item @click="cambiarTipo(0)"
                >Comenzando con
              </b-dropdown-item>
              <b-dropdown-item @click="cambiarTipo(1)"
                >Conteniendo a
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </b-input-group>
        <b-input-group-prepend>
          <b-form-checkbox
            class="ml-2 my-auto"
            v-model="busqueda.cedula"
            name="check-button"
            switch
            size="md">
            Buscar por cedula: <b>{{ buscarCedulaBin }}</b>
          </b-form-checkbox>
        </b-input-group-prepend>
        <b-input-group class="ml-auto my-auto">
          <b-form-checkbox
            class="mx-1"
            v-model="busqueda.eliminados"
            name="check-button"
            switch
            size="md">
            Mostrar eliminados: <b>{{ eliminadosBin }}</b>
          </b-form-checkbox>
        </b-input-group>
      </b-button-toolbar>
      <b-table
        class="mt-2"
        :busy="ocupado"
        aria-busy
        show-empty
        empty-text="No hay registros que mostrar"
        select-mode="single"
        selectable
        @row-selected="onSeleccion"
        small
        :items="contribuyentes"
        :fields="campos"
        head-variant="light"
      >
        <template v-slot:table-busy>
          <procesando msj=" Consultando..." />
        </template>
        <template v-slot:head(selected)>
          <span aria-hidden="true">
            <b-icon
              icon="check-box"
              aria-hidden="true"
              variant="secundary"
              font-scale="1.25"
            ></b-icon>
          </span>
        </template>
        <template v-slot:cell(selected)="{ rowSelected }">
          <template v-if="rowSelected">
            <span aria-hidden="true">
              <b-iconstack font-scale="1">
                <b-icon stacked icon="square"></b-icon>
                <b-icon stacked icon="check" variant="success"></b-icon>
              </b-iconstack>
            </span>
          </template>
          <template v-else>
            <span aria-hidden="true">
              &nbsp;
            </span>
          </template>
        </template>
        <template v-slot:cell(nombres)="data">
          <s v-if="data.item.estado == 2" class="text-danger">{{
            data.value
          }}</s>
          <span v-else class="text-decoration-none">{{ data.value }}</span>
        </template>
        <!--template v-slot:row-details="row">
          <b-card>
            <ul>
              <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
            </ul>
          </b-card>
        </template-->
      </b-table>
    </b-container>
  </div>
</template>

<script>
import Vue from "vue";
import appMenu from "@/components/Menu.vue";
import editor from "@/components/ContribuyenteEditor.vue";
import procesando from "@/components/Procesando.vue";
import { BootstrapVueIcons } from "bootstrap-vue";
import "bootstrap-vue/dist/bootstrap-vue-icons.min.css";
import { mapState, mapActions, mapMutations } from "vuex";
Vue.use(BootstrapVueIcons);

const constantes = require("@/constantes/contribuyentes.js");

export default {
  name: "Contribuyentes",
  components: {
    appMenu,
    procesando,
    editor,
  },
  data() {
    return {
      seleccionado: null,
      campos: [
        { key: "selected", label: "", sortable: false },
        {
          key: "nombres",
          label: "Nombres",
          sortable: true,
          class: "text-left",
          sortDirection: "desc"
        },
        {
          key: "identificacion",
          label: "Cedula/RUC",
          sortable: true,
          class: "text-center"
        },
        { key: "email", label: "Correo", sortable: true, class: "text-left" },
        { key: "telefono", label: "Telefonos", class: "text-left" }
      ],
      busqueda: {
        tipo: 0,
        filtro: "",
        tipoTitulo: "Comenzando con",
        cedula: false,
        eliminados: false,
      },
      comandos: [
        { id: 1, titulo: 'Crear nuevo', variante: 'outline-success', icono: 'plus', 
          desactivado: this.crearNo, metodo: this.crear, datos: null },
        { id: 2, titulo: 'Modificar', variante: 'outline-secondary', icono: 'pencil', 
          desactivado: this.modificarNo, metodo: this.modificar, datos: null },
        { id: 4, titulo: 'Restaurar', variante: 'outline-secondary', icono: 'arrow-counterclockwise', 
          desactivado: this.restaurarNo, metodo: this.restaurar, datos: null },
        { id: 3, titulo: 'Eliminar', variante: 'outline-danger', icono: 'trash', 
          desactivado: this.eliminarNo, metodo: this.eliminar, datos: null },
      ],
      privilegios: [
        { id: 0, habilitado: false }
      ],
    };
  },
  computed: {
    eliminadosBin: function() {
      if (this.busqueda.eliminados == true) {
        return "Si";
      } else {
        return "No";
      }
    },
    buscarCedulaBin: function() {
      if (this.busqueda.cedula == true) {
        return "Si";
      } else {
        return "No";
      }
    },
    buscarDesactivado: function() {
      return this.busqueda.filtro.length <= 1;
    },
    crearNo: function () {
      let res = this.privilegios.find(prv => prv.id === constantes.contribuyentes().funcion.comandos.crearId);
      if (res != undefined) {
        return !res.habilitado // devolver invertido pq es el atributo desactivo del boton
      } else {
        return true;
      }
    },
    modificarNo: function() {
      let priv = false;
      let res = this.privilegios.find(prv => prv.id === constantes.contribuyentes().funcion.comandos.modificarId);
      if (res != undefined) {
        priv = res.habilitado
      } else {
        priv = false;
      }

      let ret = false;
      if (this.seleccionado == null) {
        ret = true;
      } else {
        if (this.seleccionado.estado != 0) {
          ret = true;
        }
      }
      return ret || !priv;
    },
    eliminarNo: function() {
      // Validar si tiene este privilegio se retorna invertido para desactiaar el boton
      let priv = false;
      let res = this.privilegios.find(prv => prv.id === constantes.contribuyentes().funcion.comandos.eliminarId);
      if (res != undefined) {
        priv = res.habilitado
      } else {
        priv = false;
      }
      
      let ret = false;
      if (this.seleccionado == null) {
        ret = true;
      } else {
        if (this.seleccionado.estado != 0) {
          ret = true;
        }
      }
      return ret || !priv;
    },
    restaurarNo: function() {
      let priv = false;
      let res = this.privilegios.find(prv => prv.id === constantes.contribuyentes().funcion.comandos.restaurarId);
      if (res != undefined) {
        priv = res.habilitado
      } else {
        priv = false;
      }

      let ret = false;
      if (this.seleccionado == null) {
        ret = true;
      } else {
        if (this.seleccionado.estado != 2) {
          ret = true;
        }
      }
      return ret || !priv;
    },
    ...mapState("contribuyentes", {
      contribuyentes: state => state.busqueda.lista,
      ocupado: state => state.busqueda.ocupado
    }),
  },
  methods: {
    ...mapActions("seguridad", { traerPrivilegios: "traerPrivilegioFuncion" }),
    ...mapActions("contribuyentes", { buscarNombres: "buscarNombres" }),
    ...mapActions("contribuyentes", { fbuscarCedula: "buscarCedula" }),
    ...mapMutations({ verMensaje: "resetearConteoInfoMsj" }),
    ...mapMutations("contribuyentes", { pasarUsuario: "setContribuyenteMEDatos" }),
    ...mapMutations("contribuyentes", { pasarOriginal: "setContribuyenteMEOriginal" }), 
    ...mapMutations("contribuyentes", { verEditor: "setContribuyenteMEVisto" }),
    ...mapMutations("contribuyentes", { actualizaOperacion: "setContribuyenteMEOperacion" }),
    buscarEnter(evt) {
      if (!this.buscarDesactivado) {
        if (evt.keyCode === 13) {
          this.buscar();
        }
      }
    },
    buscar() {
      let est = 0;
      if (this.busqueda.eliminados == true) {
        est = 9;
      }
      if (this.buscarCedula) {
        this.fbuscarCedula({
          estado: est,
          filtro: this.busqueda.filtro
        });
      } else {
        this.buscarNombres({
          tipo: this.busqueda.tipo,
          estado: est,
          filtro: this.busqueda.filtro
        });
      }
    },
    esInactivo(cmd) {
      switch(cmd) {
        case constantes.contribuyentes().funcion.comandos.crearId:
          return this.crearNo;
        case constantes.contribuyentes().funcion.comandos.modificarId:
          return this.modificarNo;
        case constantes.contribuyentes().funcion.comandos.eliminarId:
          return this.eliminarNo;
        case constantes.contribuyentes().funcion.comandos.restaurarId:
          return this.restaurarNo;
        default:
          return true;
      } 
    },
    crear() {
      this.actualizaOperacion("Nuevo")
      this.verEditor(true);
    },
    modificar() {
      if (this.seleccionado != null) {
        this.actualizaOperacion("Modificando");
        this.pasarUsuario(this.seleccionado);
        this.pasarOriginal(this.seleccionado);
        this.verEditor(true);
      }
    },
    eliminar() {
      if (this.seleccionado != null)
        this.verMensaje({
          mensaje: "Eliminar " + this.seleccionado.nombres,
          variante: "warning"
        });
    },
    restaurar() {
      if (this.seleccionado != null)
        this.verMensaje({ mensaje: "Restaurar " + this.seleccionado.nombres });
    },
    cambiarTipo(p) {
      this.busqueda.tipo = p;
      if (p == 0) this.busqueda.tipoTitulo = "Comenzando con";
      else this.busqueda.tipoTitulo = "Conteniendo a";
    },
    onSeleccion(item) {
      this.seleccionado = item[0];
    },
  },
  created() {
    this.traerPrivilegios(constantes.contribuyentes().funcion.id).then(resp => {
      if (resp != null) {
        let coms = resp.comandos;
        resp.funcionNav.comandosNav.forEach(cmd => {
          this.privilegios.push({
            id: cmd.id,
            habilitado: coms.includes(cmd.id.toString()),
          });
        });
      } 
    });
  }
};
</script>
