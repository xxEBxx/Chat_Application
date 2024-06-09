<template>
  <div id="app">
    <div class="button-container">
      <button @click="selectChatType('solo')" :class="{ active: selectedChatType === 'solo' }">Solo Chats</button>
      <button @click="selectChatType('group')" :class="{ active: selectedChatType === 'group' }">Group Chats</button>
    </div>
    <div v-if="selectedChatType" class="chat-container">
      <div v-if="selectedChatType === 'solo'">
        <h2>{{ selectedChatType === 'solo' ? 'Solo' : 'Group' }} Chats</h2>
        <div v-for="chatId in sortedChatIds" :key="chatId" class="chat-item">

          <div @click="change_cred('binome',chatId)">
            <h3>{{ getChatDisplayName(chats[chatId]) }}</h3>
            <p v-if="getLastMessage_text(chatId)">Last message: from {{ getLastMessage_user(chatId) }}  {{ getLastMessage_text(chatId) }} at {{ getLastMessage_timestamp(chatId) }}</p>
          </div>

        </div>
      </div>
      <div v-if="selectedChatType !== 'solo'">
        <h2>{{ selectedChatType === 'solo' ? 'Solo' : 'Group' }} Chats</h2>
        <div v-for="chatId in sortedChatIds" :key="chatId" class="chat-item" >
          <div @click="change_cred('group',chatId)">
            <h3 v-if="chats[chatId]">{{ chats[chatId].group_name }}</h3>
            <p v-if="getLastMessage_text(chatId)" @click="show_details_grp(chatId)">Last message: from {{ getLastMessage_user(chatId) }}   {{ getLastMessage_text(chatId) }} at {{ getLastMessage_timestamp(chatId) }}</p>
          </div>
        </div>
      </div>
    </div>
    <Chat_details_binome v-if="check_comp_to_show('binome')" :id="id_to_pass"/>
    <Chat_details_group v-if="check_comp_to_show('group')" :id="id_to_pass"/>
  </div>
</template>

<script>
import { projectFirestore } from '@/firebase/config.js';
import firebase from 'firebase/app';
import { reactive, ref, computed, watch } from 'vue';
import Chat_details_group from './Chat_details_group.vue';
import Chat_details_binome from './Chat_details_binome.vue';

export default {
  name: 'Home',
  components: { 
    Chat_details_group,
    Chat_details_binome
  },
  props: {
    userData: {
      type: Object,
      required: false,
      default: () => ({ chats_binome: [], chats_group: [] })
    }
  },
  setup(props) {
    const selectedChatType = ref(null);
    const details_grp = ref(null);

    const chatIds = ref([]);
    const chats = reactive({});
    const selectedChat = ref(null);
    const messages = ref([]);
    const newMessage = ref('');
    const users = reactive({});
    const currentUser = firebase.auth().currentUser;

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
      try {
        for (const chatId of chatIds.value) {
          const chatRef = projectFirestore.collection(selectedChatType.value === 'solo' ? 'messages_binome' : 'messages_group').doc(chatId);
          chatRef.onSnapshot(chatDoc => {
            if (chatDoc.exists) {
              chats[chatId] = { id: chatId, ...chatDoc.data() };
              sortChats();
            }
          });
        }
      } catch (error) {
        console.error("Error fetching chats: ", error);
      }
    };

    const sortChats = () => {
      chatIds.value.sort((a, b) => {
        const timeA = chats[a]?.last_message_timestamp?.toMillis?.() || 0;
        const timeB = chats[b]?.last_message_timestamp?.toMillis?.() || 0;
        return timeB - timeA;
      });
    };

    const sortedChatIds = computed(() => {
      return chatIds.value.slice().sort((a, b) => {
        const timeA = chats[a]?.last_message_timestamp?.toMillis?.() || 0;
        const timeB = chats[b]?.last_message_timestamp?.toMillis?.() || 0;
        return timeB - timeA;
      });
    });

    const getLastMessage_text = (chatId) => {
      return chats[chatId] ? chats[chatId].last_message_text : null;
    };

    const getLastMessage_timestamp = (chatId) => {
      const time = chats[chatId]?.last_message_timestamp?.toMillis?.();
      if (!time) return null;

      const date = new Date(time);
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      const hours = ('0' + date.getHours()).slice(-2);
      const minutes = ('0' + date.getMinutes()).slice(-2);
      const seconds = ('0' + date.getSeconds()).slice(-2);

      const fullDateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      return fullDateString;
    };
    const  id_to_pass=ref("");
    const comp_to_show=ref("");
    const change_cred = (comp,id)=>{
      id_to_pass.value= id;
      comp_to_show.value=comp;
      console.log("here is id",id_to_pass.value,comp_to_show.value,comp_to_show==='binome');
    };
    const getLastMessage_user = (chatId) => {
      return getUserName(chats[chatId]?.last_message_sender) || null;
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
        selectedChat.value = { id: chatId, ...chatDoc.data() };
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
          sender: currentUser.uid,
          text: newMessage.value,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          viewed: false
        };
        await projectFirestore.collection(`${selectedChatType.value === 'solo' ? 'messages_binome' : 'messages_group'}/${selectedChat.value.id}/list_mess`).add(message);
        newMessage.value = '';
      }
    };

    const getChatDisplayName = (chat) => {
      if (!chat) return 'Unnamed Chat';
      const otherUserId = chat.creator_id === currentUser.uid ? chat.other_id : chat.creator_id;
      return getUserName(otherUserId) || 'Unnamed Chat';
    };
    const check_comp_to_show=(comp)=>{
      return comp===comp_to_show.value;
    }
    const show_details_grp = (chatId) => {
      details_grp.value = chatId;
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
      getMessages,
      getUserName,
      selectChat,
      sendMessage,
      getLastMessage_text,
      getLastMessage_timestamp,
      getChatDisplayName,
      getLastMessage_user,
      show_details_grp,
      details_grp,
      sortedChatIds,
      change_cred,
      check_comp_to_show
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
