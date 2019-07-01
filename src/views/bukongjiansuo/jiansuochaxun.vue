<template>
  <div id="contentbody" class="content-body">
    <div class="page-bread">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>布控管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-row">
      <div class="bl-content">
        <div id="bukongsearch" style="margin:0;">
          <div class="content-title">
            <ul class="tabs-hold">
              <li :class="{active: showpart == 2}">
                <a class="tab-ank" v-on:click="togpart(2)">人员检索</a>
              </li>
              <li class="tab-ank">/</li>
              <li :class="{active: showpart == 3}">
                <a class="tab-ank" v-on:click="togpart(3)">车辆检索</a>
              </li>
            </ul>
          </div>

          <div style="margin-top:20px;padding:0 10px;" v-show="showpart == 2">
            <div class="search-group">
              <div class="search-item">
                <span class="label">身份证：</span>
                <el-input v-model="IDNo"></el-input>
              </div>              
              <div class="search-item">
                <span class="label">姓名：</span>
                <el-input v-model="name">
                </el-input>
              </div>
              <span class="search-item">
                <button class="btn btn-info ridiusnull btn-search" type="button" @click="searchExcontrolry(1)">查询</button>
              </span>
            </div>
            <div id="bukongsearchdiv" style="margin-top:10px;" v-show="srcresshow">
              <div class="model-hold">
                <el-table :data="srcRyTableData">
                  <el-table-column type="index" width="80" label="序号">
                  </el-table-column>
                  <el-table-column prop="name" label="姓名" min-width="120">
                  </el-table-column>
                  <el-table-column prop="idNumber" label="身份证" min-width="120">
                  </el-table-column>
                  <el-table-column prop="addr" min-width="200" label="地址">
                  </el-table-column>
                  <el-table-column prop="phone" min-width="150" label="电话">
                  </el-table-column>
                  <el-table-column prop="plateNo" min-width="150" label="车牌号">
                  </el-table-column>
                  <el-table-column label="操作" min-width="300" fixed='right'>
                    <template slot-scope="scope">
                      <el-button type="text" size="small" class="operate-btn" @click="lookrydetail(scope.row)">
                        <i class="fa fa-file-text-o"></i> 查看详情</el-button>
                      <el-button  type="text" size="small" class="operate-btn" @click="shikongfenxi(scope.row)">
                        <i class="fa fa-pencil-square-o"></i> 时空分析</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <el-pagination background @current-change="searchExcontrolry" :page-size="10" layout="total, prev, pager, next, jumper" :total="srcrestotal">
              </el-pagination>
            </div>
          </div>

          <div style="margin-top:20px;padding:0 10px;" v-show="showpart == 3">
            <div class="search-group">
              <!-- <div class="search-item">
                <span class="label">告警日期：</span>
                <el-date-picker
                  v-model="datetimerange"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
              </div> -->
              <div class="search-item">
                <span class="label">车牌：</span>
                <el-input v-model="plateNo"></el-input>
              </div>
              <!-- <div class="search-item">
                <span class="label">类型：</span>
                <el-select v-model="bukongtype" disabled placeholder="请选择" clearable>
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div> -->
              <div class="search-item">
                  <span class="label">车型：</span>
                  <el-input  v-model="clxh" style="width:185px" readonly="readonly"></el-input>
                  <el-button type="primary" size='small' @click="showSelClpp" style="width:100px;margin-left:10px;background:#12b1e1;">选择车辆品牌</el-button>
                  <div v-show="showSelcarpp" style="position:absolute;top:30px;margin-left:360px;width:300px;height:560px;background:#fff;border:1px solid #ccc;z-index:32;">
                    <span class="close-icon" @click="showSelClpp"><i class="fa fa-times-circle-o"></i></span> 
                    <div class="list-shortcut" style="width:40px;margin:0;float:left;height:100%;">
                      <ul>
                        <li v-for="(item, index) in shortcutList"
                        class="item"
                        :data-index="index"
                        :key="item.id"
                        @click="gotoPosition">
                        {{ item }}
                        </li>
                      </ul>
                    </div>
                    <ul class="clpp-list" ref="listView">
                      <li v-for="group in clpps"
                        class="list-group"
                        :key="group.id"
                        ref="listGroup">
                        <h2 class="list-group-title">{{ group.title }}</h2>
                        <ul>
                          <li v-for="item in group.items" @click="selCarpinpai(item.value, item.label)"
                            class="list-group-item" :key="item.id">
                            <span>{{item.label}}</span>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                
              </div>
              
              <!-- <div class="search-item">
                <span class="label">关键字：</span>
                <el-input v-model="bukongkey">
                </el-input>
              </div> -->
              <span class="search-item">
                <button class="btn btn-info ridiusnull btn-search" type="button" @click="searchExcontrol(1)">查询</button>
              </span>
            </div>
            <div id="bukongsearchdiv" style="margin-top:10px;" v-show="srcresshow">
              <div class="model-hold">
                <el-table :data="srcTableData">
                  <el-table-column type="index" width="80" label="序号">
                  </el-table-column>
                  <el-table-column prop="plateNo" label="车牌号码" min-width="120">
                  </el-table-column>
                  <el-table-column prop="vehicleModel" label="车型" min-width="120">
                  </el-table-column>
                  <el-table-column prop="vehicleBrand" min-width="100" label="车辆品牌">
                  </el-table-column>
                  <el-table-column prop="passTime" min-width="150" label="过车时间">
                  </el-table-column>
                  <el-table-column prop="tollgateName" min-width="150" label="过车位置">
                  </el-table-column>
                  <el-table-column label="操作" min-width="300" fixed='right'>
                    <template slot-scope="scope">
                      <el-button type="text" size="small" class="operate-btn" @click="lookcldetail(scope.row)">
                        <i class="fa fa-file-text-o"></i> 查看详情</el-button>
                      <el-button  type="text" size="small" class="operate-btn" @click="shikongfenxi(scope.row)">
                        <i class="fa fa-pencil-square-o"></i> 时空分析</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <el-pagination background @current-change="searchExcontrol" :page-size="10" layout="total, prev, pager, next, jumper" :total="srcrestotal">
              </el-pagination>
            </div>

          </div>
        </div>

        <el-dialog
          title="查看详情"
          :visible.sync="ryVisibility"
          width="600px"
          class="modal-popover"
          :close-on-click-modal='false'
          >
          <div class="popover-content">
            <div class="picture-hold">
                <div class="pic-wrap">
                    <img :src="BASE_IMG_URL+rydetailsdata.image" />
                </div>
            </div>
            <div class="row">
                <div class="col-md-10">
                    <span class="spandec">姓名：
                    <span class="spantext">{{rydetailsdata.name}}</span>
                    </span>
                </div>
            </div>
            <div class="row">
                <div class="col-md-10">
                    <span class="spandec">身份证：
                    <span class="spantext">{{rydetailsdata.idNumber}}</span>
                    </span>
                </div>
            </div>
            <div class="row">
                <div class="col-md-10 spandiv">
                    <span class="spandec">地址：
                    <span class="spantext">{{rydetailsdata.addr}}</span>
                    </span>
                </div>
            </div>
              <div class="row">
                <div class="col-md-5">
                    <span class="spandec">电话：
                    <span class="spantext">{{rydetailsdata.phone}}</span>
                    </span>
                </div>
                <div class="col-md-5">
                    <span class="spandec">车牌号：
                    <span class="spantext">{{rydetailsdata.plateNo}}</span>
                    </span>
                </div>
            </div>
            <div class="row">
                <div class="col-md-5">
                    <span class="spandec">QQ：
                    <span class="spantext">{{rydetailsdata.qq}}</span>
                    </span>
                </div>
                <div class="col-md-5">
                    <span class="spandec">微信：
                    <span class="spantext">{{rydetailsdata.wechat}}</span>
                    </span>
                </div>
            </div>
          </div>
        </el-dialog>

        <el-dialog
          title="查看详情"
          :visible.sync="clVisibility"
          width="600px"
          class="modal-popover"
          :close-on-click-modal='false'
          >
          <div class="popover-content">
            <div class="picture-hold">
                <div class="pic-wrap">
                    <img :src="BASE_IMG_URL+cldetailsdata.imageUrl" />
                </div>
            </div>
            <div class="row">
                <div class="col-md-10">
                    <span class="spandec">车牌：
                    <span class="spantext">{{cldetailsdata.plateNo}}</span>
                    </span>
                </div>
            </div>
            <div class="row">
                <div class="col-md-10">
                    <span class="spandec">车型：
                    <span class="spantext">{{cldetailsdata.vehicleBrand}}</span>
                    </span>
                </div>
            </div>
            <div class="row">
                <div class="col-md-10 spandiv">
                    <span class="spandec">发现位置：
                    <span class="spantext">{{cldetailsdata.tollgateName}}</span>
                    </span>
                </div>
            </div>
              <div class="row">
                <div class="col-md-10">
                    <span class="spandec">发现时间：
                    <span class="spantext">{{cldetailsdata.passTime}}</span>
                    </span>
                </div>
            </div>
            <div class="row">
                <div class="col-md-10">
                    <span class="spandec">行驶方向：
                    <span class="spantext"></span>
                    </span>
                </div>
            </div>
            <div class="row">
                <div class="col-md-10">
                    <span class="spandec">车速：
                    <span class="spantext">{{cldetailsdata.speed}}</span>
                    </span>
                </div>
            </div>
          </div>
        </el-dialog>
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
      showSelcarpp: false,
      srcrestotal: 0,
      srcresshow: true,
      datetimerange: [],
      controlpeople:null,
      controlcar:null,
      plateNo:'',
      options: [
        {
          label: '车辆',
          value: '3'
        },{
          label: '人员',
          value: '2'
        }
      ],
      ruleForm: {
        bkbh:'',
        bkfqr: '',
        //选择的布控时间范围
        bkyy:"",
        bkxm: '',
        bksfz:'',
        bkdh: '',
        bkhjd: '',
        bkcl: '',
        bkcpys: '',
        cpysText: '',
        bkcxid: '',
        bkcx: '',
        bkclys: '',
        clysText: '',
      },
      bukongtype: '',
      bukongkey:'',
      bukongbh: '',
      srcTableData:[],
      srcRyTableData:[],
      dxpp:'',
      cpcolorlist:[
        {
          label:"黑色",
          value:"1",
        },
        {
          label:"白色",
          value:"2",
        },
        {
          label:"灰色",
          value:"3",
        },
        {
          label:"红色",
          value:"4",
        },
        {
          label:"蓝色",
          value:"5",
        },
        {
          label:"黄色",
          value:"6",
        },
        {
          label:"橙色",
          value:"7",
        },
        {
          label:"棕色",
          value:"8",
        },
        {
          label:"绿色",
          value:"9",
        },
        {
          label:"紫色",
          value:"10",
        },
        {
          label:"青色",
          value:"11",
        },
        {
          label:"粉色",
          value:"12",
        },
        {
          label:"透明",
          value:"13",
        },
        {
          label:"其他",
          value:"99",
        },
      ],
      clpplist:[],
      cphm:'',
      cpys:'',
      clpp:'',
      clys:'',
      ryID:'',
      ryxm:'',
      clpps: [],
      clxh:'',
      xhid:'',
      showpart: 2,
      name:'',
      IDNo:'',
      ryVisibility: false,
      clVisibility: false,
      sourceSrc: '',
      playerState: false,
      sourceData: {
        tabUUID: '',
        tollgateID: ''
      },
      cldetailsdata: {},
      rydetailsdata: {}
    };
  },
  created() {
     this.clpps = JSON.parse(localStorage.getItem('clpplist')) || [];

     let type = this.$route.query.type;
     if (type == 'ry') {
       this.showpart = 2;
     } else if (type == 'che') {
       this.showpart = 3;
     }
  },
  mounted() {
    if(this.showpart==2) {
        this.searchExcontrolry(1);
      } else if(this.showpart==3) {
        this.searchExcontrol(1);
      }
  },
  computed: {
    shortcutList () {
     return this.clpps.map((group) => {
      return group.title.substr(0, 1);
     })
    }
  },
  methods: {
    //控制tab显示
    togpart(val) {
      this.showpart = val;
      this.gaojingType = val;
      if(val==2)
      {
        this.searchExcontrolry(1);
      }
      else if(val==3)
      {
        this.searchExcontrol(1);
      }
    },
    showSelClpp() {
      this.showSelcarpp = !this.showSelcarpp;
    },
    selCarpinpai(id, label) {
    //  this.ruleForm.bkcxid = id;
      this.xhid =id;
      this.clxh = label;
      this.showSelcarpp = !this.showSelcarpp;
    },
    gotoPosition(e) {
      // 获取到绑定的 index
      let index = e.target.getAttribute('data-index');
      this.$refs.listView.scrollTop = this.$refs.listGroup[index].offsetTop - 5;
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
    lookrydetail(data) {
      this.ryVisibility = true;
      this.rydetailsdata = data;
    },
    lookcldetail(data) {
      this.clVisibility = true;
      this.cldetailsdata = data;
    },
    shikongfenxi(data) {
      // console.log(data)
      // this.$router.push({path:'/bukongguanli/bukongxiangqing',query: {pro_id: data.dispositionID, type: 'edit'}});
    },
    //车辆检索
    searchExcontrol: function(ctrcurrentPage) {
      let param = {};
      param.pageNum = ctrcurrentPage;
      param.pageSize = 10;

      param.plateNo = this.plateNo;
      param.vehicleBrand = this.xhid;
   
      return excontrolApi
        .motorVehicleSearch(param)
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.srcrestotal = data.total;
          //生成表格
          this.srcTableData = data.pageData;
          for(var i=0;i<this.srcTableData.length;i++)
          {
            this.srcTableData[i].passTime = this.getFormatDate(this.srcTableData[i].passTime);

            if(this.srcTableData[i].vehicleBrand!=null)
            {
              this.clpp = this.getCLpp(this.srcTableData[i].vehicleBrand);
            }
            
            this.srcTableData[i].vehicleBrand =  this.clpp;
            }

        });
    },  
