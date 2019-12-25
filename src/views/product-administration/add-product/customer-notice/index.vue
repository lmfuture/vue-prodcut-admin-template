<template>
	<div>
		<el-button type="primary" icon='el-icon-plus' style='margin-top: 10px;margin-bottom: 10px;' @click='showAddDialog()'>新 增</el-button>
		<el-table
	    :data="tableData"
	    style="margin-top: 10px;width: 100%;"
	    :header-cell-style="{background:'#F3F4F7',color:'#555'}"
	    empty-text="暂无数据"
	    >
	    <el-table-column
	      prop="dataName"
	      label="类型"
	      width="250">
	    </el-table-column>
	    <el-table-column
	      prop="title"
	      label="标题"
	      width="500">
	    </el-table-column>
	    <el-table-column
	      label="预览"
	      width="100">
	      <template slot-scope="scope">
			<el-button
	          @click.native.prevent="previewRow(scope.$index, tableData)"
	          type="text"
	          size="medium">
	          预览
	        </el-button>
	      </template>
	    </el-table-column>
	    <el-table-column
	      label="操作"
	      width="220" align='center'>
	      <template slot-scope="scope">
	        <el-button
	          @click.native.prevent="deleteRow(scope.$index, tableData)"
	          type="text"
	          size="medium">
	          删除
	        </el-button>
	        <el-button
	          type="text"
	          @click.native.prevent="resetRow(scope.$index, tableData)"
	          size="medium">
	          修改
	        </el-button>
	      </template>
	    </el-table-column>
	  </el-table>
    <div style="text-align: center;padding-top: 30px;margin-bottom: 50px;">
      <el-button type="success" @click="listBack">返回产品列表</el-button>
    </div>
	<!--新增弹框-->
	  <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible">
		  <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
		    <el-form-item label="类型" :label-width="formLabelWidth" prop="type">
		      <el-select v-model="ruleForm.type" placeholder="请选择" @change='typeChange'>
			    <el-option
			      v-for="item in options_type"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			  </el-select>
		  	</el-form-item>

		  	<el-form-item v-if='isShowChooseTiaokuan' label="条款" :label-width="formLabelWidth"  prop="term" >
	  			<el-select v-model="ruleForm.term" @change='termSelectChange' placeholder="请选择" style='width:70%;'>
				    <el-option
				      v-for="item in options_name"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				</el-select>
				<el-button type='primary' @click='toAddTerms'>添加条款</el-button>
		  	</el-form-item>

			<el-form-item v-if='isShowUpload' label="标题" :label-width="formLabelWidth" prop="title" >
		    	<el-col :span='16'>
		    		<el-input
					  type="text"
					  placeholder="请输入标题"
					  v-model="ruleForm.title">
					</el-input>
		    	</el-col>
		  	</el-form-item>

			<el-form-item v-if='isShowUpload' label="文件上传" :label-width="formLabelWidth">
				<el-upload
				  class="upload-demo"
				  :action=baseUpload
				  :on-preview="handlePreview"
				  :on-success='uploadSuccess'
				  :on-remove="handleRemove"
				  :before-remove="beforeRemove"
				  accept=".doc,.docx,.pdf,.xlsx"
				  :with-credentials=true
				  multiple
				  :limit="1"
				  ref='upload'
				  :on-error='uploadError'
				  :on-exceed="handleExceed"
				  :file-list="fileList">
				  <el-button type="primary">点击上传<i class="el-icon-upload el-icon--right"></i></el-button>
				  <div slot="tip" class="el-upload__tip">支持格式：.doc .docx .pdf .xlsx，单个文件不能超过20MB</div>
				</el-upload>
			</el-form-item>
		    

		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="dialogFormVisible = false">取 消</el-button>
		    <el-button type="primary" @click="addFile('ruleForm')">确 定</el-button>
		  </div>
		</el-dialog>


	<!--预览弹框-->
		<el-dialog
		  :title="previewTitle"
		  :visible.sync="previewDialogVisible"
		  width='75%'
		  top='0'
		  center>
		  <iframe :src="previewUrl" frameborder="0" style="width: 100%;height: 600px;"></iframe>
		  <!-- <span slot="footer" class="dialog-footer">
		    <el-button type='primary' @click="previewDialogVisible = false">关 闭</el-button>
		  </span> -->
		</el-dialog>
		<!-- <div style="text-align: center;padding-top: 30px;margin-bottom: 20px;">
			<el-button type="primary" @click="">提 交</el-button>
		</div> -->
	</div>
