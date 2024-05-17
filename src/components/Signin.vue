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
  import {signInWithEmailAndPassword} from 'firebase/auth'
  import { projectFirestore } from '../firebase/config.js'
  import {ref} from 'vue'
  import {getUser} from './UserState'
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
      signup() {
        alert(`Username: ${this.username}, Email: ${this.email}, Password: ${this.password}`);

      },
      async register(){
        await auth.createUserWithEmailAndPassword(email.value,password.value).then(
          this.$router.push('/login')
        )
        
        this.user=getUser();
        const user_to_add= {
                                id:this.user.uid,
                                lastSignInTime: this.user.metadata.lastSignInTime,
                                creationTime: this.user.metadata.creationTime,
                                email: this.user.email,
                                location:"",
                                user_name:this.username,
                                photo_url:"",
                                chats_binome:[""],
                                chats_group:[""],
                           }
        try {
        // Add the post data to Firestore (replace 'articles' with your collection name)
        const docRef = await projectFirestore.collection('users').add(user_to_add);
        console.log("user added successfully with ID: ", docRef.id);

       
      } catch (error) {
        console.error("Error adding user to Firestore: ", error);
        // Handle error here, show error message to the user, etc.
      }
        
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
  