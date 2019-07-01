<template>
        <div class="popover-content">
          <div class="picture-hold">
              <div class="pic-wrap">
                  <img :src="BASE_IMG_URL+rydetailsdata.imageUrl" />
              </div>
          </div>
          <div class="row">
              <div class="col-md-8">
                  <span class="spandec">布控标题：
                  <span class="spantext">{{rydetailsdata.title}}</span>
                  </span>
              </div>
          </div>
          <div class="row">
              <div class="col-md-8">
                  <span class="spandec">发现位置：
                  <span class="spantext">{{rydetailsdata.name}}</span>
                  </span>
              </div>
          </div>
          <div class="row">
              <div class="col-md-8">
                  <span class="spandec">发现时间：
                  <span class="spantext">{{rydetailsdata.triggerTime}}</span>
                  </span>
              </div>
          </div>
          <div class="row">
              <div class="col-md-8 spandiv">
                  <span class="spandec">身份证：
                  <span class="spantext">{{handleBKSfz(rydetailsdata.targetFeature.idCard)}}</span>
                  </span>
              </div>
          </div>                    
          <div class="row">
              <div class="col-md-4">
                  <span class="spandec">人名：
                  <span class="spantext">{{rydetailsdata.targetFeature.name}}</span>
                  </span>
              </div>
              <div class="col-md-4">
                  <span class="spandec">电话：
                  <span class="spantext">{{rydetailsdata.targetFeature.phone}}</span>
                  </span>
              </div>
          </div>
          <div class="row">
              <div class="col-md-4 spandiv">
                  <span class="spandec">籍贯：
                  <span class="spantext">{{rydetailsdata.targetFeature.register}}</span>
                  </span>
              </div>
              <div class="col-md-4">
                  <span class="spandec">申请人：
                  <span class="spantext">{{rydetailsdata.applicantName}}</span>
                  </span>
              </div>
          </div>
          <div class="row">
              <div class="col-md-12">
                  <span class="spandec">布控原因：
                  <span class="spantext">{{rydetailsdata.reason}}</span>
                  </span>
              </div>
          </div>
        </div>
</template>

<script>
export default {
  name: "gaojingryxiangqing",
  props: ["rydetailsdata"],
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
      handleBKSfz(id) {
      let ryID = '未登记';
      let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (reg.test(id)) {
        ryID = id;
      }

      return ryID;
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
