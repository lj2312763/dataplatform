
import {HTTPURL} from '../requestUrl';

 //添加分类
export const addClassification = params => { return axios.post(`${HTTPURL}/data/myData/addClassification`, params).then(res => res.data); };
 // 表格上传
export const excelOperate = params => { return axios.post(`${HTTPURL}/data/excelOperate/load`, params).then(res => res.data); };
 // 数据列表
export const myDataList = params => { return axios.post(`${HTTPURL}/data/myData/myDataList`, params).then(res => res.data); };
 // 数据表表头编辑
export const editMyData = params => { return axios.post(`${HTTPURL}/data/myData/editMyData`, params).then(res => res.data); };
 // 表格设计编辑
export const formDesign = params => { return axios.post(`${HTTPURL}/data/abnormalValue/formDesign`, params).then(res => res.data); };
 // 表格设计编辑
export const tableEdit = params => { return axios.post(`${HTTPURL}/data/excelCalculation/tableEdit`, params).then(res => res.data); };
 // 表格备份
export const backups = params => { return axios.get(`${HTTPURL}/data/excelOperate/backups`, {params: params}).then(res => res.data); };
 // 数据删除
export const delTable = params => { return axios.post(`${HTTPURL}/data/myData/delTable`, params).then(res => res.data); };
 // 获取用户分类
export const getUserClassification = params => { return axios.get(`${HTTPURL}/data/myData/getUserClassification`, {params: params}).then(res => res.data); };
 // 获取表格数据
export const getTableData = params => { return axios.get(`${HTTPURL}/data/excelOperate/getTableData`, {params: params}).then(res => res.data); };
 // 获取表格数据表头
export const getTableCosumn = params => { return axios.get(`${HTTPURL}/data/excelOperate/getTableCosumn`, {params: params}).then(res => res.data); };
 // 下载
export const downLoad = params => { return axios.get(`${HTTPURL}/data/excelOperate/export`, {params: params,responseType: "blob"}).then(res => res.data); };