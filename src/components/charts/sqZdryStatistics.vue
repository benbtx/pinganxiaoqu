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
// import {policeApi} from '@/http'

let barscase, cssQueryCase;

export default {
  name: 'zdryStatistics',
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
      axisData: ['鸿苑小区','卓越朝阳','水榭香缇','阳光城','富临阳光新城','家福来嘉苑','御七家园','明园小区','御营山景'],
      seriesData: [
        {
            name:'涉毒人员',
            type:'bar',
            data:[510, 320, 200, 500, 340,510, 320, 200, 540]
        },
         {
            name:'在逃人员',
            type:'bar',
            data:[300, 200, 71, 400, 190,500, 200, 200, 540]
        },
        {
            name:'肇事肇祸精神病人',
            type:'bar',
            data:[50, 30, 25, 54, 90, 51, 32, 20, 34]
        },
        {
            name:'重点上访人员',
            type:'bar',
            data:[50, 32, 20, 54, 90, 51, 32, 200, 154]
        },{
            name:'涉恐人员',
            type:'bar',
            data:[50, 73, 20, 50, 19,150, 205, 120,42]
        },
        {
            name:'涉稳人员',
            type:'bar',
            data:[510, 400, 200, 540, 900,500, 300, 200, 540]
        },
         {
            name:'重大刑事犯罪前科人员',
            type:'bar',
            data:[40, 103, 201, 140, 119, 51, 120, 167, 50]
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
        o.barWidth = 6;
        if (o.name == '涉恐人员' || o.name == '涉稳人员' || o.name == '重大刑事犯罪前科人员') {
          o.stack = '3类';
        } else {
          o.stack = '4类'; 
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
              // formatter : function(params){
              //   var newParamsName = "";
              //   var paramsNameNumber = params.length;
              //   var provideNumber = 2;
              //   var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
              //   if (paramsNameNumber > provideNumber) {
              //       for (var p = 0; p < rowNumber; p++) {
              //           var tempStr = "";
              //           var start = p * provideNumber;
              //           var end = start + provideNumber;
              //           if (p == rowNumber - 1) {
              //               tempStr = params.substring(start, paramsNameNumber);
              //           } else {
              //               tempStr = params.substring(start, end) + "\n";
              //           }
              //           newParamsName += tempStr;
              //       }

              //   } else {
              //       newParamsName = params;
              //   }
              //   return newParamsName
              // },
              color:'#000',
              // lineHeight: 14,
              // rich: {},
              fontSize: 12,
              rotate: 28,
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
          bottom: 46
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