<template>
<div class="content-body add-control luxiang-search">
    <div class="page-bread">
      <el-breadcrumb>
        <el-breadcrumb-item>录像检索</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="bl-content">
            <div class="content-left">
              <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="资源" name="first" class="organization-group">
                    <div class="organization">
                      <organization-tree></organization-tree>
                    </div>
                    <div class="luxiang-control">
                    <p class="ctrl-item">
                      <label>开始时间：</label>
                      <el-date-picker
                        v-model="starttime"
                        type="datetime"
                        placeholder="选择日期时间"
                        value-format="yyyy-MM-dd HH:mm:ss">
                      </el-date-picker>
                    </p>
                    <p class="ctrl-item">
                      <label>结束时间：</label>
                      <el-date-picker
                        v-model="endtime"
                        type="datetime"
                        placeholder="选择日期时间"
                        value-format="yyyy-MM-dd HH:mm:ss">
                      </el-date-picker>
                    </p>
                    <p class="ctrl-item">
                      <el-input placeholder="请输入内容" v-model="labelVal" :disabled="!checkedLabel">
                        <el-checkbox label="标签：" class="fl" slot="prepend" v-model="checkedLabel"></el-checkbox>
                      </el-input>                                 
                    </p>
                    <p class="ctrl-item">
                      <el-checkbox label="计划录像" class="fl jihua" value="jihua" v-model="checkedTypes"></el-checkbox>
                      <el-checkbox label="报警录像" class="fr warn" value="baojing" v-model="checkedTypes"></el-checkbox>                 
                    </p>
                    <p class="ctrl-item">
                      <el-checkbox label="移动录像" class="fl yidong" value="yidong" v-model="checkedTypes"></el-checkbox>                
                    </p>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="收藏" name="second">
                  
                </el-tab-pane>
              </el-tabs>
            </div>
            <div class="content-right">
              <div class="shipin-group">
                <div class="shipin-item" :class="{maxwin: winNum==1,midwin: winNum==4,minwin:winNum==9}" @drop="drop($event, '1')" @dragover="allowDrop($event)">
                  <span  v-if="shipinVisibility1" class="shipin-close" @click="closePlay(1)"><i class="fa fa-times-circle"></i></span>
                  <videoPlayerBox v-if="shipinVisibility1" :sourceSrc="sourceSrc1" :sourceData="sourceData1" :playerState="playerState1" playType="video"></videoPlayerBox>
                </div>
                <div class="shipin-item" :class="{midwin: winNum==4,minwin:winNum==9}" @drop="drop($event, '2')" @dragover="allowDrop($event)">
                  <span  v-if="shipinVisibility2" class="shipin-close" @click="closePlay(2)"><i class="fa fa-times-circle"></i></span>
                  <videoPlayerBox v-if="shipinVisibility2" :sourceSrc="sourceSrc2" :sourceData="sourceData2" :playerState="playerState2" playType="video"></videoPlayerBox>
                </div>
                <div class="shipin-item" :class="{midwin: winNum==4,minwin:winNum==9}" @drop="drop($event, '3')" @dragover="allowDrop($event)">
                  <span  v-if="shipinVisibility3" class="shipin-close" @click="closePlay(3)"><i class="fa fa-times-circle"></i></span>
                  <videoPlayerBox v-if="shipinVisibility3" :sourceSrc="sourceSrc3" :sourceData="sourceData3" :playerState="playerState3" playType="video"></videoPlayerBox>
                </div>
                <div class="shipin-item" :class="{midwin: winNum==4,minwin:winNum==9}" @drop="drop($event, '4')" @dragover="allowDrop($event)">
                  <span  v-if="shipinVisibility4" class="shipin-close" @click="closePlay(4)"><i class="fa fa-times-circle"></i></span>
                  <videoPlayerBox v-if="shipinVisibility4" :sourceSrc="sourceSrc4" :sourceData="sourceData4" :playerState="playerState4" playType="video"></videoPlayerBox>
                </div>
                <div class="shipin-item" :class="{minwin:winNum==9}" @drop="drop($event, '5')" @dragover="allowDrop($event)">
                  <span  v-if="shipinVisibility5" class="shipin-close" @click="closePlay(5)"><i class="fa fa-times-circle"></i></span>
                  <videoPlayerBox v-if="shipinVisibility5" :sourceSrc="sourceSrc5" :sourceData="sourceData5" :playerState="playerState5" playType="video"></videoPlayerBox>
                </div>
                <div class="shipin-item" :class="{minwin:winNum==9}" @drop="drop($event, '6')" @dragover="allowDrop($event)">
                  <span  v-if="shipinVisibility6" class="shipin-close" @click="closePlay(6)"><i class="fa fa-times-circle"></i></span>
                  <videoPlayerBox v-if="shipinVisibility6" :sourceSrc="sourceSrc6" :sourceData="sourceData6" :playerState="playerState6" playType="video"></videoPlayerBox>
                </div>
                <div class="shipin-item" :class="{minwin:winNum==9}" @drop="drop($event, '7')" @dragover="allowDrop($event)">
                  <span  v-if="shipinVisibility7" class="shipin-close" @click="closePlay(7)"><i class="fa fa-times-circle"></i></span>
                  <videoPlayerBox v-if="shipinVisibility7" :sourceSrc="sourceSrc7" :sourceData="sourceData7" :playerState="playerState7" playType="video"></videoPlayerBox>
                </div>
                <div class="shipin-item" :class="{minwin:winNum==9}" @drop="drop($event, '8')" @dragover="allowDrop($event)">
                  <span  v-if="shipinVisibility8" class="shipin-close" @click="closePlay(8)"><i class="fa fa-times-circle"></i></span>
                  <videoPlayerBox v-if="shipinVisibility8" :sourceSrc="sourceSrc8" :sourceData="sourceData8" :playerState="playerState8" playType="video"></videoPlayerBox>
                </div>
                <div class="shipin-item" :class="{minwin:winNum==9}" @drop="drop($event, '9')" @dragover="allowDrop($event)">
                  <span  v-if="shipinVisibility9" class="shipin-close" @click="closePlay(9)"><i class="fa fa-times-circle"></i></span>
                  <videoPlayerBox v-if="shipinVisibility9" :sourceSrc="sourceSrc9" :sourceData="sourceData9" :playerState="playerState9" playType="video"></videoPlayerBox>
                </div>
              </div>
              <div class="shipin-time">
                <div class="shipin-opr">
                  <div class="fl">
                    <span class="fa fl fa-camera"></span>
                    <span class="fa fl video-download"></span>
                  </div>
                  <div class="center">
                    <span class="fa fl close-all"></span>
                    <span class="fa fl" :class="{'fa-play': !isPlay, 'fa-pause': isPlay}"></span>            
                    <span class="fa fa-backward fl"></span>
                    <span class="fl">1X</span>
                    <span class="fa fa-forward fl"></span>
                  </div>
                  <div class="fr">
                    <span class="fa fa-stop"></span>
                    <span class="fa fa-th-large"></span>
                    <span class="fa fa-th"></span>
                    <span class="fa fa-arrows-alt"></span>
                  </div>
                </div>
                <div class="time-opr">
                </div>
                <div class="time-log">
                </div>
              </div>
            </div>
      </div>
  </div>
