<template>
  <div id="contentbody" class="content-body">
    <div class="page-bread">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>报修服务</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-row">
      <div class="content-center">
        <div>
            <div>
              <router-link tag="div" id="addcontroldiv" class="ic_bukongbtn add_bukong" v-bind:to="'#'">
              </router-link>
            </div>
        </div>
        <div class="clearfix"></div>
        <div id="bukongsearch" style="margin:20px 0;">
          <div class="content-title">
            <span>报修检索</span>
          </div>
          <div style="margin-top:20px;padding:0 10px;">
            <div class="search-group">
              <div class="search-item">
                <span class="label">上报时间：</span>
                <el-date-picker
                  v-model="datetimerange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </div>
              <div class="search-item">
                <span class="label">报修类别：</span>
                <el-select v-model="baoxiutype"  placeholder="请选择" clearable>
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div class="search-item">
                <span class="label">处理状态：</span>
                <el-select v-model="candlestatus"  placeholder="请选择" clearable>
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
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
                  <el-table-column prop="address" label="地址" min-width="140">
                  </el-table-column>
                  <el-table-column prop="category" label="服务类别" min-width="140">
                  </el-table-column>
                  <el-table-column prop="createtime" label="上报时间" min-width="150" >
                  </el-table-column>
                  <el-table-column prop="host" label="房主" min-width="140">
                  </el-table-column>
                  <el-table-column prop="hostphone" label="联系电话" min-width="140">
                  </el-table-column>
                  <el-table-column prop="state" label="处理状态" min-width="140">
                  </el-table-column>
                  <el-table-column prop="repairman" label="处理人" min-width="140">
                  </el-table-column>
                  <el-table-column label="操作" min-width="300" fixed='right'>
                    <template slot-scope="scope">
                      <el-button type="text" size="small" class="operate-btn" @click="lookbkdetail(scope.row)">
                        <i class="fa fa-file-text-o"></i> 查看详情</el-button>
                      <el-button type="text" size="small" class="operate-btn" @click="editbkdetail(scope.row)" v-if="scope.row.repairman==null">
                        <i class="fa fa-pencil-square-o"></i> 派单</el-button>
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
      options: [
        {
          label: '灯具线路',
          value: '灯具线路'
        },{
          label: '龙头管件',
          value: '龙头管件'
        },
        {
          label: '卫浴洁具',
          value: '卫浴洁具'
        },{
          label: '门窗家具',
          value: '门窗家具'
        },
        {
          label: '打孔疏通',
          value: '打孔疏通'
        },{
          label: '开锁换锁',
          value: '开锁换锁'
        }
      ],
      statusOptions: [
        {
          label: '未处理',
          value: '1'
        },{
          label: '处理中',
          value: '2'
        },
        {
          label: '已处理',
          value: '3'
        }
      ],
      baoxiutype: '',
      candlestatus:'',
      bukongkey:'',
      srcTableData:[],
     
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
        this.searchExcontrol(1);
      }
      this.$route.meta.isBack = false;
  },
  mounted() {
      // this.searchExcontrol(1);
  },
  components: {
  },
  methods: {  
    lookbkdetail(data) {
      // console.log(data)
      // this.$router.push({path:'/bukonggaojing/bukongxiangqing',query: {pro_id: data.dispositionID,type: 'show',defaultActive: 'first'}});
    },
    editbkdetail(data) {
      // console.log(data)
      // this.$router.push({path:'/bukonggaojing/bukongxiangqing',query: {pro_id: data.dispositionID, type: 'edit'}});
    },

    searchExcontrol: function(ctrcurrentPage) {
      let param = {};
      param.pageNum = ctrcurrentPage;
      param.pageSize = 10;
      if (this.datetimerange) {
        param.startDate = this.datetimerange[0];
        param.endDate = this.datetimerange[1];
      }
      if(this.baoxiutype)
      {
        param.category = this.baoxiutype;
      }

      if(this.candlestatus)
      {
        param.state = this.candlestatus;
      }

      // param = Object.assign(param, this.yjquery);
      // param.query = this.yjquery;
      //  let loading = this.$loading({
      //   lock: true,
      //   text: "数据查询中",
      //   spinner: "el-icon-loading",
      //   background: "rgba(0, 0, 0, 0.7)"
      // });
      return excontrolApi
        .wyBaoxiuSearch(param)
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.srcrestotal = data.total;
          //生成表格
          this.srcTableData = data.rows;
          for(var i=0;i<this.srcTableData.length;i++)
          {
            if(this.srcTableData[i].state==1)
            {
              this.srcTableData[i].state="未处理";
            }
            else if(this.srcTableData[i].state==2)
            {
              this.srcTableData[i].state="处理中";
            }
            else if(this.srcTableData[i].state==3)
            {
              this.srcTableData[i].state="已处理";
            }

            this.srcTableData[i].createtime = this.getFormatDate(this.srcTableData[i].createtime);
            }
        });
    },  
    
    

  },
  components: {
  }
};
</script>

<style scoped>
/* .fn-bls {
  display: block;
  width: 180px;
  margin: 5px 0 5px 50px;
  float: left;
} */
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

#bukongsearch {
  min-height: calc(100vh - 250px);
  margin-bottom: 10px;
  position: relative;
}
.model-hold {
  margin-bottom: 50px;
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
  background: url(../../../../static/image/wuyefuwu/baoxiudengji.png) no-repeat;
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
/* ---------------------------------------布控首页结束-------------------------------- */
</style>