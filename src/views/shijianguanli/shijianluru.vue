<template>
<div class="content-body add-control">
    <div class="page-bread">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/shijianguanli/shijianzonglan'}">事件总览</el-breadcrumb-item>
        <el-breadcrumb-item>事件录入</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-row">
      <div class="bl-content">
        <div id="stepsdiv">
          <el-steps :active="active" align-center>
            <el-step title="基本信息"></el-step>
            <el-step title="事件资源"></el-step>
            <el-step title="完成"></el-step>
          </el-steps>
        </div>
        <div v-show="firstshow" class="bukong-base">
          <div class="bukong-item">
            <p class="title"><i class="fa fa-bookmark" style="color:#12B1E1"></i> 基本信息</p>
            <el-form :model="ruleForm.events" :rules="xxrule" ref="ruleFormxx" label-width="150px" :inline="true" style="width:600px;margin:10px auto 0;">
              <el-form-item label="事件主题：" prop="eventTheme">
                <el-input  v-model="ruleForm.events.eventTheme" style="width:440px"></el-input>                  
              </el-form-item>
              <el-form-item label="事件编号：" prop="eventCode">
                <el-input  v-model="ruleForm.events.eventCode" style="width:440px"></el-input>                   
              </el-form-item>
              <el-form-item label="事发地点：" prop="eventAddr">
                <el-select v-model="address.qu"  style="width:140px" placeholder="请选择" @change="getStreet">
                    <el-option
                      v-for="item in quoptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item">
                    </el-option>
                  </el-select>
                  <el-select v-model="address.sq"  style="width:140px" placeholder="请选择">
                    <el-option
                      v-for="item in sqoptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item">
                    </el-option>
                  </el-select>
                  <el-input  v-model="address.details" style="width:150px"></el-input>                  
              </el-form-item>
              <el-form-item label="事件关系人：" prop="eventParticipant">
                <el-input  v-model="ruleForm.events.eventParticipant" style="width:440px"></el-input>                    
              </el-form-item>
              <el-form-item>
                <el-form-item label="事件上报者：" prop="eventReporter">
                  <el-input  v-model="ruleForm.events.eventReporter" style="width:100px"></el-input>                    
                </el-form-item>
                <el-form-item label="上报者联系电话：" prop="eventReporterPhoneNumber" style="margin-left:-25px;margin-right:0;">
                  <el-input  v-model="ruleForm.events.eventReporterPhoneNumber" style="width:200px"></el-input>                    
                </el-form-item>
              </el-form-item>
              <el-form-item label="事件类型：" prop="eventType">
                <el-select v-model="ruleForm.events.eventType"  style="width:440px" placeholder="请选择">
                    <!-- <el-option label="治安" value="治安"></el-option>
                    <el-option label="纠纷" value="纠纷"></el-option>
                    <el-option label="消防" value="消防"></el-option>
                    <el-option label="民生" value="民生"></el-option>
                    <el-option label="涉毒" value="涉毒"></el-option>
                    <el-option label="上访" value="上访"></el-option>
                    <el-option label="涉稳" value="涉稳"></el-option>
                    <el-option label="其它" value="其它"></el-option> -->

                    <el-option label="二甲苯超标" value="治安"></el-option>
                    <el-option label="苯超标" value="纠纷"></el-option>
                    <el-option label="非甲烷总烃超标" value="消防"></el-option>
                    <el-option label="甲苯超标" value="涉毒"></el-option>
                    <el-option label="其它" value="其它"></el-option>
                  </el-select>                    
              </el-form-item>
              <el-form-item label="事发时间：" prop="eventDate">
                <el-date-picker v-model="ruleForm.events.eventDate" type="datetime" style="width:440px" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="事件等级：" prop="eventRange">
                <el-select v-model="ruleForm.events.eventRange"  style="width:440px" placeholder="请选择">
                   <el-option label="高" value="高"></el-option>
                   <el-option label="中" value="中"></el-option>
                   <el-option label="低" value="低"></el-option>
                </el-select>                    
              </el-form-item>
              <el-form-item label="处置状态：" prop="eventStatus">
                <el-select v-model="ruleForm.events.eventStatus"  style="width:440px" placeholder="请选择">
                  <el-option label="已处置" value="已处置"></el-option>
                  <el-option label="未处置" value="未处置"></el-option>
                </el-select>               
              </el-form-item>
              <el-form-item label="是否上报：" prop="isReport">
                <el-select v-model="ruleForm.events.isReport"  style="width:440px" placeholder="请选择">
                  <el-option label="上报" value="上报"></el-option>
                  <el-option label="不上报" value="不上报"></el-option>
                </el-select>                   
              </el-form-item>
              <el-form-item label="事件描述：" prop="eventDes" style="height:auto;">
                <el-input  type="textarea" v-model="ruleForm.events.eventDes" :rows="3" style="width:440px;margin:4px 0;"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="bukong-item">          
            <p class="title"><i class="fa fa-bookmark" style="color:#12B1E1"></i> 更多信息（选填）</p>
            <div style="width:600px;margin:0px auto;">
              <p class="more-title">发现人</p>
              <el-form :model="ruleForm.events" ref="ruleFormrydx" label-width="150px" :inline="true" style="width:600px;margin:0px auto;float:left">
                <el-form-item label="发现人姓名：" prop="discovererName">
                  <el-input  v-model="ruleForm.events.discovererName"  style="width:440px"></el-input>
                </el-form-item>
                <el-form-item label="证件类型：" prop="discovererIDType">
                  <el-select v-model="ruleForm.events.discovererIDType"  style="width:440px" placeholder="请选择">
                    <el-option label="身份证" value="身份证"></el-option>
                    <el-option label="护照" value="护照"></el-option>
                    <el-option label="港澳通行证" value="港澳通行证"></el-option>
                    <el-option label="台湾通行证" value="台湾通行证"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="证件号码：" prop="discovererIDNumber">
                  <el-input  v-model="ruleForm.events.discovererIDNumber"  style="width:440px"></el-input>
                </el-form-item>
                <el-form-item label="人员类别：" prop="discovererType">
                  <el-select v-model="ruleForm.events.discovererType"  style="width:440px" placeholder="请选择">
                    <el-option label="网格员" value="网格员"></el-option>
                    <el-option label="群众" value="群众"></el-option>
                  </el-select>
                </el-form-item>
              </el-form> 
            </div>
          </div>
          <div class="footer-group">
            <button type="button" class="btn btn-info btnmargin" @click="backsjzl">取消</button>
            <button type="button" class="btn btn-info" @click="nextshowsecond">下一步</button>
          </div>
        </div>
        <div v-show="secondshow">
          <ziyuan-details ref="luru" :detailsdata="ruleForm" infotype="add"></ziyuan-details> 
          <div class="footer-group">
            <button type="button" class="btn btn-info btnmargin" @click="backshowfirst">上一步</button>
            <button type="button" class="btn btn-info" @click="nextshowthird">下一步</button>
          </div>
        </div>
        <div v-show="thirdshow">
          <luru-details ref="luruziyuan" :detailsdata="ruleForm" infotype="add"></luru-details> 
          <div class="footer-group" style="margin-top:30px;">
            <button type="button" class="btn btn-info btnmargin" @click="backshowsecond">上一步</button>
            <button type="button" class="btn btn-info btnmargin" @click="controladdcommit">提交</button>
            <!-- <button type="button" class="btn btn-info" @click="cancelbk">取消</button> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Lurudetails from "@/components/shijian/shijianDetails";
