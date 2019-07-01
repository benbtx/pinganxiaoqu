<template>
  <a href="#" @click="fullscreentog" style="font-size: 14px;position: absolute;right: 10px;top: 10px;">
    <i class="fa fa-expand" style="font-size: 14px !important;"></i>
  </a>

</template>

<script>
export default {
  name: "Fullscreen",
  props: ["eleid"],
  data() {
    return {

    };
  },
  methods: {
    fullscreentog() {
      if (!this.IsFull()) {
        this.enterFullScreen();
      } else {
        this.exitFullScreen();
      }
    },
    //进入全屏
    enterFullScreen() {
      var de = document.getElementById(this.eleid);
      if (de.requestFullscreen) {
        de.requestFullscreen();
      } else if (de.mozRequestFullScreen) {
        de.mozRequestFullScreen();
      } else if (de.webkitRequestFullScreen) {
        de.webkitRequestFullScreen();
      }
      this.isfullscreen = true;
    },
    //退出全屏
    exitFullScreen() {
      var de = document;
      if (de.exitFullscreen) {
        de.exitFullscreen();
      } else if (de.mozCancelFullScreen) {
        de.mozCancelFullScreen();
      } else if (de.webkitCancelFullScreen) {
        de.webkitCancelFullScreen();
      }
      this.isfullscreen = false;
    },
    //判断是否处于全屏
    IsFull() {
      var fullscreenElement =
        document.fullscreenEnabled ||
        document.mozFullscreenElement ||
        document.webkitFullscreenElement;
      var fullscreenEnabled =
        document.fullscreenEnabled ||
        document.mozFullscreenEnabled ||
        document.webkitFullscreenEnabled;
      if (fullscreenElement == null) {
        return false;
      } else {
        return true;
      }
    }
  }
};
</script>