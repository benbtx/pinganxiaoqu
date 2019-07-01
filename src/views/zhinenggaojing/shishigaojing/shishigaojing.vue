<template>
  <div class="content-body">
    <div class="page-bread">
      <el-breadcrumb>
        <el-breadcrumb-item>实时告警</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-row">
      <div class="bl-content">
        <div class="content-left">
          <ul class="tabs-hold">
            <li :class="{active: showpart == 2}">
              <a class="tab-ank" v-on:click="togpart(2)">人员告警</a>
            </li>
            <li class="tab-ank">/</li>
            <li :class="{active: showpart == 3}">
              <a class="tab-ank" v-on:click="togpart(3)">车辆告警</a>
            </li>
            <li class="fr">今日告警数量： <strong>{{dayCount}}</strong></li>
          </ul>

          <div class="content-list" v-show="showpart == 2">
            <div class="list-item"  v-bind:class="{highlight:(index==curClickIndex)}" v-for="(item,index) in ryTableData" :key="item.id" @click="getPosition(item,index)">
             
              <p class="item-text">姓名：{{item.targetFeature.name}}</p>
              <p class="item-text">身份证：{{item.targetFeature.idCard}}</p>
              <p class="item-text">发现地点：{{item.name}}</p>
              <p class="item-text">发现时间：{{item.triggerTime}}</p>
              <p class="item-text">布控任务：{{item.reason}}</p>
              <p class="item-text" style="text-align:center;">
                <span class="item-btn" @click.stop="toBkDetails(item.dispositionID)"><i class="fa fa-file-text-o"></i> 查看详情</span>
                <span class="item-btn" @click.stop="showVideo(item.dispositionID, item.tollgateID)"><i class="fa fa-video-camera"></i> 查看视频</span>
              </p>
             

            </div>
            <p class="more" @click="showMore(2)">更多...</p>
          </div>
          <div class="content-list" v-show="showpart == 3">
            <div class="list-item"  v-bind:class="{highlight:(index==curClickIndex)}" v-for="(item,index) in clTableData" :key="item.id" @click="getPosition(item,index)" >
             
                 <p class="item-text">车牌号：{{item.targetFeature.plateNo}}</p>
                  <p class="item-text">车型：{{item.targetFeature.brand}}</p>
                  <p class="item-text">发现地点：{{item.name}}</p>
                  <p class="item-text">发现时间：{{item.triggerTime}}</p>
                  <p class="item-text">布控任务：{{item.reason}}</p>
                  <p class="item-text" style="text-align:center;">
                    <span class="item-btn" @click="toBkDetails(item.dispositionID)"><i class="fa fa-file-text-o"></i> 查看详情</span>
                    <span class="item-btn" @click="showVideo(item.dispositionID, item.tollgateID)"><i class="fa fa-video-camera"></i> 查看视频</span>
                  </p>
             
                
              
            </div>
            <p class="more" @click="showMore(3)">更多...</p>
          </div>
        </div>
        <div class="content-right">
            <baidu-map :notification="notification" :notification_type="gaojingType" :showKaKouTool="showKaKouTool" :mapData="{page:'shishigaojing',showpart:showpart}"></baidu-map>
        </div>
      </div>
      <el-dialog
        title="视频播放"
        :visible.sync="shipinVisibility"
        width="600px"
        class="modal-popover"
        :close-on-click-modal='false'
        :before-close="closePlay"
        >
        <videoPlayerBox v-if="shipinVisibility" :sourceSrc="sourceSrc" :sourceData="sourceData" :playerState="playerState"></videoPlayerBox>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { excontrolApi } from "@/https";
import { shipinApi } from "@/https";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { getToken, setToken, removeToken } from "@/utils/auth";
import videoPlayerBox from "@/components/shipin/videoPlayer";
import baidumap from "@/components/baidumap/mapInit";
import eventBus from "@/event";
import { eventCollection } from "@/event/resources";

