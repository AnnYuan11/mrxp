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
    payTypes:2,//默认微信支付
    yhje:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that=this;
    var phone=wx.getStorageSync('phone')
    that.setData({
      phone:phone
    })
    console.log(phone)
    if(options.yhqid=='undefined'){
      options.yhqid=''
    }
    if(options.yhqmoney=='undefined元'){
      options.yhqmoney='请选择优惠券'
    }
    that.setData({
      options:options,
      ddid:options.ddid,//页面详情传入的订单id
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
    if(that.data.options.sendType=="到店自提"){
      that.orderMoney()
      that.list()//团长地址
      var aa=wx.getStorageSync('aa')
      if(aa=='0'){
        that.query()//查询用户切换店铺
      }else {
        return
      }
    }else{
      that.selectDz()//查询用户地址
    }
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
  // 查询用户默认地址
  selectDz(){
    var that = this;
    var userId=wx.getStorageSync('userId')
    console.log(that.data.options.dzid)
    if(that.data.options.dzid==undefined){
      that.data.options.dzid=''
    }
    var arg={
      "id":that.data.options.dzid,
      "userInfo":{
        "id":userId
      },
    }
    console.log(JSON.stringify(arg))
    var params = {
      url: '/app/user/findUserAddressInfoIsDefault',
      method: 'POST',
       
      data: JSON.stringify(arg),
      sCallBack: function (data) {
        console.log(data.data.result)
          that.setData({
            mrdz:data.data.result,
            dzid:data.data.result.id
        })
        that.orderMoney()//查询订单金额
      },
      eCallBack: function () {
      }
    }
    base.request(params);
  },
  // 添加商品
  orderMessage(){
    var that = this;
    if(that.data.mrdz==''){
      wx.showToast({
        title: '请选择地址',
        icon:'none',
      })
      return
    }
    var userId=wx.getStorageSync('userId')
    var ddid=that.data.ddid;
    var sendType
    if(that.data.options.sendType=="到店自提"){
      that.data.dzid=''
    }else if(that.data.options.dzid){
      that.data.dzid=that.data.options.dzid
    }
    if(that.data.options.sendType=="到店自提"){
      sendType='1'
    }else{
      sendType='2'
    }
    console.log(that.data.ztdid)
    if(that.data.ztdid){
      var ztdid=that.data.ztdid
    }else{
      var ztdid=that.data.ztdid2
    }
    
    console.log(that.data.dzid)
    var arg={
      "commoditySubOrderInfoList":[{
        'commodityNumber':that.data.options.commodityNumber,
        "commodityInfo":{
          "id":ddid
        }
      }],
      "orderType":"1",
      "userInfo":{
        "id":userId//用户id
      },
      "userAddressInfo":{
        "id":that.data.dzid//地址id
      },
      "userCouponInfo":{
        "id":that.data.yhqid//优惠券id
      },
      "orderSendType":sendType,//配送方式
      "headInfo":{
        "id":ztdid//自提点id
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
        if(that.data.payTypes=='2'){
          that.pay()
        }else{
          that.payYe(that.data.message.orderNumber)
        }
        
      },
      eCallBack: function () {
      }
    }
    base.request(params);
  },
  // 订单金额查询
  orderMoney(){
    var that = this;
    if(that.data.mrdz==''){
      wx.showToast({
        title: '请选择地址',
        icon:'none',
      })
      return
    }
    var userId=wx.getStorageSync('userId')
    var ddid=that.data.ddid;
    var sendType
    if(that.data.options.sendType=="到店自提"){
      that.data.dzid=''
    }else if(that.data.options.dzid){
      that.data.dzid=that.data.options.dzid
    }
    if(that.data.options.sendType=="到店自提"){
      sendType='1'
    }else{
      sendType='2'
    }
    console.log(that.data.ztdid)
    if(that.data.ztdid){
      var ztdid=that.data.ztdid
    }else{
      var ztdid=that.data.ztdid2
    }
    
    console.log(that.data.dzid)
    var arg={
      "commoditySubOrderInfoList":[{
        'commodityNumber':that.data.options.commodityNumber,
        "commodityInfo":{
          "id":ddid
        }
      }],
      "orderType":"1",
      "userInfo":{
        "id":userId//用户id
      },
      "userAddressInfo":{
        "id":that.data.dzid//地址id
      },
      "userCouponInfo":{
        "id":that.data.yhqid//优惠券id
      },
      "orderSendType":sendType,//配送方式
      "headInfo":{
        "id":ztdid//自提点id
      }
    }
    console.log(JSON.stringify(arg))
    var params = {
      url: '/app/order/findOrderTotalMoney',
      method: 'POST',
       
      data: JSON.stringify(arg),
      sCallBack: function (data) {
        console.log(data)
        if(data.data.result.fullReductionInfo.fullMoney==''){
          data.data.result.fullReductionInfo.fullMoney=0
        }
        that.setData({
          money:data.data.result,
          yhje:data.data.result.fullReductionInfo.fullMoney
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
  that.setData({
    payTypes:e.detail.value
  })
},
  //微信支付
  pay(){
    var that = this;
    var openId=wx.getStorageSync('openId')
    console.log(that.data.message)
    var arg={
      id: that.data.message.id,
      name:that.data.message.commoditySubOrderInfoList[0].commodityInfo.productInfo.commodityName,
      payType:2,
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
              duration: 2000,
              success: function () {
                setTimeout(function () {
                  
                }, 2000);

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

  // 余额支付
  payYe(orderNumber){
    var that = this;
    var userId=wx.getStorageSync('userId')
    var arg={
      'userInfo':{
        'id': userId,
      },
      'orderNumber':orderNumber
    }
    var params = {
      url: '/app/order/updateCommodityOrderInfoPaymentStatusYe',
      method: 'POST',
      data: JSON.stringify(arg),
      sCallBack: function (data) {
        console.log(data)  
        if(data.data.errorCode=='-1'){
          wx.showToast({
            title: data.data.errorMsg,
            icon:'none'
          })
        }else if(data.data.errorCode=='-200'){
          wx.showToast({
            title: data.data.errorMsg,
            icon:'none'
          })
        }else{
          wx.showToast({
            title: data.data.result,
            icon:'none',
            duration: 2000,
              success: function () {
                setTimeout(function () {
                  wx.redirectTo({
                    url: '/pages/details/order_list/order_list',
                  })
                }, 2000);

              }
          })
        }
           
      },
      eCallBack: function () {
      }
    }
    base.request(params);

  },
  // 选择优惠券跳转
  selectYhq(){
    var that=this;
    var dzid
    var options=that.data.options
    if(options.dzid){
      dzid=options.dzid
    }else{
      dzid=that.data.dzid
    }
   wx.redirectTo({
     url:'/pages/details/wdyhq/wdyhq?toddxq=1&ddid='+that.data.ddid+'&ddpic='+options.ddpic+'&ddname='+options.ddname+'&ddjg='+options.ddjg+'&sendType='+options.sendType+'&dzid='+dzid+'&commodityNumber='+options.commodityNumber
   })
  },
//  跳转到选择地址
Todz(){
  var that=this;
  var options=that.data.options
  wx.redirectTo({
    url:'/pages/details/address_list/addressList?toddxq=1&ddid='+that.data.ddid+'&ddpic='+options.ddpic+'&ddname='+options.ddname+'&ddjg='+options.ddjg+'&sendType='+options.sendType+'&yhqid='+options.yhqid+'&yhqmoney='+options.sendType.yhqmoney+'元'+'&commodityNumber='+options.commodityNumber
  })
},
  // 自提点的地址
  // 查询用户切换店铺

query(){
  var that=this;
  var userId = wx.getStorageSync('userId')
  var params = {
    url: '/app/user/findUserHeadInfo',
    method: 'POST',
    data: {
      userInfo:{'id':userId}
    },
    sCallBack: function (data) {
      that.setData({
        defaultztd:data.data.result,
        shopName:data.data.result.headInfo.shopName,
        ztdid:data.data.result.headInfo.id
      })
      
    },
    eCallBack: function () {
    }
  }
  base.request(params);
},
  // 团长地址
  list(){
    var that = this;
    var myLat = wx.getStorageSync('latitude');
    var myLng = wx.getStorageSync('longitude');
    console.log(myLat)
    var params = {
      url: '/app/head/findAllHeadInfoByDistance',
      method: 'POST',
      data: {
        myLat:myLat,
        myLng:myLng
      },
      sCallBack: function (data) {
        var list= data.data.result;
        if(list.length==0){
          that.default()
        }
        that.setData({
         shopName:list[0].shopName,
         phones:list[0].phone,
         ztdid2:list[0].id,
         addressth:list[0].address
        })
        
      },
      eCallBack: function () {
      }
    }
    base.request(params);
  },
  // 默认自提点
  default(){
    var that=this;
    var params = {
      url: '/app/head/findHeadInfoProperty',
      method: 'GET',
      data: {
       
      },
      sCallBack: function (data) {
        var list= data.data.result;
        that.setData({
          shopName:list.shopName,
          phones:list.phone,
          ztdid2:list.id,
          addressth:list.address
        })
        
      },
      eCallBack: function () {
      }
    }
    base.request(params);
  },
})