<template>
  <div class="admin-controls">
    <h3 v-if="isAdmin">Admin Controls</h3>
    <h3 v-else>Group Participants</h3>
    <div v-for="user in users" :key="user.id" class="user-item">
      <p>{{ user.name }}</p>
      <button v-if="isAdmin && user.id !== currentUser.uid" @click="removeUser(user.id)" class="remove-button">Remove</button>
    </div>
    <div v-if="isAdmin" class="add-user">
      <input v-model="newUserEmail" placeholder="Add user by email" class="add-user-input" />
      <button @click="addUser" class="add-button">Add</button>
    </div>
  </div>
</template>

<script>
import { projectFirestore } from '@/firebase/config.js';
import firebase from 'firebase/app';
import { ref, onMounted } from 'vue';

export default {
  name: 'AdminControls',
  props: {
    chatId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const users = ref([]);
    const newUserEmail = ref('');
    const members = ref([]);
    const currentUser = firebase.auth().currentUser;
    const isAdmin = ref(false);

    const fetchMessagesGroup = async () => {
      try {
        const chatRef = projectFirestore.collection('messages_group').doc(props.chatId);
        const chatDoc = await chatRef.get();
        if (chatDoc.exists) {
          members.value = chatDoc.data().members || [];
          checkIfAdmin();
          await fetchUsers(members.value);
        } else {
          console.error(`No chat found with id: ${props.chatId}`);
        }
      } catch (error) {
        console.error('Error fetching chat data:', error);
      }
    };

    const fetchUsers = async (userIds) => {
      const userPromises = userIds.map(userId => fetchUser(userId));
      const fetchedUsers = await Promise.all(userPromises);
      users.value = fetchedUsers;
    };

    const fetchUser = async (userId) => {
      const userRef = projectFirestore.collection('users').doc(userId);
      const userDoc = await userRef.get();
      return userDoc.exists ? { id: userId, name: userDoc.data().user_name } : { id: userId, name: 'Unknown' };
    };

    const checkIfAdmin = () => {
      isAdmin.value = members.value.includes(currentUser.uid);
    };

    const addUser = async () => {
      try {
        if (newUserEmail.value.trim()) {
          const userRef = await projectFirestore.collection('users').where('email', '==', newUserEmail.value.trim()).get();
          if (!userRef.empty) {
            const userId = userRef.docs[0].id;
            const chatRef = projectFirestore.collection('messages_group').doc(props.chatId);
            const chatDoc = await chatRef.get();
            if (chatDoc.exists) {
              const currentMembers = chatDoc.data().members || [];
              if (!currentMembers.includes(userId)) {
                await chatRef.update({
                  members: firebase.firestore.FieldValue.arrayUnion(userId)
                });
                await fetchMessagesGroup();
                newUserEmail.value = '';
              } else {
                console.error('User already in group');
              }
            } else {
              console.error(`No chat found with id: ${props.chatId}`);
            }
          } else {
            console.error('No user found with that email');
          }
        }
      } catch (error) {
        console.error('Error adding user:', error);
      }
    };

    const removeUser = async (userId) => {
      try {
        const chatRef = projectFirestore.collection('messages_group').doc(props.chatId);
        const chatDoc = await chatRef.get();
        if (chatDoc.exists) {
          await chatRef.update({
            members: firebase.firestore.FieldValue.arrayRemove(userId)
          });

          // Update user data
          const userRef = projectFirestore.collection('users').doc(userId);
          const userDoc = await userRef.get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            const updatedChatsGroup = userData.chats_group.filter(chatId => chatId !== props.chatId);
            await userRef.update({
              chats_group: updatedChatsGroup
            });

            // Alert the removed user
            alertRemovedUser(userData.user_name);
          }

          await fetchMessagesGroup();
        } else {
          console.error(`No chat found with id: ${props.chatId}`);
        }
      } catch (error) {
        console.error('Error removing user:', error);
      }
    };

    const alertRemovedUser = (userName) => {
      // Alert the removed user
      window.alert(`You have been removed from the group chat by the admin.`);
    };

    onMounted(fetchMessagesGroup);

    return {
      users,
      removeUser,
      addUser,
      newUserEmail,
      isAdmin,
      currentUser
    };
  }
};
</script>

<style scoped>
.admin-controls {
  margin-top: 20px;
}

.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.remove-button {
  padding: 5px 10px;
  border: none;
  background-color: #ff4d4d;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.remove-button:hover {
  background-color: #cc0000;
}

.add-user {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.add-user-input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
}

.add-user-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.add-button {
  padding: 10px 15px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
}

.add-button:hover {
  background-color: #0056b3;
}
</style>
