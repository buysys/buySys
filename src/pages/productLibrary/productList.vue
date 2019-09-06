<template>
	<div>
		<el-collapse-transition>
			<div class="searchBox mb20">
				<el-form ref="searchForm" :model="searchForm" class="form-item" label-width="80px">
					<el-row>
						<el-col :xs="24" :span="6">
							<el-form-item label="产品排名">
								<el-input v-model="searchForm.searchkeywords" placeholder="请输入国家/产品ASIN/产品名称/产品关键词" class="disInline"></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :span="4" class="ml20">
							<el-button type="primary" size="medium">查询</el-button>
							<el-button size="medium" @click="resetSearch">重置</el-button>
						</el-col>
					</el-row>
				</el-form>
			</div>
		</el-collapse-transition>

		<div class="mb20">
			<el-button type="success" size="medium" @click="addProductModal"><i class="el-icon-plus"></i>新增</el-button>
			<el-button type="primary" size="medium" @click="editProductModal" :disabled="editDisabled"><i class="el-icon-edit-outline"></i>修改</el-button>
			<el-button type="danger" size="medium" @click="deleteProductModal" :disabled="delDisabled"><i class="el-icon-delete"></i>删除</el-button>
		</div>
		<div class="mt10">
			<el-table :data="tables.slice((currentPage - 1) * pageSize, currentPage * pageSize)" ref='tableData' style="width: 100%" :header-cell-style="{background:'#fafafa'}" @selection-change="handleSelectionChange">
				<el-table-column type="selection"></el-table-column>
				<el-table-column prop="platform" label="平台" align="center" width="200">
					<template slot-scope="scope">
						<el-button type="text" @click="viewProductShow(scope.$index,scope.row)">{{scope.row.platform}}</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="countryId" label="国家" align="center"></el-table-column>
				<el-table-column prop="shopName" label="店铺" align="center"></el-table-column>
				<el-table-column prop="productASIN" label="产品ASIN" align="center"></el-table-column>
				<el-table-column prop="productName" label="产品名称" align="center"></el-table-column>
				<el-table-column prop="productPrice" label="产品价格" align="center"></el-table-column>
				<el-table-column prop="productLink" label="产品链接" align="center"></el-table-column>
				<el-table-column prop="productKeywords" label="产品关键词" align="center"></el-table-column>
			</el-table>
			<div class="mt30">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[100, 200, 300, 500]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
		</div>
		<!-- 新增修改 -->
		<el-dialog :title="title" :visible.sync="editModal" :close-on-click-modal="false" :before-close="closeModel">
			<el-form :model="productForm" label-width="125px" status-icon :rules='productRule'>
				<el-form-item label="平台" prop='platform'>
					<el-select v-model="productForm.platform" placeholder="请选择">
						<el-option v-for="(item,index) in platformData" :key="index" :value="index" :label="item.plat"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="国家" prop="countryId">
					<el-select v-model="productForm.countryId" placeholder="请选择">
						<el-option v-for="(item,index) in countryData" :key="index" :value="index" :label="item.country"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="店铺" prop="shopName">
					<el-input v-model="productForm.shopName" placeholder="请输入店铺"></el-input>
				</el-form-item>
				<el-form-item label="产品ASIN" prop="productASIN">
					<el-input maxlength="10" v-model="productForm.productASIN" show-word-limit placeholder="长度为10的数字和字母组合"></el-input>
				</el-form-item>
				<el-form-item label="产品名称" prop="productName">
					<el-input v-model="productForm.productName" placeholder='请输入产品名称'></el-input>
				</el-form-item>
				<el-form-item label="产品价格" prop='productPrice'>
					<el-input v-model="productForm.productPrice" placeholder='请输入产品价格'>
						<template slot="prepend">￥</template>
					</el-input>
				</el-form-item>
				<el-form-item label="产品链接" prop="productLink">
					<el-input v-model="productForm.productLink" placeholder="请以http://或者https://开头"></el-input>
				</el-form-item>
				<el-form-item label="产品关键词">
					<el-input v-model="productForm.productKeywords" placeholder='请输入产品关键词'></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="editModel=false">确 定</el-button>
				<el-button @click="closeModel">取 消</el-button>
			</div>
		</el-dialog>
		<!-- 查看 -->
		<el-dialog :title="title" :visible.sync="viewModal" :close-on-click-modal="false">
			<el-form :model="productForm" status-icon class="demo-item">
				<el-row>
					<el-col :span="12" :xs="24">
						<el-form-item label="平台："><span>{{productForm.platform}}</span></el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="国家："><span>{{productForm.countryId}}</span></el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="店铺："><span>{{productForm.shopName}}</span></el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="产品ASIN："><span>{{productForm.productASIN}}</span></el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="产品名称："><span>{{productForm.productName}}</span></el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="产品价格："><span>{{productForm.productPrice}}</span></el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="产品链接："><span>{{productForm.productLink}}</span></el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="产品关键词："><span>{{productForm.productKeywords}}</span></el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeModel">关 闭</el-button>
			</div>
		</el-dialog>
		<!--删除-->
		<el-dialog title='温馨提示' :visible.sync='deleteModal' width='30%'>
			<div class="el-dialog--center">是否确定删除?</div>
			<span slot='footer' class="dialog-footer">
				<el-button type='primary'>是</el-button>
				<el-button @click='deleteModal=false'>否</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import vali from '../../components/validate'
	export default {
		name: 'productList',
		data() {
			return {
				title: '',
				currentPage: 1,
				pageSize: 2,
				total: 100,
				editModal: false, //新增、修改
				viewModal: false, // 查看
				deleteModal: false, //删除
				editDisabled: true,
				delDisabled: true,
				searchForm: {
					searchkeywords: ''
				},
				checkBoxData: [],
				countryData: [{
						country: '美国'
					},
					{
						country: '加拿大'
					}
				],
				platformData: [{
						plat: '亚马逊'
					},
					{
						plat: 'Amazon'
					}
				],
				tableData: [],
				productForm: {
					platform: '',
					shopName: '',
					countryId: '',
					productASIN: '',
					productName: '',
					productPrice: '',
					productLink: '',
					productKeywords: ''
				},
				productRule: {
					ProductByASIN: [{
							required: true,
							message: '请输入产品ASIN',
							trigger: 'change'
						},
						{
							validator: vali.flagNum,
							trigger: 'change'
						}
					],
					countryId: [{
						required: true,
						message: '请选择国家',
						trigger: 'change'
					}],
					shopName: [{
						required: true,
						message: '请输入店铺',
						trigger: 'change'
					}],
					platform: [{
						required: true,
						message: '请选择平台',
						trigger: 'change'
					}],
					productASIN: [{
						required: true,
						message: '请输入产品ASIN',
						trigger: 'change'
					}],
					productName: [{
						required: true,
						message: '请输入产品名称',
						trigger: 'change'
					}],
					productPrice: [{
							required: true,
							message: '请输入产品价格',
							trigger: 'change'
						},
						{
							validator: vali.proPrice,
							trigger: 'change'
						}
					],
					productLink: [{
							required: true,
							message: '请输入产品链接',
							trigger: 'change'
						},
						{
							validator: vali.checkLink,
							trigger: 'change'
						}
					],
					searchKeyword: [{
						required: true,
						message: '请输入关键字',
						trigger: 'change'
					}]
				}
			}
		},
		computed: {
			// 模糊搜索
			tables() {
				const search = this.searchForm.searchkeywords
				if(search) {
					return this.tableData.filter(data => {
						return Object.keys(data).some(key => {
							return String(data[key]).toLowerCase().indexOf(search) > -1
						})
					})
				}
				return this.tableData
			}
		},
		created() {
			this.info()
		},
		methods: {
			info() {
				let data = [{
						"platform": "Amazon",
						"countryId": "美国",
						"shopName": "维达",
						"productName": "抽纸",
						"productASIN": "777888999a",
						"productPrice": 15.99,
						"productLink": "https://www.dsfss.com",
						"productKeywords": "生活"
					},
					{
						"platform": "Amazon",
						"countryId": "德国",
						"shopName": "维达",
						"productASIN": "B07P6KVGF8",
						"productName": "大米",
						"productPrice": 18.99,
						"productLink": "https://www.d4fd2ss.com",
						"productKeywords": "生活、进口"
					}
				]
				this.tableData = data
			},
			//分页
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`)
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`)
			},
			// 是否有选中
			handleSelectionChange(val) {
				let _this = this
				_this.checkBoxData = val
				let checkNum = _this.checkBoxData.length
				if(checkNum == 1) {
					_this.editDisabled = false
					_this.delDisabled = false
				} else if(checkNum > 1) {
					_this.editDisabled = true
					_this.delDisabled = false
				} else {
					_this.editDisabled = true
					_this.delDisabled = true
				}
			},
			//新增
			addProductModal() {
				let _this = this
				_this.editModal = true
				_this.title = '新增'
			},
			//修改
			editProductModal(index, row) {
				let _this = this
				_this.editModal = true
				_this.title = '修改'
				_this.productForm = Object.assign({}, row)
			},
			//删除
			deleteProductModal(index, row) {
				let _this = this
				_this.deleteModal = true
			},
			// 重置
			resetSearch() {
				let _this = this
				_this.searchForm = {
					platform: '全部',
					searchkeywords: ''
				}
			},
			//关闭弹窗
			closeModel() {
				let _this = this
				_this.editModal = false
				_this.viewModal = false
				_this.productForm = {
					platform: '',
					countryId: '',
					productASIN: '',
					productName: '',
					productPrice: '',
					productLink: '',
					productKeywords: ''
				}
			},
			//查看
			viewProductShow(index, row) {
				let _this = this
				_this.viewModal = true
				_this.productForm = Object.assign({}, row)
				_this.title = "查看"
			}
		}
	}
</script>

<style>

</style>