<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="currentRouter"
      :collapse="isCollapse"
      background-color="#03223c"
      text-color="#979fa9"
      active-text-color="#409EFF"
    >
      <sidebar-item v-for="route in permission_routers" :key="route.name" :item="route" :base-path="route.path"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  data() {
      return {
          currentRouter: this.$route.path
      }
  },
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      return false
      // return !this.sidebar.opened
    }
  },
  created() {
    // 布控管理的新增和详情都归布控管理所有，高亮布控管理菜单
    if (this.$route.name == 'addrycontrol' || this.$route.name == 'addchecontrol' || this.$route.name == 'bukongxiangqing') {      
      this.currentRouter = '/zhinenggaojing/bukongguanli';
    }
    //案件录入的新增都归案件录入所有，高亮案件录入菜单
    if (this.$route.name == 'addanjian' || this.$route.name == 'addxiansuo') {      
      this.currentRouter = '/anjianguanli/anjianluru';
    }
    //事件录入的新增都归事件管理所有，高亮事件管理菜单
    if (this.$route.name == 'shijianluru') {      
      this.currentRouter = '/shijianguanli/shijianzonglan';
    }
    // 一标四实的详情归实有xx所有，高亮对应菜单
    if (this.$route.name == 'renyuanxiangqing') {      
      this.currentRouter = '/yibiaosishi/shiyourenkou';
    }
    if (this.$route.name == 'fangwuxiangqing') {      
      this.currentRouter = '/yibiaosishi/shiyoufangwu';
    }
    if (this.$route.name == 'danweixiangqing') {      
      this.currentRouter = '/yibiaosishi/shiyoudanwei';
    }
    if (this.$route.name == 'cheliangxiangqing') {      
      this.currentRouter = '/yibiaosishi/shiyoucheliang';
    }
    if (this.$route.name == 'dizhixiangqing') {      
      this.currentRouter = '/yibiaosishi/biaozhundizhi';
    }
  },
  watch:{
      '$route':function(to,from) {
          this.currentRouter = to.path;
          // 布控管理的新增和详情都归布控管理所有，实时告警跳转到告警列表也属于布控管理，高亮布控管理菜单
          if (to.name == 'addrycontrol' || to.name == 'addchecontrol' || to.name == 'bukongxiangqing') {
            this.currentRouter = '/zhinenggaojing/bukongguanli';
          }
          //案件录入的新增都归案件录入所有，高亮案件录入菜单
          if (to.name == 'addanjian' || to.name == 'addxiansuo') {      
            this.currentRouter = '/anjianguanli/anjianluru';
          }
           //事件录入的新增都归事件管理所有，高亮事件管理菜单
          if (to.name == 'shijianluru') {     
            this.currentRouter = '/shijianguanli/shijianzonglan';
          }
          // 一标四实的详情归实有xx所有，高亮对应菜单
          if (to.name == 'renyuanxiangqing') {      
            this.currentRouter = '/yibiaosishi/shiyourenkou';
          }
          if (to.name == 'fangwuxiangqing') {      
            this.currentRouter = '/yibiaosishi/shiyoufangwu';
          }
          if (to.name == 'danweixiangqing') {      
            this.currentRouter = '/yibiaosishi/shiyoudanwei';
          }
          if (to.name == 'cheliangxiangqing') {      
            this.currentRouter = '/yibiaosishi/shiyoucheliang';
          }
          if (to.name == 'dizhixiangqing') {      
            this.currentRouter = '/yibiaosishi/biaozhundizhi';
          }
      }
  }
}
</script>
