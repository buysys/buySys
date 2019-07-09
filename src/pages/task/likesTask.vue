<template>
	<div class="container">
		<el-collapse-transition>
			<div class="searchBox mb20" v-show="searchModel">
				<el-form ref="searchForm" :model="searchForm" class="form-item" label-width="80px">
					<el-form-item label="平台" class="disInline">
						<el-radio-group v-model="searchForm.platform" class="disInline">
							<el-radio label="全部"></el-radio>
							<el-radio label="Amazon"></el-radio>
						</el-radio-group>
					</el-form-item>
					<el-row>
						<el-col :xs="24" :span="5" :sm="9" :md="8" :lg="4">
							<el-form-item label="搜索内容">
								<el-input v-model="searchForm.searchkeywords" placeholder="请输入关键字" class="disInline"></el-input>
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
			<el-button type="success" size="medium" :disabled="disabled" @click="RedistributionAccount"><i class="el-icon-sort"></i>重新分配买号
			</el-button>
			<el-input placeholder="搜索" prefix-icon="el-icon-search" class="listSearchInput" @click.native="searchShow"></el-input>
			<!--<el-button size="medium" @click="searchShow"><i class="el-icon-search"></i>检索</el-button>-->
		</div>
		<div class="tabList">
			<ul class="tabBlock">
				<li :class="active === 1 ? 'active':''" @click="getAllData()" :data-index="1">全部<span>({{allNum}})</span></li>
				<li :class="active === 2 ? 'active':''" :data-index="2" @click="dzx">待执行<span>(0)</span></li>
				<li :class="active === 3 ? 'active':''" :data-index="3" @click="ywc">已完成<span>(0)</span></li>
			</ul>
		</div>
		<div class="mt10">
			<el-table :data="orderPlaceData" border style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="selection"></el-table-column>
				<el-table-column prop="Numbers" label="任务编码" align="center" width="200">
					<template slot-scope="scope">
						<el-button type="text" @click="viewTaskDetails(scope.$index,scope.row)">{{scope.row.Numbers}}</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="CountryId" label="平台/国家" align="center"></el-table-column>
				<el-table-column prop="ProductByASIN" label="终端平台" align="center"></el-table-column>
				<el-table-column prop="ProductByASIN" label="产品ASIN" align="center"></el-table-column>
				<el-table-column prop="ProductByASIN" label="产品名称" align="center"></el-table-column>
				<el-table-column prop="ProductPrice" label="产品价格" align="center"></el-table-column>
				<el-table-column prop="ServiceType" label="买号" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="买号状态" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="刷手" align="center"></el-table-column>
				<el-table-column prop="OrderTime" label="执行时间" align="center"></el-table-column>
				<el-table-column prop="Status" label="任务状态" align="center"></el-table-column>
				<el-table-column prop="Status" label="客户编码" align="center"></el-table-column>
				<el-table-column label="操作" align="center" width="350">
					<template slot-scope="scope">
						<el-button size="small" type="primary" @click="viewTaskDetails(scope.$index,scope.row)">查看任务</el-button>
						<el-button size="small">打开浏览器</el-button>
						<el-button size="small" @click='systemConfig(scope.$index,scope.row)'>系统配置</el-button>
						<el-button size="small" type="success" v-if="scope.row.Status==='待确认付款'">执行</el-button>
						<el-button size="small" type="primary" @click="logHandel(scope.$index, scope.row)">日志</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!--重新分配账号-->
		<el-dialog title="重新分配账号" :visible.sync="accountModel" width="90%" :close-on-click-modal="false">
			<buyNum v-on:listenTochildEvent="showMessageFromChild"></buyNum>
			<div class="mt20 modelRight">
				<el-button type="primary" @click="confirmCountry">确定</el-button>
				<el-button @click="accountModel=false">关闭</el-button>
			</div>
		</el-dialog>
		<!--系统配置-->
		<el-dialog :title='buyNum' :visible.sync='systemConfigModal' :close-on-click-modal='false'>
			<el-form class='viewMl50'>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label='代理IP：'>
							<span>112.0.23.2</span>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label='内网IP：'>
							<span>112.0.23.2</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label='默认网址：'>
					<span>www.baidu.com</span>
				</el-form-item>
				<el-form-item label='买号ID：'>
					<span>799b78de13f74c4295ed0acb98b96880</span>
				</el-form-item>
				<el-form-item label='登录账号：'>
					<span>tamsindawson88@gmail.com</span>
				</el-form-item>
				<el-form-item label='登录密码：'>
					<span>6880</span>
				</el-form-item>
				<el-form-item label='操作系统：'>
					<span>Windows</span>
				</el-form-item>
				<el-form-item label='UserAgent：'>
					<span>Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US) AppleWebKit/530.4 (KHTML, like Gecko) Chrome/2.0.171.0 Safari/530.4</span>
				</el-form-item>
				<el-form-item label='浏览器版本号：'>
					<span>5.0 (Windows; U; Windows NT 6.0; en-US) AppleWebKit/530.4 (KHTML, like Gecko) Chrome/2.0.171.0 Safari/530.4</span>
				</el-form-item>
				<el-form-item label='浏览器语言：'>
					<span>EN</span>
				</el-form-item>
				<el-form-item label='浏览器插件：'>
					<span>Chrome PDF Plugin,Chrome PDF Viewer,Native Client</span>
				</el-form-item>
				<el-form-item label='屏幕分辨率：'>
					<span>1366*768</span>
				</el-form-item>
				<el-form-item label='CPU核心数：'>
					<span>8</span>
				</el-form-item>
				<el-form-item label='系统字体数：'>
					<span>311</span>
				</el-form-item>
				<el-form-item label='时区：'>
					<span>UTC-05:00</span>
				</el-form-item>
				<el-row>
					<el-col :span='8' :xs='24'>
						<el-form-item label='屏幕颜色深度：'>
							<span>323</span>
						</el-form-item>
					</el-col>
					<el-col :span='8' :xs='24'>
						<el-form-item label='授权账号：'>
							<span>323</span>
						</el-form-item>
					</el-col>
					<el-col :span='8' :xs='24'>
						<el-form-item label='授权密码：'>
							<span>323</span>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-dialog>
		<!--查看详情-->
		<el-dialog :title='orderTitle' :visible.sync="viewTaskDateilsModel" :close-on-click-modal="false" width="60%">
			<el-form class="demo-item">
				<div class="fz16">订单信息</div>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label="平台：">
							<span>的说法是否</span>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label="终端平台：">
							<span>erww</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb10">
					<el-col :span='6' :xs='12'>
						<el-form-item label="链接地址">
							<span></span>
						</el-form-item>
					</el-col>
					<el-col :span='6' :xs='8'>
						<el-form-item label="操作选项">
							<span></span>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='4'>
						<el-form-item label="数量">
							<span></span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="items mb10">
					<el-col :span='6' :xs="12" class="ml60">
							<span>https://www.pdfs.com</span>
					</el-col>
					<el-col :span='6' :xs="8" class="ml60">
							<span>点赞</span>
					</el-col>
					<el-col :span='8' :xs="4">
							<span>2</span>
					</el-col>
				</el-row>
			</el-form>
		</el-dialog>
		<!--日志-->
		<el-dialog title="操作日志" :visible.sync="logModel" :close-on-click-modal="false" center="" width="30%">
			<div class="block">
			  <el-timeline>
				<el-timeline-item timestamp="2019/7/10" placement="top">
				  <el-card>
					<h4>评论</h4>
					<p>王小虎 在 2019/7/10 20:55 评论</p>
				  </el-card>
				</el-timeline-item>
				<el-timeline-item timestamp="2019/7/9" placement="top">
				  <el-card>
					<h4>评价</h4>
					<p>王小虎 在 2019/7/9 20:46 评价</p>
				  </el-card>
				</el-timeline-item>
				<el-timeline-item timestamp="2019/7/8" placement="top">
				  <el-card>
					<h4>付款</h4>
					<p>王小虎 在 2019/7/8 14:25 付款</p>
				  </el-card>
				</el-timeline-item>
				<el-timeline-item timestamp="2019/7/7" placement="top">
				  <el-card>
					<h4>下单</h4>
					<p>王小虎 在 2019/7/7 15:55 下单</p>
				  </el-card>
				</el-timeline-item>
			  </el-timeline>
			</div>
			<p style="text-align: center;"><el-button @click="logModel=false" size="medium">关闭</el-button></p>
		</el-dialog>
	</div>
