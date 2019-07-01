<template>
  <div class="ctn-hold">
    <div class="ctn-head">位置迁移
       <button class="btn-con1" v-show="viewPathBtnshow" @click="cxgj">X</button>
    </div>
    <div class="">
      <!-- //g-hold src-con border-full -->
     
      
          <el-row>
            <el-col :span="12">经度  : <el-input  class="lng" placeholder="请输入内容" >104.32</el-input></el-col>
            <el-col :span="12">纬度  : <el-input  class="lat"  placeholder="请输入内容" >31.69</el-input> </el-col>
          </el-row>
          <div></div>
          <el-row>
            <el-col :span="24">地址  : <el-input  class="address" placeholder="请输入内容" >104.32</el-input></el-col>
           
          </el-row>

          <el-row>
            <el-col :span="12"> <el-button class="cancel">取消</el-button></el-col>
            <el-col :span="12">  <el-button class="confirm">确认</el-button></el-col>
          </el-row>

        
          


    </div>
    
    
  </div>
</template>
<script>
import Vue from "vue";

import { excontrolApi } from "@/https";
import eventBus from "@/event";
import { eventCollection } from "@/event/resources";
export default {
  name: "ArchivePanel",
  props: ["archiveType", "archiveProp", "archivePerson"],
  data() {
    return {
      controlBtnShow: true,
      searchInfo: "15198262215",
      archiveData: {
        zp: [{ xp: "" }, { xp: "" }],
        xm: "",
        sfzhm: "",
        hujiquhua: [],
        cph: [],
        sjhm: [],
        qqhm: [],
        wxhm: [],
        sjmac: [],
        imei: [],
        imsi: [],
        personImage:"",
        vehicleImage:"",
      },
      controladdinfo: {
        id: "",
        bkbh: "",
        sqrxm: "",
        sqrsfz: "",
        sqrdwmc: "",
        sqrdwdm: "",
        sqrlxfs: "",
        czrxm: "",
        czrsfz: "",
        czrdwmc: "",
        czrdwdm: "",
        czrlxfs: "",
        bksqrq: "",
        bkqssj: "",
        bkjssj: "",
        bkjb: "",
        rylb: "",
        ryxl: "",
        bkzfyj: "",
        bksy: "",
        fj: "",
        czcs: "",
        czyq: "",
        sfdxtz: "",
        yddxtssjh: "",
        bkdx: [],
        bkdxlx: "1",
        bklx: "2",
        fqmk: "02",
        sfsp: "0", //0-不审批，1-审批
        sfplbk: "0", //0-单个布控，1-批量布控
        sqlx: "1" //1-布控 2-撤控 3- 续控  9-未知
      },
      inputtype: "",
      dgtypecfshow: false,
      dialogFormVisible: false,
      dialogCarColorSel: false,
      form: {
        startWorkTime: "",
        endWorkTime: "",
        color: ""
      },
      formLabelWidth: "120px",
      viewPathBtnshow: true,
      bkdxdata: {}, //多维档案获取的原始数据
      lsgjpara: null, //历史轨迹传参
      selectSjhm: [],
      selectCph: [],
      selectQq: [],
      selectWx: [],
      selectMac: [],
      selectImei: [],
      selectImsi: []
    };
  },
  computed: {
    // ...mapState('Auth', ['userinfo'])
  },
  created: function() {
    // eventBus.$on('tjsearchpepole', msg => {
    //   this.searchInfo = msg;
    //   this.tjsearchpepole();
    // });
  },
  watch: {
    // archiveProp: {
    //   handler(val, oldval) {
    //     if (!this.archiveType) {
    //       Vue.set(this.archiveData.zp[0], 'xp', val.imageUrl);
    //     } else {
    //       (this.archiveData = { zp: [{}, {}] }),
    //         Vue.set(this.archiveData.zp[1], 'xp', val.imageUrl);
    //       Vue.set(this.archiveData, 'cph', val.plateNumber.split(','));
    //       let cphstring = JSON.stringify([
    //         { hphm: val.plateNumber, hpzl: val.plateType }
    //       ]);
    //       Vue.set(this.bkdxdata, 'cph', cphstring);
    //     }
    //   },
    //   deep: true
    // },
    // archivePerson(val) {
    //   Vue.set(this.archiveData, 'xm', val.name);
    //   Vue.set(this.archiveData, 'sfzhm', val.person_id);
    //   Vue.set(this.archiveData.zp[0], 'xp', val.face_image_uri);
    // }
  },
  components: {},
  methods: {
    hidDialog() {
      this.dialogFormVisible = false;
    },
    handleCarColor() {
      let _this = this;
      if (!!this.form.color) {
        var carcolor = _this.form.color;
        _this.searchById();
        //清空身份证输入框
        // _this.searchInfo = "";
        this.dialogCarColorSel = false;
      } else {
        this.$message({
          message: "请选择一种车牌类型",
          type: "warning"
        });
      }
    },

    searchGjBysingle(type) {
      let macarr = [];
      let wxhmarr = [];
      let qqhmarr = [];
      let sjhmarr = [];
      let chparr = [];
      let sfzhm = "";
      let imeiarr = [];
      let imsiarr = [];
      eventBus.$emit(eventCollection.PASSWAY_CLEAR_HISTRACK); //zk修改

      this.lsgjpara = null;
      if (type == 1) {
        //身份证
        sfzhm = this.bkdxdata.sfzhm;
      } else if (type == 2) {
        //车牌号
        if (!!this.bkdxdata.cph && !Array.isArray(this.bkdxdata.cph)) {
          this.bkdxdata.cph = JSON.parse(this.bkdxdata.cph);
        } else if (!this.bkdxdata.cph) {
          this.bkdxdata.cph = [];
        }

        if (!!this.bkdxdata.cph) {
          for (let i = 0; i < this.bkdxdata.cph.length; i++) {
            for (let j = 0; j < this.selectCph.length; j++) {
              if (this.selectCph[j] == this.bkdxdata.cph[i].hphm) {
                let chp = {
                  hphm: this.bkdxdata.cph[i].hphm,
                  hpys: this.bkdxdata.cph[i].hpys,
                  hpzl: this.bkdxdata.cph[i].hpzl
                };
                chparr.push(chp);
              }
            }
          }
        }
      } else if (type == 3) {
        //手机号码
        if (!!this.bkdxdata.sjhm && !Array.isArray(this.bkdxdata.sjhm)) {
          this.bkdxdata.sjhm = JSON.parse(this.bkdxdata.sjhm);
        } else if (!this.bkdxdata.sjhm) {
          this.bkdxdata.sjhm = [];
        }

        if (!!this.bkdxdata.sjhm) {
          for (let i = 0; i < this.bkdxdata.sjhm.length; i++) {
            for (let j = 0; j < this.selectSjhm.length; j++) {
              if (this.selectSjhm[j] == this.bkdxdata.sjhm[i].sjhm) {
                sjhmarr.push(this.bkdxdata.sjhm[i].sjhm);
              }
            }
          }
        }
      } else if (type == 4) {
        //qq wx mac imei imsi
        if (!!this.bkdxdata.qqhm && !Array.isArray(this.bkdxdata.qqhm)) {
          this.bkdxdata.qqhm = JSON.parse(this.bkdxdata.qqhm);
        } else if (!this.bkdxdata.qqhm) {
          this.bkdxdata.qqhm = [];
        }

        if (!!this.bkdxdata.wxhm && !Array.isArray(this.bkdxdata.wxhm)) {
          this.bkdxdata.wxhm = JSON.parse(this.bkdxdata.wxhm);
        } else if (!this.bkdxdata.wxhm) {
          this.bkdxdata.wxhm = [];
        }

        if (!!this.bkdxdata.sjmac && !Array.isArray(this.bkdxdata.sjmac)) {
          this.bkdxdata.sjmac = JSON.parse(this.bkdxdata.sjmac);
        } else if (!this.bkdxdata.sjmac) {
          this.bkdxdata.sjmac = [];
        }

        if (!!this.bkdxdata.imei && !Array.isArray(this.bkdxdata.imei)) {
          this.bkdxdata.imei = JSON.parse(this.bkdxdata.imei);
        } else if (!this.bkdxdata.imei) {
          this.bkdxdata.imei = [];
        }

        if (!!this.bkdxdata.imsi && !Array.isArray(this.bkdxdata.imsi)) {
          this.bkdxdata.imsi = JSON.parse(this.bkdxdata.imsi);
        } else if (!this.bkdxdata.imsi) {
          this.bkdxdata.imsi = [];
        }

        if (!!this.bkdxdata.qqhm) {
          for (let i = 0; i < this.bkdxdata.qqhm.length; i++) {
            for (let j = 0; j < this.selectQq.length; j++) {
              if (this.selectQq[j] == this.bkdxdata.qqhm[i].qqhm) {
                qqhmarr.push(this.bkdxdata.qqhm[i].qqhm);
              }
            }
          }
        }

        if (!!this.bkdxdata.wxhm) {
          for (let i = 0; i < this.bkdxdata.wxhm.length; i++) {
            for (let j = 0; j < this.selectWx.length; j++) {
              if (this.selectWx[j] == this.bkdxdata.wxhm[i].wxhm) {
                wxhmarr.push(this.bkdxdata.wxhm[i].wxhm);
              }
            }
          }
        }

        if (!!this.bkdxdata.sjmac) {
          for (let i = 0; i < this.bkdxdata.sjmac.length; i++) {
            for (let j = 0; j < this.selectMac.length; j++) {
              if (this.selectMac[j] == this.bkdxdata.sjmac[i].sjmac) {
                macarr.push(this.bkdxdata.sjmac[i].sjmac);
              }
            }
          }
        }

        if (!!this.bkdxdata.imei) {
          for (let i = 0; i < this.bkdxdata.imei.length; i++) {
            for (let j = 0; j < this.selectImei.length; j++) {
              if (this.selectImei[j] == this.bkdxdata.imei[i].imei) {
                imeiarr.push(this.bkdxdata.imei[i].imei);
              }
            }
          }
        }

        if (!!this.bkdxdata.imsi) {
          for (let i = 0; i < this.bkdxdata.imsi.length; i++) {
            for (let j = 0; j < this.selectImsi.length; j++) {
              if (this.selectImsi[j] == this.bkdxdata.imsi[i].imsi) {
                imsiarr.push(this.bkdxdata.imsi[i].imsi);
              }
            }
          }
        }
      }

      if (chparr.length < 1 && type == 2) {
        this.$message.error("请至少选择一个车牌号");
        return;
      }
      if (sjhmarr.length < 1 && type == 3) {
        this.$message.error("请至少选择一个手机号");
        return;
      }
      if (
        qqhmarr.length < 1 &&
        wxhmarr.length < 1 &&
        macarr.length < 1 &&
        imeiarr.length < 1 &&
        imsiarr.length < 1 &&
        type == 4
      ) {
        this.$message.error("请至少选择一个QQ号或微信号或MAC或IMEI号或IMSI号");
        return;
      }
      this.lsgjpara = {
        sfzhm: sfzhm,
        cphs: chparr,
        sjh: sjhmarr.join(),
        qq: qqhmarr.join(),
        wx: wxhmarr.join(),
        mac: macarr.join(),
        imei: imeiarr.join(),
        imsi: imsiarr.join(),
        kssj: "",
        jssj: ""
      };
      // this.$nextTick(() => {
      //   this.$refs.ctrgjline.initgjline(this.lsgjpara, 'sz');
      // });
      eventBus.$emit(eventCollection.PASSWAY_SHOW_HISLINE, this.lsgjpara); //yj修改
      this.searchInfo = "";
    },

    cxgj() {
      // if(!!this.lsgjpara)
      // {}
      // else
      // {

      eventBus.$emit(eventCollection.PASSWAY_CLEAR_HISTRACK); //zk修改 ---清除上一次查询结果轨迹

      if (!!this.bkdxdata.cph && !Array.isArray(this.bkdxdata.cph)) {
        this.bkdxdata.cph = JSON.parse(this.bkdxdata.cph);
      } else if (!this.bkdxdata.cph) {
        this.bkdxdata.cph = [];
      }
      if (!!this.bkdxdata.sjhm && !Array.isArray(this.bkdxdata.sjhm)) {
        this.bkdxdata.sjhm = JSON.parse(this.bkdxdata.sjhm);
      } else if (!this.bkdxdata.sjhm) {
        this.bkdxdata.sjhm = [];
      }
      if (!!this.bkdxdata.qqhm && !Array.isArray(this.bkdxdata.qqhm)) {
        this.bkdxdata.qqhm = JSON.parse(this.bkdxdata.qqhm);
      } else if (!this.bkdxdata.qqhm) {
        this.bkdxdata.qqhm = [];
      }
      if (!!this.bkdxdata.wxhm && !Array.isArray(this.bkdxdata.wxhm)) {
        this.bkdxdata.wxhm = JSON.parse(this.bkdxdata.wxhm);
      } else if (!this.bkdxdata.wxhm) {
        this.bkdxdata.wxhm = [];
      }
      if (!!this.bkdxdata.sjmac && !Array.isArray(this.bkdxdata.sjmac)) {
        this.bkdxdata.sjmac = JSON.parse(this.bkdxdata.sjmac);
      } else if (!this.bkdxdata.sjmac) {
        this.bkdxdata.sjmac = [];
      }
      if (!!this.bkdxdata.imei && !Array.isArray(this.bkdxdata.imei)) {
        this.bkdxdata.imei = JSON.parse(this.bkdxdata.imei);
      } else if (!this.bkdxdata.imei) {
        this.bkdxdata.imei = [];
      }
      if (!!this.bkdxdata.imsi && !Array.isArray(this.bkdxdata.imsi)) {
        this.bkdxdata.imsi = JSON.parse(this.bkdxdata.imsi);
      } else if (!this.bkdxdata.imsi) {
        this.bkdxdata.imsi = [];
      }
      let chparr = [];
      if (!!this.bkdxdata.cph) {
        for (let i = 0; i < this.bkdxdata.cph.length; i++) {
          let chp = {
            hphm: this.bkdxdata.cph[i].hphm,
            hpys: this.bkdxdata.cph[i].hpys,
            hpzl: this.bkdxdata.cph[i].hpzl
          };
          chparr.push(chp);
        }
      }
      let sjhmarr = [];
      if (!!this.bkdxdata.sjhm) {
        for (let i = 0; i < this.bkdxdata.sjhm.length; i++) {
          sjhmarr.push(this.bkdxdata.sjhm[i].sjhm);
        }
      }
      let qqhmarr = [];
      if (!!this.bkdxdata.qqhm) {
        for (let i = 0; i < this.bkdxdata.qqhm.length; i++) {
          qqhmarr.push(this.bkdxdata.qqhm[i].qqhm);
        }
      }
      let wxhmarr = [];
      if (!!this.bkdxdata.wxhm) {
        for (let i = 0; i < this.bkdxdata.wxhm.length; i++) {
          wxhmarr.push(this.bkdxdata.wxhm[i].wxhm);
        }
      }
      let macarr = [];
      if (!!this.bkdxdata.sjmac) {
        for (let i = 0; i < this.bkdxdata.sjmac.length; i++) {
          macarr.push(this.bkdxdata.sjmac[i].sjmac);
        }
      }
      let imeiarr = [];
      if (!!this.bkdxdata.imei) {
        for (let i = 0; i < this.bkdxdata.imei.length; i++) {
          imeiarr.push(this.bkdxdata.imei[i].imei);
        }
      }
      let imsiarr = [];
      if (!!this.bkdxdata.imsi) {
        for (let i = 0; i < this.bkdxdata.imsi.length; i++) {
          imsiarr.push(this.bkdxdata.imsi[i].imsi);
        }
      }
      this.lsgjpara = {
        sfzhm: this.bkdxdata.sfzhm,
        cphs: chparr,
        sjh: sjhmarr.join(),
        qq: qqhmarr.join(),
        wx: wxhmarr.join(),
        mac: macarr.join(),
        imei: imeiarr.join(),
        imsi: imsiarr.join(),
        kssj: "",
        jssj: ""
      };
      // }
      //显示历史轨迹弹窗
      // this.showlsgj = true;
      // this.$nextTick(() => {
      //   this.$refs.ctrgjline.initgjline(this.lsgjpara, 'sz');
      // });
      eventBus.$emit(eventCollection.PASSWAY_SHOW_HISLINE, this.lsgjpara); //yj修改
      this.searchInfo = "";
    },
    //地图打点历史轨迹
    // showlsgjmap(resultdata) {
    //   this.changeTrail(resultdata);
    // },
    hidDialog1() {
      this.dialogCarColorSel = false;
    },
    showTimeSelect() {
      this.dialogFormVisible = true;
    },
    // ...mapActions('TrailStates', ['changeTrail']),
    comparePerson() {
      //eventBus.$emit(eventCollection.SEARCH_MANBY_IMG, 'http://80.2.30.20:8088/res?file=1.png');
      eventBus.$emit(
        eventCollection.SEARCH_MANBY_IMG,
        this.archiveData.zp[0].xp
      );
    },
    compareAuto() {
      eventBus.$emit(
        eventCollection.SEARCH_AUTOBY_IMG,
        this.archiveData.zp[1].xp
      );
    },

    //条件检索，确定检索内容的类型
    typeconfirm: function(type) {
      //验证电话号码合法性
      if (type == "03") {
        if (this.searchInfo[0] == "0") {
          this.searchInfo = this.searchInfo.substring(1);
        }
        var re = /^1\d{10}$/;
        if (!re.test(this.searchInfo)) {
          this.$message.error("输入的内容不是手机号");
          return;
        }
      }
      this.inputtype = type;
      this.dgtypecfshow = false;
      this.searchById();
    },
    //条件检索，建立多维档案
    tjsearchpepole: function() {
      //验证输入
      let inputdata = this.searchInfo;
      let issfz = IdentityCodeValid(inputdata);
      let iscar = iscarNo(inputdata);
      //输入的是身份证
      if (issfz) {
        this.inputtype = "01";
        this.searchById();
      } else if (iscar) {
        //输入的是车牌
        this.inputtype = "02";
        this.dialogCarColorSel = true;
      } else {
        //输入的既不是身份证又不是车牌
        //显示检索内容确认框
        this.dgtypecfshow = true;
      }
    },
    searchById() {
      //清空发布指令按钮
      let paradata = {
        bksqbh: "",
        searchinfo: "",
        dxinfo: ""
      };
      // eventBus.$emit(eventCollection.PUSH_INSTRUCT_ID, paradata); //yj修改
      // eventBus.$emit(eventCollection.PASSWAY_CLEAR_HISTRACK); //yj修改
      //清空历史轨迹相关数据
      this.bkdxdata = null;
      this.lsgjpara = null;
      this.isfirstlsfj = 0;
      //清空多維档案数据
      // this.archiveData = { zp: [{}, {}] };
      let param = Object.create(null);
      // param.zjhm = this.searchInfo;
      // param.type = this.inputtype;
      // param.fjxx = this.form.color;
      if (this.inputtype == "03") {
        param.phone = this.searchInfo;
      } else if (this.inputtype == "40") {
        param.qq = this.searchInfo;
      } else if (this.inputtype == "41") {
        param.wechat = this.searchInfo;
      } else if (this.inputtype == "42") {
        param.mac = this.searchInfo;
      } else if (this.inputtype == "43") {
        param.imei = this.searchInfo;
      } else if (this.inputtype == "44") {
        param.imsi = this.searchInfo;
      }
      // param.phone = this.searchInfo;
      // param.qq = this.inputtype;
      // param.mac = this.form.color;

      return excontrolApi
        .getDwda(param)
        .then(res => res.data)
        .then(data => {
          console.log(data);
          console.log(this);
          this.archiveData.xm = data.name;
          this.archiveData.sfzhm = data.idNumber;
           this.archiveData.hujiquhua= (data.hujiquhua).split(",");
          this.archiveData.cph = (
            data.plateNumber
          ).split(",");
          this.archiveData.sjhm = (data.phone).split(",");
          this.archiveData.qqhm = (data.qq).split(",");
          this.archiveData.wxhm = (data.wechat ).split(",");
          this.archiveData.sjmac = (data.mac ).split(",");
          this.archiveData.imei = (data.imei ).split(",");
          this.archiveData.imsi = (data.imsi).split(",");

          this.archiveData.personImage=this.BASE_IMG_URL+data.personImage;
            this.archiveData.vehicleImage=this.BASE_IMG_URL+data.vehicleImage;

          // if (!!data) {
          //   this.bkdxdata = { ...data.basicrecord };
          //   //照片
          //   if (data.basicrecord.zp) {
          //     data.basicrecord.zp = JSON.parse(data.basicrecord.zp);
          //     if (!this.archiveData.zp[1].xp) {
          //       data.basicrecord.zp[1] = {};
          //     } else {
          //       data.basicrecord.zp[1] = this.archiveData.zp[1];
          //     }
          //     data.basicrecord.zp[0].xp =
          //       'data:image/png;base64,' + data.basicrecord.zp[0].xp;
          //   } else {
          //     data.basicrecord.zp = [{}, {}];
          //   }
          //   //车牌号
          //   if (data.basicrecord.cph) {
          //     let cph = JSON.parse(data.basicrecord.cph);
          //     cph = cph.map(o => {
          //       return o.hphm;
          //     });
          //     data.basicrecord.cph = cph;
          //   }

          //   //手机号码
          //   if (data.basicrecord.sjhm) {
          //     let sjhm = JSON.parse(data.basicrecord.sjhm);
          //     sjhm = sjhm.map(o => {
          //       return o.sjhm;
          //     });
          //     data.basicrecord.sjhm = sjhm;
          //   }

          //   //QQ
          //   if (data.basicrecord.qqhm) {
          //     let qqhm = JSON.parse(data.basicrecord.qqhm);
          //     qqhm = qqhm.map(o => {
          //       return o.qqhm;
          //     });
          //     data.basicrecord.qqhm = qqhm;
          //   }

          //   //weixin
          //   if (data.basicrecord.wxhm) {
          //     let wxhm = JSON.parse(data.basicrecord.wxhm);
          //     wxhm = wxhm.map(o => {
          //       return o.wxhm;
          //     });
          //     data.basicrecord.wxhm = wxhm;
          //   }
          //   //mac
          //   if (data.basicrecord.sjmac) {
          //     let sjmac = JSON.parse(data.basicrecord.sjmac);
          //     sjmac = sjmac.map(o => {
          //       return o.sjmac;
          //     });
          //     data.basicrecord.sjmac = sjmac;
          //   }
          //   //imei
          //   if (data.basicrecord.imei) {
          //     let imei = JSON.parse(data.basicrecord.imei);
          //     imei = imei.map(o => {
          //       return o.imei;
          //     });
          //     data.basicrecord.imei = imei;
          //   }
          //   //imsi
          //   if (data.basicrecord.imsi) {
          //     let imsi = JSON.parse(data.basicrecord.imsi);
          //     imsi = imsi.map(o => {
          //       return o.imsi;
          //     });
          //     data.basicrecord.imsi = imsi;
          //   }
          //    if (!data.basicrecord.hujiquhua) {
          //     data.basicrecord.hujiquhua = [];
          //   }
          //   this.archiveData = data.basicrecord;
          //   this.viewPathBtnshow = true;
          // } else {
          //   this.$message({
          //     message: '获取档案信息为空',
          //     type: 'warning'
          //   });
          // }
        });
    },
    readManImage(file, filelist) {
      if (file) {
        let _this = this;
        let FR = new FileReader();
        FR.addEventListener("load", e => {
          //_this.archiveData.zp[0].xp = e.target.result;
          Vue.set(_this.archiveData.zp[0], "xp", e.target.result);
        });
        FR.readAsDataURL(file.raw);
      }
    },
    readCarImage(file, filelist) {
      if (file) {
        let _this = this;
        let FR = new FileReader();
        FR.addEventListener("load", e => {
          //_this.archiveData.zp[1].xp = e.target.result;
          Vue.set(_this.archiveData.zp[1], "xp", e.target.result);
        });
        FR.readAsDataURL(file.raw);
      }
    },
    getTrackById(param) {
      return controlApi.ctrhislineApi1(param).then(response => {
        // loading.close();
        if (!!response.message) {
          this.$message({
            message: response.message,
            type: "warning"
          });
        }
        //console.log(response)
        this.changeTrail(response.data);
      });
    },
    Ckguiji(){
      //  alert(1);
      let param = Object.create(null);
       param.pageNo = 1;
       param.pageSize = 200;
        param.startTime = "2018-12-13 12:00:01";
         param.endTime = "2018-12-20 23:59:59";
         param.searchKey = "川BLG331";//川BD09333   川A34543
         
      return excontrolApi
        .getClguiji(param)
        .then(res => res.data)
        .then(data => {
          console.log(data);
          console.log(this);
          //划出轨迹
            eventBus.$emit(
              eventCollection._guiji2map,
             data.data.list
            );

            eventBus.$emit(
              eventCollection.PASSWAY_SHOW_HISLINE,
              data.data
            );
        
        });
    },
    // newControl() {
    //   if (
    //     !this.archiveData.sfzhm &&
    //     this.selectCph.length < 1 &&
    //     this.selectSjhm < 1 &&
    //     this.selectQq.length < 1 &&
    //     this.selectWx < 1 &&
    //     this.selectMac < 1 &&
    //     this.selectImei < 1 &&
    //     this.selectImsi < 1 &&
    //     !this.archiveData.zp[0].xp
    //   ) {
    //     this.$message({
    //       message: "请先检索并至少选择一个布控要素",
    //       type: "warning"
    //     });
    //     return;
    //   }
    //   this.$confirm(
    //     "请于五个工作日内提交相关手续!<br/>是否确认继续布控?",
    //     "布控说明",
    //     {
    //       confirmButtonText: "确定",
    //       cancelButtonText: "取消",
    //       dangerouslyUseHTMLString: true,
    //       type: "warning"
    //     }
    //   )
    //     .then(() => {
    //       let operationdata = {
    //         czrdwmc: "四川省公安厅指挥中心",
    //         czrxm: "张三",
    //         czrlxfs: "13882456789",
    //         czrsfz: "522564198702034845",
    //         czrdwdm: "123456"
    //       };
    //       if (this.userinfo.token) {
    //         operationdata = {
    //           czrdwmc: this.userinfo.orgName,
    //           czrxm: this.userinfo.userName,
    //           czrlxfs: this.userinfo.mobilePhone,
    //           czrsfz: this.userinfo.idcardno,
    //           czrdwdm: this.userinfo.orgId
    //         };
    //       }
    //       this.controladdinfo.czrdwmc = operationdata.czrdwmc;
    //       this.controladdinfo.czrlxfs = operationdata.czrlxfs;
    //       this.controladdinfo.czrxm = operationdata.czrxm;
    //       this.controladdinfo.czrsfz = operationdata.czrsfz;
    //       this.controladdinfo.czrdwdm = operationdata.czrdwdm;
    //       this.controladdinfo.bkdx[0] = Object.create(null);
    //       this.controladdinfo.bkdx[0].bbkrsfz = this.archiveData.sfzhm;
    //       this.controladdinfo.bkdx[0].bbkrcl = this.selectCph.join();
    //       this.controladdinfo.bkdx[0].bbkrsj = this.selectSjhm.join();
    //       this.controladdinfo.bkdx[0].bbkrqq = this.selectQq.join();
    //       this.controladdinfo.bkdx[0].bbkrxm = this.archiveData.xm;
    //       this.controladdinfo.bkdx[0].bbkrwx = this.selectWx.join();
    //       this.controladdinfo.bkdx[0].bbkrmac = this.selectMac.join();
    //       this.controladdinfo.bkdx[0].bbkrimei = this.selectImei.join();
    //       this.controladdinfo.bkdx[0].bbkrimsi = this.selectImsi.join();
    //       //this.controladdinfo.bkdx[0].rltzzp ='data:image/png;base64,' + this.archiveData.zp[0].xp;//yj修改
    //       this.controladdinfo.bkdx[0].rltzzp = this.archiveData.zp[0].xp; //yj修改
    //       // this.controladdinfo.bkdx[0].cltzzp =this.archiveData.zp[1].xp;//yj修改
    //       this.controladdinfo.bkdx[0].cltzzp = ""; //yj修改
    //       let paramdata = JSON.stringify(this.controladdinfo);

    //       this.uploadForm = new FormData();

    //       this.uploadForm.append("paramdata", paramdata);

    //       return controlApi.ctraddsubmitApil(this.uploadForm).then(response => {
    //         // loading.close();
    //         this.$message({
    //           message: "布控成功！",
    //           type: "success"
    //         });
    //         // this.controlBtnShow = false;
    //         this.controladdinfo.bkdx[0].cltzzp = this.archiveData.zp[1].xp; //增加车辆照片传参给下发指令
    //         let paradata = {
    //           bksqbh: response.data[0].bksqbh,
    //           searchinfo: this.searchInfo,
    //           dxinfo: this.controladdinfo.bkdx[0]
    //         };
    //         eventBus.$emit(eventCollection.PUSH_INSTRUCT_ID, paradata); //yj修改
    //       });
    //     })
    //     .catch(() => {});
    // }
  }
};

