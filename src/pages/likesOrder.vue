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
					<el-form-item label="国家">
						<el-select placeholder="请选择" v-model="searchForm.countryId" class="minWid">
							<el-option v-for="(item,index) in countryData" :key="index" :value="index" :label="item.country"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="下单时间">
						<el-date-picker v-model="searchForm.orderStartTime" type="date" placeholder="选择开始时间" :picker-options="pickerStartDate" value-format="yyyy-MM-dd" class="mb10"></el-date-picker>
						<el-date-picker v-model="searchForm.orderEndTime" type="date" placeholder="选择结束时间" :picker-options="pickerEndDate" value-format="yyyy-MM-dd"></el-date-picker>
					</el-form-item>
					<el-row>
						<el-col :xs="24" :span="5" :sm="9" :md="8" :lg="4">
							<el-form-item label="关键字">
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
			<el-button type="success" size="medium" :disabled="disabled" @click="editPrice"><i class="el-icon-edit-outline"></i>修改价格
			</el-button>
			<!--<el-button type="success" size="medium"><i class="el-icon-edit"></i>自动分配</el-button>-->
			<el-button type="primary" size="medium"><i class="el-icon-folder-opened"></i>订单导入</el-button>
			<el-button type="primary" size="medium"><i class="el-icon-document-delete"></i>导出</el-button>
			<el-input placeholder="搜索" prefix-icon="el-icon-search" class="listSearchInput" @click.native="searchShow" readonly></el-input>
		</div>
		<div class="tabList">
			<ul class="tabBlock">
				<li :class="active === 1 ? 'active':''" @click="getAllData()" :data-index="1">全部<span>({{allNum}})</span></li>
				<li :class="active === 2 ? 'active':''" :data-index="2" @click="daiBuy">待付款<span>(0)</span></li>
				<li :class="active === 3 ? 'active':''" :data-index="3" @click="daifh">待确认<span>(0)</span></li>
				<li :class="active === 4 ? 'active':''" :data-index="4" @click="daicl">待处理<span>(0)</span></li>
				<li :class="active === 5 ? 'active':''" :data-index="5" @click="daish">待分配<span>(0)</span></li>
				<li :class="active === 6 ? 'active':''" :data-index="6" @click="daipj">已分配<span>(0)</span></li>
				<li :class="active === 7 ? 'active':''" :data-index="7" @click="ywc">已完成<span>(0)</span></li>
				<li :class="active === 8 ? 'active':''" :data-index="8" @click="errData">已取消<span>(0)</span></li>
			</ul>
		</div>
		<div class="mt10">
			<el-table v-loading="loading" :data="orderPlaceData" style="width: 100%" :header-cell-style="{background:'#fafafa'}" @selection-change="handleSelectionChange">
				<el-table-column type="selection"></el-table-column>
				<el-table-column prop="Numbers" label="下单单号" align="center" width="200">
					<template slot-scope="scope">
						<el-button type="text" @click="viewTaskDetails(scope.$index,scope.row)">{{scope.row.Numbers}}</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="CountryId" label="平台/国家" align="center"></el-table-column>
				<el-table-column prop="ProductByASIN" label="终端平台" align="center"></el-table-column>
				<el-table-column prop="ProductByASIN" label="产品ASIN" align="center"></el-table-column>
				<el-table-column prop="ProductPrice" label="产品价格" align="center" class-name="red"></el-table-column>
				<el-table-column prop="ServiceType" label="任务数" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="产品总额" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="服务费" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="合计金额" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="交易流水" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="付款金额" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="客户编码" align="center"></el-table-column>
				<el-table-column prop="OrderTime" label="下单时间" align="center"></el-table-column>
				<el-table-column prop="Status" label="订单状态" align="center" width="100"></el-table-column>
				<el-table-column label="操作" align="center" width="300">
					<template slot-scope="scope">
						<el-button size="small" type="primary" @click="viewTask(scope.$index,scope.row)">查看任务</el-button>
						<el-button size="small" @click="cancelReason(scope.$index,scope.row)">取消原因</el-button>
						<el-button size="small" type="success" v-if="scope.row.Status==='待确认付款'" @click="confirmPayHandel(scope.$index,scope.row)">确认付款
						</el-button>
						<el-button size="small" type="warning" v-if="scope.row.Status ==='待确认付款'">分配买号</el-button>
						<el-button size="small" type="danger" v-if="scope.row.Status === '待确认付款'" @click="cancelHandel(scope.$index, scope.row)">取消
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<el-dialog title="修改价格" :visible.sync="editPricceModel" :close-on-click-modal="false" :before-close="closeModel">
			<el-form :model="editPriceForm" :rules="editRules" label-width="125px" status-icon>
				<el-form-item label="点赞服务费" prop="likesServiceFree">
					<el-input v-model="editPriceForm.likesServiceFree"></el-input>
				</el-form-item>
				<el-form-item label="汇率" prop="exchangeRate">
					<el-input v-model="editPriceForm.exchangeRate"></el-input>
				</el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" v-model="editPriceForm.remark"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary">确定</el-button>
					<el-button @click="closeModel">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!-- 查看任务-->
		<el-dialog :title="title" :visible.sync="viewTaskModel" width="90%" :close-on-click-modal="false">
		<viewTask></viewTask>
		<div class="mt20 modelRight">
			<el-button @click="viewTaskModel=false" type="primary">关闭</el-button>
		</div>
		</el-dialog>
		<!-- 取消原因-->
		<el-dialog title="取消原因" :visible.sync="reasonModel" :close-on-click-modal="false" width="40%">
			<div class="reasonCon mb20">
				<span>客户取消</span>
			</div>
			<div class="modelRight">
				<el-button type="primary" @click="reasonModel=false">关闭</el-button>
			</div>
		</el-dialog>
		<!-- 确认付款-->
		<el-dialog title="温馨提示" :visible.sync="confirmPaymentModel" :close-on-click-modal="false" center="" width="30%">
			<div class="del-dialog-cnt textCen">确认要修改该订单付款状态吗？</div>
			<span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium">是</el-button>
        <el-button @click="confirmPaymentModel=false" size="medium">否</el-button>
      </span>
		</el-dialog>
		<!-- 取消-->
		<el-dialog title="温馨提示" :visible.sync="cancelPaymentModel" :close-on-click-modal="false" center="" width="30%">
			<div class="del-dialog-cnt textCen">确认要取消该订单吗？</div>
			<span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium">是</el-button>
        <el-button @click="cancelPaymentModel=false" size="medium">否</el-button>
      </span>
		</el-dialog>
		<!--任务订单详情-->
		<el-dialog :title='orderTitle' :visible.sync="viewTaskDateilsModel" width="60%" :close-on-click-modal="false">
			<orderDetail :order-data="this.orderDetail"></orderDetail>
		</el-dialog>
	</div>
