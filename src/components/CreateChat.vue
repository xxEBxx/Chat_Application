<template>
  <div class="create-chat-wrapper">
    <h3>Add a Conversation</h3>
    <div class="chat-type-selector">
      <label>
        <input type="radio" v-model="chatType" value="group" />
        <img src="data:image/png;base64,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" alt="Group Chat" class="chat-type-icon" />
      </label>
      <label>
        <input type="radio" v-model="chatType" value="binome" />
        <img src="data:image/png;base64,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" alt="Solo Chat" class="chat-type-icon" />
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
          <button @click="toggleUser(user)" class="toggle-user-button">
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
      text_to_send:''
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
        messages: [{
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