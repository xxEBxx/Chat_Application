<template>
  <div class="min-h-screen bg-gray-100">
    <div class="container mx-auto p-6">
      <h1 class="text-3xl font-bold mb-6">Profile</h1>
      <div v-if="userData" class="bg-white p-6 rounded-lg shadow-md">
        <div class="flex items-center space-x-4 mb-4">
          <img :src="userData.image" alt="User Profile Picture" class="w-24 h-24 rounded-full object-cover">
          <div>
            <p class="text-2xl font-semibold">{{ userData.user_name }}</p>
            <p class="flex items-center space-x-2">
              <span :class="{'bg-green-500': userData.connected, 'bg-red-500': !userData.connected}" class="w-3 h-3 rounded-full"></span>
              <span>{{ userData.connected ? 'Online' : 'Offline' }}</span>
            </p>
          </div>
        </div>
        <div class="space-y-2">
          <p><strong>Username:</strong> {{ userData.user_name }}</p>
          <p><strong>Email:</strong> {{ userData.email }}</p>
          <p><strong>Location:</strong> {{ userData.location }}</p>
        </div>
      </div>
      <div v-else class="bg-white p-6 rounded-lg shadow-md text-center">
        <p>Loading user data...</p>
      </div>
      <button @click="go_home()" class="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">Go Home</button>
    </div>
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
    },
    goto_home(){
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

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
}

.bg-gray-800 p {
  margin: 0;
}

.bg-white p {
  margin: 0;
}
</style>
