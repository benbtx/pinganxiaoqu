<template>
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
      @mousemove="syncGraph"
      @click="paintGraphs"
      @rightclick="newGraph"
    >
      <bm-navigation v-if="default_config.isShowNavigation" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
      <bm-scale v-if="default_config.isShowScale" anchor="BMAP_ANCHOR_BOTTOM_LEFT"></bm-scale>
      <bm-polygon
        :path="path"
        v-for="path of polygon.paths"
        :key='path.lng+","+path.lat+Math.random()'
      ></bm-polygon>

      <bm-polyline
        :path="path"
        v-for="path of this.paintGraph.drawPoline.paths"
        :key='path.lng+ ","+path.lat+Math.random()'
      ></bm-polyline>

      <bm-circle
        :center="this.paintGraph.drawCircle.center"
        :radius="this.paintGraph.drawCircle.radius"
        stroke-color="blue"
        :stroke-opacity="0.5"
        :stroke-weight="2"
      ></bm-circle>

      <bm-polygon
        name="juxing"
        :path="this.paintGraph.drawRec.paths"
        stroke-color="blue"
        :stroke-opacity="0.5"
        :stroke-weight="2"
      />

      <bm-polygon
        :path="this.paintGraph.drawPolygon.paths"
        stroke-color="blue"
        :stroke-opacity="0.5"
        :stroke-weight="2"
      />
    </baidu-map>

    <div class="mapKakouTool" v-show="showKaKouTool">
      <div class="pointSelect tool" title="拖拽" @click="toggle('drag')">
        <i class="fa fa-hand-pointer-o fa-lg" style="color:#333;margin-left: 5px;"></i>
      </div>
      <div class="pointSelect tool" title="点选" @click="toggle('point')">
        <i class="fa fa-map-marker fa-lg" style="color:#333;margin-left: 8px;"></i>
      </div>
      <div class="boxSelect tool" title="框选" @click="toggle('polygon')">
        <i class="fa fa fa-square-o fa-lg" style="color:#333; margin-left: 6px;"></i>
      </div>
    </div>
    <div
      class="mapCoordinate"
    >{{default_config.currentPoint.lng.toFixed(4)+","+default_config.currentPoint.lat.toFixed(4)}}</div>
    <div>
        <el-dialog ref='wzqy_dia' id='wzqy_dialog' title="位置迁移" :visible.sync="dialogVisible" width="20%"  @close="handleClose"  class="modal-popover">
          <!-- <div class style="height:200px">
            <span>这是一段视频</span>
          </div> -->

          <div  class="row" style='margin-bottom: 10px;'>
                <div  class="col-md-6 spandiv">
                  <span  class="spandec lng">经度：
                        <el-input  placeholder="请输入内容" style='width: 100px;'>104.32</el-input>
                    </span>
                </div>
                <div  class="col-md-6 spandiv">
                  <span  class="spandec lat">纬度：
                      <el-input  placeholder="请输入内容" style='width: 100px;'>31.69</el-input>
                    </span>
                </div>
                
          </div>
          <div  class="row" style='margin-bottom: 10px;'>
                <div  class="col-md-12 spandiv">
                  <span  class="spandec address">地址：
                    <el-input placeholder="请输入内容" style='width: 250px;'></el-input>
                    </span>
                </div>
                
                
          </div>

          <span slot="footer" class="dialog-footer">
                          <el-button @click="dialogVisible = false">取 消</el-button>
                          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>

       
        
    </div>
    <!-- <iframe width=0 height=0 id="url"></iframe> -->
  </div>
</template>

<script>
import { BaiduMap } from "vue-baidu-map";
import eventBus from "@/event";
import { eventCollection } from "@/event/resources";
import { shipinApi, excontrolApi } from "@/https";
import { BmNavigation } from "vue-baidu-map";
import { BmScale } from "vue-baidu-map";

import { BmMarker } from "vue-baidu-map";
import { BmlMarkerClusterer } from "vue-baidu-map";
import { BmPolygon } from "vue-baidu-map";
import { BmPolyline } from "vue-baidu-map";
import { BmCircle } from "vue-baidu-map";
import { BmControl } from "vue-baidu-map";
import { BmDriving } from "vue-baidu-map";
// import { pictoolMixin } from '@/mixins/pictoolMixin';

