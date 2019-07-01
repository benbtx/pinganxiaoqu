<template>
  <div class="content-center">
    <div id="bukongsearch">
      <div class="content-title">
        <span>事件查询</span>
      </div>
      <div style="margin-top:20px;padding:0 10px;height:calc(100% - 40px);overflow: hidden;">
        <div class="search-group">
          <div class="search-item" style="margin-right:30px;">
            <el-input v-model="searchkey" style="width:560px;">
            </el-input>
          </div>
          <span class="search-item">
            <button class="btn btn-info ridiusnull btn-search" type="button" @click="searchFuzzyEvent(1)">查询</button>
            <a @click="toggleGaoji">高级搜索</a>
          </span>
        </div> 

        <div class="gaojisearch" v-if="isGaojijiansuo">
            <el-form :model="ruleForm" ref="ruleForm" :inline="true">
                <!-- <el-form-item style="display: flex;justify-content: center;margin-top: -15px;">
                      <a ><i class="fa plus-circle"></i>新增搜索条件</a>
                </el-form-item>     -->
                <el-form-item :class="{gjjsitem: infotype!='add'&&infotype!='edit'}" style="display: flex;justify-content: center;">
                    <el-form-item label="事件主题：" prop="theme">
                        <el-input  v-model="ruleForm.theme"  style="width:280px"></el-input>
                    </el-form-item>
                    <el-form-item label="事发地点：" prop="addr">
                        <el-input  v-model="ruleForm.addr"  style="width:280px"></el-input>
                    </el-form-item>
                    <el-form-item label="事件关系人：" prop="person">
                        <el-input  v-model="ruleForm.person"  style="width:280px"></el-input>
                    </el-form-item>
                </el-form-item>

                <el-form-item :class="{gjjsitem: infotype!='add'&&infotype!='edit'}" style="display: flex;justify-content: center;margin-top: -15px;">
                    <el-form-item label="事件类型：" prop="type">
                        <el-select v-model="ruleForm.type" clearable placeholder="请选择"  style="width:280px">
                            <el-option label="治安" value="治安"></el-option>
                            <el-option label="消防" value="消防"></el-option>
                            <el-option label="民生" value="民生"></el-option>
                            <el-option label="涉毒" value="涉毒"></el-option>
                            <el-option label="上访" value="上访"></el-option>
                            <el-option label="涉稳" value="涉稳"></el-option>
                            <el-option label="其他" value="其他"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="告警日期：" prop="datetimerange">
                        <el-date-picker
                            v-model="ruleForm.datetimerange"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd HH:mm"
                            format="yyyy-MM-dd HH:mm"
                            style="width:280px;">
                            </el-date-picker>
                    </el-form-item>
                    <el-form-item label="事件状态：" prop="state">
                        <el-select v-model="ruleForm.state" placeholder="请选择" clearable style="width:280px;">
                            <el-option label="已处置" value="已处置"></el-option>
                            <el-option label="未处置" value="未处置"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form-item>
                <el-form-item style="width:100%;text-align:center;margin-top: -15px;margin-bottom:0px;">
                    <button class="btn btn-info ridiusnull btn-search" type="button" @click="searchGaojiEvents(1)">查询</button>
                    <button class="btn btn-info ridiusnull btn-search" type="button" @click="resetForm('ruleForm')">重置</button>
                    <button class="btn btn-info ridiusnull btn-search" type="button" @click="toggleNormal()">取消</button>
                </el-form-item>

            </el-form> 
        </div>

        <div id="bukongsearchdiv" @click.capture="hideSideBox" style="margin-top:10px;height: calc(100% - 40px);" v-show="srcresshow">
          <div class="model-hold">
            <!-- <el-table :data="srcTableData" @selection-change="handleSelectionChange" ref="multipleTable" :height="isGaojijiansuo?'calc(100vh - 540px)':'calc(100vh - 290px)'"> -->
            <el-table :data="srcTableData" @selection-change="handleSelectionChange" ref="multipleTable" :height="infotype ? (isGaojijiansuo? 'calc(100% - 240px)': 'calc(100% - 40px)'):(isGaojijiansuo? '440px': 'calc(100vh - 780px)') ">
              <el-table-column
                type="selection"
                v-if="infotype=='add'||infotype=='edit'"
                width="55">
              </el-table-column>
              <el-table-column type="index" width="80" label="序号">
              </el-table-column>
              <el-table-column prop="eventTheme" label="事件主题" min-width="300">
              </el-table-column>
              <el-table-column prop="eventAddr" label="事发地点" min-width="300">
              </el-table-column>
              <el-table-column prop="eventParticipant" label="事件关系人" min-width="100">
              </el-table-column>
              <el-table-column prop="eventReporter" label="事件上报者" min-width="100">
              </el-table-column>
              <el-table-column prop="eventType" label="事件类型" min-width="120">
                <template slot-scope="scope">
                  <span v-if="scope.row.eventType=='纠纷'">苯超标</span>                                   
                  <span v-else-if="scope.row.eventType=='涉毒'">甲苯超标</span>                                   
                  <span v-else-if="scope.row.eventType=='治安'">二甲苯超标</span>                                   
                  <span v-else-if="scope.row.eventType=='消防'">非甲烷总烃超标</span>                                   
                  <span v-else>其它超标</span>                                   
                </template>
              </el-table-column>
                <el-table-column prop="eventDate" label="事发时间" min-width="160" >
              </el-table-column>
              <el-table-column prop="eventStatus" label="事件状态" min-width="100">
                <template slot-scope="scope">
                  <span style="color:#ff0000;font-size:12px;" v-if="scope.row.eventStatus=='未处置'">{{scope.row.eventStatus}}</span>                                   
                  <span style="color:#33cc00;font-size:12px;" v-if="scope.row.eventStatus=='已处置'">{{scope.row.eventStatus}}</span>                                   
                </template>
              </el-table-column>

              <el-table-column label="操作" :min-width="infotype?100:320" fixed='right'>
                <template slot-scope="scope">
                  <el-button type="text" size="small" class="operate-btn" @click="lookbkdetail(scope.row)">
                    <i class="fa fa-file-text-o fa-lg"></i> 详情</el-button>
                  <el-button type="text" size="small" class="operate-btn" @click="doDisposal(scope.row)" v-if="!infotype&&scope.row.eventStatus=='未处置'">
                    <i class="fa fa-check-square-o fa-lg"></i> 处置</el-button>
                  <el-button type="text" size="small" class="operate-btn" v-if="!infotype&&scope.row.eventStatus=='未处置'" @click="editdetail(scope.row)">
                    <i class="fa fa-pencil-square-o fa-lg"></i> 修改</el-button>      
                  <el-button type="text" size="small" class="operate-btn" v-if="!infotype" @click="deletedetail(scope.row)">
                    <i class="fa fa-trash-o fa-lg"></i> 删除</el-button>                                      
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-pagination background @current-change="handleChangePage" :page-size="10" :current-page.sync="currentPage" layout="total, prev, pager, next, jumper" :total="srcrestotal">
          </el-pagination>
        </div>

      </div>
    </div>
    <div slot="footer" class="dialog-footer" v-if="detailsType" style="text-align:center;margin: 15px auto">
      <el-button type="primary" @click="closeAddForm" size='medium' style="width:120px;margin-right:50px;">取 消</el-button>
      <el-button type="primary" @click="getAddData" size='medium' style="width:120px;">确定</el-button>
    </div>


    <el-dialog
      :title="titleText"
      :visible.sync="isShowNewMessageBox"
      top="10vh"
      width="1185px"
      height="756px"
      class="modal-popover"
      :close-on-click-modal='false'
      :before-close="cancelbk"
      append-to-body
      >

      <luru-details ref="lurudetails" :detailsdata="detailsForm" :infotype="detailsType"></luru-details> 
 
      <div slot="footer" class="dialog-footer" style="text-align:center;" v-if="detailsType=='details'">
        <el-button type="primary" size='medium' style="width:120px;margin-right:50px;">生成报表</el-button>
        <el-button type="primary" @click="isShowNewMessageBox = false" size='medium' style="width:120px;">取消</el-button>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align:center;" v-if="detailsType=='edit'">
        <el-button type="primary" @click="editcommit" size='medium' style="width:120px;margin-right:50px;">确定</el-button>
        <el-button type="primary" @click="cancelbk" size='medium' style="width:120px;">取消</el-button>
      </div>
    </el-dialog>


      <el-dialog
        title="转为TA人"
        :visible.sync="ztrVisibility"
        width="450px"
        top="25vh"
        class="modal-popover"
        :before-close="closeZtrForm"
        :close-on-click-modal='false'
        >
        <div class="popover-content">
          <el-form :model="ztrForm" ref="ztrForm" class="details-bukong" label-width="80px">
              <el-form-item label="完成人：" prop="name" required>
                <el-select v-model="ztrForm.name" style="width:320px" placeholder="请选择">
                  <el-option label="曹思成" value="曹思成"></el-option>
                  <el-option label="李天豪" value="李天豪"></el-option>
                  <el-option label="姜一" value="姜一"></el-option>
                  <el-option label="吴承杨" value="吴承杨"></el-option>
                </el-select> 
              </el-form-item>
              <el-form-item label="完成时间：" prop="time" required>
                <el-date-picker
                  v-model="ztrForm.time"
                  type="datetime"
                  style="width:320px;"
                  placeholder="选择日期时间">
              </el-date-picker>
              </el-form-item>
              <el-form-item label="备注：" prop="desc" style="height:auto;">
                <el-input  type="textarea" v-model="ztrForm.desc" :rows="3" style="width:320px;margin:4px 0;"></el-input>
              </el-form-item>
            </el-form>
        </div>
         <div slot="footer" class="dialog-footer" style="text-align:center;">
            <el-button type="primary" @click="closeZtrForm" size='medium' style="width:120px;margin-right:50px;">取 消</el-button>
            <el-button type="primary" @click="getZtrData" size='medium' style="width:120px;">确定</el-button>
          </div>
      </el-dialog>





    <div id="aside" :class="{'task-aside-shrink': isShowSideDetails}">
        <div id="show_detail" style="margin-left: 0px;">
          <div id="detail" style="height: 100vh;">
            <div class="task-detail">
              <form id="edit_form" method="POST" action="">
                <div class="show">
                  <div class="detail-title">
                    <div class="detail-close" @click="closeSxDetails"><span class="icon-close el-icon-close"></span></div>
                    <div class="detail-name">
                        <h3 id="show_task_title">
                          处置
                          <!-- <span class="dbsx-type" :class="{redBgColor:activeItem.type=='重点人员',orangeBgColor:activeItem.type=='辖区事件',greenBgColor:activeItem.type=='视频巡查'}">{{activeItem.type}}</span>
                          {{activeItem.abstract}} -->
                        </h3>
                    </div>
                  </div>
                  <!-- <p class="detail-info">
                    <span>来源：{{activeItem.origin}}</span>
                    <span v-if='activeItem.expectEndTime!=undefined'>应完成时间：{{getFormatDate(activeItem.expectEndTime, 'YYYY-MM-DD HH:mm')}}</span>
                    <span>等级：<span :class="{redColor:activeItem.priority=='高',orangeColor:activeItem.priority=='中',greenColor:activeItem.priority=='低'}">{{activeItem.priority}}</span></span>
                  </p> -->
                  <div style="display:flex;height:600px;border:1px solid #f2f2f2;margin-bottom:10px;">  
                      <div class="content-left">
                            <p class="title"><i class="fa fa-bookmark" style="color:#12B1E1"></i> 基本信息</p>
                              <el-form  ref="ruleFormxx" label-width="150px" class="normalLabel" style="width:380px">
                                <!-- ;margin:10px auto 0; -->
                                <el-form-item style="margin-bottom:0px" label="事件主题：">
                                    <span>{{CzxxDetails.events.eventTheme}}</span>                  
                                </el-form-item>
                                <el-form-item style="margin-bottom:0px" label="事件编号：">
                                    <span>{{CzxxDetails.events.eventCode}}</span>                   
                                </el-form-item>
                                <el-form-item style="margin-bottom:0px" label="事发地点：">
                                    <span>{{CzxxDetails.events.eventAddr}}</span>
                                </el-form-item>
                                <el-form-item style="margin-bottom:0px" label="事件关系人：">
                                    <span>{{CzxxDetails.events.eventParticipant}}</span>                    
                                </el-form-item>
                                <el-form-item style="margin-bottom:0px" label="事件上报者：">
                                    <span>{{CzxxDetails.events.eventReporter}}</span><span v-if="CzxxDetails.events.eventReporterPhoneNumber!=''">，{{CzxxDetails.events.eventReporterPhoneNumber}}</span>                     
                                </el-form-item>
                                <el-form-item style="margin-bottom:0px" label="事件类型：">
                                    <!-- <span>{{CzxxDetails.events.eventType}}</span>    -->
                                    <span v-if="CzxxDetails.events.eventType=='纠纷'">苯超标</span>                                   
                                    <span v-else-if="CzxxDetails.events.eventType=='涉毒'">甲苯超标</span>                                   
                                    <span v-else-if="CzxxDetails.events.eventType=='治安'">二甲苯超标</span>                                   
                                    <span v-else-if="CzxxDetails.events.eventType=='消防'">非甲烷总烃超标</span>                                   
                                    <span v-else>其它超标</span>                                   
                                </el-form-item>
                                <el-form-item style="margin-bottom:0px" label="事发时间：">
                                    <span>{{getFormatDate(CzxxDetails.events.eventDate)}}</span>
                                </el-form-item>
                                <el-form-item style="margin-bottom:0px" label="事件等级：">
                                    <span>{{CzxxDetails.events.eventRange}}</span>                  
                                </el-form-item>
                                <el-form-item style="margin-bottom:0px" label="是否处置：">
                                    <span>{{CzxxDetails.events.eventStatus}}</span>              
                                </el-form-item>
                                <el-form-item style="margin-bottom:0px" label="是否上报：">
                                    <span>{{CzxxDetails.events.isReport}}</span>                          
                                </el-form-item>
                                <el-form-item style="height:auto;margin-bottom:0px" label="事件描述：">
                                  <!-- <span>{{CzxxDetails.events.eventDes}}</span> -->
                                     <textarea class="detail-task-txtarea" v-model="sxDescription" rows="2" @blur.prevent="setChangeShijian"></textarea>
                                </el-form-item>
                              </el-form>
                      </div>
                      <div class="content-right" style="margin-left: 30px;margin-top:5px">
                          <ziyuan-details ref="shijianxiangqing" width="400px" :detailsdata="CzxxDetails" infotype="details"></ziyuan-details> 
                      </div>
                  </div> 
                 
                  <!-- <div style="display:flex;padding:10px 20px;">
                    <span style="width:40px;font-size:12px;">描述：</span>
                    <textarea class="detail-task-txtarea" v-model="sxDescription" rows="5" @blur.prevent="setChange"></textarea>
                  </div>                          -->
                  <div class="detail-operate">
                    <!-- <div class="qq-upload-button" style="position: relative; overflow: hidden; direction: ltr;display:inline-block;width:calc(100% - 300px);height:32px;line-height:32px;color:#12b1e1;"> -->
                    <div class="qq-upload-button" style="position: relative; overflow: hidden; direction: ltr;display:inline-block;height:32px;line-height:32px;color:#12b1e1;margin-left: 20px;">
                    
                      <el-upload
                        class="upload-btn"
                        action=""
                        accept="*"
                        :auto-upload="false"
                        :on-change="newhandleUpload"
                        >
                        <div class="qq-upload-text"><i class="fa fa-paperclip" style="transform: rotate(80deg);font-size:20px;"></i><span>上传附件</span></div>
                      </el-upload>
                    </div>
                    <el-button class="btn btn-info btn-search" @click="turnToOthers()" >转TA人</el-button>
                    <el-button class="btn btn-info btn-search" @click="dealEvent()" >处置</el-button>
                  </div>
                  <div class="qq-uploader">
                    <ul class="qq-upload-list new-upload-list">
                      <li class="qq-upload-success" style="background:#f2f2f2;" v-for="item in fileList" :key="item.id">
                        <a :title="item.resourceName">
                        <span><i class="fa fa-paperclip" style="transform: rotate(80deg);font-size:20px;color:#12b1e1;"></i></span></a>
                        <span class="upload-file"><a :href="getFileUrl(item.resourceUrl)" class="upload-text" :title="item.resourceName" :download="item.resourceName">{{item.resourceName}}</a></span>
                        <span class="fr fa fa-times-circle upload-icon" @click="deleteFile(item.resourceUrl)"></span>
                        <span class="fr upload-icon"><a :href="getFileUrl(item.resourceUrl)" :download="item.resourceName" class="fa fa-long-arrow-down"></a></span>
                       
                      </li>
                    </ul>
                  </div>
                  <div class="detail-follow">
                    <div class="follow-user">关注人：</div>
                    <a href="javascript:;" class="icon-plus"></a>
                  </div>
                </div>
              </form>
            </div>
            <p style="border-bottom:1px solid #d8dfe5;height:30px;line-height:30px;margin:0 20px;font-weight:bold;">进度</p>
            <div class="task-followup">
              <div class="tab-box">
                <div class="tab-box-item">
                  <div class="dynamic-outer">
                    <div class="dynamic-in">
                      <dl class="dynamic-list" v-for="item in oprLogsData" :key="item.id">
                        <dt class="dynamic-icon">
                          <span class="handle-plus"><img :src="item.userImage" onerror="javascript:this.src='/static/image/user.png'" style="max-width:100%;max:height:100%;"/></span
                        ></dt>
                        <dd>
                          <div class="comment-bg">
                            <div class="comment-name"><a href="#">{{item.userName}}</a> {{item.itemName}}</div>
                            <div class="comment-info"><div class="time">{{getFormatDate(item.recordTime)}}</div></div>
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>       
            </div>
          </div>
        </div>
    </div>



    

  </div>
