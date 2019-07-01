<template>
  <div class="appcontents-view">
    <div class="content-hold">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

  //import Master from 'src/view/geo/Master'

  export default {
    name: 'AppContents',
    data () {
      return {

      }
    },
    methods: {

    },
    mounted() {

    }
  }
</script>

<style scoped>
  .appcontents-view {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 20px;
    background: #f5f9fb;
  }
  .content-hold {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border: 1px solid #d9dfe5;
    background: #fff;
  }
</style>
