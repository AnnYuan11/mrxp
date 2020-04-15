//app.js

import { Base } from "/utils/request/base.js";
var base = new Base();
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
                       
                      //  that.login()
                      },
                    fail: function (data) {
                        console.log(data);
                    }
                })
            }
        }
    })
    
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
  }
})