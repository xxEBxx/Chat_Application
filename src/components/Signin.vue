<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign Up</h2>
      </div>
      <form @submit.prevent="register" class="mt-8 space-y-6">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">Username</label>
            <input id="username" name="username" type="text" v-model="username" required
                   class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm placeholder-center"
                   placeholder="Username">
          </div>
          <div>
            <label for="email" class="sr-only">Email</label>
            <input id="email" name="email" type="email" autocomplete="email" v-model="email" required
                   class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm placeholder-center"
                   placeholder="Email address">
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input id="password" name="password" type="password" autocomplete="new-password" v-model="password" required
                   class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm placeholder-center"
                   placeholder="Password">
          </div>
          <div>
            <label for="location" class="sr-only">Location</label>
            <select v-model="selectedCountry" @change="changeFlag" required
                    class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm placeholder-center">
              <option v-for="(country, index) in countries" :key="index" :value="country.name">{{ country.name }}</option>
            </select>
            <div class="selected-flag">
              <img :src="selectedFlag" alt="Selected Flag" class="flag-icon">
            </div>
          </div>
        </div>

        <div>
          <button type="submit"
                  class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            Sign Up
          </button>
          <button @click="GOOGLE()"
                  class="mt-4 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            Sign in Using Google
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { setUser } from './UserState.js';
import { signInGoogle, projectFirestore, auth } from '../firebase/config.js';

export default {
  data() {
    return {
      user: null,
      username: '',
      email: '',
      password: '',
      location: 'Morocco', // Default location set to Morocco
      countries: [], // Country data will be fetched dynamically
      selectedCountry: '',
      selectedFlag: '',
      image: "https://freesvg.org/img/abstract-user-flat-4.png"
    };
  },
  created() {
    // Fetch the list of countries and their flags
    this.fetchCountries();
  },
  methods: {
    async fetchCountries() {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        this.countries = data.map(country => ({
          name: country.name.common,
          code: country.cca2,
          flag: country.flags.png
        }));

        // Set default country and flag
        const defaultCountry = this.countries.find(country => country.name === this.location);
        if (defaultCountry) {
          this.selectedCountry = defaultCountry.name;
          this.selectedFlag = defaultCountry.flag;
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    },
    changeFlag() {
      const selectedCountry = this.countries.find(country => country.name === this.selectedCountry);
      if (selectedCountry) {
        this.selectedFlag = selectedCountry.flag;
      }
    },
    async register() {
      try {
        const userCredential = await auth.createUserWithEmailAndPassword(this.email, this.password);
        this.user = userCredential.user;
        console.log(`User ID: ${this.user.uid}`);

        const userToAdd = {
          id: this.user.uid,
          lastSignInTime: this.user.metadata.lastSignInTime,
          creationTime: this.user.metadata.creationTime,
          email: this.user.email,
          location: this.selectedCountry, // Update location to use selectedCountry
          user_name: this.username,
          chats_binome: [],
          chats_group: [],
          image: this.image
        };

        await projectFirestore.collection('users').doc(this.user.uid).set(userToAdd);
        console.log("User added successfully with ID:", this.user.uid);

        setUser(this.user);
        this.$router.push('/whatsappHome');
      } catch (error) {
        console.error("Error creating user:", error);
      }
    },
    GOOGLE() {
      signInGoogle();
      this.$router.push('/whatsappHome');
    }
  }
};
</script>

<style scoped>
.signup {
  max-width: 400px;
  margin: auto;
  margin-top: 50px;
  padding: 20px;
  border-radius: 5px;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 10px;
}

label {
  display: block;
}

input[type="text"],
input[type="email"],
input[type="password"],
select {
  width: 100%;
  padding: 5px;
  font-size: 16px;
  text-align: center; /* Center the text */
}

button {
  display: block;
  width: 100%;
  padding: 10px;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  opacity: 0.9;
}

.location-input {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.flag-icon {
  max-width: 30px; /* Set maximum width for flag icons */
  margin: auto;
  display: block;
  align-self: center;
}

.placeholder-center::placeholder {
  text-align: center; /* Center the placeholder text */
}
</style>
