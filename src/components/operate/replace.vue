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
      <div style="padding: 10px">
        <div>
          <div style="text-align: center">
            请选择字段
          </div>
          <el-select v-model="strParam"  placeholder="请选择字段" style="    width: 100%;
"><el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
          </el-select>
        </div>
        <div style="display: flex;flex-direction: row;margin-top: 20px">
          <span style="position: relative;top: 12px">输入单位</span>
          <el-input placeholder="请输入单位" style="width: 160px;margin-left: 15px" v-model="strFind"></el-input>
        </div>
        <div style="display: table-caption;margin-top: 20px">
          <el-radio-group v-model="type">
            <el-radio :label="1">
              替换
              <el-input v-if="type===1" placeholder="请输入替换单位" style="width: 160px;margin-left: 10px" v-model="strReplace"></el-input>
            </el-radio>
            <!-- <el-radio :label="2">
               删除
               <el-input v-if="type===2" placeholder="请输入删除单位" style="width: 160px;margin-left: 10px" v-model="strReplace1"></el-input>
             </el-radio>-->
          </el-radio-group>
        </div>
      </div>
      <div class="c-text-center" style="margin-top: 20px">
        <el-button type="primary" size="small" @click="submitForm">确定</el-button>
      </div>
    </div>
    <div class="opContent c-mt-20 c-mb-10" v-show="currentId == 3">

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
                options: [],
                type: 1,
                strParam: "",
                strFind: "",
                strReplace: "",
                strReplace1: "",
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
            handleClick(item){
                this.currentId=item.id
            },
            submitForm() {
                var data={
                    "strParam":this.strParam,
                    "strFind":this.strFind,
                    "strReplace":this.strReplace,
                    "strReplace1":this.strReplace1,
                    "type":this.type,
                }
                this.$emit('getCdata', data)
            },
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
            selectTable(val) {
                this.designList = [];
                this.ininSearch(val);
            },
            selectku(val) {
                console.log(val);
                this.selfEl = val;
                this.handleDataList(val);
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
            handleDataList() {
                const params = {
                    tableId: this.choicedTableId
                };
                getDataList(params).then(res => {
                    if (res.code == 200000) {
                        console.log(res);
                        this.options = [];
                        for (var k in res.data[0]) {
                            this.options.push({
                                value: k,
                                label: k
                            })
                        }
                        this.strParam="";
                        this.strFind="";
                        this.strReplace="";
                        this.strReplace1="";
                        this.type=1;
                        console.log(this.options);
                        this.$emit('getData', res)

                    }
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
