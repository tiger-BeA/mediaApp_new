<template>
  <div class="app">
    <v-header></v-header>
    <v-main></v-main>
    <v-footer></v-footer>
  </div>
</template>

<script>
  import footer from './common/footer/footer.vue'
  import header from './common/header/header.vue'
  import main from './common/main/main.vue'

  export default {
    components: {
      'v-footer': footer,
      'v-header': header,
      'v-main': main,
    }
  }
</script>

<style lang="scss">
  @import "./assets/css/fonts.css";

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
  .f-hide {
    display: none!important;
  }
</style>
