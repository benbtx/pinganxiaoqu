<template>
  <div id="contentbody" class="content-body">
    <div class="page-bread">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>事件查询</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-row">
      <xiangguanshijian-details></xiangguanshijian-details>
    </div>
  </div>
</template>

<script>
// import { excontrolApi } from "@/https";
import { excontrolApi, shijianApi } from "@/https";
import shijianSearch from "@/views/shijianguanli/shijianSearch";

export default {
  name: "shijianchaxun",
  data() {
    return {

    };
  },
  components: {
    "xiangguanshijian-details": shijianSearch,
  },
  methods: {
  }
};
</script>