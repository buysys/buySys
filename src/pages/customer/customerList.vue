<template>
	<div class="container">
		<div class="mb20 fz14">
			<span>客户管理</span>
			<span>/</span>
			<span>客户列表</span>
		</div>
		<el-collapse-transition>
			<div class="searchBox mb20" v-show="searchModel">
				<el-form ref="searchForm" :model="searchForm" class="form-item" label-width="80px">
					<el-row>
						<el-col :xs="24" :span="8" :sm="8" :md="8" :lg="8">
							<el-form-item label="搜索内容">
								<el-input v-model="searchForm.searchkeywords" placeholder="请输入客户账号/编码/名称/手机号码/邮箱/微信/QQ" class="disInline"></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :span="5" :sm="9" :md="8" :lg="4" class="ml20">
							<el-button type="primary" size="medium">查询</el-button>
							<el-button size="medium" @click="resetSearch">重置</el-button>
						</el-col>
					</el-row>
				</el-form>
			</div>
		</el-collapse-transition>
		<div class="mb20">
			<el-button type="success" size="medium" @click="addModelShow"><i class="el-icon-plus"></i>新增</el-button>
			<el-button type="primary" size="medium" @click="editModelShow" :disabled="editDisabled"><i class="el-icon-edit-outline"></i>修改</el-button>
			<el-button type="danger" size="medium" @click="delData" :disabled="delDisabled"><i class="el-icon-delete"></i>删除</el-button>
			<el-button type="warning" size="medium" @click="exportExcel"><i class="el-icon-document-delete"></i>导出</el-button>
			<el-input placeholder="搜索" prefix-icon="el-icon-search" class="listSearchInput" @click.native="searchShow" readonly></el-input>
		</div>
		<div class="mt10">
		<el-table v-loading="loading" :data="tableData" id="exportData" style="width: 100%" :header-cell-style="{background:'#fafafa'}" @selection-change="handleSelectionChange">
			<el-table-column type="selection"></el-table-column>
				<el-table-column prop="Numbers" label="客户账号" align="center" width="200">
					<template slot-scope="scope">
						<el-button type="text" @click="viewModelShow(scope.$index,scope.row)">{{scope.row.Numbers}}</el-button>
					</template>
				</el-table-column>
			    <el-table-column prop="ProductByASIN" label="编码" align="center"></el-table-column>
				<el-table-column prop="CountryId" label="名称" align="center"></el-table-column>
				<el-table-column prop="CountryId" label="性别" align="center"></el-table-column>
				<el-table-column prop="OrderNumber" label="手机号码" align="center"></el-table-column>
				<el-table-column prop="OrderNumber" label="邮箱" align="center"></el-table-column>
				<el-table-column prop="OrderNumber" label="微信" align="center"></el-table-column>
				<el-table-column prop="OrderNumber" label="QQ" align="center"></el-table-column>
				<el-table-column prop="CountryId" label="所属用户" align="center"></el-table-column>
				<el-table-column prop="ProductPrice" label="余额" align="center" class-name="red"></el-table-column>
				<el-table-column prop="OrderNote" label="备注" align="center"></el-table-column>
				<el-table-column prop="OrderNumber" label="最后登录IP" align="center"></el-table-column>
				<el-table-column prop="OrderTime" label="最后登录时间" align="center"></el-table-column>
				<el-table-column prop="Status" label="是否可登录" align="center"></el-table-column>
		</el-table>
		<div class="mt30">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[100, 200, 300, 500]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		</div>
		<!-- 新增修改 -->
		<el-dialog :title="title" :visible.sync="editModel" :close-on-click-modal="false" :before-close="closeModel">
			<el-form :model="editForm" :rules="editRules" label-width="125px" status-icon>
				<el-form-item label="名称">
					<el-input v-model="editForm.name"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="editForm.password"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="password2">
					<el-input v-model="editForm.password2"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<template>
					  <el-radio v-model="editForm.sex" label="1">男</el-radio>
					  <el-radio v-model="editForm.sex" label="2">女</el-radio>
					</template>
				</el-form-item>
				<el-form-item label="手机号" prop="phone">
					<el-input v-model="editForm.phone"></el-input>
				</el-form-item>
				<el-form-item label="邮箱">
					<el-input v-model="editForm.email"></el-input>
				</el-form-item>
				<el-form-item label="微信">
					<el-input v-model="editForm.weixin"></el-input>
				</el-form-item>
				<el-form-item label="QQ">
					<el-input v-model="editForm.qq"></el-input>
				</el-form-item>
				<el-form-item label="是否可登录" prop="canlogin">
					<template>
					  <el-radio v-model="editForm.canLogin" label="1">是</el-radio>
					  <el-radio v-model="editForm.canLogin" label="0">否</el-radio>
					</template>
				</el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" v-model="editForm.remark"></el-input>
				</el-form-item>
				<p class="txtCenter">
					<el-button type="primary">确定</el-button>
					<el-button @click="closeModel">取消</el-button>
				</p>
			</el-form>
		</el-dialog>
		<!-- 查看 -->
		<el-dialog :title="title" :visible.sync="viewModel" :close-on-click-modal="false">
			<el-form :model="viewForm" label-width="125px" status-icon>
				<el-row>
					<el-col :span="12" :xs="24"><el-form-item label="客户账号:"><label>{{viewForm.userName}}</label></el-form-item></el-col>
					<el-col :span="12" :xs="24"><el-form-item label="客户编码:"><label>{{viewForm.userNo}}</label></el-form-item></el-col>
				</el-row>
				<el-row>
					<el-col :span="12" :xs="24"><el-form-item label="名称:"><label>{{viewForm.name}}</label></el-form-item></el-col>
					<el-col :span="12" :xs="24"><el-form-item label="性别:"><label>{{viewForm.sex}}</label></el-form-item></el-col>
				</el-row>
				<el-row>
					<el-col :span="12" :xs="24"><el-form-item label="手机号:"><label>{{viewForm.phone}}</label></el-form-item></el-col>
					<el-col :span="12" :xs="24"><el-form-item label="邮箱:"><label>{{viewForm.email}}</label></el-form-item></el-col>
				</el-row>
				<el-row>
					<el-col :span="12" :xs="24"><el-form-item label="微信:"><label>{{viewForm.weixin}}</label></el-form-item></el-col>
					<el-col :span="12" :xs="24"><el-form-item label="QQ:"><label>{{viewForm.qq}}</label></el-form-item></el-col>
				</el-row>
				<el-row>
					<el-col :span="12" :xs="24"><el-form-item label="所属用户:"><label>{{viewForm.suoShuUser}}</label></el-form-item></el-col>
					<el-col :span="12" :xs="24"><el-form-item label="是否可登录:"><label>{{viewForm.canLogin}}</label></el-form-item></el-col>
				</el-row>
				<el-row>
					<el-col :span="12" :xs="24"><el-form-item label="最后登录IP:"><label>{{viewForm.lastLoginIP}}</label></el-form-item></el-col>
					<el-col :span="12" :xs="24"><el-form-item label="最后登录时间:"><label>{{viewForm.lastLoginTime}}</label></el-form-item></el-col>
				</el-row>
				<el-row>
					<el-col :span="12" :xs="24"><el-form-item label="是否修改账号:"><label>{{viewForm.isEditAccount}}</label></el-form-item></el-col>
					<el-col :span="12" :xs="24"><el-form-item label="创建时间:"><label>{{viewForm.createTime}}</label></el-form-item></el-col>
				</el-row>
				<el-row>
					<el-col :span="24" :xs="24"><el-form-item label="备注:"><label>{{viewForm.remark}}</label></el-form-item></el-col>
				</el-row>
				<p class="txtCenter"><el-button @click="viewModel=false">关闭</el-button></p>
			</el-form>
		</el-dialog>
		<!-- 删除-->
		<el-dialog title="温馨提示" :visible.sync="delModel" :close-on-click-modal="false" center="" width="30%">
		  <div class="del-dialog-cnt textCen">确认要删除该数据吗？</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button type="primary" size="medium">确定</el-button>
		    <el-button @click="delModel=false" size="medium">取消</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	import FileSaver from 'file-saver'
	import XLSX from 'xlsx'
	export default {
		name: 'customer',
		data() {
			return {
				loading:true,
				searchModel: false,
				editModel: false,
				delModel: false,
				viewModel: false,
				editDisabled: true,
				delDisabled: true,
				tableData: [],
				checkBoxData:[],
				title:'',
				allNum: 0,
				active: 1,
				currentPage: 1,
				pageSize: '0',
				total:100,
				searchForm: {
					platform: '全部',
					searchkeywords: ''
						},
				editForm: {
					name: '',
					password: '',
					password2: '',
					sex: '1',
					phone: '',
					email: '',
					weixin: '',
					qq: '',
					canLogin:'1',
					remark: ''
				},
				viewForm: {
					userName: '',
					userNo: '',
					name: '',
					password: '',
					password2: '',
					sex: '1',
					phone: '',
					email: '',
					weixin: '',
					qq: '',
					suoShuUser:'',
					canLogin:'1',
					lastLoginIP:'',
					lastLoginTime:'',
					isEditAccount:'',
					createTime:'',
					remark: ''
				},
				editRules: {
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}],
					password2: [{
						required: true,
						message: '请输入确认密码',
						trigger: 'blur'
					}],
					phone: [{
						required: true,
						message: '请输入手机号',
						trigger: 'blur'
					}],
					canLogin: [{
						required: true,
						message: '请选择是否可登录',
						trigger: 'blur'
					}]
				},
					}
				},
				created() {
					this.getAllData()
				},
				methods:{
					//获取数据
					getAllData() {
						let _this = this
						_this.active = 1
						_this.axios.get(_this.GLOBAL.BASE_URL + 'api/OrderManagement/AddOrderByType').then((res) => {
							_this.tableData = res.data.data
							_this.allNum = res.data.data.length
							_this.loading = false
						}).catch((error) => {
							console.log(error)
						})
					},
					// 检索
					searchShow() {
						let _this = this
						let sear = _this.searchModel
						if(sear) {
							_this.searchModel = false
						} else {
							_this.searchModel = true
						}
					},
					// 重置
					resetSearch() {
						let _this = this
						_this.searchForm = {
							platform: '全部',
							searchkeywords: ''
						}
					},
					// 是否有选中
					handleSelectionChange(val) {
						let _this = this
						_this.checkBoxData = val
						let checkNum = _this.checkBoxData.length
						if(checkNum ==1) {
							_this.editDisabled = false
							_this.delDisabled = false
						}
						else if(checkNum > 1) {
							_this.editDisabled = true
							_this.delDisabled = false
						} else {
							_this.editDisabled = true
							_this.delDisabled = true
						}
					},
					// 新增
					addModelShow() {
						let _this = this
						_this.editModel = true
						_this.title = '客户新增'
					},
					// 修改
					editModelShow() {
						let _this = this
						_this.editModel = true
						let item = _this.checkBoxData[0]
						let num = item.Numbers
						_this.title = '客户：' + num + ' 信息修改'
						_this.editForm.name = item.CountryId;
						_this.editForm.password = item.CountryId;
						_this.editForm.password2 = item.CountryId;
						_this.editForm.sex = '1';
						_this.editForm.phone = item.CountryId;
						_this.editForm.email = item.CountryId;
						_this.editForm.weixin = item.CountryId;
						_this.editForm.qq = item.CountryId;
						_this.editForm.canLogin = '1';
						_this.editForm.remark = item.CountryId;
					},
					// 查看
					viewModelShow(index, row) {
						let _this = this;
						_this.viewModel = true
						let item = _this.tableData[index]
						let num = item.Numbers
						_this.title = '客户：' + num + ' 信息详情'
						_this.viewForm.userName = item.CountryId,
						_this.viewForm.userName = item.CountryId,
						_this.viewForm.userNo = item.CountryId,
						_this.viewForm.name = item.CountryId,
						_this.viewForm.password = item.CountryId,
						_this.viewForm.password2 = item.CountryId,
						_this.viewForm.sex = '男',
						_this.viewForm.phone = item.CountryId,
						_this.viewForm.email = item.CountryId,
						_this.viewForm.weixin = item.CountryId,
						_this.viewForm.qq = item.CountryId,
						_this.viewForm.suoShuUser = item.CountryId,
						_this.viewForm.canLogin = '是',
						_this.viewForm.lastLoginIP = item.CountryId,
						_this.viewForm.lastLoginTime = item.CountryId,
						_this.viewForm.isEditAccount = item.CountryId,
						_this.viewForm.createTime = item.CountryId,
						_this.viewForm.remark = item.CountryId
					},
					// 删除
					delData () {
					  let _this = this
					  _this.delModel = true
					},
					//关闭新增修改弹窗
					closeModel() {
						let _this = this
						_this.editModel = false
						_this.editForm = {}
					},
					//分页
					handleSizeChange(val) {
						console.log(`每页 ${val} 条`)
					},
					handleCurrentChange(val) {
						console.log(`当前页: ${val}`)
					},
					// 导出
					exportExcel() {
						var xlsxParam = {
							raw: true
						} // 导出的内容只做解析，不进行格式转换
						var wb = XLSX.utils.table_to_book(document.querySelector('#exportData'), xlsxParam)
					
						/* get binary string as output */
						var wbout = XLSX.write(wb, {
							bookType: 'xlsx',
							bookSST: true,
							type: 'array'
						})
						try {
							FileSaver.saveAs(new Blob([wbout], {
								type: 'application/octet-stream'
							}), '下单管理表.xlsx')
						} catch(e) {
							if(typeof console !== 'undefined') {
								console.log(e, wbout)
							}
						}
						return wbout
					},
			}
		}
</script>

<style>
</style>
