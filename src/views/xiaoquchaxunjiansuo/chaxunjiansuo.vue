<template>
  <div id="contentbody" class="content-body">
    <div class="page-bread">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>检索查询</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-row">
      <div class="bl-content">
        <div style="margin: 35px auto;text-align:center;" v-if="!isGaojijiansuo">
          <el-input placeholder="请输入内容" v-model="searchStr" class="input-with-select">
            <el-select v-model="searchType" slot="prepend" placeholder="请选择" style="width:100px;">
              <el-option label="姓名" value="1"></el-option>
              <el-option label="身份证" value="2"></el-option>
              <el-option label="电话" value="3"></el-option>
              <el-option label="房屋" value="4"></el-option>
            </el-select>
          </el-input>
           <button class="btn btn-info ridiusnull btn-search" type="button" @click="doSearch(1)">查询</button>
           <a @click="toggleGaoji">高级搜索</a>
        </div>
        <div class="gaojijiansuo" v-if="isGaojijiansuo">
          <el-form :model="ruleForm" :rules="rule" ref="ruleForm" :inline="true">
            <el-form-item style="width: 1400px;">
              <el-form-item label="姓名：" prop="xm">
                <el-input  v-model="ruleForm.xm"  style="width:250px"></el-input>
              </el-form-item>
              <el-form-item label="车牌：" prop="cp">
                <el-input  v-model="ruleForm.cp"  style="width:250px"></el-input>
              </el-form-item>
              <el-form-item label="房屋地址：" prop="fwdz">
                <el-input  v-model="ruleForm.fwdz"  style="width:250px"></el-input>
              </el-form-item>
            </el-form-item>

            <el-form-item style="width: 1400px;">
              <el-form-item label="身份证：" prop="sfz">
                <el-input  v-model="ruleForm.sfz"  style="width:250px"></el-input>
              </el-form-item>
              <el-form-item label="车牌颜色：" prop="cpys">
                <el-select v-model="ruleForm.cpys" placeholder="请选择" clearable style="width:250px">
                  <el-option
                    v-for="item in cpys"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="房屋属性：" prop="fwsx">
                <el-select v-model="ruleForm.fwsx" placeholder="请选择" clearable style="width:250px">
                  <el-option
                    v-for="item in fwsxs"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form-item>

            <el-form-item style="width: 1400px;">
              <el-form-item label="电话：" prop="dh">
                <el-input  v-model="ruleForm.dh"  style="width:250px"></el-input>
              </el-form-item>
              <el-form-item label="车辆属性：" prop="clsx">
                <el-select v-model="ruleForm.clsx" placeholder="请选择" clearable style="width:250px">
                  <el-option
                    v-for="item in clsxs"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="房屋标签：" prop="fwbq">
               <el-select v-model="ruleForm.fwbq" placeholder="请选择" clearable style="width:250px">
                  <el-option
                    v-for="item in fwbqs"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form-item>

            <el-form-item style="width: 1400px;">
              <el-form-item label="人员属性：" prop="rysx">
                <el-select v-model="ruleForm.rysx" placeholder="请选择" clearable style="width:250px">
                  <el-option
                    v-for="item in rysxs"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="车辆标签：" prop="clbq">
                <el-select v-model="ruleForm.clbq" placeholder="请选择" clearable style="width:250px">
                  <el-option
                    v-for="item in clbqs"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="人员标签：" prop="rybq">
                <el-select v-model="ruleForm.rybq" placeholder="请选择" clearable style="width:250px">
                  <el-option
                    v-for="item in rybqs"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form-item>

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
              <div class="picture-hold">
                <p class="pic-btn">车像</p>
                <div class="pic-wrap">
                  <el-upload action='' class="avatar-uploader" :show-file-list="false" :auto-upload="false" :on-change="readCheImage" accept="image/jpeg,image/png">
                    <i  v-if="imageChe.url" class="clear-pic fa fa-times-circle-o" @click.stop="clearImgChe"></i>
                    <i class="cx-icon defaul-sym" style="font-size:30px"></i>
                    <p class="up-text">上传车像</p>
                    <img v-if="imageChe.url" :src="imageChe.url" class="avatar">
                  </el-upload>
                </div>
              </div>
            </div>
            <el-form-item style="width:100%;text-align:center;margin-top: 5px;">
              <button class="btn btn-info ridiusnull btn-search" type="button" @click="doSearch(1)">查询</button>
              <button class="btn btn-info ridiusnull btn-search" type="button" @click="resetForm('ruleForm')">重置</button>
              <button class="btn btn-info ridiusnull btn-search" type="button" @click="toggleNormal()">取消</button>
            </el-form-item>
          </el-form>
        </div>
        <div class="result-group">
          <div class="tab-info result-item">
             <label id="id-tab-left" class='tab-left'><i class="fa 	fa fa-angle-left fa-lg" style=""></i></label>
            <div class="rukou-item" index="0">
                <div class="rukou-title">
                  <span>个人信息</span>
                </div>
                <div class="rukou-content">
                  <div class="rukou-content-left fl">
                    <div class="picture-hold">
                      <div class="pic-wrap">
                          <img src="/static/image/jiansuo/defaultry.png">
                      </div>
                      <p class="label-btn">快递员</p>
                      <p class="label-btn">
                         <i class="fa 	fa fa-plus-circle fa-lg"  style="color:grey;"></i>
                         添加标签
                      </p>

                    </div>
                  </div>
                  <div class="rukou-content-right fr">
                    <div class="g-hold basic-con border-full" style="margin-top:0px">
                      <p class="ic-con">
                      </p>
                      <div class="info-con">
                        <p class="info-item">
                          <span class="info-itemlabel">姓名：</span>
                          <span>李莉</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">身份证号：</span>
                          <span>510210199502122545</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">户籍地：</span>
                          <span>南充</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">人员属性：</span>
                          <span>租户</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">入住时间：</span>
                          <span>2016-10-16</span>
                        </p>
                      </div>
                    </div>
                    <div class="g-hold phone-con border-full">
                      <p class="ic-con">
                      </p>
                      <div class="info-con">
                        <div class="info-item">
                          <span class="info-itemlabel">电话：</span>
                          <div>
                            <p class="info-itemdes" v-for="(item,index) in sjhms" :key=index>
                              <span>{{item.sjhm}}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="g-hold net-con border-full">
                      <p class="ic-con">
                      </p>
                      <div class="info-con">
                        <div class="info-item" style="border-bottom:none">
                          <span class="info-itemlabel">QQ：</span>
                          <div>
                            <p class="info-itemdes" v-for="(item,index) in qqhms" :key=index>
                              <span>{{item.qqhm}}</span>
                            </p>
                          </div>
                        </div>
                        <div class="info-item" style="border-bottom:none">
                          <span class="info-itemlabel">微信：</span>
                          <div>
                            <p class="info-itemdes" v-for="(item,index) in wxhms" :key=index>
                              <span>{{item.wxhm}}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>

             <div class="rukou-item" index="1">
                <div class="rukou-title">
                  <span>房屋信息</span>
                </div>
                <div class="rukou-content">
                  <div class="rukou-content-left fl">
                    <div class="picture-hold">
                      <div class="pic-wrap">
                          <img src="/static/image/jiansuo/defaultfw.jpg">
                      </div>
                      <p class="label-btn">群租房</p>
                      <p class="label-btn">
                         <i class="fa 	fa fa-plus-circle fa-lg"  style="color:grey;"></i>
                         添加标签
                      </p>
                    </div>
                  </div>
                  <div class="rukou-content-right fr">
                    <div class="g-hold house-con border-full" style="margin-top:0px">
                      <p class="ic-con">
                      </p>
                      <div class="info-con">
                        <p class="info-item">
                          <span class="info-itemlabel">房屋地址：</span>
                          <span>二号楼一单元27楼2704</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">房屋面积：</span>
                          <span>95平米</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">房屋状态：</span>
                          <span>出租</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">产权人：</span>
                          <span>王洪明   何海燕</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">购买时间：</span>
                          <span>2014-9-24</span>
                        </p>
                      </div>
                    </div>
                    <div class="g-hold users-con border-full">
                      <p class="ic-con">
                      </p>
                      <div class="info-con">
                        <div class="info-item">
                          <span class="info-itemlabel">居住人数：</span>
                          <span>4人</span>
                        </div>
                        <div class="info-item" style="border-bottom:none">
                          <span class="info-itemlabel">常住人员：</span>
                          <div>
                            <p class="info-itemdes" v-for="(item,index) in czrys" :key=index>
                              <span>{{item.czry}} {{item.dh}}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>

             <!-- <div class="rukou-item">
                <div class="rukou-title">
                  <span>车辆信息</span>
                </div>
                <div class="rukou-content">
                  <div class="rukou-content-left fl">
                    <div class="picture-hold">
                      <div class="pic-wrap">
                          <img src="/static/image/jiansuo/default.png">
                      </div>
                      <p class="label-btn">新能源车</p>
                    </div>
                  </div>
                  <div class="rukou-content-right fr">
                    <div class="g-hold car-con border-full" style="margin-top:0px">
                      <p class="ic-con">
                      </p>
                      <div class="info-con">
                        <p class="info-item">
                          <span class="info-itemlabel">车牌：</span>
                          <span>川A88888</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">车牌颜色：</span>
                          <span>蓝色</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">车辆颜色：</span>
                          <span>白色</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">车型：</span>
                          <span>标致301</span>
                        </p>
                      </div>
                    </div>
                    <div class="g-hold carinfo-con border-full">
                      <p class="ic-con">
                      </p>
                      <div class="info-con">
                        <p class="info-item">
                          <span class="info-itemlabel">车主：</span>
                          <span>李莉</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">使用者：</span>
                          <span>李莉</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">车辆属性：</span>
                          <span>陌生车辆</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">车位：</span>
                          <span>二号楼负二楼125号</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">入库时间：</span>
                          <span>2016-10-17</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
            </div> -->

             <div class="rukou-item" index="2">
                <div class="rukou-title">
                  <span>轨迹信息</span>
                </div>
                <div class="rukou-content">
                  <div class="rukou-content-left_guiji fl" style="">
                        <!-- <div style="height: 300px;">
                          <el-steps direction="vertical" :active="1">
                            <el-step title="步骤 1"></el-step>
                            <el-step title="步骤 2"></el-step>
                            <el-step title="步骤 3" description="这是一段很长很长很长的描述性文字"></el-step>
                          </el-steps>
                        </div> -->
                        
                  </div>
                  <div id='guiji' class=" rukou-content-right_guiji fr" style="">
                      <!-- <div class="g-hold comment-con border-full">
                       
                      
                        <label style="
                            border: 1px solid #15d6d6;
                            border-radius: 5px;
                            height:12px;
                            width: 12px;
                            background-color:#15d6d6
                        "></label>
                        <span style="
                           border: 1px solid #15d6d6;
                             
                            margin-left: -7px;
                            margin-top: 11px;
                            margin-bottom: -9px;">
                        </span>
                        <div >
                          <img src='/static/image/jiansuo/guiji.png' style='width:50px ;margin-left: 20px;'/>
                        </div>
                        <div class="info-con" style='margin-left:60px'>
                          <p class="info-item">
                            <span class="info-itemlabel">出现位置：</span>
                            <span>2号楼东门监控</span>
                          </p>
                          <p class="info-item">
                            <span class="info-itemlabel">出现时间：</span>
                            <span>2018-10-15 12:25:47</span>
                          </p>
                          <p class="info-item">
                            <span class="info-itemlabel">进出情况：</span>
                            <span>进</span>
                          </p>
                         
                        </div>
                      </div>
                       -->

                        

                       

                      <div  class="g-hold comment-con border-full">
                        <label  style="border: 1px solid rgb(21, 214, 214); border-radius: 5px; height: 12px; width: 12px; background-color: rgb(21, 214, 214);"></label> 
                        <span  style="border: 1px solid rgb(21, 214, 214); margin-left: -7px; margin-top: 11px; margin-bottom: -9px;"></span> 
                        <div style="
                              border: 1px solid #d8dfe5;
                              margin-left: 20px;
                              width: 90%; ">
                              <div  style=" float: left; width: 80px; height: 100%; ">
                                  <img  src="/static/image/jiansuo/guiji.png" style="width: 70px;margin-top: 3px;padding-left: 3px;">
                              </div> 
                              <div class="info-con" style="width: cacl(100%-200px);margin-left: calc(100% - 280px);border: 0px;">
                                  <p  class="info-item"><span  class="info-itemlabel">出现位置：</span> <span >2号楼东门监控</span></p> 
                                  <p  class="info-item"><span  class="info-itemlabel">出现时间：</span> <span >2018-10-15 12:25:47</span></p> 
                                  <p class="info-item"><span  class="info-itemlabel">进出情况：</span> <span>进</span></p>
                              </div>
                        </div>
                      </div>

                       <div  class="g-hold comment-con border-full">
                        <label  style="border: 1px solid rgb(21, 214, 214); border-radius: 5px; height: 12px; width: 12px; "></label> 
                        <span  style="border: 1px solid rgb(21, 214, 214); margin-left: -7px; margin-top: 11px; margin-bottom: -9px;"></span> 
                        <div style="
                              border: 1px solid #d8dfe5;
                              margin-left: 20px;
                              width: 90%; ">
                              <div  style=" float: left; width: 80px; height: 100%; ">
                                  <img  src="/static/image/jiansuo/guiji.png" style="width: 70px;margin-top: 3px;padding-left: 3px;">
                              </div> 
                              <div class="info-con" style="width: cacl(100%-200px);margin-left: calc(100% - 280px);border: 0px;">
                                  <p  class="info-item"><span  class="info-itemlabel">出现位置：</span> <span >2号楼东门监控</span></p> 
                                  <p  class="info-item"><span  class="info-itemlabel">出现时间：</span> <span >2018-10-15 12:25:47</span></p> 
                                  <p class="info-item"><span  class="info-itemlabel">进出情况：</span> <span>进</span></p>
                              </div>
                        </div>
                      </div>


                       <div  class="g-hold comment-con border-full">
                        <label  style="border: 1px solid rgb(21, 214, 214); border-radius: 5px; height: 12px; width: 12px; "></label> 
                        <span  style="border: 1px solid rgb(21, 214, 214); margin-left: -7px; margin-top: 11px; margin-bottom: -9px;"></span> 
                        <div style="
                              border: 1px solid #d8dfe5;
                              margin-left: 20px;
                              width: 90%; ">
                              <div  style=" float: left; width: 80px; height: 100%; ">
                                  <img  src="/static/image/jiansuo/guiji.png" style="width: 70px;margin-top: 3px;padding-left: 3px;">
                              </div> 
                              <div class="info-con" style="width: cacl(100%-200px);margin-left: calc(100% - 280px);border: 0px;">
                                  <p  class="info-item"><span  class="info-itemlabel">出现位置：</span> <span >2号楼东门监控</span></p> 
                                  <p  class="info-item"><span  class="info-itemlabel">出现时间：</span> <span >2018-10-15 12:25:47</span></p> 
                                  <p class="info-item"><span  class="info-itemlabel">进出情况：</span> <span>进</span></p>
                              </div>
                        </div>
                      </div>


                       <div  class="g-hold comment-con border-full">
                        <label  style="border: 1px solid rgb(21, 214, 214); border-radius: 5px; height: 12px; width: 12px;"></label> 
                        <span  style="border: 1px solid rgb(21, 214, 214); margin-left: -7px; margin-top: 11px; margin-bottom: -9px;"></span> 
                        <div style="
                              border: 1px solid #d8dfe5;
                              margin-left: 20px;
                              width: 90%; ">
                              <div  style=" float: left; width: 80px; height: 100%; ">
                                  <img  src="/static/image/jiansuo/guiji.png" style="width: 70px;margin-top: 3px;padding-left: 3px;">
                              </div> 
                              <div class="info-con" style="width: cacl(100%-200px);margin-left: calc(100% - 280px);border: 0px;">
                                  <p  class="info-item"><span  class="info-itemlabel">出现位置：</span> <span >2号楼东门监控</span></p> 
                                  <p  class="info-item"><span  class="info-itemlabel">出现时间：</span> <span >2018-10-15 12:25:47</span></p> 
                                  <p class="info-item"><span  class="info-itemlabel">进出情况：</span> <span>进</span></p>
                              </div>
                        </div>
                      </div>


                       <div  class="g-hold comment-con border-full">
                        <label  style="border: 1px solid rgb(21, 214, 214); border-radius: 5px; height: 12px; width: 12px; "></label> 
                        <span  style="border: 1px solid rgb(21, 214, 214); margin-left: -7px; margin-top: 11px; margin-bottom: -9px;"></span> 
                        <div style="
                              border: 1px solid #d8dfe5;
                              margin-left: 20px;
                              width: 90%; ">
                              <div  style=" float: left; width: 80px; height: 100%; ">
                                  <img  src="/static/image/jiansuo/guiji.png" style="width: 70px;margin-top: 3px;padding-left: 3px;">
                              </div> 
                              <div class="info-con" style="width: cacl(100%-200px);margin-left: calc(100% - 280px);border: 0px;">
                                  <p  class="info-item"><span  class="info-itemlabel">出现位置：</span> <span >2号楼东门监控</span></p> 
                                  <p  class="info-item"><span  class="info-itemlabel">出现时间：</span> <span >2018-10-15 12:25:47</span></p> 
                                  <p class="info-item"><span  class="info-itemlabel">进出情况：</span> <span>进</span></p>
                              </div>
                        </div>
                      </div>

                       <div  class="g-hold comment-con border-full">
                        <label  style="border: 1px solid rgb(21, 214, 214); border-radius: 5px; height: 12px; width: 12px; "></label> 
                        <span  style="border: 1px solid rgb(21, 214, 214); margin-left: -7px; margin-top: 11px; margin-bottom: -9px;"></span> 
                        <div style="
                              border: 1px solid #d8dfe5;
                              margin-left: 20px;
                              width: 90%; ">
                              <div  style=" float: left; width: 80px; height: 100%; ">
                                  <img  src="/static/image/jiansuo/guiji.png" style="width: 70px;margin-top: 3px;padding-left: 3px;">
                              </div> 
                              <div class="info-con" style="width: cacl(100%-200px);margin-left: calc(100% - 280px);border: 0px;">
                                  <p  class="info-item"><span  class="info-itemlabel">出现位置：</span> <span >2号楼东门监控</span></p> 
                                  <p  class="info-item"><span  class="info-itemlabel">出现时间：</span> <span >2018-10-15 12:25:47</span></p> 
                                  <p class="info-item"><span  class="info-itemlabel">进出情况：</span> <span>进</span></p>
                              </div>
                        </div>
                      </div>
                      
                   
                  </div>
                </div>
            </div>


             <!-- <div class="rukou-item">
                <div class="rukou-title">
                  <span>个人信息</span>
                </div>
                <div class="rukou-content">
                  <div class="rukou-content-left fl">
                    <div class="picture-hold">
                      <div class="pic-wrap">
                          <img src="/static/image/jiansuo/defaultry.png">
                      </div>
                      <p class="label-btn">快递员</p>
                    </div>
                  </div>
                  <div class="rukou-content-right fr">
                    <div class="g-hold basic-con border-full" style="margin-top:0px">
                      <p class="ic-con">
                      </p>
                      <div class="info-con">
                        <p class="info-item">
                          <span class="info-itemlabel">姓名：</span>
                          <span>李莉</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">身份证号：</span>
                          <span>510210199502122545</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">户籍地：</span>
                          <span>南充</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">人员属性：</span>
                          <span>租户</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">入住时间：</span>
                          <span>2016-10-16</span>
                        </p>
                      </div>
                    </div>
                    <div class="g-hold phone-con border-full">
                      <p class="ic-con">
                      </p>
                      <div class="info-con">
                        <div class="info-item">
                          <span class="info-itemlabel">电话：</span>
                          <div>
                            <p class="info-itemdes" v-for="(item,index) in sjhms" :key=index>
                              <span>{{item.sjhm}}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="g-hold net-con border-full">
                      <p class="ic-con">
                      </p>
                      <div class="info-con">
                        <div class="info-item" style="border-bottom:none">
                          <span class="info-itemlabel">QQ：</span>
                          <div>
                            <p class="info-itemdes" v-for="(item,index) in qqhms" :key=index>
                              <span>{{item.qqhm}}</span>
                            </p>
                          </div>
                        </div>
                        <div class="info-item" style="border-bottom:none">
                          <span class="info-itemlabel">微信：</span>
                          <div>
                            <p class="info-itemdes" v-for="(item,index) in wxhms" :key=index>
                              <span>{{item.wxhm}}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div> -->

             <div class="rukou-item" index="3">
                <div class="rukou-title">
                  <span>其他信息</span>
                </div>
                <div class="rukou-content">
                  <div class="rukou-content-center">
                    <div class="g-hold weixiu-con border-full" style="margin-top:0px">
                      <p class="ic-con">
                      </p>
                      <div class="info-con">
                        <p class="info-item">
                          <span class="info-itemlabel">报修类别：</span>
                          <span>灯具线路</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">报修时间：</span>
                          <span>2018-10-15    12:25:47</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">报修地址：</span>
                          <span>2号楼2704</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">报修人：</span>
                          <span>李莉</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">处理情况：</span>
                          <span>已处理</span>
                        </p>
                      </div>
                    </div>
                    <div class="g-hold comment-con border-full">
                      <p class="ic-con">
                      </p>
                      <div class="info-con">
                        <p class="info-item">
                          <span class="info-itemlabel">投诉类别：</span>
                          <span>服务投诉</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">投诉时间：</span>
                          <span>2018-10-15 12:25:47</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">投诉地址：</span>
                          <span>2号楼2704</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">投诉人：</span>
                          <span>李莉</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">处理情况：</span>
                          <span>已处理</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
            </div> 

             <div class="rukou-item" index="4">
                <div class="rukou-title">
                  <span>其他信息</span>
                </div>
                <div class="rukou-content">
                  <div class="rukou-content-center">
                    <div class="g-hold weixiu-con border-full" style="margin-top:0px">
                      <p class="ic-con">
                      </p>
                      <div class="info-con">
                        <p class="info-item">
                          <span class="info-itemlabel">报修类别：</span>
                          <span>灯具线路</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">报修时间：</span>
                          <span>2018-10-15    12:25:47</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">报修地址：</span>
                          <span>2号楼2704</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">报修人：</span>
                          <span>李莉</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">处理情况：</span>
                          <span>已处理</span>
                        </p>
                      </div>
                    </div>
                    <div class="g-hold comment-con border-full">
                      <p class="ic-con">
                      </p>
                      <div class="info-con">
                        <p class="info-item">
                          <span class="info-itemlabel">投诉类别：</span>
                          <span>服务投诉</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">投诉时间：</span>
                          <span>2018-10-15 12:25:47</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">投诉地址：</span>
                          <span>2号楼2704</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">投诉人：</span>
                          <span>李莉</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">处理情况：</span>
                          <span>已处理</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
            </div>  
            
             <label id="id-tab-right" class='tab-right'><i class="fa 	fa fa-angle-right fa-lg" style=""></i></label>

          </div>

          <div class="result-item">

            <div class="rukou-item">
                <div class="rukou-title">
                  <span>个人信息</span>
                </div>
                <div class="rukou-content">
                  <div class="rukou-content-left fl">
                    <div class="picture-hold">
                      <div class="pic-wrap">
                          <img src="/static/image/home/service-pic1.png">
                      </div>
                      <p class="label-btn">会计</p>
                      <p class="label-btn">
                         <i class="fa 	fa fa-plus-circle fa-lg"  style="color:grey;"></i>
                         添加标签
                      </p>
                    </div>
                  </div>
                  <div class="rukou-content-right fr">
                    <div class="g-hold basic-con border-full" style="margin-top:0px">
                      <p class="ic-con">
                      </p>
                      <div class="info-con">
                        <p class="info-item">
                          <span class="info-itemlabel">姓名：</span>
                          <span>张璇</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">身份证号：</span>
                          <span>510210199502122545</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">户籍地：</span>
                          <span>南充</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">人员属性：</span>
                          <span>租户</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">入住时间：</span>
                          <span>2016-10-16</span>
                        </p>
                      </div>
                    </div>
                    <div class="g-hold phone-con border-full">
                      <p class="ic-con">
                      </p>
                      <div class="info-con">
                        <div class="info-item">
                          <span class="info-itemlabel">电话：</span>
                          <div>
                            <p class="info-itemdes" v-for="(item,index) in sjhms2" :key=index>
                              <span>{{item.sjhm}}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="g-hold net-con border-full">
                      <p class="ic-con">
                      </p>
                      <div class="info-con">
                        <div class="info-item" style="border-bottom:none">
                          <span class="info-itemlabel">QQ：</span>
                          <div>
                            <p class="info-itemdes" v-for="(item,index) in qqhms" :key=index>
                              <span>{{item.qqhm}}</span>
                            </p>
                          </div>
                        </div>
                        <div class="info-item" style="border-bottom:none">
                          <span class="info-itemlabel">微信：</span>
                          <div>
                            <p class="info-itemdes" v-for="(item,index) in wxhms" :key=index>
                              <span>{{item.wxhm}}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>

             <div class="rukou-item">
                <div class="rukou-title">
                  <span>房屋信息</span>
                </div>
                <div class="rukou-content">
                  <div class="rukou-content-left fl">
                    <div class="picture-hold">
                      <div class="pic-wrap">
                          <img src="/static/image/jiansuo/defaultfw.jpg">
                      </div>
                      <p class="label-btn">群租房</p>
                      <p class="label-btn">
                         <i class="fa 	fa fa-plus-circle fa-lg"  style="color:grey;"></i>
                         添加标签
                      </p>
                    </div>
                  </div>
                  <div class="rukou-content-right fr">
                    <div class="g-hold house-con border-full" style="margin-top:0px">
                      <p class="ic-con">
                      </p>
                      <div class="info-con">
                        <p class="info-item">
                          <span class="info-itemlabel">房屋地址：</span>
                          <span>二号楼一单元27楼2704</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">房屋面积：</span>
                          <span>95平米</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">房屋状态：</span>
                          <span>出租</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">产权人：</span>
                          <span>王洪明   何海燕</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">购买时间：</span>
                          <span>2014-9-24</span>
                        </p>
                      </div>
                    </div>
                    <div class="g-hold users-con border-full">
                      <p class="ic-con">
                      </p>
                      <div class="info-con">
                        <div class="info-item">
                          <span class="info-itemlabel">居住人数：</span>
                          <span>4人</span>
                        </div>
                        <div class="info-item" style="border-bottom:none">
                          <span class="info-itemlabel">常住人员：</span>
                          <div>
                            <p class="info-itemdes" v-for="(item,index) in czrys" :key=index>
                              <span>{{item.czry}} {{item.dh}}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>

             <div class="rukou-item">
                <div class="rukou-title">
                  <span>车辆信息</span>
                </div>
                <div class="rukou-content">
                  <div class="rukou-content-left fl">
                    <div class="picture-hold">
                      <div class="pic-wrap">
                          <img src="/static/image/jiansuo/default.png">
                      </div>
                      <p class="label-btn">新能源车</p>
                      <p class="label-btn">
                         <i class="fa 	fa fa-plus-circle fa-lg"  style="color:grey;"></i>
                         添加标签
                      </p>
                    </div>
                  </div>
                  <div class="rukou-content-right fr">
                    <div class="g-hold car-con border-full" style="margin-top:0px">
                      <p class="ic-con">
                      </p>
                      <div class="info-con">
                        <p class="info-item">
                          <span class="info-itemlabel">车牌：</span>
                          <span>川A88888</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">车牌颜色：</span>
                          <span>蓝色</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">车辆颜色：</span>
                          <span>白色</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">车型：</span>
                          <span>标致301</span>
                        </p>
                      </div>
                    </div>
                    <div class="g-hold carinfo-con border-full">
                      <p class="ic-con">
                      </p>
                      <div class="info-con">
                        <p class="info-item">
                          <span class="info-itemlabel">车主：</span>
                          <span>李莉</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">使用者：</span>
                          <span>李莉</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">车辆属性：</span>
                          <span>陌生车辆</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">车位：</span>
                          <span>二号楼负二楼125号</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">入库时间：</span>
                          <span>2016-10-17</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
            </div>

             <div class="rukou-item">
                <div class="rukou-title">
                  <span>其他信息</span>
                </div>
                <div class="rukou-content">
                  <div class="rukou-content-center">
                    <div class="g-hold weixiu-con border-full" style="margin-top:0px">
                      <p class="ic-con">
                      </p>
                      <div class="info-con">
                        <p class="info-item">
                          <span class="info-itemlabel">报修类别：</span>
                          <span>灯具线路</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">报修时间：</span>
                          <span>2018-10-15    12:25:47</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">报修地址：</span>
                          <span>2号楼2704</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">报修人：</span>
                          <span>李莉</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">处理情况：</span>
                          <span>已处理</span>
                        </p>
                      </div>
                    </div>
                    <div class="g-hold comment-con border-full">
                      <p class="ic-con">
                      </p>
                      <div class="info-con">
                        <p class="info-item">
                          <span class="info-itemlabel">投诉类别：</span>
                          <span>服务投诉</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">投诉时间：</span>
                          <span>2018-10-15 12:25:47</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">投诉地址：</span>
                          <span>2号楼2704</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">投诉人：</span>
                          <span>李莉</span>
                        </p>
                        <p class="info-item">
                          <span class="info-itemlabel">处理情况：</span>
                          <span>已处理</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
            </div>    
          </div>  

          <el-pagination background @current-change="doSearch" :page-size="2" :current-page.sync="currentPage" layout="total, prev, pager, next" :total="srctotal">
          </el-pagination>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { excontrolApi } from "@/https";

