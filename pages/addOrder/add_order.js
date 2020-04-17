// pages/details/order_details/order_details.js
import { Base } from "../../utils/request/base.js";
var app = getApp();
var base = new Base();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
    productInfo: {},
    yhqmoney:'选择优惠券',
    payTypes:2,//默认微信支付
    yhje:0
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    wx.getStorage({
      key: 'productInfo',
      success(res) {
        that.setData({
          productInfo: res.data
        })
        if (that.data.productInfo.sendType == 1) {
          that.findShopAdress()
          //查询用户是否切换店铺
          var isCheck = wx.getStorageSync('aa')
          if (isCheck == '0') {
            that.checkAddress()
          } else {
            return
          }
        }
      }
    })
  },
  /**
   * 根据经纬度查询店铺信息
   */
  findShopAdress() {
    var that = this;
    var myLat = wx.getStorageSync('latitude');
    var myLng = wx.getStorageSync('longitude');
    console.log(myLat)
    var params = {
      url: '/app/head/findAllHeadInfoByDistance',
      method: 'POST',
      data: {
        myLat: myLat,
        myLng: myLng
      },
      sCallBack: function (data) {
        console.log(data.data.result.length)
        const result = data.data.result
        if (result.length == 0) {
          that.defaultAddress()
        } else {
          that.setData({
            shopName: result[0].shopName,
            phones: result[0].phone,
            ztdid2: result[0].id,
            addressth: result[0].address
          })
        }
      },
      eCallBack: function () {
      }
    }
    base.request(params);
  },
  /**
   * 获取默认自提点
   */
  defaultAddress() {
    var that = this;
    var params = {
      url: '/app/head/findHeadInfoProperty',
      method: 'GET',
      data: {},
      sCallBack: function (data) {
        var list = data.data.result;
        that.setData({
          shopName: list.shopName,
          phones: list.phone,
          ztdid2: list.id,
          addressth: list.address
        })

      },
      eCallBack: function () {
      }
    }
    base.request(params);
  },
  /**
   * 获取切换后的自提点
   */
  checkAddress(){
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
          shopName:data.data.result.headInfo.shopName,
          ztdid:data.data.result.headInfo.id
        })
      },
      eCallBack: function () {
      }
    }
    base.request(params);
  },
  /**
   * 选择优惠券
   */
  selectCoupons(){
   wx.redirectTo({
     url:'/pages/details/wdyhq/wdyhq?type=shopSubmit'
   })
  },
})