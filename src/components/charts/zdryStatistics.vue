<template>
  <div class="chart-all">
      <div class="chart-title">
        <span>重点人员分布情况</span>
      </div>
      <div class="line-h" id="zdry-statistics-chart">
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
  name: 'zdryStatistics',
  data() {
    return {
      resultData : {
      axisData: [],
      seriesData: [
         
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
    //         name:'涉恐人员',
    //         type:'bar',
    //         data:[50, 23, 21, 40, 73,100, 66, 101, 54, 32,72]
    //     },
    //     {
    //         name:'涉稳人员',
    //         type:'bar',
    //         data:[510, 320, 200, 540, 900,510, 320, 200, 540, 900,242]
    //     },
    //      {
    //         name:'重大刑事犯罪前科人员',
    //         type:'bar',
    //         data:[450, 204, 210, 350, 190,510, 320, 200, 540, 290,244]
    //     },
    //     {
    //         name:'涉毒人员',
    //         type:'bar',
    //         data:[510, 320, 200, 250, 900,500, 300, 200, 540, 550,832]
    //     },
    //      {
    //         name:'在逃人员',
    //         type:'bar',
    //         data:[35, 32, 12, 50, 19, 51, 32, 20, 30, 22,33]
    //     },
    //     {
    //         name:'肇事肇祸精神病人',
    //         type:'bar',
    //         data:[50, 30, 20, 50, 90,51, 30, 20, 50, 34,44]
    //     },
    //     {
    //         name:'重点上访人员',
    //         type:'bar',
    //         data:[510, 320, 200, 500, 430,510, 320, 200, 430, 240,332]
    //     }
    //   ]
    // };
    // this.initChart(resultData.axisData, resultData.seriesData);
    // this.setChartResize();
      this.getPoliceSpecialCount();
  },
  beforeDestroy() {
    barscase.dispose();
    barscase = null;
  },
  methods: {
    getPoliceSpecialCount() {
        return excontrolApi
        .getPoliceSpecialCount()
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.resultData.axisData = data ? data.axisData : [];
          this.resultData.seriesData = data ? data.seriesData : [];
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
    fetchChartData(alias) {
      // policeApi.getPoliceAllTrend({xzqh: alias})
      // .then(result => result.data)
      // .then(resultData => {
      //   this.initChart(resultData.axisData, resultData.seriesData);
      // })
    },
    initChart(axisData, seriesData) {
      const colors = ['#FF6666', '#FF9933', '#FFCC00','#52EB07','#00F2F2', '#12B1E1','#9999FF'];
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
          itemWidth: 8,
          itemHeight: 8,
          itemGap: 5,
        },
        xAxis: [
          {
            type: 'category',
            data: axisData,
            axisLabel: {
              interval: 0,
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
              color:'#333',
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
            splitNumber: 3,
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
          top: 50,
          left: 60,
          right: 20,
          bottom: 36
        },
        series : seriesData
      };

      if (!barscase) {
        barscase = Ec.init(document.getElementById('zdry-statistics-chart'));
      }
      barscase.setOption(option, true);
    },
    setChartResize () {
      let lineDom = document.getElementById('zdry-statistics-chart');
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