<template>
  <div class="head-hold">
    <div class="top-menu-hold" style="margin-right: 20px;">
      <!-- 发版更换 -->
      <img src="/static/image/public/quanping.png" class="togglefull" v-show="!isExit" @click="isExit=true;fullScreen()"/>
      <img src="/static/image/public/tuichuquanping.png" class="togglefull" v-show="isExit"  @click="isExit=false;exitFullScreen()"/>
      <img src="/static/image/public/zhuye.png" @click="isExit=true;exitFullScreen();secRet()"/>
      <!-- <router-link tag="img" to="/dashboard/whome" src="/static/image/public/zhuye.png"></router-link> -->
    </div>
  
    <!-- <div class="my-custom-hold">
    
      <img src="/static/image/public/changtai.png">
      <div class="custom-wrap">
        <ul class="custom-ls">
          <li class="groupadmin"><div class="li-con"><span class="bl-ic"></span><p class="bl-ti">群体专题管理</p></div></li>
          <li class="ruleadmin"><div class="li-con"><span class="bl-ic"></span><p class="bl-ti">模型规则管理</p></div></li>
          <li class="modulearchive"><div class="li-con"><span class="bl-ic"></span><p class="bl-ti">模型档案</p></div></li>
          <li class="roleadmin"><div class="li-con"><span class="bl-ic"></span><p class="bl-ti">用户角色管理</p></div></li>
          <li class="concatshow"><div class="li-con"><span class="bl-ic"></span><p class="bl-ti">对接展示</p></div></li>
        </ul>
        <a class="edit-btn">编辑</a>
      </div>
    </div> -->

  </div>
</template>

<script>
export default {
  name: 'AppHead1',
  data() {
    return {
      isExit: false
    }
  },
  methods:{
    secRet() {
      this.$router.push({path:'/dashboard/home'});
    },

  }
};

</script>

