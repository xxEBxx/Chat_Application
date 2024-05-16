<template>
    LOGGED IN merci hh {{ user.uid }}
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
