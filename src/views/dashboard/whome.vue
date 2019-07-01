<template>
  <div class="content-body">
    <div class="page-bread">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>公安微警务</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-row">
      <div class="content-center">
        <el-row style="display:flex;flex:1;" :gutter="20">
          <el-col style="display:flex;flex-direction: column;" :span="6">
            <div class="content-item marginb-20">
              <div class="content-title">
                <span>事件通告</span>
              </div>
              <div class="row">
                <div class="div-list" v-for="item in jingqingData" :key="item.id" @click="lookdetail(item)">
                  <span class="info-icon" :class="{
                    'icon-ms': item.eventType=='民生',
                    'icon-xf': item.eventType=='消防',
                    'icon-za': item.eventType=='治安',
                    'icon-jf': item.eventType=='纠纷',
                    'icon-sf': item.eventType=='上访',
                    'icon-sw': item.eventType=='涉稳',
                    'icon-sd': item.eventType=='涉毒',
                    }"></span>
                  <p class="info-content">
                    <span class="info-title" :title="item.eventTheme">{{item.eventTheme}}</span>
                    <span class="info-time">{{getFormatDateYear(item.eventDate)}}</span>
                  </p>
                  <span class="fa fa-angle-right icon-more fr"></span>
                </div>
              </div>
            </div>
            <div class="content-item">
              <div class="content-title">
                <span>警力资源</span>
              </div>
              <div class="row liliang-group flexauto">
                <div class="rukou-item" style="flex:1;margin:10px;">
                    <div class="rukou-title">
                      <span>专业力量</span>
                    </div>
                    <div class="rukou-content" style="display: flex;align-items: center;">
                      <div class="liliang-item">
                        <div class="liliang-outer liliang-zhuanye">
                          <div class="liliang-inner">
                          </div>  
                          <span class="zhuanye-num">{{jingliziyuanData.mj.count}}<i class="unit-count">人</i></span> 
                        </div> 
                        <p class="liliang-text">{{jingliziyuanData.mj.resourceType}}</p> 
                      </div>   
                      <div class="liliang-item">
                        <div class="liliang-outer liliang-zhuanye">
                          <div class="liliang-inner">
                          </div>  
                          <span class="zhuanye-num">{{jingliziyuanData.xj.count}}<i class="unit-count">人</i></span> 
                        </div> 
                        <p class="liliang-text">{{jingliziyuanData.xj.resourceType}}</p> 
                      </div> 
                      <div class="liliang-item">
                        <div class="liliang-outer liliang-zhuanye">
                          <div class="liliang-inner">
                          </div>  
                          <span class="zhuanye-num">{{jingliziyuanData.zzry.count}}<i class="unit-count">人</i></span> 
                        </div> 
                        <p class="liliang-text">{{jingliziyuanData.zzry.resourceType}}</p> 
                      </div>  
                    </div>
                </div>
                <div class="rukou-item" style="flex:1;margin:10px;margin-top:0;">
                    <div class="rukou-title">
                      <span>群防力量</span>
                    </div>
                    <div class="rukou-content" style="display: flex;align-items: center;">
                      <div class="liliang-item">
                        <div class="liliang-outer liliang-qunfang">
                          <div class="liliang-inner">
                          </div>  
                          <span class="qunfang-num">{{jingliziyuanData.wgy.count}}<i class="unit-count">人</i></span> 
                        </div> 
                        <p class="liliang-text">{{jingliziyuanData.wgy.resourceType}}</p> 
                      </div> 
                      <div class="liliang-item">
                        <div class="liliang-outer liliang-qunfang">
                          <div class="liliang-inner">
                          </div>  
                          <span class="qunfang-num">{{jingliziyuanData.baoan.count}}<i class="unit-count">人</i></span> 
                        </div> 
                        <p class="liliang-text">{{jingliziyuanData.baoan.resourceType}}</p> 
                      </div>
                      <div class="liliang-item">
                        <div class="liliang-outer liliang-qunfang">
                          <div class="liliang-inner">
                          </div>  
                          <span class="qunfang-num">{{jingliziyuanData.swz.count}}<i class="unit-count">人</i></span> 
                        </div> 
                        <p class="liliang-text">{{jingliziyuanData.swz.resourceType}}</p> 
                      </div>
                    </div>
                </div>

              </div>
            </div>
          </el-col>
          <el-col style="display:flex;flex-direction: column;" :span="12">
            <div class="content-item marginb-20">
              <div class="content-title">
                <span>警务管理</span>              
              </div>
              <div class="btn-row">
                <div class="fn-bls">
                  <router-link tag="div" class="ic_bukongbtn yibiaosishi" v-bind:to="'/yibiaosishi/tongjixinxi'">
                  </router-link>
                </div>
                <div class="fn-bls">
                  <router-link tag="div" class="ic_bukongbtn chaxunjiansuo" v-bind:to="'/bukongjiansuo/jiansuochaxun'">
                  </router-link>
                </div>
                <div class="fn-bls">
                  <router-link tag="div" class="ic_bukongbtn jichabukong" v-bind:to="'/zhinenggaojing/bukongguanli'">
                  </router-link>
                </div>
                <div class="fn-bls">
                  <router-link tag="div" class="ic_bukongbtn zonghezuozhan" v-bind:to="'/zonghezuozhan/zonghezuozhan'">
                  </router-link>
                </div>
              </div>
            </div>
            <div class="content-item" style="flex:4;">
              <div class="content-title">
                <span>信息统计</span>
              </div>
              <div class="row">
                <div class="rukou-item tongji">
                    <div class="rukou-title">
                      <span>基础信息分类统计</span>
                    </div>
                    <div class="chart-global">
                      <div class="global-item global-dz">
                        <span class="dz-text">地址</span>
                        <p class="item-num">
                          <span>总量：{{addrTotal}}</span>
                          <span>登记：{{addrRegister}}</span>
                          <span>未登记：{{addrnoRegister}}</span>
                        </p>
                      </div>
                      <div class="global-item global-fw">
                        <span class="fw-text">房屋</span>
                        <p class="item-num">
                          <span>总量：{{houseTotal}}</span>
                          <span>自住：{{houseSelfUse}}</span>
                          <span>出租：{{houseLease}}</span>
                        </p>
                      </div>
                      <div class="global-item global-rk">
                        <span class="rk-text">人口</span>
                        <p class="item-num">
                          <span>总量：{{peopleTotal}}</span>
                          <span>户籍：{{peopleResident}}</span>
                          <span>流动：{{peopleFloating}}</span>
                        </p>
                      </div>
                      <div class="global-item global-dw">
                        <span class="dw-text">单位</span>
                        <p class="item-num">
                          <span>总量：{{companyTotal}}</span>
                          <span>企业：{{compaEnterprise}}</span>
                          <span>个体：{{compaPersonal}}</span>
                        </p>
                      </div>
                      <div class="global-item global-cl">
                        <span class="cl-text">车辆</span>
                        <p class="item-num">
                          <span>总量：{{carTotal}}</span>
                          <span>非营运：{{carUnbusiness}}</span>
                          <span>营运：{{carBusiness}}</span>
                        </p>
                      </div>
                    </div>
                </div>
                <!-- <div class="chart-item">
                  <fw-statistics></fw-statistics> 
                </div> -->
                <div class="chart-item">
                  <tsgary-statistics></tsgary-statistics>
                </div>
                <div class="chart-item">
                  <zdry-statistics></zdry-statistics>
                </div>
                <!-- <div class="chart-item">
                  <xdry-statistics></xdry-statistics>
                </div> -->
                <div class="chart-item">
                  <mzqk-statistics></mzqk-statistics>
                </div>
                <div class="chart-item">
                  <ldrk-statistics></ldrk-statistics>
                </div>
              </div>
            </div>
          </el-col>
          <el-col style="display:flex;flex-direction: column;" :span="6">
            <div class="content-item marginb-20">
              <div class="content-title">
                <span>感知源</span>
              </div>
              <div class="row">
                <el-table :data="shebeiData" class="tb-shebei">
                  <el-table-column type="index" width="50" label="序号" align="center">
                  </el-table-column>
                  <el-table-column prop="name" min-width="100" label="社区名称" align="center">
                  </el-table-column>
                  <el-table-column prop="person" label="人脸卡口" min-width="80" align="center">
                  </el-table-column>
                  <el-table-column prop="vehicle" min-width="80" label="车脸卡口" align="center">
                  </el-table-column>
                  <el-table-column prop="alarm" label="报警柱" min-width="80" align="center">
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div class="content-item">
              <div class="content-title">
                <span>快速入口</span>
              </div>
              <div class="row flexauto">
                <div class="rukou-item">
                    <div class="rukou-title">
                      <span class="bukongguanli-title"></span>
                      <span>布控管理</span>
                    </div>
                    <div class="rukou-content">
                      <el-row :gutter="24">
                        <el-col :span="12"><div class="rukou-bukongguanli rukou-icon"  @click="gotoPath('/zhinenggaojing/addrycontrol')">新增人员布控</div></el-col>
                        <el-col :span="12"><div class="rukou-bukongguanli rukou-icon"  @click="gotoPath('/zhinenggaojing/addchecontrol')">新增车辆布控</div></el-col>
                      </el-row>
                    </div>
                </div>
                <div class="rukou-item">
                    <div class="rukou-title">
                      <span class="gaojing-title"></span>
                      <span>智能告警</span>
                    </div>
                    <div class="rukou-content">
                      <el-row :gutter="24">
                        <el-col :span="12"><div class="rukou-gaojing rukou-icon"  @click="gotoPath('/zhinenggaojing/shishigaojing')">实时告警</div></el-col>
                        <el-col :span="12"><div class="rukou-gaojing rukou-icon"  @click="gotoPath('/zhinenggaojing/gaojingjiansuo')">告警检索</div></el-col>
                      </el-row>
                    </div>
                </div>
                <div class="rukou-item">
                    <div class="rukou-title">
                      <span class="yibiaosishi-title"></span>
                      <span>基础信息</span>
                    </div>
                    <div class="rukou-content">
                      <el-row :gutter="24">
                        <el-col :span="12"><div class="rukou-yibiaosishi rukou-icon"  @click="gotoPath('/yibiaosishi/biaozhundizhi')">标准地址</div></el-col>
                        <el-col :span="12"><div class="rukou-yibiaosishi rukou-icon"  @click="gotoPath('/yibiaosishi/shiyoufangwu')">实有房屋</div></el-col>
                      </el-row>
                      <el-row :gutter="24">
                        <el-col :span="8"><div class="rukou-yibiaosishi rukou-icon"  @click="gotoPath('/yibiaosishi/shiyourenkou')">实有人口</div></el-col>
                        <el-col :span="8"><div class="rukou-yibiaosishi rukou-icon"  @click="gotoPath('/yibiaosishi/shiyoudanwei')">实有单位</div></el-col>
                        <el-col :span="8"><div class="rukou-yibiaosishi rukou-icon"  @click="gotoPath('/yibiaosishi/shiyoucheliang')">实有车辆</div></el-col>
                      </el-row>
                    </div>
                </div>            
              </div>
            </div>
          </el-col>
        </el-row>
      </div>


      <el-dialog
        title="事件详情"
        :visible.sync="jqVisibility"
        width="500px"
        class="modal-popover"
        :close-on-click-modal='false'
        >
        <div class="popover-content">
          <div class="row">
            <div class="col-md-10">
                <span class="spandec">事件类型：
                <span class="spantext">{{jqdetailsdata.eventType}}</span>
                </span>
            </div>
          </div>
          <div class="row">
            <div class="col-md-10">
                <span class="spandec">事件主题：
                <span class="spantext">{{jqdetailsdata.eventTheme}}</span>
                </span>
            </div>
          </div>
          <div class="row">
            <div class="col-md-10">
                <span class="spandec">事发地址：
                <span class="spantext">{{jqdetailsdata.eventAddr}}</span>
                </span>
            </div>
          </div>
          <div class="row">
              <div class="col-md-10 spandiv">
                  <span class="spandec">事发时间：
                  <span class="spantext">{{getFormatDate(jqdetailsdata.eventDate)}}</span>
                  </span>
              </div>
          </div>
          <div class="row">
              <div class="col-md-10">
                  <span class="spandec">上报者：
                  <span class="spantext">{{jqdetailsdata.eventReporter}}</span>
                  </span>
              </div>
          </div>
          <div class="row">
              <div class="col-md-10">
                  <span class="spandec">联系方式：
                  <span class="spantext">{{jqdetailsdata.eventReporterPhoneNumber}}</span>
                  </span>
              </div>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// import { excontrolApi } from "@/https";
