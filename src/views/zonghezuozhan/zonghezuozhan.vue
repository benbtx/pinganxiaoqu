<template>
  <article class="holo-wrap">
    <section class="holo-placehold">
      <!-- <passwaygis :usermapConfig='this.usermapConfig'></passwaygis> -->
      <baidu-map :showKaKouTool="false" mapStyle="midnight"  :p_isShowNavigation='false' :p_isShowScale='false'></baidu-map>
      <section class="swim-lf">
        <section class="lf-small bordered spark">
          <policepanel></policepanel>
        </section>
        <section class="lf-large bordered spark">
          <archivepanel ref="archivepanel" :archiveType="archiveType" :archiveProp="archiveData" :archivePerson="archivePerson"></archivepanel>
         
        </section>
      </section>
      

      <section class="layer-tool">
          <app-layer :showOpt='true'></app-layer>
      </section>

      <div class="holo-head">
        <img src="/static/image/shizhan/title.png" />
      </div>
      <!-- <div class='zhzz_pop'> <wzqy></wzqy></div> -->

      <section class="test-items" style="top:10px;right:0px;">
        <div class="head-wrap">
          <app-head />
        </div>
      </section>

      <div class="holo-cur">
        <div class="cur-left">
          <span class="cur-title">当前</span>
          <div class="cur-list">
            <p v-for="(item, i) in dqjqData" :key="i">
              <span class="cur-num">{{item.num}}</span>
              <span class="cur-text">{{item.desc}}</span>
            </p>
          </div>
        </div>
      </div>

      <section class="icon-describe">
        <ul>
          <li style=" right: 85px;position: absolute;" class="describe-item">
            <i class="icon-lishi" />
            <span>历史轨迹</span>
          </li>
          <li style=" right: 10px;position: absolute;" class="describe-item">
            <i class="icon-shishi" />
            <span>实时轨迹</span>
          </li>
        </ul>
      </section>

      <section class="test-items ctn-border ctn-hold spark" style="margin-top:150px;min-width:120px;right:20px;">
        <hisline @showlargeimg="showlargeimg" @startpiccrop="startpiccrop"></hisline>
      </section>

      <section class="swim-src-res" v-if="srcManShow">
        <p class="shut-ic" @click="shutManList">
          <i class="fa fa-times"></i>
        </p>
        <div class="src-div">
          <div class="src-item" v-for="(o,i) in srcManResults" :key="i">
            <searchmanitem :resid="i" :resdata="o" @selectpersonimage="handlePersonItemC"></searchmanitem>
          </div>
        </div>
      </section>
      <section class="swim-src-res dpzy" v-if="srcCarShow">
        <p class="shut-ic" @click="shutCarList">
          <i class="fa fa-times"></i>
        </p>
        <div class="search-group">
          <el-date-picker type="daterange" v-model="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:380px;border:1px solid #18768b;" value-format="yyyy-MM-dd" :picker-options="pickoption" />
          <div class="search-btn" @click="researchCarlist">
            重新搜索
          </div>
          <div style="justify-content: flex-end;display: flex;flex-grow: 1;margin-right: 10px;">
          <span style="line-height:36px">卡口位置：</span>
          <el-select v-model="srccarquyu" placeholder="请选择" @change="srccarquyuchange">
            <el-option v-for="item in srcResults.statistic" :key="item.code" :label="item.name" :value="item.code">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.num }}</span>
            </el-option>
          </el-select>
          </div>
        </div>
        <div class="src-div">
          <div class="src-item" v-for="(o,i) in srcResultsselect" :key="i">
            <searchcaritem :resid="i" :resdata="o" :reslydata="srcResults.origin" btnshow="true" @selectimage="handleItemC" @showlargeimg="showlargeimg" @startpiccrop="startpiccrop"></searchcaritem>
          </div>
        </div>
      </section>
      <div class="swim-btn" @click="releaseDistruct" v-if="instructId"></div>
      <releasepanel ref="releaseinfo" :releaseProps="releaseData" releasetype="td" @sendZl="submitzl"></releasepanel>
      <feedbackpanel ref="feedbackinfo" :feedbackProps="feedbackInfo"></feedbackpanel>
    </section>
    <!-- 图片处理部分 -->
    <el-dialog class="dpzy" width="90%" top="3vh" title="图片裁剪" :visible.sync="dialogpiccrop" :close-on-click-modal="false" center append-to-body v-dialogDrag>
      <div style="height:800px;">
        <piccrop ref="piccrop" :imgsrc="imgsrc" @searchpeople="searchbypersonpic" @searchcar="searchbycarpic"></piccrop>
      </div>
    </el-dialog>
    <div class="largeimg" v-if="dialogpiclarge">
      <span class="closespan" @click="dialogpiclarge=false">
        <i class="fa fa-close"></i>
      </span>
      <img :src="largeimg" style="width:100%;height:100%">
    </div>
  </article>
