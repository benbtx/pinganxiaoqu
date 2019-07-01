<template>
  <div style="z-index: 8;position: absolute;">
    <!-- v-show='showAllExtend' -->
    <div v-show='true' class="init-map item" @click="setQCview()">

            <span>
                <span >辖区</span>
                <span></span>
            </span>

    </div>
    <div class="top-tools" v-show="true">
      <div v-bind:class="[{'active':showAllSubmenu},'item']" @click="showAllSubmenu_f()">
        <a>
          <span class="ic-bk">
            <i class="allMenu-icon"></i>
            <i class="strangle-ico"></i>
          </span>
          <span class="ic-name">全部</span>
        </a>
      </div>
      <!-- 一级目录 -->
      <div :class=" [{'item-inner-ht':isShowAll} , 'item-inner']">
        <div
          class="vue-scroll"
          style="position: relative; height: 100%; width: 100%; padding: 0px; overflow: hidden;"
        >
          <div
            class="vuescroll-panel"
            style="position: relative; height: 100%; overflow-x: hidden; overflow-y: hidden; "
          >
            <div
              class="vuescroll-content"
              style="position: relative; min-width: 100%; min-height: 100%; width: -webkit-fit-content; box-sizing: border-box;"
            >
              <div class="innl">
                <div
                  :class="[{'active':mainMenu[aitem.type]},'item']"
                  v-for="(aitem, i) in menu"
                  :key="i"
                  @click="btnClick(aitem.type)"
                >
                  <a>
                    <span class="ic-bk">
                      <i class="sub-icon" :class="aitem.icon"></i>
                      <i v-if="aitem.type!='clear'" class="strangle-ico"></i>
                    </span>
                    <span class="ic-name">{{aitem.name}}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div
            class="vuescroll-vertical-rail"
            style="position: absolute; z-index: 1; border-radius: 6px; background: rgba(1, 169, 154, 0); width: 6px; top: 2px; bottom: 2px; right: 0px;"
          >
            <div
              class="vuescroll-vertical-bar"
              style="top: 0px; width: 100%; height: 99.4455%; border-radius: inherit; background: rgba(13, 42, 67, 0.34); opacity: 0; cursor: pointer; position: relative; transition: opacity 0.5s; user-select: none; transform: translateY(0%);"
            ></div>
          </div>
        </div>
      </div>

      <!-- 展示所有的子菜单 -->
      <div class="exsubmenu" v-if="showAllSubmenu">
        <div
          :class="[{'sub-item-wd':true}]"
          v-for="(m, i) in subMenu"
          :key="i"
          class="sub-item container"
        >
          <ul class="sub-section" v-for="(ul, u_i) in m.ul" :key="u_i" style="height: 100%;">
            <p class="sub-title">{{ul.subtitle}}</p>
            <li
              :class="[{ 'active':btnOptsClass[l.k]},'ele-item']"
              v-for="(l, l_i) in ul.li"
              :key="l_i"
              @click="btnClick(l.k)"
            >
              <a>
                <span class="ic-bk" :class="[btnOptsClass[l.k]?l.is:l.i]"></span>
                <span class="ic-name">{{l.t}}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- 展示隶属自己的菜单 -->
      <div
        :class="[{'sub-item-wd':mainMenu[m.p]},m.c]"
        v-for="(m, i) in subMenu"
        :key="i"
        class="sub-item"
        style="  justify-content: space-around;  display: flex;flex-direction: column;"
      >
        <ul class="sub-section" v-for="(ul, u_i) in m.ul" :key="u_i">
          <p class="sub-title">{{ul.subtitle}}</p>
          <li
            :class="[{ 'active':btnOptsClass[l.k] },'ele-item']"
            v-for="(l, l_i) in ul.li"
            :key="l_i"
            @click="btnClick(l.k)"
          >
            <a>
              <span class="ic-bk" :class="[btnOptsClass[l.k]?l.is:l.i]"></span>
              <span class="ic-name">{{l.t}}</span>
            </a>
          </li>
        </ul>
      </div>

      <div class="item" @click="btnClick('isShowAll')">
        <i
          class="fa"
          style="    font-size: 2em;"
          v-bind:class="{'fa-angle-up':isShowAll, 'fa-angle-down':!isShowAll}"
        ></i>
      </div>
    </div>
  </div>
</template>


<script>
import jQuery from "jquery";
import eventBus from "@/event";
import { eventCollection } from "@/event/resources";
// const controlUrl=require('../../../config').controlAddress;
// import { controlApi } from '@/http';
// import {
//   showFullScreenLoading,
//   tryHideFullScreenLoading
// } from './../../http/screenloading';
// import { mapVar } from '@/components/maps/variable.js';
import { MapToolMenuPlugin } from "@/utils/MapToolMenuPlugin.js";
import { excontrolApi } from "@/https";

import axios from "axios";
// const qs = require('qs');

