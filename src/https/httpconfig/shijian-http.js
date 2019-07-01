import axios from 'axios'
import interceptor from '@/https/interceptor'
import Vue from 'vue'

// const shijianAddress = require('../../../config').shijianAddress
// let request = axios.create({ baseURL: shijianAddress });
// let http = axios.create({ baseURL: shijianAddress });
let request = axios.create({ baseURL: Vue.prototype.ApiUrl });
let http = axios.create({ baseURL: Vue.prototype.ApiUrl });
request.defaults.headers.post['Content-Type'] = 'application/json';
http.defaults.headers.post['Content-Type'] = 'multipart/form-data';
// multipart/form-data
interceptor(request);

export const shijianApi = {
    addShijian: data => request({
        url: '/sc/event/add',
        method: 'post',
        data,
        showload:true
    }),
    //上传资源
    uploadZiyuan: data => request({
        url: '/sc/event/uploadFile',
        method: 'post',
        data,
        showload:true
    }),
    //删除资源
    deleteZiyuan: data => request({
        url: '/sc/event/deleteFile?resourceUrl='+data,
        method: 'post',
        showload: false
    }),
    //事件查询/所有
    getAllEvents:data => request({
        url: '/sc/event/getAllEvents',
        method: 'get',
        params:data,
        showload:false
    }),  
    //事件查询/高级
    getGaojiEvents:data => request({
        url: '/sc/event/search',
        method: 'get',
        params:data,
        showload:false
    }), 
    //事件查询/模糊
    searchEvents:data => request({
        url: '/sc/event/fuzzySearch',
        method: 'get',
        params: data,
        showload:false
    }), 
    //事件管理/事件查询/获取事件详情
    getEventDetails:(id)=> request({
        url: '/sc/event/getMoredetails/'+id,
        method: 'get',
        showload:false
    }), 
    //事件管理/更新相关事件
    updateRelatedEvent: data => request({
        url: '/sc/event/updateRelatedEvent?eventId='+data.eventId+'&relatedEventsId='+data.relatedEventsId,
        method: 'put',
        showload:false
    }),
    //事件管理/删除事件
    deleteEvent: data => request({
        url: '/sc/event/delete?eventId='+data,
        method: 'DELETE',
        showload:false
    }),
    //事件管理/更新事件
    updateEvent: data => request({
        url: '/sc/event/update',
        method: 'put',
        data,
        showload:false
    }),
    //事件管理/更新事件资源
    updateEventSource: data => request({
        url: '/sc/event/insertResource',
        method: 'POST',
        data,
        showload:false
    }),
    //删除事件资源
    deleteEventSource: data => request({
        url: '/sc/event/deleteResource?resourceUrl='+data,
        method: 'DELETE',
        showload: false
    }),
    //事件管理/处置事件
    oprEvent: data => request({
        url: '/sc/event/complete?id='+data,
        method: 'put',
        showload:false
    }),


    
    
}
