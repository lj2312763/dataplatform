import axios from 'axios'
// 创建axios实例,在创建实例时设置配置默认值。;
const service = axios.create({
  baseURL: "https://test.yzsmart.top:38443/data", // api的base_url
  timeout: 15000,// 请求超时时间
  // headers: {'X-Custom-Header': 'foobar'}//请求头部
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
});
//添加请求拦截器
service.interceptors.request.use(function (config) {
  //在发送请求之前做某事
  /*token*/
  if (localStorage.getItem('yk-token')) {
    config.headers['accessToken'] = localStorage.getItem('yk-token')
  }
  return config;
}, function (error) {
  //请求错误时做些事
  return Promise.reject(error);
})


//添加响应拦截器
service.interceptors.response.use(function (response) {
  //对响应数据做些事
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
   */
  if (response.data.code === 200) {
    console.log("请登录！！！")
  } else {
    return response.data
  }

}, function (error) {
  //请求错误时做些事
  return Promise.reject(error);
});
export default service
