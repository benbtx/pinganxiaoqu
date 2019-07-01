<template>
  <div class="root-tree">
      <div class="tips">
        <span class="sel-tips" :class="{active:curSelStatus=='红'}" @click="selectByColor('红')"><span class="redBgColor"></span><span class="tips-text">已过期</span></span>
        <span class="sel-tips" :class="{active:curSelStatus=='黄'}" @click="selectByColor('黄')"><span class="orangeBgColor"></span><span class="tips-text">3天内过期</span></span>
        <span class="sel-tips" :class="{active:curSelStatus=='绿'}" @click="selectByColor('绿')"><span class="greenBgColor"></span><span class="tips-text">正常</span></span>
         <!-- <span class="allBgColor"  @click="selectByColor('')"></span><span class="tips-text">全部</span> -->

          <span class="sel-tips" :class="{active:curSelStatus==''}" @click="selectByColor('')"><span class="allBgColor"  ></span><span class="tips-text">全部</span></span>
      </div>
      <div class="buttons" v-if="!yuanType">
        <span class="fa fa-plus add" @click="newGroup"></span>
        <span class="fa fa-edit edit" @click="editGroup"></span>
        <span class="fa fa-times delete" @click="deleteGroup"></span>
      </div>
      <el-tree
        ref="yuantree"
        :data="yuanData"
        node-key="id"
        default-expand-all
        :props="scDefaultProps"
        @node-click="selCurNode"
        @node-contextmenu="setMoreOperation"
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        highlight-current
        >
        <span class="custom-tree-node" slot-scope="{ node, data }">
            <span class="tree-icon" :class="{devtype1: data.nodeType=='folder', devtype2: data.nodeType=='camera'}"></span>
            <span class="tree-icon" :class="{redColor:data.payload.color=='红',orangeColor:data.payload.color=='黄',greenColor:data.payload.color=='绿'}">{{ node.label }}</span>
            <!-- <span class="tree-icon">{{ node.label }}-{{getFormatDate(data.payload.nextExcuteTime,'YYYY-MM-DD HH:mm')}}</span> -->
        </span>
      </el-tree>
      <div id="yuan-popover-menu" class="yuan-popover-menu" v-if="cameraVisibility">
        <span @click="playerVideo(curDataCode.data, setRecord);">查看监控</span>
        <span @click="editCamera" v-if="yuanType!='details'">编辑预案</span>
        <span @click="deleteCamera" v-if="yuanType!='details'">删除</span>
      </div>

      <el-dialog
        :title="groupTitle"
        :visible.sync="setVisibility"
        width="450px"
        top="25vh"
        class="modal-popover"
        :before-close="closeForm"
        :close-on-click-modal='false'
        append-to-body
        >
        <div class="popover-content">
          <el-form :model="groupForm" ref="groupForm" :rules="grouprule" class="group-form" label-width="100px">
              <el-form-item label="分组名称：" prop="nodeName">
                <el-input  type="text" v-model="groupForm.nodeName" style="width:240px;"></el-input>
              </el-form-item>
              <el-form-item label="执行者用户名：" prop="executor" style="margin-top:20px;">
                <el-select  type="text" v-model="groupForm.executor" style="width:240px;">
                  <el-option v-for="item in executorOptions" :key="item.id" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item style="margin-left: -70px;">
                请输入1-16个字！不能包含以下字符：V:*?"<|'%>
              </el-form-item>
          </el-form>
        </div>
         <div slot="footer" class="dialog-footer" style="text-align:center;">
            <el-button type="primary" @click="closeForm" size='medium' style="width:120px;margin-right:50px;">取 消</el-button>
            <el-button type="primary" @click="getData" size='medium' style="width:120px;">确定</el-button>
          </div>
      </el-dialog>

      <el-dialog
        title="修改预案"
        :visible.sync="setYuanVisibility"
        width="450px"
        top="25vh"
        class="modal-popover"
        :before-close="closeYuanForm"
        :close-on-click-modal='false'
        append-to-body
        >
        <div class="popover-content">
          <el-form :model="yuanForm" ref="yuanForm" class="group-form" label-width="120px">
              <el-form-item label="所属分组：">
                {{yuanForm.nodeName}}
              </el-form-item>
              <el-form-item label="执行周期：" prop="period">
                <el-select  type="text" v-model="yuanForm.period" style="width:240px;">
                  <el-option v-for="item in periodOptions" :key="item.id" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="下一次执行时间：">
                {{yuanForm.payload.color=='红' ? '已过期'+(-yuanForm.payload.timeLeft)+'天' : yuanForm.payload.color=='黄' ? yuanForm.payload.timeLeft+'天内过期' :getFormatDateYear(yuanForm.payload.nextExcuteTime)}}
              </el-form-item>
          </el-form>
        </div>
         <div slot="footer" class="dialog-footer" style="text-align:center;">
            <el-button type="primary" @click="closeYuanForm" size='medium' style="width:120px;margin-right:50px;">取 消</el-button>
            <el-button type="primary" @click="getYuanData" size='medium' style="width:120px;">确定</el-button>
          </div>
      </el-dialog>
  </div>
