<template>
  <div class="m-map">
    <v-detail :popupVisible="popupVisible" :info="curInfo"></v-detail>
    <div id="map-container" style="height: 100%; max-width: 750px;"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {Toast} from 'mint-ui';
  import detail from '../Detail/detail.vue';
  import bus from '../../common/bus.vue';

  export default {
    data() {
      return {
        map: null,
        info: [],
        geoc: null,
        pointArray: [],
        popupVisible: false,
        curInfo: null
      }
    },
    components: {
      'v-detail': detail
    },
    mounted() {
      let self = this;
      self.$http.get('/api/db/mediaInfo').then(res => {
        res = res.body;
        if (res.code == 200) {
          res.data.forEach((item) => {
            self.info.push(item);
          });
          self.fInitMap();
          self.fAddControl();
        }
      })
    },
    methods: {
      fInitMap: function () {
        let self = this;
        self.map = new BMap.Map("map-container");
        self.geoc = new BMap.Geocoder();
        self.fGetGeocode();
      },
      fSetCurCity: function () {
        let self = this;
        let geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function (r) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            self.fPoint2Address(r.point, function (rs) {
              let city = rs.addressComponents.city;
              self.map.setCurrentCity(city);
              self.map.centerAndZoom(r.point, 5);
            });
            self.pointArray.push(r.point);
          } else {
            self.map.setCurrentCity("北京"); // 设置地图显示的城市 此项是必须设置的
            self.map.centerAndZoom(new BMap.Point(116.404, 39.915), 16);  // 初始化地图,设置中心点坐标和地图级别
          }
        }, {enableHighAccuracy: true});
      },
      fAddControl: function () {
        let self = this;
        //添加地图类型控件
        self.map.addControl(new BMap.NavigationControl());
        self.map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT}));
        self.map.addControl(new BMap.OverviewMapControl());
        self.map.addControl(new BMap.MapTypeControl({
          mapTypes: [
            BMAP_NORMAL_MAP,
            BMAP_HYBRID_MAP
          ]
        }));
        // 添加城市检索
        let size = new BMap.Size(10, 20);
        self.map.addControl(new BMap.CityListControl({
          anchor: BMAP_ANCHOR_TOP_LEFT,
          offset: size,
        }));

      },
      fGetGeocode: function () {
        let self = this;
        self.pointArray = [];
        self.fSetCurCity();
        self.info.forEach((val, i) => {
          setTimeout(window.bdGEO, 400);
          self.geoc.getPoint(val.name, function (point) {
            if (point) {
              self.fAddMaker(point, i);
              self.pointArray.push(point);
            }
          });
        });
        self.map.setViewport(self.pointArray); //让所有点在视野范围内
      },
      fAddMaker: function (point, i) {
        let self = this,
          marker = new BMap.Marker(point);
        self.map.addOverlay(marker);
        marker.addEventListener('click', function () {
          self.curInfo = self.info[i];
          self.popupVisible = true;
        });
      },
      fPoint2Address: function (pt, callback) {
        let self = this;
        self.geoc.getLocation(pt, function (rs) {
          // 开启信息窗口
          callback(rs);
        });
      }
    },
    created() {
      let self = this;
      bus.$on('popStatus', val => {
        self.popupVisible = val;
      });
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "map";
</style>
