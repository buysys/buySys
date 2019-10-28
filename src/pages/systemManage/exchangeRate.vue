<template>
  <div>
    <el-collapse-transition>
      <div class="searchBox mb20">
        <el-form ref="searchForm" :model="searchForm" class="form-item" label-width="80px">
          <el-row>
            <el-col :xs="24" :span="4">
              <el-form-item label="货币名称">
                <el-input v-model="searchForm.searchkeywords" placeholder="请输入货币名称" size="small"></el-input>
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
      <el-button type="success" size="small" @click="addModalShow"><i class="el-icon-plus"></i> 新增</el-button>
      <el-button type="primary" size="small" :disabled="disabled" @click="editModalShow"><i class="el-icon-edit-outline"></i>
        修改</el-button>
      <el-button type="danger" size="small" :disabled="disabledMore" @click="delData"><i class="el-icon-delete"></i> 删除</el-button>
      <el-button type="danger" size="small" :disabled="disabled" @click="glAllCountry"><i class="el-icon-sort"></i>
        关联国家</el-button>
      <el-button type='primary' size='small' :disabled="disabled" @click='editRate'><i class="el-icon-edit-outline"></i>
        调整汇率</el-button>
      <el-button type="warning" size="small" @click="drModalShow"><i class="el-icon-download"></i> 导入</el-button>
      <el-button type="warning" size="small" @click="exportExcel"><i class="el-icon-upload2"></i> 导出</el-button>
    </div>
    <div class="mt10">
      <el-table v-loading="loading" element-loading-text="拼命加载中" border :data="tableData" id="exportTable" style="width: 100%"
        :header-cell-style="{background:'#fafafa'}" @selection-change="handleSelectionChange" @row-click="rowClick" ref="table">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
        <el-table-column prop="CurName" label="货币名称" align="center"></el-table-column>
        <el-table-column prop="CurCode" label="货币编码" align="center"></el-table-column>
        <el-table-column prop="CurSymbol" label="货币符号" align="center"></el-table-column>
        <el-table-column prop="ExRate" label="汇率" align="center"></el-table-column>
        <el-table-column prop="CountryNumber" label="已关联国家" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="glCountry(scope.$index,scope.row)">{{scope.row.CountryNumber}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="Memo" label="备注" align="center"></el-table-column>
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
    <!--新增/修改-->
    <el-dialog :title='title' :visible.sync='editModal' :close-on-click-modal='false' :before-close="closeModal">
      <el-form :model='editForm' ref='editForm' :rules='Rules' label-width='120px' status-icon>
        <el-form-item label="货币名称" prop="CurName">
          <template>
            <el-select v-model="editForm.CurName" placeholder="请选择货币名称" style="width: 100%;" @change="getCurrencyInfo()"
              :disabled="disabledEdit">
              <el-option v-for="item in currencyData" :key="item.CurrencyName" :label="item.CurrencyName" :value="item.CurrencyName">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label='货币编码' prop="CurCode">
          <el-input v-model='editForm.CurCode' :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label='货币符号' prop="CurSymbol">
          <el-input v-model='editForm.CurSymbol' :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label='汇率' prop="Rate">
          <el-input v-model='editForm.Rate'></el-input>
        </el-form-item>
        <el-form-item label='备注' prop="Memo">
          <el-input type="textarea" :rows="3" v-model='editForm.Memo'></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSubmit" v-show="doType=='add'">确 定</el-button>
        <el-button type="primary" @click="editSubmit" v-show="doType=='edit'">确 定</el-button>
        <el-button @click="closeModal">取 消</el-button>
      </div>
    </el-dialog>
    <!--关联国家-->
    <el-dialog :title='title' :visible.sync='allCountryModal' :close-on-click-modal='false'>
      <relationCountry @func="getValueFormSon"></relationCountry>
    </el-dialog>
    <!--关联国家列表-->
    <el-dialog :title='title' :visible.sync='countryModal' :close-on-click-modal='false'>
      <el-collapse-transition>
        <div class="searchBox mb20">
          <el-form ref="searchForm2" :model="searchForm2" class="form-item" label-width="80px">
            <el-row>
              <el-col :xs="24" :span="8">
                <el-form-item label="国家">
                  <el-input v-model="searchForm2.searchkeywords" placeholder="请输入国家" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :span="8">
                <el-form-item>
                  <el-button type="primary" size="small" @click="getCountryForCurrency">查询</el-button>
                  <el-button size="small" @click="resetSearch2">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-collapse-transition>
      <div class="mb20">
        <el-button type="danger" size="small" :disabled="disabledOther" @click="removeBind">
          <i class="el-icon-close"></i> 解除</el-button>
      </div>
      <div class="mt10">
        <el-table border :data="countryData" style="width: 100%" :header-cell-style="{background:'#fafafa'}"
          @selection-change="handleSelectionChange2" @row-click="rowClick2" ref="table2">
          <el-table-column type="selection" align="center"></el-table-column>
          <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
          <el-table-column prop="Country" label="国家名称" align="center"></el-table-column>
          <el-table-column prop="Currency" label="国家简写" align="center"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 导入-->
    <el-dialog title="导入数据" :visible.sync="drModal" :close-on-click-modal="false" center width="30%">
      <div class="del-dialog-cnt textCen"><input type="file" /></div><br>
      <div class="del-dialog-cnt textCen">导入文件不能超过5M，仅允许导入“xls”或“xlsx”格式文件！</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" size="medium">下载模板</el-button>
        <el-button type="primary" size="medium">确定</el-button>
        <el-button @click="drModal=false" size="medium">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import relationCountry from '../../common/relationCountry'
  export default {
    name: 'exchangeRate',
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
        editModal: false, //新增修改
        tableData: [],
        checkBoxData: [], //选中数据
        drModal: false, //导入
        currencyData: [], //货币数据
        allCountryModal: false, //关联(所有国家)
        countryModal: false, //关联国家列表
        countryData: [], //该货币关联国家数据
        countryCheckBoxData: [], //国家列表选中信息
        disabledEdit: false, //禁止修改
        disabledOther: true, //解绑按钮禁用
        searchForm: {
          searchkeywords: ''
        },
        searchForm2: {
          searchkeywords: ''
        },
        editForm: {
          CurName: '',
          CurCode: '',
          CurSymbol: '',
          Rate: '',
          Memo: ''
        },
        Rules: {
          CurName: [{
            required: true,
            message: '请选择货币名称',
            trigger: 'blur'
          }],
          Rate: [{
              required: true,
              message: '请输入汇率',
              trigger: 'blur'
            },
            {
              pattern: /^[0-9]+([.]{1}[0-9]+){0,1}$/,
              message: '汇率格式不正确',
              trigger: ['blur', 'change']
            }
          ]
        }
      }
    },
    components: {
      relationCountry
    },
    created() {
      this.getAllData()
    },
    methods: {
      //获取数据
      getAllData() {
        let _this = this
        let param = {
          SessionId: sessionStorage.getItem('sessionid'),
          SearchTerm: _this.searchForm.searchkeywords,
          Page: _this.currentPage,
          OffSet: _this.pageSize,
        }
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBExRateList', param).then((res) => {
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
            _this.tableData = res.data.data.ExRates
            _this.total = res.data.data.TotalRecords
            _this.loading = false
          }
        }).catch((error) => {
          console.log(error)
        })
      },

      //获取货币名称
      getCurrencyData() {
        let _this = this
        let param = {
          SessionId: sessionStorage.getItem('sessionid'),
        }
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBExRateNewIn', param).then((res) => {
          _this.currencyData = res.data.data.CurrencyList
        }).catch((error) => {
          console.log(error)
        })
      },

      //根据货币名称获取货币名称
      getCurrencyInfo() {
        let _this = this
        let param = {
          SessionId: sessionStorage.getItem('sessionid'),
          Currency: _this.editForm.CurName
        }
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBCurrencyDetais', param).then((res) => {
          _this.editForm.CurCode = res.data.data.Currency.CurrencyCode,
            _this.editForm.CurSymbol = res.data.data.Currency.CurrencySymbal
        }).catch((error) => {
          console.log(error)
        })
      },

      // 新增弹框
      addModalShow() {
        let _this = this
        _this.editModal = true
        _this.title = '货币汇率新增'
        _this.disabledEdit = false
        _this.doType = 'add'
        _this.getCurrencyData()
      },

      // 新增
      addSubmit() {
        let _this = this
        _this.$refs.editForm.validate((valid) => {
          if (valid) {
            let param = Object.assign({}, this.editForm)
            let SessionId = sessionStorage.getItem('sessionid')
            param.SessionId = SessionId
            param.Rate = Number(_this.editForm.Rate)
            _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBExRateNew', param).then((res) => {
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

      // 修改弹框
      editModalShow() {
        let _this = this
        _this.editModal = true
        _this.title = '货币汇率修改'
        _this.disabledEdit = true
        _this.doType = 'edit'
        let data = _this.checkBoxData[0]
        _this.editForm = {
          CurName: data.CurName,
          CurCode: data.CurCode,
          CurSymbol: data.CurSymbol,
          Rate: data.ExRate,
          Memo: data.Memo
        }
      },

      // 修改
      editSubmit() {
        let _this = this
        _this.$refs.editForm.validate((valid) => {
          if (valid) {
            let param = {
              SessionId: sessionStorage.getItem('sessionid'),
              CurId: Number(_this.checkBoxData[0].Id),
              Rate: Number(_this.editForm.Rate),
              Memo: _this.editForm.Memo
            }
            _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBExRateUpdate', param).then((res) => {
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

      // 删除
      delData() {
        let _this = this
        var ids = _this.checkBoxData.map(item => item.Id)
        _this.$confirm('确认删除选中的数据吗？', '信息提示', {
          type: 'warning'
        }).then(() => {
          let param = {
            SessionId: sessionStorage.getItem('sessionid'),
            RateIds: ids
          }
          _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBExRateDel', param).then((res) => {
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

      //重置
      resetSearch() {
        let _this = this
        _this.searchForm = {
          searchkeywords: ''
        }
        _this.getAllData()
      },

      //关闭新增修改弹窗
      closeModal() {
        let _this = this
        _this.editModal = false
        _this.$refs['editForm'].resetFields()
        _this.editForm = {
          CurName: '',
          CurCode: '',
          CurSymbol: '',
          Rate: '',
          Memo: ''
        }
      },

      //关联国家弹框（展示所有国家）
      glAllCountry() {
        let _this = this
        _this.allCountryModal = true
        let txt = _this.checkBoxData[0].CurName
        _this.title = '【' + txt + '】 关联国家'
      },

      //获取子组件的值关联
      getValueFormSon(ids) {
        let _this = this
        let param = {
          SessionId: sessionStorage.getItem('sessionid'),
          CurrencyId: Number(_this.checkBoxData[0].Id),
          CountryIds: ids
        }
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBExRateCountryBind', param).then((res) => {
          _this.$alert(res.data.message, '信息提示', {
            confirmButtonText: '确定',
            callback: action => {
              _this.allCountryModal = false
              _this.getAllData()
            }
          })
        })
      },

      //关联国家弹窗（该货币关联国家）
      glCountry(index, row) {
        let _this = this
        _this.title = '货币关联国家'
        _this.countryModal = true
        let txt = row.CurName
        _this.title = '【' + txt + '】 已关联国家'
        _this.getCountryForCurrency(row.CurCode)
      },

      //获取该货币关联的国家数据
      getCountryForCurrency(CurCode) {
        let _this = this
        let param = {
          SessionId: sessionStorage.getItem('sessionid'),
          SearchTerm: _this.searchForm2.searchkeywords,
          Page: _this.currentPage,
          OffSet: _this.pageSize,
          CurCode: CurCode
        }
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBExRateCountryList', param).then((res) => {
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
            _this.countryData = res.data.data.ExCountris
            _this.total = res.data.data.TotalRecords
            _this.loading = false
          }
        }).catch((error) => {
          console.log(error)
        })
      },

      //重置该货币关联国家搜索条件
      resetSearch2() {
        let _this = this
        _this.searchForm2 = {
          searchkeywords: ''
        }
        _this.getCountryForCurrency()
      },

      //选中行(货币关联的国家)
      rowClick2(val) {
        let _this = this
        _this.$refs.table2.clearSelection()
        _this.$refs.table2.toggleRowSelection(val, true)
        _this.countryCheckBoxData[0] = val
      },

      // 是否有选中（货币关联的国家）
      handleSelectionChange2(val) {
        let _this = this
        _this.countryCheckBoxData = val
        let checkNum = _this.countryCheckBoxData.length
        if (checkNum >= 1) {
          _this.disabledOther = false
        } else {
          _this.disabledOther = true
        }
      },

      //解除国家关联
      removeBind() {
        let _this = this
        var ids = _this.countryCheckBoxData.map(item => item.Code)
        _this.$confirm('确认要解除选中的国家吗？', '信息提示', {
          type: 'warning'
        }).then(() => {
          let param = {
            SessionId: sessionStorage.getItem('sessionid'),
            CurrencyId: Number(_this.checkBoxData[0].Id),
            CountryId: ids
          }
          _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBExRateCountryUnBind', param).then((res) => {
            _this.$alert(res.data.message, '信息提示', {
              confirmButtonText: '确定',
              callback: action => {
                _this.countryModal = false
                _this.getAllData()
              }
            })
          })
        }).catch(() => {})
      },

      //调整汇率
      editRate() {
        let _this = this
        this.$prompt('请输入汇率', '信息提示', {
          confirmButtonText: '确定',
          inputPattern: /^[0-9]+([.]{1}[0-9]+){0,1}$/,
          inputErrorMessage: '汇率格式不正确'
        }).then(({
          value
        }) => {
          let param = {
            SessionId: sessionStorage.getItem('sessionid'),
            CurId: Number(_this.checkBoxData[0].Id),
            AdjustRate: Number(value)
          }
          _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBExRateAdjust', param).then((res) => {
            _this.$alert(res.data.message, '信息提示', {
              confirmButtonText: '确定',
              callback: action => {
                _this.getAllData()
              }
            })
          })
        }).catch(() => {})
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
          }), '货币汇率.xlsx')
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
