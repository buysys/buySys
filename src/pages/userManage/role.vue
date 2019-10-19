<template>
  <div>
    <div class="mt10">
      <el-collapse-transition>
        <div class="searchBox mb20 pl30">
          <el-form ref="searchForm" :model="searchForm" class="form-item" label-width="80px">
            <el-row :gutter="20">
              <el-col :xs="24" :span="4">
                <el-form-item label="角色名称">
                  <el-input v-model="searchForm.roleName" class="disInline" placeholder="请输入角色名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :span="4">
                <el-button type="primary " size="medium">查询</el-button>
                <el-button size="medium " @click="resetSearch">重置</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-collapse-transition>
    </div>
    <div class="mb20">
      <el-button type="success " size="small" @click="addRole"><i class="el-icon-plus "></i> 新增</el-button>
      <el-button type="primary " size="small" :disabled="disabled" @click="editRole"><i class="el-icon-edit-outline "></i> 修改</el-button>
    </div>
    <div class="mt10 ">
      <el-table border :data="tableData" id="exportTable" style="width: 100%" :header-cell-style="{background:'#fafafa'}"
        @selection-change="handleSelectionChange" @row-click="rowClick" ref="table">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
        <el-table-column prop="Numbers" label="角色名称" align="center"></el-table-column>
        <el-table-column prop="CountryId" label="备注" align="center"></el-table-column>
        <el-table-column prop="Status" label="禁用 | 启用" align="center">
          <template slot-scope="scope">
            <el-switch active-color="#67c23a" inactive-color="#dcdfe6" active-value="1" inactive-value="0" v-model="scope.row.Status"
              @change="changeStatus(scope.$index,scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="ProductByASIN" label="操作" align="center">
          <el-button size="small" type="primary" @click="permissionHandle">绑定权限</el-button>
        </el-table-column>
      </el-table>
    </div>
    <!--新增修改-->
    <el-dialog :title="title" :visible.sync="roleModel" :close-on-click-modal="false" :before-cloes="cloesRoleModel"
      width="30%" :modal-append-to-body="false" :append-to-body="true">
      <el-form :model="roleForm " ref="roleForm " :rules="rules" label-width="100px ">
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="roleForm.roleName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注 ">
              <el-input v-model="roleForm.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium">确 定</el-button>
        <el-button @click="roleModel=false" size="medium">取 消</el-button>
      </div>
    </el-dialog>
    <!--权限分配-->
    <el-dialog title="角色权限" :visible.sync="permissionModel" :close-on-click-modal="false" center width="30%"
      custom-class="fixed-dialog" :modal-append-to-body="false" :append-to-body="true">
      <el-tree :data="treeData[0].data.ModulesTree" show-checkbox node-key="funcId" :default-expanded-keys="[2, 3]"
        :default-checked-keys="[5]" :props="defaultProps"></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium">确 定</el-button>
        <el-button @click="permissionModel=false" size="medium">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'role',
    data() {
      return {
        disabled: true, //单项禁用
        disabledMore: true, //多项禁用
        loading: false,
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
        title: "",
        roleModel: false,
        roleViewModel: false,
        permissionModel: false,
        activeName: "menuPermission",
        searchForm: {
          roleName: ''
        },
        roleForm: {
          roleName: '',
          englishName: '',
          roleType: '',
          dataType: '',
          canUse: '',
          remark: ''
        },
        rules: {
          roleName: [{
            required: true,
            message: '请输入角色名',
            trigger: 'blur'
          }],
          englishName: [{
            required: true,
            message: '请输入英文名',
            trigger: 'blur'
          }]
        },
        treeData: [{
          "status": 200,
          "message": "",
          "data": {
            "sessionid": "110E0A14-C88D-491C-B8EC-AE728CECE8C7",
            "ModulesTree": [{
                "funcId": "08",
                "Menu": "个人资料",
                "Level": 0,
                "TData": null
              },
              {
                "funcId": "07",
                "Menu": "系统设置",
                "Level": 0,
                "TData": null
              },
              {
                "funcId": "06",
                "Menu": "用户管理",
                "Level": 0,
                "TData": null
              },
              {
                "funcId": "05",
                "Menu": "客户管理",
                "Level": 0,
                "TData": [{
                    "funcId": "05_03",
                    "Menu": "提现记录",
                    "Level": 1,
                    "TData": [{
                        "funcId": "05_03_05",
                        "Menu": "导出",
                        "Level": 2,
                        "TData": null
                      },
                      {
                        "funcId": "05_03_04",
                        "Menu": "导入",
                        "Level": 2,
                        "TData": null
                      },
                      {
                        "funcId": "05_03_03",
                        "Menu": "付款失败",
                        "Level": 2,
                        "TData": null
                      },
                      {
                        "funcId": "05_03_02",
                        "Menu": "确认付款",
                        "Level": 2,
                        "TData": null
                      },
                      {
                        "funcId": "05_03_01",
                        "Menu": "查看列表",
                        "Level": 2,
                        "TData": null
                      }
                    ]
                  },
                  {
                    "funcId": "05_02",
                    "Menu": "充值记录",
                    "Level": 1,
                    "TData": [{
                        "funcId": "05_02_04",
                        "Menu": "充值",
                        "Level": 2,
                        "TData": null
                      },
                      {
                        "funcId": "05_02_03",
                        "Menu": "导出",
                        "Level": 2,
                        "TData": null
                      },
                      {
                        "funcId": "05_02_02",
                        "Menu": "导入",
                        "Level": 2,
                        "TData": null
                      },
                      {
                        "funcId": "05_02_01",
                        "Menu": "查看列表",
                        "Level": 2,
                        "TData": null
                      }
                    ]
                  },
                  {
                    "funcId": "05_01",
                    "Menu": "客户管理",
                    "Level": 1,
                    "TData": [{
                        "funcId": "05_01_10",
                        "Menu": "启用禁用",
                        "Level": 2,
                        "TData": null
                      },
                      {
                        "funcId": "05_01_09",
                        "Menu": "日志",
                        "Level": 2,
                        "TData": null
                      },
                      {
                        "funcId": "05_01_08",
                        "Menu": "充值",
                        "Level": 2,
                        "TData": null
                      },
                      {
                        "funcId": "05_01_07",
                        "Menu": "充值记录",
                        "Level": 2,
                        "TData": null
                      },
                      {
                        "funcId": "05_01_06",
                        "Menu": "提现记录",
                        "Level": 2,
                        "TData": null
                      },
                      {
                        "funcId": "05_01_05",
                        "Menu": "导出",
                        "Level": 2,
                        "TData": null
                      },
                      {
                        "funcId": "05_01_04",
                        "Menu": "导入",
                        "Level": 2,
                        "TData": null
                      },
                      {
                        "funcId": "05_01_03",
                        "Menu": "修改",
                        "Level": 2,
                        "TData": null
                      },
                      {
                        "funcId": "05_01_02",
                        "Menu": "新增",
                        "Level": 2,
                        "TData": null
                      },
                      {
                        "funcId": "05_01_01",
                        "Menu": "查看列表",
                        "Level": 2,
                        "TData": null
                      }
                    ]
                  }
                ]
              },
              {
                "funcId": "04",
                "Menu": "卡片管理",
                "Level": 0,
                "TData": [{
                    "funcId": "04_02",
                    "Menu": "实体信用卡",
                    "Level": 1,
                    "TData": [{
                        "funcId": "04_02_07",
                        "Menu": "导出",
                        "Level": 2,
                        "TData": null
                      },
                      {
                        "funcId": "04_02_06",
                        "Menu": "导入",
                        "Level": 2,
                        "TData": null
                      },
                      {
                        "funcId": "04_02_05",
                        "Menu": "修改额度",
                        "Level": 2,
                        "TData": null
                      },
                      {
                        "funcId": "04_02_04",
                        "Menu": "删除",
                        "Level": 2,
                        "TData": null
                      },
                      {
                        "funcId": "04_02_03",
                        "Menu": "修改",
                        "Level": 2,
                        "TData": null
                      },
                      {
                        "funcId": "04_02_02",
                        "Menu": "新增",
                        "Level": 2,
                        "TData": null
                      },
                      {
                        "funcId": "04_02_01",
                        "Menu": "查看列表",
                        "Level": 2,
                        "TData": null
                      }
                    ]
                  },
                  {
                    "funcId": "04_01",
                    "Menu": "虚拟信用卡",
                    "Level": 1,
                    "TData": [{
                        "funcId": "04_01_09",
                        "Menu": "还款",
                        "Level": 2,
                        "TData": null
                      },
                      {
                        "funcId": "04_01_08",
                        "Menu": "导出",
                        "Level": 2,
                        "TData": null
                      },
                      {
                        "funcId": "04_01_07",
                        "Menu": "导入",
                        "Level": 2,
                        "TData": null
                      },
                      {
                        "funcId": "04_01_06",
                        "Menu": "修改额度",
                        "Level": 2,
                        "TData": null
                      },
                      {
                        "funcId": "04_01_05",
                        "Menu": "重置虚拟卡",
                        "Level": 2,
                        "TData": null
                      },
                      {
                        "funcId": "04_01_04",
                        "Menu": "删除",
                        "Level": 2,
                        "TData": null
                      },
                      {
                        "funcId": "04_01_03",
                        "Menu": "修改",
                        "Level": 2,
                        "TData": null
                      },
                      {
                        "funcId": "04_01_02",
                        "Menu": "新增",
                        "Level": 2,
                        "TData": null
                      },
                      {
                        "funcId": "04_01_01",
                        "Menu": "查看列表",
                        "Level": 2,
                        "TData": null
                      }
                    ]
                  }
                ]
              },
              {
                "funcId": "03",
                "Menu": "账号管理",
                "Level": 0,
                "TData": [{
                    "funcId": "03_14",
                    "Menu": "备注",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "03_13",
                    "Menu": "系统配置",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "03_12",
                    "Menu": "打开浏览器",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "03_11",
                    "Menu": "导出",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "03_10",
                    "Menu": "导入",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "03_09",
                    "Menu": "买号标签管理",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "03_08",
                    "Menu": "设置买号等级",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "03_07",
                    "Menu": "关联刷手",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "03_06",
                    "Menu": "修改状态",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "03_05",
                    "Menu": "修改标签",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "03_04",
                    "Menu": "删除",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "03_03",
                    "Menu": "修改",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "03_02",
                    "Menu": "新增",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "03_01",
                    "Menu": "查询列表",
                    "Level": 1,
                    "TData": null
                  }
                ]
              },
              {
                "funcId": "02",
                "Menu": "任务管理",
                "Level": 0,
                "TData": [{
                    "funcId": "02_18",
                    "Menu": "重新购买",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "02_17",
                    "Menu": "上评",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "02_16",
                    "Menu": "评价",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "02_15",
                    "Menu": "打开浏览器",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "02_14",
                    "Menu": "评论链接",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "02_13",
                    "Menu": "确认购买",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "02_12",
                    "Menu": "日志查看",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "02_11",
                    "Menu": "退款",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "02_10",
                    "Menu": "导出",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "02_09",
                    "Menu": "导入",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "02_08",
                    "Menu": "确认收货",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "02_07",
                    "Menu": "确认发货",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "02_06",
                    "Menu": "修改执行时间",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "02_05",
                    "Menu": "补单",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "02_04",
                    "Menu": "重新分配",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "02_03",
                    "Menu": "卖家取消",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "02_02",
                    "Menu": "标记异常",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "02_01",
                    "Menu": "查询",
                    "Level": 1,
                    "TData": null
                  }
                ]
              },
              {
                "funcId": "01",
                "Menu": "订单管理",
                "Level": 0,
                "TData": [{
                    "funcId": "01_09",
                    "Menu": "继续",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "01_08",
                    "Menu": "分配买号",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "01_07",
                    "Menu": "删除",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "01_06",
                    "Menu": "日志查看",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "01_05",
                    "Menu": "付款确认",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "01_04",
                    "Menu": "导出",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "01_03",
                    "Menu": "导入",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "01_02",
                    "Menu": "修改",
                    "Level": 1,
                    "TData": null
                  },
                  {
                    "funcId": "01_01",
                    "Menu": "查询",
                    "Level": 1,
                    "TData": null
                  }
                ]
              }
            ]
          }
        }],
        defaultProps: {
          children: 'TData',
          label: 'Menu'
        }
      }
    },
    created() {
      // this.getAllData();
      this.showValue()
    },
    methods: {

      showValue() {
        let _this = this
        console.log(_this.treeData[0].data)
      },

      //重置查询表单
      resetSearch() {
        let _this = this;
        _this.searchForm = {
          roleName: ''
        };
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
      //新建
      addRole() {
        let _this = this;
        _this.roleModel = true;
        _this.title = "角色新增"
      },
      //修改
      editRole() {
        let _this = this;
        _this.roleModel = true;
        _this.title = "角色修改";
      },
      //关闭新建或修改弹窗
      cloesRoleModel() {
        let _this = this;
        _this.roleModel = false;
        _this.roleForm = {
          roleName: '',
          englishName: '',
          roleType: '',
          dataType: '',
          canUse: '',
          remark: ''
        }
      },
      //权限分配
      permissionHandle() {
        let _this = this;
        _this.permissionModel = true;
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
        }else if(checkNum>1){
          this.disabled = true
          this.disabledMore = false
        }else {
          this.disabled = true
          this.disabledMore = true
        }
      },
      //获取表格数据
      getAllData() {
        let _this = this
        _this.axios.get(_this.GLOBAL.BASE_URL + 'api/OrderManagement/AddOrderByType').then((res) => {
          _this.tableData = res.data.data
          _this.loading = false
        }).catch((error) => {
          console.log(error)
        })
      }
    }
  }
</script>

<style>
  .el-select {
    width: 100%;
  }
</style>
