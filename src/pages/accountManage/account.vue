<template>
  <div class="container">
    <div class="mb20 fz14">
      <span>首页</span>
      <span>/</span>
      <span>账号管理</span>
    </div>
    <el-collapse-transition>
      <div class="searchBox mb20">
        <el-form ref="searchForm" :modal="searchForm" class="form-item" label-width="80px">
          <el-row>
            <el-col :span='4' :xs='24'>
              <el-form-item label="平台">
                <el-select v-model="searchForm.platform" placeholder="请选择平台" size="small">
                  <el-option v-for="item in platformData" :key="item.Id" :label="item.Platform" :value="item.Id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='4' :xs='24'>
              <el-form-item label="国家">
                <el-select v-model="searchForm.country" placeholder="请选择国家" size="small">
                  <el-option v-for="item in countryData" :key="item.Code" :label="item.Country" :value="item.Code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4" :xs="24">
              <el-form-item label="是否留评">
                <el-select v-model="searchForm.isComment" placeholder="请选择是否留评" size="small">
                  <el-option label="可留评" value="1" key="1"></el-option>
                  <el-option label="不可留评" value="2" key="2"></el-option>
                  <el-option label="系统判断" value="3" key="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='4' :xs='24'>
              <el-form-item label="信用卡">
                <el-select placeholder="请选择信用卡类型" v-model="searchForm.cardType" size="small">
                  <el-option label="实体卡" value="1" key="1"></el-option>
                  <el-option label="虚拟卡" value="2" key="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='4' :xs='24'>
              <el-form-item label="账号">
                <el-input v-model="searchForm.account" placeholder="请输入登录账号" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4" :xs="24">
              <el-form-item>
                <el-button type="primary" size="small" @click="getAllData">查询</el-button>
                <el-button size="small" @click="resetSearch">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show="searchShow">
            <el-col :span='20' :xs='24'>
              <el-form-item label="标签">
                <div style="border: 1px solid #DCDFE6;padding-left: 10px;background: #fff;">
                  <el-collapse-transition>
                    <el-checkbox-group v-model="searchForm.tag">
                      <el-checkbox v-for="item in tagData" :key="item.TagId" :label="item.TagId">{{item.TagName}}</el-checkbox>
                    </el-checkbox-group>
                  </el-collapse-transition>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-collapse-transition>
    <div class="mb20">
      <el-button type="success" size="small" @click="addModalShow"><i class="el-icon-plus"></i> 新增</el-button>
      <el-button type="primary" size="small" :disabled="disabled" @click="editModalShow"><i class="el-icon-edit-outline"></i>
        修改</el-button>
      <el-button type="danger" size="small" :disabled="disabledMore" @click="delData"><i class="el-icon-delete"></i>
        删除</el-button>
      <el-button type="success" size="small" @click="buyTagModalShow"><i class="el-icon-s-tools"></i> 买号标签管理</el-button>
      <el-button type="warning" size="small" @click="drModalShow"><i class="el-icon-download"></i> 导入</el-button>
      <el-button type="warning" size="small" @click="exportExcel"><i class="el-icon-upload2"></i> 导出</el-button>
      <el-button size="small" @click="searchShow=!searchShow"><i class="el-icon-search"></i> 展开标签检索</el-button>
    </div>
    <div class="tabList">
      <ul class="tabBlock">
        <li :class="active === 0 ? 'active':''" :data-index="0" @click="sumCount">
          全部<span>（{{Number(sumData.TotalValid+sumData.TotalInValid+sumData.TotalLimit+sumData.TotalStopped)}}）</span>
        </li>
        <li :class="active === 1 ? 'active':''" :data-index="1" @click="validCount">正常<span>（{{sumData.TotalValid}}）</span></li>
        <li :class="active === 2 ? 'active':''" :data-index="2" @click="inValidCount">失效<span>（{{sumData.TotalInValid}}）</span></li>
        <li :class="active === 3 ? 'active':''" :data-index="3" @click="limitCount">限评<span>（{{sumData.TotalLimit}}）</span></li>
        <li :class="active === 4 ? 'active':''" :data-index="4" @click="stoppedCount">封号<span>（{{sumData.TotalStopped}}）</span></li>
      </ul>
    </div>
    <div class="mt10">
      <el-table v-loading="loading" element-loading-text="拼命加载中" border :data="tableData" id="exportTable" style="width: 100%"
        :header-cell-style="{background:'#fafafa'}" @selection-change="handleSelectionChange" @row-click="rowClick" ref="table">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
        <el-table-column prop="BAcountId" label="登录账号" align="center" width="180">
          <template slot-scope="scope">
            <el-button type="text" @click="viewModalShow(scope.$index,scope.row)">{{scope.row.BAcountId}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="Platform" label="平台" align="center"></el-table-column>
        <el-table-column prop="Country" label="国家" align="center"></el-table-column>
        <el-table-column prop="SignupDate" label="注册时间" align="center" width="180"></el-table-column>
        <el-table-column prop="ProductPrice" label="任务总数" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="taskListModelShow(scope.$index,scope.row)">{{scope.row.ProductPrice}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="" label="留评数" align="center"></el-table-column>
        <el-table-column prop="isComment" label="是否留评" align="center" :formatter="toTxt1"></el-table-column>
        <el-table-column prop="Status" label="状态" align="center" :formatter="toTxt2"></el-table-column>
        <el-table-column prop="" label="累积消费" align="center"></el-table-column>
        <el-table-column prop="" label="关联刷手" align="center"></el-table-column>
        <el-table-column prop="" label="上周排名" align="center"></el-table-column>
        <el-table-column prop="" label="本周排名" align="center"></el-table-column>
        <el-table-column prop="" label="排名涨幅" align="center"></el-table-column>
      </el-table>
      <div class="table-foot">
        <div>
          <el-button type="success" size="small" :disabled="disabledMore" @click="editTag">修改标签</el-button>
          <el-button type="primary" size="small" :disabled="disabledMore" @click="editStatus">修改状态</el-button>
          <el-button type="danger" size="small" :disabled="disabled" @click="bindBrush">关联刷手</el-button>
          <el-button type="warning" size='small' :disabled="disabled" @click="remark">编辑备注</el-button>
          <el-button type="primary" size="small" :disabled="disabled">打开浏览器</el-button>
          <el-button type="danger" size="small" :disabled="disabled" @click="configModalShow">系统配置</el-button>
        </div>
        <div>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 新增/修改-->
    <el-dialog :title="title" :visible.sync="editModal" :close-on-click-modal="false" :before-close="closeModal"
      custom-class="fixed-dialog" width="70%">
      <el-form :model="editForm" ref="editForm" :rules='Rules' label-width='130px' status-icon>
        <div class="modalTitle mb20 fz16">账号信息</div>
        <el-row>
          <el-col :span='12' :xs='24'>
            <el-form-item label="平台" prop="PlatformId">
              <el-select v-model="editForm.PlatformId" placeholder="请选择平台" style="width: 100%;">
                <el-option v-for="item in platformData" :key="item.Id" :label="item.Platform" :value="item.Id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label="国家" prop="CountryCode">
              <el-select v-model="editForm.CountryCode" placeholder="请选择国家" style="width: 100%;">
                <el-option v-for="item in countryData" :key="item.Code" :label="item.Country" :value="item.Code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label="默认网址" prop="DefaultURL">
              <el-input v-model="editForm.DefaultURL" placeholder='请输入默认网址'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label="是否留评" prop="isComment">
              <el-radio-group v-model="editForm.isComment">
                <el-radio :label="1">可留评</el-radio>
                <el-radio :label="2">不可留评</el-radio>
                <el-radio :label="3">系统判断</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label="登录账号" prop="LoginAccount">
              <el-input v-model="editForm.LoginAccount" placeholder='请输入登录账号'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label="登录密码" prop="LoginPass">
              <el-input v-model="editForm.LoginPass" placeholder='请输入登录密码'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label="账号邮箱" prop="Email">
              <el-input v-model="editForm.Email" placeholder='请输入账号邮箱'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label="账号邮箱密码" prop="EmailPass">
              <el-input v-model="editForm.EmailPass" placeholder='请输入账号邮箱密码'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label="辅助邮箱" prop="SndEmail">
              <el-input v-model="editForm.SndEmail" placeholder='请输入辅助账号邮箱'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label="辅助邮箱密码" prop="SndEmailPass">
              <el-input v-model="editForm.SndEmailPass" placeholder='请输入辅助账号邮箱密码'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label="学生邮箱" prop="StudentEmail">
              <el-input v-model="editForm.StudentEmail" placeholder='请输入学生邮箱'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label="学生邮箱密码" prop="StudentEmailPass">
              <el-input v-model="editForm.StudentEmailPass" placeholder='请输入学生邮箱密码'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label="FBA会员到期" prop="FBAExpire">
              <el-date-picker v-model="editForm.FBAExpire" type="date" placeholder="选择到期时间" value-format="yyyy-MM-dd"
                style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label="学生会员到期" prop="StudentExpire">
              <el-date-picker v-model="editForm.StudentExpire" type="date" placeholder="选择到期时间" value-format="yyyy-MM-dd"
                style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label="注册时间" prop="SignupDate">
              <el-date-picker v-model="editForm.SignupDate" type="date" placeholder="选择注册时间" value-format="yyyy-MM-dd"
                style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span='24' :xs='24'>
            <el-form-item label="标签" prop="TagIds">
              <el-checkbox-group v-model="editForm.TagIds">
                <el-checkbox v-for="item in tagData" :key="item.TagId" :label="item.TagId">{{item.TagName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-for="(item,index) in editForm.Address" :key="index">
          <div class="modalTitle mb20 fz16">收货地址 {{index+1}}</div>
          <el-row>
            <el-col :span='24' :xs='24' v-show="false">
              <el-form-item label="排序" prop="AddressName">
                <el-input v-model="item.Sequence=index+1"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='12' :xs='24'>
              <el-form-item label="姓名" prop="AddressName">
                <el-input v-model="item.AddressName" placeholder='请输入姓名'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='12' :xs='24'>
              <el-form-item label="电话" prop="PhoneNumber">
                <el-input v-model="item.PhoneNumber" placeholder='请输入电话'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='12' :xs='24'>
              <el-form-item label="国家">
                <el-select v-model="item.CountryCode" placeholder="请选择国家" style="width: 100%;">
                  <el-option v-for="item in countryData" :key="item.Code" :label="item.Country" :value="item.Code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='12' :xs='24'>
              <el-form-item label="省/州" prop="State">
                <el-input v-model="item.State" placeholder='请输入省/州'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='12' :xs='24'>
              <el-form-item label="城市" prop="City">
                <el-input v-model="item.City" placeholder='请输入城市'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='12' :xs='24'>
              <el-form-item label="邮编" prop="PostCode">
                <el-input v-model="item.PostCode" placeholder='请输入邮编'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='12' :xs='24'>
              <el-form-item label="详细地址" prop="Address">
                <el-input v-model="item.Address" placeholder='请输入详细地址'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='12' :xs='24'>
              <el-form-item>
                <el-button type="danger" @click="removeAddress(item)" size="medium"><i class="el-icon-circle-close"></i>
                  删除该条收货地址</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <p style="margin-left: 130px;" class="mb20">
          <el-button type="success" size="medium" @click="addAddress"><i class="el-icon-circle-plus-outline"></i>
            新增一条收货地址</el-button>
        </p>
        <div class="modalTitle mb20 fz16">付款信息</div>
        <el-row>
          <el-col :span='12' :xs='24'>
            <el-form-item label="信用卡类型">
              <el-select v-model="editForm.CardType" placeholder="请选择信用卡类型" style="width: 100%;">
                <el-option label="实体信用卡" :value="1" :key="1"></el-option>
                <el-option label="虚拟信用卡" :value="2" :key="2" disabled></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="editForm.CardType=='1'">
          <el-col :span='12' :xs='24'>
            <el-form-item label="实体信用卡">
              <el-input type="text" v-model="selectCardViewText" readonly placeholder='请选择实体信用卡' suffix-icon="el-icon-search"
                @focus='selectEntityCard'></el-input>
              <el-input type="text" v-model="editForm.CardId" v-show="false"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="editForm.CardType=='2'">
          <el-col :span='12' :xs='24'>
            <el-form-item label="虚拟卡主卡">
              <el-input type="text" disabled v-model="editForm.vertuaMainCard" placeholder='请选择虚拟信用卡主卡'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label="虚拟信用卡">
              <el-input type="text" disabled v-model="editForm.vertuaCard" placeholder='请选择虚拟信用卡'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="modalTitle mb20 fz16">其他信息</div>
        <el-row>
          <el-col :span='12' :xs='24'>
            <el-form-item label="注册IP" prop="IP">
              <el-input type="text" v-model="editForm.IP" placeholder='请输入注册IP'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='24' :xs='24'>
            <el-form-item label="备注" prop="Memo">
              <el-input type="textarea" v-model="editForm.Memo" placeholder='请输入备注'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSubmit" v-show="doType=='add'">确 定</el-button>
        <el-button type="primary" @click="editSubmit" v-show="doType=='edit'">确 定</el-button>
        <el-button @click="closeModal">取 消</el-button>
      </div>
    </el-dialog>

    <!--查看-->
    <el-dialog :title="title" :visible.sync="viewModal" custom-class="fixed-dialog" width="70%">
      <el-form :model="editForm" ref="editForm" label-width='130px' status-icon>
        <div class="modalTitle mb20 fz16">账号信息</div>
        <el-row>
          <el-col :span='12' :xs='24'>
            <el-form-item label="平台：">
              <span>{{toPlatformTxt(editForm.PlatformId)}}</span>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label="国家：">
              <span>{{toCountryTxt(editForm.CountryCode)}}</span>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label="默认网址：">
              <span>{{editForm.DefaultURL}}</span>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label="是否留评：">
              <span v-show="editForm.isComment==1">可留评</span>
              <span v-show="editForm.isComment==2">不可留评</span>
              <span v-show="editForm.isComment==3">系统判断</span>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label="登录账号：">
              <span>{{editForm.LoginAccount}}</span>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label="登录密码：">
              <span>{{editForm.LoginPass}}</span>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label="账号邮箱：">
              <span>{{editForm.Email}}</span>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label="账号邮箱密码：">
              <span>{{editForm.EmailPass}}</span>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label="辅助邮箱：">
              <span>{{editForm.SndEmail}}</span>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label="辅助邮箱密码：">
              <span>{{editForm.SndEmailPass}}</span>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label="学生邮箱：">
              <span>{{editForm.StudentEmail}}</span>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label="学生邮箱密码：">
              <span>{{editForm.StudentEmailPass}}</span>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label="FBA会员到期：">
              <span>{{editForm.FBAExpire}}</span>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label="学生会员到期：">
              <span>{{editForm.StudentExpire}}</span>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label="注册时间：">
              <span>{{editForm.SignupDate}}</span>
            </el-form-item>
          </el-col>
          <el-col :span='24' :xs='24'>
            <el-form-item label="标签：">
              <span v-for="item in TagViewData" class="mr30">{{item.TagName}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-for="(item,index) in editForm.Address" :key="index">
          <div class="modalTitle mb20 fz16">收货地址 {{index+1}}</div>
          <el-row>
            <el-col :span='12' :xs='24'>
              <el-form-item label="姓名：">
                <span>{{item.AddressName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span='12' :xs='24'>
              <el-form-item label="电话：">
                <span>{{item.PhoneNumber}}</span>
              </el-form-item>
            </el-col>
            <el-col :span='12' :xs='24'>
              <el-form-item label="国家：">
                <span>{{toCountryTxt(item.CountryCode)}}</span>
              </el-form-item>
            </el-col>
            <el-col :span='12' :xs='24'>
              <el-form-item label="省/州：">
                <span>{{item.State}}</span>
              </el-form-item>
            </el-col>
            <el-col :span='12' :xs='24'>
              <el-form-item label="城市：">
                <span>{{item.City}}</span>
              </el-form-item>
            </el-col>
            <el-col :span='12' :xs='24'>
              <el-form-item label="邮编：">
                <span>{{item.PostCode}}</span>
              </el-form-item>
            </el-col>
            <el-col :span='12' :xs='24'>
              <el-form-item label="详细地址：">
                <span>{{item.Address}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="modalTitle mb20 fz16">付款信息</div>
        <el-row>
          <el-col :span='12' :xs='24'>
            <el-form-item label="信用卡类型：">
              <span v-show="editForm.CardType==1">实体信用卡</span>
              <span v-show="editForm.CardType==2">虚拟信用卡</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="editForm.CardType=='1'">
          <el-col :span='12' :xs='24'>
            <el-form-item label="实体信用卡：">
              <span>{{selectCardViewText}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="modalTitle mb20 fz16">其他信息</div>
        <el-row>
          <el-col :span='12' :xs='24'>
            <el-form-item label="注册IP：">
              <span>{{editForm.IP}}</span>
            </el-form-item>
          </el-col>
          <el-col :span='24' :xs='24'>
            <el-form-item label="备注：">
              <span>{{editForm.Memo}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="viewModal=false">关 闭</el-button>
      </div>
    </el-dialog>

    <!--选择信用卡-->
    <el-dialog title="选择信用卡" :visible.sync="selectCardModal" :close-on-click-modal="false" :before-close="closeModal2">
      <el-collapse-transition>
        <div class="searchBox mb20">
          <el-form :model="searchForm2" ref="searchForm2" class="form-item" :inline='true' label-width="60px">
            <el-form-item label="卡号">
              <el-input v-model="searchForm2.cardNo" placeholder="请输入卡号" size="small"></el-input>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="searchForm2.cardName" placeholder="请输入姓名" size="small"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="getEntityCardData" class="ml20">查询</el-button>
              <el-button size="small" @click="resetSearch2">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-transition>
      <el-table border :data="cardData" style="width: 100%" :header-cell-style="{background:'#fafafa'}"
        @selection-change="handleSelectionChange2" @row-click="rowClick2" ref="table2">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
        <el-table-column prop="CardNumber" label="卡号" align="center"></el-table-column>
        <el-table-column prop="AountName" label="姓名" align="center"></el-table-column>
        <el-table-column prop="Name" label="卡名" align="center"></el-table-column>
        <el-table-column prop="Quota" label="剩余额度($)" align="center"></el-table-column>
        <el-table-column prop="TotalUsed" label="累积使用($)" align="center"></el-table-column>
      </el-table>
      <div class="table-foot">
        <div></div>
        <div>
          <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page="currentPage2"
            :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total2">
          </el-pagination>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="disabledCard" @click="selectCardOK">确 定</el-button>
        <el-button @click="closeModal2">取 消</el-button>
      </div>
    </el-dialog>

    <!--买号标签管理-->
    <el-dialog :title="title" :visible.sync="buyTagModal" :close-on-click-modal="false">
      <buyTag></buyTag>
      <div slot="footer" class="dialog-footer">
        <el-button @click="buyTagModal=false">关 闭</el-button>
      </div>
    </el-dialog>

    <!--修改标签-->
    <el-dialog :title="title" :visible.sync="editTagModal" :close-on-click-modal="false" :before-close="closeModal4">
      <el-form :model="editTagForm">
        <el-checkbox-group v-model="editTagForm.tag">
          <el-checkbox v-for="item in tagData" :key="item.TagId" :label="item.TagId">{{item.TagName}}</el-checkbox>
        </el-checkbox-group>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editTagOk">确 定</el-button>
        <el-button @click="closeModal4">取 消</el-button>
      </div>
    </el-dialog>

    <!--修改状态-->
    <el-dialog title="修改状态" :visible.sync="editStatusModal" :close-on-click-modal="false" width="30%" :before-close="closeModal5">
      <el-form :model='editStatusForm' class="txtCenter">
        <el-radio-group v-model="editStatusForm.status">
          <el-radio v-for="item in statusData" :label="item.Value" :key="item.Value">{{item.Display}}</el-radio>
        </el-radio-group>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editStatusOk">确 定</el-button>
        <el-button @click="closeModal5">取 消</el-button>
      </div>
    </el-dialog>

    <!--关联刷手-->
    <el-dialog :title="title" :visible.sync="bindBrushModal" :close-on-click-modal="false" :before-close="closeModal3">
      <el-table border :data="brushData" style="width: 100%" :header-cell-style="{background:'#fafafa'}"
        @selection-change="handleSelectionChange3" @row-click="rowClick3" ref="table3">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
        <el-table-column prop="Name" label="姓名" align="center"></el-table-column>
        <el-table-column prop="Mobile" label="手机" align="center"></el-table-column>
        <el-table-column prop="Email" label="邮箱" align="center"></el-table-column>
        <el-table-column prop="" label="未完成" align="center"></el-table-column>
        <el-table-column prop="" label="已完成" align="center"></el-table-column>
        <el-table-column prop="" label="总计" align="center"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="disabledBrush" @click="bindBrushOK">确 定</el-button>
        <el-button @click="closeModal3">取 消</el-button>
      </div>
    </el-dialog>

    <!--系统配置-->
    <el-dialog :title='title' :visible.sync='configModal' custom-class="fixed-dialog">
      <sysConfig></sysConfig>
      <div slot="footer" class="dialog-footer">
        <el-button @click="configModal=false">关闭</el-button>
      </div>
    </el-dialog>

    <!-- 任务总数 -->
    <el-dialog title='任务信息' :visible.sync="taskModal" custom-class="fixed-dialog">
      <el-collapse-transition>
        <div class="searchBox mb20">
          <el-form ref="searchForm" :modal="searchForm" class="form-item" label-width="80px">
            <el-row>
              <el-col :xs="24" :span="8">
                <el-form-item label="搜索内容">
                  <el-input v-model="searchForm.searchkeywords" placeholder="请输入提任务编码/任务备注/产品名称" class="disInline"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :span="4">
                <el-form-item label="任务状态">
                  <template>
                    <el-select placeholder="请选择"></el-select>
                  </template>
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
      <div class="mt10">
        <el-table :data="tableData" id="exportTable" style="width: 100%" :header-cell-style="{background:'#fafafa'}"
          @selection-change="handleSelectionChange" @row-click="rowClick" ref="table">
          <el-table-column prop="Numbers" label="任务编号" align="center" width="180"></el-table-column>
          <el-table-column prop="ProductByASIN" label="平台/国家" align="center"></el-table-column>
          <el-table-column prop="CountryId" label="产品ASIN" align="center"></el-table-column>
          <el-table-column prop="CountryId" label="产品名称" align="center"></el-table-column>
          <el-table-column prop="OrderNumber" label="产品价格" align="center"></el-table-column>
          <el-table-column prop="OrderNumber" label="订单备注" align="center"></el-table-column>
          <el-table-column prop="OrderNumber" label="买号" align="center"></el-table-column>
          <el-table-column prop="OrderNumber" label="刷手" align="center"></el-table-column>
          <el-table-column prop="CountryId" label="任务开始时间" align="center"></el-table-column>
          <el-table-column prop="ProductPrice" label="任务状态" align="center"></el-table-column>
          <el-table-column prop="ProductPrice" label="备注" align="center"></el-table-column>
        </el-table>
        <div class="mt30">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
            :page-sizes="[100, 200, 300, 500]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="taskModal = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'

  import buyTag from './buyTag'
  import sysConfig from './sysConfig'

  export default {
    name: 'account',
    data() {
      return {
        searchShow: false,
        title: '',
        currentPage: 1,
        pageSize: 10,
        total: 0,
        doType: '', //操作类型
        editModal: false, //新增修改
        viewModal: false, //查看
        drModal: false, //导入
        disabled: true, //单项禁用
        disabledMore: true, //多项禁用
        loading: true,
        tableData: [],
        checkBoxData: [], //选中数据
        sumData: [], //分类条数统计数据
        platformData: [], //平台数据
        countryData: [], //国家数据
        tagData: [], //标签数据
        buyTagModal: false, //买号标签管理
        selectCardModal: false, //选择信用卡弹窗
        disabledCard: true, //单项信用卡选定按钮禁用
        disabledMoreCard: true, //多项信用卡选定按钮禁用
        currentPage2: 1,
        pageSize2: 10,
        total2: 0,
        cardData: [], //信用卡数据
        checkBoxCardData: [], //选中信用卡数据
        statusData: [], //状态数据
        editTagModal: false, //修改标签弹窗
        editStatusModal: false, //修改状态弹窗
        bindBrushModal: false, //关联刷手弹窗
        brushData: [], //刷手数据
        checkBoxBrushData: [], //选中刷手数据
        disabledBrush: true, //单项刷手选定按钮禁用
        disabledMoreBrush: true, //多项刷手选定按钮禁用
        configModal: false, //系统配置弹窗
        taskModal: false, //任务总数弹窗
        selectCardViewText: '', //选中信用卡后输入框显示的文字
        TagViewData: [], //查看页面标签数据
        active: 0,
        editForm: {
          PlatformId: '',
          CountryCode: '',
          DefaultURL: '',
          isComment: '',
          LoginAccount: '',
          LoginPass: '',
          Email: '',
          EmailPass: '',
          SndEmail: '',
          SndEmailPass: '',
          StudentEmail: '',
          StudentEmailPass: '',
          SignupDate: '',
          FBAExpire: '',
          StudentExpire: '',
          CardType: 1,
          CardId: '', //实体信用卡号
          IP: '',
          Memo: '',
          TagIds: [],
          Address: [{
            AddressName: '',
            PhoneNumber: '',
            CountryCode: '',
            State: '',
            City: '',
            PostCode: '',
            Address: '',
            Sequence: ''
          }]
        },
        searchForm: {
          platform: '',
          country: '',
          isComment: '',
          cardType: '',
          account: '',
          tag: [],
          status: 0
        },
        searchForm2: {
          cardNo: '',
          cardName: ''
        },
        editTagForm: {
          tag: []
        },
        editStatusForm: {
          status: ''
        },
        Rules: {
          PlatformId: [{
            required: true,
            message: '请选择平台',
            trigger: 'blur'
          }],
          CountryCode: [{
            required: true,
            message: '请选择国家',
            trigger: 'blur'
          }],
          LoginAccount: [{
            required: true,
            message: '请输入登录账号',
            trigger: 'blur'
          }],
          LoginPass: [{
            required: true,
            message: '请输入登录密码',
            trigger: 'blur'
          }],
          isComment: [{
            required: true,
            message: '请选择是否留评',
            trigger: 'change'
          }]
        }
      }
    },
    components: {
      sysConfig,
      buyTag
    },
    created() {
      this.getAllData()
      this.getNewInData()
    },
    methods: {
      //是否留评数字转文字
      toTxt1(val) {
        if (val.isComment == "1") {
          return '可留评'
        } else if (val.isComment == "2") {
          return '不可留评'
        } else if (val.isComment == "3") {
          return '系统判断'
        } else {
          return '未知'
        }
      },
      //状态数字转文字
      toTxt2(val) {
        let _this = this
        let arr = _this.statusData.filter(item => item.Value == val.Status)
        if (arr.length > 0) {
          return arr[0].Display
        } else {
          return '未知'
        }
      },

      //平台转文字（查看页面）
      toPlatformTxt(val) {
        let _this = this
        let arr = _this.platformData.filter(item => item.Id == val)
        if (arr.length > 0) {
          return arr[0].Platform
        } else {
          return '未知'
        }
      },

      //国家转文字（查看页面）
      toCountryTxt(val) {
        let _this = this
        let arr = _this.countryData.filter(item => item.Code == val)
        if (arr.length > 0) {
          return arr[0].Country
        } else {
          return '未知'
        }
      },

      //获取数据
      getAllData() {
        let _this = this
        let param = {
          SessionId: sessionStorage.getItem('sessionid'),
          PlatformId: Number(_this.searchForm.platform),
          CountryCode: _this.searchForm.country,
          isComment: Number(_this.searchForm.isComment),
          CardType: Number(_this.searchForm.cardType),
          SearchTerm: _this.searchForm.account,
          Tags: _this.searchForm.tag,
          Status: _this.searchForm.status,
          Page: _this.currentPage,
          OffSet: _this.pageSize
        }
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBBuyerAccountsList', param).then((res) => {
          if (res.data.status == 400) {
            _this.$alert(res.data.message, '信息提示', {
              confirmButtonText: '确定',
              callback: action => {
                _this.$router.push({
                  path: '/login'
                })
              }
            })
          } else {
            _this.tableData = res.data.data.BuyerAccountList
            _this.total = res.data.data.TotalRecords
            _this.statusData = res.data.data.StatusList
            _this.sumData = res.data.data.SumByStatus
            _this.loading = false
          }
        }).catch((error) => {
          console.log(error)
        })
      },

      //进入查询新增修改页时获取所需数据
      getNewInData() {
        let _this = this
        let param = {
          SessionId: sessionStorage.getItem('sessionid'),
        }
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBBuyerAccountNewIn', param).then((res) => {
          _this.platformData = res.data.data.PlatformList //平台 Id,Platform
          _this.countryData = res.data.data.CountryList //国家 Code,Country
          _this.tagData = res.data.data.TagList //标签 TagId,TagName
        }).catch((error) => {
          console.log(error)
        })
      },

      //新增一行收货地址地址
      addAddress() {
        let _this = this
        _this.editForm.Address.push({
          AddressName: '',
          PhoneNumber: '',
          CountryCode: '',
          State: '',
          City: '',
          PostCode: '',
          Address: '',
          Sequence: ''
        })
      },

      //删除一行收货地址
      removeAddress(item) {
        let _this = this
        let index = this.editForm.Address.indexOf(item)
        if (index !== -1) {
          _this.editForm.Address.splice(index, 1)
        }
      },

      // 新增弹框
      addModalShow() {
        let _this = this
        _this.editModal = true
        _this.title = '账号新增'
        _this.doType = 'add'
        _this.getNewInData()
      },

      // 新增
      addSubmit() {
        let _this = this
        _this.$refs.editForm.validate((valid) => {
          if (valid) {
            _this.$refs.editForm.validate((valid) => {
              if (valid) {
                let param = Object.assign({}, this.editForm)
                let SessionId = sessionStorage.getItem('sessionid')
                param.SessionId = SessionId
                _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBBuyerAccountNew', param).then((res) => {
                  _this.$alert(res.data.message, '信息提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                      _this.closeModal()
                      _this.getAllData()
                    }
                  })
                })
              }
            })
          }
        })
      },

      //修改查看时获取该条数据信息
      getThisData(param) {
        let _this = this
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBBuyerAccountUpdateIn', param).then((res) => {
          let dataAccount = res.data.data.BuyerAccount //账户数据
          let dataTag = res.data.data.SelTagList //标签数据
          _this.TagViewData = dataTag //获取到标签数组供查看页面使用
          let TagIdArry = []
          for (let x in dataTag) {
            TagIdArry.push(dataTag[x].TagId)
          }
          let dataAddress = res.data.data.BuyerAddressList //收货地址数据
          let dataLinkedCard = res.data.data.LinkedCard //已选择的信用卡数据
          _this.editForm = {
            PlatformId: dataAccount.PlatformId,
            CountryCode: dataAccount.CountryCode,
            DefaultURL: dataAccount.DefaultSite,
            isComment: dataAccount.isComment,
            LoginAccount: dataAccount.LoginAccount,
            LoginPass: dataAccount.LoginPass,
            Email: dataAccount.Email,
            EmailPass: dataAccount.EmailPass,
            SndEmail: dataAccount.SndEmail,
            SndEmailPass: dataAccount.SndEmailPass,
            StudentEmail: dataAccount.StudentEmail,
            StudentEmailPass: dataAccount.StudentEmailPass,
            SignupDate: dataAccount.SignupDate,
            FBAExpire: dataAccount.FBAExpire,
            StudentExpire: dataAccount.StudentExpire,
            CardType: dataAccount.CardType,
            CardId: dataLinkedCard.Id,
            IP: dataAccount.IP,
            Memo: dataAccount.Memo,
            TagIds: TagIdArry,
            Address: dataAddress
          }
          _this.selectCardViewText = dataLinkedCard.Name + ' / ' + dataLinkedCard.AountName + ' / ' +
            dataLinkedCard.CardNumber
        })
      },

      // 修改弹框
      editModalShow() {
        let _this = this
        _this.editModal = true
        _this.title = '账号修改'
        _this.doType = 'edit'
        let param = {
          SessionId: sessionStorage.getItem('sessionid'),
          BuyerAccountId: _this.checkBoxData[0].BAcountId
        }
        _this.getThisData(param)
      },

      // 修改
      editSubmit() {
        let _this = this
        _this.$refs.editForm.validate((valid) => {
          if (valid) {
            let param = Object.assign({}, _this.editForm)
            param.SessionId = sessionStorage.getItem('sessionid')
            param.BuyerAccountId = _this.checkBoxData[0].BAcountId
            param.CardId = Number(param.CardId)
            _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBBuyerAccountUpdate', param).then((res) => {
              _this.$alert(res.data.message, '信息提示', {
                confirmButtonText: '确定',
                callback: action => {
                  _this.closeModal()
                  _this.getAllData()
                }
              })
            })
          }
        })
      },

      //查看
      viewModalShow(index, row) {
        let _this = this
        _this.viewModal = true
        _this.title = '账号信息'
        let param = {
          SessionId: sessionStorage.getItem('sessionid'),
          BuyerAccountId: row.BAcountId
        }
        _this.getThisData(param)
      },

      // 删除
      delData() {
        let _this = this
        var ids = _this.checkBoxData.map(item => item.BAcountId)
        _this.$confirm('确认删除选中的数据吗？', '信息提示', {
          type: 'warning'
        }).then(() => {
          let param = {
            SessionId: sessionStorage.getItem('sessionid'),
            BuyerAccountIds: ids
          }
          _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBBuyerAccountDel', param).then((res) => {
            _this.$alert(res.data.message, '信息提示', {
              confirmButtonText: '确定',
              callback: action => {
                _this.getAllData()
              }
            })
          })
        }).catch(() => {})
      },

      // 选择实体信用卡弹窗
      selectEntityCard() {
        let _this = this
        _this.selectCardModal = true
        _this.getEntityCardData()
      },

      //获取实体信用卡数据
      getEntityCardData() {
        let _this = this
        let param = {
          SessionId: sessionStorage.getItem('sessionid'),
          CardNo: _this.searchForm2.cardNo,
          CardName: _this.searchForm2.cardName,
          CardType: 3,
          Page: _this.currentPage2,
          OffSet: _this.pageSize2,
        }
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBCardList', param).then((res) => {
          if (res.data.status == 400) {
            _this.$alert(res.data.message, '信息提示', {
              confirmButtonText: '确定',
              callback: action => {
                _this.$router.push({
                  path: '/login'
                })
              }
            })
          } else {
            _this.cardData = res.data.data.CardList
            _this.total2 = res.data.data.TotalRecords
          }
        }).catch((error) => {
          console.log(error)
        })
      },

      //选定信用卡
      selectCardOK() {
        let _this = this
        let checkData = _this.checkBoxCardData[0]
        _this.selectCardViewText = checkData.Name + ' / ' + checkData.AountName + ' / ' + checkData.CardNumber
        _this.editForm.CardId = checkData.Id
        _this.closeModal2()
      },

      //买号标签管理弹窗
      buyTagModalShow() {
        let _this = this;
        _this.buyTagModal = true;
        _this.title = '买号标签管理'
      },

      // 修改标签弹窗
      editTag() {
        let _this = this
        _this.editTagModal = true
        _this.title = '修改标签'
      },

      //修改标签提交
      editTagOk() {
        let _this = this
        var ids = _this.checkBoxData.map(item => item.BAcountId)
        let param = {
          SessionId: sessionStorage.getItem('sessionid'),
          BuyerAccountIds: ids,
          TagIds: _this.editTagForm.tag
        }
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBBuyAccountsTagMod', param).then((res) => {
          _this.$alert(res.data.message, '信息提示', {
            confirmButtonText: '确定',
            callback: action => {
              _this.closeModal4()
              _this.getAllData()
            }
          })
        })
      },

      // 修改状态弹窗
      editStatus() {
        let _this = this
        _this.editStatusModal = true
        _this.title = '修改状态'
      },

      //修改状态提交
      editStatusOk() {
        let _this = this
        var ids = _this.checkBoxData.map(item => item.BAcountId)
        let param = {
          SessionId: sessionStorage.getItem('sessionid'),
          BuyerAccountIds: ids,
          Status: _this.editStatusForm.status
        }
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBBuyAccountStatusMod', param).then((res) => {
          _this.$alert(res.data.message, '信息提示', {
            confirmButtonText: '确定',
            callback: action => {
              _this.closeModal5()
              _this.getAllData()
            }
          })
        })
      },

      //关联刷手弹窗
      bindBrush() {
        let _this = this
        _this.bindBrushModal = true
        _this.title = '关联刷手'
        _this.getBrushData()
      },

      //获取刷手数据
      getBrushData() {
        let _this = this
        let param = {
          SessionId: sessionStorage.getItem('sessionid'),
        }
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBBuyerAccountUserList', param).then((res) => {
          _this.brushData = res.data.data.BuyerList
        }).catch((error) => {
          console.log(error)
        })
      },

      //选定刷手
      bindBrushOK() {
        let _this = this
        let param = {
          SessionId: sessionStorage.getItem('sessionid'),
          BAccountId: _this.checkBoxData[0].BAcountId,
          Id: _this.checkBoxBrushData[0].Id
        }
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBBuyerAccountUserBind', param).then((res) => {
          _this.$alert(res.data.message, '信息提示', {
            confirmButtonText: '确定',
            callback: action => {
              _this.closeModal3()
              _this.getAllData()
            }
          })
        })
      },

      //编辑备注
      remark() {
        let _this = this
        this.$prompt('请输入备注信息', '信息提示', {
          confirmButtonText: '确定',
          inputValue: _this.checkBoxData[0].Memo
        }).then(({
          value
        }) => {
          let param = {
            SessionId: sessionStorage.getItem('sessionid'),
            BuyerAccountId: _this.checkBoxData[0].BAcountId,
            Memo: value
          }
          _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBBuyerAccountMemoMod', param).then((res) => {
            _this.$alert(res.data.message, '信息提示', {
              confirmButtonText: '确定',
              callback: action => {
                _this.getAllData()
              }
            })
          })
        }).catch(() => {})
      },

      // 系统配置弹窗
      configModalShow() {
        let _this = this
        _this.configModal = true
        _this.title = '系统配置'
      },

      // 重置
      resetSearch() {
        let _this = this
        _this.searchForm = {
            platform: '',
            country: '',
            isComment: '',
            cardType: '',
            account: '',
            tag: []
          },
          _this.getAllData()
      },

      //选中行
      rowClick(val) {
        let _this = this
        _this.$refs.table.clearSelection()
        _this.$refs.table.toggleRowSelection(val, true)
        _this.checkBoxData[0] = val
      },

      // 是否有选中
      handleSelectionChange(val) {
        let _this = this
        _this.checkBoxData = val
        let checkNum = _this.checkBoxData.length
        if (checkNum == 1) {
          _this.disabled = false
          _this.disabledMore = false
        } else if (checkNum > 1) {
          _this.disabled = true
          _this.disabledMore = false
        } else {
          _this.disabled = true
          _this.disabledMore = true
        }
      },

      //关闭新增修改弹窗
      closeModal() {
        let _this = this
        _this.editModal = false
        _this.$refs['editForm'].resetFields()
        _this.editForm = {
          PlatformId: '',
          CountryCode: '',
          DefaultURL: '',
          isComment: '',
          LoginAccount: '',
          LoginPass: '',
          Email: '',
          EmailPass: '',
          SndEmail: '',
          SndEmailPass: '',
          StudentEmail: '',
          StudentEmailPass: '',
          SignupDate: '',
          FBAExpire: '',
          StudentExpire: '',
          CardType: 1,
          IP: '',
          Memo: '',
          TagIds: [],
          Address: [{
            AddressName: '',
            PhoneNumber: '',
            CountryCode: '',
            State: '',
            City: '',
            PostCode: '',
            Address: '',
            Sequence: ''
          }]
        }
        _this.selectCardViewText = ''
      },

      //翻页
      handleSizeChange(val) {
        let _this = this
        _this.pageSize = val
        _this.getAllData()
      },
      handleCurrentChange(val) {
        let _this = this
        _this.currentPage = val
        _this.getAllData()
      },

      // 重置信用卡查询
      resetSearch2() {
        let _this = this
        _this.searchForm2 = {
            cardNo: '',
            cardName: ''
          },
          _this.getEntityCardData()
      },

      //信用卡选中行
      rowClick2(val) {
        let _this = this
        _this.$refs.table2.clearSelection()
        _this.$refs.table2.toggleRowSelection(val, true)
        _this.checkBoxCardData[0] = val
      },

      // 信用卡是否有选中
      handleSelectionChange2(val) {
        let _this = this
        _this.checkBoxCardData = val
        let checkNum = _this.checkBoxCardData.length
        if (checkNum == 1) {
          _this.disabledCard = false
          _this.disabledMoreCard = false
        } else if (checkNum > 1) {
          _this.disabledCard = true
          _this.disabledMoreCard = false
        } else {
          _this.disabledCard = true
          _this.disabledMoreCard = true
        }
      },

      //关闭选择信用卡弹窗
      closeModal2() {
        let _this = this
        _this.selectCardModal = false
        _this.searchForm2 = {
          cardNo: '',
          cardName: ''
        }
        _this.currentPage2 = 1
        _this.pageSize2 = 10
        _this.total2 = 0
        _this.checkBoxCardData = []
        _this.$refs.table2.clearSelection()
      },

      //选择信用卡翻页
      handleSizeChange2(val) {
        let _this = this
        _this.pageSize2 = val
        _this.getEntityCardData()
      },
      handleCurrentChange2(val) {
        let _this = this
        _this.currentPage2 = val
        _this.getEntityCardData()
      },

      //刷手选中行
      rowClick3(val) {
        let _this = this
        _this.$refs.table3.clearSelection()
        _this.$refs.table3.toggleRowSelection(val, true)
        _this.checkBoxBrushData[0] = val
      },

      // 刷手是否有选中
      handleSelectionChange3(val) {
        let _this = this
        _this.checkBoxBrushData = val
        let checkNum = _this.checkBoxBrushData.length
        if (checkNum == 1) {
          _this.disabledBrush = false
          _this.disabledMoreBrush = false
        } else if (checkNum > 1) {
          _this.disabledBrush = true
          _this.disabledMoreBrush = false
        } else {
          _this.disabledBrush = true
          _this.disabledMoreBrush = true
        }
      },

      //关闭关联刷手弹窗
      closeModal3() {
        let _this = this
        _this.bindBrushModal = false
        _this.checkBoxBrushData = []
        _this.$refs.table3.clearSelection()
      },

      //关闭修改标签弹窗
      closeModal4() {
        let _this = this
        _this.editTagModal = false
        _this.editTagForm = {
          tag: [],
        }
      },

      //关闭修改状态弹窗
      closeModal5() {
        let _this = this
        _this.editStatusModal = false
        _this.editStatusForm = {
          status: '',
        }
      },


      //任务总数
      taskModalShow() {
        let _this = this
        _this.taskModal = true
      },

      //全部
      sumCount() {
        let _this = this
        _this.active = 0
        _this.searchForm.status = 0
        _this.getAllData()
      },
      //正常
      validCount() {
        let _this = this
        _this.active = 1
        _this.searchForm.status = 1
        _this.getAllData()
      },
      //失效
      inValidCount() {
        let _this = this
        _this.active = 2
        _this.searchForm.status = 2
        _this.getAllData()
      },
      //限评
      limitCount() {
        let _this = this
        _this.active = 3
        _this.searchForm.status = 3
        _this.getAllData()
      },
      //封号
      stoppedCount() {
        let _this = this
        _this.active = 4
        _this.searchForm.status = 4
        _this.getAllData()
      },

      //导入弹窗
      drModalShow() {
        let _this = this
        _this.drModal = true
      },

      // 导出
      exportExcel() {
        var xlsxParam = {
          raw: true
        }
        var wb = XLSX.utils.table_to_book(document.querySelector('#exportTable'), xlsxParam)
        var wbout = XLSX.write(wb, {
          bookType: 'xlsx',
          bookSST: true,
          type: 'array'
        })
        try {
          FileSaver.saveAs(new Blob([wbout], {
            type: 'application/octet-stream'
          }), '账号管理.xlsx')
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

<style>

</style>
