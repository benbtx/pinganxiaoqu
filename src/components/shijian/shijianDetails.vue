<template>
<div class="bukong-base">
    <div class="bukong-item">
    <p class="title">
        <i class="fa fa-bookmark" style="color:#12B1E1"></i> 基本信息
        <span @click="showMore" class="more-info" v-if="infotype!='edit'">更多信息</span>
    </p>
    <!-- 基本信息详情 -->
    <el-form v-if="infotype!='edit'" ref="ruleFormxx" label-width="150px" class="normalLabel" style="width:600px;margin:10px auto 0;">
        <el-form-item label="事件主题：">
            <span>{{detailsdata.events.eventTheme}}</span>                  
        </el-form-item>
        <el-form-item label="事件编号：">
            <span>{{detailsdata.events.eventCode}}</span>                   
        </el-form-item>
        <el-form-item label="事发地点：">
            <span>{{detailsdata.events.eventAddr}}</span>
        </el-form-item>
        <el-form-item label="事件关系人：">
            <span>{{detailsdata.events.eventParticipant}}</span>                    
        </el-form-item>
        <el-form-item label="事件上报者：">
            <span>{{detailsdata.events.eventReporter}}</span><span v-if="detailsForm.events.eventReporterPhoneNumber!=''">，{{detailsForm.events.eventReporterPhoneNumber}}</span>                    
        </el-form-item>
        <el-form-item label="事件类型：">
            <!-- <span>{{detailsdata.events.eventType}}</span>   -->
            <span v-if="detailsdata.events.eventType=='纠纷'">苯超标</span>                                   
            <span v-else-if="detailsdata.events.eventType=='涉毒'">甲苯超标</span>                                   
            <span v-else-if="detailsdata.events.eventType=='治安'">二甲苯超标</span>                                   
            <span v-else-if="detailsdata.events.eventType=='消防'">非甲烷总烃超标</span>                                   
            <span v-else>其它超标</span>                     
        </el-form-item>
        <el-form-item label="事发时间：">
            <span>{{getFormatDate(detailsdata.events.eventDate)}}</span>
        </el-form-item>
        <el-form-item label="事件等级：">
            <span>{{detailsdata.events.eventRange}}</span>                  
        </el-form-item>
        <el-form-item label="是否处置：">
            <span>{{detailsdata.events.eventStatus}}</span>              
        </el-form-item>
        <el-form-item label="是否上报：">
            <span>{{detailsdata.events.isReport}}</span>                          
        </el-form-item>
        <el-form-item label="事件描述：" style="height:auto;">
           <span>{{detailsdata.events.eventDes}}</span>
        </el-form-item>
    </el-form>
    <!-- 修改基本信息 -->
    <el-form v-if="infotype=='edit'" :model="detailsForm.events" :rules="xxrule" ref="ruleFormxx" label-width="150px" :inline="true" style="width:600px;margin:10px auto 0;">
        <el-form-item label="事件主题：" prop="eventTheme">
        <el-input  v-model="detailsForm.events.eventTheme" style="width:440px"></el-input>                  
        </el-form-item>
        <el-form-item label="事件编号：" prop="eventCode">
        <el-input  v-model="detailsForm.events.eventCode" style="width:440px"></el-input>                   
        </el-form-item>
        <el-form-item label="事发地点：" prop="eventAddr">
            <!-- <el-select v-model="address.qu"  style="width:140px" placeholder="请选择" @change="getStreet">
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
            <el-input  v-model="address.details" style="width:150px"></el-input>                   -->
            <el-input  v-model="detailsForm.events.eventAddr" style="width:440px"></el-input>
        </el-form-item>
        <el-form-item label="事件关系人：" prop="eventParticipant">
        <el-input  v-model="detailsForm.events.eventParticipant" style="width:440px"></el-input>                    
        </el-form-item>
        <el-form-item>
            <el-form-item label="事件上报者：" prop="eventReporter">
                <el-input  v-model="detailsForm.events.eventReporter" style="width:100px"></el-input>                    
            </el-form-item>
            <el-form-item label="上报者联系电话：" prop="eventReporterPhoneNumber" style="margin-left:-25px;margin-right:0;">
                <el-input  v-model="detailsForm.events.eventReporterPhoneNumber" style="width:200px"></el-input>                    
            </el-form-item>
        </el-form-item>
        <el-form-item label="事件类型：" prop="eventType">
        <el-select v-model="detailsForm.events.eventType"  style="width:440px" placeholder="请选择">
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
        <el-form-item label="事发时间：">
            <el-date-picker v-model="detailsForm.events.eventDate" type="datetime" style="width:440px" 
              format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="选择日期时间">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="事件等级：" prop="eventRange">
        <el-select v-model="detailsForm.events.eventRange"  style="width:440px" placeholder="请选择">
            <el-option label="高" value="高"></el-option>
            <el-option label="中" value="中"></el-option>
            <el-option label="低" value="低"></el-option>
        </el-select>                    
        </el-form-item>
        <el-form-item label="处置状态：" prop="eventStatus">
        <el-select v-model="detailsForm.events.eventStatus"  style="width:440px" placeholder="请选择">
            <el-option label="已处置" value="已处置"></el-option>
            <el-option label="未处置" value="未处置"></el-option>
        </el-select>               
        </el-form-item>
        <el-form-item label="是否上报：" prop="isReport">
        <el-select v-model="detailsForm.events.isReport"  style="width:440px" placeholder="请选择">
            <el-option label="上报" value="上报"></el-option>
            <el-option label="不上报" value="不上报"></el-option>
        </el-select>                   
        </el-form-item>
        <el-form-item label="事件描述：" prop="eventDes" style="height:auto;">
        <el-input  type="textarea" v-model="detailsForm.events.eventDes" :rows="3" style="width:440px;margin:4px 0;"></el-input>
        </el-form-item>
    </el-form>
    </div>
    <div class="bukong-item">          
        <ziyuan-details ref="xiangqing" :detailsdata="detailsdata" :infotype="detailsType"></ziyuan-details> 
    </div>

    <el-dialog
        title="更多信息"
        :visible.sync="moreVisibility"
        width="340px"
        class="modal-popover"
        :close-on-click-modal='false'
        append-to-body
        >
        <div class="popover-content">
            <div style="width: 100%;margin: -15px auto 0;">
                <p class="more-title">发现人</p>
                <el-form ref="ruleFormrydx" class="gaojijiansuo normalLabel" label-width="100px" style="width:300px;margin:0px auto;">
                    <el-form-item label="发现人姓名：">
                        <span>{{detailsdata.events.discovererName}}</span>
                    </el-form-item>
                    <el-form-item label="证件类型：">
                        <span>{{detailsdata.events.discovererIDType}}</span>
                    </el-form-item>
                    <el-form-item label="证件号码：">
                        <span>{{detailsdata.events.discovererIDNumber}}</span>
                    </el-form-item>
                    <el-form-item label="人员类别：">
                        <span>{{detailsdata.events.discovererType}}</span>
                    </el-form-item>
                </el-form> 
            </div>
        </div>
    </el-dialog>
