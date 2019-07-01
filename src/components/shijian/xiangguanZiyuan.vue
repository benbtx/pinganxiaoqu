<template>
<div class="bukong-center" :class="{width400: width}">
    <p class="title"><i class="fa fa-bookmark" style="color:#12B1E1"></i> 相关资源</p>
    <div class="ziyuan-main" :class="{height520: width}">
        <div class="ziyuan-item">
        <p class="ziyuan-title">
            <span class="fa fa-film"></span>
            视频：{{this.videoData.length}}
            <span class="toggle-right fa" :class="{'fa-caret-up': shipinDown, 'fa-caret-down': !shipinDown}" @click="toggleCard('shipin')"></span>
        </p>
        <div class="ziyuan-content" :class="{heightauto: !shipinDown}">
            <div class="anjian-item"  v-for="(item, index) in videoData" :key="item.id">
            <p class="anjian-img" @mouseover="showOperation('video',index)" @mouseleave="showOperation('video',-1)">
                <video :id="'video_'+index" v-if="item.resourceUrl" :src="BASE_IMG_URL+item.resourceUrl" class="avatar" controls="controls"></video>
                <span class="img-operation " v-if="activeIndex == 'video'+index">
                <span class="fa fa-play" @click="playVideo($event)"></span>
                <span class="fa fa-search-plus" @click="showBiggerVideo(item.resourceUrl)"></span>
                <span class="fa fa-file-text" @click="showDetailsPic(item)"></span>
                <span class="fa fa-trash-o" @click="delCurVideo(index)"></span>
                </span>
            </p>
            <p class="name-text" :title="item.resourceName">视频名称：{{item.resourceName}}</p>
            </div>
            <div class="anjian-item" v-if="infotype != 'details'">
                <p class="anjian-img" @click="showAddForm('shipin')">
                    <!-- action必选参数, 上传的地址 -->
                    <!-- <el-upload class="avatar-uploader el-upload--text" action="" :show-file-list="false"
                    multiple ref="newupload" :auto-upload="false" accept=".mp4,.flv,.mov" :on-change="newhandleChange"> -->
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                    <!-- </el-upload> -->
                </p>
                <p class="name-text">新增视频</p>
            </div>
        </div>
        </div>

        <div class="ziyuan-item">
        <p class="ziyuan-title">
            <span class="fa fa-picture-o"></span>
            图片：{{this.picData.length}}
            <span class="toggle-right fa" :class="{'fa-caret-up': picDown, 'fa-caret-down': !picDown}" @click="toggleCard('pic')"></span>
        </p>
        <div class="ziyuan-content" :class="{heightauto: !picDown}">
            <div class="anjian-item"  v-for="(item, index) in picData" :key="item.id">
            <p class="anjian-img" @mouseover="showOperation('pic',index)" @mouseleave="showOperation('pic',-1)">
                <img v-if="item.resourceUrl" :src="BASE_IMG_URL+item.resourceUrl" />
                <span class="img-operation " v-if="activeIndex == 'pic'+index">
                  <span class="fa fa-search-plus" @click="showBiggerPic(item.resourceUrl)"></span>
                  <span class="fa fa-file-text" @click="showDetailsPic(item)"></span>
                  <span class="fa fa-trash-o" @click="delCurPic(index)"></span>
                </span>
            </p>
            <p class="name-text" :title="item.resourceName">图片名称：{{item.resourceName}}</p>
            </div>
            <div class="anjian-item" v-if="infotype != 'details'">
                <p class="anjian-img" @click="showAddForm('pic')">
                    <!-- action必选参数, 上传的地址 -->
                    <!-- <el-upload class="avatar-uploader el-upload--text" action="" :show-file-list="false"
                    multiple ref="newupload" :auto-upload="false" accept=".png,.jpg,.jpeg" :on-change="newhandleChange"> -->
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                    <!-- </el-upload> -->
                </p>
                <p class="name-text">新增图片</p>
            </div>
        </div>
        </div>

        <div class="ziyuan-item">
        <p class="ziyuan-title">
            <span class="fa fa-paperclip"></span>
            附件：{{this.fileData.length}}
            <span class="toggle-right fa" :class="{'fa-caret-up': fileDown, 'fa-caret-down': !fileDown}" @click="toggleCard('file')"></span>
        </p>
        <div class="ziyuan-content" :class="{heightauto: !fileDown}" style="flex-direction: column;"> 
            <p class="fujian"  v-for="(item, index) in fileData" :key="item.id">
            <span class="" :title="item.resourceName">{{item.resourceName}}</span>
            <span class="fa fa-times-circle" @click="delCurFile(index)"></span>
            </p>
            <div class="anjian-item fujian-item" v-if="infotype != 'details'">
                <p class="anjian-img fujian-add" @click="showAddForm('file')">
                    <!-- action必选参数, 上传的地址 -->
                    <!-- <el-upload class="avatar-uploader el-upload--text" action="" :show-file-list="false"
                    multiple ref="newupload" :auto-upload="false" accept=".png,.jpg,.jpeg" :on-change="newhandleChange"> -->
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                    <!-- </el-upload> -->
                </p>
                <p class="name-text">新增附件</p>
            </div>
        </div>
        </div>

        <div class="ziyuan-item">
        <p class="ziyuan-title">
            <span class="fa fa-file-text-o"></span>
            相关事件：{{this.eventData.length}}
            <span class="toggle-right fa" :class="{'fa-caret-up': eventDown, 'fa-caret-down': !eventDown}" @click="toggleCard('event')"></span>
        </p>
        <div class="ziyuan-content" :class="{heightauto: !eventDown}">
            <div class="anjian-item"  v-for="(item, index) in eventData" :key="item.id">
            <p class="shijian-content" @mouseover="showOperation('event',index)" @mouseleave="showOperation('event',-1)">
              <span class="shijian-title">{{item.eventTheme}}</span>
              <span>事发地点：{{item.eventAddr}}</span>
              <span>事发时间：{{item.eventDate}}</span>
              <!-- <span>事件类型：{{item.eventType}}</span> -->
              <span v-if="item.eventType=='纠纷'">事件类型：苯超标</span>                                   
              <span v-else-if="item.eventType=='涉毒'">事件类型：甲苯超标</span>                                   
              <span v-else-if="item.eventType=='治安'">事件类型：二甲苯超标</span>                                   
              <span v-else-if="item.eventType=='消防'">事件类型：非甲烷总烃超标</span>                                   
              <span v-else>事件类型：其它超标</span> 

                <span class="img-operation " v-if="activeIndex == 'event'+index">
                  <span class="fa fa-file-text" @click="showDetailsEvent(item)"></span>
                  <span class="fa fa-trash-o" @click="delCurEvent(index)"></span>
                </span>
            </p>
            </div>
            <div class="anjian-item" v-if="infotype != 'details'">
                <p class="anjian-img shijian-content" @click="showAddForm('event')">
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                </p>
                <p class="name-text" style="width:240px;">新增事件</p>
            </div>
        </div>
        </div>
    </div>

    <el-dialog
          :title="addForm.titleText"
          :visible.sync="addFormVisibility"
          :width="addFormWidth"
          top="25vh"
          class="modal-popover"
         :before-close="closeAddForm"
         append-to-body
          >
          <div class="popover-content">
            <el-form :model="addForm" ref="addForm" class="details-bukong" style="padding:10px;">
              <el-form-item label="选择文件：" v-if="uploadType == 'file'">
                <el-upload
                  class="upload-btn"
                  action=""
                  accept="text/plain,application/pdf,application/msword,application/vnd.ms-works,application/vnd.ms-excel,application/zip"
                  :auto-upload="false"
                  :show-file-list="false"
                  :on-change="newhandleChange"
                  >
                  <el-button size="small" style="width:60px;display:inline-block;" type="primary">浏览</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item :label="addForm.nameLabel" prop="resourceName">
                <el-input v-model="addForm.resourceName" style="width:384px"></el-input>
              </el-form-item>
              <el-form-item :label="addForm.resourceLabel" prop="source" v-show="addForm.resourceLabel">
                <el-select v-model="addForm.source" style="width:384px" placeholder="请选择">
                  <el-option label="网格员" value="网格员"></el-option>
                  <el-option label="群众" value="群众"></el-option>
                </el-select>                   
              </el-form-item>
              <el-form-item :label="addForm.descLabel" prop="resourceDescription" style="height:auto;">
                <el-input  type="textarea" v-model="addForm.resourceDescription" :rows="3" style="width:384px;margin:4px 0;"></el-input>
              </el-form-item>
            </el-form>
            <div class="upload-preview" v-if="uploadType != 'file'">
               <el-upload v-if="uploadType == 'shipin'" class="avatar-uploader el-upload--text" action="" :show-file-list="false"
                  ref="newupload" :auto-upload="false" accept="video/mp4,application/ogg,audio/ogg " :on-change="newhandleChange">
                    <video v-if="curUpload.url" :src="curUpload.url" class="avatar" controls="controls"></video>
                    <i v-else class="el-icon-plus avatar-uploader-icon" style="margin-top:30px;"></i>
                </el-upload>
                <el-upload v-if="uploadType == 'pic'" class="avatar-uploader el-upload--text" action="" :show-file-list="false"
                  ref="newupload" :auto-upload="false" accept="image/jpeg,image/png" :on-change="newhandleChange">
                    <img v-if="curUpload.url" :src="curUpload.url" class="avatar"  />
                    <i v-else class="el-icon-plus avatar-uploader-icon" style="margin-top:30px;"></i>
                </el-upload>
            </div>
          </div>
          <div slot="footer" class="dialog-footer" style="text-align:center;">
            <el-button type="primary" @click="closeAddForm" size='medium' style="width:120px;margin-right:50px;">取 消</el-button>
            <el-button type="primary" @click="getAddData" size='medium' style="width:120px;">确定</el-button>
          </div>
      </el-dialog>

      <el-dialog
        title="新增事件"
        :visible.sync="addEventVisibility"
        width="1300px"
        height="856px"
        top="10vh"
        class="modal-popover"
        :before-close="closeAddEventForm"
        :close-on-click-modal='false'
        append-to-body
        >
        <div class="popover-content" style="height:750px;padding-bottom:50px;">
          <xiangguanshijian-details ref="addShijian" :infotype='infotype'></xiangguanshijian-details>
        </div>
      </el-dialog>

      <el-dialog
        title="查看大图"
        :visible.sync="imgVisibility"
        width="800px"
        class="modal-popover"
        :close-on-click-modal='false'
        append-to-body
        >
        <div class="popover-content">
          <div class="picture-bigger">
              <img :src="BASE_IMG_URL+biggerImageUrl" />
          </div>
        </div>
      </el-dialog>

       <el-dialog
        :title="imgDetail.title"
        :visible.sync="imgDetailVisibility"
        width="500px"
        class="modal-popover"
        :close-on-click-modal='false'
        append-to-body
        >
        <div class="popover-content">
              <el-row style='margin-bottom:20px'>
                <el-col :span="6"><div class="grid-content bg-purple">{{imgDetail.name}}名称：</div></el-col>
                <el-col :span="18"><div class="grid-content bg-purple-light">{{imgDetail.resourceName}}</div></el-col>
              </el-row>

              <el-row style='margin-bottom:20px'>
                <el-col :span="6"><div class="grid-content bg-purple">{{imgDetail.name}}来源：</div></el-col>
                <el-col :span="18"><div class="grid-content bg-purple-light">{{imgDetail.source}}</div></el-col>
              </el-row>

              <el-row style='margin-bottom:20px'>
                <el-col :span="6"><div class="grid-content bg-purple">{{imgDetail.name}}描述：</div></el-col>
                <el-col :span="18"><div class="grid-content bg-purple-light">{{imgDetail.resourceDescription}}</div></el-col>
              </el-row>

        </div>
      </el-dialog>



      <el-dialog
        title="查看视频"
        :visible.sync="videoVisibility"
        width="800px"
        class="modal-popover"
        :close-on-click-modal='false'
        append-to-body
        >
        <div class="popover-content">
          <div class="picture-bigger">
              <video :src="biggerVideoUrl" controls="controls" autoplay="autoplay"></video>
          </div>
        </div>
      </el-dialog>
