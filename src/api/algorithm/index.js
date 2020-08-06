
import {HTTPURL,urlData1} from '../requestUrl';
console.log(urlData1)
 //训练 
export const train = params => { return axios.post(`${urlData1}/algorithm/logisticRegression/train`, params).then(res => res.data); };
 //测试
export const evaluate = params => { return axios.post(`${urlData1}/algorithm/logisticRegression/evaluate`, params).then(res => res.data); };
