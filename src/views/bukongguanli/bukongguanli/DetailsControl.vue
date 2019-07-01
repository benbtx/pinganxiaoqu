<template>
<div class="content-body add-control">
    <div class="page-bread">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/zhinenggaojing/bukongguanli'}">布控管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-row">
      <div class="bl-content">
        <div style="text-align: center;padding-bottom: 20px;background: #f5f5f5;" v-show="!showTab">    
            布控时间：<el-date-picker v-model="datetimerange" unlink-panels type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:440px" :picker-options="datepickerlimit" value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
        </div>
        <div :class="{show_details: showTab, edit_details: !showTab}">
          <div class="bk-content">
            <div class="content-left">
              <el-tabs v-model="activeName" v-show="showTab" @tab-click="handleClick" type="card">
                <el-tab-pane label="布控信息" name="first">
                    <bukongxinxi :bkBasicData="bkBasicData"></bukongxinxi>
                </el-tab-pane>
                <el-tab-pane label="布控范围" name="second">
                  <kakou-tree ref="kakou" :cakoudefault="bkBasicData.tollgateList" :addtype="addtype" showType="details"></kakou-tree>
                </el-tab-pane>
                <el-tab-pane label="告警列表" name="third">
                    <gaojingliebiao ref="gaojingliebiao"></gaojingliebiao>
                </el-tab-pane>
              </el-tabs>
              <div v-show="!showTab">
                <kakou-tree :cakoudefault="bkBasicData.tollgateList" :addtype="addtype"></kakou-tree>
              </div>
            </div>
            <div class="content-right">
               <baidu-map ref="baidumap" :showKaKouTool="showKaKouTool" :removeGaojingLayer="removeGaojingLayer" :showGaojingRoute="showGaojingRoute" :activeName="activeName" :cakoudefault="bkBasicData.tollgateList" :addtype="addtype"  :mapData="{page:'detailscontrol',showpart:'2'}"></baidu-map>       
            </div>
          </div>
        </div>
        <div style="text-align: center;padding: 15px;background: #f5f5f5;" v-show="!showTab">    
            <button type="button" class="btn btn-info btnmargin" @click="submitEdit">确定</button>
            <button type="button" class="btn btn-info" @click="backbkgl">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { controlApi } from "@/http";
// import { mapState} from "vuex";
import shebeiTree from "@/components/Control/ShebeiTree";
import Bukongxinxi from "@/components/Control/Bukongxinxi";
import Gaojingliebiao from "@/components/Control/Gaojingliebiao";
import { excontrolApi } from "@/https";
import eventBus from "@/event";
import { eventCollection } from "@/event/resources";
import baidumap from "@/components/baidumap/mapInit";
import merge from "webpack-merge";

