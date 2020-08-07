<template>
  <div class="c-padding-10">
    <ul class="c-text-both">
      <li v-for="item in tabData" :class="{'tabActive':currentId===item.id}" :key="item.id" @click="handleClick(item)">
        {{item.name}}
      </li>
    </ul>
    <!--参数部分-->
    <div class="opContent c-mt-20 c-mb-10 box" v-show="currentId === 2">
      <template v-for="(item, i) in columnArr">
        <div style="padding: 10px">
          <div class="opContent-col-row">
            <span class="opContent-col-label">
              请选择字段
            </span>
            <span class="opContent-col-item">
              <el-select v-model="item.field" placeholder="请选择字段" style="width: 80%;" class="opContent-col-item-select">
                <el-option
                  v-for="item in optionsArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-button type="danger" v-if="columnArr.length > 1" size="small" @click="fieldMinus(i)">删除</el-button>
            </span>

          </div>
        </div>
        <div style="padding: 10px" v-show="item.field">
          <div class="opContent-col-item">
            <span style="text-align: center;margin-right: 8px">
              计算操作:
            </span>
            <vxe-radio-group v-model="item.operation" @change="checkOperation(item, i)">
              <vxe-radio class="operation-text" label="+" content="+"></vxe-radio>
              <vxe-radio class="operation-text" label="-" content="-"></vxe-radio>
              <vxe-radio class="operation-text" label="*" content="x"></vxe-radio>
              <vxe-radio class="operation-text" label="/" content="÷"></vxe-radio>
            </vxe-radio-group>
          </div>
        </div>
      </template>
      <div class="c-text-center" style="margin-top: 20px">
        <el-button type="primary" size="small" @click="submitFunc1">确定</el-button>
        <el-button type="danger" size="small" @click="clearFunc1">清除</el-button>
      </div>
    </div>
    <!--数据部分-->
    <div class="opContent  c-mt-20 c-mb-10" v-show="currentId===1">
      <el-form ref="dialogForm" :model="formParams1" label-width="90px" size="mini">
        <el-form-item label="选择数据表">
          <el-select v-model="formParams1.data" placeholder="我的数据" value-key="id" @change="selectMydata($event)">
            <el-option v-for="(item,index) in dataList" :key="index" :label="item.userTableName"
                       :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="c-text-center">
        <el-button type="primary" size="small" @click="chakanFunc">查看数据</el-button>
      </div>
    </div>
    <!--路径部分-->
    <div class="opContent  c-mt-20 c-mb-10" v-show="currentId==3">
      <div class="c-text-center c-mb-20">tab3</div>
      <div class="c-text-center">
        <el-button type="primary" size="small">确定</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import {myDataList, getTableData} from '@/api/index';
  import {getDataList, colCalculate} from '@/api/dataDeal/index'

  export default {
    data() {
      return {
        formParams1: {
          data: null
        },
        currentId: 1,
        tabData: [
          {name: "数据", id: 1},
          {name: "参数", id: 2},
          {name: "路径", id: 3},
        ],
        dataList: null,
        choicedTableId: '',
        options: [],
        columnArr: [{ field: '', operation: '' }]
      };
    },
    created() {
      this.initData();
    },
    methods: {
      selectMydata(e) {
        console.log(e)
        this.choicedTableId = e.id;
        const encodeTableName = e.tableName;
        let Name  = this.userTableName = e.userTableName;
        let tableInfo = {
          encodeTableName,
          Name
        };
        this.$emit('putChoiceTableId', e.id, tableInfo);
      },
      handleClick(item) {
        this.currentId = item.id
        this.formParams = {
          mainKey: '',
          weidu: '',
          dingwei: []
        };
      },
      initData() {
        this.dataList = [];
        myDataList().then(res => {
          if (res.code == 200000) {
            this.ClassifiyList = res.data.tableClassification;
            this.dataList = res.data.tableInfo;
          }
        }).catch(err => {
        });
      },
      chakanFunc() {
        let kuName = this.formParams1.data.tableName;
        this.tableKayName = kuName;
        let parm = {
          name: kuName
        };
        getTableData(parm).then(res => {
          if (res.code == 200000) {
            let detailData = res.data.list;
            this.options = [];
            for (var k in detailData[0]) {
              if(typeof detailData[0][k] === 'number'){
                this.options.push({
                  value: k,
                  label: k
                })
              }
            }
            this.columnArr = [{ field: '', operation: '' }]
            this.$emit('beforeOperData', detailData);
          } else {
            this.$message({
              type: 'error',
              duration: '1500',
              message: "获取数据失败",
              showClose: true
            });
          }
        }).catch(err => {
          this.$message({
            type: 'error',
            duration: '1500',
            message: "获取数据失败",
            showClose: true
          });
        });
      },
      submitFunc1() {
        let strParam = ''
        let strParamArr = []
        for (let i = 0, len = this.columnArr.length; i < len; ++i){
          const item = this.columnArr[i]
          if(len === 1){ // 只有一个字段时
            return this.$message.error('请至少选择2个字段')
          }else if(i !== len - 1){  // 有多个字段，并且为非倒数第一个字段时
            if(item.field && item.operation){
              strParam += item.field + item.operation
              strParamArr.push(item.field)
            }else {
              return this.$message.error('请选择完整')
            }
          }else { // 最后一个字段
            if(item.field){
              strParam += item.field + item.operation
              strParamArr.push(item.field)
            }else {
              return this.$message.error('最后一个字段请选择')
            }
          }
        }

        let parmsData = new FormData();
        parmsData.append('tableId', this.choicedTableId);
        parmsData.append('strParam', strParam);
        colCalculate(parmsData).then(res => {
          if (res.code == 200000) {
            let detailData = res.data;
            this.$emit('afterOperData', detailData);
          } else {
            this.$message({
              type: 'error',
              duration: '1500',
              message: "获取数据失败",
              showClose: true
            });
          }
        }).catch(err => {
          this.$message({
            type: 'error',
            duration: '1500',
            message: "获取数据失败",
            showClose: true
          });
        })
      },
      clearFunc1() {
        this.columnArr.splice(1, this.columnArr.length - 1)
      },
      /**
       * 添加一个字段
       * @param i
       */
      fieldPlus(i){
        if(this.columnArr.length >= 10){
          return this.$message.error('最多只能有10个字段')
        }
        this.columnArr.push({ filed:'', operation: '' })
      },
      /**
       * 减去一个字段
       * @param i
       */
      fieldMinus(i){
        if(this.columnArr <= 1){
          return
        }
        this.columnArr.splice(i, 1)
      },
      /**
       * 操作符选择事件
       */
      checkOperation(item, i){
        // 操作最后一个才做符时
        if(this.columnArr.length-1 === i){
          this.fieldPlus(i+1)
        }

      },
    },
    computed: {
      optionsArr(){
        return this.options.filter(e=>!(this.columnArr.map(it=>it.field).includes(e.label)))
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import '@/assets/scss/theme.scss';

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

  .checkBox_container {
    display: flex;
    margin-bottom: 10px;
    font-size: 14px;
    color: #606266;
    .fanwei_title {
      margin-right: 16px;
    }
    .fanwei_content {
      .allTable {
        margin-bottom: 10px;
      }
    }
  }
  .box.opContent{
    height: 412px;
    overflow-y: auto;
  }
  .opContent-col-row{
    display: flex;
    .opContent-col-label{
      width: 100px;
      display: flex;
      align-items: center;
      margin-right: 8px;
    }
  }
  .opContent-col-item{
    display: flex;
    align-items: center;
    .opContent-col-item-select{
      margin-right: 8px;
    }
    .operation{
      width: 20px;
      height: 20px;
      cursor: pointer;
      font-size: 16px;
      margin-right: 10px;
    }
  }
  .operation-text{
    font-size: 20px;
  }
</style>
