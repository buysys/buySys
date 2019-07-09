<template>
	<div class="container">
		<div class="mb20 fz14">
			<span>买号管理</span>
			<span>/</span>
			<span>注册账号</span>
		</div>
		<el-collapse-transition>
			<div class="searchBox mb20 pl30" v-show="searchModel">
				<el-form ref="searchForm" :model="searchForm" class="form-item" label-width="100px">
					<el-form-item label="标签类型">
							<el-checkbox-group v-model="searchForm.type">
								<el-checkbox label="西班牙" name="type"></el-checkbox>
								<el-checkbox label="新人注册号" name="type"></el-checkbox>
								<el-checkbox label="加拿大" name="type"></el-checkbox>
								<el-checkbox label="手机测试" name="type"></el-checkbox>
							</el-checkbox-group>
						</el-form-item>
					<el-row>
				   <el-col :span='4' :xs='24'>
				   	<el-form-item label="平台" class="pt20 disInline">
						<el-radio-group v-model="searchForm.platform" class="disInline">
							<el-radio label="全部"></el-radio>
							<el-radio label="Amazon"></el-radio>
						</el-radio-group>
					</el-form-item>
				   </el-col>
					<el-col :span='6' :xs='24'>
						<el-form-item label="是否留评" class="pt20 disInline">
						<el-radio-group v-model="searchForm.isComment" class="disInline">
							<el-radio label="是"></el-radio>
							<el-radio label="否"></el-radio>
						</el-radio-group>
					</el-form-item>
					</el-col>
					</el-row>
					<el-row>
						<el-col :span='4' :xs='24'>
							<el-form-item label="信用卡类型">
						<el-select placeholder="请选择" v-model="searchForm.CreditCard" class="minWid">
							<el-option v-for="(item,index) in CreditCardData" :key="index" :value="index" :label="item.types"></el-option>
						</el-select>
					</el-form-item>
						</el-col>
						<el-col :span='6' :xs='24'>
							<el-form-item label="买号等级">
						<el-select placeholder="请选择" v-model="searchForm.buyNumberLevel" class="minWid">
							<el-option v-for="(item,index) in buyNumberLevelData" :key="index" :value="index" :label="item.level"></el-option>
						</el-select>
					</el-form-item>
						</el-col>
					</el-row>					
					<el-form-item label="注册时间">
						<el-date-picker v-model="searchForm.orderStartTime" type="date" placeholder="选择开始时间" :picker-options="pickerStartDate" value-format="yyyy-MM-dd" class="mb10"></el-date-picker>
						<el-date-picker v-model="searchForm.orderEndTime" type="date" placeholder="选择结束时间" :picker-options="pickerEndDate" value-format="yyyy-MM-dd"></el-date-picker>
					</el-form-item>
					<el-row>
						<el-col :xs="24" :span="7" :sm="9" :md="8" :lg="5">
							<el-form-item label="搜索内容">
								<el-input v-model="searchForm.searchkeywords" placeholder="请输入买家账号/姓名" class="disInline"></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :span="5" :sm="10" :md="8" :lg="5" class="ml20">
							<el-button type="primary" size="medium">查询</el-button>
							<el-button size="medium" @click="resetSearch">重置</el-button>
						</el-col>
					</el-row>
				</el-form>
			</div>
		</el-collapse-transition>
		<div class="mb20">
			<el-button type="success" size="medium" @click="addLevel"><i class="el-icon-plus"></i>新建</el-button>
			<el-button type="primary" size="medium" :disabled="disabled" @click="editLevel"><i class="el-icon-edit-outline"></i>修改
			</el-button>
			<el-button type="danger" size="medium" :disabled="disabled" @click="delHandel"><i class="el-icon-delete"></i>删除
			</el-button>
			<el-button type="warning" size="medium" @click="delHandel"><i class="el-icon-folder-opened"></i>导入
			</el-button>
			<el-button type="warning" size="medium" @click="delHandel"><i class="el-icon-document-delete"></i>导出
			</el-button>
			<el-button type="primary" size="medium" @click="delHandel"><i class="el-icon-takeaway-box"></i>自动注册
			</el-button>
			<el-input placeholder="搜索" prefix-icon="el-icon-search" class="listSearchInput" @click.native="searchShow"></el-input>
			<!--<el-button size="medium" @click="searchShow"><i class="el-icon-search"></i>检索</el-button>-->
		</div>
		<div class="mt10">
			<el-table :data="buyNumData" border style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="selection"></el-table-column>
				<el-table-column prop="CountryId" label="平台/国家" align="center"></el-table-column>
				<el-table-column prop="Numbers" label="默认网址" align="center"></el-table-column>
				<el-table-column prop="ProductByASIN" label="账号" align="center"></el-table-column>
				<el-table-column prop="ProductByASIN" label="密码" align="center"></el-table-column>
				<el-table-column prop="ProductPrice" label="姓名" align="center"></el-table-column>
				<el-table-column prop="ServiceType" label="电话" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="省/州" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="城市" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="邮编" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="详细地址" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="邮箱密码" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="辅助邮箱" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="辅助邮箱密码" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="信用卡号" align="center"></el-table-column>
				<el-table-column prop="OrderTime" label="注册时间" align="center"></el-table-column>
				<el-table-column prop="Status" label="状态" align="center"></el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button size="small" type="primary" @click="RedistributionAccount(scope.$index, scope.row)">打开浏览器
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 新建、修改-->
		<el-dialog :title="title" :visible.sync="registerModel" :close-on-click-modal="false" :before-close="closeModel">
			<el-form :model="registerForm" ref="registerForm" :rules="editRules" class="demo-dynamic" label-width="80px" status-icon>
				<el-form-item label="平台" prop="platform">
					<el-radio-group v-model="registerForm.platform" class="disInline">
						<el-radio label="全部"></el-radio>
						<el-radio label="Amazon"></el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="国家" prop="countryId" class="country">
					<el-select v-model="registerForm.countryId" placeholder="请选择国家" style="width: 100%;">
								<el-option label="美国" value="美国"></el-option>
								<el-option label="加拿大" value="加拿大"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="默认网址">

				</el-form-item>
				<el-form-item label="账号" prop="account">
					<el-input v-model="registerForm.account"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="pwd">
					<el-input v-model="registerForm.pwd"></el-input>
				</el-form-item>
				<el-form-item label="姓名" prop="username">
					<el-input v-model="registerForm.username"></el-input>
				</el-form-item>
				<el-form-item label="电话" prop="phone">
					<el-input v-model="registerForm.phone"></el-input>
				</el-form-item>
				<el-form-item label="省/州" prop="province">
					<el-input v-model="registerForm.province"></el-input>
				</el-form-item>
				<el-form-item label="城市" prop="city">
					<el-input v-model="registerForm.city"></el-input>
				</el-form-item>
				<el-form-item label="邮编" prop="postalCode">
					<el-input v-model="registerForm.postalCode"></el-input>
				</el-form-item>
				<el-form-item label="详细地址" prop="address">
					<el-input v-model="registerForm.address"></el-input>
				</el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" v-model="registerForm.remark"></el-input>
				</el-form-item>
				<div class="textCen">
					<el-button type="primary">确定</el-button>
					<el-button @click="closeModel">取消</el-button>
				</div>
			</el-form>
		</el-dialog>
		<!-- 删除-->
		<el-dialog title="温馨提示" :visible.sync="delModel" :close-on-click-modal="false" center="" width="30%">
			<div class="del-dialog-cnt textCen">确认要删除该注册账号记录吗？</div>
			<span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium">确定</el-button>
        <el-button @click="delModel=false" size="medium">取消</el-button>
      </span>
		</el-dialog>
		<!--自动注册-->
		<el-dialog title="温馨提示" :visible.sync="automaticLogonModal" :close-on-click-modal="false" center="" width="30%">
			<div class="del-dialog-cnt textCen">确认要自动注册所有未注册的账号吗？</div>
			<span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium">确定</el-button>
        <el-button @click="automaticLogonModal=false" size="medium">取消</el-button>
      </span>
		</el-dialog>
		<!-- 重新分配-->
		<el-dialog title="买号等级分配信息" :visible.sync="accountModel" width="90%" :close-on-click-modal="false" :before-close="closeBuyNum">
			<el-collapse-transition>
				<div class="searchBox mb20" v-show="accountSearchModel">
					<el-form ref="accountSearchForm" :model="accountSearchForm" class="form-item" label-width="80px">
						<el-row class="pt20">
							<el-col :xs="24" :span="5" :sm="9" :md="8" :lg="5">
								<el-form-item label="搜索内容">
									<el-input v-model="accountSearchForm.searchKeyWords" placeholder="请输入类型搜索" class="disInline"></el-input>
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
				<el-button size="medium" type="primary" @click="editParamValue" :disabled="disabled1"><i class="el-icon-edit-outline"></i>修改参数值
				</el-button>
				<el-button size="medium" @click="accountSearchShow"><i class="el-icon-search"></i>检索</el-button>
			</div>
			<el-table :data="buyNumData" border style="width: 100%" :default-sort="{prop: 'Numbers', order: 'descending'}" @selection-change="buyHandleSelectionChange">
				<el-table-column type="selection"></el-table-column>
				<el-table-column prop="Numbers" label="类型" sortable align="center"></el-table-column>
				<el-table-column prop="CountryId" label="名称" sortable align="center"></el-table-column>
				<el-table-column prop="ProductByASIN" label="值" sortable align="center"></el-table-column>
				<el-table-column prop="Status" label="状态" sortable align="center"></el-table-column>
				<el-table-column prop="ProductPrice" label="备注信息" align="center"></el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button size="small" type="primary">禁用</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="mt20 modelRight">
				<el-button type="primary">确定</el-button>
				<el-button @click="closeBuyNum">关闭</el-button>
			</div>
		</el-dialog>
		<!-- 修改参数值-->
		<el-dialog title="修改参数值" :visible.sync="paramModel" :close-on-click-modal="false" width="20%">
			<el-form :model="paramForm">
				<el-form-item>
					<el-input v-model="paramForm.values"></el-input>
				</el-form-item>
				<el-form-item class="modelRight">
					<el-button type="primary">确定</el-button>
					<el-button @click="paramModel=false">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!--国家-->
		<el-dialog title="选择国家" :visible.sync="countryModal" :close-on-click-modal="false">
			<el-form :model="countryData" ref="countryData" class="demo-dynamic" label-width="100px">
				<el-row>
					<el-col :xs="24" :span="7" :sm="9" :md="8" :lg="10">
						<el-form-item label="国家">
							<el-input type="text" v-model="countryData.country"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :span="5" :sm="10" :md="8" :lg="5" class="ml20">
						<el-button type="primary">搜索</el-button>
						<el-button>重置</el-button>
					</el-col>
				</el-row>
			</el-form>
			<el-table :data="buyNumData" border style="width: 100%" @row-click="showRow">
				<el-table-column show-overflow-tooltip width="50px">
					<template slot-scope="scope">
						<el-radio class="radio" v-model="radio" :label="scope.$index">&nbsp;</el-radio>
					</template>
				</el-table-column>
				<el-table-column prop="CountryId" label="国家名称" align="center"></el-table-column>
				<el-table-column prop="Numbers" label="国家缩写" align="center"></el-table-column>
				<el-table-column prop="Remark" label="备注" align="center"></el-table-column>
			</el-table>
			<div class="mt20 modelRight">
				<el-button type="primary" @click="confirmCountry">确定</el-button>
				<el-button @click="countryModal=false">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'registerAccount',
		data() {
			return {
				radio: '',
				title: '新建',
				automaticLogonModal: false,
				countryModal: false,
				disabled: true,
				disabled1: true,
				registerModel: false,
				delModel: false,
				accountModel: false,
				paramModel: false,
				accountSearchModel: false,
				checkBoxData: [],
				buyCheckData: [],
				searchModel: false,
				buyNumData: [],
				selected: {},
				pickerEndDate: this.pickerOptionsEnd(),
				pickerStartDate: this.searchStartDate(),
				buyNumberLevelData: [{
					level: 'A'
				},{
					level: 'B'
				}],
				CreditCardData: [{
						types: '白金卡'
					},
					{
						status: '白银卡'
					}
				],
				registerForm: {
					platform: '全部',
					countryId: '',
					account: '',
					pwd: '',
					username: '',
					phone: '',
					province: '',
					city: '',
					postalCode: '',
					address: '',
					remark: ''
				},
				editRules: {
					platform: [{
						required: true,
						message: '请选择平台',
						trigger: 'change'
					}],
					countryId: [{
						required: true,
						message: '请选择国家',
						trigger: 'blur'
					}],
					account: [{
						required: true,
						message: '请输入账号',
						trigger: 'blur'
					}],
					pwd: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}],
					username: [{
						required: true,
						message: '请输入姓名',
						trigger: 'blur'
					}],
					phone: [{
						required: true,
						message: '请输入电话',
						trigger: 'blur'
					}],
					province: [{
						required: true,
						message: '请输入省/州',
						trigger: 'blur'
					}],
					city: [{
						required: true,
						message: '请输入城市',
						trigger: 'blur'
					}],
					postalCode: [{
						required: true,
						message: '请输入邮编',
						trigger: 'blur'
					}],
					address: [{
						required: true,
						message: '请输入详细地址',
						trigger: 'blur'
					}]
				},
				searchForm: {
					type: [],
					platform: '全部',
					isComment: '是',
					searchkeywords: '',
					orderStartTime: '',
					orderEndTime: '',
					CreditCard: '',
					buyNumberLevel: ''
				},
				accountSearchForm: {
					searchKeyWords: ''
				},
				paramForm: {
					values: ''
				},
				countryData: {
					country: ''
				},
				activeName: 'first',
				allNum: '0',
				active: '1'
			}
		},
		created() {
			this.getAllData()
		},
		methods: {
			showRow(row) {
				//赋值给radio
				this.radio = this.buyNumData.indexOf(row);
				this.selected = row;
			},
			// 选择国家确定
			confirmCountry() {
				let _this = this
				_this.countryModal = false
				let country = _this.selected.CountryId
				_this.registerForm.countryId = country

			},
			// 选择国家弹窗
			selectCountry() {
				let _this = this
				_this.countryModal = true
			},
			// 重置
			resetSearch() {
				let _this = this
				_this.searchForm = {
					platform: '全部',
					searchkeywords: '',
					orderStartTime: '',
					orderEndTime: '',
					status: ''
				}
			},
			// 下单开始时间
			searchStartDate() {
				return {
					disabledDate: time => {
						let endDateVal = this.searchForm.orderEndTime
						if(endDateVal) {
							return time.getTime() > new Date(endDateVal).getTime()
						}
					}
				}
			},
			// 搜索下单结束时间
			pickerOptionsEnd() {
				return {
					disabledDate: time => {
						let beginDateVal = this.searchForm.orderStartTime
						if(beginDateVal) {
							return(
								time.getTime() <
								new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
							)
						}
					}
				}
			},
			// 修改参数值
			editParamValue() {
				let _this = this
				_this.paramModel = true
			},
			// 分配信息
			RedistributionAccount(index, row) {
				let _this = this
				_this.accountModel = true
				_this.getAllData()
			},
			// 分配信息检索
			accountSearchShow() {
				let _this = this
				let sear = _this.accountSearchModel
				if(sear) {
					_this.accountSearchModel = false
				} else {
					_this.accountSearchModel = true
				}
			},
			// 新建弹窗
			addLevel() {
				let _this = this
				_this.registerModel = true
			},
			// 修改弹窗
			editLevel() {
				let _this = this
				_this.registerModel = true
				_this.title = '修改'
				let item = _this.checkBoxData
				_this.registerForm.account = item[0].Numbers
			},
			// 关闭修改价格弹窗
			closeModel() {
				let _this = this
				_this.registerModel = false
				_this.registerForm = {
					platform: '全部',
					countryId: '',
					account: '',
					pwd: '',
					username: '',
					phone: '',
					province: '',
					city: '',
					postalCode: '',
					address: '',
					remark: ''
				}
			},
			// 删除记录
			delHandel() {
				let _this = this
				_this.delModel = true
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
			// 买号等级分配是否有选中
			buyHandleSelectionChange(val) {
				let _this = this
				_this.buyCheckData = val
				let checkNum = _this.buyCheckData.length
				if(checkNum !== 1) {
					_this.disabled1 = true
				} else {
					_this.disabled1 = false
				}
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
			getAllData() {
				let _this = this
				_this.active = 1
				_this.axios.get(_this.GLOBAL.BASE_URL + 'api/OrderManagement/AddOrderByType').then((res) => {
					_this.buyNumData = res.data.data
					_this.allNum = res.data.data.length
				}).catch((error) => {
					console.log(error)
				})
			},
			//  账号分配窗口关闭
			closeBuyNum() {
				let _this = this
				_this.disabled1 = true
				_this.accountModel = false
				_this.buyCheckData = []
			}
		}
	}
</script>

<style>

</style>