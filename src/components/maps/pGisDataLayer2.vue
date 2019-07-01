<template>
    <div style="z-index: 8;position: absolute;">
        <!-- v-show='showAllExtend' -->
        <!-- <div v-show='showOpt.qc' class="init-map item" @click="setQCview()">

            <span>
                <span>全省</span>
                <span></span>
            </span>

        </div> -->
        <!-- //showOpt.tool -->
        <div class="top-tools" v-show='true'>
            <div v-bind:class="[{'active':isShowAll},'item']" @click="btnClick('showAll')">
                <a>
                    <span class="ic-bk">
                        <i class="allMenu-icon"></i>
                        <i class="strangle-ico"></i>
                    </span>
                    <span class="ic-name">全部</span>
                </a>
            </div>

            <div :class=" [{'item-inner-ht':isShowAll} , 'item-inner']">
                <div class="vue-scroll" style="position: relative; height: 100%; width: 100%; padding: 0px; overflow: hidden;">
                    <div class="vuescroll-panel" style="position: relative; height: 100%; overflow-x: hidden; overflow-y: scroll; margin-right: -8px;">
                        <div class="vuescroll-content" style="position: relative; min-width: 100%; min-height: 100%; width: -webkit-fit-content; box-sizing: border-box;">
                            <div class="innl">
                                <div :class="[{ 'active':isShowAttention },'item']" @click="btnClick('isShowAttention')">
                                    <a>
                                        <span class="ic-bk">
                                            <i class="sub-icon renyuan-icon"></i>
                                            <i class="strangle-ico"></i>
                                        </span>
                                        <span class="ic-name">关注人员</span>
                                    </a>
                                </div>
                                <div :class="[{ 'active':isShowtianwang },'item']" @click="btnClick('isShowtianwang')">
                                    <a>
                                        <span class="ic-bk">
                                            <i class="sub-icon tianwang-icon"></i>
                                            <i class="strangle-ico"></i>
                                        </span>
                                        <span class="ic-name">天网</span>
                                    </a>
                                </div>
                                <div :class="[{ 'active':isShowJingli},'item']" @click="btnClick('isShowJingli')">
                                    <a>
                                        <span class="ic-bk">
                                            <i class="sub-icon jingli-icon"></i>
                                            <i class="strangle-ico"></i>
                                        </span>
                                        <span class="ic-name">警力</span>
                                    </a>
                                </div>
                                <div :class="[{'active':isShowKadian},'item']" @click="btnClick('isShowKadian')">
                                    <a>
                                        <span class="ic-bk">
                                            <i class="sub-icon kadian-icon"></i>
                                            <i class="strangle-ico"></i>
                                        </span>
                                        <span class="ic-name">卡点</span>
                                    </a>
                                </div>
                                <div :class="[{'active':isShowGanzhiyuan },'item']" @click="btnClick('isShowGanzhiyuan')">
                                    <a>
                                        <span class="ic-bk">
                                            <i class="sub-icon ganzhiyuan-icon"></i>
                                            <i class="strangle-ico"></i>
                                        </span>
                                        <span class="ic-name">感知源</span>
                                    </a>
                                </div>
                                <!-- <div :class="[{ 'active':isShowZiyuan },'item']" @click="btnClick('isShowZiyuan')">
                                    <a>
                                        <span class="ic-bk">
                                            <i class="sub-icon ziyuan-icon"></i>
                                            <i class="strangle-ico"></i>
                                        </span>
                                        <span class="ic-name">资源</span>
                                    </a>
                                </div> -->

                                <div :class="[{ 'active':isShowHuabi },'item']" @click="btnClick('isShowHuabi')">
                                    <a>
                                        <span class="ic-bk">
                                            <i class="sub-icon huabi-icon"></i>
                                            <i class="strangle-ico"></i>
                                        </span>
                                        <span class="ic-name">画笔</span>
                                    </a>
                                </div>
                                <div @click="btnClick('clear')">
                                    <a>
                                        <span class="ic-bk">
                                            <i class=" fa fa-trash" style="font-size: 1.8em;color:#9ee2fd;"></i>
                                            <i class="strangle-ico"></i>
                                        </span>
                                        <span class="ic-name">清除</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="vuescroll-vertical-rail" style="position: absolute; z-index: 1; border-radius: 6px; background: rgba(1, 169, 154, 0); width: 6px; top: 2px; bottom: 2px; right: 0px;">
                        <div class="vuescroll-vertical-bar" style="top: 0px; width: 100%; height: 99.4455%; border-radius: inherit; background: rgba(13, 42, 67, 0.34); opacity: 0; cursor: pointer; position: relative; transition: opacity 0.5s; user-select: none; transform: translateY(0%);"></div>
                    </div>
                </div>
            </div>
            <!-- 关注人员 -->
            <div :class="{'sub-item-wd':isShowAttention }" class="sub-item sub-item-attention">
                <ul class="sub-section">
                    <p class="sub-title">关注对象</p>

                    <li :class="[{ 'active':btnOptsClass.attention },'ele-item']" @click="btnClick('attention')">
                        <a>
                            <span class="ic-bk fa fa-users" style="font-size: 1.8em;color:#9ee2fd;">
                            </span>
                            <span class="ic-name">关注对象</span>
                        </a>
                    </li>
                </ul>
            </div>
            <!-- 天网 -->
            <div :class="{'sub-item-wd':isShowtianwang}" class="sub-item sub-item-tianwang">
                <ul class="sub-section">
                    <p class="sub-title">天网</p>

                    <li :class="[{'active':btnOptsClass.tianwang},'ele-item']" @click="btnClick('tianwang')">
                        <a>

                            <span class="ic-bk" :class="[btnOptsClass.tianwang?'ico-tianwang-selected':'ico-tianwang']">
                            </span>
                            <span class="ic-name">天网</span>
                        </a>
                    </li>

                </ul>
            </div>
            <!-- 警力 -->
            <div :class="{'sub-item-wd':isShowJingli}" class="sub-item sub-item-jingli">
                <ul class="sub-section">
                    <p class="sub-title">警力</p>

                    <li v-bind:class="[{'active': btnOptsClass.policeju  },'ele-item']" @click="btnClick('policeju')">
                        <a>
                            <span class="ic-bk ico-policeju">
                            </span>
                            <span class="ic-name">公安机关</span>
                        </a>
                    </li>

                    <li v-bind:class="[{ 'active':btnOptsClass.policeli },'ele-item']" @click="btnClick('policeli')">
                        <a>
                            <span class="ic-bk ico-policeli">
                            </span>
                            <span class="ic-name">警力</span>
                        </a>
                    </li>
                    <!-- <li v-bind:class="[{ 'active':btnOptsClass.policeli },'ele-item']" @click="btnClick('policeli',true)">
                            <a>
                                <span class="ic-bk  icon-huabi">
                                </span>
                                <span class="ic-name">范围</span>
                            </a>
                        </li> -->
                </ul>
            </div>
            <!-- 卡点 -->
            <div :class="{'sub-item-wd':isShowKadian}" class="sub-item sub-item-kadian">
                <ul class="sub-section" style="height: 504px;">
                    <p class="sub-title">卡点</p>
                    <ul class="sub-section" style="height: 180px;">
                        <p class="sub-title">卡点</p>
                        <li v-bind:class="[{ 'active': btnOptsClass.roundsc  },'ele-item']" @click="btnClick('roundsc')">
                            <a>
                                <span class="ic-bk ico-roundsc">
                                </span>
                                <span class="ic-name">环川卡点</span>
                            </a>
                        </li>
                        <li v-bind:class="[{'active': btnOptsClass.roundcd }, 'ele-item']" @click="btnClick('roundcd')">
                            <a>
                                <span class="ic-bk ico-roundcd">
                                </span>
                                <span class="ic-name">环蓉卡点</span>
                            </a>
                        </li>
                        <li v-bind:class="[{'active': btnOptsClass.kadianlv1 }, 'ele-item']" @click="btnClick('kadianlv1')">
                            <a>
                                <span class="ic-bk ico-kadianlv1">
                                </span>
                                <span class="ic-name">一级</span>
                            </a>
                        </li>
                        <li v-bind:class="[{'active': btnOptsClass.kadianlv2 }, 'ele-item']" @click="btnClick('kadianlv2')">
                            <a>
                                <span class="ic-bk ico-kadianlv2">
                                </span>
                                <span class="ic-name">二级</span>
                            </a>
                        </li>
                        <li v-bind:class="[{'active': btnOptsClass.kadianlv3  }, 'ele-item']" @click="btnClick('kadianlv3')">
                            <a>
                                <span class="ic-bk ico-kadianlv3">
                                </span>
                                <span class="ic-name">三级</span>
                            </a>
                        </li>
                    </ul>
                    <ul class="sub-section" style="height: 180px;">
                        <p class="sub-title">重要通道</p>
                        <li v-bind:class="[{'active': btnOptsClass.k_qichezhan  },'ele-item']" @click="btnClick('k_qichezhan')">
                            <a>
                                <span class="ic-bk ico-qichezhan">
                                </span>
                                <span class="ic-name">汽车站</span>
                            </a>
                        </li>
                        <li v-bind:class="[{'active': btnOptsClass.k_huochezhan }, 'ele-item']" @click="btnClick('k_huochezhan')">
                            <a>
                                <span class="ic-bk ico-huochezhan">
                                </span>
                                <span class="ic-name">火车站</span>
                            </a>
                        </li>

                        <li v-bind:class="[{'active': btnOptsClass.k_jichang }, 'ele-item']" @click="btnClick('k_jichang')">
                            <a>
                                <span class="ic-bk ico-jichang">
                                </span>
                                <span class="ic-name">机场</span>
                            </a>
                        </li>
                        <li v-bind:class="[{'active': btnOptsClass.matou  }, 'ele-item']" @click="btnClick('matou')">
                            <a>
                                <span class="ic-bk ico-matou">
                                </span>
                                <span class="ic-name">码头</span>
                            </a>
                        </li>
                        <li v-bind:class="[{'active': btnOptsClass.xiantongdao  }, 'ele-item']" @click="btnClick('xiantongdao')">
                            <a>
                                <span class="ic-bk ico-xiantongdao">
                                </span>
                                <span class="ic-name">线通道</span>
                            </a>
                        </li>
                    </ul>
                    <ul class="sub-section" style="height: 100px;">
                        <p class="sub-title">其他</p>
                        <li v-bind:class="[{'active': btnOptsClass.zhian  },'ele-item']" @click="btnClick('zhian')">
                            <a>
                                <span class="ic-bk ico-zhian">
                                </span>
                                <span class="ic-name">治安</span>
                            </a>
                        </li>
                        <li v-bind:class="[{'active': btnOptsClass.jiaojing }, 'ele-item']" @click="btnClick('jiaojing')">
                            <a>
                                <span class="ic-bk ico-jiaojing">
                                </span>
                                <span class="ic-name">交警</span>
                            </a>
                        </li>

                        <li v-bind:class="[{'active': btnOptsClass.gssfz }, 'ele-item']" @click="btnClick('gssfz')">
                            <a>
                                <span class="ic-bk ico-gssfz">
                                </span>
                                <span class="ic-name">收费站</span>
                            </a>
                        </li>
                        <li v-bind:class="[{'active': btnOptsClass.kadianlv9  }, 'ele-item']" @click="btnClick('kadianlv9')">
                            <a>
                                <span class="ic-bk ico-kadianlv9">
                                </span>
                                <span class="ic-name">其他卡点</span>
                            </a>
                        </li>

                    </ul>
                </ul>
            </div>
            <!-- 感知源 -->
            <div :class="{'sub-item-wd':isShowGanzhiyuan}" class="sub-item sub-item-ganzhiyuan">
                <ul class="sub-section" style="height: 190px;">
                    <p class="sub-title">感知源</p>
                    <li v-bind:class="[{'active': btnOptsClass.wifi_pt}, 'ele-item']" @click="btnClick('wifi_pt')">
                        <a>
                            <span class="ic-bk ico-wifi">
                            </span>
                            <span class="ic-name">普通WIFI</span>
                        </a>
                    </li>
                    <li v-bind:class="[{'active': btnOptsClass.wifi_tz}, 'ele-item']" @click="btnClick('wifi_tz')">
                        <a>
                            <span class="ic-bk ico-wifi">
                            </span>
                            <span class="ic-name">特种WIFI</span>
                        </a>
                    </li>
                    <li v-bind:class="[{ 'active':btnOptsClass.hotel}, 'ele-item']" @click="btnClick('hotel')">
                        <a>
                            <span class="ic-bk ico-hotel">
                            </span>
                            <span class="ic-name">旅店</span>
                        </a>
                    </li>
                    <li v-bind:class="[{
                                    'active':btnOptsClass.wangba},'ele-item'] " @click="btnClick('wangba')">
                        <a>
                            <span class="ic-bk ico-wangba">
                            </span>
                            <span class="ic-name">网吧</span>
                        </a>
                    </li>
                    <li v-bind:class="[{ 'active':btnOptsClass.gssfz},'ele-item']" @click="btnClick('gssfz')">
                        <a>
                            <span class="ic-bk ico-gssfz">
                            </span>
                            <span class="ic-name">高速出口</span>
                        </a>
                    </li>
                    <li v-bind:class="[{ 'active':btnOptsClass.jichang},'ele-item']" @click="btnClick('jichang')">
                        <a>
                            <span class="ic-bk ico-jichang">
                            </span>
                            <span class="ic-name">机场</span>
                        </a>
                    </li>
                </ul>
            </div>
            <!-- 资源 -->
            <!-- <div :class="{'sub-item-wd':isShowZiyuan } " class="sub-item sub-item-ziyuan">
                <ul class="sub-section">
                    <p class="sub-title">资源</p>
                    <li v-bind:class="[{'active':btnOptsClass.yiyuan} ,'ele-item']" @click="btnClick('yiyuan')">
                        <a>
                            <span class="ic-bk ico-yiyuan">
                            </span>
                            <span class="ic-name">医院</span>
                        </a>
                    </li>
                    <li v-bind:class="[{'active':btnOptsClass.xuexiao} ,'ele-item']" @click="btnClick('xuexiao')">
                        <a>
                            <span class="ic-bk ico-xuexiao">
                            </span>
                            <span class="ic-name">学校</span>
                        </a>
                    </li>
                    <li v-bind:class="[{'active':btnOptsClass.zhengfu} ,'ele-item']" @click="btnClick('zhengfu')">
                        <a>
                            <span class="ic-bk ico-zhengfu">
                            </span>
                            <span class="ic-name">政府</span>
                        </a>
                    </li>
                    <li v-bind:class="[{'active':btnOptsClass.weixianpin} ,'ele-item']" @click="btnClick('weixianpin')">
                        <a>
                            <span class="ic-bk ico-weixianpin">
                            </span>
                            <span class="ic-name">危险品</span>
                        </a>
                    </li>
                </ul>
            </div> -->
            <!-- 画笔 -->
            <div :class="{'sub-item-wd':isShowHuabi } " class="sub-item sub-item-huabi">
                <ul class="sub-section" style="height: 174px;">
                    <p class="sub-title">画笔</p>
                    <li v-bind:class="[{'active':btnOptsClass.huayuan} ,'ele-item']" @click="btnClick('huayuan')">
                        <a>
                            <span class="ic-bk ico-huayuan">
                            </span>
                            <span class="ic-name">画圆</span>
                        </a>
                    </li>
                    <li v-bind:class="[{'active':btnOptsClass.huajuxing} ,'ele-item']" @click="btnClick('huajuxing')">
                        <a>
                            <span class="ic-bk ico-huajuxing">
                            </span>
                            <span class="ic-name">矩形</span>
                        </a>
                    </li>
                    <li v-bind:class="[{'active':btnOptsClass.duobianxing} ,'ele-item']" @click="btnClick('duobianxing')">
                        <a>
                            <span class="ic-bk ico-duobianxing">
                            </span>
                            <span class="ic-name">多边形</span>
                        </a>
                    </li>
                    <li v-bind:class="[{'active':btnOptsClass.ceju} ,'ele-item']" @click="btnClick('ceju')">
                        <a>
                            <span class="ic-bk ico-ceju">
                            </span>
                            <span class="ic-name">测距</span>
                        </a>
                    </li>
                    <li v-bind:class="[{'active':btnOptsClass.cemian} ,'ele-item']" @click="btnClick('cemian')">
                        <a>
                            <span class="ic-bk ico-cemian">
                            </span>
                            <span class="ic-name">测面</span>
                        </a>
                    </li>
                </ul>
            </div>
            <div class="item" @click="btnClick('isShowAll')">
                <i class="fa" v-bind:class="{'fa-angle-up':isShowAll, 'fa-angle-down':!isShowAll}"></i>
            </div>

        </div>

    </div>
