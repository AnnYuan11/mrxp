// pages/details/share/share.js
import { Base } from "../../../utils/request/base.js";
var base = new Base();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
    imgUrls: app.globalData.imgUrls,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that=this;
    that.setData({
      options:options,
    })
    var that=this;
    that.details()
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
  details(){
    var that=this;
    var params = {
      url: '/app/order/findCommodityOrderInfo',
      method: 'GET',
      data: {
        'id':'2c985f077254045a0172540649c4000f',
      },
      sCallBack: function (data) {
         console.log(data)
         var list =data.data.result;
          if(list.orderSendType=='1'){
            list.orderSendType='到店自提'
          }else if(list.orderSendType=='2'){
            list.orderSendType='配送订单'
          }
          list.userInfo.phone=list.userInfo.phone.substring(0,3)+'****'+list.userInfo.phone.substring(8,11)
        
        that.setData({
          list:list
        })

         
      },
      eCallBack: function () {
      }
    }
    base.request(params);
  },
})