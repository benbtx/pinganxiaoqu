<template>
  <div id="contentbody" class="content-body">
    <div class="page-bread">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/yibiaosishi/shiyourenkou'}">实有人口</el-breadcrumb-item>
        <el-breadcrumb-item>查看详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-row">
      <div class="content-center">
        <div id="jiben">
          <div class="content-title">
            <span>基本信息</span>
          </div>
          <div style="margin:20px 0;">
                <p class="info-item">
                    <span class="info-col">  
                        <span class="info-itemlabel">姓名：</span>
                        <span>{{xqform.name}}</span>
                    </span>
                    <span class="info-col">  
                      <span class="info-itemlabel">身份证号码：</span>
                      <span>{{xqform.idNumber}}</span>
                    </span>
                    <span class="info-col">  
                      <span class="info-itemlabel">性别：</span>
                      <span>{{xqform.gender}}</span>
                    </span>
                </p>
                <p class="info-item">
                    <span class="info-col">  
                    <span class="info-itemlabel">出生日期：</span>
                    <span>{{xqform.birthdate}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">民族：</span>
                    <span>{{xqform.nation}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">籍贯：</span>
                    <span>{{xqform.nativeInfo}}</span>
                    </span>
                </p>
                <p class="info-item">
                    <span class="info-col">  
                    <span class="info-itemlabel">婚姻状况：</span>
                <span>{{xqform.marriage}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">政治面貌：</span>
                    <span>{{xqform.political}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">文化程度：</span>
                    <span>{{xqform.education}}</span>
                    </span>
                </p>
                <p class="info-item">
                    <span class="info-col">  
                    <span class="info-itemlabel">手机号码：</span>
                    <span>{{xqform.phone}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">人口类型：</span>
                    <span>{{xqform.personType}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">优抚对象：</span>
                    <span>{{xqform.preferential}}</span>
                    </span>
                </p>
                <p class="info-item">
                    <span class="info-col">  
                    <span class="info-itemlabel">重点人员：</span>
                    <span>{{xqform.specialPerson}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">风险等级：</span>
                    <span>{{xqform.specialLevel}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">宗教信仰：</span>
                    <span>{{xqform.religion}}</span>
                    </span>
                </p>
                <p class="info-item">
                    <span class="info-col">  
                    <span class="info-itemlabel">户口类型：</span>
                    <span>{{xqform.registeredType}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">养老保险：</span>
                    <span>{{xqform.endowmentInsurance}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">医疗保险：</span>
                    <span>{{xqform.medicalInsurance}}</span>
                    </span>
                </p>
                <p class="info-item">
                    <span class="info-col">  
                    <span class="info-itemlabel">健康状况：</span>
                    <span>{{xqform.health}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">身高：</span>
                    <span>{{xqform.height}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">血型：</span>
                    <span>{{xqform.bloodType}}</span>
                    </span>                    
                </p>
                <p class="info-item">
                    <span class="info-col">  
                      <span class="info-itemlabel">工作单位：</span>
                      <span>{{xqform.company}}</span>
                    </span>
                    <span class="info-col" style="width:68%">  
                      <span class="info-itemlabel">住址：</span>
                      <span>{{xqform.residence}}</span>
                    </span>
                </p>

                <!-- <p class="info-item">
                    <span class="info-col"  style="width:50%">  
                    <span class="info-itemlabel">单位</span>
                    <span>{{xqform.company}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">与单位关系</span>
                    <span>{{xqform.ydwgx}}</span>
                    </span>
                </p> -->
                <p class="info-item">
                    <span class="info-itemlabel">备注：</span>
                    <span>{{xqform.remarks}}</span>
                </p>    
          </div>
        </div>
        <div id="renxiang">
          <div class="content-title">
            <span>人口照片</span>
          </div>
          <div style="margin:15px;display:flex;">
            <div class="anjian-content">
                <div class="anjian-item"  v-for="(item, index) in anjianData" :key="item.id">
                    <p class="anjian-img" @mouseover="showOperation(index)" @mouseleave="showOperation(-1)">
                      <img :src="BASE_IMG_URL+item" onerror="javascript:this.src='/static/image/anjian/default.png'" />
                      <span class="img-operation" v-if="activeIndex == index">
                        <span class="fa fa-search-plus" @click="showBiggerPic(item)"></span>
                        <span class="fa fa-floppy-o" @click="savePic(BASE_IMG_URL+item)"></span>
                        <!-- <span class="fa fa-trash-o" @click="delPic(item)"></span> -->
                      </span>
                    </p>
                    <p style="text-align: center;margin-top: 10px;font-size:12px;">人像{{index+1}}</p>
                </div>
            </div>
        </div>

        </div>  

        <!-- <div class="dialog-footer" style="text-align:center;padding:30px;clear:left;">
            <el-button type="primary" @click="dialogFormVisible = false" size='medium' style="width:120px;margin-right:50px;">修改</el-button>
            <el-button type="primary" @click="backToShiyourenkou" size='medium' style="width:120px;">返回</el-button>
        </div>     -->

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
  name: "bukongxiangqing",
  data() {
    return {
    anjianData:[
        {
            title: '人像1',
            src:'',
            id:'',
        },
        // {
        //     title: '人像2',
        //     src:'',
        //     id:'',
        // },
        // {
        //     title: '人像3',
        //     src:'',
        //     id:'',
        // },
        // {
        //     title: '人像4',
        //     src:'',
        //     id:'',
        // },
        // {
        //     title: '人像5',
        //     src:'',
        //     id:'',
        // },
        // {
        //     title: '人像6',
        //     src:'',
        //     id:'',
        // },
        // {
        //     title: '人像7',
        //     src:'',
        //     id:'',
        // },
        // {
        //     title: '人像8',
        //     src:'',
        //     id:'',
        // },
        // {
        //     title: '人像9',
        //     src:'',
        //     id:'',
        // },
        // {
        //     title: '人像10',
        //     src:'',
        //     id:'',
        // },
        // {
        //     title: '人像11',
        //     src:'',
        //     id:'',
        // },
        // {
        //     title: '人像12',
        //     src:'',
        //     id:'',
        // },
        
      ],
      xqform:
      {
        name:'',
        idNumber:'',
        gender:'',
        birthdate:'',
        nation:'',
        nativeInfo:'',
        marriage:'',
        political:'',
        education:'',
        phone:'',
        personType:'',
        specialPerson:'',
        preferential:'',
        clxx:'',
        registeredType:'',
        endowmentInsurance:'',
        medicalInsurance:'',
        health:'',
        militaryState:'',
        religion:'',
        company:'',
        height:'',
        bloodType:'',
        residence:'',
        roomAddress:'',
        yhzgx:'',
        ydwgx:'',
        remarks:'',
      },
      cxID:'',
      activeIndex: '-1',
      imgVisibility: false,
      biggerImageUrl: '',
    }
  },

    created() {
  //  let type = this.$route.query.type;

    // this.cxID = this.$route.query.id_number;

  },
  mounted() {
      // this.getrkDetail();
  },

   methods: {
     initDetals(id) {
      this.cxID = id;
       this.getrkDetail();
      //  this.getpersonInDanwei(1);
    },
     backToShiyourenkou(){
       this.$router.push({path:'/yibiaosishi/shiyourenkou'});
     },
    getrkDetail(){
      let param = {};
      param.pageNum = 1;
      param.pageSize = 1;
      param.idNumber = this.cxID;

      return excontrolApi
        .shiyourenkouSearch(param)
        .then(res => res.data)
        .then(data => {
          // loading.close();
       //   this.srcrestotal = data.total;
          //生成表格
          this.xqform = data.rows[0];

          this.xqform.birthdate = this.getFormatDateYear(this.xqform.birthdate);
          if(this.xqform.residence!='')
            {
              if(this.xqform.roomAddress&&this.xqform.roomAddress!='')
              {
                this.xqform.residence += this.xqform.roomAddress;
              }
              else{

              }
            }
  
          if(this.xqform.imageUrls)
          {
            this.anjianData = this.xqform.imageUrls.split(",");
          }
         

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
      // let a = document.createElement('a');
      // a.download = url.substring(url.lastIndexOf("/")+1,url.length);
      // a.href = url;
      // a.click();
      
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
#jiben,
#renxiang,
#bukongsearch {
  width: 100%;
  border: 1px solid #d9dfe5;
  box-sizing: border-box;
  background: #fff;
}
#jiben,#renxiang {
  width: calc(50% - 15px);
  height: 600px;
  float: left;
}
#renxiang {
  float: right;
  height: 600px;
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
  /* margin-right: 10px; */
  width: 86px;
  text-align: right;
}

.info-item .info-col
{
    /* margin-right: 10px; */
    width: 33.3%;
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
      