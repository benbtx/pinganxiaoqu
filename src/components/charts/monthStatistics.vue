<template>
  <div class="chart-all">
      <div class="chart-title">
        <span>本月预警、报修、投诉已处理和未处理量</span>
      </div>
      <div class="chart-content">
        <div class="line-h" id="month-yujing-statistics-chart"></div>
        <div class="line-h" id="month-baoxiu-statistics-chart"></div>
        <div class="line-h" id="month-tousu-statistics-chart"></div>
      </div>
  </div>
</template>

<script>
import Ec from 'echarts';
import CssQueries from 'css-element-queries'
// import {policeApi} from '@/http'

let barscaseYujing, barscaseBaoxiu, barscaseTousu;

export default {
  name: 'monthStatistics',
  data() {
    return {
      seriesData1: [
          {value:335, name:'已处置'},
          {value:310, name:'未处置'}
      ],
      seriesData2: [
          {value:125, name:'已处置'},
          {value:10, name:'未处置'}
      ],
      seriesData3: [
          {value:235, name:'已处置'},
          {value:110, name:'未处置'}
      ],
    }
  },
  mounted() {
    this.initChartYujing();
    this.initChartBaoxiu();
    this.initChartTousu();
    this.setChartResize();
  },
  beforeDestroy() {
    barscaseYujing.dispose();
    barscaseBaoxiu.dispose();
    barscaseTousu.dispose();
    barscaseYujing = null;
    barscaseBaoxiu = null;
    barscaseTousu = null;
  },
  methods: {
    initChartYujing() {
      let option = {
          tooltip: {
              trigger: 'item',
              position: ['50%','50%'],
              formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          title: {
            text: '预警\n',
            subtext: '{a|'+this.seriesData1[1].value+'}/{b|'+this.seriesData1[0].value+'}',
            top: '35%',
            left: 'center',
            textStyle: {
              fontSize: '14',
              fontWeight:'normal',
              color: '#333',
            },
            itemGap: -10,
            subtextStyle: {
              rich: {
                  a: {
                      color: 'red',
                  }
              }
            }
          },
          series: [
              {
                  name:'预警',
                  type:'pie',
                  center: ['50%', '50%'],
                  radius: ['60%', '78%'],
                  itemStyle:{
                    borderWidth:1, //设置border的宽度有多大
                    borderColor:'#fff',
                  },
                  color:['#9999FF','#FF6666'],
                  label:{
                      show:false,
                  },
                  data: this.seriesData1
              }
          ]
      };
      if (!barscaseYujing) {
        barscaseYujing = Ec.init(document.getElementById('month-yujing-statistics-chart'));
      }
      barscaseYujing.setOption(option, true);
    },
    initChartBaoxiu() {
      let option = {
          tooltip: {
              trigger: 'item',
              position: ['50%','50%'],
              formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          title: {
            text: '报修\n',
            subtext: '{a|'+this.seriesData2[1].value+'}/{b|'+this.seriesData2[0].value+'}',
            top: '35%',
            left: 'center',
            textStyle: {
              fontSize: '14',
              fontWeight:'normal',
              color: '#333',
            },
            itemGap: -10,
            subtextStyle: {
              rich: {
                  a: {
                      color: 'red',
                  }
              }
            }
          },
          series: [
              {
                  name:'报修',
                  type:'pie',
                  center: ['50%', '50%'],
                  radius: ['60%', '78%'],
                  itemStyle:{
                    borderWidth:1, //设置border的宽度有多大
                    borderColor:'#fff',
                  },
                  color:['#12B1E1','#FF6666'],
                  label:{
                      show:false,
                  },
                  data: this.seriesData2
              }
          ]
      };
      if (!barscaseBaoxiu) {
        barscaseBaoxiu = Ec.init(document.getElementById('month-baoxiu-statistics-chart'));
      }
      barscaseBaoxiu.setOption(option, true);
    },
    initChartTousu() {
      let option = {
          tooltip: {
              trigger: 'item',
              position: ['50%','50%'],
              formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          title: {
            text: '投诉\n',
            subtext: '{a|'+this.seriesData3[1].value+'}/{b|'+this.seriesData3[0].value+'}',
            top: '35%',
            left: 'center',
            textStyle: {
              fontSize: '14',
              fontWeight:'normal',
              color: '#333',
            },
            itemGap: -10,
            subtextStyle: {
              rich: {
                  a: {
                      color: 'red',
                  }
              }
            }
          },
          series: [
              {
                  name:'投诉',
                  type:'pie',
                  center: ['50%', '50%'],
                  radius: ['60%', '78%'],
                  itemStyle:{
                    borderWidth:1, //设置border的宽度有多大
                    borderColor:'#fff',
                  },
                  color:['#00CC99','#FF6666'],
                  label:{
                      show:false,
                  },
                  data: this.seriesData3 
              }
          ]
      };
      if (!barscaseTousu) {
        barscaseTousu = Ec.init(document.getElementById('month-tousu-statistics-chart'));
      }
      barscaseTousu.setOption(option, true);
    },
    setChartResize() {
      let lineDomTousu = document.getElementById('month-tousu-statistics-chart');
      let lineDomBaoxiu = document.getElementById('month-baoxiu-statistics-chart');
      let lineDomYujing = document.getElementById('month-yujing-statistics-chart');
      let cssQueryCase1 = new CssQueries.ResizeSensor(lineDomTousu, () => {
        barscaseTousu.resize();
      });
      let cssQueryCase2 = new CssQueries.ResizeSensor(lineDomBaoxiu, () => {
        barscaseBaoxiu.resize();
      });
      let cssQueryCase3 = new CssQueries.ResizeSensor(lineDomYujing, () => {
        barscaseYujing.resize();
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
.chart-content {
  width: 100%;
  height: calc(100% - 28px);
  display: flex;
  flex-direction: row;
}
.line-h {
  margin: 0;
  flex: 1;
  height: 100%;
}
</style>