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
    yhqmoney: '选择优惠券',
    payTypes: 2,//默认微信支付
    yhje: 0,
    dzid: '', // 快递地址id
    ztdid: '', // 自提地址id
    couponsId: '',
    addressId: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let userId = wx.getStorageSync('userId')
    var phone=wx.getStorageSync('phone')
    that.setData({
      couponsId: options.couponsId,
      yhqmoney: options.yhqmoney,
      userId: userId,
      phone:phone
    })

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
        console.log(that.data.productInfo)
        // if (that.data.productInfo.sendType == 1) {
          that.findShopAdress()
          //查询用户是否切换店铺
          var isCheck = wx.getStorageSync('aa')
          if (isCheck == '0') {
            that.checkAddress()
          } 
        // } else if (that.data.productInfo.sendType == 2) {
          let dzid = wx.getStorageSync('dzid')
          that.setData({
            dzid: dzid ? dzid : ""
          })
          that.defaultDz()
        // }
      }
    })
  },
   /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
      // wx.removeStorage({
      //   key: 'dzid',
      //   success(res) {
      //     // console.log(res)
      //   }
      // })
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
        myLng: myLng,
      'pageIndex':1,
      'pageSize':1,
      },
      sCallBack: function (data) {
        console.log(data.data.result.length)
        const result = data.data.result.datas
        if (result.length == 0) {
          that.defaultAddress()
        } else {
          that.setData({
            shopName: result[0].shopName,
            phones: result[0].phone,
            ztdid2: result[0].id,
            addressth: result[0].address
          })
          that.orderMoney()
        }
      },
      eCallBack: function () {
      }
    }
    base.request(params);
  },
  delItem(id) {
    let that = this
    var productInfo=that.data.productInfo.productList
    const ids = [];
    console.log(productInfo)
    productInfo.forEach(res=>{
      ids.push(res.ids)
    })
    console.log(ids)
    var params = {
      url: '/app/commodity/deleteShoppingCartInfo',
      method: 'POST',
      data: {
        'ids': ids,
      },
      sCallBack: function (data) {
        if (data.data.errorCode == 0) {
          // wx.showToast({
          //   title: data.data.result
          // })

          app.getShopNum()
        } else {
          // wx.showToast({
          //   title: data.data.errorMsg
          // })
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
        that.orderMoney()
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
    const that = this;
    const userId = wx.getStorageSync('userId')
    const params = {
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
          ztdid:data.data.result.headInfo.id,
          phones:data.data.result.headInfo.phone
        })
        that.orderMoney()
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
    wx.navigateTo({
     url:'/pages/details/wdyhq/wdyhq?type=shopSubmit'
   })
  },
  /**
   * 订单金额查询
   */
  orderMoney() {
    const that = this;
    that.getParams()
    let params = {
      url: '/app/order/findOrderTotalMoney',
      method: 'POST',
      data: JSON.stringify(that.data.params),
      sCallBack: function (data) {
        if (data.data.result.fullReductionInfo.fullMoney == '') {
          data.data.result.fullReductionInfo.fullMoney = 0
        }
        that.setData({
          money: data.data.result,
          yhje: data.data.result.fullReductionInfo.fullMoney
        })

      },
      eCallBack: function () {
      }
    }
    base.request(params);
  },
  /**
   * 封装获取参数的函数(订单金额查询/订单提交)
   */
  getParams() {
    const that = this;
    const commoditySubOrderInfoList = []
    let orderList = that.data.productInfo.productList
    orderList.forEach((item, i) => {
      const order = {
        "commodityNumber": item.number,
        "commodityInfo": {
          id: item.id
        }
      }
      commoditySubOrderInfoList.push(order)
    })
    that.setData({
      "params": {
        "commoditySubOrderInfoList": commoditySubOrderInfoList,
        "orderType": "1", // 订单类型
        "userInfo": {
          "id": that.data.userId//用户id
        },
        "userAddressInfo": {
          "id": that.data.dzid//地址id
        },
        "userCouponInfo": {
          "id": that.data.couponsId//优惠券id
        },
        "orderSendType": that.data.productInfo.sendType,//配送方式
        "headInfo": {
          "id": that.data.ztdid ? that.data.ztdid : that.data.ztdid2//自提点id
        }
      }
    })
  },
  /**
   * 订单提交
   */
  orderSubmit() {
    const that = this;
    that.getParams()
    const params = {
      url: '/app/order/addCommodityOrderInfo',
      method: 'POST',
      data: JSON.stringify(that.data.params),
      sCallBack: function (data) {
        that.setData({
          message: data.data.result
        })
        if (that.data.payTypes == '2') {
          that.pay()
        } else {
          that.payYe(that.data.message.orderNumber)
        }

      },
      eCallBack: function () {
      }
    }
    base.request(params);
  },
  /**
   * 选择支付方式
   */
  radioChange: function (e) {
    var that = this;
    that.setData({
      payTypes: e.detail.value
    })
  },
  
  /**
   * 微信支付
   */
  pay() {
    var that = this;
    var openId = wx.getStorageSync('openId')
    var arg = {
      id: that.data.message.id,
      name: that.data.message.commoditySubOrderInfoList[0].commodityInfo.productInfo.commodityName,
      payType: 2,
      type: '1',
      openId: openId
    }
    var params = {
      url: '/app/payment/getOrderStr',
      method: 'POST',
      data: arg,
      sCallBack: function (data) {
        wx.requestPayment({
          appId: 'wx806b47b81b69c8bd',
          timeStamp: data.data.result['timeStamp'],
          nonceStr: data.data.result['nonceStr'],
          package: data.data.result['packageValue'],
          signType: 'MD5',
          paySign: data.data.result['paySign'],
          'success': function (res) {
            // that.delItem()
            wx.showToast({
              title: '已支付成功！',
              icon: 'none',
              duration: 3000,
              success: function () {
                setTimeout(function () {
                  wx.redirectTo({
                    url: '/pages/details/order_list/order_list',
                  })
                }, 3000);

              }
            })
          },
          fail: function (e) {
            console.log(e)
          }
        })
      },
      eCallBack: function () {
      }
    }
    base.request(params);
  },
  /**
   * 余额支付
   */
  payYe(orderNumber) {
    var that = this;
    var arg = {
      'userInfo': {
        'id': that.data.userId,
      },
      'orderNumber': orderNumber
    }
    var params = {
      url: '/app/order/updateCommodityOrderInfoPaymentStatusYe',
      method: 'POST',
      data: JSON.stringify(arg),
      sCallBack: function (data) {
        if (data.data.errorCode == '-1') {
          wx.showToast({
            title: data.data.errorMsg,
            icon: 'none'
          })
        }else if (data.data.errorCode == '-200') {
          wx.showToast({
            title: data.data.errorMsg,
            icon: 'none'
          })
        }
        else{
          // that.delItem()
          wx.showToast({
            title: data.data.result,
            icon: 'none',
            success: function () {
              setTimeout(function () {
                wx.redirectTo({
                  url: '/pages/details/order_list/order_list',
                })
              }, 2000);

            }
          })
        }

      },
      eCallBack: function () {
      }
    }
    base.request(params);

  },
  /**
   * 查询用户默认的快递地址
   */
  defaultDz() {
    var that = this;
    // if(that.data.options.dzid==undefined){
    //   that.data.options.dzid=''
    // }
    var arg = {
      "id": that.data.dzid,
      "userInfo": {
        "id": that.data.userId
      },
    }
    var params = {
      url: '/app/user/findUserAddressInfoIsDefault',
      method: 'POST',

      data: JSON.stringify(arg),
      sCallBack: function (data) {
        that.setData({
          mrdz: data.data.result,
          dzid: data.data.result.id
        })
        that.orderMoney()//查询订单金额
      },
      eCallBack: function () {
      }
    }
    base.request(params);
  },
  /**
   * 选择快递已地址
   */
  selectDz() {
    wx.redirectTo({
      url: '/pages/details/address_list/addressList?type=shopSubmit'
    })
  }
})