<template>
  <div class="text-center text-primary my-2">
    <b-progress
      :value="100"
      variant="primary"
      striped
      animated
      class="mt-2"
    ></b-progress>
    <strong>{{ msj }}</strong>
  </div>
</template>

<script>
export default {
  name: "Procesando",
  props: {
    msj: String
  }
};
</script>
