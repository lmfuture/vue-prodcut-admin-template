<template>
  <transition name="fade-transform" mode="out-in">
    <div class="request-loading-component" v-if="requestLoading">
      <i class="el-icon-loading" style="color: rgb(64, 158, 255)"></i>
    </div>
  </transition>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'RequestLoading',
    data(){
      return {
        fullscreenLoading: false
      }
    },
    computed: {
      ...mapGetters([
        'requestLoading'
      ])
    },
    methods:{

    }
  }
</script>

<style lang='scss' scoped>
  .request-loading-component {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(48, 65, 86, 0.2);
    font-size: 150px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    z-index: 999999;
  }
</style>
