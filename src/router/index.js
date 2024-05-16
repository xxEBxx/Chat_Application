import { createRouter, createWebHistory } from 'vue-router'
import VueRouter from 'vue-router';
import HomeView from '../views/HomeView.vue'

import Login from '../components/Login.vue';
import Signin from '../components/Signin.vue';
import test from '../components/test.vue';


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
  {path:'/test_login',
  name:'test',
  component : test
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