import fwStatistics from "@/components/charts/fwStatistics";
import zdryStatistics from "@/components/charts/zdryStatistics";
import xdryStatistics from "@/components/charts/xdryStatistics";
import ldrkStatistics from "@/components/charts/ldrkStatistics";
import tsgaryStatistics from "@/components/charts/tsryStatistics";
import mzqkStatistics from "@/components/charts/mzqkStatistics";
import { excontrolApi } from "@/https";
export default {
  name: "whome",
  data() {
    return {
      peopleTotal:'',
      peopleFloating:'',
      peopleResident:'',
      companyTotal:'',
      compaEnterprise:'',
      compaPersonal:'',
      houseTotal:'',
      houseLease:'',
      houseSelfUse:'',
      carTotal:'',
      carBusiness:'',
      carUnbusiness:'',
      addrTotal:'',
      addrnoRegister:'',
      addrRegister:'',
      options:[{
        label: '最近一月',
        value: 'month'
      },{
        label: '最近一周',
        value: 'week'
      },{
        label: '最近三天',
        value: 'three'
      }],
      dangjiantime: 'week',
      baoxiutime: 'week',
      jqVisibility: false,
      jingliziyuanData:{
        mj:{resourceType:'',count:''},
        xj:{resourceType:'',count:''},
        zzry:{resourceType:'',count:''},
        wgy:{resourceType:'',count:''},
        baoan:{resourceType:'',count:''},
        swz:{resourceType:'',count:''}
      },
      jqdetailsdata: {},
      jingqingData: [],
      shebeiData: [],
      serviceData: [
        {
          name: '李莉',
          title: '客服管家',
          tel: '13840253697',
          pic: '/static/image/home/service-pic.png'
        },
        {
          name: '张莉',
          title: '客服管家',
          tel: '13640253697',
          pic: '/static/image/home/service-pic.png'
        },
        {
          name: '王明丽',
          title: '客服管家',
          tel: '13540253697',
          pic: '/static/image/home/service-pic.png'
        },
        {
          name: '罗晓玲',
          title: '客服管家',
          tel: '13542576840',
          pic: '/static/image/home/service-pic.png'
        },
         {
          name: '罗晓玲',
          title: '客服管家',
          tel: '13542576840',
          pic: '/static/image/home/service-pic.png'
        },
      ]
    };
  },
  mounted() {
     this.getYibiaosishiStatics();
     this.getSheBeiData();
     this.getPoliceCount();
     this.getPoliceEvents();    
     this.$store.dispatch("ToggleFullScreen", 'no');
  },
  components: {
    "fw-statistics": fwStatistics,
    "zdry-statistics": zdryStatistics,
    "xdry-statistics": xdryStatistics,
    "ldrk-statistics": ldrkStatistics,
    "tsgary-statistics": tsgaryStatistics,
    "mzqk-statistics": mzqkStatistics,
  },
  methods: {
    getPoliceEvents(){
      let param = {};
      param.pageNum = 1;
      param.pageSize = 10;
      return excontrolApi
        .getPoliceEvents(param)
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.jingqingData = data.rows;
        });

    },
    getPoliceCount(){
      return excontrolApi
        .getPoliceCount()
        .then(res => res.data)
        .then(data => {
          // loading.close();
          for(let i=0;i<data.length;i++) {
            switch(data[i].resourceType)
            {
            case '民警':
              this.jingliziyuanData.mj.resourceType = data[i].resourceType;
              this.jingliziyuanData.mj.count = data[i].count;
              break;
            case '协警':
              this.jingliziyuanData.xj.resourceType = data[i].resourceType;
              this.jingliziyuanData.xj.count = data[i].count;
              break;
            case '综治人员':
              this.jingliziyuanData.zzry.resourceType = data[i].resourceType;
              this.jingliziyuanData.zzry.count = data[i].count;
              break;
            case '网格员':
              this.jingliziyuanData.wgy.resourceType = data[i].resourceType;
              this.jingliziyuanData.wgy.count = data[i].count;
              break;
            case '保安':
              this.jingliziyuanData.baoan.resourceType = data[i].resourceType;
              this.jingliziyuanData.baoan.count = data[i].count;
              break;
            case '守望者':
              this.jingliziyuanData.swz.resourceType = data[i].resourceType;
              this.jingliziyuanData.swz.count = data[i].count;
              break;
            default:
              return;
            }
          }
        });

    },

    getRenkouCount(){
      return excontrolApi
        .yibiaosishiRenkouCount()
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.peopleTotal = data.total;
          this.peopleFloating = data.floating;
          this.peopleResident = data.resident;
        });
    },

    getFangwuCount(){
      return excontrolApi
        .yibiaosishiFangwuCount()
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.houseTotal = data.total;
          this.houseSelfUse = data.selfUse;
          this.houseLease = data.lease;
        });
    },

    getDanweiCount(){
      return excontrolApi
        .yibiaosishiDanweiCount()
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.companyTotal = data.total;
          this.compaEnterprise = data.enterprise;
          this.compaPersonal = data.personal;
        });
    },

    getCheliangCount(){
      return excontrolApi
        .yibiaosishiCheliangCount()
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.carTotal = data.total;
          this.carBusiness = data.business;
          this.carUnbusiness = data.noBusiness;
        });
    },

    getDizhiCount(){
      return excontrolApi
        .yibiaosishiDizhiCount()
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.addrTotal = data.total;
          this.addrnoRegister = data.noRegister;
          this.addrRegister = data.register;
        });

    },

    getYibiaosishiStatics(){
      this.getRenkouCount();
      this.getFangwuCount();
      this.getDanweiCount();
      this.getCheliangCount();
      this.getDizhiCount();
    },
    gotoPath(pathName, type) {
      this.$router.push({
        path: pathName,
        query: {
          type: type,
        }
      });
    },
    getSheBeiData: function() {
      return excontrolApi
        .getSheBeiData()
        .then(res => res.data)
        .then(data => {
          //生成表格
          this.shebeiData = data;
        });
    }, 
    lookdetail(data) {
      this.jqVisibility = true;
      this.jqdetailsdata = data;
    },
  }
};
</script>

