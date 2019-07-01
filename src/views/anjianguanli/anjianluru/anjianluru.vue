<template>
<div class="content-body add-control">
    <div class="page-bread">
      <el-breadcrumb>
        <el-breadcrumb-item>案件录入</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="margin-bottom:15px;display:flex;">
     <div class="fn-bls">
        <!-- <router-link tag="div" class="ic_anjianbtn add_anjian" v-bind:to="'/anjianguanli/addanjian'">
        </router-link> -->
        <div class="ic_anjianbtn add_anjian"></div>
      </div>
      <div class="fn-bls">
        <!-- <router-link tag="div" class="ic_anjianbtn add_xiansuo" v-bind:to="'/anjianguanli/addanjian'">
        </router-link> -->
        <div class="ic_anjianbtn add_xiansuo"></div>
      </div>
    </div>
    <div class="content-row">
      <div class="bl-content">
        <div class="content-title">
          <span>最近添加案件</span>
          <el-select class="fr" v-model="bukongtype" style="width:120px;" placeholder="请选择" clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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
  </div>
</template>

<script>
import { excontrolApi } from "@/https";
import eventBus from "@/event";
import { eventCollection } from "@/event/resources";

export default {
  name: "anjianluru",
  data() {
    return {
      searchKey: '',
      checkedTypes: [],
      options:[{
        label: '最近一月',
        value: 'month'
      },{
        label: '最近一周',
        value: 'week'
      },{
        label: '最近三天',
        value: 'three'
      },],
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
.bl-content {
  width: 1400px;
  min-height: calc(100vh - 240px);
  margin-bottom: 30px;
  width:100%;
  box-sizing: border-box;
  background: #fff;
  border: 1px solid #d9dfe5;
}
.content-title {
  padding-left: 15px;
  height: 40px;
  line-height: 40px;
}
.fn-bls {
  display: block;
  width: 180px;
  margin: 5px 40px 5px 0px;
  float: left;
  border-radius: 5px;
  overflow: hidden;
}
.ic_anjianbtn {
  width: 100%;
  height: 100px;
  margin: 0 auto;
  padding: 10px 0px;
  cursor: pointer;
}
.add_anjian {
  background: url(/static/image/anjian/icon-anjian.png) no-repeat;
  background-size: auto 100%;
  background-position: center;
}
.add_xiansuo {
  background: url(/static/image/anjian/icon-xiansuo.png) no-repeat;
  background-size: auto 100%;
  background-position: center;
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