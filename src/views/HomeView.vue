<template>
  <div class="home">
    <!-- En-tête -->
    <HeaderComponent />

    <!-- Contenu principal -->
    <div class="container">
      <h2>Bienvenue sur QRAP Assist</h2>
      <p>Veuillez choisir une option :</p>
      <!-- Liens de navigation -->
      <ul>
        <li>
          <router-link to="/form-security">Formulaire Sécurité</router-link>
        </li>
        <li>
          <router-link to="/form-machine-breakdown">Formulaire Pannes Machines</router-link>
        </li>
        <li>
          <router-link to="/form-mesure">Formulaire Mesure</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import HeaderComponent from '@/components/HeaderComponent.vue'

export default {
  name: 'HomeView',
  components: {
    HeaderComponent
  }
}
</script>

<style scoped>
/* Vos styles pour HomeView */
.container {
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  font-size: 1.4em;
  margin-top: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 10px 0;
}

router-link {
  font-size: 1.2em;
  color: #003b71;
  text-decoration: none;
}

router-link:hover {
  text-decoration: underline;
}
</style>
