<template>
	<div class="container">
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
			<el-button type="success " size="medium " @click="addRole"><i class="el-icon-plus "></i>新建</el-button>
			<el-button type="primary " size="medium " :disabled="disabled " @click="editRole"><i class="el-icon-edit-outline "></i>修改</el-button>
			<el-button type="danger " size="medium " :disabled="disabled " @click="delHandle"><i class="el-icon-delete "></i>删除</el-button>
		</div>
		<div class="mt10 ">
			<el-table v-loading="loading" :data="roleData" border style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="selection"></el-table-column>
				<el-table-column prop="Numbers" label="角色名称" align="center"></el-table-column>
				<el-table-column prop="CountryId" label="英文名称" align="center"></el-table-column>
				<el-table-column prop="ProductByASIN" label="状态" align="center"></el-table-column>
				<el-table-column prop="ProductByASIN" label="操作" align="center">
					<i class="el-icon-view" @click="viewRoleHandle"></i>
					<i class="el-icon-edit" @click="editRole"></i>
					<i class="el-icon-delete" @click="delHandle"></i>
					<i class="el-icon-setting" @click="permissionHandle"></i>
					<i class="el-icon-user"></i>
				</el-table-column>
			</el-table>
		</div>
		<!--新建、修改-->
		<el-dialog :title="title" :visible.sync="roleModel " :close-on-click-modal="false" :before-cloes="cloesRoleModel" center :modal-append-to-body="false" :append-to-body="true">
			<el-form :model="roleForm " ref="roleForm " :rules="rules" label-width="100px ">
				<el-row>
					<el-col :span="12 ">
						<el-form-item label="角色名称 " prop="roleName">
							<el-input v-model="roleForm.roleName"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12 ">
						<el-form-item label="英文名称" prop="englishName">
							<el-input v-model="roleForm.englishName"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12 ">
						<el-form-item label="角色类型">
							<el-select v-model="roleForm.roleType" placeholder="任务分配">
								<el-option label="管理角色" value="manage"></el-option>
								<el-option label="普通角色" value="normal"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12 ">
						<el-form-item label="是否系统数据">
							<el-select v-model="roleForm.dataType">
								<el-option label="是" value="yes"></el-option>
								<el-option label="否" value="no"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12 ">
						<el-form-item label="是否可用">
							<el-select v-model="roleForm.canUse">
								<el-option label="是" value="yes"></el-option>
								<el-option label="否" value="no"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12 ">
						<el-form-item label="备注 ">
							<el-input v-model="roleForm.remark"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<div class="textCen">
					<el-button type="primary">确定</el-button>
					<el-button @click="cloesRoleModel">取消</el-button>
				</div>
			</el-form>
		</el-dialog>
		<!--查看角色-->
		<el-dialog title="查看角色" :visible.sync="roleViewModel " :close-on-click-modal="false" center :modal-append-to-body="false" :append-to-body="true">
			<el-form :model="roleForm " ref="roleForm " label-width="100px">
				<el-row>
					<el-col :span="12 ">
						<el-form-item label="角色名称 ">
							<el-input v-model="roleForm.roleName " readonly></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12 ">
						<el-form-item label="英文名称">
							<el-input v-model="roleForm.englishName" readonly></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12 ">
						<el-form-item label="角色类型">
							<el-select v-model="roleForm.roleType" placeholder="任务分配" disabled>
								<el-option label="管理角色" value="manage"></el-option>
								<el-option label="普通角色" value="normal"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12 ">
						<el-form-item label="是否系统数据">
							<el-select v-model="roleForm.dataType" disabled>
								<el-option label="是" value="yes"></el-option>
								<el-option label="否" value="no"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12 ">
						<el-form-item label="是否可用">
							<el-select v-model="roleForm.canUse" disabled>
								<el-option label="是" value="yes"></el-option>
								<el-option label="否" value="no"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12 ">
						<el-form-item label="备注 " disabled>
							<el-input v-model="roleForm.remark"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-dialog>
		<!--删除-->
		<el-dialog title="系统提示 " :visible.sync="delModel " :close-on-click-modal="false " center width="30%" :modal-append-to-body="false" :append-to-body="true">
			<div class="del-dialog-cnt textCen ">确认要删除选中角色吗？</div>
			<span slot="footer" class="dialog-footer">
        		<el-button type="primary" size="medium">是</el-button>
        		<el-button @click="delModel=false" size="medium">否</el-button>
      		</span>
		</el-dialog>
		<!--权限分配-->
		<el-dialog title="菜单权限" :visible.sync="permissionModel " :close-on-click-modal="false " center width="30%" :modal-append-to-body="false" :append-to-body="true">
			<el-tabs v-model="activeName">
				<el-tab-pane label="菜单权限" name="menuPermission" :key="'menuPermission'">
					<el-tree :data="treeData" show-checkbox node-key="id" :default-expanded-keys="[2, 3]" :default-checked-keys="[5]" :props="defaultProps">
					</el-tree>
				</el-tab-pane>
				<el-tab-pane label="数据权限" name="dataPermission" :key="'dataPermission'">
					<el-tree :data="treeData" show-checkbox node-key="id" :default-expanded-keys="[2, 3]" :default-checked-keys="[5]" :props="defaultProps">
					</el-tree>
				</el-tab-pane>
			</el-tabs>
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
				roleData: [],
				title: "新建",
				roleModel: false,
				delModel: false,
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
			this.getAllData();
		},
		methods: {
			//重置查询表单
			resetSearch() {
				let _this = this;
				_this.searchForm = {
					roleName: ''
				};
			},
			//新建
			addRole() {
				let _this = this;
				_this.roleModel = true;
			},
			//修改
			editRole() {
				let _this = this;
				_this.roleModel = true;
				_this.title = "修改 ";
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
			//删除弹窗
			delHandle() {
				let _this = this;
				_this.delModel = true;
			},
			//查看角色弹窗
			viewRoleHandle() {
				let _this = this;
				_this.roleViewModel = true;
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
