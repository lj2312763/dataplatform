<template>
    <div class="c-view-dialog excelImport" v-cloak>
        <div class="c-scroll-wrap">
            <div class="c-scroll-inner">
                <div class="c-title-fixed">
                    <h3 class="c-title">
                        数据列表<i class="el-icon-arrow-right"></i>数据导入
                        <el-page-header @back="backClick" class="c-return-btn"></el-page-header>
                    </h3>
                </div>
                <div class="c-wrapper-20 c-padding-10 c-detail-box">
                    <el-steps :active="active" finish-status="success">
                        <el-step title="上传文件"></el-step>
                        <el-step title="表格设置"></el-step>
                        <el-step title="数据预览"></el-step>
                    </el-steps>
                    <div class="contentStep" v-if="active==0">
                        <el-upload
                            class="upload-demo c-mb-20"
                            drag
                            action
                            :http-request="imgPreview"
                            multiple>
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em> <br> 支持csv、xls、xlsx文件（单个文件最大50M ）</div>
                        </el-upload>
                        <div class="tips">
                            <p>csv、xls、xlsx文件只获取第一个sheet表格，表格示例如下：</p>
                            <p>1、请上传有标准行列的一维数据表格。（有合并单元格的数据请处理过后再上传，否则可能出现表头识别有误）</p>
                            <p>2、日期字段需包含年月日（如2016/1/1），或年月日时分秒。（如2016/1/1 00:00:00）</p>
                            <p class="c-mb-20">3、最大支持2000行*500列</p>
                            <vxe-table
                                border
                                show-header-overflow
                                show-overflow
                                highlight-hover-row
                                :data="tableData">
                                <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
                                <vxe-table-column field="name" title="拜访人"></vxe-table-column>
                                <vxe-table-column field="code" title="员工编号"></vxe-table-column>
                                <vxe-table-column field="room" title="部门"></vxe-table-column>
                                <vxe-table-column field="work" title="职位"></vxe-table-column>
                                <vxe-table-column field="date" title="拜访日期"></vxe-table-column>
                                <vxe-table-column field="time" title="拜访时间"></vxe-table-column>
                                <vxe-table-column field="net" title="客户类型"></vxe-table-column>
                            </vxe-table>
                        </div>
                    </div>
                    <div class="contentStep" v-if="active==1">
                        <vxe-toolbar>
                            <template v-slot:buttons>
                                <vxe-button @click="getRemoveEvent">删除选中</vxe-button>
                                <vxe-button icon="fa fa-save" @click="saveEvent">保存</vxe-button>
                            </template>
                        </vxe-toolbar>
                        <vxe-table
                            border
                            resizable
                            ref="xTable"
                            :data="tableData3"
                            :edit-config="{trigger: 'click', mode: 'cell'}"
                            >
                            <vxe-table-column type="checkbox" width="80" title="全选"></vxe-table-column>
                            <vxe-table-column type="seq" title="序号" width="80"></vxe-table-column>
                            <vxe-table-column field="fileName" title="表名"></vxe-table-column>
                            <vxe-table-column field="category" title="添加分类" :edit-render="{name: '$select', options: categoryList, optionProps: {value: 'id', label: 'classificationName'}}"></vxe-table-column>
                            <vxe-table-column field="header" title="表头设置" :edit-render="{name: '$select', options: headerList, optionProps: {value: 'value', label: 'label'}}"></vxe-table-column>
                            <vxe-table-column field="desc" title="数据描述" :edit-render="{name: 'input', immediate: true, attrs: {type: 'text'}}"></vxe-table-column>
                        </vxe-table>
                    </div>
                    <div class="contentStep" v-if="active==2">
                        <div v-for="(item,index) in dataList" :key="index" class="c-detail-box">
                            <div class="c-title">
                                {{item.userTableName}}
                            </div>
                            <vxe-table
                                border
                                show-header-overflow
                                show-overflow
                                highlight-hover-row
                                :data="item.content">
                                <vxe-table-column :field="subItem" :title="subItem" v-for="(subItem,subIndex) in item.nameList" :key="subIndex"></vxe-table-column>
                            </vxe-table>
                        </div>
                    </div>
                     <div class="c-text-center c-pdb-20">
                        <el-button type="primary" plain  @click="next" size="small">下一步</el-button>
                     </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {excelOperate,getTableData,getUserClassification} from '@/api/index';
