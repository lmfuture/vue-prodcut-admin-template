<template>
  <el-row>
    <div class="el-header">
      <el-form :model="formRole" ref="formRole" class="demo-ruleForm">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="角色名称" prop="name" label-width="120px">
              <el-input v-model="formRole.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否启用" prop="status" label-width="120px">
              <el-select v-model="formRole.isEnable">
                <el-option v-for="item in statusData" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-button icon='el-icon-search' @click="searchClick(1)" type="primary">查 询</el-button>
            <el-button icon='el-icon-plus' @click="addAccount" type='success'>新 增</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-main>
      <el-table
        :data="tableData.data"
        show-header
        :header-cell-style="{background:'#F3F4F7',color:'#555'}"
        style="margin-bottom: 40px;">
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center">
          <template slot-scope="scope">
            {{scope.row.createTime | formatTime(scope.row.createTime)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="角色名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="clause"
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="rootEdit(scope.$index)"
              type="text"
              size="medium">
              关联权限
            </el-button>
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
    <el-dialog
      title="关联权限"
      :visible.sync="rootDialog"
      width="40%"
      center
    >
      <el-tree
        :data="this.rootData"
        show-checkbox
        node-key="id"
        :default-expanded-keys=expandedKeys
        :default-checked-keys=checkedKeys
        :props="defaultProps"
        ref="tree"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="rootHandle">确 定</el-button>
        <el-button @click="rootClose">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="messageTitle"
      :visible.sync="messageDialog"
      width="40%"
      center
    >
      <el-form :model="roleMessage" :rules="roleMessageRules" ref="roleMessage" class="demo-ruleForm">
        <el-form-item label="名称" prop="name" label-width="120px">
          <el-input style="width: 300px;" v-model.trim="roleMessage.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="isEnable" label-width="120px">
          <el-radio-group v-model="roleMessage.isEnable">
            <el-radio :label=true>启用</el-radio>
            <el-radio :label=false>禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="messageHandle('roleMessage')">确 定</el-button>
          <el-button @click="messageClose">取 消</el-button>
        </span>
    </el-dialog>
  </el-row>
</template>

<script>
  import {findSystemRolePagination,roleDelete,roleUpdate,roleInsert,updateResource,getTreeMenuData,roleCheck} from '@/api/account'
  import {checkSelectReg} from '@/utils/CommonReg'
  export default {
    data(){
      let rulesName=(rule,value,callback)=>{
        if(!value){
          return callback(new Error('请输入名称'));
        }else{
          if(this.messageTitle.indexOf('新增')!=-1){
            this.roleCheckAxios({name:value}).then(res=>{
              if(res){
                callback();
              }else{
                return callback(new Error('名称重复'));
              }
            })
          }else{
            if(value===this.tableData.data[this.nowIndex].name){
              callback();
            }else{
              this.roleCheckAxios({name:value}).then(res=>{
                if(res){
                  callback();
                }else{
                  return callback(new Error('名称重复'));
                }
              })
            }
          }
        }
      };
      return{
        formRole:{
          name:'',
          isEnable:null
        },
        roleMessage:{
          name:'',
          isEnable:''
        },
        roleMessageRules:{
          name: [
            { required:true,validator:rulesName, trigger: 'change' }
          ],
          isEnable: [
            { required:true,message:'请选择',trigger: 'blur' }
          ]
        },
        statusData:[{
          name:'全部',
          value:null
        },{
          name:'是',
          value:1
        },{
          name:'否',
          value:0
        }],
        nowIndex:0,
        tableData:[],
        roleData:[],
        messageDialog:false,
        messageTitle:'',
        delDialog:false,
        rootDialog:false,
        defaultProps:{
          label:function(data,node){
            return node.data.name
          }
        },
        pagination:{
          pageNum:1,
          pageSize:6
        },
        rootData:[],
        checkedKeys:[],
        expandedKeys:[]
      }
    },
    created(){
      this.findSystemRolePaginationAxios()
    },
    methods:{
      //获取角色列表接口
      findSystemRolePaginationAxios(query){
        findSystemRolePagination(Object.assign({},this.formRole,this.pagination,query)).then(res=>{
          if(res.code==='100100'){
            if(res.result.data.length===0 && this.pagination.pageNum!==1){
              this.pagination.pageNum=1;
              this.findSystemRolePaginationAxios()
            }
            this.tableData=res.result;
          }
        })
      },
      //模糊查询接口 参数为区分页码切换
      searchClick(index){
        if(index){
          this.pagination.pageNum=1;
        }
        if(this.formRole.isEnable){
          this.formRole.isEnable===1?this.formRole.isEnable=true:this.formRole.isEnable=false
        }
        this.findSystemRolePaginationAxios(this.formRole);
        if(this.formRole.isEnable){
          this.formRole.isEnable===true?this.formRole.isEnable=1:this.formRole.isEnable=0
        }
      },
      roleCheckAxios:async function (query){
        let flag=false;
        await roleCheck(query).then(res=>{
          if(res.code==='100100'){
            if(res.result){
              flag=true;
            }else{
              flag=false;
            }
          }
        });
        return flag
      },
      //删除角色接口
      roleDeleteAxios(query){
        roleDelete(query).then(res=>{
          if(res.code==='100100'){
            this.$message.success(res.msg);
            this.searchClick();
            this.delClose();
          }else{
            this.$message.error(res.msg)
          }
        })
      },
      //更新角色信息接口
      roleUpdateAxios(query){
        roleUpdate(query).then(res=>{
          if(res.code==='100100'){
            this.$message.success(res.msg);
            this.searchClick();
            this.messageClose();
          }else{
            this.$message.error(res.msg)
          }
        })
      },
      //获取权限接口
      getTreeMenuDataAxios(query){
        getTreeMenuData(query).then(res=>{
          this.rootData=this.changeArray(res);
          this.rootDialog=true;
        })
      },
      //更新权限接口
      updateResourceAxios(query){
        updateResource(query).then(res=>{
          if(res.code==='100100'){
            this.$message.success(res.msg);
            this.searchClick();
            this.rootClose();
          }else{
            this.$message.error(res.msg)
          }
        })
      },
      //数据转换为权限数组
      changeArray(value){
        let arr=[];
        if(value.length===0)return false;
        this.expandedKeys=[-1];
        this.checkedKeys=[];
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
          if(v.checked===true){
            this.checkedKeys.push(v.id);
          }
          if(v.pid===0){
            this.expandedKeys.push(v.id);
          }
        });
        value.map(item=>{
          if(item.pid<0){
            arr.push(item)
          }
        });
        return arr;
      },
      //角色新增接口
      roleInsertAxios(query){
        roleInsert(query).then(res=>{
          if(res.code==='100100'){
            this.$message.success(res.msg);
            this.searchClick();
            this.messageClose();
          }else{
            this.$message.error(res.msg)
          }
        })
      },
      //编辑角色事件
      editRow(index){
        this.messageTitle='编辑';
        this.nowIndex=index;
        this.roleMessage=JSON.parse(JSON.stringify(this.tableData.data[index]));
        this.messageDialog=true;
      },
      //新增角色事件
      addAccount(){
        this.messageTitle='新增';
        this.messageDialog=true;
        this.roleMessage={
          account:'',
          name:'',
          tel:'',
          role:''
        }
      },
      //删除第几项事件
      delRow(index){
        this.nowIndex=index;
        this.delDialog=true;
      },
      //删除操作事件
      delHandle(){
        this.roleDeleteAxios({id:this.tableData.data[this.nowIndex].id})
      },
      delClose(){
        this.delDialog=false;
      },
      //数据保存事件
      messageHandle(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.messageTitle.indexOf('新增')!==-1){
              this.roleInsertAxios(this.roleMessage)
            }else{
              this.roleUpdateAxios(this.roleMessage)
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
      //  关联权限
      rootEdit(index){
        this.nowIndex=index;
        this.getTreeMenuDataAxios({roleId:this.tableData.data[index].id})
      },
      //权限保存事件
      rootHandle(){
        if(this.$refs.tree.getCheckedKeys().length===0){
          this.$message.error('权限不能为空');
          return false;
        }
        this.updateResourceAxios({ids:this.$refs.tree.getCheckedKeys(),roleId:this.tableData.data[this.nowIndex].id})
      },
      rootClose(){
        this.rootDialog=false;
      },
      //切换分页
      changePage(e){
        this.pagination.pageNum=e;
        this.searchClick()
      }
    }
  }
</script>

<style scoped lang="scss">
  .el-header,.el-main{
    background: #fff;
    margin-bottom: 10px;
  }
</style>
