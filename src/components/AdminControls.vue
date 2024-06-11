<template>
  <div class="admin-controls mt-4">
    <h3 v-if="isAdmin" class="text-lg font-semibold">Admin Controls</h3>
    <h3 v-else class="text-lg font-semibold">Group Participants</h3>
    <div v-for="user in users" :key="user.id" class="user-item flex justify-between items-center py-2 border-b border-gray-300">
      <p>{{ user.name }}</p>
      <button v-if="isAdmin && user.id !== currentUser.uid" @click="removeUser(user.id)" class="remove-button px-4 py-2 bg-red-500 text-white rounded">Remove</button>
    </div>
    <div v-if="isAdmin" class="add-user mt-4">
      <input v-model="newUserEmail" @input="searchUsers" placeholder="Add user by email" class="add-user-input px-4 py-2 border rounded w-full" />
      <ul v-if="suggestedUsers.length" class="suggested-users absolute top-10 w-full border rounded bg-white mt-2 max-h-40 overflow-y-auto shadow-lg">
        <li v-for="suggestedUser in suggestedUsers" :key="suggestedUser.id" @click="selectUser(suggestedUser)" class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
          {{ suggestedUser.email }}
        </li>
      </ul>
      <button @click="addUser" class="add-button mt-2 px-4 py-2 bg-blue-500 text-white rounded">Add</button>
    </div>
    <button @click="returnToChat" class="return-button mt-4 px-4 py-2 bg-gray-500 text-white rounded">Return to Chat</button>
  </div>
</template>

<script>
import { projectFirestore } from '@/firebase/config.js';
import firebase from 'firebase/app';
import { ref, onMounted } from 'vue';
import router from '@/router';
import debounce from 'lodash.debounce';

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
    const suggestedUsers = ref([]);
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

    const searchUsers = debounce(async () => {
      try {
        if (newUserEmail.value.trim()) {
          const usersRef = await projectFirestore.collection('users')
            .where('email', '>=', newUserEmail.value.trim())
            .where('email', '<=', newUserEmail.value.trim() + '\uf8ff')
            .get();
          suggestedUsers.value = usersRef.docs.map(doc => ({ id: doc.id, email: doc.data().email }));
        } else {
          suggestedUsers.value = [];
        }
      } catch (error) {
        console.error('Error searching users:', error);
      }
    }, 300);

    const selectUser = (user) => {
      newUserEmail.value = user.email;
      suggestedUsers.value = [];
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
                await projectFirestore.collection('users').doc(userId).update({
                  chats_group: firebase.firestore.FieldValue.arrayUnion(props.chatId)
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

          const userRef = projectFirestore.collection('users').doc(userId);
          const userDoc = await userRef.get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            const updatedChatsGroup = userData.chats_group.filter(chatId => chatId !== props.chatId);
            await userRef.update({
              chats_group: updatedChatsGroup
            });
          }

          await fetchMessagesGroup();
        } else {
          console.error(`No chat found with id: ${props.chatId}`);
        }
      } catch (error) {
        console.error('Error removing user:', error);
      }
    };

    const returnToChat = () => {
      router.push('/whatsappHome');
    };

    onMounted(fetchMessagesGroup);

    return {
      users,
      removeUser,
      addUser,
      newUserEmail,
      suggestedUsers,
      isAdmin,
      currentUser,
      returnToChat,
      searchUsers,
      selectUser
    };
  }
};
</script>

<style scoped>
.add-user {
  position: relative;
}

.suggested-users {
  z-index: 10;
}
</style>