<style scoped>
.head-hold {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
.emblem-hold {
  position: absolute;
  width: 42px;
  height: 42px;
  left: 20px;
  top: 14px;
  background-repeat: no-repeat;
}
.prod-name {
  position: absolute;
  height: 30px;
  line-height: 30px;
  left: 74px;
  top: 20px;
  font-family: 'SimHei';
  font-size: 19px;
  font-weight: 600;
  color: #323232;
}

.rt-sec {
  position: absolute;
  width: 160px;
  height: 100%;
  right: 72px;
  top: 0;
  cursor: pointer;
}
.rt-sec .avatar-wp {
  position: absolute;
  width: 40px;
  height: 40px;
  /*left: 24px;*/
  top: 15px;
  border-radius: 50%;
  overflow: hidden;
}
.rt-sec .avatar-wp img {
  display: block;
  width: 100%;
  height: 100%;
}
.rt-sec .txt-para {
  position: absolute;
  box-sizing: border-box;
  width: 112px;
  height: 20px;
  padding-right: 14px;
  padding-left: 8px;
  top: 25px;
  right: 17px;
  line-height: 20px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rt-sec .txt-para:after {
  position: absolute;
  display: block;
  width: 14px;
  height: 20px;
  top: 0;
  right: 5px;
  font-family: fontawesome;
  font-size: 16px;
  content: '\f107';
}
.rt-sec .rt-ls {
  position: relative;
  display: none;
  width: 100%;
  margin: 70px 0 0;
  line-height: 44px;
  border-radius: 2px;
  font-size: 12px;
  overflow: hidden;
  z-index: 9;
  border: 1px solid #c8c8c8;
  border-top: none;
  background: #fff;
}
.rt-sec:hover .rt-ls {
  display: block;
}
.rt-sec .rt-ls > li {
  position: relative;
  display: block;
  box-sizing: border-box;
  width: 100%;
  height: 44px;
  padding-left: 45px;
}
.rt-sec .rt-ls > li:before {
  position: absolute;
  display: block;
  width: 24px;
  height: 34px;
  top: 0;
  left: 15px;
  text-align: center;
  font-family: fontawesome;
  font-size: 16px;
}
.rt-sec .rt-ls > li:nth-of-type(1):before {
  content: '\f013';
}
.rt-sec .rt-ls > li:nth-of-type(2):before {
  content: '\f2be';
}
.rt-sec .rt-ls > li:nth-of-type(3):before {
  content: '\f011';
}
.rt-sec .rt-ls > li:nth-of-type(4):before {
  content: '\f023';
}

.my-custom-hold {
  position: absolute;
  box-sizing: border-box;
  width: 71px;
  height: 71px;
  right: 0;
  top: 0;
  text-align: center;
  z-index: 9;
}
.my-custom-hold .ic-con {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 70px;
  font-family: fontawesome;
  font-size: 26px;
  color: #0eb7eb;
}
.my-custom-hold .ic-con:after {
  content: '\f00a';
}

.my-custom-hold .custom-wrap {
  position: absolute;
  display: none;
  box-sizing: border-box;
  width: 415px;
  padding: 10px;
  right: 0;
  top: 71px;
  background: #fff;
  border-left: 1px solid #c8c8c8;
  border-bottom: 1px solid #c8c8c8;
}

.my-custom-hold:hover .custom-wrap {
  display: block;
}

.custom-wrap .custom-ls {
  display: block;
  box-sizing: border-box;
  padding: 0 2px;
}
.custom-wrap .custom-ls:after {
  display: block;
  content: '';
  clear: both;
}
.custom-wrap .custom-ls > li {
  display: block;
  width: 130px;
  height: 130px;
  float: left;
}
.custom-wrap li.groupadmin {
  color: #ff5519;
}
.custom-wrap li.ruleadmin {
  color: #0eb7eb;
}
.custom-wrap li.modulearchive {
  color: #0eb7eb;
}
.custom-wrap li.roleadmin {
  color: #f9bc5e;
}
.custom-wrap li.concatshow {
  color: #5ac78f;
}

.custom-wrap li.groupadmin .bl-ic {
  background: #ff5519;
}
.custom-wrap li.ruleadmin .bl-ic {
  background: #0eb7eb;
}
.custom-wrap li.modulearchive .bl-ic {
  background: #0eb7eb;
}
.custom-wrap li.roleadmin .bl-ic {
  background: #f9bc5e;
}
.custom-wrap li.concatshow .bl-ic {
  background: #5ac78f;
}

.custom-wrap .li-con {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
  cursor: pointer;
}

.custom-wrap .li-con:hover {
  background: #f5f5f5;
}

.custom-wrap .li-con .bl-ic {
  position: absolute;
  display: block;
  width: 50px;
  height: 50px;
  top: 25px;
  left: 40px;
  line-height: 50px;
  border-radius: 4px;
  font-family: fontawesome;
  font-size: 30px;
  color: #fff;
}

.custom-wrap .li-con .bl-ic:after {
  content: '\f29c';
}

.custom-wrap .li-con .bl-ti {
  line-height: 24px;
  margin-top: 90px;
  color: #535658;
}

.custom-wrap .li-con:hover .bl-ti {
  color: inherit;
}

.custom-wrap .edit-btn {
  display: block;
  box-sizing: border-box;
  width: 100%;
  height: 36px;
  line-height: 36px;
  margin-top: 10px;
  background: #f5f5f5;
}
.top-menu-hold {
  height: 100%;
  margin-right: 263px;
  text-align: center;
  color: #989da1;
  font-size: 16px;
  float: right;
}
.top-menu-hold img {
  cursor: pointer;
}
.top-menu-hold .top-anks {
  position: relative;
  display: block;
  width: 100px;
  height: 100%;
  cursor: pointer;
  float: left;
}
.top-menu-hold .top-anks.holo {
  box-sizing: border-box;
  width: 104px;
  padding-left: 51px;
  text-align: left;
}
.top-menu-hold .top-anks .numred {
  position: absolute;
  display: block;
  width: 18px;
  height: 18px;
  right: 2px;
  top: 12px;
  border-radius: 50%;
  line-height: 18px;
  font-size: 12px;
  color: #fff;
  background: #ff5519;
}
.top-menu-hold .holo .holo-ic {
  position: absolute;
  display: block;
  width: 40px;
  height: 40px;
  left: 15px;
  top: 15px;
  line-height: 40px;
  text-align: center;
  font-family: fontawesome;
}
.top-menu-hold .holo .holo-ic:after {
  content: '\f0b2';
}
.togglefull {
  width: 32px;
  margin: 10px 15px;
}

</style>