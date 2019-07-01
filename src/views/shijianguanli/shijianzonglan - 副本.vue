<template>
<div class="content-body add-control">
    <div class="page-bread">
      <el-breadcrumb>
        <el-breadcrumb-item>事件总览</el-breadcrumb-item>
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
                    <!-- <span class="fa fa-user-o"></span>  -->
                    总量</p>
                  <span class="spanman">
                    <strong class="num">{{totalcount}}</strong> 件</span>
                </div>
                <div class="item-bukong">
                  <p class='bukong-type'>
                    <span></span> 已处置</p>
                  <span class="spanman">
                    <strong class="num">{{residentcount}}</strong> 件</span>
                </div>

                <div class="item-bukong">
                  <p class='bukong-type'>
                    <span></span> 未处置</p>
                  <span class="spanman">
                    <strong class="num">{{floatingcount}}</strong> 件</span>
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
              <div tag="div" id="addcontroldiv" class="ic_bukongbtn dizhiluru" @click="showNewMessageBox">
              </div>
            </div>
            <div class="fn-bls">
              <!-- <router-link tag="div" id="controlyjdiv" class="ic_bukongbtn piliangdaoru" v-bind:to="'#'">
              </router-link> -->
              <div class="ic_bukongbtn piliangdaoru">
                <el-upload class="pl-upload avatar-uploader" action="#" ref="uploadfilepl" :show-file-list="false" :auto-upload="false" :on-change='plchangeUpload' accept=".xls,.xlsx" drag>
                  <div class="avatar-uploader-idiv">
                    <i class="avatar-uploader-icon identity-batch"></i>
                    <div v-if="plfileUrl" class="avatar-uploader-p" style="font-size:16px">
                      {{plfileUrlname}}
                      <div class="face-modal"></div>
                    </div>
                    <!-- <p v-else>
                      <span style="font-size:16px">上传附件</span>
                    </p> -->
                  </div>
                  <label class="el-upload-list__item-status-label" v-show="pldeleteshow">
                  <span class="re-upload">重新上传</span>
                  </label>
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
       

      
      </div>
    </div>

    <div class="clearfix"> 
        <div id="tongji_tb">
          <div class="content-title">
            <span>事件情况</span>
          </div>
          <div style="margin:15px;display:flex;">
                 <div class="chart-item">
                     <sq-tsgary-statistics></sq-tsgary-statistics>
                  </div>
                  <div class="chart-item">
                       <sq-tsgary-statistics></sq-tsgary-statistics>    
                  </div>
                  <div class="chart-item">
                        <sq-tsgary-statistics></sq-tsgary-statistics>  
                  </div>

                  
            
          </div>

           <div style="margin:15px;display:flex;">
                 <div class="chart-item">
                    <sq-tsgary-statistics></sq-tsgary-statistics>
                  </div>
                  <div class="chart-item">
                       <sq-tsgary-statistics></sq-tsgary-statistics>    
                  </div>
                  <div class="chart-item">
                         <sq-zdry-statistics></sq-zdry-statistics> 
                  </div>

                  
            
          </div>

        </div>
        
    </div>
    
    
  </div>
</template>

<script>
import { excontrolApi } from "@/https";
import eventBus from "@/event";
import { eventCollection } from "@/event/resources";
import sqZdryStatistics from "@/components/charts/sqZdryStatistics";
import sqTsgaryStatistics from "@/components/charts/sqTsryStatistics";

export default {
  name: "shijianzonglan",
  data() {
    return {
      showpart: 1,
      searchKey: '',
      checkedTypes: [],
      anjianData:[{
        title: '天府三街持刀抢劫杀人案',
        time: '2018-11-09 21:22:22',
        position: '成都市高新区天府三街',
        src:'',
        about: '3',
        chuanbingan: '5',
        type: '1'
      },{
        title: '天府三街持刀抢劫杀人案',
        time: '2018-11-09 21:22:22',
        position: '成都市高新区天府三街',
        src:'',
        about: '3',
        chuanbingan: '5',
        type: '2'
      },{
        title: '天府三街持刀抢劫杀人案',
        time: '2018-11-09 21:22:22',
        position: '成都市高新区天府三街',
        src:'',
        about: '3',
        chuanbingan: '',
        type: '3'
      },{
        title: '天府三街持刀抢劫杀人案',
        time: '2018-11-09 21:22:22',
        position: '成都市高新区天府三街',
        src:'',
        about: '3',
        chuanbingan: '5',
        type: '1'
      },{
        title: '天府三街持刀抢劫杀人案',
        time: '2018-11-09 21:22:22',
        position: '成都市高新区天府三街',
        src:'',
        about: '',
        chuanbingan: '5',
        type: '1'
      },{
        title: '天府三街持刀抢劫杀人案',
        time: '2018-11-09 21:22:22',
        position: '成都市高新区天府三街',
        src:'',
        about: '',
        chuanbingan: '',
        type: '2'
      },{
        title: '天府三街持刀抢劫杀人案',
        time: '2018-11-09 21:22:22',
        position: '成都市高新区天府三街',
        src:'',
        about: '3',
        chuanbingan: '',
        type: '3'
      },{
        title: '天府三街持刀抢劫杀人案',
        time: '2018-11-09 21:22:22',
        position: '成都市高新区天府三街',
        src:'',
        about: '',
        chuanbingan: '5',
        type: '1'
      },],
      srcrestotal: 0
    };
  },
  components: {
      "sq-zdry-statistics": sqZdryStatistics,
    "sq-tsgary-statistics": sqTsgaryStatistics,
  },
  mounted() {
    //    this.searchAnjian(1);
  },
  components: {
    
  },
  methods: {
    //控制tab显示
    togpart(val) {
      this.showpart = val;
    },
    searchAnjian(num) {

    },
  }
};
</script>
<style scoped>
.tongji_tb{
      width: calc(100% - 20px);
     float: left;
     border: 1px solid #d9dfe5;
}
.tb{
     width: calc(100% - 20px);
}
.chart-item {
    margin: 8px;
    width: calc(32% - 20px);
    float: left;
    min-height:250px;
    height: calc(50% - 100px);
    /* background: red; */
}

.fn-bls {
  display: block;
  width: 180px;
  margin: 5px 0 5px 50px;
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
  min-height: calc(100vh - 330px);
  margin-bottom: 10px;
  position: relative;
}
.model-hold {
  margin-bottom: 50px;
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
  background: url(../../../static/image/yibiaosishi/dizhi.png) no-repeat;
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
  width: 900px;
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
  padding: 0px;
  cursor: pointer;
}
.dizhiluru {
  background: url(../../../static/image/yibiaosishi/dizhiluru.png) no-repeat;
  background-size: auto 100%;
  background-position: left;
}
.piliangdaoru {
  background: url(../../../static/image/yibiaosishi/piliangdaoru.png) no-repeat;
  background-size: auto 100%;
  background-position: left;
}
.shujudaochu {
  background: url(../../../static/image/yibiaosishi/shujudaochu.png) no-repeat;
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
  flex: 1;
  justify-content: center;
}
.search-item {
  display: flex;
  margin-right: 100px;
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

.adddizhititle {
  width: 900px;
  border-bottom: 1px solid #D8DFE5;
  font-weight: bold;
  font-size:small;
}
/* ---------------------------------------布控首页结束-------------------------------- */
</style>