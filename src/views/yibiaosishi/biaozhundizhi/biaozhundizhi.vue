<template>
  <div id="contentbody" class="content-body">
    <div class="page-bread">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>标准地址</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-row">
      <div class="content-center">
        <div id="tongji">
          <div class="content-title">
            <span>地址情况</span>
          </div>
          <div style="margin:15px;display:flex;">
            <div id="zaikongliang" class="item_zaikongliang">
              <span class="icon_zaikongliang">地址</span>
              <div style="width:100%;height:100%">
                <div class="item-bukong">
                  <p class='bukong-type'>
                    <!-- <span class="fa fa-user-o"></span>  -->
                    总量</p>
                  <span class="spanman">
                    <strong class="num">{{totalcount}}</strong> 个</span>
                </div>         
              </div>
            </div>
          </div>
        </div>
        <div id="bukong">
          <div class="content-title">
            <span>地址操作</span>
          </div>
          <div class="row">
            <div class="fn-bls">
              <div tag="div" id="addcontroldiv" class="ic_bukongbtn dizhiluru" @click="showNewMessageBox">
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
                <span class="label">地址名称：</span>
                <el-input v-model="searchform.addr" style="width:calc(100% - 100px);"></el-input>
              </div>
              <div class="search-item">
                <span class="label">地址俗称：</span>
                <el-input v-model="searchform.communityName" style="width:calc(100% - 100px);"></el-input>
              </div>
              <div class="search-item">
                <span class="label">所属社区：</span>
                <el-select v-model="searchform.villageId" placeholder="请选择" style="width:calc(100% - 100px);" clearable>
                  <el-option
                    v-for="item in gxoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>

              <div class="search-item">
                <span class="label">所属派出所：</span>
                <el-select v-model="searchform.policeStationCode" placeholder="请选择" style="width:calc(100% - 100px);" clearable>
                  <el-option
                    v-for="item in stationOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>

              <!-- <div class="search-item">
                <span class="label">关键字：</span>
                <el-input v-model="bukongkey">
                </el-input>
              </div> -->
              <!-- <span class="search-item">
                <button class="btn btn-info ridiusnull btn-search" type="button" @click="searchExcontrol(1)">查询</button>
              </span> -->
            </div>
            <div class="search-group" style="justify-content: start;margin-left: 32px;">
              <div class="search-item">
                <span class="label">门楼(牌)号：</span>
                <el-input v-model="searchform.streetNo" style="width:calc(100% - 100px);"></el-input>
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
                <el-table :data="srcTableData" height="calc(100vh - 490px)">
                  <el-table-column type="index" width="80" label="序号">
                  </el-table-column>
                  <el-table-column prop="addr" label="地址全称" min-width="350">
                  </el-table-column>
                  <el-table-column prop="communityName" label="地址俗称" min-width="350">
                  </el-table-column>                  
                  <el-table-column prop="villageName" label="所属社区" min-width="220">
                  </el-table-column>
                  <el-table-column prop="stationName" label="所属派出所" min-width="160">
                  </el-table-column>
                  <!-- <el-table-column prop="streetName" label="所属街道" min-width="200">
                  </el-table-column>
                  <el-table-column prop="dutyZone" label="所属责任区" min-width="160">
                  </el-table-column>                  
                  <el-table-column prop="nikename" label="小区名称" min-width="160">
                  </el-table-column>
                  <el-table-column prop="roomCount" label="总户数" min-width="100">
                  </el-table-column> -->
                  <!-- <el-table-column prop="buildingType" min-width="100" label="建筑物类型">
                  </el-table-column>
                  <el-table-column prop="buildingUsage" min-width="100" label="建筑物用途">
                  </el-table-column>
                  <el-table-column prop="buildingStructure" min-width="100" label="建筑物结构">
                  </el-table-column>
                   <el-table-column prop="createTime" min-width="150" label="入库时间">
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
          :title=isNeworEdit
          :visible.sync="isShowNewMessageBox"
          top="10vh"
          width="970px"
          height="628px"
          class="modal-popover"
          :before-close="cacelneworedit"
          :close-on-click-modal='false'
          >
          <!-- <el-form :model="form" :inline="true" style="text-align: center;margin-bottom:-20px;">
           <el-form-item label="新增方式：" prop="resource">
              <el-radio-group v-model="form.type">
                <el-radio label="新建人员"></el-radio>
                <el-radio label="添加已有人员"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form> -->
          <ul class="tabs-hold">
                <li :class="{active: (showpart == 2 && isNeworEdit =='修改地址') }">
                  <a class="tab-ank adddizhititle" v-on:click="togpart(2)" style="border-bottom: none;">基础地址信息</a>
                </li>
                <li class="tab-ank" v-show="isShowEditBuildingInfoTab">/</li>
                <li :class="{active: showpart == 3}" v-show="isShowEditBuildingInfoTab">
                  <a class="tab-ank" v-on:click="togpart(3)">楼栋信息</a>
                </li>
                <li v-show="isShowEditBuildingInfoButton" style="margin-left:20px;">
                  <span>已登记：<span class="dengjimode"></span>未登记：<span class="weidengjimode"></span></span>
                </li>  
              </ul>
          <div v-show="showpart == 2">
          <el-form :model="addDizhiform"  :rules="xxrule" ref='addDizhiform' :inline="true" class="newform cc">
           <!-- <el-form-item>
             <div class="adddizhititle">基础地址信息</div>
           </el-form-item>            -->
           <el-form-item style="margin-top:5px;"> 
            <el-form-item label="行政区划:" required>
              <el-select v-model="zoneCode" placeholder="请选择"  @change="getTown" :disabled="isDisabledWhenEdit" clearable>
                  <el-option
                    v-for="item in xzqhoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="街道办:">
              <el-select v-model="streetID" placeholder="请选择"  @change="getVillage" :disabled="isDisabledWhenEdit" clearable>
                  <el-option
                    v-for="item in jdoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="社区:">           
              <el-select v-model="upperStreetID" placeholder="请选择" :disabled="isDisabledWhenEdit" clearable>
                  <el-option
                    v-for="item in sjdzoptions"
                    :key="item.value"
                    :label="item.villageName"
                    :value="item">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="街(路)巷:" required>  
              <el-input v-model="addDizhiform.baseAddress.streetName" class="ccjlx" autoComplete="off" ></el-input>            
            </el-form-item>
          </el-form-item>

           <el-form-item>
             <div class="adddizhititle">管辖信息</div>
           </el-form-item>  
          <el-form-item style="margin-top:5px;">           
            <el-form-item label="所属派出所:" required>
              <!-- <el-select v-model="sspcs" placeholder="请选择"  @change="selectPliceStation" clearable>
                  <el-option
                    v-for="item in pcsoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select> -->
              <el-input v-model="sspcs"  autoComplete="off" :disabled=true></el-input>   
            </el-form-item>
            <el-form-item label="所属责任区:" required>
              <el-input v-model="sszrq"  autoComplete="off" :disabled=true></el-input> 
            </el-form-item>
            <!-- <el-form-item label="所属社区:">
              <el-input v-model="sssq"  autoComplete="off" :disabled=true></el-input> 
            </el-form-item> -->
          </el-form-item>

          <el-form-item>
             <div class="adddizhititle">门(楼)牌信息</div>
           </el-form-item>  
          <el-form-item style="margin-top:5px;" class="menlouInfo" v-show="isShowNewOrEdit=='new'">            
            <el-form-item label="门(楼)牌号:" prop="haoInput">
              <el-input v-model="zuInput" autoComplete="off" v-show="isShowzuInput" ref="checkzuInput">
                <template slot="append">组&nbsp;</template></el-input>
                <el-input v-model="haoInput" autoComplete="off" v-show="isShowhaoInput">
                <template slot="append">号</template></el-input>
                <el-input v-model="fuhaoInput" autoComplete="off" v-show="isShowfuhaoInput" ref="checkfuhaoInput">
                <template slot="prepend">附</template>
              <template slot="append">号</template></el-input>
            </el-form-item>
            <el-form-item label="后缀:" style="margin-left:-18px;" required>
              <el-select v-model="houzui" placeholder="请选择" @change="changeHouzui">
                <el-option label="号" value="号"></el-option>
                <el-option label="附号" value="附号"></el-option>
                <el-option label="组号" value="组号"></el-option>
                <el-option label="组附号" value="组附号"></el-option>
              </el-select>
            </el-form-item>         
          </el-form-item>
          <el-form-item v-show="isShowNewOrEdit=='edit'">
            <el-form-item label="门(楼)牌号:">{{editAddrNo}}</el-form-item>
          </el-form-item>
          <el-form-item>
             <div class="adddizhititle">小区信息</div>
           </el-form-item>  
          <el-form-item style="margin-top:5px;">            
            <el-form-item label="地址(小区)名称:" prop="baseAddress.neiborhoodName">
              <el-input v-model="addDizhiform.baseAddress.neiborhoodName" autoComplete="off"></el-input>
            </el-form-item>
            <el-form-item label="总栋数:" prop="buildingCount">
              <el-input v-model="addDizhiform.baseAddress.buildingCount" autoComplete="off"></el-input>
            </el-form-item>            
          </el-form-item>

          <!-- <el-form-item style="margin-top:-5px;">
            <el-form-item label="小区名称:" prop="communityName">
              <el-input v-model="addDizhiform.communityName" autoComplete="off"></el-input>
            </el-form-item>
          </el-form-item> -->

          <!-- <el-form-item>
             <div class="adddizhititle">楼(栋)牌号</div>
           </el-form-item> 
          <el-form-item style="margin-top:5px;">             
            <el-form-item label="楼(栋)号:" prop="buildingNo" required>
              <el-input v-model="addDizhiform.buildingNo" autoComplete="off"></el-input>
            </el-form-item>
            <el-form-item label="总单元数:" prop="unitCount">
              <el-input v-model="addDizhiform.unitCount" autoComplete="off"></el-input>
            </el-form-item>
            <el-form-item label="总楼层数:" prop="floorCount">
              <el-input v-model="addDizhiform.floorCount" autoComplete="off"></el-input>
            </el-form-item>
          </el-form-item>
          <el-form-item style="margin-top:-5px;">             
            <el-form-item label="每层户数:" prop="floorRoomCount">
              <el-input v-model="addDizhiform.floorRoomCount" autoComplete="off"></el-input>
            </el-form-item>
            <el-form-item label="建筑物别名:" prop="buildingNickname">
              <el-input v-model="addDizhiform.buildingNickname" autoComplete="off"></el-input>
            </el-form-item>
          </el-form-item> -->
          <div v-show="isShowBuildingInfo">
          <el-form-item>
             <div class="adddizhititle">楼(栋)/单元/楼层/户号信息<span style="float:right;"><el-button type="primary" @click="newOneBuilding" size='small' style="width:65px;height:26px;line-height: 6.5px;">新增</el-button></span></div>
           </el-form-item> 
           <div style="max-height:325px;overflow-y: auto;" class="cchhxx">
          <li v-for="(o, i) in addDizhiform.buildingList" :key="i" class="menlouInfo modal-error"> 
          <el-form-item>
              <el-form-item label="楼(栋)号:" :prop="'buildingList.'+i+'.buildingName1'" :rules="[
              {required: true, message: '楼(栋)号不能为空', trigger: 'blur'},
              {pattern:/^[0-9]+$/,message: '请填写数字！' },]">

              <!-- <el-form-item label="楼(栋)号:" :prop="'buildingList.'+i+'.buildingName'"
              :rules="[{validator: checkBuildingFuhaoInput, trigger: 'blur'}]"> -->
                <el-input v-model="o.buildingName1" autoComplete="off" >            
                                                                                  <!-- :disabled="isDisableBuildingName[i]" -->
                <template slot="append">栋</template></el-input>
              </el-form-item>
              <el-form-item :prop="'buildingList.'+i+'.fuhaoName'"  style="margin-left:-8px;" v-if="isShowBuildingfuhaoInput[i]==true" :rules="[
              {required: true, message: '楼(栋)号不能为空', trigger: 'blur'},
              {pattern:/^[0-9]+$/,message: '请填写数字！' },]">  
                <el-input v-model="o.fuhaoName" autoComplete="off">
                  <template slot="prepend">附</template>
                <template slot="append">号</template></el-input>
              </el-form-item>
              <el-form-item label="后缀:" style="margin-left:-18px;" required>
                <el-select v-model="o.buildinghouzui" placeholder="请选择" @change="changeBuildingHouzui(i)">
                  <el-option label="栋" value="栋"></el-option>
                  <el-option label="附号" value="附号"></el-option>
                </el-select>
              </el-form-item>
            </el-form-item>
            <el-form-item>
              <el-form-item label="总单元数:" :prop="'buildingList.'+i+'.unitCount'" :rules="[
              {required: true, message: '总单元数不能为空', trigger: 'blur'},
              {pattern:/^[0-9]+$/,message: '请填写数字！' }]">
                <el-input v-model="o.unitCount" autoComplete="off" ></el-input>
              </el-form-item>
              <el-form-item label="地上层数:" :prop="'buildingList.'+i+'.floorCount'" :rules="[
              {required: true, message: '地上层数不能为空', trigger: 'blur'},
              {pattern:/^[0-9]+$/,message: '请填写数字！' }]">
                <el-input v-model="o.floorCount" autoComplete="off"></el-input>
              </el-form-item> 
              <el-form-item label="地下层数:" :prop="'buildingList.'+i+'.underFloorCount'" :rules="[
              {required: true, message: '地下层数不能为空', trigger: 'blur'},
              {pattern:/^[0-9]+$/,message: '请填写数字！' }]">
                <el-input v-model="o.underFloorCount" autoComplete="off"></el-input>
              </el-form-item>
              <el-form-item label="每层户数:" :prop="'buildingList.'+i+'.roomCount'" :rules="[
              {required: true, message: '每层户数不能为空', trigger: 'blur'},
              {pattern:/^[0-9]+$/,message: '请填写数字！' }]">
                <el-input v-model="o.roomCount" autoComplete="off"></el-input>              
              </el-form-item><span class="fa fa-times-circle" style="color:#9c9c9c;" @click="deleteOnebuilding(i)"></span>     
              <!-- <el-form-item label="单元号:" prop="unitNo">
                <el-input v-model="addDizhiform.unitNo" autoComplete="off"></el-input>
              </el-form-item>
              <el-form-item label="楼层号:" prop="floorNo">
                <el-input v-model="addDizhiform.floorNo" autoComplete="off"></el-input>
              </el-form-item>
              <el-form-item label="户号:" prop="roomNo">
                <el-input v-model="addDizhiform.roomNo" autoComplete="off"></el-input>
              </el-form-item> -->
          </el-form-item>
          </li>
          </div>
          <!-- <el-form-item style="margin-top:-5px;">             
            <el-form-item label="户号俗称:" prop="roomNikename">
              <el-input v-model="addDizhiform.roomNikename" autoComplete="off"></el-input>
            </el-form-item>
          </el-form-item> -->

          <el-form-item>
             <div class="adddizhititle">基本信息</div>
           </el-form-item> 
          <el-form-item style="margin-top:5px;">             
            <el-form-item label="创建人:">
              <el-input v-model="addDizhiform.cjr" autoComplete="off"></el-input>
            </el-form-item>
            <el-form-item label="创建部门:">
              <el-input v-model="addDizhiform.cjbm" autoComplete="off"></el-input>
            </el-form-item>
            <el-form-item label="创建时间:">
              <el-input v-model="addDizhiform.cjsj" autoComplete="off"></el-input>
            </el-form-item>
          </el-form-item>
          </div>

          </el-form>
          </div>
          <!-- <div class="pic-group">
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
          </div> -->

          <div v-show="showpart == 3">
            <div class="popover-content">
              <div class="content-left">
                <div class="root-tree span-tree" >
                  <el-tree
                      class="filter-tree"
                      :data="tollgatedata"
                      :props="defaultProps"
                      @node-click="handleNodeClick"
                      :default-expanded-keys="defaultExpand"
                      node-key="$treeNodeId"
                      ref="shebeitree">
                  </el-tree>
                </div>  
              </div>
              <div class="content-right">
                  <ul >
                    <li  v-for="(item, i) in  unitlist" :key="i">
                      <span class="unitspan">{{item.name}}</span><span class="roomspan" :class="{highlight: o.used==1}"  v-for="(o,j) in item.rooms" :key = "j">{{o.roomNo}}</span>
                    </li>  
                  </ul>  
              </div>
            </div>
          </div>  

          <div slot="footer" class="dialog-footer" style="text-align:center;" v-show="isShowLuruButton">
            <el-button type="primary" @click="cacelneworedit" size='medium' style="width:120px;margin-right:50px;">取 消</el-button>
            <el-button type="primary" @click="newDizhi" size='medium' style="width:120px;">录入</el-button>
          </div>

          <div slot="footer" class="dialog-footer" style="text-align:center;" v-show="isShowEditBasicAddrButton">
            <el-button type="primary" @click="cacelneworedit" size='medium' style="width:120px;margin-right:50px;">取 消</el-button>
            <el-button type="primary" @click="updateBasicAddr" size='medium' style="width:120px;">保存</el-button>
          </div>

          <div slot="footer" class="dialog-footer" style="text-align:center;" v-show="isShowEditBuildingInfoButton">
            <el-button type="primary" @click="cacelneworedit" size='medium' style="width:120px;margin-right:50px;">取 消</el-button>
            <!-- <el-button type="primary" @click="updateBuildingInfo" size='medium' style="width:120px;">保存</el-button> -->
          </div>


        </el-dialog>

        <el-dialog
          title="查看详情"
          :visible.sync="isShowDetailMessageBox"
          top="10vh"
          width="1291px"
          height="628px"
          class="modal-popover"
          :close-on-click-modal='false'
          >
          <p style="margin-bottom:10px;">上级地址：<span style="margin-right:20px;">{{detailsSJDZ}}</span>小区名称：<span style="margin-right:20px;">{{detailsXQMC}}</span>
          已登记：<span class="dengjimode"></span>未登记：<span class="weidengjimode"></span></p>

            <div class="popover-content">
              <div class="content-left">
                <div class="root-tree span-tree" >
                  <el-tree
                      class="filter-tree"
                      :data="tollgatedata"
                      :props="defaultProps"
                      @node-click="handleNodeClick"
                      :default-expanded-keys="defaultExpand"
                      node-key="$treeNodeId"
                      ref="shebeitree">
                  </el-tree>
                </div>  
              </div>
              <div class="content-right">
                  <ul >
                    <li  v-for="(item, i) in  unitlist" :key="i">
                      <span class="unitspan">{{item.name}}</span><span class="roomspan" :class="{highlight: o.used==1}" v-for="(o,j) in item.rooms" :key = "j">{{o.roomNo}}</span>
                    </li>  
                  </ul>  
              </div>
            </div>


          <!-- <div class="pic-group">
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
          </div> -->

          <div slot="footer" class="dialog-footer" style="text-align:center;">
            <el-button type="primary" @click="isShowDetailMessageBox = false;this.detailsID='';" size='medium' style="width:120px;margin-right:50px;">返回</el-button>
            <!-- <el-button type="primary" @click="newDizhi" size='medium' style="width:120px;">编辑</el-button> -->
          </div>
        </el-dialog>


      </div>
    </div>
  </div>
