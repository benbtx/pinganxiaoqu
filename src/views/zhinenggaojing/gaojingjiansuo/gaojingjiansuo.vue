<template>
<div class="content-body">
    <div class="page-bread">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>告警检索</el-breadcrumb-item>
        <!-- <el-breadcrumb-item>布控任务检索</el-breadcrumb-item> -->
      </el-breadcrumb>
    </div>
    <div class="content-row">
      <div class="bl-content">
            <div class="content-title">
                <span>布控任务检索</span>
            </div>
            <div style="margin-top:20px;padding:0 10px;">
                <div class="search-group">
                    <div class="search-item">
                    <span class="label">告警日期：</span>
                    <el-date-picker
                        v-model="datetimerange"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                    </div>
                    <div class="search-item">
                    <span class="label">布控编号：</span>
                    <el-input v-model="bukongbh"></el-input>
                    </div>
                    <div class="search-item">
                    <span class="label">布控类型：</span>
                    <el-select v-model="bukongtype"  placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    </div>
                    <div class="search-item">
                    <span class="label">关键字：</span>
                    <el-input v-model="bukongkey">
                    </el-input>
                    </div>
                    <span class="search-item">
                    <button class="btn btn-info ridiusnull btn-search" type="button" @click="searchGaojing(1)">查询</button>
                    </span>
                </div>
                <div style="margin-top:10px;">
                    <div class="model-hold">
                    <el-table :data="srcTableData">
                        <el-table-column type="index" width="80" label="序号">
                        </el-table-column>
                        <el-table-column prop="triggerTime" label="告警时间" min-width="150">
                        </el-table-column>
                        <el-table-column prop="dispositionCategory" label="布控类型" min-width="100">
                        </el-table-column>
                        <el-table-column prop="targetFeature" min-width="220" label="布控特征">
                        </el-table-column>
                        <el-table-column prop="name" min-width="200" label="发现位置">
                        </el-table-column>
                        <el-table-column prop="reason" min-width="200" label="布控原因">
                        </el-table-column>
                        <el-table-column label="操作" min-width="200" fixed='right'>
                        <template slot-scope="scope">
                            <el-button type="text" size="small" class="operate-btn" @click="lookbkdetail(scope.row)">
                            <i class="fa fa-file-text-o"></i> 告警详情</el-button>
                        </template>
                        </el-table-column>
                    </el-table>
                    </div>
                    <el-pagination background @current-change="searchGaojing" :page-size="10" layout="total, prev, pager, next, jumper" :total="srcrestotal">
                    </el-pagination>
                </div>

            </div>
      </div>
    </div>

    <el-dialog
        title="告警详情"
        :visible.sync="ryvisibility"
        width="600px"
        class="modal-popover"
        >
       <gaojingryxiangqing :rydetailsdata="gaojingData"></gaojingryxiangqing>
    </el-dialog>
    <el-dialog
        title="告警详情"
        :visible.sync="clvisibility"
        width="600px"
        class="modal-popover"
        >
        <gaojingclxiangqing :cldetailsdata="gaojingData"></gaojingclxiangqing>
    </el-dialog>
