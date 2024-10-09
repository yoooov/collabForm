<template>
  <!-- En-tête du formulaire -->
  <HeaderComponent />

  <!-- Contenu principal du formulaire -->
  <div class="form-content container">
    <!-- Section du formulaire -->
    <div class="form">
      <form @submit.prevent="submitForm">
        <!-- En-tête du formulaire avec le numéro et la description -->
        <div class="form-header">
          <!-- Numéro du formulaire -->
          <div class="form-number">
            <label class="bold" for="numero">Numéro :</label>
            <input type="text" id="numero" v-model="formDataMachineBreakDown.numero" readonly />
          </div>
          <!-- Description du problème -->
          <div class="form-description">
            <label class="bold" for="description">Description :</label>
            <textarea
              id="description"
              v-model="formDataMachineBreakDown.description"
              rows="4"
              placeholder="QUEL est le problème et Comment a-t-il été détecté?"
            ></textarea>
          </div>
        </div>

        <!-- Bloc QQOQCCP (Qui, Quoi, Où, Quand, Comment, Combien, Pourquoi) -->
        <div class="bloc-QQOQCCP">
          <div>
            <!-- Bloc de gauche avec les informations principales -->
            <div class="bloc-left">
              <!-- Date et heure de l'incident -->
              <div class="date">
                <div>
                  <label class="bold" for="date">Date :</label>
                  <input type="date" id="date" v-model="formDataMachineBreakDown.date" />
                </div>
                <div>
                  <label class="bold" for="time">Heure :</label>
                  <input type="time" id="time" v-model="formDataMachineBreakDown.time" />
                </div>
              </div>
              <!-- Combien -->
              <div class="space">
                <label class="combien bold" for="combien">Combien ? :</label>
                <input type="text" id="combien" v-model="formDataMachineBreakDown.combien" />
              </div>
              <!-- Nom de la personne qui rapporte le problème -->
              <div class="space">
                <label class="bold" for="name">Nom :</label>
                <input type="text" id="name" v-model="formDataMachineBreakDown.name" />
              </div>
              <!-- Lieu de l'incident -->
              <div class="space">
                <label class="bold" for="location">Où :</label>
                <input type="text" id="location" v-model="formDataMachineBreakDown.location" />
              </div>
            </div>
            <!-- Bloc central pour les contacts alertés -->
            <div class="alert-contacts bloc-center">
              <label class="bold">Qui a été alerté ? :</label>
              <!-- Liste des contacts sous forme de cases à cocher -->
              <div v-for="contact in contacts" :key="contact.id">
                <input
                  type="checkbox"
                  :id="'contact-' + contact.id"
                  :value="contact.email"
                  v-model="formDataMachineBreakDown.alertContacts"
                />
                <label :for="'contact-' + contact.id">{{ contact.name }}</label>
              </div>
            </div>
            <!-- Bloc de droite pour les options supplémentaires -->
            <div class="bloc-right">
              <!-- Option pour indiquer un problème similaire -->
              <div class="similar-issue">
                <label class="bold">Problème similaire lors des 7 derniers jours :</label>
                <div>
                  <input
                    type="radio"
                    id="similarYes"
                    value="yes"
                    v-model="formDataMachineBreakDown.similarIssues[0]"
                  />
                  <label for="similarYes">Oui</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="similarNo"
                    value="no"
                    v-model="formDataMachineBreakDown.similarIssues[0]"
                  />
                  <label for="similarNo">Non</label>
                </div>
                <!-- Afficher le numéro de l'élément similaire sélectionné -->
                <p v-if="formDataMachineBreakDown.similarIssues[0] === 'yes'">
                  Numéro de l'élément sélectionné : {{ formDataMachineBreakDown.similarIssues[1] }}
                </p>
              </div>

              <!-- Option pour indiquer si une sécurisation est nécessaire -->
              <div class="securisation">
                <label class="bold">Sécurisation :</label>
                <p>Y a-t-il un risque sur les pièces déjà produites ?</p>
                <div>
                  <input
                    type="radio"
                    id="securisationYes"
                    value="yes"
                    v-model="formDataMachineBreakDown.securisation"
                    @change="handleSecuringChange('yes')"
                  />
                  <label for="securisationYes">Oui</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="securisationNo"
                    value="no"
                    v-model="formDataMachineBreakDown.securisation"
                    @change="handleSecuringChange('no')"
                  />
                  <label for="securisationNo">Non</label>
                </div>
              </div>
            </div>
          </div>
          <!-- Données de tri (pièces OK/NOK) -->
          <div class="sorting-data">
            <h3>Données de tri</h3>
            <div>
              <label for="piecesOk">Pièces OK :</label>
              <input type="number" id="piecesOk" v-model="sortingData.piecesOk" />
            </div>

            <div>
              <label for="piecesNok">Pièces NOK :</label>
              <input type="number" id="piecesNok" v-model="sortingData.piecesNok" />
            </div>
          </div>
        </div>

        <!-- Bloc pour ajouter des photos et dessiner dessus -->
        <div class="photo-and-drawing">
          <!-- Photo et dessin 1 -->
          <div class="photo-upload">
            <label class="bold" for="photo1">Ajouter une photo 1</label>
            <input type="file" ref="photoInput1" @change="handlePhotoUpload($event, 0)" />
            <canvas class="picture" ref="drawingCanvas1" width="400" height="300"></canvas>
            <button type="button" @click="clearPhoto(0)">Effacer</button>
          </div>

          <!-- Photo et dessin 2 -->
          <div class="photo-upload">
            <label class="bold" for="photo2">Ajouter une photo 2</label>
            <input type="file" ref="photoInput2" @change="handlePhotoUpload($event, 1)" />
            <canvas class="picture" ref="drawingCanvas2" width="400" height="300"></canvas>
            <button type="button" @click="clearPhoto(1)">Effacer</button>
          </div>
        </div>
        <!-- Bloc des actions immédiates -->
        <div class="immediate-actions">
          <h3>Actions immédiates</h3>
          <!-- Formulaire pour ajouter une nouvelle action -->
          <div class="new-action">
            <textarea v-model="newAction.action" placeholder="Action réalisée"></textarea>
            <div class="action-inputs">
              <input v-model="newAction.name" type="text" placeholder="Nom de la personne" />
              <input v-model="newAction.time" type="time" />
              <button type="button" @click="addAction">Ajouter action</button>
            </div>
          </div>
          <!-- Liste des actions immédiates ajoutées -->
          <div
            v-for="(action, index) in formDataMachineBreakDown.immediateActions"
            :key="index"
            class="action-item"
          >
            <textarea v-model="action.action" placeholder="Action réalisée"></textarea>
            <div class="action-inputs">
              <input v-model="action.name" type="text" placeholder="Nom de la personne" />
              <input v-model="action.time" type="time" />
              <button type="button" @click="removeAction(index)">Supprimer</button>
            </div>
          </div>
        </div>
        <!-- Bouton de soumission du formulaire -->
        <div class="submit">
          <button type="submit">Soumettre QRAP Sécurité</button>
        </div>
      </form>
    </div>

    <!-- Section de l'historique des 7 derniers jours -->
    <div class="history">
      <h2>Historique des 7 derniers jours :</h2>
      <ul>
        <!-- Liste des entrées de l'historique -->
        <li
          v-for="(entry, index) in last7DaysDataMachineBreakDown"
          :key="index"
          @click="selectHistoryItem(index)"
        >
          <span class="entry-description">{{ entry.description }}</span> (Numéro:
          {{ entry.numero }})
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import HeaderComponent from '@/components/HeaderComponent.vue'
export default {
  components: {
    HeaderComponent
  },
  data() {
    return {
      // Données du formulaire de sécurité
      formDataMachineBreakDown: {
        numero: 0, // Numéro du formulaire
        description: '', // Description du problème
        photos: [null, null], // Photos ajoutées au formulaire
        date: '', // Date de l'incident
        time: '', // Heure de l'incident
        similarIssues: ['no', null], // Problèmes similaires (oui/non et numéro)
        combien: '', // Quantité affectée
        name: '', // Nom de la personne qui remplit le formulaire
        location: '', // Lieu de l'incident
        alertContacts: [], // Contacts alertés
        securisation: 'no', // Indique si une sécurisation est nécessaire
        immediateActions: [], // Actions immédiates prises
        submissionTime: '' // Heure de soumission du formulaire
      },
      // Liste des contacts disponibles pour être alertés
      contacts: [
        { id: 1, name: 'Team Leader', email: 'teamleader@example.com' },
        { id: 2, name: 'Superviseur', email: 'superviseur@example.com' },
        { id: 3, name: 'Maintenance', email: 'maintenance@example.com' },
        { id: 4, name: 'Qualité', email: 'qualite4@example.com' },
        { id: 5, name: 'UAP Mgr', email: 'uapmgr@example.com' },
        { id: 6, name: 'Site/Prod Mgr', email: 'siteprodmgr@example.com' },
        { id: 7, name: 'Logistique', email: 'logistique@example.com' }
      ],
      // Données de tri (pièces OK et NOK)
      sortingData: {
        piecesOk: 0, // Nombre de pièces conformes
        piecesNok: 0 // Nombre de pièces non conformes
      },
      // Historique des 7 derniers jours
      last7DaysDataMachineBreakDown: [],
      // Nouvelle action immédiate en cours de saisie
      newAction: {
        action: '', // Description de l'action
        name: '', // Nom de la personne qui a effectué l'action
        time: '' // Heure de l'action
      },
      // Contexte des canevas pour le dessin sur les photos
      canvasContext: [null, null],
      // Statut du dessin pour chaque canevas
      isDrawing: [false, false]
    }
  },
  mounted() {
    // Chargement des données depuis le localStorage lors du montage du composant
    this.loadJsonData()
    // Mise à jour du numéro du formulaire en fonction des données chargées
    this.formDataMachineBreakDown.numero = this.last7DaysDataMachineBreakDown.length + 1
    // Initialisation de la date et de l'heure actuelles
    this.setCurrentDateTime()
    // Initialisation des canevas pour le dessin
    this.initializeDrawings()
  },
  methods: {
    // Chargement des données depuis le localStorage
    loadJsonData() {
      const storedMachineBreakDown = localStorage.getItem('formDataMachineBreakDownKey')
      if (storedMachineBreakDown) {
        this.last7DaysDataMachineBreakDown = JSON.parse(storedMachineBreakDown)
      } else {
        this.last7DaysDataMachineBreakDown = [] // Initialiser comme un tableau vide si aucune donnée
      }
    },

    // Soumission du formulaire
    submitForm() {
      this.loadJsonData() // Recharger les données pour obtenir les dernières mises à jour
      const submissionTime = this.getCurrentTime() // Obtenir l'heure actuelle
      this.formDataMachineBreakDown.submissionTime = submissionTime
      // Mettre à jour le numéro du formulaire
      this.formDataMachineBreakDown.numero = this.last7DaysDataMachineBreakDown.length + 1
      // Ajouter les données du formulaire à l'historique
      this.last7DaysDataMachineBreakDown.push({
        ...this.formDataMachineBreakDown,
        sortingData: this.sortingData
      })
      // Sauvegarder les données dans le localStorage
      this.saveJsonData()
      // Réinitialiser le formulaire pour une nouvelle saisie
      this.resetFormData()
      // Réinitialiser les canevas après soumission
      this.resetCanvas()
    },

    // Réinitialisation des données du formulaire après soumission
    resetFormData() {
      this.formDataMachineBreakDown = {
        numero: this.last7DaysDataMachineBreakDown.length + 1, // Mettre à jour le numéro
        description: '',
        photos: [null, null],
        date: '',
        time: '',
        similarIssues: ['no', null],
        combien: '',
        name: '',
        location: '',
        alertContacts: [],
        securisation: 'no',
        immediateActions: [],
        submissionTime: ''
      }
      // Réinitialiser les données de tri
      this.sortingData = {
        piecesOk: 0,
        piecesNok: 0
      }
      // Mettre à jour la date et l'heure actuelles
      this.setCurrentDateTime()
      // Effacer les dessins sur les canevas (optionnel si resetCanvas() est appelé)
      // this.clearDrawings()
    },

    // Réinitialiser les canevas après soumission
    resetCanvas() {
      // Effacer les canevas et réinitialiser le dessin
      this.clearPhoto(0)
      this.clearPhoto(1)
      this.initializeDrawings() // Réinitialiser les canevas pour permettre le dessin
    },

    // Initialisation des canevas pour le dessin
    initializeDrawings() {
      this.$nextTick(() => {
        this.setupCanvas(this.$refs.drawingCanvas1, 0)
        this.setupCanvas(this.$refs.drawingCanvas2, 1)
      })
    },

    // Configuration du canevas pour le dessin
    setupCanvas(canvas, index) {
      const ctx = canvas.getContext('2d')
      this.canvasContext[index] = ctx
      this.enableDrawing(canvas, ctx, index)
    },

    // Activation du dessin sur le canevas
    enableDrawing(canvas, ctx, index) {
      let isDrawing = false

      // Fonction pour ajuster les coordonnées du pointeur de la souris
      function getAdjustedCoordinates(event) {
        const rect = canvas.getBoundingClientRect()
        const offsetX = event.clientX - rect.left
        const offsetY = event.clientY - rect.top
        return { x: offsetX, y: offsetY }
      }

      // Événements de souris pour le dessin
      canvas.addEventListener('mousedown', (event) => {
        isDrawing = true
        const { x, y } = getAdjustedCoordinates(event)
        ctx.beginPath()
        ctx.moveTo(x, y)
      })

      canvas.addEventListener('mousemove', (event) => {
        if (isDrawing) {
          const { x, y } = getAdjustedCoordinates(event)
          ctx.lineTo(x, y)
          ctx.stroke()
        }
      })

      canvas.addEventListener('mouseup', () => {
        if (isDrawing) {
          isDrawing = false
          this.saveDrawing(index) // Sauvegarder le dessin actuel
        }
      })

      canvas.addEventListener('mouseleave', () => {
        if (isDrawing) {
          isDrawing = false
          this.saveDrawing(index) // Sauvegarder le dessin si la souris quitte le canevas
        }
      })
    },

    // Sauvegarder le dessin actuel en tant qu'image
    saveDrawing(index) {
      const canvas = index === 0 ? this.$refs.drawingCanvas1 : this.$refs.drawingCanvas2
      const dataURL = canvas.toDataURL() // Convertir le dessin en base64
      this.formDataMachineBreakDown.photos[index] = dataURL // Stocker l'image dans formDataMachineBreakDown.photos
    },

    // Effacer le dessin et la photo du canevas
    clearPhoto(index) {
      const canvas = index === 0 ? this.$refs.drawingCanvas1 : this.$refs.drawingCanvas2
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height) // Effacer le canevas
      this.formDataMachineBreakDown.photos[index] = null // Supprimer la photo dans formDataMachineBreakDown
      const photoInput = index === 0 ? this.$refs.photoInput1 : this.$refs.photoInput2
      if (photoInput) {
        photoInput.value = null // Réinitialiser le champ input file
      }
    },

    // Gestion du changement de l'option de sécurisation
    handleSecuringChange(value) {
      this.formDataMachineBreakDown.securisation = value
      const contactEmail = this.contacts[3].email // 'Qualité' est à l'index 3
      if (value === 'yes') {
        // Ajouter le contact 'Qualité' s'il n'est pas déjà dans la liste
        if (!this.formDataMachineBreakDown.alertContacts.includes(contactEmail)) {
          this.formDataMachineBreakDown.alertContacts.push(contactEmail)
        }
      } else if (value === 'no') {
        // Retirer le contact 'Qualité' de la liste
        this.formDataMachineBreakDown.alertContacts =
          this.formDataMachineBreakDown.alertContacts.filter((email) => email !== contactEmail)
      }
    },

    // Gestion de l'upload des photos
    handlePhotoUpload(event, index) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.formDataMachineBreakDown.photos[index] = e.target.result // Stocker la photo
          this.loadPhotoToCanvas(e.target.result, index) // Charger la photo sur le canevas
        }
        reader.readAsDataURL(file) // Lire le fichier comme URL de données
      }
    },

    // Charger la photo sur le canevas
    loadPhotoToCanvas(photoSrc, index) {
      const canvas = index === 0 ? this.$refs.drawingCanvas1 : this.$refs.drawingCanvas2
      const ctx = canvas.getContext('2d')
      const image = new Image()
      image.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height) // Effacer le canevas
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height) // Dessiner l'image sur le canevas
        this.enableDrawing(canvas, ctx, index) // Activer le dessin sur le canevas
      }
      image.src = photoSrc // Définir la source de l'image
    },

    // Définir la date et l'heure actuelles
    setCurrentDateTime() {
      const now = new Date()
      const formattedDate = now.toISOString().split('T')[0] // Format AAAA-MM-JJ
      const formattedTime = now.toTimeString().split(' ')[0].slice(0, 5) // Format HH:MM
      this.formDataMachineBreakDown.date = formattedDate
      this.formDataMachineBreakDown.time = formattedTime
    },

    // Obtenir l'heure actuelle au format HH:MM
    getCurrentTime() {
      const now = new Date()
      return now.toTimeString().split(' ')[0].slice(0, 5)
    },

    // Ajouter une action immédiate
    addAction() {
      if (this.newAction.action && this.newAction.name && this.newAction.time) {
        // Ajouter l'action à la liste des actions immédiates
        this.formDataMachineBreakDown.immediateActions.push({ ...this.newAction })
        // Réinitialiser le formulaire d'ajout d'action
        this.newAction = { action: '', name: '', time: '' }
      }
    },

    // Supprimer une action immédiate de la liste
    removeAction(index) {
      this.formDataMachineBreakDown.immediateActions.splice(index, 1)
    },

    // Sauvegarder les données dans le localStorage
    saveJsonData() {
      localStorage.setItem(
        'formDataMachineBreakDownKey',
        JSON.stringify(this.last7DaysDataMachineBreakDown)
      )
      alert('Données sauvegardées avec succès !') // Alerter l'utilisateur
    },

    // Effacer les dessins sur les canevas
    clearDrawings() {
      this.formDataMachineBreakDown.photos = [null, null]
    },

    // Sélectionner un élément de l'historique pour indiquer un problème similaire
    selectHistoryItem(index) {
      const item = this.last7DaysDataMachineBreakDown[index]
      this.formDataMachineBreakDown.similarIssues = ['yes', item.numero] // Mettre à jour les problèmes similaires
    }
  }
}
</script>

