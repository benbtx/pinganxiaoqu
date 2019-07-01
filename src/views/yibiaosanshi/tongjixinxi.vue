<template>
  <div class="content-body">
    <div class="page-bread">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>统计信息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-row">
      <div class="bl-content">
        <div class="content-left">
          <baidu-map :yibiaosanshu='2'   :p_isShowSelfNavigation='true' :p_isShowNavigation='true' :center="{lng: 104.404, lat: 30.915}"></baidu-map>
        </div>
        <div class="content-right">
            <div class="chart-global">
              <div class="global-item global-dz">
                <p class="dz-text">地址</p>
                <p class="item-num">{{allData.dz}}</p>
              </div>
              <div class="global-item global-rk">
                <p class="rk-text">人口</p>
                <p class="item-num">{{allData.rk}}</p>
              </div>
              <div class="global-item global-fw">
                <p class="fw-text">房屋</p>
                <p class="item-num">{{allData.fw}}</p>
              </div>
              <div class="global-item global-dw">
                <p class="dw-text">单位</p>
                <p class="item-num">{{allData.dw}}</p>
              </div>
              <div class="global-item global-cl">
                <p class="cl-text fa fa-car">车辆</p>
                <p class="item-num">{{allData.cl}}</p>
              </div>
            </div>
            <div class="chart-item">
              <vital-statistics :currentCode="currentCode"></vital-statistics>
            </div>
            <div class="chart-item">
              <house-statistics :currentCode="currentCode"></house-statistics>
            </div>
            <div class="chart-item">
              <car-statistics :currentCode="currentCode"></car-statistics>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { excontrolApi } from "@/https";
import baidumap from "@/components/baidumap/mapInit";
import vitalStatistics from "@/components/charts/vitalStatistics";
import carStatistics from "@/components/charts/carStatistics";
import houseStatistics from "@/components/charts/houseStatistics";
import eventBus from "@/event";
import { eventCollection } from "@/event/resources";

export default {
  name: "tongjixinxi",
  data() {
    return {
      allData: {
        rk: '',
        cl: '',
        dz: '',
        dw: '',
        fw: '',
      },
      currentCode: '',
    };
  },
  components: {
    "baidu-map": baidumap,
    "vital-statistics": vitalStatistics,
    "car-statistics": carStatistics,
    "house-statistics": houseStatistics,
  },
  mounted() {
    this.getAllData("");
  },
  created() {
    eventBus.$off(eventCollection._map2ybsstj)
      .$on(eventCollection._map2ybsstj, (data) => {
        this.currentCode = data.id;
        //更新地址人口房屋单位车辆
         this.getAllData(this.currentCode);
      });
  },
  methods: {
    getAllData(code) {
      let param = {};
      if(code.length==12&&code.slice(9)!='000'){
          param = {villageId: code};
      }else{
          param = {regionCode: code};
      }
       
      return excontrolApi
        .yibiaosishiGetAllData(param)
        .then(res => res.data)
        .then(data => {
          for (let i=0; i<data.length; i++) {
            if (data[i].category == 'person') {
              this.allData.rk = this.formatterData(data[i].count);
            }
            if (data[i].category == 'motorvehicle') {
              this.allData.cl = this.formatterData(data[i].count);
            }
            if (data[i].category == 'standardAddress') {
              this.allData.dz = this.formatterData(data[i].count);
            }
            if (data[i].category == 'housing') {
              this.allData.fw = this.formatterData(data[i].count);
            }
            if (data[i].category == 'company') {
              this.allData.dw = this.formatterData(data[i].count);
            }
          }
        });
    },
    formatterData: function (value) {
      let text = '';
      if (value<100000) {
        text = value;
      } else if (value >=10000) {
        text = Math.round(value/10000) + '万'
      }

      return text;
    }
  }
};
</script>

<style scoped>
.content-row {
  padding: 0;
}
.bl-content {
  height: calc(100vh - 130px);
  margin-bottom: 30px;
  width: 100%;
  box-sizing: border-box;
  background: #fff;
}
.content-left {
  width: calc(100% - 380px);
  height: 100%;
  float: left;
  border: 1px solid #d9dfe5;
}
.content-right {
  width: 380px;
  height: 100%;
  float: left;
  border: 1px solid #d9dfe5;
  border-left: none;
  overflow-y: auto;
}
.chart-global {
  width: 100%;
  height: 90px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.global-item {
  background: #d9dfe5;
  border-radius: 3px;
  flex: 1;
  margin: 5px;
}
.global-item p {
  margin: 0 auto;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #fff;
  font-weight: bold;
}
.global-item .item-num {
  text-align: center;
  width: 86%;
  height: 36px;
  line-height: 36px;
  border-radius: 3px;
  background: rgba(0,0,0,0.1);
  font-size: 16px;
}
.global-rk {
  background: #FF6666;
}
.rk-text::before {
  content: '';
  width: 16px;
  height: 16px;
  display: inline-block;
  background: url(/static/image/tongji/icon-rk.png) no-repeat;
  background-position: center;
  background-size: auto;
  margin-right: 3px;
}
.global-dw {
 background: #00CC99;
}
.dw-text::before {
  content: '';
  width: 16px;
  height: 16px;
  display: inline-block;
  background: url(/static/image/tongji/icon-dw.png) no-repeat;
  background-position: center center;
  background-size: auto;
  margin-right: 3px;
}
.global-cl {
 background: #12B1E1;
}
.cl-text {
  width: 100%;
}
.cl-text::before {
  margin-right: 3px;
}
.global-fw {
  background: #9999FF;
}
.fw-text::before {
  content: '';
  width: 16px;
  height: 16px;
  display: inline-block;
  background: url(/static/image/tongji/icon-fw.png) no-repeat;
  background-position: center;
  background-size: auto;
  margin-right: 3px;
}
.global-dz {
  background: #FF9933;
}
.dz-text::before {
  content: '';
  width: 16px;
  height: 16px;
  display: inline-block;
  background: url(/static/image/tongji/icon-dz.png) no-repeat;
  background-position: center;
  background-size: auto;
  margin-right: 3px;
}
.chart-item {
  width: calc(100% - 10px);
  margin: 0 5px 5px;
  min-height: 200px;
  height: calc((100% - 105px) / 3);
}


</style>