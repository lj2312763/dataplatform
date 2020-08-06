<template>
<div class="c-padding-10">
    <ul class="c-text-both">
        <li v-for="item in tabData" :class="{'tabActive':currentId==item.id}" :key="item.id" @click="handleClick(item)">{{item.name}}</li>
    </ul>
    <div class="opContent  c-mt-20 c-mb-10" v-show="currentId==1">
      <el-form ref="dialogForm1" :model="formParams1" label-width="90px" size="mini" :rules="rules1" label-position="top">
        <p class="c-text-center c-mb-10">数据源设置</p>
        <el-form-item label="选择数据表"  prop='ku'>
          <el-select v-model="formParams1.ku" placeholder="请选择" @change="selectTable">
            <el-option  v-for="item in dataList" :key="item.id" :label="item.userTableName" :value="item.tableName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择自变量"  prop='cate1'>
          <el-select v-model="formParams1.cate1" placeholder="请选择" @change="selectEl" multiple>
            <el-option  v-for="item in designList" :key="item.column_name" :label="item.column_name" :value="item.column_name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择因变量"  prop='cate2'>
          <el-select v-model="formParams1.cate2" placeholder="请选择">
            <el-option  v-for="item in designList" :key="item.column_name" :label="item.column_name" :value="item.column_name" :disabled="item.disabled"></el-option>
          </el-select>
        </el-form-item>
        <p class="c-text-center c-mb-10">数据集拆分</p>
        <el-form-item label="测试集比例"  prop='rate' >
          <el-input v-model="formParams1.rate" placeholder="请输入小于1的值"></el-input>
        </el-form-item>
        <el-form-item label="测试集随机种子数"  prop='randomState' >
          <el-input v-model="formParams1.randomState" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
       <div class="c-text-center">
            <el-button type="primary" size="small" @click="lookDetail">查看数据</el-button>
        </div>
    </div>
    <div class="opContent  c-mt-20 c-mb-10" v-show="currentId==2">
      <div class="c-text-center c-mb-10">运行配置</div>
      <el-form ref="dialogForm" :model="formParams" label-width="100px" size="mini" :rules="rules" label-position="top">
        <!-- <el-form-item label="操作类型"  prop='opType'>
          <el-select v-model="formParams.opType" placeholder="请选择">
            <el-option  v-for="item in typeList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item> -->
        <template v-if="formParams.opType==1">
          <el-form-item label="几折交叉验证"  prop='yan'>
            <el-input v-model="formParams.yan" placeholder="请输入整数"></el-input>
          </el-form-item>
          <el-form-item label="惩罚项"  prop='penalty'>
            <el-select v-model="formParams.penalty" placeholder="请选择" multiple  @change="selectE2">
              <el-option  v-for="item in penaltyList" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="惩罚项系数"  prop='xishu'>
            <el-input v-model="formParams.xishu" placeholder="输入多个用“,”隔开 "></el-input>
          </el-form-item>
          <el-form-item label="优化算法"  prop='solver' >
            <el-select v-model="formParams.solver" placeholder="请选择" multiple>
              <el-option  v-for="item in solverList" :key="item.value" :label="item.name" :value="item.value" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="最大迭代步数"  prop='max_iter'>
            <el-input v-model="formParams.max_iter" placeholder="输入多个用“,”隔开"></el-input>
          </el-form-item>
          <el-form-item label=""  prop='fit_intercept'>
            <el-checkbox v-model="formParams.fit_intercept">截距项</el-checkbox>
          </el-form-item>
        </template>
        <el-form-item label="结果展示选项"  prop='show_options' >
          <el-select v-model="formParams.show_options" placeholder="请选择" multiple>
            <el-option  v-for="item in show_optionsList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
       <div class="c-text-center">
            <el-button type="primary" size="small" @click="submitForm">确定</el-button>
            <el-button type="primary" size="small" @click="submitForm">确定</el-button>
        </div>
    </div>
    <div class="opContent  c-mt-20 c-mb-10" v-show="currentId==3">
      <div class="c-text-center c-mb-20"></div>
       <div class="c-text-center">
            <el-button type="primary" size="small" @click="submitForm">确定</el-button>
        </div>
    </div>
