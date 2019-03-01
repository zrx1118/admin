import Mock from 'mockjs'
import userAPI from './user'

Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
Mock.XHR.prototype.send = function() {
    if (this.custom.xhr) {
        this.custom.xhr.withCredentials = this.withCredentials || false
    }
    this.proxy_send(...arguments)
}

Mock.mock(/\/user\/login/, 'post', userAPI.login)
Mock.mock(/\/user\/info/, 'get', userAPI.getInfo)
Mock.mock(/\/user\/logout/, 'post', userAPI.logout)

export default Mock
