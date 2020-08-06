<template>
    <div class="c-view-dialog excelImport" v-cloak>
        <div class="c-scroll-wrap">
            <div class="c-scroll-inner">
                <div class="c-title-fixed">
                    <h3 class="c-title">
                        数据列表<i class="el-icon-arrow-right"></i>单表详情
                        <el-page-header @back="backClick" class="c-return-btn"></el-page-header>
                    </h3>
                </div>
                <div class="c-wrapper-20 c-padding-20 c-detail-box">
                    <el-row>
                        <el-col :span="12">
                            <p><span class="ex_title">表格名称：</span><span  class="ex_desc">{{rowData.userTableName}}</span></p>
                            <p><span class="ex_title">一级分类：</span><span  class="ex_desc">{{rowData.tableCategory||'--'}}</span></p>
                        </el-col>
                        <el-col :span="12">
                            <p><span class="ex_title">创建时间：</span><span  class="ex_desc">{{rowData.createTime}}</span></p>
                            <p><span class="ex_title">数据描述：</span><span  class="ex_desc">{{rowData.tableComment||'--'}}</span></p>
                        </el-col>
                    </el-row>
                    <div class="contentStep">
                        <div v-for="(item,index) in dataList" :key="index" class="c-detail-box">
                            <vxe-table
                                border
                                show-header-overflow
                                show-overflow
                                highlight-hover-row
                                 max-height="600"
                                :data="item.content">
                                <vxe-table-column :field="subItem" :title="subItem" v-for="(subItem,subIndex) in item.nameList"></vxe-table-column>
                            </vxe-table>
                        </div>
                    </div>
                     <!-- <div class="c-text-center c-pdb-20">
                        <el-button type="primary" plain  @click="next" size="small">下一步</el-button>
                     </div> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {getTableData} from '@/api/index';
export default {
    props:['rowData'],
    data(){
        return {
            dataList:[],
        }
    },
    created(){
          this.ininMyData(this.rowData.tableName)
    },
    methods: {
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