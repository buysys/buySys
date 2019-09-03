<template>
	<div>
		<el-form :model="searchFrom" ref="searchFrom" class="demo-dynamic" label-width="100px">
			<el-row>
				<el-col :xs="24" :span="7" :sm="9" :md="8" :lg="10">
					<el-form-item label="搜索内容">
						<el-input type="text" v-model="searchFrom.keyWord"></el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :span="5" :sm="10" :md="8" :lg="5" class="ml20">
					<el-button type="primary">搜索</el-button>
					<el-button>重置</el-button>
				</el-col>
			</el-row>
		</el-form>
		<el-table :data="tableData" border style="width: 100%" @row-click="showRow">
			<el-table-column show-overflow-tooltip width="50px">
				<template slot-scope="scope">
					<el-radio class="radio" v-model="radio" :label="scope.$index">&nbsp;</el-radio>
				</template>
			</el-table-column>
			<el-table-column prop="Numbers" label="账号" align="center" width="180"></el-table-column>
			<el-table-column prop="CountryId" label="是否留评" align="center"></el-table-column>
			<el-table-column prop="OrderTime" label="关联刷手" align="center"></el-table-column>
			<el-table-column prop="ProductByASIN" label="未完成任务" align="center"></el-table-column>
			<el-table-column prop="ProductPrice" label="标签" align="center"></el-table-column>
			<el-table-column prop="ServiceType" label="首次购买" align="center"></el-table-column>
			<el-table-column prop="OrderNote" label="最近购买" align="center"></el-table-column>
			<el-table-column prop="OrderNote" label="信用卡类型" align="center"></el-table-column>
			<el-table-column prop="OrderNote" label="信用卡姓名" align="center"></el-table-column>
			<el-table-column prop="OrderNote" label="信用卡余额" align="center"></el-table-column>
			<el-table-column prop="OrderNote" label="购物卡剩余|总额度" align="center"></el-table-column>
			<el-table-column prop="Status" label="信用卡累积消费" align="center"></el-table-column>
			<el-table-column prop="OrderNote" label="购物卡累积消费" align="center"></el-table-column>
		</el-table>
	</div>
</template>

<script>
	export default {
		name: 'SupplementSheet',
		data() {
			return {
				searchFrom: {
					keyWord: ''
				},
				tableData: [{
						"Numbers": "20190605105636229596",
						"Picture": "",
						"CountryId": "美国",
						"Forum": "Amazon",
						"ProductByASIN": "777888999a",
						"ProductPrice": 15.99,
						"ServiceType": "不留评",
						"OrderNote": "待付款",
						"Status": "已完成",
						"OrderNumber": 1314520,
						"OrderTime": "2019-02-03T00:00:00",
						"Remark": ""
					},
					{
						"Numbers": "20190605105636229596",
						"Picture": "",
						"CountryId": "美国",
						"Forum": "Amazon",
						"ProductByASIN": "777888999a",
						"ProductPrice": 15.99,
						"ServiceType": "不留评",
						"OrderNote": "待付款",
						"Status": "已完成",
						"OrderNumber": 1314520,
						"OrderTime": "2019-02-03T00:00:00",
						"Remark": ""
					},
				],
				radio: '',
				selected: {}
			}
		},
		created() {
//			this.getAllData()
		},
		methods: {
			changeFather(){
             this.$emit("listenTochildEvent","我是子组件的参数");
          },
			getAllData() {
				let _this = this
				_this.axios.get(_this.GLOBAL.BASE_URL + 'api/OrderManagement/AddOrderByType').then((res) => {
					_this.tableData = res.data.data
				}).catch((error) => {
					console.log(error)
				})
			},
			showRow(row) {
				//赋值给radio
				this.radio = this.tableData.indexOf(row);
				this.selected = row;
				this.$emit("listenTochildEvent",row);
			},
		}
	}
</script>

<style>

</style>