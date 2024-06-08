<template>
  <div>
    <nav class="navbar professional">
      <p @click="goto_profile" :class="{ 'active': go }">Profile</p>
      <p @click="goto_home" :class="{ 'active': !go }">Home</p>
    </nav>
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
.navbar {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #333; /* Dark background color */
  padding: 10px;
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

/* Additional styles for responsiveness */
@media screen and (max-width: 600px) {
  .navbar p {
    margin: 0 10px;
  }
}
</style>
