<template>
	<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
	  <el-form-item label="产品名称" prop="name">
	  	<el-col :span='8'>
	  		<el-input v-model="ruleForm.name"></el-input>
	  	</el-col>
	  </el-form-item>
	  <el-form-item label="产品优势" prop="advantages">
	  	<el-col :span='8'>
	  		<el-input v-model="ruleForm.advantages"></el-input>
	  	</el-col>
	  </el-form-item>
	  <el-form-item label="产品code" prop="localCode">
	  	<el-col :span='8'>
	  		<el-input v-model="ruleForm.localCode"></el-input>
	  	</el-col>
	  </el-form-item>
	  <el-form-item label="产品简介" prop="introduce">
	  	<el-col :span='8'>
	  		<el-input v-model="ruleForm.introduce"></el-input>
	  	</el-col>
	  </el-form-item>
	  <el-form-item label="所属保险公司" prop="insuranceName" >
	    <el-select v-model="ruleForm.insuranceName" @change='insuranceChange' placeholder="请选择">
		    <el-option
		      v-for="item in select_insurance_options"
		      :key="item.value"
		      :label="item.label"
		      :value="item.value">
		    </el-option>
		</el-select>
	  </el-form-item>

	  <el-form-item label="所属一级分类" prop="firstClassName">
	    <el-select v-model="ruleForm.firstClassName" @change='parentChange' placeholder="请选择所属一级分类">
		    <el-option
		      v-for="item in select_classificationOne_options"
		      :key="item.value"
		      :label="item.label"
		      :value="item.value">
		    </el-option>
	    </el-select>
	  </el-form-item>

	  <el-form-item label="所属二级分类" prop="secondClassName">
	    <el-select v-model="ruleForm.secondClassName" @change='childChange' placeholder="请选择所属二级分类">
	      <el-option
		      v-for="item in select_classificationTwo_options"
		      :key="item.value"
		      :label="item.label"
		      :value="item.value">
		    </el-option>
	    </el-select>
	  </el-form-item>

	  <el-form-item label="保险类型" prop="type">
	    <el-radio-group v-model="ruleForm.type">
	      <el-radio label="2">长期险</el-radio>
	      <el-radio label="1">短期险</el-radio>
	    </el-radio-group>
	  </el-form-item>

	  <el-form-item label="险种类型" prop="riskType">
	    <el-radio-group v-model="ruleForm.riskType">
	      <el-radio label="1">个险</el-radio>
	      <el-radio label="2">团险</el-radio>
	    </el-radio-group>
	  </el-form-item>

	  <el-form-item label="宽限期" prop="kxDays">
	  	<el-col :span='8'>
	  		<el-input placeholder="请输入宽限期天数" v-model="ruleForm.kxDays">
			   <template slot="append">天</template>
			</el-input>
	  	</el-col>
	  </el-form-item>

	  <el-form-item label="犹豫期" prop="considerDays">
	  	<el-col :span='8'>
	  		<el-input placeholder="请输入犹豫期天数" v-model="ruleForm.considerDays">
			   <template slot="append">天</template>
			</el-input>
	  	</el-col>
	  </el-form-item>

	  <el-form-item label="提前续保天数" prop="renewalBeforeDays">
	  	<el-col :span='8'>
	  		<el-input placeholder="请输入提前续保天数" v-model="ruleForm.renewalBeforeDays">
			   <template slot="append">天</template>
			</el-input>
	  	</el-col>
	  </el-form-item>

	  <el-form-item label="见费标准" prop="seeFees">
	    <el-radio-group v-model="ruleForm.seeFees">
	      <el-radio label="1">见费</el-radio>
	      <el-radio label="0">非见费</el-radio>
	    </el-radio-group>
	  </el-form-item>

	  <el-form-item label="起始价格" prop="priceStart">
	  	<el-col :span='8'>
	  		<el-input placeholder="请输入起始价格" v-model="ruleForm.priceStart">
			   <template slot="append">元</template>
			</el-input>
	  	</el-col>
	  </el-form-item>

	  <el-form-item style='margin-top: 20px;'>
	  	<el-button type='success' @click="changeActiveName()">保 存</el-button>
	    <el-button type='primary' @click="changeActiveName('second')" v-show='!isDisabled && productOption=="xinzeng"'>下一步</el-button>
	  </el-form-item>
	</el-form>
</template>

