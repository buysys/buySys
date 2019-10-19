<template>
  <div>
    <el-collapse-transition>
      <div class="searchBox mb20">
        <el-form ref="searchForm" :model="searchForm" class="form-item" :inline='true' label-width="80px">
          <el-form-item label="时间">
            <el-date-picker v-model="searchForm.start" type="date" placeholder="选择开始时间" :picker-options="pickerStartDate"
              value-format="yyyy-MM-dd" class="mb10"></el-date-picker>
            <span>-</span>
            <el-date-picker v-model="searchForm.end" type="date" placeholder="选择结束时间" :picker-options="pickerEndDate"
              value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium">查询</el-button>
            <el-button size="medium" @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-collapse-transition>
    <div class="mt10">
      <el-table :data="tableData" id="exportData" style="width: 100%" :header-cell-style="{background:'#fafafa'}">
        <el-table-column prop="OrderTime" label="时间" width="200"></el-table-column>
        <el-table-column prop="ProductByASIN" label="事件"></el-table-column>
      </el-table>
      <div class="mt30">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
          :page-sizes="[100, 200, 300, 500]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'orderLog',
    data() {
      return {
        loading: true,
        pickerEndDate: this.pickerOptionsEnd(),
        pickerStartDate: this.searchStartDate(),
        tableData: [],
        title: '',
        allNum: 0,
        active: 1,
        currentPage: 1,
        pageSize: '0',
        total: 100,
        searchForm: {
          platform: '0',
          searchkeywords: ''
        }
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
          start: '',
          end: ''
        }
      },
      //分页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`)
      },
      // 开始时间
      searchStartDate() {
        return {
          disabledDate: time => {
            let endDateVal = this.searchForm.end
            if (endDateVal) {
              return time.getTime() > new Date(endDateVal).getTime()
            }
          }
        }
      },
      // 结束时间
      pickerOptionsEnd() {
        return {
          disabledDate: time => {
            let beginDateVal = this.searchForm.start
            if (beginDateVal) {
              return (
                time.getTime() <
                new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
              )
            }
          }
        }
      }
    }
  }
</script>

<style>

</style>
