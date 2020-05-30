//app.js

import { Base } from "/utils/request/base.js";
var base = new Base();
var util = require('/utils/cache.js');
App({
  globalData: {
    imgUrl: "https://resource.zgmrxp.com/",
    imgUrls: "https://photo.zgmrxp.com/",
    color: '#E10004',
  },
  onLaunch (options) {
    this.getOpenId()
   
  },
  onShow: function (e) {
    this.getShopNum()
    this.refresh()
  },
 
     //获取openID
  getOpenId: function () {
    var that = this;
    wx.login({
        success: function (res) {
           
            if (res.code) {
                // 发起网络请求
                wx.request({
                    url: 'https://www.zgmrxp.com/app/getOpenId?code=' + res.code,
                    success: function (data) {
                       
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
        }else{
          that.globalData.personal=data.data.result//个人信息
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
  var nickName = wx.getStorageSync('nickName')
  var photo = wx.getStorageSync('photo')
  // debugger
  var params = {
      url: '/app/user/weixinLogin',
      method: 'POST',
      data: {
        'openId':openId,
        'nickName':nickName,
        'photo':photo
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
    var headInfo = wx.getStorageSync('headInfo')
    
    var arg={
      'userInfo':{
        'id':userId
      },
      'headInfo':{
        'id':headInfo.id
      }
    }
    var params = {
        url: '/app/commodity/findShoppingCartInfoAllNumberByUserId',
        method: 'POST',
        data: JSON.stringify(arg),
        sCallBack: function (data) {     
       if (data.data.result != 0) {
        //  debugger
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