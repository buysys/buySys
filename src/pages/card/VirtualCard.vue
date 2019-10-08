<template>
  <div>
    <el-collapse-transition>
      <div class="searchBox mb20 pl30">
        <el-form ref="searchForm" :model="searchForm" class="form-item" label-width="80px">
          <el-row>
            <el-col :xs="24" :span="4">
              <el-form-item label="卡号">
                <el-input v-model="searchForm.CardNo" placeholder="请输入信用卡卡号" class="disInline"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :span="4">
              <el-form-item label="姓名">
                <el-input v-model="searchForm.username" placeholder="请输入信用卡姓名" class="disInline"></el-input>
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
      <el-button type="success" size="small" @click="addLevel"><i class="el-icon-plus"></i> 新增</el-button>
      <el-button type="primary" size="small" :disabled="disabled" @click="editLevel"><i class="el-icon-edit-outline"></i>
        修改</el-button>
      <el-button type="danger" size="small" :disabled="disabled" @click="delHandel"><i class="el-icon-delete"></i> 删除</el-button>
      <el-button type="primary" size="small" @click="reserCardHandel" :disabled="disabled"><i class="el-icon-takeaway-box"></i>
        重置虚拟卡</el-button>
      <el-button type="primary" size="small" @click="quotaHandle" :disabled="disabled"><i class="el-icon-edit-outline"></i>
        修改额度</el-button>
      <el-button type="primary" size="small" @click="repaymentHandle"><i class="el-icon-edit-outline"></i> 还款</el-button>
      <el-button type="warning" size="small" @click="importHandle"><i class="el-icon-download"></i> 导入</el-button>
      <el-button type="warning" size="small" @click="exportExcel"><i class="el-icon-upload2"></i> 导出</el-button>
    </div>
    <div class="mt10">
      <el-table border :data="tableData" id="exportTable" style="width: 100%" :header-cell-style="{background:'#fafafa'}"
        @selection-change="handleSelectionChange" @row-click="rowClick" ref="table">
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" align="center" width="50"></el-table-column>
        <el-table-column prop="Numbers" label="主卡卡号" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="viewCardDetails(scope.$index,scope.row)">{{scope.row.Numbers}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="CountryId" label="名称" align="center"></el-table-column>
        <el-table-column prop="ProductByASIN" label="有效期" align="center"></el-table-column>
        <el-table-column prop="ProductByASIN" label="安全码" align="center"></el-table-column>
        <el-table-column prop="ProductPrice" label="姓名" align="center"></el-table-column>
        <el-table-column prop="ServiceType" label="已绑虚拟卡数" align="center"></el-table-column>
        <el-table-column prop="OrderNote" label="未绑虚拟卡数" align="center"></el-table-column>
        <el-table-column prop="OrderNote" label="总额度($)" align="center"></el-table-column>
        <el-table-column prop="OrderNote" label="已用额度($)" align="center"></el-table-column>
        <el-table-column prop="OrderNote" label="剩余额度($)" align="center"></el-table-column>
        <el-table-column prop="OrderNote" label="累积使用($)" align="center"></el-table-column>
        <el-table-column prop="Status" label="状态" align="center"></el-table-column>
      </el-table>
      <div class="table-foot">
        <div></div>
        <div>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 新建、修改-->
    <el-dialog :title="title" :visible.sync="cardModel" :close-on-click-modal="false" width="65%" :before-close="closeModel">
      <el-form :model="cardForm" ref="cardForm" :rules="editRules" class="demo-dynamic" label-width="88px" status-icon>
        <el-row>
          <el-col :span='12' :sx='24'>
            <el-form-item label="名称" prop="names">
              <el-input v-model="cardForm.names" class='inpWid'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12' :sx='24'>
            <el-form-item label="主卡卡号" prop="cardNo">
              <el-input v-model="cardForm.cardNo" class='inpWid'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='12' :xs='24'>
            <el-form-item label="有效期" prop="validity">
              <el-input v-model="cardForm.validity" class='inpWid'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label="安全码" prop="safetyCode">
              <el-input v-model="cardForm.safetyCode" class='inpWid'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='12' :xs='24'>
            <el-form-item label="姓名" prop="username">
              <el-input v-model="cardForm.username" class='inpWid'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12' :xs='24'>
            <el-form-item label="总额度($)" prop="totalAmount">
              <el-input v-model="cardForm.totalAmount" class='inpWid'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='12' :xs='24'>
            <el-form-item label="备注">
              <el-input type="textarea" v-model="cardForm.remark" class='inpWid'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-tabs type="border-card" class="mb20">
          <el-tab-pane label="虚拟信用卡管理">
            <div class="mb10">
              <el-button size="small" type='primary' @click="addCard">新增</el-button>
            </div>
            <div class="cardBox">
              <ul class="listTitle">
                <li>虚拟卡号</li>
                <li>有效期</li>
                <li>安全码</li>
                <li>虚拟卡额度($)</li>
                <li class="lastLi">
                  <el-button type="danger" size="small" style="visibility: hidden;">删除</el-button>
                </li>
              </ul>
              <div v-for="(index,item) in cardListData">
                <ul class="cardCon">
                  <li>
                    <el-input class="inpWid" v-model="item.cardNo"></el-input>
                  </li>
                  <li>
                    <el-input class="inpWid" v-model="item.validity"></el-input>
                  </li>
                  <li>
                    <el-input class="inpWid" v-model="item.safetyCode"></el-input>
                  </li>
                  <li>
                    <el-input class="inpWid" v-model="item.amount"></el-input>
                  </li>
                  <li class="lastLi">
                    <el-button type="danger" size="small" @click="removeCardList(item,index)">删除</el-button>
                  </li>
                </ul>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary">确 定</el-button>
        <el-button @click="closeModel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 删除-->
    <el-dialog title="系统提示" :visible.sync="delModel" :close-on-click-modal="false" center width="30%">
      <div class="del-dialog-cnt textCen">此操作会删除信用卡和买号绑定关系，<br /><br />确认要删除该信用卡管理记录吗？</div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium">确 定</el-button>
        <el-button @click="delModel=false">取 消</el-button>
      </div>
    </el-dialog>
    <!--重置虚拟卡-->
    <el-dialog title="系统提示" :visible.sync="resetCardModel" :close-on-click-modal="false" center width="30%">
      <div class="del-dialog-cnt textCen">此操作会重置选中主卡的所有虚拟卡额度，<br /><br />确认要重置选中的信用卡吗？</div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium">确 定</el-button>
        <el-button @click="resetCardModel=false">取 消</el-button>
      </div>
    </el-dialog>
    <!--导入数据-->
    <el-dialog title="导入数据" :visible.sync="importModel" :close-on-click-modal="false" :before-close="closeImportModel"
      width="30%">
      <div class="del-dialog-cnt textCen">
        <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" ref="upload" multiple
          :limit="3" :file-list="fileList">
          <el-button size="mini">选择文件</el-button>
          <span slot="tip" class="el-upload__tip">导入文件不能超过5M，仅允许导入“xls”或“xlsx”格式文件！</span>
        </el-upload>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary">下载模板</el-button>
        <el-button size="medium" type="primary">确定</el-button>
        <el-button size="medium" @click="closeImportModel">取消</el-button>
      </div>
    </el-dialog>
    <!--修改额度-->
    <el-dialog title="请输入信用卡额度" :visible.sync="quotaModel" :close-on-click-modal="false" :before-close="closeQuotaModel"
      width="30%">
      <el-form :model="quotaForm" ref="quotaForm" class="demo-dynamic">
        <el-form-item prop="amount">
          <el-input v-model="quotaForm.amount"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium">确定</el-button>
        <el-button @click="closeQuotaModel" size="medium">取消</el-button>
      </div>
    </el-dialog>
    <!--还款-->
    <el-dialog title="请输入还款金额" :visible.sync="repaymentModel" :close-on-click-modal="false" :before-close="closeRepaymentModel"
      width="30%">
      <el-form :model="repaymentForm" ref="repaymentForm" class="demo-dynamic">
        <el-form-item prop="amount">
          <el-input v-model="repaymentForm.amount" autofocus="true"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium">确定</el-button>
        <el-button @click="closeRepaymentModel" size="medium">取消</el-button>
      </div>
    </el-dialog>
    <!--查看虚拟卡详情-->
    <el-dialog title="详细信息" :visible.sync="detailModel" :close-on-click-modal="false">
      <el-form class="demo-item">
        <el-form-item label="主卡卡号:">
          <span>1112 0723 6197</span>
        </el-form-item>
        <el-form-item label="名称:">
          <span>拍住赏</span>
        </el-form-item>
        <el-form-item label="有效期:">
          <span>2025-05</span>
        </el-form-item>
        <el-form-item label="姓名:">
          <span>王邵东2362银联卡</span>
        </el-form-item>
        <el-form-item label="总额度:">
          <span>$ 200.00</span>
        </el-form-item>
        <el-form-item label="已用额度:">
          <span>$ 200.00</span>
        </el-form-item>
        <el-form-item label="剩余额度:">
          <span>$ 200.00</span>
        </el-form-item>
        <el-form-item label="累积使用:">
          <span>$ 200.00</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailModel=false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'

  export default {
    name: 'VirtualCard',
    data() {
      return {
        loading: true,
        title: '新增',
        disabled: true,
        disabled1: true,
        cardModel: false,
        delModel: false,
        importModel: false,
        resetCardModel: false,
        quotaModel: false,
        detailModel: false,
        checkBoxData: [],
        fileList: [],
        repaymentModel: false,
        tableData: [{
            "Numbers": "201906051056",
            "Picture": "",
            "CountryId": "美国",
            "Forum": "Amazon",
            "ProductByASIN": "777888999a",
            "ProductPrice": 15.99,
            "ServiceType": "不留评",
            "OrderNote": "待付款",
            "Status": "已完成",
            "OrderNumber": 1314520,
            "OrderTime": "2019-02-03 08:00:00",
            "Remark": ""
          },
          {
            "Numbers": "201906111741",
            "Picture": "",
            "CountryId": "德国",
            "Forum": "Amazon",
            "ProductByASIN": "B07P6KVGF8",
            "ProductPrice": 18.99,
            "ServiceType": "不留评",
            "OrderNote": "待确认",
            "Status": "已完成",
            "OrderNumber": 7758258,
            "OrderTime": "2019-04-02 18:00:00",
            "Remark": ""
          }
        ],
        currentPage: 1,
        pageSize: '0',
        total: 100,
        cardForm: {
          names: '',
          cardNo: '',
          validity: '',
          safetyCode: '',
          username: '',
          totalAmount: '',
          remark: ''
        },
        quotaForm: {
          amount: ''
        },
        repaymentForm: {
          amount: ''
        },
        cardListData: [{
          cardNo: '',
          validity: '',
          safetyCode: '',
          amount: ''
        }],
        editRules: {
          validity: [{
            required: true,
            message: '请输入有效期',
            trigger: 'blur'
          }],
          names: [{
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }],
          totalAmount: [{
            required: true,
            message: '请输入总额度',
            trigger: 'blur'
          }]
        },
        searchForm: {
          CardNo: '',
          username: ''
        }
      }
    },
    created() {
      //			this.getAllData()
    },
    methods: {
      //新增虚拟卡
      addCard() {
        let _this = this
        _this.cardListData.push({
          cardNo: '',
          validity: '',
          safetyCode: '',
          amount: ''
        })
      },
      //新增虚拟卡删除
      removeCardList(item, index) {
        let _this = this
        _this.index = _this.cardListData.indexOf(item)
        if (index !== -1) {
          _this.cardListData.splice(index, 1)
        }
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
      // 新建弹窗
      addLevel() {
        let _this = this
        _this.cardModel = true
      },
      // 修改弹窗
      editLevel() {
        let _this = this;
        _this.cardModel = true;
        _this.title = "修改";
        let item = _this.checkBoxData[0];
        _this.cardForm.name = item.CountryID;
        _this.cardForm.cardNo = item.Numbers;
        _this.cardForm.validity = item.ProductByASIN;
        _this.cardForm.safetyCode = item.ProductByASIN;
        _this.cardForm.userName = item.ProductByASIN;
        _this.cardForm.totalAmount = item.ProductByASIN;
        _this.cardForm.remark = item.remark;
      },
      // 关闭修改价格弹窗
      closeModel() {
        let _this = this
        _this.cardModel = false
        _this.cardForm = {
          names: '',
          cardNo: '',
          validity: '',
          safetyCode: '',
          username: '',
          totalAmount: '',
          remark: ''
        }
      },
      // 删除记录
      delHandel() {
        let _this = this
        _this.delModel = true
      },
      //导入弹窗
      importHandle() {
        let _this = this;
        _this.importModel = true;
      },
      //关闭导入弹窗
      closeImportModel() {
        let _this = this;
        _this.importModel = false;
        _this.fileList = [];
      },
      //重置虚拟卡弹窗
      reserCardHandel() {
        let _this = this;
        _this.resetCardModel = true;
      },
      //修改额度弹窗
      quotaHandle() {
        let _this = this;
        _this.quotaModel = true;
      },
      //关闭修改额度弹窗
      closeQuotaModel() {
        let _this = this;
        _this.quotaModel = false,
          _this.quotaForm = {
            amout: ''
          }
      },
      //还款弹窗
      repaymentHandle() {
        let _this = this;
        //				let item = _this.checkBoxData[0];
        _this.repaymentModel = true;
        //				_this.repaymentForm.amount = item.amount;
      },
      //关闭还款弹窗
      closeRepaymentModel() {
        let _this = this;
        _this.repaymentModel = false;
        _this.repaymentForm = {
          amount: ''
        };
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
        console.log(checkNum)
        if (checkNum !== 1) {
          this.disabled = true
        } else {
          this.disabled = false
        }
      },
      //获取初始数据
      getAllData() {
        let _this = this
        _this.axios.get(_this.GLOBAL.BASE_URL + 'api/OrderManagement/AddOrderByType').then((res) => {
          _this.tableData = res.data.data
          _this.loading = false
        }).catch((error) => {
          console.log(error)
        })
      },
      //查看虚拟卡详情
      viewCardDetails(index, row) {
        let _this = this;
        let item = _this.tableData[index];
        let num = item.Numbers
        _this.detailModel = true;
      },
      //分页
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
          }), '虚拟信用卡.xlsx')
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
