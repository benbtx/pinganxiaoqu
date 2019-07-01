<template>
<div class="content-body add-control">
    <div class="page-bread">
      <el-breadcrumb>
        <el-breadcrumb-item>实时监测</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="bl-content">
      <div class="content-left">
        <div class="qiye">
          
          <div class="panelTitle">企业点位 </div>

          <qiye-tree ref="qiyeTree">
              <!-- <template slot="selectStatus">
                    <div style='margin:10px'>
                        <span>选择状态：</span>
                        <el-select v-model="status" class="small" style="width:98px;"  @change="statusChange">
                          <el-option v-for="item in statuses" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </div>
              </template> -->
          </qiye-tree>
        </div>


      </div>
      <div class="content-right">
          <baidu-map ref="map" addtype="gs"  p_showXzq='true'></baidu-map>
      </div>


       <div class="pop">
        
        <el-dialog id="jcxq" title="监测详情" :visible.sync="jcxqpop" :before-close="resetData" width="100vw" top="0" class="modal-popover">
                <div class="jcxq_content"  style="height:calc(100vh - 100px)">
                      <div class="ryxxpop_jbitem">
                        <div class="cxjg_item_left cxjg_item_right" style="height:100%;width:40vw">
                             <!-- <div style="height:100%;">
                                 <img class="cxjg_item_left_img" style="margin-top: 15px;margin-left: 2px;max-height: 100px;min-height:80px" :src="BASE_IMG_URL+''"/>
                                  <div><el-button class="ckgxr" size="mini">查看关系人</el-button></div>
                             </div> -->
                            
                              <!-- <div style="height:160px;border:1px solid #d9dfe5;">
                                <p class="content-title">企业信息</p>
                                <div class="qiye-content">
                                  <p class="qiye-img"><img :src="BASE_IMG_URL+qiyeInfo.imgurl" /></p>
                                  <p class="qiye-name">{{qiyeInfo.name}}</p>
                                  <p class="qiye-info">行业类别：<span class="info-text">{{qiyeInfo.industry}}</span></p>
                                  <p class="qiye-info">地址：<span class="info-text">{{qiyeInfo.address}}</span></p>
                                  <p class="qiye-info">主要污染物来源：<span class="info-text">{{qiyeInfo.pollutions}}</span></p>
                                </div>
                              </div>
                             <div style="height:450px;margin-top:20px;"> <baidu-map-pop v-if='jcxqpop'  ref="map_pop"  :p_mapdefault='mapdefault' :p_isShowNavigation='false'  :p_isShowScale='false' ></baidu-map-pop></div>
                              -->

                          <div class="content-title">
                            <span @click="showSSJC" :class="{isActive: isShowSSJC}" style="cursor:pointer;">实时监测</span>
                            /
                            <span @click="showQYXX" :class="{isActive: !isShowSSJC}" style="cursor:pointer;">企业信息</span>
                          </div>
                          <div style="padding:15px 15px 0 15px;display:flex;width:100%;height:calc(100% - 30px);"> 
                            <div class="jc-content" v-show="isShowSSJC">

                              <div class="jc-title">
                                  <span>选择点位：</span>
                                  <el-select v-model="jcPoint" class="small" style="width:98px;">
                                    <el-option v-for="item in jcPoints" :key="item.id" :label="item.label" :value="item.value"></el-option>
                                  </el-select>

                                  <!-- <span>选择状态：</span>
                                  <el-select v-model="status" class="small" style="width:98px;"  @change="statusChange">
                                    <el-option v-for="item in statuses" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                  </el-select> -->
                                   <div class="tips">
                                    <span class="sel-tips" :class="{active:curSelStatus=='红'}" @click="selectByColor('1,1')"><span class="redBgColor"></span><span class="tips-text">超标</span></span>
                                    <span class="sel-tips" :class="{active:curSelStatus=='黄'}" @click="selectByColor('0,0')"><span class="orangeBgColor"></span><span class="tips-text">未生产</span></span>
                                    <span class="sel-tips" :class="{active:curSelStatus=='绿'}" @click="selectByColor('0,1')"><span class="greenBgColor"></span><span class="tips-text">生产中</span></span>
                                      <span class="sel-tips" :class="{active:curSelStatus==''}" @click="selectByColor('')"><span class="allBgColor"  ></span><span class="tips-text">全部</span></span>
                                   </div>
                                 
                              </div>
                              <div class="jc-chart" style='height:calc(100% - 240px);margin-top: 15px;'>
                                 <ssjc-chart ref="ssjcChart" code="a24088" :deviceCode="deviceCode" :initData="organizationTreeData"></ssjc-chart>
                              </div>
                              <el-table
                                  :data="tableData"
                                  border                              
                                  class="border-table"
                                  max-height="160"
                                  style="width: 100%;height:46%;margin-top:12px;">
                                  <el-table-column
                                    prop="name"
                                    label="检测项目"
                                    align="center"
                                    min-width="80"
                                    >
                                  </el-table-column>
                                  <el-table-column
                                    prop="rtd"
                                    label="检测值"
                                    align="center"
                                    min-width="80"
                                    >
                                  </el-table-column>
                                  <el-table-column
                                    prop="concentrationUnit"
                                    label="计量单位"
                                    align="center"
                                    min-width="80"
                                    >
                                    <template slot-scope="scope">
                                      <span>{{getEnUnit(scope.row.concentrationUnit)}}</span>        
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    label="操作"
                                    align="center"
                                    min-width="60"
                                    >
                                    <template slot-scope="scope">
                                      <span class="fa fa-bar-chart" style="cursor:pointer;" @click="showQushiChart(scope.row)" v-if="scope.row.code=='a24088' || scope.row.code=='a25002'||scope.row.code=='a25005'||scope.row.code=='a25003'"></span>                           
                                      <span v-else>--</span>
                                    </template>
                                  </el-table-column>
                                </el-table>

                            </div>  
                            <div class="jc-content" v-show="!isShowSSJC">
                                <div style="height:160px;border:1px solid #d9dfe5;">
                                  <p class="content-title">企业信息</p>
                                  <div class="qiye-content">
                                    <p class="qiye-img"><img :src="BASE_IMG_URL+qiyeInfo.imgurl" /></p>
                                    <p class="qiye-name">{{qiyeInfo.name}}</p>
                                    <p class="qiye-info">行业类别：<span class="info-text">{{qiyeInfo.industry}}</span></p>
                                    <p class="qiye-info">地址：<span class="info-text">{{qiyeInfo.address}}</span></p>
                                    <p class="qiye-info">主要污染物来源：<span class="info-text">{{qiyeInfo.pollutions}}</span></p>
                                  </div>
                                </div>

                                   <div style="height:calc(100% - 200px);margin-top:20px;"> <baidu-map-pop v-if='jcxqpop'  ref="map_pop"  :p_mapdefault='mapdefault' :p_isShowNavigation='false'  :p_isShowScale='false' ></baidu-map-pop></div>
                             
                            </div> 
                          </div>



                        </div>
                        <div class="cxjg_item_right" >
                          <div class="content-title">
                            <span @click="showNow" :class="{isActive: isShowNow}" style="cursor:pointer;">实时数据</span>
                            /
                            <span @click="showHistory" :class="{isActive: !isShowNow}" style="cursor:pointer;">历史数据</span>
                          </div>
                          <div style="padding:15px 15px 0 15px;display:flex;width:100%;height:calc(100% - 30px);">
                            <div class="jc-content" v-show="isShowNow"> 
                                <div class="shipin-content">
                                  <div class="shipin-item" :class="{maxwin: winNum==1,midwin: winNum==4}">
                                    <span v-if="shipinVisibility1" class="shipin-close" @click="closePlay(1)"><i class="fa fa-times-circle"></i></span>
                                    <videoPlayerBox v-if="shipinVisibility1" :sourceSrc="sourceSrc1" :sourceData="sourceData1" :playerState="playerState1" playType="rtmp"></videoPlayerBox>
                                  </div>
                                  <div class="shipin-item" :class="{midwin: winNum==4}">
                                    <span v-if="shipinVisibility2" class="shipin-close" @click="closePlay(2)"><i class="fa fa-times-circle"></i></span>
                                    <videoPlayerBox v-if="shipinVisibility2" :sourceSrc="sourceSrc2" :sourceData="sourceData2" :playerState="playerState2" playType="rtmp"></videoPlayerBox>
                                  </div>
                                  <div class="shipin-item" :class="{midwin: winNum==4}">
                                    <span v-if="shipinVisibility3" class="shipin-close" @click="closePlay(3)"><i class="fa fa-times-circle"></i></span>
                                    <videoPlayerBox v-if="shipinVisibility3" :sourceSrc="sourceSrc3" :sourceData="sourceData3" :playerState="playerState3" playType="rtmp"></videoPlayerBox>
                                  </div>
                                  <div class="shipin-item" :class="{midwin: winNum==4}">
                                    <span v-if="shipinVisibility4" class="shipin-close" @click="closePlay(4)"><i class="fa fa-times-circle"></i></span>
                                    <videoPlayerBox v-if="shipinVisibility4" :sourceSrc="sourceSrc4" :sourceData="sourceData4" :playerState="playerState4" playType="rtmp"></videoPlayerBox>
                                  </div>
                                </div>
                            </div>
                            <div class="jc-content" v-show="!isShowNow"> 
                              <div class="jc-title">
                                <span>选择时间段：</span>
                                <el-date-picker
                                  v-model="jctime"
                                  type="daterange"
                                  value-format="yyyy-MM-dd"
                                  range-separator="至"
                                  start-placeholder="开始日期"
                                  end-placeholder="结束日期"
                                  style="width:200px;padding-right:0;"
                                  >
                                </el-date-picker>
                                <span>选择点位：</span>
                                <el-select class="small" v-model="jcPoint" style="width:98px;">
                                  <el-option v-for="item in jcPoints" :key="item.id" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                                <button type="button" class="btn btn-info" @click="searchHistory(1)">查询</button>
                              </div>

                              <el-table
                                :data="tableDataHistory"
                                border
                                class="border-table"
                                max-height="480"
                                style="width: 100%;margin-top:15px;font-size:12px;">
                                <el-table-column
                                  prop="date"
                                  label="检测时间"
                                  align="center"
                                  min-width="120">
                                    <template slot-scope="scope">
                                      <span>{{getFormatDate(scope.row.date,'YYYY-MM-DD HH:mm')}}</span>                                   
                                    </template>
                                </el-table-column>
                                <el-table-column label="非甲烷总烃（mg/m³）" align="center">
                                  <el-table-column
                                    prop="a24088value"
                                    label="检测值"
                                    align="center"
                                    min-width="66">
                                  </el-table-column>
                                  <el-table-column
                                    prop="a24088state"
                                    label="检测结果"
                                    align="center"
                                    min-width="70">
                                    <template slot-scope="scope">
                                      <span :class="{green: scope.row.a24088state=='正常',yellow: scope.row.a24088state=='轻度超标',orange: scope.row.a24088state=='中度超标',red: scope.row.a24088state=='重度超标',}">{{scope.row.a24088overValue}}</span>                                   
                                    </template>
                                  </el-table-column>
                                </el-table-column>
                                <el-table-column label="苯（mg/m³）" align="center">
                                  <el-table-column
                                    prop="a25002value"
                                    label="检测值"
                                    align="center"
                                    min-width="66">
                                  </el-table-column>
                                  <el-table-column
                                    prop="a25002state"
                                    label="检测结果"
                                    align="center"
                                    min-width="70">
                                    <template slot-scope="scope">
                                      <span :class="{green: scope.row.a25002state=='正常',yellow: scope.row.a25002state=='轻度超标',orange: scope.row.a25002state=='中度超标',red: scope.row.a25002state=='重度超标',}">{{scope.row.a25002overValue}}</span>                                   
                                    </template>
                                  </el-table-column>
                                </el-table-column>
                                <el-table-column label="甲苯（mg/m³）" align="center">
                                  <el-table-column
                                    prop="a25003value"
                                    label="检测值"
                                    align="center"
                                    min-width="66">
                                  </el-table-column>
                                  <el-table-column
                                    prop="a25003state"
                                    label="检测结果"
                                    align="center"
                                    min-width="70">
                                    <template slot-scope="scope">
                                      <span :class="{green: scope.row.a25003state=='正常',yellow: scope.row.a25003state=='轻度超标',orange: scope.row.a25003state=='中度超标',red: scope.row.a25003state=='重度超标',}">{{scope.row.a25003overValue}}</span>                                   
                                    </template>
                                  </el-table-column>
                                </el-table-column>
                                <el-table-column label="二甲苯（mg/m³）" align="center">
                                  <el-table-column
                                    prop="a25005value"
                                    label="检测值"
                                    align="center"
                                    min-width="66">
                                  </el-table-column>
                                  <el-table-column
                                    prop="a25005state"
                                    label="检测结果"
                                    align="center"
                                    min-width="70">
                                    <template slot-scope="scope">
                                      <span :class="{green: scope.row.a25005state=='正常',yellow: scope.row.a25005state=='轻度超标',orange: scope.row.a25005state=='中度超标',red: scope.row.a25005state=='重度超标',}">{{scope.row.a25005overValue}}</span>                                   
                                    </template>
                                  </el-table-column>
                                </el-table-column>
                              </el-table>
                              <el-pagination style="bottom:0;" @current-change="searchHistory" :current-page='curPage' :page-size="12" layout="total, prev, pager, next" :total="srcrestotal">
                              </el-pagination>

                            </div>
                          </div>
                        </div>
                      </div>
                </div>

         

        </el-dialog>

        <el-dialog id="jcxq_mouseover" title="详细" :visible.sync="jcxqpop_mouseover" width="20%" class="modal-popover">
          <div class="jcxq_content" style="height:200px">


          </div>

        </el-dialog>
        <el-dialog :visible.sync="isShowQushiChart" width="600px" append-to-body class="modal-chart" top="30vh">
          <div class="chart_content" style="height:300px">
              <nmhc-chart v-if="isShowQushiChart" ref="nmhcChart" :code="curCode" :deviceCode="deviceCode" :tempdata='tempdata'></nmhc-chart>
          </div>
        </el-dialog>
       
    </div>

    </div>
  </div>
