<template>
  <div id="contentbody" class="content-body">
    <div class="page-bread">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>事件管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-row">
      <div class="content-center">
        <div id="tongji">
          <div class="content-title">
            <span>事件情况</span>
          </div>
          <div style="margin:15px;display:flex;">
            <div id="zaikongliang" class="item_zaikongliang">
              <span class="icon_zaikongliang">事件</span>
              <div style="width:100%;height:100%">
                <div class="item-bukong">
                  <p class='bukong-type'>
                    <span></span> 总量</p>
                    <span class="spanman">
                      <strong class="num">{{totalCount}}</strong> 件
                    </span>
                </div>

                <div class="item-bukong">
                  <p class='bukong-type'>
                    <span></span> 已处理</p>
                    <span class="spanman">
                      <strong class="num">{{ishandel}}</strong> 件
                    </span>
                </div>

                <div class="item-bukong">
                  <p class='bukong-type'>
                    <span></span>未处理</p>
                    <span class="spanman">
                      <strong class="num">{{nohandel}}</strong> 件
                    </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="bukong">
          <div class="content-title">
            <span>事件操作</span>
          </div>
          <div class="row">
              <div class="fn-bls">
                <router-link tag="div" id="addcontroldiv" class="ic_bukongbtn add_bukong" v-bind:to="'/shijianguanli/shijianluru'">
              </router-link>
            </div>
            <div class="fn-bls">
            
              <div class="ic_bukongbtn piliangdaoru">
                <el-upload class="pl-upload avatar-uploader" action="#" ref="uploadfilepl" :show-file-list="false" :auto-upload="false" accept=".xls,.xlsx" drag>
                  <div class="avatar-uploader-idiv">
                    <i class="avatar-uploader-icon identity-batch"></i>
                    <!-- <div v-if="plfileUrl" class="avatar-uploader-p" style="font-size:16px">
                      {{plfileUrlname}}
                      <div class="face-modal"></div>
                    </div> -->
                    <!-- <p v-else>
                      <span style="font-size:16px">上传附件</span>
                    </p> -->
                  </div>
                  <!-- <label class="el-upload-list__item-status-label" v-show="pldeleteshow">
                  <span class="re-upload">重新上传</span>
                  </label> -->
                </el-upload>
              </div>
            </div>
            <div class="fn-bls">
              <router-link tag="div" id="controlyjdiv" class="ic_bukongbtn shujudaochu" v-bind:to="'#'">
              </router-link>
            </div>
          </div>
        </div>
        <div class="clearfix"></div>
        <div id="bukongsearch" style="margin:20px 0;">
          <div class="content-title">
            <span>统计信息</span>
            <span style="float:right;">
                    <el-radio-group v-model="radio3" size="mini" text-color="white" fill="#12b1e1" @change="elchange">
                      <el-radio-button label="近一月"></el-radio-button>
                      <el-radio-button label="近半年"></el-radio-button>
                     
                    </el-radio-group>
              </span>
          </div>
          <!-- <div style="margin-top:20px;padding:0 10px;">
            <div class="search-group">
              <div class="search-item">
                    <el-radio-group v-model="radio3" @change="elchange">
                      <el-radio-button label="近一月"></el-radio-button>
                      <el-radio-button label="近半年"></el-radio-button>
                     
                    </el-radio-group>
              </div>
              
            </div>
            

          </div> -->

          <div id="" style="margin-top:10px;height:calc(100% - 100px);">
             
                    <!-- <div class="chart-item">
                         <sjxqsjtj :timeControl="timeChange"></sjxqsjtj>
                    </div> -->
                    <div class="chart-item">
                       <sjxqsjfltj :timeControl="timeChange"></sjxqsjfltj>
                    </div>
                    <!-- <div class="chart-item">
                       <sjflzb :timeControl="timeChange"></sjflzb>
                    </div> -->
                    <div class="chart-item">
                         <sjzasjtbhb :timeControl="timeChange"></sjzasjtbhb>
                    </div>
                    <div class="chart-item">
                        <sjsfsjdtj :timeControl="timeChange"></sjsfsjdtj>
                    </div>
                    <div class="chart-item">
                        <sjglxsjqs :timeControl="timeChange"></sjglxsjqs>
                    </div>
               
              
          </div>
        </div>
        <div class="clearfix"></div>
        <div>
          <xiangguanshijian-details></xiangguanshijian-details>
        </div>  
      </div>
    </div>
  </div>
