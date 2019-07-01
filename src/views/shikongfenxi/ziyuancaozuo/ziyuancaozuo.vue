<template>
<div class="content-body add-control">
    <div class="page-bread">
      <el-breadcrumb>
        <el-breadcrumb-item>视频资源操作</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-title">
        <ul class="tabs-hold">
          <li :class="{active: showpart == 2}">
            <a class="tab-ank" v-on:click="togpart(2)">人员卡口</a>
          </li>

          <li :class="{active: showpart == 3}">
            <a class="tab-ank" v-on:click="togpart(3)">车辆卡口</a>
          </li>

          <li :class="{active: showpart == 4}">
            <a class="tab-ank" v-on:click="togpart(4)">混合卡口</a>
          </li>
        </ul>
    </div>

    <div class="content-row">
      <div class="bl-content">
        <div class="edit_details">
            <div class="content-left">
                <kakou-tree :cakoudefault="bkBasicData.tollgateList" :addtype="addtype"></kakou-tree>
            </div>
            <div class="content-right">

                  <baidu-map :showKaKouTool="showKaKouTool"></baidu-map>
            </div>
          
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
      backssgj: false,
      bkBasicData: {
        targetFeature: {},
        targetImageURI: "",
        dispositionCategory: "",
        tollgateList: []
      },
      addtype: "ry",
      bkID: "",
      showTab: true,
      activeName: "first",
      title: "布控详情",
      //限制日期选择范围
      showpart: 2,
      showKaKouTool:true,

    };
  },
  created() {
    // let type = this.$route.query.type;
    // if(type == 'edit') {
    //   this.title = '修改布控';
    //   this.showTab = false;
    // }
    // this.bkID = this.$route.query.pro_id;
    // this.activeName = this.$route.query.defaultActive;

    //卡口数据改变，修改对应数据
    // eventBus.$on(eventCollection.EXCONTROL_GET_SELECTED_CAKOU, (value, node) => {
    //     this.bkBasicData.tollgateList = value;
    // });

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
    //    this.getbkDetail();
  },
  components: {
    "kakou-tree": KakouTree,
    "baidu-map": baidumap,
    bukongxinxi: Bukongxinxi,
    gaojingliebiao: Gaojingliebiao
  },
  methods: {
    //控制tab显示
    togpart(val) {
      this.showpart = val;
      if (val == 2) {
        this.addtype = "ry";
        this.bkBasicData.tollgateList = [];
      } else if (val == 3) {
        this.addtype = "che";
        this.bkBasicData.tollgateList = [];
      } else if (val == 4) {
        this.addtype = "hh";
        this.bkBasicData.tollgateList = [];
      }
    }

    // getbkDetail(){
    //   let param = {};
    //   param.pageNum = 1;
    //   param.pageSize = 1;
    //   // param.beginTime = this.datetimerange[0];
    //   // param.endTime = this.datetimerange[1];
    //   // param.dispositionCategory = this.bukongtype;
    //   param.dispositionID = this.bkID;
    //   // param.keyword = this.bukongkey;
    //   let _this = this;

    //   return excontrolApi
    //     .excontrolSearch(param)
    //     .then(res => res.data)
    //     .then(data => {
    //       // loading.close();
    //   //    this.srcrestotal = data.total;
    //       //生成表格
    //       _this.bkBasicData = data.pageData[0];

    //       if (_this.bkBasicData.dispositionCategory == 2) {
    //         _this.addtype = 'ry';
    //       } else if (_this.bkBasicData.dispositionCategory == 3) {
    //         _this.addtype = 'che';
    //       }
    //       this.datetimerange = [this.getFormatDate(this.bkBasicData.beginTime), this.getFormatDate(this.bkBasicData.endTime)];

    //       if (this.activeName == 'third') {
    //           this.getGaojingList(_this.bkBasicData.dispositionCategory,_this.bkID);
    //       }
    //     });
    // },
    //取消修改，返回布控管理页面
    // backbkgl() {
    //     this.$router.push({ path: '/bukonggaojing/bukongguanli' });
    // },
    // submitEdit: function() {
    //   let param = [{}];

    //   param[0].dispositionID = this.bkID;
    //   param[0].beginTime = this.str2DataTime(this.datetimerange[0]);
    //   param[0].endTime = this.str2DataTime(this.datetimerange[1]);
    //   param[0].tollgateList = this.bkBasicData.tollgateList.join(';');

    //   return excontrolApi
    //     .excontrolModify(param)
    //     .then(data => {
    //       this.$message({
    //         message: "修改布控成功！",
    //         type: "success"
    //       });
    //     });
    // },
    // handleClick(tab, event) {
    //   if (tab.index == 2) {
    //     this.getGaojingList(this.bkBasicData.dispositionCategory,this.bkID);
    //   }
    // },
    // getGaojingList(type, bkid) {
    //   this.$refs.gaojingliebiao.getGaojingliebiaoData(type, bkid);
    // }
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
  height: calc(100vh - 180px);
  margin: 0;
  width: 100%;
  /* border: 1px solid #d9dfe5; */
  box-sizing: border-box;
  background: #fff;
}
.bk-content {
  width: 98%;
  height: 100%;
  margin: 30px auto;
}
.content-title {
  margin-bottom: 20px;
  padding: 0;
  height: 30px;
  line-height:30px;
}
.content-left {
  width: 360px;
  height: 100%;
  float: left;
  border: 1px solid #ccc;
}
.content-right {
  width:calc(100% - 360px);
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
  height: 100%;
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
</style> 