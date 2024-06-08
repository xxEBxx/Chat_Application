<template>
  <div id="app">
    <div class="button-container">
      <button @click="selectChatType('solo')" :class="{ active: selectedChatType === 'solo' }">Solo Chats</button>
      <button @click="selectChatType('group')" :class="{ active: selectedChatType === 'group' }">Group Chats</button>
    </div>
    <div v-if="selectedChatType" class="chat-container">
      <h2>{{ selectedChatType === 'solo' ? 'Solo' : 'Group' }} Chats</h2>
      <div v-for="chatId in chatIds" :key="chatId" @click="selectChat(chatId)" class="chat-item">
        <h3>{{ getChatName(chatId) }}</h3>
        <p v-if="getLastMessage(chatId)">Last message: {{ getLastMessage(chatId).text }} at {{ getLastMessage(chatId).timestamp }}</p>
        <div v-if="getMessages(chatId)">
          <h4>All messages:</h4>
          <div v-for="message in getMessages(chatId)" :key="message.id" class="message-item">
            <p>{{ getUserName(message.sender) }}: {{ message.text }}</p>
          </div>
        </div>
      </div>
      <div v-if="selectedChat" class="messages-container">
        <h2>{{ selectedChat.name || 'Unnamed Chat' }}</h2>
        <div v-for="message in messages" :key="message.id" class="message-item">
          <p>{{ getUserName(message.sender) }}: {{ message.text }}</p>
        </div>
        <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message" class="message-input">
      </div>
    </div>
  </div>
</template>

<script>
import { projectFirestore } from '@/firebase/config.js';
import firebase from 'firebase/app';
import { reactive, ref, watch } from 'vue';

export default {
  name: 'Home',
  props: {
    userData: {
      type: Object,
      required: false,
      default: () => ({ chats_binome: [], chats_group: [] })
    }
  },
  setup(props) {
    const selectedChatType = ref(null);
    const chatIds = ref([]);
    const chats = reactive({});
    const selectedChat = ref(null);
    const messages = ref([]);
    const newMessage = ref('');
    const users = reactive({});

    const selectChatType = async (type) => {
      if (!props.userData || !props.userData.chats_binome || !props.userData.chats_group) {
        console.error("userData is not available");
        return;
      }

      selectedChatType.value = type;
      chatIds.value = type === 'solo' ? props.userData.chats_binome : props.userData.chats_group;
      await fetchChats();
    };

    const fetchChats = async () => {
      for (const chatId of chatIds.value) {
        const chatRef = projectFirestore.collection(selectedChatType.value === 'solo' ? 'messages_binome' : 'messages_group').doc(chatId);
        chatRef.onSnapshot(chatDoc => {
          if (chatDoc.exists) {
            chats[chatId] = { id: chatId, ...chatDoc.data(), name: chatDoc.data().name || 'Unnamed Chat' };
          }
        });
      }
    };

    const getChatName = (chatId) => {
      return chats[chatId] ? chats[chatId].name : 'Loading...';
    };

    const getLastMessage = (chatId) => {
      return chats[chatId] ? chats[chatId].last_msg : null;
    };

    const getMessages = (chatId) => {
      const chat = chats[chatId];
      if (chat && chat.list_mess) {
        return chat.list_mess;
      }
      return null;
    };

    const selectChat = async (chatId) => {
      const chatRef = projectFirestore.collection(selectedChatType.value === 'solo' ? 'messages_binome' : 'messages_group').doc(chatId);
      const chatDoc = await chatRef.get();
      if (chatDoc.exists) {
        selectedChat.value = { id: chatId, ...chatDoc.data(), name: chatDoc.data().name || 'Unnamed Chat' };
        await fetchMessages(chatId);
      }
    };

    const fetchMessages = async (chatId) => {
      const messagesRef = projectFirestore.collection(`${selectedChatType.value === 'solo' ? 'messages_binome' : 'messages_group'}/${chatId}/list_mess`).orderBy('timestamp');
      messagesRef.onSnapshot(snapshot => {
        messages.value = snapshot.docs.map(doc => {
          const messageData = doc.data();
          fetchUser(messageData.sender);
          return { id: doc.id, ...messageData };
        });
      });
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
          sender: props.userData.id,
          text: newMessage.value,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          viewed: false
        };
        await projectFirestore.collection(`${selectedChatType.value === 'solo' ? 'messages_binome' : 'messages_group'}/${selectedChat.value.id}/list_mess`).add(message);
        newMessage.value = '';
      }
    };

    watch(() => props.userData, (newVal) => {
      if (newVal) {
        console.log('userData is available', newVal);
      }
    }, { immediate: true });

    return {
      selectedChatType,
      chatIds,
      chats,
      selectedChat,
      messages,
      newMessage,
      users,
      selectChatType,
      fetchChats,
      getChatName,
      getLastMessage,
      getMessages,
      getUserName,
      selectChat,
      sendMessage
    };
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
  flex-direction: row;
  justify-content: flex-start;
  position: fixed;
  top: 60px;
  left: 10px;
  z-index: 1000;
}

button {
  margin: 5px 5px;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #4a4a4a;
  color: white;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

button.active, button:hover {
  background-color: #333;
  transform: scale(1.05);
}

.chat-container {
  width: 80%;
  max-width: 600px;
  text-align: left;
  margin-top: 120px; /* Adjusted for button container */
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
  margin: 10px 0;
  border-radius: 10px;
  background-color: #e1ffc7;
  max-width: 80%;
  text-align: left;
}

.message-item p {
  margin: 0;
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
