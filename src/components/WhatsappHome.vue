<template>
 
   
      <nav class="navbar professional">
        <p @click="goto_profile" :class="{ 'active': go }">Profile</p>
        <p @click="goto_home" :class="{ 'active': !go }">Home</p>
        <router-link to="/create-chat" class="create-chat-link"><button>Create New Chat</button>
        </router-link>
        <router-link to="/signout" class="nav-link">Sign out</router-link>
        <router-link :to="'/notification'+ message.sender" >Notification</router-link>
       
      </nav>
   
    <div class="main-container">
      <profile v-if="go"/>
      <chat v-else :user-data="userData" />
    </div>
 
</template>

<script>
import { auth } from '@/firebase/config.js'
import { projectFirestore } from '@/firebase/config.js'
import profile from "@/components/profile.vue";
import chat from "@/components/Home.vue";

export default {
  name: "whatsappHome",
  components: {
    profile,
    chat
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

.nav-link {
  color: #fff; /* White text color */
  margin: 0 ;
  cursor: pointer;
  font-family: 'Arial', sans-serif;
  font-size: 18px;
  text-decoration: none;
  transition: all 0.3s ease-in-out;
  padding: 5px 10px;
  border: 1px solid transparent;
  border-radius: 4px;
}

.nav-link:hover {
  color: #000; /* Text color on hover */
  background-color: #fff; /* Background color on hover */
  border: 1px solid #000; /* Border color on hover */
}

.professional p:first-child {
  margin-left: 0;
}

.professional p:last-child {
  margin-right: 0;
}

/* Main Container Adjustments */

.main-container{
  width:100%;
  margin:0
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
    padding: 8px 16px;}
}
</style>
