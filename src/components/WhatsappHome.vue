<template>
<div>
    <nav class="navbar professional">
      <p @click="goto_profile" :class="{ 'active': go }">Profile</p>
    </nav>
    <profile v-if="go"/>
  </div>
</template>

<script>
    import profile from "@/components/profile.vue"

    export default {
        name: "whatsappHome",
        components: {
            profile
        }
    }
</script>
