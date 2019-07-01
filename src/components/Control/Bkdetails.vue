<template>
  <div style="margin:20px">
    <div style="text-align:center">
      <p class="header">布控申请单 <span style="float:right;font-size:14px;font-weight:normal;color: #12b1e1;cursor:pointer;"><i class="fa fa-print fa-lg"></i> 打印</span></p>
      <div style="height: 40px;line-height: 40px;padding:10px">
        <span style="float:left">布控日期：
          <span class="spantext">{{bkrq}}</span>
        </span>
        <span style="float:right">布控单位：
          <span class="spantext">{{bkdetaildata.bkdw}}</span>
        </span>
      </div>
      <div style="clear:both"></div>
    </div>
    <div class="model-hold">
      <div class="leftdec dadec">
        <span class="vcenter">基本信息</span>
      </div>
      <div class="rightdec">
        <div class="row divrow" v-if="addtype== 'che'">
            <div class="col-md-12">
                <span class="spandec">布控编号：
                    <span class="spantext">{{bkdetaildata.bkbh}}</span>
                </span>
            </div>
        </div>
        <div class="row divrow" v-if="addtype== 'ry'">
            <div class="col-md-12">
                <span class="spandec">布控名称：
                    <span class="spantext">{{bkdetaildata.bkmc}}</span>
                </span>
            </div>
        </div>
        <div class="row divrow">
            <div class="col-md-12">
                <span class="spandec">布控发起人：
                    <span class="spantext">{{bkdetaildata.bkfqr}}</span>
                </span>
            </div>
        </div>
        <div class="row divrow">
            <div class="col-md-12">
                <span class="spandec">布控时间：
                    <span class="spantext">{{bkdetaildata.ckedbksjrange[0]}} 至 {{bkdetaildata.ckedbksjrange[1]}}</span>
                </span>
            </div>
        </div>
        <div class="row divrow" v-if="addtype=='ry'">
            <div class="col-md-12">
                <span class="spandec">阈值：
                    <span class="spantext" style="margin-right:10px;" v-for="item in bkdetaildata.bkyz" :key="item.id">{{item.thresholdMin}} {{item.startPeriod}}-{{item.endPeriod}}</span>
                </span>
            </div>
        </div>
        <div class="row divrow">
            <div class="col-md-12">
                <span class="spandec">布控原因：
                    <span class="spantext" v-if="addtype=='ry'">{{bkdetaildata.bkyy}}</span>
                    <span class="spantext" v-else>{{bkdetaildata.bkyyText}}</span>
                </span>
            </div>
        </div>
      </div>
    </div>
    <div class="model-hold">
      <div class="leftdec bkszdec">
        <span class="vcenter">布控对象</span>
      </div>
      <div class="rightdec">
        <div style="width:100%;overflow:hidden;" v-show="addtype=='ry'">
            <el-form  ref="bkdetaildata" label-width="84px" :inline="true" style="width:calc(100% - 120px);float:left;">
                <div class="row divrow">
                    <div class="col-md-12">
                        <span class="spandec">布控类型：
                        <span class="spantext">人员</span>
                        </span>
                    </div>
                </div>
                <div class="row divrow">
                    <div class="col-md-12">
                        <span class="spandec">姓名：
                        <span class="spantext">{{bkdetaildata.bkxm}}</span>
                        </span>
                    </div>
                </div>
                <div class="row divrow" v-if="addtype=='ry'">
                    <div class="col-md-12">
                        <span class="spandec">证件类型：
                        <span class="spantext">{{bkdetaildata.bkzjlx==2 ? '警官证' : bkdetaildata.bkzjlx==1 ? '身份证' : '未知'}}</span>
                        </span>
                    </div>
                </div>
                 <div class="row divrow" v-if="addtype=='ry'">
                    <div class="col-md-12">
                        <span class="spandec">证件号：
                        <span class="spantext">{{bkdetaildata.bkzjh}}</span>
                        </span>
                    </div>
                </div>
                <div class="row divrow" v-if="addtype=='che'">
                    <div class="col-md-12">
                        <span class="spandec">身份证：
                        <span class="spantext">{{bkdetaildata.bksfz}}</span>
                        </span>
                    </div>
                </div>
                <div class="row divrow">
                    <div class="col-md-12">
                        <span class="spandec">电话：
                        <span class="spantext">{{bkdetaildata.bkdh}}</span>
                        </span>
                    </div>
                </div>
                <div class="row divrow">
                    <div class="col-md-12">
                        <span class="spandec">户籍地：
                        <span class="spantext">{{bkdetaildata.bkhjd}}</span>
                        </span>
                    </div>
                </div>
            </el-form> 
            <div class="picture-hold">
                <div class="pic-wrap">
                    <img :src="imgUrl" />
                </div>
            </div>
        </div>
        <div style="width:100%;overflow:hidden;" v-show="addtype=='che'">
            <el-form ref="bkdetailsdata" label-width="84px" :inline="true" style="width:calc(100% - 120px);float:left;">
                <div class="row divrow">
                    <div class="col-md-12">
                        <span class="spandec">布控类型：
                        <span class="spantext">车辆</span>
                        </span>
                    </div>
                </div>
                <div class="row divrow">
                    <div class="col-md-12">
                        <span class="spandec">车牌：
                        <span class="spantext">{{bkdetaildata.bkcl}}</span>
                        </span>
                    </div>
                </div>
                <div class="row divrow">
                    <div class="col-md-12">
                        <span class="spandec">车牌颜色：
                        <span class="spantext">{{bkdetaildata.cpysText}}</span>
                        </span>
                    </div>
                </div>
                <div class="row divrow">
                    <div class="col-md-12">
                        <span class="spandec">车型：
                        <span class="spantext">{{bkdetaildata.bkcx}}</span>
                        </span>
                    </div>
                </div>
                <div class="row divrow">
                    <div class="col-md-12">
                        <span class="spandec">车辆颜色：
                        <span class="spantext">{{bkdetaildata.clysText}}</span>
                        </span>
                    </div>
                </div>
            </el-form> 
            <div class="picture-hold">
                <div class="pic-wrap">
                    <img :src="imgUrl" />
                </div>
            </div>
        </div>
      </div>
    </div>
    <div class="model-hold">
      <div class="leftdec sqdec">
         <span class="vcenter">布控范围</span>
      </div>
      <div class="rightdec row divrow">
        <span class="col-xs-6" style="padding: 0 5px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;cursor: default;" v-for="item in selectedKakou" :key="item.id" :title="item">
            <span class="spantext">{{item}}</span>
        </span>
      </div>
    </div>
    <div class="model-hold">
      <div class="leftdec bjspdec">
        <span class="vcenter">本级审批</span>
      </div>
      <div class="rightdec">
        <div class="row divrow">
            <el-select v-if="!bkdetaildata.viewDetails" v-model="localName" clearable placeholder="请选择" @change="getLocalName" value-key="userCode">
                <el-option
                    v-for="item in localList"
                    :key="item.userCode"
                    :label="item.userName"
                    :value="item">
                </el-option>
            </el-select>
            <span v-else>
                {{bkdetaildata.sprlb[0].userName}}{{bkdetaildata.zt=='01'? '未处理':bkdetaildata.zt=='02'? '同意': '不同意'}}审批申请
            </span>
        </div>
      </div>
    </div>
    <div class="model-hold">
      <div class="leftdec sjspdec">
        <span class="vcenter">上级审批</span>
      </div>
      <div class="rightdec">
        <div class="row divrow">
            <!-- <el-select v-if="!bkdetaildata.viewDetails" v-model="localName" clearable placeholder="请选择" @change="getLocalName" value-key="userCode">
                <el-option
                    v-for="item in localList"
                    :key="item.userCode"
                    :label="item.userName"
                    :value="item">
                </el-option>
            </el-select>
            <span v-else>
                
            </span> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { excontrolApi } from "@/https";
