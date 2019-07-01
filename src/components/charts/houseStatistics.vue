<template>
  <div class="chart-all">
      <div class="chart-title">
        <span>实有房屋统计</span>
      </div>
      <div class="line-h" id="house-statistics-chart">
      </div>
  </div>
</template>

<script>
import Ec from 'echarts';
import CssQueries from 'css-element-queries'
import {excontrolApi} from '@/https'

let barscase, cssQueryCase;

export default {
  name: 'houseStatistics',
  data() {
    return {};
  },
  props: ['currentCode'],
  watch: {
    currentCode (val) {
      this.fetchChartData(val);
    }
  },
  mounted() {
    this.fetchChartData(this.currentCode);
    // let resultData = {
    //   axisData: ['自用','一般租借用','闲置','其他租借用','其他'],
    //   seriesData: [
    //     {
    //         type:'bar',
    //         data:[188580, 237290, 201000, 154000, 190000]
    //     }
    //   ]
    // };
    // this.initChart(resultData.axisData, resultData.seriesData);
    this.setChartResize();
  },
  beforeDestroy() {
    barscase.dispose();
    barscase = null;
  },
  methods: {
    fetchChartData(alias) {
      // let param = {regionCode: alias};
      let param = {};
      if(alias.length==12&&alias.slice(9)!='000'){
          param = {villageId: alias};
      }else{
          param = {regionCode: alias};
      }

      return excontrolApi.yibiaosishiGetFWData(param)
        .then(result => result.data)
        .then(resultData => {
          let axisData = [];
          let seriesData = [{data:[]}];
          for (let i=0; i<resultData.length; i++) {
            axisData.push(resultData[i].houseType);
            seriesData[0].data.push(resultData[i].count);
          }
          this.initChart(axisData, seriesData);
        });
    },
    initChart(axisData, seriesData) {
      const colors = ['#9999FF'];
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
                      if(value<10000){
                        texts.push(value);
                      }
                      else if (value >=10000) {
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
        xAxis: [
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
        yAxis: [
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
          top: 20,
          left: 80,
          right: 40,
          bottom: 20
        },
        series: seriesData
      };

      if (!barscase) {
        barscase = Ec.init(document.getElementById('house-statistics-chart'));
      }
      barscase.setOption(option, true);
    },
    setChartResize() {
      let lineDom = document.getElementById('house-statistics-chart');
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
  height: 32px;
  line-height: 32px;
  text-align: center;
  background: #F2F2F2;
  border-bottom: 1px solid #d9dfe5;
  color: #333;
}
.line-h {
  flex: 1;
  margin: 0 10px;
  width: calc(100% - 20px);
  height: calc(100% - 32px);
}
</style>