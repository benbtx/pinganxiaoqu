<template>
  <div class="rowdiv">
    <div class="left" @click="endcrop">
      <p class="reginpictex">原始图片</p>
      <vueCropper ref="cropper" :autoCrop="option.autoCrop" :autoCropWidth="option.autoCropWidth" :autoCropHeight="option.autoCropHeight" :centerBox=true :img="imgsrc" :outputSize="option.outputSize" :outputType="option.outputType"></vueCropper>
    </div>
    <div class="right">
      <p class="croppictex">截图图片预览</p>
      <img class="cropimg" :src="cropimg" />
      <div class="btndiv">
        <div class="leftbtndiv">
          <p>
            <el-button type="primary" @click="searchpeople">人脸比对</el-button>
          </p>
          <p>
            <el-button type="primary" @click="downcrop">下载截图</el-button>
          </p>
        </div>
        <div class="rightbtndiv">
          <p>
            <el-button type="primary" @click="searchcar">以图搜车</el-button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueCropper from 'vue-cropper';
export default {
  name: 'Piccrop',
  props: ['imgsrc'],
  data() {
    return {
      option: {
        outputSize: 1,
        outputType: 'png',
        autoCrop: true,
        autoCropWidth: 200,
        autoCropHeight: 150
      },
      cropimg: '/static/image/public/cropex.png',
      cropimgblob: '' //截图的blob数据
    };
  },
  components: {
    vueCropper: VueCropper
  },
  methods: {
    initcrop: function() {
      this.cropimg = '/static/image/public/cropex.png';
      this.cropimgblob = '';
    },
    endcrop: function() {
      this.$refs.cropper.getCropData(data => {
        this.cropimg = data;
        this.$refs.cropper.getCropBlob(data => {
          this.cropimgblob = data;
        });
      });
    },
    downcrop: function() {
      if (!!this.cropimgblob) {
        let blob = this.cropimgblob;
        var downloadElement = document.createElement('a');
        var href = window.URL.createObjectURL(blob); //创建下载的链接
        downloadElement.href = href;
        downloadElement.download = '截图.png'; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        window.URL.revokeObjectURL(href); //释放掉blob对象
      } else {
        this.$message({
          message: '请先截图',
          type: 'warning'
        });
        return;
      }
    },
    searchpeople() {
      this.$emit('searchpeople', this.cropimg);
    },
    searchcar() {
      this.$emit('searchcar', this.cropimg);
    }
  }
};
</script>
<style scoped>
.rowdiv {
  display: flex;
  height: 95%;
}
.left {
  flex: 2;
}
.right {
  flex: 1;
  margin-left: 20px;
}
.reginpictex {
  padding: 5px;
  color: #fff;
  background-color: #f0992bee;
}
.croppictex {
  padding: 5px;
  color: #fff;
  background-color: #60be35ee;
}
.cropimg {
  width: 100%;
  height: 60%;
}
.btndiv {
  margin-top: 20px;
  line-height: 80px;
  display: flex;
}
.leftbtndiv {
  flex: 1;
}
.rightbtndiv {
  flex: 1;
}
</style>