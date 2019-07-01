<template>
    <div class="root-tree">
        <div class="tree-title">
            <el-input
                placeholder="请输入搜索条件"
                v-model="filterText">
            </el-input>
        </div>

        <!-- <slot  ref='selectStatus' name="selectStatus"></slot> -->
        <!-- <div style='margin:10px'  ref='selectStatus'>
            <span>选择状态：</span>
            <el-select v-model="status" class="small" style="width:98px;"  @change="statusChange">
              <el-option v-for="item in statuses" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </div> -->
        <div class="tips" ref='selectStatus'>
          <span class="sel-tips" :class="{active:curSelStatus=='红'}" @click="selectByColor('2')"><span class="redBgColor"></span><span class="tips-text">超标</span></span>
          <span class="sel-tips" :class="{active:curSelStatus=='黄'}" @click="selectByColor('0')"><span class="orangeBgColor"></span><span class="tips-text">未生产</span></span>
          <span class="sel-tips" :class="{active:curSelStatus=='绿'}" @click="selectByColor('1')"><span class="greenBgColor"></span><span class="tips-text">生产中</span></span>
            <span class="sel-tips" :class="{active:curSelStatus==''}" @click="selectByColor('-1')"><span class="allBgColor"  ></span><span class="tips-text">全部</span></span>
        </div>

         <el-tree
            class="filter-tree"
            :data="tollgatedata"
            :props="defaultProps"
            :default-expanded-keys="defaultExpand"
            :filter-node-method="filterNode"
            node-key="id"
            @node-click="selCurNode"
            @node-contextmenu="setMoreOperation"    
            @dblclick.native="alertDetail" 
            ref="shebeitree">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <!-- <span class="tree-icon" :class="{redColor:data.payload.color=='红',orangeColor:data.payload.color=='黄',greenColor:data.payload.color=='绿'}">{{ node.label }}</span> -->
              <span class="tree-icon" v-if="data.payload.unitLevel==5" style="font-size:12px;" :class="{redColor:data.payload.status=='2'}">{{ node.label }}</span>
              <span class="tree-icon" v-else-if="data.payload.unitLevel==3">{{ node.label }} <span style="font-size:12px;">(正常：{{data.payload.normalCount}} &nbsp;&nbsp;报警： <span class="redColor">{{data.payload.abnormalCount}}</span>)</span></span>
              <span class="tree-icon" v-else>{{ node.label }}</span>
          </span>
        </el-tree>
        <!-- <iframe width=0 height=0 id="url"></iframe> -->
        <div id="popover-menu" class="popover-menu" v-show="setVisibility">
          <span @click="showLargeScreen(curData.id)">一键上墙</span>
        </div>

        <div v-show="isShowLargeScreen" style="position:fixed;width:100%;height:100%;top:0;left:0;z-index:99999">
          <span class="fa fa-close" @click="closeLargeScreen" style="position:absolute;top:0;right:0;display:block;width:60px;height:60px;text-align:center;line-height:60px;"></span>
          <img src="/static/image/jiance-large.png" width="100%" height="100%" />
        </div>
        <!-- <el-dialog
          title=""
          fullscreen
          :visible.sync="isShowLargeScreen"
          :before-close="closeLargeScreen"
          width="100%"
          top="0">
          <img src="/static/image/jiance-large.png" width="100%" height="100%"  style="position:fixed;width:100%;height:100%;top:0;left:0;"/>
        </el-dialog> -->
    </div>
</template>

<script>
import { shipinApi, excontrolApi,tmpApi } from "@/https";
import eventBus from "@/event";
import { eventCollection } from "@/event/resources";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { getToken } from "@/utils/auth";

