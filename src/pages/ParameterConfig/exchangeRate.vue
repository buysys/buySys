<template>
  <div>
    <el-collapse-transition>
      <div class="searchBox mb20">
        <el-form ref="searchForm" :model="searchForm" class="form-item" label-width="80px">
          <el-row>
            <el-col :xs="24" :span="4">
              <el-form-item label="货币名称">
                <el-input v-model="searchForm.currency" placeholder="请输入货币名称" class="disInline"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :span="4" class="ml20">
              <el-button type="primary" size="medium">查询</el-button>
              <el-button size="medium" @click='resetSearch'>重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-collapse-transition>
    <div class="mb20">
      <el-button type="success" size="small" @click="addService"><i class="el-icon-plus"></i> 新增</el-button>
      <el-button type="primary" size="small" :disabled="disabled" @click="editService"><i class="el-icon-edit-outline"></i>
        修改
      </el-button>
      <el-button type="danger" size="small" :disabled="disabled" @click="delHandel"><i class="el-icon-delete"></i> 删除
      </el-button>
      <el-button type="danger" size="small" :disabled="disabled" @click="relationCountry"><i class="el-icon-sort"></i>
        关联国家
      </el-button>
      <el-button type='primary' size='small' @click='editExchangeRate'><i class="el-icon-edit-outline"></i> 调整汇率</el-button>
      <el-button type="warning" size="small" @click="importData"><i class="el-icon-download"></i> 导入</el-button>
      <el-button type="warning" size="small" @click="exportExcel"><i class="el-icon-upload2"></i> 导出</el-button>
    </div>
    <div class="mt10">
      <el-table border :data="tableData" id="exportTable" style="width: 100%" :header-cell-style="{background:'#fafafa'}"
        @selection-change="handleSelectionChange" @row-click="rowClick" ref="table">
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" align="center" width="50"></el-table-column>
        <el-table-column prop="CountryId" label="货币名称" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="viewCountryDetails(scope.$index,scope.row)">{{scope.row.CountryId}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="Numbers" label="货币编码" align="center"></el-table-column>
        <el-table-column prop="ProductByASIN" label="货币符号" align="center"></el-table-column>
        <el-table-column prop="OrderNumber" label="汇率" align="center"></el-table-column>
        <el-table-column prop="Remark" label="国家数量" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="viewCountryNum(scope.$index,scope.row)">{{scope.row.Remark}}</el-button>
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
    <!--新增/修改-->
    <el-dialog :title='serviceTitle' :visible.sync='addCurrencyModal' :close-on-click-modal='false'>
      <el-form :model='currencyForm' ref='currencyForm' :rules='formRules' label-width='120px'>
        <el-form-item label='货币名称' prop='currencyName'>
          <el-input v-model='currencyForm.currencyName'></el-input>
        </el-form-item>
        <el-form-item label='货币编码' prop='currencyCode'>
          <el-input v-model='currencyForm.currencyCode'></el-input>
        </el-form-item>
        <el-form-item label='货币符号' prop='currencySymbol'>
          <el-input v-model='currencyForm.currencySymbol'></el-input>
        </el-form-item>
        <el-form-item label='汇率' prop='exchangeRate'>
          <el-input v-model='currencyForm.exchangeRate'></el-input>
        </el-form-item>
        <el-form-item label='备注'>
          <el-input v-model='currencyForm.remark'></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('currencyForm')">确 定</el-button>
        <el-button @click="addCurrencyModal = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--查看详情-->
    <el-dialog title='货币汇率详情信息' :visible.sync='viewCurrencyModal' :close-on-click-modal='false'>
      <el-form :model='currencyForm' ref='currencyForm' label-width='120px'>
        <el-form-item label='货币名称：'>
          <span>{{currencyForm.currencyName}}</span>
        </el-form-item>
        <el-form-item label='货币编码：'>
          <span>{{currencyForm.currencyCode}}</span>
        </el-form-item>
        <el-form-item label='货币符号：'>
          <span>{{currencyForm.currencySymbol}}</span>
        </el-form-item>
        <el-form-item label='汇率：'>
          <span>{{currencyForm.exchangeRate}}</span>
        </el-form-item>
        <el-form-item label='备注：'>
          <span>{{currencyForm.remark}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="viewCurrencyModal=false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 删除-->
    <el-dialog title="温馨提示" :visible.sync="delCurrencyModal" :close-on-click-modal="false" center width="30%">
      <div class="del-dialog-cnt textCen">确认要删除该数据吗？</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium">是</el-button>
        <el-button @click="delCurrencyModal=false" size="medium">否</el-button>
      </span>
    </el-dialog>
    <!--关联国家-->
    <el-dialog :title='currencyTitle' :visible.sync='relationCountryModal' :close-on-click-modal='false'>
      <country></country>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="relationCountryModal=false">确 定</el-button>
        <el-button @click="relationCountryModal = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--关联国家列表-->
    <el-dialog :title='currencyTitle' :visible.sync='relaCountryListModal' :close-on-click-modal='false' width='50%'>
      <div>
        <el-collapse-transition>
          <div class="searchBox mb20">
            <el-form ref="searchForm" :model="searchForm" class="form-item" label-width="80px">
              <el-row>
                <el-col :xs="24" :span="10">
                  <el-form-item label="国家">
                    <el-input v-model="searchForm.countryId" placeholder="请输入国家"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :span="5" class="ml20">
                  <el-button type="primary" size="medium">查询</el-button>
                  <el-button size="medium" @click='resetSearch'>重置</el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-collapse-transition>
        <div class="mb20">
          <el-button type="danger" size="small" :disabled="disabled1" @click="relieveAssociation">
            <i class="el-icon-sort"></i> 解除关联</el-button>
        </div>
        <div class="mt10">
          <el-table :data="tableData" v-model='loading' border style="width: 100%" @selection-change="handleSelectionCountry">
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index" align="center" width="50"></el-table-column>
            <el-table-column prop="CountryId" label="国家名称" align="center">
            </el-table-column>
            <el-table-column prop="Numbers" label="国家简写" align="center"></el-table-column>
            <el-table-column prop="OrderNote" label="备注" align="center"></el-table-column>
          </el-table>
          <div class="mt30">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
              :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="relaCountryListModal=false">确 定</el-button>
        <el-button @click="relaCountryListModal = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--解除关联弹窗-->
    <el-dialog title='温馨提示' :visible.sync='currencyModal' :close-on-click-modal='false' width='30%'>
      <div class="del-dialog-cnt textCen"><i class='el-icon-warning-outline fz50'></i>确认要解除选中国家与该货币汇率关联关系吗？</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium">是</el-button>
        <el-button @click="currencyModal=false" size="medium">否</el-button>
      </span>
    </el-dialog>
    <!--调整汇率-->
    <el-dialog title='调整汇率' :visible.sync='editRateModal' :close-on-click-modal='false' width='30%'>
      <el-input v-model='editRate' type='number'></el-input>
      <div slot='footer' class="dialog-footer">
        <el-button type='primary'>确认</el-button>
        <el-button @click='editRateModal=false'>取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import country from '../../common/relationCountry'
  export default {
    name: 'exchangeRate',
    data() {
      return {
        //				importHeaders: {
        //					enctype: 'multipart/form-data',
        //					cityCode: ''
        //				},
        //				name: 'import',
        //				fileList: [],
        //				withCredentials: true,
        //				processing: false,
        //				uploadTip: '点击上传',
        //				importFlag: 1,
        //				errorResults: []
        //				importUrl: 'http://192.168.111.103:52019',
        fileTemp: null,
        editRate: '0',
        editRateModal: false, //调整汇率
        serviceTitle: '',
        currencyTitle: '',
        currentPage: 1,
        pageSize: '0',
        total: 100,
        disabled: true,
        disabled1: true,
        loading: true,
        addCurrencyModal: false, //新增
        delCurrencyModal: false, //删除
        viewCurrencyModal: false, //查看详情
        relationCountryModal: false, //关联国家
        relaCountryListModal: false, //关联国家列表
        currencyModal: false, //解除关联
        importDataModal: false, //导入
        returnShow: false,
        dialogImportVisible: false,
        tipMessage: '',
        tableData: [{
            "Numbers": "20190605105636229596",
            "Picture": "",
            "CountryId": "美国",
            "Forum": "Amazon",
            "ProductByASIN": "$",
            "ProductPrice": 15.99,
            "ServiceType": "不留评",
            "OrderNote": "待付款",
            "Status": "已完成",
            "OrderNumber": 0.8,
            "OrderTime": "2019-02-03T00:00:00",
            "Remark": 90
          },
          {
            "Numbers": "20190611174157617041",
            "Picture": "",
            "CountryId": "德国",
            "Forum": "Amazon",
            "ProductByASIN": "DD",
            "ProductPrice": 18.99,
            "ServiceType": "不留评",
            "OrderNote": "待确认",
            "Status": "已完成",
            "OrderNumber": 0.9,
            "OrderTime": "2019-04-02T00:00:00",
            "Remark": 100
          }
        ],
        checkBoxData: [], //选中信息
        countryCheckBoxData: [], //国家列表选中信息
        searchForm: {
          currency: ''
        },
        currencyForm: {
          currencyName: '',
          currencyCode: '',
          currencySymbol: '',
          exchangeRate: '',
          remark: ''
        },
        formRules: {
          currencyName: [{
            required: true,
            message: '请输入货币名称',
            trigger: 'blur'
          }],
          currencyCode: [{
            required: true,
            message: '请输入货币编码',
            trigger: 'blur'
          }],
          currencySymbol: [{
            required: true,
            message: '请输入货币符号',
            trigger: 'blur'
          }],
          exchangeRate: [{
            required: true,
            message: '请输入汇率',
            trigger: 'blur'
          }]
        }
      }
    },
    components: {
      country
    },
    created() {
      //			this.getAllData()
    },
    methods: {
      //调整汇率
      editExchangeRate(index, row) {
        let _this = this
        _this.editRateModal = true
      },
      handleChange(file, fileList) {
        this.fileTemp = file.raw
      },
      handleRemove(file, fileList) {
        this.fileTemp = null
      },
      handleExceed(file, fileList) {
        if (this.fileTemp) {
          if ((this.fileTemp.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || (this.fileTemp
              .type == 'application/vnd.ms-excel')) {
            this.importf(this.fileTemp)
          } else {
            this.$message({
              type: 'warning',
              message: '附件格式错误，请删除后重新上传！'
            })
          }
        } else {
          this.$message({
            type: 'warning',
            message: '请上传附件！'
          })
        }

      },
      //导入弹窗
      importData() {
        let _this = this
        //				_this.importDataModal = true
        _this.dialogImportVisible = true
      },
      //解除关联
      relieveAssociation() {
        let _this = this
        _this.currencyModal = true
      },
      //关联国家列表
      viewCountryNum(index, row) {
        let _this = this
        let item = _this.tableData[index]
        let title = item.CountryId
        _this.currencyTitle = '货币[' + title + ']关联国家列表'
        _this.relaCountryListModal = true
      },
      //关联国家
      relationCountry() {
        let _this = this
        _this.relationCountryModal = true
        let country = _this.checkBoxData[0].CountryId
        console.log(country)
        _this.currencyTitle = '货币' + country + '关联国家'
      },
      //添加确定
      submitForm(formName) {
        let _this = this
        let param = {
          Currency: _this.currencyForm.currencyName,
          Code: _this.currencyForm.currencyCode,
          Unit: _this.currencyForm.currencySymbol,
          Rate: _this.currencyForm.exchangeRate,
          remark: _this.currencyForm.remark
        }
        _this.$refs[formName].validate((valid) => {
          if (valid) {
            _this.axios.post(_this.GLOBAL.BASE_URL + '/getFlatRate', param).then((res) => {
              if (res.data.success == '200') {
                let data = res.data
                console.log(data)
                console.log(data.success)
                _this.$message.success('添加成功')
                _this.addCurrencyModal = false
              }
            }).catch((error) => {
              console.log(error)
            })
          } else {
            return false
          }
        })
      },
      //重置
      resetSearch() {
        let _this = this
        _this.searchForm = {
          country: ''
        }
      },
      //查看详情
      viewCountryDetails(index, row) {
        let _this = this
        let item = _this.tableData[index]
        _this.currencyForm.currencyName = item.CountryId
        _this.viewCurrencyModal = true
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
          }), '货币汇率.xlsx')
        } catch (e) {
          if (typeof console !== 'undefined') {
            console.log(e, wbout)
          }
        }
        return wbout
      },
      //新建弹窗
      addService() {
        let _this = this
        _this.addCurrencyModal = true
        _this.serviceTitle = '货币汇率新增'
      },
      //修改弹窗
      editService() {
        let _this = this
        _this.addCurrencyModal = true
        _this.serviceTitle = '货币汇率修改'
      },
      //关闭新增弹窗
      closeModal() {
        let _this = this
        _this.addCurrencyModal = false
      },
      //初始化数据
      getAllData() {
        let _this = this
        _this.active = 1
        _this.axios.get(_this.GLOBAL.BASE_URL + 'api/OrderManagement/AddOrderByType').then((res) => {
          _this.tableData = res.data.data
          _this.loading = false
        }).catch((error) => {
          console.log(error)
        })
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
        let _this = this
        _this.checkBoxData = val
        let checkNum = this.checkBoxData.length
        if (checkNum == 1) {
          _this.disabled = false
        } else {
          _this.disabled = true
        }
      },
      handleSelectionCountry(val) {
        let _this = this
        _this.countryCheckBoxData = val
        let checkNum = this.countryCheckBoxData.length
        if (checkNum == 1) {
          _this.disabled1 = false
        } else {
          _this.disabled1 = true
        }
      },
      //无效订单
      delHandel() {
        let _this = this
        _this.delCurrencyModal = true

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
