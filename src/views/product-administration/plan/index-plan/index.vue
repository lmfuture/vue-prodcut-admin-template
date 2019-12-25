<template>
	<div>
		<div class="demo-input-suffix">
      <h2 style="margin-bottom: 30px">产品名称：{{this.tableData.productName}}</h2>
      <el-form :model="planForm" class="demo-ruleForm">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="计划名称" prop="planName" label-width="120px">
              <el-input v-model.trim="planForm.planName" placeholder="请输入计划名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产品状态" prop="isOnline" label-width="120px">
              <el-select v-model="planForm.isOnline">
                <el-option v-for="item in onlineStatus" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-button icon='el-icon-search' @click="searchPlan()" type="primary">查 询</el-button>
            <el-button icon='el-icon-plus' @click="addPlan" type='success'>新 增</el-button>
          </el-col>
        </el-row>
      </el-form>
		</div>
		<el-table
			:header-cell-style="{background:'#F3F4F7',color:'#555'}"
      :data="tableData.productPlanList"
      style="width: 100%;margin-bottom: 40px;"
    >
		    <el-table-column
		      prop="id"
		      label="序号"
          align="center"
		      >
		    </el-table-column>
		    <el-table-column
		      prop="planName"
		      label="计划名称"
          align="center"
		      >
		    </el-table-column>
		    <el-table-column
		      prop="priceStart"
		      label="起始价格(元)"
          align="center"
        >
		    </el-table-column>
		    <el-table-column
		      prop="isOnline"
		      label="产品状态"
          align="center"
		    >
          <template slot-scope="scope">
            {{isOnlineFunction(scope.row.isOnline)}}
            <br/>
            {{scope.row.isOnline===2?timeScope(scope.row.startTime,scope.row.endTime):''}}
          </template>
		    </el-table-column>
		    <el-table-column
		      label="操作"
          align="center"
		      width="350">
		      <template slot-scope="scope">
		        <el-button
		          @click.native.prevent="editRow(scope.$index)"
		          type="text"
		          size="medium">
		          编辑
		        </el-button>
		        <el-button
		          @click.native.prevent="offlineBtn(scope.$index)"
		          type="text"
		          size="medium">
                {{scope.row.isOnline!==1?'上线':'下线'}}
		        </el-button>
		        <el-button
		          @click.native.prevent="openBook(scope.$index)"
		          type="text"
		          :disabled='scope.row.isOnline===1?true:false'
		          size="medium">
		          {{scope.row.isOnline===2?'取消预售':'预售'}}
		        </el-button>
		        <el-button
		          @click.native.prevent="openPanel(scope.$index)"
		          type="text"
		          size="medium">
		          试算面板
		        </el-button>
		        <el-button
		          @click.native.prevent="openPolicy(scope.$index)"
		          type="text"
		          size="medium">
		          保单参数
		        </el-button>
		      </template>
		    </el-table-column>
		</el-table>
		<el-dialog
      width="32%"
      title="预售"
      :visible.sync="dialogFormVisible"
      center>
		  <el-form :model="yushouform" :rules="yushouformRules" ref="yushouform" >
		    <el-form-item label="开始时间" prop="startTime" label-width="120px">
		    		<el-date-picker
				      v-model="yushouform.startTime"
				      type="date"
				      placeholder="选择日期">
				    </el-date-picker>
		    </el-form-item>

		    <el-form-item label="结束时间" prop="endTime" label-width="120px">
		    		<el-date-picker
				      v-model="yushouform.endTime"
				      type="date"
				      placeholder="选择日期">
				    </el-date-picker>
		    </el-form-item>

		    <el-form-item label="上线方式:" prop="onlineType" label-width="120px">
				    <el-radio-group v-model="yushouform.onlineType">
				      <el-radio :label=1>自动上线</el-radio>
				      <el-radio :label=2>手动上线</el-radio>
				    </el-radio-group>
			</el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button type="primary" @click="yushouHandle('yushouform')">确 定</el-button>
		    <el-button @click="dialogFormVisible = false">取 消</el-button>
		  </div>
		</el-dialog>
		
	</div>
</template>

