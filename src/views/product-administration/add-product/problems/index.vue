<template>
	<div>
		<el-button type="primary" icon="el-icon-plus" style='margin-top: 10px;margin-bottom: 10px;' @click='showAddDialog()'>新 增</el-button>
		<el-table
	    :data="tableData"
	    style="margin-top: 10px;"
	    empty-text="暂无添加问题"
      :header-cell-style="{background:'#F3F4F7',color:'#555'}"
	    >
	    <el-table-column
	      prop="serial"
	      label="序号"
	      width="120">
	    </el-table-column>
	    <el-table-column
	      prop="question"
	      label="问题"
	      width="260">
	    </el-table-column>
	    <el-table-column
	      prop="answer"
	      label="答案"
	      width="360">
	    </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="60" align='center'>
        <template slot-scope="scope">
          <span>{{scope.row.status==0?'无效':'有效'}}</span>
        </template>
      </el-table-column>
	    <el-table-column
	      label="操作"
	      width="260" align='center'>
	      <template slot-scope="scope">
          <el-button
            type="text"
            @click.native.prevent="changeStatus(scope.$index, tableData)"
            size="medium">
            {{scope.row.status==0?'有效':'无效'}}
          </el-button>
	      	<el-button
	          type="text"
	          @click.native.prevent="resetRow(scope.$index, tableData)"
	          size="medium">
	          修改
	        </el-button>
	        <el-button
	          @click.native.prevent="deleteRow(scope.$index, tableData)"
	          type="text"
	          size="medium">
	          移除
	        </el-button>
	      </template>
	    </el-table-column>
	  </el-table>

	  <el-dialog title="编辑问题" :visible.sync="dialogFormVisible">
		  <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
		    <el-form-item label="问题" :label-width="formLabelWidth" prop="question">
		      <el-input v-model="ruleForm.question" autocomplete="off"></el-input>
		  	</el-form-item>
		    <el-form-item label="答案" :label-width="formLabelWidth" prop="answer">
		      <el-input
				  type="textarea"
				  :rows="4"
				  placeholder="请输入内容"
				  v-model="ruleForm.answer">
				</el-input>
		  	</el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio label="0">无效</el-radio>
            <el-radio label="1">有效</el-radio>
          </el-radio-group>
        </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="dialogFormVisible = false">取 消</el-button>
		    <el-button type="primary" @click="addQuestion('ruleForm')">确 定</el-button>
		  </div>
		</el-dialog>
		<div style="text-align: center;padding-top: 30px;margin-bottom: 20px;">
      <el-button v-show='productOption=="xinzeng"' type='primary' @click="changeActiveName('fifth')">上一步</el-button>
      <!-- <el-button type='success' @click="baocun">保存</el-button> -->
		    <el-button v-show='productOption=="xinzeng"' type='primary' @click="changeActiveName('seventh')">下一步</el-button>
		</div>
	</div>
</template> 

<script>
  import { getCommonProblem , addCommonProblem , updateCommonProblem , deleteCommonProblem , updateCommonProblemByStatus } from '@/api/product'
  import Qs from 'qs'
  export default {
    data() {
      return {
        id:"",
        tableData: [],
        ruleForm:{
          question: '',
          answer: '',
          status:'0',
          id:'',
          serial:''
        },
        rules:{
          question: [
            { required: true, message: '请输入问题', trigger: 'blur' }
          ],
          answer: [
            { required: true, message: '请输入答案', trigger: 'blur' }
          ],
        },
        dialogFormVisible: false,
        formLabelWidth: '50px',
        resetIndex:null,
        productOption:''
      }
    },
    created(){
      this.productOption = localStorage.getItem('productOption');
      this.id = this.$route.params.id
      getCommonProblem({id:this.id}).then(res => {
        res.result.map((value,index) => {
          value.serial = index+1;
          this.tableData.push(value)
        })
      })
    },
    methods: {
      deleteRow(index, tableData) {
        let that = this;
        const id = tableData[index].id;
      	that.$confirm('您确定要移除该条内容么', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        	deleteCommonProblem({id:id}).then(res => {
            getCommonProblem({id:that.id}).then(res => {
              that.tableData = [];
              res.result.map((value,index) => {
                value.serial = index+1;
                that.tableData.push(value)
              })
              that.$message.success('移除成功');
            })
          })
        }).catch(() => {
          that.$message({
            type: 'info',
            message: '已取消移除'
          });          
        });
      },
      showAddDialog(){
      	this.dialogFormVisible=true;
      	this.ruleForm.serial = this.tableData.length+1;
      	this.ruleForm.question = '';
      	this.ruleForm.answer = '';
        this.ruleForm.status = '0'
        this.ruleForm.id = ''
      },
      addQuestion(formName){
        let that = this;
        that.$refs[formName].validate((valid) => {
          if (valid) {
            let addData = {
              productId:this.id,
              status:that.ruleForm.status,
              answer:that.ruleForm.answer,
              question:that.ruleForm.question
            }
            if(that.resetIndex != null){
                addData.id = that.ruleForm.id
                updateCommonProblem(Qs.parse(addData)).then(res => {
                  getCommonProblem({id:that.id}).then(res => {
                    that.tableData = [];
                    res.result.map((value,index) => {
                      value.serial = index+1;
                      that.tableData.push(value)
                    })
                    that.$message.success('保存成功');
                  })
                })
                that.resetIndex = null;
            }else{
                addData.id = "";
                addCommonProblem(Qs.parse(addData)).then(res => {
                  addData.serial = that.ruleForm.serial;
                  addData.id = res.result.id;
                  that.tableData.push(addData)
                  that.$message.success('保存成功');
                  that.$refs[formName].resetFields();
                })
            }
            that.dialogFormVisible = false;
          } else {
            that.$message.error('保存失败');
            that.dialogFormVisible = false;
            return false;
          }
        });
      },
      resetRow(index,tabData){
      	this.resetIndex = index;
      	this.ruleForm.serial = tabData[index].serial;
      	this.ruleForm.question = tabData[index].question;
      	this.ruleForm.answer = tabData[index].answer;
        this.ruleForm.status = tabData[index].status.toString();
        this.ruleForm.id = tabData[index].id;
      	this.dialogFormVisible = true;
      },
      changeActiveName(step) {
      	this.$emit('changeActiveName',step)
      },
      baocun(){
        this.$message.success('保存成功');
      },
      changeStatus(index,tabData) {
        let that = this;
        const id = tabData[index].id;
        const status = tabData[index].status=='1'?'0':'1';
        that.$confirm('您确定要修改该条问题状态么', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateCommonProblemByStatus({id:id,status:status}).then(res => {
            getCommonProblem({id:that.id}).then(res => {
              that.tableData = [];
              res.result.map((value,index) => {
                value.serial = index+1;
                that.tableData.push(value)
              })
              that.$message.success('保存成功');
            })
          })
        }).catch(() => {
          that.$message({
            type: 'info',
            message: '已取消'
          });          
        });
      }
        
    },
  }
</script>
