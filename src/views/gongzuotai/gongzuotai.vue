<template>
  <div id="contentbody" class="content-body">
    <div class="page-bread">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>工作台</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-row" @click.capture="hideSideBox">
        <div class="bl-content">
          <div class="tab-title">
            <div class="shixiang" @click="searchShixiang">
              <span class="icon-shixiang"></span>
              <p class="nol-border" :class="{'sx-active': searchType==1}">
                <span class="text-title">待办事项</span>
                <span class="num-shixiang">{{allCount['待办事项']}}</span>
              </p>
            </div>
            <div class="tixing" @click="searchTixing">
              <span class="icon-tixing"></span>
              <p class="nol-border" :class="{'tx-active': searchType==2}">
                <span class="text-title">消息提醒</span>
                <span class="num-tixing">{{allCount['消息提醒']}}</span>
              </p>
            </div>
          </div>
          <div class="dbsx-container" v-show="searchType == 1">
            <p class="content-title">待办事项</p>
            <div style="padding:0 15px;position: relative;padding-bottom: 50px;height: calc(100% - 40px);">
              <div style="margin-top:5px;height:40px;border-bottom: 1px solid #D8DFE5;">
                <span class="complete-btn" :class="{'complete-btn-active': searchStatus == 1}" @click="searchUncomplete()">待完成</span>
                <span class="complete-btn" :class="{'complete-btn-active': searchStatus == 2}" @click="searchComplete()">已完成</span>
              </div>
              <div>
                <button class="btn btn-info" type="button" @click="doEdit()" v-if="!isEditStatus">编辑</button>
                <button class="btn btn-info" type="button" @click="doDelete()" v-if="isEditStatus">删除</button>
                <button class="btn btn-info" type="button" @click="doEdit()" v-if="isEditStatus">取消</button>
                <el-select placeholder="请选择" v-model="searchFenlei" class="gzt-search-btn" multiple style="width:270px;" @change="searchWorkBench(1)">
                  <el-option value="辖区事件" label="辖区事件"></el-option>
                  <el-option value="重点人员" label="重点人员"></el-option>
                  <el-option value="视频巡查" label="视频巡查"></el-option>
                </el-select>
                <el-input placeholder="请输入关键字" v-model="searchkey" class="gzt-search-btn" style="margin-right:calc(50% - 376px);">
                  <el-button slot="append" @click="searchWorkBench(1)">查询</el-button>
                </el-input>
              </div>
              <div class="model-hold">
                <div class="dbsx-item" v-for="(item, index) in srcTableData" :key="item.index">
                  <div class="dbsx-index" :class="{'dbsx-index-complete': searchStatus==2}">
                    <span v-if="isEditStatus" class="gzt-chk">
                      <el-checkbox v-model="multipleSelection" :label="item">&nbsp;</el-checkbox>
                    </span>
                    <span v-else>{{index+1}}</span>
                  </div>
                  <div class="dbsx-content" :class="{'dbsx-content-active': activeItem.type && activeItem.origin == item.origin && activeItem.id == item.id}" @click="showSxDetails(item)">
                    <p class="dbsx-title"><span class="dbsx-type" :class="{redBgColor:item.type=='重点人员',orangeBgColor:item.type=='辖区事件',greenBgColor:item.type=='视频巡查'}">{{item.type}}</span>{{item.abstract}}</p>
                    <p class="dbsx-info">
                      <span>来源：{{item.origin}}</span>
                      <span v-if='item.expectEndTime!=undefined'>应完成时间：{{getFormatDate(item.expectEndTime,'YYYY-MM-DD HH:mm')}}</span>
                      <span>等级：<span :class="{redColor:item.priority=='高',orangeColor:item.priority=='中',greenColor:item.priority=='低'}">{{item.priority}}</span></span>
                    </p>
                    <span class="dbsx-more"></span>
                  </div>
                </div>
              </div>
              <el-pagination background @current-change="searchWorkBench" :page-size="6" :current-page="currentPage" layout="total, prev, pager, next, jumper" :total="srcrestotal">
              </el-pagination>
            </div>
          </div>
          <div v-show="searchType == 2">
            <div style="margin-top:5px;">
              <button class="btn btn-info" type="button" @click="doDelete()">删除</button>
              <button class="btn btn-info" type="button" @click="turnToComplete()">{{completeText}}</button>
              <!-- <button class="btn btn-info" type="button" @click="searchAll()">全部</button>
              <button class="btn btn-info" type="button" @click="searchComplete()">{{searchType == 1?'已完成':'已读'}}</button>
              <button class="btn btn-info" type="button" @click="searchUncomplete()">{{searchType == 1?'未完成':'未读'}}</button> -->
              <el-input placeholder="请输入关键字" v-model="searchkey" class="gzt-search-btn">
                <el-button slot="append" @click="searchWorkBench(1)">查询</el-button>
              </el-input>
            </div>
            <div class="model-hold">
              <el-table :data="srcTableData" @selection-change="handleSelectionChange" ref="multipleTableTx" height="calc(100vh - 336px)">
                <el-table-column
                  type="selection"
                  width="55" class-name="gzt-chk">
                </el-table-column>
                <el-table-column type="index" width="80" label="序号">
                </el-table-column>
                <el-table-column prop="type" label="类型" min-width="120">
                </el-table-column>
                <el-table-column prop="abstract" label="消息内容" min-width="240">
                </el-table-column>
                <el-table-column prop="origin" label="消息来源" min-width="120">
                </el-table-column>
                <el-table-column label="发送时间" min-width="150">
                  <template slot-scope="scope">
                    <span>{{getFormatDate(scope.row.expectEndTime)}}</span>                             
                  </template>
                </el-table-column>
                <el-table-column label="状态" min-width="100" prop="checked">
                  <template slot-scope="scope">
                    <span :class="{redColor:scope.row.checked=='0', greenColor:scope.row.checked=='1'}">{{scope.row.checked==0 ? '未读' : '已读'}}</span>                             
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="300" fixed='right'>
                  <template slot-scope="scope">
                    <el-button type="text" size="small" class="operate-btn" @click="lookdetail(scope.row)">
                      <i class="fa fa-file-text-o fa-lg"></i> 查看详情</el-button>
                    <!-- <el-button type="text" size="small" class="operate-btn" v-if="scope.row.type!='审批通知'" @click="turnToEvent(scope.row)">
                      <i class="fa fa-external-link fa-lg"></i> 转为事项</el-button>                                       -->
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <p class="sel-group">选择：
              <span @click="toggleSelection" class="sel-btn">全部</span>-<span @click="clearSelection" class="sel-btn">无</span>-<span @click="selCompleted" class="sel-btn">{{searchType == 1?'已完成':'已读'}}</span>-<span @click="selUncompleted" class="sel-btn">{{searchType==1?'未完成':'未读'}}</span>
            </p>
            <el-pagination background @current-change="searchWorkBench" :page-size="14" :current-page="currentPage" layout="total, prev, pager, next, jumper" :total="srcrestotal">
            </el-pagination>
          </div>
        </div>
    </div>

    <el-dialog
        title="查看详情"
        :visible.sync="zdryVisibility"
        width="500px"
        top="25vh"
        class="modal-popover"
        :close-on-click-modal='false'
        >
        <div class="popover-content">
          <div class="row">
            <div class="col-md-10">
                <span class="spandec">任务类型：
                <span class="spantext">{{rydetailsdata.taskType}}</span>
                </span>
            </div>
          </div>
          <div class="row">
            <div class="col-md-10">
                <span class="spandec">任务状态：
                <span class="spantext">{{rydetailsdata.taskStatus}}</span>
                </span>
            </div>
          </div>
          <div class="row">
            <div class="col-md-10">
                <span class="spandec">任务过期天数：
                <span class="spantext">{{rydetailsdata.overday}}</span>
                </span>
            </div>
          </div>         
          <div class="row">
            <div class="col-md-10">
                <span class="spandec">过期时间：
                <span class="spantext">{{getFormatDate(rydetailsdata.deadline)}}</span>
                </span>
            </div>
          </div>
          <div class="row">
            <div class="col-md-10">
                <span class="spandec">重点人员类型：
                <span class="spantext">{{rydetailsdata.specialType}}</span>
                </span>
            </div>
          </div>
          <div class="row">
            <div class="col-md-10">
                <span class="spandec">风险级别：
                <span class="spantext">{{rydetailsdata.dangerLevel}}</span>
                </span>
            </div>
          </div>
          <div class="row">
            <div class="col-md-10">
                <span class="spandec">姓名：
                <span class="spantext">{{rydetailsdata.name}}</span>
                </span>
            </div>
          </div>
          <div class="row">
            <div class="col-md-10">
                <span class="spandec">性别：
                <span class="spantext">{{rydetailsdata.gender}}</span>
                </span>
            </div>
          </div>
          <div class="row">
            <div class="col-md-10">
                <span class="spandec">身份证：
                <span class="spantext">{{rydetailsdata.idNumber}}</span>
                </span>
            </div>
          </div>
          <div class="row">
            <div class="col-md-10">
                <span class="spandec">联系电话：
                <span class="spantext">{{rydetailsdata.phone}}</span>
                </span>
            </div>
          </div>
          <div class="row">
            <div class="col-md-10">
                <span class="spandec">现居地：
                <span class="spantext">{{rydetailsdata.residence}}</span>
                </span>
            </div>
          </div> 
        </div>
      </el-dialog>
      <el-dialog
        title="查看详情"
        :visible.sync="xqsjVisibility"
        width="500px"
        top="20vh"
        class="modal-popover"
        :close-on-click-modal='false'
        >
        <div class="popover-content">
          <div class="row">
            <div class="col-md-10">
                <span class="spandec">事件主题：
                <span class="spantext">{{sjdetailsdata.events.eventTheme}}</span>
                </span>
            </div>
          </div>
          <div class="row">
            <div class="col-md-10">
                <span class="spandec">事件编号：
                <span class="spantext">{{sjdetailsdata.events.eventCode}}</span>
                </span>
            </div>
          </div>
          <div class="row">
            <div class="col-md-10">
                <span class="spandec">事发地点：
                <span class="spantext">{{sjdetailsdata.events.eventAddr}}</span>
                </span>
            </div>
          </div>
          <div class="row">
            <div class="col-md-10">
                <span class="spandec">事件关系人：
                <span class="spantext">{{sjdetailsdata.events.eventParticipant}}</span>
                </span>
            </div>
          </div>
          <div class="row">
            <div class="col-md-10">
                <span class="spandec">事件上报者：
                <span class="spantext">{{sjdetailsdata.events.eventReporter}}</span>
                </span>
            </div>
          </div>
          <div class="row">
            <div class="col-md-10">
                <span class="spandec">事件类型：
                <span class="spantext">{{sjdetailsdata.events.eventType}}</span>
                </span>
            </div>
          </div>
          <div class="row">
            <div class="col-md-10">
                <span class="spandec">事发时间：
                <span class="spantext">{{getFormatDate(sjdetailsdata.events.eventDate)}}</span>
                </span>
            </div>
          </div>
          <div class="row">
            <div class="col-md-10">
                <span class="spandec">事件等级：
                <span class="spantext">{{sjdetailsdata.events.eventRange}}</span>
                </span>
            </div>
          </div>
          <div class="row">
            <div class="col-md-10">
                <span class="spandec">是否处置：
                <span class="spantext">{{sjdetailsdata.events.eventStatus}}</span>
                </span>
            </div>
          </div>
          <div class="row">
            <div class="col-md-10">
                <span class="spandec">是否上报：
                <span class="spantext">{{sjdetailsdata.events.isReport}}</span>
                </span>
            </div>
          </div>
          <div class="row">
            <div class="col-md-10">
                <span class="spandec">事件描述：
                <span class="spantext">{{sjdetailsdata.events.eventDes}}</span>
                </span>
            </div>
          </div>
          <div class="row">
            <div class="col-md-10">
                <span class="spandec">发现人姓名：
                <span class="spantext">{{sjdetailsdata.events.discovererName}}</span>
                </span>
            </div>
          </div>
          <div class="row">
            <div class="col-md-10">
                <span class="spandec">证件类型：
                <span class="spantext">{{sjdetailsdata.events.discovererIDType}}</span>
                </span>
            </div>
          </div>
          <div class="row">
            <div class="col-md-10">
                <span class="spandec">证件号码：
                <span class="spantext">{{sjdetailsdata.events.discovererIDNumber}}</span>
                </span>
            </div>
          </div>
          <div class="row">
            <div class="col-md-10">
                <span class="spandec">人员类别：
                <span class="spantext">{{sjdetailsdata.events.discovererType}}</span>
                </span>
            </div>
          </div>
        </div>
      </el-dialog>
       <el-dialog
        title="查看详情"
        :visible.sync="spxqVisibility"
        width="500px"
        top="20vh"
        class="modal-popover"
        :close-on-click-modal='false'
        >
        <div class="popover-content">
           <div class="row">
            <div class="col-md-10">
                <span class="spandec">审批编号：
                <span class="spantext">{{spinfodetailsdata.spbh}}</span>
                </span>
            </div>
          </div>
          <div class="row">
            <div class="col-md-10">
                <span class="spandec">审批描述：
                <span class="spantext">{{spinfodetailsdata.ms}}</span>
                </span>
            </div>
          </div>
          <div class="row">
            <div class="col-md-10">
                <span class="spandec">申请时间：
                <span class="spantext">{{spinfodetailsdata.sqsj}}</span>
                </span>
            </div>
          </div>
          <div class="row">
            <div class="col-md-10">
                <span class="spandec">审批最终结果：
                <span class="spantext">{{spinfodetailsdata.zt=='01'?'未开始':spinfodetailsdata.zt=='02'?'同意':'不同意'}}</span>
                </span>
            </div>
          </div>
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
                        <h3 id="show_task_title"><span class="dbsx-type" :class="{redBgColor:activeItem.type=='重点人员',orangeBgColor:activeItem.type=='辖区事件',greenBgColor:activeItem.type=='视频巡查'}">{{activeItem.type}}</span>
                          {{activeItem.abstract}}</h3>
                    </div>
                  </div>
                  <p class="detail-info">
                    <span><span  style="width:60px;display: inline-block;">来源：</span>{{activeItem.origin}}</span>
                    <span v-if='activeItem.expectEndTime!=undefined'>应完成时间：{{getFormatDate(activeItem.expectEndTime, 'YYYY-MM-DD HH:mm')}}</span>
                    <span>等级：<span :class="{redColor:activeItem.priority=='高',orangeColor:activeItem.priority=='中',greenColor:activeItem.priority=='低'}">{{activeItem.priority}}</span></span>
                  </p>
                  <div style="display:flex;height:400px;border:1px solid #f2f2f2;margin-bottom:10px;" v-if="activeItem.type=='视频巡查'">  
                    <div class="content-left">
                      <yuan-tree ref="yuanTree" yuanType="details"></yuan-tree>  
                    </div>
                    <div class="content-right">
                      <baidu-map ref="map" addtype="spjk"></baidu-map>
                    </div>  
                  </div> 
                  <div class="scbb" v-if="activeItem.type=='视频巡查'">
                    <el-date-picker
                      v-model="bbtime"
                      class="scbb-select"
                      type="daterange"
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                    <button type="button" class="btn btn-info" @click="exportXjjl" style="margin:10px 20px;">生成报表</button>
                  </div>
                  <div v-if="activeItem.type=='审批'" style="width:640px;margin:0 auto;">
                    <bk-details :bkdetaildata="spdetailsdata.base" :addtype="spdetailsdata.bktype" :imgUrl="spdetailsdata.imgUrl" :selectedKakou="spdetailsdata.selectNode"></bk-details>
                  </div>
                  <div style="display:flex;padding:10px 20px;" v-if="activeItem.type!='审批'">
                    <span style="width:60px;font-size:12px;">描述：</span>
                    <textarea class="detail-task-txtarea" v-model="sxDescription" rows="3" @blur.prevent="setChange"></textarea>
                  </div> 
                  <div v-else-if="activeItem.origin=='我审批的'" style="display:flex;padding:10px 20px;">
                    <span style="width:70px;font-size:12px;">审批意见：</span>
                    <textarea class="detail-task-txtarea" v-model="spyjText" rows="3"></textarea>
                  </div>  

                  <div style="display:flex;padding:10px 20px;" v-if='ishave'>
                   <!-- v-if='activeItem.accessoryVos.length!=0' -->
                    <span style="width:60px;font-size:12px;">归档记录：</span>
                     <!-- <img style="width:350px;height:200px" :src='picUrl' /> -->
                    <!-- {{ this.imghtml}} -->
                    <div>
                        <div style="width:100%;display:block;" v-html="imghtml"></div>
                        <div style="width:100%;display:block;" v-html="qthtml"></div>
                        <div style="width:100%;display:block;" v-html="videohtml"></div>
                    </div>
                     
                  </div> 
                  

                  <div class="detail-operate" v-if="searchStatus==1" :class="{flexEnd:activeItem.type=='审批'}">
                    <div v-if="activeItem.type!='审批'" class="qq-upload-button"
                      style="position: relative; overflow: hidden; direction: ltr;display:inline-block;width:calc(100% - 300px);height:32px;line-height:32px;color:#12b1e1;">
                      <!-- <div class="qq-upload-text"><i class="fa fa-paperclip" style="transform: rotate(80deg);font-size:20px;"></i><span>上传附件</span>
                      </div> 
                      <input multiple="multiple" type="file" name="file" style="position: absolute; right: 0px; top: 0px; font-family: Arial; font-size: 118px; margin: 0px; padding: 0px; cursor: pointer; opacity: 0;"> -->
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
                    <el-button class="btn btn-info btn-search" @click="turnToOthers(activeItem)" v-if="activeItem.type!='视频巡查'&&activeItem.type!='审批'">转TA人</el-button>
                    <el-button class="btn btn-info btn-search" @click="turnToComplete(activeItem)" v-if="activeItem.type!='视频巡查'&&activeItem.type!='审批'">完成</el-button>
                    <el-button class="btn btn-info btn-search" @click="rejectBk(activeItem)" v-if="activeItem.type=='审批'&&activeItem.origin=='我审批的'">驳回</el-button>
                    <el-button class="btn btn-info btn-search" @click="approveBk(activeItem)" v-if="activeItem.type=='审批'&&activeItem.origin=='我审批的'">批准</el-button>
                  </div>
                  <div class="qq-uploader">
                    <ul class="qq-upload-list new-upload-list">
                      <li class="qq-upload-success" style="background:#f2f2f2;" v-for="item in fileList" :key="item.id">
                        <a :title="item.resourceName">
                        <span><i class="fa fa-paperclip" style="transform: rotate(80deg);font-size:20px;color:#12b1e1;"></i></span></a>
                        <span class="upload-file"><a @click="downloadUrlFile(getFileUrl(item.resourceUrl),item.resourceName)" class="upload-text" :title="item.resourceName">{{item.resourceName}}</a></span>
                        <span class="fr fa fa-times-circle upload-icon" @click="deleteFile(item.resourceUrl)"></span>
                        <span class="fr upload-icon"><a @click="downloadUrlFile(getFileUrl(item.resourceUrl),item.resourceName)" class="fa fa-long-arrow-down"></a></span>
                        <!-- <span class="fr upload-text">19.51 KB</span> -->
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
                          <span class="handle-plus"><img :src="item.userImage || require('../../../static/image/user.png')" style="max-width:100%;max:height:100%;"/></span
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
import { excontrolApi, shijianApi,shipinApi,tmpApi } from "@/https";
import YuanTree from "@/components/shipin/yuanTree";
import eventBus from "@/event";
import { eventCollection } from "@/event/resources";
import baidumap from '@/components/baidumap/mapInit';

