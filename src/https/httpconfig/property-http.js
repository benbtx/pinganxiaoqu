import axios from 'axios'
import interceptor from '@/https/interceptor'
import Vue from 'vue'

// const propertyAddress = require('../../../config').propertyAddress
// let request = axios.create({ baseURL: propertyAddress });
let request = axios.create({ baseURL: Vue.prototype.ApiUrl });
request.defaults.headers.post['Content-Type'] = 'application/json';
interceptor(request);

export const propertyApi = {
    // getPlayerVideo: data => request({
    //     url: '/VideoSupport-other/video/play',
    //     method: 'post',
    //     data,
    //     showload:true
    // }),
    getGonggaoData: data => request({
        url: '/sc/notice/get',
        method: 'get',
        params:data,
        showload:true
    }),
    //物业服务团队
    getServiceData: data => request({
        url: '/sc/serverteam/get',
        method: 'get',
        params:data,
        showload:true
    }),
    //查询报修
    getRepairData: data => request({
        url: '/sc/repair/get',
        method: 'get',
        params:data,
        showload:true
    }),
    //获取门禁点
    getMenjinData: data => request({
        url: '/ui/getDoorInfos',
        method: 'get',
        params: data,
        showload:true
    }),
    //获取审批处置人
    excontrolGetBkspr:data => request({
        url: '/approve/listApproveDisposePersons?type='+data,
        // url: '/hik8200-adapter/approve/listApproveDisposePersons?type='+data,
        method: 'get',
        showload:true
    }),
    //通过审批编号获取审批详情
    excontrolGetBkspDetails:data => request({
        url: '/approve/findApproveInfoBySpbh?spbh='+data,
        // url: '/hik8200-adapter/approve/findApproveInfoBySpbh?spbh='+data,
        method: 'get',
        showload:true
    }),
    //通过审批通知编号获取审批详情
    excontrolGetBkspDetailsBytzbh:data => request({
        url: '/approve/findApproveInfoBySptzbh?sptzbh='+data,
        // url: '/hik8200-adapter/approve/findApproveInfoBySpbh?sptzbh='+data,
        method: 'get',
        showload:true
    }),
    //处理审批申请
    disposeApprove:data => request({
        url: '/approve/disposeApprove',
        // url: '/sc/approve/disposeApprove',
        method: 'post',
        data,
        showload:true
    }),
    
}
