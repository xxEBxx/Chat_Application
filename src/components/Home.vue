<template>
    <div id="app">
      <div>
        <button @click="selectChatType('solo')">Solo Chats</button>
        <button @click="selectChatType('group')">Group Chats</button>
      </div>
      <div v-if="selectedChatType">
        <h2>{{ selectedChatType === 'solo' ? 'Solo' : 'Group' }} Chats</h2>
        <div v-for="chat in chats" :key="chat.id" @click="selectChat(chat)">
          <h3>{{ chat.name }}</h3>
        </div>
        <div v-if="selectedChat">
          <h2>{{ selectedChat.name }}</h2>
          <div v-for="message in messages" :key="message.id">
            <p>{{ message.content }}</p>
          </div>
          <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message">
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { db } from './config.vue';
  import firebase from 'firebase/app';
  
  export default {
    name: 'App',
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
        const userId = ; 
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();
        
        if (!userDoc.exists) {
          console.error('No such user!');
          return;
        }
  
        const userData = userDoc.data();
        const chatIds = this.selectedChatType === 'solo' ? userData.chats_binome : userData.chats_group;
  
        this.chats = [];
        for (const chatId of chatIds) {
          const chatRef = db.collection(this.selectedChatType === 'solo' ? 'messages_binome' : 'messages_group').doc(chatId);
          const chatDoc = await chatRef.get();
          if (chatDoc.exists) {
            this.chats.push({ id: chatId, ...chatDoc.data() });
         }
        }
      },
      async selectChat(chat) {
        this.selectedChat=chat;
        const messagesRef = db.collection(`${this.selectedChatType === 'solo' ? 'messages_binome' : 'messages_group'}/${chat.id}/list_mess`).orderBy('timestamp');
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
          await db.collection(`${this.selectedChatType === 'solo' ? 'messages_binome' : 'messages_group'}/${this.selectedChat.id}/list_mess`).add(message);
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
  }
  
  button {
    margin: 10px;
  }
  
  input {
    width: 80%;
    padding: 10px;
    margin-top: 10px;
  }
  </style>
  