export default {
  name: "pGisDataLayer",
  props: ["showOpt"],
  //组件销毁前
  beforeDestroy() {},
  mounted() {
    setTimeout(() => {
      document.addEventListener("click", e => {
        let d = document.getElementsByClassName("sub-item-wd")[0];
        if (!!d) {
          if (
            d.getBoundingClientRect().bottom > e.clientY &&
            d.getBoundingClientRect().top < e.clientY &&
            d.getBoundingClientRect().left < e.clientX &&
            d.getBoundingClientRect().right > e.clientX
          ) {
          } else {
            for (var i in this.mainMenu) {
              this.mainMenu[i] = false;
            }
          }
        }
        let ds = document.getElementsByClassName("exsubmenu")[0];
        if (!!ds) {
          if (
            ds.getBoundingClientRect().bottom > e.clientY &&
            ds.getBoundingClientRect().top < e.clientY &&
            ds.getBoundingClientRect().left < e.clientX &&
            ds.getBoundingClientRect().right > e.clientX
          ) {
          } else {
            this.showAllSubmenu = false;
          }
        }
      });
      // if (mapVar.mapInstance) {
      //   mapVar.mapInstance.map.addMapEventListener(
      //     EzEvent.MAP_ZOOMEND,
      //     level => {
      //       setTimeout(() => {
      //         if (this.showAttention)
      //           this.getVipAttentionObj(level._zoom, false);
      //       }, 200);
      //     }
      //   );
      //   //EzEvent.MAP_PANEND
      //   mapVar.mapInstance.map.addMapEventListener(
      //     EzEvent.MAP_PANEND,
      //     level => {
      //       if (this.mapMoveListenerEvent) {
      //         this.mapMoveListenerEvent = false;
      //         setTimeout(() => {
      //           if (mapVar.mapInstance.map.getZoomLevel() >= 15) {
      //             if (this.showAttention) this.getVipAttentionObj(null, true);
      //             this.mapMoveListenerEvent = true;
      //           }
      //         }, 200);
      //       }
      //     }
      //   );
      // }
    }, 2000);
  },
  created: function() {
    eventBus.$on(eventCollection.showNearbyCamera, data => {
      this.showNearbyTW(data);
    });

    // let _ajax = {};
    // _ajax.get = jQuery.getJSON;

    let _ajax = {};
    _ajax = jQuery.ajax;
    setTimeout(() => {
      // this.menuTools = new MapToolMenuPlugin(jQuery, mapVar.demoApp, qs);

      console.log("获取地图2");
      this.map = this.$parent.$children[0].map;
      this.BMap = this.$parent.$children[0].BMap;
      this.mapComponet = this.$parent.$children[0];
      console.log(this.map);
      this.menuTools = new MapToolMenuPlugin(_ajax, {
        map: this.map,
        BMap: this.BMap
      });

      // var overlayType = {
      //   wifi: { type: 'wifi', name: '普通WIFI' },
      //   police: { type: 'police', name: '已报备' },
      //   police1: { type: 'police1', name: '未报备' },
      //   person: { type: 'person', name: '重点人员' },
      //   car: { type: 'car', name: '重点车辆' },
      //   circle: { type: 'circle', name: '圆形' },
      //   rect: { type: 'rect', name: '矩形' },
      //   poly: { type: 'poly', name: '多边形' },
      //   line: { type: 'line', name: '画线' },
      //   area: { type: 'area', name: '测面积' },
      //   distance: { type: 'distance', name: '测距' },
      //   specialWifi: { type: 'specialWifi', name: '特种WIFI' },
      //   lineTunnel: { type: 'lineTunnel', name: '线通道' },
      //   tunnel: {
      //     chuan: { type: 'chuan', name: '环川' },
      //     rong: { type: 'rong', name: '环蓉' },
      //     train: { type: 'train', name: '火车站' },
      //     airport: { type: 'airport', name: '机场' },
      //     dock: { type: 'dock', name: '码头' },
      //     toll: { type: 'toll', name: '收费站' },
      //     other: { type: 'other', name: '其他' },
      //     firstClass: { type: 'firstClass', name: '一级' },
      //     secondClass: { type: 'secondClass', name: '二级' },
      //     thirdClass: { type: 'thirdClass', name: '三级' },
      //     automobile: { type: 'automobile', name: '汽车站' }
      //   },
      //   pgisPoint: {
      //     netbar: { type: 'netbar', name: '网吧' },
      //     hotel: { type: 'hotel', name: '旅店' },
      //     camera: { type: 'camera', name: '天网' },
      //     safe: { type: 'safe', name: '治安' },
      //     hospital: { type: 'hospital', name: '医院' },
      //     school: { type: 'school', name: '学校' },
      //     gv: { type: 'gv', name: '政府' },
      //     trafficPolice: { type: 'trafficPolice', name: '交警' }
      //   }
      // };
    }, 2000);
  },
  data() {
    return {
      map: null,
      BMap: null,
      menuTools: null,
      // 左侧列表
      menu: [
        // {
        //     name: '关注人员',
        //     icon: 'renyuan-icon',
        //     type: 'isShowAttention',
        //     show: false
        // },
        {
          name: "监控",
          icon: "tianwang-icon",
          type: "isShowjiankong",
          show: false
        },
        {
          name: "卡口",
          icon: "kakou-icon",
          type: "isShowKakou",
          show: false
        },
        {
          name: "报警柱",
          icon: "baojingzhu-icon",
          type: "isShowBaojingzhu",
          show: false
        },
        {
          name: "巡更",
          icon: "xungeng-icon",
          type: "isShowxungeng",
          show: false
        },
        {
          name: "重点人员",
          icon: "zhongdianrenyuan-icon",
          type: "isShowZhongdianrenyuan",
          show: false
        },
        {
          name: "警力",
          icon: "jingli-icon",
          type: "isShowJingli",
          show: false
        },
        {
          name: "停车场",
          icon: "tingchechang-icon",
          type: "isShowtingchechang",
          show: false
        },
        { name: "画笔", icon: "huabi-icon", type: "isShowHuabi", show: false }
        // { name: '清除', icon: 'ico-clear', type: 'clear', show: false }
      ],
      //左侧菜单子列表
      subMenu: [
        // {
        //     'p': 'isShowAttention',
        //     'c': 'sub-item-attention',
        //     'ul': [

        //         {
        //             'subtitle': '关注对象', 'li':
        //                 [
        //                     {
        //                         'k': 'person', 't': '关注对象', 'i': 'ico-zdry', 'is': 'ico-zdry-selected'
        //                     }
        //                 ]
        //         }

        //     ]
        // },
        {
          p: "isShowjiankong",
          c: "sub-item-tianwang",
          ul: [
            {
              subtitle: "监控",
              li: [
                {
                  k: "tianwang",
                  t: "天网",
                  i: "ico-tianwang",
                  is: "ico-tianwang-selected"
                }
              ]
            }
          ]
        },
        {
          p: "isShowKakou",
          c: "sub-item-kakou",
          ul: [
            {
              subtitle: "卡口",
              li: [
                {
                  k: "renliankakou",
                  t: "人脸卡口",
                  i: "ico-renliankakou",
                  is: " ico-renliankakou-selected"
                },
                {
                  k: "cheliangkakou",
                  t: "车辆卡口",
                  i: "ico-cheliangkakou",
                  is: " ico-cheliangkakou-selected"
                }
              ]
            }
          ]
        },
        {
          p: "isShowBaojingzhu",
          c: "sub-item-kadian",
          ul: [
            {
              subtitle: "报警柱",
              li: [
                {
                  k: "baojingzhu",
                  t: "报警柱",
                  i: "ico-baojingzhu",
                  is: " ico-baojingzhu-selected"
                }
                // {
                //   k: 'rong',
                //   t: '环蓉卡点',
                //   i: 'ico-roundcd',
                //   is: ' ico-roundcd-selected'
                // },
                // {
                //   k: 'firstClass',
                //   t: '一级',
                //   i: 'ico-kadianlv1',
                //   is: ' ico-kadianlv1-selected'
                // },
                // {
                //   k: 'secondClass',
                //   t: '二级',
                //   i: 'ico-kadianlv2',
                //   is: ' ico-kadianlv2-selected'
                // },
                // {
                //   k: 'thirdClass',
                //   t: '三级',
                //   i: 'ico-kadianlv3',
                //   is: ' ico-kadianlv3-selected'
                // }
              ]
            }
            // {
            //   subtitle: '重要通道',
            //   li: [
            //     {
            //       k: 'automobile',
            //       t: '汽车站',
            //       i: 'ico-qichezhan',
            //       is: ' ico-qichezhan-selected'
            //     },
            //     {
            //       k: 'train',
            //       t: '火车站',
            //       i: 'ico-huochezhan',
            //       is: ' ico-huochezhan-selected'
            //     },
            //     {
            //       k: 'airport',
            //       t: '机场',
            //       i: 'ico-jichang',
            //       is: ' ico-jichang-selected'
            //     },
            //     {
            //       k: 'dock',
            //       t: '码头',
            //       i: 'ico-matou',
            //       is: ' ico-matou-selected'
            //     },
            //     {
            //       k: 'lineTunnel',
            //       t: '线通道',
            //       i: 'ico-xiantongdao',
            //       is: ' ico-xiantongdao-selected'
            //     }
            //   ]
            // },
            // {
            //   subtitle: '其他',
            //   li: [
            //     {
            //       k: 'safe',
            //       t: '治安',
            //       i: 'ico-zhian',
            //       is: ' ico-zhian-selected'
            //     },
            //     {
            //       k: 'trafficPolice',
            //       t: '交警',
            //       i: 'ico-jiaojing',
            //       is: ' ico-jiaojing-selected'
            //     },
            //     {
            //       k: 'toll',
            //       t: '收费站',
            //       i: 'ico-gssfz',
            //       is: ' ico-gssfz-selected'
            //     },
            //     {
            //       k: 'other',
            //       t: '其他卡点',
            //       i: 'ico-kadianlv9',
            //       is: ' ico-kadianlv9-selected'
            //     }
            //   ]
            // }
          ]
        },
        {
          p: "isShowxungeng",
          c: "sub-item-xungeng",
          ul: [
            {
              subtitle: "巡更",
              li: [
                {
                  k: "xungeng",
                  t: "巡更",
                  i: "ico-xungeng",
                  is: "ico-xungeng-selected"
                }
              ]
            }
          ]
        },
        {
          p: "isShowZhongdianrenyuan",
          c: "sub-item-ganzhiyuan",
          ul: [
            {
              subtitle: "重点人员",
              li: [
                // {
                //   k: "shekong",
                //   t: "涉恐人员",
                //   i: "ico-shekong",
                //   is: " ico-shekong-selected"
                // },
                // {
                //   k: "shewen",
                //   t: "涉稳人员",
                //   i: "ico-shewen",
                //   is: " ico-shewen-selected"
                // },
                // {
                //   k: "zhongdaxingshi",
                //   t: "重点刑事犯罪前科",
                //   i: "ico-zhongdaxingshi",
                //   is: " ico-zhongdaxingshi-selected"
                // },
                // {
                //   k: "shedu",
                //   t: "涉毒人员",
                //   i: "ico-shedu",
                //   is: " ico-shedu-selected"
                // },
                // {
                //   k: "zaitao",
                //   t: "在逃人员",
                //   i: "ico-zaitao",
                //   is: " ico-zaitao-selected"
                // },
                // {
                //   k: "jingshebing",
                //   t: "肇事肇祸精神病人",
                //   i: "ico-jingshebing",
                //   is: " ico-jingshebing-selected"
                // },
                {
                  k: "shangfang",
                  t: "重点上访人员",
                  i: "ico-shangfang",
                  is: " ico-shangfang-selected"
                }
              ]
            }
          ]
        },
        {
          p: "isShowJingli",
          c: "sub-item-jingli",
          ul: [
            {
              subtitle: "警力",
              li: [
                {
                  k: "jingli",
                  t: "警力",
                  i: "ico-jingli",
                  is: " ico-jingli-selected"
                },
                {
                  k: "jingche",
                  t: "警车",
                  i: "ico-jingche",
                  is: " ico-jingche-selected"
                },
                {
                  k: "paichusuo",
                  t: "派出所",
                  i: "ico-paichusuo",
                  is: " ico-paichusuo-selected"
                }
              ]
            }
          ]
        },
        {
          p: "isShowtingchechang",
          c: "sub-item-tingchechang",
          ul: [
            {
              subtitle: "停车场",
              li: [
                {
                  k: "tingchechang",
                  t: "停车场",
                  i: "ico-tingchechang",
                  is: "ico-tingchechang-selected"
                }
              ]
            }
          ]
        },
        {
          p: "isShowHuabi",
          c: "sub-item-huabi",
          ul: [
            {
              subtitle: "画笔",
              li: [
                {
                  k: "line",
                  t: "线段",
                  i: "ico-xianduan",
                  is: " ico-xianduan"
                },
                {
                  k: "circle",
                  t: "画圆",
                  i: "ico-huayuan",
                  is: " ico-huayuan"
                },
                {
                  k: "rect",
                  t: "矩形",
                  i: "ico-huajuxing",
                  is: " ico-huajuxing"
                },
                {
                  k: "poly",
                  t: "多边形",
                  i: "ico-duobianxing",
                  is: " ico-duobianxing"
                }
                // {
                //   k: 'distance',
                //   t: '测距',
                //   i: 'ico-ceju',
                //   is: ' ico-ceju'
                // },
                // {
                //   k: 'area',
                //   t: '测面',
                //   i: 'ico-cemian',
                //   is: ' ico-cemian'
                // }
                // {
                //     'k': 'clear', 't': '清除', 'i': 'ico-clear', 'is': ' ico-clear'
                // },
              ]
            }
          ]
        }
      ],
      isShowAll: true,
      //maptools var
      mainMenu: {
        isShowjiankong: false,
        isShowKakou: false,
        isShowBaojingzhu: false,
        isShowxungeng: false,
        isShowZhongdianrenyuan: false,
        isShowJingli: false,
        isShowtingchechang: false,
        isShowHuabi: false, //是否激活画笔功能
        isShowAttention: false
      },

      showAllExtend: true, //是否显示全省范围
      showBybuffer: false,

      TOOL_PLUGIN_TYPE: null,
      showAllSubmenu: false,

      //设置按钮可用样式
      btnOptsClass: {
        //关注人员
        person: false,
        //tianwang
        tianwang: false,
        //卡口
        renliankakou: false,
        cheliangkakou: false,
        //jingli
        // policeju: false,
        // police: false,
        // police1: false,
        //kadian
        baojingzhu: false,
        rong: false,
        firstClass: false,
        secondClass: false,
        thirdClass: false,

        xungeng: false,
        tingchechang: false,

        //卡点---报警柱
        automobile: false,
        train: false,
        airport: false,
        dock: false,
        lineTunnel: false,
        //卡点-其他
        safe: false,
        trafficPolice: false,
        toll: false,
        other: false,

        //ganzhiyuan
        shekong: false,
        shewen: false,
        zhongdaxingshi: false,
        shedu: false,
        zaitao: false,
        jingshebing: false,
        shangfang: false,

        //ziyuan
        jingche: false,
        jingli: false,
        paichusuo: false,
        gv: false,
        weixianpin: false,

        //huabi
        line: false,
        circle: false,
        rect: false,
        poly: false,
        distance: false,
        area: false
      },
      bmapImg: {
       
        //以下综合联防
        rykakou: "../../../static/image/shizhan/rykakou.png",
        clkakou: "../../../static/image/shizhan/clkakou.png",
        tianwang: "../../../static/image/shizhan/spjk.png",
        paichusuo: "../../../static/image/shizhan/paichusuo.png",
        baojingzhu: "../../../static/image/bmap/baojingzhu.gif",
      },
    };
  },
  render() {},
  methods: {
    showAllSubmenu_f: function() {
      this.showAllSubmenu = !this.showAllSubmenu;
    },
    initMenutools: function() {
      if (this.menuTools == null) {
        let _ajax = {};
        _ajax.get = jQuery.getJSON;
        // this.menuTools = new MapToolMenuPlugin(jQuery, mapVar.demoApp, qs);
        console.log("获取地图3");
        // this.map=this.$parent.$children[0].map;
        console.log(this.map);
        console.log(this.BMap);
        this.mapComponet = this.$parent.$children[0];

        this.menuTools = new MapToolMenuPlugin(_ajax, {
          map: this.map,
          BMap: this.BMap
        });
      }
    },

    btnClick(type, _showBybuffer) {
      this.initMenutools();

      if (type == "isShowAll") {
        this.isShowAll = !this.isShowAll;
        return;
      }
      /** 清除菜单**/
      if (type == "clear") {
        ///调用清除接口 。。。将 主菜单、子菜单所有选中状态置为非选中状态

        this.menuTools.removePoints();
        for (var i in this.btnOptsClass) {
          this.btnOptsClass[i] = false;
        }
        return;
      }
      /** 一级目录**/

      if (this.mainMenu.hasOwnProperty(type)) {
        for (var i in this.mainMenu) {
          this.mainMenu[i] = false;
        }
        setTimeout(() => {
          this.mainMenu[type] = true;
        }, 50);

        return;
      }

      this.btnOptsClass[type] = !this.btnOptsClass[type];
      if (this.btnOptsClass[type] == true) {
        // this.menuTools.addPoints(this.TOOL_PLUGIN_TYPE[type].k.type);

        // this.menuTools.addPoints(type,{map:this.map,BMap: this.BMap,    mapComponet: this.mapComponet});

        this.addPoints(type, {
          map: this.map,
          BMap: this.BMap,
          mapComponet: this.mapComponet
        });

        /**画笔功能不选中**/
        let huab = ["line", "circle", "rect", "poly", "distance", "area"];
        if (huab.indexOf(type) >= 0) {
          this.btnOptsClass[type] = false;
        }
      } else if (this.btnOptsClass[type] == false) {
        // this.menuTools.removePoints(this.TOOL_PLUGIN_TYPE[type].k.type);
        // this.menuTools.removePoints(type,{map:this.map,BMap: this.BMap, mapComponet: this.mapComponet});

        this.removePoints(type, {
          map: this.map,
          BMap: this.BMap,
          mapComponet: this.mapComponet
        });
      }
    },

    addPoints: function(type, mapInstance) {
      if (type == "renliankakou") {
        if (mapInstance.mapComponet.haveMaker("renliankakou")) {
          mapInstance.mapComponet.showAtMaker("renliankakou");
        } else {
         
          return excontrolApi
            .getRyKakou()
            .then(res => res)
            .then(data => {
              console.log(data);
              
              //图上添加人员卡口数据
              // this.addAtMaker(data.data.pageData, "kakou", this.bmapImg.kakou);
              mapInstance.mapComponet.addAtMaker(
                    data.data.pageData,
                    "renliankakou",
                     this.bmapImg.rykakou
                  );
          });


        }
      } else if (type == "cheliangkakou") {
        if (mapInstance.mapComponet.haveMaker("cheliangkakou")) {
          mapInstance.mapComponet.showAtMaker("cheliangkakou");
        } else {
          return excontrolApi
            .getClKakou()
            .then(res => res)
            .then(data => {
              console.log(data);
              
              //图上添加人员卡口数据
              // this.addAtMaker(data.data.pageData, "kakou", this.bmapImg.kakou);
              mapInstance.mapComponet.addAtMaker(
                    data.data.pageData,
                    "cheliangkakou",
                     this.bmapImg.clkakou
                  );
          });
        }
      }else if (type == "tianwang") {
        if (mapInstance.mapComponet.haveMaker("tianwang")) {
          mapInstance.mapComponet.showAtMaker("tianwang");
        } else {
          return excontrolApi
            .getSpjk()
            .then(res => res)
            .then(data => {
              console.log(data);
              
              //图上添加人员卡口数据
              // this.addAtMaker(data.data.pageData, "kakou", this.bmapImg.kakou);
              mapInstance.mapComponet.addAtMaker(
                    data.data,
                    "tianwang",
                     this.bmapImg.tianwang
                  );
          });
        }
      }  else if (type == "paichusuo") {
        if (mapInstance.mapComponet.haveMaker("paichusuo")) {
          mapInstance.mapComponet.showAtMaker("paichusuo");
        } else {
          return excontrolApi
            .getPcs()
            .then(res => res)
            .then(data => {
              console.log(data);
              
              //图上添加人员卡口数据
              // this.addAtMaker(data.data.pageData, "kakou", this.bmapImg.kakou);
              mapInstance.mapComponet.addAtMaker(
                    data.data,
                    "paichusuo",
                     this.bmapImg.paichusuo
                  );
          });
        }
      } else if (type == "baojingzhu") {
        if (mapInstance.mapComponet.haveMaker("baojingzhu")) {
          mapInstance.mapComponet.showAtMaker("baojingzhu");
        } else {
          // ajax({
          //   xhrFields: { withCredentials: true },
          //   crossDomain: true,
          //   type: "get",
          //   url: paichusuo,
          //   success: function(data) {
          //     console.log(data);
          //   },
          //   error: function(msg) {
          //     console.log(msg);
          //   }
          // });

          mapInstance.mapComponet.addAtMaker(
                    [{longitude:104,latitude:31}],
                    "baojingzhu",
                     this.bmapImg.baojingzhu
                  );
        }
      }else if (type == "paichusuo2") {
        if (mapInstance.mapComponet.haveMaker("paichusuo")) {
          mapInstance.mapComponet.showAtMaker("paichusuo");
        } else {
          ajax({
            xhrFields: { withCredentials: true },
            crossDomain: true,
            type: "get",
            url: paichusuo,
            success: function(data) {
              console.log(data);
            },
            error: function(msg) {
              console.log(msg);
            }
          });
        }
      } else if (type == "circle") {
        mapInstance.mapComponet.toggle("drawCircle");
      } else if (type == "rect") {
        mapInstance.mapComponet.toggle("drawRec");
      } else if (type == "poly") {
        mapInstance.mapComponet.toggle("drawPolygon");
      } else if (type == "line") {
        //画线
        mapInstance.mapComponet.toggle("drawPoline");
      }
    },

    removePoints: function(type, mapInstance) {

       if (type == "renliankakou") {
            mapInstance.mapComponet.hideAtMaker('renliankakou');

        } else if (type == "cheliangkakou") {

            mapInstance.mapComponet.hideAtMaker('cheliangkakou');
        } else if (type == "tianwang") {
            mapInstance.mapComponet.hideAtMaker("tianwang");
        } else if (type == "paichusuo") {
            mapInstance.mapComponet.hideAtMaker("paichusuo");
        }else if (type == "circle") {
            // mapInstance.mapComponet.toggle('drawCircle');
        } else if (type == "rect") {
            // mapInstance.mapComponet.toggle('drawRec');
        } else if (type == "poly") {
            // mapInstance.mapComponet.toggle('drawPolygon');

        } else if (type == "line") {
            //画线
            // mapInstance.mapComponet.toggle('drawPoline');

        }
    },

    /*设置全川范围显示*/
    setQCview: function() {
      this.mapComponet;
      // let location = new   this.mapComponet.BMap.Point(104.7873, 31.4778);
       let location = new   this.mapComponet.BMap.Point(104.8724, 31.5546);
      this.mapComponet.map.centerAndZoom(location,13)

      // let location = new Point(104.064272, 30.675431);
      // mapVar.mapInstance.map.centerAndZoom(location, 7);
      // eventBus.$emit(eventCollection.SET_QCVIEW);
    },
    /**
     * 调取周边监控
     * 1.地图缩放，
     * 2.打开画笔功能，
     * 3.画完自动点开天网
     * @arg P:需要缩放的中心点
     */
    showNearbyTW: function(p) {
      this.initMenutools();
      //1.地图缩放，
      mapVar.mapInstance.map.centerAndZoom(p, 17);
      //2.打开画笔功能，
      //3.画完自动点开天网  在地图监听事件中 中打开
      this.btnOptsClass.circle = true;

      this.menuTools.addPoints(this.menuTools.overlayType.circle.type);

      let mapMove = mapVar.mapInstance.map.addMapEventListener(
        "mousemove",
        e => {
          // debugger
          e.target.openPopup("<p >左键点击开始确定范围</p>", e.latlng);
          $(".leaflet-popup")[0].style.cursor = "pointer";
        }
      );
      let mapMouseDown = mapVar.mapInstance.map.addMapEventListener(
        "mousedown",
        e => {
          mapVar.mapInstance.map.removeMapEventListener(mapMove);
          e.target.closePopup();
        }
      );
      let mapMouseUp = mapVar.mapInstance.map.addMapEventListener(
        "mouseup",
        () => {
          this.btnOptsClass.camera = true;
          this.menuTools.addPoints(
            this.menuTools.overlayType.pgisPoint.camera.type
          );

          setTimeout(() => {
            mapVar.mapInstance.map.removeMapEventListener(mapMouseUp);
          }, 20);
        }
      );
    }
  }
};
</script>

