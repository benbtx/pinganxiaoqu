<template>
  <div class="login-container">
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
       <!-- <h3 class="title">平安智慧小区综合服务系统</h3> -->
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="username" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
          placeholder="password"></el-input>
          <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
      </el-form-item>
      <span class="err-tips">{{errText}}</span>
      <el-form-item>
        <el-button type="primary" style="width:100%;background-color:#12B1E1;" :loading="loading" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
      <!-- <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: admin</span>
      </div> -->
    </el-form>
  </div>
</template>

<script>
import store from '@/store'
import { excontrolApi } from "@/https";
export default {
  name: 'login',
  data() {

    return {
      loginForm: {
        username: 'admin',
        password: 'admin'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: "用户名不能为空！", }],
        password: [
          { required: true, trigger: 'blur', message: "密码不能为空！" },
          {
            pattern:/^[\S]{4,12}$/,
            message: '密码必须4到12位，且不能出现空格'
          }
        ]
      },
      loading: false,
      pwdType: 'password',
      errText: ''
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          let _this = this;
          _this.errText = '';
          _this.loading = true
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.loading = false;
            this.$router.push({ path: '/dashboard' });
            this.getCLppType();
            this.getTransducerCode();
          }).catch(() => {
            _this.errText = '请检查账号或密码！';
            this.loading = false;
          })

          // let param = {};
          // param.username = this.loginForm.username;
          // param.password = this.loginForm.password;

          // return excontrolApi
          // .loginIn(param)
          // .then(res => res)
          // .then(data => {
          //       if(data.code==200)
          //       {
          //         _this.loading = false
          //         _this.$router.push({ path: '/dashboard' })
          //       }
          //   }).catch(() => {
          //    _this.loading = false
          //  })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#02203f;
$light_gray:#eee;
/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    width: 360px;
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#02203f;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background: url(/static/image/bg-all.png);
  background-repeat: no-repeat;
  background-position: top;
  background-size: 100% auto;
  background-color: #03223c;
  .login-form {
    position: absolute;
    bottom: calc(20% - 50px);
    right: calc(4% - 20px);
    width: 436px;
    padding: 100px 0px 15px 35px;
    margin: 0px auto;
    background: url(/static/image/bg-login.png);
    background-repeat: no-repeat;
    background-size: auto 100%;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
.err-tips {
  font-size: 12px;
  color: #f56c6c;
  margin-top: -20px;
  position: absolute;
}
</style>
