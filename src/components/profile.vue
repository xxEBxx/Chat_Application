<template>
  <div class="profile">
    <h1>User Profile</h1>
    <div v-if="loading">Loading...</div>
    <div v-if="error">{{ error }}</div>
    <div v-if="user">
      <img :src="userDoc.image" alt="Profile Picture" class="profile-image"/>
      <div v-if="!editing">
        <p><strong>Name:</strong> {{ userDoc.user_name }}</p>
        <p><strong>Email:</strong> {{ userDoc.email }}</p>
        <p><strong>Location:</strong> {{ userDoc.location }}</p>
        <button @click="editProfile">Edit</button>
      </div>
      <div v-else>
        <div>
          <label>
            <strong>Name:</strong>
            <input v-model="userDoc.user_name" />
          </label>
        </div>
        <div>
          <label>
            <strong>Email:</strong>
            <input v-model="userDoc.email" type="email" />
          </label>
        </div>
        <div>
          <label>
            <strong>Location:</strong>
            <input v-model="userDoc.location" />
          </label>
        </div>
        <button @click="saveProfile">Save</button>
      </div>
    </div>
  </div>
</template>


<script>
import { projectFirestore } from '@/firebase/config.js';
import { getUser } from './UserState.js';

export default {
  name: 'Profile',
  data() {
    return {
      user: null,
      userDoc: null,
      loading: true,
      error: null,
      editing: false
    };
  },
  async beforeMount() {
    try {
      this.user = getUser();
      const id = this.user.uid;
      const doc = await projectFirestore.collection('users').doc(id).get();
      this.userDoc = doc.data();
    } catch (err) {
      this.error = 'Failed to load user data.';
    } finally {
      this.loading = false;
    }
  },
  methods: {
    editProfile() {
      this.editing = true;
    },
    async saveProfile() {
      this.loading = true;
      try {
        const id = this.user.uid;
        await projectFirestore.collection('users').doc(id).update(this.userDoc);
        this.error = null;
        this.$router.push('/whatsappHome');
      } catch (err) {
        this.error = 'Failed to save user data.';
      } finally {
        this.loading = false;
      }
    },
  }
};
</script>

<style scoped>
.profile {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #f7f7f7;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.profile img.profile-image {
  display: block;
  margin: 0 auto 20px;
  max-width: 100px;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile div {
  margin-bottom: 10px;
}

.profile label {
  display: flex;
  flex-direction: column;
  font-weight: bold;
}

.profile input {
  padding: 5px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 5px;
}

.profile button {
  padding: 10px 20px;
  background-color: #555;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.profile button:hover {
  background-color: #444;
}

</style>
