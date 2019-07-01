<template>
<div class="content-body add-control">
    <div class="page-bread">
      <el-breadcrumb>
        <el-breadcrumb-item>时空分析</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="content-navbar">
        <ul class="tabs-hold">
          <li :class="{active: showpart == 2}">
            <a class="tab-ank" v-on:click="togpart(2)">目标分析</a>
          </li>

          <li :class="{active: showpart == 3}">
            <a class="tab-ank" v-on:click="togpart(3)">案事件分析</a>
          </li>

        </ul>
    </div>

    <div class="content-row">
      <div class="bl-content">
        <div class="content-left">
          <div class="content-title" style="margin-bottom:10px;">
            <span>目标分析列表</span>
          </div>

          <div  v-show="showpart == 2">
          <div class="search-item">
                <span class="label">告警日期：</span>
                <el-date-picker
                    v-model="datetimerange"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    style="width:274px;"
                    value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
          </div>
          <div class="search-item" style="margin-top:10px;display:inline-block;margin-right: 0px;">
                <span class="label">人/车：</span>
                <el-select v-model="baojingtype"  placeholder="请选择" clearable style="width:86px;margin-left: -2px;">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    >
                  </el-option>
                </el-select>
          </div>
          <div class="search-item" style="width:120px;display:inline-block;margin-left: -6px;margin-right: 4px;">
            <el-input v-model="skbaojingkey">
            </el-input>
          </div>
          <span class="search-item" style="width:60px;display:inline-block;">
            <button class="btn btn-info ridiusnull btn-search" type="button" @click="searchExcontrol(1)">查询</button>
          </span>
            <!-- <gaojingliebiao ref="gaojingliebiao"></gaojingliebiao> -->
            <div class="model-hold details-bukong" >
              <div  v-show="showCarList">
              <el-table :data="srcTableDatacp" @row-click="clTrack">
                  <el-table-column type="index" width="60" label="序号" align="center">
                  </el-table-column>
                  <el-table-column prop="plateNo" width="120" label="车牌号">
                  </el-table-column>
                  <el-table-column prop="vehicleBrand" label="车型" width="100">
                  </el-table-column>
                  <el-table-column prop="vehicleColor" width="120" label="车辆颜色">
                  </el-table-column>
              </el-table>
              <el-pagination background @current-change="searchExcontrol" :page-size="20" :pager-count="5" layout="total, prev, pager, next" :total="srcrestotal">
              </el-pagination>
              </div>
              <div v-show="showPepleList">
              <el-table :data="srcTableDatarm" @row-click="ryTrack">
                  <el-table-column type="index" width="60" label="序号" align="center">
                  </el-table-column>
                  <el-table-column prop="name" width="80" label="姓名">
                  </el-table-column>
                  <el-table-column prop="genderCode" label="性别" width="60">
                  </el-table-column>
                  <el-table-column prop="idnumber" width="160" label="身份证">
                  </el-table-column>
              </el-table>
              <el-pagination background @current-change="searchExcontrol" :page-size="20" :pager-count="5" layout="total, prev, pager, next" :total="srcrestotal">
              </el-pagination>
              </div>
              
            </div>
          </div>

          <div  v-show="showpart == 3">
              <div class="search-item" style="display:inline-block;margin-right: 0px;">
                <span class="label">案件编号：</span>              
                <el-input v-model="ajbh" style="width:270px;">
              </el-input>
              </div>
              <div class="search-item" style="margin-top:10px;display:inline-block;margin-right: 0px;">
                <span class="label">查询半径：</span>
                <el-select v-model="cxbj"  placeholder="请选择" clearable>
                  <el-option
                    v-for="item in bjoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    >
                  </el-option>
                </el-select>
                <span class="search-item" style="width:76px;display:inline-block;">
                  <button class="btn btn-info ridiusnull btn-search" style="width:78px;" type="button" @click="searchsj(1)">查询</button>
                </span>
              </div>
              
              <div class="model-hold details-bukong">
                <el-table :data="anjianTableData">
                    <el-table-column type="index" width="80" align="center" label="序号">
                    </el-table-column>
                    <el-table-column prop="name" label="发现位置" align="center">
                    </el-table-column>
                </el-table>
                
                <el-pagination background @current-change="searchsj" :page-size="20" :pager-count="5" layout="total, prev, pager, next" :total="anjiantotal">
                </el-pagination>
            </div>

          </div>

        </div>
        <div class="content-right">
              <baidu-map ref="baidumap"></baidu-map>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { controlApi } from "@/http";
