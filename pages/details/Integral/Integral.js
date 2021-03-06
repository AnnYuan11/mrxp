// pages/details/Integral/Integral.js
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
    imgUrl:app.globalData.imgUrl,
    imgUrls: app.globalData.imgUrls,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.list();
  
    
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
      app.refresh()
      that.setData({
        personal:app.globalData.personal
      })
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
  list(){
    var that=this;
    var params = {
      url: '/app/commodity/listIntegralProductInfo',
      method: 'POST',
      data: {
        'pageIndex':that.data.currentPage,
        'pageSize':that.data.size,
      },
      sCallBack: function (data) {
        console.log(data)
        
        var temlist = that.data.yhqlist; //原始的数据集合
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
            yhqlist: temlist,
            totalCount: data.data.result.rowCount, //总的数据条数
            pagecount: data.data.result.totalPages //总页数
          })
          console.log(that.data.pagecount)         
      },
      eCallBack: function () {
      }
  }
  base.request(params);
  },
  Todetails(e){
    console.log(e)
    wx.navigateTo({
      url: '/pages/details/Goodsdetails_jf/jfdh?id='+e.currentTarget.dataset.id,
    })
  }
})