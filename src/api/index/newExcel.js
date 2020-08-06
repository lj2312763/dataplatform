
import {HTTPURL} from '../requestUrl';

/**
 * 添加分类
 */
export const addClassification = params => { return axios.post(`${HTTPURL}/data/myData/addClassification`, params).then(res => res.data); };


/**
 * 新建表，添加数据
 */
export const addTableData = params => { return axios.post(`${HTTPURL}/data/excelOperate/createTable`, params).then(res => res.data); };