</template>

<script>
	import viewTask from '../common/viewTask'
	import orderDetail from '../common/orderDetail'
	export default {
		name: 'likesOrder',
		data() {
			return {
				orderTitle: '',
				viewTaskDateilsModel: false,
				loading: true,
				title: '',
				confirmPaymentModel: false,
				cancelPaymentModel: false,
				reasonModel: false,
				viewTaskModel: false,
				disabled: true,
				searchModel: false,
				editPricceModel: false,
				orderPlaceData: [],
				countryData: [{
						country: '美国'
					},
					{
						country: '加拿大'
					}
				],
				searchForm: {
					platform: '全部',
					searchkeywords: '',
					orderStartTime: '',
					orderEndTime: '',
					countryId: ''
				},
				editPriceForm: {
					likesServiceFree: '',
					exchangeRate: '',
					remark: ''
				},
				editRules: {
					likesServiceFree: [{
						required: true,
						message: '请输入点赞服务费',
						trigger: 'blur'
					}],
					exchangeRate: [{
						required: true,
						message: '请输入汇率',
						trigger: 'blur'
					}]
				},
				orderDetail: {
					Forum: '',
					CountryId: '',
				},
				pickerEndDate: this.pickerOptionsEnd(),
				pickerStartDate: this.searchStartDate(),
				activeName: 'first',
				allNum: '0',
				active: '1'
			}
		},
		components:{
			viewTask,
			orderDetail
		},
		created() {
			this.getAllData()
		},
		methods: {
			// 查看订单详情弹窗
			viewTaskDetails(index, row) {
				let _this = this
				_this.viewTaskDateilsModel = true
				let item = _this.orderPlaceData[index]
				let num = item.Numbers
				_this.orderTitle = '订单：' + num + '的详情信息'
				_this.orderDetail.Forum = item.Forum
				_this.orderDetail.CountryId = item.CountryId
			},
			// 重置
			resetSearch() {
				let _this = this
				_this.searchForm = {
					platform: '全部',
					searchkeywords: '',
					orderStartTime: '',
					orderEndTime: '',
					countryId: ''
				}
			},
			// 取消弹窗
			cancelHandel(index, row) {
				let _this = this
				_this.cancelPaymentModel = true
			},
			// 确认付款弹窗
			confirmPayHandel(index, row) {
				let _this = this
				_this.confirmPaymentModel = true
			},
			// 取消原因弹窗
			cancelReason(index, row) {
				let _this = this
				_this.reasonModel = true
			},
			// 查看任务弹窗
			viewTask(index, row) {
				let _this = this
				_this.viewTaskModel = true
				let item = _this.orderPlaceData[index]
				let num = item.Numbers
				_this.title = '订单：' + num + '的任务信息'
			},
			// 修改价格弹窗
			editPrice() {
				let _this = this
				_this.editPricceModel = true
			},
			// 关闭修改价格弹窗
			closeModel() {
				let _this = this
				_this.editPricceModel = false
				_this.editPriceForm = {}
			},
			// 是否有选中
			handleSelectionChange(val) {
				this.checkBoxData = val
				let checkNum = this.checkBoxData.length
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
					_this.loading = false
				}).catch((error) => {
					console.log(error)
				})
			},
			// 待付款
			daiBuy() {
				let _this = this
				_this.active = 2
				_this.orderPlaceData = []
			},
			// 待确认
			daifh() {
				let _this = this
				_this.active = 3
				_this.orderPlaceData = []
			},
			// 待处理
			daicl() {
				let _this = this
				_this.active = 4
				_this.orderPlaceData = []
			},
			// 待分配
			daish() {
				let _this = this
				_this.active = 5
				_this.orderPlaceData = []
			},
			// 已分配
			daipj() {
				let _this = this
				_this.active = 6
				_this.orderPlaceData = []
			},
			// 已完成
			ywc() {
				let _this = this
				_this.active = 7
				_this.orderPlaceData = []
			},
			// 已取消
			errData() {
				let _this = this
				_this.active = 8
				_this.orderPlaceData = []
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
			}
		}
	}
</script>

<style scoped>

</style>