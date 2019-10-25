<template>
  <div>
    <div class="mb20">
      <el-button type="success" size="small" @click="addModalShow"><i class="el-icon-plus"></i> 新增</el-button>
      <el-button type="primary" size="small" :disabled="disabled" @click="editModalShow">
        <i class="el-icon-edit-outline"></i> 修改</el-button>
      <el-button type="danger" size="small" :disabled="disabledMore" @click="delData">
        <i class="el-icon-delete"></i> 删除</el-button>
    </div>
    <div class="mt10">
      <el-table border :data="tableData" id="exportTable" style="width: 100%" :header-cell-style="{background:'#fafafa'}"
        @selection-change="handleSelectionChange" @row-click="rowClick" ref="table">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
        <el-table-column prop="TagName" label="标签" align="center"></el-table-column>
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
    <el-dialog :title="title" :visible.sync="editModal" :close-on-click-modal="false" :before-close="closeModal"
      :modal-append-to-body="false" :append-to-body="true" width="30%">
      <el-form :model='editForm' ref='editForm' :rules='Rules' label-width='80px' status-icon>
        <el-form-item label='标签' prop='TagName'>
          <el-input v-model='editForm.TagName'></el-input>
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
  export default {
    name: 'buyTag',
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
        editForm: {
          TagName: ''
        },
        Rules: {
          TagName: [{
            required: true,
            message: '请输入标签',
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
          Page: _this.currentPage,
          OffSet: _this.pageSize,
        }
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBBuyerAccountTagsList', param).then((res) => {
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
            _this.tableData = res.data.data.BuyerTagsList
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
        _this.title = '标签新增'
        _this.doType = 'add'
      },

      // 新增
      addSubmit() {
        let _this = this
        _this.$refs.editForm.validate((valid) => {
          if (valid) {
            _this.$refs.editForm.validate((valid) => {
              if (valid) {
                let param = Object.assign({}, this.editForm)
                let SessionId = sessionStorage.getItem('sessionid')
                param.SessionId = SessionId
                _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBBuyerAccountTagsNew', param).then((res) => {
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
          }
        })
      },

      // 修改弹框
      editModalShow() {
        let _this = this
        _this.editModal = true
        _this.title = '标签修改'
        _this.doType = 'edit'
        let data = _this.checkBoxData[0]
        _this.editForm = Object.assign({}, data)
      },

      // 修改
      editSubmit() {
        let _this = this
        _this.$refs.editForm.validate((valid) => {
          if (valid) {
            let param = Object.assign({}, this.editForm)
            param.SessionId = sessionStorage.getItem('sessionid')
            _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBBuyerAccountTagsMod', param).then((res) => {
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
        var ids = _this.checkBoxData.map(item => item.TagId)
        _this.$confirm('确认删除选中的数据吗？', '信息提示', {
          type: 'warning'
        }).then(() => {
          let param = {
            SessionId: sessionStorage.getItem('sessionid'),
            TagIds: ids
          }
          _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBBuyerAccountTagsDel', param).then((res) => {
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

      //关闭新增修改弹窗
      closeModal() {
        let _this = this
        _this.editModal = false
        _this.$refs['editForm'].resetFields()
        _this.editForm = {
          TagName:''
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
      }

    }
  }
</script>

<style>

</style>