</template>

<script>
import { shipinApi } from "@/https";
import eventBus from "@/event";
import { eventCollection } from "@/event/resources";
export default {
  name: "yuanTree",
  props: ['yuanType'],
  data() {
    return {
      yuanData: [],
      scDefaultProps: {
        children: 'children',
        label: 'value'
      },
      curNode: null,
      curData:null,
      groupTitle: '新建分组',
      setVisibility:false,
      cameraVisibility: false,
      setYuanVisibility: false,
      curDataCode: '',
      cameraList: [],
      groupForm: {
        nodeName: '',
        executor: ''
      },
      yuanForm: {
        nodeName: '',
        parentId: '',
        preplanId: '',
        period: '',
        id: '',
        payload:{}
      },
      periodOptions: [
        {label:'一天',value:1},
        {label:'一周',value:2},
        {label:'一月',value:3},
        {label:'半年',value:4},
        {label:'一年',value:5},
      ],
      executorOptions: [
        {label:'police',value:'police'}
      ],
      cameraList: [],
      curSelStatus:'',

      grouprule: {
        nodeName: [
          {required: true, message: "不能为空！",trigger: "change"},
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' },
          {
            pattern:/^[^:*?"<|'%>]+$/,
            message: '请输入1-16个字！不能包含以下字符：V:*?"<|\'%>!' 
          }
        ],
      },
    };
  },
  created() {
    let _this = this;
    document.addEventListener('click',(e)=>{
      let moreMenu = document.getElementById("yuan-popover-menu");
      if (moreMenu &&　_this.cameraVisibility) {
        _this.cameraVisibility = false;
      }
    }, true);

    eventBus.$off(eventCollection.EVENT_ADD_YUAN)
      .$on(eventCollection.EVENT_ADD_YUAN, () => {
        this.newGroup();
    });
    console.log("create加载");
    // this.searchTreeData();
  },
  mounted() { 
    console.log("mounted加载");
    this.searchTreeData();
  },
  watch: {
     
  },
  methods: {
    selectByColor(color){
        this.$refs.yuantree.filter(color);
        this.curSelStatus = color;
          // this.$refs.tree2.filter(val);
            
           //点击不同颜色触发地图筛选
          //  eventBus.$emit(eventCollection._bmap_organnizationTreeSearch2map, color);
    },
    filterNode(value, data) {
      let obj = {};
      if (data.nodeType == 'camera') {
        obj.id = data.id;
        obj.name = data.value;
        obj.latitude = data.payload.latitude;
        obj.longitude = data.payload.longitude;

        obj.pid = data.parentId;
        obj.id = data.id;
        obj.state = false;
        obj.isOnline = data.payload.isOnline;
        obj.preplanName  = this.$refs.yuantree.getNode(data.parentId).data.value;
        this.cameraList.push(obj);
        if(value==''){
            return true;  
        }
        if(value==data.payload.color){
            return true;  
        }else{
            return false;  
        }
      }

      return true;
    },
    searchTreeData(id) {
      let parentId = parseInt(id) || 0;
      return shipinApi
        .searchYuanTree(parentId)
        .then(res => res.data)
        .then(data => {
          this.yuanData  = data;
          if (this.$refs.yuantree) {
            this.$refs.yuantree.filter();

              //触发地图事件：显示搜藏或则预案的spjk
            eventBus.$emit(eventCollection._bmap_collectionTree2map,this.cameraList );
          }
        });
    },
    searchTreeData2(id) {
     id;
      return shipinApi
        .searchYuanTree(0)
        .then(res => res.data)
        .then(data => {
          this.yuanData  = data;
          this.$refs.yuantree.filter();

            //触发地图事件：显示搜藏的spjk
            // eventBus.$emit(eventCollection._bmap_collectionTree2map,this.cameraList );
             console.log(1);
             console.log(this);
            //  eventBus.$emit(eventCollection._yuan2gongzuotai,{id:id,curNodeData:this});
            //  eventBus.$emit(eventCollection._yuan2gongzuotai,{id:this.curData.id,curNodeData:data});
            //  this.$refs.yuantree.setCurrentKey([this.curData.id]);

        });
    },
    selCurNode(data, node, self) {
       //触发地图定位
        
      if (data.nodeType == 'camera') {
        this.curNode=node;
        this.curData=data;
         eventBus.$emit(eventCollection._bmap_collectionTree2map,data );

         eventBus.$emit(eventCollection._yuan2gongzuotai,data );
        //  if(this.$route.path=="/gongzuotai/gongzuotai"){
        //       data.payload.cameraPreplanId
        //  }
      } else {
        this.curNode = node;
        eventBus.$emit(
          eventCollection.EVENT_ADD_YUAN_GROUP, node
        );
      }
    },
    newGroup() {
      //预案 只能添加一级分组 和搜藏相反

      // if (!this.curNode && this.curNode.data.id != "1") {
      // if (!this.curNode || this.curNode.data.nodeType=='camera') {
     
      if (this.curNode && this.curNode.level!= 1) {
        this.$message({
          message: '只能在根节点添加分组',
          type: 'warning'
        });
        return false;
      }

      this.groupTitle = '新建分组';
      this.setVisibility = true;
    },
    editGroup() {
      if (!this.curNode || this.curNode.data.nodeType=='camera') {
        this.$message({
          message: '请选择需要编辑的分组！',
          type: 'warning'
        });
        return false;
      }

      this.groupTitle = '编辑分组';
      this.setVisibility = true;
      this.$nextTick(() => {
        this.groupForm.nodeName = this.curNode.data.value;
        this.groupForm.preplanId = this.curNode.data.id;
        this.groupForm.executor = this.curNode.data.payload.executor;
      });
    },
    deleteGroup() {
      if (!this.curNode || this.curNode.data.nodeType=='camera') {
        this.$message({
          message: '请选择要删除的分组！',
          type: 'warning'
        });
        return false;
      }

      this.$confirm("确定删除该分组？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        let param = this.curNode.data.id;

        return shipinApi
          .deleteYuanGroup(param)
          .then(res => res)
          .then(data => {
            //更新数据
            this.searchTreeData();
            this.curNode = null;
          });
      }).catch(() => {});
    },
    getData() {
      if(this.groupForm.nodeName.length>16){
          this.$message({
            message: '字数超过16个字，请重新输入！',
            type: 'warning'
          });
          return ;
      }
      if(this.groupForm.executor==""){
        this.$message({
            message: '请选择执行者用户名！',
            type: 'warning'
          });
          return ;
      }
      
      //保存分组
      let param = {};
      param.nodeName = this.groupForm.nodeName;
      param.executor = this.groupForm.executor;

      let _this = this;
      _this.$refs["groupForm"].validate(valid => {
        if (valid) {
          if(_this.groupTitle=='编辑分组') {
            param.preplanId = parseInt(_this.groupForm.preplanId);
            return shipinApi
              .modifyYuanGroup(param)
              .then(res => res)
              .then(data => {
                //更新数据
                _this.searchTreeData();
                _this.closeForm();
                _this.curNode = null;
              });
          } else {
            param.parentId = 1;
            return shipinApi
            .addYuanGroup(param)
            .then(res => res)
            .then(data => {
              //更新数据
              _this.searchTreeData();
              _this.closeForm();
              _this.curNode = null;
            });
          }
        } else {
          _this.$message({
            message: "请按提示输入必填项",
            type: "warning"
          });
        }
      });
    },
    closeForm() {
      this.$refs.groupForm.resetFields();
      this.setVisibility = false;
    },
    getYuanData() {
      //保存新预案
      let param = {};
      param.indexCode = this.yuanForm.id;
      param.period = this.yuanForm.period;
      param.preplanId = parseInt(this.yuanForm.preplanId);

      return shipinApi
        .modifyYuanCamera(param)
        .then(res => res)
        .then(data => {
          //更新数据
          this.searchTreeData();
          this.closeYuanForm();
          this.curNode = null;
        });
    },
    closeYuanForm() {
      this.$refs.yuanForm.resetFields();
      this.setYuanVisibility = false;
    },
    loadCameraNode(node, resolve) {
      let parentId = parseInt(node.data.id);
      
      this.searchTreeData(parentId,resolve);
    },
    editCamera() {
      this.setYuanVisibility = true;
      this.$nextTick(() => {
        this.yuanForm.preplanId = this.curDataCode.data.parentId;
        this.yuanForm.nodeName = this.curDataCode.parent.data.value;
        this.yuanForm.period = this.curDataCode.data.payload.period;
        this.yuanForm.id = this.curDataCode.data.id;
        this.yuanForm.payload = this.curDataCode.data.payload;
      });
    },
    deleteCamera() {
      this.$confirm("确定删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        let param = {};
        let nodeData = this.curDataCode.data;
        param.indexCode = nodeData.id;
        param.preplanId = parseInt(nodeData.parentId);

        return shipinApi
          .deleteYuanCamera(param)
          .then(res => res)
          .then(data => {
            //更新数据
            this.searchTreeData();
          });
      }).catch(() => {});
    },
    setMoreOperation(event,obj,node,self) {
      this.curDataCode = node;

      if (node.data.nodeType == 'camera') {
        this.cameraVisibility = true;
        this.$nextTick(() => {
          let dom = document.getElementById('yuan-popover-menu');
          dom.style.left = event.clientX +'px';
          dom.style.top = event.clientY +'px';
        });
      } else {
        this.cameraVisibility = false;
      }
    },
    hideMoreOperation(event) {
      let moreMenu = document.getElementById("yuan-popover-menu");
      if (moreMenu && !moreMenu.contains(event.target) &&　this.cameraVisibility) {
        this.cameraVisibility = false;
      }
    },
    setRecord() {
      let param = {};
      param.preplanId = parseInt(this.curDataCode.data.parentId);
      param.indexCode = this.curDataCode.data.id;
      param.cameraName = this.curDataCode.data.value;
      param.preplanName = this.curDataCode.parent.data.value;

      return shipinApi
          .addYuanRecord(param)
          .then(res => res)
          .then(data => {
            //更新数据
            this.searchTreeData();
          });
    }
  },
  
};
</script>