</template>

<script>
// import { excontrolApi } from "@/https";
import { excontrolApi, shijianApi } from "@/https";
import eventBus from '@/event';
import { eventCollection } from '@/event/resources';
import xiangguanZiyuanVue from '@/components/shijian/xiangguanZiyuan'
export default {
  name: "shijianSearch",
  props: ['infotype'],
  data() {
    return {
      isGaojijiansuo: false, 
      srcresshow: true,
      //控制完善基本信息的显示
      bkszshow: true,
      currentPage: 1,
      ruleForm: {
        theme: "",
        addr: "",
        person: "",
        type: "",
        datetimerange: [],
        state: ""
      }, 
      detailsForm: {
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
          eventTheme: '',                //类型：String  必有字段  备注：事件主题
          eventType: '',                //类型：String  必有字段  备注：事件类型（治安、消防、民生、涉毒、上访、涉稳）
          eventStatus: '',                //类型：Number  必有字段  备注：是否处置
          isReport: '',                //类型：Number  必有字段  备注：是否上报
          relatedEventId: ''                //类型：Number  必有字段  备注：相关事件ID（多个请用逗号隔开，结尾不加逗号）
      },
      eventsResource: {},
      relatedEventVOList: [],
      },
      srcTableData:[],
      srcrestotal:1,
      searchkey:'',
      plfileUrl: '',
      plfileUrlname: '',
      pldeleteshow: false,
      isShowNewMessageBox:false,
      multipleSelection: null,
      doGaojijiansuo: 'all',
      detailsType: this.infotype,
      titleText: '事件详情',

       //侧边栏
        isShowSideDetails: false,
           fileList:[],
      sxDescription:'',

        oprLogsData: [],
       ztrVisibility: false,
        ztrForm: {
        name:'',
        time:'',
        desc:''
      },

      CzxxDetails:{
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
          eventTheme: '',                //类型：String  必有字段  备注：事件主题
          eventType: '',                //类型：String  必有字段  备注：事件类型（治安、消防、民生、涉毒、上访、涉稳）
          eventStatus: '',                //类型：Number  必有字段  备注：是否处置
          isReport: '',                //类型：Number  必有字段  备注：是否上报
          relatedEventId: ''                //类型：Number  必有字段  备注：相关事件ID（多个请用逗号隔开，结尾不加逗号）
      },
      eventsResource: {},
      relatedEventVOList:[]
      },
      srcTableData:[],
      srcrestotal:1,
      searchkey:'',
      plfileUrl: '',
      plfileUrlname: '',
      pldeleteshow: false,
      isShowNewMessageBox:false,
      multipleSelection: null,
      doGaojijiansuo: 'all',
      detailsType: this.infotype,
      titleText: '事件详情',

       //侧边栏
        isShowSideDetails: false,
           fileList:[],
      sxDescription:'',

        oprLogsData: [],
       ztrVisibility: false,
        ztrForm: {
        name:'',
        time:'',
        desc:'',
        disposalId: '', //待处置的id
      }
    };
  },
  beforeRouteEnter(to, from, next) {
      if (from.name=='bukongxiangqing') {
         to.meta.isBack = true;
      }

      next();
  },
  activated() {
      if (!this.$route.meta.isBack) {
        this.currentPage = 1;
     //   this.getcontrolstate();
        this.clearSearchItem();
        this.searchGaojiEvents(1);
        this.getcommunity();
        this.getpoliceStation();
        this.getDizhiCount();
      }
      this.$route.meta.isBack = false;
      this.pldelete(); //清除之前选择的文件
  },
  mounted() {
      this.searchAllEvents(1);
  },
  components: {
    "luru-details": () => import("@/components/shijian/shijianDetails"),
     "ziyuan-details": xiangguanZiyuanVue,
  },
  created() {
    //监听关闭编辑弹出框
    eventBus.$on(eventCollection._CLOSE_EDITEVENT_DIALOG, data => {
      this.refreshData();
    });
  },
  beforeDestroy() {
    eventBus.$off(eventCollection._UPDATE_XIANGGUANEVENT_DATA_);
  },
  methods: {
    toggleGaoji() {
      if(this.isGaojijiansuo==false)
      {
        this.isGaojijiansuo = true;
      }
      else if(this.isGaojijiansuo==true)
      {
        this.toggleNormal();
      }
    },
    toggleNormal() {
      this.resetForm('ruleForm');
      this.isGaojijiansuo = false;
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getEventDetails(id){
        //  let param = {};
        // param = id;
     let _this = this;
     return new Promise((resolve, reject) => {
      // return excontrolApi
      return shijianApi
        .getEventDetails(id)
        .then(res => res)
        .then(data => {
          // loading.close();
          //显示详情
          _this.isShowNewMessageBox = true; 

          _this.$nextTick(() => {
            _this.detailsForm.events = data.data.events;
            _this.detailsForm.events.eventDate = this.getFormatDate(data.data.events.eventDate, 'YYYY-MM-DD HH:mm');
            _this.detailsForm.eventsResource = data.data.eventsResourceVOList;
            _this.detailsForm.relatedEventVOList = data.data.relatedEventVOList;
          });
           
          resolve();
        })
        .catch(msg => {
          _this.$message({
            message: msg,
            type: "error",
            duration: 5 * 1000
          });
        });
     });
    },
    handleChangePage(pageno) {
      if (this.doGaojijiansuo == 'gaoji') {
        this.searchGaojiEvents(pageno);
      } else if (this.doGaojijiansuo == 'keyword') {
        this.searchFuzzyEvent(pageno);
      } else {
        this.searchAllEvents(pageno);
      }
    },
    
    lookbkdetail(data) {
    //   console.log(data)
      let _this = this;
      this.detailsType = 'details';
      this.titleText = '事件详情';

      _this.getEventDetails(data.id).then(function (msg) {
        _this.$refs.lurudetails.handleFilterData();
      });
    //   this.isShowNewMessageBox = true;
    //   this.$router.push({path:'/bukongguanli/bukongxiangqing',query: {pro_id: data.dispositionID,type: 'show',defaultActive: 'first'}});
    },
    editdetail(data) {
      // console.log(data)
      let _this = this;
      this.detailsType = 'edit';
      this.titleText = '事件修改';
      
      _this.getEventDetails(data.id).then(function (msg) {
        _this.$refs.lurudetails.handleFilterData();
      });
      // this.$router.push({path:'/bukongguanli/bukongxiangqing',query: {pro_id: data.dispositionID, type: 'edit'}});
    },
    deletedetail(data) {
      this.$confirm("确定要删除事件？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        //撤销布控
        let param = data.id;
        return shijianApi
        .deleteEvent(param)
        .then(res => res.data)
        .then(data => {
            this.handleChangePage(1);
            this.$message({
              message: data.msg,
              type: "success"
            });   
        })
      })         
      .catch(() => {
          
      });
    },
    doDisposal(data) {
      let _this = this;
      // this.detailsType = 'details';
      // this.titleText = '事件详细';
      this.disposalId = data.id;

      _this.getCzxxDetails(data.id).then(function (msg) {
          //  _this.isShowSideDetails=true;
          _this.$refs.shijianxiangqing.filterData();
           _this.getEventsFlows();
      });

    
      // this.$confirm("确定要处置事件？", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning"
      // })
      // .then(() => {
      //   let param = data.id;
      //   return shijianApi
      //   .oprEvent(param)
      //   .then(res => res.data)
      //   .then(data => {
      //       this.handleChangePage();
      //       this.$message({
      //         message: data.msg,
      //         type: "success"
      //       });   
      //   })
      // })         
      // .catch(() => {
          
      // });
    },
    searchAllEvents: function(ctrcurrentPage) {
      let param = {};
      param.pageSize = 10;
      this.currentPage = ctrcurrentPage || this.currentPage;
      param.pageNum = this.currentPage;

      // return excontrolApi
      return shijianApi
        .getAllEvents(param)
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.srcrestotal = data.total;
          //生成表格
          this.srcTableData = data.rows;
          for(var i=0;i<this.srcTableData.length;i++)
          {
            this.srcTableData[i].eventDate = this.getFormatDate(this.srcTableData[i].eventDate, 'YYYY-MM-DD HH:mm');
          }

        });
    },  
    searchGaojiEvents: function(ctrcurrentPage) {
      let param = {};
      param.pageSize = 10;
      this.currentPage = ctrcurrentPage || this.currentPage;
      param.pageNum = this.currentPage;
      this.doGaojijiansuo = 'gaoji';

      if(this.ruleForm.addr){
        param.eventAddr = this.ruleForm.addr;
      }
      if(this.ruleForm.theme){
        param.eventTheme = this.ruleForm.theme;
      }
      if(this.ruleForm.person){
        param.eventParticipant = this.ruleForm.person;
      }

      if(this.ruleForm.type){
        param.eventType = this.ruleForm.type;
      }
      if(this.ruleForm.state){
        param.eventStatus = this.ruleForm.state;
      }
      if(this.ruleForm.datetimerange){
        param.eventBeginDate = this.ruleForm.datetimerange[0];
        param.eventEndDate = this.ruleForm.datetimerange[1];
      }
      if (!this.ruleForm.addr&&!this.ruleForm.theme&&this.ruleForm.person&&!this.ruleForm.type&&!this.ruleForm.state&&!this.ruleForm.datetimerange) {
        this.searchAllEvents(1);
        return;
      }

      // return excontrolApi
      return shijianApi
        .getGaojiEvents(param)
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.srcrestotal = data.total;
          //生成表格
          this.srcTableData = data.rows;
          for(var i=0;i<this.srcTableData.length;i++)
          {
            this.srcTableData[i].eventDate = this.getFormatDate(this.srcTableData[i].eventDate, 'YYYY-MM-DD HH:mm');
          }

        });
    },  
    searchFuzzyEvent: function(ctrcurrentPage) {
      let param = {};
      param.pageSize = 10;
      this.currentPage = ctrcurrentPage || this.currentPage;
      param.pageNum = this.currentPage;
      this.doGaojijiansuo = 'keyword';
  
      if(this.searchkey){
        param.keyWord = this.searchkey;
      } else {
        this.searchAllEvents(1);
        return;
      }

      // return excontrolApi
      return shijianApi
        .searchEvents(param)
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.srcrestotal = data.total;
          //生成表格
          this.srcTableData = data.rows;
          for(var i=0;i<this.srcTableData.length;i++)
          {
            this.srcTableData[i].eventDate = this.getFormatDate(this.srcTableData[i].eventDate, 'YYYY-MM-DD HH:mm');
          }

        });
    },  
     //文件上传预览
    plchangeUpload(file) {
      if (file) {
        let Xls = file.name.split('.');
        let index = Xls.length - 1;
        if (Xls[index] === 'xls' || Xls[index] === 'xlsx') {
          this.plfileUrlname = file.name;
          this.plfileUrl = file.raw;
          this.pldeleteshow = true;
        } else {
          this.$message.error('上传文件只能是 xls/xlsx 格式!');
          return false;
        }
      }
    },
    //文件上传
    submitplfj() {
      this.$refs.uploadfilepl.submit();
    },
    //文件删除
    pldelete() {
      this.plfileUrl = '';
      this.pldeleteshow = false;
    },
    closeAddForm() {
      this.clearSearchItem();
      eventBus.$emit(eventCollection._UPDATE_XIANGGUANEVENT_DATA_);
    },
    distinct(a, b) {
        let arr = a.concat(b);
        let result = [];
        let obj = {};
        this.relatedEventArr = [];

        for (let i of arr) {
            if (!obj[i.id]) {
              result.push(i);
              obj[i.id] = 1;
              this.relatedEventArr.push(i.id);
            }
        }

        return result;
    },
    getAddData() {
      eventBus.$emit(eventCollection._UPDATE_XIANGGUANEVENT_DATA_, this.multipleSelection);
    },
    clearSearchItem() {
      if (this.isGaojijiansuo) {
        this.$refs['ruleForm'].resetFields();
      }
      this.$refs.multipleTable.clearSelection();
      this.searchkey = '';
    },
    editcommit: function() {
      this.$refs.lurudetails.editsubmit();
    },
    cancelbk: function() {
      // if (this.detailsType == 'edit') {
      //   this.$refs.lurudetails.clearForm();
      // }
      this.isShowNewMessageBox = false;
    },
    refreshData() {
      this.cancelbk();
      this.searchGaojiEvents();
    },

    //侧边栏相关事件
    closeSxDetails() {
    
      this.isShowSideDetails = false;
    },

     getCzxxDetails(id){
        //  let param = {};
        // param = id;
      let _this = this;
      return new Promise((resolve, reject) => {
        // return excontrolApi
        return shijianApi
          .getEventDetails(id)
          .then(res => res)
          .then(data => {
            // _this.CzxxDetails = data.data;

            // _this.sxDescription= _this.CzxxDetails.events.eventDes;
            //   _this.fileList = data.data.eventsResourceVOList;
            // loading.close();
 
            _this.CzxxDetails.events = data.data.events;
            _this.CzxxDetails.events.eventDate = this.getFormatDate(data.data.events.eventDate, 'YYYY-MM-DD HH:mm');
            _this.CzxxDetails.eventsResource = data.data.eventsResourceVOList;
            _this.CzxxDetails.relatedEventVOList = data.data.relatedEventVOList;

            _this.sxDescription= _this.CzxxDetails.events.eventDes;
            _this.fileList = data.data.eventsResourceVOList;
            //显示详情
            // _this.isShowNewMessageBox = true;  
            _this.isShowSideDetails = true; 
            
             resolve();
          })
          .catch(msg => {
            _this.$message({
              message: msg,
              type: "error",
              duration: 5 * 1000
            });
          });
      });
    },




    setChange(){

    },

    newhandleUpload(file) {
      
      var  uploadForm= new FormData();
      uploadForm.append('file', file.raw);
      uploadForm.append('objectId', this.CzxxDetails.events.id);
      uploadForm.append('itemType', "辖区事件");
      uploadForm.append('resourceType', "dealAttchement");

      return excontrolApi
        .uploadEventsFile(uploadForm)
        .then(res => res.data)
        .then(data => {
          console.log('上传文件成功！');
          this.$message({
            message: '上传成功',
            type: "success"
          }); 
          // //更新附件，更新tree
          // //yuan 组件更新 
          //  console.log(this);
          // console.log(this.activeItem.id);
          // this.$refs.yuanTree.searchTreeData2(this.activeItem.id);
          //    this.getSpjkZy();


            //法一 ，更加id 重新获取附件信息 
            this.getCzxxDetails(this.CzxxDetails.events.id);


          this.addEventsFlows('上传了附件');
        }).catch(action => {
          
      });
    },

    getFileUrl(path) {
      var regex=/^\/.*/;
      if (regex.test(path)) {
        return this.BASE_IMG_URL + path;
      } else {
        return this.BASE_IMG_URL + '/' + path;
      }
    },


    deleteFile(url) {
      var that=this;
      let param = {};
      param.itemType ="辖区事件";
      param.fileUrl = url;
      param.objectId = this.CzxxDetails.events.id;
      // 没有删除事项中的附件
      // if (this.activeItem.type == '辖区事件') {
      //   console.log('删除辖区事件附件');
      // } else if (this.activeItem.type == '重点人员') {
      //   console.log('删除重点人员附件');
      // }

      return excontrolApi
          .deleteGztFile(param)
          .then(res => res.data)
          .then(data => {
            this.addEventsFlows('删除了附件:'+url);
           console.log(1);
           //法一 ，当前附件剔除
           var source=[];
           for (let i=0;i< this.fileList.length;i++) {
              if(this.fileList[i].resourceUrl!=url){
                source.push(this.fileList[i]);
              }
            }
             this.fileList=source;
             //法二 ，更加id 重新获取附件信息 
          
          
          }).catch(err => {
            
          });
    },


    setChangeShijian() {
      let param = {};
      param.id = parseInt(this.CzxxDetails.events.id);
      param.eventDes = this.sxDescription;

      return shijianApi
        .updateEvent(param)
        .then(res => res.data)
        .then(data => {
          this.addEventsFlows('修改了描述');
        }).catch(action => {
          
        });
    },

    getEventsFlows() {
      let param = {};
      param.objectId = this.CzxxDetails.events.id;
      param.itemType = "辖区事件";

      return excontrolApi
        .getEventsFlows(param)
        .then(res => res.data)
        .then(data => {
          this.oprLogsData = data;
        }).catch(action => {
          
        });
    },

     addEventsFlows(name) {
      let param =  {
          itemName: '',                //类型：String  必有字段  备注：事项操作名称
          itemType: '',                //类型：String  必有字段  备注：代办事项类型
          objectId: '',                //类型：String  必有字段  备注：事项id
          userId: '',                //类型：String  必有字段  备注：无
          userImage: '',                //类型：String  必有字段  备注：无
          userName: ''                //类型：String  必有字段  备注：无
      };

      param.itemName = name;
      param.itemType ="辖区事件" ;
      param.objectId = this.CzxxDetails.events.id;
      param.userId = this.$store.state.user.id;
      param.userName = this.$store.state.user.username;
      param.userImage = this.$store.state.user.userImage || '';

      return excontrolApi
        .addEventsFlows(param)
        .then(res => res.data)
        .then(data => {
          // this.searchWorkBench();
          // this.lookdetail(this.activeItem);
          this.getEventsFlows();
        }).catch(action => {
          
        });
    },




    turnToOthers() {
      // this.$confirm("确定要转给他人？", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning"
      // });
      this.ztrVisibility = true;
    },

     closeZtrForm() {
      // this.$refs['ztrForm'].resetFields();
      this.ztrVisibility = false;
    },

    getZtrData() {
      this.addEventsFlows('将此事项转给了：'+this.ztrForm.name);
      this.closeZtrForm();
    },

    dealEvent(){

       this.$confirm("确定要处置事件？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        let param = this.disposalId;
        return shijianApi
        .oprEvent(param)
        .then(res => res.data)
        .then(data => {
            this.handleChangePage();
            this.closeSxDetails();
            this.$message({
              message: data.msg,
              type: "success"
            });   
        })
      })         
      .catch(() => {
      });
    },

    hideSideBox(event) {
      let aside = document.getElementById("aside");
      if (aside && !aside.contains(event.target) &&　this.isShowSideDetails) {
        this.closeSxDetails();
      }
    },





     //侧边栏相关事件

  }
};
</script>

