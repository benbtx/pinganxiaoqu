<template>
<div class="content-body add-control">
    <div class="page-bread">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/zhinenggaojing/bukongguanli'}">布控管理</el-breadcrumb-item>
        <el-breadcrumb-item>新增人员布控</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-row">
      <div class="bl-content" :class="{heightAuto: bkbdshow}">
        <div id="stepsdiv">
          <el-steps :active="active" align-center>
            <el-step title="布控对象"></el-step>
            <el-step title="布控范围"></el-step>
            <el-step title="基本信息"></el-step>
            <el-step title="生成布控表单"></el-step>
          </el-steps>
        </div>
        <!-- 布控对象首页 -->
        <div v-show="bkdxshow" class="bukong-base">
          <div class="dwdasearchdiv">
            <div class="searchbj">
              <div class="searchitembig">
                <div class="tiaojiandiv" @click="showManObj">
                  <div class="tjicondiv">
                    <i class="avatar-uploader-icon identity-face"></i>
                    <span style="font-size:16px">单人布控</span>
                  </div>
                </div>
                <button type="button" class="btn btn-info btn-margin" @click="showManObj">单人布控</button>
              </div>
            </div>

            <div class="searchbj">
              <div class="searchitembig">
                <div class="tiaojiandiv" @click="showMingdanObj">
                  <div class="tjicondiv">
                    <i class="avatar-uploader-icon identity-mingdan"></i>
                    <span style="font-size:16px">名单布控</span>
                  </div>
                </div>
                <button type="button" class="btn btn-info btn-margin" @click="showMingdanObj">名单布控</button>
              </div>
            </div>

            <div class="searchbj">
              <div class="searchitem">
                <el-upload class="avatar-uploader" action="#" ref="uploadfilepl" :show-file-list="false" :auto-upload="false" :on-change='plchangeUpload' accept=".xls,.xlsx" drag>
                  <div class="avatar-uploader-idiv">
                    <i class="avatar-uploader-icon identity-batch"></i>
                    <div v-if="plfileUrl" class="avatar-uploader-p" style="font-size:16px">
                      {{plfileUrlname}}
                      <div class="face-modal"></div>
                    </div>
                    <p v-else>
                      <span style="font-size:16px">上传附件</span>
                    </p>
                  </div>
                  <label class="el-upload-list__item-status-label" v-show="pldeleteshow">
                  <span class="re-upload">重新上传</span>
                  </label>
                </el-upload>
                <el-button type="text" @click="downlexcellist()" class="btn-muban">模板下载</el-button>
                <button type="button" class="btn btn-info btn-margin-muban" @click="piliangbukong">批量</button>
              </div>
            </div>
          </div>
        </div>
        <!-- 单人布控 -->
        <div v-show="drbkshow" class="bukong-item">    
          <div class="upload-group">
            <div class="btn-toggle fa fa-chevron-left fl" @click="prevPic"></div>
            <div class="upload-div">
              <div class="upload-imgs" id="manpics">
                <div class="picture-hold">
                  <div class="pic-wrap">
                    <el-upload action class="avatar-uploader" :show-file-list="false" :auto-upload="false" :on-change="readManImage" :before-upload="beforeAvatarUpload" accept="image/jpeg,image/png">
                      <i  v-if="imageUrl.url" class="clear-pic fa fa-times-circle-o" @click.stop="clearImg"></i>
                      <i class="rx-icon defaul-sym" style="font-size:30px"></i>
                      <p class="up-text">上传图片</p>
                      <img v-if="imageUrl.url" :src="imageUrl.url" class="avatar">
                    </el-upload>
                  </div>
                </div>
                <div class="picture-hold">
                  <div class="pic-wrap">
                    <el-upload action class="avatar-uploader" :show-file-list="false" :auto-upload="false" :on-change="readManImage2" accept="image/jpeg,image/png">
                      <i  v-if="imageUrl2.url" class="clear-pic fa fa-times-circle-o" @click.stop="clearImg(2)"></i>
                      <i class="rx-icon defaul-sym" style="font-size:30px"></i>
                      <p class="up-text">上传图片</p>
                      <img v-if="imageUrl2.url" :src="imageUrl2.url" class="avatar">
                    </el-upload>
                  </div>
                </div>
                <div class="picture-hold">
                  <div class="pic-wrap">
                    <el-upload action class="avatar-uploader" :show-file-list="false" :auto-upload="false" :on-change="readManImage3" accept="image/jpeg,image/png">
                      <i  v-if="imageUrl3.url" class="clear-pic fa fa-times-circle-o" @click.stop="clearImg(3)"></i>
                      <i class="rx-icon defaul-sym" style="font-size:30px"></i>
                      <p class="up-text">上传图片</p>
                      <img v-if="imageUrl3.url" :src="imageUrl3.url" class="avatar">
                    </el-upload>
                  </div>
                </div>
                <div class="picture-hold">
                  <div class="pic-wrap">
                    <el-upload action class="avatar-uploader" :show-file-list="false" :auto-upload="false" :on-change="readManImage4" accept="image/jpeg,image/png">
                      <i  v-if="imageUrl4.url" class="clear-pic fa fa-times-circle-o" @click.stop="clearImg(4)"></i>
                      <i class="rx-icon defaul-sym" style="font-size:30px"></i>
                      <p class="up-text">上传图片</p>
                      <img v-if="imageUrl4.url" :src="imageUrl4.url" class="avatar">
                    </el-upload>
                  </div>
                </div>
                <div class="picture-hold">
                  <div class="pic-wrap">
                    <el-upload action class="avatar-uploader" :show-file-list="false" :auto-upload="false" :on-change="readManImage5" accept="image/jpeg,image/png">
                      <i  v-if="imageUrl5.url" class="clear-pic fa fa-times-circle-o" @click.stop="clearImg(5)"></i>
                      <i class="rx-icon defaul-sym" style="font-size:30px"></i>
                      <p class="up-text">上传图片</p>
                      <img v-if="imageUrl5.url" :src="imageUrl5.url" class="avatar">
                    </el-upload>
                  </div>
                </div>
                <div class="picture-hold">
                  <div class="pic-wrap">
                    <el-upload action class="avatar-uploader" :show-file-list="false" :auto-upload="false" :on-change="readManImage6" accept="image/jpeg,image/png">
                      <i  v-if="imageUrl6.url" class="clear-pic fa fa-times-circle-o" @click.stop="clearImg(6)"></i>
                      <i class="rx-icon defaul-sym" style="font-size:30px"></i>
                      <p class="up-text">上传图片</p>
                      <img v-if="imageUrl6.url" :src="imageUrl6.url" class="avatar">
                    </el-upload>
                  </div>
                </div>
                <div class="picture-hold">
                  <div class="pic-wrap">
                    <el-upload action class="avatar-uploader" :show-file-list="false" :auto-upload="false" :on-change="readManImage7" accept="image/jpeg,image/png">
                      <i  v-if="imageUrl7.url" class="clear-pic fa fa-times-circle-o" @click.stop="clearImg(7)"></i>
                      <i class="rx-icon defaul-sym" style="font-size:30px"></i>
                      <p class="up-text">上传图片</p>
                      <img v-if="imageUrl7.url" :src="imageUrl7.url" class="avatar">
                    </el-upload>
                  </div>
                </div>
                <div class="picture-hold">
                  <div class="pic-wrap">
                    <el-upload action class="avatar-uploader" :show-file-list="false" :auto-upload="false" :on-change="readManImage8" accept="image/jpeg,image/png">
                      <i  v-if="imageUrl8.url" class="clear-pic fa fa-times-circle-o" @click.stop="clearImg(8)"></i>
                      <i class="rx-icon defaul-sym" style="font-size:30px"></i>
                      <p class="up-text">上传图片</p>
                      <img v-if="imageUrl8.url" :src="imageUrl8.url" class="avatar">
                    </el-upload>
                  </div>
                </div>
                <div class="picture-hold">
                  <div class="pic-wrap">
                    <el-upload action class="avatar-uploader" :show-file-list="false" :auto-upload="false" :on-change="readManImage9" accept="image/jpeg,image/png">
                      <i  v-if="imageUrl9.url" class="clear-pic fa fa-times-circle-o" @click.stop="clearImg(9)"></i>
                      <i class="rx-icon defaul-sym" style="font-size:30px"></i>
                      <p class="up-text">上传图片</p>
                      <img v-if="imageUrl9.url" :src="imageUrl9.url" class="avatar">
                    </el-upload>
                  </div>
                </div>
              </div>
            </div>
            <div class="btn-toggle fa fa-chevron-right fr" @click="nextPic"></div>
          </div>
          <el-form :model="ruleForm" :rules="rydxrule" ref="ruleFormrydx" label-width="114px" :inline="true" style="width:600px;margin:0px auto;">
            <el-form-item label="姓名：" prop="bkxm">
              <el-input  v-model="ruleForm.bkxm"  style="width:420px"></el-input>
            </el-form-item>
            <el-form-item label="证件类型：" prop="bkzjlx">
              <el-select v-model="ruleForm.bkzjlx"  style="width:420px" placeholder="请选择">
                <el-option value="0" label="未知"></el-option>
                <el-option value="1" label="身份证"></el-option>
                <el-option value="2" label="警官证"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="证件号：" prop="bkzjh">
              <el-input  v-model="ruleForm.bkzjh"  style="width:420px"></el-input>
            </el-form-item>
            <el-form-item label="电话：" prop="bkdh">
              <el-input  v-model="ruleForm.bkdh"  style="width:420px"></el-input>
            </el-form-item>
            <el-form-item label="户籍地：" prop="bkhjd">
              <el-input  v-model="ruleForm.bkhjd"  style="width:420px"></el-input>
            </el-form-item>
          </el-form> 
          <div class="footer-group">
            <button type="button" class="btn btn-info btnmargin" @click="backshowbkdx">取消</button>
            <button type="button" class="btn btn-info" @click="nextshowbkfw">下一步</button>
          </div>
        </div>
        <!-- 名单布控 -->
        <div v-show="mdbkshow">名单布控</div>
        <!-- 布控范围 -->
        <div v-show="bkfwshow" style="height: calc(100% - 160px)">
          <div class="bk-content">
            <div class="content-left">
              <p class="tree-title">布控范围</p>
              <shebei-tree ref="shebeitree" :addtype="addtype" :cakoudefault="[]" showType="addcontrol"></shebei-tree>
            </div>
            <div class="content-right">
              <baidu-map :showKaKouTool="showKaKouTool" :addtype="addtype"></baidu-map>
            </div>
          </div>
          <div class="footer-group">
            <button type="button" class="btn btn-info btnmargin" @click="backshowdrbk">上一步</button>
            <button type="button" class="btn btn-info" @click="nextshowjbxx">下一步</button>
          </div>
        </div>
        <!-- 布控基本信息 -->
        <div v-show="jbxxshow">
          <div class="bukong-item">
            <p class="title"><i class="fa fa-bookmark" style="color:#12B1E1"></i> 基本信息</p>
            <el-form :model="ruleForm" :rules="xxrule" ref="ruleFormxx" label-width="150px" :inline="true" style="width:700px;margin:20px auto;">
              <el-form-item label="布控名称：" prop="bkmc">
                <el-input  v-model="ruleForm.bkmc" style="width:520px"></el-input>                                       
              </el-form-item>
              <el-form-item label="布控发起人：" prop="bkfqr">
                <el-input  v-model="ruleForm.bkfqr" style="width:520px"></el-input>                    
              </el-form-item>
              <el-form-item label="布控单位：" prop="bkdw">
                <el-input  v-model="ruleForm.bkdw" style="width:520px"></el-input>                    
              </el-form-item>
              <el-form-item label="布控时间：" prop="ckedbksjrange">
                <el-date-picker v-model="ruleForm.ckedbksjrange" unlink-panels type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:520px" :picker-options="datepickerlimit" value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="阈值（%）：" prop="bkyz" style="height: auto;">
                <el-row v-for='(item, index) in ruleForm.bkyz' v-bind:key='item.id'>
                  <el-input v-model="item.thresholdMin" style="width:150px"></el-input>
                  <el-time-picker
                    v-model="item.startPeriod"
                    format="HH:mm"
                    value-format="HH:mm"
                    style="width:150px;margin: 0 5px;"
                    placeholder="任意时间点">
                  </el-time-picker>
                  <el-time-picker
                    v-model="item.endPeriod"
                    format="HH:mm"
                    value-format="HH:mm"
                    style="width:150px;"
                    placeholder="任意时间点">
                  </el-time-picker>
                  <span class="btn-yuzhi del-yuzhi" v-if="(index!=0) || (ruleForm.bkyz.length!=1)" @click="ruleForm.bkyz.splice(index, 1)"></span>
                  <span class="btn-yuzhi add-yuzhi" v-if="(index+1) == ruleForm.bkyz.length" @click="addBkyz"></span>
                </el-row>
                <span class="warn-yuzhi">分时段阈值，让预警更精确，最多可设置5个时间段！</span>
              </el-form-item>
              <el-form-item label="布控原因：" prop="bkyy">
                <el-input  type="textarea" v-model="ruleForm.bkyy" style="width:520px;height:80px;margin:4px 0;"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="footer-group" style="margin-top:50px;">
            <button type="button" class="btn btn-info btnmargin" @click="backshowbkfw">上一步</button>
            <button type="button" class="btn btn-info" @click="nextshowbkbd">下一步</button>
          </div>
        </div>
        <!-- 布控表单生成 -->
        <div v-show="bkbdshow">
          <div style="width:650px;margin:30px auto;border:1px solid #ccc;">
            <bk-details :bkdetaildata="ruleForm" :addtype="addtype" :imgUrl="imageUrl.url" :selectedKakou="selectNode"></bk-details> 
          </div>         
          <div class="footer-group">
            <button type="button" class="btn btn-info btnmargin" @click="backshowjjxx">上一步</button>
            <button type="button" class="btn btn-info" @click="controladdcommit">提交</button>
            <!-- <button type="button" class="btn btn-info" @click="cancelbk">取消</button> -->
          </div>
        </div>
      </div>

    </div>

  </div>

