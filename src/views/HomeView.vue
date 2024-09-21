<template>
  <div class="container">
    <div class="left-pane">
      <img src="../assets/logo_no_bg.jpg" alt="Chatting Illustration">
    </div>
    <div class="right-pane">
      <div class="button-group">
        <button @click="make_login" :class="{ 'active': login }">Login</button>
        <button @click="make_signup" :class="{ 'active': !login }">Sign Up</button>
      </div>
      <div class="form-container">
        <Login v-if="login"/>
        <Signin v-else/>
      </div>
    </div>
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
  data() {
    return {
      login: true
    }
  },
  methods: {
    make_login() {
      this.login = true;
    },
    make_signup() {
      this.login = false;
    }
  }
}
</script>

<style scoped>
.container {
 
  display: flex;
  width:100%;
  height: 100vh;
  background-color: #f4f4f4;
}

.left-pane {
  flex: 1;
  background-color: #f4f4f4;
}

.left-pane img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.right-pane {
  flex: 1;
  position:relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  padding: 20px; /* Add some padding */
  box-sizing: border-box; /* Ensure padding is included in width calculation */
}

.button-group {
  display: flex;
  margin-bottom: 20px;
  position: absolute;
  top: 30px;
}

.button-group button {
  margin: 0 10px;
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  background-color: #007bff; /* Updated background color */
  color: #fff;
  border: none;
  border-radius: 50px; /* Rounded corners */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow */
}

.button-group button.active {
  background-color: #0056b3; /* Slightly darker shade */
  font-weight: bold;
}

.button-group button:hover {
  background-color: #0056b3; /* Matching active background on hover */
  transform: scale(1.05); /* Slightly larger on hover */
  opacity: 0.9;
}

.form-container {
  width: 100%;

  margin-right:0; /* Center the form container */
}

@media screen and (max-width: 600px) {
  .container {
    flex-direction: column;
  }

  .left-pane, .right-pane {
    flex: none;
    width: 100%;
    height: 50vh;
  }

  .form-container {
    width: 100%;
    padding: 0 10px;
  }

  .button-group {
    flex-direction: column;
  }

  .button-group button {
    margin: 5px 0;
    width: 100%;
}
}
</style>
