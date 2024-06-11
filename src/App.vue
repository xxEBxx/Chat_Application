<template>
  <div id="app" class="text-center mt-16">
    <router-view />
  </div>
</template>

<script>
import Navbar from './components/NavBar.vue';

export default {
  name: 'App',
  components: {
    Navbar
  }
};
</script>

<style>
</style>
