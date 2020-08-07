import { HTTPURL } from '../requestUrl';
import { urlData } from "../../../src/api/requestUrl";

//列合并
export const columnMerge = params => {
    return axios.post(`${HTTPURL}/data/column/columntransfer`, params).then(res => res.data);
};

//单位转换
export const unitChange = params => {
    return axios.post(`${HTTPURL}/data/excelCalculation/conversion`, params).then(res => res.data);
};
export const anovaOneWay = params => {
    return axios.post(`${urlData}/anovaOneWay`, params).then(res => res.data);
};
//添加分类
export const checkData = params => {
    return axios.post(`${urlData}/checkData`, params).then(res => res.data);
};
//添加分类
export const tSingle = params => {
    return axios.post(`${urlData}/tSingle`, params).then(res => res.data);
};
//添加分类
export const tTwoPair = params => {
    return axios.post(`${urlData}/tTwoPair`, params).then(res => res.data);
};
//添加分类
export const tTwoIndependent = params => {
    return axios.post(`${urlData}/tTwoIndependent`, params).then(res => res.data);
};
// 获取查询数据表中的数据
export const getDataList = params => {
    return axios
        .get(`${HTTPURL}/data/myData/dataList`, { params: params })
        .then(res => res.data);
};
//获取计算单位列表
export const getUnitList = params => {
    return axios.post(`${HTTPURL}/data/excelCalculation/getCalList`,params).then(res => res.data);
};

//行合并
export const rowMerge = params => {
    return axios.post(`${HTTPURL}/data/column/rowtransfer`,params).then(res => res.data);
};
//列计算操作
export const colCalculate = params => {
  return axios.post(`${HTTPURL}/data/excelCalculation/Calculation`,params).then(res => res.data);
};
