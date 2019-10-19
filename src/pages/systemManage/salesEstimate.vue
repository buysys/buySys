<template>
	<div>
		<el-collapse-transition>
			<div class="searchBox mb20">
				<el-form ref="searchForm" :model="searchForm" class="form-item" label-width="80px">
					<el-row>
						<el-col :xs="24" :span="6">
							<el-form-item label="产品排名">
								<el-input v-model="searchForm.searchkeywords" placeholder="请输入产品排名进行查询" size="small"></el-input>
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
			<el-button type="primary" size="small" @click="editModelShow" :disabled="disabled"><i class="el-icon-edit-outline"></i> 修改</el-button>
      <el-button type="danger" size="small" @click="delData" :disabled="disabledMore"><i class="el-icon-delete"></i> 删除</el-button>
		</div>
		<div class="mt10">
			<el-table border :data="tableData" id="exportTable" style="width: 100%" :header-cell-style="{background:'#fafafa'}"
			  @selection-change="handleSelectionChange" @row-click="rowClick" ref="table">
			  <el-table-column type="selection" align="center"></el-table-column>
			  <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
				<el-table-column prop="CountryId" label="国家" align="center"></el-table-column>
				<el-table-column prop="ProductByASIN" label="产品种类" align="center"></el-table-column>
				<el-table-column prop="OrderNumber" label="排名" align="center"></el-table-column>
        <el-table-column prop="OrderNumber" label="预估销量" align="center"></el-table-column>
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
		<el-dialog :title="title" :visible.sync="editModel" :close-on-click-modal="false">
			<el-form :model="editForm" :rules="editRules" label-width="80px" status-icon>
				<el-form-item label="国家">
				  <el-select v-model="editForm.country" placeholder="请选择国家" @change="getType()" style="width: 100%;">
				    <el-option v-for="item in country_data" :key="item" :label="item" :value="item"></el-option>
				  </el-select>
				</el-form-item>
				<el-form-item label="产品种类">
					<el-select v-model="editForm.type" placeholder="请选择产品种类" style="width: 100%;">
					  <el-option v-for="item in type_data_active" :key="item" :label="item" :value="item"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="排名">
					<el-input v-model="editForm.rank" placeholder="请输入排名"></el-input>
				</el-form-item>
				<el-form-item label="预估销量">
					<el-input v-model="editForm.num" placeholder="请输入预估销量"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="editModel=false">确 定</el-button>
				<el-button @click="editModel=false">取 消</el-button>
			</div>
		</el-dialog>
    <!-- 删除-->
    <el-dialog title="温馨提示" :visible.sync="delModel" :close-on-click-modal="false" center="" width="30%">
    	<div class="del-dialog-cnt textCen">确认要删除该数据吗？</div>
    	<span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium">是</el-button>
        <el-button @click="delModel=false" size="medium">否</el-button>
      </span>
    </el-dialog>
	</div>
</template>

