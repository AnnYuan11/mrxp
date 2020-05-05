// pages/details/Goodsdetails/details.js
import { Base } from "../../../utils/request/base.js";
var WxParse = require('../../../utils/wxParse/wxParse.js');
var util = require('../../../utils/util.js');
const { $Message } = require('../../../dist/base/index');
var app = getApp();
var base = new Base();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
    currentTab: 0,
    indicatorDots: false,
    vertical: false,
    autoplay: false,
    duration: 500,
    ishow:false,
    maskHidden: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options)
    console.log(app.globalData.personal)
    that.setData({
      id:options.id,
      isBuy:options.isBuy,
      personal:app.globalData.personal
    })
    that.shop();//商品内容
    that.buyRecord()//购买记录
    that.fanNum()//修改粉丝数
    that.list()//团长地址
    that.gwzn()//购物指南
  },
  // 获取日期
  getDateStr: function(today, addDayCount) {
    var date;
    var that=this;
    if(today) {
      date = new Date(today);
    }else{
      date = new Date();
    }
    date.setDate(date.getDate() + addDayCount);//获取AddDayCount天后的日期 
      var y = date.getFullYear();
      var m = date.getMonth() + 1;//获取当前月份的日期 
      var d = date.getDate();
      if(m < 10){
        m = '0' + m;
      };
      if(d < 10) {
        d = '0' + d;
      };
      var tomorow=m + "月" + d+"日";
      that.setData({
        tomorow:tomorow
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
    var that = this;
    var aa = wx.getStorageSync('aa')
    console.log(aa)
    if (aa == '0') {
      that.query()//查询用户切换店铺
    } else {
      return
    }
    this.setData({
      ishow:false
    })
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
  onShareAppMessage: function (res) {

  },
  // 详情切换
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
  // 商品内容
  shop(){
    var that = this;
    var params = {
      url: '/app/commodity/findCommodityInfo',
      method: 'GET',
      data: {
        'id':that.data.id, 
      },
      sCallBack: function (data) {
        if(data.data.result.sendType==1){
          data.data.result.sendType="到店自提"
        }else{
          data.data.result.sendType="快递到家"
        }
        if(data.data.result.pickDate==1){
          that.getDateStr(null,0)
          var date=that.data.tomorow
          data.data.result.pickDate=date
        }else if(data.data.result.pickDate==2){
          that.getDateStr(null,1)
          var tomorow=that.data.tomorow
          data.data.result.pickDate=tomorow
        }else{
          that.getDateStr(null,2)
          var ht=that.data.tomorow
          data.data.result.pickDate=ht
        }
        var artice = data.data.result.productInfo.content;
        WxParse.wxParse('artice', 'html', artice, that, 5);
        that.setData({
          list:data.data.result,
          background:JSON.parse(data.data.result.bannerPhotoView)
        })
        
      },
      eCallBack: function () {
      }
    }
    base.request(params);
  },
  // 立即购买
  buyNow(){
    var session=wx.getStorageSync("session")
    console.log(session)
    var that=this;
    if(session==''){
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }else{
      var ddid = that.data.list.id;
      var ddpic = that.data.list.productInfo.photo;
      var ddname = that.data.list.productInfo.commodityName;
      var ddjg = that.data.list.price;
      var sendType =that.data.list.sendType;
      wx.navigateTo({
        url: '/pages/details/order_details/order_details?ddid='+ddid+'&ddname='+ddname+'&ddpic='+ddpic+'&ddjg='+ddjg+'&sendType='+sendType+'&commodityNumber=1',
      })
    }
   
    
  },
  // 首页
  toIndex(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
// 跳转到购物车
toGwc(){
  wx.switchTab({
    url: '/pages/gwc/gwc',
  })
},
// 加入购物车
joinGwc(e){
  var that=this;
  console.log(e)
  var userId = wx.getStorageSync('userId')
  var spid=e.currentTarget.dataset.spid;
  var sendtype=e.currentTarget.dataset.sendtype
  if(sendtype=="到店自提"){
    sendtype=1
  }else{
    sendtype=2
  }
  var params = {
    url: '/app/commodity/addShoppingCartInfo',
    method: 'POST',
    data: {
     'commodityInfo':{
       'id':spid
     },
     'commodityNumber':'1',
     'shoppingCarType':sendtype,
     'userInfo':{
       'id':userId
     },
      "headInfo": {
        "id": that.data.ztdid//自提点id
      }
    },
    sCallBack: function (data) {
      if(data.data.errorCode=='0'){
        wx.showToast({
          title: data.data.result,
        })
        app.getShopNum()
      } else {
        wx.showToast({
          title: data.data.result,
        })
      }
      
    },
    eCallBack: function () {
    }
  }
  base.request(params);
},
// 购买记录
buyRecord(e){
  var that=this;
  var params = {
    url: '/app/commodity/findCommodityInfoOrderRecord',
    method: 'GET',
    data: {
     id:that.data.id
    },
    sCallBack: function (data) {
      if(data.data.errorCode=='0'){
        that.setData({
          RecordList:data.data.result
        })
      } 
      
    },
    eCallBack: function () {
    }
  }
  base.request(params);
},
// 修改粉丝数
fanNum(){
  var that=this;
  var userId = wx.getStorageSync('userId')
  var params = {
    url: '/app/commodity/addCommodityInfoFan',
    method: 'POST',
    data: {
      'commodityInfo':{
        'id':that.data.id
      },
      'userInfo':{
        'id':userId
      }
    },
    sCallBack: function (data) {
      
      
    },
    eCallBack: function () {
    }
  }
  base.request(params);
},
// 分享
handleOpen1 () {
  this.setData({
      ishow: true
  });
},
// 取消
handleCancel () {
  this.setData({
      ishow: false
  });
},
// 生成海报
handleClickItem1 () {
  var that = this;
  this.setData({
    maskHidden: false
  });
  wx.showToast({
    title: '海报生成中...',
    icon: 'loading',
    duration: 1000
  });
  setTimeout(function () {
    wx.hideToast()
    // that.ewm()
    that.eventDraw();
    that.setData({
      maskHidden: true,
      ishow:false
    });
  }, 1000)
},
eventDraw () {
  var that=this;
  var path = that.data.imgUrl+that.data.background[0];
  wx.showLoading({
    title: '绘制分享图片中',
    mask: true
  })
  this.setData({
    painting: {
      width: 375,
      height: 555,
      clear: true,
      views: [
        {
          type: 'rect',
          background:'#fff',
          top: 0,
          left: 0,
          width: 375,
          height: 565
        },
        {
          type: 'image',
          url: that.data.imgUrl+'img/public/logoo.png',
          top: 27.5,
          left: 29,
          width: 300,
          height: 57
        },
        {
          type: 'image',
          url: path,
          top: 90,
          left: 38,
          width: 300,
          height: 300
        },
        {
          type: 'image',
          url: 'https://www.zgmrxp.com/app/getUserIdWxCommodityQr?commodityId='+that.data.id,
          top: 470,
          left: 50,
          width: 70,
          height: 70
        },
        {
          type: 'text',
          content: that.data.list.productInfo.commodityName,
          fontSize: 16,
          lineHeight: 21,
          color: '#383549',
          textAlign: 'left',
          top: 400,
          left: 44,
          width: 287,
          MaxLineNumber: 2,
          breakWord: true,
          bolder: true
        },
        {
          type: 'text',
          content: '￥'+that.data.list.price,
          fontSize: 19,
          color: '#E62004',
          textAlign: 'left',
          top: 445,
          left: 44.5,
          bolder: true
        },
        {
          type: 'text',
          content: '￥'+that.data.list.crossedPrice,
          fontSize: 13,
          color: '#7E7E8B',
          textAlign: 'left',
          top: 450,
          left: 115,
          textDecoration: 'line-through'
        },
        {
          type: 'text',
          content: '预约时间：' + that.data.list.startTime.substring(5, 7) + '月' + that.data.list.startTime.substring(8, 10) + '日',
          fontSize: 13,
          color: '#7E7E8B',
          textAlign: 'left',
          top: 450,
          left: 175
        },
        {
          type: 'text',
          content: '长按识别图中二维码',
          fontSize: 14,
          color: '#383549',
          textAlign: 'left',
          top: 500,
          left: 165.5,
          lineHeight: 20,
          MaxLineNumber: 2,
          breakWord: true,
          width: 125
        },
        {
          type: 'text',
          content: that.data.shopName,
          fontSize: 16,
          color: '#232323',
          textAlign: 'left',
          top: 480,
          left: 165.5,
          lineHeight: 20,
          MaxLineNumber: 2,
          breakWord: true,
          width: 125
        }
      ]
    }
  })
},
eventGetImage (event) {
  console.log(event)
  wx.hideLoading()
  const { tempFilePath, errMsg } = event.detail
  if (errMsg === 'canvasdrawer:ok') {
    this.setData({
      shareImage: tempFilePath
    })
  }
},
// 保存图片
eventSave () {
  wx.saveImageToPhotosAlbum({
    filePath: this.data.shareImage,
    success (res) {
      wx.showToast({
        title: '保存图片成功',
        icon: 'success',
        duration: 2000
      })
    }
})
},
// 关闭图片
close(){
  var that=this;
  that.setData({
    maskHidden:false
  })
},
// 获取当前店铺

  query() {
    console.log('调用了自提')
    var that = this;
    var userId = wx.getStorageSync('userId')
    var params = {
      url: '/app/user/findUserHeadInfo',
      method: 'POST',
      data: {
        userInfo: { 'id': userId }
      },
      sCallBack: function (data) {
        console.log(data.data.result)
        that.setData({
          shopName: data.data.result.headInfo.shopName,
          ztdid: data.data.result.headInfo.id
        })

      },
      eCallBack: function () {
      }
    }
    base.request(params);
  },
  // 团长地址
  list() {
    console.log('调用了团长')
    var that = this;
    var myLat = wx.getStorageSync('latitude');
    var myLng = wx.getStorageSync('longitude');
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
        var list = data.data.result.datas;
        if (list.length == 0) {
          that.default()
        }
        that.setData({
          shopName: list[0].shopName,
          ztdid: list[0].id
        })

      },
      eCallBack: function () {
      }
    }
    base.request(params);
  },
  // 默认自提点
  default() {
    var that = this;
    var params = {
      url: '/app/head/findHeadInfoProperty',
      method: 'GET',
      data: {

      },
      sCallBack: function (data) {
        var list = data.data.result;
        that.setData({
          shopName: list.shopName,
          ztdid: list.id
        })

      },
      eCallBack: function () {
      }
    }
    base.request(params);
  },
  // 购物指南
  gwzn(){
    var that=this;
    var params = {
      url: '/app/commodity/findShoppingGuide',
      method: 'GET',
      data: {

      },
      sCallBack: function (data) {
        console.log(data)
       that.setData({
         gwzns:data.data.result.photo
       })
       
      },
      eCallBack: function () {
      }
    }
    base.request(params);
  }
})