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
    app.refresh()
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
// 生成二维码
ewm(){
  var that=this;
  var params = {
    url: '/app/getUserIdWxCommodityQr',
    method: 'GET',
    data: {
      'commodityId':that.data.id
    },
    sCallBack: function (data) {
      console.log(data)
      
    },
    eCallBack: function () {
    }
  }
  base.request(params);
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
          type: 'image',
          url: 'https://hybrid.xiaoying.tv/miniprogram/viva-ad/1/1531103986231.jpeg',
          top: 0,
          left: 0,
          width: 375,
          height: 555
        },
        {
          type: 'image',
          url: that.data.personal.photo,
          top: 27.5,
          left: 29,
          width: 55,
          height: 55
        },
        {
          type: 'image',
          url: 'https://hybrid.xiaoying.tv/miniprogram/viva-ad/1/1531401349117.jpeg',
          top: 27.5,
          left: 29,
          width: 55,
          height: 55
        },
        {
          type: 'text',
          content: '您的好友【'+that.data.personal.wxNickName+'】',
          fontSize: 16,
          color: '#402D16',
          textAlign: 'left',
          top: 33,
          left: 96,
          bolder: true
        },
        {
          type: 'text',
          content: '发现一件好货，邀请你一起0元免费拿！',
          fontSize: 15,
          color: '#563D20',
          textAlign: 'left',
          top: 59.5,
          left: 96
        },
        {
          type: 'image',
          url: path,
          top: 136,
          left: 42.5,
          width: 290,
          height: 186
        },
        {
          type: 'image',
          url: 'https://www.sxsswlkj.com/app/getUserIdWxCommodityQr?commodityId='+that.data.id,
          top: 420,
          left: 50,
          width: 100,
          height: 100
        },
        {
          type: 'text',
          content: that.data.list.productInfo.commodityName,
          fontSize: 16,
          lineHeight: 21,
          color: '#383549',
          textAlign: 'left',
          top: 336,
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
          top: 387,
          left: 44.5,
          bolder: true
        },
        {
          type: 'text',
          content: '原价:￥'+that.data.list.crossedPrice,
          fontSize: 13,
          color: '#7E7E8B',
          textAlign: 'left',
          top: 391,
          left: 130,
          textDecoration: 'line-through'
        },
        {
          type: 'text',
          content: '长按识别图中二维码',
          fontSize: 14,
          color: '#383549',
          textAlign: 'left',
          top: 460,
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
})