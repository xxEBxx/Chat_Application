<template>
  <div class="create-chat-wrapper">
    <h3>Add a Conversation</h3>
    <div class="chat-type-selector">
      <label>
        <input type="radio" v-model="chatType" value="group" />
        <i class="bi bi-people" style="font-size: 2rem; color: white;"></i>    
      </label>
      <label>
        <input type="radio" v-model="chatType" value="binome" @change="fetchExistingChats" />
        <i class="bi bi-person" style="font-size: 2rem; color: white;"></i>    
      </label>
    </div>
    <input
      type="text"
      v-model="searchTerm"
      @input="searchUsers"
      placeholder="Search users by username..."
      class="search-input"
    />
    <div class="search-results" v-if="filteredUsers.length">
      <div
        v-for="(user, index) in filteredUsers.slice(0, 3)"
        :key="user.id"
        class="search-result-item"
      >
        <img :src="user.image" alt="Profile Picture" class="profile-picture" />
        <div>
          <p class="username">{{ user.user_name }}</p>
          <p class="email">{{ user.email }}</p>
          <button @click="toggleUser(user)" class="toggle-user-button" v-if="!hasExistingChat(user.id) || chatType === 'group'">
            {{ isUserSelected(user.id) ? '-' : '+' }}
          </button>
        </div>
      </div>
    </div>
    <input
      type="text"
      v-model="text_to_send"
      placeholder="Enter first message"
      class="message-input"
    />
    <div v-if="chatType === 'group' && selectedUsers.length > 0">
      <input
        type="text"
        v-model="group_name"
        placeholder="Group name"
        class="message-input group-name"
      />
    
      <h4>Selected Users for Group Chat</h4>
      <div class="search-results">
        <div
          v-for="(user, index) in selectedUsers"
          :key="user.id"
          class="search-result-item"
        >
          <img :src="user.image" alt="Profile Picture" class="profile-picture" />
          <div>
            <p class="username">{{ user.user_name }}</p>
            <p class="email">{{ user.email }}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="chatType === 'binome' && selectedUsers.length > 0">
      <h4>Selected User for Binome Chat</h4>
      <div class="search-results">
        <div class="search-result-item">
          <img :src="selectedUsers[0].image" alt="Profile Picture" class="profile-picture" />
          <div>
            <p class="username">{{ selectedUsers[0].user_name }}</p>
          </div>
        </div> 
      </div>     
    </div>
    <button @click="submitChat" v-if="chatType === 'binome' && selectedUsers.length > 0" class="submit-button">Submit</button>
    <button @click="submitChat" v-if="chatType === 'group' && selectedUsers.length > 1" class="submit-button">Submit</button>
  </div>
</template>

<script>
import { projectFirestore } from '../firebase/config';
import { getUser } from './UserState';

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
      text_to_send:'',
      existingChats: []
    };
  },
  methods: {
    async searchUsers() {
      if (this.searchTerm.trim() === '') {
        this.filteredUsers = [];
        return;
      }

      const usersRef = projectFirestore.collection('users');
      const querySnapshot = await usersRef.get();

      this.users = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      this.filteredUsers = this.users.filter(user =>
        user.user_name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    },
    isUserSelected(userId) {
      return this.selectedUsers.some(user => user.id === userId);
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
      this.selectedUsers = this.selectedUsers.filter(user => user.id !== userId);
    },
    async fetchExistingChats() {
      if (this.chatType !== 'binome') {
        this.existingChats = [];
        return;
      }

      const creatorId = getUser().uid;
      const existingChatsSnapshot = await projectFirestore.collection('messages_binome')
        .where('participants', 'array-contains', creatorId)
        .get();

      this.existingChats = [];
      existingChatsSnapshot.forEach(doc => {
        const data = doc.data();
        data.participants.forEach(participant => {
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
          console.log('Creating group chat with name:', this.group_name, 'and users:', this.selectedUsers);

          const groupChatRef = await projectFirestore.collection('messages_group').add({
            group_name: this.group_name,
            members: [...this.selectedUsers.map(user => user.id), creatorId],
            created_at: Date.now(),
            creator_id: creatorId,
            last_message_sender: creatorId,
            last_message_text: this.text_to_send,
            last_message_timestamp: Date.now(),
            last_message_viewed_by: [],
            list_mess: [{
              sender: creatorId,
              text: this.text_to_send,
              timestamp: Date.now(),
              viewed_by: [],
            }],
          });

          const groupId = groupChatRef.id;

          // Update each user's document to include the new group chat ID
          const batch = projectFirestore.batch();
          this.selectedUsers.forEach(async (user) => {
            const userRef = projectFirestore.collection('users').doc(user.id);
            const updatedData = await userRef.get();
            const updatedChats = updatedData.data().chats_group || [];
            const toAddChats = [...updatedChats, groupId];
            batch.update(userRef, {
              chats_group: toAddChats
            });
          });

          const creatorRef = projectFirestore.collection('users').doc(creatorId);
          const creatorData = await creatorRef.get();
          const creatorChats = creatorData.data().chats_group || [];
          const toAddCreatorChats = [...creatorChats, groupId];
          batch.update(creatorRef, {
            chats_group: toAddCreatorChats
          });

          await batch.commit();

          console.log('Group chat created with ID:', groupId);
        } else {
          const creatorId = getUser().uid; 
          const otherUser = this.selectedUsers[0].id;

          // Create a new document in the messages_binome collection
          const binomeChatRef = await projectFirestore.collection('messages_binome').add({
            creator_id: creatorId,
            other_id: otherUser,
            last_message_sender: creatorId,
            last_message_text: this.text_to_send,
            last_message_timestamp: Date.now(),
            last_message_viewed: false,
            list_mess:[{
              sender: creatorId,
              text: this.text_to_send,
              timestamp: Date.now(),
              viewed: false
            }]
          });

          const chatId = binomeChatRef.id;
          const updated_data=await projectFirestore.collection('users').doc(creatorId).get();
          const updated_chats=updated_data.data().chats_binome;
          const to_add_chats=[...updated_chats,chatId];
          
          await projectFirestore.collection('users').doc(creatorId).update({
            chats_binome:to_add_chats
          });

          const updated_data1=await projectFirestore.collection('users').doc(otherUser).get();
          const updated_chats1=updated_data1.data().chats_binome;
          const to_add_chats1=[...updated_chats1,chatId];
          
          await projectFirestore.collection('users').doc(otherUser).update({
            chats_binome:to_add_chats1
          });

          console.log('Binome chat created with ID:', chatId);
        }
        // Clear the selection after submission
        this.selectedUsers = [];
        this.group_name = '';
      } catch (error) {
        console.error('Error submitting chat:', error);
      }
    },
  },
  watch: {
    chatType(newType) {
      if (newType === 'binome') {
        this.fetchExistingChats();
      }
    }
  },
};
</script>

<style scoped>
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

</style>
