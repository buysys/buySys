<template>
	<div>
		<el-collapse-transition>
			<div class="searchBox mb20">
				<el-form ref="searchForm" :model="searchForm" class="form-item" label-width="80px">
					<el-row>
						<el-col :xs="24" :span="4">
							<el-form-item label="国家">
								<el-input v-model="searchForm.countryId" placeholder="请输入国家" class="disInline"></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :span="4" class="ml20">
							<el-button type="primary" size="medium">查询</el-button>
							<el-button size="medium" @click='resetBtn'>重置</el-button>
						</el-col>
					</el-row>
				</el-form>
			</div>
		</el-collapse-transition>
		<div class="mb20">
			<el-button type="success" size="medium" @click="addService"><i class="el-icon-plus"></i>新增</el-button>
			<el-button type="primary" size="medium" :disabled="disabled" @click="editService"><i class="el-icon-edit-outline"></i>修改
			</el-button>
			<el-button type="danger" size="medium" :disabled="disabled" @click="delHandel"><i class="el-icon-delete"></i>删除
			</el-button>
      <el-button type="primary" size="medium"><i class="el-icon-upload2"></i>导入</el-button>
      <el-button type="primary" size="medium" :disabled="disabled" @click="exportExcel"><i class="el-icon-download"></i>导出</el-button>
		</div>
		<div class="mt10">
			<el-table :data="countryData" v-model='loading' border style="width: 100%" height='500' id='exportOrder' @selection-change="handleSelectionChange">
				<el-table-column type="selection"></el-table-column>
				<el-table-column prop="CountryId" sortable label="国家名称" align="center">
					<template slot-scope="scope">
						<el-button type="text" @click="viewCountryDetails(scope.$index,scope.row)">{{scope.row.CountryId}}</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="Numbers" sortable label="国家简写" align="center"></el-table-column>
				<el-table-column prop="ProductByASIN" sortable label="语言" align="center"></el-table-column>
				<el-table-column prop="ProductByASIN" sortable label="时区" align="center"></el-table-column>
				<el-table-column prop="ProductByASIN" sortable label="最小端口" align="center"></el-table-column>
				<el-table-column prop="ProductByASIN" sortable label="最大端口" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="备注" align="center"></el-table-column>
			</el-table>
			<div class="mt30">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
		</div>
		<!--新增/修改-->
		<el-dialog :title='serviceTitle' :visible.sync='addCountryModal' :close-on-click-modal='false'>
			<el-form :model='countryForm' ref='countryForm' :rules='formRules' label-width='120px'>
				<el-form-item label='国家' prop='countryId'>
					<el-input v-model='countryForm.countryId'></el-input>
				</el-form-item>
				<el-form-item label='国家简写' prop='countryAbbre'>
					<el-input v-model='countryForm.countryAbbre'></el-input>
				</el-form-item>
				<el-form-item label='语言' prop='language'>
					<el-input v-model='countryForm.language'></el-input>
				</el-form-item>
				<el-form-item label='时区' prop='timeZone'>
					<el-input v-model='countryForm.timeZone'></el-input>
				</el-form-item>
				<el-form-item label='GMT时区' prop='gmtTimeZone'>
					<el-input v-model='countryForm.gmtTimeZone'></el-input>
				</el-form-item>
				<el-form-item label='最小端口'>
					<el-input v-model='countryForm.minPort'></el-input>
				</el-form-item>
				<el-form-item label='最大端口'>
					<el-input v-model='countryForm.maxPort'></el-input>
				</el-form-item>
				<el-form-item label='备注'>
					<el-input v-model='countryForm.remark'></el-input>
				</el-form-item>
			</el-form>
      <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addCountryModal=false">确 定</el-button>
      <el-button @click="addCountryModal = false">取 消</el-button>
      </div>
		</el-dialog>
		<!--查看详情-->
		<el-dialog title='国家管理详情信息' :visible.sync='viewCountryModal' :close-on-click-modal='false'>
			<el-form :model='countryForm' ref='countryForm' label-width='120px'>
				<el-form-item label='国家：'>
					<span>{{countryForm.countryId}}</span>
				</el-form-item>
				<el-form-item label='国家简写：'>
					<span>{{countryForm.countryAbbre}}</span>
				</el-form-item>
				<el-form-item label='语言：'>
					<span>{{countryForm.language}}</span>
				</el-form-item>
				<el-form-item label='时区：'>
					<span>{{countryForm.timeZone}}</span>
				</el-form-item>
				<el-form-item label='GMT时区：'>
					<span>{{countryForm.gmtTimeZone}}</span>
				</el-form-item>
				<el-form-item label='最小端口：'>
					<span>{{countryForm.minPort}}</span>
				</el-form-item>
				<el-form-item label='最大端口：'>
					<span>{{countryForm.maxPort}}</span>
				</el-form-item>
				<el-form-item label='备注：'>
					<span>{{countryForm.remark}}</span>
				</el-form-item>
			</el-form>
      <div slot="footer" class="dialog-footer">
      <el-button @click="viewCountryModal=false">关 闭</el-button>
      </div>
		</el-dialog>
    <!-- 删除-->
    <el-dialog title="温馨提示" :visible.sync="delCountryModal" :close-on-click-modal="false" center width="30%">
      <div class="del-dialog-cnt textCen">确认要删除该数据吗？</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click="submitCountry('countryForm')">是</el-button>
        <el-button @click="delCountryModal=false" size="medium">否</el-button>
      </span>
    </el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'countryManage',
		data() {
			return {
				serviceTitle: '',
				currentPage: 1,
				pageSize: '0',
				total: 100,
				disabled: true,
				loading: true,
				addCountryModal: false, //新增
				delCountryModal: false, //删除
				viewCountryModal: false, //查看详情
				returnShow: false,
				tipMessage: '',
				countryData: [],
				checkBoxData: [], //选中信息
				searchForm: {
					countryId: ''
				},
				countryForm: {
					countryId: '',
					countryAbbre: '',
					language: '',
					timeZone: '',
					gmtTimeZone: '',
					minPort: '',
					maxPort: '',
					remark: ''
				},
				formRules: {
					countryId: [{
						required: true,
						message: '请输入国家',
						trigger: 'blur'
					}],
					countryAbbre: [{
						required: true,
						message: '请输入国家简写',
						trigger: 'blur'
					}],
					language: [{
						required: true,
						message: '请输入语言',
						trigger: 'blur'
					}],
					timeZone: [{
						required: true,
						message: '请输入时区',
						trigger: 'blur'
					}],
					gmtTimeZone: [{
						required: true,
						message: '请输入GMT时区',
						trigger: 'blur'
					}]
				}
			}
		},
		created() {
			this.getAllData()
		},
		methods: {
			//添加确定
			submitCountry(formName) {
				let _this = this
				_this.$refs[formName].validate((valid) => {
					if(valid) {
						_this.addCountryModal = false
					}
				})
			},
			//重置
			resetBtn() {
				let _this = this
				_this.searchForm = {
					countryId: ''
				}
			},
			//查看详情
			viewCountryDetails(index, row) {
				let _this = this
				let item = _this.countryData[index]
				_this.countryForm.countryId = item.CountryId
				_this.viewCountryModal = true
			},
			// 导出
			exportExcel() {
				var xlsxParam = {
					raw: true
				} // 导出的内容只做解析，不进行格式转换
				var wb = XLSX.utils.table_to_book(document.querySelector('#exportOrder'), xlsxParam)

				/* get binary string as output */
				var wbout = XLSX.write(wb, {
					bookType: 'xlsx',
					bookSST: true,
					type: 'array'
				})
				try {
					FileSaver.saveAs(new Blob([wbout], {
						type: 'application/octet-stream'
					}), '国家管理.xlsx')
				} catch(e) {
					if(typeof console !== 'undefined') {
						console.log(e, wbout)
					}
				}
				return wbout
			},
			//新建弹窗
			addService() {
				let _this = this
				_this.addCountryModal = true
				_this.serviceTitle = '国家新增'
			},
			//修改弹窗
			editService() {
				let _this = this
				_this.addCountryModal = true
				_this.serviceTitle = '国家修改'
			},
			//关闭新增弹窗
			closeModal() {
				let _this = this
				_this.addCountryModal = false
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
				if(checkNum > 0) {
					this.disabled = false
				}
			},
			//无效订单
			delHandel() {
				let _this = this
				_this.delCountryModal = true

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
