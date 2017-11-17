<template>
  <div class="m-new-report" v-if="info">
    <v-header title="媒体报备" :backShow="true"></v-header>
    <mt-field label="报备媒体" type="tel" :value="info.name" :readonly="true" :disableClear="true"></mt-field>
    <mt-field label="客户名称" placeholder="请输入客户名称" v-model="userName"></mt-field>
    <mt-radio
      title="选择行业"
      v-model="industry"
      :options="options">
    </mt-radio>
    <mt-cell title="选择投放期"></mt-cell>
    <mt-picker :slots="time" @change="fChangeTime" :visibleItemCount=3></mt-picker>
    <mt-field label="报备者" :value="rGetPreName" :readonly="true" :disableClear="true"></mt-field>
    <mt-button class="u-btn u-btn-submit J_btn_submit" type="default" size="large" :disabled="isRight"
               @click="fCheckFrom()">提交报备信息
    </mt-button>
    <mt-button class="u-btn u-btn-close J_btn_close" type="default" size="large">关闭</mt-button>
  </div>
</template>

<script type="text/ecmascript-6">
  import bus from '../../../common/bus'
  import {Field, Button, Picker, Radio, Toast} from 'mint-ui';
  import header from '../../../common/header/header';
  import router from '../../../router'

  export default{
    data() {
      return {
        time: [
          {
            flex: 1,
            values: [],
            className: 'u-year',
            textAlign: 'right',
            defaultIndex: 0
          }, {
            divider: true,
            content: '-',
            className: 'u-line'
          }, {
            flex: 1,
            values: [],
            className: 'u-season',
            textAlign: 'left',
            defaultIndex: 0
          }
        ],
        timeMap: null,
        status: '',
        mediaName: '',
        info: null,
        userName: '',
        industry: '',
        defaultValues: '',
        isRight: true,
        options: ['房地产', '汽车', '电器', '电商', '化妆品', '再教育', '医药', '酿酒', '建材', '家具', '食品饮料', '物流']
      }
    },
    created() {
      let self = this;
      self.$nextTick(function () {
        self.$http.get(`/ajax/getInfo?id=${self.rFormatParam().id}`).then(function (res) {
          res = res.body;
          if (res.code == 200) {
            self.info = res.data[0];
            self.fGetTimeMap();
          }
        });
      });
    },
    methods: {
      rFormatParam: function () {
        let self = this;
        let hash = $.trim(window.location.href.split('?')[1]).split(',');
        let params = {};
        hash.forEach(val => {
          let item = val.split('=');
          params[item[0]] = item[1];
        });
        return params;
      },
      fGetTimeMap: function () {
        let self = this;
        self.timeMap = new Map();
        for (let i = 2017; i <= 2030; i++) {
          self.timeMap.set(i, [1, 2, 3, 4]);
        }
        if (self.info.status) {
          self.info.status.split(',').forEach(val => {
              let _arr = val.split('-');
              let data = {
                year: parseInt(_arr[0]),
                season: parseInt(_arr[1]),
                company: _arr[2]
              };
              console.log(self.timeMap.get(data.year))
              let season = [];
              if (self.timeMap.get(data.year)) {
                season = self.timeMap.get(data.year).filter(item => {
                  return item != data.season;
                });
              }
              if (self.timeMap.has(data.year) && season) {
                self.timeMap.set(data.year, season);
              } else {
                self.timeMap.delete(data.year);
              }
            }
          );
        }
        for (let item of self.timeMap.entries()) {
          if (!self.defaultValues) {
            self.defaultValues = item[0];
          }
          self.time[0].values.push(item[0]);
        }
        self.time[2].values = self.rGetSeason(self.timeMap.get(self.defaultValues));
      },
      fChangeTime: function (picker, val) {
        let self = this;
        picker.setSlotValues(1, self.rGetSeason(self.timeMap.get(val[0])));
        self.status = val;
      },
      rGetSeason: function (season) {
        if (season) {
          let res = [],
            len = season.length;
          for (let i = 0; i < len; i++) {
            switch (season[i]) {
              case 1:
                res.push('第一季度');
                break;
              case 2:
                res.push('第二季度');
                break;
              case 3:
                res.push('第三季度');
                break;
              case 4:
                res.push('第四季度');
                break;
              default:
                break;
            }
          }
          return res;
        } else {
          return [];
        }
      },
      rForSeason: function (season) {
        switch (season) {
          case '第一季度':
            return 1;
          case '第二季度':
            return 2;
          case '第三季度':
            return 3;
          case '第四季度':
            return 4;
        }
      },
      fCheckFrom: function () {
        let self = this;
        let _status = self.status[0] + '-' + self.rForSeason(self.status[1]) + '-' + self.userName;
        self.$http.post(`/ajax/addReport`, {
          phone: self.$cookie.get('user'),
          item: self.info.id,
          status: _status
        }).then(res => {
          res = res.body;
          if (res.code == 200) {
            Toast({
              message: '提交成功，请耐心等待审核',
              position: 'middle',
              duration: 1000
            });
            setTimeout(function() {
              router.push('/');
            }, 1000);
          }
        });
      }
    },
    computed: {
      rGetPreName: function () {
        let self = this;
        return self.$cookie.get('user');
      },
    },
    components: {
      'v-header': header,
    },
    watch: {
      'userName': function () {
        let self = this;
        self.isRight = !(self.userName && self.industry && self.status);
      },
      'industry': function () {
        let self = this;
        self.isRight = !(self.userName && self.industry && self.status);
      },
      'status': function() {
        let self = this;
        self.isRight = !(self.userName && self.industry && self.status);
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "newReport";
</style>
