<template>
    <div class="welcome-wrapper">
      <div class="welcome-content">
        <img
          src="https://appinventiv.com/wp-content/uploads/2021/08/firebase-chat-app.png"
          alt="Chat App"
          class="welcome-image"
        />
        <div class="welcome-text">
          <h1>Welcome</h1>
          <h2 class="slogan">Connect, Communicate, Collaborate</h2>
          <p>
            Welcome to our chat application, designed to meet all your
            communication needs. Whether you want to chat one-on-one, create a
            group for your team, or join a public discussion, our app has it all.
            Enjoy seamless messaging, intuitive user interfaces, and secure
            conversations. Dive into the world of effortless communication with
            features that keep you connected anytime, anywhere.
          </p>
          <p>Our chat app offers the following features:</p>
          <ul>
            <li>Solo Chats</li>
            <li>Group Chats</li>
            <li>Public Group Chats</li>
          </ul>
          <button @click="goToWhatsappHome" class="home-button">
            Go to WhatsappHome
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { useRouter } from "vue-router";
  
  export default {
    name: "WelcomePage",
    setup() {
      const router = useRouter();
      return { router };
    },
    methods: {
      goToWhatsappHome() {
        this.router.push("/WhatsappHome");
      },
    },
  };
  </script>
  
  <style scoped>
  .welcome-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f8f9fa;
    padding: 40px;
    height: 100vh;
    box-sizing: border-box;
  }
  
  .welcome-content {
    display: flex;
    align-items: center;
    background: white;
    border-radius: 12px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    padding: 30px;
    max-width: 900px;
    width: 100%;
    box-sizing: border-box;
  }
  
  .welcome-image {
    max-width: 35%;
    border-radius: 12px;
    margin-right: 30px;
  }
  
  .welcome-text {
    flex: 1;
  }
  
  h1 {
    font-size: 36px;
    color: #343a40;
    margin-bottom: 10px;
  }
  
  h2.slogan {
    font-size: 20px;
    color: #495057;
    margin-bottom: 20px;
  }
  
  p {
    font-size: 16px;
    color: #6c757d;
    margin-bottom: 20px;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
    margin-bottom: 20px;
  }
  
  li {
    font-size: 16px;
    color: #6c757d;
    margin-bottom: 10px;
  }
  
  .home-button {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
  }
  
  .home-button:hover {
    background-color: #0056b3;
  }
  </style>
  