function IdentityCodeValid(code) {
  var city = {
    11: "北京",
    12: "天津",
    13: "河北",
    14: "山西",
    15: "内蒙古",
    21: "辽宁",
    22: "吉林",
    23: "黑龙江 ",
    31: "上海",
    32: "江苏",
    33: "浙江",
    34: "安徽",
    35: "福建",
    36: "江西",
    37: "山东",
    41: "河南",
    42: "湖北 ",
    43: "湖南",
    44: "广东",
    45: "广西",
    46: "海南",
    50: "重庆",
    51: "四川",
    52: "贵州",
    53: "云南",
    54: "西藏 ",
    61: "陕西",
    62: "甘肃",
    63: "青海",
    64: "宁夏",
    65: "新疆",
    71: "台湾",
    81: "香港",
    82: "澳门",
    91: "国外 "
  };
  var tip = "";
  var pass = true;

  if (
    !code ||
    !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(
      code
    )
  ) {
    tip = "身份证号格式错误";
    pass = false;
  } else if (!city[code.substr(0, 2)]) {
    tip = "地址编码错误";
    pass = false;
  } else {
    //18位身份证需要验证最后一位校验位
    if (code.length == 18) {
      code = code.split("");
      //∑(ai×Wi)(mod 11)
      //加权因子
      var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      //校验位
      var parity = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2];
      var sum = 0;
      var ai = 0;
      var wi = 0;
      for (var i = 0; i < 17; i++) {
        ai = code[i];
        wi = factor[i];
        sum += ai * wi;
      }
      var last = parity[sum % 11];
      if (parity[sum % 11] != code[17]) {
        pass = false;
      }
    }
  }
  return pass;
}
//车牌号合法性校验
function iscarNo(str) {
  return /(^[\u4E00-\u9FA5]{1}[A-Z0-9]{6}$)|(^[A-Z]{2}[A-Z0-9]{2}[A-Z0-9\u4E00-\u9FA5]{1}[A-Z0-9]{4}$)|(^[\u4E00-\u9FA5]{1}[A-Z0-9]{5}[挂学警军港澳]{1}$)|(^[A-Z]{2}[0-9]{5}$)|(^(08|38){1}[A-Z0-9]{4}[A-Z0-9挂学警军港澳]{1}$)/.test(
    str
  );
}
</script>
<style>

 .el-row {
    margin-bottom: 20px;
     margin-top: 20px;
   
  }
  .el-col {
    border-radius: 4px;
  }
 