</div>
</template>

<script>
import { excontrolApi,shijianApi } from "@/https";
import eventBus from '@/event';
import xiangguanZiyuanVue from '@/components/shijian/xiangguanZiyuan'
import { eventCollection } from '@/event/resources';

export default {
    name: "Lurudetails",
    props: ["detailsdata", "infotype"],
    data() {
    return {
      moreVisibility: false,
      detailsForm: this.detailsdata,
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
            message: "事发地点不能为空！",
            trigger: "blur"
          }
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
components: {
    "ziyuan-details": xiangguanZiyuanVue,
},
computed: {
    detailsType: function() {
        if (this.infotype == 'add') {
            return 'details';
        }
        return this.infotype;
    },
},
created() {
    //监听相关事件列表
    eventBus.$on(eventCollection._XIANGGUAN_EVENT_LIST_, data => {
      this.detailsForm.events.relatedEventId = data;
    });
  },
methods: {
    showMore() {
        this.moreVisibility = true;
        console.log(this.detailsdata)
    },
    handleFilterData() {
        eventBus.$emit(eventCollection._UPDATE_XIANGGUAN_DATA_);
    },
    editsubmit: function() {
      let controladdinfo = this.detailsForm.events;
      let time = this.str2DataTime(controladdinfo.eventDate);
      controladdinfo.eventDate = time;
    
      let _this = this;
      return shijianApi
          .updateEvent(controladdinfo)
          .then(res => res.data)
          .then(data => {
            this.$alert('提交成功', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                eventBus.$emit(eventCollection._CLOSE_EDITEVENT_DIALOG);
              }
            });
          });
    },
    clearForm() {
        this.$refs["ruleFormxx"].resetFields();
    }
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
    width: 100%;
    height: 40px;
    line-height: 40px;
    margin: 0;
    font-size: 12px;
    font-weight: bold;
}
.more-info {
    float: right;
    border: 1px solid #999;
    width: 100px;
    height: 32px;
    margin-top: 10px;
    border-radius: 3px;
    line-height: 32px;
    text-align: center;
    background: #f2f2f2;
    cursor: pointer;
}
#stepsdiv {
  background:#12b1e1;
  padding: 10px 5%;
  min-width: 1200px;
}
.bukong-base {
  width: 1200px;
  height:650px;
  margin: 0 auto;
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