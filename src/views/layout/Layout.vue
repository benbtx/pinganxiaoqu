<template>
  <div class="app-wrapper" :class="classObj">
    <div class="header">
      <div class="headerdec">
        <span style="font-size:20px;font-weight:bold;">
          <img class="title-icon" :src="titleURL">环保监管系统</span>

        <div class="header-right">
          <span id="f-nav-search-part" class = "f-nav">
                <input id="f-nav-search-cont" class="f-nav-search-cont" :class="{displayInput:searchState}" placeholder="请输入关键词" v-model="searchInfo" @blur="upperCase()" />
                <label for="f-nav-search-cont" id="f-nav-search-icon" class="el-icon-search search-icon" style="color:#777777" @click="changeStyle">
                </label>
          </span>
          <!-- <span class="header-icon" :class="{active: $route.path == '/gongzuotai/gongzuotai'}" @click="gotoWorkspace">
            <svg-icon icon-class="gongzuotai"></svg-icon> 工作台
          </span>
           -->
          <el-dropdown trigger="click" @visible-change="showMore">
            <span class="header-icon el-dropdown-link" :class="{active: isMore}"><svg-icon icon-class="gengduo"></svg-icon> 更多</span>
            <el-dropdown-menu class="user-dropdown" slot="dropdown">
              <!-- <router-link class="inlineBlock" to="/">
                <el-dropdown-item>
                  修改密码
                </el-dropdown-item>
              </router-link> -->
              <!-- <el-dropdown-item divided> -->
              <el-dropdown-item class="dropdown-container">
                <div class="dropdown-wrapper">
                  <img class="user-dropdown" :src="headUrl">
                  <!-- <i class="el-icon-caret-bottom"></i> -->
                  {{uerName}}
                </div>
              </el-dropdown-item>
              <!-- <el-dropdown-item class="dropdown-container"> -->
                <!-- <el-dropdown class="download" :hide-on-click="false" trigger="click" @visible-change="showDownload">
                  <span class="el-dropdown-link header-icon" :class="{active: isDownload}">
                    <svg-icon icon-class="xiazaizhongxin"></svg-icon>
                    下载中心
                  </span>
                  <el-dropdown-menu slot="dropdown" class="download-item">
                    <el-dropdown-item v-for="(item, index) in exeUrl" :key="item.id">
                      <span class="down-idx">{{index+1}}</span><span class="shipin-icon"></span><a :href="BASE_IMG_URL+'/'+item.fileUri+'?filename='+item.fileName">视频播放器</a><span class="fr fa fa-long-arrow-down"></span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown> -->
                <el-popover
                  placement="left-start"
                  width="220"
                  trigger="click"
                  class="dropdown-container"
                  :visible-arrow="false"
                  v-model="isDownload"
                  >
                  <ul class="download-item">
                    <li v-for="(item, index) in exeUrl" :key="item.id">
                      <span class="down-idx">{{index+1}}</span><span class="shipin-icon"></span><a :href="BASE_IMG_URL+'/'+item.fileUri+'?filename='+item.fileName">视频播放器</a><span class="fr fa fa-long-arrow-down"></span>
                    </li>
                  </ul>
                  <span slot="reference" class="el-dropdown-link header-icon" :class="{active: isDownload}" @click="showDownload">
                    <svg-icon icon-class="xiazaizhongxin"></svg-icon>
                    下载中心
                  </span>
                </el-popover>
              <!-- </el-dropdown-item> -->
              <el-dropdown-item class="dropdown-container">
                <span class="header-icon" :class="{active: isSetting}" @click="showSetting">
                  <svg-icon icon-class="shezhi"></svg-icon>
                  设置
                </span>
              </el-dropdown-item>
              <el-dropdown-item class="dropdown-container">
                <span @click="logout" style="display:block;">退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

      </div>
    </div>
    <!-- <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div> -->
    <sidebar class="sidebar-container" v-if="$store.state.app.isFullScreen == 'no'"></sidebar>
    <div class="main-container">
       <!-- 固定显示当前菜单，不需要多级面包屑导航 -->
      <!-- <navbar></navbar> -->
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import {Sidebar, AppMain } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import { shipinApi } from "@/https";