export default {
    data(){
        return {
            tableData3:[],
            dataList:[],
            fileList:[],//上传的所有文件
            codeList:[],//上传成功code码
            categoryList:[],//我的分类列表
            headerList:[
                {value:0,label:'自带表头'},
                {value:1,label:'生成表头'},
            ],
            active: 0,
            tableData:[
                {name:'乔歆然',code:600001,room:'销售一部',work:'销售总监',date:'2016/8/8',time:'11:23',net:'互联网'},
            ],
            hasSave:false,
        }
    },
    methods: {
        saveEvent(){
            this.hasSave=true;
            this.tableData3.forEach(item=>{
                this.upload(item)
            })
        },
        getRemoveEvent(){
            let removeRow=this.$refs.xTable.getCheckboxRecords();
            this.$XModal.confirm('您确定要删除该数据?').then(type => {
                if (type === 'confirm') {
                   removeRow.forEach(item=>{
                       this.tableData3.forEach((subItem,index)=>{
                            if(item.fileName==subItem.fileName){
                                this.tableData3.splice(index, 1)
                            }
                       })
                   })
                }
            })
        },
        initField(){
            if(this.categoryList.length<1){
                this.active--;
                    this.$message({
                    type: 'warning',
                    duration: '1500',
                    message: '请添加分类进入下一步',
                    showClose: true
                });
                return;
            }
            this.fileList.forEach(item=>{
                this.tableData3.push({
                    fileName:item.name,
                    file:item,
                    category:this.categoryList[0].id,
                    header:0,
                    desc:''
                })
            })
             console.log(this.tableData3)
        },
        ininData(){
            this.categoryList=[];
            getUserClassification().then(res=>{
                if (res.code == 200000) {
                    this.categoryList=res.data;
                    this.initField();
                }
            }).catch(err => {

            }); 
        },
        ininMyData(code){
            getTableData({'name':code}).then(res=>{
                if (res.code == 200000) {
                     let cloumName=[];
                    for(var key in res.data.list[0]){
                        cloumName.push(key);
                    }
                    this.dataList.push({
                       nameList:cloumName,
                       userTableName:res.data.userTableName,
                       content:res.data.list
                    });
                }
            }).catch(err => {

            });
        },
        imgPreview(val) {
            this.fileList.push(val.file);
        } ,
        upload(item) {
            let formData = new FormData(); //创建form对象
            formData.append('file',item.file);//通过append向form对象添加数据
            formData.append('haveHeader',item.header);//通过append向form对象添加数据
            formData.append('tableRemark',item.desc);//通过append向form对象添加数据
            formData.append('classId',item.category);//通过append向form对象添加数据
            let config = {
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }; 
            excelOperate(formData,config).then(res => {
                if(res.code=200000){
                    this.codeList.push(res.data);
                    this.$message({
                        type: 'success',
                        duration: '1500',
                        message: '上传成功',
                        showClose: true
                    });
                }
            });
        } ,
        backClick(){
            this.$emit('closeDialog',true)
        },
        next() {
            this.active++;
            if (this.active==0) {
                
            }
            if(this.active==1){
                
                if(this.fileList.length<1){
                    this.active--;
                    this.$message({
                        type: 'warning',
                        duration: '1500',
                        message: '请上传文件进入下一步',
                        showClose: true
                    });
                    return;
                }
                this.ininData();
            }
            if(this.active==2){
                
                if(!this.hasSave){
                    this.active--;
                    this.$message({
                        type: 'warning',
                        duration: '1500',
                        message: '请点击保存进入下一步',
                        showClose: true
                    });
                    return;
                };
                this.codeList.forEach((item)=>{
                     this.ininMyData(item)
                })
            }
            if(this.active==3){
                this.backClick();
            }
        }
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
     width: 100%;
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