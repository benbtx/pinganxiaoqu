<template>
  <div class="content-body">
    <div class="page-bread">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>重点人员</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-row">
      <div class="bl-content">
        <div class="content-left">
          <baidu-map :zhongdianrenyuan="2" :center="{lng: 104.404, lat: 30.915}"></baidu-map>
        </div>
        <div class="content-right">
          <div class="fltj">
            <div class="title">分类统计</div>
            <!-- <div>
              <div class="global-item globalitemselected" style="width:22%;display:inline-block;background: red;" @click="getZdry('涉恐人员')">
                <p class="rk-text">{{allData.rk+" 人"}}</p>
                <p class="item-num">涉恐人员</p>
              </div>
              <div class="global-item" style="width:21%;display:inline-block;background: #f5796c;" @click="getZdry('涉稳人员')">
                <p class="rk-text">{{allData.rk+" 人"}}</p>
                <p class="item-num">涉稳人员</p>
              </div>
              <div
                class="global-item"
                style="width:21%;display:inline-block;background: rgb(255, 180, 102);" @click="getZdry('涉毒人员')">
                <p class="rk-text">{{allData.rk+" 人"}}</p>
                <p class="item-num">涉毒人员</p>
              </div>
              <div
                class="global-item"
                style="width:21%;display:inline-block;background: rgb(255, 215, 102);" @click="getZdry('在逃人员')" >
                <p class="rk-text">{{allData.rk+" 人"}}</p>
                <p class="item-num">在逃人员</p>
              </div>
              <div class="global-item" style="width:22%;display:inline-block;background: #a768d6;" @click="getZdry('重点上访人员')">
                <p class="rk-text">{{allData.rk+" 人"}}</p>
                <p class="item-num">重点上访人员</p>
              </div>
              <div class="global-item" style="width:35%;display:inline-block;background: #37a523;" @click="getZdry('重大刑事犯罪前科人员')">
                <p class="rk-text">{{allData.rk+" 人"}}</p>
                <p class="item-num">重大刑事犯罪前科人员</p>
              </div>
              <div class="global-item" style="width:32%;display:inline-block;background: #53da7c;" @click="getZdry('肇事肇祸精神病人')">
                <p class="rk-text">{{allData.rk+" 人"}}</p>
                <p class="item-num">肇事肇祸精神病人</p>
              </div>
            </div> -->
            
            <div>
                <div class="global-item" v-bind:class="{globalitemselected:(index==0),itemwidth4:(item.name.length>4),itemwidth8:(item.name.length>=8&&item.name.length<10),itemwidth10:(item.name.length>=10)}"  v-bind:style="{ background:item.color }"   v-for="(item,index) in rytjData" :key="item.id"  @click="getZdry(item.name,item.color)">
                    <p class="rk-text">{{item.count+" 人"}}</p>
                    <p class="item-num">{{item.name}}</p>
                </div>
            </div>
            



            <div class="cx">
              <el-input placeholder="请输入身份证号码"  v-model="input_sfz" class="input-with-select">
              
                  <el-button slot="append" @click="getRy()">查询</el-button>
                <!-- <el-button slot="append" class="btnCx" type="primary" @click="getRy()">查询</el-button> -->
              </el-input>
            </div>
            <div class="cxjg">
              <!-- <div class="cxjg_item" @click="getPosition(2,2)">
                <div class="cxjg_item_left">
                  <img class="cxjg_item_left_img">
                  <img>
                </div>
                <div class="cxjg_item_right">
                  <div class="spanitem">姓名:{{""||"王红兵"}}</div>
                  <div class="spanitem">身份证:{{""||"51XXXXXXXX"}}</div>
                  <div class="spanitem">住址:{{""||"南山社区红源小区"}}</div>
                  <div class="spanitem">风险等级:{{""||"高"}}</div>
                </div>
              </div>
              <div class="cxjg_item">
                <div class="cxjg_item_left">
                  <img class="cxjg_item_left_img">
                  <img>
                </div>
                <div class="cxjg_item_right">
                  <div class="spanitem">姓名:{{""||"王红兵"}}</div>
                  <div class="spanitem">身份证:{{""||"51XXXXXXXX"}}</div>
                  <div class="spanitem">住址:{{""||"南山社区红源小区"}}</div>
                  <div class="spanitem">风险等级:{{""||"高"}}</div>
                </div>
              </div>
              <div class="cxjg_item">
                <div class="cxjg_item_left">
                  <img class="cxjg_item_left_img">
                  <img>
                </div>
                <div class="cxjg_item_right">
                  <div class="spanitem">姓名:{{""||"王红兵"}}</div>
                  <div class="spanitem">身份证:{{""||"51XXXXXXXX"}}</div>
                  <div class="spanitem">住址:{{""||"南山社区红源小区"}}</div>
                  <div class="spanitem">风险等级:{{""||"高"}}</div>
                </div>
              </div> -->

              <div class="cxjg_item"    v-bind:class="{highlight:(index==curClickIndex)}"  v-bind:style="{ 'border-left-color':fltjColor }"    v-for="(item,index) in ryData" :key="item.id"  @click="getPosition(item,index)">
                <div class="cxjg_item_left">
                  <div><img class="cxjg_item_left_img" :src="BASE_IMG_URL+item.personImage"/></div>
                </div>
                <div class="cxjg_item_right">
                  <div class="spanitem">姓名: {{item.name||""}}</div>
                  <div class="spanitem">身份证: {{item.idNumber||""}}</div>
                  <div class="spanitem">住址: {{item.residence||""}}</div>
                  <!-- .replace('四川省绵阳市','') -->
                  <div class="spanitem">风险等级: {{item.dangerLevel||""}}  <span class="scgj" @click.stop="">轨迹生成</span></div>
                </div>
              </div>
            </div>
          </div>
          <div class="ryyj">
            <div class="title">人员预警</div>
            <div class="ryyj_content">

               

              <div class="ryyj_item" v-for="(item,index) in ryyjData" :key="item.id" @click="getYjItem(item,index)">
                <span class="ryyj_index">{{index+1}}</span>
                <span class="ryyj_span">{{item.name}}</span>
                <span class="ryyj_span">{{item.specialType}}</span>
                
                <span class="ryyj_cq ryyj_span"  v-bind:class="{itemdaycount0:(item.overtimeDay>0&&item.overtimeDay<=5),itemdaycount5:(item.overtimeDay>5&&item.overtimeDay<=10),itemdaycount10:(item.overtimeDay>10)} " >{{"超期"+item.overtimeDay+"天"}}</span>
                <span class="ryyj_wbd ryyj_span">{{item.taskType}}</span>
              </div>
              <!-- <div class="ryyj_item">
                <span class="ryyj_index">2</span>
                <span class="ryyj_span">王红兵</span>
                <span class="ryyj_span">涉稳人员</span>
                
                <span class="ryyj_cq ryyj_span">超期15天</span>
                <span class="ryyj_wbd ryyj_span">未报道</span>
              </div>
              <div class="ryyj_item">
                <span class="ryyj_index">3</span>
                <span class="ryyj_span">王红兵</span>
                <span class="ryyj_span">涉稳人员</span>
                
                <span class="ryyj_cq ryyj_span">超期15天</span>
                <span class="ryyj_wbd ryyj_span">未报道</span>
              </div>
              <div class="ryyj_item">
                <span class="ryyj_index">4</span>
                <span class="ryyj_span">王红兵</span>
                <span class="ryyj_span">涉稳人员</span>
                
                <span class="ryyj_cq ryyj_span">超期15天</span>
                <span class="ryyj_wbd ryyj_span">未报道</span>
              </div>
              <div class="ryyj_item">
                <span class="ryyj_index">5</span>
                <span class="ryyj_span">王红兵</span>
                <span class="ryyj_span">涉稳人员</span>
                
                <span class="ryyj_cq ryyj_span">超期15天</span>
                <span class="ryyj_wbd ryyj_span">未报道</span>
              </div> -->
            </div>
          </div>

          <!-- <div class="chart-global">
              <div class="global-item global-rk">
                <p class="rk-text">人口</p>
                <p class="item-num">{{allData.rk}}</p>
              </div>
              <div class="global-item global-cl">
                <p class="cl-text fa fa-car">车辆</p>
                <p class="item-num">{{allData.cl}}</p>
              </div>
              <div class="global-item global-dz">
                <p class="dz-text">地址</p>
                <p class="item-num">{{allData.dz}}</p>
              </div>
              <div class="global-item global-dw">
                <p class="dw-text">单位</p>
                <p class="item-num">{{allData.dw}}</p>
              </div>
              <div class="global-item global-fw">
                <p class="fw-text">房屋</p>
                <p class="item-num">{{allData.fw}}</p>
              </div>
            </div>
            <div class="chart-item">
              <vital-statistics :currentCode="currentCode"></vital-statistics>
          </div>-->
          <!-- <div class="chart-item">
              <car-statistics :currentCode="currentCode"></car-statistics>
            </div>
            <div class="chart-item">
              <house-statistics :currentCode="currentCode"></house-statistics>
          </div>-->
        </div>
      </div>
    </div>
    <div class="pop">
        
        <el-dialog id="ryxx" title="人员信息" :visible.sync="ryxxpop" width="30%" class="modal-popover">
          <div class="ryxx_content" style="height:520px">
                <div class="ryxx_content" >
                      <div class="ryxxpop_jbitem">
                        <div class="cxjg_item_left" style="height:100%;">
                             <div style="height:100%;">
                                 <img class="cxjg_item_left_img" style="margin-top: 15px;margin-left: 2px;max-height: 100px;min-height:80px" :src="BASE_IMG_URL+this.ryxxItem.person.personImage"/>
                                  <div><el-button class="ckgxr" size="mini">查看关系人</el-button></div>
                             </div>
                        </div>
                        <div class="cxjg_item_right" >
                          <!-- //style="border-left:1px #eee solid" -->
                          
                          <div class="spanitem">姓名: {{ this.ryxxItem.person.name||""}}</div>
                          <div class="spanitem ">身份证:  {{this.ryxxItem.person.idNumber||""}}</div>
                           <div class="spanitem">户籍区划: {{this.ryxxItem.person.nativeInfo||""}}</div>
                          <div class="spanitem">住址: {{this.ryxxItem.person.residence||""}}</div>
                          <div class="spanitem">人员标签: <span class="label-btn">{{this.ryxxItem.person.specialType||""}}</span>

                          </div>
                        </div>
                      </div>
                </div>
                <!-- <div class="ryxxpop_item" style="height:120px">
                      <div class="ryxxpop_item_left" style="height:120px "><img class="" style="margin-top: 50px;" :src="this.Images.task"/> </div>
                      <div class="ryxxpop_item_right"><span class="right_span">定期访谈:{{this.ryxxItem.person.dangerLevel||"高"}}</span> </div>
                      <div class="ryxxpop_item_right"  style="line-height:38px;border-top: 2px #eee solid;"><span class="right_span">定期报道:{{this.ryxxItem.person.dangerLevel||"高"}} </span></div>
                      <div class="ryxxpop_item_right"  style="line-height:38px;border-top: 2px #eee solid;"><span class="right_span">定期尿检:{{this.ryxxItem.person.dangerLevel||"高"}} </span></div>
                </div> -->
                
                <div v-if="isEdite">
                      <!-- 修改状态 -->
                      <div v-show="ishowData"  class="ryxxpop_item"    v-bind:style="{height: hegihtData}" >
                            <div class="ryxxpop_item_left"   v-bind:style="{height: hegihtData}" ><img class=""  v-bind:style="{'margin-top': margintopData}"  :src="this.Images.task"/> </div>
                            <div class="ryxxpop_item_right"    v-for="(item) in taskItem" :key="item.id">
                                  <!-- <span class="right_span">{{item.taskType}}</span> 
                                  <span class="wczt" >
                                      <dingqi :id='item.id' :name='item.taskType' :state='item.taskStatus' :deadline='item.deadline'></dingqi>
                                     
                                  </span> -->

                                   <dingqi  ref='dingqiCom' class="dq" :id='item.id' :name='item.taskType' :state='item.taskStatus' :deadline='item.deadline'></dingqi>
                                     


                                  
                                  <span v-if="item.taskStatus=='未完成'" class="wczt">应完成时间：{{timestampToTime(item.deadline)}}</span>
                            </div>
                      </div>

                      <div class="ryxxpop_item">
                            <div class="ryxxpop_item_left"><img class="" :src="this.Images.risk"/>  </div>
                            <div class="ryxxpop_item_right"><span class="right_span">风险等级 </span>
                                <span class="fxdj">
                                  <template>
                                    <el-select style="width: 100px;" v-model="fxdjvalue" placeholder="请选择">
                                      <el-option
                                        v-for="item in fxdjoptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                      </el-option>
                                    </el-select>
                                  </template>
                                </span>
                            
                            </div>
                      </div>
                 
                </div>
                <div v-else>
                      <div v-show="ishowData"  class="ryxxpop_item"    v-bind:style="{height: hegihtData}" >
                            <div class="ryxxpop_item_left"   v-bind:style="{height: hegihtData}" ><img class=""  v-bind:style="{'margin-top': margintopData}"  :src="this.Images.task"/> </div>
                            <div class="ryxxpop_item_right"    v-for="(item) in taskItem" :key="item.id"><span class="right_span">{{item.taskType}}</span> <span class="wczt">{{item.taskStatus}}</span> <span v-if="item.taskStatus=='未完成'" class="wczt">应完成时间：{{timestampToTime(item.deadline)}}</span> </div>
                      </div>

                      <div class="ryxxpop_item">
                            <div class="ryxxpop_item_left"><img class="" :src="this.Images.risk"/>  </div>
                            <div class="ryxxpop_item_right"><span class="right_span">风险等级 </span><span class="fxdj">{{this.ryxxItem.person.dangerLevel||"高"}} </span></div>
                      </div>
                </div>
                


                <div class="ryxxpop_item">
                      <div class="ryxxpop_item_left"> <img class="" :src="this.Images.car"/> </div>
                      <div class="ryxxpop_item_right"> <span class="right_span"> {{this.ryxxItem.person.plateNumber||"川A9999"}}</span></div>
                </div>
                <div class="ryxxpop_item">
                      <div class="ryxxpop_item_left"> <img class="" :src="this.Images.phone"/> </div>
                      <div class="ryxxpop_item_right"><span class="right_span"> {{this.ryxxItem.person.phone}}</span></div>
                </div>

                 <div class="ryxxpop_item" style="height:80px;">
                      <div class="ryxxpop_item_left" style="height:80px"><img class="" style="margin-top: 30px;" :src="this.Images.net"/>  </div>
                      <div class="ryxxpop_item_right"><span class="right_span">QQ: {{this.ryxxItem.person.qq||"121212"}} </span></div>
                      <div class="ryxxpop_item_right" style="line-height: 38px;border-top: 2px #eee solid;"><span class="right_span">微信: {{this.ryxxItem.person.wechat||"121212"}} </span></div>

                </div>

          </div>
         

          <span slot="footer" class="dialog-footer" style="    text-align: center;">
            <el-button class='ryxx_cancel' @click="ryxxpop = false;">取 消</el-button>
            <el-button class='ryxx_updateOrConfirm' type="primary" @click="updateRyxx">{{btnText}}</el-button>
          </span>
        </el-dialog>
        <el-dialog id="yjxx" title="预警信息" :visible.sync="yjxxpop" width="35%" class="modal-popover">
          

          <div class="ryxx_content" style="height:300px">
                <div class="ryxx_content" >
                      <div class="ryxxpop_jbitem">
                        <div class="cxjg_item_left">
                              <div style="height:100%;">
                                 <img class="cxjg_item_left_img" style="margin-top: 15px;;margin-left: 2px;max-height: 100px;min-height:80px" :src="BASE_IMG_URL+this.ryxxItem.person.personImage"/>
                                 <div><el-button class="ckgxr" size="mini">查看关系人</el-button></div>
                              </div>
                        </div>
                        <div class="cxjg_item_right" >
                           <div class="spanitem">姓名：{{ this.ryxxItem.person.name||""}}</div>
                           <div class="spanitem">身份证： {{this.ryxxItem.person.idNumber||""}}</div>
                           <div class="spanitem">户籍区划：{{this.ryxxItem.person.nativeInfo||""}}</div>
                           <div class="spanitem ">住址：{{this.ryxxItem.person.residence||""}}</div>
                           <div class="spanitem">风险等级：{{this.ryxxItem.person.dangerLevel||""}}</div>
                           <div class="spanitem">人员标签：<span class="label-btn">{{this.ryxxItem.person.specialType||""}}</span>

                          </div>
                        </div>
                      </div>

                      <!-- <div v-show="ishowData"  class="ryxxpop_item"    v-bind:style="{height: hegihtData}" >
                            <div class="ryxxpop_item_left"   v-bind:style="{height: hegihtData}" ><img class=""  v-bind:style="{'margin-top': margintopData}"  :src="this.Images.task"/> </div>
                            <div class="ryxxpop_item_right"    v-for="(item) in taskItem" :key="item.id"><span class="right_span">{{item.taskType}}</span> <span class="wczt">{{item.taskStatus}}</span> <span v-if="item.taskStatus=='未完成'" class="wczt">应完成时间：{{timestampToTime(item.deadline)}}</span> </div>
                      </div> -->

                      <div class="ryxxpop_item" style="height:140px; border-left: 3px red solid;">
                          <div class="ryxxpop_item_left" style="line-height: 140px;"> <img class="" :src="this.Images.warm"/> </div>
                          <div class="ryxxpop_item_right">
                                <div style="height: 130px;overflow-y: scroll;">
                                  <div  class="yjtask"  style="" v-for="(item) in taskItem" :key="item.id"> 
                                      <p>任务说明: {{item.taskType}}</p>
                                      <p>应完成时间: {{timestampToTime(item.deadline)}}</p>
                                      <p>任务状态: {{item.taskStatus}}</p>
                                  </div>
                                </div>
                                
                          </div>
                      </div>


                </div>
               
          </div>
          <!-- <span slot="footer" class="dialog-footer">
            <el-button @click="yjxxpop = false">取 消</el-button>
            <el-button type="primary" @click="updateYjxx">确 定</el-button>
          </span> -->
        </el-dialog>

    

    </div>
  </div>
