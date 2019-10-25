<template>
  <div>
    <el-collapse-transition>
      <div class="searchBox mb20">
        <el-form ref="searchForm" :model="searchForm" class="form-item" label-width="80px">
          <el-row>
            <el-col :xs="24" :span="4">
              <el-form-item label="卡号">
                <el-input v-model="searchForm.cardNo" placeholder="请输入信用卡卡号" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :span="4">
              <el-form-item label="姓名">
                <el-input v-model="searchForm.cardName" placeholder="请输入信用卡姓名" size="small"></el-input>
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
      <el-button type="primary" size="small" :disabled="disabled" @click="editModalShow"><i class="el-icon-edit-outline"></i>
        修改</el-button>
      <el-button type="danger" size="small" :disabled="disabledMore" @click="delData"><i class="el-icon-delete"></i>
        删除</el-button>
      <el-button type="primary" size="small" :disabled="disabled" @click="editQuota"><i class="el-icon-edit-outline"></i>
        修改额度</el-button>
      <el-button type="warning" size="small" @click="drModalShow"><i class="el-icon-download"></i> 导入</el-button>
      <el-button type="warning" size="small" @click="exportExcel"><i class="el-icon-upload2"></i> 导出</el-button>
    </div>
    <div class="mt10">
      <el-table border :data="tableData" id="exportTable" style="width: 100%" :header-cell-style="{background:'#fafafa'}"
        @selection-change="handleSelectionChange" @row-click="rowClick" ref="table">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
        <el-table-column prop="CardNumber" label="卡号" align="center"></el-table-column>
        <el-table-column prop="AountName" label="姓名" align="center"></el-table-column>
        <el-table-column prop="Name" label="卡名" align="center"></el-table-column>
        <el-table-column prop="Expire" label="有效期" align="center"></el-table-column>
        <el-table-column prop="Security" label="安全码" align="center"></el-table-column>
        <el-table-column prop="Memo" label="备注" align="center"></el-table-column>
        <el-table-column prop="Quota" label="剩余额度($)" align="center"></el-table-column>
        <el-table-column prop="TotalUsed" label="累积使用($)" align="center"></el-table-column>
        <el-table-column prop="BuyerAccount" label="买家账号" align="center"></el-table-column>
        <el-table-column prop="" label="买号状态" align="center"></el-table-column>
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
    <!--新建修改-->
    <el-dialog :title="title" :visible.sync="editModal" :close-on-click-modal="false" :before-close="closeModal">
      <el-form :model="editForm" ref="editForm" :rules="Rules" label-width="120px" status-icon>
        <el-form-item label="卡号" prop="CardNo">
          <el-input v-model="editForm.CardNo" :disabled="disabledEdit"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="AccountName">
          <el-input v-model="editForm.AccountName" :disabled="disabledEdit"></el-input>
        </el-form-item>
        <el-form-item label="卡名" prop="CardName">
          <el-input v-model="editForm.CardName"></el-input>
        </el-form-item>
        <el-form-item label="有效期" prop="Expire">
          <el-date-picker v-model="editForm.Expire" type="date" placeholder="请选择有效期" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="安全码" prop="Security">
          <el-input v-model="editForm.Security"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="Memo">
          <el-input type='textarea' :rows="3" v-model="editForm.Memo"></el-input>
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
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'

  export default {
    name: 'entityCard',
    data() {
      return {
        title: '',
        currentPage: 1,
        pageSize: 10,
        total: 0,
        doType: '',
        disabled: true, //单项禁用
        disabledMore: true, //多项禁用
        disabledEdit: true, //禁用编辑
        loading: true,
        editModal: false, //新增修改
        drModal: false,
        tableData: [],
        checkBoxData: [], //选中数据
        fileList: [],
        searchForm: {
          cardNo: '',
          cardName: ''
        },
        editForm: {
          CardNo: '',
          CardName: '',
          Expire: '',
          Security: '',
          AccountName: '',
          Memo: ''
        },
        Rules: {
          CardNo: [{
            required: true,
            message: '请输入卡号',
            trigger: 'blur'
          }],
          AccountName: [{
            required: true,
            message: '请输入姓名',
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
          CardType: 3,
          CardNo: _this.searchForm.cardNo,
          CardName: _this.searchForm.cardName
        }
        _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBCardList', param).then((res) => {
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
            _this.tableData = res.data.data.CardList
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
        _this.title = '实体卡新增'
        _this.doType = 'add'
        _this.disabledEdit = false
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
                param.CardType = 3
                _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBCardNew', param).then((res) => {
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
        _this.title = '实体卡修改'
        _this.doType = 'edit'
        _this.disabledEdit = true
        let data = _this.checkBoxData[0]
        _this.editForm = {
          CardNo: data.CardNumber,
          CardName: data.Name,
          Expire: data.Expire,
          Security: data.Security,
          AccountName: data.AountName,
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
              CardId: _this.checkBoxData[0].Id,
              CardName: _this.editForm.CardName,
              Expire: _this.editForm.Expire,
              Security: _this.editForm.Security,
              Memo: _this.editForm.Memo
            }
            _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBCardUpdate', param).then((res) => {
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
        _this.$confirm('此操作会删除信用卡和买号的绑定关系，确认删除选中的数据吗？', '信息提示', {
          type: 'warning'
        }).then(() => {
          let param = {
            SessionId: sessionStorage.getItem('sessionid'),
            CardIds: ids
          }
          _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBCardDel', param).then((res) => {
            _this.$alert(res.data.message, '信息提示', {
              confirmButtonText: '确定',
              callback: action => {
                _this.getAllData()
              }
            })
          })
        }).catch(() => {})
      },

      //修改额度
      editQuota() {
        let _this = this
        this.$prompt('请输入额度', '信息提示', {
          confirmButtonText: '确定',
          inputPattern: /^[0-9]+([.]{1}[0-9]+){0,1}$/,
          inputErrorMessage: '额度格式不正确'
        }).then(({
          value
        }) => {
          let param = {
            SessionId: sessionStorage.getItem('sessionid'),
            CardId: Number(_this.checkBoxData[0].Id),
            CardQuota: Number(value)
          }
          _this.axios.post(_this.GLOBAL.BASE_URL + '/api/doBCardQuotaUpdate', param).then((res) => {
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
          cardNo: '',
          cardName: ''
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
        _this.editForm = {
          CardNo: '',
          CardName: '',
          Expire: '',
          Security: '',
          AccountName: '',
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
