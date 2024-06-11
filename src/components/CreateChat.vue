<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-200">
    <div class="p-5 bg-gray-100 rounded-lg shadow-lg shadow-opacity-50 max-w-md w-full">
      <h3 class="text-2xl font-bold text-gray-700 mb-4">Add a Conversation</h3>
      <div class="flex justify-around mb-4">
        <label class="flex items-center cursor-pointer">
          <input type="radio" v-model="chatType" value="group" class="hidden" />
          <i :class="['bi bi-people text-2xl', {'text-gray-700 font-bold': chatType === 'group', 'text-gray-400': chatType !== 'group'}]" @click="chatType = 'group'"></i>
        </label>
        <label class="flex items-center cursor-pointer">
          <input type="radio" v-model="chatType" value="binome" @change="fetchExistingChats" class="hidden" />
          <i :class="['bi bi-person text-2xl', {'text-gray-700 font-bold': chatType === 'binome', 'text-gray-400': chatType !== 'binome'}]" @click="chatType = 'binome'"></i>
        </label>
      </div>
      <input
        type="text"
        v-model="searchTerm"
        @input="searchUsers"
        placeholder="Search users by username..."
        class="w-full p-3 mb-4 border border-gray-300 rounded-full bg-gray-200 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500"
      />
      <div v-if="filteredUsers.length" class="bg-white rounded-lg shadow-md shadow-opacity-50 mb-4">
        <div v-for="(user, index) in filteredUsers.slice(0, 3)" :key="user.id" class="flex items-center p-3 border-b border-gray-300">
          <img :src="user.image" alt="Profile Picture" class="w-10 h-10 rounded-full mr-3" />
          <div class="flex-1">
            <p class="text-gray-700 font-semibold">{{ user.user_name }}</p>
            <p class="text-gray-500">{{ user.email }}</p>
          </div>
          <button
            v-if="!hasExistingChat(user.id) || chatType === 'group'"
            @click="toggleUser(user)"
            class="ml-3 px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-700 focus:outline-none"
          >
            {{ isUserSelected(user.id) ? '-' : '+' }}
          </button>
        </div>
      </div>
      <input
        type="text"
        v-model="text_to_send"
        placeholder="Enter first message"
        class="w-full p-3 mb-4 border border-gray-300 rounded-full bg-gray-200 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500"
      />
      <div v-if="chatType === 'group' && selectedUsers.length > 0">
        <input
          type="text"
          v-model="group_name"
          placeholder="Group name"
          class="w-full p-3 mb-4 border border-gray-300 rounded-full bg-gray-200 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500"
        />
        <h4 class="text-lg font-semibold text-gray-700 mb-2">Selected Users for Group Chat</h4>
        <div class="bg-white rounded-lg shadow-md shadow-opacity-50">
          <div v-for="(user, index) in selectedUsers" :key="user.id" class="flex items-center p-3 border-b border-gray-300">
            <img :src="user.image" alt="Profile Picture" class="w-10 h-10 rounded-full mr-3" />
            <div>
              <p class="text-gray-700 font-semibold">{{ user.user_name }}</p>
              <p class="text-gray-500">{{ user.email }}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-if="chatType === 'binome' && selectedUsers.length > 0">
        <h4 class="text-lg font-semibold text-gray-700 mb-2">Selected User for Binome Chat</h4>
        <div class="bg-white rounded-lg shadow-md shadow-opacity-50">
          <div class="flex items-center p-3">
            <img :src="selectedUsers[0].image" alt="Profile Picture" class="w-10 h-10 rounded-full mr-3" />
            <div>
              <p class="text-gray-700 font-semibold">{{ selectedUsers[0].user_name }}</p>
            </div>
          </div>
        </div>
      </div>
      <button
        @click="submitChat"
        v-if="chatType === 'binome' && selectedUsers.length > 0"
        class="w-full mt-4 px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-700 focus:outline-none"
      >
        Submit
      </button>
      <button
        @click="submitChat"
        v-if="chatType === 'group' && selectedUsers.length > 1"
        class="w-full mt-4 px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-700 focus:outline-none"
      >
        Submit
      </button>
      <button
        @click="cancelCreation"
        class="w-full mt-4 px-5 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 focus:outline-none"
      >
        Cancel
      </button>

      <!-- Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-5 rounded-lg shadow-lg text-center">
          <h3 class="text-xl font-semibold mb-4">Chat Already Exists</h3>
          <p class="mb-4">You already have a binome chat with this user.</p>
          <button @click="closeModal" class="px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-700 focus:outline-none">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import { projectFirestore } from '../firebase/config';
