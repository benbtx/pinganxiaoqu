<template>
  <div style="margin:20px">
    <div style="text-align:center">
      <p class="header">信息预览</p>
    </div>
    <div class="model-hold">
      <div class="leftdec dadec">
        <span class="vcenter">人员信息</span>
      </div>
      <div class="rightdec" style="overflow:hidden;">
          <div style="width:380px;float:left;">
            <div class="row divrow">
                <div class="col-md-12">
                    <span class="spandec">姓名：
                        <span class="spantext">{{detailsdata.name}}</span>
                    </span>
                </div>
            </div>
            <div class="row divrow">
                <div class="col-md-12">
                    <span class="spandec">证件类型：
                        <span class="spantext">{{detailsdata.idType}}</span>
                    </span>
                </div>
            </div>
            <div class="row divrow">
                <div class="col-md-12">
                    <span class="spandec">证件号码：
                        <span class="spantext">{{detailsdata.idNumber}}</span>
                    </span>
                </div>
            </div>
            <div class="row divrow">
                <div class="col-md-12">
                    <span class="spandec">性别：
                        <span class="spantext">{{detailsdata.xb}}</span>
                    </span>
                </div>
            </div>
            <div class="row divrow">
                <div class="col-md-12">
                    <span class="spandec">住址：
                        <span class="spantext">{{detailsdata.addr}}</span>
                    </span>
                </div>
            </div>
            <div class="row divrow">
                <div class="col-md-12">
                    <span class="spandec">电话号码：
                        <span class="spantext">{{detailsdata.phone}}</span>
                    </span>
                </div>
            </div>
        </div>
        <div class="picture-hold">
            <div class="pic-wrap">
                <img :src="detailsdata.imgUrl" />
            </div>
        </div>
      </div>
    </div>
    <div class="model-hold">
      <div class="leftdec bkszdec">
         <span class="vcenter">卡号</span>
      </div>
      <div class="rightdec row divrow">
        <span class="col-xs-6" style="padding: 0 5px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;cursor: default;" v-for="item in detailsdata.selectedKahao" :key="item.id" :title="item">
            <span class="spantext">{{item}}</span>
        </span>
      </div>
    </div>
    <div class="model-hold">
      <div class="leftdec sqdec">
         <span class="vcenter">门禁名称</span>
      </div>
      <div class="rightdec row divrow">
        <span class="col-xs-6" style="padding: 0 5px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;cursor: default;" v-for="item in detailsdata.selectedMenjin" :key="item.id" :title="item">
            <span class="spantext">{{item}}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
// import { controlApi } from "@/http";

export default {
    name: "Menjindetails",
    props: ["detailsdata"],
    data() {
        return {

        };
    },
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
            if (!!this.detailsdata.bkdx) {
                bkdxobj = this.detailsdata.bkdx[0];
            }
            return bkdxobj;
        },
        bkrylb: function() {
            let bkrylbarr = [];
            if (!!this.detailsdata.rylb) {
                let rylb = this.detailsdata.rylb;
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
            if (!!this.detailsdata.bkjb) {
                for (let i = 0; i < this.basicdic.bkjbdata.length; i++) {
                    if (
                        this.detailsdata.bkjb ==
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
            if (!!this.detailsdata.czcs) {
                for (let i = 0; i < this.basicdic.czcsdata.length; i++) {
                    if (
                        this.detailsdata.czcs ==
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
            if (!!this.detailsdata.yjgz) {
                for (let i = 0; i < this.basicdic.yjgzdata.length; i++) {
                    if (
                        this.detailsdata.yjgz ==
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
            if (this.detailsdata.sfdxtz == "0") {
                sfdxtzcontent = "否";
                return sfdxtzcontent;
            } else if (this.detailsdata.sfdxtz == "1") {
                sfdxtzcontent = "是";
                sfdxtzcontent +=
                    "  （短信提示电话：" + this.detailsdata.yddxtssjh + "）";
                return sfdxtzcontent;
            }
        },
        fjlist: function() {
            //未批量布控时
            if (this.detailsdata.sfplbk == "0") {
                let fjarr=[];
                if(!!this.detailsdata.fj)
                {
                  fjarr=JSON.parse(this.detailsdata.fj);
                }
                return fjarr;
            } else if (this.detailsdata.sfplbk == "1") {
                //批量布控时
                 if(!!this.detailsdata.fj)
                {
                let fjarr = [];
                let fjlistarr=JSON.parse(this.detailsdata.fj);
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
            if (!!this.detailsdata.bksqrq) {
                return this.detailsdata.bksqrq;
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
    methods:{
      fjdownload:function(fileName,saveFullPath,group)
      {
        let para={
          fileName:fileName,
          group:group,
          saveFullPath:saveFullPath
        };
    }
    }
};
</script>
<style scoped>
.header {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
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
    line-height: 28px;
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