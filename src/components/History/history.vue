<template>
  <div class="m-history">
    <v-header title="浏览历史" :backShow=true>
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
    <div v-else>暂无浏览历史喔~</div>
  </div>
</template>

<script type="text/ecmascript-6">
  import bus from '../../common/bus.vue';
  import detail from '../Detail/detail.vue';
  import header from '../../common/header/header.vue'

  export default {
    data() {
      return {
        adInfo: [],
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
      self.$http.get(`/ajax/getInfo?id=${self.$localStorage.get('mediaList')}`).then(res => {
        res = res.body;
        if (res.code == 200) {
          self.adInfo = res.data;
        }
      });
    },
    components: {
      'v-detail': detail,
      'v-header': header
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import 'history';
</style>
