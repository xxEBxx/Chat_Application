<template>
  <div>
    <nav class="navbar professional">
      <p @click="make_login" :class="{ 'active': login }">Login</p>
      <p @click="make_signup" :class="{ 'active': !login }">Sign Up</p>
    </nav>
    <Login v-if="login"/>
    <Signin v-else/>
  </div>
</template>

<script>
import Login from '@/components/Login.vue';
import Signin from '@/components/Signin.vue';


export default {
  name: 'HomeView',
  components: {
    Login,
    Signin
  },
  data(){
    return{
      login: true
    }
  },
  methods:{
    make_login(){
      this.login = true;
    },
    make_signup(){
      this.login = false;
    }
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #333; /* Dark background color */
  padding: 10px;
}

.navbar p {
  color: #fff; /* White text color */
  margin: 0 20px;
  cursor: pointer;
  font-family: 'Arial', sans-serif;
  font-size: 18px;
  transition: all 0.3s ease-in-out;
}

.navbar p:hover {
  opacity: 0.8;
}

.active {
  font-weight: bold;
}

.professional p:first-child {
  margin-left: 0;
}

.professional p:last-child {
  margin-right: 0;
}

/* Additional styles for responsiveness */
@media screen and (max-width: 600px) {
  .navbar p {
    margin: 0 10px;
  }
}
</style>
