<template>
  <div id="add-div">
    <div class="header">
      <el-page-header @back="goBack" :content="title">
      </el-page-header>
    </div>
    <div class="form">
      <el-row>
        <el-col :span="3">客户名称：</el-col>
        <el-col :span="8"><el-input v-model="name" style="width: 300px;" placeholder="请输入内容"></el-input></el-col>
        <el-col :span="3">联系方式：</el-col>
        <el-col :span="8"><el-input v-model="telephone" style="width: 300px;" placeholder="请输入内容"></el-input></el-col>
      </el-row>
      <el-row>
        <el-col :span="3">收货地址：</el-col>
        <el-col :span="18"><el-input v-model="address" type="textarea" autosize placeholder="请输入内容"></el-input></el-col>
      </el-row>
      <el-row>
        <el-col :span="3">货品类型：</el-col>
        <el-col :span="20">
          <el-radio  v-model="type" label="礼盒代发">礼盒代发</el-radio>
          <el-radio  v-model="type" label="礼盒零售">礼盒零售</el-radio>
          <el-radio  v-model="type" label="一件代发">一件代发</el-radio>
          <el-radio  v-model="type" label="批发">批发</el-radio>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">添加货品：</el-col>
        <el-col :span="18">
          <detail v-for="detail in details" :key="detail.id" @delete="delDetail" :detail="detail"></detail>
          <el-button @click="addDetail">+</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">&nbsp;
        </el-col>
        <el-col :span="4">
          共计
          <el-input v-model="count" style="width: 160px;">
          <el-select v-model="countUnit" style="width: 60px;" slot="append">
            <el-option
              v-for="item in countUnitOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          </el-input>
        </el-col>
        <el-col :span="6">
          订单实付金额：
          <el-input v-model="amount" style="width: 200px;" type="number" placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :span="3"><el-button @click="computeAmount" type="primary" plain>计算</el-button></el-col>
      </el-row>
      <el-row>
        <el-col :span="3">预计发货日期：</el-col>
        <el-col :span="8">
              <el-date-picker
               style="width: 240px;"
                v-model="date"
                type="date"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">是否需要发票：</el-col>
        <el-col :span="4">
          <el-radio  v-model="isTrick" label="否">否</el-radio>
          <el-radio  v-model="isTrick" label="是">是</el-radio>
        </el-col>
        <template v-if="isTrick == '是'">
        <el-col :span="2">发票信息：</el-col>
        <el-col :span="12"><el-input v-model="trick"  placeholder="请输入内容"></el-input></el-col>
        </template>
      </el-row>
      <el-row>
        <el-col :span="3">备注：</el-col>
        <el-col :span="18"><el-input v-model="remark" type="textarea" placeholder="请输入内容"></el-input></el-col>
      </el-row>
      <el-row>
        <el-col :span="3">填表人：</el-col>
        <el-col :span="8"><el-input v-model="enter" style="width: 240px;" placeholder="请输入内容"></el-input></el-col>
      </el-row>
      <el-row>
        <el-col :span="20" style="text-align: center;">
          <el-button @click="submit()" type="primary">确认</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import utils from '../../common/utils'
  import detail from './Detail'

  export default {
    name: 'add',
    components: { detail },
    created: function () {
      let id = this.$route.params.id;
      console.log('id',id);
      if(id){
        let item = utils.getItem(id);
        this.title = '修改';
        this.id = id;
        this.name = item.name;
        this.type = item.type;
        this.telephone = item.telephone;
        this.address = item.address;
        this.isTrick = item.isTrick;
        this.date = item.date;
        this.trick = item.trick;
        this.amount = item.amount;
        this.enter = item.enter;
        this.remark = item.remark;
        this.countUnit = item.countUnit;
        this.count = item.count;
        this.countKg = item.countKg;
        this.countBox = item.countBox;
        this.details = item.details;
        for (let i = 0; i < this.details.length; i++) {
          const detail = item.details[i];
          this.detailCnt = detail.id > this.detailCnt ? detail.id : this.detailCnt;
        }
        console.log(this.details);
      }else{
        const {  ipcRenderer } = require('electron')
        this.clipboardAddress()
        ipcRenderer.on('on', (e, data) => {
          this.clipboardAddress()
        })
        this.addDetail()
      }
    },
    computed:{
    },
    methods: {
      clipboardAddress(){
        if(this.address || this.telephone) return;
        if(this.isClipboardAddress) return;
        const {clipboard} = require('electron')
        var clipText = clipboard.readText()
        if(!clipText || clipText == '') return;
        let that = this;
        this.isClipboardAddress = true;
        let addressInfo = utils.parseAddress(clipText);
        if(addressInfo.address || addressInfo.phone){
          let addStr = '';
          if(addressInfo.name){
            addStr += '姓名：'+addressInfo.name+'    ';
          }
          if(addressInfo.phone){
            addStr += '电话：'+addressInfo.phone+'    ';
          }
          if(addressInfo.address){
            addStr += '地址：'+addressInfo.address+'    ';
          }
          this.$confirm(addStr, '确认地址信息', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            that.isClipboardAddress = false;
            this.address = addressInfo.address;
            this.telephone = addressInfo.phone;
            this.name = addressInfo.name;
          }).catch(action=>{
            that.isClipboardAddress = false;
          });
        }
      },
      fillAddressInfo(info){

      },
      computeAmount:function(){
        let m = 0;
        let count = 0;
        for (let i = 0; i < this.details.length; i++) {
          const detail = this.details[i];
          m += detail.amount ? parseFloat(detail.amount) : 0;
          count += detail.number ? parseInt(detail.number) : 0
        }
        this.amount = m;
        this.count = count;
      },
      open (link) {
        alert(utils.getTempDir());
        // this.$electron.shell.openExternal(link)
      },
      goBack(url){
        this.$router.go(-1)
      },
      addDetail(){
        this.detailCnt++;
        this.details.push({
          id:this.detailCnt,
          sex:'公',
          unit:'斤',
          number:'0',
          weight:'0',
          isBundle:'不捆',
          specs:'16规',
        });
        console.log(this.details);
      },
      delDetail(id){
        console.log(id);
        let ds = [];
        for (let i = 0; i < this.details.length; i++) {
          const element = this.details[i];
          if(id != element.id) ds.push(element);
        }
        this.details = ds;
      },
      submit(){
        console.log(this.date);
        let item = {};
        item.name = this.name;
        item.type = this.type;
        item.telephone = this.telephone;
        item.address = this.address;
        item.isTrick = this.isTrick;
        item.date = this.date;
        item.trick = this.trick;
        item.amount = this.amount;
        item.enter = this.enter;
        item.remark = this.remark;
        item.countUnit = this.countUnit;
        item.count = this.count;
        item.countKg = this.countKg;
        item.countBox = this.countBox;
        item.details = [];
        for (let i = 0; i < this.details.length; i++) {
          const detail = this.details[i];
          if(detail.amount && detail.amount != 0 && detail.amount != '') item.details.push(detail);
        }
        if(this.id){
          utils.changeItem(this.id,item);
        }else{
          utils.addItem(item);
        }
        console.log(utils.readData());
        this.$router.replace('/list')
      }
    },
    data:function () {
      return {
        countUnitOptions:[
          {
            value: '斤',
            label: '斤'
          },
          {
            value: '盒',
            label: '盒'
          },
        ],
        isClipboardAddress:false,
        title:'添加',
        id:'',
        name:'',
        type:'',
        telephone:'',
        address:'',
        isTrick:'否',
        date:'',
        trick:'',
        amount:'',
        enter:'',
        remark:'',
        countUnit:'斤',
        count:0,
        detailCnt:0,
        details:[],
      }
    }
  }
</script>

<style>
#add-div{
  max-width: 1500px;
  position: relative;
  margin: 50px auto;
  padding-left: 50px;
}
#add-div .header{
  margin: 50px auto;
}
</style>
