<template>
<div class="content-body add-control">
    <div class="page-bread">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>门禁授权</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-row">
      <div class="bl-content" :class="{heightAuto: bkbdshow}">
        <div id="stepsdiv">
          <el-steps :active="active" align-center>
            <el-step title="选择人员"></el-step>
            <el-step title="选择卡片"></el-step>
            <el-step title="选择门禁"></el-step>
            <el-step title="授权"></el-step>
          </el-steps>
        </div>
        <!-- 布控对象首页 -->
        <div v-show="bkdxshow" class="bukong-base">
          <div class="dwdasearchdiv">
            <div style="margin-top:20px;padding:0 10px;">
              <div class="search-group">
                <div class="search-item">
                  <el-input style="width:320px;" placeholder="输入提示：张三" v-model="searchRyStr">
                  </el-input>
                </div>
                <span>
                  <el-button class="btn btn-search" size="small" @click="searchExcontrol">查询</el-button>
                </span>
              </div>
              <div class="model-hold">
                <el-table :data="srcTableData" height="calc(100vh - 410px)"> 
                  <el-table-column width="55">
                    <template slot-scope="scope">
                        <el-radio :label="scope.$index" v-model="selectedIdx" @change.native="getSelRyRow(scope.$index,scope.row)">&nbsp;</el-radio>
                    </template>
                  </el-table-column>
                  <el-table-column type="index" width="60" label="序号">
                  </el-table-column>
                  <el-table-column prop="name" label="姓名" min-width="100">
                  </el-table-column>
                  <el-table-column min-width="100"  prop="idType" label="证件类型">
                  </el-table-column>
                  <el-table-column label="证件号码" prop="idNumber" min-width="150">
                  </el-table-column>
                  <el-table-column prop="gender" min-width="60" label="性别">
                  </el-table-column>
                  <el-table-column prop="residence" min-width="180" label="住址">
                  </el-table-column>
                  <el-table-column prop="phone" label="电话号码" min-width="110">
                  </el-table-column>  
                  <el-table-column label="操作" min-width="110" fixed='right'>
                    <template slot-scope="scope">
                      <el-button type="text" size="small" class="operate-btn" @click="deleteCard(scope.row)">
                        <i class="fa fa-file-text-o"></i> 查看详情</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination background @current-change="searchExcontrol" :page-size="10" :current-page.sync="currentPage" layout="total, prev, pager, next, jumper" :total="srcrestotal">
                </el-pagination>
              </div>

            </div>
          </div>
          <div class="footer-group">
            <button type="button" class="btn btn-info btnmargin">取消</button>
            <button type="button" class="btn btn-info" @click="nextshowbkfw">下一步</button>
          </div>
        </div>
        <!-- 选择卡片 -->
        <div v-show="bkfwshow" style="height: calc(100% - 160px)">
          <div class="bk-content">
            <div class="sel-radio">
              <span>选择方式：</span>
              <el-radio-group v-model="selectedType">
                <el-radio :label="1">新增卡片</el-radio>
                <el-radio :label="2">选择已有卡片</el-radio>
              </el-radio-group>
            </div>
            <el-form :model="addCardform" class="bukong-item form-border" v-if="selectedType == 1" label-width="80px">
              <el-form-item label="卡号">
                <el-input v-model="addCardform.number"></el-input>
              </el-form-item>
              <el-form-item label="生效时间 ">
                <el-date-picker
                  v-model="addCardform.sxtime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择生效时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="截止时间 ">
                <el-date-picker
                  v-model="addCardform.jztime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择截止时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="业务范围">
                <el-checkbox-group v-model="addCardform.checkList">
                  <el-checkbox label="门禁"></el-checkbox>
                  <el-checkbox label="停车场"></el-checkbox>
                  <el-checkbox label="可视对讲"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>

            <div class="form-border" v-if="selectedType == 2" >
              <div class="search-group">
                <div class="search-item">
                  <el-input style="width:320px;" placeholder="输入提示：05241879" v-model="searchCardStr">
                  </el-input>
                </div>
                <span>
                  <el-button class="btn btn-search" size="small" @click="searchCard(1)">查询</el-button>
                </span>
              </div>
              <div class="model-hold">
                <el-table :data="cardTableData" style="margin-top:10px" @selection-change="handleSelectionCard"> 
                  <el-table-column
                    type="selection"
                    width="55">
                  </el-table-column>
                  <el-table-column type="index" width="80" label="序号">
                  </el-table-column>
                  <el-table-column prop="idNumber" label="卡号" min-width="100">
                  </el-table-column>
                  <el-table-column min-width="100"  prop="idType" label="卡片状态">
                  </el-table-column>
                </el-table>        
                <el-pagination background @current-change="searchCard" :page-size="10" :current-page.sync="currentCardPage" layout="total, prev, pager, next, jumper" :total="cardtotal">
                </el-pagination>
              </div>
            </div>
          </div>
          <div class="footer-group">
            <button type="button" class="btn btn-info btnmargin" @click="backshowbkdx">上一步</button>
            <button type="button" class="btn btn-info" @click="nextshowjbxx">下一步</button>
          </div>
        </div>
        <!-- 选择门禁 -->
        <div v-show="jbxxshow">
          <div class="bk-content menjin-content">
            <div class="search-group">
              <div class="search-item">
                <el-input style="width:320px;" placeholder="输入提示：05241879" v-model="searchMenjinStr">
                </el-input>
              </div>
              <span>
                <el-button class="btn btn-search" size="small" @click="searchMenjin()">查询</el-button>
              </span>
            </div>
            <div class="model-hold">
              <el-table :data="menjinTableData" style="margin-top:10px" @selection-change="handleSelectionMenjin"> 
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column type="index" width="80" label="序号">
                </el-table-column>
                <el-table-column prop="name" label="门禁名称" min-width="100">
                </el-table-column>
                <el-table-column min-width="100"  prop="idType" label="设备类型">
                </el-table-column>
              </el-table>        
              <el-pagination background @current-change="searchMenjin" :page-size="10" :current-page.sync="currentMenjinPage" layout="total, prev, pager, next, jumper" :total="menjintotal">
              </el-pagination>
            </div>
          </div>
          <div class="footer-group" style="margin-top:50px;">
            <button type="button" class="btn btn-info btnmargin" @click="backshowbkfw">上一步</button>
            <button type="button" class="btn btn-info" @click="nextshowbkbd">下一步</button>
          </div>
        </div>
        <!-- 信息预览 -->
        <div v-show="bkbdshow">
          <div style="width:650px;margin:30px auto;border:1px solid #ccc;">
            <menjin-details :detailsdata="ruleForm"></menjin-details> 
          </div>         
          <div class="footer-group">
            <button type="button" class="btn btn-info btnmargin" @click="backshowjjxx">上一步</button>
            <button type="button" class="btn btn-info" @click="controladdcommit">授权</button>
          </div>
        </div>
      </div>

    </div>

  </div>

