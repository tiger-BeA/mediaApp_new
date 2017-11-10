<template>
  <div class="m-user">
    <mt-cell title="更改个人信息" @click.native="fSelected('个人信息')">
      <i slot="icon" class="u-icon icon-clock"></i>
    </mt-cell>
    <mt-cell title="投诉与反馈" @click.native="fSelected('投诉与反馈')">
      <i slot="icon" class="u-icon icon-service"></i>
    </mt-cell>
    <mt-cell title="我的收藏" @click.native="fSelected('我的收藏')">
      <i slot="icon" class="u-icon icon-star"></i>
    </mt-cell>
    <mt-cell title="浏览历史" @click.native="fSelected('浏览历史')">
      <i slot="icon" class="u-icon icon-history"></i>
    </mt-cell>
    <mt-cell title="设置" @click.native="fSelected('设置')">
      <i slot="icon" class="u-icon icon-setup"></i>
    </mt-cell>
    <mt-cell title="联系媒体村" @click.native="fSelected('联系媒体村')">
      <i slot="icon" class="u-icon icon-chat"></i>
    </mt-cell>
  </div>
</template>

<script type="text/ecmascript-6">
  import bus from '../../common/bus.vue'

  export default {
    methods: {
      fSelected: function(tlt) {
        bus.$emit('selected', tlt);
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "user";
</style>
