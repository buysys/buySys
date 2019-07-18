<template>
	<div>
		<el-collapse-transition>
			<div class="searchBox mb20 pl30">
				<el-form ref="searchForm" :model="searchForm" class="form-item" label-width="80px">
					<el-row>
						<el-col :xs="24" :span="4">
							<el-form-item label="卡号">
								<el-input v-model="searchForm.CardNo" placeholder="请输入信用卡卡号" class="disInline"></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :span="4">
							<el-form-item label="姓名">
								<el-input v-model="searchForm.username" placeholder="请输入信用卡姓名" class="disInline"></el-input>
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
			<el-button type="success" size="medium" @click="addLevel"><i class="el-icon-plus"></i>新增</el-button>
			<el-button type="primary" size="medium" :disabled="disabled" @click="editLevel"><i class="el-icon-edit-outline"></i>修改</el-button>
			<el-button type="danger" size="medium" :disabled="disabled" @click="delHandle"><i class="el-icon-delete"></i>删除</el-button>
			<el-button type="primary" size="medium" :disabled="disabled" @click="quotaHandle"><i class="el-icon-edit-outline"></i>修改额度</el-button>
			<el-button type="primary" size="medium" @click="importHandle"><i class="el-icon-upload2"></i>导入</el-button>
			<el-button type="primary" size="medium" @click="exportExcel"><i class="el-icon-download"></i>导出</el-button>
		</div>
		<div class="mt10">
			<el-table :data="buyNumData" id="exportOrder" border style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="selection"></el-table-column>
				<el-table-column prop="Numbers" label="主卡卡号" align="center" sortable></el-table-column>
				<el-table-column prop="CountryId" label="名称" align="center" sortable></el-table-column>
				<el-table-column prop="ProductByASIN" label="有效期" align="center" sortable></el-table-column>
				<el-table-column prop="ProductByASIN" label="安全码" align="center" sortable></el-table-column>
				<el-table-column prop="ProductPrice" label="姓名" align="center" sortable></el-table-column>
				<el-table-column prop="ServiceType" label="总额度($)" align="center" sortable></el-table-column>
				<el-table-column prop="OrderNote" label="已用额度($)" align="center" sortable></el-table-column>
				<el-table-column prop="OrderNote" label="剩余额度($)" align="center" sortable></el-table-column>
				<el-table-column prop="OrderNote" label="累积使用($)" align="center" sortable></el-table-column>
				<el-table-column prop="OrderNote" label="状态" align="center" sortable></el-table-column>
				<el-table-column prop="OrderNote" label="买家状态" align="center" sortable></el-table-column>
				<el-table-column prop="Stautuy" label="买号状态" align="center" sortable></el-table-column>
				<el-table-column prop="Status" label="操作" align="center">
					<template slot-scope="scope">
						<el-button size="small" type="primary" @click="repaymentHandle">还款
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="mt30">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[100, 200, 300, 500]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
		</div>
		<!--新建、修改-->
		<el-dialog :title="title" :visible.sync="cardModel" :close-on-click-modal="false" width='80%' :before-close="closeModel">
			<el-form :model="cardForm" ref="cardForm" :rules="editRules" class="demo-dynamic" label-width="88px" status-icon>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label="名称" prop="name">
							<el-input v-model="cardForm.name" class='inpWid'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label="卡号" prop="cardNo">
							<el-input v-model="cardForm.cardNo" class='inpWid'></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label="有效期" prop="validity">
							<el-input v-model="cardForm.validity" class='inpWid'></el-input>
							<!--<el-date-picker v-model="cardForm.validity" type="date" placeholder="选择日期" size="large"></el-date-picker>-->
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label="安全码" prop="safetyCode">
							<el-input v-model="cardForm.safetyCode" class='inpWid'></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label="姓名" prop="userName">
							<el-input v-model="cardForm.userName" class='inpWid'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label="总额度" prop="totalAmount">
							<el-input v-model="cardForm.totalAmount" class='inpWid'></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label="备注" prop="remark">
							<el-input type='textarea' v-model="cardForm.remark" class='inpWid'></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary">确定</el-button>
				<el-button @click="closeModel">取消</el-button>
			</div>
		</el-dialog>
		<!--删除-->
		<el-dialog title="系统提示" :visible.sync="delModel" :close-on-click-modal="false" center width="30%">
			<div class="del-dialog-cnt textCen">此操作会删除信用卡和买号绑定关系，<br /><br />确认要删除该信用卡管理记录吗？</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" size="medium">确定</el-button>
				<el-button @click="delModel=false" size="medium">取消</el-button>
			</div>
		</el-dialog>
		<!--导入数据-->
		<el-dialog title="导入数据" :visible.sync="importModel" :close-on-click-modal="false" :before-close="closeImportModel" width="30%">
			<div class="del-dialog-cnt textCen">
				<el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" ref="upload" multiple :limit="3" :file-list="fileList">
					<el-button size="mini">选择文件</el-button>
					<span slot="tip" class="el-upload__tip">导入文件不能超过5M，仅允许导入“xls”或“xlsx”格式文件！</span>
				</el-upload>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button size="medium" type="primary">下载模板</el-button>
				<el-button size="medium" type="primary">确定</el-button>
				<el-button @click="closeImportModel" size="medium">取消</el-button>
			</div>
		</el-dialog>
		<!--修改额度-->
		<el-dialog title="请输入信用卡额度" :visible.sync="quotaModel" :close-on-click-modal="false" :before-close="closeQuotaModel" width="30%">
			<el-form :model="quotaForm" ref="quotaForm" class="demo-dynamic">
				<el-form-item prop="amount">
					<el-input v-model="quotaForm.amount"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" size="medium">确定</el-button>
				<el-button @click="closeQuotaModel" size="medium">取消</el-button>
			</div>
		</el-dialog>
		<!--还款-->
		<el-dialog title="请输入还款金额" :visible.sync="repaymentModel" :close-on-click-modal="false" :before-close="closeRepaymentModel" width="30%">
			<el-form :model="repaymentForm" ref="repaymentForm" class="demo-dynamic">
				<el-form-item prop="amount">
					<el-input v-model="repaymentForm.amount" autofocus="true"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" size="medium">确定</el-button>
				<el-button @click="closeRepaymentModel" size="medium">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import FileSaver from 'file-saver'
	import XLSX from 'xlsx'

	export default {
		name: 'practicalCard',
		data() {
			return {
				loading: true,
				title: '新增',
				cardModel: false,
				disabled: true,
				delModel: false,
				importModel: false,
				quotaModel: false,
				currentPage: 1,
				repaymentModel: false,
				pageSize: '0',
				total: 100,
				checkBoxData: [],
				fileList: [],
				buyNumData: [{
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
				searchForm: {
					CardNo: '',
					username: ''
				},
				cardForm: {
					names: '',
					cardNo: '',
					validity: '',
					safetyCode: '',
					username: '',
					totalAmount: '',
					remark: ''
				},
				quotaForm: {
					amount: ''
				},
				repaymentForm: {
					amount: ''
				},
				editRules: {
					validity: [{
						required: true,
						message: '请输入有效期',
						trigger: 'blur'
					}],
					names: [{
						required: true,
						message: '请输入姓名',
						trigger: 'blur'
					}],
					totalAmount: [{
						required: true,
						message: '请输入总额度',
						trigger: 'blur'
					}]
				}
			}
		},
		created() {
			this.getAllData()
		},
		methods: {
			//重置
			resetSearch() {
				let _this = this;
				_this.searchForm = {
					platform: '全部',
					searchkeywords: '',
					orderStartTime: '',
					orderEndTime: '',
					status: ''
				}
			},
			// 新建弹窗
			addLevel() {
				let _this = this;
				_this.cardModel = true;
			},
			// 修改弹窗
			editLevel() {
				let _this = this;
				_this.cardModel = true;
				_this.title = "修改";
				let item = _this.checkBoxData[0];
				_this.cardForm.name = item.CountryID;
				_this.cardForm.cardNo = item.Numbers;
				_this.cardForm.validity = item.ProductByASIN;
				_this.cardForm.safetyCode = item.ProductByASIN;
				_this.cardForm.userName = item.ProductByASIN;
				_this.cardForm.totalAmount = item.ProductByASIN;
				_this.cardForm.remark = item.remark;
			},
			//关闭修改价格弹窗
			closeModel() {
				let _this = this;
				_this.cardModel = false;
				_this.cardForm = {
					name: '',
					cardNo: '',
					validity: '',
					safetyCode: '',
					userName: '',
					totalAmount: '',
					remark: ''
				}
			},
			//删除弹窗
			delHandle() {
				let _this = this;
				_this.delModel = true;
			},
			//导入弹窗
			importHandle() {
				let _this = this;
				_this.importModel = true;
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
					}), '下单管理表.xlsx')
				} catch(e) {
					if(typeof console !== 'undefined') {
						console.log(e, wbout)
					}
				}
				return wbout
			},
			//关闭导入弹窗
			closeImportModel() {
				let _this = this;
				_this.importModel = false;
				_this.fileList = [];
			},
			//修改额度弹窗
			quotaHandle() {
				let _this = this;
				_this.quotaModel = true;
			},
			//关闭修改额度弹窗
			closeQuotaModel() {
				console.log("关闭额度");
				let _this = this;
				_this.quotaModel = false;
				_this.quotaForm = {
					amout: ''
				}
			},
			//还款弹窗
			repaymentHandle() {
				let _this = this;
				//				let item = _this.checkBoxData[0];
				_this.repaymentModel = true;
				//				_this.repaymentForm.amount = item.amount;
			},
			//关闭还款弹窗
			closeRepaymentModel() {
				let _this = this;
				_this.repaymentModel = false;
				_this.repaymentForm = {
					amount: ''
				};
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
			//分页
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`)
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`)
			},
			getAllData() {
				let _this = this
				_this.axios.get(_this.GLOBAL.BASE_URL + 'api/OrderManagement/AddOrderByType').then((res) => {
					_this.buyNumData = res.data.data
					_this.loading = false
				}).catch((error) => {
					console.log(error)
				})
			}
		}
	}
</script>

<style scoped>
	.el-date-editor.el-input {
		width: 100%;
	}
	
	.del-dialog-cnt .el-input__inner {
		border: none;
	}
</style>