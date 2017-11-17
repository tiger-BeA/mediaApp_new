<template>
  <div class="m-user">
    <div class="m-user-visitor" v-if="granted == -1">
      <mt-cell title="更改个人信息" @click.native="fRedirect('/register/info')">
        <i slot="icon" class="u-icon icon-clock"></i>
      </mt-cell>
      <mt-cell title="我的收藏" @click.native="fRedirect('/myCollect')">
        <i slot="icon" class="u-icon icon-star"></i>
      </mt-cell>
      <mt-cell title="浏览历史" @click.native="fSelected('浏览历史')">
        <i slot="icon" class="u-icon icon-history"></i>
      </mt-cell>
      <mt-cell title="投诉与反馈" @click.native="fSelected('投诉与反馈')">
        <i slot="icon" class="u-icon icon-service"></i>
      </mt-cell>
      <mt-cell title="设置" @click.native="fSelected('设置')">
        <i slot="icon" class="u-icon icon-setup"></i>
      </mt-cell>
      <mt-cell title="联系媒体村" @click.native="fSelected('联系媒体村')">
        <i slot="icon" class="u-icon icon-chat"></i>
      </mt-cell>
    </div>
    <div class="m-user-agent" v-else-if="granted == 1">
      <mt-cell title="我有新资源" @click.native="fRedirect('/newMedia')">
        <i slot="icon" class="u-icon icon-clock"></i>
      </mt-cell>
      <mt-cell title="我要报备" @click.native="fSelected('首页')">
        <i slot="icon" class="u-icon icon-download"></i>
      </mt-cell>
      <mt-cell title="我的收藏" @click.native="fRedirect('/myCollect')">
        <i slot="icon" class="u-icon icon-star"></i>
      </mt-cell>
      <mt-cell title="浏览历史" @click.native="fSelected('浏览历史')">
        <i slot="icon" class="u-icon icon-history"></i>
      </mt-cell>
      <div class="u-divide"></div>
      <mt-cell title="查看我的媒体" @click.native="fRedirect('/myMedia')">
        <i slot="icon" class="u-icon icon-vip"></i>
      </mt-cell>
      <mt-cell title="查看我的投放" @click.native="fRedirect('/myReport')">
        <i slot="icon" class="u-icon icon-vip"></i>
      </mt-cell>
      <mt-cell title="申请安装摄像头" @click.native="fSelected('申请摄像头')">
        <i slot="icon" class="u-icon icon-vip"></i>
      </mt-cell>
      <div class="u-divide"></div>
      <mt-cell title="投诉与反馈" @click.native="fSelected('投诉与反馈')">
        <i slot="icon" class="u-icon icon-service"></i>
      </mt-cell>
      <mt-cell title="设置" @click.native="fSelected('设置')">
        <i slot="icon" class="u-icon icon-setup"></i>
      </mt-cell>
      <mt-cell title="联系媒体村" @click.native="fSelected('联系媒体村')">
        <i slot="icon" class="u-icon icon-chat"></i>
      </mt-cell>
    </div>
    <div class="m-user-agent" v-else-if="granted == 0">
      <mt-cell title="我要找媒体" @click.native="fSelected('上传资源')">
        <i slot="icon" class="u-icon icon-clock"></i>
      </mt-cell>
      <mt-cell title="查看我的投放" @click.native="fRedirect('/myReport')">
        <i slot="icon" class="u-icon icon-download"></i>
      </mt-cell>
      <mt-cell title="我的收藏" @click.native="fRedirect('/myCollect')">
        <i slot="icon" class="u-icon icon-star"></i>
      </mt-cell>
      <mt-cell title="浏览历史" @click.native="fSelected('浏览历史')">
        <i slot="icon" class="u-icon icon-history"></i>
      </mt-cell>
      <mt-cell title="投诉与反馈" @click.native="fSelected('投诉与反馈')">
        <i slot="icon" class="u-icon icon-service"></i>
      </mt-cell>
      <mt-cell title="设置" @click.native="fSelected('设置')">
        <i slot="icon" class="u-icon icon-setup"></i>
      </mt-cell>
      <mt-cell title="联系媒体村" @click.native="fSelected('联系媒体村')">
        <i slot="icon" class="u-icon icon-chat"></i>
      </mt-cell>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import bus from '../../common/bus.vue'
  import router from '../../router'
  const MASTER = 1,
    VISITOR = -1,
    AGENT = 0;
  export default {
    data() {
      return {
        granted: VISITOR
      }
    },
    methods: {
      fSelected: function (tlt) {
        bus.$emit('selected', tlt);
      },
      fRedirect: function (url) {
        router.push(url);
      }
    },
    created() {
      let self = this;
      if (self.$cookie.get('user')) {
        self.$http.get(`/ajax/getUser?phone=${self.$cookie.get('user')}`).then(function (res) {
          res = res.body;
          if (res.code == 200) {
            self.granted = res.data[0].granted;
            if (self.granted == AGENT) {
              console.log('我是直客')
            } else if (self.granted == MASTER) {
              console.log('我是媒体主')
            } else {
              console.log('游客桑麻')
            }
          }
        });
      }

    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "user";
</style>
