<template>
  <div class="c-padding-10">
    <ul class="c-text-both">
      <li
        v-for="item in tabData"
        :class="{ tabActive: currentId == item.id }"
        :key="item.id"
        @click="handleClick(item)"
      >{{ item.name }}
      </li>
    </ul>
    <!--数据部分-->
    <div class="opContent  c-mt-20 c-mb-10" v-show="currentId==1">
      <el-form ref="dialogForm" :model="formParams1" label-width="90px" size="mini">
        <el-form-item label="选择数据表">
          <el-select v-model="formParams1.data" placeholder="我的数据" value-key="id" @change="selectMydata($event)">
            <el-option v-for="item in ku" :key="item.id" :label="item.userTableName" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="c-text-center">
        <el-button type="primary" size="small" @click="handleDataList">查看数据</el-button>
      </div>
    </div>
    <div class="opContent c-mt-20 c-mb-10" v-show="currentId == 2">
      <el-form
        ref="dialogForm"
        :model="formParams"
        label-width="100px"
        size="mini"
        :rules="rules"
        label-position="top"
      >
        <el-form-item label prop="type">
          <el-checkbox-group v-model="formParams.type">
            <div class="checkbox">
              <el-checkbox label=";" name=";" value=";">分号</el-checkbox>
            </div>
            <div class="checkbox">
              <el-checkbox label="," name="," value=",">逗号</el-checkbox>
            </div>
            <div class="checkbox">
              <el-checkbox label=" " name=" " value=" ">空格</el-checkbox>
            </div>
            <div class="checkbox">
              <el-checkbox label="other" name="other" value="other">其他</el-checkbox>
            </div>
          </el-checkbox-group>
          <!-- <div style="display: table-caption;">
             <el-radio-group v-model="formParams.type">
               <el-radio label=";" name=";" value=";">分号</el-radio>
               <el-radio label="," name="," value=",">逗号</el-radio>
               <el-radio label=" " name=" " value=" ">空格</el-radio>
               <el-radio label="other" name="other"  value="other">其他</el-radio>
             </el-radio-group>
           </div>-->

          <div v-if="formParams.type.includes('other')">
            <el-input v-model="type" placeholder="请输入内容"></el-input>
          </div>
        </el-form-item>
      </el-form>
      <div class="c-text-center">
        <el-button type="primary" size="small" @click="submitForm">确定</el-button>
      </div>
    </div>
    <div class="opContent c-mt-20 c-mb-10" v-show="currentId == 3">
      <div class="c-text-center c-mb-20">tab3</div>
      <div class="c-text-center">
        <el-button type="primary" size="small" @click="submitForm">确定</el-button>
      </div>
    </div>
  </div>
