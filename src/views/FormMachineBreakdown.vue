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
            <input type="text" id="numero" v-model="formDataMachineBreakdown.numero" readonly />
          </div>
          <!-- Description du problème -->
          <div class="form-description">
            <label class="bold" for="description">Description :</label>
            <textarea
              id="description"
              v-model="formDataMachineBreakdown.description"
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
                  <input type="date" id="date" v-model="formDataMachineBreakdown.date" />
                </div>
                <div>
                  <label class="bold" for="time">Heure :</label>
                  <input type="time" id="time" v-model="formDataMachineBreakdown.time" />
                </div>
              </div>
              <!-- Combien -->
              <div class="space">
                <label class="combien bold" for="combien">Combien ? :</label>
                <input type="text" id="combien" v-model="formDataMachineBreakdown.combien" />
              </div>
              <!-- Nom de la personne qui rapporte le problème -->
              <div class="space">
                <label class="bold" for="name">Nom :</label>
                <input type="text" id="name" v-model="formDataMachineBreakdown.name" />
              </div>
              <!-- Lieu de l'incident -->
              <div class="space">
                <label class="bold" for="location">Où :</label>
                <input type="text" id="location" v-model="formDataMachineBreakdown.location" />
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
                  v-model="formDataMachineBreakdown.alertContacts"
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
                    v-model="formDataMachineBreakdown.similarIssues[0]"
                  />
                  <label for="similarYes">Oui</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="similarNo"
                    value="no"
                    v-model="formDataMachineBreakdown.similarIssues[0]"
                  />
                  <label for="similarNo">Non</label>
                </div>
                <!-- Afficher le numéro de l'élément similaire sélectionné -->
                <p v-if="formDataMachineBreakdown.similarIssues[0] === 'yes'">
                  Numéro de l'élément sélectionné : {{ formDataMachineBreakdown.similarIssues[1] }}
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
                    v-model="formDataMachineBreakdown.securisation"
                    @change="handleSecuringChange('yes')"
                  />
                  <label for="securisationYes">Oui</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="securisationNo"
                    value="no"
                    v-model="formDataMachineBreakdown.securisation"
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
            v-for="(action, index) in formDataMachineBreakdown.immediateActions"
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
          <button type="submit">Soumettre QRAP Panne Machine</button>
        </div>
      </form>
    </div>

    <!-- Section de l'historique des 7 derniers jours -->
    <div class="history">
      <h2>Historique des 7 derniers jours :</h2>
      <ul>
        <!-- Liste des entrées de l'historique -->
        <li
          v-for="(entry, index) in last7DaysDataMachineBreakdown"
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
import axios from 'axios'
import HeaderComponent from '@/components/HeaderComponent.vue'

