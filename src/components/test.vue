<template>
    LOGGED IN merci hh {{ user.uid }}
    <p>Email: {{ user.email }}</p>
    <p>Sign-in time: {{ user.metadata.lastSignInTime }}</p>
    <p>Creation time: {{ user.metadata.creationTime }}</p>
</template>

<script>
import {getUser} from './UserState'
export default{
    data(){
        return {
            user:null
        }
    },
    beforeMount(){
        this.user=getUser();
    }
    
}

</script>
