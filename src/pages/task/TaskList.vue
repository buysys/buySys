<template>
	<div class="container">
    <div class="mb20 fz14">
    	<span>任务管理</span>
    </div>
		<el-collapse-transition>
			<div class="searchBox mb20">
				<el-form ref="searchForm" :model="searchForm" class="form-item" label-width="80px">
					<el-row>
					<el-col :xs="24" :span="4">
						<el-form-item label="平台">
							<template>
							  <el-select v-model="searchForm.platform" placeholder="请选择">
								<el-option v-for="(item,index) in platformOptions" :key="index" :value="item.value" :label="item.label"></el-option>
							  </el-select>
							</template>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :span="4">
						<el-form-item label="任务类型">
							<template>
							  <el-select v-model="searchForm.orderTypeValue" placeholder="请选择">
								<el-option v-for="(item,index) in orderTypeOptions" :key="index" :value="item.value" :label="item.label"></el-option>
							  </el-select>
							</template>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :span="4">
					<el-form-item label="国家">
						<el-select placeholder="请选择" v-model="searchForm.countryId" class="minWid">
							<el-option v-for="(item,index) in countryData" :key="index" :value="index" :label="item.country"></el-option>
						</el-select>
					</el-form-item>
					</el-col>
					<el-col :xs="24" :span="4">
						<el-form-item label="关键字">
							<el-input v-model="searchForm.searchkeywords" placeholder="请输入关键字" class="disInline"></el-input>
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
			<el-button type="danger" size="medium" :disabled="disabled" @click='abnormal'><i class="el-icon-warning-outline"></i>标记异常
			</el-button>
			<el-button type="warning" size="medium" :disabled="disabled" @click='sellerCancel'><i class="el-icon-warning-outline"></i>卖家取消
			</el-button>
			<el-button type="success" size="medium" :disabled="disabled" @click="account"><i class="el-icon-sort"></i>重新分配买号
			</el-button>
			<el-button type="primary" size="medium" :disabled="disabled" @click='supplementSheet'><i class="el-icon-set-up"></i>补单
			</el-button>
			<el-button type="danger" size="medium" :disabled="disabled" @click='updateTime'><i class="el-icon-edit-outline"></i>修改执行时间
			</el-button>
			<el-button type="warning" size="medium" :disabled="disabled" @click='deliver'><i class="el-icon-truck"></i>确认发货
			</el-button>
			<el-button type="success" size="medium" :disabled="disabled" @click='receiving'><i class="el-icon-check"></i>确认收货
			</el-button>
			<el-button type="primary" size="medium"><i class="el-icon-upload2"></i>导入</el-button>
      <el-button type="primary" size="medium"><i class="el-icon-download"></i>导出</el-button>
		</div>
		<div class="tabList">
			<div class="tabLeft">
				<ul class="tabBlock">
					<li :class="active === 1 ? 'active':''" @click="getAllData()" :data-index="1">全部<span>({{allNum}})</span></li>
					<li :class="active === 2 ? 'active':''" :data-index="2" @click="daiBuy">待购买<span>(0)</span></li>
					<li :class="active === 3 ? 'active':''" :data-index="3" @click="daifh">待发货<span>(0)</span></li>
					<li :class="active === 4 ? 'active':''" :data-index="4" @click="daish">待收货<span>(0)</span></li>
					<li :class="active === 5 ? 'active':''" :data-index="5" @click="daipj">待评价<span>(0)</span></li>
					<li :class="active === 6 ? 'active':''" :data-index="6" @click="refund">待退款<span>(0)</span></li>
					<li :class="active === 7 ? 'active':''" :data-index="7" @click="ywc">已完成<span>(0)</span></li>
					<li :class="active === 8 ? 'active':''" :data-index="8" @click="errData">异常<span>(0)</span></li>
				</ul>
			</div>
			<div class="tabLeft tabStatus" style="position: absolute;right: 20px;">
				<span>今日未完成</span><span class="txtCol ml10 mr30">23</span>
				<span>逾期未完成</span><span class="txtCol  ml10 mr30">23</span>
				<span>今日限评数</span><span class="txtCol  ml10 mr30">23</span>
			</div>
		</div>
		<div class="mt10">
			<el-table :data="orderPlaceData" style="width: 100%" :header-cell-style="{background:'#fafafa'}" @selection-change="handleSelectionChange">
				<el-table-column type="selection"></el-table-column>
				<el-table-column prop="Numbers" label="任务编码" align="center" width="200">
					<template slot-scope="scope">
						<el-button type="text" @click="viewTaskDetails(scope.$index,scope.row)">{{scope.row.Numbers}}</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="CountryId" label="平台/国家" align="center"></el-table-column>
				<el-table-column prop="ProductByASIN" label="终端平台" align="center"></el-table-column>
				<el-table-column prop="ProductByASIN" label="服务类型" align="center"></el-table-column>
				<el-table-column prop="Picture" :label="times" align="center" v-if="this.active!=1 && this.active!=2"></el-table-column>
				<el-table-column prop="ProductByASIN" label="产品ASIN" align="center"></el-table-column>
				<el-table-column prop="ProductByASIN" label="产品名称" align="center"></el-table-column>
				<el-table-column prop="ProductPrice" label="产品价格" align="center"></el-table-column>
				<el-table-column prop="ServiceType" label="买号" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="买号状态" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="刷手" align="center"></el-table-column>
				<el-table-column prop="OrderTime" label="执行时间" align="center"></el-table-column>
				<el-table-column prop="Status" label="任务状态" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="客户名称" align="center"></el-table-column>
				<el-table-column label="操作" align="center" width="200">
					<template slot-scope="scope">
						<el-button size="small" type="danger" @click="refundModelShow(scope.$index, scope.row)">退款</el-button>
						<el-button size="small" type="primary" @click="logHandel(scope.$index, scope.row)">查看日志</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="mt30">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
		</div>
		<!--标记异常-->
		<el-dialog title='标记异常' :visible.sync='abnormalModal' :close-on-click-modal="false">
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
			</el-form>
      <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="abnormalModal=false">确 定</el-button>
      <el-button @click="abnormalModal=false">取 消</el-button>
      </div>
		</el-dialog>
		<!--卖家取消-->
		<el-dialog title="温馨提示" :visible.sync="sellerCancelModal" :close-on-click-modal="false" center width="30%">
			<div class="del-dialog-cnt textCen">确认要取消任务吗？</div>
			<span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click='confirmSellerCancel'>是</el-button>
        <el-button @click="sellerCancelModal=false" size="medium">否</el-button>
      </span>
		</el-dialog>
		<!--确认发货-->
		<el-dialog title='温馨提示' :visible.sync='confirmDeliveryModal' :close-on-click-modal="false" width='30%'>
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
			</el-form>
      <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click='confirmTime'>确 定</el-button>
      <el-button @click="updateTimeModal = false">取 消</el-button>
      </div>
		</el-dialog>
		<!--温馨提示-->
		<el-dialog title='温馨提示' :visible.sync='tipsModal' :close-on-click-modal='false' width='30%'>
			<div class="del-dialog-cnt textCen"><i class='el-icon-warning-outline fz50'></i>{{message}}</div>
			<span slot="footer" class="dialog-footer">
        <el-button size="medium" @click='tipsModal=false'>关闭</el-button>
      </span>
		</el-dialog>
		<!--补单-->
		<el-dialog title='补单' :visible.sync="sheetModal" :close-on-click-modal="false" width="90%" custom-class="fixed-dialog">
			<SupplementSheet :post-title='this.test'></SupplementSheet>
      <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click='confirmSheet'>确 定</el-button>
      <el-button @click="sheetModal = false">取 消</el-button>
      </div>
		</el-dialog>
		<!-- 重新分配买号-->
		<el-dialog title="重新分配买号" :visible.sync="accountModel" :close-on-click-modal="false" width="90%" custom-class="fixed-dialog">
			<buyNum v-on:listenTochildEvent="showMessageFromChild"></buyNum>
      <div slot="footer" class="dialog-footer">
      <el-button type="primary">确 定</el-button>
      <el-button @click="accountModel = false">取 消</el-button>
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
			</el-form>
      <div slot="footer" class="dialog-footer">
      <el-button type="primary">确 定</el-button>
      <el-button @click="closeModel = false">取 消</el-button>
      </div>
		</el-dialog>
		<!--查看任务详情-->
		<el-dialog :title='orderTitle' :visible.sync="viewTaskDateilsModel" :close-on-click-modal="false" width="90%" custom-class="fixed-dialog">
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
      <div slot="footer" class="dialog-footer">
      <el-button @click="viewTaskDateilsModel = false">关 闭</el-button>
      </div>
		</el-dialog>
		<!--日志-->
		<el-dialog title="订单日志" :visible.sync="logModel" :close-on-click-modal="false" width="90%" custom-class="fixed-dialog">
			<OrderLog></OrderLog>
			<div slot="footer" class="dialog-footer">
			<el-button @click="logModel=false">关 闭</el-button>
			</div>
		</el-dialog>
    <!--退款-->
    <el-dialog title="订单退款" :visible.sync="refundModel" :close-on-click-modal="false">
    	<el-form :rules="editRules" label-width="125px" status-icon>
    		<el-form-item label="退款金额">
    			<el-input v-model="editPriceForm.exchangeRate"></el-input>
    		</el-form-item>
    		<el-form-item label="退款备注">
    			<el-input type="textarea" v-model="editPriceForm.remark"></el-input>
    		</el-form-item>
    	</el-form>
      <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="refundModel=false">确 定</el-button>
      <el-button @click="refundModel = false">取 消</el-button>
      </div>
    </el-dialog>
	</div>