export default {
  components: {
    HeaderComponent
  },
  data() {
    return {
      formDataMachineBreakdown: {
        numero: 0,
        description: '',
        photos: [null, null], // Photos stockées sous forme de dataURL
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
      },
      contacts: [
        { id: 1, name: 'Team Leader', email: 'teamleader@example.com' },
        { id: 2, name: 'Superviseur', email: 'superviseur@example.com' },
        { id: 3, name: 'Maintenance', email: 'maintenance@example.com' },
        { id: 4, name: 'Qualité', email: 'qualite4@example.com' },
        { id: 5, name: 'UAP Mgr', email: 'uapmgr@example.com' },
        { id: 6, name: 'Site/Prod Mgr', email: 'siteprodmgr@example.com' },
        { id: 7, name: 'Logistique', email: 'logistique@example.com' }
      ],
      sortingData: {
        piecesOk: 0,
        piecesNok: 0
      },
      last7DaysDataMachineBreakdown: [],
      newAction: {
        action: '',
        name: '',
        time: ''
      },
      canvasContext: [null, null],
      isDrawing: [false, false]
    }
  },
  mounted() {
    this.loadJsonData()
    this.setCurrentDateTime()
    this.initializeDrawings()
  },
  methods: {
    dataURLToBlob(dataURL) {
      const [header, base64] = dataURL.split(',')
      const byteString = atob(base64)
      const mimeString = header.split(':')[1].split(';')[0]
      const arrayBuffer = new ArrayBuffer(byteString.length)
      const uintArray = new Uint8Array(arrayBuffer)
      for (let i = 0; i < byteString.length; i++) {
        uintArray[i] = byteString.charCodeAt(i)
      }
      return new Blob([uintArray], { type: mimeString })
    },

    async loadJsonData() {
      try {
        const { data } = await axios.get('http://localhost:3000/api/machine-breakdown-history')
        this.last7DaysDataMachineBreakdown = data
        this.formDataMachineBreakdown.numero = this.last7DaysDataMachineBreakdown.length + 1
      } catch (error) {
        console.error('Erreur lors du chargement des données :', error)
      }
    },

    async submitForm() {
      try {
        this.formDataMachineBreakdown.submissionTime = this.getCurrentTime()

        const formData = new FormData()

        const processCanvas = async (index) => {
          const canvas = this.$refs[`drawingCanvas${index + 1}`]
          const ctx = canvas.getContext('2d')

          if (this.formDataMachineBreakdown.photos[index]) {
            const image = new Image()
            image.src = this.formDataMachineBreakdown.photos[index]

            await new Promise((resolve) => {
              image.onload = () => {
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
                resolve()
              }
            })

            const combinedImageData = canvas.toDataURL()
            const photoBlob = this.dataURLToBlob(combinedImageData)
            formData.append('photos', photoBlob, `photo${index + 1}.png`)
          }
        }

        await processCanvas(0)
        await processCanvas(1)

        formData.append('formDataMachineBreakdown', JSON.stringify(this.formDataMachineBreakdown))
        formData.append('sortingData', JSON.stringify(this.sortingData))

        const { data } = await axios.post(
          'http://localhost:3000/api/machine-breakdown-submit',
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
        )

        this.last7DaysDataMachineBreakdown.push(data)
        this.resetFormData()
        this.resetCanvas()
      } catch (error) {
        console.error('Erreur lors de la soumission :', error)
      }
    },

    resetFormData() {
      this.formDataMachineBreakdown = {
        numero: this.last7DaysDataMachineBreakdown.length + 1,
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
      this.sortingData = { piecesOk: 0, piecesNok: 0 }
      this.setCurrentDateTime()
    },

    resetCanvas() {
      ;[0, 1].forEach((index) => this.clearPhoto(index))
      this.initializeDrawings()
    },

    initializeDrawings() {
      this.$nextTick(() => {
        ;[0, 1].forEach((index) => this.setupCanvas(this.$refs[`drawingCanvas${index + 1}`], index))
      })
    },

    setupCanvas(canvas, index) {
      const ctx = canvas.getContext('2d')
      this.canvasContext[index] = ctx
      this.enableDrawing(canvas, ctx, index)
    },

    enableDrawing(canvas, ctx, index) {
      let isDrawing = false

      const getAdjustedCoordinates = (event) => {
        const { left, top } = canvas.getBoundingClientRect()
        return { x: event.clientX - left, y: event.clientY - top }
      }

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
        isDrawing = false
        this.saveDrawing(index)
      })

      canvas.addEventListener('mouseleave', () => (isDrawing = false))
    },

    saveDrawing(index) {
      const canvas = this.$refs[`drawingCanvas${index + 1}`]
      this.formDataMachineBreakdown.photos[index] = canvas.toDataURL()
    },

    clearPhoto(index) {
      const canvas = this.$refs[`drawingCanvas${index + 1}`]
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      this.formDataMachineBreakdown.photos[index] = null
      this.$refs[`photoInput${index + 1}`].value = null
    },

    handleSecuringChange(value) {
      this.formDataMachineBreakdown.securisation = value
      const contactEmail = this.contacts[3].email
      if (value === 'yes' && !this.formDataMachineBreakdown.alertContacts.includes(contactEmail)) {
        this.formDataMachineBreakdown.alertContacts.push(contactEmail)
      } else {
        this.formDataMachineBreakdown.alertContacts =
          this.formDataMachineBreakdown.alertContacts.filter((email) => email !== contactEmail)
      }
    },

    handlePhotoUpload(event, index) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.formDataMachineBreakdown.photos[index] = e.target.result
          this.loadPhotoToCanvas(e.target.result, index)
        }
        reader.readAsDataURL(file)
      }
    },

    loadPhotoToCanvas(photoSrc, index) {
      const canvas = this.$refs[`drawingCanvas${index + 1}`]
      const ctx = canvas.getContext('2d')
      const image = new Image()
      image.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
        this.enableDrawing(canvas, ctx, index)
      }
      image.src = photoSrc
    },

    setCurrentDateTime() {
      const now = new Date()
      this.formDataMachineBreakdown.date = now.toISOString().split('T')[0]
      this.formDataMachineBreakdown.time = now.toTimeString().split(' ')[0].slice(0, 5)
    },

    getCurrentTime() {
      return new Date().toTimeString().split(' ')[0].slice(0, 5)
    },

    addAction() {
      const { action, name, time } = this.newAction
      if (action && name && time) {
        this.formDataMachineBreakdown.immediateActions.push({ ...this.newAction })
        this.newAction = { action: '', name: '', time: '' }
      }
    },

    removeAction(index) {
      this.formDataMachineBreakdown.immediateActions.splice(index, 1)
    },

    selectHistoryItem(index) {
      const item = this.last7DaysDataMachineBreakdown[index]
      this.formDataMachineBreakdown.similarIssues = ['yes', item.numero]
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
