<template>
  <div id="app">
    <el-container>
      <el-header style="height: 6rem;">
        <v-header></v-header>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
      <el-footer style="height: 5.5rem;">
        <v-footer></v-footer>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
  import header from './common/header/header'
  import footer from './common/footer/footer'
  export default {
    components: {
      'v-footer': footer,
      'v-header': header
    }
  }
</script>

<style lang="scss">
  * {
    margin: 0;
    padding: 0;
  }

  html,
  body,
  #app {
    height: 100%;
    width: 100%;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }

  html {
    font-size: 24px;
  }

  a {
    text-decoration: none;
  }

  #app {
    & > .el-container {
      height: 100%;
      .el-header,.el-footer{
        width: 100%;
        padding: 0;
      }
      .el-footer {
      }
    }
  }
</style>