</template>
<script>
import { excontrolApi } from "@/https";
import baidumap from "@/components/baidumap/mapInit";
import dingqi from "@/views/zhongdianrenyuan/dingqi";
import eventBus from "@/event";
import { eventCollection } from "@/event/resources";
import $ from "jquery";


export default {
  name: "tongjixinxi",
  data() {
    return {
      // zdry:{
      //   name:"",
      //   idcard:"",
      //   address:"",
      //   class:"",
      // },
      allData: {
        rk: "",
        sk: "",
        sw: "",
        sd: "",
        zt: "",
        sf: "",
        xsfz: "",
        jsb: ""
      },
      Images: {
        car: "../../../static/image/zhongdianrenyuan/car.png",
        net: "../../../static/image/zhongdianrenyuan/net.png",
        phone: "../../../static/image/zhongdianrenyuan/phone.png",
        risk: "../../../static/image/zhongdianrenyuan/risk.png",
        task: "../../../static/image/zhongdianrenyuan/task.png",
         warm: "../../../static/image/zhongdianrenyuan/warm.png",
      },
      curClickIndex:0,//当前点击数据索引
      fltjText:"",
      fltjColor:"red",
      input_sfz: '',
      ryxxpop: false,
      yjxxpop: false,
      rytjData: [],
      ryData: [],
      ryxxItem:{
        person:{
            name:"",
            idNumber:"",
            residence:"四川省绵阳市涪城区警钟街87号",
            dangerLevel:"",
            personImage:"",
            dangerLevel: "中风险",
            imei: "",
            imsi: "",
            mac: "",
            nativeInfo: "德阳",
            phone: "17782229844",
            plateNumber: "",
            qq: "",
            specialType: "重点上访人员",
            vehicleImage: "",
            wechat: "",
        }
       
      },
      ryyjData: [],
      taskItem:[],
      lengthData:0,
      ishowData:true,
      hegihtData:'0px',
      margintopData:'0px',
      isEdite:false,
      btnText:"修 改",
      fxdjoptions: [{
          value: '高风险',
          label: '高风险'
        }, {
          value: '中风险',
          label: '中风险'
        }, {
          value: '低风险',
          label: '低风险'
        }],
        fxdjvalue: '高风险',
       
      // currentCode: '',
    };
  },
  components: {
    "baidu-map": baidumap,
    "dingqi": dingqi,
    // "car-statistics": carStatistics,
    // "house-statistics": houseStatistics,
  },
  mounted() {
    this.GetZdryTjData();
    let param = {};
    param.specialType="涉恐人员";
    param.pageNum = 1;
    param.pageSize = 1000000;
    this.GetZdryCx(param);
      this.GetZdryYj(param);
  },
  watch: {
     ryxxpop:{
        handler() {
          if (this.ryxxpop == false) {
              this.isEdite=false;
              this.btnText="修 改";
          }

      },
      immediate: false,
      deep: true
     }

   },
  created() {
    // eventBus.$off(eventCollection._map2ybsstj)
    //   .$on(eventCollection._map2ybsstj, (data) => {
    //     this.currentCode = data.id;
    //   });
  },
  methods: {
    // GetZdryTjData
    GetZdryTjData() {
      return excontrolApi
        .GetZdryTjData()
        .then(res => res.data)
        .then(data => {
          this.rytjData=data;
          // this.allData.sk = data;
          // this.allData.sw = data;
          // this.allData.sd = data;
          // this.allData.zt = data;
          // this.allData.sf = data;
          // this.allData.xsfz = data;
          // this.allData.jsb = data;
          // for (let i=0; i<data.length; i++) {
          //   if (data[i].category == 'person') {
          //     this.allData.rk = this.formatterData(data[i].count);
          //   }
          //   if (data[i].category == 'motorvehicle') {
          //     this.allData.cl = this.formatterData(data[i].count);
          //   }
          //   if (data[i].category == 'standardAddress') {
          //     this.allData.dz = this.formatterData(data[i].count);
          //   }
          //   if (data[i].category == 'housing') {
          //     this.allData.fw = this.formatterData(data[i].count);
          //   }
          //   if (data[i].category == 'company') {
          //     this.allData.dw = this.formatterData(data[i].count);
          //   }
          // }
        });
    },
    GetZdryCx(param) {
      return excontrolApi
        .GetZdryCx(param)
        .then(res => res.data)
        .then(data => {
          this.ryData=data.rows
         
        });
    },
    GetZdryXqCx(param) {
      var that=this;
      return excontrolApi
        .GetZdryXqCx(param)
        .then(res => res.data)
        .then(data => {
          if(data==null){
            this.$message({
                    message: "数据查询为空",
                    type: "error",
                    duration: 5 * 1000
                  });
                  return;
          }
          this.ryxxItem=data;
          this.taskItem=data.tasks;
          
          this.lengthData=data.tasks.length;
          this.ishowData=data.tasks.length!=0?true:false;
          this.hegihtData=data.tasks.length*40+'px';
          this.margintopData=(data.tasks.length*20-10)+'px';
          this.ryxxpop=true;
          this.fxdjvalue=this.ryxxItem.person.dangerLevel;
          // if(!ishowData){
          //    let eleList= document.querySelectorAll(".ryxxpop_item")
          //     eleList.innerHTML = "";
          // }
        });
    },
    GetZdryYjCx(param) {
      var that=this;
      return excontrolApi
        .GetZdryXqCx(param)
        .then(res => res.data)
        .then(data => {
          this.ryxxItem=data;
          this.taskItem=data.tasks;
          
          this.lengthData=data.tasks.length;
          this.ishowData=data.tasks.length!=0?true:false;
          this.hegihtData=data.tasks.length*40+'px';
          this.margintopData=(data.tasks.length*20-10)+'px';
          this.yjxxpop=true;
          this.fxdjvalue=this.ryxxItem.person.dangerLevel;
         
        });
    },

    GetZdryYj(param) {
      return excontrolApi
        .GetZdryYj(param)
        .then(res => res.data)
        .then(data => {
          this.ryyjData=data.rows
         
        });
    },
    getRy(){
      let param = {};
      param.idNumber=this.input_sfz;
      param.pageNum = 1;
      param.pageSize = 1000000;
      this.GetZdryCx(param);
    },
    formatterData: function(value) {
      let text = "";
      if (value < 100000) {
        text = value;
      } else if (value >= 10000) {
        text = Math.round(value / 10000) + "万";
      }

      return text;
    },
    getZdry(text,color) {
      //js方式选中高亮
        this.fltjText=text;
      this.fltjColor=color;
      let eleList= document.querySelectorAll(".global-item")
 
      for (let i = 0; i < eleList.length; i++) {
        // 遍历操作
        if(eleList[i].querySelectorAll(".item-num")[0].innerText==text){
           eleList[i].style.border='2px #13a6d2 solid';
        }else{
           eleList[i].style.border='0px';
        }
      }
      let param = {};
      param.specialType=text;
      param.pageNum = 1;
      param.pageSize = 1000000;
      this.GetZdryCx(param);
    },

    getPosition(item, index) {
      //当前选中 ，其他清空
        this.curClickIndex=index;


     
      // alert(1);
      // this.ryxxItem=item;
      if(item.idNumber==null||item.idNumber==undefined||item.idNumber==""){
        this.$message({
                message: "身份证信息为空，无法查询详情",
                type: "error",
                duration: 5 * 1000
              });
              return;
      }
      let param = {};
      param.idNumber=item.idNumber;
      param.pageNum = 1;
      param.pageSize = 1000000;
      this.GetZdryXqCx(param);
      // this.ryxxpop=true;
    },
    getYjItem(item, index) {
     
     
      let param = {};
      param.idNumber=item.idNumber;
      param.pageNum = 1;
      param.pageSize = 1000000;
      this.GetZdryYjCx(param);
     
    },
    updateRyxx(){
      if(this.isEdite==true){
         //更新数据
        //  alert("更新数据");
         //获取数据
         this;
        //  dingqi dq
        var specialPersonRecord={
             "dangerLevel": this.fxdjvalue,
             "idNumber":this.ryxxItem.person.idNumber,
             "specialType":this.ryxxItem.person.specialType
         };


        var specialPersonTaskList=[];
        var list= document.querySelectorAll('.dq');
        for (var i = 0; i < list.length; i++) {
          specialPersonTaskList.push({
            "id":list[i].id,   
            "idNumber":this.ryxxItem.person.idNumber,     
            "taskStatus":this.$refs.dingqiCom[i].value, 
            "taskType":list[i].querySelectorAll('.right_span')[0].innerText
          });
        }

       
        let param = {};
        param.specialPersonRecord = specialPersonRecord;
        param.specialPersonTaskList = specialPersonTaskList;

         return excontrolApi
        .UpdateZdryRw(param)
        .then(res => res.data)
        .then(data => {
           
            this.isEdite=false;
            this.ryxxpop=false;
            // alert("gxcg");
            //刷新列表 
            this.getZdry(this.fltjText,this.fltjColor);

          
        });
    

       
        




      }else{
          this.isEdite=true;
           this.btnText="保 存";
          // document.querySelectorAll(".ryxx_updateOrConfirm")[0].innerText="保 存";
      }
       
     
       
    },

    timestampToTime(timestamp) {
        var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        // return Y+M+D+h+m+s;
         return Y+M+D;
    },
  }
};
</script>

