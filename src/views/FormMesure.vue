<template>
  <!-- En-tête du formulaire avec le nom et la référence de la pièce -->
  <header>
    <div class="container">
      <div class="header-content">
        <!-- Logo de l'application -->
        <div class="logo">
          <img src="../assets/img/Collab_QRAP.png" alt="Logo" />
          <h1>Collab - Mesure</h1>
        </div>
        <!-- Affichage du nom et de la référence de la pièce -->
        <div class="piece-info">
          <h2>{{ pieceName }}</h2>
          <p>Référence : {{ pieceReference }}</p>
        </div>
      </div>
    </div>
  </header>

  <div class="container">
    <!-- Section des consignes -->
    <div class="instructions-section">
      <div class="instructions">
        <!-- Titre et limite de la mesure actuelle dans le cadre des consignes -->
        <h2>{{ currentMeasure.title }}</h2>

        <h3>Consignes pour la prise de mesure :</h3>
        <ul>
          <li>
            Limite de mesure :
            <span style="font-weight: bold"
              >{{ currentMeasure.min }} - {{ currentMeasure.max }}</span
            >
          </li>
          <li v-for="(instruction, index) in currentMeasure.instructions" :key="index">
            {{ instruction }}
          </li>
        </ul>
      </div>
      <div class="image-section">
        <img :src="currentMeasure.imageSrc" alt="Image de consigne" />
      </div>
    </div>

    <!-- Section pour entrer les cotes -->
    <div class="measurement-section">
      <h3>Saisie des mesures :</h3>
      <div class="measurement-inputs">
        <div v-for="(measure, index) in measurements" :key="index" class="measurement-input">
          <label :for="'measure-' + (index + 1)">Pièce {{ index + 1 }} :</label>
          <input
            type="number"
            step="0.01"
            :id="'measure-' + (index + 1)"
            v-model="measure.value"
            :class="{
              valid: isValid(measure.value),
              invalid: !isValid(measure.value) && measure.value !== null
            }"
            placeholder="Entrez la mesure"
          />
        </div>
      </div>
    </div>

    <!-- Boutons de navigation -->
    <div class="navigation-buttons">
      <!-- Bouton Précédent -->
      <button v-if="currentMeasureIndex > 0" @click="previousMeasure">Précédent</button>

      <!-- Bouton Suivant -->
      <button v-if="currentMeasureIndex < measurementsData.length - 1" @click="nextMeasure">
        Suivant
      </button>
    </div>

    <!-- Bouton Soumettre uniquement pour la dernière mesure -->
    <div class="submit" v-if="currentMeasureIndex === measurementsData.length - 1">
      <button @click="submitMeasurements">Soumettre les mesures</button>
      <!-- Message de succès -->
      <span v-if="successMessage" class="success-message">{{ successMessage }}</span>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import imgControleOne from '@/assets/img/illustration_1.png'