export default {
  name: "baidumap",
  // mixins: [pictoolMixin],
  data() {
    return {
      BMap: null,
      map: null,
      // idx: 0,
      InteractList: [], //当前交互数据，包括卡口、警告
  drivingRoute:null,
      default_config: {
        // center: { lng: 104.664602, lat: 31.469322 },
        center: { lng: 104.7510, lat: 31.4635 },
        zoom: 15,
        isdragging: true,
        currentPoint: { lng: 104.072314, lat: 30.663207 },
        isShowNavigation: true,
        isShowScale: true
      },
      bmapImg: {
        kakou: "../../../static/image/bmap/kakou.png",
        hlkakou: "../../../static/image/bmap/hlkakou.png",
        cl: "../../../static/image/bmap/cl.png",
        hlcl: "../../../static/image/bmap/hlcl.png",
        ry: "../../../static/image/bmap/ry.png",
        hlry: "../../../static/image/bmap/hlry.png",
        start: "../../../static/image/bmap/start3.png",
        end: "../../../static/image/bmap/end3.png",
        cluster: "../../../static/image/bmap/blue.png",
        cluster_red: "../../../static/image/bmap/red.png",
        cluster_color: "../../../static/image/bmap/",

        //guiji
        start: "../../../static/image/shizhan/start.png",
        end: "../../../static/image/shizhan/end.png",
        cl: "../../../static/image/shizhan/ditu_cl.png",
        ry: "../../../static/image/shizhan/ditu_ry.png",
       
      },

      paintGraph: {
        paintType: "",
        drawPoline: {
          editing: false,
          paths: []
        },
        drawCircle: {
          center: {
            lng: 0,
            lat: 0
          },
          radius: 0
        },
        drawRec: {
          editing: false,
          paths: [
            { lng: 116.412732, lat: 39.911707 },
            { lng: 116.412732, lat: 39.921336 },
            { lng: 116.403461, lat: 39.911707 },
            { lng: 116.403461, lat: 39.921336 }
          ]
        },
        drawPolygon: {
          editing: false,
          paths: [
            { lng: 116.412732, lat: 39.911707 },
            { lng: 116.39455, lat: 39.910932 },
            { lng: 116.403461, lat: 39.921336 }
          ]
        }
      },

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
      // mapDatas: this.mapData
    };
  },
  props: [
    "car_kakou",
    "peo_kakou",
    "notification",
    "notification_type",
    "showKaKouTool",
    "removeGaojingLayer",
    "showGaojingRoute",
    "activeName",
    "cakoudefault",
    "yibiaosanshu",
    // "mapData"
    "mapStyle",
    "p_isShowScale",
    "p_isShowNavigation"
  ],
  watch: {
    car_kakou: {
      handler() {
        //this.setKakou(this.car_kakou,'car');
      },
      // 代表在wacth里声明了这个方法之后立即先去执行handler方法
      immediate: true,
      deep: true
    },
    peo_kakou: {
      handler() {
        // this.setKakou(this.peo_kakou,'peo');
      },
      // 代表在wacth里声明了这个方法之后立即先去执行handler方法
      immediate: true,
      deep: true
    },
    notification: {
      handler() {
        console.log("watch：notification");
        if (!this.map) return;
        if (this.notification && this.notification_type) {
          this.initNotification(this.notification, this.notification_type);
        }
      },
      immediate: false,
      deep: true
    },
    notification_type: {
      handler() {
        console.log("watch：notification_type");
        if (!this.map) return;
        if (this.notification && this.notification_type) {
          this.initNotification(this.notification, this.notification_type);
        }
      },
      immediate: false,
      deep: true
    },
    removeGaojingLayer: {
      handler() {
        if (!this.map) return;
        if (this.removeGaojingLayer) {
          //移除告警图层
          this.removeLayer("notification");
        }
      },
      immediate: true,
      deep: true
    },
    showGaojingRoute: {
      handler() {
        if (!this.map) return;
      },
      immediate: true,
      deep: true
    },
    activeName: {
      handler() {
        if (!this.map) return;
        console.log("当前tab2" + this.activeName);

        if (this.activeName == "third") {
          //显示告警
          this.map.clearOverlays();
          if (this.notification && this.notification_type) {
            this.initNotification(this.notification, this.notification_type);
          }
        } else if (this.activeName == "first" || this.activeName == "second") {
          //显示卡口
          this.setKakou(this.kakou.data, this.kakou.type);
          console.log(this.InteractList);
          var data = [];
          this.InteractList.forEach((item, idx) => {
            let count = 0;
            if (this.cakoudefault != undefined) {
              if (this.cakoudefault.toString().indexOf(item.id) > -1) {
                item.state = true;
              } else {
                item.state = false;
              }
            }
          }, this);

          if (this.cakoudefault != undefined) {
            console.log("跳动数据");
            console.log(this.cakoudefault);

            this.flashKakou(this.cakoudefault);
          }
        }
      },
      immediate: true,
      deep: true
    },
    //  dialogVisible: {
    //   handler() {
    //      console.log("wzqy");

    //   },
    //   // 代表在wacth里声明了这个方法之后立即先去执行handler方法
    //   immediate: false,
    //   deep: true
    // },



    // mapDatas: {
    //   handler: function(val, oldVal) {
    //     // setTimeout(() => {
    //     //   this.setKakou(data, type);
    //     // }, 1000);
    //     console.log(oldVal);
    //     console.log(val);
    //     if (!this.map) return;

    //     console.log(
    //       "当前page:" + this.mapData.page + ",当前tab:" + this.mapData.showpart
    //     );
    //     //后期统一处理（布控详情、实时告警、时空分析几个页面）tab切换，导致的界面问题
    //     if (this.mapData.page == "detailscontrol") {
    //     } else if (this.mapData.page == "shishigaojing") {
    //     } else if (this.mapData.page == "shikongfenxi") {
    //       // if (this.mapData.showpart == "2") {
    //       //   this.map.clearOverlays();
    //       // } else {
    //       //   this.map.clearOverlays();
    //       // }
    //     }
    //   },
    //   immediate: true,
    //   deep: true
    // }
  },
  components: {
    BaiduMap,
    BmMarker,
    BmNavigation,
    BmScale,
    BmPolygon,
    BmPolyline,
    BmCircle,
    BmControl,
    BmDriving
    // BmlMarkerClusterer,
  },
  beforeDestory() {
    //地图初始数据
    eventBus.$off(eventCollection._bmap_transKakou, (data, curnode) => {});

    //卡口树列表-->地图的操作
    eventBus.$off(eventCollection._bmap_tree2map, (data, curnode) => {
      this.flashKakou(data);
    });

    //告警列表-->地图的操作
    eventBus.$off(eventCollection._gaojingliebiao2map, data => {
      console.log(data);
    });
  },

  created() {
    console.log("最开始执行");
    // this.renderAll().then(function(value) {
    //     // 建议大家在浏览器中看看这里的value值
    //     console.log(value);
    // });

    var that = this;
    eventBus
      .$off(eventCollection._bmap_transKakou)
      .$on(eventCollection._bmap_transKakou, (data, type) => {
        // setTimeout(() => {
        //   this.setKakou(data, type);
        // }, 1000);
        var that = this;
        this.kakou.data = data;
        this.kakou.type = type;
        console.log("不延迟1s");
        setTimeout(
          function() {
            if (!this.map) {
              return;
            }
            console.log("延迟1s执行，保证map初始化");
            console.log("emit触发初始化数据-");
            if (this.activeName == "third") {
              //显示告警
              console.log("settimeout中执行initNotification");
              if (this.notification && this.notification_type) {
                this.initNotification(
                  this.notification,
                  this.notification_type
                );
              }
            } else {
              //显示卡口
              console.log("当前tab1" + this.activeName);
              console.log("当前tab1" + this.cakoudefault);
              this.setKakou(data, type);
              console.log(this.InteractList);

              this.InteractList.forEach((item, idx) => {
                let count = 0;
                if (this.cakoudefault != undefined) {
                  if (this.cakoudefault.toString().indexOf(item.id) > -1) {
                    item.state = true;
                  } else {
                    item.state = false;
                  }
                }
              }, this);

              if (this.cakoudefault != undefined) {
                console.log("跳动数据");
                console.log(this.cakoudefault);

                this.flashKakou(this.cakoudefault);
              }
            }
          }.bind(this),
          1000
        );
      });
    //卡口树列表-->地图的操作
    eventBus
      .$off(eventCollection._bmap_tree2map)
      .$on(eventCollection._bmap_tree2map, (data, curnode) => {
        // this.setKakou(data, type);
        //跟新卡口状态
        // console.log(data);
        // console.log(curnode);
        // console.log(this.InteractList);

        this.InteractList.forEach((item, idx) => {
          let count = 0;

          if (data.toString().indexOf(item.id) > -1) {
            item.state = true;
          } else {
            item.state = false;
          }
        }, this);

        // console.log("tree");
        this.flashKakou(data); //curnode
        if (curnode == null || curnode == undefined) {
          if (data.length >= 1) {
            return;
          }
        } else {
          if (curnode.id == null || curnode.id == undefined) {
            return;
          }
        }

        console.log("moveto跳转到卡口");
        // console.log(curnode.id);
        this.moveTo(data, curnode);
      });

    //告警列表-->地图的操作
    eventBus
      .$off(eventCollection._gaojingliebiao2map)
      .$on(eventCollection._gaojingliebiao2map, data => {
        // console.log(data);
        console.log("告警列表触发");

        if (!data == true) {
          return;
        }
        console.log(Array.isArray(data));
        console.log(data.length);
        if (Array.isArray(data)) {
          //参数数组就是初始化告警
          if (data.length > 0) {
            if (data[0].hasOwnProperty("plateNo")) {
              //时空分析处理

              this.showTrack(data, 3);
            } else {
              if (data[0].dispositionCategory == "人员") {
                this.initNotification(data, 2);
              } else if (data[0].dispositionCategory == "车辆") {
                this.initNotification(data, 3);
              } else if (data[0].dispositionCategory == 2) {
                // this.initNotification(data, 2);
                this.showTrack(data, 2);
              }
            }
          }
        } else {
          if (window.document.location.href.indexOf("bukongxiangqing") >= -1) {
            this.flashNotification(data, 2);
            this.map.panTo(new BMap.Point(data.longitude, data.latitude));
            console.log(
              "跳转到了告警轨迹上某个点:" + data.longitude + "," + data.latitude
            );
          } else {
            //参数是对象就是点击定位
            // console.log("定位信息");
            console.log(data);
            this.flashNotification(data, 1);
            this.map.panTo(new BMap.Point(data.longitude, data.latitude));
            console.log("跳转到了告警:" + data.longitude + "," + data.latitude);
          }
        }
      });

    //切换tab导致卡口数据发生变化，触发地图卡口数据更新
    // eventBus.$on(eventCollection._exchangetree2map, (data, type) => {

    // });

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


       //轨迹-->地图
    eventBus
      .$off(eventCollection._guiji2map)
      .$on(eventCollection._guiji2map,  (data) => {

        //清空轨迹
          //删除告警列表轨迹
          if(this.drivingRoute){
             this.drivingRoute.clearResults();
          }
          if(this.haveMaker("zhzz_guiji")){
             this.removeAtMaker("zhzz_guiji");
          }
          
        // console.log(data);
        console.log("综合联防轨迹");
        console.log(Array.isArray(data));

        console.log(data.length);
         this.showGuiJi2(data.data,data.type);
        // if(data.data.length>100){
        //     this.showGuiJi(data.data,data.type);
        // }else{
        //    this.showGuiJi2(data.data,data.type);
        // }
       
        // this.showTrack(data,1);
        

      });


  },
  mounted() {},

  methods: {
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

      console.log("map init");

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

      if (this.notification != undefined) {
        if (this.notification_type != undefined) {
          //实时告警初始化
          console.log("handler实时告警初始化");
          console.log(this.notification);
          console.log(this.notification_type);
          if (this.notification && this.notification_type) {
            this.initNotification(this.notification, this.notification_type);
          }
        }
      }

      if (!this.yibiaosanshu) {
      } else {
        this.map.panTo(new BMap.Point(104.072314, 30.663207));
        this.inittextIconOverlay();
        this.initmaplib();
        this.map.centerAndZoom(new BMap.Point(104.693798, 31.497132), 11); //   center: { lng: 104.072314, lat: 30.663207 },

        // ////按小区
        // var data = [
        //   {
        //     x: 104.0401,
        //     y: 30.667087,
        //     qu: "qingyang",
        //     jiedao: "huanhua",
        //     name: "草堂小区"
        //   },
        //   {
        //     x: 104.031261,
        //     y: 30.66384,
        //     qu: "qingyang",
        //     jiedao: "huanhua",
        //     name: "金陵半岛"
        //   },
        //   {
        //     x: 104.006378,
        //     y: 30.676592,
        //     qu: "qingyang",
        //     jiedao: "dongpo",
        //     name: "21世纪"
        //   },
        //   {
        //     x: 104.080937,
        //     y: 30.69257,
        //     qu: "jinniu",
        //     jiedao: "erhuan",
        //     name: "万达小区"
        //   },
        //   {
        //     x: 104.0894,
        //     y: 30.6962,
        //     qu: "jinniu",
        //     jiedao: "erhuan",
        //     name: "锦泰世家"
        //   },
        //   {
        //     x: 104.095409,
        //     y: 30.693297,
        //     qu: "jinniu",
        //     jiedao: "erhuan",
        //     name: "富力世家"
        //   }
        // ];

        // //按社区组织数据
        // var data_sq = [
        //   {
        //     jiedao: "浣花",
        //     coor: [
        //       {
        //         x: 104.0401,
        //         y: 30.667087,
        //         qu: "青羊区",
        //         jiedao: "浣花",
        //         name: "草堂小区"
        //       },
        //       {
        //         x: 104.031261,
        //         y: 30.66384,
        //         qu: "青羊区",
        //         jiedao: "浣花",
        //         name: "金陵半岛"
        //       }
        //     ]
        //   },
        //   {
        //     jiedao: "东坡",
        //     coor: [
        //       {
        //         x: 104.006378,
        //         y: 30.676592,
        //         qu: "青羊区",
        //         jiedao: "东坡",
        //         name: "21世纪"
        //       }
        //     ]
        //   },
        //   {
        //     jiedao: "火车北站",
        //     coor: [
        //       {
        //         x: 104.080937,
        //         y: 30.69257,
        //         qu: "金牛区",
        //         jiedao: "火车北站",
        //         name: "万达小区"
        //       },
        //       {
        //         x: 104.0894,
        //         y: 30.6962,
        //         qu: "金牛区",
        //         jiedao: "火车北站",
        //         name: "锦泰世家"
        //       },
        //       {
        //         x: 104.095409,
        //         y: 30.693297,
        //         qu: "金牛区",
        //         jiedao: "火车北站",
        //         name: "富力世家"
        //       }
        //     ]
        //   }
        // ];

        //按区县组织数据
        var data_qx = [
          // {
          //   qu: "青羊区",
          //   coor: [
          //     {
          //       x: 104.0401,
          //       y: 30.667087,
          //       qu: "青羊区",
          //       jiedao: "浣花",
          //       name: "草堂小区"
          //     },
          //     {
          //       x: 104.031261,
          //       y: 30.66384,
          //       qu: "青羊区",
          //       jiedao: "浣花",
          //       name: "金陵半岛"
          //     },
          //     {
          //       x: 104.006378,
          //       y: 30.676592,
          //       qu: "青羊区",
          //       jiedao: "东坡",
          //       name: "21世纪"
          //     }
          //   ],
          //   color:"blue",
          // },

          // {
          //   qu: "金牛区",
          //   coor: [
          //     {
          //       x: 104.080937,
          //       y: 30.69257,
          //       qu: "金牛区",
          //       jiedao: "火车北站",
          //       name: "万达小区"
          //     },
          //     {
          //       x: 104.0894,
          //       y: 30.6962,
          //       qu: "金牛区",
          //       jiedao: "火车北站",
          //       name: "锦泰世家"
          //     },
          //     {
          //       x: 104.095409,
          //       y: 30.693297,
          //       qu: "金牛区",
          //       jiedao: "火车北站",
          //       name: "富力世家"
          //     }
          //   ],
          //   color:"red",
          // },

          {
            qu: "涪城区",
            coor: [
              {
                x: 104.716238,
                y: 31.49555,
                qu: "涪城区",
                jiedao: "科创园",
                jiedao_geometry:
                  "104.696519,31.511383;104.696663,31.511198;104.694292,31.512244;104.692567,31.512491;104.690914,31.513353;104.68962,31.514461;104.686458,31.515261;104.684734,31.51206;104.682865,31.509659;104.681643,31.508366;104.679847,31.507442;104.675607,31.50892;104.672517,31.50855;104.66727,31.510459;104.664037,31.513661;104.661737,31.515138;104.659509,31.513537;104.652898,31.510459;104.65067,31.509351;104.648011,31.506395;104.645783,31.502085;104.645711,31.495558;104.645208,31.493033;104.643196,31.488722;104.640968,31.486074;104.639171,31.484411;104.635003,31.481947;104.636512,31.478991;104.638812,31.475234;104.64219,31.4724;104.644489,31.471784;104.649232,31.471969;104.660946,31.470799;104.661665,31.477205;104.675104,31.481085;104.679919,31.480407;104.683727,31.480099;104.689117,31.479976;104.690483,31.479976;104.693357,31.478005;104.695298,31.477143;104.697454,31.476342;104.699178,31.474156;104.700687,31.47277;104.703023,31.471384;104.704676,31.470645;104.708664,31.466918;104.709886,31.466394;104.711701,31.466056;104.714234,31.465809;104.716641,31.465763;104.71966,31.46584;104.720953,31.465886;104.726433,31.467072;104.729307,31.467657;104.730385,31.467904;104.73238,31.468828;104.732991,31.468304;104.733494,31.468027;104.735128,31.469197;104.73644,31.470306;104.73741,31.47123;104.738237,31.473124;104.738722,31.475449;104.739045,31.476958;104.739243,31.478467;104.739315,31.480315;104.739512,31.485319;104.739907,31.488152;104.73865,31.491355;104.739045,31.490462;104.737841,31.4902;104.736171,31.493833;104.735075,31.496743;104.731895,31.503871;104.729918,31.507319;104.722642,31.512953;104.717755,31.515538;104.705826,31.535484;104.699717,31.514646;104.69907,31.512675;104.69907,31.511814;104.699034,31.510736;104.698424,31.510551;104.697813,31.510367;104.697202,31.511413;104.697166,31.513199;104.696268,31.511398",
                name: "奥林春天"
              },
              {
                x: 104.700643,
                y: 31.4864,
                qu: "涪城区",
                jiedao: "科创园",
                jiedao_geometry:
                  "104.696519,31.511383;104.696663,31.511198;104.694292,31.512244;104.692567,31.512491;104.690914,31.513353;104.68962,31.514461;104.686458,31.515261;104.684734,31.51206;104.682865,31.509659;104.681643,31.508366;104.679847,31.507442;104.675607,31.50892;104.672517,31.50855;104.66727,31.510459;104.664037,31.513661;104.661737,31.515138;104.659509,31.513537;104.652898,31.510459;104.65067,31.509351;104.648011,31.506395;104.645783,31.502085;104.645711,31.495558;104.645208,31.493033;104.643196,31.488722;104.640968,31.486074;104.639171,31.484411;104.635003,31.481947;104.636512,31.478991;104.638812,31.475234;104.64219,31.4724;104.644489,31.471784;104.649232,31.471969;104.660946,31.470799;104.661665,31.477205;104.675104,31.481085;104.679919,31.480407;104.683727,31.480099;104.689117,31.479976;104.690483,31.479976;104.693357,31.478005;104.695298,31.477143;104.697454,31.476342;104.699178,31.474156;104.700687,31.47277;104.703023,31.471384;104.704676,31.470645;104.708664,31.466918;104.709886,31.466394;104.711701,31.466056;104.714234,31.465809;104.716641,31.465763;104.71966,31.46584;104.720953,31.465886;104.726433,31.467072;104.729307,31.467657;104.730385,31.467904;104.73238,31.468828;104.732991,31.468304;104.733494,31.468027;104.735128,31.469197;104.73644,31.470306;104.73741,31.47123;104.738237,31.473124;104.738722,31.475449;104.739045,31.476958;104.739243,31.478467;104.739315,31.480315;104.739512,31.485319;104.739907,31.488152;104.73865,31.491355;104.739045,31.490462;104.737841,31.4902;104.736171,31.493833;104.735075,31.496743;104.731895,31.503871;104.729918,31.507319;104.722642,31.512953;104.717755,31.515538;104.705826,31.535484;104.699717,31.514646;104.69907,31.512675;104.69907,31.511814;104.699034,31.510736;104.698424,31.510551;104.697813,31.510367;104.697202,31.511413;104.697166,31.513199;104.696268,31.511398",
                name: "太阳城"
              }
            ],
            color: "blue"
          },
          {
            qu: "安州区",
            coor: [
              {
                x: 104.43205,
                y: 31.4636,
                qu: "安州区",
                jiedao: "科创园",
                name: "阳光小区"
              }
            ],
            color: "green"
          },

          {
            qu: "江油市",
            coor: [
              {
                x: 104.7378,
                y: 31.7763,
                qu: "江油市",
                jiedao: "科创园",
                name: "上海城"
              }
            ],
            color: "grey"
          },

          {
            qu: "三台县",
            coor: [
              {
                x: 105.10731,
                y: 31.10177,
                qu: "三台县",
                jiedao: "科创园",
                name: "金域蓝湾"
              }
            ],
            color: "grey"
          },

          {
            qu: "游仙区",
            coor: [
              {
                x: 104.76974,
                y: 31.497759,
                qu: "游仙区",
                jiedao: "科学城",
                name: "龙都小区"
              },
              {
                x: 104.754,
                y: 31.5158,
                qu: "游仙区",
                jiedao: "科学城",
                name: "科学城3期"
              },
              {
                x: 104.774861,
                y: 31.5053,
                qu: "游仙区",
                jiedao: "科学城",
                name: "紫金城"
              }
            ],
            color: "red"
          }
        ];

        //默认显示区
        //===================

        for (var i in data_qx) {
          var curindex = i;
          var xy1 = data_qx[i].coor;
          var markers1 = [];
          var pt = null;
          for (var j in xy1) {
            pt = new BMap.Point(xy1[j].x, xy1[j].y);
            // markers1.push(new BMap.Marker(pt).setTitle(xy1[j].name));
            var m = new BMap.Marker(pt);
            m.setTitle(xy1[j].jiedao + ";" + xy1[j].name);
            markers1.push(m);
          }
          var markerClusterer1 = new BMapLib.MarkerClusterer(map, {
            name: data_qx[i].qu,
            // data_sq: data_sq,
            data_qx: data_qx,

            markers: markers1,
            girdSize: 100,
            styles: [
              {
                // url: "./img/blue.png",
                // url: this.bmapImg.cluster,
                url: this.bmapImg.cluster_color + data_qx[i].color + ".png",
                size: new BMap.Size(92, 92),
                backgroundColor: "#4783E7"
              }
            ]
          });
          // markerClusterer1._clusters[0]._clusterMarker._text.name = data_qx[i].qu;
          markerClusterer1.setMaxZoom(12);
          markerClusterer1.setGridSize(100);

          //默认加载行政区划

          var bdary = new BMap.Boundary();
          bdary.get(
            data_qx[i].qu || "北京市海淀区",
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
                  fillColor: data_qx[this].color || "#2d89f0",
                  strokeColor: data_qx[this].color, //"#4783E7" || this.initRandomColor() || "#4783E7",
                  fillOpacity: 0.2
                }); //建立多边形覆盖物
                map.addOverlay(ply); //添加覆盖物
                pointArray = pointArray.concat(ply.getPath());
              }
            }.bind(i)
          );
        }

        this;

        
      }

     
    },
    clearAll() {
      this.map.clearOverlays();
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

        // if (overlay[j].so) {
        //   // this.map.removeOverlay(overlay[j]);
        //    if (overlay[j].getTitle() == type) {
        //     this.map.removeOverlay(overlay[j]);
        //   }
        // }
      }
    },

   //地图包含某种type的maker
    haveMaker(type) {
      let overlay = this.map.getOverlays();
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


     //隐藏类型为type的maker覆盖物
    removeAtMaker(type) {
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
    

    addAtMaker(data, type,img) {
      // ,img
      // let img = this.bmapImg.hlry;
      if (data && data.length > 0) {
        data.forEach((item, idx) => {
          //创建图标
          if (!item || !item.longitude || !item.latitude) {
            return;
          }
          let pt = new this.BMap.Point(item.longitude, item.latitude);
          let myIcon = new this.BMap.Icon(img, new this.BMap.Size(24, 24));
          myIcon.imageSize = new this.BMap.Size(24, 24);
          let marker2 = new this.BMap.Marker(pt, {
            icon: myIcon,
            title: type //"kakou"
          });
          // // 创建标注
          // let label = new BMap.Label(item.id||"12", {
          //   offset: new BMap.Size(20, -10)
          // });
          // label.setStyle({ display: "none" });
          // marker2.setLabel(label);
          this.setInfowindow(marker2, item, {
            ischeck: false,
            title: "详情",
            type: type, //"kakou",
            isShowButton: true,
            x: 1
          });
          this.map.addOverlay(marker2);
        }, this);
      }
    },
    //显示轨迹
    showGuiJi(route, type) {
     var img = type == 2 ? this.bmapImg.ry : this.bmapImg.cl;
        let startIcon;
        let endIcon;
        let myIcon;
      route.forEach((item, idx) => {
       if(!item || !item.longitude) return;
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
          title: "zhzz_guiji"
        }); // 创建标注
        let label = new BMap.Label(item.notificationID, {
          offset: new BMap.Size(20, 40)
        });

        label.setStyle({ display: "none" });
        marker2.setLabel(label);

        this.setInfowindow(marker2, item, {
          ischeck: false,
          title: "详情",
          type: "zhzzGuiJi",
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
       if(!item || !item.longitude) return;
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
        //icons: [icons],
        strokeWeight: "5", //折线的宽度，以像素为单位
        strokeOpacity: 0.9, //折线的透明度，取值范围0 - 1
        strokeColor: "#18a45b" //折线颜色
      });

      this.map.setViewport(points);
      var bs = this.map.getBounds();
      this.map.panTo(bs.getCenter());
      console.log(
        "跳转轨迹中心bs:" + bs.getCenter().lng + "," + bs.getCenter().lat
      );

      this.map.addOverlay(polyline); //增加折线

     
     
    },
    showGuiJi2(route, type) {
      var img = type == 2 ? this.bmapImg.ry : this.bmapImg.cl;
      route.forEach((item, idx) => {
       if(!item || !item.longitude) return;
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
          title: "zhzz_guiji"
        }); // 创建标注
        let label = new BMap.Label(item.notificationID, {
          offset: new BMap.Size(20, 40)
        });

        label.setStyle({ display: "none" });
        marker2.setLabel(label);

        this.setInfowindow(marker2, item, {
          ischeck: false,
          title: "详情",
          type: "zhzzGuiJi",
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
       if(!item || !item.longitude) return;
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

      // this.map.setViewport(points);
      var bs = this.map.getBounds();
      this.map.panTo(bs.getCenter());
      var zoom=this.map.getZoom()+1;
     
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

      driving.setPolylinesSetCallback(
        function() {
           this.map.setViewport(points,{zoomFactor:-1});
        }.bind(this)

        
      );


      // this.map.getOverlays();
      // console.log(1);
    },

    showGuiJi3(route, type) {
      var img = type == 2 ? this.bmapImg.ry : this.bmapImg.cl;
      var len=route.length;
      route.forEach((item, idx) => {
       if(!item || !item.longitude) return;
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
          title: "zhzz_guiji"
        }); // 创建标注
        let label = new BMap.Label(item.notificationID, {
          offset: new BMap.Size(20, 40)
        });

        label.setStyle({ display: "none" });
        marker2.setLabel(label);

        this.setInfowindow(marker2, item, {
          ischeck: false,
          title: "详情",
          type: "zhzzGuiJi",
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
       if(!item || !item.longitude) return;
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

      // this.map.setViewport(points);
      var bs = this.map.getBounds();
      this.map.panTo(bs.getCenter());
      var zoom=this.map.getZoom()+1;
     
      console.log(
        "跳转轨迹中心bs:" + bs.getCenter().lng + "," + bs.getCenter().lat
      );

      // this.map.addOverlay(polyline); //增加折线

      var startpoint;
      var endpoint;
      var waypoints = [];
      var points = [];
      var path=[];
      var count=Math.ceil(route.length/20);
      for (var i = 0; i < count; i++) {
          points=[];    
          var startindex=20*i;
          var endindex=20*i-1;//最后一个是除外
          var lastindex=route.length-1;

          route.forEach((item, idx) => {
            if(i==count-1){
              if(idx>=startindex&&idx<=lastindex){
                points.push(new this.BMap.Point(item.longitude, item.latitude));
              }
              if(idx==lastindex){
                path[i]={
                  startpoint:points[0],
                  endpoint:points[points.length-1],
                  waypoints:points
                }
              }
            }else{
              if(idx>=startindex&&idx<=endindex){
                points.push(new this.BMap.Point(item.longitude, item.latitude));
              }
              if(idx==endindex){
                path[i]={
                   startpoint:points[0],
                  endpoint:points[points.length-1],
                  waypoints:points
                }
              }
            }
           
           
            // if(0==(idx+1)%20){
              
            // }
            
          });
      }

      for(var i = 0; i < path.length; i++){

        var driving = new BMap.DrivingRoute(this.map, {
          renderOptions: { map: this.map, autoViewport: true },
          policy: BMAP_DRIVING_POLICY_LEAST_TIME
        });
        this.drivingRoute=driving;
        driving.search(path[i].startpoint, path[i].endpoint, {
          waypoints: path[i].waypoints
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
      }
      
      
        
         



      

     

      // driving.setPolylinesSetCallback(
      //   function() {
      //      this.map.setViewport(points,{zoomFactor:-1});
      //   }.bind(this)
      // );


     
    },

    //显示放大的图片
    showlargeimg(src)
    {
      //  this.$emit('showlargeimg',src);
      //  this.$parent.$emit('showlargeimg',src);

       //触发父组件的属性
          this.$parent.dialogpiclarge=true;
       this.$parent.largeimg=src;

    },
  




    handleClose(done) {
        // this.$confirm('确认关闭？')
        //   .then(_ => {
        //     done();
        //   })
        //   .catch(_ => {});
        console.log("wzqy");
        


    },

    toggle(name) {
      this.paintGraph[name].editing = true; //!this.paintGraph[name].editing
      this.default_config.isdragging = false;
      // if (this[name].editing == false) {
      //   this.map.setDefaultCursor("pointer");
      //   this.map.setDefaultCursor("url('bird.cur')");
      //   this.default_config.isdragging = true;
      //   return;
      // }

      this.map.setDefaultCursor("crosshair");

      if (name == "drawPoline") {
        this.paintGraph.paintType = name;

        this.paintGraph.drawPoline.paths = [];
      } else if (name == "drawCircle") {
        this.paintGraph.paintType = name;
        this.paintGraph.drawCircle.center.lng = 0;
        this.paintGraph.drawCircle.center.lat = 0;
        this.paintGraph.drawCircle.radius = 0;
      } else if (name == "drawRec") {
        this.paintGraph.paintType = name;
        this.paintGraph.drawRec.paths = [];
      } else if (name == "drawPolygon") {
        this.paintGraph.paintType = name;

        this.paintGraph.drawPolygon.paths = [];
      }
    },
    syncGraph(e) {
        this.default_config.currentPoint = e.point;
      var type = this.paintGraph.paintType;

      if (type == "drawPoline") {
        if (!this.paintGraph.drawPoline.editing) {
          return;
        }
        const { paths } = this.paintGraph[type];
        if (!paths.length) {
          return;
        }
        const path = paths[paths.length - 1];
        if (!path.length) {
          return;
        }
        if (path.length === 1) {
          path.push(e.point);
        }
        this.$set(path, path.length - 1, e.point);
      } else if (type == "drawCircle") {
        if (!this.paintGraph.drawCircle.editing) {
          return;
        }
        if (this.paintGraph.drawCircle.center.lng == 0) {
          return;
        }
        var s = new this.BMap.Point(
          this.paintGraph.drawCircle.center.lng,
          this.paintGraph.drawCircle.center.lat
        );
        this.paintGraph.drawCircle.radius = this.map.getDistance(s, e.point);
      } else if (type == "drawRec") {
        //移出最后一个点，添加最后一个点
        //  this.paintGraph.drawRec.paths.pop();
        var fistpoint = {
          lng: this.paintGraph.drawRec.paths[0].lng,
          lat: this.paintGraph.drawRec.paths[0].lat
        };
        this.paintGraph.drawRec.paths = [];
        this.paintGraph.drawRec.paths.push(fistpoint);
        this.paintGraph.drawRec.paths.push({
          lng: fistpoint.lng,
          lat: e.point.lat
        });
        this.paintGraph.drawRec.paths.push({
          lng: e.point.lng,
          lat: e.point.lat
        });
        this.paintGraph.drawRec.paths.push({
          lng: e.point.lng,
          lat: fistpoint.lat
        });
      } else if (type == "drawPolygon") {
        //移出最后一个点，添加最后一个点
        this.paintGraph.drawPolygon.paths.pop();
        this.paintGraph.drawPolygon.paths.push({
          lng: e.point.lng,
          lat: e.point.lat
        });
      }

      //  if (!this.paintGraph.drawPoline.editing) {
      //     return
      //   }
      //  const { paths } = this.paintGraph.drawPoline;
      //   if (!paths.length) {
      //     return
      //   }
      //   const path = paths[paths.length - 1]
      //   if (!path.length) {
      //     return
      //   }
      //   if (path.length === 1) {
      //     path.push(e.point)
      //   }
      //   this.$set(path, path.length - 1, e.point)
    },
    newGraph(e) {
      this.default_config.isdragging = true;

      this.map.setDefaultCursor("pointer");
      this.paintGraph.paintType = "";
      var type = this.paintGraph.paintType;

      if (type == "drawPoline") {
        if (!this.paintGraph.drawPoline.editing) {
          return;
        }
        const { paths } = this.paintGraph[type];
        if (!paths.length) {
          paths.push([]);
        }
        const path = paths[paths.length - 1];
        path.pop();
        if (path.length) {
          paths.push([]);
        }
        this.paintGraph.drawPoline.editing = false;
      } else if (type == "drawCircle") {
        //结束画圆
        this.paintGraph.drawCircle.editing = false;
      } else if (type == "drawRec") {
      } else if (type == "drawPolygon") {
      }
    },
    paintGraphs(e) {
      if (this.paintGraph.paintType == "") {
        return;
      }

      if (this.paintGraph.paintType == "drawPoline") {
        const { paths } = this.paintGraph.drawPoline;
        !paths.length && paths.push([]);
        paths[paths.length - 1].push(e.point);
      } else if (this.paintGraph.paintType == "drawCircle") {
        if (this.paintGraph.drawCircle.center.lng != 0) {
          return;
        }
        this.paintGraph.drawCircle.center.lng = e.point.lng;
        this.paintGraph.drawCircle.center.lat = e.point.lat;
      } else if (this.paintGraph.paintType == "drawRec") {
        if (this.paintGraph.drawRec.paths.length > 0) {
          return;
        }
        this.paintGraph.drawRec.paths.push({
          lng: e.point.lng,
          lat: e.point.lat
        });
      } else if (this.paintGraph.paintType == "drawPolygon") {
        this.paintGraph.drawPolygon.paths.push({
          lng: e.point.lng,
          lat: e.point.lat
        });
      }
    },

    setInfowindow: function(marker, data, opt) {
      // 百度地图API功能
      let ischeck = opt.ischeck;
      var sContent = this.indowindow(data, opt);
      var infoWindow = new BMap.InfoWindow(sContent); // 创建信息窗口对象
     
      let that = this;
      marker.addEventListener("click", function() {
        //bianji
        if (that.point.editing || that.polygon.editing) return;
        this.openInfoWindow(infoWindow);

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
            //  that.dialogVisible = true;

            //that.dialogVisible = true;
            //alertExe
            var id = document.getElementById("sssp").getAttribute("indexCode");
            console.log(id);
            console.log(that.$parent);
            // that.$parent.$children[1].$children[1].$children[0].alertExe(id);
            // that.alertExe(id);
            if (true) {
              let _this = that;
              return shipinApi
                .agreementKeyWords()
                .then(res => res.data)
                .then(data => {
                  _this.appData = data;
                  _this.alertExe(id);
                })
                .catch(err => {
                  // this.$message({
                  //   message: "实时视频播放失败！",
                  //   type: "error",
                  //   duration: 5 * 1000
                  // });
                });
            }
          });
        }
        //录像回放
        if (document.getElementById("lxhf")) {
          document.getElementById("lxhf").addEventListener("click", d => {
            // that.dialogVisible = true;
          });
        }

         //位置迁移


         if (document.getElementById("zpaddr")) {
          document.getElementById("zpaddr").addEventListener("click", d => {

            var str = document.getElementById("zpaddr").getAttribute("datadd");
            console.log(str);
            that.showlargeimg(str)
           
          });
        }


        

        if (document.getElementById("wzqy")) {
          document.getElementById("wzqy").addEventListener("click", d => {
            that.dialogVisible = true;
            var id = document.getElementById("sssp").getAttribute("indexCode");

          });
        }

        //图片加载完毕重绘infowindow
        if (document.getElementById("imgDemo"))
          document.getElementById("imgDemo").onload = function() {
            infoWindow.redraw(); //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
          };
      });
    },
    indowindow: function(data, opt) {
      let sContent =
        '<div style="margin-top: 10px;"><p  class="zhzz-popover-title">' +
        opt.title +
        " </p>" +
        '<div class="zhzz-popover-content">';
      if (opt.type.indexOf( "kakou")>-1) {
        //卡口弹出框模板
        sContent += `<div  class="row">
              <div  class="col-md-12 spandiv">
                <span  class="spandec">设备名称：
                    <span  class="spantext">${
                      data.name||data.cameraName
                    } <span>&nbsp&nbsp<span></span>
                  </span>
              </div>
          </div>


          <div  class="row">
              <div  class="col-md-12 spandiv">
                <span  class="spandec">设备编码：
                    <span  class="spantext">${data.indexCode} </span>
                  </span>
              </div>
              
          </div>
          <div  class="row">
              <div  class="col-md-12 spandiv">
                <span  class="spandec">设备状态：
                    <span  class="spantext">${data.isOnline==1?"在线":"离线"} </span>
                  </span>
              </div>
              
          </div>
          <div  class="row">
              <div  class="col-md-12 spandiv">
                <span  class="spandec">所属辖区：
                    <span  class="spantext">${data.activeTime||"城北辖区"} </span>
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
                   <span  class="spanbutton"  id="wzqy"  indexCode='${
                      data.indexCode
                    }'> <i class="fa fa-map-o fa-lg"></i> 位置迁移</span>
              </div>
          </div>
          


          <div  class="popover-content-left"></div>
          <div class="popover-content-right"></div>`;
      } else if (opt.type == "notification") {
        //告警弹出框模板(人员和车辆不同)
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
                        <span  class="spantext">${data.applicantName} </span>
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
                          data.plateNo
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
                        <span  class="spantext">${data.applicantName} </span>
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
                          data.plateNo
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

      
      }else  if (opt.type == "renliankakou")  {

        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const element = data[key];
            sContent +=
              '<div  class="row"><div  class="col-md-12 spandiv"><span  class="spandec">' +
              key +
              '：<span  class="spantext">' +
              element +
              "</span></span></div></div>";
          }
        }
      }else  if (opt.type == "cheliangkakou")  {

        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const element = data[key];
            sContent +=
              '<div  class="row"><div  class="col-md-12 spandiv"><span  class="spandec">' +
              key +
              '：<span  class="spantext">' +
              element +
              "</span></span></div></div>";
          }
        }
      }else  if (opt.type == "paichusuo")  {

        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const element = data[key];
            sContent +=
              '<div  class="row"><div  class="col-md-12 spandiv"><span  class="spandec">' +
              key +
              '：<span  class="spantext">' +
              element +
              "</span></span></div></div>";
          }
        }
      }else if (opt.type == "tianwang") {
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
                    <span  class="spantext">${data.indexcode} </span>
                  </span>
              </div>
              
          </div>
          <div  class="row">
              <div  class="col-md-12 spandiv">
                <span  class="spandec">设备状态：
                    <span  class="spantext">${
                      data.isOnline == 1 ? "在线" : "离线"
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
                     data.indexcode
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
      }else if (opt.type == "zhzzGuiJi") {
        //时空分析弹出框模板(人员和车辆不同)
        if (opt.lx == "ry") {
          sContent += `
          <div  class="popover-content-left">
              <div style='height: 130px;border:1px solid #8394a1; display: flex; justify-content: center; align-items: center;'> <img style='max-width: 105px;' src='${this
                .BASE_IMG_URL + data.bkgPicUrl}'/>
                 <span class="ipcolor" id="zpaddr" style=' position: absolute;bottom:5px;left:0px;right: 0px;width: 105px;background-color: rgba(66, 80, 101, 0.8);cursor: pointer;' datadd='${this
                .BASE_IMG_URL + data.bkgPicUrl}'>
                      <i class="fa fa-search-plus icenter" style='    margin-left: 45px;' ></i>
                     
                    </span>
              </div>
             
          </div>
          <div class="popover-content-right">
              <div  class="row">
                  <div  class="col-md-12 spandiv">
                    <span  class="spandec">身份证：
                        <span  class="spantext">${
                          data.credentialsNum||data.credentialsnum
                        } <span>&nbsp&nbsp<span></span>
                      </span>
                  </div>
              </div>
              <div  class="row">
                  <div  class="col-md-6 spandiv">
                    <span  class="spandec">姓名：
                        <span  class="spantext">${data.humanName} </span>
                      </span>
                  </div>
                  
              </div>
              <div  class="row">
                  <div  class="col-md-12 spandiv">
                    <span  class="spandec">摄像头名称
                        <span  class="spantext">${data.cameraName} </span>
                      </span>
                  </div>
              </div>
              <div  class="row">
                  <div  class="col-md-12 spandiv">
                    <span  class="spandec">发现时间：
                        <span  class="spantext">${data.alarmTime} </span>
                      </span>
                  </div>
              </div>
              <div  class="row">
                  <div  class="col-md-12 spandiv">
                    <span  class="spandec">发现地点：
                        <span  class="spantext">${data.cameraName} </span>
                      </span>
                  </div>
              </div>

             
              
         </div>`;
        } else {
          sContent += `
          <div  class="popover-content-left">   
                       
                    <div style='height: 130px;border:1px solid #8394a1; display: flex; justify-content: center; align-items: center;'> <img style='max-width: 105px;' src='${this
                      .BASE_IMG_URL + data.picAbbreviate}'/>
                    </div>        
               
          </div>
          <div class="popover-content-right">
              <div  class="row">
                  <div  class="col-md-12 spandiv">
                    <span  class="spandec">车牌号：
                        <span  class="spantext">${
                          data.plateInfo
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
                            : data.targetFeature.brand||""
                        } </span>
                      </span>
                  </div>
                  
              </div>
              <div  class="row">
                  <div  class="col-md-12 spandiv">
                    <span  class="spandec">布控原因：
                        <span  class="spantext">${data.reason||""} </span>
                      </span>
                  </div>
              </div>
              <div  class="row">
                  <div  class="col-md-12 spandiv">
                    <span  class="spandec">发现时间：
                        <span  class="spantext">${data.passTimeStr||""} </span>
                      </span>
                  </div>
              </div>
              <div  class="row">
                  <div  class="col-md-12 spandiv">
                    <span  class="spandec">发现地点：
                        <span  class="spantext">${data.name||""} </span>
                      </span>
                  </div>
              </div>

         </div>`;
        }

      
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

    selectKakou: function(d) {
      let dataid = d.currentTarget.getAttribute("data-id");
      // console.log(dataid);
      eventBus.$emit(eventCollection._bmap_map2tree, {
        id: dataid,
        ischeck: true
      });
    },
    cancelKakou: function(d) {
      let dataid = d.currentTarget.getAttribute("data-id");
      // console.log(dataid);
      var kakou = new this.BMap.Icon(
        this.bmapImg.kakou,
        new this.BMap.Size(24, 24)
      );
      kakou.imageSize = new this.BMap.Size(24, 24);

      let overlay = this.map.getOverlays();
      for (var i = 0; i < overlay.length; i++) {
        if (overlay[i].getLabel) {
          if (overlay[i].getLabel()) {
            if ("" + dataid == overlay[i].getLabel().content) {
              let flashMarker = overlay[i];
              // flashMarker.setAnimation(null); //跳动的动画
              overlay[j].setIcon(kakou); //不高亮
              overlay[j].setTop(false);
              if (overlay[i].getTitle() == "kakou") {
                this.setInfowindow(
                  flashMarker,
                  this.InteractList.find(item => {
                    return item.id == dataid;
                  }).d,
                  {
                    ischeck: false,
                    title: "卡口详情",
                    type: "kakou",
                    isShowButton: true
                  }
                );
              }
            }
          }
        }
      }
      eventBus.$emit(eventCollection._bmap_map2tree, {
        id: dataid,
        ischeck: false
      });
    },

    setKakou: function(kakou, type) {
      // this.InteractList = [];
      // this.map.clearOverlays();

      //查询石佛图上有卡口
      let kakouCount = 0;
      let overlay = this.map.getOverlays();
      for (var j = 0; j < overlay.length; j++) {
        if (overlay[j].getLabel) {
          if (overlay[j].getLabel()) {
            let tollgateid = overlay[j].getLabel().content;
            if (overlay[j].getTitle() == "kakou") {
              kakouCount + 1;
            }
          }
        }
      }

      //当前卡口有数据且地图有卡口时则返回

      var array = this.InteractList.filter(item => item.type == "kakou");
      if (array.length > 0 && kakouCount >= 1) {
        return;
      }
      this.map.clearOverlays();

      // console.log(type + ":" + ++this.idx);
      if (!this.map) return;
      this.map.addEventListener("click", function(e) {
        // console.log(e.point.lng + "," + e.point.lat);
      });
      let img = this.bmapImg.kakou;
      if (kakou && kakou.length > 0) {
        kakou.forEach((item, idx) => {
         if(!item || !item.longitude) return;
          //创建备份数据
          this.InteractList.push({
            id: item.tollgateID,
            d: item,
            type: "kakou",
            state: false
          });
          if (idx == 0) {
            //默认跳转第一个卡口点
            console.log("跳转到了卡口:" + item.longitude + "," + item.latitude);
            this.map.panTo(new BMap.Point(item.longitude, item.latitude));
          }

          //创建图标
          let pt = new this.BMap.Point(item.longitude, item.latitude);
          let myIcon = new this.BMap.Icon(img, new this.BMap.Size(24, 24));
          myIcon.imageSize = new this.BMap.Size(24, 24);
          let marker2 = new this.BMap.Marker(pt, {
            icon: myIcon,
            title: "kakou"
          }); // 创建标注

          let label = new BMap.Label(item.tollgateID, {
            offset: new BMap.Size(20, -10)
          });

          label.setStyle({ display: "none" });
          marker2.setLabel(label);

          // marker2.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
          this.setInfowindow(marker2, item, {
            ischeck: false,
            title: "卡口详情",
            type: "kakou",
            isShowButton: true,
            x: 1
          });
          this.map.addOverlay(marker2);
        }, this);
      }
    },
    flashKakou: function(data) {
      // console.log("flashkakou......." + data);

      var kakou = new this.BMap.Icon(
        this.bmapImg.kakou,
        new this.BMap.Size(24, 24)
      );
      kakou.imageSize = new this.BMap.Size(24, 24);

      var hlkakou = new this.BMap.Icon(
        this.bmapImg.hlkakou,
        new this.BMap.Size(24, 24)
      );
      hlkakou.imageSize = new this.BMap.Size(24, 24);

      let overlay = this.map.getOverlays();

      for (var j = 0; j < overlay.length; j++) {
        // overlay[j].enableDragging();
        if (overlay[j].setAnimation)
          if (overlay[j].getLabel) {
            if (overlay[j].getLabel()) {
              // overlay[j].setAnimation(null); //跳动的动画
              overlay[j].setIcon(kakou); //不高亮
              overlay[j].setTop(false);
              let tollgateid = overlay[j].getLabel().content;
              if (overlay[j].getTitle() == "kakou") {
                this.setInfowindow(
                  overlay[j],
                  this.InteractList.find(item => {
                    // console.log(item);
                    return item.id == tollgateid;
                  }).d,
                  {
                    ischeck: false,
                    title: "卡口详情",
                    type: "kakou",
                    isShowButton: true
                  }
                );
              }
            }
          }
      }
      if (data && data.length > 0) {
        let flashMarker = null;
        for (var i = 0; i < overlay.length; i++) {
          if (overlay[i].getLabel) {
            if (overlay[i].getLabel()) {
              if (data.indexOf(overlay[i].getLabel().content) >= 0) {
                if (overlay[i].getTitle() == "kakou") {
                  let flashMarker = overlay[i];
                  // flashMarker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画

                  flashMarker.setIcon(hlkakou); //高亮
                  flashMarker.setTop(true);
                  let tollgateid = overlay[i].getLabel().content;
                  this.setInfowindow(
                    flashMarker,
                    this.InteractList.find(item => {
                      return item.id == tollgateid;
                    }).d,
                    {
                      ischeck: true,
                      title: "卡口详情",
                      type: "kakou",
                      isShowButton: true
                    }
                  );
                }
              }
            }
          }
        }
      }
    },

    flashNotification: function(data, type) {
      // console.log("flashNotification......." + data);

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
                overlay[j].setIcon(icon); //不高亮
                overlay[j].setTop(false);
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
                console.log(
                  overlay[j].getIcon().imageUrl.indexOf("start") > -1
                );
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

    initNotification: function(datas, type) {
      // console.log(type + ":" + ++this.idx);
      this.map.addEventListener("click", function(e) {
        console.log(e.point.lng + "," + e.point.lat);
      });
      // console.log("告警");
      // console.log(datas);
      // let img = this.bmapImg.kakou;
      let img = type == 3 ? this.bmapImg.cl : this.bmapImg.ry;
      let hlimg = type == 3 ? this.bmapImg.hlcl : this.bmapImg.hlry;
      let data;
      if (!datas.cl) {
        data = datas;
      } else {
        data = type == 3 ? datas.cl : datas.ry;
      }
      let isclear = type == 2 || type == 3 ? false : true;

      //实时警告页面，切换时清空覆盖物

      if (window.document.location.href.indexOf("shishigaojing") >= -1) {
        this.map.clearOverlays();
      }

      //布控详情页面，不清空覆盖物
      // console.log(this.$router);
      if (window.document.location.href.indexOf("bukongxiangqing") >= -1) {
      } else {
        this.map.clearOverlays();
      }
      //清除告警类覆盖物，保留卡口类覆盖物

      // var allOverlay = this.map.getOverlays();
      // for (var i = allOverlay.length - 1; i >= 0; i--) {
      //   // console.log(allOverlay[i].getTitle());
      //   if (allOverlay[i].point) {
      //     if (allOverlay[i].getTitle() == "notification") {
      //       this.map.removeOverlay(allOverlay[i]);
      //     }
      //   }
      // }

      //清除所有覆盖物

      // var allOverlay = this.map.getOverlays();
      // for (var i = allOverlay.length - 1; i >= 0; i--) {
      //   // console.log(allOverlay[i].getTitle());
      //   if (allOverlay[i].point) {
      //     this.map.removeOverlay(allOverlay[i]);
      //   }

      // }

      this.map.clearOverlays();

      var list = [];
      this.InteractList.forEach((item, idx) => {
        if (item.type != "notification") {
          list.push({
            id: item.id,
            d: item.d,
            type: item.type,
            state: item.state
          });
        }
      }, this);
      this.InteractList = list;

      var pt = null;
      var hlimgIcon = new this.BMap.Icon(hlimg, new this.BMap.Size(24, 24));
      hlimgIcon.imageSize = new this.BMap.Size(24, 24);

      if (this.showGaojingRoute) {
        //某个人或车告警列表展示，并包含轨迹
        if (data && data.length > 0) {
          data.forEach((item, idx) => {
            //创建备份数据
            this.InteractList.push({
              id: item.notificationID,
              d: item,
              type: "notification",
              state: false
            });
          }, this);
          //显示告警轨迹
          this.showRoute("notification");
          data.forEach((item, idx) => {
           if(!item || !item.longitude) return;
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
            } else if (data.length == idx + 1) {
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

            // marker2.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
            this.setInfowindow(marker2, item, {
              ischeck: false,
              title: "告警详情",
              type: "track" || "notification",
              lx: type == 3 ? "cl" : "ry",
              isShowButton: false
            });

            this.map.addOverlay(marker2);
            // marker2.enableDragging();
          }, this);
        }
      } else {
        //一般告警列表，展示
        if (data && data.length > 0) {
          data.forEach((item, idx) => {
           if(!item || !item.longitude) return;
            //创建备份数据
            this.InteractList.push({
              id: item.notificationID,
              d: item,
              type: "notification",
              state: false
            });

            //创建图标
            let pt = new this.BMap.Point(item.longitude, item.latitude);
            let myIcon = new this.BMap.Icon(img, new this.BMap.Size(24, 24));
            myIcon.imageSize = new this.BMap.Size(24, 24);
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
              title: "告警详情",
              type: "notification",
              lx: type == 3 ? "cl" : "ry",
              isShowButton: false
            });
            //  alert(1);
            //  alert(marker2.getTitle());
            this.map.addOverlay(marker2);
            // marker2.enableDragging();
            if (idx == 0) {
              //默认第一个高亮或则跳动
              // marker2.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
              marker2.setIcon(hlimgIcon); //高亮
              marker2.setTop(true);
              console.log("跳转到了告警");
              this.map.panTo(new BMap.Point(item.longitude, item.latitude));
            }
          }, this);
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

    searchAndHighlight(pt1, pt2) {
      // extent
      //传入框选范围和当前卡口数据坐标比较，从而实现框选

      let flashdata = [];
      this.InteractList.forEach((item, idx) => {
        if ((item.d.longitude - pt1.lng) * (item.d.longitude - pt2.lng) < 0) {
          if ((item.d.latitude - pt1.lat) * (item.d.latitude - pt2.lat) < 0) {
            flashdata.push(item.d.tollgateID);
            // alert(item.d.tollgateID);
            eventBus.$emit(eventCollection._bmap_map2tree, {
              id: item.d.tollgateID,
              ischeck: true
            });
          } else {
            eventBus.$emit(eventCollection._bmap_map2tree, {
              id: item.d.tollgateID,
              ischeck: false
            });
          }
        } else {
          eventBus.$emit(eventCollection._bmap_map2tree, {
            id: item.d.tollgateID,
            ischeck: false
          });
        }
      }, this);
      if (flashdata.length > 0) {
        this.flashKakou(flashdata.toString());
      }
    },
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
       if(!item || !item.longitude) return;
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
       if(!item || !item.longitude) return;
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
       if(!item || !item.longitude) return;
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
      this.$parent.toBkDetails(id);
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
          pixelNE.x += gridSize * 2;
          pixelNE.y -= gridSize;
          pixelSW.x -= gridSize * 2;
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
            this._name = opts["name"] || "zz";
            this._data_sq = opts["data_sq"];
            this._data_qx = opts["data_qx"];
            this._gridSize = opts["gridSize"] || -50;
            this._maxZoom = opts["maxZoom"] || 18;
            this._minClusterSize = opts["minClusterSize"] || 1;
            this._isAverageCenter = true;
            if (opts["isAverageCenter"] != undefined) {
              this._isAverageCenter = opts["isAverageCenter"];
            }
            this._styles = opts["styles"] || [];

            var that = this;
            console.log(1212);
            this._map.removeEventListener("zoomend", function() {});
            this._map.addEventListener("zoomend", function() {
              that._redraw();

              //zoomend
              if (this.getZoom() < 13) {
                //如果存在则不加载
                var svgs = document.querySelector("svg[version='1.1']");
                if (svgs) {
                  svgs.innerHTML = "";
                }

                //加上行政区
                //默认加载行政区划

                var bdary = new BMap.Boundary();
                bdary.get(
                  options.name || "北京市海淀区",
                  function(rs) {
                    //获取行政区域
                    // map.clearOverlays();        //清除地图覆盖物
                    var count = rs.boundaries.length; //行政区域的点有多少个
                    if (count === 0) {
                      alert("未能获取当前输入行政区域");
                      return;
                    }
                    var pointArray = [];
                    var curcolor;
                    for (var k = 0; k < this.op.data_qx.length; k++) {
                      console.log(k);
                      if (this.op.data_qx[k].qu == this.op.name) {
                        curcolor = this.op.data_qx[k].color;
                      }
                    }
                    for (var i = 0; i < count; i++) {
                      var ply = new BMap.Polygon(rs.boundaries[i], {
                        strokeWeight: 2,
                        fillColor: curcolor || "#2d89f0",
                        strokeColor:
                          curcolor ||
                          "#4783E7" ||
                          this.t.initRandomColor() ||
                          "#4783E7",
                        fillOpacity: 0.2
                      }); //建立多边形覆盖物
                      this.t.addOverlay(ply); //添加覆盖物
                      // pointArray = pointArray.concat(ply.getPath());
                    }
                  }.bind({ t: this, op: options })
                );
              }
            });

            this._map.addEventListener("moveend", function() {
              that._redraw();
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
          for (var i = 0, cluster; (cluster = this._clusters[i]); i++) {
            var center = cluster.getCenter();
            if (center) {
              var d = this._map.getDistance(center, marker.getPosition());
              if (d < distance) {
                distance = d;
                clusterToAddTo = cluster;
              }
            }
          }
          if (
            clusterToAddTo &&
            clusterToAddTo.isMarkerInClusterBounds(marker)
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
          var content =
            '<span style="color:' +
            this._styles[0].backgroundColor +
            '"><i class="fa fa-map-marker"></i></span>' +
            '<p style="padding:0px 13px;text-align:center;margin-top:5px;">' +
            marker.getTitle().split(";")[1] +
            "</p>";

          console.log("加了：" + marker.getTitle());
          label.setContent(content);
          label.setPosition(position);
          label.setOffset(new BMap.Size(0, 180));
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
            if (this._map.getZoom() >= 13) {
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

          //  this._clusterMarker.setText({name : '共找到' , value : this._markers.length});
          this._clusterMarker.setText({
            name: this._markerClusterer._name,
            value: this._markers.length
          });
          var thatMap = this._map;
          var thatBounds = this.getBounds();
          var center = this._center;
          this._clusterMarker.addEventListener("click", function(event) {
            //这个方法容易造成晃动
            //thatMap.setViewport(thatBounds);
            //console.log(center);
            console.log("聚合物click事件");
            //  console.log( event.target._text.name);

            var zoom = thatMap.getZoom();
            zoom = zoom > 14 ? zoom : 14;
            thatMap.setZoom(zoom);
            thatMap.setCenter(center);
          });
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
.zhzz-popover-title {
  height: 30px;
  line-height: 30px;
  padding-left: 10px;
  margin: 5px 0px 0px 0px;
  background: #0c557c;
  color: #fff;
}
.zhzz-popover-content {
  height: calc(100% - 40px);
  overflow: hidden;
  overflow-y: auto;
  padding-top: 5px;
  background: #06253d;
  color: white;
}
.zhzz-popover-title .close {
  color: #fff;
  font-size: 18px;
  float: right;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
}
.popover-content-left {
  /* border: 1px solid #8394a1; */
  width: 105px;
  height: calc(100% - 6px);
  overflow: hidden;
  display: inline-block;
}
.ryclimg {
  height: 150px;
  border: 1px solid #8394a1;
}
.popover-content-right {
  width: 330px;
  height: calc(100% - 6px);
  overflow: hidden;
  display: inline-block;
}
.zhzz-popover-content .row {
  padding: 0;
  line-height: 30px;
}
.row {
  margin-left: -15px;
  margin-right: -15px;
}
.zhzz-popover-content .spandec {
  padding-left: 10px;
}
.zhzz-popover-content .spanbutton {
  padding-left: 10px;
  color: #13b1e1;
  cursor: pointer;
}
.zhzz-popover-content .spantext {
  padding: 0 5px;
}
.BMap_cpyCtrl {
  display: none;
}
.anchorBL a {
  display: none;
}
.mapKakouTool {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: white;
  border: 0.3px solid #d6d0d0;
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

.tool {
  margin-bottom: 6px;
  width: 30px;
  cursor: pointer;
}
.toolSelect {
  color: #12b1e1;
}

.BMapLabel {
  background-color: #2d89f0 !important;
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
.clustererContent {
  transition: all 0.3s;
}
.clustererContent:hover {
  /* background-color: #ec2323 !important; */
}
/* .el-dialog__header{
  background: #0c557c!important;
}
.el-dialog__body{
 background: #06253d!important;
     color: white;
}
.el-dialog__footer{
 background:#06253d!important;
} */

.zhzz_pop{
  /* position:absolute;
  margin: 0 auto;
      left: 35%;
    top: 40%;
        width: 30%;
    background: red; */
}
</style>