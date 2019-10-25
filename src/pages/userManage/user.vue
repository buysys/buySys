<template>
  <div class="container">
    <div class="mb20 fz14">
      <span>首页</span>
      <span>/</span>
      <span>用户管理</span>
    </div>
    <div class="mt10">
      <el-collapse-transition>
        <div class="searchBox mb20">
          <el-form ref="searchForm" :model="searchForm" class="form-item" label-width="80px">
            <el-row>
              <el-col :xs="24" :span="4">
                <el-form-item label="搜索内容">
                  <el-input v-model="searchForm.searchkeywords" placeholder="请输入姓名/手机/邮箱" size="small"></el-input>
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
        <!-- <el-button type="danger" size="small" @click="roleModalShow" style="float: right;"><i class="el-icon-s-custom"></i>角色管理</el-button> -->
      </div>
      <div class="mt10">
        <el-table border :data="tableData" id="exportTable" style="width: 100%" :header-cell-style="{background:'#fafafa'}"
          @selection-change="handleSelectionChange" @row-click="rowClick" ref="table">
          <el-table-column type="selection" align="center"></el-table-column>
          <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
          <el-table-column prop="Name" label="姓名" align="center"></el-table-column>
          <el-table-column prop="Mobile" label="手机" align="center"></el-table-column>
          <el-table-column prop="Email" label="邮箱" align="center"></el-table-column>
          <el-table-column prop="Password" label="密码" align="center"></el-table-column>
          <el-table-column prop="Role" label="角色" align="center" :formatter="toTxt"></el-table-column>
          <el-table-column prop="Memo" label="备注" align="center"></el-table-column>
          <el-table-column prop="CreateTime" label="创建时间" align="center"></el-table-column>
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
      <!--新增修改-->
      <el-dialog :title="title" :visible.sync="editModal" :close-on-click-modal="false" :before-close="closeModal">
        <el-form :model="editForm" ref="editForm" :rules='Rules' label-width='120px' status-icon>
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
          <el-form-item label="用户角色" prop="RoleId">
            <template>
              <el-radio-group v-model="editForm.RoleId">
                <el-radio v-for="item in roleData" :label="item.Id" :key="item.Id">{{item.RoleName}}</el-radio>
              </el-radio-group>
            </template>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" :rows="3" v-model='editForm.Memo'></el-input>
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
      <!--角色管理-->
      <el-dialog title="角色管理" :visible.sync="roleModal" :close-on-click-modal="false" width="90%" custom-class="fixed-dialog">
        <role></role>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="medium">确 定</el-button>
          <el-button @click="roleModal=false" size="medium">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'

  import role from './role'
  export default {
    name: 'user',
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
        roleModal: false, //角色
        tableData: [],
        checkBoxData: [], //选中数据
        roleData: [], //角色数据
        searchForm: {
          searchkeywords: ''
        },
        editForm: {
          Name: '',
          Mobile: '',
          Email: '',
          Password: '',
          RoleId: '',
          Memo: ''
        },
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
          RoleId: [{
            required: true,
            message: '请选择用户角色',
            trigger: 'blur'
          }]
        }
      }
    },
    components: {
      role
    },
    created() {
      this.getAllData()
    },
    methods: {
      //角色数字转文字
      toTxt(val) {
        let _this = this
        let arr = _this.roleData.filter(item => item.Id == val.Role)
        if (arr.length > 0) {
          return arr[0].RoleName
        } else {
          return '未知'
        }
      },
      //获取数据
      getAllData() {
        let _this = this
        let param = {
          SessionId: sessionStorage.getItem('sessionid'),
          SearchTerm: _this.searchForm.searchkeywords,
          Page: _this.currentPage,
          OffSet: _this.pageSize,
        }
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doGetBUserList', param).then((res) => {
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
            _this.tableData = res.data.data.UserList
            _this.total = res.data.data.TotalRecords
            _this.loading = false
            //用户列表上也需要角色数字转文字，故把获取角色数据的方法放在此处执行而没有放在新增和修改弹框事件上
            _this.getRoleData()
          }
        }).catch((error) => {
          console.log(error)
        })
      },

      //获取角色数据
      getRoleData() {
        let _this = this
        let param = {
          SessionId: sessionStorage.getItem('sessionid'),
        }
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doGetRoleList', param).then((res) => {
          _this.roleData = res.data.data.RoleList
        }).catch((error) => {
          console.log(error)
        })
      },

      // 新增弹框
      addModalShow() {
        let _this = this
        _this.editModal = true
        _this.title = '用户新增'
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
            _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doNewBUser', param).then((res) => {
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
        _this.title = '用户修改'
        _this.doType = 'edit'
        let data = _this.checkBoxData[0]
        _this.editForm = {
          Name: data.Name,
          Mobile: data.Mobile,
          Email: data.Email,
          Password: data.Password,
          RoleId: data.Role,
          Memo: data.Memo
        }
      },

      // 修改
      editSubmit() {
        let _this = this
        _this.$refs.editForm.validate((valid) => {
          if (valid) {
            let param = Object.assign({}, _this.editForm)
            param.SessionId = sessionStorage.getItem('sessionid')
            _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBUserUpdate', param).then((res) => {
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
          Id: row.Id,
          Enable: row.Status
        }
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBUserEnable', param).then((res) => {
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
        _this.editForm = {
          Name: '',
          Mobile: '',
          Email: '',
          Password: '',
          RoleId: '',
          Memo: ''
        }
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
          }), '用户管理.xlsx')
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
