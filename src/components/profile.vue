<template>
    <div class="container">
      <div class="user-info">
        <div class="user-image">
          <img :src="userImage" alt="User Image">
        </div>
        <div class="user-details">
          <h2>{{ username }}</h2>
          <p>{{ location }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      id: {
        type: String,
        required: true
      }
    }
  }
  </script>
  
  <style scoped>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .user-info {
    display: flex;
    align-items: center;
    background-color: #f0f0f0;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .user-image img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-right: 20px;
  }
  
  .user-details {
    display: flex;
    flex-direction: column;
  }
  
  .user-details h2 {
    margin: 0;
    font-size: 24px;
  }
  
  .user-details p {
    margin: 0;
    font-size: 16px;
    color: #666;
  }
  </style>
  