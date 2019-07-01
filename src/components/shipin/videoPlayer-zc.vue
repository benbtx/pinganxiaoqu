<template>
    <div class="player" :class="{issel: isSel}">
        <video-player  class="vjs-custom-skin"
                        ref="videoPlayer"
                        :options="playerOptions"
                        :playsinline="true"
                        @play="onPlayerPlay($event)"
                        @pause="onPlayerPause($event)"
                        @ended="onPlayerEnded($event)"
                        @loadeddata="onPlayerLoadeddata($event)"
                        @waiting="onPlayerWaiting($event)"
                        @playing="onPlayerPlaying($event)"
                        @timeupdate="onPlayerTimeupdate($event)"
                        @canplay="onPlayerCanplay($event)"
                        @canplaythrough="onPlayerCanplaythrough($event)"
                        @ready="playerReadied"
                        @statechanged="playerStateChanged($event)">
        </video-player>
        <div class="modal" :class="{upper: focusPoint}"  @click="getPoint($event)"></div>
        <div id="imgbox" class="modal" :class="{middle: seldiv}" @click="selVideo">
          <!-- <img id="imgtest" src="https://surmon-china.github.io/vue-quill-editor/static/images/surmon-1.jpg" width="200" height="100"/>
          <canvas id="test"></canvas> -->
        </div>
    </div>
</template>

