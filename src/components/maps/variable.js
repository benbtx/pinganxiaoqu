




/**
 * 地图公共变量
 */
import $ from 'jquery';
import { topoAnalysis } from '@/components/maps/topoAnalysis.js';



export const mapVar = {
    demoApp:null,
    mapInstance:null,
    mapInstance2:null,
    // 地图覆盖层图片资源
    imgFactory: {
        //securityGis
        over: "../../static/images/map/yjs.png",
        wyj: "../../static/images/map/wyj.png",
        yyj: "../../static/images/map/bj0.gif",
        yyj1: "../../static/images/map/bj00.gif",
        //Policegis
        xs: "../../static/pgis/images/xs.png",
        za: "../../static/pgis/images/za.png",
        jt: "../../static/pgis/images/jt.png",
        hz: "../../static/pgis/images/hz.png",
        qz: "../../static/pgis/images/qz.png",
        qt: "../../static/pgis/images/qt.png",
        yjs: "../../static/images/map/yjs.gif",
        //pGisdatalayer
        tw: '../../static/pgis/images/tw.png',
        jl: '../../static/pgis/images/jl.png',
        wifi: '../../static/images/map/wifi.png',
        //passwaygis
        marker: "../static/images/map/marker.png",
        guiji: '../../static/images/map/guiji.png',
        QD: "../static/images/map/QD.png",
        bj0: "../../static/images/map/bj0.gif",
        car: "../static/images/map/car.png",
        r: '../static/images/map/r.png',
        default: '../static/images/map/default.png',
        new: "../static/images/map/new.png",
        icon_b_02: '../static/images/map/icon_b_02.png',
        selcetIcon: "../static/images/map/selcetIcon.gif",

        wifi_pt: "../../static/pgis/images/wifi_pt.png",
        wifi_tz: "../../static/pgis/images/wifi_tz.png",

        gzry1: "../../static/pgis/images/1jyj.gif",
        gzry2: "../../static/pgis/images/2jyj.gif",
        gzry3: "../../static/pgis/images/3jyj.gif",
        gzry4: "../../static/pgis/images/4jyj.gif",
        //安保报备 

        crk: "../../static/pgis/images/crk.png",
        jlbs: "http://10.64.30.92:9527/jlbs.png",
        kakou: "../../static/pgis/images/kakou.png",

        wb: "http://10.64.30.92:9527/wb.png",
        ld: "http://10.64.30.92:9527/jcz.png",
        zdcs: "../../static/pgis/images/zdcs.png",

    },
    wifiType: {
        '01': '特种采集设备',
        '02': '普通采集设备'
    },
    policeType: {
        '1': '警用车辆',
        '2': '警用摩托',
        '3': '其他定位设备',
        '4': '警用单兵',
        '5': '设备定位'
    },
    pgisLayers: {
        'wb': 'JWZH_ZAGL_WB_PT',
        'ld': 'JWZH_ZAGL_LD_PT'
    },
    gzy_showList: { tw: [], jl: [], wifi: [], specialWifi: [] },
    //安保圈层、警力
    overLayer_security: [],
    overLayer_abqgzy: [],
    security_twinkle: [],
    //安保报备活动
    security_ABpoint: [],

    //批量移除地图覆盖物
    removeMapOverlays: function (overlays) {
        if (!overlays || overlays.length == 0)
            return;

        overlays.forEach(ly => {

            if (ly.m) {
                this.mapInstance.map.removeOverlay(ly.m);
            }
            else {
                this.mapInstance.map.removeOverlay(ly);
            }

        },this);
        overlays = [];
    },
    //移除单个地图覆盖物
    removeMapOverlay: function (overlay) {
         this.mapInstance.map.removeOverlay(overlay);
    },
    //地图初始化
    initMap: function (data) {
        let _this=this;
        var mInstance=null;
        function loadMap() {
           
                if (!data) {
                    /*初始化地图组件**/
                    mInstance = new DemoApp();
                    mInstance.loadMap('map');
                    mInstance.setCenter(104, 30.5, 13);
                    mInstance.changeMapColors("white");
                    return;
                }
                let mapcontainer = '';
                
                if (data.id) {
                    mapcontainer = data.id;
                } else {
                    mapcontainer = 'map';
                }

                mInstance = new DemoApp();
                mInstance.loadMap(mapcontainer);
                mInstance.setCenter(104, 30.5, 9);
                if(data.mapcolor=="white")
                mInstance.changeMapColors("white");
                _this.demoApp=mInstance;
               if(data.id=='map_loc'){
                _this.mapInstance2=mInstance.appMap;
               }else
                {_this.mapInstance=mInstance.appMap;}
              

            
        };

        return new Promise(resolve => {
            if (window.DemoApp) {
                loadMap();
                resolve();
            }else{
                $.getScript('http://80.2.30.24:9090/static/pgis/init.js').done(() => {
                    DemoApp.onLoad(() => {
                    loadMap();
                    resolve();
                })
                });
            }
        })
    },


    imgMarker: function (img, size) {
        if (size) {
            return '<div > <img style="width:' + size[0] + 'px;height:' + size[1] + 'px" src=" ' + img + ' "/></div>';
        }
        else
            return '<div> <img src=" ' + img + ' "/></div>';
    },

    addHotSpot: function (layerName, data, markerIcon, option) {
        var template = '<table class="zebra"><tbody>';
        for (var key in option.format) {
            template += '<tr><td>' + option.format[key] + '</td><td>' + key + '</td></tr>';
        }
        template += '</tbody></table>';

        var template = template;
        var paramTwo = {
            hotSpotClick: function (pop) {
                var data = pop.contentData.customs;
                var title = data.MC ? data.MC : option.title;
                var showInfoFormat = option.format;
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
                            showInfoFormat[key] + "'>" +
                            data[key] +
                            '</span></div>';
                }
                html += '</div>';
                pop.setContent(html);
            },
            colums: option.format,
            template: template,
            //where:" AND XIANJXZQHDM:*"+gxdwdm+"*",
            icon: markerIcon
        };
         this.mapInstance.addHotSpot(layerName, markerIcon, paramTwo);
    },
    /**
     * 过滤数据
     */
    filterData: function (data, polystr) {
        // var worker=new Worker('./test.js');
        // worker.postMessage('ddddddddddd');
        // worker.onmessage=function(){

        //     worker.terminate();//关闭线程
        // };
    },



}

