<template>
  <div class="m-history">
    <v-header title="我的投放" :backShow=true>
    </v-header>
    <v-detail :popupVisible="popupVisible" :info="curInfo"></v-detail>
    <el-row v-show="!popupVisible" v-if="adInfo">
      <el-col :span="11" v-for="(v, i) in adInfo" :offset="i % 2 == 0 ? 0 : 2">
        <el-card @click.native="showDetail(v)">
          <img v-lazy="v.livePic" class="m-pic J_lazyload">
          <div class="u-tlt">
            <span>{{ v.name }}</span>
            <div class="bottom clearfix">
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div v-else>暂无投放喔~</div>
  </div>
</template>

<script type="text/ecmascript-6">
  import bus from '../../common/bus.vue';
  import detail from '../Detail/detail.vue';
  import header from '../../common/header/header.vue'

  export default {
    data() {
      return {
        adInfo: null,
        popupVisible: false,
        curInfo: null
      }
    },
    methods: {
      showDetail: function (v) {
        this.popupVisible = true;
        this.curInfo = v;
        this.$cookie.set('scrollTop', window.scrollY);
      },
    },
    updated() {
      let self = this;
      self.$nextTick(function () {
        bus.$on('popStatus', val => {
          self.popupVisible = val;
          setTimeout(function () {
            let _top = self.$cookie.get('scrollTop') || 0;
            $('html, body').animate({scrollTop: _top}, 0);
          }, 20);
        });
      });
    },
    created() {
      let self = this;
      if (self.$cookie.get('user')) {
        self.$http.get(`/ajax/getReportList?phone=${self.$cookie.get('user')}`).then(res => {
          res = res.body;
          if (res.code == 200 && res.data) {
            self.$http.get(`/ajax/getInfo?id=${res.data}`).then(res => {
              res = res.body;
              if (res.code == 200) {
                self.adInfo = res.data;
              }
            });
          }
        });
      } else {
        router.push('/login');
      }
    },
    components: {
      'v-detail': detail,
      'v-header': header
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import 'report';
</style>
