<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.8.3/font/bootstrap-icons.css">  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import Navbar from './components/NavBar.vue';
import '@fortawesome/fontawesome-free/css/all.css';

export default {
  name: 'App',
  components: {
    Navbar
  }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
