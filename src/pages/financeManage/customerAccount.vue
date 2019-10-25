<template>
  <div>
    <el-collapse-transition>
      <div class="searchBox mb20">
        <el-form ref="searchForm" :model="searchForm" class="form-item" label-width="80px">
          <el-row>
            <el-col :xs="24" :span="4">
              <el-form-item label="搜索内容">
                <el-input v-model="searchForm.searchkeywords" placeholder="请输入客户编码/姓名" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :span="20">
              <el-form-item>
                <el-button type="primary" size="small" @click="getAllData">查询</el-button>
                <el-button size="small" @click="resetSearch">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-collapse-transition>
    <div class="mb20">
      <el-button type="primary" size="small" :disabled="disabled" @click="MxModalShow"><i class="el-icon-tickets"></i>
        账户明细</el-button>
      <el-button type="success" size="small" :disabled="disabled" @click="CzModelShow"><i class="el-icon-circle-plus-outline"></i>
        充值</el-button>
      <el-button type="danger" size="small" :disabled="disabled" @click="TxModelShow"><i class="el-icon-remove-outline"></i>
        提现</el-button>
      <el-button type="warning" size="small" @click="exportExcel"><i class="el-icon-upload2"></i> 导出</el-button>
    </div>
    <div class="mt10">
      <el-table border :data="tableData" id="exportTable" style="width: 100%" :header-cell-style="{background:'#fafafa'}"
        @selection-change="handleSelectionChange" @row-click="rowClick" ref="table">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
        <el-table-column prop="" label="客户编码" align="center"></el-table-column>
        <el-table-column prop="Name" label="姓名" align="center"></el-table-column>
        <el-table-column prop="AllInAccount" label="收益总额" align="center"></el-table-column>
        <el-table-column prop="AllOutAccount" label="支出总额" align="center"></el-table-column>
        <el-table-column prop="" label="余额" align="center">
          <template slot-scope="scope">{{scope.row.AllInAccount - scope.row.AllOutAccount}}</template>
        </el-table-column>
      </el-table>
      <div class="table-foot">
        <div></div>
        <div>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 账户明细 -->
    <el-dialog title="账户明细" :visible.sync="MxModal" :close-on-click-modal="false" :before-close="closeModal2" width="60%">
      <el-collapse-transition>
        <div class="searchBox mb20">
          <el-form ref="searchForm2" :model="searchForm2" class="form-item" :inline='true' label-width="80px">
            <el-form-item label="时间">
              <el-date-picker v-model="searchForm2.start" type="date" placeholder="选择开始时间" value-format="yyyy-MM-dd"
                size="small"></el-date-picker>
              <span>-</span>
              <el-date-picker v-model="searchForm2.end" type="date" placeholder="选择结束时间" value-format="yyyy-MM-dd" size="small"></el-date-picker>
            </el-form-item>
            <el-form-item label="操作类型">
              <el-select v-model="searchForm2.type" placeholder="请选择操作类型" size="small">
                <el-option label="全部" :value="0"></el-option>
                <el-option v-for="item in actionData" :key="item.Value" :label="item.Display" :value="item.Value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="getDetailData">查询</el-button>
              <el-button size="small" @click="resetSearch2">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-transition>
      <div class="mt10">
        <el-table border :data="detailData" style="width: 100%" :header-cell-style="{background:'#fafafa'}">
          <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
          <el-table-column prop="DealId" label="交易流水号" align="center"></el-table-column>
          <el-table-column prop="Action" label="操作类型" align="center" :formatter="toTxt1"></el-table-column>
          <el-table-column prop="Amount" label="金额" align="center"></el-table-column>
          <el-table-column prop="Status" label="状态" align="center" :formatter="toTxt2"></el-table-column>
          <el-table-column prop="ActionTime" label="时间" align="center"></el-table-column>
        </el-table>
      </div>
      <div class="table-foot">
        <div></div>
        <div>
          <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page="currentPage2"
            :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total2">
          </el-pagination>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeModal2">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 充值申请 -->
    <el-dialog :title="title" :visible.sync="CzModal" :close-on-click-modal="false" width="90%">
      <rechargeRecord :funv='passValueToSon' :key='passValueToSon'></rechargeRecord>
      <div slot="footer" class="dialog-footer">
        <el-button @click="CzModal = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 提现申请 -->
    <el-dialog :title="title" :visible.sync="TxModal" :close-on-click-modal="false" width="90%">
      <takeMoneyList :funv='passValueToSon' :key='passValueToSon'></takeMoneyList>
      <div slot="footer" class="dialog-footer">
        <el-button @click="TxModal = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'

  import takeMoneyList from './takeMoneyList'
  import rechargeRecord from './rechargeRecord'

  export default {
    name: 'customerAccount',
    data() {
      return {
        title: '',
        currentPage: 1,
        pageSize: 10,
        total: 0,
        doType: '',
        disabled: true, //单项禁用
        disabledMore: true, //多项禁用
        MxModal: false, //账户明细
        TxModal: false, //待提现
        CzModal: false, //待充值
        tableData: [],
        checkBoxData: [],
        detailData: [], // 账户明细
        passValueToSon: '', //准备传往子组件的数据
        currentPage2: 1,
        pageSize2: 10,
        total2: 0,
        actionData: [], //操作类型数字转文字数据
        statusData: [], //状态数字转文字数据
        searchForm: {
          searchkeywords: ''
        },
        searchForm2: {
          start: '',
          end: '',
          type: 0
        }
      }
    },
    components: {
      takeMoneyList,
      rechargeRecord
    },
    created() {
      this.getAllData()
    },
    methods: {
      //账户明细操作类型数字转文字
      toTxt1(val) {
        let _this = this
        let arr = _this.actionData.filter(item => item.Value == val.Action)
        if (arr.length > 0) {
          return arr[0].Display
        } else {
          return '未知'
        }
      },
      //账户明细状态转文字
      toTxt2(val) {
        let _this = this
        let arr = _this.statusData.filter(item => item.Value == val.Status)
        if (arr.length > 0) {
          return arr[0].Display
        } else {
          return '未知'
        }
      },

      //获取数据
      getAllData() {
        let _this = this
        let param = {
          SessionId: sessionStorage.getItem('sessionid'),
          Page: _this.currentPage,
          OffSet: _this.pageSize,
          SearchTerm: _this.searchForm.searchkeywords
        }
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBAccountList', param).then((res) => {
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
            _this.tableData = res.data.data.AccountList
            _this.total = res.data.data.TotalRecords
            _this.loading = false
          }
        }).catch((error) => {
          console.log(error)
        })
      },

      //账户明细弹框
      MxModalShow() {
        let _this = this
        _this.MxModal = true
        let txt = _this.checkBoxData[0].Name
        _this.title = '【' + txt + '】 账户明细'
        _this.getDetailData()
      },

      //获取账户明细
      getDetailData() {
        let _this = this
        let param = {
          SessionId: sessionStorage.getItem('sessionid'),
          UserId: Number(_this.checkBoxData[0].Id),
          Page: _this.currentPage2,
          OffSet: _this.pageSize2,
          StartDate: _this.searchForm2.start,
          EndDate: _this.searchForm2.end,
          DealType: _this.searchForm2.type
        }
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBAccountDetails', param).then((res) => {
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
            _this.detailData = res.data.data.AccountDetails
            _this.total2 = res.data.data.TotalRecords
            _this.actionData = res.data.data.DealAction
            _this.statusData = res.data.data.DealStatus
            _this.loading = false
          }
        }).catch((error) => {
          console.log(error)
        })
      },

      //充值
      CzModelShow() {
        let _this = this
        _this.CzModal = true
        let txt = _this.checkBoxData[0].Name
        _this.title = '【' + txt + '】 充值申请'
        _this.passValueToSon = _this.checkBoxData[0].Id
      },

      //提现
      TxModelShow() {
        let _this = this
        _this.TxModal = true
        let txt = _this.checkBoxData[0].Name
        _this.title = '【' + txt + '】 提现申请'
        _this.passValueToSon = _this.checkBoxData[0].Id
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

      // 重置
      resetSearch() {
        let _this = this
        _this.searchForm = {
          searchkeywords: ''
        }
        _this.getAllData()
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

      // 重置明细查询
      resetSearch2() {
        let _this = this
        _this.searchForm2 = {
          start: '',
          end: '',
          type: 0
        }
        _this.getDetailData()
      },

      //明细翻页
      handleSizeChange2(val) {
        let _this = this
        _this.pageSize2 = val
        _this.getDetailData()
      },
      handleCurrentChange2(val) {
        let _this = this
        _this.currentPage2 = val
        _this.getDetailData()
      },

      //关闭明细弹窗
      closeModal2() {
        let _this = this
        _this.MxModal = false
        _this.searchForm2 = {
          start: '',
          end: '',
          type: ''
        }
        _this.currentPage2 = 1
        _this.pageSize2 = 10
        _this.total2 = 0
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
          }), '客户账户.xlsx')
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
