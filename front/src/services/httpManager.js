import axios from "axios";
import NProgress from 'nprogress';
import {message} from "antd"

axios.defaults.timeout = 15000;

axios.interceptors.request.use(config => {
    console.time("请求耗时....")
    NProgress.start();
    return config;
}, err => {
    NProgress.done();
    return Promise.reject(err);
});

axios.interceptors.response.use(response => {
    NProgress.done();
    return response;
}, err => {
    NProgress.done();
    message.info('请求错误，稍后刷新', 2.5);
    return Promise.reject(err.response.data);
})

export default axios;