<style scoped>
.content-row {
  padding: 0;
}
.bl-content {
  height: calc(100vh - 130px);
  margin-bottom: 30px;
  width: 100%;
  box-sizing: border-box;
  background: #fff;
}
.content-left {
  width: calc(100% - 380px);
  height: 100%;
  float: left;
  border: 1px solid #d9dfe5;
}
.content-right {
  width: 380px;
  height: 100%;
  float: left;
  border: 1px solid #d9dfe5;
  border-left: none;
  overflow-y: auto;
}
.fltj {
  height: calc(65% - 20px);
  border-bottom: 1px #d9dfe5 solid;
}
.ryyj {
  height: calc(35% - 20px);
  margin-top: 5px;
  border-bottom: 1px #eee solid;
}
.cx {
  margin: 2px 10px 2px 5px;
}
.btnCx{
  color: white!important;
  background: #409eff!important;
}
.el-input-group__append{
  color: white!important;
  background: #409eff!important;
}
.cxjg {
  margin: 2px 5px;
  overflow: auto;
  height: calc(100% - 240px);
}
.cxjg_item {
  height: 125px;
  /* border: 1px #3889b9 solid; */
  border: 1px #eee solid;

  margin-top: 4px;
  margin-right: 5px;
  border-left: 4px red solid;
  cursor: pointer;
}
.scgj{
  border: 1px #ddd solid;
  display: inline-block;
  float:right;
  margin-right: 10px;
  padding-left: 5px;
  padding-right: 5px;
  background: #eee;
  border-radius: 2px;
}
.cxjg_item_left {
  float: left;
  width: 30%;
  text-align: center
}
.cxjg_item_left_img {
  height: calc(100% - 10px);
  /* width: 100%; */
  max-height: 90px;
  max-width: 80px;
  margin: 10px  2px 2px  10px;
}

