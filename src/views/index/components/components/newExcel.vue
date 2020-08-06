<template>
        <div class="c-view-dialog excelImport" v-cloak>
            <div class="c-scroll-wrap">
                <div class="c-scroll-inner">
                    <div class="c-title-fixed">
                        <h3 class="c-title">
                            数据列表<i class="el-icon-arrow-right"></i>新建表格
                            <el-page-header @back="backClick" class="c-return-btn"></el-page-header>
                        </h3>
                    </div>
                    <div class="c-wrapper-20 c-padding-10 c-detail-box">
                        <el-form ref="dialogForm" :model="formParams"  size="large" label-position="left" label-width="85px" :rules="rules" >
                            <el-form-item label="表格标题"  prop='title' >
                                <el-input v-model="formParams.title" placeholder="请输入"></el-input>
                            </el-form-item>
                            <el-form-item label="添加分类"  prop='cate1'>
                                <el-select v-model="formParams.cate1" placeholder="请选择">
                                    <el-option  v-for="item in categoryList" :key="item.id" :label="item.classificationName" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="分析设置" prop="desc">
                                <el-input type="textarea" v-model="formParams.desc"></el-input>
                            </el-form-item>
                        </el-form>
                        <div class="c-button-wrapper c-text-left">
                            <el-button size="mini" plain @click="insertEvent(null)">插入一行</el-button>
                            <el-button size="mini" plain @click="addColumn()">增加一列</el-button>
                            <el-button size="mini" plain @click="$refs.xTable.removeCheckboxRow()">删除选中的行</el-button>
                        </div>
                        <vxe-table
                            border
                            resizable
                            show-overflow
                            ref="xTable"
                            :data="tableData"
                            :edit-config="{trigger: 'click', mode: 'cell', showIcon: false}"
                            >
                            <vxe-table-column type="checkbox" width="60"></vxe-table-column>
                            <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
                            <vxe-table-column v-for="(item, index) in tableColumn" :key="index" v-bind="item" :edit-render="{name: 'input'}">
                                <template v-slot:header>
                                    <vxe-input v-model="item.title" placeholder="请输入列名" @blur="item.isShow=!item.isShow" v-if="item.isShow"></vxe-input>
                                    <span @click="item.isShow=!item.isShow" v-else>{{item.title}}</span>
                                </template>
                            </vxe-table-column> 
                        </vxe-table>
                        <div class="c-button-wrapper c-text-center">
                            <el-button   @click="addTableDataHandler">保存数据</el-button>
                        </div>
                    </div>  
                </div>
            </div>
        </div>
    
</template>

<script>
import {getUserClassification} from '@/api/index';

import {addTableData} from '@/api/index/newExcel.js';
  export default {
    data(){
        return {
            formParams: {
                desc: '',
                title: '',
                cate1:''
            },
            isShow:true,
            active: 0,
            tableData:[
                
            ],
            categoryList:[],
            tableColumn:[],
            currentIndex:0,
            rules:{
              desc: [
                 { required: true, message: '请输入内容', trigger: 'blur' },
              ],
              title: [
                 { required: true, message: '请输入内容', trigger: 'blur' },
              ],
              cate1: [
                 { required: true, message: '请选择', trigger: 'change' },
              ],
          },

        }
    },
    created(){
        this.ininData()
    },
    methods: {
        ininData(){
            this.categoryList=[];
            getUserClassification().then(res=>{
                if (res.code == 200000) {
                    this.categoryList=res.data;
                }
            }).catch(err => {

            }); 
        },
        addColumn () {
           this.currentIndex++;
            this.tableColumn.push({
                field: `new_${this.currentIndex}`,
                title: `new_${this.currentIndex}`,
                minWidth: 100,
                isShow:true,
            })
        },
        backClick(){
            this.$emit('closeDialog')
        },
        insertEvent (row) {
            let xTable = this.$refs.xTable
            let record = {}
            xTable.insertAt(record, row).then(({ row }) => {
            xTable.setActiveRow(row)
            })
        },
        addTableDataHandler() {
            let selectRecords = this.$refs.xTable.getTableData()
            let arr=[];
            this.tableColumn.forEach(item=>{
                arr.push(item.title)
            })
            let arr2=[];
            selectRecords.tableData.forEach(item=>{
                let arr1=[];
                for(var key in item){
                    if(key!="_XID"){
                        arr1.push(item[key])
                    }
                }
                arr2.push(arr1);
            })
            arr2.unshift(arr);
            let params={
                "classId": this.formParams.cate1,
                "data":arr2,
                "tableName":  this.formParams.title,
                "tableRemark": this.formParams.desc
            };
            this.$refs.dialogForm.validate((valid1) => {
                if (valid1) {
                    addTableData(params).then(res => {
                        if(res.code=200000){
                            this.$message({
                                type: 'success',
                                duration: '1500',
                                message: '添加成功',
                                showClose: true
                            });
                        }
                    });
                } else {
                    return false;
                }
            });
            
        } ,
    },
}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/theme.scss";
.contentStep{
    margin:30px 0;
}
</style>
<style lang="scss">
@import "@/assets/scss/theme.scss";
.excelImport{
    .upload-demo{
        width: 100%;
        .el-upload{
            width:100%;
        }
        .el-upload-dragger{
            width:100%
        }
    }
}

</style>