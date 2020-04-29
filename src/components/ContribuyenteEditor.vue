<template>
  <div>
    <b-modal id="contribuyenteEditor" size="lg"
      v-model="modal.visto"
      @ok="aceptar"
      @hidden="cancelar()"
      no-close-on-backdrop
      no-close-on-esc
      centered
      button-size="sm"
    >
      <template v-slot:modal-header>
        <h5>{{ modal.operacion }} contribuyente</h5>
      </template>
      <valobservador id="contribuyenteVo" ref="form">
        <b-form @submit.prevent="handleOk">
          <b-row class="my-1">
            <b-col sm="4">
              <label for="txCedula">Cedula/R.U.C.</label>
            </b-col>
            <b-col sm="3">
              <valproveedor
                name="tipoIdentificacion"
                :rules="`required|oneOf:${tiposLista}`"
                v-slot="validationContext">
                <b-form-select id="input-3"
                  v-model="usuario.tipoIdentificacion" 
                  :options="tipoIdents"
                  value-field="id"
                  text-field="denominacion"
                  :state="getValidationState(validationContext)"/>
                <b-form-invalid-feedback id="tipoIden-lf" :state="getValidationState(validationContext)">Seleccione una opcion</b-form-invalid-feedback>  
              </valproveedor>    
            </b-col>
            <b-col sm="5">
              <valproveedor
                name="identificacion"
                :rules="`${usuario.tipoIdentificacion == identCedula ? 'required|digits:10' : 'required|digits:13'}`"
                v-slot="validationContext">
                <b-form-input v-model="usuario.identificacion" :state="getValidationState(validationContext)" id="txCedula"/>
                <b-form-invalid-feedback id="identifica-lf" :state="getValidationState(validationContext)">{{ validationContext.errors[0] }}</b-form-invalid-feedback>  
              </valproveedor>  
            </b-col>
          </b-row>
          
          <valproveedor
            name="nombres"
            rules="required|min:7|alpha_spaces"
            v-slot="validationContext">
            <b-row class="my-1">
              <b-col sm="4">
                <label for="txNombre">Apellidos y Nombres</label>
              </b-col>
              <b-col sm="8">
                <b-form-input v-model="usuario.nombres" :state="getValidationState(validationContext)" id="txNombres"/>
                <b-form-invalid-feedback id="nombres-lf" :state="getValidationState(validationContext)">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
              </b-col>
            </b-row>
          </valproveedor>
          <valproveedor
            name="email"
            rules="email"
            v-slot="validationContext">
            <b-row class="my-1">
              <b-col sm="4">
                <label for="txEmail">Correo electronico</label>
              </b-col>
              <b-col sm="8">
                <b-form-input v-model="usuario.email" :state="getValidationState(validationContext)" id="txEmail"/>
              </b-col>
              <b-form-invalid-feedback id="email-lf">{{ validationContext.errors[0] }}</b-form-invalid-feedback>    
            </b-row>
          </valproveedor>  
          <b-row class="my-1">
            <b-col sm="4">
              <label for="txDomicilio">Direccion domicilio</label>
            </b-col>
            <b-col sm="8">
              <b-form-input v-model="usuario.domicilio" id="txDomicilio"/>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col sm="4">
              <label for="txTelefono">Telefonos</label>
            </b-col>
            <b-col sm="8">
              <b-form-input v-model="usuario.telefono" id="txTelefono"/>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col sm="4">
              <label for="txRepresentante">Representante</label>
            </b-col>
            <b-col sm="8">
              <b-form-input v-model="usuario.representante" id="txRepresentante"/>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col sm="4">
              <label for="txFecha">Fecha de Nacimiento</label>
            </b-col>
            <b-col sm="8">
              <b-form-input v-model="usuario.fechaNacimiento" id="txFecha" type="date"/>
            </b-col>
          </b-row>
        </b-form>
      </valobservador>  
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
import axios from "axios";
import { ValidationObserver, ValidationProvider, extend, localize } from 'vee-validate';
import { required, email, digits, min, alpha_spaces, oneOf } from 'vee-validate/dist/rules';
import es from "vee-validate/dist/locale/es.json";
import { mapState, mapActions, mapMutations } from "vuex";
const maestrosRutas = require("@/rutas/maestros.js");
const constantes = require("@/constantes/maestros.js");

export default {
  name: "ContribuyenteEditor",
  components: {
    valproveedor: ValidationProvider,
    valobservador: ValidationObserver,
  },
  data: () => ({
    tipoIdents: [],
    identCedula: 5,
  }),
  computed: {
    ...mapState("seguridad", {
      token: state => state.sesion.token,
    }),
    usuario: {
      get() {
        return this.$store.state.contribuyentes.contribuyenteMEDatos;
      },
      set(value) {
        this.$store.commit("contribuyentes/setContribuyenteMEDatos", value, { root: true });
      }
    },
    modal: {
      get() {
        return this.$store.state.contribuyentes.contribuyenteME;
      },
      set(value) {
        this.$store.commit("contribuyentes/setContribuyenteMEVisto", value, { root: true });
      }
    },
    tiposLista: function() {
      let ret = "";
      if (this.tipoIdents.lenght > 0) {
        this.tipoIdents.forEach(function(item) {
          ret += ret.length > 0 ? "," + item.id.toStrign() : item.id.toStrign();
        });
      } else {
        ret = constantes.maestros().identificacion.tiposCadena;
      }
      return ret;
    },
  },
  methods: {
    ...mapActions("contribuyentes", { guardar: "contribuyenteMEGuardar" }),
    ...mapMutations("contribuyentes", { resetear: "resetearContribuyenteME" }),
    ...mapMutations("contribuyentes", { resetOriginal: "anularContribuyenteMEOriginal" }), 
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    aceptar(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.$refs.form.validate().then(success => {
        if (!success) {
          return;
        }

        this.guardar();

        // Wait until the models are updated in the UI
        this.$nextTick(() => {
          this.$refs.form.reset();
        });
      });
    },
    cancelar() {
      this.resetear();
      this.resetOriginal();
    },
  },
  created() {
    let config = {
      headers: {
        Authorization: this.token
      },
      withCredentials: true,
      crossdomain: true
    };
    axios.get(maestrosRutas.backend().clavesPorTabla(3),
      config
    )
    .then(response => {
      this.tipoIdents = response.data;
      this.identCedula = this.tipoIdents[0].id;
    })
    .catch(() => {
      this.tipoIdents = constantes.maestros().identificacion.tipos;
      this.identCedula = constantes.maestros().identificacion.cedulaId;
    });

    extend("email", email);
    extend("required", required);
    extend("digits", digits);
    extend("min", min);
    extend("alpha_spaces", alpha_spaces);
    extend("oneOf", oneOf);

    localize("es", es);
  },
};
</script>