</template>

<script>
import Menjindetails from "@/components/Control/Menjindetails";
import { excontrolApi, propertyApi } from "@/https";
import eventBus from '@/event';
import { eventCollection } from '@/event/resources';

export default {
  name: "menjinshouquan",
  data() {
    return {
      //控制步骤条显示
      active: 0,
      //控制完善布控对象信息的显示
      bkdxshow: true,
      //控制布控范围的显示
      bkfwshow: false,
      //控制完善基本信息的显示
      jbxxshow: false,
      bkbdshow: false,
      mdbkshow: false,
      currentPage: 1, //已有人员
      srcrestotal: 1,
      searchRyStr: '',
      srcTableData: [],
      selectedType: 1,
      addCardform: {
        number:'',
        sxtime:'',
        jztime:'',
        checkList:''
      },
      selectedIdx: [],
      selectedRow: {},
      currentCardPage: 1, //已有卡片
      cardtotal: 1,
      searchCardStr: '',
      cardTableData: [],
      multipleSelectionCard: [],
      currentMenjinPage: 1, //选择门禁
      menjintotal: 1,
      searchMenjinStr: '',
      menjinTableData: [],
      multipleSelectionMenjin: [],
  

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
      selectshebei:[],
      selectNode: [],
      
    };
  },
  mounted() {
    this.searchExcontrol();
    this.searchMenjin();
  },
  components: {
    "menjin-details": Menjindetails,
  },
  computed: {
    shortcutList () {
     return this.clpps.map((group) => {
      return group.title.substr(0, 1);
     })
    }
  },
  methods: {
    searchExcontrol() {
      let param = {};
      param.pageNum = this.currentPage;
      param.pageSize = 10;
      param.name = this.searchRyStr;

      return excontrolApi
        .shiyourenkouSearch(param)
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.srcrestotal = data.total;
          //生成表格
          this.srcTableData = data.rows;
        });
    },
    searchCard() {
      let param = {};
      param.pageNum = this.currentCardPage;
      param.pageSize = 10;

      return excontrolApi
        .shiyourenkouSearch(param)
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.cardtotal = data.total;
          //生成表格
          this.cardTableData = data.rows;
        });
    },
    handleSelectionCard(val) {
      this.multipleSelectionCard = val;
    },
    searchMenjin() {
      let param = {};
      param.pageNum = this.currentMenjinPage;
      param.pageSize = 10;
      param.name = this.searchMenjinStr;

      return propertyApi
        .getMenjinData(param)
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.menjintotal = data.total;
          //生成表格
          this.menjinTableData = data.rows;
        });
    },
    handleSelectionMenjin(val) {
      this.multipleSelectionCard = val;
    },
    //上一步、下一步等显示的控制
    // backbkgl: function() {
    //   this.$router.push({ path: '/bukongguanli/bukongguanli' });
    // },
    nextshowbkfw() {
      this.active = 1;
      this.bkfwshow = true;
      this.bkdxshow = false;
    },
    backshowbkdx: function() {
      this.active = 0;
      this.bkdxshow = true;
      this.bkfwshow = false;
    },
    nextshowjbxx: function() {
      this.active = 2;
      this.bkfwshow = false;
      this.jbxxshow = true;
    },
    backshowbkfw: function() {
      this.active = 1;
      this.bkfwshow = true;
      this.jbxxshow = false;
    },
    nextshowbkbd: function() {
      this.active = 3;
      this.bkbdshow = true;
      this.jbxxshow = false;
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
      this.$refs["ruleFormxx"].resetFields();
      this.$refs["ruleFormrydx"].resetFields();
      this.$refs.shebeitree.resetChecked();
    },
    controladdcommit: function() {
        return excontrolApi
          .excontroladdBkSubmit(this.controladdinfo)
          .then(res => res.data)
          .then(data => {
            // loading.close();
            this.$confirm("授权成功", "提示", {
              cancelButtonText: "返回首页",
              confirmButtonText: "继续",
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
    getSelRyRow(index, row) {         //选择已有人员
        this.selectedIdx = index;
        this.selectedRow = row;
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
  width: 500px;
  height: calc(100% - 40px);
  margin: 30px auto;
}
.sel-radio {
  line-height: 30px;
  text-align: center;
}
.form-border {
  margin-top: 20px;
  border: 1px solid #D8DFE5;
  padding: 20px 25px 0px;
}
.menjin-content {
  width: 600px;
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
.model-hold {
  position: relative;
  margin-top: 10px;
  padding-bottom: 50px;
}
.bukong-base {
  width: 1200px;
  margin: 0 auto;
}
.bukong-item {
  width: 500px;
}
.title {
  width: 620px;
  margin-left: 50px;
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #D8DFE5;
}
.search-group {
  display: flex;
  justify-content: center;
  flex: 1;
}
.search-item {
  display: flex;
  margin-right: 20px;
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
.btn-search {
  background: #12b1e1;
  color: #fff;
  min-width: 100px;
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
  margin-top: 0px;
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