<style>
.v-modal {
  /* z-index: auto !important; */
}

.card {
  /* display: -ms-flexbox; */
  display: flex;
  /* -ms-flex-direction: column; */
  flex-direction: column;
  background: #082f4c;
  border: 1px solid #487581;
  position: relative;
  border-radius: 5px;
}

.card .card-header {
  width: 100%;
  /* color: hsla(0,0%,100%,.9)!important; */
  height: 2.5rem;
  line-height: 2.5rem;
  padding: 0 10px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOYAAAAeCAYAAAA4q2LPAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjU4N0E3NUQ5OEUxNjExRThBQTcxQ0VDQUNGMURBQzZBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjU4N0E3NURBOEUxNjExRThBQTcxQ0VDQUNGMURBQzZBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NTg3QTc1RDc4RTE2MTFFOEFBNzFDRUNBQ0YxREFDNkEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NTg3QTc1RDg4RTE2MTFFOEFBNzFDRUNBQ0YxREFDNkEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4gvdTdAAAFEklEQVR42uydWW9TVxDHT0hwNrMl0IiliC1pJQoSFdAg9Ru0UMorUNYXxAfgK/FOv0MoQUWsKoQCpUsUaCBNQlYn7vzxOLokcey5/xPn4c6IwY59x0M453dnOfceN2y9cTN8lGJxnfz9rTzpDcWwU563yPOPf5Z9LNkkHpPHrPB64nMaFo5d/F7xU9tKxySPTfpc8t5yn1vBTt9vMBy77L93yXsV7Kr9jhWOaVg8JpYxSI5d1TH+ZLx/njtz9VawyReiPYGTAdHfjDY7RLeTfgdF/zHabFBlZKxJn+RFr4vuCy4uy0saKLsjQPkiBZTbI0A5tEZQjgNMREnoNYfSZUUof7xihRLz6UvS7yvRx0abLo2WjLwV/ctok48A5QfR0aBQfiN6wOeeS0Qo94geJP3+KfrQaLNNdBfpd1j0tdGmXXQj6XdC9L/yDwDzhM89l8pQXrZCuVv0EOn3b9H7Rput6puRd6J/GG3aRDeRfidFR5IvrNOzm4vLUihPm6FE0/Aw6RcNl3thoeNUk3REgHJEU2eL31bRzaTfKdH3i18EmM0+B10iQIlmy5GAZnt6QcPlVyMcWzS4MH6RQr4w+m1R39GhLIPp4rIIyktWKNFw+ZqEAw2Xu6LzBhukkHtJv6NrBOW0Qll0MF2qQ/mDGUo0XI6ScwkNl34jlGi27CehxNLE70a/zQol43dG69mKJwMH0yUB5UUrlJ2ix8h5hKhxR3TOYJOPACWWJp4bocxpPctCOVwtQjuYLiUoT5mhRNQ4LtpI1na/iBYMNliaOEDOXSxNDBhPBjk9ETFQzlaLlA6mSwLKC1YoUdth/buJrO1u62StVbA00U2eDCZTQLk+QqSc1UhZU4R2MLMO5UkzlKjtenWyMrXdbU3rapXWCFCiC/rMGKHXa6RkWClYoHQwMw/lT1Yo8wpljqzt+kKpK1mroAvaQ0boaY2UFiib1gJKB9OhtAhqO1wlxqx7TyqUUwabZo2UDJQzGiln6gzlnEI5ZzV0MLMI5ffnrVC2KpQtZBrZp3DWKjmNlEyEnk0BZaNC2bgWUDqYDmWtaeQJhZOJWH2axlpqOxbKgkI5XWco5xXKQtoPcDCzBOV356xQ5hTK9ghQjhvTyB4ybS5DOWXkoZNMm2koHcxMQXk2LZR5Mo3EOuVoCiiZtBnp44AxbY4J5Sw7YA5mBqAUtUKJNBLdV+Yew4JCOWJMI7vJtHleoZxIASWzBISLBt7FgNLBdCgrRSxcPMDcY4iIhcvs3qeAso2E8rmxlsVFAx0RoBwOtgaTg+lQmuDAZXZbSDj6daJa5uF+spYFHLggfcwIZWfgGkzlSDkTc/AcTIcyOReO6URloMStW2+NcADKDRGgHDX67YgAJbKC6dgD6GA6lOV5gFu3tpGTFDc5D6WAciPp92VI7JdTo19kBewmAaifp1ZjEB1MhxKTFDc5d5FwYDuQQaPfvWQtC7+vjLVsUChbyP9r+JxcrYF0MB1KbAfC7sH6IJQ20LL43RP4XQBea31XbyhHVhNKBzPbUEKwcdZO0vejYN/ucbfWd4xge8t/jTbYOKuV9IuUeWK1B9TBzC6UXwV+Z7knWt9Z5PNQ2mqSEWzG/MZog5S5jfSL5tKHegyqg5lNKA9qfcfI01DqhFoEmzF/RvrF1xYMGW3QXGon/WIZZrxeA+tgZg9KfMkP+3UYuLLmmdEGX1vQRfodDLYGEwTLMPkIUI7Vc3D/F2AAXJfuJO98CeUAAAAASUVORK5CYII=);
  background-size: 70% 2.5rem;
  /* z-index: -2; */
  font-size: 1.0625rem;
}

