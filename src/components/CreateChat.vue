<template>
  <div class="create-chat-wrapper">
    <div class="header">
      <h3>Add a Conversation</h3>
      <div class="chat-type-selector">
        <label>
          <input type="radio" v-model="chatType" value="group" /> Group Chat
        </label>
        <label>
          <input type="radio" v-model="chatType" value="binome" /> Binome Chat
        </label>
      </div>
    </div>
    <div class="search-bar">
      <input
        type="text"
        v-model="searchTerm"
        @input="searchUsers"
        placeholder="Search users by username..."
      />
    </div>
    <ul class="user-list">
      <li v-for="user in filteredUsers" :key="user.id" class="user-item">
        <div class="user-info">
          <p class="username">{{ user.user_name }}</p>
          <p class="email">{{ user.email }}</p>
        </div>
        <button @click="toggleUser(user)" class="toggle-user-button">
          {{ isUserSelected(user.id) ? 'Remove from' : 'Add to' }} {{ chatType === 'group' ? 'Group' : 'Binome' }} Chat
        </button>
      </li>
    </ul>
    <div v-if="chatType === 'group' && selectedUsers.length > 0" class="selected-users">
      <h4>Selected Users for Group Chat</h4>
      <ul>
        <li v-for="user in selectedUsers" :key="user.id">{{ user.user_name }}</li>
      </ul>
    </div>
    <div v-if="chatType === 'binome' && selectedUsers.length > 0" class="selected-users">
      <h4>Selected User for Binome Chat</h4>
      <p>{{ selectedUsers[0].user_name }}</p>
    </div>
    <button @click="submitChat" v-if="selectedUsers.length > 0" class="submit-button">Submit</button>
  </div>
</template>

<script>
import { projectFirestore } from '../firebase/config';

export default {
  name: 'CreateChat',
  data() {
    return {
      searchTerm: '',
      users: [],
      filteredUsers: [],
      selectedUsers: [],
      chatType: 'group', // Default to group chat
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
        if (this.chatType === 'group') {
          console.log('Creating group chat with users:', this.selectedUsers);
          // Add the logic to handle creating a group chat with selected users
        } else {
          console.log('Creating binome chat with user:', this.selectedUsers[0]);
          // Add the logic to handle creating a binome chat with the selected user
        }
        // Clear the selection after submission
        this.selectedUsers = [];
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
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 20px;
  max-width: 600px;
  margin: 0 auto;
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
  color: #333;
}

/* Chat type selector styles */
.chat-type-selector {
  display: flex;
  gap: 10px;
}

.chat-type-selector label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 1rem;
  color: #555;
}

/* Search bar styles */
.search-bar {
  margin-bottom: 15px;
}

.search-bar input[type="text"] {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  outline: none;
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
  border-bottom: 1px solid #ddd;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
}

.email {
  font-size: 0.9rem;
  color: #555;
  margin: 0;
}

.toggle-user-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 24px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.toggle-user-button:hover {
  background-color: #0056b3;
}

/* Selected users section styles */
.selected-users {
  margin-top: 20px;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.selected-users h4 {
  margin: 0 0 10px 0;
  font-size: 1.2rem;
  color: #333;
}

/* Submit button styles */
.submit-button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 20px;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #218838;
}
</style>