export const draw = {
    //画点
    drawPoint: function (callback) {
        if (!callback) {
            return;
        }
         this.mapInstance.map.changeDragMode('drawPoint', function (point) {
          
            if (!point) {
                return;
            }
            if (callback) { callback(point); }
        });
    },
    //画线
    drawPolyline: function (callback, drawColor, options) {
        if (!callback) {
            return;
        }
        var key = "drawPolyline";
        if ( this.mapInstance.map.is3DMap) {
            key += '2';
        }
         this.mapInstance.map.changeDragMode(key, function (path) {
            if (callback) { callback(path); }
        }, null, null, drawColor, options);
    },
    //画圆
    drawCircle: function (callback) {
         this.mapInstance.map.changeDragMode('drawCircle', function (o) {
            if (window.preGraph) {
                 this.mapInstance.map.removeOverlay(window.preGraph);
            };
            window.preGraph = o;
            if (callback) { callback(o); }
        });
    },
    //画矩形
    drawRectangle: function (callback) {
         this.mapInstance.map.changeDragMode('drawRect', function (o) {
            if (window.preGraph) {
                 this.mapInstance.map.removeOverlay(window.preGraph);
            };
            window.preGraph = o;
            if (callback) { callback(o); }
        });
    },
    //画多边形
    drawPolygon: function (callback, options) {
         this.mapInstance.map.changeDragMode('drawPolygon', function (o) {
            if (window.preGraph) {
                 this.mapInstance.map.removeOverlay(window.preGraph);
            };
            window.preGraph = o;
            if (callback) {
                callback(o);
            }
        }, false, null, null, options);
    },

}

