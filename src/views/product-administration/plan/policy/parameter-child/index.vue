<template>
  <el-row>
    <el-row class='el-header'>
      <h3>保单项参数配置</h3>
      <el-button type="primary" @click="addBtn">新增</el-button>
    </el-row>
    <el-main>
      <el-table
        :data="tableData.data"
        show-header
        :header-cell-style="{background:'#F3F4F7',color:'#555'}"
        style="margin-bottom: 40px;">
        <el-table-column
          prop="name"
          label="分类名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="paramKey"
          label="参数名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="controlType"
          label="控制类型"
          align="center">
          <template slot-scope="scope">
            {{isControlType(scope.row.controlType)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="hintMsg"
          label="提示语"
          align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.hintMsg">
              {{scope.row.hintMsg}}
            </div>
            <div v-else>
              {{dictionaryList(scope.row.dictionaryList)}}
            </div>
          </template>
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
          </template>
        </el-table-column>
      </el-table>
      <el-row style="text-align: center;">
        <el-pagination
          background
          @current-change="changePage"
          :current-page.sync="pagination.pageNum"
          layout="prev, pager, next"
          :total='tableData.total'
          :page-size="pagination.pageSize"
        >
        </el-pagination>
      </el-row>
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
        <el-form-item label="分类名称" prop="name" label-width="180px">
          {{messageFrom.name}}
        </el-form-item>
        <el-form-item label="参数名称" prop="paramKey" label-width="180px">
          <el-select @change="selectChange" style="width: 220px" v-model="messageFrom.paramKey">
            <el-option v-for="item in groupData" :key="item.value" :label="item.name" :value="item.paramKey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="控制类型" prop="controlType" label-width="180px" v-show="!isSelect">
          {{isControlType(messageFrom.controlType)}}
        </el-form-item>
        <el-form-item label="提示语" prop="hintMsg" label-width="180px" v-show="!isPull && !isSelect">
          {{messageFrom.hintMsg}}
        </el-form-item>
        <el-form-item label="属性值" prop="dictionaryList" label-width="180px" v-show="isPull && !isSelect">
          {{messageFrom.dictionaryList?(dictionaryList(messageFrom.dictionaryList)?dictionaryList(messageFrom.dictionaryList):'暂无属性'):'暂无属性'}}
        </el-form-item>
        <el-form-item label="排序" prop="sort" label-width="180px">
          <el-input style="width: 220px" v-model="messageFrom.sort" placeholder="请输入排序（默认为1）"></el-input>
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
  import {getPlanDictOptionList,getOptionSelect,deletePlanDictOption,addPlanDictOption,updatePlanDictOption} from '@/api/product'
  export default {
    data(){
      return{
        tableData:[],
        planId:280,
        delDialog:false,
        nowIndex:0,
        messageTitle:'',
        messageDialog:false,
        messageFrom:{
          name:'',
          paramKey:'',
          controlType:'',
          hintMsg:'',
          sort:''
        },
        messageFromRules:{
          paramKey: [
            { required: true, message: '请选择参数名称', trigger: 'blur' }
          ]
        },
        groupData:[],
        pagination:{
          pageNum:1,
          pageSize:8
        },
        controlData:[{
          name:'文本输入框',
          value:0
        },{
          name:'下拉框',
          value:1
        },{
          name:'日期选择器',
          value:2
        },{
          name:'地区选择器',
          value:3
        },{
          name:'职业选择器',
          value:4
        },{
          name:'证件有效期专用控制器',
          value:4
        }],
        queryData:{},
        groupTypeData:[{
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
        }]
      }
    },
    computed:{
      isPull(){
        return this.messageFrom.controlType===1?true:false
      },
      isSelect(){
        return this.messageFrom.paramKey===''?true:false
      }
    },
    created(){
      this.queryData=this.$route.query;
      this.getPlanDictOptionListAxios();
      this.getOptionSelectAxios();
    },
    methods:{
      //获取所有页面数据
      getPlanDictOptionListAxios(){
        getPlanDictOptionList(Object.assign({id:this.$route.params.id},this.pagination)).then(res=>{
          if(res.code==='100100'){
            if(res.result.data.length===0 && this.pagination.pageNum!==1){
              this.pagination.pageNum=1;
              this.getOptionSelectAxios()
            }
            this.tableData=res.result;
            this.messageClose();
            this.delClose();
          }
        })
      },
      //获取下拉框参数
      getOptionSelectAxios(){
        getOptionSelect({groupId:this.$route.params.id}).then(res=>{
          if(res.code==='100100'){
            this.groupData=res.result;
          }
        })
      },
      //添加数据接口
      addPlanDictOptionAxios(query){
        addPlanDictOption(query).then(res=>{
          if(res.code==='100100'){
            this.$message.success(res.msg);
            this.getPlanDictOptionListAxios();
          }else{
            this.$message.error(res.msg);
          }
        })
      },
      //修改数据接口
      updatePlanDictOptionAxios(query){
        updatePlanDictOption(query).then(res=>{
          if(res.code==='100100'){
            this.$message.success(res.msg);
            this.getPlanDictOptionListAxios();
          }else{
            this.$message.error(res.msg);
          }
        })
      },
      //删除数据接口
      deletePlanDictOptionAxios(query){
        deletePlanDictOption(query).then(res=>{
          if(res.code==='100100'){
            this.$message.success(res.msg);
            this.getPlanDictOptionListAxios()
          }else{
            this.$message.error(res.msg);
          }
        })
      },
      //切换页码
      changePage(e){
        this.pagination.pageNum=e;
        this.getPlanDictOptionListAxios(this.pagination)
      },
      //添加数据事件操作
      addBtn(){
        this.messageDialog=true;
        this.messageTitle='新增';
        this.messageFrom={
          name:'',
          paramKey:'',
          controlType:'',
          hintMsg:'',
          sort:'',
          groupId:this.$route.params.id,
          planId:this.queryData.planId
        };
        this.groupTypeData.map(item=>{
          if(item.value===Number(this.queryData.groupType)){
            this.messageFrom.name=item.name
          }
        })
      },
      //修改数据事件操作
      editItem(index){
        this.messageDialog=true;
        this.messageTitle='编辑';
        this.messageFrom=JSON.parse(JSON.stringify(this.tableData.data[index]));
      },
      //下拉框事件修改dialog内的值
      selectChange(value){
        this.groupData.map((item,index)=>{
          if(item.paramKey===value){
            this.messageFrom.controlType=this.groupData[index].controlType;
            this.messageFrom.hintMsg=this.groupData[index].hintMsg;
            this.messageFrom.dictionaryList=this.groupData[index].defaultDictionarList?this.groupData[index].defaultDictionarList:'';
          }
        })
      },
      //删除事件操作
      delHandle(){
        console.log(this.tableData.data[this.nowIndex].id)
        this.deletePlanDictOptionAxios({id:this.tableData.data[this.nowIndex].id})
      },
      //关闭遮罩
      delClose(){
        this.delDialog=false;
      },
      //获取删除的第几项
      delItem(index){
        this.delDialog=true;
        this.nowIndex=index;
      },
      //新增或修改页面数据保存
      messageHandle(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.messageFrom.planId=this.planId;
            this.messageFrom.sort=this.messageFrom.sort?this.messageFrom.sort:'1';
            if(this.messageTitle.indexOf('新增')!=-1){
              this.addPlanDictOptionAxios(this.messageFrom)
            }else{
              this.updatePlanDictOptionAxios(this.messageFrom)
            }
          } else {
            return false;
          }
        })
      },
      //关闭遮罩并重置信息
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
      //表格数据处理
      isControlType(value){
        let content;
        this.controlData.map(item=>{
          if(item.value===value){
            content=item.name;
          }
        });
        return content;
      },
      dictionaryList(value){
        let arr=[];
        JSON.parse(value).map(item=>{
          arr.push(item.show);
        });
        return arr.join('/');
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