<style scoped>
.content-body {
  width: 100%;
  height: calc(100% - 20px);
  overflow: auto;
}
.content-row {
  /* min-width: 1680px; */
  width: 100%;
  height: calc(100% - 50px);
  overflow: auto;
}
.content-center {
  /* min-width: 1400px; */
  min-height: 810px;
  width: calc(100% - 10px);
  height: calc(100% - 20px);
  display: flex;
  flex-direction: column;
}
/* padding */
.padding-5 {
  padding-left: 5px;
  padding-right: 5px;
}
.marginb-20 {
  margin-bottom: 20px;
}
.content-item {
  flex: 1;
  width: 100%;
  height: calc(50% - 10px);
  border: 1px solid #d9dfe5;
  box-sizing: border-box;
  background: #fff;
}
.row {
  width: 100%;
  height: calc(100% - 40px);
  line-height: 30px;
  margin: 0;
  overflow-y: auto;
}
.popover-content .spandec {
  padding-left:0;
  margin-left: -10px;
}
.div-list {
  width: calc(100% - 8px);
  height: 54px;
  margin: 4px auto;
  border-radius: 3px;
  cursor: pointer;
}
.div-list:hover {
  background: #f3f3f3;
}
.div-list .info-icon {
  display: block;
  width: 46px;
  height: 46px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  margin: 4px;
  float: left;
}
.div-list .info-icon:before {
  display: inline-block;
  width: 46px;
  height: 46px;
  line-height: 46px;
  text-align: center;
  border-radius: 2px;
  font-size: 14px;
  font-family: "Microsoft YaHei Bold", "Microsoft YaHei Regular", "Microsoft YaHei";
  letter-spacing: 2px;
  content: '其它';
  background: #56c4fc;
}
.div-list .icon-ms:before {
  content: '民生';
  background: #00CC99;
}
.div-list .icon-xf:before {
  content: '消防';
  background: #FF6666;
}
.div-list .icon-za:before {
  content: '治安';
  background: #FF9933;
}
.div-list .icon-jf:before {
  content: '纠纷';
  background: #FFCC00;
}
.div-list .icon-sf:before {
  content: '上访';
  background: #12B1E1;
}
.div-list .icon-sd:before {
  content: '涉毒';
  background: #9999FF;
}
.div-list .icon-sw:before {
  content: '涉稳';
  background: #6666ff;
}
.div-list .info-content {
  display: inline-block;
  margin: 0;
  padding: 5px;
  line-height: 22px;
  width: calc(100% - 80px);
}
.div-list .info-title {
  display: block;
  font-weight: bold;
  font-size: 12px;
  font-family: "Microsoft YaHei Bold", "Microsoft YaHei Regular", "Microsoft YaHei";
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.baoxiu-list {
  width:calc(50% - 24px);
  display:inline-block;
  margin: 0 10px;
  border-bottom:1px solid #d9dfe5;
}
.baoxiu-list .info-content {
  width: calc(100% - 60px);
}
.div-list .baoxiu-title {
  width: calc(100% - 120px);
}
.div-list .baoxiu-info {
  display: inline-block;
  margin: 0;
  padding: 0;
  width: 100%;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.div-list .info-time {
  font-size: 12px;
}
.div-list .icon-more {
  display: inline-block;
  width: 20px;
  height: 54px;
  line-height: 54px;
  text-align: center;
}
/* 警力资源 */
.liliang-group {
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  width: 100%;
  height: calc(100% - 40px);
}
.liliang-item {
  width: 33.3%;
  /* height: calc(100% - 20px); */
  padding: 0;
}
.liliang-outer {
    position: relative;
    width: 50px;
    height: 86.6px;
    margin: 0px auto;
    background-color: red;
}
.liliang-outer:before {
    content: '';
    display: block;
    position: absolute;
    width: 0;
    height: 0;
    right:50px;
    border-width: 43.3px 25px;
    border-style: solid;
    border-color: transparent red transparent transparent;
}
.liliang-outer:after {
    content: '';
    display: block;
    position: absolute;
    width: 0;
    height: 0;
    left:50px;
    border-width: 43.3px 25px;
    border-style: solid;
    border-color: transparent transparent transparent red;
    top:0;
}
.liliang-inner {
    position: relative;
    width: 40px;
    height: 66.6px;
    margin: 0px auto;
    top: 10px;
    background-color: #fff;
}
.liliang-inner:before {
    content: '';
    display: block;
    position: absolute;
    width: 0;
    height: 0;
    right: 40px;
    border-width: 33.3px 20px;
    border-style: solid;
    border-color: transparent #fff transparent transparent;
}
.liliang-inner:after {
    content: '';
    display: block;
    position: absolute;
    width: 0;
    height: 0;
    left: 40px;
    border-width: 33.3px 20px;
    border-style: solid;
    border-color: transparent transparent transparent #fff;
    top:0;
    z-index: 3;
}
.zhuanye-num {
    position: absolute;
    width: 60px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-family: "Microsoft YaHei Bold", "Microsoft YaHei Regular", "Microsoft YaHei";
    background: url(/static/image/home/bg-jingli.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: auto;
    background-color: transparent;
    top: 20px;
    z-index: 4;
    left: -5px;
}
.qunfang-num {
    position: absolute;
    width: 60px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-family: "Microsoft YaHei Bold", "Microsoft YaHei Regular", "Microsoft YaHei";
    background: url(/static/image/home/bg-qunfang.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: auto;
    background-color: transparent;
    top: 20px;
    z-index: 4;
    left: -5px;
}
.unit-count {
  font-size: 12px;
  font-style: normal;
  font-weight: bold;
}
.liliang-zhuanye {
  background-color: #FF6666;
}
.liliang-zhuanye:before {
  border-color: transparent #FF6666 transparent transparent;
}
.liliang-zhuanye:after {
  border-color: transparent transparent transparent #FF6666;
}
.liliang-qunfang {
  background-color: #FFCC00;
}
.liliang-qunfang:before {
  border-color: transparent #FFCC00 transparent transparent;
}
.liliang-qunfang:after {
  border-color: transparent transparent transparent #FFCC00;
}
/* .liliang-jinggun {
  border: 12px solid #FFCC00;
  background: url(/static/image/home/bg-jinggun.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: auto;
}
.liliang-car {
  border: 12px solid #FF9933;
  background: url(/static/image/home/bg-car.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: auto;
}
.liliang-gun {
  border: 12px solid #FF6666;
  background: url(/static/image/home/bg-gun.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: auto;
}
.liliang-handcuffs {
  border: 12px solid #9999FF;
  background: url(/static/image/home/bg-shoukao.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: auto;
} */
.liliang-text {
  margin: 0;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 12px;
}
/* 操作div */
.ic_bukongbtn {
  width: 100%;
  height: 100px;
  margin: 0 auto;
  padding: 10px 0px;
  cursor: pointer;
  border-radius: 5px;
}
.yibiaosishi {
  background: url(/static/image/home/yibiaosishi.png) no-repeat;
  background-size: auto 100%;
  background-position: center;
}
.chaxunjiansuo {
  background: url(/static/image/home/chaxunjiansuo.png) no-repeat;
  background-size: auto 100%;
  background-position: center;
}
.jichabukong {
  background: url(/static/image/home/jichabukong.png) no-repeat;
  background-size: auto 100%;
  background-position: center;
}
.zonghezuozhan {
  background: url(/static/image/home/zonghezuozhan.png) no-repeat;
  background-size: auto 100%;
  background-position: center;
}
.btn-row {
  display: flex;
  flex-direction: row;
justify-content: center;
    align-items: center;
    height: calc(100% - 40px);
}
.fn-bls {
  flex: 1;
  margin: 10px;
}
.chart-global {
  width: 100%;
  height: 106px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.global-item {
  display: flex;
  flex-direction: row;
  height: 90px;
  background: #d9dfe5;
  border-radius: 3px;
  flex: 1;
  margin: 8px 5px;
}
.global-item p {
  margin: 0 auto;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #fff;
  font-weight: bold;
}
.global-item .item-num {
  text-align: left;
  width: 74%;
  height: 80px;
  line-height: 22px;
  border-radius: 3px;
  background: #fff;
  color: #333;
  font-size: 12px;
  font-weight: normal;
  margin: 5px;
  margin-left:0;
  padding: 7px 4px;
}
.global-item .item-num span {
  display: block;
}
.global-rk {
  background: #FF6666;
}
.rk-text::before {
  content: '';
  width: 100%;
  height: 50px;
  display: block;
  background: url(/static/image/home/icon-rk.png) no-repeat;
  background-position: center bottom;
  background-size: 24px auto;
  margin-bottom: 5px;
}
.global-dw {
 background: #00CC99;
}
.dw-text::before {
  content: '';
  width: 100%;
  height: 50px;
  display: block;
  background: url(/static/image/home/icon-dw.png) no-repeat;
  background-position: center bottom;
  background-size: 24px auto;
  margin-bottom: 5px;
}
.global-cl {
 background: #12B1E1;
}
.dz-text,.fw-text,.rk-text,.dw-text,.cl-text {
  width: 26%;
  height: 90px;
  text-align: center;
  color: #fff;
  font-weight: bold;
}
.cl-text::before {
  content: '';
  width: 100%;
  height: 50px;
  display: block;
  background: url(/static/image/home/icon-car.png) no-repeat;
  background-position: center bottom;
  background-size: 24px auto;
  margin-bottom: 5px;
}
.global-fw {
  background: #FF9933;
}
.fw-text::before {
  content: '';
  width: 100%;
  height: 50px;
  display: block;
  background: url(/static/image/home/icon-fw.png) no-repeat;
  background-position: center bottom;
  background-size: 24px auto;
  margin-bottom: 5px;
}
.global-dz {
  background: #9999FF;
}
.dz-text::before {
  content: '';
  width: 100%;
  height: 50px;
  display: block;
  background: url(/static/image/home/icon-dz.png) no-repeat;
  background-position: center bottom;
  background-size: 20px auto;
  margin-bottom: 5px;
}
.chart-item {
    margin: 8px 10px;
    width: calc(50% - 20px);
    float: left;
    min-height: 150px;
    height: calc(50% - 100px);
}
/* 辖区设备 */
.tb-shebei {
  margin: 0 10px;
  width: calc(100% - 20px);
}
/* 快速入口样式 */
.rukou-item {
  width: calc(100% - 20px);
  margin: 0 auto;
  min-height: 80px;
  border: 1px solid #d9dfe5;
}
.tongji {
  margin:15px auto 8px;
}
.rukou-title {
  width: 100%;
  height: 28px;
  line-height: 28px;
  font-size: 12px;
  text-align: center;
  background: #F2F2F2;
  border-bottom: 1px solid #d9dfe5;
  color: #333;
}
.rukou-title span {
  display: inline-block;
  vertical-align: top;
  margin: 0 5px;
}
.yibiaosishi-title {
  width: 20px;
  height: 30px;
  background: url(/static/image/home/icon-yibiaosishi.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 15px auto;
}
.bukongguanli-title {
  width: 20px;
  height: 30px;
  background: url(/static/image/home/bukongguanli.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 15px auto;
}
.gaojing-title {
  width: 20px;
  height: 30px;
  background: url(/static/image/home/zhinenggaojing.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 15px auto;
}
.rukou-content {
  width: 100%;
  height: calc(100% - 24px);
  padding: 4px 16px;
}
.rukou-icon {
  margin: 5px -6px;
  height: 40px;
  line-height: 40px;
  padding: 0 8px;
  font-size: 12px;
  border-radius: 2px;
  color: #fff;
  cursor: pointer;
  background-color: #12B1E1;
}
.rukou-icon::after {
  content: '';
  display: block;
  width: 18px;
  height: 40px;
  background: url(/static/image/home/icon-right.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 18px auto;
  float: right;
}
/* .rukou-yibiaosishi {
  background: #00CC99;
}
.rukou-bukongguanli {
  background: #FF9933;
}
.rukou-gaojing {
  background: #FF6666;
} */
.flexauto {
  display: flex;
  flex-direction: column;
  justify-content: space-between
}
</style>