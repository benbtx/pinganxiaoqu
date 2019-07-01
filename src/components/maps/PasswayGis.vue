<template>

  <div style="height: 100%;width:100%;;">
    <!-- <remote-css href='http://80.2.30.25:8090/pgisMap/resource/Pgis/css/toolbar.css'></remote-css>
            <remote-css href='http://80.2.30.25:8090/pgisMap/libs/Cesium/Widgets/widgets.css'></remote-css>
            <remote-css href='http://80.2.30.25:8090/pgisMap/examples/themes/css/demo.css'></remote-css>
            <remote-css href='http://80.2.30.25:8090/pgisMap/resource/Pgis/css/EzMap.css'></remote-css>
            <remote-css href='http://80.2.30.25:8090/pgisMap/resource/Pgis/css/EzServerClient.draw.css'></remote-css>
            <remote-css href='http://80.2.30.25:8090/pgisMap/examples/themes/css/clusterCss.css'></remote-css>
    
       
        <remote-js src='http://80.2.30.25:8090/pgisMap/examples/works/init.js'></remote-js>
        <remote-js src='http://80.2.30.25:8090/pgisMap/libs/Pgis/app/MapApp.js'></remote-js>
        <remote-js src='http://80.2.30.25:8090/pgisMap/examples/configuration/mapConfig.js'></remote-js> 
        <remote-js src='http://80.2.30.25:8090/pgisMap/libs/Pgis/core/EzServerClient-src.js'></remote-js>
        <remote-js src='http://80.2.30.25:8090/pgisMap/libs/Pgis/core/EzServerClient.draw-src.js'></remote-js>
        
        <remote-js src='http://80.2.30.25:8090/pgisMap/libs/Pgis/utils/turf.min.js'></remote-js>
        <remote-js src='http://80.2.30.25:8090/pgisMap/libs/Cesium/Workers/zlib.min.js'></remote-js>
        <remote-js src='http://80.2.30.25:8090/pgisMap/libs/Pgis/utils/Math.js'></remote-js>
        <remote-js src='http://80.2.30.25:8090/pgisMap/libs/echarts/echarts.js'></remote-js>
        <remote-js src='http://80.2.30.25:8090/pgisMap/libs/echarts/echartsMap.js'></remote-js>
        <remote-js src='http://80.2.30.25:8090/pgisMap/libs/echarts/ezmap.charts.js'></remote-js>
        <remote-js src='http://80.2.30.25:8090/pgisMap/libs/echarts/chart/map.js'></remote-js>
        <remote-js src='http://80.2.30.25:8090/pgisMap/examples/works/jquery.json-2.4.min.js'></remote-js>
        <remote-js src='http://80.2.30.25:8090/pgisMap/examples/works/jmegaeyes-1.0.js'></remote-js>
      prefix  -->

    <div id="POI_search" v-show="showsearch" :class="[searchStyle=='right'?'s_right':'s_left']">

      <el-input placeholder="地名搜索" v-model="poiName" @change.native="poiSearch" @keyup.enter.native="searchEnterFun">
        <i class="el-icon-close el-input__icon" style="cursor:pointer;" slot="prefix" @click="handleDeletClick"></i>
        <el-button style="font-size: 1.5em;" @click="poiSearch" slot="append" icon="el-icon-search">
        </el-button>
      </el-input>
        
      <div style="background-color:  rgba(0,0,0,0.4);cursor:  pointer">
        <ul>
          <li class="poi_searchResult" @click="poiResultList_click(item.id)" v-for='item in poiSearchList' :key="item.id">
            {{item.name}}
          </li>
        </ul>
      </div>
    </div>

    <security-baobei v-show="showDraw" :lisen='poiSearch_callback'></security-baobei>
    <!-- <poisearch  ></poisearch> v-show="showtools" -->
    <app-layer   :showOpt='showtools'></app-layer>
    <div class="map-h" :id="mapid">

      <securityGis v-show="showlymanager" :regionSecurityData='regionData'> </securityGis>

      <div class="lsgjbf" v-show="showbfdiv">
        <p class="lsgjbfspan" v-if="showligjbf" @click="bflsgj">
          播放：{{cph}}
        </p>
        <p class="lsgjtzspan" v-else @click="tzlsgj">
          停止：{{cph}}
        </p>
      </div>
    </div>

    <el-dialog :visible.sync="showbkdxda" width="850px" id="sssssssssssssssssss" style="z-index: auto;" :close-on-click-modal="false" v-dialogDrag>
      <span slot="title">{{recordtitle}}</span>
      <div style="height:650px;">
        <ctr-bkdxda v-bind:bkdxdata="bkdxdata"></ctr-bkdxda>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/*****************
 *
 * 公共的pGis类，zhangkai
 * 系统所有的地图初始化都以及地图相关功能都调用该类中的方法
 * 1.实时轨迹、历史轨迹、逃跑路线
 * 2.警情预警
 * 3.安保活动 监控线路
 *
 *
 *  **********************/

//import   "@/remote-js";

import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { mapState } from 'vuex';
import eventBus from '@/event';
import { passwayApi, securityApi, controlApi } from '@/http';
import { eventCollection } from '@/event/resources';
import $ from 'jquery';
import Bkdxda from '@/components/control/Bkdxda';
//1.将几大类数据层加载 放到单独的vue文件:pGisDataLayer.vue

import pGisDataLayer from '@/components/maps/pGisDataLayer';
//3.将警情预警热点图放到单独vue文件：PolicsGis.vue
import { policeGis } from '@/components/maps/PoliceGis.js';
// 安保界面功能
import SecurityGis from '@/components/maps/SecurityGis';
//poisearch
import { ControlGis } from '@/components/maps/controlGis';

//import PoiSearch from '@/components/maps/poiSearch';

import SecurityBaobei from '@/components/maps/securityBaobeiGis';

const UrlFactory = require('../../../config'); //请求地址
//地图覆盖层变量、图片资源
import { mapVar } from '@/components/maps/variable.js';

//import remoteLoad from '@/components/maps/remoteLoad.js';
var IM=['sssssssssss'];

var allOverLays = []; //历史轨迹的
var allOverLays1 = []; //实时轨迹的
var allOverLays2 = []; //历史、实时轨迹的线
var curPeoLng = null;
var curPeoLat = null;

// var realInfoArray = null;
var MarkerArray = [];
var jdwdarr = [];
var hisArrMaker = [];

var tfInfoTimer;
var realTimePonit = [];

var overLayer_jingli = []; //区域安保警力部署
var trailData;

