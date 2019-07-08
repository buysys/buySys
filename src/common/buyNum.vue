<template>
<div>
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
	<el-table :data="orderPlaceData" border style="width: 100%" @row-click="showRow">
		<el-table-column show-overflow-tooltip width="50px">
			<template slot-scope="scope">
				<el-radio class="radio" v-model="radio" :label="scope.$index">&nbsp;</el-radio>
			</template>
		</el-table-column>
		<el-table-column prop="CountryId" label="账号" align="center"></el-table-column>
		<el-table-column prop="Numbers" label="是否留评" align="center"></el-table-column>
		<el-table-column prop="OrderNote" label="关联刷手" align="center"></el-table-column>
		<el-table-column prop="OrderNote" label="未完成任务" align="center"></el-table-column>
		<el-table-column prop="OrderNote" label="标签" align="center"></el-table-column>
		<el-table-column prop="OrderNote" label="首次购买" align="center"></el-table-column>
		<el-table-column prop="OrderNote" label="最近购买" align="center"></el-table-column>
		<el-table-column prop="OrderNote" label="信用卡类型" align="center"></el-table-column>
		<el-table-column prop="OrderNote" label="信用卡姓名" align="center"></el-table-column>
		<el-table-column prop="OrderNote" label="信用卡余额" align="center"></el-table-column>
		<el-table-column prop="OrderNote" label="购物卡余额" align="center"></el-table-column>
		<el-table-column prop="OrderNote" label="信用卡累积消费" align="center"></el-table-column>
		<el-table-column prop="OrderNote" label="购物卡累积消费" align="center"></el-table-column>
	</el-table>
</div>
</template>

<script>
	export default {
		name: 'buyNum',
		data() {
			return {
				radio:'',
				selected:{},
				accountSearchModel: false,
				orderPlaceData:[],
				accountSearchForm: {
					type: [],
					startTime: '',
					endTime: '',
					searchKeyWords: ''
				},
				pickerEndDate: this.pickerOptionsEnd(),
				pickerStartDate: this.searchStartDate()
			}
		},
		created(){
			this.getAllData()
		},
		methods: {
			 changeFather(){
             this.$emit("listenTochildEvent","我是子组件的参数");
          },
			// 重新分配选择确定
			confirmCountry() {
				let _this = this
				_this.accountModel = false

			},
			getAllData() {
				let _this = this
				_this.axios.get(_this.GLOBAL.BASE_URL + 'api/OrderManagement/AddOrderByType').then((res) => {
					_this.orderPlaceData = res.data.data
				}).catch((error) => {
					console.log(error)
				})
			},
			//赋值给radio
			showRow(row) {
				this.radio = this.orderPlaceData.indexOf(row);
				this.selected = row;
				this.$emit("listenTochildEvent",row);
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

<style>

</style>