export default {
  data() {
    return {
      pieceName: 'Pièce A', // Nom de la pièce à contrôler
      pieceReference: 'REF12345', // Référence de la pièce
      currentMeasureIndex: 0, // Index de la mesure actuellement affichée
      successMessage: '', // Stocke le message de succès
      // Tableau contenant les différentes mesures et leurs paramètres (limites, consignes, etc.)
      measurementsData: [
        {
          // Détails de la première mesure avec ses limites, consignes et image associée
          title: 'Mesure 1',
          min: 22.5, // Limite minimale de la mesure
          max: 26, // Limite maximale de la mesure
          instructions: [
            "Assurez-vous que l'instrument de mesure est correctement calibré.",
            "Vérifiez l'état de la pièce avant de prendre la mesure.",
            'Notez chaque mesure avec précision.'
          ],
          imageSrc: imgControleOne, // Chemin de l'image spécifique à cette mesure
          measurements: Array.from({ length: 8 }, (v, i) => ({
            pieceName: `Pièce ${i + 1}`,
            value: null
          })) // Six mesures par défaut, chaque mesure associée à un nom de pièce
        }
        // Pour ajouter d'autre mesure:
        //,
        // {
        //   title: 'Mesure 2',
        //   min: 22.5, // Limite minimale de la mesure
        //   max: 26, // Limite maximale de la mesure
        //   instructions: [
        //     "Assurez-vous que l'instrument de mesure est correctement calibré.",
        //     "Vérifiez l'état de la pièce avant de prendre la mesure.",
        //     'Notez chaque mesure avec précision.'
        //   ],
        //   imageSrc: imgControleOne, // Chemin de l'image spécifique à cette mesure
        //   measurements: Array.from({ length: 6 }, (v, i) => ({
        //     pieceName: `Pièce ${i + 1}`,
        //     value: null
        //   })) // Six mesures par défaut, chaque mesure associée à un nom de pièce
        // }
      ]
    }
  },
  computed: {
    // Calcul pour obtenir la mesure actuelle à partir de l'index
    currentMeasure() {
      return this.measurementsData[this.currentMeasureIndex]
    },
    // Récupérer les mesures associées à la mesure actuelle
    measurements() {
      return this.currentMeasure.measurements
    }
  },
  methods: {
    // Vérifie si la valeur de la mesure est comprise entre les limites min et max
    isValid(value) {
      return value >= this.currentMeasure.min && value <= this.currentMeasure.max
    },
    // Passe à la mesure suivante si elle existe
    nextMeasure() {
      if (this.currentMeasureIndex < this.measurementsData.length - 1) {
        this.currentMeasureIndex++ // Incrémenter l'index de la mesure actuelle
      }
    },
    // Retourne à la mesure précédente si elle existe
    previousMeasure() {
      if (this.currentMeasureIndex > 0) {
        this.currentMeasureIndex-- // Décrémenter l'index de la mesure actuelle
      }
    },
    resetMeasurements() {
      this.measurementsData.forEach((measure) => {
        measure.measurements = measure.measurements.map(() => ({ value: null })) // Conserver le nombre d'inputs initial
      })
    },
    // Soumission des mesures au backend
    async submitMeasurements() {
      try {
        // Filtrer les données pour ne pas envoyer les instructions et l'image
        const filteredMeasurements = this.measurementsData.map((measure) => {
          const { instructions, imageSrc, ...rest } = measure
          return rest // Retourne les données sans instructions ni imageSrc
        })

        // Créer l'objet à soumettre avec les détails de la pièce et les mesures filtrées
        const dataToSubmit = {
          pieceName: this.pieceName, // Ajouter le nom de la pièce
          pieceReference: this.pieceReference, // Ajouter la référence de la pièce
          measurements: filteredMeasurements // Ajouter les mesures avec noms des pièces et valeurs
        }

        // Requête POST pour soumettre les données au backend
        const response = await axios.post(
          'http://localhost:3000/api/submit-measurements',
          dataToSubmit
        )

        // Message de succès si les mesures ont été soumises correctement
        console.log('Mesures soumises avec succès :', response.data)
        // Si soumission réussie, on affiche le message de succès
        this.successMessage = 'Mesures soumises avec succès !'
        this.resetMeasurements() // Réinitialiser les inputs après succès
      } catch (error) {
        // Gérer les erreurs en cas de problème avec la soumission
        console.error('Erreur lors de la soumission des mesures :', error)
        alert('Erreur lors de la soumission des mesures.')
      }
    }
  }
}
</script>

<style scoped>
/* ====================== Header ====================== */
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

/* ====================== Informations de la pièce ====================== */
.piece-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.piece-info h2 {
  font-size: 1.6em;
  color: #ffffff;
  margin: 0;
}

.piece-info p {
  font-size: 1.2em;
  color: #ffffff;
  margin: 0;
}

li {
  font-size: 18px;
  list-style-type: circle;
}

/* ====================== Section des consignes et de l'image ====================== */
.instructions-section {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  border: 1px solid #7a7a7a;
  padding: 20px;
  border-radius: 5px;
}

.instructions {
  flex: 1;
}

.instructions ul {
  list-style-type: disc;
  padding-left: 20px;
}

.image-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%; /* Image prend 50% de la largeur */
}

.image-section img {
  max-width: 100%;
  height: auto;
  border-radius: 5px;
}

/* ====================== Section des cotes de mesure ====================== */
.measurement-section {
  margin-top: 30px;
  border: 1px solid #7a7a7a;
  padding: 20px;
  border-radius: 5px;
}

.measurement-inputs {
  display: flex;
  flex-wrap: wrap;
  gap: 35px;
  margin-top: 20px;
}

.measurement-input {
  display: flex;
  flex-direction: column;
}

.measurement-input input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #7a7a7a;
  border-radius: 5px;
  width: 160px;
  background-color: white; /* Par défaut, blanc si aucune valeur n'est entrée */
}

/* Style pour les champs valides et invalides */
input.valid {
  border-color: #28a745;
  background-color: #d4edda;
}

input.invalid {
  border-color: #dc3545;
  background-color: #f8d7da;
}

/* ====================== Boutons de navigation ====================== */
.navigation-buttons {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
}

/* ====================== Boutons de soumission ====================== */
.submit {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 30px;
}

button {
  padding: 12px 24px;
  background-color: #003b71;
  color: white;
  cursor: pointer;
  border: none;
  font-size: 16px;
  border-radius: 5px;
}

button:hover {
  background-color: #00284d;
}
.success-message {
  color: green;
  font-weight: bold;
  margin-left: 10px;
}

/* ====================== Styles pour les titres h2 et h3 ====================== */
h2 {
  font-size: 28px;
  color: #003b71;
  font-weight: bold;
  margin-bottom: 10px;
  text-transform: uppercase;
  padding-bottom: 5px;
}

h3 {
  font-size: 20px;
  color: #e1251b;
  font-weight: bold;
  margin-bottom: 8px;
  text-transform: uppercase;
  padding-bottom: 4px;
}

/* ====================== Espacement des labels ====================== */
label {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #003b71;
}
</style>
