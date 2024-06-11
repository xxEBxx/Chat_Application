<template>
    <div class="create-group-chat-wrapper">
      <h3>Create a Group Chat</h3>
      <input
        type="text"
        v-model="group_name"
        placeholder="Group name"
        class="message-input"
      />
      <input
        type="text"
        v-model="text_to_send"
        placeholder="Enter first message"
        class="message-input"
      />
      <button @click="submitGroupChat" class="submit-button">Create Group Chat</button>
    </div>
  </template>
  
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
    },
  };
  </script>
  
  <style scoped>
  .create-group-chat-wrapper {
    margin: 20px;
    padding: 20px;
    background: #f5f5f5;
    border-radius: 10px;
  }
  
  .message-input {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  
  .submit-button {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    cursor: pointer;
    margin-right: 10px;
  }
  
  .submit-button:hover {
    background-color: #0056b3;
  }
  </style>