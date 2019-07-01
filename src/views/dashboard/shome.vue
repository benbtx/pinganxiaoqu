<template>
  <div class="content-body">
    <div class="page-bread">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-row">
      <div class="content-center">
        <el-row style="display:flex;flex:1;" :gutter="20">
          <el-col style="display:flex;flex-direction: column;" :span="6">
            <div class="content-item marginb-20">
              <div class="content-title">
                <span>社区公告</span>
                <el-select class="fr" v-model="gonggaotime" style="width:100px;">
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
                  <span class="info-icon" :class="{'icon-tips': item.type==1,'icon-news': item.type==2,'icon-gonggao': item.type==3}"></span>
                  <p class="info-content">
                    <span class="info-title" :title="item.title">{{item.title}}</span>
                    <span class="info-time">{{item.time}}</span>
                  </p>
                  <span class="fa fa-angle-right icon-more fr"></span>
                </div>
              </div>
            </div>

            <div class="content-item">
              <div class="content-title">
                <span>党建活动</span>
                <el-select class="fr" v-model="dangjiantime" style="width:100px;">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div class="row">
                <div class="div-list" v-for="item in dangjianData" :key="item.id">
                  <span class="info-icon" :class="{'icon-tongzhigonggao': item.type==1,'icon-dangzhengyaowen': item.type==2}"></span>
                  <p class="info-content">
                    <span class="info-title" :title="item.title">{{item.title}}</span>
                    <span class="info-time">{{item.time}}</span>
                  </p>
                  <span class="fa fa-angle-right icon-more fr"></span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col style="display:flex;flex-direction: column;" :span="12">
            <div class="content-item marginb-20">
              <div class="content-title">
                <span>社区服务</span>              
              </div>
              <div class="btn-row">
                <!-- <div class="fn-bls">
                  <router-link tag="div" class="ic_bukongbtn zhihuizhengwu" v-bind:to="'/zhihuizhengwu/zhihuizhengwu'">
                  </router-link>
                </div>
                <div class="fn-bls">
                  <router-link tag="div" class="ic_bukongbtn dangjianhuodong" v-bind:to="'/dangjianhuodong/dangjianhuodong'">
                  </router-link>
                </div>
                <div class="fn-bls">
                  <router-link tag="div" class="ic_bukongbtn wangluoguanli" v-bind:to="'/wanggeguanli/wanggeguanli'">
                  </router-link>
                </div>
                <div class="fn-bls">
                  <router-link tag="div" class="ic_bukongbtn luntanguanli" v-bind:to="'/luntanguanli/luntanguanli'">
                  </router-link>
                </div> -->
                <div class="fn-bls">
                  <router-link tag="div" class="ic_bukongbtn zhihuizhengwu" v-bind:to="'#'">
                  </router-link>
                </div>
                <div class="fn-bls">
                  <router-link tag="div" class="ic_bukongbtn dangjianhuodong" v-bind:to="'#'">
                  </router-link>
                </div>
                <div class="fn-bls">
                  <router-link tag="div" class="ic_bukongbtn wangluoguanli" v-bind:to="'#'">
                  </router-link>
                </div>
                <div class="fn-bls">
                  <router-link tag="div" class="ic_bukongbtn luntanguanli" v-bind:to="'#'">
                  </router-link>
                </div>
              </div>
            </div>
            <div class="content-item" style="flex:4;">
              <div class="content-title">
                <span>信息统计</span>
              </div>
              <div class="row">
                <div class="rukou-item">
                    <div class="rukou-title">
                      <span>一标四实分类统计</span>
                    </div>
                    <div class="chart-global">
                      <div class="global-item global-dz">
                        <span class="dz-text">地址</span>
                        <p class="item-num">
                          <span>总量：234,343</span>
                          <span>住宅：112,233</span>
                          <span>商业：122,323</span>
                        </p>
                      </div>
                      <div class="global-item global-fw">
                        <span class="fw-text">房屋</span>
                        <p class="item-num">
                          <span>总量：123,232</span>
                          <span>自住：22,343</span>
                          <span>出租：10,232</span>
                        </p>
                      </div>
                      <div class="global-item global-rk">
                        <span class="rk-text">人口</span>
                        <p class="item-num">
                          <span>总量：123,232</span>
                          <span>户籍：83,232</span>
                          <span>流动：40,000</span>
                        </p>
                      </div>
                      <div class="global-item global-dw">
                        <span class="dw-text">单位</span>
                        <p class="item-num">
                          <span>总量：26,300</span>
                          <span>企业：15,000</span>
                          <span>个体：11,300</span>
                        </p>
                      </div>
                      <div class="global-item global-cl">
                        <span class="cl-text">车辆</span>
                        <p class="item-num">
                          <span>总量：373,800</span>
                          <span>非营运：315,000</span>
                          <span>营运：58,800</span>
                        </p>
                      </div>
                    </div>
                </div>
                <div class="chart-item">
                  <sq-zdry-statistics></sq-zdry-statistics> 
                </div>
                <div class="chart-item">
                  <sq-tsgary-statistics></sq-tsgary-statistics>
                </div>
                <div class="chart-item">
                  <sq-mzqk-statistics></sq-mzqk-statistics>
                </div>
                <div class="chart-item">
                  <sq-ldrk-statistics></sq-ldrk-statistics>
                </div>
              </div>
            </div>
          </el-col>
          <el-col style="display:flex;flex-direction: column;" :span="6">
            <div class="content-item marginb-20">
              <div class="content-title">
                <span>社区工作者团队</span>
                <span class="fa fa-cog service-setting"></span>
              </div>
              <div class="row">
                  <div class="service-list" v-for="item in serviceData" :key="item.id">
                    <span class="service-pic">
                      <img :src="item.pic" />
                    </span>
                    <strong>{{item.name}}</strong>
                    <span>{{item.title}}</span>
                    <span>电话：{{item.tel}}</span>
                  </div>
              </div>
            </div>
            <div class="content-item">
              <div class="content-title">
                <span>快速入口</span>
              </div>
              <div class="row flexauto" style="padding-bottom:16px;">
                <div class="rukou-item">
                    <div class="rukou-title">
                      <span class="yibiaosishi-title"></span>
                      <span>一标四实</span>
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
                <div class="rukou-item">
                    <div class="rukou-title">
                      <span class="wangluoguanli-title"></span>
                      <span>网络管理</span>
                    </div>
                    <div class="rukou-content">
                      <el-row :gutter="24">
                        <el-col :span="12"><div class="rukou-wangluoguanli rukou-icon"  @click="gotoPath()">工作日志</div></el-col>
                        <el-col :span="12"><div class="rukou-wangluoguanli rukou-icon"  @click="gotoPath()">社工考勤</div></el-col>
                      </el-row>
                      <el-row :gutter="24">
                        <el-col :span="12"><div class="rukou-wangluoguanli rukou-icon"  @click="gotoPath()">社工信息</div></el-col>
                        <el-col :span="12"><div class="rukou-wangluoguanli rukou-icon"  @click="gotoPath()">文件管理</div></el-col>
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
// import { excontrolApi } from "@/https";
import sqZdryStatistics from "@/components/charts/sqZdryStatistics";
import sqLdrkStatistics from "@/components/charts/sqLdrkStatistics";
import sqTsgaryStatistics from "@/components/charts/sqTsryStatistics";
import sqMzqkStatistics from "@/components/charts/sqMzqkStatistics";

