<template>
  <div id="contentbody" class="content-body">
    <div class="page-bread">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>实有人口</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-row">
      <div class="content-center">
        <div id="tongji">
          <div class="content-title">
            <span>人口情况</span>
          </div>
          <div style="margin:15px;display:flex;">
            <div id="zaikongliang" class="item_zaikongliang">
              <span class="icon_zaikongliang">人口</span>
              <div style="width:100%;height:100%">
                <div class="item-bukong">
                  <p class='bukong-type'>
                    <span></span> 总量</p>
                  <span class="spanman">
                    <strong class="num">{{totalcount}}</strong> 人</span>
                </div>

                <div class="item-bukong">
                  <p class='bukong-type'>
                    <span></span> 常住人口</p>
                  <span class="spanman">
                    <strong class="num">{{residentcount}}</strong> 人</span>
                </div>

                <div class="item-bukong">
                  <p class='bukong-type'>
                    <span></span> 流动人口</p>
                  <span class="spanman">
                    <strong class="num">{{floatingcount}}</strong> 人</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="bukong">
          <div class="content-title">
            <span>人口操作</span>
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
                <!-- <el-upload class="pl-upload avatar-uploader" action="#" ref="uploadfilepl" :show-file-list="false" :auto-upload="false" :on-change='plchangeUpload' accept=".xls,.xlsx" drag> -->
                <el-upload class="pl-upload avatar-uploader" action="#" ref="uploadfilepl" multiple :show-file-list="false" :auto-upload="false" :on-change='plchangeUpload'>
                  <div class="avatar-uploader-idiv">
                    <i class="avatar-uploader-icon identity-batch"></i>
                    <div v-if="plfileUrl" class="avatar-uploader-p" style="font-size:16px">
                      {{plfileUrlname}}
                      <div class="face-modal"></div>
                    </div>
                  </div>
                  <label class="el-upload-list__item-status-label" v-show="pldeleteshow">
                  <span class="re-upload">重新上传</span>
                  </label>
                </el-upload>


            <!-- <el-upload
              class="upload-demo"
              action="/person/importPhotos"
              multiple
              name="personPhotos"
              :show-file-list="false"
              >
           <el-button size="small" type="primary">点击上传</el-button>
        </el-upload> -->
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
                <el-select v-model="searchform.village" placeholder="请选择" filterable style="width:calc(100% - 100px);" clearable>
                  <el-option
                    v-for="item in gxoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div class="search-item">
                <span class="label">所属小区：</span>
                <!-- <el-select v-model="communityName" placeholder="请选择"  style="width:calc(100% - 100px);" clearable>
                  <el-option
                    v-for="item in xqoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select> -->
                <el-input style="width:calc(100% - 100px);" v-model="searchform.communityName"></el-input>
              </div>
              <div class="search-item">
                <span class="label">姓名：</span>
                <el-input style="width:calc(100% - 100px);" v-model="searchform.name">
                </el-input>
              </div>
              <div class="search-item">
                <span class="label">身份证：</span>
                <el-input style="width:calc(100% - 100px);" v-model="searchform.IdNumber">
                </el-input>
              </div>
              <!-- <span class="search-item" style="flex:1">
                <button class="btn btn-info ridiusnull btn-search" type="button" @click="searchExcontrol(1)">查询</button>
              </span> -->
            </div>

            <div class="search-group">
              <div class="search-item">
                <span class="label">人口类型：</span>
                <el-select v-model="searchform.personType"  placeholder="请选择" style="width:calc(100% - 100px);" clearable>
                  <el-option
                    v-for="item in rkoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div class="search-item">
                <span class="label">重点人员：</span>
                <el-select v-model="searchform.specialPerson"  placeholder="请选择" style="width:calc(100% - 100px);" clearable>
                  <el-option
                    v-for="item in gloptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div class="search-item">
                <span class="label">现居住地：</span>
                <el-input style="width:calc(100% - 100px);" v-model="searchform.residence">
                </el-input>
              </div>
              <div class="search-item">
                <span class="label">籍贯：</span>
                <el-input style="width:calc(100% - 100px);" v-model="searchform.nativeInfo">
                </el-input>
              </div>
              <!-- <div class="search-item">
                <span class="label">户口类型：</span>
                <el-select v-model="registeredType"  placeholder="请选择" style="width:calc(100% - 100px);" clearable>
                  <el-option
                    v-for="item in hkoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div> -->
              
            <!-- <span class="search-item" style="flex:1">
                <button class="btn btn-info ridiusnull btn-search" type="button" @click="clearSearchItem">重置</button>
            </span> -->
            </div>
   
              <div style="width:100%;text-align:center;margin-top: 10px;margin-bottom:0px;">
                    <button class="btn btn-info ridiusnull btn-search" type="button" @click="doGaojijiansuo = 'all';searchExcontrol(1)">查询</button>
                    <button class="btn btn-info ridiusnull btn-search" type="button" @click="clearSearchItem()">重置</button>
                    <button class="btn btn-info ridiusnull btn-search" type="button" @click="toggleNormal()">取消</button>
              </div>
       
            </div>
            <div id="renkousearchdiv" style="margin-top:10px;" v-show="srcresshow">
              <div class="model-hold">
                <el-table :data="srcTableData" height="calc(100vh - 540px)">
                  <el-table-column type="index" width="50" label="序号">
                  </el-table-column>
                  <el-table-column prop="name" label="姓名" min-width="80">
                  </el-table-column>
                  <el-table-column prop="idNumber" label="身份证" min-width="160">
                  </el-table-column>
                  <!-- <el-table-column prop="gender" label="性别" min-width="80">
                  </el-table-column>
                  <el-table-column label="出生日期" min-width="160" >
                    <template slot-scope="scope">
                      {{getFormatDateYear(scope.row.birthdate)}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="education" label="文化程度" min-width="100" >
                  </el-table-column>
                  <el-table-column prop="political" label="政治面貌" min-width="100">
                  </el-table-column>
                  <el-table-column prop="nation" label="民族" min-width="80">
                  </el-table-column>
                  <el-table-column prop="marriage" label="婚姻状况" min-width="80" >
                  </el-table-column> -->
                  <!-- <el-table-column prop="dispositionID" label="与户主关系" min-width="100" >
                  </el-table-column> -->
                  <el-table-column prop="residence" label="现居住地" min-width="320">
                  </el-table-column>
                  <el-table-column prop="nativeInfo" label="籍贯" min-width="80">
                  </el-table-column>
                  <!-- <el-table-column prop="company" label="工作单位" min-width="200" >
                  </el-table-column> -->
                  <el-table-column prop="phone" label="联系电话" min-width="150" >
                  </el-table-column>
                  <el-table-column prop="personType" label="人口类型" min-width="100">
                  </el-table-column>
                  <el-table-column prop="specialPerson" label="管理类别" min-width="120">
                  </el-table-column>                  
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
            <!-- <el-form-item label="计生对象">
              <el-select v-model="form.jsdx" placeholder="请选择">
                <el-option label="计生对象" value="计生对象"></el-option>
                <el-option label="非计生对象" value="非计生对象"></el-option>
              </el-select>
            </el-form-item> -->
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
            <!-- <el-form-item label="兵役状况" prop="militaryState">
              <el-select v-model="addRenkouform.entity.person.militaryState" placeholder="请选择">
                <el-option label="未服兵役" value="未服兵役"></el-option>
                <el-option label="现役军人" value="现役军人"></el-option>
                <el-option label="已服兵役" value="已服兵役"></el-option>
              </el-select>
            </el-form-item> -->
            
          </el-form-item>


          <el-form-item style="width: 850px;">
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
            <!-- <el-form-item label="与单位关系">
              <el-select v-model="addRenkouform.entity.person.yhzgx" placeholder="请选择">
                <el-option label="员工" value="员工"></el-option>
                <el-option label="下岗" value="下岗"></el-option>
              </el-select>
            </el-form-item> -->
          </el-form-item>

          <el-form-item label="备注" prop="remarks">
            <el-input type="textarea" v-model="addRenkouform.entity.person.remarks" style="width:697px;"></el-input>
          </el-form-item>

          </el-form>
          <div class="pic-group">
            <div class="picture-hold">
                <p class="pic-btn">人像</p>
                <div class="pic-wrap">
                  <el-upload action='' class="avatar-uploader" :show-file-list="false" :auto-upload="false" :on-change="readManImage" accept="image/jpeg,image/png">
                    <i  v-if="imageMan.url" class="clear-pic fa fa-times-circle-o" @click.stop="clearImg"></i>
                    <i class="rx-icon defaul-sym" style="font-size:30px"></i>
                    <p class="up-text">上传人像</p>
                    <img v-if="imageMan.url" :src="imageMan.url" class="avatar">
                  </el-upload>
                </div>
              </div>
          </div>


          <el-dialog
            title="选择已有住址"
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
                  <el-input v-model="yyzzform.xqmc" autoComplete="off"></el-input>
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
                  <el-input v-model="yyzzform.ldmc" autoComplete="off">
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
                  <el-input v-model="yyzzform.dymc" autoComplete="off">
                    <template slot="append">单元</template>
                  </el-input>
                </el-form-item>
                <el-form-item >
                  <el-button type="primary" size='small' @click="searchdizhi(1)" style="margin-left:25px;width:105px;font-size:12px;">查询</el-button>
                </el-form-item>
            </el-form-item>

            <!-- <el-form-item>
              <el-form-item label="姓名：" prop="name">
                <el-input v-model="yyzzform.name" disabled></el-input>
              </el-form-item>
              <el-form-item label="身份证：" prop="idCard">
                <el-input v-model="yyzzform.idCard" disabled></el-input>
              </el-form-item>
              <el-form-item label="房屋属性：" prop="fwsx">
                <el-select v-model="yyzzform.fwsx" placeholder="请选择" disabled>
                  <el-option label="其它" value="其它"></el-option>
                  <el-option label="民居" value="民居"></el-option>
                  <el-option label="出租屋" value="出租屋"></el-option>
                  <el-option label="商业" value="商业"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item >
                  <el-button type="primary" size='small' @click="clearYyzzForm" style="margin-left:25px;width:105px;font-size:12px;">重置</el-button>
              </el-form-item>
            </el-form-item> -->
            </el-form>
          
              <div id="selectdizhi" style="margin-top:10px;" v-show="srcresshow">         
                <div class="model-hold">
                  <el-table :data="srcDizhiData">
                    <el-table-column align="center" width="55">
                      <template slot-scope="scope">
                          <el-radio :label="scope.$index" v-model="selectedIdx" @change.native="getSelZhuzhiRow(scope.$index,scope.row)">&nbsp;</el-radio>
                      </template>
                    </el-table-column>
                    <!-- <el-table-column prop="houseType" label="房屋属性" min-width="80">
                    </el-table-column> -->
                    <el-table-column prop="communityName" label="小区名称" min-width="100" >
                    </el-table-column>
                    <el-table-column prop="buildingName" label="楼栋名称" min-width="60">
                    </el-table-column>
                    <el-table-column prop="unitName" label="单元号" min-width="60" >
                    </el-table-column>
                    <el-table-column prop="floor" label="楼层" min-width="60" >
                    </el-table-column>
                    <el-table-column prop="houseNumber" label="门牌号" min-width="60">
                    </el-table-column>
                    <el-table-column prop="hostName" label="户主姓名" min-width="60">
                    </el-table-column>
                    <el-table-column prop="address" label="详细地址" min-width="260">
                    </el-table-column>
                  </el-table>
                </div>
                <el-pagination background @current-change="searchdizhi" :page-size="10" :current-page.sync="currentPageDizhi" layout="total, prev, pager, next, jumper" :total="srcdizhitotal">
                </el-pagination>
              </div>

            <div slot="footer" class="dialog-footer" style="text-align:center;">
              <el-button type="primary" @click="closeYyzz" size='medium' style="width:120px;margin-right:50px;">取 消</el-button>
              <el-button type="primary" @click="getSelZhuzhiRowData" size='medium' style="width:120px;">确定</el-button>
            </div>
          </el-dialog>

          <el-dialog
            title="选择已有单位"
            :visible.sync="isShowSelectDanwei"
            width="1060px"
            height="628px"
            class="modal-popover"
            :close-on-click-modal='false'
            :before-close="closeYydw"
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

            <el-form :model="yydwform" ref="yydwform" :inline="true" class="newform" style="padding:10px;">
            <el-form-item> 
                <el-form-item label="小区名称：" prop="xqmc">
                  <el-select v-model="yydwform.xqmc" disabled placeholder="请选择"  clearable>
                    <el-option
                      v-for="item in xqoptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="楼栋名称：" prop="ldmc">
                  <el-select v-model="yydwform.ldmc" disabled placeholder="请选择" clearable>
                    <el-option
                      v-for="item in ldoptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="单位地址：" prop="dwdz">
                  <el-input v-model="yydwform.dwdz" autoComplete="off"></el-input>
                </el-form-item>
                <el-form-item >
                  <el-button type="primary" size='small' @click="showSelectDanwei" style="margin-left:25px;width:105px;font-size:12px;">查询</el-button>
                </el-form-item>
            </el-form-item>

            <el-form-item>
              <el-form-item label="单位性质：" prop="dwxz">
                <el-input v-model="yydwform.dwxz" autoComplete="off"></el-input>
              </el-form-item>
              <el-form-item label="经营范围：" prop="jyfw">
                <el-input v-model="yydwform.jyfw" autoComplete="off"></el-input>
              </el-form-item>
              <el-form-item label="法人姓名：" prop="frxm">
                <el-input v-model="yydwform.frxm" autoComplete="off"></el-input>
              </el-form-item>
              <el-form-item >
                  <el-button type="primary" size='small' @click="clearYydwForm" style="margin-left:25px;width:105px;font-size:12px;">重置</el-button>
              </el-form-item>
            </el-form-item>
            </el-form>
          
              <div id="bukongsearchdiv" style="margin-top:10px;" v-show="srcresshow">         
                <div class="model-hold">
                  <el-table :data="srcDanweiData">
                    <el-table-column align="center" width="55">
                      <template slot-scope="scope">
                          <el-radio :label="scope.$index" v-model="selectedIdx" @change.native="getSelDanweiRow(scope.$index,scope.row)">&nbsp;</el-radio>
                      </template>
                    </el-table-column>
                    <el-table-column prop="companyName" label="单位名称" min-width="150">
                    </el-table-column>
                    <el-table-column prop="companyType" label="单位性质" min-width="60" >
                    </el-table-column>
                    <el-table-column prop="address" label="单位地址" min-width="150">
                    </el-table-column>
                    <el-table-column prop="legalPerson" label="法人姓名" min-width="60" >
                    </el-table-column>
                    <el-table-column prop="idNumber" label="法人身份证" min-width="100" >
                    </el-table-column>
                  </el-table>
                </div>
                <el-pagination background @current-change="searchdanwei" :page-size="10" :current-page.sync="currentPageDanwei" layout="total, prev, pager, next, jumper" :total="srcdanweitotal">
                </el-pagination>
              </div>

            <div slot="footer" class="dialog-footer" style="text-align:center;">
              <el-button type="primary" @click="closeYydw" size='medium' style="width:120px;margin-right:50px;">取 消</el-button>
              <el-button type="primary" @click="getSelDanweiRowData" size='medium' style="width:120px;">确定</el-button>
            </div>
          </el-dialog>

          <div slot="footer" class="dialog-footer" style="text-align:center;">
            <el-button type="primary" @click="closeAddForm" size='medium' style="width:120px;margin-right:50px;">取 消</el-button>
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
          <rk-details ref="rkdetails"></rk-details>
          <div slot="footer" class="dialog-footer" style="text-align:center;padding-top:0px;clear:both;">
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
  name: "shiyourenkou",
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
      plfileUrl: '',
      plfileUrlname: '',
      pldeleteshow: false,
      totalcount:'',
      floatingcount:'',
      residentcount:'',
      // form: {
      //     name: '',
      //     sfz: '',
      //     xb: '',
      //     bthday:'',
      //     mz:'',
      //     jg:'',
      //     hyzk:'',
      //     zzmm:'',
      //     whcd:'',
      //     sjhm:'',
      //     rklx:'',
      //     tsrq:'',
      //     yfdx:'',
      //     clxx:'',
      //     jsdx:'',
      //     hklx:'',
      //     ylbx:'',
      //     ylbx:'',
      //     jkzk:'',
      //     byzk:'',
      //     zjrs:'',
      //     sg:'',
      //     xx:'',
      //     yhzgx:'',
      //     type:'',
      //     zz:'',
      //     dw:'',
      //     desc:'',
      //   },
      srcrestotal: 0,
      srcdanweitotal:0,
      srcdizhitotal:0,
      currentPage: 1,
      currentPageDizhi:1,
      currentPageDanwei:1,
      srcresshow: true,
      datetimerange: [],
      controlpeople:null,
      controlcar:null,
      xqoptions: [],
      ldoptions: [],
      gxoptions: [],
      dyoptions: [],
      hkoptions:[
        {
          label: '城镇',
          value: '城镇'
        },{
          label: '农村',
          value: '农村'
        }
      ],
      rkoptions:[
        {
          label: '常住',
          value: '常住'
        },{
          label: '暂住',
          value: '暂住'
        },
        {
          label: '流动人口',
          value: '流动人口'
        },{
          label: '空挂户',
          value: '空挂户'
        },
      ],
      gloptions:[
        {
          label: '在逃人员',
          value: '在逃人员'
        },{
          label: '涉毒人员',
          value: '涉毒人员'
        },
        {
          label: '涉稳人员',
          value: '涉稳人员'
        },{
          label: '涉恐人员',
          value: '涉恐人员'
        },
        {
          label: '重大刑事犯罪前科人员',
          value: '重大刑事犯罪前科人员'
        },{
          label: '肇事精神病人',
          value: '肇事精神病人'
        },
        {
          label: '重点上访人员',
          value: '重点上访人员'
        },
      ],
      isLevelDisable:true,
      bukongtype: '',
      bukongkey:'',
      bukongbh: '',
      srcTableData:[],
      srcDanweiData:[],
      srcDizhiData:[],      
      isShowNewMessageBox:false,
      isShowSelectDanwei:false,
      isShowSelectZhuzhi:false,
      imageMan: {
        url:''
      },
      currentId: '',
      isShowDetails: false,
      vifdetails:false,
      searchform:{
      communityName:'',
      village:'',  
      name:'',
      idNumber:'',  
      specialPerson	:'',
      residence:'',
      nativeInfo:'',
      personType:'',
      },
      doGaojijiansuo: 'all',
      addRenkouform: {},
      addRenkouform_bak:
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
              relation:'',
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
      selectedIdx: -1,
      selectedRow: {},
      yydwform: {
        xqmc:'',
        ldmc:'',
        dwdz:'',
        dwxz:'',
        jyfw:'',
        frxm:''
      },
      yyzzform: {
        xqmc:'',
        ldmc:'',
        dymc:'',
        idCard:'',
        name:'',
        fwsx:''
      },
      isNeworEdit:'',
      rylrrule: {
        idNumber: [
          {
            required: true,
            message: "身份证号不能为空！",
            trigger: "change"
          },
          { validator: validateZjh, trigger: 'blur' },
        ],
        nativeInfo:[
          {
            pattern:/^[\u4E00-\u9FA5]+$/,
            message: '民族只能包含中文',
            trigger: 'blur'
          },
        ],
        phone:[
          {
            pattern:/^[0-9]+$/,
            message: '手机号码只能包含数字',
            trigger: 'blur'
          },
        ]
        // bksfz: [
        //   { validator: validateSfz, trigger: 'blur' },
        //   {
        //     pattern:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
        //     message: '身份证格式不正确！' 
        //   }
        // ],
      },
    }
  },
  beforeRouteEnter(to, from, next) {
      if (from.name=='renyuanxiangqing') {
         to.meta.isBack = true;
      }

      next();
  },
  activated() {
      if (!this.$route.meta.isBack) {
        this.currentPage = 1;
        this.clearSearchItem();
        this.searchExcontrol(1);
        this.getRenkouCount();
        this.getVillageSelect();
      }
      this.$route.meta.isBack = false;
  },
  created() {
    this.addRenkouform = JSON.parse(JSON.stringify(this.addRenkouform_bak));
  },
  mounted() {
    this.searchExcontrol(1);
    this.getRenkouCount();
    this.getVillageSelect();
  },
  components: {
    "rk-details": () => import("@/views/yibiaosishi/shiyourenkou/DetailsRenkou"),
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
    getRenkouCount(){
      return excontrolApi
        .yibiaosishiRenkouCount()
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.totalcount = data.total;
          this.floatingcount = data.floating;
          this.residentcount = data.resident;          
        });

    },

    getVillageSelect(){
        return excontrolApi
        .renkouGetVillage()
        .then(res => res.data)
        .then(data => {
          // loading.close();
          if(data!=null)
          {
            this.gxoptions = data;
          }
          else if(data==null)
          {
            this.gxoptions = [];
          }
          
        });
    },

    showNewMessageBox(){
      this.isNeworEdit="新增人口";
     // this.addRenkouform.resetField;
      this.isLevelDisable = true;
      this.isShowNewMessageBox =true;
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

//     editbkdetail(data) {
//       // console.log(data)
//       // this.$router.push({path:'/bukongguanli/bukongxiangqing',query: {pro_id: data.dispositionID, type: 'edit'}});
//       this.isNeworEdit="修改人员";
//       this.addRenkouform.entity.person = data;
//       this.isShowNewMessageBox =true;
//       // if(this.addFangwuform.entity.poor==false)
//       // {
//       //   this.addFangwuform.entity.poor = "否";
//       // }
//       // else if(this.addFangwuform.entity.poor==true)
//       // {
//       //   this.addFangwuform.entity.poor = "是";
//       // }
//       // this.fwryTableData=[];
//       // let param = {};
//       // param.pageNum = 1;
//       // param.pageSize = 10;
//       // param.housingId = data.id;

//       // return excontrolApi
//       //   .fangwuDetailsPersonInHouseSearch(param)
//       //   .then(res => res.data)
//       //   .then(data => {
//       //     // loading.close();
//       //  //   this.srcrestotal = data.total;
//       //     //生成表格
//       //     this.fwryTableData = data.rows;
//       //     for(var i=0;i<this.fwryTableData.length;i++)
//       //     {
//       //       this.srcTableData[i].birthdate = this.getFormatDate(this.fwryTableData[i].birthdate);
//       //     }

//       //     this.isShowNewMessageBox =true;
//       //   });
      
//  //     this.fwryTableData=[];
//     },

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
        param.buildingName = this.yyzzform.ldmc;
      }
      if(this.yyzzform.dymc)
      {
        param.unitName = this.yyzzform.dymc;
      }
      // if(this.yyzzform.name)
      // {
      //   param.hostName = this.yyzzform.name;
      // }

      // if(this.yyzzform.idCard)
      // {
      //   param.hostIdNumber = this.yyzzform.idCard;
      // }
      // if(this.yyzzform.fwsx)
      // {
      //   param.houseType = this.yyzzform.fwsx;
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
        .biaozhundizhiResidenceSearch(param)
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

    searchdanwei: function(ctrcurrentPage) {
      let param = {};
      param.pageNum = ctrcurrentPage;
      param.pageSize = 10; 
      // if(this.communityName)
      // {
      //   param.communityName = this.communityName;
      // }
      // if(this.buildingName)
      // {
      //   param.buildingName = this.buildingName;
      // }
      if(this.yydwform.dwdz)
      {
        param.address = this.yydwform.dwdz;
      }
      if(this.yydwform.dwxz)
      {
        param.companyType = this.yydwform.dwxz;
      }

      if(this.yydwform.jyfw)
      {
        param.businessScope = this.yydwform.jyfw;
      }
      if(this.yydwform.frxm)
      {
        param.legalPerson = this.yydwform.frxm;
      }

      return excontrolApi
        .shiyoudanweiSearch(param)
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.srcdanweitotal = data.total;
          //生成表格
          this.srcDanweiData = data.rows;
          for(var i=0;i<this.srcDanweiData.length;i++)
          {
        //    this.srcTableData[i].managementPeriod = this.getFormatDate(this.srcTableData[i].managementPeriod);
          }

        });
    },

    showSelectDanwei(){
      this.searchdanwei(1);
      this.isShowSelectDanwei = true;
      // this.isShowNewMessageBox=false;
    },
    showSelectZhuzhi(){
      this.searchdizhi(1);
      this.isShowSelectZhuzhi = true;
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
    // getBase64(src,callback) {
    //   var img = document.createElement('img');
    //   let _this = this;
    //   img.onload = function(e) {
    //       var canvas = document.createElement('canvas');
    //       canvas.width = img.width;
    //       canvas.height = img.height;
    //       var context = canvas.getContext('2d');
    //       context.drawImage(img, 0, 0, img.width, img.height);
    //       canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
    //       canvas.toBlob((blob)=>{
    //         _this.blobToDataURL(blob,function(dataurl) {
    //           _this.addRenkouform.imageBase64 = dataurl.replace('data:image/jpeg;base64,', '');
    //           callback();
    //         })
    //         // let link = window.URL.createObjectURL(blob);
              
    //       }, "image/jpeg");
    //   }
    //   img.setAttribute("crossOrigin",'Anonymous');
    //   img.src = src;
    // },
    closeAddForm() {
      this.clearAddForm();
      this.isShowNewMessageBox = false;
    },
    clearAddForm() {
      this.clearImg();
      this.$refs['ruleFormrylr'].resetFields();
      this.addRenkouform = JSON.parse(JSON.stringify(this.addRenkouform_bak));
    },      
    newRenkou(){
        if(this.addRenkouform.entity.person.idNumber=='')
        {
          this.$alert("身份证不能为空", "提示", {
          confirmButtonText: "确定"
          });
          return;
        }
        else{
          this.addRenkouform.entity.personHousing.personId = this.addRenkouform.entity.person.idNumber;
        }

        if(this.addRenkouform.entity.person.residence=='')
        {
          this.$alert("住址不能为空", "提示", {
          confirmButtonText: "确定"
          });
          return;
        }

        if(this.addRenkouform.entity.person.relation=='')
        {
          this.$alert("与户主关系不能为空", "提示", {
          confirmButtonText: "确定"
          });
          return;
        }
        else{
            this.addRenkouform.entity.personHousing.relation=this.addRenkouform.entity.person.relation;
        }

        if(this.addRenkouform.entity.person.specialPerson&&(this.addRenkouform.entity.person.specialLevel==''||(!this.addRenkouform.entity.person.specialLevel)))
        {
            this.$alert("选择了重点人员必须选择该人员的风险等级", "提示", {
              confirmButtonText: "确定"
              });
            return;
        }


      if(this.isNeworEdit=="新增人口")
      {
          this.addRenkouform.entity.personCompany.idNumber = this.addRenkouform.entity.person.idNumber;
          let imgLink = this.imageMan;        
          if (imgLink.url) {
            let tempImage = new Image();
            // tempImage.src = imgLink.url;
            // this.getBase64(imgLink.url,this.addData);
            // tempImage.type = imgLink.raw.type;
      //     tempImage.crossOrigin = "*";
            // this.addRenkouform.imageBase64 = this.getBase64Image(tempImage).replace('data:image/jpeg;base64,', '');
            let _this = this;
            tempImage.onload = function(e) {
                _this.getBase64Image(tempImage, _this.addData);     
            }
            tempImage.setAttribute("crossOrigin",'Anonymous');
            tempImage.src = imgLink.url;
          } else {
            this.addRenkouform.imageBase64 = "";
            this.addData();
          }          
      }
      else if(this.isNeworEdit=="修改人员") 
      {
        this.addRenkouform.entity.personCompany.idNumber = this.addRenkouform.entity.person.idNumber;
        // this.addRenkouform.entity.personCompany.companyCode = this.addRenkouform.entity.person.companyCode;
        this.addRenkouform.entity.personHousing.housingId = this.addRenkouform.entity.person.residenceCode;
        if(this.addRenkouform.entity.person.relation)
        {
          this.addRenkouform.entity.personHousing.relation=this.addRenkouform.entity.person.relation;
        }
        else{
          this.addRenkouform.entity.personHousing.relation='';
        }

        let imgLink = this.imageMan;        
        if (imgLink.url) {
          let tempImage = new Image();
          // this.getBase64(imgLink.url,this.updateData);
          // tempImage.type = imgLink.raw.type;
          // tempImage.crossOrigin = "*";
          // this.addRenkouform.imageBase64 = this.getBase64Image(tempImage).replace('data:image/jpeg;base64,', '');
          let _this = this;
          tempImage.onload = function(e) {
              _this.getBase64Image(tempImage, _this.updateData);     
          }
          tempImage.setAttribute("crossOrigin",'Anonymous');
          tempImage.src = imgLink.url;
        } else {
          this.addRenkouform.imageBase64 = "";
          this.updateData();
        } 
 
      }

    },
    addData(dataurl) {
      if (dataurl) {
        this.addRenkouform.imageBase64 = dataurl.replace('data:image/jpeg;base64,', '');
      }
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
                this.closeAddForm();
                this.currentPage = 1;
                this.srcrestotal = 0;
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
        this.addRenkouform.imageBase64 = dataurl.replace('data:image/jpeg;base64,', '');
      }
      return excontrolApi
              .renkouModify(this.addRenkouform)
              .then(res => res)
              .then(data => {
                  if(data.code==200)
                  {
                      // loading.close();
                    this.$confirm("更新人口成功", "提示", {
                      confirmButtonText: "确定",
                      type: "success"
                  }).then(() => {
                //    this.cancelbk();
                      this.closeAddForm();
                      this.currentPage = 1;
                      this.srcrestotal = 0;
                      this.searchExcontrol(1);
                  }
                  ).catch(action => {
                    if (action == 'cancel') {
                      this.closeAddForm();
                    }
                  })
                  }
              });
    },
    readManImage: function(file) {
      this.imageMan = file;
      this.imageMan.url = URL.createObjectURL(file.raw);
    },
    clearImg() {
      this.imageMan = {};
      return false;
    },
    lookbkdetail(data) {
      // console.log(data)
      // this.$router.push({path:'/yibiaosishi/renyuanxiangqing',query: {id_number: data.idNumber}});
      this.currentId = data.idNumber;
      this.isShowDetails = true;
      this.$nextTick(()=>{
          this.$refs.rkdetails.initDetals(data.idNumber);
      });
    },
    editbkdetail(data) {
      // console.log(data)
      // this.$router.push({path:'/yibiaosishi/bukongxiangqing',query: {pro_id: data.dispositionID, type: 'edit'}});
      this.isNeworEdit="修改人员";
      this.isShowNewMessageBox = true;
      this.$nextTick(() => {
        this.addRenkouform.entity.person = JSON.parse(JSON.stringify(data));
        if (data.imageUrls) {
          this.imageMan.url = this.BASE_IMG_URL + data.imageUrls;
        }
        if(data.specialPerson)
        {
          this.isLevelDisable=false;
        }
        else{
          this.isLevelDisable =true;
        }
      });

    },
    deletebkdetail(data) {
      this.$confirm("确定要删除该条人员信息？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        //撤销布控
        let param={};
        param.idNumber = data.idNumber;
        return excontrolApi
        .shiyourenkouDelete(param)
        .then(res => res)
        .then(data => {
            if(data.code==200)
            {
                this.$message({
                message: data.data,
                type: "success"
              }); 
              this.searchExcontrol(1);
            }
            else{
              this.$message({
                message: data.data,
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
      this.currentPage = 1;
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
      // param.type="person";

      // return excontrolApi
      return excontrolApi
        .shiyourenkouSearch(param)
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.srcrestotal = data.total;
          //生成表格
          this.srcTableData = data.rows;
          for(var i=0;i<this.srcTableData.length;i++)
          {
            this.srcTableData[i].eventDate = this.getFormatDate(this.srcTableData[i].eventDate, 'YYYY-MM-DD HH:mm');
            if(this.srcTableData[i].residence!='')
            {
              if(this.srcTableData[i].roomAddress&&this.srcTableData[i].roomAddress!='')
              {
                this.srcTableData[i].residence += this.srcTableData[i].roomAddress;
              }
              else{

              }
            }
          }

        });

      }
      let param = {};
      param.pageNum = ctrcurrentPage;
      param.pageSize = 10;

      if(this.searchform.communityName)
      {
        param.communityName = this.communityName;
      }

      if(this.searchform.name)
      {
        param.name = this.searchform.name;
      }
      if(this.searchform.IdNumber)
      {
        param.idNumber = this.searchform.IdNumber;
      }

      if(this.searchform.specialPerson)
      {
        param.specialPerson = this.searchform.specialPerson;
      }

      if(this.searchform.personType)
      {
        param.personType = this.searchform.personType;
      }

      if(this.searchform.nativeInfo)
      {
        param.nativeInfo = this.searchform.nativeInfo;
      }

      if(this.searchform.village)
      {
        param.villageId = this.searchform.village;
      }

      if(this.searchform.residence)
      {
        param.residence = this.searchform.residence;
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
        .shiyourenkouSearch(param)
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.srcrestotal = data.total;
          //生成表格
          this.srcTableData = data.rows;
          for(var i=0;i<this.srcTableData.length;i++)
          {
            this.srcTableData[i].eventDate = this.getFormatDate(this.srcTableData[i].eventDate, 'YYYY-MM-DD HH:mm');
            if(this.srcTableData[i].residence!='')
            {
              if(this.srcTableData[i].roomAddress&&this.srcTableData[i].roomAddress!='')
              {
                this.srcTableData[i].residence += this.srcTableData[i].roomAddress;
              }
              else{

              }
            }
          }
        });
    },  
    clearSearchItem() {
      this.searchform.communityName = '';
      this.searchform.name = '';
      this.searchform.IdNumber = '';
      this.searchform.village = '';
      this.searchform.personType = '';
      this.searchform.residence = '';
      this.searchform.specialPerson	 = '';
      this.searchform.nativeInfo	 = '';
      
    },
    getSelZhuzhiRow(index, row) {         //获取已有地址选中数据
        this.selectedIdx = index;
        this.selectedRow = row;
    },
    getSelZhuzhiRowData() {
      this.addRenkouform.entity.person.residence = this.selectedRow.address;
      this.addRenkouform.entity.person.residenceCode = this.selectedRow.id;
      this.addRenkouform.entity.personHousing.housingId = this.selectedRow.id;
      // this.addRenkouform.entity.person.residenceCode = this.selectedRow.id;
      this.addRenkouform.entity.person.roomCode = this.selectedRow.roomCode;
      this.selectedIdx = -1;
      this.isShowSelectZhuzhi = false;
    },
    getSelDanweiRow(index, row) {         //获取已有单位选中数据
        this.selectedIdx = index;
        this.selectedRow = row;
    },
    getSelDanweiRowData() {
      this.addRenkouform.entity.person.company = this.selectedRow.companyName;
      this.addRenkouform.entity.personCompany.companyCode = this.selectedRow.id;
      this.selectedIdx = -1;
      this.isShowSelectDanwei = false;
    },
    clearYyzzForm() {
      this.$refs["yyzzform"].resetFields();
    },
    closeYyzz() {
      this.clearYyzzForm();
      this.isShowSelectZhuzhi = false;
    },
    clearYydwForm() {
      this.$refs["yydwform"].resetFields();
    },
    closeYydw() {
      this.clearYydwForm();
      this.isShowSelectDanwei = false;
    },

       //文件上传预览
    plchangeUpload(file, fileList) {
      // if (file) {
      //   let Xls = file.name.split('.');
      //   let index = Xls.length - 1;
      //   if (Xls[index] === 'xls' || Xls[index] === 'xlsx') {
      //     this.plfileUrlname = file.name;
      //     this.plfileUrl = file.raw;
      //     this.pldeleteshow = true;
      //   } else {
      //     this.$message.error('上传文件只能是 xls/xlsx 格式!');
      //     return false;
      //   }
      // }

      // var formData = new FormData();
      // //循环添加到formData中
      // fileList.forEach(function (file) {
      //     formData.append('personPhotos', file, file.name);
      // })

      // return excontrolApi
      //   .uploadImgs(formData)
      //   .then(res => res.data)
      //   .then(data => {
      //     console.log('上传文件成功！');
      //     this.$message({
      //       message: '上传成功',
      //       type: "success"
      //     });    
      //   }).catch(action => {
          
      // });
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
  background: url(../../../../static/image/yibiaosishi/renkou.png) no-repeat;
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
  background: url(../../../../static/image/yibiaosishi/renyuanluru.png) no-repeat;
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
.rx-icon {
  background-image: url("/static/image/jiansuo/rx-icon.png");
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