<template>
  <div class="list">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="list">列表</el-menu-item>
      <el-menu-item index="isDeliver">已发货</el-menu-item>
      <el-menu-item index="noDeliver">未发货</el-menu-item>
    </el-menu>
    <el-row class="tool-bar">
      <el-col :span="12">
        <div class="left">
          <el-input placeholder="请输入内容" v-model="searchText" class="input-with-select" style="width:600px;">
            <el-select v-model="searchType" slot="prepend" placeholder="请选择" style="width:120px;">
              <el-option
                v-for="item in searchTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="right">
          <el-button @click="add" type="primary">
            添加
          </el-button>
          <el-button @click="exportAll" type="primary">
            导出全部
          </el-button>
          <el-button @click="exportSelection" type="primary">
            导出选中项
          </el-button>
          <el-button @click="delSelection" type="danger">
            删除选中项
          </el-button>
        </div>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      stripe
      @selection-change="handleSelectionChange"
      style="width: 100%">
      <el-table-column
        fixed="left"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="order_id"
        sortable
        width="110"
        label="单号">
      </el-table-column>
      <el-table-column
        prop="name"
        sortable
        width="110"
        label="客户姓名">
      </el-table-column>
      <el-table-column
        prop="telephone"
        width="180"
        label="联系方式">
      </el-table-column>
      <el-table-column
        prop="address"
        width="200"
        label="地址">
      </el-table-column>
      <el-table-column
        prop="type"
        sortable
        label="类型">
      </el-table-column>
      <el-table-column
        prop="count"
        sortable
        label="共计">
        <template slot-scope="scope">
          <p>{{scope.row.count}}{{scope.row.countUnit}}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="amount"
        sortable
        width="110"
        label="付款金额">
      </el-table-column>
      <el-table-column
        prop="date"
        sortable
        width="150"
        label="预计发货日期">
      </el-table-column>
      <el-table-column
        prop="trick"
        width="100"
        label="发票信息">
      </el-table-column>
      <el-table-column
        prop="enter"
        sortable
        width="110"
        label="填表人">
      </el-table-column>
      <el-table-column
        width="180"
        label="内容">
        <template slot-scope="scope">
          <p v-for="detail in scope.row.details" :key="detail.id">{{detail.sex}}{{detail.weight}}两{{detail.number}}{{detail.unit}}{{detail.isBundle}}{{detail.specs}}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="发货信息">
        <template slot-scope="scope">
          <p>{{scope.row.isDeliver == '已发货' ? scope.row.deliverInfo : '未发货'}}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        show-overflow-tooltip
        label="备注">
      </el-table-column>
      <el-table-column
        label="操作"
        width="100">
        <template slot-scope="scope">
          <p v-if="scope.row.isDeliver!='已发货'">
          <el-button @click="deliverItem(scope.row.id)" type="text" size="small">发货</el-button>
          <el-button @click="editItem(scope.row.id)" type="text" size="small">修改</el-button>
          </p>
          <p>
          <el-button @click="copyItem(scope.row.id)" type="text" size="small">复制</el-button>
          <el-button @click="delItem(scope.row.id)" type="text" style="color:red;" size="small">删除</el-button>
          </p>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import utils from '../../common/utils'

  export default {
    name: 'list',
    components: {  },
    created: function () {
      let query = this.$route.params.query;
      if(query){
          this.tableData = utils.query((item) => {
            if(item[query.key] == query.value) return true;
            return false;
          });
      }else{
        this.tableData = utils.readData();
      }
      let d = utils.dateFormat('YYmmdd',new Date());

    },
    methods: {
      //删除
      delItem(id){
        this.tableData = utils.delItem(id);
      },
      //添加
      add(){
        this.$router.push({name:'add'});
        // let item = utils.getItem(id);
      },
      //修改
      editItem(id){
        this.$router.push({name:'add',params: {id:id}});
      },
      //确认发货
      confirmDeliver(id,info){
        let that = this;
        this.$confirm(info, '确认物流信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '修改',
          type: 'info'
        }).then(() => {
          this.tableData = utils.deliverItem(id,info);
          this.$message({
            type: 'success',
            message: '已发货'
          });
        }).catch(action=>{
          if(action == 'cancel'){
            that.deliverItem(id);
          }else{
            this.$message({
              type: 'fail',
              message: '取消发货'
            });
          }
        });
      },
      //发货
      deliverItem(id){
        let that = this;
        this.$prompt('请输入物流信息', '发货', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          that.confirmDeliver(id,value);
        }).catch(() => {
          this.$message({
            type: 'fail',
            message: '取消发货'
          });
        });
      },
      //选择复选框
      handleSelectionChange(val){
        this.multipleSelection = val;
      },
      //导出所有
      exportAll(){
        let datas = utils.readData();
        let file = utils.saveExcel(datas);
        utils.openExplore(file);
      },
      //导出选中项
      exportSelection(){
        if(!this.multipleSelection || this.multipleSelection.length == 0) return;
        let datas = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          const item = this.multipleSelection[i];
          datas.push(item);
        }
        let file = utils.saveExcel(datas);
        utils.openExplore(file);
      },
      delSelection(){
        if(!this.multipleSelection || this.multipleSelection.length == 0) return;
        let itemIds = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          const item = this.multipleSelection[i];
          itemIds.push(item.id);
        }
        this.tableData = utils.delItems(itemIds);
      },
      copyItem(id){
        let item = utils.getItem(id);
        this.tableData = utils.addItem(item);
      },
      search(){
        if(this.searchText == ''){
          this.tableData = utils.readData();
        }else{
          this.tableData = utils.query((item) => {
            var reg = new RegExp(this.searchText);
            if (reg.test(item[this.searchType])) {
              return true;
            }
            if(item[this.searchType] == this.searchText) return true;
            return false;
          });
        }
      },
      handleSelect(key, keyPath) {
        if(key == 'list'){
          this.tableData = utils.readData();
        }else if(key == 'isDeliver'){
          this.tableData = utils.query((item) => {
            if(item.isDeliver == '已发货') return true;
            return false;
          });
        }else if(key == 'noDeliver'){
          this.tableData = utils.query((item) => {
            if(item.isDeliver != '已发货') return true;
            return false;
          });
        }
      }
    },
    data() {
      return {
        searchTypeOptions:[
          {
            value: 'order_id',
            label: '订单号'
          },
          {
            value: 'name',
            label: '客户姓名'
          },
          {
            value: 'date_created',
            label: '下单日期'
          },
          {
            value: 'date',
            label: '发货日期'
          },
          {
            value: 'telephone',
            label: '电话'
          },
          {
            value: 'address',
            label: '地址'
          },
          {
            value: 'type',
            label: '类型'
          },
          {
            value: 'enter',
            label: '填表人'
          },
        ],
        tableData: [],
        multipleSelection: '',
        searchText:'',
        searchType:'order_id',
        activeIndex: 'list',
        searchDate: '',
      }
    }
  }
</script>

<style>
.list{
  position: relative;
  margin: 10px;
}
.tool-bar{
  padding-right: 20px;
  margin: 0 0 10px 0;
}
.tool-bar .right{
  text-align: right;
}
.tool-bar .left{
  display: inline-flex;
  text-align: left;
}
.tool-bar .el-button{
  margin:0 10px;
}
</style>