<style scoped>

input[type="radio"] {
  margin: 8px 0 0;
}

/* padding */

.padding-5 {
  padding-left: 5px;
  padding-right: 5px;
}

.marginb-10 {
  margin-bottom: 10px;
}

/* 改写row,去掉margin */

.row {
  margin: 15px;
}

/* 加粗的span */

.ic_strongspan {
  font-size: 15rem;
  font-weight: bold;
  padding-right: 10px;
}

/* 设定div高度 */

.ic_linediv {
  /* line-height: 60px;
min-height: 60px; */
  line-height: 32px;
  min-height: 32px;
  padding: 10px 0;
}

/* 设定对象添加div */

.ic_objectadd {
  margin: 10px 0px;
}

/* 设定靠底部的a */

.ic_abottom {
  text-decoration: underline;
  position: absolute;
  bottom: 0px;
  padding-left: 10px;
  width: 100px;
  color: #13b1e1;
}

/* 勾选框样式修正 */

.ic_objcheck {
  margin: 20px -20px 0 !important;
}

/* 档案div */

.ic_record {
  line-height: 32px;
  padding: 20px 20px 0px 20px;
  /* margin-top: 20px; */
  /* border-top: 1px dashed #d9dfe5; */
}

/* 重写属性 */

.ic_panel-title {
  font-size: 14px;
}

