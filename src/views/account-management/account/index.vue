<template>
    <el-row>
      <div class="el-header">
        <el-form :model="formAccount" ref="formAccount" class="demo-ruleForm">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="登录账号" prop="username" label-width="120px">
                  <el-input v-model.trim="formAccount.username"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="名称" prop="name" label-width="120px">
                  <el-input v-model.trim="formAccount.name"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="手机号码" prop="phone" label-width="120px">
                  <el-input v-model.trim="formAccount.phone"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="账户状态" prop="isEnable" label-width="120px">
                  <el-select filterable no-match-text="暂无匹配数据" v-model="formAccount.isEnable" placeholder="请选择保险公司">
                    <el-option v-for="item in statusData" :key="item.value" :label="item.name" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-button icon='el-icon-search' @click="searchData(1)" type="primary">查 询</el-button>
                <el-button icon='el-icon-plus' @click="addAccount" type='success'>新 增</el-button>
              </el-col>
            </el-row>
        </el-form>
      </div>
      <el-main>
        <el-table
          :data="tableData.data"
          show-header
          :header-cell-style="{background:'#F3F4F7',color:'#555'}"
          style="margin-bottom: 40px;">
          <el-table-column
            prop="createTime"
            label="添加时间"
            width="200"
            align="center">
            <template slot-scope="scope">
              {{scope.row.createDate | formatTime(scope.row.createDate)}}
            </template>
          </el-table-column>
          <el-table-column
            prop="username"
            label="登录账号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="手机号"
            width="200"
            align="center">
          </el-table-column>
          <el-table-column
            prop="roleName"
            label="角色名称"
            width="200"
            align="center">
          </el-table-column>
          <el-table-column
            prop="isEnable"
            label="账户状态"
            align="center">
            <template slot-scope="scope">
              {{scope.row.isEnable?'有效':'无效'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="clause"
            label="操作"
            width="240"
            align="center">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="editRow(scope.$index)"
                type="text"
                size="medium">
                编辑账户
              </el-button>
              <el-button
                @click.native.prevent="rootBtn(scope.$index)"
                type="text"
                size="medium">
                {{scope.row.isEnable?'冻结账户':'开启账户'}}
              </el-button>
              <el-button
                @click.native.prevent="resetPWD(scope.$index)"
                type="text"
                size="medium">
                重置密码
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
            :total="tableData.total"
            :page-size="pagination.pageSize"
          >
          </el-pagination>
        </el-row>
      </el-main>
      <el-dialog
        title="提示"
        :visible.sync="hintDialog"
        width="40%"
        center
      >
        <h3 style="text-align: center">{{hintContent}}</h3>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="hintHandle">确 定</el-button>
        <el-button @click="hintClose">取 消</el-button>
      </span>
      </el-dialog>
      <el-dialog
        title="提示"
        :visible.sync="pwdDialog"
        width="40%"
        center
      >
        <h3 style="text-align: center">密码重置后，请使用新密码登录。新密码为123456</h3>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="pwdHandle">确 定</el-button>
        <el-button @click="pwdClose">取 消</el-button>
      </span>
      </el-dialog>
      <el-dialog
        :title="messageTitle"
        :visible.sync="messageDialog"
        width="40%"
        center
      >
        <el-form :model="formMessage" :rules="formMessageRules" ref="formMessage" class="demo-ruleForm">
          <el-form-item label="登录账号" prop="username" label-width="120px">
            <el-input :readonly="isReadonly" style="width: 300px;" v-model.trim="formMessage.username" placeholder="请输入登录账号"></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="name" label-width="120px">
            <el-input style="width: 300px;" v-model.trim="formMessage.name" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="phone" label-width="120px">
            <el-input style="width: 300px;" maxlength="11" v-model.trim="formMessage.phone" placeholder="请输入手机号码"></el-input>
          </el-form-item>
          <el-form-item label="角色名称" prop="roleId" label-width="120px">
            <el-select style="width: 300px;" filterable no-match-text="暂无匹配数据" v-model="formMessage.roleId" placeholder="请选择角色名称">
              <el-option v-for="item in roleData" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="messageHandle('formMessage')">确 定</el-button>
          <el-button @click="messageClose">取 消</el-button>
        </span>
      </el-dialog>
    </el-row>
</template>

<script>
  import {findSystemUserPagination,isEnable,resetPassword,insert,findSysRoleAll,update} from '@/api/account'
  import {checkTelReg,checkNameReg,checkAccoutReg,checkSelectReg} from '@/utils/CommonReg'
    export default {
      data(){
        return{
          formAccount:{
            username:'',
            name:'',
            phone:'',
            isEnable:null
          },
          formMessage:{
            username:'',
            name:'',
            phone:'',
            roleId:''
          },
          formMessageRules:{
            username: [
              { validator: checkAccoutReg, trigger: 'blur' }
            ],
            name: [
              { validator: checkNameReg,trigger: 'blur' }
            ],
            phone: [
              { validator: checkTelReg, trigger: 'blur' }
            ],
            roleId:[
              { validator:checkSelectReg,trigger: 'blur' }
            ]
          },
          statusData:[{
            name:'全部',
            value:null
          },{
            name:'有效',
            value:1
          },{
            name:'无效',
            value:0
          }],
          nowIndex:0,
          tableData:{},
          roleData:[],
          pagination:{
            pageNum:1,
            pageSize:6
          },
          hintDialog:false,
          hintContent:'',
          messageDialog:false,
          messageTitle:'',
          pwdDialog:false
        }
      },
      created(){
        this.findSystemUserPaginationAxios();
        this.findSysRoleAllAxios();
      },
      computed:{
        //编辑时不可改变用户名
        isReadonly(){
          if(this.messageTitle.indexOf('新增')===-1){
            return true;
          }else{
            return false;
          }
        }
      },
      methods:{
        //获取页面表格数据接口
        findSystemUserPaginationAxios(query){
          findSystemUserPagination(Object.assign({},this.formAccount,this.pagination,query)).then(res=>{
            if(res.code==='100100'){
              if(res.result.data.length===0 && this.pagination.pageNum!==1){
                this.pagination.pageNum=1;
                this.findSystemUserPaginationAxios()
              }
              this.tableData=res.result;
            }
          })
        },
        //启用禁用账户接口
        isEnableAxios(query){
          isEnable(query).then(res=>{
            if(res.code==='100100'){
              this.$message.success(res.msg);
              this.searchData();
            }else{
              this.$message.error(res.msg)
            }
          })
        },
        //重置密码接口
        resetPasswordAxios(query){
          resetPassword(query).then(res=>{
            if(res.code==='100100'){
              this.$message.success(res.msg);
              this.searchData();
            }else{
              this.$message.error(res.msg)
            }
          })
        },
        //保存数据接口
        insertAxios(query){
          insert(query).then(res=>{
            if(res.code==='100100'){
              this.$message.success(res.msg);
              this.searchData();
            }else{
              this.$message.error(res.msg)
            }
          })
        },
        //更新数据接口
        updateAxios(query){
          update(query).then(res=>{
            if(res.code==='100100'){
              this.$message.success(res.msg);
              this.searchData()
            }else{
              this.$message.error(res.msg)
            }
          })
        },
        //查询所有权限
        findSysRoleAllAxios(query){
          findSysRoleAll(query).then(res=>{
            if(res.code==='100100'){
              this.roleData=res.result;
            }
          })
        },
        //查询条件事件
        searchData(index){
          if(index){
            this.pagination.pageNum=1;
          }
          this.messageDialog=false;
          this.hintDialog=false;
          this.pwdDialog=false;
          if(this.formAccount.isEnable){
            this.formAccount.isEnable===1?this.formAccount.isEnable=true:this.formAccount.isEnable=false;
          }
          this.findSystemUserPaginationAxios(this.formAccount);
          if(this.formAccount.isEnable){
            this.formAccount.isEnable===true?this.formAccount.isEnable=1:this.formAccount.isEnable=0
          }
        },
        //编辑页面数据事件
        editRow(index){
          this.messageTitle='编辑';
          this.formMessage=JSON.parse(JSON.stringify(this.tableData.data[index]))
          this.messageDialog=true
        },
        //新增页面数据事件
        addAccount(){
          this.messageTitle='新增';
          this.messageDialog=true;
          this.formMessage={
            username:'',
            name:'',
            phone:'',
            roleId:''
          }
        },
        //数据保存事件
        messageHandle(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              if(this.messageTitle.indexOf('新增')!==-1){
                this.insertAxios(this.formMessage)
              }else{
                this.updateAxios(this.formMessage)
              }
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        //取消数据保存
        messageClose(){
          this.messageDialog=false;
        },
        hintHandle(){
          this.isEnableAxios({isEnable:!this.tableData.data[this.nowIndex].isEnable,id:this.tableData.data[this.nowIndex].id});
          this.searchData();
        },
        hintClose(){
          this.hintDialog=false;
        },
        //重置密码操作
        resetPWD(index){
          this.nowIndex=index;
          this.pwdDialog=true;
        },
        //重置密码
        pwdHandle(){
          this.resetPasswordAxios({id:this.tableData.data[this.nowIndex].id});
        },
        pwdClose(){
          this.pwdDialog=false;
        },
        //启动禁用账户使用
        rootBtn(index){
          if(this.tableData.data[index].isEnable){
            this.hintContent=`您确定开启${this.tableData.data[index].name}账户的使用么？`
          }else{
            this.hintContent=`您确定冻结${this.tableData.data[index].name}账户的使用么？`
          }
          this.nowIndex=index;
          this.hintDialog=true;
        },
        //分页操作
        changePage(e){
          this.pagination.pageNum=e;
          this.searchData()
        }
      }
    }
</script>

<style scoped lang="scss">
  .el-header,.el-main{
    background: #fff;
    margin-bottom: 10px;
  }
</style>
