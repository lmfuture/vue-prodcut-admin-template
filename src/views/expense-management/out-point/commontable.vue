<template>
  <el-row>
    <el-row v-if="!isEditStatus" style="margin-bottom: 20px">
      <el-button type="primary" @click="editDataBtn">编辑数据</el-button>
    </el-row>
    <el-row style="margin-bottom: 20px" v-else>
      <el-button type="primary" @click="saveData">保存</el-button>
      <el-button type="primary" @click="closeData">取消</el-button>
    </el-row>
    <el-row class="tableTitle">
      {{istableLable}}
    </el-row>
    <el-table
      :data="!isEditStatus?tableData:editData"
      show-header
      :header-cell-style="{background:'#F3F4F7',color:'#555'}"
      style="margin-bottom: 40px;"
      max-height="500"
    >
      <el-table-column
        width="200px"
        fixed
        prop="insureYears"
        label="影响因素"
        align="center">
        <template slot-scope="scope">
          {{scope.row.insureYears.show+'&'+scope.row.insurantYears.show}}
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item,index) in yearAll"
        prop="pointarr"
        :label=item.name
        align="center"
      >
        <template slot-scope="scope">
          <div v-if="!isEditStatus">
            {{scope.row.pointarr[index].point}}
          </div>
          <div v-else>
            <el-input @blur="blurHandle($event.target.value,scope.$index,index)" oninput = "value=value.replace(/[^\d.]/g,'')" v-model="scope.row.pointarr[index].point"></el-input>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-row>
</template>

<script>
  import {setOutPoint,deleteOutPointById} from '@/api/outpoint'
    export default {
        props:{
          datalist:{
            type:Array,
            default:[]
          },
          currentTab:{
            type:String,
            default:'1'
          },
          planId:{
            type:String
          },
          getData:{
            type:Function
          },
          isLS:{
            type:Number
          }
        },
      data(){
          return {
            isEditStatus:false,
            editData:[],
            tableTitleData:[],
            tableData:[],
            yearAll:[{
              name:'首年'
            },{
              name:'第二年'
            },{
              name:'第三年'
            },{
              name:'第四年'
            },{
              name:'第五年'
            },{
              name:'第六年'
            },{
              name:'第七年'
            },{
              name:'第八年'
            },{
              name:'第九年'
            },{
              name:'第十年'
            },{
              name:'第十一年'
            },{
              name:'第十二年'
            },{
              name:'第十三年'
            },{
              name:'第十四年'
            },{
              name:'第十五年'
            },{
              name:'第十六年'
            },{
              name:'第十七年'
            },{
              name:'第十八年'
            },{
              name:'第十九年'
            },{
              name:'第二十年'
            }]
          }
      },
      created(){
        if(Number(this.isLS)===1){
          this.yearAll=[{
            name:'首年'
          }]
        }
      },
      computed:{
        istableLable(){
          return this.currentTab==='2'?'附加险推广费':'主险推广费';
        }
      },
      methods:{
        //  保存数据
        setOutPointAxios(query){
          setOutPoint(query).then(res=>{
            if(res.code==='100100'){
              this.getData();
              this.closeData();
            }
          })
        },
        //删除数据
        deleteOutPointByIdAxios(query){
          deleteOutPointById(query).then(res=>{
            if(res.code==='100100'){
              this.getData();
            }
          })
        },
        //失去焦点对数据进行删除
        blurHandle(value,index,i){
          if(value){
            return true;
          }else{
            if(this.tableData[index].pointarr[i].id){
              this.deleteOutPointByIdAxios({id:this.tableData[index].pointarr[i].id})
            }
          }
        },
        //从父组件取值
        fuzhi(value){
          this.editData=JSON.parse(JSON.stringify(value));
          this.editData.map(item=>{
            item.pointarr.map((v,i)=>{
              if(v.point==='--'){
                item.pointarr[i].point='';
              }
            })
          });
          this.tableData=value;
        },
        //修改值操作
        editDataBtn(){
          if(this.tableData.length===0){
            this.$message.error('【缴费期限】投保项未配置');
            return false;
          }
          this.isEditStatus=true;
          this.editData=JSON.parse(JSON.stringify(this.tableData));
          this.editData.map(item=>{
            item.pointarr.map((v,i)=>{
              if(v.point==='--'){
                item.pointarr[i].point='';
              }
            })
          });
        },
        //保存已有数据操作进行保存
        saveData(){
          let newData=[];
          this.editData.map(item=>{
            item.pointarr.map((v,i)=>{
              if(v.point===''){
                item.pointarr[i].point='--';
              }else{
                item.pointarr[i].point=Number(item.pointarr[i].point);
                item.description=(item.type===2?'附加险':'主险')+'&'+item.insureYears.show+'&'+item.insurantYears.show+'&第'+(i+1)+'年返点'+item.pointarr[i].point;
                item.indexYear=i+1;
                item.insurantYearsLimit=item.insurantYears.value;
                item.payType=item.insureYears.value;
                item.id=item.pointarr[i].id;
                item.planId=this.planId;
                item.createDate=item.pointarr[i].createDate?item.pointarr[i].createDate:Date.parse(new Date())
                item.point=item.pointarr[i].point;
                item.type=Number(this.currentTab);
                newData.push(JSON.parse(JSON.stringify(item)));
              }
            });
          });
          this.setOutPointAxios(newData)
        },
        //取消编辑
        closeData(){
          this.isEditStatus=false;
        }
      }
    }
</script>

<style scoped lang="scss">
.tableTitle{
  height: 48px;
  line-height: 48px;
  background: #F3F4F7;
  color: rgb(85, 85, 85);
  text-align: center;
  font-weight: bold;
  position: relative;
  &:after{
    width: 100%;
    height: 2px;
    content: ' ';
    background: #eee;
    position: absolute;
    bottom: 0;
    left: 0;
  }
}
</style>
