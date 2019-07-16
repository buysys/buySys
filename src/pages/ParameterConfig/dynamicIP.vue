<template>
	<div>
		<el-collapse-transition>
			<div class="searchBox mb20">
				<el-form ref="searchForm" :model="searchForm" class="form-item" label-width="80px">
					<el-row>
						<el-col :xs="24" :span="4">
							<el-form-item label="国家">
								<template>
								  <el-select v-model="countryValue" placeholder="请选择">
									<el-option
									  v-for="item in countryOptions"
									  :key="item.value"
									  :label="item.label"
									  :value="item.value">
									</el-option>
								  </el-select>
								</template>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :span="5">
							<el-form-item label="端口">
								<el-input v-model="searchForm.start" placeholder="开始端口" class="disInline" style="width: 100px;"></el-input>
								---
								<el-input v-model="searchForm.end" placeholder="结束端口" class="disInline" style="width: 100px;"></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :span="4">
							<el-form-item label="搜索内容">
								<el-input v-model="searchForm.searchkeywords" placeholder="请输入IP/端口/买家账号" class="disInline"></el-input>
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
			<el-button type="primary" size="medium" @click="exportExcel"><i class="el-icon-download"></i>导出</el-button>
		</div>
		<div class="mt10">
		<el-table v-loading="loading" :data="tableData" id="exportData" style="width: 100%" :header-cell-style="{background:'#fafafa'}" @selection-change="handleSelectionChange">
			<el-table-column type="selection"></el-table-column>
				<el-table-column prop="Numbers" label="IP" align="center"></el-table-column>
			    <el-table-column prop="ProductByASIN" label="端口" align="center"></el-table-column>
				<el-table-column prop="CountryId" label="国家" align="center"></el-table-column>
				<el-table-column prop="OrderNumber" label="买家账号" align="center"></el-table-column>
		</el-table>
		<div class="mt30">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[100, 200, 300, 500]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		</div>
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
				countryOptions: [{
				  value: '1',
				  label: '加拿大'
				}, {
				  value: '2',
				  label: '中国'
				}, {
				  value: '3',
				  label: '美国'
				}, {
				  value: '4',
				  label: '英国'
				}],
				countryValue: ''
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
						if(checkNum !== 1) {
							_this.disabled = true
						} else {
							_this.disabled = false
						}
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
