<template>
  <div class="chart-all">
      <div class="chart-title">
        <span>特殊关爱人员统计</span>
      </div>
      <div class="line-h" id="tsga-statistics-chart">
      </div>
  </div>
</template>

<script>
import Ec from 'echarts';
import CssQueries from 'css-element-queries'
// import {policeApi} from '@/http'
import { excontrolApi } from "@/https";

let barscase, cssQueryCase;

export default {
  name: 'tsgaStatistics',
  data() {
    return {
      resultData :{
        axisData: [
        { name: '军烈家属'},
        { name: '重大疾病患者'},        
        { name: '艾滋病'},
        { name: '低保人员'},
        { name: '孤寡老人'},        
        { name: '残障人士'}
      ], 
      seriesData: [
        {
            value : [],
            name : '人员统计'
        }
        ]
      },
      maxNum: 10
    };
  },
  mounted() {
    // this.fetchChartData(this.currentCity);
    this.getPoliceCareCount();
    // this.initChart(this.resultData.axisData, this.resultData.seriesData);
    // this.setChartResize();
  },
  beforeDestroy() {
    barscase.dispose();
    barscase = null;
  },
  methods: {
    getMax() {
      let max = this.resultData.seriesData[0].value.sort(function(a,b){return b-a})[0];
      this.maxNum = Math.ceil(max/10)*10 || 10;

      for (var i=0;i<this.resultData.axisData.length;i++) {
        this.resultData.axisData[i].max = this.maxNum;
      }
      this.initChart(this.resultData.axisData, this.resultData.seriesData);
      this.setChartResize();
    },
    getPoliceCareCount(){
      return excontrolApi
        .getPoliceCareCount()
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.resultData.seriesData[0].value=[];
          this.resultData.seriesData[0].value.push(data.martyrFamily,data.disease,data.hiv,data.basicLiving,data.oldman,data.disabled);
          this.getMax();       
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
            trigger: 'none',
            // show: false
        },
        radar: [{
          // shape: 'circle',
          name: {
              textStyle: {
                color: '#333',
                borderRadius: 3,
                padding: [0, 3],
              },
              formatter: function (value, indicator) {
                i++;
                return '{first|' +value + '}：{second|' + seriesData[0].value[i]+ '}';
                // return '{' +value + '}';
              },
              rich: {
                first: {
                  color: 'gray'
                },
                second: {
                  color: '#12b1e1'
                }
              }
          },
          indicator: axisData,
          nameGap: 3,
          // radius: 60
        }],
        series: [
          {
            type: 'radar',
            tooltip: {
                trigger: 'item',
                formatter:function (params) {
                  var returnStr = params.name+'<br />'; 

                  for(var i=0;i<params.value.length;i++){
                    returnStr+=axisData[i].name+': '+params.value[i]+'<br />'; 
                  }	           
                  return returnStr;
                }
            },
            itemStyle: {
              normal: {
                areaStyle: {
                  type: 'default'
                }
              }
            },
            data:  seriesData
          }
        ]
      };

      if (!barscase) {
        barscase = Ec.init(document.getElementById('tsga-statistics-chart'));
      }
      barscase.setOption(option, true);
    },
    setChartResize () {
      let lineDom = document.getElementById('tsga-statistics-chart');
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