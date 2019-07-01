<template>
    <div class="popover-content">
        <div class="picture-hold">
            <div class="pic-wrap">
                <img :src="BASE_IMG_URL+cldetailsdata.imageUrl" />
            </div>
        </div>
        <div class="row">
            <div class="col-md-10">
                <span class="spandec">车辆颜色：
                <span class="spantext">{{getCLcolor(cldetailsdata.targetFeature.vehicleColor)}}</span>
                </span>
            </div>
        </div>
        <div class="row">
            <div class="col-md-10">
                <span class="spandec">车型：
                <span class="spantext">{{getCLpp(cldetailsdata.targetFeature.brand)}}</span>
                </span>
            </div>
        </div>
        <div class="row">
            <div class="col-md-10 spandiv">
                <span class="spandec">发现位置：
                <span class="spantext" >{{cldetailsdata.name}}</span>
                </span>
            </div>
        </div>
          <div class="row">
            <div class="col-md-10">
                <span class="spandec">发现时间：
                <span class="spantext">{{cldetailsdata.triggerTime}}</span>
                </span>
            </div>
        </div>
        <div class="row">
            <div class="col-md-5">
                <span class="spandec">行驶方向：
                <span class="spantext"></span>
                </span>
            </div>
            <div class="col-md-5">
                <span class="spandec">车速：
                <span class="spantext"></span>
                </span>
            </div>
        </div>
        <div class="row">
            <div class="col-md-5 spandiv">
                <span class="spandec">布控标题：
                <span class="spantext">{{cldetailsdata.title}}</span>
                </span>
            </div>
            <div class="col-md-5">
                <span class="spandec">申请人：
                <span class="spantext">{{cldetailsdata.applicantName}}</span>
                </span>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <span class="spandec">布控原因：
                <span class="spantext">{{cldetailsdata.reason}}</span>
                </span>
            </div>
        </div>
      </div>
</template>

<script>
export default {
  name: "gaojingclxiangqing",
  props: ["cldetailsdata"],
  data() {
    return {
      dialogVisible: false,
      cpcolorlist:[
        {
          label:"黑色",
          value:"1",
        },
        {
          label:"白色",
          value:"2",
        },
        {
          label:"灰色",
          value:"3",
        },
        {
          label:"红色",
          value:"4",
        },
        {
          label:"蓝色",
          value:"5",
        },
        {
          label:"黄色",
          value:"6",
        },
        {
          label:"橙色",
          value:"7",
        },
        {
          label:"棕色",
          value:"8",
        },
        {
          label:"绿色",
          value:"9",
        },
        {
          label:"紫色",
          value:"10",
        },
        {
          label:"青色",
          value:"11",
        },
        {
          label:"粉色",
          value:"12",
        },
        {
          label:"透明",
          value:"13",
        },
        {
          label:"其他",
          value:"99",
        },
      ],
    };
  },
  mounted() {
    console.log(this.cldetailsdata);
  },
  methods: {
    getCLcolor(ysdm)
    {
      var ys = '';
      this.cpcolorlist.forEach((o) => {
        if(o.value ==ysdm)
        {
          ys = o.label
        }      
      });
      return ys;
   },
  }
};
</script>

<style scoped>
.content {
    margin: 0 5px;
}
.title {
    height: 32px;
    line-height: 32px;
    border-bottom: 1px solid #ccc;
    margin: 15px 10px;
}
.picture-hold {
  position:absolute;
  width: 104px;
  right: 20px;
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
  border: 1px solid #8394a1;
}
.btnmargin {
  margin-right: 10px;
}
.btn-info {
  width: 100px;
  height: 40px;
  background: #12b1e1;
}
.footer-group {
  clear: both;
  width: 100%;
  text-align: center;
  margin-top: 30px;
}
</style>
