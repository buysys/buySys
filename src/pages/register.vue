<template>
	<div class="box">
		<div class="logobox">
			<img src="../assets/image/logo.png">
			<p class="infotxt">触动力是深圳最具影响力的公司</p>
		</div>
		<el-form ref="form" :model="form">
			
			<el-form-item>
			<el-input v-model="form.name" placeholder="邮箱"></el-input>
			</el-form-item>
			
			<el-form-item>
			<el-input v-model="form.password" placeholder="至少6位密码,区分大小写"></el-input>
			</el-form-item>
			
			<el-form-item>
			<el-input v-model="form.password2" placeholder="确认密码"></el-input>
			</el-form-item>
			
			<el-form-item>
			<el-input placeholder="手机号" v-model="form.phone" class="input-with-select">
			<el-select v-model="form.select" slot="prepend" placeholder="请选择">
			  <el-option label="+86" value="1"></el-option>
			  <el-option label="+87" value="2"></el-option>
			</el-select>
			</el-input>
			</el-form-item>
			
			<el-form-item>
			<el-input class="checknuminput" v-model="form.checknum" placeholder="验证码"></el-input>
			<el-button class="checknumbtn">获取验证码</el-button>
			</el-form-item>
			
			<el-form-item>
			<el-button class="regbtn" type="primary" @click="onSubmit">注册</el-button>
			<el-link :underline="false" class="gologintxt" type="primary">使用已有账户登录</el-link>
			 </el-form-item>
		</el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: {
          name: '',
          password : '',
          password2: '',
          select:1,
          checknum: ''
        }
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      }
    }
  }
</script>

<style scoped>
	.box{
		width: 380px;
		margin: 0 auto;
	}
	.logobox{
		text-align: center;
		margin: 50px 0;
	}
	.logobox img{
		width: 200px;
	}
	.infotxt{
		margin-top: 12px;
		font-size: 14px;
		color: #999999;
	}
	.checknuminput{
		width: 68%;
	}
	.checknumbtn{
		width: 30%;
		float: right;
	}
	.regbtn{
		width: 68%;
	}
	.gologintxt{
		width: 30%;
		float: right;
		text-align: right;
	}
</style>
