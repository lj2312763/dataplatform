<template>
    <div class="c-view-dialog excelImport" v-cloak>
        <div class="c-scroll-wrap">
            <div class="c-scroll-inner">
                <div class="c-title-fixed">
                    <h3 class="c-title">
                        数据列表<i class="el-icon-arrow-right"></i>单表编辑
                        <el-page-header @back="backClick" class="c-return-btn"></el-page-header>
                    </h3>
                </div>
                <div class="c-wrapper-20 c-padding-20 c-detail-box">
                     <el-form ref="dialogForm" :model="formParams" :rules="rules" size="large" label-position="left" label-width="85px">
                        <el-form-item label="表格名称：" prop='userTableName'>
                            <el-input v-model.trim="formParams.userTableName" auto-complete="new-text" ></el-input>
                        </el-form-item>
                        <el-form-item label="表格分类：" prop='tableCategory'>
                            <el-select v-model.trim="formParams.tableCategory"  value-key="id">
                                <el-option
                                    v-for="item in ClassifiyList"
                                    :key="item.id"
                                    :label="item.classificationName"
                                    :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="数据描述：" prop='tableComment'>
                            <el-input
                                type="textarea"
                                :rows="3"
                                placeholder=""        
                                v-model.trim="formParams.tableComment">
                            </el-input>
                        </el-form-item>
                    </el-form>
                     <div class="c-text-center c-padding-20">
                        <el-button type="primary" plain  @click="editMyData" size="small">保存</el-button>
                     </div>
                    <div class="contentStep">
                        <div class="c-title">
                            视图设计编辑
                        </div>
                         <!-- data_type varchar文本 character_maximum_length（长度）小数位数numeric_scale不显示-->
                         <!-- data_type int数字 numeric_precision（长度）小数位数numeric_scale不显示-->
                         <!-- data_type double，小数 numeric_precision（长度）小数位数numeric_scale显示-->
                         <!-- data_type datetime时间 numeric_precision（长度）小数位数numeric_scale显示-->
                         <!-- dataRanges除时间以外都有 -->
                        <vxe-table
                            border
                            show-header-overflow
                            show-overflow
                            highlight-hover-row
                            ref="xTable1"
                            :data="designList"
                            :edit-rules="validRules"
                            :edit-config="{trigger: 'click', mode: 'cell'}">
                            <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
                            <vxe-table-column field="column_name" title="字段名称" :edit-render="{name: 'input', immediate: true, attrs: {type: 'text'}}"></vxe-table-column>
                            <vxe-table-column field="data_type" title="数据类型" :edit-render="{name: '$select', options: dbTypeList, optionProps: {value: 'value', label: 'label'},events: {change: typeChange}}"></vxe-table-column>
                            <vxe-table-column field="length" title="字段长度" :edit-render="{autofocus: '.vxe-input--inner'}">
                                 <template v-slot:edit="{ row }">
                                    <vxe-input type="text" v-model="row.character_maximum_length" v-if="row.data_type=='varchar'"></vxe-input>
                                    <vxe-input type="text" v-model="row.numeric_precision" v-else></vxe-input>
                                </template>
                                <template v-slot="{ row }">
                                    <span  v-if="row.data_type=='varchar'">{{row.character_maximum_length}}</span>
                                    <span  v-else>{{row.numeric_precision}}</span>
                                </template>
                            </vxe-table-column>
                            <vxe-table-column field="numeric_scale" title="小数位数" :edit-render="{autofocus: '.vxe-input--inner'}">
                                <template v-slot:edit="{ row }">
                                    <vxe-input type="text" v-model="row.numeric_scale" :disabled="row.data_type=='varchar'|| row.data_type=='bigint'|| row.data_type=='int'"></vxe-input>
                                </template>
                            </vxe-table-column>
                            <vxe-table-column field="column_default" title="默认值" :edit-render="{name: 'input', immediate: true, attrs: {type: 'text'}}"></vxe-table-column>
                            <vxe-table-column field="is_nullable" title="必需" :edit-render="{name: '$select', options: requireList, optionProps: {value: 'value', label: 'label'}}"></vxe-table-column>
                            <vxe-table-column field="data_ranges" title="取值范围" :edit-render="{autofocus: '.vxe-input--inner'}">
                                <template v-slot:edit="{ row }">
                                    <vxe-input type="text" v-model="row.data_ranges" placeholder="示例：0|1000" :disabled="row.data_type=='varchar'|| row.data_type=='datetime'"></vxe-input>
                                </template>
                            </vxe-table-column>
                        </vxe-table>
                        <div class="c-text-center c-padding-20">
                            <el-button type="primary" plain  @click="formDesignSave" size="small">保存</el-button>
                        </div>
                    </div>
                    
                    <div class="contentStep">
                        <div class="c-title">
                            表格内容编辑
                        </div>
                        <div  class="c-detail-box" v-if="dataListObj">
                            <vxe-table
                                border
                                show-header-overflow
                                show-overflow
                                highlight-hover-row
                                :data="dataListObj.content"
                                ref="xTable2"
                                max-height="400"
                                :edit-config="{trigger: 'click', mode: 'cell'}">
                                <vxe-table-column  sortable  :field="subItem" :title="subItem" v-for="(subItem,subIndex) in dataListObj.nameList" :edit-render="{name: 'input', immediate: true, attrs: {type: 'text'}}"></vxe-table-column>
                            </vxe-table>
                        </div>
                        <div class="c-text-center c-padding-20">
                            <el-button type="primary" plain  @click="save3" size="small">保存</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {getTableData,getTableCosumn,editMyData,formDesign,tableEdit} from '@/api/index';
