<template>
  <section class="swim-feedback bordered" v-show="thisShow">
    <div class="ctn-head">反馈信息</div>
    <div class="info-hold">
      <p class="info-head">犯罪人员信息</p>
      <p class="info-entry">
        <span class="key">指令编号：</span>
        <span>{{feedbackData.zlbh}}</span>
      </p>
      <p class="info-entry">
        <span class="key">指令详情：</span>
        <span>{{feedbackData.fknr}}</span>
      </p>
      <p class="info-entry">
        <span class="key">姓名：</span>
        <span>{{feedbackData.fkrmc}}</span>
      </p>
      <p class="info-entry">
        <span class="key">身份证号：</span>
        <span>{{feedbackData.fsrssdwdm}}</span>
      </p>
      <p class="info-entry">
        <span class="key">当前地址：</span>
        <span>{{feedbackData.fsrssdwmc}}</span>
      </p>

      <p class="info-head">抓捕现场照片</p>

      <div class="pic-list">
        <ul>
        <li v-for="(o,i) in feedbackData.fj" :key="i" style="float:left;">  
          <p class="item">
            <!-- <img src="http://pimg.gq.com.cn/userfiles/201402/1392027632163_550X366.jpg" /> -->
            <img :src="o.fjdz"/>
          </p>
        </li>
        </ul>
        <!-- <p class="item">
          <img src="https://gss0.bdstatic.com/94o3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike80%2C5%2C5%2C80%2C26/sign=dd050db8a586c9171c0e5a6ba8541baa/7af40ad162d9f2d31fe3cdafabec8a136227cc84.jpg" />
        </p> -->
      </div>
    </div>
    
    <div class="btn-con">
      <p class="release-btn" @click="hideThis">确认</p>
    </div>
  </section>
</template>

<script>
export default {
  name: 'FeedBackPanel',
  props: ['feedbackProps'],
  data () {
    return {
	  thisShow: false,
	  feedbackData: {
		fj
		:
		[],
		fknr
		:
		"456",
		fkrdm
		:
		"cd001",
		fkrmc
		:
		"李建伟",
		fksj
		:
		"2018-06-27 16:59:23",
		fsrssdwdm
		:
		"510100000000",
		fsrssdwmc
		:
		"成都市公安局",
		xxbh
		:
		"6b8d4557-ebf0-4c15-aee2-3b9a11632668",
		zlbh
		:
		"d9b7ebf41def416386ee59bab3a09357",
	  }
	}
  },
  watch: {
    feedbackProps (val) {
	  this.feedbackData = val
	}
  },
  methods: {
    showThis () {
      this.thisShow = true;
    },
    hideThis () {
      this.thisShow = false
    }
  }
};
</script>

<style lang="stylus" scoped>
.swim-feedback {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 698px;
  height: 580px;
  left: 50%;
  top: 50%;
  background: #06253d;
  margin-left: -349px;
  margin-top: -290px;
}

.bordered {
  border-radius: 10px;
  border: 1px solid #51808a;
}

.info-hold {
  display: flex;
  padding-top: 30px;
  flex: 1;
  flex-direction: column;
  padding: 30px 24px 0;

  .info-head {
    line-height: 30px;
    margin: 14px 0;
    font-size: 16rem;
    font-weight: 600;
  }

  .info-entry {
    line-height: 26px;
  }

  .key {
    color: #82c1ea;
  }

  .pic-list {
    display flex;
    justify-content flex-start
    .item {
      width 205px;
      height 135px
      margin-right 10px
      img {
        display block
        width 100%;
        height 100%
      }
    }
  }
}
.btn-con {
  display: flex;
  justify-content: space-around;
  height: 54px;
  padding: 6px 24px;
  margin-bottom: 12px;

  .release-btn {
    width: 108px;
    height: 42px;
    text-align: center;
    line-height: 42px;
    cursor: pointer;
    color: #fff;
    font-size: 16rem;
  }
}
</style>