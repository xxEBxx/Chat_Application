<template>
  <div ref="chatContainer" class="chat-details" @scroll="handleScroll">
    <h2 class="text-xl font-bold">{{ chatTitle }}</h2>
    <div v-for="message in messages" :key="message.timestamp" class="message-item" :class="{ sent: message.sender === currentUser.uid }">
      <div v-if="message.sender !== currentUser.uid" class="message-header flex items-center">
        <router-link :to="'/profile_other/' + message.sender">
          <img :src="getUserPhoto(message.sender)" alt="Profile Picture" class="profile-picture w-10 h-10 rounded-full mr-2" />
        </router-link>
        <router-link :to="'/profile_other/' + message.sender">
          <p><strong>{{ getUserName(message.sender) }}</strong></p>
        </router-link>
      </div>
      <p class="mt-2">{{ message.text }}</p>
      <small class="text-gray-500">{{ formatTimestamp(message.timestamp) }}</small>
      <small v-if="currentUser.uid === message.sender">
        <i :class="message.viewed ? 'fas fa-check-double text-blue-500' : 'fas fa-check'"></i>
      </small>
    </div>
    <div class="input-container flex mt-4">
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message" class="message-input flex-grow p-2 border rounded border-gray-300 focus:outline-none focus:ring focus:border-blue-300">
      <button @click="sendMessage" class="send-button ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Send</button>
    </div>
  </div>
</template>
<script>import { projectFirestore } from '@/firebase/config.js';
import firebase from 'firebase/app';
import { reactive, ref, onMounted, onUnmounted, watch } from 'vue';

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
    const chatTitle = ref('Loading...');
    const chatContainer = ref(null);
    let unsubscribe = null;

    const fetchChatDetails = async () => {
      const chatRef = projectFirestore.collection('messages_binome').doc(props.id);
      const chatDoc = await chatRef.get();
      if (chatDoc.exists) {
        chat.value = { id: props.id, ...chatDoc.data() };
        const otherUserId = chat.value.creator_id === currentUser.uid ? chat.value.other_id : chat.value.creator_id;
        await fetchUser(otherUserId);
        chatTitle.value = users[otherUserId]?.user_name || 'Unknown User';
      } else {
        console.error(`No chat found with id: ${props.id}`);
      }
    };

    const subscribeToMessages = () => {
      if (unsubscribe) unsubscribe(); // Unsubscribe from previous chat
      const chatRef = projectFirestore.collection('messages_binome').doc(props.id);
      unsubscribe = chatRef.onSnapshot(async chatDoc => {
        if (chatDoc.exists) {
          const messagesList = chatDoc.data().list_mess || [];
          const updatedMessages = [];

          for (const message of messagesList) {
            fetchUser(message.sender);
            updatedMessages.push(message);
          }

          messages.value = updatedMessages;

          // Mark messages as viewed if the chat is visible and scrolled to the bottom
          if (document.visibilityState === 'visible' && isScrolledToBottom()) {
            markMessagesAsViewed(updatedMessages);
          }
        } else {
          console.error(`No chat found with id: ${props.id}`);
        }
      });
    };

    const markMessagesAsViewed = async (messagesList) => {
      const chatRef = projectFirestore.collection('messages_binome').doc(props.id);
      const updatedMessages = [];
      let needToUpdate = false;

      for (const message of messagesList) {
        if (message.sender !== currentUser.uid && !message.viewed) {
          message.viewed = true;
          needToUpdate = true;
        }
        updatedMessages.push(message);
      }

      if (needToUpdate) {
        await chatRef.update({ list_mess: updatedMessages });
      }
    };

    const fetchUser = async (userId) => {
      if (!userId || typeof userId !== 'string' || userId.trim() === '') {
        console.error('Invalid userId:', userId);
        return;
      }

      if (!users[userId]) {
        try {
          const userRef = projectFirestore.collection('users').doc(userId);
          const userDoc = await userRef.get();
          if (userDoc.exists) {
            users[userId] = userDoc.data();
          } else {
            users[userId] = { user_name: 'Unknown', image: '' };
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    };

    const getUserName = (userId) => {
      if (!users[userId]) {
        fetchUser(userId); // Fetch user data if not already fetched
      }
      return users[userId]?.user_name || 'Fetching...';
    };

    const getUserPhoto = (userId) => {
      return users[userId]?.image || '';
    };

    const addNotification = async (userId, messageText, senderName) => {
      const userRef = projectFirestore.collection('users').doc(userId);
      const userDoc = await userRef.get();
      if (userDoc.exists) {
        const notifications = userDoc.data().notifications || [];
        notifications.push({ status: 'unread', chatname: senderName, message: messageText, timestamp: Date.now() });
        await userRef.update({ notifications });
      } else {
        console.error('User does not exist');
      }
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
            list_mess: currentMessages
          });
          const otherUserId = chat.value.creator_id === currentUser.uid ? chat.value.other_id : chat.value.creator_id;
          const senderName = getUserName(currentUser.uid); // Get the sender's name
          await addNotification(otherUserId, message.text, senderName);

          newMessage.value = '';
        } else {
          console.error('Chat does not exist');
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

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isScrolledToBottom()) {
        markMessagesAsViewed(messages.value);
      }
    };

    const handleScroll = () => {
      if (isScrolledToBottom() && document.visibilityState === 'visible') {
        markMessagesAsViewed(messages.value);
      }
    };

    const isScrolledToBottom = () => {
      const el = chatContainer.value;
      return el.scrollHeight - el.scrollTop === el.clientHeight;
    };

    onMounted(async () => {
      await fetchChatDetails();
      subscribeToMessages();
      document.addEventListener('visibilitychange', handleVisibilityChange);
      chatContainer.value.addEventListener('scroll', handleScroll);
    });

    onUnmounted(() => {
      if (unsubscribe) unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (chatContainer.value) {
        chatContainer.value.removeEventListener('scroll', handleScroll);
      }
    });

    watch(() => props.id, async (newId) => {
      await fetchChatDetails();
      subscribeToMessages();
    });

    return {
      addNotification,
      chat,
      messages,
      newMessage,
      getUserName,
      getUserPhoto,
      sendMessage,
      formatTimestamp,
      currentUser,
      chatTitle,
      chatContainer
    };
  }
};
</script>

<style scoped>
.chat-details {
  margin-top: 20px;
  width: 100%;
  height: 500px; /* Adjust as needed */
  overflow-y: auto;
}

/* Custom scrollbar styles */
.chat-details::-webkit-scrollbar {
  width: 8px;
}

.chat-details::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.chat-details::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.chat-details::-webkit-scrollbar-thumb:hover {
  background: #555;
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

.message-header {
  display: flex;
  align-items: center;
}

.profile-picture {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
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

.viewed {
  color: rgba(71, 190, 253, 0.842);
}

.message-item.sent .message-header {
  justify-content: flex-end;
}

.message-item.sent .profile-picture {
  margin-left: 10px;
  margin-right: 0;
}

.message-item p {
  margin: 5px 0;
}

.message-item small {
  display: block;
  margin-top: 5px;
  color: #888;
}

.message-item.sent small {
  text-align: right;
}
</style>
