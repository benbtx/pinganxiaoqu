<template>
    <div>
        <div id="police_panel" class='setABRegion'>
            <!-- <div >设置中心点</div> <div >设置区域</div> -->
            <el-button size='small' type='primary' style="background:#12b1e1" @click='setCenter' class="el-icon-location">设置中心点</el-button>
            <el-button size='small' type='primary' style="background:#12b1e1" @click='setRegion' class="el-icon-edit">设置核心区</el-button>
            <el-button size='small' type='primary' style="background:#12b1e1" @click='setPolice' class="el-icon-location">设置警力</el-button>
            <el-button size='small' type='primary' style="background:#12b1e1" @click='setCRK' class="el-icon-location">设置出入口</el-button>
            <el-button size='small' type='primary' style="background:#12b1e1" @click='setKakou' class="el-icon-location">设置卡口</el-button>
            <!-- <el-button type='primary' @click='setRegion' class="el-icon-edit">设置核心区</el-button> -->
        </div>

        <div @click='submitOpt' id='summitOptBtn' style="    position: absolute;
           
            padding: 50px;
            line-height: 50px;
            right: 10px;
            z-index: 2;
            bottom: 20px;
            color: #fff;
            font-size: 20px;
            font-weight: bold;
               cursor: pointer;
               background: url('/static/pgis/images/order-btn.png') no-repeat;
               background-size: 114% auto;
               background-position: center;">
            确认
        </div>

    </div>
</template>

<script>
import { mapVar } from '@/components/maps/variable.js';
//import domtoimage from 'dom-to-image';
import html2canvas from 'html2canvas';

