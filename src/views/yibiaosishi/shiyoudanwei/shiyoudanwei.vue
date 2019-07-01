<template>
  <div id="contentbody" class="content-body">
    <div class="page-bread">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>实有单位</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-row">
      <div class="content-center">
        <div id="tongji">
          <div class="content-title">
            <span>单位情况</span>
          </div>
          <div style="margin:15px;display:flex;">
            <div id="zaikongliang" class="item_zaikongliang">
              <span class="icon_zaikongliang">单位</span>
              <div style="width:100%;height:100%">
                <div class="item-bukong">
                  <p class='bukong-type'>
                    <span></span> 总量</p>
                  <span class="spanman">
                    <strong class="num">{{totalcount}}</strong> 家</span>
                </div>

                <div class="item-bukong">
                  <p class='bukong-type'>
                    <span></span> 企业</p>
                  <span class="spanman">
                    <strong class="num">{{qiyecount}}</strong> 家</span>
                </div>

                <div class="item-bukong">
                  <p class='bukong-type'>
                    <span></span> 个体</p>
                  <span class="spanman">
                    <strong class="num">{{geticount}}</strong> 家</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="bukong">
          <div class="content-title">
            <span>单位操作</span>
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
                <span class="label">所属社区：</span>
                <el-select v-model="searchform.villageId" placeholder="请选择" filterable style="width:calc(100% - 100px);" clearable>
                  <el-option
                    v-for="item in gxoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div class="search-item">
                <span class="label">单位名称：</span>
                <el-input style="width:calc(100% - 100px);" v-model="searchform.companyName">
                </el-input>
              </div>
              <div class="search-item">
                <span class="label">单位地址：</span>
                <el-input style="width:calc(100% - 100px);" v-model="searchform.address">
                </el-input>
              </div>
              <div class="search-item">
                <span class="label">法人姓名：</span>
                <el-input style="width:calc(100% - 100px);" v-model="searchform.legalPerson">
                </el-input>
              </div>
            </div>

            <div class="search-group" style="justify-content: start;margin-left: 32px;">
              <div class="search-item">
                <span class="label">身份证号：</span>
                <el-input style="width:calc(100% - 100px);" v-model="searchform.idNumber">
                </el-input>
              </div>
              <div class="search-item">
                <span class="label">单位性质：</span>
                <el-input style="width:calc(100% - 100px);" v-model="searchform.companyType">
                </el-input>
              </div>
              <div class="search-item">
                <span class="label">经营范围：</span>
                <el-input style="width:calc(100% - 100px);" v-model="searchform.businessScope">
                </el-input>
              </div>           
            </div>
   
              <div style="width:100%;text-align:center;margin-top: 10px;margin-bottom:0px;">
                    <button class="btn btn-info ridiusnull btn-search" type="button" @click="doGaojijiansuo = 'all';searchExcontrol(1)">查询</button>
                    <button class="btn btn-info ridiusnull btn-search" type="button" @click="clearSearchItem()">重置</button>
                    <button class="btn btn-info ridiusnull btn-search" type="button" @click="toggleNormal()">取消</button>
              </div>
       
            </div>
            <div id="bukongsearchdiv" style="margin-top:10px;" v-show="srcresshow">
              <div class="model-hold">
                <el-table :data="srcTableData" height="calc(100vh - 540px)">
                  <el-table-column type="index" width="80" label="序号">
                  </el-table-column>
                  <el-table-column prop="companyName" label="单位名称" min-width="180">
                  </el-table-column>                  
                  <el-table-column prop="address" label="单位地址" min-width="300">
                  </el-table-column>
                  <el-table-column prop="legalPerson" label="法人姓名" min-width="100" >
                  </el-table-column>
                  <el-table-column prop="idNumber" label="身份证号" min-width="160" >
                  </el-table-column>
                  <el-table-column prop="companyType" label="单位性质" min-width="100">
                  </el-table-column>
                  <el-table-column prop="businessScope" label="经营范围" min-width="100">
                  </el-table-column>
                  <!-- <el-table-column prop="industryType" label="行业类型" min-width="100">
                  </el-table-column>
                  <el-table-column prop="managementMode" label="经营方式" min-width="100" >
                  </el-table-column>
                  <el-table-column prop="businessLicense" label="营业执照号" min-width="190" >
                  </el-table-column>
                  <el-table-column prop="phone" label="联系电话" min-width="120">
                  </el-table-column>
                  <el-table-column prop="legalPersonPhone" label="法人电话" min-width="120">
                  </el-table-column>
                  <el-table-column prop="managementPeriod" label="经营期限" min-width="160" >
                  </el-table-column>
                  <el-table-column prop="communityName" label="小区名称" min-width="200" >
                  </el-table-column> -->
                  <el-table-column label="操作" min-width="300" fixed='right'>
                    <template slot-scope="scope">
                      <el-button type="text" size="small" class="operate-btn" @click="lookbkdetail(scope.row)">
                        <i class="fa fa-file-text-o"></i> 查看详情</el-button>
                        <!-- <el-button type="text" size="small" class="operate-btn" @click="editbkdetail(scope.row)">
                        <i class="fa fa-pencil-square-o"></i> 修改</el-button>     -->
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
          :title=isNeworEdit
          :visible.sync="isShowNewMessageBox"
          width="1060px"
          height="628px"
          class="modal-popover"
          :close-on-click-modal='false'
          :before-close="closeAddForm"
          >
          <!-- <el-form :model="form" :inline="true" style="text-align: center;margin-bottom:-20px;">
           <el-form-item label="新增方式：" prop="resource">
              <el-radio-group v-model="form.type">
                <el-radio label="新建人员"></el-radio>
                <el-radio label="添加已有人员"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form> -->
          <div style="border: 1px solid #CECDCD;">
          <el-form :model="addDanweiform.entity.company" ref="form" :inline="true" class="newform" style="padding:10px;">
           <el-form-item style="margin-top:-10px;">
             <div class="adddizhititle">单位基本信息</div>
           </el-form-item>  
           <el-form-item> 
            <el-form-item label="单位名称" prop="companyName">
              <el-input v-model="addDanweiform.entity.company.companyName" ></el-input>
            </el-form-item>
            <!-- <el-form-item label="住户编号">
              <el-input v-model="addDanweiform.entity.company.companyName" ></el-input>
            </el-form-item> -->
            <el-form-item label="单位性质" prop="companyType">
              <el-select v-model="addDanweiform.entity.company.companyType" placeholder="请选择">
                <el-option label="个体经营" value="个体经营"></el-option>
                <el-option label="企事业单位" value="企事业单位"></el-option>
                <el-option label="党政机关" value="党政机关"></el-option>
                <el-option label="医院" value="医院"></el-option>
                <el-option label="学校" value="学校"></el-option>
                <el-option label="部队" value="部队"></el-option>
              </el-select>
            </el-form-item>
          </el-form-item>

          <el-form-item style="width: 850px;">
            <el-form-item label="行业类型" prop="industryType">
              <el-input v-model="addDanweiform.entity.company.industryType" ></el-input>
            </el-form-item>
            <el-form-item label="经营方式" prop="managementMode">
              <el-input v-model="addDanweiform.entity.company.managementMode" ></el-input>
            </el-form-item>
            <el-form-item label="经营范围" prop="businessScope">
              <el-input v-model="addDanweiform.entity.company.businessScope" ></el-input>
            </el-form-item>
          </el-form-item>

          <el-form-item style="width: 850px;">
            <el-form-item label="税务登记号" prop="taxId">
              <el-input v-model="addDanweiform.entity.company.taxId" ></el-input>
            </el-form-item>
            <el-form-item label="经营期限" prop="managementPeriod">
              <!-- <el-input v-model="addDanweiform.entity.company.managementPeriod" ></el-input> -->
              <el-date-picker v-model="addDanweiform.entity.company.managementPeriod" type="datetime" style="width:440px" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>
          </el-form-item>

          <el-form-item style="width: 850px;">            
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="addDanweiform.entity.company.phone" ></el-input>
            </el-form-item>
            <el-form-item label="单位人数" prop="workerCount">
              <el-input v-model="addDanweiform.entity.company.workerCount" ></el-input>
            </el-form-item>
            <el-form-item label="临时工人数" prop="temporaryCount">
              <el-input v-model="addDanweiform.entity.company.temporaryCount" ></el-input>
            </el-form-item>
          </el-form-item>

          <el-form-item style="width: 850px;">
            <el-form-item label="营业执照号" prop="businessLicense">
              <el-input v-model="addDanweiform.entity.company.businessLicense" ></el-input>
            </el-form-item>
            <el-form-item label="组织机构代码" prop="organizationCode">
              <el-input v-model="addDanweiform.entity.company.organizationCode" ></el-input>
            </el-form-item>
            <el-form-item label="法人电话" prop="legalPersonPhone">
              <el-input v-model="addDanweiform.entity.company.legalPersonPhone" ></el-input>
            </el-form-item>
          </el-form-item>

          <el-form-item style="width: 850px;">
            <el-form-item label="法人姓名" prop="legalPerson">
              <el-input v-model="addDanweiform.entity.company.legalPerson" ></el-input>
            </el-form-item>
            <el-form-item label="身份证号码" prop="idNumber">
              <el-input v-model="addDanweiform.entity.company.idNumber" ></el-input>
            </el-form-item>
            <el-form-item prop="">
              <el-button type="primary" size='small' @click="showSelectFaren" style="width:98px;font-size:12px;margin-left:20px;">选择法人</el-button>
            </el-form-item>  
          </el-form-item>

          <el-form-item style="width: 850px;">
            <el-form-item label="单位地址" class='dwdwdz' prop="address">
              <el-input v-model="addDanweiform.entity.company.address" ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size='small' @click="showSelectZhuzhi" style="width:98px;font-size:12px;margin-left:20px;">选择单位地址</el-button>
            </el-form-item>  
          </el-form-item>

          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="addDanweiform.entity.company.remark" style="width:697px;"></el-input>
          </el-form-item>

          </el-form>
          <div class="pic-group">
            <div class="picture-hold">
                <p class="pic-btn">单位图片</p>
                <div class="pic-wrap">
                  <el-upload action='' class="avatar-uploader" :show-file-list="false" :auto-upload="false" :on-change="readImage" accept="image/jpeg,image/png">
                    <i  v-if="imageDanwei.url" class="clear-pic fa fa-times-circle-o" @click.stop="clearImg"></i>
                    <i class="dw-icon defaul-sym" style="font-size:30px"></i>
                    <p class="up-text">上传单位图片</p>
                    <img v-if="imageDanwei.url" :src="imageDanwei.url" class="avatar">
                  </el-upload>
                </div>
              </div>
          </div>
          </div>
          <div  class="yitianjiarenyuan">
          <div class="content-title">
            <span>已添加人员</span>
            <span class="fa fa-plus-circle fr xzrybtn" @click="newRenyuan">新增人员</span>
          </div>
              <div id="bukongsearchdiv" style="padding:10px;" v-show="srcresshow">         
              <div class="model-hold">
                <el-table :data="dwryTableData">
                  <el-table-column type="index" width="80" label="序号">
                  </el-table-column>
                  <el-table-column prop="name" label="姓名" min-width="80">
                  </el-table-column>
                  <el-table-column prop="idNumber" label="身份证" min-width="180" >
                  </el-table-column>
                  <el-table-column prop="birthdate" label="出生日期" min-width="180">
                  </el-table-column>
                  <el-table-column prop="phone" label="电话" min-width="110">
                  </el-table-column>                  
                  <el-table-column label="操作" min-width="300" fixed='right'>
                    <template slot-scope="scope">
                        <el-button type="text" size="small" class="operate-btn" @click="deletedwrk(scope.$index)">
                        <i class="fa fa-undo"></i> 删除</el-button>                                      
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <!-- <el-pagination background style="bottom:10px;" @current-change="getDwryTable" :page-size="10" :current-page.sync="currentPage1" layout="total, prev, pager, next, jumper" :total="dwrytotal">
              </el-pagination> -->
            </div>
      </div>

          <el-dialog
            title="选择单位地址"
            :visible.sync="isShowSelectZhuzhi"
            width="1060px"
            height="628px"
            class="modal-popover"
            :close-on-click-modal='false'
            :before-close="closeYyzz"
            append-to-body
            >

            <!-- <el-form :model="form" :inline="true" style="text-align: center;margin-bottom:-20px;">
            <el-form-item label="新增方式：" prop="resource">
                <el-radio-group v-model="form.type">
                  <el-radio label="新建人员"></el-radio>
                  <el-radio label="添加已有人员"></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form> -->

            <el-form :model="yyzzform" ref='yyzzform' :inline="true" class="newform" style="padding:10px;">
            <el-form-item> 
                <el-form-item label="小区名称：" prop="xqmc">
                  <!-- <el-select v-model="yyzzform.xqmc" disabled placeholder="请选择"  clearable>
                    <el-option
                      v-for="item in xqoptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select> -->
                  <el-input v-model="yyzzform.xqmc" ></el-input>
                </el-form-item>
                <el-form-item label="楼栋名称：" class="ldmc" prop="ldmc">
                  <!-- <el-select v-model="yyzzform.ldmc" disabled placeholder="请选择" clearable>
                    <el-option
                      v-for="item in ldoptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select> -->
                  <el-input v-model="yyzzform.ldmc" >
                    <template slot="append">栋</template>
                  </el-input>                  
                </el-form-item>
                <el-form-item label="单元名称：" class="dymc" prop="dymc">
                  <!-- <el-select v-model="yyzzform.dymc" disabled placeholder="请选择" clearable>
                    <el-option
                      v-for="item in dyoptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select> -->
                  <el-input v-model="yyzzform.dymc" >
                    <template slot="append">单元</template>
                  </el-input>
                </el-form-item>
                <el-form-item >
                  <el-button type="primary" size='small' @click="searchdizhi(1)" style="margin-left:25px;width:105px;font-size:12px;">查询</el-button>
                </el-form-item>
            </el-form-item>

            <el-form-item>
              <el-form-item label="姓名：" prop="name">
                <el-input v-model="yyzzform.name" ></el-input>
              </el-form-item>
              <el-form-item label="身份证：" prop="idCard">
                <el-input v-model="yyzzform.idCard" ></el-input>
              </el-form-item>
              <el-form-item label="房屋属性：" prop="fwsx">
                <el-select v-model="yyzzform.fwsx" placeholder="请选择">
                  <el-option label="一般租借" value="一般租借"></el-option>
                  <el-option label="闲置" value="闲置"></el-option>
                  <el-option label="自用" value="自用"></el-option>
                  <el-option label="其他租借" value="其他租借"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item >
                  <el-button type="primary" size='small' @click="clearYyzzForm" style="margin-left:25px;width:105px;font-size:12px;">重置</el-button>
              </el-form-item>
            </el-form-item>
            </el-form>
          
              <div id="selectdizhi" style="margin-top:10px;" v-show="srcresshow">         
                <div class="model-hold">
                  <el-table :data="srcDizhiData">
                    <el-table-column align="center" width="55">
                      <template slot-scope="scope">
                          <el-radio :label="scope.$index" v-model="selectedzzIdx" @change.native="getSelZhuzhiRow(scope.$index,scope.row)">&nbsp;</el-radio>
                      </template>
                    </el-table-column>
                    <el-table-column prop="houseType" label="房屋属性" min-width="80">
                    </el-table-column>
                    <el-table-column prop="communityName" label="小区名称" min-width="150" >
                    </el-table-column>
                    <el-table-column prop="buildingName" label="楼栋名称" min-width="80">
                    </el-table-column>
                    <el-table-column prop="unitName" label="单元号" min-width="80" >
                    </el-table-column>
                    <el-table-column prop="floor" label="楼层" min-width="80" >
                    </el-table-column>
                    <el-table-column prop="houseNumber" label="门牌号" min-width="80">
                    </el-table-column>
                    <el-table-column prop="address" label="详细地址" min-width="180">
                    </el-table-column>
                  </el-table>
                </div>
                <el-pagination background @current-change="searchdizhi" :page-size="10" :current-page.sync="currentPagezz" layout="total, prev, pager, next, jumper" :total="srcdizhitotal">
                </el-pagination>
              </div>

            <div slot="footer" class="dialog-footer" style="text-align:center;">
              <el-button type="primary" @click="closeYyzz" size='medium' style="width:120px;margin-right:50px;">取 消</el-button>
              <el-button type="primary" @click="getSelZhuzhiRowData" size='medium' style="width:120px;">确定</el-button>
            </div>
          </el-dialog>

          <el-dialog
            title="选择法人"
            :visible.sync="isShowSelectFaren"
            width="1060px"
            height="628px"
            class="modal-popover"
            :close-on-click-modal='false'
            :before-close="closeYzfrDialog"
            append-to-body
            >
            <el-form :model="xzfrform" :inline="true" ref="xzfrform" class="newform" style="padding:10px;">
            <el-form-item> 
                <el-form-item label="小区名称：" prop="xqmc">
                  <el-select v-model="xzfrform.xqmc" disabled placeholder="请选择" clearable>
                    <el-option
                      v-for="item in xqoptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="楼栋名称：" prop="ldmc">
                  <el-select v-model="xzfrform.ldmc" disabled placeholder="请选择" clearable>
                    <el-option
                      v-for="item in ldoptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="单元名称：" prop="dymc">
                  <el-select v-model="xzfrform.dymc" disabled placeholder="请选择" clearable>
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
                <el-input v-model="xzfrform.xm"></el-input>
              </el-form-item>
              <el-form-item label="身份证：" prop="idNumber">
                <el-input v-model="xzfrform.idNumber"></el-input>
              </el-form-item>
              <el-form-item label="居住地址" prop="gzdw">
                <el-input v-model="xzfrform.gzdw"></el-input>
              </el-form-item>
              <el-form-item >
                  <el-button type="primary" size='small' @click="clearXzfrForm" style="margin-left:25px;width:105px;font-size:12px;">重置</el-button>
              </el-form-item>
            </el-form-item>
            </el-form>
          
              <div style="margin-top:10px;" v-show="srcresshow">         
                <div class="model-hold">
                  <el-table :data="yyryTableData">
                    <el-table-column align="center" width="55">
                      <template slot-scope="scope">
                          <el-radio :label="scope.$index" v-model="selectedIdx" @change.native="getTemplateRow1(scope.$index,scope.row)">&nbsp;</el-radio>
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
              <el-button type="primary" @click="closeYzfrDialog" size='medium' style="width:120px;margin-right:50px;">取 消</el-button>
              <el-button type="primary" @click="getSelRowData" size='medium' style="width:120px;">确定</el-button>
            </div>
          </el-dialog>

           <el-dialog
          title="添加已有人员"
          :visible.sync="isShowNewRYdialog"
          width="1060px"
          height="628px"
          class="modal-popover"
          :close-on-click-modal='false'
          :before-close="closeYyry"
          append-to-body
          >

          <!-- <div style="border: 0px solid #CECDCD;" v-if="form.type =='添加已有人员'"> -->
          <div style="border: 0px solid #CECDCD;">
           <el-form :model="addRenkouSearchform" ref="yyryform" :inline="true" class="newform" style="padding:10px 0px;">
           <el-form-item> 
              <el-form-item label="姓名：" prop="name">
              <el-input v-model="addRenkouSearchform.name"></el-input>
            </el-form-item>
            <el-form-item label="身份证：" prop="idNumber">
               <el-input v-model="addRenkouSearchform.idNumber"></el-input>
            </el-form-item>
            <el-form-item label="电话：" prop="phone">
              <el-input v-model="addRenkouSearchform.phone"></el-input>
            </el-form-item>              
              <el-form-item >
                <el-button type="primary" size='small' @click="searchAddRenkou(1)" style="width:85px;font-size:12px;">查询</el-button>
              </el-form-item>
              <el-form-item >
                <el-button type="primary" size='small' @click="clearYyryForm" style="width:85px;font-size:12px;">重置</el-button>
            </el-form-item>
          </el-form-item>
          </el-form>
        
            <div id="bukongsearchdiv" style="margin-top:10px;padding-bottom:50px;position:relative;" v-show="srcresshow">         
              <div class="model-hold" style="margin-bottom:0px;">
                <el-table :data="searchAddRenkouTableData">
                  <!-- <el-table-column  type="selection" width="55">
                  </el-table-column> -->
                  <el-table-column align="center" width="55" label="" >
                      <template slot-scope="scope">
                          <el-radio class="ratio" :label="scope.$index" v-model="ratio" @change.native="getTemplateRow(scope.$index,scope.row)">&nbsp;</el-radio>
                      </template>
                  </el-table-column>
                  <el-table-column prop="name" label="姓名" min-width="80">
                  </el-table-column>
                  <el-table-column prop="idNumber" label="身份证" min-width="180" >
                  </el-table-column>
                  <el-table-column prop="birthdate" label="出生日期" min-width="180">
                  </el-table-column>
                  <el-table-column prop="political" label="政治面貌" min-width="80">
                  </el-table-column>
                  <el-table-column prop="education" label="文化程度" min-width="80" >
                  </el-table-column>
                  <el-table-column prop="phone" label="电话" min-width="150">
                  </el-table-column>
                  <el-table-column prop="endowmentInsurance" label="养老保险" min-width="80" >
                  </el-table-column>
                </el-table>
              </div>
              <el-pagination background @current-change="searchAddRenkou" :page-size="10" :current-page.sync="currentPage2" layout="total, prev, pager, next, jumper" :total="searchAddRenkouDatatotal">
              </el-pagination>
            </div>
          </div>

          <div slot="footer" class="dialog-footer" style="text-align:center;padding-top:0px;">
            <el-button type="primary" @click="closeYyry" size='medium' style="width:120px;margin-right:50px;">取 消</el-button>
            <el-button type="primary" @click="joinSelRy" size='medium' style="width:120px;">添加</el-button>
          </div>
        </el-dialog>

          <div slot="footer" class="dialog-footer" style="text-align:center;">
            <el-button type="primary" @click="closeAddForm" size='medium' style="width:120px;margin-right:50px;">取 消</el-button>
            <el-button type="primary" @click="newDanwei" size='medium' style="width:120px;">录入</el-button>
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
          <dw-details ref="dwdetails"></dw-details>
          <div slot="footer" class="dialog-footer" style="text-align:center;padding-top:0px;">
              <el-button type="primary" @click="isShowDetails=false;vifdetails=false;" size='medium' style="width:120px;margin-right:50px;">返 回</el-button>
        </div>
      </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import { excontrolApi } from "@/https";

