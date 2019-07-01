import Vue from 'vue'
import axios from 'axios'
import interceptor from '@/https/interceptor'
import { getToken, setToken, removeToken, getTokenType, setTokenType } from '@/utils/auth'

// const controlAddress = require('../../config').controlAddress
// let request = axios.create({ baseURL: controlAddress });
  let request = axios.create({ baseURL: Vue.prototype.ApiUrl });
  request.defaults.headers.post['Content-Type'] = 'application/json';
  interceptor(request);

// 
export function login(username, password) {
  return request({
    url: '/GA-AUTH/user/login/token',
    // url: '/GA-AUTH/user/login',
    // url: '/humin-other/user/login',
    method: 'get',
    params: {
      username,
      password
    }
  })
}

export function getInfo() {
  return request({
    url: '/GA-AUTH/user/userDetail',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/GA-AUTH/user/logout/token?access_token='+getToken(),
    method: 'GET'
  })
}

