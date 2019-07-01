<template>
  <!--  -->
  <div class="mapContainer">
    <baidu-map
      @ready="handler"
      :scroll-wheel-zoom="true"
      :center="default_config.center"
      :zoom="default_config.zoom"
      class="bm-view"
      ak="SEdVXzi3akksFcjUA7T2YtahjaOCrB1p"
      :dragging="default_config.isdragging"
      :map-click="false"
      @mousemove="syncPolygon"
      @click="paintPolygon"
      @rightclick="newPolygon"
       @load="loadData"
      
    >
      <!-- <bm-view  style="width: 100%; height:100px; flex: 1"></bm-view> -->
      <!-- <bml-marker-clusterer :averageCenter="true">
              <bm-marker  :position="{lng: 104, lat: 30}"></bm-marker>
              <bm-marker :position="{lng: 104, lat: 30} "></bm-marker>
      </bml-marker-clusterer>-->
      <bm-navigation v-if="default_config.isShowNavigation" :showZoomInfo="false" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
      <bm-scale v-if="default_config.isShowScale" anchor="BMAP_ANCHOR_BOTTOM_LEFT"></bm-scale>
      <bm-polygon
        :path="path"
        v-for="path of polygon.paths"
        :key='path.lng+","+path.lat+Math.random()'
      ></bm-polygon>

      <bm-polyline
        :path="path"
        v-for="path of polyline.paths"
        :key='path.lng+","+path.lat+Math.random()'
      ></bm-polyline>

      <bm-info-window :position="{lng: infoWindow.lng, lat:infoWindow.lat}" title="Info Window Title" :show="infoWindow.show">
         yutyu
      </bm-info-window>

    </baidu-map>


    <div class="mapSelfNavigation" v-if="default_config.isShowSelfNavigation" >
        <div class="selfnavigation xiaoqu" @click="zoomTo(18)"></div>
        <div class="selfnavigation shequ"  @click="zoomTo(14)"></div>
        <div class="selfnavigation quxian" @click="zoomTo(11)"></div>
    </div>
      
      <div class="gsInfo" >
          <!-- <span> 超标企业列表 <span> -->
          
          <el-table
            :data="this.ajaxData.companyData" :show-header='true'  :row-style="{cursor: 'pointer',color:'red'}"    @row-click="rowClick"
            style="width: 100%">
            <el-table-column
              prop="name"
              label="超标企业列表"
              width="300">
            </el-table-column>
            <!-- <el-table-column
              prop="status"
              label="状态"
              width="80">
            </el-table-column>
            <el-table-column
              prop="address"
              label="地址"
               width="200">
            </el-table-column> -->
          </el-table>
              
      </div>
   
      <div class="mapKakouTool" @click="playerVideo(videoStatics)">
        <!-- <div class="mapKakouTool"> -->
        <img :src=bmapImg.btnSPJK style="height:80px; cursor: pointer; ">
       
      </div>
 
   
    <div
      class="mapCoordinate"
    >{{default_config.currentPoint.lng.toFixed(4)+","+default_config.currentPoint.lat.toFixed(4)}}</div>
    <div>
      <el-dialog title="位置迁移" :visible.sync="dialogVisible" width="20%" class="modal-popover">
        <!-- <div class style="height:200px">
          <span>这是一段视频</span>
        </div>-->
        <div class="row" style="margin-bottom: 10px;">
          <div class="col-md-6 spandiv">
            <span class="spandec">经度：
              <el-input  ref='wzqy_lng' placeholder="请输入内容" style="width: 100px;">104.32</el-input>
            </span>
          </div>
          <div class="col-md-6 spandiv">
            <span class="spandec">纬度：
              <el-input  ref='wzqy_lng' placeholder="请输入内容" style="width: 100px;">31.69</el-input>
            </span>
          </div>
        </div>
        <div class="row" style="margin-bottom: 10px;">
          <div class="col-md-12 spandiv">
            <span class="spandec">地址：
              <el-input  ref='wzqy_address' placeholder="请输入内容" style="width: 250px;"></el-input>
            </span>
          </div>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateZjxx">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    
  </div>
</template>

<script>
import { BaiduMap } from "vue-baidu-map";
import eventBus from "@/event";
import { eventCollection } from "@/event/resources";
import { shipinApi, excontrolApi,tmpApi  } from "@/https";
import { BmNavigation } from "vue-baidu-map";
import { BmScale } from "vue-baidu-map";

import { BmMarker } from "vue-baidu-map";
import { BmlMarkerClusterer } from "vue-baidu-map";
import { BmPolygon } from "vue-baidu-map";
import { BmPolyline } from "vue-baidu-map";
import { BmControl } from "vue-baidu-map";
import { BmDriving } from "vue-baidu-map";

import { BmInfoWindow } from "vue-baidu-map";
//引入百度扩展库
// import MarkerClusterer from '@/common/baidu/MarkerClusterer.js' //引入公共方法
// import TextIconOverlay from '@/common/baidu/TextIconOverlay.js' //引入公共方法

