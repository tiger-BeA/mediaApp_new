<template>
  <mt-tabbar v-model="selected" fixed>
    <mt-tab-item id="首页">
      <i class="icon icon-home"></i><span class="tlt">首页</span>
    </mt-tab-item>
    <mt-tab-item id="更多信息">
      <i class="icon icon-more"></i><span class="tlt">更多信息</span>
    </mt-tab-item>
    <mt-tab-item id="媒体地图">
      <i class="icon icon-map"></i><span class="tlt">媒体地图</span>
    </mt-tab-item>
    <mt-tab-item id="我的">
      <i class="icon icon-user"></i><span class="tlt">我的</span>
    </mt-tab-item>
  </mt-tabbar>
</template>
<script>
  import bus from '../bus.vue'

  export default {
    data() {
      return {
        selected: ''
      }
    },
    watch: {
      'selected': function() {
        bus.$emit('selected', this.selected);
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "footer";
</style>


