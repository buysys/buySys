<template>
	<div class="login_page fillcontain">
		<div class="login-container">
			<div class="manage_tit txtCenter">
				<div class="manage_tit_main">
					<a href="/"><img alt="logo" class="manage_tit_logo" src="../assets/image/logo.png"></a>
				</div>
				<div class="manage_tit_sub">Ant Design 是西湖区最具影响力的 Web 设计规范</div>
			</div>
			<div class="login_box">
				<el-tabs v-model="activeName">
					<el-tab-pane label="账户密码登录" name="AccoutLogin" :key="'AccoutLogin'">
						<div class="mt24">
							<el-form :model="loginForm" ref="loginForm">
								<el-form-item>
									<el-input v-model="loginForm.username" prefix-icon="el-icon-user" placeholder="用户名:admin or user"></el-input>
								</el-form-item>
								<el-form-item>
									<el-input type="password" prefix-icon="el-icon-lock" placeholder="密码:ant" v-model="loginForm.password"></el-input>
								</el-form-item>
								<el-form-item>
									<el-checkbox v-model="checked">自动登录</el-checkbox>
									<el-link href="javascript:;" class="forgotPwd fright">忘记密码</el-link>
								</el-form-item>
								<el-form-item>
									<el-button type="primary" class="submit_btn" @click="loginIn">登陆</el-button>
								</el-form-item>
							</el-form>
						</div>
					</el-tab-pane>
					<el-tab-pane label="手机号登录" name="phoneLogin" :key="'phoneLogin'">
						<div class="mt24">
							<el-form :model="loginForm" ref="loginForm">
								<el-form-item>
									<el-input v-model="loginForm.userphone" prefix-icon="el-icon-mobile-phone" placeholder="手机号" maxlength="11" oninput ="value=value.replace(/[^\d]/g,'')" ></el-input>
								</el-form-item>
								<el-form-item>
									<el-col :span="16" :xs="24">
										<el-input placeholder="验证码" prefix-icon="el-icon-message" v-model="loginForm.checkCode" maxlength="6" onput="value=value.replace(/[^\/g,''])"></el-input>
									</el-col>
									<el-col :span="6" class="ml28">
										<el-button>获取验证码</el-button>
									</el-col>
								</el-form-item>
								<el-form-item>
									<el-checkbox v-model="checked">自动登录</el-checkbox>
									<el-link href="javascript:;" target="_blank" class="forgotPwd fright">忘记密码</el-link>
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
			return {
				loginForm: {
					username: '',
					password: '',
				},
				activeName: "AccoutLogin",
				checked: true
			}
		},
		methods: {
			loginIn() {
				let role = 'l4ccy33k'
				sessionStorage.setItem('token', role)
				this.$router.push('/')
			}
		}
	}
</script>

<style scoped>
	.login-container {
		width: 364px;
		margin: 0 auto;
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
		color: #1890ff
	}
	
	.login_page {
		background-color: #e4e4e440;
		height: 100vh;
		display: flex;
		flex-direction: column;
		padding-top: 72px;
	}
	
	.form_contianer {
		padding: 25px;
		border-radius: 5px;
		text-align: center;
		background-color: #fff;
	}
	
	.form-fade-enter-active,
	.form-fade-leave-active {
		transition: all 1s;
	}
	
	.form-fade-enter,
	.form-fade-leave-active {
		transform: translate3d(0, -50px, 0);
		opacity: 0;
	}
</style>