export const dwdaMixin = {
  data() {
    return {
       //布控对象档案组件传参
       bkdxdata: null,
      //是否显示布控对象档案弹出
       showbkdxda: false,
    }
  },
  methods: {
      //查看布控对象档案
      lookbkdxdada(para) {
          return controlApi
            .ctraddrecordApil(para)
            .then(res => res.data)
            .then(data => {
              // loading.close();
              if (!!data) {
                this.bkdxdata = data.basicrecord;
                //取第一张照片信息
                if (!!this.bkdxdata.zp) {
                  var zjjson = JSON.parse(this.bkdxdata.zp);
                  this.bkdxdata.zp = "data:image/png;base64," + zjjson[0].xp;
                }
                //写入多维信息
                if (!!this.bkdxdata.cph) {
                  this.bkdxdata.cph = JSON.parse(this.bkdxdata.cph);
                } else {
                  this.bkdxdata.cph = [];
                }
                if (!!this.bkdxdata.sjhm) {
                  this.bkdxdata.sjhm = JSON.parse(this.bkdxdata.sjhm);
                } else {
                  this.bkdxdata.sjhm = [];
                }
                if (!!this.bkdxdata.qqhm) {
                  this.bkdxdata.qqhm = JSON.parse(this.bkdxdata.qqhm);
                } else {
                  this.bkdxdata.qqhm = [];
                }
                if (!!this.bkdxdata.wxhm) {
                  this.bkdxdata.wxhm = JSON.parse(this.bkdxdata.wxhm);
                } else {
                  this.bkdxdata.wxhm = [];
                }
                if (!!this.bkdxdata.sjmac) {
                  this.bkdxdata.sjmac = JSON.parse(this.bkdxdata.sjmac);
                } else {
                  this.bkdxdata.sjmac = [];
                }
                if (!!this.bkdxdata.imei) {
                  this.bkdxdata.imei = JSON.parse(this.bkdxdata.imei);
                } else {
                  this.bkdxdata.imei = [];
                }
                 if (!!this.bkdxdata.imsi) {
                  this.bkdxdata.imsi = JSON.parse(this.bkdxdata.imsi);
                } else {
                  this.bkdxdata.imsi = [];
                }
                this.showbkdxda = true;
              } else {
                this.$message.error("数据获取失败");
                return;
              }
            });
        },
  }
}