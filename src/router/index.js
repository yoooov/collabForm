// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FormSecurity from '../views/FormSecurity.vue'
import FormMachineBreakdown from '../views/FormMachineBreakdown.vue'
import FormMesure from '@/views/FormMesure.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/form-security',
    name: 'FormSecurity',
    component: FormSecurity
  },
  {
    path: '/form-machine-breakdown',
    name: 'FormMachineBreakdown',
    component: FormMachineBreakdown
  },
  {
    path: '/form-mesure',
    name: 'FormMesure',
    component: FormMesure
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