</template>

<script>
import '@/styles/passway-base64.module.styl';

import Vue from 'vue';
// import PasswayGis from '@/components/maps/PasswayGis';
import PolicePanel from '@/components/panels/PolicePanel';
import ArchivePanel from '@/components/panels/ArchivePanel';
import SearchManItem from '@/components/lists/SearchManItem';
import SearchCarItem from '@/components/lists/SearchCarItem';
import ReleasePanel from '@/components/panels/ReleasePanel';
import FeedBackPanel from '@/components/panels/FeedBackPanel';
import Hisline from '@/components/panels/Hisline';
import Wzqy from '@/components/panels/Wzqy';
import { passwayApi } from '@/https';
// import { policeApi } from '@/http';

import eventBus from '@/event';
import { eventCollection } from '@/event/resources';
import AppHead1 from '@/views/AppHead1';
//图片裁剪
import Piccrop from '@/components/public/Piccrop';
import { pictoolMixin } from '@/mixins/pictoolMixin';
//require('../../../static/pgis/js/PgisFunction.js');
//
import baidumap from '@/components/baidumap/zhzzMap';

import pGisDataLayer from '@/components/maps/pGisDataLayer';

export default {
  name: 'zonghezuozhan',
  components: {
    'app-head': AppHead1,
    // passwaygis: PasswayGis,
    policepanel: PolicePanel,
    archivepanel: ArchivePanel,
    searchmanitem: SearchManItem,
    searchcaritem: SearchCarItem,
    releasepanel: ReleasePanel,
    feedbackpanel: FeedBackPanel,
    hisline: Hisline,
     wzqy: Wzqy,
    piccrop: Piccrop,
     'baidu-map':baidumap,
     'app-layer': pGisDataLayer,
  },
  mixins: [pictoolMixin],
  data() {
    return {
      usermapConfig: {
         id:'passwayMap',
        showtools: {"qc":true,"tool":true},
        showlyManager: false,
        poiSearch: { show: true, style: 'right' },
        mapcolor: 'blue',
        Listener: null
      },

      srcManShow: false,
      srcCarShow: false,
      srcManResults: [],
      srcResults: {},
      srcResultsselect:[],//根据选择的车辆区域，显示的以图搜车结果数据
      srccarquyu:"",//选择的车辆区域，以图搜车
      archiveType: '',
      archiveData: {},
      archivePerson: {},
      releaseData: {},
      instructId: null,
      searchInfo: null,
      dxInfo: null,
      feedbackInfo: null,
      dqjqData: [], //当前警情分类统计
      daterange: [this.getnow(), this.getnow()], //车脸比对时间范围
      //限制日期选择范围
      pickoption: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e7;
        }
      },
      dialogpiclarge: false,
      dialogpiccrop: false,
    };
  },
  created() {
    // eventBus.$on(eventCollection.SEARCH_AUTOBY_IMG, imgUrl => {
    //   this.searchAutoByImg(imgUrl);
    // });
    eventBus.$on(eventCollection.SEARCH_MANBY_IMG, url => {
      this.comparePerson(url);
    });
    // eventBus.$on(eventCollection.PUSH_INSTRUCT_ID, para => {
    //   this.instructId = para.bksqbh;
    //   this.searchInfo = para.searchinfo;
    //   this.dxInfo = para.dxinfo;
    // }),
    //   eventBus.$on(eventCollection.PUSH_FEEDBACk_ID, feedback => {
    //     this.feedbackInfo = feedback;
    //     this.$refs.feedbackinfo.showThis();
    //   });
  },
  // //组件销毁前
  // beforeDestroy() {
  //   //关闭长连接
  //   this.stomp.disconnect();
  // },
  mounted() {
    this.$store.dispatch("ToggleFullScreen", 'yes');

    // if (window.history && window.history.pushState) {
    //   // history.pushState(null, null, document.URL);
    //   window.addEventListener('popstate', this.goBack, false);
    // }


    // this.getdqjqData();

    // function reloadJs(src) {
    //   var oHead = document.getElementsByTagName('HEAD').item(0);
    //   var oScript = document.createElement('script');
    //   oScript.type = 'text/javascript';
    //   oScript.src = src;
    //   oHead.appendChild(oScript);
    // }
    // function reloadCss(link) {
    //   var oHead = document.getElementsByTagName('HEAD').item(0);
    //   var oScript = document.createElement('link');
    //   oScript.type = 'text/css';
    //   oScript.rel = 'stylesheet';
    //   oScript.href = link;
    //   oHead.appendChild(oScript);
    // }
  },
  methods: {

    goBack(){
       this.$store.dispatch("ToggleFullScreen", 'no');
        // this.$router.replace({path: '/'});
        // //replace替换原路由，作用是避免回退死循环
    },


    // // 收到后端推送的警情消息显示提示
    // refreshdqjq(data) {
    //   this.dqjqData = JSON.parse(data.body);
    // },

    // //建立获取推送的警情的长连接
    // getnewjq() {
    //   let httpaddres = policeApi.sockpoliceAddress;
    //   let sock = new SockJS(httpaddres);
    //   this.stomp = Stomp.over(sock);
    //   this.stomp.connect('guest', 'guest', frame => {
    //     // this.stomp.subscribe("/topic/pd_warning_newest/", this.refreshjq); //2
    //     this.stomp.subscribe(
    //       '/topic/pd_warning_jqstatistics/',
    //       this.refreshdqjq
    //     ); //2
    //   });
    // },

    // getdqjqData() {
    //   let param = {};
    //   // param.xzqh = "";
    //   return policeApi
    //     .getCurjqData(param)
    //     .then(res => res.data)
    //     .then(data => {
    //       this.dqjqData = data;
    //       console.log(data);
    //     });
    // },
    // secRet() {
    //   this.$router.back();
    // },
    shutCarList() {
      this.srcCarShow = false;
    },
    shutManList() {
      this.srcManShow = false;
    },
    handleItemC(o, type) {
      this.$confirm('请确认选择的图片', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.archiveType = type;
          this.archiveData = o;
          Vue.set(this.archiveData, 'typejc', type);
        })
        .catch(() => {});
    },
    handlePersonItemC(o) {
      this.$confirm('请确认选择的图片', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.archivePerson = o;
          eventBus.$emit('tjsearchpepole', o.credentialsNum);
        })
        .catch(() => {});
    },
    comparePerson(urlBase64) {
      let param = {};
      param.listLibIds = 2;
      param.pageNo = 1;
      param.pageSize = 10;
      if (urlBase64.indexOf('http://') != -1) {
        // param.picUrl = urlBase64.replace('http://localhost:9528','http://221.237.152.153:9902');
        param.picUrl = urlBase64;
      } else {
        param.picBase64 = urlBase64;
      }

      return passwayApi.compareFace(param).then(response => {
        // loading.close();
        this.srcCarShow = false;
        if (!!response.data) {
          this.srcManShow = true;
          this.srcManResults = response.data.list;
        } else {
          this.$message('未搜索到数据');
          return;
        }
      });
    },
    searchAutoByImg(imgUrl){
       let param = Object.create(null);
      param.imageUrl = imgUrl;
      //   return passwayApi.queryAutoByImg(param).then(response => {
      //   if (response.data.tracks.length > 0) {
      //     Vue.set(this, 'srcCarShow', true);
      //     Vue.set(this, 'srcResults', response.data);
      //     Vue.set(this, 'srcResultsselect', response.data.tracks);          
      //     Vue.set(this, 'srccarquyu', response.data.statistic[0].code);
      //   } else {
      //     this.$message({
      //       message: '未搜索到匹配的对象',
      //       type: 'warning'
      //     });
      //   }
      // });
    },
    // // async searchAutoByImg(imgUrl) {
    // //   let param = Object.create(null);
    // //   param.imageUrl = imgUrl;
    // //   let _this = this;
    // //   try {
    // //     let response = await passwayApi.queryAutoByImg(param);
    // //     // loading.close();
    // //     if (response.data.tracks.length > 0) {
    // //       Vue.set(_this, 'srcCarShow', true);
    // //       Vue.set(_this, 'srcResults', response.data);
    // //       Vue.set(_this, 'srcResultsselect', response.data.tracks);          
    // //       Vue.set(_this, 'srccarquyu', response.data.statistic[0].code);
    // //     } else {
    // //       this.$message({
    // //         message: '未搜索到匹配的对象',
    // //         type: 'warning'
    // //       });
    // //     }
    // //   } catch (err) {
    // //     // loading.close();
    // //     this.$message({
    // //       message: err.message,
    // //       type: 'warning'
    // //     });
    // //   }
    // // },
    // //以图搜车，选择的车所在区域变化
    // srccarquyuchange(value){
    //   if(value!=this.srcResults.statistic[0].code)
    //   {
    //   this.srcResultsselect=this.srcResults.tracks.filter(item=>{
    //    return item.kkId.substring(0,4)==this.srccarquyu.substring(0,4);
    //   });
    //   }
    //   else{
    //     this.srcResultsselect=this.srcResults.tracks;
    //   }
    // },
    // pushDistructId(id) {
    //   this.instructId = id;
    // },
    // releaseDistruct() {
    //   if (!this.instructId) {
    //     return;
    //   }
    //   let param = {
    //     controloRequestId: this.instructId,
    //     controlName: this.searchInfo,
    //     personName: this.dxInfo.bbkrxm,
    //     personId: this.dxInfo.bbkrsfz,
    //     carNumber: this.dxInfo.bbkrcl,
    //     phoneNumber: this.dxInfo.bbkrsj,
    //     qq: this.dxInfo.bbkrqq,
    //     weixin: this.dxInfo.bbkrwx,
    //     mac: this.dxInfo.bbkrmac,
    //     personImage: this.dxInfo.rltzzp,
    //     carImage: this.dxInfo.cltzzp
    //   };
    //   return passwayApi.releaseDist(param).then(response => {
    //     this.releaseData = response.data;
    //     this.$nextTick(() => {
    //       this.$refs.releaseinfo.showThis();
    //     });
    //   });
    // },
    submitzl(zlcontent) {
      // return passwayApi.confirmRelease(zlcontent).then(response => {
      //   if (response.code == '200') {
      //     this.$refs.releaseinfo.hideThis();
      //     this.$message('发布成功');
      //   } else {
      //     this.$message({
      //       message: response.message,
      //       type: 'warning'
      //     });
      //   }
      // });
    },
    // //重新按日期做车脸比对
    // researchCarlist() {
    //   let param = {};
    //   param.imageUrl = this.srcResults.origin;
    //   param.startDate = this.daterange[0] + ' 00:00:00';
    //   param.endDate = this.daterange[1] + ' 23:59:59';
    //   return passwayApi
    //     .queryAutoByImg(param)
    //     .then(res => res.data)
    //     .then(data => {
    //       if (data.tracks.length > 0) {
    //         Vue.set(this, 'srcResults', data);
    //         Vue.set(this, 'srcResultsselect',data.tracks);  
    //         Vue.set(this, 'srccarquyu', data.statistic[0].code);
    //       } else {
    //         this.$message({
    //           message: '未搜索到匹配的对象',
    //           type: 'warning'
    //         });
    //       }
    //     });
    // },
    getnow() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let weekday = date.getDay();
      let curdate =
        year + '-' + this.prefixInteger(month) + '-' + this.prefixInteger(day);
      return curdate;
    },
    prefixInteger(num) {
      return ('0000000000000000' + num).substr(-2);
    },
    //以图搜车
    searchbycarpic(pic) {
      this.searchAutoByImg(pic);
      this.dialogpiccrop = false;
    },
    //人脸比对
    searchbypersonpic(pic) {
      this.comparePerson(pic);
      this.dialogpiccrop = false;
    },
  },
  beforeDestroy() {
    //  Console.log("离开");
       this.$store.dispatch("ToggleFullScreen", 'no')
    //  window.removeEventListener('popstate', this.goBack, false);

  },
  destroyed (){
      this.$store.dispatch("ToggleFullScreen", 'no')
  }


};
</script>


