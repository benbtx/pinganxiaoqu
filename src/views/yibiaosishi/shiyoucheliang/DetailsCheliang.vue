<template>
  <div id="contentbody" class="content-body">
    <div class="page-bread">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/yibiaosishi/shiyoucheliang'}">实有车辆</el-breadcrumb-item>
        <el-breadcrumb-item>查看详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-row">
      <div class="content-center">
        <div id="cljiben">
          <div class="content-title">
            <span>基本信息</span>
          </div>
          <div style="margin:20px;">
                <p class="info-item">
                    <span class="info-col">  
                        <span class="info-itemlabel">车牌：</span>
                        <span>{{detailsData.plateNumber}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">车牌颜色：</span>
                    <span>{{detailsData.plateColor}}</span>
                    </span>
                </p>
                <p class="info-item">
                    <span class="info-col">  
                    <span class="info-itemlabel">车辆颜色：</span>
                    <span>{{detailsData.vehicleColor}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">车辆品牌：</span>
                    <span>{{detailsData.vehicleBrand}}</span>
                    </span>
                </p>
                <p class="info-item">
                    <span class="info-col">  
                    <span class="info-itemlabel">车型：</span>
                    <span>{{detailsData.vehicleType}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">年款：</span>
                    <span>{{detailsData.vehicleStyles}}</span>
                    </span>
                </p>
                <p class="info-item">
                    <span class="info-col">  
                    <span class="info-itemlabel">车架号：</span>
                    <span>{{detailsData.frameNumber}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">车位：</span>
                    <span>{{detailsData.parking}}</span>
                    </span>
                </p>
                <p class="info-item">
                    <span class="info-col">  
                    <span class="info-itemlabel">车主：</span>
                    <span>{{detailsData.hostName}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">车主身份证：</span>
                    <span>{{detailsData.idNumber}}</span>
                    </span>
                </p>
                <p class="info-item">
                    <span class="info-col">  
                    <span class="info-itemlabel">车主电话：</span>
                    <span>{{detailsData.phone}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">车主驾照号：</span>
                    <span>{{detailsData.licenseNumber}}</span>
                    </span>
                </p>
                <p class="info-item">
                    <span class="info-col">  
                    <span class="info-itemlabel">车辆用途：</span>
                    <span>{{detailsData.vehicleBusiness}}</span>
                    </span>
                    <span class="info-col">
                    <span class="info-itemlabel">备注：</span>
                    <span>{{detailsData.remark}}</span>
                    </span>
                </p>
                <!-- <p class="info-item">
                    <span class="info-itemlabel">备注：</span>
                    <span>{{detailsData.remark}}</span>
                </p>     -->
          </div>
        </div>
        <div id="chexiang">
          <div class="content-title">
            <span>车辆照片</span>
          </div>
          <div style="padding:15px;height:calc(100% - 40px);display:flex;overflow:auto;">
            <div class="anjian-content">
                <div class="anjian-item"  v-for="(item,index) in imagesData" :key="item.id">
                    <div class="anjian-info">
                        <p class="anjian-img" @mouseover="showOperation(index)" @mouseleave="showOperation(-1)">
                          <img :src="BASE_IMG_URL+item" onerror="javascript:this.src='/static/image/anjian/default.png'" />
                          <span class="img-operation" v-if="activeIndex == index">
                            <span class="fa fa-search-plus" @click="showBiggerPic(item)"></span>
                            <span class="fa fa-floppy-o" @click="savePic(BASE_IMG_URL+item)"></span>
                            <!-- <span class="fa fa-trash-o" @click="delPic(item)"></span> -->
                          </span>
                        </p>
                        <p style="text-align: center;margin-top: 10px;font-size:12px;">车像{{index+1}}</p>
                    </div>
                </div>
            </div>
        </div>
        </div> 
        <!-- <div slot="footer" class="dialog-footer" style="text-align:center;padding:30px;clear:both;">
            <el-button type="primary" @click="dialogFormVisible = false" size='medium' style="width:120px;margin-right:50px;">修改</el-button>
            <el-button type="primary" @click="dialogFormVisible = false" size='medium' style="width:120px;">确定</el-button>
            <el-button type="primary" @click="backToShiyourenkou" size='medium' style="width:120px;">返回</el-button>
        </div>  -->
      </div>

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
      
    </div>    
  </div>
</template>

<script>
import { excontrolApi } from "@/https";

export default {
  name: "cheliangxiangqing",
  data() {
    return {
        detailsData:{},
        imagesData:[
        {
            title: '人像1',
            src:'',
            id:'',
        },
        ],
        clID: '',
        activeIndex: '-1',
        imgVisibility: false,
        biggerImageUrl: '',
    }
  },
   created() {
    // this.clID = this.$route.query.id_number;
  },
  mounted() {
      // this.getclDetail();
  },
  methods: {
    initDetals(id) {
      this.clID = id;
       this.getclDetail();
      //  this.getpersonInDanwei(1);
    },
    backToShiyourenkou(){
       this.$router.push({path:'/yibiaosishi/shiyoucheliang'});
     },
    getclDetail() {
      let param = {};
      param.pageNum = 1;
      param.pageSize = 1;
      param.plateNumber = this.clID;

      return excontrolApi
        .shiyoucheliangSearch(param)
        .then(res => res.data)
        .then(data => {
          // loading.close();
       //   this.srcrestotal = data.total;
          //生成表格
          this.detailsData = data.rows[0];
          this.imagesData = this.detailsData.imageUrls.split(",");
        });
    },
    showOperation(idx) {
      this.activeIndex = idx;
    },
    showBiggerPic(url) {
      this.biggerImageUrl = url;
      this.imgVisibility = true;
    },
    savePic(src) {
      var canvas = document.createElement('canvas');
      var img = document.createElement('img');
      img.onload = function(e) {
          canvas.width = img.width;
          canvas.height = img.height;
          var context = canvas.getContext('2d');
          context.drawImage(img, 0, 0, img.width, img.height);
          canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
          canvas.toBlob((blob)=>{
              let link = document.createElement('a');
              link.href = window.URL.createObjectURL(blob);
              link.download = src.substring(src.lastIndexOf("/")+1,src.length);
              link.click();  
          }, "image/jpeg");
      }
      img.setAttribute("crossOrigin",'Anonymous');
      img.src = src;
    },
    delPic(url) {

    }
  },
}
</script>
<style scoped>
#cljiben,
#chexiang,
#bukongsearch {
  width: 100%;
  border: 1px solid #d9dfe5;
  box-sizing: border-box;
  background: #fff;
}
#cljiben,#chexiang {
  width: calc(50% - 15px);
  height: 500px;
  float: left;
}
#chexiang {
  float: right;
  margin-bottom: 40px;
}

strong {
  font-weight: normal;
}

.info-con {
  display: flex;
  flex-direction: column;
  flex: 1;
  border-right: 1px solid #3d5e67;
}

.info-item {
  display: flex;
  flex: 1;
  color: #333;
  background: none;
  /* justify-content: space-between; */
  padding-left: 7px;
  margin-bottom: 25px;
}
.info-item div {
  display: block;
  width: 100%;
  height: auto;
}
.info-itemlabel {
  color: #333;
  margin-right: 10px;
  width: 80px;
  text-align: right;
}

.info-item .info-col
{
    margin-right: 10px;
    width: 50%;
}

.info-item .info-col span {
    white-space: nowrap;
    display: inline-block;
}

.anjian-info {

}

.anjian-img {
  width: 180px;
  height: 135px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.anjian-img img {
  max-width: 100%;
  max-height: 100%;
}

.anjian-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.anjian-item {
  border-top: none;
  margin-top: 6px;
  /* margin: 10px 15px; */
}
.anjian-item:nth-child(1),.anjian-item:nth-child(2),.anjian-item:nth-child(3),.anjian-item:nth-child(4) {
    margin-top: 0;
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
}
.img-operation span {
  flex: 1;
  color: #fff;
  font-size: 15px;
  cursor: pointer;
}
.popover-content {
  margin: 0;
}
.picture-bigger {
    width: 100%;
    height: 500px;
    text-align: center;
    line-height: 500px;
}
.picture-bigger img {
  max-width: 100%;
  max-height: 480px;
}
</style>
      