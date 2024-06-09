<template>
  <div class="chat-details">
    <h2>{{ 'Chat' }}</h2>
    <div v-for="message in messages" :key="message.id" class="message-item" :class="{ sent: message.sender === currentUser.uid }">
      <p><strong>{{ getUserName(message.sender) }}:</strong> {{ message.text }}</p>
      <small>{{ formatTimestamp(message.timestamp) }}</small>
    </div>
    <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message" class="message-input">
  </div>
</template>

<script>
import { projectFirestore } from '@/firebase/config.js';
import firebase from 'firebase/app';
import { reactive, ref, onMounted } from 'vue';

export default {
  name: 'Chat_detail_binome',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const messages = ref([]);
    const newMessage = ref('');
    const users = reactive({});
    const currentUser = firebase.auth().currentUser;
    const chat = ref({});

    onMounted(async () => {
      await fetchChatDetails();
      await fetchMessages();
    });

    const fetchChatDetails = async () => {
      const chatRef = projectFirestore.collection('messages_binome').doc(props.id);
      const chatDoc = await chatRef.get();
      if (chatDoc.exists) {
        chat.value = { id: props.id, ...chatDoc.data() };
        console.log(`Fetched chat details: `, chat.value);
      } else {
        console.error(`No chat found with id: ${props.id}`);
      }
    };

    const fetchMessages = async () => {
      const chatRef = projectFirestore.collection('messages_binome').doc(props.id);
      const chatDoc = await chatRef.get();
      if (chatDoc.exists) {
        messages.value = chatDoc.data().list_mess || [];
        messages.value.forEach(message => fetchUser(message.sender));
        console.log(`Fetched messages: `, messages.value);
      } else {
        console.error(`No chat found with id: ${props.id}`);
      }
    };

    const fetchUser = async (userId) => {
      if (!users[userId]) {
        const userRef = projectFirestore.collection('users').doc(userId);
        const userDoc = await userRef.get();
        if (userDoc.exists) {
          users[userId] = userDoc.data().user_name;
        } else {
          users[userId] = 'Unknown';
        }
      }
    };

    const getUserName = (userId) => {
      if (!users[userId]) {
        fetchUser(userId); // Fetch user data if not already fetched
      }
      return users[userId] || 'Fetching...';
    };

    const sendMessage = async () => {
      if (newMessage.value.trim()) {
        const message = {
          sender: currentUser.uid,
          text: newMessage.value,
          timestamp: Date.now(),
          viewed: false
        };
        const chatRef = projectFirestore.collection('messages_binome').doc(props.id);
        const chatDoc = await chatRef.get();
        if (chatDoc.exists) {
          const currentMessages = chatDoc.data().list_mess || [];
          currentMessages.push(message);
          await chatRef.update({ 
            last_message_sender: currentUser.uid,
            last_message_text: newMessage.value,
            last_message_timestamp: Date.now(),
            last_message_viewed: false,
            list_mess: currentMessages });
          newMessage.value = '';
        } else {
          console.error(`No chat found with id: ${props.id}`);
        }
      }
    };

    const formatTimestamp = (timestamp) => {
      if (!timestamp) return 'Loading...';
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleString();
    };

    return {
      chat,
      messages,
      newMessage,
      getUserName,
      sendMessage,
      formatTimestamp,
      currentUser
    };
  }
};
</script>

<style>
.chat-details {
  margin-top: 20px;
}

.message-item {
  padding: 10px;
  margin: 10px 0;
  border-radius: 10px;
  background-color: #e1ffc7;
  max-width: 80%;
  text-align: left;
}

.message-item.sent {
  background-color: #d1e7ff;
  margin-left: auto;
  text-align: right;
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
