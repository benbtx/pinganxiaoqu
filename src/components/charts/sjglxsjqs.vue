<template>
  <div class="chart-all">
      <div class="chart-title">
        <span> 排污超标事件趋势</span>
      </div>
      <div class="line-h" id="sjglxsjqs-chart">
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
  name: 'sjglxsjqs',
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
    // timeControl(val){
    //   this.getEventsjTrend();
    // }
  },
  mounted() {
    this.getEventsjTrend();
  },
  beforeDestroy() {
    barscase.dispose();
    barscase = null;
  },
  methods: {
    getEventsjTrend(){
      let resultData = {
        axisData: ['2018-01','2018-02','2018-03','2018-04','2018-05','2018-06','2018-07','2018-08','2018-09','2018-10','2018-11','2018-12'],
        seriesData: [
          {
              name:'趋势',
              type:'line',
              data:[200, 220, 227, 100, 300,340,230, 220, 268, 210, 230,230]
          },   
        ]
      };
      this.initChart(resultData.axisData, resultData.seriesData);
      this.setChartResize();
      return;
      
      let param = {};
      // if(this.timeControl==1)
      // {
      //   param.month=6;
      // }
      // else if(this.timeControl ==2)
      // {
      //   param.month = 12;
      // }
      param.month = 12;
        return excontrolApi
        .getEventsjTrend(param)
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.resultData.axisData =data.axisData;
          this.resultData.seriesData = data.seriesData;
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
      // const colors = ['#FF6666', '#FF9933', '#FFCC00','#52EB07','#00F2F2', '#12B1E1','#9999FF'];
      const colors = ['#FF6666','#12B1E1'];
      seriesData.forEach((o, index) => {
        // o.type = 'line'
        if (o.type == 'bar') {
          o.barWidth = 12;
        }
        o.symbol = 'circle'
        o.symbolSize = 5
        o.smooth = true  //这句就是让曲线变平滑的 
        o.itemStyle = { 
          normal : {  
              color: colors[index],  
              lineStyle:{  
                color:colors[index]
              }  
          }  
        };
        o.areaStyle = {
                color: new Ec.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgb(255, 158, 68)'
                }, {
                    offset: 1,
                    color: 'rgb(255, 70, 131)'
                }])
            };
      });
      const option = {
        tooltip: {
            trigger: 'axis',
            formatter: '{b}: {c}',
            axisPointer: {
                // type: 'cross',
                // crossStyle: {
                //   color: '#999'
                // }
            }
        },
        color: colors,
        legend: {
          show: false,
          data: seriesData,
          itemWidth: 14,
          itemHeight: 6,
          itemGap: 3,
        },
        xAxis : [
          {
            type : 'category',
            data : axisData,
            axisLabel: {
              color:'#333',
              rotate: 0,
              interval: 1,
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
        barscase = Ec.init(document.getElementById('sjglxsjqs-chart'));
      }
      barscase.setOption(option, true);
    },
    setChartResize () {
      let lineDom = document.getElementById('sjglxsjqs-chart');
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