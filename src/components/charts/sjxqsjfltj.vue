<template>
  <div class="chart-all">
      <div class="chart-title">
        <span>企业排污情况分类占比</span>
      </div>
      <div class="line-h" id="sjxqsjfltj-chart">
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
  name: 'sjxqsjfltj',
  data() {
    return {
       resultData : {
      axisData: [],
      seriesData: [
         
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
      this.getEventxqsjflCount();
    }
  },
  mounted() {
    // this.fetchChartData(this.currentCity);
    this.getEventxqsjflCount();
  },
  beforeDestroy() {
    barscase.dispose();
    barscase = null;
  },
  methods: {
    getEventxqsjflCount(){
      let resultData = {
        axisData: ['排放未超标','排放接近超标','排放超标10%','排放超标50%'],
        seriesData: [
          {value:234, name:'排放未超标'},
          {value:310, name:'排放接近超标'},
          {value:335, name:'排放超标10%'},
          {value:135, name:'排放超标50%'}
        ]
      };
      this.initChart(resultData.axisData, resultData.seriesData);
      this.setChartResize();
      return;

      let param = {};
        param.timeQuantum = this.timeControl;
        return excontrolApi
        .getEventxqsjflCount(param)
        .then(res => res.data)
        .then(data => {
          // loading.close();
          if (data) {
            this.resultData.axisData = data.axisData;
            this.resultData.seriesData = data.seriesData;
          }
          // for(var i=0;i<data.length;i++)
          // {
          //   this.resultData.axisData.push(data[i].nation);
          //   let tem={value:'',name:''};
          //   tem.value =data[i].count;
          //   tem.name = data[i].nation;
          //   this.resultData.seriesData.push(tem);
          // }
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
      const colors = ['#52EB07','#9999FF','#FFCC00','#FF6666'];
      seriesData.forEach((o, index) => {
        o.type = 'pie'
      });
      const option = {
        tooltip : {
          trigger: 'item',
          formatter: "{b} : {c} ({d}%)"
        },
        legend: {
          data: axisData,
          top: 5,
          itemWidth: 16,
          itemHeight: 8,
          itemGap: 6,
        },
        color: colors,
        series: [{
          type:'pie',
          radius : [0, '70%'],
          center: ['50%','58%'],
          label: {
            normal: {
              formatter:'{d}%',
              color: '#fff',
              position: 'inside'
            }
          },
          data: seriesData
        }]
      };

      if (!barscase) {
        barscase = Ec.init(document.getElementById('sjxqsjfltj-chart'));
      }
      barscase.setOption(option, true);
    },
    setChartResize () {
      let lineDom = document.getElementById('sjxqsjfltj-chart');
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