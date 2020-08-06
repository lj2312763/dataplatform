<template>
  <div class="c-wrapper-20">
    <div class="c-text-between">
      <div class="operateTable">
        <div>
          <div class="c-button-wrapper c-text-left">
            <el-button size="mini" plain @click="exportDataTable()">导出表格</el-button>
            <el-button size="mini" plain @click="handleAdd()">导出PDF</el-button>
          </div>
          <vxe-grid
            border
            resizable
            highlight-hover-row
            ref="xTable"
            :export-config="tableExport"
            :data="tableData"
            :columns="tableColumn"
            :edit-config="{trigger: 'click', mode: 'cell', showStatus: true}"
            @edit-closed="editClosedEvent">
            <!--   <vxe-table-column :field="item.field" :title="item.title" :edit-render="{name: 'input'}"
                                 v-for="(item,index) in tableHead"></vxe-table-column>-->
          </vxe-grid>
          <div class="c-button-wrapper c-text-left">
            <el-button size="mini" plain @click="saveEditTable()">保存</el-button>
            <el-button size="mini" plain @click="handleAdd()">帮助</el-button>
          </div>
        </div>
      </div>

      <div class="operate">
        <operate @getData="getData($event)" @getCdata="getCdata($event)" @gettableId="gettableId($event)"></operate>
      </div>
    </div>
    <!-- 分页 -->
    <!-- <pagination :total="pageOption.total"  :page.sync="pageOption.page" :size.sync="pageOption.size" @pagination="initData"></pagination> -->
    <!-- <add v-if="addFlag" :dialogData="dialogData" @closeDialog="closeDialog"></add> -->
  </div>