export default {
  name: "baidumap",
  data() {
    return {
      // videoStatics:'JZVideoClient://2;10.3.9.178;30252;/videoSupport/Client_SipInfo;jz123456;00000000000000000000;',
      videoStatics:{id:'00000000000000000000',isOnline:'在线'},
      input: '',
      BMap: null,
      map: null,
      // idx: 0,
      // InteractList: [], //当前交互数据，包括卡口、警告

      default_config: {
        // center: { lng: 104.664602, lat: 31.469322 },
        // center: { lng: 104.072314, lat: 30.663207 },
         center: { lng: 104.2859, lat: 30.5876 },
        zoom: 12,
        isdragging: true,
        currentPoint: { lng: 104.072314, lat: 30.663207 },
        isShowNavigation: true,
        isShowScale: true,
        isShowSelfNavigation: false,
      },
      bmapImg: {
        qydw_red: "../../../static/image/bmap/qydw_red.png",
        qydw_blue: "../../../static/image/bmap/qydw_blue.png",
        qydw_gl: "../../../static/image/bmap/qydw_gl.png",
        jksxt: "../../../static/image/bmap/jksxt.png",
        kakou: "../../../static/image/bmap/kakou.png",
        spjk: "../../../static/image/bmap/spjk.png",
        hlspjk: "../../../static/image/bmap/hlspjk.png",


          btnSPJK: "../../../static/image/bmap/btnSPJK.png",

        // hlkakou: "../../../static/image/bmap/hlkakou.png",
        // cl: "../../../static/image/bmap/cl.png",
        // hlcl: "../../../static/image/bmap/hlcl.png",
        // ry: "../../../static/image/bmap/ry.png",
        // hlry: "../../../static/image/bmap/hlry.png",
        // start: "../../../static/image/bmap/start3.png",
        // end: "../../../static/image/bmap/end3.png",
        // cluster: "../../../static/image/bmap/blue.png",
        // cluster_red: "../../../static/image/bmap/red.png",
        // cluster_color: "../../../static/image/bmap/",

       
      },
      infoWindow: {
        show: false,
        lng: 104.072314, 
        lat: 30.663207,
        contents: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      },
      ajaxData: {
        companyData:[],
        companyCameraData:[],
        kakou: [],
        notification: {data:[],type:[]}
      },
      //guiji
      drivingRoute:null,
     

      polyline: {
        editing: false,
        paths: []
      },

      polygon: {
        editing: false,
        paths: []
      },
      point: {
        editing: false
      },
      drag: {
        editing: false
      },

      kakou: {
        data: [],
        type: ""
      },

      dialogVisible: false,

      dianjumap_obj: null
     
    };
  },
  props: [
   
    "notification",
    "notification_type",
    "showKaKouTool",
    "removeGaojingLayer",
    "showGaojingRoute",
    "activeName",
    "cakoudefault",
    "yibiaosanshu",
    "zhongdianrenyuan",
    "mapStyle",
    "p_isShowScale",
    "p_isShowNavigation",
    "p_isShowSelfNavigation",
      "p_showXzq",
    "addtype",
  ],
  watch: {
   
   
    activeName: {
      handler() {
        if (!this.map) return;
        console.log("当前tab2" + this.activeName);

        if (this.activeName == "third") {
         
          if(this.haveMaker("notification")){
             this.showAtMaker("notification");
          }else{
            //更加数据加载notificatin
          
          }
          this.hideAtMaker("kakou");

        } else if (this.activeName == "first" || this.activeName == "second") {
         
          //显示卡口

          if(this.haveMaker("kakou")){
             this.showAtMaker("kakou");
          }else{
            //更加数据加载notificatin

          }
        
          this.hideAtMaker("notification");

          //删除告警列表轨迹
          //  this.drivingRoute.clearResults();

        }
      },
      immediate: true,
      deep: true
    },

  },
  components: {
    BaiduMap,
    BmMarker,
    BmNavigation,
    BmScale,
    BmPolygon,
    BmPolyline,
    BmControl,
    BmDriving,
     BmInfoWindow
    // BmlMarkerClusterer,
  },
  beforeDestory() {
    //卡口树列表-->地图的操作
    eventBus.$off(eventCollection._bmap_tree2map, (data, curnode) => {
      this.flashKakou(data);
    });

     eventBus.$off(eventCollection._bmap_treeclick2map, (data, curnode) => {
    
    });

     eventBus.$off(eventCollection._bmap_treedoubleclick2map, (data, curnode) => {
    
    });



    //告警列表-->地图的操作
    eventBus.$off(eventCollection._gaojingliebiao2map, data => {
      console.log(data);
    });
  },

  created() {
    console.log("最开始执行");

    var that = this;
    window.eventBus=eventBus;
    window.eventCollection=eventCollection;
    //卡口树和视频树列表-->地图的操作
    eventBus
      .$off(eventCollection._bmap_tree2map)
      .$on(eventCollection._bmap_tree2map, (data, curnode) => {
        // this.setKakou(data, type);
        //跟新卡口状态
        console.log(this.ajaxData.kakou);

        this.ajaxData.companyCameraData.forEach((item, idx) => {
          let count = 0;
          // indexCode  id
          if (data.toString().indexOf(item.indexCode) > -1) {
            item.state = true;
          } else {
            item.state = false;
          }
        }, this);
        // shipingjiankong
        this.flashAtMaker(
          data,
          "kakou",
          this.bmapImg.spjk,
          this.bmapImg.hlspjk
        );
        console.log("moveto跳转到卡口");
        this.moveToMaker(data, curnode);
    });

    //视频监控-点击卡口而不选中时;实时监测-企业
    eventBus
      .$off(eventCollection._bmap_treeclick2map)
      .$on(eventCollection._bmap_treeclick2map, (data) => {
        
        //将当前卡口置顶
        // console.log(this.map);
        //  console.log(this.map.getOverlays());
        //    console.log(that.map);
        //  console.log(that.map.getOverlays());
        var that=this;
        if(data.id.substr(2,data.id.length)=='000000000000000000'){ 
          //省
        }
        if(data.id.substr(4,data.id.length)=='0000000000000000'){
          //市
        }
        else if(data.id.substr(6,data.id.length)=='00000000000000'){
          //区,平移到区中心
          //根据区名，查找区的geometry data.name

          this.findXZQGeometry(data.name).then(function(data){
              console.log(data);
              if(data.length>0){
                 var ply = new BMap.Polygon(data[0], {strokeWeight:3, strokeColor: "#0b699b",fillColor:"#3daafc54",fillOpacity:0.03||0.2}); //建立多边形覆盖物
                
                  that.map.panTo(ply.getBounds().getCenter());
              }
              
          });





        } else if(data.id.substr(10,data.id.length)=='0000000000'){
          //街道
        }
        else{

          let overlay = that.map.getOverlays();

          var gl = new this.BMap.Icon(that.bmapImg.qydw_gl, new this.BMap.Size(28, 35));
          gl.imageSize = new this.BMap.Size(28, 35);

          var wgl = new this.BMap.Icon(that.bmapImg.qydw_blue, new this.BMap.Size(28, 35));
          wgl.imageSize = new this.BMap.Size(28, 35);

          var wgl2 = new this.BMap.Icon(that.bmapImg.qydw_red, new this.BMap.Size(28, 35));
          wgl2.imageSize = new this.BMap.Size(28, 35);

          for (var j = 0; j < overlay.length; j++) {
            if (overlay[j].Bc) {
              if (overlay[j].Bc.className) {
                if (overlay[j].getLabel) {
                  if(overlay[j].point.lng!=null&&overlay[j].point.lng!=0){

                      // if(overlay[j].getLabel().content==data.id){
                    if(overlay[j].getLabel().content==data.name){
                      this.map.panTo(overlay[j].getPosition());
                      overlay[j].setTop(true);  // overlay[j].
                      overlay[j].setIcon(gl);  // overlay[j].
                    }else{
                      if(overlay[j].getTitle().split(',')[2]=="1"){
                        overlay[j].setTop(false);
                        overlay[j].setIcon(wgl);  // overlay[j].
                      }else{
                        overlay[j].setTop(false);
                        overlay[j].setIcon(wgl2);  // overlay[j].
                      }
                      
                    
                    }

                    if(overlay[j].getLabel().content==data.id){
                      this.map.panTo(overlay[j].getPosition());
                      overlay[j].setTop(true);  // overlay[j].
                      var title=overlay[j].getTitle();
                      var strcss="["+"title='"+title+"']";
                      document.querySelectorAll(strcss)[0].click();
                    }else{
                      overlay[j].setTop(false);
                    }


                  }
                  
                }
              }
            }
          }


          // for (var j = 0; j < overlay.length; j++) {
          //   if (overlay[j].getTitle) {
          //      if(overlay[j].getTitle()==data.id){
          //         this.map.panTo(overlay[j].getPosition());
                
          //         var title=overlay[j].getTitle();
              
          //         var strcss="["+"title='"+title+"']";
          //          document.querySelectorAll(strcss)[0].click();
          //         // document.querySelectorAll("[title='名称：67幢-车辆']")[0].click()
          //       }
          //   }
          // }


        }

        




    });
    eventBus
      .$off(eventCollection._bmap_treedoubleclick2map)
      .$on(eventCollection._bmap_treedoubleclick2map, (data) => {
        let overlay = this.map.getOverlays();
        for (var j = 0; j < overlay.length; j++) {
          if (overlay[j].Bc) {
            if (overlay[j].Bc.className) {
              if (overlay[j].getLabel) {
                if(overlay[j].getLabel().content.indexOf(data.name)>-1){
                  this.map.panTo(overlay[j].getPosition());
                  overlay[j].setTop(true);  // overlay[j].
                  var title=overlay[j].getTitle();
                  // document.querySelectorAll([title='title']).click();
                  var strcss="["+"title='"+title+"']";
                  document.querySelectorAll(strcss)[0].click();
                  // document.querySelectorAll("[title='名称：67幢-车辆']")[0].click()
                }else{
                  overlay[j].setTop(false);
                }
              }
            }
          }
        }

       
    });


     //组织视频树筛选-->地图的操作
    
    
    eventBus
      .$off(eventCollection._bmap_organnizationTreeSearch2map)
      .$on(eventCollection._bmap_organnizationTreeSearch2map, data => {
        
            this.showAtMakerContain(data);
    });

    //搜藏预案视频树列表-->地图的操作
    eventBus
      .$off(eventCollection._bmap_collectionTree2map)
      .$on(eventCollection._bmap_collectionTree2map, data => {
       
        //数组是初始化数据，对象是定位高亮等
        if (Array.isArray(data)) {
            //清空数据
           
            if(data.length==0){
              return;
            }
            this.clear();
          
            console.log(data);
            this.addAtMaker(data, "shipingjiankong", this.bmapImg.kakou);
        }else{
            // this.moveToMaker(data, curnode);
             this.map.panTo(new BMap.Point( data.payload.longitude,  data.payload.latitude));
        }
    });

   //实时监测。企业告警刷新
    eventBus
      .$off(eventCollection._getWarningRefresh)
      .$on(eventCollection._getWarningRefresh, data => {
           this.getWebCompany();
    });



    

   

    //时空分析列表(案件列表)-->地图的操作
    eventBus
      .$off(eventCollection._anjian2map)
      .$on(eventCollection._anjian2map, data => {
        // alert("案件分析");
        //绘制卡口，画圆

        // this.showGaojingRoute=true;
        this.setKakou(data.resource);
        var circlePoint = new BMap.Point(
          data.case.longitude,
          data.case.latitude
        );
        var circle = new BMap.Circle(
          circlePoint,
          parseFloat(data.radius) * 1000,
          {
            strokeColor: "red",
            strokeWeight: 2,
            strokeOpacity: 0.5,
            fillColor: "yellow",
            fillOpacity: 0.1
          }
        ); //创建圆
        console.log(this.map);
        this.map.addOverlay(circle);
        var points = [];
        data.resource.forEach((item, idx) => {
          //如果是同一个点则返回
          points.push(new this.BMap.Point(item.longitude, item.latitude));
        }, this);

        // this.map.setViewport(points);
        this.map.panTo(circlePoint);
    });


    
    

   


    



    



  },
  mounted() {
    // this.$nextTick(function() {
    //     // DOM 更新了
    //     if (this.p_isShowSelfNavigation != undefined) {
    //         //手动去除dom
    //         var svgs = document.querySelector(".BMap_zlHolder");
    //         if (svgs) {
    //           svgs.innerHTML = "";
    //         }
    //     }
    // })
     
  },

  methods: {

    joinVideo(){
    },
    rowClick(row, column, event){
      // alert(1);

       eventBus.$emit(eventCollection._mapMaker2Pop, {
                data: row,
                opt: {isShowButton: true,
                    ischeck: false,
                    lx: "qiyedianwei",
                    title: "详情",
                    type: "qiyedianwei",
                    x: 1}
              });
      


    },
    handler({ BMap, map }) {
      var that = this;
      this.BMap = BMap;
      this.map = map;
      if (this.p_isShowNavigation != undefined) {
        this.default_config.isShowNavigation = this.p_isShowNavigation;
      }
      if (this.p_isShowScale != undefined) {
        this.default_config.isShowScale = this.p_isShowScale;
      }

      if (this.p_isShowSelfNavigation != undefined) {
        this.default_config.isShowSelfNavigation = this.p_isShowSelfNavigation;
        // this.$nextTick(function() {
        // // DOM 更新了
        // if (this.p_isShowSelfNavigation != undefined) {
        //     //手动去除dom
        //     var svgs = document.querySelector(".BMap_zlHolder");
        //     if (svgs) {
        //       svgs.innerHTML = "";
        //     }
        //   }
        // })
        window.document.onreadystatechange = function(){
            if( window.document.readyState === "complete" ){
                //..... other
                //     //手动去除dom
                var svgs = document.querySelector(".BMap_zlHolder");
                if (svgs) {
                  svgs.innerHTML = "";
                }
            };
        };

      }
      // if(this.p_showXzq != undefined){

      //   this.inittextIconOverlay();
      //   this.initmaplib();
      //   // this.getCompany();

      // }

      console.log("map init");


      if (this.addtype != undefined) {
        //加载卡口并初始化
        if (this.addtype == "gs") {
          this.addXzq();
          // var data = [
          //   { id:1, 'longitude': 104.2299, 'latitude': 30.5623, 'status':1, 'city':'成都市', 'qu': '龙泉驿',  'name': '四川一汽丰田汽车有限公司','address':'四川省成都市龙泉驿区经济技术开发区经开区南三路222号','industry':'制造业','pollutions':'废水废气'
          //   },
          //   { id:3, 'longitude': 104.2398, 'latitude': 30.5514, 'status':1, 'city':'成都市', 'qu': '龙泉驿', 'name': '立邦涂料(成都)有限公司','address':'四川省成都经济技术开发区成龙大道600号','industry':'制造业','pollutions':'废水废气'
          //   },
          //   { id:2, 'longitude': 104.1862, 'latitude': 30.5439, 'status':2, 'city':'成都市', 'qu': '龙泉驿',  'name': '四川成都成工工程机械股份有限公司','address':'成都汽车城大道668号','industry':'制造业','pollutions':'废水废气'
          //   }, 
          // ];
          this.getWebCompany();
          // this.addQYDWMaker(data, "qiyedianwei");
        }  else if(this.addtype == "spjk") {
           this.getCameraList();
        }
      }
     

     
      if (this.mapStyle != undefined) {
        // var styleJson = [
        //   {
        //     "featureType": "all",
        //     "elementType": "geometry",
        //     "stylers": {
        //         "hue": "#007fff",
        //         "saturation": 89
        //     }
        //   },
        //   {
        //     "featureType": "water",
        //     "elementType": "all",
        //     "stylers": {
        //         "color": "#ffffff"
        //     }
        //   }
        // ];
        // map.setMapStyle({styleJson:styleJson});
        map.setMapStyle({ style: "midnight" }); //midnight
      }
      

      


      if (!this.yibiaosanshu) {
      } else {
        this.map.panTo(new BMap.Point(104.072314, 30.663207));
        this.inittextIconOverlay();
        this.initmaplib();
        this.map.centerAndZoom(new BMap.Point(104.693798, 31.497132), 11); //   center: { lng: 104.072314, lat: 30.663207 },

        

        this.getYbssData2();

        //方法二

        // this.inittextIconOverlay2();
        // this.initmaplib2();
        // this.initmyMap2();

        // /*实例名称只能取mymap -_-*/
        // var mymap = new window.BMapLib.myMap([]);
        // this.dianjumap_obj = mymap;
        // mymap.init();

        // var testaddr2 = [
        //   {
        //     id: 1,
        //     lat: "30.667087",
        //     lng: "104.0401",
        //     mapCity: "成都市",
        //     mapDistrict: "青羊区",
        //     mapProvince: "四川省",
        //     userName: "草堂小区"
        //   },
        //   {
        //     id: 2,
        //     lat: "30.66384",
        //     lng: "104.031261",
        //     mapCity: "成都市",
        //     mapDistrict: "青羊区",
        //     mapProvince: "四川省",
        //     userName: "金陵半岛"
        //   },
        //   {
        //     id: 3,
        //     lat: "30.676592",
        //     lng: "104.006378",
        //     mapCity: "成都市",
        //     mapDistrict: "青羊区",
        //     mapProvince: "四川省",
        //     userName: "21世纪"
        //   },
        //   {
        //     id: 4,
        //     lat: "30.69257",
        //     lng: "104.080937",
        //     mapCity: "成都市",
        //     mapDistrict: "金牛区",
        //     mapProvince: "四川省",
        //     userName: "万达小区"
        //   },
        //   {
        //     id: 5,
        //     lat: "30.696",
        //     lng: "104.0894",
        //     mapCity: "成都市",
        //     mapDistrict: "金牛区",
        //     mapProvince: "四川省",
        //     userName: "锦泰世家"
        //   },
        //   {
        //     id: 6,
        //     lat: "30.693297",
        //     lng: "104.095409",
        //     mapCity: "成都市",
        //     mapDistrict: "金牛区",
        //     mapProvince: "四川省",
        //     userName: "富力世家"
        //   },
        //   {
        //     id: 7,
        //     lat: "31.49555",
        //     lng: "104.716238",
        //     mapCity: "绵阳市",
        //     mapDistrict: "涪城区",
        //     mapProvince: "四川省",
        //     mapshequ: "科创园",
        //     userName: "奥林春天"
        //   },
        //   {
        //     id: 8,
        //     lat: "31.4864",
        //     lng: "104.700643",
        //     mapCity: "绵阳市",
        //     mapDistrict: "涪城区",
        //     mapProvince: "四川省",
        //     mapshequ: "科创园",
        //     userName: "太阳城"
        //   },
        //   {
        //     id: 9,
        //     lat: "31.4986",
        //     lng: "104.6987",
        //     mapCity: "绵阳市",
        //     mapDistrict: "涪城区",
        //     mapProvince: "四川省",
        //     mapshequ: "科创园",
        //     userName: "嘉运花园"
        //   }
        // ];

        // var my_gx =
        //   "104.661683,31.477466;104.661539,31.477282;104.661108,31.470691;104.646663,31.472292;104.645082,31.472108;104.64307,31.471861;104.638686,31.475619;104.634734,31.481839;104.625679,31.476173;104.620217,31.472847;104.616768,31.469767;104.614756,31.466933;104.613031,31.462868;104.610444,31.458802;104.606779,31.455044;104.604623,31.451717;104.603329,31.449345;104.60279,31.44725;104.602359,31.442506;104.601928,31.44075;104.598478,31.434218;104.59316,31.42633;104.593304,31.424358;104.594166,31.422756;104.600778,31.42103;104.61012,31.42029;104.618888,31.417948;104.625787,31.413018;104.633548,31.422263;104.63786,31.4267;104.644328,31.43126;104.654101,31.436313;104.664306,31.442721;104.671924,31.44802;104.673145,31.448883;104.674223,31.447712;104.675948,31.44648;104.678176,31.445494;104.690608,31.440626;104.696142,31.438901;104.705556,31.437607;104.707712,31.435882;104.709581,31.434403;104.71533,31.425406;104.717629,31.421708;104.724241,31.414928;104.727403,31.412586;104.729128,31.410614;104.730709,31.416901;104.731427,31.423064;104.733296,31.429719;104.734051,31.43277;104.734446,31.43542;104.734338,31.438809;104.734051,31.445094;104.734194,31.447866;104.734697,31.448852;104.732326,31.449345;104.729954,31.452549;104.727798,31.455675;104.726864,31.457339;104.725247,31.456415;104.724259,31.455768;104.723325,31.455506;104.721672,31.455737;104.720163,31.456214;104.71957,31.456476;104.718456,31.457292;104.716605,31.459125;104.715851,31.459618;104.716264,31.462021;104.716534,31.463468;104.716569,31.464931;104.716641,31.465794;104.7133,31.465855;104.709599,31.466225;104.706832,31.468473;104.704532,31.470568;104.700687,31.472693;104.698675,31.474387;104.697489,31.476204;104.695046,31.477466;104.693501,31.47799;104.690986,31.479622;104.689836,31.480022;104.686818,31.480022;104.68423,31.479961;104.679955,31.480361;104.674565,31.480885;104.668887,31.479468;104.664683,31.478359;104.661701,31.477497";

        // mymap.rerender(testaddr2);
      }


      if (!this.zhongdianrenyuan) {
      } else {
        this.map.panTo(new BMap.Point(104.072314, 30.663207));
        this.inittextIconOverlay();
        this.initmaplib();
        this.map.centerAndZoom(new BMap.Point(104.693798, 31.497132), 11); //   center: { lng: 104.072314, lat: 30.663207 },

        // this.getZdry();
       
        this.getZdryData2();

        
      }

     
    },
    loadData(){
       

    },
    clear() {
      if( this.BMap==null){
        return;
      }
      this.map.clearOverlays();
    },
     //地图包含某种type的maker
    haveMaker(type) {
      if(this.map==null){
        console.log('地图未初始化，无法判断havemaker');
        return false;
      }
      let overlay = this.map.getOverlays();
      if(overlay==undefined){
        return true;
      }
      for (var j = 0; j < overlay.length; j++) {
         if (overlay[j].Bc) {
           if (overlay[j].Bc.className) {
              if (overlay[j].getTitle() == type) {
                  return true;
              }
           }
        }
        
      }
      return false;
    },
    //隐藏类型为type的maker覆盖物
    hideAtMaker(type) {
      let overlay = this.map.getOverlays();
      for (var j = 0; j < overlay.length; j++) {
         if (overlay[j].Bc) {
           if (overlay[j].Bc.className) {
              if (overlay[j].getTitle() == type) {
                  overlay[j].hide();
                }
           }
        }
        
      }
    },
    //显示类型为type的maker覆盖物
    showAtMaker(type) {
      let overlay = this.map.getOverlays();
      for (var j = 0; j < overlay.length; j++) {
        if (overlay[j].Bc) {
           if (overlay[j].Bc.className) {
              if (overlay[j].getTitle() == type) {
                  overlay[j].show();
                }
           }
        }

       
      }
    },

    addAtMaker(data, type, img,lx,ishowfirsthl,hlimg) {
      // ,img  数据，标注(内部区分相当图层)，显示图标
      //let img = this.bmapImg.hlry;
      if( this.BMap==null){
        console.log("地图未初始化");
        //
        return;
      }
       var points = [];
      if (data && data.length > 0) {
       
        data.forEach((item, idx) => {
          //创建图标
          if (item.longitude == "" || item.latitude == "") {
            return;
          }
          let pt = new this.BMap.Point(item.longitude,item.latitude);
          // let pt = new this.BMap.Point(parseFloat(item.longitude)+0.0028, parseFloat(item.latitude)-0.0022);
          points.push(pt);
          let myIcon = new this.BMap.Icon(img, new this.BMap.Size(24, 24));
          myIcon.imageSize = new this.BMap.Size(24, 24);
           let marker2;
          if(type=="shipingjiankong"){
            marker2 = new this.BMap.Marker(pt, {
              icon: myIcon,
              title:"名称："+item.name+","+(item.indexcode||item.indexCode)//"kakou"
            });
          }else{
            marker2 = new this.BMap.Marker(pt, {
              icon: myIcon,
              title:type //"kakou"
            });
          }
          // let marker2 = new this.BMap.Marker(pt, {
          //   icon: myIcon,
          //   title:item.name|| type //"kakou"
          // });
          // 创建标注
          let label = new BMap.Label(
            item.deviceCode || item.indexCode ||item.indexcode|| item.gatCode ||  item.notificationID||"12",
            {
              offset: new BMap.Size(20, -10)
            }
          );
          label.setStyle({ display: "none" });
          marker2.setLabel(label);
          this.setInfowindow(marker2, item, {
            ischeck: false,
            title: "详情",
            type: type, //"kakou",
            lx:lx,
            isShowButton: true,
            x: 1
          });
          this.map.addOverlay(marker2);

          if(ishowfirsthl){
             if (idx == 0) {
              //默认第一个高亮或则跳动
              myIcon = new this.BMap.Icon(hlimg, new this.BMap.Size(24, 24));
              myIcon.imageSize = new this.BMap.Size(24, 24);
              marker2.setIcon(myIcon); //高亮
              marker2.setTop(true);
              console.log("跳转到了告警");
              this.map.panTo(new BMap.Point(item.longitude, item.latitude));
            }
          }

        }, this);

        //tiaozhuan

        // this.map.panTo(points[0]);
        // this.map.setViewport(points);
        // this.map.setZoom(8);
      }

      // if(type=="kakou"){
      //   this.map.panTo(points[0]);
      //   this.map.setViewport(points);
      //   this.map.setZoom(8);
      // }
    },

    //删除类型为type的maker覆盖物
    clearAtMaker(type) {
      let overlay = this.map.getOverlays();
      for (var j = 0; j < overlay.length; j++) {
        if (overlay[j].Bc) {
          if (overlay[j].Bc.className) {
            if (overlay[j].getTitle() == type) {
              this.map.removeOverlay(overlay[j]);
            }
          }
        }
      }
    },

    flashAtMaker: function(data, type, img, glimg) {
      //高亮选中数据：数据，类型，未选中图片,选中后图片
      if( this.BMap==null){
        console.log("地图未初始化");
        return;
      }
      var wgl = new this.BMap.Icon(img, new this.BMap.Size(24, 24));
      wgl.imageSize = new this.BMap.Size(24, 24);

      var gl = new this.BMap.Icon(glimg, new this.BMap.Size(24, 24));
      gl.imageSize = new this.BMap.Size(24, 24);

      let overlay = this.map.getOverlays();

      for (var j = 0; j < overlay.length; j++) {
        if (overlay[j].Bc) {
          if (overlay[j].Bc.className) {
            if (overlay[j].getTitle() == type) {
              // this.map.removeOverlay(overlay[j]);
              overlay[j].setIcon(wgl); //不高亮
              overlay[j].setTop(false);
            }else if(overlay[j].getTitle().indexOf('名称')>-1){
              //视频树单独处理
              overlay[j].setIcon(wgl); //不高亮
              overlay[j].setTop(false);
            }
          }
        }
      }
      if (data && data.length > 0) {
        let flashMarker = null;
        for (var j = 0; j < overlay.length; j++) {
          console.log(j);
          // if (overlay[j].Bc) {
          //   if (overlay[j].Bc.className) {
              
          //   }
          // }
          if (overlay[j].getLabel) {
            if (overlay[j].getLabel()) {
              if (data.indexOf(overlay[j].getLabel().content) >= 0) {
                if (overlay[j].getTitle() == type) {
                  //this.map.removeOverlay(overlay[j]);
                  overlay[j].setIcon(gl); //高亮
                  overlay[j].setTop(true);
                }else if(overlay[j].getTitle().indexOf('名称')>-1){
                  //视频树单独处理
                   overlay[j].setIcon(gl); //高亮
                  overlay[j].setTop(true);
                }
              }
            }
          }

        }
      }
    },

    moveToMaker: function(data, curnode) {
      //移动,
      var count = 0;
      let overlay = this.map.getOverlays();
      if (curnode.state == true) {
        for (var j = 0; j < overlay.length; j++) {
          if (overlay[j].getLabel) {
            if (overlay[j].getLabel()) {
              let label = overlay[j].getLabel().content;
              if (data.indexOf(label) >= 0) {
                if (label == curnode.id) {
                  console.log(
                    "跳转到了卡口:" +
                      overlay[j].getPosition().lng +
                      "," +
                      overlay[j].getPosition().lat
                  );
                  this.map.panTo(overlay[j].getPosition());
                  count += 1;
                  //全选时，只跳转到开始一个；或者调转到中心点
                  if (data.length > 0) {
                    break;
                  }
                }
              }
            }
          }
        }
        if (count == 0) {
        }
      }
    },

    zoomTo(num){
        this.map.zoomTo(num);
    },


    indowindow: function(data, opt) {
      let sContent =
        '<div style="margin-top: 10px;"><p  class="popover-title">' +
        opt.title +
        " </p>" +
        '<div class="popover-content">';
      if (opt.type.indexOf("kakou") > -1) {
        //卡口弹出框模板
        sContent += `<div  class="row">
              <div  class="col-md-12 spandiv">
                <span  class="spandec">设备名称：
                    <span  class="spantext">${data.cameraName ||
                      data.name} <span>&nbsp&nbsp<span></span>
                  </span>
              </div>
          </div>
          <div  class="row">
              <div  class="col-md-12 spandiv">
                <span  class="spandec">设备编码：
                    <span  class="spantext">${data.indexCode||data.id||data.indexcode} </span>
                  </span>
              </div>
              
          </div>
          <div  class="row">
              <div  class="col-md-12 spandiv">
                <span  class="spandec">设备状态：
                    <span  class="spantext">${
                      // data.isOnline == 1 ? "在线" : "离线"
                      data.isOnline
                    } </span>
                  </span>
              </div>
              
          </div>
          <div  class="row">
              <div  class="col-md-12 spandiv">
                <span  class="spandec">所属辖区：
                    <span  class="spantext">${data.activeTime ||
                      "城北辖区"} </span>
                  </span>
              </div>
          </div>

          <div  class="row">
              <div  class="col-md-5 spandiv">
                <span  class="spandec">经度：
                    <span  class="spantext">${data.longitude} </span>
                  </span>
              </div>
               <div  class="col-md-5 spandiv">
                <span  class="spandec">纬度：
                    <span  class="spantext">${data.latitude} </span>
                  </span>
              </div>
              
          </div>

          
          <div  class="row">
             
              <div  class="col-md-4 spandiv">
                   <span  class="spanbutton"  id="sssp" indexCode='${
                     data.indexCode
                   }'> <i class="fa fa-film fa-lg"></i> 实时视频</span>
              </div>
              <div  class="col-md-4 spandiv">
                <span  class="spanbutton"  id="lxhf"> <i class="fa fa-play-circle-o fa-lg"></i> 录像回放</span>
              </div>
              <div  class="col-md-4 spandiv">
                   <span  class="spanbutton"  id="wzqy"> <i class="fa fa-map-o fa-lg"></i> 位置迁移</span>
              </div>
          </div>
         
          <div  class="popover-content-left"></div>
          <div class="popover-content-right"></div>`;
     
      } else if (opt.type == "notification") {
        //告警弹出框模板(人员和车辆不同)
        if(this.$route.path.indexOf('bukongxiangqing')>=0){
          if (opt.lx == "ry") {
          sContent += `
          <div  class="popover-content-left">
              <div style='height: 130px;border:1px solid #8394a1; display: flex; justify-content: center; align-items: center;'> <img style='max-width: 105px;' src='${this
                .BASE_IMG_URL + data.imageUrl}'/>
              </div>
             
          </div>
          <div class="popover-content-right">
              <div  class="row">
                  <div  class="col-md-12 spandiv">
                    <span  class="spandec">身份证：
                        <span  class="spantext">${
                          data.tollgateID
                        } <span>&nbsp&nbsp<span></span>
                      </span>
                  </div>
              </div>
              <div  class="row">
                  <div  class="col-md-6 spandiv">
                    <span  class="spandec">姓名：
                        <span  class="spantext">${data.targetFeature.name} </span>
                      </span>
                  </div>
                  
              </div>
              <div  class="row">
                  <div  class="col-md-12 spandiv">
                    <span  class="spandec">布控原因：
                        <span  class="spantext">${data.reason} </span>
                      </span>
                  </div>
              </div>
              <div  class="row">
                  <div  class="col-md-12 spandiv">
                    <span  class="spandec">发现时间：
                        <span  class="spantext">${data.triggerTime} </span>
                      </span>
                  </div>
              </div>
              <div  class="row">
                  <div  class="col-md-12 spandiv">
                    <span  class="spandec">发现地点：
                        <span  class="spantext">${data.name} </span>
                      </span>
                  </div>
              </div>

             
                  
          </div>`;
        } else {
          sContent += `
          <div  class="popover-content-left">   
                       
                    <div style='height: 130px;border:1px solid #8394a1; display: flex; justify-content: center; align-items: center;'> <img style='max-width: 105px;' src='${this
                      .BASE_IMG_URL + data.imageUrl}'/>
                    </div>        
               
          </div>
          <div class="popover-content-right">
              <div  class="row">
                  <div  class="col-md-12 spandiv">
                    <span  class="spandec">车牌号：
                        <span  class="spantext">${
                          data.plateNo||data.targetFeature.vehiclePlate
                        } <span>&nbsp&nbsp<span></span>
                      </span>
                  </div>
              </div>
              <div  class="row">
                  <div  class="col-md-6 spandiv">
                    <span  class="spandec">车型：
                        <span  class="spantext">${
                          !data.targetFeature == true
                            ? data.vehicleBrand
                            : data.targetFeature.brand
                        } </span>
                      </span>
                  </div>
                  
              </div>
              <div  class="row">
                  <div  class="col-md-12 spandiv">
                    <span  class="spandec">布控原因：
                        <span  class="spantext">${data.reason} </span>
                      </span>
                  </div>
              </div>
              <div  class="row">
                  <div  class="col-md-12 spandiv">
                    <span  class="spandec">发现时间：
                        <span  class="spantext">${data.triggerTime} </span>
                      </span>
                  </div>
              </div>
              <div  class="row">
                  <div  class="col-md-12 spandiv">
                    <span  class="spandec">发现地点：
                        <span  class="spantext">${data.name} </span>
                      </span>
                  </div>
              </div>

              
              
        </div> `;
        }


        }else {
                 if (opt.lx == "ry") {
          sContent += `
          <div  class="popover-content-left">
              <div style='height: 130px;border:1px solid #8394a1; display: flex; justify-content: center; align-items: center;'> <img style='max-width: 105px;' src='${this
                .BASE_IMG_URL + data.imageUrl}'/>
              </div>
             
          </div>
          <div class="popover-content-right">
              <div  class="row">
                  <div  class="col-md-12 spandiv">
                    <span  class="spandec">身份证：
                        <span  class="spantext">${
                          data.tollgateID
                        } <span>&nbsp&nbsp<span></span>
                      </span>
                  </div>
              </div>
              <div  class="row">
                  <div  class="col-md-6 spandiv">
                    <span  class="spandec">姓名：
                        <span  class="spantext">${data.targetFeature.name} </span>
                      </span>
                  </div>
                  
              </div>
              <div  class="row">
                  <div  class="col-md-12 spandiv">
                    <span  class="spandec">布控原因：
                        <span  class="spantext">${data.reason} </span>
                      </span>
                  </div>
              </div>
              <div  class="row">
                  <div  class="col-md-12 spandiv">
                    <span  class="spandec">发现时间：
                        <span  class="spantext">${data.triggerTime} </span>
                      </span>
                  </div>
              </div>
              <div  class="row">
                  <div  class="col-md-12 spandiv">
                    <span  class="spandec">发现地点：
                        <span  class="spantext">${data.name} </span>
                      </span>
                  </div>
              </div>

              <div  class="row">
                  <div  class="col-md-6 spandiv">
                    <span  class="spanbutton" id="bkxq" dispositionid='${
                      data.dispositionID
                    }'>布控详情
                      </span>
                  </div>
                  <div  class="col-md-6 spandiv">
                    <span  class="spanbutton" id="cksp" dispositionid='${
                      data.dispositionID
                    }' tollgateid='${data.tollgateID}'>查看视频
                      </span>
                  </div>
                  
              </div>
                  
          </div>`;
        } else {
          sContent += `
          <div  class="popover-content-left">   
                       
                    <div style='height: 130px;border:1px solid #8394a1; display: flex; justify-content: center; align-items: center;'> <img style='max-width: 105px;' src='${this
                      .BASE_IMG_URL + data.imageUrl}'/>
                    </div>        
               
          </div>
          <div class="popover-content-right">
              <div  class="row">
                  <div  class="col-md-12 spandiv">
                    <span  class="spandec">车牌号：
                        <span  class="spantext">${
                          data.plateNo||data.targetFeature.vehiclePlate
                        } <span>&nbsp&nbsp<span></span>
                      </span>
                  </div>
              </div>
              <div  class="row">
                  <div  class="col-md-6 spandiv">
                    <span  class="spandec">车型：
                        <span  class="spantext">${
                          !data.targetFeature == true
                            ? data.vehicleBrand
                            : data.targetFeature.brand
                        } </span>
                      </span>
                  </div>
                  
              </div>
              <div  class="row">
                  <div  class="col-md-12 spandiv">
                    <span  class="spandec">布控原因：
                        <span  class="spantext">${data.reason} </span>
                      </span>
                  </div>
              </div>
              <div  class="row">
                  <div  class="col-md-12 spandiv">
                    <span  class="spandec">发现时间：
                        <span  class="spantext">${data.triggerTime} </span>
                      </span>
                  </div>
              </div>
              <div  class="row">
                  <div  class="col-md-12 spandiv">
                    <span  class="spandec">发现地点：
                        <span  class="spantext">${data.name} </span>
                      </span>
                  </div>
              </div>

              <div  class="row">
                  <div  class="col-md-6 spandiv">
                    <span  class="spanbutton"  id="bkxq" dispositionid='${
                      data.dispositionID
                    }'>布控详情
                      </span>
                  </div>
                  <div  class="col-md-6 spandiv">
                    <span  class="spanbutton"id="cksp" dispositionid='${
                      data.dispositionID
                    }' tollgateid='${data.tollgateID}'>查看视频
                      </span>
                  </div>
                  
              </div>
              
        </div> `;
        }
        }
       
      } else if (opt.type == "track") {
        //时空分析弹出框模板(人员和车辆不同)
        if (opt.lx == "ry") {
          sContent += `
          <div  class="popover-content-left">
              <div style='height: 130px;border:1px solid #8394a1; display: flex; justify-content: center; align-items: center;'> <img style='max-width: 105px;' src='${this
                .BASE_IMG_URL + data.imageUrl}'/>
              </div>
             
          </div>
          <div class="popover-content-right">
              <div  class="row">
                  <div  class="col-md-12 spandiv">
                    <span  class="spandec">身份证：
                        <span  class="spantext">${
                          data.tollgateID
                        } <span>&nbsp&nbsp<span></span>
                      </span>
                  </div>
              </div>
              <div  class="row">
                  <div  class="col-md-6 spandiv">
                    <span  class="spandec">姓名：
                        <span  class="spantext">${data.applicantName||data.targetFeature.name} </span>
                      </span>
                  </div>
                  
              </div>
              <div  class="row">
                  <div  class="col-md-12 spandiv">
                    <span  class="spandec">布控原因：
                        <span  class="spantext">${data.reason} </span>
                      </span>
                  </div>
              </div>
              <div  class="row">
                  <div  class="col-md-12 spandiv">
                    <span  class="spandec">发现时间：
                        <span  class="spantext">${data.triggerTime} </span>
                      </span>
                  </div>
              </div>
              <div  class="row">
                  <div  class="col-md-12 spandiv">
                    <span  class="spandec">发现地点：
                        <span  class="spantext">${data.name} </span>
                      </span>
                  </div>
              </div>

             
              
         </div>`;
        } else {
          sContent += `
          <div  class="popover-content-left">   
                       
                    <div style='height: 130px;border:1px solid #8394a1; display: flex; justify-content: center; align-items: center;'> <img style='max-width: 105px;' src='${this
                      .BASE_IMG_URL + data.imageUrl}'/>
                    </div>        
               
          </div>
          <div class="popover-content-right">
              <div  class="row">
                  <div  class="col-md-12 spandiv">
                    <span  class="spandec">车牌号：
                        <span  class="spantext">${
                          data.plateNo||data.targetFeature.vehiclePlate
                        } <span>&nbsp&nbsp<span></span>
                      </span>
                  </div>
              </div>
              <div  class="row">
                  <div  class="col-md-6 spandiv">
                    <span  class="spandec">车型：
                        <span  class="spantext">${
                          !data.targetFeature == true
                            ? data.vehicleBrand
                            : data.targetFeature.brand
                        } </span>
                      </span>
                  </div>
                  
              </div>
              <div  class="row">
                  <div  class="col-md-12 spandiv">
                    <span  class="spandec">布控原因：
                        <span  class="spantext">${data.reason} </span>
                      </span>
                  </div>
              </div>
              <div  class="row">
                  <div  class="col-md-12 spandiv">
                    <span  class="spandec">发现时间：
                        <span  class="spantext">${data.triggerTime} </span>
                      </span>
                  </div>
              </div>
              <div  class="row">
                  <div  class="col-md-12 spandiv">
                    <span  class="spandec">发现地点：
                        <span  class="spantext">${data.name} </span>
                      </span>
                  </div>
              </div>

         </div>`;
        }

        // for (const key in data) {
        //   if (data.hasOwnProperty(key)) {
        //     const element = data[key];
        //     sContent +=
        //       '<div  class="row"><div  class="col-md-12 spandiv"><span  class="spandec">' +
        //       key +
        //       '：<span  class="spantext">' +
        //       element +
        //       "</span></span></div></div>";
        //   }
        // }
      } else if (opt.type == "shipingjiankong") {
        //卡口弹出框模板
        sContent += `<div  class="row">
              <div  class="col-md-12 spandiv">
                <span  class="spandec">设备名称：
                    <span  class="spantext">${data.cameraName ||
                      data.name} <span>&nbsp&nbsp<span></span>
                  </span>
              </div>
          </div>
          <div  class="row">
              <div  class="col-md-12 spandiv">
                <span  class="spandec">设备编码：
                    <span  class="spantext">${ data.indexCode||data.indexcode||data.id} </span>
                  </span>
              </div>
              
          </div>
          <div  class="row">
              <div  class="col-md-12 spandiv">
                <span  class="spandec">设备状态：
                    <span  class="spantext">${
                      // data.isOnline == 1 ? "在线" : "离线"
                      data.isOnline
                    } </span>
                  </span>
              </div>
              
          </div>
         

          <div  class="row">
              <div  class="col-md-5 spandiv">
                <span  class="spandec">经度：
                    <span  class="spantext">${data.longitude} </span>
                  </span>
              </div>
               <div  class="col-md-5 spandiv">
                <span  class="spandec">纬度：
                    <span  class="spantext">${data.latitude} </span>
                  </span>
              </div>
              
          </div>

          
          <div  class="row">
             
              <div  class="col-md-4 spandiv">
                   <span  class="spanbutton"  id="sssp" indexCode='${
                     data.indexCode|| data.indexcode||data.id
                   }'  isOnline='${
                     data.isOnline
                   }'  preplanId='${
                     data.pid
                   }' cameraName ='${
                     data.name
                   }' preplanName='${
                     data.preplanName 
                   }'> <i class="fa fa-film fa-lg"></i> 实时视频</span>
              </div>
             
          </div>
         
          <div  class="popover-content-left"></div>
          <div class="popover-content-right"></div>`;
      }else if (opt.type == "yuan") {
        //卡口弹出框模板
        sContent += `<div  class="row">
              <div  class="col-md-12 spandiv">
                <span  class="spandec">设备名称：
                    <span  class="spantext">${data.cameraName ||
                      data.name} <span>&nbsp&nbsp<span></span>
                  </span>
              </div>
          </div>
          <div  class="row">
              <div  class="col-md-12 spandiv">
                <span  class="spandec">设备编码：
                    <span  class="spantext">${ data.indexCode||data.indexcode||data.id} </span>
                  </span>
              </div>
              
          </div>
          <div  class="row">
              <div  class="col-md-12 spandiv">
                <span  class="spandec">设备状态：
                    <span  class="spantext">${
                      // data.isOnline == 1 ? "在线" : "离线"
                      data.isOnline
                    } </span>
                  </span>
              </div>
              
          </div>
         

          <div  class="row">
              <div  class="col-md-5 spandiv">
                <span  class="spandec">经度：
                    <span  class="spantext">${data.longitude} </span>
                  </span>
              </div>
               <div  class="col-md-5 spandiv">
                <span  class="spandec">纬度：
                    <span  class="spantext">${data.latitude} </span>
                  </span>
              </div>
              
          </div>

          
          <div  class="row">
             
              <div  class="col-md-4 spandiv">
                   <span  class="spanbutton"  id="sssp" indexCode='${
                     data.indexCode|| data.indexcode||data.id
                   }'  isOnline='${
                     data.isOnline
                   }'> <i class="fa fa-film fa-lg"></i> 实时视频</span>
              </div>
             
          </div>
         
          <div  class="popover-content-left"></div>
          <div class="popover-content-right"></div>`;
      }

      if (opt.isShowButton) {
        // if (opt.ischeck == false) {
        //   sContent +=
        //     '<div id="callback_btn" class="btn btn-info" data-id="' +
        //     data.tollgateID +
        //     '">选中该卡口</di>';
        // } else if (ischeck == true) {
        //   sContent +=
        //     '<div id="callback_btn" class="btn btn-info" data-id="' +
        //     data.tollgateID +
        //     '">取消选中</di>';
        // }
      }

      return sContent;
    },


    setInfowindow: function(marker, data, opt) {
      // 百度地图API功能
      let ischeck = opt.ischeck;
      let curdata = data;
      if(opt.type=="notification"){
          var a=1;
      }

      var sContent = this.indowindow(data, opt);

      var infoWindow = new BMap.InfoWindow(sContent); // 创建信息窗口对象
     
      let that = this;
      marker.addEventListener("click", function(e) {
         console.log(3);
        //bianji
        //针对某些负责的infowindow,采用单独的组件进行绘制，且改种形式，地图移动infowindow,不会随之移动 
        if(this._this.addtype!=undefined){
            if (this._this.addtype == "gs") {
              e.currentTarget.getTitle();
              this._data;
              // this.emit
              // _mapMaker2Pop
              eventBus.$emit(eventCollection._mapMaker2Pop, {
                data: this._data,
                opt: this._opt
              });
              return;

            }
          
        }
        if (that.point.editing || that.polygon.editing) return;
        e.currentTarget.openInfoWindow(infoWindow);

        //设置关闭按钮图片

         var closeimg = document.querySelector(".BMap_pop > img:nth-of-type(1)");
         closeimg.src="/static/image/bmap/iw_close1d32.png";


        //定义弹出框事件
        if (document.getElementById("callback_btn")) {
          document
            .getElementById("callback_btn")
            .addEventListener("click", d => {
              if (ischeck) {
                that.cancelKakou(d);
              } else {
                that.selectKakou(d);
              }
            });
        }
        //告警信息相关
        //布控详情
        if (document.getElementById("bkxq")) {
          document.getElementById("bkxq").addEventListener("click", d => {
            var dispositionid = document
              .getElementById("bkxq")
              .getAttribute("dispositionid");
            that.bkxqClick(dispositionid);
          });
        }
        //查看视频
        if (document.getElementById("cksp")) {
          document.getElementById("cksp").addEventListener("click", d => {
            var dispositionid = document
              .getElementById("cksp")
              .getAttribute("dispositionid");
            var tollgateid = document
              .getElementById("cksp")
              .getAttribute("tollgateid");
            that.ckspClick(dispositionid, tollgateid);
          });
        }

        //布控信息相关
        //查看布控
        if (document.getElementById("ckbk")) {
          document.getElementById("ckbk").addEventListener("click", d => {
            that.dialogVisible = true;
          });
        }
        //实时视频
        if (document.getElementById("sssp")) {
          document.getElementById("sssp").addEventListener("click", d => {
            //that.dialogVisible = true;
            //alertExe
            var id = document.getElementById("sssp").getAttribute("indexCode");
            // console.log(id);
            // console.log(that.$parent);
            var isOnline = document.getElementById("sssp").getAttribute("isOnline");

            console.log(id);
            console.log(that.$parent);
            var p={id:id,isOnline:isOnline}
            if(that.activeName == "third"){
              that.playerVideo(p,that.setRecord);
            }else{
              that.playerVideo(p);
            }
            
            // that.$parent.$children[1].$children[1].$children[0].alertExe(id);
            // that.alertExe(id);
            // that.playerVideo(id);
            // if (true) {
            //   let _this = that;
            //   return shipinApi
            //     .agreementKeyWords()
            //     .then(res => res.data)
            //     .then(data => {
            //       _this.appData = data;
            //       _this.alertExe(id);
            //     })
            //     .catch(err => {
            //       this.$message({
            //         message: "实时视频播放失败！",
            //         type: "error",
            //         duration: 5 * 1000
            //       });
            //     });
            // }
          });
        }
        //录像回放
        if (document.getElementById("lxhf")) {
          document.getElementById("lxhf").addEventListener("click", d => {
            //  that.dialogVisible = true;
          });
        }
        //位置迁移

        if (document.getElementById("wzqy")) {
          document.getElementById("wzqy").addEventListener("click", d => {
            that.dialogVisible = true;
          });
        }

        //图片加载完毕重绘infowindow
        if (document.getElementById("imgDemo"))
          document.getElementById("imgDemo").onload = function() {
            infoWindow.redraw(); //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
          };
      }.bind({_this:this,_data:data,_opt:opt,}));


      // marker.addEventListener("mouseover", function(e) {
      //   console.log(1);

      //   this._this.infoWindow.lng=e.point.lng;
      //   this._this.infoWindow.lat=e.point.lat;
      //    this._this.infoWindow.show=true;
      //   //  eventBus.$emit(eventCollection._mapMaker2Pop, {
      //   //     data: this._data,
      //   //     opt: 1
      //   //   });

      
      // }.bind({_this:this,_data:data,_opt:opt,}));


      // marker.addEventListener("mouseout", function(e) {
      //   console.log(2);
      //     this._this.infoWindow.show=false;
      //     // eventBus.$emit(eventCollection._mapMaker2Pop, {
      //     //   data: this._data,
      //     //   opt: 2
      //     // });
      
      // }.bind({_this:this,_data:data,_opt:opt,}));







    },

    //根据区名查找区geometry
    findXZQGeometry(name){

      var p = new Promise(function(resolve, reject){
        var bdary1 = new BMap.Boundary();
        bdary1.get("四川省成都市"+name, function(rs){       //获取行政区域
          console.log(rs.boundaries);
          var count = rs.boundaries.length; //行政区域的点有多少个
          if (count === 0) {
            alert('未能获取当前输入行政区域');
            return ;
          }
          resolve(rs.boundaries);
        }); 
      });
      return p;   


         

    },


    setRecord() {
      let param = {};
      param.preplanId = parseInt(document.getElementById("sssp").getAttribute("preplanId"));
      param.indexCode = document.getElementById("sssp").getAttribute("indexCode");
      param.cameraName = document.getElementById("sssp").getAttribute("cameraName");
      param.preplanName =document.getElementById("sssp").getAttribute("preplanName");

      return shipinApi
          .addYuanRecord(param)
          .then(res => res)
          .then(data => {
            //更新数据
           
          });
    },


    alertExe(indexCodes) {
      //弹出exe
      let PlayBack = this.playType; //预览 PlayReal,回放 PlayBack
      let Clear = 3; // 1表示关闭所有窗口，清空列表 2表示关闭所有播放窗口,不清空列表 3表示往列表追加，不做任何清理
      let SvrIp = this.appData.host;
      let SvrPort = this.appData.port;
      let appkey = this.APPKEY;
      let appSecret = this.appData.appSecret;
      let time = this.appData.time; //时间为参数当前发送视频播放请求的时间，精确到秒
      let timeSecret = this.appData.timeSecret; //时间参数加密后
      let httpsflag = "1"; //https为1，http为0
      let WndCount = 1; //支持1,4,9三种模式
      let CamList = indexCodes; //监控点列表，用逗号隔开
      let start = ""; //回放开始时间
      let end = ""; //回放结束时间
      let startTime;
      let endTime;
      let playBackTime = "";
      if (PlayBack == "PlayBack") {
        //回放
        if (end == "" || !end) {
          endTime = new Date().getTime() / 1000;
          endTime = Math.round(endTime);
        } else {
          endTime = new Date(end).getTime() / 1000;
          endTime = Math.round(endTime);
        }
        if (start == "" || !start) {
          startTime = endTime - 86400;
        } else {
          startTime = new Date(start).getTime() / 1000;
          startTime = Math.round(startTime);
        }
        playBackTime = "_" + startTime + "_" + endTime;
      }
      //主要是添加了'hikvideoclient://' 和 'VersionTag:artemis'2段字符串
      var param =
        "hikvideoclient://ReqType:" +
        PlayBack +
        ";" +
        "WndCount:" +
        WndCount +
        ";" +
        "VersionTag:artemis" +
        ";" +
        "SvrIp:" +
        SvrIp +
        ";" +
        "SvrPort:" +
        SvrPort +
        ";" +
        "Appkey:" +
        appkey +
        ";" +
        "AppSecret:" +
        appSecret +
        ";" +
        "time:" +
        time +
        ";" +
        "timesecret:" +
        timeSecret +
        ";" +
        "httpsflag:" +
        httpsflag +
        ";" +
        "CamList:" +
        CamList +
        playBackTime +
        ";";

      // document.getElementById("url").src = param;
      window.location.href = param;
    },


    //仅用于视频监控 地图覆盖物筛选
    //title包含val 则显示
    showAtMakerContain(val) {
      let overlay = this.map.getOverlays();
      for (var j = 0; j < overlay.length; j++) {
        if (overlay[j].Bc) {
           if (overlay[j].Bc.className) {
              if (overlay[j].getTitle().indexOf(val)>-1) {
                  overlay[j].show();
              }else{
                 overlay[j].hide();
              }
           }
        }

       
      }
    },

    // infoWindowClose (e) {
    //   this.infoWindow.show = false
    // },
    // infoWindowOpen (e) {
    //   this.infoWindow.show = true
    // },
    // clear () {
    //   this.infoWindow.contents = ''
    // },

    //添加行政区

    addXzq(){
      var that=this;
      var a=[
      {xzq:"双流区",color:'green'},
      {xzq:"龙泉驿区",color:'blue'},
      {xzq:"锦江区",color:'red'},
      {xzq:"武侯区",color:'blue'},
      {xzq:"金牛区",color:'green'},
      {xzq:"青羊区",color:'purple'},
      {xzq:"新都区",color:'red'},
      {xzq:"青白江",color:'blue'},
      {xzq:"成华区",color:'Sienna'},
      {xzq:"彭州市",color:'Sienna'},
      {xzq:"温江区",color:'blue'},
      {xzq:"郫县",color:'Sienna'},
      ];
      for (var j = 0; j < a.length; j++) {
          var bdary1 = new BMap.Boundary();
          bdary1.get("四川省成都市"+a[j].xzq, function(rs){       //获取行政区域
            console.log(rs.boundaries);
            var count = rs.boundaries.length; //行政区域的点有多少个
            if (count === 0) {
              alert('未能获取当前输入行政区域');
              return ;
            }
            var pointArray = [];
            for (var i = 0; i < count; i++) {
              var ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight:3, strokeColor: this.color||"#0b699b",fillColor:this.color||"#3daafc54",fillOpacity:0.2||0.2||0.03}); //建立多边形覆盖物
              that.map.addOverlay(ply);  //添加覆盖物
              // pointArray = pointArray.concat(ply.getPath());
            } 

          //   //计算中心点
          //   //画圆
          //   var point= new BMap.Polygon(rs.boundaries[0]).getBounds().getCenter();
            
	        //  var circle = new BMap.Circle(point,2000,{strokeColor:this.color||"blue", strokeWeight:2, strokeOpacity:0.5}); //创建圆
          //   that.map.addOverlay(circle);

            
                  
          }.bind({color:a[j].color})); 

      }

    },

    getWebCompany(id) {
      let _this = this;
      let spbh = id;
      let para={};
      para.pageNum=1;
      para.pageSize=10000;
      // spbh = '53042100020000100001';
      return tmpApi
        .getwebListQy(para)
        .then(res => res)
        .then(data => {
          var dt=data.data.pageData;
          this.ajaxData.companyData=[];
             for (var i in dt) {
               if(dt[i].status==2){
                  this.ajaxData.companyData.push(dt[i]);
               }
             }
          // this.ajaxData.companyData=data.data.pageData;
             
          this.addQYDWMaker(data.data.pageData, "qiyedianwei");
          
        });
    },

    getCameraList() {
      let _this = this;
      // let spbh = id;
      // spbh = '53042100020000100001';
      return shipinApi
        .getCameraList()
        .then(res => res)
        .then(data => {
          _this.showCompanyCamera(data.data);
          _this.ajaxData.companyCameraData=data.data;
        });
    },
    showCompanyCamera(data){
      // this.addAtMaker
      this.addAtMaker(data, "shipingjiankong", this.bmapImg.kakou);
    },


   

    

    
   
   

    getCompany:function(){

          var that=this;
             //按小区
          var data = [
            { id:1, 'x': 104.2299, 'y': 30.5623, 'city':'成都市', 'qu': '龙泉驿', 'qucode':'510704000000','qucolor':'red',
             quGeometry:["104.39519351316,30.606083109757;104.42719394121,30.657086793653;104.37870560363,30.691373152029;104.33361379534,30.723262355567;104.314903,30.709178;104.30804,30.705452;104.304303,30.703217;104.29956,30.700919;104.296111,30.699056;104.292518,30.697751;104.279582,30.69241;104.263628,30.68769;104.264455,30.731283;104.251663,30.728178;104.247063,30.72942;104.236284,30.71576;104.230103,30.712035;104.23479308126,30.700151578766;104.24261310975,30.692658876035;104.23430121014,30.69218574095;104.23795020928,30.688476400076;104.23038698559,30.689133593039;104.223766635,30.684979829442;104.22035550149,30.687685637294;104.205935,30.689002;104.199288,30.68102;104.177154,30.67456;104.170758,30.682092;104.168494,30.680632;104.166194,30.679048;104.165691,30.675694;104.16641,30.671718;104.166877,30.668146;104.16508,30.662042;104.163643,30.657071;104.166877,30.656108;104.165548,30.653421;104.165044,30.652038;104.163715,30.649693;104.167542,30.648916;104.16844,30.648745;104.16932,30.648605;104.171027,30.648403;104.1703340119,30.638135872528;104.16923780498,30.636086890568;104.16765041913,30.629987423807;104.16253677758,30.626504607707;104.15289613286,30.627604141167;104.15124242129,30.622101313737;104.14785826135,30.617777933684;104.15397748241,30.616136600334;104.15609737906,30.615219755768;104.15965267821,30.613626697433;104.16037930535,30.613305822925;104.16187993703,30.612509375239;104.16298333542,30.61183774823;104.1640202664,30.611091963604;104.16742563321,30.608535461067;104.17099733447,30.606486686123;104.17749605775,30.602429720993;104.18316093588,30.598579941249;104.18433925814,30.597790405466;104.1863987481,30.596455557224;104.17936548605,30.588662654822;104.17337574676,30.582153193417;104.14457660624,30.575790587368;104.17793657238,30.527909873178;104.22372645994,30.488209233713;104.25935252058,30.475564125094;104.30196065846,30.474301153368;104.35368323946,30.540060519436"],
             'shequ': '龙泉驿','shequcount': '12',
            // shequGeometry:"104.7809,31.4734;104.7804,31.4728;104.7863,31.4691;104.7897,31.4670;104.7938,31.4644;104.7915,31.4672;104.7870,31.4707",
            
            'name': '一汽大众',xiaoqucount:1530 
            },
            
            { id:3, 'x': 103.9626, 'y': 30.5752, 'city':'成都市', 'qu': '双流区', 'qucode':'510704000000','qucolor':'green',
              // quGeometry:["103.96829,30.631181;103.960996,30.637395;103.960385,30.649637;103.956253,30.652682;103.952078,30.663922;103.949401,30.663658;103.944909,30.666438;103.938734,30.664893;103.936119,30.664334;103.935293,30.664846;103.934413,30.665506;103.93207,30.6716;103.928035,30.671136;103.926526,30.671199;103.924684,30.672806;103.921163,30.669933;103.912359,30.670756;103.912072,30.671703;103.912988,30.672635;103.916006,30.674017;103.91518,30.675042;103.909828,30.670979;103.909684,30.66663;103.906055,30.66604;103.905157,30.67073;103.903109,30.675855;103.900989,30.676011;103.896749,30.676756;103.893551,30.671693;103.890245,30.669829;103.885071,30.665108;103.879897,30.663368;103.867392,30.655416;103.861068,30.654173;103.859343,30.651936;103.857619,30.652185;103.853594,30.650693;103.838646,30.646717;103.823699,30.642242;103.804475,30.635515;103.83110788284,30.552102329923;103.826196,30.538192;103.829502,30.524381;103.833957,30.512807;103.865003,30.510069;103.883112,30.507456;103.891539,30.499646;103.897001,30.492427;103.898968,30.489302;103.901447,30.487497;103.903711,30.485755;103.90637,30.483794;103.907268,30.481989;103.911169,30.483745;103.919937,30.484119;103.934309,30.480633;103.944945,30.477769;103.956012,30.473786;103.948251,30.457599;103.914906,30.426348;103.918499,30.423607;103.941065,30.406416;103.948682,30.401183;103.956731,30.397196;103.963774,30.393457;103.971679,30.390841;103.973691,30.399189;103.9798,30.407988;103.982099,30.410231;103.985836,30.419201;103.994172,30.426924;104.005096,30.440126;104.015732,30.447101;104.020205,30.454417;104.029045,30.468083;104.031991,30.473125;104.035692,30.481902;104.038701,30.491437;104.038975,30.492285;104.039344,30.49407;104.039824,30.496712;104.040269,30.499174;104.040624,30.50113;104.04114,30.503962;104.041756,30.507427;104.042169,30.508967;104.043305,30.511779;104.045821,30.518103;104.046881,30.521362;104.047824,30.524535;104.050779,30.532261;104.052711,30.53795;104.052778,30.538645;104.052773,30.541663;104.052755,30.541799;104.052738,30.544058;104.045017,30.544073;104.039178,30.543964;104.036474,30.543832;104.03377,30.542611;104.027913,30.539921;104.026323,30.539217;104.025164,30.541422;104.024841,30.543754;104.022613,30.544687;104.018337,30.54335;104.016576,30.545372;104.01866,30.547735;104.024553,30.550317;104.031776,30.561761;104.034363,30.56997;104.039285,30.570064;104.042382,30.578308;104.034836,30.580438;104.029087,30.583951;104.018397,30.590682;104.011714,30.584931;104.004617,30.591895;103.994395,30.59278;103.976662,30.580547;103.971757,30.589019;103.960708,30.595485;103.963708,30.597133;103.973374,30.590325;103.973859,30.611695;103.965236,30.616155;103.963295,30.624235"],
              quGeometry:["103.956626, 30.664217;103.95462, 30.651478;103.958751, 30.65083;103.959515, 30.638888;103.968257, 30.630184;103.962185, 30.625372;103.963209, 30.614255;103.97329, 30.61178;103.972793, 30.580268;103.983077, 30.578158;103.982607, 30.582026;103.995524, 30.590641;104.002155, 30.590489;104.011691, 30.582946;104.014611, 30.592631;104.024209, 30.590109;104.029514, 30.581576;104.034471, 30.584679;104.04018, 30.582988;104.043846, 30.573238;104.03943, 30.568597;104.033354, 30.569541;104.030495, 30.553825;104.039451, 30.545825;104.044135, 30.547286;104.043897, 30.533097;104.049893, 30.534975;104.049448, 30.548092;104.05554, 30.547696;104.066916, 30.54055;104.069022, 30.535606;104.087057, 30.543425;104.080924, 30.554693;104.090644, 30.558848;104.086077, 30.567571;104.08852, 30.57504;104.107839, 30.577178;104.117644, 30.573076;104.119609, 30.566452;104.112682, 30.557994;104.117565, 30.552706;104.132904, 30.555394;104.134563, 30.55831;104.12921, 30.561065;104.131991, 30.567503;104.148456, 30.572782;104.15398, 30.566395;104.157833, 30.569556;104.160594, 30.567331;104.160732, 30.554923;104.179121, 30.546914;104.182855, 30.539446;104.189812, 30.536965;104.207724, 30.497857;104.220908, 30.482908;104.233686, 30.473404;104.254172, 30.469471;104.25392, 30.463367;104.275794, 30.462935;104.254428, 30.4332;104.256305, 30.426421;104.241233, 30.424289;104.235338, 30.417711;104.23439, 30.402918;104.224386, 30.396682;104.224739, 30.380886;104.203006, 30.357319;104.204882, 30.345396;104.184766, 30.324155;104.182024, 30.307929;104.175096, 30.29978;104.172804, 30.289571;104.158473, 30.271369;104.156417, 30.250805;104.132101, 30.233425;104.121173, 30.23319;104.116943, 30.241071;104.101568, 30.246778;104.096984, 30.254947;104.087926, 30.254286;104.084051, 30.261986;104.075506, 30.260845;104.069099, 30.271714;104.059198, 30.268972;104.055712, 30.276526;104.038506, 30.270532;104.033543, 30.277992;104.013764, 30.269568;104.003422, 30.27087;103.981073, 30.296219;103.98151, 30.312292;103.969432, 30.325507;103.960357, 30.328299;103.949491, 30.338445;103.94125, 30.353979;103.94799, 30.364969;103.937496, 30.367746;103.927896, 30.365969;103.925156, 30.369244;103.925745, 30.378448;103.935141, 30.383425;103.940618, 30.419028;103.929488, 30.443463;103.915395, 30.455737;103.922464, 30.472722;103.913557, 30.492545;103.900348, 30.50149;103.89033, 30.49937;103.886594, 30.507181;103.876989, 30.513077;103.845093, 30.512368;103.835547, 30.509107;103.829371, 30.52021;103.829692, 30.528938;103.824481, 30.533671;103.821883, 30.549686;103.828, 30.564722;103.827875, 30.583897;103.810447, 30.602252;103.804421, 30.612605;103.805634, 30.620679;103.800348, 30.62713;103.807069, 30.628717;103.820841, 30.618832;103.834128, 30.621445;103.843508, 30.61829;103.850499, 30.623727;103.852762, 30.621472;103.855233, 30.62515;103.851231, 30.63964;103.86213, 30.633005;103.865804, 30.633715;103.865631, 30.649374;103.874105, 30.653541;103.872486, 30.655391;103.881818, 30.669762;103.88513, 30.66546;103.884865, 30.653311;103.889488, 30.656455;103.898181, 30.653028;103.89956, 30.668947;103.904537, 30.673114;103.909961, 30.670106;103.921035, 30.670179;103.924481, 30.673112;103.933056, 30.670546;103.936402, 30.66599;103.956626, 30.664217","103.964482, 30.316644;103.953117, 30.311141;103.95787, 30.320776;103.964482, 30.316644"],
              
              'shequ': '双流区','shequcount': '34', 
              // shequGeometry:"104.757784,31.491585;104.758359,31.491832;104.765617,31.492263;104.76957,31.492263;104.775678,31.492263;104.779271,31.492017;104.783799,31.504517;104.786098,31.510551;104.789656,31.514757;104.797669,31.510108;104.804891,31.517989;104.793752,31.525315;104.786242,31.531902;104.784948,31.528055;104.784733,31.517878;104.782685,31.517416;104.78114,31.515231;104.78017,31.515692;104.779954,31.516924;104.778014,31.516185;104.777079,31.514861;104.774456,31.5164;104.771258,31.517201;104.764359,31.51797;104.762563,31.517755;104.761772,31.520956;104.760551,31.521541;104.756275,31.521449;104.755807,31.521172;104.756203,31.516493;104.752789,31.517478;104.750777,31.515107;104.74916,31.513784;104.752142,31.508858;104.753256,31.507072;104.754586,31.503871;104.755556,31.499653;104.756095,31.496851;104.756742,31.494049;104.757281,31.492571;104.757784,31.491647", 
             
             'name': '双流机场',xiaoqucount:2333  
            },
            { id:2, 'x': 104.0073, 'y': 30.6166, 'city':'成都市', 'qu': '武侯区', 'qucode':'510703000000','qucolor':'blue', 
              quGeometry:["104.07047,30.652781;104.069163,30.652762;104.068341,30.652742;104.067434,30.652855;104.066612,30.652999;104.064802,30.653228;104.064438,30.653414;104.063355,30.654335;104.063104,30.654478;104.062974,30.654591;104.062412,30.655135;104.061559,30.656505;104.06106,30.657119;104.060589,30.6576;104.060072,30.657931;104.05987,30.657985;104.059448,30.65807;104.059178,30.658082;104.058666,30.658008;104.056726,30.657422;104.055913,30.657278;104.054197,30.657282;104.05382,30.657426;104.053577,30.657581;104.053281,30.658073;104.052477,30.658065;104.049194,30.657969;104.047837,30.657977;104.047384,30.657997;104.046526,30.657927;104.046023,30.657841;104.045106,30.657554;104.044338,30.657309;104.043575,30.657146;104.040161,30.657142;104.037763,30.657103;104.035751,30.657107;104.033222,30.657049;104.032503,30.657185;104.031151,30.657515;104.029597,30.657701;104.02807,30.657818;104.028052,30.65828;104.027616,30.659103;104.02741,30.659332;104.027091,30.660008;104.026727,30.661049;104.02661,30.66233;104.02652,30.662625;104.026184,30.662885;104.025685,30.663208;104.025411,30.663285;104.025178,30.663301;104.022519,30.663103;104.022078,30.662901;104.021822,30.662699;104.021557,30.662353;104.021279,30.661499;104.02105,30.661088;104.020704,30.660715;104.020286,30.660369;104.019837,30.660113;104.017043,30.65908;104.015121,30.65863;104.014923,30.658595;104.014721,30.658552;104.014411,30.658466;104.01408838896,30.658536054889;104.013639,30.658812;104.013077,30.659181;104.012772,30.659414;104.012449,30.659659;104.012233,30.659993;104.012017,30.66028;104.011815,30.660789;104.011748,30.661053;104.011743,30.66146;104.01191,30.661903;104.011941,30.662113;104.012516,30.66266;104.012731,30.663293;104.012709,30.66365;104.012619,30.663973;104.011995,30.665223;104.011622,30.665549;104.011321,30.66558;104.010962,30.665569;104.010585,30.665456;104.009915,30.665211;104.009596,30.665176;104.009331,30.665207;104.008837,30.665437;104.008051,30.666124;104.007764,30.66626;104.00647,30.666757;104.00625,30.666796;104.005976,30.666768;104.004889,30.666427;104.004629,30.666252;104.004463,30.66598;104.004247,30.665219;104.004099,30.664543;104.00378,30.663736;104.003645,30.663382;104.003659,30.662932;104.003753,30.662656;104.004099,30.662008;104.004148,30.661635;104.004126,30.661495;104.004049,30.661398;104.003308,30.660928;104.002185,30.660163;104.001669,30.659857;104.001467,30.659794;104.001161,30.659802;104.000649,30.660039;104.000218,30.660377;104.000128,30.660567;103.999841,30.660917;103.999904,30.661996;104.000151,30.662462;104.000784,30.663068;104.001094,30.663204;104.001229,30.663398;104.001238,30.663802;104.001197,30.664011;104.001031,30.66419;104.000636,30.664365;103.999652,30.664225;103.999145,30.664318;103.998745,30.664602;103.998426,30.665281;103.998291,30.665778;103.998255,30.666174;103.99821,30.666302;103.998013,30.666473;103.997528,30.66652;103.997348,30.666473;103.997164,30.666248;103.997007,30.665992;103.996908,30.66567;103.996881,30.665367;103.99702,30.664427;103.996966,30.664124;103.996854,30.663903;103.996602,30.663662;103.996239,30.66358;103.995888,30.663623;103.995556,30.663821;103.995309,30.66426;103.995259,30.664924;103.995102,30.665611;103.994999,30.665934;103.9949,30.666085;103.994653,30.666198;103.99358,30.666225;103.993382,30.666267;103.993,30.666489;103.992726,30.666803;103.992722,30.667153;103.992241,30.66718;103.992115,30.66678;103.991877,30.666062;103.991752,30.665654;103.991671,30.665277;103.991572,30.664908;103.991509,30.66459;103.991437,30.664178;103.991379,30.663763;103.988594,30.663782;103.986577,30.663771;103.986541,30.66452;103.986505,30.665572;103.986474,30.666493;103.986443,30.666943;103.986429,30.66718;103.986434,30.667467;103.986209,30.667479;103.98594,30.667498;103.985612,30.667533;103.985162,30.667572;103.984924,30.667603;103.98448,30.667642;103.984264,30.667654;103.984076,30.667681;103.983797,30.667689;103.98382,30.667215;103.983896,30.666516;103.983105,30.666469;103.982207,30.666939;103.981915,30.666535;103.981533,30.666217;103.98046,30.665262;103.979629,30.664477;103.978973,30.663848;103.977958,30.66292;103.9775,30.662524;103.976566,30.661701;103.975151,30.660128;103.97392,30.660598;103.972892,30.660618;103.973022,30.662186;103.97344,30.66372;103.973911,30.664586;103.974167,30.665339;103.974531,30.665549;103.97498,30.665689;103.975762,30.665704;103.976085,30.666101;103.975928,30.666353;103.976076,30.666594;103.976566,30.666978;103.976296,30.667277;103.976179,30.667681;103.972898,30.667739;103.972896,30.666943;103.971688,30.666935;103.97168306891,30.667509341204;103.969882,30.665522;103.956965,30.662742;103.956391,30.65292;103.960559,30.649689;103.961134,30.63751;103.968464,30.631171;103.963434,30.624334;103.965302,30.616254;103.974069,30.611778;103.973495,30.590144;103.963721,30.596983;103.960846,30.595491;103.971914,30.589025;103.976657,30.580693;103.994335,30.592879;104.004684,30.592009;104.011726,30.585045;104.018338,30.590765;104.023565,30.587801;104.037255,30.598946;104.038836,30.606484;104.038392,30.607217;104.031421,30.607217;104.031335,30.60925;104.030886,30.616476;104.031407,30.61716;104.033289,30.61965;104.033114,30.620578;104.033123,30.6208;104.033177,30.621013;104.033455,30.621689;104.033595,30.622132;104.033666,30.62261;104.033909,30.624358;104.03386,30.624712;104.034003,30.624976;104.03421,30.625197;104.033451,30.625574;104.034839,30.627532;104.036532,30.626844;104.036824,30.626631;104.038392,30.625889;104.039613,30.627866;104.040916,30.629769;104.038827,30.630787;104.038917,30.630876;104.039959,30.632725;104.041688,30.631742;104.042259,30.632686;104.042272,30.632834;104.042209,30.632931;104.042007,30.63302;104.04145,30.633541;104.042111,30.633914;104.0445,30.635316;104.044868,30.635794;104.045798,30.63706;104.046301,30.63781;104.047155,30.639188;104.048089,30.640649;104.049328,30.642602;104.050011,30.643608;104.050842,30.644804;104.05135,30.644501;104.052032,30.644164;104.053771,30.643278;104.053937,30.643045;104.055042,30.642556;104.056793,30.64167;104.058693,30.640777;104.061074,30.639658;104.061375,30.639631;104.062682,30.639553;104.06407,30.63955;104.065076,30.639577;104.065031,30.639406;104.065067,30.636637;104.06508,30.635658;104.064869,30.633638;104.064707,30.632379;104.064559,30.630969;104.064389,30.629225;104.064186,30.627621;104.064002,30.626324;104.063921,30.625659;104.06398,30.622229;104.064092,30.620062;104.064164,30.617867;104.064209,30.61784;104.064168,30.616787;104.064254,30.616635;104.064195,30.615046;104.064119,30.613065;104.069495,30.61291;104.073861,30.612828;104.077517,30.612704;104.082355,30.612525;104.084034,30.612486;104.087237,30.61237;104.08871,30.612296;104.089914,30.612261;104.094194,30.611845;104.094221,30.61223;104.094329,30.612844;104.094307,30.613232;104.094343,30.613333;104.094284,30.614273;104.094199,30.614452;104.093768,30.615128;104.093377,30.61568;104.093318,30.615699;104.093143,30.615998;104.09291,30.616515;104.092847,30.616857;104.092842,30.61735;104.092829,30.618527;104.092784,30.618768;104.092559,30.619192;104.09229,30.619522;104.091468,30.620415;104.091243,30.62052;104.09096,30.620986;104.090835,30.621363;104.090767,30.621658;104.090763,30.622039;104.090808,30.622365;104.090916,30.622688;104.090996,30.622843;104.091118,30.622936;104.091589,30.623527;104.091953,30.623935;104.092106,30.624211;104.092155,30.62435;104.092124,30.624886;104.092016,30.625139;104.091877,30.625388;104.091603,30.625698;104.091329,30.626331;104.090848,30.627598;104.090812,30.628806;104.09092,30.629765;104.091059,30.630072;104.091746,30.630888;104.092667,30.631812;104.093188,30.632247;104.093449,30.632364;104.093907,30.63255;104.094558,30.632686;104.095173,30.632694;104.097002,30.632655;104.09847,30.632694;104.099445,30.632966;104.099719,30.633117;104.100015,30.633518;104.100159,30.633883;104.100195,30.634151;104.100262,30.634465;104.100527,30.63499;104.100631,30.635619;104.100581,30.63617;104.10002,30.637157;104.099795,30.637421;104.099647,30.637693;104.099261,30.638858;104.09905,30.639285;104.098892,30.639903;104.098457,30.641258;104.098147,30.641926;104.097181,30.643608;104.096404,30.644338;104.095286,30.645612;104.09485,30.646156;104.094455,30.646474;104.09353,30.646882;104.092303,30.647247;104.0907,30.647772;104.090035,30.648078;104.090035,30.648187;104.089927,30.648241;104.089784,30.648222;104.088005,30.649174;104.087179,30.649713;104.086887,30.649865;104.086024,30.65044;104.084731,30.65108;104.084344,30.651205;104.08385,30.651313;104.082817,30.651395;104.081578,30.651407;104.081313,30.651368;104.080976,30.651391;104.079134,30.651647;104.078685,30.651593;104.076969,30.651709;104.075096,30.651954;104.074189,30.65223;104.073502,30.652447;104.072684,30.652467;104.071602,30.652669"],
              'shequ': '武侯区', 'shequcount': '6',
              //  shequGeometry:"104.768671,31.465224;104.768671,31.465224;104.768312,31.465162;104.766875,31.4643;104.756885,31.464731;104.755879,31.464978;104.749699,31.467072;104.745459,31.466271;104.745675,31.465286;104.748837,31.465655;104.75128,31.465224;104.75243,31.465224;104.753436,31.464238;104.754873,31.462698;104.755233,31.459248;104.756598,31.453581;104.760982,31.451178;104.764,31.451424;104.767378,31.454135;104.77018,31.456723;104.773414,31.45931;104.774923,31.460419;104.772049,31.462575;104.770683,31.463191",
              
              'name': '太平园家具',xiaoqucount:3350 
            },

            // { id:4, 'x': 104.759397, 'y': 31.463848, 'city':'成都市', 'qu': '高新区', 'qucode':'510703000000','qucolor':'blue', 
            //   quGeometry:["104.195968,30.560897;104.202579,30.570599;104.195105,30.555175;104.195105,30.571843;104.180445,30.59;104.119504,30.516356;104.112893,30.536763;104.251232,30.514364;104.022775,30.544835;104.025146,30.54384;104.025434,30.541476;104.026637,30.539497;104.033716,30.542778;104.036375,30.544023;104.038315,30.544147;104.052544,30.544302;104.058976,30.544111;104.059084,30.540223;104.063688,30.539896;104.067043,30.540391;104.070609,30.540434;104.070681,30.536612;104.071988,30.53732;104.075797,30.53912;104.076255,30.539637;104.076668,30.529084;104.077284,30.502464;104.084344,30.502379;104.092447,30.502192;104.105383,30.501811;104.112749,30.50847;104.118965,30.506727;104.121157,30.502495;104.127517,30.50262;104.130823,30.507661;104.125972,30.508936;104.128954,30.514257;104.127014,30.521257;104.13235,30.526903;104.128056,30.533124;104.129062,30.539563;104.127481,30.544866;104.12493,30.546515;104.12917,30.548132;104.133913,30.548132;104.133967,30.550511;104.129709,30.5509;104.126978,30.517102;104.154605,30.539818;104.147706,30.544546;104.140232,30.548527;104.13937,30.55201;104.141669,30.55201;104.141094,30.550269;104.143682,30.549771;104.140807,30.549024;104.143969,30.543302;104.142532,30.546785;104.136495,30.550269;104.164666,30.546785;104.17444,30.550766;104.198011,30.555493;104.162941,30.548776;104.158054,30.560469;104.164953,30.554996;104.156617,30.553254;104.155755,30.557235;104.170415,30.555244;104.164953,30.56022;104.175589,30.561215;104.184501,30.566439;104.182488,30.558976;104.167541,30.563703;104.187663,30.559723;104.190537,30.559971;104.189962,30.564201;104.179901,30.57241;104.183351,30.571415;104.185075,30.571912;104.196574,30.578379;104.191687,30.59181;104.192549,30.583105;104.1868,30.585095;104.1868,30.585344;104.197149,30.578379;104.199448,30.586338;104.182488,30.580369;104.186513,30.591561;104.183638,30.581862;104.187088,30.585095;104.204335,30.582608;104.197149,30.590069;104.189675,30.592805;104.196286,30.596784;104.125828,30.522329;104.197149,30.591561;104.182776,30.585592;104.155149,30.538753;104.110305,30.539002;104.212712,30.509884;104.22881,30.516356;104.230535,30.533279;104.22996,30.571096;104.185116,30.616856;104.0623,30.628976;104.058639,30.640545;104.050712,30.644397;104.049598,30.642703;104.048502,30.641057;104.04719,30.639099;104.046113,30.637312;104.044949,30.635759;104.04459,30.635258;104.042933,30.634357;104.041513,30.633537;104.04203,30.633059;104.042268,30.632958;104.042326,30.632838;104.042313,30.632659;104.041697,30.631688;104.039995,30.632655;104.03898,30.630865;104.041127,30.629835;104.039775,30.627846;104.038486,30.625784;104.036784,30.626607;104.036474,30.626794;104.034875,30.627435;104.033653,30.625706;104.034803,30.625123;104.033384,30.619615;104.031003,30.616445;104.031452,30.609281;104.031529,30.607295;104.038463,30.607341;104.038962,30.606484;104.037345,30.598876;104.03045,30.593329;104.023583,30.587483;104.03495076073,30.580488496366;104.04271523054,30.578395468008;104.039519,30.569589;104.034488,30.569776;104.031973,30.561442;104.085872,30.54373"],
            //   'shequ': '警钟街社区', 'shequcount': '6',
            //    shequGeometry:"104.768671,31.465224;104.768671,31.465224;104.768312,31.465162;104.766875,31.4643;104.756885,31.464731;104.755879,31.464978;104.749699,31.467072;104.745459,31.466271;104.745675,31.465286;104.748837,31.465655;104.75128,31.465224;104.75243,31.465224;104.753436,31.464238;104.754873,31.462698;104.755233,31.459248;104.756598,31.453581;104.760982,31.451178;104.764,31.451424;104.767378,31.454135;104.77018,31.456723;104.773414,31.45931;104.774923,31.460419;104.772049,31.462575;104.770683,31.463191",
            //   'name': '警钟街社区',xiaoqucount:3350 
            // },

            
          ];



          var markers1 = [];
          var pt = null;
          var curqu=[];
          var onlyqu=[];
          var curshequ=[];
          var onlyshequ=[];
          for (var i in data) {
             
             
              if(onlyqu.toString().indexOf(data[i].qu)<0){
                onlyqu.push(data[i].qu);
                curqu.push({name:data[i].qu,color:data[i].qucolor,quGeometry:data[i].quGeometry,});
              }
              if(onlyshequ.toString().indexOf(data[i].shequ)<0){
                onlyshequ.push(data[i].shequ);
                curshequ.push({name:data[i].shequ,shequGeometry:data[i].shequGeometry,color:data[i].qucolor});
              }
             
          }
          
          var quGeometry=[];
          for (var j in curqu) {
              //查询区县行政区
                var bdary = new BMap.Boundary();
                bdary.get(
                  curqu[j].name || "北京市海淀区",
                  function(rs) {
                    //获取行政区域
                    // map.clearOverlays();        //清除地图覆盖物
                    var count = rs.boundaries.length; //行政区域的点有多少个
                    if (count === 0) {
                      alert("未能获取当前输入行政区域");
                      return;
                    }
                    var pointArray = [];
                    for (var j = 0; j < count; j++) {
                      var ply = new BMap.Polygon(rs.boundaries[j], {
                        strokeWeight: 2,
                        fillColor: this.color||"#2d89f0"||data_qx[this].color || "#2d89f0",
                        strokeColor: this.color||"#2d89f0"||data_qx[this].color, //"#4783E7" || this.initRandomColor() || "#4783E7",
                        fillOpacity: 0.2
                      }); //建立多边形覆盖物
                      that.map.addOverlay(ply); //添加覆盖物
                      quGeometry.push(ply);
                      pointArray = pointArray.concat(ply.getPath());
                    }
                  }.bind({color: curqu[j].color})
                );

              //   //写死的直接用
              //  var ply = new BMap.Polygon(curqu[j].quGeometry, {
              //       strokeWeight: 2,
              //       fillColor: curqu[j].color||"#2d89f0",
              //       strokeColor: curqu[j].color||"#2d89f0", //"#4783E7" || this.initRandomColor() || "#4783E7",
              //       fillOpacity: 0.2
              //     }); //建立多边形覆盖物
              //     that.map.addOverlay(ply); //添加覆盖物
              //     quGeometry.push(ply);
                

              //查询区县行政区
                markers1=[];
                for (var i in data) {
                  if( curqu[j].name==data[i].qu){
                      pt = new BMap.Point(data[i].x, data[i].y);
                      // var m = new BMap.Marker(pt);
                      var Icon = new this.BMap.Icon(
                        this.bmapImg.start,
                        new this.BMap.Size(36, 36)
                      );
                      var m = new this.BMap.Marker(pt,{
                        icon: Icon,
                        title: "gongsi"
                      });  
                      // m.setTitle(data[i].shequ + ";" + data[i].name);
                      m.setTitle( data[i].name);
                      m.city =data[i].city;
                      m.qu =data[i].qu;
                      m.quGeometry = data[i].quGeometry;
                      m.qucode =data[i].qucode;
                      m.shequ = data[i].shequ;
                      m.shequcount = data[i].shequcount;
                      m.shequGeometry = data[i].shequGeometry;
                      m.name = data[i].name;
                      m.xiaoqucount = data[i].xiaoqucount;
                      m.id = data[i].id;


                      // m.addEventListener("click", function(e) {
                      //   console.log(3);
                      //   //bianji
                      //   //针对某些负责的infowindow,采用单独的组件进行绘制，且改种形式，地图移动infowindow,不会随之移动 
                      //   if(true){
                      //     e.currentTarget.getTitle();
                      //     this._data
                      //     // this.emit
                      //     // _mapMaker2Pop
                      //     eventBus.$emit(eventCollection._mapMaker2Pop, {
                      //       data: this._data,
                      //       opt: this._opt
                      //     });
                      //     return;
                      //   }
                        

                      //   //图片加载完毕重绘infowindow
                      //   if (document.getElementById("imgDemo"))
                      //     document.getElementById("imgDemo").onload = function() {
                      //       infoWindow.redraw(); //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
                      //     };
                      // }.bind({_this:this,_data:m,_opt:3,}));


                      // m.addEventListener("mouseover", function(e) {
                      //   console.log(1);

                      //   this._this.infoWindow.lng=e.point.lng;
                      //   this._this.infoWindow.lat=e.point.lat;
                      //   this._this.infoWindow.show=true;
                      //   //  eventBus.$emit(eventCollection._mapMaker2Pop, {
                      //   //     data: this._data,
                      //   //     opt: 1
                      //   //   });

                      
                      // });


                      // m.addEventListener("mouseout", function(e) {
                      //   console.log(2);
                      //     this._this.infoWindow.show=false;
                      //     // eventBus.$emit(eventCollection._mapMaker2Pop, {
                      //     //   data: this._data,
                      //     //   opt: 2
                      //     // });
                      
                      // });


                     
                      markers1.push(m);
                  }
                  if(i==data.length-1){
                      var markerClusterer1 = new BMapLib.MarkerClusterer(that.map,
                      {
                        markers: markers1,
                        girdSize: 100,
                        styles: [{
                          // url: that.bmapImg.cluster,
                          url: that.bmapImg.cluster_color +  curqu[j].color + ".png",
                          size: new BMap.Size(92, 92),
                          backgroundColor: '#4783E7'
                        }],
                        qu:curqu,
                        shequ:curshequ,
                         //特殊边界
                          //加载最大一级 的 边界图
                        ts:[{ts_geometry:"104.7864,31.4694;104.7889,31.4679;104.7893,31.4684;104.7869,31.4699",color:"red"}],
                        length:data.length,
                        curindex:j,
                      });
                    
                      // markerClusterer1.setMaxZoom(16);
                      markerClusterer1.setMaxZoom(13);
                      markerClusterer1.setGridSize(100);

                  }

                }


          }



            
          // var markerClusterer1 = new BMapLib.MarkerClusterer(that.map,
          // {
          //   markers: markers1,
          //   girdSize: 100,
          //   styles: [{
          //     // url: that.bmapImg.cluster,
          //     url: that.bmapImg.cluster_color + color + ".png",
          //     size: new BMap.Size(92, 92),
          //     backgroundColor: '#4783E7'
          //   }],
          //   qu:curqu,
          //   shequ:curshequ,
          // });
         
          // markerClusterer1.setMaxZoom(16);
          // markerClusterer1.setGridSize(100);

    },

    getYbssData2:function(){

        return excontrolApi
        .getYbss()
        .then(res => res)
        .then(datas => {
          console.log(datas);

          var that=this;
             //按小区
         var data=datas.data;



          var markers1 = [];
          var pt = null;
          var curqu=[];
          var onlyqu=[];
          var curshequ=[];
          var onlyshequ=[];
          for (var i in data) {
             
             
              if(onlyqu.toString().indexOf(data[i].qu)<0){
                onlyqu.push(data[i].qu);
                curqu.push({name:data[i].qu,color:data[i].qucolor,quGeometry:JSON.parse(data[i].quGeometry),});
              }
              if(onlyshequ.toString().indexOf(data[i].shequ)<0){
                onlyshequ.push(data[i].shequ);
                curshequ.push({name:data[i].shequ,shequGeometry:data[i].shequGeometry,color:data[i].qucolor});
              }
             
          }
          
          var quGeometry=[];
          for (var j in curqu) {
              //查询区县行政区
                var bdary = new BMap.Boundary();
                bdary.get(
                  curqu[j].name || "北京市海淀区",
                  function(rs) {
                    //获取行政区域
                    // map.clearOverlays();        //清除地图覆盖物
                    var count = rs.boundaries.length; //行政区域的点有多少个
                    if (count === 0) {
                      alert("未能获取当前输入行政区域");
                      return;
                    }
                    var pointArray = [];
                    for (var j = 0; j < count; j++) {
                      var ply = new BMap.Polygon(rs.boundaries[j], {
                        strokeWeight: 2,
                        fillColor: this.color||"#2d89f0"||data_qx[this].color || "#2d89f0",
                        strokeColor: this.color||"#2d89f0"||data_qx[this].color, //"#4783E7" || this.initRandomColor() || "#4783E7",
                        fillOpacity: 0.2
                      }); //建立多边形覆盖物
                      that.map.addOverlay(ply); //添加覆盖物
                      quGeometry.push(ply);
                      pointArray = pointArray.concat(ply.getPath());
                    }
                  }.bind({color: curqu[j].color})
                );

              //查询区县行政区
                markers1=[];
                for (var i in data) {
                  if( curqu[j].name==data[i].qu){
                      pt = new BMap.Point(data[i].x, data[i].y);
                      var m = new BMap.Marker(pt);
                      // m.setTitle(data[i].shequ + ";" + data[i].name);
                      m.setTitle( data[i].name);
                      m.city =data[i].city;
                      m.qu =data[i].qu;
                      m.quGeometry = data[i].quGeometry;
                      m.qucode =data[i].qucode;
                      m.shequ = data[i].shequ;
                      m.shequcode = data[i].shequcode;
                      m.shequcount = data[i].shequcount;
                      m.shequGeometry = data[i].shequGeometry;
                      m.name = data[i].name;
                      m.xiaoqucount = data[i].xiaoqucount;
                      m.id = data[i].id;
                     
                      markers1.push(m);
                  }
                  if(i==data.length-1){
                      var markerClusterer1 = new BMapLib.MarkerClusterer(that.map,
                      {
                        markers: markers1,
                        girdSize: 100,
                        styles: [{
                          // url: that.bmapImg.cluster,
                          url: that.bmapImg.cluster_color +  curqu[j].color + ".png",
                          size: new BMap.Size(92, 92),
                          backgroundColor: '#4783E7'
                        }],
                        qu:curqu,
                        shequ:curshequ,
                         //特殊边界
                          //加载最大一级 的 边界图
                        ts:[{ts_geometry:"104.7864,31.4694;104.7889,31.4679;104.7893,31.4684;104.7869,31.4699",color:"red"}],
                        length:data.length,
                        curindex:j,
                      });
                    
                      // markerClusterer1.setMaxZoom(16);
                      markerClusterer1.setMaxZoom(17);
                      markerClusterer1.setGridSize(100);

                  }

                }


          }
            


        });
      

          



            
         
    },



     //重点人员  人员查询
    getZdry: function() {
      // let param = {};
      // param.pageNum = 1;
      // param.pageSize = 20;
      var that=this;
      return excontrolApi
        .getZdry()
        .then(res => res)
        .then(data => {
          console.log(data);
          //初始重点人员
          var shuju=data.data;
          that.runAsync(data.data).then(function(data){
               console.log("地址解析");
               var pt = null;
                 var m ;
                 var color="2d89f0";
                for (var j in shuju){
                      var address=shuju[j].community;
                        var markers1 = [];
                        color=shuju[j].color;
                        


                      for (var k in data){
                         if(data[k].qxmc==shuju[j].name){
                            pt = new BMap.Point(data[k].coor.lng, data[k].coor.lat);
                            m = new BMap.Marker(pt);
                            m.setTitle(data[k].xqm);
                            m.name=data[k].addr;
                            m.count=data[k].count;
                            markers1.push(m);

                         }
                          
                      }


                      var markerClusterer1 = new BMapLib.MarkerClusterer(that.map, {
                      name:shuju[j].name,
                      data_qx: shuju,
                      qucode:shuju[j].code,
                      color:color,
                      markers: markers1,
                      vuecomp: that,
                      girdSize: 100,
                      styles: [
                        {
                          // url: "./img/blue.png",
                          //  url: that.bmapImg.cluster,
                          url: that.bmapImg.cluster_color + color + ".png",
                          size: new BMap.Size(92, 92),
                          backgroundColor: "#4783E7"
                        }
                      ]
                    });

                    markerClusterer1.setMaxZoom(12);
                    markerClusterer1.setGridSize(100);

                      //默认加载行政区划

                    var bdary = new BMap.Boundary();
                    bdary.get(
                      shuju[j].name || "北京市海淀区",
                      function(rs) {
                        //获取行政区域
                        // map.clearOverlays();        //清除地图覆盖物
                        var count = rs.boundaries.length; //行政区域的点有多少个
                        if (count === 0) {
                          alert("未能获取当前输入行政区域");
                          return;
                        }
                        var pointArray = [];
                        for (var j = 0; j < count; j++) {
                          var ply = new BMap.Polygon(rs.boundaries[j], {
                            strokeWeight: 2,
                            fillColor: this.color||"#2d89f0"||data_qx[this].color || "#2d89f0",
                            strokeColor: this.color||"#2d89f0"||data_qx[this].color, //"#4783E7" || this.initRandomColor() || "#4783E7",
                            fillOpacity: 0.2
                          }); //建立多边形覆盖物
                          that.map.addOverlay(ply); //添加覆盖物
                          pointArray = pointArray.concat(ply.getPath());
                        }
                      }.bind({color:color})
                    );


                }
              
            
          });

         

         



        });
    },

    getZdryData2:function(){

        return excontrolApi
        .getZdryData()
        .then(res => res)
        .then(datas => {
          console.log(datas);

          var that=this;
             //按小区
         var data=datas.data;



          var markers1 = [];
          var pt = null;
          var curqu=[];
          var onlyqu=[];
          var curshequ=[];
          var onlyshequ=[];
          for (var i in data) {
             
             
              if(onlyqu.toString().indexOf(data[i].qu)<0){
                onlyqu.push(data[i].qu);
                curqu.push({name:data[i].qu,color:data[i].qucolor,quGeometry:JSON.parse(data[i].quGeometry),});
              }
              if(onlyshequ.toString().indexOf(data[i].shequ)<0){
                onlyshequ.push(data[i].shequ);
                curshequ.push({name:data[i].shequ,shequGeometry:data[i].shequGeometry,color:data[i].qucolor});
              }
             
          }
          
          var quGeometry=[];
          for (var j in curqu) {
              //查询区县行政区
                var bdary = new BMap.Boundary();
                bdary.get(
                  curqu[j].name || "北京市海淀区",
                  function(rs) {
                    //获取行政区域
                    // map.clearOverlays();        //清除地图覆盖物
                    var count = rs.boundaries.length; //行政区域的点有多少个
                    if (count === 0) {
                      alert("未能获取当前输入行政区域");
                      return;
                    }
                    var pointArray = [];
                    for (var j = 0; j < count; j++) {
                      var ply = new BMap.Polygon(rs.boundaries[j], {
                        strokeWeight: 2,
                        fillColor: this.color||"#2d89f0"||data_qx[this].color || "#2d89f0",
                        strokeColor: this.color||"#2d89f0"||data_qx[this].color, //"#4783E7" || this.initRandomColor() || "#4783E7",
                        fillOpacity: 0.2
                      }); //建立多边形覆盖物
                      that.map.addOverlay(ply); //添加覆盖物
                      quGeometry.push(ply);
                      pointArray = pointArray.concat(ply.getPath());
                    }
                  }.bind({color: curqu[j].color})
                );

              //查询区县行政区
                markers1=[];
                for (var i in data) {
                  if( curqu[j].name==data[i].qu){
                      pt = new BMap.Point(data[i].x, data[i].y);
                      var m = new BMap.Marker(pt);
                      // m.setTitle(data[i].shequ + ";" + data[i].name);
                      m.setTitle( data[i].name);
                      m.city =data[i].city;
                      m.qu =data[i].qu;
                      m.quGeometry = data[i].quGeometry;
                      m.qucode =data[i].qucode;
                      m.shequ = data[i].shequ;
                      m.shequcode = data[i].shequcode;
                      m.shequcount = data[i].shequcount;
                      m.shequGeometry = data[i].shequGeometry;
                      m.name = data[i].name;
                      m.xiaoqucount = data[i].xiaoqucount;
                      m.id = data[i].id;
                     
                      markers1.push(m);
                  }
                  if(i==data.length-1){
                      var markerClusterer1 = new BMapLib.MarkerClusterer(that.map,
                      {
                        markers: markers1,
                        girdSize: 100,
                        styles: [{
                          // url: that.bmapImg.cluster,
                          url: that.bmapImg.cluster_color +  curqu[j].color + ".png",
                          size: new BMap.Size(92, 92),
                          backgroundColor: '#4783E7'
                        }],
                        qu:curqu,
                        shequ:curshequ,
                         //特殊边界
                          //加载最大一级 的 边界图
                        ts:[{ts_geometry:"104.7864,31.4694;104.7889,31.4679;104.7893,31.4684;104.7869,31.4699",color:"red"}],
                        length:data.length,
                        curindex:j,
                      });
                    
                      // markerClusterer1.setMaxZoom(16);
                      markerClusterer1.setMaxZoom(17);
                      markerClusterer1.setGridSize(100);

                  }

                }


          }
            


        });
      

          



            
         
    },



    runAsync(quname){
       var arr=[];
       var j;
       var i;
       var count=0;
         var quxianmingc;
          var ad;

           for ( j in quname){
              
                var address=quname[j].community;
                quxianmingc=quname[j].name;
                for ( i in address){
                    count+=1;
                }
           }
          
        var p = new Promise(function(resolve, reject){
            //做一些异步操作
            for ( j in quname){
              
                var address=quname[j].community;
                quxianmingc=quname[j].name;
                for ( i in address){
                    ad=address[i].addr;//communityName addr
                    var myGeo = new BMap.Geocoder(); 
                   // count+=1;
                    myGeo.getPoint(ad||"北京市海淀区上地10街", function(point){
                      if (point) {
                          // console.log(point);
                          quname[j].community[i].coor=point;
                          arr.push({coor:point,addr:this.ad,qxmc:this.qu,xqm:this.xqm,count:this.count});
                        
                        // map.centerAndZoom(point, 16);
                        // map.addOverlay(new BMap.Marker(point));


                      }else{
                    
                        alert("您选择地址没有解析到结果!");
                      }
                      // if(j==quname.length&&i==address.length){
                      //      resolve(quname);
                      // }
                      if(arr.length==count){
                           resolve(arr);
                      }
                    }.bind({ad:ad,qu:quxianmingc,xqm:address[i].communityName,count:address[i].count}), "绵阳市");
                }
            }

            
            

           
            
           
        }.bind(this));
        return p;            
    },

    

     /**
   * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
   * 即谷歌、高德 转 百度
   * @param lng
   * @param lat
   * @returns {*[]}
   */
    gcj02tobd09(lng, lat){
      var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
      var lat = +lat;
      var lng = +lng;
      var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
      var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
      var bd_lng = z * Math.cos(theta) + 0.0065;
      var bd_lat = z * Math.sin(theta) + 0.006;
      return [bd_lng, bd_lat]
    },



    

    addQYDWMaker(data, type) {
    //  this.bmapImg.qydw_blue,"qiyedianwei"
      if( this.BMap==null){
        console.log("地图未初始化");
        return;
      }
      console.log(data)
      //删除以前的公司
      this.clear();
      if(this.haveMaker(type)){
             this.clearAtMaker(type);
             this.map.clearOverlays()
      }

      var points = [];
      if (data && data.length > 0) {
      
        data.forEach((item, idx) => {
          //创建图标
          if (item.longitude == "" || item.latitude == "") {
            return;
          }
          let pt = new this.BMap.Point(item.longitude,item.latitude);
          // let pt = new this.BMap.Point(parseFloat(item.longitude)+0.0028, parseFloat(item.latitude)-0.0022);
          points.push(pt);
          let myIcon = new this.BMap.Icon(item.status==2? this.bmapImg.qydw_red: this.bmapImg.qydw_blue, new this.BMap.Size(28, 35));
          myIcon.imageSize = new this.BMap.Size(28, 35);

          let marker2;
          marker2 = new this.BMap.Marker(pt, {
              icon: myIcon,
              title:"名称："+item.name+","+item.id+","+item.status//"kakou"
            });
          // 创建标注
          let label = new BMap.Label(
            item.name||item.id ||item.deviceCode || item.indexCode ||item.indexcode|| item.gatCode ||  item.notificationID||"12",
            {
              offset: new BMap.Size(-40, -28)
            }
          );
          // label.setStyle({ color : "black", fontSize : "14px" ,border: '1px solid #ebeef5', 'background-color':'white'});
          label.setStyle({ display: "none" });
          marker2.setLabel(label);
          this.setInfowindow(marker2, item, {
            ischeck: false,
            title: "详情",
            type: "qiyedianwei", //"kakou",
            lx:'qiyedianwei',
            isShowButton: true,
            x: 1
          });
          this.map.addOverlay(marker2);

         

        }, this);

        
      }

      
    },

    

    updateZjxx(){
      this.dialogVisible = false;
      var lng= this.$refs.wzqy_lng.$el.innerText;
      var lat= this.$refs.wzqy_lat.$el.innerText;
      var address= this.$refs.wzqy_address.$el.innerText;
      let param = {};
      param.longitude = lng;
      param.latitude = lat;
      // this.updateZjxx(param);

    },

    updateZjxx: function(param) {
    
      return excontrolApi
        .updateZjxx(param)
        .then(res => res)
        .then(data => {
          console.log(data);
          alert("修改成功");
        });
    },

    toggle(name) {
      this[name].editing = !this[name].editing;
      this.default_config.isdragging = false;
      if (this[name].editing == false) {
        this.map.setDefaultCursor("pointer");
        this.map.setDefaultCursor("url('bird.cur')");
        this.default_config.isdragging = true;
        return;
      }

      this.map.setDefaultCursor("crosshair");

      if (name == "drawPoline") {
      } else if (name == "drawCircle") {
      } else if (name == "drawRec") {
      } else if (name == "drawPolygon") {
      }

      if (name == "polygon") {
        this.point.editing = false;
        //清空数据
        this.polygon.paths = [];
      } else if (name == "point") {
        this.polygon.editing = false;
        //禁用tanchu popup
      } else {
        //tingzhi
        this.point.editing = false;

        this.polygon.paths = [];
        this.polygon.editing = false;

        this.map.setDefaultCursor("pointer");
        this.map.setDefaultCursor("url('bird.cur')");
        this.default_config.isdragging = true;
      }
    },
    syncPolygon(e) {
      this.default_config.currentPoint = e.point;
      if (!this.polygon.editing) {
        return;
      }
      const { paths } = this.polygon;
      if (!paths.length) {
        return;
      }
      const path = paths[paths.length - 1];
      if (!path.length) {
        return;
      }
      //  this.map.setDefaultCursor("crosshair");
      // if (path.length === 1) {
      //   path.push(e.point);
      // }//设置最后一点为当前移动点
      // this.$set(path, path.length - 1, e.point);

      //有一个点则移动时，实时画矩形
      //设置其余3个点根据当前点推算

      if (path.length === 1) {
        var point2 = new BMap.Point(path[0].lng, e.point.lat);
        var point3 = e.point;
        var point4 = new BMap.Point(e.point.lng, path[0].lat);

        path.push(point2);
        path.push(point3);
        path.push(point4);
        this.$set(path, path.length - 3, point2);
        this.$set(path, path.length - 2, point3);
        this.$set(path, path.length - 1, point4);
      } else if (path.length === 4) {
        var point2 = new BMap.Point(path[0].lng, e.point.lat);
        var point3 = e.point;
        var point4 = new BMap.Point(e.point.lng, path[0].lat);

        this.$set(path, path.length - 3, point2);
        this.$set(path, path.length - 2, point3);
        this.$set(path, path.length - 1, point4);
      }
    },
    newPolygon(e) {
      // this.map.setDefaultCursor("crosshair");
      this.point.editing = false;
      this.polygon.editing = false;
      //清空数据
      this.polygon.paths = [];

      this.map.setDefaultCursor("pointer");
      this.map.setDefaultCursor("url('bird.cur')");
      this.default_config.isdragging = true;

      // const { paths } = this.polygon;
      // console.log(paths);
      // if (!paths.length) {
      //   paths.push([]);
      // }
      // const path = paths[paths.length - 1];
      // path.pop();
      // if (path.length) {
      //   paths.push([]);
      // }
    },
    paintPolygon(e) {
      if (this.point.editing) {
        //huadian
        let flashdata = [];
        this.ajaxData.kakou.forEach((item, idx) => {
          if (item.longitude == "" || item.longitude == "") {
          } else {
            if (
              Math.pow(item.longitude - e.point.lng, 2) +
                Math.pow(item.latitude - e.point.lat, 2) <
              0.000005
            ) {
              item.state = !item.state;
              eventBus.$emit(eventCollection._bmap_map2tree, {
                id: item.deviceCode || item.indexCode,
                ischeck: item.state
              });
              // if (item.state) {
              //   this.flashKakou(item.d.deviceCode);
              // }
            } else {
            }

            if (item.state) {
              flashdata.push(item.deviceCode || item.indexCode);
            }
          }
        }, this);

        this.flashAtMaker(
          flashdata,
          "kakou",
           this.bmapImg.spjk,
                this.bmapImg.hlspjk
        );
      } else {
        //画矩形
        if (!this.polygon.editing) {
          return;
        }
        const { paths } = this.polygon;
        !paths.length && paths.push([]);

        if (paths[paths.length - 1].length == 4) {
          const path = paths[paths.length - 1];
          if (!path.length) {
            return;
          }
          var point2 = new BMap.Point(path[0].lng, e.point.lat);
          var point3 = e.point;
          var point4 = new BMap.Point(e.point.lng, path[0].lat);

          this.$set(path, path.length - 3, point2);
          this.$set(path, path.length - 2, point3);
          this.$set(path, path.length - 1, point4);

          this.searchAndHighlight(path[0], point3); //rectangle

          this.polygon.paths = [];
        } else {
          paths[paths.length - 1].push(e.point);
        }
      }
    },
    searchAndHighlight(pt1, pt2) {
      // extent
      //传入框选范围和当前卡口数据坐标比较，从而实现框选

      let flashdata = [];
      this.ajaxData.kakou.forEach((item, idx) => {
        if ((item.longitude - pt1.lng) * (item.longitude - pt2.lng) < 0) {
          if ((item.latitude - pt1.lat) * (item.latitude - pt2.lat) < 0) {
            flashdata.push(item.deviceCode || item.indexCode);
            // alert(item.deviceCode);
            eventBus.$emit(eventCollection._bmap_map2tree, {
              id: item.deviceCode || item.indexCode,
              ischeck: true
            });
          } else {
            eventBus.$emit(eventCollection._bmap_map2tree, {
              id: item.deviceCode || item.indexCode,
              ischeck: false
            });
          }
        } else {
          eventBus.$emit(eventCollection._bmap_map2tree, {
            id: item.deviceCode || item.indexCode,
            ischeck: false
          });
        }
      }, this);
      this.flashAtMaker(
        flashdata,
        "kakou",
        this.bmapImg.spjk,
        this.bmapImg.hlspjk
      );

      // if (flashdata.length > 0) {
      //   this.flashKakou(flashdata.toString());
      // }
    },

 

    
    

   

    flashNotification: function(data, type) {
    

      var cl = new this.BMap.Icon(this.bmapImg.cl, new this.BMap.Size(24, 24));
      cl.imageSize = new this.BMap.Size(24, 24);

      var hlcl = new this.BMap.Icon(
        this.bmapImg.hlcl,
        new this.BMap.Size(24, 24)
      );
      hlcl.imageSize = new this.BMap.Size(24, 24);

      var ry = new this.BMap.Icon(this.bmapImg.ry, new this.BMap.Size(24, 24));
      ry.imageSize = new this.BMap.Size(24, 24);

      var hlry = new this.BMap.Icon(
        this.bmapImg.hlry,
        new this.BMap.Size(24, 24)
      );
      hlry.imageSize = new this.BMap.Size(24, 24);

      var icon;
      var hlicon;
      if (
        data.dispositionCategory == "3" ||
        data.dispositionCategory == "车辆"
      ) {
        icon = cl;
        hlicon = hlcl;
      } else {
        icon = ry;
        hlicon = hlry;
      }

      let overlay = this.map.getOverlays();

      if (type == 1) {
        //普通告警高亮
        for (var j = 0; j < overlay.length; j++) {
          // overlay[j].enableDragging();
          if (overlay[j].setAnimation)
            if (overlay[j].getLabel) {
              if (overlay[j].getLabel()) {
                   if (overlay[j].getTitle() == "notification") {
                         overlay[j].setIcon(icon); //不高亮
                         overlay[j].setTop(false);
                   }
              
              }
            }
        }
        let flashMarker = null;
        for (var i = 0; i < overlay.length; i++) {
          if (overlay[i].getLabel) {
            if (overlay[i].getLabel()) {
              // console.log(data.notificationID);
              // console.log(overlay[i].getLabel().content);
              if (
                data.notificationID.indexOf(overlay[i].getLabel().content) >= 0
              ) {
                if (overlay[i].getTitle() == "notification") {
                  // alert(1);
                  let flashMarker = overlay[i];
                  // flashMarker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                  flashMarker.setIcon(hlicon); //高亮
                  flashMarker.setTop(true);
                }
              }
            }
          }
        }
      } else if (type == 2) {
        //轨迹告警高亮
        for (var j = 0; j < overlay.length; j++) {
          if (overlay[j].setAnimation)
            if (overlay[j].getLabel) {
              if (overlay[j].getLabel()) {
                if (overlay[j].getTitle() == "notification") {
                    // console.log(
                    //   overlay[j].getIcon().imageUrl.indexOf("start") > -1
                    // );
                    if (
                      overlay[j].getIcon().imageUrl.indexOf("start") > -1 ||
                      overlay[j].getIcon().imageUrl.indexOf("end") > -1
                    ) {
                      overlay[j].setTop(false);
                    } else {
                      overlay[j].setIcon(icon); //不高亮
                      overlay[j].setTop(false);
                    }

                }
                
              }
            }
        }
        let flashMarker = null;
        for (var i = 0; i < overlay.length; i++) {
          if (overlay[i].getLabel) {
            if (overlay[i].getLabel()) {
             
              if (
                data.notificationID.indexOf(overlay[i].getLabel().content) >= 0
              ) {
                if (overlay[i].getTitle() == "notification") {
                  // let flashMarker = overlay[i];
                  // flashMarker.setIcon(hlicon); //高亮
                  // flashMarker.setTop(true);
                  if (
                    overlay[i].getIcon().imageUrl.indexOf("start") > -1 ||
                    overlay[i].getIcon().imageUrl.indexOf("end") > -1
                  ) {
                    let flashMarker = overlay[i];
                    flashMarker.setTop(true);
                  } else {
                    let flashMarker = overlay[i];
                    flashMarker.setIcon(hlicon); //高亮
                    flashMarker.setTop(true);
                  }
                }
              }
            }
          }
        }
      }
    },

    moveTo: function(data, curnode) {
      let overlay = this.map.getOverlays();
      //移动
      if (curnode.state == true) {
        for (var j = 0; j < overlay.length; j++) {
          if (overlay[j].getLabel) {
            if (overlay[j].getLabel()) {
              let label = overlay[j].getLabel().content;
              if (data.indexOf(label) >= 0) {
                if (label == curnode.id) {
                  console.log(
                    "跳转到了卡口:" +
                      overlay[j].getPosition().lng +
                      "," +
                      overlay[j].getPosition().lat
                  );
                  this.map.panTo(overlay[j].getPosition());
                  //全选时，只跳转到开始一个；或者调转到中心点
                  if (data.length > 0) {
                    break;
                  }
                  // console.log(overlay[j].getPosition());
                  // console.log(overlay[j].getLabel().content);
                }
              }
            }
          }
        }
      }
    },

    
    pointSelect: function() {
      // alert(1);
      // this.default_config.isdragging = false;
      //  this.map.setDefaultCursor("default");
    },
    boxSelect: function() {},
    removeSelect: function() {},

    removeLayer(type) {
      let overlay = this.map.getOverlays();

      for (var j = 0; j < overlay.length; j++) {
        // overlay[j].enableDragging();
        // console.log(overlay[j]);
        if (overlay[j].point) {
          if (overlay[j].getTitle() == type) {
            this.map.removeOverlay(overlay[j]);
          }
        }
        if (overlay[j].so) {
          this.map.removeOverlay(overlay[j]);
        }
      }
    },
    showRoute(type) {
      var that = this;
      var route = this.InteractList.filter(item => item.type == type);
      if (route.length < 1) {
        alert("showRoute轨迹点个数：" + route.length);
        return;
      }
      var points = [];
      var b;
      var fristpointX = route[0].d.longitude;
      var fristpointY = route[0].d.latitude;
      var samecount = 0;

      var startpoint;
      var endpoint;
      var waypoints = [];
      route.forEach((item, idx) => {
        //如果是同一个点则返回

        points.push(new this.BMap.Point(item.d.longitude, item.d.latitude));
        if (idx == 1) {
          b = new BMap.Bounds(points[0], points[1]);
        }
        if (idx > 1) {
          b.extend(points[idx]);
        }
        if (fristpointX == item.d.longitude && fristpointY == item.d.latitude) {
          samecount += 1;
        }

        if (idx == 0) {
          startpoint = points[idx];
        }
        if (idx == route.length - 1) {
          endpoint = points[idx];
        }
        if (idx > 0 && idx < route.length - 1) {
          waypoints.push(points[idx]);
        }
      }, this);
      if (samecount == route.length) {
        console.log("相同点不能构造线");
        this.map.panTo(
          new this.BMap.Point(route[0].d.longitude, route[0].d.latitude)
        );
        return;
      }

      var sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
        scale: 0.6, //图标缩放大小
        strokeColor: "#eee", //设置矢量图标的线填充颜色
        strokeWeight: "1" //设置线宽
      });
      var icons = new BMap.IconSequence(sy, "10", "30");

      var polyline = new this.BMap.Polyline(points, {
        enableEditing: false, //是否启用线编辑，默认为false
        enableClicking: true, //是否响应点击事件，默认为true
        icons: [icons],
        strokeWeight: "9", //折线的宽度，以像素为单位
        strokeOpacity: 0.9, //折线的透明度，取值范围0 - 1
        strokeColor: "#18a45b" //折线颜色
      });

      // console.log("显示范围：");
      // console.log(b);
      // console.log(b.getCenter());
      // var markerss = new BMap.Marker(b.getCenter());
      // this.map.addOverlay(markerss);
      // console.log(b.getSouthWest());
      // console.log(b.getNorthEast());

      //  var ds=this.getDistance(b.getSouthWest().lng,b.getSouthWest().lat,b.getNorthEast().lng,b.getNorthEast().lat);
      //  console.log(ds);

      //  this.map.setZoom(19-parseInt(ds/440));

      this.map.setViewport(points);
      var bs = this.map.getBounds();
      this.map.panTo(bs.getCenter());
      console.log(
        "跳转轨迹中心bs:" + bs.getCenter().lng + "," + bs.getCenter().lat
      );
      //  console.log("跳转轨迹中心:"+b.getCenter().lng+","+b.getCenter().lat);

      // this.map.addOverlay(polyline); //增加折线

      var driving = new BMap.DrivingRoute(this.map, {
        renderOptions: { map: this.map, autoViewport: true },
        policy: BMAP_DRIVING_POLICY_LEAST_TIME
      });
      driving.search(startpoint, endpoint, {
        waypoints: waypoints
      }); //waypoints表示途经点

      //删除driving方式生成的起点，终点和经过点
      // this.map.clearOverlays();
      //  document.querySelectorAll('[class*=test]')
      //检索结束后的回调
      // driving.setSearchCompleteCallback(function() {
      //   var child = document.querySelectorAll("[src*=way-points]");
      //   var parent = child.parentNode;
      //   parent.removeChild(child);
      //   document.querySelectorAll("[src*=dest_markers]");
      // });
      driving.setMarkersSetCallback(
        function() {
          // // var child3 = document.querySelectorAll("[title*=起点]");
          // // child3[0].style.position = "relative";
          // // var child4 = document.querySelectorAll("[title*=终点]");
          // // child4[0].style.position = "relative";
          // document.querySelectorAll("span.BMap_noprint")
          // //  var child5 = document.querySelectorAll("[title*=23]");
          // //         child5.forEach((item, idx) => {
          // //           // item.parentNode.removeChild(item);
          // //         }, this);

          // var child1 = document.querySelectorAll("[src*=way-points]");
          // child1.forEach((item, idx) => {
          //   item.parentNode.removeChild(item);
          // }, this);
          // var child2 = document.querySelectorAll("[src*=dest_markers]");
          // child2.forEach((item, idx) => {
          //   item.parentNode.removeChild(item);
          // }, this);

          let overlay = this.map.getOverlays();
          for (var i = 0; i < overlay.length; i++) {
            if (overlay[i].getTitle) {
              if (
                overlay[i].getTitle() == "" ||
                overlay[i].getTitle() == "起点" ||
                overlay[i].getTitle() == "终点"
              ) {
                this.map.removeOverlay(overlay[i]);
              }
            }
          }
        }.bind(this)
      );

      this.map.getOverlays();
      console.log(1);
    },
    showTrack(route, type) {
      var img = type == 2 ? this.bmapImg.ry : this.bmapImg.cl;
      route.forEach((item, idx) => {
        let startIcon;
        let endIcon;
        let myIcon;
        if (idx == 0) {
          //开始图标
          startIcon = new this.BMap.Icon(
            this.bmapImg.start,
            new this.BMap.Size(36, 36)
          );
          startIcon.imageSize = new this.BMap.Size(36, 36);
          startIcon.anchor = new this.BMap.Size(18, 36);
          myIcon = startIcon;
        } else if (route.length == idx + 1) {
          //结束图标
          endIcon = new this.BMap.Icon(
            this.bmapImg.end,
            new this.BMap.Size(36, 36)
          );
          // endIcon.imageSize = new this.BMap.Size(120, 50);
          //   endIcon.imageOffset = new this.BMap.Size(-38, 0);
          endIcon.imageSize = new this.BMap.Size(36, 36);
          endIcon.anchor = new this.BMap.Size(18, 36);
          myIcon = endIcon;
        } else {
          //创建图标

          myIcon = new this.BMap.Icon(img, new this.BMap.Size(24, 24));
          myIcon.imageSize = new this.BMap.Size(24, 24);
        }
        let pt = new this.BMap.Point(item.longitude, item.latitude);
        let marker2 = new this.BMap.Marker(pt, {
          icon: myIcon,
          title: "notification"
        }); // 创建标注
        let label = new BMap.Label(item.notificationID, {
          offset: new BMap.Size(20, 40)
        });

        label.setStyle({ display: "none" });
        marker2.setLabel(label);

        this.setInfowindow(marker2, item, {
          ischeck: false,
          title: "详情",
          type: "track",
          lx: type == 2 ? "ry" : "cl",
          isShowButton: false
        });

        this.map.addOverlay(marker2);
      }, this);

      if (route.length < 1) {
        // alert("showTrack轨迹点个数：" + route.length);
        this.$message({
          message: "没有轨迹信息",
          type: "error",
          duration: 5 * 1000
        });
        return;
      }
      var points = [];
      var b;
      var fristpointX = route[0].longitude;
      var fristpointY = route[0].latitude;
      var samecount = 0;

      var startpoint;
      var endpoint;
      var waypoints = [];
      route.forEach((item, idx) => {
        //如果是同一个点则返回

        points.push(new this.BMap.Point(item.longitude, item.latitude));
        if (idx == 1) {
          b = new BMap.Bounds(points[0], points[1]);
        }
        if (idx > 1) {
          b.extend(points[idx]);
        }
        if (fristpointX == item.longitude && fristpointY == item.latitude) {
          samecount += 1;
        }

        if (idx == 0) {
          startpoint = points[idx];
        }
        if (idx == route.length - 1) {
          endpoint = points[idx];
        }
        if (idx > 0 && idx < route.length - 1) {
          waypoints.push(points[idx]);
        }
      }, this);
      if (samecount == route.length) {
        console.log("相同点不能构造线");
        return;
      }

      var sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
        scale: 0.6, //图标缩放大小
        strokeColor: "#eee", //设置矢量图标的线填充颜色
        strokeWeight: "1" //设置线宽
      });
      var icons = new BMap.IconSequence(sy, "10", "30");

      var polyline = new this.BMap.Polyline(points, {
        enableEditing: false, //是否启用线编辑，默认为false
        enableClicking: true, //是否响应点击事件，默认为true
        icons: [icons],
        strokeWeight: "9", //折线的宽度，以像素为单位
        strokeOpacity: 0.9, //折线的透明度，取值范围0 - 1
        strokeColor: "#18a45b" //折线颜色
      });

      this.map.setViewport(points);
      var bs = this.map.getBounds();
      this.map.panTo(bs.getCenter());
      console.log(
        "跳转轨迹中心bs:" + bs.getCenter().lng + "," + bs.getCenter().lat
      );

      // this.map.addOverlay(polyline); //增加折线

      var driving = new BMap.DrivingRoute(this.map, {
        renderOptions: { map: this.map, autoViewport: true },
        policy: BMAP_DRIVING_POLICY_LEAST_TIME
      });
      this.drivingRoute=driving;
      driving.search(startpoint, endpoint, {
        waypoints: waypoints
      }); //waypoints表示途经点
      driving.setMarkersSetCallback(
        function() {
          let overlay = this.map.getOverlays();
          for (var i = 0; i < overlay.length; i++) {
            if (overlay[i].getTitle) {
              if (
                overlay[i].getTitle() == "" ||
                overlay[i].getTitle() == "起点" ||
                overlay[i].getTitle() == "终点"
              ) {
                this.map.removeOverlay(overlay[i]);
              }
            }
          }
        }.bind(this)
      );

      this.map.getOverlays();
      console.log(1);
    },

    bkxqClick(id) {
      // alert(id);
      //  this.$emit('test');//把a标签的点击事件分发
      //  this.$parent.$emit(this.$parent.toBkDetails,id);
      this.$parent.toBkDetails(id);
      // if (window.document.location.href.indexOf("bukongxiangqing") >= 0) {
      // //  this.$parent.$refs.gaojingliebiao.toBkDetails(id);
      // } else {
      //   this.$parent.toBkDetails(id);
      // }
    },
    ckspClick(did, tid) {
      // alert(did + tid);
      this.$parent.showVideo(did, tid);
    },

    getDistance(lng1, lat1, lng2, lat2) {
      var EARTHRADIUS = 6370996.81;

      let point1 = new BMap.Point(parseFloat(lng1), parseFloat(lat1));
      let point2 = new BMap.Point(parseFloat(lng2), parseFloat(lat2));
      //判断类型
      if (!(point1 instanceof BMap.Point) || !(point2 instanceof BMap.Point)) {
        return 0;
      }
      point1.lng = this.getLoop(point1.lng, -180, 180);
      point1.lat = this.getRange(point1.lat, -74, 74);
      point2.lng = this.getLoop(point2.lng, -180, 180);
      point2.lat = this.getRange(point2.lat, -74, 74);
      let x1, x2, y1, y2;
      x1 = this.degreeToRad(point1.lng);
      y1 = this.degreeToRad(point1.lat);
      x2 = this.degreeToRad(point2.lng);
      y2 = this.degreeToRad(point2.lat);
      return (
        EARTHRADIUS *
        Math.acos(
          Math.sin(y1) * Math.sin(y2) +
            Math.cos(y1) * Math.cos(y2) * Math.cos(x2 - x1)
        )
      );
    },
    getLoop(v, a, b) {
      while (v > b) {
        v -= b - a;
      }
      while (v < a) {
        v += b - a;
      }
      return v;
    },
    getRange(v, a, b) {
      if (a != null) {
        v = Math.max(v, a);
      }
      if (b != null) {
        v = Math.min(v, b);
      }
      return v;
    },
    degreeToRad(degree) {
      return (Math.PI * degree) / 180;
    },

    inittextIconOverlay() {
      var BMapLib = (window.BMapLib = BMapLib || {});

      (function() {
        /**
         * 声明baidu包
         */
        var T,
          baidu = (T = baidu || { version: "1.3.8" });

        (function() {
          //提出guid，防止在与老版本Tangram混用时
          //在下一行错误的修改window[undefined]
          baidu.guid = "$BAIDU$";

          //Tangram可能被放在闭包中
          //一些页面级别唯一的属性，需要挂载在window[baidu.guid]上
          window[baidu.guid] = window[baidu.guid] || {};

          /**
           * @ignore
           * @namespace baidu.dom 操作dom的方法。
           */
          baidu.dom = baidu.dom || {};

          /**
           * 从文档中获取指定的DOM元素
           * @name baidu.dom.g
           * @function
           * @grammar baidu.dom.g(id)
           * @param {string|HTMLElement} id 元素的id或DOM元素
           * @shortcut g,T.G
           * @meta standard
           * @see baidu.dom.q
           *
           * @returns {HTMLElement|null} 获取的元素，查找不到时返回null,如果参数不合法，直接返回参数
           */
          baidu.dom.g = function(id) {
            if ("string" == typeof id || id instanceof String) {
              return document.getElementById(id);
            } else if (
              id &&
              id.nodeName &&
              (id.nodeType == 1 || id.nodeType == 9)
            ) {
              return id;
            }
            return null;
          };

          // 声明快捷方法
          baidu.g = baidu.G = baidu.dom.g;

          /**
           * 获取目标元素所属的document对象
           * @name baidu.dom.getDocument
           * @function
           * @grammar baidu.dom.getDocument(element)
           * @param {HTMLElement|string} element 目标元素或目标元素的id
           * @meta standard
           * @see baidu.dom.getWindow
           *
           * @returns {HTMLDocument} 目标元素所属的document对象
           */
          baidu.dom.getDocument = function(element) {
            element = baidu.dom.g(element);
            return element.nodeType == 9
              ? element
              : element.ownerDocument || element.document;
          };

          /**
           * @ignore
           * @namespace baidu.lang 对语言层面的封装，包括类型判断、模块扩展、继承基类以及对象自定义事件的支持。
           */
          baidu.lang = baidu.lang || {};

          /**
           * 判断目标参数是否string类型或String对象
           * @name baidu.lang.isString
           * @function
           * @grammar baidu.lang.isString(source)
           * @param {Any} source 目标参数
           * @shortcut isString
           * @meta standard
           * @see baidu.lang.isObject,baidu.lang.isNumber,baidu.lang.isArray,baidu.lang.isElement,baidu.lang.isBoolean,baidu.lang.isDate
           *
           * @returns {boolean} 类型判断结果
           */
          baidu.lang.isString = function(source) {
            return "[object String]" == Object.prototype.toString.call(source);
          };

          // 声明快捷方法
          baidu.isString = baidu.lang.isString;

          /**
           * 从文档中获取指定的DOM元素
           * **内部方法**
           *
           * @param {string|HTMLElement} id 元素的id或DOM元素
           * @meta standard
           * @return {HTMLElement} DOM元素，如果不存在，返回null，如果参数不合法，直接返回参数
           */
          baidu.dom._g = function(id) {
            if (baidu.lang.isString(id)) {
              return document.getElementById(id);
            }
            return id;
          };

          // 声明快捷方法
          baidu._g = baidu.dom._g;

          /**
           * @ignore
           * @namespace baidu.browser 判断浏览器类型和特性的属性。
           */
          baidu.browser = baidu.browser || {};

          if (/msie (\d+\.\d)/i.test(navigator.userAgent)) {
            //IE 8下，以documentMode为准
            //在百度模板中，可能会有$，防止冲突，将$1 写成 \x241
            /**
             * 判断是否为ie浏览器
             * @property ie ie版本号
             * @grammar baidu.browser.ie
             * @meta standard
             * @shortcut ie
             * @see baidu.browser.firefox,baidu.browser.safari,baidu.browser.opera,baidu.browser.chrome,baidu.browser.maxthon
             */
            baidu.browser.ie = baidu.ie =
              document.documentMode || +RegExp["\x241"];
          }

          /**
           * 获取目标元素的computed style值。如果元素的样式值不能被浏览器计算，则会返回空字符串（IE）
           *
           * @author berg
           * @name baidu.dom.getComputedStyle
           * @function
           * @grammar baidu.dom.getComputedStyle(element, key)
           * @param {HTMLElement|string} element 目标元素或目标元素的id
           * @param {string} key 要获取的样式名
           *
           * @see baidu.dom.getStyle
           *
           * @returns {string} 目标元素的computed style值
           */

          baidu.dom.getComputedStyle = function(element, key) {
            element = baidu.dom._g(element);
            var doc = baidu.dom.getDocument(element),
              styles;
            if (doc.defaultView && doc.defaultView.getComputedStyle) {
              styles = doc.defaultView.getComputedStyle(element, null);
              if (styles) {
                return styles[key] || styles.getPropertyValue(key);
              }
            }
            return "";
          };

          /**
           * 提供给setStyle与getStyle使用
           */
          baidu.dom._styleFixer = baidu.dom._styleFixer || {};

          /**
           * 提供给setStyle与getStyle使用
           */
          baidu.dom._styleFilter = baidu.dom._styleFilter || [];

          /**
           * 为获取和设置样式的过滤器
           * @private
           * @meta standard
           */
          baidu.dom._styleFilter.filter = function(key, value, method) {
            for (
              var i = 0, filters = baidu.dom._styleFilter, filter;
              (filter = filters[i]);
              i++
            ) {
              if ((filter = filter[method])) {
                value = filter(key, value);
              }
            }
            return value;
          };

          /**
           * @ignore
           * @namespace baidu.string 操作字符串的方法。
           */
          baidu.string = baidu.string || {};

          /**
           * 将目标字符串进行驼峰化处理
           * @name baidu.string.toCamelCase
           * @function
           * @grammar baidu.string.toCamelCase(source)
           * @param {string} source 目标字符串
           * @remark
           * 支持单词以“-_”分隔
           * @meta standard
           *
           * @returns {string} 驼峰化处理后的字符串
           */
          baidu.string.toCamelCase = function(source) {
            //提前判断，提高getStyle等的效率 thanks xianwei
            if (source.indexOf("-") < 0 && source.indexOf("_") < 0) {
              return source;
            }
            return source.replace(/[-_][^-_]/g, function(match) {
              return match.charAt(1).toUpperCase();
            });
          };

          /**
           * 获取目标元素的样式值
           * @name baidu.dom.getStyle
           * @function
           * @grammar baidu.dom.getStyle(element, key)
           * @param {HTMLElement|string} element 目标元素或目标元素的id
           * @param {string} key 要获取的样式名
           * @remark
           *
           * 为了精简代码，本模块默认不对任何浏览器返回值进行归一化处理（如使用getStyle时，不同浏览器下可能返回rgb颜色或hex颜色），也不会修复浏览器的bug和差异性（如设置IE的float属性叫styleFloat，firefox则是cssFloat）。<br />
           * baidu.dom._styleFixer和baidu.dom._styleFilter可以为本模块提供支持。<br />
           * 其中_styleFilter能对颜色和px进行归一化处理，_styleFixer能对display，float，opacity，textOverflow的浏览器兼容性bug进行处理。
           * @shortcut getStyle
           * @meta standard
           * @see baidu.dom.setStyle,baidu.dom.setStyles, baidu.dom.getComputedStyle
           *
           * @returns {string} 目标元素的样式值
           */
          baidu.dom.getStyle = function(element, key) {
            var dom = baidu.dom;

            element = dom.g(element);
            key = baidu.string.toCamelCase(key);
            //computed style, then cascaded style, then explicitly set style.
            var value =
              element.style[key] ||
              (element.currentStyle ? element.currentStyle[key] : "") ||
              dom.getComputedStyle(element, key);

            // 在取不到值的时候，用fixer进行修正
            if (!value) {
              var fixer = dom._styleFixer[key];
              if (fixer) {
                value = fixer.get
                  ? fixer.get(element)
                  : baidu.dom.getStyle(element, fixer);
              }
            }

            /* 检查结果过滤器 */
            if ((fixer = dom._styleFilter)) {
              value = fixer.filter(key, value, "get");
            }

            return value;
          };

          // 声明快捷方法
          baidu.getStyle = baidu.dom.getStyle;

          if (/opera\/(\d+\.\d)/i.test(navigator.userAgent)) {
            /**
             * 判断是否为opera浏览器
             * @property opera opera版本号
             * @grammar baidu.browser.opera
             * @meta standard
             * @see baidu.browser.ie,baidu.browser.firefox,baidu.browser.safari,baidu.browser.chrome
             */
            baidu.browser.opera = +RegExp["\x241"];
          }

          /**
           * 判断是否为webkit内核
           * @property isWebkit
           * @grammar baidu.browser.isWebkit
           * @meta standard
           * @see baidu.browser.isGecko
           */
          baidu.browser.isWebkit = /webkit/i.test(navigator.userAgent);

          /**
           * 判断是否为gecko内核
           * @property isGecko
           * @grammar baidu.browser.isGecko
           * @meta standard
           * @see baidu.browser.isWebkit
           */
          baidu.browser.isGecko =
            /gecko/i.test(navigator.userAgent) &&
            !/like gecko/i.test(navigator.userAgent);

          /**
           * 判断是否严格标准的渲染模式
           * @property isStrict
           * @grammar baidu.browser.isStrict
           * @meta standard
           */
          baidu.browser.isStrict = document.compatMode == "CSS1Compat";

          /**
           * 获取目标元素相对于整个文档左上角的位置
           * @name baidu.dom.getPosition
           * @function
           * @grammar baidu.dom.getPosition(element)
           * @param {HTMLElement|string} element 目标元素或目标元素的id
           * @meta standard
           *
           * @returns {Object} 目标元素的位置，键值为top和left的Object。
           */
          baidu.dom.getPosition = function(element) {
            element = baidu.dom.g(element);
            var doc = baidu.dom.getDocument(element),
              browser = baidu.browser,
              getStyle = baidu.dom.getStyle,
              // Gecko 1.9版本以下用getBoxObjectFor计算位置
              // 但是某些情况下是有bug的
              // 对于这些有bug的情况
              // 使用递归查找的方式
              BUGGY_GECKO_BOX_OBJECT =
                browser.isGecko > 0 &&
                doc.getBoxObjectFor &&
                getStyle(element, "position") == "absolute" &&
                (element.style.top === "" || element.style.left === ""),
              pos = { left: 0, top: 0 },
              viewport =
                browser.ie && !browser.isStrict
                  ? doc.body
                  : doc.documentElement,
              parent,
              box;

            if (element == viewport) {
              return pos;
            }

            if (element.getBoundingClientRect) {
              // IE and Gecko 1.9+

              //当HTML或者BODY有border width时, 原生的getBoundingClientRect返回值是不符合预期的
              //考虑到通常情况下 HTML和BODY的border只会设成0px,所以忽略该问题.
              box = element.getBoundingClientRect();

              pos.left =
                Math.floor(box.left) +
                Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft);
              pos.top =
                Math.floor(box.top) +
                Math.max(doc.documentElement.scrollTop, doc.body.scrollTop);

              // IE会给HTML元素添加一个border，默认是medium（2px）
              // 但是在IE 6 7 的怪异模式下，可以被html { border: 0; } 这条css规则覆盖
              // 在IE7的标准模式下，border永远是2px，这个值通过clientLeft 和 clientTop取得
              // 但是。。。在IE 6 7的怪异模式，如果用户使用css覆盖了默认的medium
              // clientTop和clientLeft不会更新
              pos.left -= doc.documentElement.clientLeft;
              pos.top -= doc.documentElement.clientTop;

              var htmlDom = doc.body,
                // 在这里，不使用element.style.borderLeftWidth，只有computedStyle是可信的
                htmlBorderLeftWidth = parseInt(
                  getStyle(htmlDom, "borderLeftWidth")
                ),
                htmlBorderTopWidth = parseInt(
                  getStyle(htmlDom, "borderTopWidth")
                );
              if (browser.ie && !browser.isStrict) {
                pos.left -= isNaN(htmlBorderLeftWidth)
                  ? 2
                  : htmlBorderLeftWidth;
                pos.top -= isNaN(htmlBorderTopWidth) ? 2 : htmlBorderTopWidth;
              }
            } else {
              // safari/opera/firefox
              parent = element;

              do {
                pos.left += parent.offsetLeft;
                pos.top += parent.offsetTop;

                // safari里面，如果遍历到了一个fixed的元素，后面的offset都不准了
                if (
                  browser.isWebkit > 0 &&
                  getStyle(parent, "position") == "fixed"
                ) {
                  pos.left += doc.body.scrollLeft;
                  pos.top += doc.body.scrollTop;
                  break;
                }

                parent = parent.offsetParent;
              } while (parent && parent != element);

              // 对body offsetTop的修正
              if (
                browser.opera > 0 ||
                (browser.isWebkit > 0 &&
                  getStyle(element, "position") == "absolute")
              ) {
                pos.top -= doc.body.offsetTop;
              }

              // 计算除了body的scroll
              parent = element.offsetParent;
              while (parent && parent != doc.body) {
                pos.left -= parent.scrollLeft;
                // see https://bugs.opera.com/show_bug.cgi?id=249965
                if (!browser.opera || parent.tagName != "TR") {
                  pos.top -= parent.scrollTop;
                }
                parent = parent.offsetParent;
              }
            }

            return pos;
          };

          /**
           * @ignore
           * @namespace baidu.event 屏蔽浏览器差异性的事件封装。
           * @property target 	事件的触发元素
           * @property pageX 		鼠标事件的鼠标x坐标
           * @property pageY 		鼠标事件的鼠标y坐标
           * @property keyCode 	键盘事件的键值
           */
          baidu.event = baidu.event || {};

          /**
           * 事件监听器的存储表
           * @private
           * @meta standard
           */
          baidu.event._listeners = baidu.event._listeners || [];

          /**
         * 为目标元素添加事件监听器
         * @name baidu.event.on
         * @function
         * @grammar baidu.event.on(element, type, listener)
         * @param {HTMLElement|string|window} element 目标元素或目标元素id
         * @param {string} type 事件类型
         * @param {Function} listener 需要添加的监听器
         * @remark
         *
        1. 不支持跨浏览器的鼠标滚轮事件监听器添加<br>
        2. 改方法不为监听器灌入事件对象，以防止跨iframe事件挂载的事件对象获取失败

         * @shortcut on
         * @meta standard
         * @see baidu.event.un
         *
         * @returns {HTMLElement|window} 目标元素
         */
          baidu.event.on = function(element, type, listener) {
            type = type.replace(/^on/i, "");
            element = baidu.dom._g(element);

            var realListener = function(ev) {
                // 1. 这里不支持EventArgument,  原因是跨frame的事件挂载
                // 2. element是为了修正this
                listener.call(element, ev);
              },
              lis = baidu.event._listeners,
              filter = baidu.event._eventFilter,
              afterFilter,
              realType = type;
            type = type.toLowerCase();
            // filter过滤
            if (filter && filter[type]) {
              afterFilter = filter[type](element, type, realListener);
              realType = afterFilter.type;
              realListener = afterFilter.listener;
            }

            // 事件监听器挂载
            if (element.addEventListener) {
              element.addEventListener(realType, realListener, false);
            } else if (element.attachEvent) {
              element.attachEvent("on" + realType, realListener);
            }

            // 将监听器存储到数组中
            lis[lis.length] = [element, type, listener, realListener, realType];
            return element;
          };

          // 声明快捷方法
          baidu.on = baidu.event.on;

          /**
           * 返回一个当前页面的唯一标识字符串。
           * @name baidu.lang.guid
           * @function
           * @grammar baidu.lang.guid()
           * @version 1.1.1
           * @meta standard
           *
           * @returns {String} 当前页面的唯一标识字符串
           */

          (function() {
            //不直接使用window，可以提高3倍左右性能
            var guid = window[baidu.guid];

            baidu.lang.guid = function() {
              return "TANGRAM__" + (guid._counter++).toString(36);
            };

            guid._counter = guid._counter || 1;
          })();

          /**
           * 所有类的实例的容器
           * key为每个实例的guid
           * @meta standard
           */

          window[baidu.guid]._instances = window[baidu.guid]._instances || {};

          /**
           * 判断目标参数是否为function或Function实例
           * @name baidu.lang.isFunction
           * @function
           * @grammar baidu.lang.isFunction(source)
           * @param {Any} source 目标参数
           * @version 1.2
           * @see baidu.lang.isString,baidu.lang.isObject,baidu.lang.isNumber,baidu.lang.isArray,baidu.lang.isElement,baidu.lang.isBoolean,baidu.lang.isDate
           * @meta standard
           * @returns {boolean} 类型判断结果
           */
          baidu.lang.isFunction = function(source) {
            // chrome下,'function' == typeof /a/ 为true.
            return (
              "[object Function]" == Object.prototype.toString.call(source)
            );
          };

          /**
           *
           * @ignore
           * @class  Tangram继承机制提供的一个基类，用户可以通过继承baidu.lang.Class来获取它的属性及方法。
           * @name 	baidu.lang.Class
           * @grammar baidu.lang.Class(guid)
           * @param 	{string}	guid	对象的唯一标识
           * @meta standard
           * @remark baidu.lang.Class和它的子类的实例均包含一个全局唯一的标识guid。guid是在构造函数中生成的，因此，继承自baidu.lang.Class的类应该直接或者间接调用它的构造函数。<br>baidu.lang.Class的构造函数中产生guid的方式可以保证guid的唯一性，及每个实例都有一个全局唯一的guid。
           * @meta standard
           * @see baidu.lang.inherits,baidu.lang.Event
           */
          baidu.lang.Class = function(guid) {
            this.guid = guid || baidu.lang.guid();
            window[baidu.guid]._instances[this.guid] = this;
          };
          window[baidu.guid]._instances = window[baidu.guid]._instances || {};

          /**
           * 释放对象所持有的资源，主要是自定义事件。
           * @name dispose
           * @grammar obj.dispose()
           */
          baidu.lang.Class.prototype.dispose = function() {
            delete window[baidu.guid]._instances[this.guid];

            for (var property in this) {
              if (!baidu.lang.isFunction(this[property])) {
                delete this[property];
              }
            }
            this.disposed = true;
          };

          /**
           * 重载了默认的toString方法，使得返回信息更加准确一些。
           * @return {string} 对象的String表示形式
           */
          baidu.lang.Class.prototype.toString = function() {
            return "[object " + (this._className || "Object") + "]";
          };

          /**
           * @ignore
           * @class   自定义的事件对象。
           * @name 	baidu.lang.Event
           * @grammar baidu.lang.Event(type[, target])
           * @param 	{string} type	 事件类型名称。为了方便区分事件和一个普通的方法，事件类型名称必须以"on"(小写)开头。
           * @param 	{Object} [target]触发事件的对象
           * @meta standard
           * @remark 引入该模块，会自动为Class引入3个事件扩展方法：addEventListener、removeEventListener和dispatchEvent。
           * @meta standard
           * @see baidu.lang.Class
           */
          baidu.lang.Event = function(type, target) {
            this.type = type;
            this.returnValue = true;
            this.target = target || null;
            this.currentTarget = null;
          };

          /**
           * 注册对象的事件监听器。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
           * @grammar obj.addEventListener(type, handler[, key])
           * @param 	{string}   type         自定义事件的名称
           * @param 	{Function} handler      自定义事件被触发时应该调用的回调函数
           * @param 	{string}   [key]		为事件监听函数指定的名称，可在移除时使用。如果不提供，方法会默认为它生成一个全局唯一的key。
           * @remark 	事件类型区分大小写。如果自定义事件名称不是以小写"on"开头，该方法会给它加上"on"再进行判断，即"click"和"onclick"会被认为是同一种事件。
           */
          baidu.lang.Class.prototype.addEventListener = function(
            type,
            handler,
            key
          ) {
            if (!baidu.lang.isFunction(handler)) {
              return;
            }

            !this.__listeners && (this.__listeners = {});

            var t = this.__listeners,
              id;
            if (typeof key == "string" && key) {
              if (/[^\w\-]/.test(key)) {
                throw "nonstandard key:" + key;
              } else {
                handler.hashCode = key;
                id = key;
              }
            }
            type.indexOf("on") != 0 && (type = "on" + type);

            typeof t[type] != "object" && (t[type] = {});
            id = id || baidu.lang.guid();
            handler.hashCode = id;
            t[type][id] = handler;
          };

          /**
           * 移除对象的事件监听器。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
           * @grammar obj.removeEventListener(type, handler)
           * @param {string}   type     事件类型
           * @param {Function|string} handler  要移除的事件监听函数或者监听函数的key
           * @remark 	如果第二个参数handler没有被绑定到对应的自定义事件中，什么也不做。
           */
          baidu.lang.Class.prototype.removeEventListener = function(
            type,
            handler
          ) {
            if (typeof handler != "undefined") {
              if (
                (baidu.lang.isFunction(handler) &&
                  !(handler = handler.hashCode)) ||
                !baidu.lang.isString(handler)
              ) {
                return;
              }
            }

            !this.__listeners && (this.__listeners = {});

            type.indexOf("on") != 0 && (type = "on" + type);

            var t = this.__listeners;
            if (!t[type]) {
              return;
            }
            if (typeof handler != "undefined") {
              t[type][handler] && delete t[type][handler];
            } else {
              for (var guid in t[type]) {
                delete t[type][guid];
              }
            }
          };

          /**
         * 派发自定义事件，使得绑定到自定义事件上面的函数都会被执行。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
         * @grammar obj.dispatchEvent(event, options)
         * @param {baidu.lang.Event|String} event 	Event对象，或事件名称(1.1.1起支持)
         * @param {Object} 					options 扩展参数,所含属性键值会扩展到Event对象上(1.2起支持)
         * @remark 处理会调用通过addEventListenr绑定的自定义事件回调函数之外，还会调用直接绑定到对象上面的自定义事件。例如：<br>
        myobj.onMyEvent = function(){}<br>
        myobj.addEventListener("onMyEvent", function(){});
         */
          baidu.lang.Class.prototype.dispatchEvent = function(event, options) {
            if (baidu.lang.isString(event)) {
              event = new baidu.lang.Event(event);
            }
            !this.__listeners && (this.__listeners = {});

            // 20100603 添加本方法的第二个参数，将 options extend到event中去传递
            options = options || {};
            for (var i in options) {
              event[i] = options[i];
            }

            var i,
              t = this.__listeners,
              p = event.type;
            event.target = event.target || this;
            event.currentTarget = this;

            p.indexOf("on") != 0 && (p = "on" + p);

            baidu.lang.isFunction(this[p]) && this[p].apply(this, arguments);

            if (typeof t[p] == "object") {
              for (i in t[p]) {
                t[p][i].apply(this, arguments);
              }
            }
            return event.returnValue;
          };

          baidu.lang.inherits = function(subClass, superClass, className) {
            var key,
              proto,
              selfProps = subClass.prototype,
              clazz = new Function();

            clazz.prototype = superClass.prototype;
            proto = subClass.prototype = new clazz();
            for (key in selfProps) {
              proto[key] = selfProps[key];
            }
            subClass.prototype.constructor = subClass;
            subClass.superClass = superClass.prototype;

            // 类名标识，兼容Class的toString，基本没用
            if ("string" == typeof className) {
              proto._className = className;
            }
          };
          // 声明快捷方法
          baidu.inherits = baidu.lang.inherits;
        })();

        /**

     * 图片的路径

     * @private
     * @type {String}

     */
        // var _IMAGE_PATH = "./img/blue";
        var _IMAGE_PATH = "../../../static/image/bmap/blue";

        /**

     * 图片的后缀名

      * @private
     * @type {String}

     */
        var _IMAGE_EXTENSION = "png";

        /**
         *@exports TextIconOverlay as BMapLib.TextIconOverlay
         */
        var TextIconOverlay =
          /**
           * TextIconOverlay
           * @class 此类表示地图上的一个覆盖物，该覆盖物由文字和图标组成，从Overlay继承。文字通常是数字（0-9）或字母（A-Z ），而文字与图标之间有一定的映射关系。
           *该覆盖物适用于以下类似的场景：需要在地图上添加一系列覆盖物，这些覆盖物之间用不同的图标和文字来区分，文字可能表示了该覆盖物的某一属性值，根据该文字和一定的映射关系，自动匹配相应颜色和大小的图标。
           *
           *@constructor
           *@param {Point} position 表示一个经纬度坐标位置。
           *@param {String} text 表示该覆盖物显示的文字信息。//秦改成obj形式吧
           *@param {Json Object} options 可选参数，可选项包括：<br />
           *"<b>styles</b>":{Array<IconStyle>} 一组图标风格。单个图表风格包括以下几个属性：<br />
           *   url	{String}	 图片的url地址。(必选)<br />
           *   size {Size}	图片的大小。（必选）<br />
           *   anchor {Size} 图标定位在地图上的位置相对于图标左上角的偏移值，默认偏移值为图标的中心位置。（可选）<br />
           *   offset {Size} 图片相对于可视区域的偏移值，此功能的作用等同于CSS中的background-position属性。（可选）<br />
           *   textSize {Number} 文字的大小。（可选，默认10）<br />
           *   textColor {String} 文字的颜色。（可选，默认black）<br />
           */
          (BMapLib.TextIconOverlay = function(position, text, options) {
            this._position = position;
            this._text = text;
            this._options = options || {};
            this._styles = this._options["styles"] || [];
            !this._styles.length && this._setupDefaultStyles();
          });

        T.lang.inherits(TextIconOverlay, BMap.Overlay, "TextIconOverlay");

        TextIconOverlay.prototype._setupDefaultStyles = function() {
          //var sizes = [53, 56, 66, 78, 92];
          // for(var i = 0, size; size = sizes[i]; i++){

          // }//for循环的简洁写法
          // 聚合的数据
          this._styles.push({
            url: _IMAGE_PATH + "." + _IMAGE_EXTENSION,
            size: new BMap.Size(92, 92)
          });
          //单条数据
        };

        /**
         *继承Overlay的intialize方法，自定义覆盖物时必须。
         *@param {Map} map BMap.Map的实例化对象。
         *@return {HTMLElement} 返回覆盖物对应的HTML元素。
         */
        TextIconOverlay.prototype.initialize = function(map) {
          this._map = map;

          this._domElement = document.createElement("div");
          this._domElement.classList.add("clustererContent");
          this._updateCss();
          this._updateText();
          this._updatePosition();

          this._bind();

          this._map.getPanes().markerMouseTarget.appendChild(this._domElement);
          return this._domElement;
        };

        /**
         *继承Overlay的draw方法，自定义覆盖物时必须。
         *@return 无返回值。
         */
        TextIconOverlay.prototype.draw = function() {
          this._map && this._updatePosition();
        };

        /**
         *获取该覆盖物上的文字。
         *@return {String} 该覆盖物上的文字。
         */
        TextIconOverlay.prototype.getText = function() {
          return this._text;
        };

        /**
         *设置该覆盖物上的文字。
         *@param {String} text 要设置的文字，通常是字母A-Z或数字0-9。
         *@return 无返回值。
         */
        TextIconOverlay.prototype.setText = function(text) {
          if (
            text &&
            (!this._text ||
              this._text.value != text.value ||
              this._text.name != text.name)
          ) {
            this._text = text;
            this._updateText();
            this._updateCss();
            this._updatePosition();
          }
        };

        /**
         *获取该覆盖物的位置。
         *@return {Point} 该覆盖物的经纬度坐标。
         */
        TextIconOverlay.prototype.getPosition = function() {
          return this._position;
        };

        /**
         *设置该覆盖物的位置。
         *@param {Point}  position 要设置的经纬度坐标。
         *@return 无返回值。
         */
        TextIconOverlay.prototype.setPosition = function(position) {
          if (
            position &&
            (!this._position || !this._position.equals(position))
          ) {
            this._position = position;
            this._updatePosition();
          }
        };

        /**
         *由文字信息获取风格数组的对应索引值。
         *内部默认的对应函数为文字转换为数字除以10的结果，比如文字8返回索引0，文字25返回索引2.
         *如果需要自定义映射关系，请覆盖该函数。
         *@param {String} text  文字。
         *@param {Array<IconStyle>}  styles 一组图标风格。
         *@return {Number} 对应的索引值。
         *2017-2-17 09:03:58废除
         */
        // TextIconOverlay.prototype.getStyleByText = function(text, styles){
        //     var count = parseInt(text.value);
        //     var index = parseInt(count / 10);
        //     index = Math.max(0, index);
        //     index = Math.min(index, styles.length - 1);
        //     return styles[index];
        // }

        /**
         *更新相应的CSS。
         *@return 无返回值。
         */
        TextIconOverlay.prototype._updateCss = function() {
          //var style = this.getStyleByText(this._text, this._styles);
          var style = this._styles[0];
          this._domElement.style.cssText = this._buildCssText(style);
        };

        /**
         *更新覆盖物的显示文字。
         *@return 无返回值。
         */
        TextIconOverlay.prototype._updateText = function() {
          if (this._domElement) {
            this._domElement.innerHTML =
              "<p>" +
              this._text.name +
              "</p>" +
              "<p>" +
              this._text.value +
              "</p>";
          }
        };

        /**
         *调整覆盖物在地图上的位置更新覆盖物的显示文字。
         *@return 无返回值。
         */
        TextIconOverlay.prototype._updatePosition = function() {
          if (this._domElement && this._position) {
            var style = this._domElement.style;
            var pixelPosition = this._map.pointToOverlayPixel(this._position);
            pixelPosition.x -= Math.ceil(parseInt(style.width) / 2);
            pixelPosition.y -= Math.ceil(parseInt(style.height) / 2);
            style.left = pixelPosition.x + "px";
            style.top = pixelPosition.y + "px";
          }
        };

        /**
         * 为该覆盖物的HTML元素构建CSS
         * @param {IconStyle}  一个图标的风格。
         * @return {String} 构建完成的CSSTEXT。
         */
        TextIconOverlay.prototype._buildCssText = function(style) {
          //根据style来确定一些默认值
          var url = style["url"];
          var size = style["size"];
          var anchor = style["anchor"];
          var offset = style["offset"];
          var textColor = style["textColor"] || "#fff";
          var textSize = style["textSize"] || 10;

          var csstext = [];
          if (T.browser["ie"] < 7) {
            csstext.push(
              "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(" +
                'sizingMethod=scale,src="' +
                url +
                '");'
            );
          } else {
            csstext.push("background-image:url(" + url + ");");
            var backgroundPosition = "0 0";
            offset instanceof BMap.Size &&
              (backgroundPosition =
                offset.width + "px" + " " + offset.height + "px");
            csstext.push("background-position:" + backgroundPosition + ";");
          }

          if (size instanceof BMap.Size) {
            if (anchor instanceof BMap.Size) {
              if (anchor.height > 0 && anchor.height < size.height) {
                csstext.push(
                  "height:" +
                    (size.height - anchor.height) +
                    "px; padding-top:" +
                    anchor.height +
                    "px;"
                );
              }
              if (anchor.width > 0 && anchor.width < size.width) {
                csstext.push(
                  "width:" +
                    (size.width - anchor.width) +
                    "px; padding-left:" +
                    anchor.width +
                    "px;"
                );
              }
            } else {
              csstext.push(
                "height:" + size.height + "px; line-height:" + 20 + "px;"
              );
              csstext.push("width:" + size.width + "px; text-align:center;");
            }
          }

          csstext.push(
            "cursor:pointer; color:" +
              textColor +
              "; position:absolute; font-size:" +
              textSize +
              "px; font-family:Arial,sans-serif; font-weight:bold"
          );
          return csstext.join("");
        };

        /**

     * 当鼠标点击该覆盖物时会触发该事件

     * @name TextIconOverlay#click

     * @event

     * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：

     * <br />"<b>type</b> : {String} 事件类型

     * <br />"<b>target</b>：{BMapLib.TextIconOverlay} 事件目标

     *

     */

        /**

     * 当鼠标进入该覆盖物区域时会触发该事件

     * @name TextIconOverlay#mouseover

     * @event
     * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：

     * <br />"<b>type</b> : {String} 事件类型

     * <br />"<b>target</b>：{BMapLib.TextIconOverlay} 事件目标

     * <br />"<b>point</b> : {BMap.Point} 最新添加上的节点BMap.Point对象

     * <br />"<b>pixel</b>：{BMap.pixel} 最新添加上的节点BMap.Pixel对象

     *

     * @example <b>参考示例：</b><br />

     * myTextIconOverlay.addEventListener("mouseover", function(e) {  alert(e.point);  });

     */

        /**

     * 当鼠标离开该覆盖物区域时会触发该事件

     * @name TextIconOverlay#mouseout

     * @event

     * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：

     * <br />"<b>type</b> : {String} 事件类型

     * <br />"<b>target</b>：{BMapLib.TextIconOverlay} 事件目标

     * <br />"<b>point</b> : {BMap.Point} 最新添加上的节点BMap.Point对象

     * <br />"<b>pixel</b>：{BMap.pixel} 最新添加上的节点BMap.Pixel对象

     *

     * @example <b>参考示例：</b><br />

     * myTextIconOverlay.addEventListener("mouseout", function(e) {  alert(e.point);  });

     */

        /**
         * 为该覆盖物绑定一系列事件
         * 当前支持click mouseover mouseout
         * @return 无返回值。
         */
        TextIconOverlay.prototype._bind = function() {
          if (!this._domElement) {
            return;
          }

          var me = this;
          var map = this._map;

          var BaseEvent = T.lang.Event;
          function eventExtend(e, be) {
            var elem = e.srcElement || e.target;
            var x = e.clientX || e.pageX;
            var y = e.clientY || e.pageY;
            if (e && be && x && y && elem) {
              var offset = T.dom.getPosition(map.getContainer());
              be.pixel = new BMap.Pixel(x - offset.left, y - offset.top);
              be.point = map.pixelToPoint(be.pixel);
            }
            return be;
          } //给事件参数增加pixel和point两个值

          T.event.on(this._domElement, "mouseover", function(e) {
            me.dispatchEvent(eventExtend(e, new BaseEvent("onmouseover")));
          });
          T.event.on(this._domElement, "mouseout", function(e) {
            me.dispatchEvent(eventExtend(e, new BaseEvent("onmouseout")));
          });
          T.event.on(this._domElement, "click", function(e) {
            me.dispatchEvent(eventExtend(e, new BaseEvent("onclick")));
          });
        };
      })();
    },
    initmaplib() {
      // var BMapLib = (window.BMapLib = BMapLib || {});
      var BMapLib = window.BMapLib;
      (function() {
        /**
         * 获取一个扩展的视图范围，把上下左右都扩大一样的像素值。
         * @param {Map} map BMap.Map的实例化对象
         * @param {BMap.Bounds} bounds BMap.Bounds的实例化对象
         * @param {Number} gridSize 要扩大的像素值
         *
         * @return {BMap.Bounds} 返回扩大后的视图范围。
         */
        var getExtendedBounds = function(map, bounds, gridSize) {
          bounds = cutBoundsInRange(bounds);
          var pixelNE = map.pointToPixel(bounds.getNorthEast());
          var pixelSW = map.pointToPixel(bounds.getSouthWest());
          pixelNE.x += gridSize;
          pixelNE.y -= gridSize;
          pixelSW.x -= gridSize;
          pixelSW.y += gridSize;
          var newNE = map.pixelToPoint(pixelNE);
          var newSW = map.pixelToPoint(pixelSW);
          return new BMap.Bounds(newSW, newNE);
        };

        /**
         * 按照百度地图支持的世界范围对bounds进行边界处理
         * @param {BMap.Bounds} bounds BMap.Bounds的实例化对象
         *
         * @return {BMap.Bounds} 返回不越界的视图范围
         */
        var cutBoundsInRange = function(bounds) {
          var maxX = getRange(bounds.getNorthEast().lng, -180, 180);
          var minX = getRange(bounds.getSouthWest().lng, -180, 180);
          var maxY = getRange(bounds.getNorthEast().lat, -74, 74);
          var minY = getRange(bounds.getSouthWest().lat, -74, 74);
          return new BMap.Bounds(
            new BMap.Point(minX, minY),
            new BMap.Point(maxX, maxY)
          );
        };

        /**
         * 对单个值进行边界处理。
         * @param {Number} i 要处理的数值
         * @param {Number} min 下边界值
         * @param {Number} max 上边界值
         *
         * @return {Number} 返回不越界的数值
         */
        var getRange = function(i, mix, max) {
          mix && (i = Math.max(i, mix));
          max && (i = Math.min(i, max));
          return i;
        };

        /**
         * 判断给定的对象是否为数组
         * @param {Object} source 要测试的对象
         *
         * @return {Boolean} 如果是数组返回true，否则返回false
         */
        var isArray = function(source) {
          return "[object Array]" === Object.prototype.toString.call(source);
        };

        /**
         * 返回item在source中的索引位置
         * @param {Object} item 要测试的对象
         * @param {Array} source 数组
         *
         * @return {Number} 如果在数组内，返回索引，否则返回-1
         */
        var indexOf = function(item, source) {
          var index = -1;
          if (isArray(source)) {
            if (source.indexOf) {
              index = source.indexOf(item);
            } else {
              for (var i = 0, m; (m = source[i]); i++) {
                if (m === item) {
                  index = i;
                  break;
                }
              }
            }
          }
          return index;
        };
 
         var zoomEndEvent;
        /**
         *@exports MarkerClusterer as BMapLib.MarkerClusterer
         */
        var MarkerClusterer =
          /**
           * MarkerClusterer
           * @class 用来解决加载大量点要素到地图上产生覆盖现象的问题，并提高性能
           * @constructor
           * @param {Map} map 地图的一个实例。
           * @param {Json Object} options 可选参数，可选项包括：<br />
           *    markers {Array<Marker>} 要聚合的标记数组<br />
           *    girdSize {Number} 聚合计算时网格的像素大小，默认60<br />
           *    maxZoom {Number} 最大的聚合级别，大于该级别就不进行相应的聚合<br />
           *    minClusterSize {Number} 最小的聚合数量，小于该数量的不能成为一个聚合，默认为2<br />
           *    isAverangeCenter {Boolean} 聚合点的落脚位置是否是所有聚合在内点的平均值，默认为否，落脚在聚合内的第一个点<br />
           *    styles {Array<IconStyle>} 自定义聚合后的图标风格，请参考TextIconOverlay类<br />
           */
          (BMapLib.MarkerClusterer = function(map, options) {
            if (!map) {
              return;
            }
            this._map = map;
            this._markers = []; //所有的点位
            this._clusters = []; //聚合的数组

            var opts = options || {};
            this._name = opts["name"] || "绵阳市";
            this._vuecomp = opts["vuecomp"] || "zz";
        
            this._data_sq = opts["data_sq"];
            this._qucode = opts["qucode"];
            this._shequcode = opts["shequcode"];
            this._data_qx = opts["data_qx"];
            // this._gridSize = opts["gridSize"] || -50;
            this._gridSize = opts["gridSize"] || 50;
            this._maxZoom = opts["maxZoom"] || 18;
            this._minClusterSize = opts["minClusterSize"] || 1;
            // this._isAverageCenter = true;
            this._isAverageCenter = true;
            if (opts["isAverageCenter"] != undefined) {
              this._isAverageCenter = opts["isAverageCenter"];
            }
            this._styles = opts["styles"] || [];

            var that = this;
            console.log(1212);
            if (this.p_isShowSelfNavigation != undefined) {
                //手动去除dom
                var svgs = document.querySelector(".BMap_zlHolder");
                if (svgs) {
                  svgs.innerHTML = "";
                }
            }
            zoomEndEvent=function(){
              that._redraw();

              //zoomend
              var zoom=this.getZoom();
              if (zoom <=13) {

                  eventBus.$emit(eventCollection._map2ybsstj,  {
                      id: "",
                    });

                  //如果存在则不加载
                  var svgs = document.querySelector("svg[version='1.1']");
                  if (svgs) {
                    svgs.innerHTML = "";
                  }

                  //加上行政区
                   var qu_gemo=options.qu
                    for (var j = 0; j < qu_gemo.length; j++) {
                        var count =qu_gemo[j].quGeometry.length;
                        for (var i = 0; i <count; i++) {
                            var ply = new BMap.Polygon(qu_gemo[j].quGeometry[i], {
                            strokeWeight: 2,
                            fillColor: qu_gemo[j].color||"#2d89f0"|| "#2d89f0",
                            strokeColor: qu_gemo[j].color||"#2d89f0", //"#4783E7" || this.initRandomColor() || "#4783E7",
                            fillOpacity: 0.2
                          }); //建立多边形覆盖物
                          that._map.addOverlay(ply); //添加覆盖物

                        }
                      
                     
                    }
                
                  // for (var j in options.qu) {
                  //  // 查询区县行政区
                  //   var bdary = new BMap.Boundary();
                  //   bdary.get(
                  //     options.qu[j].name || "北京市海淀区",
                  //     function(rs) {
                  //       //获取行政区域
                  //       // map.clearOverlays();        //清除地图覆盖物
                  //       var count = rs.boundaries.length; //行政区域的点有多少个
                  //       if (count === 0) {
                  //         alert("未能获取当前输入行政区域");
                  //         return;
                  //       }
                  //       var pointArray = [];
                  //       for (var j = 0; j < count; j++) {
                  //         var ply = new BMap.Polygon(rs.boundaries[j], {
                  //           strokeWeight: 2,
                  //           fillColor: this.color||"#2d89f0"||data_qx[this].color || "#2d89f0",
                  //           strokeColor: this.color||"#2d89f0"||data_qx[this].color, //"#4783E7" || this.initRandomColor() || "#4783E7",
                  //           fillOpacity: 0.2
                  //         }); //建立多边形覆盖物
                  //         that._map.addOverlay(ply); //添加覆盖物
                  //         pointArray = pointArray.concat(ply.getPath());
                  //       }
                  //     }.bind({color: options.qu[j].color})
                  //   );
                            
                  // }



              // }else if(zoom==14||zoom==15||zoom==16){
              }else if(zoom==14||zoom==15||zoom==16||zoom==17){

                    eventBus.$emit(eventCollection._map2ybsstj,  {
                      id: that._qucode,
                    });


                    var svgs = document.querySelector("svg[version='1.1']");
                    if (svgs) {
                      svgs.innerHTML = "";
                    }
                    //加载社区 shequGeometry
                     var shequ_gemo=options.shequ
                     for (var j = 0; j < shequ_gemo.length; j++) {
                      var ply = new BMap.Polygon(shequ_gemo[j].shequGeometry, {
                        strokeWeight: 2,
                        fillColor: shequ_gemo[j].color||"#2d89f0"|| "#2d89f0",
                        strokeColor: shequ_gemo[j].color||"#2d89f0", //"#4783E7" || this.initRandomColor() || "#4783E7",
                        fillOpacity: 0.2
                      }); //建立多边形覆盖物
                      that._map.addOverlay(ply); //添加覆盖物
                     
                    }
              }else{
                  eventBus.$emit(eventCollection._map2ybsstj,  {
                      id:  that._shequcode,
                  });
               
                   var svgs = document.querySelector("svg[version='1.1']");
                    if (svgs) {
                      svgs.innerHTML = "";
                    }
                   //加载最大一级 的 边界图
                    //加载geometry
                     var gemo=options.ts
                     for (var j = 0; j < gemo.length; j++) {
                      var ply = new BMap.Polygon(gemo[j].ts_geometry, {
                        strokeWeight: 2,
                        fillColor: gemo[j].color||"#2d89f0"|| "#2d89f0",
                        strokeColor: gemo[j].color||"#2d89f0", //"#4783E7" || this.initRandomColor() || "#4783E7",
                        fillOpacity: 0.2
                      }); //建立多边形覆盖物
                      that._map.addOverlay(ply); //添加覆盖物
                     
                    }


                //刷新右侧统计数据
                console.log("滚动到："+that._name);

                //  eventBus.$emit(eventCollection._map2ybsstj,  {
                //     id: that._qucode,
                //   });

               






              }

            }
            // this._map.removeEventListener("zoomend", zoomEndEvent);

            // this._map.addEventListener("zoomend", function(){alert(1)});
            // if(options.curindex==0){
                

            // }
            this._map.addEventListener("zoomend", zoomEndEvent);

            this._map.addEventListener("moveend", function() {
              that._redraw();
              console.log("moveend");
              //获取当前
              //刷新右侧统计数据

                var zoom=this.getZoom();
                if(zoom>17){
                     //加载最大一级 的 边界图
                    var svgs = document.querySelector("svg[version='1.1']");
                    if (svgs) {
                      svgs.innerHTML = "";
                    }
                     
                    //加载geometry
                     var gemo=options.ts
                     for (var j = 0; j < gemo.length; j++) {
                      var ply = new BMap.Polygon(gemo[j].ts_geometry, {
                        strokeWeight: 2,
                        fillColor: gemo[j].color||"#2d89f0"|| "#2d89f0",
                        strokeColor: gemo[j].color||"#2d89f0", //"#4783E7" || this.initRandomColor() || "#4783E7",
                        fillOpacity: 0.2
                      }); //建立多边形覆盖物
                      that._map.addOverlay(ply); //添加覆盖物
                     
                    }
                }




            });
            
            var mkrs = opts["markers"];
            isArray(mkrs) && this.addMarkers(mkrs);
          });

        /**
         * 添加要聚合的标记数组。
         * @param {Array<Marker>} markers 要聚合的标记数组
         *
         * @return 无返回值。
         */
        MarkerClusterer.prototype.addMarkers = function(markers) {
          for (var i = 0, len = markers.length; i < len; i++) {
            this._pushMarkerTo(markers[i]);
          }
          this._createClusters();
          var that = this;
          console.log(that);

          /*边界事件*/
          var _tempcluster = document.querySelectorAll(".clustererContent");
          var thatcluster = [].slice.call(_tempcluster);

          thatcluster.forEach(function(item) {
            var name = item.querySelectorAll("p")[0].innerText;
            console.log(name);

            // item.addEventListener("mouseover", function(a, b, c) {
            //   console.log(1);
            //   var name = this.querySelectorAll("p")[0].innerText;
            //   //生成行政区划

            //   var bdary = new BMap.Boundary();
            //   bdary.get(name || "成都市新都区", function(rs) {
            //     //获取行政区域
            //     // that._map.clearOverlays(); //清除地图覆盖物

            //     var svgs = document.querySelector("svg");
            //     if (svgs) {
            //       svgs.innerHTML = "";
            //     }

            //     var count = rs.boundaries.length; //行政区域的点有多少个
            //     if (count === 0) {
            //       alert("未能获取当前输入行政区域");
            //       return;
            //     }
            //     var pointArray = [];
            //     for (var i = 0; i < count; i++) {
            //       // var ply = new BMap.Polygon(rs.boundaries[i], {
            //       //   strokeWeight: 2,
            //       //   strokeColor: "#ff0000"
            //       // }); //建立多边形覆盖物
            //        var ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight: 2,fillColor:"#2d89f0", strokeColor: "#4783E7",fillOpacity: 0.2}); //建立多边形覆盖物

            //       that._map.addOverlay(ply); //添加覆盖物
            //       pointArray = pointArray.concat(ply.getPath());
            //     }
            //     // that._map.setViewport(pointArray); //调整视野
            //   });
            // });
            // item.addEventListener("mouseout", function() {
            //   console.log(2);
            //   var svgs = document.querySelector("svg");
            //   if (svgs) {
            //     svgs.innerHTML = "";
            //   }
            // });
          });
        };

        /**
         * 把一个标记添加到要聚合的标记数组中
         * @param {BMap.Marker} marker 要添加的标记
         *
         * @return 无返回值。
         */
        MarkerClusterer.prototype._pushMarkerTo = function(marker) {
          var index = indexOf(marker, this._markers);
          if (index === -1) {
            marker.isInCluster = false;
            this._markers.push(marker); //Marker拖放后enableDragging不做变化，忽略
          }
        };

        /**
         * 添加一个聚合的标记。
         * @param {BMap.Marker} marker 要聚合的单个标记。
         * @return 无返回值。
         */
        MarkerClusterer.prototype.addMarker = function(marker) {
          this._pushMarkerTo(marker);
          this._createClusters();
        };

        /**
         * 根据所给定的标记，创建聚合点
         * @return 无返回值
         */
        MarkerClusterer.prototype._createClusters = function() {
          var mapBounds = this._map.getBounds();
          var extendedBounds = getExtendedBounds(
            this._map,
            mapBounds,
            this._gridSize
          );
          for (var i = 0, marker; (marker = this._markers[i]); i++) {
            if (
              !marker.isInCluster &&
              extendedBounds.containsPoint(marker.getPosition())
            ) {
              this._addToClosestCluster(marker);
            }
          }

          // var len=this._markers.length;
          // for(var i = 0;i<len;i++){
          //    if(this._clusters[i]){
          //       this._clusters[i].render();
          //    }
          // }
        };

        /**
         * 根据标记的位置，把它添加到最近的聚合中
         * @param {BMap.Marker} marker 要进行聚合的单个标记
         *
         * @return 无返回值。
         */
        MarkerClusterer.prototype._addToClosestCluster = function(marker) {
          var distance = 4000000;
          var clusterToAddTo = null;
          var position = marker.getPosition();
          	  var _zoom = this._map.getZoom();
          for (var i = 0, cluster; (cluster = this._clusters[i]); i++) {
            var center = cluster.getCenter();
            if (center) {
              // var d = this._map.getDistance(center, marker.getPosition());
              // if (d < distance) {
              //   distance = d;
              //   clusterToAddTo = cluster;
              // }

              //增加社区

                var clusterType = marker.city;
                if(_zoom<14){
                  if (!marker.qu){
                      marker.qu = marker.qu;
                  }
                  clusterType = marker.qu;
                // }else if(_zoom>=14&&_zoom<=16){
                }else if(_zoom>=14&&_zoom<=17){
                    // if (marker.shequ){
                    // }
                    // clusterType = marker.shequ +"";  
                }
                if(clusterType == cluster.areatype){
                    clusterToAddTo = cluster;
                }else {
                   
                }


              //增加社区 



            }
          }
          if (
            clusterToAddTo 
            // &&
            // clusterToAddTo.isMarkerInClusterBounds(marker)
          ) {
            clusterToAddTo.addMarker(marker);
          } else {
            //单个标记
            var cluster = new Cluster(this);
            cluster.addMarker(marker);
            this._clusters.push(cluster);
          }
        };

        /**
         * 清除上一次的聚合的结果
         * @return 无返回值。
         */
        MarkerClusterer.prototype._clearLastClusters = function() {
          for (var i = 0, cluster; (cluster = this._clusters[i]); i++) {
            cluster.remove();
          }
          this._clusters = []; //置空Cluster数组
          this._removeMarkersFromCluster(); //把Marker的cluster标记设为false
        };

        /**
         * 清除某个聚合中的所有标记
         * @return 无返回值
         */
        MarkerClusterer.prototype._removeMarkersFromCluster = function() {
          for (var i = 0, marker; (marker = this._markers[i]); i++) {
            marker.isInCluster = false;
          }
        };

        /**
         * 把所有的标记从地图上清除
         * @return 无返回值
         */
        MarkerClusterer.prototype._removeMarkersFromMap = function() {
          for (var i = 0, marker; (marker = this._markers[i]); i++) {
            marker.isInCluster = false;
            this._map.removeOverlay(marker);
          }
        };

        /**
         * 删除单个标记
         * @param {BMap.Marker} marker 需要被删除的marker
         *
         * @return {Boolean} 删除成功返回true，否则返回false
         */
        MarkerClusterer.prototype._removeMarker = function(marker) {
          var index = indexOf(marker, this._markers);
          if (index === -1) {
            return false;
          }
          this._map.removeOverlay(marker);
          this._markers.splice(index, 1);
          return true;
        };

        /**
         * 删除单个标记
         * @param {BMap.Marker} marker 需要被删除的marker
         *
         * @return {Boolean} 删除成功返回true，否则返回false
         */
        MarkerClusterer.prototype.removeMarker = function(marker) {
          var success = this._removeMarker(marker);
          if (success) {
            this._clearLastClusters();
            this._createClusters();
          }
          return success;
        };

        /**
         * 删除一组标记
         * @param {Array<BMap.Marker>} markers 需要被删除的marker数组
         *
         * @return {Boolean} 删除成功返回true，否则返回false
         */
        MarkerClusterer.prototype.removeMarkers = function(markers) {
          var success = false;
          for (var i = 0; i < markers.length; i++) {
            var r = this._removeMarker(markers[i]);
            success = success || r;
          }

          if (success) {
            this._clearLastClusters();
            this._createClusters();
          }
          return success;
        };

        /**
         * 从地图上彻底清除所有的标记
         * @return 无返回值
         */
        MarkerClusterer.prototype.clearMarkers = function() {
          this._clearLastClusters();
          this._removeMarkersFromMap();
          this._markers = [];
        };

        /**
         * 重新生成，比如改变了属性等
         * @return 无返回值
         */
        MarkerClusterer.prototype._redraw = function() {
          this._clearLastClusters();
          //this._map.clearOverlays();
          this._createClusters();
          var that = this;

          /*边界事件*/

          var _tempcluster = document.querySelectorAll(".clustererContent");
          var thatcluster = [].slice.call(_tempcluster);

          thatcluster.forEach(function(item) {
            // var name = item.querySelectorAll("p")[0].innerText;
            // console.log(name);
            // item.addEventListener("mouseover", function(a, b, c) {
            //   console.log(1);
            //   var name = this.querySelectorAll("p")[0].innerText;
            //   //生成行政区划
            //   var bdary = new BMap.Boundary();
            //   bdary.get(name || "成都市新都区", function(rs) {
            //     //获取行政区域
            //     // that._map.clearOverlays(); //清除地图覆盖物
            //     var svgs = document.querySelector("svg");
            //     if (svgs) {
            //       svgs.innerHTML = "";
            //     }
            //     var count = rs.boundaries.length; //行政区域的点有多少个
            //     if (count === 0) {
            //       alert("未能获取当前输入行政区域");
            //       return;
            //     }
            //     var pointArray = [];
            //     for (var i = 0; i < count; i++) {
            //       // var ply = new BMap.Polygon(rs.boundaries[i], {
            //       //   strokeWeight: 2,
            //       //   strokeColor: "#ff0000"
            //       // }); //建立多边形覆盖物
            //       var ply = new BMap.Polygon(rs.boundaries[i], {
            //         strokeWeight: 2,
            //         fillColor: "#2d89f0",
            //         strokeColor: "#4783E7",
            //         fillOpacity: 0.2
            //       }); //建立多边形覆盖物
            //       that._map.addOverlay(ply); //添加覆盖物
            //       pointArray = pointArray.concat(ply.getPath());
            //     }
            //     // that._map.setViewport(pointArray); //调整视野
            //   });
            // });
            // item.addEventListener("mouseout", function() {
            //   console.log(2);
            //   var svgs = document.querySelector("svg");
            //   if (svgs) {
            //     svgs.innerHTML = "";
            //   }
            // });
          });

          /**/
          // this._mymap.hideloading()
          // this._mymap.inMaps()
        };

        /**
         * 获取网格大小
         * @return {Number} 网格大小
         */
        MarkerClusterer.prototype.getGridSize = function() {
          return this._gridSize;
        };

        /**
         * 设置网格大小
         * @param {Number} size 网格大小
         * @return 无返回值
         */
        MarkerClusterer.prototype.setGridSize = function(size) {
          this._gridSize = size;
          this._redraw();
        };

        /**
         * 获取聚合的最大缩放级别。
         * @return {Number} 聚合的最大缩放级别。
         */
        MarkerClusterer.prototype.getMaxZoom = function() {
          return this._maxZoom;
        };

        /**
         * 设置聚合的最大缩放级别
         * @param {Number} maxZoom 聚合的最大缩放级别
         * @return 无返回值
         */
        MarkerClusterer.prototype.setMaxZoom = function(maxZoom) {
          this._maxZoom = maxZoom;
          this._redraw();
        };

        /**
         * 获取聚合的样式风格集合
         * @return {Array<IconStyle>} 聚合的样式风格集合
         */
        MarkerClusterer.prototype.getStyles = function() {
          return this._styles;
        };

        /**
         * 设置聚合的样式风格集合
         * @param {Array<IconStyle>} styles 样式风格数组
         * @return 无返回值
         */
        MarkerClusterer.prototype.setStyles = function(styles) {
          this._styles = styles;
          this._redraw();
        };

        /**
         * 获取单个聚合的最小数量。
         * @return {Number} 单个聚合的最小数量。
         */
        MarkerClusterer.prototype.getMinClusterSize = function() {
          return this._minClusterSize;
        };

        /**
         * 设置单个聚合的最小数量。
         * @param {Number} size 单个聚合的最小数量。
         * @return 无返回值。
         */
        MarkerClusterer.prototype.setMinClusterSize = function(size) {
          this._minClusterSize = size;
          this._redraw();
        };

        /**
         * 获取单个聚合的落脚点是否是聚合内所有标记的平均中心。
         * @return {Boolean} true或false。
         */
        MarkerClusterer.prototype.isAverageCenter = function() {
          return this._isAverageCenter;
        };

        /**
         * 获取聚合的Map实例。
         * @return {Map} Map的示例。
         */
        MarkerClusterer.prototype.getMap = function() {
          return this._map;
        };

        /**
         * 获取所有的标记数组。
         * @return {Array<Marker>} 标记数组。
         */
        MarkerClusterer.prototype.getMarkers = function() {
          return this._markers;
        };

        /**
         * 获取聚合的总数量。
         * @return {Number} 聚合的总数量。
         */
        MarkerClusterer.prototype.getClustersCount = function() {
          var count = 0;
          for (var i = 0, cluster; (cluster = this._clusters[i]); i++) {
            cluster.isReal() && count++;
          }
          return count;
        };

        /**
         * @ignore
         * Cluster
         * @class 表示一个聚合对象，该聚合，包含有N个标记，这N个标记组成的范围，并有予以显示在Map上的TextIconOverlay等。
         * @constructor
         * @param {MarkerClusterer} markerClusterer 一个标记聚合器示例。
         */
        function Cluster(markerClusterer) {
          this._markerClusterer = markerClusterer;
          this._map = markerClusterer.getMap();
          this._minClusterSize = markerClusterer.getMinClusterSize();
          this._isAverageCenter = markerClusterer.isAverageCenter();
          this._center = null; //落脚位置
          this._markers = []; //这个Cluster中所包含的markers
          this._gridBounds = null; //以中心点为准，向四边扩大gridSize个像素的范围，也即网格范围
          this._isReal = false; //真的是个聚合
          this._styles = markerClusterer.getStyles();
          this._labels = [];
          this._clusterMarker = new BMapLib.TextIconOverlay(
            this._center,
            { name: this._name, value: this._markers.length },
            { styles: this._markerClusterer.getStyles() }
          );
          //this._map.addOverlay(this._clusterMarker);
        }

        /**
         * 向该聚合添加一个标记。
         * @param {Marker} marker 要添加的标记。
         * @return 无返回值。
         */
        Cluster.prototype.addMarker = function(marker) {
          if (this.isMarkerInCluster(marker)) {
            return false;
          } //也可用marker.isInCluster判断,外面判断OK，这里基本不会命中

          if (!this._center) {
            this._center = marker.getPosition();
            this.updateGridBounds(); //
          } else {
              if (this._isAverageCenter) {
                var l = this._markers.length + 1;
                var lat =
                  (this._center.lat * (l - 1) + marker.getPosition().lat) / l;
                var lng =
                  (this._center.lng * (l - 1) + marker.getPosition().lng) / l;
                this._center = new BMap.Point(lng, lat);
                this.updateGridBounds();
              } //计算新的Center
            
          }

          marker.isInCluster = true;
          this._markers.push(marker);

          var len = this._markers.length;
          if (len < this._minClusterSize) {
            this._map.addOverlay(marker);
            //this.updateClusterMarker();
            return true;
          } else if (len === this._minClusterSize) {
            for (var i = 0; i < len; i++) {
              this._markers[i].getMap() &&
                this._map.removeOverlay(this._markers[i]);
            }
          }
          this._map.addOverlay(this._clusterMarker);
          this._isReal = true;
          this.updateClusterMarker();
          return true;
        };

        /**
         * 判断一个标记是否在该聚合中。
         * @param {Marker} marker 要判断的标记。
         * @return {Boolean} true或false。
         */
        Cluster.prototype.isMarkerInCluster = function(marker) {
          if (this._markers.indexOf) {
            return this._markers.indexOf(marker) != -1;
          } else {
            for (var i = 0, m; (m = this._markers[i]); i++) {
              if (m === marker) {
                return true;
              }
            }
          }
          return false;
        };

        /**
         * 判断一个标记是否在该聚合网格范围中。
         * @param {Marker} marker 要判断的标记。
         * @return {Boolean} true或false。
         */
        Cluster.prototype.isMarkerInClusterBounds = function(marker) {
          return this._gridBounds.containsPoint(marker.getPosition());
        };

        Cluster.prototype.isReal = function(marker) {
          return this._isReal;
        };

        /**
         * 更新该聚合的网格范围。
         * @return 无返回值。
         */
        Cluster.prototype.updateGridBounds = function() {
          var bounds = new BMap.Bounds(this._center, this._center);
          this._gridBounds = getExtendedBounds(
            this._map,
            bounds,
            this._markerClusterer.getGridSize()
          );
        };

        /**
         * 对于单个点添加label
         */
        Cluster.prototype.addLabel = function(marker) {
          //获取marker的坐标
          var position = marker.getPosition();
          //创建label
          var label = new BMap.Label({ position: position });
          label.setStyle({
            height: "25px",
            color: "#fff",
            backgroundColor: this._styles[0].backgroundColor,
            border: "none",
            borderRadius: "25px",
            fontWeight: "bold"
          });
          //var content = '<span style="color:'+this._styles[0].backgroundColor+'"><i class="fa fa-map-marker"></i></span>'+'<p style="padding:0px 13px;text-align:center;margin-top:5px;">哈哈这是一sssssssssssssss个点</p>';
          // var content =
          //   '<span style="color:' +
          //   this._styles[0].backgroundColor +
          //   '"><i class="fa fa-map-marker"></i></span>' +
          //   '<p style="padding:0px 13px;text-align:center;margin-top:5px;">' +
          //   marker.getTitle() +marker.count
            // "</p>";
            if(marker.xiaoqucount){
                var content =
                '<span style="color:' +
                this._styles[0].backgroundColor +
                '"><i class="fa fa-map-marker"></i></span>' +
                '<p style="padding:0px 13px;text-align:center;margin-top:5px;">' +
                marker.getTitle()+"</p>";
            }else{
                  var content =
                '<span style="color:' +
                this._styles[0].backgroundColor +
                '"><i class="fa fa-map-marker"></i></span><p style="padding:0px 13px;text-align:center;margin-top:5px;">' +
                marker.getTitle() +
                "</p>";
            }

          console.log("加了：" + marker.getTitle());
          label.setContent(content);
          label.setPosition(position);
          label.setTitle(marker.name+','+marker.id);
          // label.setOffset(new BMap.Size(0, 0));

          // //给label添加click 事件
          // label.addEventListener("click", function(e) {
          //   console.log(3);
          //   //bianji
          //   //针对某些负责的infowindow,采用单独的组件进行绘制，且改种形式，地图移动infowindow,不会随之移动 
          //   if(true){
          //     e.currentTarget.getTitle();
          //     this._data
          //     eventBus.$emit(eventCollection._mapMaker2Pop, {
          //       data: this._data,
          //       opt: this._opt
          //     });
          //     return;
          //   }
            

          //   // //图片加载完毕重绘infowindow
          //   // if (document.getElementById("imgDemo"))
          //   //   document.getElementById("imgDemo").onload = function() {
          //   //     infoWindow.redraw(); //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
          //   // };

          // }.bind({_this:this,_data:marker,_opt:3,}));




          this._labels.push(label);
          this._map.addOverlay(label);



        };
        /**
         * 更新该聚合的显示样式，也即TextIconOverlay。
         * @return 无返回值。
         */
        Cluster.prototype.updateClusterMarker = function() {
          if (this._map.getZoom() > this._markerClusterer.getMaxZoom()) {
            // if (this._map.getZoom() == 13 || this._map.getZoom() == 14) {
            if (this._map.getZoom() >= 14) {
              //重新聚合
              console.log("重新聚合:");
              console.log(this);
              this._clusterMarker &&
                this._map.removeOverlay(this._clusterMarker);
              //
              for (var i = 0, marker; (marker = this._markers[i]); i++) {}
              //找到移除行政区

              var svgs = document.querySelector("svg[version='1.1']");
              if (svgs) {
                svgs.innerHTML = "";
              }

              // return;
            } else {
            }

            this._clusterMarker && this._map.removeOverlay(this._clusterMarker);
            for (var i = 0, marker; (marker = this._markers[i]); i++) {
              //this._map.addOverlay(marker);
              this.addLabel(marker);
            }
            return;
          } else {
          }

          if (this._markers.length < this._minClusterSize) {
            this._clusterMarker.hide();
            return;
          }

          this._clusterMarker.setPosition(this._center);


         //增加社区

          
          var zoom = this._map.getZoom()
          var _belongText = "";
          var _qucode = this._markers[0].qucode;
          var _shequcode = this._markers[0].shequcode;
          var shequcount="";
          var xiaoqucount="";
          if(zoom<14){
              _belongText = this._markers[0].qu    
           // }else if(zoom>=14&&zoom<=16){
          }
          // else if(zoom>=14&&zoom<=17){
          //     _belongText = this._markers[0].shequ +"";  
          //     //  shequcount=this._markers[0].shequcount +"人"
          //       shequcount=""||this._markers.length //+"个小区"
          //     // } else if (zoom>16) {
          // } 
          else if (zoom>=14) {
              for (var i=0;i<this._markers.length;i++){
                  if(this._markers[i].name) {
                      _belongText = this._markers[i].name
                      break;
                  }
              }
              if (!_belongText){
                  _belongText = this._markers[0].name 
              }
                //  xiaoqucount=this._markers[0].xiaoqucount +"人"
          }
          this.areatype =_belongText;




         //增加社区 






          this._markerClusterer._name=_belongText;
          this._markerClusterer._qucode=_qucode;
           this._markerClusterer._shequcode=_shequcode;

          //  this._clusterMarker.setText({name : '共找到' , value : this._markers.length});
          this._clusterMarker.setText({
            name: _belongText||this._markerClusterer._name,
            value: shequcount||xiaoqucount||this._markers.length || "人口：8, 车辆 ：88"
          });
          var thatMap = this._map;
          this._clusterMarker._qucode=_qucode;
           this._clusterMarker._shequcode=_shequcode;
          // var thatMc=this._markerClusterer;
          var thatBounds = this.getBounds();
          var center = this._center;
          // var clickEvent= function(event) {
          //   //这个方法容易造成晃动
          //   //thatMap.setViewport(thatBounds);
          //   //console.log(center);
          //   var zoom = thatMap.getZoom();
          //   // zoom = zoom > 13? zoom : 13;
          //     //  thatMap.setZoom(zoom);
          //   if(zoom<=13){
          //     //区到社区
          //     thatMap.setZoom(14);
          //   }else if(zoom>=14){
          //     //社区到小区
          //    thatMap.setZoom(17);
          //   }
         
          //   thatMap.setCenter(center);


          //    console.log("聚合物click事件");
          //    var name=event.target._text.name;
          //    var code="510704000000";
          //   console.log( event.target._text.name);
          //    //触发右侧数据变化 
          //   //  this._markerClusterer._vuecomp.$parent.$children[2].$el;
          //      if(name=="涪城区"){
          //         code="510704000000";
          //      }else if(name=="游仙区"){
          //        code="510704000000";
          //      }
          //      else if(name=="安州区"){
          //        code="510704000000";
          //      }else{

          //      }

          //    eventBus.$emit(eventCollection._map2ybsstj,  {
          //       id: this._markerClusterer._qucode,
          //     });


          //   // this._markerClusterer._vuecomp.$parent.$children[2].fetchChartData("510704000000");//510704000000
          //   // this._markerClusterer._vuecomp.$parent.$children[3].fetchChartData("510704000000");//510704000000
          //   // this._markerClusterer._vuecomp.$parent.$children[4].fetchChartData("510704000000");//510704000000



          // }.bind(this);
         
         //对于同一个聚类，避免重复绑定click事件
          if(this._markers.length>1){
               return;
          }

          function clickEvent(event) {
            //这个方法容易造成晃动
            //thatMap.setViewport(thatBounds);
            //console.log(center);
            var zoom = thatMap.getZoom();
            // zoom = zoom > 13? zoom : 13;
              //  thatMap.setZoom(zoom);
            if(zoom<=13){
              //区到社区
              thatMap.setZoom(14);
              // eventBus.$emit(eventCollection._map2ybsstj,  {
              //   id: this._qucode,
              // });
            }else if(zoom>=14){
              //社区到小区
            //  thatMap.setZoom(17);
             thatMap.setZoom(18);

              
            }
         
            thatMap.setCenter(center);


             console.log("聚合物click事件");
             var name=event.target._text.name;
             var code="510704000000";
            console.log( event.target._text.name);
             //触发右侧数据变化 
          
               if(name=="涪城区"){
                  code="510704000000";
               }else if(name=="游仙区"){
                 code="510704000000";
               }
               else if(name=="安州区"){
                 code="510704000000";
               }else{

               }

              

          };
          // this._clusterMarker.removeEventListener("click",clickEvent);
          this._clusterMarker.addEventListener("click",clickEvent);
        };

        /**
         * 删除该聚合。
         * @return 无返回值。
         */
        Cluster.prototype.remove = function() {
          for (var i = 0, m; (m = this._labels[i]); i++) {
            this._map.removeOverlay(m);
          } //清除散的标记点

          this._map.removeOverlay(this._clusterMarker);
          this._markers.length = 0;
          delete this._markers;
        };

        /**
         * 获取该聚合所包含的所有标记的最小外接矩形的范围。
         * @return {BMap.Bounds} 计算出的范围。
         */
        Cluster.prototype.getBounds = function() {
          var bounds = new BMap.Bounds(this._center, this._center);
          for (var i = 0, marker; (marker = this._markers[i]); i++) {
            bounds.extend(marker.getPosition());
          }
          return bounds;
        };

        /**
         * 获取该聚合的落脚点。
         * @return {BMap.Point} 该聚合的落脚点。
         */
        Cluster.prototype.getCenter = function() {
          return this._center;
        };


        // Cluster.prototype.render = function() {
        //     var len = this._markers.length;
        //     if(len < this._minClusterSize ){  
        //       for(var i=0;i<len;i++){
        //         this._markers.addEventListener('click',function(e){
        //            //自定义监听点击单个点是事件
        //            console.log(2222222222222222222);
        //         });
        //         this._map.addOverlay(marker);
        //       }   
                
               
        //     }  else{
        //         this._map.addOverlay(this._clusterMarker);
        //         this._isReal = true;
        //         this.updateClusterMarker();
        //     }
          
        // };



      })();
    },

    //生成随机色
    initRandomColor() {
      var r = Math.floor(Math.random() * 256);
      var g = Math.floor(Math.random() * 256);
      var b = Math.floor(Math.random() * 256);
      return "rgb(" + r + "," + g + "," + b + ")"; //所有方法的拼接都可以用ES6新特性`其他字符串{$变量名}`替换
    }

   
  }
};
</script>

