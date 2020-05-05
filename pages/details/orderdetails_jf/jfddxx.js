// pages/details/orderdetails_jf/jfddxx.js
import { Base } from "../../../utils/request/base.js";
var app = getApp();
var base = new Base();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that=this
    var phone=wx.getStorageSync('phone')
    that.setData({
      phone:phone,
      list:JSON.parse(options.list)
    })
    console.log(that.data.list)
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
    var that=this
      that.list()//团长地址
      var aa=wx.getStorageSync('aa')
      if(aa=='0'){
        that.query()//查询用户切换店铺
      }else {
        return
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
          // defaultztd:data.data.result,
          shopName:data.data.result.headInfo.shopName,
          ztdid2:data.data.result.headInfo.id,
          phones:data.data.result.headInfo.phone,
          addressth:data.data.result.headInfo.address
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
    // 提交订单
    orderMessage(){
      var that = this;
      
      var userId=wx.getStorageSync('userId')
      var arg={
       'resourceType':4,
        'userInfo':{
          'id':userId
        },
        'integralProductInfo':{
          'id':that.data.list.id
        },
        'commodityNumbers':1,
        "headInfo":{
          "id":that.data.ztdid2//自提点id
        }
      }
      console.log(JSON.stringify(arg))
      var params = {
        url: '/app/order/addIntegralOrderInfo',
        method: 'POST',
         
        data: JSON.stringify(arg),
        sCallBack: function (data) {
          console.log(data)
          if(data.data.errorCode=="0"){
            wx.showToast({
              title: data.data.result,
              icon:'none'
            })
          }else{
            wx.showToast({
              title: data.data.errorMsg,
              icon:'none'
            })
          }
         
         
          
        },
        eCallBack: function () {
        }
      }
      base.request(params);
    },
})