<template>
<div class="content-body add-control">
    <div class="page-bread">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/zhinenggaojing/bukongguanli'}">布控管理</el-breadcrumb-item>
        <el-breadcrumb-item v-if="addtype=='ry'">新增人员布控</el-breadcrumb-item>
        <el-breadcrumb-item v-if="addtype=='che'">新增车辆布控</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-row">
      <div class="bl-content" :class="{heightAuto: bkbdshow}">
        <div id="stepsdiv">
          <el-steps :active="active" align-center>
            <el-step title="布控设置"></el-step>
            <el-step title="布控范围"></el-step>
            <el-step title="生成布控表单"></el-step>
          </el-steps>
        </div>
        <div v-show="bkszshow" class="bukong-base">
          <div class="bukong-item">
            <p class="title"><i class="fa fa-bookmark" style="color:#12B1E1"></i> 基本信息</p>
            <el-form :model="ruleForm" :rules="xxrule" ref="ruleFormxx" label-width="150px" :inline="true" style="width:600px;margin:0px auto;">
              <el-form-item label="布控标题：" prop="title">
                <el-input  v-model="ruleForm.title" style="width:440px"></el-input>                   
              </el-form-item>
              <el-form-item label="布控发起人：" prop="bkfqr">
                <el-input  v-model="ruleForm.bkfqr" style="width:440px"></el-input>                    
              </el-form-item>
              <el-form-item label="布控时间：" prop="ckedbksjrange">
                <el-date-picker v-model="ruleForm.ckedbksjrange" unlink-panels type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:440px" :picker-options="datepickerlimit" value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="布控原因：" prop="bkyy">
                  <el-select v-model="ruleForm.bkyy"  style="width:300px" placeholder="请选择"  @change="selBkyy">
                    <el-option
                      v-for="item in bkyys"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div class="bukong-item">          
            <p class="title"><i class="fa fa-bookmark" style="color:#12B1E1"></i> 布控对象</p>
            <div style="width:600px;margin:0px auto;" v-show="addtype=='ry'">
              <el-form :model="ruleForm" :rules="rydxrule" ref="ruleFormrydx" label-width="150px" :inline="true" style="width:480px;margin:0px auto;float:left">
                <el-form-item label="布控类型：">
                  人员
                </el-form-item>
                <el-form-item label="姓名：" prop="bkxm">
                  <el-input  v-model="ruleForm.bkxm"  style="width:300px"></el-input>
                </el-form-item>
                <el-form-item label="身份证：" prop="bksfz">
                  <el-input  v-model="ruleForm.bksfz"  style="width:300px"></el-input>
                </el-form-item>
                <el-form-item label="电话：" prop="bkdh">
                  <el-input  v-model="ruleForm.bkdh"  style="width:300px"></el-input>
                </el-form-item>
                <el-form-item label="户籍地：" prop="bkhjd">
                  <el-input  v-model="ruleForm.bkhjd"  style="width:300px"></el-input>
                </el-form-item>
              </el-form> 
              <div class="picture-hold">
                <p class="pic-btn">人像</p>
                <div class="pic-wrap">
                  <el-upload action class="avatar-uploader" :show-file-list="false" :auto-upload="false" :on-change="readManImage" :before-upload="beforeAvatarUpload" accept="image/jpeg,image/png">
                    <i  v-if="imageUrl.url" class="rx-icon defaul-sym fa fa-times-circle-o" @click.stop="clearImg"></i>
                    <p class="up-text">上传图片</p>
                    <img v-if="imageUrl.url" :src="imageUrl.url" class="avatar">
                  </el-upload>
                </div>
              </div>
            </div>
            <div style="width:600px;margin:0px auto;" v-show="addtype=='che'">
              <el-form :model="ruleForm" :rules="cldxrule" ref="ruleFormcldx" label-width="150px" :inline="true" style="width:480px;margin:0px auto;float:left">
                <el-form-item label="车牌：" prop="bkcl">
                  <el-input  v-model="ruleForm.bkcl"  style="width:300px"></el-input>
                </el-form-item>
                <el-form-item label="车牌颜色：" prop="bkcpys">
                  <el-select v-model="ruleForm.bkcpys"  style="width:300px" placeholder="请选择"  @change="selCarPlateColor">
                    <el-option
                      v-for="item in cpys"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="车型：" prop="bkcx">
                  <el-input  v-model="ruleForm.bkcx" style="width:185px" readonly="readonly"></el-input>
                  <el-button type="primary" size='small' @click="showSelClpp" style="width:100px;margin-left:10px;background:#12b1e1;">选择车辆品牌</el-button>
                  <div v-show="showSelcarpp" style="position:absolute;top:calc(50% - 280px);left:320px;width:300px;height:560px;background:#fff;border:1px solid #ccc;z-index:32;">
                    <span class="close-icon" @click="showSelClpp"><i class="fa fa-times-circle-o"></i></span> 
                    <div class="list-shortcut" style="width:40px;margin:0;float:left;height:100%;">
                      <ul>
                        <li v-for="(item, index) in shortcutList"
                        class="item"
                        :data-index="index"
                        :key="item.id"
                        @click="gotoPosition">
                        {{ item }}
                        </li>
                      </ul>
                    </div>
                    <ul class="clpp-list" ref="listView">
                      <li v-for="group in clpps"
                        class="list-group"
                        :key="group.id"
                        ref="listGroup">
                        <h2 class="list-group-title">{{ group.title }}</h2>
                        <ul>
                          <li v-for="item in group.items" @click="selCarpinpai(item.value, item.label)"
                            class="list-group-item" :key="item.id">
                            <span>{{item.label}}</span>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </el-form-item>
                <el-form-item label="车辆颜色：" prop="bkclys">
                  <el-select v-model="ruleForm.bkclys"  style="width:300px" placeholder="请选择" @change="selCarColor">
                    <el-option
                      v-for="item in clys"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form> 
              <div class="picture-hold">
                <p class="pic-btn">车像</p>
                <div class="pic-wrap">
                  <el-upload action class="avatar-uploader" :show-file-list="false" :auto-upload="false" :on-change="readCheImage" accept="image/jpeg,image/png">
                    <i v-if="imageUrl.url" class="rx-icon defaul-sym fa fa-times-circle-o" @click.stop="clearImg"></i>
                    <p class="up-text">上传图片</p>
                    <img v-if="imageUrl.url" :src="imageUrl.url" class="avatar">
                  </el-upload>
                </div>
              </div>
            </div>
          </div>
          <div class="footer-group">
            <button type="button" class="btn btn-info btnmargin" @click="backbkgl">取消</button>
            <button type="button" class="btn btn-info" @click="nextshowwsbkdx">下一步</button>
          </div>
        </div>
        <div v-show="bkfwshow" style="height: calc(100% - 160px)">
          <div class="bk-content">
            <div class="content-left">
              <p class="tree-title">布控范围</p>
              <kakou-tree ref="kakoutree" :addtype="addtype" :cakoudefault="[]" showType="addcontrol"></kakou-tree>
            </div>
            <div class="content-right">
              <baidu-map :showKaKouTool="showKaKouTool" :addtype="addtype"></baidu-map>
            </div>
          </div>
          <div class="footer-group">
            <button type="button" class="btn btn-info btnmargin" @click="backshowbkdxadd">上一步</button>
            <button type="button" class="btn btn-info" @click="nextshowbkfw">下一步</button>
          </div>
        </div>
        <div v-show="bkbdshow">
          <div style="width:650px;margin:30px auto;border:1px solid #ccc;">
            <bk-details :bkdetaildata="ruleForm" :addtype="addtype" :imgUrl="imageUrl.url" :selectedKakou="selectNode"></bk-details> 
          </div>         
          <div class="footer-group">
            <button type="button" class="btn btn-info btnmargin" @click="backshowwsbkdx">上一步</button>
            <button type="button" class="btn btn-info btnmargin" @click="controladdcommit">提交</button>
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
import KakouTree from "@/components/Control/ShebeiTree";
import Bkdetails from "@/components/Control/Bkdetails";
// import Clpps from "@/constants/carpinpai.json";
import { excontrolApi } from "@/https";
import eventBus from '@/event';
import { eventCollection } from '@/event/resources';
import baidumap from '@/components/baidumap/mapInit';


