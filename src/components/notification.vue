<template>
    <div>
      <h2>Notifications</h2>
      <router-link to="/WhatsappHome" class="back-link">Back to Home</router-link>
      <ul>
        <li v-for="notification in notifications" :key="notification.id">
          <strong>{{ notification.chatname }}</strong>: {{ notification.text }} {{ notification.status }}
        </li>
      </ul>
      <button @click="updateNotificationsToRead">I clicked</button>
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
  .back-link {
    display: inline-block;
    margin-bottom: 20px;
    color: #007BFF;
    text-decoration: none;
    font-size: 16px;
  }
  
  .back-link:hover {
    text-decoration: underline;
  }
  
  /* Add other styles as needed */
  </style>
  