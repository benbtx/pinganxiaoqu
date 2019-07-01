
<template>
    <div id="map" style=" border: 1px solid #ccc;height: 450px;;width:100%;"></div>
</template>

<script>
import { mapVar } from '@/components/maps/variable.js';
import eventBus from '@/event';
import { eventCollection } from '@/event/resources';
export default {
  name: 'ControlGis',
  
  created: function() {
   

    eventBus.$on(eventCollection.CONTROL_SELECTROWPOSTION, data => {
      this.location(data);
    });

    eventBus.$on(eventCollection.CONTROL_SHOWPOSTION, data => {
      this.setYjPoint(data);
    });
  },
  mounted() {
    if (!window.DemoApp||typeof(window.DemoApp)!="function") {
          this.$confirm('地图加载失败，请刷新重试！', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(e => {
              window.location.reload();
          });
      }
      else {
          mapVar.initMap();
      }
  },
  render() {},
  data() {
    return {
      overlays: [],
      cur_Marker: null
    };
  },
  beforeDestroy() {},
  methods: {
    /**显示当前数据**/
    setYjPoint: function(options) {
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
    location: function(row) {
      if (row.jd && row.wd) {
        if (this.cur_Marker) {
           mapVar.mapInstance.map.removeOverlay(this.cur_Marker);
        }
        let p = new Point(parseFloat(row.jd), parseFloat(row.wd));
        let h =
          '<img  style="display:block;width: 24px;height: 24px;" src="' + mapVar.imgFactory.yyj +  '">';
        this.cur_Marker = new HTMLElementOverLay('', p, h, null, [8, 8]);
         mapVar.mapInstance.map.addOverlay(this.cur_Marker);
         mapVar.mapInstance.map.centerAndZoom(p, 13);
      }
    }
  }
};
</script>