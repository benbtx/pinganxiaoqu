<template>
  <div id="contentbody" class="content-body">
    <div class="page-bread">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>实有房屋</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-row">
      <div class="content-center">
        <div id="tongji">
          <div class="content-title">
            <span>房屋情况</span>
          </div>
          <div style="margin:15px;display:flex;">
            <div id="zaikongliang" class="item_zaikongliang">
              <span class="icon_zaikongliang">房屋</span>
              <div style="width:100%;height:100%">
                <div class="item-bukong">
                  <p class='bukong-type'>
                    <span></span> 总量</p>
                  <span class="spanman">
                    <strong class="num">{{totalcount}}</strong> 户</span>
                </div>

                <div class="item-bukong">
                  <p class='bukong-type'>
                    <span></span> 自用</p>
                  <span class="spanman">
                    <strong class="num">{{selfUse}}</strong> 户</span>
                </div>

                <div class="item-bukong">
                  <p class='bukong-type'>
                    <span></span> 一般租借</p>
                  <span class="spanman">
                    <strong class="num">{{nlease}}</strong> 户</span>
                </div>

                <div class="item-bukong">
                  <p class='bukong-type'>
                    <span></span> 其他租借</p>
                  <span class="spanman">
                    <strong class="num">{{olease}}</strong> 户</span>
                </div>

                <div class="item-bukong">
                  <p class='bukong-type'>
                    <span></span> 闲置</p>
                  <span class="spanman">
                    <strong class="num">{{rest}}</strong> 户</span>
                </div>

                <div class="item-bukong">
                  <p class='bukong-type'>
                    <span></span> 其他</p>
                  <span class="spanman">
                    <strong class="num">{{other}}</strong> 户</span>
                </div>
                
              </div>
            </div>
          </div>
        </div>
        <!-- <div id="bukong">
          <div class="content-title">
            <span>房屋操作</span>
          </div>
          <div class="row">
            <div class="fn-bls">
              <div tag="div" id="addcontroldiv" class="ic_bukongbtn add_bukong" @click="showNewMessageBox">
              </div>
            </div>
            <div class="fn-bls"> -->
              <!-- <router-link tag="div" id="controlyjdiv" class="ic_bukongbtn piliangdaoru" v-bind:to="'#'">
              </router-link> -->
              <!-- <div class="ic_bukongbtn piliangdaoru">
                <el-upload class="pl-upload avatar-uploader" action="#" ref="uploadfilepl" :show-file-list="false" :auto-upload="false" :on-change='plchangeUpload' accept=".xls,.xlsx" drag>
                  <div class="avatar-uploader-idiv">
                    <i class="avatar-uploader-icon identity-batch"></i>
                    <div v-if="plfileUrl" class="avatar-uploader-p" style="font-size:16px">
                      {{plfileUrlname}}
                      <div class="face-modal"></div>
                    </div> -->
                    <!-- <p v-else>
                      <span style="font-size:16px">上传附件</span>
                    </p> -->
                  <!-- </div>
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
        </div> -->
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
                <el-select v-model="searchform.village" placeholder="请选择" @change="gjssGetStreet"  filterable style="width:calc(100% - 100px);" clearable>
                  <el-option
                    v-for="item in gjsqoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item">
                  </el-option>
                </el-select>
              </div>
              <div class="search-item">
                <span class="label">街(路)巷：</span>
                <el-select v-model="searchform.street" placeholder="请选择" filterable @change="gjssGetCommunit"  style="width:calc(100% - 100px);" clearable>
                  <el-option
                    v-for="item in gjjdoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item">
                  </el-option>
                </el-select>
              </div>
              <div class="search-item">
                <span class="label">所属小区：</span>
                <el-select v-model="searchform.communityName" placeholder="请选择" @change="gjssGetBuilding" style="width:calc(100% - 100px);" clearable>
                  <el-option
                    v-for="item in gjxqoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item">
                  </el-option>
                </el-select>
                <!-- <el-input style="width:calc(100% - 100px);" v-model="searchform.communityName"></el-input> -->
              </div>
              <div class="search-item">
                <span class="label">所属楼栋：</span>
                <el-select v-model="searchform.building" placeholder="请选择" filterable  @change="gjssGetUnit" style="width:calc(100% - 100px);" clearable>
                  <el-option
                    v-for="item in gjldoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item">
                  </el-option>
                </el-select>
              </div>              
            </div>

            <div class="search-group">
              <div class="search-item">
                <span class="label">所属单元：</span>
                <el-select v-model="searchform.unit" placeholder="请选择" filterable @change="gjssGetFloor" style="width:calc(100% - 100px);" clearable>
                  <el-option
                    v-for="item in gjdyoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item">
                  </el-option>
                </el-select>
              </div>
              <div class="search-item">
                <span class="label">所属楼层：</span>
                <el-select v-model="searchform.floor" placeholder="请选择" filterable @change="gjssSelectFloor" style="width:calc(100% - 100px);" clearable>
                  <el-option
                    v-for="item in gjlcoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item">
                  </el-option>
                </el-select>
              </div>
              <div class="search-item">
                <span class="label">房屋地址：</span>
                <el-input style="width:calc(100% - 100px);" v-model="searchform.addr">
                </el-input>
              </div>
              <div class="search-item">
                <span class="label">户主姓名：</span>
                <el-input style="width:calc(100% - 100px);" v-model="searchform.name">
                </el-input>
              </div>
            </div>  

            <!-- <div class="search-group" style="justify-content: start;margin-left: 32px;">
              <div class="search-item">
                <span class="label">房屋用途：</span>
                <el-select v-model="searchform.useage" placeholder="请选择"  style="width:calc(100% - 100px);" clearable>
                  <el-option label="个人住宅" value="个人住宅"></el-option>
                  <el-option label="办公用房" value="办公用房"></el-option>
                  <el-option label="商业用房" value="商业用房"></el-option>
                  <el-option label="集体宿舍" value="集体宿舍"></el-option>
                  <el-option label="临时工棚" value="临时工棚"></el-option>
                  <el-option label="科教文体" value="科教文体"></el-option>
                  <el-option label="医用房" value="医用房"></el-option>
                  <el-option label="工业用房" value="工业用房"></el-option>
                  <el-option label="其他形式取得" value="其他形式取得"></el-option>
                </el-select>
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
                  <el-table-column type="index" width="80" label="序号">
                  </el-table-column>
                  <el-table-column prop="address" label="房屋地址" min-width="340">
                  </el-table-column>
                  <el-table-column prop="villageName" label="所属社区" min-width="160">
                  </el-table-column>
                  <el-table-column prop="communityName" label="所属小区" min-width="160">
                  </el-table-column>
                  <el-table-column prop="hostName" label="户主姓名" min-width="100">
                  </el-table-column>
                  <!-- <el-table-column prop="hostIdNumber" label="户主身份证" min-width="180">
                  </el-table-column> -->
                  <el-table-column prop="hostPhone" label="户主电话" min-width="100" >
                  </el-table-column>
                  <el-table-column prop="houseType" label="房屋用途" min-width="100" >
                  </el-table-column>
                  <el-table-column prop="useage" label="使用类型" min-width="100" >
                  </el-table-column>
                  <!-- <el-table-column prop="state" label="房屋状态" min-width="100">
                  </el-table-column>
                  <el-table-column prop="dimensions" label="房屋面积" min-width="100">
                  </el-table-column>
                  <el-table-column prop="certificateType" label="产权证类型" min-width="100" >
                  </el-table-column>
                  <el-table-column prop="personObjects" label="人口数" min-width="100" >
                  </el-table-column>                  
                  <el-table-column prop="buildingName" label="楼栋名称" min-width="100">
                  </el-table-column>
                  <el-table-column prop="unitName" label="单元号" min-width="100" >
                  </el-table-column>
                  <el-table-column prop="floor" label="楼层" min-width="100" >
                  </el-table-column>
                  <el-table-column prop="houseNumber" label="门牌号" min-width="100">
                  </el-table-column>                  
                  <el-table-column prop="propertyCompany" label="物业单位" min-width="200" >
                  </el-table-column> -->
                  <el-table-column label="操作" min-width="300" fixed='right'>
                    <template slot-scope="scope">
                      <el-button type="text" size="small" class="operate-btn" @click="lookbkdetail(scope.row)">
                        <i class="fa fa-file-text-o"></i> 查看详情</el-button>
                        <el-button type="text" size="small" class="operate-btn" @click="editbkdetail(scope.row)">
                        <i class="fa fa-pencil-square-o"></i> 修改</el-button>    
                        <!-- <el-button type="text" size="small" class="operate-btn" @click="deletebkdetail(scope.row)">
                        <i class="fa fa-undo"></i> 删除</el-button>                                       -->
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
          top="2vh"
          width="1060px"
          height="628px"
          class="modal-popover"
          :close-on-click-modal='false'
          :before-close="closeAddForm"
          >
          <!-- <el-form :model="form" :inline="true" style="text-align: center;margin-bottom:-20px;">
           <el-form-item label="新增方式：">
              <el-radio-group v-model="form.type">
                <el-radio label="新建房屋"></el-radio>
                <el-radio label="添加已有人员"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form> -->
          <!-- <div style="border: 0px solid #CECDCD;" v-if="form.type=='新建房屋'"> -->
          <div style="border: 0px solid #CECDCD;">
          <el-form :model="addFangwuform.entity" ref="form" :inline="true" class="newform" style="padding:10px;border: 1px solid #CECDCD;">
           <el-form-item style="margin-top:-10px;">
             <div class="adddizhititle">房屋基本信息</div>
           </el-form-item>  
           <el-form-item style="margin-top:5px;"> 
            <el-form-item label="行政区划:" prop="zoneCode">
              <el-select v-model="zoneCode" placeholder="请选择"  @change="getStreet" clearable :disabled="disabledEdit">
                  <el-option
                    v-for="item in xzqhoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="社区:">
              <el-select v-model="streetID" placeholder="请选择"  @change="getAddrNo" clearable :disabled="disabledEdit">
                  <el-option
                    v-for="item in jdoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item">
                  </el-option>
              </el-select>
            </el-form-item>
           <el-form-item label="街路巷:" prop="streetName">
              <el-input v-model="addFangwuform.entity.streetName" :disabled="disabledEdit"></el-input>
            </el-form-item>
            <el-form-item label="门(楼)牌号:">
              <el-select v-model="addrNo" placeholder="请选择"  @change="getBuildingNo" clearable :disabled="disabledEdit">
                  <el-option
                    v-for="item in addrNoOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="楼(栋)号:">
              <el-select v-model="buildingNo" placeholder="请选择"  @change="getUnitNo" clearable :disabled="disabledEdit">
                  <el-option
                    v-for="item in buildingNoOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="单元号:">
              <el-select v-model="unitNo" placeholder="请选择"  @change="getFloorNo" clearable :disabled="disabledEdit">
                  <el-option
                    v-for="item in unitoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="楼层号:">
              <el-select v-model="floorNo" placeholder="请选择"  @change="getRoomNo" clearable :disabled="disabledEdit">
                  <el-option
                    v-for="item in flooroptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="户号:">
              <el-select v-model="roomNo" placeholder="请选择" @change="addroomAddr" clearable :disabled="disabledEdit">
                  <el-option
                    v-for="item in roomoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="小区名称:" prop="communityName">
              <el-input v-model="addFangwuform.entity.communityName" :disabled="disabledEdit"></el-input>
            </el-form-item>
            <!-- <el-form-item label="楼栋名称:" prop="buildingName">
              <el-input v-model="addFangwuform.entity.buildingName"></el-input>
            </el-form-item> -->
            <el-form-item label="详细地址:" prop="address">
              <el-input v-model="addFangwuform.entity.address" class="dz" :disabled="disabledEdit"></el-input>
            </el-form-item> 
           </el-form-item>


           <el-form-item style="margin-top:-10px;">
             <div class="adddizhititle">其他信息</div>
           </el-form-item>  
           <el-form-item style="margin-top:5px;"> 
            <el-form-item label="使用类型" prop="houseType">
              <el-select v-model="addFangwuform.entity.houseType" placeholder="请选择">
                <el-option label="自用" value="自用"></el-option>
                <el-option label="一般租借" value="一般租借"></el-option>
                <el-option label="其他租借" value="其他租借"></el-option>
                <el-option label="闲置" value="闲置"></el-option>
                <el-option label="其他" value="其他"></el-option>
              </el-select>
            </el-form-item> 
            <el-form-item label="房屋用途" prop="useage">
              <el-select v-model="addFangwuform.entity.useage" placeholder="请选择">
                <el-option label="个人住宅" value="个人住宅"></el-option>
                <el-option label="办公用房" value="办公用房"></el-option>
                <el-option label="商业用房" value="商业用房"></el-option>
                <el-option label="集体宿舍" value="集体宿舍"></el-option>
                <el-option label="临时工棚" value="临时工棚"></el-option>
                <el-option label="科教文体" value="科教文体"></el-option>
                <el-option label="医用房" value="医用房"></el-option>
                <el-option label="工业用房" value="工业用房"></el-option>
                <el-option label="其他形式取得" value="其他形式取得"></el-option>
              </el-select>
            </el-form-item>  
            <el-form-item label="是否贫困户" prop="poor">
              <el-select v-model="addFangwuform.entity.poor" placeholder="请选择">
                <el-option v-for="item in poorSel" :label="item.label" :value="item.value" :key="item.id"></el-option>
              </el-select>
            </el-form-item>                    
          </el-form-item>

          <!-- <el-form-item style="width: 850px;">
            <el-form-item label="单元号" prop="unitName">
              <el-input v-model="addFangwuform.entity.unitName"></el-input>
            </el-form-item>
            <el-form-item label="楼层" prop="floor">
              <el-input v-model="addFangwuform.entity.floor"></el-input>
            </el-form-item>
            <el-form-item label="门牌号" prop="houseNumber">
              <el-input v-model="addFangwuform.entity.houseNumber"></el-input>
            </el-form-item>
          </el-form-item> -->

          <el-form-item style="width: 850px;">
            <el-form-item label="房屋状态" prop="state">
              <el-select v-model="addFangwuform.entity.state" placeholder="请选择">
                <el-option label="完好" value="完好"></el-option>
                <el-option label="维修" value="维修"></el-option>
                <el-option label="闲置" value="闲置"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="房屋面积" prop="dimensions">
              <el-input v-model="addFangwuform.entity.dimensions"></el-input>
            </el-form-item>
            <el-form-item label="户型" prop="apartment">
              <el-input v-model="addFangwuform.entity.apartment"></el-input>
            </el-form-item>
          </el-form-item>

          <el-form-item style="width: 850px;">
            <el-form-item label="产权证类型" prop="certificateType">
              <el-select v-model="addFangwuform.entity.certificateType" placeholder="请选择">
                <el-option label="公房" value="公房"></el-option>
                <el-option label="私房" value="私房"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="产权证编号" prop="certificateCode">
              <el-input v-model="addFangwuform.entity.certificateCode"></el-input>
            </el-form-item>
            <el-form-item label="物业单位" prop="propertyCompany">
              <el-input v-model="addFangwuform.entity.propertyCompany"></el-input>
            </el-form-item>
          </el-form-item>

          <el-form-item style="width: 850px;">
            <el-form-item label="物业联系人" prop="propertyContacts">
              <el-input v-model="addFangwuform.entity.propertyContacts"></el-input>
            </el-form-item>
            <el-form-item label="物业电话" prop="propertyPhone">
              <el-input v-model="addFangwuform.entity.propertyPhone"></el-input>
            </el-form-item>
            <el-form-item label="户主姓名" prop="hostName">
              <el-input v-model="addFangwuform.entity.hostName"></el-input>
            </el-form-item>
          </el-form-item>

          <el-form-item style="width: 850px;">
            <el-form-item label="户主身份证" prop="hostIdNumber">
              <el-input v-model="addFangwuform.entity.hostIdNumber"></el-input>
            </el-form-item>
            <el-form-item label="户主电话" prop="hostPhone">
              <el-input v-model="addFangwuform.entity.hostPhone"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size='small' @click="showSelectRenyuan" style="width:98px;font-size:12px;margin-left:20px;">选择户主</el-button>
            </el-form-item>
          </el-form-item>

          <el-form-item>
            <el-form-item label="备注" prop="remarks">
              <el-input type="textarea" v-model="addFangwuform.entity.remarks" style="width:697px;"></el-input>
            </el-form-item>
          </el-form-item>  
          </el-form>
          <div class="pic-group">
            <div class="picture-hold">
                <p class="pic-btn">房屋</p>
                <div class="pic-wrap">
                  <el-upload action='' class="avatar-uploader" :show-file-list="false" :auto-upload="false" :on-change="readImage" accept="image/jpeg,image/png">
                    <i  v-if="imageFw.url" class="clear-pic fa fa-times-circle-o" @click.stop="clearImg"></i>
                    <i class="fw-icon defaul-sym" style="font-size:30px"></i>
                    <p class="up-text">上传房屋</p>
                    <img v-if="imageFw.url" :src="imageFw.url" class="avatar">
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
                <el-table :data="fwryTableData">
                  <el-table-column type="index" width="80" label="序号">
                  </el-table-column>
                  <el-table-column prop="name" label="姓名" min-width="80">
                  </el-table-column>
                  <el-table-column prop="relation" label="与户主关系" min-width="110">
                  </el-table-column>
                  <el-table-column prop="idNumber" label="身份证" min-width="180" >
                  </el-table-column>
                  <el-table-column prop="birthdate" label="出生日期" min-width="180">
                  </el-table-column>
                  <el-table-column prop="company" label="工作单位" min-width="180" >
                  </el-table-column>
                  <el-table-column prop="phone" label="电话" min-width="110">
                  </el-table-column>                  
                  <el-table-column label="操作" min-width="300" fixed='right'>
                    <template slot-scope="scope">
                        <el-button type="text" size="small" class="operate-btn" @click="deletefwrk(scope.$index)">
                        <i class="fa fa-undo"></i> 删除</el-button>                                      
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <el-pagination background style="bottom:10px;" @current-change="getFwryTable" :page-size="10" :current-page.sync="currentPage1" layout="total, prev, pager, next, jumper" :total="fwrytotal">
              </el-pagination>
            </div>
      </div>

      <el-dialog
            title="选择户主"
            :visible.sync="isShowSelectRenyuan"
            width="1200px"
            height="628px"
            class="modal-popover"
            :close-on-click-modal='false'
            :before-close="closeYyry1"
            append-to-body
            >
            <el-form :model="yyryform" :inline="true" ref="yyryform" class="xzhzform xzhzSearch" style="padding:10px;">
            <!-- <el-form-item> 
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
            </el-form-item> -->
            <p style="margin-bottom:14px;margin-top:-5px;">房屋地址：{{displayFWDZ}}</p>
            <el-form-item class="">
              <el-form-item label="姓名：" prop="xm">
                <el-input v-model="yyryform.xm"></el-input>
              </el-form-item>
              <el-form-item label="身份证：" prop="idNumber">
                <el-input v-model="yyryform.idNumber"></el-input>
              </el-form-item>
              <el-form-item label="居住地址" prop="gzdw">
                <el-input v-model="yyryform.gzdw"></el-input>
              </el-form-item>              
            </el-form-item>
            <el-form-item >
                  <el-button type="primary" size='small' class="btn-info" @click="clearYyryForm1" style="margin-left:25px;width:105px;font-size:12px;">重置</el-button>
                  <el-button type="primary" size='small' class="btn-info" @click="getrkDetail(1)" style="margin-left:25px;width:105px;font-size:12px;">查询</el-button>
                  <el-button type="primary" size='small' class="btn-info" @click="gotoNewRenkou" style="margin-left:25px;width:105px;font-size:12px;">新增人口</el-button>
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
              <el-button type="primary" @click="closeYyry1" size='medium' style="width:120px;margin-right:50px;">取 消</el-button>
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
           <el-form :model="addRenkouSearchform" ref="tjyyryform" :inline="true" class="newform ttyyrySearchForm" style="padding:10px;">
           <el-form-item> 
              <el-form-item label="姓名：" prop="name">
              <el-input v-model="addRenkouSearchform.name"></el-input>
            </el-form-item>
            <el-form-item label="身份证号：" prop="idNumber">
               <el-input v-model="addRenkouSearchform.idNumber"></el-input>
            </el-form-item>              
            <el-form-item label="电话：" prop="phone">
              <el-input v-model="addRenkouSearchform.phone"></el-input>
            </el-form-item>
          </el-form-item>

          <el-form-item>
            
            <!-- <el-form-item label="工作单位：" prop="company">
                <el-input v-model="addRenkouSearchform.company"></el-input>
              </el-form-item> -->
            <el-form-item >
                <el-button type="primary" size='small' @click="clearYyryForm" style="margin-left:25px;width:105px;font-size:12px;">重置</el-button>
                <el-button type="primary" size='small' @click="searchAddRenkou(1)" style="margin-left:25px;width:105px;font-size:12px;">查询</el-button>
                <el-button type="primary" size='small' @click="gotoNewRenkou" style="margin-left:25px;width:105px;font-size:12px;">新增人口</el-button>
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
                  <!-- <el-table-column prop="communityName" label="小区名称" min-width="180" >
                  </el-table-column>
                  <el-table-column prop="buildingName" label="楼栋名称" min-width="180" >
                  </el-table-column>     -->
                  <el-table-column prop="company" label="工作单位" min-width="180" >
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
            <el-form :model="addRenkouSearchform" :inline="true" ref="yyryshipform" class="newform" style="text-align:left;">
              <el-form-item label="与户主关系：" prop="realation" required>
                <el-select v-model="addRenkouSearchform.realation" placeholder="请选择">
                  <!-- <el-option label="户主" value="户主"></el-option> -->
                  <el-option label="配偶" value="配偶"></el-option>
                  <el-option label="子女" value="子女"></el-option>
                  <el-option label="父母" value="父母"></el-option>
                  <el-option label="亲戚" value="亲戚"></el-option>
                  <el-option label="朋友" value="朋友"></el-option>
                  <el-option label="租户" value="租户"></el-option>
                </el-select>  
              </el-form-item>
            </el-form>  

          </div>

          <div slot="footer" class="dialog-footer" style="text-align:center;padding-top:0px;">
            <el-button type="primary" @click="closeYyry" size='medium' style="width:120px;margin-right:50px;">取 消</el-button>
            <el-button type="primary" @click="joinSelRy" size='medium' style="width:120px;">添加</el-button>
          </div>
        </el-dialog>


        <div slot="footer" class="dialog-footer" style="text-align:center;padding-top:0px;">
              <el-button type="primary" @click="closeAddForm" size='medium' style="width:120px;margin-right:50px;">取 消</el-button>
              <el-button type="primary" @click="newFangwu" size='medium' style="width:120px;">录入</el-button>
        </div>

      </el-dialog>

      <el-dialog
          title="新增人口"
          :visible.sync="isShowNewRenyuanBox"
          width="1060px"
          height="628px"
          class="modal-popover"
          :close-on-click-modal='false'
          :before-close="closeAddRenyuanForm"
          >
          <el-form :model="addRenkouform.entity.person" :rules="rylrrule" ref="ruleFormrylr" :inline="true" class="newform" style="padding:10px;">
           <el-form-item> 
            <el-form-item label="姓名" prop="name">
              <el-input v-model="addRenkouform.entity.person.name" autoComplete="off"></el-input>
            </el-form-item>
            <el-form-item label="身份证" prop="idNumber">
              <el-input v-model="addRenkouform.entity.person.idNumber" autoComplete="off"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-select v-model="addRenkouform.entity.person.gender" placeholder="请选择性别">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
            </el-form-item>
          </el-form-item>

          <el-form-item style="width: 850px;">
            <el-form-item label="出生日期" prop="birthdate">
              <el-input v-model="addRenkouform.entity.person.birthdate" autoComplete="off" disabled></el-input>
            </el-form-item>
            <el-form-item label="民族" prop="nation">
              <el-select v-model="addRenkouform.entity.person.nation" placeholder="请选择">
                <el-option label="汉族" value="汉族"></el-option>                
                <el-option label="藏族" value="藏族"></el-option>
                <el-option label="维吾尔族" value="维吾尔族"></el-option>
                <el-option label="蒙古族" value="蒙古族"></el-option>
                <el-option label="苗族" value="苗族"></el-option>
                <el-option label="回族" value="回族"></el-option>
                <el-option label="壮族" value="壮族"></el-option>
                <el-option label="其它" value="其它"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="籍贯" prop="nativeInfo">
              <el-input v-model="addRenkouform.entity.person.nativeInfo" autoComplete="off"></el-input>
            </el-form-item>
          </el-form-item>

          <el-form-item style="width: 850px;">
            <el-form-item label="婚姻状况" prop="marriage">
              <el-select v-model="addRenkouform.entity.person.marriage" placeholder="请选择">
                <el-option label="未婚" value="未婚"></el-option>
                <el-option label="已婚" value="已婚"></el-option>
                <el-option label="离异" value="离异"></el-option>
                <el-option label="再婚" value="再婚"></el-option>
                <el-option label="复婚" value="复婚"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="政治面貌" prop="political">
              <el-select v-model="addRenkouform.entity.person.political" placeholder="请选择">
                <el-option label="群众" value="群众"></el-option>
                <el-option label="党员" value="党员"></el-option>                
                <el-option label="民主党派" value="民主党派"></el-option>
                <el-option label="团员" value="团员"></el-option>
                <el-option label="预备党员" value="预备党员"></el-option>
                <el-option label="其它" value="其它"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="文化程度" prop="education">
              <el-select v-model="addRenkouform.entity.person.education" placeholder="请选择">
                <el-option label="未知" value="未知"></el-option>
                <el-option label="小学" value="小学"></el-option>
                <el-option label="初中" value="初中"></el-option>
                <el-option label="中专" value="中专"></el-option>
                <el-option label="高中" value="高中"></el-option>
                <el-option label="专科" value="专科"></el-option>
                <el-option label="本科" value="本科"></el-option>
                <el-option label="硕士" value="硕士"></el-option>  
                <el-option label="博士" value="博士"></el-option>
                <el-option label="博士后" value="博士后"></el-option>    
              </el-select>
            </el-form-item>
          </el-form-item>

          <el-form-item style="width: 850px;">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="addRenkouform.entity.person.phone" autoComplete="off"></el-input>
            </el-form-item>
            <el-form-item label="人口类型" prop="personType">
              <el-select v-model="addRenkouform.entity.person.personType" placeholder="请选择">
                <el-option label="常住" value="常住"></el-option>
                <el-option label="暂住" value="暂住"></el-option>
                <el-option label="流动人口" value="流动人口"></el-option>
                <el-option label="空挂户" value="空挂户"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="优抚对象" prop="preferential">
              <el-select v-model="addRenkouform.entity.person.preferential" placeholder="请选择">
                <el-option label="五保户" value="无保户"></el-option>
                <el-option label="低保人员" value="低保人员"></el-option>
                <el-option label="留守儿童" value="留守儿童"></el-option>
                <el-option label="留守妇女" value="留守妇女"></el-option>
                <el-option label="留守老人" value="留守老人"></el-option>
                <el-option label="军烈家属" value="军烈家属"></el-option>
              </el-select>
            </el-form-item>            
          </el-form-item>

          <el-form-item style="width: 850px;">
            <el-form-item label="重点人员" prop="specialPerson">
              <el-select v-model="addRenkouform.entity.person.specialPerson" placeholder="请选择" @change="specialPersonChange">
                <el-option label="否" value=""></el-option>
                <el-option label="涉恐人员" value="涉恐人员"></el-option>
                <el-option label="涉毒人员" value="涉毒人员"></el-option>
                <el-option label="涉稳人员" value="涉稳人员"></el-option>
                <el-option label="重大刑事犯罪前科人员" value="重大刑事犯罪前科人员"></el-option>
                <el-option label="在逃人员" value="在逃人员"></el-option>
                <el-option label="肇事肇祸精神病人" value="肇事肇祸精神病人"></el-option>
                <el-option label="重点上访人员" value="重点上访人员"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="风险等级" prop="specialLevel">
              <el-select v-model="addRenkouform.entity.person.specialLevel" placeholder="请选择" :disabled="isLevelDisable" >
                <el-option label="高" value="高"></el-option>
                <el-option label="中" value="中"></el-option>
                <el-option label="低" value="低"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="宗教信仰" prop="religion">
              <el-select v-model="addRenkouform.entity.person.religion" placeholder="请选择">
                <el-option label="佛教" value="佛教"></el-option>
                <el-option label="道教" value="道教"></el-option>
                <el-option label="天主教" value="天主教"></el-option>
                <el-option label="基督教" value="基督教"></el-option>
                <el-option label="伊斯兰教" value="伊斯兰教"></el-option>
                <el-option label="其他" value="其他"></el-option>
              </el-select>
            </el-form-item>
          </el-form-item>

          <el-form-item style="width: 850px;">
            <el-form-item label="户口类型" prop="registeredType">
              <el-select v-model="addRenkouform.entity.person.registeredType" placeholder="请选择">
                <el-option label="城镇" value="城镇"></el-option>
                <el-option label="农村" value="农村"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="养老保险" prop="endowmentInsurance">
              <el-select v-model="addRenkouform.entity.person.endowmentInsurance" placeholder="请选择">
                <el-option label="居民" value="居民"></el-option>
                <el-option label="农村" value="农村"></el-option>
                <el-option label="职工" value="职工"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="医疗保险" prop="medicalInsurance">
              <el-select v-model="addRenkouform.entity.person.medicalInsurance" placeholder="请选择">
                <el-option label="城镇" value="城镇"></el-option>
                <el-option label="新农合" value="新农合"></el-option>
                <el-option label="职工" value="职工"></el-option>
              </el-select>
            </el-form-item>
          </el-form-item>

          <el-form-item style="width: 850px;">
            <el-form-item label="健康状况" prop="health">
              <el-select v-model="addRenkouform.entity.person.health" placeholder="请选择">
                <el-option label="健康" value="健康"></el-option>
                <el-option label="其他" value="其他"></el-option>
                <el-option label="尿毒症" value="尿毒症"></el-option>
                <el-option label="心脑血管疾病" value="心脑血管疾病"></el-option>
                <el-option label="精神残疾" value="精神残疾"></el-option>
                <el-option label="糖尿病" value="糖尿病"></el-option>
                <el-option label="肢体残疾" value="肢体残疾"></el-option> 
                <el-option label="艾滋病" value="艾滋病"></el-option> 
              </el-select>
            </el-form-item>
            <el-form-item label="身高" prop="height">
              <el-input v-model="addRenkouform.entity.person.height" autoComplete="off"></el-input>
            </el-form-item>
            <el-form-item label="血型" prop="bloodType">
              <el-select v-model="addRenkouform.entity.person.bloodType" placeholder="请选择">
                <el-option label="A型" value="A型"></el-option>
                <el-option label="B型" value="B型"></el-option>
                <el-option label="AB型" value="AB型"></el-option>
                <el-option label="O型" value="O型"></el-option>
                <el-option label="其他" value="其他"></el-option>
              </el-select>
            </el-form-item>            
          </el-form-item>


          <!-- <el-form-item style="width: 850px;">
            <el-form-item label="住址" prop="residence">
              <el-input v-model="addRenkouform.entity.person.residence" autoComplete="off" class="zhuzhianddanwei"></el-input>
            </el-form-item>
            <el-form-item >
              <el-button type="primary" size='small' @click="showSelectZhuzhi" style="margin-left:-10px;width:105px;font-size:12px;">选择已有住址</el-button>
            </el-form-item>
            <el-form-item label="与户主关系">
              <el-select v-model="addRenkouform.entity.person.relation" placeholder="请选择">
                <el-option label="户主" value="户主"></el-option>
                <el-option label="配偶" value="配偶"></el-option>
                <el-option label="子女" value="子女"></el-option>
                <el-option label="父母" value="父母"></el-option>
                <el-option label="亲戚" value="亲戚"></el-option>
                <el-option label="朋友" value="朋友"></el-option>
                <el-option label="租户" value="租户"></el-option>
              </el-select>
            </el-form-item>
          </el-form-item>

          <el-form-item style="width: 850px;">
            <el-form-item label="单位" prop="company">
              <el-input v-model="addRenkouform.entity.person.company" autoComplete="off" class="zhuzhianddanwei"></el-input>
            </el-form-item>
            <el-form-item >
              <el-button type="primary" size='small' @click="showSelectDanwei" style="margin-left:-10px;width:105px;font-size:12px;">选择已有单位</el-button>
            </el-form-item>
          </el-form-item> -->

          <el-form-item label="备注" prop="remarks">
            <el-input type="textarea" v-model="addRenkouform.entity.person.remarks" style="width:697px;"></el-input>
          </el-form-item>

          </el-form>
          <div class="pic-group">
            <div class="picture-hold">
                <p class="pic-btn">人像</p>
                <div class="pic-wrap">
                  <el-upload action='' class="avatar-uploader" :show-file-list="false" :auto-upload="false" :on-change="readManImage" accept="image/jpeg,image/png">
                    <i  v-if="imageMan.url" class="clear-pic fa fa-times-circle-o" @click.stop="clearImgMan"></i>
                    <i class="rx-icon defaul-sym" style="font-size:30px"></i>
                    <p class="up-text">上传人像</p>
                    <img v-if="imageMan.url" :src="imageMan.url" class="avatar">
                  </el-upload>
                </div>
              </div>
          </div>

          <div slot="footer" class="dialog-footer" style="text-align:center;">
            <el-button type="primary" @click="closeAddRenyuanForm" size='medium' style="width:120px;margin-right:50px;">取 消</el-button>
            <el-button type="primary" @click="newRenkou" size='medium' style="width:120px;">录入</el-button>
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
          <fw-details ref="fwdetails"></fw-details>
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
  name: "shiyoufangwu",
  data() {
    var validateZjh = (rule, value, callback) => {
        if ( !(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/).test(value) ) {
          callback(new Error('请填写正确的身份证号！'));          
        } else {
          this.getcsrq(value);
          callback();
        }
    };
    return {
      isGaojijiansuo: false, 
      searchkey:'',
      gjsqoptions: [],
      gjjdoptions:[],
      gjxqoptions: [],
      gjldoptions:[],
      gjdyoptions:[],
      gjlcoptions:[],
      // jdoptions:[],
      searchform:{
        village:'',
        street:'',
        communityName:'',
        building:'',
        unit:'',
        floor:'',
        name:'',
        addr:'',
        // useage:'',
      },
      poorSel: [
        {
          label: "是",
          value: true
        },
        {
          label: "否",
          value: false
        }
      ],
      doGaojijiansuo: 'all',
      plfileUrl: '',
      plfileUrlname: '',
      pldeleteshow: false,
      totalcount:'',
      selfUse:'',
      olease:'',
      nlease:'',
      rest:'',
      other:'',
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
          type:'新建房屋',
      },
      fwrytotal:0,
      searchAddRenkouDatatotal:0,
      srcrestotal: 0,
      currentPage: 1,
      currentPage1:1,
      currentPage2:1,
      srcresshow: true,
      datetimerange: [],
      controlpeople:null,
      controlcar:null,      
      ldoptions: [],
      dyoptions: [],
      fwsxoptions:[
         {
          label: '民居',
          value: '民居'
        },{
          label: '出租屋',
          value: '出租屋'
        },
        {
          label: '商业',
          value: '商业'
        },{
          label: '其它',
          value: '其它'
        }
      ],
      fwryTableData:[],
      srcTableData:[],
      yyryTableData: [],
      
      isShowNewMessageBox:false,
      isShowSelectRenyuan:false,
      isShowNewRYdialog:false,
      isShowNewRenyuanBox:false,
      imageFw: {
        url:''
      },
      displayFWDZ:'',
      yyryform: {
        xqmc: '',
        ldmc: '',
        dymc: '',
        xm: '',
        idNumber: '',
        gzdw: ''
      },               //户主相关
      selectedIdx: -1,
      selectedRow: {},
      yyrytotal: 0,
      currentYyryPage: 1,
      communityName:'',
      addFangwuform:{
        entity: {                //类型：Object  必有字段  备注：无
          address:"",                //类型：String  必有字段  备注：无
          addressCode:'',
          id:'',
          apartment:"",                //类型：String  必有字段  备注：无
          buildingName:"",                //类型：String  必有字段  备注：无
          certificateCode:"",                //类型：String  必有字段  备注：无
          certificateType:"",                //类型：String  必有字段  备注：无
          communityId:" ",                //类型：String  必有字段  备注：无
          communityName:"",                //类型：String  必有字段  备注：无
          streetName: "",                //街路巷
          dimensions:'',                //类型：Number  必有字段  备注：无
          floor:'', 
          gridName:"",                //类型：String  必有字段  备注：无
          hostIdNumber:"",                //类型：String  必有字段  备注：无
          hostName:"",                //类型：String  必有字段  备注：无
          hostPhone:"",                //类型：String  必有字段  备注：无
          houseNumber:"",                //类型：String  必有字段  备注：无
          houseType:"",                //类型：String  必有字段  备注：无
          imageUrls:"",                //类型：String  必有字段  备注：无
          personObjects:"",                //类型：String  必有字段  备注：无
          poor: '',                //类型：Boolean  必有字段  备注：无
          propertyCompany:"",                //类型：String  必有字段  备注：无
          propertyContacts:"",                //类型：String  必有字段  备注：无
          propertyPhone:"",                //类型：String  必有字段  备注：无
          state:"",                //类型：String  必有字段  备注：无
          street:"",                //类型：String  必有字段  备注：无
          type:"",                //类型：String  必有字段  备注：无
          unitName:"",                //类型：String  必有字段  备注：无
          villageId:'',                //类型：Number  必有字段  备注：无
          villageName:" ",                //类型：String  必有字段  备注：社区名称
          useage:" ",                //类型：String  必有字段  备注：房屋用途
          personHousingList: [                //类型：Array  必有字段  备注：无
            // {                //类型：Object  必有字段  备注：无
            //     housingId:"",                //类型：String  必有字段  备注：无
            //     personId:"",                //类型：String  必有字段  备注：无
            //     relation:"" ,               //类型：String  必有字段  备注：无
            // }
          ],
        },
        imageBase64:"" ,               //类型：String  必有字段  备注：图片base64编码
      },
      isLevelDisable:true,
      addRenkouform:
      {
        entity: 
        {                
          person:  {               
              birthdate:"",                //类型：String  必有字段  2018-11-30T01:31:52.509Z
              bloodType:"",                //类型：String  必有字段  备注：无
              company:"",                //类型：String  必有字段  备注：无
              companyCode:"",                //类型：String  必有字段  备注：无
              education:"",                //类型：String  必有字段  备注：无
              endowmentInsurance:"",                //类型：String  必有字段  备注：无
              gender:"",                //类型：String  必有字段  备注：无
              health:"",                //类型：String  必有字段  备注：无
              height:"",                //类型：Number  必有字段  备注：无
              idNumber:"",                //类型：String  必有字段  备注：无
              idType:"",
              imageUrls:'',
              marriage:"",                //类型：String  必有字段  备注：无
              medicalInsurance:"",                //类型：String  必有字段  备注：无
              militaryState:"",                //类型：String  必有字段  备注：无
              name:"",                //类型：String  必有字段  备注：无
              nation:"",                //类型：String  必有字段  备注：无
              nativeInfo:"",                //类型：String  必有字段  备注：无
              personType:"",                //类型：String  必有字段  备注：无
              phone:"",                //类型：String  必有字段  备注：无
              residenceCode:'',
              political:"",                //类型：String  必有字段  备注：无
              preferential:"",                //类型：String  必有字段  备注：无
              registeredType:"",                //类型：String  必有字段  备注：无
              religion:"",                //类型：String  必有字段  备注：无
              remarks:"",                //类型：String  必有字段  备注：无
              residence:"",                //类型：String  必有字段  备注：无
              specialPerson:"",                //类型：String  必有字段  备注：无
              specialLevel:'',
              type:""                //类型：String  必有字段  备注：无
          },
          personHousing:  
          {                //类型：Object  可有字段  备注：无
              housingId:"",                //类型：String  可有字段  备注：无
              personId:"",                //类型：String  可有字段  备注：无
              relation:""                //类型：String  可有字段  备注：无
          },
          personCompany: {                //类型：Object  可有字段  备注：无
          idNumber:"",                //类型：String  必有字段  备注：人员身份证
          companyCode:""                //类型：String  必有字段  备注：单位编码
          }
        },
        imageBase64:"mock"                //类型：String  必有字段  备注：无
      },
      rylrrule: {
        idNumber: [
          {
            required: true,
            message: "身份证号不能为空！",
            trigger: "change"
          },
          { validator: validateZjh, trigger: 'blur' },
        ],
      },
      imageMan: {
        url:''
      },
      isNeworEdit:'',
      ratio:'',
      templateSelection:{},
      templateID:'',
      addRenkouSearchform:{
        // communityName:'',
        // buildingName:'',	//	楼栋名称
        comany:'',
        name:'',   //	姓名
        idNumber:'',  //身份证号
        phone:'',
        realation:'',
      },
      searchAddRenkouTableData:[],
      zoneCode:'',
      xzqhoptions:[],
      shequCode:'',
      shequoptions:[],
      streetID:'',
      jdoptions:[],
      addrNo:'',
      addrNoOptions:[],
      buildingNo:'',						
      buildingNoOptions:[],
      unitNo:'',
      unitoptions:[],
      floorNo:'',
      flooroptions:[],
      roomNo:'',
      roomoptions:[],	
      // 查看详情
      isShowDetails: false,
      currentId: '',
      disabledEdit: false,
      vifdetails:false,
    };
  },
  beforeRouteEnter(to, from, next) {
      if (from.name=='fangwuxiangqing') {
         to.meta.isBack = true;
      }

      next();
  },
  activated() {
      if (!this.$route.meta.isBack) {
        this.currentPage = 1;
      //  this.getcontrolstate();
        this.clearSearchItem();
        this.searchExcontrol(1);
        this.getFangwuCount();
        this.getVillageSelect();
      }
      this.$route.meta.isBack = false;
  },
  mounted() {
      this.searchExcontrol(1);
      this.getFangwuCount();
      this.getVillageSelect();
  },
  components: {
    "fw-details": () => import("@/views/yibiaosishi/shiyoufangwu/DetailsFangwu"),
  },
  methods: {
    getcsrq(value){
        let csrq = value.substr(6,8);
        this.addRenkouform.entity.person.birthdate =  this.getFormatDate(csrq,'YYYY-MM-DD');

    },
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
    getFangwuCount(){
      return excontrolApi
        .yibiaosishiFangwuCount()
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.totalcount = data.total;
          this.selfUse = data.selfUse;
          this.nlease = data.nlease;
          this.olease = data.olease;
          this.rest = data.rest;
          this.other = data.other;
        });

    },

    getVillageSelect(){
        return excontrolApi
        .fangwuGetVillage()
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.gjsqoptions = data;
          
        });
    },

     gjssGetStreet(viilageId){
      this.searchform.street='';
      this.gjjdoptions=[];
      this.searchform.communityName = '';
      this.gjxqoptions = [];
      this.searchform.building = '';
      this.gjldoptions=[];
      this.searchform.unit = '';
      this.gjdyoptions= [];
      this.searchform.floor = '';
      this.gjlcoptions=[];

      return new Promise((resolve, reject) => {
        if(viilageId!='')
        {
          let param = {};
          param.viilageId = viilageId.value;
            return excontrolApi
              .fangwuGjssGetSteetName(param)
              .then(res => res.data)
              .then(data => {
                // loading.close();
                this.gjjdoptions = data;
                resolve();
              });                          
        }    
      }); 
    },

    gjssGetCommunit(streetName){
      this.searchform.communityName = '';
      this.gjxqoptions = [];
      this.searchform.building = '';
      this.gjldoptions=[];
      this.searchform.unit = '';
      this.gjdyoptions= [];
      this.searchform.floor = '';
      this.gjlcoptions=[];

      return new Promise((resolve, reject) => {
        if(streetName!='')
        {
          let param = {};
          param.viilageId = this.searchform.village.value;
          param.streetName = streetName.value;
            return excontrolApi
              .fangwuGjssGetNeiborhoodName(param)
              .then(res => res.data)
              .then(data => {
                // loading.close();
                this.gjxqoptions = data;
                resolve();
              });                          
        }    
      }); 
    },

    gjssGetBuilding(addrNo){
      this.searchform.building = '';
      this.gjldoptions=[];
      this.searchform.unit = '';
      this.gjdyoptions= [];
      this.searchform.floor = '';
      this.gjlcoptions=[];

      return new Promise((resolve, reject) => {
        if(addrNo!='')
        {
          let param = {};
          param.viilageId = this.searchform.village.value;
          param.streetName = this.searchform.street.value;
          param.addrNo =  addrNo.value;
            return excontrolApi
              .fangwuGjssGetBuilding(param)
              .then(res => res.data)
              .then(data => {
                // loading.close();
                this.gjldoptions = data;
                resolve();
              });                          
        }    
      }); 
    },

    gjssGetUnit(buildingName){
      this.searchform.unit = '';
      this.gjdyoptions= [];
      this.searchform.floor = '';
      this.gjlcoptions=[];

      return new Promise((resolve, reject) => {
        if(buildingName!='')
        {
          let param = {};
          param.viilageId = this.searchform.village.value;
          param.streetName = this.searchform.street.value;
          param.addrNo =  this.searchform.communityName.value;
          param.buildingName = buildingName.value;
            return excontrolApi
              .fangwuGjssGetUnit(param)
              .then(res => res.data)
              .then(data => {
                // loading.close();
                this.gjdyoptions = data;
                resolve();
              });                          
        }    
      }); 
    },

    gjssGetFloor(unitName){
      this.searchform.floor = '';
      this.gjlcoptions=[];

      return new Promise((resolve, reject) => {
        if(unitName!='')
        {
          let param = {};
          param.viilageId = this.searchform.village.value;
          param.streetName = this.searchform.street.value;
          param.addrNo =  this.searchform.communityName.value;
          param.buildingName = this.searchform. building.value;
          param.unitName = unitName.value;
            return excontrolApi
              .fangwuGjssGetFloor(param)
              .then(res => res.data)
              .then(data => {
                // loading.close();
                this.gjlcoptions = data;
                resolve();
              });                          
        }    
      }); 
    },

    getCounty(){
      this.streetID='';
      this.jdoptions = [];
      this.addrNo ='';		
      this.addrNoOptions = [];
      this.buildingNo	='';
      this.buildingNoOptions = [];
      this.unitNo ='';		
      this.unitoptions = [];
      this.floorNo	='';		
      this.flooroptions = [];
      this.roomNo	='';							
      this.roomoptions = [];	

      let param = {};
      param.cityId = "5107";

      return new Promise((resolve, reject) => {
        return excontrolApi
          .bzdzGetcounty(param)
          .then(res => res.data)
          .then(data => {
            // loading.close();
            this.xzqhoptions = data;
            resolve();
          });
      });
    },
    getStreet(townId){            //在编辑和新增中 这里实际获取的是社区
      // let aa = townId.label;
      // let bb = townId.value;
      this.streetID='';
      this.jdoptions = [];
      this.addrNo ='';		
      this.addrNoOptions = [];
      this.buildingNo	='';
      this.buildingNoOptions = [];
      this.unitNo ='';		
      this.unitoptions = [];
      this.floorNo	='';		
      this.flooroptions = [];
      this.roomNo	='';							
      this.roomoptions = [];

      return new Promise((resolve, reject) => {
        if(townId!='')
        {
          this.addFangwuform.entity.address = "四川省绵阳市";
          if (townId.label) {
            this.addFangwuform.entity.address +=  townId.label;
          }
          let tmp = String(townId.value);
          tmp = tmp.substr(0,6);

          let param = {};
          let param1 ={};
          param.townId = tmp;
          param1.regionCode = tmp;

            return excontrolApi
              .bzdzGetstreet(param)
              .then(res => res.data)
              .then(data => {
                // loading.close();
                this.jdoptions = data;
                resolve();
              });                          
        }
        else{
          this.addFangwuform.entity.address='';
          this.addFangwuform.entity.communityName = '';
          resolve();
        }        
      }); 
    },

    getAddrNo(selectItem){          //获取街路巷门楼排号
      this.addrNo ='';		
      this.addrNoOptions = [];
      this.buildingNo	='';
      this.buildingNoOptions = [];
      this.unitNo ='';		
      this.unitoptions = [];
      this.floorNo	='';		
      this.flooroptions = [];
      this.roomNo	='';							
      this.roomoptions = [];	
      return new Promise((resolve, reject) => {
      if(selectItem!='')
      {
        this.addFangwuform.entity.villageId = selectItem.value;
        // if (selectItem.label) {
        //   this.addFangwuform.entity.address +=  selectItem.label;
        // }
        this.addFangwuform.entity.streetName = this.addFangwuform.entity.streetName || '';
        let param = {};
        param.regionCode = selectItem.value;
        
        return excontrolApi
          .fangwuGetAddrNo(param)
          .then(res => res.data)
          .then(data => {
            // loading.close();
            this.addrNoOptions = data;
            resolve();
          });                          
      }
      else{
        this.addFangwuform.entity.communityName = '';
        resolve();
      }
      });
    },

    getBuildingNo(selectItem){
      this.buildingNo	='';
      this.buildingNoOptions = [];
      this.unitNo ='';		
      this.unitoptions = [];
      this.floorNo	='';		
      this.flooroptions = [];
      this.roomNo	='';							
      this.roomoptions = [];	
      return new Promise((resolve, reject) => {
      if(selectItem!='')
      {
        if (selectItem.label) {
          this.addFangwuform.entity.address +=  this.addFangwuform.entity.streetName + selectItem.label;
        }
        for(var i=0;i<this.addrNoOptions.length;i++){
          if(selectItem.value == this.addrNoOptions[i].value)
          {
            this.addFangwuform.entity.communityName = this.addrNoOptions[i].communityName;
          }
        }
        let param = {};
        param.regionCode = this.streetID.value;
        param.streetNo = selectItem.value;
        
        return excontrolApi
          .fangwuGetBuildingNo(param)
          .then(res => res.data)
          .then(data => {
            // loading.close();
            this.buildingNoOptions = data;
            resolve();
          });                            
      }
      else{
        // this.addFangwuform.entity.address = "四川省绵阳市"+ this.zoneCode.label+this.streetID.label+this.addFangwuform.entity.streetName;
        this.addFangwuform.entity.communityName = '';
        resolve();
      }
      });
    },

    getUnitNo(selectItem){
      this.unitNo ='';		
      this.unitoptions = [];
      this.floorNo	='';		
      this.flooroptions = [];
      this.roomNo	='';							
      this.roomoptions = [];	
      return new Promise((resolve, reject) => {
      if(selectItem!='')
      {
        if (selectItem.label) {
          this.addFangwuform.entity.address +=  selectItem.label;
        }
        let param = {};
        param.regionCode = this.streetID.value;
        param.streetNo = this.addrNo.value;
        param.buildingNo = selectItem.value;
        
        return excontrolApi
          .fangwuGetUnitNo(param)
          .then(res => res.data)
          .then(data => {
            // loading.close();
            this.unitoptions = data;
            resolve();
          });                           
      }
      else{
        // this.addFangwuform.entity.address = "四川省绵阳市"+ this.zoneCode.label+this.streetID.label+this.addFangwuform.entity.streetName + this.addrNo.label;
        resolve();
      }
      });
    },

    getFloorNo(selectItem){
      this.floorNo	='';		
      this.flooroptions = [];
      this.roomNo	='';							
      this.roomoptions = [];	
      return new Promise((resolve, reject) => {
      if(selectItem!='')
      {
        if (selectItem.label) {
          this.addFangwuform.entity.address +=  selectItem.label;
        }
        let param = {};
        param.regionCode = this.streetID.value;
        param.streetNo = this.addrNo.value;
        param.buildingNo = this.buildingNo.value;
        param.unitNo = selectItem.value;
        
        return excontrolApi
          .fangwuGetFloorNo(param)
          .then(res => res.data)
          .then(data => {
            // loading.close();
            this.flooroptions = data;
            resolve();
          });                         
      }
      else{
        // this.addFangwuform.entity.address = "四川省绵阳市"+ this.zoneCode.label+this.streetID.label+this.addFangwuform.entity.streetName + this.addrNo.label + this.buildingNo.label;
        resolve();
      }
      });
    },

    getRoomNo(selectItem){
      this.roomNo	='';							
      this.roomoptions = [];	
      return new Promise((resolve, reject) => {
      if(selectItem!='')
      {
        if (selectItem.label) {
          this.addFangwuform.entity.address +=  selectItem.label;
        }
        let param = {};
        param.regionCode = this.streetID.value;
        param.streetNo = this.addrNo.value;
        param.buildingNo = this.buildingNo.value;
        param.unitNo = this.unitNo.value;
        param.floorNo= selectItem.value;
        
        return excontrolApi
          .fangwuGetRoomNo(param)
          .then(res => res.data)
          .then(data => {
            // loading.close();
            this.roomoptions = data;
            resolve();
          });                          
      }
      else{
        // this.addFangwuform.entity.address = "四川省绵阳市"+ this.zoneCode.label+this.streetID.label+this.addFangwuform.entity.streetName + this.addrNo.label + this.buildingNo.label +this.unitNo.label;
        resolve();
      }

      });
    },

    addroomAddr(selectItem){
      if(selectItem!='')
      {
        if (selectItem.label) {
          this.addFangwuform.entity.address +=  selectItem.label;
        }
     //   this.addFangwuform.entity.addressCode = selectItem.addressCode;
      }
      else{
        // this.addFangwuform.entity.address ="四川省绵阳市"+ this.zoneCode.label+this.streetID.label+this.addFangwuform.entity.streetName + this.addrNo.label + this.buildingNo.label +this.unitNo.label+this.floorNo.label; 
      }
    },

    showNewMessageBox(){
        this.isNeworEdit="新增房屋";     
        this.disabledEdit = false;   
        this.getCounty();     //查询区县
        this.isShowNewMessageBox =true;
        this.fwryTableData=[];

    },

    showSelectRenyuan(){
      this.isShowSelectRenyuan = true;
      this.displayFWDZ = this.addFangwuform.entity.address;
      this.getrkDetail(1);
      // this.isShowNewMessageBox = false;
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
        param.idNumber = this.yyryform.idNumber;
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

    clearYyryForm1() {                        //和选择户主相关
      this.$refs["yyryform"].resetFields();
    },

    closeYyry1() {                            //和选择户主相关
      this.clearYyryForm1();
      this.isShowSelectRenyuan = false;
    },

    getTemplateRow1(index, row) {         //获取选中数据
      this.selectedIdx = index;
      this.selectedRow = row;
    },

    getSelRowData() {
      this.addFangwuform.entity.hostIdNumber = this.selectedRow.idNumber;
      this.addFangwuform.entity.hostPhone = this.selectedRow.phone;
      this.addFangwuform.entity.hostName = this.selectedRow.name;
      this.selectedIdx = -1;
      this.isShowSelectRenyuan = false;
    },

    newRenyuan(){
      // this.isShowNewMessageBox = false;
      if(!this.addFangwuform.entity.hostName)
      {
        this.$alert("不能为没有户主的房屋添加人员", "提示", {
            confirmButtonText: "确定"
            });
            return;
      }
      this.searchAddRenkouTableData = [];
      this.searchAddRenkouDatatotal = 0;
      this.currentPage2 = 1;
  //    this.isShowNewMessageBox = false;
      this.isShowNewRYdialog = true;
    },
 
    getTemplateRow(index,row){                                 //获取选中数据
        this.templateSelection = row;

    },

    getcontrolstate(){
        // let param = {};
        // param.username = this.loginForm.username;
        // param.password = this.loginForm.password;
        return excontrolApi
        .excontrolgetBKstate({})
        .then(res => res)
        .then(data => {
            if(data.code==200)
            {
              this.controlpeople = data.data.person;
              this.controlcar = data.data.motorvehicle;
            }
        })
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

    searchAddRenkou: function(ctrcurrentPage) {
      let param = {};
      param.pageNum = ctrcurrentPage;
      param.pageSize = 10;

      // if(this.addRenkouSearchform.communityName)
      // {
      //   param.communityName = this.addRenkouSearchform.communityName;
      // }
      // if(this.addRenkouSearchform.buildingName)
      // {
      //   param.buildingName = this.addRenkouSearchform.buildingName;
      // }

      // if(this.addRenkouSearchform.company)
      // {
      //   param.company = this.addRenkouSearchform.company;
      // }

      if(this.addRenkouSearchform.name)
      {
        param.name = this.addRenkouSearchform.name;
      }
      if(this.addRenkouSearchform.idNumber)
      {
        param.idNumber = this.addRenkouSearchform.idNumber;
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

    getpersonInHouse(id){
      let param = {};
      param.pageNum = 1;
      param.pageSize = 10;
      param.housingId = this.id;

      return excontrolApi
        .fangwuDetailsPersonInHouseSearch(param)
        .then(res => res.data)
        .then(data => {
          // loading.close();
       //   this.srcrestotal = data.total;
          //生成表格
          this.fwryTableData = data.rows;
          for(var i=0;i<this.fwryTableData.length;i++)
          {
            this.fwryTableData[i].birthdate = this.getFormatDate(this.fwryTableData[i].birthdate);
          }


        });

    },  

    joinSelRy(){
      if(this.ratio ==='')
       {
         this.$alert("请选择一个要添加的人员", "提示", {
          confirmButtonText: "确定"
        });
        return;
       }

       if(this.addRenkouSearchform.realation=='')
       {
         this.$alert("请选择与户主关系", "提示", {
          confirmButtonText: "确定"
        });
        return;
       }

       if(this.fwryTableData.length!=0)
       {
          for(var i=0;i<this.fwryTableData.length;i++)
          {
            if(this.templateSelection.idNumber==this.fwryTableData[i].idNumber)
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
        temp.relation = this.addRenkouSearchform.realation;

        this.fwryTableData.push(temp);
        this.clearYyryForm();
        this.isShowNewRYdialog=false;
        this.isShowNewMessageBox = true;
        this.clearYyryForm();
    },

    gotoNewRenkou(){
      this.isShowNewRenyuanBox=true;
    },

    newFangwu(){
      // let param = {};
        // param.username = this.loginForm.username;
        // param.password = this.loginForm.password;
        // 图片转base64编码

        if(this.addFangwuform.entity.hostIdNumber=='')
        {
          this.$alert("户主身份证不能为空", "提示", {
          confirmButtonText: "确定"
          });
          return;
        }

        if(this.fwryTableData.length!=0)
        {
            for(var i=0;i<this.fwryTableData.length;i++)
            {
              if(this.addFangwuform.entity.hostIdNumber==this.fwryTableData[i].idNumber)
              {
                this.$alert("房屋添加人员中不能和户主是同一个人", "提示", {
                  confirmButtonText: "确定"
                });
                return;
              }
            }
        }

      if(this.isNeworEdit=="新增房屋")
      {
        return excontrolApi
        .fangwuInsertGetID({})
        .then(res => res)
        .then(data => 
        {
            if(data.code==200)
            {
              this.templateID = data.data;
              this.addFangwuform.entity.id = this.templateID;
              if(this.fwryTableData.length!=0){
                let tmpp={};
                this.addFangwuform.entity.personHousingList=[];
                for(var i=0;i<this.fwryTableData.length;i++){
                    tmpp={};
                    tmpp.personId = this.fwryTableData[i].idNumber;
                    tmpp.relation = this.fwryTableData[i].relation;
                    tmpp.housingId = this.templateID;
                    this.addFangwuform.entity.personHousingList.push(tmpp);
                }
              }

              if(this.roomNo!='')
              {
                this.addFangwuform.entity.houseNumber= this.roomNo.value;
              }

              if(this.floorNo!='')
              {
                this.addFangwuform.entity.floor= this.floorNo.value;
              }

              if(this.unitNo!='')
              {
                this.addFangwuform.entity.unitName= this.unitNo.value;
              }

              if(this.buildingNo!='')
              {
                this.addFangwuform.entity.buildingName= this.buildingNo.value;
              }

              if(this.addrNo!='')
              {
                this.addFangwuform.entity.addrNo = this.addrNo.value;
              }

              let imgLink = this.imageFw;        
              if (imgLink.url) {
                let tempImage = new Image();
                // tempImage.src = imgLink.url;
                // tempImage.type = imgLink.raw.type;
          //     tempImage.crossOrigin = "*";
                // this.addFangwuform.imageBase64 = this.getBase64Image(tempImage).replace('data:image/jpeg;base64,', '');
                let _this = this;
                tempImage.onload = function(e) {
                    _this.getBase64Image(tempImage, _this.updateData);     
                }
                tempImage.setAttribute("crossOrigin",'Anonymous');
                tempImage.src = imgLink.url;
              } else {
                this.addFangwuform.imageBase64 = "";
              }

            }
        })
      }
      else if(this.isNeworEdit=="修改房屋") 
      {
              if(this.fwryTableData.length!=0){
                let tmpp={};
                this.addFangwuform.entity.personHousingList = [];
                for(var i=0;i<this.fwryTableData.length;i++){
                    tmpp={};
                    tmpp.personId = this.fwryTableData[i].idNumber;
                    tmpp.relation = this.fwryTableData[i].relation;
                    tmpp.housingId = this.addFangwuform.entity.id;
                    this.addFangwuform.entity.personHousingList.push(tmpp);
                }
              }

              if(this.roomNo!='')
              {
                this.addFangwuform.entity.houseNumber= this.roomNo.value;
              }

              if(this.floorNo!='')
              {
                this.addFangwuform.entity.floor= this.floorNo.value;
              }

              if(this.unitNo!='')
              {
                this.addFangwuform.entity.unitName= this.unitNo.value;
              }

              if(this.buildingNo!='')
              {
                this.addFangwuform.entity.buildingName= this.buildingNo.value;
              }

              if(this.addrNo!='')
              {
                this.addFangwuform.entity.addrNo = this.addrNo.value;
              }

              let imgLink = this.imageFw;        
              if (imgLink.url) {
                let tempImage = new Image();
                // tempImage.src = imgLink.url;
                // tempImage.type = imgLink.raw.type;
          //     tempImage.crossOrigin = "*";
                // this.addFangwuform.imageBase64 = this.getBase64Image(tempImage).replace('data:image/jpeg;base64,', '');
                let _this = this;
                tempImage.onload = function(e) {
                    _this.getBase64Image(tempImage, _this.updateData);     
                }
                tempImage.setAttribute("crossOrigin",'Anonymous');
                tempImage.src = imgLink.url;
              } else {
                this.addFangwuform.imageBase64 = "";
                this.updateData();
              }
      }

    },
    addData(dataurl) {
      if (dataurl) {
        this.addFangwuform.imageBase64 = dataurl.replace('data:image/jpeg;base64,', '');
      }
      return excontrolApi
              .shiyoufangwuNewfangwu(this.addFangwuform)
              .then(res => res)
              .then(data => {
                  if(data.code==200)
                  {
                      // loading.close();
                    this.$confirm("添加实有房屋成功", "提示", {
                      confirmButtonText: "确定",
                      type: "success"
                  }).then(() => {
                //    this.cancelbk();
                      this.closeAddForm();
                  }
                  ).catch(action => {
                    if (action == 'cancel') {
                      this.closeAddForm();
                    }
                  })
                  }
              });
    },
    updateData(dataurl) {
      if (dataurl) {
        this.addFangwuform.imageBase64 = dataurl.replace('data:image/jpeg;base64,', '');
      }
      return excontrolApi
              .fangwuModify(this.addFangwuform)
              .then(res => res)
              .then(data => {
                  if(data.code==200)
                  {
                      // loading.close();
                    this.$confirm("更新房屋成功", "提示", {
                      confirmButtonText: "确定",
                      type: "success"
                  }).then(() => {
                //    this.cancelbk();
                      this.closeAddForm();
                  }
                  ).catch(action => {
                    if (action == 'cancel') {
                      this.closeAddForm();
                    }
                  })
                  }
              });
    },
    specialPersonChange(){
      if(this.addRenkouform.entity.person.specialPerson!="")
      {
        this.isLevelDisable=false;
      }
      else if(this.addRenkouform.entity.person.specialPerson=="")
      {
        this.isLevelDisable=true;
      }
    },

    newRenkou(){
        // if(this.addRenkouform.entity.person.idNumber=='')
        // {
        //   this.$alert("身份证不能为空", "提示", {
        //   confirmButtonText: "确定"
        //   });
        //   return;
        // }
        // else{
        //   this.addRenkouform.entity.personHousing.personId = this.addRenkouform.entity.person.idNumber;
        // }

        // if(this.addRenkouform.entity.person.residence=='')
        // {
        //   this.$alert("住址不能为空", "提示", {
        //   confirmButtonText: "确定"
        //   });
        //   return;
        // }

        // if(this.addRenkouform.entity.person.relation=='')
        // {
        //   this.$alert("与户主关系不能为空", "提示", {
        //   confirmButtonText: "确定"
        //   });
        //   return;
        // }
        // else{
        //     this.addRenkouform.entity.personHousing.relation=this.addRenkouform.entity.person.relation;
        // }
        //  if(this.addRenkouform.entity.person.specialPerson&&this.addRenkouform.entity.person.specialLevel=='')
        // {
        //     this.$alert("选择了重点人员必须选择该人员的风险等级", "提示", {
        //       confirmButtonText: "确定"
        //       });
        //     return;
        // }

        this.$refs["ruleFormrylr"].validate(valid => {
          if (valid) {
          let imgLink = this.imageMan;        
          if (imgLink.url) {
            let tempImage = new Image();
            // tempImage.src = imgLink.url;
            // tempImage.type = imgLink.raw.type;
      //     tempImage.crossOrigin = "*";
            // this.addRenkouform.imageBase64 = this.getBase64Image(tempImage).replace('data:image/jpeg;base64,', '');
            let _this = this;
            tempImage.onload = function(e) {
                _this.getBase64Image(tempImage, _this.updateRenkouData);     
            }
            tempImage.setAttribute("crossOrigin",'Anonymous');
            tempImage.src = imgLink.url;
          } else {
            this.addRenkouform.imageBase64 = "";
            this.updateRenkouData();
          }
          }else {
          this.$message({
            message: "请按提示输入必填项",
            type: "warning"
          });
        }
      });
    },
    updateRenkouData(dataurl) {
      if (dataurl) {
        this.addRenkouform.imageBase64 = dataurl.replace('data:image/jpeg;base64,', '');
      }
          // this.addRenkouform.entity.personCompany.idNumber = this.addRenkouform.entity.person.idNumber;
      return excontrolApi
      .shiyourenkouNewPerson(this.addRenkouform)
      .then(res => res)
      .then(data => {
          if(data.code==200)
          {
              // loading.close();
            this.$confirm("添加实有人口成功", "提示", {
              confirmButtonText: "确定",
              type: "success"
          }).then(() => {
        //    this.cancelbk();
            this.closeAddRenyuanForm();
            if(this.isShowNewRYdialog) {
              this.searchAddRenkou(1);
            } else {
              this.getrkDetail(1);
            }
          }
          ).catch(action => {
            if (action == 'cancel') {
              this.closeAddRenyuanForm();
            }
          })
          }
      })
                
    },

    readManImage: function(file) {
      this.imageMan = file;
      this.imageMan.url = URL.createObjectURL(file.raw);
    },
    clearImgMan() {
      this.imageMan = {};
      return false;
    },

    readImage: function(file) {
      this.imageFw = file;
      this.imageFw.url = URL.createObjectURL(file.raw);
    },
    clearImg() {
      this.imageFw = {};
      return false;
    },
    lookbkdetail(data) {
      // console.log(data)
      // this.$router.push({path:'/yibiaosishi/fangwuxiangqing',query: {id_number: data.id}});
      
      this.currentId = data.id;
      this.isShowDetails = true;
      this.$nextTick(()=>{
          this.$refs.fwdetails.initDetals(data.id);
      });
      
    },
    getStreetAndSelect(id){
        let _this = this;
        return new Promise((resolve, reject) => {
        _this.getStreet(id);
      });
    },

    editbkdetail(data) {
      // console.log(data)
      // this.$router.push({path:'/bukongguanli/bukongxiangqing',query: {pro_id: data.dispositionID, type: 'edit'}});
      
      this.isNeworEdit="修改房屋";
      // this.isShowNewMessageBox = true;
      this.disabledEdit = true;
      this.$nextTick(() => {
        this.addFangwuform.entity = Object.assign({}, data);
        this.addFangwuform.entity.addressCode = data.addressCode;
      });
      
      if (data.imageUrls) {
        this.imageFw.url = this.BASE_IMG_URL + data.imageUrls;
      }

      let _this = this;
      _this.getCounty().then(function (msg) {    //查询区县
        for(let j=0;j<_this.xzqhoptions.length;j++)
        {
          if(_this.addFangwuform.entity.countyId == _this.xzqhoptions[j].value)
          {
            _this.zoneCode = _this.xzqhoptions[j];
            break;
          }
        }
      
         _this.getStreet(_this.zoneCode).then(function (msg) {
          for(let j=0;j<_this.jdoptions.length;j++)
          {
            if(_this.addFangwuform.entity.villageId == _this.jdoptions[j].value)
            {
              _this.streetID = _this.jdoptions[j];
              break;
            }
          }

           _this.getAddrNo(_this.streetID).then(function (msg) {
                for(let j=0;j<_this.addrNoOptions.length;j++)
                {
                  if(_this.addFangwuform.entity.addrNo == _this.addrNoOptions[j].value)
                  {
                    _this.addrNo = _this.addrNoOptions[j];
                    break;
                  }
                }

             _this.getBuildingNo(_this.addrNo).then(function (msg) {
                    for(let j=0;j<_this.buildingNoOptions.length;j++)
                    {
                      if(_this.addFangwuform.entity.buildingName == _this.buildingNoOptions[j].value)
                      {
                        _this.buildingNo = _this.buildingNoOptions[j];
                        break;
                      }
                    }

                _this.getUnitNo(_this.buildingNo).then(function (msg) {
                        for(let j=0;j<_this.unitoptions.length;j++)
                        {
                          if(_this.addFangwuform.entity.unitName == _this.unitoptions[j].value)
                          {
                            _this.unitNo = _this.unitoptions[j];
                            break;
                          }
                        }

                    _this.getFloorNo(_this.unitNo).then(function (msg) {
                            for(let j=0;j<_this.flooroptions.length;j++)
                            {
                              if(_this.addFangwuform.entity.floor == _this.flooroptions[j].value)
                              {
                                _this.floorNo = _this.flooroptions[j];
                                break;
                              }
                            }

                        _this.getRoomNo(_this.floorNo).then(function (msg) {
                            for(let j=0;j<_this.roomoptions.length;j++)
                            {
                              if(_this.addFangwuform.entity.houseNumber == _this.roomoptions[j].value)
                              {
                                _this.roomNo = _this.roomoptions[j];
                                break;
                              }
                            }

                        _this.addroomAddr(_this.roomNo);
                        _this.getFwryByID(data.id).then(function() {
                          _this.isShowNewMessageBox = true;
                        });

                    });

                    });

                });    

             });


          });

      });

    });
    },
      
    getFwryByID(id){  
      this.fwryTableData=[];
      let param = {};
      param.pageNum = 1;
      param.pageSize = 10;
      param.housingId = id;

      let _this = this;
      return new Promise((resolve, reject) => {
        return excontrolApi
          .fangwuDetailsPersonInHouseSearch(param)
          .then(res => res.data)
          .then(data => {
            // loading.close();
        //   this.srcrestotal = data.total;
            //生成表格
            _this.fwryTableData = data.rows;
            for(var i=0;i<_this.fwryTableData.length;i++)
            {
              if (_this.fwryTableData[i].relation == '户主') {
                _this.fwryTableData[i].birthdate = _this.getFormatDate(_this.fwryTableData[i].birthdate);
                 _this.fwryTableData.splice(i,1);
                break;
              }
            }
            for(var j=0;j<_this.fwryTableData.length;j++)
            {
              _this.fwryTableData[j].birthdate = _this.getFormatDate(_this.fwryTableData[j].birthdate);
            }
            resolve();
            // this.isShowNewMessageBox =true;
          });
      });
      
 //     this.fwryTableData=[];
    },
    deletebkdetail(data) {
      // this.$confirm("确定要撤销布控？", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning"
      // })
      // .then(() => {
      //   //撤销布控
      //   let param=data.dispositionID;
      //   return excontrolApi
      //   .excontrolRevoke(param)
      //   .then(res => res.data)
      //   .then(data => {
      //       this.searchExcontrol(1);
      //       this.$message({
      //         message: data.statusString,
      //         type: "success"
      //       });   
      //   })
      // })         
      // .catch(() => {
          
      // });
    },

    deletefwrk(index){
      let _this = this;
        this.$confirm("确定要删除该人员？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
          _this.fwryTableData.splice(index,1);
      })         
      .catch(() => {
          
      });

        // this.fwryTableData.
    },
    searchFuzzyEvent: function(ctrcurrentPage) {
      this.doGaojijiansuo = 'keyword';
      this.searchExcontrol(ctrcurrentPage);
    }, 
    searchExcontrol: function(ctrcurrentPage) {
      if(this.doGaojijiansuo == 'keyword')
      {
        let param = {};
        param.pageNum = ctrcurrentPage || this.currentPage;
        param.pageSize = 10;
        if(this.searchkey){
          // param.content = this.searchkey;
          param.queryString = this.searchkey;
        }
      // param.type="housing";

      // return excontrolApi
      return excontrolApi
        .shiyoufangwuSearch(param)
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.srcrestotal = data.total;
          //生成表格
          this.srcTableData = data.rows;
          for(var i=0;i<this.srcTableData.length;i++)
          {
            this.srcTableData[i].eventDate = this.getFormatDate(this.srcTableData[i].eventDate, 'YYYY-MM-DD HH:mm');
            if(this.srcTableData[i].address!='')
            {
              if(this.srcTableData[i].roomAddress&&this.srcTableData[i].roomAddress!='')
              {
                this.srcTableData[i].address += this.srcTableData[i].roomAddress;
              }
              else{

              }
            }
          }

        });

      }
      let param = {};
      param.pageNum = ctrcurrentPage || this.currentPage;
      param.pageSize = 10;
   
      if(this.searchform.village)
      {
        param.villageId = this.searchform.village.value;
      }

      if(this.searchform.street)
      {
        param.streetName = this.searchform.street.value;
      }

      if(this.searchform.communityName)
      {
        param.addrNo = this.searchform.communityName.value;
      }

      if(this.searchform.building)
      {
        param.buildingName = this.searchform.building.value;
      }

      if(this.searchform.unit)
      {
        param.unitName = this.searchform.unit.value;
      }

      if(this.searchform.floor)
      {
        param.floor = this.searchform.floor.value;
      }


      if(this.searchform.name)
      {
        param.hostName = this.searchform.name;
      }
      if(this.searchform.addr)
      {
        param.address = this.searchform.addr;
      }

      // if(this.searchform.useage)
      // {
      //   param.houseType = this.searchform.useage;
      // }
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
          this.srcrestotal = data.total;
          //生成表格
          this.srcTableData = data.rows;
          for(var i=0;i<this.srcTableData.length;i++)
          {
            this.srcTableData[i].address += this.srcTableData[i].roomAddress;
          }
         

        });
    },
    getFwryTable() {

    },
    clearSearchItem() {
      this.searchform.village='';
      this.searchform.street='';
      this.searchform.communityName='';
      this.searchform.building='';
      this.searchform.unit='';
      this.searchform.floor='';      
      this.searchform.addr='';
      this.searchform.name='';
      // this.searchform.useage=''; 
    },
    closeAddForm() {
      this.clearAddForm();
      this.isShowNewMessageBox = false;
      this.searchExcontrol();
    },
    clearAddForm() {
      this.clearImg();
      this.zoneCode ='';
      this.streetID='';
      this.addrNo='';
      this.buildingNo='';
      this.unitNo='';
      this.floorNo='';
      this.roomNo='';
      this.$refs["form"].resetFields();
    },
    clearYyryForm() {               //和添加已有人员相关
      this.ratio = '';
      this.$refs["yyryshipform"].resetFields();
      this.$refs["tjyyryform"].resetFields();
      this.ratio = '';
    },
    closeYyry() {                   //和添加已有人员相关
      this.clearYyryForm();
      this.isShowNewRYdialog = false;
    },

    closeAddRenyuanForm() {
      this.clearAddRenyuanForm();
      this.isShowNewRenyuanBox = false;
    },
    clearAddRenyuanForm() {
      this.clearImgMan();
      this.$refs['ruleFormrylr'].resetFields();
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
  border: 1px solid #CECDCD;
  box-sizing: border-box;
  background: #fff;
}
#tongji,#bukong {
  /* width: calc(50% - 10px); */
  width: 100%;
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

.model-hold {
  margin-bottom: 50px;
}
.item-bukong {
  width: 16.6%;
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
  background: url(../../../../static/image/yibiaosishi/fangwu.png) no-repeat;
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
  width: 1800px;
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
  background: url(../../../../static/image/yibiaosishi/fangwuluru.png) no-repeat;
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
  top: 60px;
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
.fw-icon {
  background-image: url("/static/image/jiansuo/fw-icon.png");
  background-repeat: no-repeat;
  background-position: center;
}

.adddizhititle {
  width: 778px;
  border-bottom: 1px solid #D8DFE5;
  font-weight: bold;
  font-size:small;
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