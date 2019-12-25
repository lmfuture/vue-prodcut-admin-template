<template>
  <el-row>
    <el-row class="el-header">
      <el-form :model="outPoint" ref="outPoint" class="demo-ruleForm">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="保险公司" prop="insuranceId" label-width="80px">
              <el-select filterable no-match-text="暂无匹配数据" v-model="outPoint.insuranceId" placeholder="请选择保险公司">
                <el-option v-for="item in insuranceData" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="18" :gutter="20">
            <el-form-item label="分类" prop="firstClassId" label-width="80px">
              <el-select style="margin-right: 20px" filterable no-match-text="暂无匹配数据" @change="classifyOneChange" v-model="outPoint.firstClassId" placeholder="请选择一级分类">
                <el-option v-for="item in classifyOne" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <el-select v-show="outPoint.firstClassId && classifyTwo && classifyTwo.length>0" filterable no-match-text="暂无匹配数据" v-model="outPoint.secondClassId" placeholder="请选择二级分类">
                <el-option v-for="item in classifyTwo" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="7">
            <el-form-item label="产品名称" prop="name" label-width="80px">
              <el-input v-model="outPoint.name" placeholder="请输入产品名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-button icon='el-icon-search' type="primary" @click="searchData">查 询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <el-main>
      <el-table
        :data="resultData.outPointModes"
        show-header
        :header-cell-style="{background:'#F3F4F7',color:'#555'}"
        style="margin-bottom: 40px;">
        <el-table-column
          prop="addDate"
          label="创建时间"
          width="150"
          align="center">
          <template slot-scope="scope">
            {{scope.row.addDate | formatTime(scope.row.addDate)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="insuranceName"
          label="保险公司"
          align="center">
        </el-table-column>
        <el-table-column
          prop="firstClassName"
          label="一级分类"
          align="center">
        </el-table-column>
        <el-table-column
          prop="secondClassName"
          label="二级分类"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="产品名称"
          width="200"
          align="center">
        </el-table-column>
        <el-table-column
          prop="planName"
          label="计划名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="isOnline"
          label="产品状态"
          align="center">
          <template slot-scope="scope">
            {{isOnline(scope.row.isOnline)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="promotionFee"
          label="推广费"
          align="center">
        </el-table-column>
        <el-table-column
          prop="clause"
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button type="text"
            size="medium" @click="toPoint(scope.$index)">点位配置</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row style="text-align: center;">
        <el-pagination
          background
          @current-change="changePage"
          :current-page.sync="pagination.pageNum"
          layout="prev, pager, next"
          :total=resultData.total
          :page-size="pagination.pageSize"
        >
        </el-pagination>
      </el-row>
    </el-main>
  </el-row>
</template>
<script>
  import {getCompany,getFirstClass,getSecondClass} from '@/api/product'
  import {getOutPointListByCondition} from '@/api/outpoint'
  import { getCommonOption } from '@/utils/getCommonOption'
  export default {
    data(){
      return{
        outPoint:{
          name:'',
          firstClassId:'',
          secondClassId:'',
          insuranceId:''
        },
        insuranceData:[],
        classifyOne:[],
        classifyTwo:[],
        pagination:{
          pageNum:1,
          pageSize:8
        },
        resultData:[]
      }
    },
    created() {
      //获取所有保险公司
      getCommonOption(getCompany(),this.insuranceData,[{id:'',name:'全部'}]);
      //获取一级分类
      getCommonOption(getFirstClass(),this.classifyOne,[{name:'全部',id:''}]);
      this.getOutPointListByConditionAxios()
    },
    methods:{
      //获取页面数据
      getOutPointListByConditionAxios(query){
        getOutPointListByCondition(Object.assign({},query,this.outPoint,this.pagination)).then(res=>{
          if(res.code==='100100'){
            this.resultData=res.result
          }
        })
      },
      //模糊查询
      searchData(query){
        this.pagination.pageNum=1;
        this.getOutPointListByConditionAxios(this.outPoint)
      },
      //切换页数
      changePage(e){
        this.pagination.pageNum=e;
        this.getOutPointListByConditionAxios()
      },
      //修改一级分类
      classifyOneChange(value){
        this.classifyTwo=[];
        this.outPoint.secondClassId='';
        if(this.outPoint.firstClassId){
          getCommonOption(getSecondClass({firstClassId:value}),this.classifyTwo);
        }
      },
      toPoint(index){
        let item=this.resultData.outPointModes[index]
        if(item.type===1){
          this.$router.push({path:'short/'+item.planId,query:{title:item.name+''+item.planName,isLS:item.type}});
        }else{
          this.$router.push({path:'long/'+item.planId,query:{title:item.name+''+item.planName,isLS:item.type}});
        }
      },
      //判断表格状态
      isOnline(value){
        let content;
        switch (value) {
          case 0:
            content='下架';
            break;
          case 1:
            content='上线';
            break;
          case 2:
            content='预售';
            break;
          default:
            content='';
            break;
        }
        return content;
      }
    }
  }
</script>

<style scoped>
  .el-header{
    background: #ffffff;
    overflow: hidden;
    margin-bottom: 20px;
  }
  .el-main{
    background: #ffffff;
  }
</style>

