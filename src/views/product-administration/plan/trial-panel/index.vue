<template>
  <el-row>
    <el-header>
      <el-button icon='el-icon-plus' type='success' @click="addsearchInsured">新 增</el-button>
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
          prop="dictionaryList"
          label="属性值"
          width="200"
          align="center">
          <template slot-scope="scope">
            {{dictionaryList(scope.row.dictionaryList)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="showUnit"
          label="单位"
          align="center">
          <template slot-scope="scope">
            {{unitArrFunction(scope.row.showUnit)}}
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
            <el-button
              @click.native.prevent="delRow(scope.$index)"
              type="text"
              size="medium">
              删除
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
        <el-form-item label="投保项名称" prop="name" label-width="120px">
          <el-select filterable no-match-text="暂无匹配数据" v-model="insuredOperate.name" placeholder="请选择投保项名称" @change="InsuranceItemChange">
            <el-option v-for="item in InsuranceItemList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-row v-if="insuredOperate.name">
          <el-form-item label="控制类型" prop="controlType" label-width="120px">
            {{controlType(insuredOperate.controlType)}}
          </el-form-item>
          <el-form-item label="属性值" prop="dictionaryList" label-width="120px">
            <div v-for='(item,index) in insuredOperate.dictionaryList'>
              <el-row style='margin-bottom: 10px;'>
                <el-col :span='17'>
                  <el-row :gutter="10">
                    <el-col :span="12">
                      <el-input v-model="item.show" placeholder="请输入值"></el-input>
                    </el-col>
                    <el-col :span="12">
                      <el-input v-model="item.value" placeholder="请输入code"></el-input>
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
          <el-form-item label="单位" prop="showUnit" label-width="120px">
            <el-select v-model="insuredOperate.showUnit" @change="showUnitChange" placeholder="请选择">
              <el-option v-for="item in unitArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序" prop="sort" label-width="120px">
            <el-input style="width: 200px;" v-model="insuredOperate.sort" placeholder="请输入排序"></el-input>
          </el-form-item>
          <el-form-item label="注释" prop="description" label-width="120px">
            <el-input style="width: 200px;" v-model="insuredOperate.description" placeholder="请输入注释"></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="messageHandle('insuredOperate')">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
  import {checkInsuranceItemName} from '@/api/parameter'
  import {getProductOptionById,addProductOption,deleteProductOptionById} from '@/api/product'
  import {getInsuranceItemList} from '@/api/parameter'
  import {checkSortReg} from '@/utils/CommonReg'
  export default {
    data(){
      return{
        insuredDialog:false,
        insuredDialogTitle:'',
        nowIndex:0,
        editId:'',
        searchInsured:{
          name:''
        },
        insuredOperate:{
          name:'',
          controlType:'',
          dictionaryList:[{
            show:'',
            value:''
          }],
          showUnit:'',
          description:'',
          sort:''
        },
        InsuranceItemList:[],
        insuredOperateRules:{
          name: [
            { required: true,message: '请选择名称', trigger: 'blur' }
          ],
          dictionaryList: [
            { required: true, message: '请输入属性值', trigger: 'blur' }
          ],
          showUnit: [
            { required: true,message: '请选择单位', trigger: 'blur' }
          ],
          description: [
            { required: true,message: '请输入注释', trigger: 'blur' }
          ],
          sort: [
            { required: true,validator:checkSortReg, trigger: 'blur' }
          ]
        },
        pagination:{
          pageNum:1,
          pageSize:8
        },
        tableData:{},
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
          value:1,
          name:'元'
        },{
          value:2,
          name:'万元'
        },{
          value:3,
          name:'周岁'
        },{
          value:4,
          name:'天'
        },{
          value:5,
          name:'年'
        },{
          value:6,
          name:'月'
        },{
          value:7,
          name:'份'
        },{
          value:8,
          name:'无'
        }]
      }
    },
    created(){
      this.getProductOptionByIdAxios();
      this.getInsuranceItemListAxios();
    },
    methods:{
      //获取所有数据接口
      getProductOptionByIdAxios(query){
        getProductOptionById(Object.assign({planId:this.$route.params.id},this.pagination,query)).then(res=>{
          if(res.code==='100100'){
            if(res.result.data.length===0 && this.pagination.pageNum!==1){
              this.pagination.pageNum=1;
              this.getProductOptionByIdAxios(this.pagination.pageNum)
            }
            this.tableData=res.result;
          }
        })
      },
      addProductOptionAxios(query){
        addProductOption(Object.assign({planId:this.$route.params.id},query)).then(res=>{
          if(res.code==='100100'){
            this.$message.success('保存数据成功');
            this.resetData()
          }else{
            this.$message.error('保存数据失败')
          }
        })
      },
      deleteProductOptionByIdAxios(query){
        deleteProductOptionById(query).then(res=>{
          if(res.code==='100100'){
            this.$message.success(res.msg);
            this.resetData()
          }else{
            this.$message.error(res.msg)
          }
        })
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
      getInsuranceItemListAxios(){
        getInsuranceItemList().then(res=>{
          if(res.code==='100100'){
            this.InsuranceItemList=res.result
          }
        })
      },
      //新增数据事件
      addsearchInsured(){
        this.insuredDialogTitle='新增';
        this.insuredDialog=true;
        this.insuredOperate={
          name:'',
          controlType:'',
          dictionaryList:[{
            show:'',
            value:''
          }],
          showUnit:'',
          description:'',
          sort:''
        }
      },
      InsuranceItemChange(e){
        let content={};
        this.InsuranceItemList.map((item)=>{
          if(item.id===e){
            content=JSON.parse(JSON.stringify(item))
          }
        });
        this.insuredOperate=content;
        this.insuredOperate.showUnit=content.unit;
        this.insuredOperate.dictionaryList=eval('('+content.defaultDictionarList+')');
      },
      //切换页码
      changePage(e){
        this.pagination.pageNum=e;
        this.getProductOptionByIdAxios(this.pagination)
      },
      showUnitChange(e){
        this.insuredOperate.showUnit=e;
        this.insuredOperate=Object.assign({},this.insuredOperate);
      },
      //编辑数据事件
      editRow(index){
        this.nowIndex=index;
        this.insuredDialog=true;
        this.insuredDialogTitle='编辑';
        this.insuredOperate=JSON.parse(JSON.stringify(this.tableData.data[index]));
        this.insuredOperate.dictionaryList=eval('('+this.insuredOperate.dictionaryList+')');
        this.editId=this.insuredOperate.id
      },
      //操作（添加）属性值
      addItem(index){
        let arr={
          show:'',
          value:''
        };
        this.insuredOperate.dictionaryList.splice(index+1,0,arr);
        this.insuredOperate=Object.assign({},this.insuredOperate);
      },
      //操作（删除）属性值
      deleteItem(index) {
        this.insuredOperate.dictionaryList.splice(index, 1);
        this.insuredOperate=Object.assign({},this.insuredOperate);
      },
      delRow(index){
        this.deleteProductOptionByIdAxios({id:this.tableData.data[index].id})
      },
      //新增或修改数据保存事件
      messageHandle(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.insuredDialogTitle.indexOf('新增')!==-1){
              this.insuredOperate.id='';
            }else{
              this.insuredOperate.id=this.editId;
            }
            this.insuredOperate.dictionaryList=JSON.stringify(this.insuredOperate.dictionaryList);
            this.addProductOptionAxios(this.insuredOperate)
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
        this.getProductOptionByIdAxios(this.pagination);
        this.handleClose();
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
          if(Number(value)===item.value){
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
