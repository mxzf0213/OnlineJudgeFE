<template>

</template>

<script>
  import api from '@oj/api'
  import { mapActions } from 'vuex'
  export default {
    name: 'Oauth',
    mounted () {
      this.init()
    },
    data () {
      return {
        accessToken: ''
      }
    },
    methods: {
      ...mapActions(['getProfile']),
      init () {
        let query = this.$route.query
        this.accessToken = query.access_token
        this.oauthLogin()
      },
      oauthLogin () {
        api.oauthLogin(this.accessToken).then(res => {
          this.getProfile()
          this.$success('login success')
          this.$router.push({name: 'home'})
        }, res => {
          this.$error('login failed')
        })
      }
    }
  }
</script>

<style scoped>

</style>
