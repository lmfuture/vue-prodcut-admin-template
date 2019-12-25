<template>
  <el-row>
    <el-row class="el-header">
      <h2>{{title}}</h2>
    </el-row>
    <el-main>
      <Commontable ref="mycommontable" :isLS="isLS" :planId="planId" :currentTab="currentTab" :datalist="datalist" :getData="getData"></Commontable>
    </el-main>
  </el-row>
</template>

<script>
  import Commontable from './../commontable'
  import {getOutPointByPlanIdAndType} from '@/api/outpoint'
  export default {
    components:{
      Commontable
    },
    data(){
      return {
        datalist:[],
        currentTab:'1'
      }
    },
    created() {
      this.title=this.$route.query.title;
      this.isLS=Number(this.$route.query.isLS);
      this.planId=this.$route.params.id;
      this.getOutPointByPlanIdAndTypeAxios();
    },
    methods:{
      //获取当前点位数据
      getOutPointByPlanIdAndTypeAxios(){
        getOutPointByPlanIdAndType({planId:this.$route.params.id,type:this.currentTab}).then(res=>{
          if(res.code==='100100'){
            this.datalist=this.filterdata(res.result.productOutPoints);
            this.resultData=res.result;
            let arr=[];
            JSON.parse(this.resultData.insureYears).map(item=>{
              JSON.parse(this.resultData.insurantYears).map(v=>{
                arr.push({insureYears:item,insurantYears:v,pointarr:new Array(20).fill({id:'',point:'--',createDate:''})})
              })
            });
            arr.forEach((item,index)=>{
              this.datalist.forEach((v,i)=>{
                if(item.insureYears.value===v.payType && item.insurantYears.value===v.insurantYearsLimit){
                  arr[index].pointarr=this.datalist[i].pointarr;
                }
              });
            });
            this.$refs.mycommontable.fuzhi(arr)
          }else{
            this.$message.error(res.msg);
          }
        })
      },
      getData(){
        this.getOutPointByPlanIdAndTypeAxios()
      },
      //tab当前切换
      tabChange(){
        this.getOutPointByPlanIdAndTypeAxios()
      },
      //过滤数据
      filterdata(arr){
        const data=this.dataBy(arr,function(item){
          return [item.insurantYearsLimit,item.payType]
        });
        let newData=[];
        let obj={};
        data.map(item=>{
          obj={
            pointarr:new Array(20).fill({id:'',point:'--',createDate:''}),
            insurantYearsLimit:'',
            payType:'',
            additionalName:this.currentTab==='2'?'附加险名称':'',
            description:'',
            id:'',
            indexYear:'',
            planId:'',
            point:'',
            type:Number(this.currentTab)
          };
          item && item.map(v=>{
            obj.pointarr[v.indexYear-1]={id:v.id,point:v.point,createDate:v.createDate};
            obj.planId=this.$route.params.id;
            obj.insurantYearsLimit=v.insurantYearsLimit;
            obj.payType=v.payType;
          });
          newData.push(JSON.parse(JSON.stringify(obj)))
        });
        newData.sort(function(a,b){
          return a.payType - b.payType;
        });
        newData.sort(function(a,b){
          return a.insurantYearsLimit - b.insurantYearsLimit;
        });
        return newData;
      },
      dataBy(array,call){
        const dataGroup={};
        array.map(item=>{
          const dataitem=JSON.stringify(call(item));
          dataGroup[dataitem]=dataGroup[dataitem] || [];
          dataGroup[dataitem].push(item)
        });
        return Object.keys(dataGroup).map(function(item){
          return dataGroup[item]
        })
      }
    }
  }


</script>

<style scoped lang="scss">
  .el-header{
    background: #fff;
    margin-bottom: 20px;
    overflow: hidden;
    &>h2{
      height: 60px;
      line-height: 60px;
    }
  }
  .el-main{
    background: #ffffff;
  }
</style>