export default {
  name: "addchecontrol",
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
      //控制完善基本信息的显示
      bkszshow: true,
      //控制完善布控对象信息的显示
      bkfwshow: false,
      //控制布控范围的显示
      bkbdshow: false,
      addtype: '',
      cpys: this.getCpysList(),
      clys: this.getClysList(),
      imageUrl: {},
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
            idCard:"",
            phone:"",
            register:"",
            plateNo:"",
            brand:"",
            plateColor:"",
            vehicleColor:""
          }
      }],
      ruleForm: {
        bkbh:'',
        bkfqr: '',
        //选择的布控时间范围
        ckedbksjrange: [this.getFormatDate(Date.now()), this.getFormatDate(Date.now()+24*60*60*1000)],
        bkyy:"",
        bkxm: '',
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
      },
      uploadForm:null,
      showSelcarpp: false,
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
      clpps: [],
      scroll: '',
      //限制日期选择范围
      datepickerlimit: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      xxrule: {
        title: [
          {
            required: true,
            message: "布控标题不能为空！",
            trigger: "blur"
          },
          {
            pattern:/^[\u4E00-\u9FA5A-Za-z0-9]+$/,
            message: '布控标题不能只包含特殊字符！' 
          }
        ],
        bkfqr: [
          {
            required: true,
            message: "布控发起人不能为空！",
            trigger: "blur"
          },
          {
            pattern:/^[\u4E00-\u9FA5A-Za-z0-9]+$/,
            message: '请输入正确的姓名！' 
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
            max: 30,
            message: "最多输入30个字符！",
            trigger: "blur"
          }
        ]
      },
      rydxrule: {
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
          // {
          //   required: true,
          //   message: "车牌号不能为空！",
          //   trigger: "blur"
          // },
          {
            pattern:/([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})/,
            message: '车牌格式不正确！' 
          }
        ],
      },
      selectkakou:[],
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
        this.selectkakou = value;
        this.selectNode = node;        
    });
    eventBus.$on(eventCollection.EXCONTROL_GET_SELECTED_LOCALNAME, value => {
        this.localName = value;    
    });
    this.clpps = JSON.parse(localStorage.getItem('clpplist')) || [];
  },
  mounted() {
    // this.initdict();
    // this.getbkId();
  },
  components: {
    "kakou-tree": KakouTree,
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
    //上一步、下一步等显示的控制
    backbkgl: function() {
      this.$router.push({ path: '/zhinenggaojing/bukongguanli' });
    },
    nextshowwsbkdx: function() {
      let _this = this;
      if (this.str2DataTime(this.ruleForm.ckedbksjrange[0]) < Date.now()) {
        this.ruleForm.ckedbksjrange[0] = this.getFormatDate(Date.now()+30000);
      }
      if (this.str2DataTime(this.ruleForm.ckedbksjrange[1]) < Date.now()) {
        this.ruleForm.ckedbksjrange[1] = this.getFormatDate(Date.now()+30000);
      }

      _this.$refs["ruleFormxx"].validate(valid => {
        if (valid) {
          if (_this.addtype == 'ry') {
            _this.$refs["ruleFormrydx"].validate(valid => {
              if (valid) {
                _this.active = 1;
                _this.bkfwshow = true;
                _this.bkszshow = false;
              } else {
                _this.$message({
                  message: "请按提示输入必填项",
                  type: "warning"
                });
              }
            });
          } else if (_this.addtype == 'che') {
            _this.$refs["ruleFormcldx"].validate(valid => {
              if (valid) {
                _this.active = 1;
                _this.bkfwshow = true;
                _this.bkszshow = false;
              } else {
                _this.$message({
                  message: "请按提示输入必填项",
                  type: "warning"
                });
              }
            });
          }
        } else {
          _this.$message({
            message: "请按提示输入必填项",
            type: "warning"
          });
        }
      });
    },
    backshowbkdxadd: function() {
      this.active = 0;
      this.bkszshow = true;
      this.bkfwshow = false;
    },
    nextshowbkfw: function() {
      if (this.$refs.kakoutree.checkSelData()) {
        this.active = 2;
        this.bkfwshow = false;
        this.bkbdshow = true;
      }
    },
    backshowwsbkdx: function() {
      this.active = 1;
      this.bkbdshow = false;
      this.bkfwshow = true;
    },
    //取消布控事件
    cancelbk: function() {
      this.active = 0;
      this.bkszshow = true;
      this.bkfwshow = false;
      this.bkbdshow = false;
      this.imageUrl = {};
      this.controladdinfo[0].sprlb = [];
      this.$refs["ruleFormxx"].resetFields();
      this.$refs["ruleFormrydx"].resetFields();
      this.$refs["ruleFormcldx"].resetFields();
      this.$refs.kakoutree.resetChecked();
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
   
        this.controladdinfo[0].disposition.applicantName = this.ruleForm.bkfqr;   //申请人
        if (this.str2DataTime(this.ruleForm.ckedbksjrange[0]) < Date.now()) {
          this.ruleForm.ckedbksjrange[0] = this.getFormatDate(Date.now()+30000);
        }
        if (this.str2DataTime(this.ruleForm.ckedbksjrange[1]) < Date.now()) {
          this.ruleForm.ckedbksjrange[1] = this.getFormatDate(Date.now()+30000);
        }
        this.controladdinfo[0].disposition.beginTime = this.str2DataTime(this.ruleForm.ckedbksjrange[0]);//布控开始时间
        this.controladdinfo[0].disposition.endTime = this.str2DataTime(this.ruleForm.ckedbksjrange[1]);//布控结束时间  
        this.controladdinfo[0].disposition.title = this.ruleForm.title;  //''布控编码"
        this.controladdinfo[0].disposition.dispositionRange = 1;   //"布控范围",1卡口，2区域布控
        this.controladdinfo[0].disposition.operateType = 0;  //默认填0
        this.controladdinfo[0].disposition.reason = this.ruleForm.bkyy;  //布控原因
        if(this.addtype=='ry')
        {
          this.controladdinfo[0].disposition.dispositionCategory =  2;  //"布控类别";
          this.controladdinfo[0].targetFeature.name =  this.ruleForm.bkxm; 
          this.controladdinfo[0].targetFeature.idCard =  this.ruleForm.bksfz; 
          this.controladdinfo[0].targetFeature.phone =  this.ruleForm.bkdh; 
          this.controladdinfo[0].targetFeature.register =  this.ruleForm.bkhjd; 
        }
        else if(this.addtype=='che')
        {
          this.controladdinfo[0].disposition.dispositionCategory = 3; //"布控类别"; 
          this.controladdinfo[0].targetFeature.plateNo =  this.ruleForm.bkcl; 
          this.controladdinfo[0].targetFeature.brand =  this.ruleForm.bkcxid; 
          this.controladdinfo[0].targetFeature.plateColor =  this.ruleForm.bkcpys; 
          this.controladdinfo[0].targetFeature.vehicleColor =  this.ruleForm.bkclys;  
        }    
        this.controladdinfo[0].disposition.tollgateList = this.selectkakou.join(';'); //卡口id数组，用,隔开
        this.controladdinfo[0].disposition.dispositionArea = this.selectNode.join(';'); //卡口名称
        if (this.localName.userName) {
          this.controladdinfo[0].sprlb.push(this.localName);
        }

        let _this = this;
        _this.getbkId().then(function() {
          _this.controladdinfo[0].disposition.dispositionID = _this.ruleForm.bkbh;  //''布控编码"
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
    readCheImage: function(file) {
      this.imageUrl = file;
       this.imageUrl.url = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isLt10M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isLt10M;
    },
    // _initSrcoll () {
    //   this.scroll = new BScroll(this.$refs.listView, {
    //   // 获取 scroll 事件，用来监听。
    //     probeType: 3
    //   });
    // },
    showSelClpp() {
      this.showSelcarpp = !this.showSelcarpp;
    },
    selCarpinpai(id, label) {
      this.ruleForm.bkcxid = id;
      this.ruleForm.bkcx = label;
      this.showSelcarpp = !this.showSelcarpp;
    },
    selBkyy(vId) {
      for (let i=0;i<this.bkyys.length;i++) {
        if (this.bkyys[i].value == vId) {
          this.ruleForm.bkyyText = this.bkyys[i].label;
          break;
        }
      }
    },
    selCarPlateColor(vId) {
      let obj = {};      
      obj = this.cpys.find((item)=>{   
        return item.value === vId;
      });  
       
      this.ruleForm.cpysText = obj.label;
    },
    selCarColor(vId) {
      let obj = {};      
      obj = this.clys.find((item)=>{   
        return item.value === vId;
      });  
       
      this.ruleForm.clysText = obj.label;
    },
    gotoPosition(e) {
      // 获取到绑定的 index
      let index = e.target.getAttribute('data-index');
      this.$refs.listView.scrollTop = this.$refs.listGroup[index].offsetTop - 5;
    },
    clearImg() {
      this.imageUrl = {};
      return false;
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
  width: 50%;
  float: left;
}
.title {
  width: 540px;
  margin-left: 50px;
  margin-bottom: 15px;
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #D8DFE5;
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
  margin-top:0px;
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
  margin-top:10px;
  width: 104px;
  height: 124px;
  line-height: 118px;
  text-align: center;
  cursor: pointer;
  border: 2px solid #8394a1;
}
.defaul-sym {
  position: absolute;
  display: block;
  font-size:18px;
  right: 0;
  top: 0;
  z-index: 30;
  color: #f00;
}
.up-text {
  position: absolute;
  width: 100%;          
  bottom: 30px;
  left:0;
  height: 20px;
  line-height: 20px;
  text-align: center;
  color: #a8c1d8;
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
</style> 