</template>
<script>
    import {myDataList} from "@/api/index";
    import {getTableData, getTableCosumn} from "@/api/index";
    import {anovaOneWay, checkData, getDataList} from "@/api/dataDeal";

    export default {
        props: ["data"],
        data() {
            return {
                choicedTableId:"",
                formParams: {
                    type: []
                },
                type: "",
                formParams1: {
                    ku: ""
                },
                currentId: "1",
                tabData: [
                    {name: "数据", id: 1},
                    {name: "参数", id: 2},
                    {name: "路径", id: 3}
                ],
                ku: [],
                ClassifiyList: [],
                dataList: [
                    {name: "经济人口", value: "v"},
                    {name: "汽车", value: "h"}
                ],
                selfKu: "",
                rules: {
                    /* type: [
                         {
                             type: "array",
                             required: true,
                             message: "请至少选择一个因素",
                             trigger: "change"
                         }
                     ]*/
                },
                rules1: {
                    ku: [{required: true, message: "选择数据库", trigger: "change"}]
                },
                result: []
            };
        },
        created() {
            this.initData();
        },
        methods: {
            realForm() {
                let params = {
                    table_name: this.formParams1.ku,
                    X:
                        this.formParams1.zu == "v"
                            ? [this.formParams1.cate1]
                            : this.formParams1.cate3,
                    Y: this.formParams1.zu == "v" ? [this.formParams1.cate2] : [],
                    alpha: this.formParams.alpha,
                    table_direction: this.formParams1.zu,
                    analysis_options: this.formParams.type
                };
                anovaOneWay(params)
                    .then(res => {
                        if (res.code == 200) {
                            this.$emit("getRes", res.res);
                        }
                    })
                    .catch(err => {
                    });
            },
            lookForm() {
                let params = {
                    table_name: this.formParams1.ku,
                    X:
                        this.formParams1.zu == "v"
                            ? [this.formParams1.cate1]
                            : this.formParams1.cate3,
                    Y: this.formParams1.zu == "v" ? [this.formParams1.cate2] : []
                };
                checkData(params)
                    .then(res => {
                        if (res.code == 200) {
                            this.$emit("lookRes", res.res);
                        }
                    })
                    .catch(err => {
                    });
            },
            //  lookDetail(formName) {
            //    this.$refs.dialogForm1.validate(valid1 => {
            //      if (valid1) {
            //        this.lookForm();
            //      } else {
            //        return false;
            //      }
            //    });
            //  },
            submitForm(formName) {
                console.log(this.formParams)
                if(this.formParams.type.length>1){
                    this.$message.error("不能多选")
                }else{
                    if (this.formParams.type.includes('other')) {
                        this.formParams.type[0]=this.type
                        this.$emit('getCdata', this.formParams)
                    }else{
                        this.$emit('getCdata', this.formParams)
                    }

                }

                /* this.$refs.dialogForm.validate(valid => {
                   if (valid) {
                     this.$refs.dialogForm1.validate(valid1 => {
                       if (valid1) {
                         this.realForm();
                       } else {
                         this.$message({
                           type: "info",
                           duration: "1500",
                           message: "请选择数据",
                           showClose: true
                         });
                         return false;
                       }
                     });
                   } else {
                     return false;
                   }
                 });*/
            },
            handleClick(item) {
                this.currentId = item.id;
            },
            selectTable(val) {
                this.designList = [];
                this.ininSearch(val);
            },
            selectku(val) {
                console.log(val);
                this.selfEl = val;
                this.handleDataList(val);
            },
            selectMydata(e){
                this.choicedTableId = e.id;
                var data={
                    encodeTableName:e.tableName,
                    Name:e.userTableName,
                    id:e.id,
                };
                console.log(data)
                this.$emit('gettableId',data);
            },
            handleDataList() {
                const params = {
                    tableId: this.choicedTableId
                };
                getDataList(params).then(res => {
                    if (res.code == 200000) {
                        console.log(res);
                        this.formParams.type=[]
                        this.$emit('getData', res)
                    }
                });
            },
            initData() {
                //this.dataList = [];
                myDataList()
                    .then(res => {
                        if (res.code == 200000) {
                            this.ClassifiyList = res.data.tableClassification;
                            this.ku = res.data.tableInfo;

                        }
                    })
                    .catch(err => {
                    });
            },
            ininSearch(code) {
                getTableCosumn({name: code})
                    .then(res => {
                        if (res.code == 200000) {
                            this.designList = res.data;
                        }
                    })
                    .catch(err => {
                    });
            }
        }
    };
</script>
<style lang="scss" scoped>
  @import "@/assets/scss/theme.scss";

  li {
    flex: 1;
    padding-bottom: 10px;
    padding-top: 5px;
    @include layoutMode(both);
    cursor: pointer;
    box-sizing: border-box;
  }

  .tabActive {
    color: #409eff;
    position: relative;

    &::after {
      content: "";
      display: block;
      position: absolute;
      bottom: -2px;
      left: calc(50% - 15px);
      width: 30px;
      height: 2px;
      background: #409eff;
    }
  }

  .checkbox {
    margin-bottom: 10px;
    text-align: center;
  }
</style>
