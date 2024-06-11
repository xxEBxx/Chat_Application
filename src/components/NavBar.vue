<template>
  <nav class="navbar">
    <div class="container mx-auto flex justify-between items-center">
      <div class="flex space-x-4">
        <router-link to="/login" class="nav-link">Login</router-link>
        <router-link to="/signin" class="nav-link">Sign Up</router-link>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar'
};
</script>

<style scoped>
.navbar {
  background-color: #2e40b6; /* Modern purple color */
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow */
}

.nav-link {
  color: #fff; /* White text color */
  margin-right: 10px;
  text-decoration: none;
  font-weight: 500;
  font-size: 16px;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #50e3c2; /* Secondary Color */
  text-decoration: underline;
}
</style>
