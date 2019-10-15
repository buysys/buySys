<template>
	<div>
		<div class="mb20">
			<el-button type="success" size="medium" @click="addModelShow"><i class="el-icon-plus"></i>新增</el-button>
			<el-button type="primary" size="medium" @click="editModelShow" :disabled="editDisabled"><i class="el-icon-edit-outline"></i>修改</el-button>
			<el-button type="warning" size="medium" @click="exportExcel"><i class="el-icon-upload2"></i>导出</el-button>
		</div>
		<div class="mt10">
		<el-table :data="tableData" id="exportData" style="width: 100%" :header-cell-style="{background:'#fafafa'}" @selection-change="handleSelectionChange">
			<el-table-column type="selection"></el-table-column>
				<el-table-column prop="CountryId" label="任务类型" align="center"></el-table-column>
				<el-table-column prop="OrderNumber" label="价格" align="center"></el-table-column>
				<el-table-column prop="OrderNumber" label="说明" align="center"></el-table-column>
        <el-table-column prop="Status" label="禁用 | 启用" align="center">
          <template slot-scope="scope">
            <el-switch active-color="#67c23a" inactive-color="#dcdfe6" active-value="1" inactive-value="0" v-model="scope.row.Status" 
			@change="changeStatus(scope.$index,scope.row)">
            </el-switch>
          </template>
        </el-table-column>
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
			</el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click="submitData">确 定</el-button>
        <el-button @click="editModel=false" size="medium">取 消</el-button>
      </div>
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
				tableData: [{
            "Numbers": "20190605105636229596",
            "Picture": "",
            "CountryId": "美国",
            "Forum": "Amazon",
            "ProductByASIN": "777888999a",
            "ProductPrice": 15.99,
            "ServiceType": "不留评",
            "OrderNote": "待付款",
            "Status": "1",
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
            "Status": "0",
            "OrderNumber": 7758258,
            "OrderTime": "2019-04-02T00:00:00",
            "Remark": ""
        }
],
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
					// this.getAllData()
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
					// 切换状态
					changeStatus(index, row) {
						let _this = this
						let item = _this.tableData[index]
					  console.log(item.Status)
					  if(item.Status == '0'){
						_this.tableData.Status = '1'
					  }
					  if(item.Status == '1'){
					  _this.tableData.Status = '0'
					  }
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
