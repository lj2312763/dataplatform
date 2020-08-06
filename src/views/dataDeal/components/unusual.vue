<template>
    <div class="c-wrapper-20">
        <div class="c-text-between">
            <div class="operateTable">
                <div class="c-button-wrapper c-text-left">
                    <el-button size="mini" plain @click="handleAdd()">导出表格</el-button>
                    <el-button size="mini" plain @click="handleAdd()">导出PDF</el-button>
                </div>
                <div class="table">
                    <!--处理前表格-->
                    <vxe-table
                        border
                        resizable
                        :edit-config="{trigger: 'click', mode: 'cell'}"
                        v-if="ifShowBeforTable"
                        :data="beforeOperData"
                        ref="xTable"
                    >
                        <vxe-table-column type="seq" title="序号" width="60" sortable></vxe-table-column>
                        <vxe-table-column 
                            :field="item.key" 
                            :title="item.key" 
                            v-for="(item) in beforeKey" 
                            :key="item.key" 
                            sortable 
                            :edit-render="{name: '$input',props: {type:item.type}}"
                        >
                        </vxe-table-column>
                    </vxe-table>

                    <!--处理后表格-->
                    <vxe-table
                        border
                        resizable
                        ref="xTable"
                        :edit-config="{trigger: 'click', mode: 'cell'}"
                        v-if="ifShowAfterTable"
                        :data="afterOperData"
                    >
                        <vxe-table-column type="seq" title="序号" width="60" sortable></vxe-table-column>
                        <vxe-table-column 
                            :field="item.key" 
                            :title="item.key" 
                            v-for="(item) in afterKey" 
                            :key="item.key" 
                            sortable 
                            :edit-render="{name: '$input',props: {type:item.type}}"
                        >
                        </vxe-table-column>
                    </vxe-table>
                </div>
                <div class="c-button-wrapper c-text-left">
                    <el-button size="mini" plain @click="saveEditTable">保存</el-button>
                    <el-button size="mini" plain>帮助</el-button>
                </div>
            </div>
            <div class="operate">
                <operate ></operate>
            </div>
        </div>   
    </div>
</template>
<script>
import operate from '@/components/operate';
export default {
    components: {
        operate
    },
    data(){
        return {
            ifShowBeforTable:false,
            beforeOperData:null,
            beforeKey:null,
            ifShowAfterTable:false,
            afterOperData:null,
            
            afterKey:null
        }
    },
    created(){
        this.initData();
    },
    methods: {
        initData(){
        },
    }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';
.c-wrapper-20{
    height: 85vh;
    .c-text-between{
        .operateTable{
            flex:1;
            background:#fff;
            li{
                flex:1;
                padding-bottom:10px;
                padding-top:10px;
                @include layoutMode(both);
                cursor: pointer;
                box-sizing: border-box;
            }
            .tabActive{
                position: relative;
                color:#409eff;
                &::after{
                content: "";
                    display:block;
                    position: absolute;
                    bottom: 0;
                    left: calc(50% - 15px);
                    width: 30px;
                    height: 2px;
                    background: #409eff;
                }
            }
            .table{
                width: 100%;
                height: 412px;
                overflow: auto;
            }
        }
        .operate{
            margin-left: 20px;
            width: 300px;
            background:#fff;
        }
    }
}
</style>

