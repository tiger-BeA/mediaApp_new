<template>
  <mt-tab-container v-model="selected">
    <mt-tab-container-item id="首页">
      <v-home></v-home>
    </mt-tab-container-item>
    <mt-tab-container-item id="更多信息">
      <v-more></v-more>
    </mt-tab-container-item>
    <mt-tab-container-item id="媒体地图">
      <v-map></v-map>
    </mt-tab-container-item>
    <mt-tab-container-item id="我的">
      <v-user></v-user>
    </mt-tab-container-item>
    <mt-tab-container-item id="注册">
      <v-register></v-register>
    </mt-tab-container-item>
    <mt-tab-container-item id="个人信息">
      <v-info></v-info>
    </mt-tab-container-item>
    <mt-tab-container-item id="投诉与反馈">
      <v-service></v-service>
    </mt-tab-container-item>
    <mt-tab-container-item id="我的收藏">
      <v-favorites></v-favorites>
    </mt-tab-container-item>
    <mt-tab-container-item id="浏览历史">
      <v-history></v-history>
    </mt-tab-container-item>
    <mt-tab-container-item id="设置">
      <v-setup></v-setup>
    </mt-tab-container-item>
    <mt-tab-container-item id="联系媒体村">
      <v-chat></v-chat>
    </mt-tab-container-item>
  </mt-tab-container>
</template>

<script type="text/ecmascript-6">
  import home from '../../components/Home/home.vue'
  import map from '../../components/Map/map.vue'
  import more from '../../components/More/more.vue'
  import user from '../../components/User/user.vue'
  import register from '../../components/Register/register.vue'
  import info from '../../components/Register/info.vue'
  import history from '../../components/History/history.vue'
  import chat from '../../components/Chat/chat.vue'
  import favorites from '../../components/Favorites/favorites.vue'
  import setup from '../../components/Setup/setup.vue'
  import service from '../../components/Service/service.vue'

  import bus from '../bus.vue'
  import MtTabContainer from "../../../node_modules/mint-ui/packages/tab-container/src/tab-container";

  export default {
    data() {
      return {
        selected: '首页'
      }
    },
    components: {
      MtTabContainer,
      'v-home': home,
      'v-map': map,
      'v-more': more,
      'v-user': user,
      'v-register': register,
      'v-info': info,
      "v-history" :history,
      'v-setup' : setup,
      "v-chat" : chat,
      "v-favorites" : favorites,
      "v-service": service
    },
    created() {
      bus.$on('selected', val => {
        this.selected = val;
      });
    }
  }
</script>

<style lang="scss">
  @import "main.scss";
</style>
