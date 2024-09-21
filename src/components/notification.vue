<template>
  <div class="max-w-xl mx-auto p-6 bg-gray-100 border border-gray-300 rounded-lg">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Notifications</h2>
    <router-link to="/WhatsappHome" class="text-blue-500 hover:underline text-sm mb-4 block">Back to Home</router-link>
    <br>
    <br>
    <button @click="updateNotificationsToRead" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">OK</button>
    <ul class="list-none p-0 mt-4 space-y-4">
      <li v-for="notification in reversedNotifications" :key="notification.id" :class="{ 'bg-green-100 border-l-4 border-green-500': notification.status === 'read', 'bg-red-100 border-l-4 border-red-500 font-bold': notification.status === 'unread' }" class="p-4 rounded-lg transition-colors">
        <strong class="block mb-2">{{ notification.chatname }}</strong> {{ notification.message }} 
      </li>
    </ul>
  </div>
</template>

<script>
import { projectFirestore } from '@/firebase/config.js';

export default {
  name: "Notifications",
  data() {
    return {
      notifications: []
    };
  },
  async created() {
    await this.fetchNotifications();
  },
  computed: {
    reversedNotifications() {
      return [...this.notifications].reverse();
    }
  },
  methods: {
    async fetchNotifications() {
      try {
        const userId = this.$route.params.userId;
        if (userId) {
          const userDoc = await projectFirestore.collection('users').doc(userId).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            this.notifications = userData.notifications || [];
          } else {
            console.log("No such document!");
          }
        } else {
          console.log("No user ID provided.");
        }
      } catch (error) {
        console.error("Error fetching notifications: ", error);
      }
    },
    async updateNotificationsToRead() {
      try {
        const userId = this.$route.params.userId;
        if (userId) {
          const userDoc = await projectFirestore.collection('users').doc(userId).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            const notifications = userData.notifications || [];
            notifications.forEach((notification, index) => {
              notification.status = 'read'; // Update the status locally
            });
            await projectFirestore.collection('users').doc(userId).update({
              notifications: notifications // Update the entire notifications array
            });
            this.notifications = notifications; // Reflect the changes in the component's data
          }
        }
      } catch (error) {
        console.error("Error updating notifications: ", error);
      }
    }
  }
};
</script>

<style scoped>
</style>
