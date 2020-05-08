// pages/details/notice_details/notice_details.js
import { Base } from "../../../utils/request/base.js";
var WxParse = require('../../../utils/wxParse/wxParse.js');
var base = new Base();
var app = getApp()
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
    console.log(options)
    this.setData({
      id:options.id
    })
    this.details()
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
  details() {
    var that = this;
    var params = {
      url: '/app/information/findInformationInfo',
      method: 'GET',
      data: {
        id: that.data.id
      },
      sCallBack: function (data) {
        if (data.data.errorCode == '0') {
          var artice = data.data.result.content;
          WxParse.wxParse('artice', 'html', artice, that, 5);
        }

      },
      eCallBack: function () {}
    }
    base.request(params);
  }
})