<style scoped>
.root-tree {
  padding: 0 5px;
  height: 100%;
}
.buttons {
    width: 100%;
    height: 32px;
    line-height: 32px;
    padding-left: 10px;
    border-bottom: 1px solid #eee;
    margin-bottom:5px;
}
.buttons span {
  width: 28px;
  padding: 8px;
  cursor: pointer;
  border-radius: 2px;
}
.buttons span:hover {
  background: #ccc;
}
.sel-tips:hover, .active {
  cursor: pointer;
  color: #12b1e1;
}
.sel-tips:hover .redBgColor,.sel-tips:hover .orangeBgColor,.sel-tips:hover .greenBgColor,.sel-tips:hover .allBgColor,
.active .redBgColor,.active .orangeBgColor,.active .greenBgColor,.active .allBgColor {
  box-shadow: 0px 0px 1px 1px #ccc;
}
.add {
  color: green;
}
.edit {
  color: orange;
}
.delete {
  color: red;
}
.tree-icon {
  height: 24px;
  line-height: 24px;
  float: left;
}
.devtype1 {
  width: 22px;
  background: url(../../../static/image/shipin/parents.png) no-repeat;
  background-position: left center;
  background-size: 16px auto;
}
.devtype2 {
  width: 22px;
  background: url(../../../static/image/shipin/tongdao.png) no-repeat;
  background-position: left center;
  background-size: 16px auto;
}
.yuan-popover-menu {
  position: fixed;
  background: #fff;
  border: 1px solid #999;
  border-radius: 2px;
  z-index: 3;
}
.yuan-popover-menu span {
  display: block;
  width: 120px;
  padding: 5px 10px;
  border-bottom: 1px solid #999;
  cursor: pointer;
}
.yuan-popover-menu span:nth-last-child(1) {
  border-bottom: none;
}
.redColor {
  color: #ff0000;
  font-size: 12px;
}
.orangeColor {
  /* color: #FF9933; */
  color: orange;
  font-size: 12px;
}
.greenColor {
  color: green;
  /* color: #33cc00; */
  font-size: 12px;
}
.tips {
  display: flex;
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
  background: orange;
 
}
.greenBgColor {
  background: green;
}
.allBgColor {
  background: #eee;
}
</style>