import Ziyuandetails from "@/components/shijian/xiangguanZiyuan";
import { excontrolApi, shijianApi } from "@/https";
import eventBus from '@/event';
import { eventCollection } from '@/event/resources';

export default {
  name: "shijianluru",
  data() {
    var validateTimerange = (rule, value, callback) => {
      if (this.str2DataTime(value[0]) < Date.now()) {
        callback(new Error('开始时间必须大于当前时间！'));
      } else {
        callback();
      }
    };
    var validateAddress = (rule, value, callback) => {
      if (this.address.qu.value == '' &&　this.address.sq.value == '' && this.address.details == '') {
        callback(new Error('请填写正确的地址！'));          
      } else {
        this.ruleForm.events.eventAddr = this.address.qu.label +　this.address.sq.label + this.address.details;
        callback();
      }
    };

    return {
      showKaKouTool:true,
      //控制步骤条显示
      active: 0,
      //控制完善基本信息的显示
      firstshow: true,
      //控制完善布控对象信息的显示
      secondshow: false,
      //控制布控范围的显示
      thirdshow: false,
      quoptions:[],
      sqoptions:[],
      ruleForm: {
        events: {                //类型：Object  必有字段  备注：事件实体
          discovererIDNumber: '',                //类型：String  必有字段  备注：发现人证件号码
          discovererIDType: '',                //类型：String  必有字段  备注：发现人证件类型
          discovererName: '',                //类型：String  必有字段  备注：发现人姓名
          discovererType: '',                //类型：String  必有字段  备注：发现人员类别
          eventAddr: '',              //类型：String  必有字段  备注：事件地点
          villageId: '', //社区id
          eventDate: '',                //类型：String  必有字段  备注：事件时间
          eventDes: '',                //类型：String  必有字段  备注：事件描述
          eventCode: '',                //类型：String  必有字段  备注：事件编号
          eventParticipant: '',                //类型：String  必有字段  备注：事件关系人
          eventRange: '',                //类型：String  必有字段  备注：事件等级（低、中、搞）
          eventReporter: '',                //类型：String  必有字段  备注：事件上报者
          eventReporterPhoneNumber:'',  //上报者联系电话
          eventTheme: '',                //类型：String  必有字段  备注：事件主题
          eventType: '',                //类型：String  必有字段  备注：事件类型（治安、消防、民生、涉毒、上访、涉稳）
          eventStatus: '未处置',                //类型：Number  必有字段  备注：是否处置
          isReport: '不上报',                //类型：Number  必有字段  备注：是否上报
          relatedEventId: '',                //类型：Number  必有字段  备注：相关事件ID（多个请用逗号隔开，结尾不加逗号）
      },
      eventsResource: [                //类型：Array  必有字段  备注：带附件事件资源实体
        //     eventsResource: {                //类型：Object  必有字段  备注：事件资源实体
        //         resourceDescription: '',                //类型：String  必有字段  备注：描述
        //         resourceUrl: '',                //类型：String  必有字段  备注：资源URL
        //         resourceName: '',                //类型：String  必有字段  备注：资源名称
        //         resourceType: '',                //类型：String  必有字段  备注：资源类型（picture，video，attachment）
        //         source: '',                //类型：String  必有字段  备注：资源来源（网格员、群众）
        //     },
      ],
      relatedEventVOList:[]
      },
      address: {
        qu: {label:'',value: ''},
        sq: {label:'',value: ''},
        details: ''
      },
      xxrule: {
        eventTheme: [
          {
            required: true,
            message: "事件主题不能为空！",
            trigger: "blur"
          },
          {
            pattern:/^[\u4E00-\u9FA5A-Za-z0-9]+$/,
            message: '事件主题不能只包含特殊字符！' 
          }
        ],
        eventAddr: [
          {
            required: true,
            message: "请选择事发地点！",
            trigger: "blur"
          },
          { validator: validateAddress, trigger: 'blur' },
        ],
        eventDate:[
          {
            required: true,
            message: "请选择事发时间！",
            trigger: "blur"
          }
        ],
        eventType:[
          {
            required: true,
            message: "请选择事件类型！",
            trigger: "blur"
          }
        ],
        eventStatus:[
        {
            required: true,
            message: "请选择事件是否处置！",
            trigger: "blur"
          }
        ]
      },
    };
  },
  created() {
    //监听上传数据列表
    eventBus.$on(eventCollection._UPLOADDATALIST_, data => {
      this.ruleForm.eventsResource = data;
    });
    //监听相关事件列表
    eventBus.$on(eventCollection._XIANGGUAN_EVENT_LIST_, data => {
      this.ruleForm.events.relatedEventId = data;
    });
    //监听相关事件列表变化
    eventBus.$on(eventCollection._XIANGGUAN_EVENT_DATA_, data => {
      this.ruleForm.relatedEventVOList = data;
    });
  },
  mounted() {
    // this.initdict();
    this.getShijianId();
    this.getCounty();
  },
  components: {
    "ziyuan-details": Ziyuandetails,
    "luru-details": Lurudetails,
  },
  methods: { 
    getCounty(){
      let param = {};
      param.cityId = "5107";

      return excontrolApi
        .bzdzGetcounty(param)
        .then(res => res.data)
        .then(data => {
          this.quoptions = data;
        });
    },
    getStreet(){
      let param = {};
      let tmp = String(this.address.qu.value);
      this.ruleForm.events.eventAddr = this.address.qu.label;
      tmp = tmp.substr(0,6);
      param.townId = tmp;

      return excontrolApi
        .bzdzGetstreet(param)
        .then(res => res.data)
        .then(data => {
          this.sqoptions = data;
        });                           
    },
    getBase64Image:function(img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        // var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
        var ext = 'image/jpeg';
        var dataURL = canvas.toDataURL(ext);
        return dataURL;
    },
    getShijianId:function() {
        return excontrolApi
        .fangwuInsertGetID()
        .then(res => res)
        .then(data => {
          this.ruleForm.events.eventCode = data.data;     
        });
    },
    //上一步、下一步等显示的控制
    backsjzl: function() {
      this.$router.push({ path: '/shijianguanli/shijianzonglan'});
    },
    nextshowsecond: function() {
      let _this = this;

      _this.$refs["ruleFormxx"].validate(valid => {
        if (valid) {
          _this.$refs["ruleFormrydx"].validate(valid => {
            if (valid) {
              _this.active = 1;
              _this.secondshow = true;
              _this.firstshow = false;
            } else {
              _this.$message({
                message: "请按提示输入必填项",
                type: "warning"
              });
            }
          });
        } else {
          _this.$message({
            message: "请按提示输入必填项",
            type: "warning"
          });
        }
      });
    },
    backshowfirst: function() {
      this.active = 0;
      this.firstshow = true;
      this.secondshow = false;
    },
    nextshowthird: function() {
      this.active = 2;
      this.secondshow = false;
      this.thirdshow = true;

      eventBus.$emit(eventCollection._UPDATE_XIANGGUAN_DATA_, this.ruleForm);
    },
    backshowsecond: function() {
      this.active = 1;
      this.thirdshow = false;
      this.secondshow = true;

      eventBus.$emit(eventCollection._UPDATE_XIANGGUAN_DATA_, this.ruleForm);
    },
    //取消布控事件
    cancelbk: function() {
      this.active = 0;
      this.firstshow = true;
      this.secondshow = false;
      this.thirdshow = false;
      this.address.qu = {};
      this.address.sq = {};
      this.address.details = '';
      this.$refs["ruleFormxx"].resetFields();
      this.$refs["ruleFormrydx"].resetFields();
    },
    controladdcommit: function() {
      let controladdinfo = this.ruleForm;
      let time = this.str2DataTime(controladdinfo.events.eventDate);
      controladdinfo.events.eventDate = time;
      controladdinfo.events.villageId = this.address.sq.value;
      delete controladdinfo.events.address; 
      delete controladdinfo.relatedEventVOList; 
      
      return shijianApi
          .addShijian(controladdinfo)
          .then(res => res.data)
          .then(data => {
            this.$alert('提交成功', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.cancelbk();
              }
            });
          })
    },
    beforeAvatarUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isLt10M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isLt10M;
    },
    savePic(src) {
      // let a = document.createElement('a');
      // a.download = url.substring(url.lastIndexOf("/")+1,url.length);
      // a.href = url;
      // a.click();
      
      var canvas = document.createElement('canvas');
      var img = document.createElement('img');
      img.onload = function(e) {
          canvas.width = img.width;
          canvas.height = img.height;
          var context = canvas.getContext('2d');
          context.drawImage(img, 0, 0, img.width, img.height);
          canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
          canvas.toBlob((blob)=>{
              let link = document.createElement('a');
              link.href = window.URL.createObjectURL(blob);
              link.download = src.substring(src.lastIndexOf("/")+1,src.length);
              link.click();  
          }, "image/jpeg");
      }
      img.setAttribute("crossOrigin",'Anonymous');
      img.src = src;
    },
  }
};