<script>
import * as videojs from 'video.js'
import 'videojs-flash'
import { shipinApi } from "@/https";
import eventBus from '@/event';
import { eventCollection } from '@/event/resources';

  export default {
    name: 'videoPlayerBox',
    data() {
      return {
        // videojs options
        playerOptions: {
          playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
          // height: '360',
          autoplay: true,
          language: 'en',
          loop: true, 
          techOrder: ['flash','html5'],
          // notSupportedMessage: '此视频暂无法播放，请稍后再试',
          preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
  //         aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
  //         fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [{
            type: 'rtmp/mp4',
            src: this.sourceSrc,
            // src:"rtmp://"
            // type: "video/mp4",
            // src: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4" 
          }],
          // poster: "https://surmon-china.github.io/vue-quill-editor/static/images/surmon-1.jpg",
          poster:'',
          controlBar: {
            timeDivider: false, //总时长显示
            durationDisplay: false, 
            remainingTimeDisplay: false, //剩余时间显示
            currentTimeDisplay: false, //当前时间显示
            progressControl: false, //进度条显示
            // volumePanel: false, //声音图标的显示
          }
        },
        videoUrl: '',
        focusPoint: false,
        baseWidth:'',
        baseHeight:'',
        isSel: false,
        seldiv: false,
      }
    },
    props: ['sourceSrc','sourceData','playerState','playType'],
    watch: {
      videoUrl: function(val) {
        if (val !== '') {
          this.player.src(val);
          this.player.load();
          this.player.play();
        }
      },
      playerState: function(val) {
          if (val) {
            this.stopPlayer('stop');            
          }
      },
      'sourceData.isSelNone': function(val) {
        this.isSel = !val;
      },
      sourceSrc: function(val) {
        this.videoUrl = val;
      }
    },
    mounted() {
      // console.log('this is current player instance object', this.player)
      // setTimeout(() => {
      //   console.log('dynamic change options', this.player)
        // change src
        // this.playerOptions.sources[0].src = 'https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm';
        // change item
        // this.$set(this.playerOptions.sources, 0, {
        //   type: "video/mp4",
        //   src: 'https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm',
        // })
        // change array
        // this.playerOptions.sources = [{
        //   type: "video/mp4",
        //   src: 'https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm',
        // }]
      //   this.player.muted(false)
      // }, 5000);

      this.createMyButton('vjs-control-camera','fa-camera'); //抓图
      this.createMyButton('vjs-control-camera-more','fa-camera-retro'); //连拍
      if (this.playType !== 'video') { 
        this.createMyButton('vjs-control-video','fa-video-camera'); //录像
        this.createMyButton('vjs-control-bigger','fa-search-plus'); 
        // this.createMyButton('vjs-control-back',' fa-caret-square-o-left');
        // this.createMyButton('vjs-control-voice','fa-microphone');
        this.createMyButton('vjs-control-analysis','fa-bar-chart');    //智能分析
        // this.playerOptions.playbackRates = false;
      } else {
        this.createMyButton('vjs-control-video-down','fa-download'); //录像下载
      }
      
      // let video = this.$el.getElementsByTagName('video')[0];
          // let video = document.getElementById('imgtest');
          // video.setAttribute('crossOrigin','Anonymous');

      this.videoUrl = this.sourceSrc;
    },
    computed: {
      player() {
        return this.$refs.videoPlayer.player;
      }
    },
    methods: {
      // listen event
      onPlayerPlay(player) {
        console.log('player play!', this.videoUrl)

        this.seldiv = true;
        if (this.videoUrl == '') {
          let param = {};
          param.tabUUID = this.sourceData.tabUUID;
          param.tollgateID = this.sourceData.tollgateID;

          let _this = this;
          return shipinApi
          .getPlayerVideo(param)
          .then(res => res.data)
          .then(data => {
            _this.videoUrl = data.videoURL;
          });
        }
      },
      onPlayerPause(eventType) {
        let param = {};
        param.tabUUID = this.sourceData.tabUUID;
        param.tollgateID = this.sourceData.tollgateID;
        if(param.tollgateID == '生产视频' || param.tollgateID== '未生产视频') {
          if (eventType == 'stop') {
            eventBus.$emit(eventCollection._closeShipinDialog);
          }
          return;
        }

        let _this = this;
        return shipinApi
            .stopPlayerVideo(param)
            .then(res => res.data)
            .then(data => {
              _this.videoUrl = '';

              if (eventType == 'stop') {
                eventBus.$emit(eventCollection._closeShipinDialog);
              }    
            }).catch(error => {
              if (eventType == 'stop') {
                eventBus.$emit(eventCollection._closeShipinDialog);
              }
            })
      },
      onPlayerEnded(player) {
        // console.log('player ended!', player)
      },
      onPlayerLoadeddata(player) {
        // console.log('player Loadeddata!', player)
      },
      onPlayerWaiting(player) {
        // console.log('player Waiting!', player)
      },
      onPlayerPlaying(player) {
        // console.log('player Playing!', player)
      },
      onPlayerTimeupdate(player) {
        // console.log('player Timeupdate!', player.currentTime())
      },
      onPlayerCanplay(player) {
        // console.log('player Canplay!', player)
      },
      onPlayerCanplaythrough(player) {
        // console.log('player Canplaythrough!', player)
      },
      // or listen state event
      playerStateChanged(playerCurrentState) {
        // console.log('player current update state', playerCurrentState)
      },
      // player is ready
      playerReadied(player) {
        // seek to 10s
        console.log('example player 1 readied', player)
        // player.currentTime(10)
        // console.log('example 01: the player is readied', player)
      },
      stopPlayer(eventType) {
          this.onPlayerPause(eventType);
      },
      createMyButton(className, iconClass) {
        let _this = this;
        let Button = videojs.getComponent('Button');
        let myButton = videojs.extend(Button, {
          constructor: function (player, options) {
            Button.apply(this, arguments)
            this.addClass(className)
          },
          handleClick: () => {
          // 绑定点击事件
            if (iconClass == 'fa-camera') {
              _this.shoot();
            } else if (iconClass == 'fa-camera-retro') {

            } else if (iconClass == 'fa-video-camera') {

            } else if (iconClass == 'fa-search-plus') {
              _this.enlargeFocus();
            } else if (iconClass == 'fa-caret-square-o-left') {

            } else if (iconClass == 'fa-microphone') {

            } else if (iconClass == 'fa-bar-chart') {

            }
          },
          buildCSSClass: function () {
            return 'vjs-icon-custombutton vjs-control vjs-button fa '+iconClass;
          }
        });
       
        //注册
        videojs.registerComponent('myButton'+iconClass, myButton)
          
        this.$nextTick(() => {
          // 添加到controlBar中
          this.player.getChild('controlBar').addChild('myButton'+iconClass);
        });

        // let videoPlayer = this.$refs.videoPlayer.$vnode.elm.children[0].player;
        // videoPlayer.controlBar.addChild('button').addClass("button-back");

        // videoPlayer.controlBar.eventBusEl_.lastElementChild.title = "back";
        // videoPlayer.controlBar.eventBusEl_.lastElementChild.innerText = "back";
      },
      //截图
      shoot() {
          // let cur_time = this.player.getCache().currentTime;
          // console.log(cur_time);
          // let src = document.getElementById('vjs_video_3_Flash_api').data;
          // console.log(src);
          
          // let video = this.$el.getElementsByTagName('video')[0];
          // let video = document.getElementById('imgtest');
          // video.setAttribute('crossOrigin','Anonymous');

          // let _this = this;
          // setInterval(function(){
          //   _this.drawVideo(video);
          // },100);
          // this.drawImg(video);

      },
      drawVideo(video) {
        // let canvas = document.createElement('canvas');
          let canvas = document.getElementById('test');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          let ctx = canvas.getContext('2d');
          ctx.drawImage(video,0,0,200,100);
      },
      drawImg(video) {
          let canvas = document.createElement('canvas');
          // let canvas = document.getElementById('test');
          // canvas.width = video.videoWidth;
          // canvas.height = video.videoHeight;
          let ctx = canvas.getContext('2d',200,100);
          ctx.drawImage(video,0,0);
          // 存储图片到本地

          let blob = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
          this.download(blob);
      },
      download(data) {
        let a = document.createElement('a');
        a.href = data;

        a.download = Math.random().toString(36).substr(2,14)+'.png';
        a.click();
     },
     enlargeFocus(x, y) {
      this.focusPoint = !this.focusPoint;
      let divDom = this.player.el_.firstElementChild;
      if (!this.focusPoint) {
        divDom.style.width = '100%';
        divDom.style.height = '100%';
        divDom.style.left = '0';
        divDom.style.top = '0';
       }

      this.baseWidth = divDom.offsetWidth;
      this.baseHeight = divDom.offsetHeight;
     },
     getPoint(event) {   
        //获取鼠标相对盒子左上角的位置  
        let targetx = event.layerX;   
        let targety = event.layerY;  
        // alert("鼠标在盒子中的X坐标为："+targetx+"px;<br>鼠标在盒子中的Y坐标为："+targety+"px;");
        
        let divDom = this.player.el_.firstElementChild;
        let widthData = parseInt(divDom.offsetWidth);
        let heightData = parseInt(divDom.offsetHeight);

        if (widthData > this.baseWidth*2) {
          this.$message({
            message: "不能再放大了！",
            type: "warning"
          });

          return false;
        }
        let left = 0;
        let top = 0;
        if (targetx<this.baseWidth/2 && targety>this.baseHeight/2) {
          top = -heightData*0.3;
        }
        if (targetx>this.baseWidth/2 && targety<this.baseHeight/2) {
          left = -widthData*0.3;
        }
        if (targetx>this.baseWidth/2 && targety>this.baseHeight/2) {
          top = -heightData*0.3;
          left = -widthData*0.3;
        }
        divDom.style.left = parseInt(divDom.style.left) + left + 'px';
        divDom.style.top = parseInt(divDom.style.top) + top + 'px';
        divDom.style.width = widthData * 1.3 + 'px';
        divDom.style.height = heightData * 1.3 + 'px';
      },
      selVideo() {
        this.isSel = !this.isSel;

        eventBus.$emit(
          eventCollection.EXCONTROL_GET_SELECTED_ORGANIZATION,
          this.sourceData.tollgateID,
          this.isSel,
          this.sourceData.num
        );
      }
    }
  }
</script>

<style scoped>
.player {
  position: relative;
  overflow: hidden;
}
.issel {
  outline: 2px solid #66ffff;
}
.modal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100% - 40px);
  background: transparent;
  z-index: -2;
}
.middle {
  z-index: 888;
  top: 0px;
  /* border: 1px solid #f0f;
  position: fixed;
  width: 300px;
  height:400px;
  overflow: hidden; */
}
.upper {
  z-index: 999;
}
</style>
