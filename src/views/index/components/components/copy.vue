<template>
    <el-dialog 
         title="表格备份" 
        :visible.sync="visible"
        :before-close="cancleFunc"
        :close-on-click-modal="false"
        width="30%">
        <el-form ref="dialogForm" :model="formParams" :rules="rules" size="small" label-position="left" label-width="70px">
            <el-form-item label="表名称" prop='backupName'>
                <el-input v-model.trim="formParams.backupName"></el-input>
            </el-form-item>
        </el-form>
        <div class="c-text-center">
            <el-button type="primary" size="small" @click="submitFunc" :loading="submitloading">确定</el-button>
            <el-button type="primary" size="small" plain @click="cancleFunc">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
 import {backups} from '@/api/index';
export default {
    props:['rowData'],
    data() {
        return {
            visible: true,
            submitloading: false,
            formParams: {
                backupName : '',
            },
            rules:{
                backupName:[
                    { required: true, message: '名称不能为空!', trigger: 'blur' },
                ],
            }
        }
    },
    created() {
    },
    methods: {
        submitFunc() {
            this.$refs.dialogForm.validate((valid) => {
                if (valid) {
                    this.submitloading = true;
                    // let formData = new FormData(); //创建form对象
                    // formData.append('classificationName',this.formParams.classificationName);//通过append向form对象添加数据
                    // formData.append('classificationDescription',this.formParams.classificationDescription);//通过append向form对象添加数据
                    // let config = {
                    //     headers: {
                    //         'Accept': '*/*',
                    //         'Content-Type': 'application/x-www-form-urlencoded'
                    //     }
                    // }; 
                    let params={
                        tableCode:this.rowData.tableName,
                        backupName:this.formParams.backupName
                    }
                    backups(params).then(res => {
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
                } else {
                    return false;
                }
            });
        },
        cancleFunc() {
            this.$emit("closeDialog");
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';
</style>