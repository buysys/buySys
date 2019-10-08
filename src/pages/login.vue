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
                  <el-input type="password" prefix-icon="el-icon-lock" placeholder="请输入密码" v-model="accountLoginForm.pwd"></el-input>
                </el-form-item>
                <el-form-item prop="verifycode" class="verifyInput" :error="errorMsg1">
                  <el-input v-model="accountLoginForm.verifycode" prefix-icon="el-icon-picture-outline" placeholder="请输入图片验证码"
                    @blur="checkImgCode(accountLoginForm.verifycode)"></el-input>
                  <img :src="codeImg" class="verifycode" @click="getImgCode">
                </el-form-item>
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
                  <el-input v-model="phoneLoginForm.userphone" prefix-icon="el-icon-mobile-phone" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item prop="phoneVerifyCode" :error="errorMsg2">
                  <el-row :gutter="10">
                    <el-col :span="16">
                      <el-input v-model="phoneLoginForm.phoneVerifyCode" prefix-icon="el-icon-postcard" placeholder="请输入手机验证码"
                        @blur="checkPhoneCode(phoneLoginForm.userphone,phoneLoginForm.phoneVerifyCode)"></el-input>
                    </el-col>
                    <el-col :span="6">
                      <el-button type="success" :disabled="disabled" @click="getPhoneCode" style="width: 115px;">{{btnText}}</el-button>
                    </el-col>
                  </el-row>
                </el-form-item>
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
      // 手机号验证
      const validatePhone = (rule, value, callback) => {
        let _this = this
        const reg = /^[1][3,4,5,7,8][0-9]{9}$/
        if (reg.test(value)) {
          _this.disabled = false
          callback()
        } else {
          _this.disabled = true
          callback(new Error('请输入正确的手机号'))
        }
      }
      return {
        codeImg: '', //验证码图片
        disabled: true, //获取验证码按钮禁用
        errorMsg1: '', //图片验证码错误信息
        errorMsg2: '', //手机验证码错误信息
        btnText: '获取验证码',
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
            validator: validatePhone,
            trigger: 'change'
          }],
          phoneVerifyCode: [{
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          }]
        }
      }
    },
    created() {
      this.getImgCode()
    },
    methods: {
      //获取图片验证码
      getImgCode() {
        let _this = this
        let param = {
          SessionId: sessionStorage.getItem('sessionid')
        }
        _this.axios.post(this.GLOBAL.BASE_URL + '/api/imageCode', param).then((res) => {
          if (res.data.status == '200') {
            _this.codeImg = 'data:image/png;base64,' + res.data.data.imagedata
            _this.imgCodeNum = res.data.data.imagecode
            let sessionid = res.data.data.sessionid
            sessionStorage.setItem('sessionid', sessionid)
          }
        })
      },

      //手机登录获取手机验证码
      getPhoneCode() {
        let _this = this
        let param = {
          SessionId: sessionStorage.getItem('sessionid'),
          phonenumber: _this.phoneLoginForm.userphone
        }
        _this.axios.post(this.GLOBAL.BASE_URL + '/api/phoneCode', param).then((res) => {
          if (res.data.status == '200') {
            _this.$message({
              message: res.data.message,
              type: 'success'
            })
            // 获取验证码按钮限制
            _this.disabled = true
            _this.authTime()
          } else {
            _this.$message({
              message: res.data.message,
              type: 'error'
            })
          }
        })
        _this.disabled = true
        _this.authTime()
      },

      //图形验证码码是否正确
      checkImgCode(code) {
        let _this = this
        _this.errorMsg1 = ''
        let param = {
          SessionId: sessionStorage.getItem('sessionid'),
          ImageCode: code
        }
        _this.axios.post(this.GLOBAL.BASE_URL + '/api/imageCodeValidation', param).then((res) => {
          if (res.data.status == '500') {
            _this.errorMsg1 = res.data.message
          }
        })
      },

      //手机验证码是否正确
      checkPhoneCode(phone, code) {
        let _this = this
        _this.errorMsg2 = ''
        let param = {
          SessionId: sessionStorage.getItem('sessionid'),
          phonenumber: phone,
          PhoneCode: code
        }
        _this.axios.post(this.GLOBAL.BASE_URL + '/api/phoneCodeValidation', param).then((res) => {
          if (res.data.status == '500') {
            _this.errorMsg2 = res.data.message
          }
        })
      },

      // 按钮倒计时
      authTime() {
        let _this = this
        let time = 60
        let timeInt = setInterval(() => {
          time--
          _this.btnText = time + ' 重新获取'
          if (time <= 0) {
            _this.disabled = false
            _this.btnText = '获取验证码'
            window.clearInterval(timeInt)
          }
        }, 1000)
      },

      // 登录
      loginIn() {
        let _this = this
        let Mode = ''
        let Verify = ''
        if (_this.activeName=='AccoutLogin') {
          Mode = 2
          Verify = _this.accountLoginForm.verifycode
        } else {
          Mode = 1
          Verify = _this.phoneLoginForm.phoneVerifyCode
        }
        let param = {
          SessionId: sessionStorage.getItem('sessionid'),
          UserName: _this.accountLoginForm.userName,
          Password: _this.accountLoginForm.pwd,
          Mobile: _this.phoneLoginForm.userphone,
          VerifyCode: Verify,
          VeriMode: Mode
        }
        sessionStorage.setItem('token','123')
        this.$router.push('/')
        // _this.axios.post(this.GLOBAL.BASE_URL + '/api/userBlogin', param).then((res) => {
        //   if (res.data.status == '200') {
        //     _this.$message({
        //       message: res.data.message,
        //       type: 'success'
        //     })
        //     sessionStorage.setItem('sessionid', res.data.data.sessionid)
        //     sessionStorage.setItem('userId', res.data.data.UserId)
        //     sessionStorage.setItem('userName', res.data.data.UserName)
        //     // let typeData = JSON.stringify(res.data.data.ListofValues)
        //     // sessionStorage.setItem('typeData',typeData)
        //     this.$router.push('/')
        //   } else {
        //     _this.$message({
        //       message: res.data.message,
        //       type: 'error'
        //     })
        //   }
        // })
      }
    }
  }
</script>

<style scoped>

</style>
