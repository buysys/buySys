<template>
  <div>
    <el-collapse-transition>
      <div class="searchBox mb20">
        <el-form ref="searchForm" :model="searchForm" class="form-item" label-width="80px">
          <el-row>
            <el-col :xs="24" :span="4">
              <el-form-item label="国家名称">
                <el-input v-model="searchForm.searchkeywords" placeholder="请输入国家名称" size="small"></el-input>
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
      <el-button type="primary" size="small" :disabled="disabled" @click="editModalShow">
        <i class="el-icon-edit-outline"></i> 修改</el-button>
      <el-button type="warning" size="small" @click="drModalShow"><i class="el-icon-download"></i> 导入</el-button>
      <el-button type="warning" size="small" @click="exportExcel"><i class="el-icon-upload2"></i> 导出</el-button>
    </div>
    <div class="mt10">
      <el-table border :data="tableData" id="exportTable" style="width: 100%" :header-cell-style="{background:'#fafafa'}"
        @selection-change="handleSelectionChange" @row-click="rowClick" ref="table">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
        <el-table-column prop="Country" label="国家名称" align="center"></el-table-column>
        <el-table-column prop="Code" label="国家简写" align="center"></el-table-column>
        <el-table-column prop="Language" label="语言" align="center"></el-table-column>
        <el-table-column prop="TimeZone" label="时区" align="center"></el-table-column>
        <el-table-column prop="GMT" label="GMT时区" align="center"></el-table-column>
        <el-table-column prop="minPort" label="最小端口" align="center"></el-table-column>
        <el-table-column prop="maxPort" label="最大端口" align="center"></el-table-column>
        <el-table-column prop="Enabled" label="禁用 | 启用" align="center">
          <template slot-scope="scope">
            <el-switch active-color="#67c23a" inactive-color="#dcdfe6" :active-value="1" :inactive-value="0" v-model="scope.row.Enabled"
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
    <!--新增/修改-->
    <el-dialog :title='title' :visible.sync='editModal' :close-on-click-modal='false'>
      <el-form :model='editForm' ref='editForm' :rules='Rules' label-width='120px' status-icon>
        <el-form-item label='国家名称' prop='CountryName'>
          <el-input v-model='editForm.CountryName'></el-input>
        </el-form-item>
        <el-form-item label='国家简写' prop='CountryCode'>
          <el-input v-model='editForm.CountryCode'></el-input>
        </el-form-item>
        <el-form-item label='语言' prop='Language'>
          <el-input v-model='editForm.Language'></el-input>
        </el-form-item>
        <el-form-item label='时区' prop='TimeZone'>
          <el-input v-model='editForm.TimeZone'></el-input>
        </el-form-item>
        <el-form-item label='GMT时区' prop='GMT'>
          <el-input v-model='editForm.GMT'></el-input>
        </el-form-item>
        <el-form-item label='最小端口' prop="minPort">
          <el-input v-model='editForm.minPort'></el-input>
        </el-form-item>
        <el-form-item label='最大端口' prop="maxPort">
          <el-input v-model='editForm.maxPort'></el-input>
        </el-form-item>
      </el-form>
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
  export default {
    name: 'countryManage',
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
        drModal: false, //导入
        tableData: [],
        checkBoxData: [], //选中数据
        searchForm: {
          searchkeywords: ''
        },
        editForm: {
          CountryName: '',
          CountryCode: '',
          Language: '',
          TimeZone: '',
          GMT: '',
          minPort: '',
          maxPort: ''
        },
        Rules: {
          CountryName: [{
            required: true,
            message: '请输入国家名称',
            trigger: 'blur'
          }]
        }
      }
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
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBCountryList', param).then((res) => {
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
            _this.tableData = res.data.data.BCountris
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
        _this.title = '国家新增'
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
            _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBCountryNew', param).then((res) => {
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
        _this.title = '国家修改'
        _this.doType = 'edit'
        let data = _this.checkBoxData[0]
        data.CountryName = data.Country
        data.CountryCode = data.Code
        _this.editForm = Object.assign({}, data)
      },

      // 修改
      editSubmit() {
        let _this = this
        _this.$refs.editForm.validate((valid) => {
          if (valid) {
            let param = Object.assign({}, this.editForm)
            param.SessionId = sessionStorage.getItem('sessionid')
            param.Id = _this.checkBoxData[0].Id
            _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBCountryUpdate', param).then((res) => {
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

      // 更改状态
      changeStatus(index, row) {
        let _this = this
        let param = {
          SessionId: sessionStorage.getItem('sessionid'),
          CountryCode: row.Code,
          Enabled: row.Enabled
        }
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBCountryEnable', param).then((res) => {
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

      // 重置
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
          }), '国家管理.xlsx')
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
