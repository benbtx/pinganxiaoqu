<template>
    <div class="content details-bukong">
        <p class="title"><i class="fa fa-bookmark" style="color:#12B1E1"></i> 基本信息</p>
        <el-form  ref="bkdetailsdata" label-width="84px" :inline="true" style="width:100%;">
            <!-- <el-form-item label="布控编号：">
                <span>{{bkdetailsdata.dispositionID}}</span>                    
            </el-form-item> -->
            <el-form-item label="布控状态：">
                <span>{{handleBKStatus(bkdetailsdata.dispositionStatus)}}</span>                    
            </el-form-item>
            <el-form-item label="发起人员：">
                <span>{{bkdetailsdata.applicantName}}</span>                    
            </el-form-item>
            <el-form-item label="布控时间：">
                <span>{{getFormatDate(bkdetailsdata.creatTime)}}</span>                    
            </el-form-item>
            <el-form-item label="布控原因：">
                <span>{{getBkyy(bkdetailsdata.reason, bkdetailsdata.dispositionCategory)}}</span>                    
            </el-form-item>
        </el-form>
        <p class="title"><i class="fa fa-bookmark" style="color:#12B1E1"></i> 布控对象</p>        
        <div style="width:100%;" v-show="bkdetailsdata.dispositionCategory=='2'">
            <el-form  ref="bkdetailsdata" label-width="84px" :inline="true" style="width:235px;float:left;">
                <el-form-item label="布控类型：">
                    <span>人员</span>
                </el-form-item>
                <el-form-item label="姓名：">
                    <span>{{bkdetailsdata.targetFeature.name}}</span>                    
                </el-form-item>
                <el-form-item label="身份证：">
                <span>{{handleBKSfz(bkdetailsdata.targetFeature.idCard)}}</span> 
                </el-form-item>
                <el-form-item label="车牌号：">
                <span>{{bkdetailsdata.targetFeature.plateNo}}</span> 
                </el-form-item>
                <el-form-item label="电话：">
                <span>{{bkdetailsdata.targetFeature.phone}}</span> 
                </el-form-item>
                <el-form-item label="户籍地：">
                <span>{{bkdetailsdata.targetFeature.register}}</span> 
                </el-form-item>              
            </el-form> 
            <div class="picture-hold">
                <p class="pic-btn">人像</p>
                <div class="pic-wrap">
                    <img :src="BASE_IMG_URL+bkdetailsdata.targetImageURI" />
                </div>
            </div>
        </div>
        <div style="width:100%;" v-show="bkdetailsdata.dispositionCategory=='3'">
            <el-form ref="bkdetailsdata" label-width="84px" :inline="true" style="width:235px;float:left;">
                <el-form-item label="布控类型：">
                    <span>车辆</span>
                </el-form-item>
                <el-form-item label="车牌：">
                <span>{{bkdetailsdata.targetFeature.plateNo}}</span> 
                </el-form-item>
                <el-form-item label="车牌颜色：">
                    <span>{{getCLcolor(bkdetailsdata.targetFeature.plateColor)}}</span> 
                </el-form-item>
                <el-form-item label="车型：">
                    <span>{{getCLpp(bkdetailsdata.targetFeature.brand)}}</span> 
                </el-form-item>
                <el-form-item label="车辆颜色：">
                    <span>{{getCLcolor(bkdetailsdata.targetFeature.vehicleColor)}}</span> 
                </el-form-item>
            </el-form> 
            <div class="picture-hold">
                <p class="pic-btn">车像</p>
                <div class="pic-wrap">
                    <img :src="BASE_IMG_URL+bkdetailsdata.targetImageURI" />
                </div>
            </div>
        </div>
        <div class="footer-group">
            <button type="button" class="btn btn-info btnmargin" v-if="getChekongStatus()" disabled>撤销布控</button>
            <button type="button" class="btn btn-info btnmargin" v-else  @click="cancelbk">撤销布控</button>
            <button type="button" class="btn btn-info btnmargin" v-if="canEdit()" disabled>修改布控</button>
            <button type="button" class="btn btn-info btnmargin" v-else @click="editbk">修改布控</button>
            <button type="button" class="btn btn-info" @click="backbkgl">返回</button>
        </div>
    </div>
</template>

<script>
import { excontrolApi } from "@/https";
import eventBus from '@/event';
import { eventCollection } from '@/event/resources';

