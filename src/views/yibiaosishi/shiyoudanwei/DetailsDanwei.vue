<template>
  <div id="contentbody" class="content-body">
    <div class="page-bread">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/yibiaosishi/shiyoudanwei'}">实有单位</el-breadcrumb-item>
        <el-breadcrumb-item>查看详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-row">
      <div class="content-center">
        <div id="fwjiben">
          <div class="content-title">
            <span>基本信息</span>
          </div>
          <div style="margin:20px 0;height:calc(100% - 40px);overflow:auto;">
                <p class="info-item">
                    <span class="info-col">  
                        <span class="info-itemlabel">单位名称：</span>
                        <span>{{xqform.companyName}}</span>
                    </span>
                    <!-- <span class="info-col">  
                    <span class="info-itemlabel">住户编号：</span>
                    <span>{{xqform.company_name}}</span>
                    </span> -->
                    <span class="info-col">  
                    <span class="info-itemlabel">税务登记号：</span>
                    <span>{{xqform.taxId}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">单位性质：</span>
                    <span>{{xqform.companyType}}</span>
                    </span>
                </p>
                <p class="info-item">
                    <span class="info-col">  
                    <span class="info-itemlabel">行业类型：</span>
                    <span>{{xqform.industryType}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">经营方式：</span>
                    <span>{{xqform.managementMode}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">经营范围：</span>
                    <span>{{xqform.businessScope}}</span>
                    </span>
                </p>
                <p class="info-item">
                    <span class="info-col" style="width:800px;">  
                    <span class="info-itemlabel">单位地址：</span>
                    <span>{{xqform.address}}</span>
                    </span>
                </p>
                <p class="info-item">
                    <span class="info-col">  
                    <span class="info-itemlabel">经营期限：</span>
                    <span>{{xqform.managementPeriod}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">联系电话：</span>
                    <span>{{xqform.phone}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">单位人数：</span>
                    <span>{{xqform.temporaryCount+xqform.workerCount}}</span>
                    </span>
                </p>
                <p class="info-item">
                    <span class="info-col">  
                    <span class="info-itemlabel">临时工人数：</span>
                    <span>{{xqform.temporaryCount}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">法人姓名：</span>
                    <span>{{xqform.legalPerson}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">身份证号码：</span>
                    <span>{{xqform.idNumber}}</span>
                    </span>
                </p>
                <p class="info-item">
                    <span class="info-col">  
                    <span class="info-itemlabel">法人电话：</span>
                    <span>{{xqform.legalPersonPhone}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">营业执照号：</span>
                    <span>{{xqform.businessLicense}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">组织机构代码：</span>
                    <span>{{xqform.organizationCode}}</span>
                    </span>
                </p>
            
                <p class="info-item">
                    <span class="info-itemlabel">备注：</span>
                    <span>{{xqform.remark}}</span>
                </p>    
          </div>
        </div>
        <div id="fwpic">
          <div class="content-title">
            <span>单位图片</span>
          </div>
          <div style="padding:15px;height:calc(100% - 40px);display:flex;overflow:auto;">
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
                    <p style="text-align: center;margin-top: 10px;font-size:12px;">单位图{{index+1}}</p>
                </div>
            </div>
        </div>

        </div>  

        <div id="fwinfo" style="clear:both;">
          <div class="content-title">
            <span>单位人口信息</span>
          </div>    
          <div id="bukongsearchdiv" style="margin-top:10px;" >         
              <div class="model-hold">
                <el-table :data="srcTableData">
                  <el-table-column  type="selection" width="55">
                  </el-table-column>
                  <el-table-column prop="name" label="姓名" min-width="80">
                  </el-table-column>
                  <el-table-column prop="idNumber" label="身份证" min-width="150" >
                  </el-table-column>
                  <el-table-column prop="gender" label="性别" min-width="80" >
                  </el-table-column>
                  <el-table-column prop="birthdate" label="出生日期" min-width="150">
                  </el-table-column>
                  <el-table-column prop="nation" label="民族" min-width="80">
                  </el-table-column>
                  <!-- <el-table-column prop="dispositionID" label="籍贯" min-width="80" >
                  </el-table-column> -->
                  <el-table-column prop="dispositionID" label="婚姻状况" min-width="80" >
                  </el-table-column>
                  <el-table-column prop="targetFeature" label="政治面貌" min-width="80" >
                  </el-table-column>
                  <el-table-column prop="targetFeature" label="文化程度" min-width="80" >
                  </el-table-column>
                  <el-table-column prop="dispositionID" label="与单位关系" min-width="100" >
                  </el-table-column>
                  <!-- <el-table-column label="操作" min-width="300" fixed='right'>
                    <template slot-scope="scope">
                      <el-button type="text" size="small" class="operate-btn" @click="lookbkdetail(scope.row)">
                        <i class="fa fa-file-text-o"></i> 查看详情</el-button>                                   
                    </template>
                  </el-table-column> -->
                </el-table>
              </div>
              <el-pagination background @current-change="getpersonInDanwei" :page-size="10" :current-page.sync="currentPage" layout="total, prev, pager, next, jumper" :total="srcrestotal">
              </el-pagination>
            </div>
        </div>

        <!-- <div slot="footer" class="dialog-footer" style="text-align:center;padding:30px;">
            <el-button type="primary" @click="dialogFormVisible = false" size='medium' style="width:120px;margin-right:50px;">修改</el-button>
            <el-button type="primary" @click="dialogFormVisible = false" size='medium' style="width:120px;">确定</el-button>
            <el-button type="primary" @click="backToShiyourenkou" size='medium' style="width:120px;">返回</el-button>
        </div> -->
        
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
  name: "danweixiangqing",
  data() {
    return {
      xqform:{},
    anjianData:[
        {
            title: '户型图1',
            src:'',
            id:'',
        },        
      ],
      srcTableData:[],
      cxID:'',
      activeIndex: '-1',
      imgVisibility: false,
      biggerImageUrl: '',
      currentPage: 0,
      srcrestotal: 0,

    }
  },
  created() {
  //  let type = this.$route.query.type;

    // this.cxID = this.$route.query.id_number;

  },
  mounted() {
    // this.getdwDetail();
    // this.getpersonInDanwei(1);
  },

   methods: {
     initDetals(id) {
      this.cxID = id;
       this.getdwDetail();
       this.getpersonInDanwei(1);
    },
    backToShiyourenkou(){
       this.$router.push({path:'/yibiaosishi/shiyoudanwei'});
     },

     getpersonInDanwei(currentPage){
      let param = {};
      let _this = this;
      param.pageNum = currentPage;
      param.pageSize = 10;
      param.companyId = _this.cxID;

      return excontrolApi
        .danweiDetailsPersonInCompany(param)
        .then(res => res.data)
        .then(data => {
          // loading.close();
         _this.srcrestotal = data.total;
          //生成表格
          _this.srcTableData = data.rows;
          for(var i=0;i<_this.srcTableData.length;i++)
          {
            _this.srcTableData[i].birthdate = _this.getFormatDate(_this.srcTableData[i].birthdate);
          }


        });

    }, 
     getdwDetail(){
      let param = {};
      param.pageNum = 1;
      param.pageSize = 1;
      param.id = this.cxID;

      return excontrolApi
        .shiyoudanweiSearch(param)
        .then(res => res.data)
        .then(data => {
          // loading.close();
       //   this.srcrestotal = data.total;
          //生成表格
          this.xqform = data.rows[0];

          this.xqform.managementPeriod = this.getFormatDateYear(this.xqform.managementPeriod);
          // this.xqform.residence +=this.xqform.roomAddress;
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
#fwjiben,
#fwpic,
#fwinfo,
#bukongsearch {
  width: 100%;
  border: 1px solid #d9dfe5;
  box-sizing: border-box;
  background: #fff;
}
#fwjiben,#fwpic {
  width: calc(50% - 6px);
  height: 436px;
  float: left;
}
#fwpic {
  float: right;
  overflow-y: auto;
  margin-bottom:20px;
}

#fwinfo {
  position: relative;
  /* width: 856px; */
  height: 264px;
  /* float: bottom; */
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
  width: 96px;
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
  /* flex-direction: row; */
  flex-wrap: wrap;
  justify-content: space-between;
}

.anjian-item {
  border-top: none;
  margin-top: 20px;
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
      