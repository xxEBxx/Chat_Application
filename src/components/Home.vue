<template>
  <div id="app">
    <div class="button-container">
      <button @click="selectChatType('solo')" :class="{ active: selectedChatType === 'solo' }">Solo Chats</button>
      <button @click="selectChatType('group')" :class="{ active: selectedChatType === 'group' }">Group Chats</button>
    </div>
    <div v-if="selectedChatType" class="chat-container">
      <h2>{{ selectedChatType === 'solo' ? 'Solo' : 'Group' }} Chats</h2>
      <div v-for="chat in chats" :key="chat.id" @click="selectChat(chat)" class="chat-item">
        <h3>{{ chat.name }}</h3>
      </div>
      <div v-if="selectedChat" class="messages-container">
        <h2>{{ selectedChat.name }}</h2>
        <div v-for="message in messages" :key="message.id" class="message-item">
          <p>{{ message.content }}</p>
        </div>
        <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message" class="message-input">
      </div>
    </div>
  </div>
</template>
<script>
import { projectFirestore } from '@/firebase/config.js';
import firebase from 'firebase/app';

export default {
  name: 'Home',
  props: {
    userData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectedChatType: null,
      chats: [],
      selectedChat: null,
      messages: [],
      newMessage: ''
    };
  },
  methods: {
    async selectChatType(type) {
      this.selectedChatType = type;
      await this.fetchChats();
    },
    async fetchChats() {
      const chatIds = this.selectedChatType === 'solo' ? this.userData.chats_binome : this.userData.chats_group;

      this.chats = [];
      for (const chatId of chatIds) {
        const chatRef = projectFirestore.collection(this.selectedChatType === 'solo' ? 'messages_binome' : 'messages_group').doc(chatId);
        const chatDoc = await chatRef.get();
        if (chatDoc.exists) {
          const chatData = chatDoc.data();
          this.chats.push({ id: chatId, ...chatData });
        }
      }
    },
    async selectChat(chat) {
      this.selectedChat = chat;
      const messagesRef = projectFirestore.collection(`${this.selectedChatType === 'solo' ? 'messages_binome' : 'messages_group'}/${chat.id}/list_mess`).orderBy('timestamp');
      const snapshot = await messagesRef.get();
      this.messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    async sendMessage() {
      if (this.newMessage.trim()) {
        const message = {
          content: this.newMessage,
          seen: false,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };
        await projectFirestore.collection(`${this.selectedChatType === 'solo' ? 'messages_binome' : 'messages_group'}/${this.selectedChat.id}/list_mess`).add(message);
        this.messages.push({ ...message, id: new Date().getTime().toString() }); // Optimistic UI update
        this.newMessage = '';
      }
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
/* Button Container Styles */
.button-container {
  display: flex;
  flex-direction: row; /* Stack buttons vertically */
  justify-content: flex-start; /* Align buttons to the start (top) */
  position: fixed; /* Fix the button container */
  top: 60px; /* Position below the navbar */
  left: 10px; /* Align to the left edge of the page with some padding */
  z-index: 1000; /* Ensure the button container is above other content */
}

button {
  margin: 5px 5px; /* Vertical margin for stacking */
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #4a4a4a; /* Matching the vibe of the app */
  color: white;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

button.active, button:hover {
  background-color: #333; /* Darker gray for active and hover state */
  transform: scale(1.05);
}

.chat-container {
  width: 80%;
  max-width: 600px;
  text-align: left;
}

.chat-item {
  padding: 10px;
  border: 1px solid #ddd; /* Light gray border */
  border-radius: 5px;
  margin: 10px 0;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.chat-item:hover {
  background-color: #e0e0e0; /* Slightly darker gray for hover */
}

.messages-container {
  margin-top: 20px;
}

.message-item {
  padding: 10px;
  border-bottom: 1px solid #ddd; /* Light gray border */
}

.message-input {
  width: calc(100% - 20px);
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #ddd; /* Light gray border */
  border-radius: 5px;
  outline: none;
  background-color: #f9f9f9; /* Very light gray background */
}

.message-input:focus {
  border-color: #4a4a4a; /* Dark gray for focus */
  box-shadow: 0 0 5px rgba(74, 74, 74, 0.5); /* Gray shadow */
}
</style>
