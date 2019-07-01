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
            :data="kakoudata"
            :props="defaultProps"
            :default-expand-all="false"
            show-checkbox
            :filter-node-method="filterNode"
            node-key="tollgateID"
            :default-checked-keys="tollgateList"
            :check-on-click-node=true
            @check-change="checkSel"
            ref="kakoutree">
        </el-tree>
    </div>
</template>

<script>
import { excontrolApi } from "@/https";
import eventBus from "@/event";
import { eventCollection } from "@/event/resources";
export default {
  watch: {
    filterText(val) {
      this.$refs.kakoutree.filter(val);
    },
    addtype(val) {
      this.getTollgate(val);
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
        id: "tollgateID",
        label: "name",
        children: "children"
      },
      tollgatedata: [],
      tollgateList: [],
      tollgateNode: []
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

      if (!this.$refs.kakoutree) return;
      if (!this.$refs.kakoutree.setChecked) return;
      this.$refs.kakoutree.setChecked(obj.id, obj.ischeck);
      // this.$nextTick(() => { this.$refs.kakoutree.setChecked(obj.tollgateID, obj.ischeck);});
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    getTollgateInfo(id, tollgatedata) {
      let tollgateinfo = null;
      for (let i = 0; i < tollgatedata.length; i++) {
        if (tollgatedata[i].tollgateID == id) {
          tollgateinfo = tollgatedata[i];
          break;
        }
      }

      return tollgateinfo;
    },
    checkSel(obj, isSel, hasChild) {
      // if (obj.hasOwnProperty("name")) {
      //   if (obj.name == "全部") {
      //     return;
      //   }
      // }
      this.tollgateList = this.$refs.kakoutree.getCheckedKeys(true); //获取选中的节点id
      this.tollgateNode = this.$refs.kakoutree.getCheckedNodes(true); //获取选中的节点所组成的数组

      // console.log(this.$refs.kakoutree.getCurrentNode());
      // var curcurrentnode = this.$refs.kakoutree.getCurrentNode();
      // console.log(121);
      // console.log(this.tollgateList);
      // console.log(this.tollgateNode);
      //  console.log(curcurrentnode);
      // console.log(121);

      eventBus.$emit(
        eventCollection.EXCONTROL_GET_SELECTED_CAKOU,
        this.tollgateList,
        this.tollgateNode
      );
      eventBus.$emit(eventCollection._bmap_tree2map, this.tollgateList, {
        id: obj.tollgateID,
        state: isSel
      });

      // 状态改变执行的代码
      let kakouinfo = this.getTollgateInfo(obj.tollgateID, this.tollgatedata);
      console.log(kakouinfo);
      if (isSel) {
        // 选中状态
      } else {
        // 未选中状态
      }
    },
    getTollgate(addtype) {
      let param = {};
      if (addtype == "ry") {
        param.tollgateUsage = 80;
      } else if (addtype == "che") {
        param.tollgateUsage = 81;
      }
      return excontrolApi
        .excontrolGetBktollgate(param)
        .then(res => res)
        .then(data => {
          this.tollgatedata = data.data;
          // if (!this.showType) {
          //   return;
          // }
          console.log(this);
           console.log(this.showType);
             console.log(this.addtype);
          // if (this.addtype != "") {
          //   eventBus.$emit(
          //     eventCollection._bmap_transKakou,
          //     this.tollgatedata,
          //     addtype
          //   );
          // }
        });
    },
    resetChecked() {
      this.$refs.kakoutree.setCheckedKeys([]);
      this.checkSel();
      eventBus.$emit(
        eventCollection.EXCONTROL_GET_SELECTED_CAKOU,
        this.tollgateList,
        this.tollgateNode
      );
    },
    checkSelData() {
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
    kakoudata: function() {
      return [{ name: "全部", children: this.tollgatedata }];
    }
    // tollgateList: function () {
    //     return this.cakoudefault;
    // }
  },
  mounted() {
    if (this.addtype) {
      this.getTollgate(this.addtype);
    }
    this.tollgateList = this.cakoudefault;

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
