<template>
  <div id="contentbody" class="content-body">
    <div class="page-bread">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>实有车辆</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-row">
      <div class="content-center">
        <div id="tongji">
          <div class="content-title">
            <span>车辆情况</span>
          </div>
          <div style="margin:15px;display:flex;">
            <div id="zaikongliang" class="item_zaikongliang">
              <span class="icon_zaikongliang">车辆</span>
              <div style="width:100%;height:100%">
                <div class="item-bukong">
                  <p class='bukong-type'>
                    <span></span> 总量</p>
                  <span class="spanman">
                    <strong class="num">{{totalcount}}</strong> 辆</span>
                </div>

                <div class="item-bukong">
                  <p class='bukong-type'>
                    <span></span> 非营运</p>
                  <span class="spanman">
                    <strong class="num">{{noBusinesscount}}</strong> 辆</span>
                </div>

                <div class="item-bukong">
                  <p class='bukong-type'>
                    <span></span> 营运</p>
                  <span class="spanman">
                    <strong class="num">{{businesscount}}</strong> 辆</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="bukong">
          <div class="content-title">
            <span>车辆操作</span>
          </div>
          <div class="row">
            <div class="fn-bls">
              <div tag="div" id="addcontroldiv" class="ic_bukongbtn add_bukong" @click="showNewMessageBox">
              </div>
            </div>
            <div class="fn-bls">
              <!-- <router-link tag="div" id="controlyjdiv" class="ic_bukongbtn piliangdaoru" v-bind:to="'#'">
              </router-link> -->
              <div class="ic_bukongbtn piliangdaoru">
                <el-upload class="pl-upload avatar-uploader" action="#" ref="uploadfilepl" :show-file-list="false" :auto-upload="false" :on-change='plchangeUpload' accept=".xls,.xlsx" drag>
                  <div class="avatar-uploader-idiv">
                    <i class="avatar-uploader-icon identity-batch"></i>
                    <div v-if="plfileUrl" class="avatar-uploader-p" style="font-size:16px">
                      {{plfileUrlname}}
                      <div class="face-modal"></div>
                    </div>
                    <!-- <p v-else>
                      <span style="font-size:16px">上传附件</span>
                    </p> -->
                  </div>
                  <label class="el-upload-list__item-status-label" v-show="pldeleteshow">
                  <span class="re-upload">重新上传</span>
                  </label>
                </el-upload>
              </div>
            </div>
            <div class="fn-bls">
              <router-link tag="div" id="controlyjdiv" class="ic_bukongbtn shujudaochu" v-bind:to="'#'">
              </router-link>
            </div>
          </div>
        </div>
        <div class="clearfix"></div>
        <div id="bukongsearch" style="margin:20px 0;">
          <div class="content-title">
            <span>快速查询</span>
          </div>
          <div style="margin-top:20px;padding:0 10px;">
	  <div class="search-group">
            <div  style="margin-right:30px;">
              <el-input v-model="searchkey" style="width:560px;">
              </el-input>
            </div>
            <span>
              <button class="btn btn-info ridiusnull btn-search" type="button" @click="searchFuzzyEvent(1)">查询</button>
              <a @click="toggleGaoji">高级搜索</a>
            </span>
          </div> 
          <div class="gaojisearch" v-if="isGaojijiansuo">
            <div class="search-group">
              <div class="search-item">
                <span class="label">车牌号码：</span>
                <el-input v-model="searchform.plateNumber" style="width:calc(100% - 100px);"></el-input>
              </div>
              <div class="search-item">
                <span class="label">车牌颜色：</span>
                <el-select v-model="searchform.plateColor" placeholder="请选择" style="width:calc(100% - 100px);" clearable>
                  <el-option
                    v-for="item in cpys"
                    :key="item.id"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </div>
              <!-- <div class="search-item">
                <span class="label">车辆颜色：</span>
                <el-select v-model="vehicleColor" placeholder="请选择"  clearable>
                  <el-option
                    v-for="item in clys"
                    :key="item.id"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </div>
              <div class="search-item">
                <span class="label">车位：</span>
                <el-input v-model="parking">
                </el-input>
              </div> -->
              <div class="search-item">
                <span class="label">车主姓名：</span>
                <el-input v-model="searchform.hostName" style="width:calc(100% - 100px);">
                </el-input>
              </div>
              <div class="search-item">
                <span class="label">身份证号：</span>
                <el-input v-model="searchform.idNumber" style="width:calc(100% - 100px);">
                </el-input>
              </div>
              
              <!-- <span class="search-item">
                <button class="btn btn-info ridiusnull btn-search" type="button" @click="searchExcontrol(1)">查询</button>
              </span> -->
            </div>
            <div class="search-group" style="justify-content: start;margin-left: 32px;">
              <div class="search-item">
                <span class="label">车架号：</span>
                <el-input v-model="searchform.frameNumber" style="width:calc(100% - 100px);">
                </el-input>
              </div>
            </div>

            <!-- <div class="search-group">
              <div class="search-item">
                <span class="label">车辆品牌：</span>
                <el-select v-model="vehicleBrand" placeholder="请选择" clearable>
                  <el-option-group
                    v-for="group in clpps"
                    :key="group.label"
                    :label="group.title">
                    <el-option
                      v-for="item in group.items"
                      :key="item.id"
                      :label="item.label"
                      :value="item.label">
                    </el-option>
                  </el-option-group>
                </el-select>
              </div>
              <div class="search-item">
                <span class="label">车型：</span>
                <el-input v-model="vehicleType"></el-input>
              </div>
              <div class="search-item">
                <span class="label">年款：</span>
                <el-select v-model="vehicleStyles" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in yearStyle"
                    :key="item.id"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </div>
              
              <div class="search-item">
                <span class="label">车主电话：</span>
                <el-input v-model="czPhone">
                </el-input>
              </div>
              <div class="search-item">
                <span class="label">车主驾照号：</span>
                <el-input v-model="licenseNumber">
                </el-input>
              </div>
             </div> -->
	    <div style="width:100%;text-align:center;margin-top: 10px;margin-bottom:0px;">
                    <button class="btn btn-info ridiusnull btn-search" type="button" @click="doGaojijiansuo = 'all';searchExcontrol(1)">查询</button>
                    <button class="btn btn-info ridiusnull btn-search" type="button" @click="clearSearchItem()">重置</button>
                    <button class="btn btn-info ridiusnull btn-search" type="button" @click="toggleNormal()">取消</button>
              </div>
            </div>
            <div id="bukongsearchdiv" style="margin-top:10px;" v-show="srcresshow">
              <div class="model-hold">
                <el-table :data="srcTableData" height="calc(100vh - 540px)">
                  <el-table-column type="index" width="50" label="序号">
                  </el-table-column>
                  <el-table-column prop="plateNumber" label="车牌号码" min-width="100">
                  </el-table-column>
                  <!-- <el-table-column prop="plateColor" label="车牌颜色" min-width="80">
                  </el-table-column>
                  <el-table-column prop="vehicleColor" label="车辆颜色" min-width="80">
                  </el-table-column>
                  <el-table-column prop="vehicleBrand" label="车辆品牌" min-width="80" >
                  </el-table-column>
                  <el-table-column prop="vehicleType" label="车型" min-width="80" >
                  </el-table-column>
                  <el-table-column prop="vehicleStyles" label="年款" min-width="80">
                  </el-table-column>
                  <el-table-column prop="parking" label="车位" min-width="80" >
                  </el-table-column> -->
                  <el-table-column prop="frameNumber" label="车架号" min-width="180">
                  </el-table-column>                  
                  <el-table-column prop="hostName" label="车主姓名" min-width="80" >
                  </el-table-column>
                  <el-table-column prop="idNumber" label="身份证号" min-width="180">
                  </el-table-column>
                  <el-table-column prop="phone" label="联系电话" min-width="120">
                  </el-table-column>
                  <!-- <el-table-column prop="licenseNumber" label="车主驾照号" min-width="180" >
                  </el-table-column> -->
                  <el-table-column label="操作" min-width="300" fixed='right'>
                    <template slot-scope="scope">
                      <el-button type="text" size="small" class="operate-btn" @click="lookbkdetail(scope.row)">
                        <i class="fa fa-file-text-o"></i> 查看详情</el-button>
                        <el-button type="text" size="small" class="operate-btn" @click="editbkdetail(scope.row)">
                        <i class="fa fa-pencil-square-o"></i> 修改</el-button>    
                        <el-button type="text" size="small" class="operate-btn" @click="deletebkdetail(scope.row)">
                        <i class="fa fa-undo"></i> 删除</el-button>                                      
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <el-pagination background @current-change="searchExcontrol" :page-size="10" :current-page.sync="currentPage" layout="total, prev, pager, next, jumper" :total="srcrestotal">
              </el-pagination>
            </div>

          </div>
        </div>

        <el-dialog
          title="新增车辆"
          :visible.sync="isShowNewMessageBox"
          width="980px"
          height="628px"
          class="modal-popover"
          :close-on-click-modal='false'
          :before-close="closeAddForm"
          >
          <el-form :model="form" :inline="true" ref="form" class="newform newclform" style="padding:10px;">
           <el-form-item> 
            <el-form-item label="车牌：" prop="plateNumber">
              <el-input v-model="form.plateNumber"></el-input>
            </el-form-item>
            <el-form-item label="车牌颜色：" prop="plateColor">
              <el-select v-model="form.plateColor" placeholder="请选择"  clearable>
                <el-option
                  v-for="item in cpys"
                  :key="item.id"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form-item>

          <el-form-item>
            <el-form-item label="车辆颜色：" prop="vehicleColor">
              <el-select v-model="form.vehicleColor" placeholder="请选择"  clearable>
                  <el-option
                    v-for="item in clys"
                    :key="item.id"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="车辆品牌：" prop="vehicleBrand">
              <el-select v-model="form.vehicleBrand" placeholder="请选择" clearable>
                <el-option-group
                  v-for="group in clpps"
                  :key="group.label"
                  :label="group.title">
                  <el-option
                    v-for="item in group.items"
                    :key="item.id"
                    :label="item.label"
                    :value="item.label">
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-form-item>

          <el-form-item>
            <el-form-item label="车型：" prop="vehicleType" required>
              <el-select v-model="form.vehicleType" placeholder="请选择">
                <el-option label="机动车" value="机动车"></el-option>
                <el-option label="非机动车" value="非机动车"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="年款：" prop="vehicleStyles">
              <el-select v-model="form.vehicleStyles" placeholder="请选择" clearable>
                <el-option
                  v-for="item in yearStyle"
                  :key="item.id"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form-item>

          <el-form-item>
            <el-form-item label="车架号：" prop="frameNumber">
              <el-input v-model="form.frameNumber"></el-input>
            </el-form-item>
            <el-form-item label="车位：" prop="parking">
              <el-input v-model="form.parking"></el-input>
            </el-form-item>
          </el-form-item>

          <el-form-item>
            <el-form-item label="车主：" prop="hostName">
              <el-input v-model="form.hostName"></el-input>
            </el-form-item>
            <el-form-item label="车主身份证：" prop="idNumber">
              <el-input v-model="form.idNumber" class="czsfz"></el-input>
            </el-form-item>
            <el-form-item >
              <el-button type="primary" size='small' @click="showSelectRenyuan" style="width:98px;font-size:12px;">选择已有人员</el-button>
            </el-form-item>
          </el-form-item>

          <el-form-item>
            <el-form-item label="车主电话：" prop="phone">
              <el-input v-model="form.phone"></el-input>
            </el-form-item>
            <el-form-item label="车主驾照号：" prop="idNumber">
              <el-input v-model="form.licenseNumber"></el-input>
            </el-form-item>
          </el-form-item>
          <el-form-item label="车辆用途：" prop="remark">
            <el-select v-model="form.vehicleBusiness" placeholder="请选择"  clearable>
                  <el-option
                    v-for="item in clyt"
                    :key="item.id"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
          </el-form-item>

          <el-form-item label="备注：" prop="remark">
            <el-input type="textarea" v-model="form.remark" style="width:650px;" :rows="3"></el-input>
          </el-form-item>

          </el-form>
          <div class="pic-group">
            <div class="picture-hold">
                <p class="pic-btn">车像</p>
                <div class="pic-wrap">
                  <el-upload action='' class="avatar-uploader" :show-file-list="false" :auto-upload="false" :on-change="readManImage" accept="image/jpeg,image/png">
                    <i  v-if="imageCar.url" class="clear-pic fa fa-times-circle-o" @click.stop="clearImg"></i>
                    <i class="cx-icon defaul-sym" style="font-size:30px"></i>
                    <p class="up-text">上传车像</p>
                    <img v-if="imageCar.url" :src="imageCar.url" class="avatar">
                  </el-upload>
                </div>
              </div>
          </div>

          <el-dialog
            title="选择已有人员"
            :visible.sync="isShowSelectRenyuan"
            width="1060px"
            height="628px"
            class="modal-popover"
            :close-on-click-modal='false'
            :before-close="closeYyry"
            append-to-body
            >
            <el-form :model="yyryform" :inline="true" ref="yyryform" class="newform" style="padding:10px;">
            <el-form-item> 
                <el-form-item label="小区名称：" prop="xqmc">
                  <el-select v-model="yyryform.xqmc" disabled placeholder="请选择" clearable>
                    <el-option
                      v-for="item in xqoptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="楼栋名称：" prop="ldmc">
                  <el-select v-model="yyryform.ldmc" disabled placeholder="请选择" clearable>
                    <el-option
                      v-for="item in ldoptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="单元名称：" prop="dymc">
                  <el-select v-model="yyryform.dymc" disabled placeholder="请选择" clearable>
                    <el-option
                      v-for="item in dyoptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item >
                  <el-button type="primary" size='small' @click="getrkDetail(1)" style="margin-left:25px;width:105px;font-size:12px;">查询</el-button>
                </el-form-item>
            </el-form-item>

            <el-form-item>
              <el-form-item label="姓名：" prop="xm">
                <el-input v-model="yyryform.xm"></el-input>
              </el-form-item>
              <el-form-item label="身份证：" prop="idNumber">
                <el-input v-model="yyryform.idNumber"></el-input>
              </el-form-item>
              <el-form-item label="居住地址" prop="gzdw">
                <el-input v-model="yyryform.gzdw"></el-input>
              </el-form-item>
              <el-form-item >
                  <el-button type="primary" size='small' @click="clearYyryForm" style="margin-left:25px;width:105px;font-size:12px;">重置</el-button>
              </el-form-item>
            </el-form-item>
            </el-form>
          
              <div style="margin-top:10px;" v-show="srcresshow">         
                <div class="model-hold">
                  <el-table :data="yyryTableData">
                    <el-table-column align="center" width="55">
                      <template slot-scope="scope">
                          <el-radio :label="scope.$index" v-model="selectedIdx" @change.native="getTemplateRow(scope.$index,scope.row)">&nbsp;</el-radio>
                      </template>
                    </el-table-column>
                    <el-table-column prop="name" label="姓名" min-width="50">
                    </el-table-column>
                    <el-table-column prop="idNumber" label="身份证" min-width="110">
                    </el-table-column>
                    <el-table-column label="出生日期" min-width="80" >
                      <template slot-scope="scope">
                        {{getFormatDateYear(scope.row.birthdate)}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="residence" label="地址" min-width="100" >
                    </el-table-column>
                    <!-- <el-table-column prop="communityName" label="小区名称" min-width="100" >
                    </el-table-column>
                    <el-table-column prop="buildingName" label="楼栋名称" min-width="100" >
                    </el-table-column> -->
                    <el-table-column prop="company" label="工作单位" min-width="80">
                    </el-table-column>
                    <el-table-column prop="political" label="政治面貌" min-width="80" >
                    </el-table-column>                  
                    <el-table-column prop="education" label="文化程度" min-width="80">
                    </el-table-column>
                    <el-table-column prop="phone" label="电话" min-width="80">
                    </el-table-column>
                  </el-table>
                </div>
                <el-pagination background @current-change="getrkDetail" :page-size="10" :current-page.sync="currentYyryPage" layout="total, prev, pager, next, jumper" :total="yyrytotal">
                </el-pagination>
              </div>

            <div slot="footer" class="dialog-footer" style="text-align:center;">
              <el-button type="primary" @click="closeYyry" size='medium' style="width:120px;margin-right:50px;">取 消</el-button>
              <el-button type="primary" @click="getSelRowData" size='medium' style="width:120px;">确定</el-button>
            </div>
          </el-dialog>

           <div slot="footer" class="dialog-footer" style="text-align:center;">
            <el-button type="primary" @click="closeAddForm" size='medium' style="width:120px;margin-right:50px;">取 消</el-button>
            <el-button type="primary" @click="addShiyouCheliang" size='medium' style="width:120px;">录入</el-button>
          </div>
        </el-dialog> 

        <el-dialog
          title="查看详情"
          :visible.sync="isShowDetails"
          width="80%"
          height="628px"
          top="5vh"
          class="modal-popover"
          :close-on-click-modal='false'
          >
          <cl-details ref="cldetails"></cl-details>
          <div slot="footer" class="dialog-footer" style="text-align:center;padding-top:0px;clear: both;">
              <el-button type="primary" @click="isShowDetails=false;vifdetails=false;" size='medium' style="width:120px;">返 回</el-button>
          </div>
      </el-dialog>

      </div>
    </div>
</div>
</template>
<script>
import { excontrolApi } from "@/https";

export default {
  name: "shiyoucheliang",
  data() {
    return {
      isGaojijiansuo: false, 
      searchkey:'',
      doGaojijiansuo: 'all',
      plfileUrl: '',
      plfileUrlname: '',
      pldeleteshow: false,
      totalcount:'',
      businesscount:'',
      noBusinesscount:'',
      form: {
        plateNumber: '',
        plateColor: '',
        vehicleColor: '',
        vehicleBrand: '',
        vehicleType: '',
        vehicleStyles: '',
        frameNumber: '',
        parking: '',
        hostName: '',
        idNumber: '',
        phone: '',
        idNumber: '',
        vehicleBusiness:'',
        remark: ''
      },
      yyryform: {
        xqmc: '',
        ldmc: '',
        dymc: '',
        xm: '',
        idNumber: '',
        gzdw: ''
      },
      yyryTableData: [],
      yyrytotal: 0,
      srcrestotal: 0,
      currentPage: 1,
      currentYyryPage: 1,
      srcresshow: true,
      datetimerange: [],
      controlpeople:null,
      controlcar:null,
      xqoptions:[],
      ldoptions:[],
      dyoptions:[],
      bukongtype: '',
      bukongkey:'',
      bukongbh: '',
      srcTableData:[],
      dxpp:'',
      cpys: ['黑色','白色','蓝色','黄色','绿色'],
      clys: ['黑色','白色','灰色','红色','蓝色','黄色','橙色','棕色','绿色','紫色','青色','粉色','其他'],
      clyt: ['运营','非运营'],
      yearStyle: [2012,2013,2014,2015,2016,2017,2018],
      cphm:'',
      clpp:'',
      ryID:'',
      ryxm:'',
      isShowNewMessageBox:false,
      isShowSelectRenyuan:false,
      imageCar: {
        url:''
      },
      searchform:{
        plateNumber:'',
        plateColor:'',
        hostName:'',
        idNumber:'',
        frameNumber:'',
      },
      plateNumber:'',
      plateColor:'',
      vehicleColor:'',
      parking:'',
      hostName:'',
      idNumber:'',
      vehicleBrand:'',
      vehicleType: '',
      vehicleStyles: '',
      frameNumber: '',
      czPhone: '',
      licenseNumber: '',
      clpps: [],
      selectedIdx: -1,
      selectedRow: {},
      isShowDetails: false,
      currentId: '',
      disabledEdit: false,
      vifdetails:false,
    };
  },
  beforeRouteEnter(to, from, next) {
      if (from.name=='cheliangxiangqing') {
         to.meta.isBack = true;
      }

      next();
  },
  activated() {
      if (!this.$route.meta.isBack) {
        this.currentPage = 1;
        this.clearSearchItem();
        this.searchExcontrol(1);
        this.getVillageSelect();
      }
      this.$route.meta.isBack = false;
  },
  created() {
    this.clpps = JSON.parse(localStorage.getItem('clpplist')) || [];
  },
  mounted() {
    this.searchExcontrol(1);
    this.getVillageSelect();
    this.getCheliangCount();
  },
  components: {
    "cl-details": () => import("@/views/yibiaosishi/shiyoucheliang/DetailsCheliang"),
  },
  methods: {
    toggleGaoji() {
      if(this.isGaojijiansuo==false)
      {
        this.clearSearchItem();
        this.isGaojijiansuo = true;
      }
      else if(this.isGaojijiansuo==true)
      {
        this.isGaojijiansuo = false;
      }
    },

    toggleNormal() {
      this.isGaojijiansuo = false;
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getCheliangCount(){
      return excontrolApi
        .yibiaosishiCheliangCount()
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.totalcount = data.total;
          this.businesscount = data.business;
          this.noBusinesscount = data.noBusiness;
        });

    },

    getVillageSelect(){
        return excontrolApi
        .renkouGetVillage()
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.gxoptions = data;
          
        });
    },

    showNewMessageBox(){
        this.isShowNewMessageBox = true;
    },
    showSelectRenyuan(){
      this.isShowSelectRenyuan = true;
      this.getrkDetail(1);
      // this.isShowNewMessageBox = false;
    },
    getBase64Image:function(img, callback) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        // var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
        // var ext = 'image/jpeg';
        // var dataURL = canvas.toDataURL(ext);
        let _this = this;
        canvas.toBlob((blob)=>{
          _this.blobToDataURL(blob,function(dataurl) {
            callback(dataurl);
          })
          // let link = window.URL.createObjectURL(blob);
            
        }, "image/jpeg");

        // return dataURL;
    },
    blobToDataURL(blob, callback) {
        var a = new FileReader();
        a.onload = function (e) { callback(e.target.result); }
        a.readAsDataURL(blob);
    },
    addShiyouCheliang(){
        if(this.form.vehicleType=='')
        {
            this.$alert("请选择车型", "提示", {
            confirmButtonText: "确定"
            });
            return;
        }

        // let param = {};
        // param.entity = this.form;
        // 图片转base64编码
        let imgLink = this.imageCar;
        
        if (imgLink.url) {
          let tempImage = new Image();
          // tempImage.src = imgLink.url;
          // tempImage.type = imgLink.raw.type;
          // tempImage.crossOrigin = "*";
          // param.imageBase64 = this.getBase64Image(tempImage).replace('data:image/jpeg;base64,', '');
          let _this = this;
          tempImage.onload = function(e) {
              _this.getBase64Image(tempImage, _this.addData);     
          }
          tempImage.setAttribute("crossOrigin",'Anonymous');
          tempImage.src = imgLink.url;
        } else {
          // param.imageBase64 = "";
          this.addData();
        }
    },
    addData(dataurl) {
      let param = {};
      param.entity = this.form;
      param.imageBase64 = '';
      if (dataurl) {
       param.imageBase64 = dataurl.replace('data:image/jpeg;base64,', '');
      }
      return excontrolApi
        .shiyoucheliangNewche(param)
        .then(res => res)
        .then(data => {
          if (data.code == 200) {
            this.$message({
              message: data.msg,
              type: "success"
            });
            this.closeAddForm();
            this.getCheliangCount();
          }
        })
    },
    updateData(dataurl) {
      let param = {};
      param.entity = this.form;
      param.imageBase64 = '';
      if (dataurl) {
       param.imageBase64 = dataurl.replace('data:image/jpeg;base64,', '');
      }
      // return excontrolApi
      //   .shiyoucheliangNewche(param)
      //   .then(res => res)
      //   .then(data => {
      //     if (data.code == 200) {
      //       this.$message({
      //         message: data.msg,
      //         type: "success"
      //       });
      //       this.closeAddForm();
      //     }
      //   })
    },
    getTemplateRow(index, row) {         //获取选中数据
      this.selectedIdx = index;
      this.selectedRow = row;
    },
    getSelRowData() {
      this.form.idNumber = this.selectedRow.idNumber;
      this.form.phone = this.selectedRow.phone;
      this.form.hostName = this.selectedRow.name;
      this.selectedIdx = -1;
      this.isShowSelectRenyuan = false;
    },
    readManImage: function(file) {
      this.imageCar = file;
      this.imageCar.url = URL.createObjectURL(file.raw);
    },
    clearImg() {
      this.imageCar = {};
      return false;
    },
    lookbkdetail(data) {
      // console.log(data)
      // this.$router.push({path:'/yibiaosishi/cheliangxiangqing',query: {id_number: data.plateNumber}});
      this.currentId = data.plateNumber;
      this.isShowDetails = true;
      this.$nextTick(()=>{
          this.$refs.cldetails.initDetals(data.plateNumber);
      });
    },
    editbkdetail(data) {
      // console.log(data)
      // this.$router.push({path:'/yibiaosishi/bukongxiangqing',query: {pro_id: data.dispositionID, type: 'edit'}});
    },
    deletebkdetail(data) {
      this.$confirm("确定要删除该条车辆信息？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        //撤销布控
        let param={};
        param.id = data.id;
        return excontrolApi
        .shiyoucheliangDelete(param)
        .then(res => res)
        .then(data => {
            if(data.code==200)
            {
                this.$message({
                message: data.msg,
                type: "success"
              }); 
              this.searchExcontrol(1);
              this.getCheliangCount();
            }
            else{
              this.$message({
                message: data.msg,
                type: "info"
              });  
            } 
        })
      })         
      .catch(() => {
          
      });
    },

    searchFuzzyEvent: function(ctrcurrentPage) {
      this.doGaojijiansuo = 'keyword';
      this.searchExcontrol(ctrcurrentPage);
    }, 
    searchExcontrol: function(ctrcurrentPage) {
      if(this.doGaojijiansuo == 'keyword')
      {
        let param = {};
        param.pageNum = ctrcurrentPage;
        param.pageSize = 10;
        if(this.searchkey){
        // param.content = this.searchkey;
        param.queryString = this.searchkey;
      }
      // param.type="motorvehicle";

      // return excontrolApi
      return excontrolApi
        .shiyoucheliangSearch(param)
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.srcrestotal = data.total;
          //生成表格
          this.srcTableData = data.rows;
          for(var i=0;i<this.srcTableData.length;i++)
          {
            this.srcTableData[i].eventDate = this.getFormatDate(this.srcTableData[i].eventDate, 'YYYY-MM-DD HH:mm');
          }

        });

      }
      let param = {};
      param.pageNum = ctrcurrentPage;
      param.pageSize = 10;

      if(this.searchform.plateNumber){
        param.plateNumber = this.searchform.plateNumber;
      }
      if(this.searchform.plateColor){
        param.plateColor = this.searchform.plateColor;
      }
      // if(this.vehicleColor){
      //   param.vehicleColor = this.vehicleColor;
      // }
      // if(this.parking){
      //   param.parking = this.parking;
      // }
      if(this.searchform.hostName){
        param.hostName = this.searchform.hostName;
      }
      if(this.searchform.idNumber){
        param.idNumber = this.searchform.idNumber;
      }
      // if(this.vehicleBrand){
      //   param.vehicleBrand = this.vehicleBrand;
      // }
      // if(this.vehicleType){
      //   param.vehicleType = this.vehicleType;
      // }
      // if(this.vehicleStyles){
      //   param.vehicleStyles = this.vehicleStyles;
      // }
      if(this.searchform.frameNumber){
        param.frameNumber = this.searchform.frameNumber;
      }
      // if(this.czPhone){
      //   param.phone = this.czPhone;
      // }
      // if(this.licenseNumber){
      //   param.licenseNumber = this.licenseNumber;
      // }
    
      // param = Object.assign(param, this.yjquery);
      return excontrolApi
        .shiyoucheliangSearch(param)
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.srcrestotal = data.total;
          //生成表格
          this.srcTableData = data.rows;
        });
    },
    clearSearchItem() {
      this.searchform.plateNumber  = '';
      this.searchform.plateColor = '';
      this.searchform.hostName = '';
      this.searchform.idNumber = '';
      this.searchform.frameNumber = '';
      // this.plateNumber = '';
      // this.plateColor = '';
      // this.vehicleColor = '';
      // this.parking = '';
      // this.hostName = '';
      // this.idNumber = '';
      // this.vehicleBrand = '';
      // this.vehicleType = '';
      // this.vehicleStyles = '';
      // this.frameNumber = '';
      // this.czPhone = '';
      // this.licenseNumber = '';
    },
    getrkDetail(pagenum) {
      let param = {};
      param.pageNum = pagenum || 1;
      param.pageSize = 10;

      if(this.yyryform.xm!='')
      {
        param.name = this.yyryform.xm;
      }
      if(this.yyryform.idNumber!='')
      {
        param.id_number = this.yyryform.idNumber;
      }
      if(this.yyryform.gzdw!='')
      {
        param.residence = this.yyryform.gzdw;
      }

      return excontrolApi
        .shiyourenkouSearch(param)
        .then(res => res.data)
        .then(data => {
          //生成表格
          this.yyryTableData = data.rows;
          this.yyrytotal = data.total;
        });
    },
    closeAddForm() {
      this.clearAddForm();
      this.isShowNewMessageBox = false;
    },
    clearAddForm() {
      this.clearImg();
      this.$refs["form"].resetFields();
    },
    clearYyryForm() {
      this.$refs["yyryform"].resetFields();
    },
    closeYyry() {
      this.clearYyryForm();
      this.isShowSelectRenyuan = false;
    },

       //文件上传预览
    plchangeUpload(file) {
      if (file) {
        let Xls = file.name.split('.');
        let index = Xls.length - 1;
        if (Xls[index] === 'xls' || Xls[index] === 'xlsx') {
          this.plfileUrlname = file.name;
          this.plfileUrl = file.raw;
          this.pldeleteshow = true;
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
  }
};
</script>

<style scoped>
.fn-bls {
  display: block;
  width: 30%;
  max-width: 220px;
  margin: 5px 3% 5px 0;
  float: left;
}
strong {
  font-weight: normal;
}
.dropdown-menu.force-to-show {
  display: block;
}

input[type="radio"] {
  margin: 8px 0 0;
}

/* padding */

.padding-5 {
  padding-left: 5px;
  padding-right: 5px;
}

.marginb-10 {
  margin-bottom: 10px;
}

/* 改写row,去掉margin */

.row {
  margin: 15px;
}

/* 加粗的span */

.ic_strongspan {
  font-size: 15rem;
  font-weight: bold;
  padding-right: 10px;
}

/* 设定div高度 */

.ic_linediv {
  /* line-height: 60px;
min-height: 60px; */
  line-height: 32px;
  min-height: 32px;
  padding: 10px 0;
}

/* 设定对象添加div */

.ic_objectadd {
  margin: 10px 0px;
}

/* 设定靠底部的a */

.ic_abottom {
  text-decoration: underline;
  position: absolute;
  bottom: 0px;
  padding-left: 10px;
  width: 100px;
  color: #13b1e1;
}

/* 勾选框样式修正 */

.ic_objcheck {
  margin: 20px -20px 0 !important;
}

/* 档案div */

.ic_record {
  line-height: 32px;
  padding: 20px 20px 0px 20px;
  /* margin-top: 20px; */
  /* border-top: 1px dashed #d9dfe5; */
}

/* 重写属性 */

.ic_panel-title {
  font-size: 14px;
}

/* 布控要素行 */

.ic_yaosutable {
  display: table;
  border: 1px solid #dcebf7;
  width: 100%;
}

.ic_yaosurow {
  display: table-row;
}

.ic_yaosuname {
  text-align: right;
  padding: 6px 10px 6px 4px;
  vertical-align: middle;
  display: table-cell;
  background-color: #edf3f4;
  border-top: 1px solid #f7fbff;
  min-width: 90px;
}

.ic_yaosuvalue {
  padding-left: 12px;
  padding: 6px 4px 6px 6px;
  display: table-cell;
  width: 40%;
}

/* ---------------------------------------布控首页-------------------------------- */

#tongji,
#bukong,
#bukongsearch {
  width: 100%;
  border: 1px solid #d9dfe5;
  box-sizing: border-box;
  background: #fff;
}
#tongji,#bukong {
  width: calc(50% - 10px);
  float: left;
}
#bukong {
  float: right;
}
#bukongsearch {
  min-height: calc(100vh - 330px);
  margin-bottom: 10px;
  position: relative;
}
.model-hold {
  margin-bottom: 50px;
}
.item-bukong {
  width: 33.3%;
  height: 80px;
  margin: 10px 0;
  padding: 0 30px;
  border-right: 1px solid #d9dfe5;
  float: left;
  box-sizing: border-box;
}
.item-bukong:last-child {
  border-right: none;
}
.item-bukonglg {
  width: 40%;
  height: 80px;
  margin: 10px 0;
  padding: 0 10px;
  border-right: 1px solid #d9dfe5;
  float: left;
  box-sizing: border-box;
}
.item-bukonglg:last-child {
  border-right: none;
}
.bukong-type {
  height: 40px;
  line-height: 40px;
  margin:0;
}
.icon_zaikongliang {
  width: 268px;
  height: 100px;
  display: block;
  background: url(../../../../static/image/yibiaosishi/cheliang.png) no-repeat;
  background-color: #13b1e1;
  background-position: 40px center;
  float: left;
  padding-left: 100px;
  line-height: 100px;
  font-size: 18px;
  color: #fff;
}
.item_zaikongliang {
  height: 100px;
  width: 900px;
  display: flex;
  border: 1px solid #d9dfe5;
  margin: 5px 0;
  overflow: hidden;
  border-bottom-left-radius: 4px;
  border-top-left-radius: 4px;
}
.icon_zaikongliang:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
}
.num {
  font-size: 20px;
  font-weight: bold;
}
.spanman {
  width: 100%;
  height: 40px;
  background-color: #fff;
  color: #555;
  font-size: 16px;
  text-align: left;
  display: inline-block;
  margin:0;
}
/* 操作div */

