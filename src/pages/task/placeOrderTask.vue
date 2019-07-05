<template>
	<div class="container">
		<el-collapse-transition>
			<div class="searchBox mb20" v-show="searchModel">
				<el-form ref="searchForm" :model="searchForm" class="form-item" label-width="80px">
					<el-form-item label="平台" class="disInline">
						<el-radio-group v-model="searchForm.platform" class="disInline">
							<el-radio label="全部"></el-radio>
							<el-radio label="Amazon"></el-radio>
						</el-radio-group>
					</el-form-item>
					<!--          <el-form-item label="国家">-->
					<!--            <el-select placeholder="请选择" v-model="searchForm.countryId" class="minWid">-->
					<!--              <el-option v-for="(item,index) in countryData" :key="index" :value="index"-->
					<!--                         :label="item.country"></el-option>-->
					<!--            </el-select>-->
					<!--          </el-form-item>-->
					<!--          <el-form-item label="下单时间">-->
					<!--            <el-date-picker v-model="searchForm.orderStartTime" type="date" placeholder="选择开始时间" :picker-options="pickerStartDate"-->
					<!--                            value-format="yyyy-MM-dd" class="mb10"></el-date-picker>-->
					<!--            <el-date-picker v-model="searchForm.orderEndTime" type="date" placeholder="选择结束时间" :picker-options="pickerEndDate"-->
					<!--                            value-format="yyyy-MM-dd"></el-date-picker>-->
					<!--          </el-form-item>-->
					<el-row>
						<el-col :xs="24" :span="5" :sm="9" :md="8" :lg="4">
							<el-form-item label="搜索内容">
								<el-input v-model="searchForm.searchkeywords" placeholder="请输入关键字" class="disInline"></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :span="5" :sm="10" :md="8" :lg="5" class="ml20">
							<el-button type="primary" size="medium">查询</el-button>
							<el-button size="medium" @click="resetSearch">重置</el-button>
						</el-col>
					</el-row>
				</el-form>
			</div>
		</el-collapse-transition>
		<div class="mb20">
			<el-button type="danger" size="medium" :disabled="disabled" @click='abnormal'><i class="el-icon-warning-outline"></i>标记异常
			</el-button>
			<el-button type="warning" size="medium" :disabled="disabled" @click='sellerCancel'><i class="el-icon-warning-outline"></i>卖家取消
			</el-button>
			<el-button type="success" size="medium" :disabled="disabled" @click="account"><i class="el-icon-sort"></i>重新分配买号
			</el-button>
			<el-button type="primary" size="medium" :disabled="disabled"><i class="el-icon-set-up"></i>补单
			</el-button>
			<el-button type="primary" size="medium" :disabled="disabled"><i class="el-icon-edit-outline"></i>修改执行时间
			</el-button>
			<el-button type="primary" size="medium" :disabled="disabled"><i class="el-icon-truck"></i>确认发货
			</el-button>
			<el-button type="primary" size="medium" :disabled="disabled"><i class="el-icon-check"></i>确认收货
			</el-button>
			<el-button type="primary" size="medium"><i class="el-icon-folder-opened"></i>任务导入</el-button>
			<el-button type="primary" size="medium"><i class="el-icon-document-delete"></i>任务导出</el-button>
			<el-button size="medium" @click="searchShow"><i class="el-icon-search"></i>检索</el-button>
		</div>
		<div class="tabList">
			<div class="tabLeft">
				<ul class="tabBlock">
					<li :class="active === 1 ? 'active':''" @click="getAllData()" :data-index="1">全部<span>({{allNum}})</span></li>
					<li :class="active === 2 ? 'active':''" :data-index="2" @click="daiBuy">待购买<span>(0)</span></li>
					<li :class="active === 3 ? 'active':''" :data-index="3" @click="daifh">待发货<span>(0)</span></li>
					<li :class="active === 4 ? 'active':''" :data-index="4" @click="daish">待收货<span>(0)</span></li>
					<li :class="active === 5 ? 'active':''" :data-index="5" @click="daipj">待评价<span>(0)</span></li>
					<li :class="active === 6 ? 'active':''" :data-index="6" @click="ywc">已完成<span>(0)</span></li>
					<li :class="active === 7 ? 'active':''" :data-index="7" @click="errData">订单异常<span>(0)</span></li>
				</ul>
			</div>
			<div class="tabLeft tabStatus">
				<span>今日未完成</span><span class="txtCol ml10 mr30">23</span>
				<span>逾期未完成</span><span class="txtCol  ml10 mr30">23</span>
				<span>今日限评数</span><span class="txtCol  ml10 mr30">23</span>
			</div>
		</div>
		<div class="mt10">
			<el-table :data="orderPlaceData" border style="width: 100%" @selection-change="handleSelectionChange" height="550">
				<el-table-column type="selection"></el-table-column>
				<el-table-column prop="Numbers" label="任务编码" align="center" width="200">
					<template slot-scope="scope">
						<el-button type="text" @click="viewTaskDetails(scope.$index,scope.row)">{{scope.row.Numbers}}</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="CountryId" label="平台/国家" align="center"></el-table-column>
				<el-table-column prop="ProductByASIN" label="终端平台" align="center"></el-table-column>
				<el-table-column prop="ProductByASIN" label="留评类型" align="center"></el-table-column>
				<el-table-column prop="Picture" :label="times" align="center" v-if="this.active!=1 && this.active!=2"></el-table-column>
				<el-table-column prop="ProductByASIN" label="产品ASIN" align="center"></el-table-column>
				<el-table-column prop="ProductByASIN" label="产品名称" align="center"></el-table-column>
				<el-table-column prop="ProductPrice" label="产品价格" align="center"></el-table-column>
				<el-table-column prop="ServiceType" label="买号" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="买号状态" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="刷手" align="center"></el-table-column>
				<el-table-column prop="OrderTime" label="执行时间" align="center"></el-table-column>
				<el-table-column prop="Status" label="任务状态" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="客户编码" align="center"></el-table-column>
				<el-table-column label="操作" align="center" width="410">
					<template slot-scope="scope">
						<el-button size="small" type="primary">查看任务</el-button>
						<el-button size="small">打开浏览器</el-button>
						<el-button size="small" v-if="scope.row.Status==='待确认付款'">系统配置</el-button>
						<el-button size="small" type="success" @click="confirmBuyHandel(scope.$index,scope.row)">确认购买</el-button>
						<el-button size="small" type="warning" v-if="scope.row.Status ==='待确认付款'">填写评价</el-button>
						<!--            <el-button size="small" type="danger" v-if="scope.row.Status === '待确认付款'">取消</el-button>-->
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!--标记异常-->
		<el-dialog title='标记异常' :visible.sync='abnormalModal' :close-on-click-modal="false" width='40%'>
			<el-form :model='abnormalForm' ref="abnormalForm" label-width='100px'>
				<el-form-item label='异常原因：'>
					<el-select v-model="abnormalForm.reason" placeholder="请选择异常原因">
								<el-option label="账号失效" value="账号失效"></el-option>
								<el-option label="卖家取消任务" value="卖家取消任务"></el-option>
								<el-option label="买家退货" value="买家退货"></el-option>
							</el-select>
				</el-form-item>
				<el-form-item label='异常备注：'>
					<el-input type='textarea' v-model='abnormalForm.remark'></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type='primary' @click='confirmAbnormal'>确定</el-button>
					<el-button @click='abnormalModal=false'>取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!--卖家取消-->
		<el-dialog title="温馨提示" :visible.sync="sellerCancelModal" :close-on-click-modal="false" center="" width="30%">
			<div class="del-dialog-cnt textCen">确认要取消任务吗？</div>
			<span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click='confirmSellerCancel'>确定</el-button>
        <el-button @click="sellerCancelModal=false" size="medium">取消</el-button>
     </span>
		</el-dialog>
		<!-- 重新分配买号-->
		<el-dialog title="重新分配买号" :visible.sync="accountModel" width="90%" :close-on-click-modal="false">
			<el-collapse-transition>
				<div class="searchBox mb20" v-show="accountSearchModel">
					<el-form ref="accountSearchForm" :model="accountSearchForm" class="form-item" label-width="80px">
						<el-form-item label="标签类型" class="disInline">
							<el-checkbox-group v-model="accountSearchForm.type">
								<el-checkbox label="西班牙" name="type"></el-checkbox>
								<el-checkbox label="新人注册号" name="type"></el-checkbox>
								<el-checkbox label="加拿大" name="type"></el-checkbox>
								<el-checkbox label="手机测试" name="type"></el-checkbox>
							</el-checkbox-group>
						</el-form-item>
						<el-form-item label="注册时间">
							<el-date-picker v-model="accountSearchForm.startTime" type="date" placeholder="选择开始时间" :picker-options="pickerStartDate" value-format="yyyy-MM-dd" class="mb10"></el-date-picker>
							<el-date-picker v-model="accountSearchForm.endTime" type="date" placeholder="选择结束时间" :picker-options="pickerEndDate" value-format="yyyy-MM-dd"></el-date-picker>
						</el-form-item>
						<el-row>
							<el-col :xs="24" :span="5" :sm="9" :md="8" :lg="5">
								<el-form-item label="搜索内容">
									<el-input v-model="accountSearchForm.searchKeyWords" placeholder="请输入关键字" class="disInline"></el-input>
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
				<el-button size="medium" @click="accountSearchShow"><i class="el-icon-search"></i>检索</el-button>
			</div>
			<el-table :data="orderPlaceData" border style="width: 100%" @row-click="showRow">
				<el-table-column show-overflow-tooltip width="50px">
					<template slot-scope="scope">
						<el-radio class="radio" v-model="radio" :label="scope.$index">&nbsp;</el-radio>
					</template>
				</el-table-column>
				<el-table-column prop="CountryId" label="账号" align="center"></el-table-column>
				<el-table-column prop="Numbers" label="是否留评" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="关联刷手" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="未完成任务" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="标签" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="首次购买" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="最近购买" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="信用卡类型" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="信用卡姓名" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="信用卡余额" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="购物卡余额" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="信用卡累积消费" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="购物卡累积消费" align="center"></el-table-column>
			</el-table>
			<div class="mt20 modelRight">
				<el-button type="primary" @click="confirmCountry">确定</el-button>
				<el-button @click="accountModel=false">取消</el-button>
			</div>
		</el-dialog>
		<!-- 修改价格-->
		<el-dialog title="修改价格" :visible.sync="editPricceModel" :close-on-click-modal="false" :before-close="closeModel">
			<el-form :model="editPriceForm" :rules="editRules" label-width="125px" status-icon>
				<el-form-item label="加购服务费" prop="addServiceFree">
					<el-input v-model="editPriceForm.addServiceFree"></el-input>
				</el-form-item>
				<el-form-item label="汇率" prop="exchangeRate">
					<el-input v-model="editPriceForm.exchangeRate"></el-input>
				</el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" v-model="editPriceForm.remark"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary">确定</el-button>
					<el-button @click="closeModel">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!-- 确认购买-->
		<el-dialog :title="title" :visible.sync="confirmBuyModel" :close-on-click-modal="false">
			<el-form :model="confirmBuyForm">
				<el-form-item>
					<span>任务信息</span>
				</el-form-item>
				<el-row>
					<el-col :span="12" :xs="24">
						<el-form-item label="任务编码">
							<span>23424242</span>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="任务状态">
							<span>待购买</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12" :xs="24">
						<el-form-item label="平台">
							<span>Amazon</span>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="国家">
							<span>美国</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12" :xs="24">
						<el-form-item label="店铺">
							<span>Versatek-JP</span>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="品牌">
							<span>nike</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12" :xs="24">
						<el-form-item label="产品名称">
							<span>Diyife ダイヤル式 4桁 暗証番号</span>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="产品ASIN">
							<span>B07SQYW622</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12" :xs="24">
						<el-form-item label="产品价格">
							<span>1200.0</span>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="产品链接">
							<span>http://www.amazon.co.jp/dp/B07SQYW622</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12" :xs="24">
						<el-form-item label="关键词">
							<span>暗証番号</span>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="产品位置">
							<span>第一页</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12" :xs="24">
						<el-form-item label="CPC关键词">
							<span>暗証番号</span>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="CPC位置">
							<span>第一页</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col>
						<el-form-item label="买家账号">
							<span>kaylee.macduff.2019@mail.ru</span>
						</el-form-item>
					</el-col>
				</el-row>
				<div>购买信息</div>
				<el-form-item label="购买时间">

				</el-form-item>
			</el-form>
		</el-dialog>
		<!--查看任务详情-->
		<el-dialog :title='orderTitle' :visible.sync="viewTaskDateilsModel" width="60%" :close-on-click-modal="false">
			<el-form class="demo-item">
				<div class="fz16">任务信息</div>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label="平台：">
							<span>Amazon</span>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label="国家：">
							<span>美国</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label="产品ASIN：">
							<span>D2342543654657</span>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label="店铺：">
							<span>nike</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label="产品名称：">
							<span>水淀粉</span>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label="产品价格：">
							<span>$100</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label="评论数：">
							<span>2</span>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label="产品评分：">
							<span>34</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='12' :xs='24' class="fleft">
						<el-form-item label="品类排名：">
							<span>2</span>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24' class="fright">
						<el-form-item label="产品图片：">
							<img class="proImg"></img>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24" class="fleft">
						<el-form-item label="产品链接：" class="wid">
							<span>http://www.pre.com</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label="关键词类型：">
							<span>产地是</span>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label="终端平台：">
							<span>PC</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label="产品关键词：">
							<span>产地是</span>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label="代购数量：">
							<span>3</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label="留评类型：">
							<span>100%</span>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label="FeedBack数量：">
							<span>3</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label="评论图片数量：">
							<span>2</span>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label="评论视频数量：">
							<span>2</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label="使用优惠券：">
							<span>否</span>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label="链接地址：">
							<span>https://www.sdfs.com</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="ml60 mb10 mt10">
					<el-col :span="6" :xs="11" :md="6">
						<!--<el-form-item label="任务开始时间"></el-form-item>-->
						<span>任务开始时间</span>
					</el-col>
					<el-col :span="6" :xs="2" :md="6" class="mb10">
						<span style="visibility: hidden;">hfh</span>
					</el-col>
					<el-col :span="8" :xs="11" :md="8" class="mb10 ml60">
						<span>数量</span>
					</el-col>
				</el-row>
				<el-row class="ml60">
					<el-col :span='6' :xs="24" class="mb10">
						<span>2019-07-02</span>
					</el-col>
					<el-col :span='6' :xs="24" class="mb10">
						<span>00:00-20:00</span>
					</el-col>
					<el-col :span='8' :xs="24" class="ml60">
						<span>2</span>
					</el-col>
				</el-row>
				<el-form-item label="备注：">
					<span>$23.00</span>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'placeOrderTask',
		data() {
			return {
				radio:'',
				sellerCancelModal: false, //卖家取消
				accountModel:false,
				abnormalModal: false, //标记异常
				title: '填写购买信息',
				orderTitle: '',
				confirmBuyModel: false,
				accountSearchModel: false,
				viewTaskDateilsModel: false,
				confirmBuyForm: {},
				selected:{},
				times: '',
				disabled: true,
				editPricceModel: false,
				checkBoxData: [],
				searchModel: false,
				orderPlaceData: [],
				accountSearchForm: {
					type: [],
					startTime: '',
					endTime: '',
					searchKeyWords: ''
				},
				abnormalForm:{
					reason:'',
					remark:''
				},
				countryData: [{
						country: '美国'
					},
					{
						country: '加拿大'
					}
				],
				editPriceForm: {
					addServiceFree: '',
					exchangeRate: '',
					remark: ''
				},
				editRules: {
					addServiceFree: [{
						required: true,
						message: '请输入加购服务费',
						trigger: 'blur'
					}],
					exchangeRate: [{
						required: true,
						message: '请输入汇率',
						trigger: 'blur'
					}]
				},
				searchForm: {
					platform: '全部',
					searchkeywords: ''
				},
				pickerEndDate: this.pickerOptionsEnd(),
				pickerStartDate: this.searchStartDate(),
				activeName: 'first',
				allNum: '0',
				active: '1'
			}
		},
		created() {
			this.getAllData()
		},
		methods: {
			// 标记异常
			abnormal(){
				let _this = this
				_this.abnormalModal=true
			},
			//标记异常确定
			confirmAbnormal(){
				let _this = this
				_this.abnormalModal=false
				_this.abnormalForm={
					reason:'',
					remark:''
				}
			},
			// 卖家取消
			sellerCancel(){
				let _this = this
				_this.sellerCancelModal = true
			},
			// 卖家取消确定
			confirmSellerCancel(){
				let _this = this
				_this.sellerCancelModal = false
			},
			//重新分配买号
			account(){
				let _this = this
				_this.accountModel=true
			},
			// 重新分配选择确定
			confirmCountry() {
				let _this = this
				_this.accountModel = false

			},
					showRow(row) {
				//赋值给radio
				this.radio = this.orderPlaceData.indexOf(row);
				this.selected = row;
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
			// 查看任务详情弹窗
			viewTaskDetails(index, row) {
				let _this = this
				_this.viewTaskDateilsModel = true
				let item = _this.orderPlaceData[index]
				let num = item.Numbers
				_this.orderTitle = '任务：' + num + '的详情信息'
			},
			// 重置
			resetSearch() {
				let _this = this
				_this.searchForm = {
					platform: '全部',
					searchkeywords: ''
				}
			},
			// 确认购买
			confirmBuyHandel(index, row) {
				let _this = this
				_this.confirmBuyModel = true
			},
			// 修改价格弹窗
			editPrice() {
				let _this = this
				_this.editPricceModel = true
			},
			// 关闭修改价格弹窗
			closeModel() {
				let _this = this
				_this.editPricceModel = false
				_this.editPriceForm = {}
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
					_this.orderPlaceData = res.data.data
					_this.allNum = res.data.data.length
				}).catch((error) => {
					console.log(error)
				})
			},
			// 待购买
			daiBuy() {
				let _this = this
				_this.active = 2
				_this.orderPlaceData = []
			},
			// 待发货
			daifh() {
				let _this = this
				_this.active = 3
				_this.times = '购买时间'
				_this.orderPlaceData = []
			},
			// 待收货
			daish() {
				let _this = this
				_this.active = 4
				_this.times = '发货时间'
				_this.orderPlaceData = []
			},
			// 待评价
			daipj() {
				let _this = this
				_this.active = 5
				_this.times = '收货时间'
				_this.orderPlaceData = []
			},
			// 已完成
			ywc() {
				let _this = this
				_this.active = 6
				_this.times = '评价时间'
				_this.orderPlaceData = []
			},
			// 异常订单
			errData() {
				let _this = this
				_this.active = 7
				_this.times = '异常时间'
				_this.orderPlaceData = []
			},
			// 注册开始时间
			searchStartDate() {
				return {
					disabledDate: time => {
						let endDateVal = this.accountSearchForm.endTime
						if(endDateVal) {
							return time.getTime() > new Date(endDateVal).getTime()
						}
					}
				}
			},
			// 搜索下单结束时间
			pickerOptionsEnd() {
				return {
					disabledDate: time => {
						let beginDateVal = this.accountSearchForm.startTime
						if(beginDateVal) {
							return(
								time.getTime() <
								new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
							)
						}
					}
				}
			}
		}
	}
</script>

<style scoped>

</style>