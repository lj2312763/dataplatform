<template>
<div class="c-padding-10">
    <ul class="c-text-both">
        <li v-for="item in tabData" :class="{'tabActive':currentId==item.id}" :key="item.id" @click="handleClick(item)">{{item.name}}</li>
    </ul>
    <div class="opContent  c-mt-20 c-mb-10" v-show="currentId==2">
      <div class="c-text-center c-mb-20">一键检测</div>
      <el-form ref="dialogForm" :model="formParams" label-width="70px" size="mini">
        <el-form-item label="范围"  prop='region'>
          <el-select v-model="formParams.region" placeholder="范围">
            <el-option label="全部字段" value="shanghai"></el-option>
            <el-option label="filed1" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标准" prop="type">
          <el-checkbox-group v-model="formParams.type">
            <el-checkbox label="缺失数字" name="type"></el-checkbox>
            <el-checkbox label="数字<" name="type"> 数字< <el-input v-model="formParams.lg" style="width:80px"></el-input></el-checkbox>
            <el-checkbox label="数字>" name="type">数字> <el-input  v-model="formParams.gt" style="width:80px"></el-input></el-checkbox>
            <el-checkbox label="字+/-" name="type">数字+/-<el-input v-model="formParams.cha" style="width:80px"></el-input>标准差</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="处理方法" prop="resource">
          <el-radio-group v-model="formParams.resource">
            <el-radio label="删除异常值" class="c-mb-20"></el-radio>
            <el-radio label="设置为NULL" class="c-mb-20"></el-radio>
            <el-radio label="填补">
              填补
              <el-select v-model="formParams.deal" placeholder="范围" style="width:120px;display:inline-block">
                <el-option label="最小近邻法" value="shanghai"></el-option>
                <el-option label="平均值" value="beijing"></el-option>
                <el-option label="中位数" value="beijing"></el-option>
                <el-option label="众数" value="beijing"></el-option>
              </el-select>
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
       <div class="c-text-center">
            <el-button type="primary" size="small" @click="submitFunc">确定</el-button>
        </div>
    </div>
    <div class="opContent  c-mt-20 c-mb-10" v-show="currentId==1">
      <el-form ref="dialogForm" :model="formParams1" label-width="90px" size="mini">
        <el-form-item label="选择数据库"  prop='ku'>
          <el-select v-model="formParams1.ku" placeholder="我的数据">
            <el-option label="我的数据" value="shanghai"></el-option>
            <el-option label="公共数据" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择分类"  prop='cate'>
          <el-select v-model="formParams1.cate" placeholder="我的数据">
            <el-option label="经济人口" value="shanghai"></el-option>
            <el-option label="汽车" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择数据"  prop='data1'>
          <el-select v-model="formParams1.data1" placeholder="我的数据">
            <el-option label="2019各省GDP" value="shanghai"></el-option>
            <el-option label="2018各省GDP" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
       <div class="c-text-center">
            <el-button type="primary" size="small" @click="submitFunc1">确定</el-button>
        </div>
    </div>
    <div class="opContent  c-mt-20 c-mb-10" v-show="currentId==3">
      <div class="c-text-center c-mb-20">tab3</div>
       <div class="c-text-center">
            <el-button type="primary" size="small" @click="submitFunc1">确定</el-button>
        </div>
    </div>
</div>
</template>
<script>
  export default {
    data() {
      return {
          formParams: {
            lg: '',
            gt:'',
            cha:'',
            region: '',
            type: [],
            resource:'',
            deal:''
          },
          formParams1: {
            ku: '',
            cate:'',
            data1:''
          },
          currentId:"2",
          tabData:[
              {name:"数据",id:1},
              {name:"参数",id:2},
              {name:"路径",id:3},
          ]
      };
    },
    methods: {
      handleClick(item) {
       this.currentId=item.id
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
</style>