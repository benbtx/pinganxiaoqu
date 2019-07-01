<template>
  <div class="item-hold" :ref="`res-full${resid}`">
    <div @mousemove="handleMove($event)" style="position:relative;overflow:hidden">
      <div class="magli-area" @mouseenter.stop @mouseleave.stop :ref="`magli-area${resid}`"></div>
      <img :ref="`constr-img${resid}`" :src="resdata.facePicUrl" @load="getOriginSize($event)" />
    </div>
    <p class="paras">
      <span class="bright">身份证号：</span>
      <span class="dark">{{resdata.credentialsNum}}</span>
    </p>
    <p class="paras">
      <span class="bright">姓名：</span>
      <span class="dark">{{resdata.humanName}}</span>
    </p>
    <p class="paras">
      <span class="bright">性别：</span>
      <span class="dark">{{resdata.sex == 0 ? '男':'女'}}</span>
    </p>
    <p class="paras">
      <span class="bright">相似度：</span>
      <span class="dark" v-if="resdata.similarity<90">{{resdata.similarity}}</span>
      <span class="red" v-else>{{resdata.similarity}}</span>
    </p>
    <div class="magli-con" :ref="`magli-con${resid}`" :id="`magli-con${resid}`">
      <img :ref="`origshow-img${resid}`" :src="this.BASE_IMG_URL+resdata.facePicUrl" />
    </div>
    <div style="text-align: center;">
        <button class="pic-btn" @click="imgpersonsel">选择人脸</button>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
// let origshowimg, origshowhold, resulthold, renderframe;

export default {
  name: 'SearchItem',
  data() {
    return {
      renderSizeX: null,
      renderSizeY: null,
      originSizeX: null,
      originSizeY: null,

      resulthold: null,
      renderframe: null,
      origshowhold: null,
      origshowimg: null
    };
  },
  props: ['resid', 'resdata'],
  computed: {
    frameSizeX() {
      if (!this.originSizeX) {
        return null;
      }
      return Math.pow(this.renderSizeX, 2) / this.originSizeX;
    },
    frameSizeY() {
      if (!this.originSizeY) {
        return null;
      }
      return Math.pow(this.renderSizeY, 2) / this.originSizeY;
    }
  },
  mounted() {
    this.resulthold = this.$refs[`res-full${this.resid}`];
    this.renderframe = this.$refs[`magli-area${this.resid}`];

    this.origshowhold = this.$refs[`magli-con${this.resid}`];
    this.origshowimg = this.$refs[`origshow-img${this.resid}`];
  },
  methods: {
    imgpersonsel() {
      this.$emit('selectpersonimage', this.resdata);
    },
    getOriginSize(event) {
      let target = event.target;

      this.renderSizeX = target.width;
      this.renderSizeY = target.height;
      this.originSizeX = target.naturalWidth;
      this.originSizeY = target.naturalHeight;

      this.origshowhold.style.width = `${target.width}px`;
      this.origshowhold.style.height = `${target.height}px`;

      let bodyRect = document.body.getBoundingClientRect(),
        elemRect = this.resulthold.getBoundingClientRect(),
        offsetR = Math.abs(elemRect.right - bodyRect.right);

      if (offsetR < target.width + 30) {
        this.origshowhold.style.right = `105%`;
      } else {
        this.origshowhold.style.left = `105%`;
      }

      this.renderframe.style.width = `${this.frameSizeX}px`;
      this.renderframe.style.height = `${this.frameSizeY}px`;
    },
    handleEnter() {
      this.renderframe.style.visibility = 'visible';
      this.origshowhold.style.visibility = 'visible';
    },
    handleLeave() {
      this.renderframe.style.visibility = 'hidden';
      this.origshowhold.style.visibility = 'hidden';
    },
    handleMove(event) {
      let target = event.currentTarget;

      let mousex = event.pageX - $(target).offset().left;
      let mousey = event.pageY - $(target).offset().top;

      this.renderframe.style.left = `${mousex - this.frameSizeX / 2}px`;
      this.renderframe.style.top = `${mousey - this.frameSizeY / 2}px`;

      let offsetX =
        (this.frameSizeX / 2 - mousex) * this.originSizeX / this.renderSizeX;
      let offsetY =
        (this.frameSizeY / 2 - mousey) * this.originSizeY / this.renderSizeY;

      this.origshowimg.style.left = `${offsetX}px`;
      this.origshowimg.style.top = `${offsetY}px`;
    }
  }
};
</script>

<style lang="stylus" scoped>
.item-hold {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 15px;

  img {
    display: block;
    width: 100%;
  }

  .paras {
    display: flex;
    line-height: 24px;
    margin-top: 10px;
  }

  .bright {
    color: #a3b8d7;
  }

  .dark {
    color: #8091b4;
  }
  .red{
    color:red;
  }
}

.magli-con {
  position: absolute;
  top: 15px;
  visibility: hidden;
  background: RGBA(36, 95, 166, 0.9);
  overflow: hidden;
  z-index: 99;

  img {
    position: absolute;
    display: block;
    width: auto;
  }
}

.magli-area {
  position: absolute;
  visibility: hidden;
  background: RGBA(230, 55, 117, 0.5);
}

.pic-btn {
  width: 104px;
  height: 28px;
  line-height: 24px;
  text-align: center;
  color: #82c1ea;
  background: #1c2b34;
  border: 1px solid #3d5e67;
}
</style>