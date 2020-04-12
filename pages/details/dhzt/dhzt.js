// pages/dhzt/dhzt.js
import { Base } from "../../../utils/request/base.js";
var base = new Base();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: getApp().globalData.color,
    col:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.list()//列表
    that.query()//查询切换点
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
 
  
  // 自提点列表
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
      // list.forEach(item => {
      //   item.distance=parseInt(item.distance)/1000
      // });
      var address=list[0].province+list[0].city+list[0].area+list[0].street+list[0].address
      that.setData({
       list:list,
       shopName:list[0].shopName,
       address:address,
       name:list[0].headName,
       phone:list[0].phone
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
      var address=list.province+list.city+list.area+list.street+list.address
      that.setData({
        shopName:list.shopName,
        address:address,
        name:list.headName,
        phone:list.phone
      })
      
    },
    eCallBack: function () {
    }
  }
  base.request(params);
},
// 切换自提点
change(e){
  var that=this;
  var userId = wx.getStorageSync('userId')
  wx.setStorage({
    data: 0,
    key: 'aa',
  })
  var params = {
    url: '/app/user/addUserHeadInfo',
    method: 'POST',
    data: {
      userInfo:{'id':userId},
      headInfo:{'id':e.currentTarget.dataset.item.id}
    },
    sCallBack: function (data) {
      that.query()
      
    },
    eCallBack: function () {
    }
  }
  base.request(params);
},
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
        
      })
      
    },
    eCallBack: function () {
    }
  }
  base.request(params);
},
// 拨打电话
phone(e){
  console.log(e)
  var that=this;
  wx.makePhoneCall({
    phoneNumber: e.currentTarget.dataset.phone
  })
}
})