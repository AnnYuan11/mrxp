// pages/details/wdyhq/wdyhq.js
import { Base } from "../../../utils/request/base.js";
var base = new Base();
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    currentPage: 1,//请求数据的页码
    size: 10,//每页数据条数
    totalCount: 0,//总是数据条数
    pagecount: 0,//总的页数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    console.log(options)
    that.setData({
      toddxq:options.toddxq,
      ddid:options.ddid,
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
    if(e.target.dataset.current=='0'){
      that.data.currentPage=1,
      that.data.totalCount= 0,//总是数据条数
      that.data.pagecount= 0,//总的页数
       that.list()//已使用
     }
    else if(e.target.dataset.current=='1'){
     that.data.currentPage=1,
     that.data.totalCount= 0,//总是数据条数
     that.data.pagecount= 0,//总的页数
      that.ysylist()//已使用
    }else if(e.target.dataset.current=='2'){
      that.data.currentPage=1,
      that.data.totalCount= 0,//总是数据条数
      that.data.pagecount= 0,//总的页数
      that.ygqlist()//已过期
    }
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
    var that=this;
    var id = wx.getStorageSync('userId')
    var params = {
      url: '/app/user/listUserCouponInfo',
      method: 'POST',
      data: {
        'type':0,
        'pageIndex':that.data.currentPage,
        'pageSize':that.data.size,
        'userInfo.id':id,
      },
      sCallBack: function (data) {
         var yhqlist=data.data.result.datas;
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
          item.startTime=item.startTime.substring(0,10)
          item.endTime=item.endTime.substring(0,10)
        })
       
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
  // 已使用列表
  ysylist(){
    var that=this;
    var id = wx.getStorageSync('userId')
    var params = {
      url: '/app/user/listUserCouponInfo',
      method: 'POST',
      data: {
        'type':1,
        'pageIndex':that.data.currentPage,
        'pageSize':that.data.size,
        'userInfo.id':id,
      },
      sCallBack: function (data) {
         var yhqysylist=data.data.result.datas;
        yhqysylist.forEach(item=>{
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
          item.startTime=item.startTime.substring(0,10)
          item.endTime=item.endTime.substring(0,10)
        })
       
        var temlist = that.data.yhqysylist; //原始的数据集合
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
            yhqysylist: temlist,
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
  // 已过期列表
  ygqlist(){
  
    var that=this;
    var id = wx.getStorageSync('userId')
    var params = {
      url: '/app/user/listUserCouponInfo',
      method: 'POST',
      data: {
        'type':2,
        'pageIndex':that.data.currentPage,
        'pageSize':that.data.size,
        'userInfo.id':id,
      },
      sCallBack: function (data) {
         var yhqygqlist=data.data.result.datas;
        yhqygqlist.forEach(item=>{
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
          item.startTime=item.startTime.substring(0,10)
          item.endTime=item.endTime.substring(0,10)
        })
       
        var temlist = that.data.yhqygqlist; //原始的数据集合
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
            yhqygqlist: temlist,
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
  // 跳转到订单详情页面
  Toddxq(e){
    var that=this;
    if(that.data.toddxq=="1"){
      var options=that.data.options
      wx.redirectTo({
        url: '/pages/details/order_details/order_details?yhqid='+e.currentTarget.dataset.id+'&ddid='+that.data.ddid+'&yhqmoney='+e.currentTarget.dataset.yhqmoney+'元'+'&ddpic='+options.ddpic+'&ddname='+options.ddname+'&ddjg='+options.ddjg+'&sendType='+options.sendType+'&dzid='+options.dzid,
      })
    }else{
      return
    }
    
  },
  // 未使用加载更多
  bindscrolltolower: function () {
    if (this.data.currentPage < this.data.pagecount) {
      this.data.currentPage++;
      this.list();
    } else {
      //没有更多数据
     app.nomore_showToast();
    }
  },
  // 已使用加载更多
  bindscrolltolower2: function () {
    if (this.data.currentPage < this.data.pagecount) {
      this.data.currentPage++;
      this.ysylist();
    } else {
      //没有更多数据
     app.nomore_showToast();
    }
  },
  bindscrolltolower3: function () {
    if (this.data.currentPage < this.data.pagecount) {
      this.data.currentPage++;
      this.ygqlist();
    } else {
      //没有更多数据
     app.nomore_showToast();
    }
  },
     /**
 * 没有更多数据
 * */

})