<style lang="stylus"  scoped>
.largeimg {
  position: absolute;
  z-index: 50000;
  top: 50px;
  left: 100px;
  right: 100px;
  bottom: 50px;
}

.closespan {
  position: absolute;
  right: 10px;
  top: 10px;
  color: #fff;
  font-size: 20px;
}

.holo-wrap {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  overflow: auto;
  // background: url(/static/image/public/bg.jpg);
  background-size: 100%;
  z-index: 12;
  box-sizing: border-box;
}

.holo-head {
  position: absolute;
  width: 100%;
  height: 105px;
  top: 0;
  left: 0;
  padding: 0 30px;
  text-align: center;
  line-height: 105px;
}

.holo-cur {
  position: absolute;
  width: 600px;
  height: 60px;
  top: 110px;
  left: 50%;
  margin-left: -300px;
  padding: 0 30px;
  text-align: center;
  line-height: 105px;
  background-color: rgba(4, 33, 53, 0.8);
  border-radius: 5px;
  display: none;
}

.holo-cur span {
  color: #fff;
  font-size: 25px;
}

.cur-left {
  width: 100%;
  height: 60px;
  /* float: left; */
  display: flex;
}

.cur-list {
  display: flex;
  width: 100%;
  height: 60px;
}

.cur-list p {
  list-style: none;
  display: flex;
  flex-direction: column;
  /* padding: 15px 0px; */
  width: 20%;
}