export default {
  name: "shome",
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
      dangjiantime: 'week',
      baoxiutime: 'week',
      gonggaoData: [
        {
          type: '1',
          title: '关于本周公益电影的温馨提示（11月24日、11 月25日）',
          time: '2018-11-08   15:24:36'
        },
        {
          type: '2',
          title: '中央第五生态环境保护督察组转交群众信访举报件',
          time: '2018-11-08   09:48:25'
        },
        {
          type: '3',
          title: '2018年11月技能提升补贴人员(明细)公示',
          time: '2018-11-08   11:24:36'
        },
        {
          type: '1',
          title: '关于“XXX免费义诊活动”的温馨提示',
          time: '2018-11-08   18:24:36'
        },
        {
          type: '2',
          title: '【基层党建“3+2”书记项目】“五大行动”精准施策',
          time: '2018-11-08   11:24:36'
        },
        {
          type: '1',
          title: '关于“XXX免费体检活动”的温馨提示',
          time: '2018-11-08   18:24:36'
        },
        {
          type: '3',
          title: '2018年12月技能提升补贴人员(明细)公示',
          time: '2018-11-08  11:24:36'
        }
      ],
      dangjianData: [
        {
          type: '1',
          title: '“融合党建”助推产业发展和脱贫攻坚',
          time: '2018-11-08   15:24:36'
        },
        {
          type: '2',
          title: '2018党建活动目录',
          time: '2018-11-08   09:48:25'
        },
        {
          type: '1',
          title: '强化基层党建引领社会治理创新',
          time: '2018-11-08   11:24:36'
        },
        {
          type: '2',
          title: '习近平新时代中国特色社会主义思想三十讲',
          time: '2018-11-08   18:24:36'
        },
        {
          type: '1',
          title: '【基层党建“3+2”书记项目】“五大行动”精准施策',
          time: '2018-11-08   11:24:36'
        },
        {
          type: '1',
          title: '学习实现农民富、农业强、农村美的路线图',
          time: '2018-11-08   18:24:36'
        },
        {
          type: '2',
          title: '时评：防范“指尖政务”中的“四风”变种',
          time: '2018-11-08   11:24:36'
        },
      ],
      serviceData: [
        {
          name: '李莉',
          title: '社区工作者',
          tel: '13840253697',
          pic: '/static/image/home/service-pic1.png'
        },
        {
          name: '张莉',
          title: '社区工作者',
          tel: '13640253697',
          pic: '/static/image/home/service-pic2.png'
        },
        {
          name: '王明丽',
          title: '社区工作者',
          tel: '13540253697',
          pic: '/static/image/home/service-pic3.jpg'
        },
        {
          name: '罗浩',
          title: '社区工作者',
          tel: '13542576840',
          pic: '/static/image/home/service-pic4.jpg'
        },
      ]
    };
  },
  mounted() {

  },
  components: {
    "sq-zdry-statistics": sqZdryStatistics,
    "sq-ldrk-statistics": sqLdrkStatistics,
    "sq-tsgary-statistics": sqTsgaryStatistics,
    "sq-mzqk-statistics": sqMzqkStatistics,
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
  padding-top: 5px;
  text-align: center;
  border-radius: 2px;
  font-size: 14px;
  font-family: "Microsoft YaHei Bold", "Microsoft YaHei Regular", "Microsoft YaHei";
  letter-spacing: 2px;
}
.div-list .icon-tips:before {
  content: '温馨提示';
  background: #12B1E1;
}
.div-list .icon-news:before {
  content: '政务要闻';
  background: #00CC99;
}
.div-list .icon-gonggao:before {
  content: '公示公告';
  background: #9999FF;
}
.div-list .icon-tongzhigonggao:before {
  content: '通知公告';
  background: #FF6666;
}
.div-list .icon-dangzhengyaowen:before {
  content: '党政要闻';
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
.zhihuizhengwu {
  background: url(/static/image/home/zhihuizhengwu.png) no-repeat;
  background-size: auto 100%;
  background-position: center;
}
.dangjianhuodong {
  background: url(/static/image/home/dangjianhuodong.png) no-repeat;
  background-size: auto 100%;
  background-position: center;
}
.wangluoguanli {
  background: url(/static/image/home/wangluoguanli.png) no-repeat;
  background-size: auto 100%;
  background-position: center;
}
.luntanguanli {
  background: url(/static/image/home/luntanguanli.png) no-repeat;
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
  margin: 15px auto 8px;
  min-height: 80px;
  border: 1px solid #d9dfe5;
}
.rukou-title {
  width: 100%;
  height: 30px;
  line-height: 30px;
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
.wangluoguanli-title {
  width: 20px;
  height: 30px;
  background: url(/static/image/home/icon-wangluoguanli.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 15px auto;
}
.rukou-content {
  width: 100%;
  height: calc(100% - 24px);
  padding: 10px 16px;
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
  background:#12B1E1;
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
  background: #FF9933;
}
.rukou-wangluoguanli {
  background: #FF6666;
} */
.flexauto {
  display: flex;
  flex-direction: column;
  justify-content: space-between
}
</style>