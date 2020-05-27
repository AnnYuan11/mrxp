// pages/my/my.js
import { Base } from "../../utils/request/base.js";
var app = getApp();
var base = new Base();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
    imgUrls: app.globalData.imgUrls,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var session=wx.getStorageSync('session')
    this.query()//查询用户切换店铺
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
    var  that=this;
    var userId=wx.getStorageSync('userId') 
    console.log(userId)
    var aa=wx.getStorageSync('aa')
      if(aa=='0'){
        that.query()//查询用户切换店铺
      }else {
        that.list()
      }
    // if(userId!=''){
    //   console.log('有id')
    //   var aa=wx.getStorageSync('aa')
    //   if(aa=='0'){
    //     that.query()//查询用户切换店铺
    //   }else {
    //     that.list()
    //   }
    // }else{
    //   console.log('没有id')
    //   var shop=wx.getStorageSync('shop')
    //   console
    //   that.setData({
    //     shopName:shop.shopName,
    //     addressth:shop.province+shop.city+shop.area+shop.street+shop.address
    //   })
    // }
    
    app.refresh()    
    var session=wx.getStorageSync('session')
    console.log(session)
    this.setData({
      session:session,
      phone:wx.getStorageSync('phone')
    })
    that.orderNum()
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

 
// 查询订单数
orderNum() {
  var that = this;
  var id = wx.getStorageSync('userId')
  var params = {
    url: '/app/order/findAllOrderStatusNumberByUserId',
    method: 'GET',
    data: {
      'userId':id,
    },
    sCallBack: function (data) {
      that.setData({
        dfkNum:data.data.result[0].commodityNumber,
        bhzNum:data.data.result[1].commodityNumber,
        pszNum:data.data.result[2].commodityNumber,
        dthNum:data.data.result[3].commodityNumber,
        ythNum:data.data.result[4].commodityNumber
      })
    },
    eCallBack: function () {}
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
        addressth:data.data.result.headInfo.province+data.data.result.headInfo.city+data.data.result.headInfo.area+data.data.result.headInfo.street+data.data.result.headInfo.address,
        shopName:data.data.result.headInfo.shopName,
       
        phones:data.data.result.headInfo.phone
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
        myLng:myLng,
        'pageIndex':1,
        'pageSize':1,
      },
      sCallBack: function (data) {
        var list= data.data.result.datas;
        if(list.length==0){
          that.default()
           
        }
        that.setData({
         shopName:list[0].shopName,
         phones:list[0].phone,
        
         addressth:list[0].province+list[0].city+list[0].area+list[0].street+list[0].address
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