<template>
<div class="content-body add-control">
    <div class="page-bread">
      <el-breadcrumb>
        <el-breadcrumb-item>案件总览</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-title">
        <ul class="tabs-hold">
          <li :class="{active: showpart == 1}">
            <a class="tab-ank" v-on:click="togpart(1)">我的案件</a>
          </li>

          <li :class="{active: showpart == 2}">
            <a class="tab-ank" v-on:click="togpart(2)">我的收藏</a>
          </li>

          <li :class="{active: showpart == 3}">
            <a class="tab-ank" v-on:click="togpart(3)">浏览记录</a>
          </li>
        </ul>
    </div>

    <div class="content-row">
      <div class="search-group">   
          <div class="search-item">
            <span class="label">类别：</span>
            <el-checkbox label="案件" value="1" v-model="checkedTypes"></el-checkbox> 
            <el-checkbox label="线索" value="2" v-model="checkedTypes"></el-checkbox> 
            <el-checkbox label="串并案" value="3" v-model="checkedTypes"></el-checkbox> 
          </div> 
          <div class="search-item" style="margin-left:50px;">
            <span class="label">关键字：</span>
            <el-input v-model="searchKey" style="width:320px;">
            </el-input>
          </div>
          <span class="search-item">
            <button class="btn btn-info ridiusnull btn-search" type="button" @click="searchAnjian(1)">查询</button>
          </span>
      </div>
      <div class="anjian-content">
        <div class="anjian-item" :class="{xiansuo: item.type == '2',chuanbing: item.type=='3'}" v-for="item in anjianData" :key="item.id">
          <p class="anjian-type" v-if="item.type==1">案件（在侦）</p>
          <p class="anjian-type" v-if="item.type==2">线索（在侦）</p>
          <p class="anjian-type" v-if="item.type==3">串并案（在侦）</p>
          <div class="anjian-info">
            <img class="anjian-img" :src="item.src" onerror="javascript:this.src='/static/image/anjian/default.png'" />
            <p class="anjian-title">{{item.title}}</p>
            <p>时间：{{item.time}}</p>
            <p>地点：{{item.position}}</p>
            <p>
              <span class="anjian-label" :class="{aboutLabel: item.about}">相关案件: {{item.about}}</span>
              <span class="anjian-label" :class="{chuanbingLabel: item.chuanbingan}">处于串并案中: {{item.chuanbingan}}</span>
            </p>
            <p class="anjian-btn">
              <span style="border-right:1px solid #999;">详情</span>
              <span style="border-right:1px solid #999;">地图位置</span>
              <span>删除</span>
            </p>
          </div>
        </div>
      </div>
      <div class="anjian-footer">
        <el-pagination background @current-change="searchAnjian" :page-size="12" layout="total, prev, pager, next" :total="srcrestotal">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { excontrolApi } from "@/https";
import eventBus from "@/event";
import { eventCollection } from "@/event/resources";