export default {
  name: 'PasswayGis',
  props: ['usermapConfig', 'row', 'regiondatas', 'srow'],
  components: {
    'remote-js': {
      render(createElement) {
        return createElement('script', {
          attrs: { type: 'text/javascript', src: this.src },
          props: {
            src: { type: String, required: true }
          }
        });
      }
    },
    'remote-css': {
      render(createElement) {
        return createElement('style', {
          attrs: { type: 'text/css', href: this.href },
          props: {
            href: { type: String, required: true }
          }
        });
      }
    },

    'app-layer': pGisDataLayer,
    'ctr-bkdxda': Bkdxda,
    securityGis: SecurityGis,
    'security-baobei': SecurityBaobei
    // 'poisearch':PoiSearch
  },
  render(h) {
    return <div class="gis-wrap" />;
  },
  data() {
    return {
      regionData: [],
      mapConfig: null, //
      mapid:'',
      defaultMapConfig: {
        id:'map',
        showtools: {"qc":true,"tool":true},
        showlyManager: false,
        poiSearch: { show: false, style: '' },
        mapcolor: 'blue',
        Listener: null
      },
      //地名地址库搜索
      poiName: '', //地名地址库搜索
      poiSearchList: [],
      showPoiSearch: false,
      poiSearch_callback: undefined,
      //显示多维档案
      bkdxdata: [],
      recordtitle: '', //档案抬头
      showbkdxda: false, //是否显示布控对象档案弹出

      //地图以及地图工具栏显示
      showlymanager: false, //安保的图层管理
      showtools: false, // 显示左侧工具
      showsearch: false, // 显示搜索框
      mapInited: false, //地图是否初始化完成
      searchStyle: 'right',
      showDraw: false, //安保报备--画面

      //历史轨迹和 实时轨迹
      url: null,
      histTrackName: 'histTrack',
      realTimeTrack: 'realTimeTrack',
      escapeTrack: 'escapeTrack',
      lastHistPtInfo: null,
      lastRealTimePtInfo: null,
      lastRealjzTimePtInfo: null,
      lastRealpt: null,
      carPicUrl: null,
      peoPicUrl: null,
      realTimeLineTrack: null,
      realTimeLineTrackData: [],

      evtPlace: null,
      evtDate: null,
      evtCar: null,
      licenseCar: null,
      peoDate: null,
      MarkerArray: null,
      pathInfoArray: null,
      patharrinfo: [],
      hisArr: [],
      lastRealPtInfo: null,

      allOverLays1: [], //实时轨迹、重大安保点、警情点击显示同时调用
      showbfdiv: false, //显示播放历史轨迹div
      showligjbf: true, //显示播放还是停止
      cph: null
    };
  },
  computed: {
    ...mapState('TrailStates', ['trailData'])
  },
  watch: {
    row: {
      handler() {
        this.controlGis_loc(this.row);
      },
      deep: true
    },
    srow: {
      handler() {
        this.controlGis_loc(this.srow);
      },
      deep: true
    },
    regiondatas: {
      handler() {
        if (this.showlymanager)
          if (this.mapInited) {
            this.regionData = [];
            this.regionData = this.regiondatas;
          }
      },
      deep: true
    },
    trailData: {
      handler() {
        //许军注释
        if (this.trailData) {
          let arr = [];

          for (var i = 0; i < this.trailData.length; i++) {
            if (
              this.trailData[i].ksJd == '0.000000' ||
              this.trailData[i].ksJd == '' ||
              this.trailData[i].ksJd == null ||
              (this.trailData[i].ksWd == '0.000000' ||
                this.trailData[i].ksWd == '' ||
                this.trailData[i].ksWd == null)
            ) {
            } else {
              arr.push(this.trailData[i]);
            }
          }
          this.hisArr = arr;
          this.getHistTrack(arr);
          //  }
        } else {
          this.clearLSGJ();

          this.clearGJBF_car();
        }
      },
      deep: true
    }
  },
  mounted() {
    

    this.initMap();
    document.addEventListener('click', e => {
      let d = document.getElementsByClassName('poi_searchResult')[0];
      if (!!d) {
        if (
          d.getBoundingClientRect().bottom > e.clientY &&
          d.getBoundingClientRect().top < e.clientY &&
          d.getBoundingClientRect().left < e.clientX &&
          d.getBoundingClientRect().right > e.clientX
        ) {
        } else {
         this.poiSearchList=[];
        }
      }
    });
  },
  methods: {
    //响应鼠标回车事件
    searchEnterFun: function(e) {
      var keyCode = window.event ? e.keyCode : e.which;
      if (keyCode == 13 && this.poiName) {
        this.poiSearch();
      }
    },
    handleDeletClick: function() {
      this.poiName = '';
      this.poiSearch();
    },
    //查看布控对象档案---关注人员
    lookbkdxda(row) {
      this.recordtitle = row.title + '_多维档案';
      return controlApi
        .ctraddrecordApil({
          zjhm: row.zjhm,
          type: row.type,
          fjxx: row.fjxx
        })
        .then(res => res.data)
        .then(data => {
          // loading.close();
          if (!!data) {
            this.bkdxdata = data.basicrecord;
            //取第一张照片信息
            if (!!this.bkdxdata.zp) {
              var zjjson = JSON.parse(this.bkdxdata.zp);
              this.bkdxdata.zp = 'data:image/png;base64,' + zjjson[0].xp;
            }
            //写入多维信息
            if (!!this.bkdxdata.cph) {
              this.bkdxdata.cph = JSON.parse(this.bkdxdata.cph);
            } else {
              this.bkdxdata.cph = [];
            }
            if (!!this.bkdxdata.sjhm) {
              this.bkdxdata.sjhm = JSON.parse(this.bkdxdata.sjhm);
            } else {
              this.bkdxdata.sjhm = [];
            }
            if (!!this.bkdxdata.qqhm) {
              this.bkdxdata.qqhm = JSON.parse(this.bkdxdata.qqhm);
            } else {
              this.bkdxdata.qqhm = [];
            }
            if (!!this.bkdxdata.wxhm) {
              this.bkdxdata.wxhm = JSON.parse(this.bkdxdata.wxhm);
            } else {
              this.bkdxdata.wxhm = [];
            }
            if (!!this.bkdxdata.sjmac) {
              this.bkdxdata.sjmac = JSON.parse(this.bkdxdata.sjmac);
            } else {
              this.bkdxdata.sjmac = [];
            }
            if (!!this.bkdxdata.imei) {
              this.bkdxdata.imei = JSON.parse(this.bkdxdata.imei);
            } else {
              this.bkdxdata.imei = [];
            }
            if (!!this.bkdxdata.imsi) {
              this.bkdxdata.imsi = JSON.parse(this.bkdxdata.imsi);
            } else {
              this.bkdxdata.imsi = [];
            }
            this.showbkdxda = true;
          } else {
            this.$message('数据获取失败');
            return;
          }
        });
    },

    /* 通 通过dom 重新加载 JS 文件*/
    reloadJs: function(src) {
      return new Promise(resolve => {
        DemoApp = null;
        var oHead = document.getElementsByTagName('HEAD').item(0);
        var oScript = document.createElement('script');
        oScript.type = 'text/javascript';
        oScript.src = src;
        oHead.appendChild(oScript);
        //   global.document.body.appendChild(oScript);
        oScript.addEventListener('load', () => {
          console.log('js loaded.');
          //   global.document.body.removeChild(oScript);
          resolve(true);
        });
      });
    },

    //播放历史轨迹
    bflsgj: function() {
      let _thisd = this;

      _thisd.showligjbf = false;

      this.clearGJX();
      this.clearLSGJ();
      var lineStyle = {
        strokeColor: '#5ad5e3',
        strokeOpacity: 1,
        strokeWidth: 3
      };

      var tempLine = [];
      var i = this.hisArr.length;
      tfInfoTimer = setInterval(() => {
        _thisd.clearGJBF_car();
        mapVar.removeMapOverlays(hisArrMaker);
        if (i > 0) {
          i--;
          _thisd.drawPoint(i, _thisd.hisArr); //绘制路径点

          _thisd.realTimeHistory(i, _thisd.hisArr[i]); //绘制车辆点
          tempLine.push(_thisd.hisArr[i]); //绘制路径线
          if (tempLine.length >= 2) {
            _thisd.drawPolyline(tempLine, lineStyle);
          }
        } else {
          _thisd.showligjbf = true;
          return;
        }
      }, 1000);
    },
    //停止播放历史轨迹
    tzlsgj: function() {
      this.showbfdiv = true;
      this.showligjbf = true;

      clearInterval(tfInfoTimer);
    },

    //websoket连接开始
    initWebSocket() {
      let sock = new SockJS(passwayApi.sockpasswayAddress);
      // UrlFactory.passwayAddress+"/endpointChat?token="+UrlFactory.token
      // let sock=new SockJS("http://10.64.30.93:8088/endpointChat?token=111111");

      let stomp = Stomp.over(sock);
      stomp.connect('guest', 'guest', frame => {
        //stomp.subscribe("/user/topic/notifications",this.realTime);
        stomp.subscribe(this.url, this.handtrack); //websoket连接开始 谢宇打开此功能
        stomp.subscribe(this.url1, this.feedback);
      });
    },

    //调用轨迹函数
    //反馈
    feedback(msg) {
      eventBus.$emit(eventCollection.PUSH_FEEDBACk_ID, JSON.parse(msg.body));
      //console.log();
    },

    handtrack(msg) {
      let jsondata = JSON.parse(msg.body);
      if (jsondata) {
        if (
          jsondata.ksJd == '0.000000' ||
          jsondata.ksJd == '' ||
          jsondata.ksJd == null ||
          (jsondata.ksWd == '0.000000' ||
            jsondata.ksWd == '' ||
            jsondata.ksWd == null)
        ) {
          this.setLB(this.jsondata);
        } else {
          this.patharrinfo.push(jsondata);
          this.getRealTrackJZ(this.patharrinfo);
          // this.dotFlashss(jsondata);
          var pt = new Point(
            parseFloat(jsondata.ksJd),
            parseFloat(jsondata.ksWd)
          );
           mapVar.mapInstance.map.centerAndZoom(pt, 13);
        }
      }
      //let lng=jsondata.ksJd;
      //let lat=jsondata.ksWd;
      //let dt=jsondata.date;
      //this.drawPathInfo(lng,lat,dt);
      //this.getRealTimeTrack(lng,lat);
      //this.getRealTimeTrackbyCarImg(jsondata);
    },

    //初始化地图
    initMap: function () {
          // 已载入地图API，则直接初始化地图

          this.mapConfig =
              this.usermapConfig == null ? this.defaultMapConfig : this.usermapConfig;
             
          this.mapid = this.usermapConfig.id;
             
          console.log(this.mapid); 
          let that = this;
          this.$nextTick(() => {
          mapVar.initMap(this.mapConfig).then(() => {
              console.log('地图准备就绪,开始初始化地图工具');
              this.showlymanager = this.mapConfig.showlyManager;
              this.showtools = this.mapConfig.showtools;
              this.showsearch = this.mapConfig.poiSearch.show;
              this.searchStyle = this.mapConfig.poiSearch.style;


              //地图点击获取点击位置
              if (this.mapConfig.Listener != null) {
                  this.showDraw = true;
                  this.showPoiSearch = true;
                  this.poiSearch_callback = this.mapConfig.Listener;
              }
              console.log('地图工具初始化完毕，开始处理数据');
              that.mapInited = true;
              if (that.mapInited) {
                  that.regionData = this.regiondatas;
              }
          });
        });
     },

    //清除历史轨迹
    clearLSGJ: function() {
      mapVar.removeMapOverlays(allOverLays);
    },
    // 清除实时轨迹、重大安保
    clearSSGJ: function() {
      mapVar.removeMapOverlays(allOverLays1);
    },
    //清除轨迹播放图标
    clearGJBF_car: function() {
      mapVar.removeMapOverlays(hisArrMaker);
    },
    //清除轨迹线
    clearGJX: function() {
      mapVar.removeMapOverlays(allOverLays2);
    },
    //清除轨迹播放经纬度坐标
    clearJWD: function() {
      if (jdwdarr.length - 1 >= 0) {
        jdwdarr = [];
      }
    },

    /****绘制过程点***/
    drawPoint: function(i, lstHistData) {
      let histDataPtInfo = lstHistData[i];
      console.log(i);
      let ptCord = new Point(
        parseFloat(lstHistData[i].ksJd),
        parseFloat(lstHistData[i].ksWd)
      );
      // mapVar.mapInstance.setMapCenter(ptCord.x,ptCord.y, 14);
      var marker;
      //起点
      if (lstHistData.length - 1 == i) {
        var strHtml1 = mapVar.imgMarker(mapVar.imgFactory.QD);
        marker = new HTMLElementOverLay('', ptCord, strHtml1, null, [10, 15]);
      } else if (i == 0) {
        //终点
        this.patharrinfo.push(histDataPtInfo);
        var strHtml1 = mapVar.imgMarker(mapVar.imgFactory.bj0);
        marker = new HTMLElementOverLay('', ptCord, strHtml1, null, [25, 25]);
      } else {
        //过程点
        if (
          histDataPtInfo.xsly == '01' ||
          histDataPtInfo.xsly == '05' ||
          histDataPtInfo.xsly == '09' ||
          histDataPtInfo.xsly == '10' ||
          histDataPtInfo.xsly == '19' ||
          histDataPtInfo.xsly == '20' ||
          histDataPtInfo.xsly == '21' ||
          histDataPtInfo.xsly == '22'
        ) {
          var strHtml0 = mapVar.imgMarker(mapVar.imgFactory.car);

          marker = new HTMLElementOverLay('', ptCord, strHtml0, null, [12, 12]);
          //  marker = new EzMarker(ptCord, iconc);
        } else if (
          histDataPtInfo.xsly == '02' ||
          histDataPtInfo.xsly == '03' ||
          histDataPtInfo.xsly == '04' ||
          histDataPtInfo.xsly == '06' ||
          histDataPtInfo.xsly == '07' ||
          histDataPtInfo.xsly == '11' ||
          histDataPtInfo.xsly == '12' ||
          histDataPtInfo.xsly == '13' ||
          histDataPtInfo.xsly == '14' ||
          histDataPtInfo.xsly == '15' ||
          histDataPtInfo.xsly == '16' ||
          histDataPtInfo.xsly == '17' ||
          histDataPtInfo.xsly == '18' ||
          histDataPtInfo.xsly == '24'
        ) {
          var strHtml0 = mapVar.imgMarker(mapVar.imgFactory.r);

          marker = new HTMLElementOverLay('', ptCord, strHtml0, null, [12, 12]);
        } else {
          //其他人车电网像中任意添加
        }
      }
      //为marker 绑定属性
      marker._marker.editing.options = { i: i, d: histDataPtInfo };
      //绑定弹出窗
      let p = marker;

      p.addListener('click', e => {
        var strHtml1 = '';
        let id = '';
        let img_id = '';
        let options = e.target.editing.options.d;
        let index = e.target.editing.options.i;
        let carpic = options.ksDz;
        let evtPlace = options.csms;
        let evtDate = options.jsnrms;
        let evtCar = options.ksnrms;
        let xsly = options.xsly;
        let xslypt = options.xslypt;

        //车
        if (
          xsly == '01' ||
          xsly == '05' ||
          xsly == '09' ||
          xsly == '10' ||
          xsly == '19' ||
          xsly == '20' ||
          xsly == '21' ||
          xsly == '22'
        ) {
          id = 'searchByCarPic' + index;
          img_id = 'img' + index;
          if (xslypt == '30') {
            if (carpic != null) {
              return passwayApi
                .getRealUrl({ url: carpic })
                .then(data => {
                  carpic = data;
                  let dom = document.getElementById(id);
                  if (!!dom) {
                    document.getElementById(img_id).setAttribute('src', carpic);
                  }
                })
                .catch(err => {
                  this.$message({
                    message: '连接服务器失败！',
                    type: 'warning'
                  });
                });
            } else {
              // if (data == null || data == '' || data == undefined) {
              carpic = mapVar.imgFactory.default;
              // }
              let dom = document.getElementById(id);
              if (!!dom) {
                document.getElementById(img_id).setAttribute('src', carpic);
                //document.getElementById(img_id).style.backgroundImage=url(carpic);
              }
            }
          } else {
          }
          setPopupContent({
            carpic: carpic,
            evtPlace: evtPlace,
            evtDate: evtDate,
            evtCar: evtCar
          });
        } else if (
          xsly == '02' ||
          xsly == '03' ||
          xsly == '04' ||
          xsly == '06' ||
          xsly == '07' ||
          xsly == '11' ||
          xsly == '12' ||
          xsly == '13' ||
          xsly == '14' ||
          xsly == '15' ||
          xsly == '16' ||
          xsly == '17' ||
          xsly == '18' ||
          xsly == '24'
        ) {
          //人
          //passwayGis.peoPicUrl = histDataPtInfo.ksDz;

          strHtml1 =
            "<div style='background-color: #173857;display:flex;flex-direction:row;border-radius: 5px;'>" +
            "<div style='padding: 5px;'><img  style='height:150px;width:150px;background-size: cover;background-repeat: no-repeat;background-position: center; background-image:url(" +
            carpic +
            ") '></div>" +
            "<div style='letter-spacing: 1px;'>" +
            "<ul style='padding: 15px; padding-left: 5px;padding-top: 25px; height: 80%;'><li><span>地点：</span> <span class=''>" +
            evtPlace +
            '</span></li>' +
            "<li><span>采集时间：</span> <span class=''> " +
            evtDate +
            '</span> </li>' +
            "<li> <span>车牌：</span><span class=''>" +
            evtCar +
            '</span> </li></ul>';
        } else {
          return;
        }
        function setPopupContent(opt) {
          strHtml1 =
            "<div style='background-color: #173857;display:flex;flex-direction:row;border-radius: 5px;'>" +
            "<div style='padding: 5px;'><img id=" +
            img_id +
            "  style='height:150px;width:150px;background-size: cover;background-repeat: no-repeat;background-position: center; background-image:url(" +
            carpic +
            ") '></div>" +
            "<div style='letter-spacing: 1px;'>" +
            "<ul style='padding: 15px; padding-left: 5px;padding-top: 25px; height: 80%;'><li><span>地点：</span> <span class=''>" +
            evtPlace +
            '</span></li>' +
            "<li><span>采集时间：</span> <span class=''> " +
            evtDate +
            '</span> </li>' +
            "<li> <span>车牌：</span><span class=''>" +
            evtCar +
            '</span> </li></ul>' +
            "<input type='button'  id=" +
            id +
            " style='bottom: 5px;width: 90px; height: 25px; background-color: #25495b;color: #7cb9e0;font-size: 15px;text-align: center; border: 1px solid #477480; padding-left: 5px;' value='以图搜车'></div> </div>";
          p.openInfoWindowHtml(strHtml1);
        }

        //   /**注意 Vue的生命周期以及引用过来的Jquery的生命周期问题导致 JQ的click 事件无法绑定**/
        setTimeout(() => {
          if (id != '') {
            let dom = document.getElementById(id);
            if (!!dom) {
              document.getElementById(id).addEventListener('click', () => {
                this.searchByPic(carpic);
              });
            }
          }
        }, 1000);
      });

       mapVar.mapInstance.map.addOverlay(marker);
      allOverLays.push(marker);
    },
    /**绘制线*/
    drawPolyline: function(points, style) {
      if (points.length >= 2) {
        var tmpLineData = [];
        tmpLineData.push([
          points[points.length - 2].ksJd,
          points[points.length - 2].ksWd
        ]);
        tmpLineData.push([
          points[points.length - 1].ksJd,
          points[points.length - 1].ksWd
        ]);
        var histLineTrack = new Polyline(
          tmpLineData.toString(),
          style.strokeColor,
          style.strokeWidth,
          style.strokeOpacity,
          false
        );
         mapVar.mapInstance.map.addOverlay(histLineTrack);
        allOverLays2.push(histLineTrack);
      }
    },
    //历史轨迹实时播放
    realTimeHistory: function(i, pointInfo) {
      if (pointInfo) {

        var ptCord = new Point(
          parseFloat(pointInfo.ksJd),
          parseFloat(pointInfo.ksWd)
        ); //路径点坐标
        if (
          pointInfo.xsly == '19' ||
          pointInfo.xsly == '01' ||
          pointInfo.xsly == '05' ||
          pointInfo.xsly == '09' ||
          pointInfo.xsly == '10' ||
          pointInfo.xsly == '20' ||
          pointInfo.xsly == '21' ||
          pointInfo.xsly == '22'
        ) {
          //绘制路径
          //路径点标注要素

          //创建marker对象
          var strHtml1 = mapVar.imgMarker(mapVar.imgFactory.guiji);
          let marker = new HTMLElementOverLay('', ptCord, strHtml1, null, [
            20,
            20
          ]);
          //将marker叠加到地图上
           mapVar.mapInstance.map.addOverlay(marker);

          hisArrMaker.push(marker);

          if (i == 0) {
            //重复播放路径   zhangkai 注释
            //this.cbsvtHis();
          }
        } else if (
          pointInfo.xsly == '02' ||
          pointInfo.xsly == '03' ||
          pointInfo.xsly == '04' ||
          pointInfo.xsly == '06' ||
          pointInfo.xsly == '07' ||
          pointInfo.xsly == '11' ||
          pointInfo.xsly == '12' ||
          pointInfo.xsly == '13' ||
          pointInfo.xsly == '14' ||
          pointInfo.xsly == '15' ||
          pointInfo.xsly == '16' ||
          pointInfo.xsly == '17' ||
          pointInfo.xsly == '18' ||
          pointInfo.xsly == '24'
        ) {
          //路径点坐标
          //绘制路径
          //路径点标注要素

          //创建marker对象
          //创建marker对象
          var strHtml1 = mapVar.imgMarker(mapVar.imgFactory.marker);
          let marker = new HTMLElementOverLay('', ptCord, strHtml1, null, [
            20,
            20
          ]);
          //将marker叠加到地图上
           mapVar.mapInstance.map.addOverlay(marker);
          //map.centerAndZoom(ptCord,12);
          hisArrMaker.push(marker);

          if (i == 0) {
            //重复播放路径   zhangkai 注释
            //   this.cbsvtHis();
          }
        } else {
          return;
        }
      }
      // }
    },

    clearHisTrack: function() {
      this.clearLSGJ();
      this.clearGJBF_car();
      this.clearJWD();
      this.clearGJX();
    },
    //历史轨迹
    getHistTrack: function(lstHistData) {
      //清除所有历史轨迹和实时轨迹

      if (lstHistData.length == 0) {
        return;
      }
      this.showbfdiv = true;
      var coord1 = new Point(
        parseFloat(lstHistData[0].ksJd),
        parseFloat(lstHistData[0].ksWd)
      );
      if (!coord1) {
        return;
      }
       mapVar.mapInstance.map.centerAtLatLng(coord1, 13);
      this.cph = lstHistData[0].zjhm;

      //放置历史轨迹的最后的一个点信息的变量置空
      //this.lastHistPtInfo==null;
      //放置实时轨迹的最后的一个点信息的变量置空
      //this.lastRealTimePtInfo=null;
      //todo 停止请求实时轨迹
      var lstHistPts = [];
      var lineData = [];
      var tmphistLineTrack = null;
      var lineStyle = {
        strokeColor: '#0000ff',
        strokeOpacity: 1,
        strokeWidth: 3
      };
      for (var i = 0; i <= lstHistData.length - 1; i++) {
        var histDataPtInfo = lstHistData[i];
        var lon = histDataPtInfo.ksJd;
        var lat = histDataPtInfo.ksWd;
        // jdwdarr.push([lon, lat, histDataPtInfo.xsly]);
        //console.log(i+":lon:"+lon+";lat:"+lat+histDataPtInfo.ksCssj);
        var ptCord = new Point(parseFloat(lon), parseFloat(lat)); //路径点坐标
        //绘制路径
        //路径点标注要素

        //创建marker对象
        var style = {
          fillColor: '#78f75f',
          fillOpacity: 1,
          strokeColor: '#78f75f',
          strokeOpacity: 0.5,
          radius: 8,
          strokeWidth: 4
        };

        var marker = null;
        var index = lstHistData.length - i;
        var endm = lstHistData.length;
        //起点
        if (lstHistData.length - 1 == i) {
          var strHtml1 = mapVar.imgMarker(mapVar.imgFactory.QD);
          marker = new HTMLElementOverLay('', ptCord, strHtml1, null, [10, 15]);
          // mapVar.mapInstance.setMapCenter(parseFloat(lon), parseFloat(lat), 12);
        } else if (lstHistData.length - index == 0) {
          //终点
          this.patharrinfo.push(histDataPtInfo);
          var strHtml1 = mapVar.imgMarker(mapVar.imgFactory.bj0);
          marker = new HTMLElementOverLay('', ptCord, strHtml1, null, [25, 25]);
        } else {
          //过程点
          if (
            histDataPtInfo.xsly == '01' ||
            histDataPtInfo.xsly == '05' ||
            histDataPtInfo.xsly == '09' ||
            histDataPtInfo.xsly == '10' ||
            histDataPtInfo.xsly == '19' ||
            histDataPtInfo.xsly == '20' ||
            histDataPtInfo.xsly == '21' ||
            histDataPtInfo.xsly == '22'
          ) {
            var strHtml0 = mapVar.imgMarker(mapVar.imgFactory.car);

            marker = new HTMLElementOverLay('', ptCord, strHtml0, null, [
              12,
              12
            ]);
            //  marker = new EzMarker(ptCord, iconc);
          } else if (
            histDataPtInfo.xsly == '02' ||
            histDataPtInfo.xsly == '03' ||
            histDataPtInfo.xsly == '04' ||
            histDataPtInfo.xsly == '06' ||
            histDataPtInfo.xsly == '07' ||
            histDataPtInfo.xsly == '11' ||
            histDataPtInfo.xsly == '12' ||
            histDataPtInfo.xsly == '13' ||
            histDataPtInfo.xsly == '14' ||
            histDataPtInfo.xsly == '15' ||
            histDataPtInfo.xsly == '16' ||
            histDataPtInfo.xsly == '17' ||
            histDataPtInfo.xsly == '18' ||
            histDataPtInfo.xsly == '24'
          ) {
            var strHtml0 = mapVar.imgMarker(mapVar.imgFactory.r);

            marker = new HTMLElementOverLay('', ptCord, strHtml0, null, [
              12,
              12
            ]);
          } else {
            //其他人车电网像中任意添加
          }
        }
        //为marker 绑定属性
        marker._marker.editing.options = { i: i, d: histDataPtInfo };
        //绑定弹出窗
        let p = marker;

        p.addListener('click', e => {
          var strHtml1 = '';
          let id = '';
          let img_id = '';
          let options = e.target.editing.options.d;
          let index = e.target.editing.options.i;
          let carpic = options.ksDz;
          let evtPlace = options.csms;
          let evtDate = options.jsnrms;
          let evtCar = options.ksnrms;
          let xsly = options.xsly;
          let xslypt = options.xslypt;

          //车
          if (
            xsly == '01' ||
            xsly == '05' ||
            xsly == '09' ||
            xsly == '10' ||
            xsly == '19' ||
            xsly == '20' ||
            xsly == '21' ||
            xsly == '22'
          ) {
            id = 'searchByCarPic' + index;
            img_id = 'img' + index;
            if (xslypt == '30') {
              if (carpic != null) {
                return passwayApi
                  .getRealUrl({ url: carpic })
                  .then(data => {
                    carpic = data;
                    let dom = document.getElementById(id);
                    if (!!dom) {
                      document
                        .getElementById(img_id)
                        .setAttribute('src', carpic);
                    }
                  })
                  .catch(err => {
                    this.$message({
                      message: '连接服务器失败！',
                      type: 'warning'
                    });
                  });
              } else {
                // if (data == null || data == '' || data == undefined) {
                carpic = mapVar.imgFactory.default;
                // }
                let dom = document.getElementById(id);
                if (!!dom) {
                  document.getElementById(img_id).setAttribute('src', carpic);
                  //document.getElementById(img_id).style.backgroundImage=url(carpic);
                }
              }
            } else {
            }
            setPopupContent({
              carpic: carpic,
              evtPlace: evtPlace,
              evtDate: evtDate,
              evtCar: evtCar
            });
          } else if (
            xsly == '02' ||
            xsly == '03' ||
            xsly == '04' ||
            xsly == '06' ||
            xsly == '07' ||
            xsly == '11' ||
            xsly == '12' ||
            xsly == '13' ||
            xsly == '14' ||
            xsly == '15' ||
            xsly == '16' ||
            xsly == '17' ||
            xsly == '18' ||
            xsly == '24'
          ) {
            //人
            //passwayGis.peoPicUrl = histDataPtInfo.ksDz;

            strHtml1 =
              "<div style='background-color: #173857;display:flex;flex-direction:row;border-radius: 5px;'>" +
              "<div style='padding: 5px;'><img  style='height:150px;width:150px;background-size: cover;background-repeat: no-repeat;background-position: center; background-image:url(" +
              carpic +
              ") '></div>" +
              "<div style='letter-spacing: 1px;'>" +
              "<ul style='padding: 15px; padding-left: 5px;padding-top: 25px; height: 80%;'><li><span>地点：</span> <span class=''>" +
              evtPlace +
              '</span></li>' +
              "<li><span>采集时间：</span> <span class=''> " +
              evtDate +
              '</span> </li>' +
              "<li> <span>车牌：</span><span class=''>" +
              evtCar +
              '</span> </li></ul>';
          } else {
            return;
          }
          function setPopupContent(opt) {
            strHtml1 =
              "<div style='background-color: #173857;display:flex;flex-direction:row;border-radius: 5px;'>" +
              "<div style='padding: 5px;'><img id=" +
              img_id +
              "  style='height:150px;width:150px;background-size: cover;background-repeat: no-repeat;background-position: center; background-image:url(" +
              carpic +
              ") '></div>" +
              "<div style='letter-spacing: 1px;'>" +
              "<ul style='padding: 15px; padding-left: 5px;padding-top: 25px; height: 80%;'><li><span>地点：</span> <span class=''>" +
              evtPlace +
              '</span></li>' +
              "<li><span>采集时间：</span> <span class=''> " +
              evtDate +
              '</span> </li>' +
              "<li> <span>车牌：</span><span class=''>" +
              evtCar +
              '</span> </li></ul>' +
              "<input type='button'  id=" +
              id +
              " style='bottom: 5px;width: 90px; height: 25px; background-color: #25495b;color: #7cb9e0;font-size: 15px;text-align: center; border: 1px solid #477480; padding-left: 5px;' value='以图搜车'></div> </div>";
            p.openInfoWindowHtml(strHtml1);
          }

          /**注意 Vue的生命周期以及引用过来的Jquery的生命周期问题导致 JQ的click 事件无法绑定**/
          setTimeout(() => {
            if (id != '') {
              let dom = document.getElementById(id);
              if (!!dom) {
                document.getElementById(id).addEventListener('click', () => {
                  this.searchByPic(carpic);
                });
              }
            }
          }, 1000);
        });

        //marker的pop。根据不同的type来定义。
        //将marker叠加到地图上

        lineData.push([lon, lat]);

        this.lastHistPtInfo = ptCord;
         mapVar.mapInstance.map.addOverlay(marker);
        allOverLays.push(marker);

        if (lineData.length >= 2) {
          var tmpLineData = [];
          tmpLineData.push(lineData[lineData.length - 2]);
          tmpLineData.push([lon, lat]);
          var histLineTrack = new Polyline(
            tmpLineData.toString(),
            '#5ad5e3',
            3,
            1,
            false
          );
          //histLineTrack.id=this.histTrackName;

           mapVar.mapInstance.map.addOverlay(histLineTrack);

          allOverLays2.push(histLineTrack);
        }
      }

      var lstFilterData = [];
      for (var i = 0; i < lstHistData.length; i++) {
        if (0 == i) {
          lstFilterData.push([lstHistData[i].ksJd, lstHistData[i].ksWd]);
        } else {
          if (lstFilterData.length > 0) {
            if (
              !(
                lstFilterData[lstFilterData.length - 1][0] ==
                  lstHistData[i].ksJd &&
                lstFilterData[lstFilterData.length - 1][1] ==
                  lstHistData[i].ksWd
              )
            ) {
              lstFilterData.push([lstHistData[i].ksJd, lstHistData[i].ksWd]);
            }
          }
        }
      }
    },
    //实时数据<基于历史数据接口实现实时播放>
    getRealTrackJZ: function(lstHistData) {
      this.clearSSGJ();

      //放置实时轨迹的最后的一个点信息的变量置空
      this.lastRealPtInfo == null;
      var lstHistPts = [];
      var lineData = [];
      var tmphistLineTrack = null;
      var lineStyle = {
        strokeColor: '#fb7670',
        strokeOpacity: 1,
        strokeWidth: 3
      };
      for (var i = lstHistData.length - 1; i >= 0; i--) {
        var histDataPtInfo = lstHistData[i];
        var lon = histDataPtInfo.ksJd;
        var lat = histDataPtInfo.ksWd;
        console.log(i + ':lon:' + lon + ';lat:' + lat + histDataPtInfo.ksCssj);
        var ptCord = new Point(parseFloat(lon), parseFloat(lat)); //路径点坐标
        //绘制路径

        //创建marker对象
        var style = {
          fillColor: '#78f75f',
          fillOpacity: 1,
          strokeColor: '#78f75f',
          strokeOpacity: 0.5,
          radius: 8,
          strokeWidth: 4
        };
        var marker = null;
        var index = lstHistData.length - i;
        if (lstHistData.length - 1 == i) {
          //终点
          var strHtml1 = mapVar.imgMarker(mapVar.imgFactory.bj0);
          marker = new HTMLElementOverLay('', ptCord, strHtml1, null, [20, 20]);
        } else if (lstHistData.length - index == 0) {
          //起点   如果有历史轨迹-该点是来自历史轨迹
          if (allOverLays.length > 0) {
            lineData.push([
              allOverLays[0]._marker._latlng.lng,
              parseFloat(allOverLays[0]._marker._latlng.lat)
            ]);
            mapVar.removeOverlay(allOverLays[0]);
          }
          if (lstHistData.length == 1) {
            var strHtml1 = mapVar.imgMarker(mapVar.imgFactory.new);

            marker = new HTMLElementOverLay('', ptCord, strHtml1, null, [
              20,
              20
            ]);
          }
        } else {
          var strHtml1 = mapVar.imgMarker(mapVar.imgFactory.car);

          marker = new HTMLElementOverLay('', ptCord, strHtml1, null, [20, 20]);
        }
        //绑定实时轨迹popup 只考虑车
        let p = marker;
        if (p)
          p.addListener('click', () => {
            var strHtml1 = '';

            let carpic = histDataPtInfo.ksDz;
            let evtPlace = histDataPtInfo.csms;
            let evtDate = histDataPtInfo.jsnrms;
            let evtCar = histDataPtInfo.ksnrms;

            let id = 'searchByCarPic_ss' + i;
            strHtml1 =
              "<div style='background-color: #173857;display:flex;flex-direction:row;border-radius: 5px;'>" +
              "<div style='padding: 5px;'><img  style='height:150px;width:150px;background-size: cover;background-repeat: no-repeat;background-position: center; background-image:url(" +
              carpic +
              ") '></div>" +
              "<div style='    letter-spacing: 1px;'>" +
              "<ul style='padding: 15px; padding-left: 5px;padding-top: 25px; height: 80%;'><li><span>地点：</span> <span class=''>" +
              evtPlace +
              '</span></li>' +
              "<li><span>采集时间：</span> <span class=''> " +
              evtDate +
              '</span> </li>' +
              "<li> <span>车牌：</span><span class=''>" +
              evtCar +
              '</span> </li></ul>' +
              "<input type='button'  id=" +
              id +
              " style='bottom: 5px;width: 90px; height: 25px; background-color: #25495b;color: #7cb9e0;font-size: 15px;text-align: center; border: 1px solid #477480; padding-left: 5px;' value='以图搜车'></div> </div>";
            p.openInfoWindowHtml(strHtml1);
            /**注意 Vue的生命周期以及引用过来的Jquery的生命周期问题导致 JQ的click 事件无法绑定**/
            setTimeout(() => {
              let dom = document.getElementById(id);
              if (!!dom) {
                document.getElementById(id).addEventListener('click', () => {
                  this.searchByPic(carpic);
                });
              }
            }, 1000);
          });

        // marker.values_.customs = {};
        lineData.push([lon, lat]);
        this.lastRealPtInfo = realTimePonit;
        if (marker) {
           mapVar.mapInstance.map.addOverlay(marker);
          allOverLays1.push(marker);
        }

        if (lineData.length >= 2) {
          var tmpLineData = [];
          tmpLineData.push(lineData[lineData.length - 2]);
          tmpLineData.push([lon, lat]);
          var histLineTrack = new Polyline(
            tmpLineData.toString(),
            '#fb7670',
            3,
            1,
            false
          );
          //histLineTrack.id=this.histTrackName;
          //console.log("22");
           mapVar.mapInstance.map.addOverlay(histLineTrack);
          //console.log("333");
          allOverLays2.push(histLineTrack);
          //console.log(histLineTrack);

          //var pos3=new EzCoord(104.77573,29.34203);
        }
      }

      var lstFilterData = [];
      for (var i = 0; i < lstHistData.length; i++) {
        if (0 == i) {
          lstFilterData.push([lstHistData[i].ksJd, lstHistData[i].ksWd]);
        } else {
          if (lstFilterData.length > 0) {
            if (
              !(
                lstFilterData[lstFilterData.length - 1][0] ==
                  lstHistData[i].ksJd &&
                lstFilterData[lstFilterData.length - 1][1] ==
                  lstHistData[i].ksWd
              )
            ) {
              lstFilterData.push([lstHistData[i].ksJd, lstHistData[i].ksWd]);
            }
          }
        }
      }
    },

    //弃车逃跑地点
    getEscapePlace: function(lng, lat) {
      var pos = new EzCoord(lng, lat);
      var html = mapVar.imgMarker(mapVar.imgFactory.selcetIcon);
      var htmlOverlay = new HTMLElementOverLay(
        '',
        pos,
        html,
        [0, 0],
        'center-center'
      );
      htmlOverlay.id = this.realTimeTrack;
      htmlOverlay.attr = '弹出框';
      htmlOverlay.html = '弃车逃跑';
      map.addOverlay(htmlOverlay);
      allOverLays.push(htmlOverlay);
      htmlOverlay.addEventListener('click', function(evt) {
        console.log('弹出框信息');
      });
    },
    //可能的逃跑轨迹
    getEscapeTracks: function(lstEscapeData) {
      var lstTrackLen = lstEscapeData.length;
      for (var i = 0; i < lstTrackLen; i++) {
        var perTrackData = lstEscapeData[i];
        //画点 perEscapelineData初始化为最后弃车逃跑点
        var perEscapelineData = [];
        //lineData.push([curPeoLng,curPeoLat]);
        perEscapelineData.push([curPeoLng, curPeoLat]);
        for (var j = 0; j < perTrackData.length; j++) {
          var lng = perTrackData[j].lng;
          var lat = perTrackData[j].lat;
          var ptCord = new EzCoord(lng, lat); //路径点坐标
          //路径点标注要素
          var icon = new EzIcon({
            src: mapVar.imgFactory.icon_b_02,
            opacity: 1
          });
          //创建marker对象
          var marker = new EzMarker(ptCord, icon);
          marker.id = this.escapeTrack;
          //marker 的pop。根据不同的type来定义。
          //将marker叠加到地图上
          map.addOverlay(marker);
          perEscapelineData.push([lng, lat]);
        }
        //画线
        var lineStyle = {
          strokeColor: '#ff7e24',
          strokeOpacity: 1,
          strokeWidth: 3,
          strokeLineDash: [1, 2, 3, 4, 5, 6]
        };
        var esacpeLineTrack = new Polyline(perEscapelineData, lineStyle);
        esacpeLineTrack.id = this.escapeTrack;
        map.addOverlay(esacpeLineTrack);
        allOverLays.push(esacpeLineTrack);
      }
    },

    //以图搜车
    searchByPic: function(carpic) {
      //this.carPicUrl = imgUrl;
      //直接请求后台，还是传给前端？
      //alert("1111");
      //console.log('获取图片地址：'+carpic);
      // var imgUrl = this.carPicUrl;
      var imgUrl = carpic;
      eventBus.$emit(eventCollection.SEARCH_AUTOBY_IMG, imgUrl);
      $('#mq_popDivCar').hide();
    },
    searchByPeoPic: function() {
      var testdata2 = [
        [
          { lng: 104.087573, lat: 30.722399, id: 122883, title: '测试1' },
          { lng: 104.087223, lat: 30.672686, id: 122343, title: '测试2' },
          { lng: 104.087286, lat: 30.682666, id: 11123, title: '测试8' }
        ]
      ];
      this.getEscapeTracks(testdata2);
    },

    /*一键布控实时布控开始*/
    setYJBK: function(id) {
      this.initWebSocket();
      this.url = '/topic/' + id.bksqbh + '/track';
      this.url1 = '/topic/' + id.bksqbh + '/feedback';

      this.showbfdiv = false;

      //清除地图上 添加层
      // this.clearLSGJ();

      //this.clearSSGJ();
      //this.clearGJX();

      //this.clearGJBF_car();
    },
    /*一键布控实时数据结束*/

    /*警情预警预测 标点*/
    markerPolice: function(data) {
      policeGis.markerPolice(data);
    },

    controlGis_loc: function(r) {
      ControlGis.location(r);
    },
    /**地名地址搜索**/
    poiSearch: function() {
      //overLayer_jingli//
      overLayer_jingli.forEach(ly => {
         mapVar.mapInstance.map.removeOverlay(ly.ly);
      });
      overLayer_jingli = [];
      this.poiSearchList = [];

      let n = this.poiName;
      if (n == '') {
        return;
      }
      //let dwbh =item.jjdwmc;//item.jjdwmc;
      let layername =
        '(JWZH_NBDWBW_JYZ_PT JWZH_ZAGL_YLCS_PT JWZH_ZAGL_WLJDHY_PT JWZH_ZAGL_WBZLSCS_PT JWZH_ZAGL_LD_PT JWZH_ZAGL_WB_PT JWZH_FKFB_YLJZDW_PT JWZH_DWXX_DZJG_PT JWZH_DWXX_JY_PT JWZH_DWXX_QSYDW_PT DWXX_GAJG_PT JWZH_BZDZ_JLX_PT JWZH_BZDZ_MP_PT JWZH_BZDZ_LP_PT CS_GGHDCS_PT CS_JTCS_PT CS_YLCS_PT CS_SMCS_PT CS_LYCS_PT CS_TYCS_PT CS_WHCS_PT CS_JMFWCS_PT CS_HLWSWFWYYCS_PT CS_ZJCS_PT CS_ZSFWCS_PT CS_CYFWCS_PT CS_TSHYFWCS_PT CS_BNCS_PT SX_DZSX_PT SX_DZSXFSSS_PT JMDJSS_DZJMD_PT JMDJSS_DZJZW_PT JT_DZJTSS_PT GX_DZGX_PT DM_DZDM_PT JT_XZJTSS_QL_PT JT_XZJTSS_SD_PT)';
      var queryType = 'PY'; //查询类型：全文检索
      var method = 'FULL'; //查询方法：全文查询
      var scope = '_FULLTEXT'; //查询范围：所有字段
      var spaceQueryStr = '';
      var where = 'LAYERNAME:' + layername;
      var parameter =
        'type=' +
        queryType +
        '&method=' +
        method +
        '&scope=' +
        scope +
        '&keywords=' +
        n +
        '&filterCustom=' +
        where +
        '&pageIndex=0&pageSize=10' +
        spaceQueryStr;
      var _this = this;
     mapVar.demoApp.EzPOISearch_sc(parameter, data => {
        if (data.groups.length == 0) {
          this.poiSearchList.push({ id: -1, name: '未搜索到相关位置...' });
          return;
        }

        let searchData = data.groups[0].pois;
        if (searchData.length == 0) {
          this.poiSearchList.push({ id: -1, name: '未搜索到相关位置...' });
          return;
        }
        if (this.poiSearchList.length >= 10) {
          this.poiSearchList = [];
        }
        if (this.searchStyle == 'left') {
          searchData.forEach((item, index) => {
            let id = 'item' + index;
            this.poiSearchList.push({
              id: id,
              name: item.name + '     ' + item.address
            });
            if (!item.x || !item.y) {
            } else {
              let ptCord = new Point(item.x, item.y);
              var strHtml1 = mapVar.imgMarker(mapVar.imgFactory.marker);

              let marker = new HTMLElementOverLay(id, ptCord, strHtml1, null, [
                20,
                20
              ]);

               mapVar.mapInstance.map.addOverlay(marker);
              overLayer_jingli.push({ id: id, ly: marker });
            }
          });
        } else {
          searchData.forEach((item, index) => {
            let id = 'item' + index;
            if (index == 0) {
               mapVar.mapInstance.map.centerAndZoom(new Point(item.x, item.y), 13);
            }
            this.poiSearchList.push({
              id: id,
              name: item.name + '     ' + item.address
            });
            if (!item.x || !item.y) {
            } else {
              let ptCord = new Point(item.x, item.y);
              var strHtml1 = mapVar.imgMarker(mapVar.imgFactory.marker);

              let marker = new HTMLElementOverLay(id, ptCord, strHtml1, null, [
                20,
                20
              ]);

              marker.addListener('click', e => {
                _this.poiSearch_callback(e.latlng);
              });
               mapVar.mapInstance.map.addOverlay(marker);
              overLayer_jingli.push({ id: id, ly: marker });
            }
          });
        }
      });
    },

    poiResultList_click: function(id) {
      if (id == -1) return;
      for (var i = 0; i < overLayer_jingli.length; i++) {
        if (overLayer_jingli[i].id == id) {
          overLayer_jingli[i].ly._marker._latlng;
           mapVar.mapInstance.map.centerAndZoom(
            new Point(
              overLayer_jingli[i].ly._marker._latlng.lng,
              overLayer_jingli[i].ly._marker._latlng.lat
            ),
            19
          );
        }
      }
    }
    /**地名地址搜索*********************************************end**/
  },
  beforeDestroy() {
    eventBus.$off(eventCollection.PASSWAY_INIT_MAP);
  },
  beforeCreate: function() {},
  created: function() {
    eventBus.$on(eventCollection.PASSWAY_VIEWDANGAN, data => {
      this.lookbkdxda(data);
    });
    eventBus.$on(eventCollection.PASSWAY_CLEAR_HISTRACK, () => {
      this.clearHisTrack();
    }),
      //警情预警地图上打点=----报警地所属派出所
      eventBus.$on(eventCollection.PASSWAY_MARKER_PCS, data => {
        this.markerPolice(data);
      }),
      //点击地图获得点击经纬度
      eventBus.$on(eventCollection.PASSWAYGIS_GETPOINT_BYCLICK, () => {
        this.markerBy_mapClick();
      }),
      eventBus.$on(eventCollection.PUSH_INSTRUCT_ID, id => {
        if (id.bksqbh == '') {
          return;
        } else {
          this.setYJBK(id);
        }
      });
  },
  /**组件销毁事件，
   *
   * 注意清除地图叠加层、marker标记层、line叠加层**/
  beforeDestroy: function() {
    this.clearLSGJ();
    this.clearSSGJ();

    this.clearGJX();

    this.clearGJBF_car();

    //  mapVar.mapInstance.map.uMap = null;

    // PMap = null;
    // DemoApp = null;
    //  mapVar.mapInstance = null;
  }
};
</script>
<style>
.s_left .el-input-group__append {
  background-color: rgba(114, 118, 121, 0.6);
  border-color: rgb(243, 242, 240);
  color: #fff;
}
.s_left .el-input-group--append .el-input__inner,
.el-input-group__prepend {
  background-color: rgba(114, 118, 121, 0.6);
  border-color: rgb(243, 242, 240);
  color: #fff;
}
.s_right .el-input-group__append {
  background-color: rgba(2, 21, 35, 0.6);
  border-color: rgba(4, 78, 146, 0.69);
  color: #fff;
}
.s_right .el-input-group--append .el-input__inner,
.el-input-group__prepend {
  background-color: rgba(2, 21, 35, 0.6);
  border-color: rgba(4, 78, 146, 0.69);
  color: #fff;
}