// import { mapState} from "vuex";
import KakouTree from "@/components/Control/KakouTree";
import Bukongxinxi from "@/components/Control/Bukongxinxi";
import Gaojingliebiao from "@/components/Control/Gaojingliebiao";
import { excontrolApi } from "@/https";
import eventBus from "@/event";
import { eventCollection } from "@/event/resources";
import baidumap from "@/components/baidumap/mapInit";

export default {
  name: "bukongxiangqing",
  data() {
    return {
      srcTableDatacp: [],
      srcTableDatarm: [],
      showCarList: false,
      showPepleList: false,
      backssgj: false,
      bkBasicData: {
        targetFeature: {},
        targetImageURI: "",
        dispositionCategory: "",
        tollgateList: []
      },
      addtype: "",
      bkID: "",
      showTab: true,
      activeName: "first",
      title: "布控详情",
      srcrestotal: 1000,
      //限制日期选择范围
      datepickerlimit: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      datetimerange: [],
      showpart: 2,
      baojingtype: "",
      options: [
        {
          label: "车牌号码",
          value: "3"
        },
        {
          label: "人/姓名",
          value: "2"
        },
        {
          label: "人/身份证",
          value: "4"
        }
      ],
      bjoptions: [
        {
          label: "0.5公里",
          value: "0.5"
        },
        {
          label: "一公里",
          value: "1"
        },
        {
          label: "五公里",
          value: "5"
        },
        {
          label: "十公里",
          value: "10"
        },
        {
          label: "三十公里",
          value: "30"
        }
      ],
      skbaojingkey: "",
      ajbh: "",
      cxbj: "",
      anjiantotal: 0,
      anjianTableData: [],
      cpcolorlist: [
        {
          label: "黑色",
          value: "1"
        },
        {
          label: "白色",
          value: "2"
        },
        {
          label: "灰色",
          value: "3"
        },
        {
          label: "红色",
          value: "4"
        },
        {
          label: "蓝色",
          value: "5"
        },
        {
          label: "黄色",
          value: "6"
        },
        {
          label: "橙色",
          value: "7"
        },
        {
          label: "棕色",
          value: "8"
        },
        {
          label: "绿色",
          value: "9"
        },
        {
          label: "紫色",
          value: "10"
        },
        {
          label: "青色",
          value: "11"
        },
        {
          label: "粉色",
          value: "12"
        },
        {
          label: "透明",
          value: "13"
        },
        {
          label: "其他",
          value: "99"
        }
      ]
    };
  },
  created() {
    let type = this.$route.query.type;
    if (type == "edit") {
      this.title = "修改布控";
      this.showTab = false;
    }
    this.bkID = this.$route.query.pro_id;
    this.activeName = this.$route.query.defaultActive;

    // //卡口数据改变，修改对应数据
    // eventBus.$on(
    //   eventCollection.EXCONTROL_GET_SELECTED_CAKOU,
    //   (value, node) => {
    //     this.bkBasicData.tollgateList = value;
    //   }
    // );

    // //撤销成功，刷新数据
    // eventBus.$on(eventCollection.UPDATE_DETAILS_DATA, () => {
    //   this.getbkDetail();
    // });

    // //转换为修改布控页面
    // eventBus.$on(eventCollection.SWITCH_EDIT_DETAILS, () => {
    //   this.title = "修改布控";
    //   this.showTab = false;
    // });
  },
  mounted() {
    if (this.$route.query.defaultActive == "first") {
      this.backssgj = false;
    } else if (this.$route.query.defaultActive == "third") {
      this.backssgj = true;
    }

    // this.getbkDetail();
  },
  components: {
    "kakou-tree": KakouTree,
    bukongxinxi: Bukongxinxi,
    gaojingliebiao: Gaojingliebiao,
    "baidu-map": baidumap
  },
  methods: {
    togpart(val) {
      this.showpart = val;
      this.$refs.baidumap.clear();
    },
    getCLcolor(ysdm) {
      var ys = "";
      this.cpcolorlist.forEach(o => {
        if (o.value == ysdm) {
          ys = o.label;
        }
      });
      return ys;
    },

    ryTrack: function(row) {
      console.log(row.idnumber);
      console.log(row);
      this.searchTrack(row);
    },
    clTrack: function(row) {
      console.log(row.idnumber);
      console.log(row);
      this.searchTrack(row);
    },
    searchExcontrol: function(ctrcurrentPage) {
      // let _this = this;
      // this.getGaojingList(_this.baojingtype,_this.skbaojingkey,_this.datetimerange);

      if (this.baojingtype == "") {
        this.$alert("请选择查询类型，并输入查询条件", "提示", {
          confirmButtonText: "确定"
        });
      }

      let param = {};
      param.pageNum = ctrcurrentPage;
      param.pageSize = 20;

      if (
        this.baojingtype == 3 &&
        this.skbaojingkey != "" &&
        this.datetimerange
      ) {
        param.plateNo = this.skbaojingkey;
        param.beginPassTime = this.datetimerange[0];
        param.endPassTime = this.datetimerange[1];
        return excontrolApi
          .skmotorVehicleSearch(param)
          .then(res => res.data)
          .then(data => {
            this.showCarList = true;
            this.showPepleList = false;
            this.srcrestotal = data.total;
            //生成表格
            this.srcTableDatacp = data.pageData;
            for (var i = 0; i < this.srcTableDatacp.length; i++) {
              if (this.srcTableDatacp[i].vehicleBrand != null) {
                this.srcTableDatacp[i].vehicleBrand = this.getCLpp(
                  this.srcTableDatacp[i].vehicleBrand
                );
              }

              if (this.srcTableDatacp[i].vehicleColor != null) {
                this.srcTableDatacp[i].vehicleColor = this.getCLcolor(
                  this.srcTableDatacp[i].vehicleColor
                );
              }
            }
          });

        //触发地图显示
        eventBus.$emit(eventCollection._gaojingliebiao2map, this.srcTableData);
      } else if (
        (this.baojingtype == 3 && this.skbaojingkey == "") ||
        !this.datetimerange
      ) {
        this.$alert("请输入完整的车牌号和选择查询时间范围", "提示", {
          confirmButtonText: "确定"
        });
      }

      if (
        (this.baojingtype == 2 || this.baojingtype == 4) &&
        (this.skbaojingkey != "" && this.datetimerange)
      ) {
        param.beginTriggerTime = this.datetimerange[0];
        param.endTriggerTime = this.datetimerange[1];
        if (this.baojingtype == 4) {
          //查身份证
          param.idNumber = this.skbaojingkey;
        } else if (this.baojingtype == 2) {
          //查姓名
          param.name = this.skbaojingkey;
        }
        return excontrolApi
          .skPersonSearch(param)
          .then(res => res.data)
          .then(data => {
            this.showCarList = false;
            this.showPepleList = true;
            this.srcrestotal = data.total;
            //生成表格
            this.srcTableDatarm = data.pageData;
            // for (var i = 0; i < this.srcTableDatarm.length; i++) {
            //     if (this.srcTableDatarm[i].targetFeature.idCard != null) {
            //       this.ryID = this.srcTableDatarm[i].targetFeature.idCard;
            //     }
            //     if (this.srcTableDatarm[i].targetFeature.name != null) {
            //       this.ryxm = this.srcTableData[i].targetFeature.name;
            //     }

            //     this.srcTableData[i].targetFeature = stringry;

            // }

            //触发地图显示
            eventBus.$emit(
              eventCollection._gaojingliebiao2map,
              this.srcTableData
            );
            // console.log("告警列表数据");
            // console.log(this.srcTableData);
          });
      } else if (
        (this.baojingtype == 2 || this.baojingtype == 4) &&
        (this.skbaojingkey == "" || !this.datetimerange)
      ) {
        this.$alert("请输入完整的信息和选择查询时间范围", "提示", {
          confirmButtonText: "确定"
          // callback: action => {
          //   this.$message({
          //     type: 'info',
          //     message: `action: ${ action }`
          //   });
          // }
        });
      }
    },
    searchsj: function(ctrcurrentPage) {
      let _this = this;
      let param = {};
      param.pageNum = ctrcurrentPage;
      param.pageSize = 20;

      if (_this.ajbh != "" && _this.cxbj != "") {
        this.$refs.baidumap.clear();
        param.caseID = _this.ajbh;
        param.radius = _this.cxbj;
        return excontrolApi
          .skCaseSearch(param)
          .then(res => res.data)
          .then(data => {
            _this.anjiantotal = data.resource.length;
            //生成表格
            _this.anjianTableData = data.resource;
            data.radius = _this.cxbj;

            //触发地图显示
            eventBus.$emit(eventCollection._anjian2map, data);
          });
      } else if (_this.ajbh == "" || _this.cxbj == "") {
        this.$alert("请输入完整的案件编号和选择查询半径", "提示", {
          confirmButtonText: "确定"
        });
      }
    },
    backbkgl() {
      this.$router.push({ path: "/bukonggaojing/bukongguanli" });
    },
    submitEdit: function() {
      let param = [{}];

      param[0].dispositionID = this.bkID;
      param[0].beginTime = this.str2DataTime(this.datetimerange[0]);
      param[0].endTime = this.str2DataTime(this.datetimerange[1]);
      param[0].tollgateList = this.bkBasicData.tollgateList.join(";");

      return excontrolApi.excontrolModify(param).then(data => {
        this.$message({
          message: "修改布控成功！",
          type: "success"
        });
      });
    },
    handleClick(tab, event) {
      if (tab.index == 2) {
        this.getGaojingList(this.bkBasicData.dispositionCategory, this.bkID);
      }
    },
    getGaojingList(type, key, datatimerange) {
      this.$refs.gaojingliebiao.getGaojingliebiaoShikongData(
        type,
        key,
        datatimerange
      );
    },

    searchTrack: function(data) {
      // let _this = this;
      // this.getGaojingList(_this.baojingtype,_this.skbaojingkey,_this.datetimerange);

      if (this.baojingtype == "") {
        this.$alert("请选择查询类型，并输入查询条件", "提示", {
          confirmButtonText: "确定"
        });
      }
      if (this.datetimerange.length == 0) {
        this.$alert("请选择时间", "提示", {
          confirmButtonText: "确定"
        });
      }

      let param = {};

      if (this.baojingtype == 3) {
        //车辆
        param.plateNo = data.plateNo; //||this.skbaojingkey;
        param.beginPassTime = this.str2DataTime(this.datetimerange[0]);
        param.endPassTime = this.str2DataTime(this.datetimerange[1]);
        return excontrolApi
          .skmotorVehicleTrack(param)
          .then(res => res.data)
          .then(data => {
            console.log(data);
            if (data.length == 0) {
              this.$alert("数据为空", "提示", {
                confirmButtonText: "确定"
              });
              return;
            }
            eventBus.$emit(eventCollection._gaojingliebiao2map, data);
          });
      } else if (this.baojingtype == 4) {
        //查身份证
        param.idNumber = this.skbaojingkey;

        param.beginTriggerTime = this.str2DataTime(this.datetimerange[0]); //"2018-11-1";
        param.endTriggerTime = this.str2DataTime(this.datetimerange[1]); //"2018-11-21";

        return excontrolApi
          .skPersonTrack(param)
          .then(res => res.data)
          .then(data => {
            console.log(data);
            // console.log("告警列表数据");
            // console.log(this.srcTableData);
            if (data.length == 0) {
              this.$alert("数据为空", "提示", {
                confirmButtonText: "确定"
              });
              return;
            }
            eventBus.$emit(eventCollection._gaojingliebiao2map, data);
          });
      } else if (this.baojingtype == 2) {
        //查姓名
        // param.name = this.skbaojingkey;
        param.idNumber = data.idnumber;
        param.beginTriggerTime = this.str2DataTime(this.datetimerange[0]); //"2018-11-1";
        param.endTriggerTime = this.str2DataTime(this.datetimerange[1]); //"2018-11-21";
        return excontrolApi
          .skPersonTrack(param)
          .then(res => res.data)
          .then(data => {
            console.log(data);
            if (data.length == 0) {
              this.$alert("数据为空", "提示", {
                confirmButtonText: "确定"
              });
              return;
            }
            eventBus.$emit(eventCollection._gaojingliebiao2map, data);
            // console.log("告警列表数据");
            // console.log(this.srcTableData);
          });
      }
    }
  }
};
</script>
<style>
input[type="file"] {
  display: none;
}
.el-date-editor .el-range-input {
  font-size: x-small;
}

