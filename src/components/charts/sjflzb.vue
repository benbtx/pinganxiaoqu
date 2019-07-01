<template>
  <div class="chart-all">
      <div class="chart-title">
        <span>事件分类占比</span>
      </div>
      <div class="line-h" id="sjflzb-chart">
      </div>
  </div>
</template>

<script>
import Ec from 'echarts';
import CssQueries from 'css-element-queries'
import { excontrolApi } from "@/https";
// import {policeApi} from '@/http'

let barscase, cssQueryCase;

export default {
  name: 'sjflzb',
  data() {
    return {
      resultData : {
      axisData: [],
      seriesData: [
         {value:'', name:''},
      ]
    },

    };
  },
  props: ['currentCity','timeControl'],
  watch: {
    currentCity (val) {
      this.fetchChartData(val);
    },
    timeControl(val){
      this.getEventflzbCount();
    }
  },
  mounted() {
    // this.fetchChartData(this.currentCity);
    // let resultData = {
    //   axisData: ['其他','治安','消防','民生','涉毒','上访','涉稳'],
    //   seriesData: [
    //     {value:234, name:'其他'},
    //     {value:310, name:'治安'},
    //     {value:335, name:'消防'},
    //     {value:135, name:'民生'},
    //     {value:1548, name:'涉毒'},
    //     {value:310, name:'上访'},
    //     {value:234, name:'涉稳'},
       
    //   ]
    // };
    // this.initChart(resultData.axisData, resultData.seriesData);
    // this.setChartResize();
    this.getEventflzbCount();
  },
  beforeDestroy() {
    barscase.dispose();
    barscase = null;
  },
  methods: {
    getEventflzbCount(){
      let param = {};
        param.timeQuantum = this.timeControl;
      return excontrolApi
        .getEventflzbCount(param)
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.resultData.axisData =[];
          this.resultData.seriesData = [];
          for(var i=0;i<data.length;i++)
          {
            this.resultData.axisData.push(data[i].eventType);
            let tem={value:'',name:''};
            tem.value =data[i].count;
            tem.name = data[i].eventType;
            this.resultData.seriesData.push(tem);
          }
          this.initChart(this.resultData.axisData, this.resultData.seriesData);
          this.setChartResize();
        });
    },
    fetchChartData (alias) {
      // policeApi.getPoliceAllTrend({xzqh: alias})
      // .then(result => result.data)
      // .then(resultData => {
      //   this.initChart(resultData.axisData, resultData.seriesData);
      // })
    },
    initChart(axisData, seriesData) {
       const colors = [ '#ff6666','#f93','#fc0', '#6ddb00', '#0c9', '#12b1e1', '#99f', '#00CC99'];
      seriesData.forEach((o) => {
        o.type = 'pie'
      });
      const option = {
        tooltip : {
          trigger: 'item',
          formatter: "{b} : {c} ({d}%)"
        },
        color: colors,
        series: [{
          type:'pie',
          radius : ['52%', '72%'],
          center: ['50%','50%'],
          label: {
            normal: {
              formatter:'{b}: {c}',
              color: '#333'
            }
          },
          data: seriesData
        }]
      };

      if (!barscase) {
        barscase = Ec.init(document.getElementById('sjflzb-chart'));
      }
      barscase.setOption(option, true);
    },
    setChartResize () {
      let lineDom = document.getElementById('sjflzb-chart');
      cssQueryCase = new CssQueries.ResizeSensor(lineDom, () => {
        barscase.resize();
      });
    }
  }
};
</script>


<style scoped>
.chart-all {
  width: 100%;
  height: 100%;
  border: 1px solid #d9dfe5;
}
.chart-title {
  width: 100%;
  height: 28px;
  line-height: 28px;
  font-size: 12px;
  text-align: center;
  background: #F2F2F2;
  border-bottom: 1px solid #d9dfe5;
  color: #333;
}
.line-h {
  flex: 1;
  margin: 0 10px;
  width: calc(100% - 20px);
  height: calc(100% - 28px);
  min-height: 190px;
}
</style>