<template>
  <div>
    <el-collapse-transition>
      <div class="searchBox mb20">
        <el-form ref="searchForm" :model="searchForm" class="form-item" label-width="80px">
          <el-row>
            <el-col :xs="24" :span="4">
              <el-form-item label="平台">
                <template>
                  <el-select v-model="searchForm.PlatformId" placeholder="请选择平台" size="small">
                    <el-option v-for="item in PlatformIdData" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :span="4">
              <el-form-item label="服务类型">
                <el-input v-model="searchForm.searchkeywords" placeholder="请输入服务类型" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :span="4">
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
      <el-button type="primary" size="small" @click="editModalShow" :disabled="disabled"><i class="el-icon-edit-outline"></i>
        修改</el-button>
      <el-button type="danger" size="small" @click="delData" :disabled="disabledMore"><i class="el-icon-delete"></i> 删除</el-button>
      <el-button type="warning" size="small" @click="drModalShow"><i class="el-icon-download"></i> 导入</el-button>
      <el-button type="warning" size="small" @click="exportExcel"><i class="el-icon-upload2"></i> 导出</el-button>
    </div>
    <div class="mt10">
      <el-table border :data="tableData" id="exportTable" style="width: 100%" :header-cell-style="{background:'#fafafa'}"
        @selection-change="handleSelectionChange" @row-click="rowClick" ref="table">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
        <el-table-column prop="ServiceType" label="归属类型" align="center" :formatter="toTxt1"></el-table-column>
        <el-table-column prop="PlatformId" label="平台" align="center" :formatter="toTxt2"></el-table-column>
        <el-table-column prop="Country" label="国家" align="center"></el-table-column>
        <el-table-column prop="Service" label="服务类型" align="center"></el-table-column>
        <el-table-column prop="CommentRate" label="留评比例" align="center"></el-table-column>
        <el-table-column prop="UnitPrice" label="每单服务费(￥)" align="center"></el-table-column>
      </el-table>
      <div class="table-foot">
        <div>
          <p class="mt10 fz14 red">平台服务费 = 订单数量 * 每单服务费</p>
        </div>
        <div>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 新增修改 -->
    <el-dialog :title="title" :visible.sync="editModal" :close-on-click-modal="false" :before-close="closeModal">
      <div>
        <el-form :model='editForm' ref='editForm' :rules='Rules' label-width='120px' status-icon>
          <el-form-item label="归属类型" prop="ServiceType">
            <template>
              <el-select v-model="editForm.ServiceType" placeholder="请选择归属类型" @change="show=!show" style="width: 100%;">
                <el-option v-for="item in ServiceTypeData" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="平台" prop="PlatformId" v-if="show">
            <template>
              <el-select v-model="editForm.PlatformId" placeholder="请选择平台" style="width: 100%;">
                <el-option v-for="item in PlatformIdData" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="国家" prop="Country" v-if="show">
            <template>
              <el-select v-model="editForm.Country" placeholder="请选择国家" style="width: 100%;">
                <el-option v-for="item in countryData" :key="item.Code" :label="item.Country" :value="item.Code">
                </el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="服务类型" prop="Service">
            <el-input v-model="editForm.Service"></el-input>
          </el-form-item>
          <el-form-item label="留评比例" prop="CommentRate" v-if="show">
            <template>
              <el-select v-model="editForm.CommentRate" placeholder="请选择留评比例" style="width: 100%;">
                <el-option v-for="item in CommentRateData" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="服务费" prop="Fee">
            <el-input type="number" v-model.number="editForm.Fee"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSubmit" v-show="doType=='add'">确 定</el-button>
        <el-button type="primary" @click="editSubmit" v-show="doType=='edit'">确 定</el-button>
        <el-button @click="closeModal">取 消</el-button>
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
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
  export default {
    name: 'ServiceType',
    data() {
      return {
        loading: true,
        editModal: false, //新增修改
        drModal: false, //导入
        show: true, //显示与隐藏
        disabled: true, //单项禁用
        disabledMore: true, //多项禁用
        doType: '', //操作类型
        tableData: [],
        checkBoxData: [], //选中数据
        countryData: [], //国家数据
        title: '',
        currentPage: 1,
        pageSize: 10,
        total: 0,
        searchForm: {
          PlatformId: '',
          searchkeywords: ''
        },
        editForm: {
          ServiceType: 1,
          PlatformId: '',
          Country: '',
          Service: '',
          CommentRate: '',
          Fee: ''
        },
        Rules: {
          ServiceType: [{
            required: true,
            message: '请选择归属类型',
            trigger: 'blur'
          }],
          PlatformId: [{
            required: true,
            message: '请选择平台',
            trigger: 'blur'
          }],
          Country: [{
            required: true,
            message: '请选择国家',
            trigger: 'blur'
          }],
          Service: [{
            required: true,
            message: '请输入类型',
            trigger: 'blur'
          }],
          CommentRate: [{
            required: true,
            message: '请选择留评比例',
            trigger: 'blur'
          }],
          Fee: [{
            required: true,
            message: '请输入服务费',
            trigger: 'blur'
          }]
        },
        PlatformIdData: [{
          value: 1,
          label: '全部'
        }, {
          value: 2,
          label: 'Amazon'
        }],
        //新增修改归属类型下拉框
        ServiceTypeData: [{
          value: 1,
          label: '留评服务费'
        }, {
          value: 2,
          label: '系统服务费'
        }],
        //新增修改留评比例下拉框
        CommentRateData: [{
          value: 0,
          label: '不留评'
        }, {
          value: 0.1,
          label: '10%'
        }, {
          value: 0.3,
          label: '30%'
        }, {
          value: 0.5,
          label: '50%'
        }, {
          value: 0.7,
          label: '70%'
        }, {
          value: 1.0,
          label: '100%'
        }],
      }
    },
    created() {
      this.getAllData()
    },
    methods: {
      //归属类型数字转文字
      toTxt1(val) {
        if (val.ServiceType == 1) {
          return '留评服务费'
        }
        if (val.ServiceType == 2) {
          return '系统服务费'
        }
      },
      //平台数字转文字
      toTxt2(val) {
        if (val.PlatformId == 1) {
          return '全部'
        }
        if (val.PlatformId == 2) {
          return 'Amazon'
        }
      },

      //获取数据
      getAllData() {
        let _this = this
        let param = {
          SessionId: sessionStorage.getItem('sessionid'),
          PlatformId: Number(_this.searchForm.PlatformId),
          SearchTerm: _this.searchForm.searchkeywords,
          Page: _this.currentPage,
          OffSet: _this.pageSize,
        }
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBServiceList', param).then((res) => {
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
            _this.tableData = res.data.data.Services
            _this.total = res.data.data.TotalRecords
            _this.loading = false
          }
        }).catch((error) => {
          console.log(error)
        })
      },

      //获取国家数据
      getCountryData() {
        let _this = this
        let param = {
          SessionId: sessionStorage.getItem('sessionid'),
        }
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBServiceNewIn', param).then((res) => {
          _this.countryData = res.data.data.CountryList
        }).catch((error) => {
          console.log(error)
        })
      },

      // 新增弹框
      addModalShow() {
        let _this = this
        _this.editModal = true
        _this.title = '服务类型新增'
        _this.editForm.ServiceType = 1
        _this.show = true
        _this.doType = 'add'
        _this.getCountryData()
      },

      // 新增
      addSubmit() {
        let _this = this
        _this.$refs.editForm.validate((valid) => {
          if (valid) {
            let param = ''
            let param1 = Object.assign({}, this.editForm)
            let param2 = {
              ServiceType: _this.editForm.ServiceType,
              Service: _this.editForm.Service,
              Fee: _this.editForm.Fee,
            }
            if (_this.editForm.ServiceType == 1) {
              param = param1
            } else {
              param = param2
            }
            let SessionId = sessionStorage.getItem('sessionid')
            param.SessionId = SessionId
            _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBServiceNew', param).then((res) => {
              _this.$alert(res.data.message, '信息提示', {
                confirmButtonText: '确定',
                callback: action => {
                  _this.$refs['editForm'].resetFields()
                  _this.editModal = false
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
        _this.title = '服务类型修改'
        _this.doType = 'edit'
        _this.getCountryData()
        let data = _this.checkBoxData[0]
        if (data.ServiceType == 1) {
          _this.show = true
        } else {
          _this.show = false
        }
        data.Fee = data.UnitPrice
        _this.editForm = Object.assign({}, data)
      },

      // 修改
      editSubmit() {
        let _this = this
        _this.$refs.editForm.validate((valid) => {
          if (valid) {
            let param = ''
            let param1 = Object.assign({}, this.editForm)
            let param2 = {
              ServiceId: _this.editForm.ServiceId,
              ServiceType: _this.editForm.ServiceType,
              Service: _this.editForm.Service,
              Fee: _this.editForm.Fee,
            }
            if (_this.editForm.ServiceType == 1) {
              param = param1
            } else {
              param = param2
            }
            param.SessionId = sessionStorage.getItem('sessionid')
            param.ServiceId = _this.checkBoxData[0].Id
            _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBServiceUpdate', param).then((res) => {
              _this.$alert(res.data.message, '信息提示', {
                confirmButtonText: '确定',
                callback: action => {
                  _this.$refs['editForm'].resetFields()
                  _this.editModal = false
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
            ServiceIds: ids
          }
          _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBServiceDel', param).then((res) => {
            _this.$alert(res.data.message, '信息提示', {
              confirmButtonText: '确定',
              callback: action => {
                _this.getAllData()
              }
            })
          })
        }).catch(() => {})
      },

      // 重置
      resetSearch() {
        let _this = this
        _this.searchForm = {
          PlatformId: '',
          searchkeywords: ''
        }
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

      // 导入
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
          }), '服务类型.xlsx')
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
