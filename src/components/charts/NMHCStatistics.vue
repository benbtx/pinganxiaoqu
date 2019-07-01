<template>
  <div class="chart-all">
      <!-- <div class="chart-title" :class="curObj.bgColor"> -->
      <div class="chart-title">
        <span>{{curObj.name}}</span>
      </div>
      <div class="chart-content">
        <div class="status">
          <p class="bold-num" :class="curObj.color">{{curObj.num}}<span class="unit">{{curObj.unit}}</span></p>
          <p class="bold-num small" :class="curObj.color">{{curObj.text}}</p>
        </div>
        <div class="line-h" :id="curId">
        </div>
      </div>
  </div>
</template>

<script>
import Ec from 'echarts';
import CssQueries from 'css-element-queries'
import {shipinApi} from '@/https'
import eventBus from "@/event";
import { eventCollection } from "@/event/resources";

export default {
  name: 'nmhcStatistics',
  props: ['code', 'deviceCode','tempdata'],
  data() {
    return {
      barscase: null,
      cssQueryCase: null,
      curObj: {
        name: this.getCurData().name,
        color: 'green',
        bgColor: 'bg-green',
        text: '暂无数据',
        num: '--',
        unit: ''
      },
      standard: 0,
      curId: this.getCurData().id,
    };
  },
  watch: {
    deviceCode(val) {
      // this.fetchChartData(this.code);
       for(var i = 0; i < this.tempdata.length; i++) {
        if(this.tempdata[i].name==this.code){
            this.ChartData(this.tempdata[i].data);
        }
      }
    }
  },
  mounted() {
    // let resultData = {
    //   axisData: ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00'],
    //   seriesData: [
    //     {
    //         name:'nmhc',
    //         data:[50, 20, 21, 45, 30,35,54,56,78,54,35,44]
    //     }
    //   ]
    // };
    // this.initChart(resultData.axisData, resultData.seriesData);
    // this.fetchChartData(this.code);
      for(var i = 0; i < this.tempdata.length; i++) {
        if(this.tempdata[i].name==this.code){
            this.ChartData(this.tempdata[i].data);
        }
      }
   
  },
  beforeDestroy() {
    this.barscase.dispose();
    this.barscase = null;
  },
  methods: {
    getCurData() {
      let curData = {
          name: '',
          id: ''
        };
      switch(this.code) {
        case 'a24088': 
          curData.name = '非甲烷总烃（单位：mg/m³）';
          curData.id = 'nmhc-statistics-chart';
          break;
        case 'a25002':
          curData.name = '苯（单位：mg/m³）';
          curData.id = 'ben-statistics-chart';
          break;
        case 'a25005':
          curData.name = '二甲苯（单位：mg/m³）';
          curData.id = 'erjiaben-statistics-chart';
          break;
        case 'a25003':
          curData.name = '甲苯（单位：mg/m³）';
          curData.id = 'jiaben-statistics-chart';
          break;
        default:
          break;
      }

      return curData;
    },
    fetchChartData(code) {
      if (this.deviceCode.length == 0) {
        return;
      }
      let param = {};
      param.code = code || this.code;
      param.hours = '12';
      param.deviceIds = this.deviceCode;
      let _this = this;

      return shipinApi.getByFactorDataHours(param)
      .then(result => result.data)
      .then(resultData => {
        if (resultData.rows && resultData.rows.length>0) {
          let axisData = [];
          let seriesData = [];
         for  (let i = 1; i < resultData.total; i++) {
              axisData.push(resultData.rows[i].recordTime);
              seriesData.push(resultData.rows[i].rtd);
          }
          
          _this.standard = resultData.standard;
          // _this.curObj.num = seriesData[seriesData.length-1].toFixed(3);
          // _this.curObj.num = parseFloat( seriesData[seriesData.length-1]).toFixed(3);
          _this.curObj.num = parseFloat(resultData.currentValue[resultData.rows[0].code+'value']).toFixed(3);


          
          let rate = _this.curObj.num/resultData.standard;
          if (rate>1 &&　rate<=1.33) {
            _this.curObj.text = '轻度超标';
            _this.curObj.color = 'yellow';
            _this.curObj.bgColor = 'bg-yellow';
          } else if (rate>1.33 &&　rate<=1.66) {
            _this.curObj.text = '中度超标';
            _this.curObj.color = 'orange';
            _this.curObj.bgColor = 'bg-orange';
          } else if (rate>1.66) {
            _this.curObj.text = '重度超标';
            _this.curObj.color = 'red';
            _this.curObj.bgColor = 'bg-red';
          } else {
            _this.curObj.text = '正常';
            _this.curObj.color = 'green';
            _this.curObj.bgColor = 'bg-green';
          }
          // if (rate > 1) {
          //   eventBus.$emit(eventCollection._pointer_status_now, true);
          // }
          
          _this.initChart(axisData, seriesData);
        }
      })
    },
    ChartData(resultData) {
      if (this.deviceCode.length == 0) {
        return;
      }
       if (resultData.rows && resultData.rows.length>0) {
          let axisData = [];
          let seriesData = [];
          for (let i = 1; i < resultData.total; i++) {
              axisData.push(resultData.rows[i].recordTime);
              seriesData.push(resultData.rows[i].rtd);
          }
          
          this.standard = resultData.standard;
          // this.curObj.num = seriesData[seriesData.length-1].toFixed(3);
          // this.curObj.num = parseFloat( seriesData[seriesData.length-1]).toFixed(3);
          this.curObj.num = parseFloat(resultData.currentValue[resultData.rows[0].code+'value']).toFixed(3);
          let rate = this.curObj.num/resultData.standard;
          if (rate>1 &&　rate<=1.33) {
            this.curObj.text = '轻度超标';
            this.curObj.color = 'yellow';
            this.curObj.bgColor = 'bg-yellow';
          } else if (rate>1.33 &&　rate<=1.66) {
            this.curObj.text = '中度超标';
            this.curObj.color = 'orange';
            this.curObj.bgColor = 'bg-orange';
          } else if (rate>1.66) {
            this.curObj.text = '重度超标';
            this.curObj.color = 'red';
            this.curObj.bgColor = 'bg-red';
          } else {
            this.curObj.text = '正常';
            this.curObj.color = 'green';
            this.curObj.bgColor = 'bg-green';
          }
          // if (rate > 1) {
          //   eventBus.$emit(eventCollection._pointer_status_now, true);
          // }
          this.initChart(axisData, seriesData);
        }
    },
    

    initChart(axisData, seriesData) {
      const color = '#ff4683';
      let _this = this;
      
      const option = {
        // title: {
        //   text: '12小时走势',
        //   textStyle: {
        //     color: '#333',
        //     fontSize: '13px',
        //   },
        //   top: 1,
        //   right: 0,
        // },
        tooltip: {
            trigger: 'axis',
        },
        color: color,
        xAxis : [
          {
            type : 'category',
            data : axisData,
            show: true,
            splitLine:{
             show:false,
           },
           axisLine: {show: true,onZero:true, },
           axisTick :{                 //坐标轴刻度相关设置
            show:false,  },
            
          boundaryGap: false,
          },
        ],
        yAxis : [
          {
            type: 'value',
             show: true,
            axisLabel: {
              show: false
            },
           axisLine: {show: true,onZero:true, },
           axisTick :{                 //坐标轴刻度相关设置
            show:false,  },
           splitLine:{
             show:false,
           },
           scale:true,
            // max: function(value) {
            //   let max

            //   if (value.max < _this.standard) {
            //     max = _this.standard + 10;
            //   } else {
            //     max = value.max + 10;
            //   }

            //   return max;
            // }
          }
        ],
        grid: {
          top: 10,
          left: 10,
          right: 30,
          bottom: 30
        },
        series : [
            {
                type:'line',
                smooth:true,
                symbol: 'circle',
                symbolSize: 1,
                itemStyle: { 
                  normal : {  
                      color: color,  
                      lineStyle:{  
                        color:color
                      }  
                  }  
                },
                areaStyle: {
                    color: new Ec.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgb(255, 158, 68)'
                    }, {
                        offset: 1,
                        color: 'rgb(255, 70, 131)'
                    }])
                },
                markLine: {
                  name:'浓度',
                  itemStyle: {
                      normal: {
                          lineStyle: {
                              type: 'dash',
                              color: '#ecce2f ',
                              width: 3,
                          },
                          label: {
                              formatter: '标准线',
                              textStyle: {
                                  fontSize: 10,
                                  color: '#333',
                              },
                              show: false,
                              position: 'end',
                          }
                      },
                  },
                  symbol: 'none',
                  // silent: true,
                  data: [{yAxis: _this.standard,type:'average',name:'标准值',
                  tooltip:{
                    trigger:'item',
                    formatter: function (data) {
                        return data.name + '：'+data.value ; //将小数转化为百分数显示
                        }
                  }}
                  
                  ]
                },
                data: seriesData
            }
        ],
      };

      if (!this.barscase) {
        this.barscase = Ec.init(document.getElementById(this.curId));
      }
      this.barscase.setOption(option, true);
      this.setChartResize();
    },
    setChartResize () {
      let lineDom = document.getElementById(this.curId);
      this.cssQueryCase = new CssQueries.ResizeSensor(lineDom, () => {
        this.barscase.resize();
      });
    },
    clearChart() {
      if (this.barscase) {
        this.barscase.clear();
        this.curObj = {
          name: this.getCurData().name,
          color: 'green',
          bgColor: 'bg-green',
          text: '暂无数据',
          num: '-',
          unit: ''
        };
      }
    }
  }
};
</script>


