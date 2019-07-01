<template>

  <div id='security_layermanager' class="securityLayerManager" style="display: none !important;">
    <el-checkbox label="" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
    <el-checkbox style="color:#fff !important" v-model='layer.ischeck' @change="handleCheckOneChange(key)" v-for="(layer,key) in  security_layers" :lable=layer.name :key='layer.id'>
      <span class=" el-icon-location" :style='layer.icon' style="font-size: 1.2em;"></span>
      {{layer.name}}
    </el-checkbox>
    <div id='pmap' style="display: none"></div>
    <!-- <button type="" @click="test1()">me </button> -->

    <el-dialog class="dpzy all-modal" :visible.sync="isShowBigPic" :close-on-click-modal="false" width=1000px top="15vh" v-dialogDrag center append-to-body>
      <div style="height:620px;">
        <div class="swim-src-res">
          <img :src="bigPicUrl" style="width:800px;height:600px;display: block;margin: 15px auto;" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import $ from 'jquery';
import { securityApi, securityApi_10086 } from '@/http';
import eventBus from '@/event';
import { eventCollection } from '@/event/resources';

import echarts from 'echarts';
import { mapVar } from '@/components/maps/variable.js';

import { T } from '@/components/maps/test.js';

import { topoAnalysis } from '@/components/maps/topoAnalysis.js';

