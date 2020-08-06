<template>
    <div class="c-view-dialog excelImport" v-cloak>
        <div class="c-scroll-wrap">
            <div class="c-scroll-inner">
                <div class="c-title-fixed">
                    <h3 class="c-title">
                        数据列表<i class="el-icon-arrow-right"></i>表格合并
                        <el-page-header @back="backClick" class="c-return-btn"></el-page-header>
                    </h3>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    data(){
        return {
            active: 0,
            tableData:[
                {name:'乔歆然',code:600001,room:'销售一部',work:'销售总监',date:'2016/8/8',time:'11:23',net:'互联网'},
            ]
        }
    },
    mounted() {
          
    },
    methods: {
        ininData(){
            this.regisDate = [
                {
                    name:"注册时间",
                    value:this.overviewInfo.createTime
                }
            ];

            this.baseData={
                vehicelPic: '',
                titlename:'设备编号',
                platNo: this.data.rsuId ,
                list:[
                    {
                        name:"设备型号",
                        value:this.data.devModelName
                    },
                    {
                        name:"设备状态",
                        value:this.status[this.data.status]
                    },
                    {
                        name:"路侧点名称",
                        value:this.data.rsPtName
                    },
                     {
                        name:"道路名称",
                        value:this.data.rspRoadName
                    }
                ],
            }
            this.infoTagData=[ 
               {
                   title:"",
                   list:[{
                            name:"设备编号",
                            value:this.data.rsuId,
                        },
                        {
                            name:"设备型号",
                            value:this.data.devModelName,
                        },
                        {
                            name:"工作温度",
                            value:this.overviewInfo.workTemperature,
                        }
                   ]
               },
                {
                   title:"",
                   list:[{
                            name:"设备序列号",
                            value:this.overviewInfo.serialNum,
                        },
                        {
                            name:"APP版本",
                            value:this.overviewInfo.appVersion,
                        },
                        {
                            name:"电源电压",
                            value:this.overviewInfo.voltage,
                        }
                   ]
               },
                {
                   title:"",
                   list:[{
                            name:"设备厂商",
                            value:this.data.devFactoryName,
                        },
                        {
                            name:"通讯方式",
                            value:this.overviewInfo.commModeName,
                        },
                        {
                            name:"外部接口",
                            value:this.overviewInfo.outInterface,
                        }
                   ]
               }
            ]
        },
       
        backClick(){
            console.log(1111)
            this.$emit('closeDialog',true)
        },
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