<template>
    <div class="wrap">
      <div class="el-header">
        <h2>修改密码</h2>
      </div>
      <div class="el-main">
        <el-form :model="formData" :rules="formDataRules" ref="formData" class="demo-ruleForm">
          <el-form-item label="原密码" prop="oldPassword" label-width="120px">
            <el-input type="password" v-model="formData.oldPassword" placeholder="请输入原密码"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword" label-width="120px">
            <el-input type="password" v-model="formData.newPassword" placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="newPasswordAgain" label-width="120px">
            <el-input type='password' v-model="formData.newPasswordAgain" placeholder="请再次输入新密码"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="messageHandle('formData')">确 定</el-button>
        </span>
      </div>
    </div>
</template>

<script>
    import {updatePassword} from '@/api/account'
    import {removeToken} from '@/utils/auth'
    export default {
      data(){
        let oldPwd=(rules,value,callback)=>{
          if (!value) {
            return callback(new Error('旧密码不能为空'));
          } else {
            if(value.length>5){
              callback();
            }else{
              return callback(new Error('密码最少为6位'));
            }
          }
        };
        let newPwd=(rules,value,callback)=>{
          if (!value) {
            return callback(new Error('新密码不能为空'));
          } else {
            if(value.length>5){
              callback();
            }else{
              return callback(new Error('密码最少为6位'));
            }
          }
        };
        let newPwdAgain=(rules,value,callback)=>{
          if (!value) {
            return callback(new Error('新密码不能为空'));
          } else {
            if(value===this.formData.newPassword){
              callback();
            }else{
              return callback(new Error('新密码输入不一样'));
            }
          }
        };
        return{
          formData:{
            newPassword:'',
            oldPassword:'',
            newPasswordAgain:''
          },
          formDataRules:{
            oldPassword: [
              { validator:oldPwd,trigger: 'blur' }
            ],
            newPasswordAgain: [
              { validator:newPwdAgain,trigger: 'blur' }
            ],
            newPassword: [
              { validator:newPwd,trigger: 'blur' }
            ]
          }
        }
      },
      methods:{
        messageHandle(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.updatePasswordAxios(this.formData)
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        updatePasswordAxios(query){
          updatePassword(query).then(res=> {
            if(res.code==='100100'){
              this.$message.success('修改密码成功');
              let that=this;
              setTimeout(function(){
                removeToken();
                that.$router.push({path:'/login'})
              },3000)
            }else{
              this.$message.error(res.msg)
            }
          })
        }
      }
    }
</script>

<style scoped lang="scss">
  .el-header{
    width: 100%;
    margin-bottom: 20px;
    background: #ffffff;
    overflow: hidden;
    h2{
      font-size: 30px;
      line-height: 40px;
    }
  }
  .el-main {
    background: #fff;
    height: 100%;
    form {
      margin: 50px auto;
      width: 400px;
    }
    .dialog-footer{
      button{
        margin: 0 auto;
        display: block;
        width: 200px;
      }
    }
  }
</style>