</template>

<script>
import OrganizationTree from "@/components/shipin/organizationTree";
import { shipinApi } from "@/https";
import videoPlayerBox from "@/components/shipin/videoPlayer";
import eventBus from "@/event";
import { eventCollection } from "@/event/resources";

export default {
  name: "bukongxiangqing",
  data() {
    return {
      organizationId: '',
      activeName: "first",
      dragData: {},
      starttime: '',
      endtime: '',
      checkedTypes: [],
      labelVal: '',
      checkedLabel: false,
      winNum: 1,
      shipinVisibility1: false,
      shipinVisibility2: false,
      shipinVisibility3: false,
      shipinVisibility4: false,
      shipinVisibility5: false,
      shipinVisibility6: false,
      shipinVisibility7: false,
      shipinVisibility8: false,
      shipinVisibility9: false,
      sourceSrc1: '',
      sourceSrc2: '',
      sourceSrc3: '',
      sourceSrc4: '',
      sourceSrc5: '',
      sourceSrc6: '',
      sourceSrc7: '',
      sourceSrc8: '',
      sourceSrc9: '',
      sourceData1: {
        tabUUID: '',
        tollgateID: '',
        isSelNone: false,
        num: 1
      },
      sourceData2: {
        tabUUID: '',
        tollgateID: '',
        isSelNone: false,
        num: 2
      },
      sourceData3: {
        tabUUID: '',
        tollgateID: '',
        isSelNone: false,
        num: 3
      },
      sourceData4: {
        tabUUID: '',
        tollgateID: '',
        isSelNone: false,
        num: 4
      },
      sourceData5: {
        tabUUID: '',
        tollgateID: '',
        isSelNone: false,
        num: 5
      },
      sourceData6: {
        tabUUID: '',
        tollgateID: '',
        isSelNone: false,
        num: 6
      },
      sourceData7: {
        tabUUID: '',
        tollgateID: '',
        isSelNone: false,
        num: 7
      },
      sourceData8: {
        tabUUID: '',
        tollgateID: '',
        isSelNone: false,
        num: 8
      },
      sourceData9: {
        tabUUID: '',
        tollgateID: '',
        isSelNone: false,
        num: 9
      },
      playerState1: false,
      playerState2: false,
      playerState3: false,
      playerState4: false,
      playerState5: false,
      playerState6: false,
      playerState7: false,
      playerState8: false,
      playerState9: false,
      curWindow: 1,
    };
  },
  mounted() {
    // let _this = this;
    // setTimeout(function(){
    //   _this.getPlayerData('','');
    // },3000);  
  },
  created() {
    //监听拖拽数据
    eventBus.$on(eventCollection.dragTree, obj => {
      this.dragData = obj;
    });

    //卡口数据改变，修改对应数据
    eventBus.$on(
      eventCollection.EXCONTROL_GET_SELECTED_ORGANIZATION,
      (value, issel, num) => {
        if (issel) {
          this.organizationId = value;
        } else {
          this.organizationId = '';
        }
        this.setSelView(value, num, issel);
      }
    );

    // 监听关闭视频播放
     eventBus.$on(eventCollection._closeShipinDialog, () => {
      if (this.playerState1) {
        this.shipinVisibility1 = false;
        if (this.organizationId == this.sourceData1.tollgateID) {
          this.organizationId = '';
        }
      }
      if (this.playerState2) {
        this.shipinVisibility2 = false;
        if (this.organizationId == this.sourceData2.tollgateID) {
          this.organizationId = '';
        }
      }
      if (this.playerState3) {
        this.shipinVisibility3 = false;
        if (this.organizationId == this.sourceData3.tollgateID) {
          this.organizationId = '';
        }
      }
      if (this.playerState4) {
        this.shipinVisibility4 = false;
        if (this.organizationId == this.sourceData4.tollgateID) {
          this.organizationId = '';
        }
      }
       if (this.playerState5) {
        this.shipinVisibility5 = false;
        if (this.organizationId == this.sourceData5.tollgateID) {
          this.organizationId = '';
        }
      }
       if (this.playerState6) {
        this.shipinVisibility6 = false;
        if (this.organizationId == this.sourceData6.tollgateID) {
          this.organizationId = '';
        }
      }
       if (this.playerState7) {
        this.shipinVisibility7 = false;
        if (this.organizationId == this.sourceData7.tollgateID) {
          this.organizationId = '';
        }
      }
       if (this.playerState8) {
        this.shipinVisibility8 = false;
        if (this.organizationId == this.sourceData8.tollgateID) {
          this.organizationId = '';
        }
      }
       if (this.playerState9) {
        this.shipinVisibility9 = false;
        if (this.organizationId == this.sourceData9.tollgateID) {
          this.organizationId = '';
        }
      }
    });
  },
  watch: {

  },
  components: {
    "organization-tree": OrganizationTree,
    "videoPlayerBox": videoPlayerBox,
  },
  methods: {
    allowDrop(ev) {
      ev.preventDefault();
    },
    drop(ev, num) {
      ev.preventDefault();

      this.curWindow = num;
      let data = this.dragData.data;

      if (data.tollgateId!=undefined) {
        this.showVideo(num, data.tollgateId);
      } else {
         this.$message({
          message: '请选择一个子节点！',
          type: 'warning',
          duration: 3 * 1000
        });
      }
      
    },
    showVideo(tabUUID, tollgateID) {
      tollgateID = tollgateID ||　'510107510011073109';
      
      if (tabUUID == 1) {
        this.sourceData1.tabUUID = tabUUID;
        this.sourceData1.tollgateID = tollgateID;
      } else if (tabUUID == 2) {
        this.sourceData2.tabUUID = tabUUID;
        this.sourceData2.tollgateID = tollgateID;
      } else if (tabUUID == 3) {
        this.sourceData3.tabUUID = tabUUID;
        this.sourceData3.tollgateID = tollgateID;
      } else if (tabUUID == 4) {
        this.sourceData4.tabUUID = tabUUID;
        this.sourceData4.tollgateID = tollgateID;
      } else if (tabUUID == 5) {
        this.sourceData5.tabUUID = tabUUID;
        this.sourceData5.tollgateID = tollgateID;
      } else if (tabUUID == 6) {
        this.sourceData6.tabUUID = tabUUID;
        this.sourceData6.tollgateID = tollgateID;
      } else if (tabUUID == 7) {
        this.sourceData7.tabUUID = tabUUID;
        this.sourceData7.tollgateID = tollgateID;
      } else if (tabUUID == 8) {
        this.sourceData8.tabUUID = tabUUID;
        this.sourceData8.tollgateID = tollgateID;
      } else if (tabUUID == 9) {
        this.sourceData9.tabUUID = tabUUID;
        this.sourceData9.tollgateID = tollgateID;
      }

      let _this = this;
      let recover = false;
      if (_this.curWindow == 1 &&　_this.shipinVisibility1) {
          // _this.closePlay(1);
          recover = true;
      } else if (_this.curWindow == 2 &&　_this.shipinVisibility2) {
          // _this.closePlay(2);
          recover = true;
      } else if (_this.curWindow == 3 &&　_this.shipinVisibility3) {
          // _this.closePlay(3);
          recover = true;
      } else if (_this.curWindow == 4 &&　_this.shipinVisibility4) {
          // _this.closePlay(4);
          recover = true;
      } else if (_this.curWindow == 5 &&　_this.shipinVisibility5) {
          // _this.closePlay(5);
          recover = true;
      } else if (_this.curWindow == 6 &&　_this.shipinVisibility6) {
          // _this.closePlay(6);
          recover = true;
      } else if (_this.curWindow == 7 &&　_this.shipinVisibility7) {
          // _this.closePlay(7);
          recover = true;
      } else if (_this.curWindow == 8 &&　_this.shipinVisibility8) {
          // _this.closePlay(8);
          recover = true;
      } else if (_this.curWindow == 9 &&　_this.shipinVisibility9) {
          // _this.closePlay(9);
          recover = true;
      }

      if (recover) {
        this.$message({
          message: '请先关闭该窗口的视频！',
          type: 'warning',
          duration: 3 * 1000
        });
      } else {
        this.getPlayerData(tabUUID, tollgateID);
      }
    },
    // 获取视频源数据
    getPlayerData(tabUUID, tollgateID) {
      let param = {};
      param.tabUUID = tabUUID;
      param.tollgateID = tollgateID;

      let _this = this;
      if (_this.curWindow == 1) {
          _this.playerState1 = false;
      } else if (_this.curWindow == 2) {
          _this.playerState2 = false;
      } else if (_this.curWindow == 3) {
          _this.playerState3 = false;
      } else if (_this.curWindow == 4) {
          _this.playerState4 = false;
      } else if (_this.curWindow == 5) {
          _this.playerState5 = false;
      } else if (_this.curWindow == 6) {
          _this.playerState6 = false;
      } else if (_this.curWindow == 7) {
          _this.playerState7 = false;
      } else if (_this.curWindow == 8) {
          _this.playerState8 = false;
      } else if (_this.curWindow == 9) {
          _this.playerState9 = false;
      }
      
      // _this.curWindow = 1;
      // _this.sourceSrc1 = 'rtmp://cyberplayerplay.kaywang.cn/cyberplayer/demo201711-L1';
      // _this.shipinVisibility1 = true;
      // return false;

      return shipinApi
      .getPlayerVideo(param)
      .then(res => res.data)
      .then(data => {  
        data.videoURL = 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4';
        if (_this.curWindow == 1) {
          _this.sourceSrc1 = data.videoURL;
          _this.shipinVisibility1 = true;
        } else if (_this.curWindow == 2) {
          _this.sourceSrc2 = data.videoURL;
          _this.shipinVisibility2 = true;
        } else if (_this.curWindow == 3) {
          _this.sourceSrc3 = data.videoURL;
          _this.shipinVisibility3 = true;
        } else if (_this.curWindow == 4) {
          _this.sourceSrc4 = data.videoURL;
          _this.shipinVisibility4 = true;
        } else if (_this.curWindow == 5) {
          _this.sourceSrc5 = data.videoURL;
          _this.shipinVisibility5 = true;
        } else if (_this.curWindow == 6) {
          _this.sourceSrc6 = data.videoURL;
          _this.shipinVisibility6 = true;
        } else if (_this.curWindow == 7) {
          _this.sourceSrc7 = data.videoURL;
          _this.shipinVisibility7 = true;
        } else if (_this.curWindow == 8) {
          _this.sourceSrc8 = data.videoURL;
          _this.shipinVisibility8 = true;
        } else if (_this.curWindow == 9) {
          _this.sourceSrc9 = data.videoURL;
          _this.shipinVisibility9 = true;
        }
      }).catch((err) => {
         this.$message({
          message: '实时视频播放失败！',
          type: 'error',
          duration: 5 * 1000
        });
      });
    },
    closePlay(num) {
      if (num == 1) {
        this.playerState1 = true;
      } else if (num == 2) {
        this.playerState2 = true;
      } else if (num == 3) {
        this.playerState3 = true;
      } else if (num == 4) {
        this.playerState4 = true;
      } else if (num == 5) {
        this.playerState5 = true;
      } else if (num == 6) {
        this.playerState6 = true;
      } else if (num == 7) {
        this.playerState7 = true;
      } else if (num == 8) {
        this.playerState8 = true;
      } else if (num == 9) {
        this.playerState9 = true;
      }
    },
    setCloudControl() {
      if (!this.organizationId) {
        this.$message({
          message: "请至少选择一个子设备",
          type: "warning"
        });
        return false;
      }
      this.showSetting = true;
    },
    setSelView(val, num, issel) {
        this.sourceData1.isSelNone = true;
        this.sourceData2.isSelNone = true;
        this.sourceData3.isSelNone = true;
        this.sourceData4.isSelNone = true;
        this.sourceData5.isSelNone = true;
        this.sourceData6.isSelNone = true;
        this.sourceData7.isSelNone = true;
        this.sourceData8.isSelNone = true;
        this.sourceData9.isSelNone = true;
       if (this.sourceData1.tollgateID == val && num == 1) {
         this.sourceData1.isSelNone = !issel;
       } else if (this.sourceData2.tollgateID == val && num == 2) {
         this.sourceData2.isSelNone = !issel;
       } else if (this.sourceData3.tollgateID == val && num == 3) {
         this.sourceData3.isSelNone = !issel;
       } else if (this.sourceData4.tollgateID == val && num == 4) {
         this.sourceData4.isSelNone = !issel;
       }  else if (this.sourceData5.tollgateID == val && num == 5) {
         this.sourceData5.isSelNone = !issel;
       } else if (this.sourceData6.tollgateID == val && num == 6) {
         this.sourceData6.isSelNone = !issel;
       } else if (this.sourceData7.tollgateID == val && num == 7) {
         this.sourceData7.isSelNone = !issel;
       }   else if (this.sourceData8.tollgateID == val && num == 8) {
         this.sourceData8.isSelNone = !issel;
       } else if (this.sourceData9.tollgateID == val && num == 9) {
         this.sourceData9.isSelNone = !issel;
       }
    }
  }
};
</script>