</script>
<style>
input[type="file"] {
  display: none;
}
</style>
<style scoped>
.add-control {
  height: calc(100% - 60px);
}
.content-row {
  padding:0;
  height: calc(100% - 10px);
}
.bl-content {
  width: 100%;
  height: 100%;
  margin-bottom: 10px;
  border: 1px solid #d9dfe5;
  box-sizing: border-box;
  background: #fff;
  overflow-x: auto;
}
.heightAuto {
  height: auto;
}
.bk-content {
  width:80%;
  height:calc(100% - 40px);
  margin:30px auto;
}
.content-left {
  width:300px;
  height:100%;
  float:left;
  border:1px solid #ccc;
}
.content-right {
  width:calc(100% - 300px);
  height:100%;
  margin-left:300px;
  border:1px solid #ccc;
  border-left:none;
}
.more-title {
    border-bottom: 1px solid rgb(204, 204, 204);
    width: 540px;
    height: 40px;
    line-height: 40px;
    margin: 10px 0 10px 50px;
    font-size: 12px;
    font-weight: bold;
}
#stepsdiv {
  background:#12b1e1;
  padding: 10px 5%;
  min-width: 1200px;
}
.bukong-base {
  width: 1200px;
  margin: 0 auto;
  overflow: hidden;
}
.bukong-item {
  width: 50%;
  float: left;
}
.title {
  width: 540px;
  margin-left: 50px;
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #D8DFE5;
}
.btnmargin {
  margin-right: 50px;
}
.btn-info {
  width: 120px;
  height: 40px;
  background: #12b1e1;
}
.footer-group {
  clear: both;
  width: 100%;
  text-align: center;
  margin: 10px auto;
}
img {
  position: relative;
  z-index: 3;
}
</style> 