// pages/details/setting/setting.js
import { Base } from "../../../utils/request/base.js";
var app = getApp();
var base = new Base();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: getApp().globalData.color,
    imgUrl:getApp().globalData.imgUrl,
    imgUrls: app.globalData.imgUrls,
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
  // 退出登录
  exit(){
    wx.showModal({
      title: '提示',
      content: '确认退出吗',
      success (res) {
        if (res.confirm) {
          // wx.clearStorageSync()
          // wx.removeStorageSync('sessionId')
          wx.removeStorageSync('openId')
          wx.removeStorageSync('phone')
          wx.removeStorageSync('session')
          wx.removeStorageSync('userId')
          wx.removeStorageSync('loginData')
          wx.removeStorageSync('latitude')
          wx.removeStorageSync('longitude')
          wx.removeStorageSync('zdtid')
          wx.removeStorageSync('sharephone')
          // wx.removeStorageSync('headInfo')
          wx.navigateBack({
            complete: (res) => {
              wx.switchTab({
                url: '/pages/index/index',
              }) 
            },
          })
        } else if (res.cancel) {
          return;
          
        }
      }
    })
    
  }
})