</template>

<script>
import { excontrolApi } from "@/https";

export default {
  name: "biaozhundizhi",
  data() {
    var checkHaoInput = (rule, value, callback) => {
        let checkzuhao = this.$refs.checkzuInput.value;
        let checkfuhao = this.$refs.checkfuhaoInput.value;
        let checkhao = this.haoInput;
        if(this.isShowzuInput==true&&this.isShowhaoInput==true&&this.isShowfuhaoInput==true)
        {
          if(!checkhao || !checkzuhao || !checkfuhao)
          {
            callback(new Error('门(楼)牌号不能为空'));
          }
          let reg =  /^[1-9]\d*$/;
          if (!reg.test(checkhao) || !reg.test(checkzuhao) || !reg.test(checkfuhao)) {
          callback(new Error('请输入非零正整数'));
          } 
          else {
            callback();
          }
        }

        if(this.isShowzuInput==false &&this.isShowhaoInput==true&&this.isShowfuhaoInput==true)
        {
          if(!checkhao || !checkfuhao)
          {
            callback(new Error('门(楼)牌号不能为空'));
          }
          let reg =  /^[1-9]\d*$/;
          if (!reg.test(checkhao) || !reg.test(checkfuhao)) {
          callback(new Error('请输入非零正整数'));
          } 
          else {
            callback();
          }
        }

        if(this.isShowzuInput==false &&this.isShowhaoInput==true&&this.isShowfuhaoInput==false)
        {
          if(!checkhao)
          {
            callback(new Error('门(楼)牌号不能为空'));
          }
          let reg =  /^[1-9]\d*$/;
          if (!reg.test(checkhao)) {
          callback(new Error('请输入非零正整数'));
          } 
          else {
            callback();
          }
        }

        if(this.isShowzuInput==true&&this.isShowhaoInput==true&&this.isShowfuhaoInput==false)
        {
          if(!checkhao || !checkzuhao)
          {
            callback(new Error('门(楼)牌号不能为空'));
          }
          let reg =  /^[1-9]\d*$/;
          if (!reg.test(checkhao) || !reg.test(checkzuhao)) {
          callback(new Error('请输入非零正整数'));
          } 
          else {
            callback();
          }
        }

    };

    var checkBuildingFuhaoInput = (rule, value, callback) => {
        let _this = this;
        let checkfuhao = _this.$refs.checkBuildingfuhaoInput.value;
        let checkhao = _this.addDizhiform.buildingList[i].buildingName1;
        if(_this.isShowBuildingfuhaoInput[i]==true)
        {
          if(!checkhao || !checkfuhao)
          {
            callback(new Error('门(楼)牌号不能为空'));
          }
          let reg =  /^[1-9]\d*$/;
          if (!reg.test(checkhao) || !reg.test(checkfuhao)) {
          callback(new Error('请输入非零正整数'));
          } 
          else {
            callback();
          }
        }
        else{
          if(!checkhao)
          {
            callback(new Error('门(楼)牌号不能为空'));
          }
          let reg =  /^[1-9]\d*$/;
          if (!reg.test(checkhao)) {
          callback(new Error('请输入非零正整数'));
          } 
          else {
            callback();
          }
        }
    };
    return {
      defaultProps: {
        // id: "value",
        label: "label",
        children: "children",
        isLeaf: 'leaf'
      },
      detailsSJDZ:'',
      detailsXQMC:'',
      tollgatedata: [],
      detailsID:'',
      tollgateList: [],
      tollgateNode: [],
      defaultExpand: [],
      // unitlist:[{name:'1单元',rooms:[101,102,103,104,105,106,107]},
      //           {name:'1单元',rooms:[101,102,103,104,105,106]},
      //           {name:'1单元',rooms:[101,102,103,104,105,106]},
      //           {name:'1单元',rooms:[101,102,103,104,105,106]}],
      unitlist:[],

      isGaojijiansuo: false, 
      searchkey:'',
      doGaojijiansuo: 'all',
      gxoptions: [],
      searchform:{
        addr:'',
        villageId:'',
        policeStationCode:'',
        communityName:'',
        streetNo:'',
      },
      plfileUrl: '',
      plfileUrlname: '',
      pldeleteshow: false,
      totalcount:'',
      isShowzuInput:false,
      isShowhaoInput:true,
      isShowfuhaoInput:false,
      isShowBuildingfuhaoInput:[false,],
      isdisableStreetNoInput:true,
      isDisableBuildingName:[true,],
      isShowNewMessageBox:false,
      isShowDetailMessageBox:false,
      isShowEditBasicAddrButton:false,
      isShowEditBuildingInfoButton:false,
      isShowLuruButton:true,
      isShowBuildingInfo:true,
      isShowEditBuildingInfoTab:false,
      isDisabledWhenEdit:false,
      isShowNewOrEdit:'new',
      editAddrNo:'',
      isNeworEdit:'',
      // addDizhiform:{
      //     addr:"",                //类型：String  必有字段  备注：详细地址(上级地址+门楼号+栋号+单元号+层号+户号)
      //     buildingCount:'',                //类型：Number  必有字段  备注：总栋数
      //     buildingName:"",                //类型：  必有字段  备注：建筑物名称
      //     buildingNickname:"",                //类型：String  必有字段  备注：楼栋别名
      //     buildingNo:"",                //类型：String  必有字段  备注：楼栋号（5栋）
      //     communityName:"",                //类型：String  必有字段  备注：小区名称
      //     floorCount:'',                //类型：Number  必有字段  备注：总层数
      //     floorRoomCount:'',                //类型：Number  必有字段  备注：每层总户数
      //     policeStationCode:"",                //类型：String  必有字段  备注：派出所代码
      //     remark:"",                //类型：String  必有字段  备注：备注
      //     roomNikename:"",                //类型：String  必有字段  备注：户号别名
      //     roomNo:"",                //类型：String  必有字段  备注：户号（14号）
      //     street:"",                //类型：String  必有字段  备注：街道（警钟街）
      //     streetNo:"",                //类型：String  必有字段  备注：门楼号（512号）
      //     streetNickname:"",                //类型：String  必有字段  备注：门楼别名（新希望大厦）
      //     unitCount:'',                //类型：Number  必有字段  备注：总单元数
      //     unitNo:"",                //类型：String  必有字段  备注：单元号（1单元）
      //     villageName:"",                //类型：String  必有字段  备注：所属社区名称
      //     zoneCode:"",                //类型：String  必有字段  备注：行政区划代码（village_id）
      //     floorNo:""
      // },
      showpart: 2,
      zuInput:'',
      haoInput:'',
      fuhaoInput:'',
      houzui:'号',
      addDizhiform:{
        baseAddress: {                //类型：Object  必有字段  备注：无
        code:"",     
        buildingCount:'',           //类型：String  必有字段  备注：无
        neiborhoodName:"",                //类型：String  必有字段  备注：无
        policeStationCode:"",                //类型：String  必有字段  备注：无
        stationName:"",                //类型：String  必有字段  备注：无
        streetName:"",                //类型：String  必有字段  备注：无
        streetNo:"",                //类型：String  必有字段  备注：无
        type:"",                //类型：String  必有字段  备注：无
        villageId:"",                //类型：String  必有字段  备注：无
        villageName:"",                //类型：String  必有字段  备注：无
        zoneCode:"  "                //类型：String  必有字段  备注：无
        },
        buildingList:  [                //类型：Array  必有字段  备注：无
              {                //类型：Object  必有字段  备注：无
                baseAddressId:'',                //类型：Number  必有字段  备注：无
                buildingCode:"",                //类型：String  必有字段  备注：无
                buildingName:"",                //类型：String  必有字段  备注：无
                floorCount:'',                //类型：Number  必有字段  备注：无
                roomCount:'',                //类型：Number  必有字段  备注：无
                underFloorCount:'0',                //类型：Number  必有字段  备注：无
                unitCount:'' ,               //类型：Number  必有字段  备注：无
                buildinghouzui:'栋',
                buildingName1:"",
                fuhaoName:'',
            }
        ]
      },
      // buildinglist:[
      //   {
      //       baseAddressId:"",                //类型：Number  必有字段  备注：无
      //       buildingCode:"",                //类型：String  必有字段  备注：无
      //       buildingName:"",                //类型：String  必有字段  备注：无
      //       floorCount:"",                //类型：Number  必有字段  备注：无
      //       roomCount:"",                //类型：Number  必有字段  备注：无
      //       underFloorCount:"",                //类型：Number  必有字段  备注：无
      //       unitCount:"",
      //       buildinghouzui:'栋', 
      //       fuhaoName:'', 
      //    },
      // ],
      buildingInfo:{
         baseAddressId:"",                //类型：Number  必有字段  备注：无
            buildingCode:"",                //类型：String  必有字段  备注：无
            buildingName:"",                //类型：String  必有字段  备注：无
            floorCount:"",                //类型：Number  必有字段  备注：无
            roomCount:"",                //类型：Number  必有字段  备注：无
            underFloorCount:"0",                //类型：Number  必有字段  备注：无
            unitCount:"" ,
            buildinghouzui:'栋',
            fuhaoName:'',
      },
      editBasicAddrInfo:{
        buildingCount:'',                //类型：Number  必有字段  备注：无
        code:"",                //类型：String  必有字段  备注：无
        neiborhoodName:"",                //类型：String  必有字段  备注：无
        policeStationCode:"",                //类型：String  必有字段  备注：无
        stationName:"",                //类型：String  必有字段  备注：无
        streetName:"",                //类型：String  必有字段  备注：无
        streetNo:"",                //类型：String  必有字段  备注：无
        villageId:"",                //类型：String  必有字段  备注：无
        villageName:"",                //类型：String  必有字段  备注：无
        zoneCode:""                //类型：String  必有字段  备注：无
      },
      detailsdata:{},
      zoneCode:'',
      streetID:'',
      upperStreetID:'',
      xzqhoptions:[],
      jdoptions:[],
      sjdzoptions:[],
      sjdzform:[],
      pcsform:[],
      pcsoptions:[],
      sspcs:'',
      sspcscode:'',
      sszrq:'',
      sssq:'',
      editID:'',
      srcrestotal: 0,
      currentPage: 1,
      srcresshow: true,
      datetimerange: [],
      controlpeople:null,
      controlcar:null,
      communityOptions: [
        // {
        //   label: '车辆',
        //   value: '3'
        // },{
        //   label: '人员',
        //   value: '2'
        // }
      ],
      stationOptions: [
        // {
        //   label: '车辆',
        //   value: '3'
        // },{
        //   label: '人员',
        //   value: '2'
        // }
      ],
      belongCommunity: '',
      belongStation: '',
      bukongkey:'',
      address: '',
      srcTableData:[],
      liref:[],
      xxrule: {
         haoInput:[
        { validator: checkHaoInput, trigger: 'blur' }
        ],
        // haoInput:[
        //   {
        //     required: true,
        //     message: "门(楼)牌号不能为空！",
        //     trigger: "blur"
        //   },
        //   {
        //     pattern:/^[0-9]+$/,
        //     message: '门(楼)牌号只能包含数字！'
        //   },
        //   {
        //     max: 32,
        //     message: "最多输入32个字符！",
        //     trigger: "blur"
        //   }
        // ],
        baseAddress:{
          streetNo: [
          {
            required: true,
            message: "门(楼)牌号不能为空！",
            trigger: "blur"
          },
          {
            pattern:/^[0-9]+$/,
            message: '门(楼)牌号只能包含数字！'
          },
          {
            max: 32,
            message: "最多输入32个字符！",
            trigger: "blur"
          }
        ],
        buildingName:[{
            required: true,
            message: "楼(栋)号不能为空！",
            trigger: "blur"
        }]


        }
      }
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
     //   this.getcontrolstate();
        this.clearSearchItem();
        this.searchExcontrol(1);
        this.getcommunity();
        this.getpoliceStation();
        this.getDizhiCount();
	      this.getVillageSelect();
      }
      this.$route.meta.isBack = false;
      this.pldelete(); //清除之前选择的文件
  },
  mounted() {
      // this.getcontrolstate();
      this.searchExcontrol(1);
      this.getcommunity();
      this.getpoliceStation(); 
      this.getDizhiCount();
	    this.getVillageSelect();
  },
  components: {
  
  },
  methods: {
    togpart(val) {
      this.showpart = val;
      this.curClickIndex=0;
      if(this.showpart==2)
      {
        if(this.isNeworEdit == "地址录入")
        {
          return;
        }
        this.isShowEditBasicAddrButton=true;
        this.isShowEditBuildingInfoButton = false;
        this.isShowBuildingInfo = false;
      }
      else if(this.showpart==3)
      {
        this.getTollgate(this.editID);  
        this.isShowEditBasicAddrButton=false;
        this.isShowEditBuildingInfoButton = true;
      }
      //
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
    getDizhiCount(){
      return excontrolApi
        .yibiaosishiDizhiCount()
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.totalcount = data.total;
        });

    },

    changeBuildingHouzui(i){
         this.addDizhiform.buildingList[i].fuhaoName='';
         this.addDizhiform.buildingList[i].buildingName1='';
         if(this.addDizhiform.buildingList[i].buildinghouzui=="附号")
         {
           this.addDizhiform.buildingList[i].unitCount='';
           this.addDizhiform.buildingList[i].floorCount='';
           this.addDizhiform.buildingList[i].underFloorCount='';
           this.addDizhiform.buildingList[i].roomCount='';
           this.isShowBuildingfuhaoInput[i]=true;
           this.isDisableBuildingName[i]=false;
         }
         else if(this.addDizhiform.buildingList[i].buildinghouzui=="栋")
         {
           this.isShowBuildingfuhaoInput[i]=false;
           this.isDisableBuildingName[i]=true;
         }         
    },

    changeHouzui(houzuiName){
      this.haoInput='';
      this.zuInput = '';
      this.fuhaoInput = '';
      if(houzuiName=="号")
      {
        this.isShowhaoInput=true;
        this.isShowzuInput=false;
        this.isShowfuhaoInput=false;
      }
      else if(houzuiName=="附号")
      {
        this.isShowhaoInput=true;
        this.isShowzuInput=false;
        this.isShowfuhaoInput=true;
      }
      else if(houzuiName=="组号")
      {
        this.isShowhaoInput=true;
        this.isShowzuInput=true;
        this.isShowfuhaoInput=false;
      }
      else if(houzuiName=="组附号")
      {
        this.isShowhaoInput=true;
        this.isShowzuInput=true;
        this.isShowfuhaoInput=true;
      }
 //     this.isdisableStreetNoInput = false;
    },
    

    getVillageSelect(){
        return excontrolApi
        .dizhiGetVillage()
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.gxoptions = data;
          
        });
    },

    getcommunity(){
      this.belongCommunity='';     
      this.communityOptions = [];

      return excontrolApi
        .bzdzGetcommunity()
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.communityOptions = data;
        });
    },

    getpoliceStation(){
      this.belongStation = '';
      this.stationOptions = [];

      return excontrolApi
        .bzdzGetPoliceStation()
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.stationOptions = data;
        });
    },

    getCounty(){      
      this.streetID='';
      this.upperStreetID = '';
      this.jdoptions = [];
      this.sjdzoptions = [];
      let param = {};
      param.cityId = "5107";

      return excontrolApi
        .bzdzGetcounty(param)
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.xzqhoptions = data;
        });
    },

     getTown(countyId){
      // let aa = townId.label;
      // let bb = townId.value;
      this.streetID='';
      this.upperStreetID = '';
      this.jdoptions = [];
      this.sjdzoptions = [];
      this.pcsoptions = [];
      this.pcsform = [];
      if(countyId!='')
      {
        let tmp = String(countyId);
        tmp = tmp.substr(0,6);

        let param = {};
        let param1 ={};
        param.countyId = tmp;
        param1.regionCode = tmp;
        return excontrolApi
          .bzdzGettown(param)
          .then(res => res.data)
          .then(data => {
            // loading.close();
            this.jdoptions = data;
          });
                           
      }
    },

     getVillageForEdit(townId){
      this.upperStreetID = '';
      this.sjdzoptions = [];
      this.sjdzform = [];
      if(townId!='')
      {
        let param = {};
        param.townId = townId.value;

        return excontrolApi
          .bzdzGetVillage(param)
          .then(res => res.data)
          .then(data => {
            // loading.close();
            this.sjdzoptions = [];
            this.sjdzoptions = data;
          });
      }
    },

    getVillage(townId){
      this.upperStreetID = '';
      this.sjdzoptions = [];
      this.sjdzform = [];
      if(townId!='')
      {
        let param = {};
        let param1 ={};
        param.townId = townId.value;
        param1.regionCode = townId.value;

        return excontrolApi
          .bzdzGetVillage(param)
          .then(res => res.data)
          .then(data => {
            // loading.close();
            this.sjdzoptions = [];
            this.sjdzoptions = data;
            return excontrolApi
              .bzdzSearchpoliceStation(param1)
              .then(res => res.data)
              .then(data => {
                // loading.close();
                if(data=='')
                {
                  this.sspcs = '';
                  this.sszrq = '';
                  this.sssq = '';
                }
                else{
                  this.sspcs = data[0].label;
                  this.sszrq = data[0].dutyZone;
                  this.sssq = data[0].villageName;
                  this.pcsoptions=data;
                }
                // this.pcsoptions = [];
                // this.pcsform = data;
                // for(var i=0;i<data.length;i++)
                // {
                //   let tmp ={};
                //   tmp.label = data[i].label;
                //   tmp.value = data[i].value;
                //   this.pcsoptions.push(tmp);
                // }
              });
          });
      }
    },

    getStreet(townId){
      // let aa = townId.label;
      // let bb = townId.value;
      this.streetID='';
      this.upperStreetID = '';
      this.jdoptions = [];
      this.sjdzoptions = [];
      this.pcsoptions = [];
      this.pcsform = [];
      if(townId!='')
      {
        let tmp = String(townId);
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

              return excontrolApi
              .bzdzSearchpoliceStation(param)
              .then(res => res.data)
              .then(data => {
                // loading.close();
                this.pcsoptions = [];
                this.pcsform = data;
                for(var i=0;i<data.length;i++)
                {
                  let tmp ={};
                  tmp.label = data[i].label;
                  tmp.value = data[i].value;
                  this.pcsoptions.push(tmp);
                }
              });
          });
                           
      }
    },

    getUpperStreet(streetId){
      this.upperStreetID = '';
      this.sjdzoptions = [];
      this.sjdzform = [];
      if(streetId!='')
      {
        let param = {};
        param.villageId = streetId.value;

        return excontrolApi
          .bzdzGetupperAddr(param)
          .then(res => res.data)
          .then(data => {
            // loading.close();
            this.sjdzoptions = [];
            this.sjdzform = data;
            for(var i=0;i<data.length;i++)
            {
              this.upperStreetID =  data[i].provinceName + data[i].cityName + data[i].countyName + data[i].street;
              // let tmp ={};
              // tmp.label = data[i].provinceName + data[i].cityName + data[i].countyName + data[i].street;
              // tmp.value = data[i].villageId;
              // tmp.villageName = data[i].villageName;
              // this.sjdzoptions.push(tmp);
            }
          });
      }
    },

    selectPliceStation(pliceStationId){
      this.sszrq = '';
      this.sssq = '';
      if(pliceStationId!='')
      {
        for(var i=0;i<this.pcsform.length;i++)
        {
            if(pliceStationId == this.pcsform[i].value)
            {
              this.sszrq = this.pcsform[i].dutyZone;
              this.sssq = this.pcsform[i].villageName;
            }

        }

      }

    },

    showNewMessageBox(){
        this.isNeworEdit="地址录入";
        // this.addDizhiform.resetField;
        // this.resetForm("addoreditform");
        this.getCounty();     //查询区县
        this.setDataInit();
        this.isShowLuruButton = true;
        this.isShowBuildingInfo=true;
        this.isShowEditBuildingInfoTab=false;
        this.isShowEditBasicAddrButton = false;
        this.isShowEditBuildingInfoButton = false;
        this.isShowNewMessageBox = true;
        this.isShowNewOrEdit='new';
        this.isDisabledWhenEdit = false;
    },
    setDataInit() {
      // this.addDizhiform = {
      //     addr:"",                //类型：String  必有字段  备注：详细地址(上级地址+门楼号+栋号+单元号+层号+户号)
      //     buildingCount:'',                //类型：Number  必有字段  备注：总栋数
      //     buildingName:"",                //类型：  必有字段  备注：建筑物名称
      //     buildingNickname:"",                //类型：String  必有字段  备注：楼栋别名
      //     buildingNo:"",                //类型：String  必有字段  备注：楼栋号（5栋）
      //     communityName:"",                //类型：String  必有字段  备注：小区名称
      //     floorCount:'',                //类型：Number  必有字段  备注：总层数
      //     floorRoomCount:'',                //类型：Number  必有字段  备注：每层总户数
      //     policeStationCode:"",                //类型：String  必有字段  备注：派出所代码
      //     remark:"",                //类型：String  必有字段  备注：备注
      //     roomNikename:"",                //类型：String  必有字段  备注：户号别名
      //     roomNo:"",                //类型：String  必有字段  备注：户号（14号）
      //     street:"",                //类型：String  必有字段  备注：街道（警钟街）
      //     streetNo:"",                //类型：String  必有字段  备注：门楼号（512号）
      //     streetNickname:"",                //类型：String  必有字段  备注：门楼别名（新希望大厦）
      //     unitCount:'',                //类型：Number  必有字段  备注：总单元数
      //     unitNo:"",                //类型：String  必有字段  备注：单元号（1单元）
      //     villageName:"",                //类型：String  必有字段  备注：所属社区名称
      //     zoneCode:"",                //类型：String  必有字段  备注：行政区划代码（village_id）
      //     floorNo:""
      // }

       this.addDizhiform={
        baseAddress: {                //类型：Object  必有字段  备注：无
        code:"",                //类型：String  必有字段  备注：无
        buildingCount:'',
        neiborhoodName:"",                //类型：String  必有字段  备注：无
        policeStationCode:"",                //类型：String  必有字段  备注：无
        stationName:"",                //类型：String  必有字段  备注：无
        streetName:"",                //类型：String  必有字段  备注：无
        streetNo:"",                //类型：String  必有字段  备注：无
        type:"",                //类型：String  必有字段  备注：无
        villageId:"",                //类型：String  必有字段  备注：无
        villageName:"",                //类型：String  必有字段  备注：无
        zoneCode:"  "                //类型：String  必有字段  备注：无
        },
        buildingList:  [                //类型：Array  必有字段  备注：无
              {                //类型：Object  必有字段  备注：无
                baseAddressId:'',                //类型：Number  必有字段  备注：无
                buildingCode:"",                //类型：String  必有字段  备注：无
                buildingName:"",                //类型：String  必有字段  备注：无
                floorCount:'',                //类型：Number  必有字段  备注：无
                roomCount:'',                //类型：Number  必有字段  备注：无
                underFloorCount:'0',                //类型：Number  必有字段  备注：无
                unitCount:'',                //类型：Number  必有字段  备注：无
                buildinghouzui:'栋',
                buildingName1:"",
                fuhaoName:'',
            }
        ]
      }

      this.detailsdata = {};
      this.zoneCode = '';
      this.streetID = '';
      this.upperStreetID = '';
      this.xzqhoptions = [];
      this.jdoptions = [];
      this.sjdzoptions = [];
      this.sjdzform = [];
      this.pcsform = [];
      this.pcsoptions = [];
      this.sspcs = '';
      this.sszrq = '';
      this.sssq = '';
      this.houzui = '号';
      this.isShowhaoInput=true;
      this.isShowzuInput=false;
      this.isShowfuhaoInput=false;
   //   this.isdisableStreetNoInput=true;
      this.isShowBuildingfuhaoInput[0] = false;
      this.isDisableBuildingName[0]=true;
      this.isShowNewOrEdit='new';
      this.isDisabledWhenEdit = false;
      // this.addDizhiform.buildingList[0].buildinghouzui = '栋';

    },
    
    cacelneworedit(){
      this.zoneCode='';
      this.xzqhoptions =[];
      this.streetID='';
      this.upperStreetID = '';
      this.jdoptions = [];
      this.sjdzoptions = [];
      this.pcsoptions = [];
      this.pcsform = [];
      this.sspcs = '';
      this.sszrq = '';
      this.sssq = '';
      this.resetForm("addDizhiform");
      this.isShowNewMessageBox = false;      
    },

    deleteOnebuilding(index){
      if(this.addDizhiform.buildingList.length==1)
      {
        return;
      }
        this.addDizhiform.buildingList.splice(index,1);

    },

    newOneBuilding(){
      // this.buildinglist.push(this.buildingInfo);
      this.buildingInfo = {
         baseAddressId:"",                //类型：Number  必有字段  备注：无
            buildingCode:"",                //类型：String  必有字段  备注：无
            buildingName:"",                //类型：String  必有字段  备注：无
            floorCount:"",                //类型：Number  必有字段  备注：无
            roomCount:"",                //类型：Number  必有字段  备注：无
            underFloorCount:"0",                //类型：Number  必有字段  备注：无
            unitCount:"" ,
            buildinghouzui:'栋',
            fuhaoName:'',
      };
      let i = this.addDizhiform.buildingList.length;
      this.isShowBuildingfuhaoInput.unshift(false);
      // if(i==1)
      // {
      //     this.isDisableBuildingName[i]=this.isDisableBuildingName[0];
       
      // }
      // else{
      //   for(let j=0;j<i;j++)
      //   {       
      //         this.isDisableBuildingName[i]=this.isDisableBuildingName[i-1];          
      //   }
      // }
      // this.isDisableBuildingName[0]=true;
      // this.isDisableBuildingName[i]=true;
      // this.addDizhiform.buildingList[i].buildinghouzui="栋";
      this.addDizhiform.buildingList.unshift(this.buildingInfo);
      
      
    },

    updateBasicAddr(){
  //      this.getDizhiFormStreetNo();
        this.editBasicAddrInfo.buildingCount = this.addDizhiform.baseAddress.buildingCount;
        this.editBasicAddrInfo.code = this.editID;                //类型：String  必有字段  备注：无
        this.editBasicAddrInfo.neiborhoodName=this.addDizhiform.baseAddress.neiborhoodName;                //类型：String  必有字段  备注：无
        this.editBasicAddrInfo.policeStationCode=this.sspcscode;           
        this.editBasicAddrInfo.stationName= this.sspcs;             
        this.editBasicAddrInfo.streetName= this.addDizhiform.baseAddress.streetName;                          
        this.editBasicAddrInfo.streetNo= this.editAddrNo;                //类型：String  必有字段  备注：无
        this.editBasicAddrInfo.villageId=this.upperStreetID.value;               //类型：String  必有字段  备注：无
        this.editBasicAddrInfo.villageName= this.upperStreetID.villageName;               //类型：String  必有字段  备注：无
        this.editBasicAddrInfo.zoneCode= this.zoneCode;                //类型：String  必有字段  备注：无

         return excontrolApi
        .bzdzModifyBaseAddr(this.editBasicAddrInfo)
        .then(res => res)
        .then(data => {
            if(data.code==200)
            {
                // loading.close();
              this.$confirm("修改标准地址基础信息成功", "提示", {
                confirmButtonText: "确定",
                type: "success"
            }).then(() => {
          //    this.cancelbk();
                this.setDataInit();
                this.isShowNewMessageBox=false;
                this.searchExcontrol();
            }
            ).catch(action => {
              // if (action == 'cancel') {
              //   this.backbkgl();
              // }
            })
            }
        })
    },

    getBuildingName(){
      for(var i=0;i<this.addDizhiform.buildingList.length;i++)
      {
        this.addDizhiform.buildingList[i].buildingName=this.addDizhiform.buildingList[i].buildingName1+'栋';
        if(this.addDizhiform.buildingList[i].buildinghouzui=="附号")
        {
          this.addDizhiform.buildingList[i].buildingName+='附'+this.addDizhiform.buildingList[i].fuhaoName+'号'
        }
      }
    },

    getDizhiFormStreetNo(){
          if(this.houzui=="号")
      {
        if(this.haoInput)
        {
          this.addDizhiform.baseAddress.streetNo = '';
          this.addDizhiform.baseAddress.streetNo = this.haoInput+'号';
        }
      }
      else if(this.houzui=="附号")
      {
        if(this.haoInput)
        {
          this.addDizhiform.baseAddress.streetNo = '';
          this.addDizhiform.baseAddress.streetNo = this.haoInput+'号';
          if(this.fuhaoInput){
            this.addDizhiform.baseAddress.streetNo += '附'+this.fuhaoInput+'号';
          }
        }
      }
      else if(this.houzui=="组号")
      {
        if(this.zuInput)
        {
          this.addDizhiform.baseAddress.streetNo = '';
          this.addDizhiform.baseAddress.streetNo = this.zuInput+'组';
          if(this.haoInput){
            this.addDizhiform.baseAddress.streetNo += this.haoInput+'号';
          }
        }
      }

      else if(this.houzui=="组附号")
      {
        if(this.zuInput)
        {
          this.addDizhiform.baseAddress.streetNo = '';
          this.addDizhiform.baseAddress.streetNo = this.zuInput+'组';
          if(this.haoInput){
            this.addDizhiform.baseAddress.streetNo += this.haoInput+'号';
            if(this.fuhaoInput)
            {
               this.addDizhiform.baseAddress.streetNo += '附'+this.fuhaoInput+'号';
            }
          }
        }
      }
    },

    newDizhi(){

      this.$refs["addDizhiform"].validate(valid => {
      if (valid) {  
      if(this.zoneCode!='')
      {
        this.addDizhiform.baseAddress.zoneCode = this.zoneCode;
      }

      // if(this.streetID!='')
      // {
      //   this.addDizhiform.streetNickname = this.streetID.label;
      //   this.addDizhiform.street = this.streetID.value;
      // }

      if(this.upperStreetID!='')
      {
        // this.addDizhiform.addr = this.upperStreetID.label + this.addDizhiform.streetNo + this.addDizhiform.buildingNo +
        //     this.addDizhiform.unitNo + this.addDizhiform.floor_no + this.addDizhiform.roomNo;
            this.addDizhiform.baseAddress.villageName = this.upperStreetID.villageName;
            this.addDizhiform.baseAddress.villageId = this.upperStreetID.value;      
      }

      if(this.sspcs!='')
      {
        this.addDizhiform.baseAddress.policeStationCode = this.pcsoptions[0].value;
        this.addDizhiform.baseAddress.stationName = this.sspcs;        
      }

      // this.addDizhiform.buildingList = [];
      // for(var i=0;i<this.buildinglist.length;i++)
      // {
      //   this.addDizhiform.buildingList.push(this.buildinglist[i]);
      // }

      // if(this.sszrq!='')
      // {
      //   this.addDizhiform.policeStationCode = this.sszrq;
      // }
      // if(this.sjdzoptions!='')
      // {
      //   this.addDizhiform.villageName = this.sjdzoptions[0].villageName;
      // }
      this.getDizhiFormStreetNo();
      this.getBuildingName();
      if(this.isNeworEdit=="地址录入")
      {
      return excontrolApi
        .standardAddressNew(this.addDizhiform)
        .then(res => res)
        .then(data => {
            if(data.code==200)
            {
                // loading.close();
              this.$confirm(data.msg, "提示", {
                confirmButtonText: "确定",
                type: "success"
            }).then(() => {
          //    this.cancelbk();
                this.isShowNewMessageBox=false;
                this.searchExcontrol();
                this.getDizhiCount();
            }
            ).catch(action => {
              // if (action == 'cancel') {
              //   this.backbkgl();
              // }
            })
            }
        })
      }
      else if(this.isNeworEdit=="修改地址") 
      {  
          return excontrolApi
        .bzdzModify(this.addDizhiform)
        .then(res => res)
        .then(data => {
            if(data.code==200)
            {
                // loading.close();
              this.$confirm("修改标准地址成功", "提示", {
                confirmButtonText: "确定",
                type: "success"
            }).then(() => {
          //    this.cancelbk();
                this.isShowNewMessageBox=false;
                this.searchExcontrol();
            }
            ).catch(action => {
              // if (action == 'cancel') {
              //   this.backbkgl();
              // }
            })
            }
        })

      }
      }else {
          this.$message({
            message: "请按提示输入必填项",
            type: "warning"
          });
        }
      });
    },

    getCLcolor(ysdm)
    {
      var ys = '';
      this.cpcolorlist.forEach((o) => {
        if(o.value ==ysdm)
        {
          ys = o.label
         
        }      
      });
      return ys;
    },
    // dispositionStatus(status){
    //     if(status==0)
    //         {
    //           return "布控中";
    //         }
    //         else if(status==1)
    //         {
    //           return "已撤控";
    //         }
    //         else if(status==2)
    //         {
    //           return "布控到期";
    //         }
    //         else if(status==9)
    //         {
    //           return "未布控";
    //         }
    // },

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

    lookDetailsInfo(id){
        let param = {};
        param.id = id;
        return excontrolApi
        .bzdzGetDetails(param)
        .then(res => res)
        .then(data => {
            if(data.code==200)
            {
                this.detailsdata = {};
                this.detailsdata = data.data;
                // param1. = data.data.
                let param1 = {};
                param1.villageId = data.data.street;;

                excontrolApi
                  .bzdzGetupperAddr(param1)
                  .then(res => res.data)
                  .then(data => {
                      this.detailsdata.zoneCode = data[0].countyName;
                      this.detailsdata.sjdz = data[0].provinceName + data[0].cityName + data[0].countyName + data[0].street;
                      if(this.detailsdata.buildingNo)
                      {
                        this.detailsdata.addr += this.detailsdata.buildingNo + '栋';
                      }
                      if(this.detailsdata.unitNo)
                      {
                        this.detailsdata.addr += this.detailsdata.unitNo + '单元';
                      }
                      if(this.detailsdata.floorNo)
                      {
                        this.detailsdata.addr += this.detailsdata.floorNo + '楼';
                      }
                      if(this.detailsdata.roomNo)
                      {
                        this.detailsdata.addr += this.detailsdata.roomNo + '号';
                      }
              
                      let param2 ={};
                      param2.stationCode = this.detailsdata.policeStationCode;
                      excontrolApi
                        .bzdzGetPoliceStationByID(param2)
                        .then(res => res.data)
                        .then(data => {
                        // loading.close();
                          this.detailsdata.policeStationCode = data[0].label;
                          this.detailsdata.zrq = data[0].dutyZone
                          this.isShowDetailMessageBox =true;
                        });
                           
                  })
                
            }
        })

    },

    getDetailsDz(id){
        let param = {};
        param.id = id;
        return excontrolApi
        .bzdzGetDetails(param)
        .then(res => res)
        .then(data => {
            if(data.code==200)
            {
              this.addDizhiform ={};
              this.addDizhiform = data.data;
              // this.zoneCode = data.data.zoneCode;
              let param1 = {};
              param1.villageId = data.data.street;;

              excontrolApi
                .bzdzGetupperAddr(param1)
                .then(res => res.data)
                .then(data => {
                    this.zoneCode = data[0].countyId;
                    this.upperStreetID = data[0].provinceName + data[0].cityName + data[0].countyName;
                    let street = data[0].street;
                    let tmp = String(data[0].countyId);                    
                    tmp = tmp.substr(0,6);
                    let param1 = {};
                    param1.townId = tmp;
                    excontrolApi
                      .bzdzGetstreet(param1)
                      .then(res => res.data)
                      .then(data => {
                        this.jdoptions = data;
                        for(var i=0;i<this.jdoptions.length;i++)
                        {
                            if(this.jdoptions[i].label == street)
                            {
                                this.streetID = this.jdoptions[i];
                                break;
                            }
                        } 
                         let param2 ={};
                        param2.regionCode = tmp; 
                        excontrolApi
                          .bzdzSearchpoliceStation(param2)
                          .then(res => res.data)
                          .then(data => {
                            // loading.close();
                            this.pcsoptions = [];
                            this.pcsform = data;
                            for(var j=0;j<data.length;j++)
                            {
                              let tmp ={};
                              tmp.label = data[j].label;
                              tmp.value = data[j].value;
                              this.pcsoptions.push(tmp);
                            }

                             let param3 ={};
                            param3.stationCode = this.addDizhiform.policeStationCode;
                            excontrolApi
                            .bzdzGetPoliceStationByID(param3)
                            .then(res => res.data)
                            .then(data => {
                              // loading.close();
                              this.sspcs = data[0].value;
                              this.sssq = data[0].villageName;
                              this.sszrq = data[0].dutyZone;
                              this.isShowNewMessageBox =true;
                            });

          
                          });
                             
                      })
                 //   this.getStreet(data[0].countyId);
                   
                
     
                //     for(var i=0;i<this.xzqhoptions.length;i++)
                //     {
                //      
                //       // if(data[0].street == this.jdoptions[i].label)
                //       // {
                //       //   this.streetID = this.xzqhoptions[i];
                //       // }
                //     }

         
                //   else{
                //     this.detailsdata.zoneCode = data[0].countyName;
                //     this.detailsdata.sjdz = data[0].provinceName + data[0].cityName + data[0].countyName + data[0].street;
                //   }

                //   let param2 ={};
                //   param2.stationCode = this.detailsdata.policeStationCode;
                //   return excontrolApi
                // .bzdzGetPoliceStationByID(param2)
                // .then(res => res.data)
                // .then(data => {
                //   // loading.close();
                //   this.detailsdata.policeStationCode = data[0].label;
                //   this.detailsdata.zrq = data[0].dutyZone
                //   this.isShowDetailMessageBox =true;
                // });




                });


              
            }
        })
    },

    handleNodeClick(object,node,data){
       // console.log(data);
       if(object.children)
       {
         return;
       }

        let param = {};
        param.addressCode = this.detailsID;
        param.buildingNo = node.parent.data.value;
        param.unitNo= object.value;
        let _this = this;

      return excontrolApi
        .bzdzGetUnitStructure(param)
        .then(res => res)
        .then(data => {
          _this.unitlist = data.data;
          
          // let result = data.data;
          // while(result.length == 1) {
          //   _this.defaultExpand.push(result[0].indexCode);
          //   result = result[0].children;
          // }
        });

    },

    getTollgate(id) {
      let param = {};
      param.addressCode = id;
      let _this = this;

      _this.tollgatedata = [];
      _this.unitlist = [];
      return excontrolApi
        .bzdzGetAddrStructure(param)
        .then(res => res)
        .then(data => {
          _this.tollgatedata = data.data;
          
          // let result = data.data;
          // while(result.length == 1) {
          //   _this.defaultExpand.push(result[0].indexCode);
          //   result = result[0].children;
          // }
        });
    },

    lookbkdetail(data) {
      this.unitlist = [];
      this.detailsID = data.id;
      this.detailsSJDZ = data.addr;
      this.detailsXQMC = data.communityName;
      this.getTollgate(data.id);
      this.isShowDetailMessageBox = true;
      // this.lookDetailsInfo(data.id);
      // console.log(data)
      // this.$router.push({path:'/bukongguanli/bukongxiangqing',query: {pro_id: data.dispositionID,type: 'show',defaultActive: 'first'}});
    },
    editbkdetail(data) {
      this.isNeworEdit="修改地址";
      // this.addDizhiform.resetField;
      // this.resetForm("addoreditform");
      this.addDizhiform.baseAddress.streetNo = data.addrNo;
      this.addDizhiform.baseAddress.neiborhoodName = data.communityName;
      this.addDizhiform.baseAddress.buildingCount = data.buildingCount;
      this.addDizhiform.baseAddress.streetName = data.streetName;
      this.editAddrNo = data.addrNo;
      this.sspcs = data.stationName;
      this.sspcscode = data.stationCode;
      this.sszrq = data.dutyZone;
      this.editID = data.id;
      this.isShowNewOrEdit='edit';
      this.isDisabledWhenEdit = true;
      let _this = this;
      _this.getCounty().then(function (msg) {    //查询区县
        for(let j=0;j<_this.xzqhoptions.length;j++)
        {
          if(data.zoneCode == _this.xzqhoptions[j].value)
          {
            _this.zoneCode = _this.xzqhoptions[j].value;
            break;
          }
        }

        _this.getTown(_this.zoneCode).then(function (msg) {
          for(let j=0;j<_this.jdoptions.length;j++)
          {
            if(data.streetCode == _this.jdoptions[j].value)
            {
              _this.streetID = _this.jdoptions[j];
              break;
            }
          }

          _this.getVillageForEdit(_this.streetID).then(function (msg) {
          for(let j=0;j<_this.sjdzoptions.length;j++)
          {
            if(data.villageCode == _this.sjdzoptions[j].value)
            {
              _this.upperStreetID = _this.sjdzoptions[j];
              break;
            }
          }

          });
        });
      });
          
          _this.showpart = 2;
          _this.isShowEditBasicAddrButton = true;
          _this.isShowEditBuildingInfoButton=false;
          _this.isShowLuruButton= false;
          _this.isShowBuildingInfo=false;
          _this.isShowEditBuildingInfoTab=true;
          _this.isShowNewMessageBox = true;



      // this.getCounty();     //查询区县

      // this.getDetailsDz(data.id);
      // this.imageMan.url = data.imageUrls;
      
      // console.log(data)
      // this.$router.push({path:'/bukongguanli/bukongxiangqing',query: {pro_id: data.dispositionID, type: 'edit'}});
    },
    deletebkdetail(data) {
      this.$confirm("确定要删除该条地址？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        let param={};
        param.code=data.id;
        return excontrolApi
        .bzdzDeleteAddr(param)
        .then(res => res.data)
        .then(data => {
            // this.currentPage = 1;
            this.searchExcontrol();
            this.$message({
              message: data,
              type: "success"
            });   
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
        param.pageNum = ctrcurrentPage || this.currentPage;
        param.pageSize = 10;
        if(this.searchkey){
        // param.content = this.searchkey;
        param.queryString = this.searchkey;
      }
      // param.type="address";

      // return excontrolApi
      return excontrolApi
        .biaozhundizhiSearch(param)
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
      param.pageNum = ctrcurrentPage || this.currentPage;
      param.pageSize = 10;
      if(this.searchform.addr){
        param.addr = this.searchform.addr;
      }
      if(this.searchform.villageId){
        param.villageId = this.searchform.villageId;
      }
      if(this.searchform.policeStationCode){
        param.policeStationCode = this.searchform.policeStationCode;
      }

      if(this.searchform.communityName){
        param.communityName = this.searchform.communityName;
      }
      if(this.searchform.streetNo){
        param.streetNo = this.searchform.streetNo;
      }

      return excontrolApi
        .biaozhundizhiSearch(param)
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.srcrestotal = data.total;
          //生成表格
          this.srcTableData = data.rows;
          // for(var i=0;i<this.srcTableData.length;i++)
          // {
          //   this.srcTableData[i].createTime = this.getFormatDate(this.srcTableData[i].createTime);
          //   this.srcTableData[i].roomCount +='户';
          // }

        });
    },  
    clearSearchItem() {
      this.searchform.addr = '';
      this.searchform.villageId = '';
      this.searchform.policeStationCode = '';
      this.searchform.communityName = '';
      this.searchform.streetNo = '';
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
  background: url(../../../../static/image/yibiaosishi/dizhi.png) no-repeat;
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
  padding: 0px;
  cursor: pointer;
}
.dizhiluru {
  background: url(../../../../static/image/yibiaosishi/dizhiluru.png) no-repeat;
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

.adddizhititle {
  width: 906px;
  border-bottom: 1px solid #D8DFE5;
  font-weight: bold;
  font-size:small;
  height: 35px;
  line-height: 33px;
}

.info-item {
  display: flex;
  flex: 1;
  color: #333;
  background: none;
  /* justify-content: space-between; */
  height: 40px;
  line-height: 40px;
  margin-bottom: 10px;
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
    width: 33.3%;
    font-size:12px;
}

.info-item .info-col span {
    white-space: nowrap;
    display: inline-block;
}

.gaojisearch {
    background: #f2f2f2;
    padding: 20px;
    margin-top: 30px;
    margin-bottom: 20px;
}

.content-row {
  padding: 0;
}
.bl-content {
  width: 1400px;
  height: calc(100vh - 130px);
  margin-bottom: 30px;
  width: 100%;
  box-sizing: border-box;
  background: #fff;
}
.content-left {
  width: 200px;
  height: 100%;
  float: left;
  border: 1px solid #d9dfe5;
}
.content-right {
  width: calc(100% - 200px);
  height: 100%;
  margin-left: 200px;
  border: 1px solid #d9dfe5;
  border-left: none;
  overflow: auto;
  white-space: nowrap; 
}

.popover-content{
  height: 600px;
}

.root-tree {
  height: 100%;
}

.unitspan {
    width: 150px;
    height: 50px;
    border-bottom: 1px solid #d9dfe5;
    background: #13B1E1;
    text-align: center;
    line-height: 50px;
    display: inline-block;
    color: #fff;
}

.roomspan{
    width: 150px;
    height: 50px;
    border-bottom: 1px solid #d9dfe5;
    border-right: 1px solid #d9dfe5;
    text-align: center;
    line-height: 50px;
    display: inline-block;
}

.tree-icon {
  width: 16px;
  height: 16px;
  display: inline-block;
  /* background: url(../../../static/image/shipin/parents.png) no-repeat; */
  background-position: center;
}

.tabs-hold {
  border-bottom: 1px solid #d9dfe5;
  height: 40px;
  line-height: 40px;
  margin-top:-10px;
  width: 906px;
}
.tabs-hold > li {
  margin: 0;
  display: inline-block;
}
.tabs-hold > li.active .tab-ank:after {
  background: none;
}
.tabs-hold .tab-ank {
  color: #555;
}
.tabs-hold .active .tab-ank {
  color: #13b1e1;
}
.highlight {
  background-color: #93e099;
}

.dengjimode{
  margin-right: 20px;
  margin-right: 20px;
  width: 55px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  display: inline-block;
  background-color: #93e099;
  margin-bottom: -5px;
}

.weidengjimode{
  margin-right: 20px;
  margin-right: 20px;
  width: 55px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  display: inline-block;
  margin-bottom: -5px;
  border: 2px solid #d9dfe5;
}

.menlouInfo{
  margin-top:5px;
  background: #f2f2f2;
  padding: 10px 5px 5px 0px;
}

/* ---------------------------------------布控首页结束-------------------------------- */
</style>