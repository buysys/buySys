<template>
	<div class="container">
		<div class="mb20 fz14">
			<span>参数配置</span>
			<span>/</span>
			<span>服务类型</span>
		</div>
		<el-collapse-transition>
			<div class="searchBox mb20">
				<el-form ref="searchForm" :model="searchForm" class="form-item" label-width="80px">
					<el-row>
						<el-col :xs="24" :span="4">
							<el-form-item label="平台">
								<template>
								  <el-select v-model="sPlatformValue" placeholder="请选择">
									<el-option
									  v-for="item in sPlatformOptions"
									  :key="item.value"
									  :label="item.label"
									  :value="item.value">
									</el-option>
								  </el-select>
								</template>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :span="4">
							<el-form-item label="搜索内容">
								<el-input v-model="searchForm.searchkeywords" placeholder="请输入编码/类型搜索" class="disInline"></el-input>
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
			<el-button type="primary" size="medium" @click="drModelShow"><i class="el-icon-caret-right"></i>导入</el-button>
			<el-button type="warning" size="medium" @click="exportExcel"><i class="el-icon-document-delete"></i>导出</el-button>
		</div>
		<div class="mt10">
		<el-table v-loading="loading" :data="tableData" id="exportData" style="width: 100%" :header-cell-style="{background:'#fafafa'}" @selection-change="handleSelectionChange">
			<el-table-column type="selection"></el-table-column>
				<el-table-column prop="CountryId" label="平台" align="center"></el-table-column>
				<el-table-column prop="CountryId" label="国家" align="center"></el-table-column>
				<el-table-column prop="OrderNumber" label="编码" align="center"></el-table-column>
				<el-table-column prop="OrderNumber" label="类型" align="center"></el-table-column>
				<el-table-column prop="OrderNumber" label="留评比例" align="center"></el-table-column>
				<el-table-column prop="OrderNumber" label="每单服务费(￥)" align="center"></el-table-column>
				<el-table-column prop="OrderNumber" label="产品最大价格" align="center"></el-table-column>
		</el-table>
		<div class="mt30">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[100, 200, 300, 500]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		<p class="mt20 fz14" style="color: red;">平台服务费 = 订单数量 * 每单服务费</p>
		</div>
		<!-- 新增修改 -->
		<el-dialog :title="title" :visible.sync="editModel" :close-on-click-modal="false" :before-close="closeModel">
      <div v-show="LpModel">
			<el-form :model="editForm" :rules="editRules" label-width="125px" status-icon>
				<el-form-item label="归属类型" prop="ascriptionType">
					<template>
					  <el-select v-model="editForm.ascriptionType" placeholder="请选择归属类型" style="width: 100%;" @change="changeForm">
						<el-option
						  v-for="item in aTypeOptions"
						  :key="item.value"
						  :label="item.label"
						  :value="item.value">
						</el-option>
					  </el-select>
					</template>
				</el-form-item>
				<el-form-item label="平台" prop="platform">
					<template>
					  <el-select v-model="editForm.platform" placeholder="请选择平台" style="width: 100%;">
						<el-option
						  v-for="item in sPlatformOptions"
						  :key="item.value"
						  :label="item.label"
						  :value="item.value">
						</el-option>
					  </el-select>
					</template>
				</el-form-item>
				<el-form-item label="国家" prop="country">
					<el-input v-model="editForm.country"></el-input>
				</el-form-item>
				<el-form-item label="编码" prop="num">
					<el-input v-model="editForm.num"></el-input>
				</el-form-item>
				<el-form-item label="类型" prop="type">
					<el-input v-model="editForm.type"></el-input>
				</el-form-item>
				<el-form-item label="平台" prop="commentBL">
					<template>
					  <el-select v-model="editForm.commentBL" placeholder="请选择留评比例" style="width: 100%;">
						<el-option
						  v-for="item in commentBLOptions"
						  :key="item.value"
						  :label="item.label"
						  :value="item.value">
						</el-option>
					  </el-select>
					</template>
				</el-form-item>
				<el-form-item label="服务费" prop="serviceCharge">
					<el-input v-model="editForm.serviceCharge"></el-input>
				</el-form-item>
				<el-form-item label="产品最大价格" prop="maxPrice">
					<el-input v-model="editForm.maxPrice"></el-input>
				</el-form-item>
				<p class="txtCenter">
					<el-button type="primary">确定</el-button>
					<el-button @click="closeModel">取消</el-button>
				</p>
			</el-form>
      </div>
      <div v-show="XtModel">
        <el-form :model="editForm" :rules="editRules" label-width="125px" status-icon>
        	<el-form-item label="归属类型" prop="ascriptionType">
        		<template>
        		  <el-select v-model="editForm.ascriptionType" placeholder="请选择归属类型" style="width:100%;" @change="changeForm">
        			<el-option
        			  v-for="item in aTypeOptions"
        			  :key="item.value"
        			  :label="item.label"
        			  :value="item.value">
        			</el-option>
        		  </el-select>
        		</template>
        	</el-form-item>
        	<el-form-item label="编码" prop="num">
        		<el-input v-model="editForm.num"></el-input>
        	</el-form-item>
        	<el-form-item label="类型" prop="type">
        		<el-input v-model="editForm.type"></el-input>
        	</el-form-item>
        	<el-form-item label="服务费" prop="serviceCharge">
        		<el-input v-model="editForm.serviceCharge"></el-input>
        	</el-form-item>
        	<p class="txtCenter">
        		<el-button type="primary">确定</el-button>
        		<el-button @click="closeModel">取消</el-button>
        	</p>
        </el-form>
      </div>
		</el-dialog>
		<!-- 删除-->
		<el-dialog title="温馨提示" :visible.sync="delModel" :close-on-click-modal="false" center="" width="30%">
		  <div class="del-dialog-cnt textCen">确认要删除该数据吗？</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button type="primary" size="medium">确定</el-button>
		    <el-button @click="delModel=false" size="medium">取消</el-button>
		  </span>
		</el-dialog>
		<!-- 导入-->
		<el-dialog title="导入数据" :visible.sync="drModel" :close-on-click-modal="false" center="" width="30%">
		  <div class="del-dialog-cnt textCen"><input type="file" /></div><br>
		  <div class="del-dialog-cnt textCen">导入文件不能超过5M，仅允许导入“xls”或“xlsx”格式文件！</div>
		  <span slot="footer" class="dialog-footer">
			<el-button type="success" size="medium">下载模板</el-button>
		    <el-button type="primary" size="medium">确定</el-button>
		    <el-button @click="drModel=false" size="medium">取消</el-button>
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
				editModel: false,
				delModel: false,
				viewModel: false,
				drModel: false,
				forbidModel: false,
        LpModel:true,
        XtModel:false,
				editDisabled: true,
				delDisabled: true,
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
				editForm: {
					ascriptionType: '1',
					platform: '1',
					country: '',
					num: '',
					type: '',
					commentBL: '1',
					serviceCharge: '',
					maxPrice: ''
				},
				editRules: {
					ascriptionType: [{
						required: true,
						message: '请选择归属类型',
						trigger: 'blur'
					}],
					platform: [{
						required: true,
						message: '请选择平台',
						trigger: 'blur'
					}],
					country: [{
						required: true,
						message: '请输入国家',
						trigger: 'blur'
					}],
					num: [{
						required: true,
						message: '请输入编码',
						trigger: 'blur'
					}],
					type: [{
						required: true,
						message: '请输入类型',
						trigger: 'blur'
					}],
					commentBL: [{
						required: true,
						message: '请选择留评比例',
						trigger: 'blur'
					}],
					serviceCharge: [{
						required: true,
						message: '请输入服务费',
						trigger: 'blur'
					}],
					maxPrice: [{
						required: true,
						message: '请输入产品最大价格',
						trigger: 'blur'
					}]
				},
				sPlatformOptions: [{
				  value: '1',
				  label: '全部'
				}, {
				  value: '2',
				  label: 'Amazon'
				}],
				sPlatformValue: '1',

				//新增修改归属类型下拉框
				aTypeOptions: [{
				  value: '1',
				  label: '留评服务费'
				}, {
				  value: '2',
				  label: '系统服务费'
				}],
				//新增修改留评比例下拉框
				commentBLOptions: [{
				  value: '1',
				  label: '不留评'
				}, {
				  value: '2',
				  label: '10%'
				}, {
				  value: '3',
				  label: '30%'
				}, {
				  value: '4',
				  label: '50%'
				}, {
				  value: '5',
				  label: '70%'
				}, {
				  value: '6',
				  label: '100%'
				}]
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
          //切换form
          changeForm(){
            let _this = this
            let active = _this.editForm.ascriptionType
            console.log(active)
            if (active == '1'){
              _this.LpModel = true
              _this.XtModel = false
              _this.ascriptionType = '2'
            }
            if (active == '2'){
              _this.LpModel = false
              _this.XtModel = true
              _this.ascriptionType = '1'
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
						if(checkNum ==1) {
							_this.editDisabled = false
							_this.delDisabled = false
						}
						else if(checkNum > 1) {
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
						_this.title = '留评类型新增'
					},
					// 修改
					editModelShow() {
						let _this = this
						_this.editModel = true
						let item = _this.checkBoxData[0]
						let num = item.Numbers
						_this.title = num + ' 留评类型修改'
						_this.editForm.ascriptionType = '1'
						_this.editForm.platform = '1'
						_this.editForm.country = item.CountryId;
						_this.editForm.num = item.CountryId;
						_this.editForm.type = item.CountryId;
						_this.editForm.commentBL = '1';
						_this.editForm.serviceCharge = item.CountryId;
						_this.editForm.maxPrice = item.CountryId;
					},
					// 删除
					delData () {
					  let _this = this
					  _this.delModel = true
					},
					// 导入
					drModelShow () {
					  let _this = this
					  _this.drModel = true
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