</template>

<script>
  import { getProductById , getCustomerInformation , deleteCustomerInformation , getTermsByType , addCustomerInformation }	from '@/api/product'
  import Qs from 'qs'
  export default {
    data() {
      return {
      	listId:'',
      	insuracneId:'',
      	baseUpload:'',
      	uploadUrl:'',
      	uploadName:'',
        tableData: [],
        ruleForm:{
        	type: '',
        	term: '',
        	title:''
        },
        rules:{
        	type: [
	            { required: true, message: '请选择文件类型', trigger: 'blur' }
	        ],
	        term: [
	            { required: true, message: '请选择条款', trigger: 'blur' }
	        ],
	        title: [
	            { required: true, message: '请输入文件标题', trigger: 'blur' }
	        ]
        },
        options_type: [{
          value: '1',
          label: '保险条款'
        }, {
          value: '2',
          label: '附加险条款'
        }, {
          value: '3',
          label: '费率表'
        }, {
          value: '4',
          label: '客户告知书'
        }, {
          value: '5',
          label: '保单样本'
        }, {
          value: '6',
          label: '保险金赔付比例'
        }],
        options_name: [],
        
        dialogFormVisible: false,
        dialogFormTitle:'修改',

        previewDialogVisible:false,
        previewUrl:'',
        previewTitle:'',
        formLabelWidth: '100px',
        resetIndex:null,

        isShowUpload:false,
        isShowChooseTiaokuan:false,

        typeValue:'',
        
        selectTermId:'',

        fileList: [],
        previewTitle:'',
        previewContent:'',
        pageNum:1,
        pageSize:15
      }
    },
    created(){
    	this.baseUpload = process.env.VUE_APP_BASE_API+'/admin/upload';
		this.id = this.$route.params.id;
		this.getCustomer(this.id);
		getTermsByType({id:this.id}).then(res => {
			this.insuracneId = res.result[0].insuracneId;
			res.result.map(item => {
				let termOptionitem = {};
				termOptionitem.label = item.title;
				termOptionitem.value = item.id;
				this.options_name.push(termOptionitem);
			})
		})

	},
    methods: {
      deleteRow(index, rows) {
      	deleteCustomerInformation({id:rows[index].id}).then(res => {
      		this.$confirm('您确定要移除该条内容么', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	        	this.getCustomer(this.id);
	          this.$message({
	            type: 'success',
	            message: '删除成功!'
	          });
	        }).catch(() => {
	          this.$message({
	            type: 'info',
	            message: '已取消移除'
	          });
	        });
      	})
      },
      showAddDialog(){
      	this.dialogFormVisible=true;
      	this.isShowUpload = true;
      	this.isShowChooseTiaokuan = true;
      	this.$nextTick(()=>{
      		this.$refs['ruleForm'].resetFields()
      		this.$refs.upload.clearFiles();
      		this.uploadName = '';
      		this.ruleForm.type = "";
      		this.ruleForm.title = '';
      		this.ruleForm.term = "";
      		this.listId = "";
      	})
      },
      addFile(){
      	let that = this;
      	this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
          	if(this.uploadName == '' && (this.typeValue!=1 && this.typeValue!=2)){
          		this.$message.error('请上传正确的文件，且文件大小不超过20MB');
          		return;
          	}else{
          		addCustomerInformation(Qs.parse({fileId:this.selectTermId,id:this.listId,dataType:this.typeValue,insuracneId:this.insuracneId,productId:this.id,title:this.ruleForm.title,url:this.uploadUrl+'?fileName='+this.uploadName})).then(res => {
          			if(res.code == '402003'){
          				this.$message.error('该条款不能重复添加！');
          				return;
          			}else{
          				that.getCustomer(that.id)
          			}
          			this.dialogFormVisible=false;
          		})
          	}
          } else {
            console.log('提交失败');
            return false;
          }
        });
      	//this.dialogFormVisible = false;
      },
      resetRow(index,tabData){
      	this.dialogFormVisible = true;
      	this.typeValue = tabData[index].dataType;
      	this.listId = tabData[index].id;
      	switch(this.typeValue){
			case 1:
			this.ruleForm.type = '主险条款'
			break;
			case 2:
			this.ruleForm.type = '附加险条款'
			break;
			case 3:
			this.ruleForm.type = '费率表'
			break;
			case 4:
			this.ruleForm.type = '客户告知书'
			break;
			case 5:
			this.ruleForm.type = '保单样本'
			break;
			default:
			this.ruleForm.type = '保险金赔付比例'
		}

		let fileUrl = tabData[index].url;
		if(fileUrl.indexOf('fileName') != -1){
			this.uploadName = fileUrl.split('fileName=')[1];
			this.fileList.length = 0;
			this.fileList.push({
				name:fileUrl.split('fileName=')[1],
				url:fileUrl.split('fileName=')[0]
			})
		}

      	if(tabData[index].dataType == 1 || tabData[index].dataType == 2 ){
      		this.isShowChooseTiaokuan = true;
      		this.isShowUpload = false;
      		this.typeValue = tabData[index].dataType;
	      	this.ruleForm.term = tabData[index].title;
      	}else {
      		this.isShowChooseTiaokuan = false;
      		this.isShowUpload = true;
      		this.ruleForm.title = tabData[index].title;
      	}
	      this.type = tabData[index].dataName;
      	this.selectTermId = tabData[index].fileId;
      },
      uploadError(err, file, fileList){
      	this.$message.error('请上传正确的文件格式，且文件大小不超过20MB');
      },
      uploadSuccess(res,file){
      	this.uploadUrl = res.result;
      	this.uploadName = file.name;
      	this.$message.success('上传成功');
      },
      changeActiveName() {
      	this.$emit('changeActiveName','eighth')
      },
      //文件上传方法
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },

      //预览功能
      previewRow(index,data){
        this.previewUrl='';
      	this.previewUrl=data[index].url;
      	this.previewTitle = data[index].title;
      	this.openH5(data[index].url,data[index].title)
      	//this.previewDialogVisible = true;
      },

      typeChange(value){
      	this.typeValue = value;
      	let errArr = document.getElementsByClassName('el-form-item__error');
      	for (var i = 0; i < errArr.length; i++) { 
      		errArr[i].innerHTML = "";
		}
      	if(value == 1 || value == 2){
      		this.isShowChooseTiaokuan = true;
      		this.isShowUpload = false;
      	}else{
      		this.isShowChooseTiaokuan = false;
      		this.isShowUpload = true;
      	}
      },

      //获取客户须知列表
      getCustomer(id){
      	getCustomerInformation({id:id,pageNum:1,pageSize:15}).then(res => {
			let dataArr = res.result.data;
			dataArr.map(item => {
				let datatype = item.dataType;
				switch(datatype){
					case 1:
					item.dataName = '主险条款'
					break;
					case 2:
					item.dataName = '附加险条款'
					break;
					case 3:
					item.dataName = '费率表'
					break;
					case 4:
					item.dataName = '客户告知书'
					break;
					case 5:
					item.dataName = '保单样本'
					break;
					default:
					item.dataName = '保险金赔付比例'
				}
			})
			this.tableData = dataArr;
	  	})
      },
      termSelectChange(value){
        this.selectTermId = value;
      },
      // 浏览条款操作
      openH5(url,title){
        let t=(window.innerWidth-650)/2;
        window.open (url, title, "height="+window.innerHeight+", width=650,top=80,left="+t+", toolbar =no, menubar=no, scrollbars=no, resizable=no, location=no, status=no")
      },
      toAddTerms(){
      	this.$router.push({name:'Clause',query:{id:this.insuracneId}})
      },
      listBack(){
        this.$router.push('/product-administration/index-product/index-product')
      }
    },
  }
</script>

<style scoped>
	.dialog-footer{
		text-align: center;
	}
	/deep/ .el-dialog__body{
		padding-bottom: 0;
	}
</style>
