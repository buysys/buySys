<template>
	<div class="container">
		<div class="mb20">
			<el-button type="success" size="medium" @click="addHandle"><i class="el-icon-plus"></i>新建</el-button>
			<el-button type="primary" size="medium" :disabled="disabled" @click="editHandle"><i class="el-icon-edit-outline"></i>修改</el-button>
			<el-button type="danger" size="medium" :disabled="disabled" @click="delHandle"><i class="el-icon-delete"></i>删除</el-button>
		</div>
		<div class="mt10">
			<el-table :data="tagData" border style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="selection"></el-table-column>
				<el-table-column prop="Numbers" label="标签" align="center"></el-table-column>
			</el-table>
			<div class="mt30">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
		</div>
		<!--新建、修改标签-->
		<el-dialog :title="title" :visible.sync="tagModel" :close-on-click-modal="false" center :before-close="closeTagModel" :modal-append-to-body="false" :append-to-body="true" >
			<el-form :model="tagForm" ref="tagForm" :rules="tagRules" label-width="88px">  
				<el-form-item label="标签名" prop="tag">
					<el-input v-model="tagForm.tag"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
        		<el-button type="primary" size="medium">确定</el-button>
        		<el-button @click="closeTagModel" size="medium">取消</el-button>
      		</span>
		</el-dialog>
		<!--删除-->
		<el-dialog title="系统提示" :visible.sync="delModel" :close-on-click-modal="false" center="" width="20%" :modal-append-to-body="false" :append-to-body="true">
			<div class="del-dialog-cnt textCen">确认要删除该标签记录吗？</div>
			<span slot="footer" class="dialog-footer">
        		<el-button type="primary" size="medium">确定</el-button>
        		<el-button @click="delModel=false" size="medium">取消</el-button>
      		</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'buyTagList',
		data() {
			return{
				disabled: true,
				tagData: [],
				title: '新建',
				currentPage: 1,
				pageSize: '0',
				total:100,
				tagModel: false,
				delModel: false,
				tagForm: {
					tag: ''
				},
				tagRules:{
					tag:[{
						required: true,
						message: '请输入标签名',
						trigger: 'blur'
					}]
				}
			}
		},
		methods: {
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
			//新建弹窗
			addHandle() {
				let _this = this;
				_this.tagModel = true;
			},
			//修改弹窗
			editHandle() {
				let _this = this;
				_this.tagModel = true;
				_this.title = "修改";
			},
			//关闭新建、修改弹窗
			closeTagModel() {
				let _this = this;
				_this.tagModel = false;
				_this.tagForm = {
					tag: ''
				}
			},
			//删除弹窗
			delHandle() {
				let _this = this;
				_this.delModel = true;
			},
			//分页
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`)
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`)
			},
			//获取表格数据
			getAllData() {
				let _this = this
				_this.axios.get(_this.GLOBAL.BASE_URL + 'api/OrderManagement/AddOrderByType').then((res) => {
					_this.tagData = res.data.data
				}).catch((error) => {
					console.log(error)
				})
			}
		}
	}
</script>

<style>
</style>