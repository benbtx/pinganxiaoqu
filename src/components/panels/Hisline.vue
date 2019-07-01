<template>
  <div class="ctn-hold">
    <div class="ctn-head"><span>轨迹查看</span>
      <!-- <span @click="startpiccrop">图片裁剪测试</span> -->
      <span :class="{'gjzkpic':gjzk,'gjsqpic':!gjzk}" @click="gjzk=!gjzk"></span>
    </div>
    <div :class="{'place-hold':!gjzk}" style="width: calc(100% + 4px);">
      <div v-show="gjzk" :class="{'highheight':isshowgj}" class="linediv dpzy" v-loading="lockloading" element-loading-text="轨迹追踪获取中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.7)">
        <ul class="ulhead">
          <li :class="{'lihead':linetotal>0,'liheadno':linetotal===0}" v-if="linetotal!=''||linetotal===0">
            <div class="circlediv">
              <p class="circlehead">
              </p>
            </div>
            <div class="text-con">
              <p>
                <span class="headspan">
                  <span style="padding: 0px 10px;">共{{linetotal}}条轨迹</span>
                </span>
              </p>
              <div style="margin-top: 20px;">
                <el-date-picker v-model="starttime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" style="width:166px;font-size:12px;">
                </el-date-picker>
                <el-date-picker v-model="endtime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" style="width:166px;font-size:12px;">
                </el-date-picker>
                <button class="btn btn-info" type="button" @click="searchlsgj">搜索</button>
                <!-- <el-checkbox-group v-model="checkList" class="search-group">
                  <el-checkbox label="全部"></el-checkbox>
                  <el-checkbox label="车辆"></el-checkbox>
                  <el-checkbox label="人脸"></el-checkbox>
                  <el-checkbox label="门禁"></el-checkbox>
                </el-checkbox-group> -->
                <el-radio-group v-model="checkList" class="search-group">
                  <el-radio label="车辆"></el-radio>
                  <el-radio label="人脸"></el-radio>
                  <!-- <el-radio label="门禁"></el-radio> -->
                </el-radio-group>
              </div>
            </div>
          </li>
        </ul>
        <ul class="ulline">
          <li class="liline" v-for="(item, i) in  linerow" :key="i">
            <div class="circlediv">
              <p class="circle fa fa-user bg-car" v-if="item.type=='ry'"></p>
              <p class="circle fa fa-car bg-car" v-else-if="item.type=='car'"></p>
              <!-- <p class="circle fa  fa-credit-card bg-mj" v-else></p> -->
              <!-- <p class="circle fa fa-car bg-car"></p> -->
            </div>
            <div class="text-con">
              <p class="txt-sj">
                <span>{{item.passTimeStr}}</span>
              </p>
              <div class="txt-content row">
                <div class="left txt-content-sub vcenter" style="padding-right:5px">
                  <!-- <p>轨迹来源：</p> -->
                  <div  v-if="item.xsly=='08'||item.xsly=='09'" class="iborder">
                  <img  :src="item.imgUrl" class="txt-img" />
                  <!-- <img  :src="item.xslyms" class="txt-img" /> -->
                  <p class="ipcolor">
                  <i class="fa fa-search-plus icenter" @click="showlargeimg(item.imgUrl)"></i>
                  <i class="fa fa-scissors icenter" @click="startpiccrop(item.imgUrl)"></i>
                  </p>
                  </div>
                  <p v-else class="iborder">
                    <!-- {{item.xslyms}} -->
                    <img  :src="item.imgUrl" class="txt-img" />
                    <span class="ipcolor">
                      <i class="fa fa-search-plus icenter" @click="showlargeimg(item.imgUrl)"></i>
                      <!-- <i class="fa fa-scissors icenter" @click="startpiccrop(item.imgUrl)"></i> -->
                    </span>
                  </p>
                </div>
                <div class="fgdiv"></div>
                <div class="right txt-content-sub">
                  <!-- <p class="txt-ad">{{item.ksXzqhmc}}</p> -->
                  <div class="txt-de">
                    <span class="txt-span">{{item.csbqms}}</span>
                    <p class="txt-right">{{item.csms}}</p>
                  </div>
                  <!-- <p><span>{{item.csbqms}}</span>{{item.csms}}</p> -->
                  <div class="txt-de">
                    <span class="txt-span">{{item.ksbqms}}</span>
                    <p class="txt-right">{{item.ksnrms}}</p>
                  </div>
                  <div class="txt-de">
                    <span class="txt-span">{{item.jsbqms}}</span>
                    <p class="txt-right">{{item.jsnrms}}</p>
                  </div>
                  <div class="txt-de" style="justify-content: flex-end;">
                    <button class="pic-btn" @click="searchbycarpic(item.relatedCameraIndexCode)">录像回放</button>
                  </div>
                  <div v-if="item.xsly=='08'||item.xsly=='09'" class="txt-de">
                    <button class="pic-btn" @click="searchbycarpic(item.xslyms)">以图搜车</button>
                    <button class="pic-btn" @click="searchbypersonpic(item.xslyms)">人脸比对</button>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { excontrolApi, passwayApi } from "@/https";
