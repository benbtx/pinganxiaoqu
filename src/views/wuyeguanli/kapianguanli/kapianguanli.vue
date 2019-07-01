<template>
  <div id="contentbody" class="content-body">
    <div class="page-bread">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>卡片管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-row">
      <div class="content-center">
        <div id="tongji">
          <div class="content-title">
            <span>卡片情况</span>
          </div>
          <div style="margin:15px;display:flex;">
            <div id="zaikongliang" class="item_zaikongliang">
              <span class="icon_zaikongliang">卡片</span>
              <div style="width:100%;height:100%">
                <div class="item-bukong">
                  <p class='bukong-type'>
                    <span></span> 总量</p>
                    <span class="spanman">
                      <strong class="num">{{controlpeople}}</strong> 张
                    </span>
                </div>

                <div class="item-bukong">
                  <p class='bukong-type'>
                    <span></span> 正常</p>
                    <span class="spanman">
                      <strong class="num">{{controlcar}}</strong> 张
                    </span>
                </div>

                <div class="item-bukong">
                  <p class='bukong-type'>
                    <span></span> 已挂失</p>
                    <span class="spanman">
                      <strong class="num">{{controlcar}}</strong> 张
                    </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="bukong">
          <div class="content-title">
            <span>卡片操作</span>
          </div>
          <div class="row">
            <div class="fn-bls">
              <div class="ic_bukongbtn add_bukong" @click="addNewCard"></div>
            </div>
          </div>
        </div>
        <div class="clearfix"></div>
        <div id="bukongsearch" style="margin:20px 0;">
          <div class="content-title">
            <span>快速查询</span>
          </div>
          <div style="margin-top:20px;padding:0 10px;">
            <div class="search-group">
              <div class="search-item">
                <el-input style="width:320px;" placeholder="输入提示：卡号" v-model="bukongkey">
                </el-input>
              </div>
              <span class="search-item">
                <button class="btn btn-info ridiusnull btn-search" type="button" @click="searchExcontrol(1)">查询</button>
              </span>
            </div>
            <div id="bukongsearchdiv" style="margin-top:10px;">
              <div class="model-hold">
                <el-table :data="srcTableData">
                  <el-table-column type="index" width="80" label="序号">
                  </el-table-column>
                  <el-table-column prop="dispositionCategory" label="卡号" min-width="100">
                  </el-table-column>
                  <el-table-column min-width="150" label="卡片状态">
                    <template slot-scope="scope">
                      <span v-if="scope.row.targetFeature == '未登记'">单一布控</span>  
                      <span v-else>多维布控</span>  
                    </template>
                  </el-table-column>
                  <el-table-column label="姓名" min-width="140">
                    <template slot-scope="scope">
                      <span :class="{redText: scope.row.dispositionStatus == '布控中'}">{{scope.row.dispositionStatus}}</span>  
                    </template>
                  </el-table-column>
                  <!-- <el-table-column prop="creatTime" min-width="150" label="性别">
                  </el-table-column> -->
                  <el-table-column prop="applicantName" min-width="150" label="证件类型">
                  </el-table-column>
                  <el-table-column prop="reason" label="证件号码" min-width="140">
                  </el-table-column>  
                  <!-- <el-table-column prop="applicantName" min-width="150" label="人员类别">
                  </el-table-column>
                  <el-table-column prop="reason" label="住址" min-width="140">
                  </el-table-column>                 
                  <el-table-column prop="applicantName" min-width="150" label="电话">
                  </el-table-column>   -->
                  <el-table-column label="操作" min-width="300" fixed='right'>
                    <template slot-scope="scope">
                      <el-button type="text" size="small" class="operate-btn" @click="lostCard(scope.row)">
                        <i class="fa fa-pencil-square-o"></i> 挂失</el-button>
                      <el-button type="text" size="small" class="operate-btn" @click="deleteCard(scope.row)">
                        <i class="fa fa-undo"></i> 注销</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <el-pagination background @current-change="searchExcontrol" :page-size="10" :current-page.sync="currentPage" layout="total, prev, pager, next, jumper" :total="srcrestotal">
              </el-pagination>
            </div>

          </div>
        </div>

        <el-dialog
          title='新增卡片'
          :visible.sync="isShowNewMessageBox"
          width="430px"
          height="288px"
          class="modal-popover"
          :close-on-click-modal='false'
          >
          <el-form :model="addCardform" class="newform newclform" label-width="80px">
            <el-form-item label="卡号">
              <el-input v-model="addCardform.number"></el-input>
            </el-form-item>
            <el-form-item label="生效时间 ">
              <el-input v-model="addCardform.sxtime"></el-input>
            </el-form-item>
            <el-form-item label="截止时间 ">
              <el-input v-model="addCardform.jztime"></el-input>
            </el-form-item>
            <el-form-item label="业务范围">
              <el-checkbox-group v-model="addCardform.checkList">
                <el-checkbox label="门禁"></el-checkbox>
                <el-checkbox label="停车场"></el-checkbox>
                <el-checkbox label="可视对讲"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
           </el-form>
          <div slot="footer" class="dialog-footer" style="text-align:center;">
            <el-button type="primary" @click="isShowNewMessageBox = false" size='medium' style="width:120px;margin-right:50px;">取 消</el-button>
            <el-button type="primary" @click="newCard" size='medium' style="width:120px;">新增</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { excontrolApi, propertyApi } from "@/https";

