// pages/details/order_list/order_list.js
import { Base } from "../../../utils/request/base.js";
var base = new Base();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    scrollLeft:0,
    imgUrl:app.globalData.imgUrl,
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
      currentTab:options.currentTab
    })
    /**
     * 获取当前设备的宽高
     */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    that.Allorder()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    
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
  // 去评价
  gopj(e){
    wx.navigateTo({
      url: '/pages/details/sppj/sppj',
    })
  },
  // 全部订单
  Allorder(){
    var that=this;
    var id = wx.getStorageSync('userId')
    var params = {
      url: '/app/order/listCommodityOrderInfo',
      method: 'POST',
      data: {
        'pageIndex':that.data.currentPage,
        'pageSize':that.data.size,
        'userInfo.id':id,
      },
      sCallBack: function (data) {
         var Alllist=data.data.result.datas;
         Alllist.forEach(item=>{
          if(item.orderStatus=='1'){
            item.orderStatus='待支付'
          }else if(item.orderStatus=='2'){
            item.orderStatus='备货中'
          }else if(item.orderStatus=='3'){
            item.orderStatus='配送中'
          }else if(item.orderStatus=='4'){
            item.orderStatus='待提货'
          }else if(item.orderStatus=='5'){
            item.orderStatus='已收货'
          }
          item.orderTime=item.orderTime.substring(0,10)
        })
       
        var temlist = that.data.Alllist; //原始的数据集合
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
            Alllist: temlist,
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
  // 全部订单的加载
  Allqbdd(){
    if (this.data.currentPage < this.data.pagecount) {
      this.data.currentPage++;
      this.Allorder();
    } else {
      //没有更多数据
      app.nomore_showToast();
    }
  }
})