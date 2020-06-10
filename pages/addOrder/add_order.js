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
    imgUrls: app.globalData.imgUrls,
    productInfo: {},
    yhqmoney: '选择优惠券',
    payTypes: 2,//默认微信支付
    yhje: 0,
    dzid: '', // 快递地址id
    ztdid: '', // 自提地址id
    couponsId: '',
    addressId: '',
    topay:false,
    isbut:true
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
        var headInfo=wx.getStorageSync('headInfo') 
        var addressth= headInfo.province+headInfo.city+headInfo.area+headInfo.street+headInfo.address
          that.setData({
            shopName:headInfo.shopName,
            ztdid:headInfo.id,
            phones:headInfo.phone,
            addressth:addressth,
          })
          that.orderMoney()
        // if (that.data.productInfo.sendType == 1) {
          // that.checkAddress()
          //查询用户是否切换店铺
          // var isCheck = wx.getStorageSync('aa')
          // if (isCheck == '0') {
          //   that.checkAddress()
          // } else{
          //   that.findShopAdress()
          // }
        // } else if (that.data.productInfo.sendType == 2) {
          let dzid = wx.getStorageSync('dzid')
          that.setData({
            dzid: dzid ? dzid : ""
          })
          // that.defaultDz()
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
        const result = data.data.result.datas
        console.log(result.length)
        if (result.length == 0) {
          debugger
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
        if(data.data.errorCode=='0'){
          if (data.data.result.fullReductionInfo.fullMoney == '') {
            data.data.result.fullReductionInfo.fullMoney = 0
          }
          that.setData({
            money: data.data.result,
            yhje: data.data.result.fullReductionInfo.name
          })
        }else{
          wx.showToast({
            title: data.data.errorMsg,
            icon:'none',
            duration:2000,
            success: function () {
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                  })
              }, 2000);
  
            }
          })
        }
        

      },
      eCallBack: function () {
        console.log(data.errorMsg)
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
    if(that.data.couponsId==undefined){
      that.data.couponsId=''
    }
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
    var that = this;
    if(that.data.isbut==false){
      wx.showToast({
        title: '亲！请不要频繁点击哦~',
        icon:'none'
      })
      return
    }
    that.setData({
      isbut:false
    })
    wx.showLoading({
      title:'加载中',                             
      mask:true                                    
    })
    setTimeout(function(){ 
      that.setData({
        isbut:true
      })
    },5000)
    that.getParams()
    setTimeout(function(){
      wx.hideLoading({
        complete: (res) => {
          console.log(that.data.params)
          const params = {
            url: '/app/order/addCommodityOrderInfo',
            method: 'POST',
            data: JSON.stringify(that.data.params),
            sCallBack: function (data) {
              that.setData({
                message: data.data.result
              })
              if(data.data.errorCode=='0'){
                if(that.data.productInfo.sendType=="1"){
                  that.setData({
                    topay:true
                  })
                }else{
                  wx.navigateTo({
                    url: '/pages/details/topay/topay',
                  })
                }
               
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
      },500)
   
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
  },
  //  取消付款
cancel(){
  var that=this;
  that.setData({
    topay:false
  })
},
// 去付款
Tofk(){
  var that=this;
  wx.navigateTo({
    url: '/pages/details/topay/topay',
  })
  that.setData({
    topay:false//订单信息
  })
},

})