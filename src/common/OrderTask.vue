<template>
	<div class="container">
		<div class="mb20">
			<el-button type="success" size="medium" @click="addModelShow"><i class="el-icon-plus"></i>新增</el-button>
			<el-button type="primary" size="medium" @click="editModelShow" :disabled="editDisabled"><i class="el-icon-edit-outline"></i>修改</el-button>
			<el-button type="danger" size="medium" @click="delData" :disabled="delDisabled"><i class="el-icon-delete"></i>删除</el-button>
			<el-button type="warning" size="medium" @click="exportExcel"><i class="el-icon-document-delete"></i>导出</el-button>
		</div>
		<div class="mt10">
		<el-table v-loading="loading" :data="tableData" id="exportData" style="width: 100%" :header-cell-style="{background:'#fafafa'}" @selection-change="handleSelectionChange">
			<el-table-column type="selection"></el-table-column>
				<el-table-column prop="CountryId" label="任务类型" align="center"></el-table-column>
				<el-table-column prop="OrderNumber" label="价格" align="center"></el-table-column>
				<el-table-column prop="OrderNumber" label="说明" align="center"></el-table-column>
				<el-table-column prop="OrderNumber" label="状态" align="center"></el-table-column>
				<el-table-column prop="" label="操作" align="center"><el-link type="primary" :underline="false" @click="forbidModelShow">禁用</el-link></el-table-column>
		</el-table>
		<div class="mt30">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[100, 200, 300, 500]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		</div>
		<!-- 新增修改 -->
		<el-dialog :title="title" :visible.sync="editModel" :close-on-click-modal="false" :before-close="closeModel" :modal-append-to-body="false" :append-to-body="true">
			<el-form :model="editForm" :rules="editRules" label-width="125px" status-icon>
				<el-form-item label="任务类型" prop="type">
					<el-input v-model="editForm.type"></el-input>
				</el-form-item>
				<el-form-item label="价格" prop="money">
					<el-input v-model="editForm.money"></el-input>
				</el-form-item>
				<el-form-item label="说明">
					<el-input type="textarea" v-model="editForm.remark"></el-input>
				</el-form-item>
				<p class="txtCenter">
					<el-button type="primary" @click="submitData">确定</el-button>
					<el-button @click="editModel=false">取消</el-button>
				</p>
			</el-form>
		</el-dialog>
		<!-- 删除-->
		<el-dialog title="温馨提示" :visible.sync="delModel" :close-on-click-modal="false" center width="30%" :modal-append-to-body="false" :append-to-body="true">
		  <div class="del-dialog-cnt textCen">确认要删除该数据吗？</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button type="primary" size="medium">确定</el-button>
		    <el-button @click="delModel=false" size="medium">取消</el-button>
		  </span>
		</el-dialog>
		<!-- 禁用-->
		<el-dialog title="温馨提示" :visible.sync="forbidModel" :close-on-click-modal="false" center width="30%" :modal-append-to-body="false" :append-to-body="true">
		  <div class="del-dialog-cnt textCen">确定要禁用吗？</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button type="primary" size="medium">确定</el-button>
		    <el-button @click="forbidModel=false" size="medium">取消</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	import FileSaver from 'file-saver'
	import XLSX from 'xlsx'
	export default {
		name: 'OrderTask',
		data() {
			return {
				loading:true,
				editModel: false,
				delModel: false,
				forbidModel: false,
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
					type: '',
					money: '',
					remark: ''
				},
				editRules: {
					type: [{
						required: true,
						message: '请输入类型',
						trigger: 'blur'
					}],
					money: [{
						required: true,
						message: '请输入费用',
						trigger: 'blur'
					}]
				},
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
						_this.title = '查看任务新增'
					},
					// 修改
					editModelShow() {
						let _this = this
						_this.editModel = true
						let item = _this.checkBoxData[0]
						let num = item.Forum
						_this.title = num + ' 查看任务修改'
						_this.editForm.type = item.CountryId;
						_this.editForm.money = item.CountryId;
						_this.editForm.remark = item.CountryId;
					},
					// 删除
					delData () {
					  let _this = this
					  _this.delModel = true
					},
					// 禁用启用
					forbidModelShow () {
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

          //提交数据
          submitData(){
            let _this = this
            let param = {
              OrderForumId : '',
              OrderName : _this.editForm.type,
              ServiceFee: _this.editForm.money,
              Explain: _this.editForm.remark,
              Enabled: 0
            }
            _this.axios.post(_this.GLOBAL.BASE_URL + '/getOrade',param).then((res) => {
              let data = res.data
              if (data.success == 200){
                _this.$message.success('操作成功')
                _this.editModel = false
                // _this.allNum = res.data.data.length
              }
            }).catch((error) => {
            	console.log(error)
            })
          }
			}
		}
</script>

<style>
</style>
