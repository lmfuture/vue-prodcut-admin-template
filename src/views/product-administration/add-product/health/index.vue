<template>
	<div>
		<div class="isHealth">
			<span style="margin-right: 30px;">是否健康</span>
			<el-radio v-model="radio" label="0">是</el-radio>
  			<el-radio v-model="radio" label="1">否</el-radio>
		</div>

		<div v-show='radio == 0'>
			<el-upload
		        class="avatar-uploader-xuzhi"
		        :action=baseUpload
		    	:with-credentials=true
		        accept='.jpg,.jpeg,.gif,.bmp,.png'
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
			<el-button v-show='productOption=="xinzeng"' type="primary" @click="changeActiveName('third')">上一步</el-button>
			<el-button type="success" @click="changeActiveName()">保 存</el-button>
		    <el-button v-show='productOption=="xinzeng"' type="primary" @click="changeActiveName('fifth')">下一步</el-button>
		</div>
	</div>
</template>

<script>
  import { addHealthNotice , getProductById } from '@/api/product'
  import { toolbarOptions } from '@/utils/getCommonOption'
  import Qs from 'qs'
  export default {
    data(){
		return {
			id:'',
			radio:'0',
			content: '',
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
	                    document.querySelector('.avatar-uploader-xuzhi input').click()
	                  } else {
	                    this.quill.format('image', false);
	                  }
	                }
	              }
	            }
	          }
	        },
	        productOption:''
		}
	},
	created(){
		this.productOption = localStorage.getItem('productOption');
		this.baseUpload = process.env.VUE_APP_BASE_API+'/admin/upload'
		this.id = this.$route.params.id
		getProductById({id:this.id}).then(res => {
			this.radio = res.result.healthStatus.toString();
			this.content = res.result.healthNotice;
		})
	},
	computed:{
		editor() {
            return this.$refs.myQuillEditor.quill;
        }
	},
	methods: {
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
	      		if(this.radio == '1'){
	      			this.content = ""
	      		}else if((!this.content)){
	      			this.$message.error('产品详情不能为空');
		      		return;
	      		}
	      		
		      	const addData = {
		      		id:this.id,
		      		healthNotice:this.content,
		      		healthStatus:this.radio
		      	}
		      	addHealthNotice(Qs.stringify(addData)).then(res => {
		      		if(res.code == '100100'){
		      			this.$message({
				          message: '保存成功',
				          type: 'success'
				        });
		      		}else{
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
	.isHealth{
		margin-top: 20px;
		margin-bottom: 30px;
	}
</style>
