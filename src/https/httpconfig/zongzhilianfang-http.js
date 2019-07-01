import axios from 'axios'
import interceptor from '@/https/interceptor'
import Vue from 'vue'

// const tmpAddress = require('../../../config').tmpAddress
// let request = axios.create({ baseURL: tmpAddress });
let request = axios.create({ baseURL: Vue.prototype.ApiUrl });
request.defaults.headers.post['Content-Type'] = 'application/json';
interceptor(request);

export const passwayApi = {
    //人脸对比
    compareFace:data => request({
        url: '/sc/comprehensive/searchByImage',
        method: 'get',
        params: data,
        showload:true
    }),
     //车辆轨迹
     getClguiji:data => request({
        url: '/sc/comprehensive/vehiclePass',
        method: 'get',
        params:data,
        showload:true
    }),

     //人员轨迹
     getRyguiji:data => request({
        url: '/sc/comprehensive/findFaceTrace',
        method: 'get',
        params:data,
        showload:true
    }),
}