export default {
  name: "bukongxiangqing",
  data() {
    return {
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
      //限制日期选择范围
      datepickerlimit: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      datetimerange: [],
      showKaKouTool: false,
      removeGaojingLayer: false,
      showGaojingRoute: true,
    };
  },
  created() {
    let type = this.$route.query.type;
    if (type == "edit") {
      this.title = "修改布控";
      this.showTab = false;
      this.showKaKouTool = true;
      this.showGaojingRoute = false;
    }
    this.bkID = this.$route.query.pro_id;
    this.activeName = this.$route.query.defaultActive;

    //卡口数据改变，修改对应数据
    eventBus.$on(
      eventCollection.EXCONTROL_GET_SELECTED_CAKOU,
      (value, node) => {
        this.bkBasicData.tollgateList = value;
      }
    );

    //撤销成功，刷新数据
    eventBus.$on(eventCollection.UPDATE_DETAILS_DATA, () => {
      this.getbkDetail();
    });

    //转换为修改布控页面
    eventBus.$on(eventCollection.SWITCH_EDIT_DETAILS, () => {
      this.$router.replace({
        query: merge(this.$route.query, { type: "edit" })
      });

      this.title = "修改布控";
      this.showTab = false;
      //地图配置卡口工具
      this.showKaKouTool = true;
      //去除告警图层
      this.removeGaojingLayer = true;
      this.showGaojingRoute = false;
    });
  },
  mounted() {
    if (this.$route.query.gaojingType == "2") {
      if (this.addtype != "ry") {
        this.addtype = "ry";
      }
    } else if (this.$route.query.gaojingType == "3") {
      if (this.addtype != "che") {
        this.addtype = "che";
      }
    }

    this.getbkDetail();
  },
  components: {
    "kakou-tree": shebeiTree,
    bukongxinxi: Bukongxinxi,
    gaojingliebiao: Gaojingliebiao,
    "baidu-map": baidumap
  },
  methods: {
    getbkDetail() {
      let param = {};
      param.pageNum = 1;
      param.pageSize = 1;
      // param.beginTime = this.datetimerange[0];
      // param.endTime = this.datetimerange[1];
      // param.dispositionCategory = this.bukongtype;
      param.dispositionID = this.bkID;
      // param.keyword = this.bukongkey;
      let _this = this;

      return excontrolApi
        .excontrolSearch(param)
        .then(res => res.data)
        .then(data => {
          // loading.close();
          //    this.srcrestotal = data.total;
          //生成表格

          _this.bkBasicData = data.pageData[0];
          _this.bkBasicData.targetFeature = JSON.parse(data.pageData[0].targetFeature);
          _this.bkBasicData.tollgateList = _this.bkBasicData.tollgateList.split(';');

          if (_this.bkBasicData.dispositionCategory == 2) {
            //_this.addtype = "ry";
            if (_this.addtype != "ry") {
              _this.addtype = "ry";
            }
          } else if (_this.bkBasicData.dispositionCategory == 3) {
            // _this.addtype = "che";
            if (_this.addtype != "che") {
              _this.addtype = "che";
            }
          }
          this.datetimerange = [
            this.getFormatDate(this.bkBasicData.beginTime),
            this.getFormatDate(this.bkBasicData.endTime)
          ];

          if (this.activeName == "third") {
            this.getGaojingList(
              _this.bkBasicData.dispositionCategory,
              _this.bkID
            );
          }
        });
    },
    //取消修改，返回布控管理页面
    backbkgl() {
      // this.$router.push({ path: "/bukongguanli/bukongguanli" });
      if (this.$route.query.defaultActive && !this.showTab) {
        this.$router.replace({
          query: merge(this.$route.query, { type: "show" })
        });
        this.title = "布控详情";
        this.showTab = true;
        //地图配置卡口工具
        this.showKaKouTool = false;
        this.removeGaojingLayer = false;
        this.showGaojingRoute = true;
      } else {
        this.$router.back(-1);
      }
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
        this.backbkgl();
      });
    },
    handleClick(tab, event) {
      if (tab.index == 2) {
        this.getGaojingList(this.bkBasicData.dispositionCategory, this.bkID);
        this.activeName == "third";
      } else {
        //加载卡口信息
        // eventBus.$emit(eventCollection._gaojingliebiao2map, item);
        // eventBus.$emit(eventCollection._bmap_transKakou);
        //  this.$refs.baidumap.setKakou(data, type);
        if (tab.index == 0) {
          this.activeName = "first"; //first
          //地图初始卡口
        } else {
          this.activeName = "second"; //
          //地图初始卡口
        }
        // alert(this.activeName);
        // this.$refs.kakou.getTollgate(this.addtype);
      }

      this.$router.replace({
        query: merge(this.$route.query, { defaultActive: this.activeName })
      });
    },
    getGaojingList(type, bkid) {
      this.$refs.gaojingliebiao.getGaojingliebiaoData(type, bkid);
    }
  }
};
</script>
<style>
input[type="file"] {
  display: none;
}
</style>
<style scoped>
.content-row {
  padding: 0;
  height: 100%;
}
.bl-content {
  width: 1400px;
  height: calc(100vh - 130px);
  margin: 0;
  width: 100%;
  /* border: 1px solid #d9dfe5; */
  box-sizing: border-box;
  background: #fff;
}
.bk-content {
  width: 100%;
  height: 100%;
  margin: 0px auto;
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
  height: 100%;
}
.edit_details {
  height: calc(100% - 120px);
}
.popover-info {
  position: absolute;
  left: 0px;
  top: 200px;
  background-color: white;
}
.popover-title {
}
.popover-content {
}
</style> 