/* ---------------------------------------布控首页-------------------------------- */
.content-center
{
  height: 100%;
}
#tongji,
#bukong,
#bukongsearch {
  width: 100%;
  border: 1px solid #d9dfe5;
  box-sizing: border-box;
  background: #fff;
}
#tongji,#bukong {
  width: calc(50% - 10px);
  float: left;
}
#bukong {
  float: right;
}
#bukongsearch {
  height: 100%;
  margin-bottom: 15px;
  position: relative;
}
.model-hold {
  height: calc(100% - 40px);
  margin-bottom: 40px;
}
.item-bukong {
  width: 33.3%;
  height: 80px;
  margin: 10px 0;
  padding: 0 30px;
  border-right: 1px solid #d9dfe5;
  float: left;
  box-sizing: border-box;
}
.item-bukong:last-child {
  border-right: none;
}
.item-bukonglg {
  width: 40%;
  height: 80px;
  margin: 10px 0;
  padding: 0 10px;
  border-right: 1px solid #d9dfe5;
  float: left;
  box-sizing: border-box;
}
.item-bukonglg:last-child {
  border-right: none;
}
.bukong-type {
  height: 40px;
  line-height: 40px;
  margin:0;
}
.icon_zaikongliang {
  width: 268px;
  height: 100px;
  display: block;
  background: url(../../../static/image/yibiaosishi/dizhi.png) no-repeat;
  background-color: #13b1e1;
  background-position: 40px center;
  float: left;
  padding-left: 100px;
  line-height: 100px;
  font-size: 18px;
  color: #fff;
}
.item_zaikongliang {
  height: 100px;
  width: 900px;
  display: flex;
  border: 1px solid #d9dfe5;
  margin: 5px 0;
  overflow: hidden;
  border-bottom-left-radius: 4px;
  border-top-left-radius: 4px;
}
.icon_zaikongliang:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
}
.num {
  font-size: 20px;
  font-weight: bold;
}
.spanman {
  width: 100%;
  height: 40px;
  background-color: #fff;
  color: #555;
  font-size: 16px;
  text-align: left;
  display: inline-block;
  margin:0;
}
/* 操作div */