export default {
  name: "anjianzonglan",
  data() {
    return {
      showpart: 1,
      searchKey: '',
      checkedTypes: [],
      anjianData:[{
        title: '天府三街持刀抢劫杀人案',
        time: '2018-11-09 21:22:22',
        position: '成都市高新区天府三街',
        src:'',
        about: '3',
        chuanbingan: '5',
        type: '1'
      },{
        title: '天府三街持刀抢劫杀人案',
        time: '2018-11-09 21:22:22',
        position: '成都市高新区天府三街',
        src:'',
        about: '3',
        chuanbingan: '5',
        type: '2'
      },{
        title: '天府三街持刀抢劫杀人案',
        time: '2018-11-09 21:22:22',
        position: '成都市高新区天府三街',
        src:'',
        about: '3',
        chuanbingan: '',
        type: '3'
      },{
        title: '天府三街持刀抢劫杀人案',
        time: '2018-11-09 21:22:22',
        position: '成都市高新区天府三街',
        src:'',
        about: '3',
        chuanbingan: '5',
        type: '1'
      },{
        title: '天府三街持刀抢劫杀人案',
        time: '2018-11-09 21:22:22',
        position: '成都市高新区天府三街',
        src:'',
        about: '',
        chuanbingan: '5',
        type: '1'
      },{
        title: '天府三街持刀抢劫杀人案',
        time: '2018-11-09 21:22:22',
        position: '成都市高新区天府三街',
        src:'',
        about: '',
        chuanbingan: '',
        type: '2'
      },{
        title: '天府三街持刀抢劫杀人案',
        time: '2018-11-09 21:22:22',
        position: '成都市高新区天府三街',
        src:'',
        about: '3',
        chuanbingan: '',
        type: '3'
      },{
        title: '天府三街持刀抢劫杀人案',
        time: '2018-11-09 21:22:22',
        position: '成都市高新区天府三街',
        src:'',
        about: '',
        chuanbingan: '5',
        type: '1'
      },],
      srcrestotal: 0
    };
  },
  mounted() {
    //    this.searchAnjian(1);
  },
  components: {
    
  },
  methods: {
    //控制tab显示
    togpart(val) {
      this.showpart = val;
    },
    searchAnjian(num) {

    },
  }
};
</script>
<style>
input[type="file"] {
  display: none;
}
</style>
<style scoped>
.content-row {
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
}
.content-title {
  margin-bottom: 20px;
  padding: 0;
  height: 30px;
  line-height:30px;
}
.tabs-hold {
  height: 28px;
  line-height: 28px;
}
.tabs-hold > li {
  margin: 0;
  display: inline-block;
  padding: 0 10px;
  font-weight: bold;
}
.tabs-hold > li.active {
  border-bottom: 3px solid #13b1e1;
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
.tabs-hold .tab-ank:hover {
  text-decoration: none;
}
.search-group {
  display: flex;
  flex: 1;
  height:40px;
  line-height:40px;
  justify-content: center;
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
.anjian-content {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.anjian-item {
  border: 1px solid #d9dfe5;
  border-top: none;
  min-width: 220px;
  width: calc((100% - 180px) / 6);
  margin: 10px 15px;
}
.anjian-item::before {
    display: block;
    content: '';
    width: calc(100% + 2px);
    height: 4px;
    background: #FF3333;
    margin-left: -1px;
}
.anjian-item.xiansuo::before {
    background: #FFCC33;
}
.anjian-item.chuanbing::before {
    background: #33CC33;
}
.anjian-type {
  margin: 0;
  height: 32px;
  line-height: 32px;
  padding-left: 10px;
  font-weight: bold;
  background: #f2f2f2;
  border-bottom: 1px solid #d9dfe5;
}
.anjian-info {
  padding: 10px;
  background: #fff;
}
.anjian-info img {
  width: 100%;
  margin: 5px 0;
}
.anjian-info p {
  margin: 0;
  height: 22px;
  line-height: 22px;
  font-size: 12px;
  display: flex;
  overflow: hidden;
}
.anjian-info .anjian-title {
  font-weight: bold;
  font-size: 14px;
}
.anjian-label {
  width:50%;
  background: #f2f2f2;
  text-align: center;
  display: none;
  position: relative;
}
.anjian-label:first-child {
  margin-right: 8px;
}
.chuanbingLabel, .aboutLabel {
  display: block;
}
.chuanbingLabel:before, .aboutLabel:before {
  position: absolute;
  content: '';
  display: block;
  width: 12px;
  height: 12px;
  border: 6px solid #33cc33;
  border-right: 6px solid transparent;
  border-bottom: 6px solid transparent;
  top: 0;
  left: 0;
}
.aboutLabel:before {
  border: 6px solid #FF9933;
  border-right: 6px solid transparent;
  border-bottom: 6px solid transparent;
}
.anjian-info .anjian-btn {
  border: 1px solid #999;
  display: flex;
  background: #f2f2f2;
  height: 30px;
  line-height: 30px;
  margin-top: 8px;
}
.anjian-btn span {
  display: inline-block;
  flex: 1;
  text-align: center;
  cursor: pointer;
}
.anjian-footer {
  padding-bottom: 20px;
  position: relative;
  height: 50px;
}
</style> 