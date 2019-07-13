<template>
	<div class="container">
		<div class="mb20 fz14">
			<span>买号管理</span>
			<span>/</span>
			<span>买号列表</span>
		</div>
		<el-collapse-transition>
			<div class="searchBox mb20 pl30" v-show="searchModel">
				<el-form ref="searchForm" :model="searchForm" class="form-item" label-width="100px">
					<el-form-item label="标签类型">
						<el-checkbox-group v-model="searchForm.type">
							<el-checkbox label="西班牙" name="type"></el-checkbox>
							<el-checkbox label="新人注册号" name="type"></el-checkbox>
							<el-checkbox label="加拿大" name="type"></el-checkbox>
							<el-checkbox label="手机测试" name="type"></el-checkbox>
						</el-checkbox-group>
					</el-form-item>
					<el-row>
						<el-col :span='4' :xs='24'>
							<el-form-item label="平台" class="pt20 disInline">
								<el-radio-group v-model="searchForm.platform" class="disInline">
									<el-radio label="全部"></el-radio>
									<el-radio label="Amazon"></el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
						<el-col :span='6' :xs='24'>
							<el-form-item label="是否留评" class="pt20 disInline">
								<el-radio-group v-model="searchForm.isComment" class="disInline">
									<el-radio label="是"></el-radio>
									<el-radio label="否"></el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span='4' :xs='24'>
							<el-form-item label="信用卡类型">
								<el-select placeholder="请选择" v-model="searchForm.CreditCard" class="minWid">
									<el-option v-for="(item,index) in CreditCardData" :key="index" :value="index" :label="item.types"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span='6' :xs='24'>
							<el-form-item label="买号等级">
								<el-select placeholder="请选择" v-model="searchForm.buyNumberLevel" class="minWid">
									<el-option v-for="(item,index) in buyNumberLevelData" :key="index" :value="index" :label="item.level"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-form-item label="注册时间">
						<el-date-picker v-model="searchForm.orderStartTime" type="date" placeholder="选择开始时间" :picker-options="pickerStartDate" value-format="yyyy-MM-dd" class="mb10"></el-date-picker>
						<el-date-picker v-model="searchForm.orderEndTime" type="date" placeholder="选择结束时间" :picker-options="pickerEndDate" value-format="yyyy-MM-dd"></el-date-picker>
					</el-form-item>
					<el-row>
						<el-col :xs="24" :span="7" :sm="9" :md="8" :lg="5">
							<el-form-item label="搜索内容">
								<el-input v-model="searchForm.searchkeywords" placeholder="请输入买家账号/姓名" class="disInline"></el-input>
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
			<el-button type="success" size="medium" @click="addLevel"><i class="el-icon-plus"></i>新建</el-button>
			<el-button type="primary" size="medium" :disabled="disabled" @click="editLevel"><i class="el-icon-edit-outline"></i>修改
			</el-button>
			<el-button type="danger" size="medium" :disabled="disabled" @click="delHandel"><i class="el-icon-delete"></i>删除
			</el-button>
			<el-button type="primary" size="medium" :disabled="disabled" @click="buyNumLevel"><i class="el-icon-rank"></i>绑定买号等级
			</el-button>
			<el-button type="primary" size="medium" :disabled="disabled" @click="updateTab"><i class="el-icon-edit-outline"></i>修改标签
			</el-button>
			<el-button type="primary" size="medium" :disabled="disabled" @click="updateStatus"><i class="el-icon-edit-outline"></i>修改状态
			</el-button>
			<el-button type="primary" size="medium" :disabled="disabled" @click="RelationBrush"><i class="el-icon-sort"></i>关联刷手
			</el-button>
			<el-button type="primary" size="medium" :disabled="disabled" @click="bindIp"><i class="el-icon-set-up"></i>绑定IP
			</el-button>
			<el-button type="warning" size="medium" @click="delHandel"><i class="el-icon-folder-opened"></i>导入
			</el-button>
			<el-button type="warning" size="medium" @click="delHandel"><i class="el-icon-document-delete"></i>导出
			</el-button>
			<el-input placeholder="搜索" prefix-icon="el-icon-search" class="listSearchInput" @click.native="searchShow"></el-input>
			<!--<el-button size="medium" @click="searchShow"><i class="el-icon-search"></i>检索</el-button>-->
		</div>
		<div class="tabList">
			<ul class="tabBlock">
				<li :class="active === 1 ? 'active':''" @click="getAllData()" :data-index="1">全部<span>({{allNum}})</span></li>
				<li :class="active === 2 ? 'active':''" :data-index="2" @click="zc">正常<span>(0)</span></li>
				<li :class="active === 3 ? 'active':''" :data-index="3" @click="sx">失效<span>(0)</span></li>
				<li :class="active === 4 ? 'active':''" :data-index="4" @click="xp">限评<span>(0)</span></li>
				<li :class="active === 5 ? 'active':''" :data-index="5" @click="fh">封号<span>(0)</span></li>
			</ul>
		</div>
		<div class="mt10">
			<el-table :data="buyNumData" border style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="selection"></el-table-column>
				<el-table-column prop="Numbers" label="登录账号" align="center" width="180"></el-table-column>
				<el-table-column prop="CountryId" label="平台/国家" align="center"></el-table-column>
				<el-table-column prop="OrderTime" label="注册时间" align="center"></el-table-column>
				<el-table-column prop="ProductByASIN" label="标签" align="center"></el-table-column>
				<el-table-column prop="ProductPrice" label="任务总数" align="center"></el-table-column>
				<el-table-column prop="ServiceType" label="留评数" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="累积消费" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="关联刷手" align="center"></el-table-column>
				<el-table-column prop="Status" label="状态" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="是否留评" align="center"></el-table-column>
				<el-table-column prop="OrderNote" label="绑定IP" align="center"></el-table-column>
				<el-table-column label="操作" align="center" width='290'>
					<template slot-scope="scope">
						<el-button size="small" type="primary" @click="RedistributionAccount(scope.$index, scope.row)">打开浏览器
						</el-button>
						<el-button size="small" @click="systemConfig(scope.$index, scope.row)">系统配置
						</el-button>
						<el-button size='small' @click="remark(scope.$index,scope.row)">备注</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="mt30">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
		</div>
		<!-- 新建、修改-->
		<el-dialog :title="title" :visible.sync="addBuyNumModel" :close-on-click-modal="false" :before-close="closeModel" width="60%">
			<el-form :model="buyNumForm" ref="buyNumForm" :rules="editRules" class="demo-dynamic" label-width="140px" status-icon>
				<div class="mb20 fz16">账号信息</div>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label="平台" prop="platform">
							<el-radio-group v-model="buyNumForm.platform">
								<el-radio label="全部"></el-radio>
								<el-radio label="Amazon"></el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label="国家" prop="countryId">
							<el-select v-model="buyNumForm.countryId" placeholder="请选择国家" class="selectWid">
								<el-option label="美国" value="美国"></el-option>
								<el-option label="加拿大" value="加拿大"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label="默认网址">
					<span>http://www.preeet.com</span>
				</el-form-item>
				<el-row>
					<el-col>
						<el-form-item label='是否留评' prop='isComment'>
							<el-radio-group v-model="buyNumForm.isComment">
								<el-radio :label="3">可留评</el-radio>
								<el-radio :label="6">不可留评</el-radio>
								<el-radio :label="9">系统判断</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label="登录账号" prop="account" class='inpWid'>
							<el-input v-model="buyNumForm.account" placeholder='请输入登录账号'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label="登录密码" prop="pwd" class='inpWid'>
							<el-input v-model="buyNumForm.pwd" placeholder='请输入登录密码'></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label="账号邮箱" class='inpWid'>
							<el-input v-model="buyNumForm.accountEmail" placeholder='请输入账号邮箱'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label="账号邮箱密码" class='inpWid'>
							<el-input v-model="buyNumForm.accountPwd" placeholder='请输入账号邮箱密码'></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label="辅助账号邮箱" class='inpWid'>
							<el-input v-model="buyNumForm.assistEmail" placeholder='请输入辅助账号邮箱'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label="辅助账号邮箱密码" class='inpWid'>
							<el-input v-model="buyNumForm.assistPwd" placeholder='请输入辅助账号邮箱密码'></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label="学生邮箱" class='inpWid'>
							<el-input v-model="buyNumForm.studentEmail" placeholder='请输入学生邮箱'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label="学生邮箱密码" class='inpWid'>
							<el-input v-model="buyNumForm.studentPwd" placeholder='请输入学生邮箱密码'></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="dataInp">
					<el-col :span='12' :xs='24'>
						<el-form-item label="注册时间">
							<el-date-picker v-model="buyNumForm.registerTime" type="date" placeholder="选择注册时间" value-format="yyyy-MM-dd" class="mb10"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label="FBA会员到期">
							<el-date-picker v-model="buyNumForm.fbaMember" type="date" placeholder="选择到期时间" value-format="yyyy-MM-dd" class="mb10"></el-date-picker>
						</el-form-item>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label="标签">
					<el-checkbox-group v-model="buyNumForm.tabs">
						<el-checkbox label="西班牙" name="西班牙"></el-checkbox>
						<el-checkbox label="新人注册号" name="新人注册号"></el-checkbox>
						<el-checkbox label="加拿大" name="加拿大"></el-checkbox>
						<el-checkbox label="手机测试" name="手机测试"></el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<div class="mb20 fz16">收货地址</div>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label="姓名" class='inpWid'>
							<el-input v-model="buyNumForm.username" placeholder='请输入姓名'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label="电话" class='inpWid'>
							<el-input v-model="buyNumForm.phone" placeholder='请输入电话'></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label="国家" class='inpWid'>
							<el-input v-model="buyNumForm.receivingCountry" placeholder='请输入国家'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label="省/州" prop="province" class='inpWid'>
							<el-input v-model="buyNumForm.province" placeholder='请输入省州'></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label="城市" class='inpWid'>
							<el-input v-model="buyNumForm.city" placeholder='请输入城市'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='12' :xs='24'>
						<el-form-item label="邮编" class='inpWid'>
							<el-input v-model="buyNumForm.postalCode" placeholder='请输入邮编'></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label="详细地址" class='inpWid'>
							<el-input v-model="buyNumForm.address" placeholder='请输入详细地址'></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<div class="mb20 fz16">付款信息</div>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label="信用卡类型">
							<el-select v-model="buyNumForm.CreditCardType" @change='selectCardType' placeholder="请选择信用卡类型" class="selectWid">
								<el-option label="虚拟信用卡" value="虚拟信用卡"></el-option>
								<el-option label="实体信用卡" value="实体信用卡"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<!--<el-col :span='12' :xs='24'>
						<el-form-item label="购物卡" class='inpWid'>
							<el-input v-model="buyNumForm.shopingCard" class="card" @focus="selectCard" placeholder='请选择购物卡'>
								<el-button slot="append" style="background: #3A8EE6;border-radius: 0;" @click="selectCard"><i class="el-icon-search btnCol"></i></el-button>
							</el-input>
						</el-form-item>
					</el-col>-->
				</el-row>
				<div v-show='xnShow'>
					<el-row>
						<el-col :span='12' :xs='24'>
							<el-form-item label="主卡" class='inpWid'>
								<el-input type="text" v-model="buyNumForm.masterCard" class="card" @focus="selectCard" placeholder='请选择主卡'>
									<el-button slot="append" style="background: #3A8EE6;border-radius: 0;" @click="selectCard"><i class="el-icon-search btnCol"></i></el-button>
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span='12' :xs='24'>
							<el-form-item label="虚拟信用卡" class='inpWid'>
								<el-input type="text" v-model="buyNumForm.VirtualCreditCard" class="card" placeholder='请选择虚拟信用卡' @focus='selectVirtua'>
									<el-button slot="append" style="background: #3A8EE6;border-radius: 0;" @click="selectVirtua"><i class="el-icon-search btnCol"></i></el-button>
								</el-input>
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
				<div v-show='entityShow'>
					<el-row>
						<el-col :span='12' :xs='24'>
							<el-form-item label="实体信用卡" class='inpWid'>
								<el-input type="text" v-model="buyNumForm.entityCard" class="card" placeholder='请选择实体信用卡' @focus='selectEntityCard'>
									<el-button slot="append" style="background: #3A8EE6;border-radius: 0;" @click="selectEntityCard"><i class="el-icon-search btnCol"></i></el-button>
								</el-input>
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
				<div class="mb20 fz16">IP信息</div>
				<el-row>
					<el-col :span='12' :xs='24'>
						<el-form-item label="注册IP" class='inpWid'>
							<el-input type="text" v-model="buyNumForm.registerIp" placeholder='请输入注册IP'></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label="备注">
					<el-input type="textarea" v-model="buyNumForm.remark" placeholder='请输入备注'></el-input>
				</el-form-item>
				<div class="textCen">
					<el-button type="primary">确定</el-button>
					<el-button @click="closeModel">取消</el-button>
				</div>
			</el-form>
		</el-dialog>
		<!-- 删除-->
		<el-dialog title="温馨提示" :visible.sync="delModel" :close-on-click-modal="false" center="" width="30%">
			<div class="del-dialog-cnt textCen">确认要删除该买号记录吗？</div>
			<span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium">确定</el-button>
        <el-button @click="delModel=false" size="medium">取消</el-button>
     </span>
		</el-dialog>
		<!--系统配置-->
		<el-dialog :title='systemTitle' :visible.sync='systemConfigModal'>
			<systemConfig></systemConfig>
			<div class="modelRight">
				<el-button type='primary' @click='systemConfigModal=false'>关闭</el-button>
			</div>
		</el-dialog>
		<!--修改标签-->
		<el-dialog title="修改标签" :visible.sync="updateTabModal" :close-on-click-modal="false">
			<el-form :modal='tabForm' label-width="100px">
				<el-form-item label='标签：'>
					<el-checkbox-group v-model="tabForm.tabs">
						<el-checkbox v-for="tab in tabData" :label="tab" :key="tab">{{tab}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item class="modelRight">
					<el-button type='primary'>确认</el-button>
					<el-button @click='updateTabModal=false'>取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!--备注-->
		<el-dialog title='备注' :visible.sync="remarkModal" :close-on-click-modal="false" width="25%">
			<el-form :model='remarkForm'>
				<el-form-item>
					<el-input v-model='remarkForm.remark' type='textarea' placeholder="请填写您要备注的内容" :autosize="{ minRows: 4, maxRows: 10}"></el-input>
				</el-form-item>
			</el-form>
			<div class="modelRight">
				<el-button type='primary' size='medium'>确定</el-button>
				<el-button @click='remarkModal=false' size='medium'>取消</el-button>
			</div>
		</el-dialog>
		<!--修改状态-->
		<el-dialog title="修改状态" :visible.sync="updateStatusModal" :close-on-click-modal="false" width="30%">
			<div class="statusBox mb20 pl30">
				<el-checkbox-group v-model="accountStatus">
					<el-checkbox label="账号失效" name="type"></el-checkbox>
				</el-checkbox-group>
			</div>
			<div class="modelRight">
				<el-button type='primary'>确认</el-button>
				<el-button @click='updateStatusModal=false'>取消</el-button>
			</div>
			</el-form>
		</el-dialog>
		<!--关联刷手-->
		<el-dialog title="关联刷手" :visible.sync="RelationBrushModal" :close-on-click-modal="false" width="60%">
			<el-form :model="brushSearch" ref="brushSearch" class="demo-dynamic" label-width="100px">
				<el-row>
					<el-col :xs="24" :span="7" :sm="9" :md="8" :lg="10">
						<el-form-item label="搜索内容">
							<el-input type="text" v-model="brushSearch.brush"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :span="5" :sm="10" :md="8" :lg="5" class="ml20">
						<el-button type="primary">搜索</el-button>
						<el-button>重置</el-button>
					</el-col>
				</el-row>
			</el-form>
			<el-table :data="buyNumData" border style="width: 100%" @row-click="brushShowRow">
				<el-table-column show-overflow-tooltip width="50px">
					<template slot-scope="scope">
						<el-radio class="radio" v-model="brushRadio" :label="scope.$index">&nbsp;</el-radio>
					</template>
				</el-table-column>
				<el-table-column prop="CountryId" label="登录名" align="center"></el-table-column>
				<el-table-column prop="CountryId" label="姓名" align="center"></el-table-column>
				<el-table-column prop="Numbers" label="归属公司" align="center"></el-table-column>
				<el-table-column prop="ProductPrice" label="归属部门" align="center"></el-table-column>
				<el-table-column prop="Status" label="未完成" align="center"></el-table-column>
				<el-table-column prop="Numbers" label="已完成" align="center"></el-table-column>
				<el-table-column prop="Numbers" label="总计" align="center"></el-table-column>
			</el-table>
			<div class="modelRight mt20">
				<el-button type="primary" size="medium" @click="comfirBrush">确定</el-button>
				<el-button @click="RelationBrushModal=false" size="medium">取消</el-button>
			</div>
		</el-dialog>
		<!--绑定IP-->
		<el-dialog title="绑定静态IP" :visible.sync="bindIpModal" :close-on-click-modal="false" width="60%">
			<el-form :model="brushSearch" ref="brushSearch" class="demo-dynamic" label-width="100px">
				<el-row>
					<el-col :xs="24" :span="7" :sm="9" :md="8" :lg="10">
						<el-form-item label="搜索内容">
							<el-input type="text" v-model="brushSearch.brush"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :span="5" :sm="10" :md="8" :lg="5" class="ml20">
						<el-button type="primary">搜索</el-button>
						<el-button>重置</el-button>
					</el-col>
				</el-row>
			</el-form>
			<el-table :data="buyNumData" border style="width: 100%" @row-click="brushShowRow">
				<el-table-column show-overflow-tooltip width="50px">
					<template slot-scope="scope">
						<el-radio class="radio" v-model="brushRadio" :label="scope.$index">&nbsp;</el-radio>
					</template>
				</el-table-column>
				<el-table-column prop="CountryId" label="IP地址" align="center"></el-table-column>
				<el-table-column prop="CountryId" label="端口" align="center"></el-table-column>
				<el-table-column prop="Numbers" label="授权账号" align="center"></el-table-column>
				<el-table-column prop="ProductPrice" label="授权密码" align="center"></el-table-column>
				<el-table-column prop="Status" label="有效期" align="center"></el-table-column>
				<el-table-column prop="CountryId" label="国家" align="center"></el-table-column>
				<el-table-column prop="Numbers" label="服务商" align="center"></el-table-column>
				<el-table-column prop="Status" label="状态" align="center"></el-table-column>
			</el-table>
			<div class="modelRight mt20">
				<el-button type="primary" size="medium" @click="confirmBindIp">确定</el-button>
				<el-button @click="bindIpModal=false" size="medium">取消</el-button>
			</div>
		</el-dialog>
		<!-- 重新分配-->
		<el-dialog title="买号等级分配信息" :visible.sync="accountModel" width="90%" :close-on-click-modal="false" :before-close="closeBuyNum">
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
		<!-- 绑定买号等级-->
		<el-dialog title="绑定买号等级" :visible.sync="buyNumLevelModel" :close-on-click-modal="false" width="90%">
			<el-form :model="brushSearch" ref="brushSearch" class="demo-dynamic" label-width="100px">
				<el-row>
					<el-col :xs="24" :span="7" :sm="9" :md="8" :lg="10">
						<el-form-item label="等级名称">
							<el-input type="text" v-model="brushSearch.brush"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :span="5" :sm="10" :md="8" :lg="5" class="ml20">
						<el-button type="primary">搜索</el-button>
						<el-button>重置</el-button>
					</el-col>
				</el-row>
			</el-form>
			<el-table :data="buyNumData" border style="width: 100%" @row-click="brushShowRow">
				<el-table-column show-overflow-tooltip width="50px">
					<template slot-scope="scope">
						<el-radio class="radio" v-model="brushRadio" :label="scope.$index">&nbsp;</el-radio>
					</template>
				</el-table-column>
				<el-table-column prop="CountryId" label="等级名称" align="center"></el-table-column>
				<el-table-column prop="CountryId" label="累积购买金额" align="center"></el-table-column>
				<el-table-column prop="Numbers" label="累积购买次数" align="center"></el-table-column>
				<el-table-column prop="ProductPrice" label="累积留评次数" align="center"></el-table-column>
				<el-table-column prop="Status" label="付款方式" align="center"></el-table-column>
				<el-table-column prop="CountryId" label="价格开始区间" align="center"></el-table-column>
				<el-table-column prop="Numbers" label="价格结束区间" align="center"></el-table-column>
				<el-table-column prop="Status" label="排序" align="center"></el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button size="small" type="primary">分配信息
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="modelRight mt20">
				<el-button type="primary" @click='BindBuyNumLevel'>确定</el-button>
				<el-button @click="buyNumLevelModel=false">取消</el-button>
			</div>
		</el-dialog>
		<!--选择主卡-->
		<el-dialog title="选择主卡" :visible.sync="cardModal" :close-on-click-modal="false" width="70%">
			<el-form :model="cardData" ref="cardData" class="demo-dynamic" label-width="100px">
				<el-row>
					<el-col :xs="24" :span="7" :sm="9" :md="8" :lg="10">
						<el-form-item label="主卡">
							<el-input type="text" v-model="cardData.card"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :span="5" :sm="10" :md="8" :lg="5" class="ml20">
						<el-button type="primary">搜索</el-button>
						<el-button>重置</el-button>
					</el-col>
				</el-row>
			</el-form>
			<el-table :data="buyNumData" border style="width: 100%" @row-click="showRow">
				<el-table-column show-overflow-tooltip width="50px">
					<template slot-scope="scope">
						<el-radio class="radio" v-model="radio" :label="scope.$index">&nbsp;</el-radio>
					</template>
				</el-table-column>
				<el-table-column prop="Numbers" label="主卡卡号" align="center"></el-table-column>
				<el-table-column prop="CountryId" label="姓名" align="center"></el-table-column>
				<el-table-column prop="Numbers" label="总额度" align="center"></el-table-column>
				<el-table-column prop="ProductPrice" label="已用额度" align="center"></el-table-column>
				<el-table-column prop="Numbers" label="剩余额度" align="center"></el-table-column>
				<el-table-column prop="Numbers" label="累积使用" align="center"></el-table-column>
			</el-table>
			<div class="mt20 modelRight">
				<el-button type="primary" @click="confirmCard">确定</el-button>
				<el-button @click="cardModal=false">取消</el-button>
			</div>
		</el-dialog>
		<!--选择虚拟卡-->
		<el-dialog title="选择虚拟卡" :visible.sync="virtuaModal" :close-on-click-modal="false" width="70%">
			<el-form :model="cardData" ref="cardData" class="demo-dynamic" label-width="100px">
				<el-row>
					<el-col :xs="24" :span="7" :sm="9" :md="8" :lg="10">
						<el-form-item label="虚拟信用卡">
							<el-input type="text" v-model="cardData.card"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :span="5" :sm="10" :md="8" :lg="5" class="ml20">
						<el-button type="primary">搜索</el-button>
						<el-button>重置</el-button>
					</el-col>
				</el-row>
			</el-form>
			<el-table :data="vertuaCardData" border style="width: 100%" @row-click="showRow">
				<el-table-column show-overflow-tooltip width="50px">
					<template slot-scope="scope">
						<el-radio class="radio" v-model="radio" :label="scope.$index">&nbsp;</el-radio>
					</template>
				</el-table-column>
				<el-table-column prop="Numbers" label="虚拟卡号" align="center"></el-table-column>
				<el-table-column prop="CountryId" label="信用卡额度" align="center"></el-table-column>
				<el-table-column prop="ProductPrice" label="已使用额度" align="center"></el-table-column>
				<el-table-column prop="Numbers" label="剩余额度" align="center"></el-table-column>
				<el-table-column prop="Numbers" label="累积使用" align="center"></el-table-column>
			</el-table>
			<div class="mt20 modelRight">
				<el-button type="primary" @click="confirmVirtuaCard">确定</el-button>
				<el-button @click="virtuaModal=false">取消</el-button>
			</div>
		</el-dialog>
		<!--实体行用卡-->
		<el-dialog title="选择实体信用卡" :visible.sync="entityCardModal" :close-on-click-modal="false" width="70%">
			<el-form :model="cardData" ref="cardData" class="demo-dynamic" label-width="100px">
				<el-row>
					<el-col :xs="24" :span="7" :sm="9" :md="8" :lg="10">
						<el-form-item label="实体信用卡">
							<el-input type="text" v-model="cardData.card"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :span="5" :sm="10" :md="8" :lg="5" class="ml20">
						<el-button type="primary">搜索</el-button>
						<el-button>重置</el-button>
					</el-col>
				</el-row>
			</el-form>
			<el-table :data="vertuaCardData" border style="width: 100%" @row-click="showRow">
				<el-table-column show-overflow-tooltip width="50px">
					<template slot-scope="scope">
						<el-radio class="radio" v-model="radio" :label="scope.$index">&nbsp;</el-radio>
					</template>
				</el-table-column>
				<el-table-column prop="Numbers" label="虚拟卡号" align="center"></el-table-column>
				<el-table-column prop="CountryId" label="信用卡额度" align="center"></el-table-column>
				<el-table-column prop="ProductPrice" label="已使用额度" align="center"></el-table-column>
				<el-table-column prop="Numbers" label="剩余额度" align="center"></el-table-column>
				<el-table-column prop="Numbers" label="累积使用" align="center"></el-table-column>
			</el-table>
			<div class="mt20 modelRight">
				<el-button type="primary" @click="confirmVirtuaCard">确定</el-button>
				<el-button @click="entityCardModal=false">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import systemConfig from '../../common/systemConfig'
	export default {
		name: 'registerAccount',
		data() {
			return {
				entityShow: false,
				entityCardModal: false, //实体信用卡弹窗
				virtuaModal: false, //选择虚拟卡弹窗
				xnShow: false, //选择信用卡类型
				currentPage: 1,
				pageSize: '0',
				total: 100,
				radio: '',
				brushRadio: '',
				title: '新建',
				systemTitle: '',
				remarkModal: false, //备注
				systemConfigModal: false, //系统配置
				buyNumLevelModel: false, //绑定买号等级
				bindIpModal: false, //绑定IP
				updateStatusModal: false, //修改状态弹窗
				accountStatus: '', //账号状态
				RelationBrushModal: false, //关联刷手
				updateTabModal: false, //修改标签
				cardModal: false, //选择购物卡
				disabled: true,
				disabled1: true,
				addBuyNumModel: false, //新建
				delModel: false, //删除
				accountModel: false,
				paramModel: false,
				accountSearchModel: false,
				checkBoxData: [],
				buyCheckData: [],
				searchModel: false,
				buyNumData: [],
				vertuaCardData: [], //虚拟卡
				selected: {},
				pickerEndDate: this.pickerOptionsEnd(),
				pickerStartDate: this.searchStartDate(),
				tabForm: {
					tabs: []
				},
				//备注
				remarkForm: {
					remark: ''
				},
				//关联刷手搜索
				brushSearch: {
					brush: ''
				},
				tabData: ['加拿大改地址', '西班牙(无会员)', '加拿大', '新人注册号', '手机测试', '菲律宾卡', '33卡', '安卓测试', '黑号', '差评', '加拿大改地址2', '西班牙2(无会员)', '加拿大2', '新人注册号2', '手机测试2', '菲律宾卡2', '33卡2', '安卓测试2', '黑号2', '差评2'],
				buyNumberLevelData: [{
					level: 'A'
				}, {
					level: 'B'
				}],
				CreditCardData: [{
						types: '白金卡'
					},
					{
						status: '白银卡'
					}
				],
				buyNumForm: {
					platform: '全部',
					countryId: '',
					isComment: '',
					account: '',
					pwd: '',
					accountEmail: '',
					accountPwd: '',
					assistEmail: '',
					assistPwd: '',
					studentEmail: '',
					studentPwd: '',
					registerTime: '',
					fbaMember: '',
					tabs: [],
					username: '',
					phone: '',
					receivingCountry: '',
					province: '',
					city: '',
					postalCode: '',
					address: '',
					CreditCardType: '',
					//					shopingCard: '',
					masterCard: '',
					VirtualCreditCard: '',
					entityCard: '',
					registerIp: '',
					remark: ''
				},
				editRules: {
					platform: [{
						required: true,
						message: '请选择平台',
						trigger: 'change'
					}],
					countryId: [{
						required: true,
						message: '请选择国家',
						trigger: 'blur'
					}],
					account: [{
						required: true,
						message: '请输入账号',
						trigger: 'blur'
					}],
					pwd: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}],
					isComment: [{
						required: true,
						message: '请选择留评类型',
						trigger: 'change'
					}]
				},
				searchForm: {
					type: [],
					platform: '全部',
					isComment: '是',
					searchkeywords: '',
					orderStartTime: '',
					orderEndTime: '',
					CreditCard: '',
					buyNumberLevel: ''
				},
				accountSearchForm: {
					searchKeyWords: ''
				},
				paramForm: {
					values: ''
				},
				cardData: {
					card: ''
				},
				activeName: 'first',
				allNum: '0',
				active: '1'
			}
		},
		components: {
			systemConfig
		},
		created() {
			this.getAllData()
		},
		methods: {
			//选择实体信用卡
			selectEntityCard(){
				let _this = this
				_this.entityCardModal = true
			},
			//选择实体卡确定
			confirmEntity(){
				let _this = this
				let numbers = _this.selected.Numbers
				_this.buyNumForm.entityCard = numbers
			},
			//虚拟信用卡
			selectVirtua(){
				let _this = this
				_this.virtuaModal = true
				_this.getvertuaCard()
			},
			//信用卡类型
			selectCardType() {
				let _this = this
				let card = _this.buyNumForm.CreditCardType
				if(card == '虚拟信用卡') {
					_this.xnShow = true
					_this.entityShow = false
				} else if(card == '实体信用卡') {
					_this.xnShow = false
					_this.entityShow = true
				}
			},
			//备注
			remark(index, row) {
				let _this = this
				_this.remarkModal = true
			},
			//备注确定
			confirmRemark() {
				let _this = this
				_this.remarkModal = false
			},
			//系统配置
			systemConfig(index, row) {
				let _this = this
				_this.systemConfigModal = true
				let item = _this.buyNumData[index]
				let num = item.Numbers
				_this.systemTitle = '买号：' + num + '系统配置'
			},
			// 绑定买号等级
			buyNumLevel() {
				let _this = this
				_this.buyNumLevelModel = true
			},
			// 绑定买号等级确定
			BindBuyNumLevel() {
				let _this = this
				_this.buyNumLevelModel = false
				_this.selected = {}
				_this.brushSearch = {
					brush: ''
				}
			},
			// 绑定IP
			bindIp() {
				let _this = this
				_this.bindIpModal = true
			},
			// 绑定IP确定
			confirmBindIp() {
				let _this = this
				_this.bindIpModal = false
				_this.selected = {}
				_this.brushSearch = {
					brush: ''
				}
			},
			// 关联刷手
			RelationBrush() {
				let _this = this
				_this.RelationBrushModal = true
			},
			// 关联刷手确定
			comfirBrush() {
				let _this = this
				_this.RelationBrushModal = false
				_this.selected = {}
			},
			// 修改状态
			updateStatus() {
				let _this = this
				_this.updateStatusModal = true
			},
			// 修改标签
			updateTab() {
				let _this = this
				_this.updateTabModal = true
			},
			showRow(row) {
				//赋值给radio
				this.radio = this.buyNumData.indexOf(row);
				this.selected = row;
			},
			// 关联刷手赋值radio
			brushShowRow(row) {
				let _this = this
				_this.brushRadio = _this.buyNumData.indexOf(row)
				_this.selected = row
			},
            // 选择主卡确定
			confirmCard() {
				let _this = this
				_this.cardModal = false
				let numbers = _this.selected.Numbers
				_this.buyNumForm.masterCard = numbers

			},
			//选择虚拟卡确定
			confirmVirtuaCard() {
				let _this = this
				_this.virtuaModal = false
				let numbers = _this.selected.Numbers
				_this.buyNumForm.VirtualCreditCard = numbers
				_this.selected = {}

			},
			// 选择购物卡弹窗
			selectCard() {
				let _this = this
				let pt = _this.buyNumForm.platform
				let country = _this.buyNumForm.countryId
				_this.cardModal = true
				//				if(pt == '') {
				//					_this.$message.error('请选择平台')
				//
				//				} else if(country == '') {
				//					_this.$message.error('请选择国家')
				//				} else {
				//					_this.cardModal = true
				//				}
			},
			// 重置
			resetSearch() {
				let _this = this
				_this.searchForm = {
					platform: '全部',
					searchkeywords: '',
					orderStartTime: '',
					orderEndTime: '',
					status: ''
				}
			},
			// 下单开始时间
			searchStartDate() {
				return {
					disabledDate: time => {
						let endDateVal = this.searchForm.orderEndTime
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
						let beginDateVal = this.searchForm.orderStartTime
						if(beginDateVal) {
							return(
								time.getTime() <
								new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
							)
						}
					}
				}
			},
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
				_this.addBuyNumModel = true
			},
			// 修改弹窗
			editLevel() {
				let _this = this
				_this.addBuyNumModel = true
				_this.title = '修改'
				let item = _this.checkBoxData
				console.log(item)
				_this.buyNumForm.countryId = item[0].CountryId
			},
			// 关闭修改价格弹窗
			closeModel() {
				let _this = this
				_this.addBuyNumModel = false
				_this.buyNumForm = {
					platform: '全部',
					countryId: '',
					isComment: '可留评',
					account: '',
					pwd: '',
					accountEmail: '',
					accountPwd: '',
					assistEmail: '',
					assistPwd: '',
					studentEmail: '',
					studentPwd: '',
					registerTime: '',
					fbaMember: '',
					tabs: [],
					username: '',
					phone: '',
					receivingCountry: '',
					province: '',
					city: '',
					postalCode: '',
					address: '',
					CreditCardType: '',
					//					shopingCard: '',
					masterCard: '',
					VirtualCreditCard: '',
					registerIp: '',
					remark: ''
				}
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
			//获取虚拟卡
			getvertuaCard() {
				let _this = this
				_this.active = 1
				_this.axios.get(_this.GLOBAL.BASE_URL + 'api/OrderManagement/AddOrderByType').then((res) => {
					_this.vertuaCardData = res.data.data
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
			//正常
			zc() {
				let _this = this
				_this.active = 2
				_this.buyNumData = []
			},
			//失效
			sx() {
				let _this = this
				_this.active = 3
				_this.buyNumData = []
			},
			//限评
			xp() {
				let _this = this
				_this.active = 4
				_this.buyNumData = []
			},
			//封号
			fh() {
				let _this = this
				_this.active = 5
				_this.buyNumData = []
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