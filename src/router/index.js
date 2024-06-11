import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import Login from '../components/Login.vue';
import signout from '../components/signout.vue';
import Signin from '../components/Signin.vue';
import WhatsappHome from '@/components/WhatsappHome.vue';
import CreateChat from '@/components/CreateChat.vue';
import ProfileOther from '@/views/ProfileOther.vue'
import notification from '../components/notification.vue';
import AdminControls from '@/components/AdminControls.vue';
import CreateGroupChat from '@/components/CreateGroupChat.vue';
import PublicShow from '@/components/PublicShow.vue';
import Welcome from '@/components/welcome.vue';


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
    path: '/notification/:userId',
    name: 'notificationut',
    component: notification,
    props:true
  },
  {
    path:'/profile_other/:id',
    name:'ProfileOther',
    component:ProfileOther,
    props:true
  },
  {
    path: '/admin/:chatId',
    name: 'AdminControls',
    component: AdminControls,
    props: true
  },
  {
    path: '/create-group-chat',
    name: 'CreateGroupChat',
    component: CreateGroupChat,
 
  },{
  path: '/public-groups',
  name: 'PublicShow',
  component: PublicShow,
},
{
  path: '/welcoming',
  name: 'Welcome',
  component: Welcome,
},

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router