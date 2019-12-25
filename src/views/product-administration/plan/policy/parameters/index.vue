<template>
  <el-row>
    <el-row class='el-header'>
      <h3>保单参数</h3>
      <el-button type="primary" @click="addBtn">新增</el-button>
    </el-row>
    <el-main>
        <el-table
          :data="tableData"
          show-header
          :header-cell-style="{background:'#F3F4F7',color:'#555'}"
          style="margin-bottom: 40px;">
          <el-table-column
            prop="groupTypeStr"
            label="分类名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="min"
            label="最小值"
            align="center">
          </el-table-column>
          <el-table-column
            prop="max"
            label="最大值"
            align="center">
          </el-table-column>
          <el-table-column
            prop="sort"
            label="排序"
            align="center">
          </el-table-column>
          <el-table-column
            prop=""
            label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="delItem(scope.$index)"
                type="text"
                size="medium">
                删除
              </el-button>
              <el-button
                @click.native.prevent="editItem(scope.$index)"
                type="text"
                size="medium">
                编辑
              </el-button>
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
    <el-dialog
      title="提示"
      :visible.sync="delDialog"
      center
      width="40%"
    >
      <h3 style="text-align: center">您确定要删除该内容吗？</h3>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="delHandle">确 定</el-button>
        <el-button @click="delClose">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="messageTitle"
      :visible.sync="messageDialog"
      width="40%"
      center
    >
      <el-form :model="messageFrom" :rules="messageFromRules" ref="messageFrom" class="demo-ruleForm">
        <el-form-item label="分类名称" prop="groupType" label-width="180px">
          <el-select style="width: 220px" v-model="messageFrom.groupType">
            <el-option v-for="item in groupData" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最小数量" prop="min" label-width="180px">
          <el-input style="width: 220px" v-model="messageFrom.min" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="最大数量" prop="max" label-width="180px">
          <el-input style="width: 220px" v-model="messageFrom.max" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort" label-width="180px">
          <el-input style="width: 220px" v-model="messageFrom.sort" placeholder="请输入分类名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="messageHandle('messageFrom')">确 定</el-button>
        <el-button @click="messageClose('messageFrom')">取 消</el-button>
      </span>
    </el-dialog>
  </el-row>

</template>

<script>
  import {getPlanDictGroupList,deletePlanDictGroup,addPlanDictGroup,updatePlanDictGroup} from '@/api/product'
  export default {
    name: "index",
    data(){
      return{
        tableData:[],
        delDialog:false,
        nowIndex:0,
        messageTitle:'',
        messageDialog:false,
        messageFrom:{
          groupType:'',
          max:'',
          min:'',
          planId:'',
          sort:''
        },
        messageFromRules:{
          groupType: [
            { required: true, message: '请选择分类名称', trigger: 'blur' }
          ],
          max: [
            { required: true, message: '请输入最小数量', trigger: 'blur' }
          ],
          min: [
            { required: true, message: '请输入最大数量', trigger: 'blur' }
          ],
          sort: [
            { required: true, message: '请输入排序值', trigger: 'blur' }
          ],
        },
        groupData:[{
          name:'基础信息',
          value:1
        },{
          name:'投保人信息',
          value:2
        },{
          name:'被保人信息',
          value:3
        },{
          name:'受益人信息',
          value:4
        },{
          name:'车辆信息',
          value:5
        },{
          name:'房屋信息',
          value:6
        },{
          name:'企业信息',
          value:7
        },{
          name:'其他信息',
          value:8
        }],
        planId:''
      }
    },
    created(){
      if(this.$route.query.id){
        this.planId=this.$route.query.id;
        this.getPlanDictGroupListAxios();
      }else{
        window.history.back(-1)
      }
    },
    methods:{
      //获取页面数据
      getPlanDictGroupListAxios(){
        getPlanDictGroupList({planId:this.planId}).then(res=>{
          if(res.code==='100100'){
            this.tableData=res.result;
          }
        })
      },
      //添加页面数据接口
      addPlanDictGroupAxios(query){
        addPlanDictGroup(query).then(res=>{
          if(res.code==='100100'){
            this.$message.success(res.msg);
            this.getPlanDictGroupListAxios();
            this.messageClose();
          }else{
            this.$message.error(res.msg);
          }
        })
      },
      //修改页面数据接口
      updatePlanDictGroupAxios(query){
        updatePlanDictGroup(query).then(res=>{
          if(res.code==='100100'){
            this.$message.success(res.msg);
            this.getPlanDictGroupListAxios();
            this.messageClose();
          }else{
            this.$message.error(res.msg);
          }
        })
      },
      //删除页面数据接口
      deletePlanDictGroupAxios(query){
        deletePlanDictGroup(query).then(res=>{
          if(res.code==='100100'){
            this.$message.success(res.msg);
            this.delClose();
            this.getPlanDictGroupListAxios()
          }else{
            this.$message.error(res.msg);
          }
        })
      },
      //新增数据操作
      addBtn(){
        this.messageDialog=true;
        this.messageTitle='新增';
      },
      //修改页面数据操作
      editItem(index){
        this.messageDialog=true;
        this.messageTitle='编辑';
        this.messageFrom=JSON.parse(JSON.stringify(this.tableData[index]));
      },
      //删除页面操作
      delHandle(){
        this.deletePlanDictGroupAxios({id:this.tableData[this.nowIndex].id})
      },
      delClose(){
        this.delDialog=false;
      },
      //获取删除第几项
      delItem(index){
        this.delDialog=true;
        this.nowIndex=index;
      },
      //保存页面数据
      messageHandle(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.messageFrom.planId=this.$route.query.id;
            if(this.messageTitle.indexOf('新增')!=-1){
              this.addPlanDictGroupAxios(this.messageFrom)
            }else{
              this.updatePlanDictGroupAxios(this.messageFrom)
            }
          } else {
            return false;
          }
        })
      },
      //重置message数据
      messageClose(){
        this.messageDialog=false;
        this.messageFrom={
          groupType:'',
          max:'',
          min:'',
          planId:'',
          sort:''
        }
      },
      // 跳转到子项页面
      toChildren(index){
        this.$router.push({path:'/product-administration/index-product/policy-children/'+this.tableData[index].id,query:{planId:this.tableData[index].planId,groupType:this.tableData[index].groupType}})
      }
    }
  }
</script>

<style scoped lang="scss">
.el-header{
  h3{
    position: relative;
    line-height: 40px;
    height: 60px;
    padding: 10px 0;
    &:after{
      position: absolute;
      bottom: 0;
      left: 0;
      height: 2px;
      width: 100%;
      background: #eee;
      content: '';
    }
  }
}
</style>
