<template>
  <div class="chart-all">
      <div class="chart-title">
        <span>重点人员统计</span>
      </div>
      <div class="line-h" id="glry-statistics-chart">
      </div>
  </div>
</template>

<script>
import Ec from 'echarts';
import CssQueries from 'css-element-queries'
// import {policeApi} from '@/http'

let barscase, cssQueryCase;

export default {
  name: 'glryStatistics',
  data() {
    return {};
  },
  mounted() {
    // this.fetchChartData(this.currentCity);
    let resultData = {
      axisData: [
        { name: '刑释人员', max: 6500},
        { name: '精神病人', max: 6000},
        { name: '矫正人员', max: 3000},
        { name: '涉邪人员', max: 3800},
        { name: '涉稳人员', max: 5200},
        { name: '涉毒人员', max: 2500}
      ],
      seriesData: [
        {
            value : [1300, 4300, 1800, 2500, 4000, 900],
            name : '人员统计'
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
            show: false
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
                return value + '：' + seriesData[0].value[i];
              }
          },
          indicator: axisData,
          nameGap: 3
          // radius: 60
        }],
        series: [
          {
            type: 'radar',
             tooltip: {
                trigger: 'item'
            },
            itemStyle: {normal: {areaStyle: {type: 'default'}}},
            data:  seriesData
          }
        ]
      };

      if (!barscase) {
        barscase = Ec.init(document.getElementById('glry-statistics-chart'));
      }
      barscase.setOption(option, true);
    },
    setChartResize () {
      let lineDom = document.getElementById('glry-statistics-chart');
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