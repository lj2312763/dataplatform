import App from './App';
import router from './router';
import store from './store';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
// 进度条
// 进度条
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
// 设置进度条
NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })

Vue.config.productionTip = false;

import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'
Vue.use(VXETable);
// import VXETablePluginExportPDF from 'vxe-table-plugin-export-pdf'
// VXETable.use(VXETablePluginExportPDF)
// import VXETablePluginExportXLSX from 'vxe-table-plugin-export-xlsx'
// VXETable.use(VXETablePluginExportXLSX)

// 全局静态资源
import '@/assets/scss/reset.scss';
import '@/assets/scss/public.scss';
import '@/assets/scss/element-ui-reset.scss';
import '@/assets/icon-font/iconfont.css';

// 权限
import { setAuthInfo, getAdminId, getAuthInfo, removeAuthInfo } from '@/session/index';
// 在免登录白名单，直接进入
const whiteList = ['/login', '/404'];

//取消请求的对象
window.cancleSource = {};
window.cancelToken = axios.CancelToken;

router.beforeEach((to, from, next) => {
    window.cancleSource.cancel && window.cancleSource.cancel()
    window.cancleSource = window.cancelToken.source()
    NProgress.start();
    next();
    // const ADMINID = getAdminId();
    // if(ADMINID) {
    //     // 回填用户信息
    //     store.dispatch('setAuthInfo', getAuthInfo());
    //     if(to.path === '/login') {
    //         next({path: '/'});
    //     }else {
    //         next();
    //     }
    // }else {
    //     if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
    //         next()
    //     } else {
    //         next('/login'); // 否则全部重定向到登录页
    //     }
    //     NProgress.done()
    // }
});

router.afterEach(() => {
    NProgress.done()
});

/* eslint-disable no-new */
const vm = new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})

// axios 过滤器
import axiosFilter from './api/axiosConfig.js';
axiosFilter(vm);