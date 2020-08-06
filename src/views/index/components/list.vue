<template>
    <div class="c-wrapper-20">
         <div class="c-button-wrapper c-text-left">
            <el-button size="mini" plain @click="detailHandle(1)">添加分类</el-button>
            <el-button size="mini" plain @click="inmportData()">导入数据</el-button>
            <el-button size="mini" plain @click="newExcel()">新建表格</el-button>
            <el-button size="mini" plain @click="handleAdd()">表格合并</el-button>
            <el-button size="mini" plain @click="getRemoveEvent()">删除</el-button>
        </div>
        
        <vxe-table
            border
            align="center"
            max-height="800"
            highlight-hover-row
            show-overflow
            ref="xTable"
            :loading="tableLoading"
            :data="dataList">
            <vxe-table-column type="checkbox" width="60"></vxe-table-column>
            <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
            <vxe-table-column field="createTime" sortable title="创建时间"></vxe-table-column>
            <vxe-table-column field="tableCategory" sortable title="数据分类"  :filters="[{ data: '' }]" :filter-method="filterCateMethod">
               <template v-slot:filter="{ $panel, column }">
                    <select class="my-select" v-model="option.data" v-for="(option, index) in column.filters" :key="index" @change="$panel.changeOption($event, !!option.data, option)">
                        <option v-for="(item, cIndex) in filterList" :key="cIndex" :value="item.label">{{ item.label }}</option>
                    </select>
                </template>
            </vxe-table-column>
            <vxe-table-column field="userTableName" :filters="[{ data: '' }]" :filter-method="filterNameMethod" sortable title="表名">
                <template v-slot:filter="{ $panel, column }">
                    <input class="my-input" type="type" v-for="(option, index) in column.filters" :key="index" v-model="option.data" @input="$panel.changeOption($event, !!option.data, option)" @keyup.enter="$panel.confirmFilter()" placeholder="按回车确认筛选">
                </template>
            </vxe-table-column>
            <vxe-table-column field="work" title="操作" width="350">
                <template v-slot="{ row }" >
                    <vxe-button @click="lookDetail(row)" size="mini">查看</vxe-button>
                    <!-- <vxe-button @click="clickItem(row)" size="mini">删除</vxe-button> -->
                    <vxe-button @click="exEdit(row)" size="mini">编辑</vxe-button>
                    <vxe-button @click="downLoad(row)" size="mini">下载</vxe-button>
                    <vxe-button @click="handleCopy(row)" size="mini">备份</vxe-button>
                </template>
            </vxe-table-column>
            <!-- <vxe-table-column field="date" title="分析" width="230">
                <template v-slot="{ row }">
                    <vxe-button status="primary" @click="clickItem(row)" size="mini">直接分析</vxe-button>
                    <vxe-button @click="clickItem(row)" size="mini">分析推荐</vxe-button>
                </template>
            </vxe-table-column> -->
        </vxe-table>
        <!-- 添加分类 -->
        <add v-if="addFlag"  @closeDialog="closeDialog"></add>
        <copy v-if="copyFlag"  @closeDialog="closeDialog" :rowData="rowData"></copy>
        <import-data v-if="importFlag" @closeDialog="closeDialog"></import-data>
        <new-excel v-if="newExcelFlag" @closeDialog="closeDialog"></new-excel>
        <excel-merge v-if="excelMergeFlag" @closeDialog="closeDialog"></excel-merge>
        <exDetail v-if="exDetailFlag" :rowData="rowData" @closeDialog="closeDialog"></exDetail>
        <exEdit v-if="exEditFlag" :rowData="rowData" :ClassifiyList="ClassifiyList" @closeDialog="closeDialog"></exEdit>
        
    </div>
