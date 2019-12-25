<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <Mycomponent :parentData1.sync='data1' :data2='22' @parentEvent='childParam'/>
    <br/>
    <el-button type='success' @click='getData1("改变的数据")'>改变vuexdata1</el-button>
  </div>

</template>

<script>
  import { mapGetters , mapActions} from 'vuex'
  import Mycomponent from '@/components/Mycomponent/index'

  export default {
    name: 'Dashboard',
    data(){
      return {
        data1:'1111'
      }
    },
    computed: {
      ...mapGetters([
        'name'
      ])
    },
    components:{
      Mycomponent
    },
    created(){

    },
    methods:{
      ...mapActions('common',[
        'getData1'
      ]),
      errorHandler() {
        return true
      },
      childParam(data){
        console.log(data)
      }
    },
    watch:{
      data1(newVal,oldVal){
        console.log(newVal)
      }
    }

  }
</script>

<style lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }
</style>
