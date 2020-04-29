<template>
  <div>
    <b-modal
      v-model="visto"
      id="modal-clave"
      ref="modal"
      no-close-on-backdrop
      no-close-on-esc
      centered
      size="sm"
      @ok="handleOk"
    >
      <template v-slot:modal-header>
        <h6>Digite su contraseña nueva</h6>
      </template>
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-input-group>
          <b-form-input
            v-model="clave"
            id="input-clave"
            :type="tipo"
            placeholder="Contraseña"
            required
          />
          <b-input-group-append>
            <b-button @click="verClave()">
              <b-icon :icon="icono" aria-hidden="true" />
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </form>
      <template v-slot:modal-ok>
        Aceptar
      </template>
      <template v-slot:modal-cancel>
        Cancelar
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "CambiarClave",
  data: () => ({
    clave: "",
    tipo: "password",
    icono: "eye"
  }),
  computed: {
    visto: {
      get() {
        return this.$store.state.seguridad.verCambiarClave;
      },
      set(value) {
        this.$store.commit("seguridad/modVerCambiarClave", value, {
          root: true
        });
      }
    }
  },
  methods: {
    ...mapActions("seguridad", { cambiarClave: "cambiarClave" }),
    onSubmit(evt) {
      evt.preventDefault();
      this.cambiarClave(this.clave);
    },
    verClave() {
      if (this.tipo === "password") {
        this.tipo = "text";
        this.icono = "eye-slash";
      } else {
        this.tipo = "password";
        this.icono = "eye";
      }
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.clave = valid;
      return valid;
    },
    resetModal() {
      this.clave = "";
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },
    handleSubmit() {
      this.cambiarClave(this.clave);
      this.visto = false;
    }
  }
};
</script>
