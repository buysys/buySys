<template>
  <div class="container">
    <div class="mb20 fz14">
      <span>首页</span>
      <span>/</span>
      <span>订单管理</span>
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
    <!-- FBA订单列表 -->
    <div v-if="searchForm.orderTypeValue=='1'">
      <div class="mb20">
        <el-button type="success" size="medium" :disabled="disabled" @click="editPrice"><i class="el-icon-edit-outline"></i>修改价格
        </el-button>
        <el-button type="warning" size="medium"><i class="el-icon-download"></i>导入</el-button>
        <el-button type="warning" size="medium" @click="exportExcel"><i class="el-icon-upload2"></i>导出</el-button>
      </div>
      <div class="tabList">
        <ul class="tabBlock">
          <li :class="active === 1 ? 'active':''" @click="getAllData()" :data-index="1">全部<span>({{allNum}})</span></li>
          <li :class="active === 2 ? 'active':''" :data-index="2" @click="daiBuy">待付款<span>(0)</span></li>
          <li :class="active === 3 ? 'active':''" :data-index="3" @click="daifh">待确认<span>(0)</span></li>
          <li :class="active === 4 ? 'active':''" :data-index="4" @click="daicl">待处理<span>(0)</span></li>
          <li :class="active === 7 ? 'active':''" :data-index="7" @click="ywc">已完成<span>(0)</span></li>
          <li :class="active === 8 ? 'active':''" :data-index="8" @click="errData">已取消<span>(0)</span></li>
        </ul>
      </div>
      <div class="mt10">
        <el-table :data="tableData" id="exportOrder" style="width: 100%" :header-cell-style="{background:'#fafafa'}"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="Numbers" label="任务编码" align="center" width="200">
            <template slot-scope="scope">
              <el-button type="text" @click="viewDetailsModelShow(scope.$index,scope.row)">{{scope.row.Numbers}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="CountryId" label="平台/国家" align="center"></el-table-column>
          <el-table-column prop="ProductByASIN" label="终端平台" align="center"></el-table-column>
          <el-table-column prop="ProductByASIN" label="产品ASIN" align="center"></el-table-column>
          <el-table-column prop="ProductPrice" label="产品价格" align="center" class-name="red"></el-table-column>
          <el-table-column prop="ServiceType" label="任务数" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="产品总额" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="服务费" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="合计金额" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="交易流水" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="付款金额" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="客户名称" align="center"></el-table-column>
          <el-table-column prop="OrderTime" label="下单时间" align="center"></el-table-column>
          <el-table-column prop="Status" label="订单状态" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="400">
            <template slot-scope="scope">
              <el-button size="small" type="success" @click="confirmPayHandel(scope.$index,scope.row)">确认付款</el-button>
              <el-button size="small" type="primary" @click="logHandel(scope.$index, scope.row)">查看日志</el-button>
              <el-button size="small" type="danger" @click="delModelShow">删除</el-button>
              <el-button size="small" type="warning" @click="accountShow">分配买号</el-button>
              <el-button size="small" type="success" @click="nextShow">继续</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="mt30">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 加购订单列表 -->
    <div v-if="searchForm.orderTypeValue=='2'">
      <div class="mb20">
        <el-button type="success" size="medium" :disabled="disabled" @click="editPrice"><i class="el-icon-edit-outline"></i>修改价格
        </el-button>
        <el-button type="warning" size="medium"><i class="el-icon-download"></i>导入</el-button>
        <el-button type="warning" size="medium" @click="exportExcel"><i class="el-icon-upload2"></i>导出</el-button>
      </div>
      <div class="tabList">
        <ul class="tabBlock">
          <li :class="active === 1 ? 'active':''" @click="getAllData()" :data-index="1">全部<span>({{allNum}})</span></li>
          <li :class="active === 2 ? 'active':''" :data-index="2" @click="daiBuy">待付款<span>(0)</span></li>
          <li :class="active === 3 ? 'active':''" :data-index="3" @click="daifh">待确认<span>(0)</span></li>
          <li :class="active === 4 ? 'active':''" :data-index="4" @click="daicl">待处理<span>(0)</span></li>
          <!-- <li :class="active === 5 ? 'active':''" :data-index="5" @click="daish">待分配<span>(0)</span></li> -->
          <!-- <li :class="active === 6 ? 'active':''" :data-index="6" @click="daipj">已分配<span>(0)</span></li> -->
          <li :class="active === 7 ? 'active':''" :data-index="7" @click="ywc">已完成<span>(0)</span></li>
          <li :class="active === 8 ? 'active':''" :data-index="8" @click="errData">已取消<span>(0)</span></li>
        </ul>
      </div>
      <div class="mt10">
        <el-table :data="tableData" style="width: 100%" :header-cell-style="{background:'#fafafa'}" @selection-change="handleSelectionChange">
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="Numbers" label="下单单号" align="center" width="200">
            <template slot-scope="scope">
              <el-button type="text" @click="viewDetailsModelShow(scope.$index,scope.row)">{{scope.row.Numbers}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="CountryId" label="平台/国家" align="center"></el-table-column>
          <el-table-column prop="ProductByASIN" label="终端平台" align="center"></el-table-column>
          <el-table-column prop="ProductByASIN" label="产品ASIN" align="center"></el-table-column>
          <el-table-column prop="ProductPrice" label="产品价格" align="center" class-name="red"></el-table-column>
          <el-table-column prop="ServiceType" label="任务数" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="产品总额" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="服务费" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="合计金额" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="交易流水" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="付款金额" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="客户编码" align="center"></el-table-column>
          <el-table-column prop="OrderTime" label="下单时间" align="center"></el-table-column>
          <el-table-column prop="Status" label="订单状态" align="center" width="100"></el-table-column>
          <el-table-column label="操作" align="center" width="300">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click="viewTask(scope.$index,scope.row)">查看任务</el-button>
              <el-button size="small" @click="cancelReason(scope.$index,scope.row)">取消原因</el-button>
              <el-button size="small" type="success" v-if="scope.row.Status==='待确认付款'" @click="confirmPayHandel(scope.$index,scope.row)">确认付款
              </el-button>
              <el-button size="small" type="warning" v-if="scope.row.Status ==='待确认付款'">分配买号</el-button>
              <el-button size="small" type="danger" v-if="scope.row.Status === '待确认付款'" @click="cancelHandel(scope.$index, scope.row)">取消
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 心愿订单列表 -->
    <div v-if="searchForm.orderTypeValue=='3'">
      <div class="mb20">
        <el-button type="success" size="medium" :disabled="disabled" @click="editPrice"><i class="el-icon-edit-outline"></i>修改价格
        </el-button>
        <el-button type="warning" size="medium"><i class="el-icon-download"></i>导入</el-button>
        <el-button type="warning" size="medium" @click="exportExcel"><i class="el-icon-upload2"></i>导出</el-button>
      </div>
      <div class="tabList">
        <ul class="tabBlock">
          <li :class="active === 1 ? 'active':''" @click="getAllData()" :data-index="1">全部<span>({{allNum}})</span></li>
          <li :class="active === 2 ? 'active':''" :data-index="2" @click="daiBuy">待付款<span>(0)</span></li>
          <li :class="active === 3 ? 'active':''" :data-index="3" @click="daifh">待确认<span>(0)</span></li>
          <li :class="active === 4 ? 'active':''" :data-index="4" @click="daicl">待处理<span>(0)</span></li>
          <!--<li :class="active === 5 ? 'active':''" :data-index="5" @click="daish">待分配<span>(0)</span></li>
      		<li :class="active === 6 ? 'active':''" :data-index="6" @click="daipj">已分配<span>(0)</span></li> -->
          <li :class="active === 7 ? 'active':''" :data-index="7" @click="ywc">已完成<span>(0)</span></li>
          <li :class="active === 8 ? 'active':''" :data-index="8" @click="errData">已取消<span>(0)</span></li>
        </ul>
      </div>
      <div class="mt10">
        <el-table :data="tableData" style="width: 100%" :header-cell-style="{background:'#fafafa'}" @selection-change="handleSelectionChange">
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="Numbers" label="下单单号" align="center" width="200">
            <template slot-scope="scope">
              <el-button type="text" @click="viewDetailsModelShow(scope.$index,scope.row)">{{scope.row.Numbers}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="CountryId" label="平台/国家" align="center"></el-table-column>
          <el-table-column prop="ProductByASIN" label="终端平台" align="center"></el-table-column>
          <el-table-column prop="ProductByASIN" label="产品ASIN" align="center"></el-table-column>
          <el-table-column prop="ProductPrice" label="产品价格" align="center" class-name="red"></el-table-column>
          <el-table-column prop="ServiceType" label="任务数" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="产品总额" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="服务费" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="合计金额" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="交易流水" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="付款金额" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="客户编码" align="center"></el-table-column>
          <el-table-column prop="OrderTime" label="下单时间" align="center"></el-table-column>
          <el-table-column prop="Status" label="订单状态" align="center" width="100"></el-table-column>
          <el-table-column label="操作" align="center" width="380">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click="viewTask(scope.$index,scope.row)">查看任务</el-button>
              <el-button size="small" @click="cancelReason(scope.$index,scope.row)">取消原因</el-button>
              <el-button size="small" type="success" v-if="scope.row.Status==='待确认付款'" @click="confirmPayHandel(scope.$index,scope.row)">确认付款
              </el-button>
              <el-button size="small" type="warning" v-if="scope.row.Status ==='待确认付款'">分配买号</el-button>
              <el-button size="small" type="danger" v-if="scope.row.Status === '待确认付款'" @click="cancelHandel(scope.$index, scope.row)">取消
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 点赞订单列表 -->
    <div v-if="searchForm.orderTypeValue=='4'">
      <div class="mb20">
        <el-button type="success" size="medium" :disabled="disabled" @click="editPrice"><i class="el-icon-edit-outline"></i>修改价格
        </el-button>
        <el-button type="warning" size="medium"><i class="el-icon-download"></i>导入</el-button>
        <el-button type="warning" size="medium" @click="exportExcel"><i class="el-icon-upload2"></i>导出</el-button>
      </div>
      <div class="tabList">
        <ul class="tabBlock">
          <li :class="active === 1 ? 'active':''" @click="getAllData()" :data-index="1">全部<span>({{allNum}})</span></li>
          <li :class="active === 2 ? 'active':''" :data-index="2" @click="daiBuy">待付款<span>(0)</span></li>
          <li :class="active === 3 ? 'active':''" :data-index="3" @click="daifh">待确认<span>(0)</span></li>
          <li :class="active === 4 ? 'active':''" :data-index="4" @click="daicl">待处理<span>(0)</span></li>
          <!--<li :class="active === 5 ? 'active':''" :data-index="5" @click="daish">待分配<span>(0)</span></li>
      		<li :class="active === 6 ? 'active':''" :data-index="6" @click="daipj">已分配<span>(0)</span></li> -->
          <li :class="active === 7 ? 'active':''" :data-index="7" @click="ywc">已完成<span>(0)</span></li>
          <li :class="active === 8 ? 'active':''" :data-index="8" @click="errData">已取消<span>(0)</span></li>
        </ul>
      </div>
      <div class="mt10">
        <el-table :data="tableData" style="width: 100%" :header-cell-style="{background:'#fafafa'}" @selection-change="handleSelectionChange">
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="Numbers" label="下单单号" align="center" width="200">
            <template slot-scope="scope">
              <el-button type="text" @click="viewDetailsModelShow(scope.$index,scope.row)">{{scope.row.Numbers}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="CountryId" label="平台/国家" align="center"></el-table-column>
          <el-table-column prop="ProductByASIN" label="终端平台" align="center"></el-table-column>
          <el-table-column prop="ProductByASIN" label="产品ASIN" align="center"></el-table-column>
          <el-table-column prop="ProductPrice" label="产品价格" align="center" class-name="red"></el-table-column>
          <el-table-column prop="ServiceType" label="任务数" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="产品总额" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="服务费" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="合计金额" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="交易流水" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="付款金额" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="客户编码" align="center"></el-table-column>
          <el-table-column prop="OrderTime" label="下单时间" align="center"></el-table-column>
          <el-table-column prop="Status" label="订单状态" align="center" width="100"></el-table-column>
          <el-table-column label="操作" align="center" width="300">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click="viewTask(scope.$index,scope.row)">查看任务</el-button>
              <el-button size="small" @click="cancelReason(scope.$index,scope.row)">取消原因</el-button>
              <el-button size="small" type="success" v-if="scope.row.Status==='待确认付款'" @click="confirmPayHandel(scope.$index,scope.row)">确认付款
              </el-button>
              <el-button size="small" type="warning" v-if="scope.row.Status ==='待确认付款'">分配买号</el-button>
              <el-button size="small" type="danger" v-if="scope.row.Status === '待确认付款'" @click="cancelHandel(scope.$index, scope.row)">取消
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- QA订单列表 -->
    <div v-if="searchForm.orderTypeValue=='5'">
      <div class="mb20">
        <el-button type="success" size="medium" :disabled="disabled" @click="editPrice"><i class="el-icon-edit-outline"></i>修改价格</el-button>
        <el-button type="warning" size="medium"><i class="el-icon-download"></i>导入</el-button>
        <el-button type="warning" size="medium" @click="exportExcel"><i class="el-icon-upload2"></i>导出</el-button>
      </div>
      <div class="tabList">
        <ul class="tabBlock">
          <li :class="active === 1 ? 'active':''" @click="getAllData()" :data-index="1">全部<span>({{allNum}})</span></li>
          <li :class="active === 2 ? 'active':''" :data-index="2" @click="daiBuy">待付款<span>(0)</span></li>
          <li :class="active === 3 ? 'active':''" :data-index="3" @click="daifh">待确认<span>(0)</span></li>
          <!--<li :class="active === 4 ? 'active':''" :data-index="4" @click="daicl">待处理<span>(0)</span></li>-->
          <!--<li :class="active === 5 ? 'active':''" :data-index="5" @click="daish">待分配<span>(0)</span></li>
      		<li :class="active === 6 ? 'active':''" :data-index="6" @click="daipj">已分配<span>(0)</span></li> -->
          <li :class="active === 7 ? 'active':''" :data-index="7" @click="ywc">已完成<span>(0)</span></li>
          <li :class="active === 8 ? 'active':''" :data-index="8" @click="errData">已取消<span>(0)</span></li>
        </ul>
      </div>
      <div class="mt10">
        <el-table :data="tableData" style="width: 100%" :header-cell-style="{background:'#fafafa'}" @selection-change="handleSelectionChange">
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="Numbers" label="下单单号" align="center" width="200">
            <template slot-scope="scope">
              <el-button type="text" @click="viewDetailsModelShow(scope.$index,scope.row)">{{scope.row.Numbers}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="CountryId" label="平台/国家" align="center"></el-table-column>
          <el-table-column prop="ProductByASIN" label="终端平台" align="center"></el-table-column>
          <el-table-column prop="ProductByASIN" label="产品ASIN" align="center"></el-table-column>
          <el-table-column prop="ProductPrice" label="产品价格" align="center" class-name="red"></el-table-column>
          <el-table-column prop="ServiceType" label="任务数" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="产品总额" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="服务费" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="合计金额" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="交易流水" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="付款金额" align="center"></el-table-column>
          <el-table-column prop="OrderNote" label="客户编码" align="center"></el-table-column>
          <el-table-column prop="OrderTime" label="下单时间" align="center"></el-table-column>
          <el-table-column prop="Status" label="订单状态" align="center" width="100"></el-table-column>
          <el-table-column label="操作" align="center" width="300">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click="viewTask(scope.$index,scope.row)">查看任务</el-button>
              <el-button size="small" @click="cancelReason(scope.$index,scope.row)">取消原因</el-button>
              <el-button size="small" type="success" v-if="scope.row.Status==='待确认付款'" @click="confirmPayHandel(scope.$index,scope.row)">确认付款</el-button>
              <el-button size="small" type="warning" v-if="scope.row.Status ==='待确认付款'">分配买号</el-button>
              <el-button size="small" type="danger" v-if="scope.row.Status === '待确认付款'" @click="cancelHandel(scope.$index, scope.row)">取消</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog title="修改价格" :visible.sync="editPricceModel" :close-on-click-modal="false" :before-close="closeModel">
      <el-form :model="editPriceForm" :rules="editRules" label-width="125px" status-icon>
        <el-form-item label="feedback服务费" prop="fbServiceFree">
          <el-input v-model="editPriceForm.fbServiceFree"></el-input>
        </el-form-item>
        <el-form-item label="cpc服务费" prop="cpcServiceFree">
          <el-input v-model="editPriceForm.cpcServiceFree"></el-input>
        </el-form-item>
        <el-form-item label="留评服务费" prop="lpServiceFree">
          <el-input v-model="editPriceForm.lpServiceFree"></el-input>
        </el-form-item>
        <el-form-item label="汇率" prop="exchangeRate">
          <el-input v-model="editPriceForm.exchangeRate"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="editPriceForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editPricceModel=false">确 定</el-button>
        <el-button @click="editPricceModel = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--日志-->
    <el-dialog title="订单日志" :visible.sync="logModel" custom-class="fixed-dialog">
      <OrderLog></OrderLog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="logModel = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!--分配买号-->
    <el-dialog title="分配买号" :visible.sync="accountModel" :close-on-click-modal="false" custom-class="fixed-dialog">
      <buyNum v-on:listenTochildEvent="showMessageFromChild"></buyNum>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmCountry=false">确 定</el-button>
        <el-button @click="accountModel = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 确认付款-->
    <el-dialog title="温馨提示" :visible.sync="confirmPaymentModel" :close-on-click-modal="false" center width="30%">
      <div class="del-dialog-cnt textCen">确认要修改该订单付款状态吗？</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium">是</el-button>
        <el-button @click="confirmPaymentModel=false" size="medium">否</el-button>
      </span>
    </el-dialog>
    <!--查看订单详情(FBA/加购/心愿订单)-->
    <el-dialog :title='title' :visible.sync="viewDetailsModel" custom-class="fixed-dialog">
      <el-form class="demo-item" :model='orderViewForm'>
        <div class="modalTitle mb20 fz16">订单信息</div>
        <el-row>
          <el-col :span='12' :xs='24'>
            <el-form-item label="平台：">
              <span>{{orderViewForm.Forum}}</span>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label="国家：">
              <span>{{orderViewForm.CountryId}}</span>
            </el-form-item>
          </el-col>
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
          <el-col :span='12' :xs='24'>
            <el-form-item label="评论数：">
              <span>2</span>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label='产品评分：'>
              <el-rate v-model="orderViewForm.score" disabled show-score text-color="#ff9900" score-template="{value}"
                style='line-height: 2.8;'></el-rate>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label="品类排名：">
              <span>2</span>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label="产品图片：">
              <img class="proImg"></img>
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24" class="fleft">
            <el-form-item label="产品链接：" class="wid">
              <span>http://www.pre.com</span>
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24" v-if="isFBA">
            <el-form-item label="预估月销量：">
              <span>2000</span>
            </el-form-item>
          </el-col>
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
          <el-col :span="12" :xs="24" v-if="isFBA">
            <el-form-item label="是否自发货：">
              <span>是</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="txtCenter" style="padding:10px 0">
          <el-col :span="8" :xs="8">
            <span>任务开始日期</span>
          </el-col>
          <el-col :span="8" :xs="8">
            <span>时间</span>
          </el-col>
          <el-col :span="8" :xs="8">
            <span>数量</span>
          </el-col>
        </el-row>
        <el-row class="txtCenter mt20 mb20">
          <el-col :span='8' :xs="8">
            <span>2019-07-02</span>
          </el-col>
          <el-col :span='8' :xs="8">
            <span>00:00-20:00</span>
          </el-col>
          <el-col :span='8' :xs="8">
            <span>2</span>
          </el-col>
        </el-row>
        <el-row :gutter='30'>
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
        <div class="modalTitle mb20 fz16">客户信息</div>
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
        <el-row>
          <div class="modalTitle mb20 fz16">付款信息</div>
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="viewDetailsModel = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!--查看订单详情(点赞订单)-->
    <el-dialog :title='title' :visible.sync="viewLikeDateilsModel" custom-class="fixed-dialog">
      <el-form class="demo-item">
        <div class="modalTitle mb20 fz16">订单信息</div>
        <el-row>
          <el-col :span='12' :xs='24'>
            <el-form-item label="平台：">
              <span>亚马逊</span>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label="终端平台：">
              <span>娃哈哈</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="txtCenter" style="padding:10px 0">
          <el-col :span="8" :xs="8">
            <span>链接地址</span>
          </el-col>
          <el-col :span="8" :xs="8">
            <span>操作</span>
          </el-col>
          <el-col :span="8" :xs="8">
            <span>数量</span>
          </el-col>
        </el-row>
        <el-row class="txtCenter mt20 mb20">
          <el-col :span='8' :xs="8">
            <span>https://www.pdfs.com</span>
          </el-col>
          <el-col :span='8' :xs="8">
            <span>点赞</span>
          </el-col>
          <el-col :span='8' :xs="8">
            <span>2</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='12' :xs='24'>
            <el-form-item label="服务费用：">
              <span>￥23</span>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="modalTitle mb20 fz16">客户信息</div>
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
          <el-col :span='24' :xs='24'>
            <el-form-item class="title" label="付款信息">
            </el-form-item>
          </el-col>
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="viewLikeDateilsModel = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!--查看订单详情(QA订单)-->
    <el-dialog :title='title' :visible.sync="viewQADateilsModel" custom-class="fixed-dialog">
      <el-form class="demo-item">
        <div class="modalTitle mb20 fz16">订单信息</div>
        <el-row>
          <el-col :span='12' :xs='24'>
            <el-form-item label="平台：">
              <span>亚马逊</span>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label="终端平台：">
              <span>娃哈哈</span>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
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
            <span>时间</span>
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
        <el-row :gutter="30">
          <el-col :span='12' :xs='24'>
            <el-form-item label="服务费用：">
              <span>￥23</span>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="modalTitle mb20 fz16">客户信息</div>
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
        <div class="modalTitle mb20 fz16">付款信息</div>
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="viewQADateilsModel = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 删除-->
    <el-dialog title="温馨提示" :visible.sync="delModel" :close-on-click-modal="false" center width="30%">
      <div class="del-dialog-cnt textCen">是否要删除该订单吗？</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium">是</el-button>
        <el-button @click="delModel=false" size="medium">否</el-button>
      </span>
    </el-dialog>
    <!--继续-->
    <el-dialog title="温馨提示" :visible.sync="nextModal" :close-on-click-modal="false" center width="30%">
      <div class="del-dialog-cnt textCen">是否要继续订单吗？</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium">是</el-button>
        <el-button @click="nextModal=false" size="medium">否</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'

  import OrderLog from '../../common/OrderLog'
  import buyNum from '../../common/buyNum'
  export default {
    name: 'orderPlacingManage',
    data() {
      return {
        currentPage: 1,
        pageSize: '0',
        total: 100,
        title: '',
        viewDetailsModel: false,
        viewLikeDateilsModel: false,
        viewQADateilsModel: false,
        confirmPaymentModel: false,
        cancelPaymentModel: false,
        loading: true,
        disabled: true,
        reasonModel: false,
        editPricceModel: false,
        logModel: false,
        delModel: false,
        accountModel: false, //分配买号
        nextModal: false, //继续
        FbaOrder: true,
        isFBA : false, //是否是FBA订单
        isQA: false, //是否是QA订单
        tableData: [{
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
          fbServiceFree: '',
          cpcServiceFree: '',
          lpServiceFree: '',
          exchangeRate: '',
          remark: ''
        },
        orderViewForm: {
          Forum: '',
          CountryId: '',
          score: 3.8
        },
        editRules: {
          fbServiceFree: [{
            required: true,
            message: '请输入feedback服务费',
            trigger: 'blur'
          }],
          cpcServiceFree: [{
            required: true,
            message: '请输cpc服务费',
            trigger: 'blur'
          }],
          lpServiceFree: [{
            required: true,
            message: '请输留评服务费',
            trigger: 'blur'
          }],
          exchangeRate: [{
            required: true,
            message: '请输入汇率',
            trigger: 'blur'
          }]
        },
        pickerEndDate: this.pickerOptionsEnd(),
        pickerStartDate: this.searchStartDate(),
        activeName: 'first',
        allNum: '0',
        active: '1'
      }
    },
    components: {
      OrderLog,
      buyNum
    },
    created() {
      // this.getAllData()
    },
    methods: {
      //继续
      nextShow() {
        let _this = this
        _this.nextModal = true
      },
      //分配买号选中
      showMessageFromChild(data) {
        console.log(data.CountryId)
      },
      //分配买号弹窗
      accountShow() {
        let _this = this
        _this.accountModel = true
      },
      //分配买号确定
      confirmCountry() {
        let _this = this
        _this.accountModel = false
      },
      // 查看订单详情弹窗
      viewDetailsModelShow(index, row) {
        let _this = this
        let orderType = _this.searchForm.orderTypeValue
        if (orderType == "1" || orderType == "2" || orderType == "3") {
          if(orderType == "1"){
            _this.isFBA = true
          }else{
            _this.isFBA = false
          }
          _this.viewDetailsModel = true
          _this.viewLikeDateilsModel = false
          _this.viewQADateilsModel = false
        }
        if (orderType == "4") {
          _this.viewDetailsModel = false
          _this.viewLikeDateilsModel = true
          _this.viewQADateilsModel = false
        }
        if (orderType == "5") {
          _this.viewDetailsModel = false
          _this.viewLikeDateilsModel = false
          _this.viewQADateilsModel = true
        }
        let item = _this.tableData[index]
        let num = item.Numbers
        _this.title = '订单：' + num + '的详情信息'
        _this.orderViewForm.Forum = item.Forum
        _this.orderViewForm.CountryId = item.CountryId
      },
      // 日志弹窗
      logHandel(index, row) {
        let _this = this
        _this.logModel = true
      },
      // 重置
      resetSearch() {
        let _this = this
        _this.searchForm = {
          platform: '全部',
          searchkeywords: '',
          orderStartTime: '',
          orderEndTime: '',
          countryId: ''
        }
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
          }), '虚拟信用卡管理.xlsx')
        } catch (e) {
          if (typeof console !== 'undefined') {
            console.log(e, wbout)
          }
        }
        return wbout
      },
      // 删除弹窗
      delModelShow(index, row) {
        let _this = this
        _this.delModel = true
      },
      // 确认付款弹窗
      confirmPayHandel(index, row) {
        let _this = this
        _this.confirmPaymentModel = true
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
        let checkNum = this.checkBoxData.length
        if (checkNum !== 1) {
          this.disabled = true
        } else {
          this.disabled = false
        }
      },
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
      // 待付款
      daiBuy() {
        let _this = this
        _this.active = 2
        _this.tableData = []
      },
      // 待确认
      daifh() {
        let _this = this
        _this.active = 3
        _this.tableData = []
      },
      // 待处理
      daicl() {
        let _this = this
        _this.active = 4
        _this.tableData = []
      },
      // 已完成
      ywc() {
        let _this = this
        _this.active = 7
        _this.tableData = []
      },
      // 已取消
      errData() {
        let _this = this
        _this.active = 8
        _this.tableData = []
      },
      // 下单开始时间
      searchStartDate() {
        return {
          disabledDate: time => {
            let endDateVal = this.searchForm.orderEndTime
            if (endDateVal) {
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
            if (beginDateVal) {
              return (
                time.getTime() <
                new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
              )
            }
          }
        }
      },
      //分页
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
  .red {
    color: #f00;
  }
</style>