<style scoped>
.content-row {
  padding: 0;
  height: 100%;
}
.bl-content {
  width: 1400px;
  min-height: 500px;
  height: calc(100vh - 140px);
  margin: 0;
  width: 100%;
  box-sizing: border-box;
  background: #fff;
}
.content-left {
  width: 326px;
  height: 100%;
  float: left;
  border: 1px solid #ccc;
}
.content-right {
  width: calc(100% - 326px);
  height: 100%;
  margin-left: 326px;
  border-left: none;
  background: #444446;
}
.shipin-item {
  float: left;
  position: relative;
  margin: 0;
  padding: 0;
  width: calc(50% - 2px);
  height: calc(50% - 2px);
  margin: 1px;
  background: url(../../../../static/image/shipin/noVideo.png) no-repeat;
  background-position: center center;
  background-color: #000;
  display: none;
}
.shipin-close {
  position: absolute;
  top: 0;
  right: 0;
  width:24px;
  height:24px;
  z-index: 999;
  font-size:16px;
  color: #fff;
  text-align: center;
  cursor: pointer;
}
.organization {
  width: 100%;
  height: calc(100% - 220px);
  overflow-y: auto;
}
.luxiang-control {
  width: 100%;
  height: 220px; 
  position: absolute;
  bottom: 0;
  border-top: 1px solid #ccc;
}
.ctrl-item {
    margin: 12px;
    text-align: center;
    overflow: hidden;
}
.warn {
  margin-right: 10px;
}
.shipin-group {
  width: 100%;
  height: calc(100% - 220px);
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.shipin-time {
  width: 100%;
  height: 220px;
  border-right: 1px solid #D8DFE5;
}
.maxwin {
  width: calc(100% - 2px);
  height: calc(100% - 2px);
  display: block;
}
.midwin {
  width: calc(50% - 2px);
  height: calc(50% - 2px);
  display: block;
}
.minwin {
  width: calc(33.3% - 2px);
  height: calc(33.3% - 2px);
  display: block;
}
.shipin-opr, .time-opr {
  width: 100%;
  height: 40px;
  line-height: 40px;
  background: #fff;
  padding: 0 8px;
  text-align: center;
}
.shipin-opr .center {
  display: inline-block;
}
.close-all {
  background-image: url(/static/image/shipin/close-all.png);
  background-repeat: no-repeat;
  background-size: auto;
  background-position: 5px;
}
.time-opr {
  border-top: 1px solid #D8DFE5;
  border-bottom: 1px solid #D8DFE5;
}
.time-log {
  width: 100%;
  height: 140px;
  background: #fff;
  overflow-y: auto;
  border-bottom: 1px solid #D8DFE5;
}
</style> 