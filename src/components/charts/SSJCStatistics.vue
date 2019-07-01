<template>
  <div class="chart-all">
      <!-- <div class="chart-title" >
        <span></span>
      </div> -->
      <div class="chart-content">
       
        <div class="line-h" :id="curId">
        </div>
      </div>
  </div>
</template>

<script>
import Ec from 'echarts';
import CssQueries from 'css-element-queries'
import {shipinApi,excontrolApi,tmpApi } from '@/https'
import eventBus from "@/event";
import { eventCollection } from "@/event/resources";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { getToken } from "@/utils/auth";

export default {
  name: 'SSJCStatistics',
  props: ['code', 'deviceCode',"initData"],
  data() {
    return {
      barscase: null,
      cssQueryCase: null,
      EC_option:null,
    //   curObj: {
    //     name: this.getCurData2().name,
    //     color: 'green',
    //     bgColor: 'bg-green',
    //     text: '暂无数据',
    //     num: '-',
    //     unit: 'mg/m³'
    //   },
    //   standard: 0,
      curId:"ssjcTree",
      cgqCodeList: [],
      cgqStatusList: [],
      bmapImg: {
        jksxt: "../../../static/image/bmap/jksxt.png",
        dqhjwry: "../../../static/image/bmap/ssjc/dqhjwry.png",
        trzljc: "../../../static/image/bmap/ssjc/trzljc.png",
        dbsthjwry: "../../../static/image/bmap/ssjc/dbsthjwry.png",
        jksxt_map: "../../../static/image/bmap/ssjc/jksxt_map.png",
        dqhjwry_map: "../../../static/image/bmap/ssjc/dqhjwry_map.png",
        trzljc_map: "../../../static/image/bmap/ssjc/trzljc_map.png",
        dbsthjwry_map: "../../../static/image/bmap/ssjc/dbsthjwry_map.png",
        jksxt_mapgl: "../../../static/image/bmap/ssjc/jksxt_mapgl.png",
        dqhjwry_mapgl: "../../../static/image/bmap/ssjc/dqhjwry_mapgl.png",
        trzljc_mapgl: "../../../static/image/bmap/ssjc/trzljc_mapgl.png",
        dbsthjwry_mapgl: "../../../static/image/bmap/ssjc/dbsthjwry_mapgl.png",
        spjk: "../../../static/image/bmap/spjk.png",
        hlspjk: "../../../static/image/bmap/hlspjk.png",

        wljksxj: "../../../static/image/bmap/ssjc/wljksxj.png",
        wljksxj_bj: "../../../static/image/bmap/ssjc/wljksxj_bj.png",
        wljksxj_lx: "../../../static/image/bmap/ssjc/wljksxj_lx.png",

        dlsb: "../../../static/image/bmap/ssjc/dlsb.png",
        dlsb_bj: "../../../static/image/bmap/ssjc/dlsb_bj.png",
        dlsb_lx: "../../../static/image/bmap/ssjc/dlsb_lx.png",


         hfxyjwjc: "../../../static/image/bmap/ssjc/hfxyjwjc.png",
        hfxyjwjc_bj: "../../../static/image/bmap/ssjc/hfxyjwjc_bj.png",
        hfxyjwjc_lx: "../../../static/image/bmap/ssjc/hfxyjwjc_lx.png",

      },

      cbcount:0,
      sczcount:0,
      wscount:0,

      camera_data: [],
      currentSensor_data: [],
      transducer_data: [],
      all_data: [],
      cbdata:null,

    };
  },
  watch: {
    // deviceCode(val) {
    //   // this.fetchChartData(this.code);
    //    this.initChart();
    // },
     initData(val) {
      // this.fetchChartData(this.code);
      if (this.barscase) {
        this.barscase.clear();
        this.barscase.dispose();
        this.barscase = null;
      }
      this.initChart();
    }
  },
  created() {
    var _this=this;
    this.cgqCodeList = JSON.parse(localStorage.getItem('cgqlist')).SYSTEM_CODE || [];
    this.cgqStatusList = JSON.parse(localStorage.getItem('cgqlist')).DATA_FLAG || [];
    eventBus
      .$off(eventCollection._qyMQ)
      .$on(eventCollection._qyMQ, (data) => {
        // console.log(data);
        if(!this.barscase){return}
        if(data.data.msgType=="current_signal"){
            //更新电流
            data.data.data;
            data.data.data.indexCode;
            data.data.data.signalInfo;
            // console.log(this.barscase) ;
            // console.log(this.EC_option) ;
            var sj= this.EC_option.series[0].data[0].children;
            for (var i = 0; i <sj.length; i++) {
                if(sj[i].name=="电流感知设备"){
                    if(sj[i].restdata.indexCode== data.data.data.indexCode){
                        // restdata
                        //gx
                      
                        // if(data.data.data.signalInfo==0){
                        //     sj[i].label.rich.first.backgroundColor.image=this.bmapImg.dlsb
                        // }else if(data.data.data.signalInfo==1){
                        //     sj[i].label.rich.first.backgroundColor.image=this.bmapImg.dlsb_bj
                        // }else{
                        //     sj[i].label.rich.first.backgroundColor.image=this.bmapImg.dlsb_bj
                        // }
                         var dtt=data.data.data;
                            
                          // dt[j].label.rich.first.backgroundColor.image=(dtt.isOnline!="在线"?this.bmapImg.dlsb:(dtt.signalInfo==1?this.bmapImg.dlsb:this.bmapImg.dlsb));
                          sj[i].label.rich.first.backgroundColor.image=(dtt.isOnline!="在线"?this.bmapImg.dlsb:(dtt.signalInfo==1?this.bmapImg.dlsb:this.bmapImg.dlsb));

                         
                          sj[i].restdata.signalInfo=data.data.data.signalInfo;
                          sj[i].restdata.isOnline=data.data.data.isOnline;
                    }
                }
            }
            //获取option
            // console.log('更新后option') ;
            // console.log(this.bmapImg.dlsb_bj) ;
            // console.log(this.bmapImg.dlsb_lx) ;
            // console.log(this.EC_option);
            this.barscase.setOption(this.EC_option,true);

            

        } else if(data.data.msgType=="ai_video_signal"){
             //更新摄像机
            //  alert("sxt,gx");
            // console.log(data.data.msgType);
            var sj= this.EC_option.series[0].data[0].children;
            for (var i = 0; i <sj.length; i++) {
                if(sj[i].name=="视频分析服务器"){
                    var dt=sj[i].children;
                    for (var j = 0; j <dt.length; j++) {

                         if(dt[j].restdata.indexCode== data.data.data.indexCode){
                            // restdata
                            //gx
                           
                            // if(data.data.data.signalInfo==0){
                            //   dt[j].label.rich.first.backgroundColor.image=this.bmapImg.wljksxj
                            // }else if(data.data.data.signalInfo==1){
                            //   dt[j].label.rich.first.backgroundColor.image=this.bmapImg.wljksxj_bj
                            // }else{
                            //   dt[j].label.rich.first.backgroundColor.image=this.bmapImg.wljksxj_bj
                            // }
                                
                                var dtt=data.data.data;

                            //  dt[j].label.rich.first.backgroundColor.image=(dtt.isOnline!="在线"?this.bmapImg.wljksxj_lx:(dtt.signalInfo==1?this.bmapImg.wljksxj_bj:this.bmapImg.wljksxj));
                            dt[j].label.rich.first.backgroundColor.image=(dtt.isOnline!="在线"?this.bmapImg.wljksxj_lx:(dtt.signalInfo==1?this.bmapImg.wljksxj:this.bmapImg.wljksxj));
                              
                            dt[j].restdata.signalInfo=data.data.data.signalInfo;
                            dt[j].restdata.isOnline=data.data.data.isOnline;

                            // (dtt.isOnline!="在线"?this.bmapImg.wljksxj_lx:(dtt.signalInfo==1?this.bmapImg.wljksxj:this.bmapImg.wljksxj));
                           
                        }
                    }  
                }
            }
            //  console.log(this.EC_option);
              this.barscase.setOption(this.EC_option,true);
        }  else if(data.data.msgType=="pollution_alarm_data"){
             //其他传感器
            //  alert("sxt,gx");
         
        }  
        
       
       //更新this.all_data
        // var cbcount=0;
        // var sczcount=0;
        // var wscount=0;
        //遍历当前数据,问题是tree不好遍历；记录初始化的状态，每次更改状态时，相应count+1,
        //触发查询当前点位信息
        for (var i = 0; i <_this.all_data.length; i++) {
            if(_this.all_data[i].id== data.data.data.indexCode){
              //   console.log(7878);
              //  console.log(data.data.data.isOnline);
              //   console.log(data.data.data.signalInfo);
                  _this.all_data[i].isOnline= data.data.data.isOnline;
                  _this.all_data[i].signalInfo= data.data.data.signalInfo;
            }
        }
        //判断当前点位状态 0(未生产),1(生产中),---2(超标)
        var state=0;
        for (var i = 0; i <_this.all_data.length; i++) {
          if(!_this.all_data[i].hasOwnProperty('qt')){
            if(_this.all_data[i].signalInfo==1){
                state=1;
            }
          }
           
        } 
        for (var i = 0; i <_this.all_data.length; i++) {
          if(_this.all_data[i].hasOwnProperty('qt')){
            if(_this.all_data[i].signalInfo==1){
                // state=2;
            }
          }
           
        } 
        eventBus.$emit(eventCollection._pointRefresh, state);

    });

    //传感器告警
    eventBus
      .$off(eventCollection._positionWarningRefresh)
      .$on(eventCollection._positionWarningRefresh, (data) => {

        //等待this.EC_option,生成
        _this.cbdata=data;
        

        // this.getPositionDeviceIds(data.data);
        // console.log(data);
        //根据是否超标，单独触发点位
        data.id;
        data.value;
        var sj= _this.EC_option.series[0].data[0].children;
        for (var i = 0; i <sj.length; i++) {
            if(sj[i].name!="电流感知设备"&&sj[i].name!="视频分析服务器"){
                if(sj[i].restdata.indexCode== data.id){
                    // restdata
                    //gx
                }
                var img=sj[i].label.rich.first.backgroundColor.image;
                // console.log('img:',img)
                var lx=img.split('.png')[0]+"_lx.png";
                var bj=img.split('.png')[0]+"_bj.png";
                var zc=img.split('.png')[0]+".png";
                if(data.value==false){
                    sj[i].label.rich.first.backgroundColor.image=zc;
                      sj[i].restdata.signalInfo=0;
                }else{
                    sj[i].label.rich.first.backgroundColor.image=zc||bj;
                        sj[i].restdata.signalInfo=1;
                        //     dt[j].restdata.isOnline=data.data.data.isOnline;
                }
                // sj[i].restdata.status
            }
        }

        _this.barscase.setOption(this.EC_option,true);

          //触发查询当前点位信息
        // for (var i = 0; i <this.all_data.length; i++) {
        //     if(this.all_data[i].id== data.data.data.indexCode){
        //           this.all_data[i].isOnline==1;
        //           this.all_data[i].signalInfo== data.data.data.signalInfo;
        //     }
        // }
        //判断当前点位状态 0(未生产),1(生产中),2(超标)
        var state=0;
        if(data.value==true){
            // state=2;
           
            for (var i = 0; i <_this.all_data.length; i++) {
              if(_this.all_data[i].hasOwnProperty('qt')){
                 _this.all_data[i].signalInfo=1;
              }
              
            } 
            //触发超标
            //  console.log('触发超标');
            // console.log(state);

            //  eventBus.$emit(eventCollection._pointRefresh, state);
        }else{
           for (var i = 0; i <_this.all_data.length; i++) {
              if(!_this.all_data[i].hasOwnProperty('qt')){
                if(_this.all_data[i].signalInfo==1){
                    state=1;
                }
              }
            
            } 
            for (var i = 0; i <_this.all_data.length; i++) {
              if(_this.all_data[i].hasOwnProperty('qt')){
                if(_this.all_data[i].signalInfo==1){
                    // state=2;
                }
              }
              
            } 

          // eventBus.$emit(eventCollection._pointRefresh, state);

        }

       
      
        
    });



  },
  mounted() {

    this.initChart();
    // this.getnewJcData();




    
  },
  beforeDestroy() {
    this.barscase.dispose();
    this.barscase = null;
  },
  methods: {
    
    
    initChart() {
      this.EC_option=null;
      const color = '#ff4683';
      let _this = this;
      this.all_data=[];
      this.initData;
      if( this.initData==null){return;}
      //组织Tree 的data
      var camera_Len=this.initData.camera.length;
      var currentSensor_Len=this.initData.currentSensor.length;
      var transducer_Len=this.initData.transducer.length;

      this.camera_data=this.initData.camera;
      this.currentSensor_data=this.initData.currentSensor;
      this.transducer_data=this.initData.transducer;


      if(camera_Len==0&& currentSensor_Len==0&& transducer_Len==0){
        this.$message({
          message: '该点位下无数据！',
          type: 'error',  
          duration: 5 * 1000
        })
        return;
      }
      //创建基础数据
      var basicData = [{
          name: "综合监测工作站",
          label: {
              normal: {
                  formatter: [
                        '  {first|}',  
                      '{title|{b}}{abg|}',
                      
                          
                  ].join('\n'),
                  backgroundColor: '#eee',
                  borderColor: '#777',
                  borderWidth: 0,
                //   borderRadius: 4,
                  rich: {
                      title: {
                          color: '#000',
                          align: 'center'
                      },
                      abg: {
                        //   backgroundColor: '#13b1e1',
                          width: '100%',
                          align: 'right',
                          height: 30,
                        //   borderRadius: [4, 4, 0, 0]
                      },
                      hr: {
                          borderColor: '#777',
                          width: '100%',
                          borderWidth: 0.5,
                          height: 0
                      },
                      first: {
                          height: 70,
                          align: 'center',
                            position: ['40%', '50%'],
                          backgroundColor: {
                              image: "../../../static/image/bmap/ssjc/zzjkgzz.png",
                          }
                      },
                      
                  }
              }
          },
          children: []
      }];
      var spjkfwqData = {
          name: "视频分析服务器",
          label: {
            formatter: [
                        //   '{title|{b}}{abg|}',
                        //   '{hr|}',
                        //   '{first|}',
                         '{first|}',
                       
                        '{title| 视频分析服务器 }{abg|}',
                      

                      ].join('\n'),
            backgroundColor: '#eee',
            borderColor: '#777',
            borderWidth: 0,
            symbolSize: 1,
            // borderRadius: 4,
            rich: {
                title: {
                    color:'#000',
                    align: 'center'
                },
                abg: {
                   
                    width: '100%',
                    align: 'right',
                    // height: 25,
                     height: 18,
                    // borderRadius: [4, 4, 0, 0]
                },
                hr: {
                    borderColor: '#777',
                    width: '100%',
                    borderWidth: 0.5,
                    height: 0
                },

                first: {
                    // height: 30,
                    // align: 'center',
                    height: 55,
                  
                    align: 'center',
                    backgroundColor: {
                        image: "../../../static/image/bmap/ssjc/spfxfwq.png",
                        
                    }
                },
            }
              
          },
          children: [],
          collapsed:false,
      };
      if(camera_Len!=0){
        //创建摄像机基础数据
        // var cameraData=spjkfwqData;
        // cameraData.name="视频分析服务器";
        // cameraData.label.rich.first.backgroundColor.image='../../../static/image/bmap/ssjc/spfxfwq.png';
        basicData[0].children.push(spjkfwqData);
        //循环获取下级
        // var spjk=gqwlbfqData;
        // spjk.name="高清网络播发器";
        // spjk.label.rich.first.backgroundColor.image='../../../static/image/bmap/jhsb.png';
        for (let i = 0; i <camera_Len; i++) {
            // basicData[0].children[cameraData].children.push(spjk);
            var curdata=this.initData.camera[i];
            var gqwlbfqData = {
                name: "网络监控摄像机",
                label: {
                  // formatter:[
                  //               '{first|}',
                  //                 // '{hr|}',
                  //               //  '{title| 网络监控 }{abg|}',
                  //               //  '{title|摄像机}{abg|}',
                  //                '{title| 目标设备运行中 }{abg|}',

                              
                  //           ].join('\n'),

                  formatter:function(params){
                        // console.log(1111);
                        // console.log(params);
                        var texts=params.name.substr(0,4);
                        // var texts2=params.name.substr(4,params.name.length-1);
                        var dtt=params.data.restdata;
                        var texts2=(dtt.isOnline!="在线"?"":(dtt.signalInfo==1?"监测到正在生产":"监测到未生产"));

                        // var texts2= (params.data.restdata.signalInfo=="1"?"目标设备运行中":"目标设备未运行")
                        var label;
                        if(dtt.signalInfo==1){
                            label=  '{first|}\n  {titlered|'+texts2+'}{abg|}';
                        }else{
                            label=  '{first|}\n  {title|'+texts2+'}{abg|}';
                        }
                        
                            
                       return label;
                  },
                  backgroundColor: '#eee',
                  borderColor: '#777',
                  borderWidth: 0,
                //   borderRadius: 4,
                  rich: {
                      title: {
                        //   color: '#eee',
                        color:'#000',
                        align: 'center'
                      },
                      titlered: {
                        //   color: '#eee',
                        color:'red',
                        align: 'center'
                      },
                      abg: {
                        //   backgroundColor: 'green',
                          width: '100%',
                          align: 'right',
                          height: 18,
                        //   borderRadius: [4, 4, 0, 0]
                      },
                      hr: {
                          borderColor: '#777',
                          width: '100%',
                          borderWidth: 0.5,
                          height: 0
                      },

                      first: {
                          // height: 39,
                          //  width: '98%',
                           height: 80,
                          width: 56,
                          align: 'center',
                          backgroundColor: {
                            //   height:37,
                              // image: curdata.isOnline=="在线"?"../../../static/image/bmap/ssjc/wljksxj.png":"../../../static/image/bmap/ssjc/wljksxj_lx.png",
                              // image: curdata.isOnline!="在线"?"../../../static/image/bmap/ssjc/wljksxj_lx.png":(curdata.signalInfo==1?"../../../static/image/bmap/ssjc/wljksxj_bj.png":"../../../static/image/bmap/ssjc/wljksxj.png"),
                             // image: curdata.isOnline!="在线"?this.bmapImg.wljksxj_lx:(curdata.signalInfo==1?this.bmapImg.wljksxj_bj:this.bmapImg.wljksxj),
                              image: curdata.isOnline!="在线"?this.bmapImg.wljksxj_lx:(curdata.signalInfo==1?this.bmapImg.wljksxj:this.bmapImg.wljksxj),
                               
                          }
                      },
                  }
                    
                },
                children: [],
                restdata:curdata,

            };
            basicData[0].children[0].children.push(gqwlbfqData);

            this.all_data.push({id:curdata.indexCode,isOnline:curdata.isOnline,signalInfo:curdata.signalInfo});
        }
      }
      if(currentSensor_Len!=0){
        // basicData[0].children.push(dlgzsbData);
        //循环获取下级
        for (let i = 0; i <currentSensor_Len; i++) {
            // basicData[0].children[currentSensorData].children.push(spjk);
            var curdata=this.initData.currentSensor[i];
            var dlgzsbData = {
                name: "电流感知设备",
                label: {
                    // formatter: [
                    //             // '{title|{b}}{abg|}',
                    //              '{first|}',
                    //             //  '{hr|}',
                    //             '{title| 电流感知 }{abg|}',
                    //             '{title|设备}{abg|}',
                    //              '  ',
                    //               '{label|治理目标运行中}',
                               
                    //         ].join('\n'),

                    formatter:function(params){
                          var dtt=params.data.restdata;
                          // var texts=(dtt.isOnline!="在线"?"":(dtt.signalInfo==1?"目标设备运行中":"目标设备未运行"));
                           var texts=(dtt.signalInfo==1?"治理设备工作中":"治理设备未工作");
                          var label=  '{first|}\n  {title|'+texts+'}{abg|}';

                        if(dtt.signalInfo==1){
                            label=  '{first|}\n  {titlered|'+texts+'}{abg|}';
                        }else{
                        
                           label=  '{first|}\n  {title|'+texts+'}{abg|}';
                        }
                        

                        return label;
                    },
                    backgroundColor: '#eee',
                    borderColor: '#777',
                    borderWidth: 0,
                  
                    rich: {
                        title: {
                            color: '#000',
                            align: 'center',
                              // borderColor: 'black',
                              // borderWidth: '1',
                              //   width: 60,height:20,
                        },
                        titlered: {
                            color: 'red',
                            align: 'center',
                        },
                        abg: {
                         
                            width: '100%',
                            align: 'right',
                            height: 18,
                            // borderRadius: [4, 4, 0, 0]
                        },
                        hr: {
                            borderColor: '#777',
                            width: '100%',
                            borderWidth: 0.5,
                            height: 0
                        },

                        first: {
                          height: 80,
                          width: 56,
                          align: 'center',
                            backgroundColor: {
                                // image: "../../../static/image/bmap/ssjc/dlsb_bj.png",
                                //  image: (curdata.signalInfo==1?this.bmapImg.dlsb:this.bmapImg.dlsb),
                              image: curdata.isOnline!="在线"?this.bmapImg.dlsb:(curdata.signalInfo==1?this.bmapImg.dlsb:this.bmapImg.dlsb),

                              
                            },
                           
                        },
                       
                    }
                    
                },
                children: [],
                restdata:curdata,
            };
            basicData[0].children.push(dlgzsbData);

            this.all_data.push({id:curdata.indexCode,isOnline:curdata.isOnline,signalInfo:curdata.signalInfo});
        } 
      }
      //创建19类数据（每个数据又可能有多个 ，大坑）
      if(transducer_Len!=0){
          //循环获取下级
          for (let i = 0; i <transducer_Len; i++) {
              // basicData[0].children[currentSensorData].children.push(spjk);
              // console.log(this.initData.transducer[i]);
              var code=this.initData.transducer[i].transducerType;
              var lx=this.cgqCodeList .filter( i => i.code==code)[0].abbreviation;
              var alias=this.cgqCodeList .filter( i => i.code==code)[0].alias;
              var imgUrl=this.bmapImg[lx];
              var imgUrl_lx=this.bmapImg[lx+"_lx"];
              var imgUrl_bj=this.bmapImg[lx+"_bj"];
              var curdata=this.initData.transducer[i];
            //   var zt=this.cgqStatusList.filter( i => i.flagTag==data.status)[0].description;
              var cgqData = {
                  name: alias,
                  label: {
                    // formatter: [
                    //               '{title|{b}}{abg|}',
                    //               '{hr|}',
                    //               '{first|}',
                    //           ].join('\n'),
                    // formatter:function(params){
                    //     console.log(1111);
                    //     console.log(params);
                    //     var texts=params.name.substr(0,4);
                    //     var texts2=params.name.substr(4,params.name.length-1);
                    //     var label=  '{title| '+texts+' }{abg|}\n{title|'+texts2+'}{abg|}';
                    //           var label2= [
                    //               '{first|}',
                    //                '{hr|}',
                    //                label,
                    //           ].join('\n');

                    //    return label2;
                    // },
                    formatter:function(params){
                          var dtt=params.data.restdata;
                          // var texts=(dtt.isOnline!="在线"?"":(dtt.signalInfo==1?"目标设备运行中":"目标设备未运行"));
                           var texts=(dtt.signalInfo==1?"污染物超标":"未检测到污染物超标");
                          var label=  '{first|}\n  {title|'+texts+'}{abg|}';

                            if(dtt.signalInfo==1){
                              label=  '{first|}\n  {titlered|'+texts+'}{abg|}';
                            }else{
                               label=  '{first|}\n  {title|'+texts+'}{abg|}';
                            }
                        return label;
                    },
                    backgroundColor: '#eee',
                    borderColor: '#777',
                    borderWidth:0,
                    // borderRadius: 4,
                    rich: {
                        title: {
                            color: '#000',
                            align: 'center'
                        },
                         titlered: {
                            color: 'red',
                            align: 'center',
                        },
                        abg: {
                            // backgroundColor: 'green',
                            width: '100%',
                            align: 'right',
                            height: 18,
                            // borderRadius: [4, 4, 0, 0]
                        },
                        hr: {
                            borderColor: '#777',
                            width: '100%',
                            borderWidth: 0.5,
                            height: 0
                        },

                        first: {
                          // height: 39,
                          // width: '99%',
                          // align: 'left',
                           height: 80,
                          width: 56,
                          align: 'center',
                            backgroundColor: {
                                height:38,
                                image: imgUrl,
                            }
                        },
                    }
                      
                  },
                  children: [],
                  restdata:curdata,
              }; 
              basicData[0].children.push(cgqData);
              this.all_data.push({id:curdata.indexCode,qt:curdata.isOnline,signalInfo:curdata.signalInfo});
          }
      }
      const option = {
          backgroundColor: '#eee',
          tooltip: {
              trigger: 'item',
            //   formatter: '{b}',
                formatter: function (params) {
                    // console.log(params);
                    if(params.name=='网络监控摄像机'){
                    //    return params.data.restdata.name;  //'名称:'+  params.data.restdata.isOnline
                       return '名称：'+params.data.restdata.name+"</br>状态："+params.data.restdata.isOnline+"</br>目标状态："+(params.data.restdata.signalInfo=="1"?"目标设备运行中":"目标设备未运行")+"</br>经度："+params.data.restdata.longitude+"</br>纬度："+params.data.restdata.latitude;  //
                    }else if(params.name=='电流感知设备'){
                       return '名称：'+params.data.restdata.indexCode+"</br>状态："+"在线"+"</br>目标状态："+(params.data.restdata.signalInfo=="1"?"目标设备运行中":"目标设备未运行")+"</br>经度："+params.data.restdata.longitude+"</br>纬度："+params.data.restdata.latitude;  //
                    }else if(params.name=='综合监测工作站'){}
                    else if(params.name=='视频分析服务器'){}
                    else{
                       return '名称：'+params.data.restdata.transducerName+"</br>状态："+this.cgqStatusList.filter( i => i.flagTag==params.data.restdata.status)[0].description+"</br>经度："+params.data.restdata.longitude+"</br>纬度："+params.data.restdata.latitude;  //
                    }
                    return params.name;
                }.bind(this),
          },
          series: [{
                  type: 'tree',
                  name: '综合监测工作站',
                  data: basicData,
                  top: '1%',
                  right: '30%',
                  symbolSize: 30,
                  initialTreeDepth: 10,
                //   label: {
                //       normal: {
                //           position: 'center',
                //           verticalAlign: 'middle',
                //           align: 'left',
                //           backgroundColor: '#7049f0',
                //           color: '#fff',
                //           padding: 3,
                //           formatter: [
                //               '{box|{b}}'
                //           ].join('\n'),
                //           rich: {
                //               box: {
                //                   height: 30,
                //                   color: '#fff',
                //                   padding: [0, 5],
                //                   align: 'center'
                //               }
                //           }
                //       }
                //   },
                //   label: {
                //     normal: {
                //         formatter: [
                //             '{title2|{b}}{abg|}',
                                  
                //                     '{hr|}',
                //                     '  {first3|}',     
                //         ].join('\n'),
                //         backgroundColor: '#eee',
                //         borderColor: '#777',
                //         borderWidth: 1,
                //         borderRadius: 4,
                //         rich: {
                //             title2: {
                //                 color: '#eee',
                //                 align: 'center'
                //             },
                //             abg: {
                //                 backgroundColor: '#333',
                //                 width: '100%',
                //                 align: 'right',
                //                 height: 25,
                //                 borderRadius: [4, 4, 0, 0]
                //             },      
                //             hr: {
                //                 borderColor: '#777',
                //                 width: '100%',
                //                 borderWidth: 0.5,
                //                 height: 0
                //             },
                //             first3: {
                //                 height: 30,
                //                 align: 'center',
                //                 position: ['40%', '50%'],
                //                 backgroundColor: {
                //                     image: "../../../static/image/yibiaosishi/ic_qtfw.png"
                //                 }
                //             },      
                //         }
                //     }
                //   },
                  expandAndCollapse: true,
                  animationDuration: 550,
                  animationDurationUpdate: 750
              },
          ],
          animationDelayUpdate :0,
      }
      if (!this.barscase) {
        this.barscase = Ec.init(document.getElementById(this.curId));
      }
      this.EC_option=option;
      this.barscase.setOption(option, true);
       //   this.barscase.on('click','series.tree',function(params){
       //  this.barscase.off('click').on('click',function(params){
      this.barscase.on('click',function(params){
        if(params.name=="视频分析服务器"||params.name=="综合监测工作站"){
            // params.event.event.preventDefault();
            _this.EC_option.expandAndCollapse=true;
             _this.barscase.setOption(_this.EC_option, true);
            //  _this.EC_option.series[0].data[0].collapsed=false;
            //  _this.barscase.setOption(_this.EC_option, true);

           return;
        }
        var restdata=params.data.restdata;
        var seriesType = params.seriesType;
        console.log(name+"\n"+seriesType);
        // alert(params.name);	//你的具体逻辑流程
        if(params.name=="网络监控摄像机"){
            // alert(params.name);	//你的具体逻辑流程

            // // var id = document.getElementById("sssp").getAttribute("indexCode");
            // // var isOnline = document.getElementById("sssp").getAttribute("isOnline");
            // console.log(id);
            // console.log(that.$parent);
            var p={id:restdata.indexCode,isOnline:restdata.isOnline}
            // _this.playerVideo(p);
            eventBus.$emit(eventCollection.playVideoWeb, p);
        }
      })
      this.setChartResize();
      //初始时更新点位状态
      //判断当前点位状态 0(未生产),1(生产中),2(超标)
        var state=0;
        for (var i = 0; i <this.all_data.length; i++) {
          if(!this.all_data[i].hasOwnProperty('qt')){
            if(this.all_data[i].signalInfo==1){
                state=1;
            }
          }  
        } 
        for (var i = 0; i <this.all_data.length; i++) {
          if(this.all_data[i].hasOwnProperty('qt')){
            if(this.all_data[i].signalInfo==1){
                state=2;
            }
          }
        } 
        console.log('初始更新状态')
        console.log(state)
        eventBus.$emit(eventCollection._pointRefresh, state);
      //cbdata
      if(this.cbdata){
          var sj= this.EC_option.series[0].data[0].children;
          for (var i = 0; i <sj.length; i++) {
              if(sj[i].name!="电流感知设备"&&sj[i].name!="视频分析服务器"){
                  if(sj[i].restdata.indexCode== this.cbdata.id){
                      // restdata
                      //gx
                  }
                  var img=sj[i].label.rich.first.backgroundColor.image;
                  // console.log('img:',img)
                  var lx=img.split('.png')[0]+"_lx.png";
                  var bj=img.split('.png')[0]+"_bj.png";
                  var zc=img.split('.png')[0]+".png";
                  if(data.value==false){
                    sj[i].label.rich.first.backgroundColor.image=zc;
                      sj[i].restdata.signalInfo=0;
                  }else{
                      sj[i].label.rich.first.backgroundColor.image=zc||bj;
                          sj[i].restdata.signalInfo=1;
                          //     dt[j].restdata.isOnline=data.data.data.isOnline;
                  }
                  // sj[i].restdata.status
              }
          }

          this.barscase.setOption(this.EC_option,true);

      }

       



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
        this.barscase.dispose();
        this.barscase = null;

        // this.barscase=null;
        // this.curObj = {
        //   name: this.getCurData2().name,
        //   color: 'green',
        //   bgColor: 'bg-green',
        //   text: '暂无数据',
        //   num: '-',
        //   unit: 'mg/m³'
        // };
      }
    },
    //建立获取推送的的长连接
    getnewJcData() {
        // console.log(222222222222222222222222222);
      let token = getToken();
      let httpaddres = tmpApi.sockpoliceAddress;
      let sock = new SockJS(httpaddres);
      this.stomp = Stomp.over(sock);
      this.stomp.connect(
        "root",
        "root",
        frame => {
          this.stomp.subscribe("/exchange/emis_device_fanout/", this.refreshGj); 
        }
      );
    },
    //收到后端推送的消息显示
    refreshGj(data) {
      // console.log(233333333333333333333333333);
      // console.log(data)
      if (!!data.body) {
        let newgj = JSON.parse(data.body);
        // this.tollgatedata = newgj.data;
        
        // //触发地图数据更新
        // eventBus.$emit(eventCollection._getWarningRefresh);
      }
    },

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
}
.bg-green {
  /* background: #1fcd7f; */
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
  font-size: 18px;
  font-family: "微软雅黑";
  font-weight: bold;
}
.small {
  font-size:12px;
}
.chart-content {
  /* display: flex; */
  margin: 0;
  width: 100%;
  /* height: calc(100% - 28px); */
  height:100%;
  border: 1px solid #d9dfe5;
  /* border-top: none; */
  background: #f5f5f5;
}
.status {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 60px;
  height: 100%;
  line-height: 32px;
  text-align: left;
  margin-left: 15px;
}
.unit {
  font-size: 12px;
}
.line-h {
  /* width: calc(100% - 60px); */
  width: 100%;
  height: 100%;
}
</style>