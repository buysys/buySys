<template>
	<div class="container">
		<div class="mb20 fz14">
      <span>首页</span>
      <span>/</span>
			<span>用户管理</span>
		</div>
		<div class="mt10">
			<el-collapse-transition>
				<div class="searchBox mb20 pl30">
					<el-form ref="searchForm" :model="searchForm" class="form-item" label-width="80px">
						<el-row :gutter="10">
							<el-col :xs="24" :span="4">
								<el-form-item label="登录名">
									<el-input v-model="searchForm.userLoginName" class="disInline" placeholder="请输入登录名"></el-input>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :span="4">
								<el-form-item label="姓名 ">
									<el-input v-model="searchForm.username" class="disInline" placeholder="请输入姓名"></el-input>
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
			<div class="mb20 ">
				<el-button type="success" size="medium" @click="addUser "><i class="el-icon-plus"></i>新增</el-button>
				<el-button type="primary" size="medium" :disabled="disabled" @click="editUser"><i class="el-icon-edit-outline"></i>修改</el-button>
        <el-button type="warning" size="medium" @click="importHandle"><i class="el-icon-upload2"></i>导入</el-button>
        <el-button type="warning" size="medium" @click="exportExcel"><i class="el-icon-download"></i>导出</el-button>
				<el-button type="success" size="medium" @click="roleModelShow" style="float: right;"><i class="el-icon-set-up"></i>角色管理
				</el-button>
			</div>
			<div class="mt10 ">
				<el-table :data="userData" id="exportOrder" border style="width: 100%" @selection-change="handleSelectionChange">
					<el-table-column type="selection"></el-table-column>
					<el-table-column prop="ProductByASIN" label="姓名" align="center"></el-table-column>
          <el-table-column prop="CountryId" label="邮箱" align="center"></el-table-column>
					<el-table-column prop="ProductByASIN" label="手机" align="center"></el-table-column>
          <el-table-column prop="ProductByASIN" label="角色" align="center"></el-table-column>
          <el-table-column prop="Status" label="禁用 | 启用" align="center">
            <template slot-scope="scope">
              <el-switch active-color="#67c23a" inactive-color="#dcdfe6" active-value="1" inactive-value="0" v-model="scope.row.Status" @change="changeStatus(scope.$index,scope.row)">
              </el-switch>
            </template>
          </el-table-column>
				</el-table>
				<div class="mt30">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage " :page-sizes="[100, 200, 300, 500] " :page-size="10 " layout="total, sizes, prev, pager, next, jumper " :total="total ">
					</el-pagination>
				</div>
			</div>
			<!--新增修改-->
			<el-dialog :title="title " :visible.sync="userModel" :close-on-click-modal="false" :before-close="cloesUserModel">
				<el-form :model="userForm" ref="userForm" label-width="100px" :rules="editRules">
					<el-row>
						<el-col :span="12">
							<el-form-item label="姓名" prop="userName">
								<el-input v-model="userForm.userName"></el-input>
							</el-form-item>
						</el-col>
            <el-col :span="12">
            	<el-form-item label="邮箱" prop="email">
            		<el-input v-model="userForm.email"></el-input>
            	</el-form-item>
            </el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="密码" prop="pwd">
								<el-input v-model="userForm.pwd"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="确认密码" prop="checkPwd">
								<el-input v-model="userForm.checkPwd"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="手机" prop="mobile">
								<el-input v-model="userForm.mobile"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<el-form-item label="用户角色" prop="userRole">
								<el-checkbox-group v-model="userForm.userRole">
									<el-checkbox label="Seller" name="type"></el-checkbox>
									<el-checkbox label="刷手" name="type"></el-checkbox>
									<el-checkbox label="注册账号" name="type"></el-checkbox>
									<el-checkbox label="财务" name="type"></el-checkbox>
									<el-checkbox label="部门管理员" name="type"></el-checkbox>
								</el-checkbox-group>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label="备注">
								<el-input v-model="userForm.remark"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
        <div slot="footer" class="dialog-footer">
        	<el-button type="primary" size="medium">确定</el-button>
        	<el-button @click="userModel=false" size="medium">取消</el-button>
        </div>
			</el-dialog>
			<!--导入数据-->
			<el-dialog title="导入数据" :visible.sync="importModel" :close-on-click-modal="false" :before-close="closeImportModel" center width="30%">
				<div class="del-dialog-cnt textCen">
					<el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" ref="upload" multiple :limit="3" :file-list="fileList">
						<el-button size="mini">选择文件</el-button>
						<span slot="tip" class="el-upload__tip">导入文件不能超过5M，仅允许导入“xls”或“xlsx”格式文件！</span>
					</el-upload>
				</div>
				<span slot="footer" class="dialog-footer">
							<el-button size="medium " type="primary" @click="exportExcel">下载模板</el-button>
        					<el-button size="medium " type="primary">确定</el-button>
        					<el-button @click="closeImportModel" size="medium">取消</el-button>
      					</span>
			</el-dialog>
			<!--角色管理-->
			<el-dialog title="角色管理" :visible.sync="roleModel" :close-on-click-modal="false" width="90%" custom-class="fixed-dialog">
				<roleManage></roleManage>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import FileSaver from 'file-saver'
	import XLSX from 'xlsx'

	import roleManage from './roleManage'
	export default {
		name: 'userManage',
		data() {
			return {
				disabled: true,
				loading: true,
				importModel: false,
				roleModel: false,
				fileList: [],
				currentPage: 1,
				pageSize: '0',
				total: 100,
				userModel: false,
				title: "",
				checkBoxData: [],
				searchForm: {
					userLoginName: '',
					userName: ''
				},
				userForm: {
					portrait: '',
					jobNum: '',
					userName: '',
					userLoginName: '',
					pwd: '',
					checkPwd: '',
					email: '',
					phone: '',
					mobile: '',
					allowLogin: '',
					userRole: [],
					remark: ''
				},
				userData: [{
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
						"Remark": "",
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
				editRules: {
					userName: [{
						required: true,
						message: '请输入姓名',
						trigger: 'blur'
					}],
          email: [{
          	required: true,
          	message: '请输入邮箱',
          	trigger: 'blur'
          }],
          pwd: [{
          	required: true,
          	message: '请输入密码',
          	trigger: 'blur'
          }],
          checkPwd: [{
          	required: true,
          	message: '请输入确认密码',
          	trigger: 'blur'
          }],
					mobile: [{
						required: true,
						message: '请输入手机',
						trigger: 'blur'
					}],
					userLoginName: [{
						required: true,
						message: '请输入登录名',
						trigger: 'blur'
					}],
					userRole: [{
						required: true,
						message: '请选择角色',
						trigger: 'blur'
					}]
				}
			};
		},
		components: {
			roleManage
		},
		created() {
//			this.getAllData()
		},
		methods: {
			//重置查询表单
			resetSearch() {
				let _this = this;
				_this.searchForm = {
					company: '',
					department: '',
					userLoginName: '',
					userName: ''
				}
			},
      // 切换状态
      changeStatus(index, row) {
      	let _this = this
      	let item = _this.userData[index]
        console.log(item.Status)
        if(item.Status == '0'){
      	_this.userData.Status = '1'
        }
        if(item.Status == '1'){
        _this.userData.Status = '0'
        }
      },
			//新增
			addUser() {
				let _this = this;
				_this.userModel = true;
        _this.title = "用户新增"
			},
			//修改
			editUser() {
				let _this = this;
				_this.userModel = true;
				_this.title = "用户修改";
			},
			//关闭新建或修改弹窗
			cloesUserModel() {
				let _this = this;
				_this.userModel = false;
				_this.userForm = {
					portrait: '',
					jobNum: '',
					userName: '',
					userLoginName: '',
					pwd: '',
					checkPwd: '',
					email: '',
					phone: '',
					mobile: '',
					allowLogin: '',
					userRole: '',
					remark: ''
				};
			},
			//导入弹窗
			importHandle() {
				let _this = this;
				_this.importModel = true;
			},
			//角色管理
			roleModelShow() {
				let _this = this;
				_this.roleModel = true;
			},
			//关闭导入弹窗
			closeImportModel() {
				let _this = this;
				_this.importModel = false;
				_this.fileList = [];
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
					}), '用户数据.xlsx')
				} catch(e) {
					if(typeof console !== 'undefined') {
						console.log(e, wbout)
					}
				}
				return wbout
			},
			//分页
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`)
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`)
			},
			//是否选中
			handleSelectionChange(val) {
				this.checkBoxData = val
				let checkNum = this.checkBoxData.length
				console.log(checkNum)
				if(checkNum !== 1) {
					this.disabled = true
				} else {
					this.disabled = false
				}
			},
			//获取表格数据
			getAllData() {
				let _this = this
				_this.axios.get(_this.GLOBAL.BASE_URL + 'api/OrderManagement/AddOrderByType').then((res) => {
					_this.userData = res.data.data
					_this.loading = false
				}).catch((error) => {
					console.log(error)
				})
			}
		}
	}
</script>

<style>
	.tree {
		border: 1px solid #eee;
	}

	.el-select {
		width: 100%;
	}
</style>
