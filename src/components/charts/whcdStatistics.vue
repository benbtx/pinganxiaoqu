<template>
  <div class="chart-all">
      <div class="chart-title">
        <span>人员文化程度统计</span>
      </div>
      <div class="line-h" id="whcd-statistics-chart">
      </div>
  </div>
</template>

<script>
import Ec from 'echarts';
import CssQueries from 'css-element-queries'
// import {policeApi} from '@/http'

let barscase, cssQueryCase;

export default {
  name: 'whcdStatistics',
  data() {
    return {};
  },
  props: ['currentCity'],
  watch: {
    currentCity (val) {
      this.fetchChartData(val);
    }
  },
  mounted() {
    // this.fetchChartData(this.currentCity);
    let resultData = {
      axisData: ['未知','小学','初中','中专','高中','专科','本科','硕士','博士','博士后'],
      seriesData: [
        {
            type:'bar',
            data:[1500, 2330, 5400, 5540, 7800, 13500, 23000, 7000, 1504, 900]
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
      const colors = ['#12B1E1'];
      seriesData.forEach((o, index) => {
        o.type = 'bar'
        o.itemStyle = { 
          normal : {  
              lineStyle:{  
                color:colors[index]
              }  
          }  
        };
        o.barWidth = 10;
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
          itemWidth: 12,
          itemHeight: 8,
          itemGap: 12
        },
        xAxis : [
          {
            type : 'category',
            data : axisData,
            axisLabel: {
              color:'#333',
              interval: 0
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
          top: 20,
          left: 35,
          right: 0,
          bottom: 25
        },
        series : seriesData
      };

      if (!barscase) {
        barscase = Ec.init(document.getElementById('whcd-statistics-chart'));
      }
      barscase.setOption(option, true);
    },
    setChartResize () {
      let lineDom = document.getElementById('whcd-statistics-chart');
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