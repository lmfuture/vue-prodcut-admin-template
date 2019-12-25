<template>
  <div>
    <el-header>
      <el-form :model="searchInsurance" ref="searchInsurance" class="demo-ruleForm">
        <el-form-item label="所属保险公司" prop="insurance">
          <el-col :span="5">
            <el-select filterable no-match-text="暂无匹配数据" v-model="searchInsurance.keyValue" placeholder="请选择保险公司">
              <el-option v-for="item in insuranceData.companyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-col>
          <el-col :span="11">
            <el-button icon='el-icon-search' type="primary" @click="searchData">查 询</el-button>
            <el-button icon='el-icon-plus' type='success' @click="addInsurance">新 增</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-table
        :data="insuranceTable.data"
        show-header
        :header-cell-style="{background:'#F3F4F7',color:'#555'}"
        style="margin-bottom: 40px;">
        <el-table-column
          prop="createDate"
          label="创建日期"
          width="200"
          align="center">
          <template slot-scope="scope">
            {{scope.row.createDate | formatTime(scope.row.createDate)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="保险公司"
          width="220"
          align="center">
        </el-table-column>
        <el-table-column
          prop="logoUrl"
          label="Logo"
          width="180"
          align="center">
          <template slot-scope="scope">
            <img style="width:150px;height: 50px;" v-if="scope.row.logoUrl" :src="scope.row.logoUrl" alt="" />
            <span v-else>暂无Logo</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="balanceCycle"
          label="结算日期"
          align="center">
        </el-table-column>
        <el-table-column
          prop="clause"
          label="保险条款"
          width="200"
          align="center">
          <template slot-scope="scope">
            <router-link :to="{path:'clause',query:{'id':scope.row.id}}">查看</router-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="clause"
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
          </template>
        </el-table-column>
      </el-table>
      <el-row style="text-align: center;">
        <el-pagination
          background
          @current-change="changePage"
          :current-page.sync="pagination.pageNum"
          layout="prev, pager, next"
          :total=insuranceTable.total
          :page-size="pagination.pageSize"
        >
        </el-pagination>
      </el-row>
    </el-main>
    <el-dialog
      @close="closeDialog('insuranceOperate')"
      :title="dialogTitle"
      :visible.sync="editInsuranceDialog"
      center>
      <el-form :model="insuranceOperate" :rules="insuranceOperateRules" ref="insuranceOperate" class="demo-ruleForm">
        <el-form-item label="保险公司名称" prop="name" label-width="120px">
          <el-input v-model="insuranceOperate.name" placeholder="请输入保险公司名称"></el-input>
        </el-form-item>
        <el-form-item label="保险公司Logo" prop="logoUrl" label-width="120px">
          <el-row v-show="logoShow" class="showLogo">
            <img :src="insuranceOperate.logoUrl" alt="">
            <i class="el-icon-close" @click="handldAvatarRemove()"></i>
          </el-row>
          <el-upload
            list-type="picture-card"
            :action=baseUpLoad
            :with-credentials=true
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            v-show="!logoShow"
            accept='.jpg,.png'
            :file-list="fileLoad"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="结算日期" prop="balanceCycle" label-width="120px">
          <el-input v-model="insuranceOperate.balanceCycle" placeholder="请输入每月结算日期"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="messageHandle('insuranceOperate')">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>

</template>
<script>
  import {getInsuranceList,updateInsurance,saveInsurance} from '@/api/insurance'
  import {checkNameReg,checkMonthReg,checkUploadReg} from '@/utils/CommonReg'
  export default {
    data(){
      return{
        editInsuranceDialog:false,
        delInsuranceDialog:false,
        dialogTitle:'添加保险公司',
        nowIndex:0,    //操作的保险公司下标
        insuranceOperate:{
          name:'',
          logoUrl:'',
          balanceCycle:''
        },
        searchInsurance:{
          keyValue:''
        },
        insuranceOperateRules:{
          name: [
            { validator:checkNameReg,trigger: 'blur' }
          ],
          balanceCycle: [
            { validator:checkMonthReg, trigger: 'blur' }
          ]
        },
        insuranceData:{},
        insuranceTable:{},
        pagination:{
          pageNum:1,
          pageSize:8
        },
        fileLoad:[],
        baseUpLoad:''
      }
    },
    created(){
      this.baseUpLoad=process.env.VUE_APP_BASE_API+'/admin/upload';
      this.insuranceAxios();
    },
    computed: {
      logoShow() {//当图片多于一张的时候，就隐藏上传框
        return this.insuranceOperate.logoUrl === '' ? false : true
      }
    },
    methods:{
      //条件查询数据
      searchData(){
        this.pagination={
          pageNum:1,
          pageSize:8
        };
        this.insuranceAxios(this.searchInsurance)
      },
      //获取页面所有数据
      insuranceAxios(query){
        getInsuranceList(Object.assign({},query,this.pagination)).then(res => {
          if(res.code==='100100'){
            this.insuranceData=res.result;
            this.insuranceData.companyList=[{id:'',name:'全部'}].concat(this.insuranceData.companyList);
            this.insuranceTable=this.insuranceData.insuranceCompanyPage
          }
        });
      },
      //修改保险公司数据
      updateInsuranceAxios(query){
        updateInsurance(Object.assign({},query)).then(res=>{
          if(res.code==='100100'){
            this.handleClose();
            this.$message.success(res.msg);
            this.resetSearchData();
          }else{
            this.$message.error(res.msg)
          }
        })
      },
      //修改保险公司数据
      saveInsuranceAxios(query){
        saveInsurance(Object.assign({},query)).then(res=>{
          if(res.code==='100100'){
            this.handleClose();
            this.$message.success(res.msg);
            this.resetSearchData();
          }else{
            this.$message.error(res.msg)
          }
        })
      },
      //重置页面数据
      resetSearchData(){
        this.pagination={
          pageNum:1,
          pageSize:8
        };
        this.searchInsurance.keyValue='';
        this.insuranceAxios(Object.assign(this.searchInsurance,this.pagination))
      },
      //改变页面pagenum
      changePage(e){
        this.pagination.pageNum=e;
        this.insuranceAxios()
      },
      closeDialog(formRule){
        this.$refs[formRule].resetFields();
      },
      //关闭dialog
      handleClose(){
        this.editInsuranceDialog=false;
        this.handldAvatarRemove()
      },
      //提交保险公司信息
      messageHandle(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.insuranceOperate.logoUrl){
              if(this.dialogTitle.indexOf('添加')!=-1){
                this.saveInsuranceAxios(this.insuranceOperate)
              }else{
                this.updateInsuranceAxios(this.insuranceOperate)
              }
            }else{
              this.$message.error('请上传图片')
            }

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //添加保险公司信息
      addInsurance(){
        this.insuranceOperate={
          name:'',
          logoUrl:'',
          balanceCycle:''
        };
        this.editInsuranceDialog=true;
        this.dialogTitle='添加保险公司信息';
      },
      //编辑保险公司信息
      editRow(index){
        console.log(index)
        this.nowIndex=index;
        this.editInsuranceDialog=true;
        this.dialogTitle='编辑保险公司信息';
        this.insuranceOperate=JSON.parse(JSON.stringify(this.insuranceTable.data[this.nowIndex]));
      },
      //上传图片操作
      handleAvatarSuccess(res, file,fileList) {
        if(res.code==='100100'){
          this.fileLoad=fileList;
          this.insuranceOperate.logoUrl=res.result;
        }
      },
      //上传图片前的操作
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isLt2M;
      },
      //移除图片
      handldAvatarRemove(){
        this.insuranceOperate.logoUrl='';
        this.fileLoad=[];
      }
    }
  }
</script>
<style scoped lang="scss">
  .el-header,.el-main{
    background: #fff;
  }
  .el-header{
    margin-bottom: 20px;
  }
  .showLogo{
    width: 148px;
    height: 148px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    border-radius: 8px;
    i{
      position: absolute;
      font-size: 22px;
      top: 0;
      right: 0;
      display: none;
    }
    &:hover{
      i{
        display: block;
      }
    }
    img{
      width: 100%;
      height: 100%;
    }
  }
</style>
