export const eventCollection = {
  // CHANGE_MENU_EXPAPND: 'changeMenuExpand',
  EXCONTROL_GET_SELECTED_CAKOU:'excontrolGetSelectedKakou',
  UPDATE_DETAILS_DATA:'updateDetailsData',
  SWITCH_EDIT_DETAILS:'switchEditDetails',
  EXCONTROL_GET_SELECTED_LOCALNAME: '_excontrol_get_selected_localname_',

  // 设备数据
  EXCONTROL_GET_SELECTED_SHEBEI: 'excontrol_get_selected_shebei',

  //传输卡口数据
  _bmap_transKakou:'bmap_transKakou',
  //卡口树列表和地图卡口的交互（选中卡口）
   _bmap_tree2map:'bmap_tree2map',
   _bmap_map2tree:'bmap_map2tree',
  
    //点击卡口
   _bmap_treeclick2map:'bmap_treeclick2map',
   _bmap_treedoubleclick2map:'bmap_treedoubleclick2map',

   _closeShipinDialog: 'close_shipin_dialog',

   //告警列表数据和地图告警的交互
   _gaojingliebiao2map:'gaojingliebiao2map',
   _map2gaojingliebiao:'map2gaojingliebiao',

  //  //列表(卡口，告警)数据和地图交互
  //  _liebiao2map:'liebiao2map',
  //  _map2liebiao:'map2liebiao',

   //时空分析列表(案件分析)数据和地图交互
   _anjian2map:'anjian2map',

    //综合联防轨迹显示到地图
    _guiji2map:'guiji2map',
    //轨迹显示
    PASSWAY_SHOW_HISLINE: "show_hisline",

    //一标四实联动右侧统计
    _map2ybsstj:'_map2ybsstj',


    //视频监控-搜藏
    _bmap_collectionTree2map:'bmap_collectionTree2map',
    
     //视频监控-筛选
     _bmap_organnizationTreeSearch2map:'bmap_organnizationTreeSearch2map',

      //工作台预案点击-->获取当前操作记录和资源
      _yuan2gongzuotai:'yuan2gongzuotai',
     

   dragTree: 'dragtreedata',
   EXCONTROL_GET_SELECTED_ORGANIZATION: 'excontrolGetSelectedOrganization',
   //视频监控 收藏和预案
   EVENT_ADD_COLLECTION: 'eventAddCollection',
   EVENT_ADD_COLLECTION_GROUP: 'eventAddCollectionGroup',
   EVENT_PLAY_COLLECTION_CAMERA: 'eventPlayCollectionCamera',
   EVENT_ADD_YUAN: 'event_add_yuan',
   EVENT_ADD_YUAN_GROUP: 'event_add_yuan_group',

   //案件录入资源数据传递到父组件
   _UPLOADDATALIST_: '_uploaddatalist_',
   _UPDATE_XIANGGUAN_DATA_: '_update_xiangguan_data_',
   _UPDATE_XIANGGUANEVENT_DATA_: '_update_xiangguanevent_data_',
   _XIANGGUAN_EVENT_LIST_: '_xiangguan_event_list_',
   _XIANGGUAN_EVENT_DATA_: '_xiangguan_event_data_',
   _CLOSE_EDITEVENT_DIALOG: '_close_editevent_dialog',

   //综治联防
   SEARCH_MANBY_IMG: 'search_manby_img',
   SEARCH_AUTOBY_IMG: 'search_autoby_img',
   selectpersonimage: '_selectpersonimage_',
   tjsearchpepole: '_tjsearchpepole_',



   //特定地图maker触发 自定义弹出框

   _mapMaker2Pop:'mapMaker2Pop',


   _mapMaker2mapMakerPop:'mapMaker2mapMakerPop',


   //实时监测 定位刷新(点击地图刷新右侧)
   _positionRefresh:'positionRefresh',
  //实时监测 定位刷新(点击右侧刷新地图)
   _selectPositionRefresh:'selectPositionRefresh',

   _pointer_status_now: '_pointerStatusNow_',
   _positionWarningRefresh: '_positionWarningRefresh',
   //推送排污告警信息更新地图
   _getWarningRefresh: '_getWarningRefresh',


   //长链接推送——企业信息（包括传感器）
   _qyMQ: '_qyMQ',

   playVideoWeb: '_playVideoWeb_',
   //企业状态选择
   _qyStatus: '_qyStatus',


    //推送了设备新状态，点位状态也改变
    _pointRefresh: '_pointRefresh',



}
