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
      <button @click="returnToHome" class="home-button">Return to Home</button>
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
      returnToHome() {
        this.$router.push('/WhatsappHome');
      },
    },
  };
  </script>
  
  <style scoped>
  .public-groups-wrapper {
    margin: 20px;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  h3 {
    color: #333;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .group-item {
    padding: 15px;
    margin-bottom: 15px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: #f9f9f9;
  }
  
  .group-item h4 {
    margin: 0 0 10px;
    font-size: 18px;
    color: #007bff;
  }
  
  .group-item p {
    margin: 0 0 10px;
    font-size: 14px;
    color: #555;
  }
  
  button {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  .home-button {
    display: block;
    width: 100%;
    margin-top: 20px;
    background-color: #2a3047;
  }
  
  .home-button:hover {
    background-color: #1e0d3f;
  }
  </style>
  