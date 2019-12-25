<template>
	<div>
		<div class="common-title">移动端产品缩略图</div>
		<el-upload
		  :action=baseUpload
		  list-type="picture-card"
		  :on-preview="handlePictureCardPreview"
		  :limit='limit'
		  :with-credentials=true
		  accept='.jpg,.jpeg,.gif,.bmp,.png'
		  :on-exceed='moreMun'
		  :before-upload='uploadBefore'
		  :file-list='fileList'
		  :on-success='uploadSuccess' :on-remove='handleRemove'>
		  <i class="el-icon-plus" ></i>
		</el-upload>
		<div slot="tip" class="el-upload__tip">图片支持jpg/jpeg/gif/bmp/png格式,图片尺寸建议为140x140px或以上,图片大小建议为2M以下</div>
		<el-dialog :visible.sync="dialogVisible">
		  <img width="100%" :src="dialogImageUrl" alt="">
		</el-dialog>

		<div class="common-title" style="margin-top: 20px;">产品详情</div>
		<div>
			<el-upload
		        class="avatar-uploader"
		        accept='.jpg,.jpeg,.gif,.bmp,.png'
		        :action=baseUpload
		        :with-credentials=true
		        :show-file-list="false"
		        :on-success="editor_uploadSuccess"
		        :on-error="editor_uploadError"
		        :before-upload="editor_beforeUpload">
		    </el-upload>
			<quill-editor
	            v-model="content" 
	            ref="myQuillEditor" 
	            :options="editorOption" 
	            @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
	            @change="onEditorChange($event)">
	        </quill-editor>
		</div>
		<div style="text-align: center;padding-top: 30px;margin-bottom: 50px;">
			<el-button v-show='productOption=="xinzeng"' type="primary" @click="changeActiveName('first')">上一步</el-button>
			<el-button type="success" @click="changeActiveName()">保 存</el-button>
		    <el-button v-show='productOption=="xinzeng"' type="primary" @click="changeActiveName('third')">下一步</el-button>
		</div>
	</div>
</template>

<script>
	import { addInsuranceNotes , getProductById , addPhotoInfo } from '@/api/product'
	import { toolbarOptions } from '@/utils/getCommonOption'
	import Qs from 'qs'
	import { mapGetters } from 'vuex'
	import store from '@/store/index'
	export default {
		data(){
			return {
				dialogImageUrl: '',
				isShowAddPicture:true,
		        dialogVisible: false,
		        disabled: false,
		        limit:1,
		        content: '',
            	id:'',
            	fileList:[],
            	baseUpload:'',
            	//富文本编辑器上传辅助
            	quillUpdateImg: false,
            	editorOption: {
		        placeholder: '',
		        theme: 'snow',  // or 'bubble'
		        modules: {
		            toolbar: {
		              container: toolbarOptions,
		              handlers: {
		                'image': function (value) {
		                  if (value) {
		                    // 触发input框选择图片文件
		                    document.querySelector('.avatar-uploader input').click()
		                  } else {
		                    this.quill.format('image', false);
		                  }
		                }
		              }
		            }
		          }
		        },
		        productOption:''//对下一步按钮进行显示隐藏
			}
		},
		created(){
			this.productOption = localStorage.getItem('productOption');
			this.baseUpload = process.env.VUE_APP_BASE_API+'/admin/upload'
			this.id = this.$route.params.id
			getProductById({id:this.id}).then(res => {
				if(res.result.thumbnail){
					this.fileList.push({url:res.result.thumbnail})
					this.dialogImageUrl = res.result.thumbnail;
					document.getElementsByClassName('el-upload--picture-card')[0].style.display = 'none'
				}
				if(res.result.detail){
					this.content = res.result.detail
				}
			})
		},
		mounted(){

		},
		computed:{
			editor() {
	            return this.$refs.myQuillEditor.quill;
	        }
		},
		methods: {
		  uploadBefore(file){
		  	const isLt2M = file.size / 1024 / 1024 < 2;
	        if (!isLt2M) {
	          this.$message.error('上传产品缩略图片大小不能超过 2MB!');
	        }
	        return isLt2M;
		  },
		  uploadSuccess(response, file, fileList){
		  	console.log()
		  	this.dialogImageUrl = response.result;
		  	document.getElementsByClassName('el-upload--picture-card')[0].style.display = 'none'
		  },
	      handleRemove(file, fileList) {
	        document.getElementsByClassName('el-upload--picture-card')[0].style.display = 'block'
          this.dialogImageUrl=''
	      },
	      handlePictureCardPreview(file) {
	        this.dialogImageUrl = file.url;
	        this.dialogVisible = true;
	      },
	      moreMun(){
	      	this.$message({
	          message: '只能上传一张产品缩略图',
	          type: 'error'
	        });
	      },
	      onEditorReady(editor) { // 准备编辑器
	      },
          onEditorBlur(){}, // 失去焦点事件
          onEditorFocus(){}, // 获得焦点事件
          onEditorChange(){}, // 内容改变事件
          saveHtml:function(event){
	        alert(this.content);
	      },
	      // 富文本图片上传前
	      editor_beforeUpload() {
	        // 显示loading动画
	        this.quillUpdateImg = true
	      },
	 
	      editor_uploadSuccess(res, file) {
	        // res为图片服务器返回的数据
	        // 获取富文本组件实例
	        let quill = this.$refs.myQuillEditor.quill
	        // 如果上传成功
	        if (res.code == '100100' ) {
	          // 获取光标所在位置
	          let length = quill.getSelection().index;
	          // 插入图片  res.url为服务器返回的图片地址
	          quill.insertEmbed(length, 'image', res.result)
	          // 调整光标到最后
	          quill.setSelection(length + 1)
	        } else {
	          this.$message.error('图片插入失败')
	        }
	        // loading动画消失
	        this.quillUpdateImg = false
	      },
	      // 富文本图片上传失败
	      editor_uploadError() {
	        // loading动画消失
	        this.quillUpdateImg = false
	        this.$message.error('图片插入失败')
	      },
	      changeActiveName(step) {
	      	if(!step){
	      		if(!this.dialogImageUrl){
		      		this.$message.error('请上传产品缩略图片');
		      		return;
		      	}
		      	if(!this.content){
		      		this.$message.error('产品详情不能为空');
		      		return;
		      	}
		      	let addData = {
		      		detail:this.content,
		      		thumbnail:this.dialogImageUrl,
		      		id:this.id
		      	}
		      	addPhotoInfo(Qs.stringify(addData)).then(res => {
		      		if(res.code == '100100'){
		      			this.$message({
				          message: '保存成功',
				          type: 'success'
				        });
		      		}else {
						this.$message.error('保存失败');
		      			return;
		      		}
		      	})
	      	}else{
	      		this.$emit('changeActiveName',step)
	      	}
	      	
	      }
	    }
	}
</script>

<style scoped>
	.el-upload__tip{
		margin-top: 10px;
	}
</style>
