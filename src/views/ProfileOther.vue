<template>
    <div>
      <h1>Profile</h1>
      <div v-if="userData">
        <p>User Name: {{ userData.user_name }}</p>
        <p v-if="userData.connected">Status: Online</p>
        <p v-else>Status: Offline</p>
        <img :src="userData.image" alt="User Profile Picture" />
        <p>Email: {{ userData.email }}</p>
        <p>Location: {{ userData.location }}</p>
      </div>
      <div v-else>
        <p>Loading user data...</p>
      </div>
      <button @click="go_home()">Go Home</button>
    </div>
  </template>
  
  <script>
  import { projectFirestore } from '@/firebase/config.js';
  
  export default {
    props: ['id'],
    data() {
      return {
        userData: null,
        unsubscribe: null // Store unsubscribe function
      };
    },
    async created() {
      // Fetch user data when the component is created
      await this.fetchUserData();
      // Subscribe to real-time updates
      this.subscribeToUserData();
    },
    methods: {
      async fetchUserData() {
        try {
          const userDoc = await projectFirestore.collection('users').doc(this.id).get();
          if (userDoc.exists) {
            this.userData = userDoc.data();
          } else {
            console.error('User document not found');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      },
      subscribeToUserData() {
        this.unsubscribe = projectFirestore.collection('users').doc(this.id)
          .onSnapshot((doc) => {
            if (doc.exists) {
              // Update userData with the new data from the snapshot
              this.userData = doc.data();
            }
          });
      },
      go_home(){
        this.unsubscribe(); // Unsubscribe from real-time updates
        this.$router.push('/whatsappHome');
      }
    },
    beforeUnmount() {
      // Unsubscribe from real-time updates when the component is unmounted
      if (this.unsubscribe) {
        this.unsubscribe();
      }
    }
  };
  </script>
  