</div>
</template>
<script>
import {myDataList} from '@/api/index';
import {getTableData,getTableCosumn} from '@/api/index';
import {train,evaluate} from '@/api/algorithm';
import {checkData} from '@/api/deduce';
  export default {
    data() {
      return {
          formParams: {
            opType:'1',//操作类型
            yan:'',//几折交叉验证
            penalty:[],//惩罚项
            xishu:'',//惩罚项系数
            solver:[],//优化算法
            max_iter:'',//最大迭代步数
            fit_intercept:false,//截距项,
            show_options:[],
          },
          typeList:[//操作类型
            {name:'训练',value:'1'},
            {name:'测试',value:'2'},
          ],
          penaltyList:[
            {name:'l1',value:'l1'},
            {name:'l2',value:'l2'},
          ],//惩罚项
          solverList:[
            {disabled:false, name:'newton-cg',value:'newton-cg'},
            {disabled:false, name:'lbfgs',value:'lbfgs'},
            {disabled:false, name:'liblinear',value:'liblinear'},
            {disabled:false, name:'sag',value:'sag'},
            {disabled:false, name:'saga',value:'saga'},
          ],//优化算法
          show_optionsList:[
             {name:'分类报告',value:'report'},
             {name:'混淆矩阵',value:'matrix'},
             {name:'roc曲线',value:'roc'},
             {name:'拟合优度',value:'r2'},
             {name:'系数解读',value:'coff'},
             {name:'独立性检验',value:'independence'},
             {name:'残差正态性检验',value:'resid_normal'},
             {name:'残差pp图',value:'pp'},
             {name:'残差qq图',value:'qq'},
             {name:'方差齐性检验',value:'var'},
             {name:'多重共线性检验',value:'vif'},
             {name:'异常值检测',value:'outliers'},
             {name:'预测值与真实值对比散点图',value:'pred_y_contrast'},
          ],//结果展示选项
          formParams1: {
            ku:'',
            cate1:[],
            cate2:'',
            rate:'',
            randomState:''
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
          selfEl:'',
          rules:{
              yan: [
                 { required: true, message: '请输入内容', trigger: 'blur' },
              ],
              xishu: [
                 { required: true, message: '请输入内容', trigger: 'blur' },
              ],
              max_iter: [
                 { required: true, message: '请输入内容', trigger: 'blur' },
              ],
              penalty: [
                { type: 'array', required: true, message: '请至少选择一个因素', trigger: 'change' }
              ],
              solver: [
                { type: 'array', required: true, message: '请至少选择一个因素', trigger: 'change' }
              ],
              show_options: [
                { type: 'array', required: true, message: '请至少选择一个因素', trigger: 'change' }
              ],
          },
          rules1:{
              ku: [
                { required: true, message: '请选择内容', trigger: 'change' }
              ],
              cate1: [
                {  type: 'array', required: true, message: '请选择内容', trigger: 'change' }
              ],
              cate2: [
                {  required: true, message: '请选择内容', trigger: 'change' }
              ],
              rate: [
                 { required: true, message: '请输入内容', trigger: 'blur' },
              ],
              randomState: [
                 { required: true, message: '请输入内容', trigger: 'blur' },
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
      },
      realForm(){
        let params;
        if(this.formParams.opType==1){
          params={
            "tableName": this.formParams1.ku,
            "X": this.formParams1.cate1,
            "Y": [this.formParams1.cate2],
            "rate": this.formParams1.rate,
            "randomState": this.formParams1.randomState,
            "cv": this.formParams.yan,
            "param": {
                "penalty":this.formParams.penalty,
                "C":this.formParams.xishu.split(','),
                "solver": this.formParams.solver,
                "max_iter":this.formParams.max_iter.split(','),
                "fit_intercept":[this.formParams.fit_intercept],
            },
            "show_options":this.formParams.show_options
          };
          train(params).then(res => {
            let res1;
            console.log(typeof res)
            if(typeof res =='string'){
              console.log(res)
              res1=JSON.parse(res)
            }else{
               console.log(res)
               res1=res
            }
           
            if(res1.code == 200) {
              console.log(res1)
                this.$emit('getRes',res1.res)
            }
          }).catch(err => {

          });
        }else{
          params={
            "tableName": this.formParams1.ku,
            "X": this.formParams1.cate1,
            "Y": [this.formParams1.cate2],
            "show_options":this.formParams.show_options
          };
          evaluate(params).then(res => {
              if(res.code == 200) {
                  this.$emit('getRes',res.res)
              }
          }).catch(err => {

          });
        }
        
        
      },
      lookForm(){
        let params={
          table_name:this.formParams1.ku,
          X:this.formParams1.cate1,
          Y:[this.formParams1.cate2],
        };
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
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
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
          } else {
            return false;
          }
        });
      },
      handleClick(item) {
       this.currentId=item.id
      },
      selectTable(val){
         this.formParams1.cate1='';
         this.formParams1.cate2='';
         this.designList=[];
         this.ininSearch(val);
      },
      selectEl(val){
        this.selfEl=val
        this.designList.forEach(subItem=>{
          if(subItem.disabled){
            subItem.disabled=false;
          }
        })
        val.forEach(item=>{
          this.designList.forEach(subItem=>{
            if(item==subItem.column_name){
              subItem['disabled']=true;
            }
          })
        })
      },
      selectE2(val){
        this.solverList.forEach(subItem=>{
          if(subItem.disabled){
            subItem.disabled=false;
          }
        })
        if(val.length==1){
          val.forEach(item=>{
            if(item=='l1'){
              this.solverList.forEach(subItem=>{
                if(subItem.value=='lbfgs'){
                  subItem['disabled']=true;
                }
                if(subItem.value=='sag'){
                  subItem['disabled']=true;
                }
                if(subItem.value=='newton-cg'){
                  subItem['disabled']=true;
                }
                
              })
            }
            if(item=='l2'){
              this.solverList.forEach(subItem=>{
              if(subItem.value=='liblinear'){
                  subItem['disabled']=true;
                }
                if(subItem.value=='saga'){
                  subItem['disabled']=true;
                }
              })
            }
          })
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