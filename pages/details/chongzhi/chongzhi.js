// pages/details/chongzhi/chongzhi.js
import { Base } from "../../../utils/request/base.js";
var base = new Base();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: getApp().globalData.color,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.list()//列表
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
// 充值
Recharge(e){
  var that = this;
  console.log(e)
  var userId=wx.getStorageSync('userId')
  var arg={
    'userInfo':{
      'id':userId
    },
    'rechargeGiveInfo':{
      'id':e.currentTarget.dataset.id
    }
  }
  that.setData({
    id:e.currentTarget.dataset.id
  })
  var params = {
    url: '/app/order/addRechargeOrderInfo',
    method: 'POST',
    data:JSON.stringify(arg),
    sCallBack: data=>{
      console.log(data)
    },
    eCallBack: function () {
    }
  }
  base.request(params);
}
})