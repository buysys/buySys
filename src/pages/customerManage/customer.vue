<template>
  <div class="container">
    <div class="mb20 fz14">
      <span>首页</span>
      <span>/</span>
      <span>客户管理</span>
    </div>
    <el-collapse-transition>
      <div class="searchBox mb20">
        <el-form ref="searchForm" :model="searchForm" class="form-item" label-width="80px">
          <el-row>
            <el-col :xs="24" :span="6">
              <el-form-item label="搜索内容">
                <el-input v-model="searchForm.searchkeywords" placeholder="请输入客户编码/姓名/手机号/邮箱/微信/QQ" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :span="18">
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
      <el-button type="danger" size="small" :disabled="disabled" @click="logModalShow"><i class="el-icon-search"></i>
        日志</el-button>
      <el-button type="warning" size="small" @click="exportExcel"><i class="el-icon-upload2"></i> 导出</el-button>
    </div>
    <div class="mt10">
      <el-table border :data="tableData" id="exportTable" style="width: 100%" :header-cell-style="{background:'#fafafa'}"
        @selection-change="handleSelectionChange" @row-click="rowClick" ref="table">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
        <el-table-column prop="ClientCode" label="编码" align="center" width="200">
          <template slot-scope="scope">
            <el-button type="text" @click="viewModalShow(scope.$index,scope.row)">{{scope.row.ClientCode}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="Name" label="姓名" align="center"></el-table-column>
        <el-table-column prop="PhoneNumber" label="手机" align="center"></el-table-column>
        <el-table-column prop="Email" label="邮箱" align="center"></el-table-column>
        <el-table-column prop="WeChat" label="微信" align="center"></el-table-column>
        <el-table-column prop="QQ" label="QQ" align="center"></el-table-column>
        <el-table-column prop="UserId" label="所属业务员" align="center"></el-table-column>
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
    <!-- 新增修改 -->
    <el-dialog :title="title" :visible.sync="editModal" :close-on-click-modal="false" :before-close="closeModal">
      <el-form :model="editForm" ref="editForm" :rules="Rules" label-width="120px" status-icon>
        <el-form-item label="姓名" prop="Name">
          <el-input v-model="editForm.Name"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="Mobile">
          <el-input v-model="editForm.Mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="Email">
          <el-input v-model="editForm.Email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="Password">
          <el-input v-model="editForm.Password"></el-input>
        </el-form-item>
        <el-form-item label="所属业务员" prop="BUserId">
          <el-select v-model="editForm.BUserId" placeholder="请选择所属业务员" style="width: 100%;">
            <el-option v-for="item in BUserData" :key="item.Id" :label="item.UserName" :value="item.Id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="微信" prop="WeChat">
          <el-input v-model="editForm.WeChat"></el-input>
        </el-form-item>
        <el-form-item label="QQ" prop="QQ">
          <el-input v-model="editForm.QQ"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="Memo">
          <el-input type="textarea" :rows="3" v-model="editForm.Memo"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSubmit" v-show="doType=='add'">确 定</el-button>
        <el-button type="primary" @click="editSubmit" v-show="doType=='edit'">确 定</el-button>
        <el-button @click="closeModal">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 查看 -->
    <el-dialog :title="title" :visible.sync="viewModal" :close-on-click-modal="false">
      <el-form :model="viewForm" status-icon class="demo-item">
        <el-row>
          <el-col :span="12" :xs="24">
            <el-form-item label="编码："><span>{{viewForm.ClientCode}}</span></el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="姓名："><span>{{viewForm.Name}}</span></el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="手机："><span>{{viewForm.PhoneNumber}}</span></el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="邮箱："><span>{{viewForm.Email}}</span></el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="密码："><span>{{viewForm.Password}}</span></el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="所属业务员："><span>{{viewForm.UserId}}</span></el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="微信："><span>{{viewForm.WeChat}}</span></el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="QQ："><span>{{viewForm.QQ}}</span></el-form-item>
          </el-col>
          <el-col :span="24" :xs="24">
            <el-form-item label="备注："><label>{{viewForm.Memo}}</label></el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="最后登录IP："><span>{{viewForm.LastLoginAddress}}</span></el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="最后登录时间："><span>{{viewForm.LastLoginTime}}</span></el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="创建时间："><span>{{viewForm.CreateTime}}</span></el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="viewModal=false">关 闭</el-button>
      </div>
    </el-dialog>
    <!--日志-->
    <el-dialog :title="title" :visible.sync="logModal" :close-on-click-modal="false" :before-close="closeModal2">
      <el-collapse-transition>
        <div class="searchBox mb20">
          <el-form ref="searchForm2" :model="searchForm2" class="form-item" :inline='true' label-width="80px">
            <el-form-item label="时间">
              <el-date-picker v-model="searchForm2.start" type="date" placeholder="选择开始时间" value-format="yyyy-MM-dd"
                size="small"></el-date-picker>
              <span>-</span>
              <el-date-picker v-model="searchForm2.end" type="date" placeholder="选择结束时间" value-format="yyyy-MM-dd" size="small"></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="getLogData">查询</el-button>
              <el-button size="small" @click="resetSearch2">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-transition>
      <div class="mt10">
        <el-table border :data="logData" style="width: 100%" :header-cell-style="{background:'#fafafa'}">
          <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
          <el-table-column prop="OrderId" label="订单" align="center"></el-table-column>
          <el-table-column prop="ActionName" label="操作" align="center"></el-table-column>
          <el-table-column prop="ActDate" label="时间" align="center"></el-table-column>
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
  </div>
</template>

<script>
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'

  export default {
    name: 'customer',
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
        viewModal: false, //查看
        drModal: false, //导入
        logModal: false, //日志
        tableData: [],
        checkBoxData: [], //选中数据
        BUserData: [], //业务员数据
        logData: [], //日志数据
        currentPage2: 1,
        pageSize2: 10,
        total2: 0,
        searchForm: {
          searchkeywords: ''
        },
        searchForm2: {
          start: '',
          end: ''
        },
        editForm: {
          Name: '',
          Password: '',
          Email: '',
          BUserId: '',
          Mobile: '',
          WeChat: '',
          QQ: '',
          Memo: ''
        },
        viewForm: {},
        Rules: {
          Name: [{
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }],
          Mobile: [{
              required: true,
              message: '请输入手机',
              trigger: 'blur'
            },
            {
              pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
              message: '请输入正确的手机号',
              trigger: ['blur', 'change']
            }
          ],
          Email: [{
              required: true,
              message: '请输入邮箱地址',
              trigger: 'blur'
            },
            {
              type: 'email',
              message: '请输入正确的邮箱地址',
              trigger: ['blur', 'change']
            }
          ],
          Password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }],
          BUserId: [{
            required: true,
            message: '请选择所属业务员',
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
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBClientList', param).then((res) => {
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
            _this.tableData = res.data.data.FUsers
            _this.total = res.data.data.TotalRecords
            _this.loading = false
          }
        }).catch((error) => {
          console.log(error)
        })
      },

      //获取业务员数据
      getBUserData() {
        let _this = this
        let param = {
          SessionId: sessionStorage.getItem('sessionid'),
        }
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doGetBUserListByRole', param).then((res) => {
          _this.BUserData = res.data.data.UserList
        }).catch((error) => {
          console.log(error)
        })
      },

      // 新增弹框
      addModalShow() {
        let _this = this
        _this.editModal = true
        _this.title = '客户新增'
        _this.doType = 'add'
        _this.getBUserData()
      },

      // 新增
      addSubmit() {
        let _this = this
        _this.$refs.editForm.validate((valid) => {
          if (valid) {
            let param = Object.assign({}, this.editForm)
            let SessionId = sessionStorage.getItem('sessionid')
            param.SessionId = SessionId
            _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBClientNew', param).then((res) => {
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
        _this.title = '客户修改'
        _this.doType = 'edit'
        let data = _this.checkBoxData[0]
        data.Mobile = data.PhoneNumber
        data.BUserId = data.UserId
        _this.getBUserData()
        _this.editForm = Object.assign({}, data)
      },

      // 修改
      editSubmit() {
        let _this = this
        _this.$refs.editForm.validate((valid) => {
          if (valid) {
            let param = {
              UserId: _this.checkBoxData[0].Id,
              Name: this.editForm.Name,
              Mobile: this.editForm.Mobile,
              Email: this.editForm.Email,
              Password: this.editForm.Password,
              BUserId: this.editForm.BUserId,
              WeChat: this.editForm.WeChat,
              QQ: this.editForm.QQ,
              Memo: this.editForm.Memo
            }
            param.SessionId = sessionStorage.getItem('sessionid')
            _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBClientUpdate', param).then((res) => {
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

      //查看
      viewModalShow(index, row) {
        let _this = this
        _this.viewModal = true
        _this.title = '客户信息'
        _this.viewForm = Object.assign({}, row)
      },

      // 更改状态
      changeStatus(index, row) {
        let _this = this
        let param = {
          SessionId: sessionStorage.getItem('sessionid'),
          UserId: row.Id,
          Enable: row.Enabled
        }
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBClientEnable', param).then((res) => {
          _this.$alert(res.data.message, '信息提示', {
            confirmButtonText: '确定',
            callback: action => {
              _this.getAllData()
            }
          })
        })
      },

      //日志弹框
      logModalShow() {
        let _this = this
        _this.logModal = true
        let txt = _this.checkBoxData[0].Name
        _this.title = '【' + txt + '】 日志信息'
        _this.getLogData()
      },

      //获取日志
      getLogData() {
        let _this = this
        let param = {
          SessionId: sessionStorage.getItem('sessionid'),
          UserId: _this.checkBoxData[0].Id,
          Page: _this.currentPage2,
          OffSet: _this.pageSize2,
          StartDate: _this.searchForm2.start,
          EndDate: _this.searchForm2.end
        }
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doGetBClientLogList', param).then((res) => {
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
            _this.logData = res.data.data.LogList
            _this.total2 = res.data.data.TotalRecords
            _this.loading = false
          }
        }).catch((error) => {
          console.log(error)
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

      // 重置日志查询
      resetSearch2() {
        let _this = this
        _this.searchForm2 = {
          start: '',
          end: ''
        }
        _this.getLogData()
      },

      //日志翻页
      handleSizeChange2(val) {
        let _this = this
        _this.pageSize2 = val
        _this.getLogData()
      },
      handleCurrentChange2(val) {
        let _this = this
        _this.currentPage2 = val
        _this.getLogData()
      },

      //关闭日志弹窗
      closeModal2() {
        let _this = this
        _this.logModal = false
        _this.searchForm2 = {
          start: '',
          end: ''
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
          }), '客户管理.xlsx')
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
