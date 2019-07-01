<template>
  <section class="app-main">
    <transition name="fade" mode="out-in">
      <!-- <keep-alive include="bukongguanli,biaozhundizhi,shiyourenkou,shiyoufangwu,shiyoudanwei,shiyoucheliang"> -->
      <keep-alive include="bukongguanli">
        <router-view></router-view>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  height: calc(100vh - 50px);
  position: relative;
  overflow:auto;
}
</style>
