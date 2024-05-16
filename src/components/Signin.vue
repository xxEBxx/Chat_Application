<template>
    <div class="signup">
      <h2>Sign Up</h2>
      <form @submit.prevent="signup">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" v-model="username" required>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <button type="submit" @click="register()">Sign Up</button>
      </form>
    </div>
  </template>
  
  <script>
  import {auth} from '@/firebase/config.js'
  import {createUserWithEmailAndPassword} from 'firebase/auth'
  import {ref} from 'vue'
export default {
    data() {
      return {
        username: '',
        email: '',
        password: ''
      };
    },
    methods: {
      signup() {
        alert(`Username: ${this.username}, Email: ${this.email}, Password: ${this.password}`);
      },
      async register(){
        await auth.createUserWithEmailAndPassword(email.value,password.value).then(
          this.$router.push('/login')
        )
        
      }
    }
  };
  </script>
  
  <style scoped>
  .signup {
    max-width: 300px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .form-group {
    margin-bottom: 10px;
  }
  
  label {
    display: block;
  }
  
  input[type="text"],
  input[type="email"],
  input[type="password"] {
    width: 100%;
    padding: 5px;
    font-size: 16px;
  }
  
  button {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #28a745;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #218838;
  }
  </style>
  