.lng{
  display:inline-block;
   width: 80%
}
.lat{
  display:inline-block;
  width:80%
}
.address{
  display:inline-block;
  width:90%
}

.lng >.el-input__inner {
  background: #06253d!important;
  color: #524F52;
  font-size: 16px;
}
.lat >.el-input__inner {
  background: #06253d!important;
  color: #524F52;
  font-size: 16px;
}
.address >.el-input__inner {
  background: #06253d!important;
  color: #524F52;
  font-size: 16px;
}
.cancel{
  margin-left:60%;
   background: #06253d!important;
  color: #524F52;
  font-size: 16px;
}

.confirm{
  background: #06253d!important;
  color: #524F52;
  font-size: 16px;
}


/* .lat > input[type="text"]{
  background: red!important;
} */
.g-hold.picture-con .avatar-uploader {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.g-hold.picture-con .avatar-uploader .el-upload {
  width: 100%;
  height: 100%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
</style>


<style lang="stylus" scoped>
.ctn-hold {
       height: 220px!important;
  display: flex;
  flex: 1;
  flex-direction: column;
  height: auto;
  border-radius: 10px;
  background: #06253d;
  padding: 28px 15px 10px;
  box-shadow: 0 0 12px 2px RGBa(135, 185, 255, 0.3) inset, 0 0 6px 0 RGBa(135, 185, 255, 0.3);
}

.btn-con1 {
  text-align: center;
  cursor: pointer;
  color: #89cffa;
  background: none;
  // border: 1px solid #51808a;
  margin-top: 6px;
  height: 22px;
  line-height: 20px;
  font-size: 12px;
  border:0px;
  
}

.btn-con1:focus {
  outline: none;
}

.g-hold {
  position: relative;
  display: flex;
  margin-top: 8px;

  .info-con {
    // display: flex;
    // flex-direction: column;
    flex: 1;
    border-right: 1px solid #51808a;
  }

  .info-item {
    display: flex;
    flex: 1;
    color: #fff;
    background: none;
    border-bottom: 1px solid #51808a;
    padding-left: 5px;

    input[type=text], input[type=number] {
      display: flex;
      flex: 1;
      background: none;
    }

    .plus-ic {
      display: block;
      width: 30px;
      text-align: center;
      cursor: pointer;
      font-family: fontawesome;
    }

    .plus-ic:after {
      content: '\f0fe';
    }
  }

  .info-label {
    margin-right: 5px;
    min-width: 40px;
  }
}

.info-item div {
  display: block;
  width: 100%;
  height: auto;
}

.g-hold.src-con {
  height: 32px;
  line-height: 30px;
  // border:0px

  .inp-con {
    display: flex;
    flex: 1;
    border-right: 0px solid #51808a;

    .ic-con {
      width: 32px;
      text-align: center;
      font-family: fontawesome;
      font-size: 16px;
      color: #82c1ea;
    }

    .ic-con:after {
      content: '\f002';
    }

    .textinp {
      display: block;
      flex: 1;
      border: none;
      background: none;
      outline: none;
      color: #64e6e7;
    }

    .textinp::placeholder {
      color: #b0b0b0;
    }
  }

  .btn-con {
    width: 60px;
    text-align: center;
    cursor: pointer;
    color: #89cffa;
    background: rgba(20, 116, 160, 0.8);
  }
}

.g-hold.tab-con {
  height: 32px;
  line-height: 30px;
  text-align: center;

  .tab-item {
    flex: 1;
    color: #fff;
    cursor: pointer;
    // border-right: 1px solid #51808a;
    // border-bottom: 1px solid #51808a;
  }
}

.g-hold.picture-con {
  flex: 1;

  .picture-hold {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    // border-right: 1px solid #51808a;
    // border-bottom: 1px solid #51808a;

    .pic-btn {
      width: 104px;
      height: 28px;
      line-height: 24px;
      margin: 8px auto;
      text-align: center;
      visibility: hidden;
      color: #82c1ea;
      background: #1c2b34;
      border: 1px solid #3d5e67;

      &.showing {
        visibility: visible;
      }
    }

    .pic-wrap {
      position: relative;
      width: 104px;
      height: 100px;
      line-height: 100px;
      text-align: center;
      cursor: pointer;
      border: 2px solid #8394a1;

      .defaul-sym {
        position: absolute;
        display: block;
        width: 100%;
        height: 80px;
        left: 0;
        top: 0;
        font-size: 40px;
      }

      .rx-icon {
        background-image: url('/static/image/shizhan/rx-icon.png');
        background-repeat: no-repeat;
        background-position: center;
      }

      .cx-icon {
        background-image: url('/static/image/shizhan/cx-icon.png');
        background-repeat: no-repeat;
        background-position: center;
      }

      .up-text {
        position: absolute;
        width: 100%;
        bottom: 8px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        color: #a8c1d8;
      }

      img {
        position: absolute;
        display: block;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
      }
    }

    .pic-wrap:before {
      position: absolute;
      display: block;
      content: '';
      width: 0;
      height: 0;
      top: 0;
      right: 0;
      border-bottom: 20px solid transparent;
      border-right: 20px solid #8396a2;
      z-index: 5;
    }

    .pic-wrap:after {
      position: absolute;
      display: block;
      content: '';
      width: 0;
      height: 0;
      top: -2px;
      right: -2px;
      border-bottom: 20px solid transparent;
      border-right: 20px solid #06253d;
      z-index: 5;
    }
  }
}

.g-hold.basic-con {
  // height: 63px;
  line-height: 30px;

  .ic-con {
    width: 31px;
    line-height: 62px;
    text-align: center;
    font-family: fontawesome;
    font-size: 18px;
    color: #fff;
    background: #595fd7;
    // border-right: 1px solid #51808a;
    // border-bottom: 1px solid #51808a;
  }

  .ic-con:after {
    content: '\f007';
  }

  .info-hujiquhua {
    background-color: #A08629;
    margin-right: 10px;
    background-color: #A08629;
    margin-right: 10px;
    display: inline-block;
    margin-top: 2px;
    margin-bottom: 2px;
    padding: 2px;
    line-height: 20px;
  }
}

.g-hold.vehicle-con {
  // height: 32px;
  line-height: 30px;

  .info-item {
    border-bottom: none;
  }

  .ic-con {
    width: 31px;
    line-height: 30px;
    text-align: center;
    font-family: fontawesome;
    font-size: 16px;
    color: #fff;
    background: #56c4fc;
    // border-right: 1px solid #51808a;
  }

  .ic-con:after {
    content: '\f1b9';
  }
}

.g-hold.phone-con {
  // height: 32px;
  line-height: 30px;

  .info-item {
    border-bottom: none;
  }

  .ic-con {
    width: 31px;
    line-height: 30px;
    text-align: center;
    font-family: fontawesome;
    font-size: 26px;
    color: #fff;
    background: #09bc74;
    border-right: 1px solid #51808a;
  }

  .ic-con:after {
    content: '\f10b';
  }
}

.g-hold.net-con {
  // height: 94px;
  line-height: 30px;
  margin-bottom: 2px;

  .ic-con {
    width: 31px;
    line-height: 92px;
    text-align: center;
    font-family: fontawesome;
    font-size: 16px;
    color: #fff;
    background: #02ae9b;
    // border-right: 1px solid #51808a;
    // border-bottom: 1px solid #51808a;
  }

  .ic-con:after {
    content: '\f0ac';
  }
}

.g-hold.border-full {
  // border: 1px solid #51808a;
}

.g-hold.border-tplf {
  // border-top: 1px solid #51808a;
  // border-left: 1px solid #51808a;
}

.corner-svg {
  position: absolute;
  top: -1px;
  left: -1px;
}

.btn-wrap {
  display: flex;
  height: 46px;
  justify-content: center;
  margin-top: 18px;

  .svg-con {
    width: 228px;
    height: 46px;
    cursor: pointer;

    &.hidding {
      filter: grayscale(100%);
    }
  }
}

.item-group {
  width: calc(100% + 8px);
  max-height: calc(100% - 100px);
  overflow: auto;
  overflow-x: hidden;
  margin-top: 10px;
  padding-right: 8px;
}

.item-group .g-hold:first-child {
  margin-top: 0;
}
</style>