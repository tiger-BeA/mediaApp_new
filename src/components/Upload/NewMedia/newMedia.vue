<template>
  <el-row :gutter="20" class="m-new-media">
    <el-col :span="24">
      <div class="m-livePic">
        <mt-cell title="实景照片一套" label="*必填信息"></mt-cell>
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" size="tiny">
          <img width="100%" :src="info.livePic">
        </el-dialog>
      </div>
    </el-col>
    <el-col :span="24">
      <div class="m-info">
        <mt-cell title="媒体简介" label="* 必填信息"></mt-cell>
        <mt-field label="* 媒体位置" placeholder="请输入媒体位置，尽量精确" v-model="info.place">
        </mt-field>
        <mt-cell title="* 媒体形式"></mt-cell>
        <mt-radio v-model="info.type" :options="options">
        </mt-radio>
        <mt-field label="* 媒体规格" placeholder="如: 宽7.45M*高2.12M*4块" v-model="info.size">
        </mt-field>
        <mt-field label="* 人车流量" placeholder="如: 8万车次/日，20万人次/日" v-model="info.flow">
        </mt-field>
        <mt-field label="* 刊例价" placeholder="如: 10万/周" v-model="info.flow">
        </mt-field>
        <mt-field label="* 详细信息" placeholder="请输入媒体详细介绍" type="textarea" rows="4" v-model="info.detail"></mt-field>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="m-adcard">
        <mt-cell title="广告证"></mt-cell>
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" size="tiny">
          <img width="100%" :src="info.adPic" alt="">
        </el-dialog>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="m-plan">
        <mt-cell title="规划证"></mt-cell>
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" size="tiny">
          <img width="100%" :src="info.planPic" alt="">
        </el-dialog>
      </div>
    </el-col>
    <mt-button class="u-btn-submit" size="large" :disabled="isRight" @click="fCheckForm()">提交申请</mt-button>
  </el-row>
</template>

<script type="text/ecmascript-6">
  import MtCell from "../../../../node_modules/mint-ui/packages/cell/src/cell";
  import ElCol from "element-ui/packages/col/src/col";
  import MtButton from "../../../../node_modules/mint-ui/packages/button/src/button";
  import router from '../../../router';

  export default {
    components: {
      MtButton,
      ElCol,
      MtCell,
    },
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        options: ['新媒体', '单立柱', 'LED', '外墙广告'],
        info: {
          id: '',
          href: '',
          name: '',
          place: '',
          type: '',
          size: '',
          flow: '',
          detail: '',
          livePic: '',
          adPic: '',
          planPic: '',
          status: '',
          price: '',
          isPass: 0
        },
        isRight: true
      };
    },
    methods: {
      handleRemove(file, fileList) {
//        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      rGetId: function () {
        return Math.floor(0x1000000 + Math.random() * 0x1000000).toString(16).slice(1).toUpperCase();
      },
      fCheckForm: function () {
        let self = this;
        self.info.id = self.rGetId();
        self.$http.post(`/ajax/addInfo`, {
          info: self.info,
          user: {
            phone: self.$cookie.get('user'),
            item: self.info.id
          }
        }).then(res => {
          if (res.code == 200) {
            Toast({
              message: '已成功提交申请~请等待审核',
              position: middle,
              duration: 1000
            });
            setTimeout(function () {
              router.push('/');
            }, 1000);
          }
        })
      }
    },
    watch: {
      'info': function() {
        let self = this;
        if (self.info.place) {
          self.isRight = false;
        } else {
          self.isRight = true;
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "newMedia";
</style>