export default {
  name: "shishigaojing",
  data() {
    return {
      curClickIndex:0,//当前点击数据索引
      showKaKouTool: false,
      ryTableData: [],
      clTableData: [],
      activeName: "first",
      dayCount: "",
      currentPageRy: 1,
      currentPageCl: 1,
      stomp: "",
      gaojingType: 2,
      showpart: 2,
      shipinVisibility: false,
      sourceSrc: "",
      playerState: false,
      sourceData: {
        tabUUID: "",
        tollgateID: ""
      },
      cpcolorlist: this.getCpysList(),
      appData: {},
    };
  },
  computed: {
    notification() {
      return {
        ry: this.ryTableData,
        cl: this.clTableData
      };
    }
  },
  components: {
    videoPlayerBox: videoPlayerBox,
    "baidu-map": baidumap
  },
  mounted() {
    this.getGaojingData(1, 3);
    this.getCurDayNum();
    this.getGaojingData(1, 2);
    this.getnewGj();
  },
  created() {
    eventBus.$on(eventCollection._closeShipinDialog, () => {
      this.shipinVisibility = false;
    });
  },
  //组件销毁前
  beforeDestroy() {
    //关闭长连接
    this.stomp.disconnect();
  },
  methods: {
    //控制tab显示
    togpart(val) {
      this.showpart = val;
      this.gaojingType = val;
      this.curClickIndex=0;
      //
    },
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
    getCurDayNum() {
      return excontrolApi
        .getCurDayGaojingNum()
        .then(res => res.data)
        .then(data => {
          this.dayCount = data;
        });
    },
    showMore(type) {
      if (type == 2) {
        this.currentPageRy++;
        this.getGaojingData(this.currentPageRy, type);
      } else if (type == 3) {
        this.currentPageCl++;
        this.getGaojingData(this.currentPageCl, type);
      }
    },
    getGaojingData: function(ctrcurrentPage, type) {
      let param = {};
      param.pageNum = ctrcurrentPage;
      param.pageSize = 10;
      param.dispositionCategory = type;

      let srcTableData = [];
      let _this = this;
      return excontrolApi
        .excontrolGaojingSearch(param)
        .then(res => res.data)
        .then(data => {
          //生成表格
          srcTableData = data.pageData;
          for (var i = 0; i < srcTableData.length; i++) {
            srcTableData[i].triggerTime = this.getFormatDate(
              srcTableData[i].triggerTime
            );

            if (srcTableData[i].dispositionCategory == "3") {
              if (srcTableData[i].targetFeature.brand != null) {
                srcTableData[i].targetFeature.brand = this.getCLpp(
                  srcTableData[i].targetFeature.brand
                );
              }
              if (srcTableData[i].targetFeature.plateColor != null) {
                srcTableData[i].targetFeature.plateColor = this.getCLcolor(
                  srcTableData[i].targetFeature.plateColor
                );
              }
            }
          }

          if (type == 2) {
            _this.ryTableData.push.apply(_this.ryTableData, srcTableData);
          } else if (type == 3) {
            _this.clTableData.push.apply(_this.clTableData, srcTableData);
          }
        });
    },
    //建立获取推送的的长连接
    getnewGj() {
      let token = getToken();
      let httpaddres = excontrolApi.sockpoliceAddress;
      let sock = new SockJS(httpaddres);
      this.stomp = Stomp.over(sock);
      this.stomp.connect(
        "root",
        "root",
        frame => {
          this.stomp.subscribe("notification:" + token, this.refreshGj); //2
        }
      );
    },
    //收到后端推送的告警消息显示
    refreshGj(data) {
      if (!!data.body) {
        let newgj = JSON.parse(data.body);
        // this.$message("发现新的告警：" + newgj[0].name);
        // this.policelist.unshift(newgj[0]);
      }
    },
    showVideo(tabUUID, tollgateID) {
      this.sourceData.tabUUID = tabUUID;
      this.sourceData.tollgateID = tollgateID;

      this.getPlayerData(tabUUID, tollgateID);
    },
    toBkDetails(bkbh) {
      this.$router.push({
        path: "/zhinenggaojing/bukongxiangqing",
        query: {
          pro_id: bkbh,
          type: "show",
          defaultActive: "third",
          gaojingType: this.gaojingType
        }
      });
    },
    getPosition(item,index) {
      this.clTableData;
      this.ryTableData;
      this.curClickIndex=index;

      //触发地图显示
      eventBus.$emit(eventCollection._gaojingliebiao2map, item);
    },
    // 获取视频源数据
    getPlayerData(tabUUID, tollgateID) {
      let _this = this;
      return shipinApi.agreementKeyWords()
        .then(res => res.data)
        .then(data => {  
          _this.appData = data;
          _this.alertExe([tollgateID]);
        }).catch((err) => {
          this.$message({
            message: '实时视频播放失败！',
            type: 'error',  
            duration: 5 * 1000
          });
        });
      // let param = {};
      // param.tabUUID = tabUUID;
      // param.tollgateID = tollgateID;

      // let _this = this;
      // this.sourceSrc = "";
      // this.playerState = false;
      
      // // this.sourceSrc = 'http://gcqq450f71eywn6bv7u.exp.bcevod.com/mda-hbqagik5sfq1jsai/mda-hbqagik5sfq1jsai.mp4';
      // // // this.sourceSrc = '/static/image/shipin/movie.mp4';
      // // this.shipinVisibility = true;
      // // return false;


      // return shipinApi
      //   .getPlayerVideo(param)
      //   .then(res => res.data)
      //   .then(data => {
      //     _this.sourceSrc = data.videoURL;
      //     _this.shipinVisibility = true;
      //   })
      //   .catch(err => {
      //     this.$message({
      //       message: "实时视频播放失败！",
      //       type: "error",
      //       duration: 5 * 1000
      //     });
      //   });
    },
    alertExe(indexCodes) {
      //弹出exe
      let PlayBack = 'PlayReal'; //预览 PlayReal,回放 PlayBack
      let Clear = 2; // 1表示关闭所有窗口，清空列表 2表示关闭所有播放窗口,不清空列表 3表示往列表追加，不做任何清理
      let SvrIp = this.appData.host;
      let SvrPort = this.appData.port;
      let appkey = this.APPKEY;
      let appSecret =  this.appData.appSecret;
      let time = this.appData.time;  //时间为参数当前发送视频播放请求的时间，精确到秒
      let timeSecret = this.appData.timeSecret; //时间参数加密后
      let httpsflag = '1';  //https为1，http为0
      let WndCount = 1; //支持1,4,9三种模式
      if (indexCodes.length > 1) {
         WndCount = 4;
      }
      if (indexCodes.length > 4) {
         WndCount = 9;
      }
      let CamList = indexCodes.join(','); //监控点列表，用逗号隔开
      let start = ''; //回放开始时间
      let end = ''; //回放结束时间
      let startTime;
      let endTime;
      let playBackTime = '';
      if (PlayBack == 'PlayBack') { //回放
        if (end == "" || !end) {
            endTime = (new Date().getTime())/1000;
            endTime = Math.round(endTime);
        }else {
            endTime = (new Date(end).getTime())/1000;
            endTime = Math.round(endTime);
        }
        if (start == "" || !start) {
            startTime = endTime-86400;
        } else {
            startTime = (new Date(start).getTime())/1000;
            startTime = Math.round(startTime);
        }
        playBackTime = '_' + startTime + '_' + endTime;
      }
      //主要是添加了'hikvideoclient://' 和 'VersionTag:artemis'2段字符串 
      var param = 'hikvideoclient://ReqType:' + PlayBack + ';' + 'WndCount:' + WndCount + ';' + 'VersionTag:artemis' + ';' + 'SvrIp:' + SvrIp + ';' + 'SvrPort:' + SvrPort + ';' + 'Appkey:' + appkey + ';' + 'AppSecret:' + appSecret + ';' + 'time:' + time + ';' + 'timesecret:' + timeSecret + ';' + 'httpsflag:' + httpsflag + ';' + 'CamList:' + CamList + playBackTime + ';Clear:' + Clear;

      // document.getElementById("url").src = param;
      window.location.href = param;
    },
    closePlay() {
      this.playerState = true;
    }
  }
};
</script>

