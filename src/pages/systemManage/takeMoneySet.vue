<template>
  <div>
    <el-collapse-transition>
      <div class="searchBox mb20">
        <el-form ref="searchForm" :model="searchForm" class="form-item" label-width="80px">
          <el-row>
            <el-col :xs="24" :span="4">
              <el-form-item label="类型">
                <el-input v-model="searchForm.searchkeywords" placeholder="请输入类型" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :span="4">
              <el-form-item>
                <el-button type="primary" size="small">查询</el-button>
                <el-button size="small" @click="resetSearch">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-collapse-transition>
    <div class="mb20">
      <el-button type="success" size="small" @click="addModelShow"><i class="el-icon-plus"></i> 新增</el-button>
      <el-button type="primary" size="small" @click="editModelShow" :disabled="disabled"><i class="el-icon-edit-outline"></i>
        修改</el-button>
      <el-button type="warning" size="small" @click="exportExcel"><i class="el-icon-upload2"></i> 导出</el-button>
    </div>
    <div class="mt10">
      <el-table border :data="tableData" id="exportTable" style="width: 100%" :header-cell-style="{background:'#fafafa'}"
        @selection-change="handleSelectionChange" @row-click="rowClick" ref="table">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
        <el-table-column prop="Numbers" label="类型" align="center" width="200">
          <template slot-scope="scope">
            <el-button type="text" @click="viewModelShow(scope.$index,scope.row)">{{scope.row.Numbers}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="CountryId" label="名称" align="center"></el-table-column>
        <el-table-column prop="CountryId" label="值" align="center"></el-table-column>
        <el-table-column prop="OrderNumber" label="备注信息" align="center"></el-table-column>
        <el-table-column prop="Status" label="禁用 | 启用" align="center">
          <template slot-scope="scope">
            <el-switch active-color="#67c23a" inactive-color="#dcdfe6" active-value="1" inactive-value="0" v-model="scope.row.Status"
              @change="changeStatus(scope.$index,scope.row)">
            </el-switch>
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
    <!-- 新增修改 -->
    <el-dialog :title="title" :visible.sync="editModel" :close-on-click-modal="false" :before-close="closeModel">
      <el-form :model="editForm" :rules="editRules" label-width="125px" status-icon>
        <el-form-item label="类型" prop="type">
          <el-input v-model="editForm.type"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="值" prop="val">
          <el-input v-model="editForm.val"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="editForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editModel=false">确 定</el-button>
        <el-button @click="editModel=false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 查看 -->
    <el-dialog :title="title" :visible.sync="viewModel" :close-on-click-modal="false" width="30%">
      <el-form :model="viewForm" label-width="125px" status-icon>
        <el-form-item label="类型:"><label>{{viewForm.type}}</label></el-form-item>
        <el-form-item label="名称:"><label>{{viewForm.name}}</label></el-form-item>
        <el-form-item label="值:"><label>{{viewForm.val}}</label></el-form-item>
        <el-form-item label="备注:"><label>{{viewForm.remark}}</label></el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="viewModel=false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
  export default {
    name: 'takeMoneySet',
    data() {
      return {
        loading: true,
        viewModel: false,
        editModel: false,
        disabled: true, //单项禁用
        disabledMore: true, //多项禁用
        tableData: [{
            "Numbers": "20190605105636229596",
            "Picture": "",
            "CountryId": "美国",
            "Forum": "Amazon",
            "ProductByASIN": "777888999a",
            "ProductPrice": 15.99,
            "ServiceType": "不留评",
            "OrderNote": "待付款",
            "Status": "1",
            "OrderNumber": 1314520,
            "OrderTime": "2019-02-03T00:00:00",
            "Remark": ""
          },
          {
            "Numbers": "20190611174157617041",
            "Picture": "",
            "CountryId": "德国",
            "Forum": "Amazon",
            "ProductByASIN": "B07P6KVGF8",
            "ProductPrice": 18.99,
            "ServiceType": "不留评",
            "OrderNote": "待确认",
            "Status": "0",
            "OrderNumber": 7758258,
            "OrderTime": "2019-04-02T00:00:00",
            "Remark": ""
          }
        ],
        checkBoxData: [],
        title: '',
        allNum: 0,
        active: 1,
        currentPage: 1,
        pageSize: '0',
        total: 100,
        searchForm: {
          platform: '全部',
          searchkeywords: ''
        },
        editForm: {
          type: '',
          name: '',
          val: '',
          status: '1',
          remark: ''
        },
        viewForm: {
          type: '',
          name: '',
          val: '',
          status: '',
          remark: ''
        },
        editRules: {
          type: [{
            required: true,
            message: '请输入类型',
            trigger: 'blur'
          }],
          val: [{
            required: true,
            message: '请输入值',
            trigger: 'blur'
          }],
          status: [{
            required: true,
            message: '请选择状态',
            trigger: 'blur'
          }]
        },
      }
    },
    created() {
      //			this.getAllData()
    },
    methods: {
      //获取数据
      getAllData() {
        let _this = this
        _this.active = 1
        _this.axios.get(_this.GLOBAL.BASE_URL + 'api/OrderManagement/AddOrderByType').then((res) => {
          _this.tableData = res.data.data
          _this.allNum = res.data.data.length
          _this.loading = false
        }).catch((error) => {
          console.log(error)
        })
      },
      // 重置
      resetSearch() {
        let _this = this
        _this.searchForm = {
          platform: '全部',
          searchkeywords: ''
        }
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
        this.checkBoxData = val
        let checkNum = this.checkBoxData.length
        if (checkNum == 1) {
          this.disabled = false
          this.disabledMore = false
        } else if (checkNum > 1) {
          this.disabled = true
          this.disabledMore = false
        } else {
          this.disabled = true
          this.disabledMore = true
        }
      },
      // 新增
      addModelShow() {
        let _this = this
        _this.editModel = true
        _this.title = '提现配置新增'
      },
      // 修改
      editModelShow() {
        let _this = this
        _this.editModel = true
        let item = _this.checkBoxData[0]
        let num = item.Numbers
        _this.title = num + ' 提现配置修改'
        _this.editForm.type = item.CountryId;
        _this.editForm.name = item.CountryId;
        _this.editForm.val = item.CountryId;
        _this.editForm.status = '1';
        _this.editForm.remark = item.CountryId;
      },
      // 查看
      viewModelShow(index, row) {
        let _this = this;
        _this.viewModel = true
        let item = _this.tableData[index]
        let num = item.Numbers
        _this.title = num + ' 提现配置详情'
        _this.viewForm.type = item.CountryId,
          _this.viewForm.name = item.CountryId,
          _this.viewForm.val = item.CountryId,
          _this.viewForm.status = '启用',
          _this.viewForm.remark = item.CountryId
      },
      // 切换状态
      changeStatus(index, row) {
        let _this = this
        let item = _this.tableData[index]
        console.log(item.Status)
        if (item.Status == '0') {
          _this.tableData.Status = '1'
        }
        if (item.Status == '1') {
          _this.tableData.Status = '0'
        }
      },
      //关闭新增修改弹窗
      closeModel() {
        let _this = this
        _this.editModel = false
        _this.editForm = {}
      },
      //分页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`)
      },
      // 导出
      exportExcel() {
        var xlsxParam = {
          raw: true
        } // 导出的内容只做解析，不进行格式转换
        var wb = XLSX.utils.table_to_book(document.querySelector('#exportData'), xlsxParam)

        /* get binary string as output */
        var wbout = XLSX.write(wb, {
          bookType: 'xlsx',
          bookSST: true,
          type: 'array'
        })
        try {
          FileSaver.saveAs(new Blob([wbout], {
            type: 'application/octet-stream'
          }), '下单管理表.xlsx')
        } catch (e) {
          if (typeof console !== 'undefined') {
            console.log(e, wbout)
          }
        }
        return wbout
      },
    }
  }
</script>

<style>

</style>
