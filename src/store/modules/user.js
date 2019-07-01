import { login, logout, getInfo } from '@/https/login'
import { userApi } from "@/https"

import { getToken, setToken, removeToken, getTokenType, setTokenType } from '@/utils/auth'
import { debug } from 'util';

const user = {
  state: {
    tokenType: getTokenType(),
    token: getToken(),
    username: '',
    id:'',
    account:'',
    roles: []
    
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_TOKEN_TYPE: (state, tokenType) => {
      state.tokenType = tokenType
    },
    SET_NAME: (state, username) => {
      state.username = username
    },
    SET_ID:(state, id) => {
      state.id = id
    },
    SET_ACOUNT:(state, account) => {
      state.account = account
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.data.token_type
          const token = response.data.access_token
          setToken(token)
          setTokenType(data)
          commit('SET_TOKEN', token)
          commit('SET_TOKEN_TYPE', data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        // commit('SET_ROLES', ['police']);
        // resolve({data:[{code:'police'}]});
        
        let tokenStr = state.tokenType + state.token;
        getInfo(tokenStr).then(response => {
          const data = response.data.user;

          // let roles=[];
          // for(let i=0;i<data.sysRoles.length;i++) {
          //   roles.push(data.sysRoles[i].code.toLowerCase());
          // }
          // if (roles.indexOf("community") == -1 && roles.indexOf("police") == -1 && roles.indexOf("property") == -1 && roles.indexOf("admin") == -1) {
          //   roles.push('police');
          // }
          // if (roles && roles.length > 0) { // 验证返回的roles是否是一个非空数组
          //   commit('SET_ROLES', roles)
          // } else {
          //   reject('getInfo: roles 必须是一个非空数组 !')
          // }
          // commit('SET_ROLES', roles)
          commit('SET_NAME', data.username)
          commit('SET_ID', data.id)
          let headUrl =  data.headImgUrl || '/static/image/user.png';
          commit('SET_ACOUNT', headUrl)  
          userApi.getMenuBar().then(response => {
            // const data = response.data;
            let roles=response;
            // for(let i=0;i<data.sysRoles.length;i++) {
            //   roles.push(data.sysRoles[i].code.toLowerCase());
            // }
            // if (roles.indexOf("community") == -1 && roles.indexOf("police") == -1 && roles.indexOf("property") == -1 && roles.indexOf("admin") == -1) {
            //   roles.push('police');
            // }
            if (roles && roles.length > 0) { // 验证返回的roles是否是一个非空数组
              roles = ['jianguan']; //临时固定赋值
              commit('SET_ROLES', roles)
            } else {
              reject('获取菜单失败 !')
            }
            commit('SET_ROLES', roles)
  
            resolve(response)
          }).catch(error => {
            reject(error)
          })
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_TOKEN_TYPE', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_TOKEN_TYPE', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