.cur-left .cur-title {
  line-height: 25px;
  display: inline-block;
  width: 5%;
  padding: 5px 20px 0 0;
  font-size: 18px;
  font-weight: bold;
  color: #2bc7ec;
}

.cur-left .cur-list {
  width: 95%;
}

.cur-num {
  height: 30px;
  line-height: 20px;
  padding-top: 8px;
}

.holo-cur .cur-text {
  line-height: 26px;
  font-size: 14px;
}

.icon-describe {
  position: absolute;
  top: 80px;
  right: 0px;
  width: 240px;
  height: 50px;
}

.icon-describe ul {
  list-style: none;
  display: flex;
}

.describe-item {
  list-style: none;
  width: 25%;
  height: 48px;
  text-align: center;
}

.describe-item i {
  width: 30px;
  height: 16px;
  display: block;
  margin: 4px auto;
}

.icon-lishi {
  /* background: url('/static/images/security/icon-youyujing.png'); */
  background-color: #5ad5e3;
  background-size: auto 100%;
  background-repeat: no-repeat;
  background-position: center;
}

.icon-shishi {
  /* background: url('/static/images/security/icon-youyujing.png'); */
  background-color: #fb7670;
  background-size: auto 100%;
  background-repeat: no-repeat;
  background-position: center;
}

