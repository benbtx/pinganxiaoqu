<template>
    <div class="root-tree">
        <div class="tree-title">
            <el-input
                placeholder="请输入搜索条件"
                v-model="filterText">
            </el-input>
        </div>

         <el-tree
            class="filter-tree"
            :data="tollgatedata"
            :props="defaultProps"
            :default-expanded-keys="defaultExpand"
            show-checkbox
            :filter-node-method="filterNode"
            node-key="id"
            :default-checked-keys="tollgateList"
            @check="checkSel"
            @node-click="selCurNode"
            @node-contextmenu="setMoreOperation"
            ref="shebeitree">
        </el-tree>
        <!-- <iframe width=0 height=0 id="url"></iframe> -->

        <div id="popover-menu" class="popover-menu" v-show="setVisibility">
          <span @click="playerVideo(curData)" v-if="curData.nodeType=='769'">查看监控</span>
          <span @click="newCollection" v-if="tollgateNodeObj.length>0">添加到收藏夹</span>
          <span @click="newYuan" v-if="tollgateNodeObj.length>0">添加到预案</span>
        </div>

        <el-dialog
          title="添加到收藏夹"
          :visible.sync="scVisibility"
          width="450px"
          top="25vh"
          class="modal-popover"
          :before-close="closeCollection"
          :close-on-click-modal='false'
          >
          <hr style="margin: 3px;"/>
          <div class="popover-content">
            <collection-tree  v-if="ResetCollection" ref="collectionTree" :collectionList="tollgateList"></collection-tree>
          </div>
          <div slot="footer" class="dialog-footer" style="text-align:center;">
              <el-button type="info" size="mini" @click="addGroup" style="width:90px;margin-right:50px;">添加新分组</el-button>
              <el-button type="primary" @click="addCollection" size='small' style="width:90px;margin-right:30px;">确 定</el-button>
              <el-button type="primary" @click="closeCollection" size='small' style="width:90px;">取 消</el-button>
          </div>
        </el-dialog>
        <el-dialog
          title="添加到预案"
          :visible.sync="yuanVisibility"
          width="450px"
          top="25vh"
          class="modal-popover"
          :before-close="closeYuanForm"
          :close-on-click-modal='false'
          >
          <!-- <el-radio-group v-model="groupRadio" size="mini">
            <el-radio-button label="选择已有分组"></el-radio-button>
            <el-radio-button label="新增分组" @click.native.prevent="selGroup"></el-radio-button>
          </el-radio-group> -->
          <hr style="margin: 3px;"/>
          <div class="popover-content">
            <yuan-tree v-if="hackReset" ref="yuanTree" yuanType="edit"></yuan-tree>       
          </div>
          <el-form :model="yuanForm" ref="yuanForm" class="group-form" label-width="100px">
            <el-form-item label="所属分组：">
              {{yuanForm.nodeName}}
            </el-form-item>
            <el-form-item label="执行周期：" prop="period">
              <el-select  type="text" v-model="yuanForm.period" style="width:240px;">
                <el-option v-for="item in periodOptions" :key="item.id" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer" style="text-align:center;">
              <el-button type="info" size="mini" @click="addYuanGroup" style="width:90px;margin-right:50px;">添加新分组</el-button>
              <el-button type="primary" @click="addYuanForm" size='small' style="width:90px;margin-right:30px;">确 定</el-button>
              <el-button type="primary" @click="closeYuanForm" size='small' style="width:90px;">取 消</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
import { shipinApi, excontrolApi } from "@/https";
import eventBus from "@/event";
import { eventCollection } from "@/event/resources";
import CollectionTree from "@/components/shipin/collectionTree";
import YuanTree from "@/components/shipin/yuanTree";

