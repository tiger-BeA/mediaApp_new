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
    <p><span class="u-label">现状</span><span class="u-val">{{status}}</span></p>
    <p><span class="u-label">刊例价</span><span class="u-val">(请与客服联系)</span></p>
    <div id="m-detail-map">
    </div>
    <div class="m-tool-btn">
      <mt-button size="normal" class="J_collect u-btn-collect" @click="fAddCollect()"><i class="u-icon icon-star"></i>收藏
      </mt-button>
      <mt-button size="normal" class="J_report u-btn-report" @click="fAddReport()"><i class="u-icon icon-service"></i>报备
      </mt-button>
    </div>
    <mt-button type="default" size="large" class="u-close" @click="fClosePop">关&nbsp;&nbsp;&nbsp;闭</mt-button>
  </mt-popup>
</template>

<script type="text/ecmascript-6">
  import {Popup, Button} from 'mint-ui';
  import bus from '../../common/bus.vue'
  import router from '../../router'

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
    data() {
      return {
        status: '空闲'
      }
    },
    methods: {
      fGetStatus: function () {
        let self = this,
          today = new Date(),
          year = today.getFullYear(),
          month = today.getMonth() + 1,
          season = 1;
        if (month >= 1 && month <= 3) {
          season = 1;
        } else if (month >= 4 && month <= 6) {
          season = 2;
        } else if (month >= 7 && month <= 9) {
          season = 3;
        } else if (month >= 10 && month <= 12) {
          season = 4;
        }
        let flag = '';
        if (self.info.status) {
          let list = self.info.status.split(',');
          flag = list.find(val => {
            let _arr = val.split('-');
            return year == _arr[0] && season == _arr[1];
          });
        }
        if (flag) {
          let _company = flag.split('-')[2];
          self.status = `现归【${_company}】所有`;
        } else {
          self.status = '空闲';
        }
      },
      fClosePop: function () {
        bus.$emit('popStatus', false);
      },
      fAddCollect: function () {
        let self = this;
        if (self.$cookie.get('user')) {
          if ($('.J_collect').hasClass('f-active')) {
            self.$http.get(`/ajax/delCollect?phone=${self.$cookie.get('user')}&item=${self.info.id}`).then(function (res) {
              res = res.body;
              if (res.code == 200) {
                $('.J_collect').removeClass('f-active');
              }
            })
          } else {
            self.$http.get(`/ajax/addCollect?phone=${self.$cookie.get('user')}&item=${self.info.id}`).then(function (res) {
              res = res.body;
              if (res.code == 200) {
                $('.J_collect').addClass('f-active');
              }
            });
          }
        } else {
          router.push('/login');
        }
      },
      fAddReport: function () {
        let self = this;
        if (self.$cookie.get('user')) {
          router.push(`/newReport?id=${self.info.id}`);
        } else {
          router.push('/login');
        }
      }
    },
    updated(){
      let self = this;
      self.$nextTick(function () {
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
        self.$http.get(`/ajax/getCollectList?phone=${self.$cookie.get('user')}`).then(function (res) {
          res = res.body;
          if (res.code == 200 && res.data) {
            let flag = res.data.split(',').findIndex(val => {
              return val == self.info.id;
            });
            if (flag != -1) {
              $('.J_collect').addClass('f-active');
            } else {
              $('.J_collect').removeClass('f-active');
            }
          }
        });
      });
    },
    watch: {
      'info': function () {
        let self = this;
        self.fGetStatus();
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import '../../assets/css/fonts.css';
  @import 'detail';
</style>
