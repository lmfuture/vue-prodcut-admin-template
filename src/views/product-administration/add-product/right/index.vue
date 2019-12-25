<template>
	<div>
		<div class="common-title">您拥有的权利</div>
		<div style="margin-bottom: 30px;">
			<el-form ref="form" :rules="model.rules" :model="model">
				<el-table
				    ref="multipleTable"
				    :data="model.tableData3"
				    tooltip-effect="dark"
				    style='width:100%;'
				    >
				    <el-table-column
				      prop="title"
				      label="标题"
				      width='300'
				    >
				      <template slot-scope="scope">
				      	<el-form-item  :prop="'tableData3.' + scope.$index + '.title'" :rules='model.rules.title'>
				      			<el-input
								  type="textarea"
								  :rows="2"
								  placeholder="请输入标题"
								  v-model="scope.row.title">
								</el-input>
					    </el-form-item>
				      </template>
				    </el-table-column>
				    <el-table-column
				      prop="title"
				      label="内容"
				      width='500'
				      >
				      <template slot-scope="scope">
				      	<el-form-item  :prop="'tableData3.' + scope.$index + '.content'" :rules='model.rules.content'>
					      	<el-input
							  type="textarea"
							  :rows="2"
							  placeholder="请输入内容"
							  v-model="scope.row.content">
							</el-input>
					    </el-form-item>
				      </template>
				    </el-table-column>
				    <el-table-column label="操作" align='left'>
				      <template slot-scope="scope" >
							<i class="el-icon-plus" @click='addItem(scope.$index)'></i>
							<i class="el-icon-delete" v-show='scope.$index>0' @click='deleteItem(scope.$index)'></i>
				      </template>
				    </el-table-column>
				    
				</el-table>
			</el-form>
			
		</div>
		
		<div style="text-align: center;">
			<el-button v-show='productOption=="xinzeng"' type="primary" @click="changeActiveName('fourth')">上一步</el-button>
			<el-button type="success" @click="changeActiveName('form')">保 存</el-button>
		    <el-button v-show='productOption=="xinzeng"' type="primary" @click="changeActiveName('sixth')">下一步</el-button>
		</div>
	</div>
</template>

<script>
	import { addPowerInfo , getProductById } from '@/api/product'
	import Qs from 'qs'
	export default {
		data(){
			return {
				id:'',
				model:{
					rules:{
						title: [
				            { required: true, message: '请输入标题', trigger: 'blur' }
				        ],
				        content: [
				            { required: true, message: '请输入内容', trigger: 'blur' }
				        ],
					},
					tableData3:[{
						title:"",
						content:""
					}]
				},
				productOption:''
				
			}
		},
		created(){
			this.productOption = localStorage.getItem('productOption');
			let that = this;
			that.id = that.$route.params.id
			getProductById({id:that.id}).then(res => {
				const resPower = JSON.parse(res.result.power)
				that.model.tableData3 = resPower;
			})
		},
		methods:{
			addItem(index){
				this.model.tableData3.splice(index+1,0,{
					title:"",
					content:""
				})
			},
			deleteItem(index){
				this.$confirm('确定删除该条权利么?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          this.model.tableData3.splice(index,1)
		          this.$message({
		            type: 'success',
		            message: '删除成功!'
		          });
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除'
		          });          
		        });
				
			},
			submitForm(formName) {
	        	
			},	
			changeActiveName(step) {
				if(step == 'form'){
					var that = this;
			        that.$refs['form'].validate((valid) => {
				          if (valid) {
				          	const addData = {
								id:that.id,
								power:JSON.stringify(that.model.tableData3)
							}
							addPowerInfo(Qs.stringify(addData)).then(res => {
								if(res.code == '100100'){
									this.$message({
							          message: '保存成功',
							          type: 'success'
							        });
								}else{
					      			this.$message.error('保存失败');
						      		return;
					      		}
							})
				          } else {
				            return false;
				          }
					})
				}else{
					this.$emit('changeActiveName',step)
				}
		    }
		}
	}
</script>

<style scoped lang="scss">
	*{
		font-size:14px;
	}
	.right-item{
		padding:20px 20px;
		border:1px solid #eee;
		position: relative;
		border-bottom:none;
	}
	
	.right-item:last-child{
		border-bottom:1px solid #eee;
	}

	.title-content{
		height: 40px;
		line-height: 40px;
	}
	.title-input{
		height: 40px;
		line-height: 40px;
		width: 78%;
		padding: 0 10px;
		outline: none;
	}
	.item-title{
		font-weight:500;
	}
	.right-item .title-content:nth-of-type(1){
		margin-bottom: 10px;
	}
	.el-icon-plus,.el-icon-delete{
		font-size:28px;
		color:#409EFF;
		cursor:pointer;
	}
	.el-icon-plus{
		margin-right:20px;
	}
	/deep/ .el-form-item{
		margin-bottom: 15px!important;
    	margin-top: 15px;
	}
	/deep/ .el-form-item__error{
		width:100%;
		text-align:center;
	}

</style>
