<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="p-8 bg-white rounded-lg shadow-lg max-w-4xl w-full">
      <div class="flex flex-col md:flex-row items-center">
        <img
          src="https://img.freepik.com/premium-vector/chatting-messaging-man-woman-chatting-smartphone-hand-holding-mobile-phone-with-text-messages_136162-238.jpg"
          alt="Chat App"
          class="w-full md:w-1/2 rounded-lg mb-4 md:mb-0"
        />
        <div class="md:ml-6 text-center md:text-left">
          <h1 class="text-4xl font-bold text-gray-800 mb-2">Welcome to Connectify</h1>
          <h2 class="text-2xl font-semibold text-gray-600 mb-4">Connect, Communicate, Collaborate</h2>
          <p class="text-gray-700 mb-4">
            Welcome to our chat application, designed to meet all your communication needs. Whether you want to chat one-on-one, create a group for your team, or join a public discussion, our app has it all. Enjoy seamless messaging, intuitive user interfaces, and secure conversations. Dive into the world of effortless communication with features that keep you connected anytime, anywhere.
          </p>
          <p class="text-gray-700 mb-2">Our chat app offers the following features:</p>
          <ul class="list-disc list-inside text-gray-700 mb-4">
            <li>Solo Chats</li>
            <li>Group Chats</li>
            <li>Public Group Chats</li>
          </ul>
          <button @click="goToWhatsappHome" class="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-700 focus:outline-none">
            Go to ConnectifyHome
          </button>
        </div>
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
  

  