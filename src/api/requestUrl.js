
let HTTPURL = '';
let urlData = '';
let urlData1 = '';

if(process.env.NODE_ENV == 'development') { // 开发环境
    HTTPURL = window.config.url;
    urlData = window.config.urlData;
    urlData1 = window.config.urlData1;
}else {
    HTTPURL = window.config.url;
    urlData = window.config.urlData;
    urlData1 = window.config.urlData1;
}
export {
	HTTPURL,urlData,urlData1
}