export default {
  name: "qiyeTree",
  watch: {
    filterText(val) {
      this.$refs.shebeitree.filter(val);
      //触发地图筛选

       eventBus.$emit(eventCollection._bmap_organnizationTreeSearch2map, val);
    }
  },
  data() {
    return {
        curSelStatus:'',
      filterText: "",
      defaultProps: {
        id: "id",
        label: "value",
        children: "children"
      },
      tollgatedata: [],
      tollgateList: [],
      tollgateNode: [],
      tollgateNodeObj: [],
      appData: {},
      defaultExpand: [],
      playType: 'playReal',
      setVisibility: false,
      isShowLargeScreen: false,
      scVisibility: false,
      ResetCollection: false,
      yuanVisibility: false,
      hackReset:false,
      curNode: null,
      yuanForm: {
        nodeName: '',
        parentId: '',
        period: ''
      },
      periodOptions: [
        {label:'一天',value:1},
        {label:'一周',value:2},
        {label:'一月',value:3},
        {label:'半年',value:4},
        {label:'一年',value:5},
      ],
      groupRadio: '选择已有分组',
      statuses:[{label:"全部",value:-1},{label:"未生产",value:0},{label:"生产中",value:1},{label:"排放超标",value:2}],
      status: '全部',
      timeout: null,
    };
  },
  created() {
    let _this = this;
    document.addEventListener('click',(e)=>{
      let moreMenu = document.getElementById("popover-menu");
      // if (moreMenu && !moreMenu.contains(event.target) &&　_this.setVisibility) {
      if (moreMenu &&　_this.setVisibility) {
        _this.setVisibility = false;
      }
    }, true);


    eventBus
      .$off(eventCollection._qyStatus)
      .$on(eventCollection._qyStatus, (data) => {
        console.log(data);
        // _this.filterText=0;
          this.$refs.shebeitree.filter(data);
       
    });



  },
  mounted() {
    this.getTollgate();
    //消息推送
    this.getnewJcData();
    // let _this = this;
    // setInterval(function() {
    //   return tmpApi
    //     .xiaoxituisongtest()
    //     .then(res => res)
    //     .then(data => {
    //     });
    // }, 10000);
  },
  methods: {
    selectByColor(p){
        // this.curSelStatus = states;
        this.$refs.shebeitree.filter({data:p});
    },

    statusChange(p,e){
      // alert(p);
      // eventBus.$emit(eventCollection._qyStatus,{data:p});
        this.$refs.shebeitree.filter({data:p});
    },
    filterNode(value, data) {
      if(typeof(value)!="object"){
        //  if (!value) return true;
        //  return data.value.indexOf(value) !== -1;
      }else{
        if(value.data=='-1'){
          //   if (!value) return true;
          //  return data.value.indexOf(value) !== -1;
              return true;
        }else{
              
            if( data.payload.unitLevel==5){
                if(data.payload.productionState==value.data){
                  return true;
                }else{
                  return false;
                }
            }else{
              return true;
            }
        }
        
      }
     
     
    },
     // 单击事件函数
    selCurNode(data, node, self) {    
      this.curData = node.data;
      clearTimeout(this.timeout);  //首先清除计时器
      this.timeout = setTimeout(() => {
        //触发地图定位
        eventBus.$emit(eventCollection._bmap_treeclick2map, {
          id: data.indexCode||data.payload.indexCode||data.parentId,
          name: data.name||data.value,
          status:data.payload.status
        });
      }, 300);   //大概时间300ms
    },
    // 双击事件函数，清除计时器，直接处理逻辑
    alertDetail() {
      clearTimeout(this.timeout);  //清除
      let data = this.curData;
      //触发地图弹出
        eventBus.$emit(eventCollection._bmap_treedoubleclick2map, {
          id: data.indexCode||data.payload.indexCode||data.parentId,
          name: data.name||data.value,
          status:data.payload.status
        });
    },
    getTollgate() {
      let _this = this;

      return tmpApi
        .getQiyeTree()
        .then(res => res)
        .then(data => {
          _this.tollgatedata = data.data;
          if(_this.$refs.shebeitree) {
            _this.$refs.shebeitree.setCheckedKeys([]);
          }

          let result = data.data;
          _this.defaultExpand = [];
          while(result.length == 1) {
            _this.defaultExpand.push(result[0].id);
            result = result[0].children;
          }
        });
    },
    //建立获取推送的的长连接
    getnewJcData() {
      let token = getToken();
      let httpaddres = tmpApi.sockpoliceAddress;
      let sock = new SockJS(httpaddres);
      this.stomp = Stomp.over(sock);

      this.stomp.heartbeat.outgoing = 0;
      this.stomp.heartbeat.incoming = 0;
      // this.stomp.connect(
      //   "root",
      //   "root",
      //   frame => {
      //     this.stomp.subscribe("/exchange/emsi_qy/", this.refreshGj); //emsi_qy   topic.qy.data
      //   }
      // );
      this.stomp.connect('root', 'root', this.on_connect, this.on_error, '/');
    },
    // Declare on_connect
    on_connect() {
      var _this=this;
        this.stomp.subscribe("/exchange/emsi_qy/", function(data) {
          // alert(1111111111111);
          console.log(data)
          if (!!data.body) {
            let newgj = JSON.parse(data.body);
            if(newgj.msgType=="current_signal"||newgj.msgType=="ai_video_signal"||newgj.msgType=="pollution_alarm_data"){
               //触发摄像头和电流设备状态更新事件
              eventBus.$emit(eventCollection._qyMQ,{data:newgj});
              return;
            }
            if(newgj.msgType=="qy_tree"){
              // alert('qy');
               _this.tollgatedata = newgj.data.data;
                //触发地图数据更新
                eventBus.$emit(eventCollection._getWarningRefresh);

            }
            
          }
           

        });
    },

    // Declare on_error
    on_error() {
      console.log('error');
    },


    //收到后端推送的消息显示
    refreshGj(data) {
      alert(1111);
      console.log(data)
      if (!!data.body) {
        let newgj = JSON.parse(data.body);
        this.tollgatedata = newgj.data;
        
        //触发地图数据更新
        eventBus.$emit(eventCollection._getWarningRefresh);
      }
    },
    setMoreOperation(event,obj,node,self) {
      this.curData = node.data;

      if (node.data.payload.unitLevel == 3) {
        this.setVisibility = true;
        let dom = document.getElementById('popover-menu');
        dom.style.left = event.clientX +'px';
        dom.style.top = event.clientY +'px';
      }
    },
    hideMoreOperation(event) {
      let moreMenu = document.getElementById("popover-menu");
      if (moreMenu && !moreMenu.contains(event.target) &&　this.setVisibility) {
        this.setVisibility = false;
      }
    },
    showLargeScreen(id) {
      this.$store.dispatch("ToggleFullScreen", 'yes');
      this.fullScreen();
      this.isShowLargeScreen = true;
      this.setVisibility = false;
    },
    closeLargeScreen() {
      this.$store.dispatch("ToggleFullScreen", 'no');
      this.exitFullScreen();
      this.isShowLargeScreen = false;
    }
  }
};
</script>

