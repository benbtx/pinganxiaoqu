import $ from 'jquery';
import { mapVar } from '@/components/maps/variable.js';

var overlays = [];
var cur_Marker = null;
export const ControlGis = {


    /**显示当前数据**/
    setYjPoint: function (options) {
        // mapVar.removeMapOverlays(this.overlays);
        // if (options && options.length > 0) {
        //     options.forEach(atm => {
        //         console.log("lng:"+atm.jd +',lat:'+atm.wd);
        //         if (atm.jd && atm.wd) {
        //             let p = new Point(parseFloat(atm.jd), parseFloat(atm.wd));
        //             let h = '<img data-id=' + atm.dataid + '  style="display:block;width: 18px;height: 24px;" src=' + mapVar.imgFactory.marker + '>';
        //             var htmlOver = new HTMLElementOverLay('', p, h, null, [8, 8]);
        //             this.overlays.push(htmlOver);
        //             appMap.map.addOverlay(htmlOver);
        //         }
        //     });
        // }
    },
    /**根据点击点位定位**/
    location: function (row) {

        if (row.lon && row.lat) {
            row.jd = row.lon;
            row.wd = row.lat;
        }
        if (row.jd && row.wd) {
            //console.log(this.cur_Marker);
            if (this.cur_Marker) {
                mapVar.mapInstance.map.removeOverlay(this.cur_Marker);
            }
            let p = new Point(parseFloat(row.jd), parseFloat(row.wd));
            let h = mapVar.imgMarker(mapVar.imgFactory.selcetIcon, [20, 20]);
            this.cur_Marker = new HTMLElementOverLay('', p, h, null, [8, 8]);
            if (window.location.pathname.indexOf('control')>=0) {
                mapVar.mapInstance.map.addOverlay(this.cur_Marker);
                mapVar.mapInstance.map.centerAndZoom(p, 13);
            }
            else {
                mapVar.mapInstance2.map.addOverlay(this.cur_Marker);
                mapVar.mapInstance2.map.centerAndZoom(p, 13);
            }
        }
    },

};
