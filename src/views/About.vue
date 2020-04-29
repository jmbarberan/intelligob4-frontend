<template>
  <div class="about">
    <div>
      <b-jumbotron class="h-100"
        header="Intelligob 4"
        lead="Sistema administrativo integrado"
      >
        <b-container>
          <img center alt="Intelligob logo" src="../assets/logo.png" />
        </b-container>
        <p>&copy; 2020 Software Ecuador</p>
        <p>jmbarberan1@hotmail.com</p>
        <p>Visite nuestra web</p>
        <b-button variant="outline-primary" href="#" class="mr-2">Mas Informacion</b-button>
        <b-button variant="outline-primary" class="mr-2" @click="$router.go(-1)">Volver</b-button>
        <b-button variant="outline-success" to="/">Ir al Inicio</b-button>
      </b-jumbotron>
    </div>
  </div>
</template>
