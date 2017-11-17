<template>
  <div class="app">
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import router from './router'

  export default {
    created() {
      if (!this.$cookie.get('user')) {
        router.push('/register')
      }
    }
  }
</script>

<style lang="scss">
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, .app {
    min-height: 100vh;
  }

  html {
    width: 100%;
    max-width: 750px;
    font-size: 16px;
    overflow-x: hidden;
    overflow-y: auto;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  }

  .app {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .f-hide {
    display: none !important;
  }
</style>