</template>


<script>
import jQuery from 'jquery';
import eventBus from '@/event';
import { eventCollection } from '@/event/resources';
// const controlUrl=require('../../../config').controlAddress; variable
// import { controlApi } from '@/http';
// import {
//   showFullScreenLoading,
//   tryHideFullScreenLoading
// } from './../../http/screenloading';
//import { mapVar } from '@/components/maps/variable.js';

import { MapToolMenuPlugin } from '@/utils/MapToolMenuPlugin.js';
import axios from 'axios';

var TOOL_PLUGIN_TYPE = {
  chuan: { k: 'chuan', v: '环川' },
  rong: { k: 'rong', v: '环蓉' },
  firstClass: { k: 'firstClass', v: '一级' },
  secondClass: { k: 'secondClass', v: '二级' },
  thirdClass: { k: 'thirdClass', v: '三级' },
  automobile: { k: 'automobile', v: '汽车站' },
  person: { k: "person", v: "重点人员" },
  train: { k: 'train', v: '火车站' },
  airport: { k: 'airport', v: '机场' },
  dock: { k: 'dock', v: '码头' },
  toll: { k: 'toll', v: '收费站' },
  other: { k: 'other', v: '其他' },
  netbar: { k: 'netbar', v: '网吧' },
  hotel: { k: 'hotel', v: '旅店' },
  camera: { k: 'camera', v: '天网' },
  safe: { k: 'safe', v: '治安' },
  trafficPolice: { k: 'trafficPolice', v: '交警' },
  wifi: { k: 'wifi', v: '普通WIFI' },
  specialWifi: { k: 'specialWifi', v: '特种WIFI' },
  police: { k: 'police', v: '警力' },
  person: { k: 'person', v: '重点人员' },
  car: { k: 'car', v: '重点车辆' },
  circle: { k: 'circle', v: '圆形' },
  rect: { k: 'rect', v: '矩形' },
  poly: { k: 'poly', v: '多边形' },
  line: { k: 'line', v: '画线' },
  lineTunnel: { k: 'lineTunnel', v: '线通道' },
  distance: { k: 'distance', v: '测距' },
  area: { k: 'area', v: '测面积' }
};
export default {
  name: 'pGisDataLayer',
  props: ['showOpt'],
  //组件销毁前
  beforeDestroy() {},
  mounted() {
    setTimeout(() => {
      document.addEventListener('click', e => {
        let d = document.getElementsByClassName('sub-item-wd')[0];
        if (!!d) {
          if (
            d.getBoundingClientRect().bottom > e.clientY &&
            d.getBoundingClientRect().top < e.clientY &&
            d.getBoundingClientRect().left < e.clientX &&
            d.getBoundingClientRect().right > e.clientX
          ) {
          } else {
            // $(d).hide();
            this.isShowJingli = false;
            this.isShowAttention = false;
            this.isShowKadian = false;
            this.isShowGanzhiyuan = false;
            this.isShowZiyuan = false;
            this.isShowtianwang = false;
            this.isShowHuabi = false;
          }
        }
      });
      // if ( mapVar.mapInstance) {
      //    mapVar.mapInstance.map.addMapEventListener(EzEvent.MAP_ZOOMEND, level => {
      //     setTimeout(() => {
      //       if (this.showAttention) this.getVipAttentionObj(level._zoom, false);
      //     }, 200);
      //   });
      //   //EzEvent.MAP_PANEND
      //  mapVar.mapInstance.map.addMapEventListener(EzEvent.MAP_PANEND, level => {
      //     if (this.mapMoveListenerEvent) {
      //       this.mapMoveListenerEvent = false;
      //       setTimeout(() => {
      //         if ( mapVar.mapInstance.map.getZoomLevel() >= 15) {
      //           if (this.showAttention) this.getVipAttentionObj(null, true);
      //           this.mapMoveListenerEvent = true;
      //         }
      //       }, 200);
      //     }
      //   });
      // }
     
    }, 2000);
   

  },
  created: function() {
    
    let _ajax = {};
    _ajax.get = jQuery.getJSON;
    setTimeout(()=>{
       console.log("获取地图2");
      this.map=this.$parent.$children[0].map;
      console.log(this.map);
    this.menuTools = new MapToolMenuPlugin(_ajax,this.map)}
    ,2000)

    //获取地图
    console.log("获取地图");
  },
  data() {
    return {
      map:null,
      menuTools: null,
      // 左侧列表
      menu: [
        {
          name: '关注人员',
          icon: 'renyuan-icon',
          type: 'isShowAttention',
          show: false
        },
        {
          name: '天网',
          icon: 'tianwang-icon',
          type: 'isShowtianwang',
          show: false
        },
        {
          name: '警力',
          icon: 'jingli-icon',
          type: 'isShowJingli',
          show: false
        },
        {
          name: '卡点',
          icon: 'kadian-icon',
          type: 'isShowKadian',
          show: false
        },
        {
          name: '感知源',
          icon: 'ganzhiyuan-icon',
          type: 'isShowGanzhiyuan',
          show: false
        },
        {
          name: '资源',
          icon: 'ziyuan-icon',
          type: 'isShowZiyuan',
          show: false
        },
        { name: '画笔', icon: 'huabi-icon', type: 'isShowHuabi', show: false },
        { name: '清除', icon: 'huabi-icon', type: 'clear', show: false }
      ],
      // 左侧列表子菜单
      subMenu: [
        {
          subtitle: '关注对象',
          show: false,
          type: 'attention',
          items: [{ name: '关注对象', icon: 'fa fa-users', type: 'attention' }]
        }
      ],

      //maptools var
      isShowAll: true,
      isShowtianwang: false,
      isShowJingli: false,
      isShowKadian: false,
      isShowGanzhiyuan: false,
      isShowZiyuan: false,
      // isShowPen: false, //是否激活画笔功能
      isShowHuabi: false, //是否激活画笔功能
      isShowAttention: false,

      showAllExtend: true, //是否显示全省范围
      showBybuffer: false,
      currentMarkerLayerName: ['PGIS_JCSS_TXJKZY_PT'], //默认为天网数据
      addedLayer: [],
      spArray: [],
      poiOptions: [],

      buffGeometry: null, //用户设置的地理围栏
      buffGeometry_shape: null, //用户设置的地理围栏

      //设置按钮可用样式
      btnOptsClass: {
        //关注人员
        attention: false,
        //tianwang
        tianwang: false,
        //jingli
        policeju: false,
        policeli: false,
        //kadian
        roundsc: false,
        roundcd: false,
        kadianlv1: false,
        kadianlv2: false,
        kadianlv3: false,

        //卡点---通道
        k_qichezhan: false,
        k_huochezhan: false,
        k_jichang: false,
        matou: false,
        xiantongdao: false,
        //卡点-其他
        zhian: false,
        jiaojing: false,
        gssfz: false,
        kadianlv9: false,

        //ganzhiyuan
        wifi_tz: false,
        wifi_pt: false,
        hotel: false,
        wangba: false,
        jichang: false,

        //ziyuan
        yiyuan: false,
        xuexiao: false,
        zhengfu: false,
        weixianpin: false,

        //huabi
        huayuan: false,
        huajuxing: false,
        duobianxing: false,
        ceju: false,
        cemian: false
      },

      //设置关注对象 聚合与显示级别
      showJuheCity_level: 8, //小于该级别 显示21地市州聚合
      showJuheCounty_level: 15, //小于该级别 显示183个区县聚合，大于该级别 显示当前视窗范围的关注对象
      attentionpeoArr: [],
      showAttention: false,
      mapMoveListenerEvent: true,
      mapCenterXZQH: '510109',
      atPeo_city: [],
      atPeo_county: []
    };
  },
  render() {},
  methods: {
    /*设置全川范围显示*/
    setQCview: function() {
      //eventBus.$emit(eventCollection.PASSWAY_FULLVIEW);
      let location = new Point(104.064272, 30.675431);
      mapVar.mapInstance.map.centerAndZoom(location, 7);
      eventBus.$emit(eventCollection.SET_QCVIEW);
    },
    /**清除函数、清除所有加载的数据***/
    clearAll: function() {
      if (this.addedLayer.length > 0) {
        this.layerName.forEach(ly => {
           mapVar.mapInstance.clearClusterHotSpot({
            imgId: '',
            layerName: ly
          });
        });
      }
      for (const key in this.btnOptsClass) {
        if (this.btnOptsClass.hasOwnProperty(key)) {
          //let element =
          this.btnOptsClass[key] = false;
          // element=false;
        }
      }

      this.isShowJingli = false;
      this.isShowAttention = false;
      this.isShowKadian = false;
      this.isShowGanzhiyuan = false;
      this.isShowZiyuan = false;
      this.isShowtianwang = false;
      this.isShowHuabi = false;
      this.showAttention = false; //关闭关注人员显示

      mapVar.demoApp.removeAdimTw();
      mapVar.demoApp.remPolicetogs();
      mapVar.demoApp.remWifitogs();

       mapVar.mapInstance.map.removeOverlay(window.preGraph);

      //清除绘制的圆-矩形
      if (this.buffGeometry_shape != null) {
         mapVar.mapInstance.map.removeOverlay(this.buffGeometry_shape);
        this.buffGeometry_shape = null;
      }
      this.clearUserMarker();
    },
    /**显示全川范围的活动**/

    btnClick(type, _showBybuffer) {
      this.showBybuffer = false;
      if (_showBybuffer) this.showBybuffer = _showBybuffer;
      this.btnOptsClass[type] = !this.btnOptsClass[type];

      switch (type) {
        case 'huayuan':
          {
            // this.openPen('circle');
            if (this.btnOptsClass.huayuan)
              this.menuTools.addPoints(TOOL_PLUGIN_TYPE.circle.k, mapVar.demoApp);
            else
              this.menuTools.removePoints(TOOL_PLUGIN_TYPE.circle.k, mapVar.demoApp);
          }
          break;
        case 'huajuxing':
          {
            // this.openPen('rectangle');
            if (this.btnOptsClass.huajuxing)
              this.menuTools.addPoints(TOOL_PLUGIN_TYPE.rect.k, mapVar.demoApp);
            else this.menuTools.removePoints(TOOL_PLUGIN_TYPE.rect.k, mapVar.demoApp);
          }
          break;
        case 'duobianxing':
          {
            if (this.btnOptsClass.duobianxing)
              this.menuTools.addPoints(TOOL_PLUGIN_TYPE.poly.k, mapVar.demoApp);
            else this.menuTools.removePoints(TOOL_PLUGIN_TYPE.poly.k, mapVar.demoApp);
          }
          break;
        case 'ceju':
          {
            if (this.btnOptsClass.ceju)
              this.menuTools.addPoints(TOOL_PLUGIN_TYPE.distance.k, mapVar.demoApp);
            else
              this.menuTools.removePoints(TOOL_PLUGIN_TYPE.distance.k, mapVar.demoApp);

            // this.measureLength();
          }
          break;
        case 'cemian':
          {
            if (this.btnOptsClass.cemian)
              this.menuTools.addPoints(TOOL_PLUGIN_TYPE.area.k, mapVar.demoApp);
            else this.menuTools.removePoints(TOOL_PLUGIN_TYPE.area.k, mapVar.demoApp);
          }
          break;

        case 'jichang':
          {
            if (this.btnOptsClass.jichang)
              this.menuTools.addPoints(TOOL_PLUGIN_TYPE.airport.k, mapVar.demoApp);
            else
              this.menuTools.removePoints(TOOL_PLUGIN_TYPE.airport.k, mapVar.demoApp);
            break;

            //this.menuTools.addPoints(TOOL_PLUGIN_TYPE.airport.k, mapVar.demoApp)
            // this.setJiChangtog();
          }
          break;

        //kadian
        case 'kadianlv1':
          {
            if (this.btnOptsClass.kadianlv1)
              this.menuTools.addPoints(TOOL_PLUGIN_TYPE.firstClass.k, mapVar.demoApp);
            else
              this.menuTools.removePoints(
                TOOL_PLUGIN_TYPE.firstClass.k,
                mapVar.demoApp
              );
          }
          break;
        case 'kadianlv2':
          {
            if (this.btnOptsClass.kadianlv2)
              this.menuTools.addPoints(TOOL_PLUGIN_TYPE.secondClass.k, mapVar.demoApp);
            else
              this.menuTools.removePoints(
                TOOL_PLUGIN_TYPE.secondClass.k,
                mapVar.demoApp
              );
          }
          break;
        case 'kadianlv3':
          {
            if (this.btnOptsClass.kadianlv3)
              this.menuTools.addPoints(TOOL_PLUGIN_TYPE.thirdClass.k, mapVar.demoApp);
            else
              this.menuTools.removePoints(
                TOOL_PLUGIN_TYPE.thirdClass.k,
                mapVar.demoApp
              );
          }
          break;

        case 'k_qichezhan':
          {
            if (this.btnOptsClass.k_qichezhan)
              this.menuTools.addPoints(TOOL_PLUGIN_TYPE.automobile.k, mapVar.demoApp);
            else
              this.menuTools.removePoints(
                TOOL_PLUGIN_TYPE.automobile.k,
                mapVar.demoApp
              );
          }
          break;
        case 'k_huochezhan':
          {
            if (this.btnOptsClass.k_huochezhan)
              this.menuTools.addPoints(TOOL_PLUGIN_TYPE.train.k, mapVar.demoApp);
            else this.menuTools.removePoints(TOOL_PLUGIN_TYPE.train.k, mapVar.demoApp);
          }
          break;
        case 'k_jichang':
          {
            if (this.btnOptsClass.k_jichang)
              this.menuTools.addPoints(TOOL_PLUGIN_TYPE.airport.k, mapVar.demoApp);
            else
              this.menuTools.removePoints(TOOL_PLUGIN_TYPE.airport.k, mapVar.demoApp);
          }
          break;
        case 'matou':
          {
            if (this.btnOptsClass.matou)
              this.menuTools.addPoints(TOOL_PLUGIN_TYPE.dock.k, mapVar.demoApp);
            else this.menuTools.removePoints(TOOL_PLUGIN_TYPE.dock.k, mapVar.demoApp);
          }
          break;
        case 'xiantongdao':
          {
            if (this.btnOptsClass.xiantongdao)
              this.menuTools.addPoints(TOOL_PLUGIN_TYPE.lineTunnel.k, mapVar.demoApp);
            else
              this.menuTools.removePoints(
                TOOL_PLUGIN_TYPE.lineTunnel.k,
                mapVar.demoApp
              );
          }
          break;
        case 'zhian':
          {
            if (this.btnOptsClass.zhian)
              this.menuTools.addPoints(TOOL_PLUGIN_TYPE.safe.k, mapVar.demoApp);
            else this.menuTools.removePoints(TOOL_PLUGIN_TYPE.safe.k, mapVar.demoApp);
          }
          break;

        case 'jiaojing':
          {
            if (this.btnOptsClass.jiaojing)
              this.menuTools.addPoints(
                TOOL_PLUGIN_TYPE.trafficPolice.k,
                mapVar.demoApp
              );
            else
              this.menuTools.removePoints(
                TOOL_PLUGIN_TYPE.trafficPolice.k,
                mapVar.demoApp
              );
          }
          break;
        case 'kadianlv9':
          {
            if (this.btnOptsClass.kadianlv9)
              this.menuTools.addPoints(TOOL_PLUGIN_TYPE.other.k, mapVar.demoApp);
            else this.menuTools.removePoints(TOOL_PLUGIN_TYPE.other.k, mapVar.demoApp);
          }
          break;

        //kadian --------------------------------------------end

        case 'attention':
          {  
            // console.log(this.map);
            // console.log(this.$parent.$children[0].map);
            if (this.showAttention)
            this.menuTools.addPoints(TOOL_PLUGIN_TYPE.person.k, this.map);
          else this.menuTools.removePoints(TOOL_PLUGIN_TYPE.person.k, this.map);
            // this.showAttention = !this.showAttention;
            // //if (this.showAttention)
            // this.getVipAttentionObj(null, false);
          }
          break;
        case 'roundsc': //环川
          // this.setHCpasstog();
          if (this.btnOptsClass.roundsc)
            this.menuTools.addPoints(TOOL_PLUGIN_TYPE.chuan.k, mapVar.demoApp);
          else this.menuTools.removePoints(TOOL_PLUGIN_TYPE.chuan.k, mapVar.demoApp);

          break;
        case 'roundcd': //环蓉
          // this.setHRpasstog();
          if (this.btnOptsClass.roundcd)
            this.menuTools.addPoints(TOOL_PLUGIN_TYPE.rong.k, mapVar.demoApp);
          else this.menuTools.removePoints(TOOL_PLUGIN_TYPE.rong.k, mapVar.demoApp);

          break;
        case 'policeju': //警局
          this.setPolicestationtog();

          break;

        case 'policeli': //警力
          //this.setPolicetog();
          if (this.btnOptsClass.policeli)
            this.menuTools.addPoints(TOOL_PLUGIN_TYPE.police.k, mapVar.demoApp);
          else this.menuTools.removePoints(TOOL_PLUGIN_TYPE.police.k, mapVar.demoApp);

          break;

        case 'hotel': // 旅店
          //this.setHoteltog();
          if (this.btnOptsClass.hotel)
            this.menuTools.addPoints(TOOL_PLUGIN_TYPE.hotel.k, mapVar.demoApp);
          else this.menuTools.removePoints(TOOL_PLUGIN_TYPE.hotel.k, mapVar.demoApp);

          break;

        case 'tianwang': //天网
          // this.setVideotog();
          if (this.btnOptsClass.tianwang)
            this.menuTools.addPoints(TOOL_PLUGIN_TYPE.camera.k,  this.map);
          else this.menuTools.removePoints(TOOL_PLUGIN_TYPE.camera.k,  this.map);

          break;
        case 'wangba': //网吧
          if (this.btnOptsClass.wangba)
            this.menuTools.addPoints(TOOL_PLUGIN_TYPE.netbar.k, this.map);
          else this.menuTools.removePoints(TOOL_PLUGIN_TYPE.netbar.k, this.map);

          //  this.setNethometog();
          break;
        case 'importcs': //重要场所
          //this.menuTools.addPoints(TOOL_PLUGIN_TYPE.netbar.k, mapVar.demoApp);
          // this.setZdcstog();
          break;
        case 'wifi_tz': //wifi
          this.setWifitog('tz');
          // this.menuTools.addPoints(TOOL_PLUGIN_TYPE.netbar.k, mapVar.demoApp);
          break;
        case 'wifi_pt':
          this.setWifitog('pt');
          break;
        case 'gssfz': //高速收费站
          // this.setGSSFZ();
          if (this.btnOptsClass.gssfz)
            this.menuTools.addPoints(TOOL_PLUGIN_TYPE.toll.k, mapVar.demoApp);
          else this.menuTools.removePoints(TOOL_PLUGIN_TYPE.toll.k, mapVar.demoApp);
          break;

        case 'isShowAll': //显示全域范围信息
          this.isShowAll = !this.isShowAll;
          if (!this.isShowAll) {
            this.isShowtianwang = false;
            this.isShowJingli = false;
            this.isShowKadian = false;
            this.isShowGanzhiyuan = false;
            this.isShowZiyuan = false;
            this.isShowAttention = false;
            this.isShowHuabi = false;
          }
          break;
        case 'isShowtianwang':
          this.isShowtianwang = !this.isShowtianwang;
          if (this.isShowtianwang) {
            this.isShowJingli = false;
            this.isShowKadian = false;
            this.isShowGanzhiyuan = false;
            this.isShowZiyuan = false;
            this.isShowAttention = false;
            this.isShowHuabi = false;
            //this.isShowAll = false;
          }
          break;
        case 'isShowJingli':
          this.isShowJingli = !this.isShowJingli;
          if (this.isShowJingli) {
            this.isShowAttention = false;
            this.isShowKadian = false;
            this.isShowGanzhiyuan = false;
            this.isShowZiyuan = false;
            this.isShowtianwang = false;
            this.isShowHuabi = false;
            //this.isShowAll = false;
          }
          break;
        case 'isShowKadian':
          this.isShowKadian = !this.isShowKadian;
          if (this.isShowKadian) {
            this.isShowAttention = false;
            this.isShowJingli = false;
            this.isShowGanzhiyuan = false;
            this.isShowZiyuan = false;
            this.isShowtianwang = false;
            this.isShowHuabi = false;
            //this.isShowAll = false;
          }
          break;
        case 'isShowGanzhiyuan':
          this.isShowGanzhiyuan = !this.isShowGanzhiyuan;
          if (this.isShowGanzhiyuan) {
            this.isShowAttention = false;
            this.isShowJingli = false;
            this.isShowKadian = false;
            this.isShowZiyuan = false;
            this.isShowtianwang = false;
            this.isShowHuabi = false;
            //this.isShowAll = false;
          }
          break;
        case 'isShowZiyuan':
          this.isShowZiyuan = !this.isShowZiyuan;
          if (this.isShowZiyuan) {
            this.isShowJingli = false;
            this.isShowKadian = false;
            this.isShowGanzhiyuan = false;
            this.isShowtianwang = false;
            this.isShowAttention = false;
            this.isShowHuabi = false;
            //this.isShowAll = false;
          }
          break;
        case 'isShowAttention':
          this.isShowAttention = !this.isShowAttention;
          if (this.isShowAttention) {
            this.isShowZiyuan = false;
            this.isShowJingli = false;
            this.isShowKadian = false;
            this.isShowGanzhiyuan = false;
            this.isShowtianwang = false;
            this.isShowHuabi = false;
            //this.isShowAll = false;
          }
          break;

        case 'isShowHuabi': //开始画笔功能
          {
            this.isShowHuabi = !this.isShowHuabi;
            if (this.isShowHuabi) {
              this.isShowZiyuan = false;
              this.isShowJingli = false;
              this.isShowKadian = false;
              this.isShowGanzhiyuan = false;
              this.isShowtianwang = false;
              this.isShowAttention = false;
              //this.isShowAll = false;
            }
          }
          break;

        case 'clear':
          this.menuTools._removeAllDrawPoints();
          // this.clearAll();
          break;

        case 'showAll':
         this.isShowAttention=true;
          this.isShowZiyuan = true;
          this.isShowJingli = true;
          this.isShowKadian = true;
          this.isShowGanzhiyuan = true;
          this.isShowtianwang = true;
          this.isShowHuabi = true;
          break;
      }
    },

    getJWD_By_XZQHDM: function(xzqhdm) {
      //chongqing 单独处理
      if (xzqhdm == '5102') {
        return { lat: 29.54498, lng: 106.56464 };
      } else {
        if (PolygonArray.length > 0) {
          if (xzqhdm.length == 4) {
            for (var i = 0; i < 21; i++) {
              var item = PolygonArray[i];
              if (item.dwdm == xzqhdm) {
                return { lat: item.wd, lng: item.jd };
              }
            }
          } else if (xzqhdm.length == 6) {
            for (var j = 21; j < PolygonArray.length; j++) {
              var item = PolygonArray[j];
              if (item.dwdm == xzqhdm) {
                return { lat: item.wd, lng: item.jd };
              }
            }
          }
        }
      }
    },

    getXZQHDM_by_JWD: function(lat, lng) {
      if (PolygonArray.length > 0) {
        for (let i = 0; i < 21; i++) {
          let item = PolygonArray[i];
          let array = item.porints.split(',');
          var l = new Polygon(item.porints);
          //mm._polylatlngBounds.contains([lat,lng])
          if (l._polylatlngBounds.contains([lat, lng])) {
            return item.dwdm;
            l = null;
          }
        }
      }
    },

    getXZQHDM_by_JWD2: function(lat, lng) {
      if (PolygonArray.length > 0) {
        for (let i = 0; i < PolygonArray.length; i++) {
          let item = PolygonArray[i];
          if (item.wd == lat && item.jd == lng) {
            return item.dwdm;
          }
        }
      }
    },
    /**获取重点关注对象**/
    getVipAttentionObj: function(lvl, isMove) {
      if (!this.showAttention) {
        for (var i = 0; i < this.attentionpeoArr.length; i++) {
           mapVar.mapInstance.removeOverlayPoint(this.attentionpeoArr[i]);
        }
        this.attentionpeoArr = [];
        //修改成移除某个元素
        let index = this.currentMarkerLayerName.indexOf('VIPATTENTION');
        this.currentMarkerLayerName.splice(index, 1);

        return;
      }

      let level = '';
      if (!lvl) level = mapVar.mapInstance.map.getZoomLevel();
      else level = lvl;
      if (this.currentMarkerLayerName.indexOf('VIPATTENTION') < 0)
        this.currentMarkerLayerName.push('VIPATTENTION');
      console.log(level);
      //showJuheCity_level:8,//小于该级别 显示21地市州聚合 一次请求所有数据
      //showJuheCounty_level:15,//小于该级别 显示183个区县聚合， 一次请求所有数据
      //大于15级 显示当前视窗范围的关注对象 首先获取当前地图中心点的区县数据，然后循环请求周边数据

    
      this.menuTools.removePoints('vipCity');
      this.menuTools.removePoints('vipcounty');
      this.menuTools.removePoints('vipsingle');

      //showJuheCity_level:8,//小于该级别 显示21地市州聚合 一次请求所有数据
      //data:{xzqhdm:51\5101,Zxqhlength:4\6\9}
      if (level < this.showJuheCity_level) {
        if (this.atPeo_city.length == 0) {
          let pac = '51';
          return controlApi
            .getZHXSTJ({ xzqhdm: '51', xzqhlength: 4 })
            .then(data => {
              this.atPeo_city = data.data;
              this.menuTools.addCustomePoints('vipCity', this.atPeo_city,'tongdao_person');
              //this.setVipAttentionObj(data.data, 'city');
            });
        } else {
            this.menuTools.addCustomePoints('vipcounty',this.atPeo_city,'tongdao_person');
          //this.setVipAttentionObj(this.atPeo_city, 'county');
        }
      } else if (level < this.showJuheCounty_level) {
        //showJuheCounty_level:15,//小于该级别 显示183个区县聚合， 一次请求所有数据
        if (this.atPeo_county.length == 0) {
         
          return controlApi
            .getZHXSTJ({ xzqhdm: '51', xzqhlength: 6 })
            .then(data => {
              this.atPeo_county = data.data;
             // this.setVipAttentionObj(data.data, 'county');
             this.menuTools.addCustomePoints('vipCity', this.atPeo_county,'tongdao_person')
            });
        } else {
            this.menuTools.addCustomePoints('vipcounty',this.atPeo_county,'tongdao_person');
         // this.setVipAttentionObj(this.atPeo_county, 'county');
        }
      } else {
        //大于15级 显示当前视窗范围的关注对象 首先获取当前地图中心点的区县数据，然后循环请求周边数据
        //data:{pageNum:1,pageSize:10,xzqhdm:51,zxwd:,zdwd,zxjd,zdjd}
        let max_lat = mapVar.mapInstance.map.getBoundsLatLng()._northEast.lat;
        let min_lat = mapVar.mapInstance.map.getBoundsLatLng()._southWest.lat;
        let max_lng = mapVar.mapInstance.map.getBoundsLatLng()._northEast.lng;
        let min_lng = mapVar.mapInstance.map.getBoundsLatLng()._southWest.lng;

        if (isMove == true) {
          return (
            controlApi
              //.getBKDYZHXS({ pageNum: 1, pageSize:9999999,xzqhdm:this.mapCenterXZQH})
              .getBKDYZHXS({
                pageNum: 1,
                pageSize: 100,
                xzqhdm: '',
                zxwd: min_lat,
                zdwd: max_lat,
                zxjd: min_lng,
                zdjd: max_lng
              })
              .then(data => {
                this.menuTools.addCustomePoints('vipsingle',data.data.rows,'tongdao_person');
                //this.setVipAttentionObj(data.data.rows, 'single');
              })
          );
        } else {
          return (
            controlApi
              .getBKDYZHXS({
                pageNum: 1,
                pageSize: 9999999,
                xzqhdm: this.mapCenterXZQH
              })
              //.getBKDYZHXS({ pageNum: 1, pageSize: 100,xzqhdm:"510109",zxwd:min_lat,zdwd:max_lat ,zxjd:min_lng,zdjd:max_lng})
              .then(data => {
                this.menuTools.addCustomePoints('vipsingle',data.data.rows,'tongdao_person');
               // this.setVipAttentionObj(data.data.rows, 'single');
              })
          );
        }
      }
      //getZHXSTJ
    },

    /***重点人员撒点****/
    setVipAttentionObj: function(data, level) {
      if (this.buffGeometry_shape != null) {
        data = this.fillterDataByShape(data, level);
      }

      if (data.length > 0) {
        if (level == 'single') {
          console.log(data);
          let _this = this;
          data.forEach((item, index) => {
            var id = 'gzry' + level + index;
            if (item.ksJd && item.ksWd) {
              _this.attentionpeoArr.push(id);
              // var popupContent = '';
              // <el-radio label="1" value="1">小型汽车</el-radio>
              // <el-radio label="2" value="2">大型汽车</el-radio><br/>
              // <el-radio label="3" value="3">农用运输车</el-radio>
              // <el-radio label="4" value="4">轻便摩托车</el-radio>
              // <el-radio label="5" value="5">两、三轮摩托车</el-radio><br/>
              // <el-radio label="6" value="6">教练汽车挂车</el-radio>
              // <el-radio label="7" value="7">挂车</el-radio>
              // <el-radio label="8" value="8">警用汽车</el-radio>
              // <el-radio label="9" value="9">警用摩托</el-radio>
              let marker =  mapVar.mapInstance.addOverlayPoint(
                id,
                parseFloat(item.ksJd),
                parseFloat(item.ksWd),
                'tongdao_person',
                '',
                item.counts,
                false
              );
              marker.addListener('click', e => {
                var popupContent = _this.showVipAttentionDetail(item);

                marker.openInfoWindowHtml(popupContent);
                let domelement = document.getElementById('id_' + item.zjhm);
                if (!!domelement) {
                  document
                    .getElementById('id_' + item.zjhm)
                    .addEventListener('click', () => {
                      eventBus.$emit(eventCollection.PASSWAY_VIEWDANGAN, {
                        title: item.xm,
                        zjhm: item.zjhm,
                        type: item.zjlx,
                        fjxx: '1'
                      });
                    });
                }
              });
            }
          });
        } else {
          data.forEach((item, index) => {
            let latlng = this.getJWD_By_XZQHDM(item.xzqhdm);

            if (latlng != undefined) {
              //if (item.ksJd && item.ksWd) {
              var id = 'gzry' + level + index;
              this.attentionpeoArr.push(id);

              let marker =  mapVar.mapInstance.addOverlayPoint(
                id,
                parseFloat(latlng.lng),
                parseFloat(latlng.lat),
                'tongdao_person',
                '',
                item.counts,
                false
              );
              // if (level == "city")
              //     this.atPeo_city.push(marker);
              // else if (level == "county")
              //     this.atPeo_county.push(marker);
              marker.addListener('click', e => {
                let xzqhdm = this.getXZQHDM_by_JWD2(e.latlng.lat, e.latlng.lng);
                this.mapCenterXZQH = xzqhdm;
                if (xzqhdm.length == 4) {
                  //从显示市 到显示县
                   mapVar.mapInstance.setMapCenter(e.latlng.lng, e.latlng.lat, 9);
                } else if (xzqhdm.length == 6) {
                  //从区县到single
                   mapVar.mapInstance.setMapCenter(e.latlng.lng, e.latlng.lat, 16);
                }
              });
            }
          });
        }
      }
    },
    /**显示重点关注人员的详细信息*/
    showVipAttentionDetail: function(item) {
      let xsly = item.xsly;
      let xslypt = item.xslypt;
      let popupContent = '';
      let carpic = item.ksDz;
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
        }
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
        /***xsly :  02 网吧
                                03 旅店
                                04 
                                06 
                                07
                                11
                                12
                                13
                                14
                                15
                                16
                                17
                                18
                                24
                    */
        var title = '';
        if (xsly == '02') {
          title = '上网';
        } else if (xsly == '03') {
          title = '住店';
        }
        let url = '';

        popupContent =
          '<div class="card pointmsg">' +
          '<div class="card-header">' +
          title +
          ' </div>' +
          '<div class="card-body">' +
          '<img style="padding-right: 5px;height:80px;width:80px;background-size: cover;background-repeat: no-repeat;background-position: center; background-image:url(' +
          carpic +
          ')">' +
          '<ul>' +
          '<li><span>人员姓名：</span>' +
          item.xm +
          '</li>' +
          '<li><span>起始时间：</span>' +
          item.xsjssj +
          '</li>' +
          '<li><span>结束时间：</span>' +
          item.ksCssj +
          '</li>' +
          '<li><span>身份证号：</span><span id="id_' +
          item.zjhm +
          '" class="checkItem">' +
          item.zjhm +
          '</span></li>' +
          '<li><span>场所位置：</span>' +
          item.ksCsmc +
          '</li>' +
          '<li><span>人员位置：</span>' +
          item.ksWz +
          '</li>' +
          '</ul>' +
          '</div></div>';
      }
      return popupContent;
    },
    /***根据空间属性过滤数据**/
    fillterDataByShape: function(data, level) {
      let fillterData = [];
      let _this = this;
      let bounds = '';
      if (_this.buffGeometry_shape.getGeometryType() == 'Circle') {
        bounds = _this.buffGeometry_shape.getMBR();
      } else {
        bounds = _this.buffGeometry_shape._polylatlngBounds;
      }
      data.forEach(d => {
        if (level == 'single') {
        } else {
          let latlng = _this.getJWD_By_XZQHDM(d.xzqhdm);
          if (latlng == undefined) {
            d.ksWd = 0;
            d.ksJd = 0;
          } else {
            d.ksWd = latlng.lat;
            d.ksJd = latlng.lng;
          }
        }
        if (d.ksJd && d.ksWd) {
          if (bounds.contains([parseFloat(d.ksWd), parseFloat(d.ksJd)])) {
            fillterData.push(d);
          }
        }
      });
      return fillterData;
    },

    /*-------------------------------------------（环川、环蓉、警力、网吧等）八类数据获取start------------------------------------------------*/

    /*视频获取开始   ---天网---*/
    //视频按钮切换方法
    setVideotog: function(showVideo) {
      //判断是否根据缓冲区显示数据
      if (this.buffGeometry_shape != null) {
        if (this.btnOptsClass.tianwang == true) {
          this.spacequery_tianwang('PGIS_JCSS_TXJKZY_PT');
        } else {
          this.clearUserMarker();
          //修改成移除某个元素
          let index = this.currentMarkerLayerName.indexOf(
            'PGIS_JCSS_TXJKZY_PT'
          );
          this.currentMarkerLayerName.splice(index, 1);
        }
      } else {
        this.clearUserMarker();
        if (this.btnOptsClass.tianwang == true) {
          let gxdwdm = '51';
          mapVar.demoApp.loadAdimTw(gxdwdm);
        } else {
          mapVar.demoApp.removeAdimTw();
        }
      }
    },
    //视频部署
    videoBS: function() {
      var option = {
        proxyurl: 'http://80.2.21.41:4764/api/proxy',
        image: mapVar.imgFactory.tw,
        isScale: true
      };
      var callback = function(data) {
        var popupContent = '';
        popupContent += '<div><p>+data.id+</p></div>';
        var popData = {
          name: data.title.getTitle(),
          x: data.values.coordinate[0],
          y: data.values.coordinate[1],
          markerLayer: popupContent
        };
        opgisMap.openInfoWindow(map, popData, '');
        //console.log(data);
      };

      videox = opgisMap.showMarkerMap(
        map,
        'PGIS_JCSS_TXJKZY_PT',
        '',
        '',
        '',
        option,
        callback,
        'xtgl',
        'TCCXFW5100',
        '',
        '',
        ''
      );
    },

    /*视频获取结束*/
    /*警察局撒点开始*/
    setPolicestationtog: function(showPoliceStation) {
      //   if (showPoliceStation) {
      //     this.policestationtog = showPoliceStation;
      //   } else {
      //     this.policestationtog = !this.policestationtog;
      //   }

      var format = { MC: '名称', LXDH: '联系电话', DZ: '地址' };
      if (this.buffGeometry_shape != null) {
        //显示范围内
        this.spaceQuery('DWXX_GAJG_PT');
      } else {
        this.markerOnMap(
          'DWXX_GAJG_PT',
          null,
          'kakou',
          {
            title: '公安机关',
            format: format
          },
          this.btnOptsClass.policeju
        );
      }
    },
    /*警察局撒点结束*/
    /*警力获取开始*/
    setPolicetog: function(showpolicetog) {
      if (this.btnOptsClass.policeli == true) {
        mapVar.demoApp.setPolicetog();
        //mapVar.demoApp.loadPolice();
      } else {
        mapVar.demoApp.remPolicetogs();
      }
    },

    //警力部署  --没有用到
    policeBS: function(datas) {
      // let datas=JSON.parse(data);
      var optionUserMarker = {
        image: mapVar.imgFactory.jl,
        isScale: true,
        isShowTitle: true
      };
      var callback = function(datas) {
        var gpsId = datas.id;
        var urlStr = encodeURI('http://80.2.30.21:8110/jlbb/getBBInfo');

        let _this = this;
        $.ajax({
          url: urlStr,
          type: 'get',
          data: { gpsid: gpsId },
          dataType: 'text',
          success: function(msg) {
            var datass = JSON.parse(msg);

            //var bblxmc=datass.data.bblxmc;
            //
            var clxkfs = datass.data.clxkfs;
            for (var i = 0; i < clxkfs.length; i++) {
              var cph = clxkfs[i].cph;
              var clmjs = clxkfs[i].clmjs;
              var html =
                '<table class="table table-condensed table-datatable table-custom" id="data-table1"><thead><tr><th style="width:10%">基本信息</th></tr></thead></table>';
              for (var j = 0; j < clmjs.length; j++) {
                var clmjbh = clmjs[j].clmjbh;
                var clmjxm = clmjs[j].clmjxm;
                html +=
                  '<table cellpadding="4"><tr><td><a style="font-size:14px;color:#000;display:inline-block; text-align:left; margin:10px">' +
                  '警车车牌号：' +
                  cph +
                  ',&nbsp;&nbsp;&nbsp;' +
                  '负责人编号：' +
                  clmjbh +
                  ',&nbsp;&nbsp;&nbsp;' +
                  '负责人姓名：' +
                  clmjxm +
                  '</a></td></tr></table>';
                $('#clmjs').html(html);
              }
              var clzfrs = clxkfs[i].clfzrs;
              var html1 =
                '<table class="table table-condensed table-datatable table-custom" id="data-table1"><thead><tr><th style="width:10%">警员明细</th></tr></thead></table>';
              for (var j = 0; j < clzfrs.length; j++) {
                var clfzrbh = clzfrs[j].clfzrbh;
                var clfzrxm = clzfrs[j].clfzrxm;
                html1 +=
                  '<table cellpadding="4"><tr><td><a style="font-size:14px;color:#000;display:inline-block; text-align:left; margin:10px">' +
                  '警员编号:' +
                  clfzrbh +
                  '<br/>警员姓名:' +
                  clfzrxm +
                  '</a></td></tr></table>';
                $('#clzfrs').html(html1);
              }
            }

            var zbbbs = datass.data.zbbbs;
            var html2 =
              '<table class="table table-condensed table-datatable table-custom" id="data-table1"><thead><tr><th style="width:20%">装备信息</th></tr></thead></table>';
            for (var i = 0; i < zbbbs.length; i++) {
              var zbmc = zbbbs[i].zblxmc;
              var zbsl = zbbbs[i].zbsl;
              html2 +=
                '<table cellpadding="1"><tr><td><a style="font-size:14px;color:#000; text-align:left; margin:2px">' +
                zbmc +
                '(' +
                zbsl +
                ')</a></td></tr></table>';
              $('#zbbbs').html(html2);
            }
          },
          error: function(err) {
            _this.$message({
              message: '报备服务器连接失败！',
              type: 'warning'
            });
          }
        });

        var popupContent = '';
        popupContent +=
          '<div><div id="clmjs"></div><div id="clzfrs"></div><div id="zbbbs"></div></div>';
        var popData = {
          name: datas.title.getTitle(),
          x: datas.values.coordinate[0],
          y: datas.values.coordinate[1],
          markerLayer: popupContent
        };
        opgisMap.openInfoWindow(map, popData, '');
      };

      policeB = opgisMap.showMarkerMap(
        map,
        '',
        '',
        '',
        datas,
        optionUserMarker,
        callback,
        '',
        ''
      );
    },
    /*警力获取结束*/
    /*环川卡点开始*/
    setHCpasstog: function(showHc) {
      //zk 重写 显示环川卡点信息
      var format = {
        LX: '卡点类型',
        SHIJXZQH: '所在市州',
        XIANJXZQH: '所在区县'
      };

      this.markerOnMap(
        'PGIS_JTGL_HCGAJZZ_PT',
        null,
        'kakou',
        {
          title: '卡点',
          format: format
        },
        this.btnOptsClass.roundsc
      );
    },
    /*环川卡点结束*/
    /*环蓉卡点开始*/
    setHRpasstog: function(showHr) {
      var format = {
        LX: '卡点类型',
        SHIJXZQH: '所在市州',
        XIANJXZQH: '所在区县'
      };

      this.markerOnMap(
        'PGIS_JTGL_HRZAQD_PT',
        null,
        'kakou',
        {
          title: '卡点',

          format: format
        },
        this.btnOptsClass.roundcd
      );
    },
    /*环蓉卡点结束*/

    /*感知源撒点开始******************************************************/

    /*旅馆撒点开始*/
    setHoteltog: function(showhotel) {
      var format = {
        MC: '名称',
        DZ: '地址',
        SHIJXZQH: '所在市州',
        XIANJXZQH: '所在区县'
      };
      this.markerOnMap(
        'JWZH_ZAGL_LD_PT',
        null,
        'lvdian',
        {
          title: '旅店',
          format: format
        },
        this.btnOptsClass.hotel
      );
    },
    /*旅馆撒点结束*/

    /*网吧撒点开始*/
    setNethometog: function(showNetHome) {
      var format = {
        MC: '名称',
        DZMC: '地址',
        SHIJXZQH: '所在市州',
        XIANJXZQH: '所在区县'
      };
      this.markerOnMap(
        'JWZH_ZAGL_WB_PT',
        null,
        'wangba',
        {
          title: '网吧',
          //template: template,
          format: format
        },
        this.btnOptsClass.wangba
      );
    },
    /*网吧撒点结束*/

    /*WIFI */

    setWifitog: function(showWifi) {
      if (this.btnOptsClass.wifi_tz == true) {
        this.menuTools.addPoints(TOOL_PLUGIN_TYPE.specialWifi.k, mapVar.demoApp);
      } else {
        this.menuTools.removePoints(TOOL_PLUGIN_TYPE.specialWifi.k, mapVar.demoApp);
      }
      if (this.btnOptsClass.wifi_pt == true) {
        this.menuTools.addPoints(TOOL_PLUGIN_TYPE.wifi.k, mapVar.demoApp);
      } else {
        this.menuTools.removePoints(TOOL_PLUGIN_TYPE.wifi.k, mapVar.demoApp);
      }
    },
    policeWifiu: function(datas) {
      var optionUserMarker = {
        image: mapVar.imgFactory.wifi,
        isScale: true,
        isShowTitle: true
      };
      var callback = function(datas) {
        var popupContent = '';
        popupContent += '';
        var popData = {
          name: datas.title.getTitle(),
          x: datas.values.coordinate[0],
          y: datas.values.coordinate[1],
          markerLayer: popupContent
        };
        opgisMap.openInfoWindow(map, popData, '');
      };

      wifiway = opgisMap.showMarkerMap(
        map,
        '',
        '',
        '',
        datas,
        optionUserMarker,
        callback,
        '',
        ''
      );
    },
    /*WIFI 结束*/

    /*高速收费站撒点start*/

    setGSSFZ: function(showgssfz) {
      var format = {
        LX: '类型',
        MC: '名称',
        SZDMC: '所在地',
        XIANJXZQH: '所在区县'
      };
      this.markerOnMap(
        'CS_GSSFZ_PT',
        null,
        'kakou',
        {
          title: '高速收费站点',
          format: format
        },
        this.btnOptsClass.gssfz
      );
      // if (this.gssfztog == true) {

      //     var option = {
      //         proxyurl: 'http://80.2.21.41:4764/api/proxy',
      //         image: '../../static/pgis/images/gssfz.png',
      //         isScale: false
      //     };
      //     var callback = function (data) {
      //         var popupContent = '';
      //         popupContent += "<p>" + data.id + "</p>"
      //         var popData = {
      //             layerName: data.values.LAYERNAME,
      //             data: data
      //         }
      //         opgisMap.openInfoWindow(map, popData, '')

      //     };

      //     gssfzway = opgisMap.showMarkerMap(map, "CS_GSSFZ_PT", '', '', '', option, callback, "xtgl", "TCCXFW5100", '', '', '');

      // } else {

      //     opgisMap.removeOverLayer(map, [gssfzway]);
      // }
    },

    /*高速收费站撒点end*/

    /*******************************************************感知源撒点结束*/
    /*重点场所撒点开始*/
    setZdcstog: function(showzdcs) {
      if (showzdcs) {
        this.zdcstog = showzdcs;
      } else {
        this.zdcstog = !this.zdcstog;
      }

      // if (this.zdcstog == true) {

      //     var option = {
      //         proxyurl: 'http://80.2.21.41:4764/api/proxy',
      //         image: '../../static/pgis/images/zdcs.png',
      //         isScale: false
      //     };
      //     var callback = function (data) {
      //         var popupContent = '';
      //         popupContent += "<p>" + data.id + "</p>"
      //         var popData = {
      //             layerName: data.values.LAYERNAME,
      //             data: data
      //         }
      //         opgisMap.openInfoWindow(map, popData, '')

      //     };

      //     zdcsway = opgisMap.showMarkerMap(map, "JWZH_DWXX_DZJG_PT", '', '', '', option, callback, "xtgl", "TCCXFW5100", '', '', '');

      // } else {

      //     opgisMap.removeOverLayer(map, [zdcsway]);
      // }
      if (this.zdcstog) {
        var template =
          '<table class="zebra"><tbody>' +
          '<tr><td>卡点类型</td><td>{LX}</td></tr>' +
          '<tr><td>所在市州</td><td>{SHIJXZQH}</td></tr>' +
          '<tr><td>所在区县</td><td>{XIANJXZQH}</td></tr>';
        template += '</tbody></table>';
        var paramTwo = {
          hotSpotClick: function(pop) {
            var data = pop.contentData.customs;
            var title = data.MC ? data.MC : '卡点';
            var showInfoFormat = {
              LX: '卡点类型',
              SHIJXZQH: '所在市州',
              XIANJXZQH: '所在区县'
            };
            $('.leaflet-popup-content').css('width', '330px !important');
            $('.leaflet-popup-content').css('height', '200px !important');
            $('.leaflet-popup-content').attr('white-space', 'nowrap');
            var html =
              "<div class='KKItem' style='width: 300px;background: #0d283c;border:0px solid #ddd;position:relative;padding-bottom:10px;'>" +
              "<div class='infoMessDiv' title='" +
              title +
              "' style='cursor:default;width:100%;height: 30px;background: #09385a;line-height: 30px;border-bottom: #D0D0D0;padding-left: 10px;font-size: 14px;color: #fff;'>" +
              title +
              '</div>';
            for (let key in showInfoFormat) {
              if (data[key])
                html +=
                  "<div class='infoMessDiv' style='padding-top: 3px; padding-bottom:3px;'><span style='margin-left: 10px;font-size:13px;color:#fff'>" +
                  showInfoFormat[key] +
                  "</span>：<span style='font-size:13px;color:#fff' title='" +
                  showInfoFormat[key] +
                  "'>" +
                  data[key] +
                  '</span></div>';
            }

            html += '</div>';
            pop.setContent(html);
          },
          colums: {
            LX: '卡点类型',
            SHIJXZQH: '所在市州',
            XIANJXZQH: '所在区县'
          },
          template: template,
          //where:" AND XIANJXZQHDM:*"+gxdwdm+"*",
          icon: 'kakou'
        };
         mapVar.mapInstance.addHotSpot('JWZH_DWXX_DZJG_PT', 'kakou', paramTwo);
      } else {
         mapVar.mapInstance.clearClusterHotSpot({
          imgId: 'kd',
          layerName: 'JWZH_DWXX_DZJG_PT'
        });
      }
    },
    /*重点场所撒点结束*/

    /*感知源区域撒点开始*/

    setWifitog1: function() {
      let self = this;
      this.wifitog = !this.wifitog;
      if (this.wifitog == true) {
        mapVar.demoApp.setWifitog();
      } else {
        mapVar.demoApp.remWifitogs();
      }
      // if (this.wifitog == true) {

      //     map.on("click", function (evt) {

      //         popCord = null;

      //         if (showAreaMapByPoint_tcbq == null) {

      //             var pixel = evt.pixel;
      //             let lng = evt.coordinate[0];
      //             let lat = evt.coordinate[1];

      //             var option = {
      //                 "name": "",
      //                 "image": SysConfig_Founder.PGIS_MAP_CLIENT + "",
      //                 "isShowTitle": false
      //             };
      //             boundway = opgisMap.showAreaMapByPoint(map, lng, lat, 12, true, option, function (data) { });
      //             console.log(boundway);
      //             showAreaMapByPoint_tcbq = boundway.tcbq;
      //             let code = boundway.jgxx.code;
      //             self.wifiAjax(code);

      //         } else {

      //             opgisMap.removeOverLayer(map, [showAreaMapByPoint_tcbq]);
      //             opgisMap.removeOverLayer(map, [wifiway]);
      //             var pixel = evt.pixel;
      //             let lng = evt.coordinate[0];
      //             let lat = evt.coordinate[1];

      //             var option = {
      //                 "name": "",
      //                 "image": SysConfig_Founder.PGIS_MAP_CLIENT + "",
      //                 "isShowTitle": false
      //             };
      //             boundway = opgisMap.showAreaMapByPoint(map, lng, lat, 12, true, option, function (data) { });
      //             console.log(boundway);
      //             showAreaMapByPoint_tcbq = boundway.tcbq;
      //             let code = boundway.jgxx.code;
      //             self.wifiAjax(code);

      //         }

      //     });

      // }
      // else {
      //     opgisMap.removeOverLayer(map, [showAreaMapByPoint_tcbq]);
      //     opgisMap.removeOverLayer(map, [wifiway]);
      // }
    },
    wifiAjax: function(code) {
      let urlStr = 'http://80.64.30.93:10086/wifi/getArea';
      let _this = this;
      $.ajax({
        url: urlStr,
        type: 'get',
        data: { code: code },
        dataType: 'text',
        success: data => {
          var datas = JSON.parse(data);
          this.policeWifi(datas);
        },
        error: function(err) {
          _this.$message({
            message: '连接服务器失败！',
            type: 'warning'
          });
        }
      });
    },
    policeWifi: function(datas) {
      console.log(datas);
      if (datas != '') {
        var optionUserMarker = {
          image: mapVar.imgFactory.wifi,
          isScale: true,
          isShowTitle: true
        };
        var callback = function(datas) {
          var popupContent = '';
          popupContent += '';
          var popData = {
            name: datas.title.getTitle(),
            x: datas.values.coordinate[0],
            y: datas.values.coordinate[1],
            markerLayer: popupContent
          };
          opgisMap.openInfoWindow(map, popData, '');
        };

        wifiway = opgisMap.showMarkerMap(
          map,
          '',
          '',
          '',
          datas,
          optionUserMarker,
          callback,
          '',
          ''
        );
      } else {
        //sHTML="<div>'+无数据+'</div>"
        //map.openInfoWindow(sHTML);
        alert('无数据');
        opgisMap.removeOverLayer(map, [showAreaMapByPoint_tcbq]);
      }
    },

    /*感知源撒点结束*/

    /**显示机场*/
    setJiChangtog: function() {
      let dwbh = '飞机场'; //item.jjdwmc;
      let layername = 'CS_JTCS_PT';
      var queryType = 'FQ'; //查询类型：全文检索
      var method = 'FULL'; //查询方法：全文查询
      var scope = '_FULLTEXT'; //查询范围：所有字段
      var spaceQueryStr = '';
      // or LX="军用机场" or LX="空运站、机场")
      var where = 'LAYERNAME:' + layername;
      var parameter =
        'type=' +
        queryType +
        '&method=' +
        method +
        '&scope=' +
        scope +
        '&keywords=' +
        dwbh +
        '&filterCustom=' +
        where +
        '&pageIndex=0&pageSize=20000' +
        spaceQueryStr;
      mapVar.demoApp.EzPOISearch_sc(parameter, function(data) {
        debugger;
      });
      //   var template =
      //     '<table class="zebra"><tbody>' +
      //     '<tr><td>类型</td><td>{LX}</td></tr>' +
      //     '<tr><td>名称</td><td>{MC}</td></tr>' +
      //     '<tr><td>所在地</td><td>{SZDMC}</td></tr>' +
      //     '<tr><td>所在区县</td><td>{XIANJXZQH}</td></tr>';
      //   template += '</tbody></table>';

      //   var format = {
      //     LX: '类型',
      //     MC: '名称',
      //     SZDMC: '所在地',
      //     XIANJXZQH: '所在区县'
      //   };
      //   this.markerOnMap(
      //     'CS_GSSFZ_PT',
      //     null,
      //     '',
      //     {
      //       title: '机场',
      //       template: template,
      //       format: format
      //     },
      //     this.btnOptsClass.jichang
      //   );
    },

    /**根据数据图层或者经纬度数据  撒点标注信息
     * option：标题 title， popup窗口信息模板：template、字段格式：format
     *  **/
    markerOnMap: function(layerName, data, markerIcon, option, isAdd) {
      if (isAdd == true) {
        this.addedLayer.push(layerName);

        if (this.currentMarkerLayerName.indexOf(layerName) < 0)
          this.currentMarkerLayerName.push(layerName);

        mapVar.addHotSpot(layerName, data, markerIcon, option);
      } else {
        // this.addedLayer.remove(layerName);
        let index = this.addedLayer.indexOf(layerName);
        this.addedLayer.splice(index, 1);
         mapVar.mapInstance.clearClusterHotSpot({
          imgId: markerIcon,
          layerName: layerName
        });
      }
    },
    /**清除添加的marker层，判断
                    * 如果是调用华云 封装好的接口则需要调用华云的清除方法
                    
                    * 如果是自己直接调用 mapVar.mapInstance的方法则 currentMarkerLayer不为空，需要调用 mapVar.mapInstance自己的清除方法*/
    clearMarker: function(layername) {
      if (this.currentMarkerLayerName != '') {
         mapVar.mapInstance.clearClusterHotSpot({
          imgId: '',
          layerName: layername
        });
        // this.currentMarkerLayerName = '';
      } else {
        mapVar.demoApp.removeAdimTw();
        mapVar.demoApp.remPolicetogs();
        mapVar.demoApp.remWifitogs();
      }
    },

    clearUserMarker: function() {
      for (var i = 0; i < this.spArray.length; i++) {
         mapVar.mapInstance.removeOverlayPoint(this.spArray[i]);
      }
      this.poiOptions = [];
    },
    /**画笔，显示筛选区域信息
     *  几大类数据必须至少有一类处于显示状态 才可以开启该功能
     */
    openPen: function(type) {
      if (this.buffGeometry_shape != null) {
         mapVar.mapInstance.map.removeOverlay(this.buffGeometry_shape);
        this.buffGeometry_shape = null;
      }

      if (
        !this.btnOptsClass.huayuan &&
        !this.btnOptsClass.huajuxing &&
        !this.btnOptsClass.duobianxing
      ) {
        this.buffGeometry = null;
        this.buffGeometry_shape = null;
        console.log('没有选择了,' + this.buffGeometry);
        //this.removeBuffOfSpaceQuery();
        this.resetSpaceQuery();
      } else {
        if (type == 'circle') {
          this.drawCircle();
          this.btnOptsClass.huajuxing = false;
          this.btnOptsClass.duobianxing = false;
        } else if (type == 'rectangle') {
          this.drawRect();
          this.btnOptsClass.huayuan = false;
          this.btnOptsClass.duobianxing = false;
        } else if (type == 'polygon') {
          this.drawPolygon();
          this.btnOptsClass.huayuan = false;
          this.btnOptsClass.huajuxing = false;
        }
        this.isShowHuabi = false;
        this.btnOptsClass.huayuan = this.btnOptsClass.huajuxing = this.btnOptsClass.duobianxing = false;
      }
    },

    drawPolygon: function() {
      /*画好后的回调函数 ，用以处理地图显示信息*/
      let _this = this;
       mapVar.mapInstance.drawPolygon(geom => {
        var Op_outter = {
          color: '#ffea00',
          weight: 0.5,
          fillOpacity: 0.05,
          fillColor: '#ffea00'
        };

        _this.buffGeometry = geom.coordString;
        _this.buffGeometry_shape =
          //window.preGraph;
          new Polygon(
            _this.buffGeometry,
            Op_outter.color,
            Op_outter.weight,
            Op_outter.fillOpacity,
            Op_outter.fillColor
          );
        //   mapVar.mapInstance.map.addOverlay(_this.buffGeometry_shape);
        this.resetSpaceQuery();
      });
    },
    /*画矩形*/
    drawRect: function() {
      /*圆画好后的回调函数 ，用以处理地图显示信息*/
      let _this = this;
       mapVar.mapInstance.drawRectangle(geom => {
        let points = geom;
        let coordArr = points.split(',');
        var Op_outter = {
          color: '#ffea00',
          weight: 0.5,
          fillOpacity: 0.05,
          fillColor: '#ffea00'
        };
        coordArr.splice(2, 2);
        coordArr.splice(4, 2);
        //_this.buffGeometry = [coordArr[1], coordArr[0], coordArr[3], coordArr[2]].toString();
        //_this.buffGeometry_shape =window.preGraph;
        _this.buffGeometry = window.preGraph.toString();
        //_this.buffGeometry_shape = new Rectangle(geom, Op_outter.color, Op_outter.weight, Op_outter.fillOpacity, Op_outter.fillColor);
        console.log(_this.buffGeometry_shape);
        this.resetSpaceQuery();
      });
    },
    /* 画圆*/
    drawCircle: function() {
      /*圆画好后的回调函数 ，用以处理地图显示信息*/
      let _this = this;
       mapVar.mapInstance.drawCircle(geom => {
        console.log(geom);
        var Op_outter = {
          color: '#ffea00',
          weight: 0.5,
          fillOpacity: 0.05,
          fillColor: '#ffea00'
        };
        _this.buffGeometry = geom;
        //_this.buffGeometry_shape =window.preGraph;
        _this.buffGeometry_shape = new Circle(
          _this.buffGeometry,
          Op_outter.color,
          Op_outter.weight,
          Op_outter.fillOpacity,
          Op_outter.fillColor
        );
        // mapVar.mapInstance.map.addOverlay(_this.buffGeometry_shape);
        this.resetSpaceQuery();
      });
    },

    //重新计算空间查询
    resetSpaceQuery: function() {
      // let index=this.currentMarkerLayerName.indexOf("VIPATTENTION");
      //     this.currentMarkerLayerName.splice(index,1);

      for (let i = 0; i < this.currentMarkerLayerName.length; i++) {
        let n = this.currentMarkerLayerName[i];

        switch (n) {
          case 'PGIS_JCSS_TXJKZY_PT':
            this.setVideotog();
            break;
          case 'VIPATTENTION':
            this.getVipAttentionObj();
            break;
          //   case '': break;
          //   case '': break;
          //   case '': break;
          //   case '': break;
          //   case '': break;
          //   case '': break;
          //   case '': break;
        }
      }
    },
    spaceQuery: function(layername, pIdx, callback) {
      //this.currentMarkerLayerName.push(layername);

      var queryType = 'FQ'; //查询类型：全文检索
      var method = 'FULL'; //查询方法：全文查询
      var scope = '_FULLTEXT'; //查询范围：所有字段
      // var scope = '_NAMES'; //查询范围：所有字段
      var spaceQueryStr = '';
      let pageIndex = pIdx;
      let pageNum = 512;
      //
      var where = 'LAYERNAME:' + layername;
      if (this.buffGeometry_shape.getGeometryType() == 'Circle') {
        let g = this.buffGeometry.split(',');
        let jd = g[0];
        let wd = g[1];
        let radius = g[2];
        spaceQueryStr = '&location=' + jd + ',' + wd + '&buffer=' + radius;
      } else if (
        this.buffGeometry_shape.getGeometryType().indexOf('Rect') >= 0
      ) {
        // == "Rectangle"
        let p = this.buffGeometry.split(',');
        let min_jd = p[1];
        let min_wd = p[0];
        let max_jd = p[3];
        let max_wd = p[2];
        spaceQueryStr =
          '&bounds=' + min_jd + ',' + min_wd + ',' + max_jd + ',' + max_wd;
      } else {
      }
      // type:FQ
      // location:104.17716979980469,30.675201416015625
      // buffer:7217.741487706566
      // sortBy:_DIST
      // scope:_NAMES
      // filterCustom:LAYERNAME:(JWZH_NBDWBW_JYZ_PT JWZH_ZAGL_YLCS_PT JWZH_ZAGL_WLJDHY_PT JWZH_ZAGL_WBZLSCS_PT JWZH_ZAGL_LD_PT JWZH_ZAGL_WB_PT JWZH_FKFB_YLJZDW_PT JWZH_DWXX_DZJG_PT JWZH_DWXX_JY_PT JWZH_DWXX_QSYDW_PT DWXX_GAJG_PT JWZH_BZDZ_JLX_PT JWZH_BZDZ_MP_PT JWZH_BZDZ_LP_PT CS_GGHDCS_PT CS_JTCS_PT CS_YLCS_PT CS_SMCS_PT CS_LYCS_PT CS_TYCS_PT CS_WHCS_PT CS_JMFWCS_PT CS_HLWSWFWYYCS_PT CS_ZJCS_PT CS_ZSFWCS_PT CS_CYFWCS_PT CS_TSHYFWCS_PT CS_BNCS_PT SX_DZSX_PT SX_DZSXFSSS_PT JMDJSS_DZJMD_PT JMDJSS_DZJZW_PT JT_DZJTSS_PT GX_DZGX_PT DM_DZDM_PT JT_XZJTSS_QL_PT JT_XZJTSS_SD_PT)
      // pageIndex:52
      // pageSize:10
      // keywords:
      // timespan:1537411923255
      // maxFetchCount:1000
      // url:http://www.pgis.sc/EzPOISearch/PoiSearchV1REST
      var parameter =
        'type=' +
        queryType +
        '&method=' +
        method +
        '&scope=' +
        scope +
        '&filterCustom=' +
        where +
        '&pageIndex=' +
        pageIndex +
        '&pageSize=' +
        pageNum +
        ' ' +
        spaceQueryStr +
        '&url:http://www.pgis.sc/EzPOISearch/PoiSearchV1REST';
      try {
        let g = this.buffGeometry.split(',');
        let jd = g[0];
        let wd = g[1];
        let radius = g[2];
        let pointStr = [g[0], g[1]].toString();
        var spaceQueryFQ = function(
          type,
          radius,
          pointStr,
          layerName,
          strWhere,
          keywords,
          sortBy,
          query_callback
        ) {
          //准备参数开始检索
          var parameter =
            'type=' +
            queryType +
            '&method=' +
            method +
            '&scope=' +
            scope +
            '&keywords=' +
            keywords +
            '&filterCustom=' +
            where +
            '&pageIndex=0&pageSize=300' +
            spaceQueryStr +
            '&sortBy=' +
            sortBy;
          var _data = {
            url:
              MapConfig.SearchServerUrl +
              '/PoiSearchV1REST?' +
              encodeURI(parameter)
          };
          //jQuery.support.cors=true;
          console.log(_data);
          $.ajax({
            xhrFields: { withCredentials: true },
            crossDomain: true,
            type: 'post',
            url: MapConfig.ProxyUrl,
            data: _data,
            async: true,
            dataType: 'jsonp',
            success: query_callback
          });
        };

        //  spaceQueryFQ(queryType,radius,pointStr,layername,'','','',

        //  callback
        // );
        mapVar.demoApp.EzPOISearch_sc(parameter, data => {
          callback({ id: pIdx, d: data });
        });
      } catch (e) {
        tryHideFullScreenLoading();
      }
    },

    /**筛选天网数据**/
    spacequery_tianwang: function(layername) {
      let _this = this;
      var totalnum = 0;

      let click_call = function(event) {
        debugger;
        var type = 0;
        let opts = _this.poiOptions.find(item => {
          return item.id == event.id;
        });
        opts = opts.d;
        switch (opts.SPCSBS) {
          case 'zjdh': //
            type = 1;
            break;
          case 'zgdx': //
            type = 3;
            break;
          case 'lykj': //
            type = 4;
            break;
          case 'dfwl': //
            type = 5;
            break;
          case 'hkws': //
            type = 6;
            break;
          case 'zjys': //
            type = 8;
            break;
          case 'zxdz':
            type = 9;
            break;
        }

        let src =
          "foundervideo://{'isSingle':false,'isInsert':false,'ptzEnabled':true,'historyEnabled':true,'showList':false," +
          "'videoType':'" +
          type +
          "'," +
          "'videoIp':'" +
          opts.IPDZ +
          "'," +
          "'videoPort':'" +
          opts.PORT +
          "'," +
          "'userName':'" +
          opts.USERNAME +
          "'," +
          "'password':'" +
          opts.PASSWORD +
          "'," +
          "'videoList':[{'spmc':'" +
          opts.MC +
          "'," +
          "'spbh':'" +
          opts.FLDM +
          "'," +
          "'tdbh':'" +
          opts.TDBH +
          "'}]}";
        console.log(src + '');
        window.location.href = src;
      };
      let addData = function(datas) {
        //console.log("pagIndex:"+pagIndex+'_'+ _this.spArray.length+"--datalength:"+datas.groups[0].pois.length);
        var index = datas.id;
        var datas =
          datas.d.groups[0] == undefined ? [] : datas.d.groups[0].pois;

        for (var i = 0; i < datas.length; i++) {
          if (
            datas[i].x == 0 ||
            datas[i].x == '' ||
            datas[i].x == undefined ||
            datas[i].x == null ||
            datas[i].y == 0 ||
            datas[i].y == '' ||
            datas[i].y == undefined ||
            datas[i].y == null
          ) {
            return '请输入正确的经纬度';
          }
          let id = 'SP' + index + '_' + i;
          console.log(id);
          _this.spArray.push(id);
          _this.poiOptions.push({ id: id, d: datas[i].customs });

          var template = '';
           mapVar.mapInstance.addOverlayPoint(
            id,
            parseFloat(datas[i].x),
            parseFloat(datas[i].y),
            'video',
            template,
            '',
            //i,
            false,
            '',
            '',
            click_call
          );
        }
      };

      let recycleQuery = function(totalnum, layername) {
        var pages = Math.ceil(totalnum / 512);
        console.log(pages);
        var i = 0;

        setTimeout(function f() {
          _this.spaceQuery(layername, i, addData);

          if (i <= pages) {
            i++;
            setTimeout(f, 1000);
          }
        }, 1050);
      };
      let query_callback = function(datas) {
        totalnum = datas.d.totalHits;
        //addData(datas);
        var datas =
          datas.d.groups[0] == undefined ? [] : datas.d.groups[0].pois;

        recycleQuery(totalnum, layername);

        tryHideFullScreenLoading();
      };

      this.clearMarker(layername);
      this.clearUserMarker();
      //this.currentMarkerLayerName=layername;

      showFullScreenLoading(); //显示loading窗口
      this.spaceQuery(layername, 0, query_callback);
    },

    /**
     * 查询周边信息数据 警力和视频监控
     */
    addCirles: function(jd, wd, radius, DivIdArray, layername, callback) {
      showFullScreenLoading(); //显示loading窗口

      this.spArray = [];
      this.poiOptions = [];
      this.clearUserMarker();
      var queryType = 'FQ'; //查询类型：全文检索
      var method = 'FULL'; //查询方法：全文查询
      var scope = '_FULLTEXT'; //查询范围：所有字段
      var spaceQueryStr = '&location=' + jd + ',' + wd + '&buffer=' + radius;
      // var spaceQueryStr = '&bounds=' + min_jd + ',' + min_wd + ','+max_jd+','+max_wd;
      var where = 'LAYERNAME:' + layername;
      var parameter =
        'type=' +
        queryType +
        '&method=' +
        method +
        '&scope=' +
        scope +
        '&filterCustom=' +
        where +
        '&pageIndex=0&pageSize=350' +
        spaceQueryStr;
      try {
        mapVar.demoApp.EzPOISearch_sc(parameter, function(data) {
          var datas = data.groups[0] == undefined ? [] : data.groups[0].pois;
          //var ss = 0;
          for (var i = 0; i < datas.length; i++) {
            if (
              datas[i].x == 0 ||
              datas[i].x == '' ||
              datas[i].x == undefined ||
              datas[i].x == null ||
              datas[i].y == 0 ||
              datas[i].y == '' ||
              datas[i].y == undefined ||
              datas[i].y == null
            ) {
              return '请输入正确的经纬度';
            }
            let id = 'SP' + i;
            this.spArray.push(id);
            this.poiOptions.push({ id: id, d: datas[i].customs });

            var template = '';
             mapVar.mapInstance.addOverlayPoint(
              id,
              parseFloat(datas[i].x),
              parseFloat(datas[i].y),
              'video',
              template,
              i,
              false,
              '',
              '',
              callback
            );
          }
          tryHideFullScreenLoading();
        });
      } catch (e) {
        console.log(e);
        tryHideFullScreenLoading();
      }
    },

    measureLength: function() {
       mapVar.mapInstance.measureLength();
      this.btnOptsClass.ceju = false;
    },
    measureArea: function() {
       mapVar.mapInstance.measureArea();
      this.btnOptsClass.cemian = false;
    }
  }
};
</script>

