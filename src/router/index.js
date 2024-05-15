import { createRouter, createWebHistory } from 'vue-router'
import VueRouter from 'vue-router';
import HomeView from '../views/HomeView.vue'

import Login from '../components/Login.vue';
import Signin from '../components/Signin.vue';

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
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
