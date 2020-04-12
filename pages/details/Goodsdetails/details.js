// pages/details/Goodsdetails/details.js
import { Base } from "../../../utils/request/base.js";
var WxParse = require('../../../utils/wxParse/wxParse.js');
var util = require('../../../utils/util.js');
var app = getApp();
var base = new Base();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
    currentTab: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options)
    that.setData({
      id:options.id,
    })
    that.shop();//商品内容
  },
  // 获取日期
  getDateStr: function(today, addDayCount) {
    var date;
    var that=this;
    if(today) {
      date = new Date(today);
    }else{
      date = new Date();
    }
    date.setDate(date.getDate() + addDayCount);//获取AddDayCount天后的日期 
      var y = date.getFullYear();
      var m = date.getMonth() + 1;//获取当前月份的日期 
      var d = date.getDate();
      if(m < 10){
        m = '0' + m;
      };
      if(d < 10) {
        d = '0' + d;
      };
      var tomorow=m + "月" + d+"日";
      that.setData({
        tomorow:tomorow
      })
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
  // 详情切换
  swichNav: function (e) {
    var that = this;
    console.log(e)
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  // 商品内容
  shop(){
    var that = this;
    var params = {
      url: '/app/commodity/findCommodityInfo',
      method: 'GET',
      data: {
        'id':that.data.id, 
      },
      sCallBack: function (data) {
        if(data.data.result.productInfo.sendType==1){
          data.data.result.productInfo.sendType="到店自提"
        }else{
          data.data.result.productInfo.sendType="快递到家"
        }
        if(data.data.result.productInfo.pickDate==1){
          var date = new Date();
          data.data.result.productInfo.pickDate=date
        }else if(data.data.result.productInfo.pickDate==2){
          that.getDateStr(null,1)
          var tomorow=that.data.tomorow
          data.data.result.productInfo.pickDate=tomorow
        }else{
          that.getDateStr(null,2)
          var ht=that.data.tomorow
          data.data.result.productInfo.pickDate=ht
        }
        var artice = data.data.result.productInfo.content;
        WxParse.wxParse('artice', 'html', artice, that, 5);
        that.setData({
          list:data.data.result
        })
        
      },
      eCallBack: function () {
      }
    }
    base.request(params);
  },
  // 立即购买
  buyNow(){
    var userId=wx.getStorageSync("userId")
    console.log(userId)
    var that=this;
    if(userId==''){
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }else{
      var ddid = that.data.list.id;
      var ddpic = that.data.list.productInfo.photo;
      var ddname = that.data.list.productInfo.commodityName;
      var ddjg = that.data.list.productInfo.crossedPrice;
      var sendType =that.data.list.productInfo.sendType
      wx.navigateTo({
        url: '/pages/details/order_details/order_details?ddid='+ddid+'&ddname='+ddname+'&ddpic='+ddpic+'&ddjg='+ddjg+'&sendType='+sendType,
      })
    }
   
    
  },
  // 首页
  toIndex(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
// 跳转到购物车
toGwc(){
  wx.switchTab({
    url: '/pages/gwc/gwc',
  })
},
})