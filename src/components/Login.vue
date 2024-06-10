<template>
    <div class="login">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="username">E-mail</label>
          <input type="text" id="username" v-model="email" required>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <button type="submit" @click="">Login</button>
      </form>
    </div>
  </template>
  
  <script>
    import {auth,projectFirestore} from '@/firebase/config.js'
    import { getUser,setUser } from './UserState';

  export default {
    data() {
      return {
        email: '',
        password: ''
      };
    },
    methods: {
      created() {
        auth.onAuthStateChanged((user) => {
          if (user) {
            setUser(user);
            console.log(`User ID: ${user.uid}`);
          } else {
            setUser(null);
            console.log("User is signed out");
          }
        })
},
async login() {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(this.email, this.password);
        this.user = userCredential.user;
        console.log(`User ID: ${this.user.uid}`);
        setUser(this.user);
        
        await projectFirestore.collection('users').doc(this.user.uid).update({
            connected: true
        });

        this.$router.push('/whatsappHome'); 
    } catch (error) {
        alert(`Login failed: ${error.message}`);
    }
}


    }
  }
  </script>
  
  <style scoped>
  .login {
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
  input[type="password"] {
    width: 100%;
    padding: 5px;
    font-size: 16px;
  }
  
  button {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  