.ic_bukongbtn {
  width: 100%;
  height: 100px;
  margin: 0 auto;
  padding: 10px 0px;
  cursor: pointer;
}
.add_bukong {
  background: url(../../../../static/image/yibiaosishi/cheliangluru.png) no-repeat;
  background-size: auto 100%;
  background-position: left;
}
.cheliang_bukong {
  background: url(../../../../static/image/yibiaosishi/piliangdaoru.png) no-repeat;
  background-size: auto 100%;
  background-position: left;
}

.piliangdaoru {
  background: url(../../../../static/image/yibiaosishi/piliangdaoru.png) no-repeat;
  background-size: auto 100%;
  background-position: left;
}
.shujudaochu {
  background: url(../../../../static/image/yibiaosishi/shujudaochu.png) no-repeat;
  background-size: auto 100%;
  background-position: left;
}
.btn-info {
  background-color: #13b1e1;
  border: none;
  margin: 0 15px;
}
.btn-info:hover {
  border: none;
  outline: none;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
}
.btn-info:focus,
.btn-info:active,
.btn-info:visited {
  border: none;
  outline: none;
  background-color: #13b1e1;
}
.btn-search {
  min-width: 100px;
}
.search-group {
  display: flex;
  flex: 1;
  justify-content: center;
}
.search-item {
  display: flex;
  width:380px;
  margin-right: 20px;
  margin-bottom: 15px;
  flex-direction: row;
  flex: 0 1 auto;
  justify-content: center;
  align-items: center;
}
.search-item .label {
  width: 100px;
  text-align: right;
  color: #595959;
  font-weight: normal;
  font-size: 100%;
}
.pic-group {
  position: absolute;
  top: 20px;
  right: 10px;
}
.picture-hold {
  position: relative;
  display: inline-block;
  width: 110px;
  height: 200px;
  margin: 0px 20px;
}
.pic-btn {
  width: 104px;
  height: 28px;
  line-height: 24px;
  margin-top: 10px;
  text-align: center;
  color: #555759;
  /* background: #f1f4f5; */
  /* border: 1px solid #d8dfe5; */
}
.pic-wrap {
  position: relative;
  margin-top:10px;
  width: 104px;
  height: 124px;
  line-height: 118px;
  text-align: center;
  cursor: pointer;
  border: 1px solid #8394a1;
  background: #f2f2f2;
}
.pic-wrap img {
  position: relative;
  z-index: 3;
}
.clear-pic {
  position: absolute;
  display: block;
  font-size:18px;
  right: 0;
  top: 0;
  z-index: 30;
  color: #f00;
}
.defaul-sym {
  position: absolute;
  display: block;
  width: 100%;
  height: 80px;
  left: 0;
  top: 0;
  font-size: 40px;
}
.up-text {
  position: absolute;
  width: 100%;          
  bottom: 8px;
  left:0;
  height: 20px;
  line-height: 20px;
  text-align: center;
  color: #555759;
}
.cx-icon {
  background-image: url("/static/image/jiansuo/cx-icon.png");
  background-repeat: no-repeat;
  background-position: center;
}

.shujudaochu {
  background: url(../../../../static/image/yibiaosishi/shujudaochu.png) no-repeat;
  background-size: auto 100%;
  background-position: left;
}

.gaojisearch {
    background: #f2f2f2;
    padding: 20px;
    margin-top: 30px;
    margin-bottom: 20px;
}
/* ---------------------------------------布控首页结束-------------------------------- */
</style>