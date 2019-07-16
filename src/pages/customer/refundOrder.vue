<template>
	<div class="container">
		<el-collapse-transition>
			<div class="searchBox mb20">
				<el-form ref="searchForm" :model="searchForm" class="form-item" label-width="80px">
					<el-row>
						<el-col :xs="24" :span="8">
							<el-form-item label="搜索内容">
								<el-input v-model="searchForm.searchkeywords" placeholder="请输入客户账号/编码" class="disInline"></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :span="4">
							<el-form-item label="退款状态">
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
						<el-col :xs="24" :span="4" class="ml20">
							<el-button type="primary" size="medium">查询</el-button>
							<el-button size="medium" @click="resetSearch">重置</el-button>
						</el-col>
					</el-row>
				</el-form>
			</div>
		</el-collapse-transition>
		<div class="mb20">
			<el-button type="primary" size="medium" @click="okModelShow" :disabled="disabled"><i class="el-icon-circle-check"></i>确认付款</el-button>
			<el-button type="warning" size="medium" @click="exportExcel"><i class="el-icon-download"></i>导出</el-button>
		</div>
		<div class="mt10">
		<el-table v-loading="loading" :data="tableData" id="exportData" style="width: 100%" :header-cell-style="{background:'#fafafa'}" @selection-change="handleSelectionChange">
			<el-table-column type="selection"></el-table-column>
				<el-table-column prop="Numbers" label="客户编号" align="center" width="200">
					<template slot-scope="scope">
						<el-button type="text" @click="viewModelShow(scope.$index,scope.row)">{{scope.row.Numbers}}</el-button>
					</template>
				</el-table-column>
			    <el-table-column prop="ProductByASIN" label="客户账号" align="center"></el-table-column>
				<el-table-column prop="CountryId" label="退款类型" align="center"></el-table-column>
				<el-table-column prop="CountryId" label="来源编码" align="center"></el-table-column>
				<el-table-column prop="OrderNumber" label="收款类型" align="center"></el-table-column>
				<el-table-column prop="OrderNumber" label="付款账号" align="center"></el-table-column>
				<el-table-column prop="OrderNumber" label="付款流水号" align="center"></el-table-column>
				<el-table-column prop="OrderNumber" label="付款时间" align="center"></el-table-column>
				<el-table-column prop="CountryId" label="退款金额" align="center"></el-table-column>
				<el-table-column prop="ProductPrice" label="退款状态" align="center" class-name="red"></el-table-column>
				<el-table-column prop="OrderNote" label="备注信息" align="center"></el-table-column>
		</el-table>
		<div class="mt30">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[100, 200, 300, 500]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		</div>
		<!-- 确认付款-->
		<el-dialog title="确认付款" :visible.sync="okModel" :close-on-click-modal="false" center="" width="30%" :modal-append-to-body="false" :append-to-body="true">
		  <div class="del-dialog-cnt textCen">确定要付款选中的数据吗？</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button type="primary" size="medium">是</el-button>
		    <el-button @click="okModel=false" size="medium">否</el-button>
		  </span>
		</el-dialog>
		<!-- 查看 -->
		<el-dialog :title="title" :visible.sync="viewModel" :close-on-click-modal="false" :modal-append-to-body="false" :append-to-body="true">
			<el-form :model="viewForm" label-width="125px" status-icon>
				<el-row>
					<el-col :span="12" :xs="24"><el-form-item label="客户编号:"><label>{{viewForm.userNo}}</label></el-form-item></el-col>
					<el-col :span="12" :xs="24"><el-form-item label="客户账号:"><label>{{viewForm.userName}}</label></el-form-item></el-col>
				</el-row>
				<el-row>
					<el-col :span="12" :xs="24"><el-form-item label="收款类型:"><label>{{viewForm.receiptsType}}</label></el-form-item></el-col>
					<el-col :span="12" :xs="24"><el-form-item label="收款账号:"><label>{{viewForm.receiptsNo}}</label></el-form-item></el-col>
				</el-row>
				<el-row>
					<el-col :span="12" :xs="24"><el-form-item label="流水号:"><label>{{viewForm.pipelineNo}}</label></el-form-item></el-col>
					<el-col :span="12" :xs="24"><el-form-item label="付款时间:"><label>{{viewForm.payTime}}</label></el-form-item></el-col>
				</el-row>
				<el-row>
					<el-col :span="12" :xs="24"><el-form-item label="退款金额:"><label>{{viewForm.refundAmount}}</label></el-form-item></el-col>
					<el-col :span="12" :xs="24"><el-form-item label="退款状态:"><label>{{viewForm.status}}</label></el-form-item></el-col>
				</el-row>
				<el-row>
					<el-col :span="24" :xs="24"><el-form-item label="备注:"><label>{{viewForm.remark}}</label></el-form-item></el-col>
				</el-row>
			</el-form>
      <div slot="footer" class="dialog-footer">
      <el-button @click="viewModel=false">关 闭</el-button>
      </div>
		</el-dialog>
	</div>
</template>

<script>
	import FileSaver from 'file-saver'
	import XLSX from 'xlsx'
	export default {
		name: 'refundOrder',
		data() {
			return {
				loading:true,
				okModel: false,
				viewModel: false,
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
				viewForm: {
					userNo: '',
					userName: '',
					receiptsType: '',
					receiptsNo: '',
					pipelineNo: '',
					payTime: '',
					refundAmount:'',
					status:'',
					remark: ''
				},
				statusOptions: [{
				  value: '1',
				  label: '全部'
				}, {
				  value: '2',
				  label: '已申请'
				}, {
				  value: '3',
				  label: '已退款'
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
					// 查看
					viewModelShow(index, row) {
						let _this = this;
						_this.viewModel = true
						let item = _this.tableData[index]
						let num = item.Numbers
						_this.title = '客户：' + num + ' 退款订单信息'
						_this.viewForm.userNo = item.CountryId
						_this.viewForm.userName = item.CountryId
						_this.viewForm.receiptsType = item.CountryId
						_this.viewForm.receiptsNo = item.CountryId
						_this.viewForm.pipelineNo = item.CountryId
						_this.viewForm.payTime = item.CountryId
						_this.viewForm.refundAmount = item.CountryId
						_this.viewForm.status = item.CountryId
						_this.viewForm.remark = item.CountryId
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
