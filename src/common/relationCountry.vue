<template>
	<div>
		<el-collapse-transition>
			<div class="searchBox mb20">
				<el-form ref="searchForm" :model="searchForm" class="form-item" label-width="80px">
					<el-row>
						<el-col :xs="24" :span="10">
							<el-form-item label="国家">
								<el-input v-model="searchForm.countryId" placeholder="请输入国家"></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :span="5" class="ml20">
							<el-button type="primary" size="medium">查询</el-button>
							<el-button size="medium" @click='resetBtn'>重置</el-button>
						</el-col>
					</el-row>
				</el-form>
			</div>
		</el-collapse-transition>
		<div class="mt10">
			<el-table :data="countryData" v-model='loading' border style="width: 100%" height='350' id='exportOrder' @selection-change="handleSelectionChange">
				<el-table-column type="selection"></el-table-column>
				<el-table-column prop="CountryId" sortable label="国家名称" align="center">
				</el-table-column>
				<el-table-column prop="Numbers" sortable label="国家简写" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="备注" align="center"></el-table-column>
			</el-table>
			<div class="mt30">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'relationCountry',
		data() {
			return {
				currentPage: 1,
				pageSize: '0',
				total: 20,
				loading: true,
				searchForm: {
					countryId: ''
				},
				countryData: [],
				checkBoxData: []
			}
		},
		created() {
			this.getAllData()
		},
		methods: {
			//重置
			resetBtn() {
				let _this = this
				_this.searchForm = {
					countryId: ''
				}
			},
			//初始化数据
			getAllData() {
				let _this = this
				_this.active = 1
				_this.axios.get(_this.GLOBAL.BASE_URL + 'api/OrderManagement/AddOrderByType').then((res) => {
					_this.countryData = res.data.data
					_this.loading = false
				}).catch((error) => {
					console.log(error)
				})
			},
			// 是否有选中
			handleSelectionChange(val) {
				this.checkBoxData = val
				let checkNum = this.checkBoxData.length
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