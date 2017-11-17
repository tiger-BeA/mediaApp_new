<template>
  <div class="m-setup">
    <mt-button @click="fLoginOut()">退出登录</mt-button>
  </div>
</template>

<script type="text/ecmascript-6">
  import {Button} from 'mint-ui';
  import router from '../../router';
  export default {
    methods: {
      fLoginOut: function () {
        this.$cookie.delete('user');
        router.push('/login');
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
</style>
