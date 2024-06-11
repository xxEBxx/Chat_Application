import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import Login from '../components/Login.vue';
import signout from '../components/signout.vue';
import Signin from '../components/Signin.vue';
import WhatsappHome from '@/components/WhatsappHome.vue';
import CreateChat from '@/components/CreateChat.vue';
import ProfileOther from '@/views/ProfileOther.vue'
import notification from '../components/notification.vue';

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
  ,{
    path:'/create-chat',
    name: 'CreateChat',
    component: CreateChat
  },
  {
    path: '/signout',
    name: 'signout',
    component: signout
  },
  {
    path: '/notification/:id',
    name: 'notificationut',
    component: notification
  },
  {
    path:'/profile_other/:id',
    name:'ProfileOther',
    component:ProfileOther,
    props:true
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router