.css_animation {
  height: 30px;
  width: 30px;
  border-radius: 15px;
  background: rgba(255, 0, 0, 0.9);

  transform: scale(0);
  animation: myfirst 3s;
  animation-iteration-count: infinite;
}

@keyframes myfirst {
  to {
    transform: scale(2);
    background: rgba(0, 0, 0, 0);
  }
}

.securityLayerManager .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #fff !important;
}
</style>
<style scoped>
.s_right {
  z-index: 1;
  position: absolute;
  left: 50%;
  margin-left: -250px;
  width: 500px;
  top: 11%;
  color: #fff;
}
.s_left {
  z-index: 1002;
  position: absolute;
  left: 4%;
  top: 30px;
  color: #fff;
}
.poi_searchResult {
  padding: 5px;
}
.poi_searchResult:hover {
  color: #477480;
}

.securityLayerManager {
  position: fixed;
  display: none !important;
  flex-direction: row;
  justify-content: space-evenly;
  top: 110px;
  left: 52%;
  margin-left: -375px;
  height: 45px;
  width: 750px;
  background-color: rgba(17, 35, 51, 0.8);
  border: 1px solid #173857;
  z-index: 99;
  padding: 10px;
  border-radius: 5px;
}

.ez-popup {
  z-index: 999;
}