.ic_bukongbtn {
  width: 100%;
  height: 100px;
  margin: 0 auto;
  padding: 0px;
  cursor: pointer;
}
.dizhiluru {
  background: url(../../../static/image/yibiaosishi/dizhiluru.png) no-repeat;
  background-size: auto 100%;
  background-position: left;
}
.piliangdaoru {
  background: url(../../../static/image/yibiaosishi/piliangdaoru.png) no-repeat;
  background-size: auto 100%;
  background-position: left;
}
.shujudaochu {
  background: url(../../../static/image/yibiaosishi/shujudaochu.png) no-repeat;
  background-size: auto 100%;
  background-position: left;
}
.btn-info {
  background-color: #13b1e1;
  border: none;
  margin: 0 15px;
}
.btn-info:hover {
  border: none;
  outline: none;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
}
.btn-info:focus,
.btn-info:active,
.btn-info:visited {
  border: none;
  outline: none;
  background-color: #13b1e1;
}
.btn-search {
  min-width: 100px;
}
.search-group {
  display: flex;
  flex: 1;
  justify-content: center;
}
.search-item {
  display: flex;
  margin-right: 100px;
  flex-direction: row;
  flex: 0 1 auto;
  justify-content: center;
  align-items: center;
}
.search-item .label {
  width: 80px;
  color: #595959;
  font-weight: normal;
  font-size: 100%;
}

