// pages/details/wdyhq/wdyhq.js
import { Base } from "../../../utils/request/base.js";
var base = new Base();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    console.log(options)
    that.setData({
      toddxq:options.toddxq,
      datas:options.datas,
      options:options
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    that.list()
    that.ygqlist()
    that.ysylist()
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

  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  // 未使用列表
  list(){
    wx.show
    var that=this;
    var id = wx.getStorageSync('userId')
    var params = {
      url: '/app/user/listUserCouponInfo',
      method: 'POST',
      data: {
        'type':0,
        'pageIndex':1,
        'pageSize':10,
        'userInfo.id':id,
      },
      sCallBack: function (data) {
        var yhqlist=data.data.result;
        yhqlist.forEach(item=>{
          if(item.couponInfo.type=='1'){
            item.couponInfo.type='全场通用'
          }else{
            item.couponInfo.type='部分可用'
          }
          if(item.type=='0'){
            item.type='未使用'
          }else if(item.type=='1'){
            item.type='已使用'
          }else{
            item.type='已过期'
          }
          if(item.type=='0'){
            item.type='未使用'
          }else if(item.type=='1'){
            item.type='已使用'
          }else{
            item.type='已过期'
          }
          item.startTime=item.startTime.substring(0,10)
          item.endTime=item.endTime.substring(0,10)
        })
          that.setData({
            yhqlist:yhqlist
          })
         
      },
      eCallBack: function () {
      }
  }
  base.request(params);
  },
  // 已使用列表
  ysylist(){
    wx.show
    var that=this;
    var id = wx.getStorageSync('userId')
    var params = {
      url: '/app/user/listUserCouponInfo',
      method: 'POST',
      data: {
        'type':1,
        'pageIndex':1,
        'pageSize':10,
        'userInfo.id':id,
      },
      sCallBack: function (data) {
        var yhqysylist=data.data.result;
        yhqysylist.forEach(item=>{
          if(item.couponInfo.type=='0'){
            item.couponInfo.type='全场通用'
          }else{
            item.couponInfo.type='部分可用'
          }
          if(item.type=='0'){
            item.type='未使用'
          }else if(item.type=='1'){
            item.type='已使用'
          }else{
            item.type='已过期'
          }
          if(item.type=='0'){
            item.type='未使用'
          }else if(item.type=='1'){
            item.type='已使用'
          }else{
            item.type='已过期'
          }
          item.startTime=item.startTime.substring(0,10)
          item.endTime=item.endTime.substring(0,10)
        })
          that.setData({
            yhqysylist:yhqysylist
          })
         
      },
      eCallBack: function () {
      }
  }
  base.request(params);
  },
  // 已过期列表
  ygqlist(){
    wx.show
    var that=this;
    var id = wx.getStorageSync('userId')
    var params = {
      url: '/app/user/listUserCouponInfo',
      method: 'POST',
      data: {
        'type':2,
        'pageIndex':1,
        'pageSize':10,
        'userInfo.id':id,
      },
      sCallBack: function (data) {
        var yhqygqlist=data.data.result;
        yhqygqlist.forEach(item=>{
          if(item.couponInfo.type=='0'){
            item.couponInfo.type='全场通用'
          }else{
            item.couponInfo.type='部分可用'
          }
          if(item.type=='0'){
            item.type='未使用'
          }else if(item.type=='1'){
            item.type='已使用'
          }else{
            item.type='已过期'
          }
          if(item.type=='0'){
            item.type='未使用'
          }else if(item.type=='1'){
            item.type='已使用'
          }else{
            item.type='已过期'
          }
          item.startTime=item.startTime.substring(0,10)
          item.endTime=item.endTime.substring(0,10)
        })
          that.setData({
            yhqygqlist:yhqygqlist
          })
         
      },
      eCallBack: function () {
      }
  }
  base.request(params);
  },
  // 跳转到订单详情页面
  Toddxq(e){
    var that=this;
    if(that.data.toddxq=="1"){
      var options=that.data.options
      wx.redirectTo({
        url: '/pages/details/order_details/order_details?yhqid='+e.currentTarget.dataset.id+'&list='+that.data.datas+'&yhqmoney='+e.currentTarget.dataset.yhqmoney+'&ddpic='+options.ddpic+'&ddname='+options.ddname+'&ddjg='+options.ddjg,
      })
    }else{
      return
    }
    
  }
})