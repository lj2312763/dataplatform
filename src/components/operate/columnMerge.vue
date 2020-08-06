<template>
<div class="c-padding-10">
    <ul class="c-text-both">
        <li v-for="item in tabData" :class="{'tabActive':currentId==item.id}" :key="item.id" @click="handleClick(item)">{{item.name}}</li>
    </ul>

    <!--参数部分-->
    <div class="opContent  c-mt-20 c-mb-10" v-show="currentId==2">
      <div class="c-text-center c-mb-20">列合并</div>
      <el-form :model="formParams" label-width="90px" size="mini">
        <el-form-item label="设置主键">
          <el-select v-model="formParams.key">
            <el-option v-for="(item,index) in keyArr" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="维度字段">
            <el-input v-model="formParams.dimfield"></el-input>
        </el-form-item>
        <el-form-item label="设置新字段">
            <el-input v-model="formParams['szNewField'+index]" v-for="(item,index) in Array(currentIndex)" :key="index" style="margin-bottom:10px;" @change="inputNewField($event,index)"></el-input>
            <div class="plus_container">
                <i class="el-icon-plus" @click="addNewField"></i>
                <i class="el-icon-minus" @click="minusNewField"></i>
            </div>
        </el-form-item>
        <div class="hebing">合并字段取值关联</div>
        <div class="hebing_title">
            <div class="one">维度字段</div>
            <div class="two">新字段</div>
            <div class="three">源字段</div>
        </div>
        <div class="hebing_content"  v-for="(item,index) in Array(currentIndex1)" :key="index" style="margin-bottom:10px;">
            <div class="one"><el-input v-model="formParams['weiduField'+index]" placeholder="请输入维度字段"></el-input></div><i class="vxe-icon--arrow-right"></i>
            <div class="two">
                <el-select v-model="formParams['hebingNewField'+index]" placeholder="请选择新字段">
                    <el-option
                    v-for="item in formParams['choiceNewField']"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div><i class="vxe-icon--arrow-right"></i>
            <div class="three">
                <el-select v-model="formParams['oldField' + index]" placeholder="请选择源字段">
                    <el-option
                      v-for="(item,index) in hebingOldFieldArr" 
                      :key="index" 
                      :label="item.label" 
                      :value="item.value"
                    >
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="plus_container">
            <i class="el-icon-plus" @click="addNewWeiduField"></i>
            <i class="el-icon-minus" @click="minusNewWeiduField"></i>
        </div>
      </el-form>
       <div class="c-text-center">
            <el-button type="primary" size="small" @click="submitFunc" style="margin-top:10px;">确定</el-button>
        </div>
    </div>


    <!--数据部分-->
    <div class="opContent  c-mt-20 c-mb-10" v-show="currentId==1">
      <el-form ref="dialogForm" :model="formParams1" label-width="90px" size="mini">
        <el-form-item label="选择数据表">
          <el-select v-model="formParams1.data" placeholder="我的数据" value-key="id" @change="selectMydata($event)">
            <el-option v-for="item in myDataList" :key="item.id" :label="item.userTableName" :value="item"></el-option>
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
import {myDataList,getTableData,getTableCosumn} from '@/api/index';
import {columnMerge} from '@/api/dataDeal'
// import { delete } from 'vue/types/umd';
  export default {
    data() {
      return {
          formParams: {
              key:'',
              dimfield:'',
              huanUnit:'',
              choiceNewField:[]
          },
          formParams1: {
            data: ''
          },
          currentId:"2",
          tabData:[
              {name:"数据",id:1},
              {name:"参数",id:2},
              {name:"路径",id:3},
          ],
          keyArr:[],
          fieldNumArr:['1'],
          currentIndex:1,
          currentIndex1:1,
          myDataList:[],
          choicedTableId:'',
          tableKayName:'',
          hebingOldFieldArr:[]
      };
    },
    created(){
        this.initData();
    },
    methods: {
      handleClick(item) {
        this.currentId=item.id;
        this.formParams={
              key:'',
              dimfield:'',
              huanUnit:'',
              choiceNewField:[]
        }
        if(!this.tableKayName){
          return;
        }
        let parmObj = {
          name:this.tableKayName
        };
        getTableCosumn(parmObj).then(res=>{
          if(res.code == 200000){
            let totalKeyArr = [];
            let dataArr = res.data || [];
            for(var i=0;i < dataArr.length;i++){
              totalKeyArr.push({
                label:dataArr[i].column_name,
                value:dataArr[i].column_name
              });
            }
            console.log(dataArr,'dataObj')
            this.keyArr = totalKeyArr;
            this.hebingOldFieldArr = totalKeyArr;
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
          console.log(err,'err')
        });
      },
      initData(){
          myDataList().then(res=>{
              if (res.code == 200000) {
                this.myDataList = res.data.tableInfo;
              }
          }).catch(err => {
            console.log(err)
          });
      },
      selectMydata(e){
        this.choicedTableId = e.id;
        let encodeTableName = e.tableName;
        let Name = e.userTableName;
        let tableInfo = {
          encodeTableName,
          Name
        };
        this.$emit('putChoiceTableId',e.id,tableInfo);
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
      addNewField(){
        this.currentIndex++;
      },
      addNewWeiduField(){
        this.currentIndex1++;
      },
      minusNewField(){
        if(this.currentIndex == 1){
            return;
        }
        this.currentIndex--;
        delete this.formParams['szNewField'+this.currentIndex];
        this.formParams['choiceNewField'] = [];
        let choiceNewFieldArr = this.formParams;
        for(var attr in choiceNewFieldArr){
            if(attr.includes('szNewField')){
                this.formParams['choiceNewField'].push({
                    label:choiceNewFieldArr[attr],
                    value:choiceNewFieldArr[attr]
                });
            }
        }
      },
      minusNewWeiduField(){
        if(this.currentIndex1 == 1){
            return;
        }
        this.currentIndex1--;
        delete this.formParams['weiduField'+this.currentIndex1];
      },
      inputNewField(e,index){
          this.formParams['choiceNewField'].push({
              label:e,
              value:e
          });
      },
      submitFunc(){
        //   groupColumnName 主键  string
        //   dataColumnName 合并字段处新字段  string
        //   dataColumnNames 合并字段处源字段   Arr
        //   dimensions 合并字段处维度字段   Arr
        //   dimensionColumnName 主键下面维度字段    string
        let tableId = this.formParams1.data.id;
        let columnObj = this.formParams;
        let hebingNewField = '';
        let oldField = [];
        let weiduField = [];
        let formData = new FormData();
        for(var attr in columnObj){
          if(attr.includes('hebingNewField')){
            hebingNewField = columnObj['hebingNewField0'];
          }
          else if(attr.includes('oldField')){
            oldField.push(columnObj[attr]);
          }
          else if(attr.includes('weiduField')){
            weiduField.push(columnObj[attr]);
          }
        }
        formData.append('tableId',tableId);
        formData.append('groupColumnName',columnObj.key);
        formData.append('dataColumnName',hebingNewField);
        for(var i =0;i<oldField.length;i++){
          formData.append('dataColumnNames',oldField[i]);
        }
        for(var i =0;i<weiduField.length;i++){
          formData.append('dimensions',weiduField[i]);
        }
        formData.append('dimensionColumnName',columnObj.dimfield);
        columnMerge(formData).then(res=>{
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
                message:err.message || "获取数据失败",
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
.c-mb-10{
    width: 100%;
    .hebing{
        font-size: 14px;
        color: #606266;
        margin-bottom: 10px;
        padding-left: 10px;
        box-sizing: border-box;
    }
    .hebing_title,.hebing_content{
        font-size: 14px;
        color: #606266;
        display: flex;
        align-items: center;
        padding: 0 10px;
        box-sizing: border-box;
        justify-content: space-between;
        margin-bottom: 10px;
        .one,.two,.three{
            width: 30%;
            text-align: center;
        }
    }
    .plus_container{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
        .el-icon-plus{
            margin-right: 10px;
        }
    }
}
</style>