.gis-wrap {
  flex: 1;
  background-image: url('../../../static/images/tongdao/gis-bg.jpg');
}

.map-h {
  position: relative;
  height: 100%;
  flex: 1;
  overflow: hidden;
  z-index: auto;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url('');
  background-color: #fff;
  /* background-repeat: no-repeat;
	background-position: center;
	background-image: url('../../../static/images/map-dark.jpg') */
}

.popDiv {
  position: absolute;
  width: 320px;
  z-index: 9999;
  left: 100px;
  top: 100px;
  background-color: #173857;
  color: #fff;
  padding: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
}

.y_pop_car {
  width: 300px;
  float: left;
}

.y_pop_carPic {
  width: 150px;
  float: left;
}

.y_pop_carAttr {
  width: 150px;
  padding-left: 5px;
  float: right;
  color: #fff;
}

.ol-extern-echarts {
  display: none;
}

.mq_pop_close {
  float: right;
  padding-right: 10px;
}

.mq_pop_btn {
  position: absolute;
  bottom: 5px;
  width: 90px;
  height: 25px;
  background-color: #25495b;
  color: #7cb9e0;
  font-size: 15px;
  text-align: center;
  border: 1px solid #477480;
  padding-left: 5px;
}

.lsgjbf {
  position: absolute;
  bottom: 20px;
  right: 40px;
  width: 200px;
  height: 50px;
  z-index: 100;
}

.lsgjbfspan {
  background-color: #ea3333;
  color: #fff;
  width: 200px;
  height: 30px;
  padding: 5px;
}

.lsgjtzspan {
  background-color: cadetblue;
  color: #fff;
  width: 200px;
  height: 30px;
  padding: 5px;
}

.top-tools,
.top-tools .item-inner {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
}
</style>