<template>
	<div class="regPage">
		<div class="box">
			<div class="logobox">
				<img src="../assets/image/logo.png">
				<p class="infotxt">Accelpower 是深圳最具影响力的企业</p>
			</div>
			<el-form ref="regForm" :model="regForm" :rules="rules">
				<el-form-item prop="email">
					<el-input v-model="regForm.email" placeholder="邮箱"></el-input>
				</el-form-item>
				<el-form-item prop="pwd">
					<el-input v-model="regForm.pwd" placeholder="至少6位密码,区分大小写"></el-input>
				</el-form-item>
				<el-form-item prop="checkPwd">
					<el-input v-model="regForm.checkPwd" placeholder="确认密码"></el-input>
				</el-form-item>
				<el-form-item prop="verifycode" class="verifyInput">
					<el-input v-model="regForm.verifycode" placeholder="请输入图片验证码"></el-input>
					<img src="../../build/logo.png" class="verifycode">
				</el-form-item>
				<el-form-item prop="phone">
					<el-select class="phone-area" v-model="regForm.selectType" placeholder="请选择">
						<el-option label="+86" value="1"></el-option>
						<el-option label="+87" value="2"></el-option>
					</el-select>
					<el-input class="phone-num" v-model="regForm.phone" placeholder="手机号"></el-input>
				</el-form-item>
				<el-form-item prop="checkNum">
					<el-input class="checknuminput" v-model="regForm.checkNum" placeholder="请输入手机验证码"></el-input>
					<el-button class="checknumbtn">获取验证码</el-button>
				</el-form-item>
				<el-form-item>
					<el-button class="regbtn" type="primary" @click="onSubmit">注册</el-button>
					<el-link :underline="false" class="gologintxt" type="primary" @click="goLogin">使用已有账户登录</el-link>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				regForm: {
					email: '',
					pwd: '',
					checkPwd: '',
					selectType: '1',
					phone: '',
					verifycode: '',
					checknum: ''
				},
				rules: {
					email: [{
						required: true,
						message: '请输入邮箱',
						trigger: 'blur'
					}],
					pwd: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}],
					checkPwd: [{
						required: true,
						message: '请确认密码',
						trigger: 'blur'
					}],
					phone: [{
						required: true,
						message: '请输入手机号码',
						trigger: 'blur'
					}],
					verifycode: [{
						required: true,
						message: '请输入图片验证码',
						trigger: 'blur'
					}],
					checkNum: [{
						required: true,
						message: '请输入图片验证码',
						trigger: 'blur'
					}]
				}
			}
		},
		methods: {
			goLogin() {
				this.$router.push({
					path: '/login'
				})
			},
			onSubmit() {
				console.log('submit!');
			}
		}
	}
</script>

<style scoped>
	.regPage {
		background: url(../assets/image/login-bg.jpg) no-repeat center center;
		background-size: 100% 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
	}
	.box {
		width: 380px;
		margin: 0 auto;
	}
	.logobox {
		text-align: center;
		margin: 80px 0;
	}
	.logobox img {
		width: 200px;
	}
	.infotxt {
		margin-top: 12px;
		font-size: 14px;
		color: #999999;
	}	
	.checknuminput {
		width: 68%;
	}	
	.checknumbtn {
		width: 30%;
		float: right;
	}
	.regbtn {
		width: 68%;
	}
	.gologintxt {
		width: 30%;
		float: right;
		text-align: right;
	}
	.phone-area {
		width: 30%;
	}	
	.phone-num {
		width: 68%;
		float: right;
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