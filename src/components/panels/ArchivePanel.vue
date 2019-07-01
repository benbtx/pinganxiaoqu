<template>
  <div class="ctn-hold">
    <div class="ctn-head">多维档案
      <!-- <button class="btn-con1" v-show="viewPathBtnshow" @click="cxgj">查看轨迹</button> -->
    </div>
    <div class="g-hold src-con border-full">
      <div class="inp-con">
        <p class="ic-con"></p>
        <input
          type="text"
          class="textinp"
          placeholder="search info"
          v-model.trim="searchInfo"
          @keyup.enter.native="tjsearchpepole"
        >
      </div>
      <div class="btn-con" @click="tjsearchpepole">搜索</div>
    </div>
    <el-dialog
      class="dpzy"
      title="提示"
      :visible.sync="dgtypecfshow"
      :close-on-click-modal="false"
      width="700px"
      top="32vh"
      center
      append-to-body
      v-dialogDrag
    >
      <span style="color:#fff">请确认检索条件的类型：</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="typeconfirm('03')">
          <i class="fa fa-phone"></i> 手机号
        </el-button>
        <el-button @click="typeconfirm('40')">
          <i class="fa fa-qq"></i> QQ
        </el-button>
        <el-button @click="typeconfirm('41')">
          <i class="fa fa-weixin"></i> 微信
        </el-button>
        <el-button @click="typeconfirm('42')">MAC</el-button>
        <el-button @click="typeconfirm('43')">IMEI</el-button>
        <el-button @click="typeconfirm('44')">IMSI</el-button>
      </span>
    </el-dialog>
    <div class="item-group dpzy">
      <div class="g-hold picture-con border-tplf">
        <div class="picture-hold">
          <p style="line-height: 20px;">人脸</p>
          <div class="pic-wrap">
            <el-upload
              action
              class="avatar-uploader"
              :show-file-list="false"
              :auto-upload="false"
              :on-change="readManImage"
            >
              <i class="rx-icon defaul-sym" style="font-size:30px"></i>
              <p class="up-text">上传图片</p>
              <img v-if="archiveData.zp[0].xp" :src="archiveData.zp[0].xp">
               <!-- <img v-if="archiveData.personImage" :src="archiveData.personImage"> -->
            </el-upload>
          </div>
          <button
            class="pic-btn"
            :class="{showing: archiveData.zp[0].xp}"
            @click="comparePerson"
          >人脸比对</button>
        </div>
        <div class="picture-hold">
          <p style="line-height: 20px;">车脸</p>
          <div class="pic-wrap">
            <el-upload
              action
              class="avatar-uploader"
              :show-file-list="false"
              :auto-upload="false"
              :on-change="readCarImage"
            >
              <i class="cx-icon defaul-sym" style="font-size:30px"></i>
              <p class="up-text">上传图片</p>
              <!-- <img v-if="archiveData.zp[1].xp" :src="archiveData.zp[1].xp"> -->
              <img v-if="archiveData.vehicleImage" :src="archiveData.vehicleImage">
            </el-upload>
          </div>
          <button class="pic-btn" :class="{showing: archiveData.zp[1].xp}" @click="compareAuto">以图搜车</button>
        </div>
      </div>
      <div class="g-hold basic-con border-tplf">
        <p class="ic-con" style="cursor:pointer;" @click="searchGjBysingle(1)">
          <!-- <svg class="corner-svg" viewBox="0 0 32 63" width="32px">
          <path d="M0,4 L0,0 L4,0" fill="none" stroke="#e2fafc" stroke-width="1" />
          <path d="M28,0 L32,0 L32,4" fill="none" stroke="#e2fafc" stroke-width="1" />
          <path d="M0,59 L0,63 L4,63" fill="none" stroke="#e2fafc" stroke-width="1" />
          <path d="M28,63 L32,63 L32,59" fill="none" stroke="#e2fafc" stroke-width="1" />
          </svg>-->
        </p>
        <div class="info-con">
          <p class="info-item">
            <span class="info-label">姓名</span>
            <span>{{archiveData.xm}}</span>
            <!-- <input type="text" v-model="archiveData.xm" placeholder="姓名"/> -->
            <!-- <button class="btn-con1" v-show="viewPathBtnshow" @click="cxgj">查看轨迹</button> -->
          </p>
          <p class="info-item">
            <span class="info-label">身份证号</span>
            <span>{{archiveData.sfzhm}}</span>
            <!-- <input type="text" v-model="archiveData.sfzhm" placeholder="身份证号"/> -->
            <!-- <span class="plus-ic"></span> -->
          </p>
          <div class="info-item">
            <span class="info-label" style="width:78px">户籍区划</span>
            <div>
              <span
                v-for="(item,index) in archiveData.hujiquhua"
                :key="index"
                class="info-hujiquhua"
              >{{item}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="g-hold vehicle-con border-full">
        <p class="ic-con" style="cursor:pointer;" @click="searchGjBysingle(2)">
          <!-- <svg class="corner-svg" viewBox="0 0 32 32" width="32px">
          <path d="M0,4 L0,0 L4,0" fill="none" stroke="#e2fafc" stroke-width="1" />
          <path d="M28,0 L32,0 L32,4" fill="none" stroke="#e2fafc" stroke-width="1" />
          <path d="M0,28 L0,32 L4,32" fill="none" stroke="#e2fafc" stroke-width="1" />
          <path d="M28,32 L32,32 L32,28" fill="none" stroke="#e2fafc" stroke-width="1" />
          </svg>-->
        </p>
        <p class="info-item dpzy">
          <!-- <span class="info-label">车牌号</span> -->
          <el-checkbox-group v-model="selectCph">
            <el-checkbox
              :label="item"
              :value="item"
              v-for="(item, i) in  archiveData.cph"
              :key="i"
              checked
            ></el-checkbox>
          </el-checkbox-group>
          <!-- <input type="text" v-model="archiveData.cph" placeholder="车牌号" /> -->
          <!-- <span class="plus-ic"></span> -->
        </p>
      </div>
      <div class="g-hold phone-con border-full">
        <p class="ic-con" style="cursor:pointer;" @click="searchGjBysingle(3)">
          <!-- <svg class="corner-svg" viewBox="0 0 32 32" width="32px">
          <path d="M0,4 L0,0 L4,0" fill="none" stroke="#e2fafc" stroke-width="1" />
          <path d="M28,0 L32,0 L32,4" fill="none" stroke="#e2fafc" stroke-width="1" />
          <path d="M0,28 L0,32 L4,32" fill="none" stroke="#e2fafc" stroke-width="1" />
          <path d="M28,32 L32,32 L32,28" fill="none" stroke="#e2fafc" stroke-width="1" />
          </svg>-->
        </p>
        <p class="info-item dpzy">
          <!-- <span class="info-label">手机号</span>   -->
          <el-checkbox-group v-model="selectSjhm">
            <el-checkbox
              :label="item"
              :value="item"
              v-for="(item, i) in  archiveData.sjhm"
              :key="i"
              checked
            ></el-checkbox>
          </el-checkbox-group>
          <!-- <input type="text" v-model="archiveData.sjhm" placeholder="电话" /> -->
          <!-- <span class="plus-ic"></span> -->
        </p>
      </div>
      <div class="g-hold net-con border-tplf">
        <p class="ic-con" style="cursor:pointer;" @click="searchGjBysingle(4)">
          <!-- <svg class="corner-svg" viewBox="0 0 32 94" width="32px">
          <path d="M0,4 L0,0 L4,0" fill="none" stroke="#e2fafc" stroke-width="1" />
          <path d="M28,0 L32,0 L32,4" fill="none" stroke="#e2fafc" stroke-width="1" />
          <path d="M0,90 L0,94 L4,94" fill="none" stroke="#e2fafc" stroke-width="1" />
          <path d="M28,94 L32,94 L32,90" fill="none" stroke="#e2fafc" stroke-width="1" />
          </svg>-->
        </p>
        <div class="info-con" style="display:block">
          <p class="info-item dpzy" style="min-height: 30px;">
            <span class="info-label">QQ</span>
            <el-checkbox-group v-model="selectQq">
              <el-checkbox
                :label="item"
                :value="item"
                v-for="(item, i) in  archiveData.qqhm"
                :key="i"
                checked
              ></el-checkbox>
            </el-checkbox-group>
            <!-- <input type="text" v-model="archiveData.qqhm" placeholder="QQ" /> -->
            <!-- <span class="plus-ic"></span> -->
          </p>
          <p class="info-item dpzy" style="min-height: 30px;">
            <span class="info-label">微信</span>
            <el-checkbox-group v-model="selectWx">
              <el-checkbox
                :label="item"
                :value="item"
                v-for="(item, i) in  archiveData.wxhm"
                :key="i"
                checked
              ></el-checkbox>
            </el-checkbox-group>
            <!-- <input type="text" v-model="archiveData.wxhm" placeholder="微信" /> -->
            <!-- <span class="plus-ic"></span> -->
          </p>
          <p class="info-item dpzy" style="min-height: 30px;">
            <span class="info-label">MAC</span>
            <el-checkbox-group v-model="selectMac">
              <el-checkbox
                :label="item"
                :value="item"
                v-for="(item, i) in  archiveData.sjmac"
                :key="i"
                checked
              ></el-checkbox>
            </el-checkbox-group>
            <!-- <input type="text" v-model="archiveData.sjmac" placeholder="MAC" /> -->
            <!-- <span class="plus-ic"></span> -->
          </p>
          <p class="info-item dpzy" style="min-height: 30px;">
            <span class="info-label">IMEI</span>
            <el-checkbox-group v-model="selectImei">
              <el-checkbox
                :label="item"
                :value="item"
                v-for="(item, i) in  archiveData.imei"
                :key="i"
                checked
              ></el-checkbox>
            </el-checkbox-group>
          </p>
          <p class="info-item dpzy" style="min-height: 30px;">
            <span class="info-label">IMSI</span>
            <el-checkbox-group v-model="selectImsi">
              <el-checkbox
                :label="item"
                :value="item"
                v-for="(item, i) in  archiveData.imsi"
                :key="i"
                checked
              ></el-checkbox>
            </el-checkbox-group>
          </p>
        </div>
      </div>
    </div>
    <div class="btn-wrap">
      <div class="svg-con" :class="{hidding: !controlBtnShow}" @click="Ckguiji">
        <svg viewBox="0 0 268 46" width="228px" height="46px">
          <defs>
            <linearGradient id="strip-gradient" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" stop-color="#0b3c58"></stop>
              <stop offset="50%" stop-color="#1e6a94"></stop>
              <stop offset="100%" stop-color="#5ac1ed"></stop>
            </linearGradient>
            <linearGradient id="bg-gradient" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" stop-color="#1b4e68"></stop>
              <stop offset="50%" stop-color="#306d8a"></stop>
              <stop offset="100%" stop-color="#91daeb"></stop>
            </linearGradient>
            <pattern id="strip-bg" patternUnits="userSpaceOnUse" width="48" height="48">
              <path
                d="M-1,1 l2,-2 M0,24 l24,-24 M0,48 l48,-48 M24,48 l24,-24 M47,49 l2,-2"
                stroke="url(#strip-gradient)"
                stroke-width="7"
                stroke-linecap="square"
                stroke-linejoin="miter"
              ></path>
            </pattern>
          </defs>
          <path d="M5,45 l0,-10 l28,-28 l234,0 l0,10 l-28,28 z" fill="none" stroke="#1e5d7d"></path>
          <path d="M0,39 l0,-10 l28,-28 l234,0 l0,10 l-28,28 z" fill="url(#bg-gradient)"></path>
          <path
            d="M0,39 l0,-10 l28,-28 l234,0 l0,10 l-28,28 z"
            fill="url(#strip-bg)"
            stroke="#1477a8"
          ></path>
          <text x="86" y="26" font="inherit" font-size="18px" font-weight="600" fill="#a8ecf9">查看轨迹</text>
        </svg>
      </div>
    </div>
    <div style="border-radius:10px;">
      <el-dialog
        class="dpzy"
        :model="form"
        width="500px"
        title="查询轨迹"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
        center
        append-to-body
        v-dialogDrag
      >
        <el-form :inline="true">
          <el-form-item label="起始时间:" prop="startWorkTime" label-width="formLabelWidth">
            <el-date-picker
              type="datetime"
              placeholder="选择日期时间"
              v-model="form.startWorkTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
          <br>
          <el-form-item label="结束时间:" prop="endWorkTime" label-width="formLabelWidth">
            <el-date-picker
              type="datetime"
              placeholder="选择日期时间"
              v-model="form.endWorkTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
          <br>
          <div style="text-align:center">
            <el-button type="primary" @click="cxgj()">确 定</el-button>
            <el-button @click="hidDialog()">取 消</el-button>
          </div>
        </el-form>
      </el-dialog>
    </div>
    <div>
      <el-dialog
        class="dpzy"
        :model="form"
        width="520px"
        title="提示"
        :visible.sync="dialogCarColorSel"
        :close-on-click-modal="false"
        center
        append-to-body
        v-dialogDrag
      >
        <el-form :inline="true">
          <p style="color:#fff;text-align:left;top:0px;margin-bottom:10px">请选择一种车牌类型：</p>
          <el-form-item>
            <el-radio-group v-model="form.color" class="tselridio">
              <el-radio label="0" value="0">不限</el-radio>
              <el-radio label="1" value="1">小型汽车</el-radio>
              <el-radio label="2" value="2">大型汽车</el-radio>
              <br>
              <el-radio label="3" value="3">农用运输车</el-radio>
              <el-radio label="4" value="4">轻便摩托车</el-radio>
              <el-radio label="5" value="5">两、三轮摩托车</el-radio>
              <br>
              <el-radio label="6" value="6">教练汽车挂车</el-radio>
              <el-radio label="7" value="7">挂车</el-radio>
              <el-radio label="8" value="8">警用汽车</el-radio>
              <el-radio label="9" value="9">警用摩托</el-radio>
            </el-radio-group>
          </el-form-item>
          <br>
          <div style="text-align:center">
            <el-button type="primary" @click="handleCarColor()">确 定</el-button>
            <el-button @click="hidDialog1()">取 消</el-button>
          </div>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
// import eventBus from '@/event';
// import { eventCollection } from '@/event/resources';
// // import { mapActions } from 'vuex';
// import { mapState } from 'vuex';
// import { passwayApi, controlApi } from '@/http';
// // import Controlline from '@/components/control/Controlline';
import { excontrolApi, passwayApi } from "@/https";
import eventBus from "@/event";
import { eventCollection } from "@/event/resources";
export default {
  name: "ArchivePanel",
  props: ["archiveType", "archiveProp", "archivePerson"],
  data() {
    return {
      controlBtnShow: true,
      searchInfo: "18025268874",
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
      selectImsi: [],
      gjTime: [this.getFormatDate(Date.parse(new Date()) - 30*24*60*60*1000), this.getFormatDate(new Date())]
    };
  },
  computed: {
    // ...mapState('Auth', ['userinfo'])
  },
  created: function() {
    eventBus.$on('tjsearchpepole', msg => {
      this.searchInfo = msg;
      this.tjsearchpepole();
    });
  },
  watch: {
    archiveProp: {
      handler(val, oldval) {
        if (!this.archiveType) {
          Vue.set(this.archiveData.zp[0], 'xp', val.facePicUrl);
        } else {
          (this.archiveData = { zp: [{}, {}] }),
            Vue.set(this.archiveData.zp[1], 'xp', val.imageUrl);
          Vue.set(this.archiveData, 'cph', val.plateNumber.split(','));
          let cphstring = JSON.stringify([
            { hphm: val.plateNumber, hpzl: val.plateType }
          ]);
          Vue.set(this.bkdxdata, 'cph', cphstring);
        }
      },
      deep: true
    },
    archivePerson(val) {
      Vue.set(this.archiveData, 'xm', val.humanName);
      Vue.set(this.archiveData, 'sfzhm', val.credentialsNum);
      Vue.set(this.archiveData.zp[0], 'xp', val.facePicUrl);
    }
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
      return;
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
      let imgLink = this.archiveData.zp[0].xp;
      let picBase64 = imgLink.replace('data:image/jpeg;base64,', '');;
      if (picBase64) {
          eventBus.$emit(
            eventCollection.SEARCH_MANBY_IMG,
            picBase64
          );
      }
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
      if (this.inputtype == "01") {
        param.idNumber = this.searchInfo;
      } else if (this.inputtype == "02") {
        param.plateNumber = this.searchInfo;
      } else if (this.inputtype == "03") {
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
          if (!!data) {
          this.archiveData.xm = data.name;
          this.archiveData.sfzhm = data.idNumber;
           this.archiveData.hujiquhua= data.hujiquhua && (data.hujiquhua).split(",");
          this.archiveData.cph = data.plateNumber && (data.plateNumber).split(",");
          this.archiveData.sjhm = data.phone && (data.phone).split(",");
          this.archiveData.qqhm = data.qq && (data.qq).split(",");
          this.archiveData.wxhm = data.wechat　&&　(data.wechat).split(",");
          this.archiveData.sjmac = data.mac && (data.mac).split(",");
          this.archiveData.imei = data.imei && (data.imei).split(",");
          this.archiveData.imsi = data.imsi &&　(data.imsi).split(",");
           //照片
            if (data.personImage) {
              this.archiveData.zp[0].xp = this.BASE_IMG_URL + data.personImage;
            }

            if (data.vehicleImage) {
              this.archiveData.zp[1].xp = this.BASE_IMG_URL + data.vehicleImage;
            }
          } else {
            this.$message({
              message: '获取档案信息为空',
              type: 'warning'
            });
          }
            
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
    Ckguiji() {
      // this.archiveData.sfzhm = '510704198401195276';
      // this.archiveData.cph = ['川BLG331'];
      if (this.archiveData.sfzhm) {
        this.CkRYguiji();
      } else if (!this.archiveData.sfzhm && this.archiveData.cph &&　this.archiveData.cph.length>0) {
        this.CkCLguiji();
      } else {
        this.$message.error("请选择要查询的人或车！");
      }
    },
    CkRYguiji(){
      //  alert(1);
      let param = Object.create(null);
      param.pageNo = 1;
      param.pageSize = 200;
      param.credentialsNum = this.archiveData.sfzhm;
         
      return passwayApi
        .getRyguiji(param)
        .then(res => res.data)
        .then(data => {
          console.log(data);
          //划出轨迹
            eventBus.$emit(eventCollection._guiji2map, {
              data:  data.pageData,
              type: 2
            });

            eventBus.$emit(
              eventCollection.PASSWAY_SHOW_HISLINE,
              this.archiveData
            );
        
        });
    },
    CkCLguiji(){
      //  alert(1);
      let param = Object.create(null);
      param.pageNo = 1;
      param.pageSize = 200;
      param.startTime = this.gjTime[0];
      param.endTime = this.gjTime[1];

      return passwayApi
        .getClguiji(param)
        .then(res => res.data)
        .then(data => {
          console.log(data);
          //划出轨迹
          
            eventBus.$emit(eventCollection._guiji2map, {
              data: data.data.list,
              type: 1
            });


            eventBus.$emit(
              eventCollection.PASSWAY_SHOW_HISLINE,
              this.archiveData
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
  border: 1px solid #51808a;
  margin-top: 6px;
  height: 22px;
  line-height: 20px;
  font-size: 12px;
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

  .inp-con {
    display: flex;
    flex: 1;
    border-right: 1px solid #51808a;

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
    border-right: 1px solid #51808a;
    border-bottom: 1px solid #51808a;
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
    border-right: 1px solid #51808a;
    border-bottom: 1px solid #51808a;

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
    border-right: 1px solid #51808a;
    border-bottom: 1px solid #51808a;
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
    border-right: 1px solid #51808a;
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
    border-right: 1px solid #51808a;
    border-bottom: 1px solid #51808a;
  }

  .ic-con:after {
    content: '\f0ac';
  }
}

.g-hold.border-full {
  border: 1px solid #51808a;
}

.g-hold.border-tplf {
  border-top: 1px solid #51808a;
  border-left: 1px solid #51808a;
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