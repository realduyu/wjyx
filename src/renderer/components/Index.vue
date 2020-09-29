<template>
  <div id="wrapper">
    <div class="title">
      <img id="logo" src="~@/assets/wjyx.png" style="max-height:40px" alt="electron-vue">
      <p>
        我家有蟹（泰州）订单处理系统
      </p>
    </div>
    <div>
    <router-view>
    </router-view>
    </div>
  </div>
</template>

<script>
  import utils from '../../common/utils'

  export default {
    name: 'index',
    components: {  },
    created:function(){
    },
    methods: {
      handleSelect(key, keyPath) {
        this.$router.replace({name:key})
        console.log(key, keyPath);
      }
    },
    data:function(){
      return{
        activeIndex: 'list',
      }
    }
  }
</script>

<style>
.el-row{
  line-height: 50px;
}
.title{
  text-align: center;
}
.title p{
  display: inline;
  font-size: 24px;
}
.title *{
  vertical-align: middle;
}
</style>
