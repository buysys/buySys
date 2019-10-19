<template>
  <div>
    <div class="mb20">
      <el-button type="success" size="small" @click="addModalShow"><i class="el-icon-plus"></i> 新增</el-button>
      <el-button type="primary" size="small" :disabled="disabled" @click="editModalShow"><i class="el-icon-edit-outline"></i>
        修改</el-button>
      <el-button type="warning" size="small" @click="exportExcel"><i class="el-icon-upload2"></i> 导出</el-button>
    </div>
    <div class="mt10">
      <el-table border :data="tableData" id="exportTable" style="width: 100%" :header-cell-style="{background:'#fafafa'}"
        @selection-change="handleSelectionChange" @row-click="rowClick" ref="table">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
        <el-table-column prop="TaskName" label="任务类型" align="center"></el-table-column>
        <el-table-column prop="MinPrice" label="价格" align="center"></el-table-column>
        <el-table-column prop="Description" label="说明" align="center"></el-table-column>
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
    <el-dialog :title="title" :visible.sync="editModal" :close-on-click-modal="false" :before-close="closeModal"
      :modal-append-to-body="false" :append-to-body="true">
      <el-form :model="editForm" ref='editForm' :rules="Rules" label-width="120px" status-icon>
        <el-form-item label="任务类型" prop="TaskType">
          <template>
            <el-select v-model="editForm.TaskType" placeholder="请选择任务类型" style="width: 100%;" :disabled='disabledEditType' @change="getOtherInfo">
              <el-option v-for="item in taskTypeData" :key="item.TaskType" :label="item.TaskName" :value="item.TaskType"></el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="价格" prop="MinPrice">
          <el-input v-model="editForm.MinPrice" disabled></el-input>
        </el-form-item>
        <el-form-item label="说明" prop="Description">
          <el-input type="textarea" :rows="3" v-model="editForm.Description" :disabled='disabledEditMemo'></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSubmit" v-show="doType=='add'">确 定</el-button>
        <el-button type="primary" @click="editSubmit" v-show="doType=='edit'">确 定</el-button>
        <el-button @click="closeModal">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
  export default {
    name: 'orderTask',
    data() {
      return {
        title: '',
        currentPage: 1,
        pageSize: 10,
        total: 0,
        doType: '',
        disabled: true, //单项禁用
        disabledMore: true, //多项禁用
        disabledEditType: true, //禁止修改任务类型
        disabledEditMemo: true, //禁止修改描述
        loading: true,
        editModal: false, //新增修改
        tableData: [],
        checkBoxData: [], //选中数据
        taskTypeData: [], //任务类型数据
        editForm: {
          TaskType: '',
          MinPrice: '',
          Description: ''
        },
        Rules: {
          TaskType: [{
            required: true,
            message: '请选择任务类型',
            trigger: 'blur'
          }]
        }
      }
    },
    props:["funv"],
    created() {
      this.getAllData()
    },
    methods: {
      //获取数据
      getAllData() {
        let _this = this
        let param = {
          SessionId: sessionStorage.getItem('sessionid'),
          Page: _this.currentPage,
          OffSet: _this.pageSize,
          PlatformId: _this.funv
        }
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBPlatformTaskList', param).then((res) => {
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
            _this.tableData = res.data.data.Tasks
            _this.total = res.data.data.TotalRecords
            _this.loading = false
          }
        }).catch((error) => {
          console.log(error)
        })
      },

      //获取任务类型数据
      getTaskTypeData() {
        let _this = this
        let param = {
          SessionId: sessionStorage.getItem('sessionid'),
        }
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBBaseTaskList', param).then((res) => {
          _this.taskTypeData = res.data.data.BaseTasks
        }).catch((error) => {
          console.log(error)
        })
      },

      //根据任务类型获取价格和说明
      getOtherInfo() {
        let _this = this
        let newArr = []
        newArr = _this.taskTypeData.filter(item => item.TaskType == _this.editForm.TaskType)
        _this.editForm.MinPrice = newArr[0].MinPrice
        _this.editForm.Description = newArr[0].Description
      },

      // 新增弹框
      addModalShow() {
        let _this = this
        _this.editModal = true
        _this.title = '任务新增'
        _this.doType = 'add'
        _this.disabledEditType = false
        _this.disabledEditMemo = true
        _this.getTaskTypeData()
      },

      // 新增
      addSubmit() {
        let _this = this
        _this.$refs.editForm.validate((valid) => {
          if (valid) {
            let param = {
              SessionId : sessionStorage.getItem('sessionid'),
              PlatformId : Number(_this.funv),
              BaseTaskId : Number(_this.editForm.TaskType)
            }
            _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBPlatformTaskNew', param).then((res) => {
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
        _this.title = '任务修改'
        _this.doType = 'edit'
        _this.disabledEditType = true
        _this.disabledEditMemo = false
        _this.getTaskTypeData()
        _this.checkBoxData[0].TaskType = Number(_this.checkBoxData[0].TaskType)
        _this.editForm = Object.assign({}, _this.checkBoxData[0])
      },

      // 修改
      editSubmit() {
        let _this = this
        _this.$refs.editForm.validate((valid) => {
          if (valid) {
            let param = {
              SessionId : sessionStorage.getItem('sessionid'),
              PlatformId: Number(_this.funv),
              BaseTaskId: Number(_this.editForm.TaskType),
              Action: 2,
              Memo: _this.editForm.Description
            }
            _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBPlatformTaskUpdate', param).then((res) => {
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
          SessionId : sessionStorage.getItem('sessionid'),
          PlatformId: Number(_this.funv),
          BaseTaskId: Number(row.TaskType),
          Action: 1,
          Status: row.Status
        }
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBPlatformTaskUpdate', param).then((res) => {
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
          }), '查看任务.xlsx')
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
