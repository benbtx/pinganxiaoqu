<template>
  <span :id="id">
    <span class="right_span">{{name}}</span>
    <span class="wczt">
      <el-select style="width: 100px;" v-model="value" placeholder="请选择">
        <el-option
          v-for="item in dqoptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </span>
  </span>
</template>
<script>
import { excontrolApi } from "@/https";
import baidumap from "@/components/baidumap/mapInit";
import vitalStatistics from "@/components/charts/vitalStatistics";
import carStatistics from "@/components/charts/carStatistics";
import houseStatistics from "@/components/charts/houseStatistics";
import eventBus from "@/event";
import { eventCollection } from "@/event/resources";
import $ from "jquery";

export default {
  name: "tongjixinxi",
  data() {
    return {
      dqoptions: [
        {
          value: "1",
          label: "完成"
        },
        {
          value: "0",
          label: "未完成"
        }
      ],
      value: "0"
    };
  },
  props: ["id", "name", "state", "deadline"],
  components: {},
  mounted() {
    //  this.dqvalue=(this.state=="未完成"?0:1);
    // this.value = this.state;
    this.value=(this.state=="未完成"?'0':'1');
  },
  watch: {},
  created() {},
  methods() {}
};
</script>

<style scoped>
.right_span {
  margin-left: 10px;
}
.wczt {
  margin-left: 30px;
  width: 90px;
  /* display: inline-block; */
}
</style>