<template>
  <div class="dwdasearchdiv">
    <div class="searchbj">
      <div class="searchitembig">
        <div class="tiaojiandiv" @click="showManObj">
          <div class="tjicondiv">
            <i class="avatar-uploader-icon identity-face"></i>
            <span style="font-size:16px">单人布控</span>
          </div>
        </div>
        <button type="button" class="btn btn-info btn-margin" @click="showManObj">单人布控</button>
      </div>
    </div>

    <div class="searchbj">
      <div class="searchitembig">
        <div class="tiaojiandiv" @click="showMingdanObj">
          <div class="tjicondiv">
            <i class="avatar-uploader-icon identity-mingdan"></i>
            <span style="font-size:16px">名单布控</span>
          </div>
        </div>
        <button type="button" class="btn btn-info btn-margin" @click="showMingdanObj">名单布控</button>
      </div>
    </div>

    <div class="searchbj">
      <div class="searchitem">
        <el-upload class="avatar-uploader" action="#" ref="uploadfilepl" :show-file-list="false" :auto-upload="false" :on-change='plchangeUpload' accept=".xls,.xlsx" drag>
          <div class="avatar-uploader-idiv">
            <i class="avatar-uploader-icon identity-batch"></i>
            <div v-if="plfileUrl" class="avatar-uploader-p" style="font-size:16px">
              {{plfileUrlname}}
               <div class="face-modal"></div>
            </div>
            <p v-else>
              <span style="font-size:16px">上传附件</span>
            </p>
          </div>
           <label class="el-upload-list__item-status-label" v-show="pldeleteshow">
           <span class="re-upload">重新上传</span>
          </label>
        </el-upload>
        <el-button type="text" @click="downlexcellist()" class="btn-muban">模板下载</el-button>
        <button type="button" class="btn btn-info btn-margin-muban" @click="piliangbukong">批量</button>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
