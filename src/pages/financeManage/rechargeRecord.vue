<template>
  <div class="container">
    <el-collapse-transition>
      <div class="searchBox mb20">
        <el-form ref="searchForm" :model="searchForm" class="form-item" :inline='true' label-width="60px">
          <el-form-item label="时间">
            <el-date-picker v-model="searchForm.start" type="date" placeholder="选择开始时间" value-format="yyyy-MM-dd"
              size="small"></el-date-picker>
            <span>-</span>
            <el-date-picker v-model="searchForm.end" type="date" placeholder="选择结束时间" value-format="yyyy-MM-dd" size="small"></el-date-picker>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" size="small">
              <el-option label="全部" :value="0"></el-option>
              <el-option label="待确认" :value="1"></el-option>
              <el-option label="已确认" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="getAllData" class="ml20">查询</el-button>
            <el-button size="small" @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-collapse-transition>
    <div class="mb20">
      <el-button type="success" size="small" :disabled="disabled" @click="addMoney"><i class="el-icon-circle-check"></i>
        确认充值</el-button>
      <el-button type="warning" size="small" @click="exportExcel"><i class="el-icon-upload2"></i> 导出</el-button>
    </div>
    <div class="mt10">
      <el-table border :data="tableData" id="exportTable" style="width: 100%" :header-cell-style="{background:'#fafafa'}"
        @selection-change="handleSelectionChange" @row-click="rowClick" ref="table">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
        <el-table-column prop="DealId" label="交易流水号" align="center"></el-table-column>
        <el-table-column prop="Amount" label="充值金额" align="center"></el-table-column>
        <el-table-column prop="ActionTime" label="充值申请时间" align="center"></el-table-column>
        <el-table-column prop="DealVerifyCode" label="识别码" align="center"></el-table-column>
        <el-table-column prop="Status" label="状态" align="center" :formatter="toTxt"></el-table-column>
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
  </div>
</template>

<script>
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'

  export default {
    name: 'rechargeRecord',
    data() {
      return {
        title: '',
        currentPage: 1,
        pageSize: 10,
        total: 0,
        doType: '',
        disabled: true, //单项禁用
        disabledMore: true, //多项禁用
        loading: true,
        tableData: [],
        checkBoxData: [], //选中数据
        statusData: [], //状态数字转文字数据
        searchForm: {
          start: '',
          end: '',
          status: 0
        },
      }
    },
    props: ["funv"],
    created() {
      this.getAllData()
    },
    methods: {
      //状态转文字
      toTxt(val) {
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
          UserId: Number(_this.funv),
          DealType: 1,
          Page: _this.currentPage,
          OffSet: _this.pageSize,
          StartDate: _this.searchForm.start,
          EndDate: _this.searchForm.end,
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
            _this.tableData = res.data.data.AccountDetails
            _this.statusData = res.data.data.DealStatus
            _this.total = res.data.data.TotalRecords
            _this.loading = false
          }
        }).catch((error) => {
          console.log(error)
        })
      },

      //确认充值
      addMoney() {
        let _this = this
        this.$prompt('请输入充值金额', '信息提示', {
          confirmButtonText: '确定',
          inputPattern: /^[0-9]+([.]{1}[0-9]+){0,1}$/,
          inputErrorMessage: '金额格式不正确',
          inputValue: _this.checkBoxData[0].Amount
        }).then(({
          value
        }) => {
          let param = {
            SessionId: sessionStorage.getItem('sessionid'),
            UserId: Number(_this.funv),
            DealType: 1,
            LogId: Number(_this.checkBoxData[0].Id),
            Amount: Number(value)
          }
          _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBAccountAction', param).then((res) => {
            _this.$alert(res.data.message, '信息提示', {
              confirmButtonText: '确定',
              callback: action => {
                _this.getAllData()
              }
            })
          })
        }).catch(() => {})
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
          searchkeywords: '',
          status: ''
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
          }), '充值申请.xlsx')
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
