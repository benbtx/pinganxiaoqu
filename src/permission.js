import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken, removeToken } from '@/utils/auth' // getToken from cookie
import { debug } from 'util';

NProgress.configure({ showSpinner: false })// NProgress Configuration

const whiteList = ['/login']// no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start(); // start progress bar
  // if (to.path == '/' || to.path == '/login') { //返回登录页，清楚之前的cookie信息（注释后刷新登录，没有手动退出则自动进入页面）
  //   removeToken();
  // }

  if (getToken()) { // determine if there has token
    /* has token*/
    // if (to.path === '/login') {
    //   next({ path: '/' })
    //   NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    // } else {
      if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(res => { // 拉取user_info,获取菜单列表
          // console.log(res.data)
          //改role为数组
          let rolearr = res;
          // let data = res.data.user;
          // for(let i=0;i<data.sysRoles.length;i++) {
          //   rolearr.push(data.sysRoles[i].code.toLowerCase());
          // }
          // if (rolearr.indexOf("community") == -1 && rolearr.indexOf("police") == -1 && rolearr.indexOf("property") == -1 && rolearr.indexOf("admin") == -1) {
          //   rolearr.push('police');
          // }
          rolearr = ['jianguan']; //临时固定赋值
          const roles = rolearr; // note: roles must be a array! such as: ['editor','develop']

          store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            let topath = '/shishijiance/shishijiance';
            if (to.path == '/dashboard' || to.path == '/login' || to.path == '/') {
              if (rolearr.indexOf("shome") != -1) {
                topath = '/dashboard/shome';
              } else if (rolearr.indexOf("whome") != -1) {
                topath = '/dashboard/whome';
              } else if (rolearr.indexOf("home") != -1) {
                topath = '/dashboard/home';
              }
              next({path: topath, replace: true});
            } else {
              next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            }
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || '权限失效, 请重新登录')
            next({ path: '/' })
          })
        })
      } else {
        next()
      }
    // }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