export default {
  name: "layout",
  data() {
    return {
      titleURL: '/static/image/jiuzhou-LOGO.png',
      exeUrl: [],
      isDownload:　false,
      isSetting:false,
      isMore: false,
      headUrl: this.$store.getters.account,
      uerName: this.$store.getters.username,
      searchState:false,
      searchInfo:'',
    }
  },
  components: {
    // Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  // created() {
  //   let rolearr = this.$store.getters.roles;
 
  //   if (rolearr.indexOf("community") != -1) {
  //     this.titleURL = '/static/image/sqtitle.png';
  //   } else if (rolearr.indexOf("police") != -1) {
  //     this.titleURL = '/static/image/ptitle.png';
  //   } else if (rolearr.indexOf("property") != -1) {
  //     this.titleURL = '/static/image/xqtitle.png';
  //   }
  // },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile"
      };
    }
  },
  mounted() {
    console.log(this.$store.getters)
    this.getExePath();
  },
  methods: {
    upperCase(){
      if(document.getElementsByTagName("input")[0].value==""){
          this.searchState=false;
        }
      
    },
    changeStyle(){
      this.searchState =true;
      if(document.getElementsByTagName("input")[0].value!=""){
          this.$router.push({path:'/bukongjiansuo/jiansuochaxun',query: {searchInfo: this.searchInfo}});
        }
    },
    handleClickOutside() {
      this.$store.dispatch("CloseSideBar", { withoutAnimation: false });
    },
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        location.reload(); // 为了重新实例化vue-router对象 避免bug
        // this.$router.push('/');
      });
    },
    getExePath() {
      return shipinApi
        .getExePath()
        .then(res => res.data)
        .then(data => {
          console.log(data)
          this.exeUrl = data;
        })
    },
    gotoWorkspace() {
      this.$router.push({path:'/gongzuotai/gongzuotai'});
    },
    showDownload() {
      this.isDownload = !this.isDownload;
    },
    showSetting() {
      // this.isSetting = !this.isSetting;
    },
    showMore() {
      this.isMore = !this.isMore;
      this.isDownload = false;
    },
    hideDownload() {
      this.isDownload = false;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
.header {
  height: 60px;
  background-color: #fff;
}
.headerdec {
  color: #333;
  line-height: 60px;
  padding-left: 20px;
}
.title-icon {
  max-width: 40px;
  max-height: 40px;
  margin-right:10px;
}
.header-right {
  float: right;
  // min-width: 200px;
}
.header-icon {
  display: inline-block;
  width: 100px;
  height: 60px;
  // text-align: center;
  cursor:pointer;
  color: #777777;
}
.header-icon.active {
  color: #12b1e1;
}
.header-icon:hover {
  color: #43D0FA;
}
.el-dropdown:focus {
  border: none;
}
.header-icon svg {
  font-size: 20px;
}
.download:focus,.header-icon:focus {
  border: none;
  outline: none;
}
.dropdown-container {
  width:160px;
  height: 50px;
  line-height: 50px;
  display: block;
  padding: 0 10px;
  text-align: left;
  .dropdown-wrapper {
    cursor: pointer;
    position: relative;
    .user-dropdown {
      width: 30px;
      height: 30px;
      border-radius: 20px;
      background-color: #fff;
    }
  }
}
.down-idx {
  display: inline-block;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  color: #fff;
  background: #8C9CAE;
}
.download-item li {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 50px;
}
.shipin-icon {
  display: inline-block;
  width: 40px;
  height: 36px;
  background: url('/static/image/home/shipin-icon.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: auto 100%;
  margin: 0 10px 0 15px;
}
.fr {
  margin-left: 30px;
}

.f-nav-right {
    float: right;
}
.f-nav-search-part {
    padding-right: 10px;
}
.f-nav {
    display: inline-block;
    vertical-align: middle;
    height: 32px;
    margin-right:30px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    font-size: 14px;
    color: #fff;
    cursor: pointer;
    // background: #f5f5f5;
    border-radius: 3px;
}

.f-nav-search-cont {
    opacity: 0;
    width: 0;
    height: 28px;
    color: #333;
    background: #f5f5f5;
    border: 0;
    transition: width .2s,opacity .2s;
    font-size: 14px;
    vertical-align: top;
    
}
.f-nav-search-cont::placeholder {
  color: #ccc;
}

.displayInput{
  opacity: 1;
  width: auto;
  padding: 0 5px;
}

.ai-icon-search {
    cursor: pointer;
}
.ai-icon-search {
    display: inline-block;
    vertical-align: middle;
    font-size: 16px;
}
.f-nav-search-focused .f-nav-search-cont {
    opacity: 1;
    width: 230px;
    background-color: #565656;
    outline: 0;
}
.f-nav-search-cont:focus {
  outline: 0 none;
}
.ai-icon {
    font-family: ai-icons!important;
    speak: none;
    font-style: normal;
    font-weight: 400;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.ai-icon-search:before {
    content: "\E901";
}

.search-icon{
  font-size: 20px;
  color: #000;
  float: right;
  height: 28px;
  line-height: 28px;
  padding: 0 5px;
}

.displayInput~.search-icon{
  background: #f5f5f5;
}
</style>