export default {
  name: "shiyoudanwei",
  data() {
    return {
      isGaojijiansuo: false, 
      searchkey:'',
      doGaojijiansuo: 'all',
      searchform:{
        villageId:'',
        companyName:'',
        address :'',
        legalPerson:'',
        idNumber:'',
        companyType :'',
        businessScope :'',  
      },
      plfileUrl: '',
      plfileUrlname: '',
      pldeleteshow: false,
      totalcount:'',
      qiyecount:'',
      geticount:'',
      form: {
          name: '',
          sfz: '',
          xb: '',
          bthday:'',
          mz:'',
          jg:'',
          hyzk:'',
          zzmm:'',
          whcd:'',
          sjhm:'',
          rklx:'',
          tsrq:'',
          yfdx:'',
          clxx:'',
          jsdx:'',
          hklx:'',
          ylbx:'',
          ylbx:'',
          jkzk:'',
          byzk:'',
          zjrs:'',
          sg:'',
          xx:'',
          yhzgx:'',
          type:'',
          zz:'',
          dw:'',
          desc:'',
        },
      xzfrform: {
        xqmc: '',
        ldmc: '',
        dymc: '',
        xm: '',
        idNumber: '',
        gzdw: ''
      },               //法人相关

      yyzzform: {
        xqmc:'',
        ldmc:'',
        dymc:'',
        idCard:'',
        name:'',
        fwsx:''
      },
      addDanweiform:{
        entity:{
          company:{
              address:"",                //类型：String  必有字段  备注：无
              // addressCode:"",                //类型：String  必有字段  备注：标准地址id
              businessLicense:"",                //类型：String  必有字段  备注：无
              businessScope:"",                //类型：String  必有字段  备注：无
              code:"",                //类型：String  必有字段  备注：单位code
              communityId:"",                //类型：String  必有字段  备注：无
              communityName:"",                //类型：String  必有字段  备注：无
              companyName:"",                //类型：String  必有字段  备注：无
              companyType:"",                //类型：String  必有字段  备注：无
              housingCode:'',
              // id:'',
              idNumber:"",                //类型：String  必有字段  备注：无
              // imageUrls:'',
              industryType:"",                //类型：  必有字段  备注：无
              legalPerson:"",                //类型：  必有字段  备注：无
              legalPersonPhone:"",                //类型：  必有字段  备注：无
              managementMode:"",                //类型：  必有字段  备注：无
              managementPeriod:"",                //类型：  必有字段  备注：无
              organizationCode:'',          
              personObjects:"",                //类型：  必有字段  备注：无
              phone:"",                //类型：  必有字段  备注：无
              recordTime:"",                //类型：  必有字段  备注：无
              remark:'',
              temporaryCount:'',
              taxId:'',
              type:"",                //类型：String  必有字段  备注：无
              workerCount:'',
          },
          personCompanyList:[

          ],
        },
        imageBase64:''
      },  
      ratio:'',
      isShowSelectFaren:false,
      isShowNewRYdialog:false,
      isShowSelectRenyuan:false,
      selectedIdx: -1,
      selectedRow: {},
      selectedzzIdx: -1,
      selectedzzRow: {},
      dwrytotal:0,
      currentYyryPage:0,
      yyrytotal: 0,
      yyryTableData: [],
      srcdizhitotal:0,
      srcDizhiData:[],
      dwryTableData:[],
      templateSelection:{},
      searchAddRenkouTableData:[],
      searchAddRenkouDatatotal:0,
      addRenkouSearchform:{
        name:'',   //	姓名
        idNumber:'',  //身份证号
        phone:'',
      },
      srcrestotal: 0,
      currentPage: 1,
      currentPagezz:1,
      currentPage1:1,
      currentPage2:1,
      srcresshow: true,
      datetimerange: [],
      controlpeople:null,
      controlcar:null,
      gxoptions: [],
      ldoptions: [],
      dyoptions:[],
      xqoptions:[],
      bukongtype: '',
      bukongkey:'',
      bukongbh: '',
      srcTableData:[],
      isNeworEdit:'',
      isShowNewMessageBox:false,
      isShowSelectDanwei:false,
      isShowSelectZhuzhi:false,
      imageDanwei: {
        url:''
      },
      communityName:'',
      buildingName:'',
      address:'',
      companyType:'',
      businessScope:'',
      legalPerson:'',
      currentId: '',
      isShowDetails: false,
      vifdetails:false,
    };
  },
  beforeRouteEnter(to, from, next) {
      if (from.name=='bukongxiangqing') {
         to.meta.isBack = true;
      }

      next();
  },
  activated() {
      if (!this.$route.meta.isBack) {
        this.currentPage = 1;
        this.clearSearchItem();
        this.searchExcontrol(1);
        this.getDanweiCount();
        this.getVillageSelect();
      }
      this.$route.meta.isBack = false;
  },
  mounted() {
      this.searchExcontrol(1);
      this.getDanweiCount();
      this.getVillageSelect();
  },
  components: {
    "dw-details": () => import("@/views/yibiaosishi/shiyoudanwei/DetailsDanwei"),
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
    getDanweiCount(){
      return excontrolApi
        .yibiaosishiDanweiCount()
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.totalcount = data.total;
          this.qiyecount = data.enterprise;
          this.geticount = data.personal;
        });

    },

    getVillageSelect(){
        return excontrolApi
        .danweiGetVillage()
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.gxoptions = data;
          
        });
    },

    showNewMessageBox(){
        this.isNeworEdit="新增单位";
        this.addDanweiform.resetField;
        this.isShowNewMessageBox =true;
        this.dwryTableData=[];

    },
    showSelectDanwei(){
      this.isShowSelectDanwei = true;
      // this.isShowNewMessageBox=false;
    },
    showSelectZhuzhi(){
      this.searchdizhi(1);
      this.isShowSelectZhuzhi = true;
      // this.isShowNewMessageBox = false;
    },

    closeAddForm() {
      this.clearAddForm();
      this.isShowNewMessageBox = false;
    },
    clearAddForm() {
      this.clearImg();
      this.$refs["form"].resetFields();
    },

    readImage: function(file) {
      this.imageDanwei = file;
      this.imageDanwei.url = URL.createObjectURL(file.raw);
    },
    clearImg() {
      this.imageDanwei = {};
      return false;
    },
    lookbkdetail(data) {
      // console.log(data)
      // this.$router.push({path:'/yibiaosishi/danweixiangqing',query: {id_number: data.id}});

      this.currentId = data.id;
      this.isShowDetails = true;
      this.$nextTick(()=>{
          this.$refs.dwdetails.initDetals(data.id);
      });
    },
    editbkdetail(data) {
      // console.log(data)
      // this.$router.push({path:'/yibiaosishi/bukongxiangqing',query: {pro_id: data.dispositionID, type: 'edit'}});
    },
    deletebkdetail(data) {
      this.$confirm("确定要删除该条单位信息吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
         let param={};
        param.id = data.id;
        return excontrolApi
        .shiyoudanweiDelete(param)
        .then(res => res)
        .then(data => {
            if(data.code==200)
            {
                this.$message({
                message: data.msg,
                type: "success"
              }); 
              this.searchExcontrol(1);
              this.getDanweiCount();
              this.searchExcontrol(1);
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

    clearYyzzForm() {
      this.$refs["yyzzform"].resetFields();
    },
    closeYyzz() {
      this.clearYyzzForm();
      this.isShowSelectZhuzhi = false;
    },

    searchdizhi: function(ctrcurrentPage) {
      let param = {};
      param.pageNum = ctrcurrentPage;
      param.pageSize = 10;
   
      if(this.yyzzform.xqmc)
      {
        param.communityName = this.yyzzform.xqmc;
      }
      if(this.yyzzform.ldmc)
      {
        param.buildingName = this.yyzzform.ldmc+'栋';
      }
      if(this.yyzzform.dymc)
      {
        param.unitName = this.yyzzform.dymc+'单元';
      }
      if(this.yyzzform.name)
      {
        param.hostName = this.name;
      }

      if(this.yyzzform.idCard)
      {
        param.hostIdNumber = this.yyzzform.idCard;
      }
      if(this.yyzzform.fwsx)
      {
        param.houseType = this.yyzzform.fwsx;
      }

      // param = Object.assign(param, this.yjquery);


      // param.query = this.yjquery;
      //  let loading = this.$loading({
      //   lock: true,
      //   text: "数据查询中",
      //   spinner: "el-icon-loading",
      //   background: "rgba(0, 0, 0, 0.7)"
      // });
      return excontrolApi
        .shiyoufangwuSearch(param)
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.srcdizhitotal = data.total;
          //生成表格
          this.srcDizhiData = data.rows;
          for(var i=0;i<this.srcDizhiData.length;i++)
          {
            
          }
         

        });
    },

    getSelZhuzhiRow(index, row) {         //获取已有地址选中数据
        this.selectedzzIdx = index;
        this.selectedzzRow = row;
    },
    
    getSelZhuzhiRowData() {
      this.addDanweiform.entity.company.address = this.selectedzzRow.address;
      this.addDanweiform.entity.company.housingCode = this.selectedzzRow.id;
      this.selectedIzzdx = -1;
      this.isShowSelectZhuzhi = false;
    },

    showSelectFaren(){
      this.isShowSelectFaren = true;
      this.getrkDetail(1);
      // this.isShowNewMessageBox = false;
    },

    getrkDetail(pagenum) {
      let param = {};
      param.pageNum = pagenum || 1;
      param.pageSize = 10;
      if(this.xzfrform.xm)
      {
        param.name = this.xzfrform.xm;
      }

      if(this.xzfrform.idNumber)
      {
        param.idNumber = this.xzfrform.idNumber;
      }

      if(this.xzfrform.gzdw)
      {
        param.residence = this.xzfrform.gzdw;
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

    getTemplateRow1(index, row) {         //获取选中数据
      this.selectedIdx = index;
      this.selectedRow = row;
    },

    getSelRowData() {
      this.addDanweiform.entity.company.idNumber = this.selectedRow.idNumber;
      this.addDanweiform.entity.company.legalPersonPhone = this.selectedRow.phone;
      this.addDanweiform.entity.company.legalPerson = this.selectedRow.name;
      this.selectedIdx = -1;
      this.isShowSelectFaren = false;
    },

    clearXzfrForm() {
      this.$refs["xzfrform"].resetFields();
    },

    closeYzfrDialog() {
      this.clearXzfrForm();
      this.isShowSelectFaren = false;
    },

    newRenyuan(){
      // this.isShowNewMessageBox = false;
      this.searchAddRenkouTableData = [];
  //    this.isShowNewMessageBox = false;
      this.isShowNewRYdialog = true;
    },

    getTemplateRow(index,row){                                 //获取选中数据
        this.templateSelection = row;
    },

    joinSelRy(){
      if(this.ratio ==='')
       {
         this.$alert("请选择一个要添加的人员", "提示", {
          confirmButtonText: "确定"
        });
        return;
       }

       if(this.dwryTableData.length!=0)
       {
          for(var i=0;i<this.dwryTableData.length;i++)
          {
            if(this.templateSelection.idNumber==this.dwryTableData[i].idNumber)
            {
              this.$alert("不要重复加入同一人员", "提示", {
                confirmButtonText: "确定"
              });
              return;
            }
          }
       }
        let temp = {};
        temp = this.templateSelection;
        // temp.relation = this.addRenkouSearchform.realation;

        this.dwryTableData.push(temp);
        this.clearYyryForm();
        this.isShowNewRYdialog=false;
        this.isShowNewMessageBox = true;
        this.clearYyryForm();
    },

    searchAddRenkou: function(ctrcurrentPage) {
      let param = {};
      param.pageNum = ctrcurrentPage;
      param.pageSize = 10;

      if(this.addRenkouSearchform.name)
      {
        param.name = this.addRenkouSearchform.name;
      }
      if(this.addRenkouSearchform.idNumber)
      {
        param.id_number = this.addRenkouSearchform.idNumber;
      }

      if(this.addRenkouSearchform.phone)
      {
        param.phone = this.addRenkouSearchform.phone;
      }

      return excontrolApi
        .shiyourenkouSearch(param)
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.searchAddRenkouDatatotal = data.total;
          //生成表格
          this.searchAddRenkouTableData = [];
          this.searchAddRenkouTableData = data.rows;
          for(var i=0;i<this.searchAddRenkouTableData.length;i++)
          {
            this.searchAddRenkouTableData[i].birthdate = this.getFormatDate(this.searchAddRenkouTableData[i].birthdate);
          }
        });
    }, 

    clearYyryForm() {
      this.$refs["yyryform"].resetFields();
      this.ratio = '';
    },

    closeYyry() {
      this.clearYyryForm();
      this.isShowNewRYdialog = false;
    },

    deletedwrk(index){
      let _this = this;
        this.$confirm("确定要删除该人员？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
          _this.dwryTableData.splice(index,1);
      })         
      .catch(() => {
          
      });

        // this.dwryTableData.
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
     newDanwei(){
             // let param = {};
        // param.username = this.loginForm.username;
        // param.password = this.loginForm.password;
        // 图片转base64编码

        if(this.addDanweiform.entity.company.idNumber=='')
        {
          this.$alert("法人身份证不能为空", "提示", {
          confirmButtonText: "确定"
          });
          return;
        }

        if(this.dwryTableData.length!=0)
        {
            for(var i=0;i<this.dwryTableData.length;i++)
            {
              if(this.addDanweiform.entity.company.idNumber==this.dwryTableData[i].idNumber)
              {
                this.$alert("单位添加人员中不能和法人是同一个人", "提示", {
                  confirmButtonText: "确定"
                });
                return;
              }
            }
        }

      if(this.isNeworEdit=="新增单位")
      {
        return excontrolApi
        .fangwuInsertGetID({})
        .then(res => res)
        .then(data => 
        {
            if(data.code==200)
            {
              this.templateID = data.data;
              this.addDanweiform.entity.company.id = this.templateID;
              if(this.dwryTableData.length!=0){
                let tmpp={};
                this.addDanweiform.entity.personCompanyList=[];
                for(var i=0;i<this.dwryTableData.length;i++){
                    tmpp={};
                    tmpp.idNumber = this.dwryTableData[i].idNumber;
                    tmpp.id = '';
                    tmpp.companyCode = this.templateID;
                    this.addDanweiform.entity.personCompanyList.push(tmpp);
                }
              }

              let imgLink = this.imageDanwei;        
              if (imgLink.url) {
                let tempImage = new Image();
                // tempImage.src = imgLink.url;
                // tempImage.type = imgLink.raw.type;
          //     tempImage.crossOrigin = "*";
                // this.addDanweiform.imageBase64 = this.getBase64Image(tempImage).replace('data:image/jpeg;base64,', '');
                let _this = this;
                tempImage.onload = function(e) {
                    _this.getBase64Image(tempImage, _this.addData);     
                }
                tempImage.setAttribute("crossOrigin",'Anonymous');
                tempImage.src = imgLink.url;
              } else {
                this.addDanweiform.imageBase64 = "";
                this.addData();
              }
            }
        })
      }
      else if(this.isNeworEdit=="修改单位") 
      {
              if(this.dwryTableData.length!=0){
                let tmpp={};
                this.addDanweiform.entity.company.personCompanyList = [];
                for(var i=0;i<this.dwryTableData.length;i++){
                    tmpp={};
                    tmpp.idNumber = this.dwryTableData[i].idNumber;
                    tmpp.id = '';
                    tmpp.companyCode = this.templateID;
                    this.addDanweiform.entity.personCompanyList.push(tmpp);
                }
              }

              let imgLink = this.imageDanwei;        
              if (imgLink.url) {
                let tempImage = new Image();
                // tempImage.src = imgLink.url;
                // tempImage.type = imgLink.raw.type;
          //     tempImage.crossOrigin = "*";
                // this.addDanweiform.imageBase64 = this.getBase64Image(tempImage).replace('data:image/jpeg;base64,', '');
                let _this = this;
                tempImage.onload = function(e) {
                    _this.getBase64Image(tempImage, _this.updateData);     
                }
                tempImage.setAttribute("crossOrigin",'Anonymous');
                tempImage.src = imgLink.url;
              } else {
                this.addDanweiform.imageBase64 = "";
                this.updateData();
              }
      }

    },
    addData(dataurl) {
      if (dataurl) {
        this.addDanweiform.imageBase64 = dataurl.replace('data:image/jpeg;base64,', '');
      }
      if(this.addDanweiform.entity.company.managementPeriod)
      {
        this.addDanweiform.entity.company.managementPeriod = this.str2DataTime(this.addDanweiform.entity.company.managementPeriod);
      }
      return excontrolApi
              .shiyoudanweiNewDanwei(this.addDanweiform)
              .then(res => res)
              .then(data => {
                  if(data.code==200)
                  {
                      // loading.close();
                    this.$confirm("添加实有单位成功", "提示", {
                      confirmButtonText: "确定",
                      type: "success"
                  }).then(() => {
                //    this.cancelbk();
                      this.closeAddForm();
                      this.getDanweiCount();
                      this.searchExcontrol(1);
                  }
                  ).catch(action => {
                    if (action == 'cancel') {
                      this.closeAddForm();
                    }
                  })
                  }
              })
    },
    updateData(dataurl) {
      if (dataurl) {
        this.addDanweiform.imageBase64 = dataurl.replace('data:image/jpeg;base64,', '');
      }
      return excontrolApi
              .danweiModify(this.addDanweiform)
              .then(res => res)
              .then(data => {
                  if(data.code==200)
                  {
                      // loading.close();
                    this.$confirm("更新单位成功", "提示", {
                      confirmButtonText: "确定",
                      type: "success"
                  }).then(() => {
                //    this.cancelbk();
                      this.closeAddForm();
                      this.getDanweiCount();
                      this.searchExcontrol(1);
                  }
                  ).catch(action => {
                    if (action == 'cancel') {
                      this.closeAddForm();
                    }
                  })
                  }
              })
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
      // param.type="company";

      // return excontrolApi
      return excontrolApi
        .shiyoudanweiSearch(param)
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.srcTableData = [];
          if(data!=null)
          {
            this.srcrestotal = data.total;
            //生成表格          
            this.srcTableData = data.rows;
            for(var i=0;i<this.srcTableData.length;i++)
            {
              this.srcTableData[i].eventDate = this.getFormatDate(this.srcTableData[i].eventDate, 'YYYY-MM-DD HH:mm');
            }
          }

        });

      }
      else{
      let param = {};
      param.pageNum = ctrcurrentPage;
      param.pageSize = 10; 
      if(this.searchform.villageId)
      {
        param.villageId = this.searchform.villageId;
      }

      if(this.searchform.companyName)
      {
        param.companyName  = this.searchform.companyName ;
      }
      if(this.searchform.address )
      {
        param.address  = this.searchform.address ;
      }

      if(this.searchform.legalPerson )
      {
        param.legalPerson  = this.searchform.legalPerson ;
      }

      if(this.searchform.idNumber )
      {
        param.idNumber  = this.searchform.idNumber ;
      }

      if(this.searchform.companyType )
      {
        param.companyType  = this.searchform.companyType ;
      }

      if(this.searchform.businessScope )
      {
        param.businessScope  = this.searchform.businessScope ;
      }

      // param = Object.assign(param, this.yjquery);


      // param.query = this.yjquery;
      //  let loading = this.$loading({
      //   lock: true,
      //   text: "数据查询中",
      //   spinner: "el-icon-loading",
      //   background: "rgba(0, 0, 0, 0.7)"
      // });
      return excontrolApi
        .shiyoudanweiSearch(param)
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.srcrestotal = data.total;
          //生成表格
          this.srcTableData = data.rows;
          for(var i=0;i<this.srcTableData.length;i++)
          {
            this.srcTableData[i].managementPeriod = this.getFormatDate(this.srcTableData[i].managementPeriod);
          }
        });
    }
    },   
    clearSearchItem() {
      this.searchform.villageId = '';
      this.searchform.companyName = '';
      this.searchform.address = '';
      this.searchform.legalPerson = '';
      this.searchform.idNumber = '';
      this.searchform.companyType = '';
      this.searchform.businessScope = '';
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
  min-height: calc(100vh - 340px);
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
  background: url(../../../../static/image/yibiaosishi/danwei.png) no-repeat;
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
  background: url(../../../../static/image/yibiaosishi/danweiluru.png) no-repeat;
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
  top: 80px;
  right: 20px;
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
.dw-icon {
  background-image: url("/static/image/jiansuo/dw-icon.png");
  background-repeat: no-repeat;
  background-position: center;
}

.shujudaochu {
  background: url(../../../../static/image/yibiaosishi/shujudaochu.png) no-repeat;
  background-size: auto 100%;
  background-position: left;
}

.adddizhititle {
  width: 800px;
  border-bottom: 1px solid #D8DFE5;
  font-weight: bold;
  font-size:small;
}

.yitianjiarenyuan{
  width: 100%;
  border: 1px solid #CECDCD;
  box-sizing: border-box;
  background: #fff;
  margin-top: 10px;
  position: relative;
}

.xzrybtn {
    display: block;
    width: 100px;
    height: 30px;
    line-height: 28px;
    border: 1px solid rgb(153,153,153);
    border-radius: 3px;
    background: #F4F4F4;
    text-align: center;
    margin-top: 5px;
    cursor: pointer;
}

.xzrybtn::before {
  margin-right: 5px;
  color: #13b1e1;
  font-size: 16px;
}
.gaojisearch {
    background: #f2f2f2;
    padding: 20px;
    margin-top: 30px;
    margin-bottom: 20px;
}
/* ---------------------------------------布控首页结束-------------------------------- */
</style>