<style scoped>
/* ========== Styles Généraux ========== */

/* Conteneur principal */
.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Typographie générale */

h2 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}

h3 {
  font-weight: bold;
}

.bold {
  font-weight: bold;
}

/* Styles pour les labels et les placeholders */
label {
  margin-bottom: 5px;
}

textarea::placeholder,
input::placeholder {
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
}

/* Styles pour les champs de formulaire */
input[type='text'],
input[type='number'],
input[type='date'],
input[type='time'],
textarea {
  padding: 8px;
  font-size: 16px;
  border: 1px solid #7a7a7a;
  border-radius: 5px;
}

/* Styles pour les boutons radio et les cases à cocher */
input[type='radio'],
input[type='checkbox'] {
  accent-color: #0075a9;
}

/* Styles pour les boutons */
button {
  padding: 10px 20px;
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

/* ========== Contenu du Formulaire ========== */

.form-content {
  display: flex;
  gap: 20px;
}

/* Section du formulaire */
.form {
  flex: 3;
}

/* ========== Header du Formulaire ========== */

.form-header {
  display: flex;
  gap: 20px;
}

.form-number {
  display: flex;
  flex-direction: column;
}

.form-number input {
  width: 91px;
  text-align: center;
  font-size: 32px;
  font-weight: bold;
}

.form-description {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* ========== Bloc QQOQCCP ========== */

.bloc-QQOQCCP {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px;
  border: 1px solid #7a7a7a;
  border-radius: 5px;
  margin-top: 20px;
}

.bloc-QQOQCCP > div:first-child {
  display: flex;
  justify-content: space-between;
  gap: 5px;
}

/* Bloc de gauche */
.bloc-left {
  display: flex;
  flex-direction: column;
}

.space {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bloc-left > div {
  margin-bottom: 5px;
}

/* Date et heure */
.date {
  display: flex;
  gap: 20px;
}

.date > div {
  display: flex;
  align-items: center;
  gap: 5px;
}

/* Bloc central */
.bloc-center {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Bloc de droite */
.bloc-right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.bloc-right > div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

/* Données de tri */
.sorting-data {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sorting-data label {
  margin-right: 5px;
}

/* ========== Bloc Photos et Dessins ========== */

.photo-and-drawing {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  border: 1px solid #7a7a7a;
  padding: 10px;
  border-radius: 5px;
}

.photo-upload {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.photo-upload label {
  display: block;
  text-align: center;
  margin-bottom: 5px;
}

.photo-upload button {
  background-color: #dc3545;
}

.photo-upload button:hover {
  background-color: #b71b2b;
}

.picture {
  border: 1px solid #7a7a7a;
  border-radius: 5px;
}

/* ========== Bloc Actions Immédiates ========== */

.immediate-actions {
  margin-top: 20px;
  border: 1px solid #7a7a7a;
  padding: 10px;
  border-radius: 5px;
}

.immediate-actions h3 {
  margin-bottom: 10px;
}

.new-action,
.action-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.action-inputs {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

/* ========== Soumission du formulaire ========== */
.submit {
  margin: 20px 0;
}

/* ========== Historique ========== */

.history {
  flex: 1;
  max-width: 300px;
  border-left: 1px solid #7a7a7a;
  padding-left: 20px;
}

.history ul {
  list-style-type: none;
  padding: 0;
}

.history li {
  cursor: pointer;
  padding: 5px 0;
  border-bottom: 1px solid #7a7a7a;
}

.history li:hover {
  background-color: #f1f1f1;
}

/* Style spécifique pour la description de l'entrée */
.entry-description {
  font-weight: bold;
}
</style>
