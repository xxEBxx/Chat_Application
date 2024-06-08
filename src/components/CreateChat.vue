// src/components/UserSearch.vue
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
        <button @click="addChat(user.id)">Add to {{ chatType === 'group' ? 'Group' : 'Binome' }} Chat</button>
      </li>
    </ul>
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
    async addChat(userId) {
      try {
        const user = await projectFirestore.collection('users').doc(userId).get();

        if (this.chatType === 'group') {
          // Logic to add user to group chat
          console.log(`Adding user ${userId} to group chat`);
          // Add the logic to handle adding the user to a group chat
        } else {
          // Logic to create or add to binome chat
          console.log(`Adding user ${userId} to binome chat`);
          // Add the logic to handle creating or adding to a binome chat
        }
      } catch (error) {
        console.error('Error adding user to chat:', error);
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