</template>

<script>
import qiyeTree from "@/components/shipin/qiyeTree";
import { shipinApi,tmpApi } from "@/https";
import eventBus from "@/event";
import { eventCollection } from "@/event/resources";
import baidumap from '@/components/baidumap/mapInitHBJC';
import baidumappop from '@/components/baidumap/mapInitHBJC_pop';
import nmhcStatistics from '@/components/charts/NMHCStatistics';
import benStatistics from '@/components/charts/benStatistics';
import jiabenStatistics from '@/components/charts/jiabenStatistics';
import erjiabenStatistics from '@/components/charts/erjiabenStatistics';

import SSJCStatistics from '@/components/charts/SSJCStatistics';
import videoPlayerBox from "@/components/shipin/videoPlayer";

export default {
  name: "shishijiance",
  data() {
    return {
      activeName: "first",
      jcxqpop:false,
      jcxqpop_mouseover:false,
      mapdefault:{
       pop_lng:104.072314,
       pop_lat:30.6632,
       pop_zoom:15,
       gsid:0
      },
     
      bbtime: [this.getFormatDateYear(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7)),this.getFormatDateYear(new Date())],
      isShowNow: true,
      isShowSSJC: true,
      qiyeInfo: {
        name:'',
        address: '',
        industry:'',
        pollutions:''
      },
      jcPoints: [],
      jcPoint: '',

      statuses:[{label:"全部",value:-1},{label:"未生产",value:0},{label:"生产中",value:1},{label:"排放超标",value:2}],
      status: '全部',
       
      updateTime: '',
      // tableData:[],
      tableData:[{
                baseId:"SYBCESHI301",code:"a24088",concentrationUnit:"毫克/立方米",name:"非甲烷总烃",recordTime:"2019-04-11T23:01:21.000+0000",rtd:'--'                             
             },{
               baseId:"SYBCESHI301",code:"a25002",concentrationUnit:"毫克/立方米",name:"苯",recordTime:"2019-04-11T23:01:21.000+0000",rtd:'--'                             
             },{
               baseId:"SYBCESHI301",code:"a25005",concentrationUnit:"毫克/立方米",name:"二甲苯",recordTime:"2019-04-11T23:01:21.000+0000",rtd:'--'             
             },{
               baseId:"SYBCESHI301",code:"a25003",concentrationUnit:"毫克/立方米",name:"甲苯",recordTime:"2019-04-11T23:01:21.000+0000",rtd:'--'                             
             },{
               baseId:"SYBCESHI301",code:"a01011",concentrationUnit:"米/秒",name:"烟气流速",recordTime:"2019-04-11T23:01:21.000+0000",rtd:'--'
             },{
               baseId:"SYBCESHI301",code:"a01012",concentrationUnit:"摄氏度",name:"烟气温度",recordTime:"2019-04-11T23:01:21.000+0000",rtd:'--'
             },{
               baseId:"SYBCESHI301",code:"a01013",concentrationUnit:"千帕",name:"烟气压力",recordTime:"2019-04-11T23:01:21.000+0000",rtd:'--'            
             },{
               baseId:"SYBCESHI301",code:"a01014",concentrationUnit:"%",name:"烟气湿度",recordTime:"2019-04-11T23:01:21.000+0000",rtd:'--'                            
             },{
               baseId:"SYBCESHI301",code:"a05002",concentrationUnit:"纳克/立方米",name:"甲烷",recordTime:"2019-04-11T23:01:21.000+0000",rtd:'--'             
             }
             ],
      jctime: [this.getFormatDateYear(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 3)),this.getFormatDateYear(new Date())],
      tableDataHistory: [],
      deviceCode: [],
      indexs:[],
      srcrestotal: 0,
      curPage: 0,
      pointerWarning: false,
      organizationTreeData:null,
      interval:0,
      isShowQushiChart: false,
      curCode: '',

      shipinVisibility1: false,
      shipinVisibility2: false,
      shipinVisibility3: false,
      shipinVisibility4: false,
      sourceSrc1: 'rtmp://10.3.9.153:1935/live/805642093',
      sourceSrc2: '',
      sourceSrc3: '',
      sourceSrc4: '',
      sourceData1: {
        tabUUID: '',
        tollgateID: '',
        isSelNone: false,
        num: 1
      },
      sourceData2: {
        tabUUID: '',
        tollgateID: '',
        isSelNone: false,
        num: 2
      },
      sourceData3: {
        tabUUID: '',
        tollgateID: '',
        isSelNone: false,
        num: 3
      },
      sourceData4: {
        tabUUID: '',
        tollgateID: '',
        isSelNone: false,
        num: 4
      },
      playerState1: false,
      playerState2: false,
      playerState3: false,
      playerState4: false,
      winNum: 1,
      curWindow: 1,
      curVideoId: '',
      curSelStatus:'',
      curcompany:"",
      curcameraid:"",
      isbj:0,
      tempdata:[{name:'a24088',data:{}},{name:'a25002',data:{}},{name:'a25005',data:{}},{name:'a25003',data:{}}],
     
       

    };
  },
  mounted() {
  },
  watch: {
    jcPoint(val) {
      if (val) {
        this.updateTime = this.getFormatDate(new Date(),'YYYY-MM-DD HH:mm');
        this.pointerWarning = false;
        this.$refs.ssjcChart.$el.style.display="block";
        this.getPositionDeviceIds(val);
        eventBus.$emit(eventCollection._selectPositionRefresh, {
          data:val,
        });
      }
    },
    pointerWarning(val) {
      console.log('超标状态由定时刷新获取的4个图表决定');
      console.log("是否超标:"+val);
      //更新筛选
      for(let i=0;i<this.jcPoints.length;i++) {
          if(this.jcPoint==this.jcPoints[i].value){
            if(val){
              //超标
              this.jcPoints[i].pollutionStatus=1;
              this.jcPoints[i].workingStatus=1;
            }else{
              //未超标
              this.jcPoints[i].pollutionStatus=0;
            }
          }

      }
      //更新ssjc中超标的文字颜色 
      eventBus.$emit(eventCollection._positionWarningRefresh, {id: this.jcPoint, value:val});
    }
  },
  created() {
    var that=this;
     //卡口树和视频树列表-->地图的操作
    eventBus
      .$off(eventCollection._mapMaker2Pop)
      .$on(eventCollection._mapMaker2Pop, (data) => {
        // this.setKakou(data, type);
        //跟新卡口状态
      
        // console.log(data);
        if(data.opt==1){
          this.jcxqpop_mouseover=true;
         
        }else if(data.opt==2){
          this.jcxqpop_mouseover=false;
        }else{
          // console.log(11);
          // console.log(data);
          // console.log(this);
          // console.log( this.mapdefault);
          // console.log( this.mapdefault.pop_lng);
          // console.log(22);
          this.jcxqpop=true;
          //定义循环
           // var _this=this;
          //30秒刷新一次 showNow
          // setInterval('alert("Hello");', 3000);
          //  setInterval(this.showNow(), 3000);
          // this.interval =setInterval('alert("Hello");', 3000);


          let _this = this;
          this.interval = setInterval(function(){
            // _this.showNow();
            _this.refresh();
          },30000);


          this.mapdefault.pop_lng=data.data.longitude;
          this.mapdefault.pop_lat=data.data.latitude;
           this.mapdefault.gsid=data.data.id;
           
          
          this.qiyeInfo.name=data.data.name;
          this.qiyeInfo.industry=data.data.industry;
          this.qiyeInfo.address=data.data.address;
          this.qiyeInfo.pollutions=data.data.pollutions;
          this.qiyeInfo.imgurl = data.data.imgurl;
  
          // this.getQyinfo(data.data.id); 
            this.curcompany=data.data.id;
          this.getPosition(data.data.id);
        }

       
        
    });

    eventBus
      .$off(eventCollection._positionRefresh)
      .$on(eventCollection._positionRefresh, (data) => {
        // this.setKakou(data, type);
        //跟新卡口状态
      
        console.log('-------------',data);
        this.getPositionDeviceIds(data.data.indexCode);
        
    });

    eventBus
      .$off(eventCollection._pointer_status_now)
      .$on(eventCollection._pointer_status_now, (val) => {
        console.log(111)
        this.pointerWarning = val;
        // eventBus.$emit(eventCollection._positionWarningRefresh, {id: this.jcPoint, value:val});
         console.log(this.pointerWarning);
    });
     
      // 监听关闭视频播放
    eventBus.$on(eventCollection._closeShipinDialog, () => {
      if (this.playerState2) {
        this.shipinVisibility2 = false;
        if (this.organizationId == this.sourceData1.tollgateID) {
          this.organizationId = '';
        }
      } else if (this.playerState3) {
        this.shipinVisibility3 = false;
        if (this.organizationId == this.sourceData1.tollgateID) {
          this.organizationId = '';
        }
      } else if (this.playerState4) {
        this.shipinVisibility4 = false;
        if (this.organizationId == this.sourceData1.tollgateID) {
          this.organizationId = '';
        }
      } else if (this.playerState1) {
        this.shipinVisibility1 = false;
        if (this.organizationId == this.sourceData1.tollgateID) {
          this.organizationId = '';
        }
      }
    });

    eventBus
      .$off(eventCollection.playVideoWeb)
      .$on(eventCollection.playVideoWeb, (data) => {
        // this.curVideoId = data.id;
        if (data.isOnline == '在线') {
          this.showVideo(data.id);
        } else {
          this.$message({
          message: '设备离线，无法播放！',
          type: 'error',  
          duration: 5 * 1000
        });
        }
    });


    eventBus
      .$off(eventCollection._pointRefresh)
      .$on(eventCollection._pointRefresh, (data) => {
          console.log('未生产，生产状态由推送的信息决定');
          console.log(data+";");
          console.log(11);
        // alert(data);
        // this.jcPoints = [];
        for(let i=0;i<that.jcPoints.length;i++) {
          if(that.jcPoint==that.jcPoints[i].value){
            if(data==0){
              that.jcPoints[i].pollutionStatus=0;
              that.jcPoints[i].workingStatus=0;
            }else if(data==1){
              that.jcPoints[i].pollutionStatus=0;
              that.jcPoints[i].workingStatus=1;
            }else if(data==2){
              that.jcPoints[i].pollutionStatus=1;
              that.jcPoints[i].workingStatus=1;
            }

          }
         
          // let obj = {};
          // obj.label = data[i].pointName;
          // obj.value = data[i].indexCode;
          // obj.pollutionStatus = data[i].pollutionStatus;
          // obj.workingStatus = data[i].workingStatus;
          // this.jcPoints.push(obj);
        }

        // if(data=){}
        //  this.getPosition2(this.curcompany);
         //查询更新点位状态
    });


  },
  beforeDestory() {
    
    eventBus.$off(eventCollection._pointRefresh, data => {
      // console.log(data);
    });
  },

  components: {
    "qiye-tree": qiyeTree,
    'baidu-map':baidumap,
    'baidu-map-pop':baidumappop,
    'nmhc-chart': nmhcStatistics,
    'ben-chart': benStatistics,
    'jiaben-chart': jiabenStatistics,
    'erjiaben-chart': erjiabenStatistics,

     'ssjc-chart': SSJCStatistics,
     "videoPlayerBox": videoPlayerBox,
  },
  methods: {
        selectByColor(states){
        // this.$refs.yuantree.filter(color);
        this.curSelStatus = states;
        var pollutions=states.split(',')[0];
        var work=states.split(',')[1];
        //当前点位
        //当前选中
        //所有点位数据 this.jcPoints;
        //this.jcPoint;
        if(states==""){ this.$refs.ssjcChart.$el.style.display="block";return;}
        for(var i=0;i< this.jcPoints.length;i++) {
          if(this.jcPoints[i].value==this.jcPoint){
            // if(pollutions==this.jcPoints[i].pollutionStatus&&work==this.jcPoints[i].workingStatus){
            //     //显示
            //       this.$refs.jcChart.style.display="block";
            // }else if(pollutions==this.jcPoints[i].pollutionStatus==1){
            //    //显示
            //      this.$refs.jcChart.style.display="block";
            // }else{
            //    //不显示
            //    this.$refs.jcChart.style.display="none";
            // }

             if(pollutions==1&&work==1){
               //选中污染
                if(pollutions==this.jcPoints[i].pollutionStatus&&work==this.jcPoints[i].workingStatus){
                    this.$refs.ssjcChart.$el.style.display="block";
                    //  this.$refs.ssjcChart.$el.style.visibility=true;
                }else{
                    this.$refs.ssjcChart.$el.style.display="none";
                    //  this.$refs.ssjcChart.$el.style.visibility=false;

                }
                
             }
             if(pollutions==0&&work==1){
               //选中生产
                 if(pollutions==this.jcPoints[i].pollutionStatus&&work==this.jcPoints[i].workingStatus){
                    this.$refs.ssjcChart.$el.style.display="block";
                 }else{
                    this.$refs.ssjcChart.$el.style.display="none";
                 }
                
             }
             if(work==0){
               //选中未生产
               if(work==this.jcPoints[i].workingStatus){
                  this.$refs.ssjcChart.$el.style.display="block";
               }else{
                  this.$refs.ssjcChart.$el.style.display="none";
               }
                
             }

          }

        }
        
  
    },

    statusChange(p,e){
      // alert(p);
      // eventBus.$emit(eventCollection._qyStatus,{data:p});
    },
    getPosition(id) {
      let _this = this;

      _this.jcPoints = [];
      _this.jcPoint = '';
      return shipinApi
        .getPointList(id)
        .then(res => res.data)
        .then(data => {
          // console.log(data);
            for(let i=0;i<data.length;i++) {
              let obj = {};
              obj.label = data[i].pointName;
              obj.value = data[i].indexCode;
              obj.pollutionStatus = data[i].pollutionStatus;
              obj.workingStatus = data[i].workingStatus;
              _this.jcPoints.push(obj);
            }
            _this.jcPoint = '';
            if (_this.jcPoints.length>0) {
              for(var i=0;i<_this.jcPoints.length;i++){
                if(_this.jcPoints[i].label=="一号点位"){
                    _this.jcPoint = _this.jcPoints[i].value;
                }
              }
             
            }


            // if (_this.isShowNow) {
            //   _this.refreshVideoData(); 
            // } else {
            // }
            // this.getPosition2(this.curcompany);

            // _this.jcPoint = '';
            // if (_this.jcPoints.length>0) {
            //      _this.jcPoint = data[0].pointName;
            // }
        })
        // .catch((err) => {
        //   this.$message({
        //     message: '获取公司点位失败！',
        //     type: 'error',  
        //     duration: 5 * 1000
        //   });
        // });
    },

    getPosition2(id) {
      let _this = this;

      _this.jcPoints = [];
    
      return shipinApi
        .getPointList(id)
        .then(res => res.data)
        .then(data => {
          // console.log(data);
            _this.jcPoints = [];
            for(let i=0;i<data.length;i++) {
              let obj = {};
              obj.label = data[i].pointName;
              obj.value = data[i].indexCode;
              obj.pollutionStatus = data[i].pollutionStatus;
              obj.workingStatus = data[i].workingStatus;
              _this.jcPoints.push(obj);
            }

            // if (_this.isShowNow) {
            //   _this.refreshVideoData(); 
            // } else {
            // }
            
           
        })
        
    },

    getPositionDeviceIds(id) {
      let _this = this;
      _this.jcPoint = id;
      _this.deviceCode = [];
       _this.indexs = [];

      return shipinApi
        .getPositionDeviceList(id)
        .then(res => res.data)
        .then(data => {
          if (data.transducer) {    
            for(let i=0;i<data.transducer.length;i++) {
              let mncode = data.transducer[i].mnCode;
               let index = data.transducer[i].indexCode;
                 _this.indexs.push(index);
                _this.deviceCode.push(mncode);
            }

            let cameraList = [];
            for(let i=0;i<data.camera.length;i++) {
              let index = data.camera[i].indexCode;
              if (data.camera[i].isOnline == '在线') {
                cameraList.push(index);
              }
            }
            if (_this.isShowNow) {
              _this.getDataNow();
              _this.curcameraid=cameraList[0];
              _this.showVideo(cameraList[0]); 
            } else {
              _this.searchHistory(1);
            }
          }

          //C初始右侧设备组织结构树

         this.organizationTreeData=data;


        }).catch((err) => {
          this.$message({
            message: '获取传感器列表失败！',
            type: 'error',  
            duration: 5 * 1000
          });
        });
    },
    getQyinfo(id) {
      return shipinApi
        .getQiyeDetailsInfo(id)
        .then(data => {
          this.qiyeInfo.name = data.data.name;
          this.qiyeInfo.address = data.data.address;
          this.qiyeInfo.industry = data.data.industry;
          this.qiyeInfo.pollutions = data.data.pollutions;
        });
    },
    exportXjjl() {
      let param = {};
      param.userName = this.$store.getters.username;
      param.itemType = '视频巡查';
      param.beginTime = this.bbtime[0]+' 00:00:00';
      param.endTime = this.bbtime[1]+' 23:59:59';

      return shipinApi
        .exportYuanXjjl(param)
        .then(data => {
          this.downloadBd(data);
        });
    },
    downloadBd(data) {
      let blob = new Blob([data], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
          });
          //let url = new Blob([data],{type: 'application/vnd.ms-excel;charset=utf-8'});
          var downloadElement = document.createElement('a');
          var href = window.URL.createObjectURL(blob); //创建下载的链接
          downloadElement.href = href;
          downloadElement.download = this.$store.getters.username +'-视频巡查记录表-'+this.getFormatDateYear(new Date(),'YYYY.MM.DD')+'.xls'; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
    },
    showNow() {
      this.isShowNow = true;
      // this.sourceSrc1='rtmp://10.3.9.153:1935/live/805642093';
      // this.shipinVisibility1 = true;
      // this.showVideo('51011200101320100099');
       
      
      if (this.jcPoint) {
        this.getDataNow();
        // this.showVideo(); 
        this.showVideo(this.curcameraid);
        if( this.$refs.nmhcChart!=undefined){
          this.$refs.nmhcChart.fetchChartData();
          // this.$refs.benChart.fetchChartData();
          // this.$refs.jiabenChart.fetchChartData();
          // this.$refs.erjiabenChart.fetchChartData();
        }   
      }
    },
    getDataNow() {
      var _this=this;
      this.isbj=0;
      let param = {};
      param.codes = ['a24088','a05002','a01012','a01013','a01011','a01014','a25002','a25005','a25003'];
      param.businessType = '';
      param.deviceIds = this.deviceCode;

      this.tableData = [];
      return shipinApi.getByFactorDataNow(param)
        .then(data => {
          if(data.data.length==0){
              this.tableData=[{
                baseId:"SYBCESHI301",code:"a24088",concentrationUnit:"毫克/立方米",name:"非甲烷总烃",recordTime:"2019-04-11T23:01:21.000+0000",rtd:'--'                             
             },{
               baseId:"SYBCESHI301",code:"a25002",concentrationUnit:"毫克/立方米",name:"苯",recordTime:"2019-04-11T23:01:21.000+0000",rtd:'--'                             
             },{
               baseId:"SYBCESHI301",code:"a25005",concentrationUnit:"毫克/立方米",name:"二甲苯",recordTime:"2019-04-11T23:01:21.000+0000",rtd:'--'             
             },{
               baseId:"SYBCESHI301",code:"a25003",concentrationUnit:"毫克/立方米",name:"甲苯",recordTime:"2019-04-11T23:01:21.000+0000",rtd:'--'                             
             },{
               baseId:"SYBCESHI301",code:"a01011",concentrationUnit:"米/秒",name:"烟气流速",recordTime:"2019-04-11T23:01:21.000+0000",rtd:'--'
             },{
               baseId:"SYBCESHI301",code:"a01012",concentrationUnit:"摄氏度",name:"烟气温度",recordTime:"2019-04-11T23:01:21.000+0000",rtd:'--'
             },{
               baseId:"SYBCESHI301",code:"a01013",concentrationUnit:"千帕",name:"烟气压力",recordTime:"2019-04-11T23:01:21.000+0000",rtd:'--'            
             },{
               baseId:"SYBCESHI301",code:"a01014",concentrationUnit:"%",name:"烟气湿度",recordTime:"2019-04-11T23:01:21.000+0000",rtd:'--'                            
             },{
               baseId:"SYBCESHI301",code:"a05002",concentrationUnit:"纳克/立方米",name:"甲烷",recordTime:"2019-04-11T23:01:21.000+0000",rtd:'--'             
             }
             ];
             return;
          }
          let arr = [];
          arr.length = 9;
          for (let i=0;i<data.data.length;i++){
            if (data.data[i].code == 'a24088') {
              arr[0] = data.data[i];
            }
            if (data.data[i].code == 'a25002') {
              arr[1] = data.data[i];
            }
            if (data.data[i].code == 'a25005') {
              arr[2] = data.data[i];
            }
            if (data.data[i].code == 'a25003') {
              arr[3] = data.data[i];
            }
            if (data.data[i].code == 'a01011') {
              arr[4] = data.data[i];
            }
            if (data.data[i].code == 'a01012') {
              arr[5] = data.data[i];
            }
            if (data.data[i].code == 'a01013') {
              arr[6] = data.data[i];
            }
            if (data.data[i].code == 'a01014') {
              arr[7] = data.data[i];
            }
            if (data.data[i].code == 'a05002') {
              arr[8] = data.data[i];
            }
          }

          this.tableData = arr;
          console.log('数据：');
          console.log(arr);

          this.fetchChartData('a24088');
          this.fetchChartData('a25002');
          this.fetchChartData('a25005');
          this.fetchChartData('a25003');

          // var p1 = new Promise(function(resolve, reject){
          //     _this.fetchChartData2('a05002',resolve);
          // });
          // var p2 = new Promise(function(resolve, reject){
          //     _this.fetchChartData2('a25002',resolve);
          // });
          // var p3 = new Promise(function(resolve, reject){
          //     _this.fetchChartData2('a25005',resolve);
          // });
          // var p4 = new Promise(function(resolve, reject){
          //     _this.fetchChartData2('a25003',resolve);
          // });
          // let _promise = new Promise(function(resolve, reject){});
          // Promise.all([p1,p2,p3,p4]).then(function(value) {
          //     // 建议大家在浏览器中看看这里的value值
          //    if(_this.isbj==4){
          //      if( _this.pointerWarning!=false){
          //        _this.pointerWarning=false;
          //      }
               
          //    }
          // })




        });
    },
    fetchChartData(code) {
      if (this.deviceCode.length == 0) {
        return;
      }
      let param = {};
      param.code = code || this.code;
      param.hours = '12';
      param.deviceIds = this.deviceCode;
      let _this = this;

      return shipinApi.getByFactorDataHours(param)
      .then(result => result.data)
      .then(resultData => {
        if (resultData.rows && resultData.rows.length>0) {
          let axisData = [];
          let seriesData = [];
          for (let i = 1; i < resultData.total; i++) {
              axisData.push(resultData.rows[i].recordTime);
              seriesData.push(resultData.rows[i].rtd);
          }
          
          // let num = parseFloat( seriesData[seriesData.length-1]).toFixed(3);
           let num =  parseFloat(resultData.currentValue[resultData.rows[0].code+'value']).toFixed(3);
          let rate = num/resultData.standard;


          for (var i = 0; i <  _this.tempdata.length; i++) {
            if( _this.tempdata[i].name==resultData.rows[0].code){
               _this.tempdata[i].data=resultData;
            }
            
          }
          console.log('30s数据：');
          console.log(_this.tempdata);
          

          if (rate > 1) {
            _this.pointerWarning = true;
            _this.isbj=0;
            return;
          }else{
            _this.isbj+=1;
          }
          if( _this.isbj==4){
            console.log("4个值都<1");
            if( _this.pointerWarning!=false){
                _this.pointerWarning=false;
                _this.isbj=0;
            }
          }
          

          
        }
      })
    },
    // fetchChartData2(code,resolve) {
    //   if (this.deviceCode.length == 0) {
    //     return;
    //   }
    //   let param = {};
    //   param.code = code || this.code;
    //   param.hours = '12';
    //   param.deviceIds = this.deviceCode;
    //   let _this = this;

    //   return shipinApi.getByFactorDataHours(param)
    //   .then(result => result.data)
    //   .then(resultData => {
    //     if (resultData.rows && resultData.rows.length>0) {
    //       let axisData = [];
    //       let seriesData = [];
    //       for (let i = 1; i < resultData.total; i++) {
    //           axisData.push(resultData.rows[i].recordTime);
    //           seriesData.push(resultData.rows[i].rtd);
    //       }
          
    //       let num = parseFloat( seriesData[seriesData.length-1]).toFixed(3);
    //       let rate = num/resultData.standard;

    //       if (rate > 1) {
    //         _this.pointerWarning = true;
    //       }else{
    //         _this.isbj+=1;
    //       }
    //       if( _this.isbj==4){
    //          _this.pointerWarning = false;
    //       }
    //       //  resolve();
         
          
    //     }
    //   })
    // },
   


    getEnUnit(name) {
      let en_name = '';

      switch(name) {
        case '毫克/立方米':
          en_name = 'mg/m³';
          break;
        case '摄氏度':
          en_name = '°C';
          break;
        case '千帕':
          en_name = 'kpa';
          break;
        case '米/秒':
          en_name = 'm/s';
          break;
        case '立方米/秒':
          en_name = 'm³/s';
          break;
        case '纳克/立方米':
          en_name = 'ng/m³';
          break;
        default:
          en_name = name;
          break;
      }

      return en_name;
    },
    showHistory() {
      this.isShowNow = false;
      if (this.jcPoint) {
        this.searchHistory(1);
      }
    },


    //定时刷新
    refresh(){

      // if(this.isShowNow){
      //    this.getDataNow();
      // }else{
      //   this.showHistory();
      // }

      if(this.isShowNow){
        if (this.jcPoint) {
          this.getDataNow();
          // this.showVideo(); 
          // this.showVideo(this.curcameraid);
          if( this.$refs.nmhcChart!=undefined){
            this.$refs.nmhcChart.fetchChartData();
            // this.$refs.benChart.fetchChartData();
            // this.$refs.jiabenChart.fetchChartData();
            // this.$refs.erjiabenChart.fetchChartData();
          }   
        }
      }
    },

   
    searchHistory(ctrcurrentPage) {
      if (this.jcPoint == '') {
        this.$message({
            message: '请选择点位！',
            type: 'warning',  
            duration: 5 * 1000
          });
          return;
      }
      if (!this.jctime || !this.jctime[0] || !this.jctime[1]) {
        this.$message({
            message: '请选择时间段！',
            type: 'warning',  
            duration: 5 * 1000
          });
          return;
      }

      this.curPage = ctrcurrentPage;
      let param = {};
      param.codes = ['a24088','a25002','a25005','a25003'];
      param.deviceIds = this.deviceCode;
      param.beginDate = this.jctime[0];
      param.endDate = this.jctime[1];
      param.businessType = '';
      param.pageNum = ctrcurrentPage;
      param.pageSize = 12;

      this.tableDataHistory = [];
      return shipinApi
        .getByFactorDataHistory(param)
        .then(res => res.data)
        .then(data => {
          this.srcrestotal = data.total;
          this.tableDataHistory = data.rows;
        });
    },
    resetData() {
      clearInterval(this.interval);
      this.jcPoint = '';
      this.deviceCode = [];
      this.tableData = [];
      this.tableDataHistory = [];
      this.jctime = [this.getFormatDateYear(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 3)),this.getFormatDateYear(new Date())],
      // this.$refs.nmhcChart.clearChart();
      // this.$refs.benChart.clearChart();
      // this.$refs.jiabenChart.clearChart();
      // this.$refs.erjiabenChart.clearChart();
       this.$refs.ssjcChart.clearChart();
      this.srcrestotal = 0;
      this.curPage = 0;
      this.isShowNow = true;
      this.jcxqpop = false;
      this.isShowSSJC = true;
      if (this.shipinVisibility1) {
        this.closePlay(1);
      }
      if (this.shipinVisibility2) {
        this.closePlay(2);
      }
      if (this.shipinVisibility3) {
        this.closePlay(3);
      }
      if (this.shipinVisibility4) {
        this.closePlay(4);
      }
        
    },

    showSSJC(){
      this.isShowSSJC = true;
      //取消禁用点位选择
      // this.$refs.sssjdw.disabled=false;
    },
    showQYXX(){
      this.isShowSSJC = false;
      //禁用点位选择
      // this.$refs.sssjdw.disabled=true;

    },

    refreshVideoData() {
      let _this = this;

      return shipinApi
      .getVideoData()
      .then(res => res.data)
      .then(data => {  
          _this.showVideo(data);
      }).catch((err) => {
        //  this.$message({
        //   message: '实时视频播放失败！',
        //   type: 'error',
        //   duration: 5 * 1000
        // });
      });
    },

    showVideo(tollgateID) {
      tollgateID = tollgateID ||　'51011200101320100101';
      // tollgateID = '51011200101320100101';
      if (this.winNum == 1 && this.shipinVisibility1) {
        this.shipinVisibility1 = false;
      }

      if (!this.shipinVisibility1) {
        this.curWindow = 1;
        this.sourceData1.tabUUID = 1;
        this.sourceData1.tollgateID = tollgateID;
      } else if (!this.shipinVisibility2) {
        this.curWindow = 2;
        this.sourceData2.tabUUID = 2;
        this.sourceData2.tollgateID = tollgateID;
      } else if (!this.shipinVisibility3) {
        this.curWindow = 3;
        this.sourceData3.tabUUID = 3;
        this.sourceData3.tollgateID = tollgateID;
      } else if (!this.shipinVisibility4) {
        this.curWindow = 4;
        this.sourceData4.tabUUID = 4;
        this.sourceData4.tollgateID = tollgateID;
      } else {
        this.shipinVisibility1 = false;
        this.curWindow = 1;
        this.sourceData1.tabUUID = 1;
        this.sourceData1.tollgateID = tollgateID;
      }
      let _this = this;
      this.$nextTick(function() {
        _this.getPlayerData(tollgateID);
      })
    },
    // 获取视频源数据
    getPlayerData(tollgateID) {
      let param = {};
      param.tabUUID = this.curWindow;
      param.tollgateID = tollgateID;

      let _this = this;
      if (_this.curWindow == 1) {
        _this.playerState1 = false;
        _this.shipinVisibility1 = true;
      } else if (_this.curWindow == 2) {
        _this.playerState2 = false;
        _this.shipinVisibility2 = true;
      } else if (_this.curWindow == 3) {
        _this.playerState3 = false;
        _this.shipinVisibility3 = true;
      } else if (_this.curWindow == 4) {
        _this.playerState4 = false;
        _this.shipinVisibility4 = true;
      }

      // return shipinApi
      // .getPlayerVideo(param)
      // .then(res => res.data)
      // .then(data => {  
      //   if (_this.curWindow == 1) {
      //     // _this.sourceSrc1 = data.videoURL;
      //     // _this.sourceSrc1 ='rtmp://10.3.9.153:1935/live/805642093';

      //     _this.shipinVisibility1 = true;
      //   } else if (_this.curWindow == 2) {
      //     _this.sourceSrc2 = data.videoURL;
      //     _this.shipinVisibility2 = true;
      //   } else if (_this.curWindow == 3) {
      //     _this.sourceSrc3 = data.videoURL;
      //     _this.shipinVisibility3 = true;
      //   } else if (_this.curWindow == 4) {
      //     _this.sourceSrc4 = data.videoURL;
      //     _this.shipinVisibility4 = true;
      //   }
      // }).catch((err) => {
      //    this.$message({
      //     message: '实时视频播放失败！',
      //     type: 'error',
      //     duration: 5 * 1000
      //   });
      // });
    },
    closePlay(num) {
      if (num == 1) {
        this.playerState1 = true;
      } else if (num == 2) {
        this.playerState2 = true;
      } else if (num == 3) {
        this.playerState3 = true;
      } else if (num == 4) {
        this.playerState4 = true;
      }
    },
    showQushiChart(obj) {
      this.curCode = obj.code;
      this.isShowQushiChart = true;
    }
  }
};
</script>

