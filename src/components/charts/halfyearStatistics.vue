<template>
  <div class="chart-all">
      <div class="chart-title">
        <span>半年内预警、报修、投诉趋势图</span>
      </div>
      <div class="line-h" id="halfyear-statistics-chart">
      </div>
  </div>
</template>

<script>
import Ec from 'echarts';
import CssQueries from 'css-element-queries'
// import {policeApi} from '@/http'

let barscase, cssQueryCase;

export default {
  name: 'halfyearStatistics',
  data() {
    return {};
  },
  mounted() {
    let resultData = {
      axisData: ['2018-06','2018-07','2018-08','2018-09','2018-10','2018-11'],
      seriesData: [
        {
            name:'预警',
            type:'bar',
            data:[6150, 2200, 2100, 1400, 1930,3452]
        },
        {
            name:'报修',
            type:'bar',
            data:[5100, 1300, 1800, 1400, 900,1555]
        },
        {
            name:'投诉',
            type:'bar',
            data:[324, 455, 444, 565, 443, 342]
        }
      ]
    };
    this.initChart(resultData.axisData, resultData.seriesData);
    this.setChartResize();
  },
  beforeDestroy() {
    barscase.dispose();
    barscase = null;
  },
  methods: {
    fetchChartData (alias) {
      // policeApi.getPoliceAllTrend({xzqh: alias})
      // .then(result => result.data)
      // .then(resultData => {
      //   this.initChart(resultData.axisData, resultData.seriesData);
      // })
    },
    initChart(axisData, seriesData) {
      const colors = ['#9999FF', '#12B1E1', '#00CC99'];
      seriesData.forEach((o, index) => {
        o.type = 'line'
        o.symbol = 'circle'
        o.symbolSize = 5
        o.itemStyle = { 
          normal : {  
              color: colors[index],  
              lineStyle:{  
                color:colors[index]
              }  
          }  
        }
      });
      const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                // type: 'cross',
                // crossStyle: {
                //   color: '#999'
                // }
            },
            confine: true
        },
        color: colors,
        legend: {
          data: seriesData,
          itemWidth: 16,
          itemHeight: 8,
          itemGap: 20,
        },
        xAxis : [
          {
            type : 'category',
            data : axisData,
            axisLabel: {
              color:'#333',
              rotate: 20,
            },
            axisTick: {
              show: false
            },
            axisLine: {show: false},
          }
        ],
        yAxis : [
          {
            type : 'value',
            axisLine: {show: false},
            splitNumber: 4,
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
                }
                else if (value >=10000) {
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
          top: 30,
          left: 40,
          right: 10,
          bottom: 34
        },
        series : seriesData
      };

      if (!barscase) {
        barscase = Ec.init(document.getElementById('halfyear-statistics-chart'));
      }
      barscase.setOption(option, true);
    },
    setChartResize () {
      let lineDom = document.getElementById('halfyear-statistics-chart');
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