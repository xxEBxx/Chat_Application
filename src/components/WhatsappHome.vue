<template>
  <nav class="navbar professional">
    <p @click="goto_profile" :class="{ 'active': go }">Profile</p>
    <p @click="goto_home" :class="{ 'active': !go }">Home</p>
    <router-link to="/create-chat" class="nav-link">
      Create New Chat
    </router-link>
    <router-link to="/signout" class="nav-link">Sign out</router-link>
    <router-link :to="'/notification/' + userId" :class="{ 'notification-link': hasNotifications, 'full-notifications': isNotificationsFull }" class="nav-link">Notification</router-link>
  </nav>
  <div class="main-container">
    <profile v-if="go" />
    <chat v-else :user-data="userData" />
  </div>
</template>

<script>
import { auth, projectFirestore } from '@/firebase/config.js'; // Adjusted import for simplicity
import profile from "@/components/profile.vue";
import chat from "@/components/Home.vue";
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

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
      toastContainer: null, // Add this line
    };
  },
  created() {
    this.fetchUserData();
    this.createToastContainer(); // Add this line
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
    createToastContainer() {
      this.toastContainer = document.createElement('div');
      document.body.appendChild(this.toastContainer);
    },
    checkNotifications() {
      if (this.userData.notifications && this.userData.notifications.length > 0) {
        this.hasNotifications = true;
        
        const newNotification = this.userData.notifications.some(
          notification => notification.status === "unread"
        );
        this.isNotificationsFull = newNotification;

        if (newNotification) {
          // Clear any existing toasts in the container
          while (this.toastContainer.firstChild) {
            this.toastContainer.removeChild(this.toastContainer.firstChild);
          }

          Toastify({
            text: "You got a new notification",
            duration: 5000, // 5 seconds duration
            gravity: 'bottom', // Display at the bottom
            position: 'right', // Display on the right
            backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
            stopOnFocus: true,
            className: 'toast-custom',
            node: this.toastContainer // Append toast to custom container
          }).showToast();
        }
      } else {
        this.hasNotifications = false;
        this.isNotificationsFull = false;
      }
    }
  },
  beforeDestroy() {
    if (this.unsubscribeUserData) {
      this.unsubscribeUserData();
    }
    if (this.toastContainer) {
      this.toastContainer.remove(); // Remove the custom toast container on component destroy
    }
  }
};
</script>

<style scoped>
/* Navbar Styles */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #333; /* Dark background color */
  padding: 10px;
  position: fixed; /* Fix the navbar at the top */
  top: 0;
  left: 0;
  width: 100%; /* Full width */
  z-index: 1000; /* Ensure the navbar is above other content */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add subtle shadow for depth */
}

.navbar p, .navbar .nav-link, .navbar .create-chat-link {
  color: #fff; /* White text color */
  margin: 0 10px;
  cursor: pointer;
  font-family: 'Arial', sans-serif;
  font-size: 18px;
  text-decoration: none;
  transition: all 0.3s ease-in-out;
  padding: 5px 10px;
  border: 1px solid transparent;
  border-radius: 4px;
}

.navbar p:hover, .navbar .nav-link:hover, .navbar .create-chat-link:hover {
  color: #000; /* Text color on hover */
  background-color: #fff; /* Background color on hover */
  border: 1px solid #000; /* Border color on hover */
}

.active {
  font-weight: bold;
}

.notification-link {
  background-color: transparent; /* Remove red background */
  color: white; /* Keep white text color */
}

.full-notifications {
  background-color: red;
}

.professional p:first-child {
  margin-left: 0;
}

.professional p:last-child {
  margin-right: 0;
}

/* Main Container Adjustments */
.main-container {
  width: 100%;
  margin: 0;
  padding-top: 60px; /* Add padding to avoid content being hidden behind the navbar */
}

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