<style scoped>
.chart-all {
  width: 100%;
  height: 100%;
}
.chart-title {
  width: 100%;
  height: 28px;
  line-height: 28px;
  padding-left: 10px;
  font-size: 12px;
  font-weight: bold;
  font-family: "微软雅黑";
  color: #fff;
  background-color: #1fcd7f;
}
.bg-green {
  background: #1fcd7f;
}
.bg-yellow {
  background: #ffb400;
}
.bg-orange {
  background: #f1811c;
}
.bg-red {
  background: #f6494f;
}
.green {
  color: #1fcd7f;
}
.yellow {
  color: #ffb400;
}
.orange {
  color: #f1811c;
}
.red {
  color: #f6494f;
}
.bold-num {
  font-size: 16px;
  font-family: "微软雅黑";
  font-weight: bold;
  margin-left: -10px;
  text-align: center;
}
.small {
  font-size:12px;
  margin-left: -10px;
}
.chart-content {
  display: flex;
  margin: 0;
  width: 100%;
  height: calc(100% - 28px);
  border: 1px solid #d9dfe5;
  border-top: none;
  background: #f5f5f5;
}
.status {
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* width: 100px; */
  height: 100%;
  line-height: 32px;
  text-align: left;
  margin-left: 15px;
}
.unit {
  font-size: 12px;
}
.line-h {
  width: calc(100% - 60px);
  height: 100%;
  left:20px;
}
</style>