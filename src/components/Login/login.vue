<template>
  <div class="m-page-field">
    <mt-field label="手机号" placeholder="请输入手机号" type="tel" v-model="phone" :state="state"></mt-field>
    <div class="u-divide"></div>
    <mt-field label="验证码" placeholder="输入验证码" v-model="code">
      <mt-button type="primary" plain :disabled="isDisabled" @click="sendMes">{{ buttonText }}</mt-button>
    </mt-field>
    <div class="u-divide"></div>
    <mt-button @click="checkForm" class="u-submit" :disabled="isWrong" size="large">确&nbsp;&nbsp;认</mt-button>
  </div>
</template>

<script type="text/ecmascript-6">
  import bus from '../../common/bus.vue'
  import { Toast } from 'mint-ui';

  export default {
    data() {
      return {
        phone: '',
        code: '',
        state: '',
        isDisabled: true,
        isWrong: true,
        buttonText: '获取验证码'
      }
    },
    watch: {
      'phone': function () {
        if (/^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/.test(this.phone)) {
          this.state = 'success';
          this.isDisabled = false;
        } else {
          this.state = '';
          this.isDisabled = true;
        }
      },
      'code': function () {
        if (this.code == '1234' && this.state == 'success') {
          this.isWrong = false;
        }
      }
    },
    methods: {
      checkForm() {
        let self = this;
        if (self.phone && self.code) {
          self.$http.get(`/api/ajax/queryUsers?phone=${self.phone}`).then((res) => {
            res = res.body;
            if (res.code == 200) {
              if (self.$cookie.get('user')) {
                Toast({
                  message: '登陆成功，3秒后返回首页',
                  position: 'middle',
                  duration: 2000
                });
                setTimeout(function() {

                }, 2000);
              }
              self.$cookie.set('user', self.phone, 1);
              setTimeout(function() {
                bus.$emit('selected', '个人信息');
              }, 2000);
            } else if (res.code == 302) {
              Toast({
                message: '该号码已被注册过了，换个试试~',
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
          })
        }
      },
      sendMes() {
        let self = this,
          count = 60,
          timer = null;
        self.isDisabled = true;
        self.$http.post(`https://sms.yunpian.com/v2/sms/single_send.json?apikey=${self.phone}&mobile=${self.phone}&text=【媒体村】您的验证码是1234`).then((res) => {
          timer = setInterval(function () {
            self.buttonText = `${count}秒后可重新发送`;
            count--;
            if (count === 0) {
              window.clearInterval(timer);
              self.isDisabled = false;
              self.buttonText = '发送验证码';
              count = 60;
            }
          }, 1000);
        }, (err) => {
          timer = setInterval(function () {
            self.buttonText = `${count}秒后可重新发送`;
            count--;
            if (count === 0) {
              window.clearInterval(timer);
              self.isDisabled = false;
              self.buttonText = '发送验证码';
              count = 60;
            }
          }, 1000);
        });

      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/mixin";
  @import "login";
</style>
