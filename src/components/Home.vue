<template>
  <div id="app" class="min-h-screen flex flex-col bg-gray-100">
    <div class="container mx-auto p-6 flex flex-col lg:flex-row">
      <div class="chat-list w-full lg:w-1/3 bg-white rounded-lg shadow-md p-4 space-y-4">
        <div class="flex space-x-2 mb-4">
          <button @click="selectChatType('solo')" :class="{ 'bg-gray-800 text-white': selectedChatType === 'solo' }" class="flex-1 py-2 rounded text-center font-semibold transition duration-300 ease-in-out hover:bg-gray-700">Solo Chats</button>
          <button @click="selectChatType('group')" :class="{ 'bg-gray-800 text-white': selectedChatType === 'group' }" class="flex-1 py-2 rounded text-center font-semibold transition duration-300 ease-in-out hover:bg-gray-700">Group Chats</button>
        </div>
        <div v-if="selectedChatType === 'solo'">
          <h2 class="text-xl font-bold mt-4">Solo Chats</h2>
          <div v-for="chatId in reverseChatIds" :key="chatId" class="chat-item p-4 bg-gray-100 rounded-lg shadow-sm transition duration-300 ease-in-out hover:bg-gray-200 cursor-pointer" @click="change_cred('binome', chatId)">
            <img :src="getChatDisplayimg(chats[chatId])" alt="Profile Picture" class="profile-picture w-10 h-10 rounded-full mr-4">
            <div class="flex-1">
              <h3 class="font-semibold">{{ getChatDisplayName(chats[chatId]) }}</h3>
              <p class="text-sm text-gray-600" v-if="getLastMessage_text(chatId)">
                <strong>{{ getLastMessage_user(chatId) }} :</strong>{{ getLastMessage_text(chatId) }} at {{ getLastMessage_timestamp(chatId) }}
              </p>
            </div>
          </div>
        </div>
        <div v-if="selectedChatType === 'group'">
          <h2 class="text-xl font-bold mt-4">Group Chats</h2>
          <div v-for="chatId in reverseChatIds" :key="chatId" class="chat-item p-4 bg-gray-100 rounded-lg shadow-sm transition duration-300 ease-in-out hover:bg-gray-200 cursor-pointer" @click="change_cred('group', chatId)">
  <h3 class="text-xl font-bold mb-2" v-if="chats[chatId]">{{ chats[chatId].group_name }}</h3> 
  <div v-if="getLastMessage_text(chatId)">
    <p class="text-sm text-gray-600">
      <strong>{{ getLastMessage_user(chatId) }}:</strong> {{ getLastMessage_text(chatId) }}
    </p>
    <p class="text-xs text-gray-500 text-right mt-1">{{ getLastMessage_timestamp(chatId) }}</p>
  </div>
</div>

        </div>
      </div>
      
      <div class="chat-details flex-1 mt-6 lg:mt-0 lg:ml-6 bg-white rounded-lg shadow-md p-4">
        <Chat_details_binome v-if="comp_to_show === 'binome' && id_to_pass" :id="id_to_pass"/>
        <Chat_details_group v-if="comp_to_show === 'group' && id_to_pass" :id="id_to_pass"/>
      </div>
    </div>
  </div>
</template>


<script>
import { projectFirestore } from '@/firebase/config.js';
import firebase from 'firebase/app';
import { reactive, ref, computed, watch, onMounted, onUnmounted } from 'vue';
import Chat_details_group from './Chat_details_group.vue';
import Chat_details_binome from './Chat_details_binome.vue';

