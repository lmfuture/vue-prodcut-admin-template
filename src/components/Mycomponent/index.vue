<template>
	<div>
		<h1>{{msg}}</h1> 
		<el-button type='success' @click='sendParam'>发送数据</el-button>
		<el-button type='primary' @click='changeData1'>改变data1</el-button>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				msg:"我是自定义的第一个组建",
				param1:'来自子组建的数据'
			}
		},
		props:[
			'data1',
			'data2'
		],
		created(){
		},
		methods:{
			sendParam(){
				this.$emit('parentEvent',this.param1)
			},
			changeData1(){
				this.$emit('update:parentData1','更新过后的')
			}
		}
	}
</script>