</template>
<script>
    import operate from "@/components/operate/character";
    import {charextract} from "@/api/data";
    import {tableEdit,downLoad} from '@/api/index';

    export default {
        components: {
            operate
        },
        data() {
            return {
                enCodeTableName:"",
                tableName:"",
                strParam: [],
                tableColumn: [],
                tableExport: {
                    // 默认选中类型
                    type: 'xlsx',
                    // 自定义类型
                    types: ['xlsx', 'pdf', 'html', 'xml', 'txt']
                },
                strFind: "",
                columnName: "",
                tableId: "",
                tableData: [],
                sexList: [],
                currentId: "2",
                dataList: [],
                tableLoading: false,
                addFlag: false,
                tableHead: [],
                dialogData: {
                    title: "",
                    data: "",
                    type: "", //type 1：新增，2：编辑
                    viewFlag: false
                }
            };
        },
        created() {
            //this.initData();
        },
        methods: {
            saveEditTable() {
                let selectRecords = this.$refs.xTable.getTableData().tableData;
                selectRecords.forEach(item => {
                    delete item['_XID']
                })
                console.log(selectRecords)
                let params = {
                    jsonArray: selectRecords,
                    tableId: this.tableId
                };
                tableEdit(params).then(res => {
                    if (res.code == 200000) {
                        this.$message({
                            type: 'success',
                            duration: '1500',
                            message: "保存成功",
                            showClose: true
                        });
                    } else {
                        this.$message({
                            type: 'error',
                            duration: '1500',
                            message: "保存失败",
                            showClose: true
                        });
                    }
                }).catch(err => {
                    this.$message({
                        type: 'error',
                        duration: '1500',
                        message: "保存失败",
                        showClose: true
                    });
                });
            },
            gettableId(data) {
                this.tableId = data.id;
                this.enCodeTableName = data.encodeTableName || '';
                this.tableName = data.Name
            },
            exportDataTable(){
                let Tname = this.enCodeTableName;
                if(!Tname){
                    this.$message({
                        type: 'error',
                        duration: '1500',
                        message:"请先选择要导出的表格",
                        showClose: true
                    })
                }else{
                    downLoad({name:this.enCodeTableName}).then(res=>{
                        var eleLink = document.createElement('a');
                        eleLink.download = this.tableName;
                        eleLink.style.display = 'none'
                        var blob = new Blob([res],{type: 'application/vnd.ms-excel'});
                        eleLink.href = URL.createObjectURL(blob);
                        document.body.appendChild(eleLink);
                        eleLink.click();
                        // 然后移除
                        document.body.removeChild(eleLink);
                    }).catch(err => {
                    });
                }

            },
            getCdata(data) {
                console.log("父组件", data)
                var params = {
                    "tableId": this.tableId,
                    "columnName": data.columnName,
                    "direction": data.direction,
                    "extractChar": data.extractChar,
                    "charCount": data.charCount,
                    "accessToken": localStorage.getItem('yk-token')
                };
                charextract(params).then(res => {
                    console.log(res)
                    if (res.code === 500000) {
                        this.$message.error(res.message)
                    } else {
                        this.tableHead = [];
                        this.tableColumn = [];
                        for (var k in res.data[0]) {
                            this.tableColumn.push({
                                "field": k,
                                "title": k,
                                "editRender": {name: 'input'},
                            })
                        }
                        console.log(this.tableColumn)
                        this.tableData = res.data;
                        this.$message.success(res.message)
                    }
                }).catch(err => {

                });
                console.log("父组件", params)

            },
            ChangeEvent({column}) {
                console.log(`${column.title} 触发 input 事件`)
            },
            getData(data) {
                this.tableHead = [];
                this.tableColumn = [];
                this.strParam = [];
                for (var k in data.data[0]) {
                    this.tableColumn.push({
                        "field": k,
                        "title": k,
                        "editRender": {name: 'input'},
                    })
                    this.strParam.push(k)
                }
                this.tableData = data.data;
            },
            headerClickEvent(column) {
                console.log(column.target.innerHTML)
                this.columnName = column.target.innerHTML;
                this.$message.success("获取成功")
            },
            handleClick(item) {
                this.currentId = item.id;
            },
            initData() {
                this.dataList = [];
                // this.tableLoading = true;
                // let params = Object.assign({}, this.historySearchKey, {
                //     page:{
                //         pageSize: this.pageOption.size,
                //         pageIndex: this.pageOption.page == 0 ? 0 : this.pageOption.page -1,
                //     }
                // });
                // infoQueryPage(params).then(res=>{
                //     if (res.status == 200) {
                //         this.dataList = res.data.list;
                //         this.$refs.table.bodyWrapper.scrollTop = 0;
                //         this.pageOption.total = res.data.totalCount;
                //     }
                //     this.tableLoading = false;
                //     this.searchloading = false;
                // }).catch(err => {
                //     this.tableLoading = false;
                //     this.searchloading = false;
                // });
            },
            detailHandle(type, val) {
                //type 1：新增，2：编辑，3：查看详情
                if (type == 3) {
                    this.dialogData.title = "查看详情";
                } else {
                    if (type == 2) {
                        this.dialogData.title = "编辑";
                    } else {
                        this.dialogData.title = "新增";
                    }
                }
                if (val) {
                    this.dialogData.data = val;
                } else {
                    this.dialogData.data = null;
                }
                this.dialogData.type = type;
                this.addFlag = true;
            },
            handleUpdate(index, item) {
            },
            handleDelete(index, item) {
                this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
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
                    })
                    .catch(() => {
                        // this.$message({
                        //     type: 'info',
                        //     duration: '1500',
                        //     message: "已取消删除！",
                        //     showClose: true
                        // });
                    });
            }
        }
    };
</script>
<style lang="scss" scoped>
  @import "@/assets/scss/theme.scss";

  .operateTable {
    flex: 1;
    background: #fff;

    li {
      flex: 1;
      padding-bottom: 10px;
      padding-top: 10px;
      @include layoutMode(both);
      cursor: pointer;
      box-sizing: border-box;
    }

    .tabActive {
      position: relative;
      color: #409eff;

      &::after {
        content: "";
        display: block;
        position: absolute;
        bottom: 0;
        left: calc(50% - 15px);
        width: 30px;
        height: 2px;
        background: #409eff;
      }
    }
  }

  .operate {
    margin-left: 20px;
    width: 300px;
    background: #fff;
  }
</style>
