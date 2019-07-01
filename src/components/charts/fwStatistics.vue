<template>
  <div class="chart-all">
      <div class="chart-title">
        <span>辖区内房屋统计情况</span>
      </div>
      <div class="line-h" id="fw-statistics-chart">
      </div>
  </div>
</template>

<script>
import Ec from 'echarts';
import CssQueries from 'css-element-queries'
// import {policeApi} from '@/http'

let barscase, cssQueryCase;

export default {
  name: 'fwStatistics',
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
      axisData: ['自住','空闲','普通出租','群租'],
      seriesData: [
        {
            type:'bar',
            data:[37880, 1290, 13200, 11533]
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
        o.barWidth = 12;
        o.label = {
                normal: {
                    show: true,
                    position: 'right',
                    color: '#333',
                    formatter: function (data) {
                      var value = data.data;
                      var texts = [];
                      if(value<100000){
                        texts.push(value);
                      } else if (value >=10000) {
                        var text = Math.round(value/10000);
                        texts.push(text + '万');
                      }
                      return texts;
                    }
                }
            };
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
        xAxis : [
          {
            type : 'value',
            show: false,
            axisLabel: {
              color:'#333'
            },
            axisTick: {
              show: false
            },
            axisLine: {show: false},
            splitLine: {
              show: false
            },
          }
        ],
        yAxis : [
          {
            type : 'category',
            data : axisData,
            inverse: true,
            axisLine: {show: false},
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#333',
              width: '100%'
            }
          }
        ],
        grid: {
          top: 10,
          left: 60,
          right: 40,
          bottom: 10
        },
        series : seriesData
      };

      if (!barscase) {
        barscase = Ec.init(document.getElementById('fw-statistics-chart'));
      }
      barscase.setOption(option, true);
    },
    setChartResize () {
      let lineDom = document.getElementById('fw-statistics-chart');
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