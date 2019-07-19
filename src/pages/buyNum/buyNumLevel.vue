<template>
	<div class="container">
		<el-collapse-transition>
			<div class="searchBox mb20">
				<el-form ref="searchForm" :model="searchForm" class="form-item" label-width="80px">
					<el-row class="pt20">
						<el-col :xs="24" :span="4">
							<el-form-item label="等级名称">
								<el-input v-model="searchForm.levelName" placeholder="请输入等级名称" class="disInline"></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :span="4" class="ml20">
							<el-button type="primary" size="medium">查询</el-button>
							<el-button size="medium">重置</el-button>
						</el-col>
					</el-row>
				</el-form>
			</div>
		</el-collapse-transition>
		<div class="mb20">
			<el-button type="success" size="medium" @click="addLevel"><i class="el-icon-plus"></i>新增</el-button>
			<el-button type="primary" size="medium" :disabled="disabled" @click="editLevel"><i class="el-icon-edit-outline"></i>修改
			</el-button>
			<el-button type="danger" size="medium" :disabled="disabled" @click="delHandel"><i class="el-icon-delete"></i>删除
			</el-button>
		</div>
		<div class="mt10">
			<el-table :data="buyNumData" border style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="selection"></el-table-column>
				<el-table-column prop="Numbers" label="等级名称" align="center"></el-table-column>
				<el-table-column prop="CountryId" label="累积购买金额" align="center"></el-table-column>
				<el-table-column prop="ProductByASIN" label="累积购买次数" align="center"></el-table-column>
				<el-table-column prop="ProductByASIN" label="累积留评次数" align="center"></el-table-column>
				<!--<el-table-column prop="ProductPrice" label="付款方式" align="center"></el-table-column>-->
				<el-table-column prop="ServiceType" label="价格开始区间(￥)" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="价格结束区间(￥)" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="排序" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="备注" align="center"></el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button size="small" type="primary" @click="RedistributionAccount(scope.$index, scope.row)">分配条件
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="mt30">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
		</div>
		<!-- 新建、修改-->
		<el-dialog :title="title" :visible.sync="LevelModel" :close-on-click-modal="false" :before-close="closeModel" :modal-append-to-body="false" :append-to-body="true">
			<el-form :model="LevelForm" :rel="LevelForm" :rules="editRules" label-width="125px" status-icon>
				<el-form-item label="等级名称" prop="levelName">
					<el-input v-model="LevelForm.levelName"></el-input>
				</el-form-item>
				<el-form-item label="累积购买金额" prop="allBuyMoney">
					<el-input v-model="LevelForm.allBuyMoney"></el-input>
				</el-form-item>
				<el-form-item label="累积购买次数" prop="allBuyCount">
					<el-input v-model="LevelForm.allBuyCount"></el-input>
				</el-form-item>
				<el-form-item label="累积留评次数" prop="allCommentNum">
					<el-input v-model="LevelForm.allCommentNum"></el-input>
				</el-form-item>
				<el-form-item label="价格开始区间" prop="priceStart">
					<el-input v-model="LevelForm.priceStart"></el-input>
				</el-form-item>
				<el-form-item label="价格结束区间" prop="priceEnd">
					<el-input v-model="LevelForm.priceEnd"></el-input>
				</el-form-item>
				<el-form-item label="排序" prop="sort">
					<el-input v-model="LevelForm.sort"></el-input>
				</el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" v-model="LevelForm.remark"></el-input>
				</el-form-item>
			</el-form>
      <div slot="footer" class="dialog-footer">
      	<el-button type="primary" size="medium">确定</el-button>
      	<el-button @click="LevelModel=false" size="medium">取消</el-button>
      </div>
		</el-dialog>
		<!-- 删除-->
		<el-dialog title="温馨提示" :visible.sync="delModel" :close-on-click-modal="false" center="" width="30%" :modal-append-to-body="false" :append-to-body="true">
			<div class="del-dialog-cnt textCen">确认要删除该买号等级记录吗？</div>
			<span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium">是</el-button>
        <el-button @click="delModel=false" size="medium">否</el-button>
      </span>
		</el-dialog>
		<!-- 重新分配-->
		<el-dialog title="买号等级分配信息" :visible.sync="accountModel" width="90%" custom-class="fixed-dialog" :close-on-click-modal="false" :before-close="closeBuyNum" :modal-append-to-body="false" :append-to-body="true">
			<el-collapse-transition>
				<div class="searchBox mb20" v-show="accountSearchModel">
					<el-form ref="accountSearchForm" :model="accountSearchForm" class="form-item" label-width="80px">
						<el-row class="pt20">
							<el-col :xs="24" :span="5" :sm="9" :md="8" :lg="5">
								<el-form-item label="搜索内容">
									<el-input v-model="accountSearchForm.searchKeyWords" placeholder="请输入类型搜索" class="disInline"></el-input>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :span="5" :sm="10" :md="8" :lg="5" class="ml20">
								<el-button type="primary" size="medium">查询</el-button>
								<el-button size="medium">重置</el-button>
							</el-col>
						</el-row>
					</el-form>
				</div>
			</el-collapse-transition>
			<div class="mb20">
				<el-button size="medium" type="primary" @click="editParamValue" :disabled="disabled1"><i class="el-icon-edit-outline"></i>修改参数值
				</el-button>
				<el-button size="medium" @click="accountSearchShow"><i class="el-icon-search"></i>检索</el-button>
			</div>
			<el-table :data="buyNumData" border style="width: 100%" :default-sort="{prop: 'Numbers', order: 'descending'}" @selection-change="buyHandleSelectionChange">
				<el-table-column type="selection"></el-table-column>
				<el-table-column prop="Numbers" label="类型" sortable align="center"></el-table-column>
				<el-table-column prop="CountryId" label="名称" sortable align="center"></el-table-column>
				<el-table-column prop="ProductByASIN" label="值" sortable align="center"></el-table-column>
				<el-table-column prop="Status" label="状态" sortable align="center"></el-table-column>
				<el-table-column prop="ProductPrice" label="备注信息" align="center"></el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button size="small" type="primary">禁用</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="mt20 modelRight">
				<el-button type="primary">确定</el-button>
				<el-button @click="closeBuyNum">关闭</el-button>
			</div>
		</el-dialog>
		<!-- 修改参数值-->
		<el-dialog title="修改参数值" :visible.sync="paramModel" :close-on-click-modal="false" width="30%">
			<el-form :model="paramForm">
				<el-form-item>
					<el-input v-model="paramForm.values"></el-input>
				</el-form-item>
			</el-form>
      <div slot="footer" class="dialog-footer">
      	<el-button type="primary" size="medium">确定</el-button>
      	<el-button @click="paramModel=false" size="medium">取消</el-button>
      </div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'buyNumLevel',
		data() {
			return {
				currentPage: 1,
				pageSize: '0',
				total:100,
				title: '',
				disabled: true,
				disabled1: true,
				LevelModel: false,
				delModel: false,
				accountModel: false,
				paramModel: false,
				accountSearchModel: false,
				checkBoxData: [],
				buyCheckData: [],
				searchModel: false,
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
				LevelForm: {
					levelName: '',
					allBuyMoney: '',
					allBuyCount: '',
					allCommentNum: '',
					payType: '一次性卡',
					priceStart: '',
					priceEnd: '',
					sort: '',
					remark: ''
				},
				editRules: {
					levelName: [{
						required: true,
						message: '请输入等级名称',
						trigger: 'blur'
					}],
					allBuyMoney: [{
						required: true,
						message: '请输入累积购买金额',
						trigger: 'blur'
					}],
					allBuyCount: [{
						required: true,
						message: '请输入累积购买次数',
						trigger: 'blur'
					}],
					allCommentNum: [{
						required: true,
						message: '请输入累积留评次数',
						trigger: 'blur'
					}],
					priceStart: [{
						required: true,
						message: '请输入价格开始区间',
						trigger: 'blur'
					}],
					priceEnd: [{
						required: true,
						message: '请输入价格结束区间',
						trigger: 'blur'
					}],
					sort: [{
						required: true,
						message: '请输入排序',
						trigger: 'blur'
					}]
				},
				searchForm: {
					levelName: ''
				},
				accountSearchForm: {
					searchKeyWords: ''
				},
				paramForm: {
					values: ''
				},
				activeName: 'first',
				allNum: '0',
				active: '1'
			}
		},
		created() {
			// this.getAllData()
		},
		methods: {
			// 修改参数值
			editParamValue() {
				let _this = this
				_this.paramModel = true
			},
			// 分配信息
			RedistributionAccount(index, row) {
				let _this = this
				_this.accountModel = true
				_this.getAllData()
			},
			// 分配信息检索
			accountSearchShow() {
				let _this = this
				let sear = _this.accountSearchModel
				if(sear) {
					_this.accountSearchModel = false
				} else {
					_this.accountSearchModel = true
				}
			},
			// 新建弹窗
			addLevel() {
				let _this = this
				_this.LevelModel = true
        _this.title = '新增'
			},
			// 修改弹窗
			editLevel() {
				let _this = this
				_this.LevelModel = true
				_this.title = '修改'
				let item = _this.checkBoxData
				console.log(item)
				_this.LevelForm.levelName = item[0].Numbers
			},
			// 关闭修改价格弹窗
			closeModel() {
				let _this = this
				_this.LevelModel = false
				_this.LevelForm = {}
			},
			// 删除记录
			delHandel() {
				let _this = this
				_this.delModel = true
			},
			// 是否有选中
			handleSelectionChange(val) {
				this.checkBoxData = val
				console.log(val)
				let checkNum = this.checkBoxData.length
				console.log(checkNum)
				if(checkNum !== 1) {
					this.disabled = true
				} else {
					this.disabled = false
				}
			},
			// 买号等级分配是否有选中
			buyHandleSelectionChange(val) {
				let _this = this
				_this.buyCheckData = val
				let checkNum = _this.buyCheckData.length
				if(checkNum !== 1) {
					_this.disabled1 = true
				} else {
					_this.disabled1 = false
				}
			},
			// 检索
			searchShow() {
				let _this = this
				let sear = _this.searchModel
				if(sear) {
					_this.searchModel = false
				} else {
					_this.searchModel = true
				}
			},
			getAllData() {
				let _this = this
				_this.active = 1
				_this.axios.get(_this.GLOBAL.BASE_URL + 'api/OrderManagement/AddOrderByType').then((res) => {
					_this.buyNumData = res.data.data
					_this.allNum = res.data.data.length
				}).catch((error) => {
					console.log(error)
				})
			},
			//  账号分配窗口关闭
			closeBuyNum() {
				let _this = this
				_this.disabled1 = true
				_this.accountModel = false
				_this.buyCheckData = []
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

<style scoped>

</style>
