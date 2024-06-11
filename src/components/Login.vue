<template>
  <div class="login max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold mb-4">Login</h2>
    <form @submit.prevent="login">
      <div class="form-group mb-4">
        <label for="username" class="block text-gray-700 font-bold mb-2">E-mail</label>
        <input type="text" id="username" v-model="email" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div class="form-group mb-6">
        <label for="password" class="block text-gray-700 font-bold mb-2">Password</label>
        <input type="password" id="password" v-model="password" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <button type="submit" class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Login</button>
    </form>
  </div>
</template>

<script>
import { auth, projectFirestore } from '@/firebase/config.js';
import { getUser, setUser } from './UserState';

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
      });
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
};
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
  