</template>

<script>
	import buyNum from '../../common/buyNum'
	export default {
		name: 'likesTask',
		data() {
			return {
				buyNum:'',
				radio: '',
				logModel: false,//日志
				systemConfigModal: false, //系统配置
				accountModel: false,
				accountSearchModel: false,
				disabled: true,
				accountModel: false,
				viewTaskDateilsModel: false,
				orderTitle: '',
				checkBoxData: [],
				searchModel: false,
				accountSearchModel: false,
				orderPlaceData: [],
				pickerEndDate: this.pickerOptionsEnd(),
				pickerStartDate: this.searchStartDate(),
				selected: {},
				accountSearchForm: {
					searchKeyWords: ''
				},
				countryData: [{
						country: '美国'
					},
					{
						country: '加拿大'
					}
				],
				searchForm: {
					platform: '全部',
					searchkeywords: ''
				},
				accountSearchForm: {
					type: [],
					startTime: '',
					endTime: '',
					searchKeyWords: ''
				},
				activeName: 'first',
				allNum: '0',
				active: '1'
			}
		},
		components:{
			buyNum
		},
		created() {
			this.getAllData()
		},
		methods: {
			// 子组件选中的
			showMessageFromChild(data){
				console.log(data.CountryId)
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
			// 日志弹窗
			logHandel(index, row) {
				let _this = this
				_this.logModel = true
			},
			// 系统配置
			systemConfig(index, row) {
				let _this = this
				_this.systemConfigModal = true
				let item = _this.orderPlaceData[index]
				let num = item.Numbers
				_this.buyNum = '买号：' + num + '系统配置'
			},
			showRow(row) {
				//赋值给radio
				this.radio = this.orderPlaceData.indexOf(row);
				this.selected = row;
			},
			//重新分配买号
			account() {
				let _this = this
				_this.accountModel = true
			},
			// 重新分配选择确定
			confirmCountry() {
				let _this = this
				_this.accountModel = false

			},
			// 重置
			resetSearch() {
				let _this = this
				_this.searchForm = {
					platform: '全部',
					searchkeywords: ''
				}
			},
			// 重新分配账号
			RedistributionAccount() {
				let _this = this
				_this.accountModel = true
			},
			// 重新分配账号检索
			accountSearchShow() {
				let _this = this
				let sear = _this.accountSearchModel
				if(sear) {
					_this.accountSearchModel = false
				} else {
					_this.accountSearchModel = true
				}
			},
			// 查看任务详情弹窗
			viewTaskDetails(index, row) {
				let _this = this
				_this.viewTaskDateilsModel = true
				let item = _this.orderPlaceData[index]
				let num = item.Numbers
				_this.orderTitle = '任务：' + num + '的详情信息'
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
					_this.orderPlaceData = res.data.data
					_this.allNum = res.data.data.length
				}).catch((error) => {
					console.log(error)
				})
			},
			// 待执行
			dzx() {
				let _this = this
				_this.active = 2
				_this.orderPlaceData = []
			},
			// 已完成
			ywc() {
				let _this = this
				_this.active = 3
				_this.orderPlaceData = []
			},
			// 注册开始时间
			searchStartDate() {
				return {
					disabledDate: time => {
						let endDateVal = this.accountSearchForm.endTime
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
						let beginDateVal = this.accountSearchForm.startTime
						if(beginDateVal) {
							return(
								time.getTime() <
								new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
							)
						}
					}
				}
			}
		}
	}
</script>

<style scoped>

</style>