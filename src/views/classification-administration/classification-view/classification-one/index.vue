<template>
  <div>
    <FilterForm @filterData="filterData" :classify="classify" @openDialog="openDialog"></FilterForm>
    <el-main>
      <el-table
        :data="classifyData.data"
        show-header
        :header-cell-style="{background:'#F3F4F7',color:'#555'}"
        style="margin-bottom: 40px;">
        <el-table-column
          prop="createDate"
          label="添加时间"
          width="220"
          align="center">
          <template slot-scope="scope">
            {{scope.row.createDate | formatTime(scope.row.createDate)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="一级分类"
          align="center">
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序"
          width="200"
          align="center">
        </el-table-column>
        <el-table-column
          label="操作"
          width="200"
          align="center">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="editRow(scope.$index)"
              type="text"
              size="medium">
              编辑
            </el-button>
            <el-button
              type="text"
              size="medium">
              <router-link :to="{path:'classify-two',query:{id:scope.row.id}}">子分类</router-link>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row style="text-align: center;">
        <el-pagination
          background
          layout="prev, pager, next"
          :total=classifyData.total
          @current-change="changePage"
          :current-page.sync="pagination.pageNum"
          :page-size="pagination.pageSize"
        >
        </el-pagination>
      </el-row>
    </el-main>
    <el-dialog
      :title='classifyTitle'
      :visible.sync="classifyDialog"
      :before-close="handleClose"
      center
    >
      <el-form :model="classifyForm" :rules="classifyFormRules" ref="classifyForm" class="demo-ruleForm">
        <el-form-item label="分类名称" prop="name" label-width="120px">
          <el-input v-model="classifyForm.name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort" label-width="120px">
          <el-input v-model="classifyForm.sort" placeholder="请输入排序序号"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="messageHandle('classifyForm')">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import FilterForm from '../../common/filter-form'
  import { getProductClassList,updateProductClass,saveProductClass } from '@/api/classification'
  import {checkNameReg,checkSortReg} from '@/utils/CommonReg'
  export default {
    components:{
      FilterForm
    },
    data(){
      return{
        classifyData:{},
        classifyDialog:false,
        classifyTitle:'',
        classifyForm:{
          name:'',
          sort:'',
          topId:0
        },
        classifyFormRules:{
          name: [
            { validator:checkNameReg,trigger: 'blur' }
          ],
          sort: [
            { validator:checkSortReg, trigger: 'blur' }
          ]
        },
        pagination:{
          pageNum:1,
          pageSize:8
        },
        classify:{
          name:'',
          enabled:'',
        }
      }
    },
    methods:{
      getProductClassListAxios(query){
        getProductClassList(Object.assign({},this.classify,this.pagination,query)).then(res=>{
          if(res.code==='100100'){
            if(res.result.data.length===0 && this.pagination.pageNum!==1){
              this.pagination.pageNum=1;
              this.getProductClassListAxios(this.pagination)
            }
            this.classifyData=res.result;
          }
        })
      },
      updateProductClassAxios(query){
        updateProductClass(query).then(res=>{
          if(res.code==='100100'){
            this.$message.success(res.msg);
            this.handleClose();
            this.reastData()
          }else{
            this.$message.error(res.msg);
          }
        })
      },
      saveProductClassAxios(query){
        saveProductClass(Object.assign({},query)).then(res=>{
          if(res.code==='100100'){
            this.$message.success(res.msg);
            this.handleClose();
            this.reastData()
          }else{
            this.$message.error(res.msg)
          }
        })
      },
      messageHandle(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.classifyTitle.indexOf('新增')!==-1){
              this.saveProductClassAxios(this.classifyForm)
            }else{
              this.updateProductClassAxios(this.classifyForm)
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      editRow(index){
        this.classifyTitle='编辑';
        this.classifyDialog=true;
        this.classifyForm=JSON.parse(JSON.stringify(this.classifyData.data[index]))
      },
      handleClose(formName) {
        this.classifyForm={
          name:'',
          sort:'',
          topId:0
        };
        this.$refs['classifyForm'].resetFields();
        this.classifyDialog = false;
      },
      filterData(value){
        this.pagination={
          pageNum:1,
          pageSize:8
        };
        this.getProductClassListAxios(value)
      },
      reastData(){
        this.classify={
          name:'',
          enabled:''
        };
        this.getProductClassListAxios()
      },
      //新增
      openDialog(){
        this.classifyDialog=true;
        this.classifyTitle='新增';
        this.classifyForm={
          name:'',
          sort:'',
          topId:0
        }
      },
      changePage(e){
        this.pagination.pageNum=e;
        this.getProductClassListAxios()
      }
    }
  }
</script>
