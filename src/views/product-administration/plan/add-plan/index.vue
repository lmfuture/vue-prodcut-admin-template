  <template>
	<div style="padding-bottom: 50px">
		<h1 class="title_line">{{currentTitle}}</h1>
		<el-form ref="planForm" :model="planForm" :rules="planFormRules" class='form'>
		  <el-form-item label="计划名称：" prop="planName" label-width="150px">
		  	<el-col :span='10'>
		  		<el-input v-model="planForm.planName"></el-input>
		  	</el-col>
		  </el-form-item>

		  <el-form-item label="起始价格：" prop="priceStart" label-width="150px">
		  	<el-col :span='10'>
		  		<el-input v-model="planForm.priceStart"></el-input>
		  	</el-col>
		  </el-form-item>

		  <el-form-item label="计划标签：" prop="planLabel" label-width="150px">
		  	<el-col :span='10'>
		  		<el-input v-model="planForm.planLabel"></el-input>
		  	</el-col>
		  </el-form-item>
		  <el-form-item label="产品详情banner图：" prop="banner" label-width="150px">
        <el-row v-show="logoShow" class="showLogo">
          <img :src="planForm.banner" alt="">
          <i class="el-icon-close" @click="handldAvatarRemove()"></i>
        </el-row>
        <el-upload
          list-type="picture-card"
          :action=baseUpLoad
          :with-credentials=true
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          v-show="!logoShow"
          accept='.jpg,.png'
          :file-list="fileLoad"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
		  </el-form-item>
      <h1 class="title_line" style="margin-top: 30px;margin-bottom: 30px;">保障方案</h1>
      <el-table :data="planForm.productDutyList" class="tb-edit" style="width: 100%" highlight-current-row :header-cell-style="{background:'#F3F4F7',color:'#555'}">
        <el-table-column prop="name" label="名称" width="230" align="center">
          <template scope="scope">
              <el-form-item :prop="'productDutyList.'+scope.$index+'.name'" :rules='planFormRules.name'>
                <el-input size="small" v-model="scope.row.name" placeholder="请输入内容"></el-input>
              </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="值" width="230" align="center">
          <template scope="scope">
            <el-form-item :prop="'productDutyList.'+scope.$index+'.value'" :rules='planFormRules.value'>
              <el-input size="small" v-model="scope.row.value" placeholder="请输入内容"></el-input>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="描述" width="420" align="center">
          <template scope="scope">
              <el-form-item :prop="'productDutyList.'+scope.$index+'.detail'" :rules='planFormRules.detail'>
                <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="scope.row.detail">
                </el-input>
              </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template scope="scope">
            <div class="el-icon-content">
              <i class="el-icon-plus" @click='handleAdd(scope.$index)'></i>
              <i class="el-icon-delete" v-show="planForm.productDutyList.length>1" @click="handleDelete(scope.$index)"></i>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div style="text-align: center;margin-top: 30px">
        <el-button type="primary" @click="planHandle('planForm')">确 定</el-button>
      </div>
    </el-form>
	</div>
</template>

<script>
  import {checkNameReg,checkMoneyReg,checkUploadReg} from '@/utils/CommonReg'
  import {getProductPlanById,addProductPlan} from '@/api/product'
  export default {
    data() {
      return {
        baseUpLoad:'',
        planForm:{
          planName:'',
          priceStart:'',
          planLabel:'',
          banner:'',
          productDutyList:[{
            name:'',
            value:'',
            detail:''
          }],
          currentTitle:'新增计划'
        },
        planFormRules:{
          planName: [
            { validator:checkNameReg,trigger: 'blur' }
          ],
          priceStart: [
            { validator:checkMoneyReg,trigger: 'blur' }
          ],
          planLabel:[
            { validator:checkNameReg,trigger: 'blur' }
          ],
          name:[
            { validator:checkNameReg,trigger: 'blur' }
          ],
          value:[
            { validator:checkNameReg,trigger: 'blur' }
          ],
          detail:[
            { validator:checkNameReg,trigger: 'blur' }
          ]
        },
        fileLoad:[]
      }
    },
    created(){
      this.baseUpLoad=process.env.VUE_APP_BASE_API+'/admin/upload';
      if(this.$route.query.planId){
        this.getProductPlanByIdAxios({planId:this.$route.query.planId})
        this.currentTitle='编辑计划'
      }else{
        this.currentTitle='新增计划'
      }
    },
    computed: {
      logoShow() {//当图片多于一张的时候，就隐藏上传框
        return this.planForm.banner === '' ? false : true
      }
    },
    methods: {
      getProductPlanByIdAxios(query){
        getProductPlanById(query).then(res=>{
          if(res.code==='100100'){
            this.planForm=res.result.productPlan;
            this.planForm.productDutyList=res.result.productDutyList
          }
        })
      },
      addProductPlanAxios(query){
        addProductPlan(Object.assign({productId:this.$route.query.id},query)).then(res=>{
          if(res.code==='100100'){
            if(this.currentTitle.indexOf('新增')!==-1){
              this.$message.success('新增计划数据成功')
            }else{
              this.$message.success('编辑计划数据成功')
            }
            window.history.back(-1);
          }
        })
      },
      planHandle(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.planForm.banner){
              this.addProductPlanAxios(this.planForm)
            }else{
              this.$message.error('产品详情banner图未上传')
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      handleDelete(index){
        this.planForm.productDutyList.splice(index, 1)
      },
      handleAdd(index){
        let arr={
          name:'',
          value:'',
          detail:''
        };
        this.planForm.productDutyList.splice(index+1,0,arr)
      },
      //上传图片操作
      handleAvatarSuccess(res, file, fileList) {
        if (res.code === '100100') {
          this.fileLoad = fileList;
          this.planForm.banner = res.result;
        }
      },
      //上传图片前的操作
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isLt2M;
      },
      //移除图片
      handldAvatarRemove() {
        this.planForm.banner = '';
        this.fileLoad = [];
      }
    }
  }
</script>

<style scoped lang="scss">
	.form{
		padding: 30px 0;
	}
	/deep/ .el-textarea__inner{
		min-height: 100px!important;
	}
	.el-icon-content{
		i{
			font-size:25px;
			color:#409EFF;
			cursor:pointer;
		}
		i:nth-of-type(1){
			margin-right:15px;
		}
	}
  .showLogo{
    width: 148px;
    height: 148px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    border-radius: 8px;
    i{
      position: absolute;
      font-size: 22px;
      top: 0;
      right: 0;
      display: none;
    }
    &:hover{
      i{
        display: block;
      }
    }
    img{
      width: 100%;
      height: 100%;
    }
  }
</style>