export default {
  name: 'SecurityBaobei',
  props: ['lisen'],
  created: function() {},
  mounted() {
    //this.poiSearch_callback = this.lisen;
  },
  render() {},
  data() {
    return {
      // poiSearch_callback: undefined,
      pathInfoArray: {
        p: [],
        crk: [],
        k: [],
        r: ''
      },
      mapclick: null,
      mapRegion: false,
      option: { center: {}, region: '', img: '' },
      mapMarkers: []
      // poiSearchList:[],
    };
  },
  beforeDestroy() {},
  methods: {
    setPolice: function() {
      this.setLabel(this.pathInfoArray.p, mapVar.imgFactory.jlbs, 'jlbs');
    },
    setCRK: function() {
      this.setLabel(this.pathInfoArray.crk, mapVar.imgFactory.crk, 'crk');
    },
    setKakou: function() {
      this.setLabel(this.pathInfoArray.k, mapVar.imgFactory.kakou, 'kakou');
    },
    setLabel: function(arr, img, type) {
      if (this.mapclick) {
         mapVar.mapInstance.map.removeMapEventListener(this.mapclick);
        this.mapclick = null;
      }
      if (this.mapRegion) {
        // mapVar.mapInstance.map.removeMapEventListener(this.mapRegion);
        this.mapRegion = false;
      }
      console.log('..setlabel:' + type);
      let that = this;
      this.mapclick =  mapVar.mapInstance.map.addMapEventListener('click', e => {
        //@argument 点击地图 标注位置
        //mapVar.removeMapOverlays(this.pathInfoArray.kakou);

        let point = new Point(
          parseFloat(e.latlng.lng),
          parseFloat(e.latlng.lat)
        );
        //this.pathInfoArray.c=e.latlng.lng+','+e.latlng.lat;
        var strHtml1 =
          '<div> <img style="width:18px;height:18px;" src="' +
          img +
          '"/></div>';
        let pmarker = new HTMLElementOverLay('', point, strHtml1, null, [
          16,
          32
        ]);
        mapVar.mapInstance.map.addOverlay(pmarker);
        //添加 infowindow
        var html_infowindow = `
                            <div class="ctn-hold">
                            <div  class="place-hold" >
                            <p class="para-normal key"> 
                            <span style='color:#fff;'>标注内容:</span><input id='markerlabel' /></p>
                             <p class="para-normal key"> 
                            <span style='color:#fff;'>责任人员:</span><input id='markerlabel_zrz' /></p>
                             <p class="para-normal key"> 
                            <span style='color:#fff;'>联系方式:</span><input id='markerlabel_lxfs' /></p>
                            
                            </div>
                            <div class="place-hold" style='float: right;'>
                                <div class='btno' id='submitMarker'>确定</div> 
                                <div class='btno' id='cancelMarker'>取消</div> 
                                 </div>
                            </div>`;
        pmarker.openInfoWindowHtml(html_infowindow);
        document
          .getElementById('submitMarker')
          .addEventListener('click', () => {
            let a = document.getElementById('markerlabel').value;
            let zrr = document.getElementById('markerlabel_zrz').value;
            let lxfs = document.getElementById('markerlabel_lxfs').value;
            let bz=JSON.stringify({"zrr":zrr,"lxfs":lxfs}); 
            console.log('submitMarker:' + a);
             mapVar.mapInstance.map.removeOverlay(pmarker);
            //style="text-align:center;background:rgba(0,0,0,0);padding:5px;color:#4dbeff;width: 100px;word-break: keep-all; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
            var strHtml1 =
              '<div style="display: flex; flex-direction: column; text-align: center;align-items: center;"><img style="display: block; width: 30px;height: 30px;" src="' +
              img +
              '"/><span style="text-align:center;background:rgba(0,0,0,0);padding:5px;color:#4dbeff;width: 100px;word-break: keep-all; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' +
              a +
              '</span></div>';

            //  let marker = mapVar.mapInstance.addOverlayPoint(''+e.latlng.lng, parseFloat(e.latlng.lng), parseFloat(e.latlng.lat), 'tongdao_person', '', a, false);
            let marker = new HTMLElementOverLay('', point, strHtml1, null, [
              50,
              30
            ]);
            mapVar.mapInstance.map.addOverlay(marker);
            that.mapMarkers.push(marker);

            //添加图标点击事件，重新输入标注、删除标注
            marker.addListener('click', e => {
              var edit_infowindow = `
                            <div class="ctn-hold">
                            <div  class="place-hold" >
                                <p class="para-normal key"> 
                            <span style='color:#fff;'>标注内容:</span><input value=${a} id='markerlabel' />  </p> 
                              <p class="para-normal key"> 
                            <span style='color:#fff;'>责任人员:</span><input value=${zrr} id='markerlabel_zrz' /></p>
                             <p class="para-normal key"> 
                            <span style='color:#fff;'>联系方式:</span><input value=${lxfs} id='markerlabel_lxfs' /></p>
                            </div>
                            <div class="place-hold" style='float: right; '>
                                <div class='btno' id='submitMarker'>确定</div> 
                                <div class='btno' id='deleteMarker'>删除</div> 
                                 </div>
                            </div>
                           `;
              marker.openInfoWindowHtml(edit_infowindow);
              document
                .getElementById('deleteMarker')
                .addEventListener('click', () => {
                  marker.closeInfoWindowHtml();
                   mapVar.mapInstance.map.removeOverlay(marker);
                  // this.pathInfoArray.k.push({ 'p': point, 'm': strHtml1 });
                  let index = arr.find((item, index) => {
                    return item.p == point;
                  });
                  if (index >= 0) arr.splice(index, 1);
                });

              document
                .getElementById('submitMarker')
                .addEventListener('click', () => {
                   a = document.getElementById('markerlabel').value;
                   zrr = document.getElementById('markerlabel_zrz').value;
                   lxfs = document.getElementById('markerlabel_lxfs').value;

                  marker.closeInfoWindowHtml();
                  console.log('updateMarker:' + a);
                 var strHtml1 =
              '<div style="display: flex; flex-direction: column; text-align: center;align-items: center;"><img style="display: block; width: 30px;height: 30px;" src="' +
              img +
              '"/><span style="text-align:center;background:rgba(0,0,0,0);padding:5px;color:#4dbeff;width: 100px;word-break: keep-all; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' +
              a +
              '</span></div>';
                  marker._marker._icon.innerHTML = strHtml1;

                  let index = arr.find((item, index) => {
                    return item.p == point;
                  });
                  if (index >= 0) {
                      arr.k[index].m = strHtml1;
                      arr.k[index].bz= JSON.stringify({"zrr":zrr,"lxfs":lxfs}); 
                  };
                });
            });

            arr.push({ p: point, m: strHtml1, bz: bz });
          });
        document
          .getElementById('cancelMarker')
          .addEventListener('click', () => {
            pmarker.closeInfoWindowHtml();
            mapVar.mapInstance.map.removeOverlay(pmarker);
          });
      });
    },

    setCenter: function() {
      if (this.mapclick) {
         mapVar.mapInstance.map.removeMapEventListener(this.mapclick);
        this.mapclick = null;
      }
      if (this.mapRegion) {
        this.mapRegion = false;
      }
      console.log('..setCenter');
      let that = this;
      this.mapclick =  mapVar.mapInstance.map.addMapEventListener('click', e => {
        //@argument 点击地图 标注位置
        mapVar.removeMapOverlays(this.pathInfoArray.c);

        let point = new Point(
          parseFloat(e.latlng.lng),
          parseFloat(e.latlng.lat)
        );
        var strHtml1 =
          '<div> <img src="' + mapVar.imgFactory.marker + '"/></div>';
        let pmarker = new HTMLElementOverLay('', point, strHtml1, null, [
          16,
          32
        ]);
        mapVar.mapInstance.map.addOverlay(pmarker);
        that.mapMarkers.push(pmarker);
        // this.pathInfoArray.c={lng:e.latlng.lng,lat:e.latlng.lat};
        this.option.center = { lng: e.latlng.lng, lat: e.latlng.lat };
        // this.poiSearch_callback(e.latlng);
      });
    },
    setRegion: function() {
      if (this.mapclick) {
         mapVar.mapInstance.map.removeMapEventListener(this.mapclick);
        this.mapclick = null;
      }
      if (this.mapRegion) {
        // mapVar.mapInstance.map.removeMapEventListener(this.mapRegion);
        return;
      }

      console.log('..setRegion');
      this.mapRegion = true;
      //this.poiSearch_callback = this.lisen;
      if (window.preGraph)  mapVar.mapInstance.map.removeOverlay(window.preGraph);
       mapVar.mapInstance.drawPolygon(geom => {
        // this.poiSearch_callback(e.latlng);
        //  let g = geom.coordString;
        // let m = '';
        // g = g.split(',');
        // g.map((it, idx) => {
        //   if (idx % 2 == 0) {
        //     m += it + ',';
        //   } else {
        //     m += it + ';';
        //   }
        // });
        this.mapRegion = false;
        this.pathInfoArray.r = geom.coordString;
        // this.userMarker.r=geom.coordString;
        // this.option.region = geom.coordString;
      });
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
              var strHtml1 =
                '<div> <img src="' + mapVar.imgFactory.marker + '"/></div>';
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
              var strHtml1 =
                '<div> <img src="' + mapVar.imgFactory.marker + '"/></div>';
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
    },
    /**提交中心区域和区域*/
    getScreenFlashpot: function() {
      // document.getElementById('summitOptBtn').style.display='none';
      // document.getElementById('police_panel').style.display='none';
      // document.getElementById('POI_search').style.display='none';
      var node = document.getElementById('map');

      let _this = this;
      var canvas = document.createElement('canvas');
      canvas.width = node.clientWidth;
      canvas.height = node.clientHeight;
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.backgroundColor = '#fff';
      document.body.appendChild(canvas);

      var context = canvas.getContext('2d');

      var latlng2clientPos = function(marker) {
        marker = marker._marker;
        let lat = marker._latlng.lat;
        let lng = marker._latlng.lng;
        let m_width = marker._icon.clientWidth,
          m_height = marker._icon.clientHeight,
          m_offsetLeft = marker._icon.offsetLeft,
          m_offsetTop = marker._icon.offsetTop;

        let mapBoxs =  mapVar.mapInstance.map.getBoundsLatLng();
        let max_X = mapBoxs._northEast.lng,
          max_Y = mapBoxs._northEast.lat,
          min_X = mapBoxs._southWest.lng,
          min_Y = mapBoxs._southWest.lat,
          containerLeft = document.getElementsByClassName('el-dialog__body')[0]
            .offsetParent.offsetLeft,
          containerTop =
            document.getElementsByClassName('el-dialog__body')[0].offsetParent
              .offsetTop + 42,
          containerHeight = document.getElementById('map').clientHeight,
          containerWidth = document.getElementById('map').clientWidth;
        let offsetLeft =
          (lng - min_X) / (max_X - min_X) * containerWidth -
          m_width -
          m_offsetLeft;
        let offsetTop =
          containerHeight -
          (lat - min_Y) / (max_Y - min_Y) * containerHeight -
          m_height -
          m_offsetTop;
        return {
          x: Math.ceil(offsetLeft),
          y: Math.ceil(offsetTop)
        };
      };

      var dealTils = function(can) {
        //处理瓦片
        var cvs = can ? can : canvas;
        // context=cvs.getContext('2d');
        return new Promise((resove, reject) => {
          node = document.getElementsByClassName('leaflet-tile-pane')[0];
          var imgNodes = node.getElementsByTagName('img');

          if (imgNodes && imgNodes.length > 0) {
            for (let j = 0; j < imgNodes.length; j++) {
              console.log(j);
              let imgNode = imgNodes[j];
              draw(imgNode, context);
              if (j == imgNodes.length - 1) {
                resove(true);
              }
            }
          }
        });
      };

      var dealMarkers = function() {
        // 处理marker
        return new Promise((resove, reject) => {
          console.log(
            '处理marker---##########################################################################################################---'
          );
          node = document.getElementsByClassName('leaflet-marker-pane')[0];
          var mkNodes = node.getElementsByClassName('leaflet-marker-icon');
          if (mkNodes && mkNodes.length > 0) {
            for (let k = 0; k < mkNodes.length; k++) {
              let mkNode = mkNodes[k];
              html2canvas_f(mkNode);
              if (k == mkNodes.length - 1) {
                resove(true);
              }
            }
          }
        });
      };

      var dealVec = function() {};

      var deal = function() {
        dealTils().then(() => {
          //dealVec.then(()=>{
          dealMarkers().then(() => {
            //download(canvas,'deal');
          });
          // })
        });
      };

      var byMyself = function() {
        //处理绘制的 SVG 图
        // node=document.getElementsByClassName('leaflet-overlay-pane')[0];
        // html2canvas_f(node);

        html2canvas(node, {
          useCORS: true
          //backgroundColor:'rgba(0,0,0,0)' // #00000000,
          //allowTaint: true // 允许加载跨域资源
          //logging:false,
        })
          .then(function(cvs) {
            return new Promise((resove, reject) => {
              var image = new Image();
              image.style.backgroundColor = 'rgba(0,0,0,0)';
              image.crossOrigin = 'Anonymous';
              image.onload = function() {
                context.drawImage(image, 0, 0);
                resove(true);
              };
              if (image.complete || image.complete === undefined) {
                image.src = '';
                image.src = cvs.toDataURL('image/png');
              }
              image.src = cvs.toDataURL('image/png');
            });
          })
          .then(d => {
            // 处理marker
            return new Promise((resove, reject) => {
              console.log(
                '处理marker---##########################################################################################################---' +
                  d
              );
              node = document.getElementsByClassName('leaflet-marker-pane')[0];
              var mkNodes = node.getElementsByClassName('leaflet-marker-icon');
              if (mkNodes && mkNodes.length > 0) {
                for (let k = 0; k < mkNodes.length; k++) {
                  let mkNode = mkNodes[k];
                  html2canvas_f(mkNode);
                  if (k == mkNodes.length - 1) {
                    resove(true);
                  }
                }
              }
            });
          })
          .then(d => {
            console.log(
              '安保截图---&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&...' +
                d
            );
            // download(canvas,'安保截图');
          });
      };

      var draw = function(imgNode, ctx) {
        //let contx=ctx?ctx:context;
        let image = new Image();
        let top = imgNode.offsetTop;
        let left = imgNode.offsetLeft;
        image.crossOrigin = 'Anonymous';
        document.body.appendChild(image);
        image.onload = function() {
          console.log(left + '.' + top + ':' + image.src);
          context.drawImage(image, left, top);
          document.body.removeChild(image);
        };
        if (image.complete || image.complete === undefined) {
          image.src = '';
          image.src = imgNode.getAttribute('src');
        }

        image.src = imgNode.getAttribute('src');
      };

      var download = function(canvas, fileName) {
        var a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = fileName ? fileName : 'aaaaaaaaaaaaa';
        a.click();
      };

      var toSvg = function() {
        var svgXml = $('.leaflet-overlay-pane').html();
        var image = new Image();
        image.onload = function() {
          context.drawImage(image, 0, 0);
        };
        image.src =
          'data:image/svg+xml;base64,' +
          window.btoa(unescape(encodeURIComponent(svgXml)));
        image.onerror = e => {
          console.log('draw svg failed....');
        };
      };

      var h2c = function() {
        dealTils().then(() => {
          html2canvas(node, {
            useCORS: true,
            //backgroundColor:'rgba(0,0,0,0)' // #00000000,
            //allowTaint: true // 允许加载跨域资源
            logging: false
          }).then(function(cvs) {
            context.drawImage(cvs, 0, 0);
            cvs.style.position = 'absolute';
            cvs.style.top = '0';
            document.body.appendChild(cvs);
          });
        });
      };

      var html2canvas_f = function(nd) {
        // let left = nd.style.transform.replace('translate3d','').split('rotate')[0].replace('(','').replace(')','').split(',')[0].replace('px','');
        // let top = nd.style.transform.replace('translate3d','').split('rotate')[0].replace('(','').replace(')','').split(',')[1].replace('px','');
        console.log(_this.mapMarkers[0]._marker._icon == nd);
        console.log(_this.mapMarkers[1]._marker._icon == nd);
        let mk = _this.mapMarkers.find(mk => {
          //return mk._marker._icon.innerHTML=nd;
          return mk._marker._icon == nd;
        });
        //根据 marker 经纬度转---屏幕坐标
        let clientXY = latlng2clientPos(mk);
        console.log(clientXY);

        let left = parseFloat(clientXY.x);
        let top = parseFloat(clientXY.y);
        console.log('................left:' + left + ',top:' + top);
        nd = nd.getElementsByTagName('div')[0];
        html2canvas(nd, {
          useCORS: true,
          backgroundColor: 'rgba(0,0,0,0)' // #00000000,
          //allowTaint: true // 允许加载跨域资源
          // logging:false,
        }).then(function(cvs) {
          // cvs.style.position = 'absolute';
          //cvs.style.top = '0';
          // document.body.appendChild(cvs);
          var image = new Image();
          image.style.backgroundColor = 'rgba(0,0,0,0)';
          image.crossOrigin = 'Anonymous';
          image.onload = function() {
            context.drawImage(image, left, top);
          };

          image.src = cvs.toDataURL('image/png');
          console.log(image.src);
        });
      };

      var printMap = (function() {
        let n = document.getElementById('map');
        html2canvas(n, {
          useCORS: true
          //backgroundColor:'rgba(0,0,0,0)' // #00000000,
          //allowTaint: true // 允许加载跨域资源
          //logging:false,
        }).then(canvs => {
          canvs.style.position = 'absolute';
          canvs.style.top = '0';
          canvs.style.left = '50px';
          document.body.appendChild(canvs);
        });
      })();
      // byMyself();
      //deal();

      // document.getElementById('summitOptBtn').style.display = 'block';
      // document.getElementById('police_panel').style.display = 'block';
      // document.getElementById('POI_search').style.display = 'block';
    },
    cut: function(myCanvas, cb) {
      //由于polygon给的数值是经纬度的，所以首先要转成基于浏览器像素的，高德提供这个方法。
      var points = convertToPx();
      //下面的两个升序排序是为了得到不规则多边形的矩形容器左上角的像素起点的xy轴，还有右下角的xy轴
      //X轴升序
      //这里要注意为什么要使用Array.from呢。是为了创建一份独立的数据，不然yAsc排序后xAsc 也会改变
      var xAsc = Array.from(
        points.sort(function(a, b) {
          return a[0] > b[0];
        })
      );
      //y轴升序
      var yAsc = points.sort(function(a, b) {
        return a[1] > b[1];
      });
      //左上角像素坐标
      var min = [xAsc[0][0], yAsc[0][1]];
      //右下角像素坐标
      var max = [xAsc[xAsc.length - 1][0], yAsc[yAsc.length - 1][1]];
      //从canvas中获得图像方法需要4个参数。起点的x y轴, width, height。 +20为了不让生成的图片都贴这边
      var width = max[0] - min[0] + 20;
      var height = max[1] - min[1] + 20;
      //下面的-10 是起点的xy轴都往左上角缩小10像素。
      //imgData是得到多边形范围的数据
      var imgData = myCanvas
        .getContext('2d')
        .getImageData(xAsc[0][0] - 10, yAsc[0][1] - 10, width, height);
      //创建一个新的canvas是为了把得到的imgData数据写入，然后转成最终效果的base64
      var canvas2 = document.createElement('canvas');
      var cxt2 = canvas2.getContext('2d');
      canvas2.width = width;
      canvas2.height = height;
      cxt2.putImageData(imgData, 0, 0, 0, 0, width, height);
      document.body.appendChild(canvas2);

      cb &&
        cb({
          src: canvas2.toDataURL('image/png'),
          width: width,
          height: height
        });
      function convertToPx() {
        //通过map转换为像素
        // 将当前地图范围转换成 屏幕坐标

        let dom = document.getElementsByClassName('el-dialog__body')[0];
        let dom_parent = document.getElementsByClassName('el-dialog__body')[0]
          .offsetParent;
        let dom_topleft = [dom_parent.offsetLeft, dom_parent.offsetTop];

        let dom_topright = [
          dom_parent.offsetLeft + dom.clientWidth,
          dom_parent.offsetTop
        ];
        let dom_buttomright = [
          dom_parent.offsetLeft + dom.clientWidth,
          dom_parent.offsetTop + dom.clientHeight
        ];
        let dom_buttomledt = [
          dom_parent.offsetLeft,
          dom_parent.offsetTop + dom.clientHeight
        ];
        return [dom_topleft, dom_topright, dom_buttomright, dom_buttomledt];
        // return arr.map(function (item) {
        //     var pixel = map.lnglatTocontainer([item.lng, item.lat])
        //     return [pixel.getX(), pixel.getY()]
        // })
      }
    },
    submitOpt: function() {
      if (this.mapclick) {
         mapVar.mapInstance.map.removeMapEventListener(this.mapclick);
        this.mapclick = null;
      }
      if (this.pathInfoArray.c == {}) {
        this.$message({
          message: '没有选择中心点',
          type: 'warning'
        });
        return;
      }
      if (this.pathInfoArray.r == '') {
        this.$message({
          message: '没有设置核心区域',
          type: 'warning'
        });
        return;
      }

      // this.option.img= this.getScreenFlashpot();
      this.option.region = JSON.stringify(this.pathInfoArray);
      this.lisen(this.option);
    }
  }
};
</script>
<style scoped>
.setABRegion {
  z-index: 1002;
  position: absolute;
  display: flex;
  right: 1%;
  top: 5%;
  color: #ffffff;
}

.ctn-hold > .place-hold > .para-normal > .fbzl {
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
.ctn-hold > .place-hold > .para-normal > .hl {
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

<style >
.btno {
  padding: 2px;
  background-color: #d8d7d2;
  border-radius: 2px;
  cursor: pointer;
  margin: 2px;
  float: right;
}

.el-dialog__body {
  padding: 0;
}
</style>