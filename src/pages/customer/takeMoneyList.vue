<template>
	<div class="container">
		<div class="mb20 fz14">
			<span>客户管理</span>
			<span>/</span>
			<span>提现记录</span>
		</div>
		<el-collapse-transition>
			<div class="searchBox mb20" v-show="searchModel">
				<el-form ref="searchForm" :model="searchForm" class="form-item" label-width="80px">
					<el-row>
						<el-col :xs="24" :span="8" :sm="8" :md="8" :lg="8">
							<el-form-item label="搜索内容">
								<el-input v-model="searchForm.searchkeywords" placeholder="请输入提现记录号|客户名称|客户编码|客户手机搜索" class="disInline"></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :span="5" :sm="10" :md="8" :lg="5">
							<el-form-item label="提现状态">
								<template>
								  <el-select v-model="statusValue" placeholder="请选择">
									<el-option
									  v-for="item in statusOptions"
									  :key="item.value"
									  :label="item.label"
									  :value="item.value">
									</el-option>
								  </el-select>
								</template>
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
			<el-button type="primary" size="medium" @click="okModelShow" :disabled="disabled"><i class="el-icon-circle-check"></i>确认付款</el-button>
			<el-button type="danger" size="medium" @click="errModelShow" :disabled="disabled"><i class="el-icon-circle-close"></i>付款失败</el-button>
			<el-button type="warning" size="medium" @click="exportExcel"><i class="el-icon-document-delete"></i>导出</el-button>
			<el-input placeholder="搜索" prefix-icon="el-icon-search" class="listSearchInput" @click.native="searchShow" readonly></el-input>
		</div>
		<div class="mt10">
		<el-table v-loading="loading" :data="tableData" id="exportData" style="width: 100%" :header-cell-style="{background:'#fafafa'}" @selection-change="handleSelectionChange">
			<el-table-column type="selection"></el-table-column>
				<el-table-column prop="Numbers" label="提现记录号" align="center"></el-table-column>
			    <el-table-column prop="ProductByASIN" label="客户名称" align="center"></el-table-column>
				<el-table-column prop="CountryId" label="客户编号" align="center"></el-table-column>
				<el-table-column prop="CountryId" label="客户手机" align="center"></el-table-column>
				<el-table-column prop="OrderNumber" label="提现金额" align="center"  class-name="red"></el-table-column>
				<el-table-column prop="OrderNumber" label="提现状态" align="center"></el-table-column>
				<el-table-column prop="OrderNumber" label="提现时间" align="center"></el-table-column>
				<el-table-column prop="OrderNumber" label="开户银行" align="center"></el-table-column>
				<el-table-column prop="CountryId" label="开户名" align="center"></el-table-column>
				<el-table-column prop="ProductPrice" label="开户银行账号" align="center"></el-table-column>
		</el-table>
		<div class="mt30">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[100, 200, 300, 500]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		</div>
		<!-- 确认付款-->
		<el-dialog title="确认付款" :visible.sync="okModel" :close-on-click-modal="false" center="" width="30%">
		  <div class="del-dialog-cnt textCen">确定要付款选中的数据吗？</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button type="primary" size="medium">确定</el-button>
		    <el-button @click="okModel=false" size="medium">取消</el-button>
		  </span>
		</el-dialog>
		<!-- 付款失败-->
		<el-dialog title="付款失败原因" :visible.sync="errModel" :close-on-click-modal="false" center="" width="30%">
			<el-input type="textarea"></el-input>
			<span slot="footer" class="dialog-footer">
		    <el-button type="primary" size="medium">确定</el-button>
		    <el-button @click="errModel=false" size="medium">取消</el-button>
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
				okModel: false,
				errModel: false,
				disabled: true,
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
				statusOptions: [{
				  value: '1',
				  label: '全部'
				}, {
				  value: '2',
				  label: '已申请'
				}, {
				  value: '3',
				  label: '已完成'
				}, {
				  value: '4',
				  label: '失败'
				}],
				statusValue: '1'
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
						if(checkNum !== 1) {
							_this.disabled = true
						} else {
							_this.disabled = false
						}
					},
					// 确认弹窗
					okModelShow() {
						let _this = this
						_this.okModel = true
					},
					// 失败弹框
					errModelShow() {
						let _this = this
						_this.errModel = true
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