export default {
    props:['rowData','ClassifiyList'],
    data(){
        const nameValid = ({ cellValue }) => {
            return new Promise((resolve, reject) => {
               var reg= /^\d*\|\d*$/g.test(cellValue);
                if (!cellValue || reg) {
                    resolve()
                } else {
                    reject(new Error('格式不正确'))
                    
                }
            })
        }
        return {
            validRules: {
                dataRanges: [
                    { required: false, message: '取值范围格式不正确' },
                    { validator: nameValid }
                ],
            },
            dataListObj:null,
            oldList:[],
            designList:[],
            requireList:[
                {value:'YES',label:'YES'},
                {value:'NO',label:'NO'},
            ],
            dbTypeList:[
                {value:'varchar',label:'varchar'},
                {value:'int',label:'int'},
                {value:'double',label:'double'},
                {value:'datetime',label:'datetime'},
                {value:'bigint',label:'bigint'},
                {value:'date',label:'date'},
            ],
            formParams: {
                userTableName: '',
                tableCategory: '',
                tableComment: '',
            },
            rules:{
            }
        }
    },
    created(){
        this.formParams.userTableName=this.rowData.userTableName;
        this.formParams.tableCategory={
            id:this.rowData.classId,
            classificationName:this.rowData.tableCategory
        };
        this.formParams.tableComment=this.rowData.tableComment;
        this.ininMyData(this.rowData.tableName)
        this.ininSearch(this.rowData.tableName)
    },
    methods: {
        save3(){
            let selectRecords = this.$refs.xTable2.getTableData().tableData;
            selectRecords.forEach(item=>{
                delete item['_XID']
            })
            console.log(selectRecords)
            let params={
                jsonArray:selectRecords,
                tableId:this.rowData.id
            };
            tableEdit(params).then(res => {
                if(res.code == 200000) {
                    this.$message({
                        type: 'success',
                        duration: '1500',
                        message: res.message||"保存成功",
                        showClose: true
                    });
                    this.$emit("closeDialog",true);   
                }
                this.submitloading = false;
            }).catch(err => {
                this.submitloading = false;
            });
        },
        formDesignSave(){
            let selectRecords = this.$refs.xTable1.getTableData().tableData;
            let mapList=[];
            selectRecords.forEach((item,index)=>{
                this.oldList.forEach((subItem,subIndex)=>{
                    if(subIndex==index){
                          item['columnName']=subItem.column_name;
                          mapList.push({
                            "columnName":subItem.column_name,
                            "newColumnName":item.column_name,
                            "dataModifyType":item.data_type,
                            "dataRanges":item.data_ranges?item.data_ranges:'',
                            "defaultValueDeal":item.column_default? item.column_default:'',
                            "isRequest":item.is_nullable,
                            "precisionLength":item.numeric_precision?item.numeric_precision:item.character_maximum_length,
                            "decimalPrecision":item.numeric_scale
                        })
                    }
                })
            })
            let params={
                mapList:mapList,
                tableName: this.rowData.tableName
            };
            formDesign(params).then(res => {
                if(res.code == 200000) {
                    this.$message({
                        type: 'success',
                        duration: '1500',
                        message: res.message||"保存成功",
                        showClose: true
                    });
                    this.$emit("closeDialog",true);   
                }
                this.submitloading = false;
            }).catch(err => {
                this.submitloading = false;
            });
        },
        editMyData(){
            let formData = new FormData(); //创建form对象
            formData.append('tableId',this.rowData.id);//通过append向form对象添加数据
            formData.append('tableUserName',this.formParams.userTableName);//通过append向form对象添加数据
            formData.append('classificationName',this.formParams.tableCategory.classificationName);//通过append向form对象添加数据
            formData.append('classificationID',this.formParams.tableCategory.id);//通过append向form对象添加数据
            formData.append('tableDescription',this.formParams.tableComment);//通过append向form对象添加数据
            let config = {
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }; 
            editMyData(formData,config).then(res => {
                if(res.code == 200000) {
                    this.$message({
                        type: 'success',
                        duration: '1500',
                        message: res.message||"保存成功",
                        showClose: true
                    });
                    this.$emit("closeDialog",true);   
                }
                this.submitloading = false;
            }).catch(err => {
                this.submitloading = false;
            });
        },
        ininMyData(code){
            getTableData({'name':code}).then(res=>{
                if (res.code == 200000) {
                     let cloumName=[];
                    for(var key in res.data.list[0]){
                        cloumName.push(key);
                    }
                    this.dataListObj={
                       nameList:cloumName,
                       userTableName:res.data.userTableName,
                       content:res.data.list
                    };
                }
            }).catch(err => {

            });
        },
        ininSearch(code){
            getTableCosumn({'name':code}).then(res=>{
                if (res.code == 200000) {
                    let objArr = res.data;
                    let objArr1 = JSON.parse(JSON.stringify(objArr));
                    this.designList=objArr1;
                    this.oldList=objArr;
                }
            }).catch(err => {

            });
        },
        backClick(){
            this.$emit('closeDialog',true)
        },
    },
}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/theme.scss";
.excelImport{
    .ex_title{
        color:#000;
        font-weight: bold;
       line-height: 50px;
    }
}
</style>