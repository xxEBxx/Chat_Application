<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <nav class="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div class="flex space-x-4">
        <p @click="goto_profile" :class="['cursor-pointer', go ? 'font-bold' : '']">Profile</p>
        <p @click="goto_home" :class="['cursor-pointer', !go ? 'font-bold' : '']">Home</p>
      </div>
      <div class="flex space-x-4">
        <router-link to="/create-chat" class="hover:bg-gray-700 px-3 py-2 rounded">Create New Chat</router-link>
        <router-link to="/signout" class="hover:bg-gray-700 px-3 py-2 rounded">Sign out</router-link>
        <router-link :to="'/notification/' + userId" :class="['hover:bg-gray-700 px-3 py-2 rounded', { 'bg-red-500': isNotificationsFull }]">Notification</router-link>
      </div>
    </nav>
    <div class="flex-grow p-6">
      <profile v-if="go" />
      <chat v-else :user-data="userData" />
    </div>
    <div v-if="showPopup" class="fixed bottom-5 right-5 bg-gray-800 text-white p-4 rounded shadow-md">
      <p>You got a new notification</p>
      <button @click="closePopup" class="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Close</button>
    </div>
  </div>
</template>

<script>
import { auth, projectFirestore } from '@/firebase/config.js'; // Adjusted import for simplicity
import profile from "@/components/profile.vue";
import chat from "@/components/Home.vue";

export default {
  name: "whatsappHome",
  components: { profile, chat },
  data() {
    return {
      go: false,
      userId: null,
      userData: null,
      unsubscribeUserData: null,
      hasNotifications: true,
      isNotificationsFull: false,
      showPopup: false,
    };
  },
  created() {
    this.fetchUserData();
  },
  methods: {
    goto_profile() {
      this.go = true;
    },
    goto_home() {
      this.go = false;
    },
    fetchUserData() {
      const user = auth.currentUser;
      if (user) {
        const userDoc = projectFirestore.collection('users').doc(user.uid);
        this.unsubscribeUserData = userDoc.onSnapshot((doc) => {
          if (doc.exists) {
            this.userData = doc.data();
            this.userId = user.uid;
            this.checkNotifications();
          } else {
            console.log("No such document!");
          }
        });
      } else {
        console.log("No user is signed in.");
      }
    },
    checkNotifications() {
      if (this.userData.notifications && this.userData.notifications.length > 0) {
        this.hasNotifications = true;
        
        const newNotification = this.userData.notifications.some(
          notification => notification.status === "unread"
        );
        this.isNotificationsFull = newNotification;

        if (newNotification) {
          this.showPopup = true;
        }
      } else {
        this.hasNotifications = false;
        this.isNotificationsFull = false;
      }
    },
    closePopup() {
      this.showPopup = false;
    }
  },
  beforeDestroy() {
    if (this.unsubscribeUserData) {
      this.unsubscribeUserData();
    }
  }
};
</script>

<style scoped>
/* Additional styles for responsiveness */
@media screen and (max-width: 600px) {
  .navbar p, .navbar .nav-link, .navbar .create-chat-link {
    margin: 0 5px;
  }
  .create-chat-link button {
    width: 100%;
    padding: 8px 15px;
    font-size: 16px;
  }
}
</style>
