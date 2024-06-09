<template>
  <div class="signup">
    <h2>Sign Up</h2>
    <form @submit.prevent="register">
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" id="username" v-model="username" required>
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <div class="form-group">
        <label for="location">Location</label>
        <div class="location-input">
          <select v-model="selectedCountry" @change="changeFlag">
            <option v-for="(country, index) in countries" :key="index" :value="country.name">{{ country.name }}</option>
          </select>
          <div class="selected-flag">
            <img :src="selectedFlag" alt="Selected Flag" class="flag-icon">
          </div>
        </div>
      </div>
     
            
      <button type="submit">Sign Up</button>
      <br><br>
      <button @click="GOOGLE()">Sign in Using Google</button>
    </form>
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
        image:"https://freesvg.org/img/abstract-user-flat-4.png"
       
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
        chats_binome:[],
        chats_group:[],
        image:this.image
      
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
  max-width: 300px;
  margin: auto;
  margin-top: 50px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
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
}

select {
  margin-left: 10px;
}

button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #218838;
}

.location-input {
  display: flex;
  gap: 10px;
}

.location-input input[type="text"] {
  flex: 1;
}

.location-input select {
  flex: 1;
}

.dietary-checkboxes {
  display: flex;
  flex-wrap: wrap; /* Allow checkboxes to wrap on multiple lines */
}

.dietary-checkboxes label {
  margin-right: 10px; /* Add spacing between checkboxes */
}

.flag-icon {
  max-width: 30px; /* Set maximum width for flag icons */
}
</style>
  
  