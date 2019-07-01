<template>
  <div class="chart-all">
      <div class="chart-title">
        <span>实有人口统计</span>
      </div>
      <div class="line-h" id="vital-statistics-chart">
      </div>
  </div>
</template>

<script>
import Ec from 'echarts';
import CssQueries from 'css-element-queries'
import {excontrolApi} from '@/https'

let barscase, cssQueryCase;

export default {
  name: 'vitalStatistics',
  data() {
    return {};
  },
  props: ['currentCode'],
  watch: {
    currentCode (val) {
      this.fetchChartData(val);
    }
  },
  mounted() {
    this.fetchChartData(this.currentCode);
    // let resultData = {
    //   axisData: ['涪城区','游仙区','安州区','江油市','三台县'],
    //   seriesData: [
    //     {
    //         data:[640000, 542000, 421000, 804000, 1349000]
    //     }
    //   ]
    // };
    // this.initChart(resultData.axisData, resultData.seriesData);
    this.setChartResize();
  },
  beforeDestroy() {
    barscase.dispose();
    barscase = null;
  },
  methods: {
    fetchChartData(alias) {
      // let param = {regionCode: alias};
      let param = {};
      if(alias.length==12&&alias.slice(9)!='000'){
          param = {villageId: alias};
      }else{
          param = {regionCode: alias};
      }

      return excontrolApi.yibiaosishiGetRKData(param)
        .then(result => result.data)
        .then(resultData => {
          let axisData = [];
          let seriesData = [{data:[]}];
          for (let i=0; i<resultData.length; i++) {
            axisData.push(resultData[i].name);
            seriesData[0].data.push(resultData[i].count);
          }
          this.initChart(axisData, seriesData);
      });
    },
    initChart(axisData, seriesData) {
      const colors = ['#FF6666', '#12B1E1'];
      seriesData.forEach((o, index) => {
        o.type = 'bar'
        o.itemStyle = { 
          normal : {  
              lineStyle:{  
                color:colors[index]
              }  
          }  
        };
        o.barWidth = 12;
        o.stack = '总量';
      });
      const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                // type: 'cross',
                // crossStyle: {
                //   color: '#999'
                // }
            }
        },
        color: colors,
        legend: {
          data: seriesData,
          itemWidth: 16,
          itemHeight: 8,
          itemGap: 20
        },
        xAxis: [
          {
            type : 'category',
            data : axisData,
            axisLabel: {
              color:'#333'
            },
            axisTick: {
              show: false
            },
            axisLine: {show: false},
          }
        ],
        yAxis: [
          {
            type : 'value',
            axisLine: {show: false},
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#333',
              width: '100%',
              formatter: function (value) {
                var texts = [];
                if(value<10000){
                  texts.push(value);
                } else if (value >=10000) {
                  var text = Math.round(value/10000);
                  texts.push(text + '万');
                }
                return texts;
              }
            },
            splitLine: {
              lineStyle: {
                color: '#f2f2f2'
              }
            }
          }
        ],
        grid: {
          top: 40,
          left: 60,
          right: 20,
          bottom: 40
        },
        series: seriesData
      };

      if (!barscase) {
        barscase = Ec.init(document.getElementById('vital-statistics-chart'));
      }
      barscase.setOption(option, true);
    },
    setChartResize() {
      let lineDom = document.getElementById('vital-statistics-chart');
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
  height: 32px;
  line-height: 32px;
  text-align: center;
  background: #F2F2F2;
  border-bottom: 1px solid #d9dfe5;
  color: #333;
}
.line-h {
  flex: 1;
  margin: 0 10px;
  width: calc(100% - 20px);
  height: calc(100% - 32px);
}
</style>