<style scoped>
.content-row {
  padding: 0;
}
.bl-content {
  width: 1400px;
  height: calc(100vh - 130px);
  margin-bottom: 30px;
  width: 100%;
  box-sizing: border-box;
  background: #fff;
}
.content-left {
  width: 300px;
  height: 100%;
  float: left;
  border: 1px solid #d9dfe5;
}
.content-right {
  width: calc(100% - 300px);
  height: 100%;
  margin-left: 300px;
  border: 1px solid #d9dfe5;
  border-left: none;
}
.tree-title {
  height: 40px;
  line-height: 40px;
  margin: 0;
  padding-left: 10px;
  border-bottom: 1px solid #d9dfe5;
}
.content-list {
  width: 100%;
  height: calc(100% - 40px);
  overflow: auto;
  padding: 0 10px;
}
.list-item {
  width: 100%;
  min-height: 80px;
  height: auto;
  margin: 10px 0;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-left: 2px solid #13b1e1;
  cursor: pointer
}
.highlight {
  background-color: #e7f1e1;
}
.item-text {
  line-height: 22px;
  margin: 0;
  padding: 0;
  font-size: 12px;
}
.item-btn {
  margin: 0px 15px;
  color: #12b1e1;
  text-align: center;
  cursor: pointer;
}
.tabs-hold {
  border-bottom: 1px solid #d9dfe5;
  height: 40px;
  line-height: 40px;
  padding: 0 10px;
}
.tabs-hold > li {
  margin: 0;
  display: inline-block;
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
.more {
  text-align: center;
  color: #13b1e1;
  cursor: pointer;
}
.more:hover {
  text-decoration: underline;
}
</style>