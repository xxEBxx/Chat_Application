<template>
  <div class="chat-details">
    <h2>{{ chatTitle }}</h2>
    <div v-for="message in messages" :key="message.id" class="message-item" :class="{ sent: message.sender === currentUser.uid }">
      <p><strong>{{ getUserName(message.sender) }}:</strong> {{ message.text }}</p>
      <small>{{ formatTimestamp(message.timestamp) }}</small>
    </div>
    <div class="input-container">
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message" class="message-input">
      <button @click="sendMessage" class="send-button">Send</button>
    </div>
  </div>
</template>

<script>
import { projectFirestore } from '@/firebase/config.js';
import firebase from 'firebase/app';
import { reactive, ref, onMounted } from 'vue';

export default {
  name: 'ChatDetailsGrp',
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
    const chatTitle = ref('');

    onMounted(async () => {
      await fetchChatDetails();
      subscribeToMessages();
    });

    const fetchChatDetails = async () => {
      const chatRef = projectFirestore.collection('messages_group').doc(props.id);
      const chatDoc = await chatRef.get();
      if (chatDoc.exists) {
        chat.value = { id: props.id, ...chatDoc.data() };
        chatTitle.value = chat.value.group_name || 'Unknown Group';
        await fetchUsers(chat.value.members);
      } else {
        console.error(`No chat found with id: ${props.id}`);
      }
    };

    const subscribeToMessages = () => {
      const chatRef = projectFirestore.collection('messages_group').doc(props.id);
      chatRef.onSnapshot(chatDoc => {
        if (chatDoc.exists) {
          messages.value = chatDoc.data().list_mess || [];
          messages.value.forEach(message => fetchUser(message.sender));
        } else {
          console.error(`No chat found with id: ${props.id}`);
        }
      });
    };

    const fetchUsers = async (userIds) => {
      for (const userId of userIds) {
        await fetchUser(userId);
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
        const chatRef = projectFirestore.collection('messages_group').doc(props.id);
        const chatDoc = await chatRef.get();
        if (chatDoc.exists) {
          const currentMessages = chatDoc.data().list_mess || [];
          currentMessages.push(message);
          await chatRef.update({
            last_message_sender: currentUser.uid,
            last_message_text: newMessage.value,
            last_message_timestamp: Date.now(),
            last_message_viewed: false,
            list_mess: currentMessages
          });
          newMessage.value = '';
        } else {
          console.error(`No chat found with id: ${props.id}`);
        }
      }
    };

    const formatTimestamp = (timestamp) => {
      if (!timestamp) return 'Loading...';
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      const hours = ('0' + date.getHours()).slice(-2);
      const minutes = ('0' + date.getMinutes()).slice(-2);
      const seconds = ('0' + date.getSeconds()).slice(-2);
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    return {
      chat,
      messages,
      newMessage,
      getUserName,
      sendMessage,
      formatTimestamp,
      currentUser,
      chatTitle
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

.input-container {
  display: flex;
  margin-top: 10px;
}

.message-input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
}

.message-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.send-button {
  padding: 10px 15px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
}

.send-button:hover {
  background-color: #0056b3;
}
</style>