<style scoped>
.content-row {
  padding: 0;
  height: 100%;
}
.bl-content {
  width: 1400px;
  min-height: 500px;
  height: calc(100vh - 140px);
  margin: 0;
  width: 100%;
  box-sizing: border-box;
  background: #fff;
}
.content-left {
  width: 326px;
  height: 100%;
  float: left;
  border: 1px solid #d9dfe5;
}
.content-right {
  width: calc(100% - 326px);
  height: 100%;
  margin-left: 326px;
  border-left: none;
  background: #444446;
}
.panelTitle{
  height: 36px;
  line-height: 36px;
  padding-left: 10px;
  margin-bottom: 10px;
  border-bottom:1px solid #d9dfe5
}
.qiye {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
.scbb {
  position: absolute;
  right: 0px;
  top: 0;
  height: 46px;
  line-height: 46px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.scbb-select {
  height: 30px;
  line-height: 30px;
}
.btn-info {
  background-color: #13b1e1;
  border: none;
  margin-left: 10px;
  font-size:12px;
}
.btn-info:hover {
  border: none;
  outline: none;
}
.btn-info:focus,
.btn-info:active,
.btn-info:visited {
  border: none;
  outline: none;
  background-color: #13b1e1;
}
.ryxxpop_jbitem {
  display: flex;
  justify-content: space-between;
  height:100%;
}
.cxjg_item_right {
  width: 55vw;
  height: 100%;
  border: 1px solid #d9dfe5;
}
.isActive {
  color: #12b1e1;
}
.content-title {
  font-size: 12px;
  height: 30px;
  line-height: 30px;
}
.qiye-content {
  width:100%;
  height:calc(100% - 30px);
  padding: 10px;
}
.qiye-img {
  width: 108px;
  height: 100%;
  float: left;
  margin-right: 10px;
  text-align: center;
  line-height: 108px;
}
.qiye-img img {
  max-width: 108px;
  max-height: 108px;
}
.qiye-name {
  height: 26px;
  line-height: 26px;
  font-weight: bold;
  color: #12b1e1;
}
.qiye-info {
  line-height: 22px;
}
.info-text {
  color: #333;
}
.jc-content {
  width: 100%;
  height: 100%;
  position: relative;
}
.jc-title {
  width: 100%;
  line-height: 36px;
  font-size:12px;
}
.jc-title span {
  display: inline-block;
}
.jc-charts {
  height: 280px;
}
.chart-item {
    margin: 8px 20px 8px 0;
    width: calc(50% - 10px);
    /* width: 100%; */
    float: left;
    height: 130px;
}
.chart-item:nth-child(2n) {
  margin-right: 0;
}
.green {
  color: #1fcd7f;
}
.yellow {
  color: #ffb400;
}
.orange {
  color: #f1811c;
}
.red {
  color: #f6494f;
}
.shipin-content{
  /* width: 100%;
  height: calc(100% - 240px); */
  width: 52vw;
  height: 39vw;
  border-left: none;
  background: #444446;
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
}
.shipin-item {
  float: left;
  position: relative;
  margin: 0;
  padding: 0;
  width: calc(50% - 2px);
  height: calc(50% - 2px);
  margin: 1px;
  background: url(../../../../static/image/shipin/noVideo.png) no-repeat;
  background-position: center center;
  background-color: #000;
  display: none;
}
.maxwin {
  width: calc(100% - 2px);
  height: calc(100% - 2px);
  display: block;
}
.midwin {
  width: calc(50% - 2px);
  height: calc(50% - 2px);
  display: block;
}
.minwin {
  width: calc(33.3% - 2px);
  height: calc(33.3% - 2px);
  display: block;
}
.shipin-close {
  position: absolute;
  top: 0;
  right: 0;
  width:24px;
  height:24px;
  z-index: 999;
  font-size:16px;
  color: #fff;
  text-align: center;
  cursor: pointer;
}
.sel-tips:hover, .active {
  cursor: pointer;
  color: #12b1e1;
}
.sel-tips:hover .redBgColor,.sel-tips:hover .orangeBgColor,.sel-tips:hover .greenBgColor,.sel-tips:hover .allBgColor,
.active .redBgColor,.active .orangeBgColor,.active .greenBgColor,.active .allBgColor {
  box-shadow: 0px 0px 1px 1px #ccc;
}
.tips {
  /* display: flex; */
  display: inline-block;
  align-items: center;
  padding: 0 5px;
  font-size: 12px;
  height: 20px;
  line-height: 20px;
}
.tips-text {
  margin: 0 5px;
}
.redBgColor,.greenBgColor,.orangeBgColor,.allBgColor{
  display: inline-block;
  width: 18px;
  height: 12px;
  border-radius: 2px;
 
}
.redBgColor {
  background: red;
  
}
.orangeBgColor {
  background: blue;
 
}
.greenBgColor {
  background: green;
}
.allBgColor {
  background: #eee;
}
</style> 