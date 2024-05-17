import { createRouter, createWebHistory } from 'vue-router'
import VueRouter from 'vue-router';
import HomeView from '../views/HomeView.vue'

import Login from '../components/Login.vue';
import Signin from '../components/Signin.vue';
import test from '../components/test.vue';
import WhatsappHome from '@/components/WhatsappHome.vue';


const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/Signin',
    name: 'signin',
    component: Signin
  },
  {
    path:'/whatsappHome',
    name: 'whatsappHome',
    component: WhatsappHome
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router