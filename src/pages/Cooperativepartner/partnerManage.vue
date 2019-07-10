<template>
	<div class="container">
		<div class="mb20 fz14">
			<span>合作伙伴</span>
			<span>/</span>
			<span>伙伴管理</span>
		</div>
		<el-collapse-transition>
			<div class="searchBox mb20">
				<el-form ref="searchForm" :model="searchForm" class="form-item" label-width="80px">
					<el-row class="pt20">
						<el-col :xs="24" :span="7" :sm="9" :md="8" :lg="5">
							<el-form-item label="账号">
								<el-input v-model="searchForm.account" placeholder="请输入账号" class="disInline"></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :span="7" :sm="9" :md="8" :lg="5">
							<el-form-item label="手机">
								<el-input v-model="searchForm.phone" placeholder="请输入手机" class="disInline"></el-input>
							</el-form-item>
						</el-col>

						<el-col :xs="24" :span="5" :sm="10" :md="8" :lg="5" class="ml20">
							<el-button type="primary" size="medium">查询</el-button>
							<el-button size="medium">重置</el-button>
						</el-col>
					</el-row>
				</el-form>
			</div>
		</el-collapse-transition>
		<div class="mb20">
			<el-button type="success" size="medium" @click="update" :disabled='disabled'><i class="el-icon-edit-outline"></i>修改</el-button>
			<el-button type="primary" size="medium" :disabled="disabled" @click="updateRoyalty"><i class="el-icon-edit-outline"></i>修改提成比例
			</el-button>
		</div>
		<div class="mt10">
			<el-table :data="partnerData" v-model='loading' border style="width: 100%" height='500' @selection-change="handleSelectionChange">
				<el-table-column type="selection"></el-table-column>
				<el-table-column prop="Numbers" label="伙伴账号" align="center"></el-table-column>
				<el-table-column prop="CountryId" label="名称" align="center"></el-table-column>
				<el-table-column prop="ProductByASIN" label="性别" align="center"></el-table-column>
				<el-table-column prop="ProductByASIN" label="手机" align="center"></el-table-column>
				<el-table-column prop="ServiceType" label="邮箱" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="微信" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="QQ" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="最后登录IP" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="最后登录时间" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="是否可登录" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="推广码" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="提成比例" align="center"></el-table-column>
			</el-table>
			<div class="mt30">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
		</div>
		<!--修改-->
		<el-dialog title='修改' :visible.sync='editModal' :close-on-click-modal='false'>
			<el-form :model='editForm' ref='editForm' class='demo-form'>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label='伙伴账号：'>
							<span>{{editForm.account}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label='名称：'>
							<span>{{editForm.name}}</span>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label='性别：'>
							<span>{{editForm.sex}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label='手机：'>
							<span>{{editForm.phone}}</span>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label='邮箱：'>
							<span>{{editForm.email}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label='微信：'>
							<span>{{editForm.weixin}}</span>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label='QQ：'>
							<span>{{editForm.qq}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label='最后登录IP：'>
							<span>{{editForm.endLoginIp}}</span>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label='最后登录时间：'>
							<span>{{editForm.endLoginTime}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label='推广码：'>
							<span>{{editForm.promoCode}}</span>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label='提成比例：'>
							<span>{{editForm.royalty}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label='开户银行：'>
							<span>{{editForm.openBank}}</span>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label='开户名：'>
							<span>{{editForm.accountName}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label='银行账号：'>
							<span>{{editForm.bankAccount}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label='是否可登录：'>
							<el-radio-group v-model="editForm.isLogin">
								<el-radio label="是"></el-radio>
								<el-radio label="否"></el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label='备注信息'>
					<el-input type='textarea' v-model='editForm.remark'></el-input>
				</el-form-item>
				<el-form-item class='txtCenter'>
					<el-button type='primary'>确定</el-button>
					<el-button @click='editModal=false'>取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!--修改提成比例-->
		<el-dialog title='请输入提成比例' :visible.sync='editRoyaltyModal' :close-on-click-modal='false' width='25%'>
			<el-form :model='royaltyForm' ref='royaltyForm'>
				<el-form-item>
					<el-input v-model='royaltyForm.royalty'></el-input>
				</el-form-item>
				<el-form-item class='txtCenter'>
					<el-button type='primary'>确定</el-button>
					<el-button @click='editRoyaltyModal=false'>取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'partnerManage',
		data() {
			return {
				currentPage: 1,
				pageSize: '0',
				total:100,
				loading: true,
				disabled: true,
				editModal: false, //修改
				editRoyaltyModal: false, //修改提成比例
				partnerData: [], //列表数据
				checkBoxData: [], //选中数据
				searchForm: {
					account: '',
					phone: ''
				},
				//修改提成比例
				royaltyForm:{
					royalty:''
				},
				//修改弹窗
				editForm:{
					account:'op_7xdjtb1lic23',
					userName:'kyumin',
					sex:'女',
					phone:'13544233223',
					email:'yutong8023@163.com',
					weixin:'kyumin',
					qq:'43565757',
					endLoginIp:'',
					endLoginTime:'',
					promoCode:'',
					royalty:'',
					openBank:'',
					accountName:'',
					bankAccount:'',
					isLogin:'是',
					remark:''
					
				}
			}
		},
		created() {
			this.getAllData()
		},
		methods: {
			//初始化数据
			getAllData() {
				let _this = this
				_this.active = 1
				_this.axios.get(_this.GLOBAL.BASE_URL + 'api/OrderManagement/AddOrderByType').then((res) => {
					_this.partnerData = res.data.data
					_this.loading = true
				}).catch((error) => {
					console.log(error)
				})
			},
			// 是否有选中
			handleSelectionChange(val) {
				this.checkBoxData = val
				console.log(val)
				let checkNum = this.checkBoxData.length
				console.log(checkNum)
				if(checkNum !== 1) {
					this.disabled = true
				} else {
					this.disabled = false
				}
			},
			//修改伙伴管理
			update() {
				let _this = this
				_this.editModal = true
			},
			//修改提成比例
			updateRoyalty() {
				let _this = this
				_this.editRoyaltyModal = true
			},
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`)
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`)
			}
		}
	}
</script>

<style>

</style>