<style>
.mapContainer {
  position: relative;
  height: 100% !important;
  width: 100%;
}
.bm-view {
  width: 100%;
  height: 100%;
}

.popover-info {
    width: 430px;
    height: 260px;
    box-shadow: 0px 0px 10px #ccc;
    margin-left:50%;
}
.popover-title {
    height: 30px;
    line-height: 30px;
    padding-left: 10px;
    margin: 0;
    background: #13b1e1;
    color: #fff;
}
.popover-title .close {
    color: #fff;
    font-size: 18px;
    float: right;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
}
.popover-content {
    height: calc(100% - 40px);
    overflow: hidden;
    overflow-y: auto;
    background: #fff;
    padding-top: 5px;
}
.popover-content-left {
    width: 105px;
    height: calc(100% - 6px);
    overflow: hidden;
    display: inline-block;
    vertical-align: top;
    padding-left: 5px;
}
.popover-content-right {
    width: 285px;
    height: calc(100% - 6px);
    overflow: hidden;
    display: inline-block;
}
.popover-content .spandiv {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: default;
}
.popover-content .spandec {
    padding-left: 10px;
}
.popover-content .spanbutton {
    padding-left: 10px;
    color: #13b1e1;
    cursor: pointer;
  }
.popover-content .spantext {
    padding: 0 5px;
}
.popover-content .row {
    padding: 0;
    line-height: 30px;
}
.BMap_cpyCtrl {
  display: none;
}
.anchorBL a {
  display: none;
}
.mapSelfNavigation {
  position: absolute;
  top: 70px;
  left: 50px;
  /* background-color: white;
  border: 0.3px solid #d6d0d0; */
  padding-top: 4px; 
}
.selfnavigation{
  margin-bottom: 6px;
  padding: 5px 5px;
  /* background-color: #2fb089; */
  cursor: pointer;
  color: white;

  /* height: 30px;
  width: 56px; */
  height: 21px;
  width: 41px;
 
}
.xiaoqu{
 background-image: url(../../../static/image/bmap/xiaoqu.png)
}
.shequ{
 background-image: url(../../../static/image/bmap/shequ.png)
}
.quxian{
 background-image: url(../../../static/image/bmap/quxian.png)
}

