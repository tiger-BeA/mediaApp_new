<template>
  <mt-header :title="title" fixed>
    <router-link to="/" slot="left" v-if="backShow">
      <mt-button icon="back"></mt-button>
    </router-link>
  </mt-header>
</template>
<script>
  export default {
    props: {
      title: {
        type: String,
        default() {
          return '媒体村';
        }
      },
      backShow: {
        type: Boolean,
        default() {
          return false
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import './header.scss';
</style>