</template>

<script>
import { excontrolApi, propertyApi, shijianApi } from "@/https";
import sjsfsjdtj from "@/components/charts/sjsfsjdtj";
import sjxqsjtj from "@/components/charts/sjxqsjtj";
import sjxqsjfltj from "@/components/charts/sjxqsjfltj";
import sjflzb from "@/components/charts/sjflzb";
import sjzasjtbhb from "@/components/charts/sjzasjtbhb";
import sjglxsjqs from "@/components/charts/sjglxsjqs";
import shijianSearch from "@/views/shijianguanli/shijianSearch";

export default {
  name: "shijianzonglan",
  data() {
    return {
      radio3:'近一月',
      timeChange:1,
      totalCount:'',
      ishandel:'',
      nohandel:'',
    };
  },
   components: {
   "sjsfsjdtj": sjsfsjdtj,
   "sjxqsjtj": sjxqsjtj,
   "sjxqsjfltj": sjxqsjfltj,
   "sjzasjtbhb": sjzasjtbhb,
    "sjflzb": sjflzb,
   "sjglxsjqs": sjglxsjqs,
   "xiangguanshijian-details": shijianSearch,
  },
  mounted() {
      this.getcontrolstate();
  },
  methods: {
    elchange(value){
      if(value=="近一月")
      {
        this.timeChange = 1;
      }
      else if(value=="近半年"){
        this.timeChange = 2;
      }
    },
    getcontrolstate(){
        // let param = {};
        // param.username = this.loginForm.username;
        // param.password = this.loginForm.password;
        return excontrolApi
        .getEventstatus({})
        .then(res => res)
        .then(data => {
            if(data.code==200)
            {
              this.totalCount = data.data.总量;
              this.ishandel = data.data.已处理;
              this.nohandel = data.data.未处理;
            }
        })
    },
  }
};
</script>

<style scoped>
.chart-item {
    margin: 10px;
    width: calc(25% - 20px);
    float: left;
    min-height:220px;
    height: calc(50% - 30px);
    /* background: red; */
}
.fn-bls {
  display: block;
  width: 30%;
  max-width: 220px;
  margin: 5px 3% 5px 0;
  float: left;
}
strong {
  font-weight: normal;
}
.dropdown-menu.force-to-show {
  display: block;
}

input[type="radio"] {
  margin: 8px 0 0;
}

/* padding */

.padding-5 {
  padding-left: 5px;
  padding-right: 5px;
}

.marginb-10 {
  margin-bottom: 10px;
}

/* 改写row,去掉margin */

.row {
  margin: 15px;
}

/* 加粗的span */

.ic_strongspan {
  font-size: 15rem;
  font-weight: bold;
  padding-right: 10px;
}

/* 设定div高度 */

.ic_linediv {
  /* line-height: 60px;
min-height: 60px; */
  line-height: 32px;
  min-height: 32px;
  padding: 10px 0;
}

/* 设定对象添加div */

.ic_objectadd {
  margin: 10px 0px;
}

/* 设定靠底部的a */

.ic_abottom {
  text-decoration: underline;
  position: absolute;
  bottom: 0px;
  padding-left: 10px;
  width: 100px;
  color: #13b1e1;
}

/* 勾选框样式修正 */

.ic_objcheck {
  margin: 20px -20px 0 !important;
}

/* 档案div */

.ic_record {
  line-height: 32px;
  padding: 20px 20px 0px 20px;
  /* margin-top: 20px; */
  /* border-top: 1px dashed #d9dfe5; */
}

/* 重写属性 */

.ic_panel-title {
  font-size: 14px;
}

/* 布控要素行 */

.ic_yaosutable {
  display: table;
  border: 1px solid #dcebf7;
  width: 100%;
}

.ic_yaosurow {
  display: table-row;
}

