<template>
  <div class="content-body">
    <div class="page-bread">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-row">
      <div class="content-center">
        <el-row style="display:flex;flex:1;margin-bottom:20px;" :gutter="20">
          <el-col style="display:flex;" :span="6">
            <div class="content-item">
              <div class="content-title">
                <span>小区公告</span>
                <el-select class="fr" v-model="gonggaotime" style="width:100px;" @change="getGonggaoData">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div class="row">
                <div class="div-list" v-for="item in gonggaoData" :key="item.id">
                  <span class="info-icon" :class="{
                    'icon-tips': item.category=='温馨提示',
                    'icon-news': item.category=='新闻快报',
                    'icon-knowledge': item.category=='知识课堂',
                    'icon-other': item.category!='温馨提示' && item.category!='新闻快报' && item.category!='知识课堂'
                    }"></span>
                  <p class="info-content">
                    <span class="info-title" :title="item.title">{{item.title}}</span>
                    <span class="info-time">{{getFormatDate(item.createtime)}}</span>
                  </p>
                  <span class="fa fa-angle-right icon-more fr"></span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col style="display:flex;flex-direction: column;" :span="12">
            <div class="content-item">
              <div class="content-title">
                <span>物业服务</span>              
              </div>
              <div class="btn-row">
                <div class="fn-bls">
                  <router-link tag="div" class="ic_bukongbtn baoxiufuwu" v-bind:to="'/wuyefuwu/baoxiufuwu'">
                  </router-link>
                </div>
                <div class="fn-bls">
                  <router-link tag="div" class="ic_bukongbtn tousuguanli" v-bind:to="'/wuyefuwu/tousuguanli'">
                  </router-link>
                </div>
                <div class="fn-bls">
                  <router-link tag="div" class="ic_bukongbtn gonggaofabu" v-bind:to="'#'">
                  </router-link>
                </div>
                <div class="fn-bls">
                  <router-link tag="div" class="ic_bukongbtn zhinengyujing" v-bind:to="'#'">
                  </router-link>
                </div>
              </div>
            </div>
            <div class="content-item" style="margin-top:20px;flex:1.5;">
              <div class="content-title">
                <span>统计信息</span>
              </div>
              <div class="row">
                <div class="chart-item">
                  <month-statistics></month-statistics>
                </div>
                <div class="chart-item">
                  <halfyear-statistics></halfyear-statistics>
                </div>
              </div>
            </div>
          </el-col>
          <el-col style="display:flex;" :span="6">
            <div class="content-item">
              <div class="content-title">
                <span>服务团队</span>
                <span class="fa fa-cog service-setting"></span>
              </div>
              <div class="row">
                  <div class="service-list" v-for="item in serviceData" :key="item.id">
                    <span class="service-pic">
                      <img :src="BASE_IMG_URL+item.photourl" />
                    </span>
                    <strong>{{item.name}}</strong>
                    <span>{{item.position}}</span>
                    <span>电话：{{item.phone}}</span>
                  </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row style="display:flex;flex:1;" :gutter="20">
          <el-col style="display:flex;" :span="6">
            <div class="content-item">
              <div class="content-title">
                <span>预警消息</span>
                <el-select class="fr" v-model="yujingtime" style="width:100px;">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div class="row">
                <div class="div-list" v-for="item in yujingData" :key="item.id">
                  <span class="info-icon" :class="{'icon-anquan': item.category==1,'icon-shebei': item.category==2}"></span>
                  <p class="info-content">
                    <span class="info-title" :title="item.title">{{item.title}}</span>
                    <span class="info-time">{{item.time}}</span>
                  </p>
                  <span class="fa fa-angle-right icon-more fr"></span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col style="display:flex;" :span="12">
            <div class="content-item">
              <div class="content-title">
                <span>报修消息</span>
                <el-select class="fr" v-model="baoxiutime" style="width:100px;" @change="getRepairData">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div class="row">
                <div class="div-list baoxiu-list" v-for="item in baoxiuData" :key="item.id">
                  <span class="info-icon" :class="{
                    'icon-dengju': item.category=='灯具线路',
                    'icon-guanjian': item.category=='龙头管件',
                    'icon-jieju': item.category=='卫浴洁具',
                    'icon-menchuang': item.category=='门窗家具',
                    'icon-shutong': item.category=='打孔疏通',
                    'icon-kaisuo': item.category=='开锁换锁',
                    }"></span>
                  <p class="info-content fr">
                    <span class="info-title baoxiu-title fl">{{item.category}}</span>
                    <span class="info-time fr">{{getFormatDate(item.createtime)}}</span>
                    <span class="baoxiu-info" :title="item.content">{{item.content}}</span>
                  </p>                 
                </div>
              </div>
            </div>
          </el-col>
          <el-col style="display:flex;" :span="6">
            <div class="content-item">
              <div class="content-title">
                <span>快速入口</span>
              </div>
              <div class="row flexauto">
                <div class="rukou-item">
                    <div class="rukou-title">
                      <span class="shipin-title"></span>
                      <span>视频监控</span>
                    </div>
                    <div class="rukou-content">
                      <el-row :gutter="24">
                        <el-col :span="12"><div class="rukou-shipin rukou-icon"  @click="gotoPath('/shipinjiankong/shipinjiankong')">实时监控</div></el-col>
                        <el-col :span="12"><div class="rukou-shipin rukou-icon"  @click="gotoPath('/shipinjiankong/luxiangjiansuo')">录像回放</div></el-col>
                      </el-row>
                    </div>
                </div>
                <div class="rukou-item">
                    <div class="rukou-title">
                      <span class="jiansuo-title"></span>
                      <span>查询检索</span>
                    </div>
                    <div class="rukou-content">
                      <el-row :gutter="24">
                        <el-col :span="12"><div class="rukou-jiansuo rukou-icon"  @click="gotoPath('/xiaoquchaxunjiansuo/chaxunjiansuo','ry')">人员</div></el-col>
                        <el-col :span="12"><div class="rukou-jiansuo rukou-icon"  @click="gotoPath('/xiaoquchaxunjiansuo/chaxunjiansuo','che')">车辆</div></el-col>
                      </el-row>
                    </div>
                </div>
                <div class="rukou-item">
                    <div class="rukou-title">
                      <span class="wuye-title"></span>
                      <span>物业管理</span>
                    </div>
                    <div class="rukou-content">
                      <el-row :gutter="24">
                        <el-col :span="8"><div class="rukou-wuye rukou-icon"  @click="gotoPath('')">设备管理</div></el-col>
                        <el-col :span="8"><div class="rukou-wuye rukou-icon"  @click="gotoPath('')">卡片管理</div></el-col>
                        <el-col :span="8"><div class="rukou-wuye rukou-icon"  @click="gotoPath('')">门禁管理</div></el-col>
                      </el-row>
                      <el-row :gutter="24">
                        <el-col :span="6"><div class="rukou-wuye rukou-icon"  @click="gotoPath('')">梯控管理</div></el-col>
                        <el-col :span="6"><div class="rukou-wuye rukou-icon"  @click="gotoPath('')">对讲管理</div></el-col>
                        <el-col :span="6"><div class="rukou-wuye rukou-icon"  @click="gotoPath('')">车场管理</div></el-col>
                        <el-col :span="6"><div class="rukou-wuye rukou-icon"  @click="gotoPath('')">访客管理</div></el-col>
                      </el-row>
                    </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { propertyApi } from "@/https";