export default {
  name: "jiansuochaxun",
  data() {
    return {
      searchStr: "",
      searchType: "",
      srctotal: 2,
      currentPage: 1,
      isGaojijiansuo: false,
      ruleForm: {
        xm: "",
        sfz: "",
        dh: "",
        rysx: "",
        cp: "",
        cpys: "",
        clsx: "",
        clbq: "",
        fwdz: "",
        fwsx: "",
        fwbq: "",
        rybq: ""
      },
      imageMan: {
        url: ""
      },
      imageChe: {
        url: ""
      },
      cpys: this.getCpysList(),
      fwsxs: [
        {
          label: "自住",
          value: "3"
        },
        {
          label: "租借",
          value: "2"
        }
      ],
      clsxs: [
        {
          label: "业主车辆",
          value: "3"
        },
        {
          label: "外来车辆",
          value: "2"
        }
      ],
      fwbqs: [
        {
          label: "群租房",
          value: "3"
        },
        {
          label: "独栋别墅",
          value: "2"
        }
      ],
      rysxs: [
        {
          label: "业主",
          value: "3"
        },
        {
          label: "租户",
          value: "2"
        }
      ],
      clbqs: [
        {
          label: "新能源车",
          value: "3"
        },
        {
          label: "警车",
          value: "2"
        }
      ],
      rybqs: [
        {
          label: "快递员",
          value: "3"
        },
        {
          label: "保洁员",
          value: "2"
        }
      ],
      sjhms: [
        {
          sjhm: "13523432222"
        },
        {
          sjhm: "13523432222"
        },
        {
          sjhm: "13523432222"
        },
        {
          sjhm: "13523432222"
        }
      ],
      sjhms2: [
        {
          sjhm: "13523432222"
        },
        {
          sjhm: "13523432222"
        }
      ],
      qqhms: [
        {
          qqhm: "3523432222"
        },
        {
          qqhm: "3523432222"
        }
      ],
      wxhms: [
        {
          wxhm: "133523432222"
        },
        {
          wxhm: "3523432222"
        }
      ],
      czrys: [
        {
          czry: "张三",
          dh: "13352343222"
        },
        {
          czry: "李四",
          dh: "13852343222"
        },
        {
          czry: "王伟",
          dh: "13552343222"
        }
      ],
      rule: {}
    };
  },
  created() {},
  mounted() {
    document.getElementById("guiji").addEventListener("scroll", function() {
      // console.log(this.scrollTop);
      var arr = document.getElementById("guiji").querySelectorAll(".g-hold");
      var divheight = arr[0].clientHeight;
      var curindex = Math.ceil(this.scrollTop / divheight) + 1;
      arr.forEach((val, index) => {
        if (index <= curindex) {
          //  val.querySelectorAll("label")[0].setAttribute('background-color','red');
          val.querySelectorAll("label")[0].style.backgroundColor = "#15d6d6";
        } else {
          val.querySelectorAll("label")[0].style.backgroundColor = "";
        }
      });

      //  tab-right
      // tab-info
    });

    console.log(121);
    console.log(232);

    var domtab = document.querySelectorAll(".tab-info> .rukou-item");
    console.log(domtab.length);
    if (domtab.length > 4) {
      domtab.forEach((val, index) => {
        if (index >= 4) {
          val.style.display = "none";
        }
      });
      document.querySelectorAll(".tab-right")[0].style.display = "inline-block";
    }

    document
      .getElementById("id-tab-left")
      .addEventListener("click", function() {
        // alert(1);
        var domtab = document.querySelectorAll(".tab-info> .rukou-item");
        console.log(domtab.length);
        var maxindex;
        if (domtab.length > 4) {
       
          domtab.forEach((val, index) => {
            if ((val.style.display = "inline-block")) {
              maxindex = index;
            }
          });
          if (maxindex - 1 >=3) {
            domtab.forEach((val, index) => {
              if (index > maxindex - 1 - 4 && index < maxindex) {
                val.style.display = "inline-block";
              } else {
                val.style.display = "none";
              }
            });
            document.querySelectorAll(".tab-right")[0].style.display =
              "inline-block";
          }
          if (maxindex == 4) {
            document.querySelectorAll(".tab-left")[0].style.display = "none";
          }
        }
      });

    document
      .getElementById("id-tab-right")
      .addEventListener("click", function() {
        // alert(2);
        var domtab = document.querySelectorAll(".tab-info> .rukou-item");
        console.log(domtab.length);
        var maxindex;
        if (domtab.length > 4) {
          // domtab.querySelectorAll("")
          domtab.forEach((val, index) => {
            // if (index >= 4) {
            //   val.style.display = "none";
            // }
            if ((val.style.display = "inline-block")) {
              maxindex = index;
            }
          });
          if (maxindex + 1 <= domtab.length) {
            domtab.forEach((val, index) => {
              if (index > maxindex + 1 - 5 && index < maxindex + 1 + 1) {
                val.style.display = "inline-block";
              } else {
                val.style.display = "none";
              }
            });
            document.querySelectorAll(".tab-left")[0].style.display =
              "inline-block";
          }
          if (maxindex + 1 == domtab.length) {
            document.querySelectorAll(".tab-right")[0].style.display = "none";
          }
        }
      });
  },
  methods: {
    //查询检索
    doSearch: function(ctrcurrentPage) {
      let param = {};
      param.pageNum = ctrcurrentPage;
      param.pageSize = 10;

      param.idNumber = this.IDNo;
      param.name = this.name;

      // return excontrolApi
      //   .archiveSearch(param)
      //   .then(res => res.data)
      //   .then(data => {

      //   });
    },
    toggleGaoji() {
      this.isGaojijiansuo = true;
    },
    toggleNormal() {
      this.isGaojijiansuo = false;
    },
    readManImage: function(file) {
      this.imageMan = file;
      this.imageMan.url = URL.createObjectURL(file.raw);
    },
    readCheImage: function(file) {
      this.imageChe = file;
      this.imageChe.url = URL.createObjectURL(file.raw);
    },
    clearImgMan() {
      this.imageMan = {};
      return false;
    },
    clearImgChe() {
      this.imageChe = {};
      return false;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped>
.content-body {
  width: 100%;
  height: calc(100% - 20px);
  overflow: auto;
}
.content-row {
  min-width: 1680px;
  width: 100%;
  height: calc(100% - 50px);
  overflow: auto;
}
.bl-content {
  width: calc(100% - 10px);
  min-height: calc(100vh - 140px);
  width: 100%;
  box-sizing: border-box;
  background: #fff;
  border: 1px solid #d9dfe5;
  position: relative;
}
.input-with-select {
  width: 530px;
}
/* 按钮样式 */
.btn-info {
  background-color: #13b1e1;
  border: none;
  margin: 0 40px;
}
.btn-info:hover {
  border: none;
  outline: none;
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
a {
  color: #13b1e1;
  text-decoration: underline;
}
a:hover,
a:focus {
  color: #23527c;
}
.gaojijiansuo {
  position: relative;
  margin: 20px;
  text-align: left;
}
.pic-group {
  display: flex;
  position: absolute;
  top: 0;
  right: 20px;
}
.picture-hold {
  display: inline-block;
  width: 110px;
  height: 246px;
  margin: 0px 10px;
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
.label-btn {
  width: 104px;
  height: 28px;
  line-height: 24px;
  margin-top: 10px;
  text-align: center;
  color: #555759;
  border: 1px solid #d8dfe5;
  background: #f2f2f2;
  text-align: center;
  position: relative;
  display: block;
}
.label-btn:before {
  position: absolute;
  content: "";
  display: block;
  width: 12px;
  height: 12px;
  border: 6px solid #ff6633;
  border-right: 6px solid transparent;
  border-bottom: 6px solid transparent;
  top: 0;
  left: 0;
}
.add-label{
  margin-left: 13px;
  margin-top: 20px;
  cursor: pointer;
}
.pic-wrap {
  position: relative;
  margin-top: 10px;
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
  font-size: 18px;
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
  left: 0;
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
.cx-icon {
  background-image: url("/static/image/jiansuo/cx-icon.png");
  background-repeat: no-repeat;
  background-position: center;
}
.result-group {
  margin-bottom: 50px;
}
.result-item {
  width: calc(100% - 40px);
  height: 316px;
  margin: 0 15px 20px;
  padding: 0 14px;
  border: 1px solid #d9dfe5;
  border-left: 4px solid #12b1e1;
  white-space: nowrap;
  overflow: hidden;
}
.rukou-item {
  width: calc(25% - 23px);
  margin: 20px 10px;
  height: 276px;
  border: 1px solid #d9dfe5;
  display: inline-block;
}
.rukou-title {
  width: 100%;
  height: 30px;
  line-height: 30px;
  font-size: 12px;
  text-align: center;
  background: #f2f2f2;
  border-bottom: 1px solid #d9dfe5;
  color: #333;
}
.rukou-content {
  width: 100%;
  height: calc(100% - 30px);
}
.rukou-content-left {
  width: 124px;
}
.rukou-content-right {
  width: calc(100% - 134px);
  height: calc(100% - 20px);
  margin: 10px 5px 10px 0;
  overflow-y: auto;
  padding-right: 5px;
}
.rukou-content-left_guiji {
  width: 15px;
}
.rukou-content-right_guiji {
  width: calc(100% - 18px);
  height: calc(100% - 20px);
  margin: 10px 5px 10px 0;
  overflow-y: auto;
  padding-right: 5px;
}

.rukou-content-center {
  float: left;
  width: calc(100% - 15px);
  height: calc(100% - 20px);
  margin: 10px;
  overflow-y: auto;
  margin-right: 5px;
  padding-right: 5px;
}
p {
  margin: 0;
}
.g-hold {
  position: relative;
  display: flex;
  margin-top: 8px;
}
.info-con {
  display: flex;
  flex-direction: column;
  flex: 1;
  border: 1px solid #d8dfe5;
  border-left: none;
  font-size: 12px;
  line-height: 20px;
  padding: 7px 0;
}
.net-con .info-con {
  display: block;
  height: auto;
}
.info-item {
  display: flex;
  color: #555759;
  background: none;
  padding-left: 7px;
  font-size: 12px;
  line-height: 20px;
}
.info-item div {
  display: block;
  width: 100%;
  height: auto;
}
.info-itemlabel {
  color: #555759;
  /* margin-right: 10px; */
}
.info-itemdes {
  float: left;
  padding-right: 10px;
  line-height: 20px;
}
.ic-con {
  display: flex;
  justify-content: center;
  align-items: center;
}
.basic-con .ic-con {
  width: 24px;
  text-align: center;
  font-family: fontawesome;
  font-size: 18px;
  color: #fff;
  background: #ff6666;
}
.basic-con .ic-con:after {
  content: "\f007";
}
.phone-con {
  line-height: 30px;
}
.phone-con .info-item {
  border-bottom: none;
}
.phone-con .ic-con {
  width: 24px;
  line-height: 30px;
  text-align: center;
  font-family: fontawesome;
  font-size: 26px;
  color: #fff;
  background: #00cc99;
}
.phone-con .ic-con:after {
  content: "\f10b";
}
.net-con {
  line-height: 30px;
}
.net-con .ic-con {
  width: 24px;
  text-align: center;
  font-family: fontawesome;
  font-size: 16px;
  color: #fff;
  background: #9999ff;
}
.net-con .ic-con:after {
  content: "\f0ac";
}
.house-con .ic-con {
  width: 24px;
  text-align: center;
  font-family: fontawesome;
  font-size: 16px;
  color: #fff;
  background: #00cc99;
}
.house-con .ic-con:after {
  content: "\f015";
}
.users-con .ic-con {
  width: 24px;
  text-align: center;
  font-family: fontawesome;
  font-size: 14px;
  color: #fff;
  background: #9999ff;
}
.users-con .ic-con:after {
  content: "\f0c0";
}
.car-con .ic-con {
  width: 24px;
  text-align: center;
  font-family: fontawesome;
  font-size: 14px;
  color: #fff;
  background: #ff9933;
}
.car-con .ic-con:after {
  content: "\f1b9";
}
.carinfo-con .ic-con {
  width: 24px;
  text-align: center;
  font-family: fontawesome;
  font-size: 14px;
  color: #fff;
  background: #12b1e1;
}
.carinfo-con .ic-con:after {
  content: "\f03a";
}
.weixiu-con .info-item,
.comment-con .info-item {
  line-height: 18px;
}
.weixiu-con .ic-con {
  width: 24px;
  text-align: center;
  font-family: fontawesome;
  font-size: 16px;
  color: #fff;
  background: #ff6666;
}
.weixiu-con .ic-con:after {
  content: "\f0ad";
}
.comment-con .ic-con {
  width: 24px;
  text-align: center;
  font-family: fontawesome;
  font-size: 14px;
  color: #fff;
  background: #ff9933;
}
.comment-con .ic-con:after {
  content: "\f27b";
}
.tab-left {
  margin-top: 140px;
  position: absolute;
  cursor: pointer;
  display: none;
}
.tab-right {
  margin-top: 140px;
  position: absolute;
  cursor: pointer;
  display: none;
}
</style>