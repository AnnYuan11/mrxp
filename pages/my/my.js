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
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
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
    var  that=this;
    var session=wx.getStorageSync('session')
    console.log(session)
    this.setData({
      session:session
    })
     
    this.login()
    // this.wxlogin()
          
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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
          that.wxlogin(data.data.result.phone)
            if(data.data.errorCode=="0"){
                that.setData({
                  phone:data.data.result.phone
                })
            }else{
              
            }
          
          
        },
        eCallBack: function () {
        }
    }
    base.request(params);
},
// 用户过期
wxlogin(phone){
  var that=this;
  var openId=wx.getStorageSync('openId')
  var params = {
      url: '/app/user/login',
      method: 'POST',
      data: {
          'phone':phone,
          'openId':openId
      },
      sCallBack: function (data) {
        console.log(data)
        if(data.data.errorCode=='-200'){
          wx.removeStorageSync('session')
          that.setData({
            session:''
          })
        } 
          
      },
      eCallBack: function () {
      }
    }
  base.request(params);
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


})