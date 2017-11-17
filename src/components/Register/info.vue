<template>
  <div class="m-info">
    <mt-cell title="个人信息" class="u-main-tlt"></mt-cell>
    <mt-checklist
      title="身份" v-model="identity" :options="['大型媒介中心', '广告主', '媒体主', '广告代理', '4A公司', `其他`]">
    </mt-checklist>
    <mt-cell title="选择城市" class="u-tlt"></mt-cell>
    <el-cascader :options="citys" v-model="city"></el-cascader>
    <mt-cell title="公司名称" class="u-tlt"></mt-cell>
    <mt-field placeholder="请输入公司名称" v-model="company" :state="state1"></mt-field>
    <mt-cell title="QQ号" class="u-tlt"></mt-cell>
    <mt-field placeholder="请输入QQ号" v-model="qq" :state="state2"></mt-field>
    <mt-cell title="姓名" class="u-tlt"></mt-cell>
    <mt-field placeholder="请输入姓名" v-model="name" :state="state3"></mt-field>
    <mt-button @click="checkForm" class="u-submit" :disabled="isDisabled" size="large">提&nbsp;&nbsp;交</mt-button>
  </div>
</template>

<script type="text/ecmascript-6">
  import router from '../../router'
  import {Toast} from 'mint-ui';
  import MtChecklist from "../../../node_modules/mint-ui/packages/checklist/src/checklist";
  import {Cascader} from 'element-ui'

  const MASTER = 1,
    VISITOR = -1,
    AGENT = 0;
  export default {
    components: {
      MtChecklist,
      ElCascader: Cascader
    },
    data() {
      return {
        identity: [],
        company: '',
        name: '',
        qq: '',
        city: [],
        citys: [],
        isDisabled: true,
        state1: '',
        state2: '',
        state3: ''
      }
    },
    methods: {
      checkForm() {
        let self = this;
        if (self.identity && self.city && self.state1 == 'success' && self.state2 == 'success' && self.state3 == 'success') {
          let granted = self.identity.findIndex(val => {
            return val == '媒体主';
          });
          if (granted == -1) {
            granted = AGENT;
          } else {
            granted = MASTER;
          }
          self.$http.get(`/ajax/updateUser?phone=${self.$cookie.get('user')}&identity=${self.identity.join(',')}&city=${self.city.join(',')}&company=${self.company}&qq=${self.qq}&name=${self.name}&granted=${granted}`).then((res) => {
            res = res.body;
            if (res.code == 200) {
              Toast({
                message: '个人信息修改成功！3秒后返回首页',
                position: 'middle',
                duration: 3000
              });
              setTimeout(function () {
                router.push('/');
              }, 2000);
            } else if (res.code == 302) {
              Toast({
                message: '信息不对啊...找开发问问...',
                position: 'middle',
                duration: 2000
              });
            } else {
              Toast({
                message: '数据库迷失了...',
                position: 'middle',
                duration: 2000
              });
            }
          });
        }
      }
    },
    created() {
      let self = this;
      self.$http.get('/ajax/getCity').then((res) => {
        res = res.body;
        if (res.code === 200) {
          self.citys = res.data;
        }
      });
    },
    mounted() {
      let self = this;
      self.$nextTick(function () {
        self.$http.get(`/ajax/getUser?phone=${self.$cookie.get('user')}`).then(res => {
          res = res.body;
          if (res.code == 200) {
            res.data.forEach(item => {
              self.identity = item.identity ? [...self.identity, ...(item.identity.split(','))] : [];
              self.city = item.city ? item.city.split(',') : [];
              self.name = item.name ? item.name : '';
              self.company = item.company ? item.company : '';
              self.qq = item.qq ? item.qq : '';
            });
            self.identity = Array.from(new Set(self.identity));
          }
        });
      });
    },
    watch: {
      'company': function () {
        if (this.company) {
          this.state1 = 'success';
        } else {
          this.state1 = '';
        }
      },
      'qq': function () {
        if (/[0-9]/.test(this.qq)) {
          this.state2 = 'success';
        } else if (this.qq) {
          this.state2 = 'warning'
        } else {
          this.state2 = '';
        }
      },
      'name': function () {
        if (this.name) {
          this.state3 = 'success';
        } else {
          this.state3 = '';
        }
        if (this.identity && this.city && this.state1 == 'success' && this.state2 == 'success' && this.state3 == 'success') {
          this.isDisabled = false;
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "info.scss"
</style>
