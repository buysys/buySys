<template>
  <div>
    <el-collapse-transition>
      <div class="searchBox mb20">
        <el-form ref="searchForm" :model="searchForm" class="form-item" label-width="80px">
          <el-row>
            <el-col :xs="24" :span="4">
              <el-form-item label="平台名称">
                <el-input v-model="searchForm.searchkeywords" placeholder="请输入平台名称" size="small"></el-input>
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
      <el-button type="primary" size="small" :disabled="disabled" @click="editModalShow"><i class="el-icon-edit-outline"></i>修改</el-button>
      <el-button type="danger" size="small" :disabled="disabled" @click="glAllCountry"><i class="el-icon-sort"></i>
        关联国家</el-button>
      <el-button type="success" size="small" :disabled="disabled" @click="viewTaskModalShow"><i class="el-icon-document"></i>
        平台任务</el-button>
      <el-button type="warning" size="small" @click="drModalShow"><i class="el-icon-download"></i> 导入</el-button>
      <el-button type="warning" size="small" @click="exportExcel"><i class="el-icon-upload2"></i> 导出</el-button>
    </div>
    <div class="mt10">
      <el-table v-loading="loading" element-loading-text="拼命加载中" border :data="tableData" id="exportTable" style="width: 100%"
        :header-cell-style="{background:'#fafafa'}" @selection-change="handleSelectionChange" @row-click="rowClick" ref="table">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
        <el-table-column prop="Platform" label="平台名称" align="center"></el-table-column>
        <el-table-column prop="countryNum" label="已关联国家" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="glCountry(scope.$index,scope.row)">{{scope.row.countryNum}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="Status" label="禁用 | 启用" align="center">
          <template slot-scope="scope">
            <el-switch active-color="#67c23a" inactive-color="#dcdfe6" :active-value="1" :inactive-value="0" v-model="scope.row.Status"
              @change="changeStatus(scope.$index,scope.row)">
            </el-switch>
          </template>
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
    <!-- 新增修改 -->
    <el-dialog :title="title" :visible.sync="editModal" :close-on-click-modal="false" :before-close="closeModal" width="30%">
      <el-form :model='editForm' ref='editForm' :rules='Rules' label-width='80px' status-icon>
        <el-form-item label="平台名称" prop="Platform">
          <el-input v-model="editForm.Platform" autofocus="true"></el-input>
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
      <relationUrl @func="getValueFormSon"></relationUrl>
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
        <el-button type="danger" size="small" :disabled="disabledMore1" @click="removeBind"><i class="el-icon-close"></i>
          解除关联</el-button>
        <el-button type="warning" size="small" :disabled="disabled1" @click="editWebAddress"><i class="el-icon-check"></i>
          确认编辑</el-button>
      </div>
      <div class="mt10">
        <el-table border :data="countryData" style="width: 100%" :header-cell-style="{background:'#fafafa'}"
          @selection-change="handleSelectionChange2" @row-click="rowClick2" ref="table2">
          <el-table-column type="selection" align="center"></el-table-column>
          <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
          <el-table-column prop="Country" label="国家名称" align="center"></el-table-column>
          <el-table-column prop="CountryCode" label="国家简写" align="center"></el-table-column>
          <el-table-column prop="address" label="网址" width="300">
            <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.address" placeholder="请输入网址"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 平台任务 -->
    <el-dialog :title='title' :visible.sync="platformTaskModel" :close-on-click-modal="false" width="60%">
      <orderTask :funv='passValueToSon' :key='passValueToSon'></orderTask>
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
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'

  import relationUrl from '../../common/relationUrl'
  import orderTask from '../../common/orderTask'
  export default {
    name: 'platform',
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
        drModal: false, //导入弹框
        allCountryModal: false, //关联(所有国家)
        countryModal: false, //关联国家列表
        bindModel: false, //绑定网址弹框
        platformTaskModel: false, //平台任务
        disabled1: true,
        disabledMore1: true,
        tableData: [],
        checkBoxData: [],
        countryData: [],
        countryCheckBoxData: [], //国家列表选中信息
        passValueToSon: '', //准备传往子组件的数据
        webAddres: '',
        searchForm: {
          searchkeywords: ''
        },
        searchForm2: {
          searchkeywords: ''
        },
        editForm: {
          Platform: ''
        },
        Rules: {
          Platform: [{
            required: true,
            message: '请输入平台名称',
            trigger: 'blur'
          }]
        },
      }
    },
    components: {
      relationUrl,
      orderTask
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
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBPlatformList', param).then((res) => {
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
            _this.tableData = res.data.data.Platforms
            _this.total = res.data.data.TotalRecords
            _this.loading = false
          }
        }).catch((error) => {
          console.log(error)
        })
      },

      // 新增弹框
      addModalShow() {
        let _this = this
        _this.editModal = true
        _this.title = '平台新增'
        _this.doType = 'add'
      },

      // 新增
      addSubmit() {
        let _this = this
        _this.$refs.editForm.validate((valid) => {
          if (valid) {
            let param = Object.assign({}, this.editForm)
            let SessionId = sessionStorage.getItem('sessionid')
            param.SessionId = SessionId
            _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBPlatformNew', param).then((res) => {
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
        _this.title = '平台修改'
        _this.disabledEdit = true
        _this.doType = 'edit'
        let data = _this.checkBoxData[0]
        _this.editForm = {
          Platform: data.Platform
        }
      },

      // 修改
      editSubmit() {
        let _this = this
        _this.$refs.editForm.validate((valid) => {
          if (valid) {
            let param = {
              SessionId: sessionStorage.getItem('sessionid'),
              Platform: _this.editForm.Platform,
              PlatformId: _this.checkBoxData[0].Id
            }
            _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBPlatformUpdate', param).then((res) => {
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

      // 更改状态
      changeStatus(index, row) {
        let _this = this
        let param = {
          SessionId: sessionStorage.getItem('sessionid'),
          PlatformId: row.Id,
          Enabled: row.Enabled
        }
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBPlatformEnable', param).then((res) => {
          _this.$alert(res.data.message, '信息提示', {
            confirmButtonText: '确定',
            callback: action => {
              _this.getAllData()
            }
          })
        })
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
        _this.editForm = {
          Platform: ''
        }
      },

      //关联国家弹框（展示所有国家）
      glAllCountry() {
        let _this = this
        _this.allCountryModal = true
        let txt = _this.checkBoxData[0].Platform
        _this.title = '【' + txt + '】 关联国家'
      },

      //获取子组件的值关联
      getValueFormSon(ids) {
        let _this = this
        let param = {
          SessionId: sessionStorage.getItem('sessionid'),
          PlatformId: Number(_this.checkBoxData[0].Id),
          CountryIds: ids
        }
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBPlatformCountryBind', param).then((res) => {
          _this.$alert(res.data.message, '信息提示', {
            confirmButtonText: '确定',
            callback: action => {
              _this.allCountryModal = false
              _this.getAllData()
            }
          })
        })
      },

      //关联国家弹窗（该平台关联国家）
      glCountry(index, row) {
        let _this = this
        _this.countryModal = true
        let txt = row.Platform
        _this.title = '【' + txt + '】 已关联国家'
        _this.getCountryForCurrency(row.Id)
      },

      //获取该平台关联的国家数据
      getCountryForCurrency(PlatformId) {
        let _this = this
        let param = {
          SessionId: sessionStorage.getItem('sessionid'),
          SearchTerm: _this.searchForm2.searchkeywords,
          Page: _this.currentPage,
          OffSet: _this.pageSize,
          PlatformId: PlatformId
        }
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBPlatformCountryList', param).then((res) => {
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
            _this.countryData = res.data.data.Countries
            _this.total = res.data.data.TotalRecords
            _this.loading = false
          }
        }).catch((error) => {
          console.log(error)
        })
      },

      //重置该平台关联国家搜索条件
      resetSearch2() {
        let _this = this
        _this.searchForm2 = {
          searchkeywords: ''
        }
        _this.getCountryForCurrency()
      },

      //选中行(平台关联的国家)
      rowClick2(val) {
        let _this = this
        _this.$refs.table2.clearSelection()
        _this.$refs.table2.toggleRowSelection(val, true)
        _this.countryCheckBoxData[0] = val
      },

      // 是否有选中（平台关联的国家）
      handleSelectionChange2(val) {
        let _this = this
        _this.countryCheckBoxData = val
        let checkNum = _this.countryCheckBoxData.length
        if (checkNum == 1) {
          _this.disabled1 = false
          _this.disabledMore1 = false
        } else if (checkNum > 1) {
          _this.disabled1 = true
          _this.disabledMore1 = false
        } else {
          _this.disabled1 = true
          _this.disabledMore1 = true
        }
      },

      //解除国家关联
      removeBind() {
        let _this = this
        var ids = _this.countryCheckBoxData.map(item => item.CountryCode)
        _this.$confirm('确认要解除选中的国家吗？', '信息提示', {
          type: 'warning'
        }).then(() => {
          let param = {
            SessionId: sessionStorage.getItem('sessionid'),
            PlatformId: Number(_this.checkBoxData[0].Id),
            CountryIds: ids
          }
          _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBPlatformCountryUnBind', param).then((res) => {
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

      // 确认编辑
      editWebAddress() {
        let _this = this
        let ids = _this.countryData.map(item => ({
          CountryCode: item.CountryCode,
          URL: item.address
        }))
        let param = {
          SessionId: sessionStorage.getItem('sessionid'),
          PlatformId: Number(_this.checkBoxData[0].Id),
          CountryIds: ids
        }
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBPlatformCountryBindUpdate', param).then((res) => {
          _this.$alert(res.data.message, '信息提示', {
            confirmButtonText: '确定',
            callback: action => {
              _this.countryModal = false
              _this.getAllData()
            }
          })
        })
      },

      //平台任务
      viewTaskModalShow() {
        let _this = this
        _this.platformTaskModel = true
        let txt = _this.checkBoxData[0].Platform
        _this.title = '【' + txt + '】 任务'
        _this.passValueToSon = _this.checkBoxData[0].Id
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
          }), '平台管理.xlsx')
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