</div>
</template>

<script>
import eventBus from '@/event';
import { eventCollection } from '@/event/resources';
import { excontrolApi, shijianApi } from "@/https";

export default {
name: "xiangguanziyuan",
props: ["detailsdata", "infotype","width",'detailsType'],
data() {
    return {
        shipinDown: true,
        picDown: true,
        fileDown: true,
        eventDown: true,
        activeIndex: '-1',
        biggerImageUrl: '',
        imgVisibility: false,
        biggerVideoUrl: '',
        videoVisibility: false,
        picData: [],
        videoData: [],
        fileData: [],
        eventData:[],
        addFormVisibility: false,
        addEventVisibility: false,
        addForm: {
          resourceDescription: '',                //类型：String  必有字段  备注：描述
          eventId: '',                //类型：String  必有字段  备注：事件id
          resourceUrl: '',                //类型：String  必有字段  备注：资源URL
          resourceName: '',                //类型：String  必有字段  备注：资源名称
          resourceType: '',                //类型：String  必有字段  备注：资源类型（picture，video，attachment）
          source: '',                //类型：String  必有字段  备注：资源来源（网格员、群众）
          titleText:'',
          resourceLabel: '',
          nameLabel: '',
          descLabel: ''
        },
        curUpload: {},
        uploadType: '',
        addFormWidth: '700px',
        uploadDataList: [],
        relatedEventArr: [],
        imgDetailVisibility:false,
        imgDetail:{
          title: '图片详情',
          name: '图片',
          resourceName:"",
          source:"",
          resourceDescription:"",
        },
        isDelziyuan: false,
    };
},
components: {
    "xiangguanshijian-details": () => import("@/views/shijianguanli/shijianSearch"),
},
watch: {
    videoData(val) {
      this.uploadDataList = this.getUploadDataList();
      if (this.infotype != 'details' || (this.detailsType =='add' && this.isDelziyuan)) {
        eventBus.$emit(eventCollection._UPLOADDATALIST_, this.uploadDataList );
      }
      this.isDelziyuan = false;
    },
    picData(val) {
      this.uploadDataList = this.getUploadDataList();
      if (this.infotype != 'details' || (this.detailsType =='add' && this.isDelziyuan)) {
        eventBus.$emit(eventCollection._UPLOADDATALIST_, this.uploadDataList );
      }
      this.isDelziyuan = false;
    },
    fileData(val) {
      this.uploadDataList = this.getUploadDataList();
      if (this.infotype != 'details' || (this.detailsType =='add' && this.isDelziyuan)) {
        eventBus.$emit(eventCollection._UPLOADDATALIST_, this.uploadDataList );
      }
      this.isDelziyuan = false;
    },
    eventData(val) {
      this.relatedEventArr = this.getRelatedEventArr();
      let eventStr = this.relatedEventArr.join(',');
      if (this.infotype != 'details' || (this.detailsType =='add' && this.isDelziyuan)) {
        eventBus.$emit(eventCollection._XIANGGUAN_EVENT_LIST_, eventStr);
        eventBus.$emit(eventCollection._XIANGGUAN_EVENT_DATA_, this.eventData);
      }
      this.isDelziyuan = false;
    },
},
created() {
  let _this = this;
    //监听上传数据列表
    eventBus.$on(eventCollection._UPDATE_XIANGGUAN_DATA_, data => {
      this.filterData(data);
    });
    //监听相关事件返回数据
    eventBus.$on(eventCollection._UPDATE_XIANGGUANEVENT_DATA_, data => {
      if (data) {
        if (_this.infotype == 'edit') {
          _this.addRelatedEvent(data);
        } else {
          let baseData = _this.eventData || [];
          _this.eventData = _this.distinct(baseData, data);
        }
        _this.addEventVisibility = false;
      } else {
        _this.addEventVisibility = false;
      }
    });
},
methods:{
    distinct(a, b) {
        let arr = a.concat(b);
        let result = [];
        let obj = {};
        // this.relatedEventArr = [];

        for (let i of arr) {
          if (i.id) {
            if (!obj[i.id]) {
              result.push(i);
              obj[i.id] = 1;
              // this.relatedEventArr.push(i.id);
            }
          } else if (i.eventID) {
            if (!obj[i.eventID]) {
              result.push(i);
              obj[i.eventID] = 1;
              // this.relatedEventArr.push(i.eventID);
            }
          } else {
            if (!obj[i]) {
              result.push(i);
              obj[i] = 1;
            }
          }
        }

        return result;
    },
    getRelatedEventArr() {
      let objarr = this.eventData;
      let relatedArr = [];
      for(let i=0;i<objarr.length;i++) {
        if (objarr[i].id) {
          relatedArr.push(objarr[i].id);
        }else if (objarr[i].eventID) {
          relatedArr.push(objarr[i].eventID);
        }
      }

      return relatedArr;
    },
    getSelectedIdArr(arr) {
      let result = [];
      for (let i of arr) {
        if (i.id) {
          result.push(i.id);
        }
      }

      return result;
    },
    filterData(data) {
      let baseData = data || this.detailsdata;

      let tmp = baseData.eventsResource || [];
      let picData = [];
      let videoData = [];
      let fileData = [];

      for(let i=0;i<tmp.length;i++) {
        if (tmp[i] &&　tmp[i].resourceType=='picture') {
          picData.push(tmp[i]);
        } else if (tmp[i] &&　tmp[i].resourceType=='video') {
          videoData.push(tmp[i]);
        } else if (tmp[i] &&　tmp[i].resourceType=='attachment') {
          fileData.push(tmp[i]);
        }
      }

      // this.picData.splice(0, this.picData.length, picData);
      // this.videoData.splice(0, this.videoData.length, videoData);
      // this.fileData.splice(0, this.fileData.length, fileData);

      this.picData = picData;
      this.videoData = videoData;
      this.fileData = fileData;
      this.eventData = baseData.relatedEventVOList || [];
      let relatedEventStr = baseData.events.relatedEventId || '';
      if (relatedEventStr) {
        this.relatedEventArr = relatedEventStr.split(',');
      } else {
        this.relatedEventArr = [];
      }
    },
    showAddForm(type) {
      if (type != 'event') {
        this.setAddFormText(type);
        this.addFormVisibility = true;
      } else {
        this.addEventVisibility = true;
      }
    },
    setAddFormText(type) {
      this.uploadType = type;
      this.addFormWidth = '700px';
      switch(type)
      {
      case 'shipin':
        this.addForm.titleText = '新增视频：';
        this.addForm.nameLabel = '视频名称：';
        this.addForm.resourceLabel = '视频来源：';
        this.addForm.descLabel = '视频描述：';
        break;
      case 'pic':
        this.addForm.titleText = '新增图片：';
        this.addForm.nameLabel = '图片名称：';
        this.addForm.resourceLabel = '图片来源：';
        this.addForm.descLabel = '图片描述：';
        break;
      case 'file':
        this.addForm.titleText = '新增附件：';
        this.addForm.nameLabel = '附件名称：';
        this.addForm.resourceLabel = '';
        this.addForm.descLabel = '附件描述：';
        this.addFormWidth = '520px';
        break;
      default:
        return;
      }
    },
    beforeAvatarUpload(file) {
        const isPic = file.type === 'image/jpeg' || file.type === 'image/png';
        const isWebVideo = file.type ==='video/mp4' || file.type == 'application/ogg' || file.type === 'audio/ogg';

        if (this.uploadType == 'pic' && !isPic) {
          this.$message.error('图片只能是JPG/PNG格式!');
          return isPic;
        }
        if (this.uploadType == 'shipin' && !isWebVideo) {
          this.$message.error('视频只支持MP4, WebM 和 Ogg格式!');
          return isWebVideo;
        }

        return true;
    },
    newhandleChange(file, fileList) {
      if (!this.beforeAvatarUpload(file.raw)) {
        return;
      }
      this.curUpload = file;
      this.addForm.resourceName = file.name;
      this.uploadForm = new FormData();
      this.uploadForm.append('multipartFile', file.raw);

      return shijianApi
        .uploadZiyuan(this.uploadForm)
        .then(res => res.data)
        .then(data => {
          this.addForm.resourceUrl = data;       
        }).catch(action => {
          
        });
    },
    playVideo(event) {
      let Media = event.currentTarget.parentNode.previousElementSibling;
      Media.play();
    },
    showBiggerVideo(url) {
      this.biggerVideoUrl = this.BASE_IMG_URL+url;
      this.videoVisibility = true;
    },
    showDetailsVideo(url) {

    },
    toggleCard(str) {
      switch(str)
      {
      case 'shipin':
        this.shipinDown = !this.shipinDown;
        break;
      case 'pic':
        this.picDown = !this.picDown;
        break;
      case 'file':
        this.fileDown = !this.fileDown;
        break;
      case 'event':
        this.eventDown = !this.eventDown;
        break;
      default:
        return;
      }
    },
    closeAddForm() {
      let _this = this;
      if (this.addForm.resourceUrl) {
        return shijianApi
            .deleteZiyuan(this.addForm.resourceUrl)
            .then(res => res)
            .then(data => {
              _this.clearAddForm();
            }).catch(err => {
              _this.clearAddForm();
            });
      } else {
        this.clearAddForm();
      }
    },
    clearAddForm() {
      this.addForm.resourceUrl = '';
      this.$refs["addForm"].resetFields();
      this.curUpload = {};
      this.addFormVisibility = false;
    },
    getAddData() {
      let curFileData = {
          resourceDescription: '',                //类型：String  必有字段  备注：描述
          resourceUrl: '',                //类型：String  必有字段  备注：资源URL
          resourceName: '',                //类型：String  必有字段  备注：资源名称
          resourceType: '',                //类型：String  必有字段  备注：资源类型
          source: '',                //类型：String  必有字段  备注：资源来源
      };
      if (!this.addForm.resourceUrl) {
        this.clearAddForm();
        return false;
      }
      curFileData.resourceName = this.addForm.resourceName;
      curFileData.resourceUrl = this.addForm.resourceUrl;
      curFileData.source = this.addForm.source;
      curFileData.resourceDescription = this.addForm.resourceDescription;

      switch(this.uploadType)
      {
      case 'shipin':
        curFileData.resourceType = 'video';
        this.videoData.push(curFileData);
        break;
      case 'pic':
        curFileData.resourceType = 'picture';
        this.picData.push(curFileData);
        break;
      case 'file':
        curFileData.resourceType = 'attachment';
        this.fileData.push(curFileData);
        break;
      default:
        break;
      }
      if (this.infotype == 'edit') {
        this.updateEventSource(curFileData);
      } else {
        this.clearAddForm();
      }
    },
    updateEventSource(curFileData) {
      let param = curFileData;
      param.eventId = this.detailsdata.events.id;
      let _this = this;

      return shijianApi
          .updateEventSource(param)
          .then(res => res)
          .then(data => {          
            this.$message({
              message: data.msg,
              type: 'info'
            });
            _this.clearAddForm();
          }).catch(action => {
            
          });
    },
    getUploadDataList: function() {
        return this.videoData.concat(this.picData).concat(this.fileData);
    },
    showOperation(type,idx) {
      this.activeIndex = type+idx;
    },
    showBiggerPic(url) {
      this.biggerImageUrl = url;
      this.imgVisibility = true;
    },
    delCurPic(index) {
      let _this = this;
      _this.deleteByUrl(_this.picData[index].resourceUrl).then(function (msg) {
        _this.isDelziyuan = true;
        _this.picData.splice(index, 1);
      });
    },
    delCurFile(index) {
      let _this = this;
      _this.deleteByUrl(_this.fileData[index].resourceUrl).then(function (msg) {
        _this.isDelziyuan = true;
        _this.fileData.splice(index, 1);
      });
    },
    delCurVideo(index) {
      let _this = this;
      _this.deleteByUrl(_this.videoData[index].resourceUrl).then(function (msg) {
        _this.isDelziyuan = true;
        _this.videoData.splice(index, 1);
      });
    },
    deleteByUrl(url) {
      return new Promise((resolve, reject) => {
        if (this.infotype == 'add') {
          return shijianApi
            .deleteZiyuan(url)
            .then(res => res)
            .then(data => {
              this.$message({
                message: '删除成功',
                type: 'info'
              });
              resolve();
            }).catch(err => {
              
            });
        } else {    
          return shijianApi
            .deleteEventSource(url)
            .then(res => res)
            .then(data => {
              this.$message({
                message: data.msg,
                type: 'info'
              });
              resolve();
            }).catch(err => {
              
            });
        }
      });
    },
    addRelatedEvent(arr) {
      let param = {};
      param.eventId = this.detailsdata.events.id;
      let relatedEventArr = this.distinct(this.relatedEventArr,this.getSelectedIdArr(arr));
      param.relatedEventsId = relatedEventArr.join(',');

      let _this = this;
      return shijianApi
        .updateRelatedEvent(param)
        .then(res => res)
        .then(data => {
          if (data.code == 200) {
            _this.relatedEventArr = relatedEventArr;
            _this.eventData = _this.distinct(_this.eventData, arr);
          }
          _this.$message({
            message: data.msg,
            type: 'info'
          });
        }).catch(err => {
        });
    },
    deleteRelatedEvent(id, arr, index) {
      let param = {};
      param.eventId = id;
      this.relatedEventArr.splice(index, 1);
      param.relatedEventsId = this.relatedEventArr.join(',');
      let _this = this;
      return shijianApi
        .updateRelatedEvent(param)
        .then(res => res)
        .then(data => {
          if (data.code == 200) {
            _this.eventData.splice(index, 1);
            _this.$message({
              message: data.msg,
              type: 'info'
            });
          } else {
            _this.relatedEventArr.splice(index, 0, this.eventData[index].eventID);
          }
          
        }).catch(err => {
        });
    },
    delCurEvent(index) {
      if (this.infotype != 'add' &&　this.detailsdata.events.id) {
        this.deleteRelatedEvent(this.detailsdata.events.id, this.relatedEventArr, index);
      } else {
        this.isDelziyuan = true;
        this.relatedEventArr.splice(index, 1);
        this.eventData.splice(index, 1);
      }
    },
    closeAddEventForm() {
      this.$refs.addShijian.clearSearchItem();
      this.addEventVisibility = false;
    },
    showDetailsPic(resource){
      if (resource.resourceId) {
        this.getEventZyDetails(resource.resourceId);
      } else {
        this.imgDetailVisibility=true;
        this.imgDetail = resource;
        if (this.imgDetail.resourceType == 'picture') {
          this.imgDetail.title = '图片详情';
          this.imgDetail.name = '图片';
        } else {
          this.imgDetail.title = '视频详情';
          this.imgDetail.name = '视频';
        }
      }
    },
    getEventZyDetails(id){
        //  let param = {};
      let _this = this;

        return excontrolApi
          .getEventZyDetails(id)
          .then(res => res)
          .then(data => {
           
            console.log(data);
            _this.imgDetailVisibility=true;
            _this.imgDetail=data.data;
            if (_this.imgDetail.resourceType == 'picture') {
              _this.imgDetail.title = '图片详情';
              _this.imgDetail.name = '图片';
            } else {
              _this.imgDetail.title = '视频详情';
              _this.imgDetail.name = '视频';
            }
          })
          .catch(msg => {
            _this.$message({
              message: msg,
              type: "error",
              duration: 5 * 1000
            });
        });
    },
    showDetailsEvent(item) {
      console.log(item)
    }
 }
};
</script>
<style scoped>
.heightAuto {
  height: auto;
}
.bk-content {
  width:80%;
  height:calc(100% - 40px);
  margin:30px auto;
}
.content-left {
  width:300px;
  height:100%;
  float:left;
  border:1px solid #ccc;
}
.content-right {
  width:calc(100% - 300px);
  height:100%;
  margin-left:300px;
  border:1px solid #ccc;
  border-left:none;
}
.more-title {
    border-bottom: 1px solid rgb(204, 204, 204);
    width: 500px;
    height: 40px;
    line-height: 40px;
    margin: 10px 0 10px 50px;
    font-size: 12px;
    font-weight: bold;
}
.ziyuan-main {
  width:100%;
  height:580px;
  overflow:auto;
  margin-top:15px;
  padding-right:10px;
}
.ziyuan-item {
  width:100%;
  border:1px solid #ccc;
  margin-bottom:15px;
}
.ziyuan-title {
  width:100%;
  height:30px;
  line-height:30px;
  padding-left:10px;
}
.toggle-right {
  float: right;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
}
.ziyuan-content {
  border-top:1px solid #ccc;
  display: flex;
  flex-wrap: wrap;
  position: relative;
  min-height: 80px;
}
.heightauto {
  display: none;
}
.fujian {
  width: calc(100% - 60px);
  line-height: 22px;
  padding-left: 10px;
}
.anjian-item.fujian-item {
  position: absolute;
  right: 10px;
  bottom: 10px;
  overflow: hidden;
}
.anjian-img.fujian-add {
  width: 40px;
  height: 30px;
}
.anjian-img {
  width: 140px;
  height: 82px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: 1px solid #ccc;
  margin: 10px;
}
.anjian-img video,.anjian-img img {
  max-width: 100%;
  max-height: 100%;
}
.anjian-item {
  border-top: none;
  /* margin-top: 6px; */
}
.anjian-item:nth-child(1),.anjian-item:nth-child(2),.anjian-item:nth-child(3),.anjian-item:nth-child(4) {
    /* margin-top: 0; */
}
.img-operation {
  position: absolute;
  width: 100%;
  height: 30px;
  line-height: 30px;
  padding: 0 10px;
  left: 0;
  bottom: 0;
  display: flex;
  text-align: center;
  align-items: center;
  background: rgba(0,0,0,0.4);
  z-index: 33;
}
.img-operation span {
  flex: 1;
  color: #fff;
  font-size: 15px;
  cursor: pointer;
}
.name-text {
  width: 160px;
  text-align: center;
  margin-top: 10px;
  padding: 0 10px;
  font-size:12px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.shijian-content {
    display: flex;
    flex-direction: column;
    font-size: 12px;
    width: 220px;
    min-height: 100px;
    position: relative;
    border: 1px solid #ccc;
    margin: 10px;
}
.shijian-content span {
  padding: 0 10px;
  line-height: 24px;
}
.shijian-title {
  font-weight:bold;
  height: 24px;
  background: #f2f2f2;
}
.fujian-item .name-text {
  width:60px;
  padding: 0;
}
.popover-content {
  margin: 0;
  position: relative;
}
.upload-preview {
  position:absolute;
  top: 15px;
  right: 0px;
  width: 140px;
  height: 80px;
  border: 1px solid #ccc;
}
.upload-preview video, .upload-preview img {
  max-width: 100%;
  max-height: 100%;
}
.details-bukong {
  width: 480px;
}
.upload-btn {
  width: 80px;
  overflow: hidden;
}
.picture-bigger {
    width: 100%;
    height: 500px;
    text-align: center;
    line-height: 500px;
}
.picture-bigger img,.picture-bigger video {
  max-width: 100%;
  max-height: 480px;
}
#stepsdiv {
  background:#12b1e1;
  padding: 10px 5%;
  min-width: 1200px;
}
.bukong-base {
  width: 1200px;
  margin: 0 auto;
}
.bukong-item {
  width: 50%;
  float: left;
}
.bukong-center {
  width: 500px;
  margin: 0 auto;
}
.title {
  width: 540px;
  margin-left: 50px;
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #D8DFE5;
}
.bukong-center .title {
  width: 100%;
  margin-left: 0px;
}
.btnmargin {
  margin-right: 50px;
}
.btn-info {
  width: 120px;
  height: 40px;
  background: #12b1e1;
}
.footer-group {
  clear: both;
  width: 100%;
  text-align: center;
  margin: 10px auto;
}
img {
  position: relative;
  z-index: 3;
}
.close-icon {
  position: absolute;
  right: -8px;
  top: -8px;
  width: 20px;
  height: 20px;
  line-height: 20px;
  font-size: 20px;
  cursor: pointer;
}
.width400 {
  width: 400px;
}
.height520 {
  height: 520px;
}
</style>