export default {
  name: "bukongxinxi",
  props: ["bkBasicData"],

  data() {
    return {
        cpcolorlist:[
        {
          label:"黑色",
          value:"1",
        },
        {
          label:"白色",
          value:"2",
        },
        {
          label:"灰色",
          value:"3",
        },
        {
          label:"红色",
          value:"4",
        },
        {
          label:"蓝色",
          value:"5",
        },
        {
          label:"黄色",
          value:"6",
        },
        {
          label:"橙色",
          value:"7",
        },
        {
          label:"棕色",
          value:"8",
        },
        {
          label:"绿色",
          value:"9",
        },
        {
          label:"紫色",
          value:"10",
        },
        {
          label:"青色",
          value:"11",
        },
        {
          label:"粉色",
          value:"12",
        },
        {
          label:"透明",
          value:"13",
        },
        {
          label:"其他",
          value:"99",
        },
      ],
      bkyys: [{
        value: '1',
        label: '被盗车'
      }, {
        value: '2',
        label: '被抢车'
      }, {
        value: '3',
        label: '嫌疑车'
      },{
        value: '4',
        label: '交通违法车'
      },{
        value: '5',
        label: '紧急查控车'
      }],
    };
  },
  mounted() {
  },
  computed: {
        bkdetailsdata: function() {
          let bkdxobj = this.bkBasicData;
          if (!this.bkBasicData.targetFeature.name) {
            bkdxobj.targetFeature.name = '李汶隆';
          }
          if (!this.bkBasicData.targetFeature.idCard) {
            bkdxobj.targetFeature.idCard = '510120199202122344';
          }
          if (!this.bkBasicData.targetFeature.phone) {
            bkdxobj.targetFeature.phone = '13523228322';
          }
          if (!this.bkBasicData.targetFeature.register) {
            bkdxobj.targetFeature.register = '山西';
          }
          if (!this.bkBasicData.targetFeature.plateNo) {
            bkdxobj.targetFeature.plateNo = '川B12321';
          }
          if (!this.bkBasicData.targetFeature.plateColor) {
            bkdxobj.targetFeature.plateColor = '5';
          }
           if (!this.bkBasicData.targetFeature.brand) {
            bkdxobj.targetFeature.brand = '2';
          }
          if (!this.bkBasicData.targetFeature.vehicleColor) {
            bkdxobj.targetFeature.vehicleColor = '3';
          }
            
          return bkdxobj;
        }
  },
  methods: {
    getCLcolor(ysdm)
    {
      var ys = '';
      this.cpcolorlist.forEach((o) => {
        if(o.value ==ysdm)
        {
          ys = o.label;
        }      
      });
      return ys;
    },
    getBkyy(reason, type) {
      if (type == '3') {
        for (let i=0;i<this.bkyys.length;i++) {
          if (this.bkyys[i].value == reason) {
            reason = this.bkyys[i].label;
            break;
          }
        }
      }
      return reason;
    },
    handleBKStatus(status){
        if(status==0)
            {
              return "布控中";
            }
            else if(status==1)
            {
              return "已撤控";
            }
            else if(status==2)
            {
              return "布控到期";
            }
            else if(status==9)
            {
              return "未布控";
            }
    },
    handleBKSfz(id) {
      let ryID = '未登记';
      let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (reg.test(id)) {
        ryID = id;
      }

      return ryID;
    },
    getChekongStatus() {
      if (this.bkdetailsdata.dispositionStatus == 1 ||　this.bkdetailsdata.dispositionStatus == 2) {
        return true;
      }
      return false;
    },
    canEdit() {
      if (this.bkdetailsdata.dispositionStatus == 1 || this.bkdetailsdata.dispositionStatus == 2) {
        return true;
      } else {
        return false;
      }
    },
    handleBkxinxi(){
        if(this.bkdetailsdata.dispositionStatus==0)
            {
              this.bkdetailsdata.dispositionStatus="布控中";
            }
            else if(this.bkdetailsdata.dispositionStatus==1)
            {
              this.bkdetailsdata.dispositionStatus="已撤控";
            }
            else if(this.bkdetailsdata.dispositionStatus==2)
            {
              this.bkdetailsdata.dispositionStatus="布控到期";
            }
            else if(this.bkdetailsdata.dispositionStatus==9)
            {
              this.bkdetailsdata.dispositionStatus="未布控";
            }

        return text;
    },
    // 修改布控
    editbk() {
      eventBus.$emit(eventCollection.SWITCH_EDIT_DETAILS);
    },
    //撤销布控事件
    cancelbk() {
      // this.$confirm("确定要撤销布控？", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning"
      // })
      this.$prompt('请输入撤控原因', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /[\u4E00-\u9FA5A-Za-z0-9]+/,
          inputErrorMessage: '不能只输入特殊字符！'
      })
      .then(({ value }) => {
        //撤销布控
        let param = {};
        // param.dispositionID = this.bkdetailsdata.dispositionID;
        // param.cancelReason = value;

        return excontrolApi
        .excontrolRevoke(this.bkdetailsdata.dispositionID, value)
        .then(res => res.data)
        .then(data => {
            eventBus.$emit(eventCollection.UPDATE_DETAILS_DATA);
            this.$message({
              message: data.statusString,
              type: "success"
            });   
        })
      })         
      .catch(() => {
          
      });
    },
    backbkgl() {
        // this.$router.push({ path: '/bukongguanli/bukongguanli' });
        this.$router.back(-1);
    }
  }
};
</script>

<style scoped>
.content {
    margin: 0 5px;
}
.title {
    height: 32px;
    line-height: 32px;
    border-bottom: 1px solid #ccc;
    margin: 15px 10px;
}
.picture-hold {
  display: inline-block;
  width: 104px;
  margin-top:0px;
}
.pic-btn {
  width: 104px;
  height: 28px;
  line-height: 24px;
  margin-top: 10px;
  text-align: center;
  background: #f1f4f5;
  border: 1px solid #d8dfe5;
}
.pic-wrap {
  position: relative;
  margin-top:10px;
  width: 104px;
  height: 124px;
  line-height: 118px;
  text-align: center;
  border: 1px solid #8394a1;
}
.btnmargin {
  margin-right: 10px;
}
.btn-info {
  width: 100px;
  height: 40px;
  background: #12b1e1;
}
.footer-group {
  clear: both;
  width: 100%;
  text-align: center;
  margin-top: 30px;
}
</style>
