import axios from 'axios'
import interceptor from '@/https/interceptor'
import Vue from 'vue'

// const tmpAddress = require('../../../config').tmpAddress
// let request = axios.create({ baseURL: tmpAddress });
// let request = axios.create({ baseURL: Vue.prototype.ApiUrl });

// let request = axios.create({ baseURL: 'http://10.3.9.166:8901' });


let request = axios.create({ baseURL: 'http://221.237.152.153:8892/emis-service' });
// let http = axios.create({ baseURL: 'http://10.3.9.178:12299' });

request.defaults.headers.post['Content-Type'] = 'application/json';
// http.defaults.headers.post['Content-Type'] = 'application/json';
interceptor(request);
let sockpoliceAddress='http://221.237.152.153:15674/stomp';

export const tmpApi = {
    sockpoliceAddress: sockpoliceAddress,

    //获取企业树状结构
    getQiyeTree: data => request({
        url: 'qy/qyTree?id=-1',
        method: 'get',
        showload:true
    }),

    //获取企业 详细信息
    getQiyeDetailsInfo: data => request({
        url: '/qy/findById?id=' + data,
        method: 'get',
        showload:true
    }),

    xiaoxituisongtest: () => request({
        url: '/qy/testRabbitMq?str="helloworld rabbitmq"',
        method: 'get',
        showload: false
    }),

    //实时监测/获取企业 详细信息
    getwebListQy: data => request({
        url: '/qy/webListQy',
        method: 'POST',
        data,
        showload:false
    }),


    getWorkBench:data => request({
        url: '/workBench/find',
        method: 'get',
        params: data,
        showload:false
    }), 
     //工作台 数据统计查询
     getWorkBenchCount:() => request({
        url: '/workBench/getCount',
        method: 'get',
        showload: false
    }), 
     //工作台 记录与更新消息阅读状态及是否转为事项
     addAndModifyWorkBench:data => request({
        url: '/workBench/addAndModify',
        method: 'post',
        data,
        showload:false
    }), 
    //工作台 标记为已完成
    finishWorkBenchEvents:data => request({
        url: '/workBench/complete',
        method: 'put',
        data,
        showload: false
    }), 

    //获取视频数据 播放
    // getPlayerVideo: data => http({
    //     url: '/videoSupport/video/play?id='+data.tollgateID+'&indexId='+data.tabUUID,
    //     method: 'get',
    //     showload:false
    // }),
    // getPlayerVideo: data => http({
    //     url: '/videoSupport/video/play',
    //     method: 'post',
    //     data,
    //     showload:false
    // }),
    // //获取视频数据 暂停
    // pausePlayerVideo: data => http({
    //     url: '/videoSupport/video/pause',
    //     method: 'post',
    //     data,
    //     showload:false
    // }),
    // //获取视频数据 停止
    // stopPlayerVideo: data => http({
    //     url: '/videoSupport/video/stop',
    //     method: 'post',
    //     data,
    //     showload:false
    // }),




}
