
import {HTTPURL,urlData} from '../requestUrl';

 //添加分类
export const anovaOneWay = params => { return axios.post(`${urlData}/anovaOneWay`, params).then(res => res.data); };
 //添加分类
export const checkData = params => { return axios.post(`${urlData}/checkData`, params).then(res => res.data); };
 //添加分类
export const tSingle = params => { return axios.post(`${urlData}/tSingle`, params).then(res => res.data); };
 //添加分类
export const tTwoPair = params => { return axios.post(`${urlData}/tTwoPair`, params).then(res => res.data); };
 //添加分类
export const tTwoIndependent = params => { return axios.post(`${urlData}/tTwoIndependent`, params).then(res => res.data); };
 //多因素方差分析
export const anovaAllWay = params => { return axios.post(`${urlData}/anovaAllWay`, params).then(res => res.data); };
 //多因素方差分析
export const nonparametricTwoIndependent = params => { return axios.post(`${urlData}/nonparametricTwoIndependent`, params).then(res => res.data); };
 //多因素方差分析
export const nonparametricMultiIndependent = params => { return axios.post(`${urlData}/nonparametricMultiIndependent`, params).then(res => res.data); };
 //Wilcoxon符号秩检验
export const nonparametricTwoPair = params => { return axios.post(`${urlData}/nonparametricTwoPair`, params).then(res => res.data); };
