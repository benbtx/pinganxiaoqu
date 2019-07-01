
import $ from 'jquery';
import {mapVar} from '@/components/maps/variable.js';

/***警情预警预测 */

var marker_click = [];//点击时定位
var marker_ts = [];//推送时定位

export const policeGis= {

    // 清除实时轨迹、重大安保
     clearSSGJ:function(){
       mapVar.removeMapOverlays(marker_click);
     },
 

    /**********************************警情预警界面功能，*****************************/
    //警情预测 ---------------------生成热点图
    setMarkerOnMap(data) {
        let unitInfo = data;
        if (!unitInfo.lng || !unitInfo.lat) {
            console.log("lng:" + unitInfo.lng, "lat:" + unitInfo.lat);
            return;
        }

        let ptCord = new Point(parseFloat(unitInfo.lng), parseFloat(unitInfo.lat));

        let strHtml1 = '';
        let marker = "";
        var jqms = '';
        var pcsmc = '';
        var img = "";

        if (data.bjlb == "010000") //刑事案件
        {
            strHtml1 =mapVar.imgMarker(mapVar.imgFactory.xs);  //'<div> <img src="'+mapVar.imgFactory.xs+'"/></div>';
        }
        //行政治安
        else if (data.bjlb == "020000") {
            strHtml1 = mapVar.imgMarker(mapVar.imgFactory.za);//'<div> <img src=" '+mapVar.imgFactory.za+' "/></div>';
        }
        //交通
        else if (data.bjlb == "030000") {
            strHtml1 = mapVar.imgMarker(mapVar.imgFactory.jt);//'<div> <img src=" '+mapVar.imgFactory.jt+' "/></div>';
        }
        //火灾
        else if (data.bjlb == "040000") {
            strHtml1 = mapVar.imgMarker(mapVar.imgFactory.hz);//'<div> <img src=" '+mapVar.imgFactory.hz+' "/></div>';
        }
        //群众
        else if (data.bjlb == "050000") {
            strHtml1 =mapVar.imgMarker(mapVar.imgFactory.qz);// '<div> <img src=" '+mapVar.imgFactory.qz+'"/></div>';
        }
        //其他
        else {
            strHtml1 =mapVar.imgMarker(mapVar.imgFactory.qt);// '<div> <img src=" '+mapVar.imgFactory.qt+' "/></div>';
        }

        //data.t == '002' 代表点击的历史
        if (data.t && data.t == '002') {
            this.clearSSGJ();
        
            marker = new HTMLElementOverLay('ppx', ptCord, strHtml1, null, [20, 20]);
            marker_click.push(marker);
            jqms = unitInfo.bjxxxx;
            pcsmc = unitInfo.pcsmc;
        } else {
           
            marker = new HTMLElementOverLay('ppx', ptCord, strHtml1, null, [20, 20]);
            jqms = unitInfo.jqms;
            pcsmc = unitInfo.jjdwmc;
        }
        //bjxxxx  pcsmc
        let jqfl = unitInfo.jqlbmc;
        let afdz = unitInfo.afdz;
         mapVar.mapInstance.map.addOverlay(marker);
        let mid = marker._marker._leaflet_id;
        marker.addListener('click', () => {
            let domid = 'clearYJD_' + mid;
            let html = "<div style='color:#fff;width: 300px; background: #0d283c; border: 0px solid #ddd; border-radius: 3px;position: relative;padding-bottom: 2px;'>" +
                "<div><p style=' border-radius: 3px;cursor: default; width: 100%; height: 30px; background: #09385a; line-height: 30px; border-bottom: #D0D0D0; padding-left: 10px;  font-size: 13px;color: #fff;'>接警单位:" + pcsmc + "</p><p><span style='padding-left: 10px;word-break:normal;width:auto;display:block;white-space:pre-wrap;white-space: pre-wrap;word-wrap: break-word; overflow: hidden;'>警情描述:" + jqms + "</span></p>" +
                "<p><span style='   padding-left: 10px;word-break:normal;width:auto;display:block;white-space:pre-wrap;white-space: pre-wrap;word-wrap: break-word; overflow: hidden;'>警情分类:" + jqfl + "</span></p>" +
                "<p><span style='padding-left: 10px;word-break:normal;width:auto;display:block;white-space:pre-wrap;white-space: pre-wrap;word-wrap: break-word; overflow: hidden;'>案发地址:" + afdz + "</span></p></div>" +
                "<div><a id=" + domid + "  style='margin-left: 200px !important;'>删除当前预警点</a></div>" +
                "</div>"

            marker.openInfoWindowHtml(html);
            let dom = document.getElementById(domid);
            if (!!dom) {
                document.getElementById(domid).addEventListener('click', () => {
                    let marker_id = domid.split('_')[1];
                    //  let marker_c =null;
                    marker_ts.forEach((item, index) => {
                        if (item.mid == marker_id) {
                            mapVar.removeMapOverlay(item.d);
                           //  mapVar.mapInstance.map.removeOverlay(item.d);
                            marker_ts.splice(index, 1)
                        }
                    })

                })
            }
        })
        marker_ts.push({ mid: mid, d: marker });
        setTimeout(
            () => {
                 mapVar.mapInstance.map.centerAndZoom(ptCord, 16);
            }, 800
        )
    },
    //警情预测 ---------------------警局、派出所撒点 
    markerPolice: function (data) {
        if (!data && data.length == 0) {
            return;
        }
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const element = data[key];
                this.setMarkerOnMap(element);
            }
        }
    },
    searchByZZJGDM: function (item) {
        // item={
        //     jjdwmc:"西华街道青杠社区巡逻队",
        //     jqms:'有人偷鸡',

        // };
        // let dwbh = 'D510 1124 5000 0201 6071 2001 9057 60';
        let dwbh = item.jjdwmc;//item.jjdwmc;
        let layername = 'DWXX_GAJG_PT';
        var queryType = 'FQ'; //查询类型：全文检索
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
            '&keywords=' + dwbh +
            '&filterCustom=' +
            where +
            '&pageIndex=0&pageSize=20000' +
            spaceQueryStr;
        DemoApp.EzPOISearch_sc(parameter, function (data) {
            console.log(data);
            if (data.groups.length == 0) {
                return;
            }
            // let output = function (data) {
            //     var eleLink = document.createElement('a');
            //     eleLink.download = 'gajg.json';
            //     eleLink.style.display = 'none';
            //     var blob = new Blob([data]);
            //     eleLink.href = URL.createObjectURL(blob);
            //    // eleLink.href = URL.createObjectURL(blob, { type: 'application/vnd.ms-excel' });
            //     document.body.appendChild(eleLink);
            //     eleLink.click();
            //     document.body.removeChild(eleLink);
            // };
            // output(data.groups[0].pois);

            let unitInfo = data.groups[0].pois[0];
            let ptCord = new Point(parseFloat(unitInfo.x), parseFloat(unitInfo.y));
            let strHtml1 = '<div> <img src=" '+mapVar.imgFactory.yjs+' "/></div>';
            let marker = new HTMLElementOverLay('ppx', ptCord, strHtml1, null, [20, 20]);

             mapVar.mapInstance.map.addOverlay(marker);
            let mid = marker._marker._leaflet_id;
            marker.addListener('click', () => {
                let domid = 'clearYJD_' + mid;
                let html = "<div style='color:#fff;width: 300px; background: #0d283c; border: 0px solid #ddd;position: relative;padding-bottom: 2px;'>" +
                    "<div><p style='cursor: default; width: 100%; height: 30px; background: #09385a; line-height: 30px; border-bottom: #D0D0D0; padding-left: 10px;  font-size: 14px;color: #fff;'>接警单位:" + item.jjdwmc + "</p><p style='padding-left: 10px;'>警情描述:" + item.jqms + "</p></div>" +
                    "<div><a id=" + domid + "  style='margin-left: 200px !important;'>删除当前预警点</a></div>" +
                    "</div>"

                marker.openInfoWindowHtml(html);
                let dom = document.getElementById(domid);
                if (!!dom) {
                    document.getElementById(domid).addEventListener('click', () => {
                        let marker_id = domid.split('_')[1];
                        //  let marker_c =null;
                        marker_ts.forEach((item, index) => {
                            if (item.mid == marker_id) {
                                mapVar.removeMapOverlay(item.d);
                                marker_ts.splice(index, 1)
                            }
                        })


                    })
                }
            })

            marker_ts.push({ mid: mid, d: marker });
            setTimeout(
                () => {
                     mapVar.mapInstance.map.centerAndZoom(ptCord, 16);
                }, 800
            )
        });

    },

    //通用全文检索数据
    EzPOISearch_sc: function (parameter, callback) {
        // 条件处理
        $.ajax({
            xhrFields: { withCredentials: true },
            crossDomain: true,
            type: "post",
            url: "http://www.pgis.sc/EzPOISearch/PoiWMTSV1",
            data: encodeURI(parameter),
            async: false,
            dataType: 'jsonp',
            success: callback
        });
    },

    //警情预测 --------------------标注重要警情
    markerVIPInfo: function () { },
    /**********************************警情预警界面功能，end*****************************/

};


