<template>
  <b-container class="centrado">
    <b-row>
      <b-container>
        <img center alt="Vue logo" src="../assets/logo.png" />
      </b-container>
    </b-row>
    <b-row>
      <ocupado />
      <b-col />
      <b-col class="my-auto">
        <b-form @submit="onAcceder" @reset="onReset" v-if="ver">
          <b-form-group id="input-group-usr">
            <b-form-input
              id="input-usr"
              v-model="credenciales.usuario"
              required
              placeholder="Usuario"
            />
          </b-form-group>
          <b-form-group>
            <b-input-group>
              <b-form-input
                id="input-clave"
                :type="tipo"
                v-model="credenciales.clave"
                placeholder="Contraseña"
                required
              />
              <b-input-group-append>
                <b-button @click="verClave()"
                  ><b-icon :icon="icono" aria-hidden="true"
                /></b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
          <b-form-group id="input-group-recordar">
            <b-form-checkbox v-model="recordar" name="chk-recordar" switch>
              Recordar
            </b-form-checkbox>
          </b-form-group>
          <div class="row">
            <div class="col-6">
              <b-button type="submit" variant="primary">Acceder</b-button>
            </div>
            <div class="col-6">
              <b-button type="reset" variant="danger">Resetear</b-button>
            </div>
          </div>
        </b-form>
      </b-col>
      <b-col />
    </b-row>
  </b-container>
</template>

<script>
import Vue from "vue";
import { BootstrapVueIcons } from "bootstrap-vue";
import "bootstrap-vue/dist/bootstrap-vue-icons.min.css";

import { mapState, mapActions } from "vuex";
import ocupado from "@/components/Ocupado.vue";

Vue.use(BootstrapVueIcons);

export default {
  components: {
    ocupado
  },
  data: () => ({
    credenciales: {
      usuario: "",
      clave: ""
    },
    recordar: false,
    ver: true,
    tipo: "password",
    icono: "eye"
  }),
  computed: {
    ...mapState("seguridad", {
      usuario: state => state.sesion.usrCodigo
    })
  },
  methods: {
    ...mapActions("seguridad", { acceder: "acceder" }),
    onAcceder(evt) {
      evt.preventDefault();
      this.acceder(this.credenciales);
      //this.credenciales.usuario = "";
      this.credenciales.clave = "";
    },
    onReset(evt) {
      evt.preventDefault();
      this.credenciales.usuario = "";
      this.credenciales.clave = "";
    },
    verClave() {
      if (this.tipo === "password") {
        this.tipo = "text";
        this.icono = "eye-slash";
      } else {
        this.tipo = "password";
        this.icono = "eye";
      }
    }
  },
  mounted() {
    this.credenciales.usuario = "";
    this.credenciales.clave = "";
  }
};
</script>

<style scoped>
  .centrado {
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
</style>
