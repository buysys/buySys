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
			<el-button type="success" size="medium" :disabled="disabled" @click="account"><i class="el-icon-sort"></i>重新分配买号
			</el-button>
			<el-button size="medium" @click="searchShow"><i class="el-icon-search"></i>检索</el-button>
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
				<el-table-column label="操作" align="center" width="320">
					<template slot-scope="scope">
						<el-button size="small" type="primary">查看任务</el-button>
						<el-button size="small">打开浏览器</el-button>
						<el-button size="small">系统配置</el-button>
						<el-button size="small" type="success" v-if="scope.row.Status==='待确认付款'">执行</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!--重新分配账号-->
		<el-dialog title="重新分配账号" :visible.sync="accountModel" width="90%" :close-on-click-modal="false">
			<el-collapse-transition>
				<div class="searchBox mb20" v-show="accountSearchModel">
					<el-form ref="accountSearchForm" :model="accountSearchForm" class="form-item" label-width="80px">
						<el-form-item label="标签类型" class="disInline">
							<el-checkbox-group v-model="accountSearchForm.type">
								<el-checkbox label="西班牙" name="type"></el-checkbox>
								<el-checkbox label="新人注册号" name="type"></el-checkbox>
								<el-checkbox label="加拿大" name="type"></el-checkbox>
								<el-checkbox label="手机测试" name="type"></el-checkbox>
							</el-checkbox-group>
						</el-form-item>
						<el-form-item label="注册时间">
							<el-date-picker v-model="accountSearchForm.startTime" type="date" placeholder="选择开始时间" :picker-options="pickerStartDate" value-format="yyyy-MM-dd" class="mb10"></el-date-picker>
							<el-date-picker v-model="accountSearchForm.endTime" type="date" placeholder="选择结束时间" :picker-options="pickerEndDate" value-format="yyyy-MM-dd"></el-date-picker>
						</el-form-item>
						<el-row>
							<el-col :xs="24" :span="5" :sm="9" :md="8" :lg="5">
								<el-form-item label="搜索内容">
									<el-input v-model="accountSearchForm.searchKeyWords" placeholder="请输入关键字" class="disInline"></el-input>
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
				<el-button size="medium" @click="accountSearchShow"><i class="el-icon-search"></i>检索</el-button>
			</div>
			<el-table :data="orderPlaceData" border style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column show-overflow-tooltip width="50px">
					<template slot-scope="scope">
						<el-radio class="radio" v-model="radio" :label="scope.$index">&nbsp;</el-radio>
					</template>
				</el-table-column>
				<el-table-column prop="Numbers" label="账号" align="center">
				</el-table-column>
				<el-table-column prop="CountryId" label="关联刷手" align="center"></el-table-column>
				<el-table-column prop="ProductByASIN" label="未完成任务数" align="center"></el-table-column>
				<el-table-column prop="ProductByASIN" label="标签" align="center"></el-table-column>
				<el-table-column prop="ProductPrice" label="首次购买" align="center"></el-table-column>
				<el-table-column prop="ServiceType" label="最近购买" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="信用卡类型" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="信用卡姓名" align="center"></el-table-column>
				<el-table-column prop="OrderTime" label="信用卡剩余总额度" align="center"></el-table-column>
				<el-table-column prop="Status" label="购物卡剩余总额度" align="center"></el-table-column>
				<el-table-column prop="OrderTime" label="信用卡累积消费" align="center"></el-table-column>
				<el-table-column prop="Status" label="购物卡累积消费" align="center"></el-table-column>
			</el-table>
			<div class="mt20 modelRight">
				<el-button type="primary" @click="confirmCountry">确定</el-button>
				<el-button @click="accountModel=false">关闭</el-button>
			</div>
		</el-dialog>
		<!--查看任务详情-->
		<el-dialog :title='orderTitle' :visible.sync="viewTaskDateilsModel" width="60%" :close-on-click-modal="false">
			<el-form class="demo-item">
				<div class="fz16">任务信息</div>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label="平台：">
							<span>Amazon</span>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label="国家：">
							<span>美国</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label="产品ASIN：">
							<span>D2342543654657</span>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label="店铺：">
							<span>nike</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label="产品名称：">
							<span>水淀粉</span>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label="产品价格：">
							<span>$100</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label="评论数：">
							<span>2</span>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label="产品评分：">
							<span>34</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='12' :xs='24' class="fleft">
						<el-form-item label="品类排名：">
							<span>2</span>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24' class="fright">
						<el-form-item label="产品图片：">
							<img class="proImg"></img>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24" class="fleft">
						<el-form-item label="产品链接：" class="wid">
							<span>http://www.pre.com</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label="关键词类型：">
							<span>产地是</span>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label="终端平台：">
							<span>PC</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label="产品关键词：">
							<span>产地是</span>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label="代购数量：">
							<span>3</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label="留评类型：">
							<span>100%</span>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label="FeedBack数量：">
							<span>3</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label="评论图片数量：">
							<span>2</span>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label="评论视频数量：">
							<span>2</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label="使用优惠券：">
							<span>否</span>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label="链接地址：">
							<span>https://www.sdfs.com</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="ml60 mb10 mt10">
					<el-col :span="6" :xs="11" :md="6">
						<!--<el-form-item label="任务开始时间"></el-form-item>-->
						<span>任务开始时间</span>
					</el-col>
					<el-col :span="6" :xs="2" :md="6" class="mb10">
						<span style="visibility: hidden;">hfh</span>
					</el-col>
					<el-col :span="8" :xs="11" :md="8" class="mb10 ml60">
						<span>数量</span>
					</el-col>
				</el-row>
				<el-row class="ml60">
					<el-col :span='6' :xs="24" class="mb10">
						<span>2019-07-02</span>
					</el-col>
					<el-col :span='6' :xs="24" class="mb10">
						<span>00:00-20:00</span>
					</el-col>
					<el-col :span='8' :xs="24" class="ml60">
						<span>2</span>
					</el-col>
				</el-row>
				<el-form-item label="备注：">
					<span>$23.00</span>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'wishTask',
		data() {
			return {
				radio: '',
				accountModel: false,
				accountSearchModel: false,
				orderTitle: '',
				viewTaskDateilsModel: false,
				disabled: true,
				checkBoxData: [],
				searchModel: false,
				orderPlaceData: [],
				selected: {},
				pickerEndDate: this.pickerOptionsEnd(),
				pickerStartDate: this.searchStartDate(),
				accountSearchForm: {
					type: [],
					startTime: '',
					endTime: '',
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
				activeName: 'first',
				allNum: '0',
				active: '1'
			}
		},
		created() {
			this.getAllData()
		},
		methods: {
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
			// 查看任务详情弹窗
			viewTaskDetails(index, row) {
				let _this = this
				_this.viewTaskDateilsModel = true
				let item = _this.orderPlaceData[index]
				let num = item.Numbers
				_this.orderTitle = '任务：' + num + '的详情信息'
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