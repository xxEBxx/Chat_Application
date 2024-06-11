<template>
    <div class="notification-container">
      <h2 class="notification-title">Notifications</h2>
      <router-link to="/WhatsappHome" class="back-link">Back to Home</router-link>
      <br>
      <br>
      <button @click="updateNotificationsToRead" class="mark-read-button">OK</button>
      <ul class="notification-list">
        <li v-for="notification in reversedNotifications" :key="notification.id" :class="{ read: notification.status === 'read', unread: notification.status === 'unread' }">
          <strong>{{ notification.chatname }}</strong> {{ notification.message }} 
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
  .notification-container {
    padding: 20px;
    background-color: #f9f9f9;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    max-width: 600px;
    margin: 0 auto;
  }
  
  .notification-title {
    font-size: 24px;
    margin-bottom: 20px;
    color: #333;
  }
  
  .back-link {
    display: block;
    margin-bottom: 20px;
    color: #007BFF;
    text-decoration: none;
    font-size: 14px;
  }
  
  .back-link:hover {
    text-decoration: underline;
  }
  
  .notification-list {
    list-style-type: none;
    padding: 0;
  }
  
  .notification-list li {
    padding: 15px;
    margin-bottom: 15px;
    border-radius: 8px;
    transition: background-color 0.3s;
  }
  
  .read {
    background-color: #e6ffed;
    border-left: 5px solid #28a745;
  }
  
  .unread {
    background-color: #ffe6e6;
    border-left: 5px solid #dc3545;
    font-weight: bold;
  }
  
  .notification-list li strong {
    display: block;
    margin-bottom: 8px;
  }
  
  .mark-read-button {
    padding: 10px 30px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .mark-read-button:hover {
    background-color: #0056b3;
  }
  </style>
  