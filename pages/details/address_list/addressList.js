// pages/details/address_list/addressList.js
import { Base } from "../../../utils/request/base.js";
var base = new Base();
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPage: 1,//请求数据的页码
    size: 10,//每页数据条数
    totalCount: 0,//总是数据条数
    pagecount: 0,//总的页数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that=this;
    that.setData({
      options:options
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
    if (this.data.currentPage < this.data.pagecount) {
      this.data.currentPage++;
      this.list();
    } else {
      //没有更多数据
     app.nomore_showToast();
    }
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
        'pageIndex':that.data.currentPage,
        'pageSize':that.data.size,
        'userInfo.id':id,
      },
      sCallBack: function (data) {
        var list=data.data.result.datas;
        var temlist = that.data.list; //原始的数据集合
        var currentPage = that.data.currentPage; //获取当前页码
        if (currentPage == 1) {
            temlist = data.data.result.datas; //初始化数据列表
            currentPage = 1;
        }
        else {
            temlist = temlist.concat(data.data.result.datas); //请求的数据追加到原始数据集合里
            // currentPage = currentPage + 1;
          }
          that.setData({
            currentPage: currentPage,
            list: temlist,
            totalCount: data.data.result.rowCount, //总的数据条数
            pagecount: data.data.result.totalPages //总页数
          })
          console.log(that.data.pagecount)         

          // that.setData({
          //   list:list
          // })
         
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
  },
  // 跳转到订单详情
  Toddxq(e){
    var that=this;
    if(that.data.options.toddxq=="1"){
      var options=that.data.options
      wx.redirectTo({
        url: '/pages/details/order_details/order_details?dzid='+e.currentTarget.dataset.dzid+'&ddid='+options.ddid+'&yhqmoney='+options.yhqmoney+'&ddpic='+options.ddpic+'&ddname='+options.ddname+'&ddjg='+options.ddjg+'&sendType='+options.sendType+'&yhqid='+options.yhqid+'&commodityNumber='+options.commodityNumber,
      })
    }else{
      return
    }
  },

})