import { getUser } from './UserState';
import { useRouter } from 'vue-router';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default {
  name: 'CreateChat',
  data() {
    return {
      searchTerm: '',
      users: [],
      filteredUsers: [],
      selectedUsers: [],
      chatType: 'group',
      group_name: '',
      text_to_send: '',
      existingChats: [],
      showModal: false,
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {
    async searchUsers() {
      if (this.searchTerm.trim() === '') {
        this.filteredUsers = [];
        return;
      }

      const usersRef = projectFirestore.collection('users');
      const querySnapshot = await usersRef.get();

      this.users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      this.filteredUsers = this.users.filter((user) =>
        user.user_name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );

      if (this.chatType === 'binome') {
        await this.fetchExistingChats();
      }
    },
    isUserSelected(userId) {
      return this.selectedUsers.some((user) => user.id === userId);
    },
    hasExistingChat(userId) {
      return this.existingChats.includes(userId);
    },
    toggleUser(user) {
      if (this.isUserSelected(user.id)) {
        this.removeChat(user.id);
      } else {
        this.addChat(user);
      }
    },
    addChat(user) {
      if (this.chatType === 'group') {
        this.selectedUsers.push(user);
      } else {
        if (this.selectedUsers.length === 0) {
          this.selectedUsers.push(user);
        } else {
          this.selectedUsers = [user];
        }
      }
    },
    removeChat(userId) {
      this.selectedUsers = this.selectedUsers.filter((user) => user.id !== userId);
    },
    async fetchExistingChats() {
      const creatorId = getUser().uid;
      const existingChatsSnapshot = await projectFirestore
        .collection('messages_binome')
        .where('participants', 'array-contains', creatorId)
        .get();

      this.existingChats = [];
      existingChatsSnapshot.forEach((doc) => {
        const data = doc.data();
        data.participants.forEach((participant) => {
          if (participant !== creatorId) {
            this.existingChats.push(participant);
          }
        });
      });
    },
    async submitChat() {
      try {
        const creatorId = getUser().uid;

        if (this.chatType === 'group') {
          console.log("Creating group chat...");
          const groupChatRef = await projectFirestore.collection('messages_group').add({
            group_name: this.group_name,
            members: [...this.selectedUsers.map((user) => user.id), creatorId],
            created_at: Date.now(),
            creator_id: creatorId,
            last_message_sender: creatorId,
            public:false,
            last_message_text: this.text_to_send,
            last_message_timestamp: Date.now(),
            last_message_viewed_by: [],
            list_mess: [
              {
                sender: creatorId,
                text: this.text_to_send,
                timestamp: Date.now(),
                viewed_by: [],
              },
            ],
          });

          const groupId = groupChatRef.id;

          const batch = projectFirestore.batch();
          for (let user of this.selectedUsers) {
            const userRef = projectFirestore.collection('users').doc(user.id);
            const updatedData = await userRef.get();
            const updatedChats = updatedData.data().chats_group || [];
            updatedChats.push(groupId);
            batch.update(userRef, { chats_group: updatedChats });
          }

          const creatorRef = projectFirestore.collection('users').doc(creatorId);
          const creatorData = await creatorRef.get();
          const creatorChats = creatorData.data().chats_group || [];
          creatorChats.push(groupId);
          batch.update(creatorRef, { chats_group: creatorChats });

          await batch.commit();
          console.log("Group chat created successfully.");

          await this.sendNotifications(
            this.selectedUsers.map((user) => user.id),
            'New group chat created: ' + this.text_to_send,
            this.group_name
          );
          console.log("Notifications sent.");
          this.router.push('/WhatsappHome');
        } else {
          console.log("Creating binome chat...");
          const otherUser = this.selectedUsers[0].id;

          const otherUserRef = projectFirestore.collection('users').doc(otherUser);
          const otherUserData = await otherUserRef.get();
          const otherUserChats = otherUserData.data().chats_binome || [];

          const creatorRef = projectFirestore.collection('users').doc(creatorId);
          const creatorData = await creatorRef.get();
          const creatorChats = creatorData.data().chats_binome || [];

          // Compare chat lists
          const commonChat = otherUserChats.some((chatId) => creatorChats.includes(chatId));

          if (commonChat) {
            this.showModal = true;
            console.log("Binome chat already exists.");
          } else {
            const binomeChatRef = await projectFirestore.collection('messages_binome').add({
              creator_id: creatorId,
              other_id: otherUser,
              last_message_sender: creatorId,
              last_message_text: this.text_to_send,
              last_message_timestamp: Date.now(),
              last_message_viewed: false,
              
              list_mess: [
                {
                  sender: creatorId,
                  text: this.text_to_send,
                  timestamp: Date.now(),
                  viewed: false,
                },
              ],
            });

            const chatId = binomeChatRef.id;

            await creatorRef.update({
              chats_binome: [...creatorChats, chatId],
            });

            await otherUserRef.update({
              chats_binome: [...otherUserChats, chatId],
            });

            const creatorDoc = await creatorRef.get();
            const creatorUsername = creatorDoc.data().user_name;

            await this.sendNotifications(
              [otherUser],
              'New binome chat created: ' + this.text_to_send,
              creatorUsername
            );

            console.log("Binome chat created successfully.");
            this.router.push('/WhatsappHome');
          }
        }
      } catch (error) {
        console.error('Error creating chat:', error);
      }
    },
    async sendNotifications(userIds, message, chatName) {
      try {
        for (const userId of userIds) {
          const userRef = projectFirestore.collection('users').doc(userId);
          const userDoc = await userRef.get();
          const notifications = userDoc.data().notifications || [];

          notifications.push({
            message: message,
            chatname: chatName,
            timestamp: Date.now(),
            status: 'unread',
          });

          await userRef.update({ notifications });
        }
      } catch (error) {
        console.error('Error sending notifications:', error);
      }
    },
    cancelCreation() {
      this.searchTerm = '';
      this.filteredUsers = [];
      this.selectedUsers = [];
      this.group_name = '';
      this.text_to_send = '';
      this.router.push('/WhatsappHome');
    },
    closeModal() {
      this.showModal = false;
    }
  },
  created() {
    this.fetchExistingChats();
  },
};
</script>

<style scoped>
.create-chat-wrapper {
  margin: 20px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 10px;
}

.chat-type-selector {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.search-input, .message-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.search-results {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 20px;
}

.search-result-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.profile-picture {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.username, .email {
  margin: 0;
  font-size: 0.9rem;
}

.toggle-user-button {
  background-color: #007bff;
  color: black;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
}

.toggle-user-button:hover {
  background-color: #0056b3;
}

.submit-button, .cancel-button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  margin-right: 10px;
}

.submit-button:hover, .cancel-button:hover {
  background-color: #0056b3;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #444;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.close-button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  margin-top: 20px;
}

.close-button:hover {
  background-color: #0056b3;
}
/* Wrapper for the entire component */
.create-chat-wrapper {
  padding: 20px;
  background-color: #2c2c2c;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  max-width: 500px;
  color: #fff;
}

/* Header styles */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #e0e0e0;
}

/* Chat type selector styles */
.chat-type-selector {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.chat-type-selector label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.chat-type-icon {
  width: 40px;
  height: 40px;
  filter: grayscale(100%);
}

/* Search bar styles */
.search-input {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #444;
  border-radius: 24px;
  background-color: #1c1c1c;
  color: #e0e0e0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  outline: none;
  margin-bottom: 15px;
}

/* Search results styles */
.search-results {
  background-color: #3c3c3c;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  margin-bottom: 15px;
}

.search-result-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #444;
}

.profile-picture {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.username {
  font-size: 1.2rem;
  font-weight: bold;
  color: #e0e0e0;
  margin: 0;
}

.email {
  font-size: 0.9rem;
  color: #b0b0b0;
  margin: 0;
}

/* User list styles */
.user-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #444;
  background-color: #3c3c3c;
  margin-bottom: 5px;
  border-radius: 4px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.toggle-user-button {
  background-color: #555;
  color: #e0e0e0;
  border: none;
  padding: 8px 12px;
  border-radius: 24px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 1.2rem;
  line-height: 1;
}

.toggle-user-button:hover {
  background-color: #777;
}

/* Message input styles */
.message-input {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #444;
  border-radius: 24px;
  background-color: #1c1c1c;
  color: #e0e0e0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  outline: none;
  margin-top: 15px;
}

/* Selected users section styles */
.selected-users {
  margin-top: 20px;
  padding: 10px;
  background-color: #3c3c3c;
  border: 1px solid #444;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.selected-users h4 {
  margin: 0 0 10px 0;
  font-size: 1.2rem;
  color: #e0e0e0;
}

/* Submit button styles */
.submit-button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #555;
  color: #e0e0e0;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 20px;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #777;
}

.group-name {
  margin-left: -10px;
}

/* Cancel button styles */
.cancel-button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #444;
  color: #e0e0e0;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

.cancel-button:hover {
  background-color: #666;
}
</style>

