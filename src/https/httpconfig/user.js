import axios from 'axios'
import interceptor from '@/https/interceptor'
import Vue from 'vue'

// const controlAddress = require('../../../config').controlAddress
// let request = axios.create({ baseURL: controlAddress });
let request = axios.create({ baseURL: Vue.prototype.ApiUrl });
request.defaults.headers.post['Content-Type'] = 'application/json';
interceptor(request);

export const userApi = {
    //删除用户
    deleteuser: data => request({
        url: '/user/delete',
        method: 'post',
        data,
        showload:true
    }),
    //模糊查询用户ß
    finduserbypara: data => request({
        url: '/user/findvague',
        method: 'post',
        data,
        showload:true
    }),
    //查找所有用户
    findalluser:data => request({
        url: '/user/findAll',
        method: 'post',
        data,
        showload:true
    }),
    //重置密码
    resetpassword:data => request({
        url: '/user/resetPassword',
        method: 'post',
        data,
        showload:true
    }),
    //保存用户
    saveuser:data=>request({
        url: '/user/save',
        method: 'post',
        data,
        showload:true
    }),
    
    //获取用户菜单
    getMenuBar:() => request({
        url: '/api-user/menus/current/custom',
        method: 'get',
        showload:false
    }), 
}
