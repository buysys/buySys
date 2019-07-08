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
			<el-button type="primary" size="medium" :disabled="disabled" @click='supplementSheet'><i class="el-icon-set-up"></i>补单
			</el-button>
			<el-button type="primary" size="medium" :disabled="disabled" @click='updateTime'><i class="el-icon-edit-outline"></i>修改执行时间
			</el-button>
			<el-button type="primary" size="medium" :disabled="disabled" @click='deliver'><i class="el-icon-truck"></i>确认发货
			</el-button>
			<el-button type="primary" size="medium" :disabled="disabled" @click='receiving'><i class="el-icon-check"></i>确认收货
			</el-button>
			<el-button type="primary" size="medium"><i class="el-icon-folder-opened"></i>任务导入</el-button>
			<el-button type="primary" size="medium"><i class="el-icon-document-delete"></i>任务导出</el-button>
			<!--<el-button size="medium" @click="searchShow"><i class="el-icon-search"></i>检索</el-button>-->
			<el-input placeholder="搜索" prefix-icon="el-icon-search" class="listSearchInput" @click.native="searchShow"></el-input>
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
			<el-table :data="orderPlaceData" style="width: 100%" :header-cell-style="{background:'#fafafa'}" @selection-change="handleSelectionChange" height="550">
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
						<el-button size="small" type="primary" @click="viewTaskDetails(scope.$index,scope.row)">查看任务</el-button>
						<el-button size="small">打开浏览器</el-button>
						<el-button size="small" v-if="scope.row.OrderNote==='待付款'" @click='systemConfig(scope.$index,scope.row)'>系统配置</el-button>
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
		<!--系统配置-->
		<el-dialog :title='buyNum' :visible.sync='systemConfigModal' :close-on-click-modal='false'>
			<systemConfig></systemConfig>
			<div class="modelRight">
				<el-button type='primary' @click='systemConfigModal=false'>关闭</el-button>
			</div>
		</el-dialog>
		<!--确认发货-->
		<el-dialog title='温馨提示' :visible.sync='confirmDeliveryModal' :close-on-click-modal="false" width='25%'>
			<div class="del-dialog-cnt textCen">{{tipMessage}}</div>
			<span slot="footer" class="dialog-footer">
                <el-button type="primary" size="medium" @click='confirmDeliver' v-if='deliverShow'>确定</el-button>
                <el-button type="primary" size="medium" @click='confirmDeliver' v-else>确定</el-button>
                <el-button @click="confirmDeliveryModal=false" size="medium">取消</el-button>
            </span>
		</el-dialog>
		<!--修改执行时间-->
		<el-dialog title='修改执行时间' :visible.sync='updateTimeModal' :close-on-click-modal='false' width='30%'>
			<el-form :model='timeForm'>
				<el-form-item label='执行时间'>
					<el-date-picker v-model='timeForm.times' type='date' placeholder='请选择时间' :picker-options="pickerUpdateDate" value-format="yyyy-MM-dd"></el-date-picker>
				</el-form-item>
				<el-form-item class='modelRight'>
					<el-button type='primary' @click='confirmTime'>确定</el-button>
					<el-button @click='updateTimeModal=false'>取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!--温馨提示-->
		<el-dialog title='提示' :visible.sync='tipsModal' :close-on-click-modal='false' width='25%'>
			<div class="del-dialog-cnt textCen"><i class='el-icon-warning-outline fz50'></i>{{message}}</div>
			<span slot="footer" class="dialog-footer">
               <el-button type="primary" size="medium" @click='tipsModal=false'>确定</el-button>
             </span>
		</el-dialog>
		<!--补单-->
		<el-dialog title='补单' :visible.sync="sheetModal" :close-on-click-modal="false" width="90%">
			<SupplementSheet :post-title='this.test'></SupplementSheet>
			<div class="modelRight mt20">
				<el-button type='primary' @click='confirmSheet'>确定</el-button>
				<el-button @click='sheetModal=false'>取消</el-button>
			</div>
		</el-dialog>
		<!-- 重新分配买号-->
		<el-dialog title="重新分配买号" :visible.sync="accountModel" width="90%" :close-on-click-modal="false">
			<buyNum v-on:listenTochildEvent="showMessageFromChild"></buyNum>
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
		<el-dialog :title="title" :visible.sync="confirmBuyModel" :close-on-click-modal="false" width='50%'>
			<el-form :model="confirmBuyForm" class='demo-item' label-width='100px'>
				<div class="fz16 mb20">任务信息</div>
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
						<el-form-item label="CPC关键词">
							<span>暗証番号</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12" :xs="24">
						<el-form-item label="买家账号">
							<span>kaylee.macduff.2019@mail.ru</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col>

					</el-col>
				</el-row>
				<div class="mb20 fz16">购买信息</div>
				<el-row class="dataInp">
					<el-col :span='12' :xs='24'>
						<el-form-item label="购买时间">
							<el-date-picker v-model='confirmBuyForm.buyTime' type="datetime" placeholder="选择购买日期时间"></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label='订单单号' class='inpWid'>
							<el-input v-model='confirmBuyForm.orderNo'></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label='产品金额' class='inpWid'>
							<el-input v-model='confirmBuyForm.proPrice'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label='运费' class='inpWid'>
							<el-input v-model='confirmBuyForm.proFreight'></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item class='modelRight'>
					<el-button type='primary'>确认</el-button>
					<el-button @click='confirmBuyModel=false'>取消</el-button>
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
	import SupplementSheet from '../../common/SupplementSheet'
	import buyNum from '../../common/buyNum'
	import systemConfig from '../../common/systemConfig'
	export default {
		name: 'placeOrderTask',
		data() {
			return {
				radio: '',
				tipMessage: '',
				buyNum: '', //系统配置买号
				systemConfigModal: false, //系统配置
				deliverShow: false, //收发货确定按钮
				confirmDeliveryModal: false, //确认发货
				tipsModal: false, //提示
				updateTimeModal: false, //修改执行时间
				sheetModal: false, //补单
				sellerCancelModal: false, //卖家取消
				accountModel: false,
				abnormalModal: false, //标记异常
				title: '填写购买信息',
				orderTitle: '',
				confirmBuyModel: false,
				accountSearchModel: false,
				viewTaskDateilsModel: false,
				confirmBuyForm: {},
				selected: {},
				times: '',
				disabled: true,
				editPricceModel: false,
				checkBoxData: [],
				searchModel: false,
				orderPlaceData: [],
				test: {
					text1: '',
					numbers: ''
				},
				pickerUpdateDate: this.startTime(),
				timeForm: {
					times: ''
				},
				//				accountSearchForm: {
				//					type: [],
				//					startTime: '',
				//					endTime: '',
				//					searchKeyWords: ''
				//				},
				abnormalForm: {
					reason: '',
					remark: ''
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
				//				pickerEndDate: this.pickerOptionsEnd(),
				//				pickerStartDate: this.searchStartDate(),
				activeName: 'first',
				allNum: '0',
				active: 1,
				message: ''
			}
		},
		components: {
			SupplementSheet,
			buyNum,
			systemConfig
		},
		created() {
			this.getAllData()
		},
		methods: {
			showMessageFromChild(data) {
				console.log(data.CountryId)
			},
			// 系统配置
			systemConfig(index, row) {
				let _this = this
				_this.systemConfigModal = true
				let item = _this.orderPlaceData[index]
				let num = item.Numbers
				_this.buyNum = '买号：' + num + '系统配置'
			},
			// 确认发货
			deliver() {
				let _this = this
				let status = _this.active
				if(status != 3) {
					_this.tipsModal = true
					_this.message = '批量确认发货任务状态必须为待发货,请重新选择'
				} else {
					_this.confirmDeliveryModal = true
					_this.tipMessage = '确认要批量发货吗？'
					_this.deliverShow = true
				}
			},
			// 发货确认
			confirmDeliver() {
				let _this = this
				_this.confirmDeliveryModal = false
			},
			// 确认收货
			receiving() {
				let _this = this
				let status = _this.active
				if(status != 4) {
					_this.tipsModal = true
					_this.message = '批量确认收货任务状态必须为待收货,请重新选择'
				} else {
					_this.tipMessage = '确认要批量收货吗？'
					_this.confirmDeliveryModal = true
					_this.deliverShow = false
				}
			},
			// 日期不能小于当年日期
			startTime() {
				return {
					disabledDate(time) {
						return time.getTime() < Date.now() - 8.64e7
					}
				}
			},
			//修改执行时间
			updateTime() {
				let _this = this
				let status = _this.active
				if(status != 2) {
					_this.tipsModal = true
					_this.message = '修改执行时间的任务状态必须为待购买,请重新选择'
				} else {
					_this.updateTimeModal = true
				}
			},
			// 修改执行时间确定
			confirmTime() {
				let _this = this
				_this.updateTimeModal = false
			},
			// 补单
			supplementSheet() {
				let _this = this
				let status = _this.active
				if(status != 7) {
					_this.tipsModal = true
					_this.message = '补单的任务状态必须为订单异常,请重新选择'
				} else {
					_this.sheetModal = true
				}
			},
			// 补单确定
			confirmSheet() {
				let _this = this
				_this.sheetModal = false
			},
			// 标记异常
			abnormal() {
				let _this = this
				_this.abnormalModal = true
			},
			//标记异常确定
			confirmAbnormal() {
				let _this = this
				_this.abnormalModal = false
				_this.abnormalForm = {
					reason: '',
					remark: ''
				}
			},
			// 卖家取消
			sellerCancel() {
				let _this = this
				let status = _this.active
				console.log(status)
				if(status != 2 && status != 7) {
					_this.tipsModal = true
					_this.message = '卖家取消任务状态必须为待购买或者订单异常，请重新选择！'
				} else {
					_this.sellerCancelModal = true
				}
			},
			// 卖家取消确定
			confirmSellerCancel() {
				let _this = this
				let status = _this.active
				_this.sellerCancelModal = false
			},
			//重新分配买号
			account() {
				let _this = this
				let status = _this.active
				if(status != 2) {
					_this.tipsModal = true
					_this.message = '重新分配买号的任务状态必须为待购买,请重新选择'
				} else {
					_this.accountModel = true
				}
			},
			// 重新分配选择确定
			confirmCountry() {
				let _this = this
				_this.accountModel = false

			},
			//			showRow(row) {
			//				//赋值给radio
			//				this.radio = this.orderPlaceData.indexOf(row);
			//				this.selected = row;
			//			},
			//			// 分配信息检索
			//			accountSearchShow() {
			//				let _this = this
			//				let sear = _this.accountSearchModel
			//				if(sear) {
			//					_this.accountSearchModel = false
			//				} else {
			//					_this.accountSearchModel = true
			//				}
			//			},
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
				let item = _this.orderPlaceData[index]
				let num = item.Numbers
				_this.title = '任务：' + num + '填写购买信息'
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
				let _this = this
				_this.checkBoxData = val
				let checkNum = _this.checkBoxData.length
				_this.test.test1 = val[0].countryId
				_this.test.numbers = val[0].Numbers
				if(checkNum !== 1) {
					_this.disabled = true
				} else {
					_this.disabled = false
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
				//				_this.orderPlaceData = []
			},
			// 待发货
			daifh() {
				let _this = this
				_this.active = 3
				_this.times = '购买时间'
				//				_this.orderPlaceData = []
			},
			// 待收货
			daish() {
				let _this = this
				_this.active = 4
				_this.times = '发货时间'
				//				_this.orderPlaceData = []
			},
			// 待评价
			daipj() {
				let _this = this
				_this.active = 5
				_this.times = '收货时间'
				//				_this.orderPlaceData = []
			},
			// 已完成
			ywc() {
				let _this = this
				_this.active = 6
				_this.times = '评价时间'
				//				_this.orderPlaceData = []
			},
			// 异常订单
			errData() {
				let _this = this
				_this.active = 7
				_this.times = '异常时间'
				//				_this.orderPlaceData = []
			},
			//			// 注册开始时间
			//			searchStartDate() {
			//				return {
			//					disabledDate: time => {
			//						let endDateVal = this.accountSearchForm.endTime
			//						if(endDateVal) {
			//							return time.getTime() > new Date(endDateVal).getTime()
			//						}
			//					}
			//				}
			//			},
			//			// 搜索下单结束时间
			//			pickerOptionsEnd() {
			//				return {
			//					disabledDate: time => {
			//						let beginDateVal = this.accountSearchForm.startTime
			//						if(beginDateVal) {
			//							return(
			//								time.getTime() <
			//								new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
			//							)
			//						}
			//					}
			//				}
			//			}
		}
	}
</script>

<style scoped>

</style>