import eventBus from '@/event';
import { eventCollection } from '@/event/resources';

export default {
    name: "Bkdetails",
    props: ["bkdetaildata","addtype","imgUrl","selectedKakou"],
    data() {
        return {
            // fjlist: [],
            plfile: {},
            // bkrq: "",
            // bkdx: {
            //   bbkrsfz: "",
            //   bbkrcl: "",
            //   bbkrsj: "",
            //   bbkrqq: "",
            //   bbkrxm: "",
            //   bbkrwx: "",
            //   rltzzp: "",
            //   cltzzp: "",
            //   jsfs: "",
            //   jstj: ""
            // }
            localList: [],
            localName: this.bkdetaildata.sprlb
        };
    },
    // watch: {
    //   bkdetaildata: {
    //     //注意：当观察的数据为对象或数组时，curVal和oldVal是相等的，因为这两个形参指向的是同一个数据对象
    //     handler(curVal, oldVal) {
    //       if (!!this.bkdetaildata.bkdx) {
    //         this.bkdx = this.bkdetaildata.bkdx[0];
    //       }
    //       //未批量布控时
    //       if (this.bkdetaildata.sfplbk == "0") {
    //         this.fjlist = this.bkdetaildata.fj;
    //       }
    //       if (this.bkdetaildata.sfplbk == "1") {
    //         //批量布控时
    //         let fjarr = [];
    //         for (let i = 0; i < this.bkdetaildata.fj.length; i++) {
    //           if (this.bkdetaildata.fj[i].group == "fjfile") {
    //             fjarr.push(this.bkdetaildata.fj[i]);
    //           } else if (this.bkdetaildata.fj[i].group == "plfile") {
    //             this.plfile = this.bkdetaildata.fj[i];
    //           }
    //         }
    //         this.fjlist = fjarr;
    //       }
    //       if (!!this.bkdetaildata.bksqrq) {
    //         this.bkrq = this.bkdetaildata.bksqrq;
    //       } else {
    //         let mydate = new Date();
    //         let year = mydate.getFullYear();
    //         let month = mydate.getMonth();
    //         let day = mydate.getDate();
    //         let formatdate = year + "-" + month + "-" + day;
    //         this.bkrq = formatdate;
    //       }
    //     },
    //     deep: true
    //   }
    // },
    computed: {
        bkdx: function() {
            let bkdxobj = {
                bbkrsfz: "",
                bbkrcl: "",
                bbkrsj: "",
                bbkrqq: "",
                bbkrxm: "",
                bbkrwx: "",
                rltzzp: "",
                cltzzp: "",
                jsfs: "",
                jstj: ""
            };
            if (!!this.bkdetaildata.bkdx) {
                bkdxobj = this.bkdetaildata.bkdx[0];
            }
            return bkdxobj;
        },
        bkrylb: function() {
            let bkrylbarr = [];
            if (!!this.bkdetaildata.rylb) {
                let rylb = this.bkdetaildata.rylb;
                let rylbarr = rylb.split(",");
                for (let i = 0; i < rylbarr.length; i++) {
                    for (let j = 0; j < this.basicdic.bklbdata.length; j++) {
                        if (rylbarr[i] == this.basicdic.bklbdata[j].value) {
                            bkrylbarr.push(this.basicdic.bklbdata[j].text);
                        }
                    }
                }
            }
            return bkrylbarr.join("，");
        },
        bkjb: function() {
            let bkjbtext = "";
            if (!!this.bkdetaildata.bkjb) {
                for (let i = 0; i < this.basicdic.bkjbdata.length; i++) {
                    if (
                        this.bkdetaildata.bkjb ==
                        this.basicdic.bkjbdata[i].value
                    ) {
                        bkjbtext = this.basicdic.bkjbdata[i].text;
                    }
                }
            }
            return bkjbtext;
        },
        czcs: function() {
            let czcstext = "";
            if (!!this.bkdetaildata.czcs) {
                for (let i = 0; i < this.basicdic.czcsdata.length; i++) {
                    if (
                        this.bkdetaildata.czcs ==
                        this.basicdic.czcsdata[i].value
                    ) {
                        czcstext = this.basicdic.czcsdata[i].text;
                    }
                }
            }
            return czcstext;
        },
        yjgz: function() {
            let yjgztext = "";
            if (!!this.bkdetaildata.yjgz) {
                for (let i = 0; i < this.basicdic.yjgzdata.length; i++) {
                    if (
                        this.bkdetaildata.yjgz ==
                        this.basicdic.yjgzdata[i].value
                    ) {
                        yjgztext = this.basicdic.yjgzdata[i].text;
                    }
                }
            }
            return yjgztext;
        },
        sfdxtz: function() {
            let sfdxtzcontent = "";
            if (this.bkdetaildata.sfdxtz == "0") {
                sfdxtzcontent = "否";
                return sfdxtzcontent;
            } else if (this.bkdetaildata.sfdxtz == "1") {
                sfdxtzcontent = "是";
                sfdxtzcontent +=
                    "  （短信提示电话：" + this.bkdetaildata.yddxtssjh + "）";
                return sfdxtzcontent;
            }
        },
        fjlist: function() {
            //未批量布控时
            if (this.bkdetaildata.sfplbk == "0") {
                let fjarr=[];
                if(!!this.bkdetaildata.fj)
                {
                  fjarr=JSON.parse(this.bkdetaildata.fj);
                }
                return fjarr;
            } else if (this.bkdetaildata.sfplbk == "1") {
                //批量布控时
                 if(!!this.bkdetaildata.fj)
                {
                let fjarr = [];
                let fjlistarr=JSON.parse(this.bkdetaildata.fj);
                for (let i = 0; i < fjlistarr.length; i++) {
                    if (fjlistarr[i].group == "fjfile") {
                        fjarr.push(fjlistarr[i]);
                    } else if (fjlistarr[i].group == "plfile") {
                        this.plfile = fjlistarr[i];
                    }
                }
                return fjarr;
                }
            }
        },
        bkrq: function() {
            if (!!this.bkdetaildata.bksqrq) {
                return this.bkdetaildata.bksqrq;
            } else {
                let mydate = new Date();
                let year = mydate.getFullYear();
                let month = mydate.getMonth()+1;
                let day = mydate.getDate();
                let formatdate = year + "-" + month + "-" + day;
                return formatdate;
            }
        }
    },
    mounted() {
        this.getSprList('01');
    },
    methods:{
    getSprList(type) {
        let param = type;

        return excontrolApi
          .excontrolGetBkspr(param)
          .then(res => res.data)
          .then(data => {
              if (data) {
                this.localList = data.pageData;
              }
          })
    },
      fjdownload:function(fileName,saveFullPath,group) {
        let para={
          fileName:fileName,
          group:group,
          saveFullPath:saveFullPath
        };
        //      return controlApi
        //     .ctrbkfjdownloadApil(para)
        //     .then(data => {
        //     if(!!data)
        //     {
        //     let blob = new Blob([data]);
        //      //let blob = new Blob([data],{type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'});
        //     // let url = new Blob([data],{type: 'application/vnd.ms-excel;charset=utf-8'});
        //     var downloadElement = document.createElement('a');
        // 　　var href = window.URL.createObjectURL(blob); //创建下载的链接
        // 　　downloadElement.href = href;
        // 　　downloadElement.download =fileName; //下载后文件名
        // 　　document.body.appendChild(downloadElement);
        // 　　downloadElement.click(); //点击下载
        // 　　document.body.removeChild(downloadElement); //下载完成移除元素
        // 　　window.URL.revokeObjectURL(href); //释放掉blob对象 
        //     }
        //     else{
        //         this.$message({
        //           message: "下载异常",
        //           type: "warning"
        //         });
        //         return;
        //     }
        //   });
        },
        getLocalName() {
            eventBus.$emit(
                eventCollection.EXCONTROL_GET_SELECTED_LOCALNAME,
                this.localName
            );
        }
    }
};
</script>
<style scoped>
.header {
    font-size: 18px;
    font-weight: bold;
    padding-top: 20px;
    color: #595959;
}
.leftdec {
    width: 65px;
    padding: 15px;
    background-color: #f5f4f4;
    font-weight: bold;
    position: absolute;
    top: 0px;
    bottom: 0px;
}
.rightdec {
    margin-left: 70px;
    padding: 10px 20px;
    line-height: 24px;
}
.divrow {
    padding: 0px;
}
.dadec {
    color: #1ba586;
    border-left: 5px solid #1ba586;
}
.bkszdec {
    color: #64c2c4;
    border-left: 5px solid #64c2c4;
}
.sqdec {
    color: #7489a4;
    border-left: 5px solid #7489a4;
}
.bjspdec {
    color: #1e586c;
    border-left: 5px solid #1e586c;
}
.sjspdec {
    color: #4d5fc1;
    border-left: 5px solid #4d5fc1;
}
.vcenter {
    display: flex;
    align-items: center;
    height: 100%;
}
.model-hold {
    min-height: 70px;
    border: 1px solid #dedede;
    position: relative;
    margin-bottom: 10px;
}
.tip {
    border-radius: 4px;
}
.tipicon {
    /* background-color: #50bfff; */
    font-size: 25px;
    color: #50bfff;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    position: absolute;
    left: 0;
    top: 50%;
    margin-top: -20px;
}
.tipdiv {
    margin-bottom: 10px;
    /* background-color: #ecf8ff; */
    position: relative;
    padding-left: 40px;
}
.tipspan {
    padding-left: 20px;
    padding-right: 10px;
}
.tipspansub {
    padding-right: 10px;
    color: #999;
}
.tipinline {
    display: inline-block;
}
.spandec {
    padding-right: 10px;
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
  border: 1px solid #dedede;
}
</style>