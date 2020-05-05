// pages/details/h/h.js
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
    var that = this;
    console.log(options)
    that.setData({
      id:options.id,
      imgUrl: app.globalData.imgUrl,
      name:options.name
    })
    that.content();
    console.log(that.data.id)
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
    var that=this;
    wx.setNavigationBarTitle({title: that.data.name})
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
  content:function(){
    var that = this;
    var id = that.data.id;
    console.log(id)
    var params = {
      url: '/app/user/findAgreementDetail',
      method: 'GET',
      data: {
        'id':id
      },
      sCallBack: function (data) {
        console.log(data)
       
        var artice = data.data.result.content;
        WxParse.wxParse('artice', 'html', artice, that, 5);
      },
      eCallBack: function () {
      }
    }
    base.request(params);
  }
})