.gsInfo {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: white;
  border: 0.3px solid #d6d0d0;
  padding-top: 4px;
}

.mapKakouTool {
  position: absolute;
  bottom: 80px;
  right: 20px;
  /* background-color: white;
  border: 0.3px solid #d6d0d0; */
  padding-top: 4px;
}
.mapCoordinate {
  position: absolute;
  bottom: 5px;
  right: 20px;
  background-color: white;
  /* border: 0.3px solid #d6d0d0; */
  padding-top: 4px;
  color: #06253d;
}
.mapZHZZTool {
  position: absolute;
  top: 20px;
  left: 380px;
  background-color: #1a5b8e;
  border: 0.3px solid #d6d0d0;
  padding-top: 4px;
  height: 300px;
  border: 0px #1a5b8e;
}
.mapTool_bottomright {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: white;
  border: 0.3px solid #d6d0d0;
  padding-top: 4px;
}
.coordinate {
  position: absolute;
  top: 20px;
  left: 100px;
}


.toolSelect {
  color: #12b1e1;
}

.BMapLabel {
  background-color: #2d89f0 ;
  /* !important */
  transition: all 0.2s;
}
.BMapLabel .labelicon {
  position: absolute;
  left: -20px;
  top: 25px;
  width: 30px;
  height: 40px;
}
.BMapLabel .person {
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAoCAYAAAB0HkOaAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo5YTdlMjFhMi01MmIzLTQ3NDUtYjQ1Ny1iZTQ5NzA2OGE3Y2IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDNCNzIzQzIzQzY3MTFFODk0NEFCQTUyNzYxNTM4QjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDNCNzIzQzEzQzY3MTFFODk0NEFCQTUyNzYxNTM4QjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjQ2MGRkNWI0LTFhMzUtZjU0YS1hYTllLWYzOTM1ODY0OGI2MSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5YTdlMjFhMi01MmIzLTQ3NDUtYjQ1Ny1iZTQ5NzA2OGE3Y2IiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7T4nEPAAAG80lEQVR42uxYa2xURRQ+d3fvPrt9gm2hAkuDtaXS2gZQRBGqQZGIKSIBok2UBBGfiSEapBEkggkJKpiIxAcRTUBbQGmlShVQK6/aF/RBSx+ktNvnbrvd593d65m7c/fRdtfd4o/+cJJvZ/bemXO/e843Z2Yuw/M8TJYigUlUJhUZWaib6e/pxWY8Ih+Rh8hCpCC0CBOiE1GDKEcUIwbFQQ3bkyIiw4iasXBjb+bu0Sdj9S6iAKEIw54d8RViR+VbSd3+N9TsbZBBIs9j9REiagIeH0G8joQ+vy0ySEKK1YeIl/07piWysGKuErJT5JAYLYVYFQNGKw89wy6o7nRA6TUbNPWMce8BSsoVDpmxmuH5/fi7Wfw7PVYKb+RFw8N3KYEZ1XVqFIOQQOY0FjYs0MDZ6zbYVz4Mt4wusQt5IfJyL0Wsmdzd3Zuw+al4c9FsBex+Kg6iFEz48bHz8PYJA1S02v0vv9hQmHwwbDLpO7tmYHVN1MiSOUrYuzoeJEzkgnGjyTeLBuFcs028ZEZkNBROuxluntkhEpkRL4NdT8ZNiIhgFMeR8TPjvSrQUPv/7pn0nbcSab4QRu9fm4AhUo7pPGhxw4+1ViiutoAUn5ifrYKV96hQzOPnzopWG7xydED86yQSbCic3htawDw8LbbTk9gAIiSIl9vtUFRlEQTqdPsG7yvn4MBZE+SlKSH/XjXkzJAHiJzYScdZ2KAXZplMydgK9uzZTbTDUbjoIwJm0yPihccz1X5esKAXzNBpcAZ1LYfmTtebBZCw5GdrYOU8tddbj81VI5khoS0HxxqSmBHEXf0IA81JDiI1SobPFI1nYR4hZc1nejBa3BFppWOAQ28Z4euLJih7NdmTt2bKvS/PAZtG3pcuI4QIEXQLog1hFD3jXURIQiPl+KYkOFVnhuIqM7T1c2GRSZ3Kgo3j4ZsXEsGXp3ypzMGzRMhpVD9khukoyCyuETWjEgckaDxkotHN6xdoYVWWBo5eMQmEztRbwOEK3P8oZAw8mqEB3RQW1i/UQsEXetAqfYKOJm06xA0SYlxFXaWii20s6SaYomEyEh6epOX2GKBlyOqGT34dFB5WsEgrCLS80SJM32V3a4DMxl9QL6dqhmF1ThT+DwztsM3tDZMMOFF8DNWrlNYEnOjDDpEMEWtGstx/fcBXckFbrwsO9doET+RlRAmJ7cvzAwGeKroyBM3dVqhst0LuLI+zb/mJX81YbKNTi6Brj3dSaJj4SvzNIc2qm/YAMrEqKSYjF4i7UzvqvrTaOG6i06FmVDIeEqKk3uuVaE8cHCsxWsbLdZRQHI0Hf8rjSh5OXx0J6KlWSODZ+2PQO1xIbHo4HpakRcGG+2Jg1hTfy5QJ9jy2p0u7DCFWApkYpjIE2dYl1Xc7oOKGFRalejUNry1Pgvk6NZy40g81HWboN3HA4PskxshhYaoWVuYkQI7Os+3ZnHeHLwOjHWLPEyKrLVXaNhiEDGHL+RbKwvatWH1A2jMTWDiyMRnU8olvka04xTcc6hJyj5C/2Kvt2WxdV5DuhHGL39P4jxGthGTHgAPeOd4niHQihYzbVtwr2CH2NIzZmsnW64N1p1n4mpdM5XadDYW2DuEggjvXZIat3/WAxRFZFib9yTgyntiR8C7+AfnFZhm43EHCY0U0Ic4HxKGycPYlvL9FFNxvjSOw7mAn1uawiJB+nv4+0ebIa1uTpT0jQTxCZlcjogRxfdwNee6OlkNYbQzYAycpYMU8rZA/UuJYIcuaMKF1Gjghr5TWmqBJH7C7g1myzp4lyr9ujOMNF12f6hGlxA9keQhybuK3MMBn8cDMF6806W0Cwi1xkiHTYuWl1nG8QRj3If6mZy3iGWLYLfE/Soho2DXHoWEszzC8u19IWBFCAXZuqbKiSQre9MzT/QuZ2rWI7xHHEFepZtwhj7erNT91oFEiaGckRPAF+MXKy01aidlBTbnoCk22CT8jjiDO0J2lw39zFSqR8Gu1JeVysG8DsviFiXnyhvYUmX6YPoSEpAdxAfEtPf7WkfWTkgz/4H94aBW/Lrpkr4xxHhNnRyjcyXb3ZSsbu+h+xUgFepISqaBZnvP3RtgH/4KYk4Lo4iWGjf3O2Azcj2QG6xsjHTE/qKpsptOVeKMK8SeimXrCeVtfIQ4bnhCbJq3Ekj/iVl1EVcSN7idnnNxS9eValnH20AT2B/0y0TdaFxMmUxBX4v+35Zhx2XNWt+Kkf3gxBfALNXUX0DPVdLpeontbizhL/pPvM4cHlgcIuiChrKTI8NAaGy9/38VLdCqJXZ+h7Phhtrzrd7x/g27SjDhOCAn2n9j3mdEFzzehTqEKekqU0Vlhp/nCGW5IIiLz/wfGyUTmHwEGAPKGNEe/aH5vAAAAAElFTkSuQmCC")
    no-repeat;
}
.BMapLabel .labelname {
  padding: 0px 13px;
  text-align: center;
  margin-top: 5px;
}
.BMapLabel.active {
  background-color: #ec2323 !important;
  border-color: #ec2323 !important;
  z-index: 99999 !important;
}
.BMapLabel.active .person {
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAoCAYAAAB0HkOaAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo5YTdlMjFhMi01MmIzLTQ3NDUtYjQ1Ny1iZTQ5NzA2OGE3Y2IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDJFMTg0MkEzQzY3MTFFODk0NEFCQTUyNzYxNTM4QjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDJDQzI3NzIzQzY3MTFFODk0NEFCQTUyNzYxNTM4QjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjQ2MGRkNWI0LTFhMzUtZjU0YS1hYTllLWYzOTM1ODY0OGI2MSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5YTdlMjFhMi01MmIzLTQ3NDUtYjQ1Ny1iZTQ5NzA2OGE3Y2IiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7czLMEAAAG9ElEQVR42uxYaWwUZRh+Z3a3xx7QC9pCoRex9FyllUMCWmgByxE5wymHJKD1BwatPzRRoghqPDByGCQoyBECNZRKi1ILRA2WFlqgpZWW3i3l2LbbvbrHjO83++10e+x22/gDo5M8/WZnvu+dZ97jeb8pw/M8PCkHC0/QIXV3syUuhAwBiCWI2Qg1IgyhQnQhmhBliAJENkLjvH5Mxf0hkWGaY4PBr6z/og51SCgO7yPWI7w9sNWN+A6xA+21Ot+QyzwkQ3LGYOlHZBMOexDKYXhbh9iGhA4NmYyzZ5CEBIcvEa87T5LEJIDXwmUgfXoyMCFjgPULBK7jMfD3W8BaWgTmc6fBVnW7r+2vKSnbsDzTrg7dh8OrYnaHhYN8+3sgS52HMxnXVtCGpTAfDJ/tAK6p3vnOfv+y1tc8JtMUGwK4gBDZgr8POG7IpqeC4pMDwChHeBwfXqcFfdZWsPxe6Hx569iK1m889kxT3JjxeF7uyBGvF+aA8gsMOSsZesZwNtC98QqYL/3suKJHxIVVtDQMqjON8WOBZ5gdCCUC2PAoUOzaOzwigkWJsJ6NiCZ2CRTEvkdLeWCCEWsRQCB/+0Ng5Ir+IdA8gu7De0G7YCpoF02H7iP7ge/QDOxuXC/P+gAcNon9hviw0YOGqS4uLJNmPkjjEsH/+PleiWkt+g26Tx8F86/5ANY+GiCTgVfaAvBethakydP6JXn76gywVtwSzk0+vlk/Lt9IcsdCYSNP6KPATJrjh0/GEnvYiRdyToHpzDGwNTpVB9MndFYOjPk5AiQYXp+la8B70XIs/QC7vRcXg67CXvI2qWwxDqWITqrUHVSTzOSRAhmkliAyUycLo2ZJGuqIZkjti6uvA8vnO0F/5CAEXSy2Oy55qvjqEoslBocU6hUjog1Ri6inxGxSTK4QUdxQ0IRmdPYSGHOzQX/mJFhrqz1rchOeAt5kgoDjOT0JGTZeSGLhvtWiclJ0P0QgYiyCtB0Syxb0DOsrLg4Mso8j/UCxZhP4vrQCdCePgqW2BowX84A3m3snnLcPyOdkgDQyGlSrN0Dby0uBVfXoEjtiJHrG7lmG69WUGdrvyAN96PlVKQdMB2UJnE4nGBBd39kJmn17QIYPU27YKiSooeACPoUF+ax0If30v+SBJfcsKJeuxMD3Dimn7cRrds/YJFKTiy0M8Vgk4hF6hql3kLE2NYAXVpTzYQMJ2GrrwHTwgOAJ5ex04DkONIcPOXlKAtozp8B4txqMJdfAN/lZ+9rmRqG0aTV1uqpoGr5xJGdK8GQSuWq+UdyLDOvnBxwRP8duEB/emfeTkxnqCfSULCoa27MCJDTUAoGSIjFn9EpVm5uUI2WqIKKX6xAnfd653j5E437rNgrud4eALZmgmJkKI9esB6+ISHG9IT9XFL620LAad22NBEaSOTqwDl9xM0Jpe/gAvBPVIB0XLs5STJkGvglJwHd3A9elBc5gEHJHhnsv1aw0CN6eBSPmL7TvW1Im93jljyug/f5bIQpmL5+OazNnXeBZlnezMasjOUNOvkB8LGjMpzsh9FgKSrq8h9Bz0wV43L2NRsGOI19axkcU2yQSzpVEIbSIBjb2VhWJ61eIeyS+5oZ6ePjum0L3HdaB6x6+s12wQ+yZfH015ZNSrrsJj4F4BdHIlifFQkRJpQnfYhXCLOTO5UJoy9pmD8lQeOB8so6sJ3Y4hrXdSp6SY5F5WV0QMVEFJqLXycbfvCPciSy5U4QGMsVkLiyA5lWLcbzoEREyzz6/QEzaexPj8lvCI1pchIb0pbuIaySSJIGZm4lxEF1SLs6qSY4/iMNm55XeMRNBmbEI9SMFZCjxrEqFydwFFtQlY0kx6M7nQHdVZa+nPQ4OLr06O/38QFVDm2W1ow3QfsX3+zqoTk7wwuEyYupwP8aMCkXzlfkLfrBJpbY+3tDTBllJybQ7byWkN9UJffWQyOpyBGm9wUMlYpXJ9CUzn892IsLTbQLZBhCtqaKEjI6tg9hsk8puD2SzqUyduAJHkjAyj0uaYTisnGytv3+Xg5vTlydJzkZaxv02VgKZUnWSq5ZxBf+8Rb+jPDoaoycUNEdFNdI3JpXyAPEXDcljKm6826+DgY7du3fBvBMnyOkRxLrBiLSPGnX7z7S0szQZO+jGieRGK9WSQYVLekOtHvDGXOEVBAXFvYOwG3zGlRGTXN52fcaMXBqCFkqijlaN1Z03PPbM3BMnHT8jqB4E9Z2HMm8oTk3d1zEqqIbqBgnLIxoSbkj/EnHnGaeDvOVqRB5t92K51sVO3ItECuic+1TMhtVLPPWM48CPbvgIEYMduBKrZvfVOemXqBdIqVpxjWjwwqqV/wyZ//y/0f4n868g87cAAwAoaMPQeNDnGQAAAABJRU5ErkJggg==")
    no-repeat;
}
.BMapLabel span{
  left: 30px;
  top: 22px;
}
.clustererContent {
  transition: all 0.3s;
}

</style>