<template>
  <div class="about">
    <appMenu />
    <b-container fluid>
      <h4>Usuarios del sistema</h4>
      <b-button-toolbar
        aria-label="Toolbar with button groups and input groups"
      >
        <b-button-group size="sm" class="mr-1">
          <b-button 
            @click="crear()"
            variant="outline-success" 
            class="text-left"
            v-b-tooltip 
            title="Crear nuevo"
          >
            <b-icon icon="plus" aria-hidden="true" font-scale="2"/>
          </b-button>
          <b-button 
            @click="buscar()"
            variant="outline-secondary" 
            class="text-left"
            v-b-tooltip 
            title="Actualizar"
          >
            <b-icon icon="arrow-repeat" aria-hidden="true" font-scale="2"/>
          </b-button>
          <b-button
            @click="modificar()"
            variant="outline-secondary" 
            :disabled="modificable"
            v-b-tooltip 
            title="Modificar"
            class="text-left"
          >
            <b-icon icon="pencil" aria-hidden="true" font-scale="2"/>
          </b-button>
          <b-button
            @click="restaurar()"
            variant="outline-secondary" 
            :disabled="restaurable"
            v-b-tooltip 
            title="Restaurar"
            class="text-left"
          >
            <b-icon icon="arrow-counterclockwise" aria-hidden="true" font-scale="2"/>
          </b-button>
          <b-button
            @click="eliminar()"
            :disabled="eliminable"
            variant="outline-danger"
            v-b-tooltip 
            title="Eliminar"
            class="text-left"
          >
            <b-icon icon="trash" aria-hidden="true" font-scale="2"/>
          </b-button>
        </b-button-group>
        <b-button-group size="sm" class="mr-1">
          <b-button
            @click="privilegios()"
            variant="outline-secondary" 
            :disabled="modificable"
            v-b-tooltip 
            title="Privilegios"
            class="text-left"
          >
            <b-icon icon="shield-lock" aria-hidden="true" font-scale="2"/>
          </b-button>
          <b-button
            @click="privilegios()"
            variant="outline-secondary" 
            :disabled="modificable"
            v-b-tooltip 
            title="Cambiar contraseña"
            class="text-left"
          >
            <b-icon icon="unlock" aria-hidden="true" font-scale="2"/>
          </b-button>
        </b-button-group>
        <b-input-group class="ml-auto">
          <b-form-checkbox
            class="mx-1 mt-2"
            v-model="eliminados"
            name="check-button"
            switch
            size="md"
          >
            Mostrar eliminados: <b>{{ eliminadosBin }}</b>
          </b-form-checkbox>
        </b-input-group>
      </b-button-toolbar>
      <b-table
        :items="usuarios"
        :fields="campos"
        :busy="ocupado"
        aria-busy
        show-empty
        empty-text="No hay registros que mostrar"
        select-mode="single"
        selectable
        @row-selected="onSeleccion"
        small
        head-variant="light"
        class="mt-2"
        hover
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
      </b-table>
    </b-container>
  </div>
</template>

<script>
import appMenu from "@/components/Menu.vue";
import procesando from "@/components/Procesando.vue";
import Vue from "vue";
import { BootstrapVueIcons } from "bootstrap-vue";
import "bootstrap-vue/dist/bootstrap-vue-icons.min.css";
import { mapState, mapActions, mapMutations } from "vuex";

Vue.use(BootstrapVueIcons);

export default {
  name: "Contribuyentes",
  components: {
    appMenu,
    procesando
  },
  data() {
    return {
      campos: [
        { key: "selected", label: "", sortable: false },
        {
          key: "nombres",
          label: "Nombres",
          sortable: true,
          class: "text-left",
          sortDirection: "desc"
        },
        { key: "codigo", label: "Codigo", sortable: true, class: "text-center" }
      ],
      eliminados: false,
      seleccionado: null
    };
  },
  computed: {
    eliminadosBin: function() {
      if (this.eliminados == true) {
        return "Si";
      } else {
        return "No";
      }
    },
    modificable: function() {
      let ret = false;
      if (this.seleccionado == null) {
        ret = true;
      } else {
        if (this.seleccionado.estado != 0) {
          ret = true;
        }
      }
      return ret;
    },
    eliminable: function() {
      let ret = false;
      if (this.seleccionado == null) {
        ret = true;
      } else {
        if (this.seleccionado.estado != 0) {
          ret = true;
        }
      }
      return ret;
    },
    restaurable: function() {
      let ret = false;
      if (this.seleccionado == null) {
        ret = true;
      } else {
        if (this.seleccionado.estado != 2) {
          ret = true;
        }
      }
      return ret;
    },
    restringible: function() {
      let ret = false;
      if (this.seleccionado == null) {
        ret = true;
      } else {
        if (this.seleccionado.estado != 0) {
          ret = true;
        } else {
          if (this.seleccionado.id == 1) {
            return true;
          }
        }
      }
      return ret;
    },
    ...mapState("seguridad", {
      usuarios: state => state.consultaUsuarios.lista,
      ocupado: state => state.consultaUsuarios.ocupado
    })
  },
  methods: {
    ...mapActions("seguridad", { traerUsuarios: "traerUsuarios" }),
    ...mapMutations({ verMensaje: "resetearConteoInfoMsj" }),
    buscar() {
      let est = 0;
      if (this.eliminados == true) {
        est = 9;
      }
      this.traerUsuarios(est);
    },
    modificar() {
      if (this.seleccionado != null)
        this.verMensaje({ mensaje: "Modificar " + this.seleccionado.nombres });
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
    privilegios() {
      if (this.seleccionado != null)
        this.verMensaje({
          mensaje: "Privilegios de " + this.seleccionado.nombres
        });
    },
    cambiarClave() {
      if (this.seleccionado != null)
        this.verMensaje({
          mensaje: "Cambiar clave de " + this.seleccionado.nombres
        });
    },
    onSeleccion(item) {
      this.seleccionado = item[0];
    }
  },
  created() {
    this.traerUsuarios(0);
  }
};
</script>