<script>
	import FileSaver from 'file-saver'
	import XLSX from 'xlsx'
	export default {
		name: 'salesEstimate',
		data() {
			return {
        country_data:['美国','英国','西班牙','墨西哥','意大利','印度','德国','法国','加拿大'],
        type_data:[
          {country:'美国',type:['Appliances','Arts, Crafts & Sewing','Automotive','Baby','Beauty','Beauty & Personal Care','Books','Camera & Photo','Cell Phones & Accessories','Clothing, Shoes & Jewelry','Computers & Accessories','Electronics','Grocery & Gourmet Food','Health & Household','Home & Garden','Home & Kitchen','Home Improvement','Industrial & Scientific','Kindle Store','Kitchen & Dining','Music','Musical Instruments','Office Products','Patio, Lawn & Garden','Pet Supplies','Software','Sports & Outdoors','Toys & Games','Video Games','Watches']},
          {country:'英国',type:['Baby','Beauty','Car & Motorbike','Clothing','Computers','DIY & Tools','Electronics','Garden & Outdoors','Grocery','Health & Personal Care','Jewellery','Kitchen & Home','Large Appliances','Lighting','Luggage','Musical Instruments','Office Products','PC & Video Games','Pet Supplies','Shoes & Bags','Software','Sports & Outdoors','Toys & Games','Watches']},
          {country:'西班牙',type:['Bebé','Belleza','Bricolaje y herramientas','Coche y moto','Deportes y aire libre','Electrónica','Equipaje','Hogar','Iluminación','Industria, empresas y ciencia','Informática','Instrumentos musicales','Jardín','Joyería','Juguetes y juegos','Libros','Oficina y papelería','Películas y TV','Relojes','Ropa y accesorios','Salud y cuidado personal','Software','Supermercado','Videojuegos','Zapatos y complementos']},
          {country:'墨西哥',type:['Bebé','Deportes y Aire Libre','Electrónicos','Herramientas y Mejoras del Hogar','Hogar y Cocina','Industria, Empresas y Ciencia','Juegos y juguetes','Libros','Mascotas','Música','Oficina y Papelería','Ropa, Zapatos y Accesorios','Salud, Belleza y Cuidado Personal','Software','Videojuegos']},
          {country:'意大利',type:['Abbigliamento','Alimentari e cura della casa','Auto e Moto','Bellezza','Casa e cucina','CD e Vinili','Commercio, Industria e Scienza','Elettronica','Fai da te','Film e TV','Giardino e giardinaggio','Giochi e giocattoli','Gioielli','Illuminazione','Informatica','Libri','Orologi','Prima infanzia','Salute e cura della persona','Scarpe e borse','Software','Sport e tempo libero','Strumenti musicali e DJ','Valigeria','Videogiochi']},
          {country:'印度',type:['Baby','Bags, Wallets & Luggage','Beauty','Books','Car & Motorbike','Clothing & Accessories','Electronics','Gift Cards','Grocery & Gourmet Foods','Health & Personal Care','Home & Kitchen','Industrial & Scientific','Jewellery','Movies & TV Shows','Music','Musical Instruments','Office Products','Pet Supplies','Shoes & Handbags','Software','Sports, Fitness & Outdoors','Toys & Games','Video Games','Watches']},
          {country:'德国',type:['Auto','Baby','Baumarkt','Beauty','Bekleidung','Beleuchtung','Bücher','Bürobedarf & Schreibwaren','Computer & Zubehör','Drogerie & Körperpflege','DVD & Blu-ray','Elektro-Großgeräte','Elektronik','Fremdsprachige Bücher','Games','Garten','Gewerbe, Industrie & Wissenschaft','Haustier','Kamera','Koffer, Rucksäcke & Taschen','Küche & Haushalt','Lebensmittel & Getränke','Motorrad','Musikinstrumente','Schmuck','Schuhe & Handtaschen','Software','Spielzeug','Sport & Freizeit','Uhren']},
          {country:'法国',type:['Animalerie','Auto et Moto','Bagages','Beauté et Parfum','Bébés & Puériculture','Bijoux','Bricolage','Chaussures et Sacs','Commerce, Industrie & Science','Cuisine & Maison','DVD & Blu-ray','Epicerie','Fournitures de bureau','Gros électroménager','High-tech','Hygiène et Soins du corps','Informatique','Instruments de musique','Jardin','Jeux et Jouets','Jeux vidéo','Livres','Logiciels','Luminaires et Eclairage','Montres','Sports et Loisirs','Vêtements et accessoires']},
          {country:'加拿大',type:['Automotive','Baby','Beauty','Books','Clothing & Accessories','Computer & Video Games','DVD','Electronics','Gift Cards','Grocery & Gourmet Food','Health & Personal Care','Home & Kitchen','Industrial & Scientific','Jewelry','Luggage & Bags','Music','Musical Instruments, Stage & Studio','Office Products','Patio, Lawn & Garden','Pet Supplies','Shoes & Handbags','Software','Sports & Outdoors','Tools & Home Improvement','Toys & Games','Video','Watches']}
          ],
        type_data_active:'',
				loading: true,
				viewModel: false,
				editModel: false,
				drModel: false,
				disabled: true,  //单项禁用
				disabledMore: true, //多项禁用
        delModel: false,
				tableData: [{
						"Numbers": "20190605105636229596",
						"Picture": "",
						"CountryId": "美国",
						"Forum": "Amazon",
						"ProductByASIN": "Electronics",
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
						"CountryId": "英国",
						"Forum": "Amazon",
						"ProductByASIN": "Automotive",
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
					country: '',
					type: '',
					rank: '',
					num: ''
				},
				editRules: {
					country: [{
						required: true,
						message: '请选择国家',
						trigger: 'blur'
					}],
					type: [{
						required: true,
						message: '请选择产品类型',
						trigger: 'blur'
					}],
					rank: [{
						required: true,
						message: '请输入排名',
						trigger: 'blur'
					}],
          num: [{
          	required: true,
          	message: '请输入预估销量',
          	trigger: 'blur'
          }]
				},
			}
		},
		created() {
//			this.getAllData()
		},
		methods: {
      //根据国家获取产品类型
      getType(){
        let _this = this
        let country = _this.editForm.country
        for( let item in _this.type_data){
          if(_this.type_data[item].country==country){
            _this.type_data_active = _this.type_data[item].type
            _this.editForm.type = _this.type_data[item].type[0]
          }
        }
      },
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
			  }else if(checkNum>1){
			    this.disabled = true
			    this.disabledMore = false
			  }else {
			    this.disabled = true
			    this.disabledMore = true
			  }
			},
			// 新增
			addModelShow() {
				let _this = this
				_this.editModel = true
				_this.title = '预估销量添加'
			},
			// 修改
			editModelShow() {
				let _this = this
				_this.editModel = true
				let item = _this.checkBoxData[0]
				let country = item.CountryId
				_this.title = country + ' 预估销量修改'
				_this.editForm.country = item.CountryId;
			},
      // 删除
      delData() {
      	let _this = this
      	_this.delModel = true
      },
			//分页
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`)
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`)
			}
		}
	}
</script>

<style>

</style>
