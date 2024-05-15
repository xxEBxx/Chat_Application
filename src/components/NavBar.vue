<template>
    <nav class="navbar">
      <router-link to="/login" class="nav-link">Login</router-link>
      <router-link to="/signin" class="nav-link">Sign Up</router-link>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'Navbar'
  };
  </script>
  
  <style scoped>
  .navbar {
    background-color: #333;
    padding: 10px;
  }
  
  .nav-link {
    color: #fff;
    margin-right: 10px;
    text-decoration: none;
  }
  
  .nav-link:hover {
    text-decoration: underline;
  }
  </style>
  