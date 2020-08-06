<template>
<div class="c-padding-10">
    <ul class="c-text-both">
        <li v-for="item in tabData" :class="{'tabActive':currentId==item.id}" :key="item.id" @click="handleClick(item)">{{item.name}}</li>
    </ul>
    <!--参数部分-->
    <div class="opContent  c-mt-20 c-mb-10" v-show="currentId==2">
      <div class="c-text-center c-mb-20">单位转换</div>
      <el-form ref="dialogForm" :model="formParams" label-width="70px" size="mini">
        <el-form-item label="选择字段">
          <el-select v-model="formParams.choiceField" placeholder="选择字段" multiple="true">
            <el-option v-for="(item,index) in choiceFieldArr" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位类型">
          <el-select v-model="formParams.unitType" placeholder="单位类型" @change="choiceUnitType($event)">
            <el-option v-for="(item,index) in unitTypeArr" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目标单位">
          <el-select v-model="formParams.converUnit" placeholder="目标单位">
            <el-option v-for="(item,index) in mbUnitArr" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
       <div class="c-text-center">
            <el-button type="primary" size="small" @click="submitFunc">确定</el-button>
        </div>
    </div>
    <!--数据部分-->
    <div class="opContent  c-mt-20 c-mb-10" v-show="currentId==1">
      <el-form ref="dialogForm" :model="formParams1" label-width="90px" size="mini">
        <el-form-item label="选择数据表">
          <el-select v-model="formParams1.data" placeholder="我的数据" value-key="id" @change="selectMydata($event)">
            <el-option v-for="(item,index) in dataList" :key="index" :label="item.userTableName" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
       <div class="c-text-center">
            <el-button type="primary" size="small" @click="chakanFunc">查看数据</el-button>
        </div>
    </div>
    <!--路径部分-->
    <div class="opContent  c-mt-20 c-mb-10" v-show="currentId==3">
      <div class="c-text-center c-mb-20">tab3</div>
       <div class="c-text-center">
            <el-button type="primary" size="small" @click="submitFunc1">确定</el-button>
        </div>
    </div>
</div>
</template>
<script>
import {myDataList,getTableData} from '@/api/index';
import {getDataList,getUnitList,unitChange} from '@/api/dataDeal/index'
  export default {
    data() {
      return {
          formParams: {
            converUnit: '',
            unitType:'',
            oriUnit:'',
            desifield:false,
            choiceField:[]
          },
          formParams1: {
            data: null
          },
          currentId:"2",
          tabData:[
              {name:"数据",id:1},
              {name:"参数",id:2},
              {name:"路径",id:3},
          ],
          dataList:null,
          unitTypeArr:[
            {
              label:'长度',   
              value:'length'
            },
            {
              label:'体积',
              value:'volume'
            },
            {
              label:'重量',
              value:'quality'
            }
          ],
          mbUnitArr:[],
          choicedTableId:'',
          choiceFieldArr:[]
      };
    },
    created(){
        this.initData();
        console.log(getUnitList);
    },
    methods: {
      selectMydata(e){
        console.log(e)
        this.choicedTableId = e.id;
        let encodeTableName = e.tableName;
        let Name = e.userTableName;
        let tableInfo = {
          encodeTableName,
          Name
        };
        this.$emit('putChoiceTableId',e.id,tableInfo);
        let parms = {
          tableId:e.id
        };
        this.choiceFieldArr = [];
        getDataList(parms).then(res=>{
          if(res.code == 200000){
            let resObj = res.data[0];
            for(var attr in resObj){
              this.choiceFieldArr.push({
                label:attr,
                value:attr
              });
            }
          }
          else{
            this.$message({
                type: 'error',
                duration: '1500',
                message: "获取数据失败",
                showClose: true
            });
          }
        }).catch(err=>{
            this.$message({
                type: 'error',
                duration: '1500',
                message: "获取数据失败",
                showClose: true
            });
        });
      },
      handleClick(item) {
        this.currentId=item.id;
        this.formParams={
          converUnit: '',
          unitType:'',
          oriUnit:'',
          desifield:false,
          choiceField:[]
        }
      },
      initData(){
          this.dataList=[];
          myDataList().then(res=>{
              if (res.code == 200000) {
                  this.ClassifiyList=res.data.tableClassification;
                  this.dataList = res.data.tableInfo;
              }
          }).catch(err => {
          });
      },
      chakanFunc(){
        let kuName = this.formParams1.data.tableName;
        this.tableKayName = kuName;
        let parm = {
          name:kuName
        };
        getTableData(parm).then(res=>{
          if(res.code == 200000){
            let detailData = res.data.list;
            console.log(detailData,'detailData')
            this.$emit('beforeOperData',detailData);
          }
          else{
            this.$message({
                type: 'error',
                duration: '1500',
                message: "获取数据失败",
                showClose: true
            });
          }
        }).catch(err=>{
          console.log(err)
        });
      },
      submitFunc(){
        let operData = this.formParams;
        console.log(operData,'operData')
        let unitChangeParm = {
            conversionUnit:operData.converUnit,         //目标单位
            newFiled:'new',                             // 空着也可以
            statParam:operData.choiceField.join(','),   //转换范围   全表是全部字段，指定字段时是一个或者多个
            tableId:this.choicedTableId,                //表Id
            unitType:operData.unitType                  //单位类型
        };
        unitChange(unitChangeParm).then(res=>{
          if(res.code == 200000){
            let afterOperData = res.data;
            this.$emit('afterOperData',afterOperData);
          }
          else{
            let errMsg = res.message;
            this.$message({
                type: 'error',
                duration: '1500',
                message: errMsg || "获取数据失败",
                showClose: true
            });
          }
        }).catch(err=>{
            this.$message({
                type: 'error',
                duration: '1500',
                message:"获取数据失败",
                showClose: true
            });
        });
        console.log(operData,'operData')
      },
      choiceUnitType(e){
        this.mbUnitArr=[];
        let formData = new FormData();
        formData.append('unitType',e);
        getUnitList(formData).then(res=>{
          if(res.code == 200000){
            let resObj = res.data;
            for(var attr in resObj){
              this.mbUnitArr.push({
                label:resObj[attr],
                value:attr
              });
            }
          }
          else{
            this.$message({
                type: 'error',
                duration: '1500',
                message:"获取数据失败",
                showClose: true
            });   
          }
        }).catch(err=>{
            this.$message({
                type: 'error',
                duration: '1500',
                message:"获取数据失败",
                showClose: true
            });
        });
      }
    }
  };
</script>
<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';
li{
    flex:1;
    padding-bottom:10px;
    padding-top:5px;
    @include layoutMode(both);
    cursor: pointer;
    box-sizing: border-box;
}
.tabActive{
        color:#409eff;
        position: relative;
            &::after{
               content: "";
                display:block;
                position: absolute;
                bottom: -2px;
                left: calc(50% - 15px);
                width: 30px;
                height: 2px;
                background: #409eff;
            }
    }
.checkBox_container{
  display: flex;
  margin-bottom: 10px;
  font-size: 14px;
  color: #606266;
  .fanwei_title{
    margin-right: 16px;
  }
  .fanwei_content{
    .allTable{
      margin-bottom: 10px;
    }
  }
}
</style>