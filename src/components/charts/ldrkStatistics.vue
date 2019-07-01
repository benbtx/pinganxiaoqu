<template>
  <div class="chart-all">
      <div class="chart-title">
        <span>流动人口分布情况</span>
      </div>
      <div class="line-h" id="ldrk-statistics-chart">
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
  name: 'ldrkStatistics',
  data() {
    return {
      resultData: {
      axisData: [],
      seriesData: [
        {
            type:'bar',
            data:[]
        }
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
    //   axisData: ['城厢社区','城北社区','工业社区','南山社区','朝阳社区','高新社区','园艺社区','丰谷社区','关帝社区','塘汛社区','青义社区'],
    //   seriesData: [
    //     {
    //         type:'bar',
    //         data:[5000, 3220, 2010, 4540, 2390, 5000, 2650, 3100, 5400, 4500,2342]
    //     }
    //   ]
    // };
    // this.initChart(resultData.axisData, resultData.seriesData);
    // this.setChartResize();
    this.getPoliceFloatCount();
  },
  beforeDestroy() {
    barscase.dispose();
    barscase = null;
  },
  methods: {
    getPoliceFloatCount(){
       return excontrolApi
        .getPoliceFloatCount()
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.resultData.axisData =[];
          this.resultData.seriesData[0].data = [];
          for(var i=0;i<data.length;i++)
          {
            this.resultData.axisData.push(data[i].villageName);
            this.resultData.seriesData[0].data.push(data[i].count);
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
              formatter : function(params){
                var newParamsName = "";
                var paramsNameNumber = params.length;
                var provideNumber = 2;
                var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
                if (paramsNameNumber > provideNumber) {
                    for (var p = 0; p < rowNumber; p++) {
                        var tempStr = "";
                        var start = p * provideNumber;
                        var end = start + provideNumber;
                        if (p == rowNumber - 1) {
                            tempStr = params.substring(start, paramsNameNumber);
                        } else {
                            tempStr = params.substring(start, end) + "\n";
                        }
                        newParamsName += tempStr;
                    }

                } else {
                    newParamsName = params;
                }
                return newParamsName
              },
              interval: 0,
              lineHeight: 14,
              rich: {}
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
                  var text = (value/10000).toFixed(1);
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
          left: 40,
          right: 0,
          bottom: 36
        },
        series : seriesData
      };

      if (!barscase) {
        barscase = Ec.init(document.getElementById('ldrk-statistics-chart'));
      }
      barscase.setOption(option, true);
    },
    setChartResize () {
      let lineDom = document.getElementById('ldrk-statistics-chart');
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