</div>
</template>
<script>
import { excontrolApi } from "@/https";
import Gaojingryxiangqing from "@/components/Control/GaojingRYXiangqing";
import Gaojingclxiangqing from "@/components/Control/GaojingCLXiangqing";
export default {
  name: "gaojingjiansuo",
  data() {
    return {
        ryvisibility:false,
        clvisibility:false,
        srcTableData:[],
         options: [
            {
            label: '车辆',
            value: '3'
            },{
            label: '人员',
            value: '2'
            }
        ],
        datetimerange: [],
        bukongtype: '2',
        bukongkey:'',
        bukongbh: '',
        srcrestotal: 0,
        pageSize: 10,
        multipleSelection: [],
        cphm:'',
        cpys:'',
        clpp:'',
        clys:'',
        ryID:'',
        ryxm:'',
        gaojingData: {
        targetFeature: {
          vehicleColor: '',
        }
      },
      cpcolorlist: this.getCpysList()
    }
  },
  methods: {
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
      searchGaojing: function(ctrcurrentPage) {
      let param = {};
      param.pageNum = ctrcurrentPage;
      param.pageSize = 10;
      if (this.datetimerange) {
        param.beginTriggerTime = this.datetimerange[0];
        param.endTriggerTime = this.datetimerange[1];
      }
      param.dispositionID = this.bukongbh;
      if(this.bukongtype=='2')
      {
        param.personObject = this.bukongkey;
      }
      else if(this.bukongtype=='3')
      {
        param.motorVehicleObject = this.bukongkey;
      }
      param.dispositionCategory = this.bukongtype;
    //  param.notificationID
    //  param.idNumber身份证
    //  param.plateNo车牌号

      return excontrolApi
        .excontrolGaojingSearch(param)
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.srcrestotal = data.total;
          //生成表格
          this.srcTableData = data.pageData;
          for(var i=0;i<this.srcTableData.length;i++)
          {
            this.srcTableData[i].triggerTime = this.getFormatDate(this.srcTableData[i].triggerTime);

            if(this.srcTableData[i].dispositionCategory=="2")
            {
              this.srcTableData[i].dispositionCategory="人员";
            }
            else if(this.srcTableData[i].dispositionCategory=="3")
            {
              this.srcTableData[i].dispositionCategory="车辆";
            }
            
            if(this.srcTableData[i].dispositionCategory=="车辆")
            {
              let string='';
              if(this.srcTableData[i].targetFeature.plateNo!=null)
              {
                this.cphm = this.srcTableData[i].targetFeature.plateNo;
                string += this.cphm;
              }
              if(this.srcTableData[i].targetFeature.brand!=null)
              {
                this.clpp = this.getCLpp(this.srcTableData[i].targetFeature.brand);
                string += '-' + this.clpp;
              }
              if(this.srcTableData[i].targetFeature.plateColor!=null)
              {
                this.cpys = this.getCLcolor(this.srcTableData[i].targetFeature.plateColor);
                string += '-' + this.cpys;
              }
              this.srcTableData[i].targetFeature =  string;
            }
            else if(this.srcTableData[i].dispositionCategory=="人员")
            {
              let stringry ='';
              this.ryID = '未登记';
              if(this.srcTableData[i].targetFeature.idCard!=null)
              {
                let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                if (reg.test(this.srcTableData[i].targetFeature.idCard)) {
                  this.ryID = this.srcTableData[i].targetFeature.idCard;
                }
              }
              stringry += this.ryID;
              if(this.srcTableData[i].targetFeature.name!=null)
              {
                this.ryxm = this.srcTableData[i].targetFeature.name;
                stringry += '-' + this.ryxm;
              }
             
              this.srcTableData[i].targetFeature = stringry;
            }
          
          }

        });
    },  
    lookbkdetail(data) {
        let bkType = '';
        if(data.dispositionCategory=="人员")
        {
          this.ryvisibility=true;
          bkType = '2';
        }
        else if(data.dispositionCategory=="车辆")
        {
          this.clvisibility=true;
          bkType = '3';
        }
        
        this.getDetailsData(data.notificationID, bkType);
      },
      getDetailsData(infoId, bkType) {
        let param = {};
        param.notificationID = infoId;
        param.dispositionCategory = bkType;
        
        return excontrolApi
        .excontrolGaojingSearchDetails(param)
        .then(res => res.data)
        .then(data => {
          this.gaojingData = data;

          if(bkType=="2") {
            this.ryvisibility = true;
          } else if(bkType=="3") {
            this.clvisibility = true;
          }
        });
      }
  },
  mounted() {
    this.searchGaojing(1);
  },
  components: {
    "gaojingryxiangqing": Gaojingryxiangqing,
    "gaojingclxiangqing": Gaojingclxiangqing
  },
}
</script>

<style scoped>
.content-row {
  padding:0;
}
.bl-content {
  width: 1400px;
  min-height: calc(100vh - 130px);
  margin-bottom: 30px;
  width:100%;
  box-sizing: border-box;
  background: #fff;
  border: 1px solid #d9dfe5;
  position: relative;
}
.model-hold {
  margin-bottom: 50px;
}
.btn-info {
  background-color: #13b1e1;
  border: none;
  margin: 0 15px;
}
.btn-info:hover {
  border: none;
  outline: none;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
}
.btn-info:focus,
.btn-info:active,
.btn-info:visited {
  border: none;
  outline: none;
  background-color: #13b1e1;
}
.btn-search {
  min-width: 100px;
}
.search-group {
  display: flex;
  flex: 1;
}
.search-item {
  display: flex;
  margin-right: 20px;
  flex-direction: row;
  flex: 0 1 auto;
  justify-content: center;
  align-items: center;
}
.search-item .label {
  width: 80px;
  color: #595959;
  font-weight: normal;
  font-size: 100%;
}
</style>
