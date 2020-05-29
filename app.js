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
   this.autoUpdate()
  },
  onShow: function (e) {
    this.getShopNum()
    this.refresh()
  },
  autoUpdate:function(){
    var self=this
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      //1. 检查小程序是否有新版本发布
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          //2. 小程序有新版本，则静默下载新版本，做好更新准备
          updateManager.onUpdateReady(function () {
            console.log(new Date())
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  //3. 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                } else if (res.cancel) {
                  //如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
                  wx.showModal({
                    title: '温馨提示~',
                    content: '本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~',
                    success: function (res) {     
                      self.autoUpdate()
                      return;                 
                      //第二次提示后，强制更新                      
                      if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                      } else if (res.cancel) {
                        //重新回到版本更新提示
                        self.autoUpdate()
                      }
                    }
                  })
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
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
    var ztdid = wx.getStorageSync('zdtid')
    
    var arg={
      'userInfo':{
        'id':userId
      },
      'headInfo':{
        'id':ztdid
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