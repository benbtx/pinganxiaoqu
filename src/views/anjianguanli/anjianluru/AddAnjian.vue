<template>
<div class="content-body add-control">
    <div class="page-bread">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/anjianguanli/anjianluru'}">案件录入</el-breadcrumb-item>
        <el-breadcrumb-item>添加案件</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-row">
      <div class="bl-content" :class="{heightAuto: bkbdshow}">
        <div id="stepsdiv">
          <el-steps :active="active" align-center>
            <el-step title="输入基本信息"></el-step>
            <el-step title="添加资源"></el-step>
            <el-step title="提交"></el-step>
          </el-steps>
        </div>
        <div v-show="bkszshow" class="bukong-base">
          <div class="bukong-item">
            <p class="title"><i class="fa fa-bookmark" style="color:#12B1E1"></i> 基本信息（必填）</p>
            <el-form :model="ruleForm" :rules="xxrule" ref="ruleFormxx" label-width="150px" :inline="true" style="width:600px;margin:0px auto;">
              <el-form-item label="布控编号：">
                <span style="width:440px">{{ruleForm.bkbh}}</span>                    
              </el-form-item>
              <el-form-item label="布控发起人：" prop="bkfqr">
                <el-input  v-model="ruleForm.bkfqr" style="width:440px"></el-input>                    
              </el-form-item>
              <el-form-item label="布控时间：" prop="ckedbksjrange">
                <el-date-picker v-model="ruleForm.ckedbksjrange" unlink-panels type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:440px" :picker-options="datepickerlimit" value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="布控原因：" prop="bkyy">
                <el-input  type="textarea" v-model="ruleForm.bkyy" style="width:440px;height:80px;"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="bukong-item">          
            <p class="title"><i class="fa fa-bookmark" style="color:#12B1E1"></i> 资源（选填）</p>
            <div style="width:600px;margin:0px auto;">
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
                  <el-upload action class="avatar-uploader" :show-file-list="false" :auto-upload="false" :on-change="readManImage" accept="image/jpeg,image/png">
                    <i  v-if="imageUrl.url" class="rx-icon defaul-sym fa fa-times-circle-o" @click.stop="clearImg"></i>
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
            </div>
            <div class="content-right">
            </div>
          </div>
          <div class="footer-group">
            <button type="button" class="btn btn-info btnmargin" @click="backshowbkdxadd">上一步</button>
            <button type="button" class="btn btn-info" @click="nextshowbkfw">下一步</button>
          </div>
        </div>
        <div v-show="bkbdshow">
          <div style="width:650px;margin:30px auto;border:1px solid #ccc;">
            
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
import { excontrolApi } from "@/https";
import eventBus from '@/event';
import { eventCollection } from '@/event/resources';

export default {
  name: "addanjian",
  data() {
    // var validateChepai = (rule, value, callback) => {
    //   if (!this.imageUrl.url && value == '') {
    //     callback(new Error('请上传车像或者填写车牌号！'));
    //   } else {
    //     callback();
    //   }
    // };
    // var validateSfz = (rule, value, callback) => {
    //   if (!this.imageUrl.url && value == '') {
    //     callback(new Error('请上传人像或者填写身份证号！'));
    //   } else {
    //     callback();
    //   }
    // };

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
      imageUrl: {},
      controladdinfo: [{
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
        ckedbksjrange: setinitbkdate(),
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
      //   bkfqr: [
      //     {
      //       required: true,
      //       message: "布控发起人不能为空！",
      //       trigger: "blur"
      //     },
      //     {
      //       pattern:/^[\u4E00-\u9FA5A-Za-z0-9]+$/,
      //       message: '请输入正确的姓名！' 
      //     }
      //   ],
      //   bkyy:[
      //     {
      //       required: true,
      //       message: "布控原因不能为空！",
      //       trigger: "change"
      //     },
      //     {
      //       pattern:/[\u4E00-\u9FA5A-Za-z0-9]+/,
      //       message: '布控原因不能只包含特殊字符！'
      //     },
      //     {
      //       max: 30,
      //       message: "最多输入30个字符！",
      //       trigger: "blur"
      //     }
      //   ]
      },
      rydxrule: {
      //   bksfz: [
      //     { validator: validateSfz, trigger: 'blur' },
      //     {
      //       pattern:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
      //       message: '身份证格式不正确！' 
      //     }
      //   ],
      // },
      // cldxrule: {
      //   bkcl: [
      //     { validator: validateChepai, trigger: 'blur' },
      //     {
      //       pattern:/([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})/,
      //       message: '车牌格式不正确！' 
      //     }
      //   ],
      },
    };
  },
  created() {
  },
  mounted() {
  },
  components: {
  },
  methods: {
    getBase64Image:function(img) {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height);
            // var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
            var ext = img.type;
            var dataURL = canvas.toDataURL(ext);
            return dataURL;
    },
    //上一步、下一步等显示的控制
    backbkgl: function() {
      this.$router.push({ path: '/bukongguanli/bukongguanli' });
    },
    nextshowwsbkdx: function() {
      let _this = this;

      _this.$refs["ruleFormxx"].validate(valid => {
        if (valid) {
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
      // if (this.$refs.kakoutree.checkSelData()) {
        this.active = 2;
        this.bkfwshow = false;
        this.bkbdshow = true;
      // }
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
      this.$refs["ruleFormxx"].resetFields();
      this.$refs["ruleFormrydx"].resetFields();
      this.$refs["ruleFormcldx"].resetFields();
      this.$refs.kakoutree.resetChecked();
      this.imageUrl = {};
    },
    controladdcommit: function() {
        // 图片转base64编码
        let imgLink = this.imageUrl;
        
        if (imgLink) {
          let tempImage = new Image();
          tempImage.src = imgLink.url;
          tempImage.type = imgLink.raw.type;
          tempImage.crossOrigin = "*";
          this.controladdinfo[0].base64 = this.getBase64Image(tempImage);
        } else {
           this.controladdinfo[0].base64 = "";
        }

        return excontrolApi
          .excontroladdBkSubmit(this.controladdinfo)
          .then(res => res.data)
          .then(data => {
            // loading.close();
            this.$confirm("提交成功", "提示", {
              cancelButtonText: "返回首页",
              confirmButtonText: "继续布控",
              type: "success"
            }).then(() => {
              this.cancelbk();
            }
            ).catch(action => {
              if (action == 'cancel') {
                this.backbkgl();
              }
            })
          })
    },
    readManImage: function(file) {
      this.imageUrl = file;
      this.imageUrl.url = URL.createObjectURL(file.raw);
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