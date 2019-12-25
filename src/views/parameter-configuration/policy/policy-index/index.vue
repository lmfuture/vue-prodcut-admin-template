<template>
  <el-row class="app-container">
    <el-main>
      <el-table
        :data="tableData"
        show-header
        :header-cell-style="{background:'#F3F4F7',color:'#555'}"
        style="margin-bottom: 40px;">
        <el-table-column
          prop="name"
          label="投保项名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop=""
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="toChildren(scope.$index)"
              type="text"
              size="medium">
              子项管理
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-row>
</template>

<script>
  export default {
    data(){
      return{
        tableData:[{
          name:'基础信息',
          id:1
        },{
          name:'投保人信息',
          id:2
        },{
          name:'被保人信息',
          id:3
        },{
          name:'受益人信息',
          id:4
        },{
          name:'车辆信息',
          id:5
        },{
          name:'房屋信息',
          id:6
        },{
          name:'企业信息',
          id:7
        },{
          name:'其他信息',
          id:8
        }]
      }
    },
    created(){
    },
    methods:{
      toChildren(index){
        this.$router.push({'path':'item/'+this.tableData[index].id})
      }
    }
  }
</script>

<style scoped lang="scss">
  .el-icon-content{
    padding-top: 6px;
    padding-left: 25px;
    font-size: 25px;
    color: #409EFF;
    i{
      cursor: pointer;
    }
  }
  .el-icon-plus{
    margin-right: 20px;
  }
</style>
