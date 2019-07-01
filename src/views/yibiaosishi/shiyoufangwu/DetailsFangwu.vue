<template>
  <!-- <div id="contentbody" class="content-body"> -->
    <!-- <div class="page-bread">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/yibiaosishi/shiyoufangwu'}">实有房屋</el-breadcrumb-item>
        <el-breadcrumb-item>查看详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div> -->
    <div class="content-row">
      <div class="content-center">
        <div id="fwjiben">
          <div class="content-title">
            <span>基本信息</span>
          </div>
          <div style="margin:20px 10px;">
                <p class="info-item">                   
                    <!-- <span class="info-col">  
                    <span class="info-itemlabel">小区名称：</span>
                    <span>{{xqform.communityName}}</span>
                    </span> -->
                    <span class="info-col">  
                        <span class="info-itemlabel">房屋属性：</span>
                        <span>{{xqform.certificateType}}</span>
                    </span>
                    <span class="info-col">  
                      <span class="info-itemlabel">房屋用途：</span>
                      <span>{{xqform.useage}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">房屋状态：</span>
                    <span>{{xqform.state}}</span>
                    </span>
                    <!-- <span class="info-col">  
                    <span class="info-itemlabel">楼栋名称：</span>
                    <span>{{xqform.buildingName}}</span>
                    </span> -->
                </p>
                <!-- <p class="info-item">
                    <span class="info-col">  
                    <span class="info-itemlabel">单元号：</span>
                    <span>{{xqform.unitName}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">楼层：</span>
                    <span>{{xqform.floor}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">门牌号：</span>
                    <span>{{xqform.houseNumber}}</span>
                    </span>
                </p> -->
                
                <!-- <p class="info-item"> -->
                    
                    
                    <!-- <span class="info-col">  
                    <span class="info-itemlabel">户型：</span>
                    <span>{{xqform.apartment}}</span>
                    </span> -->
                <!-- </p> -->
                <p class="info-item">
                  <span class="info-col">  
                    <span class="info-itemlabel">房屋面积：</span>
                    <span>{{xqform.dimensions}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">产权证类型：</span>
                    <span>{{xqform.certificateType}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">产权证编号：</span>
                    <span>{{xqform.certificateCode}}</span>
                    </span>
                    
                </p>
                <p class="info-item">
                  <span class="info-col">  
                    <span class="info-itemlabel">使用类型：</span>
                    <span>{{xqform.houseType}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">户型：</span>
                    <span>{{xqform.apartment}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">是否贫困户：</span>
                    <span>{{xqform.poor}}</span>
                    </span>
                    
                </p>
                <p class="info-item">
                  <span class="info-col">  
                    <span class="info-itemlabel">物业单位：</span>
                    <span>{{xqform.propertyCompany}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">物业联系人：</span>
                    <span>{{xqform.propertyContacts}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">物业电话：</span>
                    <span>{{xqform.propertyPhone}}</span>
                    </span>
                    
                </p>
                <p class="info-item">
                  <span class="info-col">  
                    <span class="info-itemlabel">户主姓名：</span>
                    <span>{{xqform.hostName}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">户主身份证：</span>
                    <span>{{xqform.hostIdNumber}}</span>
                    </span>
                    <span class="info-col">  
                    <span class="info-itemlabel">户主电话：</span>
                    <span>{{xqform.hostPhone}}</span>
                    </span>
                    <!-- <span class="info-col">  
                    <span class="info-itemlabel">是否贫困户：</span>
                    <span>{{xqform.poor}}</span>
                    </span> -->
                </p>
                <p class="info-item">
                    <span class="info-col" style="width:203%;">  
                      <span class="info-itemlabel">详细地址：</span>
                      <span>{{xqform.address}}</span>
                      <span v-if="xqform.communityName">(小区名称：{{xqform.communityName}})</span>
                    </span>
                    <!-- <span class="info-col">  
                    <span class="info-itemlabel">房屋用途：</span>
                    <span>{{xqform.useage}}</span>
                    </span> -->
                </p>
                <p class="info-item">
                    <span class="info-itemlabel">备注：</span>
                    <span>{{xqform.remarks}}</span>
                </p>    
          </div>
        </div>
        <div id="fwpic">
          <div class="content-title">
            <span @click="showTabsRelation" :class="{isActive: isShowRelationCharts}" style="cursor:pointer;">房屋关系图</span>
            /
            <span @click="showTabsPic" :class="{isActive: !isShowRelationCharts}" style="cursor:pointer;">房屋图片</span>
          </div>
          <div style="margin:15px;display:flex;width:100%;height:100%;">
            <div class="anjian-content" v-show="!isShowRelationCharts"> 
                <div class="anjian-item"  v-for="(item, index) in anjianData" :key="item.id">
                    <p class="anjian-img" @mouseover="showOperation(index)" @mouseleave="showOperation(-1)">
                      <img :src="BASE_IMG_URL+item" onerror="javascript:this.src='/static/image/anjian/default.png'" />
                      <span class="img-operation" v-if="activeIndex == index">
                        <span class="fa fa-search-plus" @click="showBiggerPic(item)"></span>
                        <span class="fa fa-floppy-o" @click="savePic(BASE_IMG_URL+item)"></span>
                        <!-- <span class="fa fa-trash-o" @click="delPic(item)"></span> -->
                      </span>
                    </p>
                    <p style="text-align: center;margin-top: 10px;font-size:12px;">房屋{{index+1}}</p>
                </div>
            </div>
            <div class="anjian-content" v-show="isShowRelationCharts" id="house-relation-chart" style="width:100%;height:calc(100% - 60px);"> 
            </div>
          </div>
        </div>  

        <div id="fwinfo" style="clear:both;">
          <div class="content-title">
            <span>房屋人口信息</span>
          </div>    
          <div id="bukongsearchdiv" style="margin-top:10px;" >         
              <div class="model-hold">
                <el-table :data="srcTableData">
                  <el-table-column  type="selection" width="55">
                  </el-table-column>
                  <el-table-column prop=name label="姓名" min-width="80">
                  </el-table-column>
                  <el-table-column prop="relation" label="与户主关系" min-width="100" >
                  </el-table-column>
                  <el-table-column prop="idNumber" label="身份证" min-width="200" >
                  </el-table-column>
                  <el-table-column prop="gender" label="性别" min-width="60" >
                  </el-table-column>
                  <el-table-column prop="birthdate" label="出生日期" min-width="200">
                  </el-table-column>
                  <el-table-column prop="nation" label="民族" min-width="80">
                  </el-table-column>
                  <el-table-column prop="nativeInfo" label="籍贯" min-width="80" >
                  </el-table-column>
                  <el-table-column prop="marriage" label="婚姻状况" min-width="80" >
                  </el-table-column>
                  <el-table-column prop="political" label="政治面貌" min-width="80" >
                  </el-table-column>
                  <el-table-column prop="education" label="文化程度" min-width="80" >
                  </el-table-column>
                  <el-table-column prop="phone" label="手机号码" min-width="180" >
                  </el-table-column>
                  <el-table-column prop="personType" label="人口类型" min-width="80">
                  </el-table-column>
                  <el-table-column prop="specialPerson" label="特殊人群" min-width="80" >
                  </el-table-column>
                  <el-table-column prop="preferential" label="优抚对象" min-width="80">
                  </el-table-column>
                  <el-table-column prop="plateNumber" label="车辆信息" min-width="80" >
                  </el-table-column>
                  <!-- <el-table-column prop="dispositionStatus" label="计生对象" min-width="80">
                  </el-table-column> -->
                  <el-table-column prop="registeredType" label="户口类型" min-width="80" >
                  </el-table-column>
                  <el-table-column prop="endowmentInsurance" label="养老保险" min-width="80">
                  </el-table-column>
                  <el-table-column label="操作" min-width="300" fixed='right'>
                    <template slot-scope="scope">
                      <el-button type="text" size="small" class="operate-btn" @click="lookbkdetail(scope.row)">
                        <i class="fa fa-file-text-o"></i> 查看详情</el-button>                                   
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <el-pagination background @current-change="getpersonInHouse" :page-size="10" :current-page.sync="currentPage" layout="total, prev, pager, next, jumper" :total="srcrestotal">
              </el-pagination>
            </div>
        </div>

        <!-- <div slot="footer" class="dialog-footer" style="text-align:center;padding:30px;">
            <el-button type="primary" @click="dialogFormVisible = false" size='medium' style="width:120px;margin-right:50px;">修改</el-button>
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
  <!-- </div> -->
</template>

<script>
import { excontrolApi } from "@/https";
import Ec from 'echarts';
import CssQueries from 'css-element-queries'

let barscase, cssQueryCase;

export default {
  name: "detailsFw",
  // props: ['cxID'],
  //  props:{cxID:''},
  data() {
    return {
    anjianData:[
        {
            title: '户型图',
            src:'',
            id:'',
        },       
      ],
      srcTableData:[],
      xqform:
      {
        certificateCode:"",                //类型：String  必有字段  备注：无
        communityName:"",                //类型：String  必有字段  备注：无
        imageUrls:"",                //类型：String  必有字段  备注：无
        houseNumber:"",                //类型：String  必有字段  备注：无
        type:"",                //类型：String  必有字段  备注：无
        propertyContacts:"",                //类型：String  必有字段  备注：无
        street:"",                //类型：String  必有字段  备注：无
        poor:'',                //类型：Boolean  必有字段  备注：无
        id:'',                //类型：Number  必有字段  备注：无
        houseType:"",                //类型：String  必有字段  备注：无
        state:"",                //类型：String  必有字段  备注：无
        propertyCompany:"",                //类型：String  必有字段  备注：无
        floor:'',                //类型：Number  必有字段  备注：无
        buildingName:"",                //类型：String  必有字段  备注：无
        villageId:'',                //类型：Number  必有字段  备注：无
        address:"",                //类型：String  必有字段  备注：无
        hostPhone:"",                //类型：String  必有字段  备注：无
        gridName:"",                //类型：String  必有字段  备注：无
        unitName:"",                //类型：String  必有字段  备注：无
        certificateType:"",                //类型：String  必有字段  备注：无
        hostName:"",                //类型：String  必有字段  备注：无
        apartment:"",                //类型：String  必有字段  备注：无
        hostIdNumber:"",                //类型：String  必有字段  备注：无
        dimensions:'',                //类型：Number  必有字段  备注：无
        propertyPhone:""                //类型：String  必有字段  备注：无      

      },
      cxID:'',
      activeIndex: '-1',
      imgVisibility: false,
      biggerImageUrl: '',
      currentPage: 0,
      srcrestotal: 0,
      isShowRelationCharts: true,

    }
  },
  created() {
  //  let type = this.$route.query.type;

    //  this.cxID = this.$route.query.cxID;
    //  this.initDetals();

  },
  mounted() {
    // this.initDetals();
  },
//   watch: {
//     cxID(val) {
//       this.initDetals();
//     },
// },
  methods: {
    initDetals(id) {
      this.cxID = id;
       this.getfwDetail();
       this.getpersonInHouse(1);
       this.showTabsRelation(); 
    },
    backToShiyourenkou(){
       this.$router.push({path:'/yibiaosishi/shiyoufangwu'});
     },
     lookbkdetail(data) {
      // console.log(data)
      this.$router.push({path:'/yibiaosishi/renyuanxiangqing',query: {id_number: data.idNumber}});
    },
    getpersonInHouse(currentPage){
      let param = {};
      let _this = this;
      param.pageNum = currentPage;
      param.pageSize = 10;
      param.housingId = _this.cxID;

      return excontrolApi
        .fangwuDetailsPersonInHouseSearch(param)
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
    getfwDetail(){
      let param = {};
      let _this = this;
      param.pageNum = 1;
      param.pageSize = 1;
      param.housingId = _this.cxID;
      
      
      return excontrolApi
        .shiyoufangwuSearch(param)
        .then(res => res.data)
        .then(data => {
          // loading.close();
       //   this.srcrestotal = data.total;
          //生成表格
          _this.xqform = data.rows[0];
          if(_this.xqform.poor == false)
          {
              _this.xqform.poor = "否";
          }
          else if(_this.xqform.poor == true)
          {
              _this.xqform.poor = "是";
          }

          _this.anjianData = _this.xqform.imageUrls && _this.xqform.imageUrls.split(",");
          _this.xqform.address += _this.xqform.roomAddress;

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

    },
    showTabsRelation() {
      this.isShowRelationCharts = true;
      let param = {};
      param.housingId = this.cxID;
      
      return excontrolApi
        .shiyoufangwuRelationSearch(param)
        .then(res => res.data)
        .then(data => {
          this.initChart(data);
          this.setChartResize();
        });
    },
    showTabsPic() {
      this.isShowRelationCharts = false;
    },
    unique(arr){
      var res = [];
      var hash = {};
      for (var i = 0; i < arr.length; i++) {
        if(!hash[arr[i].name]){
          hash[arr[i].name] = arr[i];
          res.push(arr[i]);
        }
      }

      return res;
    },
    initChart(data) {
      let chartDiv = document.getElementById("house-relation-chart");
      let h = chartDiv.offsetHeight; //高度
      let w = chartDiv.offsetWidth; //宽度

      let graph = Object.assign({},data);
      graph.nodes = this.unique(graph.nodes);

      let categories = [0,1,2,3,4,5,6,7];
      for (let i = 0; i < graph.nodes.length; i++) {
        // categories[i] = {
        //     name: graph.nodes[i].category
        // };
        if (graph.nodes[i].category == 0) {
          graph.nodes[i].symbol = "image:///static/image/yibiaosishi/ic_hz.png";
        }
        if (graph.nodes[i].category == 1||graph.nodes[i].category == 3) {
          graph.nodes[i].symbol = "image:///static/image/yibiaosishi/ic_zh.png";
        }
        if (graph.nodes[i].category == 2) {
          graph.nodes[i].symbol = "image:///static/image/yibiaosishi/ic_cl.png";
        }
        if (graph.nodes[i].category == 7) {
          graph.nodes[i].symbol = "image:///static/image/yibiaosishi/ic_fjdcc.png";
        }
        if (graph.nodes[i].category == 4) {
          graph.nodes[i].symbol = "image:///static/image/yibiaosishi/ic_fw.png";
        }
        if (graph.nodes[i].category == 5||graph.nodes[i].category == 6) {
          graph.nodes[i].symbol = "image:///static/image/yibiaosishi/ic_qtfw.png";
        }
      }

      graph.nodes.forEach(function (node) {
          node.itemStyle = null;
          node.symbolSize = 32;
          // Use random x, y
          node.x = node.y = null;

          if (node.category == 0) {
            node.fixed = true;
            node.x = w/2 - 16;
            node.y = h/2 - 16;
          }
          
          node.draggable = true;
          node.label = {
              normal: {
                  show: true,
                  formatter: function(val) {
                    var strs = val.data.value.split(''); //字符串数组
                    var str = '';
                    for (var i = 0, s; s = strs[i++];) { //遍历字符串数组
                      str += s;
                      if(!(i % 9)) str += '\n'; //按需要求余
                    }
                    let curText = '';
                    if (val.data.category == 4) {
                      curText = '\n(当前房屋)';
                    }
                    return  '{color1|' +str + '}{color2|' + curText + '}';
                  }, 
                  rich: {
                    color1: {
                      align: 'center'
                    },
                    color2: {
                      color: 'red',
                      align: 'center'
                    }
                  },
                  position:"bottom",  
              }
          };
      });

      const option = {
        tooltip: {
          triggerOn:'click',
          formatter: function (params) {
              console.log(params.data)
            let info = '';
            switch(params.data.category) {
              case 0:
                  info += params.data.value+'<br/>';
                  info += '身份证：'+params.data.name+'<br/>';
                  info += '电话：'+(params.data.phone||'无')+'<br/>';
                  info += '住址：'+params.data.residence+'<br/>';
                  break;
              case 1:
                  info += params.data.value+'<br/>';
                  info += '身份证：'+params.data.name+'<br/>';
                  info += '电话：'+(params.data.phone||'无')+'<br/>';
                  info += '住址：'+params.data.residence+'<br/>';
                  break;
              case 2:
                  info += '车牌号：'+params.data.value+'<br/>';
                  break;
              case 3:
                  info += params.data.value+'<br/>';
                  info += '身份证：'+params.data.name+'<br/>';
                  info += '电话：'+(params.data.phone||'无')+'<br/>';
                  info += '住址：'+params.data.residence+'<br/>';
                  break;
              case 4:
                  info += params.data.value+'<br/>';
                  info += '详细地址：'+params.data.adress+'<br/>';
                  break;
              case 5:
                  info += params.data.value+'<br/>';
                  info += '详细地址：'+params.data.adress+'<br/>';
                  break;
              case 6:
                  info += params.data.value+'<br/>';
                  info += '详细地址：'+params.data.adress+'<br/>';
                  break;
              case 7:
                  info += params.data.name+'<br/>';
                  info += '车牌号：'+params.data.value+'<br/>';
                  break;
            }
              return info;
          }
        },
        legend: [{
            show: false
        }],
        animation: false,
        series : [
            {
                name: '关系图',
                type: 'graph',
                layout: 'force',
                data: graph.nodes,
                links: graph.links,
                categories: categories,
                roam: true, 
                label: {
                    normal: {
                        position: 'right'
                    },
                    
                },
                force: {
                    repulsion: 100,
                    gravity : 0.03,
                    edgeLength: [60,200],
                  },
                edgeLabel: {//线条的边缘标签
                  normal: {
                    show: true,
                    //通过回调函数设置连线上的标签
                    formatter: function (x) {
                        return x.data.name;
                    },
                    color: '#666'
                  }
                },
                edgeSymbol: ['circle','arrow'],
                edgeSymbolSize: [1,10]
            }
        ]
      };

      if (!barscase) {
        barscase = Ec.init(document.getElementById('house-relation-chart'));
      }
      barscase.setOption(option, true);
    },
    setChartResize() {
      let lineDom = document.getElementById('house-relation-chart');
      cssQueryCase = new CssQueries.ResizeSensor(lineDom, () => {
        barscase.resize();
      });
    }
  },
  beforeDestroy() {
    barscase.dispose();
    barscase = null;
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
  /* min-width: 700px; */
  width: calc(50% - 15px);
  height: 436px;
  margin-right: 30px;
  float: left;
}
#fwpic {
  /* height: 436px; */
  margin-right: 0px;
  margin-bottom:20px;
}

#fwinfo {
  /* width: 856px; */
  /* height: 264px; */
  position: relative;
}
.model-hold {
  margin-bottom: 50px;
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
  padding-left: 5px;
  margin-bottom: 15px;
}
.info-item div {
  display: block;
  width: 100%;
  height: auto;
}
.info-itemlabel {
  color: #333;
  width: 88px;
  text-align: right;
}

.info-item .info-col
{
    width: 100%;
}

.info-item .info-col span {
    white-space: nowrap;
    display: inline-block;
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
  min-width: 400px;
  width: calc(100% - 30px);
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
.isActive {
  color: #12b1e1;
}
</style>
      