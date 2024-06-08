<template>
  <div>
    <h3>Add a Conversation</h3>
    <div>
      <label>
        <input type="radio" v-model="chatType" value="group" /> Group Chat
      </label>
      <label>
        <input type="radio" v-model="chatType" value="binome" /> Binome Chat
      </label>
    </div>
    <input
      type="text"
      v-model="searchTerm"
      @input="searchUsers"
      placeholder="Search users by username..."
    />
    <ul>
      <li v-for="user in filteredUsers" :key="user.id">
        <p class="username">{{ user.user_name }}</p>
        <p class="email">{{ user.email }}</p>
        <button @click="toggleUser(user)">
          {{ isUserSelected(user.id) ? 'Remove from' : 'Add to' }} {{ chatType === 'group' ? 'Group' : 'Binome' }} Chat
        </button>
      </li>
    </ul>
    <div v-if="chatType === 'group' && selectedUsers.length > 0">
      <h4>Selected Users for Group Chat</h4>
      <ul>
        <li v-for="user in selectedUsers" :key="user.id">{{ user.user_name }}</li>
      </ul>
    </div>
    <div v-if="chatType === 'binome' && selectedUsers.length > 0">
      <h4>Selected User for Binome Chat</h4>
      <p>{{ selectedUsers[0].user_name }}</p>
    </div>
    <button @click="submitChat" v-if="selectedUsers.length > 0">Submit</button>
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
        }
        else{
          this.selectedUsers=[user];
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

<style>
/* Add some basic styling */
input[type="text"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  font-size: 16px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  padding: 10px;
  border-bottom: 1px solid #ccc;
}
.username {
  font-size: 18px;
  font-weight: bold;
}
.email {
  font-size: 14px;
  color: #555;
}
button {
  margin-top: 10px;
}
</style>