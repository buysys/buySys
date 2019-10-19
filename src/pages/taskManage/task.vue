<template>
  <div class="container">
    <div class="mb20 fz14">
      <span>首页</span>
      <span>/</span>
      <span>任务管理</span>
    </div>
    <el-collapse-transition>
      <div class="searchBox mb20">
        <el-form ref="searchForm" :model="searchForm" class="form-item" label-width="80px">
          <el-row>
            <el-col :xs="24" :span="4">
              <el-form-item label="平台">
                <template>
                  <el-select v-model="searchForm.platform" placeholder="请选择" size="small">
                    <el-option v-for="(item,index) in platformOptions" :key="index" :value="item.value" :label="item.label"></el-option>
                  </el-select>
                </template>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :span="4">
              <el-form-item label="任务类型">
                <template>
                  <el-select v-model="searchForm.orderTypeValue" placeholder="请选择" size="small">
                    <el-option v-for="(item,index) in orderTypeOptions" :key="index" :value="item.value" :label="item.label"></el-option>
                  </el-select>
                </template>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :span="4">
              <el-form-item label="国家">
                <el-select v-model="searchForm.countryId"  placeholder="请选择" size="small">
                  <el-option v-for="(item,index) in countryData" :key="index" :value="index" :label="item.country"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :span="4">
              <el-form-item label="关键字">
                <el-input v-model="searchForm.searchkeywords" placeholder="请输入关键字" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :span="4">
              <el-form-item>
              <el-button type="primary" size="small">查询</el-button>
              <el-button size="small" @click="resetSearch">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-collapse-transition>
    <div class="mb20">
      <el-button type="danger" size="small" :disabled="disabledMore" @click='deliver'><i class="el-icon-truck"></i> 确认发货</el-button>
      <el-button type="success" size="small" :disabled="disabledMore" @click='receiving'><i class="el-icon-check"></i> 确认收货</el-button>
      <el-button type="warning" size="small"><i class="el-icon-download"></i> 导入</el-button>
      <el-button type="warning" size="small"><i class="el-icon-upload2"></i> 导出</el-button>
    </div>
    <div class="tabList">
        <ul class="tabBlock">
          <li :class="active === 1 ? 'active':''" @click="getAllData()" :data-index="1">全部<span>({{allNum}})</span></li>
          <li :class="active === 2 ? 'active':''" :data-index="2" @click="daiBuy">待购买<span>(0)</span></li>
          <li :class="active === 3 ? 'active':''" :data-index="3" @click="daifh">待发货<span>(0)</span></li>
          <li :class="active === 4 ? 'active':''" :data-index="4" @click="daish">待收货<span>(0)</span></li>
          <li :class="active === 5 ? 'active':''" :data-index="5" @click="daipj">待评价<span>(0)</span></li>
          <li :class="active === 51 ? 'active':''" :data-index="51" @click="Evaluated">已填评价<span>(0)</span></li>
          <li :class="active === 52 ? 'active':''" :data-index="52" @click="toEvaluated">待填评价<span>(0)</span></li>
          <li :class="active === 6 ? 'active':''" :data-index="6" @click="refund">待退款<span>(0)</span></li>
          <li :class="active === 7 ? 'active':''" :data-index="7" @click="ywc">已完成<span>(0)</span></li>
          <li :class="active === 8 ? 'active':''" :data-index="8" @click="errData">异常<span>(0)</span></li>
          <li :class="active === 9 ? 'active':''" :data-index="9" @click="dcl">待处理<span>(0)</span></li>
        </ul>
      <div class="tabStatus" style="position:absolute;right:50px;top:250px">
        <span>今日未完成</span><span class="txtCol ml10 mr30">23</span>
        <span>逾期未完成</span><span class="txtCol ml10 mr30">23</span>
        <span>今日限评数</span><span class="txtCol ml10 mr30">23</span>
      </div>
    </div>
    <div class="mt10">
      <!-- FBA订单列表 -->
      <div v-if="searchForm.orderTypeValue=='1'">
        <el-table border :data="tableData" id="exportTable" style="width: 100%" :header-cell-style="{background:'#fafafa'}"
          @selection-change="handleSelectionChange" @row-click="rowClick" ref="table">
          <el-table-column type="selection" align="center"></el-table-column>
          <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
          <el-table-column prop="Numbers" label="FBA任务编码" align="center" width="120">
            <template slot-scope="scope">
              <el-button type="text" @click="viewTaskDetails(scope.$index,scope.row)">{{scope.row.Numbers}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="CountryId" label="平台/国家" align="center"></el-table-column>
          <el-table-column prop="Forum" label="终端平台" align="center"></el-table-column>
          <el-table-column prop="Picture" label="服务类型" align="center"></el-table-column>
          <el-table-column prop="Picture" :label="times" align="center" v-if="this.active!=1 && this.active!=2"></el-table-column>
          <el-table-column prop="ProductByASIN" label="产品ASIN" align="center"></el-table-column>
          <el-table-column prop="ProductByASIN" label="产品名称" align="center"></el-table-column>
          <el-table-column prop="ProductPrice" label="产品价格" align="center"></el-table-column>
          <el-table-column prop="OrderNumber" label="买号" align="center"></el-table-column>
          <el-table-column prop="Status" label="买号状态" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="刷手" align="center"></el-table-column>
          <el-table-column prop="OrderTime" label="执行时间" align="center"></el-table-column>
          <el-table-column prop="Status" label="任务状态" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="客户名称" align="center"></el-table-column>
        </el-table>
        <div class="table-foot">
          <div>
            <el-button type="danger" size="small" :disabled="disabled" @click='abnormal'>标记异常</el-button>
            <el-button type="warning" size="small" :disabled="disabled" @click='sellerCancel'>卖家取消</el-button>
            <el-button type="success" size="small" :disabled="disabled" @click="account">重新分配买号</el-button>
            <el-button type="primary" size="small" :disabled="disabled" @click='supplementSheet'>补单</el-button>
            <el-button type="danger" size="small" :disabled="disabled" @click='updateTime'>修改执行时间</el-button>
            <el-button type="danger" size="small" :disabled="disabled" @click="refundModelShow">退款</el-button>
            <el-button type="primary" size="small" :disabled="disabled" @click="logHandel">查看日志</el-button>
            <el-button type="success" size="small" :disabled="disabled" @click="confirmBuyHandel">确认购买</el-button>
            <el-button type="warning" size="small" :disabled="disabled" @click="evaluateLink">评论链接</el-button>
            <el-button type="primary" size="small" :disabled="disabled">打开浏览器</el-button>
            <el-button type="primary" size="small" :disabled="disabled" @click='evaluateEdit'>填写评价</el-button>
            <el-button type="primary" size="small" :disabled="disabled" @click="upComment">上评</el-button>
            <el-button type="primary" size="small" :disabled="disabled" @click="confirmBuyHandel">重新购买</el-button>
          </div>
          <div>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
              :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>
        </div>
      </div>
      <!-- 加购订单列表 -->
      <div v-if="searchForm.orderTypeValue=='2'">
        <el-table border :data="tableData" id="exportTable" style="width: 100%" :header-cell-style="{background:'#fafafa'}"
          @selection-change="handleSelectionChange" @row-click="rowClick" ref="table">
          <el-table-column type="selection" align="center"></el-table-column>
          <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
          <el-table-column prop="Numbers" label="加购任务编码" align="center" width="120">
            <template slot-scope="scope">
              <el-button type="text" @click="viewTaskDetails(scope.$index,scope.row)">{{scope.row.Numbers}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="CountryId" label="平台/国家" align="center"></el-table-column>
          <el-table-column prop="Forum" label="终端平台" align="center"></el-table-column>
          <el-table-column prop="Picture" label="服务类型" align="center"></el-table-column>
          <el-table-column prop="Picture" :label="times" align="center" v-if="this.active!=1 && this.active!=2"></el-table-column>
          <el-table-column prop="ProductByASIN" label="产品ASIN" align="center"></el-table-column>
          <el-table-column prop="ProductByASIN" label="产品名称" align="center"></el-table-column>
          <el-table-column prop="ProductPrice" label="产品价格" align="center"></el-table-column>
          <el-table-column prop="OrderNumber" label="买号" align="center"></el-table-column>
          <el-table-column prop="Status" label="买号状态" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="刷手" align="center"></el-table-column>
          <el-table-column prop="OrderTime" label="执行时间" align="center"></el-table-column>
          <el-table-column prop="Status" label="任务状态" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="客户名称" align="center"></el-table-column>
        </el-table>
        <div class="table-foot">
          <div>
            <el-button type="danger" size="small" :disabled="disabled" @click='abnormal'>标记异常</el-button>
            <el-button type="warning" size="small" :disabled="disabled" @click='sellerCancel'>卖家取消</el-button>
            <el-button type="success" size="small" :disabled="disabled" @click="account">重新分配买号</el-button>
            <el-button type="primary" size="small" :disabled="disabled" @click='supplementSheet'>补单</el-button>
            <el-button type="danger" size="small" :disabled="disabled" @click='updateTime'>修改执行时间</el-button>
            <el-button type="danger" size="small" :disabled="disabled" @click="refundModelShow">退款</el-button>
            <el-button type="primary" size="small" :disabled="disabled" @click="logHandel">查看日志</el-button>
            <el-button type="success" size="small" :disabled="disabled" @click="confirmBuyHandel">确认购买</el-button>
            <el-button type="warning" size="small" :disabled="disabled" @click="evaluateLink">评论链接</el-button>
            <el-button type="primary" size="small" :disabled="disabled">打开浏览器</el-button>
            <el-button type="primary" size="small" :disabled="disabled" @click='evaluateEdit'>填写评价</el-button>
            <el-button type="primary" size="small" :disabled="disabled" @click="upComment">上评</el-button>
            <el-button type="primary" size="small" :disabled="disabled" @click="confirmBuyHandel">重新购买</el-button>
          </div>
          <div>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
              :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>
        </div>
      </div>
      <!-- 心愿订单列表 -->
      <div v-if="searchForm.orderTypeValue=='3'">
        <el-table border :data="tableData" id="exportTable" style="width: 100%" :header-cell-style="{background:'#fafafa'}"
          @selection-change="handleSelectionChange" @row-click="rowClick" ref="table">
          <el-table-column type="selection" align="center"></el-table-column>
          <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
          <el-table-column prop="Numbers" label="心愿任务编码" align="center" width="120">
            <template slot-scope="scope">
              <el-button type="text" @click="viewTaskDetails(scope.$index,scope.row)">{{scope.row.Numbers}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="CountryId" label="平台/国家" align="center"></el-table-column>
          <el-table-column prop="Forum" label="终端平台" align="center"></el-table-column>
          <el-table-column prop="Picture" label="服务类型" align="center"></el-table-column>
          <el-table-column prop="Picture" :label="times" align="center" v-if="this.active!=1 && this.active!=2"></el-table-column>
          <el-table-column prop="ProductByASIN" label="产品ASIN" align="center"></el-table-column>
          <el-table-column prop="ProductByASIN" label="产品名称" align="center"></el-table-column>
          <el-table-column prop="ProductPrice" label="产品价格" align="center"></el-table-column>
          <el-table-column prop="OrderNumber" label="买号" align="center"></el-table-column>
          <el-table-column prop="Status" label="买号状态" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="刷手" align="center"></el-table-column>
          <el-table-column prop="OrderTime" label="执行时间" align="center"></el-table-column>
          <el-table-column prop="Status" label="任务状态" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="客户名称" align="center"></el-table-column>
        </el-table>
        <div class="table-foot">
          <div>
            <el-button type="danger" size="small" :disabled="disabled" @click='abnormal'>标记异常</el-button>
            <el-button type="warning" size="small" :disabled="disabled" @click='sellerCancel'>卖家取消</el-button>
            <el-button type="success" size="small" :disabled="disabled" @click="account">重新分配买号</el-button>
            <el-button type="primary" size="small" :disabled="disabled" @click='supplementSheet'>补单</el-button>
            <el-button type="danger" size="small" :disabled="disabled" @click='updateTime'>修改执行时间</el-button>
            <el-button type="danger" size="small" :disabled="disabled" @click="refundModelShow">退款</el-button>
            <el-button type="primary" size="small" :disabled="disabled" @click="logHandel">查看日志</el-button>
            <el-button type="success" size="small" :disabled="disabled" @click="confirmBuyHandel">确认购买</el-button>
            <el-button type="warning" size="small" :disabled="disabled" @click="evaluateLink">评论链接</el-button>
            <el-button type="primary" size="small" :disabled="disabled">打开浏览器</el-button>
            <el-button type="primary" size="small" :disabled="disabled" @click='evaluateEdit'>填写评价</el-button>
            <el-button type="primary" size="small" :disabled="disabled" @click="upComment">上评</el-button>
            <el-button type="primary" size="small" :disabled="disabled" @click="confirmBuyHandel">重新购买</el-button>
          </div>
          <div>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
              :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>
        </div>
      </div>
      <!-- 点赞订单列表 -->
      <div v-if="searchForm.orderTypeValue=='4'">
        <el-table border :data="tableData" id="exportTable" style="width: 100%" :header-cell-style="{background:'#fafafa'}"
          @selection-change="handleSelectionChange" @row-click="rowClick" ref="table">
          <el-table-column type="selection" align="center"></el-table-column>
          <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
          <el-table-column prop="Numbers" label="点赞任务编码" align="center" width="120">
            <template slot-scope="scope">
              <el-button type="text" @click="viewLikeTaskDetails(scope.$index,scope.row)">{{scope.row.Numbers}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="CountryId" label="平台/国家" align="center"></el-table-column>
          <el-table-column prop="Forum" label="终端平台" align="center"></el-table-column>
          <el-table-column prop="Picture" label="服务类型" align="center"></el-table-column>
          <el-table-column prop="Picture" :label="times" align="center" v-if="this.active!=1 && this.active!=2"></el-table-column>
          <el-table-column prop="ProductByASIN" label="产品ASIN" align="center"></el-table-column>
          <el-table-column prop="ProductByASIN" label="产品名称" align="center"></el-table-column>
          <el-table-column prop="ProductPrice" label="产品价格" align="center"></el-table-column>
          <el-table-column prop="OrderNumber" label="买号" align="center"></el-table-column>
          <el-table-column prop="Status" label="买号状态" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="刷手" align="center"></el-table-column>
          <el-table-column prop="OrderTime" label="执行时间" align="center"></el-table-column>
          <el-table-column prop="Status" label="任务状态" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="客户名称" align="center"></el-table-column>
        </el-table>
        <div class="table-foot">
          <div>
            <el-button type="danger" size="small" :disabled="disabled" @click='abnormal'>标记异常</el-button>
            <el-button type="warning" size="small" :disabled="disabled" @click='sellerCancel'>卖家取消</el-button>
            <el-button type="success" size="small" :disabled="disabled" @click="account">重新分配买号</el-button>
            <el-button type="primary" size="small" :disabled="disabled" @click='supplementSheet'>补单</el-button>
            <el-button type="danger" size="small" :disabled="disabled" @click='updateTime'>修改执行时间</el-button>
            <el-button type="danger" size="small" :disabled="disabled" @click="refundModelShow">退款</el-button>
            <el-button type="primary" size="small" :disabled="disabled" @click="logHandel">查看日志</el-button>
            <el-button type="success" size="small" :disabled="disabled" @click="confirmBuyHandel">确认购买</el-button>
            <el-button type="warning" size="small" :disabled="disabled" @click="evaluateLink">评论链接</el-button>
            <el-button type="primary" size="small" :disabled="disabled">打开浏览器</el-button>
            <el-button type="primary" size="small" :disabled="disabled" @click='evaluateEdit'>填写评价</el-button>
            <el-button type="primary" size="small" :disabled="disabled" @click="upComment">上评</el-button>
            <el-button type="primary" size="small" :disabled="disabled" @click="confirmBuyHandel">重新购买</el-button>
          </div>
          <div>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
              :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>
        </div>
      </div>

      <!-- QA订单列表 -->
      <div v-if="searchForm.orderTypeValue=='5'">
        <el-table border :data="tableData" id="exportTable" style="width: 100%" :header-cell-style="{background:'#fafafa'}"
          @selection-change="handleSelectionChange" @row-click="rowClick" ref="table">
          <el-table-column type="selection" align="center"></el-table-column>
          <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
          <el-table-column prop="Numbers" label="QA任务编码" align="center" width="120">
            <template slot-scope="scope">
              <el-button type="text" @click="viewQATaskDetails(scope.$index,scope.row)">{{scope.row.Numbers}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="CountryId" label="平台/国家" align="center"></el-table-column>
          <el-table-column prop="Forum" label="终端平台" align="center"></el-table-column>
          <el-table-column prop="Picture" label="服务类型" align="center"></el-table-column>
          <el-table-column prop="Picture" :label="times" align="center" v-if="this.active!=1 && this.active!=2"></el-table-column>
          <el-table-column prop="ProductByASIN" label="产品ASIN" align="center"></el-table-column>
          <el-table-column prop="ProductByASIN" label="产品名称" align="center"></el-table-column>
          <el-table-column prop="ProductPrice" label="产品价格" align="center"></el-table-column>
          <el-table-column prop="OrderNumber" label="买号" align="center"></el-table-column>
          <el-table-column prop="Status" label="买号状态" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="刷手" align="center"></el-table-column>
          <el-table-column prop="OrderTime" label="执行时间" align="center"></el-table-column>
          <el-table-column prop="Status" label="任务状态" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="客户名称" align="center"></el-table-column>
        </el-table>
        <div class="table-foot">
          <div>
            <el-button type="danger" size="small" :disabled="disabled" @click='abnormal'>标记异常</el-button>
            <el-button type="warning" size="small" :disabled="disabled" @click='sellerCancel'>卖家取消</el-button>
            <el-button type="success" size="small" :disabled="disabled" @click="account">重新分配买号</el-button>
            <el-button type="primary" size="small" :disabled="disabled" @click='supplementSheet'>补单</el-button>
            <el-button type="danger" size="small" :disabled="disabled" @click='updateTime'>修改执行时间</el-button>
            <el-button type="danger" size="small" :disabled="disabled" @click="refundModelShow">退款</el-button>
            <el-button type="primary" size="small" :disabled="disabled" @click="logHandel">查看日志</el-button>
            <el-button type="success" size="small" :disabled="disabled" @click="confirmBuyHandel">确认购买</el-button>
            <el-button type="warning" size="small" :disabled="disabled" @click="evaluateLink">评论链接</el-button>
            <el-button type="primary" size="small" :disabled="disabled">打开浏览器</el-button>
            <el-button type="primary" size="small" :disabled="disabled" @click='evaluateEdit'>填写评价</el-button>
            <el-button type="primary" size="small" :disabled="disabled" @click="upComment">上评</el-button>
            <el-button type="primary" size="small" :disabled="disabled" @click="confirmBuyHandel">重新购买</el-button>
          </div>
          <div>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
              :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!--填写评价-->
    <el-dialog :title='title' :visible.sync='evaluateModal' :close-on-click-modal='false'>
      <el-form :model='proEvaluateForm' ref='proEvaluateForm' label-width='120px' :rules='editRules'>
        <el-form-item label='Feedback评分' prop='FeedbackScore'>
          <el-rate v-model="proEvaluateForm.FeedbackScore" style="line-height: 2.8;"></el-rate>
        </el-form-item>
        <el-form-item label='Feedback评价' prop='Feedback'>
          <el-input v-model='proEvaluateForm.Feedback'></el-input>
        </el-form-item>
        <el-form-item label='产品评分' prop='score'>
          <el-rate v-model="proEvaluateForm.score" style="line-height: 2.8;"></el-rate>
        </el-form-item>
        <el-form-item label='产品评价标题' prop='proTitle'>
          <el-input v-model='proEvaluateForm.proTitle'></el-input>
        </el-form-item>
        <el-form-item label='产品评价内容' prop='proDes'>
          <el-input :autosize="{ minRows: 4, maxRows: 8}" type='textarea' v-model='proEvaluateForm.proDes'></el-input>
        </el-form-item>
        <el-form-item label='上传图片' prop='proTitle'>
          <el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label='上传视频' prop='proTitle'>
          <el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirProEva('proEvaluateForm')">确 定</el-button>
        <el-button @click="evaluateModal=false">取 消</el-button>
      </div>
    </el-dialog>
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
          <el-date-picker v-model='timeForm.times' type='datetime' placeholder='请选择时间' :picker-options="pickerUpdateDate"></el-date-picker>
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
    <!--日志-->
    <el-dialog title="订单日志" :visible.sync="logModel" :close-on-click-modal="false" width="90%" custom-class="fixed-dialog">
      <orderLog></orderLog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="logModel=false">关 闭</el-button>
      </div>
    </el-dialog>
    <!--退款-->
    <el-dialog title="订单退款" :visible.sync="refundModel" :close-on-click-modal="false">
      <el-form :rules="editRules" label-width="125px" status-icon>
        <el-form-item label="产品总价">
          <el-input v-model="editPriceForm.totalPrice"></el-input>
        </el-form-item>
        <el-form-item label="服务费">
          <el-input v-model="editPriceForm.addServiceFree"></el-input>
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
    <!-- 确认购买-->
    <el-dialog :title="title" :visible.sync="confirmBuyModel" :close-on-click-modal="false" width='60%'>
      <el-form :model='confirmBuyForm' ref='confirmBuyForm' label-width='100px' :rules='editRules'>
        <div class="fz16 mb20 modalTitle">任务信息</div>
        <el-row>
          <el-col :span="12" :xs="24">
            <el-form-item label="任务编码">
              <span>{{confirmBuyForm.item}}</span>
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
        <div class="mb20 fz16 modalTitle">购买信息</div>
        <el-row class="dataInp">
          <el-col :span='12' :xs='24'>
            <el-form-item label="购买时间" prop='buyTime'>
              <el-date-picker v-model='confirmBuyForm.buyTime' type="datetime" placeholder="选择购买日期时间"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label='订单单号' class='inpWid' prop='orderNo'>
              <el-input v-model='confirmBuyForm.orderNo'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='12' :xs='24'>
            <el-form-item label='产品金额' class='inpWid' prop='proPrice'>
              <el-input v-model='confirmBuyForm.proPrice'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label='运费' class='inpWid'>
              <el-input v-model='confirmBuyForm.proFreight'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='12' :xs='24'>
            <el-form-item label='总额' class='inpWid'>
              <el-input v-model='confirmBuyForm.allPrice'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label='换算成美元' class='inpWid'>
              <el-input v-model='confirmBuyForm.conversionDollar'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot='footer' class='dialog-footer'>
        <el-button type='primary'>确认</el-button>
        <el-button @click='confirmBuyModel=false'>取消</el-button>
      </div>
    </el-dialog>
    <!--查看任务详情(FBA/加购/心愿订单)-->
    <el-dialog :title='orderTitle' :visible.sync="viewTaskDetailsModel" :close-on-click-modal="false" custom-class="fixed-dialog">
      <el-form class="demo-item" :model='taskViewForm'>
        <div class="modalTitle fz16 mb20">任务信息</div>
        <el-row>
          <el-col :span='8' :xs='24'>
            <el-form-item label="平台：">
              <span>Amazon</span>
            </el-form-item>
          </el-col>
          <el-col :span='8' :xs='24'>
            <el-form-item label="国家：">
              <span>美国</span>
            </el-form-item>
          </el-col>
          <el-col :span='8' :xs='24'>
            <el-form-item label="产品ASIN：">
              <span>D2342543654657</span>
            </el-form-item>
          </el-col>
          <el-col :span='8' :xs='24'>
            <el-form-item label="店铺：">
              <span>nike</span>
            </el-form-item>
          </el-col>
          <el-col :span='8' :xs='24'>
            <el-form-item label="产品名称：">
              <span>水淀粉</span>
            </el-form-item>
          </el-col>
          <el-col :span='8' :xs='24'>
            <el-form-item label="产品价格：">
              <span>$100</span>
            </el-form-item>
          </el-col>
          <el-col :span='8' :xs='24'>
            <el-form-item label="评论数：">
              <span>2</span>
            </el-form-item>
          </el-col>
          <el-col :span='8' :xs='24'>
            <el-form-item label='产品评分：'>
              <el-rate v-model="taskViewForm.score" disabled show-score text-color="#ff9900" score-template="{value}"
                style='line-height: 2.8;'></el-rate>
            </el-form-item>
          </el-col>
          <el-col :span='8' :xs='24' class="fleft">
            <el-form-item label="品类排名：">
              <span>2</span>
            </el-form-item>
          </el-col>
          <el-col :span='8' :xs='24' class="fright">
            <el-form-item label="产品图片：">
              <img class="proImg"></img>
            </el-form-item>
          </el-col>
          <el-col :span="8" :xs="24" class="fleft">
            <el-form-item label="产品链接：" class="wid">
              <span>http://www.pre.com</span>
            </el-form-item>
          </el-col>
          <el-col :span="8" :xs="24" v-if="isFBA">
            <el-form-item label="预估月销量：">
              <span>2000</span>
            </el-form-item>
          </el-col>
          <el-col :span='8' :xs='24'>
            <el-form-item label="关键词类型：">
              <span>产地是</span>
            </el-form-item>
          </el-col>
          <el-col :span='8' :xs='24'>
            <el-form-item label="终端平台：">
              <span>PC</span>
            </el-form-item>
          </el-col>
          <el-col :span='8' :xs='24'>
            <el-form-item label="产品关键词：">
              <span>产地是</span>
            </el-form-item>
          </el-col>
          <el-col :span='8' :xs='24'>
            <el-form-item label="留评类型：">
              <span>100%</span>
            </el-form-item>
          </el-col>
          <el-col :span='8' :xs='24'>
            <el-form-item label="使用优惠券：">
              <span>否</span>
            </el-form-item>
          </el-col>
          <el-col :span='8' :xs='24'>
            <el-form-item label="买家账号：">
              <span>123@qq.com</span>
            </el-form-item>
          </el-col>
          <el-col :span="16" :xs="24" v-if="isFBA">
            <el-form-item label="是否自发货：">
              <span>是</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="border: 1px solid #eee;">
          <el-col :span="8" :xs="24">
            <el-form-item label=""><span class="ml80">任务开始日期</span></el-form-item>
          </el-col>
          <el-col :span="16" :xs="24">
            <el-form-item label=""><span class="ml80">任务开始时间</span></el-form-item>
          </el-col>
          <el-col :span="8" :xs="24">
            <el-form-item label="">
              <el-form-item label=""><span class="ml80">2019-09-09</span></el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="16" :xs="24">
            <el-form-item label="">
              <el-form-item label=""><span class="ml80">00:00-15:00</span></el-form-item>
            </el-form-item>
          </el-col>
        </el-row>
        <el-col :span='24' :xs="24">
          <el-form-item label="备注：">
            <span>$23.00</span>
          </el-form-item>
        </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="viewTaskDetailsModel = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!--点赞任务查看详情-->
    <el-dialog :title='orderTitle' :visible.sync="viewLikeTaskDetailsModel" :close-on-click-modal="false" width="60%">
      <el-form class="demo-item">
        <div class="fz16 mb20 modalTitle">订单信息</div>
        <el-row>
          <el-col :span='8' :xs='24'>
            <el-form-item label="平台：">
              <span>亚马逊</span>
            </el-form-item>
          </el-col>
          <el-col :span='8' :xs='24'>
            <el-form-item label="终端平台：">
              <span>erww</span>
            </el-form-item>
          </el-col>
          <el-col :span='8' :xs='24'>
            <el-form-item label="买家账号：">
              <span>123@qq.com</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="border: 1px solid #eee;">
          <el-col :span="8" :xs="24">
            <el-form-item label=""><span class="ml80">链接地址</span></el-form-item>
          </el-col>
          <el-col :span="16" :xs="24">
            <el-form-item label=""><span class="ml80">操作选项</span></el-form-item>
          </el-col>
          <el-col :span="8" :xs="24">
            <el-form-item label="">
              <el-form-item label=""><span class="ml80">http://www.baidu.com</span></el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="16" :xs="24">
            <el-form-item label="">
              <el-form-item label=""><span class="ml80">点赞</span></el-form-item>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot='footer' class="dialog-footer">
        <el-button @click='viewLikeTaskDetailsModel=false'>关闭</el-button>
      </div>
    </el-dialog>
    <!--QA查看任务详情-->
    <el-dialog :title='orderTitle' :visible.sync="viewQaTaskDetailsModel" width="60%" :close-on-click-modal="false">
      <el-form class="demo-item">
        <div class="fz16 modalTitle mb20">订单信息</div>
        <el-row>
          <el-col :span='8' :xs='24'>
            <el-form-item label="平台：">
              <span>雅典娜</span>
            </el-form-item>
          </el-col>
          <el-col :span='8' :xs='24'>
            <el-form-item label="终端平台：">
              <span>erww</span>
            </el-form-item>
          </el-col>
          <el-col :span='8' :xs='24'>
            <el-form-item label="买家账号：">
              <span>123@qq.com</span>
            </el-form-item>
          </el-col>
          <el-col :span='24' :xs='24'>
            <el-form-item label="类型：">
              <span>我要提问</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="txtCenter problem" style="padding:10px 0">
          <el-col :span="6" :xs="6">
            <span>国家</span>
          </el-col>
          <el-col :span="6" :xs="6">
            <span>产品ASIN</span>
          </el-col>
          <el-col :span="6" :xs="6">
            <span>问题</span>
          </el-col>
          <el-col :span="6" :xs="6">
            <span>执行时间</span>
          </el-col>
        </el-row>
        <el-row class="txtCenter mt20 mb20">
          <el-col :span='6' :xs="6">
            <span>美国</span>
          </el-col>
          <el-col :span='6' :xs="6">
            <span>CD145645613</span>
          </el-col>
          <el-col :span='6' :xs="6">
            <span>练习时长两年半？</span>
          </el-col>
          <el-col :span='6' :xs="6">
            <span>2019-09-09</span>
          </el-col>
        </el-row>
        <el-row class="txtCenter" style="padding:10px 0">
          <el-col :span="6" :xs="6">
            <span>国家</span>
          </el-col>
          <el-col :span="6" :xs="6">
            <span>问题链接</span>
          </el-col>
          <el-col :span="6" :xs="6">
            <span>回答</span>
          </el-col>
          <el-col :span="6" :xs="6">
            <span>时间</span>
          </el-col>
        </el-row>
        <el-row class="txtCenter mt20 mb20">
          <el-col :span='6' :xs="6">
            <span>美国</span>
          </el-col>
          <el-col :span='6' :xs="6">
            <span>https://www.prwew.com</span>
          </el-col>
          <el-col :span='6' :xs="6">
            <span>是的</span>
          </el-col>
          <el-col :span='6' :xs="6">
            <span>2019-09-12</span>
          </el-col>
        </el-row>
      </el-form>
      <div slot='footer' class='dialog-footer'>
        <el-button @click='viewQaTaskDetailsModel=false'>关闭</el-button>
      </div>
    </el-dialog>
    <!--评论链接-->
    <el-dialog :visible.sync="evaluateLinkModal" :title='title' :close-on-click-modal='false' class='link' width='60%'>
      <el-form :model='evaluateForm' label-width='150px'>
        <div class="fz16 mb20 modalTitle">任务信息</div>
        <el-row>
          <el-col :span="12" :xs="24">
            <el-form-item label="任务编码">
              <span>{{testForm.item}}</span>
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
        <div class="mb20 fz16 modelTitle">购买信息</div>
        <el-row>
          <el-col :span='24'>
            <el-form-item label='产品评价标题'>
              <span>32</span>
            </el-form-item>
          </el-col>
          <el-col :span='24'>
            <el-form-item label='产品评价图片'>
              <img class="proImg"></img>
            </el-form-item>
          </el-col>
          <el-col :span='24'>
            <el-form-item label='产品评价内容'>
              <span>33</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form :model='eveluateLinkForm' ref='eveluateLinkForm' :rules='editRules' label-width='150px' class='demo-item'>
        <el-form-item label='产品评价星级'>
          <el-rate v-model="eveluateLinkForm.starts" disabled show-score text-color="#ff9900" score-template="{value}"
            style='line-height: 2.8;'></el-rate>
        </el-form-item>
        <el-form-item label='产品评价链接' prop='proLink'>
          <el-input v-model='eveluateLinkForm.proLink' class='inpWid'></el-input>
        </el-form-item>
        <el-form-item label='产品评价截图'>
          <el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card" :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="eveluateLinkForm.screenshot" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label='备注'>
          <el-input type='textarea' v-model='eveluateLinkForm.remark' class='inpWid'></el-input>
        </el-form-item>
      </el-form>
      <div slot='footer' class='dialog-footer'>
        <el-button @click='evaluateLinkModal=false'>关闭</el-button>
      </div>
    </el-dialog>
    <!-- 上评-->
    <el-dialog title="温馨提示" :visible.sync="upCommentModel" :close-on-click-modal="false" center width="30%">
      <div class="del-dialog-cnt textCen">确认要上评吗？</div>
      <div class="del-dialog-cnt textCen mt30">
        <el-radio-group v-model="upCommentForm.radio">
          <el-radio :label="1">立即上评</el-radio>
          <el-radio :label="2">定时上评</el-radio>
        </el-radio-group>
        <span v-show="upCommentForm.radio==2" class="ml20">
          <el-date-picker v-model="upCommentForm.time" size="small" type="datetime" placeholder="选择上评时间" class="mb10"></el-date-picker>
        </span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary">确 定</el-button>
        <el-button @click="upCommentModel=false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import SupplementSheet from '../../common/SupplementSheet'
  import buyNum from '../../common/buyNum'
  import orderLog from '../../common/orderLog'
  export default {
    name: 'task',
    data() {
      return {
        feedShow: false, //feedback
        evaluateModal: false, //填写评价
        upCommentModel: false, //上评
        upCommentForm: {
          radio: 1,
          time: ''
        },
        proEvaluateForm: {
          FeedbackScore: 0,
          Feedback: ' ',
          score: 0,
          proTitle: '',
          proDes: ''
        },
        dialogVisible: false,
        evaluateForm: {},
        //评价链接
        eveluateLinkForm: {
          starts: 3.5,
          proLink: '',
          screenshot: '',
          remark: ''
        },
        testForm: {
          item: 'kyumin'
        },
        currentPage: 1,
        pageSize: '0',
        total: 100,
        radio: '',
        tipMessage: '',
        taskViewForm: {
          score: 4.5
        },
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
        evaluateLinkModal: false, //评价链接弹窗
        title: '',
        orderTitle: '',
        confirmBuyModel: false,
        accountSearchModel: false,
        viewTaskDetailsModel: false,
        viewQaTaskDetailsModel: false, //QA任务查看
        viewLikeTaskDetailsModel: false, //点赞任务查看
        isFBA: false, //是否为FBA订单
        confirmBuyForm: {
          buyTime: '',
          orderNo: '',
          proPrice: '',
          proFreight: '',
          allPrice: '',
          conversionDollar: ''
        },
        selected: {},
        times: '',
        disabled: true,  //单项禁用
        disabledMore: true, //多项禁用
        editPricceModel: false,
        checkBoxData: [],
        tableData: [{
            "Numbers": "20190605",
            "Picture": "留评",
            "CountryId": "美国",
            "Forum": "Amazon",
            "ProductByASIN": "999B",
            "ProductPrice": 15.99,
            "ServiceType": "不留评",
            "OrderNote": "王健林",
            "Status": "已完成",
            "OrderNumber": 131,
            "OrderTime": "2019-02-03 10:00:00",
            "Remark": ""
          },
          {
            "Numbers": "20190605",
            "Picture": "上图",
            "CountryId": "德国",
            "Forum": "Amazon",
            "ProductByASIN": "999B",
            "ProductPrice": 18.99,
            "ServiceType": "不留评",
            "OrderNote": "王健林",
            "Status": "已完成",
            "OrderNumber": 775,
            "OrderTime": "2019-04-02 03:00:00",
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
        platformOptions: [{
            value: '1',
            label: '全部'
          },
          {
            value: '2',
            label: 'Amazon'
          }
        ],
        orderTypeOptions: [{
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
        countryData: [{
            country: '美国'
          },
          {
            country: '加拿大'
          }
        ],
        searchForm: {
          platform: '1',
          countryId: '',
          orderTypeValue: '1',
          searchkeywords: ''
        },
        editPriceForm: {
          addServiceFree: '',
          totalPrice: '',
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
          }],
          buyTime: [{
            required: true,
            message: '请选择购买时间',
            trigger: 'blur'
          }],
          orderNo: [{
            required: true,
            message: '请输入订单单号',
            trigger: 'blur'
          }],
          proPrice: [{
            required: true,
            message: '请输入产品金额',
            trigger: 'blur'
          }],
          conversionDollar: [{
            required: true,
            message: '请输入换算成美元',
            trigger: 'blur'
          }],
          proLink: [{
            required: true,
            message: '请输入产品评价链接',
            trigger: 'blur'
          }],
          Feedback: [{
            required: true,
            message: '请输入Feedback',
            trigger: 'blur'
          }],
          proTitle: [{
            required: true,
            message: '请输入产品评论标题',
            trigger: 'blur'
          }],
          proDes: [{
            required: true,
            message: '请输入产品评论内容',
            trigger: 'blur'
          }],
          FeedbackScore: [{
            required: true,
            message: 'Feedback评分不能为空',
            trigger: 'blur'
          }],
          score: [{
            required: true,
            message: '产品评分不能为空',
            trigger: 'blur'
          }]
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
      orderLog
    },
    created() {
      // this.getAllData()
      this.getNowtime()
    },
    methods: {
      getNowtime() {
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        month = month < 10 ? "0" + month : month
        let day = date.getDate()
        day = day < 10 ? "0" + day : day
        let hour = date.getHours()
        hour = hour < 10 ? "0" + hour : hour
        let minute = date.getMinutes()
        minute = minute < 10 ? "0" + minute : minute
        let second = date.getSeconds()
        second = second < 10 ? "0" + second : second
        let nowtime = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second
        let _this = this
        _this.confirmBuyForm.buyTime = nowtime
      },

      //填写评价确定
      confirProEva(formName) {
        let _this = this
        let feed = _this.feedShow
        if (!feed) {
          _this.proEvaluateForm.Feedback = ' '
        }
        _this.$refs[formName].validate((valid) => {
          if (valid) {
            _this.evaluateModal = false
          }
        })
      },
      //填写评价
      evaluateEdit() {
        let _this = this
        _this.evaluateModal = true
        _this.title = '填写评价'
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.eveluateLinkForm.screenshot = file.url;
        this.dialogVisible = true;
      },
      //评价链接
      evaluateLink() {
        let _this = this
        _this.evaluateLinkModal = true
        _this.title = '填写评论信息'
      },
      showMessageFromChild(data) {
        console.log(data.CountryId)
      },
      // 日志弹窗
      logHandel() {
        let _this = this
        _this.logModel = true
      },
      // 系统配置
      systemConfig() {
        let _this = this
        _this.systemConfigModal = true
        let num = row.Numbers
        _this.buyNum = '系统配置'
      },
      // 确认购买
      confirmBuyHandel() {
        let _this = this
        _this.title = '填写购买信息'
        _this.confirmBuyModel = true
      },
      // 确认发货
      deliver() {
        let _this = this
        let status = _this.active
        if (status != 3) {
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
        if (status != 4) {
          _this.tipsModal = true
          _this.message = '批量确认收货任务状态必须为待收货,请重新选择'
        } else {
          _this.tipMessage = '确认要批量收货吗？'
          _this.confirmDeliveryModal = true
          _this.deliverShow = false
        }
      },

      // 上评
      upComment() {
        let _this = this
        _this.upCommentModel = true
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
        if (status != 2) {
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
        if (status != 8) {
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
        if (status != 2 && status != 7) {
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
        if (status != 2) {
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
      // 查看任务详情弹窗
      viewTaskDetails() {
        let _this = this
        _this.viewTaskDetailsModel = true
        let orderType = _this.searchForm.orderTypeValue
        if (orderType == "1") {
          _this.isFBA = true
        } else {
          _this.isFBA = false
        }
        let num = row.Numbers
        _this.orderTitle = '详情信息'
      },
      //点赞任务查看详情
      viewLikeTaskDetails() {
        let _this = this
        _this.viewLikeTaskDetailsModel = true
        let num = row.Numbers
        _this.orderTitle = '详情信息'
      },
      //QA任务查看详情
      viewQATaskDetails() {
        let _this = this
        _this.viewQaTaskDetailsModel = true
        let num = row.Numbers
        _this.orderTitle = '详情信息'
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
      //选中行
      rowClick(val) {
        let _this = this
        _this.$refs.table.clearSelection()
        _this.$refs.table.toggleRowSelection(val, true);
        _this.checkBoxData = val
      },
      // 是否有选中
      handleSelectionChange(val) {
        this.checkBoxData = val
        let checkNum = this.checkBoxData.length
        if (checkNum == 1) {
          this.disabled = false
          this.disabledMore = false
        }else if(checkNum>1){
          this.disabled = true
          this.disabledMore = false
        }else {
          this.disabled = true
          this.disabledMore = true
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
        _this.activeOn = 1
        _this.times = '收货时间'
        //				_this.orderPlaceData = []
      },
      //待退款
      refund() {
        let _this = this
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
      // 待处理
      dcl() {
        let _this = this
        _this.active = 9
        _this.times = '购买时间'
        //				_this.orderPlaceData = []
      },
      //已填评价
      Evaluated() {
        let _this = this
        _this.active = 51
      },
      //待填评价
      toEvaluated() {
        let _this = this
        _this.active = 52
      },
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
        var wb = XLSX.utils.table_to_book(document.querySelector('#exportTable'), xlsxParam)

        /* get binary string as output */
        var wbout = XLSX.write(wb, {
          bookType: 'xlsx',
          bookSST: true,
          type: 'array'
        })
        try {
          FileSaver.saveAs(new Blob([wbout], {
            type: 'application/octet-stream'
          }), '任务管理.xlsx')
        } catch (e) {
          if (typeof console !== 'undefined') {
            console.log(e, wbout)
          }
        }
        return wbout
      }
    }
  }
</script>

<style scoped>

</style>
