<template>
  <div class="chart-all">
      <div class="chart-title" :class="curObj.bgColor">
        <span>二甲苯</span>
      </div>
      <div class="chart-content">
        <div class="status">
          <p class="bold-num" :class="curObj.color">{{curObj.num}}<span class="unit">{{curObj.unit}}</span></p>
          <p class="bold-num small" :class="curObj.color">{{curObj.text}}</p>
        </div>
        <div class="line-h" id="erjiaben-statistics-chart">
        </div>
      </div>
  </div>
</template>

<script>
import Ec from 'echarts';
import CssQueries from 'css-element-queries'
// import {policeApi} from '@/http'

let barscase, cssQueryCase;

export default {
  name: 'erjiabenStatistics',
  data() {
    return {
      curObj: {
        color: 'orange',
        bgColor: 'bg-orange',
        text: '中度超标',
        num: '8.695',
        unit: 'mg/m³'
      },
      biaozhun: '100',
    };
  },
  mounted() {
    let resultData = {
      axisData: ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00'],
      seriesData: [
        {
            name:'erjiaben',
            data:[50, 200, 210, 100, 130,352,54,56,78,54,345,344]
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
        o.markLine = {
          itemStyle: {
              normal: {
                  lineStyle: {
                      type: 'dash',
                      color: '#666 ',
                      width: 1,
                  },
                  label: {
                      formatter: '标准线',
                      textStyle: {
                          fontSize: 12,
                          color: '#333',
                      },
                      show: true,
                      position: 'end',
                  }
              },
          },
          symbol: 'none',
          silent: true,
          data: [{yAxis: this.biaozhun}]
        };
      });
      const option = {
        title: {
          text: '12小时走势',
          textStyle: {
            color: '#333',
            fontSize: '13px',
          },
          top: 10,
          right: 3,
        },
        tooltip: {
            trigger: 'axis',
        },
        color: colors,
        xAxis : [
          {
            type : 'category',
            data : axisData,
            show: false,
          }
        ],
        yAxis : [
          {
            type : 'value',
            show: false,
          }
        ],
        grid: {
          top: 40,
          left: 10,
          right: 50,
          bottom: 20
        },
        series : seriesData,
      };

      if (!barscase) {
        barscase = Ec.init(document.getElementById('erjiaben-statistics-chart'));
      }
      barscase.setOption(option, true);
    },
    setChartResize () {
      let lineDom = document.getElementById('erjiaben-statistics-chart');
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
}
.chart-title {
  width: 100%;
  height: 28px;
  line-height: 28px;
  padding-left: 10px;
  font-size: 12px;
  font-weight: bold;
  font-family: "微软雅黑";
  color: #fff;
}
.bg-green {
  background: #1fcd7f;
}
.bg-yellow {
  background: #ffb400;
}
.bg-orange {
  background: #f1811c;
}
.bg-red {
  background: #f6494f;
}
.green {
  color: #1fcd7f;
}
.yellow {
  color: #ffb400;
}
.orange {
  color: #f1811c;
}
.red {
  color: #f6494f;
}
.bold-num {
  font-size: 18px;
  font-family: "微软雅黑";
  font-weight: bold;
}
.small {
  font-size:12px;
}
.chart-content {
  display: flex;
  margin: 0;
  width: 100%;
  height: calc(100% - 28px);
  border: 1px solid #d9dfe5;
  border-top: none;
}
.status {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100px;
  height: 100%;
  line-height: 32px;
  text-align: left;
  margin-left: 15px;
}
.unit {
  font-size: 12px;
}
.line-h {
  width: calc(100% - 100px);
  height: 100%;
}
</style>