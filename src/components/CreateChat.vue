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

    <div v-if="selectedUsers.length>0">
      <h4>Selected Users</h4>
      <ul>
        <li v-for="user in selectedUsers" :key="user.id">{{ user.user_name }}</li>
      </ul>
    </div>

    <div v-if="chatType === 'binome' && selectedUsers.length > 0">
      <h4>Selected User for Binome Chat</h4>
      <p>{{ selectedUsers[0].user_name }}</p>
      <input
        type="text"
        placeholder="Binome chat input"
        v-model="text_to_send"
      />  
    </div>
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
      Groupchat Name
      <input
        type="text"
        v-model="groupName"
        placeholder="Enter group name"
        required
      />
    </div>
    <button @click="submitChat" v-if="selectedUsers.length > 0">Submit</button>
    
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
      groupName: '', 
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
      console.log('Creating group chat with name:', this.groupName, 'and users:', this.selectedUsers);

      const groupChatRef = await projectFirestore.collection('messages_group').add({
        group_name: this.groupName,
        members: [...this.selectedUsers.map(user => user.id), creatorId],
        created_at: Date.now(),
        creator_id: creatorId,
        last_message: {
          sender: creatorId,
          text: this.text_to_send,
          timestamp: Date.now(),
          viewed_by: [],
        },
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
            last_message: {
              sender: creatorId,
              text: this.text_to_send,
              timestamp: Date.now(),
              viewed: false
            },
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
        this.groupName = '';
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