</template>
<script>
import add from "./components/add";
import copy from "./components/copy";
import importData from "./components/import";
import newExcel from './components/newExcel';
import excelMerge from './components/excelMerge';
import exDetail from './components/exDetail';
import exEdit from './components/exEdit';
import {myDataList,delTable,downLoad} from '@/api/index';
export default {
    components: {
        add,importData,newExcel,excelMerge,exDetail,exEdit,copy
    },
    data(){
        return {
            ClassifiyList:[],
            exDetailFlag:false,
            exEditFlag:false,
            rowData:null,
            excelMergeFlag:false,
            pageOption: {
                size: 10,
                total: 0,
                page: 1     
            },
            popData: {
                title: '提示',
                data: {},
                visible: true
            },
            dataList: [],
            tableLoading: false,
            addFlag:false,
            copyFlag:false,
            dialogData:{
                title:'',
                data:'',
                type:'',    //type 1：新增，2：编辑
                viewFlag: false,
            },
            importFlag:false,
            newExcelFlag:false,
            filterList:[],
        }
    },
    created(){
        this.initData();
    },
    methods: {
        filterCateMethod({ option, row }){
            return row.tableCategory === option.data
        },
        filterNameMethod({ option, row }){
              return row.userTableName.includes(option.data);
        },
        getRemoveEvent () {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let removeRecords = this.$refs.xTable.getCheckboxRecords()
                let arr=[];
                removeRecords.forEach(item=>{
                    arr.push(item.tableName);
                })
                delTable(arr).then(res=>{
                    if (res.code == 200000) {
                        this.initData();
                        this.$message({
                            type: 'success',
                            duration: '1500',
                            message: "删除成功！",
                            showClose: true
                        });      
                    }
                }).catch(err => {

                });
             }).catch(() => {
                // this.$message({
                //     type: 'info',
                //     duration: '1500',
                //     message: "已取消删除！",
                //     showClose: true
                // });  
            });    
        },
        downLoad(row){
            downLoad({name:row.tableName}).then(res=>{
                var eleLink = document.createElement('a'); 
                eleLink.download = row.userTableName; 
                eleLink.style.display = 'none'
                var blob = new Blob([res],{type: 'application/vnd.ms-excel'}); 
                eleLink.href = URL.createObjectURL(blob);
                document.body.appendChild(eleLink); 
                eleLink.click(); 
                // 然后移除 
                document.body.removeChild(eleLink); 
            }).catch(err => {
            });
        },
        exEdit(row){
            this.rowData=row;
            this.exEditFlag=true;
        },
        lookDetail(row){
            this.rowData=row;
            this.exDetailFlag=true;
        },
        handleAdd(){
            this.excelMergeFlag=true;
        },
        newExcel(){
            this.newExcelFlag=true;
        },
        inmportData(){
            this.importFlag=true;
        },
        closeDialog(val) {
            this.addFlag = false;
            this.importFlag = false;
            this.newExcelFlag = false;
            this.excelMergeFlag = false;
             this.exDetailFlag=false;
             this.exEditFlag=false;
             this.copyFlag=false;
            if(val){
                 this.initData();
            }
        },
        initData(){
            this.dataList=[];
            this.tableLoading = true;
            myDataList().then(res=>{
                if (res.code == 200000) {
                    this.ClassifiyList=res.data.tableClassification;
                    this.dataList = res.data.tableInfo;
                    let arr=[];
                    this.ClassifiyList.forEach(item=>{
                        arr.push({
                            label:item.classificationName,
                            value:item.id
                        })
                    })
                     this.filterList=arr;
                     console.log( this.filterList)
                }
                this.tableLoading = false;
            }).catch(err => {
                this.tableLoading = false;
            });
        },
        detailHandle(type,val) {    //type 1：新增，2：编辑，3：查看详情
            this.addFlag = true;
        },
        handleCopy(row){
            this.rowData=row;
            this.copyFlag = true;
        },
        handleDelete(index,item){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = {
                    ids: [item.id]
                };
            //    deleteIds(params).then(res=>{
            //         if (res.status == 200) {
            //             this.initData();
            //             this.$message({
            //                 type: 'success',
            //                 duration: '1500',
            //                 message: "删除信息类型成功！",
            //                 showClose: true
            //             });      
            //         } 
            //     }); 
                
            }).catch(() => {
                // this.$message({
                //     type: 'info',
                //     duration: '1500',
                //     message: "已取消删除！",
                //     showClose: true
                // });  
            });
        },
    },
   

}
</script>
<style lang="scss" scoped>
.vxe-table{
    width: 100%;;
}
.my-select {
    margin: 10px;
    width: 100px;
    height: 32px;
    border:1px solid #000;
}
.my-input {
    margin: 10px;
    width: 140px;
    height: 32px;
    border:1px solid #000;
}
</style>