export default {
  name: "organizationTree",
  watch: {
    filterText(val) {
      this.$refs.shebeitree.filter(val);
      //触发地图筛选

       eventBus.$emit(eventCollection._bmap_organnizationTreeSearch2map, val);


    }
  },
  data() {
    return {
      filterText: "",
      defaultProps: {
        id: "id",
        label: "value",
        children: "children",
        isLeaf: 'leaf'
      },
      tollgatedata: [],
      tollgateList: [],
      tollgateNode: [],
      tollgateNodeObj: [],
      appData: {},
      defaultExpand: [],
      playType: 'playReal',
      setVisibility: false,
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
      curData:{},
    };
  },
  components: {
    "collection-tree": CollectionTree,
    "yuan-tree": YuanTree,
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

     eventBus.$off(eventCollection.EVENT_ADD_COLLECTION_GROUP)
      .$on(
        eventCollection.EVENT_ADD_COLLECTION_GROUP, data => {
          this.curNode = data.data;
      }
    );

    eventBus.$off(eventCollection.EVENT_ADD_YUAN_GROUP)
      .$on(
        eventCollection.EVENT_ADD_YUAN_GROUP, data => {
          this.yuanForm.preplanId = data.data.id;
          this.yuanForm.nodeName = data.data.value;
      }
    );

    eventBus.$off(eventCollection.EVENT_PLAY_COLLECTION_CAMERA)
      .$on(
        eventCollection.EVENT_PLAY_COLLECTION_CAMERA, data => {
          _this.playerVideo(data);
        }
      );
  },
  mounted() {
    this.getTollgate();
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    getTollgateList() {
      let nodeList = this.$refs.shebeitree.getCheckedNodes(true); //获取选中的节点所组成的数组
      this.tollgateNode = [];
      this.tollgateList = [];
      this.tollgateNodeObj = [];

      for (let i = 0; i < nodeList.length; i++) {
        if (nodeList[i].nodeType == '769') {
          // let curAllName = this.getTollgateName(nodeList[i]);
          // this.tollgateNode.push(curAllName);
          this.tollgateList.push(nodeList[i].id);
          this.tollgateNodeObj.push({indexCode:nodeList[i].id,name: nodeList[i].value});
        }
      }
    },
    getTollgateName(node) {
      let curAllName = '';
      let curNode = this.$refs.shebeitree.getNode(node);

      while(curNode.data.name &&curNode.data.id != 0) {
        curAllName = curNode.data.name + curAllName;
        curNode = curNode.parent;
      }

      return curAllName;
    },
    checkSel(treeNode) {
      let ids = this.tollgateList.slice(0);
      this.getTollgateList();

      //触发地图事件
      // let isSelAll = this.$refs.shebeitree.getNode('51000000000000000000').checked; //是否全选四川省，代码51
      // let isSel = this.$refs.shebeitree.getNode(treeNode).checked; //当前是否选中

      eventBus.$emit(eventCollection._bmap_tree2map, this.tollgateList, {
        id: treeNode.id,
        // state: isSel
      });
       //触发地图事件   
    },
    selCurNode(data, node, self) {     
      //触发地图定位
      // eventBus.$emit(eventCollection._bmap_treeclick2map, this.tollgateList, {
      //   // id: data.id,
      //   // state: node.checked
      //   data:data
      // });

      //  eventBus.$emit(eventCollection._bmap_treeclick2map, data);

    },
    getTollgate() {
      let param = '-1';
      let _this = this;

      return shipinApi
        .excontrolGetCameraTree(param)
        .then(res => res)
        .then(data => {
          _this.tollgatedata = data.data;
          _this.$refs.shebeitree.setCheckedKeys([]);
          
          let result = data.data;
          while(result.length == 1) {
            _this.defaultExpand.push(result[0].id);
            result = result[0].children;
          }
        });
    },
    resetChecked() {
      this.$refs.shebeitree.setCheckedKeys([]);
      this.checkSel();
      eventBus.$emit(
        eventCollection.EXCONTROL_GET_SELECTED_SHEBEI,
        this.tollgateList,
        this.tollgateNode
      );
    },
    checkSelData() {
      this.getTollgateList();
      if (this.tollgateList.length == 0) {
        this.$message({
          message: "请至少选择一个监控点",
          type: "warning"
        });
        return false;
      }
      return true;
    },
    setMoreOperation(event,obj,node,self) {
      this.curData = node.data;
      if (node.data.nodeType == '769' || this.checkSelData()) {
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
    closeSetForm() {
      this.setVisibility = false;
    },
    getSetData() {

    },
    newCollection() {
      this.scVisibility = true;
      this.ResetCollection = true;
    },
    addCollection() {
      if (!this.curNode) {
        this.$message({
          message: '请选择一个分组！',
          type: 'warning'
        });
        return false;
      }
      let param = {};
      param.nodeId = parseInt(this.curNode.id);
      param.cameraList = this.tollgateNodeObj;
      let _this = this;

      return shipinApi
        .addCollectionTree(param)
        .then(res => res)
        .then(data => {
          //更新收藏的数据
          _this.$refs.collectionTree.searchTreeData();
          _this.closeCollection();
        });
    },
    closeCollection() {
      this.scVisibility = false;
      this.ResetCollection = false;
    },
    selGroup() {
      this.addYuanGroup();
    },
    addGroup() {
      eventBus.$emit(
        eventCollection.EVENT_ADD_COLLECTION
      );
    },
    newYuan() {
      this.yuanVisibility = true;
       this.hackReset = true;
      this.yuanForm.nodeName="";
       this.yuanForm.period="";
    },
    addYuanGroup() {
      eventBus.$emit(
        eventCollection.EVENT_ADD_YUAN
      );
    },
    addYuanForm() {
      if (!this.yuanForm.preplanId || this.yuanForm.preplanId==1) {
        this.$message({
          message: '请选择一个二级分组！',
          type: 'warning'
        });
        return false;
      }
      if (!this.yuanForm.period) {
        this.$message({
          message: '请选择执行周期！',
          type: 'warning'
        });
        return false;
      }
      let param = {};
      param.preplanId = parseInt(this.yuanForm.preplanId);
      param.cameraList = this.tollgateNodeObj;
      param.period = this.yuanForm.period;
      let _this = this;

      return shipinApi
        .addYuanTree(param)
        .then(res => res)
        .then(data => {
          //更新收藏的数据
          _this.$refs.yuanTree.searchTreeData();
          _this.closeYuanForm();
        });
    },
    closeYuanForm() {
      this.yuanVisibility = false;
      this.hackReset = false;

      this.yuanForm.nodeName = '';
      this.yuanForm.preplanId = '';
      this.yuanForm.parentId = '';
      this.yuanForm.period = '';    
    }
  }
};
</script>

<style scoped>
.root-tree {
  padding: 0 5px;
  height: 100%;
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
.popover-content {
  max-height: 200px;
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
</style>