import eventBus from "@/event";
import { eventCollection } from "@/event/resources";
// import { mapActions } from "vuex";
export default {
  name: "Hisline",
  data() {
    return {
      isshowgj: false,
      linetotal:"", //共n条轨迹
      gjlxchoose: "", //选择的轨迹类别
      starttime: "", //轨迹开始时间
      endtime: "", //轨迹结束时间
      linerow: null, //轨迹行
      cxlsgjpara: null, //历史轨迹查询参数
      lockloading: false,
      gjzk: true, //轨迹列表展开和收缩控制
      // dialogpiccrop: false, //图片裁剪框的显示
      // imgsrc:"",//裁剪图片源
      // dialogpiclarge:"",//图片放大框显示
      // largeimg:"",//放大图片源
      kakouList: [],
      devList: [],
      checkList: '',
    };
  },
  created() {
    eventBus.$on(eventCollection.PASSWAY_SHOW_HISLINE, para => {
      console.log(para)
      this.initgjline(para);
    });
  },
  mounted() {
    this.getDevList();
    this.getKakouList();
  },
  methods: {
    getDevList() {
      return excontrolApi
        .getRyKakou()
        .then(res => res)
        .then(data => {
          this.devList = data.data.pageData;
        });
    },
    getKakouList: function() {
      return excontrolApi
        .getClKakou()
        .then(res => res)
        .then(data => {
          this.kakouList = data.data.pageData;
        });
    },
    getKakouName(type, id) {
      var name = '';

      if (type == 'che') {
        for (let i=0;i<this.kakouList.length;i++) {
          if (this.kakouList[i].indexCode == id) {
            name = this.kakouList[i].name;
          } 
        }
      } else if (type == 'ry') {
        for (let i=0;i<this.devList.length;i++) {
          if (this.devList[i].deviceCode == id) {
            name = this.devList[i].name;
          } 
        }
      }
      return name;
    },
    //初始化历史轨迹参数
    initgjline(lsgjpara) {
      this.isshowgj = true;
      this.gjzk = true;
      this.cxlsgjpara = lsgjpara;
      let myDate = new Date();
      //获取当前年
      let year = myDate.getFullYear();
      //获取当前月
      let month = myDate.getMonth() + 1;
      //获取当前日
      let date = myDate.getDate();
      //
      let hour = myDate.getHours();
      let minu = myDate.getMinutes();
      let sec = myDate.getSeconds();
      if (month < 10) {
        month = "0" + month;
      }
      if (date < 10) {
        date = "0" + date;
      }
      let jssj =
        year + "-" + month + "-" + date + " " + hour + ":" + minu + ":" + sec;
      //获取当前日的前七天
      let before = myDate.setDate(myDate.getDate() - 7);
      let beforeDate = new Date(before);
      //获取当前年
      let beforeyear = beforeDate.getFullYear();
      //获取当前月
      let beforemonth = beforeDate.getMonth() + 1;
      //获取当前日
      let beforedate = beforeDate.getDate();
      if (beforemonth < 10) {
        beforemonth = "0" + beforemonth;
      }
      if (beforedate < 10) {
        beforedate = "0" + beforedate;
      }
      let kssj =
        beforeyear +
        "-" +
        beforemonth +
        "-" +
        beforedate +
        " " +
        hour +
        ":" +
        minu +
        ":" +
        sec;
      this.starttime = kssj;
      this.endtime = jssj;

      // this.linetotal = lsgjpara.total;
      // let linerowinit = [];
      if(this.cxlsgjpara.sfzhm) {
        this.checkList = '人脸';
      } else if (!this.cxlsgjpara.sfzhm && this.cxlsgjpara.cph && this.cxlsgjpara.cph[0]) {
        this.checkList = '车辆';
      }
      // if (lsgjpara.list) {
      //   linerowinit = this.gslinerow(lsgjpara.list);
      // } else if (lsgjpara.pageData) {
      //   linerowinit = this.gslinerow(lsgjpara.pageData);
      // }
      // this.linerow = linerowinit;
      this.searchlsgj('init'); 
    },
    //查询历史轨迹
    searchlsgj(type) {
      let param = Object.create(null);
      param.pageNo = 1;
      param.pageSize = 200;
      param.startTime = this.starttime;
      param.endTime = this.endtime;

      if (!this.cxlsgjpara.sfzhm && (!this.cxlsgjpara.cph || this.cxlsgjpara.cph.length==0)) {
        this.$message.error("请选择要查询的人或车！");
        return false;
      }

      if(this.checkList == '车辆') {
        param.searchKey = this.cxlsgjpara.cph[0];
        this.CkCLguiji(param,type);
      } else if (this.checkList == '人脸') {
        param.credentialsNum = this.cxlsgjpara.sfzhm;
        this.CkRYguiji(param,type);
      } 
    },
    CkRYguiji(param, type){
      return passwayApi
        .getRyguiji(param)
        .then(res => res.data)
        .then(data => {
          if (!!data) {
            this.linetotal = data.total;
            let linerowinit = this.gslinerow(data.pageData);
            this.linerow = linerowinit;
          } else {
            this.linetotal = 0;
          }
          //划出轨迹
          if (type != 'init') {
            eventBus.$emit(
              eventCollection._guiji2map,{
                data:  data.pageData,
                type: 2
              }
            );
          }
        });
    },
    CkCLguiji(param, type){
      return passwayApi
        .getClguiji(param)
        .then(res => res.data)
        .then(data => {
          if (!!data.data) {
            this.linetotal = data.data.total;
            let linerowinit = this.gslinerow(data.data.list);
            this.linerow = linerowinit;
          } else {
            this.linetotal = 0;
          }
          // //划出轨迹
          if (type != 'init') {
            eventBus.$emit(
              eventCollection._guiji2map,{
                data:  data.data.list,
                type: 1
              }
            );    
          }   
        });
    },
    //以图搜车
    searchbycarpic(pic) {
      eventBus.$emit(eventCollection.SEARCH_AUTOBY_IMG, pic);
    },
    //人脸比对
    searchbypersonpic(pic) {
      eventBus.$emit(eventCollection.SEARCH_MANBY_IMG, pic);
    },
    //地图打点历史轨迹
    showlsgjmap(resultdata) {
      this.changeTrail(resultdata);
    },
    // ...mapActions("TrailStates", ["changeTrail"]),
    //格式化数据
    gslinerow(data) {
      let _this = this;
      let formatdata = data;
  
      data.forEach(function(i) {
        if (!i || !i.longitude) {
          return;
        }
        if (i.passTimeStr) {
            i.type = 'car';
            i.xslyms = "卡口信息";
            i.csbqms = "卡口名称：";
            i.csms = _this.getKakouName('che', i.relatedCameraIndexCode);
            i.ksbqms = "车牌号码：";
            i.ksnrms = i.plateInfo;
            i.jsbqms = "过车时间：";
            i.jsnrms = i.passTimeStr;
            i.imgUrl = i.picAbbreviate.replace('http://172.16.1.106:6120','http://110.186.51.162:6501');
        }
        if (i.cameraName) {
            i.type = 'ry';
            i.xslyms = "人员轨迹";
            i.csbqms = "摄像机名称：";
            i.csms = i.cameraName;
            i.ksbqms = "姓名：";
            i.ksnrms = i.humanName;
            i.jsbqms = "发现时间：";
            i.jsnrms = i.alarmTime;
            i.imgUrl = i.bkgPicUrl;
         }
      });

      return formatdata;

      // formatdata.forEach(function(i) {
      //   switch (i.xsly) {
      //     case "01":
      //       i.xslyms = "交警卡口信息";
      //       i.csbqms = "卡口名称：";
      //       i.csms = i.ksCsmc;
      //       i.ksbqms = "车牌号码";
      //       i.ksnrms = i.zjhm;
      //       i.jsbqms = "过车时间";
      //       i.jsnrms = i.ksCssj;
      //       break;
      //     case "02":
      //       i.xslyms = "网吧上网人员信息";
      //       i.csbqms = "网吧名称（地址）：";
      //       i.csms = i.ksCsmc + "（" + i.ksDz + "）";
      //       i.ksbqms = "上网时间：";
      //       i.ksnrms = i.ksCssj;
      //       i.jsbqms = "下网时间：";
      //       i.jsnrms = i.jsCssj;
      //       break;
      //     case "03":
      //       i.xslyms = "治安国内旅客";
      //       i.csbqms = "旅店名称（地址）：";
      //       i.csms = i.ksCsmc + "（" + i.ksDz + "）";
      //       i.ksbqms = "入住时间：";
      //       i.ksnrms = i.ksCssj;
      //       i.jsbqms = "退房时间：";
      //       i.jsnrms = i.jsCssj;
      //       break;
      //     case "04":
      //       i.xslyms = "民航进港信息";
      //       i.csbqms = "航班号：";
      //       i.csms = i.ksWz;
      //       i.ksbqms = "进港时间：";
      //       i.ksnrms = i.ksCssj;
      //       i.jsbqms = "离港时间：";
      //       i.jsnrms = i.jsCssj;
      //       break;
      //     case "05":
      //       i.xslyms = "巡逻盘查车辆信息";
      //       i.csbqms = "卡口名称：";
      //       i.csms = i.ksCsmc;
      //       i.ksbqms = "盘查时间：";
      //       i.ksnrms = i.ksCssj;
      //       break;
      //     case "06":
      //       i.xslyms = "巡逻盘存人员信息";
      //       i.csbqms = "卡口名称：";
      //       i.csms = i.ksCsmc;
      //       i.ksbqms = "盘查时间：";
      //       i.ksnrms = i.ksCssj;
      //       break;
      //     case "07":
      //       i.xslyms = "铁路进站人员信息";
      //       i.csbqms = "卡口名称：";
      //       i.csms = i.ksCsmc;
      //       i.ksbqms = "通过时间：";
      //       i.ksnrms = i.ksCssj;
      //       break;
      //     case "08":
      //       //i.xslyms="依图人脸轨迹";
      //       i.xslyms = i.ksDz;
      //       i.csbqms = "摄像头名称：";
      //       i.csms = i.ksCsmc;
      //       i.ksbqms = "入库时间：";
      //       i.ksnrms = i.ksCssj;
      //       break;
      //     case "09":
      //       //  i.xslyms="车牌精确布控";
      //       i.xslyms = i.ksDz;
      //       i.csbqms = "卡口名称：";
      //       i.csms = i.ksCsmc;
      //       i.ksbqms = "车牌号码：";
      //       i.ksnrms = i.zjhm;
      //       i.jsbqms = "过车时间：";
      //       i.jsnrms = i.ksCssj;
      //       break;
      //     case "10":
      //       i.xslyms = "车辆图片布控";
      //       i.csbqms = "卡口名称：";
      //       i.csms = i.ksCsmc;
      //       i.ksbqms = "车牌号码：";
      //       i.ksnrms = i.zjhm;
      //       i.jsbqms = "过车时间：";
      //       i.jsnrms = i.ksCssj;
      //       break;
      //     case "11":
      //       i.xslyms = "人员轨迹-居住轨迹";
      //       i.csbqms = "地址：";
      //       i.csms = i.ksDz;
      //       i.ksbqms = "活动时间：";
      //       i.ksnrms = i.ksCssj;
      //       i.jsbqms = "离开时间：";
      //       i.jsnrms = i.jsCssj;
      //       break;
      //     case "12":
      //       i.xslyms = "人员轨迹-网吧上网人员";
      //       i.csbqms = "网吧名称（地址）：";
      //       i.csms = i.ksCsmc + "（" + i.ksDz + "）";
      //       i.ksbqms = "上网时间：";
      //       i.ksnrms = i.ksCssj;
      //       i.jsbqms = "下网时间：";
      //       i.jsnrms = i.jsCssj;
      //       break;
      //     case "13":
      //       i.xslyms = "人员轨迹-旅馆居住";
      //       i.csbqms = "旅店名称（地址）：";
      //       i.csms = i.ksCsmc + "（" + i.ksDz + "）";
      //       i.ksbqms = "入住时间（房间号）：";
      //       i.ksnrms = i.ksCssj + "（" + i.ksWz + "）";
      //       i.jsbqms = "离开时间：";
      //       i.jsnrms = i.jsCssj;
      //       break;
      //     case "14":
      //       i.xslyms = "人员轨迹-治安暂住人口";
      //       i.csbqms = "地址：";
      //       i.csms = i.ksDz;
      //       i.ksbqms = "开始时间：";
      //       i.ksnrms = i.ksCssj;
      //       i.jsbqms = "结束时间：";
      //       i.jsnrms = i.jsCssj;
      //       break;
      //     case "15":
      //       i.xslyms = "人员轨迹-铁路订票";
      //       i.csbqms = "始发站（车次、座位）：";
      //       i.ksDz = i.ksDz == null ? "无" : i.ksDz;
      //       i.csms = i.ksCsmc + "（" + i.ksDz + "、" + i.ksWz + "）";
      //       i.ksbqms = "到达站：";
      //       i.ksnrms = i.jsCsmc;
      //       i.jsbqms = "始发时间：";
      //       i.jsnrms = i.ksCssj;
      //       break;
      //     case "16":
      //       i.xslyms = "人员轨迹-民航出港";
      //       i.csbqms = "始发站（座位）：";
      //       i.csms = i.ksCsmc + "（" + i.ksWz + "）";
      //       i.ksbqms = "到达站：";
      //       i.ksnrms = i.jsCsmc;
      //       i.jsbqms = "始发时间：";
      //       i.jsnrms = i.ksCssj;
      //       break;
      //     case "17":
      //       i.xslyms = "人员轨迹-民航订票";
      //       i.csbqms = "始发站（航班号、座位）：";
      //       i.csms = i.ksCsmc + "（" + i.ksDz + "、" + i.ksWz + "）";
      //       i.ksbqms = "到达站：";
      //       i.ksnrms = i.jsCsmc;
      //       i.jsbqms = "始发时间：";
      //       i.jsnrms = i.ksCssj;
      //       break;
      //     case "18":
      //       i.xslyms = "人员轨迹-全省违法犯罪人员";
      //       i.csbqms = "地址：";
      //       i.csms = i.ksDz;
      //       i.ksbqms = "开始时间：";
      //       i.ksnrms = i.ksCssj;
      //       i.jsbqms = "结束时间：";
      //       i.jsnrms = i.jsCssj;
      //       break;
      //     case "19":
      //       i.xslyms = "车辆轨迹-卡口信息";
      //       i.csbqms = "卡口名称：";
      //       i.csms = i.ksCsmc;
      //       i.ksbqms = "车牌号码：";
      //       i.ksnrms = i.zjhm;
      //       i.jsbqms = "过车时间：";
      //       i.jsnrms = i.ksCssj;
      //       break;
      //     case "20":
      //       i.xslyms = "车辆轨迹-交警电子眼监控记录";
      //       i.csbqms = "违章地点：";
      //       i.csms = i.ksDz;
      //       i.ksbqms = "违章时间：";
      //       i.ksnrms = i.ksCssj;
      //       i.jsbqms = "处理时间：";
      //       i.jsnrms = i.jsCssj;
      //       break;
      //     case "21":
      //       i.xslyms = "车辆轨迹-社会治安卡口车辆信息";
      //       i.csbqms = "卡口名称：";
      //       i.csms = i.ksCsmc;
      //       i.ksbqms = "车牌号码：";
      //       i.ksnrms = i.zjhm;
      //       i.jsbqms = "通过时间：";
      //       i.jsnrms = i.ksCssj;
      //       break;
      //     case "22":
      //       i.xslyms = "车辆轨迹-交警车辆违法记录 ";
      //       i.csbqms = "地址：";
      //       i.csms = i.ksCsmc;
      //       i.ksbqms = "车牌号码：";
      //       i.ksnrms = i.zjhm;
      //       i.jsbqms = "开始时间：";
      //       i.jsnrms = i.ksCssj;
      //       break;
      //     case "23":
      //       i.xslyms = "手机信息";
      //       i.csbqms = "采集时间：";
      //       i.ksbqms = "手机号码：";
      //       i.ksnrms = i.zjhm;
      //       i.ksnrms = i.ksDz;
      //       i.jsbqms = "来源：";
      //       i.jsnrms = i.ksDz;
      //       break;
      //     case "24":
      //       i.xslyms = "人员基础信息";
      //       i.csbqms = "地址：";
      //       i.csms = i.ksDz;
      //       i.ksbqms = "";
      //       i.ksnrms = "";
      //       i.jsbqms = "";
      //       i.jsnrms = "";
      //       break;
      //     case "25":
      //       i.xslyms = "铁路订票";
      //       i.csbqms = "始发站（车次）：";
      //       i.csms = i.ksCsmc + "（" + i.ksWz + "）";
      //       i.ksbqms = "始发时间：";
      //       i.ksnrms = i.ksCssj;
      //       i.jsbqms = "到达站：";
      //       i.jsnrms = i.jsCssj;
      //       break;
      //     case "26":
      //       i.xslyms = "民航订票";
      //       i.csbqms = "出发地（航班号）：";
      //       i.csms = i.ksCsmc + "（" + i.ksWz + "）";
      //       i.ksbqms = "目的地：";
      //       i.ksnrms = i.jsCsmc;
      //       i.jsbqms = "起飞时间：";
      //       i.jsnrms = i.ksCssj;
      //       break;
      //     case "27":
      //       i.xslyms = "火车订票";
      //       i.csbqms = "始发站（车次）：";
      //       i.csms = i.ksCsmc + "（" + i.ksDz + "）";
      //       i.ksbqms = "始发时间：";
      //       i.ksnrms = i.ksCssj;
      //       i.jsbqms = "到达站：";
      //       i.jsnrms = i.jsCsmc;
      //       break;
      //     case "28":
      //       i.xslyms = "民航订票";
      //       i.csbqms = "出发地（航班号）：";
      //       i.csms = i.ksCsmc + "（" + i.ksDz + "）";
      //       i.ksbqms = "目的地：";
      //       i.ksnrms = i.jsCsmc;
      //       i.jsbqms = "起飞时间：";
      //       i.jsnrms = i.ksCssj;
      //       break;
      //     case "29":
      //       i.xslyms = "客运汽车订票";
      //       i.csbqms = "出发地（乘车车站）：";
      //       i.csms = i.ksDz + "（" + i.ksCsmc + "）";
      //       i.ksbqms = "到达地（到达车站）：";
      //       i.ksnrms = i.jsDz + "（" + i.jsCsmc + "）";
      //       i.jsbqms = "发车时间：";
      //       i.jsnrms = i.ksCssj;
      //       break;
      //     case "30":
      //       i.xslyms = "网约车订单";
      //       i.csbqms = "上车城市（上车地点）：";
      //       i.csms = i.ksXzqhmc + "（" + i.ksDz + "）";
      //       i.ksbqms = "下车地点：";
      //       i.ksnrms = i.jsDz;
      //       i.jsbqms = "上车时间，下车时间：";
      //       i.jsnrms = i.ksCssj + "，" + i.jsCssj;
      //       break;
      //     case "31":
      //       i.xslyms = "网安";
      //       i.csbqms = "地点：";
      //       i.csms = i.ksDz;
      //       i.ksbqms = "开始时间：";
      //       i.ksnrms = i.ksCssj;
      //       i.jsbqms = "结束时间：";
      //       i.jsnrms = i.jsCssj;
      //       break;
      //     case "32":
      //       i.xslyms = "卡口";
      //       i.csbqms = "路口：";
      //       i.csms = i.ksDz;
      //       i.ksbqms = "过车时间：";
      //       i.ksnrms = i.ksCssj;
      //       i.jsbqms = "车牌号：";
      //       i.jsnrms = i.zjhm;
      //       break;
      //     case "33":
      //       i.xslyms = "楼宇卫士";
      //       i.csbqms = "小区名称+楼栋名称+单元名称";
      //       i.csms = i.ksCsmc;
      //       i.ksbqms = "开门状态：";
      //       i.ksnrms = i.ksWz;
      //       i.jsbqms = "门禁时间：";
      //       i.jsnrms = i.ksCssj;
      //       break;
      //     case "34":
      //       i.xslyms = "两车防盗";
      //       i.csbqms = "车牌号";
      //       i.csms = i.zjhm;
      //       i.ksbqms = "定位时间：";
      //       i.ksnrms = i.ksCssj;
      //       i.jsbqms = "定位方式：";
      //       i.jsnrms = i.jsBz;
      //       break;
      //   }
      // });
      // return formatdata;
    },
    //显示放大的图片
    showlargeimg(src)
    {
       this.$emit('showlargeimg',src);
    },
    //裁剪图片
    startpiccrop(src)
    {
      this.$emit('startpiccrop',src);
    },   
  }
  };

