// pages/details/address_list/addressList.js
import { Base } from "../../../utils/request/base.js";
var base = new Base();
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
    that.list()
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
  // 我的地址
  list(){
    wx.show
    var that=this;
    var id = wx.getStorageSync('userId')
    var params = {
      url: '/app/user/listUserAddressInfo',
      method: 'POST',
      data: {
        'pageIndex':1,
        'pageSize':10,
        'userInfo.id':id,
      },
      sCallBack: function (data) {
        var list=data.data.result;
          that.setData({
            list:list
          })
         
      },
      eCallBack: function () {
      }
    }
    base.request(params);
  },
  // 修改默认地址
  selectList(e) {
    console.log(e)
    var that=this;
    var index = e.currentTarget.dataset.index;
    var data = e.currentTarget.dataset.data
    var list = that.data.list;
    list.forEach(item=>{
      item.isDefault=0;
      list[index].isDefault=1
    })
    that.setData({
      list: list,
    })
    var params = {
      url: '/app/user/updateUserAddressInfoDefault',
      method: 'POST',
      data: {
        'province':data.province,
        'city':data.city,
        'area':data.area,
        'street':data.street,
        'address':data.address,
        'name':data.name,
        'phone':data.phone,
        'isDefault':data.isDefault,
        'id': data.id
      },
      sCallBack: function (data) {
        wx.showToast({
          title: data.data.result
        })
        setTimeout(function(){
          that.onShow()
        },2000)
         
      },
      eCallBack: function () {
      }
    }
    base.request(params);
    
  },
  // 删除地址
  delete(e){
    console.log(e)
    var that=this;
    var params = {
      url: '/app/user/deleteUserAddressInfo',
      method: 'GET',
      data: {
        'id':e.currentTarget.dataset.id
      },
      sCallBack: function (data) {
        wx.showToast({
          title: data.data.result
        })
        setTimeout(function(){
          that.onShow()
        },2000)
         
      },
      eCallBack: function () {
      }
    }
    base.request(params);
  }
})