.holo-wrap {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  overflow: auto;
  z-index: 12;
}

.holo-placehold {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  min-width: 1400px;
  min-height: 900px;
  color: #fff;

  .swim-lf {
    position: absolute;
    display: flex;
    flex-direction: column;
    width: 330px;
    top: 0;
    bottom: 0;
    left: 0;
    padding: 20px 0 20px 30px;
    z-index: 10;

    .lf-small {
      position: relative;
      display: flex;
      // flex: 150;
      height: 32%;
      padding: 3px;
      margin-bottom: 20px;
    }

    .lf-large {
      position: relative;
      display: flex;
      // flex: 320;
      padding: 3px;
      height: 64%;
      overflow: hidden;
    }

    .bordered {
      border-radius: 10px;
      border: 1px solid #51808a;
    }
  }
  .layer-tool{
    position: absolute;
    //display: flex;
    //padding-left: 20px;
    //flex-direction: column;
    // width: 364px;
    // bottom: 0;
    //top: 20px;
    //left: 410px;
   // color:red
  }

  .test-items {
    position: absolute; // display flex
    text-align: center right 20px top 20px;
  }

  .swim-src-res {
    position: absolute;
    top: 10px;
    right: 10px;
    bottom: 20px;
    left: 397px;
    padding: 20px 5px;
    z-index: 10000;
    background: RGB(6, 37, 58);
    border: 1px solid #346cad;

    &.seen {
      visibility: visible;
    }

    .src-div {
      display: flex;
      justify-content: space-around;
      align-items: flex-start;
      flex-wrap: wrap;
      overflow: auto;
      height: 94%;
    }

    .src-item {
      position: relative;
      display: flex;
      width: 362px;
      margin: 15px;
      cursor: pointer;
      min-height: 460px;
      box-shadow: #dfdbdb 0px 0px 8px;
    }

    .shut-ic {
      position: absolute;
      width: 36px;
      height: 36px;
      right: 0;
      top: 0;
      text-align: center;
      line-height: 36px;
      cursor: pointer;
      color: #fff;
      font-size: 16px;
    }
  }

  .swim-tprt {
    background: #06253d;
    position: absolute;
    width: 340px;
    height: 226px;
    display: flex;
    flex-direction: column;
    top: 64px;
    right: 30px;
    color: #82ceea;

    .color-prompt {
      height: 26px;
      line-height: 26px;
      display: flex;
      justify-content: space-between;

      .prompt-bl {
        position: relative;
        padding-left: 30px;

        .color-bl {
          position: absolute;
          width: 20px;
          height: 10px;
          left: 0;
          top: 8px;
        }
      }

      .prompt-bl:nth-of-type(1) {
        .color-bl {
          background: #78f75f;
        }
      }

      .prompt-bl:nth-of-type(2) {
        .color-bl {
          background: #ead64b;
        }
      }

      .prompt-bl:nth-of-type(3) {
        .color-bl {
          background: #fb7670;
        }
      }
    }

    .map-ele {
      height: 88px;
      margin-top: 14px;
      display: flex;

      .ele-item {
        width: 70px;
        padding-top: 52px;
        line-height: 36px;
        text-align: center;
        margin-left: -3px;
        cursor: pointer;
        background-position: center 0;
        background-repeat: no-repeat;
      }

      .ele-item:first-child {
        margin-left: 0;
      }
    }

    .map-eletool {
      height: 88px;
      margin-top: 14px;
      display: flex;

      .ele-item {
        width: 70px;
        padding-top: 52px;
        line-height: 36px;
        text-align: center;
        margin-left: -3px;
        cursor: pointer;
        background-position: center 0;
        background-repeat: no-repeat;
      }

      .ele-item:first-child {
        margin-left: 0;
      }
    }

    .map-ele.first {
      justify-content: space-between;
    }

    .map-ele.second {
      justify-content: flex-end;
    }
  }

  .swim-btn {
    position: absolute;
    width: 150px;
    height: 150px;
    display: flex;
    flex-direction: column;
    bottom: 40px;
    right: 30px;
    cursor: pointer;
    border-radius: 50%;
  }
}

.search-group {
  display: flex;
  flex: 1;
  align-items: center;
  padding: 0 60px;
  margin: 10px auto;
}

.search-btn {
  background: #3183f5;
  width: 80px;
  margin-left: 10px;
  height: 36px;
  line-height: 36px;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
}
.zhzz_pop{
   position:absolute;
   margin: 0 auto;
   left: 35%;
   top: 40%;
   width: 24%;
   display:none
  
}
</style>