<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-200">
    <div class="mt-5 p-5 bg-gray-100 rounded-lg shadow-lg shadow-opacity-50 max-w-md w-full">
      <h3 v-if="isAdmin" class="text-2xl font-bold text-gray-700">Admin Controls</h3>
      <h3 v-else class="text-2xl font-bold text-gray-700">Group Participants</h3>
      <div v-for="user in users" :key="user.id" class="flex justify-between items-center p-3 border-b border-gray-300">
        <p class="text-gray-600">{{ user.name }}</p>
        <button 
          v-if="isAdmin && user.id !== currentUser.uid" 
          @click="removeUser(user.id)" 
          class="px-4 py-2 bg-white text-red-500 rounded-full hover:bg-gray-300 focus:outline-none">
          Remove
        </button>
      </div>
      <div v-if="isAdmin" class="relative flex items-center mt-4">
        <input 
          v-model="newUserEmail" 
          @input="searchUsers" 
          placeholder="Add user by email" 
          class="flex-grow p-3 border border-gray-300 rounded-full focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
        <ul 
          v-if="suggestedUsers.length" 
          class="absolute top-14 w-full border border-gray-300 rounded-lg bg-white z-10 max-h-36 overflow-y-auto shadow-md shadow-opacity-50 mt-1">
          <li 
            v-for="suggestedUser in suggestedUsers" 
            :key="suggestedUser.id" 
            @click="selectUser(suggestedUser)" 
            class="p-3 cursor-pointer hover:bg-gray-100">
            {{ suggestedUser.email }}
          </li>
        </ul>
        <button 
          @click="addUser" 
          class="ml-3 px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-700 focus:outline-none">
          Add
        </button>
      </div>
      <button 
        @click="returnToChat" 
        class="mt-5 px-5 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 focus:outline-none">
        Return to Chat
      </button>
    </div>
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
    const currentUser = ref(firebase.auth().currentUser);
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

    const checkIfAdmin = async () => {
      try {
        const chatRef = projectFirestore.collection('messages_group').doc(props.chatId);
        const chatDoc = await chatRef.get();
        if (chatDoc.exists) {
          const creatorId = chatDoc.data().creator_id;
          isAdmin.value = creatorId === currentUser.value.uid;
        } else {
          console.error(`No chat found with id: ${props.chatId}`);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
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

                // Update user's chats_group
                const userDocRef = projectFirestore.collection('users').doc(userId);
                await userDocRef.update({
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
      console.log(`User ${userName} has been removed from the group`);
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
