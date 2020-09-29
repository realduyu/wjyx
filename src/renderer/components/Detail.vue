<template>
  <el-row>
    <el-col :span="24">
      <el-select v-model="detail.sex" style="width: 80px;">
        <el-option
          v-for="item in sexOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input v-model="detail.weight" style="width: 60px;">
      </el-input>
      两
      <el-input v-model="detail.number" style="width: 110px;">
      <el-select v-model="detail.unit" style="width: 60px;" slot="append">
        <el-option
          v-for="item in unitOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      </el-input>
      <el-select v-model="detail.isBundle" style="width: 80px;">
        <el-option
          v-for="item in isBundleOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="detail.specs" style="width: 80px;">
        <el-option
          v-for="item in specsOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      &nbsp;&nbsp;
      <el-input v-model="detail.price" style="width: 60px;" placeholder="单价"></el-input>
      <el-input v-model="detail.pack" style="width: 60px;" placeholder="包装"></el-input>
      <el-input v-model="detail.freight" style="width: 60px;" placeholder="运费"></el-input>
      <el-input v-model="detail.bundle" style="width: 60px;" placeholder="捆扎"></el-input>
      <el-input v-model="detail.other" style="width: 60px;" placeholder="其他"></el-input>&nbsp;
      <el-input v-model="amount" style="width: 80px;" placeholder="总价" :disabled="true"></el-input>
      &nbsp;&nbsp;&nbsp;
      <el-button @click="del" type="danger" >移除</el-button>
    </el-col>

  </el-row>
</template>

<script>

  export default {
    name: 'detail',
    components: { 

    },
    props: [
      'detail'
    ],
    computed:{
      amount:function(){
        let detail = this.detail;
        let m = 0;
        m = ((detail.price ? parseFloat(detail.price) : 0) * (detail.number ? parseInt(detail.number) : 0)) + (detail.pack ? parseFloat(detail.pack) : 0) + 
                              (detail.freight ? parseFloat(detail.freight) : 0) + (detail.bundle ? parseFloat(detail.bundle) : 0) + 
                              (detail.other ? parseFloat(detail.other) : 0);
        if(m > 0) this.detail.amount = m;
        else this.detail.amount = '';
        return this.detail.amount ? this.detail.amount+'元' : '';
      }
    },
    watch:{
      detail:function(){
        this.$emit('detail', this.detail)
      },deep:true
    },
    methods: {
      del(){
        this.$emit("delete", this.detail.id);
      }
    },
    data:function () {
      return {
        sexOptions:[
          {
            value: '公',
            label: '公蟹'
          },
          {
            value: '母',
            label: '母蟹'
          },
          {
            value: '',
            label: '随机'
          },
        ],
        unitOptions:[
          {
            value: '斤',
            label: '斤'
          },
          {
            value: '只',
            label: '只'
          },
        ],
        isBundleOptions:[
          {
            value: '不捆',
            label: '不捆'
          },
          {
            value: '捆',
            label: '捆'
          },
        ],
        specsOptions:[
          {
            value: '16规',
            label: '16规'
          },
          {
            value: '27规',
            label: '27规'
          },
          {
            value: '38规',
            label: '38规'
          },
          {
            value: '49规',
            label: '49规'
          },
        ],
        result:{},
      }
    }
  }
</script>

<style>
</style>
