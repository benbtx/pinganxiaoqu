<template>
  <div id="itemhold" class="item-hold" :ref="`res-full${resid}`">
    <div @mousemove="handleMove($event)" @mouseenter="handleEnter" @mouseleave="handleLeave" style="position:relative;overflow:hidden" class="img-div">
      <div class="magli-area" @mouseenter.stop @mouseleave.stop :ref="`magli-area${resid}`"></div>
      <img :ref="`constr-img${resid}`" :src="resdata.imageUrl" @load="getOriginSize($event)" class="mini-img" />
    </div>
    <p class="ipcolor" v-show="btnshow=='true'">
      <i class="fa fa-search-plus icenter" @click="showlargeimg(resdata.imageUrl)"></i>
      <i class="fa fa-scissors icenter" @click="startpiccrop(resdata.imageUrl)"></i>
    </p>
    <p class="paras">
      <span class="bright">车牌：</span>
      <span class="dark">{{resdata.plateNumber}}</span>
    </p>
    <p class="paras">
      <span class="bright">车型：</span>
      <span class="dark">{{resdata.carInfo}}</span>
    </p>
    <p class="paras">
      <span class="bright">时间：</span>
      <span class="dark">{{resdata.captureTime}}</span>
    </p>
    <p class="paras">
      <span class="bright">地点：</span>
      <span class="dark">{{resdata.kkAddress}}</span>
    </p>
    <p class="paras">
      <span class="bright">相似度：</span>
      <span class="dark" v-if="resdata.simility<90">{{resdata.simility}}</span>
      <span class="red" v-else>{{resdata.simility}}</span>
    </p>
    <p class="paras div-btn">
      <button class="pic-btn" @click="imgpersonsel" v-show="btnshow=='true'">选择人脸</button>
      <button class="pic-btn" @click="imgautosel">选择车脸</button>
      <button class="pic-btn" @click="imgcompare">图片比对</button>
    </p>
    <div class="magli-con" :ref="`magli-con${resid}`" :id="`magli-con${resid}`">
      <img :ref="`origshow-img${resid}`" :src="resdata.imageUrl" />
    </div>
    <el-dialog :visible.sync="dgtpbdshow" width=1400px :append-to-body="true" :close-on-click-modal="false" v-dialogDrag>
      <div slot="title" style="padding: 0;">图片比对</div>
      <div style="height:550px;overflow-y:auto;overflow-x:hidden;">
        <div class="row" id="bdimgdiv">
          <div class="col-md-6">
            <p>原图：</p>
            <!-- <img :src="reslydata" style="width: 100%;height:500px;" /> -->
            <div @mousemove="ytdghandleMove($event)" @mouseenter="ytdghandleEnter" @mouseleave="ytdghandleLeave" style="position:relative;overflow:hidden" class="img-div">
              <div class="magli-area" @mouseenter.stop @mouseleave.stop :ref="`ytdgmagli-area${resid}`"></div>
              <img id="bdimg" :ref="`ytdgconstr-img${resid}`" :src="reslydata" style="width: 100%;height:500px" />
            </div>
            <div class="magli-con" :ref="`ytdgmagli-con${this.resid}`" :id="`ytdgmagli-con${this.resid}`">
              <img :ref="`ytdgorigshow-img${this.resid}`" :src="reslydata" @load="ytdggetOriginSize($event)" />
            </div>
          </div>
          <div class="col-md-6" :ref="`dgres-full${resid}`">
            <p>对比图:</p>
            <div @mousemove="dghandleMove($event)" @mouseenter="dghandleEnter" @mouseleave="dghandleLeave" style="position:relative;overflow:hidden" class="img-div">
              <div class="magli-area" @mouseenter.stop @mouseleave.stop :ref="`dgmagli-area${resid}`"></div>
              <img id="bdimg" :ref="`dgconstr-img${resid}`" :src="resdata.imageUrl" style="width: 100%;height:500px" />
            </div>
            <div class="magli-con" :ref="`dgmagli-con${this.resid}`" :id="`dgmagli-con${this.resid}`">
              <img :ref="`dgorigshow-img${this.resid}`" :src="resdata.imageUrl" @load="dggetOriginSize($event)" />
            </div>
            <!-- <img  :src="resdata.imageUrl" style="width: 100%;height:100%;"/> -->
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import $ from 'jquery';
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
      origshowimg: null,

      dgrenderSizeX: null,
      dgrenderSizeY: null,
      dgoriginSizeX: null,
      dgoriginSizeY: null,

      dgresulthold: null,
      dgrenderframe: null,
      dgorigshowhold: null,
      dgorigshowimg: null,

      ytdgrenderSizeX: null,
      ytdgrenderSizeY: null,
      ytdgoriginSizeX: null,
      ytdgoriginSizeY: null,

      ytdgresulthold: null,
      ytdgrenderframe: null,
      ytdgorigshowhold: null,
      ytdgorigshowimg: null,

      dgtpbdshow: false
    };
  },
  props: ['resid', 'resdata', 'reslydata', 'btnshow'],
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
    },
    dgframeSizeX() {
      if (!this.dgoriginSizeX) {
        return null;
      }
      return Math.pow(this.dgrenderSizeX, 2) / this.dgoriginSizeX;
    },
    dgframeSizeY() {
      if (!this.dgoriginSizeY) {
        return null;
      }
      return Math.pow(this.dgrenderSizeY, 2) / this.dgoriginSizeY;
    },
    ytdgframeSizeX() {
      if (!this.ytdgoriginSizeX) {
        return null;
      }
      return Math.pow(this.ytdgrenderSizeX, 2) / this.ytdgoriginSizeX;
    },
    ytdgframeSizeY() {
      if (!this.ytdgoriginSizeY) {
        return null;
      }
      return Math.pow(this.ytdgrenderSizeY, 2) / this.ytdgoriginSizeY;
    }
  },
  mounted() {
    this.resulthold = this.$refs[`res-full${this.resid}`];
    this.renderframe = this.$refs[`magli-area${this.resid}`];
    this.origshowhold = this.$refs[`magli-con${this.resid}`];
    this.origshowimg = this.$refs[`origshow-img${this.resid}`];
  },
  methods: {
    //显示放大的图片
    showlargeimg(src)
    {
       this.$emit('showlargeimg',src);
    },
    //裁剪图片
    startpiccrop(src)
    {
      this.$emit('startpiccrop',src);
    },
    //选择人脸
    imgpersonsel() {
      this.$emit('selectimage', this.resdata, 0);
    },
    //选择车脸
    imgautosel() {
      this.$emit('selectimage', this.resdata, 1);
    },
    //图片比对
    imgcompare() {
      this.dgtpbdshow = true;
      this.$nextTick(() => {
        this.dgresulthold = this.$refs[`dgres-full${this.resid}`];
        this.dgrenderframe = this.$refs[`dgmagli-area${this.resid}`];
        this.dgorigshowhold = this.$refs[`dgmagli-con${this.resid}`];
        this.dgorigshowimg = this.$refs[`dgorigshow-img${this.resid}`];

        // this.dggetOriginSize();
        this.ytdgresulthold = this.$refs[`ytdgres-full${this.resid}`];
        this.ytdgrenderframe = this.$refs[`ytdgmagli-area${this.resid}`];
        this.ytdgorigshowhold = this.$refs[`ytdgmagli-con${this.resid}`];
        this.ytdgorigshowimg = this.$refs[`ytdgorigshow-img${this.resid}`];
      });
    },
    //图片比对时放大镜
    dggetOriginSize() {
      let target = event.target;
      this.dgrenderSizeX = 665;
      this.dgrenderSizeY = 500;
      this.dgoriginSizeX = target.naturalWidth;
      this.dgoriginSizeY = target.naturalHeight;
      this.dgorigshowhold.style.width = `${this.dgrenderSizeX}px`;
      this.dgorigshowhold.style.height = `${this.dgrenderSizeY}px`;
      // let bodyRect = document.getElementById("bdimgdiv").getBoundingClientRect(),
      //   elemRect = this.dgresulthold.getBoundingClientRect(),
      //   offsetR = Math.abs(elemRect.right - bodyRect.right);
      // if (offsetR < target.width + 30) {
      //   this.dgorigshowhold.style.right = `105%`;
      // } else {
      //   this.dgorigshowhold.style.left = `105%`;
      // }
      this.dgorigshowhold.style.right = `105%`;
      this.dgrenderframe.style.width = `${this.dgframeSizeX}px`;
      this.dgrenderframe.style.height = `${this.dgframeSizeY}px`;
    },
    dghandleEnter() {
      this.dgrenderframe.style.visibility = 'visible';
      this.dgorigshowhold.style.visibility = 'visible';
    },
    dghandleLeave() {
      this.dgrenderframe.style.visibility = 'hidden';
      this.dgorigshowhold.style.visibility = 'hidden';
    },
    dghandleMove(event) {
      let target = event.currentTarget;

      let mousex = event.pageX - $(target).offset().left;
      let mousey = event.pageY - $(target).offset().top;

      this.dgrenderframe.style.left = `${mousex - this.dgframeSizeX / 2}px`;
      this.dgrenderframe.style.top = `${mousey - this.dgframeSizeY / 2}px`;

      let offsetX =
        (this.dgframeSizeX / 2 - mousex) *
        this.dgoriginSizeX /
        this.dgrenderSizeX;
      let offsetY =
        (this.dgframeSizeY / 2 - mousey) *
        this.dgoriginSizeY /
        this.dgrenderSizeY;

      this.dgorigshowimg.style.left = `${offsetX}px`;
      this.dgorigshowimg.style.top = `${offsetY}px`;
    },
    //图片原图放大镜效果
    ytdggetOriginSize() {
      let target = event.target;
      this.ytdgrenderSizeX = 665;
      this.ytdgrenderSizeY = 500;
      this.ytdgoriginSizeX = target.naturalWidth;
      this.ytdgoriginSizeY = target.naturalHeight;
      this.ytdgorigshowhold.style.width = `${this.ytdgrenderSizeX}px`;
      this.ytdgorigshowhold.style.height = `${this.ytdgrenderSizeY}px`;
      // let bodyRect = document.getElementById("bdimgdiv").getBoundingClientRect(),
      //   elemRect = this.dgresulthold.getBoundingClientRect(),
      //   offsetR = Math.abs(elemRect.right - bodyRect.right);
      // if (offsetR < target.width + 30) {
      //   this.dgorigshowhold.style.right = `105%`;
      // } else {
      //   this.dgorigshowhold.style.left = `105%`;
      // }
      this.ytdgorigshowhold.style.left = `105%`;
      this.ytdgrenderframe.style.width = `${this.ytdgframeSizeX}px`;
      this.ytdgrenderframe.style.height = `${this.ytdgframeSizeY}px`;
    },
    ytdghandleEnter() {
      this.ytdgrenderframe.style.visibility = 'visible';
      this.ytdgorigshowhold.style.visibility = 'visible';
    },
    ytdghandleLeave() {
      this.ytdgrenderframe.style.visibility = 'hidden';
      this.ytdgorigshowhold.style.visibility = 'hidden';
    },
    ytdghandleMove(event) {
      let target = event.currentTarget;

      let mousex = event.pageX - $(target).offset().left;
      let mousey = event.pageY - $(target).offset().top;

      this.ytdgrenderframe.style.left = `${mousex - this.ytdgframeSizeX / 2}px`;
      this.ytdgrenderframe.style.top = `${mousey - this.ytdgframeSizeY / 2}px`;

      let offsetX =
        (this.ytdgframeSizeX / 2 - mousex) *
        this.ytdgoriginSizeX /
        this.ytdgrenderSizeX;
      let offsetY =
        (this.ytdgframeSizeY / 2 - mousey) *
        this.ytdgoriginSizeY /
        this.ytdgrenderSizeY;

      this.ytdgorigshowimg.style.left = `${offsetX}px`;
      this.ytdgorigshowimg.style.top = `${offsetY}px`;
    },
    //底层放大镜效果
    getOriginSize(event) {
      let target = event.target;

      this.renderSizeX = target.width;
      this.renderSizeY = target.height;
      this.originSizeX = target.naturalWidth;
      this.originSizeY = target.naturalHeight;

      this.origshowhold.style.width = `${target.width}px`;
      this.origshowhold.style.height = `${target.height}px`;

      // let bodyRect = document.body.getBoundingClientRect(),
      //   elemRect = this.resulthold.getBoundingClientRect(),
      //   offsetR = Math.abs(elemRect.right - bodyRect.right);
      let bodyRect = document
          .getElementById('itemhold')
          .parentElement.parentElement.getBoundingClientRect(),
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
    },
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

  .mini-img {
    display: block;
    width: 100%;
    height: 100%;
  }

  .img-div {
    width: 100%;
    height: 197px;
  }

  .paras {
    display: flex;
    line-height: 24px;
    margin-top: 10px;
  }

  .bright {
    color: #a3b8d7;
    min-width: 50px;
  }

  .dark {
    color: #8091b4;
  }

  .red {
    color: red;
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

.div-btn {
  position: absolute;
  bottom: 10px;
}

.ipcolor {
  background-color: rgba(66, 80, 101, 0.8);
  // position: absolute;
  // bottom:0px;
  // left:0px;
  // right: 0px;
}

.icenter {
  width: 45%;
  text-align: center;
}
</style>