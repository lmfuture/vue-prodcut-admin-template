<template>
  <el-row>
    <el-row class="el-header">
      <el-button type="primary" @click="addRow">新增一级菜单</el-button>
    </el-row>
    <el-main>
      <el-table
        :data="tableData"
        show-header
        :header-cell-style="{background:'#F3F4F7',color:'#555'}"
        style="margin-bottom: 40px;">
        <el-table-column
          prop="name"
          label="菜单名称"
          >
          <template slot-scope="scope">
            <div class="opendivName">
              <i v-show="scope.row.openflag===false && scope.row.children && scope.row.children.length>0" @click="openShow(scope.$index)" class="el-icon-circle-plus-outline"></i>
              <i v-show="scope.row.openflag===true && scope.row.children && scope.row.children.length>0" @click="openShow(scope.$index)" class="el-icon-remove-outline"></i>
            </div>
            {{scope.row.name}}
          </template>
        </el-table-column>
        <el-table-column
          prop="isHidden"
          label="是否显示"
          align="center">
          <template slot-scope="scope">
            {{scope.row.hidden?'不显示':'显示'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="link"
          label="链接"
          align="center">
        </el-table-column>
        <el-table-column
          prop="orders"
          label="排序"
          align="center">
        </el-table-column>
        <el-table-column
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
            <el-button
              @click.native.prevent="addRow(scope.$index)"
              type="text"
              size="medium">
              添加下级菜单
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-dialog
      :title="messageTitle"
      :visible.sync="messageDialog"
      width="40%"
      center
      @close="closeDialog('roleMessage')"
    >
      <el-form :model="roleMessage" :rules="roleMessageRules" ref="roleMessage" class="demo-ruleForm">
        <el-form-item label="上级菜单名称" prop="parentName" label-width="120px" v-show="roleMessage.parentName">
          {{roleMessage.parentName}}
        </el-form-item>
        <el-form-item label="菜单名称" prop="cnName" label-width="120px">
          <el-input style="width: 300px;" v-model.trim="roleMessage.cnName" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单英文名称" prop="enName" label-width="120px">
          <el-input style="width: 300px;" v-model.trim="roleMessage.enName" placeholder="请输入菜单英文名称"></el-input>
        </el-form-item>
        <el-form-item label="Icon名称" prop="icon" label-width="120px">
          <el-input style="width: 300px;" v-model.trim="roleMessage.icon" placeholder="请输入Icon名称"></el-input>
        </el-form-item>
        <el-form-item label="是否可见" prop="isHidden" label-width="120px">
          <el-radio-group v-model="roleMessage.isHidden">
            <el-radio :label=true>不显示</el-radio>
            <el-radio :label=false>显示</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="链接" prop="link" label-width="120px">
          <el-input style="width: 300px;" v-model.trim="roleMessage.link" placeholder="请输入链接"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="orders" label-width="120px">
          <el-input style="width: 300px;" v-model.trim="roleMessage.orders" placeholder="请输入排序"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="messageHandle('roleMessage')">确 定</el-button>
          <el-button @click="messageClose">取 消</el-button>
        </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="delDialog"
      width="40%"
      center
    >
      <h3 style="text-align: center">您确定要删除内容吗？</h3>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="delHandle">确 定</el-button>
        <el-button @click="delClose">取 消</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
  import {getTreeMenuData,findSysResourceById,resourceInsert,resourceUpdate,resourceDelete} from '@/api/account'
  import {checkNameReg,checkSelectReg,checkCapitalReg,checkSortReg,checkLinkReg} from '@/utils/CommonReg'
    export default {
      data(){
        return{
          tableData:[],
          originalData:[],
          roleMessage:{
            cnName:'',
            enName:'',
            isHidden:'',
            link:'',
            orders:'',
            icon:''
          },
          roleMessageRules:{
            cnName: [
              { required:true,validator:checkNameReg, trigger: 'blur' }
            ],
            enName: [
              { required:true,validator:checkCapitalReg,trigger: 'blur' }
            ],
            icon: [
              { required:true,validator:checkNameReg,trigger: 'blur' }
            ],
            link: [
              { required:true,validator:checkLinkReg,trigger: 'blur' }
            ],
            orders: [
              { required:true,validator:checkSortReg,trigger: 'blur' }
            ],
            isHidden: [
              { required:true,message:'请选择',trigger: 'blur' }
            ]
          },
          messageTitle:'',
          messageDialog:false,
          delDialog:false,
          nowIndex:0
        }
      },
      created() {
        this.getTreeMenuDataAxios()
      },
      methods:{
        //页面数据获取接口
        getTreeMenuDataAxios(query){
          getTreeMenuData().then(res=>{
            this.originalData=res;
            this.tableData=this.changeArray(res);
          })
        },
        //数据转换函数
        changeArray(value){
          let arr=[];
          if(value.length===0)return false;
          value.map(v=>{
            value.map(item=>{
              if(v.id===item.pid){
                if(v.children){
                  v.children.push(item)
                }else{
                  v.children=[];
                  v.children.push(item);
                }
              }
            });
          });
          value.map(item=>{
            item.openflag=false;
            if(item.pid===0){
              arr.push(item)
            }
          });
          arr.map(item=>{
            item.children && item.children.sort(this.compare('orders'));
          });
          return arr.sort(this.compare('orders'));
        },
        compare(property){
          return function(a,b){
            let value1 = a[property];
            let value2 = b[property];
            return value1 - value2;
         }
        },
        //根据id查菜单
        findSysResourceByIdAxios(query){
          findSysResourceById(query).then(res=>{
            if(res.code==='100100'){
              this.messageDialog=true;
              this.roleMessage=res.result;
              this.originalData.map(item=>{
                if(item.id===this.roleMessage.parentId){
                  this.roleMessage.parentName=item.name
                }
              })
            }
          })
        },
        //菜单添加接口
        resourceInsertAxios(query){
          resourceInsert(query).then(res=>{
            if(res.code==='100100'){
              this.$message.success(res.msg);
              this.messageClose();
              this.getTreeMenuDataAxios()
            }else{
              this.$message.error(res.msg)
            }
          })
        },
        //菜单更新接口
        resourceUpdateAxios(query){
          resourceUpdate(query).then(res=>{
            if(res.code==='100100'){
              this.$message.success(res.msg);
              this.getTreeMenuDataAxios();
              this.messageClose();
            }else{
              this.$message.error(res.msg)
            }
          })
        },
        //删除菜单接口
        resourceDeleteAxios(query){
          resourceDelete(query).then(res=>{
            if(res.code==='100100'){
              this.$message.success(res.msg);
              this.delClose();
              this.getTreeMenuDataAxios()
            }else{
              this.$message.error(res.msg)
            }
          })
        },
        //子级显示事件
        openShow(index){
          if(this.tableData[index].openflag){
            this.tableData[index].openflag=false;
            this.tableData.splice(index+1,this.tableData[index].children.length)
          }else{
            this.tableData[index].openflag=true;
            this.tableData[index].children.map((item,i)=>{
              this.tableData.splice(index+i+1,0,this.tableData[index].children[i])
            })
          }
        },
        //数据保存事件
        messageHandle(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              if(this.messageTitle.indexOf('新增')!==-1){
                this.resourceInsertAxios(this.roleMessage)
              }else{
                this.resourceUpdateAxios(this.roleMessage)
              }
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        messageClose(){
          this.messageDialog=false;
        },
        //新增数据事件
        addRow(index){
          this.messageTitle='新增';
          this.messageDialog=true;
          this.roleMessage={
            cnName:'',
            enName:'',
            isHidden:'',
            link:'',
            orders:'',
            icon:''
          };
          if(typeof index==='number'){
            this.roleMessage.parentId=this.tableData[index].id
          }
        },
        //编辑数据事件
        editRow(index){
          this.findSysResourceByIdAxios({id:this.tableData[index].id});
          this.messageTitle='编辑'
        },
        delRow(index){
          this.delDialog=true;
          this.nowIndex=index;
        },
        //删除事件
        delHandle(){
          this.resourceDeleteAxios({id:this.tableData[this.nowIndex].id})
        },
        delClose(){
          this.delDialog=false;
        },
        closeDialog(formName){
          this.$refs[formName].resetFields()
        }
      }
    }
</script>

<style scoped lang="scss">
  .el-header,.el-main{
    background: #fff;
    margin-bottom: 10px;
  }
  .el-header{
    padding: 20px 0;
    button{
      margin-left: 20px;
    }
  }
  .opendivName{
    width: 40px;
    height: 23px;
    float: left;
    i{
      font-size: 23px;
    }
  }
</style>
