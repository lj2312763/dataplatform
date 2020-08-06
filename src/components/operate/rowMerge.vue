<template>
<div class="c-padding-10">
    <ul class="c-text-both">
        <li v-for="item in tabData" :class="{'tabActive':currentId==item.id}" :key="item.id" @click="handleClick(item)">{{item.name}}</li>
    </ul>
    <!--参数部分-->
    <div class="opContent  c-mt-20 c-mb-10" v-show="currentId==2">
      <div class="c-text-center c-mb-20">单位转换</div>
      <el-form ref="dialogForm" :model="formParams" label-width="70px" size="mini">
        <el-form-item label="设置主键">
          <el-select v-model="formParams.mainKey" placeholder="选择主键">
            <el-option v-for="(item,index) in mainArr" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="维度字段">
          <el-select v-model="formParams.weidu" placeholder="选择维度">
            <el-option v-for="(item,index) in weiduArr" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据字段">
          <el-select v-model="formParams.dingwei" placeholder="选择数据字段" multiple="true">
            <el-option v-for="(item,index) in dingweiArr" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
       <div class="c-text-center">
            <el-button type="primary" size="small" @click="submitFunc1">确定</el-button>
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
            <el-button type="primary" size="small">确定</el-button>
        </div>
    </div>
</div>
</template>
<script>
import {myDataList,getTableData} from '@/api/index';
import {getDataList,rowMerge} from '@/api/dataDeal/index'
  export default {
    data() {
      return {
          formParams: {
            mainKey:'',
            weidu:'',
            dingwei:[]
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
          choicedTableId:'',
          mainArr:[],
          weiduArr:[],
          dingweiArr:[]
      };
    },
    created(){
        this.initData();
    },
    methods: {
      selectMydata(e){
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
        this.mainArr = [];
        this.weiduArr = [];
        this.dingweiArr = [];
        getDataList(parms).then(res=>{
          if(res.code == 200000){
            let resObj = res.data[0];
            for(var attr in resObj){
              this.weiduArr.push({
                label:attr,
                value:attr
              });
              this.dingweiArr.push({
                label:attr,
                value:attr
              });
              this.mainArr.push({
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
        this.currentId=item.id
        this.formParams = {
            mainKey:'',
            weidu:'',
            dingwei:[]
        };
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
            this.$message({
                type: 'error',
                duration: '1500',
                message: "获取数据失败",
                showClose: true
            });
        });
      },
      submitFunc1(){
        let Params = this.formParams;
        let dingweiArr = Params.dingwei || [];
        let parmsData = new FormData();
        parmsData.append('tableId',this.choicedTableId);
        parmsData.append('groupColumnName',Params.mainKey);
        parmsData.append('dimensionColumnName',Params.weidu);
        for(var i=0;i<dingweiArr.length;i++){
            parmsData.append('dataColumnNames',dingweiArr[i]);
        }
        rowMerge(parmsData).then(res=>{
            if(res.code == 200000){
                let detailData = res.data;
                this.$emit('afterOperData',detailData);
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
        })
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