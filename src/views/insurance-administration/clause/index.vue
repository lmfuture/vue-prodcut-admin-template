<template>
  <div>
    <el-row class="clauseHeader">
      <el-col :span="3">
        <img :src="insuranceBase.logoUrl" alt="">
      </el-col>
      <el-col :span="3">
        <h3>{{insuranceBase.name}}</h3>
      </el-col>
      <el-button type="primary" icon='el-icon-plus' @click="addClause">新增条款</el-button>
    </el-row>
    <el-main>
      <el-table
        :data="clauseList.data"
        show-header
        :header-cell-style="{background:'#F3F4F7',color:'#555'}"
        style="margin-bottom: 40px;">
        <el-table-column
          prop="createDate"
          label="添加时间"
          width="200"
          align="center">
          <template slot-scope="scope">
            {{scope.row.createDate | formatTime(scope.row.createDate)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="条款名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="dataTypeStr"
          label="条款类型"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="url"
          label="H5详情"
          width="200"
          align="center">
          <template slot-scope="scope">
            <a v-if="scope.row.url" @click="openH5(scope.row.url,scope.row.title)">预览</a>
            <span v-else>暂无H5展示</span>
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
            <el-button
              @click.native.prevent="delRow(scope.$index)"
              type="text"
              size="medium">
              删除
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
          :page-sizes="[10, 20, 30]"
          :total=clauseList.total
          :page-size="pagination.pageSize"
        >
        </el-pagination>
      </el-row>
    </el-main>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="editClauseDialog"
      @close="closeDialog('clauseOperate')"
      center>
      <el-form :model="clauseOperate" :rules="clauseOperateRules" ref="clauseOperate" class="demo-ruleForm">
        <el-form-item label="条款类型" prop="dataType" label-width="120px">
          <el-select filterable no-match-text="暂无匹配数据" v-model="clauseOperate.dataType" placeholder="请选择条款类型">
            <el-option v-for="item in clauseTypeData" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="条款名称" prop="title" label-width="120px">
          <el-input style="width: 400px;" v-model="clauseOperate.title" placeholder="请输入条款名称"></el-input>
        </el-form-item>
        <el-form-item label="条款文件" prop="url" label-width="120px">
          <el-row v-show="!logoShow">
            <span @click="openH5(clauseOperate.url)">{{clauseOperate.url}}</span>
            <i class="el-icon-close" style="cursor: pointer" @click="handleRemove()"></i>
          </el-row>
          <el-upload
            :action=baseUpLoad
            :with-credentials=true
            :on-success="uploadSuccess"
            v-show="logoShow"
            :file-list="fileList"
            accept='.doc,.docx,.pdf'
            >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">支持格式：.doc .docx .pdf，单个文件不能超过20MB</div>
          </el-upload>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="messageHandle('clauseOperate')">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="delClauseDialog"
      width="40%"
      center
    >
      <h3 style="text-align: center">您确定要删除该内容吗？</h3>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="delHandle">确 定</el-button>
        <el-button @click="delClauseDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {getProductTermsList,deleteTerms,updateTerms,saveTerms} from '@/api/insurance'
  import {checkNameReg,checkSelectReg} from '@/utils/CommonReg'
  export default {
    data(){
      return{
        insuranceBase:{},
        clauseTypeData:[{
          name:'主险条款',
          value:1
        },{
          name:'附加险条款',
          value:2
        }],
        editClauseDialog:false,
        delClauseDialog:false,
        dialogTitle:'添加条款',
        nowIndex:0,    //操作的保险公司下标
        clauseOperate:{
          title:'',
          dataType:'',
          url:'',
          insuracneId:this.$route.query.id
        },
        clauseOperateRules:{
          title: [
            { validator:checkNameReg,trigger: 'change' }
          ],
          dataType: [
            { validator:checkSelectReg  ,trigger: 'change' }
          ]
        },
        clauseList:{},
        pagination:{
          pageNum:1,
          pageSize:10
        },
        fileList:[],
        baseUpLoad:''
      }
    },
    computed: {
      logoShow() {//当图片多于一张的时候，就隐藏上传框
        return this.clauseOperate.url ? false : true
      }
    },
    created(){
      this.baseUpLoad=process.env.VUE_APP_BASE_API+'/admin/upload';
      if(this.$route.query.id){
          this.getProductTermsListAxios();
      }else{
        //this.$router.push({path:'/administration'})
      }
    },
    methods:{
      //初始页面数据
      getProductTermsListAxios(query){
        getProductTermsList(Object.assign({id:this.$route.query.id},this.pagination,query)).then(res=>{
          if(res.code==='100100'){
            if(res.result.productTerms.length===0 && this.pagination.pageNum!==1){
              this.pagination.pageNum=1;
              this.getProductTermsListAxios();
            }
            this.clauseList=res.result.productTerms;
            this.insuranceBase=res.result.insuranceCompany
          }
        })
      },
      // 删除table数据
      deleteTermsAxios(query){
        deleteTerms(Object.assign({},query)).then(res=>{
          if(res.code==='100100'){
            this.handleClose();
            this.$message.success(res.msg);
            this.resetDtata()
          }else{
            this.$message.error(res.msg)
          }
        })
      },
      //更新table条款数据
      updateTermsAxios(query){
        updateTerms(Object.assign({},query)).then(res=>{
          if(res.code==='100100'){
            this.handleClose();
            this.$message.success(res.msg);
            this.resetDtata()
          }else{
            this.$message.error(res.msg)
          }
        })
      },
      //添加table条款数据
      saveTermsAxios(query){
        saveTerms(Object.assign({},query)).then(res=>{
          if(res.code==='100100'){
            this.handleClose();
            this.$message.success(res.msg)
            this.resetDtata()
          }else{
            this.$message.error(res.msg)
          }
        })
      },
      //重置页面数据
      resetDtata(){
        this.getProductTermsListAxios();
        this.handleClose()
      },
      //改变页面pagenum
      changePage(e){
        this.pagination.pageNum=e;
        this.getProductTermsListAxios()
      },
      closeDialog(formRule){
        this.$refs[formRule].resetFields();
      },
      //取消操作 还原原数据
      handleClose(){
        this.editClauseDialog=false;
        this.delClauseDialog=false;
      },
      //提交条款数据
      messageHandle(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.clauseOperate.url){
              if(this.dialogTitle.indexOf('添加')!==-1){
                this.saveTermsAxios(this.clauseOperate)
              }else{
                this.updateTermsAxios(this.clauseOperate)
              }
            }else{
              this.$message.error('请上传文件')
            }

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      delRow(index){
        this.nowIndex=index;
        this.delClauseDialog=true;
      },
      editRow(index){
        this.nowIndex=index;
        this.editClauseDialog=true;
        this.dialogTitle='编辑条款';
        this.clauseOperate=JSON.parse(JSON.stringify(this.clauseList.data[this.nowIndex]));
        this.fileList=[{name:this.clauseOperate.title,url:this.clauseOperate.url}]
      },
      addClause(){
        this.editClauseDialog=true;
        this.dialogTitle='添加条款';
        this.clauseOperate={
          title:'',
          dataType:'',
          url:'',
          insuracneId:this.$route.query.id
        };
        this.fileList=[];
      },
      delHandle(){
        this.deleteTermsAxios(this.clauseList.data[this.nowIndex]);
        //this.delClauseDialog=false;
      },
      //上传文件操作
      uploadSuccess(res,file,fileList){
        if(res.code==='100100'){
          this.clauseOperate.url=res.result;
          this.fileList=fileList;
        }
      },
      //删除上传文件操作
      handleRemove() {
        this.fileList=[];
        this.clauseOperate.url='';
      },
      // 浏览条款操作
      openH5(url,title){
        let t=(window.innerWidth-650)/2;
        window.open (url, title, "height="+window.innerHeight+", width=650,top=80,left="+t+", toolbar =no, menubar=no, scrollbars=no, resizable=no, location=no, status=no")
      }
    }
  }
</script>
<style lang="scss">
  .clauseHeader{
    background: #fff;
    margin-bottom: 20px;
    height: 60px;
    overflow: hidden;
    h3{
      text-align: center;
    }
    & img{
      width: 100%;
      height: 40px;
      margin: 10px;
      display: block;
    }
    button{
      margin: 10px;
    }
  }
  /*.el-dialog__header{*/
    /*background: rgb(251,78,6);*/
    /*padding: 15px 20px;*/
    /*&>.el-dialog__title{*/
      /*color: #fff;*/
    /*}*/
    /*.el-dialog__headerbtn .el-dialog__close{*/
      /*color: #FFF;*/
    /*}*/
  /*}*/
  .el-main{
    background: #fff;
  }

</style>
