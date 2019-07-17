<template>
	<div>
		<div class="mb20">
			<el-button type="success" size="medium" @click="addService"><i class="el-icon-plus"></i>新增</el-button>
			<el-button type="primary" size="medium" :disabled="disabled" @click="editService"><i class="el-icon-edit-outline"></i>修改
			</el-button>
			<el-button type="danger" size="medium" :disabled="disabled" @click="delHandel"><i class="el-icon-delete"></i>删除
			</el-button>
		</div>
		<div class="mt10">
			<el-table :data="returnOrderData" v-model='loading' border style="width: 100%" height='500' @selection-change="handleSelectionChange">
				<el-table-column type="selection"></el-table-column>
				<el-table-column prop="Numbers" sortable label="开始区间($)" align="center"></el-table-column>
				<el-table-column prop="CountryId" sortable label="结束区间($)" align="center"></el-table-column>
				<el-table-column prop="ProductByASIN" sortable label="增值服务费($)" align="center"></el-table-column>
			</el-table>
			<div class="mt30">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
		</div>
		<!--新增/修改-->
		<el-dialog :title='serviceTitle' :visible.sync='addServiceModal' :close-on-click-modal='false'>
			<el-form :model='serviceForm' ref='serviceForm' :rules='formRules' label-width='120px'>
				<el-form-item label='开始区间$' prop='startSection'>
					<el-input v-model='serviceForm.startSection'></el-input>
				</el-form-item>
				<el-form-item label='结束区间$' prop='endSection'>
					<el-input v-model='serviceForm.endSection'></el-input>
				</el-form-item>
				<el-form-item label='增值服务费(￥)' prop='service'>
					<el-input v-model='serviceForm.service'></el-input>
				</el-form-item>
				<el-form-item label='备注'>
					<el-input v-model='serviceForm.remark'></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="addServiceModal=false">确 定</el-button>
				<el-button @click="addServiceModal = false">取 消</el-button>
			</div>
		</el-dialog>
		<!-- 删除-->
		<el-dialog title="温馨提示" :visible.sync="delServiceModal" :close-on-click-modal="false" center width="30%">
			<div class="del-dialog-cnt textCen">确认要删除该数据吗？</div>
			<span slot="footer" class="dialog-footer">
		    <el-button type="primary" size="medium">是</el-button>
		    <el-button @click="delServiceModal=false" size="medium">否</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'ParameterService',
		data() {
			return {
				serviceTitle: '',
				currentPage: 1,
				pageSize: '0',
				total: 100,
				disabled: true,
				loading: true,
				addServiceModal: false, //新增
				delServiceModal: false, //删除
				tipMessage: '',
				returnOrderData: [{
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
				checkBoxData: [], //选中信息
				serviceForm: {
					startSection: '',
					endSection: '',
					service: '',
					remark: ''
				},
				formRules: {
					startSection: [{
						required: true,
						message: '请输入开始区间',
						trigger: 'blur'
					}],
					endSection: [{
						required: true,
						message: '请输入结束区间',
						trigger: 'blur'
					}],
					service: [{
						required: true,
						message: '请输入增值服务费',
						trigger: 'blur'
					}]
				}
			}
		},
		created() {
//			this.getAllData()
		},
		methods: {
			//新建弹窗
			addService() {
				let _this = this
				_this.addServiceModal = true
				_this.serviceTitle = '增值服务费新增'
			},
			//修改弹窗
			editService() {
				let _this = this
				_this.addServiceModal = true
				_this.serviceTitle = '增值服务费修改'
			},
			//关闭新增弹窗
			closeModal() {
				let _this = this
				_this.addServiceModal = false
			},
			//初始化数据
			getAllData() {
				let _this = this
				_this.active = 1
				_this.axios.get(_this.GLOBAL.BASE_URL + 'api/OrderManagement/AddOrderByType').then((res) => {
					_this.returnOrderData = res.data.data
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
			//删除
			delHandel() {
				let _this = this
				_this.delServiceModal = true

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