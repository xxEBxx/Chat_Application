<template>
  <div class="container">
    <div class="user-info" v-if="user">
      <div class="user-image">
        <img :src="userImage" alt="User Image">
      </div>
      <div class="user-details">
        <h2>User ID: {{ user.uid }}</h2>
        <h2>Username: {{ user.metadata.username }}</h2>
        <p>User Location: {{ user.metadata.location }}</p>
      </div>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script>
  import { projectFirestore } from '../firebase/config.js'
  import { getUser } from './UserState'

export default {
  data() {
    return {
      user: null
    };
  },
  computed: {
    userImage() {
      return this.user && this.user.image ? this.user.image : 'C:\\Users\\hp\\Desktop\\html-css stuff\\School work s4\\Chat_Application\\pdp.jpg';
    }
  },
  beforeMount() {
    this.user = getUser();
  }
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.user-info {
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.user-image img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 20px;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-details h2 {
  margin: 0;
  font-size: 24px;
}

.user-details p {
  margin: 0;
  font-size: 16px;
  color: #666;
}
</style>