</template>

<script>
// import { controlApi } from "@/http";
// import { mapState} from "vuex";
import ShebeiTree from "@/components/Control/ShebeiTree";
import Bkdetails from "@/components/Control/Bkdetails";
// import Clpps from "@/constants/carpinpai.json";
import { excontrolApi } from "@/https";
import eventBus from '@/event';
import { eventCollection } from '@/event/resources';
import baidumap from '@/components/baidumap/mapInit';


export default {
  name: "addrycontrol",
  data() {
    var validateChepai = (rule, value, callback) => {
      if (!this.imageUrl.url && value == '') {
        callback(new Error('请上传车像或者填写车牌号！'));
      } else {
        callback();
      }
    };
    var validateSfz = (rule, value, callback) => {
      if (!this.imageUrl.url && value == '') {
        callback(new Error('请上传人像或者填写身份证号！'));
      } else {
        callback();
      }
    };
    var validateZjh = (rule, value, callback) => {
      if (this.ruleForm.bkzjlx == '1') {
        if ( !(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/).test(value) ) {
          callback(new Error('请填写正确的身份证号！'));          
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var validateBkyz = (rule, value, callback) => {
      let err = 0;
      for (var i=0;i<value.length;i++) {
        if (value[i].thresholdMin>0 && value[i].thresholdMin<100) {
          if (value[i].startPeriod>value[i].endPeriod) {
            callback(new Error('开始时间必须小于结束时间！')); 
          }
          if (i>1 && value[i].startPeriod<value[i-1].endPeriod) {
            callback(new Error('时间段不能重复！')); 
          }
          continue;
        } else {
          err++;
        }
      }

      if (err==0) {
         callback();
      } else {
        callback(new Error('请正确填写阈值！(0-100的整数)'));   
      }
    };
    var validateTimerange = (rule, value, callback) => {
      if (this.str2DataTime(value[0]) < Date.now()) {
        callback(new Error('开始时间必须大于当前时间！'));
      } else {
        callback();
      }
    };
    
    return {
      showKaKouTool:true,
      //控制步骤条显示
      active: 0,
      //控制完善布控对象信息的显示
      bkdxshow: true,
      //控制布控范围的显示
      bkfwshow: false,
      //控制完善基本信息的显示
      jbxxshow: false,
      bkbdshow: false,
      //批量文件上传url
      plfileUrl: '',
      plfileUrlname: '',
      //批量文件删除
      pldeleteshow: false,
      drbkshow: false,
      mdbkshow: false,
      addtype: '',
      imageUrl: {},
      imageUrl1: {},
      imageUrl2: {},
      imageUrl3: {},
      imageUrl4: {},
      imageUrl5: {},
      imageUrl6: {},
      imageUrl7: {},
      imageUrl8: {},
      imageUrl9: {},
      controladdinfo: [{
          alarmDetails: [
            {
              "endPeriod":"",
              "startPeriod":"",
              "thresholdMin":"" 
            }
          ],
          base64: "",
          disposition: {
            applicantInfo: "",
            applicantName: "",
            applicantOrg: "",
            beginTime: "",//布控开始时间
            endTime: "",//布控结束时间
            creatTime: "",//布控创建时间
            dispositionArea: "",
            dispositionCategory: "",
            dispositionID: "",
            dispositionRange: "",//1卡口，2区域布控
            operateType: "0",//默认填0
            reason: "",
            receiveMobile: "",
            title: "",
            tollgateList: '' //卡口id，字符串用;隔开
          },
          sprlb: [  //审批人列表
            // {
            //   deptCode: '',
            //   deptName: '',
            //   type: '',
            //   userCode: '',
            //   userName: ''
            // }
          ],
          targetFeature:{
            name:"",
            credentialsType:"",
            credentialsNum:"",
            phone:"",
            register:"",
            plateNo:"",
            brand:"",
            plateColor:"",
            vehicleColor:"",
            sex: 0
          }
      }],
      ruleForm: {
        bkbh:'',
        bkmc: '',
        bkfqr: '',
        //选择的布控时间范围
        ckedbksjrange: [this.getFormatDate(Date.now()), this.getFormatDate(Date.now()+24*60*60*1000)],
        bkyy:"",
        bkyz: [{
          "endPeriod":"23:59",
          "startPeriod":"00:00",
          "thresholdMin":"" 
        }],
        bkxm: '',
        bklx:'',
        bkzjh: '',
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
      },
      uploadForm:null,
      showSelcarpp: false,
      cpys: this.getCpysList(),
      clys: this.getClysList(),
      clpps: [],
      scroll: '',
      //限制日期选择范围
      datepickerlimit: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      xxrule: {
        bkmc: [
          {
            required: true,
            message: "布控名称不能为空！",
            trigger: "blur"
          },
          {
            pattern:/^[\u4E00-\u9FA5A-Za-z0-9_-]+$/,
            message: '布控名称只能包含中文、英文、数字、_、-！'
          },
          {
            max: 32,
            message: "最多输入32个字符！",
            trigger: "blur"
          }
        ],
        bkyz: [
          {
            required: true,
            trigger: "blur"
          },
          { validator: validateBkyz, trigger: 'blur' }
        ],
        bkfqr: [
          {
            required: true,
            message: "布控发起人不能为空！",
            trigger: "blur"
          },
          {
            pattern:/^[\u4E00-\u9FA5A-Za-z\.]+$/,
            message: '请输入正确的姓名！' 
          },
          {
            max: 32,
            message: "最多输入32个字符！",
            trigger: "blur"
          }
        ],
        ckedbksjrange: [
          { validator: validateTimerange, trigger: 'change' },
        ],
        bkyy:[
          {
            required: true,
            message: "布控原因不能为空！",
            trigger: "change"
          },
          {
            pattern:/[\u4E00-\u9FA5A-Za-z0-9]+/,
            message: '布控原因不能只包含特殊字符！'
          },
          {
            max: 64,
            message: "最多输入64个字符！",
            trigger: "blur"
          }
        ]
      },
      rydxrule: {
        bkxm: [
          {
            required: true,
            message: "姓名不能为空！",
            trigger: "blur"
          },
          {
            pattern:/^[\u4E00-\u9FA5A-Za-z]+$/,
            message: '请输入正确的姓名！' 
          }
        ],
        bkzjlx: [
          {
            required: true,
            message: "请选择证件类型！",
            trigger: "change"
          }
        ],
        bkzjh: [
          {
            required: true,
            message: "证件号不能为空！",
            trigger: "change"
          },
          { validator: validateZjh, trigger: 'blur' },
        ],
        bksfz: [
          { validator: validateSfz, trigger: 'blur' },
          {
            pattern:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
            message: '身份证格式不正确！' 
          }
        ],
      },
      cldxrule: {
        bkcl: [
          { validator: validateChepai, trigger: 'blur' },
          {
            pattern:/([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})/,
            message: '车牌格式不正确！' 
          }
        ],
      },
      selectshebei: [],
      selectNode: [],
      localName: {},
    };
  },
  created() {
    this.addtype = this.$route.meta.addtype;
    // 初始化 better-scroll 必须要等 dom 加载完毕
    // setTimeout(() => {
    //   this._initSrcoll();
    // }, 20);
    eventBus.$on(eventCollection.EXCONTROL_GET_SELECTED_SHEBEI, (value, node) => {
        this.selectshebei = value;
        this.selectNode = node;        
    });
    eventBus.$on(eventCollection.EXCONTROL_GET_SELECTED_LOCALNAME, value => {
        this.localName = value;    
    });
    this.clpps = JSON.parse(localStorage.getItem('clpplist')) || [];
  },
  mounted() {
    // this.getbkId();
  },
  components: {
    "shebei-tree": ShebeiTree,
    "bk-details": Bkdetails,
    'baidu-map':baidumap
  },
  computed: {
    shortcutList () {
     return this.clpps.map((group) => {
      return group.title.substr(0, 1);
     })
    }
  },
  methods: {
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
    //批量布控模板下载
    downlexcellist: function() {
      if (this.typename == '布控') {
        return controlApi.ctrmodedownloadApil().then(data => {
          if (!data) {
            this.$message({
              message: '模板下载异常',
              type: 'warning'
            });
            return;
          }
          let blob = new Blob([data], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
          });
          // let url = new Blob([data],{type: 'application/vnd.ms-excel;charset=utf-8'});
          var downloadElement = document.createElement('a');
          var href = window.URL.createObjectURL(blob); //创建下载的链接
          downloadElement.href = href;
          downloadElement.download = '批量布控导入模板.xls'; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
        });
      } else if (this.typename == '落查') {
        return controlApi.ctrlcmodedownloadApil().then(data => {
          if (!data) {
            this.$message({
              message: '模板下载异常',
              type: 'warning'
            });
            return;
          }
          let blob = new Blob([data], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
          });
          // let url = new Blob([data],{type: 'application/vnd.ms-excel;charset=utf-8'});
          var downloadElement = document.createElement('a');
          var href = window.URL.createObjectURL(blob); //创建下载的链接
          downloadElement.href = href;
          downloadElement.download = '批量落查导入模板.xlsx'; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
        });
      }
    },
    //文件上传预览
    plchangeUpload(file) {
      if (file) {
        let Xls = file.name.split('.');
        let index = Xls.length - 1;
        if (Xls[index] === 'xls' || Xls[index] === 'xlsx') {
          this.plfileUrlname = file.name;
          this.plfileUrl = file.raw;
          this.pldeleteshow =true;
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
    //批量布控
    piliangbukong: function() {
      if (!this.plfileUrl) {
        this.$message.error('请先上传需批量处理的名单');
        return;
      } else {
        this.$emit('piliangdaoru', this.plfileUrl, this.plfileUrlname);
      }
    },
    getbkId:function(){
      return new Promise((resolve, reject) => {
        excontrolApi
          .excontrolGetBkID()
          .then(res => res)
          .then(data => {
              this.ruleForm.bkbh = data.data;     
              resolve();
          })
        }).catch(error => {
          reject(error)
        })
    },
    showManObj() {
      this.bkdxshow = false;
      this.drbkshow = true;
    },
    showMingdanObj() {
      this.bkdxshow = false;
      this.mdbkshow = true;
    },
    //上一步、下一步等显示的控制
    backbkgl: function() {
      this.$router.push({ path: '/zhinenggaojing/bukongguanli' });
    },
    nextshowbkfw() {
      let _this= this;
      _this.$refs["ruleFormrydx"].validate(valid => {
        if (valid) {
          this.active = 1;
          this.bkfwshow = true;
          this.drbkshow = false;
        } else {
          _this.$message({
            message: "请按提示输入必填项",
            type: "warning"
          });
        }
      });
    },
    backshowbkdx: function() {
      this.active = 0;
      this.bkdxshow = true;
      this.bkfwshow = false;
      this.drbkshow = false;
    },
    backshowdrbk() {
      this.active = 1;
      this.bkdxshow = false;
      this.drbkshow = true;
      this.bkfwshow = false;
    },
    nextshowjbxx: function() {
      if (this.$refs.shebeitree.checkSelData()) {
        this.active = 2;
        this.bkfwshow = false;
        this.jbxxshow = true;
      }
    },
    backshowbkfw: function() {
      this.active = 1;
      this.bkfwshow = true;
      this.jbxxshow = false;
    },
    nextshowbkbd: function() {
      let _this = this;
      if (this.str2DataTime(this.ruleForm.ckedbksjrange[0]) < Date.now()) {
        this.ruleForm.ckedbksjrange[0] = this.getFormatDate(Date.now()+30000);
      }
      if (this.str2DataTime(this.ruleForm.ckedbksjrange[1]) < Date.now()) {
        this.ruleForm.ckedbksjrange[1] = this.getFormatDate(Date.now()+30000);
      }

      _this.$refs["ruleFormxx"].validate(valid => {
        if (valid) {
          this.active = 3;
          this.bkbdshow = true;
          this.jbxxshow = false;
        } else {
          _this.$message({
            message: "请按提示输入必填项",
            type: "warning"
          });
        }
      });
    },
    backshowjjxx: function() {
      this.active = 2;
      this.bkbdshow = false;
      this.jbxxshow = true;
    },
    //取消布控事件
    cancelbk: function() {
      this.active = 0;
      this.bkdxshow = true;
      this.bkfwshow = false;
      this.bkbdshow = false;
      this.imageUrl = {};
      this.controladdinfo[0].sprlb = [];
      this.$refs["ruleFormxx"].resetFields();
      this.$refs["ruleFormrydx"].resetFields();
      this.$refs.shebeitree.resetChecked();
    },
    controladdcommit: function() {
      if (!this.localName.userName) {
        this.$message({
          message: "请选择审批人",
          type: "warning"
        });

        return false;
      }
        // 图片转base64编码
        let imgLink = this.imageUrl;
        
        if (imgLink.url) {
          let tempImage = new Image();
          tempImage.src = imgLink.url;
          // tempImage.type = imgLink.raw.type;
          tempImage.crossOrigin = "*";
          this.controladdinfo[0].base64 = this.getBase64Image(tempImage).replace('data:image/jpeg;base64,', '');
        } else {
           this.controladdinfo[0].base64 = "";
        }
   
        this.controladdinfo[0].disposition.title = this.ruleForm.bkmc;   //布控名称
        this.controladdinfo[0].disposition.applicantName = this.ruleForm.bkfqr;   //发起人
        this.controladdinfo[0].disposition.applicantOrg = this.ruleForm.bkdw;   //布控单位
        if (this.str2DataTime(this.ruleForm.ckedbksjrange[0]) < Date.now()) {
          this.ruleForm.ckedbksjrange[0] = this.getFormatDate(Date.now()+30000);
        }
        if (this.str2DataTime(this.ruleForm.ckedbksjrange[1]) < Date.now()) {
          this.ruleForm.ckedbksjrange[1] = this.getFormatDate(Date.now()+30000);
        }
        this.controladdinfo[0].disposition.beginTime = this.str2DataTime(this.ruleForm.ckedbksjrange[0]);//布控开始时间
        this.controladdinfo[0].disposition.endTime = this.str2DataTime(this.ruleForm.ckedbksjrange[1]);//布控结束时间  
        this.controladdinfo[0].disposition.dispositionRange = 1;   //"布控范围",1卡口，2区域布控
        this.controladdinfo[0].disposition.operateType = 0;  //默认填0
        this.controladdinfo[0].disposition.reason = this.ruleForm.bkyy;  //布控原因
        this.controladdinfo[0].disposition.dispositionCategory =  2;  //"布控类别";

        this.controladdinfo[0].targetFeature.name =  this.ruleForm.bkxm; 
        this.controladdinfo[0].targetFeature.credentialsType =  this.ruleForm.bkzjlx;
        this.controladdinfo[0].targetFeature.credentialsNum =  this.ruleForm.bkzjh;
        this.controladdinfo[0].targetFeature.phone =  this.ruleForm.bkdh; 
        this.controladdinfo[0].targetFeature.register =  this.ruleForm.bkhjd; 

        this.controladdinfo[0].disposition.tollgateList = this.selectshebei.join(';'); //卡口id数组，用;隔开
        this.controladdinfo[0].disposition.dispositionArea = this.selectNode.join(';'); //卡口名称
        
        this.controladdinfo[0].alarmDetails = [];
        for (let i=0;i<this.ruleForm.bkyz.length;i++) {
          let bkyz = {};
          bkyz.startPeriod = this.ruleForm.bkyz[i].startPeriod;
          bkyz.endPeriod = this.ruleForm.bkyz[i].endPeriod;
          bkyz.thresholdMin = this.ruleForm.bkyz[i].thresholdMin / 100;
          this.controladdinfo[0].alarmDetails.push(bkyz);
        }   
        if (this.localName.userName) {
          this.controladdinfo[0].sprlb.push(this.localName);
        }

      let _this = this;
      _this.getbkId().then(function() {
        _this.controladdinfo[0].disposition.dispositionID = _this.ruleForm.bkbh;  //布控编码
        return excontrolApi
          .excontroladdBkSubmit(_this.controladdinfo)
          .then(res => res.data)
          .then(data => {
            // loading.close();
            _this.$confirm("提交成功", "提示", {
              cancelButtonText: "返回首页",
              confirmButtonText: "继续布控",
              type: "success"
            }).then(() => {
              _this.cancelbk();
            }
            ).catch(action => {
              if (action == 'cancel') {
                _this.backbkgl();
              }
            })
          });      
      });
    },
    readManImage: function(file) {
      this.imageUrl = file;
      this.imageUrl.url = URL.createObjectURL(file.raw);
    },
    // readCheImage: function(file) {
    //   this.imageUrl = file;
    //    this.imageUrl.url = URL.createObjectURL(file.raw);
    // },
    // _initSrcoll () {
    //   this.scroll = new BScroll(this.$refs.listView, {
    //   // 获取 scroll 事件，用来监听。
    //     probeType: 3
    //   });
    // },
    // showSelClpp() {
    //   this.showSelcarpp = !this.showSelcarpp;
    // },
    // selCarpinpai(id, label) {
    //   this.ruleForm.bkcxid = id;
    //   this.ruleForm.bkcx = label;
    //   this.showSelcarpp = !this.showSelcarpp;
    // },
    // selCarPlateColor(vId) {
    //   let obj = {};      
    //   obj = this.cpys.find((item)=>{   
    //     return item.value === vId;
    //   });  
    //    
    //   this.ruleForm.cpysText = obj.label;
    // },
    // selCarColor(vId) {
    //   let obj = {};      
    //   obj = this.clys.find((item)=>{   
    //     return item.value === vId;
    //   });  
    //    
    //   this.ruleForm.clysText = obj.label;
    // },
    // gotoPosition(e) {
    //   // 获取到绑定的 index
    //   let index = e.target.getAttribute('data-index');
    //   this.$refs.listView.scrollTop = this.$refs.listGroup[index].offsetTop - 5;
    // },
    clearImg(idx) {
      if (idx == 1) {
        this.imageUrl1 = {};
      } else if (idx == 2) {
        this.imageUrl2 = {};
      } else if (idx == 3) {
        this.imageUrl3 = {};
      } else if (idx == 4) {
        this.imageUrl4 = {};
      } else if (idx == 5) {
        this.imageUrl5 = {};
      } else if (idx == 6) {
        this.imageUrl6 = {};
      } else if (idx == 7) {
        this.imageUrl7 = {};
      } else if (idx == 8) {
        this.imageUrl8 = {};
      } else if (idx == 9) {
        this.imageUrl9 = {};
      } else {
        this.imageUrl = {};
      }
      
      return false;
    },
    prevPic() {
      let ele = document.getElementById('manpics');
      let mleft = ele.style['margin-left'] || 0;
      let curleft = parseInt(mleft) + 480;
      if (curleft > 0) {
        curleft = 0;
        this.$message({
          showClose: true,
          message: '已经是第一页了'
        });
      }
      ele.style['margin-left'] = curleft + 'px'; 
    },
    nextPic() {
      let ele = document.getElementById('manpics');
      let mleft = ele.style['margin-left'] || 0;
      let curleft = parseInt(mleft) - 480;
      if (curleft < -1000) {
        curleft = -960;
        this.$message({
          showClose: true,
          message: '已经是最后一页了'
        });
      }
      ele.style['margin-left'] = curleft + 'px'; 
    },
    readManImage1: function(file) {
      this.imageUrl1 = file;
      this.imageUrl1.url = URL.createObjectURL(file.raw);
    },
    readManImage2: function(file) {
      this.imageUrl2 = file;
      this.imageUrl2.url = URL.createObjectURL(file.raw);
    },
    readManImage3: function(file) {
      this.imageUrl3 = file;
      this.imageUrl3.url = URL.createObjectURL(file.raw);
    },
    readManImage4: function(file) {
      this.imageUrl4 = file;
      this.imageUrl4.url = URL.createObjectURL(file.raw);
    },
    readManImage5: function(file) {
      this.imageUrl5 = file;
      this.imageUrl5.url = URL.createObjectURL(file.raw);
    },
    readManImage6: function(file) {
      this.imageUrl6 = file;
      this.imageUrl6.url = URL.createObjectURL(file.raw);
    },
    readManImage7: function(file) {
      this.imageUrl7 = file;
      this.imageUrl7.url = URL.createObjectURL(file.raw);
    },
    readManImage8: function(file) {
      this.imageUrl8 = file;
      this.imageUrl8.url = URL.createObjectURL(file.raw);
    },
    readManImage9: function(file) {
      this.imageUrl9 = file;
      this.imageUrl9.url = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isLt10M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isLt10M;
    },
    addBkyz() {
      let endtime = this.ruleForm.bkyz[this.ruleForm.bkyz.length-1].endPeriod;
      if (this.ruleForm.bkyz.length < 5 && this.endTimeIsNotMax(endtime)) {
        this.ruleForm.bkyz.push({
          "endPeriod": "23:59",
          "startPeriod": endtime,
          "thresholdMin": ""
        });
      } else {
        this.$alert('最多可设置5个时间段并且结束时间不能大于23:59!', '提示', {
          confirmButtonText: '确定'
        });
      }
    },
    endTimeIsNotMax(time) {
      let arr = time.split(':');
      let curTime = parseInt(arr[0])*60 + parseInt(arr[1]);
      let maxTime = 23*60 + 59;

      return curTime <　maxTime;
    }
  }
};
//设置默认的日期范围
function setinitbkdate() {
  let myDate = new Date();
  //获取当前年
  let year = myDate.getFullYear();
  //获取当前月
  let month = myDate.getMonth() + 1;
  //获取当前日
  let date = myDate.getDate();
  let now = year + "-" + month + "-" + date + ' 00:00:00';
  //获取当前年的后一年
  let lastyear = year + 1;
  let endtime = lastyear + "-" + month + "-" + date + ' 23:59:59';
  let datainitrange = [now, endtime];
  return datainitrange;
}
//手机号检测
function istelNo(str)
{
    return /(^[^>|\d]((13[0-9])|(14[5,7,9])|(15[4])|(18[0-9])|(17[0,1,3,5,6,7,8]))\d{8})/g.test(
    str
  );
}
</script>
<style>
input[type="file"] {
  display: none;
}
</style>
<style scoped>
.add-control {
  height: calc(100% - 80px);
}
.content-row {
  padding:0;
  height:100%;
}
.bl-content {
  width: 100%;
  height: 100%;
  margin-bottom: 30px;
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
#stepsdiv {
  background:#12b1e1;
  padding: 10px 5%;
  min-width: 1200px;
}
.bukong-base {
  width: 1200px;
  margin: 0 auto;
}
.bukong-item {
  width: 700px;
  margin: 0 auto;
}
.title {
  width: 620px;
  margin-left: 50px;
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #D8DFE5;
}
.btn-yuzhi {
  display: inline-block;
  width: 20px;
  height: 20px;
  position: absolute;
  top: 10px;
  right: -55px;
  background-image: url("/static/image/bukong/add-yuzhi.png");
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
}
.del-yuzhi {
  right: -30px;
  background-image: url("/static/image/bukong/del-yuzhi.png");
  background-repeat: no-repeat;
  background-position: center;
}
.warn-yuzhi {
  display: inline-block;
  height: 20px;
  line-height: 20px;
  background-image: url(/static/image/bukong/warn-yuzhi.png);
  background-repeat: no-repeat;
  background-position: left center;
  text-indent: 26px;
  font-size: 12px;
  color: #999;
}
.btnmargin {
  margin-right: 50px;
}
.btn-info {
  width: 120px;
  /* height: 40px; */
  background: #12b1e1;
}
.footer-group {
  clear: both;
  width: 100%;
  text-align: center;
  margin: 20px auto;
}

.picture-hold {
  display: inline-block;
  width: 110px;
  height: 300px;
  margin: 0px 5px;
}
.upload-group {
  width: 540px;
  margin: 40px auto 20px;
}
.upload-div {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  width: 490px;
}
.upload-imgs {
  display: flex;
  padding: 0 5px;
}
.upload-imgs .picture-hold {
  height: 130px;
}
.btn-toggle {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 130px;
  background: #f2f2f2;
  cursor: pointer;
  color: #aaa;
}
.pic-btn {
  width: 104px;
  height: 28px;
  line-height: 24px;
  margin-top: 10px;
  text-align: center;
  color: #555759;
  /* background: #f1f4f5; */
  /* border: 1px solid #d8dfe5; */
}
.pic-wrap {
  position: relative;
  width: 110px;
  height: 130px;
  line-height: 130px;
  text-align: center;
  cursor: pointer;
  border: 1px solid #8394a1;
}
.clear-pic {
  position: absolute;
  display: block;
  font-size:18px;
  right: 0;
  top: 0;
  z-index: 30;
  color: #f00;
}
.defaul-sym {
  position: absolute;
  display: block;
  width: 100%;
  height: 100px;
  left: 0;
  top: 0;
  font-size: 40px;
}
.rx-icon {
  background-image: url("/static/image/jiansuo/rx-icon.png");
  background-repeat: no-repeat;
  background-position: center;
}
.up-text {
  position: absolute;
  width: 100%;          
  bottom: 20px;
  left:0;
  height: 20px;
  line-height: 20px;
  text-align: center;
  color: #8394a1;
}
img {
  position: relative;
  z-index: 3;
}
.tree-title {
  height: 40px;
  line-height: 40px;
  margin: 0;
  padding-left: 10px;
  border-bottom: 1px solid #ccc;
}
.list-shortcut {
  border-right: 1px solid #ccc;
}
.list-shortcut ul, .list-shortcut li, .clpp-list, .clpp-list li {
  padding: 0;
  list-style: none;
}
.list-shortcut li {
  height: 20px;
  line-height: 20px;
  text-align: center;
}
.list-shortcut li:hover {
  background: #ccc;
  cursor: pointer;
}
.clpp-list {
  margin: 0;
  margin-left:40px;
  height:100%;
  overflow:auto;
}
.clpp-list h2 {
  height: 30px;
  line-height:30px;
  margin: 5px 0;
  font-size:16px;
  background: #e6eff9;
  color: #12b1e1;
  padding-left:20px;
}
.clpp-list .list-group ul {
  margin: 0;
  padding: 0;
}
.clpp-list .list-group-item {
  height: 24px;
  line-height: 24px;
  padding-left: 20px;
  cursor: pointer;
}
.clpp-list .list-group-item:hover{
  background: #eee;
}
.close-icon {
  position: absolute;
  right: -8px;
  top: -8px;
  width: 20px;
  height: 20px;
  line-height: 20px;
  font-size: 20px;
  cursor: pointer;
}

/* 布控对象样式 */
.dwdasearchdiv {
  width: 100%;
  margin-bottom: 50px;
  margin-top: 80px;
  text-align: center;
}
.searchbj {
  display: inline-block;
  padding: 5px;
  margin-right: 30px;
  background-color: rgb(236, 248, 255, 0.5);
  box-shadow: #dfdbdb 0px 0px 8px;
}
.searchitem {
  display: inline-block;
  width: 276px;
  height: 360px;
  text-align: center;
}
.searchitembig {
  display: inline-block;
  width: 276px;
  height: 360px;
  text-align: center;
}

.tiaojiandiv {
  width: 100%;
  margin-bottom: 5px;
  height: 250px;
  border-radius: 6px;
  position: relative;
  box-sizing: border-box;
  background-color: #fff;
  cursor: pointer;
}
.tjicondiv {
  width: 100%;
  height: 250px;
  padding-top: 0px;
  font-size: 30px;
  color: #99a1ae;
}
.tjicon {
  margin: 20px;
}
.tiaojiandiv .search-form {
  box-sizing: border-box;
  width: 100%;
  line-height: 30px;
  position: absolute;
  bottom: 0px;
  height: 30px;
  padding: 0px;
  top: 174px;
}
.btn-margin {
  margin-top: 45px;
  margin-bottom: 5px;
}
.btn-margin-muban {
  margin-top: 5px;
  margin-bottom: 5px;
}
.swim-src-res {
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  flex-wrap: wrap;
}
.src-item {
  position: relative;
  display: flex;
  width: 362px;
  min-height: 460px;
  margin: 15px;
  text-align: left;
  box-shadow: #dfdbdb 0px 0px 8px;
}
.checkdiv {
  position: absolute;
  width: 60px;
  height: 60px;
  bottom: 10px;
  right: 10px;
  z-index: 999;
  text-align: center;
  font-size: 60px;
}
.checkdiv:hover {
  color: #409eff;
}
.active {
  color: rgb(182, 84, 84);
}
.noactive {
  color: #dedede;
}
.searchsubdiv {
  text-align: left;
  margin-bottom: 20px;
}
.searchbj .btn {
  min-width: 270px;
  padding: 4px 12px;
  height: 40px;
}
.identity-batch {
  background: url('/static/image/bukong/icon-bukong.png');
  background-size: auto 80%;
  background-repeat: no-repeat;
  background-position: center;
}
.identity-mingdan {
  background: url('/static/image/bukong/icon-mingdan.png');
  background-size: auto 80%;
  background-repeat: no-repeat;
  background-position: center;
}
.identity-face {
  background: url('/static/image/bukong/icon-face.png');
  background-size: auto 80%;
  background-repeat: no-repeat;
  background-position: center;
}
.face-modal {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  top: 0;
  left: 0;
}
.searchbj {
  border: 1px solid #ddd;
  border-radius: 2px;
}
.tiaojiandiv,
.tiaojiandiv .tjicondiv,
.tiaojiandiv .search-form {
  background: #ddd;
}
.tiaojiandiv .tjicondiv {
  padding-top: 50px;
}
.dwdasearchdiv {
  display: flex;
  justify-content: space-evenly;
}
.btn-muban {
  font-size: 12px;
  margin-top: 10px;
}
.researchcardiv {
  height: 30px;
  line-height: 30px;
  text-align: left;
  margin: 0px 30px;
  display: flex;
}
</style> 