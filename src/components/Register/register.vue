<template>
  <el-row>
    <label for="phone">手机号</label>
    <input id="phone" class="m-input m-input-phone" v-model="phone" placeholder="请输入手机号"/><br>
    <label for="code">验证码</label>
    <input id="code" class="m-input m-input-code" v-model="code" placeholder="短信验证码"/>
  </el-row>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        phone: '',
        code: ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "register";
</style>
