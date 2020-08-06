<template>
<div class="c-padding-10">
    <ul class="c-text-both">
        <li v-for="item in tabData" :class="{'tabActive':currentId==item.id}" :key="item.id" @click="handleClick(item)">{{item.name}}</li>
    </ul>
    <div class="opContent  c-mt-20 c-mb-10" v-show="currentId==1">
      <el-form ref="dialogForm1" :model="formParams1" label-width="90px" size="mini" :rules="rules1" label-position="top">
        <el-form-item label="选择分组"  prop='cate'>
          <el-select v-model="formParams1.zu" placeholder="请选择" @change="selectZu">
           <el-option  v-for="item in zunList" :key="item.name" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择数据表"  prop='ku'>
          <el-select v-model="formParams1.ku" placeholder="请选择" @change="selectTable">
            <el-option  v-for="item in dataList" :key="item.id" :label="item.userTableName" :value="item.tableName"></el-option>
          </el-select>
        </el-form-item>
        <template v-if="formParams1.zu=='v'">
          <el-form-item label="选择自变量"  prop='cate1'>
            <el-select v-model="formParams1.cate1" placeholder="请选择" @change="selectEl">
              <el-option  v-for="item in designList" :key="item.column_name" :label="item.column_name" :value="item.column_name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择因变量"  prop='cate2'>
            <el-select v-model="formParams1.cate2" placeholder="请选择">
              <el-option  v-for="item in designList" :key="item.column_name" :label="item.column_name" :value="item.column_name" :disabled="selfEl==item.column_name"></el-option>
            </el-select>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="选择自变量"  prop='cate3'>
            <el-select v-model="formParams1.cate3" placeholder="请选择" @change="selectE2" multiple>
              <el-option  v-for="item in designList" :key="item.column_name" :label="item.column_name" :value="item.column_name"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </el-form>
       <div class="c-text-center">
            <el-button type="primary" size="small" @click="lookDetail">查看数据</el-button>
        </div>
    </div>
    <div class="opContent  c-mt-20 c-mb-10" v-show="currentId==2">
      <!-- <div class="c-text-center c-mb-20">统计量</div>
      <el-form ref="dialogForm" :model="formParams" label-width="100px" size="mini" :rules="rules" label-position="top">
        <el-form-item label="显著性水平"  prop='alpha' >
          <el-input v-model="formParams.alpha" placeholder="请输入小于1的值"></el-input>
        </el-form-item>
        <el-form-item label="分析设置" prop="type">
          <el-checkbox-group v-model="formParams.type">
            <el-checkbox label="normal" name="normal" >正态性检验</el-checkbox>
            <el-checkbox label="variances" name="variances" >方差齐性检验</el-checkbox>
            <el-checkbox label="multiple" name="multiple" >事后比较 </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form> -->
       <div class="c-text-center">
            <el-button type="primary" size="small" @click="submitForm">确定</el-button>
        </div>
    </div>
    <div class="opContent  c-mt-20 c-mb-10" v-show="currentId==3">
      <div class="c-text-center c-mb-20">tab3</div>
       <div class="c-text-center">
            <el-button type="primary" size="small" @click="submitForm">确定</el-button>
        </div>
    </div>
</div>
</template>
<script>
import {myDataList} from '@/api/index';
import {getTableData,getTableCosumn} from '@/api/index';
import {nonparametricTwoIndependent,checkData} from '@/api/deduce';
  export default {
    data() {
      return {
          formParams: {
            type: [],
            alpha:''
          },
          formParams1: {
            zu:'v',
            ku:'',
            cate1:'',
            cate2:'',
            cate3:[],
          },
          currentId:"1",
          tabData:[
              {name:"变量配置",id:1},
              {name:"参数配置",id:2},
              {name:"我的操作",id:3},
          ],
          designList:[],
          ClassifiyList:[],
          dataList:[],
          zunList:[
            {name:'自变量在一列内',value:'v'},
            {name:'自变量为字段名',value:'h'},
          ],
          selfEl:'',
          rules:{
              // type: [
              //   { type: 'array', required: true, message: '请至少选择一个因素', trigger: 'change' }
              // ],
              // alpha: [
              //    { required: true, message: '请输入内容', trigger: 'blur' },
              // ],
          },
          rules1:{
              ku: [
                { required: true, message: '请选择内容', trigger: 'change' }
              ],
              cate1: [
                {  required: true, message: '请选择内容', trigger: 'change' }
              ],
              cate2: [
                {  required: true, message: '请选择内容', trigger: 'change' }
              ],
              cate3: [
                {  type: 'array', required: true, message: '请选择内容', trigger: 'change' }
              ],
          },
          result:[],
      };
    },
    created(){
      this.initData();
    },
    methods: {
      selectZu(){
        this.formParams1.cate1='';
        this.formParams1.cate2='';
        this.formParams1.cate3='';
        this.formParams1.cate3=[];
      },
      realForm(){
        let params={
          table_name:this.formParams1.ku,
          X:this.formParams1.zu=="v"?[this.formParams1.cate1]:this.formParams1.cate3,
          Y:this.formParams1.zu=="v"?[this.formParams1.cate2]:[],
          // alpha:this.formParams.alpha,
          table_direction:this.formParams1.zu,
          //analysis_options:this.formParams.type,
        };
        // let params={
        //   table_name:"anova_one_way",
        //   X:['level'],
        //   Y:['value'],
        //   alpha:this.formParams.alpha,
        //   table_direction:"v",
        //   analysis_options:this.formParams.type
        // };
        nonparametricTwoIndependent(params).then(res => {
            if(res.code == 200) {
                this.$emit('getRes',res.res)
            }
        }).catch(err => {

        });
      },
      lookForm(){
        let params={
          table_name:this.formParams1.ku,
          X:this.formParams1.zu=="v"?[this.formParams1.cate1]:this.formParams1.cate3,
          Y:this.formParams1.zu=="v"?[this.formParams1.cate2]:[],
        };
        // let params={
        //   table_name:"anova_one_way",
        //   X:['level'],
        //   Y:['value'],
        // };
        checkData(params).then(res => {
            if(res.code == 200) {
                this.$emit('lookRes',res.res)
            }
        }).catch(err => {
          
        });
      },
      lookDetail(formName) {
        this.$refs.dialogForm1.validate((valid1) => {
          if (valid1) {
            this.lookForm();
          } else {
            return false;
          }
        });
      },
      submitForm(formName) {
        //this.$refs.dialogForm.validate((valid) => {
          //if (valid) {
            this.$refs.dialogForm1.validate((valid1) => {
              if (valid1) {
                this.realForm();
              } else {
                this.$message({
                    type: 'info',
                    duration: '1500',
                    message: "请填写变量配置",
                    showClose: true
                });
                 return false;
              }
            });
        //   } else {
        //     return false;
        //   }
        // });
      },
      handleClick(item) {
       this.currentId=item.id
      },
      selectTable(val){
         this.formParams1.cate1='';
         this.formParams1.cate2='';
         this.formParams1.cate3=[];
         this.designList=[];
         this.ininSearch(val);
      },
      selectEl(val){
        this.selfEl=val
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
      ininSearch(code){
          getTableCosumn({'name':code}).then(res=>{
              if (res.code == 200000) {
                  this.designList=res.data;
              }
          }).catch(err => {

          });
      },
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
</style>