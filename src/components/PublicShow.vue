<template>
    <div class="public-groups-wrapper">
      <h3>Public Groups</h3>
      <div v-if="publicGroups.length">
        <div v-for="group in publicGroups" :key="group.id" class="group-item">
          <h4>{{ group.group_name }}</h4>
          <p>{{ group.last_message_text }}</p>
          <button @click="joinGroup(group.id)" v-if="!isUserInGroup(group.id)">
            Join Group
          </button>
        </div>
      </div>
      <div v-else>
        <p>No public groups available.</p>
      </div>
    </div>
  </template>
  
  <script>
  import { projectFirestore } from '../firebase/config';
  import { getUser } from './UserState';
  
  export default {
    name: 'PublicGroups',
    data() {
      return {
        publicGroups: [],
      };
    },
    async created() {
      await this.fetchPublicGroups();
    },
    methods: {
      async fetchPublicGroups() {
        const groupsRef = projectFirestore.collection('messages_group');
        const querySnapshot = await groupsRef.where('public', '==', true).get();
  
        this.publicGroups = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      },
      isUserInGroup(groupId) {
        const user = getUser();
        return this.publicGroups.some(
          (group) =>
            group.id === groupId && group.members && group.members.includes(user.uid)
        );
      },
      async joinGroup(groupId) {
        try {
          const user = getUser();
          const groupRef = projectFirestore.collection('messages_group').doc(groupId);
          const groupDoc = await groupRef.get();
          const groupData = groupDoc.data();
  
          if (!groupData.members.includes(user.uid)) {
            const updatedMembers = [...groupData.members, user.uid];
            await groupRef.update({
              members: updatedMembers,
            });
  
            const userRef = projectFirestore.collection('users').doc(user.uid);
            const userDoc = await userRef.get();
            const userGroups = userDoc.data().chats_group || [];
            userGroups.push(groupId);
            await userRef.update({
              chats_group: userGroups,
            });
  
            // Refresh the group list to update the button state
            await this.fetchPublicGroups();
          }
        } catch (error) {
          console.error('Error joining group:', error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .public-groups-wrapper {
    margin: 20px;
    padding: 20px;
    background: #f5f5f5;
    border-radius: 10px;
  }
  
  .group-item {
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  
  button {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>