import monthStatistics from "@/components/charts/monthStatistics";
import halfyearStatistics from "@/components/charts/halfyearStatistics";

export default {
  name: "home",
  data() {
    return {
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
      gonggaotime: 'week',
      yujingtime: 'week',
      baoxiutime: 'week',
      timeSelected: {
        three: [this.getFormatDateYear(Date.parse(new Date()) - 3*24*60*60*1000), this.getFormatDateYear(new Date())],
        week: [this.getFormatDateYear(Date.parse(new Date()) - 7*24*60*60*1000), this.getFormatDateYear(new Date())],
        month: [this.getFormatDateYear(Date.parse(new Date()) - 30*24*60*60*1000), this.getFormatDateYear(new Date())],
      },
      gonggaoData: [
        {
          category: '温馨提示',
          title: '关于“XXX免费义诊活动”的温馨提示,关于“XXX免费义诊活动”的温馨提示',
          createtime: '2018-11-08   15:24:36'
        },
        {
          category: '新闻快报',
          title: '文明养犬的最新规定',
          createtime: '2018-11-08   09:48:25'
        },
        {
          category: '知识课堂',
          title: '冬季养生小常识',
          createtime: '2018-11-08   11:24:36'
        },
        {
          category: '温馨提示',
          title: '关于“XXX免费义诊活动”的温馨提示',
          createtime: '2018-11-08   18:24:36'
        },
        {
          category: '知识课堂',
          title: '冬季养生小常识',
          createtime: '2018-11-08   11:24:36'
        },
        {
          category: '新闻快报',
          title: '2019年放假安排出炉：五一小长假没了',
          createtime: '2018-12-08 18:24:36'
        },
        {
          category: '知识课堂',
          title: '冬季养生小常识',
          createtime: '2018-11-08   11:24:36'
        },
        {
          category: '温馨提示',
          title: '关于“XXX免费义诊活动”的温馨提示',
          createtime: '2018-11-08   18:24:36'
        }
      ],
      yujingData: [
        {
          category: '1',
          title: '有陌生人进入小区',
          time: '2018-11-08   15:24:36'
        },
        {
          category: '2',
          title: '一栋一单元2号电梯出现故障',
          time: '2018-11-08   09:48:25'
        },
        {
          category: '1',
          title: '预防火灾',
          time: '2018-11-08   11:24:36'
        },
        {
          category: '2',
          title: '一栋三单元2号电梯出现故障',
          time: '2018-11-08   18:24:36'
        },
        {
          category: '1',
          title: '预防火灾',
          time: '2018-11-08   11:24:36'
        },
        {
          category: '2',
          title: '一栋三单元2号电梯出现故障',
          time: '2018-11-08   18:24:36'
        },
        {
          category: '1',
          title: '预防火灾',
          time: '2018-11-08   11:24:36'
        },
        {
          category: '2',
          title: '一栋三单元2号电梯出现故障',
          time: '2018-11-08   18:24:36'
        }
      ],
      baoxiuData: [
        {
          category:'灯具线路',
          content: '二栋一单元2702的报修申请，请尽快处理',
          createtime: '2018-11-08   15:24:36'
        },
        {
          category: '灯具线路',
          content: '二栋一单元2702的报修申请，请尽快处理',
          createtime: '2018-11-08   09:48:25'
        },
        {
          category: '龙头管件',
          content: '二栋一单元2702的报修申请，请尽快处理',
          createtime: '2018-11-08   11:24:36'
        },
        {
          category: '卫浴洁具',
          content: '二栋一单元2702的报修申请，请尽快处理',
          createtime: '2018-11-08   18:24:36'
        },
        {
          category:'门窗家具',
          content: '二栋一单元2702的报修申请，请尽快处理',
          createtime: '2018-11-08   11:24:36'
        },
        {
          category:'打孔疏通',
          content: '二栋一单元2702的报修申请，请尽快处理',
          createtime: '2018-11-08   18:24:36'
        },
        {
          category:'开锁换锁',
          content: '二栋一单元2702的报修申请，请尽快处理',
          createtime: '2018-11-08   11:24:36'
        },
        {
          category:'龙头管件',
          content: '二栋一单元2702的报修申请，请尽快处理,二栋一单元2702的报修申请，请尽快处理',
          createtime: '2018-11-08   18:24:36'
        },
        {
          category: '门窗家具',
          content: '二栋一单元2702的报修申请，请尽快处理',
          createtime: '2018-11-08   11:24:36'
        },
        {
          category:'打孔疏通',
          content: '二栋一单元2702的报修申请，请尽快处理',
          createtime: '2018-11-08   18:24:36'
        },
        {
          category:'开锁换锁',
          content: '二栋一单元2702的报修申请，请尽快处理',
          createtime: '2018-11-08   11:24:36'
        },
        {
          category: '龙头管件',
          content: '二栋一单元2702的报修申请，请尽快处理,二栋一单元2702的报修申请，请尽快处理',
          createtime: '2018-11-08   18:24:36'
        },
        {
          category: '开锁换锁',
          content: '二栋一单元2702的报修申请，请尽快处理',
          createtime: '2018-11-08   11:24:36'
        },
        {
          category: '龙头管件',
          content: '二栋一单元2702的报修申请，请尽快处理,二栋一单元2702的报修申请，请尽快处理',
          createtime: '2018-11-08   18:24:36'
        }
      ],
      serviceData: []
    };
  },
  mounted() {
    // this.getGonggaoData(); //获取小区公告数据
    this.getServiceData(); //获取服务团队数据
    // this.getRepairData(); //获取查询报修数据
  },
  components: {
    "month-statistics": monthStatistics,
    "halfyear-statistics": halfyearStatistics,
  },
  methods: {
    gotoPath(pathName, type) {
      this.$router.push({
        path: pathName,
        query: {
          type: type,
        }
      });
    },
    getGonggaoData() {
      let param = {};
      param.pageNum = 1;
      param.pageSize = 99999;
      param.startDate = this.timeSelected[this.gonggaotime][0];
      param.endDate = this.timeSelected[this.gonggaotime][1];

      return propertyApi
      .getGonggaoData(param)
      .then(res => res.data)
      .then(data => {
          this.gonggaoData = data.rows;
      });
    },
    getServiceData() {
      let param = {};
      param.pageNum = 1;
      param.pageSize = 99999;  

      return propertyApi
      .getServiceData(param)
      .then(res => res.data)
      .then(data => {
          this.serviceData = data.rows;
      });
    },
    getRepairData() {
      let param = {};
      param.pageNum = 1;
      param.pageSize = 99999;
      param.startDate = this.timeSelected[this.baoxiutime][0];
      param.endDate = this.timeSelected[this.baoxiutime][1];
      

      return propertyApi
      .getRepairData(param)
      .then(res => res.data)
      .then(data => {
          this.baoxiuData = data.rows;
      });
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
  min-width: 1680px;
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
.marginb-10 {
  margin-bottom: 10px;
}
.content-item {
  flex: 1;
  width: 100%;
  border: 1px solid #d9dfe5;
  box-sizing: border-box;
  background: #fff;
  /* margin: 10px; */
}
.row {
  width: 100%;
  height: calc(100% - 40px);
  margin: 0;
  overflow-y: auto;
}
.div-list {
  width: calc(100% - 8px);
  height: 54px;
  margin: 4px auto;
  border-radius: 3px;
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
  line-height: 18px;
  padding-top: 4px;
  text-align: center;
  border-radius: 2px;
  font-size: 14px;
  font-family: "Microsoft YaHei Bold", "Microsoft YaHei Regular", "Microsoft YaHei";
  letter-spacing: 2px;
}
.div-list .icon-other:before{
    content: '其他公告';
  background:#FF6666;
}
.div-list .icon-tips:before {
  content: '温馨提示';
  background: #12B1E1;
}
.div-list .icon-news:before {
  content: '新闻快报';
  background: #00CC99;
}
.div-list .icon-knowledge:before {
  content: '知识课堂';
  background: #9999FF;
}
.div-list .icon-anquan:before {
  content: '安全预警';
  background: #FF6666;
}
.div-list .icon-shebei:before {
  content: '设备预警';
  background: #FF9933;
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
.baoxiu-list .info-icon {
  border-radius: 50%;
}
.div-list .icon-dengju {
  background: url(/static/image/home/dengju.png) no-repeat;
  background-size: auto 50%;
  background-position: center;
  background-color: #12B1E1;
}
.div-list .icon-guanjian {
  background: url(/static/image/home/guanjian.png) no-repeat;
  background-size: auto 50%;
  background-position: center;
  background-color: #12B1E1;
}
.div-list .icon-jieju {
  background: url(/static/image/home/jieju.png) no-repeat;
  background-size: auto 50%;
  background-position: center;
  background-color: #12B1E1;
}
.div-list .icon-menchuang {
  background: url(/static/image/home/menchuang.png) no-repeat;
  background-size: auto 50%;
  background-position: center;
  background-color: #12B1E1;
}
.div-list .icon-shutong {
  background: url(/static/image/home/shutong.png) no-repeat;
  background-size: auto 50%;
  background-position: center;
  background-color: #12B1E1;
}
.div-list .icon-kaisuo {
  background: url(/static/image/home/kaisuo.png) no-repeat;
  background-size: auto 50%;
  background-position: center;
  background-color: #12B1E1;
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
.baoxiufuwu {
  background: url(/static/image/home/baoxiufuwu.png) no-repeat;
  background-size: auto 100%;
  background-position: center;
}
.tousuguanli {
  background: url(/static/image/home/tousuguanli.png) no-repeat;
  background-size: auto 100%;
  background-position: center;
}
.gonggaofabu {
  background: url(/static/image/home/gonggaofabu.png) no-repeat;
  background-size: auto 100%;
  background-position: center;
}
.zhinengyujing {
  background: url(/static/image/home/zhinengyujing.png) no-repeat;
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
.chart-item {
    margin: 8px 10px;
    width: calc(50% - 20px);
    float: left;
    min-height: 150px;
    height: calc(100% - 24px);
}
/* 服务团队样式 */
.service-list {
  height: 88px;
  display: flex;
  align-items:center;
}
.service-list:hover {
  background: #f3f3f3;
}
.service-list img {
  width: 72px;
  height: 72px;
  margin: 5px;
  border-radius: 5px;
}
.service-list strong {
  font-size: 12px;
  font-family: "Microsoft YaHei Bold", "Microsoft YaHei Regular", "Microsoft YaHei";
  width: 50px;
}
.service-list span {
  margin: 0 10px;
}
.service-setting {
    display: block;
    float: right;
    width: 20px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    cursor: pointer;
}
/* 快速入口样式 */
.rukou-item {
  width: calc(100% - 20px);
  margin: 0px auto;
  min-height: 80px;
  border: 1px solid #d9dfe5;
}
.rukou-title {
  width: 100%;
  height: 24px;
  line-height: 24px;
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
.shipin-title {
  width: 20px;
  height: 24px;
  background: url(/static/image/home/shipin.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 16px auto;
}
.jiansuo-title {
  width: 20px;
  height: 24px;
  background: url(/static/image/home/jiansuo.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 16px auto;
}
.wuye-title {
  width: 20px;
  height: 24px;
  background: url(/static/image/home/wuye.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 16px auto;
}
.rukou-content {
  width: 100%;
  height: calc(100% - 24px);
  padding: 6px 16px;
}
.rukou-icon {
  margin: 4px -6px;
  height: 40px;
  line-height: 40px;
  padding: 0 5px 0 8px;
  font-size: 12px;
  border-radius: 2px;
  color: #fff;
  cursor: pointer;
  background: #12B1E1;
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
/* .rukou-shipin {
  background: #00CC99;
}
.rukou-jiansuo {
  background: #FF9933;
}
.rukou-wuye {
  background: #FF6666;
} */
.flexauto {
  display: flex;
  flex-direction: column;
  justify-content: space-between
}
</style>