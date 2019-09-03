<template>
	<div class="container">
		<div class="mb20 fz14">
      <span>首页</span>
      <span>/</span>
			<span>客户管理</span>
		</div>
		<el-collapse-transition>
			<div class="searchBox mb20">
				<el-form ref="searchForm" :model="searchForm" class="form-item" label-width="80px">
					<el-row>
						<el-col :xs="24" :span="8">
							<el-form-item label="搜索内容">
								<el-input v-model="searchForm.searchkeywords" placeholder="请输入客户账号/编码/名称/手机号码/邮箱/微信/QQ" class="disInline"></el-input>
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
			<el-button type="warning" size="medium" @click="exportExcel"><i class="el-icon-upload2"></i>导出</el-button>
      <el-button size="small" type="success" @click="TxModelShow" style="float: right;">提现记录</el-button>
		</div>
		<div class="mt10">
			<el-table :data="tableData" id="exportData" style="width: 100%" :header-cell-style="{background:'#fafafa'}" @selection-change="handleSelectionChange">
				<el-table-column type="selection"></el-table-column>
				<el-table-column prop="Numbers" label="编码" align="center" width="200">
					<template slot-scope="scope">
						<el-button type="text" @click="viewModelShow(scope.$index,scope.row)">{{scope.row.Numbers}}</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="CountryId" label="姓名" align="center"></el-table-column>
				<el-table-column prop="OrderNumber" label="手机" align="center"></el-table-column>
				<el-table-column prop="OrderNumber" label="邮箱" align="center"></el-table-column>
				<el-table-column prop="OrderNumber" label="微信" align="center"></el-table-column>
        <el-table-column prop="OrderNumber" label="QQ" align="center"></el-table-column>
				<el-table-column prop="CountryId" label="所属用户" align="center"></el-table-column>
				<el-table-column prop="ProductPrice" label="余额" align="center" class-name="red"></el-table-column>
				<el-table-column prop="OrderNumber" label="最后登录IP" align="center"></el-table-column>
				<el-table-column prop="OrderTime" label="最后登录时间" align="center"></el-table-column>
				<el-table-column prop="Status" label="禁用 | 启用" align="center">
				  <template slot-scope="scope">
				    <el-switch active-color="#67c23a" inactive-color="#dcdfe6" active-value="1" inactive-value="0" v-model="scope.row.Status" @change="changeStatus(scope.$index,scope.row)">
				    </el-switch>
				  </template>
				</el-table-column>
				<el-table-column label="操作" align="center" width="200">
					<template slot-scope="scope">
            <el-button size="small" type="warning" @click="RechargeModelShow">充值</el-button>
            <el-button size="small" type="primary" @click="LogModelShow">日志</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="mt30">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[100, 200, 300, 500]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
		</div>
		<!-- 新增修改 -->
		<el-dialog :title="title" :visible.sync="editModel" :close-on-click-modal="false" :before-close="closeModel">
			<el-form :model="editForm" :rules="editRules" label-width="125px" status-icon>
				<el-form-item label="姓名">
					<el-input v-model="editForm.name"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="editForm.password"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="password2">
					<el-input v-model="editForm.password2"></el-input>
				</el-form-item>
        <el-form-item label="所属用户" prop="ssUser">
        	<el-select v-model="editForm.ssUser" placeholder="请选择所属用户" style="width: 100%;">
        	    <el-option
        	      v-for="item in ssUserOptions"
        	      :key="item.value"
        	      :label="item.label"
        	      :value="item.value">
        	    </el-option>
        	  </el-select>
        </el-form-item>
				</el-form-item>
				<el-form-item label="手机号" prop="phone">
					<el-input v-model="editForm.phone"></el-input>
				</el-form-item>
				<el-form-item label="邮箱">
					<el-input v-model="editForm.email"></el-input>
				</el-form-item>
				<el-form-item label="微信">
					<el-input v-model="editForm.weixin"></el-input>
				</el-form-item>
        <el-form-item label="QQ">
        	<el-input v-model="editForm.qq"></el-input>
        </el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" v-model="editForm.remark"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="editModel=false">确 定</el-button>
				<el-button @click="editModel=false">取 消</el-button>
			</div>
		</el-dialog>
		<!-- 查看 -->
		<el-dialog :title="title" :visible.sync="viewModel" :close-on-click-modal="false">
			<el-form :model="viewForm" status-icon class="demo-item">
				<el-row>
					<el-col :span="12" :xs="24">
						<el-form-item label="客户编码："><span>{{viewForm.userNo}}</span></el-form-item>
					</el-col>
          <el-col :span="12" :xs="24">
          	<el-form-item label="所属用户："><span>{{viewForm.ssUser}}</span></el-form-item>
          </el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="姓名："><span>{{viewForm.name}}</span></el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="手机号："><span>{{viewForm.phone}}</span></el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="邮箱："><span>{{viewForm.email}}</span></el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="微信："><span>{{viewForm.weixin}}</span></el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="QQ："><span>{{viewForm.qq}}</span></el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="最后登录IP："><span>{{viewForm.lastLoginIP}}</span></el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="最后登录时间："><span>{{viewForm.lastLoginTime}}</span></el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="是否修改账号："><span>{{viewForm.isEditAccount}}</span></el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="创建时间："><span>{{viewForm.createTime}}</span></el-form-item>
					</el-col>
					<el-col :span="24" :xs="24">
						<el-form-item label="备注："><label>{{viewForm.remark}}</label></el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="viewModel=false">关 闭</el-button>
			</div>
		</el-dialog>
		<!--日志-->
		<el-dialog title="订单日志" :visible.sync="logModel" :close-on-click-modal="false" width="90%" custom-class="fixed-dialog">
		<OrderLog></OrderLog>
		  <div slot="footer" class="dialog-footer">
		  <el-button @click="logModel = false">关 闭</el-button>
		  </div>
		</el-dialog>
		</el-dialog>
		<!-- 提现记录 -->
		<el-dialog title="提现记录" :visible.sync="TxModel" :close-on-click-modal="false" width="90%">
			<takeMoneyList></takeMoneyList>
    <div slot="footer" class="dialog-footer">
    <el-button @click="TxModel = false">关 闭</el-button>
    </div>
		</el-dialog>
    <!--充值-->
    <el-dialog title="请输入充值金额" :visible.sync="RechargeModel" :close-on-click-modal="false" width="30%">
    	<el-form :rules="editRules" :model="editForm" ref="repaymentForm" class="demo-dynamic">
      <el-form-item  prop="money">
      	<el-input v-model="editForm.money" autofocus="true"></el-input>
      </el-form-item>
    	</el-form>
    	<div slot="footer" class="dialog-footer">
    		<el-button type="primary" size="medium">确定</el-button>
    		<el-button @click="RechargeModel=false" size="medium">取消</el-button>
    	</div>
    </el-dialog>
	</div>
