<template>
  <div id="contentbody" class="content-body">
    <div class="page-bread">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>布控管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-row">
      <div class="content-center">
        <div id="tongji">
          <div class="content-title">
            <span>布控情况</span>
          </div>
          <div style="margin:15px;display:flex;">
            <div id="zaikongliang" class="item_zaikongliang">
              <span class="icon_zaikongliang">在控量</span>
              <div style="width:100%;height:100%">
                <div class="item-bukong">
                  <p class='bukong-type'>
                    <span class="fa fa-user-o"></span> 人员</p>
                  <span class="spanman">
                    <strong class="num">{{controlpeople}}</strong> 人</span>
                </div>

                <div class="item-bukong">
                  <p class='bukong-type'>
                    <span class="fa fa-car"></span> 车辆</p>
                  <span class="spanman">
                    <strong class="num">{{controlcar}}</strong> 辆</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="bukong">
          <div class="content-title">
            <span>布控操作</span>
          </div>
          <div class="row">
            <div class="fn-bls">
              <router-link tag="div" id="addcontroldiv" class="ic_bukongbtn add_bukong" v-bind:to="'/zhinenggaojing/addrycontrol'">
              </router-link>
            </div>
            <div class="fn-bls">
              <router-link tag="div" id="controlyjdiv" class="ic_bukongbtn cheliang_bukong" v-bind:to="'/zhinenggaojing/addchecontrol'">
              </router-link>
            </div>
          </div>
        </div>
        <div class="clearfix"></div>
        <div id="bukongsearch" style="margin:20px 0;">
          <div class="content-title">
            <span>布控任务检索</span>
          </div>
          <div style="margin-top:20px;padding:0 10px;">
            <div class="search-group">
              <div class="search-item">
                <span class="label">告警日期：</span>
                <el-date-picker
                  v-model="datetimerange"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
              </div>
              <div class="search-item">
                <span class="label">布控编号：</span>
                <el-input v-model="bukongbh"></el-input>
              </div>
              <div class="search-item">
                <span class="label">布控类型：</span>
                <el-select v-model="bukongtype" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div class="search-item">
                <span class="label">关键字：</span>
                <el-input v-model="bukongkey">
                </el-input>
              </div>
              <span class="search-item">
                <button class="btn btn-info ridiusnull btn-search" type="button" @click="searchExcontrol(1)">查询</button>
              </span>
            </div>
            <div id="bukongsearchdiv" style="margin-top:10px;" v-show="srcresshow">
              <div class="model-hold">
                <el-table :data="srcTableData">
                  <el-table-column type="index" width="80" label="序号">
                  </el-table-column>
                  <el-table-column prop="dispositionCategory" label="布控类型" min-width="100">
                  </el-table-column>
                  <!-- <el-table-column prop="targetFeature" min-width="200" label="布控要素">
                  </el-table-column> -->
                  <el-table-column min-width="150" label="布控模式">
                    <template slot-scope="scope">
                      <span v-if="scope.row.targetFeature == '未登记'">单一布控</span>  
                      <span v-else>多维布控</span>  
                    </template>
                  </el-table-column>
                  <el-table-column label="状态" min-width="140">
                    <template slot-scope="scope">
                      <span :class="{redText: scope.row.dispositionStatus == '布控中'}">{{scope.row.dispositionStatus}}</span>  
                    </template>
                  </el-table-column>
                  <el-table-column prop="creatTime" min-width="150" label="布控时间">
                  </el-table-column>
                  <el-table-column prop="applicantName" min-width="150" label="布控发起人">
                  </el-table-column>
                  <el-table-column prop="reason" label="布控原因" min-width="140">
                  </el-table-column>                
                  <el-table-column label="操作" min-width="300" fixed='right'>
                    <template slot-scope="scope">
                      <el-button type="text" size="small" class="operate-btn" @click="lookbkdetail(scope.row)">
                        <i class="fa fa-file-text-o"></i> 布控详情</el-button>
                      <el-button type="text" size="small" class="operate-btn" @click="editbkdetail(scope.row)" v-if="canEdit(scope.row)">
                        <i class="fa fa-pencil-square-o"></i> 修改布控</el-button>
                      <el-button type="text" size="small" class="operate-btn" @click="deletebkdetail(scope.row)" v-if="scope.row.dispositionStatus == '布控中' ">
                        <i class="fa fa-undo"></i> 撤销布控</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <el-pagination background @current-change="searchExcontrol" :page-size="10" :current-page.sync="currentPage" layout="total, prev, pager, next, jumper" :total="srcrestotal">
              </el-pagination>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { excontrolApi } from "@/https";

