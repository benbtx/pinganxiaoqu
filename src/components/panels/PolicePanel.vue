<template>
  <div class="ctn-hold">
    <div class="ctn-head">
      <!-- <span style="cursor:pointer" @click="listxclb()" :class="{active: isShowXclb}">协查列表/</span>
      <span style="cursor:pointer" @click="listjqlb()" :class="{active: isShowJqlb}">警情列表/</span>
      <span style="cursor:pointer" @click="listzzlb()" :class="{active: isShowZzlb}">作战列表</span> -->
      <span style="cursor:pointer" @click="listjqlb()" :class="{active: isShowJqlb}">事件通告</span>
    </div>
    <div  class="place-hold">
      <div class="src-bl">
        <input type="text" v-model="searchStr" placeholder="输入搜索内容" @keyup.enter="searchEnterFun"/>
        <span @click="addAction" class="add-action" :class="{'show-add': isShowJqlb}">+</span>
      </div>
      <ul class="p-ls" id="xclb" v-show="isShowXclb">
        <li v-for="(o, i) in policelist" :key="i" @click="setDetExp(o)" :class="{active: o.sn == isActive}">
          <p class="{ic-con:o.bjlb==010000,ic-con:o.bjlb==020000,ic-con:o.bjlb==030000,ic-con:o.bjlb==040000,ic-con:o.bjlb==050000,ic-con:o.bjlb==090000}"></p>
          <div class="text-con">
            <p class="main">{{o.title}}</p>
            <p class="vice">{{o.time}}</p>
          </div>
        </li>
      </ul> 
      <ul class="p-ls" id="jqlb" v-show="isShowJqlb">
        <li v-for="(item, i) in jqlist" :key="i" @click="setDetJq(item)" :class="{active: item.id == isActive}">
          <p class="ic-con qita" :class="{
            'icon-ms': item.eventType=='民生',
            'icon-xf': item.eventType=='消防',
            'icon-za': item.eventType=='治安',
            'icon-jf': item.eventType=='纠纷',
            'icon-sf': item.eventType=='上访',
            'icon-sw': item.eventType=='涉稳',
            'icon-sd': item.eventType=='涉毒',
            }"></p>
          <div class="text-con">
            <span class="main" :title="item.eventTheme">{{item.eventTheme}}</span>
            <span class="vice">{{getFormatDateYear(item.eventDate)}}</span>
          </div>
        </li>
        <div style="text-align:center;">
            <a href="#" v-if="policespan.showamore" @click="getmorejq" class="amore">加载更多......</a>
            <span v-else>{{policespan.spancontent}}</span>
        </div>
      </ul>
      <ul class="p-ls" id="zzlb" v-show="isShowZzlb">
        <li v-for="(o, i) in zzlist" :key="i" @click="setDetZz(o)" :class="{active: o.sn == isActive}">
          <p class="ic-con"></p>
          <div class="text-con">
            <p class="main">{{o.title}}</p>
            <p class="vice">{{o.time}}</p>
          </div>
        </li>
      </ul>
    </div>

    <section class="swim-release" v-show="addaction">
      <div class="bordered spark">
        <div class="ctn-hold">
          <p class="release-tit ctn-head">新建作战任务<span style="cursor:pointer;position: absolute;top: 6px;right: 6px;" class="fa fa-times-circle fa-lg" @click="hideAction"></span></p>
          <div class="release-con">
            <div class="group-input">
              <label class="title">名称：</label> 
              <div class="cus-content cus-input">
                <el-input v-model="zzrwData.zzmc" class="dpzy" placeholder="请输入名称"></el-input>
              </div>
            </div>
            <div class="group-input">
              <label class="title">编号：</label> 
              <div class="cus-content">
                <p class="entry value">{{zzrwData.zzbh}}</p>
              </div>
            </div>
            <div class="group-input">
              <label class="title">日期：</label> 
              <div class="cus-content">
                <p class="entry value">{{zzrwData.fbrq}}</p>
              </div>
            </div>
            <div class="group-input">
              <label class="title">详情：</label> 
              <div class="cus-content cus-textarea">
                <textarea rows="3" v-model="zzrwData.zzxx"></textarea>
              </div>
            </div>
          </div>
          <div class="btn-con">
            <p class="release-btn btnys" @click="confirmAction">保存</p>
            <p class="release-btn btnys" @click="hideAction">取消</p>
          </div>
        </div>
      </div>
    </section>

    <div class="p-det-swim spark" v-if="policedet">
      <div class="ctn-hold">
        <div class="ctn-head"><span>协查详情</span><span style="cursor:pointer;position: absolute;right: 0px; width: 20px;height: 20px;background: #06253d;text-align: center;line-height: 20px;" @click="policedet=null;isActive=null">✖</span></div>
        <div class="place-hold">
          <p class="det-main">{{policedet.title}}</p>
          <p class="para-normal key">协查单号：</p>
          <p class="para-normal value">{{policedet.sn}}</p>
          <p class="para-normal key">案件类型：</p>
          <p class="para-normal value">{{policedet.type}}</p>
          <p class="para-normal key">案发地点：</p>
          <p class="para-normal value">{{policedet.location}}</p>
          <p class="para-normal key">协查单位：</p>
          <p class="para-normal value">{{policedet.srcDepartment}}</p>
          <p class="para-normal key">发布时间：</p>
          <p class="para-normal value">{{policedet.time}}</p>
          <p class="para-normal key">警情描述：</p>
          <p class="para-normal value">{{policedet.description}}</p>
        </div>
      </div>
    </div>

    <div class="p-det-swim spark" v-if="jqdetail">
      <div class="ctn-hold">
        <div class="ctn-head"><span>事件详情</span><span style="cursor:pointer;position: absolute;right: 0px; width: 20px;height: 20px;background: #06253d;text-align: center;line-height: 20px;" @click="jqdetail=null;isActive=null">✖</span></div>
        <div class="place-hold">
          <p class="det-main">{{jqdetail.eventTheme}}</p>
          <p class="para-normal key">事件类型：</p>
          <p class="para-normal value">{{jqdetail.eventType}}</p>
          <p class="para-normal key">事发地址：</p>
          <p class="para-normal value">{{jqdetail.eventAddr}}</p>
          <p class="para-normal key">事发时间：</p>
          <p class="para-normal value">{{getFormatDate(jqdetail.eventDate)}}</p>
          <p class="para-normal key">上报者：</p>
          <p class="para-normal value">{{jqdetail.eventReporter}}</p>
          <p class="para-normal key">联系方式：</p>
          <p class="para-normal value">{{jqdetail.eventReporterPhoneNumber}}</p>
          <p class="para-normal key">事件描述：</p>
          <p class="para-normal value">{{jqdetail.eventDes}}</p>
        </div>
      </div>
    </div>

    <div class="p-det-swim spark" v-if="zzdetail">
      <div class="ctn-hold">
        <div class="ctn-head"><span>作战详情</span><span style="cursor:pointer;position: absolute;right: 0px; width: 20px;height: 20px;background: #06253d;text-align: center;line-height: 20px;" @click="policedet=null;isActive=null">✖</span></div>
        <div class="place-hold">
          <p class="det-main">{{zzdetail.title}}</p>
          <p class="para-normal key">作战单号：</p>
          <p class="para-normal value">{{zzdetail.sn}}</p>
          <p class="para-normal key">案件类型：</p>
          <p class="para-normal value">{{zzdetail.type}}</p>
          <p class="para-normal key">案发地点：</p>
          <p class="para-normal value">{{zzdetail.location}}</p>
          <p class="para-normal key">作战单位：</p>
          <p class="para-normal value">{{zzdetail.srcDepartment}}</p>
          <p class="para-normal key">发布时间：</p>
          <p class="para-normal value">{{zzdetail.time}}</p>
          <p class="para-normal key">作战描述：</p>
          <p class="para-normal value">{{zzdetail.description}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import $ from 'jquery';
// import { passwayApi } from "@/http";
import {excontrolApi} from '@/https'
// import SockJS from "sockjs-client";
// import Stomp from "stompjs";
// import eventBus from '@/event';
export default {
  name: 'PolicePanel',
  data () {
    return {
      policelist: null, //协查列表
      jqlist: [{
        bjlb: '010000',
        jqbh: '000001',
        jqms: '315富临小区盗窃事件',
        ajsj: '2018-03-15'
      },{
        bjlb: '030000',
        jqbh: '000002',
        jqms: '富临路发生多车碰撞',
        ajsj: '2018-05-05'
      },{
        bjlb: '020000',
        jqbh: '000003',
        jqms: '富临小区电话诈骗事件',
        ajsj: '2018-06-11'
      },{
        bjlb: '040000',
        jqbh: '000004',
        jqms: '北苑小区火灾',
        ajsj: '2018-07-23'
      },{
        bjlb: '050000',
        jqbh: '000005',
        jqms: '9.18车辆被盗事件',
        ajsj: '2018-09-19'
      },{
        bjlb: '010000',
        jqbh: '000006',
        jqms: '宏远小区小孩丢失事件',
        ajsj: '2018-11-11'
      },], //警情列表
      policespan: {
        showamore: true,
        spancontent: "当前没有警情数据"
      }, //警情列表显示加载更多或其他提示
      jqpageNum: 1, //当前页数
      jqpageSize: "5", //一次显示的条数
      jqliactive: "", //警情li 选中
      zzlist: null, //作战列表
      policedet: null, //协查详情
      jqdetail: null,
      jqdetailData: {
        title: '罗浮山温泉度假区车辆被盗',
        phone: '13512323332',
        bjr: '张丽丽',
        time: '2019-01-22 12:23:22',
        bjlb: '治安事件',
        ssfj: '绵阳市安州区罗浮山分局',
        address: '绵阳市安州区桑枣镇罗浮山温泉度假区',
        bjnr: '罗浮山温泉度假区川A12232车辆被盗'
      }, //警情详情
      zzdetail: null, //作战详情
      isShowXclb: false,
      isShowJqlb: true,
      isShowZzlb: false,
      isActive: null, //选择详细的项
      searchStr: '',
      addaction: false,
      zzrwData: {
        zzmc: '',
        zzbh: '',
        fbrq: '',
        zzxx: ''
      }
    }
  },
  computed: {
    ruleDetail() {
      let detailString = this.jqdetail.bjnr;
      if (!detailString) {
        return '';
      }

      if (detailString) {
        let telReg = /(^[^>|\d]((13[0-9])|(14[5,7,9])|(15[4])|(18[0-9])|(17[0,1,3,5,6,7,8]))\d{8})/g;
        let sfzhmReg = /([1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx])|([1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx])/g;
        let cpReg = /([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})/g;
      
        // 高亮替换v-html值
        detailString = detailString.replace(sfzhmReg, '<span style="text-decoration: underline;cursor: pointer;color: #fff500;">$&</span>');
        detailString = detailString.replace(telReg, '<span style="text-decoration: underline;cursor: pointer;color: #fff500;">$&</span>');
        detailString = detailString.replace(cpReg, '<span style="text-decoration: underline;cursor: pointer;color: #fff500;">$&</span>');
      }

      return detailString;
    }
  },
  methods: {
  //   //建立获取推送的警情的长连接
  //   getnewjq() {
  //     let httpaddres = policeApi.sockpoliceAddress;
  //     let sock = new SockJS(httpaddres);
  //     this.stomp = Stomp.over(sock);
  //     this.stomp.connect("guest", "guest", frame => {
  //       this.stomp.subscribe("/topic/pd_warning_newest_xs/", this.refreshjq); //2
  //     });
  //   },
  //   //收到后端推送的警情消息显示提示
  //   refreshjq(data) {
  //     if (!!data.body) {
  //       // let newqj = JSON.parse(data.body);
  //       // this.$message("发现新的警情：" + newqj[0].jqms);
  //     }
  //     if(this.isShowJqlb==true)
  //     {
  //       this.getJqData();
  //     }
  //   },
  //   setDetExp (o) {
  //     this.getXcDetail(o.sn);
  //     this.isActive = o.sn;
  //   },
    setDetJq (o) {
      // this.getJqDetail(o.jqbh);
      this.isActive = o.id;
      this.jqdetail = o;
    },
  //   setDetZz (o) {
  //     this.getZzDetail(o.sn);
  //     this.isActive = o.sn;
  //   },
  //   listxclb() {
  //     this.isShowXclb = true;
  //     this.isShowJqlb = false;
  //     this.isShowZzlb = false;
  //     this.policedet = null;
  //     this.isActive = null;
  //   },
  //   listjqlb() {
  //     this.getJqData();
  //     this.isShowXclb = false;
  //     this.isShowJqlb = true;
  //     this.isShowZzlb = false;
  //     this.jqdetail = null;
  //     this.isActive = null;
  //   },
  //   listzzlb() {
  //     this.isShowXclb = false;
  //     this.isShowJqlb = false;
  //     this.isShowZzlb = true;
  //     this.zzdetail = null;
  //     this.isActive = null;
  //   },
  //   getXcData() {
  //     let param = new FormData();
  //     param.append("request", this.searchStr);

  //     return passwayApi
  //       .getXclbData(param)
  //       .then(res => res.data)
  //       .then(data => {
  //         this.policelist = data;
  //       })
  //   },
    getPoliceEvents(){
      let param = {};
      param.pageNum = 1;
      param.pageSize = 10;
      return excontrolApi
        .getPoliceEvents(param)
        .then(res => res.data)
        .then(data => {
          this.jqlist = data.rows;
        });

    },
    //获取更多警情
    getmorejq() {
      this.jqpageNum += 1;
      let param = {};
      param.pageNum = this.jqpageNum;
      param.pageSize = this.jqpageSize;
      // param.query = this.searchStr;

      return excontrolApi
        .getPoliceEvents(param)
        .then(res => res.data)
        .then(data => {
          if (data.rows.length > 0) {
            this.policespan.showamore = true;
            this.jqlist = this.jqlist.concat(data.rows);
          } else {
            this.policespan.showamore = false;
            this.policespan.spancontent = "没有更多数据了";
          }
        })
    },

  //   getZzData() {
  //     let param = new FormData();
  //     param.append("request", this.searchStr);

  //     return passwayApi
  //       .getXclbData(param)
  //       .then(res => res.data)
  //       .then(data => {
  //         this.policelist = data;
  //       })
  //   },
  //   getXcDetail(sn) {
  //     let param = new FormData();
  //     param.append("sn", sn);

  //     return passwayApi
  //       .getXclbDetail(param)
  //       .then(res => res.data)
  //       .then(data => {
  //         this.policedet = data;
  //       })
  //   },
    getJqDetail(sn) {
      // let param = new FormData();
      // param.append("jqbh", sn);
      let param = {};
      param.jqbh = sn;

      return policeApi
        .getPolicedetailApil(param)
        .then(res => res.data)
        .then(data => {
          if (!!data) {
            this.jqdetail = data;
          } else {
            this.$message({
              message: "获取警情详情失败",
              type: "warning"
            });
          }
        })

    },
  //   getZzDetail(sn) {
  //     let param = new FormData();
  //     param.append("sn", sn);

  //     return passwayApi
  //       .getXclbDetail(param)
  //       .then(res => res.data)
  //       .then(data => {
  //         this.policedet = data;
  //       })

  //   },
  //   searchEnterFun:function(e){
  //     var keyCode = window.event? e.keyCode:e.which;
  //     if(keyCode == 13 && this.searchStr){
  //       if (this.isShowXclb) {
  //          this.getXcData();
  //       } else if (this.isShowJqlb) {
  //          this.getJqData();
  //       } else if (this.isShowZzlb) {
  //          this.getZzData();
  //       }
  //     }
  //   },
    addAction() {
      this.addaction = true;
      let _this = this;
      //组件传值
      // return passwayApi
      //   .getCombatSn({})
      //   .then(res => res.data)
      //   .then(data => {  
      //     _this.zzrwData.zzbh = data.sn;
      //     _this.zzrwData.fbrq = data.time;
      //   })
    },
    hideAction() {
      this.addaction = false;      
    },
    confirmAction() {
      //保存作战任务
    },
    toSearch(event) {
      if (event.target.nodeName === 'SPAN') {
        let str = event.target.innerText;

        eventBus.$emit('tjsearchpepole', str);
      }
    },
  },
  mounted() {
    // this.getXcData();
    this.getPoliceEvents();
    // this.listjqlb();
    // this.getnewjq();
  }
}
</script>

<style lang="stylus" scoped>
.ctn-hold {
  display: flex;
  flex: 1;
  flex-direction: column;
  border-radius: 10px;
  background: #06253d;
  padding: 28px 15px 10px;
  box-shadow: 0 0 12px 2px RGBa(135, 185, 255, 0.3) inset, 0 0 6px 0 RGBa(135, 185, 255, 0.3);
  height: auto;
}

.ctn-head {
  display: block;
}
.ctn-head .active {
  font-weight: bold;
  // color: #82c1ea;
}
.place-hold {
  display: flex;
  flex: 1;
  min-height: 200px
  flex-direction: column;

  .det-main {
    line-height: 36px;
    margin-top: 10px;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
  }

  .para-normal {
    line-height 28px
  }
  .key {
    // color: #b1cae1
  }
  .value {
    color: #fff
  }

  .src-bl {
    display: flex;
    height: 34px;
    line-height: 32px;
    min-height: 34px;
    margin: 12px 0;
    border-radius: 2px;
    border: 1px solid #51808a;

    input[type=text] {
      flex: 1;
      padding-left: 6px;
      background: none;
      border: none;
    }
  }

  .add-action {
    display: none;
    width: 32px;
    height: 32px;
    line-height: 32px;
    font-size: 40px;
    background: #8ac4df;
    color: #06253b;
    text-align: center;
    cursor: pointer;
  }

  .show-add {
    display: block;
  }

  ul.p-ls {
    flex: 1;
    padding: 0;
    overflow: auto;

    li {
      display: flex;
      line-height: 24px;
      cursor pointer
      padding: 8px 5px

      .ic-con {
        width: 46px;
        height: 46px;
        line-height: 46px;
        text-align: center;
        font-weight:bold;
        border-radius: 2px;
        font-size: 14px;
        font-family: "Microsoft YaHei Bold", "Microsoft YaHei Regular", "Microsoft YaHei";
        letter-spacing: 2px;
        margin-right: 4px;
        overflow: hidden;
      }

      .ic-con:after {
        content: "\f0f6";
        width: 46px;
        height: 46px;
        display: block;
        line-height: 46px;
      }
      .qita:after {
        content: "其他";
        background: #56c4fc;
      }
      .icon-ms:after {
        content: '民生';
        background: #00CC99;
      }
      .icon-xf:after {
        content: '消防';
        background: #FF6666;
      }
      .icon-za:after {
        content: '治安';
        background: #FF9933;
      }
      .icon-jf:after {
        content: '纠纷';
        background: #FFCC00;
      }
      .icon-sf:after {
        content: '上访';
        background: #12B1E1;
      }
      .icon-sd:after {
        content: '涉毒';
        background: #9999FF;
      }
      .icon-sw:after {
        content: '涉稳';
        background: #6666ff;
      }

      .text-con {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .main {
          font-size: 14px;
          line-height: 20px;
          // color: #82c1ea;
        }

        .vice {
          line-height: 18px;
          font-size: 12px;
          color: #b1cae1;
        }
      }
    }
    .active {
      margin-right: 8px;
      border: 1px solid #23a5b6;
      box-shadow: 0 0 5px #23a5b6, 0 0 5px #23a5b6 inset;
    }
  }
}

.p-det-swim {
  position: absolute;
  width: 308px;
  display: flex;
  top: 0;
  right: -318px;
  border-radius: 10px;
  z-index: 110;
  border: 1px solid #51808a;
  &showing {
    display flex
  }
}
.swim-release {
  position: fixed;
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 368px;
  left: 50%;
  top: 50%;
  margin-left: -200px;
  margin-top: -210px;
  padding: 0px;
}

.bordered {
  border-radius: 10px;
  border: 1px solid #51808a;
}
.group-input {
  line-height: 34px;
  padding: 5px 0;
}
.group-input .title {
  vertical-align: top;
  width: 60px;
}
.release-con .group-input label {
  color: #dcfffe;
}
.cus-content {
  display: inline-block;
  width: 80%;
}
.cus-input {
  border: 1px solid #18768b;
} 
.cus-textarea {
  width: 80%;
  height: 60px;
}
.cus-textarea textarea {
  display: inline-block;
  width:100%;
  min-height:100%;
  resize: none;
  background: none transparent;
  border: 1px solid #18768b;
  padding: 0 15px;
}
.cus-textarea textarea:focus {
  outline:none;
}
.swim-release .btn-con {
  display: flex;
}
.amore {
  color: #fff;
}
.liactive {
  border: 1px solid #0ee6ec99;
  box-shadow: 0 0 8px 2px RGBa(135, 185, 255, 0.3),
    0 0 8px 2px RGBa(135, 185, 255, 0.3) inset;
}
</style>