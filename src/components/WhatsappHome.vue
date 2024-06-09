<template>
  <div>
    <div class="top-div">
      <nav class="navbar professional">
        <p @click="goto_profile" :class="{ 'active': go }">Profile</p>
        <p @click="goto_home" :class="{ 'active': !go }">Home</p>
      </nav>
    </div>      
    <CreateChat v-if="!go" class="create-chat"/>
    <div class="main-container">
      <profile v-if="go"/>
      <chat v-else :user-data="userData" />
    </div>
  </div>
</template>

<script>
import { auth } from '@/firebase/config.js'
import { projectFirestore } from '@/firebase/config.js'
import profile from "@/components/profile.vue";
import chat from "@/components/Home.vue";
import CreateChat from "@/components/CreateChat.vue"

export default {
  name: "whatsappHome",
  components: {
    profile,
    chat,
    CreateChat
  },
  data() {
    return {
      go: false,
      user: null,
      chat_bin: true,
      userData: null
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
    async fetchUserData() {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await projectFirestore.collection('users').doc(user.uid).get();
          if (userDoc.exists) {
            this.userData = userDoc.data();
          } else {
            console.log("No such document!");
          }
        } else {
          console.log("No user is signed in.");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    }
  }
};
</script>

<style scoped>
/* Navbar Styles */
.navbar {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #333; /* Dark background color */
  padding: 10px;
  position: fixed; /* Fix the navbar at the top */
  top: 0;
  left: 0;
  width: 100%; /* Full width */
  z-index: 1000; /* Ensure the navbar is above other content */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add subtle shadow for depth */
}

.navbar p {
  color: #fff; /* White text color */
  margin: 0 20px;
  cursor: pointer;
  font-family: 'Arial', sans-serif;
  font-size: 18px;
  transition: all 0.3s ease-in-out;
}

.navbar p:hover {
  opacity: 0.8;
}

.active {
  font-weight: bold;
}

.professional p:first-child {
  margin-left: 0;
}

.professional p:last-child {
  margin-right: 0;
}

/* Main Container Adjustments */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #333; /* Darker gray for primary text */
  margin-top: 100px; /* Adjust for fixed navbar */
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5; /* Light gray background */
}

/* CreateChat Component Styling */
.create-chat {
  margin-top: 20px;
  width: 80%;
  max-width: 600px;
  padding: 10px 20px;
  background-color: #fff; /* White background */
  border: 1px solid #ccc; /* Light border */
  border-radius: 24px; /* Rounded corners */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  display: flex;
  align-items: center;
  z-index: 600; /*Z INDEX*/ 
}

.create-chat input {
  flex: 1;
  border: none;
  outline: none;
  padding: 10px;
  font-size: 16px;
  border-radius: 24px;
}

.create-chat button {
  border: none;
  background-color: #007bff; /* Blue button */
  color: #fff;
  padding: 10px 20px;
  margin-left: 10px;
  border-radius: 24px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.create-chat button:hover {
  background-color: #0056b3; /* Darker blue on hover */
}

/* Additional styles for responsiveness */
@media screen and (max-width: 600px) {
  .navbar p {
    margin: 0 10px;
  }
  .create-chat {
    width: 90%;
    padding: 8px 15px;
  }
  .create-chat input {
    padding: 8px;
  }
  .create-chat button {
    padding: 8px 16px;
  }
}
</style>
