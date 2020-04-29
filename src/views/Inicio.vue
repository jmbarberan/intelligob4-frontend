<template>
  <div class="home">
    <appMenu />
    <b-container>
      <b-row justify="center" class="centrado">
          <img class="mx-auto" alt="Vue logo" src="../assets/logo.png" />
      </b-row>
    </b-container>
  </div>
</template>

<script>
import appMenu from "@/components/Menu.vue";

export default {
  name: "Inicio",
  components: {
    appMenu,
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
