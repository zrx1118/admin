import axios from 'axios';
import { Message, MessageBox} from 'element-ui';
import store from '../store'

const service = axios.create({
    baseUrl: process.env.BASE_API, // api 的 base_url
    timeout: 5000
})

service.interceptors.request.use(
    config => {
        if(store.getters.token) {
            config.headers['X-Token'] = getToken();
        }
        return config;
    },
    error => {
        console.log(error);
        Promise.reject(error);
    }
)

service.interceptors.response.use(
    response => {
        const res = response.data
        if (res.code !== 200) {
            Message({
                message: res.message,
                type: 'error',
                duration: 5 * 1000
            })
            if (res.code === 50008 || res.code ===50012 || res.code === 50014) {
                MessageBox.confirm(
                    '你已被登出，可以取消继续留在该页面，或者重新登录',
                    '确定登出',
                    {
                        confirmButtonText: '重新登录',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).then(() => {
                    store.dispatch('FedLogOut')
                    .then(() => {
                        location.reload();
                    })
                })
            }
            return Promise.reject('error')
        } else {
            return response.data
        }
    },
    error => {
        console.log('err' + error)
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service
