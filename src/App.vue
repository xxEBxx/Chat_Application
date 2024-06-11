<template>
  <div id="app" class="text-center">
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
