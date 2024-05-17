<template>
    <div class="signup">
      <h2>Sign Up</h2>
      <form @submit.prevent="register">
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
        <button type="submit" @click="">Sign Up</button>
      </form>
    </div>
    <button @click="GOOGLE()">Sign in Using Google</button>
  </template>
  
  <script>
  import '@/firebase/config.js'
  import {setUser,getUser} from './UserState'
  import { signInGoogle ,projectFirestore} from '@/firebase/config.js';
  import {auth} from '../firebase/config.js'

export default {
    data() {
      return {
        user:null,
        username: '',
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
      GOOGLE(){
        signInGoogle();
      },
      async register() {
      try {
        const userCredential = await auth.createUserWithEmailAndPassword(this.email, this.password);
        this.user = userCredential.user;
        console.log(`User ID: ${this.user.uid}`);
        this.$router.push('/login');

        const user_to_add = {
          id: this.user.uid,
          lastSignInTime: this.user.metadata.lastSignInTime,
          creationTime: this.user.metadata.creationTime,
          email: this.user.email,
          location: "",
          user_name: this.username,
          photo_url: "",
          chats_binome: [""],
          chats_group: [""],
        };

        // Use the UID as the document ID
        const docRef = await projectFirestore.collection('users').doc(this.user.uid).set(user_to_add);
        console.log("User added successfully with ID: ", this.user.uid);
      } catch (error) {
        console.error("Error creating user:", error);
      }
    },
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
  