export default {
  name: 'SecurityGis',
  data() {
    return {
      index: 0,
      isShowBigPic: false, //是否大屏查看图片
      bigPicUrl: '',

      curSecurity_name: [],
      guimoOptions: [[], [], [], [], []], //根据规模分类安保活动
      anbaoList: [], //总的安保列表
      //安保图层管理

      security_layers: [
        {
          id: 'code1',
          name: '5万人以上',
          icon: 'color:#7c7cf9',
          ischeck: true
        },
        { id: 'code2', name: '3-5万人', icon: 'color: #df2d28', ischeck: true },
        { id: 'code3', name: '1-3万人', icon: 'color:#e9850e', ischeck: true },
        {
          id: 'code4',
          name: '0.5-1万人',
          icon: 'color:#0cb1e5',
          ischeck: true
        },
        {
          id: 'code5',
          name: '0-0.5万人',
          icon: 'color: #08bb72',
          ischeck: true
        }
      ],

      checkAll: true,
      checkList: [],
      isIndeterminate: true,
      bounds: {},
      hideAB: [], //用于隐藏 位于展开安保圈层的活动中的其他安保活动
      abq_gzy: null, //安保圈内的感知源
     
    };
  },
  mounted() {},
  props: ['regionSecurityData'],
  watch: {
    regionSecurityData: {
      handler() {
        this.regionInit(this.regionSecurityData);
      },
      deep: true
    }
  },
  beforeDestroy() {
    eventBus.$off(eventCollection.PASSWAY_REGION);
  },
  methods: {

    /**用于测试的代码----忽略 */
    test1: function() {
      //T.tWoker();
      //   var worker = this.$worker.run(mapVar.tWoker).then(res=>{
      //   })
      T.test(this.index);
      this.index++;
    },



    /**********************************安保界面功能，*****************************/
   
    /***@argument
     * 显示 安保圈内的感知源
     * */
    ShowPerceptualSource: function(dtObj) {
      // 如果没有显示 安保圈层，则显示圈层，
      // 显示圈层内的感知源
      let item = '';
      let poly = [];

      let activityid = dtObj.aid; //安保id
      let layerid = dtObj.lid; //感知源id
      let ischeck = dtObj.isck; //是否显示感知源
      //  -1 代表隐藏已显示的感知源
      if (ischeck == false) {
        if (layerid == 'camera')
          mapVar.removeMapOverlays(mapVar.gzy_showList['tw']);
        else if (layerid == 'police')
          mapVar.removeMapOverlays(mapVar.gzy_showList['jl']);
        else if (layerid == 'wifi')
          mapVar.removeMapOverlays(mapVar.gzy_showList['wifi']);
        else if (layerid == 'specialWifi')
          mapVar.removeMapOverlays(mapVar.gzy_showList['specialWifi']);
        return;
      }
      let _this = this;
      /**显示安保圈感知源*/
      var show_abqGzy = function(d) {
        var addJl = function(data) {
          if (data.length > 0) {
            var callback = function(marker, item) {
              let html =
                '<div class="card pointmsg">' +
                '<div class="card-header">警力信息</div>' +
                '<div class="card-body">' +
                '<ul>' +
                '<li><span>编号：</span>' +
                item.id +
                '</li>' +
                '<li><span>警力类型：</span>' +
                mapVar.policeType[item.type] +
                '</li>' +
                '</ul>' +
                '</div></div>';
              marker.openInfoWindowHtml(html);
            };
            add(data, 'jl', mapVar.imgFactory.jl, callback);
          }
        };
        var addTw = function(data) {
          if (data.length > 0) {
            add(data, 'tw', mapVar.imgFactory.tw, _this.setABVideo);
          }
        };
        var addWf = function(data) {
          if (data.length > 0) {
            var callback = function(marker, item) {
              let html =
                '<div class="card pointmsg">' +
                '<div class="card-header"> WIFI设备信息  </div>' +
                '<div class="card-body">' +
                '<ul>' +
                '<li><span>设备编号：</span>' +
                item.id +
                '</li>' +
                '<li><span>设备类型：</span>' +
                mapVar.wifiType[item.type] +
                '</li>' +
                '<li><span>位置：</span>' +
                item.title +
                '</li>' +
                '</ul>' +
                '</div></div>';
              marker.openInfoWindowHtml(html);
            };
            add(data, 'wifi', mapVar.imgFactory.wifi_pt, callback);
          }
        };
        var addWf_tz = function(data) {
          if (data.length > 0) {
            var callback = function(marker, item) {
              let html =
                '<div class="card pointmsg">' +
                '<div class="card-header"> WIFI设备信息  </div>' +
                '<div class="card-body">' +
                '<ul>' +
                '<li><span>设备编号：</span>' +
                item.id +
                '</li>' +
                '<li><span>设备类型：</span>' +
                mapVar.wifiType[item.type] +
                '</li>' +
                '<li><span>位置：</span>' +
                item.title +
                '</li>' +
                '</ul>' +
                '</div></div>';
              marker.openInfoWindowHtml(html);
            };
            add(data, 'specialWifi', mapVar.imgFactory.wifi_tz, callback);
          }
        };
        var add = function(data, tp, mUrl, cb) {
          //筛选 在外圈层内的数据

          var cycle = function(end, start, process) {
            let i = start,
              l = end;
            // console.log('s:' + start + ',e:' + end);
            setTimeout(function f() {
              // if (i < l) {
              process(data[i], i++);
              if (i < l) {
                setTimeout(f(), 10);
              } else {
                //cb1(start,len);
                return;
              }
              //}
            }, 100);
          };
          var p = function(atm) {
            setTimeout(() => {
              let ptCord = new Point(parseFloat(atm.lng), parseFloat(atm.lat));
              let strHtml1 =
                '<div data-id="' +
                atm.id +
                '"><img style="height:18px;width:18px;" src="' +
                mUrl +
                '"/> </div>';
              // let strHtml1 = '<div style="height:2px;width:2px;background-color:rgb(255,255,0)"> </div>';
              let marker = new HTMLElementOverLay('', ptCord, strHtml1, null, [
                9,
                9
              ]);
              mapVar.gzy_showList[tp].push(marker);
              //mapVar.overLayer_abqgzy.push(marker);
               mapVar.mapInstance.map.addOverlay(marker);
              if(tp=='tw')
              {marker.addListener('click',cb);}
              else 
              {marker.addListener('click', () => {
                cb(marker, atm);
              });}
            }, 5);
          };

          let page = Math.ceil(data.length / 100);
          for (let b = 0; b < page; b++) {
            if (b == page - 1) {
              cycle(data.length, 100 * b, p);
              break;
            }
            cycle((b + 1) * 100, 100 * b, p);
          }

          // data.forEach((atm,index) => {

          //     let ptCord = new Point(parseFloat(atm.lng), parseFloat(atm.lat));
          //     let strHtml1 = '<div data-id="' + atm.id + '"><img style="height:18px;width:18px;" src="' + mUrl + '"/> </div>';
          //     // let strHtml1 = '<div style="height:2px;width:2px;background-color:rgb(255,255,0)"> </div>';
          //     let marker = new HTMLElementOverLay('', ptCord, strHtml1, null, [9, 9]);
          //      mapVar.mapInstance.map.addOverlay(marker);
          //     marker.addListener('click', () => {
          //         cb(marker,atm);
          //     });
          //     mapVar.overLayer_abqgzy.push(marker);
          // });
        };
        if (layerid == 'camera') {
          addTw(d.twList);
        } else if (layerid == 'police') {
          addJl(d.jlList);
        } else if (layerid == 'wifi') {
          let dt = d.wifiList.filter(item => {
            return item.type == '02';
          });
          addWf(dt);
        } else if (layerid == 'specialWifi') {
          let dt = d.wifiList.filter(item => {
            return item.type == '01';
          });
          addWf_tz(dt);
        }
        /****添加PGIS 图层 
                    -----旅店、网吧
                    *****/
        // var  pgisMap  = new PgisMap();
        // var map= pgisMap.initMap("pmap","",'104.06326174736023,30.659923553466797',13);
        var spaceQuery = function(layername, p = poly.join(',')) {
          p =
            '104.08022403717042,30.684857368469242,104.08271312713624,30.67369937896729,104.10356998443605,30.678076744079593,104.1033983230591,30.683569908142093,104.08022403717042,30.684857368469242';
          var showShapesPointStr = '';
          var showShapesPointMarker = '';
          var option = {
            // proxyurl:'http://172.29.214.56:8080/api/proxy',
            proxyurl: 'http://80.2.21.41:4764/api/proxy',
            image: mapVar.imgFactory.wb,
            isScale: true
          };
          var callback = function(data) {
            //alert(data.values[SysConfig_Founder.EzPOISearchLayer.PGIS_JZ_ZDRKXX.X]);

            var popData = {
              layerName: data.values.LAYERNAME,
              data: data
            };
            pgisMap.openInfoWindow( mapVar.mapInstance.map, popData, '');
          };
          showShapesPointMarker = pgisMap.showMarkerMap(
             mapVar.mapInstance.map,
            layername,
            p,
            '',
            '',
            option,
            callback,
            'xtgl',
            'TCCXFW5100'
          );
        };
        //JWZH_ZAGL_LD_PT  旅店
        //JWZH_ZAGL_WB_PT  网吧
        //spaceQuery('JWZH_ZAGL_LD_PT');
        // spaceQuery('JWZH_ZAGL_WB_PT');
      };

      if (this.curSecurity_name.indexOf(activityid) < 0) {
        item = this.anbaoList.find(item => {
          return item.activityid == activityid;
        });
      } else {
        item = activityid;
        if (!!this.abq_gzy) {
          show_abqGzy(this.abq_gzy);
          return;
        }
      }

      this.showCircles(item).then(abItem => {
        if (abItem == false) {
          return;
        }
        let d = { lat: abItem.y, lng: abItem.x, radius: 0 };
        let max = { x: 0, y: 0, r: 0 };
        let dm = JSON.parse(
          abItem.d.outsideCircle ? abItem.d.outsideCircle : '[]'
        );
        let polyStr = [];
        var b = (function(objs) {
          return new Promise(resolve => {
            if (objs && objs.length > 0) {
              objs.forEach((obj, index) => {
                polyStr.push({ x: obj.lng, y: obj.lat });
                poly.push(obj.lng, obj.lat);
                let r = Math.sqrt(
                  Math.pow(obj.lng - d.lng, 2) + Math.pow(obj.lat - d.lat, 2)
                );
                if (max.r < r) {
                  max = { x: obj.lng, y: obj.lat, r: r };
                }
              }, this);

              resolve(true);
            }
          });
        })(dm).then(() => {
          d.radius = topoAnalysis.prototype.toDistance(
            max.y,
            max.x,
            d.lat,
            d.lng
          );

          securityApi_10086.getCircle(d).then(resData => {
            // resData=  mapVar.filterData(resData,polyStr);

            for (let key in resData) {
              if (resData.hasOwnProperty(key)) {
                let datas = resData[key];
                resData[key] = datas.filter(atm => {
                  return topoAnalysis.prototype.windingNumber(
                    { x: atm.lng, y: atm.lat },
                    polyStr
                  );
                });
              }
            }
            this.abq_gzy = resData;
            show_abqGzy(resData);
          });
        });
      });
    },
    /**
     * new 显示安保圈内的感知源。。
     */
    ShowPerceptualSource2: function(dtObj) {
      let abid = dtObj.aid; //安保id
      let layerid = dtObj.lid; //感知源id
      let ischeck = dtObj.isck; //是否显示感知源

      let item = '';
      let poly = [];
      if (ischeck == false) {
        //移除已经显示的 安保圈层的 某个感知源 ===layerid
        // example:this.menuTools.removePoints(layerid ,DemoApp);
      }

      var show_abqGzy = function() {
        //调用 华云的方法 ，，，将要显示的感知源以及范围传给他们，只等显示
        // example:  this.menuTools.addPoints(layerid,poly ,DemoApp);
      };

      //判断是否 还没有显示安保圈层范围 没有 则 显示
      if (this.curSecurity_name.indexOf(abid) < 0) {
        item = this.anbaoList.find(item => {
          return item.activityid == abid;
        });
      } else {
        item = activityid;
      }
      this.showCircles(item).then(abItem => {
        if (abItem == false) {
          return;
        }
        let d = { lat: abItem.y, lng: abItem.x, radius: 0 };
        let max = { x: 0, y: 0, r: 0 };
        let dm = JSON.parse(
          abItem.d.outsideCircle ? abItem.d.outsideCircle : '[]'
        );
        var b = (function(objs) {
          return new Promise(resolve => {
            if (objs && objs.length > 0) {
              objs.forEach((obj, index) => {
                poly.push(obj.lng, obj.lat);
              }, this);

              resolve(true);
            }
          });
        })(dm).then(() => {
          show_abqGzy();
        });
      });
    },


    /**
     * 显示安保圈层 内外圈
     */
    showCircles: function(e) {
      var id = '';
      var item;
      if (typeof e == 'number') {
        //只做地图定位和缩放
        id = e;
        item = this.anbaoList.find(item => {
          return item.activityid == id;
        });
        if (item) {
          console.log(mapVar.mapInstance);
          //  mapVar.mapInstance.setMapCenter(item.lon, item.lat, 19);
           mapVar.mapInstance.setMapCenter(item.lon, item.lat, 19);
          //mapVar. mapInstance[0].centerAtLatLng(new Point(parseFloat(item.lon), parseFloat(item.lat)),19);
        }
        return;
      } else if (e && e.type == 'click') {
        id = e.target.parentNode.getAttribute('data-id');
        item = this.anbaoList.find(item => {
          return item.activityid == id;
        });
      } else if (typeof e == 'object') {
        item = e;
        id = item.activityid;
      }

      if (this.curSecurity_name.indexOf(id) < 0) {
        console.log('已经清除当前安保活动安保圈层数据');
        this.clearDraw();
        this.curSecurity_name = [];
      } else if (this.curSecurity_name.indexOf(id) >= 0) {
        if (item.lon && item.lat)  mapVar.mapInstance.setMapCenter(item.lon, item.lat, 19);
        return;
      }

      this.clearDraw();
      this.curSecurity_name.push(id);

      if (item.lon && item.lat)
           mapVar.mapInstance.setMapCenter(item.lon, item.lat, 19);
      return new Promise((resolve, reject) => {
        return securityApi
          .getQYDBX({ activityid: id })
          .then(res => res.data)
          .then(data => {
            if (!data) return;

            var ds = JSON.parse(data.innerCircle ? data.innerCircle : '[]');
            var dm = JSON.parse(data.outsideCircle ? data.outsideCircle : '[]');
            var getBounds = function(objs) {
              var bounds = {
                min_lat: 0,
                max_lat: 0,
                min_lng: 0,
                max_lng: 0
              };
              if (objs && objs.length > 0) {
                objs.forEach(obj => {
                  if (obj.lng > bounds.max_lng) {
                    bounds.max_lng = obj.lng;
                  }
                  if (obj.lng < bounds.min_lng) {
                    bounds.min_lng = obj.lng;
                  }
                  if (obj.lat < bounds.min_lat) {
                    bounds.min_lat = obj.lat;
                  }
                  if (obj.lat > bounds.max_lat) {
                    bounds.max_lat = obj.lat;
                  }
                });
              }
              return bounds;
            };
            this.bounds = getBounds(dm);
         
            var ci = data.region;
            if (ds.length == 0 && dm.length == 0) {
              this.setSensitive_Circle(ci);
            } else {
              let innerCircle = [];
              let outterCirlce = [];
              let policePoints = [];
              if (ds.length > 0) {
                ds.forEach(item => {
                  if (
                    item.type == 'wifi' ||
                    item.type == 'jcss' ||
                    item.type == 'police'
                  ) {
                    innerCircle.push(item);
                  } else {
                    policePoints.push(item);
                  }
                });
              }
              if (dm.length > 0) {
                dm.forEach(item => {
                  if (
                    item.type == 'wifi' ||
                    item.type == 'jcss' ||
                    item.type == 'police'
                  ) {
                    outterCirlce.push(item);
                  } else {
                    policePoints.push(item);
                  }
                });
              }
              if (
                outterCirlce[0].lat !=
                  outterCirlce[outterCirlce.length - 1].lat &&
                outterCirlce[0].lng != outterCirlce[outterCirlce.length - 1].lng
              ) {
                outterCirlce.push(outterCirlce[0]);
              }
              this.setABQY_outerCircle(outterCirlce);
              this.setABQY_innerCircle(innerCircle);
              //this.setABQY_jingli(policePoints);
              this.setABYJ_CoreRegion(item.region);
            }
           // setTimeout(() => {
              
              this.showABDetailInfo(item);
              this.showABYJinfo(item);
              resolve({ x: item.lon, y: item.lat, d: data });
           // }, 500);
          });
      });
    },

    createOverHtml: function(
      dataid,
      bgcolor,
      numTitle,
      nameTitle,
      imgUrl,
      pos,
      peoN,
      callback
    ) {
      let offset = [20, 28];
      let id = 'anbao_' + dataid;
      let iconOp = {
        a: 'color:#7c7cf9',
        b: 'color:#df2d28',
        c: 'color:#e9850e',
        d: 'color:#0cb1e5',
        e: 'color:#08bb72'
      };
      let mUrl = '';
      if (numTitle == '5W以上') mUrl = iconOp.a;
      if (numTitle == '3-5W') mUrl = iconOp.b;
      if (numTitle == '1-3W') mUrl = iconOp.c;
      if (numTitle == '0.5-1W') mUrl = iconOp.d;
      if (numTitle == '5千人及以下') mUrl = iconOp.c;
      let sty = 'font-size: 2.8em;' + mUrl;

      var strHtml0 =
        '<div title="' +
        nameTitle +
        '" style="display: flex; width: 40px;;align-items: center;    flex-direction: column;"  id=' +
        id +
        '  data-id=' +
        dataid +
        '><span data-id=' +
        dataid +
        ' style="display:none;text-align:center;background:rgba(0,0,0,0);padding:5px;color:#4dbeff;width: 100px;word-break: keep-all; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' +
        nameTitle +
        '</span>  <img data-id=' +
        dataid +
        '  style="display:block;width: 24px;height: 24px;" src=' +
        imgUrl +
        '></div>';
      // <span class="el-icon-location" data-id=' + dataid + '  style="' + sty + ' "></span>
      var htmlOver = new HTMLElementOverLay('', pos, strHtml0, null, offset);
     
      // this.guimoOptions[peoN - 1].push({ id: id, m: htmlOver });

      mapVar.security_ABpoint.push({ id: id, m: htmlOver });
       mapVar.mapInstance.map.addOverlay(htmlOver);

      var popdiv = document.getElementById(id);
      if (!!popdiv) {
        document.getElementById(id).addEventListener('click', callback, true);
      }
      //return htmlOver;
    },
//将安保规模的的 文字转换成数字编码
    anbaoGuimoCHN2Num: function(datas) {
        datas.forEach(item => {
          if (item.peoplenum == '5万人以上') item.peoplenum = '1';
          if (item.peoplenum == '3-5万人') item.peoplenum = '2';
          if (item.peoplenum == '1-3万人') item.peoplenum = '3';
          if (item.peoplenum == '0.5-1万人') item.peoplenum = '4';
          if (item.peoplenum == '5千人以下') item.peoplenum = '5';
        });
    },
    regionInit: function(datas) {
        console.log(mapVar.mapInstance);
      if (datas == null || datas.length == 0) {
        return;
      }
      this.clearSSGJ();
      this.clearDraw();
      this.anbaoList = datas;
      //console.log(datas[0]);
      datas.map((item, index) => {
        //console.log('index:' + index + ':' + item.jlnum);
        item.jlnum =
          item.jlnum == null
            ? { wifi: 0, jl: 0, tw: 0 }
            : typeof item.jlnum == 'object'
              ? item.jlnum
              : JSON.parse(item.jlnum);
        item.peoplenum = item.peoplenum == null ? 0 : item.peoplenum;
        // console.log(item.jlnum);
        //return item;
      });
       //将中文描述转成 数字代号
      this.anbaoGuimoCHN2Num(datas);

    
      for (var i = 0; i < datas.length; i++) {

        let oneData=datas[i];
        if (
          oneData.lon == '0.000000' ||
          oneData.lon == '' ||
          oneData.lon == null ||
        (oneData.lat == '0.000000' ||
          oneData.lat == '' ||
          oneData.lat == null)
        ) {
          console.log('数据 经纬度错误：'+ oneData.activityid);
        } else {
          this.drawABPoint(oneData);
        }
      }
    },

/**
 * 绘制安保点位
 */
    drawABPoint: function(data) {
      // let offset = [20, 28];
        let colorObj = {
            0: '#808080',
            1: '#0090ff',
            2: 'rgb(255,0,0)'
          };

      let titleObj = {
        1: '5W以上',
        2: '3-5W',
        3: '1-3W',
        4: '0.5-1W',
        5: '5千人及以下'
      };
      let mimg={
            0: mapVar.imgFactory.over,
            1:  mapVar.imgFactory.wyj,
            2:  mapVar.imgFactory.yyj
          };
      var lnt = data.lon;
      var lat = data.lat;
      var pos2 = new Point(parseFloat(lnt), parseFloat(lat));
      this.createOverHtml(
          data.activityid,
          colorObj[data.status],
          titleObj[data.peoplenum],
          data.name,
          mimg[data.status],
          pos2,
          data.peoplenum,
          this.showCircles
        );

  
    },
    /* 点击重大活动显示 活动举办地 安保措施 蓝圈*/
    setABQY_outerCircle: function(lstHistData) {
      if (lstHistData.length == 0) {
        return;
      }

      var lstHistPts = [];
      var lineData = [];
      var tmphistLineTrack = null;
      var lineStyle = {
        strokeColor: '#ffea00',
        strokeOpacity: 5,
        strokeWidth: 3
      };
      this.drawABCircle(lstHistData, lineStyle);
      return;
    },
    /**红圈*/
    setABQY_innerCircle: function(lstHistData) {
      if (lstHistData.length == 0) {
        return;
      }
      var lineStyle = {
        strokeColor: '#ff4e00',
        strokeOpacity: 5,
        strokeWidth: 5
      };
      this.drawABCircle(lstHistData, lineStyle);
    },
    /***画圈圈
     * 每一个节点 增加鼠标hover事件 显示详情
     **/
    drawABCircle: function(datas, style) {
      var lstHistPts = [];
      var lineData = [];
      var tmphistLineTrack = null;
      for (var i = datas.length - 1; i >= 0; i--) {
        var histDataPtInfo = datas[i];
        var lon = histDataPtInfo.lng;
        var lat = histDataPtInfo.lat;
        //console.log(i+":lon:"+lon+";lat:"+lat+histDataPtInfo.ksCssj);
        var ptCord = new Point(lon, lat); //路径点坐标
        //绘制路径
        //路径点标注要素
        //创建marker对象

        if (histDataPtInfo) {
          var strHtml1 = '';
          // 天网数据 ---查看视频
          let marker = null;
          let type = histDataPtInfo.type;
          if (histDataPtInfo.type == 'jcss') {
            strHtml1 =
              '<div data-id="' +
              histDataPtInfo.id +
              '"> <img  src="' +
              mapVar.imgFactory.tw +
              '"/></div>';
            marker = new HTMLElementOverLay('', ptCord, strHtml1, null, [
              10,
              10
            ]);
            if (!!marker) {
              marker.addListener('click', this.setABVideo);
            }
          } else if (histDataPtInfo.type == 'wifi') {
            strHtml1 = '<div> <img style="width:20px;height:20px;" src="' + mapVar.imgFactory.wifi + '"/></div>';
            marker = new HTMLElementOverLay('', ptCord, strHtml1, null, [
              10,
              10
            ]);
            if (!!marker) {
              marker.addListener('click', e => {
                 mapVar.mapInstance.setMapCenter(
                  e.latlng.lng,
                  e.latlng.lat,
                   mapVar.mapInstance.map.getZoomLevel() + 1
                );
              });
             
            }
          } else if (histDataPtInfo.type == 'police') {
            strHtml1 =
              '<div> <img style="width:20px;height:20px;" src="' +
              mapVar.imgFactory.wifi +
              '"/></div>';
            marker = new HTMLElementOverLay('', ptCord, strHtml1, null, [
              10,
              10
            ]);
            if (!!marker) {
              marker.addListener('click', e => {
                 mapVar.mapInstance.setMapCenter(
                  e.latlng.lng,
                  e.latlng.lat,
                   mapVar.mapInstance.map.getZoomLevel() + 1
                );
              });
            
            }
          }

          lineData.push([lon, lat]);
          // this.lastHistPtInfo = ptCord;
           mapVar.mapInstance.map.addOverlay(marker);
          mapVar.overLayer_security.push(marker);
          // testArr.push(marker);

          if (lineData.length >= 2) {
            var tmpLineData = [];
            tmpLineData.push(lineData[lineData.length - 2]);
            tmpLineData.push([lon, lat]);
            var histLineTrack = new Polyline(
              tmpLineData.toString(),
              style.strokeColor,
              style.strokeOpacity,
              style.strokeWidth,
              false
            );
            // var histLineTrack = new Polyline(tmpLineData.toString(), lineStyle);
            mapVar.overLayer_security.push(histLineTrack);
             mapVar.mapInstance.map.addOverlay(histLineTrack);
          }
        }
      }

      var lstFilterData = [];
      for (var i = 0; i < datas.length; i++) {
        if (0 == i) {
          lstFilterData.push([datas[i].lng, datas[i].lat]);
        } else {
          if (lstFilterData.length > 0) {
            if (
              !(
                lstFilterData[lstFilterData.length - 1][0] == datas[i].lng &&
                lstFilterData[lstFilterData.length - 1][1] == datas[i].lat
              )
            ) {
              lstFilterData.push([datas[i].lng, datas[i].lat]);
            }
          }
        }
      }
    },
    /***警力部署
     * 每一个节点 增加鼠标hover事件 显示详情
     * 此方法 作废。。。原因：警力是动态的，返回的数据没有时效性
     * **/
    setABQY_jingli: function(jingli_Arr) {
      if (jingli_Arr.length == 0) {
        return;
      }

      for (const key in jingli_Arr) {
        if (jingli_Arr.hasOwnProperty(key)) {
          const element = jingli_Arr[key];
          let ptCord = new Point(
            parseFloat(element.lng),
            parseFloat(element.lat)
          );
          let strHtml1 =
            '<div> <img src="' + mapVar.imgFactory.jl + '"/></div>';
          let marker = new HTMLElementOverLay('', ptCord, strHtml1, null, [
            20,
            20
          ]);
          marker.addListener('click', () => {
            let html = '<div>  <p>车牌号:' + element.title + '</p>' + '</div>';
            marker.openInfoWindowHtml(html);
          });
           mapVar.mapInstance.map.addOverlay(marker);
          mapVar.overLayer_security.push(marker);
        }
      }
    },
    /**
            显示安保预警核心区域
            **/
    setABYJ_CoreRegion: function(region) {
      if (region == '' || region == null) return;
        let coreR = '';
      let police = '';
      let kakou = '';
      let crk = '';

     if(region.indexOf('r')>=0)
        {region = JSON.parse(region);
          coreR =region.r;
       police = region.p;
       kakou = region.k;
       crk = region.crk;
        }
        else{
          coreR =region;
        }
     

      var reG = {
        color: 'red',
        weight: 6,
        fillOpacity: 0.1,
        fillColor: 'red'
      };
     

      var setCoreR = (function(coreR) {
        if (coreR.indexOf(';') >= 0) {
          coreR = coreR
            .split(';')
            .filter(d => d)
            .join(',');
        }
        let polygon = new Polygon(
          coreR,
          reG.color,
          reG.weight,
          reG.fillOpacity,
          reG.fillColor
        );
        console.log(polygon);
         mapVar.mapInstance.map.addOverlay(polygon);
        mapVar.overLayer_security.push(polygon);
      })(coreR);
      var setJlbs = (function(police) {
        if (police && police.length > 0) {
          police.forEach((item, index) => {
            var p = new Point(item.p.x, item.p.y);
            let marker = new HTMLElementOverLay('', p, item.m, null, [50, 30]);

             mapVar.mapInstance.map.addOverlay(marker);
            mapVar.overLayer_security.push(marker);
            marker.addListener('click',()=>{
               let obj=JSON.parse(item.bz);
                    let h = `<div class="ctn-hold">
                    <div class="ctn-head"><span>警力部署</span></div>
                      <div class="place-hold">
                       <p>责任人：${obj.zrr}</p> 
                        <p>联系方式：${obj.lxfs}</p>
                          </div>
                    </div>`;
              marker.openInfoWindowHtml(h);
            })
          }, this);
        }
      })(police);
      var setkakou = (function(kakou) {
        if (kakou && kakou.length > 0) {
          kakou.forEach((item, index) => {
            var p = new Point(item.p.x, item.p.y);
            let marker = new HTMLElementOverLay('', p, item.m, null, [50, 30]);

             mapVar.mapInstance.map.addOverlay(marker);
            mapVar.overLayer_security.push(marker);
            marker.addListener('click',()=>{
               let obj=JSON.parse(item.bz);
                    let h = `<div class="ctn-hold">
                      <div class="ctn-head"><span>卡口部署</span></div>
                      <div class="place-hold">
                       <p>责任人：${obj.zrr}</p> 
                        <p>联系方式：${obj.lxfs}</p>
                          </div>
                    </div>`;
              marker.openInfoWindowHtml(h);
            })
          }, this);
        }
      })(kakou);
      var setCrk = (function(crk) {
        if (crk && crk.length > 0) {
          crk.forEach((item, index) => {
            var p = new Point(item.p.x, item.p.y);
            let marker = new HTMLElementOverLay('', p, item.m, null, [50, 30]);

             mapVar.mapInstance.map.addOverlay(marker);
            mapVar.overLayer_security.push(marker);
            marker.addListener('click',()=>{
              let obj=JSON.parse(item.bz);
                    let h = `<div class="ctn-hold">
                    <div class="ctn-head"><span>出入口信息</span></div>
                      <div class="place-hold">
                       <p>责任人：${obj.zrr}</p> 
                        <p>联系方式：${obj.lxfs}</p>
                          </div>
                    </div>`;
              marker.openInfoWindowHtml(h);
            })
          }, this);
        }
      })(crk);
    },

    /**闪烁预警消息
             * 全部闪烁  手动关闭 overLayer_security
             * 1.在当前视窗范围的直接闪烁
             * 2.不在当前视窗范围的提醒用户
             * 功能设置：{
                        1.点击闪烁点可以忽略查看、查看详细、发送指令
             * }
             * ----3.5分钟之内的红色闪烁、5分钟之前的灰掉
             @argument:{
                 activityid:唯一值id
                 yjid:预警id
                 name: 安保活动
                 shortname:安保活动简写
                 xm:姓名
                 sfzh:身份证号
                 rylb:人员类别
                 hdlx:活动类型
                 hdqh:活动区划
                 hdcs:活动场所
                 hdsj:活动时间
                 hdxq:活动详情
                 sjhm:--手机号码作废
                 qqhm:QQ号码
                 wxhm:微信号
                 cphm:--车牌号码作废
                 yjsj: 预警时间
                 lon: 经度
                 lat: 纬度
                 sjhms:新手机号数组
                 cphms:车牌号数组,
                 czzt:0\1\2
             }
            */
    twinkleYJXX: function(data) {
      if (!data || this.curSecurity_name.length == 0) {
        return;
      }
      if (this.curSecurity_name.indexOf('' + data.activityid) < 0&&
      this.curSecurity_name.indexOf( data.activityid) < 0
      ) {
        return;
      }
      let _this = this;
      let imgs = mapVar.imgFactory;
      var twinkle = function(d) {
        let yj_status = '';
        if (d.czzt == 0) {
          if (d.yjjb == '1') {
            yj_status = imgs.gzry1;
          } else if (d.yjjb == '2') {
            yj_status = imgs.gzry2;
          } else if (d.yjjb == '3') {
            yj_status = imgs.gzry3;
          } else if (d.yjjb == '4') {
            yj_status = imgs.gzry4;
          }
        } else if (d.czzt == 1) {
          yj_status = imgs.over;
        } else if (d.czzt == 2) {
          yj_status = imgs.wyj;
        }
        //展示
        let p = new Point(parseFloat(data.lon), parseFloat(data.lat));
        let h =
          '<img data-id=' +
          d.yjid +
          ' yjid=' +
          d.yjid +
          '  style="display:block;width: 18px;height: 24px;" src="' +
          yj_status +
          '">';
        var htmlOver = new HTMLElementOverLay(d.yjid, p, h, null, [8, 8]);
        mapVar.security_twinkle.push({ id: d.yjid, m: htmlOver });
        // console.log(htmlOver)
         mapVar.mapInstance.map.addOverlay(htmlOver);
        //添加鼠标点击查看详情信息
        //1.点击闪烁点可以忽略查看、查看详细、发送指令
        //2.鼠标hover 显示梗概

        htmlOver.addListener('click', () => {
          let html =
            '<div class="ctn-hold">' +
            '<div class="place-hold">' +
            // '<p class="det-main" style="text-align:center;">' + d.name + '</p>' +
            '<p class="para-normal key">人员名称：<span class="value"> ' +
            d.xm +
            '</span></p>' +
            '<p class="para-normal key">人员类别：<span class="value">' +
            d.rylb +
            '</span></p>' +
            '<p class="para-normal key">证件号码：<span class="value" id="ckda_' +
            d.sfzh +
            '" style="cursor: pointer;color: rgb(255, 245, 0);text-decoration: underline;"> ' +
            d.sfzh +
            '</span></p>' +
            '<p class="para-normal key">车牌号：<span class="value" id="ckda_' +
            d.cph +
            '" style="cursor: pointer;color: rgb(255, 245, 0);text-decoration: underline;"> ' +
            d.cphm +
            '</span></p>' +
            '<p class="para-normal key">手机号码：<span class="value" id="ckda_' +
            d.sjhm +
            '" style="cursor: pointer;color: rgb(255, 245, 0);text-decoration: underline;"> ' +
            d.sjhm +
            '</span></p>' +
            '<p class="para-normal key">预警时间：<span class="value"> ' +
            d.yjsj +
            '</span></p>' +
            '<p class="para-normal key">活动场所：<span class="value">' +
            d.hdcs +
            '</span></p>' +
            '<p class="para-normal key"><button id="hl_' +
            d.yjid +
            '" class="hl">忽略预警</button><button id="fbzl_' +
            d.yjid +
            '" class="fbzl">发布指令</button></p>' +
            '</div></div>';
          let zjlx = '';
          if (d.bkdxlx == '02' || d.bkdxlx == '06') zjlx = '02';
          else zjlx = '01';
          htmlOver.openInfoWindowHtml(html);
          let dom = document.getElementById('hl_' + d.yjid);
          if (!!dom) {
            document
              .getElementById('hl_' + d.yjid)
              .addEventListener('click', _this.hl_twinkle);
            document
              .getElementById('fbzl_' + d.yjid)
              .addEventListener('click', _this.fbzl_twinkle);
            document
              .getElementById('ckda_' + d.sfzh)
              .addEventListener('click', () => {
                eventBus.$emit(eventCollection.PASSWAY_VIEWDANGAN, {
                  title: d.xm,
                  zjhm: d.sfzh,
                  zjlx: zjlx,
                  fjxx: '1'
                });
              });
            document
              .getElementById('ckda_' + d.cph)
              .addEventListener('click', () => {
                eventBus.$emit(eventCollection.PASSWAY_VIEWDANGAN, {
                  title: d.xm,
                  zjhm: d.cph,
                  zjlx: zjlx,
                  fjxx: '1'
                });
              });
            document
              .getElementById('ckda_' + d.sjhm)
              .addEventListener('click', () => {
                eventBus.$emit(eventCollection.PASSWAY_VIEWDANGAN, {
                  title: d.xm,
                  zjhm: d.sjhm,
                  zjlx: zjlx,
                  fjxx: '1'
                });
              });
          }
        });
      };
      if (data.lon && data.lat) {
        //有预警---将图标由绿色变成红色闪烁

        var isInCircle = function(lng, lat) {
          if (
            lng < _this.bounds.max_lng &&
            lng > _this.bounds.min_lng &&
            lat < _this.bounds.max_lat &&
            lat > _this.bounds.min_lat
          )
            return true;
          else return false;
        };

        // if(isInCircle(data.lon,data.lat)){
        twinkle(data);
        //   }
        //   else{
        //       //提示
        //       this.$message({
        //           message: "在当前视窗之外有新预警:"+data.hdcs+" 发现 "+data.xm,
        //           type: "warning"
        //       });
        //       // twinkle(data);
        //   }
      }
    },
    /*****当当前安保为没有预警，接受到预警消息后更改为有预警状态****/
    changeMarker: function(data) {
      if (mapVar.security_ABpoint && mapVar.security_ABpoint.length) {
        let m = mapVar.security_ABpoint.find(item => {
          return item.id == 'anbao_' + data.activityid;
        });
        if (m)  mapVar.mapInstance.map.removeOverlay(m.m);
      }
      let abPoint = this.anbaoList.find(obj => {
        return obj.activityid == data.activityid;
      });
      if (abPoint) this.drawABPoint(abPoint);
    },
    /**忽略闪烁预警点
     * 向后台传送 消息--更新数据状态
     */
    hl_twinkle: function(e) {
      //let id=$(e.target).attr("id").split('_')[1];
      let yjid = $(e.target)
        .attr('id')
        .split('_')[1];

      let item = mapVar.security_twinkle.find((item, index) => {
        return item.id == yjid;
        // if (item.id == id) {
        //     mapVar.removeMapOverlay(item.m);
        //    //  mapVar.mapInstance.map.removeOverlay(item.d);
        //    console.log(yjid);
        //    mapVar.security_twinkle.splice(index, 1);
        //    return securityApi.changeABStatus({yjid:yjid,czzt:1}).then(res=>res.data).then(data=>{
        //        //修改状态
        //    })
        // }
      });
      let idx = mapVar.security_twinkle.indexOf(item);

      mapVar.removeMapOverlay(item.m);
      //  mapVar.mapInstance.map.removeOverlay(item.d);
      console.log(yjid);
      mapVar.security_twinkle.splice(idx, 1);
      return securityApi
        .changeABStatus({ yjid: yjid, czzt: 1 })
        .then(res => res.data)
        .then(data => {
          //修改状态
        });
    },
    /***点击发布指令***/
    fbzl_twinkle: function(e) {
      let id = $(e.target)
        .attr('id')
        .split('_')[1];
      eventBus.$emit(eventCollection.SECURITY_RELEASEDISTRUCT, id);
    },
    /***判断是否在当前视窗范围内*/
    isInWindowView: function(lng, lat) {
      let max_lat =  mapVar.mapInstance.map.getBoundsLatLng()._northEast.lat;
      let min_lat =  mapVar.mapInstance.map.getBoundsLatLng()._southWest.lat;
      let max_lng =  mapVar.mapInstance.map.getBoundsLatLng()._northEast.lng;
      let min_lng =  mapVar.mapInstance.map.getBoundsLatLng()._southWest.lng;
      if (
        lat <= max_lat &&
        lat >= min_lat &&
        lng >= min_lng &&
        lng <= max_lng
      ) {
        return true;
      } else return false;
    },

    /*** 敏感圈层**/
    setSensitive_Circle: function(circleData) {
      var Op_inner = {
        color: '#cc0033',
        weight: 2,
        fillOpacity: 0.1,
        fillColor: '#cc0033'
      };
      var Op_outter = {
        color: '#ffea00',
        weight: 0.5,
        fillOpacity: 0.05,
        fillColor: '#ffea00'
      };
      let lat = circleData.lat;
      let lng = circleData.lon;
      let i_radius = circleData.innerRadius;
      let o_radius = circleData.outsideRadius;

      //EzServerClient.circle(circleCenter, radius, newOptions);
      var ci = new Circle(
        [lng, lat, i_radius].toString(),
        Op_inner.color,
        Op_inner.weight,
        Op_inner.fillOpacity,
        Op_inner.fillColor
      );
      var co = new Circle(
        [lng, lat, o_radius].toString(),
        Op_outter.color,
        Op_outter.weight,
        Op_outter.fillOpacity,
        Op_outter.fillColor
      );
      //console.log(ci);
       mapVar.mapInstance.map.addOverlay(co);
      mapVar.overLayer_security.push(co);
       mapVar.mapInstance.map.addOverlay(ci);
      mapVar.overLayer_security.push(ci);
    },
    /****显示单个安保圈层的详细信息**?*/
    showABDetailInfo: function(data) {
      return securityApi
        .securityGetAbListPic(data.activityid)
        .then(res => res.data)
        .then(picdata => {
          let defaultpng = mapVar.imgFactory.default;
          let ddtp = picdata.ddtpbase64 ? picdata.ddtpbase64 : defaultpng;
          let bjtp = picdata.bjtpbase64 ? picdata.bjtpbase64 : defaultpng;
          //<img src="'+ddtp+'" style="width:60px;height:60px;margin-right:20px;"  />
          let html =
            '<div class="ctn-hold">' +
            '<div class="ctn-head"><span>安保详情</span></div>' +
            '<div class="place-hold">' +
            '<p class="det-main " style="text-align:center;">' +
            data.name +
            '</p>' +
            '<p class="para-normal key">市州：<span class="value">' +
            data.city +
            '</span></p>' +
            '<p class="para-normal key">活动时间：<span class="value"> ' +
            data.starttime +
            ' ~ ' +
            data.endtime +
            '</span></p>' +
            '<p class="para-normal key">活动地点：<span class="value">' +
            data.location +
            '</span></p>' +
            '<p class="para-normal key">人数规模：<span class="value">' +
            data.peoplenum +
            '</span></p>' +
            '<p class="para-normal key">拟投入警力：<span class="value">' +
            data.policejobnum +
            '</span></p>' +
            '<p class="para-normal key">负责人及手机号码：<span class="value">' +
            data.contact +
            '</span></p>' +
            '<p class="para-normal key">警力数量：<span class="value">' +
            data.jlnum.jl +
            '</span></p>' +
            '<p class="para-normal key">天网数量：<span class="value">' +
            data.jlnum.tw +
            '</span></p>' +
            '<p class="para-normal key">WIFI数量：<span class="value">' +
            data.jlnum.wifi +
            '</span></p>' +
            //   '<p class="para-normal key tupian">安保布局图：<span class="value"><img src="'+bjtp+'" style="width:100px;height:80px;"  /></span></p>' +
            '</div></div>';
          var marker;

          for (var i = 0; i < this.guimoOptions.length; i++) {
            let arr = this.guimoOptions[i];
            marker = arr.find(item => {
              return item.id == 'anbao_' + data.activityid;
            });
            if (marker) break;
          }

          let _this = this;
          if (
            marker &&
            this.curSecurity_name.indexOf('' + data.activityid) >= 0
          ) {
            marker.m.openInfoWindowHtml(html);
            //@click="showBigPic('+picdata.ddtpbase64+')"
            //@click="showBigPic('+picdata.ddtpbase64+')"

            $('.tupian').click(function(e) {
              _this.bigPicUrl = $(e.target).attr('src');
              _this.isShowBigPic = true;
            });
          }
        });
    },
    /***显示单个安保预警 所有预警消息
              status: {0------未处置，
                       1------已忽略，
                       2------已发送指令}  
            **/
    showABYJinfo: function(item) {
      console.log('.....showABYJinfo');
      let _this = this;
      //  mapVar.security_twinkle.push({id: d.yjid,m:htmlOver});
      if (mapVar.security_twinkle && mapVar.security_twinkle.length > 0) {
        mapVar.removeMapOverlays(mapVar.security_twinkle);
      }
      return securityApi
        .getABYJinfo(item.activityid)
        .then(res => res.data)
        .then(data => {
          console.log(data);
          if (data && data.rows.length > 0) {
            data.rows.map(item => {
              for (const key in item) {
                if (item.hasOwnProperty(key)) {
                  if (item[key] == null) item[key] = '';
                }
              }
            });

            data.rows.forEach(dobj => {
              _this.twinkleYJXX(dobj);
            });
          }
        });
    },

    /** 安保数据圈内的天网点击**/
    setABVideo: function(domStr) {
      var id = $($(domStr.target._icon.innerHTML)[0]).attr('data-id');
      return securityApi_10086.getSpdw(id).then(opts => {
        //      switch (opts.videoType) {
        //       case 'zjdh': //
        //           type = 1;
        //           break;
        //       case 'zgdx': //
        //           type = 3;
        //           break;
        //       case 'lykj': //
        //           type = 4;
        //           break;
        //       case 'dfwl': //
        //           type = 5;
        //           break;
        //       case 'hkws': //
        //           type = 6;
        //           break;
        //       case 'zjys': //
        //           type = 8;
        //           break;
        //       case 'zxdz':
        //           type = 9;
        //           break;
        //   }
        window.location.href =
          "foundervideo://{'isSingle':false,'isInsert':false,'ptzEnabled':true,'historyEnabled':true,'showList':false," +
          "'videoType':'" +
          opts.videoType +
          "'," +
          "'videoIp':'" +
          opts.videoIp +
          "'," +
          "'videoPort':'" +
          opts.videoPort +
          "'," +
          "'userName':'" +
          opts.userName +
          "'," +
          "'password':'" +
          opts.password +
          "'," +
          "'videoList':[{'spmc':''," +
          "'spbh':'" +
          opts.spbh +
          "'," +
          "'tdbh':'" +
          opts.tdbh +
          "'}]}";
      });
    },

    /****安保图层管理、选择全部和单个选择***/
    handleCheckAllChange: function(val) {
      this.isIndeterminate = false;
      this.checkAll = val;
      this.security_layers.forEach((item, index) => {
        item.ischeck = val;
        if (item.ischeck == true) {
          this.addSelect(index);
        } else {
          this.clearSelect(index);
        }
      });
    },
    handleCheckOneChange: function(value) {
      let checkCount = 0;
      if (this.security_layers[value].ischeck) {
        this.addSelect(value);
      } else {
        this.clearSelect(value);
      }
      this.security_layers.forEach(item => {
        if (item.ischeck) {
          checkCount++;
        }
      });
      if (checkCount == this.security_layers.length) {
        this.checkAll = true;
      } else {
        this.checkAll = false;
      }
    },
    clearSelect: function(index) {
      if (this.guimoOptions[index].length > 0) {
        this.guimoOptions[index].forEach(ly => {
           mapVar.mapInstance.map.removeOverlay(ly.m);
        });
      }
    },
    addSelect: function(index) {
      if (this.guimoOptions[index].length > 0) {
        this.guimoOptions[index].forEach(ly => {
           mapVar.mapInstance.map.addOverlay(ly.m);
          var popdiv = document.getElementById(ly.id);
          if (!!popdiv) {
            document
              .getElementById(ly.id)
              .addEventListener('click', this.showCircles, true);
          }
        });
      }
    },

    /*清除 安保圈层、警力 的图层*/
    clearDraw: function() {
      mapVar.removeMapOverlays(mapVar.overLayer_security);
      mapVar.security_twinkle.forEach(ly => {
        mapVar.removeMapOverlay(ly.m);
      });
      for (const key in  mapVar.gzy_showList) {
        if ( mapVar.gzy_showList.hasOwnProperty(key)) {
          const element =  mapVar.gzy_showList[key];
           mapVar.removeMapOverlays(element);
        }
      }
     
     

      mapVar.security_twinkle = [];
    },
    // 清除重大安保
    clearSSGJ: function() {
      mapVar.removeMapOverlays(mapVar.security_ABpoint);
    },
    setQcView: function() {
      this.clearDraw();
      this.curSecurity_name = [];
    }
    /**********************************安保界面功能，end*****************************/
  },
  created: function() {
    //安保红、蓝圈
    eventBus.$on(eventCollection.PASSWAY_REGION, data => {
      // this.regionInit(data);
    });
    //showCircles
    eventBus.$on(eventCollection.PASSWAY_SHOWCIRCLES, id => {
      this.showCircles(id);
    });

    eventBus.$on(eventCollection.SECURITY_TWINKLE, data => {
      if (this.curSecurity_name.indexOf('' + data.activityid) >= 0) {
        this.changeMarker(data);
        this.showABYJinfo(data);
      }
    });
    eventBus.$on(eventCollection.SET_QCVIEW, () => {
      this.setQcView();
    });
    eventBus.$on(eventCollection.ShowPerceptualSource, data => {
      this.ShowPerceptualSource(data);
    });
  }
};
</script>

<style lang="stylus" >
.det-main {
  line-height: 36px;
  margin-top: 10px;
  font-size: 15rem;
  font-weight: 600;
  color: #fff;
  text-align: left;
  padding-left: 10px;
}

.ctn-hold >.place-hold>.para-normal>.fbzl {
  margin-right: 50%;
  bottom: 10px;
  padding: 0 5px;
  border: 0;
  background: #0d84ec;
  height: 18px;
  line-height: 18px;
  border-radius: 4px;
  cursor: pointer;
}

.ctn-hold >.place-hold>.para-normal>.hl {
  margin-left: 30%;
  margin-right: 5%;
  bottom: 10px;
  padding: 0 5px;
  border: 0;
  background: #5d769a;
  height: 18px;
  line-height: 18px;
  border-radius: 4px;
  cursor: pointer;
}
</style>