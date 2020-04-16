//app.js

import { Base } from "/utils/request/base.js";
var base = new Base();
var util = require('/utils/cache.js');
App({
  globalData: {
    imgUrl: "http://139.155.113.100:8686/",
    color: '#E10004',
  },
  onLaunch (options) {
    this.getOpenId()
   
  },
  onShow: function () {
    this.getShopNum()
    this.refresh()
  },
     //获取openID
  getOpenId: function () {
    var that = this;
    wx.login({
        success: function (res) {
            console.log(res)
            if (res.code) {
                // 发起网络请求
                wx.request({
                    url: 'http://139.155.113.100:8085/app/getOpenId?code=' + res.code,
                    success: function (data) {
                        console.log(data);
                        wx.setStorage({
                            key:"sessionId",
                            data:data.data.result.sessionKey
                          });
                        wx.setStorage({
                            key:"openId",
                            data:data.data.result.openId
                        });
                       
                       that.login()
                      },
                    fail: function (data) {
                        console.log(data);
                    }
                })
            }
        }
    })
    
  },
  // 用户过期
refresh(){
  var that=this;
  var userId=wx.getStorageSync('userId')
  var params = {
    url: '/app/user/refreshUserInfo',
    method: 'GET',
    data: {
      'id':userId
    },
    sCallBack: function (data) {
        if(data.data.errorCode=="-200"){
            wx.removeStorageSync('session')
        }      
    },
    eCallBack: function () {
    }
}
base.request(params);
},
// 是否存在用户
login(){
  var that=this;
  var openId=wx.getStorageSync('openId')
  // debugger
  var params = {
      url: '/app/user/weixinLogin',
      method: 'POST',
      data: {
        'openId':openId
      },
      sCallBack: function (data) {
          if(data.data.errorCode=="0"){
            wx.setStorage({
              key:"session",
              data:data.data.result.sessionId
            });
            wx.setStorage({
              data: data.data.result.phone,
              key: 'phone',
            })
            wx.setStorage({
              key:"userId",
              data:data.data.result.id
            });
            var value = { header: data.data.result.sessionId}
            console.log(value)
            util.put('loginData', value)
          }else{
            wx.removeStorageSync('session')
          }
        
        
      },
      eCallBack: function () {
      }
  }
  base.request(params);
},
  nomore_showToast :function () {
    wx.showToast({
      title: '没有更多数据',
      icon: 'none',
      duration: 1500,
      mask: true
    })
  },
  // 购物车数量
  getShopNum(){
    var that=this;
    var userId=wx.getStorageSync('userId')
    var arg={
      'userInfo':{
        'id':userId
      }
    }
    var params = {
        url: '/app/commodity/findShoppingCartInfoAllNumberByUserId',
        method: 'POST',
        data: JSON.stringify(arg),
        sCallBack: function (data) {     
       if (data.data.result != 0) {
              wx.setTabBarBadge({
                index: 1,
                text: String(data.data.result)
              })
            } else {
              wx.removeTabBarBadge({
                index: 1,
                text: ''
              })
            }
        },
        eCallBack: function () {
        }
    }
    base.request(params);
  },
})