<template>
    <div class="model-hold details-bukong">
        <el-table class='gj' :data="srcTableData"  @row-click="handleRowClick">
            <el-table-column type="index" width="60" label="序号" align="center">
            </el-table-column>
            <el-table-column prop="triggerTime" width="90" label="告警时间">
            </el-table-column>
            <el-table-column prop="name" label="发现位置" width="200">
            </el-table-column>
        </el-table>
        
        <el-pagination background @current-change="getDataByPage" :page-size="20" :pager-count="5" layout="total, prev, pager, next" :total="srcrestotal">
        </el-pagination>
    </div>
</template>
<script>
import { excontrolApi } from "@/https";
import eventBus from "@/event";
import { eventCollection } from "@/event/resources";
export default {
  name: "Gaojingliebiao",
  data() {
    return {
      srcTableData: [],
      srcrestotal: 0,
      detailsType: "",
      detailsBkid: "",
      detailsKey: "",
      datatimerange: []
    };
  },
  created() {
    // //监听地图传回的卡口数据改变，修改对应数据
    // eventBus.$on(eventCollection._bmap_map2tree, obj => {
    //   // this.map2tree = obj;
    //   this.changeTree(obj);
    // });
  },
  methods: {
    getDataByPage(ctrcurrentPage) {
      let param = {};
      param.pageNum = ctrcurrentPage;
      param.pageSize = 20;
      if (this.detailsBkid != "") {
        param.dispositionID = this.detailsBkid;
      }
      //    param.dispositionCategory = this.detailsType;
      if (this.datetimerange) {
        param.beginTriggerTime = this.datetimerange[0];
        param.endTriggerTime = this.datetimerange[1];
      }

      if (this.detailsType == 2) {
        param.dispositionCategory = 2;
        param.personObject = this.detailsKey;
      } else if (this.detailsType == 4) {
        param.dispositionCategory = 2;
        param.idNumber = this.detailsKey;
      } else if (this.detailsType == 3) {
        param.dispositionCategory = 3;
        param.motorVehicleObject = this.detailsKey;
      }
      return excontrolApi
        .excontrolGaojingSearch(param)
        .then(res => res.data)
        .then(data => {
          this.srcrestotal = data.total;
          //生成表格
          this.srcTableData = data.pageData;
          for (var i = 0; i < this.srcTableData.length; i++) {
            this.srcTableData[i].triggerTime = this.getFormatDate(
              this.srcTableData[i].triggerTime
            );

            if (this.srcTableData[i].dispositionCategory == "2") {
              this.srcTableData[i].dispositionCategory = "人员";
            } else if (this.srcTableData[i].dispositionCategory == "3") {
              this.srcTableData[i].dispositionCategory = "车辆";
            }

            if (this.srcTableData[i].dispositionCategory == "车辆") {
              let string = "";
              // if (this.srcTableData[i].targetFeature.plateNo != null) {
              //   this.cphm = this.srcTableData[i].targetFeature.plateNo;
              //   string += this.cphm;
              // }
              if (this.srcTableData[i].targetFeature.brand != null) {
                this.clpp = this.getCLpp(
                  this.srcTableData[i].targetFeature.brand
                );
                // string += "-" + this.clpp;
                this.srcTableData[i].targetFeature.brand=this.clpp
              }
              // if (this.srcTableData[i].targetFeature.plateColor != null) {
              //   this.cpys = this.getCLcolor(
              //     this.srcTableData[i].targetFeature.plateColor
              //   );
              //   string += "-" + this.cpys;
              // }
              // this.srcTableData[i].targetFeature = string;
            } else if (this.srcTableData[i].dispositionCategory == "人员") {
              // let stringry = "";
              // if (this.srcTableData[i].targetFeature.idCard != null) {
              //   this.ryID = this.srcTableData[i].targetFeature.idCard;
              //   stringry += this.ryID;
              // }
              // if (this.srcTableData[i].targetFeature.name != null) {
              //   this.ryxm = this.srcTableData[i].targetFeature.name;
              //   stringry += "-" + this.ryxm;
              // }

              // this.srcTableData[i].targetFeature = stringry;
            }
          }

          //初始化告警数据
          eventBus.$emit(
            eventCollection._gaojingliebiao2map,
            this.srcTableData
          );
          
        });
    },
    getGaojingliebiaoData(type, bkid) {
      this.detailsType = type;
      this.detailsBkid = bkid;
      this.getDataByPage(1);
    },
    getGaojingliebiaoShikongData(type, key, datatimerange) {
      this.detailsType = type;
      this.detailsKey = key;
      this.datatimerange = datatimerange;
      this.getDataByPage(1);
    },
    handleRowClick(row, event, column) {
      // console.log(row);
      // console.log(event);
      // console.log(column);
     
      // event.target.parentNode.parentNode.style.backgroundColor="rgb(174, 195, 161)";
      //emit 触发地图点击高亮
      // eventBus.$emit(eventCollection._gaojingliebiao2map, row);
      

    }
  },
  mounted() {}
};
</script>