<script>
  import { addProduct , getCompany , getFirstClass , getSecondClass , getProductByConditions , getProductById } from '@/api/product';
  import { getCommonOption } from '@/utils/getCommonOption'
  import Qs from 'qs'
  import { mapActions } from 'vuex'
  import store from '@/store/index'
  export default {
    data() {
      return {
        ruleForm: {
          id:'',
          name: '',//产品名称
          advantages:'',//产品优势
          introduce:'',//产品描述
          localCode:'',

          insuranceName:"",//保险公司名称
          
          insuranceId:'',//保险公司id

          type: '',
          riskType:'',

          firstClassName:'',//一级分类
          
          firstClassId:'',

          secondClassName:'',//二级分类
          
          secondClassId:'',

          kxDays:'',
          considerDays:'',
          renewalBeforeDays:'',
          // observationPeriod:'',
          seeFees:'',
          priceStart:'',
          productOption:''//对下一步按钮进行显示隐藏
        },
        select_insurance_options:[],
        select_classificationOne_options:[],
        select_classificationTwo_options:[],
        rules: {
          name: [
            { required: true, message: '请输入产品名称', trigger: 'blur' }
          ],
          advantages: [
            { required: true, message: '请输入产品标签（如果多项则使用( | )间隔', trigger: 'blur' }
          ],
          localCode: [
            { required: true, message: '请输入产品code', trigger: 'blur' }
          ],
          introduce: [
            { required: true, message: '请输入产品描述', trigger: 'blur' }
          ],
          insuranceName: [
            { required: true, message: '请选择保险公司', trigger: 'change' }
          ],
          firstClassName: [
            { required: true, message: '请选择所属一级分类', trigger: 'change' }
          ],
          secondClassName: [
            { required: true, message: '请选择所属二级分类', trigger: 'change' }
          ],
          type: [
            { required: true, message: '请选择保险类型', trigger: 'change' }
          ],
          riskType: [
            { required: true, message: '请选择险种类别', trigger: 'change' }
          ],
          kxDays: [
            { required: true, message: '请输入宽限期天数', trigger: 'blur' }
          ],
          considerDays: [
            { required: true, message: '请输入犹豫期天数', trigger: 'blur' }
          ],
          renewalBeforeDays: [
            { required: false, message: '请输入提前续保天数', trigger: 'blur' }
          ],
          retaUrl: [
            { required: true, message: '请选择见费标准', trigger: 'change' }
          ],
          priceStart:[
            { required: true, message: '请输入起始价格', trigger: 'blur' }
          ]
        }
      };
    },
    props:['isDisabled'],
    created(){
    	this.productOption = localStorage.getItem('productOption');
    	let that = this;
    	let productId = that.$route.params.id;
    	//获取所有保险公司
	    getCommonOption(getCompany(),that.select_insurance_options);
	    //获取一级分类
	    getCommonOption(getFirstClass(),that.select_classificationOne_options);

	    //查询产品基本信息
    	if(productId != 0){
			that.ruleForm.id = productId;
			getProductById({id:productId}).then(res => {
				//默认加载二级列表
				getCommonOption(getSecondClass({firstClassId:res.result.firstClassId}),that.select_classificationTwo_options);
				//将baseInfo存到store中
				this.getBaseInfo(res.result);
				setTimeout(function(){
					for(let i in res.result){
						that.ruleForm[i] = res.result[i].toString();
						//根据ID查询保险公司
						if(i == 'insuranceId'){
							that.select_insurance_options.map(item => {
							    if(item.value == that.ruleForm.insuranceId){
							      that.ruleForm.insuranceName = item.label;
							    }
							})
						//根据ID查询一级分类
						}else if(i == 'firstClassId') {
							that.select_classificationOne_options.map(item => {
							    if(item.value == that.ruleForm.firstClassId){
							      that.ruleForm.firstClassName = item.label;
							    }
							})
						//根据ID查询二级分类	
						}else if(i == 'secondClassId') {
							getSecondClass({firstClassId:res.result.firstClassId}).then(respon => {
								respon.result.map(item => {
							    	if(item.id == res.result.secondClassId){
								      that.ruleForm.secondClassName = item.name;
								    }
								})
							})
						}
					}
				}, 0);
			})
		}
    },
    computed:{
    	
    },
    methods: {
    	//获取产品信息
      ...mapActions('productInfo',['getBaseInfo']),
      //保险公司下拉菜单change事件
	  insuranceChange(res){
		this.ruleForm.insuranceId = res;
	  },
	  parentChange(res){
		this.ruleForm.firstClassId = res;
		
		//获取二级分类(清空二级分类)
		this.ruleForm.secondClassId = '';
		this.select_classificationTwo_options.length = 0;
		this.ruleForm.secondClassName = '';
  		getCommonOption(getSecondClass({firstClassId:this.ruleForm.firstClassId}),this.select_classificationTwo_options);
	  },
	  childChange(res){
		this.ruleForm.secondClassId = res;
	  },
      //提交成功后更新父组件activeName
      changeActiveName(step) {
      	if(step){
      		this.$emit('changeActiveName','second')
      	}else{
      		this.$refs['ruleForm'].validate((valid) => {
	          if (valid) {
	            addProduct(Qs.parse(this.ruleForm)).then(res => {
	            	if(res.code == '100100'){
	            		this.$message({
				          message: '保存成功',
				          type: 'success'
				        });
				        this.$emit('tabStatus',{status:false,productId:res.result})
				        if(this.$route.params.id == '0'){
				        	this.$router.push({name:'Addproduct',params:{id:res.result}})
				        }
	            	}else{
		      			this.$message.error('保存失败');
			      		return;
		      		}
	            })
	          } else {
	            console.log('error submit!!');
	            return false;
	          }
	        });
      	}
      }
    }
  }
</script>

<style scoped>
	.demo-ruleForm{
		padding-top: 10px;
	}
</style>
