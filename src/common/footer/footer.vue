<template>
  <el-row type="flex" align="middle">
    <el-col :span="6">
      <router-link to="/home"><i class="icon icon-home"></i>首页</router-link>
    </el-col>
    <el-col :span="6">
      <router-link to="/more"><i class="icon icon-more"></i>更多信息</router-link>
    </el-col>
    <el-col :span="6">
      <router-link to="/map"><i class="icon icon-map"></i>媒体地图</router-link>
    </el-col>
    <el-col :span="6">
      <router-link to="/user"><i class="icon icon-user"></i>我的</router-link>
    </el-col>
  </el-row>
</template>
<script>
  export default {}
</script>

<style lang="scss" scoped>
  @import "footer";
</style>


