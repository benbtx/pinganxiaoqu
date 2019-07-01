<template>
    <div id="POI_search" class="poiSearch">
        <el-input placeholder="地名搜索" v-model="poiName" @keyup.enter.native="searchEnterFun">
            <el-button style="font-size: 1.5em;" @click="poiSearch" slot="append" icon="el-icon-search">
            </el-button>
        </el-input>
        <div style="background-color:  rgba(0,0,0,0.4);cursor:  pointer">
            <ul>
                <li class="poi_searchResult" @click="poiResultList_click(item.id)" v-for='item in poiSearchList' :key="item.id">
                    {{item.name}}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import { mapVar } from '@/components/maps/variable.js';
    export default {
        name: "PoiSearch",
        // props: ["options"],
        created: function () { },
        mounted() {


        },
        render() { },
        data() {
            return {
                //地名地址库搜索
                poiName: '',//地名地址库搜索
                poiSearchList: [],
                showPoiSearch: false,
                poiSearch_callback: undefined,
            }
        },
        beforeDestroy() { },
        methods: {
            //响应鼠标回车事件
            searchEnterFun: function (e) {
                var keyCode = window.event ? e.keyCode : e.which;
                if (keyCode == 13 && this.poiName) {
                    this.poiSearch();
                }
            },

        },

    }
</script>