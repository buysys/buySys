<template>
  <div class="login_page fillcontain">
    <div class="login-container">
      <div class="manage_tit txtCenter">
        <div class="manage_tit_main">
          <a href="/"><img alt="logo" class="manage_tit_logo" src="../assets/image/logo.png"></a>
        </div>
        <div class="manage_tit_sub">Accelpower 是深圳最具影响力的企业</div>
      </div>
      <div class="login_box">
        <el-tabs v-model="activeName">
          <el-tab-pane label="账户密码登录" name="AccoutLogin" :key="'AccoutLogin'">
            <div class="mt24">
              <el-form :model="accountLoginForm" ref="accountLoginForm" :rules="accountRules">
                <el-form-item prop="userName">
                  <el-input v-model="accountLoginForm.userName" prefix-icon="el-icon-user" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item prop="pwd">
                  <el-input type="pwd" prefix-icon="el-icon-lock" placeholder="请输入密码" v-model="accountLoginForm.pwd"></el-input>
                </el-form-item>
                <el-form-item prop="verifycode" class="verifyInput">
                  <el-input v-model="accountLoginForm.verifycode" placeholder="请输入验证码"></el-input>
                  <img src="../../build/logo.png" class="verifycode">
                </el-form-item>
                <!-- <el-form-item>
                  <el-checkbox v-model="checked">自动登录</el-checkbox>
                  <el-button class="forgotPwd fright"><span style="color: #000000;">/</span>忘记密码</el-button>
                  <el-button @click="GoRegister" class="forgotPwd fright">注册</el-button>
                </el-form-item> -->
                <el-form-item>
                  <el-button type="primary" class="submit_btn" @click="loginIn">登陆</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane label="手机号登录" name="phoneLogin" :key="'phoneLogin'">
            <div class="mt24">
              <el-form :model="phoneLoginForm" ref="phoneLoginForm" :rules="phoneRules">
                <el-form-item prop="userphone">
                  <el-input v-model="phoneLoginForm.userphone" prefix-icon="el-icon-mobile-phone" placeholder="手机号"
                    maxlength="11" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
                </el-form-item>
                <el-form-item prop="phoneVerifyCode">
                  <el-col :span="16" :xs="24">
                    <el-input placeholder="请输入验证码" v-model="phoneLoginForm.phoneVerifyCode"
                      maxlength="6" onput="value=value.replace(/[^\/g,''])"></el-input>
                  </el-col>
                  <el-col :span="6" class="ml28">
                    <el-button>获取验证码</el-button>
                  </el-col>
                </el-form-item>
                <!-- <el-form-item>
                  <el-checkbox v-model="checked">自动登录</el-checkbox>
                  <el-link href="javascript:;" target="_blank" class="forgotPwd fright">忘记密码</el-link>
                </el-form-item> -->
                <el-form-item>
                  <el-button type="primary" class="submit_btn" @click="loginIn">登陆</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'login',
    data() {
      return {
        accountLoginForm: {
          userName: '',
          pwd: '',
          verifycode: ''
        },
        phoneLoginForm: {
          userphone: '',
          phoneVerifyCode: ''
        },
        activeName: "AccoutLogin",
        checked: true,
        accountRules: {
          userName: [{
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }],
          pwd: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }],
          verifycode: [{
            required: true,
            message: '请输入图片验证码',
            trigger: 'blur'
          }]

        },
        phoneRules: {
          userphone: [{
            required: true,
            message: '请输入手机号码',
            trigger: 'blur'
          }],
          phoneVerifyCode: [{
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      loginIn() {
        let role = 'l4ccy33k'
        sessionStorage.setItem('token', role)
        this.$router.push('/')
      },
      GoRegister() {
        this.$router.push({
          path: '/register'
        })
      }
    }
  }
</script>

<style scoped>
  .login-container {
    width: 364px;
    margin: 72px auto 0;
  }

  .manage_tit_main {
    height: 44px;
    line-height: 44px;
  }

  .manage_tit_main a {
    text-decoration: none;
  }

  .manage_tit_main .manage_tit_logo {
    height: 44px;
    margin-right: 16px;
    vertical-align: top;
  }

  .manage_tit_main .manage_tit_txt {
    position: relative;
    top: 2px;
    color: rgba(0, 0, 0, .85);
    font-weight: 600;
    font-size: 33px;
    font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
  }

  .manage_tit_sub {
    margin: 12px 0 40px 0;
    color: rgba(0, 0, 0, .45);
    font-size: 14px;
  }

  .submit_btn {
    width: 100%;
  }

  .forgotPwd {
    color: #1890ff;
    border: none;
    background: transparent;
    padding: 0;
    height: 40px;
    line-height: 40px;
  }

  .login_page {
    background: url(../assets/image/login-bg.jpg) no-repeat center center;
    background-size: 100% 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .verifyInput {
    position: relative;
  }

  .verifycode {
    position: absolute;
    height: 38px;
    width: 80px;
    top: 1px;
    right: 1px;
  }
</style>
