import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/',component: () => import('@/views/login/index'), hidden: true },
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
]

export default new Router({
  mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
    // {
    //   path: '/dashboard',
    //   component: Layout,
    //   name: '首页',
    //   meta: { title: '首页',icon: 'home',roles: ['jianguan','home']},
    //   // hidden: true,
    //   children: [{
    //     path: 'home',
    //     component: () => import('@/views/dashboard/home'),
    //     meta: { title: '首页',roles: ['jianguan','home']}
    //   }]
    // },
    // {
    //   path: '/dashboard',
    //   component: Layout,
    //   name: '首页',
    //   meta: { title: '首页',icon: 'home',roles: ['shome']},
    //   // hidden: true,
    //   children: [{
    //     path: 'shome',
    //     component: () => import('@/views/dashboard/shome'),
    //     meta: { title: '首页',roles: ['shome']}
    //   }]
    // },
    // {
    //   path: '/dashboard',
    //   component: Layout,
    //   name: '首页',
    //   meta: { title: '首页',icon: 'home',roles: ['police', 'whome']},
    //   // hidden: true,
    //   children: [{
    //     path: 'whome',
    //     component: () => import('@/views/dashboard/whome'),
    //     meta: { title: '首页',roles: ['police', 'whome']}
    //   }]
    // },
    // {
    //   path: '/yibiaosishi',
    //   component: Layout,
    //   redirect: 'noredirect', 
    //   name: 'yibiaosishi',
    //   meta: { title: '基础信息', icon: 'yibiaosishi',roles: ['police', 'tongjixinxi', 'biaozhundizhi', 'shiyoufangwu', 'shiyourenkou', 'shiyoudanwei', 'shiyoucheliang']},
    //   children: [
    //     {
    //       path: 'tongjixinxi',
    //       name: 'tongjixinxi',
    //       component: () => import('@/views/yibiaosanshi/tongjixinxi'),
    //       meta: { title: '统计信息',roles: ['police', 'tongjixinxi'] }
    //     },
    //     {
    //       path: 'biaozhundizhi',
    //       name: 'biaozhundizhi',
    //       component: () => import('@/views/yibiaosishi/biaozhundizhi/biaozhundizhi'),
    //       meta: { title: '标准地址',roles: ['police', 'biaozhundizhi']}
    //     },
    //     {
    //       path: 'shiyoufangwu',
    //       name: 'shiyoufangwu',
    //       component: () => import('@/views/yibiaosishi/shiyoufangwu/shiyoufangwu'),
    //       meta: { title: '实有房屋',roles: ['police', 'shiyoufangwu']}
    //     },
    //     {
    //       path: 'shiyourenkou',
    //       name: 'shiyourenkou',
    //       component: () => import('@/views/yibiaosishi/shiyourenkou/shiyourenkou'),
    //       meta: { title: '实有人口',roles: ['police', 'shiyourenkou']}
    //     },        
    //     {
    //       path: 'shiyoudanwei',
    //       name: 'shiyoudanwei',
    //       component: () => import('@/views/yibiaosishi/shiyoudanwei/shiyoudanwei'),
    //       meta: { title: '实有单位',roles: ['police', 'shiyoudanwei']}
    //     },
    //     {
    //       path: 'shiyoucheliang',
    //       name: 'shiyoucheliang',
    //       component: () => import('@/views/yibiaosishi/shiyoucheliang/shiyoucheliang'),
    //       meta: { title: '实有车辆',roles: ['police', 'shiyoucheliang']}
    //     },
    //     {
    //       path: 'renyuanxiangqing',
    //       name: 'renyuanxiangqing',
    //       component: () => import('@/views/yibiaosishi/shiyourenkou/DetailsRenkou'),
    //       hidden: true,
    //       meta: { title: '人口详情'}
    //     },
    //     {
    //       path: 'fangwuxiangqing',
    //       name: 'fangwuxiangqing',
    //       component: () => import('@/views/yibiaosishi/shiyoufangwu/DetailsFangwu'),
    //       hidden: true,
    //       meta: { title: '房屋详情'}
    //     },
    //     {
    //       path: 'danweixiangqing',
    //       name: 'danweixiangqing',
    //       component: () => import('@/views/yibiaosishi/shiyoudanwei/DetailsDanwei'),
    //       hidden: true,
    //       meta: { title: '单位详情'}
    //     },
    //     {
    //       path: 'cheliangxiangqing',
    //       name: 'cheliangxiangqing',
    //       component: () => import('@/views/yibiaosishi/shiyoucheliang/DetailsCheliang'),
    //       hidden: true,
    //       meta: { title: '车辆详情'}
    //     },
    //   ]
    // }, 
    // {
    //   path: '/zhongdianrenyuan',
    //   component: Layout,
    //   redirect: 'noredirect', 
    //   name: 'zhongdianrenyuan',
    //   meta: { title: '重点人员', icon: 'zhongdianrenyuan',roles: ['police', 'zhongdianrenyuan']},
    //   children: [
    //     {
    //       path: 'zhongdianrenyuan',
    //       name: 'zhongdianrenyuan',
    //       component: () => import('@/views/zhongdianrenyuan/zhongdianrenyuan'),
    //       meta: { title: '重点人员',roles: ['police', 'zhongdianrenyuan'] }
    //     },
    //   ]
    // },
  //   {
  //   path: '/shipinjiankong',
  //   component: Layout,
  //   redirect: 'noredirect', 
  //   name: 'shipinjiankong',
  //   meta: { title: '重要场所', icon: 'shipinjiankong',roles: ['police', 'shipinjiankong']},
  //   children: [
  //     {
  //       path: 'shipinjiankong',
  //       name: 'shipinjiankong',
  //       component: () => import('@/views/shipinjiankong/shipinjiankong/shipinjiankong'),
  //       meta: { title: '视频监控',roles: ['police', 'shipinjiankong'] }
  //     },
  //     // {
  //     //   path: 'luxiangjiansuo',
  //     //   name: 'luxiangjiansuo',
  //     //   component: () => import('@/views/shipinjiankong/luxiangjiansuo/luxiangjiansuo'),
  //     //   meta: { title: '录像检索',roles: ['police', 'admin','property', 'police'] }
  //     // }
  //   ]
  // },
  // {
  //   path: '/bukongguanli',
  //   component: Layout,
  //   redirect: 'noredirect', 
  //   name: 'bukongguanli',
  //   meta: { title: '布控管理', icon: 'bukongguanli',roles: ['admin', 'police'] },
  //   children: [
  //     {
  //       path: 'bukongguanli',
  //       name: 'bukongguanli',
  //       component: () => import('@/views/bukongguanli/bukongguanli/bukongguanli'),
  //       meta: { title: '布控管理',roles: ['admin', 'police'],isBack: false},
  //     },
  //     {
  //       path: 'addrycontrol',
  //       name: 'addrycontrol',
  //       component: () => import('@/views/bukongguanli/bukongguanli/AddControl'),
  //       hidden: true,
  //       meta: { title: '新增人员布控',roles: ['admin', 'police'],addtype: 'ry'}
  //     },
  //     {
  //       path: 'addchecontrol',
  //       name: 'addchecontrol',
  //       component: () => import('@/views/bukongguanli/bukongguanli/AddCheControl'),
  //       hidden: true,
  //       meta: { title: '新增车辆布控',roles: ['admin', 'police'],addtype: 'che'}
  //     },
  //     {
  //       path: 'bukongxiangqing',
  //       name: 'bukongxiangqing',
  //       component: () => import('@/views/bukongguanli/bukongguanli/DetailsControl'),
  //       hidden: true,
  //       meta: { title: '布控详情',roles: ['admin', 'police']}
  //     }
  //   ]
  // },
  // {
  //   path: '/zhinenggaojing',
  //   component: Layout,
  //   redirect: 'noredirect', 
  //   name: 'zhinenggaojing',
  //   meta: { title: '布控告警', icon: 'zhinenggaojing',roles: ['police', 'bukongguanli', 'shishigaojing', 'gaojingjiansuo']},
  //   children: [
  //     {
  //       path: 'bukongguanli',
  //       name: 'bukongguanli',
  //       component: () => import('@/views/bukongguanli/bukongguanli/bukongguanli'),
  //       meta: { title: '布控管理',roles: ['police', 'bukongguanli'],isBack: false},
  //     },
  //     {
  //       path: 'addrycontrol',
  //       name: 'addrycontrol',
  //       component: () => import('@/views/bukongguanli/bukongguanli/AddControl'),
  //       hidden: true,
  //       meta: { title: '新增人员布控',addtype: 'ry'}
  //     },
  //     {
  //       path: 'addchecontrol',
  //       name: 'addchecontrol',
  //       component: () => import('@/views/bukongguanli/bukongguanli/AddCheControl'),
  //       hidden: true,
  //       meta: { title: '新增车辆布控',addtype: 'che'}
  //     },
  //     {
  //       path: 'bukongxiangqing',
  //       name: 'bukongxiangqing',
  //       component: () => import('@/views/bukongguanli/bukongguanli/DetailsControl'),
  //       hidden: true,
  //       meta: { title: '布控详情'}
  //     },
  //     {
  //       path: 'shishigaojing',
  //       name: 'shishigaojing',
  //       component: () => import('@/views/zhinenggaojing/shishigaojing/shishigaojing'),
  //       meta: { title: '实时告警',roles: ['police', 'shishigaojing']}
  //     },
  //     {
  //       path: 'gaojingjiansuo',
  //       name: 'gaojingjiansuo',
  //       component: () => import('@/views/zhinenggaojing/gaojingjiansuo/gaojingjiansuo'),
  //       meta: { title: '告警检索',roles: ['police', 'gaojingjiansuo']}
  //     }
  //   ]
  // },
  // {
  //   path: '/wuyefuwu',
  //   component: Layout,
  //   redirect: 'noredirect', 
  //   name: 'wuyefuwu',
  //   meta: { title: '物业服务', icon: 'wuyefuwu',roles: ['baoxiufuwu', 'tousuguanli']},
  //   children: [
  //     {
  //       path: 'baoxiufuwu',
  //       name: 'baoxiufuwu',
  //       component: () => import('@/views/wuyefuwu/baoxiufuwu/baoxiufuwu'),
  //       meta: { title: '报修服务',roles: ['baoxiufuwu'] }
  //     },
  //     {
  //       path: 'tousuguanli',
  //       name: 'tousuguanli',
  //       component: () => import('@/views/wuyefuwu/tousuguanli/tousuguanli'),
  //       meta: { title: '投诉管理',roles: ['tousuguanli']}
  //     },
  //   ]
  // }, 
  // {
  //   path: '/wuyeguanli',
  //   component: Layout,
  //   redirect: 'noredirect', 
  //   name: 'wuyeguanli',
  //   meta: { title: '物业管理', icon: 'wuyeguanli',roles: ['wuyeguanli', 'kapianguanli', 'menjinshouquan']},
  //   children: [
  //     {
  //       path: 'wuyeguanli',
  //       name: 'wuyeguanli',
  //       component: () => import('@/views/wuyeguanli/wuyeguanli'),
  //       meta: { title: '物业管理',roles: ['wuyeguanli']}
  //     },
  //     {
  //       path: 'kapianguanli',
  //       name: 'kapianguanli',
  //       component: () => import('@/views/wuyeguanli/kapianguanli/kapianguanli'),
  //       meta: { title: '卡片管理',roles: ['kapianguanli']}
  //     },
  //     {
  //       path: 'menjinshouquan',
  //       name: 'menjinshouquan',
  //       component: () => import('@/views/wuyeguanli/menjinshouquan/menjinshouquan'),
  //       meta: { title: '门禁授权',roles: ['menjinshouquan']}
  //     },
  //   ]
  // },
  // {
  //   path: '/zhinengyujing',
  //   component: Layout,
  //   redirect: 'noredirect', 
  //   name: 'zhinengyujing',
  //   meta: { title: '智能预警', icon: 'zhinengyujing',roles: ['zhinengyujing']},
  //   children: [
  //     {
  //       path: 'zhinengyujing',
  //       name: 'zhinengyujing',
  //       // component: () => import('@/views/zhinengyujing/zhinengyujing'),
  //       meta: { title: '智能预警',roles: ['zhinengyujing']}
  //     },
  //   ]
  // },
  // {
  //   path: '/xiaoquchaxunjiansuo',
  //   component: Layout,
  //   redirect: 'noredirect', 
  //   name: 'xiaoquchaxunjiansuo',
  //   meta: { title: '查询检索', icon: 'search',roles: ['xiaoquchaxunjiansuo'] },
  //   children: [
  //     {
  //       path: 'chaxunjiansuo',
  //       name: 'chaxunjiansuo',
  //       component: () => import('@/views/xiaoquchaxunjiansuo/chaxunjiansuo'),
  //       meta: { title: '查询检索',roles: ['xiaoquchaxunjiansuo'] }
  //     }
  //   ]
  // },
  // {
  //   path: '/shikongfenxi',
  //   component: Layout,
  //   redirect: 'noredirect', 
  //   name: 'shikongfenxi',
  //   meta: { title: '时空分析', icon: 'position',roles: ['ziyuancaozuo', 'shikongfenxiguanli']},
  //   children: [
  //     {
  //       path: 'ziyuancaozuo',
  //       name: 'ziyuancaozuo',
  //       component: () => import('@/views/shikongfenxi/ziyuancaozuo/ziyuancaozuo'),
  //       meta: { title: '资源操作',roles: ['ziyuancaozuo'] }
  //     },
  //     {
  //       path: 'shikongfenxiguanli',
  //       name: 'shikongfenxiguanli',
  //       component: () => import('@/views/shikongfenxi/shikongfenxiguanli/shikongfenxi'),
  //       meta: { title: '时空分析',roles: ['shikongfenxiguanli']}
  //     },
  //   ]
  // },
  // {
  //   path: '/anjianguanli',
  //   component: Layout,
  //   redirect: 'noredirect', 
  //   name: 'anjianguanli',
  //   meta: { title: '案件管理', icon: 'manage',roles: ['anjianzonglan', 'anjianluru']},
  //   children: [
  //     {
  //       path: 'anjianzonglan',
  //       name: 'anjianzonglan',
  //       component: () => import('@/views/anjianguanli/anjianzonglan/anjianzonglan'),
  //       meta: { title: '案件总览',roles: ['anjianzonglan'] }
  //     },
  //     {
  //       path: 'anjianluru',
  //       name: 'anjianluru',
  //       component: () => import('@/views/anjianguanli/anjianluru/anjianluru'),
  //       meta: { title: '案件录入',roles: ['anjianluru']}
  //     },
  //     {
  //       path: 'addanjian',
  //       name: 'addanjian',
  //       component: () => import('@/views/anjianguanli/anjianluru/AddAnjian'),
  //       hidden: true,
  //       meta: { title: '添加案件'}
  //     },
  //   ]
  // },
  
  // {
  //   path: '/bukongjiansuo',
  //   component: Layout,
  //   redirect: 'noredirect', 
  //   name: 'bukongjiansuo',
  //   meta: { title: '检索查询', icon: 'search',roles: ['admin', 'police'] },
  //   children: [
  //     {
  //       path: 'jiansuochaxun',
  //       name: 'jiansuochaxun',
  //       component: () => import('@/views/bukongjiansuo/jiansuochaxun'),
  //       meta: { title: '检索查询',roles: ['admin', 'police']}
  //     },
  //   ]
  // },
  // {
  //   path: '/zonghezuozhan',
  //   component: Layout,
  //   redirect: 'noredirect', 
  //   name: 'zonghezuozhan',
  //   meta: { title: '综治联防', icon: 'zonghezuozhan',roles: ['jianguan', 'zonghezuozhan'] },
  //   children: [
  //     {
  //       path: 'zonghezuozhan',
  //       name: 'zonghezuozhan',
  //       component: () => import('@/views/zonghezuozhan/zonghezuozhan'),
  //       meta: { title: '综治联防',roles: ['jianguan', 'zonghezuozhan'] }
  //     },
  //   ]
  // },
  // {
  //   path: '/zhihuizhengwu',
  //   component: Layout,
  //   redirect: 'noredirect', 
  //   name: 'zhihuizhengwu',
  //   meta: { title: '智慧政务', icon: 'zhihuizhengwu',roles: ['zhihuizhengwu']},
  //   children: [
  //     {
  //       path: 'zhihuizhengwu',
  //       name: 'zhihuizhengwu',
  //       // component: () => import('@/views/zhihuizhengwu/zhihuizhengwu'),
  //       meta: { title: '智慧政务',roles: ['zhihuizhengwu'] }
  //     },
  //   ]
  // },
  // {
  //   path: '/dangjianhuodong',
  //   component: Layout,
  //   redirect: 'noredirect', 
  //   name: 'dangjianhuodong',
  //   meta: { title: '党建活动', icon: 'dangjianhuodong',roles: ['dangjianhuodong']},
  //   children: [
  //     {
  //       path: 'dangjianhuodong',
  //       name: 'dangjianhuodong',
  //       // component: () => import('@/views/dangjianhuodong/dangjianhuodong'),
  //       meta: { title: '党建活动',roles: ['dangjianhuodong'] }
  //     },
  //   ]
  // },
  // {
  //   path: '/wanggeguanli',
  //   component: Layout,
  //   redirect: 'noredirect', 
  //   name: 'wanggeguanli',
  //   meta: { title: '网格管理', icon: 'wanggeguanli',roles: ['wanggeguanli']},
  //   children: [
  //     {
  //       path: 'wanggeguanli',
  //       name: 'wanggeguanli',
  //       // component: () => import('@/views/wanggeguanli/wanggeguanli'),
  //       meta: { title: '网格管理',roles: ['wanggeguanli'] }
  //     },
  //   ]
  // },
  // {
  //   path: '/luntanguanli',
  //   component: Layout,
  //   redirect: 'noredirect', 
  //   name: 'luntanguanli',
  //   meta: { title: '论坛管理', icon: 'luntanguanli',roles: ['luntanguanli']},
  //   children: [
  //     {
  //       path: 'luntanguanli',
  //       name: 'luntanguanli',
  //       // component: () => import('@/views/luntanguanli/luntanguanli'),
  //       meta: { title: '论坛管理',roles: ['luntanguanli'] }
  //     },
  //   ]
  // },
  // {
  //   path: '/gongzuotai',
  //   component: Layout,
  //   redirect: 'noredirect', 
  //   name: 'gongzuotai',
  //   hidden: true,
  //   meta: { title: '工作台', icon: ''},
  //   children: [
  //     {
  //       path: 'gongzuotai',
  //       name: 'gongzuotai',
  //       component: () => import('@/views/gongzuotai/gongzuotai'),
  //       meta: { title: '工作台'}
  //     },
  //   ]
  // },
  
  
  {
    path: '/shishijiance',
    component: Layout,
    redirect: 'noredirect', 
    name: 'shishijiance',
    meta: { title: '实时监测', icon: 'zaixianjiance',roles: ['jianguan', 'shipinjiankong']},
    children: [
      {
        path: 'shishijiance',
        name: 'shishijiance',
        component: () => import('@/views/shishijiance/shishijiance/shishijiance'),
        meta: { title: '实时监测',roles: ['jianguan', 'shipinjiankong'] }
      },
      
    ]
  },
  // {
  //     path: '/shipinjiankong',
  //     component: Layout,
  //     redirect: 'noredirect', 
  //     name: 'shipinjiankong',
  //     meta: { title: '视频监控', icon: 'shipinjiankong',roles: ['jianguan', 'shipinjiankong']},
  //     children: [
  //       {
  //         path: 'shipinjiankong',
  //         name: 'shipinjiankong',
  //         component: () => import('@/views/shipinjiankong/shipinjiankong/shipinjiankong'),
  //         meta: { title: '视频监控',roles: ['jianguan', 'shipinjiankong'] }
  //       },
  //     ]
  //   },
  // {
  //   path: '/shujufenxi',
  //   component: Layout,
  //   redirect: '/404', 
  //   name: 'shujufenxi',
  //   meta: { title: '数据分析', icon: 'shuju',roles: ['jianguan', 'shujufenxi']},
  //   children: [
  //     {
  //       path: 'shujufenxi',
  //       name: 'shujufenxi',
  //       component: () => import('@/views/shishijiance/shishijiance/shishijiance'),
  //       meta: { title: '数据分析',roles: ['jianguan', 'shujufenxi'] }
  //     },
      
  //   ]
  // },
  {
    path: '/shijianguanli',
    component: Layout,
    redirect: 'noredirect', 
    name: 'shijianguanli',
    meta: { title: '事件管理', icon: 'shijianguanli',roles: ['jianguan', 'shijianguanli']},
    children: [
      {
        path: 'shijianzonglan',
        name: 'shijianzonglan',
        component: () => import('@/views/shijianguanli/shijianzonglan'),
        meta: { title: '事件总览',roles: ['jianguan', 'shijianguanli'] }
      },
      {
        path: 'shijianluru',
        name: 'shijianluru',
        hidden: true,
        component: () => import('@/views/shijianguanli/shijianluru'),
        meta: { title: '事件录入'}
      },
      // {
      //   path: 'shijianchuzhi',
      //   name: 'shijianchuzhi',
      //   component: () => import('@/views/shijianguanli/shijianchuzhi'),
      //   meta: { title: '事件处置',roles: ['police', 'admin', 'police']}
      // },
      {
        path: 'shijianchaxun',
        name: 'shijianchaxun',
        hidden: true,
        component: () => import('@/views/shijianguanli/shijianchaxun'),
        meta: { title: '事件查询'}
      },
    ]
  },
  {
    path: '/bukongjiansuo',
    component: Layout,
    redirect: 'noredirect', 
    name: 'bukongjiansuo',
    meta: { title: '检索查询', icon: 'search',roles: ['jianguan', 'bukongjiansuo']},
    children: [
      {
        path: 'jiansuochaxun',
        name: 'jiansuochaxun',
        component: () => import('@/views/bukongjiansuo/zonghejiansuo'),
        meta: { title: '检索查询',roles: ['jianguan', 'bukongjiansuo']}
      },
    ]
  },
  {
    path: '/gongzuotai',
    component: Layout,
    redirect: 'noredirect', 
    name: 'gongzuotai',
    meta: { title: '工作台', icon: 'gongzuotai',roles: ['jianguan', 'gongzuotai']},
    children: [
      {
        path: 'gongzuotai',
        name: 'gongzuotai',
        component: () => import('@/views/gongzuotai/gongzuotai'),
        meta: { title: '工作台',roles: ['jianguan', 'gongzuotai'] }
      },
    ]
  },

  



  { path: '*', redirect: '/404', hidden: true },
]