.el-date-editor .el-range-separator {
  width: 10%;
}
</style>
<style scoped>
.content-row {
  padding: 0;
  height: 100%;
}
.bl-content {
  width: 1400px;
  height: calc(100vh - 180px);
  margin: 0;
  width: 100%;
  box-sizing: border-box;
  background: #fff;
}
.bk-content {
  width: 98%;
  height: 100%;
  margin: 30px auto;
}
.content-navbar {
  margin-bottom: 20px;
  padding: 0;
  height: 30px;
  line-height: 30px;
  border-bottom: 1px solid #d9dfe5;
}
.content-left {
  width: 360px;
  height: 100%;
  float: left;
  border: 1px solid #ccc;
}
.content-right {
  width: calc(100% - 360px);
  height: 100%;
  margin-left: 360px;
  border: 1px solid #ccc;
  border-left: none;
}
.picture-hold {
  display: inline-block;
  width: 110px;
  height: 300px;
  margin-top: 30px;
}
.pic-btn {
  width: 104px;
  height: 28px;
  line-height: 24px;
  margin-top: 10px;
  text-align: center;
  /* background: #f1f4f5; */
  /* border: 1px solid #d8dfe5; */
}
.pic-wrap {
  position: relative;
  margin-top: 10px;
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
  width: 100%;
  height: 80px;
  left: 0;
  top: 0;
  font-size: 40rem;
}
.up-text {
  position: absolute;
  width: 100%;
  bottom: 30px;
  left: 0;
  height: 20px;
  line-height: 20px;
  text-align: center;
  color: #a8c1d8;
}
.btnmargin {
  margin-right: 30px;
}
.btn-info {
  width: 120px;
  height: 40px;
  background: #12b1e1;
}
.show_details {
  height: calc(100% - 80px);
}
.edit_details {
  height: calc(100% - 200px);
}

.tabs-hold {
  height: 28px;
  line-height: 28px;
}
.tabs-hold > li {
  margin: 0;
  display: inline-block;
  padding: 0 10px;
  font-weight: bold;
}
.tabs-hold > li.active {
  border-bottom: 3px solid #13b1e1;
}
.tabs-hold > li.active .tab-ank:after {
  background: none;
}
.tabs-hold .tab-ank {
  color: #555;
}
.tabs-hold .active .tab-ank {
  color: #13b1e1;
}
.tabs-hold .tab-ank:hover {
  text-decoration: none;
}

.search-item {
  display: flex;
  margin-right: 8px;
  flex-direction: row;
  flex: 0 1 auto;
  align-items: center;
  font-size: 12px;
}
.search-item .label {
  color: #595959;
  font-weight: normal;
  width: 70px;
  display: inline-block;
  text-align: right;
  padding: 0;
}
.btn-search {
  width: 60px;
  height: 32px;
  line-height: 32px;
  padding: 0;
}
</style> 