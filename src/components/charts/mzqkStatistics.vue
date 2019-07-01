<template>
  <div class="chart-all">
      <div class="chart-title">
        <span>人员民族情况统计</span>
      </div>
      <div class="line-h" id="mzqk-statistics-chart">
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
  name: 'mzqkStatistics',
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
  props: ['currentCity'],
  watch: {
    currentCity (val) {
      this.fetchChartData(val);
    }
  },
  mounted() {
    // this.fetchChartData(this.currentCity);
    // let resultData = {
    //   axisData: ['蒙古族','维吾尔族','藏族','汉族','壮族','苗族','回族','其它'],
    //   seriesData: [
    //     {value:234, name:'蒙古族'},
    //     {value:310, name:'维吾尔族'},
    //     {value:335, name:'藏族'},
    //     {value:135, name:'汉族'},
    //     {value:1548, name:'壮族'},
    //     {value:310, name:'苗族'},
    //     {value:234, name:'回族'},
    //     {value:135, name:'其它'},
    //   ]
    // };
    // this.initChart(resultData.axisData, resultData.seriesData);
    // this.setChartResize();
    this.getPoliceNationCount();
  },
  beforeDestroy() {
    barscase.dispose();
    barscase = null;
  },
  methods: {
    getPoliceNationCount(){
      return excontrolApi
        .getPoliceNationCount()
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.resultData.axisData =[];
          this.resultData.seriesData = [];
          for(var i=0;i<data.length;i++)
          {
            this.resultData.axisData.push(data[i].nation);
            let tem={value:'',name:''};
            tem.value =data[i].count;
            tem.name = data[i].nation;
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
       const colors = [ '#52EB07','#9999FF','#00F2F2', '#12B1E1', '#FF6666', '#FF9933', '#FFCC00', '#00CC99'];
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
          radius : ['48%', '60%'],
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
        barscase = Ec.init(document.getElementById('mzqk-statistics-chart'));
      }
      barscase.setOption(option, true);
    },
    setChartResize () {
      let lineDom = document.getElementById('mzqk-statistics-chart');
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
}
</style>