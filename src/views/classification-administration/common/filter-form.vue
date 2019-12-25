<template>
  <div>
    <el-header>
      <el-form :model="classify" ref="classify" class="demo-ruleForm">
        <el-col :span="5">
        <el-form-item label="分类名称" label-width="80px" prop="name">
          <el-input v-model="classify.name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="11">
        <el-form-item style='padding-left: 20px;'>
            <el-button type="primary" @click="submitForm('classify')" icon='el-icon-search'>查 询</el-button>
            <el-button type='success' icon='el-icon-plus' @click="addClassify">新 增</el-button>
        </el-form-item>
        </el-col>
      </el-form>
    </el-header>
  </div>
</template>

<script>
    export default {
      name: "filter-form",
      props:{
        classify:{
          type:Object,
          default:false
        }
      },
      data(){
        return{

        }
      },
      created(){
        this.$emit('filterData',this.classify);
      },
      methods:{
        addClassify(){
          this.$emit('openDialog')
        },
        submitForm(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.$emit('filterData',this.classify);
            } else {
              return false;
            }
          });
        }
      }
    }
</script>

<style>
.el-header,.el-main{
  background: #fff;
}
.el-header{
  margin-bottom: 20px;
}
</style>