.adddizhititle {
  width: 900px;
  border-bottom: 1px solid #D8DFE5;
  font-weight: bold;
  font-size:small;
}

.gaojisearch {
    background: #f2f2f2;
    padding: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
}

.gaojijiansuo {
  position: relative;
  margin: 20px;
  text-align: left;
}
/* ---------------------------------------布控首页结束-------------------------------- */
.bukong-base {
  width: 1186px;
  margin: 0 auto;
}

.bukong-item {
  width: 50%;
}

.title {
  width: 100%;
  margin-left: 20px;
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #D8DFE5;
}

.detail {
    font-size: 12px;
}



/* 弹出详细侧边样式 */
#aside.task-aside-shrink {
    right: 0;
}
.detail-visible #aside {
    margin: 0 0 0 44%;
}
#aside {
    position: fixed;
    top: 0;
    right: -44%;
    z-index: 99;
    overflow: auto;
    width: 44%;
    height: 100%;
    background: #fff;
    box-shadow: 0 3px 10px rgba(0,0,0,0.2);
    transition: all 400ms ease-in-out;
}
.detail-title {
    position: relative;
    padding: 14px 10px;
    background: #f5f5f5;
}
.detail-close {
    position: absolute;
    right: 20px;
    top: 20px;
    z-index: 9;
    cursor: pointer;
}
.detail-close .icon-close {
    font-size: 16px;
    font-weight: 800;
    color: #666;
}
.icon-close:hover{
    color: #12b1e1;
}
.detail-name {
    margin: 0 40px 0 0;
    padding: 0px 9px;
    border: #f5f5f5 solid 1px;
    border-radius: 2px;
    cursor: text;
}

