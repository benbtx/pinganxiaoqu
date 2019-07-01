<template>
  <div class="root-tree">
     <div class="buttons" v-if="!collectionList">
        <span class="fa fa-plus add" @click="newGroup"></span>
        <span class="fa fa-edit edit" @click="editGroup"></span>
        <span class="fa fa-times delete" @click="deleteGroup"></span>
      </div>
      <el-tree
        ref="collectiontree"
        :data="scData"
        default-expand-all
        :props="scDefaultProps"
        @node-click="selCurNode"
        @node-contextmenu="setMoreOperation"
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        highlight-current
        >
        <!-- :load="loadCameraNode"
        lazy=""
        > -->
        <span class="custom-tree-node" slot-scope="{ node, data }">
            <span class="tree-icon" :class="{devtype1: data.nodeType=='folder', devtype2: data.nodeType=='camera'}"></span>
            <span class="tree-icon">{{ node.label }}</span>
        </span>
      </el-tree>
      <div id="camera-popover-menu" class="camera-popover-menu" v-if="cameraVisibility">
        <span @click="playerVideo(curDataCode)">查看监控</span>
        <span @click="deleteCamera">取消收藏</span>
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
          <el-form :model="groupForm" ref="groupForm" :rules="grouprule" class="group-form" label-width="80px">
              <el-form-item label="上级分组：">
                {{groupForm.superName}}
              </el-form-item>
              <el-form-item label="分组名称：" prop="nodeName">
                <el-input  type="text" v-model="groupForm.nodeName"></el-input>
              </el-form-item>
              <el-form-item prop="visibility" style="margin-top:10px;">
                <el-radio v-model="groupForm.visibility" :label=0>仅自己可见</el-radio>
                <el-radio v-model="groupForm.visibility" :label=1>所有人可见</el-radio>
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
  </div>
</template>

<script>
import { shipinApi } from "@/https";
import eventBus from "@/event";
import { eventCollection } from "@/event/resources";
export default {
  name: "collectionTree",
  props: ['collectionList'],
  data() {
    return {
      scData: [],
      scDefaultProps: {
        children: 'children',
        label: 'value'
      },
      curNode: null,
      groupTitle: '新建分组',
      groupForm: {
        nodeName:'',
        visibility: 0,
        parentId: 0
      },
      setVisibility:false,
      cameraVisibility: false,
      curDataCode: '',
      cameraList: [],


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
      let moreMenu = document.getElementById("camera-popover-menu");
      if (moreMenu &&　_this.cameraVisibility) {
        _this.cameraVisibility = false;
      }
    }, true);

    eventBus.$off(eventCollection.EVENT_ADD_COLLECTION)
      .$on(eventCollection.EVENT_ADD_COLLECTION, () => {
        this.newGroup();
    });
  },
  mounted() {
    this.searchTreeData();
  },
  methods: {
    filterNode(value, data) {
      console.log(333);
      let obj = {};
      if (data.nodeType == 'camera') {
        obj.id = data.id;
        obj.pid = data.parentId;
        obj.name = data.value;
        obj.latitude = data.payload.latitude;
        obj.longitude = data.payload.longitude;
        obj.id = data.id;
        
        obj.state = false;
        this.cameraList.push(obj);
      }

      return true;
    },
    searchTreeData(id) {
      let parentId = parseInt(id) || 0;
      return shipinApi
        .searchCollectionTree(parentId)
        .then(res => res.data)
        .then(data => {
          this.scData  = data;
          this.cameraList=[];
          console.log(this.$refs);
          if (this.$refs.collectiontree) {
            this.$refs.collectiontree.filter();
            console.log(this.cameraList);
            //触发地图事件：显示搜藏的spjk
            eventBus.$emit(eventCollection._bmap_collectionTree2map,this.cameraList);
          }

        });
    },
    selCurNode(data, node, self) {     
      //触发地图定位
      if (data.nodeType == 'camera') {
        this.curNode=null;
         eventBus.$emit(eventCollection._bmap_collectionTree2map,data );
      } else {
        this.curNode = node;
        eventBus.$emit(
          eventCollection.EVENT_ADD_COLLECTION_GROUP, node
        );
      }  
    },
    newGroup() {
      if (!this.curNode || this.curNode.data.nodeType=='camera') {
        this.$message({
          message: '请选择一个分组添加！',
          type: 'warning'
        });
        return false;
      }

      this.groupTitle = '新建分组';
      this.setVisibility = true;
      if (this.curNode) {
        this.groupForm.superName = this.curNode.data.value;
      } else {
        this.groupForm.superName = '我的分组';
      }
      this.groupForm.parentId = parseInt(this.curNode.data.id) || 0;
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
        this.groupForm.superName = this.curNode.parent.data.value;
        this.groupForm.visibility = this.curNode.data.payload.visibility;
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
          .deleteCollection(param)
          .then(res => res)
          .then(data => {
            //更新收藏的数据
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
      
      //保存分组
      let param = {};
      param.nodeName = this.groupForm.nodeName;
      param.visibility = parseInt(this.groupForm.visibility);

      let _this = this;
      _this.$refs["groupForm"].validate(valid => {
        if (valid) {
          if(_this.groupTitle=='编辑分组') {
            param.nodeId = parseInt(_this.curNode.data.id);

            return shipinApi
              .modifyCollection(param)
              .then(res => res)
              .then(data => {
                //更新收藏的数据
                _this.searchTreeData();
                _this.closeForm();
                _this.curNode = null;
              });
          } else {
            param.parentId = parseInt(_this.curNode.data.id);

            return shipinApi
              .addCollection(param)
              .then(res => res)
              .then(data => {
                //更新收藏的数据
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
    loadCameraNode(node, resolve) {
      let parentId = parseInt(node.data.id);
      
      this.searchTreeData(parentId,resolve);
    },
    deleteCamera() {
      this.$confirm("确定取消收藏？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        let param = {};
        let nodeData = this.curDataCode;
        param.indexCode = nodeData.id;
        param.nodeId = parseInt(nodeData.parentId);

        return shipinApi
          .deleteCollectionCamera(param)
          .then(res => res)
          .then(data => {
            //更新收藏的数据
            this.searchTreeData();
          });
      }).catch(() => {});
    },
    setMoreOperation(event,obj,node,self) {
      this.curDataCode = node.data;

      if (node.data.nodeType == 'camera') {
        this.cameraVisibility = true;
        this.$nextTick(() => {
          let dom = document.getElementById('camera-popover-menu');
          dom.style.left = event.clientX +'px';
          dom.style.top = event.clientY +'px';
        });
      } else {
        this.cameraVisibility = false;
      }
    },
    hideMoreOperation(event) {
      let moreMenu = document.getElementById("camera-popover-menu");
      if (moreMenu && !moreMenu.contains(event.target) &&　this.cameraVisibility) {
        this.cameraVisibility = false;
      }
    },
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
.camera-popover-menu {
  position: fixed;
  background: #fff;
  border: 1px solid #999;
  border-radius: 2px;
  z-index: 3;
}
.camera-popover-menu span {
  display: block;
  width: 120px;
  padding: 5px 10px;
  border-bottom: 1px solid #999;
  cursor: pointer;
}
.camera-popover-menu span:nth-last-child(1) {
  border-bottom: none;
}
</style>
