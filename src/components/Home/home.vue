<template>
  <div class="m-home">
    <v-detail :popupVisible="popupVisible" :info="curInfo"></v-detail>
    <el-row v-show="!popupVisible">
      <el-col v-if="adInfo" :span="11" v-for="(v, i) in adInfo" :offset="i % 2 == 0 ? 0 : 2">
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
  </div>
</template>

<script type="text/ecmascript-6">
  import {InfiniteScroll} from 'mint-ui';
  import bus from '../../common/bus.vue';
  import detail from '../Detail/detail.vue';

  export default {
    data() {
      return {
        adInfo: [],
        popupVisible: false,
        curInfo: null
      }
    },
    created() {
      let self = this;
      self.$http.get('/ajax/getAllInfo').then(res => {
        res = res.body;
        if (res.code == 200) {
          self.adInfo = res.data;
        }
      });
    },
    methods: {
      showDetail: function (v) {
        this.popupVisible = true;
        this.curInfo = v;
        this.$cookie.set('scrollTop', window.scrollY);
        let _list = this.$localStorage.get('mediaList');
        this.$localStorage.set('mediaList', `${_list ? (`${_list},`) : ''}${v.id}`);
      }
    },
    updated() {
      let self = this;
      self.$nextTick(function () {
        bus.$on('popStatus', val => {
          self.popupVisible = val;
          setTimeout(function() {
            let _top = self.$cookie.get('scrollTop') || 0;
            $('html, body').animate({scrollTop: _top}, 0);
          },20);
        });
      });
    },
    components: {
      'v-detail': detail
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "home.scss";

</style>
