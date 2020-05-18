// pages/my/my.js
import { Base } from "../../utils/request/base.js";
var app = getApp();
var base = new Base();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var session=wx.getStorageSync('session')
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
    app.refresh()    
    var session=wx.getStorageSync('session')
    console.log(session)
    this.setData({
      session:session,
      phone:wx.getStorageSync('phone')
    })
    that.orderNum()
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
// 查询订单数
orderNum() {
  var that = this;
  var id = wx.getStorageSync('userId')
  var params = {
    url: '/app/order/findAllOrderStatusNumberByUserId',
    method: 'GET',
    data: {
      'userId':id,
    },
    sCallBack: function (data) {
      that.setData({
        dfkNum:data.data.result[0].commodityNumber,
        bhzNum:data.data.result[1].commodityNumber,
        pszNum:data.data.result[2].commodityNumber,
        dthNum:data.data.result[3].commodityNumber,
        ythNum:data.data.result[4].commodityNumber
      })
    },
    eCallBack: function () {}
  }
  base.request(params);
},

})