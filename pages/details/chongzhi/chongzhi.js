// pages/details/chongzhi/chongzhi.js
import { Base } from "../../../utils/request/base.js";
var base = new Base();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: getApp().globalData.color,
    imgUrl:getApp().globalData.imgUrl,
    imgUrls: getApp().globalData.imgUrls,
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
    var session = wx.getStorageSync('session')
    if(session==''){
      wx.showModal({
        title: '提示',
        content: '用户未登录',
        confirmText:'去登陆',
        success (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          } else if (res.cancel) {
            wx.navigateBack({
              delta: 1  // 返回上一级页面。
            })
          }
        }
      })   
    }else{
      var that=this;
      that.list()//列表
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

 
  
  chongzhi(e){
    console.log(e)
  },
  // 充值列表
list(){
  var that = this;
  var params = {
    url: '/app/order/listRechargeGiveInfo',
    method: 'POST',
    data: {
      'pageIndex':1,
      'pageSize':10
    },
    sCallBack: function (data) {
      that.setData({
       list:data.data.result
      })
      
    },
    eCallBack: function () {
    }
  }
  base.request(params);
},
Recharges(e){
  var that = this;
  console.log(e)
  that.setData({
    id:e.currentTarget.dataset.id
  })
},
// 添加充值
Recharge(e){
  var that = this;
  console.log(that.data.id)
  var userId=wx.getStorageSync('userId')
  if(that.data.id==''||that.data.id==undefined){
    wx.showToast({
      title: '请选择套餐',
      icon:'none'
    })
    return;
  }
  var arg={
    'userInfo':{
      'id':userId
    },
    'rechargeGiveInfo':{
      'id':that.data.id
    }
  }
  // that.setData({
  //   id:e.currentTarget.dataset.id
  // })
  var params = {
    url: '/app/order/addRechargeOrderInfo',
    method: 'POST',
    data:JSON.stringify(arg),
    sCallBack: data=>{
      console.log(data)
       that.setData({
        czid:data.data.result.id
      })
      that.surePay()
    },
    eCallBack: function () {
    }
  }
  base.request(params);
},
// 确认充值
surePay(){
  var that = this;
  var openId=wx.getStorageSync('openId')
  console.log(that.data.message)
  var arg={
    id: that.data.czid,
    payType:'2',
    type:'2',
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
        appId: 'wx874be472f0a6147b',
        timeStamp: data.data.result['timeStamp'],
        nonceStr: data.data.result['nonceStr'],
        package: data.data.result['packageValue'],
        signType: 'MD5',
        paySign: data.data.result['paySign'],
        'success': function (res) {
          console.log(res)
          wx.showToast({
            title: '充值成功！',
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
}
})