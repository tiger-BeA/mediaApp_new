<template>
  <div class="m-index">
    <v-header></v-header>
    <v-main></v-main>
    <v-footer></v-footer>
  </div>
</template>

<script>
  import footer from '../../common/footer/footer.vue'
  import header from '../../common/header/header.vue'
  import main from '../../common/main/main.vue'

  export default {
    components: {
      'v-footer': footer,
      'v-header': header,
      'v-main': main,
    }
  }
</script>

<style lang="scss">
  @import "../../assets/css/fonts.css";
  @import 'index';
</style>
