// pages/details/order_details/order_details.js
import { Base } from "../../../utils/request/base.js";
var app = getApp();
var base = new Base();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
    yhqmoney:'选择优惠券',
    payType:2//默认微信支付
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that=this;
    that.setData({
      options:options,
      datas:options.ddid,//页面详情传入的订单id
      yhqid:options.yhqid,//优惠券id
      yhqmoney:options.yhqmoney//优惠券钱数
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
    var that=this;
   
    that.orderMoney()//查询订单金额
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
  // 商品信息
  orderMessage(){
    var that = this;
    var userId=wx.getStorageSync('userId')
    console.log(that.data.datas)
    var ddid=that.data.datas
    console.log(ddid)
    var arg={
      "commoditySubOrderInfoList":[{
        'commodityNumber':1,
        "commodityInfo":{
          "id":ddid
        }
      }],
      "orderType":"1",
      "userInfo":{
        "id":userId//用户id
      },
      "userAddressInfo":{
        "id":""//地址id
      },
      "userCouponInfo":{
        "id":that.data.yhqid//优惠券id
      }
    }
    console.log(JSON.stringify(arg))
    var params = {
      url: '/app/order/addCommodityOrderInfo',
      method: 'POST',
       
      data: JSON.stringify(arg),
      sCallBack: function (data) {
        console.log(data)
        that.setData({
          message:data.data.result
        })
        
      },
      eCallBack: function () {
      }
    }
    base.request(params);
  },
  // 订单金额查询
  orderMoney(){
    var that = this;
    var userId=wx.getStorageSync('userId')
    console.log(userId)
    var ddid=that.data.datas
    console.log(ddid)
    var arg={
      "commoditySubOrderInfoList":[{
        'commodityNumber':1,
        "commodityInfo":{
          "id":ddid
        }
      }],
      "orderType":"1",
      "userInfo":{
        "id":userId
      },
      "userAddressInfo":{
        "id":""
      },
      "userCouponInfo":{
        "id":that.data.yhqid
      }
    }
    console.log(JSON.stringify(arg))
    var params = {
      url: '/app/order/findOrderTotalMoney',
      method: 'POST',
       
      data: JSON.stringify(arg),
      sCallBack: function (data) {
        console.log(data)
        that.setData({
          money:data.data.result
        })
        
      },
      eCallBack: function () {
      }
    }
    base.request(params);
  },
// 支付方式
radioChange: function (e) {
  console.log(e)
  var that=this;
  that.data.payType=e.detail.value
},
  // 支付
  pay(){
    var that = this;
    that.orderMessage()//商品信息
    var openId=wx.getStorageSync('openId')
    console.log(that.data.message)
    var arg={
      id: that.data.message.id,
      name:that.data.money.commoditySubOrderInfoList[0].commodityInfo.productInfo.commodityName,
      payType:that.data.payType,
      type:'1',
      openId:openId
    }
    console.log(JSON.stringify(arg))
    var params = {
      url: '/app/payment/getOrderStr',
      method: 'POST',
      data: arg,
      sCallBack: function (data) {
        console.log(data)  
        wx.requestPayment({
          appId: 'wx806b47b81b69c8bd',
          timeStamp: data.data.result['timeStamp'],
          nonceStr: data.data.result['nonceStr'],
          package: data.data.result['packageValue'],
          signType: 'MD5',
          paySign: data.data.result['paySign'],
          'success': function (res) {
            console.log(res)
            
            wx.showToast({
              title: '已支付成功！',
              icon: 'none',
              duration: 3000,
              success: function () {
                setTimeout(function () {
                  
                }, 3000);

              }
            })
          },
          fail: function (e) {
            console.log(e)
          }
        })      
      },
      eCallBack: function () {
      }
    }
    base.request(params);
  },
  // 选择优惠券跳转
  selectYhq(){
    var that=this;
    var options=that.data.options
   wx.redirectTo({
     url:'/pages/details/wdyhq/wdyhq?toddxq=1&datas='+that.data.datas+'&ddpic='+options.ddpic+'&ddname='+options.ddname+'&ddjg='+options.ddjg
   })
  }
})