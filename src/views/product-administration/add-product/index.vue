<template>
  	 <el-tabs v-model="activeName" @tab-click="handleClick">
	    <el-tab-pane label="基础信息" name="first">
       <BaseInfo @getBaseInfo='getBaseInfo' @changeActiveName='updateActiveName' @tabStatus='changeTabStatus' :isDisabled='isDisabled' v-if="isFirst"/> 
      </el-tab-pane>
	    <el-tab-pane label="图片信息" name="second" :disabled="isDisabled">
       <ThumbnailInfo @changeActiveName='updateActiveName'  v-if="isSecond"/> 
      </el-tab-pane>
	    <el-tab-pane label="投保须知" name="third" :disabled="isDisabled">
       <Notice @changeActiveName='updateActiveName'  v-if="isThird"/> 
      </el-tab-pane>
	    <el-tab-pane label="健康告知" name="fourth"  :disabled="isDisabled">
        <Health @changeActiveName='updateActiveName'  v-if="isFourth"/>
      </el-tab-pane>
	    <el-tab-pane label="您拥有的权利" name="fifth" :disabled="isDisabled">
       <Right @changeActiveName='updateActiveName'  v-if="isFifth"/> 
      </el-tab-pane>
	    <el-tab-pane label="常见问题" name="sixth" :disabled="isDisabled">
       <Problems @changeActiveName='updateActiveName' v-if="isSixth"/> 
      </el-tab-pane>
	    <el-tab-pane label="客户须知" name="seventh" :disabled="isDisabled">
       <CustomerNotice v-if='isSeventh'/> 
      </el-tab-pane>
	  </el-tabs>
</template>
<script>
	import BaseInfo from './product-baseInfo/index'
  import ThumbnailInfo from './thumbnail-info/index'
  import Notice from './notice/index'
  import Health from './health/index'
  import Statement from './statement/index'
  import Right from './right/index'
  import Problems from './problems/index'
  import CustomerNotice from './customer-notice/index'
  import { productTabs } from '@/mixins/index'
  export default {
    data() {
      return {
        activeName: 'first',
        isDisabled:true,
      }
    },
    mixins: [productTabs],
    components:{
      BaseInfo,
      ThumbnailInfo,
      Notice,
      Health,
      Statement,
      Right,
      Problems,
      CustomerNotice
    },
    created(){
      if(this.$route.params.id != 0){
        this.isDisabled = false
      }
    },
    methods: {
      changeTabStatus(status){
        this.isDisabled = status.status;
      },
      getBaseInfo(data){

      }
    }
  };
</script>