<template>
  <div class="container">
    <el-collapse-transition>
      <div class="searchBox mb20">
        <el-form ref="searchForm" :model="searchForm" class="form-item" label-width="80px">
          <el-row>
            <el-col :xs="24" :span="8">
              <el-form-item label="搜索内容">
                <el-input v-model="searchForm.searchkeywords" placeholder="请输入充值流水号/客户名称/客户编号/识别码" class="disInline"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :span="4">
              <el-form-item label="充值状态">
                <template>
                  <el-select v-model="statusValue" placeholder="请选择">
                    <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
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
    <div class="mb20">
      <el-button type="warning" size="small" @click="exportExcel"><i class="el-icon-upload2"></i>导出</el-button>
    </div>
    <div class="mt10">
      <el-table border :data="tableData" id="exportTable" style="width: 100%" :header-cell-style="{background:'#fafafa'}">
        <el-table-column type="index" align="center" width="50"></el-table-column>
        <el-table-column prop="Numbers" label="充值流水号" align="center"></el-table-column>
        <el-table-column prop="ProductByASIN" label="客户名称" align="center"></el-table-column>
        <el-table-column prop="CountryId" label="客户编号" align="center"></el-table-column>
        <el-table-column prop="OrderNumber" label="充值金额" align="center"></el-table-column>
        <el-table-column prop="OrderNumber" label="充值时间" align="center"></el-table-column>
        <el-table-column prop="Numbers" label="识别码" align="center"></el-table-column>
        <el-table-column prop="Remark" label="充值状态" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button size="small" type="danger" @click="okModelShow">充值</el-button>
          </template>
        </el-table-column>
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
    <!--充值-->
    <el-dialog title="请确认充值" :visible.sync="okModel" :close-on-click-modal="false" width="30%" :modal-append-to-body="false"
      :append-to-body="true">
      <el-form :rules="editRules" :model="editForm" ref="repaymentForm" class="demo-dynamic">
        <el-form-item prop="money" style="width: 200px;margin: 0 auto;">
          <el-input v-model="editForm.money" placeholder="请输入充值金额" autofocus></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium">确定</el-button>
        <el-button @click="okModel=false" size="medium">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
  import validate from '../../components/validate'
  export default {
    name: 'rechargeRecord',
    data() {
      return {
        loading: true,
        okModel: false,
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
            "Remark": "未充值"
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
            "Remark": "已充值"
          },
        ],
        allNum: 0,
        active: 1,
        currentPage: 1,
        pageSize: '0',
        total: 100,
        searchForm: {
          platform: '全部',
          searchkeywords: ''
        },
        editForm: {
          money: ''
        },
        statusOptions: [{
          value: '1',
          label: '全部'
        }, {
          value: '2',
          label: '已充值'
        }, {
          value: '3',
          label: '未充值'
        }],
        statusValue: '1',
        editRules: {
          money: [{
            validator: validate.proPrice,
            trigger: 'blur'
          }]
        }
      }
    },
    created() {
      //			this.getAllData()
    },
    methods: {
      //获取数据
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
      // 重置
      resetSearch() {
        let _this = this
        _this.searchForm = {
          platform: '全部',
          searchkeywords: ''
        }
      },
      okModelShow() {
        let _this = this
        _this.okModel = true
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
          }), '充值记录.xlsx')
        } catch (e) {
          if (typeof console !== 'undefined') {
            console.log(e, wbout)
          }
        }
        return wbout
      },
    }
  }
</script>

<style>

</style>