<style>
.v-modal {
  z-index: auto !important;
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
  left: 390px;
  top: 20px;
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
  height: 32rem;
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
  font-size: 12px;
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
  content: '';
  display: inline-block;
  width: 30px;
  height: 30px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 80% auto;
}

.strangle-ico:before {
  content: '';
  width: 0;
  height: 0;
  border-top: 0.5rem solid #8dadbd;
  border-left: 0.5rem solid transparent;
}

.sub-item {
  position: absolute;
  left: 80px;
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
  height: 102px;
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
  top: 104px;
}

.sub-item-jingli {
  top: 174px;
}

.sub-item-kadian {
  top: 146px;
}

.sub-item-ganzhiyuan {
  top: 312px;
}

.sub-item-ziyuan {
  top: 342px;
}

.sub-item-huabi {
  top: 402px;
}

.sub-item-wd.sub-item-attention {
  width: 174px;
}

.sub-item-wd.sub-item-tianwang {
  width: 174px;
}

.sub-item-wd.sub-item-jingli {
  width: 174px;
}

.sub-item-wd.sub-item-kadian {
  width: 174px;
  height: 510px;
  width: 350px;
}

.sub-item-wd.sub-item-ganzhiyuan {
  width: 333px;
  height: 200px;
}

.sub-item-wd.sub-item-ziyuan {
  width: 333px;
}

.sub-item-wd.sub-item-huabi {
  width: 350px;
  height: 180px;
}

.sub-item-wd .selected {
  background-color: rgb(243, 151, 30);
}

.init-map {
  position: absolute;
  top: 30px;
  left: 390px;
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
  content: '';
  width: 0;
  height: 0;
  border-bottom: 0.5rem solid #8dadbd;
  border-left: 0.5rem solid transparent;
}
</style>