<template>
<div class="c-padding-10">
    <ul class="c-text-both">
        <li v-for="item in tabData" :class="{'tabActive':currentId==item.id}" :key="item.id" @click="handleClick(item)">{{item.name}}</li>
    </ul>
    <!--参数部分-->
    <div class="opContent c-mt-20 c-mb-10" v-show="currentId == 2">
    <div style="padding: 10px">
      <div>
        <div style="text-align: center">
          请选择字段
        </div>
        <el-select v-model="columnName" placeholder="请选择字段" style="    width: 100%;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div style="margin-top: 20px">
        <el-radio-group v-model="direction">
          <el-radio :label="0">
            左边
          </el-radio>
          <el-radio :label="1">
            右边
          </el-radio>
        </el-radio-group>
      </div>
      <div style="margin-top: 20px">
        <div>从</div>
        <el-input-number v-model="start" :min="1" :max="1000000000"></el-input-number>
        <div>到</div>
        <el-input-number v-model="end" :min="1" :max="1000000000"></el-input-number>
      </div>
    </div>
    <div class="c-text-center" style="margin-top: 20px">
      <el-button type="primary" size="small" @click="submitForm">确定</el-button>
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
          options:[],
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
            this.options = [];
            for (var k in detailData[0]) {
              this.options.push({
                value: k,
                label: k
              })
            }
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
