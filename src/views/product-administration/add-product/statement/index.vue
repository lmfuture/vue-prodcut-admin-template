<template>
	<div>
		<div class="common-title">投保须知</div>
		<quill-editor
	        v-model="content" 
	        ref="myQuillEditor" 
	        :options="editorOption" 
	        @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
	        @change="onEditorChange($event)">
	    </quill-editor>
	    <div style="text-align: center;padding-top: 30px;margin-bottom: 50px;">
			<el-button type="primary" @click="">保 存</el-button>
		    <el-button @click="changeActiveName()">下一步</el-button>
		</div>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				content: '',
            	editorOption: {}
			}
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
	      changeActiveName() {
	      	this.$emit('changeActiveName','sixth')
	      }
	    }
	}
</script>

<style scoped>
	
</style>