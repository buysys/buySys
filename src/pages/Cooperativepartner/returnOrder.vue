<template>
	<div class="container">
		<div class="mb20 fz14">
			<span>合作伙伴</span>
			<span>/</span>
			<span>返利订单</span>
		</div>
		<el-collapse-transition>
			<div class="searchBox mb20">
				<el-form ref="searchForm" :model="searchForm" class="form-item" label-width="80px">
					<el-row>
						<el-col :xs="24" :span="7" :sm="9" :md="8" :lg="6">
							<el-form-item label="返利状态">
								<el-select placeholder="请选择" v-model="searchForm.status" class="minWid">
									<el-option v-for="(item,index) in returnStatus" :key="index" :value="index" :label="item.status"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :xs="24" :span="7" :sm="9" :md="8" :lg="6">
							<el-form-item label="搜索内容">
								<el-input v-model="searchForm.content" placeholder="请输入客户订单号/客户名称/伙伴名称/伙伴手机" class="disInline"></el-input>
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
			<el-button type="success" size="medium" @click="invalidOrder" :disabled='disabled'><i class="el-icon-edit-outline"></i>无效订单</el-button>
		</div>
		<div class="mt10">
			<el-table :data="returnOrderData" v-model='loading' border style="width: 100%" height='500' @selection-change="handleSelectionChange">
				<el-table-column type="selection"></el-table-column>
				<el-table-column prop="Numbers" label="客户订单号" align="center"></el-table-column>
				<el-table-column prop="CountryId" label="客户姓名" align="center"></el-table-column>
				<el-table-column prop="ProductByASIN" label="支付时间" align="center"></el-table-column>
				<el-table-column prop="ProductByASIN" label="合作伙伴姓名" align="center"></el-table-column>
				<el-table-column prop="ServiceType" label="合作伙伴手机" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="订单消费金额" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="返利金额" align="center"></el-table-column>
				<el-table-column prop="Status" label="返利状态" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="备注" align="center"></el-table-column>
			</el-table>
			<div class="mt30">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
		</div>
		<!--无效订单-->
		<el-dialog title='系统提示' :visible.sync='returnOrderModal' :close-on-click-modal='false' width='25%'>
			<div class="del-dialog-cnt textCen"><i class='el-icon-warning-outline fz50'></i>{{tipMessage}}</div>
			<span slot="footer" class="dialog-footer">
                <el-button type="primary" size="medium" v-if='returnShow'>确定</el-button>
                <el-button size="medium" @click='returnOrderModal=false' v-else>确定</el-button>
                <el-button @click="returnOrderModal=false" size="medium" v-if='returnShow'>取消</el-button>
            </span>
		</el-dialog>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				currentPage: 1,
				pageSize: '0',
				total:100,
				disabled: true,
				loading:true,
				returnOrderModal: false,
				returnShow: false,
				tipMessage:'',
				returnOrderData:[],
				checkBoxData:[], //选中信息
				searchForm:{
					status:'请选择状态',
					content:''
				},
				returnStatus:[
				{status:'待到账'},
				{status:'可提取'},
				{status:'提现中'},
				{status:'已提取'},
				{status:'无效订单'},
				]
			}
		},
		created(){
			this.getAllData()
		},
		methods:{
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
			//无效订单
			invalidOrder(){
				let _this = this
				_this.returnOrderModal = true
				let status = _this.checkBoxData
				for(let i = 0;i<status.length;i++){
					console.log(status[i].Status)
					if(status[i].Status=='已分配'){
						_this.tipMessage='确认将选中的返利订单置为无效吗？'
						_this.returnShow = true
					} else if(status[i].Status=='已完成' && status[i].Status=='已分配'){
						_this.tipMessage='设置无效订单的状态必须为待到账'
						_this.returnShow=false
					}
				}
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