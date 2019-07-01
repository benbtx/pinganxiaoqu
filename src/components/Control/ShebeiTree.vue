<template>
    <div class="root-tree">
        <div class="tree-title">
            <p>已选卡口数量：<strong style="font-size:18px;">{{tollgateList.length}}</strong></p>
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
            node-key="indexCode"
            :default-checked-keys="tollgateList"
            @check="checkSel"
            @node-click="selCurNode"
            ref="shebeitree">
        </el-tree>
    </div>
</template>

<script>
import { excontrolApi } from "@/https";
import eventBus from "@/event";
import { eventCollection } from "@/event/resources";
export default {
  name: "shebeiTree",
  watch: {
    filterText(val) {
      this.$refs.shebeitree.filter(val);
    },
    addtype(val) {
      this.getTollgate();
      this.tollgateList = this.cakoudefault;
      // //切换tab导致卡口数据发生变化，触发地图卡口数据更新
      //  eventBus.$emit(
      //   eventCollection._bmap_transKakou,
      //   this.tollgateList,
      //   this.addtype
      // );
    }
  },
  props: ["addtype", "cakoudefault", "showType"],
  data() {
    return {
      filterText: "",
      defaultProps: {
        id: "indexCode",
        label: "name",
        children: "children",
        isLeaf: 'leaf'
      },
      tollgatedata: [],
      tollgateList: [],
      tollgateNode: [],
      defaultExpand: []
    };
  },
  created() {
    //监听地图传回的卡口数据改变，修改对应数据
    eventBus.$on(eventCollection._bmap_map2tree, obj => {
      this.changeTree(obj);
    });

    if (this.showType == "details") {
      this.defaultProps.disabled = "name";
    }
  },
  methods: {
    // handler(b,m){
    //   alert(b);
    // },
    changeTree(obj) {
      console.log(obj);
      console.log(this);

      if (!this.$refs.shebeitree) return;
      if (!this.$refs.shebeitree.setChecked) return;
      this.$refs.shebeitree.setChecked(obj.id, obj.ischeck);
      // this.$nextTick(() => { this.$refs.shebeitree.setChecked(obj.tollgateID, obj.ischeck);});
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    getTollgateList() {
      let nodeList = this.$refs.shebeitree.getCheckedNodes(true); //获取选中的节点所组成的数组
      this.tollgateNode = [];
      this.tollgateList = [];

      for (let i = 0; i < nodeList.length; i++) {
        if (nodeList[i].unitType == '19820' || nodeList[i].unitType == '19821') {
          let curAllName = this.getTollgateName(nodeList[i]);
          this.tollgateNode.push(curAllName);
          this.tollgateList.push(nodeList[i].indexCode);
        }
      }
    },
    getTollgateName(node) {
      let curAllName = '';
      let curNode = this.$refs.shebeitree.getNode(node);

      while(curNode.data.name && curNode.data.indexCode != 0) {
        curAllName = curNode.data.name + curAllName;
        curNode = curNode.parent;
      }

      return curAllName;
    },
    checkSel(obj) {
      let isSelAll = this.$refs.shebeitree.getNode('51').checked; //是否全选四川省，代码51
      let isSel = this.$refs.shebeitree.getNode(obj).checked; //当前是否选中

      this.getTollgateList();
      if (isSelAll) {
        this.tollgateNode = ['全网布控'];
        // this.tollgateList = [];
        // let _this = this;
        
        // excontrolApi
        //   .excontrolGetTreeDev({})
        //   .then(res => res)
        //   .then(data => {
        //     let result = data.data.list;
        //     for (let i=0;i<result.length;i++) {
        //       _this.tollgateList.push(result[i].deviceCode); 
        //       debugger              
        //     }
        //   });
      }
      // }　else {
        // this.getTollgateList();
      // }

      // console.log(this.$refs.shebeitree.getCurrentNode());
      // var curcurrentnode = this.$refs.shebeitree.getCurrentNode();
      // console.log(121);
      // console.log(this.tollgateList);
      // console.log(this.tollgateNode);
      //  console.log(curcurrentnode);
      // console.log(121);

      eventBus.$emit(
        eventCollection.EXCONTROL_GET_SELECTED_SHEBEI,
        this.tollgateList,
        this.tollgateNode
      );
      eventBus.$emit(eventCollection._bmap_tree2map, this.tollgateList, {
        id: obj.indexCode||obj.tollgateID,
        state: isSel
      });

      // if (isSel) {
      //   // 选中状态
      // } else {
      //   // 未选中状态
      // }
    },
    selCurNode(data, node, self) {     
      //触发地图定位
      eventBus.$emit(eventCollection._bmap_tree2map, this.tollgateList, {
        id: data.indexCode||data.tollgateID,
        state: node.checked
      });
    },
    // loadNode(node, resolve) {
    //   let param = {};
    //   console.log(node)
    //   param.unitCode = node.data.indexId;

    //   let _this = this;
    //   return excontrolApi
    //     .excontrolGetTreeNode(param)
    //     .then(res => res)
    //     .then(data => {
    //       if (data.data.length == 0) {
    //         _this.getTreeDevList(node, resolve);
    //       } else {
    //         let result = data.data;
    //         for (let i=0;i<result.length;i++) {
    //           result[i].indexId = result[i].indexCode;
    //         }
    //         resolve(result);
    //       }
    //     });
    // },
    // getTreeDevList(node, resolve) {
    //   let param = {};
    //   param.indexCode = node.data.indexId;

    //   return excontrolApi
    //     .excontrolGetTreeDev(param)
    //     .then(res => res)
    //     .then(data => {
    //       let result = data.data.list;
    //       for (let i=0;i<result.length;i++) {
    //         result[i].name = result[i].cameraName;
    //         result[i].indexId = result[i].deviceCode;
    //         result[i].leaf = true;
    //       }

    //       resolve(result);
    //     });
    // },
    getTollgate() {
      let param = {};
      
      if (this.addtype == "ry") {  // 0表示人，1表示车
        param.unitType = '0'; 
      } else if (this.addtype == "che") {
        param.unitType = '1'; 
      }
      let _this = this;
      return excontrolApi
        .excontrolGetTreeNode(param)
        .then(res => res)
        .then(data => {
          if (data.data[0].indexCode == 0) { //不要indexCode==0的外层
            _this.tollgatedata = data.data[0].children;
          } else{
            _this.tollgatedata = data.data;
          }

          let result = data.data;
          while(result.length == 1) {
            _this.defaultExpand.push(result[0].indexCode);
            result = result[0].children;
          }
          
          // if (!_this.showType) {
          //   return;
          // }
          console.log(_this);
           console.log(data);
          //    console.log(_this.addtype);
          if (_this.addtype != "") {
            eventBus.$emit(
              eventCollection._bmap_transKakou,
              _this.tollgatedata,
              _this.addtype
            );
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
          message: "请至少选择一个卡口",
          type: "warning"
        });
        return false;
      }
      return true;
    }
  },
  computed: {
    // shebeidata: function() {
    //   return [{ name: "全部", children: this.tollgatedata }];
    // }
    // tollgateList: function () {
    //     return this.cakoudefault;
    // }
  },
  mounted() {
    if (this.addtype) {
      this.getTollgate();
    }
    this.tollgateList = this.cakoudefault || [];

    // //监听地图传回的卡口数据改变，修改对应数据
    // eventBus.$on(eventCollection._bmap_map2tree, obj => {
    //   // this.map2tree = obj;
    //   this.changeTree(obj);
    // });
  }
};
</script>

<style scoped>
.root-tree {
  padding: 0 5px;
  height: calc(100% - 40px);
}
.tree-title {
  margin: 0;
  padding: 0 10px;
}
.tree-title p {
  margin: 0;
  height: 40px;
  line-height: 40px;
}
</style>