export default {
  name: "gongzuotai",
  data() {
    return {
      completeText: '标记为完成',
      searchkey: '',
      searchType: 1,
      searchFenlei: [],
      searchStatus: 1,
      isEditStatus: false,
      srcrestotal: 0,
      currentPage: 1,
      srcTableData: [],
      multipleSelection: [],
      allCount: {},
      zdryVisibility: false,
      xqsjVisibility: false,
      ztrVisibility: false,
      isShowSideDetails: false,
      ishave:false,
      rydetailsdata: {},
      sjdetailsdata: {
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
        eventsResource: {}
      },
      ztrForm: {
        name:'',
        time:'',
        desc:''
      },
      activeItem: {},
      fileList:[],
      sxDescription:'',
      oprLogsData: [],

      spcxCurId:1,
      spxcCurparentId:1,
      spyjText: '',
      spxqVisibility: false,
      spdetailsdata: {
        base: {
          bkbh:'',
          bkmc: '',
          bkfqr: '',
          ckedbksjrange: [],
          bkyy:"",
          bkyz: [{
            "endPeriod":"",
            "startPeriod":"",
            "thresholdMin":"" 
          }],
          bkdw:'',
          bkxm: '',
          bksqrq:'',
          bklx:'',
          bkzjh: '',
          bkzjlx: '',
          bksfz:'',
          bkdh: '',
          bkhjd: '',
          bkcl: '',
          bkcpys: '',
          cpysText: '',
          bkcxid: '',
          bkcx: '',
          bkclys: '',
          clysText: '',
          bkyyText: '',
          viewDetails: true,
          sprlb:[
            {
              userName: '',
            }
          ],
          zt: ''
        },
        imgUrl: '',
        selectNode: [],
        bktype: 'ry',
      },
      spinfodetailsdata: {},
      bkyys: [{
        value: '1',
        label: '被盗车'
      }, {
        value: '2',
        label: '被抢车'
      }, {
        value: '3',
        label: '嫌疑车'
      },{
        value: '4',
        label: '交通违法车'
      },{
        value: '5',
        label: '紧急查控车'
      }],
      cpys: this.getCpysList(),
      clys: this.getClysList(),
      clpps: JSON.parse(localStorage.getItem('clpplist')),
      bbtime: [this.getFormatDateYear(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7)),this.getFormatDateYear(new Date())],
      imghtml:"",
       qthtml:"",
       videohtml:"",
       curdata:null,
   };
  },
  mounted() {
    // this.getWorkBenchCount();
    this.searchWorkBench(1);
  },
  created() {
    // let _this = this;
    // document.addEventListener('click',(e)=>{
    //   let aside = document.getElementById("aside");
    //   if (aside && !aside.contains(e.target) &&　_this.isShowSideDetails) {
    //     _this.closeSxDetails();
    //   }
    // }, true);

     //工作台预案点击-->获取当前操作记录和资源
    eventBus
      .$off(eventCollection._yuan2gongzuotai)
      .$on(eventCollection._yuan2gongzuotai, data => {
          // if(this.$route.path=="/gongzuotai/gongzuotai"){
             
          // }
          console.log(data);
          if(data.curNodeData!=undefined){
              console.log(data);

                // this.$refs.yuanTree.yuantree.setCheckedKeys([data.id]);
            // this.activeItem.id=data.curNodeData.payload.cameraPreplanId;
            // this.activeItem.type="视频巡查";
            // this.sxDescription = data.curNodeData.payload.remarks//||"fgdgfd";
            // this.xqsjVisibility=false;
            // this.oprLogsData = [];
            // this.fileList = [];
            // this.getEventsFlows();
            // this.fileList=data.curNodeData.payload.resources;


          }else{
              
            // alert(data.payload.cameraPreplanId);
            // this.activeItem = {
            //   id:data.payload.cameraPreplanId,
            //   type:"视频巡查",
            //    origin:"视频巡查",
            //     priority:"视频巡查",
               
            // };
            this.spcxCurId=data.id;
            this.spxcCurparentId=parseInt(data.parentId);
            this.activeItem.id=data.payload.cameraPreplanId;
            this.activeItem.type="视频巡查";
            this.sxDescription = data.payload.remarks//||"fgdgfd";
            this.xqsjVisibility=false;
            this.oprLogsData = [];
            // this.fileList = [];
            this.getEventsFlows();
            // this.lookdetail(this.activeItem);
          //  this.getYuanFileList(data);
            this.fileList = data.payload.resources;

          }

          
       
    });


  },
  components: {
    "yuan-tree": YuanTree,
    'baidu-map':baidumap,
    "bk-details": () => import("@/components/Control/Bkdetails"),
  },
  methods: {
    hideSideBox(event) {
      let aside = document.getElementById("aside");
      if (aside && !aside.contains(event.target) &&　this.isShowSideDetails) {
        this.closeSxDetails();
      }
    },
    getWorkBenchCount: function() {
      return tmpApi
        .getWorkBenchCount()
        .then(res => res.data)
        .then(data => {
          this.allCount = data;
        });
    },
    getYuanFileList: function(data) {
      let param = {};
      param.preplanId = data.payload.cameraPreplanId;
      param.cameraIndexCode = data.id;
      return shipinApi
        .searchYuanFileList(param)
        .then(res => res.data)
        .then(data => {
          this.fileList = data;
        });
    },
    searchAll() {
      this.searchStatus = 0;
      this.searchWorkBench(1);
    },
    searchComplete() {
      this.searchStatus = 2;
      this.multipleSelection = [];
      this.isEditStatus = false;
      this.searchWorkBench(1);
    },
    searchUncomplete() {
      this.searchStatus = 1;
      this.multipleSelection = [];
      this.isEditStatus = false;
      this.searchWorkBench(1);
    },
    searchWorkBench: function(ctrcurrentPage) {
      let param = {};
      if (this.searchType == 2) {
        param.pageSize = 14;
      } else {
        param.pageSize = 6;
      }
      this.currentPage = ctrcurrentPage || this.currentPage;
      param.pageNo = this.currentPage;

      param.type = this.searchType; //0：所有 1：事项 2：消息
      param.status = this.searchStatus; //0：所有 1：未完成（未读） 2：已完成
      if (this.searchkey) {
        param.keyword = this.searchkey;
      }
      if (this.searchFenlei.length>0) {
        param.eventType = this.searchFenlei.join(',');
      }

      return tmpApi
        .getWorkBench(param)
        .then(res => res.data)
        .then(data => {
          this.multipleSelection = [];
          this.srcrestotal = data.total;
          //生成表格
          this.srcTableData = data.pageData;
          this.getWorkBenchCount();
        });
    }, 
    searchTixing() {
      this.searchType = 2;
      this.searchStatus = 0;
      this.searchkey = '';
      this.searchFenlei = [];
      this.completeText = '标记为已读';
      this.searchWorkBench(1);
    },
    searchShixiang() {
      this.searchType = 1;
      this.searchStatus = 1;
      this.searchkey = '';
      this.searchFenlei = [];
      this.completeText = '标记为已完成';
      this.searchWorkBench(1);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val)
    },
    lookdetail(data) {

      this.activeItem = data;
      this.sxDescription = data.description;
      this.isShowSideDetails = true;
      this.oprLogsData = [];
      this.fileList = [];
      var dt=this.activeItem.accessoryVos;
      if(this.activeItem.accessoryVos.length!=0){
        this.ishave=true;
        // this.BASE_IMG_URL+(activeItem.accessoryVos.length!=0?activeItem.accessoryVos[0].accessoryUrl
       var Url;
       this.imghtml="";
         this.videohtml="";
         this.qthtml="";
       for (var i=0;i<dt.length;i++) {
         Url=this.BASE_IMG_URL+"/"+this.activeItem.accessoryVos[i].accessoryUrl;
         if(dt[i].accessoryType=="图片"){
             this.imghtml+=" <img style='width:350px;height:200px' src='"+ Url+"'/> &nbsp"
         }else if(dt[i].accessoryType=="视频"){
            // this.videohtml+=" <video style='width:350px;height:200px' /><source src='"+ Url+"'  type='video/mp4'> </video>&nbsp"
            this.videohtml+="<video width='320' height='240' controls> <source src='"+ Url+"'  type='video/mp4'></video>&nbsp&nbsp"
         }
         else{
           this.qthtml+="<a href='"+Url+"'>"+dt[i].accessoryName+"</a>"
         }

       }
      }else{
        this.ishave=false;
      }

      this.updateState(data);

      // if(data.type!="视频巡查"){
      //   this.getEventsFlows();
      //   this.lookdetail(data);
      // }

      // if (data.type == '重点人员') {
      //   this.lookrydetail(data.id);
      // } else if (data.type == '辖区事件') {
      //   this.looksjdetail(data.id);
      // } else if (data.type == '审批通知') {
      //   this.lookspinfodetail(data.id);
      // } else if (data.type=='审批') {
      //   this.getspinfodetail(data.id);
      //   this.lookspdetail(data.id);
      // } 
      // else if (data.type == '视频巡查') {
      //   // this.lookspxcdetail(data.id);
      // }
    },
    lookrydetail(id) {
      let _this = this;
      return excontrolApi
        .getPersonTaskDetail(id)
        .then(res => res)
        .then(data => {
          _this.rydetailsdata = data.data;
          //显示详情
          if (this.searchType == 2) {
            _this.zdryVisibility = true;
          } else {
            _this.fileList = [];
            let fileArr = [];
            if (data.data.attachmentUrls) {
              fileArr = data.data.attachmentUrls.split(',');
            }
            
            for (let i=0;i<fileArr.length;i++) {
              let obj = {};
              let index = fileArr[i].lastIndexOf("\/");  
              let str = fileArr[i].substring(index + 1, fileArr[i].length);
              obj.resourceName = str;
              obj.resourceUrl = fileArr[i];
              _this.fileList.push(obj);
            }
          }
        })
        .catch(msg => {
          _this.$message({
            message: msg,
            type: "error",
            duration: 5 * 1000
          });
        });
    },
    looksjdetail(id) {
      let _this = this;
      return excontrolApi
        .getEventsDetail(id)
        .then(res => res)
        .then(data => {
          _this.sjdetailsdata = data.data;
          //显示详情
          if (this.searchType == 2) {
            _this.xqsjVisibility = true;
          } else {
            _this.fileList = data.data.eventsResourceVOList;
          }
        })
        .catch(msg => {
          _this.$message({
            message: msg,
            type: "error",
            duration: 5 * 1000
          });
        });
    },
    lookspinfodetail(id) {
      let _this = this;
      let spbh = id;
      // let spbh = '7d8767a1-bbcd-417d-ab2b-1b9312767675';

      return excontrolApi
        .excontrolGetBkspDetailsBytzbh(spbh)
        .then(res => res)
        .then(data => {
          _this.spinfodetailsdata = data.data;
          //显示详情 
          _this.spxqVisibility = true;
        })
        .catch(msg => {
          _this.$message({
            message: msg,
            type: "error",
            duration: 5 * 1000
          });
        });
    },
    getspinfodetail(id) {
      let _this = this;
      let spbh = id;
      // let spbh = '7d8767a1-bbcd-417d-ab2b-1b9312767675';

      return excontrolApi
        .excontrolGetBkspDetails(spbh)
        .then(res => res)
        .then(data => {
          _this.spdetailsdata.base.zt = data.data.zt;
        });
    },
    lookspdetail(id) {
      let _this = this;
      let spbh = id;
      // let spbh = '7d8767a1-bbcd-417d-ab2b-1b9312767675';
      return excontrolApi
        .excontrolGetBkDetails(spbh)
        .then(res => res)
        .then(data => {
          _this.getViewData(data.data);
        });
    },
    getViewData(data) {
      if (data.base64) {
        this.spdetailsdata.imgUrl = 'data:image/jpeg;base64,'+data.base64;
      } else {
        this.spdetailsdata.imgUrl = '';
      }
      this.spdetailsdata.selectNode = data.disposition.dispositionArea.split(';');
      let base = this.spdetailsdata.base;
      base.bkbh = data.disposition.dispositionID;
      base.bkmc = data.disposition.title;
      base.bkfqr = data.disposition.applicantName;
      base.bkdw = data.disposition.applicantOrg;
      base.bksqrq = data.disposition.creatTime;
      base.sprlb = data.sprlb;
      base.viewDetails = true;
      //选择的布控时间范围
      base.ckedbksjrange = [this.getFormatDate(data.disposition.beginTime),this.getFormatDate(data.disposition.endTime)];
      base.bkyy = data.disposition.reason;
      base.bkyz = data.alarmDetails;
      base.bkzjh = data.targetFeature.credentialsNum;
      base.bkzjlx = data.targetFeature.credentialsType;

      if (data.disposition.dispositionCategory == 2) {
        this.spdetailsdata.bktype = 'ry';  //"布控类别";
        base.bkxm = data.targetFeature.name;
        base.bksfz = data.targetFeature.idCard; 
        base.bkdh = data.targetFeature.phone; 
        base.bkhjd = data.targetFeature.register; 
      } else if(data.disposition.dispositionCategory == 3) {
        this.spdetailsdata.bktype = 'che'; //"布控类别"; 
        base.bkcl = data.targetFeature.plateNo; 
        base.bkcxid = data.targetFeature.brand; 
        base.bkcpys = data.targetFeature.plateColor; 
        base.bkclys = data.targetFeature.vehicleColor;  
        base.bkyyText = this.selBkyy(data.disposition.reason);
        base.cpysText = this.selCarPlateColor(data.targetFeature.plateColor);
        base.bkcx = this.selCarpinpai(data.targetFeature.brand); //车型
        base.clysText = this.selCarColor(data.targetFeature.vehicleColor);
      }    
    },
    selBkyy(vId) {
      let bkyyText = '';
      for (let i=0;i<this.bkyys.length;i++) {
        if (this.bkyys[i].value == vId) {
          bkyyText = this.bkyys[i].label;
          break;
        }
      }

      return bkyyText;
    },
    selCarPlateColor(vId) {
      let obj = {};      
      obj = this.cpys.find((item)=>{   
        return item.value === vId;
      });  
       
      return obj && obj.label;
    },
    selCarColor(vId) {
      let obj = {};      
      obj = this.clys.find((item)=>{   
        return item.value === vId;
      });  
       
      return obj && obj.label;
    },
    selCarpinpai(vId) {
      let clppText = '';
      for (let i=0;i<this.clpps.length;i++) {
        let obj = {};    
        let items = this.clpps[i].items;  
        for (let n=0;n<items.length;n++) {
          if (items[n].value == vId) {
            obj = items[n];
            break;
          }
        }
        if (obj.value) {
          clppText = obj.label;
          break;
        }
      }

      return clppText;
    },
    lookspxcdetail(id) {
      let _this = this;
      
      return excontrolApi
        .getEventsDetail(id)
        .then(res => res)
        .then(data => {
          // _this.sjdetailsdata = data.data;
          //显示详情
           _this.xqsjVisibility = false;
            _this.fileList = data.data.eventsResourceVOList;
          // if (this.searchType == 2) {
          //   _this.xqsjVisibility = true;
          // } else {
          //   _this.fileList = data.data.eventsResourceVOList;
          // }
        })
        .catch(msg => {
          _this.$message({
            message: msg,
            type: "error",
            duration: 5 * 1000
          });
        });
    },
    doEdit() {
      if (this.isEditStatus) {
        this.multipleSelection = [];
      }
      this.isEditStatus = !this.isEditStatus;
    },
    doDelete() {
      if (this.multipleSelection.length==0) {
         this.$message({
          message: '请至少选择一项!',
          type: "warning"
        }); 
        return false;
      }
      this.$confirm("确定删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        let param = [];
        for (let i=0;i<this.multipleSelection.length;i++) {
          let tmp = {};
          tmp.objectId = this.multipleSelection[i].id; 
          tmp.objectType = this.multipleSelection[i].type; 
          tmp.deleted = true;
          param.push(tmp);
        }

        return tmpApi
        .addAndModifyWorkBench(param)
        .then(res => res.data)
        .then(data => {
          this.searchWorkBench();
        });
      })      
    },

    updateState(data){
      let param = [];
      var _this=this;
        // for (let i=0;i<this.multipleSelection.length;i++) {
        //   let tmp = {};
        //   tmp.objectId = this.multipleSelection[i].id; 
        //   tmp.objectType = this.multipleSelection[i].type; 
        //   param.push(tmp);
        // }
           let tmp = {};
          tmp.objectId = data.id; 
          tmp.objectType = data.type; 
          param.push(tmp);
        this.curdata=data;

        return tmpApi
        .addAndModifyWorkBench(param)
        .then(res => res.data)
        .then(data => {
          //找到当前页面data,刷新data
          //  console.log("ttt")
          // console.log(_this.srcTableData)
            for (let i=0;i<_this.srcTableData.length;i++) {
                  if(_this.srcTableData[i].id==_this.curdata.id){
                      _this.srcTableData[i].checked=1;
                  }
            }
        });
    },

    doComplete(obj) {
      let param = [];
      if (obj) {
        let tmp = {};
        tmp.id = obj.id; 
        tmp.level = obj.priority; 
        tmp.type = obj.type; //对应事项/任务类型，目前分为：重点人员、辖区事件
        param.push(tmp);
      } else {
        if (this.multipleSelection.length>0) {
          for (let i=0;i<this.multipleSelection.length;i++) {
            let tmp = {};
            if (this.multipleSelection[i].taskStatus == '未处置') {
              tmp.id = this.multipleSelection[i].id; 
              tmp.level = this.multipleSelection[i].priority; 
              tmp.type = this.multipleSelection[i].type;
              param.push(tmp);
            }
          }
        } 
      }
      if (param.length==0) {
        this.$message({
          message: '请至少选择一项未处置事项!',
          type: "warning"
        }); 
        return false;
      }

      return tmpApi
        .finishWorkBenchEvents(param)
        .then(res => res.data)
        .then(data => {
          this.addEventsFlows(this.$store.state.user.username+' 完成了该事项');
          this.searchWorkBench();
        });
    },
    oprMessage(obj, type) {
      let param = [];
      if (obj) {
        let tmp = {};
        tmp.objectType = obj.type; //对应事项/任务类型，目前分为：重点人员、辖区事件
        tmp.objectId = obj.id; 
        if (type=='shixiang') {
          tmp.convertEvent = 1; //转为事项
        }
        param.push(tmp);
      } else {
        if (this.multipleSelection.length>0) {
          for (let i=0;i<this.multipleSelection.length;i++) {
            let tmp = {};
            if (this.multipleSelection[i].checked == 0) {
              tmp.objectId = this.multipleSelection[i].id; 
              tmp.objectType = this.multipleSelection[i].type; 
              param.push(tmp);
            }
          }
        } 
      }
      if (param.length==0) {
        this.$message({
          message: '请至少选择一条未读信息!',
          type: "warning"
        }); 
        return false;
      }

      return tmpApi
        .addAndModifyWorkBench(param)
        .then(res => res.data)
        .then(data => {
          this.searchWorkBench();
        });
    },
    turnToComplete(obj) {
      this.$confirm("确定"+this.completeText+"？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        if (this.searchType == 1) {
          this.doComplete(obj);
        } else if (this.searchType == 2) {
          this.oprMessage(obj);
        }
      })         
      .catch(() => {
          
      });
    },
    turnToEvent(obj) {
      this.$confirm("确定要转为事项？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        this.oprMessage(obj,'shixiang');
      })         
      .catch(() => {
          
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
      this.$refs['ztrForm'].resetFields();
      this.ztrVisibility = false;
    },
    getZtrData() {
      this.addEventsFlows('将此事项转给了：'+this.ztrForm.name);
      this.closeZtrForm();
    },
    toggleSelection() {
      this.multipleSelection = [];
      if (this.searchType == 1) {
        this.$refs.multipleTableSx.toggleAllSelection();
      } else {
        this.$refs.multipleTableTx.toggleAllSelection();
      }
      this.multipleSelection = this.srcTableData;
    },
    clearSelection() {
      if (this.searchType == 1) {
        this.$refs.multipleTableSx.clearSelection();
      } else {
        this.$refs.multipleTableTx.clearSelection();
      }
    },
    selCompleted() {
      if (this.searchType == 1) {
        this.getSelectedRows('multipleTableSx','taskStatus', '已处置');
      } else {
        this.getSelectedRows('multipleTableTx','checked', 1);
      }
    },
    selUncompleted() {
      if (this.searchType == 1) {
        this.getSelectedRows('multipleTableSx','taskStatus','未处置');
      } else {
        this.getSelectedRows('multipleTableTx','checked', 0);
      }
    },
    getSelectedRows(formname, key, value) {
      this.multipleSelection = [];
      for (let i=0;i<this.srcTableData.length;i++) {
        if (this.srcTableData[i][key] == value) {
          this.$refs[formname].toggleRowSelection(this.srcTableData[i],true);
        } else {
          this.$refs[formname].toggleRowSelection(this.srcTableData[i],false);
        }
      }
      console.log(this.multipleSelection)
    },
    showSxDetails(item) {
      this.activeItem = item;
      this.sxDescription = item.description;
      this.isShowSideDetails = true;
      this.oprLogsData = [];
      this.fileList = [];

      if(item.type!="视频巡查"){
        this.getEventsFlows();
        this.lookdetail(item);
      }
     
    },
    closeSxDetails() {
      this.activeItem = {};
      this.isShowSideDetails = false;
    },
    newhandleUpload(file) {
      if(this.activeItem.id==undefined){
        this.$message({
          message: '请选择一个摄像机!',
          type: "warning"
        }); 
        return;
      }
      this.uploadForm = new FormData();
      this.uploadForm.append('file', file.raw);
      this.uploadForm.append('objectId', this.activeItem.id);
      this.uploadForm.append('itemType', this.activeItem.type);

      return excontrolApi
        .uploadEventsFile(this.uploadForm)
        .then(res => res.data)
        .then(data => {
          console.log('上传文件成功！');
          this.$message({
            message: '上传成功',
            type: "success"
          }); 
          this.addEventsFlows('上传了附件');
          //更新附件，更新tree
          //yuan 组件更新 
           console.log(this);
          console.log(this.activeItem.id);
          this.$refs.yuanTree.searchTreeData2(this.activeItem.id);
          this.getSpjkZy();
          // if(){}     
        }).catch(action => {
          
        });
    },
    getEventsFlows() {
      let param = {};
      param.objectId = this.activeItem.id;
      param.itemType = this.activeItem.type;

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
      param.itemType = this.activeItem.type;
      param.objectId = this.activeItem.id;
      param.userId = this.$store.state.user.id;
      param.userName = this.$store.state.user.username;
      param.userImage = this.$store.state.user.userImage || '';

      return excontrolApi
        .addEventsFlows(param)
        .then(res => res.data)
        .then(data => {
          this.searchWorkBench();
          this.lookdetail(this.activeItem);
          this.getEventsFlows();
        }).catch(action => {
          
        });
    },
    setChange() {
      if (this.activeItem.type == '重点人员') {
        this.setChangeRy();
      } else if (this.activeItem.type == '辖区事件') {
        this.setChangeShijian();
      }else if (this.activeItem.type == '视频巡查') {
      //  this.sxDescription;
      // this.spcxCurId;
      if(this.activeItem.id==undefined){
        this.$message({
          message: '请选择一个摄像机!',
          type: "warning"
        }); 
        return;
      }

      //修改预案
      let param = {};
      param.indexCode = this.spcxCurId;
      param.preplanId = this.spxcCurparentId;
      param.remarks = this.sxDescription;

      return shipinApi
        .modifyYuanCamera(param)
        .then(res => res)
        .then(data => {

          // //更新数据
          // this.searchTreeData();
          // this.closeYuanForm();
          // this.curNode = null; 
          // this.getSpjkZy();

          this.$refs.yuanTree.searchTreeData();

          this.getEventsFlows();
              

        });


     
      }
    },
    setChangeRy() {
      let param = {};
      param.id = this.activeItem.id;
      param.content = this.sxDescription;

      return excontrolApi
        .updateSxDesc(param)
        .then(res => res.data)
        .then(data => {
          this.addEventsFlows('修改了描述');
        }).catch(action => {
          
        });
    },
    setChangeShijian() {
      let param = {};
      param.id = this.activeItem.id;
      param.eventDes = this.sxDescription;

      return shijianApi
        .updateEvent(param)
        .then(res => res.data)
        .then(data => {
          this.addEventsFlows('修改了描述');
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
      param.itemType = this.activeItem.type;
      param.fileUrl = url;
      param.objectId = this.activeItem.id;
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
           //重新刷新tree
           var source=[];
           for (let i=0;i< this.fileList.length;i++) {
              if(this.fileList[i].resourceUrl!=url){
                source.push(this.fileList[i]);
              }
            }
           
           
            this.$refs.yuanTree.searchTreeData();
             this.fileList=source;
            console.log(this.fileList);

            this.getSpjkZy();
          
          }).catch(err => {
            
          });
    },

    getSpjkZy() {
      let param = {};
      param.cameraIndexCode = this.spcxCurId;
      // param.preplanId = this.activeItem.id;
      param.preplanId = this.spxcCurparentId;
      return excontrolApi
        .getSpjkZy(param)
        .then(res => res.data)
        .then(data => {
          // this.addEventsFlows('修改了描述');
          console.log(data);
          this.fileList=data.cameraPreplanResources;

        }).catch(action => {
          
        });
    },
    rejectBk(obj) {
      this.$confirm("确定驳回此布控申请？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        //驳回申请
        let param = {};
        param.spbh = this.activeItem.id;
        param.spjg = '02';
        param.spyj = this.spyjText;

        return excontrolApi
          .disposeApprove(param)
          .then(res => res.data)
          .then(data => {
            this.addEventsFlows('驳回了布控申请');
            this.isShowSideDetails = false;
          }).catch(action => {
            
          });
      })         
      .catch(() => {
          
      });
    },
    approveBk(obj) {
      this.$confirm("确定批准此布控申请？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        //批准申请
        let param = {};
        param.spbh = this.activeItem.id;
        param.spjg = '01';
        param.spyj = this.spyjText;

        return excontrolApi
          .disposeApprove(param)
          .then(res => res.data)
          .then(data => {
            this.addEventsFlows('批准了布控申请');
            this.isShowSideDetails = false;
          }).catch(action => {
            
          });
      })         
      .catch(() => {
          
      });
    },
    exportXjjl() {
      let param = {};
      param.userName = this.$store.getters.username;
      param.itemType = '视频巡查';
      param.beginTime = this.bbtime[0]+' 00:00:00';
      param.endTime = this.bbtime[1]+' 23:59:59';

      return shipinApi
        .exportYuanXjjl(param)
        .then(data => {
          this.downloadBd(data);
        });
    },
    downloadBd(data) {
      let blob = new Blob([data], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
          });
          // let url = new Blob([data],{type: 'application/vnd.ms-excel;charset=utf-8'});
          var downloadElement = document.createElement('a');
          var href = window.URL.createObjectURL(blob); //创建下载的链接
          downloadElement.href = href;
          downloadElement.download = this.$store.getters.username +'-视频巡查记录表-'+this.getFormatDateYear(new Date(),'YYYY.MM.DD')+'.xls'; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
    },
  }
};
</script>
<style scoped>
  .bl-content {
    /* min-height: calc(100vh - 130px); */
    height: calc(100vh - 130px);
    margin-bottom: 30px;
    position: relative;
    width: 100%;
    border: 1px solid #d9dfe5;
    box-sizing: border-box;
    background: #fff;
    padding: 10px 22px;
  }
  .model-hold {
    height: calc(100% - 100px);
    overflow: auto;
  }
  .tab-title {
    margin-top: 10px;
    height: 70px;
    border-bottom: 1px solid #e4e4e4;
  }
  .shixiang, .tixing {
    width: 300px;
    height: 60px;
    line-height: 60px;
    margin-right: 80px;
    display: inline-block;
  }
  .nol-border {
    display: block;
    width: calc(100% - 60px);
    height: 60px;
    line-height: 60px;
    float: left;
    border: 1px solid #e4e4e4;
    border-left: none;
  }
  .sx-active {
    border-color: #12b1e1;
    background-color: #F0F9FF;
  }
  .tx-active {
    border-color: #12e1b1;
    background-color: #E8FFFA;
  }
  .icon-shixiang,.icon-tixing {
    display: block;
    width: 60px;
    height: 60px;
    float: left;
    background: url(/static/image/home/shixiang.png);
    background-repeat: no-repeat;
    background-position: center;
    background-size: 36px auto;
    background-color: #12b1e1;
  }
  .icon-tixing {
    background: url(/static/image/home/tixing.png);
    background-repeat: no-repeat;
    background-position: center;
    background-size: 36px auto;
    background-color: #12e1b1;
  }
  .text-title {
    color: #333;
    font-size: 14px;
    font-family: "Microsoft YaHei Regular", "Microsoft YaHei";
    display: inline-block;
    width: 60px;
    height: 60px;
    margin-left: 15px;
    line-height: 60px;
    overflow: hidden;
  }
  .num-shixiang {
    float: right;
    margin:0 30px;
    color: #12b1e1;
    font-size: 20px;
    font-family: "Microsoft YaHei Bold", "Microsoft YaHei Regular", "Microsoft YaHei";
  }
  .num-tixing {
    float: right;
    margin:0 30px;
    color: #12e1b1;
    font-size: 20px;
    font-family: "Microsoft YaHei Bold", "Microsoft YaHei Regular", "Microsoft YaHei";
  }
  /* 按钮样式 */
