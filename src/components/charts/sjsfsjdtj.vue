<template>
  <div class="chart-all">
      <div class="chart-title">
        <span>企业排污时间段统计</span>
      </div>
      <div class="line-h" id="sfsjdtj-chart">
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
  name: 'sfsjdtj',
  data() {
    return {
      resultData :{
        axisData: [
        { name: '5：00~8：00'},
        { name: '次日2：00~次日5：00'},
        { name: '23：00~次日3：00'},
        { name: '20：00~23：00'},
        { name: '17：00~20：00'},
        { name: '14：00~17：00'},
        { name: '11：00~14：00'},
        { name: '8：00~11：00'},
      ], 
      seriesData: [
        {
            value : [],
            name : '企业排污时间段统计'
        }
        ]
      },
      maxNum: 10
    };
  },
  props: ['currentCity','timeControl'],
  watch: {
    currentCity (val) {
      this.fetchChartData(val);
    },
    timeControl(val){
      this.getEventsfsjdCount();
    }
  },
  mounted() {
    // this.fetchChartData(this.currentCity);
    // let resultData = {
    //   axisData: [
    //     { name: '5：00~8：00', max: 6500},
    //     { name: '次日2：00~次日5：00', max: 6000},
    //     { name: '23：00~次日3：00', max: 3000},
    //     { name: '20：00~23：00', max: 3800},
    //     { name: '17：00~20：00', max: 5200},
    //     { name: '14：00~17：00', max: 2500},
    //     { name: '11：00~14：00', max: 2500},
    //     { name: '8：00~11：00', max: 2500},
       
    //   ],
    //   seriesData: [
    //     {
    //         value : [1850, 1170, 1580, 1320, 450, 1430, 1640, 1240],
    //         name : '企业排污时间段统计'
    //     }
    //   ]
    // };
    // this.initChart(resultData.axisData, resultData.seriesData);
    // this.setChartResize();
    this.getEventsfsjdCount();
  },
  beforeDestroy() {
    barscase.dispose();
    barscase = null;
  },
  
  methods: {
    getMax() {
      let max = this.resultData.seriesData[0].value.sort(function(a,b){return b-a})[0];
      this.maxNum = Math.ceil(max/10)*10 || 10;
    },
    getEventsfsjdCount(){
      let param = {};
       param.timeQuantum = this.timeControl;
        return excontrolApi
        .getEventsfsjdCount(param)
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.resultData.seriesData[0].value=[];
          this.resultData.seriesData[0].value.push(data[0].a,data[0].b,data[0].c,data[0].d,data[0].e,data[0].f,data[0].g,data[0].h);
          this.getMax();
          for (var i=0;i<this.resultData.axisData.length;i++) {
            this.resultData.axisData[i].max = this.maxNum;
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
      seriesData.forEach((o, index) => {
        o.type = 'radar'
        // o.label = {
        //         normal: {
        //             show: true,
        //             position: 'right',
        //             color: '#333',
        //             formatter: function (data) {
        //               var value = data.data;
        //               var texts = [];
        //               if(value<10000){
        //                 texts.push(value);
        //               }
        //               else if (value >=10000) {
        //                 var text = Math.round(value/10000);
        //                 texts.push(text + '万');
        //               }
        //               return texts;
        //             }
        //         }
        //     };
        o.itemStyle = {normal: {areaStyle: {type: 'default'}}}
        o.tooltip =  {
          trigger: 'item'
        }
      });

      var i = -1;
      const option = {
        tooltip: {
            // trigger: 'none',
            // show: false
        },
        radar: [{
          // shape: 'circle',
          name: {
              textStyle: {
                color: '#333',
                borderRadius: 3,
                padding: [1, 3],
              },
              formatter: function (value, indicator) {
                i++;
                  return '{first|' +value + '}\n{second|' + seriesData[0].value[i]+ '}';
              },
              rich: {
                first: {
                  color: 'gray'
                },
                second: {
                  color: '#12b1e1',
                  align: 'center'
                }
              }
          },
          center: ['50%', '50%'],
          indicator: axisData,
          nameGap: 3,
          radius: 60
        }],
        series: [
          {
            type: 'radar',
            tooltip: {
                trigger: 'item',
                formatter:function (params) {
                  var returnStr = params.name+'<br />'; 
                  console.log(axisData)
                  for(var i=0;i<params.value.length;i++){
                    returnStr += '（'+ axisData[i].name+'）：'+params.value[i]+'<br />'; 
                  }	           
                  return returnStr;
                }
            },
            itemStyle: {normal: {areaStyle: {type: 'default'}}},
            data:  seriesData
          }
        ]
      };

      if (!barscase) {
        barscase = Ec.init(document.getElementById('sfsjdtj-chart'));
      }
      barscase.setOption(option, true);
    },
    setChartResize () {
      let lineDom = document.getElementById('sfsjdtj-chart');
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