.cxjg_item_right {
  float: right;
  width: 68%;
}
.ryyj_content {
  overflow: auto;
  height: 100%;
}
.ryyj_item {
  height: 50px;
  border: 1px #eee solid;
  margin-top: 4px;
  margin-right: 5px;
  margin-left: 5px;
  cursor: pointer;
}
.ryyj_index {
  display: inline-block;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background: #17a7de;
  color: white;
}
.ryyj_span {
  /* margin-left: 4px; */
  margin-left: 3px;

}
.ryyj_wbd {
  float: right;
  line-height: 40px;
}
.ryyj_cq {
  background: #ff4700;
  color: white;
  float: right;
  line-height: 30px;
  border-radius: 3px;
  padding: 5px;
  width: 76px;
  display: inline-block;
  text-align: center;
}
.itemdaycount0{
   background: #FBBB26;
}
.itemdaycount5{
   background:#FD9940;
}
.itemdaycount10{
   background: #FD545A;
}
.spanitem {
  margin-top: 4px;
}
.title {
  padding-left: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-bottom: 1px #eee solid;
  /* border-top: 1px solid; */
}
.chart-global {
  width: 100%;
  height: 90px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.global-item {
  background: #d9dfe5;
  border-radius: 3px;
  flex: 1;
  /* margin: 5px; */
  margin: 5px 3px;

  cursor: pointer;
  width:23%;
  /* float: left */
  display:inline-block
}
.globalitemselected {
  border: 2px #13a6d2 solid;
}
.quchuborder {
  border: 0px!important;
}
.itemwidth4 {
  width:23%;
}
.itemwidth10 {
  width:38%;
}
.itemwidth8 {
  width:32%;
}
.global-item p {
  margin: 0 auto;
  height: 35px;
  line-height: 35px;
  text-align: center;
  color: #fff;
  /* font-weight: bold; */
}
.global-item .item-num {
  text-align: center;
  width: 94%;
  height: 30px;
  line-height: 30px;
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.1);
  /* font-size: 12px; */
  font-size: 13px;
  color: #272424;
  background: white;
  margin-bottom: 2px;
}
.global-rk {
  background: #ff6666;
}
.rk-text {
  font-size: 16px;
}
.ryxxpop_item{
    height: 40px;
    margin-top: 10px;
    border: 1px #eee solid;
    border-left: 3px #13b1e1 solid;
  
}
.ryxxpop_item_left{
  float: left;
  width: 40px;
  line-height: 38px;
  text-align: center;
      /* margin-left: 5px; */
      background: #eee;

}
.ryxxpop_item_right{
  float: right;
  width: calc(100% - 40px);
  line-height: 40px;
  border-left: 2px #eee solid;
  
  



}
.ryxxpop_jbitem {
  height: 155px;
  border: 1px #eee solid;
  border-left: 3px #13b1e1 solid;
  margin-top: 4px;
  margin-right: 5px;
  cursor: pointer;
}
/* .rk-text::before {
  content: '';
  width: 16px;
  height: 16px;
  display: inline-block;
  background: url(/static/image/tongji/icon-rk.png) no-repeat;
  background-position: center;
  background-size: auto;
  margin-right: 3px;
  font-size: 12px;
} */
.global-dw {
  background: #00cc99;
}
.dw-text::before {
  content: "";
  width: 16px;
  height: 16px;
  display: inline-block;
  background: url(/static/image/tongji/icon-dw.png) no-repeat;
  background-position: center center;
  background-size: auto;
  margin-right: 3px;
}
.global-cl {
  background: #12b1e1;
}
.cl-text {
  width: 100%;
}
.cl-text::before {
  margin-right: 3px;
}
.global-fw {
  background: #9999ff;
}
.fw-text::before {
  content: "";
  width: 16px;
  height: 16px;
  display: inline-block;
  background: url(/static/image/tongji/icon-fw.png) no-repeat;
  background-position: center;
  background-size: auto;
  margin-right: 3px;
}
.global-dz {
  background: #ff9933;
}
.dz-text::before {
  content: "";
  width: 16px;
  height: 16px;
  display: inline-block;
  background: url(/static/image/tongji/icon-dz.png) no-repeat;
  background-position: center;
  background-size: auto;
  margin-right: 3px;
}
.chart-item {
  width: calc(100% - 10px);
  margin: 0 5px 5px;
  min-height: 200px;
  height: calc((100% - 105px) / 3);
}
.el-dialog__footer{
  text-align: center;
}
.ryxx_cancel{
   color: white;
   background: #13b1e1;
;
}
.right_span{
  margin-left: 10px;
}
.label-btn {
  /* width: 104px; */
  display: inline-block;
  padding-left: 10px;
  padding-right: 10px;
  height: 28px;
  line-height: 24px;
  /* margin-top: 10px; */
  text-align: center;
  color: #555759;
  border: 1px solid #d8dfe5;
  background: #f2f2f2;
  text-align: center;
  position: relative;
  /* display: block; */
}
.label-btn:before {
  position: absolute;
  content: "";
  display: block;
  width: 12px;
  height: 12px;
  border: 6px solid #ff6633;
  border-right: 6px solid transparent;
  border-bottom: 6px solid transparent;
  top: 0;
  left: 0;
}
.wczt,.fxdj{
  margin-left: 30px;
  width: 90px;
      /* display: inline-block; */
}
.yjtask{
  display: inline-block;
      background: #eee;
      margin: 5px;

}
.cx >.input-with-select >.el-input-group__append{
  background-color: blue!important;
}
.highlight {
  /* border: 1px #3889b9 solid; */
  border-top: 1px #3889b9 solid;
  border-right: 1px #3889b9 solid;
  border-bottom: 1px #3889b9 solid;
}
.ckgxr{
  /* height: 30px;
  line-height: 30px; */
}
</style>