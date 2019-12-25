<template>
	<div>
		<div class="demo-input-suffix" style='margin-bottom: 40px;'>
			<el-row style='margin-bottom: 20px;'>
				<el-col :span='10'>
					<el-col :span='6'>
						<div class="cli-label">保险公司</div>
					</el-col>
					<el-col  :span='18'>
						<el-select v-model="select_insurance_name" filterable @change="insuranceChange" placeholder="请选择">
						    <el-option
						      v-for="item in select_insuranceOptions"
						      :key="item.value"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
						</el-select>
					</el-col>
				</el-col>
				<el-col :span='14'>
					<el-col :span='2'>
						<div class="cli-label" style="">分类</div>
					</el-col>
					<el-col  :span='20'>
						<el-col :span='9'>
							<el-select v-model="parentsValue" @change='parentChange' placeholder="请选择">
							    <el-option
							      v-for="item in parentsOptions"
							      :key="item.value"
							      :label="item.label"
							      :value="item.value">
							    </el-option>
							</el-select>
						</el-col>
						<el-col :span='9'>
							<el-select v-model="childValue" @change='childChange' placeholder="请选择">
							    <el-option
							      v-for="item in childOptions"
							      :key="item.value"
							      :label="item.label"
							      :value="item.value">
							    </el-option>
							</el-select>
						</el-col>
					</el-col>
				</el-col>
			</el-row>

			<el-row>
				<el-col :span='10'>
					<el-col :span='6'>
						<div class="cli-label">产品名称</div>
					</el-col>
					<el-col  :span='14'>
						<el-input v-model="product_name" placeholder="请输入产品名称"></el-input>
					</el-col>
				</el-col>
				<el-col :span='14'>
					<el-button type="primary" icon="el-icon-search" @click='searchProducts'>查 询</el-button>
					<router-link to='add-product/0' style='margin-left: 15px;'>
						<el-button type="success" icon="el-icon-plus" @click='setProductOption'>新 增</el-button>
					</router-link>
				</el-col>
			</el-row>

		</div>

		<el-table
			:header-cell-style="{background:'#F3F4F7',color:'#555'}"
		    :data="tableData"
		    style="width: 100%;margin-bottom: 40px;">
		    <el-table-column
		      label="创建日期"
		      width="200">
		      <template slot-scope="scope">
		      	<span>{{scope.row.createDate | formatTime(scope.row.createDate)}}</span>
		      </template>
		    </el-table-column>
		    <el-table-column
		      prop="insuranceName"
		      label="保险公司"
		      width="220">
		    </el-table-column>
		    <el-table-column
		      prop="secondClassName"
		      label="分类"
		      width="180">
		    </el-table-column>
		    <el-table-column
		      prop="name"
		      label="产品名称"
		      width="300">
		    </el-table-column>
		    <el-table-column
		      label="操作"
		      width="200">
		      <template slot-scope="scope">
	      		<el-button
	      			@click.native.prevent="editRow(scope.$index, tableData)"
		          type="text"
		          size="medium">
		          编辑
		        </el-button>
		        <el-button
		          @click.native.prevent="planRow(scope.$index, tableData)"
		          type="text"
		          size="medium">
		          计划
		        </el-button>
		      </template>
		    </el-table-column>
		</el-table>
		<div style="text-align: center;">
			<el-pagination
			  background
			  :current-page='pageNum'
			  layout="prev, pager, next"
			  :total='total' :page-size='pageSize' @current-change='changePage'>
			</el-pagination>
		</div>

	</div>
</template>

<script>
  import { getCompany , getFirstClass , getSecondClass , getProductByConditions } from '@/api/product';
  import { getCommonOption } from '@/utils/getCommonOption'
	export default {
		data(){
			return {
				select_insurance_name:'',//选中的保险公司名称
				select_insuranceOptions:[],
				select_insurance_id:"",//选中的保险公司id
				product_name:'',//产品名称
				parentsValue:'',//选中的一级分类
				select_parents_id:'',//选中的一级分类id
				select_child_id:'',//选中的二级分类id
				childValue:'',//选中的二级分类
				parentsOptions: [],
				childOptions:[],
		    tableData: [],
        pageNum:1,
        pageSize:6,
        total:0
			}
		},
		created(){
		  //获取所有保险公司
	      getCommonOption(getCompany(),this.select_insuranceOptions,[{id:'',name:'全部'}]);
	      //获取一级分类
	      getCommonOption(getFirstClass(),this.parentsOptions);

	      //初始化产品列表
	      this.searchProducts();
	    },
	    computed:{

	    },
		methods:{
			//保险公司下拉菜单change事件
			insuranceChange(res){
				this.select_insurance_id = res;
			},
			parentChange(res){
				this.select_parents_id = res;
				
				//获取二级分类(清空二级分类)
				this.select_child_id = '';
				this.childOptions.length = 0;
				this.childValue = '';
	      		getCommonOption(getSecondClass({firstClassId:this.select_parents_id}),this.childOptions);
			},
			childChange(res){
				this.select_child_id = res;
			},
			searchProducts(changePage){
			  if(changePage != 'changePage'){
          this.pageNum = 1;
        }
				getProductByConditions({firstClassId:this.select_parents_id,secondClassId:this.select_child_id,insuranceId:this.select_insurance_id,name:this.product_name,pageNum:this.pageNum,pageSize:this.pageSize})
				.then(res => {
					this.total = res.result.total
					this.tableData = [];
					if(res.result.data.length){
						res.result.data.map(item => {
							this.tableData.push(item)
						})
					}
				})
			},
			changePage(res){
				this.pageNum = res;
				this.searchProducts('changePage');
			},
			handleClick(row) {
		        console.log(row);
		    },
		    //编辑
		    editRow(index,tabData){
		    	localStorage.setItem("productOption",'bianji');
		    	this.$router.push({name:'Addproduct',params:{id:tabData[index].id}})
		    },
		    //计划
		    planRow(index,tabData){
          		this.$router.push({path:'index-plan/'+tabData[index].id})
		    },
		    setProductOption(){
		    	localStorage.setItem("productOption",'xinzeng');　　
		    }
		},
    
	}
</script>

<style scoped>
	.cli-label{
		height: 40px;
		line-height: 40px;
	}
	.cli-input{
		margin-left: 20px;
	}
</style>
