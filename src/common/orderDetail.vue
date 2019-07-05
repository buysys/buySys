<template>
	<!-- 订单详情-->
	<div>
	    <el-form class="demo-item">
			<div class="fz16">订单信息</div>
			<el-row>
				<el-col :span='12' :xs='24'>
					<el-form-item label="平台：">
						<span>{{orderData.Forum}}</span>
					</el-form-item>
				</el-col>
				<el-col :span='12' :xs='24'>
					<el-form-item label="国家：">
						<span>{{orderData.CountryId}}</span>
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
			<el-row>
				<el-col :span='12' :xs='24'>
					<el-form-item label="产品总额：">
						<span>$23.00</span>
					</el-form-item>
				</el-col>
				<el-col :span='12' :xs='24'>
					<el-form-item label="服务费用：">
						<span>$0.00</span>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span='12' :xs='24'>
					<el-form-item label="合计金额：">
						<span>$23</span>
					</el-form-item>
				</el-col>
				<el-col :span='12' :xs='24'>
					<el-form-item label="订单备注：">
						<span>而温柔</span>
					</el-form-item>
				</el-col>
			</el-row>
			<div class="fz16">客户信息</div>
			<el-row>
				<el-col :span='12' :xs='24'>
					<el-form-item label="账号：">
						<span>kyumin</span>
					</el-form-item>
				</el-col>
				<el-col :span='12' :xs='24'>
					<el-form-item label="名称：">
						<span>kyumin</span>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span='12' :xs='24'>
					<el-form-item label="邮箱：">
						<span>kyumin@163.com</span>
					</el-form-item>
				</el-col>
				<el-col :span='12' :xs='24'>
					<el-form-item label="手机：">
						<span>1234242422</span>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span='12' :xs='24'>
					<el-form-item label="微信：">
						<span>kyumin</span>
					</el-form-item>
				</el-col>
				<el-col :span='12' :xs='24'>
					<el-form-item label="QQ：">
						<span>7043443443</span>
					</el-form-item>
				</el-col>
			</el-row>
			<div class="fz16">付款信息</div>
			<el-row>
				<el-col :span='12' :xs='24'>
					<el-form-item label="付款方式：">
						<span>支付宝</span>
					</el-form-item>
				</el-col>
				<el-col :span='12' :xs='24'>
					<el-form-item label="付款账号：">
						<span>7043443443</span>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span='12' :xs='24'>
					<el-form-item label="收款账号：">
						<span>支付宝</span>
					</el-form-item>
				</el-col>
				<el-col :span='12' :xs='24'>
					<el-form-item label="收款姓名：">
						<span>kyumin</span>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span='12' :xs='24'>
					<el-form-item label="交易流水：">
						<span>43253256576576</span>
					</el-form-item>
				</el-col>
				<el-col :span='12' :xs='24'>
					<el-form-item label="付款金额：">
						<span>￥70</span>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>

<script>
	export default {
		name: 'orderDetail',
		props: ["orderData"]
	}
</script>

<style>
</style>