export default {
  name: "bukongguanli",
  data() {
    return {
      srcrestotal: 0,
      currentPage: 1,
      srcresshow: true,
      datetimerange: [],
      controlpeople:null,
      controlcar:null,
      options: [
        {
          label: '车辆',
          value: '3'
        },{
          label: '人员',
          value: '2'
        }
      ],
      bukongtype: '',
      bukongkey:'',
      bukongbh: '',
      srcTableData:[],
      dxpp:'',
      cpcolorlist:[
        {
          label:"黑色",
          value:"1",
        },
        {
          label:"白色",
          value:"2",
        },
        {
          label:"灰色",
          value:"3",
        },
        {
          label:"红色",
          value:"4",
        },
        {
          label:"蓝色",
          value:"5",
        },
        {
          label:"黄色",
          value:"6",
        },
        {
          label:"橙色",
          value:"7",
        },
        {
          label:"棕色",
          value:"8",
        },
        {
          label:"绿色",
          value:"9",
        },
        {
          label:"紫色",
          value:"10",
        },
        {
          label:"青色",
          value:"11",
        },
        {
          label:"粉色",
          value:"12",
        },
        {
          label:"透明",
          value:"13",
        },
        {
          label:"其他",
          value:"99",
        },
      ],
      cphm:'',
      cpys:'',
      clpp:'',
      clys:'',
      ryID:'',
      ryxm:'',
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
        this.clearSearchItem();
        this.getcontrolstate();
        this.searchExcontrol(1);
      }
      this.$route.meta.isBack = false;
  },
  mounted() {
      this.clearSearchItem();
      this.getcontrolstate();
      this.searchExcontrol(1);
  },
  components: {
  },
  methods: {
    getCLcolor(ysdm)
    {
      var ys = '';
      this.cpcolorlist.forEach((o) => {
        if(o.value ==ysdm)
        {
          ys = o.label
         
        }      
      });
      return ys;
    },
    // dispositionStatus(status){
    //     if(status==0)
    //         {
    //           return "布控中";
    //         }
    //         else if(status==1)
    //         {
    //           return "已撤控";
    //         }
    //         else if(status==2)
    //         {
    //           return "布控到期";
    //         }
    //         else if(status==9)
    //         {
    //           return "未布控";
    //         }
    // },

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
    canEdit(data) {
      if (data.dispositionStatus != '布控到期' && data.dispositionStatus != '已撤控') {
        return true;
      } else {
        return false;
      }

    },
    lookbkdetail(data) {
      // console.log(data)
      this.$router.push({path:'/zhinenggaojing/bukongxiangqing',query: {pro_id: data.dispositionID,type: 'show',defaultActive: 'first'}});
    },
    editbkdetail(data) {
      // console.log(data)
      this.$router.push({path:'/zhinenggaojing/bukongxiangqing',query: {pro_id: data.dispositionID, type: 'edit'}});
    },
    deletebkdetail(data) {
      // this.$confirm("确定要撤销布控？", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning"
      // })
      this.$prompt('请输入撤控原因', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /[\u4E00-\u9FA5A-Za-z0-9]+/,
          inputErrorMessage: '不能只输入特殊字符！'
      })
      .then(({ value }) => {
        //撤销布控
        let param = {};
        // param.dispositionID = data.dispositionID;
        // param.cancelReason = value;
        
        return excontrolApi
        .excontrolRevoke(data.dispositionID, value)
        .then(res => res.data)
        .then(data => {
            this.searchExcontrol();
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
      param.pageNum = ctrcurrentPage || this.currentPage;
      param.pageSize = 10;
      if (this.datetimerange) {
        param.beginTime = this.datetimerange[0];
        param.endTime = this.datetimerange[1];
      }
      param.dispositionCategory = this.bukongtype;
      param.dispositionID = this.bukongbh;
      param.keyword = this.bukongkey;
      // param = Object.assign(param, this.yjquery);


      // param.query = this.yjquery;
      //  let loading = this.$loading({
      //   lock: true,
      //   text: "数据查询中",
      //   spinner: "el-icon-loading",
      //   background: "rgba(0, 0, 0, 0.7)"
      // });
      return excontrolApi
        .excontrolSearch(param)
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.srcrestotal = data.total;
          //生成表格
          this.srcTableData = data.pageData;
          for(var i=0;i<this.srcTableData.length;i++)
          {
            this.srcTableData[i].reason = this.getBkyy(this.srcTableData[i].reason, this.srcTableData[i].dispositionCategory);
            if(this.srcTableData[i].dispositionCategory=="2")
            {
              this.srcTableData[i].dispositionCategory="人员";
            }
            else if(this.srcTableData[i].dispositionCategory=="3")
            {
              this.srcTableData[i].dispositionCategory="车辆";
            }

            if(this.srcTableData[i].dispositionStatus==0)
            {
              this.srcTableData[i].dispositionStatus="布控中";
            }
            else if(this.srcTableData[i].dispositionStatus==1)
            {
              this.srcTableData[i].dispositionStatus="已撤控";
            }
            else if(this.srcTableData[i].dispositionStatus==2)
            {
              this.srcTableData[i].dispositionStatus="布控到期";
            }
            else if(this.srcTableData[i].dispositionStatus==9)
            {
              this.srcTableData[i].dispositionStatus="未布控";
            }

            this.srcTableData[i].creatTime = this.getFormatDate(this.srcTableData[i].creatTime);
            this.srcTableData[i].beginTime = this.getFormatDate(this.srcTableData[i].beginTime);
            this.srcTableData[i].endTime = this.getFormatDate(this.srcTableData[i].endTime);

            if (this.srcTableData[i].dispositionCategory=="车辆" &&　this.srcTableData[i].targetFeature)
            {
              let string='';
              if(this.srcTableData[i].targetFeature.plateNo!=null)
              {
                this.cphm = this.srcTableData[i].targetFeature.plateNo;
                string += this.cphm;
              }
              if(this.srcTableData[i].targetFeature.brand!=null)
              {
                this.clpp = this.getCLpp(this.srcTableData[i].targetFeature.brand);
                string += '-' + this.clpp;
              }
              if(this.srcTableData[i].targetFeature.plateColor!=null)
              {
                this.cpys = this.getCLcolor(this.srcTableData[i].targetFeature.plateColor);
                string += '-' + this.cpys;
              }
              
              this.srcTableData[i].targetFeature =  string;
        //      this.srcTableData[i].targetFeature = this.clpp   + this.cpys   + this.cphm;
            }
            else if(this.srcTableData[i].dispositionCategory=="人员" &&　this.srcTableData[i].targetFeature)
            {
              let stringry ='';
              this.ryID = '未登记';
              if(this.srcTableData[i].targetFeature.idCard!=null)
              {
                let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                if (reg.test(this.srcTableData[i].targetFeature.idCard)) {
                  this.ryID = this.srcTableData[i].targetFeature.idCard;
                }
              }
              stringry += this.ryID;
              if(this.srcTableData[i].targetFeature.name!=null)
              {
                this.ryxm = this.srcTableData[i].targetFeature.name;
                stringry += '-' + this.ryxm;
              }
              
              this.srcTableData[i].targetFeature = stringry;
       //       this.srcTableData[i].targetFeature = this.ryID;
            }
          //         {
          //  var str="hello(world)";
          //  if(this.srcTableData[i].targetFeature!=null)
          //  {
          //         var str = this.srcTableData[i].targetFeature;
          //         var nstr = str.replace(/\(|\)/g,"");
          //         var splitstr =[];
          //         splitstr = nstr.split("and");
          //         if(this.srcTableData[i].dispositionCategory=="车辆")
          //         {
          //             for(var j=0;j<splitstr.length;j++)
          //             {
          //               var dsplitstr = [];
          //               dsplitstr = splitstr[j].split("=");
          //               if(dsplitstr[0] =="4")
          //               {
          //                 this.cpys = this.getCLcolor(dsplitstr[1]);
          //               }
          //               else if(dsplitstr[0] == "5")
          //               {
          //                 this.clpp = this.getCLpp(dsplitstr[1]);
          //               }
          //               else if(dsplitstr[0] == "3")
          //               {
          //                   this.cphm = dsplitstr[1];
          //               }
          //             }
          //             this.srcTableData[i].targetFeature = this.clpp   + this.cpys   + this.cphm;
          //         }
          //         else if(this.srcTableData[i].dispositionCategory=="人员")
          //         {
          //               for(var j=0;j<splitstr.length;j++)
          //             {
          //               var dsplitstr = [];
          //               dsplitstr = splitstr[j].split("=");
          //               if(dsplitstr[0] =="2")
          //               {
          //                 this.ryID = dsplitstr[1];
          //               }
                      
          //             }
          //             this.srcTableData[i].targetFeature = this.ryID;
          //         }
          //     }


                // this.srcTableData[i].tollgateList = this.srcTableData[i].tollgateList || [];
            }

        });
    },  
    getBkyy(reason, type) {
     if (type == '3') {
        for (let i=0;i<this.bkyys.length;i++) {
          if (this.bkyys[i].value == reason) {
            reason = this.bkyys[i].label;
            break;
          }
        }
      }
      return reason;
    },
    clearSearchItem() {
      this.datetimerange = [];
      this.bukongtype = '';
      this.bukongkey = '';
      this.bukongbh = '';
    },
  }
};
</script>

<style scoped>
.fn-bls {
  display: block;
  width: 45%;
  max-width: 220px;
  margin: 5px 5% 5px 0;
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
  width: 50%;
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
  width: 600px;
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