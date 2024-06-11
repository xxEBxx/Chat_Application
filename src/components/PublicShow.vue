<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-200">
    <div class="p-5 bg-gray-100 rounded-lg shadow-lg shadow-opacity-50 max-w-md w-full">
      <h3 class="text-2xl font-bold text-gray-700 mb-4">Public Groups</h3>
      <div v-if="publicGroups.length">
        <div v-for="group in publicGroups" :key="group.id" class="mb-4 p-4 bg-white rounded-lg shadow-md shadow-opacity-50">
          <h4 class="text-lg font-semibold text-gray-700">{{ group.group_name }}</h4>
          <p class="text-gray-500">{{ group.last_message_text }}</p>
          <button
            @click="joinGroup(group.id)"
            v-if="!isUserInGroup(group.id)"
            class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-700 focus:outline-none"
          >
            Join Group
          </button>
        </div>
      </div>
      <div v-else class="text-gray-700">
        <p>No public groups available.</p>
      </div>
      <button
        @click="returnToHome"
        class="w-full mt-4 px-5 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 focus:outline-none"
      >
        Return to Home
      </button>
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
      returnToHome() {
        this.$router.push('/WhatsappHome');
      },
    },
  };
  </script>
  
  <style scoped>
.public-groups-wrapper {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
</style>
  