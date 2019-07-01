import axios from 'axios'
import interceptor from '@/https/interceptor'
import Vue from 'vue'

// const controlAddress = require('../../../config').controlAddress
let request = axios.create({ baseURL: 'http://221.237.152.153:8892' });
// let request = axios.create({ baseURL: Vue.prototype.ApiUrl });
request.defaults.headers.post['Content-Type'] = 'application/json';
interceptor(request);

export const shipinApi = {
    //获取视频数据 
    getVideoData: data => request({
        url: '/emis-service/jvms/device-status-trigger/videoDetectSimulation',
        method: 'get',
        showload:true
    }),
    
    //获取视频数据 播放
    getPlayerVideo: data => request({
        url: '/emis-service/jvms/video/play',
        method: 'post',
        data,
        showload:true
    }),
    //获取视频数据 暂停
    pausePlayerVideo: data => request({
        url: '/emis-service/jvms/video/pause',
        method: 'post',
        data,
        showload:true
    }),
    //获取视频数据 停止
    stopPlayerVideo: data => request({
        url: '/emis-service/jvms/video/stop',
        method: 'post',
        data,
        showload:true
    }),
    //云台控制
    PTZControl: data => request({
        url: '/emis-service/jvms/ptz/PTZControl',
        method: 'post',
        data,
        showload:true
    }),

    //实时监控/获取视频播放key
    excontrolGetSecret:data => request({
        url: '/emis-service/sip/getSecret',
        method: 'get',
        showload:true
    }),

    //实时监控/获取摄像头树状结构
    excontrolGetCameraTree:data => request({
        url: '/emis-service/camera/getTree?rootIndexCode='+data,
        method: 'get',
        showload:true
    }),
    //实时监控/弹出框获取摄像头
    getCompanyCameraList:(data) => request({
        url: '/emis-service/camera/getCameraList?parentIndexCode='+data,
        // url: '/emis-service/camera/getCameraList',
        method: 'get',
        showload:true
    }),

    //重点场所/弹出框获取摄像头
    getCameraList:(data) => request({
        url: '/emis-service/camera/getCameraList',
        method: 'get',
        showload:true
    }),
    
     //视频监控  创建收藏节点
     addCollection: data => request({
        url: '/emis-service/favorite/create',
        method: 'post',
        data,
        showload:true
    }),
     //视频监控  修改收藏节点
     modifyCollection: data => request({
        url: '/emis-service/favorite/modify',
        method: 'PUT',
        data,
        showload:true
    }),
     //视频监控  删除收藏节点
     deleteCollection: data => request({
        url: '/emis-service/favorite/remove?nodeId='+data,
        method: 'delete',
        showload:true
    }),
     //视频监控  删除收藏设备
     deleteCollectionCamera: data => request({
        url: '/emis-service/favorite/removeCamera?nodeId='+data.nodeId+'&indexCode='+data.indexCode,
        method: 'DELETE',
        showload:true
    }),
    
    //视频监控 获取收藏节点树状结构
    searchCollectionTree: data => request({
        url: '/emis-service/favorite/findByParentId?parentId='+data,
        method: 'get',
        showload:true
    }),
     //视频监控 收藏节点
     addCollectionTree: data => request({
        url: '/emis-service/favorite/addCamera',
        method: 'put',
        data,
        showload:true
    }),

    //视频监控 获取预案树状结构
    searchYuanTree: data => request({
        url: '/emis-service/preplan/findByParentId?parentId='+data,
        method: 'get',
        showload:true
    }),
     //视频监控 新增预案分组
     addYuanGroup: data => request({
        url: '/emis-service/preplan/create',
        method: 'post',
        data,
        showload:true
    }),
    //视频监控 监控点新增预案
    addYuanTree: data => request({
        url: '/emis-service/preplan/addCamera',
        method: 'put',
        data,
        showload:true
    }),
    //视频监控 修改预案分组
    modifyYuanGroup: data => request({
        url: '/emis-service/preplan/modify',
        method: 'put',
        data,
        showload:true
    }),
    
    //视频监控 修改预案摄像机
    modifyYuanCamera: data => request({
        url: '/emis-service/preplan/modifyCamera',
        method: 'put',
        data,
        showload:true
    }),
    //视频监控  删除预案节点
    deleteYuanGroup: data => request({
        url: '/emis-service/preplan/remove?preplanId='+data,
        method: 'delete',
        showload:true
    }),
     //视频监控  删除预案设备
     deleteYuanCamera: data => request({
        url: '/emis-service/preplan/removeCamera?preplanId='+data.preplanId+'&indexCode='+data.indexCode,
        method: 'delete',
        showload:true
    }),

    //视频预案  新增预案巡检记录
    addYuanRecord: data => request({
        url: '/emis-service/preplan/preplanCheckRecord',
        method: 'POST',
        data,
        showload:true
    }),
    //视频预案 导出巡检记录
    exportYuanXjjl: data => request({
        url: '/emis-service/preplan/exportCheckRecord?userName='+data.userName+'&itemType='+data.itemType+'&beginTime='+data.beginTime+'&endTime='+data.endTime,
        method: 'get',
        responseType: 'blob',
        showload:true
    }),
    
    //视频预案  新增预案附件
    addYuanFile: data => request({
        url: '/emis-service/preplan/uploadExtraResource',
        method: 'POST',
        data,
        showload:true
    }),

    //视频预案  删除预案附件
    deleteYuanFile: data => request({
        url: '/emis-service/preplan/removeExtraResource?resourceUrl='+data,
        method: 'delete',
        showload:true
    }),
     //视频预案 根据preplanId和cameraIndexCode查询附件和备注
     searchYuanFileList: data => request({
        url: '/emis-service/preplan/findCameraPreplanExtraInfo?preplanId='+data.preplanId+'&cameraIndexCode='+data.cameraIndexCode ,
        method: 'get',
        showload:true
    }),
    //视频预案 获取巡检提醒事项数量
    getXunjianCount: () => request({
        url: '/emis-service/preplan/getNearOverDayConut',
        method: 'get',
        showload:true
    }),



    //获取视频插件地址
    getExePath: data => request({
        url: '/emis-service/jvms/add-ones/getFileList',
        method: 'get',
        showload:false
    }), 

     //实时监测/获取传感器
     getTransducerList: data => request({
        url: '/emis-service/monitor/transducer/getList?parentIndexCode='+data,
        method: 'get',
        showload:true
    }),
     //实时监测/更加企业编码查点位
     getPointList: data => request({
        url: '/emis-service/jvms/position-point/getList?parentIndexCode='+data,
        method: 'get',
        showload:true
    }),
     //实时监测/根据点位编号查询设备列表
     getPositionDeviceList: data => request({
        url: '/emis-service/jvms/position-point/getDeviceList?indexCode='+data,
        method: 'get',
        showload:true
    }),

    //实时监测/获取传感器代码
    getTransducerCode: data => request({
        url: '/emis-service/metadata/getDictionary',
        method: 'get',
        showload:true
    }),

    //根据id 获取 监控数据
    getByFactorDataHours: data => request({
        url: '/emis-service/monitor/pollution/by-factor/12hours?code='+data.code+'&hours='+data.hours+'&deviceIds='+data.deviceIds,
        method: 'get',
        showload: false
    }),
    //获取 监控数据/实时数据-检测项目
    getByFactorDataNow: data => request({
        url: '/emis-service/monitor/pollution/by-factor/items?codes='+data.codes+'&businessType='+data.businessType+'&deviceIds='+data.deviceIds,
        method: 'get',
        showload: false
    }),

    //获取 监控数据/历史数据
    getByFactorDataHistory: data => request({
        url: '/emis-service/monitor/pollution/by-factor/history?codes='+data.codes+'&beginDate='+data.beginDate+'&endDate='+data.endDate
            +'&deviceIds='+data.deviceIds+'&businessType='+data.businessType+'&pageNum='+data.pageNum+'&pageSize='+data.pageSize,
        method: 'get',
        showload: false
    }),
}
