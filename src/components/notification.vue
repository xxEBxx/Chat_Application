<template>
    <div>
      <h2>Notifications</h2>
      <ul>
        <li v-for="notification in notifications" :key="notification.id">
          <strong>{{ notification.chatname }}</strong>: {{ notification.message }} {{ notification.status }}
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
    methods: {
      async fetchNotifications() {
        try {
          const userId = this.$route.params.userId;
          if (userId) {
            const userDoc = await projectFirestore.collection('users').doc(userId).get();
            if (userDoc.exists) {
              const userData = userDoc.data();
              this.notifications = userData.notifications || [];
  
              // Update the status of notifications to true
              for (let index = 0; index < this.notifications.length; index++) {
                const notification = this.notifications[index];
                if (!notification.status) {
                  // Make sure notification.message exists before updating
                  if (notification.message) {
                    notification.status = true;
                    await projectFirestore.collection('users').doc(userId).update({
                      [`notifications.${index}.status`]: true
                    });
                  }
                }
              }
            } else {
              console.log("No such document!");
            }
          } else {
            console.log("No user ID provided.");
          }
        } catch (error) {
          console.error("Error fetching notifications: ", error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  