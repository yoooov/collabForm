<template>
  <header>
    <div class="container">
      <div class="header-content">
        <!-- Logo de l'application -->
        <div class="logo">
          <img src="../assets/img/Collab_QRAP.png" alt="Logo" />
          <h1>Collab - QRAP Assist</h1>
        </div>
        <!-- Menu déroulant sous forme de sélecteur -->
        <div class="selector-menu">
          <select
            v-model="currentPage"
            @change="navigateToPage"
            class="page-selector"
            :style="{ backgroundColor: selectorBackgroundColor, color: selectorColor }"
          >
            <!-- Affichage dynamique des options -->

            <option value="/form-security">Sécurité</option>
            <option value="/form-machine-breakdown">Panne Machine</option>
          </select>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'HeaderComponent',
  data() {
    return {
      // Définit la route actuelle pour lier à la navigation
      currentPage: this.$route.path
    }
  },
  computed: {
    // Calcul dynamique de la couleur d'arrière-plan du sélecteur en fonction de la page
    selectorBackgroundColor() {
      if (this.currentPage === '/form-security') {
        return '#E1251B' // Couleur rouge pour la sécurité
      } else return '#f9f9f9' // Couleur par défaut
    },
    selectorColor() {
      if (this.currentPage === '/form-security') {
        return '#f9f9f9' // Couleur rouge pour la sécurité
      } else return '#000' // Couleur par défaut
    }
  },
  methods: {
    // Naviguer vers la page sélectionnée dans le menu
    navigateToPage() {
      this.$router.push(this.currentPage)
    }
  },
  watch: {
    // Met à jour le sélecteur si la route change
    '$route.path'(newPath) {
      this.currentPage = newPath
    }
  }
}
</script>

<style scoped>
/* Styles pour le header */
header {
  background-color: #4e6b7c;
  width: 100%;
  margin-bottom: 20px;
  border-bottom: 5px solid #82e600;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  gap: 10px;
  flex-direction: column;
  margin: 10px 0;
}

.logo img {
  width: 175px;
}

.logo h1 {
  text-transform: uppercase;
  color: #ffffff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 1.8em;
}

/* Styles pour le sélecteur */
.selector-menu {
  position: relative;
}

.page-selector {
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 5px;
  background-color: #f9f9f9;
  color: #333;
  cursor: pointer;
}

.page-selector:focus {
  outline: none;
  border-color: #82e600;
}

.page-selector option {
  background-color: white;
  color: #333;
  padding: 10px;
}

.page-selector option:hover {
  background-color: #007bff;
  color: white;
}
</style>
