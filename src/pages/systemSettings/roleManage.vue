<template>
	<div>
		<div class="mt10">
			<el-collapse-transition>
				<div class="searchBox mb20 pl30">
					<el-form ref="searchForm" :model="searchForm" class="form-item" label-width="80px">
						<el-row :gutter="20">
							<el-col :xs="24" :span="4">
								<el-form-item label="角色名称">
									<el-input v-model="searchForm.roleName" class="disInline" placeholder="请输入角色名称"></el-input>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :span="4">
								<el-button type="primary " size="medium">查询</el-button>
								<el-button size="medium " @click="resetSearch">重置</el-button>
							</el-col>
						</el-row>
					</el-form>
				</div>
			</el-collapse-transition>
		</div>
		<div class="mb20">
			<el-button type="success " size="medium " @click="addRole"><i class="el-icon-plus "></i>新增</el-button>
			<el-button type="primary " size="medium " :disabled="disabled " @click="editRole"><i class="el-icon-edit-outline "></i>修改</el-button>
		</div>
		<div class="mt10 ">
			<el-table v-loading="loading" :data="roleData" border style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="selection"></el-table-column>
				<el-table-column prop="Numbers" label="角色名称" align="center"></el-table-column>
				<el-table-column prop="CountryId" label="备注" align="center"></el-table-column>
				<el-table-column prop="Status" label="禁用 | 启用" align="center">
				  <template slot-scope="scope">
				    <el-switch active-color="#67c23a" inactive-color="#dcdfe6" active-value="1" inactive-value="0" v-model="scope.row.Status" @change="changeStatus(scope.$index,scope.row)">
				    </el-switch>
				  </template>
				</el-table-column>
				<el-table-column prop="ProductByASIN" label="操作" align="center">
					<el-button size="small" type="primary" @click="permissionHandle">绑定权限</el-button>
				</el-table-column>
			</el-table>
		</div>
		<!--新增修改-->
		<el-dialog :title="title" :visible.sync="roleModel" :close-on-click-modal="false" :before-cloes="cloesRoleModel" width="30%" :modal-append-to-body="false" :append-to-body="true">
			<el-form :model="roleForm " ref="roleForm " :rules="rules" label-width="100px ">
				<el-row>
					<el-col :span="24">
						<el-form-item label="角色名称" prop="roleName">
							<el-input v-model="roleForm.roleName"></el-input>
						</el-form-item>
					</el-col>
          </el-row>
          <el-row>
					<el-col :span="24">
						<el-form-item label="备注 ">
							<el-input v-model="roleForm.remark"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
      <div slot="footer" class="dialog-footer">
      	<el-button type="primary" size="medium">确 定</el-button>
      	<el-button @click="roleModel=false" size="medium">取 消</el-button>
      </div>
		</el-dialog>
		<!--权限分配-->
		<el-dialog title="角色权限" :visible.sync="permissionModel" :close-on-click-modal="false" center width="30%" custom-class="fixed-dialog" :modal-append-to-body="false" :append-to-body="true">
			<el-tree :data="treeData" show-checkbox node-key="id" :default-expanded-keys="[2, 3]" :default-checked-keys="[5]" :props="defaultProps"></el-tree>
      <div slot="footer" class="dialog-footer">
      	<el-button type="primary" size="medium">确 定</el-button>
      	<el-button @click="permissionModel=false" size="medium">取 消</el-button>
      </div>
    </el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'roleManage',
		data() {
			return {
				disabled: true,
				loading: false,
				roleData: [{
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
				title: "",
				roleModel: false,
				roleViewModel: false,
				permissionModel: false,
				activeName: "menuPermission",
				searchForm: {
					roleName: ''
				},
				roleForm: {
					roleName: '',
					englishName: '',
					roleType: '',
					dataType: '',
					canUse: '',
					remark: ''
				},
				rules: {
					roleName: [{
						required: true,
						message: '请输入角色名',
						trigger: 'blur'
					}],
					englishName: [{
						required: true,
						message: '请输入英文名',
						trigger: 'blur'
					}]
				},
				treeData: [{
					id: 1,
					label: '一级 1',
					children: [{
						id: 4,
						label: '二级 1-1',
						children: [{
							id: 9,
							label: '三级 1-1-1'
						}, {
							id: 10,
							label: '三级 1-1-2'
						}]
					}]
				}, {
					id: 2,
					label: '一级 2',
					children: [{
						id: 5,
						label: '二级 2-1'
					}, {
						id: 6,
						label: '二级 2-2'
					}]
				}, {
					id: 3,
					label: '一级 3',
					children: [{
						id: 7,
						label: '二级 3-1'
					}, {
						id: 8,
						label: '二级 3-2'
					}]
				}],
				defaultProps: {
					children: 'children',
					label: 'label'
				}
			}
		},
		created() {
			// this.getAllData();
		},
		methods: {
			//重置查询表单
			resetSearch() {
				let _this = this;
				_this.searchForm = {
					roleName: ''
				};
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
			//新建
			addRole() {
				let _this = this;
				_this.roleModel = true;
        _this.title = "角色新增"
			},
			//修改
			editRole() {
				let _this = this;
				_this.roleModel = true;
				_this.title = "角色修改";
			},
			//关闭新建或修改弹窗
			cloesRoleModel() {
				let _this = this;
				_this.roleModel = false;
				_this.roleForm = {
					roleName: '',
					englishName: '',
					roleType: '',
					dataType: '',
					canUse: '',
					remark: ''
				}
			},
			//权限分配
			permissionHandle() {
				let _this = this;
				_this.permissionModel = true;
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
					_this.roleData = res.data.data
					_this.loading = false
				}).catch((error) => {
					console.log(error)
				})
			}
		}
	}
</script>

<style>
	.el-select {
		width: 100%;
	}
</style>
