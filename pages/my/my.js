// pages/my/my.js
import { Base } from "../../utils/request/base.js";
var baseUrl = "http://139.155.113.100:8085";
var app = getApp();
var base = new Base();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    islogin:0//是否登录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.getOpenId()
    console.log(that.data.islogin)
   if(that.data.islogin=="0"){
       that.login()
   }
  },
  getPhoneNumber: function(e) { 
        console.log(e)    
        var that=this;
        // debugger
       wx.checkSession({
        success: function () { 
        var ency = e.detail.encryptedData;
        var iv = e.detail.iv;
        var sessionk = that.data.sessionId;
        if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
        wx.showToast({
          title: '未授权',
          icon:'none'
        })  
        that.setData({
            islogin:0
        })
        } else {//同意授权
        console.log(sessionk)
        wx.request({
        
        method: "GET",
        
        url: baseUrl+'/app/getPhone',
        
        data: {
            encryptedData: ency,
            iv: iv,
            sessionKey: sessionk
        },
        header: {
            'content-type': 'application/json' // 默认值
        },
        success: (res) => {
        console.log(res);
        var phone = res.data.result.phoneNumber;
        console.log(phone);    
        that.setData({
            phone:phone,
            islogin:1
        })
        
        that.wxlogin()
            },
            fail: function (res) {
                console.log(res); 
            }
            })
        }
        },
        fail: function () {
        
        console.log("session_key 已经失效，需要重新执行登录流程");
        
        that.getOpenId(); //重新登录
        
        }
        
        });
        
    },   
    // 用户登陆接口
    login(){
        var that=this;
        var params = {
            url: '/app/user/weixinLogin',
            method: 'POST',
            data: {
              'openId':that.data.openId
            },
            sCallBack: function (data) {
                if(data.data.errorCode=="0"){
                    that.setData({
                        phone:data.data.result.phone,
                    })
                }else{
                    that.setData({
                        islogin:0
                    })
                }
              
              
            },
            eCallBack: function () {
            }
          }
        base.request(params);
    },
    // 登陆
    wxlogin(){
        var that=this;
        var params = {
            url: '/app/user/login',
            method: 'POST',
            data: {
                'phone':that.data.phone,
                'openId':that.data.openId
            },
            sCallBack: function (data) {
                console.log(data.data.result.id)
                wx.setStorage({
                    key:"userId",
                    data:data.data.result.id
                  });
            
            },
            eCallBack: function () {
            }
          }
        base.request(params);
    },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
                    url: baseUrl + '/app/getOpenId?code=' + res.code,
                   
                    success: function (data) {
                        console.log(data);
                        that.setData({
                          openId: data.data.result.openId,
                          sessionId:data.data.result.sessionKey,
                        //   islogin:1
                        })
                        wx.setStorage({
                            key:"sessionId",
                            data:that.data.sessionId
                          });
                        wx.setStorage({
                            key:"openId",
                            data:that.data.openId
                        });
                    },
                    fail: function (data) {
                        console.log(data);
                    }
                })
            }
        }
    })
},
// 授权
bindGetUserInfo: function(e) {
    if (e.detail.userInfo) {
        //用户按了允许授权按钮
        var that = this;
        // 获取到用户的信息了，打印到控制台上看下
        console.log("用户的信息如下：");
        console.log(e.detail.userInfo);
        //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      
    } else {
        //用户按了拒绝按钮
        wx.showModal({
            title: '警告',
            content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
            showCancel: false,
            confirmText: '返回授权',
            success: function(res) {
                // 用户没有授权成功，不需要改变 isHide 的值
                if (res.confirm) {
                    console.log('用户点击了“返回授权”');
                }
            }
        });
    }
}
})