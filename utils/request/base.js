import { Config } from "config.js";
class Base {
     constructor() {
       this.baseRequestUrl = Config.baseUrl;
     }
    //封装好的请求方法
    request(params) {
        if (!params.method) {
            params.method = "GET";
        }
        var header = wx.getStorageSync('loginData').header;
        wx.request({
            url: this.baseRequestUrl + params.url,
            data: params.data,
            // header:{Cookie:header},
            //  header:{'Cookie':'SESSION='+ header},
            header:{'token':header},
            method: params.method,
            success: function (res) {
                params.sCallBack && params.sCallBack(res);
            },
            fail: function (res) {
                params.eCallBack && params.eCallBack(res);
            },
            complete: function (res) {
                params.coCallBack && params.coCallBack(res);
            },
        })
    }
}

export { Base }
