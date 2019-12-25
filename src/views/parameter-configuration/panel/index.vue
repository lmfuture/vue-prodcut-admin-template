<template>
  <el-row class="app-container">
    <el-header>
      <el-form :model="searchInsured" ref="searchInsurance" class="demo-ruleForm">
        <el-form-item label="投保项名称" prop="name">
          <el-row :gutter="20">
            <el-col :span="5">
              <el-input v-model="searchInsured.name" placeholder="请输入投保项名称"></el-input>
            </el-col>
            <el-col :span="11">
              <el-button icon='el-icon-search' type="primary" @click="searchData(1)">查 询</el-button>
              <el-button icon='el-icon-plus' type='success' @click="addsearchInsured">新 增</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-table
        :data="tableData.list"
        show-header
        :header-cell-style="{background:'#F3F4F7',color:'#555'}"
        style="margin-bottom: 40px;">
        <el-table-column
          prop="createDate"
          label="添加时间"
          width="200"
          align="center">
          <template slot-scope="scope">
            {{scope.row.createDate | formatTime(scope.row.createDate)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          width="200"
          label="投保项名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="controlType"
          label="控制类型"
          width="180"
          align="center">
          <template slot-scope="scope">
            {{controlType(scope.row.controlType)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="defaultDictionarList"
          label="属性值"
          width="200"
          align="center">
          <template slot-scope="scope">
            {{defaultDictionarList(scope.row.defaultDictionarList)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="unit"
          label="单位"
          align="center">
          <template slot-scope="scope">
            {{unitArrFunction(scope.row.unit)}}
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
      :title="insuredDialogTitle"
      :visible.sync="insuredDialog"
      center
    >
      <el-form :model="insuredOperate" :rules="insuredOperateRules" ref="insuredOperate" class="demo-ruleForm">
        <el-form-item label="参数key" prop="paramKey" label-width="120px">
          <el-input v-model="insuredOperate.paramKey" placeholder="请输入参数Key"></el-input>
        </el-form-item>
        <el-form-item label="投保项名称" prop="name" label-width="120px">
          <el-input v-model="insuredOperate.name" placeholder="请输入投保项名称"></el-input>
        </el-form-item>
        <el-form-item label="控制类型" prop="controlType" label-width="120px">
          <el-select v-model="insuredOperate.controlType" placeholder="请选择">
            <el-option v-for="item in controlData" :key="item.name" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="属性值" prop="defaultDictionarList" label-width="120px">
          <div v-for='(item,index) in insuredOperate.defaultDictionarList'>
            <el-row style='margin-bottom: 10px;'>
              <el-col :span='17'>
                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-form-item :prop="'defaultDictionarList.'+index+'.show'" :rules='insuredOperateRules.show'>
                      <el-input v-model="item.show" placeholder="请输入值"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item :prop="'defaultDictionarList.'+index+'.value'" :rules='insuredOperateRules.value'>
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
        <el-form-item label="单位" prop="unit" label-width="120px">
          <el-select v-model="insuredOperate.unit" placeholder="请选择">
            <el-option v-for="item in unitArr" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否只读" prop="readOnly" label-width="120px">
          <el-radio-group v-model="insuredOperate.readOnly">
            <el-radio label='1'>是</el-radio>
            <el-radio label='0'>否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="messageHandle('insuredOperate')">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
  import {getInsuranceItemList,getInsuranceItemByName,addInsuranceItem,updateInsuranceItem,checkInsuranceItemName,checkParamKey} from '@/api/parameter'
  import {checkNameReg} from '@/utils/CommonReg'
    export default {
      data(){
        //验证投保项名称是否重复正则
        let rulesName=(rule,value,callback)=>{
          if(!value){
            return callback(new Error('请输入投保项名称'));
          }else{
            if(this.insuredDialogTitle.indexOf('新增')!=-1){
              this.checkInsuranceItemNameAxios({name:value}).then(res=>{
                if(res){
                  callback();
                }else{
                  return callback(new Error('投保项名称重复'));
                }
              })
            }else{
              if(value===this.tableData.list[this.nowIndex].name){
                callback();
              }else{
                this.checkInsuranceItemNameAxios({name:value}).then(res=>{
                  if(res){
                    callback();
                  }else{
                    return callback(new Error('投保项名称重复'));
                  }
                })
              }
            }
          }
        };
        //验证投保项key是否重复正则
        let ruleskey=(rule,value,callback)=>{
          if(!value){
            return callback(new Error('请输入参数Key'));
          }else{
            if(this.insuredDialogTitle.indexOf('新增')!=-1){
              this.checkParamKeyAxios({paramKey:value}).then(res=>{
                if(res){
                  callback();
                }else{
                  return callback(new Error('参数Key重复'));
                }
              })
            }else{
              if(value===this.tableData.list[this.nowIndex].paramKey){
                callback();
              }else{
                this.checkParamKeyAxios({paramKey:value}).then(res=>{
                  if(res){
                    callback();
                  }else{
                    return callback(new Error('参数Key重复'));
                  }
                })
              }
            }
          }
        };
        return{
          insuredDialog:false,
          insuredDialogTitle:'',
          nowIndex:0,
          searchInsured:{
            name:''
          },
          insuredOperate:{
            paramKey:'',
            name:'',
            controlType:'',
            defaultDictionarList:[{
              show:'',
              value:''
            }],
            readOnly:'',
            unit:''
          },
          insuredOperateRules:{
            paramKey: [
              { required: true, validator:ruleskey, trigger: 'blur' }
            ],
            name: [
              { required: true,validator:rulesName, trigger: 'blur' }
            ],
            controlType: [
              { required: true, message: '请选择控制类型', trigger: 'change' }
            ],
            unit: [
              { required: true, message: '请选择单位', trigger: 'change' }
            ],
            defaultDictionarList: [
              { required: true, message: '请输入属性值', trigger: 'blur' }
            ],
            readOnly: [
              { required: true, message: '请选择是否只读', trigger: 'change' }
            ],
            show:[
              { validator:checkNameReg,trigger: 'blur' }
            ],
            value:[
              { validator:checkNameReg,trigger: 'blur' }
            ],
          },
          pagination:{
            pageNum:1,
            pageSize:8
          },
          tableData:[],
          controlData:[{
            name:'按钮类型',
            value:0
          },{
            name:'时间框',
            value:1
          },{
            name:'职位级联',
            value:2
          },{
            name:'地区级联列表',
            value:3
          },{
            name:'纯文本',
            value:4
          }],
          unitArr:[{
            value:'1',
            name:'元'
          },{
            value:'2',
            name:'万元'
          },{
            value:'3',
            name:'周岁'
          },{
            value:'4',
            name:'天'
          },{
            value:'5',
            name:'年'
          },{
            value:'6',
            name:'月'
          },{
            value:'7',
            name:'份'
          },{
            value:'8',
            name:'无'
          }]
        }
      },
      watch:{
        insuredDialog: function (val,oldVla) {
          if (this.$refs['insuredOperate'] != undefined) {
            this.$refs["insuredOperate"].resetFields();
          }
        }
      },
      created(){
        this.getInsuranceItemByNameAxios();
      },
      methods:{
        //条件查询数据接口
        getInsuranceItemByNameAxios(query){
          getInsuranceItemByName(Object.assign(this.pagination,this.searchInsured,query)).then(res=>{
            if(res.code==='100100'){
              this.tableData=res.result
            }
          })
        },
        //添加数据接口
        addInsuranceItemAxios(query){
          let defaultDictionarList=this.insuredOperate.defaultDictionarList.concat();
          defaultDictionarList=JSON.stringify(defaultDictionarList);
          let aaa=JSON.parse(JSON.stringify(this.insuredOperate));
          addInsuranceItem(Object.assign(aaa,{defaultDictionarList:defaultDictionarList})).then(res=>{
            console.log(this.insuredOperate.defaultDictionarList);
            if(res.code==='100100'){
              this.$message.success(res.msg);
              this.resetData();
              this.handleClose();
            }else{
              this.$message.error(res.msg)
            }
          })
        },
        //编辑/修改数据接口
        updateInsuranceItemAxios(query){
          let defaultDictionarList=this.insuredOperate.defaultDictionarList.concat();
          defaultDictionarList=JSON.stringify(defaultDictionarList);
          let aaa=JSON.parse(JSON.stringify(this.insuredOperate));
          updateInsuranceItem(Object.assign(aaa,{defaultDictionarList:defaultDictionarList})).then(res=>{
            if(res.code==='100100'){
              this.handleClose();
              this.$message.success(res.msg);
              this.resetData()
            }else{
              this.$message.error(res.msg);
            }
          })
        },
        //进行数据模糊查询
        searchData(index){
          if(index){
            this.pagination.pageNum=1;
          }
          this.getInsuranceItemByNameAxios()
        },
        //验证投保项名称是否存在接口
        checkInsuranceItemNameAxios:async function (query){
          let flag=false;
          await checkInsuranceItemName(query).then(res=>{
            if(res.code==='100100'){
              if(res.result){
                flag=false;
              }else{
                flag=true;
              }
            }
          });
          return flag
        },
        //验证投保项key是否存在接口
        checkParamKeyAxios:async function (query){
          let flag=false;
          await checkParamKey(query).then(res=>{
            if(res.code==='100100'){
              if(res.result){
                flag=false;
              }else{
                flag=true;
              }
            }
          });
          return flag
        },
        //新增数据事件
        addsearchInsured(){
          this.insuredDialogTitle='新增';
          this.insuredDialog=true;
          this.insuredOperate={
            paramKey:'',
            name:'',
            controlType:'',
            defaultDictionarList:[{
              show:'',
              value:''
            }],
            readOnly:'',
            unit:''
          }
        },
        //切换页码
        changePage(e){
          this.pagination.pageNum=e;
          this.getInsuranceItemByNameAxios(this.pagination)
        },
        //编辑数据事件
        editRow(index){
          this.nowIndex=index;
          this.insuredDialog=true;
          this.insuredDialogTitle='编辑';
          this.insuredOperate=JSON.parse(JSON.stringify(this.tableData.list[index]));
          if(this.insuredOperate.defaultDictionarList){
            this.insuredOperate.defaultDictionarList=eval('('+this.insuredOperate.defaultDictionarList+')');
          }else{
            this.insuredOperate.defaultDictionarList=[{
              show:'',
              value:''
            }]
          }
          this.insuredOperate.readOnly=this.insuredOperate.readOnly?'1':'0'
        },
        //操作（添加）属性值
        addItem(index){
          let arr={
            show:'',
            value:''
          };
          this.insuredOperate.defaultDictionarList.splice(index+1,0,arr);
        },
        //操作（删除）属性值
        deleteItem(index) {
          console.log(index);
          this.insuredOperate.defaultDictionarList.splice(index, 1)
        },
        //新增或修改数据保存事件
        messageHandle(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.insuredOperate.readOnly==='1'?this.insuredOperate.readOnly=true:this.insuredOperate.readOnly=false;
              if(this.insuredDialogTitle.indexOf('新增')!=-1){
                this.addInsuranceItemAxios()
              }else{
                this.updateInsuranceItemAxios()
              }
            } else {
              console.log('error submit!!');
              return false;
            }
          })
        },
        //遮罩关闭
        handleClose(){
          this.insuredDialog=false;
        },
        //重置所有数据
        resetData(){
          this.getInsuranceItemByNameAxios(this.pagination)
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
        defaultDictionarList(value){
          let content='';
          eval('('+value+')') && eval('('+value+')').map(item=>{
            content+=item.show+'/'
          });
          if(content){
            content=content.substr(0,content.length-1);
          }
          return content;
        },
        unitArrFunction(value){
          let content;
          this.unitArr.filter(item=>{
            if(value===item.value){
              content=item.name
            }
          });
          return content;
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