export default {
  name: 'Home',
  components: { 
    Chat_details_group,
    Chat_details_binome,
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
    const chatIds = ref([]);
    const chats = reactive({});
    const selectedChat = ref(null);
    const messages = ref([]);
    const newMessage = ref('');
    const users = reactive({});
    const currentUser = firebase.auth().currentUser;
    const id_to_pass = ref("");
    const comp_to_show = ref("");

    const change_cred = (comp, id) => {
      id_to_pass.value = id;
      comp_to_show.value = comp;
      selectChat(id);
    };

    const chatListUnsubscribe = ref(null);

    const setupChatListListener = () => {
      if (chatListUnsubscribe.value) {
        chatListUnsubscribe.value(); // Unsubscribe from previous listener
      }

      const chatType = selectedChatType.value === 'solo' ? 'chats_binome' : 'chats_group';
      const userChatsRef = projectFirestore.collection('users').doc(currentUser.uid);
      
      chatListUnsubscribe.value = userChatsRef.onSnapshot((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          chatIds.value = selectedChatType.value === 'solo' ? userData.chats_binome : userData.chats_group;
          fetchChats();
        }
      });
    };

    const watchUserData = watch(() => props.userData, (newVal) => {
      if (newVal) {
        setupChatListListener();
      }
    }, { immediate: true });

    const reverseChatIds = computed(() => {
      return chatIds.value.slice().sort((a, b) => {
        const chatA = chats[a];
        const chatB = chats[b];
        if (!chatA || !chatB) return 0;
        return chatB.last_message_timestamp - chatA.last_message_timestamp;
      });
    });
    const selectChatType = async (type) => {
      selectedChatType.value = type;
      setupChatListListener();
    };

    const fetchChats = async () => {
      try {
        for (const chatId of chatIds.value) {
          if (!chatId || typeof chatId !== 'string' || chatId.trim() === '') {
            console.error('Invalid chatId:', chatId);
            continue;
          }

          const chatRef = projectFirestore.collection(selectedChatType.value === 'solo' ? 'messages_binome' : 'messages_group').doc(chatId);
          chatRef.onSnapshot(chatDoc => {
            if (chatDoc.exists) {
              chats[chatId] = { id: chatId, ...chatDoc.data() };
            }
          });
        }
      } catch (error) {
        console.error("Error fetching chats: ", error);
      }
    };

    const getLastMessage_text = (chatId) => {
      return chats[chatId] ? chats[chatId].last_message_text : null;
    };

    const getLastMessage_timestamp = (chatId) => {
      const time = chats[chatId].last_message_timestamp;
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

    const getLastMessage_user = (chatId) => {
      return getUserName(chats[chatId].last_message_sender) || null;
    };

    const getMessages = (chatId) => {
      const chat = chats[chatId];
      if (chat && chat.list_mess) {
        return chat.list_mess;
      }
      return null;
    };

    const selectChat = async (chatId) => {
      if (!chatId || typeof chatId !== 'string' || chatId.trim() === '') {
        console.error('Invalid chatId:', chatId);
        return;
      }

      try {
        const chatRef = projectFirestore.collection(selectedChatType.value === 'solo' ? 'messages_binome' : 'messages_group').doc(chatId);
        const chatDoc = await chatRef.get();
        if (chatDoc.exists) {
          selectedChat.value = { id: chatId, ...chatDoc.data() };
          await fetchMessages(chatId);
        }
      } catch (error) {
        console.error('Error selecting chat:', error);
      }
    };

    const fetchMessages = async (chatId) => {
      const messagesRef = projectFirestore.collection(`${selectedChatType.value === 'solo' ? 'messages_binome' : 'messages_group'}/${chatId}/list_mess`).orderBy('timestamp');
      messagesRef.onSnapshot(snapshot => {
        const sortedMessages = snapshot.docs.map(doc => {
          const messageData = doc.data();
          fetchUser(messageData.sender);
          return { id: doc.id, ...messageData };
        }).sort((b, a) => a.last_message_timestamp - b.last_message_timestamp);
        messages.value = sortedMessages;
      });
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
      if (!users[userId]) {
        fetchUser(userId); // Fetch user data if not already fetched
      }
      return users[userId]?.image || '';
    };

    const getChatDisplayName = (chat) => {
      if (!chat) return 'Unnamed Chat';
      const otherUserId = chat.creator_id === currentUser.uid ? chat.other_id : chat.creator_id;
      return getUserName(otherUserId) || 'Unnamed Chat';
    };

    const getChatDisplayimg = (chat) => {
      if (!chat) return '';
      const otherUserId = chat.creator_id === currentUser.uid ? chat.other_id : chat.creator_id;
      return getUserPhoto(otherUserId) || '';
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

    onMounted(() => {
      setupChatListListener();
    });

    onUnmounted(() => {
      if (chatListUnsubscribe.value) {
        chatListUnsubscribe.value(); // Unsubscribe from listener when component unmounts
      }
    });

    return {
      reverseChatIds,
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
      getUserPhoto,
      selectChat,
      sendMessage,
      getLastMessage_text,
      getLastMessage_timestamp,
      getChatDisplayName,
      getChatDisplayimg,
      getLastMessage_user,
      change_cred,
      id_to_pass,
      comp_to_show,
      watchUserData
    };
  }
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
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

.chat-list {
  margin: 0;
  text-align: left;
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.chat-item:hover {
  background-color: #f1f1f1;
}

.chat-details {
  height: 100%;
  padding: 10px;
  overflow-y: auto;
}

.profile-picture {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.create-chat-link {
  text-decoration: none;
}
</style>