</script>

<style scoped>
.ctn-hold {
  padding: 28px 5px 10px;
}
.linediv {
  flex: 1;
  height: 100%;
  font-size: 12px;
}
.ulline {
  flex: 1;
  overflow: auto;
}
.lihead {
  cursor: pointer;
  margin: 6px 0px;
  padding: 4px 0px;
  position: relative;
  display: flex;
}
.lihead::after {
  content: "";
  top: 16px;
  bottom: 0;
  left: 11px;
  border-right: 1px solid #64e6e7;
  display: inline-block;
  position: absolute;
  height: 100%;
}
.liheadno {
  cursor: pointer;
  margin: 6px 0px;
  padding: 4px 0px;
  position: relative;
  display: flex;
}
.headspan {
  background-color: #12b1e1;
  padding: 5px 0px;
  color: #fff;
  border-radius: 4px;
}
.liline {
  min-height: 100px;
  cursor: pointer;
  margin: 6px 0px;
  padding: 4px 0px;
  position: relative;
  display: flex;
}
/* .liline:hover {
  border: 1px solid #3d5e67;
  box-shadow: 0 0 2px 1px RGBa(135, 185, 255, 0.3) inset;
} */
.liline:last-child::after {
  content: "";
  border-right: none;
}
.liline::after {
  content: "";
  top: 16px;
  bottom: 0;
  left: 11px;
  border-right: 1px solid #64e6e7;
  display: inline-block;
  position: absolute;
  height: calc(100% - 6px);
}
.circlediv {
  width: 30px;
  display: flex;
  flex-direction: column;
}
.text-con {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.fgdiv {
  width: 1px;
  background-color: #dedede;
}
.txt-sj {
  border-radius: 4px;
}
.txt-content {
  min-height: 70px;
  margin-top: 5px;
  padding: 5px;
  border: 1px solid #dedede;
  border-radius: 4px;
  margin-left: 0px;
  margin-right: 0px;
  display: flex;
  width: 98%;
}
.txt-content-sub {
  height: 100%;
}
.txt-ad {
  color: #64e6e7;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}
.txt-se {
  color: #7f7c7c;
}
.txt-de {
  padding: 2px;
  padding-right: 0px;
  display: flex;
}
.txt-span {
  padding-right: 5px;
  display: flex;
  flex-direction: column;
}
.txt-right {
  display: flex;
  flex-direction: column;
  flex: 5;
}
.txt-img {
    width: 100%;
    height: 90px;
}
.circlehead {
  width: 24px;
  height: 24px;
  background-color: #64e6e7;
  /* border: 2px #12b1e1 solid; */
  border-radius: 50%;
  text-align: center;
  position: relative;
  z-index: 12;
}
.circlehead::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 12px;
  height: 12px;
  margin: auto;
  border-radius: 50%;
  background-color: #fff;
}
.circle {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    text-align: center;
    position: relative;
    z-index: 12;
    background-color: red;
    display: flex;
    justify-content: center;
    align-items: center;
}
.bg-car {
  background-color: #02ae9b;
}
.bg-mj {
  background-color: #FF9933;
}
.circlezl {
  width: 14px;
  height: 14px;
  line-height: 14px;
  border-radius: 7px;
  text-align: center;
  position: relative;
  z-index: 12;
  background-color: rgb(209, 116, 116);
  color: #fff;
}
.highheight {
  width: 440px;
  height: 600px;
  overflow-y: auto;
}
.pic-btn {
  width: 80px;
  height: 24px;
  line-height: 20px;
  text-align: center;
  color: #82c1ea;
  background: #0c3a51;
  border: 1px solid #3d5e67;
  margin-right: 5px;
}
.vcenter {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70px;
}
.left {
  flex: 3;
}
.right {
  display: flex;
  flex: 9;
  flex-direction: column;
  padding-left: 10px;
}
.gjzkpic {
  position: absolute;
  right: 15px;
}
.gjzkpic:after {
  content: "\f103";
  font-family: fontawesome;
  font-size: 20px;
}
.gjsqpic {
  position: absolute;
  right: 15px;
}
.gjsqpic:after {
  content: "\f102";
  font-family: fontawesome;
  font-size: 20px;
}
.place-hold {
  height: 10px;
}
.iborder
{
  border: 1px solid #3b5671;
  position: relative;
}
.ipcolor
{
  background-color: rgba(66, 80, 101, 0.8);
  position: absolute;
  bottom:0px;
  left:0px;
  right: 0px;
}
.icenter
{
  width: 100%;
  text-align: center;
}
/* .largeimg {
  height:800px;
  width: 1200px;
  position: absolute;
  z-index: 2000;
  top: 50px;
}

.closespan {
  position: absolute;
  right: 10px;
  top: 10px;
} */

.btn-info {
  height: 30px;
  line-height: 28px;
  padding: 0;
  margin: 0 5px;
  min-width:50px;
}
.search-group {
  height: 40px;
  line-height: 40px;
}
</style>