.qq-uploader {
    margin: 10px 15px;
}
.qq-upload-list {
    padding: 0;
    list-style: none;
}
.qq-upload-list li {
    padding: 8px;
    text-align: left;
    line-height: 20px;
    border-radius: 3px;
    background: rgb(245,245,245)!important;
    margin: 10px;
    transition: all .2s linear 0s;
}
.qq-progress-bar {
    background: #009dc8;
    width: 0%;
    height: 12px;
    border-radius: 6px;
    margin-bottom: 3px;
    display: none;
}
.qq-upload-spinner {
    display: inline-block;
    width: 15px;
    height: 15px;
    vertical-align: text-bottom;
}
.qq-upload-finished {
    display: none;
    width: 15px;
    height: 15px;
    vertical-align: text-bottom;
}
.qq-upload-cancel, .qq-upload-retry, .qq-upload-delete {
    float: right;
    margin: 0;
    color: #666;
    line-height: 20px;
    display: none;
}
.upload-file {
  width: calc(100% - 200px);
  overflow: hidden;
  display: inline-block;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.upload-icon,.upload-text,.upload-icon a {
    height: 20px;
    line-height: 20px;
    padding: 0 10px;
    font-size: 18px;
    color: #8c9cae;
}
.upload-icon {
  cursor: pointer;
  margin-top: 3px;
}
.upload-text {
  font-size: 12px;
  font-family: "Microsoft YaHei Bold", "Microsoft YaHei Regular", "Microsoft YaHei";
  color: #555759;
}




.task-followup {
  margin: 15px;
}
.new-upload-list {
  display: block;
  color:#12b1e1;
  max-height: 250px;
  overflow-y: auto;
}
.detail-follow {
    margin: 0 20px;
}
.detail-follow .follow-user {
    float: left;
    height: 25px;
    line-height: 25px;
}
.select-follow {
    float: left;
}
.detail-follow .icon-plus {
    width: 23px;
    height: 23px;
    line-height: 23px;
    border: #999 solid 1px;
    border-radius: 50%;
    display: inline-block;
    text-align: center;
    color: #999;
    margin: 0 0 0 10px;
    cursor: default;
}
.layer-follow {
    position: absolute;
    z-index: 99;
}
.detail-follow:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: " ";
    clear: both;
    height: 0;
}
.dynamic-header dt {
    float: left;
    width: 32px;
    height: 32px;
}
.dynamic-header .img-circle {
    width: 32px;
    height: 32px;
}
.dynamic-header dd {
    margin: 0 0 0 50px;
}
.dynamic-header .rich-txt {
    cursor: text;
    height: 32px;
}
.dynamic-header .rich-txt-bg textarea {
    width: 100%;
    height: 60px;
    line-height: 20px;
    border: none 0;
    font-size: 14px;
    resize: none;
    margin:0;
    padding: 0;
}
textarea:focus {
    outline: none 0;
}
.dynamic-header .rich-txt, .dynamic-header .rich-txt-bg {
    border: #A7ABAE solid 1px;
    padding: 5px;
    border-radius: 3px;
    -moz-border-radius: 3px;
    -webkit-border-radius: 3px;
    background: #fff;
}
.dynamic-header .rich-txt-bg.hover {
    border: #00b1e1 solid 1px;
    box-shadow: 0 0 3px #3b9dde;
}
.dynamic-handle {
    padding: 10px 0 0;
    overflow: hidden;
}
.dynamic-kind {
    float: left;
}
.dynamic-button {
    float: right;
}
.dynamic-kind [class*="icon-"] {
    font-size: 18px;
    color: #009dc8;
}
.dynamic-kind span {
    float: left;
    margin: 0 8px 0 0;
    cursor: pointer;
    font-size: 16px;
}
.btn-green {
    font-size: 12px;
    color: #fff!important;
    background-color: #91c854;
    transition: all .2s linear 0s;
}
.dynamic-outer {
  max-height: 290px;
  overflow-y: auto;
}
.dynamic-list {
    position: relative;
    margin: 0 10px 0 16px;
    border-left: 1px solid #12b1e1;
    padding: 0 0 20px;
}
.dynamic-list dd {
  margin-left: 20px;
}
.dynamic-list:last-child {
    border: none 0;
    padding-bottom: 0;
}
.dynamic-list .dynamic-icon, .dynamic-list .dynamic-face {
    position: absolute;
    left: -16px;
}
.dynamic-list dt {
    float: left;
    width: 32px;
    height: 32px;
    margin: 0 10px 0 0;
}
.dynamic-list .dynamic-icon span {
    display: block;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    overflow: hidden;
    text-align: center;
    background: #fff;
}
.dynamic-list .comment-bg {
    position: relative;
    min-width: 40%;
    background: #f3f3f3;
    padding: 10px;
    border-radius: 3px;
}
.dynamic-list .comment-name {
    font-size: 14px;
}
.dynamic-list .comment-info {
    overflow: hidden;
}
.dynamic-list .time {
    float: left;
    font-size: 12px;
    color: #bbb;
}
.dynamic-list a {
    color: #3bafda;
    cursor: default;
}
.content-left {
  width: 380px;
  padding-top: 5px;
  height: 100%;
}
.content-right {
  width: calc(100% - 380px);
}

.is-background {
  bottom: 3px;
}


/* 弹出详细侧边样式 */



</style>