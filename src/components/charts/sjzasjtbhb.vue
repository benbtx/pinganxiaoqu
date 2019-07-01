<template>
  <div class="chart-all">
      <div class="chart-title">
        <span>排污超标事件同比环比</span>
      </div>
      <div class="line-h" id="sjzasjtbhb-chart">
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
  name: 'sjzasjtbhb',
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
    //   this.getEventszasjCompare();
    // }
  },
  mounted() {
    // let resultData = {
    //   axisData: ['2018-06','2018-07','2018-08','2018-09','2018-10','2018-11'],
    //   seriesData: [
    //     {
    //         name:'今年',
    //         type:'bar',
    //         data:[6150, 2200, 2100, 1400, 1930,3452]
    //     },
    //     {
    //         name:'去年',
    //         type:'bar',
    //         data:[5100, 1300, 1800, 1400, 900,1555]
    //     }
       
    //   ]
    // };
    // this.initChart(resultData.axisData, resultData.seriesData);
    // this.setChartResize();

    this.getEventszasjCompare();
  },
  beforeDestroy() {
    barscase.dispose();
    barscase = null;
  },
  methods: {
    getEventszasjCompare(){
      let param = {};
        // if(this.timeControl ==2)
        // {
        //   param.month =12;
        // }
        // else if(this.timeControl ==1) {
        //   param.month = 6;
        // }
        param.month = 12;
        return excontrolApi
        .getEventszasjCompare(param)
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
      const colors = ['#12b1e1', '#ff6666','#6cdb03'];
      seriesData.forEach((o, index) => {
        o.type = 'line'
        o.symbol = 'circle'
        o.symbolSize = 5
        o.yAxisIndex = 1
        o.smooth = true  //这句就是让曲线变平滑的 
        o.itemStyle = { 
          normal : {  
              color: colors[index],  
              lineStyle:{  
                color:colors[index]
              }  
          }  
        };
        
      });
      seriesData[0].type = "bar";
      seriesData[0].yAxisIndex =0;
      seriesData[0].barWidth = 15;
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
          itemGap: 20,
          top: 5,
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
            name : '单位:件',
            axisLine: {show: false},
            splitNumber: 4,
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#333',
              width: '100%',
              formatter: '{value}'
            },
            splitLine: {
              lineStyle: {
                color: '#f2f2f2'
              }
            }
          },
          {
            type : 'value',
            name : '单位:百分比',
            axisLine: {show: false},
            splitNumber: 4,
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#333',
              width: '100%',
              formatter: '{value}'
            },
            splitLine: {
              lineStyle: {
                color: '#f2f2f2'
              }
            }
          }
        ],
        grid: {
          top: 50,
          left: 40,
          right: 40,
          bottom: 34
        },
        series : seriesData
      };

      if (!barscase) {
        barscase = Ec.init(document.getElementById('sjzasjtbhb-chart'));
      }
      barscase.setOption(option, true);
    },
    setChartResize () {
      let lineDom = document.getElementById('sjzasjtbhb-chart');
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