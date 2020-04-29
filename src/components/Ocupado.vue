<template>
  <div>
    <b-modal
      v-model="ocupado.procesando"
      no-close-on-backdrop
      no-close-on-esc
      centered
      hide-header
      hide-footer
    >
      <h4>{{ ocupado.titulo }}</h4>
      <p>{{ ocupado.mensaje }}</p>
      <b-progress :value="100" variant="primary" striped animated></b-progress>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["ocupado"])
  }
};
</script>