export default {
  name: "kapianguanli",
  data() {
    return {
      srcrestotal: 0,
      currentPage: 1,
      controlpeople:null,
      controlcar:null,
      bukongkey:'',
      srcTableData:[],
      isShowNewMessageBox: false,
      addCardform: {
        number:'',
        sxtime:'',
        jztime:'',
        checkList:''
      }
    };
  },
  mounted() {
      this.getcontrolstate();
      this.searchExcontrol(1);
  },
  methods: {
    getcontrolstate(){
        // let param = {};
        // param.username = this.loginForm.username;
        // param.password = this.loginForm.password;
        return excontrolApi
        .excontrolgetBKstate({})
        .then(res => res)
        .then(data => {
            if(data.code==200)
            {
              this.controlpeople = data.data.person;
              this.controlcar = data.data.motorvehicle;
            }
        })
    },
    addNewCard() {
      this.isShowNewMessageBox = true;
    },
    lostCard(data) {
      // console.log(data)
      this.$router.push({path:'/bukongguanli/bukongxiangqing',query: {pro_id: data.dispositionID, type: 'edit'}});
    },
    deleteCard(data) {
      this.$confirm("确定要注销卡片？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        //注销卡片
        let param=data.dispositionID;
        return excontrolApi
        .excontrolRevoke(param)
        .then(res => res.data)
        .then(data => {
            this.searchExcontrol(1);
            this.$message({
              message: data.statusString,
              type: "success"
            });   
        })
      })         
      .catch(() => {
          
      });
    },
    searchExcontrol: function(ctrcurrentPage) {
      let param = {};
      param.pageNum = ctrcurrentPage;
      param.pageSize = 10;
      param.keyword = this.bukongkey;

      return excontrolApi
        .excontrolSearch(param)
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.srcrestotal = data.total;
          //生成表格
          this.srcTableData = data.pageData;
        });
    }, 
    newCard() {
      this.isShowNewMessageBox = false;
    }
  }
};
</script>

<style scoped>
.fn-bls {
  display: block;
  width: 180px;
  margin: 5px 0;
  float: left;
}
strong {
  font-weight: normal;
}
.dropdown-menu.force-to-show {
  display: block;
}

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

/* 布控要素行 */

.ic_yaosutable {
  display: table;
  border: 1px solid #dcebf7;
  width: 100%;
}

.ic_yaosurow {
  display: table-row;
}

.ic_yaosuname {
  text-align: right;
  padding: 6px 10px 6px 4px;
  vertical-align: middle;
  display: table-cell;
  background-color: #edf3f4;
  border-top: 1px solid #f7fbff;
  min-width: 90px;
}

.ic_yaosuvalue {
  padding-left: 12px;
  padding: 6px 4px 6px 6px;
  display: table-cell;
  width: 40%;
}

/* ---------------------------------------布控首页-------------------------------- */
.content-body {
  height:100%;
}
.content-row {
  height: calc(100% - 50px);
}
.content-center {
  height: 100%;
}
.model-hold {
  margin-bottom: 50px;
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
  min-height: calc(100% - 230px);
  height: auto;
  margin-bottom: 10px;
  position: relative;
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
  background: url(../../../../static/image/bukong/zaikongliang.png) no-repeat;
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
  width: 100%;
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
  padding: 10px 0px;
  cursor: pointer;
}
.add_bukong {
  background: url(../../../../static/image/bukong/addbukongry.png) no-repeat;
  background-size: auto 100%;
  background-position: left;
}
.cheliang_bukong {
  background: url(../../../../static/image/bukong/addbukongcl.png) no-repeat;
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
.redText {
  color: red;
}
/* ---------------------------------------布控首页结束-------------------------------- */
</style>