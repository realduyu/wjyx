import addressParse from './address_parse'
var xlsx = require('node-xlsx');

var fs = require('fs');
var path = require('path');
// Or var xlsx = require('node-xlsx').default;

// console.log('path',__dirname);
// var JSPATH = __dirname+'/js/';
function mkdirsSync(dirname) {  
  //console.log(dirname);  
  if (fs.existsSync(dirname)) {  
      return true;  
  } else {  
      if (mkdirsSync(path.dirname(dirname))) {  
          fs.mkdirSync(dirname);  
          return true;  
      }  
  }  
} 
function getDataDir(){
    let dir = process.env.APPDATA + path.sep +  'wjyx' + path.sep;
    mkdirsSync(dir);
    return dir;
}
function getTempDir(){
    let dir = process.env.TEMP + path.sep + 'wjyx' + path.sep;
    mkdirsSync(dir);
    return dir;
}

function createIfNotExist(file){
    try{
        try {
            fs.accessSync(file, fs.constants.F_OK);
        } catch (err) {
            let p = path.dirname(file);
            mkdirsSync(p);
            fs.writeFileSync(file,'');
        }
    }catch(e){
    }
    return file;
}

function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}

function openExplore(file){
  let cmd = 'explorer.exe /select,"'+file+'"';
  try{
    var exec = require('child_process').exec;
    let log = exec(cmd,{'shell':'cmd.exe'});
  }catch(err){
    alert(err.message+':'+cmd);
  }
}

function parseAddress(str){
  let info = addressParse(str);
  if(['上海市','北京市','天津市','重庆市'].indexOf(info.province) > -1) info.province = '';
  let address = (info.province ? info.province : '') + (info.city?info.city:'') + (info.county?info.county:'') + (info.street?info.street:'') + (info.address?info.address:'');
  let phone = info.phone;
  let name = info.name;
  return {
    address,phone,name
  };
}






function getDataFile(){
    return getDataDir()+'data.json';
}

function getExcelFile(){
    return getDataDir()+'data.xlsx';
}


function readData(){
    let file = getDataFile();
    createIfNotExist(file);
    let data = [];
    try{
        let str = fs.readFileSync(file)
        data = str == '' ? [] : JSON.parse(str);
    }catch(err){
        alert(err.message);
    }
    let objs = [];
    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      if(!d.isDelete || d.isDelete != 1){
        objs.push(d);
      }
    }
    return objs;
}

function saveData(data){
    let file = getDataFile();
    createIfNotExist(file);
    fs.writeFileSync(file, JSON.stringify(data));
}

function addItem(item){
    let data = readData();
    let id = 0;
    let day_id = 0;
    item.date_created = dateFormat('YYmmdd',new Date());
    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      if(d.id > id) id = d.id;
      if(d.date_created != item.date_created) continue;
      if(d.day_id > day_id) day_id = d.day_id;
    }
    item.id = ++id;
    item.day_id = ++day_id;
    item.order_id = ''+item.date_created+((''+item.day_id).padStart(3,'0'));
    item.isDeliver = '未发货';
    item.deliverInfo = '';
    data.push(item);
    saveData(data);
    return data;
}

function getItem(id){
    let data = readData();
    let item = null;
    for (let i = 0; i < data.length; i++) {
        const d = data[i];
        if(d.id== id) item = d;
    }
    return item;
}

function changeItem(id,item){
  let data = readData();
  for (let i = 0; i < data.length; i++) {
      const d = data[i];
      if(d.id== id) {
        data[i] = Object.assign(d,item);
      }
  }
  saveData(data);
  return data;
}

function deliverItem(id,deliverInfo){
  let data = readData();
  for (let i = 0; i < data.length; i++) {
      const d = data[i];
      if(id==d.id) {
        data[i].isDeliver = '已发货';
        data[i].deliverInfo = deliverInfo;
      }
  }
  saveData(data);
  return readData();
}

function delItem(id){
  let data = readData();
  for (let i = 0; i < data.length; i++) {
      const d = data[i];
      if(id==d.id) data[i].isDelete = 1;
  }
  saveData(data);
  return readData();
}

function delItems(ids){
  let data = readData();
  for (let i = 0; i < data.length; i++) {
      const d = data[i];
      if(ids.indexOf(d.id) > -1) data[i].isDelete = 1;
  }
  saveData(data);
  return readData();
}

function query(compare){
    let data = readData();
    let res = [];
    for (let i = 0; i < data.length; i++) {
        if(compare(data[i])) res.push(data[i]);
    }
    return res;
}

function saveExcel(data){
    let excelFile = getExcelFile();
    createIfNotExist(excelFile);
    let header = ['单号','客户姓名','联系方式','地址','类型','总量','付款金额','预计发货日期','是否要发票','发票信息','填表人','货品','备注','是否发货'];

    let exData = [header];
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        let detailStrs = [];
        if(item.details && item.details.length){
          for (let j = 0; j < item.details.length; j++) {
            const detail = item.details[j];
            detailStrs.push(detail.sex + detail.weight+'两' + detail.number+detail.unit+detail.isBundle+detail.specs);
          }
        }
        let count = item.count + item.countUnit;
        
        let row = [
            item.order_id,
            item.name,
            item.telephone,
            item.address,
            item.type ? item.type : '',
            count,
            item.amount,
            item.date,
            item.isTrick ? item.isTrick : '',
            item.trick,
            item.enter,
            detailStrs.join(' '),
            item.remark,
            item.isDeliver,
        ];
        exData.push(row);
    }

    var buffer = xlsx.build([{name: "order", data: exData}]); // Returns a buffer
    fs.writeFileSync(excelFile,buffer);
    return excelFile;
}

export default {
    createIfNotExist,
    getDataDir,
    getDataDir,
    getTempDir,
    dateFormat,
    parseAddress,
    readData,
    saveData,
    addItem,
    getItem,
    saveExcel,
    openExplore,
    query,
    delItems,
    delItem,
    changeItem,
    deliverItem,
  };