<template>
	<!--查看任务-->
	<div>
		<el-collapse-transition>
			<div class="searchBox mb20" v-show="taskSearchModel">
				<el-form ref="accountSearchForm" :model="taskSearchForm" class="form-item" label-width="80px">
					<el-row class="pt20">
						<el-col :xs="24" :span="5" :sm="9" :md="8" :lg="5">
							<el-form-item label="任务状态" class="disInline">
								<el-select v-model="taskSearchForm.taskStatus" placeholder="请选择任务状态" class="disInline">
									<el-option label="待购买" value="dgm"></el-option>
									<el-option label="待发货" value="dfh"></el-option>
									<el-option label="待收货" value="dsh"></el-option>
									<el-option label="待评价" value="dpj"></el-option>
									<el-option label="已完成" value="ywc"></el-option>
									<el-option label="订单异常" value="yc"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :xs="24" :span="5" :sm="9" :md="8" :lg="5">
							<el-form-item label="搜索内容">
								<el-input v-model="taskSearchForm.searchKeyWords" placeholder="请输入类型搜索" class="disInline"></el-input>
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
			<el-button size="medium" @click="taskSearchShow"><i class="el-icon-search"></i>检索</el-button>
		</div>
		<el-table :data="orderPlaceData" style="width: 100%" :header-cell-style="{background:'#fafafa'}" :default-sort="{prop: 'Numbers', order: 'descending'}">
			<el-table-column prop="Numbers" label="任务编码" sortable align="center"></el-table-column>
			<el-table-column prop="CountryId" label="平台/国家" sortable align="center"></el-table-column>
			<el-table-column prop="ProductByASIN" label="产品ASIN" sortable align="center"></el-table-column>
			<el-table-column prop="ProductName" label="产品名称" sortable align="center"></el-table-column>
			<el-table-column prop="ProductPrice" label="产品价格" sortable align="center"></el-table-column>
			<el-table-column prop="OrderNote" label="订单备注" align="center"></el-table-column>
			<el-table-column prop="ProductPrice" label="买号" align="center"></el-table-column>
			<el-table-column prop="ProductPrice" label="刷手" align="center"></el-table-column>
			<el-table-column prop="OrderTime" label="任务开始时间" align="center"></el-table-column>
			<el-table-column prop="Status" label="任务状态" sortable align="center"></el-table-column>
			<el-table-column prop="Remark" label="备注信息" align="center"></el-table-column>
		</el-table>
		<div class="mt20 modelRight">
			<el-button @click="viewTaskModel=false" type="primary">关闭</el-button>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'viewTask',
		data() {
			return {
				searchFrom:{
					keyWord:''
				},
				radio: '',
				selected: {},
				taskSearchModel: false,
				orderPlaceData: [],
				taskSearchForm: {
					taskStatus: '',
					searchKeyWords: ''
				},
			}
		},
		created() {
			this.getAllData() 
		},
		methods: {
			getAllData() {
				let _this = this
				_this.axios.get(_this.GLOBAL.BASE_URL + 'api/OrderManagement/AddOrderByType').then((res) => {
					_this.orderPlaceData = res.data.data
				}).catch((error) => {
					console.log(error)
				})
			},
			showRow(row) {
				//赋值给radio
				this.radio = this.orderPlaceData.indexOf(row);
				this.selected = row;
			},
			// 查看任务检索
			taskSearchShow() {
				let _this = this
				let sear = _this.taskSearchModel
				if(sear) {
					_this.taskSearchModel = false
				} else {
					_this.taskSearchModel = true
				}
			},
		}
	}
</script>

<style>
</style>