<style scoped>
.root-tree {
  padding: 0 5px;
  height: calc(100% - 46px);
}
.tree-title {
  margin: 0;
  margin-bottom: 20px;
  padding: 0 10px;
}
.tree-title p {
  margin: 0;
  height: 40px;
  line-height: 40px;
}
.redColor {
  color: #ff0000;
  font-size: 12px;
}
.orangeColor {
  color: orange;
  font-size: 12px;
}
.greenColor {
  color: green;
  font-size: 12px;
}
.popover-menu {
  position: fixed;
  background: #fff;
  border: 1px solid #999;
  border-radius: 2px;
  z-index: 3;
}
.popover-menu span {
  display: block;
  width: 120px;
  padding: 5px 10px;
  border-bottom: 1px solid #999;
  cursor: pointer;
}
.popover-menu span:nth-last-child(1) {
  border-bottom: none;
}

.sel-tips:hover, .active {
  cursor: pointer;
  color: #12b1e1;
}
.sel-tips:hover .redBgColor,.sel-tips:hover .orangeBgColor,.sel-tips:hover .greenBgColor,.sel-tips:hover .allBgColor,
.active .redBgColor,.active .orangeBgColor,.active .greenBgColor,.active .allBgColor {
  box-shadow: 0px 0px 1px 1px #ccc;
}
.tips {
  /* display: flex; */
  display: inline-block;
  align-items: center;
  padding: 0 5px;
  font-size: 12px;
  height: 20px;
  line-height: 20px;
}
.tips-text {
  margin: 0 5px;
}
.redBgColor,.greenBgColor,.orangeBgColor,.allBgColor{
  display: inline-block;
  width: 18px;
  height: 12px;
  border-radius: 2px;
 
}
.redBgColor {
  background: red;
  
}
.orangeBgColor {
  background: blue;
 
}
.greenBgColor {
  background: green;
}
.allBgColor {
  background: #eee;
}

</style>
