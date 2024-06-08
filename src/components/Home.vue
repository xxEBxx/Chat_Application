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

.button-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

button.active, button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.chat-container {
  width: 80%;
  max-width: 600px;
  text-align: left;
}

.chat-item {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin: 10px 0;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.chat-item:hover {
  background-color: #f1f1f1;
}

.messages-container {
  margin-top: 20px;
}

.message-item {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.message-input {
  width: calc(100% - 20px);
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
}

.message-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}
</style>
