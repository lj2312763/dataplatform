
import {HTTPURL} from '../requestUrl';

/**
 * 登录
 */
export const requestLogin = params => { return axios.post(`${HTTPURL}/ucenter/user/login`, params).then(res => res.data); };
//export const requestLogin = params => { return axios.post(`https://www.yzsmart.top/ucenter/user/login`, params).then(res => res.data); };
