<template>
<div class="content-body add-control">
    <div class="page-bread">
      <el-breadcrumb>
        <el-breadcrumb-item>视频监控</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="bl-content">
      <div class="scbb" v-if="this.activeName == 'third'">
        <el-date-picker
          v-model="bbtime"
          class="scbb-select"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <button type="button" class="btn btn-info" @click="exportXjjl">生成报表</button>
      </div>
      <div class="content-left">
        <el-tabs v-model="activeName" type="card" @tab-click="tabToggle">
          <el-tab-pane label="资源" name="first" class="organization-group">
              <div class="organization">
                <organization-tree ref="organizationTree"></organization-tree>
              </div>
          </el-tab-pane>
          <el-tab-pane label="收藏" name="second">
            <div class="organization">
              <collection-tree ref="collectionTree"></collection-tree>
            </div>
          </el-tab-pane>
          <el-tab-pane label="预案" name="third">
              <div class="organization">
                <yuan-tree ref="yuanTree"></yuan-tree>  
              </div>                 
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="content-right">
          <baidu-map ref="map" addtype="spjk" :activeName="activeName"></baidu-map>
      </div>
    </div>
  </div>
</template>

<script>
import OrganizationTree from "@/components/shipin/organizationTree";
import CollectionTree from "@/components/shipin/collectionTree";
import YuanTree from "@/components/shipin/yuanTree";
import { shipinApi } from "@/https";
import eventBus from "@/event";
import { eventCollection } from "@/event/resources";
import baidumap from '@/components/baidumap/mapInitHBJC';

export default {
  name: "shipinjiankong",
  data() {
    return {
      activeName: "first",
      bbtime: [this.getFormatDateYear(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7)),this.getFormatDateYear(new Date())]
    };
  },
  mounted() {
  },
  created() {

  },
  components: {
    "organization-tree": OrganizationTree,
    "collection-tree": CollectionTree,
    "yuan-tree": YuanTree,
    'baidu-map':baidumap
  },
  methods: {
    tabToggle() {
      if (this.activeName == 'first') {
        this.$refs.organizationTree.getTollgate();


      } else if (this.activeName == 'second') {
        this.$refs.collectionTree.searchTreeData();
      } else if (this.activeName == 'third') {
        this.$refs.yuanTree.searchTreeData();
      }
      if (this.activeName == 'first') {
         //从2,3切回到1时，排除 默认加载1
         //alert(11);
          this.$refs.map.clear();
          // this.$refs.map.getSpjk();
          var data=this.$refs.map.ajaxData.companyCameraData;
          this.$refs.map.addAtMaker(data, "shipingjiankong", '../../../static/image/bmap/kakou.png');  
          this.$refs.map.showAtMakerContain(this.$refs.organizationTree.filterText);


      }
      
    },
    exportXjjl() {
      let param = {};
      param.userName = this.$store.getters.username;
      param.itemType = '视频巡查';
      param.beginTime = this.bbtime[0]+' 00:00:00';
      param.endTime = this.bbtime[1]+' 23:59:59';

      return shipinApi
        .exportYuanXjjl(param)
        .then(data => {
          this.downloadBd(data);
        });
    },
    downloadBd(data) {
      let blob = new Blob([data], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
          });
          //let url = new Blob([data],{type: 'application/vnd.ms-excel;charset=utf-8'});
          var downloadElement = document.createElement('a');
          var href = window.URL.createObjectURL(blob); //创建下载的链接
          downloadElement.href = href;
          downloadElement.download = this.$store.getters.username +'-视频巡查记录表-'+this.getFormatDateYear(new Date(),'YYYY.MM.DD')+'.xls'; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
    },
  }
};
</script>

<style scoped>
.content-row {
  padding: 0;
  height: 100%;
}
.bl-content {
  width: 1400px;
  min-height: 500px;
  height: calc(100vh - 140px);
  margin: 0;
  width: 100%;
  box-sizing: border-box;
  background: #fff;
}
.content-left {
  width: 326px;
  height: 100%;
  float: left;
  border: 1px solid #ccc;
}
.content-right {
  width: calc(100% - 326px);
  height: 100%;
  margin-left: 326px;
  border-left: none;
  background: #444446;
}
.organization {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding-top: 10px;
}
.scbb {
  position: absolute;
  right: 0px;
  top: 0;
  height: 46px;
  line-height: 46px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.scbb-select {
  height: 30px;
  line-height: 30px;
}
.btn-info {
  background-color: #13b1e1;
  border: none;
  margin: 15px 20px;
  font-size:12px;
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
</style> 