<script>
  import {getProductPlanByConditions,updateProductPlanStatus} from '@/api/product'
  import moment from 'moment'
	export default {
		data(){
			return {
        planForm:{
          planName:'',
          isOnline:''
        },
        onlineStatus:[{
          name:'全部',
          value:''
        },{
          name:'下架',
          value:0
        },{
          name:'上架',
          value:1
        },{
          name:'预售',
          value:2
        }],
        pagination:{
          pageNum:1,
          pageSize:8
        },
        tableData:{},
        nowIndex:0,
        dialogFormVisible:false,
        yushouform:{
          onlineType:'',
          startTime:'',
          endTime:''
        },
        yushouformRules:{
          startTime: [
            { required: true, message: '请选择开始时间', trigger: 'blur' }
          ],
          endTime: [
            { required: true, message: '请选择结束时间',  trigger: 'blur' }
          ],
          onlineType:[
            { required: true, message: '请选择上线方式',  trigger: 'blur' }
          ]
        }
			}
		},
    created(){
		  this.getProductPlanByConditionsAxios()
    },
    watch:{
      dialogFormVisible: function (val,oldVla) {
        if (this.$refs['yushouform'] != undefined) {
          this.$refs["yushouform"].resetFields();
        }
      }
    },
		methods:{
      getProductPlanByConditionsAxios(query){
        getProductPlanByConditions(Object.assign({productId:this.$route.params.id},this.pagination,this.planForm,query)).then(res=>{
          if(res.code==='100100'){
            this.tableData=res.result
          }
        })
      },
      updateProductPlanStatus(query){
        updateProductPlanStatus(query).then(res=>{
          if(res.code==='100100'){
            this.$message.success(res.msg);
            this.getProductPlanByConditionsAxios();
            this.dialogFormVisible=false;
          }else{
            this.$message.error(res.msg)
          }
        })

      },
      offlineBtn(index){
        if(this.tableData.productPlanList[index].isOnline!==1){
          this.updateProductPlanStatus({isOnline:1,id:this.tableData.productPlanList[index].id})
        }else{
          this.updateProductPlanStatus({isOnline:0,id:this.tableData.productPlanList[index].id})
        }
      },
      yushouHandle(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.updateProductPlanStatus(Object.assign({isOnline:2,id:this.tableData.productPlanList[this.nowIndex].id,startTime:moment(this.yushouform.startTime).format('YYYY-MM-DD'),endTime:moment(this.yushouform.endTime).format('YYYY-MM-DD'),onlineType:this.yushouform.onlineType}))
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      openBook(index){
        this.nowIndex=index;
        if(this.tableData.productPlanList[this.nowIndex].isOnline===2){
          this.updateProductPlanStatus({isOnline:0,id:this.tableData.productPlanList[this.nowIndex].id});
          return false;
        }
        this.yushouform=this.tableData.productPlanList[this.nowIndex];
        console.log(this.yushouform)
        this.dialogFormVisible=true;
      },
      searchPlan(){
        this.pagination.pageNum=1;
        this.getProductPlanByConditionsAxios(this.pagination)
      },
      editRow(index){
        this.$router.push({path:'/product-administration/index-product/add-plan',query:{id:this.$route.params.id,planId:this.tableData.productPlanList[index].id}})
      },
      addPlan(){
        this.$router.push({path:'/product-administration/index-product/add-plan',query:{id:this.$route.params.id}})
      },
      openPolicy(index){
        this.$router.push({path:'/product-administration/index-product/policy',query:{id:this.tableData.productPlanList[index].id}})
      },
      openPanel(index){
        this.$router.push({path:'/product-administration/index-product/trial-panel/'+this.tableData.productPlanList[index].id})
      },
      isOnlineFunction(value){
        let content='';
        switch (value) {
          case 0:
            content = '未上线';
            break;
          case 1:
            content = '已上线';
            break;
          case 2:
            content = '预售中';
            break;
          default:
            content = '未上线';
            break;
        }
        return content;
      },
      timeScope(start,end){
        return '('+moment(start).format('YYYY-MM-DD')+'~'+moment(end).format('YYYY-MM-DD')+')'
      }
		}
	}
</script>

<style scoped>
</style>
