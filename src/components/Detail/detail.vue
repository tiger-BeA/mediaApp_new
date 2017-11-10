<template>
  <mt-popup v-if="info"
            v-model="popupVisible"
            position="right">
    <h1>{{ info.name }}</h1>
    <div class="m-livePic">
      <img v-lazy="info.livePic" class="u-livePic"/>
    </div>
    <span class="u-media">媒体简介</span>
    <p class="m-media">
      {{info.detail ? info.detail.replace(/\?+/g, '').replace(/\n+/g, ' ') : '(暂无简介)'}}
    </p>
    <p><span class="u-label">位置</span><span class="u-val">{{info.place}}</span></p>
    <p><span class="u-label">形式</span><span class="u-val">{{info.type}}</span></p>
    <p><span class="u-label">规格</span><span class="u-val">{{info.size ? info.size : '(暂无尺寸)'}}</span></p>
    <p><span class="u-label">受众量</span><span class="u-val">{{info.flow ? info.flow : '(暂无统计)'}}</span></p>
    <p><span class="u-label">现状</span><span class="u-val">{{info.status ? info.status : '已在用'}}</span></p>
    <p><span class="u-label">刊例价</span><span class="u-val">(请与客服联系)</span></p>
    <div id="m-detail-map">
    </div>
    <div class="m-tool-btn">
      <mt-button size="normal" class="J_collect u-btn-collect" @click="fAddCollect()"><i class="u-icon icon-star"></i>收藏
      </mt-button>
      <mt-button size="normal" class="J_report u-btn-report"><i class="u-icon icon-service"></i>报备</mt-button>
    </div>
    <mt-button type="default" size="large" class="u-close" @click="fClosePop">关&nbsp;&nbsp;&nbsp;闭</mt-button>
  </mt-popup>
</template>

<script type="text/ecmascript-6">
  import {Popup, Button} from 'mint-ui';
  import bus from '../../common/bus.vue'

  export default {
    props: {
      info: {
        type: Object,
        default() {
          return Null;
        }
      },
      popupVisible: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    methods: {
      fClosePop: function () {
        bus.$emit('popStatus', false);
      },
      fAddCollect: function () {
        let self = this;
        if (self.$cookie.get('user')) {
          if ($('.J_collect').hasClass('f-active')) {
            self.$http.get(`/api/ajax/cancelCollectUser?phone=${self.$cookie.get('user')}&item=${self.info.id}`).then(function (res) {
              res = res.body;
              if (res.code == 200) {
                $('.J_collect').removeClass('f-active');
              }
            })
          } else {
            self.$http.get(`/api/ajax/addCollectUser?phone=${self.$cookie.get('user')}&item=${self.info.id}`).then(function (res) {
              res = res.body;
              if (res.code == 200) {
                $('.J_collect').addClass('f-active');
              }
            });
          }
        } else {

        }
      }
    },
    updated() {
      let self = this;
      let map = new BMap.Map("m-detail-map"),
        myGeo = new BMap.Geocoder();
      map.addControl(new BMap.NavigationControl());
      myGeo.getPoint(self.info.name, function (point) {
        if (point) {
          let maker = new BMap.Marker(point);
          map.addOverlay(maker);
          map.centerAndZoom(point, 14);
        } else {
          map.centerAndZoom(self.info.place, 14);
        }
      });
      self.$http.get(`/api/ajax/queryCollectUser?phone=${self.$cookie.get('user')}`).then(function (res) {
        res = res.body;
        if (res.code == 200 && res.data) {
          let flag = res.data.findIndex(val => {
            return val == self.info.id;
          });
          if (flag != -1) {
            $('.J_collect').addClass('f-active');
          } else {
            $('.J_collect').removeClass('f-active');
          }
        }
      });
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import '../../assets/css/fonts.css';
  @import 'detail';
</style>