//人员检索
    searchExcontrolry: function(ctrcurrentPage) {
      let param = {};
      param.pageNum = ctrcurrentPage;
      param.pageSize = 10;

      param.idNumber = this.IDNo;
      param.name = this.name;
   
      return excontrolApi
        .archiveSearch(param)
        .then(res => res.data)
        .then(data => {
          // loading.close();
          this.srcrestotal = data.total;
          //生成表格
          this.srcRyTableData = data.pageData;
          // for(var i=0;i<this.srcTableData.length;i++)
          // {

          // }

        });
    },  
    
    

  },
};
</script>

<style scoped>
.bl-content {
  width: 1400px;
  min-height: calc(100vh - 130px);
  margin-bottom: 30px;
  width:100%;
  box-sizing: border-box;
  background: #fff;
  border: 1px solid #d9dfe5;
  position: relative;
}
.model-hold {
  margin-bottom: 50px;
}
/* 操作div */
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
}
.search-item {
  display: flex;
  margin-right: 20px;
  flex-direction: row;
  flex: 0 1 auto;
  justify-content: center;
  align-items: center;
}
.search-item .label {
  width: 80px;
  color: #595959;
  font-weight: normal;
  font-size: 100%;
}

.tabs-hold {
  border-bottom: 1px solid #d9dfe5;
  height: 40px;
  line-height: 40px;
  padding: 0 10px;
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
  color: #13B1E1;
}
.list-shortcut {
  border-right: 1px solid #ccc;
}
.list-shortcut ul, .list-shortcut li, .clpp-list, .clpp-list li {
  padding: 0;
  list-style: none;
}
.list-shortcut li {
  height: 20px;
  line-height: 20px;
  text-align: center;
}
.list-shortcut li:hover {
  background: #ccc;
  cursor: pointer;
}
.clpp-list {
  margin: 0;
  margin-left:40px;
  height:100%;
  overflow:auto;
}
.clpp-list h2 {
  height: 30px;
  line-height:30px;
  margin: 5px 0;
  font-size:16px;
  background: #e6eff9;
  color: #12b1e1;
  padding-left:20px;
}
.clpp-list .list-group ul {
  margin: 0;
  padding: 0;
}
.clpp-list .list-group-item {
  height: 24px;
  line-height: 24px;
  padding-left: 20px;
  cursor: pointer;
}
.clpp-list .list-group-item:hover{
  background: #eee;
}
.close-icon {
  position: absolute;
  right: -8px;
  top: -8px;
  width: 20px;
  height: 20px;
  line-height: 20px;
  font-size: 20px;
  cursor: pointer;
}

.picture-hold {
  position:absolute;
  width: 104px;
  right: 20px;
}
.pic-btn {
  width: 104px;
  height: 28px;
  line-height: 24px;
  margin-top: 10px;
  text-align: center;
  background: #f1f4f5;
  border: 1px solid #d8dfe5;
}
.pic-wrap {
  position: relative;
  margin-top:10px;
  width: 104px;
  height: 124px;
  line-height: 118px;
  text-align: center;
  border: 1px solid #8394a1;
}
</style>