<template>
	<div>
		<el-collapse-transition>
			<div class="searchBox mb20">
				<el-form ref="searchForm" :model="searchForm" class="form-item" label-width="80px">
					<el-row>
						<el-col :xs="24" :span="4">
							<el-form-item label="平台名称">
								<el-input v-model="searchForm.searchkeywords" placeholder="请输入平台名称" class="disInline"></el-input>
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
			<el-button type="warning" size="medium" @click="glModelShow" :disabled="editDisabled"><i class="el-icon-sort"></i>关联国家</el-button>
      <el-button type="primary" size="medium" @click="drModelShow"><i class="el-icon-upload2"></i>导入</el-button>
      <el-button type="primary" size="medium" @click="exportExcel"><i class="el-icon-download"></i>导出</el-button>
		</div>
		<div class="mt10">
		<el-table v-loading="loading" :data="tableData" id="exportData" style="width: 100%" :header-cell-style="{background:'#fafafa'}" @selection-change="handleSelectionChange">
			<el-table-column type="selection"></el-table-column>
				<el-table-column prop="Forum" label="平台名称" align="center"></el-table-column>
				<el-table-column prop="Numbers" label="国家数量" align="center">
					<template slot-scope="scope">
						<el-button type="text" @click="glListModelShow(scope.$index,scope.row)">{{scope.row.Numbers}}</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="OrderNumber" label="查看任务" align="center"><el-button type="success" size="small" @click="OrderTaskModelShow">查看任务</el-button></el-table-column>
		</el-table>
		<div class="mt30">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[100, 200, 300, 500]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		</div>
		<!-- 新增修改 -->
		<el-dialog :title="title" :visible.sync="editModel" :close-on-click-modal="false" :before-close="closeModel">
			<el-form :model="editForm" :rules="editRules" label-width="125px" status-icon>
				<el-form-item label="平台" prop="name">
					<el-input v-model="editForm.name" autofocus="true"></el-input>
				</el-form-item>
			</el-form>
      <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="editModel=false">确 定</el-button>
      <el-button @click="editModel = false">取 消</el-button>
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
		<!-- 关联国家-->
		<el-dialog title="关联国家" :visible.sync="glModel" :close-on-click-modal="false">
		  	<div class="searchBox mb20">
		  		<el-form ref="searchForm" class="form-item" label-width="80px">
		  			<el-row>
		  				<el-col :xs="24" :span="8">
		  					<el-form-item label="国家">
		  						<el-input v-model="searchForm.searchkeywords" placeholder="请输入国家" class="disInline"></el-input>
		  					</el-form-item>
		  				</el-col>
		  				<el-col :xs="24" :span="8" class="ml20">
		  					<el-button type="primary" size="medium">查询</el-button>
		  					<el-button size="medium" @click="resetSearch">重置</el-button>
		  				</el-col>
		  			</el-row>
		  		</el-form>
		  	</div>
			<div class="mt10">
		  	<el-table v-loading="loading" :data="tableData" style="width: 100%" :header-cell-style="{background:'#fafafa'}" @selection-change="handleSelectionChange2">
		  		<el-table-column type="selection"></el-table-column>
		  			<el-table-column prop="CountryId" label="国家名称" align="center"></el-table-column>
		  			<el-table-column prop="Forum" label="国家简写" align="center"></el-table-column>
		  			<el-table-column prop="OrderNumber" label="备注" align="center"></el-table-column>
		  	</el-table>
		  	<div class="mt30">
		  		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[100, 200, 300, 500]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
		  		</el-pagination>
		  	</div>
		  	</div>
		  <div slot="footer" class="dialog-footer">
		    <el-button type="primary" size="medium">确定</el-button>
		    <el-button @click="glModel=false" size="medium">取消</el-button>
		  </div>
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
		<!-- 国家数量-->
		<el-dialog title="关联国家列表" :visible.sync="glListModel" :close-on-click-modal="false">
		  	<div class="searchBox mb20">
		  		<el-form ref="searchForm" class="form-item" label-width="80px">
		  			<el-row>
		  				<el-col :xs="24" :span="8">
		  					<el-form-item label="国家">
		  						<el-input v-model="searchForm.searchkeywords" placeholder="请输入国家" class="disInline"></el-input>
		  					</el-form-item>
		  				</el-col>
		  				<el-col :xs="24" :span="8" class="ml20">
		  					<el-button type="primary" size="medium">查询</el-button>
		  					<el-button size="medium" @click="resetSearch">重置</el-button>
		  				</el-col>
		  			</el-row>
		  		</el-form>
		  	</div>
			<div class="mb20">
				<el-button type="danger" size="medium" @click="jcModelShow" :disabled="jcDisabled"><i class="el-icon-link"></i>解除关联</el-button>
				<el-button type="primary" size="medium" @click="bindModelShow" :disabled="bindDisabled"><i class="el-icon-connection"></i>绑定网址</el-button>
			</div>
			<div class="mt10">
		  	<el-table v-loading="loading" :data="tableData" id="exportData" style="width: 100%" :header-cell-style="{background:'#fafafa'}" @selection-change="handleSelectionChange3">
		  		<el-table-column type="selection"></el-table-column>
		  			<el-table-column prop="CountryId" label="国家名称" align="center"></el-table-column>
		  			<el-table-column prop="Forum" label="国家缩写" align="center"></el-table-column>
		  			<el-table-column prop="OrderNumber" label="网址" align="center"></el-table-column>
		  	</el-table>
		  	<div class="mt30">
		  		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[100, 200, 300, 500]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
		  		</el-pagination>
		  	</div>
		  	</div>
		  <div slot="footer" class="dialog-footer">
		    <el-button type="primary" size="medium">确定</el-button>
		    <el-button @click="glListModel=false" size="medium">取消</el-button>
		  </div>
		</el-dialog>
		<!-- 解除关联-->
		<el-dialog title="温馨提示" :visible.sync="jcModel" :close-on-click-modal="false" center width="30%">
		  <div class="del-dialog-cnt textCen">确认要解除关联吗？</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button type="primary" size="medium">是</el-button>
		    <el-button @click="jcModel=false" size="medium">否</el-button>
		  </span>
		</el-dialog>
		<!-- 绑定网址-->
		<el-dialog title="绑定网址" :visible.sync="bindModel" :close-on-click-modal="false" center width="30%">
			<el-input v-model='webAddres' placeholder="请输入网址" autofocus="true"></el-input>
			<div slot="footer" class="dialog-footer">
		    <el-button type="primary" size="medium">确定</el-button>
		    <el-button @click="bindModel=false" size="medium">取消</el-button>
			</div>
		</el-dialog>
		<!-- 订单任务 -->
		<el-dialog title="查看任务" :visible.sync="OrderTaskModel" :close-on-click-modal="false" width="60%">
			<OrderTask></OrderTask>
			<div slot="footer" class="dialog-footer">
		    <el-button @click="OrderTaskModel=false" size="medium">关闭</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import FileSaver from 'file-saver'
	import XLSX from 'xlsx'

	import OrderTask from '../../common/OrderTask'
	export default {
		name: 'customer',
		data() {
			return {
				loading:true,
				editModel: false,	//新增修改弹框
				delModel: false,	//删除弹框
				glModel: false,		//关联国家弹框
				drModel: false,		//导入弹框
				glListModel: false,	//关联国家列表弹框(国家数量)
				jcModel: false,		//解除关联弹框
				bindModel: false,	//绑定网址弹框
				OrderTaskModel: false, //订单任务
				editDisabled: true,
				delDisabled: true,
				jcDisabled: true,
				bindDisabled: true,
				tableData: [],
				checkBoxData:[],
				checkBoxData2:[], //关联国家选中数据
				checkBoxData3:[], //关联国家列表选中数据
				title:'',
				allNum: 0,
				active: 1,
				currentPage: 1,
				pageSize: '0',
				total: 100,
				webAddres: '',
				searchForm: {
					platform: '全部',
					searchkeywords: ''
						},
				editForm: {
					name: '',
					remark: ''
				},
				editRules: {
					name: [{
						required: true,
						message: '请输入平台名称',
						trigger: 'blur'
					}]
				},
					}
				},
				components:{
					OrderTask
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
					// 是否有选中（平台列表）
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
					// 是否有选中（关联国家）
					handleSelectionChange2(val) {
						let _this = this
						_this.checkBoxData2 = val
						let checkNum = _this.checkBoxData2.length
					},
					// 是否有选中（关联国家列表）
					handleSelectionChange3(val) {
						let _this = this
						_this.checkBoxData3 = val
						let checkNum = _this.checkBoxData3.length
						if(checkNum ==1) {
							_this.bindDisabled = false
							_this.jcDisabled = false
						}
						else if(checkNum > 1) {
							_this.bindDisabled = true
							_this.jcDisabled = false
						} else {
							_this.bindDisabled = true
							_this.jcDisabled = true
						}
					},
					// 新增
					addModelShow() {
						let _this = this
						_this.editModel = true
						_this.title = '平台新增'
					},
					// 修改
					editModelShow() {
						let _this = this
						_this.editModel = true
						let item = _this.checkBoxData[0]
						let num = item.Forum
						_this.title = num + ' 平台修改'
						_this.editForm.name = item.Forum;
					},
					// 删除
					delData () {
					  let _this = this
					  _this.delModel = true
					},
					// 关联国家
					glModelShow () {
					  let _this = this
					  _this.glModel = true
					},
					// 导入
					drModelShow () {
					  let _this = this
					  _this.drModel = true
					},
					// 国家数量
					glListModelShow(index, row) {
						let _this = this;
						_this.glListModel = true
						let item = _this.tableData[index]
						let num = item.Numbers
						_this.title = num + ' 关联国家列表'
					},
					// 解除关联
					jcModelShow () {
					  let _this = this
					  _this.jcModel = true
					},
					// 绑定网址
					bindModelShow () {
					  let _this = this
					  _this.bindModel = true
					},
					// 订单任务
					OrderTaskModelShow () {
					  let _this = this
					  _this.OrderTaskModel = true
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
