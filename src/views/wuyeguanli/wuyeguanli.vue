<template>
   <div class="content-body wuyeguanli">
      <div class="page-bread">
        <el-breadcrumb>
          <el-breadcrumb-item>物业管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="wygl">
    
          <baidu-map :showKaKouTool="false"   :p_isShowNavigation='false' :p_isShowScale='false'></baidu-map>
          <div class="layer-tool">
                <app-layer :showOpt='true' backgound='white'></app-layer>
          </div>
    
      </div>

   </div>
  
</template>

<script>
import md5 from 'js-md5';
import $ from 'jquery';
import baidumap from '@/components/baidumap/zhzzMap';
import '@/styles/passway-base64.module_wygl.styl';
import pGisDataLayer from '@/components/maps/pGisDataLayer_wygl';

export default {
  name: 'wuyeguanli',
  data() {
    return {
      // username: 'admin',
      // password: md5('Hik12345'),
      // loading: false,
      // pwdType: 'password'
    }
  },
  components: {
     'baidu-map':baidumap,
     'app-layer': pGisDataLayer,
  },
  mounted() {
    // this.jumpToHik();
  },
  methods: {
    // jumpToHik() {
    //   $('#loginForm').submit();
    // }


  }
}
</script>
<style>
.wuyeguanli{
  height: 100%;
}
.wygl {
  /* display:none; */
  width: 100%;
  height: 100%;
}
.layer-tool{
  position: absolute;
    top: 0px;
    left: -300px;
}
</style>