.ic_yaosuname {
  text-align: right;
  padding: 6px 10px 6px 4px;
  vertical-align: middle;
  display: table-cell;
  background-color: #edf3f4;
  border-top: 1px solid #f7fbff;
  min-width: 90px;
}

.ic_yaosuvalue {
  padding-left: 12px;
  padding: 6px 4px 6px 6px;
  display: table-cell;
  width: 40%;
}

/* ---------------------------------------布控首页-------------------------------- */
.content-body {
  height:100%;
}
.content-row {
  height: calc(100% - 50px);
}
.content-center {
  height: 100%;
}
.model-hold {
  /* margin-bottom: 50px; */
}
#tongji,
#bukong,
#bukongsearch {
  width: 100%;
  border: 1px solid #d9dfe5;
  box-sizing: border-box;
  background: #fff;
}
#tongji,#bukong {
  width: calc(50% - 10px);
  float: left;
}
#bukong {
  float: right;
}
#bukongsearch {
  /* height: calc(100% - 230px); */
  height: 300px;
  margin-bottom: 10px;
  position: relative;
}
.item-bukong {
  width: 33.3%;
  height: 80px;
  margin: 10px 0;
  padding: 0 30px;
  border-right: 1px solid #d9dfe5;
  float: left;
  box-sizing: border-box;
}
.item-bukong:last-child {
  border-right: none;
}
.item-bukonglg {
  width: 40%;
  height: 80px;
  margin: 10px 0;
  padding: 0 10px;
  border-right: 1px solid #d9dfe5;
  float: left;
  box-sizing: border-box;
}
.item-bukonglg:last-child {
  border-right: none;
}
.bukong-type {
  height: 40px;
  line-height: 40px;
  margin:0;
}
.icon_zaikongliang {
  width: 268px;
  height: 100px;
  display: block;
  background: url(../../../static/image/bukong/zaikongliang.png) no-repeat;
  background-color: #13b1e1;
  background-position: 40px center;
  float: left;
  padding-left: 100px;
  line-height: 100px;
  font-size: 18px;
  color: #fff;
}
.item_zaikongliang {
  height: 100px;
  width: 100%;
  display: flex;
  border: 1px solid #d9dfe5;
  margin: 5px 0;
  overflow: hidden;
  border-bottom-left-radius: 4px;
  border-top-left-radius: 4px;
}
.icon_zaikongliang:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
}
.num {
  font-size: 20px;
  font-weight: bold;
}
.spanman {
  width: 100%;
  height: 40px;
  background-color: #fff;
  color: #555;
  font-size: 16px;
  text-align: left;
  display: inline-block;
  margin:0;
}
/* 操作div */

.ic_bukongbtn {
  width: 100%;
  height: 100px;
  margin: 0 auto;
  padding: 10px 0px;
  cursor: pointer;
}
.add_bukong {
  background: url(../../../static/image/shijian/shijianluru.png) no-repeat;
  background-size: auto 100%;
  background-position: left;
}
.piliangdaoru {
  background: url(../../../static/image/shijian/piliangdaoru.png) no-repeat;
  background-size: auto 100%;
  background-position: left;
}
.shujudaochu {
  background: url(../../../static/image/shijian/shujudaochu.png) no-repeat;
  background-size: auto 100%;
  background-position: left;
}
.btn-info {
  background-color: #13b1e1;
  border: none;
  margin: 0 15px;
}
.btn-info:hover {
  border: none;
  outline: none;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
}
.btn-info:focus,
.btn-info:active,
.btn-info:visited {
  border: none;
  outline: none;
  background-color: #13b1e1;
}
.btn-search {
  min-width: 100px;
}
.search-group {
  display: flex;
  /* justify-content: center; */
  flex: 1;
}
.search-item {
  display: flex;
  margin-right: 20px;
  flex-direction: row;
  flex: 0 1 auto;
  justify-content: center;
  align-items: center;
}
.search-item .label {
  width: 80px;
  color: #595959;
  font-weight: normal;
  font-size: 100%;
}
.redText {
  color: red;
}
/* ---------------------------------------布控首页结束-------------------------------- */
</style>