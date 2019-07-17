<template>
	<div>
		<el-collapse-transition>
			<div class="searchBox mb20">
				<el-form ref="searchForm" :model="searchForm" class="form-item" label-width="80px">
					<el-row>
						<el-col :xs="24" :span="4">
							<el-form-item label="类型">
								<el-input v-model="searchForm.searchkeywords" placeholder="请输入类型" class="disInline"></el-input>
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
			<el-button type="success" size="medium" @click="addModelShow"><i class="el-icon-plus"></i>新增</el-button>
			<el-button type="primary" size="medium" @click="editModelShow" :disabled="editDisabled"><i class="el-icon-edit-outline"></i>修改</el-button>
			<el-button type="danger" size="medium" @click="delData" :disabled="delDisabled"><i class="el-icon-delete"></i>删除</el-button>
			<el-button type="primary" size="medium" @click="drModelShow"><i class="el-icon-upload2"></i>导入</el-button>
			<el-button type="primary" size="medium" @click="exportExcel"><i class="el-icon-download"></i>导出</el-button>
		</div>
		<div class="mt10">
			<el-table :data="tableData" id="exportData" style="width: 100%" :header-cell-style="{background:'#fafafa'}" @selection-change="handleSelectionChange">
				<el-table-column type="selection"></el-table-column>
				<el-table-column prop="Numbers" label="类型" align="center" width="200">
					<template slot-scope="scope">
						<el-button type="text" @click="viewModelShow(scope.$index,scope.row)">{{scope.row.Numbers}}</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="CountryId" label="名称" align="center"></el-table-column>
				<el-table-column prop="CountryId" label="值" align="center"></el-table-column>
				<el-table-column prop="OrderNumber" label="备注信息" align="center"></el-table-column>
				<el-table-column prop="OrderNumber" label="状态" align="center" class-name="red"></el-table-column>
				<el-table-column prop="" label="操作" align="center">
					<el-link type="primary" :underline="false" @click="forbidModelShow">禁用</el-link>
				</el-table-column>
			</el-table>
			<div class="mt30">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[100, 200, 300, 500]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
		</div>
		<!-- 新增修改 -->
		<el-dialog :title="title" :visible.sync="editModel" :close-on-click-modal="false" :before-close="closeModel">
			<el-form :model="editForm" :rules="editRules" label-width="125px" status-icon>
				<el-form-item label="类型" prop="type">
					<el-input v-model="editForm.type"></el-input>
				</el-form-item>
				<el-form-item label="名称">
					<el-input v-model="editForm.name"></el-input>
				</el-form-item>
				<el-form-item label="值" prop="val">
					<el-input v-model="editForm.val"></el-input>
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<template>
						<el-radio v-model="editForm.status" label="1">启用</el-radio>
						<el-radio v-model="editForm.status" label="0">禁用</el-radio>
					</template>
				</el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" v-model="editForm.remark"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="editModel=false">确 定</el-button>
				<el-button @click="editModel=false">取 消</el-button>
			</div>
		</el-dialog>
		<!-- 查看 -->
		<el-dialog :title="title" :visible.sync="viewModel" :close-on-click-modal="false">
			<el-form :model="viewForm" label-width="125px" status-icon>
				<el-form-item label="类型:"><label>{{viewForm.type}}</label></el-form-item>
				<el-form-item label="名称:"><label>{{viewForm.name}}</label></el-form-item>
				<el-form-item label="值:"><label>{{viewForm.val}}</label></el-form-item>
				<el-form-item label="状态:"><label>{{viewForm.status}}</label></el-form-item>
				<el-form-item label="备注:"><label>{{viewForm.remark}}</label></el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="viewModel=false">关 闭</el-button>
			</div>
		</el-dialog>
		<!-- 删除-->
		<el-dialog title="温馨提示" :visible.sync="delModel" :close-on-click-modal="false" center width="30%">
			<div class="del-dialog-cnt textCen">确认要删除该数据吗？</div>
			<span slot="footer" class="dialog-footer">
		    <el-button type="primary" size="medium">是</el-button>
		    <el-button @click="delModel=false" size="medium">否</el-button>
		  </span>
		</el-dialog>
		<!-- 导入-->
		<el-dialog title="导入数据" :visible.sync="drModel" :close-on-click-modal="false" center width="30%">
			<div class="del-dialog-cnt textCen"><input type="file" /></div><br>
			<div class="del-dialog-cnt textCen">导入文件不能超过5M，仅允许导入“xls”或“xlsx”格式文件！</div>
			<span slot="footer" class="dialog-footer">
			<el-button type="success" size="medium">下载模板</el-button>
		    <el-button type="primary" size="medium">确定</el-button>
		    <el-button @click="drModel=false" size="medium">取消</el-button>
		  </span>
		</el-dialog>
		<!-- 禁用-->
		<el-dialog title="温馨提示" :visible.sync="forbidModel" :close-on-click-modal="false" center width="30%">
			<div class="del-dialog-cnt textCen">确定要禁用吗？</div>
			<span slot="footer" class="dialog-footer">
		    <el-button type="primary" size="medium">是</el-button>
		    <el-button @click="forbidModel=false" size="medium">否</el-button>
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
				loading: true,
				viewModel: false,
				editModel: false,
				delModel: false,
				drModel: false,
				forbidModel: false,
				editDisabled: true,
				delDisabled: true,
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
						"Numbers": "20190611174157617041",
						"Picture": "",
						"CountryId": "德国",
						"Forum": "Amazon",
						"ProductByASIN": "B07P6KVGF8",
						"ProductPrice": 18.99,
						"ServiceType": "不留评",
						"OrderNote": "待确认",
						"Status": "已完成",
						"OrderNumber": 7758258,
						"OrderTime": "2019-04-02T00:00:00",
						"Remark": ""
					}
				],
				checkBoxData: [],
				title: '',
				allNum: 0,
				active: 1,
				currentPage: 1,
				pageSize: '0',
				total: 100,
				searchForm: {
					platform: '全部',
					searchkeywords: ''
				},
				editForm: {
					type: '',
					name: '',
					val: '',
					status: '1',
					remark: ''
				},
				viewForm: {
					type: '',
					name: '',
					val: '',
					status: '',
					remark: ''
				},
				editRules: {
					type: [{
						required: true,
						message: '请输入类型',
						trigger: 'blur'
					}],
					val: [{
						required: true,
						message: '请输入值',
						trigger: 'blur'
					}],
					status: [{
						required: true,
						message: '请选择状态',
						trigger: 'blur'
					}]
				},
			}
		},
		created() {
//			this.getAllData()
		},
		methods: {
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
				if(checkNum == 1) {
					_this.editDisabled = false
					_this.delDisabled = false
				} else if(checkNum > 1) {
					_this.editDisabled = true
					_this.delDisabled = false
				} else {
					_this.editDisabled = true
					_this.delDisabled = true
				}
			},
			// 新增
			addModelShow() {
				let _this = this
				_this.editModel = true
				_this.title = '自动分配新增'
			},
			// 修改
			editModelShow() {
				let _this = this
				_this.editModel = true
				let item = _this.checkBoxData[0]
				let num = item.Numbers
				_this.title = num + ' 自动分配修改'
				_this.editForm.type = item.CountryId;
				_this.editForm.name = item.CountryId;
				_this.editForm.val = item.CountryId;
				_this.editForm.status = '1';
				_this.editForm.remark = item.CountryId;
			},
			// 查看
			viewModelShow(index, row) {
				let _this = this;
				_this.viewModel = true
				let item = _this.tableData[index]
				let num = item.Numbers
				_this.title = num + ' 自动分配详情'
				_this.viewForm.type = item.CountryId,
					_this.viewForm.name = item.CountryId,
					_this.viewForm.val = item.CountryId,
					_this.viewForm.status = '启用',
					_this.viewForm.remark = item.CountryId
			},
			// 删除
			delData() {
				let _this = this
				_this.delModel = true
			},
			// 导入
			drModelShow() {
				let _this = this
				_this.drModel = true
			},
			// 禁用
			forbidModelShow() {
				let _this = this
				_this.forbidModel = true
			},
			//关闭新增修改弹窗
			closeModel() {
				let _this = this
				_this.editModel = false
				_this.editForm = {}
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