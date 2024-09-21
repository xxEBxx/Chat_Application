<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Login</h2>
      </div>
      <form @submit.prevent="login" class="mt-8 space-y-6">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">E-mail</label>
            <input id="username" name="username" type="text" autocomplete="email" v-model="email" required
                   class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                   placeholder="Email address">
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input id="password" name="password" type="password" autocomplete="current-password" v-model="password" required
                   class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                   placeholder="Password">
          </div>
        </div>

        <div>
          <button type="submit"
                  class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Login
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { auth, projectFirestore } from '@/firebase/config.js';
import { getUser, setUser } from './UserState';

export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    created() {
      auth.onAuthStateChanged((user) => {
        if (user) {
          setUser(user);
          console.log(`User ID: ${user.uid}`);
        } else {
          setUser(null);
          console.log("User is signed out");
        }
      })
    },
    async login() {
      try {
        const userCredential = await auth.signInWithEmailAndPassword(this.email, this.password);
        this.user = userCredential.user;
        console.log(`User ID: ${this.user.uid}`);
        setUser(this.user);

        await projectFirestore.collection('users').doc(this.user.uid).update({
          connected: true
        });

        this.$router.push('/whatsappHome');
      } catch (error) {
        alert(`Login failed: ${error.message}`);
      }
    }
  }
}
</script>

<style scoped>
/* Custom styles if needed */
</style>
