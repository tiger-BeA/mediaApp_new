<template>
  <div class="m-page-field">
    <div class="m-icon">
       <span class="icon-frog">
        <span class="path1"></span><span class="path2"></span><span class="path3"></span><span
 class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span
 class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span
 class="path12"></span><span class="path13"></span><span class="path14"></span><span class="path15"></span><span
 class="path16"></span><span class="path17"></span><span class="path18"></span>
        </span>
      <span class="u-name">媒&nbsp;&nbsp;体&nbsp;&nbsp;村</span>
    </div>
    <mt-field label="手机号" placeholder="请输入手机号" type="tel" v-model="phone" :state="state"></mt-field>
    <div class="u-divide"></div>
    <mt-field label="验证码" placeholder="输入验证码" v-model="code">
      <mt-button type="primary" plain :disabled="isDisabled" @click="sendMes">{{ buttonText }}</mt-button>
    </mt-field>
    <div class="u-divide"></div>
    <mt-button @click="checkForm" class="u-submit" :disabled="isWrong" size="large">登&nbsp;&nbsp;陆</mt-button>
    <div class="u-router">
      <router-link to="/register">还没有账号？去注册</router-link>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import bus from '../../common/bus.vue'
  import {Toast} from 'mint-ui';
  import router from '../../router'

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
          self.$http.get(`/ajax/getUser?phone=${self.phone}`).then((res) => {
            res = res.body;
            if (res.code == 200) {
              if (res.data.length) {
                Toast({
                  message: '登陆成功，3秒后返回首页',
                  position: 'middle',
                  duration: 2000
                });
                self.$cookie.set('user', self.phone, 1);
                setTimeout(function () {
                  router.push('/');
                }, 2000);
              } else {
                Toast({
                  message: '用户不存在，换个账号试试？',
                  position: 'middle',
                  duration: 2000
                });
              }
            } else if (res.code == 302) {
              Toast({
                message: '发送请求错误',
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
  @import "../../assets/css/fonts.css";
</style>
