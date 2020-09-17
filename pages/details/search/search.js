// pages/details/search/search.js
import { Base } from "../../../utils/request/base.js";
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
    // var aa = wx.getStorageSync('aa')
    // if (aa == '0') {
    //   that.query() //查询用户切换店铺
    // } else {
    //   that.list() //团长地址
    // }
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
  sousuo(e){
    this.setData({
      className:e.detail.value
    })
    // console.log(e.detail.value)
  },
  // 搜索
  search: function (e) {
    console.log(e)
    var that = this;
    var headInfo = wx.getStorageSync('headInfo')
    var className =that.data.className
    var that = this;
    var params = {
      url: '/app/commodity/listCommodityInfo',
      method: 'POST',
      data: {
        'name': className,
        'pageIndex': 1,
        'pageSize': 1000,
        'franchiseeId':headInfo.franchiseeInfo.id
      },
      sCallBack: function (data) {
        var listToday = data.data.result.datas
        
        if (listToday != '') {
          listToday.forEach((item, index) => {
            item.startTime2 = item.startTime.substring(5, 7) + '月' +  item.startTime.substring(8, 10) + '日'+ item.startTime.substring(10, 19)
            item.startTime = item.startTime.substring(5, 7) + '月' + item.startTime.substring(8, 10) + '日'
            item.pickDateTime = item.pickDateTime.substring(5, 7) + '月' + item.pickDateTime.substring(8, 10) + '日'

            if (item.sendType == 1) {
              item.sendType = "到店自提"
            } else {
              item.sendType = "快递到家"
            }
            if (item.pickDate == 1) {
              that.getDateStr(null, 0)
              item.pickDate = that.data.tomorow
            } else if (item.pickDate == 2) {
              that.getDateStr(null, 1)
              var tomorow = that.data.tomorow
              item.pickDate = tomorow
            } else {
              that.getDateStr(null, 2)
              var ht = that.data.tomorow
              item.pickDate = ht
            }
            if (item.isBuy == 2) {
              item.isBuy = "提前加入购物车"
            } else if(item.isBuy == 1) {
              item.isBuy = "加入购物车"
            }
            else if (item.isBuy == 3) {
              item.isBuy = "活动已结束"
            } else if (item.isBuy == 4) {
              item.isBuy = "已售罄"
            }

          })
        }
        that.setData({
          listToday: listToday,
          currentPage: 10000
        })

      },
      eCallBack: function () {}
    }
    base.request(params);
  },
   // 获取日期
   getDateStr: function (today, addDayCount) {
    var date;
    var that = this;
    if (today) {
      date = new Date(today);
    } else {
      date = new Date();
    }
    date.setDate(date.getDate() + addDayCount); //获取AddDayCount天后的日期 
    var y = date.getFullYear();
    var m = date.getMonth() + 1; //获取当前月份的日期 
    var d = date.getDate();

    if (m < 10) {
      m = '0' + m;
    };
    if (d < 10) {
      d = '0' + d;
    };
    var tomorow = m + "月" + d + "日";
    that.setData({
      tomorow: tomorow,
    })
  },
   // 加入购物车
   joinGwc(e) {
    var that = this;
    var session = wx.getStorageSync('session')
    var userId = wx.getStorageSync('userId')
    var headInfo = wx.getStorageSync('headInfo')
    // if (session == '') {
    //   wx.navigateTo({
    //     url: '/pages/login/login',
    //   })
    // } else {
      var spid = e.currentTarget.dataset.spid;
      var sendtype = e.currentTarget.dataset.sendtype
      if (sendtype == "到店自提") {
        sendtype = 1
      } else {
        sendtype = 2
      }
      var params = {
        url: '/app/commodity/addShoppingCartInfo',
        method: 'POST',
        data: {
          'commodityInfo': {
            'id': spid
          },
          'commodityNumber': '1',
          'shoppingCarType': sendtype,
          'userInfo': {
            'id': userId
          },
          "headInfo": {
            "id": headInfo.id //自提点id
          }

        },
        sCallBack: function (data) {
          if (data.data.errorCode == '0') {
            wx.showToast({
              title: data.data.result,
            })
            app.getShopNum()
          } else if (data.data.errorCode == '-200') {
            wx.showToast({
              title: data.errorMsg,
              icon: 'none',
              duration: 2000,
              success: function () {
                setTimeout(function () {
                  wx.navigateTo({
                    url: '/pages/login/login',
                  })
                }, 2000);
              }
            })
          } else {
            wx.showToast({
              title: data.data.result,
            })
          }

        },
        eCallBack: function () {}
      }
      base.request(params);
    // }

  },
 
})