.btn-info {
  background-color: #13b1e1;
  border: none;
  margin: 15px 20px 15px 0;
  font-size:12px;
}
.btn-info:hover {
  border: none;
  outline: none;
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
  margin:0 0 0 50px;
}
.gzt-search-btn {
  width:356px;
  float:right;
  margin-top: 10px;
}
.sel-group {
  width: 300px;
  height: 54px;
  line-height: 54px;
  position:relative;
  z-index:3;
}
.sel-btn {
  color: #12b1e1;
  cursor: pointer;
}
.complete-btn {
  width: 84px;
  text-align: center;
  height: 40px;
  line-height: 40px;
  display: inline-block;
  cursor: pointer;
} 
.complete-btn-active {
  color: #12b1e1;
  border-bottom: 3px solid #12b1e1;
}
.gzt-chk {
  padding-left: 6px;
}
.dbsx-container {
  border: 1px solid #D8DFE5;
  margin-top:20px;
  width: 100%;
  /* min-height: calc(100% - 104px); */
  height: calc(100% - 104px);
  position: relative;
}
.dbsx-item {
  display:flex;
  height:72px;
  margin-bottom:10px;
  background:#f2f2f2;
  color:#fff;
}
.dbsx-index {
  display:inline-block;
  width:30px;
  text-align:center;
  background: #12b1e1;
  border: 1px solid #12b1e1;
  border-right:none;
  height:72px;
  line-height:72px;
}
.dbsx-index-complete {
  background: #999;
  border: 1px solid #999;
}
.dbsx-content {
  border: 1px solid #D8DFE5;
  border-left:none;
  display:inline-block;
  width: calc(100% - 30px);
  height:72px;
  line-height: 36px;
  color: #333;
  padding-left: 15px;
  position: relative;
}
.dbsx-content-active {
  border-color: #12b1e1;
  background: #F5F8FB;
}
.dbsx-title {
  font-family: "Microsoft YaHei";
  font-weight: bold;
  width: calc(100% - 130px);
}
.dbsx-type {
  padding: 4px 6px;
  color: #fff;
  border-radius: 3px;
  font-weight: normal;
  margin-right:10px;
  background: #12b1e1;
  font-size: 12px;
}
.redColor {
  color: #ff0000;
  font-size: 12px;
}
.orangeColor {
  color: #FF9933;
  font-size: 12px;
}
.greenColor {
  color: #33cc00;
  font-size: 12px;
}
.redBgColor {
  background: #ff6666;
  font-size: 12px;
}
.orangeBgColor {
  background: #FF9933;
  font-size: 12px;
}
.greenBgColor {
  background: #1FCC9A;
  font-size: 12px;
}
.dbsx-info {
  font-size: 12px;
  color: #333;
  display: flex;
  justify-content: space-between;
  width: calc(100% - 130px);
}
.dbsx-more {
  position: absolute;
  right: 10px;
  top: 0px;
  display: inline-block;
  width: 32px;
  height: 72px;
  background: url(/static/image/home/more-right.png);
  background-position: center;
  background-repeat: no-repeat;
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
.detail-title h3 {
    vertical-align: middle;
    font-size: 14px;
    line-height: 28px;
    margin: 0;
    margin-right: 20px;
}
.detail-info-out {
    border: 1px solid #ddd;
    border-radius: 3px;
    box-shadow: 0 2px 2px #eee;
    color: #999;
    line-height: 18px;
    margin: 10px;
}
.detail-info {
  font-size: 12px;
  color: #333;
  display: flex;
  justify-content: space-between;
  width: calc(100% - 40px);
  height: 30px;
  line-height: 30px;
  margin: 10px 20px;
}
.detail-user {
    float: left;
    display: block;
    height: 32px;
    line-height: 32px;
    width: 33.3333%;
}
.detail-time {
    display: block;
    float: left;
    line-height: 32px;
    height: 32px;
    color: #999;
    width: 33.3333%;
}
.detail-txt {
    margin: 0 10px 10px;
    padding: 15px;
    min-height: 148px;
    border: #dbd9cb solid 1px;
    border-radius: 3px;
    font-size: 14px;
    line-height: 37px;
}
.detail-editors {
    padding: 0 10px;
    margin: 0 0 10px;
}
.detail-task-txtarea {
    width: 100%;
    line-height: 24px;
    font-size: 14px;
    color: #535353;
    border: #A7ABAE solid 1px;
    border-radius: 3px;
    resize: none;
}
.addsubtask .add-icon {
    float: left;
    width: 36px;
    height: 36px;
    border-right: #eee solid 1px;
    border-radius: 5px 0 0 5px;
    background: #fff;
    text-align: center;
}
.addsubtask .add-form {
    margin: 0 0 0 38px;
    padding: 0 10px;
    height: 36px;
    border-left: #eee solid 1px;
    border-radius: 0 5px 5px 0;
    background: #fff;
}
.detail-subtasks {
    margin: 0 10px 15px;
    box-shadow: 0 2px 2px #eee;
    border: #A7ABAE solid 1px;
    border-radius: 3px;
}
.detail-operate {
  display: flex;
  margin: 0 20px;
  padding-left:40px;
}
.upload-btn {
  width: 80px;
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
  width: 310px;
  padding-top: 5px;
  height: calc(100% + 40px);
}
.content-right {
  width: calc(100% - 310px);
}
.flexEnd {
  justify-content: flex-end;
}
.scbb {
  height: 46px;
  line-height: 46px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.scbb-select {
  height: 30px;
  line-height: 30px;
}
</style>