</template>

<script>
	import FileSaver from 'file-saver'
	import XLSX from 'xlsx'

  import validate from '../../components/validate'
	import OrderLog from '../../common/OrderLog'
	import takeMoneyList from './takeMoneyList'
	export default {
		name: 'customer',
		data() {
			return {
				loading: true,
				editModel: false,
				viewModel: false,
				logModel: false, //日志
				TxModel: false, //提现记录
        RechargeModel:false, //充值
				editDisabled: true,
				tableData: [{
						"Numbers": "20190605105636229596",
						"Picture": "",
						"CountryId": "美国",
						"Forum": "Amazon",
						"ProductByASIN": "777888999a",
						"ProductPrice": 15.99,
						"ServiceType": "不留评",
						"OrderNote": "待付款",
						"Status": "0",
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
						"Status": "1",
						"OrderNumber": 7758258,
						"OrderTime": "2019-04-02T00:00:00",
						"Remark": ""
					},
				],
				checkBoxData: [],
				title: '',
				allNum: 0,
				active: 1,
				currentPage: 1,
				pageSize: '0',
				total: 100,
        ssUserOptions: [{
          value: '001',
          label: '张三'
        }, {
          value: '002',
          label: '李四'
        }, {
          value: '003',
          label: '王五'
        }],
				searchForm: {
					platform: '全部',
					searchkeywords: ''
				},
				editForm: {
					name: '',
					password: '',
					password2: '',
					phone: '',
					email: '',
					weixin: '',
					qq: '',
					canLogin: '1',
					remark: '',
          money: '',
          ssUser: ''
				},
				viewForm: {
					userName: '',
					userNo: '',
					name: '',
					password: '',
					password2: '',
					phone: '',
					email: '',
					weixin: '',
					qq: '',
					suoShuUser: '',
					canLogin: '1',
					lastLoginIP: '',
					lastLoginTime: '',
					isEditAccount: '',
					createTime: '',
					remark: '',
          ssUser: ''
				},
				editRules: {
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}],
					password2: [{
						required: true,
						message: '请输入确认密码',
						trigger: 'blur'
					}],
          ssUser: [{
          	required: true,
          	message: '请选择所属用户',
          	trigger: 'blur'
          }],
					phone: [{
						required: true,
						message: '请输入手机号',
						trigger: 'blur'
					}],
					canLogin: [{
						required: true,
						message: '请选择是否可登录',
						trigger: 'blur'
					}],
          money: [{
          	validator: validate.proPrice,
          	trigger: 'blur'
          }]
				},
			}
		},
		components: {
			OrderLog,
			takeMoneyList
		},
		created() {
//			this.getAllData()
		},
		methods: {
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
      //充值
      RechargeModelShow(){
        let _this = this
        _this.RechargeModel = true
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
				if(checkNum == 1) {
					_this.editDisabled = false
					_this.delDisabled = false
				} else if(checkNum > 1) {
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
				_this.title = '客户新增'
			},
			// 修改
			editModelShow() {
				let _this = this
				_this.editModel = true
				let item = _this.checkBoxData[0]
				let num = item.Numbers
				_this.title = '客户：' + num + ' 信息修改'
				_this.editForm.name = item.CountryId;
				_this.editForm.password = item.CountryId;
				_this.editForm.password2 = item.CountryId;
				_this.editForm.phone = item.CountryId;
				_this.editForm.email = item.CountryId;
				_this.editForm.weixin = item.CountryId;
				_this.editForm.qq = item.CountryId;
				_this.editForm.canLogin = '1';
				_this.editForm.remark = item.CountryId;
			},
			// 查看
			viewModelShow(index, row) {
				let _this = this;
				_this.viewModel = true
				let item = _this.tableData[index]
				let num = item.Numbers
				_this.title = '客户：' + num + ' 信息详情'
				_this.viewForm.userName = item.CountryId,
					_this.viewForm.userName = item.CountryId,
					_this.viewForm.userNo = item.CountryId,
					_this.viewForm.name = item.CountryId,
					_this.viewForm.password = item.CountryId,
					_this.viewForm.password2 = item.CountryId,
					_this.viewForm.phone = item.CountryId,
					_this.viewForm.email = item.CountryId,
					_this.viewForm.weixin = item.CountryId,
					_this.viewForm.qq = item.CountryId,
					_this.viewForm.suoShuUser = item.CountryId,
					_this.viewForm.canLogin = '是',
					_this.viewForm.lastLoginIP = item.CountryId,
					_this.viewForm.lastLoginTime = item.CountryId,
					_this.viewForm.isEditAccount = item.CountryId,
					_this.viewForm.createTime = item.CountryId,
					_this.viewForm.remark = item.CountryId,
          _this.viewForm.ssUser = "张三"
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
			// 日志
			LogModelShow() {
				let _this = this
				_this.logModel = true
			},
			// 提现订单
			TxModelShow() {
				let _this = this
				_this.TxModel = true
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
