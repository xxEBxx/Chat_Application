<template>
  <div class="profile">
    <h1>User Profile</h1>
    <div v-if="loading">Loading...</div>
    <div v-if="error">{{ error }}</div>
    <div v-if="user" class="profile-content">
      <img :src="userDoc.image" alt="Profile Picture" class="profile-image"/>
      <div class="profile-info">
        <div v-if="!editing">
          <p><strong>Name:</strong> {{ userDoc.user_name }}</p>
          <p><strong>Email:</strong> {{ userDoc.email }}</p>
          <p><strong>Location:</strong> {{ userDoc.location }}</p>
          <button @click="editProfile">Edit</button>
        </div>
        <div v-else>
          <div>
            <label>
              <strong>Image URL:</strong>
              <input v-model="userDoc.image" />
            </label>
          </div>
          <div>
            <label>
              <strong>Name:</strong>
              <input v-model="userDoc.user_name" />
            </label>
          </div>
          <div>
            <label>
              <strong>Location:</strong>
              <input v-model="locationQuery" @input="fetchCountries" />
            </label>
            <ul v-if="countries.length">
              <li v-for="country in countries" :key="country.cca3" @click="selectCountry(country.name.common)">
                {{ country.name.common }}
              </li>
            </ul>
          </div>
          <button @click="saveProfile">Save</button>
        </div>
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
      editing: false,
      locationQuery: '',
      countries: []
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
        this.editing = false;
      } catch (err) {
        this.error = 'Failed to save user data.';
      } finally {
        this.loading = false;
      }
    },
    async fetchCountries() {
      if (this.locationQuery.length > 2) {
        try {
          const response = await fetch('https://restcountries.com/v3.1/all');
          const data = await response.json();
          this.countries = data.filter(country =>
            country.name.common.toLowerCase().includes(this.locationQuery.toLowerCase())
          );
        } catch (err) {
          console.error('Failed to fetch countries:', err);
        }
      } else {
        this.countries = [];
      }
    },
    selectCountry(countryName) {
      this.userDoc.location = countryName;
      this.locationQuery = countryName;
      this.countries = [];
    }
  }
};
</script>

<style scoped>
.profile {
  max-width: 800px;
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

.profile-content {
  display: flex;
  align-items: flex-start;
}

.profile img.profile-image {
  margin-right: 20px;
  max-width: 150px;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-info {
  flex: 1;
}

.profile-info p {
  margin: 10px 0;
}

.profile-info button {
  padding: 10px 20px;
  margin: 5px 5px;
  background-color: #555;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.profile-info button:hover {
  background-color: #444;
}

.profile-info input {
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 5px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease;
}

.profile-info input:focus {
  border-color: #007bff;
  outline: none;
}

ul {
  list-style-type: none;
  padding: 0;
  margin-top: 10px;
}

li {
  cursor: pointer;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 5px;
  transition: background-color 0.3s ease;
}

li:hover {
  background-color: #f0f0f0;
}
</style>
