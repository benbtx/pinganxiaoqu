import axios from 'axios'
import interceptor from '@/https/interceptor'
import Vue from 'vue'

// const controlAddress = require('../../../config').controlAddress
// let request = axios.create({ baseURL: this.controlAddress });
let request = axios.create({ baseURL: Vue.prototype.ApiUrl });
request.defaults.headers.post['Content-Type'] = 'application/json';
interceptor(request);

let sockpoliceAddress='http://221.237.152.153:15674/stomp';

export const excontrolApi = {
    //批量上传图片
    uploadImgs:data => request({
        url: '/person/importPhotos',
        method: 'post',
        data,
        showload:false
    }), 
    getimgbase64: data => request({
        method:"GET",
        url:'/ui/transformPic',
        params:data,
        showload:true
    }),
    sockpoliceAddress:sockpoliceAddress,
    loginIn: data => request({
        url: '/VIIA/User/login',
        params: data,
        showload:true
    }),
    //查询布控情况
    excontrolgetBKstate: data => request({
        url: '/hik8200-adapter/disposition/number',
        method: 'get',
        params:data,
        showload:true
    }),
    //布控查询
    excontrolSearch:data => request({
        url: '/hik8200-adapter/disposition/get',
        method: 'get',
        params: data,
        showload:true
    }),
    //新增人员/车辆布控获取布控编号
    excontrolGetBkID:data => request({
        url: '/hik8200-adapter/disposition/dispositionID',
        method: 'get',
        params:data,
        showload:true
    }),

    //新增人员/获取设备树
    excontrolGetTreeNode:data => request({
        // url: '/hik8200-adapter/remoteControlUnit/findControlUnitByUnitCode',
        url: '/hik8200-adapter/remoteControlUnit/findAllResourceGroupByTreeNode',
        method: 'get',
        params:data,
        showload:true
    }),
    
    //新增人员/获取设备信息
    // excontrolGetTreeDev:data => request({
    //     url: '/hik8200-adapter/faceCamera/findFaceCamera',
    //     method: 'get',
    //     params:data,
    //     showload:true
    // }),

    //新增人员/车辆布控获取卡口信息
    excontrolGetBktollgate:data => request({
        url: '/hik8200-adapter/Tollgate/get',
        method: 'get',
        params:data,
        showload:true
    }),
    //获取审批处置人
    excontrolGetBkspr:data => request({
        url: '/sc/approve/listApproveDisposePersons?type='+data,
        method: 'get',
        showload:true
    }),
    //通过审批编号获取审批详情
    excontrolGetBkspDetails:data => request({
        url: '/sc/approve/findApproveInfoBySpbh?spbh='+data,
        method: 'get',
        showload:true
    }),
    //通过审批通知编号获取审批详情
    excontrolGetBkspDetailsBytzbh:data => request({
        url: '/sc/approve/findApproveInfoBySptzbh?sptzbh='+data,
        method: 'get',
        showload:true
    }),
    //处理审批申请
    disposeApprove:data => request({
        url: '/sc/approve/disposeApprove',
        method: 'post',
        data,
        showload:true
    }),


    //新增单人布控和车辆提交
    excontroladdBkSubmit:data => request({
        url: '/hik8200-adapter/disposition/post',
        method: 'post',
        data,
        showload:true
    }),
    //获取待审批布控信息
    excontrolGetBkDetails:data => request({
        url: '/hik8200-adapter/disposition/findApprovalDispositionBySpBh?spbh='+data,
        method: 'get',
        showload:true
    }),

    //撤销布控
    excontrolRevoke:(id, reason) => request({
        url: '/hik8200-adapter/disposition/revoke/'+id+'/'+reason,
        method: 'put',
        showload:true
    }),

    //查询布控告警列表
    excontrolGaojingSearch:data => request({
        url: '/hik8200-adapter/notification/get',
        method: 'get',
        params: data,
        showload: true
    }),
    //告警检索详情
    excontrolGaojingSearchDetails:data => request({
        url: '/hik8200-adapter/notification/detail',
        method: 'get',
        params:data,
        showload:true
    }),
    //修改布控
    excontrolModify:data => request({
        url: '/hik8200-adapter/disposition/put',
        method: 'put',
        data,
        showload:true
    }),

    //获取车辆品牌
    getVehicleBrandTypes:() => request({
        url: '/sc/base/vehicleBrandTypes',
        method: 'get'
    }),

    //查询今日告警数量
    getCurDayGaojingNum:() => request({
        url: '/hik8200-adapter/notification/dayCount',
        method: 'get'
    }),
    //车辆检索
    motorVehicleSearch:data => request({
        url: '/VIIA/motorVehicle/search',
        method: 'get',
        params:data,
        showload:true
    }),
    //人员检索
    archiveSearch:data => request({
        url: '/sc-search/multiSearch/search',
        method: 'get',
        params:data,
        showload:true
    }),

    //时空分析车辆检索
    skmotorVehicleSearch:data => request({
        url: '/VIIA/motorVehicle/retrieval',
        method: 'get',
        params:data,
        showload:true
    }),
    //时空分析车辆轨迹
    skmotorVehicleTrack:data => request({
        url: '/VIIA/motorVehicle/track',
        method: 'get',
        params:data,
        showload:true
    }),
    //时空分析人员轨迹
    skPersonTrack:data => request({
        url: '/VIIA/person/track',
        method: 'get',
        params:data,
        showload:true
    }),
    
    //时空分析人员检索
    skPersonSearch:data => request({
        url: '/VIIA/person/retrieval',
        method: 'get',
        params:data,
        showload:true
    }),
    skCaseSearch:data => request({
        url: '/VIIA/Case/scopeRadius',
        method: 'get',
        params:data,
        showload:true
    }),

    wyBaoxiuSearch:data => request({
        url: '/sc/repair/get',
        method: 'get',
        params:data,
        showload:true
    }),

    wyTousuSearch:data => request({
        url: '/sc/complain/get',
        method: 'get',
        params:data,
        showload:true
    }),

    // biaozhundizhiSearch:data => request({
    //     url: '/sc/standardAddress/search',
    //     method: 'get',
    //     params:data,
    //     showload:true
    // }),

    biaozhundizhiSearch:data => request({
        url: '/sc/address/search',
        method: 'get',
        params:data,
        showload:true
    }),

    // //一标四实/实有人口/选择已有住址/旧
    // biaozhundizhiResidenceSearch:data => request({
    //     url: '/sc/standardAddress/searchResidence',
    //     method: 'get',
    //     params:data,
    //     showload:true
    // }),

    //一标四实/实有人口/选择已有住址/新
    biaozhundizhiResidenceSearch:data => request({
        url: '/sc/housing/search',
        method: 'get',
        params:data,
        showload:true
    }),

    shiyourenkouSearch:data => request({
        url: '/sc/person/search',
        method: 'get',
        params:data,
        showload:true
    }),

    //实有房屋/高级检索查询
    shiyoufangwuSearch:data => request({
        url: '/sc/housing/search',
        method: 'get',
        params:data,
        showload:true
    }),
    //实有房屋 获取房屋关系
    shiyoufangwuRelationSearch:data => request({
        url: '/sc/housing/getHousingRelation',
        method: 'get',
        params:data,
        showload:true
    }),

    shiyoudanweiSearch:data => request({
        url: '/sc/company/search',
        method: 'get',
        params:data,
        showload:true
    }),

    shiyoucheliangSearch:data => request({
        url: '/sc/vehicle/search',
        method: 'get',
        params:data,
        showload:true
    }),

    renkouGetVillage:data => request({
        url: '/sc/person/getVillage',
        method: 'get',
        params:data,
        showload:true
    }),


    //实有房屋/高级搜索/获取社区
    fangwuGetVillage:data => request({
        url: '/sc/housing/getVillage',
        method: 'get',
        params:data,
        showload:true
    }),

    //实有房屋/高级搜索/获取房屋街路巷
    fangwuGjssGetSteetName:data => request({
        url: '/sc/housing/getSteetName',
        method: 'get',
        params:data,
        showload:true
    }),

    //实有房屋/高级搜索/获取房屋街路巷
    fangwuGjssGetSteetName:data => request({
        url: '/sc/housing/getSteetName',
        method: 'get',
        params:data,
        showload:true
    }),

    //实有房屋/高级搜索/获取小区
    fangwuGjssGetNeiborhoodName:data => request({
        url: '/sc/housing/getNeiborhoodName',
        method: 'get',
        params:data,
        showload:true
    }),
    //实有房屋/高级搜索/获取楼栋
    fangwuGjssGetBuilding:data => request({
        url: '/sc/housing/getBuilding',
        method: 'get',
        params:data,
        showload:true
    }),
    //实有房屋/高级搜索/获取单元
    fangwuGjssGetUnit:data => request({
        url: '/sc/housing/getUnit',
        method: 'get',
        params:data,
        showload:true
    }),
    //实有房屋/高级搜索/获取楼层
    fangwuGjssGetFloor:data => request({
        url: '/sc/housing/getFloor',
        method: 'get',
        params:data,
        showload:true
    }),

    danweiGetVillage:data => request({
        url: '/sc/company/getVillage',
        method: 'get',
        params:data,
        showload:true
    }),

    dizhiGetVillage:data => request({
        url: '/sc/standardAddress/getVillage',
        method: 'get',
        params:data,
        showload:true
    }),

    //实有房屋/keyword查询
    multiTypeKeySearch:data => request({
        url: '/sc-search/multiSearch/search',
        method: 'get',
        params:data,
        showload:true
    }),


    // //一标四实新增人口/旧
    // shiyourenkouNewPerson:data => request({
    //     url: '/sc/person/add',
    //     method: 'post',
    //     data,
    //     showload:true
    // }),

    //一标四实新增人口/新
    shiyourenkouNewPerson:data => request({
        url: '/sc/person/addPersonAndRelation',
        method: 'post',
        data,
        showload:true
    }),

     //更新人口
     renkouModify:data => request({
        url: '/sc/person/update/',
        method: 'put',
        data,
        showload:true
    }),

     //一标四实/实有人口/删除
     shiyourenkouDelete:data => request({
        url: '/sc/person/delete',
        method: 'DELETE',
        params:data,
        showload:false
    }),

    //一标四实新增房屋
    shiyoufangwuNewfangwu:data => request({
        url: '/sc/housing/add',
        method: 'post',
        data,
        showload:true
    }),
    // 房屋详情查询房屋人口
    fangwuDetailsPersonInHouseSearch:data => request({
        url: '/sc/housing/personInHouse',
        method: 'get',
        params:data,
        showload:true
    }),

    //房屋录入获取ID
    fangwuInsertGetID:data => request({
        url: '/sc/base/getId',
        method: 'get',
        params:data,
        showload:true
    }),

     //更新房屋
     fangwuModify:data => request({
        url: '/sc/housing/update/',
        method: 'put',
        data,
        showload:true
    }),

    //一标四实/实有房屋/录入获取门楼号
    fangwuGetAddrNo:data => request({
        url: '/sc/standardAddress/getAddrNo',
        method: 'get',
        params:data,
        showload:false
    }),

    //一标四实/实有房屋/录入获取楼栋号
    fangwuGetBuildingNo:data => request({
        url: '/sc/standardAddress/getBuildingNo',
        method: 'get',
        params:data,
        showload:false
    }),

    //一标四实/实有房屋/录入获取单元号
    fangwuGetUnitNo:data => request({
        url: '/sc/standardAddress/getUnitNo',
        method: 'get',
        params:data,
        showload:false
    }),

    //一标四实/实有房屋/录入获取楼层号
    fangwuGetFloorNo:data => request({
        url: '/sc/standardAddress/getFloorNo',
        method: 'get',
        params:data,
        showload:false
    }),

    //一标四实/实有房屋/录入获取户号
    fangwuGetRoomNo:data => request({
        url: '/sc/standardAddress/getRoomNo',
        method: 'get',
        params:data,
        showload:false
    }),

    //一标四实新增车辆
    shiyoucheliangNewche:data => request({
        url: '/sc/vehicle/add',
        method: 'post',
        data,
        showload:true
    }),

    //一标四实/实有车辆/删除
    shiyoucheliangDelete:data => request({
        url: '/sc/vehicle/delete',
        method: 'DELETE',
        params:data,
        showload:false
    }),


    //一标四实新增单位
    shiyoudanweiNewDanwei:data => request({
        url: '/sc/company/add',
        method: 'post',
        data,
        showload:true
    }),
    //一标四实/实有单位/删除
    shiyoudanweiDelete:data => request({
        url: '/sc/company/delete',
        method: 'DELETE',
        params:data,
        showload:false
    }),

    // 单位详情查询单位人口
    danweiDetailsPersonInCompany:data => request({
        url: '/sc/company/personInCompany',
        method: 'get',
        params:data,
        showload:true
    }),
   
    //一标四实/统计信息-总体统计
    yibiaosishiGetAllData:data => request({
        url: '/sc/statistics/oneStandardFourEntity',
        method: 'get',
        params: data,
        showload:true
    }),
    //一标四实/统计信息-实有人口
    yibiaosishiGetRKData: data => request({
        url: '/sc/statistics/oneStandardFourEntity/personRegion',
        method: 'get',
        params: data,
        showload:true
    }),
    //一标四实/统计信息-实有车辆
    yibiaosishiGetCLData: data => request({
        url: '/sc/statistics/oneStandardFourEntity/vehicleRegion',
        method: 'get',
        params:data,
        showload:true
    }),
    //一标四实/统计信息-实有房屋
    yibiaosishiGetFWData: data => request({
        url: '/sc/statistics/oneStandardFourEntity/houseUseage',
        method: 'get',
        params: data,
        showload:true
    }),

    //一标四实/房屋统计
    yibiaosishiFangwuCount:data => request({
        url: '/sc/housing/getAllCount',
        method: 'get',
        params:data,
        showload:false
    }),

    //一标四实/人口统计
    yibiaosishiRenkouCount:data => request({
        url: '/sc/person/getAllCount',
        method: 'get',
        params:data,
        showload:false
    }),

    //一标四实/单位统计
    yibiaosishiDanweiCount:data => request({
        url: '/sc/company/getAllCount',
        method: 'get',
        params:data,
        showload:false
    }),

    //一标四实/车辆统计
    yibiaosishiCheliangCount:data => request({
        url: '/sc/vehicle/getAllCount',
        method: 'get',
        params:data,
        showload:false
    }),

    //一标四实/地址统计
    yibiaosishiDizhiCount:data => request({
        url: '/sc/standardAddress/getAllCount',
        method: 'get',
        params:data,
        showload:false
    }),

     //更新地址
     bzdzModify:data => request({
        url: '/sc/standardAddress/update/',
        method: 'put',
        data,
        showload:true
    }),

    //一标四实/标准地址/获取行政区划
    bzdzGetcounty:data => request({
        url: '/sc/region/county',
        method: 'get',
        params: data,
        showload: false
    }),

    //一标四实/标准地址/查询乡镇
    bzdzGettown:data => request({
        url: '/sc/region/town',
        method: 'get',
        params: data,
        showload: false
    }),

    //一标四实/标准地址/查询街道社区
    bzdzGetstreet:data => request({
        url: '/sc/region/village',
        method: 'get',
        params:data,
        showload:false
    }),

    //一标四实/标准地址/查询街道社区（新）
    bzdzGetVillage:data => request({
        url: '/sc/region/village',
        method: 'get',
        params:data,
        showload:false
    }),

    //一标四实/标准地址/获取上级地址
    bzdzGetupperAddr:data => request({
        url: '/sc/region/search',
        method: 'get',
        params:data,
        showload:false
    }),

    //一标四实/标准地址/获取派出所
    bzdzSearchpoliceStation:data => request({
        url: '/sc/policeStation/getByRegion',
        method: 'get',
        params:data,
        showload:false
    }),

    //一标四实/标准地址/查询社区
    bzdzGetcommunity:data => request({
        url: '/sc/standardAddress/getCommunity',
        method: 'get',
        params:data,
        showload:false
    }),

    //一标四实/标准地址/查询派出所
    bzdzGetPoliceStation:data => request({
        url: '/sc/standardAddress/getPoliceStation',
        method: 'get',
        params:data,
        showload:false
    }),

    //一标四实/标准地址/条件查询派出所
    bzdzGetPoliceStationByID:data => request({
        url: '/sc/policeStation/search',
        method: 'get',
        params:data,
        showload:false
    }),

    //一标四实新增地址
    // standardAddressNew:data => request({
    //     url: '/sc/standardAddress/add',
    //     method: 'post',
    //     data,
    //     showload:true
    // }),

    //一标四实/标准地址/新增地址(改)
    standardAddressNew:data => request({
        url: '/sc/address/batchAdd',
        method: 'post',
        data,
        showload:true
    }),

    //一标四实/标准地址/查看详情
    bzdzGetDetails:data => request({
        url: '/sc/standardAddress/getDetail',
        method: 'get',
        params:data,
        showload:false
    }),

    //一标四实/标准地址/获取楼栋信息
    bzdzGetAddrStructure:data => request({
        url: '/sc/address/getAddrStructure',
        method: 'get',
        params:data,
        showload:false
    }),

     //一标四实/标准地址/获取单元结构
     bzdzGetUnitStructure:data => request({
        url: '/sc/address/getUnitStructure',
        method: 'get',
        params:data,
        showload:false
    }),

    //一标四实/标准地址/删除
    bzdzDeleteAddr:data => request({
        url: '/sc/address/delete',
        method: 'DELETE',
        params:data,
        showload:false
    }),

    bzdzModifyBaseAddr:data => request({
        url: '/sc/address/modifyBaseAddress',
        method: 'PUT',
        data,
        showload:false
    }), 

     //视频监控-查询监控
     getSpjk:data => request({
        // url: '/hik8200-adapter/remoteControlUnit/findControlUnitByUnitCode',
        url: '/hik8200-adapter/commonCameraInfo/findCameraInfoPage',
        method: 'get',
        params:data,
        showload:true
    }),

    //修改爪机信息（人员）
    updateZjxx:data => request({
        // url: '/hik8200-adapter/remoteControlUnit/findControlUnitByUnitCode',
        url: '/hik8200-adapter/faceCamera/modifyFaceCamera',
        method: 'PUT',
        params:data,
        showload:true
    }),


    //多维档案
    getDwda:data => request({
        url: '/sc/comprehensive/getArchives',
        method: 'get',
        params:data,
        showload:true
    }),
    //查询人卡口
    getRyKakou:data => request({
        // url: '/hik8200-adapter/remoteControlUnit/findControlUnitByUnitCode',
        url: '/hik8200-adapter/faceCamera/findFaceCameraPage',
        method: 'get',
        params:data,
        showload:true
    }),

    //查询车辆卡口
    getClKakou:data => request({
        // url: '/hik8200-adapter/remoteControlUnit/findControlUnitByUnitCode',
        url: '/hik8200-adapter/vehicleBaseResource/findVehicleControlUnitPage',
        method: 'get',
        params:data,
        showload:true
    }),


    //综合作战图层
    //人脸卡口
   
    //派出所
    getPcs:data => request({
        url: '/sc/comprehensive/getAllPoliceStation',
        method: 'get',
        params:data,
        showload:true
    }),
    //综合作战图层

     //车辆轨迹
     getClguiji:data => request({
        url: '/hik8200-adapter/vehiclePass/searchMotorVehicles',
        method: 'get',
        params:data,
        showload:true
    }),
    
    //一标四实
    getYbss:() => request({
        url: '/sc/statistics/communityInfo',
        method: 'get',
        showload:true
    }),

    //重点人员
    getZdryData:() => request({
        url: '/sc/specialPerson/communityInfo',
        method: 'get',
        showload:true
    }),


     //一标四实
     getZdry:() => request({
        url: '/sc/specialPerson/countByCommunity',
        method: 'get',
        showload:true
    }),


    //重点人员/统计信息
    GetZdryTjData:() => request({
        url: '/sc/specialPerson/countByType',
        method: 'get',
        showload:true
    }),
    //重点人员/重点人员查询
    GetZdryCx:(data) => request({
        url: '/sc/specialPerson/search',
        method: 'get',
        params:data,
        showload:true
    }),
     //重点人员/重点人员详情查询
    GetZdryXqCx:(data) => request({
        url: '/sc/specialPerson/getOneDetail',
        method: 'get',
        params:data,
        showload:true
    }),

     //重点人员/人员预警
     GetZdryYj:(data) => request({
        url: '/sc/specialTask/getDeadlineOut',
        method: 'get',
        params:data,
        showload:true
    }),
     //重点人员/更新重点人员任务
    UpdateZdryRw:(data) => request({
        url: '/sc/specialTask/update',
        method: 'PUT',
        data,
        showload:true
    }),



    //  //一标四实
    // //一标四实/统计信息-实有人口（小区）
    // getSyrk:() => request({
    //     url: '/sc/statistics/oneStandardFourEntity/personCommunity',
    //     method: 'get',
    //     showload:true
    // }),
    // //一标四实/统计信息-实有车辆（小区）
    // getSycl:() => request({
    //     url: '/sc/statistics/oneStandardFourEntity/vehicleCommunity',
    //     method: 'get',
    //     showload:true
    // }),
    // //一标四实/统计信息-实有房屋（小区）
    // getSyfw:() => request({
    //     url: '/sc/statistics/oneStandardFourEntity/houseUseageCommunity',
    //     method: 'get',
    //     showload:true
    // }),

    //警务首页
    getSheBeiData:data => request({
        url: '/sc/device/getCount',
        method: 'get',
        params:data,
        showload:false
    }),

      //警务首页/获取警务
    getPoliceCount:data => request({
        url: '/sc/policeResource/getCount',
        method: 'get',
        params:data,
        showload:false
    }),  

      //警务首页/获取事件
      getPoliceEvents:data => request({
        url: '/sc/event/getAllEvents',
        method: 'get',
        params:data,
        showload:false
    }),  

    //警务首页/特殊关爱人群统计
    getPoliceCareCount:data => request({
        url: '/sc/person/getCareCount',
        method: 'get',
        params:data,
        showload:false
    }),  

    //警务首页/民族统计
    getPoliceNationCount:data => request({
        url: '/sc/person/getNationCount',
        method: 'get',
        params:data,
        showload:false
    }),  

    //警务首页/流动人口分布统计
    getPoliceFloatCount:data => request({
        url: '/sc/person/getFloatCount',
        method: 'get',
        params:data,
        showload:false
    }),  

    //警务首页/重点人员统计
    getPoliceSpecialCount:data => request({
        url: '/sc/person/getSpecialCount',
        method: 'get',
        params:data,
        showload:false
    }),  

    //事件管理/事件查询
    getAllEvents:data => request({
        url: '/sc/event/getAllEvents',
        method: 'get',
        params:data,
        showload:false
    }), 
    
    //事件管理/事件查询/获取事件详情
    getEventDetails:(id)=> request({
        url: '/sc/event/getMoredetails/'+id,
        method: 'get',
        showload:false
    }),  

     //事件管理/事件查询/获取事件资源详情
     getEventZyDetails:(id)=> request({
        url: '/sc/event/getOneEvensResourceDetails/'+id,
        method: 'get',
      
        showload:false
    }),  

    //事件总览/获取事件状态
    getEventstatus:data => request({
        url: '/sc/eventStatistc/getCountGroupByStatus',
        method: 'get',
        params:data,
        showload:false
    }),  
    //事件总览/辖区事件统计
    getEventxqsjCount:data => request({
        url: '/sc/eventStatistc/getCountByArea',
        method: 'get',
        params:data,
        showload:false
    }),  
    //事件总览/企业排污情况分类占比
    getEventxqsjflCount:data => request({
        url: '/sc/eventStatistc/getStatisticByTypeAndArea',
        method: 'get',
        params:data,
        showload:false
    }),    
    
     //事件总览/事件分类占比
     getEventflzbCount:data => request({
        url: '/sc/eventStatistc/getPercentByType',
        method: 'get',
        params:data,
        showload:false
    }), 

    //事件总览/ 排污超标事件趋势
    getEventsjTrend:data => request({
        url: '/sc/eventStatistc/getTrendByMonth',
        method: 'get',
        params:data,
        showload:false
    }), 

    //事件总览/企业排污时间段统计
    getEventsfsjdCount:data => request({
        url: '/sc/eventStatistc/getStatisticByTime',
        method: 'get',
        params:data,
        showload:false
    }),  

    //事件总览/排污超标事件同比环比
    getEventszasjCompare:data => request({
        url: '/sc/eventStatistc/getCompareStatistic',
        method: 'get',
        params:data,
        showload:false
    }), 
    
     //工作台 数据统计查询
     getWorkBenchCount:() => request({
        url: '/sc/workBench/getCount',
        method: 'get',
        showload: false
    }), 

    //工作台 分页查询数据
    getWorkBench:data => request({
        url: '/sc/workBench/find',
        method: 'get',
        params: data,
        showload:false
    }), 
    //工作台 记录与更新消息阅读状态及是否转为事项
    addAndModifyWorkBench:data => request({
        url: '/sc/workBench/addAndModify',
        method: 'post',
        data,
        showload:false
    }), 
    //工作台 标记为已完成
    finishWorkBenchEvents:data => request({
        url: '/sc/workBench/complete',
        method: 'put',
        data,
        showload: false
    }), 
    //工作台 重点人员详情查询
    getPersonTaskDetail:data => request({
        url: '/sc/workBench/getPersonTaskDetail?id='+data,
        method: 'get',
        showload:false
    }), 
    //工作台 事件详情查询
    getEventsDetail:data => request({
        url: '/sc/workBench/getEventsDetail?id='+data,
        method: 'get',
        showload:false
    }), 
    //工作台 待办事项文件上传
    uploadEventsFile:data => request({
        url: '/sc/workBench/uploadFile',
        method: 'post',
        data,
        showload:false
    }), 
    
    //工作台 查询待办事项流
    getEventsFlows:data => request({
        url: '/sc/itemFlow/search',
        method: 'get',
        params: data,
        showload:false
    }), 
    //工作台 添加待办事项操作流
    addEventsFlows:data => request({
        url: '/sc/itemFlow/add',
        method: 'post',
        data,
        showload:false
    }), 
    //工作台 更新单个任务描述
    updateSxDesc:data => request({
        url: '/sc/specialTask/updateOneTask',
        method: 'put',
        data,
        showload:false
    }), 
    
    //工作台 删除附件
    deleteGztFile:data => request({
        url: '/sc/workBench/deleteFile?fileUrl='+data.fileUrl+'&objectId='+data.objectId+'&itemType='+data.itemType,
        method: 'DELETE',
        showload:false
    }), 

     //工作台 根据preplanId和cameraIndexCode查询附件和备注
     getSpjkZy:data => request({
        url: '/hik8200-adapter/commonCameraInfo/findCameraPreplanExtraInfo',
        method: 'get',
        params:data,
        showload:true
    }),

    
 
}