</template>

<script>
	import SupplementSheet from '../../common/SupplementSheet'
	import buyNum from '../../common/buyNum'
	import OrderLog from '../../common/OrderLog'
	export default {
		name: 'placeOrderTask',
		data() {
			return {
				currentPage: 1,
				pageSize: '0',
				total:100,
				radio: '',
				tipMessage: '',
				buyNum: '', //系统配置买号
				logModel: false, //日志
				systemConfigModal: false, //系统配置
				deliverShow: false, //收发货确定按钮
				confirmDeliveryModal: false, //确认发货
				tipsModal: false, //提示
				updateTimeModal: false, //修改执行时间
				sheetModal: false, //补单
				sellerCancelModal: false, //卖家取消
				accountModel: false,
				abnormalModal: false, //标记异常
        refundModel: false, //退款
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
				orderPlaceData: [{
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
				test: {
					text1: '',
					numbers: ''
				},
				pickerUpdateDate: this.startTime(),
				timeForm: {
					times: ''
				},
				abnormalForm: {
					reason: '',
					remark: ''
				},
				platformOptions: [
					{
						value: '1',
						label: '全部'
					},
					{
						value: '2',
						label: 'Amazon'
					}
				],
				orderTypeOptions: [
					{
						value: '1',
						label: 'FBA订单'
					},
					{
						value: '2',
						label: '加购订单'
					},
					{
						value: '3',
						label: '心愿订单'
					},
					{
						value: '4',
						label: '点赞订单'
					},
					{
						value: '5',
						label: 'QA订单'
					}
				],
				countryData: [
					{
						country: '美国'
					},
					{
						country: '加拿大'
					}
				],
				searchForm: {
					platform: '1',
					searchkeywords: '',
					orderStartTime: '',
					orderEndTime: '',
					countryId: '',
					orderTypeValue: '1',
				},
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
					countryId: '',
					searchkeywords: ''
				},
				activeName: 'first',
				allNum: '0',
				active: 1,
				message: ''
			}
		},
		components: {
			SupplementSheet,
			buyNum,
			OrderLog
		},
		created() {
			// this.getAllData()
		},
		methods: {
			showMessageFromChild(data) {
				console.log(data.CountryId)
			},
			// 日志弹窗
			logHandel(index, row) {
				let _this = this
				_this.logModel = true
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
      // 退款
      refundModelShow() {
      	let _this = this
      	_this.refundModel = true
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
			//待退款
			refund(){
				let _this =this
				_this.active = 6
				_this.times = '申请时间'
			},
			// 已完成
			ywc() {
				let _this = this
				_this.active = 7
				_this.times = '评价时间'
				//				_this.orderPlaceData = []
			},
			// 异常订单
			errData() {
				let _this = this
				_this.active = 8
				_this.times = '异常时间'
				//				_this.orderPlaceData = []
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
