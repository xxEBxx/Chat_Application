<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-200">
    <div class="p-5 bg-gray-100 rounded-lg shadow-lg shadow-opacity-50 max-w-md w-full">
      <h3 class="text-2xl font-bold text-gray-700 mb-4">Create a Public Group Chat</h3>
      <input
        type="text"
        v-model="group_name"
        placeholder="Group name"
        class="w-full p-3 mb-4 border border-gray-300 rounded-full bg-gray-200 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500"
      />
      <input
        type="text"
        v-model="text_to_send"
        placeholder="Enter first message"
        class="w-full p-3 mb-4 border border-gray-300 rounded-full bg-gray-200 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500"
      />
      <button
        @click="submitGroupChat"
        class="w-full mt-4 px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-700 focus:outline-none"
      >
        Create Group Chat
      </button>
      <button
        @click="cancelCreation"
        class="w-full mt-4 px-5 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 focus:outline-none"
      >
        Cancel
      </button>
    </div>
  </div>
</template>

<style scoped>
.create-group-chat-wrapper {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
</style>

<script>
import { projectFirestore } from '../firebase/config';
import { getUser } from './UserState';
import { useRouter } from 'vue-router';

export default {
  name: 'CreateGroupChat',
  data() {
    return {
      group_name: '',
      text_to_send: '',
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {
    async submitGroupChat() {
      try {
        const creatorId = getUser().uid;
        const usersRef = projectFirestore.collection('users');
        const querySnapshot = await usersRef.where('public', '==', true).get();

        const publicUsers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const groupChatRef = await projectFirestore.collection('messages_group').add({
          group_name: this.group_name,
          members: [...publicUsers.map((user) => user.id), creatorId],
          created_at: Date.now(),
          creator_id: creatorId,
          last_message_sender: creatorId,
          last_message_text: this.text_to_send,
          last_message_timestamp: Date.now(),
          public: true,
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
        for (let user of publicUsers) {
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

        await this.sendNotifications(
          publicUsers.map((user) => user.id),
          'New public group chat created: ' + this.text_to_send,
          this.group_name
        );

        this.router.push('/WhatsappHome');
      } catch (error) {
        console.error('Error creating group chat:', error);
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
      this.router.push('/WhatsappHome');
    },
  },
};
</script>
  

  