// import { passwayApi } from '@/http';
// import { controlApi } from '@/http';
export default {
  name: 'Searchobj',
  props: ['typename'],
  data() {
    return {
      //批量文件上传url
      plfileUrl: '',
      plfileUrlname: '',
      //批量文件删除
      pldeleteshow: false,
      //检索输入的内容
      inputform: {
        inputcontent: '',
        inputimg: '',
        inputtype: '',
        fjxx: '',
        fjxxZh: ''
      },
      //规则校验部分---------
      //检索输入的身份证号码是否合法的校验
      jyrule: {
        inputcontent: [
          {
            required: true,
            message: '请输入检索的内容',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  methods: {
    //重新初始化数据
    resetdata: function() {
      Object.assign(this.$data, this.$options.data()); //重新初始化数据
    },
    //批量布控模板下载
    downlexcellist: function() {
      if (this.typename == '布控') {
        return controlApi.ctrmodedownloadApil().then(data => {
          if (!data) {
            this.$message({
              message: '模板下载异常',
              type: 'warning'
            });
            return;
          }
          let blob = new Blob([data], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
          });
          // let url = new Blob([data],{type: 'application/vnd.ms-excel;charset=utf-8'});
          var downloadElement = document.createElement('a');
          var href = window.URL.createObjectURL(blob); //创建下载的链接
          downloadElement.href = href;
          downloadElement.download = '批量布控导入模板.xls'; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
        });
      } else if (this.typename == '落查') {
        return controlApi.ctrlcmodedownloadApil().then(data => {
          if (!data) {
            this.$message({
              message: '模板下载异常',
              type: 'warning'
            });
            return;
          }
          let blob = new Blob([data], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
          });
          // let url = new Blob([data],{type: 'application/vnd.ms-excel;charset=utf-8'});
          var downloadElement = document.createElement('a');
          var href = window.URL.createObjectURL(blob); //创建下载的链接
          downloadElement.href = href;
          downloadElement.download = '批量落查导入模板.xlsx'; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
        });
      }
    },
    //文件上传预览
    plchangeUpload(file) {
      if (file) {
        let Xls = file.name.split('.');
        let index = Xls.length - 1;
        if (Xls[index] === 'xls' || Xls[index] === 'xlsx') {
          this.plfileUrlname = file.name;
          this.plfileUrl = file.raw;
          this.pldeleteshow =true;
        } else {
          this.$message.error('上传文件只能是 xls/xlsx 格式!');
          return false;
        }
      }
    },
    //文件上传
    submitplfj() {
      this.$refs.uploadfilepl.submit();
    },
    //文件删除
    pldelete() {
      this.plfileUrl = '';
      this.pldeleteshow = false;
    },
    //批量布控
    piliangbukong: function() {
      if (!this.plfileUrl) {
        this.$message.error('请先上传需批量处理的名单');
        return;
      } else {
        this.$emit('piliangdaoru', this.plfileUrl, this.plfileUrlname);
      }
    },
  }
};
</script>
<style scoped>
.dwdasearchdiv {
  width: 100%;
  margin-bottom: 50px;
  margin-top: 80px;
  text-align: center;
}
.searchbj {
  display: inline-block;
  padding: 5px;
  margin-right: 30px;
  background-color: rgb(236, 248, 255, 0.5);
  box-shadow: #dfdbdb 0px 0px 8px;
}
.searchitem {
  display: inline-block;
  width: 276px;
  height: 360px;
  text-align: center;
}
.searchitembig {
  display: inline-block;
  width: 276px;
  height: 360px;
  text-align: center;
}

.tiaojiandiv {
  width: 100%;
  margin-bottom: 5px;
  height: 250px;
  border-radius: 6px;
  position: relative;
  box-sizing: border-box;
  background-color: #fff;
  cursor: pointer;
}
.tjicondiv,
.avatar-uploader {
  width: 100%;
  height: 250px;
  padding-top: 0px;
  font-size: 30px;
  color: #99a1ae;
}
.tjicon {
  margin: 20px;
}
.tiaojiandiv .search-form {
  box-sizing: border-box;
  width: 100%;
  line-height: 30px;
  position: absolute;
  bottom: 0px;
  height: 30px;
  padding: 0px;
  top: 174px;
}
.btn-margin {
  margin-top: 45px;
  margin-bottom: 5px;
}
.btn-margin-muban {
  margin-top: 5px;
  margin-bottom: 5px;
}
.swim-src-res {
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  flex-wrap: wrap;
}
.src-item {
  position: relative;
  display: flex;
  width: 362px;
  min-height: 460px;
  margin: 15px;
  text-align: left;
  box-shadow: #dfdbdb 0px 0px 8px;
}
.checkdiv {
  position: absolute;
  width: 60px;
  height: 60px;
  bottom: 10px;
  right: 10px;
  z-index: 999;
  text-align: center;
  font-size: 60px;
}
.checkdiv:hover {
  color: #409eff;
}
.active {
  color: rgb(182, 84, 84);
}
.noactive {
  color: #dedede;
}
.searchsubdiv {
  text-align: left;
  margin-bottom: 20px;
}
.btn {
  min-width: 270px;
  padding: 4px 12px;
  height: 40px;
}
.identity-batch {
  background: url('/static/image/bukong/icon-bukong.png');
  background-size: auto 80%;
  background-repeat: no-repeat;
  background-position: center;
}
.identity-mingdan {
  background: url('/static/image/bukong/icon-mingdan.png');
  background-size: auto 80%;
  background-repeat: no-repeat;
  background-position: center;
}
.identity-face {
  background: url('/static/image/bukong/icon-face.png');
  background-size: auto 80%;
  background-repeat: no-repeat;
  background-position: center;
}
.face-modal {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  top: 0;
  left: 0;
}
.searchbj {
  border: 1px solid #ddd;
  border-radius: 2px;
}
.tiaojiandiv,
.tiaojiandiv .tjicondiv,
.tiaojiandiv .search-form {
  background: #ddd;
}
.tiaojiandiv .tjicondiv {
  padding-top: 50px;
}
.dwdasearchdiv {
  display: flex;
  justify-content: space-evenly;
}
.btn-muban {
  font-size: 12px;
  margin-top: 10px;
}
.researchcardiv {
  height: 30px;
  line-height: 30px;
  text-align: left;
  margin: 0px 30px;
  display: flex;
}
</style>