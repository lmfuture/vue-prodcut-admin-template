<template>
  <el-row class="app-container">
    <el-header>
      <el-form :model="searchItem" ref="searchItem" class="demo-ruleForm">
        <el-form-item label="参数名称" prop="name">
          <el-row :gutter="20">
            <el-col :span="5">
              <el-input placeholder="请输入参数名称" v-model="searchItem.name"></el-input>
            </el-col>
            <el-col :span="11">
              <el-button icon='el-icon-search' type="primary" @click="searchData">查 询</el-button>
              <el-button icon='el-icon-plus' type='success' @click="addInsurance">新 增</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-table
        :data="tableData.data"
        show-header
        :header-cell-style="{background:'#F3F4F7',color:'#555'}"
        style="margin-bottom: 40px;">
        <el-table-column
          prop="createDate"
          label="添加时间"
          align="center">
          <template slot-scope="scope">
            {{scope.row.createDate | formatTime(scope.row.createDate)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="参数名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="controlType"
          label="控制类型"
          align="center">
          <template slot-scope="scope">
            {{controlType(scope.row.controlType)}}
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
              {{dictionaryList(scope.row.defaultDictionarList)}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="editRow(scope.$index)"
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
          :page-sizes="[10, 20, 30]"
          :total='tableData.total'
          :page-size="pagination.pageSize"
        >
        </el-pagination>
      </el-row>
    </el-main>
    <el-dialog
      :title="itemMessageTitle"
      :visible.sync="itemMessageDialog"
      center
      @close="closeDialog('itemMessage')"
    >
      <el-form :model="itemMessage" :rules="itemMessageRules" ref="itemMessage" class="demo-ruleForm">
        <el-form-item label="参数名称" prop="name" label-width="120px">
          <el-input v-model="itemMessage.name" placeholder="请输入参数名称"></el-input>
        </el-form-item>
        <el-form-item label="参数Key" prop="paramKey" label-width="120px">
          <el-input v-model="itemMessage.paramKey" placeholder="请输入参数Key"></el-input>
        </el-form-item>
        <el-form-item label="控制类型" prop="controlType" label-width="120px">
          <el-select v-model="itemMessage.controlType" placeholder="请选择">
            <el-option v-for="item in controlData" :key="item.name" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提示语" prop="hintMsg" label-width="120px" v-show="!isPull">
          <el-input v-model="itemMessage.hintMsg" placeholder="请输入提示语"></el-input>
        </el-form-item>
        <el-form-item label="属性值" prop="defaultDictionarList" label-width="120px" v-show="isPull">
          <div v-for='(item,index) in itemMessage.defaultDictionarList'>
            <el-row style='margin-bottom: 10px;'>
              <el-col :span='17'>
                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-form-item :prop="'defaultDictionarList.'+index+'.show'" :rules='itemMessageRules.show'>
                      <el-input v-model="item.show" placeholder="请输入值"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item :prop="'defaultDictionarList.'+index+'.value'" :rules='itemMessageRules.value'>
                      <el-input v-model="item.value" placeholder="请输入code"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span='7'>
                <div class="el-icon-content">
                  <i class="el-icon-plus" @click="addItem(index)"></i>
                  <i class="el-icon-delete" v-show="index>0" @click='deleteItem(index)'></i>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="messageHandle('itemMessage')">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
  import {getDictList,addOrderOptionDict,updateOrderOptionDict} from '@/api/parameter'
  import {checkNameReg,checkSelectReg} from '@/utils/CommonReg'
  export default {
    data(){
      let checkNameRegA=(rule, value, callback)=>{
        if(this.itemMessage.controlType===1){
          if (!value) {
            return callback(new Error('当前项不能为空'));
          } else {
            callback();
          }
        }else{
          callback();
        }
      };
      let checkHint=(rule, value, callback)=>{
        if(this.itemMessage.controlType!==1){
          if (!value) {
            return callback(new Error('请输入提示语'));
          } else {
            callback();
          }
        }else{
          callback();
        }
      };
      let selectReg=(rule, value, callback)=>{
        if(value===''){
          return callback(new Error('请选择'));
        }else{
          callback();
        }
      };
      return{
        searchItem:{
          name:''
        },
        pagination:{
          pageNum:1,
          pageSize:8
        },
        tableData:[{

        }],
        itemMessageTitle:'',
        itemMessageDialog:false,
        itemMessage:{
          name:'',
          controlType:'',
          hintMsg:'',
          defaultDictionarList:[{
            show:'',
            value:''
          }],
          paramKey:''
        },
        itemMessageRules:{
          name: [
            { validator:checkNameReg,trigger: 'blur' }
          ],
          paramKey: [
            { validator:checkNameReg, trigger: 'blur' }
          ],
          controlType: [
            { validator:selectReg,trigger: 'blur' }
          ],
          hintMsg: [
            { validator:checkHint,trigger: 'blur' }
          ],
          show:[
            { validator:checkNameRegA,trigger: 'blur' }
          ],
          value:[
            { validator:checkNameRegA,trigger: 'blur' }
          ],
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
          value:5
        }]
      }
    },
    computed:{
      isPull(){
        return this.itemMessage.controlType===1?true:false
      }
    },
    created(){
      this.getDictListAxios()
    },
    methods:{
      //获取页面数据接口
      getDictListAxios(query){
        getDictList(Object.assign({groupType:this.$route.params.id},this.searchItem,this.pagination,query)).then(res=>{
          if(res.code==='100100'){
            if(res.result.data.length===0 && this.pagination.pageNum!==1){
              this.getDictListAxios()
            }
            this.tableData=res.result
          }
        })
      },
      //添加页面数据接口
      addOrderOptionDictAxios(){
        let defaultDictionarList=this.itemMessage.defaultDictionarList.concat();
        defaultDictionarList=JSON.stringify(defaultDictionarList);
        let aaa=JSON.parse(JSON.stringify(this.itemMessage));
        addOrderOptionDict(Object.assign({groupType:this.$route.params.id},aaa,{defaultDictionarList:defaultDictionarList})).then(res=>{
          if(res.code==='100100'){
            this.$message.success(res.msg);
            this.searchData();
            this.handleClose();
          }else{
            this.$message.error(res.msg)
          }
        })
      },
      //更新页面数据接口
      updateOrderOptionDictAxios(){
        let defaultDictionarList=this.itemMessage.defaultDictionarList.concat();
        defaultDictionarList=JSON.stringify(defaultDictionarList);
        let aaa=JSON.parse(JSON.stringify(this.itemMessage));
        updateOrderOptionDict(Object.assign(aaa,{defaultDictionarList:defaultDictionarList})).then(res=>{
          if(res.code==='100100'){
            this.$message.success(res.msg);
            this.searchData();
            this.handleClose();
          }else{
            this.$message.error(res.msg)
          }
        })
      },
      //重置页面数据
      searchData(index){
        if(index){
          this.pagination.pageNum=1;
        }
        this.getDictListAxios(this.pagination)
      },
      //切换页面操作
      changePage(e){
        this.pagination.pageNum=e;
        this.getDictListAxios(this.pagination)
      },
      //修改页面数据
      editRow(index){
        this.itemMessageTitle='编辑';
        this.itemMessageDialog=true;
        this.itemMessage=JSON.parse(JSON.stringify(this.tableData.data[index]));
        this.itemMessage.defaultDictionarList=eval('('+this.itemMessage.defaultDictionarList+')')
      },
      //新增页面数据
      addInsurance(){
        this.itemMessageTitle='新增';
        this.itemMessageDialog=true;
        this.itemMessage={
          name:'',
          controlType:'',
          hintMsg:'',
          defaultDictionarList:[{
            show:'',
            value:''
          }],
          paramKey:''
        }
      },
      //关闭遮罩
      handleClose(){
        this.itemMessageDialog=false;
      },
      closeDialog(formRule){
        this.$refs[formRule].resetFields();
      },
      //操作（添加）属性值
      addItem(index){
        let arr={
          show:'',
          value:''
        };
        this.itemMessage.defaultDictionarList.splice(index+1,0,arr)
      },
      //操作（删除）属性值
      deleteItem(index) {
        this.itemMessage.defaultDictionarList.splice(index, 1)
      },
      //保存页面新增或修改数据
      messageHandle(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.itemMessageTitle.indexOf('新增')!=-1){
              this.addOrderOptionDictAxios()
            }else{
              this.updateOrderOptionDictAxios()
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      //  表格数据处理
      controlType(value){
        let content;
        this.controlData.filter(item=>{
          if(value===item.value){
            content=item.name
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