.card .card-body {
  padding: 9px;
  /* display: -ms-flexbox; */
  display: flex;
  /* -ms-flex-direction: column; */
  flex-direction: row;
  height: calc(100% - 20px);
  overflow: hidden;
}

.card .card-body .checkItem {
  cursor: pointer;
  color: rgb(255, 245, 0);
  text-decoration: underline;
}

.pointmsg .card-body {
  position: relative;
}
</style>

<style scoped>
.top-tools,
.top-tools .item-inner {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
}

.top-tools {
  position: absolute;
  visibility: visible;
  left: 360px;
  top: 80px;
  width: 5rem;
  text-align: center;
  padding: 0.2rem;
  -ms-flex-pack: justify;
  justify-content: space-between;
  background: rgba(18, 58, 87, 0.8);
  border-radius: 0.15rem;
  box-shadow: 0 0 5px -1px #000;
}

.item-inner {
  height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.item-inner-ht {
  height: 37rem;
}

.item {
  border-radius: 0.15rem;
  padding: 0.2rem;
  margin: 0;
  cursor: pointer;
  transition: all 0.5s linear;
}

.item:hover {
  background: #0d283c;
  padding: 0.2rem;
}

.item a {
  display: inline-block;
  cursor: pointer;
  line-height: 1;
}

.item.active {
  background: #0d283c;
  padding: 0.2rem;
}

.ic-name {
  display: block;
  text-align: center;
  color: #b5d2db;
  font-weight: 700;
  font-size: 0.9em;
}

.ic-bk {
  display: inline-block;
  transition: all 0.5s linear;
  width: 2.4rem;
  height: 3rem;
  margin-right: 0.2rem;
  position: relative;
  background-size: 80% auto;
  background-repeat: no-repeat;
  background-position: center;
}

.strangle-ico {
  position: absolute;
  bottom: 0.2rem;
  right: 0.2rem;
  transform: rotate(90deg);
}

.allMenu-icon:before,
.video-icon:before,
.sub-icon:before {
  content: "";
  display: inline-block;
  width: 30px;
  height: 30px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 80% auto;
}

.strangle-ico:before {
  content: "";
  width: 0;
  height: 0;
  border-top: 0.5rem solid #8dadbd;
  border-left: 0.5rem solid transparent;
}

.exsubmenu {
  top: 60px;
  left: 65px;
  position: absolute;
  /* display: flex;
        justify-content: space-around;
        flex-direction: column; */
  overflow-y: scroll;
  height: 600px;
  background: rgba(18, 58, 87, 0.8);
  list-style: none;
  border-radius: 3px;
  border: solid 1px #51808a;
}
.exsubmenu .container {
  justify-content: space-around;
  display: flex;
  flex-direction: column;
  width: 260px;
}

/* scrollbar */

::-webkit-scrollbar {
  width: 0px;
  /* for vertical scrollbars */
  height: 0px;
  /* for horizontal scrollbars */
}

.exsubmenu .sub-item {
  position: relative;
  left: 0px;
  top: 0px;
  margin: 0.6rem 0;
  height: auto;
  padding: 0;
  background: rgba(18, 58, 87, 0.8);
  list-style: none;
  border-radius: 3px;
  overflow: hidden;
  box-shadow: 0 0 5px -1px rgba(0, 0, 0, 0.85);
}
.exsubmenu .sub-item li {
  width: 50px;
  height: 49px;
  float: left;
  margin: 6px 5px;
  padding: 2px 0px;
  box-sizing: border-box;
  border-radius: 2px;
  cursor: pointer;
}
.exsubmenu .sub-item .ic-bk {
  height: 1.8rem;
}
.exsubmenu .ic-bk {
  display: inline-block;
  transition: all 0.5s linear;
  width: 2rem;
  height: 3rem;
  margin-right: 0.2rem;
  position: relative;
  background-size: 80% auto;
  background-repeat: no-repeat;
  background-position: center;
}
.exsubmenu .sub-item .ic-name {
  font-weight: normal;
  font-size: 0.4em;
  margin-top: -4px;
}

.sub-item {
  position: absolute;
  left: 65px;
  top: 60px;
  width: 0;
  height: 108px;
  margin: 0.6rem 0;
  padding: 0;
  background: rgba(18, 58, 87, 0.8);
  list-style: none;
  border-radius: 3px;
  overflow: hidden;
  box-shadow: 0 0 5px -1px rgba(0, 0, 0, 0.85);
}

.sub-section {
  /* height: 102px; */
  margin: 4px;
  border: 2px solid #51808a;
}

.sub-title {
  margin: 0;
  padding: 0px 5px;
  width: 100%;
  height: 24px;
  line-height: 24px;
  text-align: left;
  font-weight: bold;
  background: #0a6b9c;
  overflow: hidden;
}

.sub-item li {
  width: 70px;
  height: 64px;
  float: left;
  margin: 6px 5px;
  padding: 4px 2px;
  box-sizing: border-box;
  border-radius: 2px;
  cursor: pointer;
}

.sub-item .ic-bk {
  height: 2.2rem;
}

.sub-item .ic-name {
  font-weight: normal;
}

.sub-item .ele-item:hover,
.sub-item .active {
  background: #0d283c;
}

.sub-item-attention {
  top: 34px;
}

.sub-item-tianwang {
  top: 54px;
}

.sub-item-xungeng {
  top: 154px;
}

.sub-item-kakou {
  top: 110px;
}

.sub-item-kadian {
  top: 164px;
}

.sub-item-ganzhiyuan {
  top: 220px;
}

.sub-item-jingli {
  top: 280px;
}
.sub-item-tingchechang {
  top: 340px;
}

.sub-item-huabi {
  top: 390px;
}

.sub-item-wd.sub-item-attention {
  /* width: 174px; */
  width: 333px;
}

.sub-item-wd.sub-item-tianwang {
  /* width: 174px; */
  width: 333px;
}

.sub-item-wd.sub-item-kakou {
  /* width: 174px; */
  width: 333px;
}

.sub-item-wd.sub-item-kadian {
  /* width: 174px; */
  /* height: 510px; */
  height: 180px;
  width: 333px;
}

.sub-item-wd.sub-item-ganzhiyuan {
  width: 333px;
  height: 120px;
}

.sub-item-wd.sub-item-jingli {
  width: 333px;
}

.sub-item-wd.sub-item-xungeng {
  width: 333px;
}

.sub-item-wd.sub-item-tingchechang {
  width: 333px;
}

.sub-item-wd.sub-item-huabi {
  width: 333px;
  /* height: 180px; */
}

.sub-item-wd .selected {
  background-color: rgb(243, 151, 30);
}

.init-map {
  position: absolute;
  top: 30px;
  left: 360px;
  width: 5rem;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background: rgba(18, 58, 87, 0.8);
  border-radius: 4px;
  cursor: pointer;
}

.init-map:hover {
  background: #0d2144;
}

.init-map .ic-bk .strangle-ico[data-v-0bbe26c4] {
  top: -4px;
  position: absolute;
  right: 12px;
}

.init-map .ic-bk .strangle-ico:before {
  content: "";
  width: 0;
  height: 0;
  border-bottom: 0.5rem solid #8dadbd;
  border-left: 0.5rem solid transparent;
}
</style>